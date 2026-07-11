// batterInjuryCheck.js - Extracted from Home.jsx to reduce file size.
// Checks for batter injuries after an at-bat (HBP or swing-related).

import { rollHBPIfBatter, rollBatterInjury } from './batterInjuries';
import { TEAMS } from './gameData';

export function checkBatterInjury(prevState, newState, isExhibition) {
  const lastPlay = newState.lastPlay;
  if (!lastPlay) return newState;

  // Determine injury type: HBP vs. swing vs. called pitch (no check)
  const isHBP = lastPlay.isHBP === true;
  const NON_SWING_TYPES = ['ball', 'strike'];
  const isWalk = lastPlay.type === 'walk';
  const isSwing = !isHBP && !isWalk && !NON_SWING_TYPES.includes(lastPlay.type);

  // No injury check on called balls/strikes or non-HBP walks
  if (!isHBP && !isSwing) return newState;

  // Use PRE-play state to find the batter (index may have advanced after the play)
  const battingSide = prevState.halfInning === 'top' ? 'away' : 'home';
  const prevLineup = battingSide === 'home' ? prevState.homeLineup : prevState.awayLineup;
  const prevBatterIdx = battingSide === 'home' ? prevState.homeBatterIndex : prevState.awayBatterIndex;
  const batter = prevLineup[prevBatterIdx % prevLineup.length];
  if (!batter) return newState;

  // Roll the appropriate injury
  let injury;
  if (isHBP) {
    // Track HBP count for this batter - chance doubles on 2nd+ HBP
    if (!newState._hbpCounts) newState._hbpCounts = {};
    newState._hbpCounts[batter.name] = (newState._hbpCounts[batter.name] || 0) + 1;
    injury = rollHBPIfBatter(newState._hbpCounts[batter.name], isExhibition);
  } else {
    injury = rollBatterInjury(isExhibition);
  }

  if (!injury) return newState;

  // Check if batter is still at the plate (at-bat not complete - foul/miss)
  const newBatterIdx = battingSide === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex;
  const stillAtPlate = prevState.halfInning === newState.halfInning && prevBatterIdx === newBatterIdx;

  // Find available bench players
  const teamKey = battingSide === 'home' ? newState.homeTeam : newState.awayTeam;
  const fullBench = TEAMS[teamKey]?.bench || [];
  const benchUsed = battingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
  const playerHistory = battingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || []);
  const currentLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
  const usedNames = new Set();
  [...benchUsed, ...playerHistory, ...currentLineup].forEach(p => usedNames.add(p.name));
  const availableBench = fullBench.filter(p => !usedNames.has(p.name) && !(newState.scratchedPlayers || []).includes(p.name));

  newState._pendingBatterInjury = {
    ...injury,
    side: battingSide,
    batterName: batter.name,
    bench: availableBench,
    stillAtPlate,
  };

  newState.log.push({ type: 'injury', text: `🚑 ${batter.name} is done - ${injury.name}!` });

  return newState;
}