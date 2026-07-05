// Season Engine - Headless game simulation + canonical GameResult extraction
// Uses the ONE true engine (gameEngine.js) for all simulation, user and CPU.
// Tracks scoring events and hit types during headless sim for accurate W/L/S decisions.

import { TEAMS } from './gameData';
import {
  createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing,
  cpuDecideSubstitutions, getCurrentBatter, getCurrentPitcher,
} from './gameEngine';
import { playerId } from './seasonStore';
import { validateGameBoxScore } from './boxScoreValidators';

/**
 * Simulate a complete game headlessly (CPU vs CPU).
 * Instruments the sim to track scoring events, hit types, and HR data
 * for accurate W/L/S decisions and complete stat extraction.
 * @returns {object} Final game state (with _tracking data attached)
 */
export function simulateGameHeadless(homeTeam, awayTeam, options = {}) {
  const { useDH = false, weather = null, umpire = null, homeLineup = null, awayLineup = null, homeSP = null, awaySP = null, unavailableRelievers = null } = options;

  let state = createGameState(homeTeam, awayTeam, homeLineup, awayLineup, useDH, weather, umpire, homeSP, awaySP);
  state._headlessMode = true;
  state.homeStartingPitcherName = homeSP?.name || null;
  state.awayStartingPitcherName = awaySP?.name || null;

  // Filter out unavailable relievers from both bullpens
  // Session 19 Part 1: Emergency valve - never let bullpen go to 0 (prevents sim stall)
  if (unavailableRelievers) {
    if (unavailableRelievers.home?.length) {
      const filtered = state.homeBullpen.filter(p => !unavailableRelievers.home.includes(p.name));
      if (filtered.length > 0) state.homeBullpen = filtered;
      // else: keep all arms (emergency - least-rested will be used)
    }
    if (unavailableRelievers.away?.length) {
      const filtered = state.awayBullpen.filter(p => !unavailableRelievers.away.includes(p.name));
      if (filtered.length > 0) state.awayBullpen = filtered;
      // else: keep all arms (emergency - least-rested will be used)
    }
  }

  // Tracking data
  const scoringEvents = []; // { inning, battingSide, pitchingSide, pitcherName, runs }
  const hitTracking = {};   // playerId → { doubles, triples }
  const hrTracking = [];    // { name, teamKey, inning }
  const bfTracking = {};    // pitcherPlayerId → batters faced count
  const hrAllowedTracking = {}; // pitcherPlayerId → HR count

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

    // Process at-bat
    state = processAtBat(state, cpuSelectPitch(state), cpuSelectSwing(state));
    // Session 14 fix: evaluate BOTH dugouts' managers. With userTeam=null the function
    // resolved cpuSide='home' only, so road starters were never hooked (every road
    // starter threw a complete game). Each call early-returns unless its cpuSide matches
    // the current pitching side, so calling twice covers both half-innings without
    // conflict — the home eval fires in the top, the away eval fires in the bottom.
    state = cpuDecideSubstitutions(state, state.awayTeam);  // evaluates HOME pitcher
    state = cpuDecideSubstitutions(state, state.homeTeam);  // evaluates AWAY pitcher

    // Track scoring
    const runsScored = state.score[battingSide] - prevBattingScore;
    if (runsScored > 0) {
      scoringEvents.push({
        inning: state.inning,
        battingSide,
        pitchingSide,
        pitcherName: currentPitcher.name,
        runs: runsScored,
        scoreAfter: { ...state.score },
      });
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

  // Attach tracking for buildGameResultFromState
  state._tracking = { scoringEvents, hitTracking, hrTracking, bfTracking, hrAllowedTracking };

  // Loud-failing validation per Session 17/18 spec
  try {
    const boxResult = buildGameResultFromState(state);
    validateGameBoxScore(state, boxResult);
  } catch (e) {
    console.error('[seasonEngine] Validator failed to run:', e);
  }

  return state;
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

  // Determine W/L/S decisions
  const decisions = scoringEvents
    ? determineDecisionsFromEvents(state, scoringEvents)
    : determineDecisionsSimplified(state);

  // Mark W/L/S on pitching entries
  for (const p of pitching) {
    if (decisions.winner && p.playerId === decisions.winner) p.w = 1;
    if (decisions.loser && p.playerId === decisions.loser) p.l = 1;
    if (decisions.save && p.playerId === decisions.save) p.sv = 1;
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
    // Session 19 2B: Never render a pitcher line if BF === 0 (phantom suppression)
    if (bf === 0) continue;
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
      bf,
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
  const pastPitchers = history.filter(p =>
    ['SP', 'RP', 'CL'].includes(p.pos) || ['SP', 'RP', 'CL'].includes(p.assignedPos)
  );
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

// ── W/L/S from scoring events (headless sim path - accurate) ──
function determineDecisionsFromEvents(state, scoringEvents) {
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

  // Winning pitcher: starter if 15+ outs (5 IP) and left with lead; else most effective reliever
  const winningPitchers = getPitcherList(state, winningSide);
  const winningStarter = winningPitchers[0];
  const starterOuts = Math.round((winningStarter?.gameStats?.ip || 0) * 3);
  let winnerPitcher;
  if (starterOuts >= 15) {
    winnerPitcher = winningStarter;
  } else {
    winnerPitcher = winningPitchers.slice(1).sort((a, b) =>
      (a.gameStats?.r || 0) - (b.gameStats?.r || 0)
    )[0] || winningPitchers[0];
  }

  // Losing pitcher: the one who gave up the go-ahead run
  const losingPitchers = getPitcherList(state, losingSide);
  const loserPitcher = losingPitchers.find(p => p.name === lastLeadChangePitcher) || losingPitchers[0];

  // Save: reliever (not winner) who finished, if margin <= 3
  const margin = Math.abs(state.score.home - state.score.away);
  let savePitcher = null;
  if (margin <= 3 && winningPitchers.length > 1) {
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
function determineDecisionsSimplified(state) {
  const homeWon = state.score.home > state.score.away;
  const winningSide = homeWon ? 'home' : 'away';
  const losingSide = homeWon ? 'away' : 'home';
  const winningTeamKey = winningSide === 'home' ? state.homeTeam : state.awayTeam;
  const losingTeamKey = losingSide === 'home' ? state.homeTeam : state.awayTeam;

  const winningPitchers = getPitcherList(state, winningSide);
  const losingPitchers = getPitcherList(state, losingSide);

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