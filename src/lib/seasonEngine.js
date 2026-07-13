// Season Engine - Headless game simulation + canonical GameResult extraction
// Uses the ONE true engine (gameEngine.js) for all simulation, user and CPU.
// Tracks scoring events and hit types during headless sim for accurate W/L/S decisions.

import { TEAMS } from './gameData';
import {
  createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing,
  cpuDecideSubstitutions, cpuDecideSteal, getCurrentBatter, getCurrentPitcher,
} from './gameEngine';
import { playerId, isPitcherAvailable, getStarterFatigueStatus } from './seasonStore';
import { validateGameBoxScore } from './boxScoreValidators';
import { rollBatterInjury, rollHBPIfBatter } from './batterInjuries';
import { patchLineupForAvailability } from './playerAvailability';

/**
 * Simulate a complete game headlessly (CPU vs CPU).
 * Instruments the sim to track scoring events, hit types, and HR data
 * for accurate W/L/S decisions and complete stat extraction.
 * @returns {object} Final game state (with _tracking data attached)
 */
export function simulateGameHeadless(homeTeam, awayTeam, options = {}) {
  const { useDH = false, weather = null, umpire = null, homeLineup = null, awayLineup = null, homeSP = null, awaySP = null, unavailableRelievers = null, scratchedPlayers = null } = options;

  let state = createGameState(homeTeam, awayTeam, homeLineup, awayLineup, useDH, weather, umpire, homeSP, awaySP, scratchedPlayers);
  state._headlessMode = true;
  state.homeStartingPitcherName = homeSP?.name || null;
  state.awayStartingPitcherName = awaySP?.name || null;

  // Season injury persistence: scratched (injured) players are unavailable for
  // the entire game. Filter them from both bullpens so no substitution system
  // can select them, and set state.scratchedPlayers so bench access points
  // (cpuCheckPinchHit, cpuDecideSubstitutions, batterInjuryCheck) exclude them.
  if (scratchedPlayers && scratchedPlayers.length > 0) {
    state.scratchedPlayers = [...scratchedPlayers];
    state.homeBullpen = state.homeBullpen.filter(p => !scratchedPlayers.includes(p.name));
    state.awayBullpen = state.awayBullpen.filter(p => !scratchedPlayers.includes(p.name));
    // PREGAME VALIDATION: replace any scratched/suspended players in the
    // starting lineup with available bench players. This is the final gate
    // that guarantees no unavailable player can appear in a game.
    state.homeLineup = patchLineupForAvailability(state.homeLineup, TEAMS[homeTeam].bench, scratchedPlayers);
    state.awayLineup = patchLineupForAvailability(state.awayLineup, TEAMS[awayTeam].bench, scratchedPlayers);
  }

  // Annotate ALL bullpen arms with season availability + tier + fatigue penalty.
  // This is the ONE place that sets _seasonAvailable: true for legal arms and
  // false for unavailable arms. The hard gate in selectCpuReliever filters on
  // this flag. Tiers (AVAILABLE/SLIGHTLY_TIRED/TIRED/VERY_TIRED) are legal but
  // ranked by freshness so the CPU prefers rested arms.
  if (options.rotationState && options.gameDate) {
    const annotate = (bullpen, teamKey) => {
      bullpen.forEach(p => {
        const avail = isPitcherAvailable(options.rotationState, teamKey, p.name, options.gameDate);
        p._seasonAvailable = avail.available;
        p._seasonEmergencyOnly = avail.emergencyOnly || false;
        p._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
        p._seasonTier = avail.tier || 'AVAILABLE';
      });
    };
    annotate(state.homeBullpen, homeTeam);
    annotate(state.awayBullpen, awayTeam);

    // Annotate rotation starters (not today's SP) as emergency relief options.
    // Used by selectStarterRelief when all bullpen arms are EMERGENCY_ONLY or
    // HARD_UNAVAILABLE - a starter on full rest is a better emergency option
    // than burning a 3-straight-day reliever.
    const annotateEmergencyStarters = (teamKey, side) => {
      const rotation = TEAMS[teamKey]?.rotation || [];
      const currentSP = side === 'home' ? state.homePitcher : state.awayPitcher;
      const starters = rotation
        .filter(p => p.name !== currentSP?.name)
        .map(p => {
          const avail = isPitcherAvailable(options.rotationState, teamKey, p.name, options.gameDate);
          return { ...p, _seasonAvailable: avail.available, _seasonEmergencyOnly: avail.emergencyOnly || false, _seasonFatiguePenalty: avail.tired ? avail.fatiguePenalty : 0, _seasonTier: avail.tier || 'AVAILABLE', _isEmergencyStarter: true };
        });
      if (side === 'home') state.homeEmergencyStarters = starters;
      else state.awayEmergencyStarters = starters;
    };
    annotateEmergencyStarters(homeTeam, 'home');
    annotateEmergencyStarters(awayTeam, 'away');

    // Annotate starting pitchers with season-rest fatigue (3+ days rest = fresh,
    // 2 = short rest). Flows into _seasonFatiguePenalty so getEffectivePitcher
    // applies a small control/speed/offSpeed penalty.
    const annotateStarter = (pitcher, teamKey) => {
      if (!pitcher) return;
      const isRotationSP = (TEAMS[teamKey]?.rotation || []).some(p => p.name === pitcher.name);
      if (isRotationSP) {
        const status = getStarterFatigueStatus(options.rotationState, teamKey, pitcher.name, options.gameDate);
        pitcher._seasonFatiguePenalty = status.penalty;
      } else {
        // Bullpen opener - apply reliever workload fatigue, not starter rest fatigue
        const avail = isPitcherAvailable(options.rotationState, teamKey, pitcher.name, options.gameDate);
        pitcher._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
        pitcher._seasonAvailable = avail.available;
        pitcher._seasonEmergencyOnly = avail.emergencyOnly || false;
        pitcher._seasonTier = avail.tier || 'AVAILABLE';
      }
    };
    annotateStarter(state.homePitcher, homeTeam);
    annotateStarter(state.awayPitcher, awayTeam);
  }

  // Tracking data
  const scoringEvents = []; // { inning, battingSide, pitchingSide, pitcherName, runs }
  const hitTracking = {};   // playerId → { doubles, triples }
  const hrTracking = [];    // { name, teamKey, inning }
  const bfTracking = {};    // pitcherPlayerId → batters faced count
  const hrAllowedTracking = {}; // pitcherPlayerId → HR count
  const injuriesOccurred = []; // { playerName, teamKey, playerPos, source, injuryName }

  const maxIterations = 500;
  let iterations = 0;

  while (!state.gameOver && iterations < maxIterations) {
    iterations++;

    const battingSide = state.halfInning === 'top' ? 'away' : 'home';
    const pitchingSide = battingSide === 'home' ? 'away' : 'home';
    const battingTeamKey = battingSide === 'home' ? state.homeTeam : state.awayTeam;
    const pitchingTeamKey = pitchingSide === 'home' ? state.homeTeam : state.awayTeam;
    const currentPitcher = pitchingSide === 'home' ? state.homePitcher : state.awayPitcher;
    const pitcherPid = playerId(pitchingTeamKey, currentPitcher.name);
    const batter = getCurrentBatter(state);
    const prevBattingScore = state.score[battingSide];

    // Track batters faced
    if (!bfTracking[pitcherPid]) bfTracking[pitcherPid] = 0;
    bfTracking[pitcherPid]++;

    // Session 20 Layer 1b: CPU steal attempts (were never generated before)
    if (state.pendingSteal === null || state.pendingSteal === undefined) {
      const stealBase = cpuDecideSteal(state);
      if (stealBase >= 0) state.pendingSteal = stealBase;
    }
    // Track _runCharges length before the at-bat so we can identify which
    // runs were scored during this at-bat and attribute them to the correct
    // responsible pitcher (the one who put the runner on base), not the
    // current mound pitcher. This fixes inherited-runner W/L misattribution.
    const prevRunChargesLen = state._runCharges?.length || 0;

    // Process at-bat
    state = processAtBat(state, cpuSelectPitch(state), cpuSelectSwing(state));

    // ── Injury roll (headless sim only) ──
    // Roll for batter injuries after each at-bat. Injuries that persist (non-minor)
    // are tracked here and persisted to the Injury entity by the caller after the
    // game. This ensures CPU sim games generate injuries just like played games.
    if (state.lastPlay && batter) {
      const lp = state.lastPlay;
      const isHBP = lp.isHBP === true;
      const NON_SWING_TYPES = ['ball', 'strike'];
      const isWalk = lp.type === 'walk';
      const isSwing = !isHBP && !isWalk && !NON_SWING_TYPES.includes(lp.type);
      if (isHBP || isSwing) {
        let injury = null;
        if (isHBP) {
          if (!state._hbpCounts) state._hbpCounts = {};
          state._hbpCounts[batter.name] = (state._hbpCounts[batter.name] || 0) + 1;
          injury = rollHBPIfBatter(state._hbpCounts[batter.name], false);
        } else {
          injury = rollBatterInjury(false);
        }
        if (injury) {
          injuriesOccurred.push({
            playerName: batter.name,
            teamKey: battingTeamKey,
            playerPos: batter.pos || batter.assignedPos || '?',
            source: isHBP ? 'hbp' : 'swing',
            injuryName: injury.name,
          });
        }
      }
    }
    // Session 14 fix: evaluate BOTH dugouts' managers. With userTeam=null the function
    // resolved cpuSide='home' only, so road starters were never hooked (every road
    // starter threw a complete game). Each call early-returns unless its cpuSide matches
    // the current pitching side, so calling twice covers both half-innings without
    // conflict — the home eval fires in the top, the away eval fires in the bottom.
    state = cpuDecideSubstitutions(state, state.awayTeam);  // evaluates HOME pitcher
    state = cpuDecideSubstitutions(state, state.homeTeam);  // evaluates AWAY pitcher

    // Track scoring — use _runCharges (populated by chargeRun) to attribute
    // each run to the RESPONSIBLE pitcher, not the current mound pitcher.
    // If _runCharges isn't available (edge case), fall back to currentPitcher.
    const runsScored = state.score[battingSide] - prevBattingScore;
    if (runsScored > 0) {
      const newCharges = (state._runCharges || []).slice(prevRunChargesLen);
      if (newCharges.length === runsScored) {
        // One event per run — each with its own responsible pitcher
        for (const charge of newCharges) {
          scoringEvents.push({
            inning: charge.inning,
            battingSide: charge.battingSide,
            pitchingSide: charge.battingSide === 'home' ? 'away' : 'home',
            pitcherName: charge.pitcherName,
            runs: 1,
            scoreAfter: { ...state.score },
          });
        }
      } else {
        // Fallback: at-bat-level event with current pitcher
        scoringEvents.push({
          inning: state.inning,
          battingSide,
          pitchingSide,
          pitcherName: currentPitcher.name,
          runs: runsScored,
          scoreAfter: { ...state.score },
        });
      }
    }

    // Track hit types (doubles/triples not in engine gameStats)
    if (state.lastPlay) {
      const batterPid = playerId(battingTeamKey, batter.name);
      if (!hitTracking[batterPid]) hitTracking[batterPid] = { doubles: 0, triples: 0 };
      const lpType = state.lastPlay.type;
      if (lpType === 'double') hitTracking[batterPid].doubles++;
      else if (lpType === 'triple') hitTracking[batterPid].triples++;
      else if (lpType === 'homerun') {
        hrTracking.push({ name: batter.name, teamKey: battingTeamKey, inning: state.inning });
        if (!hrAllowedTracking[pitcherPid]) hrAllowedTracking[pitcherPid] = 0;
        hrAllowedTracking[pitcherPid]++;
      }
    }
  }

  if (iterations >= maxIterations) {
    console.warn('Game simulation hit iteration limit - forcing end');
    state.gameOver = true;
  }

  // ── HR Log Sanitizer (runs DURING the sim loop AND after) ──
  // Ensure every type:'homerun' log entry has hrDistance and batterName.
  // All HR paths in swingResolver.js set both fields, but this catches any
  // edge-case entries from other sources (ballpark quirks, celebrations, etc.)
  // so the audit never reports missing-field HRs.
  const sanitizeHRs = (logArray) => {
    for (const entry of logArray) {
      if (entry.type !== 'homerun') continue;
      if (entry.hrDistance == null) {
        const distMatch = (entry.text || '').match(/(\d+)\s*feet/);
        entry.hrDistance = distMatch ? parseInt(distMatch[1]) : 400;
        console.warn('[HR-sanitizer] Patched missing hrDistance:', (entry.text || '').substring(0, 60));
      }
      if (entry.batterName == null) {
        // Try multiple patterns to extract batter name from HR text
        const text = entry.text || '';
        const patterns = [
          /💥\s+(.+?)\s+(?:sends|crushes|launches|clears|hooks|wraps|lifts|drives|gets|bunts)/,
          /^(.+?)\s+(?:sends|crushes|launches|clears|hooks|wraps|lifts|drives|gets|bunts)/,
          /^(.+?)\s+hits\s+a\s+(?:solo\s+|grand\s+slam\s+)?home\s+run/i,
          /^(.+?)\s+goes\s+deep/i,
          /^(.+?)\s+homers/i,
        ];
        let name = null;
        for (const pattern of patterns) {
          const m = text.match(pattern);
          if (m && m[1]) { name = m[1].trim(); break; }
        }
        entry.batterName = name || 'Unknown';
        console.warn('[HR-sanitizer] Patched missing batterName:', text.substring(0, 60));
      }
    }
  };
  // Run after the sim to catch ALL HR entries at once
  sanitizeHRs(state.log);

  // Attach tracking for buildGameResultFromState
  state._tracking = { scoringEvents, hitTracking, hrTracking, bfTracking, hrAllowedTracking, injuriesOccurred };

  // Session 23: Soft validation only. The sim always produces complete data
  // (lineups, pitcher history, scores). Reconciliation warnings are logged for
  // debugging but NEVER cause a score-only TBD fallback — that was the source
  // of inconsistent finalization. The hard W/L fallback in buildGameResultFromState
  // guarantees decisions on every completed game. Only a genuine sim stall
  // (gameOver never set) is a hard block.
  try {
    const boxResult = buildGameResultFromState(state);
    validateGameBoxScore(state, boxResult); // logs errors internally, non-throwing
  } catch (e) {
    console.error('[seasonEngine] Box result build warning:', e.message);
  }
  if (!state.gameOver) {
    state._validationFailed = true;
    state._validationError = 'Sim stall - game never reached conclusion';
  }

  return state;
}

/**
 * Session 23: Hard block — every final Season game MUST have a box score and
 * W/L decisions. Throws if missing, so the caller stops the day from committing
 * rather than saving a score-only TBD shell.
 */
export function validateCompletedGame(game) {
  if (game.status !== 'FINAL') return;
  if (!game.boxScore) {
    throw new Error(`Final game ${game.gameId} (${game.awayTeam}@${game.homeTeam}) missing box score`);
  }
  if (!game.winningPitcherId) {
    throw new Error(`Final game ${game.gameId} (${game.awayTeam}@${game.homeTeam}) missing winning pitcher`);
  }
  if (!game.losingPitcherId) {
    throw new Error(`Final game ${game.gameId} (${game.awayTeam}@${game.homeTeam}) missing losing pitcher`);
  }
}

/**
 * Build canonical GameResult from a final game state.
 * Works for both headless (with _tracking) and UI (without) paths.
 * @param {object} state - Final game state
 * @param {object} options - { tracking: { scoringEvents, hitTracking, ... } } (optional, from headless sim)
 * @returns {object} Canonical GameResult
 */
export function buildGameResultFromState(state, options = {}) {
  const tracking = options.tracking || state._tracking || {};
  const hitTracking = tracking.hitTracking || extractHitTypesFromLog(state);
  const hrTracking = tracking.hrTracking || extractHRsFromLog(state);
  const bfTracking = tracking.bfTracking || {};
  const hrAllowedTracking = tracking.hrAllowedTracking || {};
  const scoringEvents = tracking.scoringEvents || null;

  const homeWon = state.score.home > state.score.away;
  const winner = homeWon ? state.homeTeam : state.awayTeam;
  const loser = homeWon ? state.awayTeam : state.homeTeam;

  // Build batting arrays
  const batting = [];
  collectBatting(state, 'home', state.homeTeam, batting, hitTracking);
  collectBatting(state, 'away', state.awayTeam, batting, hitTracking);

  // Build pitching arrays
  const pitching = [];
  collectPitching(state, 'home', state.homeTeam, pitching, bfTracking, hrAllowedTracking);
  collectPitching(state, 'away', state.awayTeam, pitching, bfTracking, hrAllowedTracking);

  // Determine W/L/S decisions (Session 20: pass bfTracking for 0-BF filtering)
  const decisions = scoringEvents
    ? determineDecisionsFromEvents(state, scoringEvents, bfTracking)
    : determineDecisionsSimplified(state, bfTracking);

  // HARD FALLBACK: a completed non-tie game MUST have W/L decisions.
  // If the decision logic returned null (edge case in pitcher filtering),
  // fall back to the first active pitcher on each side rather than showing TBD.
  const winningSide = homeWon ? 'home' : 'away';
  const losingSide = homeWon ? 'away' : 'home';
  if (!decisions.winner) {
    const winningSidePitchers = filterActivePitchers(getPitcherList(state, winningSide), winner, bfTracking);
    if (winningSidePitchers.length > 0) {
      decisions.winner = playerId(winner, winningSidePitchers[0].name);
    } else {
      const fallback = getPitcherList(state, winningSide)[0];
      if (fallback) decisions.winner = playerId(winner, fallback.name);
    }
  }
  if (!decisions.loser) {
    const losingSidePitchers = filterActivePitchers(getPitcherList(state, losingSide), loser, bfTracking);
    if (losingSidePitchers.length > 0) {
      decisions.loser = playerId(loser, losingSidePitchers[0].name);
    } else {
      const fallback = getPitcherList(state, losingSide)[0];
      if (fallback) decisions.loser = playerId(loser, fallback.name);
    }
  }

  // Mark W/L/S on pitching entries
  for (const p of pitching) {
    if (decisions.winner && p.playerId === decisions.winner) p.w = 1;
    if (decisions.loser && p.playerId === decisions.loser) p.l = 1;
    if (decisions.save && p.playerId === decisions.save) p.sv = 1;
  }

  // Session 23: Box-score integrity audit — every pitcher with game activity must
  // appear in the pitching array. Warn (not throw) so the game still finalizes.
  const boxPitcherNames = new Set(pitching.map(p => p.name));
  for (const side of ['home', 'away']) {
    for (const p of getPitcherList(state, side)) {
      const gs = p.gameStats || {};
      if ((gs.pitches || 0) > 0 || (gs.outs || 0) > 0 || (gs.so || 0) > 0) {
        if (!boxPitcherNames.has(p.name)) {
          console.warn(`[box-score-integrity] ${p.name} used but missing from box score`);
        }
      }
    }
  }

  // Pitching outs validation: each team's pitching outs must match the
  // number of outs the opponent batted. A mismatch means a pitcher who
  // appeared is missing from the box score.
  const inningsBatting = state.innings || [];
  const homePitchingOuts = pitching.filter(p => p.teamKey === state.homeTeam).reduce((s, p) => s + (p.outs || 0), 0);
  const awayPitchingOuts = pitching.filter(p => p.teamKey === state.awayTeam).reduce((s, p) => s + (p.outs || 0), 0);
  // Home pitchers face away batters. Count away batting innings (non-null = batted).
  const awayBatInnings = inningsBatting.filter(inn => inn && inn.away !== null && inn.away !== undefined).length;
  const homeBatInnings = inningsBatting.filter(inn => inn && inn.home !== null && inn.home !== undefined).length;
  if (awayBatInnings > 0 && homePitchingOuts < awayBatInnings * 3) {
    console.warn(`[box-score-validation] CRITICAL: Missing pitcher innings for ${state.homeTeam}. Expected ${awayBatInnings * 3} outs, displayed ${homePitchingOuts} outs, missing ${awayBatInnings * 3 - homePitchingOuts} outs.`);
  }
  if (homeBatInnings > 0 && awayPitchingOuts < homeBatInnings * 3) {
    console.warn(`[box-score-validation] CRITICAL: Missing pitcher innings for ${state.awayTeam}. Expected ${homeBatInnings * 3} outs, displayed ${awayPitchingOuts} outs, missing ${homeBatInnings * 3 - awayPitchingOuts} outs.`);
  }

  // Build homeRuns list
  const homeRuns = hrTracking.map(hr => ({
    playerId: playerId(hr.teamKey, hr.name),
    name: hr.name,
    teamKey: hr.teamKey,
    inning: hr.inning || 0,
  }));

  return {
    homeTeam: state.homeTeam,
    awayTeam: state.awayTeam,
    homeScore: state.score.home,
    awayScore: state.score.away,
    winner,
    innings: state.innings,
    decisions,
    batting,
    pitching,
    homeRuns,
    homeErrors: state.homeErrors || 0,
    awayErrors: state.awayErrors || 0,
  };
}

// ── Backward-compatible wrapper ──
export function extractGameSummary(state) {
  const result = buildGameResultFromState(state);
  return {
    homeScore: result.homeScore,
    awayScore: result.awayScore,
    winner: result.winner,
    homeHits: result.batting.filter(b => b.teamKey === state.homeTeam).reduce((s, b) => s + b.h, 0),
    awayHits: result.batting.filter(b => b.teamKey === state.awayTeam).reduce((s, b) => s + b.h, 0),
    homeHRs: result.homeRuns.filter(hr => hr.teamKey === state.homeTeam),
    awayHRs: result.homeRuns.filter(hr => hr.teamKey === state.awayTeam),
    innings: result.innings,
    winningPitcher: result.decisions.winner,
    losingPitcher: result.decisions.loser,
    savePitcher: result.decisions.save,
  };
}

// ── Collect batting stats from lineup + history ──
function collectBatting(state, side, teamKey, out, hitTracking) {
  const lineup = side === 'home' ? state.homeLineup : state.awayLineup;
  const history = side === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  const seen = new Set();
  for (const player of [...lineup, ...history]) {
    if (seen.has(player.name)) continue;
    seen.add(player.name);
    const gs = player.gameStats || {};
    // Skip pure pitcher entries (pitcher state pushed to history without a batting lineup entry).
    // These have ip/pitches but no ab — their bb/so are pitching stats, not batting.
    if (gs.ip !== undefined && gs.ab === undefined) continue;
    // Session 19 2C: Include runs > 0 so pinch-runners who score appear in the box score
    if ((gs.ab || 0) > 0 || (gs.bb || 0) > 0 || (gs.hits || 0) > 0 || (gs.hr || 0) > 0 || (gs.rbi || 0) > 0 || (gs.runs || 0) > 0) {
      const pid = playerId(teamKey, player.name);
      const ht = hitTracking[pid] || {};
      out.push({
        playerId: pid,
        teamKey,
        name: player.name,
        ab: gs.ab || 0,
        h: gs.hits || 0,
        doubles: gs.doubles || ht.doubles || 0,
        triples: gs.triples || ht.triples || 0,
        hr: gs.hr || 0,
        rbi: gs.rbi || 0,
        r: gs.runs || 0,
        bb: gs.bb || 0,
        so: gs.so || 0,
        sb: gs.sb || 0,
      });
    }
  }
}

// ── Collect pitching stats from history + current pitcher ──
function collectPitching(state, side, teamKey, out, bfTracking, hrAllowedTracking) {
  const pitchers = getPitcherList(state, side);
  let realPitcherIdx = 0;
  for (let i = 0; i < pitchers.length; i++) {
    const pitcher = pitchers[i];
    const gs = pitcher.gameStats || {};
    const pid = playerId(teamKey, pitcher.name);
    const bf = bfTracking[pid] || 0;
    const pitches = gs.pitches || 0;
    const outs = gs.outs || Math.round((gs.ip || 0) * 3);
    const hasTrackedBF = Object.keys(bfTracking).length > 0;
    // Check the CORRECT pitching stat fields. History entries from changePitcher
    // store pitching stats with the pitcher prefix (pitcherSo, pitcherBB, etc.),
    // while raw so/bb/h are BATTING stats from capturedBattingStats. The old
    // check used the batting fields, which could exclude a reliever who pitched
    // a clean inning (0 H, 0 R, 0 BB, 0 K) if their pitches/outs were somehow 0.
    const hasActivity = pitches > 0 || outs > 0 ||
      (gs.pitcherSo ?? gs.so ?? 0) > 0 ||
      (gs.pitcherBB ?? gs.bb ?? 0) > 0 ||
      (gs.pitcherH ?? gs.h ?? 0) > 0 ||
      (gs.pitcherR ?? gs.r ?? 0) > 0 ||
      (gs.pitcherER ?? gs.er ?? 0) > 0;
    // A pitcher who was officially entered into the game (has a pitcher position
    // tag) must always appear, even with a 0-0-0-0-0-0 line.
    const isPitcherPos = ['SP', 'RP', 'CL'].includes(pitcher.pos) || ['SP', 'RP', 'CL'].includes(pitcher.assignedPos);
    if (hasTrackedBF && bf === 0 && !hasActivity && !isPitcherPos) continue;
    if (!hasTrackedBF && !hasActivity && !isPitcherPos) continue;
    const effectiveBF = hasTrackedBF ? bf : (outs + (gs.pitcherH ?? gs.h ?? 0) + (gs.pitcherBB ?? gs.bb ?? 0));
    // Merged history entries store pitcherSo/pitcherBB (prefixed); pitcher-only entries use so/bb
    out.push({
      playerId: pid,
      teamKey,
      name: pitcher.name,
      gs: realPitcherIdx === 0 ? 1 : 0,
      outs,
      h: gs.pitcherH ?? gs.h ?? 0,
      r: gs.pitcherR ?? gs.r ?? 0,
      er: gs.pitcherER ?? gs.er ?? 0,
      bb: gs.pitcherBB ?? gs.bb ?? 0,
      so: gs.pitcherSo ?? gs.so ?? 0,
      hr: hrAllowedTracking[pid] || 0,
      bf: effectiveBF,
      pitches,
    });
    realPitcherIdx++;
  }
}

// ── Get ordered pitcher list (starter first, current last) ──
// Session 19 2B: Deduplicate by name, merging gameStats to prevent phantom rows
// caused by split appearances (same pitcher pushed to history multiple times).
function getPitcherList(state, side) {
  const current = side === 'home' ? state.homePitcher : state.awayPitcher;
  const history = side === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  // Include ANY player with pitching activity OR a pitcher position tag.
  // The old pos-only filter excluded relievers whose pos/assignedPos wasn't
  // preserved during double-switches or lineup shuffles, causing them to
  // vanish from the box score even though they pitched real outs.
  const pastPitchers = history.filter(p => {
    const gs = p.gameStats || {};
    const hasPitchingActivity = (gs.outs || 0) > 0 || (gs.pitches || 0) > 0 || (gs.ip || 0) > 0;
    const isPitcherPos = ['SP', 'RP', 'CL'].includes(p.pos) || ['SP', 'RP', 'CL'].includes(p.assignedPos);
    return hasPitchingActivity || isPitcherPos;
  });
  const all = [...pastPitchers];
  if (current && !all.find(p => p.name === current.name)) {
    all.push(current);
  }
  // Deduplicate by name, merging pitching gameStats
  const seen = new Map();
  const deduped = [];
  for (const p of all) {
    if (!p || !p.name) continue;
    if (seen.has(p.name)) {
      const existing = seen.get(p.name);
      const eg = existing.gameStats || {};
      const pg = p.gameStats || {};
      existing.gameStats = {
        ...eg,
        outs: (eg.outs || 0) + (pg.outs || 0),
        ip: (eg.ip || 0) + (pg.ip || 0),
        pitches: (eg.pitches || 0) + (pg.pitches || 0),
        h: (eg.h || 0) + (pg.h || 0),
        r: (eg.r || 0) + (pg.r || 0),
        er: (eg.er || 0) + (pg.er || 0),
        bb: (eg.bb || 0) + (pg.bb || 0),
        so: (eg.so || 0) + (pg.so || 0),
        pitcherH: (eg.pitcherH ?? eg.h ?? 0) + (pg.pitcherH ?? pg.h ?? 0),
        pitcherR: (eg.pitcherR ?? eg.r ?? 0) + (pg.pitcherR ?? pg.r ?? 0),
        pitcherER: (eg.pitcherER ?? eg.er ?? 0) + (pg.pitcherER ?? pg.er ?? 0),
        pitcherBB: (eg.pitcherBB ?? eg.bb ?? 0) + (pg.pitcherBB ?? pg.bb ?? 0),
        pitcherSo: (eg.pitcherSo ?? eg.so ?? 0) + (pg.pitcherSo ?? pg.so ?? 0),
      };
    } else {
      seen.set(p.name, p);
      deduped.push(p);
    }
  }
  return deduped;
}

// Session 20 Part 3: filter to pitchers who actually faced batters (BF > 0)
function filterActivePitchers(pitchers, teamKey, bfTracking) {
  const filtered = pitchers.filter(p => {
    if (bfTracking) {
      const pid = playerId(teamKey, p.name);
      return (bfTracking[pid] || 0) > 0;
    }
    // Fallback (UI path): any pitching activity = faced a batter
    const gs = p.gameStats || {};
    return (gs.outs || 0) > 0 || (gs.pitches || 0) > 0 || (gs.so || 0) > 0 || (gs.bb || 0) > 0 || (gs.h || 0) > 0;
  });
  return filtered.length > 0 ? filtered : pitchers;
}

// ── W/L/S from scoring events (headless sim path - accurate) ──
function determineDecisionsFromEvents(state, scoringEvents, bfTracking) {
  const homeWon = state.score.home > state.score.away;
  const winningSide = homeWon ? 'home' : 'away';
  const losingSide = homeWon ? 'away' : 'home';
  const winningTeamKey = winningSide === 'home' ? state.homeTeam : state.awayTeam;
  const losingTeamKey = losingSide === 'home' ? state.homeTeam : state.awayTeam;

  // Find the last lead change - the pitcher who gave up the go-ahead is the loser
  let scoreHome = 0, scoreAway = 0;
  let lastLeadChangePitcher = null;
  let currentLeader = null;

  for (const event of scoringEvents) {
    if (event.battingSide === 'home') scoreHome += event.runs;
    else scoreAway += event.runs;
    const newLeader = scoreHome > scoreAway ? 'home' : (scoreAway > scoreHome ? 'away' : null);
    if (newLeader && newLeader !== currentLeader) {
      lastLeadChangePitcher = event.pitcherName;
      currentLeader = newLeader;
    }
  }

  // Session 20 Part 3: filter to pitchers with BF > 0 (skip 0-BF phantoms)
  const winningPitchers = filterActivePitchers(getPitcherList(state, winningSide), winningTeamKey, bfTracking);
  const losingPitchers = filterActivePitchers(getPitcherList(state, losingSide), losingTeamKey, bfTracking);

  // Session 20 Part 4: walk-off check - if the winning run scored while tied,
  // the winning team's final pitcher gets the W (not a save)
  const lastEvent = scoringEvents[scoringEvents.length - 1];
  const isWalkOff = lastEvent &&
    lastEvent.battingSide === 'home' &&
    state.inning >= 9 &&
    (lastEvent.scoreAfter.home - lastEvent.runs) === lastEvent.scoreAfter.away;

  // Winning pitcher
  const winningStarter = winningPitchers[0];
  const starterOuts = Math.round((winningStarter?.gameStats?.ip || 0) * 3);
  let winnerPitcher;
  if (isWalkOff) {
    // Walk-off: final pitcher of the winning team gets the W
    winnerPitcher = winningPitchers[winningPitchers.length - 1];
  } else if (starterOuts >= 15) {
    winnerPitcher = winningStarter;
  } else {
    winnerPitcher = winningPitchers.slice(1).sort((a, b) =>
      (a.gameStats?.r || 0) - (b.gameStats?.r || 0)
    )[0] || winningPitchers[0];
  }

  // Losing pitcher: the one who gave up the go-ahead run (must have BF > 0)
  const loserPitcher = losingPitchers.find(p => p.name === lastLeadChangePitcher) || losingPitchers[0];

  // Save: only if NOT a walk-off (Part 4)
  const margin = Math.abs(state.score.home - state.score.away);
  let savePitcher = null;
  if (!isWalkOff && margin <= 3 && winningPitchers.length > 1) {
    const finalPitcher = winningPitchers[winningPitchers.length - 1];
    if (finalPitcher.name !== winnerPitcher.name) {
      savePitcher = finalPitcher;
    }
  }

  return {
    winner: winnerPitcher ? playerId(winningTeamKey, winnerPitcher.name) : null,
    loser: loserPitcher ? playerId(losingTeamKey, loserPitcher.name) : null,
    save: savePitcher ? playerId(winningTeamKey, savePitcher.name) : null,
  };
}

// ── W/L/S simplified (UI path - no scoring events) ──
function determineDecisionsSimplified(state, bfTracking) {
  const homeWon = state.score.home > state.score.away;
  const winningSide = homeWon ? 'home' : 'away';
  const losingSide = homeWon ? 'away' : 'home';
  const winningTeamKey = winningSide === 'home' ? state.homeTeam : state.awayTeam;
  const losingTeamKey = losingSide === 'home' ? state.homeTeam : state.awayTeam;

  // Session 20 Part 3: filter to pitchers with BF > 0
  const winningPitchers = filterActivePitchers(getPitcherList(state, winningSide), winningTeamKey, bfTracking);
  const losingPitchers = filterActivePitchers(getPitcherList(state, losingSide), losingTeamKey, bfTracking);

  // Winner: starter if 5+ IP, else best reliever
  const starterOuts = Math.round((winningPitchers[0]?.gameStats?.ip || 0) * 3);
  let winnerPitcher;
  if (starterOuts >= 15) {
    winnerPitcher = winningPitchers[0];
  } else {
    winnerPitcher = winningPitchers.slice(1).sort((a, b) =>
      (a.gameStats?.r || 0) - (b.gameStats?.r || 0)
    )[0] || winningPitchers[0];
  }

  // Loser: starter (simplified - no scoring event data for UI path)
  const loserPitcher = losingPitchers[0];

  // Save: last reliever if margin <= 3
  const margin = Math.abs(state.score.home - state.score.away);
  let savePitcher = null;
  if (margin <= 3 && winningPitchers.length > 1) {
    const finalPitcher = winningPitchers[winningPitchers.length - 1];
    if (finalPitcher.name !== winnerPitcher.name) savePitcher = finalPitcher;
  }

  return {
    winner: winnerPitcher ? playerId(winningTeamKey, winnerPitcher.name) : null,
    loser: loserPitcher ? playerId(losingTeamKey, loserPitcher.name) : null,
    save: savePitcher ? playerId(winningTeamKey, savePitcher.name) : null,
  };
}

// ── Fallback: extract doubles/triples from game log (for UI path) ──
function extractHitTypesFromLog(state) {
  const hitTypes = {};
  const allBatters = [
    ...(state.homeLineup || []).map(p => ({ name: p.name, team: state.homeTeam })),
    ...(state.awayLineup || []).map(p => ({ name: p.name, team: state.awayTeam })),
    ...((state.homePlayerHistory || []).map(p => ({ name: p.name, team: state.homeTeam }))),
    ...((state.awayPlayerHistory || []).map(p => ({ name: p.name, team: state.awayTeam }))),
  ];
  for (const entry of (state.log || [])) {
    if (entry.type === 'double' || entry.type === 'triple') {
      for (const batter of allBatters) {
        if (entry.text && entry.text.includes(batter.name)) {
          const pid = playerId(batter.team, batter.name);
          if (!hitTypes[pid]) hitTypes[pid] = { doubles: 0, triples: 0 };
          if (entry.type === 'double') hitTypes[pid].doubles++;
          if (entry.type === 'triple') hitTypes[pid].triples++;
          break;
        }
      }
    }
  }
  return hitTypes;
}

// ── Fallback: extract HRs from game log (for UI path) ──
function extractHRsFromLog(state) {
  const hrs = [];
  for (const entry of (state.log || [])) {
    if (entry.type === 'homerun' && entry.batterName) {
      const teamKey = (state.homeLineup || []).concat(state.homePlayerHistory || []).some(p => p.name === entry.batterName)
        ? state.homeTeam : state.awayTeam;
      hrs.push({ name: entry.batterName, teamKey, inning: 0 });
    }
  }
  return hrs;
}