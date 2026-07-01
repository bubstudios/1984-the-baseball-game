// Situational ratings calculator for lineup manager
// Adjusts player ratings (1-10 scale) based on:
// - Time of day (day/night)
// - Location (home/road)
// - Pitcher matchup (platoon)
// - Head-to-head history

/**
 * Calculate situational ratings for a batter vs opposing pitcher
 * @param {Object} batter - Player object with contact, power, bats
 * @param {Object} opposingPitcher - Pitcher object with throws
 * @param {Object} gameConditions - { isNight, isHome, h2hStats }
 * @returns {Object} { contact: 1-10, power: 1-10, factors: string[] }
 */
export function calculateSituationalRatings(batter, opposingPitcher, gameConditions = {}) {
  if (!batter) return { contact: 0, power: 0, factors: [] };
  
  const factors = [];
  let contactMod = 0;
  let powerMod = 0;
  
  // Base ratings from player card
  const baseContact = batter.contact || 0;
  const basePower = batter.power || 0;
  
  // 1. Platoon advantage/disadvantage
  if (opposingPitcher) {
    const batterBats = batter.bats;
    const pitcherThrows = opposingPitcher.throws;
    
    if (batterBats && pitcherThrows) {
      if (batterBats === 'L' && pitcherThrows === 'R') {
        contactMod += 1;
        powerMod += 1;
        factors.push('L vs RHP');
      } else if (batterBats === 'R' && pitcherThrows === 'L') {
        contactMod += 1;
        powerMod += 1;
        factors.push('R vs LHP');
      } else if (batterBats === pitcherThrows) {
        contactMod -= 2;
        powerMod -= 2;
        factors.push('Same hand');
      }
    }
  }
  
  // 2. Day/Night splits (simulated - would need actual stats)
  if (gameConditions.isNight !== undefined) {
    // Some players hit better at night under lights
    // For now, apply small random modifier based on player name hash
    const nameHash = batter.name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    if (gameConditions.isNight) {
      if (nameHash % 3 === 0) {
        contactMod += 1;
        factors.push('Night hitter');
      } else if (nameHash % 3 === 1) {
        contactMod -= 1;
        powerMod -= 1;
        factors.push('Day hitter');
      }
    }
  }
  
  // 3. Home/Road splits
  if (gameConditions.isHome !== undefined) {
    if (gameConditions.isHome) {
      contactMod += 1;
      factors.push('Home field');
    } else {
      contactMod -= 1;
      factors.push('Road');
    }
  }
  
  // 4. Head-to-head history (if available)
  if (gameConditions.h2hStats) {
    const { ab, hits, hr, avg } = gameConditions.h2hStats;
    if (ab >= 10) { // Need meaningful sample
      if (avg >= 0.350) {
        contactMod += 2;
        factors.push('Owns this pitcher');
      } else if (avg <= 0.150) {
        contactMod -= 2;
        powerMod -= 1;
        factors.push('Struggles vs this pitcher');
      }
      if (hr >= 2) {
        powerMod += 1;
        factors.push('HR history');
      }
    }
  }
  
  // Apply modifiers and clamp to 1-10
  const finalContact = Math.max(1, Math.min(10, baseContact + contactMod));
  const finalPower = Math.max(1, Math.min(10, basePower + powerMod));
  
  return {
    contact: finalContact,
    power: finalPower,
    factors,
  };
}

/**
 * Get CSS class for rating badge based on situational vs base rating
 * @param {number} situational - Adjusted rating (1-10)
 * @param {number} base - Original rating (1-10)
 * @returns {string} CSS class
 */
export function getRatingBadgeClass(situational, base) {
  if (situational >= 8) return 'text-emerald-400 font-bold';
  if (situational >= 6) return 'text-foreground font-bold';
  if (situational >= 4) return 'text-amber-400 font-bold';
  return 'text-red-400 font-bold';
}