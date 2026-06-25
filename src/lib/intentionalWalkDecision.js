/**
 * Phase 2.9 — Intentional Walk Decision Gate
 * 
 * Fires BEFORE the pitcher's first pitch to a new batter (fresh count: 0-0).
 * Hard precondition: first base must be open (never with bases loaded or empty).
 * Scores on batter danger vs. on-deck weakness, game situation, and base/out state.
 * Guardrails prevent loading bases or putting winning run on base for free.
 */

const IBB_THRESHOLD = 55;  // Score needed to issue IBB (start at 55)

/**
 * Determine if an intentional walk should be issued.
 * Called at the START of a plate appearance (fresh count: 0-0).
 * Returns: true | false
 */
export function shouldIntentionalWalk(game) {
  if (!game) return false;
  
  // Hard precondition: first base must be open (or openable)
  if (!ibb_legal(game)) {
    return false;
  }
  
  // Score the situation
  const score = ibb_score(game);
  return score >= IBB_THRESHOLD;
}

/**
 * Check if an IBB is legal in current game state.
 * Hard rules prevent loading bases, empty bases, or tying/winning run scenarios.
 */
function ibb_legal(game) {
  // Never with runner on 1st (forces everyone up — almost never right)
  if (game.runner_on_1st) {
    return false;
  }
  
  // Never with bases empty (just giving free baserunner)
  if (game.bases_empty) {
    return false;
  }
  
  // Never load the bases with weak closer backing up (< 2 outs, comparable on-deck)
  if (game.runners_on_2nd && game.runners_on_3rd) {
    const drop = calculate_on_deck_drop(game);
    if (game.outs < 2 && drop < 3) {
      return false;  // On-deck hitter is comparable, don't load bases
    }
  }
  
  // CRITICAL: Never put winning/tying run on base in lead-protect scenario
  if (game.score_margin >= 0 && game.walk_puts_winning_run_on_base(game)) {
    return false;
  }
  
  return true;
}

/**
 * Score the IBB decision on how dangerous current batter is vs. on-deck hitter.
 */
function ibb_score(game) {
  let s = 0;
  const batter = game.current_batter;
  const on_deck = game.on_deck_batter;
  
  // ── HOW DANGEROUS IS THIS HITTER? ──
  if (batter.power >= 8) {
    s += 25;
  } else if (batter.power >= 6) {
    s += 12;
  }
  
  if (batter.contact >= 8) {
    s += 10;
  }
  
  if (game.batter_is_hot) {
    s += 8;  // Hot streak
  }
  
  // ── HOW MUCH WEAKER IS THE ON-DECK HITTER? ──
  // The drop captures the whole point: "is the next guy meaningfully worse?"
  const drop = calculate_on_deck_drop(game);
  if (drop >= 6) {
    s += 25;  // Big gap
  } else if (drop >= 3) {
    s += 12;
  }
  
  // The on-deck comparison is the BIGGEST trigger
  if (on_deck && on_deck.power <= 3 && on_deck.contact <= 3) {
    s += 30;  // Walk to get to the pitcher — huge
  }
  
  // ── BASE/OUT STATE ──
  if (game.runners_on_2nd && game.runners_on_3rd) {
    s += 15;  // Set up force everywhere
  }
  
  if (game.runner_on_3rd && game.outs === 2) {
    s += 12;  // Force at any base, 2 outs
  }
  
  if (game.first_base_open && game.outs === 2) {
    s += 10;
  }
  
  // ── GAME SITUATION ──
  if (game.inning >= 8) {
    s += 15;
  }
  
  if (Math.abs(game.score_margin) <= 1) {
    s += 15;  // Close game, every run matters
  }
  
  if (game.score_margin === 0) {
    s += 8;
  }
  
  // ── PLATOON ──
  // Would the walk let the pitcher get a same-side matchup on deck?
  if (game.on_deck_gives_platoon_advantage) {
    s += 8;
  }
  
  return s;
}

/**
 * Helper: Calculate the gap between current batter and on-deck hitter.
 * Higher drop = on-deck is significantly weaker.
 */
function calculate_on_deck_drop(game) {
  const batter = game.current_batter;
  const on_deck = game.on_deck_batter;
  
  if (!on_deck) return 0;
  
  const batter_total = (batter.power || 5) + (batter.contact || 5);
  const on_deck_total = (on_deck.power || 5) + (on_deck.contact || 5);
  
  return batter_total - on_deck_total;
}

/**
 * Execute an intentional walk.
 * Returns state updates: batter advances to 1B, runners advance if forced.
 */
export function issue_ibb(game) {
  const batter = game.current_batter;
  
  // Advance runners if forced
  // Runners on 2nd & 3rd: both advance (2→3, 3→home scores)
  // Runner on 2nd only: move to 3rd
  // Runner on 3rd: scores
  
  let rbi = 0;
  if (game.runner_on_3rd) {
    game.runner_on_3rd.runs++;
    rbi++;
  }
  if (game.runner_on_2nd) {
    game.runner_on_3rd = game.runner_on_2nd;
    game.runner_on_2nd = null;
  }
  
  // Batter to first
  game.runner_on_1st = batter;
  
  return {
    type: 'intentional_walk',
    text: `${batter.name} is intentionally walked — catcher stands and points.`,
    rbi: rbi,
    batter_ibb_composure_delta: 0,  // NEUTRAL — sign of respect, not failure
    pitcher_composure_delta: 0,      // Pitcher not penalized (manager's call)
    on_deck_composure_delta: 5,      // Pressure-but-opportunity for on-deck hitter
  };
}