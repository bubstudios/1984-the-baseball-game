import { TEAMS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { initializePitcherComposure } from './pitcherComposure';

// Re-export functions that are used internally
export function pinchHit(state, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const isAway = newState.halfInning === 'top';
  const lineup = isAway ? newState.awayLineup : newState.homeLineup;
  const batterIdx = isAway ? newState.awayBatterIndex : newState.homeBatterIndex;
  const idx = batterIdx % lineup.length;
  const oldBatter = lineup[idx];

  const benchPlayer = {
    ...newPlayer,
    order: oldBatter.order,
    assignedPos: newPlayer.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
  };
  lineup[idx] = benchPlayer;

  // Mark bench player as used so they can't be reused
  const benchKey = isAway ? 'awayBenchUsed' : 'homeBenchUsed';
  if (!newState[benchKey]) newState[benchKey] = [];
  if (!newState[benchKey].find(p => p.name === newPlayer.name)) {
    newState[benchKey].push({ ...newPlayer });
  }

  // Save old batter to player history so box score retains their stats
  const historyKey = isAway ? 'awayPlayerHistory' : 'homePlayerHistory';
  if (!newState[historyKey].find(p => p.name === oldBatter.name)) {
    newState[historyKey].push({ ...oldBatter });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} pinch-hits for ${oldBatter.name}` });
  return newState;
}

export function pinchRun(state, baseIndex, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const runner = newState.bases[baseIndex];
  if (!runner) return state;

  const isAway = newState.halfInning === 'top';
  const lineup = isAway ? newState.awayLineup : newState.homeLineup;
  const slotIdx = lineup.findIndex(p => p.name === runner.name);

  const benchPlayer = {
    ...newPlayer,
    order: runner.order,
    assignedPos: runner.assignedPos || runner.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
  };

  if (slotIdx >= 0) {
    lineup[slotIdx] = benchPlayer;
  }
  newState.bases[baseIndex] = benchPlayer;

  // Mark bench player as used
  const benchKey = isAway ? 'awayBenchUsed' : 'homeBenchUsed';
  if (!newState[benchKey]) newState[benchKey] = [];
  if (!newState[benchKey].find(p => p.name === newPlayer.name)) {
    newState[benchKey].push({ ...newPlayer });
  }

  // Save old runner to player history
  const historyKey = isAway ? 'awayPlayerHistory' : 'homePlayerHistory';
  if (!newState[historyKey].find(p => p.name === runner.name)) {
    newState[historyKey].push({ ...runner });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} pinch-runs for ${runner.name}` });
  return newState;
}

export function defensiveSwitch(state, slotIndex, newPos, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const isAwayFielding = newState.halfInning === 'bottom';
  const lineup = isAwayFielding ? newState.awayLineup : newState.homeLineup;
  const oldPlayer = lineup[slotIndex];

  if (newPlayer) {
    const benchPlayer = {
      ...newPlayer,
      order: oldPlayer.order,
      assignedPos: newPos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
    };
    lineup[slotIndex] = benchPlayer;

    // Mark bench player as used
    const benchKey = isAwayFielding ? 'awayBenchUsed' : 'homeBenchUsed';
    if (!newState[benchKey]) newState[benchKey] = [];
    if (!newState[benchKey].find(p => p.name === newPlayer.name)) {
      newState[benchKey].push({ ...newPlayer });
    }

    // Save old fielder to player history
    const historyKey = isAwayFielding ? 'awayPlayerHistory' : 'homePlayerHistory';
    if (!newState[historyKey].find(p => p.name === oldPlayer.name)) {
      newState[historyKey].push({ ...oldPlayer });
    }

    newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} replaces ${oldPlayer.name} at ${newPos}` });
  } else {
    lineup[slotIndex] = { ...oldPlayer, assignedPos: newPos };
    newState.log.push({ type: 'info', text: `🔄 ${oldPlayer.name} moves to ${newPos}` });
  }

  return newState;
}

export function changePitcher(state, newPitcher, side) {
  const newState = JSON.parse(JSON.stringify(state));
  // Use explicit side if provided, otherwise fall back to half-inning logic
  const isHome = side ? side === 'home' : newState.halfInning === 'top';
  const archetype = newPitcher.temperament || 'PROFESSIONAL';
  const composureState = initializePitcherComposure(newPitcher, archetype);
  const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: composureState };

  const oldPitcher = isHome ? newState.homePitcher : newState.awayPitcher;
  if (isHome) {
    newState.homePitcher = newP;
  } else {
    newState.awayPitcher = newP;
  }

  // Remove reliever from the bullpen
  const bullpen = isHome ? newState.homeBullpen : newState.awayBullpen;
  const bpIdx = bullpen.findIndex(p => p.name === newPitcher.name);
  if (bpIdx >= 0) bullpen.splice(bpIdx, 1);

  // Swap the new pitcher into the fielding lineup (only if DH is not in effect)
  const lineup = isHome ? newState.homeLineup : newState.awayLineup;
  const usesDH = newState.useDH;
  if (!usesDH) {
    let slotIdx = lineup.findIndex(p => p.name === oldPitcher.name);
    if (slotIdx < 0 && oldPitcher.order) slotIdx = lineup.findIndex(p => p.order === oldPitcher.order);
    if (slotIdx < 0) slotIdx = lineup.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
    if (slotIdx >= 0) {
      const lineupEntry = { ...newPitcher, order: lineup[slotIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      lineup[slotIdx] = lineupEntry;
      // Persist order + assignedPos on the pitcher state so future lookups can find their slot
      newP.order = lineupEntry.order;
      newP.assignedPos = 'SP';
    }
    // Never push a new entry — avoids creating a phantom batting slot
  }

  // Save old pitcher to player history so box score retains their stats
  const historyKey = isHome ? 'homePlayerHistory' : 'awayPlayerHistory';
  const existing = newState[historyKey].find(p => p.name === oldPitcher.name);
  if (existing) {
    existing.gameStats = {
      ...existing.gameStats,
      pitches: oldPitcher.gameStats.pitches,
      ip: oldPitcher.gameStats.ip,
      pitcherSo: oldPitcher.gameStats.so,
      pitcherBB: oldPitcher.gameStats.bb,
      pitcherH: oldPitcher.gameStats.h,
      pitcherR: oldPitcher.gameStats.r,
      pitcherER: oldPitcher.gameStats.er,
    };
  } else {
    newState[historyKey].push({ ...oldPitcher });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound` });

  return newState;
}