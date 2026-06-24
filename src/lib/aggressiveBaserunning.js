// Aggressive baserunning logic — batter stretching hits into extra bases.
// Research-based frequencies (1980s era, more aggressive than modern baseball):
//
// BATTER STRETCHING:
// 1. Single→Double: ~8-12% of singles attempt (speed 4+), ~18% of attempts caught
// 2. Double→Triple: ~3-5% of doubles attempt (speed 5+), ~25% caught
// 3. Triple→Inside-the-park HR: ~0.5% of triples attempt (speed 8+ only), ~40% caught
//
// Sources: Baseball-Reference "Caught Stretching", Hardball Times baserunning data,
// FanGraphs baserunning metrics, Retrosheet historical play-by-play data.

import { pickLine, STRETCH_OUT_LINES, STRETCH_SUCCESS_LINES } from './commentaryLines';

/**
 * Checks if a batter attempts to stretch a hit into an extra-base hit.
 * Returns a result object describing what happened.
 *
 * @param {string} hitType - 'single', 'double', or 'triple'
 * @param {object} batter - batter player object (needs .speed and .name)
 * @param {number} ofArm - best outfield arm rating (1-10)
 * @returns {{type: string, text?: string}} result
 *   - {type: 'none'} — no stretch attempted
 *   - {type: 'caught', text} — thrown out (caller removes from base, records out)
 *   - {type: 'safe_double', text} — safe at 2nd (caller moves batter 1st→2nd)
 *   - {type: 'safe_triple', text} — safe at 3rd (caller moves batter 2nd→3rd)
 *   - {type: 'inside_park_hr', text} — inside-the-park HR (caller scores run, credits HR)
 */
export function checkBatterStretch(hitType, batter, ofArm) {
  const speed = batter.speed || 5;
  const speedFactor = speed / 10;

  let minSpeed, attemptChance, caughtChance;

  if (hitType === 'single') {
    // Single → Double: speed 4+ attempts, ~18% caught
    minSpeed = 4;
    attemptChance = 0.04 + speedFactor * 0.07;
    caughtChance = 0.10 + (ofArm / 10) * 0.18 - speedFactor * 0.12;
  } else if (hitType === 'double') {
    // Double → Triple: speed 5+ attempts, ~25% caught
    minSpeed = 5;
    attemptChance = 0.015 + speedFactor * 0.035;
    caughtChance = 0.15 + (ofArm / 10) * 0.20 - speedFactor * 0.12;
  } else if (hitType === 'triple') {
    // Triple → Inside-the-park HR: speed 8+ only, ~40% caught
    minSpeed = 8;
    attemptChance = 0.003 + speedFactor * 0.004;
    caughtChance = 0.30 + (ofArm / 10) * 0.15 - speedFactor * 0.08;
  } else {
    return { type: 'none' };
  }

  if (speed < minSpeed) return { type: 'none' };
  if (Math.random() >= attemptChance) return { type: 'none' };

  if (Math.random() < Math.max(0.03, Math.min(caughtChance, 0.45))) {
    return { type: 'caught', text: `❌ ${batter.name} ${pickLine(STRETCH_OUT_LINES)}` };
  }

  if (hitType === 'single') {
    return { type: 'safe_double', text: `${batter.name} ${pickLine(STRETCH_SUCCESS_LINES)}` };
  }
  if (hitType === 'double') {
    return { type: 'safe_triple', text: `${batter.name} ${pickLine(STRETCH_SUCCESS_LINES)}` };
  }
  return { type: 'inside_park_hr', text: `🎉 ${batter.name} ${pickLine(STRETCH_SUCCESS_LINES)}` };
}