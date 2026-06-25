/**
 * Celebration System: Emotional Reaction Bubbles
 * 
 * Determines if a moment triggers a celebration bubble based on:
 * - Moment importance (routine → major → walk-off)
 * - Player personality (showmanship, composure, temper, veteran)
 * - Celebration type (Positive, Team-Focused, Personal, Provocative)
 */

// ── MOMENT IMPORTANCE TIERS & BASE PROBABILITIES ──
export const MOMENT_TIERS = {
  ROUTINE: { baseProb: 0.02, label: 'Routine play' },
  IMPORTANT: { baseProb: 0.20, label: 'Important moment' },
  MAJOR: { baseProb: 0.60, label: 'Major moment' },
  WALKOFF_OR_CLIMACTIC: { baseProb: 0.90, label: 'Game-deciding play' },
};

// ── CELEBRATION CLASSIFICATIONS ──
export const CELEBRATION_TYPES = {
  POSITIVE: 'positive',           // Self-directed joy/relief
  TEAM_FOCUSED: 'team_focused',   // Points to dugout, energizes team
  PERSONAL: 'personal',           // Individual excellence
  PROVOCATIVE: 'provocative',     // Staredown, mocking, tension-raising
};

// ── PERSONALITY TRAIT MODIFIERS ──
// (Traits typically range 1-10; multiply base probability)
const PERSONALITY_MODIFIERS = {
  showmanship: (rating) => 0.8 + (rating / 10) * 0.4,      // 0.8–1.2x
  composure: (rating) => 2.0 - (rating / 10) * 0.5,        // 2.0–1.5x (lower composure = more reactions)
  temper: (rating) => 1.0 + (rating / 10) * 0.3,           // 1.0–1.3x
  veteran: (isVeteran) => isVeteran ? 0.7 : 1.0,           // Veterans more restrained
};

/**
 * Calculate if a moment should trigger a celebration bubble
 * @param {string} momentTier - 'ROUTINE', 'IMPORTANT', 'MAJOR', 'WALKOFF_OR_CLIMACTIC'
 * @param {object} playerPersonality - { showmanship, composure, temper, isVeteran }
 * @param {string} celebrationType - 'positive', 'team_focused', 'personal', 'provocative'
 * @returns {boolean}
 */
export function shouldCelebrate(momentTier, playerPersonality = {}, celebrationType = 'positive') {
  const tier = MOMENT_TIERS[momentTier] || MOMENT_TIERS.ROUTINE;
  let probability = tier.baseProb;

  // Apply personality modifiers
  const { showmanship = 5, composure = 5, temper = 5, isVeteran = false } = playerPersonality;

  // Showmanship boosts all celebration types
  probability *= PERSONALITY_MODIFIERS.showmanship(showmanship);

  // Composure reduces frequency (lower = more reactions)
  probability *= PERSONALITY_MODIFIERS.composure(composure);

  // Temper amplifies provocative celebrations
  if (celebrationType === CELEBRATION_TYPES.PROVOCATIVE) {
    probability *= PERSONALITY_MODIFIERS.temper(temper);
  }

  // Veterans are more restrained
  probability *= PERSONALITY_MODIFIERS.veteran(isVeteran);

  // Clamp to [0, 1]
  probability = Math.max(0, Math.min(probability, 1));

  return Math.random() < probability;
}

/**
 * Determine celebration details (icon, text classification)
 * @param {string} celebrationType - 'positive', 'team_focused', 'personal', 'provocative'
 * @returns {object} - { icon, effectOnTension, effectOnMorale }
 */
export function getCelebrationDetails(celebrationType) {
  const details = {
    [CELEBRATION_TYPES.POSITIVE]: {
      icon: '🔥',
      effectOnTension: 0,        // Neutral
      effectOnMorale: 5,         // Boosts team morale
      tensionRise: false,
    },
    [CELEBRATION_TYPES.TEAM_FOCUSED]: {
      icon: '🔥',
      effectOnTension: 2,        // Slight rise
      effectOnMorale: 10,        // Major morale boost
      tensionRise: false,
    },
    [CELEBRATION_TYPES.PERSONAL]: {
      icon: '🔥',
      effectOnTension: 3,        // Moderate rise
      effectOnMorale: 3,         // Mild boost
      tensionRise: false,
    },
    [CELEBRATION_TYPES.PROVOCATIVE]: {
      icon: '⚡',
      effectOnTension: 8,        // Significant rise
      effectOnMorale: -5,        // Can reduce opponent morale
      tensionRise: true,
    },
  };

  return details[celebrationType] || details[CELEBRATION_TYPES.POSITIVE];
}

/**
 * Pitcher celebration trigger helper
 * @param {object} state - game state
 * @param {string} strikeoutType - 'bases_loaded', 'ended_inning', 'after_hr', 'long_battle', etc.
 * @returns {object|null} - { text, momentTier, type } or null
 */
export function pitcherCelebration(state, strikeoutType) {
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher) return null;

  // Map strikeout types to moment tier + celebration type
  const tiers = {
    bases_loaded: 'MAJOR',          // Bases loaded K
    ended_inning_runners: 'MAJOR',  // K to end with runners stranded
    after_hr: 'IMPORTANT',          // K immediately after giving up HR
    long_battle: 'MAJOR',           // Long at-bat, 8+ pitches
    third_consecutive: 'MAJOR',     // Third K in a row
    down_3_0: 'MAJOR',              // After falling behind 3-0
    preserve_late_lead: 'MAJOR',    // K to preserve 1-run lead late
    opposing_best_hitter: 'MAJOR',  // K of opposing team's best hitter
  };

  const tier = tiers[strikeoutType] || 'IMPORTANT';
  const personality = {
    showmanship: pitcher.showmanship || 5,
    composure: pitcher.composure || 5,
    temper: pitcher.temper || 5,
    isVeteran: pitcher.veteran || false,
  };

  if (!shouldCelebrate(tier, personality, CELEBRATION_TYPES.PERSONAL)) return null;

  // Strikeout celebrations are usually personal + slightly provocative
  const celebType = Math.random() < 0.3 ? CELEBRATION_TYPES.PROVOCATIVE : CELEBRATION_TYPES.PERSONAL;

  return {
    momentTier: tier,
    type: celebType,
    // Actual text will be chosen at render time
  };
}

/**
 * Batter celebration trigger helper
 * @param {object} state - game state
 * @param {string} hitType - 'walkoff', 'go_ahead_hr', 'grand_slam', 'clutch_hit', 'hustle_double', etc.
 * @returns {object|null} - { text, momentTier, type } or null
 */
export function batterCelebration(state, hitType) {
  const batter = state.halfInning === 'top' ? state.awayLineup[state.awayBatterIndex % state.awayLineup.length] : state.homeLineup[state.homeBatterIndex % state.homeLineup.length];
  if (!batter) return null;

  const tiers = {
    walkoff: 'WALKOFF_OR_CLIMACTIC',
    go_ahead_hr: 'MAJOR',
    grand_slam: 'MAJOR',
    game_tying_hr: 'MAJOR',
    pinch_hit_hr: 'MAJOR',
    after_intentional_walk: 'MAJOR',
    bases_clearing_double: 'MAJOR',
    walkoff_single: 'WALKOFF_OR_CLIMACTIC',
    breaking_no_hitter: 'MAJOR',
    first_mlb_hit: 'IMPORTANT',
    long_battle_hit: 'IMPORTANT',
    cycle_completing_hit: 'MAJOR',
    stretching_into_extra_base: 'IMPORTANT',
  };

  const tier = tiers[hitType] || 'IMPORTANT';
  const personality = {
    showmanship: batter.showmanship || 5,
    composure: batter.composure || 5,
    temper: batter.temper || 5,
    isVeteran: batter.veteran || false,
  };

  if (!shouldCelebrate(tier, personality, CELEBRATION_TYPES.PERSONAL)) return null;

  // Batters on big hits often have team-focused or personal celebrations
  const celebType = ['go_ahead', 'walkoff', 'grand_slam'].some(t => hitType.includes(t))
    ? CELEBRATION_TYPES.TEAM_FOCUSED
    : CELEBRATION_TYPES.PERSONAL;

  return {
    momentTier: tier,
    type: celebType,
  };
}

/**
 * Fielder celebration trigger helper
 * @param {object} state - game state
 * @param {string} playType - 'robbed_hr', 'diving_catch', 'throw_out_runner', 'difficult_stop', etc.
 * @returns {object|null}
 */
export function fielderCelebration(state, playType) {
  // This will reference the actual fielder from the play; for now, generic personality
  const tiers = {
    robbed_hr: 'MAJOR',
    diving_catch: 'IMPORTANT',
    leaping_catch_wall: 'IMPORTANT',
    catch_saving_lead_late: 'MAJOR',
    throw_out_runner_home: 'IMPORTANT',
    throw_out_fast_runner: 'MAJOR',
    triple_play: 'WALKOFF_OR_CLIMACTIC',
    barehanded_play: 'IMPORTANT',
    difficult_stop_loaded: 'MAJOR',
    game_ending_out: 'MAJOR',
  };

  const tier = tiers[playType] || 'ROUTINE';
  if (tier === 'ROUTINE') return null;

  // Default fielder personality
  const personality = {
    showmanship: 5,
    composure: 6,
    temper: 4,
    isVeteran: false,
  };

  if (!shouldCelebrate(tier, personality, CELEBRATION_TYPES.POSITIVE)) return null;

  return {
    momentTier: tier,
    type: CELEBRATION_TYPES.POSITIVE,
  };
}

/**
 * Team celebration trigger (walk-offs, no-hitters, comebacks)
 * @param {object} state - game state
 * @param {string} eventType - 'walkoff', 'nohitter', 'perfect_game', 'comeback', 'triple_play', etc.
 * @returns {object|null}
 */
export function teamCelebration(state, eventType) {
  const tiers = {
    walkoff: 'WALKOFF_OR_CLIMACTIC',
    nohitter: 'WALKOFF_OR_CLIMACTIC',
    perfect_game: 'WALKOFF_OR_CLIMACTIC',
    triple_play: 'WALKOFF_OR_CLIMACTIC',
    comeback_complete: 'MAJOR',
    trailing_to_lead_late: 'MAJOR',
  };

  const tier = tiers[eventType];
  if (!tier) return null;

  // Team celebrations almost always fire on major moments
  if (tier === 'WALKOFF_OR_CLIMACTIC') return { momentTier: tier, type: CELEBRATION_TYPES.TEAM_FOCUSED };
  if (Math.random() < 0.75) return { momentTier: tier, type: CELEBRATION_TYPES.TEAM_FOCUSED };

  return null;
}