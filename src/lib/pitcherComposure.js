/**
 * Pitcher Temperament & Composure System
 * 
 * Tracks emotional state during a game, affecting pitcher behavior and performance.
 * Composure drives volatile outcomes (wild pitches, HBP, errors) and behavior choices.
 */

// Pitcher archetypes (personality-based volatility & recovery profiles)
export const PITCHER_ARCHETYPES = {
  HOTHEAD: {
    name: 'Hothead',
    volatility: 10,      // 1-10: how easily upset
    recovery: 3,         // 1-10: how quickly they settle
    minorIssueChance: 0.15, // minor penalties (bad calls, close pitches)
    majorActionChance: 0.08,  // major actions (eject self, throw at batter, walk off)
  },
  STEADY_EDDY: {
    name: 'Steady Eddy',
    volatility: 3,
    recovery: 8,
    minorIssueChance: 0.03,
    majorActionChance: 0.01,
  },
  HEADCASE: {
    name: 'Head Case',
    volatility: 9,
    recovery: 2,
    minorIssueChance: 0.20,
    majorActionChance: 0.12,
  },
  PROFESSIONAL: {
    name: 'Professional',
    volatility: 4,
    recovery: 7,
    minorIssueChance: 0.04,
    majorActionChance: 0.02,
  },
  FIREBRAND: {
    name: 'Firebrand',
    volatility: 8,
    recovery: 6,
    minorIssueChance: 0.12,
    majorActionChance: 0.06,
  },
};

// Behavior zones (based on current composure %)
export const BEHAVIOR_ZONES = {
  LOCKED_IN: { min: 80, max: 100, label: 'Locked In', effect: 'improved' },
  NORMAL: { min: 50, max: 79, label: 'Normal', effect: 'baseline' },
  PRESSING: { min: 25, max: 49, label: 'Pressing', effect: 'erratic' },
  RED_ZONE: { min: 0, max: 24, label: 'Red Zone', effect: 'dangerous' },
};

/**
 * Initialize composure state for a pitcher
 */
export function initializePitcherComposure(pitcher, archetype = 'PROFESSIONAL') {
  const arch = PITCHER_ARCHETYPES[archetype] || PITCHER_ARCHETYPES.PROFESSIONAL;
  return {
    composure: 100,  // Start at 100% composure
    archetype: archetype,
    volatility: arch.volatility,
    recovery: arch.recovery,
    minorIssueChance: arch.minorIssueChance,
    majorActionChance: arch.majorActionChance,
    // Event counters (for recovery logic)
    strikeCount: 0,
    ballCount: 0,
    hitCount: 0,
    walkCount: 0,
    hbpCount: 0,
    wildPitchCount: 0,
    lastDeltaInning: 0,  // Track when last delta occurred
  };
}

/**
 * Get current behavior zone based on composure %
 */
export function getBehaviorZone(composure) {
  if (composure >= 80) return BEHAVIOR_ZONES.LOCKED_IN;
  if (composure >= 50) return BEHAVIOR_ZONES.NORMAL;
  if (composure >= 25) return BEHAVIOR_ZONES.PRESSING;
  return BEHAVIOR_ZONES.RED_ZONE;
}

/**
 * Apply an event delta to composure (strike, ball, hit, walk, HBP, etc.)
 * Returns delta object with newComposure and changeAmount
 */
export function applyEventDelta(composure, eventType, composureState, inning) {
  let delta = 0;
  const { volatility } = composureState;

  // Event deltas (negative = losing composure, positive = gaining)
  const DELTAS = {
    strike: +3,        // Good for pitcher
    ball: -2,          // Meh
    out: +5,           // Great
    single: -4,        // Bad
    double: -6,        // Worse
    triple: -8,        // Even worse
    homerun: -10,      // Worst case
    walk: -3,          // Annoying
    hbp: -8,           // Lost control
    wildpitch: -5,     // Embarrassing
    error: -4,         // Defense failed
    caughtstealing: +4, // Good
  };

  delta = DELTAS[eventType] || 0;

  // Volatility amplifies both gains and losses
  const volMult = 1 + (volatility - 5) * 0.05;  // -0.25 to +0.25
  delta = Math.round(delta * volMult);

  // Track event in composure state
  switch (eventType) {
    case 'strike':
      composureState.strikeCount = (composureState.strikeCount || 0) + 1;
      break;
    case 'ball':
      composureState.ballCount = (composureState.ballCount || 0) + 1;
      break;
    case 'single':
    case 'double':
    case 'triple':
      composureState.hitCount = (composureState.hitCount || 0) + 1;
      break;
    case 'homerun':
      composureState.hitCount = (composureState.hitCount || 0) + 1;
      break;
    case 'walk':
      composureState.walkCount = (composureState.walkCount || 0) + 1;
      break;
    case 'hbp':
      composureState.hbpCount = (composureState.hbpCount || 0) + 1;
      break;
    case 'wildpitch':
      composureState.wildPitchCount = (composureState.wildPitchCount || 0) + 1;
      break;
  }

  composureState.lastDeltaInning = inning;

  const newComposure = Math.max(0, Math.min(100, composure + delta));
  return { newComposure, delta };
}

/**
 * Recovery: each inning, pitcher recovers based on their recovery rating
 * Also resets event counters
 */
export function recoverComposure(composure, composureState) {
  const { recovery } = composureState;
  
  // Base recovery: 2-8 points per inning depending on recovery rating
  const baseRecovery = recovery * 0.8;
  
  // Bonus recovery if pitcher had a clean inning (few events)
  const recentEvents = (composureState.strikeCount || 0) 
    + (composureState.ballCount || 0) 
    + (composureState.hitCount || 0);
  
  const cleanInningBonus = recentEvents === 0 ? 5 : 0;
  
  const recovered = Math.min(100, composure + baseRecovery + cleanInningBonus);
  
  // Reset counters
  composureState.strikeCount = 0;
  composureState.ballCount = 0;
  composureState.hitCount = 0;
  composureState.walkCount = 0;
  
  return recovered;
}

/**
 * Determine if pitcher has a minor issue (wild pitch, bad pitch selection, etc.)
 * Based on current composure zone and archetype
 */
export function checkMinorIssue(composure, composureState) {
  const zone = getBehaviorZone(composure);
  const { minorIssueChance } = composureState;
  
  // Increase chance as composure drops
  const zoneMult = zone === BEHAVIOR_ZONES.LOCKED_IN ? 0.3 : 
                   zone === BEHAVIOR_ZONES.NORMAL ? 1.0 : 
                   zone === BEHAVIOR_ZONES.PRESSING ? 2.0 : 3.5;
  
  const finalChance = minorIssueChance * zoneMult;
  return Math.random() < finalChance;
}

/**
 * Determine if pitcher might take a major action (yell at umpire, throw at batter, etc.)
 * Only happens in pressing/red zone
 */
export function checkMajorAction(composure, composureState) {
  const zone = getBehaviorZone(composure);
  
  // Only in pressing or red zone
  if (zone !== BEHAVIOR_ZONES.PRESSING && zone !== BEHAVIOR_ZONES.RED_ZONE) {
    return null;
  }
  
  const { majorActionChance } = composureState;
  const zoneMult = zone === BEHAVIOR_ZONES.RED_ZONE ? 2.0 : 1.0;
  const finalChance = majorActionChance * zoneMult;
  
  if (Math.random() < finalChance) {
    // Pick an action
    const actions = ['argument', 'throwat', 'walkoff', 'wildpitch'];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  
  return null;
}