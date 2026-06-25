/**
 * Phase 3.1 — The Double Switch
 * 
 * NL-park pitcher change + defensive swap to bury the new pitcher's batting slot.
 * The manager simultaneously changes pitchers AND swaps a position player, rearranging
 * the batting order so the new pitcher inherits a slot far from batting.
 * 
 * Core condition: making a pitching change, pitcher's spot due up within ~4 batters,
 * and a suitable defensive swap exists.
 */

/**
 * Should we double-switch instead of just changing pitchers?
 * Evaluated when changing pitchers in NL parks.
 */
export function should_double_switch(game) {
  // Guard: DH parks never double-switch
  if (game.park_has_dh) {
    return false;
  }
  
  // Guard: only when making a pitcher change
  if (!game.making_pitcher_change) {
    return false;
  }
  
  // How soon does the pitcher's spot bat?
  const spots_until_pitcher_bats = batting_spots_until(
    game,
    game.pitcher_lineup_slot
  );
  
  // If pitcher's spot isn't coming up soon, no double-switch needed
  if (spots_until_pitcher_bats > 4) {
    return false;
  }
  
  // Is there a position player we can profitably swap?
  const candidate = find_double_switch_partner(game);
  if (!candidate) {
    return false;
  }
  
  return true;
}

/**
 * Find the best position player to swap out in a double switch.
 * Returns { fielder, bench_replacement } or null.
 */
export function find_double_switch_partner(game) {
  const position_players_on_field = game.position_players_on_field; // fielders (not pitcher)
  
  let best = null;
  let best_value = 0;
  
  for (const fielder of position_players_on_field) {
    // Skip star bats unless their spot is the pitcher's spot
    if (fielder.is_star && fielder.lineup_slot !== game.pitcher_lineup_slot) {
      continue;
    }
    
    // How soon does this fielder's slot bat?
    const slot = fielder.lineup_slot;
    const spots_until = batting_spots_until(game, slot);
    
    // Ideal partner: someone whose slot bats SOON (so pitcher takes that slot)
    if (spots_until > 4) {
      continue;  // This fielder's spot isn't coming up soon — not useful
    }
    
    // Find a bench replacement who can play this position
    const bench_replacement = best_bench_for_position(game, fielder.position);
    if (!bench_replacement) {
      continue;  // No one on bench can play this position
    }
    
    // Calculate the value of this swap
    // value = how soon fielder bats (sooner = better to bury the new pitcher)
    //       - how much offense we lose swapping in the bench player
    const offense_loss =
      (fielder.contact + fielder.power) -
      (bench_replacement.contact + bench_replacement.power);
    
    // Heavy penalty for trading away good bats
    const value = spots_until * 5 - Math.max(0, offense_loss) * 2;
    
    // Bonus if this fielder's spot is VERY next (buries pitcher furthest)
    if (spots_until <= 2) {
      value += 10;
    }
    
    if (value > best_value) {
      best_value = value;
      best = { fielder, bench_replacement };
    }
  }
  
  return best;
}

/**
 * Helper: how many batters until a given lineup slot comes up to bat?
 * Lineup slot 0 = batting next, 8 = batting in ~8 more batters.
 */
function batting_spots_until(game, lineup_slot) {
  const current_batter_slot = game.current_batter_lineup_slot;
  const lineup_size = game.lineup.length;
  
  // Distance around the circle
  let distance = (lineup_slot - current_batter_slot) % lineup_size;
  if (distance <= 0) {
    distance += lineup_size;
  }
  
  return distance;
}

/**
 * Find the best available bench player who can play a given position.
 */
function best_bench_for_position(game, position) {
  const bench = game.available_bench;
  if (!bench || bench.length === 0) {
    return null;
  }
  
  // Filter to those who can play the position
  const eligible = bench.filter(b => can_play_position(b, position));
  if (eligible.length === 0) {
    return null;
  }
  
  // Return the best hitter
  return eligible.sort(
    (a, b) => (b.contact + b.power) - (a.contact + a.power)
  )[0];
}

/**
 * Can a player play a given position?
 */
function can_play_position(player, position) {
  if (!player.position_eligibility) {
    return false;
  }
  return player.position_eligibility.includes(position);
}

/**
 * Execute the double switch.
 * Swaps the pitcher and fielder's lineup slots + brings in bench replacement.
 */
export function execute_double_switch(
  game,
  new_pitcher,
  outgoing_fielder,
  new_fielder
) {
  const old_pitcher_slot = game.pitcher_lineup_slot;
  const fielder_slot = outgoing_fielder.lineup_slot;
  
  // Remove old pitcher, add new pitcher to fielder's slot
  remove_pitcher(game, game.current_pitcher);
  add_pitcher(game, new_pitcher);
  new_pitcher.lineup_slot = fielder_slot;
  
  // Remove outgoing fielder, add bench replacement to pitcher's old slot
  remove_fielder(game, outgoing_fielder);
  add_fielder(game, new_fielder);
  new_fielder.lineup_slot = old_pitcher_slot;
  
  // Log the move
  log_double_switch(
    game,
    new_pitcher,
    new_fielder,
    old_pitcher_slot,
    fielder_slot
  );
}

/**
 * Log the double switch for commentary + game history.
 */
function log_double_switch(game, new_pitcher, new_fielder, old_pitcher_slot, fielder_slot) {
  const msg = `🔄 Double switch: ${new_pitcher.name} comes in to pitch, takes position #${fielder_slot + 1}. ${new_fielder.name} replaces him in the field at slot #${old_pitcher_slot + 1}.`;
  game.log.push({ type: 'info', text: msg });
}

// Stub functions for game state manipulation
// (These would be wired into the actual game state in gameEngine.js)
function remove_pitcher(game, pitcher) {
  // Implementation in gameEngine
}

function add_pitcher(game, pitcher) {
  // Implementation in gameEngine
}

function remove_fielder(game, fielder) {
  // Implementation in gameEngine
}

function add_fielder(game, fielder) {
  // Implementation in gameEngine
}