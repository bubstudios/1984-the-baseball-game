/**
 * Strikeout Celebration Lines
 * 
 * Maps strikeout context to specific celebration texts.
 * Each array has multiple variations; pick one randomly.
 * Format: 🔥 text (for positive) or ⚡ text (for provocative)
 */

export const STRIKEOUT_CELEBRATIONS = {
  // ── K to end inning with runners stranded ──
  ended_inning_runners: [
    '🔥 He pounds his glove after stranding the runners!',
    '🔥 He strides off the mound, inning over!',
    '🔥 The strikeout ends the threat — he exits with a nod!',
    '🔥 He comes off the mound letting out a roar!',
  ],

  // ── Bases loaded K ──
  bases_loaded: [
    '🔥 He fires the final strike with bases loaded — fist pump!',
    '🔥 The pressure pitch for strike three — he escapes the jam!',
    '🔥 Strikeout with the bases full — he stares toward the dugout!',
    '🔥 He blows him away with bases loaded!',
  ],

  // ── K after falling behind 3–0 ──
  after_3_0: [
    '🔥 He comes back from 3–0 and strikes him out — fierce shout!',
    '🔥 The battle back — strikeout after being down three-oh!',
    '⚡ He strikes out the hitter who got ahead 3–0 — stares him down!',
  ],

  // ── K of opposing team's best hitter ──
  opposing_best_hitter: [
    '🔥 He strikes out their best hitter and pumps his fist!',
    '🔥 The opposing cleanup man goes down swinging!',
    '⚡ He points the glove at their best hitter after strike three!',
    '🔥 The strikeout silences the opposing dugout!',
  ],

  // ── Third consecutive K ──
  third_consecutive_k: [
    '🔥 Three strikeouts in a row — he raises both arms!',
    '🔥 The third consecutive strikeout — he grips the ball tight!',
    '🔥 Three up, three down at the K rate — he pounds his glove!',
  ],

  // ── K after long at-bat (8+ pitches) ──
  long_battle: [
    '🔥 He wins the long battle — strikeout on pitch eight!',
    '🔥 The full-count strikeout after a fierce battle!',
    '🔥 He outlasts the hitter after ten pitches — fist pump!',
    '⚡ The hitter finally gives in after the long battle — strikeout!',
  ],

  // ── Called strike three, perfectly located ──
  called_strike_perfect: [
    '🔥 The called strike three on a perfect pitch!',
    '🔥 He paints the corner and the hitter walks away!',
    '🔥 The pinpoint strike three — he points to the glove!',
  ],

  // ── K immediately after allowing HR ──
  after_home_run: [
    '🔥 He bounces back from the home run with a strikeout!',
    '🔥 The answer to the home run — K to settle down!',
    '🔥 He retaliates with a strikeout after giving up the round-tripper!',
  ],

  // ── K after error extended inning ──
  after_error: [
    '🔥 He escapes the error with a strikeout!',
    '🔥 The defense gives him a second chance — he strikes him out!',
    '🔥 The strikeout erases the error!',
  ],

  // ── K to preserve 1-run lead late ──
  preserve_late_lead: [
    '🔥 He punches out the tying run with one swing — late in the game!',
    '🔥 The crucial strikeout preserves the one-run lead!',
    '🔥 He strikes out the potential tying run in the ninth!',
    '⚡ The strikeout in a tight spot — he points to the dugout!',
  ],

  // ── Generic high-leverage K ──
  high_leverage: [
    '🔥 The strikeout in the clutch!',
    '🔥 He dominates with a big strikeout!',
    '🔥 The fastball for strike three!',
  ],
};

/**
 * Pick a strikeout celebration line based on the situation
 * @param {string} situationType - key matching STRIKEOUT_CELEBRATIONS
 * @returns {string|null} - celebration text or null if not applicable
 */
export function pickStrikeoutCelebration(situationType) {
  const lines = STRIKEOUT_CELEBRATIONS[situationType];
  if (!lines || lines.length === 0) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

/**
 * Determine the strikeout situation type from game state
 * @param {object} state - game state after strikeout
 * @param {object} pitcher - pitcher
 * @param {object} batter - batter who struck out
 * @returns {string|null} - situation type key or null if none match
 */
export function getStrikeoutSituationType(state, pitcher, batter) {
  const runners = state.bases.filter(b => b !== null);
  const basesFull = runners.length === 3;
  const runnersStranded = runners.length > 0;
  const isLate = state.inning >= 8;
  const closeLead = Math.abs(state.score.home - state.score.away) === 1;

  // Heuristics to detect situation (in order of priority)
  
  // Bases loaded K
  if (basesFull) return 'bases_loaded';

  // K to preserve 1-run lead late
  if (isLate && closeLead && runnersStranded) return 'preserve_late_lead';

  // K after error (would need state tracking — defer for now)
  // if (state._lastPlayWasError) return 'after_error';

  // K immediately after HR (would need tracking)
  // if (state._justAllowedHR) return 'after_home_run';

  // K with runners stranded, inning-ending (only after 3rd out recorded)
  if (runnersStranded && state.outs >= 3) return 'ended_inning_runners';

  // High-leverage fall-back
  if (isLate || basesFull || closeLead) return 'high_leverage';

  return null;
}