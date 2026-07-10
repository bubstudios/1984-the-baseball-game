// cpuManager.js - CPU pitcher selection, swing selection, and substitution logic.
// Extracted from gameEngine.js to reduce file size.

import { deepCopyState } from './deepCopyState';
import { TEAMS, DEFAULT_PITCHES } from './gameData';
import { initializePitcherComposure } from './pitcherComposure';
import { getEffectivePitcher, getPitcherFatigue } from './pitcherFatigue';
import { pinchHit } from './substitutions';
import { shouldPinchHit, choose_pinch_hitter } from './pinchHittingDecision';
import { should_double_switch, find_double_switch_partner, execute_double_switch } from './doubleSwitch';
import { calculateSituationalRatings } from './situationalRatings';
import {
  getCurrentBatter, getCurrentPitcher, getBattingTeam, getControllingTeam,
} from './gameEngine';

// Session 8: Shared CPU reliever selection policy.
// Session 21 Part 2: respects reliever rest (fatiguePenalty) and avoids closers in blowouts.
export function selectCpuReliever(bullpen, context) {
  if (!bullpen || bullpen.length === 0) return null;

  const isCloser = (p) => p.pos === 'CL' || p.assignedPos === 'CL';
  const inning = context.inning || 1;
  const cpuScore = context.cpuScore ?? 0;
  const oppScore = context.oppScore ?? 0;
  const margin = cpuScore - oppScore;
  const absMargin = Math.abs(margin);
  const tierSum = (p) => (p.pitchSpeed || 0) + (p.offSpeed || 0) + (p.control || 0);
  // Session 23: deprioritize tired arms — both in-game fatigue AND season workload fatigue.
  // This spreads CPU usage instead of burning the same long man every game.
  const effectiveTier = (p) => tierSum(p) - (p._fatiguePenalty || 0) - (p._seasonFatiguePenalty || 0);

  const closers = bullpen.filter(isCloser);
  const nonClosers = bullpen.filter(p => !isCloser(p));

  if (nonClosers.length === 0) return closers[0] || bullpen[0];

  if (closers.length > 0) {
    const isSaveSituation = margin >= 1 && margin <= 3;
    const shouldUseCloser = (inning >= 8 && isSaveSituation) || (inning >= 9 && margin === 0);
    if (shouldUseCloser) {
      return [...closers].sort((a, b) => effectiveTier(b) - effectiveTier(a))[0];
    }
  }

  const ranked = [...nonClosers].sort((a, b) => effectiveTier(b) - effectiveTier(a));
  const midPoint = Math.ceil(ranked.length / 2);
  const setupArms = ranked.slice(0, midPoint);
  const mopUpArms = ranked.slice(midPoint);

  // Session 21 Part 2: use long/mop-up arms in blowouts (absMargin >= 5)
  if (absMargin >= 5) {
    return mopUpArms.length > 0 ? mopUpArms[0] : ranked[ranked.length - 1];
  }

  if (inning <= 5) {
    return [...nonClosers].sort((a, b) => (b.stamina || 0) - (a.stamina || 0))[0];
  }

  if (absMargin >= 4) {
    return mopUpArms.length > 0 ? mopUpArms[0] : ranked[ranked.length - 1];
  }

  if (context.dueUpBatterBats && inning >= 8 && setupArms.length > 0) {
    const batterBats = context.dueUpBatterBats;
    const matching = setupArms.filter(p => {
      const pThrows = p.throws || 'R';
      return (batterBats === 'L' && pThrows === 'R') || (batterBats === 'R' && pThrows === 'L');
    });
    if (matching.length > 0) return matching[0];
  }
  return setupArms[0] || ranked[0];
}

export function pickCpuReliever(bullpen, inning, context = {}) {
  return selectCpuReliever(bullpen, { inning, ...context });
}

export function cpuSelectPitch(state) {
  const p = getCurrentPitcher(state);
  const pitches = Array.isArray(p.pitches) ? p.pitches : DEFAULT_PITCHES;
  const rand = Math.random();
  if (p.pitchSpeed >= 7 && rand < 0.35 && Array.isArray(pitches) && pitches.includes("Fastball")) return "Fastball";
  const bps = Array.isArray(pitches) ? pitches.filter(x => ["Breaking Ball","Knuckleball","Screwball","Split-Finger"].includes(x)) : [];
  if (p.offSpeed >= 7 && rand < 0.50 && bps.length > 0) return bps[Math.floor(Math.random() * bps.length)];
  if (p.offSpeed >= 6 && rand < 0.55 && Array.isArray(pitches) && pitches.includes("Changeup")) return "Changeup";
  return Array.isArray(pitches) ? (pitches[Math.floor(Math.random() * pitches.length)] || "Fastball") : "Fastball";
}

export function cpuSelectSwing(state) {
  const b = getCurrentBatter(state);
  const adj = getSituationalBatterInline(state);
  const rand = Math.random();
  if (state.strikes === 2) return rand < 0.75 ? 1 : 0;
  if (state.balls === 3) return rand < 0.45 ? 3 : 1;
  if (state.balls >= 2 && state.strikes === 0) { if (rand < 0.35) return 3; }
  if (adj.power >= 8 && rand < 0.30) return 2;
  if (adj.contact >= 8 && rand < 0.45) return 1;
  if (rand < 0.45) return 0; if (rand < 0.70) return 1; return 0;
}

// Inline copy of getSituationalBatter logic (avoids circular import with gameEngine)
function getSituationalBatterInline(state) {
  const b = getCurrentBatter(state);
  const effP = getEffectivePitcher(state) || getCurrentPitcher(state);
  const isHome = getBattingTeam(state) === 'home';
  const isDay = state.weather?.isDay ?? true;
  const sit = calculateSituationalRatings(b, effP, { isHome, isNight: !isDay });
  const balls = state.balls || 0, strikes = state.strikes || 0;
  let finalContact = sit.contact, finalPower = sit.power, countModReason = null;
  if (balls === 3 && strikes === 0) {
    finalPower += 2; finalContact += 1;
    countModReason = 'Green light - sitting dead red';
  } else if (balls === 2 && strikes === 0) {
    finalPower += 1;
    countModReason = 'Ahead in the count - looking to drive';
  } else if (balls === 3 && strikes === 1) {
    finalPower += 1; finalContact += 1;
    countModReason = 'Ahead 3-1 - taking a rip';
  } else if (balls === 0 && strikes === 2) {
    finalPower -= 2; finalContact -= 1;
    countModReason = 'Down 0-2 - choking up, protecting the plate';
  } else if (balls === 1 && strikes === 2) {
    finalPower -= 1;
    countModReason = 'Behind 1-2 - shortening up';
  }
  return {
    ...b,
    contact: Math.max(1, Math.min(10, finalContact)),
    power: Math.max(1, Math.min(10, finalPower)),
    baseContact: sit.contact,
    basePower: sit.power,
    countModReason,
    contactMult: sit.contactMult,
    powerMult: sit.powerMult,
  };
}

export function cpuDecideSubstitutions(state, userTeam = 'home') {
  const newState = deepCopyState(state);
  if (newState.gameOver) return newState;

  const enforceLineupNine = (lineup) => {
    if (lineup.length > 9) {
      console.warn(`Lineup has ${lineup.length} batters - trimming to 9`);
      return lineup.slice(0, 9);
    }
    return lineup;
  };
  newState.homeLineup = enforceLineupNine(newState.homeLineup);
  newState.awayLineup = enforceLineupNine(newState.awayLineup);

  const ballpark = TEAMS[newState.homeTeam]?.stadium;
  const has_dh = newState.useDH;

  if (newState._pendingEjectionReplacement) {
    const ejectedSide = newState._beanball?.autoEjectionSide;
    // In headless mode (CPU vs CPU sim) or for CPU-side ejections in user games,
    // auto-install a replacement here. For the USER's own pitcher in a user game,
    // leave the flag intact so the UI ejection modal opens and the user picks the
    // replacement - an ejected pitcher can never be allowed to continue pitching.
    const ejectedIsUserTeam = !newState._headlessMode && (
      (ejectedSide === 'home' && newState.homeTeam === userTeam) ||
      (ejectedSide === 'away' && newState.awayTeam === userTeam)
    );
    if (ejectedIsUserTeam) {
      return newState;
    }

    const oldP = newState[ejectedSide === 'home' ? 'homePitcher' : 'awayPitcher'];
    const hk = ejectedSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    const bp = ejectedSide === 'home' ? newState.homeBullpen : newState.awayBullpen;

    // 1. Ejected pitcher is OUT: track as removed (illegal re-entry guard) and
    //    freeze his pitching line into history up to the ejection point.
    if (!newState.removedPlayers) newState.removedPlayers = [];
    if (!newState.removedPlayers.includes(oldP.name)) newState.removedPlayers.push(oldP.name);
    if (!newState[hk].find(p => p.name === oldP.name)) {
      newState[hk].push({ ...oldP, ejected: true });
    }

    // 2. Select a replacement - rested bullpen arm first, emergency fallback otherwise
    const availableBullpen = bp.filter(p => !newState.removedPlayers.includes(p.name));
    let newPitcher = null;
    if (availableBullpen.length > 0) {
      newPitcher = pickCpuReliever(availableBullpen, newState.inning, {
        cpuScore: newState.score[ejectedSide],
        oppScore: newState.score[ejectedSide === 'home' ? 'away' : 'home'],
      });
    }
    if (!newPitcher) {
      // Emergency: any roster pitcher not already in the game or removed
      const teamKey = ejectedSide === 'home' ? newState.homeTeam : newState.awayTeam;
      const rosterPitchers = TEAMS[teamKey]?.bullpen || [];
      const inGame = new Set();
      (ejectedSide === 'home' ? newState.homeLineup : newState.awayLineup).forEach(p => inGame.add(p.name));
      (newState[hk] || []).forEach(p => inGame.add(p.name));
      newState.removedPlayers.forEach(n => inGame.add(n));
      newPitcher = rosterPitchers.find(p => !inGame.has(p.name)) || null;
    }

    if (newPitcher) {
      const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: initializePitcherComposure(newPitcher, newPitcher.temperament || 'PROFESSIONAL') };
      if (ejectedSide === 'home') newState.homePitcher = newP; else newState.awayPitcher = newP;
      const bpi = bp.findIndex(p => p.name === newPitcher.name);
      if (bpi >= 0) bp.splice(bpi, 1);
      // DH-less: swap the ejected pitcher's batting slot to the new arm
      const fl = ejectedSide === 'home' ? newState.homeLineup : newState.awayLineup;
      if (!newState.useDH) {
        let si = fl.findIndex(p => p.name === oldP.name);
        if (si < 0 && oldP.order) si = fl.findIndex(p => p.order === oldP.order);
        if (si < 0) si = fl.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
        if (si < 0) si = fl.findIndex(p => p._replacedPitcher);
        if (si >= 0) {
          fl[si] = { ...newPitcher, order: fl[si].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
        }
      }
      newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ejected ${oldP.name} on the mound` });
    } else {
      // Absolute last resort: no legal pitcher exists. End the game rather than
      // let an ejected pitcher continue - the hard rule cannot be violated.
      console.error(`[ejection] No replacement pitcher available for ejected ${oldP.name} - forcing game end`);
      newState.gameOver = true;
      newState.log.push({ type: 'info', text: `⚠️ ${oldP.name} ejected with no replacement available - game cannot continue` });
    }

    delete newState._pendingEjectionReplacement;
    delete newState._beanball.autoEjectionPitcher;
    delete newState._beanball.autoEjectionSide;
    return newState;
  }

  const cpuSide = newState.homeTeam === userTeam ? 'away' : 'home';
  const cpuBattingSide = newState.halfInning === 'top' ? 'away' : 'home';
  const cpuPitchingSide = newState.halfInning === 'top' ? 'home' : 'away';
  if (cpuPitchingSide !== cpuSide) return newState;

  const inning = newState.inning;
  const cpuScore = newState.score[cpuPitchingSide];
  const userScore = newState.score[cpuBattingSide];
  const cpuBullpen = cpuSide === 'away' ? newState.awayBullpen : newState.homeBullpen;
  const cpuLineupField = cpuSide === 'away' ? newState.awayLineup : newState.homeLineup;
  const cpuPitcherField = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const hasDH = !!newState.useDH;
  const pitcherInLineup = cpuLineupField.some(p => p.name === cpuPitcherField.name);
  if (!hasDH && !pitcherInLineup) {
    const oldP = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
    const hk2 = cpuPitchingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    const isInHistory = (newState[hk2] || []).some(p => p.name === oldP.name);
    if (!isInHistory) {
      let si2 = cpuLineupField.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p._replacedPitcher);
      if (si2 >= 0) {
        cpuLineupField[si2] = { ...oldP, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
      } else {
        const lastIdx = cpuLineupField.length - 1;
        if (lastIdx >= 0) {
          cpuLineupField[lastIdx] = { ...oldP, order: cpuLineupField[lastIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
        }
      }
      return newState;
    }
    if (cpuBullpen.length > 0) {
      // Session 22 #3: filter out removed players
      const removedPlayers = newState.removedPlayers || [];
      const availableBullpen = cpuBullpen.filter(p => !removedPlayers.includes(p.name));
      const effectiveBullpen = availableBullpen.length > 0 ? availableBullpen : cpuBullpen;
      const newPitcher = pickCpuReliever(effectiveBullpen, inning, { cpuScore, oppScore: userScore });
      if (!newPitcher) return newState;
      const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: initializePitcherComposure(newPitcher, newPitcher.temperament || 'PROFESSIONAL') };
      if (cpuPitchingSide === 'home') newState.homePitcher = newP; else newState.awayPitcher = newP;
      const bpi2 = cpuBullpen.findIndex(p => p.name === newPitcher.name); if (bpi2 >= 0) cpuBullpen.splice(bpi2, 1);
      if (!newState[hk2].find(p => p.name === oldP.name)) newState[hk2].push({ ...oldP });
      let si2 = cpuLineupField.findIndex(p => p.order === oldP.order);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p.name === oldP.name);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p._replacedPitcher);
      if (si2 >= 0) {
        const le2 = { ...newPitcher, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
        cpuLineupField[si2] = le2;
      } else {
        const lastIdx = cpuLineupField.length - 1;
        if (lastIdx >= 0) {
          cpuLineupField[lastIdx] = { ...newPitcher, order: cpuLineupField[lastIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
        }
      }
      newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldP.name} on the mound (pinch-hit for earlier)` });
    }
    return newState;
  }

  const cpuPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const ip = cpuPitcher.gameStats.ip || 0, bbi = cpuPitcher.gameStats.bb || 0, runs = cpuPitcher.gameStats.r || 0;
  const stamina = cpuPitcher.stamina || 5;
  const isReliever = ['RP','CL'].includes(cpuPitcher.pos) || ['RP','CL'].includes(cpuPitcher.assignedPos);
  const maxInnings = isReliever ? stamina * 0.4 : Math.max(4.2, stamina * 0.7);
  const hasLead = cpuScore > userScore;
  const margin = Math.abs(cpuScore - userScore);

  const composure = cpuPitcher._composure?.composure ?? 100;

  // Physical fatigue (same state the UI "TIRING" badge displays).
  // Separate from composure (emotional state) — a starter can be physically
  // gassed while emotionally fine, and the hook must read this signal.
  const physFatigue = getPitcherFatigue(ip, cpuPitcher);
  const fatigueLevel = physFatigue.fatigueLevel; // 0=FRESH, 1-2=TIRING, 3-4=EXHAUSTED

  if (cpuPitcher._lastHookInning !== inning) {
    cpuPitcher._lastHookInning = inning;
    cpuPitcher._runsAtInningStart = cpuPitcher.gameStats.r || 0;
  }
  const runsThisInning = (cpuPitcher.gameStats.r || 0) - (cpuPitcher._runsAtInningStart || 0);

  const fatigueHook = composure < 35;
  const forcedHook = composure < 20;

  const inningBlowup = runsThisInning >= 3;
  const totalBlowup = (isReliever && runs >= 4) || (!isReliever && runs >= 6);
  const oppInScoring = !!newState.bases[2] && (!!newState.bases[0] || !!newState.bases[1]);
  const jamHook = !hasLead && oppInScoring && composure < 45;

  const walksPull = bbi >= 5;

  const lateClose = inning >= 8 && (hasLead || margin === 0) && margin <= 3 && (composure < 50 || inning >= 9) && ip >= 2;

  // Fatigue-responsive hook: reads the same physical fatigue state the UI displays.
  // EXHAUSTED (level 3+): pull regardless of inning/score — arm is gone.
  // TIRING (level 1+) in 7th+ of a close game: pull (the Hurst case).
  const closeGame = margin <= 3;
  const fatigueExhausted = fatigueLevel >= 3;
  const fatigueTiringLate = fatigueLevel >= 1 && inning >= 7 && closeGame;

  const relieverFatigue = isReliever && ip >= maxInnings + 0.5;

  const starterCruising = !isReliever && hasLead && composure >= 35 && !inningBlowup && !totalBlowup && !walksPull;
  if (starterCruising && !forcedHook && !lateClose && !jamHook && !fatigueExhausted && !fatigueTiringLate) return newState;

  // Session 22 #7: 1984 starter hook - don't pull a starter before inning 5
  // unless genuinely gassed (fatigueLevel 3+) or game is out of hand (6+ runs + composure collapse)
  if (!isReliever && inning < 5 && !forcedHook && !fatigueExhausted && !(totalBlowup && composure < 30)) return newState;
  if (!isReliever && inning < 6 && !forcedHook && !fatigueExhausted && !totalBlowup && !walksPull) return newState;

  const shouldChange = (forcedHook || fatigueHook || relieverFatigue || inningBlowup || totalBlowup || jamHook || walksPull || lateClose || fatigueExhausted || fatigueTiringLate) && cpuBullpen.length > 0;
  if (shouldChange) {
    const battingSide = newState.halfInning === 'top' ? 'away' : 'home';
    const battingLineup = battingSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const batterIdx = battingSide === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex;
    const dueUpBatter = battingLineup[batterIdx % battingLineup.length];
    // Session 22 #3: filter out removed players (illegal re-entry guard)
    const removedPlayers = newState.removedPlayers || [];
    const availableBullpen = cpuBullpen.filter(p => !removedPlayers.includes(p.name));
    const effectiveBullpen = availableBullpen.length > 0 ? availableBullpen : cpuBullpen;
    const newPitcher = selectCpuReliever(effectiveBullpen, {
      inning,
      cpuScore,
      oppScore: userScore,
      dueUpBatterBats: dueUpBatter?.bats,
    });
    if (!newPitcher) return newState;
    const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: initializePitcherComposure(newPitcher, newPitcher.temperament || 'PROFESSIONAL') };
    const oldPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
    if (cpuPitchingSide === 'home') newState.homePitcher = newP; else newState.awayPitcher = newP;
    const bpi = cpuBullpen.findIndex(p => p.name === newPitcher.name); if (bpi >= 0) cpuBullpen.splice(bpi, 1);
    const hk = cpuPitchingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    if (!newState[hk].find(p => p.name === oldPitcher.name)) newState[hk].push({ ...oldPitcher });
    const fl = cpuPitchingSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const cpuDH = !!newState.useDH;
    if (!cpuDH) {
      let si = fl.findIndex(p => p.name === oldPitcher.name);
      if (si < 0 && oldPitcher.order) si = fl.findIndex(p => p.order === oldPitcher.order);
      if (si < 0) si = fl.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si < 0) si = fl.findIndex(p => p._replacedPitcher);
      if (si >= 0) {
        const en = { ...newPitcher, order: fl[si].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
        fl[si] = en;
      }
    }
    const reason = forcedHook ? 'completely gassed' : fatigueExhausted ? 'arm is exhausted' : fatigueTiringLate ? 'tiring in a close one' : fatigueHook ? 'composure fading' : relieverFatigue ? 'arm is tiring' : inningBlowup ? 'rough inning' : totalBlowup ? 'rough outing' : jamHook ? 'inherited jam' : walksPull ? 'lost command' : 'high-leverage situation';
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound (${reason})` });

    const dsLineup = cpuPitchingSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const dsFullBench = TEAMS[cpuPitchingSide === 'home' ? newState.homeTeam : newState.awayTeam]?.bench || [];
    const dsUsedNames = new Set();
    [...(cpuPitchingSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || [])),
     ...(cpuPitchingSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || [])),
     ...dsLineup
    ].forEach(p => dsUsedNames.add(p.name));
    const dsBench = dsFullBench.filter(p => !dsUsedNames.has(p.name));
    if (!hasDH && should_double_switch({
      park_has_dh: hasDH,
      making_pitcher_change: true,
      pitcher_lineup_slot: oldPitcher.order || 0,
      current_batter_lineup_slot: cpuPitchingSide === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex,
      lineup: dsLineup,
      position_players_on_field: dsLineup.filter(p => !['SP', 'RP', 'CL'].includes(p.assignedPos)),
      available_bench: dsBench,
    })) {
      const partner = find_double_switch_partner({
        position_players_on_field: dsLineup.filter(p => !['SP', 'RP', 'CL'].includes(p.assignedPos)),
        pitcher_lineup_slot: oldPitcher.order || 0,
        available_bench: dsBench,
        current_batter_lineup_slot: cpuPitchingSide === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex,
        lineup: dsLineup,
      });

      if (partner) {
        execute_double_switch(newState, newPitcher, partner.fielder, partner.bench_replacement, cpuPitchingSide);
      }
    }
  }
  return newState;
}

export function cpuCheckPinchHit(state) {
  if (!state || state.gameOver) return null;
  if (state.balls !== 0 || state.strikes !== 0) return null;

  const isCpuBatting = getControllingTeam(state, 'batting') === 'cpu';
  if (!isCpuBatting) return null;

  const bjb = getCurrentBatter(state);
  const isPitcherBatting = bjb.is_pitcher || bjb.pos === 'SP' || bjb.pos === 'RP' || bjb.pos === 'CL' || (bjb.assignedPos && ['SP', 'RP', 'CL'].includes(bjb.assignedPos));
  if (!isPitcherBatting) return null;

  const battingTeamSide = getBattingTeam(state) === 'home' ? 'home' : 'away';
  const benchTeam = battingTeamSide === 'home' ? state.homeTeam : state.awayTeam;
  const fullBench = TEAMS[benchTeam]?.bench || [];
  const benchUsedList = battingTeamSide === 'home' ? (state.homeBenchUsed || []) : (state.awayBenchUsed || []);
  const benchHistoryList = battingTeamSide === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  const battingLineup = battingTeamSide === 'home' ? state.homeLineup : state.awayLineup;
  const usedBenchNames = new Set();
  [...benchUsedList, ...benchHistoryList, ...battingLineup].forEach(p => usedBenchNames.add(p.name));
  const benchList = fullBench.filter(p => !usedBenchNames.has(p.name));
  const bullpen = battingTeamSide === 'home' ? state.homeBullpen : state.awayBullpen;
  const cpuPitcherObj = battingTeamSide === 'home' ? state.homePitcher : state.awayPitcher;

  const battingScore = state.score[getBattingTeam(state)];
  const fieldingScore = state.score[getBattingTeam(state) === 'home' ? 'away' : 'home'];

  const phGate = shouldPinchHit({
    runners_in_scoring_position: !!state.bases[2] && (!!state.bases[0] || !!state.bases[1]),
    runners_on: !!state.bases[0] || !!state.bases[1] || !!state.bases[2],
    outs: state.outs,
    inning: state.inning,
    score_margin: battingScore === fieldingScore ? 0 : battingScore - fieldingScore,
    available_bench: benchList,
    current_pitcher_ip: cpuPitcherObj.gameStats.ip || 0,
    bullpen: bullpen,
    used_this_inning: [],
    is_starter: cpuPitcherObj.pos === 'SP',
    pitcher_runs_allowed: cpuPitcherObj.gameStats.r || 0,
    pitcher_walks_allowed: cpuPitcherObj.gameStats.bb || 0,
  });

  if (!phGate) return null;

  const phitter = choose_pinch_hitter({
    available_bench: benchList,
    runners_in_scoring_position: !!state.bases[2] && (!!state.bases[0] || !!state.bases[1]),
    need_baserunner: battingScore < fieldingScore,
  });

  if (!phitter) return null;

  const newState = deepCopyState(state);
  const afterPH = pinchHit(newState, phitter);

  if (battingTeamSide === 'home') {
    newState.homeLineup = afterPH.homeLineup;
    newState.homeBatterIndex = afterPH.homeBatterIndex;
    if (!newState.homePlayerHistory) newState.homePlayerHistory = [];
    afterPH.homePlayerHistory?.forEach(p => { if (!newState.homePlayerHistory.find(h => h.name === p.name)) newState.homePlayerHistory.push(p); });
    if (!newState.homeBenchUsed) newState.homeBenchUsed = [];
    afterPH.homeBenchUsed?.forEach(p => { if (!newState.homeBenchUsed.find(h => h.name === p.name)) newState.homeBenchUsed.push(p); });
  } else {
    newState.awayLineup = afterPH.awayLineup;
    newState.awayBatterIndex = afterPH.awayBatterIndex;
    if (!newState.awayPlayerHistory) newState.awayPlayerHistory = [];
    afterPH.awayPlayerHistory?.forEach(p => { if (!newState.awayPlayerHistory.find(h => h.name === p.name)) newState.awayPlayerHistory.push(p); });
    if (!newState.awayBenchUsed) newState.awayBenchUsed = [];
    afterPH.awayBenchUsed?.forEach(p => { if (!newState.awayBenchUsed.find(h => h.name === p.name)) newState.awayBenchUsed.push(p); });
  }

  newState.log = afterPH.log;
  newState._pitcher_due_for_replacement = true;
  // Log is already pushed by pinchHit() - no duplicate needed here.

  return newState;
}