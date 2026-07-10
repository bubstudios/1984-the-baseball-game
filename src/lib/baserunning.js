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
  for (let i = 0; i < 2; i++) {
    const r = state.bases[i];
    if (!r || state.bases[i + 1]) continue;
    if (r.speed <= 2) continue;
    if (r.speed <= 3 && Math.random() > 0.06) continue;
    if (r.speed <= 4 && Math.random() > 0.10) continue;
    let attemptChance = Math.max(0.03, 0.06 + (r.speed / 10) * 0.35 - armF - pitchF);
    if (r._heldClose) {
      attemptChance *= (1 - HOLDING_GAME_RATES.stealAttemptPenaltyRel);
    }
    if (Math.random() < attemptChance) return i;
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
  let sc = 0.30 + speedFactor * 0.55 - (catcherArm / 10) * 0.12 - (pCtrl / 10) * 0.03 - (pSpeed / 10) * 0.13;
  if (runner._heldClose) {
    sc -= HOLDING_GAME_RATES.stealSuccessPenalty;
    delete runner._heldClose;
  }
  sc = Math.max(0.08, Math.min(sc, 0.80));
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