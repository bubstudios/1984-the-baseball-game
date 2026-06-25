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
  gameState,
  new_pitcher,
  outgoing_fielder,
  new_fielder,
  pitching_side
) {
  // Identify which lineup to modify
  const lineup = pitching_side === 'home' ? gameState.homeLineup : gameState.awayLineup;
  const bullpen = pitching_side === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
  const pitcher_obj = pitching_side === 'home' ? gameState.homePitcher : gameState.awayPitcher;
  
  // Find positions in lineup
  const old_pitcher_order = pitcher_obj.order;
  const fielder_order = outgoing_fielder.order;
  
  // Swap: new pitcher takes fielder's order slot, new fielder takes pitcher's order slot
  new_pitcher.order = fielder_order;
  new_fielder.order = old_pitcher_order;
  
  // Remove old pitcher from lineup if present
  const pitcher_idx = lineup.findIndex(p => p.name === pitcher_obj.name);
  if (pitcher_idx >= 0) {
    lineup[pitcher_idx] = { ...new_pitcher, order: fielder_order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
  }
  
  // Remove outgoing fielder, insert new fielder in pitcher's old order slot
  const fielder_idx = lineup.findIndex(p => p.name === outgoing_fielder.name);
  if (fielder_idx >= 0) {
    const fielder_pos = outgoing_fielder.assignedPos || outgoing_fielder.pos;
    lineup[fielder_idx] = { ...new_fielder, order: old_pitcher_order, assignedPos: fielder_pos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
  }
  
  // Update pitcher reference
  const new_p = { ...new_pitcher, pitchCount: 0, pitches: new_pitcher.pitches || [], gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: { composure: 100, baseline: 100, recovery_cap: 100 } };
  if (pitching_side === 'home') {
    gameState.homePitcher = new_p;
  } else {
    gameState.awayPitcher = new_p;
  }
  
  // Remove old pitcher from bullpen
  const bullpen_idx = bullpen.findIndex(p => p.name === pitcher_obj.name);
  if (bullpen_idx >= 0) {
    bullpen.splice(bullpen_idx, 1);
  }
  
  // Track history
  const history_key = pitching_side === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
  if (!gameState[history_key]) gameState[history_key] = [];
  if (!gameState[history_key].find(p => p.name === pitcher_obj.name)) {
    gameState[history_key].push({ ...pitcher_obj });
  }
  
  // Log the move
  const msg = `🔄 Double switch: ${new_pitcher.name} comes in to pitch (takes #${fielder_order} spot). ${new_fielder.name} replaces him in the field (takes #${old_pitcher_order} spot).`;
  gameState.log.push({ type: 'info', text: msg });
}