// baserunning.js - Steal, double-steal, and baserunning decision logic.
// Extracted from gameEngine.js to reduce file size.

import { deepCopyState } from './deepCopyState';
import { STEAL_LINES, CAUGHT_STEALING_LINES, pickLine } from './commentaryLines';
import { getEffectivePitcher } from './pitcherFatigue';
import { HOLDING_GAME_RATES } from './holdingGame';
import { chargeRun } from './runScoring';
import {
  getCurrentPitcher, getBattingTeam, getDefensivePlayers,
  getCatcherArm, recordOut,
} from './gameEngine';

export function hasRunnersOnBase(state) { return state.bases.some(b => b !== null); }

export function setHitAndRun(state, active) {
  const ns = deepCopyState(state);
  ns.hitAndRun = active;
  return ns;
}

export function cpuDecideSteal(state) {
  if (state.outs >= 2) return -1;
  const defenders = getDefensivePlayers(state);
  const catcherArm = getCatcherArm(defenders);
  const pitcher = getCurrentPitcher(state);
  const effP = getEffectivePitcher(state) || pitcher;
  const armF = (catcherArm / 10) * 0.30;
  const pitchF = ((effP.effectivePitchSpeed || effP.pitchSpeed) / 10) * 0.12;
  const battingTeam = getBattingTeam(state);
  const battingScore = state.score[battingTeam];
  const fieldingScore = state.score[battingTeam === 'home' ? 'away' : 'home'];
  const margin = battingScore - fieldingScore;
  // Don't steal when trailing by 3+ or leading by 4+
  if (margin <= -3 || margin >= 4) return -1;

  // Cap repeat steal attempts per team per game (max 2 attempts, rare 3rd for elite)
  const stealCountKey = `${battingTeam}_stealAttempts`;
  const attemptsThisGame = state[stealCountKey] || 0;
  if (attemptsThisGame >= 2) return -1;

  // Avoid steal with a strong hitter at bat unless runner is elite (speed 9+)
  const battingLineup = battingTeam === 'home' ? state.homeLineup : state.awayLineup;
  const batterIdx = battingTeam === 'home' ? state.homeBatterIndex : state.awayBatterIndex;
  const dueUpBatter = battingLineup[batterIdx % battingLineup.length];
  if (dueUpBatter && (dueUpBatter.power || 0) >= 8) {
    // Strong power hitter at bat - only elite runners go
    for (let i = 0; i < 2; i++) {
      const r = state.bases[i];
      if (r && r.speed >= 8 && !state.bases[i + 1] && catcherArm < 9) return i;
    }
    return -1;
  }

  for (let i = 0; i < 2; i++) {
    const r = state.bases[i];
    if (!r || state.bases[i + 1]) continue;
    // Only fast runners attempt steals (speed 7+)
    if (r.speed < 7) continue;
    // Avoid elite catchers (arm 8+) unless elite runner (speed 9+)
    if (catcherArm >= 8 && r.speed < 9) continue;
    // Moderate attempt chance — target 0.50-0.75 attempts/team/game.
    // Structural gates (per-game cap, power-hitter block, blowout margin)
    // prevent a return to the high-steal version.
    let attemptChance = Math.max(0.07, 0.17 + (r.speed / 10) * 0.44 - armF - pitchF);
    // Third attempt of the game only for elite runners
    if (attemptsThisGame >= 2 && r.speed < 9) continue;
    if (r._heldClose) {
      attemptChance *= (1 - HOLDING_GAME_RATES.stealAttemptPenaltyRel);
    }
    if (Math.random() < attemptChance) {
      state[stealCountKey] = attemptsThisGame + 1;
      return i;
    }
  }
  return -1;
}

export function attemptSteal(state, baseIndex) {
  if (!state.bases[baseIndex]) return state;
  const newState = deepCopyState(state);
  // Use the CLONE from newState (shared with lineup via deepCopyState's reference Map),
  // NOT the original from state — otherwise gameStats.sb lands on the wrong object
  // and collectBatting (which reads from the lineup) never sees the SB.
  const runner = newState.bases[baseIndex];
  delete newState._wasReachBack;
  const speedFactor = runner.speed / 10;
  const pitcher = getCurrentPitcher(newState);
  const effP = getEffectivePitcher(newState) || pitcher;
  const defenders = getDefensivePlayers(newState);
  const catcherArm = getCatcherArm(defenders);
  const pSpeed = effP.effectivePitchSpeed || effP.pitchSpeed;
  const pCtrl = effP.effectiveControl || effP.control;
  // Offensive tuning: elite runners get a slightly higher success ceiling.
  // Speed 9 can now reach 0.83; speed 7 stays similar. Slow runners unchanged.
  // Offensive tuning: success rate boosted for qualifying speed-7+ runners.
  let sc = 0.39 + speedFactor * 0.68 - (catcherArm / 10) * 0.12 - (pCtrl / 10) * 0.03 - (pSpeed / 10) * 0.13;
  if (runner._heldClose) {
    sc -= HOLDING_GAME_RATES.stealSuccessPenalty;
    delete runner._heldClose;
  }
  sc = Math.max(0.08, Math.min(sc, 0.90));
  if (Math.random() < sc) {
    runner.gameStats.sb = (runner.gameStats.sb || 0) + 1;
    if (baseIndex + 1 >= 3) {
      // Steal of home - chargeRun charges the responsible pitcher
      chargeRun(newState, runner);
      newState.bases[baseIndex] = null;
      const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, 'home')}`;
      newState.log.push({ type: 'steal', text: stxt });
      newState.lastPlay = { type: 'steal', text: stxt };
      newState._celebrationBubble = stxt;
    } else {
      newState.bases[baseIndex + 1] = runner;
      newState.bases[baseIndex] = null;
      const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, ['second','third','home'][baseIndex])}`;
      newState.log.push({ type: 'steal', text: stxt });
      newState.lastPlay = { type: 'steal', text: stxt };
      newState._celebrationBubble = stxt;
    }
  } else {
    runner.gameStats.cs = (runner.gameStats.cs || 0) + 1;
    newState.bases[baseIndex] = null;
    recordOut(newState);
    const cstxt = `${runner.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, ['second','third','home'][baseIndex])} - ${pickLine(CAUGHT_STEALING_LINES)}`;
    newState.log.push({ type: 'caughtstealing', text: cstxt });
    newState.lastPlay = { type: 'caughtstealing', text: cstxt };
    newState._celebrationBubble = cstxt;
  }
  newState.pendingSteal = null;
  return newState;
}

export function attemptDoubleSteal(state) {
  if (!state.bases[0] || !state.bases[1]) return state;
  const newState = deepCopyState(state);
  // Use clones from newState (shared with lineup via deepCopyState's reference Map)
  const r1 = newState.bases[0];
  const r2 = newState.bases[1];
  delete newState._wasReachBack;
  const pitcher = getCurrentPitcher(newState);
  const effP = getEffectivePitcher(newState) || pitcher;
  const defenders = getDefensivePlayers(newState);
  const catcherArm = getCatcherArm(defenders);
  const pSpeed = effP.effectivePitchSpeed || effP.pitchSpeed;
  const pCtrl = effP.effectiveControl || effP.control;

  const sf2 = r2.speed / 10;
  let sc2 = 0.20 + sf2 * 0.55 - (catcherArm / 10) * 0.12 - (pCtrl / 10) * 0.03 - (pSpeed / 10) * 0.13;
  if (r2._heldClose) { sc2 -= HOLDING_GAME_RATES.stealSuccessPenalty; delete r2._heldClose; }
  sc2 = Math.max(0.08, Math.min(sc2, 0.80));

  const sf1 = r1.speed / 10;
  let sc1 = 0.40 + sf1 * 0.45 - (catcherArm / 10) * 0.04;
  sc1 = Math.max(0.20, Math.min(sc1, 0.92));

  if (Math.random() < sc2) {
    r2.gameStats.sb = (r2.gameStats.sb || 0) + 1;
    newState.bases[2] = r2; newState.bases[1] = null;
    newState.log.push({ type: 'steal', text: `🏃 ${r2.name} steals third on the double steal!` });
    if (Math.random() < sc1) {
      r1.gameStats.sb = (r1.gameStats.sb || 0) + 1;
      newState.bases[1] = r1; newState.bases[0] = null;
      const txt = `🏃 ${r1.name} swipes second - double steal success!`;
      newState.log.push({ type: 'steal', text: txt });
      newState.lastPlay = { type: 'steal', text: txt };
      newState._celebrationBubble = txt;
    } else {
      r1.gameStats.cs = (r1.gameStats.cs || 0) + 1;
      newState.bases[0] = null; recordOut(newState);
      const txt = `${r1.name} is caught stealing second - lead runner safe but double steal broken up!`;
      newState.log.push({ type: 'caughtstealing', text: txt });
      newState.lastPlay = { type: 'caughtstealing', text: txt };
      newState._celebrationBubble = txt;
    }
  } else {
    r2.gameStats.cs = (r2.gameStats.cs || 0) + 1;
    newState.bases[1] = null; recordOut(newState);
    if (Math.random() < Math.min(sc1 + 0.15, 0.95)) {
      r1.gameStats.sb = (r1.gameStats.sb || 0) + 1;
      newState.bases[1] = r1; newState.bases[0] = null;
      const txt = `${r2.name} is thrown out at third, but ${r1.name} steals second on the back end!`;
      newState.log.push({ type: 'caughtstealing', text: txt });
      newState.lastPlay = { type: 'caughtstealing', text: txt };
      newState._celebrationBubble = txt;
    } else {
      r1.gameStats.cs = (r1.gameStats.cs || 0) + 1;
      newState.bases[0] = null; recordOut(newState);
      const txt = `Double steal backfires - ${r2.name} nailed at third, ${r1.name} gunned down at second!`;
      newState.log.push({ type: 'caughtstealing', text: txt });
      newState.lastPlay = { type: 'caughtstealing', text: txt };
      newState._celebrationBubble = txt;
    }
  }
  newState.pendingSteal = null;
  return newState;
}