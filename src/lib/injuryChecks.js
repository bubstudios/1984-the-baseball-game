// injuryChecks.js - Extracted from Home.jsx to reduce file size.
// In-game injury check functions for runners, sliding, and fielders.

import { TEAMS } from './gameData';
import { rollRunnerInjury } from './runnerInjuries';
import { rollSlidingInjury, getSlideChance } from './slidingInjuries';
import { rollFielderInjury } from './fielderInjuries';

export function checkRunnerInjury(prevState, newState, isExhibition) {
  // Skip if half-inning changed (inning ended, bases cleared)
  if (prevState.halfInning !== newState.halfInning) return newState;
  // Skip walks (no running involved)
  if (newState.lastPlay?.type === 'walk') return newState;

  const battingSide = prevState.halfInning === 'top' ? 'away' : 'home';
  const pendingBatterName = newState._pendingBatterInjury?.batterName;

  const movedRunners = [];

  // Check existing runners who advanced or scored/were put out
  for (let i = 0; i < 3; i++) {
    const prevRunner = prevState.bases[i];
    if (!prevRunner || prevRunner.name === pendingBatterName) continue;
    let found = false;
    for (let j = 0; j < 3; j++) {
      if (newState.bases[j]?.name === prevRunner.name) {
        if (j !== i) movedRunners.push({ name: prevRunner.name, baseIndex: j });
        found = true;
        break;
      }
    }
    if (!found) movedRunners.push({ name: prevRunner.name, baseIndex: -1 });
  }

  // Check batter who ran on a ball in play
  const BALL_IN_PLAY_TYPES = ['single', 'double', 'triple', 'homerun', 'groundout', 'flyout', 'lineout', 'popout', 'error', 'fc', 'doubleplay', 'sacfly'];
  const prevLineup = battingSide === 'home' ? prevState.homeLineup : prevState.awayLineup;
  const prevBatterIdx = battingSide === 'home' ? prevState.homeBatterIndex : prevState.awayBatterIndex;
  const batter = prevLineup[prevBatterIdx % prevLineup.length];
  if (batter && batter.name !== pendingBatterName && BALL_IN_PLAY_TYPES.includes(newState.lastPlay?.type)) {
    if (!movedRunners.find(r => r.name === batter.name)) {
      const baseIdx = newState.bases.findIndex(b => b?.name === batter.name);
      movedRunners.push({ name: batter.name, baseIndex: baseIdx >= 0 ? baseIdx : -1 });
    }
  }

  // Roll 2% for each moved runner - first injury only
  for (const runner of movedRunners) {
    const injury = rollRunnerInjury(isExhibition);
    if (injury) {
      const teamKey = battingSide === 'home' ? newState.homeTeam : newState.awayTeam;
      const fullBench = TEAMS[teamKey]?.bench || [];
      const benchUsed = battingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
      const playerHistory = battingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || []);
      const currentLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
      const usedNames = new Set();
      [...benchUsed, ...playerHistory, ...currentLineup].forEach(p => usedNames.add(p.name));
      const availableBench = fullBench.filter(p => !usedNames.has(p.name) && !(newState.scratchedPlayers || []).includes(p.name));

      newState._pendingRunnerInjury = {
        ...injury,
        side: battingSide,
        runnerName: runner.name,
        batterName: runner.name,
        baseIndex: runner.baseIndex,
        bench: availableBench,
      };

      newState.log.push({ type: 'injury', text: `🚑 ${runner.name} is done - ${injury.name}!` });
      break;
    }
  }

  return newState;
}

export function checkSlidingInjury(prevState, newState, isExhibition) {
  // Skip if half-inning changed (inning ended, bases cleared)
  if (prevState.halfInning !== newState.halfInning) return newState;
  // Skip walks (no sliding)
  if (newState.lastPlay?.type === 'walk') return newState;

  const battingSide = prevState.halfInning === 'top' ? 'away' : 'home';
  const pendingInjuryName = newState._pendingBatterInjury?.batterName ||
    newState._pendingRunnerInjury?.runnerName;

  // Determine if contact was made during this play (collision, takeout slide)
  const hasContact = newState.lastPlay?.collision === true ||
    /takeout|broken up|bowls over/i.test(newState.lastPlay?.text || '');

  const movedRunners = [];

  // Check existing runners who advanced or scored/were put out
  for (let i = 0; i < 3; i++) {
    const prevRunner = prevState.bases[i];
    if (!prevRunner || prevRunner.name === pendingInjuryName) continue;
    let destBase = -1;
    for (let j = 0; j < 3; j++) {
      if (newState.bases[j]?.name === prevRunner.name) {
        destBase = j;
        break;
      }
    }
    if (destBase !== i) movedRunners.push({ name: prevRunner.name, destBase });
  }

  // Check batter who ran on a ball in play
  const BALL_IN_PLAY_TYPES = ['single', 'double', 'triple', 'homerun', 'groundout', 'flyout', 'lineout', 'popout', 'error', 'fc', 'doubleplay', 'sacfly'];
  const prevLineup = battingSide === 'home' ? prevState.homeLineup : prevState.awayLineup;
  const prevBatterIdx = battingSide === 'home' ? prevState.homeBatterIndex : prevState.awayBatterIndex;
  const batter = prevLineup[prevBatterIdx % prevLineup.length];
  if (batter && batter.name !== pendingInjuryName && BALL_IN_PLAY_TYPES.includes(newState.lastPlay?.type)) {
    if (!movedRunners.find(r => r.name === batter.name)) {
      const baseIdx = newState.bases.findIndex(b => b?.name === batter.name);
      movedRunners.push({ name: batter.name, destBase: baseIdx >= 0 ? baseIdx : -1 });
    }
  }

  // For each moved runner, determine if they slid → roll sliding injury
  for (const runner of movedRunners) {
    const slideChance = getSlideChance(runner.destBase);
    const didSlide = Math.random() < slideChance;
    if (!didSlide) continue;

    // Runner slid - roll sliding injury (7% base, 14% with contact)
    const injury = rollSlidingInjury(hasContact, isExhibition);
    if (injury) {
      const teamKey = battingSide === 'home' ? newState.homeTeam : newState.awayTeam;
      const fullBench = TEAMS[teamKey]?.bench || [];
      const benchUsed = battingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
      const playerHistory = battingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || []);
      const currentLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
      const usedNames = new Set();
      [...benchUsed, ...playerHistory, ...currentLineup].forEach(p => usedNames.add(p.name));
      const availableBench = fullBench.filter(p => !usedNames.has(p.name) && !(newState.scratchedPlayers || []).includes(p.name));

      newState._pendingSlidingInjury = {
        ...injury,
        side: battingSide,
        runnerName: runner.name,
        batterName: runner.name,
        baseIndex: runner.destBase,
        bench: availableBench,
        contact: hasContact,
      };

      newState.log.push({ type: 'injury', text: `🚑 ${runner.name} is done - ${injury.name} on the slide!` });
      break;
    }
  }

  return newState;
}

export function checkFielderInjury(prevState, newState, isExhibition) {
  const lastPlay = newState.lastPlay;
  if (!lastPlay) return newState;

  // Determine trigger type and fielder name from lastPlay flags
  let fielderName = null;
  let triggerType = null;

  if (lastPlay.collision && lastPlay.collisionFielder) {
    fielderName = lastPlay.collisionFielder;
    triggerType = 'collision';
  } else if (lastPlay.divingCatch && lastPlay.divingCatchFielder) {
    fielderName = lastPlay.divingCatchFielder;
    triggerType = 'divingCatch';
  } else if (lastPlay.divingStop && lastPlay.divingStopFielder) {
    fielderName = lastPlay.divingStopFielder;
    triggerType = 'divingStop';
  }

  if (!fielderName || !triggerType) return newState;

  // Skip if another injury is already pending for this player
  const pendingNames = [
    newState._pendingBatterInjury?.batterName,
    newState._pendingRunnerInjury?.runnerName,
    newState._pendingSlidingInjury?.runnerName,
  ].filter(Boolean);
  if (pendingNames.includes(fielderName)) return newState;

  // Find the fielder in either lineup
  let fieldingSide = null;
  let fielder = null;
  if (newState.homeLineup.find(p => p.name === fielderName)) {
    fieldingSide = 'home';
    fielder = newState.homeLineup.find(p => p.name === fielderName);
  } else if (newState.awayLineup.find(p => p.name === fielderName)) {
    fieldingSide = 'away';
    fielder = newState.awayLineup.find(p => p.name === fielderName);
  }
  if (!fielder) return newState;

  // Skip pitcher - has its own injury system
  const fielderPos = fielder.assignedPos || fielder.pos;
  if (['SP', 'RP', 'CL'].includes(fielderPos)) return newState;

  // Roll fielder injury
  const injury = rollFielderInjury(triggerType, isExhibition);
  if (!injury) return newState;

  // Find available bench
  const teamKey = fieldingSide === 'home' ? newState.homeTeam : newState.awayTeam;
  const fullBench = TEAMS[teamKey]?.bench || [];
  const benchUsed = fieldingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
  const playerHistory = fieldingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || []);
  const currentLineup = fieldingSide === 'home' ? newState.homeLineup : newState.awayLineup;
  const usedNames = new Set();
  [...benchUsed, ...playerHistory, ...currentLineup].forEach(p => usedNames.add(p.name));
  const availableBench = fullBench.filter(p => !usedNames.has(p.name) && !(newState.scratchedPlayers || []).includes(p.name));

  newState._pendingFielderInjury = {
    ...injury,
    side: fieldingSide,
    fielderName: fielderName,
    batterName: fielderName,
    pos: fielderPos,
    trigger: triggerType,
    bench: availableBench,
  };

  newState.log.push({ type: 'injury', text: `🚑 ${fielderName} is done - ${injury.name}!` });
  return newState;
}