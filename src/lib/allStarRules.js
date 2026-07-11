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

// CPU All-Star position player rotation.
// From inning 4+, pinch-hit for starting position players to get bench
// players into the game (showcase the full roster). Staggered: 1 sub per
// inning early, 2 per inning from inning 6+. Catcher subbed by inning 6.
export function cpuAllStarPositionRotation(state) {
  const newState = deepCopyState(state);
  if (newState.gameOver) return newState;
  if (newState.inning < 4) return newState;

  // Only at the start of an at-bat (0-0 count)
  if (newState.balls !== 0 || newState.strikes !== 0) return newState;

  const battingSide = newState.halfInning === 'top' ? 'away' : 'home';
  const battingTeamKey = battingSide === 'home' ? newState.homeTeam : newState.awayTeam;
  const teamData = TEAMS[battingTeamKey];
  if (!teamData) return newState;

  const battingLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
  const batterIdx = battingSide === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex;
  const batter = battingLineup[batterIdx % battingLineup.length];
  if (!batter) return newState;

  // Skip pitchers (handled by pitcher rotation logic)
  if (['SP', 'RP', 'CL'].includes(batter.assignedPos || batter.pos)) return newState;

  // Check if this batter is a starter (not already subbed via bench)
  const benchUsed = battingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
  const isAlreadySubbed = benchUsed.some(p => p.name === batter.name);
  if (isAlreadySubbed) return newState;

  // Get available bench
  const fullBench = teamData.bench || [];
  const usedNames = new Set();
  [...newState.homeLineup, ...newState.awayLineup].forEach(p => usedNames.add(p.name));
  benchUsed.forEach(p => usedNames.add(p.name));
  (battingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || [])).forEach(p => usedNames.add(p.name));
  const availableBench = fullBench.filter(p => !usedNames.has(p.name));

  if (availableBench.length === 0) return newState;

  // Stagger substitutions: 1 per inning early, 2 from inning 6+
  const subbedThisInning = battingLineup.filter(p => p._allStarSubbed).length;
  const maxSubs = newState.inning >= 6 ? 2 : 1;
  if (subbedThisInning >= maxSubs) return newState;

  // Pick best available bench player (highest contact+power)
  const replacement = [...availableBench].sort((a, b) => (b.contact + b.power) - (a.contact + a.power))[0];

  // Swap the batter in the lineup
  const slot = batterIdx % battingLineup.length;
  const oldBatter = { ...battingLineup[slot] };
  battingLineup[slot] = {
    ...replacement,
    order: oldBatter.order,
    assignedPos: oldBatter.assignedPos || oldBatter.pos,
    pos: oldBatter.assignedPos || oldBatter.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
    _allStarSubbed: true,
  };

  // Track bench usage
  const benchKey = battingSide === 'home' ? 'homeBenchUsed' : 'awayBenchUsed';
  if (!newState[benchKey]) newState[benchKey] = [];
  newState[benchKey].push(replacement);

  // Track history (old batter goes to history)
  const histKey = battingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
  if (!newState[histKey]) newState[histKey] = [];
  newState[histKey].push(oldBatter);

  newState.log.push({ type: 'info', text: `* ASG: ${replacement.name} enters for ${oldBatter.name}` });

  return newState;
}