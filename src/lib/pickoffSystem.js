// pickoffSystem.js - Lightweight automatic pickoff attempt system.
// Fires before pitch delivery as a rare, structured flavor event.
// NOT a user button or mini-game — just an occasional automatic event.

import { getCurrentPitcher, getBattingTeam, getDefensivePlayers, getCatcherArm, recordOut } from './gameEngineHelpers';
import { getEffectivePitcher } from './pitcherFatigue';
import { chargeRun } from './runScoring';

const BASE_NAMES = ['first', 'second', 'third'];

const SAFE_BACK_LINES = [
  (r, p, b) => `Throw over — ${r} dives back to ${b} safely.`,
  (r, p, b) => `Quick throw to ${b} — ${r} back in time.`,
  (r, p, b) => `${p} throws over — ${r} slides in safe.`,
  (r, p, b) => `Throw to ${b} — ${r} beats it back.`,
  (r, p, b) => `${p} checks ${r} at ${b} — safe.`,
];

const PICKED_OFF_LINES = [
  (r, p, b) => `Picked off! ${r} caught leaning at ${b}.`,
  (r, p, b) => `Got him! ${p} catches ${r} napping at ${b}.`,
  (r, p, b) => `Picked off ${b}! ${r} was dead to rights.`,
  (r, p, b) => `${p} picks off ${r} at ${b}!`,
];

const THROW_AWAY_LINES = [
  (r, p, b) => `Bad throw! ${r} moves up on the error.`,
  (r, p, b) => `Wild throw to ${b} — ${r} advances!`,
  (r, p, b) => `${p} throws it away — ${r} takes the extra base.`,
];

const RUNDOWN_LINES = [
  (r, p, b) => `Rundown! ${r} caught in no man's land.`,
  (r, p, b) => `Hot box! ${r} is in a rundown at ${b}.`,
];

function pickLine(lines, ...args) {
  return lines[Math.floor(Math.random() * lines.length)](...args);
}

/**
 * Attempt an automatic pickoff before pitch delivery.
 * Mutates state in place (state is already deep-copied by processAtBat).
 * Returns the state (possibly modified with pickoff result).
 */
export function maybeAttemptPickoff(state) {
  // Only attempt if there are runners on base
  if (!state.bases.some(b => b !== null)) return state;

  // Don't attempt if a steal is pending (pickoffs must not coincide with pitch/steal)
  if (state.pendingSteal !== null && state.pendingSteal !== undefined) return state;

  // Reset per-plate-appearance counter on fresh count (0-0 = new PA)
  if (state.balls === 0 && state.strikes === 0) {
    state._pickoffAttemptsPA = 0;
  }

  // Per-PA cap: max 2 attempts
  if ((state._pickoffAttemptsPA || 0) >= 2) return state;

  // Per-team-per-game cap
  const battingTeam = getBattingTeam(state);
  const pitchingSide = battingTeam === 'home' ? 'away' : 'home';
  const teamAttemptKey = `${pitchingSide}_pickoffAttempts`;
  const teamAttempts = state[teamAttemptKey] || 0;
  const hasEliteThreat = state.bases.some(r => r && r.speed >= 9);
  if (teamAttempts >= 4 && !hasEliteThreat) return state;
  if (teamAttempts >= 6) return state; // hard cap

  // Choose target base: 80% 1st, 17% 2nd, 3% 3rd
  const roll = Math.random();
  let targetBase;
  if (roll < 0.80) targetBase = 0;
  else if (roll < 0.97) targetBase = 1;
  else targetBase = 2;

  // If target base has no runner, fall back to lead-most occupied base
  if (!state.bases[targetBase]) {
    for (let i = 0; i < 3; i++) {
      if (state.bases[i]) { targetBase = i; break; }
    }
  }

  const runner = state.bases[targetBase];
  if (!runner) return state;

  // ── Attempt chance calculation ──
  const speed = runner.speed || 5;
  let attemptChance;
  if (speed >= 9) attemptChance = 0.05;       // elite steal threat
  else if (speed >= 7) attemptChance = 0.03;   // fast runner
  else if (speed >= 5) attemptChance = 0.01;   // normal runner
  else attemptChance = 0.005;                   // slow runner (very rare)

  // Modifiers
  const stealAttemptKey = `${battingTeam}_stealAttempts`;
  if ((state[stealAttemptKey] || 0) > 0) attemptChance += 0.01; // runner already stole

  const pitcher = getCurrentPitcher(state);
  const effP = getEffectivePitcher(state) || pitcher;
  const pitcherControl = effP.effectiveControl || effP.control || 5;
  if (pitcherControl >= 8) attemptChance += 0.01; // good hold move

  // Blowout: reduce heavily
  const battingScore = state.score[battingTeam];
  const fieldingScore = state.score[pitchingSide];
  const margin = Math.abs(battingScore - fieldingScore);
  if (margin >= 5) attemptChance *= 0.2;
  else if (margin >= 3) attemptChance *= 0.5;

  // Two outs with slow runner: almost never
  if (state.outs >= 2 && speed < 7) attemptChance *= 0.1;

  // Roll for attempt
  if (Math.random() >= attemptChance) return state;

  // ── Attempt happens ──
  state._pickoffAttemptsPA = (state._pickoffAttemptsPA || 0) + 1;
  state[teamAttemptKey] = teamAttempts + 1;

  const runnerName = runner.name;
  const pitcherName = pitcher.name;
  const baseName = BASE_NAMES[targetBase];

  // ── Success chance ──
  let successChance = 0.03; // normal: 2-4%
  if (speed >= 9 && pitcherControl >= 8) successChance = 0.07; // great move vs aggressive
  else if (speed >= 8 && state.outs < 2) successChance = 0.05; // aggressive runner

  // Sleeping runner rare event (5% of attempts)
  const isSleeping = Math.random() < 0.05;
  if (isSleeping) successChance = 0.11;

  // ── Determine result ──
  const throwAwayChance = 0.015; // rare
  const rundownChance = 0.005;  // very rare
  const resultRoll = Math.random();

  let result;
  if (resultRoll < successChance) {
    result = 'picked_off';
  } else if (resultRoll < successChance + throwAwayChance) {
    result = 'throw_away';
  } else if (resultRoll < successChance + throwAwayChance + rundownChance) {
    result = 'rundown';
  } else {
    result = 'safe_back';
  }

  // ── Apply result ──
  let logText = '';
  let pickoffTracking = null;

  if (result === 'safe_back') {
    logText = pickLine(SAFE_BACK_LINES, runnerName, pitcherName, baseName);
    pickoffTracking = { result: 'safe_back', runner: runnerName, base: targetBase };
  } else if (result === 'picked_off') {
    logText = pickLine(PICKED_OFF_LINES, runnerName, pitcherName, baseName);
    // Remove runner, record out
    state.bases[targetBase] = null;
    runner.gameStats.po = (runner.gameStats.po || 0) + 1; // picked off
    pitcher.gameStats.po = (pitcher.gameStats.po || 0) + 1; // pickoff credit
    recordOut(state);
    pickoffTracking = { result: 'picked_off', runner: runnerName, base: targetBase, pitcher: pitcherName, elite: speed >= 9 };
  } else if (result === 'throw_away') {
    logText = pickLine(THROW_AWAY_LINES, runnerName, pitcherName, baseName);
    // Runner advances one base if next base is open
    if (targetBase + 1 >= 3) {
      // Runner on 3rd scores on the error
      chargeRun(state, runner);
      state.bases[targetBase] = null;
    } else if (!state.bases[targetBase + 1]) {
      state.bases[targetBase + 1] = runner;
      state.bases[targetBase] = null;
    }
    // Charge error to pitcher
    pitcher.gameStats.err = (pitcher.gameStats.err || 0) + 1;
    if (pitchingSide === 'home') state.homeErrors = (state.homeErrors || 0) + 1;
    else state.awayErrors = (state.awayErrors || 0) + 1;
    pickoffTracking = { result: 'throw_away', runner: runnerName, base: targetBase, pitcher: pitcherName };
  } else if (result === 'rundown') {
    logText = pickLine(RUNDOWN_LINES, runnerName, pitcherName, baseName);
    // 90% out, 10% safe at next base
    if (Math.random() < 0.90) {
      state.bases[targetBase] = null;
      runner.gameStats.po = (runner.gameStats.po || 0) + 1;
      pitcher.gameStats.po = (pitcher.gameStats.po || 0) + 1;
      recordOut(state);
      logText += ` ${runnerName} is tagged out!`;
      pickoffTracking = { result: 'picked_off', runner: runnerName, base: targetBase, pitcher: pitcherName, elite: speed >= 9, viaRundown: true };
    } else {
      // Safe at next base
      if (targetBase + 1 >= 3) {
        chargeRun(state, runner);
        state.bases[targetBase] = null;
        logText += ` ${runnerName} slides in safe at home!`;
      } else {
        state.bases[targetBase + 1] = runner;
        state.bases[targetBase] = null;
        logText += ` ${runnerName} evades the tag and is safe!`;
      }
      pickoffTracking = { result: 'safe_rundown', runner: runnerName, base: targetBase };
    }
  }

  // Add log entry and set banner display
  state.log.push({ type: 'pickoff', text: logText });
  state._celebrationBubble = logText;
  state.lastPlay = { type: 'pickoff', text: logText };
  state._pickoffEvent = pickoffTracking;

  // Clear pending steal if runner was picked off (no steal can happen)
  if (result === 'picked_off' || (result === 'rundown' && pickoffTracking.result === 'picked_off')) {
    state.pendingSteal = null;
  }

  // Check for walk-off (runner picked off to end game in bottom 9+)
  if (state.halfInning === 'bottom' && state.inning >= 9 && state.score.home > state.score.away && !state.gameOver) {
    state.gameOver = true;
    state.waitingForInput = false;
    const homeTeam = state.homeTeam;
    const TEAMS_LOCAL = null; // can't import here without circular dep
    state.log.push({ type: 'info', text: `🎉 Walk-off! The home team wins ${state.score.home}-${state.score.away}!` });
  }

  return state;
}