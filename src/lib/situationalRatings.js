// Situational ratings calculator — multiplicative, split-driven
// Card shows amplified numbers for readability; engine uses gentle multipliers.

import { getPitcherTier } from './pitcherQuality';

// League-average situational effects (small, honest, applied to everyone).
// Home field = +3% offense; day games = +1.5%. These are seasoning, not the meal.
const HOME_MULT = 1.03;
const ROAD_MULT = 0.985;
const DAY_MULT = 1.015;
const NIGHT_MULT = 1.0;

// How much the CARD amplifies the true effect for readability.
// engineMult moves gently; displayed rating exaggerates the same direction.
const CARD_AMPLIFY = 2.2;

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function calculateSituationalRatings(batter, opposingPitcher, gameConditions = {}) {
  if (!batter) return { contact: 0, power: 0, baseContact: 0, basePower: 0, contactMult: 1, powerMult: 1, factors: [] };

  const baseContact = batter.contact || 0;
  const basePower = batter.power || 0;
  const factors = [];

  // Multipliers accumulate around 1.0.
  let contactMult = 1;
  let powerMult = 1;

  // 1. PLATOON - the star. Real per-player split ratio vs the pitcher's hand.
  if (opposingPitcher && batter.splits) {
    const hand = opposingPitcher.throws;
    const split = hand === 'L' ? batter.splits.vsLHP : batter.splits.vsRHP;
    const vl = batter.splits.vsLHP, vr = batter.splits.vsRHP;
    if (split && split.ab >= 20 && vl && vr) {
      const totalAB = vl.ab + vr.ab;
      const overallBA = totalAB > 0 ? (vl.ba * vl.ab + vr.ba * vr.ab) / totalAB : 0.250;
      const overallHRR = totalAB > 0 ? (vl.hr + vr.hr) / totalAB : 0.020;

      // Contact ratio vs this hand, dampened so extreme small-sample splits don't explode.
      const rawBaRatio = overallBA > 0 ? split.ba / overallBA : 1;
      const baRatio = 1 + (rawBaRatio - 1) * 0.8; // 80% of the real gap
      contactMult *= clamp(baRatio, 0.75, 1.30);

      const splitHRR = split.ab > 0 ? split.hr / split.ab : overallHRR;
      const rawHRRatio = overallHRR > 0 ? splitHRR / overallHRR : 1;
      const hrRatio = 1 + (rawHRRatio - 1) * 0.7;
      powerMult *= clamp(hrRatio, 0.6, 1.5);

      factors.push(hand === 'L'
        ? `vs LHP .${(split.ba * 1000) | 0}`
        : `vs RHP .${(split.ba * 1000) | 0}`);
    }
  }

  // 2. HOME/ROAD - league-average multiplier (no per-player data, keep modest).
  const isHome = gameConditions.isHome || false;
  contactMult *= isHome ? HOME_MULT : ROAD_MULT;
  powerMult *= isHome ? HOME_MULT : ROAD_MULT;
  factors.push(isHome ? 'Home' : 'Road');

  // 3. DAY/NIGHT - league-average multiplier.
  const isNight = gameConditions.isNight !== false;
  if (!isNight) { contactMult *= DAY_MULT; powerMult *= DAY_MULT; factors.push('Day'); }

  // 4. PITCHER TIER - Elite/Mid/Subpar based on SPD+OFF+CTL sum.
  // Elite (>=21): batter -1 C/P. Subpar (<=16): batter +1 C/P. Mid: no change.
  // Engine multiplier 0.92/1.08 yields exactly +/-1 on the amplified display rating.
  if (opposingPitcher) {
    const tier = getPitcherTier(opposingPitcher);
    if (tier === 'Elite') {
      contactMult *= 0.92;
      powerMult *= 0.92;
      factors.push('Tough arm');
    } else if (tier === 'Subpar') {
      contactMult *= 1.08;
      powerMult *= 1.08;
      factors.push('Soft arm');
    }
  }

  // 5. HEAD-TO-HEAD (optional, if provided) - small nudge, real data only.
  if (gameConditions.h2hStats && gameConditions.h2hStats.ab >= 15) {
    const h2h = gameConditions.h2hStats;
    const overallBA = batter.splits
      ? (() => {
          const vl = batter.splits.vsLHP, vr = batter.splits.vsRHP;
          const ta = (vl?.ab || 0) + (vr?.ab || 0);
          return ta > 0 ? ((vl?.ba || 0) * (vl?.ab || 0) + (vr?.ba || 0) * (vr?.ab || 0)) / ta : 0.250;
        })()
      : 0.250;
    const r = overallBA > 0 ? (h2h.ba || 0.250) / overallBA : 1;
    const h2hMult = 1 + (r - 1) * 0.3; // small
    contactMult *= clamp(h2hMult, 0.85, 1.20);
    if (r > 1.1) factors.push(`Owns him .${((h2h.ba || 0) * 1000) | 0}`);
    else if (r < 0.9) factors.push(`Struggles .${((h2h.ba || 0) * 1000) | 0}`);
  }

  // — Produce the AMPLIFIED display rating (card) —
  // Displayed delta = base * (mult - 1) * CARD_AMPLIFY, added to base, then round+clamp.
  // This makes a modest true edge SHOW as a bigger, jump-out number.
  const dispContact = clamp(Math.round(baseContact + baseContact * (contactMult - 1) * CARD_AMPLIFY), 1, 10);
  const dispPower = clamp(Math.round(basePower + basePower * (powerMult - 1) * CARD_AMPLIFY), 1, 10);

  return {
    contact: dispContact, // amplified, for the card
    power: dispPower, // amplified, for the card
    baseContact, // so the card can draw the arrow vs base
    basePower,
    contactMult, // GENTLE true multiplier, for the engine
    powerMult, // GENTLE true multiplier, for the engine
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