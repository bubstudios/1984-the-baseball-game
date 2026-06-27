/**
 * Phase 2.7 — Situational Bunting Decision Gate
 * 
 * Bunting is a PRE-SWING decision, not a swing option.
 * Evaluated separately before normal hitting logic based on situation + batter traits.
 * Two types: sacrifice (runners + <2 outs) and bunt-for-hit (rare, speed+low-power guys).
 */

const SAC_THRESHOLD = 50;    // Score needed to trigger sacrifice bunt (SP in NL park case: ~60 is baseline)
const HIT_THRESHOLD = 45;    // Score for bunt-for-hit attempt (~40% chance if score >= threshold)

/**
 * Determine if batter should bunt in current situation.
 * Called BEFORE normal swing logic.
 * Returns: 'sacrifice' | 'bunt_for_hit' | null
 */
export function shouldBunt(batter, game) {
  if (!batter || !game) return null;
  
  // Check if batter is a pitcher (critical flag)
  const isPitcher = batter.is_pitcher || batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));
  
  // ── SACRIFICE BUNT TRIGGER ──
  const sacScore = sac_bunt_score(batter, game);
  if (sacScore >= SAC_THRESHOLD && sacScore >= (hitBuntScore(batter, game) || 0)) {
    return 'sacrifice';
  }
  
  // ── BUNT-FOR-HIT TRIGGER (rare) ──
  const hitScore = hitBuntScore(batter, game);
  if (hitScore >= HIT_THRESHOLD && Math.random() < 0.40) {
    return 'bunt_for_hit';
  }
  
  return null;
}

/**
 * Sacrifice bunt score — evaluated when runners are on and <2 outs.
 */
function sac_bunt_score(batter, game) {
   if (!game.runner_on_1st && !game.runner_on_2nd && !game.runner_on_3rd || game.outs >= 2) {
     return 0;
   }

   // HARD SUPPRESSOR: Power hitters (PWR >= 7) or cleanup/middle-order bats never sac bunt
   if (batter.power >= 7) {
     return 0;  // Cleanup hitters do not sacrifice
   }

   let s = 0;

   // THE HEADLINE CASE — pitcher hitting (esp. AL pitcher in NL park, no DH)
   const isPitcherBatting = batter.is_pitcher || batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));
   if (isPitcherBatting) {
     s += 60;  // AL pitcher bunting = near-automatic in this situation
   }
  
  // Runner advancement value
  if (game.runner_on_1st && !game.runner_on_2nd) {
    s += 15;
  }
  if (game.runner_on_2nd && !game.runner_on_3rd) {
    s += 20;  // Move runner to third with <2 outs = big
  }
  if (game.runner_on_1st && game.runner_on_2nd) {
    s += 18;
  }
  
  // Game situation
  if (game.inning >= 7) {
    s += 15;  // Late, play for one run
  }
  if (Math.abs(game.score_margin) <= 1) {
    s += 15;  // Close game
  }
  if (game.score_margin === 0 && game.inning >= 8) {
    s += 10;  // Tie, very late — manufacture a run
  }
  
  // Weak hitter — bunting costs little
  if (batter.power <= 3) {
    s += 10;
  }
  if (batter.contact <= 3) {
    s += 8;
  }
  
  return s;
}

/**
 * Bunt-for-hit score — evaluated for fast, low-power guys only.
 */
function hitBuntScore(batter, game) {
  if (game.outs >= 2) {
    return 0;
  }
  
  let s = 0;
  
  // Speed is the entire premise
  if (batter.speed >= 8) {
    s += 25;  // Speed is the entire premise
  } else if (batter.speed >= 6) {
    s += 12;
  } else {
    return 0;  // Slow guys don't bunt for hit
  }
  
  // Weak power only
  if (batter.power <= 2) {
    s += 15;  // Slap-hitter profile
  }
  
  // Third baseman playing back (optional, improves realism)
  if (game.third_baseman_playing_back) {
    s += 15;  // Defense is conceding it
  }
  
  // Late-inning leadoff baserunner in close game
  if (game.bases_empty && game.inning >= 7 && Math.abs(game.score_margin) <= 1) {
    s += 10;  // Leadoff baserunner late in a close game
  }
  
  // Add low random gate so it stays unpredictable / rare
  s += Math.random() * 10;
  
  return s;
}

/**
 * Resolve a bunt attempt as its own mini-event.
 * Returns: { type, text, batterOut, success }
 */
export function resolveBunt(buntType, batter, game) {
  if (buntType === 'sacrifice') {
    return resolveSacBunt(batter, game);
  } else if (buntType === 'bunt_for_hit') {
    return resolveBuntForHit(batter, game);
  }
  return null;
}

function resolveSacBunt(batter, game) {
  // Bunting skill scales off CON (or dedicated bunt rating).
  // Pitchers in 1984 were generally decent sac bunters — give them a solid clean-sac rate.
  const isPitcher = batter.is_pitcher || batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));
  const conRating = (batter.contact || 3) / 10;
  const pitcherBonus = isPitcher ? 0.15 : 0;  // Pitchers 1984 were decent bunters
  
  const cleanSacChance = 0.30 + conRating * 0.35 + pitcherBonus;  // High if competent
  const roll = Math.random();
  
  if (roll < cleanSacChance) {
    // ── CLEAN SAC (SUCCESS) ──
    // Pitcher got the out, but conceded a base advancement.
    // Small penalty — roughly neutral, but not a positive.
    return {
      type: 'sacrifice_success',
      text: `${batter.name} lays down a perfect sacrifice bunt — runner advances, batter out.`,
      batterOut: true,
      success: true,
      composureDelta: -2,  // Small penalty for conceding base, slight morale sting
    };
  } else if (roll < cleanSacChance + 0.15) {
    // ── BUNT SINGLE (rare, good defense slow) ──
    // A BUNT SINGLE IS A HIT — bunt attempt failed, batter got on = pitcher allowed a hit.
    // Composure penalty like any other hit.
    return {
      type: 'bunt_single',
      text: `${batter.name} sneaks a bunt single through the infield! Runners advance.`,
      batterOut: false,
      success: true,
      composureDelta: -8,  // Pitcher allowed a hit — negative
    };
  } else if (roll < cleanSacChance + 0.30) {
    // ── POP-UP / LINEOUT ──
    return {
      type: 'bunt_pop',
      text: `${batter.name} pops up the bunt attempt — caught by the catcher!`,
      batterOut: true,
      success: false,
      composureDelta: -5,  // Small penalty (failed execution)
    };
  } else {
    // ── FORCE AT LEAD BASE ──
    return {
      type: 'bunt_force',
      text: `${batter.name} bunts into a force out at the lead base — rally is killed.`,
      batterOut: true,
      success: false,
      composureDelta: -8,  // Moderate penalty (killed the rally)
    };
  }
}

function resolveBuntForHit(batter, game) {
  // Speed is the key — scales heavily off SPD.
  // Slow guys make outs (which is why they shouldn't attempt).
  const spdRating = (batter.speed || 5) / 10;
  const pwrRating = (batter.power || 5) / 10;
  
  // High SPD beats defense, low PWR forces bunts to be short/weak (easier to field)
  const contactChance = 0.45 * spdRating - pwrRating * 0.10;
  
  if (Math.random() >= contactChance) {
    // ── MAKE AN OUT (most likely for slow guys) ──
    return {
      type: 'bunt_for_hit_out',
      text: `${batter.name} swings for the hills but bunts weakly — easy out.`,
      batterOut: true,
      success: false,
      composureDelta: -10,  // Moderate penalty
    };
  } else {
    // ── BUNT SINGLE ──
    // A bunt-for-hit single is still a hit allowed by the pitcher.
    // Pitcher composure goes down like any other hit.
    return {
      type: 'bunt_for_hit_single',
      text: `${batter.name} beats out a bunt single on the infield!`,
      batterOut: false,
      success: true,
      composureDelta: -9,  // Pitcher allowed a hit — negative
    };
  }
}