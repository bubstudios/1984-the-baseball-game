/**
 * Phase 2.7 - Situational Bunting Decision Gate (TUNED)
 *
 * Bunting is a PRE-SWING decision. Three types:
 * - sacrifice (runners + <2 outs, weak hitters / pitchers, clear sac spots)
 * - squeeze (runner on 3rd, late/close, playing for the run)
 * - bunt-for-hit (rare surprise from fast, low-power guys)
 *
 * Tuned to be RARE and SITUATIONAL. Most hitters in most spots should NOT bunt.
 */

import { determineSqueezeType, resolveSqueeze } from './squeezePlay';

const SAC_THRESHOLD = 50; // Raised from 38 - sac bunts must be strongly warranted
const HIT_THRESHOLD = 78; // Raised from 70 - bunt-for-hit must be a very strong fit

// A true bunt/speed/small-ball specialist: high bunting, high speed, low power.
// Only these players may bunt as pinch hitters.
function isBuntSpecialist(batter) {
  const bunting = batter.bunting || 3;
  const speed = batter.speed || 5;
  const power = batter.power || 5;
  return bunting >= 6 && speed >= 7 && power <= 4;
}

export function shouldBunt(batter, game) {
  if (!batter || !game) return null;

  const isPitcher = batter.is_pitcher || batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));

  // ── HARD GATE: bunt caps and anti-spam rules ──
  const tracking = game.buntTracking || {};
  const totalBunts = tracking.totalBunts || 0;
  const buntedThisInning = tracking.lastBuntInning === game.inning;
  const isExtraInnings = game.inning >= 10;

  // Rule: No more than 1 sacrifice bunt attempt per inning.
  if (buntedThisInning) return null;

  // Rule: No more than 2 total bunt attempts per team per game (unless extra innings).
  if (totalBunts >= 2 && !isExtraInnings) return null;

  // Rule: Pinch hitters must swing unless they are a true bunt/speed specialist.
  if (game.isPinchHitter && !isBuntSpecialist(batter)) return null;

  // Rule: Power hitters (6+) never bunt (non-pitchers).
  if ((batter.power || 0) >= 6 && !isPitcher) return null;

  // — SACRIFICE BUNT —
  const sacScore = sac_bunt_score(batter, game, isPitcher);
  if (sacScore >= SAC_THRESHOLD) {
    // Even when it qualifies, don't ALWAYS bunt - add a probability gate.
    // Pitchers bunt often in true sac spots; position players rarely.
    const sacChance = isPitcher ? 0.85 : 0.35;
    if (Math.random() < sacChance) return 'sacrifice';
  }

  // NOTE: Squeeze is a separate decision handled by shouldAttemptSqueeze()
  // in gameEngine.js, not by shouldBunt(). This prevents over-triggering.

  // — BUNT-FOR-HIT (rare surprise)
  if (!buntedThisInning && totalBunts < 2) {
    const hitScore = hitBuntScore(batter, game);
    if (hitScore >= HIT_THRESHOLD && Math.random() < 0.08) {
      return 'bunt_for_hit';
    }
  }

  return null;
}

/**
 * Squeeze bunt score - evaluated when runner on 3rd and <2 outs.
 * Fires in late/close situations where playing for one run makes sense.
 */
function squeeze_bunt_score(batter, game, isPitcher) {
  if (!game.runner_on_3rd) return 0;
  if (game.outs >= 2) return 0;

  let s = 0;

  // Only squeeze in late innings
  if (game.inning >= 8) s += 30;
  else if (game.inning >= 7) s += 22;
  else if (game.inning >= 6) s += 10;
  else return 0; // don't squeeze early

  // Close game situations
  if (Math.abs(game.score_margin) <= 1) s += 25;
  if (game.score_margin === 0) s += 15; // tie game - playing for the go-ahead run
  if (game.score_margin >= -3 && game.score_margin <= -1) s += 10; // trailing, need the run

  // Don't squeeze when up big or down big
  if (game.score_margin >= 3 || game.score_margin <= -4) return 0;

  // Weak hitters / pitchers more likely to squeeze
  if (isPitcher) s += 20;
  if ((batter.power || 5) <= 3) s += 15;
  if ((batter.contact || 5) <= 5) s += 8;

  return s;
}

/**
 * Sacrifice bunt score - evaluated when runners are on and <2 outs.
 */
function sac_bunt_score(batter, game, isPitcher) {
  // Must have runner to advance and <2 outs
  if (!game.runner_on_1st && !game.runner_on_2nd && !game.runner_on_3rd) return 0;
  if (game.outs >= 2) return 0;

  // Runner must be in sac-appropriate spot (1st or 2nd)
  const runnerInSacSpot = game.runner_on_1st || game.runner_on_2nd;
  if (!runnerInSacSpot) return 0;

  // HARD SUPPRESSORS: Good hitters never sac bunt
  if ((batter.power || 0) >= 6) return 0; // was >= 7 - now even power-6 sluggers don't bunt
  if (!isPitcher && (batter.contact || 0) >= 7) return 0; // Contact >= 7 non-pitchers never sac

  // EARLY-INNING SUPPRESSOR: Non-pitchers don't sac before 6th
  if (!isPitcher && game.inning < 6) return 0;

  let s = 0;

  // Pitcher batting = near-automatic sac consideration
  if (isPitcher) {
    s += 70; // baseline for pitcher
  }

  // Runner advancement value
  if (game.runner_on_1st && !game.runner_on_2nd && !game.runner_on_3rd) {
    s += 16; // 1st only, modest value (bumped for frequency)
  }
  if (game.runner_on_2nd && !game.runner_on_3rd) {
    s += 20; // 2nd to 3rd with <2 outs = big
  }
  if (game.runner_on_1st && game.runner_on_2nd && !game.runner_on_3rd) {
    s += 22; // move both up
  }

  // Game situation - late & close only
  if (game.inning >= 8) {
    s += 18; // very late
  } else if (game.inning >= 7) {
    s += 12; // late
  }
  if (Math.abs(game.score_margin) <= 1) {
    s += 18; // close game (bumped for frequency)
  }
  if (game.score_margin === 0 && game.inning >= 8) {
    s += 12; // tie, very late
  }

  // HARD BLOCK: don't sacrifice when trailing by 2+ (need baserunners, not outs)
  if (game.score_margin <= -2) return 0;
  // HARD BLOCK: don't sacrifice when leading by 3+ (already in control)
  if (game.score_margin >= 3) return 0;
  // Soft penalty: leading by 2 (still close, but giving up an out is questionable)
  if (game.score_margin === 2) s -= 15;

  // Genuinely weak hitter - bunting costs little
  if (batter.power <= 3) s += 12;
  if (batter.contact <= 4) s += 8;

  return s;
}

/**
 * Bunt-for-hit score. Fast, low-power guys only, and only as an occasional surprise.
 */
function hitBuntScore(batter, game) {
  if (game.outs >= 2) return 0;

  // Speed is the entire premise - must be genuinely fast
  if ((batter.speed || 0) < 7) return 0; // was 6; now only real speed qualifies

  // Must be low power - this is a slap-bunt profile, not a hitter giving up an AB
  if ((batter.power || 5) > 4) return 0;

  let s = 0;

  if (batter.speed >= 9) s += 35;
  else if (batter.speed >= 8) s += 28;
  else s += 20; // speed 7

  if (batter.power <= 2) s += 18; // true slap-hitter
  else if (batter.power <= 3) s += 10;

  if (game.third_baseman_playing_back) s += 18; // defense conceding it

  // Best as a leadoff baserunner late in a close game
  if (game.bases_empty && game.inning >= 7 && Math.abs(game.score_margin) <= 1) {
    s += 12;
  }

  // Don't bunt for a hit with runners in scoring position you'd strand / a rally going
  if (game.runner_on_2nd || game.runner_on_3rd) {
    s -= 20;
  }

  s += Math.random() * 8; // small unpredictability

  return s;
}

/**
 * Resolve a bunt attempt.
 */
export function resolveBunt(buntType, batter, game) {
  if (buntType === 'squeeze') {
    const squeezeType = determineSqueezeType(batter);
    return resolveSqueeze(batter, game, squeezeType);
  }
  if (buntType === 'sacrifice') return resolveSacBunt(batter, game);
  if (buntType === 'bunt_for_hit') return resolveBuntForHit(batter, game);
  return null;
}

function resolveSacBunt(batter, game) {
  // Squeeze is now a separate decision type ('squeeze'), not auto-converted here.
  // This function only handles standard sacrifice bunts.
  const isPitcher = batter.is_pitcher || batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));
  const conRating = (batter.contact || 3) / 10;
  const pitcherBonus = isPitcher ? 0.10 : 0;

  const cleanSacChance = 0.45 + conRating * 0.30 + pitcherBonus; // competent sac success
  const roll = Math.random();

  if (roll < cleanSacChance) {
    return {
      type: 'sacrifice_success',
      text: `${batter.name} lays down a sacrifice bunt - runner advances, batter out.`,
      batterOut: true,
      success: true,
      composureDelta: -2,
    };
  } else if (roll < cleanSacChance + 0.08) {
    // Bunt single - rarer now (was 0.15)
    return {
      type: 'bunt_single',
      text: `${batter.name} sneaks a bunt single through the infield! Runners advance.`,
      batterOut: false,
      success: true,
      composureDelta: -8,
    };
  } else if (roll < cleanSacChance + 0.26) {
    return {
      type: 'bunt_pop',
      text: `${batter.name} pops up the bunt attempt - caught!`,
      batterOut: true,
      success: false,
      composureDelta: -5,
    };
  } else {
    return {
      type: 'bunt_force',
      text: `${batter.name} bunts into a force out at the lead base - rally killed.`,
      batterOut: true,
      success: false,
      composureDelta: -8,
    };
  }
}

function resolveBuntForHit(batter, game) {
  const spdRating = (batter.speed || 5) / 10;
  const pwrRating = (batter.power || 5) / 10;

  // Realistic bunt-for-hit success: even fast guys only beat it out ~30-40% of the time.
  // (was effectively ~38% for any qualifying guy AND fired far too often)
  const successChance = Math.max(0.10, Math.min(0.40, 0.30 * spdRating + 0.10 - pwrRating * 0.05));

  if (Math.random() < successChance) {
    return {
      type: 'bunt_for_hit_single',
      text: `${batter.name} beats out a bunt single on the infield!`,
      batterOut: false,
      success: true,
      composureDelta: -9,
    };
  } else {
    return {
      type: 'bunt_for_hit_out',
      text: `${batter.name} tries to bunt for a hit but is thrown out at first.`,
      batterOut: true,
      success: false,
      composureDelta: -6,
    };
  }
}