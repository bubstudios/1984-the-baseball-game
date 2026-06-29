// Holding Game — Balks & Pickoffs (Automatic, Exhibition Mode)
// All mechanics are fully automatic (no UI buttons) and reset every game.

export const HOLDING_GAME_RATES = {
  throwOverBaseChance: 0.50,
  lhpThrowOverMult: 1.4,
  pickoffOut: { R: 0.018, L: 0.045 },
  wildThrow: { R: 0.003, L: 0.004 },
  wildThrowDoubleAdvance: 0.20,
  stealSuccessPenalty: 0.10,
  stealAttemptPenaltyRel: 0.25,
  maxThrowOversPerPA: 3,
  balkPerPitch: 0.0007,
  lhpThrowOverBalkChance: 0.005,
  globalMultiplier: 1.0,
};

// ── Log message pools ──
export const THROW_OVER_NOTHING_LINES = [
  "{pitcher} steps off and throws to first — {runner} dives back. Lead trimmed.",
  "Throw over to first. {runner} gets back easily, but he's holding closer now.",
];

export const PICKOFF_OUT_LINES = [
  "PICKED OFF! {pitcher} catches {runner} leaning — he's out at first! 🔥",
  "Snap throw to first — {runner} is hung out to dry! Pickoff!",
];

export const WILD_THROW_LINES = [
  "{pitcher}'s pickoff throw sails past first — {runner} advances!",
  "Errant throw to first! {runner} hustles to second on the miscue.",
];

export const BALK_LINES = [
  "BALK! {pitcher} is called for a balk — runners move up. 🙄",
  "The umpire points — balk on {pitcher}. Runners advance.",
  "{pitcher} flinches on the mound — balk called, everybody up a base.",
];

// ── Helpers ──

export function pickHoldingLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

export function fillHoldingTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] || '');
}

export function getPitcherHand(pitcher) {
  const throws = (pitcher?.throws || 'R').toUpperCase();
  return throws.startsWith('L') ? 'L' : 'R';
}

// Runner is "steal-relevant" if they might steal (speed-based)
export function isStealRelevant(runner, outs) {
  if (!runner) return false;
  if (runner.speed < 6) return false;
  return true;
}

// ── Pure decision functions (no state mutation) ──

// Returns true if a balk occurs this pitch
export function decideBalk(state) {
  const hasRunner = state.bases.some(b => b !== null);
  if (!hasRunner) return false;
  const chance = HOLDING_GAME_RATES.balkPerPitch * HOLDING_GAME_RATES.globalMultiplier;
  return Math.random() < chance;
}

// Returns { shouldThrow, hand, runner, pitcherName } or null
export function decideThrowOver(state) {
  const runner = state.bases[0];
  if (!runner) return null;
  if (!isStealRelevant(runner, state.outs)) return null;

  // Only throw over to the lead runner — skip if runners are ahead on 2nd or 3rd
  if (state.bases[1] || state.bases[2]) return null;

  // Cap throw-overs per plate appearance
  const paKey = `${state.halfInning}_${state.inning}_${state.awayBatterIndex}_${state.homeBatterIndex}`;
  const count = (state._throwOverCount?.[paKey]) || 0;
  if (count >= HOLDING_GAME_RATES.maxThrowOversPerPA) return null;

  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  const hand = getPitcherHand(pitcher);

  // Base chance * LHP multiplier * steal rating factor * global multiplier
  const stealRating = runner.speed || 5;
  const stealFactor = 0.6 + (stealRating / 10) * 0.9; // 0.6x (speed 0) to 1.5x (speed 10)
  const handMult = hand === 'L' ? HOLDING_GAME_RATES.lhpThrowOverMult : 1.0;

  // Close & late bonus
  const isCloseLate = state.inning >= 7 && Math.abs(state.score.home - state.score.away) <= 1;
  const situationalMult = isCloseLate ? 1.1 : 1.0;

  const chance = HOLDING_GAME_RATES.throwOverBaseChance * handMult * stealFactor * situationalMult * HOLDING_GAME_RATES.globalMultiplier;

  if (Math.random() >= chance) return null;

  return { shouldThrow: true, hand, runner, pitcherName: pitcher?.name || 'The pitcher' };
}

// Resolve a throw-over outcome — returns { outcome, text } (no state mutation)
export function resolveThrowOverOutcome(hand, runnerName, pitcherName) {
  // LHP throw-over can be ruled a balk
  if (hand === 'L' && Math.random() < HOLDING_GAME_RATES.lhpThrowOverBalkChance * HOLDING_GAME_RATES.globalMultiplier) {
    return { outcome: 'balk', text: fillHoldingTemplate(pickHoldingLine(BALK_LINES), { pitcher: pitcherName }) };
  }

  const roll = Math.random();
  const pickoffRate = HOLDING_GAME_RATES.pickoffOut[hand] * HOLDING_GAME_RATES.globalMultiplier;
  const wildRate = HOLDING_GAME_RATES.wildThrow[hand] * HOLDING_GAME_RATES.globalMultiplier;

  if (roll < pickoffRate) {
    return {
      outcome: 'pickoff_out',
      text: fillHoldingTemplate(pickHoldingLine(PICKOFF_OUT_LINES), { pitcher: pitcherName, runner: runnerName }),
    };
  }
  if (roll < pickoffRate + wildRate) {
    const doubleAdvance = Math.random() < HOLDING_GAME_RATES.wildThrowDoubleAdvance;
    return {
      outcome: 'wild_throw',
      doubleAdvance,
      text: fillHoldingTemplate(pickHoldingLine(WILD_THROW_LINES), { pitcher: pitcherName, runner: runnerName }),
    };
  }
  return {
    outcome: 'nothing',
    text: fillHoldingTemplate(pickHoldingLine(THROW_OVER_NOTHING_LINES), { pitcher: pitcherName, runner: runnerName }),
  };
}