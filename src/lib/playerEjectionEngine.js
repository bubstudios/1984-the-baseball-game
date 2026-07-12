// playerEjectionEngine.js - Connects the existing beanball/incident systems
// to actual game-state player ejections.
//
// The beanball.js engine tracks tension, warnings, and HBP context, but does not
// actually remove ejected players from the game. This engine reads the beanball
// context and applies real ejections to the game state.
//
// Ejection triggers:
// 1. Pitcher hits batter after warnings (60-95% ejection depending on context)
// 2. Batter charges mound (triggered by hard HBP + bad blood)
// 3. Batter argues balls/strikes (rare, after called strike three)
// 4. Catcher argues balls/strikes (rare)
// 5. Fight participant (during bench-clearing)
// 6. Bench-clearing brawl major offender
//
// Each ejection sets state._playerEjections = [{ name, teamKey, reason, inning }]
// which the UI and post-game suspension roller consume.

import { TEAMS } from './gameData';

// ── Ejection reason labels ──
export const EJECTION_REASONS = {
  HBP_AFTER_WARNING: 'hbp_after_warning',
  OBVIOUS_RETALIATION: 'obvious_retaliation',
  ARGUING_STRIKES: 'arguing_strikes',
  ARGUING_CALL: 'arguing_call',
  CHARGING_MOUND: 'charging_mound',
  FIGHT_PARTICIPANT: 'fight_participant',
  BENCH_CLEARING_MAJOR: 'bench_clearing_major',
};

// ── Ejection reason labels ──
export function getPlayerPos(player) {
  if (!player) return '?';
  return player.pos || player.assignedPos || '?';
}

// ── Resolve the batter who just completed their at-bat ──
// After processAtBat, advanceBatter has already run, so getCurrentBatter
// returns the NEXT batter. This function finds the actual batter from the
// lastPlay text (which starts with the batter's name) by matching against
// all players in both lineups and history.
export function getPreviousBatter(state) {
  if (!state.lastPlay || !state.lastPlay.text) return null;
  const text = state.lastPlay.text;
  const allPlayers = [
    ...state.homeLineup.map(p => ({ ...p, teamKey: state.homeTeam })),
    ...state.awayLineup.map(p => ({ ...p, teamKey: state.awayTeam })),
    ...(state.homePlayerHistory || []).map(p => ({ ...p, teamKey: state.homeTeam })),
    ...(state.awayPlayerHistory || []).map(p => ({ ...p, teamKey: state.awayTeam })),
  ];
  // Sort by name length descending so "Paul Mirabella" matches before "Paul"
  const sorted = [...allPlayers].sort((a, b) => b.name.length - a.name.length);
  for (const p of sorted) {
    if (text.startsWith(p.name + ' ')) return p;
  }
  return null;
}

// ── Find a player object by name from lineup + history ──
// Returns the live player object from the lineup (not a copy), or null.
export function findPlayerInGame(state, name, teamKey) {
  if (!name) return null;
  const isHome = teamKey === state.homeTeam;
  const lineup = isHome ? state.homeLineup : state.awayLineup;
  const history = isHome ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);

  // Check current lineup first (this is the LIVE object we want to mutate)
  const inLineup = lineup.find(p => p.name === name);
  if (inLineup) return inLineup;

  // Check history (already removed from game)
  const inHistory = history.find(p => p.name === name);
  if (inHistory) return inHistory;

  return null;
}

// ── Find an available bench player for substitution ──
function getAvailableBenchPlayer(state, teamKey) {
  const isHome = teamKey === state.homeTeam;
  const fullBench = TEAMS[teamKey]?.bench || [];
  const lineup = isHome ? state.homeLineup : state.awayLineup;
  const benchUsed = isHome ? (state.homeBenchUsed || []) : (state.awayBenchUsed || []);
  const history = isHome ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []);
  const removed = state.removedPlayers || [];
  const scratched = state.scratchedPlayers || [];

  const usedNames = new Set();
  [...lineup, ...benchUsed, ...history, ...removed, ...scratched].forEach(p => {
    if (typeof p === 'string') usedNames.add(p);
    else if (p?.name) usedNames.add(p.name);
  });

  return fullBench.find(p => !usedNames.has(p.name)) || null;
}

export function checkHBPEjection(state, pitcher, batter) {
  const ctx = state._beanball;
  if (!ctx) return null;

  // No warnings issued yet - no automatic ejection
  if (!ctx.warningIssued) {
    // Rare immediate ejection for obvious retaliation / dangerous pitch
    const isRetaliation = ctx.lastHBPTeam && ctx.lastHBPTeam !== (state.halfInning === 'top' ? 'home' : 'away');
    if (isRetaliation && ctx.tension >= 60) {
      if (Math.random() < 0.15) {
        return {
          playerName: pitcher.name,
          playerPos: getPlayerPos(pitcher),
          teamKey: state.halfInning === 'top' ? state.homeTeam : state.awayTeam,
          reason: EJECTION_REASONS.OBVIOUS_RETALIATION,
          inning: state.inning,
          commentary: `${pitcher.name.split(' ').pop()} is tossed! Obvious retaliation after the umpire had enough.`,
        };
      }
    }
    return null;
  }

  // Warnings are active - high ejection chance
  const pitchingSide = state.halfInning === 'top' ? 'home' : 'away';
  const pitchingTeam = pitchingSide === 'home' ? state.homeTeam : state.awayTeam;

  // Was the HBP high/tight? Check tension level as proxy
  const isHighTight = ctx.tension >= 70;
  // Was it obvious retaliation?
  const isRetaliation = ctx.lastHBPTeam && ctx.lastHBPTeam !== pitchingSide && ctx.retaliations >= 1;

  let ejectChance;
  let reason;
  if (isRetaliation && ctx.tension >= 60) {
    ejectChance = 0.95;
    reason = EJECTION_REASONS.OBVIOUS_RETALIATION;
  } else if (isHighTight) {
    ejectChance = 0.85;
    reason = EJECTION_REASONS.HBP_AFTER_WARNING;
  } else {
    ejectChance = 0.60;
    reason = EJECTION_REASONS.HBP_AFTER_WARNING;
  }

  if (Math.random() < ejectChance) {
  return {
    playerName: pitcher.name,
    playerPos: getPlayerPos(pitcher),
    teamKey: pitchingTeam,
    reason,
    inning: state.inning,
    commentary: `${pitcher.name.split(' ').pop()} is ejected for hitting ${batter.name.split(' ').pop()} after warnings!`,
  };
  }

  return null;
}

// ── Check if batter charges the mound after HBP ──
// Called when a batter is hit. Returns an ejection descriptor or null.
// The `batter` parameter MUST be the actual hit batter, not the next batter
// (the caller is responsible for passing the correct player).
export function checkChargingMound(state, pitcher, batter) {
  const ctx = state._beanball;
  if (!ctx) return null;

  const battingSide = state.halfInning === 'top' ? 'away' : 'home';
  const battingTeam = battingSide === 'home' ? state.homeTeam : state.awayTeam;

  // Factors that increase charging chance
  const temper = batter.temper || 5;
  const wasHitBefore = ctx.lastHBPBatter && ctx.lastHBPBatter !== batter.name && ctx.lastHBPTeam === (battingSide === 'home' ? 'away' : 'home');
  const afterHR = ctx.lastHRBatter === batter.name;
  const highTension = ctx.tension >= 50;
  const lopsided = Math.abs(state.score.home - state.score.away) >= 5;

  // Base chance: 2%, modified by factors
  let chargeChance = 0.02;
  chargeChance += (temper / 10) * 0.04; // up to +4%
  if (wasHitBefore) chargeChance += 0.03;
  if (afterHR) chargeChance += 0.02;
  if (highTension) chargeChance += 0.03;
  if (lopsided) chargeChance += 0.01;

  if (Math.random() < chargeChance) {
    // Batter charges - bench may clear
    const benchesClear = ctx.tension >= 60 && Math.random() < 0.40;

    // The HIT BATTER is the default charging player - this is the core fix.
    const ejections = [{
      playerName: batter.name,
      playerPos: getPlayerPos(batter),
      teamKey: battingTeam,
      reason: EJECTION_REASONS.CHARGING_MOUND,
      inning: state.inning,
      commentary: `${batter.name.split(' ').pop()} charges the mound! He's been tossed!`,
    }];

    // Pitcher may also be ejected
    const pitchingTeam = battingSide === 'home' ? state.awayTeam : state.homeTeam;
    if (Math.random() < 0.30) {
      ejections.push({
        playerName: pitcher.name,
        playerPos: getPlayerPos(pitcher),
        teamKey: pitchingTeam,
        reason: EJECTION_REASONS.FIGHT_PARTICIPANT,
        inning: state.inning,
        commentary: `${pitcher.name.split(' ').pop()} is also ejected after the mound charge!`,
      });
    }

    // Additional fight participants
    if (benchesClear && Math.random() < 0.25) {
      // Pick a random player from each team
      const battingLineup = battingSide === 'home' ? state.homeLineup : state.awayLineup;
      const pitchingLineup = battingSide === 'home' ? state.awayLineup : state.homeLineup;
      const extraBat = battingLineup[Math.floor(Math.random() * battingLineup.length)];
      if (extraBat && Math.random() < 0.15) {
        ejections.push({
          playerName: extraBat.name,
          playerPos: getPlayerPos(extraBat),
          teamKey: battingTeam,
          reason: EJECTION_REASONS.FIGHT_PARTICIPANT,
          inning: state.inning,
          commentary: `${extraBat.name.split(' ').pop()} is ejected for joining the fray!`,
        });
      }
    }

    return {
      type: benchesClear ? 'bench_clearing' : 'charging_mound',
      ejections,
      commentary: benchesClear
        ? 'The benches empty! This is a full brawl!'
        : `${batter.name.split(' ').pop()} charges the mound!`,
    };
  }

  return null;
}

// ── Check if batter argues balls/strikes (after called strike three) ──
export function checkBatterArguesStrikes(state, batter) {
  // Only on called strikeout (not swinging)
  if (!state.lastPlay || state.lastPlay.type !== 'strikeout') return null;
  if (!state.lastPlay.text || !state.lastPlay.text.includes('called')) return null;

  const battingSide = state.halfInning === 'top' ? 'away' : 'home';
  const battingTeam = battingSide === 'home' ? state.homeTeam : state.awayTeam;
  const temper = batter.temper || 5;

  // Base: 1.5%, up to +3% for high-temper batters
  const argChance = 0.015 + (temper / 10) * 0.03;

  if (Math.random() < argChance) {
    return {
      playerName: batter.name,
      playerPos: getPlayerPos(batter),
      teamKey: battingTeam,
      reason: EJECTION_REASONS.ARGUING_STRIKES,
      inning: state.inning,
      commentary: `${batter.name.split(' ').pop()} is ejected for arguing strike three!`,
    };
  }

  return null;
}

// ── Apply player ejection to game state ──
// Marks the player as ejected, records it for post-game suspension rolling,
// removes the player from the active lineup/bullpen, and forces a replacement.
export function applyPlayerEjection(state, ejection) {
  if (!state || !ejection) return state;

  if (!state._playerEjections) state._playerEjections = [];
  state._playerEjections.push(ejection);

  // Track ejected player names per team
  const ejectedKey = ejection.teamKey === state.homeTeam ? '_homeEjectedPlayers' : '_awayEjectedPlayers';
  if (!state[ejectedKey]) state[ejectedKey] = [];
  if (!state[ejectedKey].includes(ejection.playerName)) {
    state[ejectedKey].push(ejection.playerName);
  }

  // Global ejected players array
  if (!state.ejectedPlayers) state.ejectedPlayers = [];
  state.ejectedPlayers.push({
    name: ejection.playerName,
    teamKey: ejection.teamKey,
    reason: ejection.reason,
    inning: ejection.inning,
    pos: ejection.playerPos,
  });

  // Add to removedPlayers so they can never re-enter
  if (!state.removedPlayers) state.removedPlayers = [];
  if (!state.removedPlayers.includes(ejection.playerName)) {
    state.removedPlayers.push(ejection.playerName);
  }

  // Mark the player object as ejected in the game state
  const player = findPlayerInGame(state, ejection.playerName, ejection.teamKey);
  if (player) {
    player.ejectedCurrentGame = true;
  }

  // Determine if this is a pitcher or position player
  const isHome = ejection.teamKey === state.homeTeam;
  const pitcherObj = isHome ? state.homePitcher : state.awayPitcher;
  const isCurrentPitcher = pitcherObj && pitcherObj.name === ejection.playerName;

  if (isCurrentPitcher) {
    // Pitcher ejection: set the pending replacement flag so the existing
    // substitution system (cpuDecideSubstitutions or UI prompt) handles it.
    if (!state._beanball) state._beanball = {};
    state._beanball.autoEjectionPitcher = ejection.playerName;
    state._beanball.autoEjectionSide = isHome ? 'home' : 'away';
    state._pendingEjectionReplacement = true;

    // Move ejected pitcher to history with ejected flag
    const historyKey = isHome ? 'homePlayerHistory' : 'awayPlayerHistory';
    if (!state[historyKey]) state[historyKey] = [];
    if (!state[historyKey].find(p => p.name === ejection.playerName)) {
      state[historyKey].push({ ...pitcherObj, ejected: true });
    }
  } else {
    // Position player ejection: replace in lineup AND on bases with a bench player
    const lineup = isHome ? state.homeLineup : state.awayLineup;
    const historyKey = isHome ? 'homePlayerHistory' : 'awayPlayerHistory';
    const benchUsedKey = isHome ? 'homeBenchUsed' : 'awayBenchUsed';

    const slotIdx = lineup.findIndex(p => p.name === ejection.playerName);
    const oldPlayer = slotIdx >= 0 ? lineup[slotIdx] : null;

    // Move ejected player to history
    if (oldPlayer) {
      if (!state[historyKey]) state[historyKey] = [];
      if (!state[historyKey].find(p => p.name === ejection.playerName)) {
        state[historyKey].push({ ...oldPlayer, ejected: true });
      }
    }

    // Find a replacement from the bench
    const replacement = getAvailableBenchPlayer(state, ejection.teamKey);
    if (replacement && oldPlayer) {
      // Replace in lineup
      lineup[slotIdx] = {
        ...replacement,
        order: oldPlayer.order,
        assignedPos: oldPlayer.assignedPos || replacement.pos,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
      };

      // Mark bench player as used
      if (!state[benchUsedKey]) state[benchUsedKey] = [];
      if (!state[benchUsedKey].find(p => p.name === replacement.name)) {
        state[benchUsedKey].push({ ...replacement });
      }

      // Log the substitution
      const subText = `🔄 ${replacement.name} replaces ejected ${oldPlayer.name}`;
      if (!state.log.some(e => e.text === subText)) {
        state.log.push({ type: 'info', text: subText });
      }
    } else if (oldPlayer) {
      state.log.push({ type: 'info', text: `⚠️ No bench available - ${oldPlayer.name}'s spot is an automatic out.` });
    }

    // CRITICAL: Remove ejected player from bases (HBP → charges mound → ejected)
    // The ejected player must NOT remain on base. Replace with the same bench
    // player (who is now in the lineup), or clear the base if no bench available.
    if (state.bases) {
      for (let i = 0; i < state.bases.length; i++) {
        if (state.bases[i] && state.bases[i].name === ejection.playerName) {
          if (replacement && oldPlayer) {
            state.bases[i] = { ...replacement, order: oldPlayer.order, assignedPos: oldPlayer.assignedPos || replacement.pos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
            const runSubText = `🔄 ${replacement.name} runs for ejected ${oldPlayer.name}`;
            if (!state.log.some(e => e.text === runSubText)) {
              state.log.push({ type: 'info', text: runSubText });
            }
          } else {
            state.bases[i] = null;
          }
        }
      }
    }
  }

  // Log the ejection
  state.log.push({ type: 'ejection', text: `🟥 ${ejection.commentary}` });

  return state;
}

// ── Apply multiple ejections (fight/brawl scenario) ──
export function applyMultipleEjections(state, ejections) {
  if (!state || !ejections || ejections.length === 0) return state;
  for (const ej of ejections) {
    applyPlayerEjection(state, ej);
  }
  return state;
}

// ── Check for bench-clearing brawl ──
// Triggered at very high tension after a trigger event.
export function checkBenchClearingBrawl(state) {
  const ctx = state._beanball;
  if (!ctx) return null;
  if (ctx.brawlTriggered) return null;

  // Brawls happen at very high tension
  if (ctx.tension < 75) return null;

  const brawlChance = ((ctx.tension - 75) / 25) * 0.15; // 0% at 75, 15% at 100
  if (Math.random() >= brawlChance) return null;

  ctx.brawlTriggered = true;

  // 2-4 ejections
  const numEjections = 2 + Math.floor(Math.random() * 3);
  const ejections = [];

  // Pick players from both teams
  const allPlayers = [
    ...state.homeLineup.map(p => ({ ...p, teamKey: state.homeTeam })),
    ...state.awayLineup.map(p => ({ ...p, teamKey: state.awayTeam })),
  ];

  // Shuffle and pick
  const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(numEjections, shuffled.length));

  for (const player of selected) {
    ejections.push({
      playerName: player.name,
      playerPos: getPlayerPos(player),
      teamKey: player.teamKey,
      reason: EJECTION_REASONS.BENCH_CLEARING_MAJOR,
      inning: state.inning,
      commentary: `${player.name.split(' ').pop()} is ejected after the bench-clearing brawl!`,
    });
  }

  return {
    type: 'bench_clearing_brawl',
    ejections,
    commentary: 'The benches clear! A full-scale brawl has erupted!',
  };
}

// ── Get all player ejections from the game for post-game processing ──
export function getGameEjections(state) {
  return state._playerEjections || [];
}

// ── Check if a player was ejected this game ──
export function wasPlayerEjected(state, playerName) {
  const ejections = state._playerEjections || [];
  return ejections.some(e => e.playerName === playerName);
}

// ── Force-trigger functions for debug/testing ──
export function forcePitcherHBPEjection(state, pitcherName, teamKey) {
  const pitcher = findPlayer(state, pitcherName, teamKey);
  if (!pitcher) return null;
  return {
    playerName: pitcher.name,
    teamKey,
    reason: EJECTION_REASONS.HBP_AFTER_WARNING,
    inning: state.inning,
    commentary: `${pitcher.name.split(' ').pop()} is ejected for hitting a batter after warnings! (DEBUG)`,
  };
}

export function forceBatterArguesStrikes(state, batterName, teamKey) {
  const batter = findPlayer(state, batterName, teamKey);
  if (!batter) return null;
  return {
    playerName: batter.name,
    teamKey,
    reason: EJECTION_REASONS.ARGUING_STRIKES,
    inning: state.inning,
    commentary: `${batter.name.split(' ').pop()} is ejected for arguing balls and strikes! (DEBUG)`,
  };
}

export function forceChargingMound(state, batterName, teamKey, pitcherName, pitcherTeamKey) {
  const batter = findPlayer(state, batterName, teamKey);
  const pitcher = findPlayer(state, pitcherName, pitcherTeamKey);
  const ejections = [];
  if (batter) {
    ejections.push({
      playerName: batter.name,
      teamKey,
      reason: EJECTION_REASONS.CHARGING_MOUND,
      inning: state.inning,
      commentary: `${batter.name.split(' ').pop()} charges the mound! He's been tossed! (DEBUG)`,
    });
  }
  if (pitcher && Math.random() < 0.50) {
    ejections.push({
      playerName: pitcher.name,
      teamKey: pitcherTeamKey,
      reason: EJECTION_REASONS.FIGHT_PARTICIPANT,
      inning: state.inning,
      commentary: `${pitcher.name.split(' ').pop()} is also ejected after the mound charge! (DEBUG)`,
    });
  }
  return {
    type: 'charging_mound',
    ejections,
    commentary: `${batter ? batter.name.split(' ').pop() : 'Batter'} charges the mound! (DEBUG)`,
  };
}

export function forceBenchClearingBrawl(state) {
  const allPlayers = [
    ...state.homeLineup.map(p => ({ ...p, teamKey: state.homeTeam })),
    ...state.awayLineup.map(p => ({ ...p, teamKey: state.awayTeam })),
  ];
  const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
  const numEjections = 2 + Math.floor(Math.random() * 3);
  const selected = shuffled.slice(0, Math.min(numEjections, shuffled.length));
  const ejections = selected.map(player => ({
    playerName: player.name,
    teamKey: player.teamKey,
    reason: EJECTION_REASONS.BENCH_CLEARING_MAJOR,
    inning: state.inning,
    commentary: `${player.name.split(' ').pop()} is ejected after the bench-clearing brawl! (DEBUG)`,
  }));
  return {
    type: 'bench_clearing_brawl',
    ejections,
    commentary: 'The benches clear! A full-scale brawl has erupted! (DEBUG)',
  };
}

function findPlayer(state, name, teamKey) {
  if (!name) return null;
  if (teamKey === state.homeTeam) {
    return [...state.homeLineup, ...(state.homePlayerHistory || [])].find(p => p.name === name);
  }
  return [...state.awayLineup, ...(state.awayPlayerHistory || [])].find(p => p.name === name);
}