// Situational ratings — integer model.
// situational = base + platoonMod + tierMod, clamped 3-10.
// Home/road and day/night do NOT touch this number; they survive only as
// tiny league-average multipliers (contactMult/powerMult) for the engine.

import { getPitcherTier } from './pitcherQuality';

const HOME_MULT = 1.03;
const ROAD_MULT = 0.985;
const DAY_MULT = 1.015;
const NIGHT_MULT = 1.0;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

/**
 * Platoon modifier: exactly +1, 0, or -1.
 * Direction comes from the hitter's REAL split BA vs the pitcher's hand,
 * compared to his overall BA. Favorable → +1, unfavorable → -1,
 * neutral or insufficient data → 0. Hard-capped at one integer step.
 */
function getPlatoonMod(batter, pitcherHand) {
  if (!batter || !batter.splits || !pitcherHand) return 0;
  const split = pitcherHand === 'L' ? batter.splits.vsLHP : batter.splits.vsRHP;
  if (!split || split.ab < 20) return 0;
  const vl = batter.splits.vsLHP, vr = batter.splits.vsRHP;
  const totalAB = vl.ab + vr.ab;
  if (totalAB === 0) return 0;
  const overallBA = (vl.ba * vl.ab + vr.ba * vr.ab) / totalAB;
  if (overallBA === 0) return 0;
  if (split.ba > overallBA) return 1;
  if (split.ba < overallBA) return -1;
  return 0;
}

/**
 * Tier modifier from the current pitcher.
 * Elite (>=21) -> -1, Subpar (<=16) -> +1, Mid -> 0.
 */
function getTierMod(pitcher) {
  if (!pitcher) return 0;
  const tier = getPitcherTier(pitcher);
  if (tier === 'Elite') return -1;
  if (tier === 'Subpar') return 1;
  return 0;
}

/**
 * Calculate situational Contact and Power using the integer model.
 * Returns the displayed rating (base + platoon + tier, clamped 3-10)
 * plus gentle engine multipliers for home/road and day/night only.
 */
export function calculateSituationalRatings(batter, opposingPitcher, gameConditions = {}) {
  if (!batter) return { contact: 0, power: 0, baseContact: 0, basePower: 0, contactMult: 1, powerMult: 1, factors: [] };

  const baseContact = batter.contact;
  const basePower = batter.power;
  if (baseContact == null || basePower == null) {
    console.error('[situationalRatings] Missing base rating for ' + (batter.name || 'unknown batter'), batter);
  }

  const pitcherHand = opposingPitcher ? opposingPitcher.throws : null;
  const platoonMod = getPlatoonMod(batter, pitcherHand);
  const tierMod = getTierMod(opposingPitcher);

  // Integer model: base + platoonMod + tierMod, clamped 3-10
  const contact = clamp((baseContact || 0) + platoonMod + tierMod, 3, 10);
  const power = clamp((basePower || 0) + platoonMod + tierMod, 3, 10);

  // Engine multipliers: home/road and day/night only (tiny league-average effects)
  const isHome = gameConditions.isHome || false;
  const isNight = gameConditions.isNight !== false;
  const situationalMult = (isHome ? HOME_MULT : ROAD_MULT) * (isNight ? NIGHT_MULT : DAY_MULT);

  // Factors for display tooltip
  const factors = [];
  if (pitcherHand) {
    if (platoonMod > 0) factors.push('vs ' + pitcherHand + 'HP +');
    else if (platoonMod < 0) factors.push('vs ' + pitcherHand + 'HP -');
  }
  if (tierMod < 0) factors.push('Tough arm');
  else if (tierMod > 0) factors.push('Soft arm');
  factors.push(isHome ? 'Home' : 'Road');
  if (!isNight) factors.push('Day');

  return {
    contact,             // situational rating (base + platoon + tier), for display + engine
    power,               // situational rating (base + platoon + tier), for display + engine
    baseContact: baseContact || 0,  // RAW base, for card arrow comparison
    basePower: basePower || 0,      // RAW base
    contactMult: situationalMult,   // home/road/day only, for engine probability
    powerMult: situationalMult,     // home/road/day only, for engine probability
    factors,
  };
}

/**
 * Get CSS class for rating badge based on absolute value
 * Green: 8-10, White: 6-7, Amber: 4-5, Red: 1-3
 */
export function getRatingBadgeClass(situational) {
  if (situational >= 8) return 'text-emerald-400 font-bold';
  if (situational >= 6) return 'text-foreground font-bold';
  if (situational >= 4) return 'text-amber-400 font-bold';
  return 'text-red-400 font-bold';
}