import { TEAMS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { initializePitcherComposure } from './pitcherComposure';

// Re-export functions that are used internally
export function pinchHit(state, newPlayer) {
  // Idempotency guard: if the player is already in the lineup, this is a duplicate
  // call (double-execution would corrupt lineup/bench state and duplicate the log).
  const isAwayCheck = state.halfInning === 'top';
  const lineupCheck = isAwayCheck ? state.awayLineup : state.homeLineup;
  if (lineupCheck.some(p => p.name === newPlayer.name)) {
    console.warn(`[pinchHit] ${newPlayer.name} is already in the lineup - skipping duplicate sub`);
    return state;
  }
  // Session 22 #3: Illegal re-entry guard - a removed player cannot return
  if (state.removedPlayers && state.removedPlayers.includes(newPlayer.name)) {
    throw new Error(`Illegal re-entry: ${newPlayer.name} was already removed from the game`);
  }
  if (state.scratchedPlayers && state.scratchedPlayers.includes(newPlayer.name)) {
    console.error(`SCRATCHED PLAYER USED: ${newPlayer.name} was scratched pre-game but pinch-hit`);
  }
  const newState = JSON.parse(JSON.stringify(state));
  if (!newState.removedPlayers) newState.removedPlayers = [];
  const isAway = newState.halfInning === 'top';
  const lineup = isAway ? newState.awayLineup : newState.homeLineup;
  const batterIdx = isAway ? newState.awayBatterIndex : newState.homeBatterIndex;
  const idx = batterIdx % lineup.length;
  const oldBatter = lineup[idx];
  // Track removed player so they can never re-enter (pinch-hit, pitch, or field)
  newState.removedPlayers.push(oldBatter.name);

  const isPitcherSlot = ['SP', 'RP', 'CL'].includes(oldBatter.assignedPos) || ['SP', 'RP', 'CL'].includes(oldBatter.pos);
  const benchPlayer = {
    ...newPlayer,
    order: oldBatter.order,
    assignedPos: newPlayer.pos,
    _replacedPitcher: isPitcherSlot,  // Flag: this slot held the pitcher - used for slot lookup when replacing
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

  // Dedup: only log the substitution once (pinchHit may be called via multiple
  // code paths that each add their own log line - suppress identical duplicates)
  const subText = `🔄 ${newPlayer.name} pinch-hits for ${oldBatter.name}`;
  const alreadyLogged = newState.log.some(entry => entry.type === 'info' && entry.text === subText);
  if (!alreadyLogged) {
    newState.log.push({ type: 'info', text: subText });
  }
  return newState;
}

export function pinchRun(state, baseIndex, newPlayer) {
  if (state.scratchedPlayers && state.scratchedPlayers.includes(newPlayer.name)) {
    console.error(`SCRATCHED PLAYER USED: ${newPlayer.name} was scratched pre-game but pinch-ran`);
  }
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
    if (state.scratchedPlayers && state.scratchedPlayers.includes(newPlayer.name)) {
      console.error(`SCRATCHED PLAYER USED: ${newPlayer.name} was scratched pre-game but entered defensively`);
    }
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
  // Session 22 #3: Illegal re-entry guard - a pitcher removed from the game cannot return
  if (state.removedPlayers && state.removedPlayers.includes(newPitcher.name)) {
    throw new Error(`Illegal re-entry: ${newPitcher.name} was already removed from the game`);
  }
  if (state.scratchedPlayers && state.scratchedPlayers.includes(newPitcher.name)) {
    console.error(`SCRATCHED PLAYER USED: ${newPitcher.name} was scratched pre-game but entered as pitcher`);
  }
  const newState = JSON.parse(JSON.stringify(state));
  if (!newState.removedPlayers) newState.removedPlayers = [];
  // Use explicit side if provided, otherwise fall back to half-inning logic
  const isHome = side ? side === 'home' : newState.halfInning === 'top';
  const archetype = newPitcher.temperament || 'PROFESSIONAL';
  const composureState = initializePitcherComposure(newPitcher, archetype);
  const pitcherRole = newPitcher.pos || 'SP';
  const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: composureState, _reachBackUses: 0, _reachBackPitcher: newPitcher.name };

  const oldPitcher = isHome ? newState.homePitcher : newState.awayPitcher;
  // Track the outgoing pitcher as removed - they cannot re-enter the game
  newState.removedPlayers.push(oldPitcher.name);
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
  let capturedBattingStats = null;
  if (!usesDH) {
    let slotIdx = lineup.findIndex(p => p.name === oldPitcher.name);
    if (slotIdx < 0 && oldPitcher.order) slotIdx = lineup.findIndex(p => p.order === oldPitcher.order);
    if (slotIdx < 0) slotIdx = lineup.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
    if (slotIdx >= 0) {
      // Capture batting stats BEFORE overwriting the lineup entry. The lineup
      // entry holds the pitcher's batting line (ab/hits/rbi/etc.), which is a
      // SEPARATE object from the pitcher state's pitching-only gameStats.
      // Without this, a starting pitcher who batted (NL rules) disappears from
      // the box score batting table when the pitching change overwrites their
      // lineup slot and pushes the pitching-only state to history.
      capturedBattingStats = lineup[slotIdx].gameStats ? { ...lineup[slotIdx].gameStats } : null;
      const lineupEntry = { ...newPitcher, order: lineup[slotIdx].order, assignedPos: pitcherRole, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      lineup[slotIdx] = lineupEntry;
      // Persist order + assignedPos on the pitcher state so future lookups can find their slot
      newP.order = lineupEntry.order;
      newP.assignedPos = pitcherRole;
    }
    // Never push a new entry - avoids creating a phantom batting slot
  }

  // Save old pitcher to player history so box score retains their stats
  const historyKey = isHome ? 'homePlayerHistory' : 'awayPlayerHistory';
  const existing = newState[historyKey].find(p => p.name === oldPitcher.name);
  if (existing) {
    existing.gameStats = {
      ...existing.gameStats,
      pitches: oldPitcher.gameStats.pitches,
      ip: oldPitcher.gameStats.ip,
      outs: oldPitcher.gameStats.outs || Math.round((oldPitcher.gameStats.ip || 0) * 3),
      pitcherSo: oldPitcher.gameStats.so,
      pitcherBB: oldPitcher.gameStats.bb,
      pitcherH: oldPitcher.gameStats.h,
      pitcherR: oldPitcher.gameStats.r,
      pitcherER: oldPitcher.gameStats.er,
    };
  } else {
    // Merge batting stats (captured from the lineup entry) with pitching stats
    // (from the pitcher state). Without the batting stats, the history entry has
    // ip but no ab, causing the box score filter to remove the starting pitcher
    // from the batting table even though they had plate appearances.
    newState[historyKey].push({
      ...oldPitcher,
      gameStats: {
        ...(capturedBattingStats || {}),
        ip: oldPitcher.gameStats.ip,
        outs: oldPitcher.gameStats.outs || Math.round((oldPitcher.gameStats.ip || 0) * 3),
        pitches: oldPitcher.gameStats.pitches,
        pitcherSo: oldPitcher.gameStats.so,
        pitcherBB: oldPitcher.gameStats.bb,
        pitcherH: oldPitcher.gameStats.h,
        pitcherR: oldPitcher.gameStats.r,
        pitcherER: oldPitcher.gameStats.er,
      },
    });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound` });

  return newState;
}