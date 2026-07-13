// Box Score Validators - loud-failing assertions per Session 17/18/19 spec.
// Run after every CPU game. Failures assert + console.error + set a visible flag.
// NEVER clamp values here - these are validators, not mutators.
// Session 19: On failure, dumps inning-by-inning event log + pitching changes.

import { playerId } from './seasonStore';

function dumpGameLog(state) {
  console.error('[Validator Dump] Inning-by-inning event log:');
  let currentInning = 0;
  for (const entry of (state.log || [])) {
    if (entry.text?.includes('of inning')) currentInning++;
    if (entry.type === 'info' && (entry.text?.includes('🔄') || entry.text?.includes('replaces'))) {
      console.error(`  [PITCHING CHANGE] ${entry.text}`);
    }
  }
  console.error('[Validator Dump] Full log:');
  (state.log || []).forEach((e, i) => {
    console.error(`  ${i}: [${e.type}] ${e.text || ''}`);
  });
}

/**
 * Validate a final game state + extracted box score.
 * Returns { valid, errors } - caller should surface errors visibly.
 */
export function validateGameBoxScore(state, boxResult) {
  const errors = [];

  // 1. Pitching staff runs-allowed must equal opponent batting runs (line score)
  for (const side of ['home', 'away']) {
    const oppSide = side === 'home' ? 'away' : 'home';
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const pitchingR = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.r || 0), 0);
    const lineScoreR = state.score[oppSide] || 0;
    if (pitchingR !== lineScoreR) {
      errors.push(`[VALIDATOR] ${teamKey} pitching staff R=${pitchingR} but opponent line score R=${lineScoreR} (delta=${pitchingR - lineScoreR})`);
    }
  }

  // 2. ER must never exceed R for any pitcher
  for (const p of (boxResult.pitching || [])) {
    if ((p.er || 0) > (p.r || 0)) {
      errors.push(`[VALIDATOR] ${p.name} has ER=${p.er} > R=${p.r} (impossible)`);
    }
  }

  // 3. No phantom pitchers (0 BF) - unless officially entered (in pitchingByTeam manifest)
  // A pitcher who was entered into the game but didn't face a batter (e.g., game
  // ended, inning ended on a defensive play) must still appear per spec.
  for (const p of (boxResult.pitching || [])) {
    if ((p.bf || 0) === 0) {
      const inManifest = ['home', 'away'].some(side => {
        const manifest = state.pitchingByTeam?.[side] || [];
        return manifest.some(m => m.name === p.name);
      });
      if (!inManifest) {
        errors.push(`[VALIDATOR] ${p.name} appears in pitching with 0 BF (phantom - should have been filtered)`);
      }
    }
  }

  // 4. Decision pitchers must have faced batters (no 0-BF decisions)
  const decisions = boxResult.decisions || {};
  for (const [dec, pid] of Object.entries(decisions)) {
    if (!pid) continue;
    const pitcher = (boxResult.pitching || []).find(p => p.playerId === pid);
    if (pitcher && (pitcher.bf || 0) === 0) {
      errors.push(`[VALIDATOR] ${pitcher.name} credited with ${dec} but has 0 BF`);
    }
  }

  // 5. Total pitching outs must match defensive outs recorded
  // Session 19 2B: More precise - expected outs = 3 * innings fielded
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const totalOuts = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.outs || 0), 0);
    // Expected: home team pitches top halves, away pitches bottom halves
    const inningsFielded = side === 'home' ? state.inning : state.inning;
    const isHomeTeam = side === 'home';
    // Home team pitches when halfInning is 'top'; if game ended in bottom, home pitched one fewer half
    const homePitchedTop = state.gameOver && state.halfInning === 'top' ? state.inning - 1 : state.inning;
    const awayPitchedBottom = state.gameOver && state.halfInning === 'top' ? state.inning - 1 : state.inning;
    const expectedOuts = isHomeTeam ? homePitchedTop * 3 : awayPitchedBottom * 3;
    if (totalOuts > 0 && Math.abs(totalOuts - expectedOuts) > 2) {
      errors.push(`[VALIDATOR] ${teamKey} pitching staff recorded ${totalOuts} outs but expected ~${expectedOuts} (${inningsFielded} innings fielded)`);
    }
  }

  // 6. Session 19 2C: Batting runs must match line score
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const battingR = (boxResult.batting || [])
      .filter(b => b.teamKey === teamKey)
      .reduce((sum, b) => sum + (b.r || 0), 0);
    const lineScoreR = state.score[side] || 0;
    if (battingR !== lineScoreR) {
      errors.push(`[VALIDATOR] ${teamKey} batting R=${battingR} but line score R=${lineScoreR} (delta=${battingR - lineScoreR})`);
    }
  }

  // 7. Session 19: Pitching hits must match opponent batting hits
  for (const side of ['home', 'away']) {
    const oppSide = side === 'home' ? 'away' : 'home';
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const oppTeamKey = oppSide === 'home' ? state.homeTeam : state.awayTeam;
    const pitchingH = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.h || 0), 0);
    const battingH = (boxResult.batting || [])
      .filter(b => b.teamKey === oppTeamKey)
      .reduce((sum, b) => sum + (b.h || 0), 0);
    if (pitchingH !== battingH) {
      errors.push(`[VALIDATOR] ${teamKey} pitching H=${pitchingH} but ${oppTeamKey} batting H=${battingH} (delta=${pitchingH - battingH})`);
    }
  }

  // 8. Session 19: Pitching strikeouts must match opponent batting strikeouts
  for (const side of ['home', 'away']) {
    const oppSide = side === 'home' ? 'away' : 'home';
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const oppTeamKey = oppSide === 'home' ? state.homeTeam : state.awayTeam;
    const pitchingK = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.so || 0), 0);
    const battingSO = (boxResult.batting || [])
      .filter(b => b.teamKey === oppTeamKey)
      .reduce((sum, b) => sum + (b.so || 0), 0);
    if (pitchingK !== battingSO) {
      errors.push(`[VALIDATOR] ${teamKey} pitching K=${pitchingK} but ${oppTeamKey} batting SO=${battingSO} (delta=${pitchingK - battingSO})`);
    }
  }

  // 9. Session 19 2A: Winning pitcher must be valid (extra-inning check)
  const homeWon = state.score.home > state.score.away;
  const winningSide = homeWon ? 'home' : 'away';
  const winningTeamKey = winningSide === 'home' ? state.homeTeam : state.awayTeam;
  const wentExtra = state.inning > 9;
  if (decisions.winner) {
    const winPitcher = (boxResult.pitching || []).find(p => p.playerId === decisions.winner);
    if (winPitcher) {
      // Must have BF > 0
      if ((winPitcher.bf || 0) === 0) {
        errors.push(`[VALIDATOR] Winning pitcher ${winPitcher.name} has 0 BF`);
      }
      // Extra-inning check: if game went extras, starter must not get W if they exited before lead taken for good
      if (wentExtra && winPitcher.gs === 1) {
        const starterOuts = winPitcher.outs || 0;
        if (starterOuts < 15) {
          errors.push(`[VALIDATOR] Starter ${winPitcher.name} credited with W in extra-inning game but only recorded ${starterOuts} outs (< 15, exited before lead taken for good)`);
        }
      }
    }
  }

  // 10. Session 19: Save pitcher must be valid
  if (decisions.save) {
    const savePitcher = (boxResult.pitching || []).find(p => p.playerId === decisions.save);
    if (savePitcher && (savePitcher.bf || 0) === 0) {
      errors.push(`[VALIDATOR] Save pitcher ${savePitcher.name} has 0 BF`);
    }
  }

  // 11. Session 19: Sim never stalled (game must have reached a natural conclusion)
  if (!state.gameOver) {
    errors.push(`[VALIDATOR] Game ended without gameOver=true (possible sim stall)`);
  }

  // 12. Session 20 Part 1: Impossible pitching line (K > 0 but outs === 0 = accrual failure)
  for (const p of (boxResult.pitching || [])) {
    if ((p.so || 0) > 0 && (p.outs || 0) === 0) {
      errors.push(`[VALIDATOR] ${p.name} has ${p.so} K but 0 outs - accrual failure (NOT a phantom to suppress)`);
    }
  }

  // 13. BOX_SCORE_RHE_MISSING: top-line R/H/E must be present and consistent
  const homeBattingR = (boxResult.batting || [])
    .filter(b => b.teamKey === state.homeTeam)
    .reduce((s, b) => s + (b.r || 0), 0);
  const awayBattingR = (boxResult.batting || [])
    .filter(b => b.teamKey === state.awayTeam)
    .reduce((s, b) => s + (b.r || 0), 0);
  if (homeBattingR !== state.score.home) {
    errors.push(`[VALIDATOR] BOX_SCORE_RHE_MISSING: home R=${state.score.home} but batting R total=${homeBattingR}`);
  }
  if (awayBattingR !== state.score.away) {
    errors.push(`[VALIDATOR] BOX_SCORE_RHE_MISSING: away R=${state.score.away} but batting R total=${awayBattingR}`);
  }

  // 14. MISSING_PITCHER_APPEARANCE: any pitcher with activity must be in the box score
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    for (const p of getValidatorPitcherList(state, side)) {
      const gs = p.gameStats || {};
      const hasActivity = (gs.pitches || 0) > 0 || (gs.outs || 0) > 0 || (gs.so || 0) > 0;
      if (hasActivity) {
        const inBox = (boxResult.pitching || []).some(bp => bp.name === p.name && bp.teamKey === teamKey);
        if (!inBox) {
          errors.push(`[VALIDATOR] MISSING_PITCHER_APPEARANCE: ${p.name} (${teamKey}) has activity (outs=${gs.outs||0}, pitches=${gs.pitches||0}, K=${gs.so||0}) but is missing from the pitching box score`);
        }
      }
    }
  }

  // 15. MANIFEST_COMPLETENESS: every pitcher in the pitchingByTeam manifest
  // must appear in the box score - the manifest is the source of truth for
  // who entered the game. No pitcher should be missing, even with 0 stats.
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const manifest = state.pitchingByTeam?.[side] || [];
    for (const m of manifest) {
      const inBox = (boxResult.pitching || []).some(bp => bp.name === m.name && bp.teamKey === teamKey);
      if (!inBox) {
        errors.push(`[VALIDATOR] MANIFEST_COMPLETENESS: ${m.name} (${teamKey}) is in the pitchingByTeam manifest but missing from the box score`);
      }
    }
  }

  // 16. WLS_TBD_AFTER_FINAL: W/L must not be null/TBD after game final
  if (state.gameOver) {
    const decisions = boxResult.decisions || {};
    if (!decisions.winner) {
      errors.push(`[VALIDATOR] WLS_TBD_AFTER_FINAL: winning pitcher is null/TBD after game final`);
    }
    if (!decisions.loser) {
      errors.push(`[VALIDATOR] WLS_TBD_AFTER_FINAL: losing pitcher is null/TBD after game final`);
    }
  }

  if (errors.length > 0) {
    console.error('[BoxScoreValidator] VALIDATION FAILED:');
    errors.forEach(e => console.error(e));
    dumpGameLog(state);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Session 21 Part 1: BLOCKING validator for pitching outs reconciliation.
 * THROWS on failure - the caller must NOT commit season stats if this throws.
 */
export function validatePitchingOuts(state, boxResult) {
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const totalOuts = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.outs || 0), 0);
    // Expected outs = 3 * innings fielded
    // Home pitches the top half; away pitches the bottom half
    // If game ended in the top of inning N, home pitched N innings, away pitched N-1
    // If game ended in the bottom of inning N, home pitched N, away pitched N
    const endedInTop = state.gameOver && state.halfInning === 'top';
    const expectedOuts = side === 'home'
      ? (endedInTop ? state.inning - 1 : state.inning) * 3
      : (endedInTop ? state.inning - 1 : state.inning) * 3;

    if (totalOuts > 0 && Math.abs(totalOuts - expectedOuts) > 2) {
      throw new Error(
        `Pitching outs mismatch: ${teamKey} expected ${expectedOuts}, got ${totalOuts}`
      );
    }
  }
}

/**
 * Session 21 Part 6: Master blocking validator.
 * Runs ALL checks. If ANY fails, throws - caller must NOT commit stats.
 */
export function validateGameBlocking(state, boxResult) {
  // Part 1 - the key one: pitching outs must reconcile
  validatePitchingOuts(state, boxResult);

  // Run the full suite for additional checks
  const result = validateGameBoxScore(state, boxResult);
  if (!result.valid) {
    throw new Error(`Game validation failed: ${result.errors.join('; ')}`);
  }
}

// Validator's pitcher list: any player from history or current with pitching activity.
// Mirrors the fixed getPitcherList in seasonEngine.js - includes pitchers by
// activity, not just by pos tag, to catch missing appearances.
function getValidatorPitcherList(state, side) {
  const current = side === 'home' ? state.homePitcher : state.awayPitcher;
  const history = side === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  const all = [...history];
  if (current && !all.find(p => p.name === current.name)) {
    all.push(current);
  }
  // Deduplicate by name, merging pitching activity stats
  const seen = new Map();
  const deduped = [];
  for (const p of all) {
    if (!p || !p.name) continue;
    if (seen.has(p.name)) {
      const existing = seen.get(p.name);
      const eg = existing.gameStats || {}, pg = p.gameStats || {};
      existing.gameStats = {
        ...eg,
        outs: (eg.outs || 0) + (pg.outs || 0),
        pitches: (eg.pitches || 0) + (pg.pitches || 0),
        so: (eg.so || 0) + (pg.so || 0),
      };
    } else {
      seen.set(p.name, p);
      deduped.push(p);
    }
  }
  return deduped;
}