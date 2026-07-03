// Season Engine - Headless game simulation + canonical GameResult extraction
// Uses the ONE true engine (gameEngine.js) for all simulation, user and CPU.
// Tracks scoring events and hit types during headless sim for accurate W/L/S decisions.

import { TEAMS } from './gameData';
import {
  createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing,
  cpuDecideSubstitutions, getCurrentBatter, getCurrentPitcher,
} from './gameEngine';
import { playerId } from './seasonStore';

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

  // Filter out unavailable relievers (threw >2 IP yesterday) from both bullpens
  if (unavailableRelievers) {
    if (unavailableRelievers.home?.length) {
      state.homeBullpen = state.homeBullpen.filter(p => !unavailableRelievers.home.includes(p.name));
    }
    if (unavailableRelievers.away?.length) {
      state.awayBullpen = state.awayBullpen.filter(p => !unavailableRelievers.away.includes(p.name));
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
    state = cpuDecideSubstitutions(state, null);

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
    if (gs.ab > 0 || gs.bb > 0 || gs.hits > 0 || gs.hr > 0 || gs.rbi > 0) {
      const pid = playerId(teamKey, player.name);
      const ht = hitTracking[pid] || {};
      out.push({
        playerId: pid,
        teamKey,
        name: player.name,
        ab: gs.ab || 0,
        h: gs.hits || 0,
        doubles: ht.doubles || 0,
        triples: ht.triples || 0,
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
  for (let i = 0; i < pitchers.length; i++) {
    const pitcher = pitchers[i];
    const gs = pitcher.gameStats || {};
    const pid = playerId(teamKey, pitcher.name);
    const ip = gs.ip || 0;
    const outs = Math.round(ip * 3); // Convert fractional IP to integer outs
    out.push({
      playerId: pid,
      teamKey,
      name: pitcher.name,
      gs: i === 0 ? 1 : 0,
      outs,
      h: gs.h || 0,
      r: gs.r || 0,
      er: gs.er || 0,
      bb: gs.bb || 0,
      so: gs.so || 0,
      hr: hrAllowedTracking[pid] || 0,
      bf: bfTracking[pid] || 0,
    });
  }
}

// ── Get ordered pitcher list (starter first, current last) ──
function getPitcherList(state, side) {
  const current = side === 'home' ? state.homePitcher : state.awayPitcher;
  const history = side === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  const pastPitchers = history.filter(p =>
    ['SP', 'RP', 'CL'].includes(p.pos) || ['SP', 'RP', 'CL'].includes(p.assignedPos)
  );
  const all = [...pastPitchers];
  if (!all.find(p => p.name === current?.name)) {
    all.push(current);
  }
  return all;
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