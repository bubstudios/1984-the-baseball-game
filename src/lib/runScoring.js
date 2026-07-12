// runScoring.js - THE single scoring entry point.
// Every run in the game goes through chargeRun(). No path may increment
// runs or pitcher R/ER inline. The responsible pitcher is the one who put
// the runner on base, not whoever is pitching when the runner scores.

import { logRun } from './pitcherDecisions';

// Find the pitcher object responsible for a runner (the one who put them on base)
function findResponsiblePitcher(state, runner) {
  const name = runner.responsiblePitcherId;
  if (!name) {
    // Fallback: current pitcher (e.g. HR - batter scores immediately)
    return state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  }
  const side = runner.responsiblePitcherSide || (state.halfInning === 'top' ? 'home' : 'away');
  const currentP = side === 'home' ? state.homePitcher : state.awayPitcher;
  if (currentP?.name === name) return currentP;
  const history = side === 'home' ? state.homePlayerHistory : state.awayPlayerHistory;
  return (history || []).find(p => p.name === name) || currentP;
}

// Tag a runner with the responsible pitcher at time of reaching base.
// Called at every "reaches base" moment: hit, walk, HBP, error, FC, etc.
export function tagRunnerResponsiblePitcher(state, runner) {
  if (!runner) return;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  runner.responsiblePitcherId = pitcher?.name || null;
  runner.responsiblePitcherSide = state.halfInning === 'top' ? 'home' : 'away';
}

// THE single scoring entry point. Charges R/ER to the pitcher who put the
// runner on base, not the current pitcher. This closes both the one-run-short
// bug (pitching R < line score R) and the ER > R bug.
export function chargeRun(state, runner, options = {}) {
  if (!runner) return;

  // 1. Batter's run stat
  runner.gameStats.runs = (runner.gameStats.runs || 0) + 1;

  // 2. Line score + inning tracking
  const team = state.halfInning === 'top' ? 'away' : 'home';
  state.score[team]++;
  if (state.innings[state.inning - 1]) {
    const half = state.halfInning === 'top' ? 'away' : 'home';
    if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
    state.innings[state.inning - 1][half]++;
  }

  // 3. Find the responsible pitcher (the one who put the runner on base)
  const pitcher = findResponsiblePitcher(state, runner);
  const pitcherName = pitcher?.name
    || (state.halfInning === 'top' ? state.homePitcher?.name : state.awayPitcher?.name)
    || 'Unknown';

  // 4. Log for W/L decision logic — use the RESPONSIBLE pitcher, not the
  //    current mound pitcher, so inherited runs don't misattribute the loss.
  logRun(state, pitcherName);

  // 5. Record per-run charge for headless sim scoring events
  if (!state._runCharges) state._runCharges = [];
  state._runCharges.push({ pitcherName, battingSide: team, inning: state.inning });

  // 6. Charge R/ER to the responsible pitcher
  if (pitcher && pitcher.gameStats) {
    // History entries (substituted pitchers) store pitching stats with a
    // `pitcher` prefix (pitcherR/pitcherER) to avoid collision with batting
    // fields. The current pitcher uses r/er directly. Increment the correct
    // field so inherited runs charged to a substituted pitcher actually
    // appear in the box score (which reads pitcherR ?? r).
    if ('pitcherR' in pitcher.gameStats) {
      pitcher.gameStats.pitcherR = (pitcher.gameStats.pitcherR || 0) + 1;
      if (!options.unearned) {
        pitcher.gameStats.pitcherER = (pitcher.gameStats.pitcherER || 0) + 1;
      }
    } else {
      pitcher.gameStats.r = (pitcher.gameStats.r || 0) + 1;
      if (!options.unearned) {
        pitcher.gameStats.er = (pitcher.gameStats.er || 0) + 1;
      }
    }
  }
}