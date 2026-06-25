/**
 * Phase 2.8 — Pinch-Hitting Decision Gate
 * 
 * Pinch-hitting fires WHEN A PITCHER IS DUE UP TO BAT, not during pitcher changes.
 * It's a pre-swing decision gate (like bunting in Phase 2.7).
 * The key linkage: when you hit for the pitcher, he's out of the game,
 * so the bullpen must bring in a new pitcher next half-inning.
 */

const PH_THRESHOLD = 50;  // Score needed to trigger pinch-hit (start at 50)

/**
 * Determine if current pitcher due at bat should be pinch-hit.
 * Called BEFORE normal swing logic when batter.is_pitcher is true.
 * Returns: true | false
 */
export function shouldPinchHit(game) {
  if (!game) return false;
  
  // Guard 1: Do we have bench pinch-hitters available?
  if (!bench_has_pinch_hitters(game)) {
    return false;
  }
  
  // Guard 2: Is it safe to pinch-hit (won't exhaust bench, have a pitcher next inning)?
  if (!safe_to_pinch_hit(game)) {
    return false;
  }
  
  // Main gate: score
  const score = pinch_hit_score(game);
  return score >= PH_THRESHOLD;
}

/**
 * Pinch-hit score — evaluates offensive opportunity and bullpen readiness.
 */
function pinch_hit_score(game) {
  let s = 0;
  
  // ── Offensive opportunity ──
  if (game.runners_in_scoring_position) {
    s += 30;
  }
  if (game.runners_on && game.outs < 2) {
    s += 10;
  }
  
  // ── Game situation ──
  if (game.inning >= 7) {
    s += 20;
  }
  if (game.inning >= 8) {
    s += 15;  // Stacks with above → late innings heavy
  }
  if (Math.abs(game.score_margin) <= 2) {
    s += 20;  // Game within reach
  }
  if (game.score_margin < 0) {
    s += 15;  // Trailing, need offense now
  }
  
  // ── THE KEY LINKAGE BONUS ──
  // If a fresh arm is available next inning, pinch-hitting is nearly free — you gain the bat AND change pitchers anyway
  if (fresh_arm_available_next_inning(game)) {
    s += 15;  // $3 bonus: makes AI pinch-hit like a manager
  }
  
  // ── Reliever efficiency ──
  if (game.current_pitcher_ip >= 1.0) {
    s += 10;  // Reliever's done his job, safe to lift
  }
  
  return s;
}

/**
 * Check if bench has pinch-hitters available.
 */
function bench_has_pinch_hitters(game) {
  return game.available_bench && game.available_bench.length > 0;
}

/**
 * Check if it's safe to pinch-hit (don't exhaust bench or lose a pitcher).
 */
function safe_to_pinch_hit(game) {
  // Guard 1: Don't burn bench so early you have no one left to pitch later
  if (game.inning <= 4 && game.available_bench.length <= 2) {
    return false;
  }
  
  // Guard 2: Don't pinch-hit if you'd have no pitcher left to PITCH next inning
  if (!fresh_arm_available_next_inning(game)) {
    return false;
  }
  
  return true;
}

/**
 * Check if there's a rested reliever who can take the mound next inning.
 * This is the KEY piece that links pinch-hitting to bullpen management.
 */
function fresh_arm_available_next_inning(game) {
  // Is there a reliever in the bullpen who's rested and hasn't pitched this inning?
  if (!game.bullpen || game.bullpen.length === 0) {
    return false;
  }
  
  return game.bullpen.some(p => 
    p.rested && 
    (!game.used_this_inning || !game.used_this_inning.includes(p.name))
  );
}

/**
 * Select best pinch-hitter from available bench.
 */
export function choose_pinch_hitter(game) {
  if (!game.available_bench || game.available_bench.length === 0) {
    return null;
  }
  
  const bench = game.available_bench;
  
  // Tailor selection to situation
  if (game.runners_in_scoring_position) {
    // Want contact + power to drive them in
    return bench.reduce((best, h) => 
      (h.contact + h.power > (best.contact + best.power)) ? h : best
    );
  }
  
  if (game.need_baserunner) {
    // Trailing late, just need to get on — contact + speed
    return bench.reduce((best, h) => 
      (h.contact + h.speed > (best.contact + best.speed)) ? h : best
    );
  }
  
  // Default: best overall contact + power
  return bench.reduce((best, h) => 
    (h.contact + h.power > (best.contact + best.power)) ? h : best
  );
}

/**
 * Resolve pinch-hitting: mark pitcher as out, set the replacement flag.
 * Returns: { done: true, pinch_hitter: {...}, pitcher_out: {...} }
 */
export function resolvePinchHit(game, pitcher, pinch_hitter) {
  return {
    done: true,
    pinch_hitter: pinch_hitter,
    pitcher_out: pitcher,
    pitcher_due_for_replacement: true,  // Bullpen must bring in new arm next inning
  };
}