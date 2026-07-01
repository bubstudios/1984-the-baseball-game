// Situational ratings calculator for lineup manager
// Adjusts player ratings (1-10 scale) based on:
// - Time of day (day/night)
// - Location (home/road)
// - Pitcher matchup (platoon)
// - Head-to-head history

/**
 * Calculate situational ratings for a batter vs opposing pitcher
 * Matches the game engine's getSituationalBatter() logic (without count modifiers)
 * @param {Object} batter - Player object with contact, power, bats, splits
 * @param {Object} opposingPitcher - Pitcher object with throws
 * @param {Object} gameConditions - { isNight, isHome, h2hStats }
 * @returns {Object} { contact: 1-10, power: 1-10, factors: string[] }
 */
export function calculateSituationalRatings(batter, opposingPitcher, gameConditions = {}) {
  if (!batter) return { contact: 0, power: 0, factors: [] };
  
  const factors = [];
  
  // Start with base card ratings
  let adjContact = batter.contact || 0;
  let adjPower = batter.power || 0;
  
  // 1. Splits adjustment (vs LHP/RHP) - matches game engine's getSplitAdjustedPlayer
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
      adjContact = Math.max(1, Math.min(10, Math.round(batter.contact * baR)));
      const sHRR = split.ab > 0 ? split.hr / split.ab : 0;
      const hRR = oHRR > 0 ? sHRR / oHRR : 1;
      const cHRR = Math.max(0.4, Math.min(hRR, 1.8));
      adjPower = Math.max(1, Math.min(10, Math.round(batter.power * cHRR)));
      factors.push(pitcherHand === 'L' ? 'vs LHP' : 'vs RHP');
    }
  }
  
  // 2. Home/Road splits (3% boost at home)
  const isHome = gameConditions.isHome || false;
  const hcm = isHome ? 1.03 : 0.98;
  const hpm = isHome ? 1.03 : 0.97;
  adjContact = Math.round(adjContact * hcm);
  adjPower = Math.round(adjPower * hpm);
  factors.push(isHome ? 'Home field' : 'Road');
  
  // 3. Day/Night (2% boost for day hitters)
  const isDay = gameConditions.isNight === false;
  const dcm = isDay ? 1.02 : 0.99;
  const dpm = isDay ? 1.01 : 1.00;
  adjContact = Math.round(adjContact * dcm);
  adjPower = Math.round(adjPower * dpm);
  if (isDay) factors.push('Day game');
  
  // 4. Pitcher quality adjustment — different pitchers produce different ratings
  // Control mainly affects contact, pitchSpeed mainly affects power, offSpeed affects both
  if (opposingPitcher) {
    const controlDiff = (opposingPitcher.control || 6) - 6;
    const speedDiff = (opposingPitcher.pitchSpeed || 6) - 6;
    const offDiff = (opposingPitcher.offSpeed || 6) - 6;
    adjContact -= controlDiff + Math.round(offDiff * 0.5);
    adjPower -= speedDiff + Math.round(offDiff * 0.5);
  }
  
  // Clamp final ratings to 1-10
  const finalContact = Math.max(1, Math.min(10, adjContact));
  const finalPower = Math.max(1, Math.min(10, adjPower));
  
  return {
    contact: finalContact,
    power: finalPower,
    factors,
  };
}

/**
 * Get CSS class for rating badge based on situational vs base rating
 * Shows green if boosted, red if reduced, otherwise color by absolute value
 * @param {number} situational - Adjusted rating (1-10)
 * @param {number} base - Original rating (1-10)
 * @returns {string} CSS class
 */
export function getRatingBadgeClass(situational, base) {
  // Show direction of adjustment
  if (situational > base) return 'text-emerald-400 font-bold';  // Boosted
  if (situational < base) return 'text-red-400 font-bold';      // Reduced
  // Neutral - color by absolute value
  if (situational >= 8) return 'text-emerald-400 font-bold';
  if (situational >= 6) return 'text-foreground font-bold';
  if (situational >= 4) return 'text-amber-400 font-bold';
  return 'text-red-400 font-bold';
}