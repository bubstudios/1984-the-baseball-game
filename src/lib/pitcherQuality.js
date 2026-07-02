// Pitcher quality penalty system based on real 1984 stats
// Derives BAA (Batting Average Against) and XBH/AB (Extra Base Hits per At-Bat)
// from pitcher ratings, calibrated to 1984 MLB league averages.
// Formula: ±1 contact per 15 BAA points from league avg, ±1 power per 1.5% XBH/AB from league avg

// 1984 MLB league averages (per team game from Baseball-Reference):
// BA .260 (H 8.88 / AB 34.16), XBH/AB 7.3% (2.48 XBH / 34.16 AB)
const LEAGUE_BAA = 0.260;
const LEAGUE_XBH_PER_AB = 0.073;

// Explicit overrides for pitchers with verified 1984 stats
// These take priority over derived values
const PITCHER_OVERRIDES = {
  "Dwight Gooden": { baa: 0.203, xbhPerAB: 0.049 },   // 161H/794AB, 39XBH/794AB
  "Walt Terrell": { baa: 0.282, xbhPerAB: 0.062 },    // 232H/823AB, 51XBH/823AB
};

/**
 * Derive BAA from pitcher ratings, calibrated to 1984 league average (.260)
 * BAA is primarily driven by control (location) and offSpeed (deception)
 */
function deriveBAA(pitcher) {
  const control = pitcher.effectiveControl || pitcher.control || 6;
  const offSpeed = pitcher.effectiveOffSpeed || pitcher.offSpeed || 6;
  const pitchSpeed = pitcher.effectivePitchSpeed || pitcher.pitchSpeed || 6;
  // Weighted composite: control matters most for preventing hits
  const composite = control * 0.45 + offSpeed * 0.35 + pitchSpeed * 0.20;
  // Each point above 6 -> BAA drops 0.020; each below -> rises 0.020
  const baa = LEAGUE_BAA + (6 - composite) * 0.020;
  return Math.max(0.150, Math.min(0.350, baa));
}

/**
 * Derive XBH/AB from pitcher ratings, calibrated to 1984 league average (.073)
 * XBH prevention is primarily driven by pitchSpeed (velocity) and offSpeed (deception)
 */
function deriveXBHPerAB(pitcher) {
  const control = pitcher.effectiveControl || pitcher.control || 6;
  const offSpeed = pitcher.effectiveOffSpeed || pitcher.offSpeed || 6;
  const pitchSpeed = pitcher.effectivePitchSpeed || pitcher.pitchSpeed || 6;
  // Weighted composite: pitchSpeed matters most for preventing extra bases
  const composite = pitchSpeed * 0.45 + offSpeed * 0.35 + control * 0.20;
  // Each point above 6 -> XBH/AB drops 0.008; each below -> rises 0.008
  const xbhPerAB = LEAGUE_XBH_PER_AB + (6 - composite) * 0.008;
  return Math.max(0.020, Math.min(0.120, xbhPerAB));
}

/**
 * Get pitcher's BAA - uses explicit override if available, otherwise derives from ratings
 */
export function getPitcherBAA(pitcher) {
  if (!pitcher) return LEAGUE_BAA;
  if (PITCHER_OVERRIDES[pitcher.name]) return PITCHER_OVERRIDES[pitcher.name].baa;
  if (pitcher.baa) return pitcher.baa;
  return deriveBAA(pitcher);
}

/**
 * Get pitcher's XBH/AB - uses explicit override if available, otherwise derives from ratings
 */
export function getPitcherXBHPerAB(pitcher) {
  if (!pitcher) return LEAGUE_XBH_PER_AB;
  if (PITCHER_OVERRIDES[pitcher.name]) return PITCHER_OVERRIDES[pitcher.name].xbhPerAB;
  if (pitcher.xbhPerAB) return pitcher.xbhPerAB;
  return deriveXBHPerAB(pitcher);
}

/**
 * Calculate batter rating adjustments based on pitcher quality
 * Uses BAA and XBH/AB compared to 1984 league averages
 * @param {Object} pitcher - Pitcher object (may include effective ratings from fatigue)
 * @returns {{ contactAdj: number, powerAdj: number, baa: number, xbhPerAB: number }}
 *   contactAdj: -3 to +3 (negative = pitcher suppresses contact)
 *   powerAdj: -3 to +3 (negative = pitcher suppresses power)
 */
export function getPitcherPenalty(pitcher) {
  if (!pitcher) return { contactAdj: 0, powerAdj: 0, baa: LEAGUE_BAA, xbhPerAB: LEAGUE_XBH_PER_AB };
  const baa = getPitcherBAA(pitcher);
  const xbhPerAB = getPitcherXBHPerAB(pitcher);
  // Contact: each 15 points of BAA below league avg = -1 to batter contact
  const contactAdj = -Math.round((LEAGUE_BAA - baa) / 0.015);
  // Power: each 1.5% of XBH/AB below league avg = -1 to batter power
  const powerAdj = -Math.round((LEAGUE_XBH_PER_AB - xbhPerAB) / 0.015);
  return {
    contactAdj: Math.max(-3, Math.min(3, contactAdj)),
    powerAdj: Math.max(-3, Math.min(3, powerAdj)),
    baa,
    xbhPerAB,
  };
}