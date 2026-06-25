/**
 * Pitcher Temperament & Composure System (Phase 2.5)
 * 
 * Tracks emotional state during a game on a 0–100 scale.
 * - Events have base deltas (scaled 0–100)
 * - Situational leverage multiplies deltas: inning_weight × score_situation_weight
 * - Recovery is gated: no healing after blowing a lead
 * - Carryover cap prevents full reset after blown leads (damage lingers)
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
    composure: 100,  // Start at 100 (0–100 scale)
    baseline: 100,   // Original composure (for gated recovery checks)
    recovery_cap: 100,  // Max recovery ceiling after blown lead (ratchets down)
    archetype: archetype,
    volatility: arch.volatility,
    recovery: arch.recovery,
    minorIssueChance: arch.minorIssueChance,
    majorActionChance: arch.majorActionChance,
    strikeCount: 0,
    ballCount: 0,
    hitCount: 0,
    walkCount: 0,
    hbpCount: 0,
    wildPitchCount: 0,
    lastDeltaInning: 0,
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
 * Apply an event delta to composure (0–100 scale).
 * Leverage multiplier = inning_weight × score_situation_weight
 * Returns { newComposure, delta, changeAmount }
 */
export function applyEventDelta(composureState, eventType, leverage = 1.0) {
   let delta = 0;
   const composure = composureState.composure;
   const { volatility } = composureState;

  // Base deltas on 0–100 scale (before leverage)
   const DELTAS = {
     strikeout: +5,     // Good
     out: +3,           // Decent
     foul: +1,          // Minor
     caughtstealing: +4, // Good
     walk: -7,          // Bad
     walk_after_0_2: -12, // Worse (walks after 0–2 count)
     single: -5,        // Bad
     double: -9,        // Extra-base hit
     triple: -13,       // Extra-base hit (bigger damage)
     homerun: -15,      // Solo HR
     homerun_big: -30,  // Go-ahead/grand slam/late & close
     hbp: -10,          // Lost control
     wildpitch: -5,     // Embarrassing
     error: -10,        // Defense failed (pitcher's fault)
     steal: -3,         // Runner got away
     sacfly: -2,        // Run scored
     blownCall: -15,    // Umpire screwed him
     inning_1_3: +10,   // Clean 1–3 innings
   };

   delta = DELTAS[eventType] || 0;

   // Sensitivity: volatility scaling (before leverage)
   const sensitivity = volatility / 5.0;  // 0.2–2.0x
   let applied = delta * sensitivity;

   // Apply leverage multiplier (situational scaling) — ALL negative events
   applied = applied * leverage;

   // Debug logging (set pitcher.debug=true to enable)
   _log_event(eventType, delta, sensitivity, leverage, applied, composureState.composure);

   // Clamp to ±100 per swing
   applied = Math.max(-100, Math.min(100, applied));

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

  const newComposure = Math.max(0, Math.min(100, composure + applied));
  return { newComposure, delta: applied, changeAmount: applied };
  }

  /**
  * Calculate situational leverage multiplier
  * leverage = inning_weight × score_situation_weight
  */
  export function calculateLeverage(inning, gameState) {
  // Inning weight: late innings matter more
  const inningWeights = {
   1: 1.0, 2: 1.0, 3: 1.0,
   4: 1.1, 5: 1.1,
   6: 1.25,
   7: 1.5,
   8: 1.8,
   9: 2.2,
  };
  const inningWeight = inningWeights[Math.min(inning, 9)] || 2.2;

  // Score situation weight: evaluated AFTER the event resolves
  // gameState should have updated score
  const userSide = gameState.homeTeam === gameState.userTeam ? 'home' : 'away';
  const userScore = gameState.score[userSide];
  const oppScore = gameState.score[userSide === 'home' ? 'away' : 'home'];
  const diff = oppScore - userScore;  // negative = user ahead, positive = user behind

  let scoreSitWeight = 1.0;
  if (diff >= 2) {
   scoreSitWeight = 2.5;  // Surrenders LEAD (was ahead/tied, now behind)
  } else if (diff === 1) {
   scoreSitWeight = 2.5;  // Surrenders LEAD from a tie
  } else if (diff === 0) {
   scoreSitWeight = 2.0;  // Ties the game (was ahead)
  } else if (diff === -1) {
   scoreSitWeight = 1.2;  // Extends deficit by 1
  } else {
   scoreSitWeight = 0.5;  // Garbage time
  }

  return inningWeight * scoreSitWeight;
  }

  /**
  * Apply penalty when pitcher surrenders a lead
  * Permanently lowers recovery ceiling
  */
  export function applyLeadChangePenalty(composureState) {
  // Lower recovery_cap: can't return to 100 after this
  composureState.recovery_cap = Math.min(composureState.recovery_cap, 70);
  // Stack penalty if happens twice
  if (composureState.recovery_cap <= 70) {
   composureState.recovery_cap = Math.max(55, composureState.recovery_cap - 10);
  }
  }

/**
  * Recovery: gated by game state (no healing after blowing lead).
  * CRITICAL: Recovery ONLY fires on outs or inning-end, NEVER between baserunners.
  */
export function recoverComposure(composureState, gameState, outcome = null) {
   const { recovery, recovery_cap } = composureState;

   // Fix 1: Recovery ONLY on outs or inning-end
   if (outcome && !['out', 'inning_end'].includes(outcome)) {
     return composureState.composure;  // hits, walks, runs: NO recovery
   }

   // Gate 1: Check if pitcher just blew the lead
   const recoveryMode = getRecoveryMode(composureState, gameState);

   if (recoveryMode === 'none') {
     // Blew lead, no recovery, maybe decline
     if (composureState.composure < composureState.baseline) {
       composureState.composure = Math.max(0, composureState.composure - 2.0);
     }
     return composureState.composure;
   }
  
  // Gate 2: Determine recovery amount
  let baseRecovery = 0;
  if (recoveryMode === 'normal') {
    // Ahead or tied: normal recovery
    baseRecovery = recovery / 5.0;  // e.g., recovery=6 → 1.2 per cycle
  } else if (recoveryMode === 'muted') {
    // Trailing: limited recovery
    baseRecovery = recovery / 10.0;  // Half speed
  }
  
  // Apply recovery capped at recovery_cap
  const newComposure = Math.min(recovery_cap, composureState.composure + baseRecovery);
  composureState.composure = newComposure;
  
  // Reset counters
  composureState.strikeCount = 0;
  composureState.ballCount = 0;
  composureState.hitCount = 0;
  composureState.walkCount = 0;
  
  return composureState.composure;
}

/**
 * Determine if pitcher can recover this cycle
 */
function getRecoveryMode(composureState, gameState) {
  const userSide = gameState.homeTeam === gameState.userTeam ? 'home' : 'away';
  const leadState = gameState._pitcherLeadState || 'ahead';  // 'ahead', 'tied', 'behind'
  
  if (leadState === 'behind' && gameState._just_lost_lead) {
    return 'none';  // Just blew it — no recovery
  }
  if (leadState === 'behind') {
    return 'muted';  // Trailing — slow recovery
  }
  return 'normal';  // Ahead or tied
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

  /**
  * Debug logger: prints per-event delta breakdown (Fix 4)
  * Enable with pitcher.debug = true during playtesting
  */
  function _log_event(eventType, base, sensitivity, leverage, applied, currentComposure) {
  if (!globalThis.pitcher?.debug) return;
  const newComp = currentComposure + applied;
  console.log(
   `{${eventType}} base=${base.toFixed(1)} sens=${sensitivity.toFixed(2)} ` +
   `lev=${leverage.toFixed(2)} applied=${applied.toFixed(2)} → comp=${newComp.toFixed(2)}`
  );
  }