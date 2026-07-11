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

// ── Check HBP after warning: should the pitcher be ejected? ──
// Called when a batter is hit by pitch. Returns an ejection descriptor or null.
function getPlayerPos(player) {
  if (!player) return '?';
  return player.pos || player.assignedPos || '?';
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
// Marks the player as ejected and records it for post-game suspension rolling.
// The actual lineup/bullpen replacement is handled by the existing substitution system.
export function applyPlayerEjection(state, ejection) {
  if (!state || !ejection) return state;

  if (!state._playerEjections) state._playerEjections = [];
  state._playerEjections.push(ejection);

  // Mark the player as ejected in game state so substitution systems know
  const ejectedKey = ejection.teamKey === state.homeTeam ? '_homeEjectedPlayers' : '_awayEjectedPlayers';
  if (!state[ejectedKey]) state[ejectedKey] = [];
  state[ejectedKey].push(ejection.playerName);

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