/**
 * Pitcher Decision Tracking - Wins, Losses, and Saves
 *
 * Tracks a runLog (via logRun, called from scoreRun) to attribute each run
 * to the pitcher who allowed it and the pitcher of record for the scoring team.
 * At game end, determinePitcherDecisions applies MLB rules to assign W/L/S.
 */

/**
 * Log a run with pitcher attribution. Called from scoreRun() in the game engine.
 * Must be called AFTER state.score has been incremented.
 */
export function logRun(state) {
  if (!state.runLog) state.runLog = [];

  // When the away team bats (top of inning), the HOME team is pitching
  // The batting team's pitcher of record is their own current pitcher
  const battingTeam = state.halfInning === 'top' ? 'away' : 'home';
  const battingTeamPitcher = battingTeam === 'home' ? state.homePitcher : state.awayPitcher;
  const fieldingPitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;

  state.runLog.push({
    battingTeam,
    pitcherAllowed: fieldingPitcher?.name || 'Unknown',
    pitcherOfRecord: battingTeamPitcher?.name || 'Unknown',
    inning: state.inning,
    scoreAfter: { home: state.score.home, away: state.score.away },
  });
}

/**
 * Find a pitcher's stats by name from the current pitcher or player history.
 */
function findPitcherStats(state, name, side) {
  const currentPitcher = side === 'home' ? state.homePitcher : state.awayPitcher;
  if (currentPitcher && currentPitcher.name === name) return currentPitcher;

  const historyKey = side === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
  return (state[historyKey] || []).find(p => p.name === name);
}

/**
 * Get all relief pitchers for a side from player history.
 * Relievers are pitchers who were replaced during the game (in history).
 */
function getRelieversFromHistory(state, side) {
  const historyKey = side === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
  return (state[historyKey] || []).filter(p => {
    const pos = p.assignedPos || p.pos;
    return ['SP', 'RP', 'CL'].includes(pos) || p._replacedPitcher || (p.gameStats && p.gameStats.ip !== undefined && p.gameStats.ip > 0);
  });
}

/**
 * Determine pitcher decisions (Win, Loss, Save) at game end.
 * Returns { win: {name, side}, loss: {name, side}, save: {name, side}|null } or null.
 */
export function determinePitcherDecisions(state) {
  if (!state.gameOver) return null;
  if (!state.runLog || state.runLog.length === 0) return null;

  const homeWon = state.score.home > state.score.away;
  const winningSide = homeWon ? 'home' : 'away';
  const losingSide = homeWon ? 'away' : 'home';

  // ── Find the decisive run ──
  // The decisive run is the last time the winning team took the lead (went from
  // tied/behind → ahead) and never lost it afterward.
  let decisiveRunIdx = -1;

  for (let i = state.runLog.length - 1; i >= 0; i--) {
    const run = state.runLog[i];
    const afterDiff = run.scoreAfter.home - run.scoreAfter.away;
    const winningAheadAfter = homeWon ? afterDiff > 0 : afterDiff < 0;

    if (!winningAheadAfter) continue;

    // Score before this run: either the previous run's scoreAfter, or 0-0
    const beforeHome = i > 0 ? state.runLog[i - 1].scoreAfter.home : 0;
    const beforeAway = i > 0 ? state.runLog[i - 1].scoreAfter.away : 0;
    const beforeDiff = beforeHome - beforeAway;
    const winningAheadBefore = homeWon ? beforeDiff > 0 : beforeDiff < 0;

    // If the winning team was NOT ahead before but IS ahead after → lead change
    if (!winningAheadBefore) {
      decisiveRunIdx = i;
      break;
    }
  }

  if (decisiveRunIdx < 0) return null;

  const decisiveRun = state.runLog[decisiveRunIdx];

  // ── Losing pitcher: the pitcher who allowed the decisive run ──
  const lossName = decisiveRun.pitcherAllowed;

  // ── Winning pitcher: the pitcher of record for the winning team at that point ──
  let winName = decisiveRun.pitcherOfRecord;

  // ── 5-inning rule: starter must pitch 5+ innings to get the win ──
  const winPitcherStats = findPitcherStats(state, winName, winningSide);
  const winPitcherIsStarter = winPitcherStats && (
    winPitcherStats.pos === 'SP' || winPitcherStats.assignedPos === 'SP'
  );
  const winPitcherIP = winPitcherStats?.gameStats?.ip || 0;

  if (winPitcherIsStarter && winPitcherIP < 5) {
    // Starter didn't go 5 - award win to the most effective reliever (most IP, not the losing pitcher)
    const relievers = getRelieversFromHistory(state, winningSide)
      .filter(p => p.name !== lossName && p.name !== winName)
      .sort((a, b) => (b.gameStats?.ip || 0) - (a.gameStats?.ip || 0));

    // Also consider the finishing pitcher (current pitcher at game end)
    const finishingPitcher = winningSide === 'home' ? state.homePitcher : state.awayPitcher;
    if (finishingPitcher && finishingPitcher.name !== lossName &&
        finishingPitcher.name !== winName &&
        !relievers.find(r => r.name === finishingPitcher.name)) {
      relievers.push(finishingPitcher);
      relievers.sort((a, b) => (b.gameStats?.ip || 0) - (a.gameStats?.ip || 0));
    }

    if (relievers.length > 0 && (relievers[0].gameStats?.ip || 0) > 0) {
      winName = relievers[0].name;
    }
  }

  // ── Save determination ──
  // The finishing pitcher (winning team's last pitcher) gets a save if:
  //   - Not the winning pitcher
  //   - Pitched at least 1/3 inning
  //   - One of:
  //     a. Final lead is 3 or fewer AND pitched at least 1 full inning
  //     c. Pitched 3+ innings regardless of score
  // (Condition b - entering with tying run on base - approximated by condition a)
  const finishingPitcher = winningSide === 'home' ? state.homePitcher : state.awayPitcher;
  let saveName = null;

  if (finishingPitcher && finishingPitcher.name !== winName) {
    const finishingIP = finishingPitcher.gameStats?.ip || 0;
    const margin = Math.abs(state.score.home - state.score.away);

    if (finishingIP >= 3) {
      saveName = finishingPitcher.name;
    } else if (margin <= 3 && finishingIP >= 1) {
      saveName = finishingPitcher.name;
    }
  }

  return {
    win: { name: winName, side: winningSide },
    loss: { name: lossName, side: losingSide },
    save: saveName ? { name: saveName, side: winningSide } : null,
  };
}