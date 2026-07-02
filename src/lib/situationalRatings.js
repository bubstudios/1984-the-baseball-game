// Situational ratings calculator for lineup manager
// Adjusts player ratings (1-10 scale) based on:
// - Platoon matchup (±1-2 points) — uses real career BA/HR splits
// - Home/road (±1 point)
// - Day/night (±1 point)
// - Pitcher quality (based on real pitcher ratings)
// - Head-to-head history (when available, ±1-2 points)

/**
 * Calculate situational ratings for a batter vs opposing pitcher
 * @param {Object} batter - Player object with contact, power, bats, splits
 * @param {Object} opposingPitcher - Pitcher object with throws, control, pitchSpeed, offSpeed
 * @param {Object} gameConditions - { isNight, isHome, h2hStats }
 * @returns {Object} { contact: 1-10, power: 1-10, factors: string[] }
 */
export function calculateSituationalRatings(batter, opposingPitcher, gameConditions = {}) {
  if (!batter) return { contact: 0, power: 0, factors: [] };

  const factors = [];
  let adjContact = batter.contact || 0;
  let adjPower = batter.power || 0;

  // 1. Platoon/splits adjustment (±1 point) — additive, based on real career BA/HR splits vs LHP/RHP
  if (opposingPitcher && batter.splits) {
    const pitcherHand = opposingPitcher.throws;
    const split = pitcherHand === 'L' ? batter.splits.vsLHP : batter.splits.vsRHP;
    if (split && split.ab >= 20) {
      const vl = batter.splits.vsLHP;
      const vr = batter.splits.vsRHP;
      const ta = vl.ab + vr.ab;
      const th = vl.ba * vl.ab + vr.ba * vr.ab;
      const oBA = ta > 0 ? th / ta : 0.250;
      const tHR = vl.hr + vr.hr;
      const oHRR = ta > 0 ? tHR / ta : 0.020;
      const baR = oBA > 0 ? split.ba / oBA : 1;
      // Additive: +1 for strong platoon edge, -1 for strong disadvantage
      if (baR >= 1.12) adjContact += 1;
      else if (baR <= 0.88) adjContact -= 1;
      const sHRR = split.ab > 0 ? split.hr / split.ab : 0;
      const hRR = oHRR > 0 ? sHRR / oHRR : 1;
      if (hRR >= 1.30) adjPower += 1;
      else if (hRR <= 0.70) adjPower -= 1;
      factors.push(pitcherHand === 'L' ? `vs LHP (.${(split.ba * 1000 | 0)} BA)` : `vs RHP (.${(split.ba * 1000 | 0)} BA)`);
    }
  }

  // 2. Home/Road (±1 point)
  const isHome = gameConditions.isHome || false;
  if (isHome) {
    adjContact += 1;
    adjPower += 1;
    factors.push('Home +1');
  } else {
    adjContact -= 1;
    adjPower -= 1;
    factors.push('Road -1');
  }

  // 3. Day/Night (±1 point)
  const isNight = gameConditions.isNight !== false;
  if (!isNight) {
    adjContact += 1;
    adjPower += 1;
    factors.push('Day game +1');
  } else {
    factors.push('Night game');
  }

  // 4. Pitcher quality — halved deltas to compress range
  if (opposingPitcher) {
    const controlDiff = (opposingPitcher.control || 6) - 6;
    const speedDiff = (opposingPitcher.pitchSpeed || 6) - 6;
    const offDiff = (opposingPitcher.offSpeed || 6) - 6;
    const contactAdj = Math.round(controlDiff * 0.5) + Math.round(offDiff * 0.25);
    const powerAdj = Math.round(speedDiff * 0.5) + Math.round(offDiff * 0.25);
    adjContact -= contactAdj;
    adjPower -= powerAdj;
    const parts = [];
    if (contactAdj > 0) parts.push(`CTL -${contactAdj}`);
    else if (contactAdj < 0) parts.push(`CTL +${-contactAdj}`);
    if (powerAdj > 0) parts.push(`SPD -${powerAdj}`);
    else if (powerAdj < 0) parts.push(`SPD +${-powerAdj}`);
    if (parts.length > 0) factors.push(`Pitcher: ${parts.join(', ')}`);
  }

  // 5. Head-to-head history (when available, ±1-2 points)
  if (gameConditions.h2hStats && opposingPitcher) {
    const h2h = gameConditions.h2hStats;
    if (h2h.ab >= 10) {
      const h2hBA = h2h.ba || 0.250;
      const batterOverall = batter.splits
        ? (() => {
            const vl = batter.splits.vsLHP;
            const vr = batter.splits.vsRHP;
            const ta = (vl?.ab || 0) + (vr?.ab || 0);
            const th = (vl?.ba || 0) * (vl?.ab || 0) + (vr?.ba || 0) * (vr?.ab || 0);
            return ta > 0 ? th / ta : 0.250;
          })()
        : 0.250;
      const ratio = batterOverall > 0 ? h2hBA / batterOverall : 1;
      if (ratio > 1.15) {
        adjContact += 2;
        adjPower += 1;
        factors.push(`H2H: .${(h2hBA * 1000 | 0)} BA (+2)`);
      } else if (ratio > 1.05) {
        adjContact += 1;
        factors.push(`H2H: .${(h2hBA * 1000 | 0)} BA (+1)`);
      } else if (ratio < 0.85) {
        adjContact -= 2;
        adjPower -= 1;
        factors.push(`H2H: .${(h2hBA * 1000 | 0)} BA (-2)`);
      } else if (ratio < 0.95) {
        adjContact -= 1;
        factors.push(`H2H: .${(h2hBA * 1000 | 0)} BA (-1)`);
      }
    }
  }

  // Clamp final ratings to 1-10
  const finalContact = Math.max(1, Math.min(10, adjContact));
  const finalPower = Math.max(1, Math.min(10, adjPower));

  return { contact: finalContact, power: finalPower, factors };
}

/**
 * Get CSS class for rating badge based on absolute value
 * Green: 8-10, White: 6-7, Amber: 4-5, Red: 1-3
 * @param {number} situational - Adjusted rating (1-10)
 * @param {number} base - Original rating (1-10, unused but kept for API compat)
 * @returns {string} CSS class
 */
export function getRatingBadgeClass(situational, base) {
  if (situational >= 8) return 'text-emerald-400 font-bold';
  if (situational >= 6) return 'text-foreground font-bold';
  if (situational >= 4) return 'text-amber-400 font-bold';
  return 'text-red-400 font-bold';
}