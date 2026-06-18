import { DEFAULT_PITCHES } from './gameData';

// Apply a user-chosen replacement for an injured player
// Called from the UI when the user selects a bench player from the injury modal
export function applyInjuryReplacement(state, chosenPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const pi = newState._pendingInjury;
  if (!pi || !chosenPlayer) return newState;

  const targetLineup = pi.isAway ? newState.awayLineup : newState.homeLineup;
  const injuredPlayer = targetLineup[pi.targetIdx];

  if (pi.isPitcher) {
    const newP = {
      ...chosenPlayer, pitchCount: 0, pitches: chosenPlayer.pitches || DEFAULT_PITCHES,
      gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }
    };
    if (pi.isAway) {
      newState.awayPitcher = newP;
      const bpIdx = newState.awayBullpen.findIndex(p => p.name === chosenPlayer.name);
      if (bpIdx >= 0) newState.awayBullpen.splice(bpIdx, 1);
    } else {
      newState.homePitcher = newP;
      const bpIdx = newState.homeBullpen.findIndex(p => p.name === chosenPlayer.name);
      if (bpIdx >= 0) newState.homeBullpen.splice(bpIdx, 1);
    }
    targetLineup[pi.targetIdx] = { ...chosenPlayer, order: injuredPlayer.order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    newState.log.push({ type: 'info', text: `🚑 ${pi.player} injured — ${chosenPlayer.name} takes the mound` });
  } else if (pi.isCurrentBatter) {
    targetLineup[pi.targetIdx] = { ...chosenPlayer, order: injuredPlayer.order, assignedPos: chosenPlayer.pos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    newState.log.push({ type: 'info', text: `🚑 ${pi.player} injured — ${chosenPlayer.name} pinch-hits` });
  } else {
    targetLineup[pi.targetIdx] = { ...chosenPlayer, order: injuredPlayer.order, assignedPos: pi.oldPos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    newState.log.push({ type: 'info', text: `🚑 ${pi.player} injured — ${chosenPlayer.name} takes over at ${pi.oldPos}` });
  }

  // Replace on the bases if the injured player was a runner
  for (let i = 0; i < 3; i++) {
    if (newState.bases[i] && newState.bases[i].name === pi.player) {
      newState.bases[i] = targetLineup[pi.targetIdx];
      break;
    }
  }

  delete newState._pendingInjury;
  return newState;
}