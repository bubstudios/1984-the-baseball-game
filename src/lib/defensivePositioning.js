/**
 * Phase 3.0 — Defensive Positioning
 * 
 * Defense chooses one alignment per plate appearance before the pitch.
 * Five alignments: Normal, Infield In, Double-Play Depth, Corners In, No-Doubles.
 * Each alignment applies real modifiers to batted-ball outcomes (through-infield %, DP conversion, XBH prevention).
 * Infield In is the signature decision: genuine risk/reward (cut run at plate vs. grounders sneak through).
 */

export const ALIGNMENTS = {
  NORMAL: {
    name: 'Normal',
    description: 'Default baseline alignment',
    modifiers: {},
  },
  INFIELD_IN: {
    name: 'Infield In',
    description: 'Runner on 3rd, cut run at the plate',
    modifiers: {
      grounder_throw_out_runner_prob: 0.12,  // +12% chance to throw out runner at plate
      through_infield_for_hit_prob: -0.15,   // -15% singles through infield (shallower)
    },
  },
  DP_DEPTH: {
    name: 'Double-Play Depth',
    description: 'Runner on 1st, <2 outs, want the twin killing',
    modifiers: {
      dp_conversion_prob: 0.15,  // +15% DP conversion rate
      through_infield_for_hit_prob: 0.04,    // +4% balls through (playing deeper)
    },
  },
  CORNERS_IN: {
    name: 'Corners In',
    description: 'Guard the bunt, pitcher up',
    modifiers: {
      bunt_fielded_prob: 0.20,   // +20% fielding bunts
      xbh_prob: 0.10,             // +10% hard grounders past corners (XBH risk)
    },
  },
  NO_DOUBLES: {
    name: 'No-Doubles',
    description: 'Protect a late lead, slug up',
    modifiers: {
      xbh_prob: -0.15,            // -15% extra-base hits (corners guard the lines)
      bloop_single_prob: 0.10,    // +10% bloops/short singles (gaps open)
    },
  },
};

/**
 * Choose defensive alignment for this plate appearance.
 * Evaluated BEFORE the pitch, at the start of the AB.
 * Priority order: Infield In > Corners In > DP Depth > No-Doubles > Normal
 */
export function choose_alignment(game) {
  // Priority 1: Infield In — runner on 3rd, <2 outs, late/close
  if (game.runner_on_3rd && game.outs < 2) {
    if (game.inning >= 7 && Math.abs(game.score_margin) <= 2) {
      return ALIGNMENTS.INFIELD_IN;
    }
  }
  
  // Priority 2: Corners In — expect bunt
  if (game.expect_bunt) {
    return ALIGNMENTS.CORNERS_IN;
  }
  
  // Priority 3: Double-Play Depth — runner on 1st, <2 outs
  if (game.runner_on_1st && game.outs < 2) {
    return ALIGNMENTS.DP_DEPTH;
  }
  
  // Priority 4: No-Doubles — protect late lead vs. slugger
  if (game.inning >= 8 && game.current_pitcher_leads_by(1, 2) && game.current_batter_pwr >= 7) {
    return ALIGNMENTS.NO_DOUBLES;
  }
  
  // Default: Normal
  return ALIGNMENTS.NORMAL;
}

/**
 * Apply alignment modifiers to a batted ball outcome.
 * Modifies probabilities *before* the ball is resolved.
 */
export function apply_alignment_modifiers(alignment, batted_ball, game) {
  if (!alignment || alignment.name === 'Normal') {
    return batted_ball;  // No changes for default
  }
  
  const mods = alignment.modifiers;
  
  if (alignment.name === 'Infield In') {
    if (batted_ball.type === 'grounder' && batted_ball.play_at_plate_available) {
      batted_ball.throw_out_runner_prob = (batted_ball.throw_out_runner_prob || 0) + mods.grounder_throw_out_runner_prob;
    }
    if (batted_ball.type === 'grounder') {
      batted_ball.through_infield_for_hit_prob = (batted_ball.through_infield_for_hit_prob || 0) + mods.through_infield_for_hit_prob;
    }
  }
  
  if (alignment.name === 'Double-Play Depth') {
    if (batted_ball.type === 'grounder' && game.runner_on_1st) {
      batted_ball.dp_conversion_prob = (batted_ball.dp_conversion_prob || 0) + mods.dp_conversion_prob;
    }
    if (batted_ball.type === 'grounder') {
      batted_ball.through_infield_for_hit_prob = (batted_ball.through_infield_for_hit_prob || 0) + mods.through_infield_for_hit_prob;
    }
  }
  
  if (alignment.name === 'Corners In') {
    if (batted_ball.type === 'bunt') {
      batted_ball.bunt_fielded_prob = (batted_ball.bunt_fielded_prob || 0) + mods.bunt_fielded_prob;
    }
    if (batted_ball.type === 'grounder' && ['3B', '1B'].includes(batted_ball.location)) {
      batted_ball.xbh_prob = (batted_ball.xbh_prob || 0) + mods.xbh_prob;
    }
  }
  
  if (alignment.name === 'No-Doubles') {
    if (batted_ball.type === 'flyout' || batted_ball.type === 'grounder') {
      batted_ball.xbh_prob = (batted_ball.xbh_prob || 0) + mods.xbh_prob;
    }
    if (batted_ball.type === 'flyout') {
      batted_ball.bloop_single_prob = (batted_ball.bloop_single_prob || 0) + mods.bloop_single_prob;
    }
  }
  
  return batted_ball;
}

/**
 * Helper to detect if the offense is likely to bunt.
 * Reuses Phase 2.7 logic if available, or simple heuristic here.
 */
export function expect_bunt(game) {
  // Simple heuristic: pitcher hitting, runner on 1st, <2 outs
  if (game.batter_is_pitcher && game.runner_on_1st && game.outs < 2) {
    return true;
  }
  // Could reuse shouldBunt() from Phase 2.7 if integrated
  return false;
}