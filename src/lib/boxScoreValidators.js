// Box Score Validators - loud-failing assertions per Session 17/18 spec.
// Run after every CPU game. Failures assert + console.error + set a visible flag.
// NEVER clamp values here - these are validators, not mutators.

import { playerId } from './seasonStore';

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

  // 3. No phantom pitchers (0 BF, 0 outs, 0 stats)
  for (const p of (boxResult.pitching || [])) {
    if ((p.bf || 0) === 0 && (p.outs || 0) === 0 && (p.pitches || 0) === 0) {
      errors.push(`[VALIDATOR] ${p.name} appears in pitching with 0 BF, 0 outs, 0 pitches (phantom)`);
    }
  }

  // 4. Decision pitchers must have faced batters
  const decisions = boxResult.decisions || {};
  for (const [dec, pid] of Object.entries(decisions)) {
    if (!pid) continue;
    const pitcher = (boxResult.pitching || []).find(p => p.playerId === pid);
    if (pitcher && (pitcher.bf || 0) === 0) {
      errors.push(`[VALIDATOR] ${pitcher.name} credited with ${dec} but has 0 BF`);
    }
  }

  // 5. Total pitching outs must match defensive outs recorded
  for (const side of ['home', 'away']) {
    const teamKey = side === 'home' ? state.homeTeam : state.awayTeam;
    const totalOuts = (boxResult.pitching || [])
      .filter(p => p.teamKey === teamKey)
      .reduce((sum, p) => sum + (p.outs || 0), 0);
    // Expected outs: 27 for a full 9-inning game (or fewer if walk-off/home doesn't bat 9th)
    // We can't know exact outs without tracking, so check for gross anomalies (e.g., < 18)
    if (totalOuts > 0 && totalOuts < 18 && state.inning >= 9) {
      errors.push(`[VALIDATOR] ${teamKey} pitching staff only recorded ${totalOuts} outs in a ${state.inning}-inning game (expected ~27)`);
    }
  }

  if (errors.length > 0) {
    console.error('[BoxScoreValidator] VALIDATION FAILED:');
    errors.forEach(e => console.error(e));
  }

  return { valid: errors.length === 0, errors };
}