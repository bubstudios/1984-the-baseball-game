// allStarRules.js - All-Star Game specific rules for Season Mode.
// The ASG is a Season Mode special event, not Exhibition Mode. These rules
// enforce ASG pitcher usage limits, CPU showcase rotation, and ensure ASG
// stats never pollute regular-season totals.

import { deepCopyState } from './deepCopyState';
import { TEAMS } from './gameData';

// ASG pitcher usage limits (in outs)
const ASG_MAX_OUTS_STARTER = 9;   // 3 innings
const ASG_MAX_OUTS_RELIEVER = 6;  // 2 innings

// Detect if the current game state is an All-Star Game
export function isAllStarGame(state) {
  if (!state) return false;
  const ht = state.homeTeam || '';
  const at = state.awayTeam || '';
  return ht === 'AL_ALLSTAR' || ht === 'NL_ALLSTAR' || at === 'AL_ALLSTAR' || at === 'NL_ALLSTAR';
}

// Returns the max outs an ASG pitcher can throw
export function getAllStarPitcherMaxOuts(isStartingPitcher) {
  return isStartingPitcher ? ASG_MAX_OUTS_STARTER : ASG_MAX_OUTS_RELIEVER;
}

// Check if a pitcher has reached their ASG usage limit
export function hasReachedAllStarPitchLimit(pitcher, isStartingPitcher) {
  if (!pitcher) return false;
  const outs = pitcher.gameStats?.outs || Math.round((pitcher.gameStats?.ip || 0) * 3);
  return outs >= getAllStarPitcherMaxOuts(isStartingPitcher);
}

// Check if a pitcher is approaching the limit (for UI warnings)
export function getAllStarPitcherStatus(pitcher, isStartingPitcher) {
  if (!pitcher) return { remaining: 0, atLimit: false, nearLimit: false };
  const outs = pitcher.gameStats?.outs || Math.round((pitcher.gameStats?.ip || 0) * 3);
  const maxOuts = getAllStarPitcherMaxOuts(isStartingPitcher);
  const remaining = maxOuts - outs;
  return {
    remaining,
    atLimit: outs >= maxOuts,
    nearLimit: remaining <= 3,
  };
}

// ── Position compatibility ──
// Determines whether a player with playerPos can legally play targetPos.
// Catcher is exclusive. Corner IF swap, middle IF swap, OF swap.
const CORNER_INFIELD = new Set(['1B', '3B']);
const MIDDLE_INFIELD = new Set(['2B', 'SS']);
const OUTFIELD = new Set(['LF', 'CF', 'RF']);

function canPlayPosition(playerPos, targetPos) {
  if (!playerPos || !targetPos) return false;
  if (playerPos === targetPos) return true;
  if (targetPos === 'C' || playerPos === 'C') return false;
  if (CORNER_INFIELD.has(playerPos) && CORNER_INFIELD.has(targetPos)) return true;
  if (MIDDLE_INFIELD.has(playerPos) && MIDDLE_INFIELD.has(targetPos)) return true;
  if (OUTFIELD.has(playerPos) && OUTFIELD.has(targetPos)) return true;
  return false;
}

// Find the best available bench player for a target position.
// Prioritizes exact position match, then falls back to compatible positions.
// When protectCatchers is true, C-positioned bench players are reserved for
// catching duty only (not used at other positions in early waves).
function findBenchForPosition(bench, targetPos, usedReplacements, protectCatchers) {
  const candidates = bench.filter(p =>
    !usedReplacements.has(p.name) && canPlayPosition(p.pos, targetPos)
  );
  if (candidates.length === 0) return null;

  let pool = candidates;
  if (protectCatchers) {
    const nonCatchers = candidates.filter(p => p.pos !== 'C');
    if (nonCatchers.length > 0) pool = nonCatchers;
  }

  pool.sort((a, b) => {
    const aMatch = a.pos === targetPos ? 1 : 0;
    const bMatch = b.pos === targetPos ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return (b.contact + b.power) - (a.contact + a.power);
  });
  return pool[0];
}

// CPU All-Star Game showcase position player rotation.
//
// Wave-based timing per builder spec:
//   Wave 1 (inning 4 - end of 3rd): replace 3 starting position players
//   Wave 2 (inning 6 - end of 5th): replace all remaining starters (where
//          a legal bench replacement exists)
//   Wave 3 (inning 8 - end of 7th): optional cleanup of any remaining starters
//
// Rules enforced:
//   - Starters should not remain after inning 6 unless no legal replacement
//   - Catcher protection: delay C substitution to wave 2 (don't burn backup C early)
//   - Keep at least 1 emergency bench reserve in wave 1
//   - No re-entry (enforced by usedNames tracking)
//   - Not every bench player has to appear
//   - Position legality: replacements must be able to play the target position
export function cpuAllStarPositionRotation(state) {
  const newState = deepCopyState(state);
  if (newState.gameOver) return newState;
  if (newState.inning < 4) return newState;

  // Only at the start of an at-bat (0-0 count)
  if (newState.balls !== 0 || newState.strikes !== 0) return newState;

  const battingSide = newState.halfInning === 'top' ? 'away' : 'home';
  const battingTeamKey = battingSide === 'home' ? newState.homeTeam : newState.awayTeam;
  const teamData = TEAMS[battingTeamKey];
  if (!teamData || !teamData._isAllStarTeam) return newState;

  // Track which sub waves have been applied for this side (persisted on state)
  const waveKey = battingSide === 'home' ? '_asgSubWaveHome' : '_asgSubWaveAway';
  if (!newState[waveKey]) newState[waveKey] = {};
  const waves = newState[waveKey];

  // Determine which wave to apply based on inning
  let waveName = null;
  let targetCount = 0;
  let reserveCount = 0;
  if (newState.inning >= 4 && !waves.wave1) {
    waveName = 'wave1';
    targetCount = 3;
    reserveCount = 1; // keep one emergency reserve
  } else if (newState.inning >= 6 && !waves.wave2) {
    waveName = 'wave2';
    targetCount = 99; // all remaining starters
    reserveCount = 0;
  } else if (newState.inning >= 8 && !waves.wave3) {
    waveName = 'wave3';
    targetCount = 99; // optional cleanup
    reserveCount = 0;
  } else {
    return newState; // no sub wave due
  }

  // Mark wave as applied immediately (even if no subs are possible, don't retry)
  waves[waveName] = true;

  const battingLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
  const benchUsedKey = battingSide === 'home' ? 'homeBenchUsed' : 'awayBenchUsed';
  const histKey = battingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';

  // Track all used names for no-re-entry enforcement
  const usedNames = new Set();
  battingLineup.forEach(p => usedNames.add(p.name));
  (newState[benchUsedKey] || []).forEach(p => usedNames.add(p.name));
  (newState[histKey] || []).forEach(p => usedNames.add(p.name));

  const fullBench = teamData.bench || [];
  const benchNames = new Set(fullBench.map(p => p.name));
  const availableBench = fullBench.filter(p =>
    !usedNames.has(p.name) && !['SP', 'RP', 'CL'].includes(p.pos)
  );

  if (availableBench.length === 0) return newState;

  // Identify starters to replace: original starters (not bench players who
  // already entered), not pitchers, and subject to catcher protection.
  const startersToReplace = [];
  for (let i = 0; i < battingLineup.length; i++) {
    const p = battingLineup[i];
    const pos = p.assignedPos || p.pos;
    if (['SP', 'RP', 'CL'].includes(pos)) continue; // skip pitchers
    if (benchNames.has(p.name)) continue; // already replaced by a bench player
    // Catcher protection: delay C sub to wave 2 so the backup catcher
    // isn't burned too early.
    if (pos === 'C' && waveName === 'wave1') continue;
    startersToReplace.push({ index: i, player: p, pos });
  }

  if (startersToReplace.length === 0) return newState;

  // Determine how many subs to make this wave
  let subsToMake = Math.min(targetCount, startersToReplace.length);
  const maxFromBench = availableBench.length - reserveCount;
  subsToMake = Math.min(subsToMake, Math.max(0, maxFromBench));
  if (subsToMake <= 0) return newState;

  // Sort: replace catcher last to protect catching depth
  startersToReplace.sort((a, b) => {
    if (a.pos === 'C' && b.pos !== 'C') return 1;
    if (b.pos === 'C' && a.pos !== 'C') return -1;
    return 0;
  });

  // Execute substitutions
  let subsMade = 0;
  const usedReplacements = new Set();
  const protectCatchers = waveName === 'wave1';

  for (const starter of startersToReplace) {
    if (subsMade >= subsToMake) break;

    const replacement = findBenchForPosition(availableBench, starter.pos, usedReplacements, protectCatchers);
    if (!replacement) continue;

    const slot = starter.index;
    const oldBatter = { ...battingLineup[slot] };
    battingLineup[slot] = {
      ...replacement,
      order: oldBatter.order,
      assignedPos: starter.pos,
      pos: starter.pos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
      _allStarSubbed: true,
    };

    newState[benchUsedKey] = [...(newState[benchUsedKey] || []), replacement];
    newState[histKey] = [...(newState[histKey] || []), oldBatter];
    usedReplacements.add(replacement.name);
    subsMade++;

    newState.log.push({ type: 'info', text: `* ASG: ${replacement.name} enters for ${oldBatter.name} (${starter.pos})` });
  }

  return newState;
}