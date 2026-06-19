import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { applyWeatherEffects } from './weather';
import { BALLPARKS, getBallparkEffect, getHitDirection, checkBallparkQuirk } from './ballparks';
import {
  pickLine, STRIKEOUT_LINES, WALK_LINES, INTENTIONAL_WALK_LINES,
  SINGLE_LINES, DOUBLE_LINES, TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  DOUBLE_PLAY_LINES, END_INNING_LINES, LINEOUT_LINES,
  POPOUT_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  STEAL_LINES, ERROR_LINES, FC_LINES,
} from './commentaryLines';
import { checkPitcherInjury, checkPlayInjury, getPlayerDurability } from './injuries';
import { getUmpireZoneEffect, maybeMissedCall } from './umpires';
import { pinchHit, pinchRun, defensiveSwitch, changePitcher } from './substitutions';

export { pinchHit, pinchRun, defensiveSwitch, changePitcher };

// ── Pitcher Fatigue (innings-based) ──
function getPitcherFatigue(inningsPitched, pitcher) {
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);
  const threshold = isReliever ? stamina * 0.4 : stamina * 0.7;
  if (inningsPitched <= threshold) return { fatigueLevel: 0, speedPen: 0, controlPen: 0, injuryMult: 1 };
  const overThreshold = inningsPitched - threshold;
  const speedPen = Math.min(5, Math.round(overThreshold * 0.5));
  const controlPen = Math.min(5, Math.round(overThreshold * 0.7));
  const fatigueLevel = Math.min(4, Math.floor(overThreshold));
  const injuryMult = inningsPitched >= 8 ? 2.5 : inningsPitched >= 6 ? 1.5 : 1;
  return { fatigueLevel, speedPen, controlPen, injuryMult };
}

export function getEffectivePitcher(state) {
  if (!state) return null;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher || !pitcher.stamina) return pitcher || null;
  const actualIP = pitcher.gameStats?.ip || 0;
  const fatigue = getPitcherFatigue(actualIP, pitcher);
  if (fatigue.fatigueLevel === 0) return pitcher;
  const offSpeedPen = fatigue.fatigueLevel >= 3 ? Math.min(4, Math.round((fatigue.fatigueLevel - 2) * 1.5)) : 0;
  return {
    ...pitcher,
    effectivePitchSpeed: Math.max(1, pitcher.pitchSpeed - fatigue.speedPen),
    effectiveControl: Math.max(1, pitcher.control - fatigue.controlPen),
    effectiveOffSpeed: Math.max(1, pitcher.offSpeed - offSpeedPen),
    fatigueLevel: fatigue.fatigueLevel,
    fatigueSpeedPen: fatigue.speedPen,
    fatigueControlPen: fatigue.controlPen,
    injuryRiskMult: fatigue.injuryMult,
  };
}

export function createGameState(homeTeam, awayTeam, customHomeLineup, customAwayLineup, useDH = false, weather = null, umpire = null) {
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];
  const buildLineup = (lineupData, defaultLineup, teamData) => {
    if (lineupData && lineupData.length >= 9) {
      return lineupData.slice(0, 9).map((p, i) => ({
        ...p, order: i + 1, assignedPos: p.assignedPos || p.pos,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
      }));
    }
    let lineup = defaultLineup.map((p, i) => ({
      ...p, order: i + 1, assignedPos: p.pos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
    }));
    if (useDH && lineup.length < 9 && teamData?.bench?.length > 0) {
      lineup.push({ ...teamData.bench[0], pos: 'DH', assignedPos: 'DH', defense: 0, arm: 0,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
        order: lineup.length + 1 });
    }
    if (!useDH) {
      // Strip any DH players from the default lineup — pitcher will bat
      lineup = lineup.filter(p => p.pos !== 'DH');
      if (teamData?.rotation?.length > 0) {
        const spName = teamData.rotation[0].name;
        if (!lineup.find(p => p.name === spName)) {
          lineup.push({ ...teamData.rotation[0], assignedPos: 'SP',
            gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
            order: lineup.length + 1 });
        }
      }
    }
    return lineup;
  };
  const homeLineup = buildLineup(customHomeLineup, home.lineup, home);
  const awayLineup = buildLineup(customAwayLineup, away.lineup, away);
  const homeSP = homeLineup.find(p => p.assignedPos === 'SP') || home.rotation[0];
  const awaySP = awayLineup.find(p => p.assignedPos === 'SP') || away.rotation[0];
  return {
    homeTeam, awayTeam, inning: 1, halfInning: 'top', outs: 0, balls: 0, strikes: 0,
    bases: [null, null, null], score: { home: 0, away: 0 },
    innings: Array(9).fill(null).map(() => ({ home: null, away: null })),
    homeLineup, awayLineup,
    homeRotation: [...home.rotation], awayRotation: [...away.rotation],
    homeBullpen: [...home.bullpen], awayBullpen: [...away.bullpen],
    homeBenchUsed: [], awayBenchUsed: [],
    homePitcher: createPitcherState(homeSP), awayPitcher: createPitcherState(awaySP),
    homeBatterIndex: 0, awayBatterIndex: 0, log: [],
    gameOver: false, waitingForInput: true, lastPlay: null, pitchResult: null,
    hitAndRun: false, pendingSteal: null,
    weather: weather || null, umpire: umpire || null,
    useDH: !!useDH,
    homePlayerHistory: [], awayPlayerHistory: [],
  };
}

function createPitcherState(p) {
  return { ...p, pitchCount: 0, pitches: p.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
}

export { TEAM_IDS };

const POSITION_GROUPS = { C: 'C', '1B': 'IF', '2B': 'IF', '3B': 'IF', 'SS': 'IF', LF: 'OF', CF: 'OF', RF: 'OF', DH: 'DH', OF: 'OF', INF: 'IF' };

function normalizePosGroup(pos) {
  if (!pos) return null;
  if (POSITION_GROUPS[pos]) return POSITION_GROUPS[pos];
  const parts = pos.split('/');
  for (const p of parts) { const t = p.trim(); if (POSITION_GROUPS[t]) return POSITION_GROUPS[t]; }
  return null;
}

function getAdjustedPlayer(player) {
  const assignedPos = player.assignedPos || player.pos;
  const naturalPos = player.pos;
  if (assignedPos === 'DH' || naturalPos === assignedPos) return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  const naturalParts = naturalPos.split('/').map(p => p.trim());
  if (naturalParts.includes(assignedPos)) return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  const naturalGroup = normalizePosGroup(naturalPos);
  const assignedGroup = normalizePosGroup(assignedPos);
  if (!naturalGroup || !assignedGroup) return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  if (naturalGroup === assignedGroup) return { ...player, defenseAdj: Math.max(1, player.defense - 1), errorMult: 1.5 };
  return { ...player, defenseAdj: Math.max(1, player.defense - 3), errorMult: 3.0 };
}

function getDefensivePlayers(state) {
  const fieldingLineup = state.halfInning === 'top' ? state.homeLineup : state.awayLineup;
  const defenders = {};
  fieldingLineup.forEach(p => { const pos = p.assignedPos || p.pos; if (pos !== 'DH') defenders[pos] = p; });
  return defenders;
}

function getOutfieldArm(defenders) {
  let bestArm = 5;
  ['LF','CF','RF'].forEach(pos => {
    if (defenders[pos]) {
      const adj = getAdjustedPlayer(defenders[pos]);
      const ng = normalizePosGroup(adj.pos);
      const arm = adj.assignedPos && adj.assignedPos !== adj.pos && ng !== 'OF' ? Math.max(1, adj.arm - 2) : adj.arm;
      if (arm > bestArm) bestArm = arm;
    }
  });
  return bestArm;
}

function getMiddleInfieldRating(defenders) {
  const ss = defenders['SS'], b2 = defenders['2B'];
  const adjSS = ss ? getAdjustedPlayer(ss) : null, adjB2 = b2 ? getAdjustedPlayer(b2) : null;
  const ssDef = adjSS ? (adjSS.defenseAdj + (adjSS.pos === 'SS' ? adjSS.arm : Math.max(1, adjSS.arm - 2))) / 2 : 5;
  const b2Def = adjB2 ? (adjB2.defenseAdj + (adjB2.pos === '2B' ? adjB2.arm : Math.max(1, adjB2.arm - 2))) / 2 : 5;
  return (ssDef + b2Def) / 2;
}

function getCatcherArm(defenders) {
  if (!defenders['C']) return 5;
  const adj = getAdjustedPlayer(defenders['C']);
  if (adj.pos !== 'C') return Math.max(1, adj.arm - 3);
  return adj.arm;
}

function getErrorChance(playerName) {
  const errors = PLAYER_ERRORS[playerName] || 10;
  return Math.min(0.05, errors / 500);
}

function getCurrentBatter(state) {
  if (state.halfInning === 'top') return state.awayLineup[state.awayBatterIndex % state.awayLineup.length];
  return state.homeLineup[state.homeBatterIndex % state.homeLineup.length];
}

function getCurrentPitcher(state) {
  return state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
}

function getBattingTeam(state) {
  return state.halfInning === 'top' ? 'away' : 'home';
}

function advanceBatter(state) {
  if (state.halfInning === 'top') state.awayBatterIndex = (state.awayBatterIndex + 1) % state.awayLineup.length;
  else state.homeBatterIndex = (state.homeBatterIndex + 1) % state.homeLineup.length;
}

function scoreRun(state) {
  const team = getBattingTeam(state);
  state.score[team]++;
  if (state.innings[state.inning - 1]) {
    const half = state.halfInning === 'top' ? 'away' : 'home';
    if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
    state.innings[state.inning - 1][half]++;
  }
}

function advanceRunners(state, bases, batter, isHit = false) {
  let runsScored = 0;
  const pitcher = getCurrentPitcher(state);
  if (bases === 4) {
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) { state.bases[i].gameStats.runs++; scoreRun(state); runsScored++; state.bases[i] = null; }
    }
    batter.gameStats.runs++; batter.gameStats.rbi += runsScored + 1; scoreRun(state);
    pitcher.gameStats.r += runsScored + 1; pitcher.gameStats.er += runsScored + 1;
    return runsScored + 1;
  }
  let rbi = 0;
  const preBases = [...state.bases];
  for (let i = 2; i >= 0; i--) {
    if (state.bases[i]) {
      const newBase = i + bases;
      if (newBase >= 3) { state.bases[i].gameStats.runs++; scoreRun(state); rbi++; state.bases[i] = null; }
      else { state.bases[newBase] = state.bases[i]; state.bases[i] = null; }
    }
  }
  const defenders = getDefensivePlayers(state);
  if (isHit && bases <= 2) {
    const ofArm = getOutfieldArm(defenders);
    const armPenalty = (ofArm / 10) * 0.18;
    const batterPower = batter.power / 10;
    const positioningPenalty = batterPower * 0.10;
    const outsMultiplier = state.outs >= 2 ? 1.60 : (state.outs === 1 ? 1.15 : 1.0);
    for (let i = 0; i < 3; i++) {
      const runner = state.bases[i];
      if (!runner || preBases[i]?.name !== runner.name) continue;
      const speedFactor = runner.speed / 10;
      if (i === 0) {
        if (bases === 2) {
          const hc = (0.15 + speedFactor * 0.50 - armPenalty - positioningPenalty) * outsMultiplier;
          if (Math.random() < Math.max(0.02, hc)) { runner.gameStats.runs++; scoreRun(state); rbi++; state.bases[0] = null; state.log.push({ type: 'info', text: `${runner.name} hustles all the way home from first!` }); }
        } else if (bases === 1) {
          const tc = (0.12 + speedFactor * 0.40 - armPenalty * 0.6 - positioningPenalty * 0.4) * outsMultiplier;
          if (Math.random() < Math.max(0.03, tc)) { state.bases[2] = runner; state.bases[0] = null; state.log.push({ type: 'info', text: `${runner.name} wheels to third on the single!` }); }
        }
      } else if (i === 1 && bases === 1) {
        const twoOutBonus = state.outs >= 2 ? 0.20 : 0;
        const hc = (0.28 + speedFactor * 0.55 - armPenalty - positioningPenalty + twoOutBonus) * outsMultiplier;
        if (Math.random() < Math.max(0.05, hc)) { runner.gameStats.runs++; scoreRun(state); rbi++; state.bases[1] = null; state.log.push({ type: 'info', text: `${runner.name} scores from second on the single!` }); }
      }
    }
  }
  if (bases <= 3) state.bases[bases - 1] = batter;
  if (isHit && bases === 1) {
    const r3 = state.bases[2], b1 = state.bases[0];
    // Only allow "takes second on throw to third" when the runner on 3rd actually
    // advanced there during this play (wasn't already on 3rd before the hit).
    const preR3 = preBases[2];
    const r3AdvancedToThird = r3 && preR3 !== r3;
    if (b1 && b1.name === batter.name && r3AdvancedToThird && !state.bases[1]) {
      const ofArm = getOutfieldArm(defenders);
      const sc = 0.08 + (r3.speed / 10) * 0.28 - (ofArm / 10) * 0.06 + (batter.speed / 10) * 0.10;
      if (Math.random() < Math.max(0.02, Math.min(sc, 0.28))) { state.bases[1] = batter; state.bases[0] = null; state.log.push({ type: 'info', text: `${batter.name.split(' ').pop()} takes second — defense threw to third!` }); }
    }
  }
  batter.gameStats.rbi += rbi; pitcher.gameStats.r += rbi; pitcher.gameStats.er += rbi;
  return runsScored + rbi;
}

function recordOut(state) {
  state.outs++; getCurrentPitcher(state).gameStats.ip += 1/3;
  if (state.outs >= 3) endHalfInning(state);
}

function endHalfInning(state) {
  const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
  const half = state.halfInning === 'top' ? 'away' : 'home';
  if (!state.innings[state.inning - 1]) state.innings[state.inning - 1] = { home: null, away: null };
  if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
  state.outs = 0; state.balls = 0; state.strikes = 0; state.bases = [null, null, null]; state.hitAndRun = false; state.pendingSteal = null;
  if (state.halfInning === 'top') {
    state.halfInning = 'bottom';
    if (state.inning === 7) {
      const stretchLines = { cubs: `🎶 Harry Caray grabs the mic — "Take me out to the ballgame… Let's get some runs!" 🎶`, redsox: `🎶 The crowd belts out 'Sweet Caroline' in the middle of the 8th — but first, the 7th inning stretch at Fenway! 🎶` };
      const song = stretchLines[state.homeTeam] || `🎶 7th Inning Stretch at ${TEAMS[state.homeTeam]?.stadium || 'the ballpark'}! 🎶`;
      state.log.push({ type: 'info', text: song });
    }
    if (state.inning >= 9 && state.score.home > state.score.away) { state.gameOver = true; state.waitingForInput = false; state.log.push({ type: 'info', text: `Game Over! ${home.name} win ${state.score.home}-${state.score.away}!` }); return; }
  } else {
    if (state.inning >= 9 && state.score.home !== state.score.away) { const w = state.score.home > state.score.away ? home.name : away.name; state.gameOver = true; state.waitingForInput = false; state.log.push({ type: 'info', text: `Game Over! ${w} win ${Math.max(state.score.home,state.score.away)}-${Math.min(state.score.home,state.score.away)}!` }); return; }
    state.halfInning = 'top'; state.inning++;
    if (state.inning > state.innings.length) state.innings.push({ home: null, away: null });
  }
  const bt = state.halfInning === 'top' ? away.name : home.name;
  state.log.push({ type: 'info', text: `${pickLine(END_INNING_LINES)} ${state.halfInning === 'top' ? 'Bottom' : 'Top'} of inning ${state.inning} — ${bt} batting` });
}

// --- STOLEN BASE ---
export function attemptSteal(state, baseIndex) {
  const runner = state.bases[baseIndex];
  if (!runner) return state;
  const newState = JSON.parse(JSON.stringify(state));
  // Clear one-shot flags from previous play
  delete newState._wasReachBack;
  const speedFactor = runner.speed / 10;
  const pitcher = getCurrentPitcher(newState);
  const effP = getEffectivePitcher(newState) || pitcher;
  const defenders = getDefensivePlayers(newState);
  const catcherArm = getCatcherArm(defenders);
  const pSpeed = effP.effectivePitchSpeed || effP.pitchSpeed;
  const pCtrl = effP.effectiveControl || effP.control;
  let sc = 0.20 + speedFactor * 0.55 - (catcherArm / 10) * 0.12 - (pCtrl / 10) * 0.03 - (pSpeed / 10) * 0.13;
  sc = Math.max(0.08, Math.min(sc, 0.80));
  if (Math.random() < sc) {
    runner.gameStats.sb = (runner.gameStats.sb || 0) + 1;
    if (baseIndex + 1 >= 3) { runner.gameStats.runs++; scoreRun(newState); newState.bases[baseIndex] = null; const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, 'home')}`; newState.log.push({ type: 'steal', text: stxt }); newState.lastPlay = { type: 'steal', text: stxt }; }
    else { newState.bases[baseIndex + 1] = runner; newState.bases[baseIndex] = null; const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, ['second','third','home'][baseIndex])}`; newState.log.push({ type: 'steal', text: stxt }); newState.lastPlay = { type: 'steal', text: stxt }; }
  } else {
    runner.gameStats.cs = (runner.gameStats.cs || 0) + 1; newState.bases[baseIndex] = null; recordOut(newState);
    const cstxt = `❌ ${runner.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, ['second','third','home'][baseIndex])}`; newState.log.push({ type: 'caughtstealing', text: cstxt }); newState.lastPlay = { type: 'caughtstealing', text: cstxt };
  }
  newState.pendingSteal = null;
  return newState;
}

export function hasRunnersOnBase(state) { return state.bases.some(b => b !== null); }

// --- HIT AND RUN ---
export function setHitAndRun(state, active) { const ns = JSON.parse(JSON.stringify(state)); ns.hitAndRun = active; return ns; }

// --- CPU DECISIONS ---
export function cpuDecideSteal(state) {
  if (state.outs >= 2) return -1;
  const defenders = getDefensivePlayers(state);
  const catcherArm = getCatcherArm(defenders);
  const pitcher = getCurrentPitcher(state);
  const effP = getEffectivePitcher(state) || pitcher;
  const armF = (catcherArm / 10) * 0.30;
  const pitchF = ((effP.effectivePitchSpeed || effP.pitchSpeed) / 10) * 0.12;
  for (let i = 0; i < 2; i++) { const r = state.bases[i]; if (!r || state.bases[i + 1] || r.speed <= 2) continue; if (Math.random() < Math.max(0.03, 0.06 + (r.speed / 10) * 0.22 - armF - pitchF)) return i; }
  return -1;
}

function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  const effectiveP = getEffectivePitcher(state) || pitcher;
  pitcher.gameStats.pitches++;
  const controlFactor = (effectiveP.effectiveControl || effectiveP.control) / 10;
  const effControl = effectiveP.effectiveControl || effectiveP.control;
  const wpChance = Math.max(0.008, (10 - effControl) * 0.008);
  if (Math.random() < wpChance) {
    const hasR = state.bases.some(b => b !== null);
    if (hasR) {
      let scored = null; const moved = [];
      for (let i = 2; i >= 0; i--) {
        if (state.bases[i]) {
          if (i + 1 >= 3) { state.bases[i].gameStats.runs++; scoreRun(state); scored = state.bases[i]; state.bases[i] = null; }
          else if (!state.bases[i + 1]) { state.bases[i + 1] = state.bases[i]; state.bases[i] = null; moved.push(state.bases[i + 1]); }
        }
      }
      const wpBase = pickLine(WILD_PITCH_LINES);
      state.log.push({ type: 'error', text: scored ? `${wpBase} ${scored.name.split(' ').pop()} scores!${moved.length ? ' Runners advance.' : ''}` : `${wpBase} Runners advance!` });
      state.lastPlay = { type: 'error', text: scored ? `${wpBase} — ${scored.name.split(' ').pop()} scores!` : wpBase };
    }
    state.balls++;
    return { pitchType: pitchType.name, isStrike: false, location: 'wild pitch', isWildPitch: true };
  }
  const hbpChance = Math.max(0.002, (10 - effControl) * 0.0015);
  if (Math.random() < hbpChance) return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true };
  let strikeChance = 0.35 + controlFactor * 0.28 + (pitchType.controlBonus || 0) * 0.04;
  if (state.umpire) strikeChance += getUmpireZoneEffect(state.umpire) / 100;
  const isStrike = Math.random() < Math.min(Math.max(strikeChance, 0.08), 0.92);
  return { pitchType: pitchType.name, isStrike, location: isStrike ? ['inside corner','outside corner','down the middle','high strike','low strike'][Math.floor(Math.random() * 5)] : ['high','low','inside','outside','way outside','in the dirt'][Math.floor(Math.random() * 6)] };
}

function resolveSwing(state, swingType, pitch) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  if (swingType.name === 'Take Pitch') {
    if (pitch.isStrike) {
      state.strikes++;
      if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} ${pickLine(STRIKEOUT_CALLED_LINES)}` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} ${pickLine(STRIKEOUT_CALLED_LINES)}` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
      state.log.push({ type: 'strike', text: `Strike ${state.strikes} — ${batter.name} takes a ${pitch.location} ${pitch.pitchType}` });
      state.lastPlay = { type: 'strike', text: `Strike ${state.strikes} — ${batter.name} watches it` };
    } else {
      state.balls++;
      if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; }
      state.log.push({ type: 'ball', text: `Ball ${state.balls} — ${pitch.pitchType} ${pitch.location}` });
      state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` };
    }
    return;
  }
  if (swingType.name === 'Bunt') {
    if (!pitch.isStrike && Math.random() < 0.55) { state.balls++; if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; } state.log.push({ type: 'ball', text: `Ball ${state.balls} — ${batter.name} pulls back the bunt` }); state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` }; return; }
    const isPH = batter.pos === 'SP' || batter.assignedPos === 'SP';
    const isRelieverPitcher = batter.pos === 'RP' || batter.pos === 'CL' || batter.assignedPos === 'RP' || batter.assignedPos === 'CL';
    const hasR1 = !!state.bases[0];
    const canSac = state.outs < 2 && hasR1;
    if (isPH && canSac) {
      // Pitcher sacrifice bunt: 75% success for starters, 55% for relievers
      const pitcherBuntSkill = isRelieverPitcher ? 0.55 : 0.75;
      if (Math.random() < pitcherBuntSkill) {
        const r1 = state.bases[0];
        if (r1) {
          if (state.bases[2]) { state.bases[2].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.log.push({ type: 'info', text: `${state.bases[2].name.split(' ').pop()} scores on the sacrifice` }); }
          state.bases[2] = state.bases[1] || null; state.bases[1] = r1; state.bases[0] = null;
        }
        batter.gameStats.ab++; pitcher.gameStats.so++;
        state.log.push({ type: 'groundout', text: `${batter.name} ${pickLine(SACRIFICE_BUNT_LINES)} ${r1?.name?.split(' ').pop()} moves to second` });
        state.lastPlay = { type: 'groundout', text: `Sacrifice bunt by ${batter.name}` };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
      } else {
        // Failed bunt attempt
        const failRoll = Math.random();
        if (failRoll < 0.45) {
          // Bunt missed — strike
          state.strikes++;
          if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} can't get the bunt down — strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} fails to bunt — strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
          state.log.push({ type: 'strike', text: `${batter.name} misses the bunt — strike ${state.strikes}` });
          state.lastPlay = { type: 'strike', text: `Missed bunt — strike ${state.strikes}` };
          return;
        } else if (failRoll < 0.70) {
          // Pops it up
          batter.gameStats.ab++; pitcher.gameStats.so++; state.log.push({ type: 'popout', text: `${batter.name} pops up the bunt attempt — caught by the catcher!` }); state.lastPlay = { type: 'popout', text: `Pop-up bunt — out!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
        } else {
          // Foul bunt
          state.strikes++;
          if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
          state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt — strike ${state.strikes}` });
          state.lastPlay = { type: 'foul', text: `Foul bunt — strike ${state.strikes}` };
          return;
        }
      }
    }
    const buntingSkill = (batter.bunting || 3) / 10;
    const sf = batter.speed / 10;
    const pp = isPH ? 0.02 : 1.0;
    if (Math.random() < ((0.12 + buntingSkill * 0.30 + sf * 0.18) * pp)) { batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++; const rbiB = advanceRunners(state, 1, batter, true); state.log.push({ type: 'single', text: `${batter.name} ${pickLine(BUNT_SINGLE_LINES)}${rbiB ? ` ${rbiB} RBI!` : ''}` }); state.lastPlay = { type: 'single', text: `${batter.name} ${pickLine(BUNT_SINGLE_LINES)}${rbiB ? ` ${rbiB} RBI!` : ''}` }; state.balls = 0; state.strikes = 0; advanceBatter(state); return; }
    else { state.strikes++; if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt — strike ${state.strikes}` }); state.lastPlay = { type: 'foul', text: `Foul bunt — strike ${state.strikes}` }; return; }
  }
  const isPower = swingType.name === 'Power Swing', isContact = swingType.name === 'Contact Swing';
  const adjBatter = getSituationalBatter(state);
  const contactRating = adjBatter.contact / 10;
  const isPitcherBatting = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let contactChance = 0.38 + contactRating * 0.35;
  if (isPitcherBatting) contactChance *= 0.55; // Pitchers are much worse hitters
  if (isPower) contactChance -= 0.10; if (isContact) contactChance += 0.12; if (!pitch.isStrike) contactChance -= 0.20;
  if (state.hitAndRun) { contactChance -= 0.08; contactChance = Math.max(0.03, contactChance); }
  const effP2 = getEffectivePitcher(state) || pitcher;
  contactChance -= (effP2.effectiveOffSpeed || effP2.offSpeed || pitcher.offSpeed) / 10 * 0.07 + (effP2.effectivePitchSpeed || effP2.pitchSpeed) / 10 * 0.05;
  if (effP2.fatigueLevel >= 3) contactChance += 0.12;
  contactChance = Math.max(0.05, Math.min(contactChance, 0.85));
  if (!(Math.random() < contactChance)) {
    if (!pitch.isStrike && !state.hitAndRun && Math.random() < 0.50 + contactRating * 0.18) { state.balls++; if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; } state.log.push({ type: 'ball', text: [`Ball ${state.balls} — just off the plate`,`Takes outside — ball ${state.balls}`,`Ball ${state.balls} — low`,`Pulled the bat back — ball ${state.balls}`,`Checked the swing — ball ${state.balls}`,`Held up — ball ${state.balls}`,`Ball ${state.balls} — high`,`Lays off — ball ${state.balls}`][Math.floor(Math.random() * 8)] }); state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` }; return; }
    state.strikes++;
    if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; const isLooking = pitch.location && ['outside corner','inside corner','high strike','low strike','down the middle'].includes(pitch.location) && Math.random() < 0.45; const sl = isLooking ? pickLine(STRIKEOUT_CALLED_LINES) : pickLine(STRIKEOUT_SWINGING_LINES); const msg = sl.endsWith('!') ? `${batter.name} ${sl}` : `${batter.name} ${sl} ${pitch.pitchType}!`; state.log.push({ type: 'strikeout', text: msg }); state.lastPlay = { type: 'strikeout', text: msg }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); if (state.hitAndRun && !state.gameOver) handleHitAndRunCaught(state); return; }
    if (state.hitAndRun && !state.gameOver) { state.hitAndRun = false; handleHitAndRunMiss(state); }
    const isChasing = !pitch.isStrike;
    const labels = isChasing ? [`Chases outside — strike ${state.strikes}`,`Waves at a ${pitch.pitchType} — strike ${state.strikes}`,`Can't lay off the ${pitch.pitchType} — strike ${state.strikes}`,`Couldn't hold up — strike ${state.strikes}`,`Swings through the ${pitch.pitchType} — strike ${state.strikes}`] : [`Swing and a miss — strike ${state.strikes}`,`Taken at the knees — strike ${state.strikes}`,`Waves at a ${pitch.pitchType} — strike ${state.strikes}`,`Just misses — strike ${state.strikes}`,`Fouled off attempt — nope, swing and a miss, strike ${state.strikes}`];
    const strikeLabel = labels[Math.floor(Math.random() * labels.length)];
    state.log.push({ type: 'strike', text: strikeLabel });
    state.lastPlay = { type: 'strike', text: strikeLabel };
    return;
  }
  if (state.hitAndRun) { state.hitAndRun = false; handleHitAndRunContact(state, batter, pitcher, adjBatter); return; }
  batter.gameStats.ab++;
  if (Math.random() < 0.18) { if (state.strikes < 2) state.strikes++; state.log.push({ type: 'foul', text: `${batter.name} fouls it off — ${state.balls} and ${state.strikes}` }); state.lastPlay = { type: 'foul', text: `Foul ball` }; batter.gameStats.ab--; return; }
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1, doubleMod = wx.doubleMod || 1, errorWx = wx.errorMult || 1, contactWx = wx.contactMod || 0;
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const ballparkEffect = getBallparkEffect(stadiumName, adjBatter.bats, state.weather);
  const ballparkHRMod = ballparkEffect.hrMod || 1;
  const hitDirection = getHitDirection(adjBatter.bats);
  const powerRating = adjBatter.power / 10;
  const isPitcherBatting2 = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let hitChance = 0.20 + (contactRating + contactWx / 10) * 0.28;
  if (isPitcherBatting2) hitChance *= 0.45; // Pitchers rarely get hits
  if (isPower) hitChance -= 0.04; if (isContact) hitChance += 0.08;
  const effP3 = getEffectivePitcher(state) || pitcher;
  hitChance -= (effP3.effectiveControl || effP3.control) / 10 * 0.03;
  if (effP3.fatigueLevel >= 3) hitChance += 0.10; if (effP3.fatigueLevel >= 4) hitChance += 0.06;
  const gs = effP3.effectivePitchSpeed || effP3.pitchSpeed; if (gs <= 2 && effP3.fatigueLevel >= 3) hitChance += 0.05;
  hitChance += (adjBatter.power / 10) * 0.05;
  const defenders = getDefensivePlayers(state);
  let rp = 0; Object.values(defenders).forEach(d => { const adj = getAdjustedPlayer(d); if (adj.pos !== (adj.assignedPos || adj.pos)) rp += 0.015; });
  hitChance += rp; hitChance = Math.max(0.08, Math.min(hitChance, 0.72));
  if (Math.random() < hitChance) {
    pitcher.gameStats.h++; batter.gameStats.hits++;
    let powerMod = isPower ? 1.6 : (isContact ? 0.5 : 1.0);
    const effPwr = powerRating * powerMod, sf2 = adjBatter.speed / 10, hr2 = Math.random();
    if (hr2 < effPwr * 0.065 * hrMod * ballparkHRMod) {
      batter.gameStats.hr++; const runnersOn = state.bases.filter(b => b !== null).length; const rbi = advanceRunners(state, 4, batter);
      const bp = BALLPARKS[stadiumName], fd = bp?.wallDesc?.[hitDirection] || `to ${hitDirection}`;
      let ht; const gs2 = runnersOn === 3;
      if (bp?.quirks?.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Up and over the Green Monster! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} clears the 37-foot wall!`;
      else if (bp?.quirks?.includes('shortRF') && hitDirection === 'RF' && adjBatter.bats === 'L') ht = `Into the short porch! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} hooks one just over ${fd}!`;
      else if (bp?.quirks?.includes('peskyPole') && hitDirection === 'RF') ht = `Around Pesky's Pole! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} wraps it inside the right field foul pole!`;
      else if (bp?.quirks?.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Onto Waveland Avenue! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} launches one over the ivy and out of Wrigley!`;
      else { ht = `${batter.name} sends it deep ${fd} —` + (gs2 ? ` GRAND SLAM! ${batter.name} clears the bases!` : (rbi > 1 ? ` a ${rbi}-run HOME RUN!` : ` a solo HOME RUN!`)); }
      state.log.push({ type: 'homerun', text: `💥 ${ht}` }); state.lastPlay = { type: 'homerun', text: `💥 ${ht}` };
    } else if (hr2 < (effPwr * 0.10 + sf2 * 0.08) * doubleMod) {
      const rbi = advanceRunners(state, 3, batter, true);
      const tripText = `${batter.name} ${pickLine(TRIPLE_LINES)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: tripText });
      state.lastPlay = { type: 'triple', text: tripText };
    } else if (hr2 < effPwr * 0.32 * doubleMod) {
      const rbi = advanceRunners(state, 2, batter, true);
      const dblText = `${batter.name} ${pickLine(DOUBLE_LINES)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: dblText });
      state.lastPlay = { type: 'double', text: dblText };
    } else {
      const rbi = advanceRunners(state, 1, batter, true);
      const singleText = `${batter.name} ${pickLine(SINGLE_LINES)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'single', text: singleText });
      state.lastPlay = { type: 'single', text: singleText };
    }
    state.balls = 0; state.strikes = 0; advanceBatter(state);
  } else {
    const posNames = { '1B': 'first base', '2B': 'second base', '3B': 'third base', SS: 'shortstop', SP: 'the pitcher', C: 'the catcher', LF: 'left field', CF: 'center field', RF: 'right field' };
    const gps = [{ pos: 'SS', posName: 'shortstop' },{ pos: '2B', posName: 'second' },{ pos: '3B', posName: 'third' },{ pos: 'SP', posName: 'the pitcher' },{ pos: '1B', posName: 'first' }];
    const gp = gps[Math.floor(Math.random() * gps.length)];
    const gt = `${batter.name} ${pickLine(GROUNDOUT_LINES)}`.replace(/grounds out to (short|second|third|the pitcher|first)/, `grounds out to ${gp.posName}`);
    const gts = [{ text: gt, pos: gp.pos, posName: gp.posName, type: 'groundout' }];
    const ff = { CF: ['center','center field'], RF: ['right','right field'], LF: ['left','left field'] };
    const fpk = ['CF','RF','LF']; const fp = fpk[Math.floor(Math.random() * fpk.length)];
    const d = ['shallow ','','deep ','the warning track in ','back at the wall in '][Math.floor(Math.random() * 5)];
    const fl = pickLine(FLYOUT_LINES);
    const ftt = fl.includes('flies out to') ? `${batter.name} ${fl} ${d}${ff[fp][0]}` : fl.includes(' — ') ? `${batter.name} ${fl} ${d}${ff[fp][0]}` : `${batter.name} flies out — ${fl} ${d}${ff[fp][0]} — caught`;
    const fts = [{ text: ftt, pos: fp, type: 'flyout' }];
    const loP = ['3B','SS','1B','2B']; const lp = loP[Math.floor(Math.random() * loP.length)];
    const lt = `${batter.name} ${pickLine(LINEOUT_LINES)} ${defenders[lp]?.name || posNames[lp]}`;
    const ppP = ['C','2B','3B']; const pp = ppP[Math.floor(Math.random() * ppP.length)];
    const pt = pickLine(POPOUT_LINES);
    const pf = pt.includes('pops it up') || pt.includes('pops one') ? `${batter.name} ${pt} ${defenders[pp]?.name || posNames[pp]} makes the catch` : `Infield pop-up — ${defenders[pp]?.name || posNames[pp]} ${pt}`;
    const oo = [{ text: pf, pos: pp, type: 'popout' },{ text: lt, pos: lp, type: 'lineout' }];
    const ao = [...gts, ...fts, ...oo]; const out = ao[Math.floor(Math.random() * ao.length)];
    const isFlyBall = ['CF','RF','LF'].includes(out.pos) || out.type === 'popout' || out.type === 'lineout';
    if (isFlyBall && out.type !== 'popout') {
      const q = checkBallparkQuirk(stadiumName, adjBatter.bats, hitDirection, state.weather);
      if (q && q.isHit) { batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++; if (q.isHR) { batter.gameStats.hr++; advanceRunners(state, 4, batter); } else advanceRunners(state, q.bases, batter, true); state.log.push({ type: q.type, text: q.text }); state.balls = 0; state.strikes = 0; advanceBatter(state); return; }
      if (q && !q.isHit) { state.log.push({ type: q.type, text: q.text }); state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
    }
    const isGrounder = !isFlyBall;
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) { const adjF = getAdjustedPlayer(fielder); if (Math.random() < getErrorChance(fielder.name) * adjF.errorMult * errorWx) { batter.gameStats.ab++; pitcher.gameStats.er++; advanceRunners(state, 1, batter, false); const errText = `❌ ${fielder.name} ${pickLine(ERROR_LINES)} ${batter.name} reaches on an error!`; state.log.push({ type: 'error', text: errText }); state.lastPlay = { type: 'error', text: errText }; state.balls = 0; state.strikes = 0; advanceBatter(state); return; } }
    }
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) { const af = getAdjustedPlayer(fielder); const rp2 = af.pos !== (af.assignedPos || af.pos) ? 0.06 : 0; const ihc = Math.max(0, (batter.speed / 10) * 0.30 - (af.arm / 10) * 0.15 - (af.defenseAdj / 10) * 0.05 + rp2); if (Math.random() < ihc) { batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++; advanceRunners(state, 1, batter, true); const isText = `${batter.name} beats it out — infield single past ${fielder.name}!`; state.log.push({ type: 'single', text: isText }); state.lastPlay = { type: 'single', text: isText }; state.balls = 0; state.strikes = 0; advanceBatter(state); return; } }
    }
    if (isGrounder) {
      const r1 = state.bases[0], r2 = state.bases[1];
      if (r1 && state.outs < 2) {
        const mi = getMiddleInfieldRating(defenders);
        let dpc = 0.30 + (mi / 10) * 0.22 - ((r1 ? r1.speed : 5) / 10) * 0.04; dpc = Math.max(0.10, Math.min(dpc, 0.45));
        const roll = Math.random();
        if (roll < dpc) {
          const isMI = ['2B','SS'].includes(out.pos);
          if (r1 && r2 && !isMI) { const r3 = state.bases[2]; if (r3 && state.outs < 2) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; } state.bases[2] = null; state.bases[1] = r1 || null; state.bases[0] = null; }
          else { const r3dp = state.bases[2]; if (r3dp && state.outs < 2) { r3dp.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.bases[2] = null; } if (state.bases[1]) { state.bases[2] = state.bases[2] || state.bases[1]; state.bases[1] = null; } state.bases[0] = null; const dpLine = pickLine(DOUBLE_PLAY_LINES); const dpText = dpLine.includes('grounds into') ? `${batter.name} ${dpLine}` : `${batter.name} grounds to ${['short','second','third','the pitcher'][Math.floor(Math.random() * 4)]} — flip to ${defenders['2B']?.name?.split(' ').pop() || 'second'}, relay to first — ${dpLine}`; state.log.push({ type: 'doubleplay', text: dpText }); state.lastPlay = { type: 'doubleplay', text: dpText }; }
          state.balls = 0; state.strikes = 0; advanceBatter(state);
          state.outs++; getCurrentPitcher(state).gameStats.ip += 1/3;
          if (!state.gameOver && state.outs < 3) { state.outs++; getCurrentPitcher(state).gameStats.ip += 1/3; if (state.outs >= 3) endHalfInning(state); }
          if (state.outs >= 3) endHalfInning(state); return;
        } else if (roll < dpc + 0.30) {
          let fcText;
          const fielderPos = out.pos;
          const r1runner = r1, r2runner = r2;
          // With runners on 1st & 2nd: force depends on who fields it
          // 2B/SS → force at 2nd (flip to SS covering, relay to 1st)
          // 3B → force at 3rd (step on bag, throw to 1st)
          if (r1runner && r2runner && state.outs < 2) {
            const r3 = state.bases[2];
            const forceAtThird = fielderPos === '3B' || (fielderPos === 'SP' && Math.random() < 0.4);
            if (forceAtThird) {
              // 3B or pitcher fields → steps on 3rd for the force
              if (r3) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; }
              state.bases[2] = null;
              state.bases[1] = r1runner;
              state.bases[0] = batter;
              batter.gameStats.ab++;
              fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[fielderPos] || fielderPos} — force out at 3rd! ${r2runner ? r2runner.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} — batter reaches on fielder's choice.`;
            } else {
              // 2B/SS/1B → flip to 2nd for the force, batter safe at 1st
              if (r3) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; }
              state.bases[2] = state.bases[1]; // r2 moves to 3rd
              state.bases[1] = null;             // r1 is out at 2nd
              state.bases[0] = batter;           // batter safe at 1st
              batter.gameStats.ab++;
              fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[fielderPos] || fielderPos} — force out at 2nd! ${r1runner ? r1runner.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} — batter reaches on fielder's choice.`;
            }
          }
          else { const r3 = state.bases[2]; if (r3) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; } state.bases[2] = state.bases[1]; state.bases[1] = null; state.bases[0] = batter; batter.gameStats.ab++; fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[out.pos] || out.pos} — force out at 2nd! ${r1 ? r1.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} — batter reaches on fielder's choice.`; }
          state.log.push({ type: 'fc', text: fcText }); state.lastPlay = { type: 'fc', text: fcText };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
        }
      }
      if (r1 && isGrounder) { const r1n = state.bases[0], r3n = state.bases[2], r2n = state.bases[1]; if (r3n && r2n && r1n && state.outs < 2) { r3n.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; out.text = `${out.text} — ${r3n.name.split(' ').pop()} scores`; state.bases[2] = null; } const sr2 = state.bases[1]; state.bases[0] = null; state.bases[1] = r1n; state.bases[2] = sr2 || state.bases[2]; if (!out.text.includes('advances') && !out.text.includes('scores') && !(state.outs >= 2)) out.text = `${out.text} — ${r1n.name.split(' ').pop()} advances to second`; }
      if (!r1 && state.bases[1] && !state.bases[2] && state.outs < 2 && isGrounder) { const runner = state.bases[1]; const isRS = ['1B','2B'].includes(out.pos); const ac = isRS ? 0.55 + (runner.speed / 10) * 0.35 : 0.05 + (runner.speed / 10) * 0.20; if (Math.random() < Math.max(0.05, ac)) { state.bases[2] = runner; state.bases[1] = null; out.text = `${out.text} — ${runner.name.split(' ').pop()} advances to third`; } }
    }
    const isOutfieldFly = isFlyBall && out.type !== 'popout' && out.type !== 'lineout' && !out.text.includes('shallow ');
    if (isOutfieldFly && state.bases[2] && state.outs < 2) { const r = state.bases[2]; const d2 = out.text.includes('deep ') || out.text.includes('warning track') || out.text.includes('back at the wall'); const db = d2 ? 0.30 : 0.05; const sfc = 0.30 + db + (r.speed / 10) * 0.42 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.10, Math.min(sfc, 0.90))) { r.gameStats.runs++; scoreRun(state); state.bases[2] = null; batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; const sfText = `${batter.name} ${pickLine(SAC_FLY_LINES)} ${r.name} tags and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } }
    if (isOutfieldFly) { const r3 = state.bases[2], r2 = state.bases[1], r1 = state.bases[0]; const isDeep = out.text.includes('deep ') || out.text.includes('warning track') || out.text.includes('back at the wall'); if (r3 && state.outs < 2) { const db2 = isDeep ? 0.40 : 0.10; const htc = db2 + (r3.speed / 10) * 0.30 - (getOutfieldArm(defenders) / 10) * 0.08;         if (Math.random() < Math.max(0.05, Math.min(htc, 0.65))) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; state.bases[2] = null; const sfText = `${r3.name} tags up and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; if (r2 && state.outs < 2) { const tc2 = isDeep ? (0.15 + (r2.speed / 10) * 0.40 - (getOutfieldArm(defenders) / 10) * 0.10) : (0.05 + (r2.speed / 10) * 0.25 - (getOutfieldArm(defenders) / 10) * 0.08); if (Math.random() < Math.max(0.03, Math.min(tc2, 0.35))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); } } batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } } if (r1 && isDeep && !state.bases[1] && state.outs < 2) { const r1Tag = state.bases[0]; if (r1Tag) { const tc1 = 0.15 + (r1Tag.speed / 10) * 0.45 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.06, Math.min(tc1, 0.55))) { state.bases[1] = r1Tag; state.bases[0] = null; state.log.push({ type: 'info', text: `${r1Tag.name} tags up and advances to second!` }); } } } if (r2 && state.outs < 2 && !state.bases[2]) { const tc3 = 0.10 + (r2.speed / 10) * 0.35 - (getOutfieldArm(defenders) / 10) * 0.10; if (Math.random() < Math.max(0.04, Math.min(tc3, 0.35))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); } } }
    state.log.push({ type: isFlyBall ? 'flyout' : 'groundout', text: out.text });
    state.lastPlay = { type: isFlyBall ? 'flyout' : 'groundout', text: out.text };
    state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
  }
}

function handleWalk(state, batter) {
  if (state.bases[0]) { if (state.bases[1]) { if (state.bases[2]) { state.bases[2].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; } state.bases[2] = state.bases[1]; } state.bases[1] = state.bases[0]; }
  state.bases[0] = batter;
}

function handleHitAndRunContact(state, batter, pitcher, adjBatter) {
  const cr = adjBatter.contact / 10, pr = adjBatter.power / 10;
  const defenders = getDefensivePlayers(state);
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1, doubleMod = wx.doubleMod || 1;
  const pn = { '1B':'first','2B':'second','3B':'third',SS:'shortstop',SP:'the pitcher',C:'the catcher',LF:'left',CF:'center',RF:'right' };
  if (Math.random() < 0.18) { if (state.strikes < 2) state.strikes++; state.hitAndRun = true; state.log.push({ type: 'foul', text: `${batter.name} fouls it off on the hit-and-run — runner holds` }); return; }
  batter.gameStats.ab++;
  const effP = getEffectivePitcher(state) || pitcher;
  let hc = 0.18 + cr * 0.28; hc -= (pitcher.offSpeed / 10) * 0.07 + (effP.effectivePitchSpeed || effP.pitchSpeed) / 10 * 0.05; hc = Math.max(0.08, Math.min(hc, 0.68));
  if (Math.random() < hc) {
  batter.gameStats.hits++; pitcher.gameStats.h++;
  const hrr = Math.random();
  if (hrr < pr * 0.065 * hrMod) { batter.gameStats.hr++; advanceRunners(state, 4, batter); const hrText = `💥 ${batter.name} crushes one on the hit-and-run — HOME RUN!`; state.log.push({ type: 'homerun', text: hrText }); state.lastPlay = { type: 'homerun', text: hrText }; }
  else if (hrr < pr * 0.32 * doubleMod) { advanceRunners(state, 2, batter, true); const e = advanceHitAndRunRunners(state, batter); const dblText = e ? `${batter.name} rips a double on the hit-and-run! ${e}` : `${batter.name} doubles on the hit-and-run!`; state.log.push({ type: 'double', text: dblText }); state.lastPlay = { type: 'double', text: dblText }; }
  else { advanceRunners(state, 1, batter, true); const e = advanceHitAndRunRunners(state, batter); const sglText = e ? `${batter.name} slaps a single — hit-and-run! ${e}` : `${batter.name} singles on the hit-and-run!`; state.log.push({ type: 'single', text: sglText }); state.lastPlay = { type: 'single', text: sglText }; }
  } else {
    const orr = Math.random();
    if (orr < 0.45) { const gps = ['SS','2B','3B','SP','1B']; const gp = gps[Math.floor(Math.random() * gps.length)]; let sn = []; for (let i = 2; i >= 0; i--) { const r = state.bases[i]; if (!r) continue; if (i + 1 >= 3) { r.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; sn.push(r.name.split(' ').pop()); state.bases[i] = null; } else if (!state.bases[i + 1]) { state.bases[i + 1] = r; state.bases[i] = null; } } const goText = `${batter.name} grounds out to ${pn[gp]}${sn.length ? ` — ${sn.join(', ')} scores` : ''} — runners advance on the hit-and-run`; state.log.push({ type: 'groundout', text: goText }); state.lastPlay = { type: 'groundout', text: goText }; recordOut(state); }
    else if (orr < 0.68) { const fpk = ['LF','CF','RF']; const fp = fpk[Math.floor(Math.random() * fpk.length)]; const dr = Math.random(); const isD = dr < 0.35, isS = dr > 0.65; const dl = isD ? 'deep ' : isS ? 'shallow ' : ''; const foText = `${batter.name} flies out to ${dl}${pn[fp]}`; state.log.push({ type: 'flyout', text: foText }); state.lastPlay = { type: 'flyout', text: foText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; if (isD && i === 2 && state.outs < 3) { const tc = 0.15 + (r.speed / 10) * 0.40; if (Math.random() < tc) { r.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; state.bases[i] = null; batter.gameStats.ab--; state.log.push({ type: 'sacfly', text: `${r.name} tags and scores on the deep fly!` }); } } else if (isS && state.outs < 3) { let ct = false, tb = ''; if (fp === 'RF' && i <= 1) { ct = true; tb = i === 0 ? 'first' : 'second'; } else if (fp === 'CF' && i === 1) { ct = true; tb = 'second'; } else if (fp === 'LF' && i >= 1) { ct = true; tb = i === 1 ? 'second' : 'third'; } if (ct) { const ofa = (defenders[fp]?.arm || 5) / 10; if (Math.random() < Math.max(0.05, Math.min(0.18 + ofa * 0.25 - (r.speed / 10) * 0.12, 0.50))) { state.bases[i] = null; state.log.push({ type: 'info', text: `❌ ${r.name} can't get back to ${tb} — doubled off on the hit-and-run!` }); recordOut(state); break; } } } } } }
    else if (orr < 0.88) { const lpk = ['3B','SS','1B','2B']; const lp = lpk[Math.floor(Math.random() * lpk.length)]; const f = defenders[lp]; const loText = `${batter.name} lines out to ${f?.name || pn[lp]}!`; state.log.push({ type: 'lineout', text: loText }); state.lastPlay = { type: 'lineout', text: loText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const doc = 0.50 + ((f?.arm || 5) / 10) * 0.15 - (r.speed / 10) * 0.10; if (state.outs < 3 && Math.random() < Math.max(0.25, Math.min(doc, 0.75))) { state.bases[i] = null; state.log.push({ type: 'info', text: `❌ ${r.name} doubled off ${['first','second','third'][i]} — caught on the hit-and-run!` }); recordOut(state); break; } } } }
    else { const ppk = ['C','2B','3B']; const pp = ppk[Math.floor(Math.random() * ppk.length)]; const f = defenders[pp]; const poText = `${batter.name} pops out to ${f?.name || pn[pp]} — runners hold on the hit-and-run`; state.log.push({ type: 'popout', text: poText }); state.lastPlay = { type: 'popout', text: poText }; recordOut(state); }
  }
  state.balls = 0; state.strikes = 0; advanceBatter(state);
}

function advanceHitAndRunRunners(state, batter) {
  let er = 0; const av = [];
  for (let i = 2; i >= 0; i--) { const r = state.bases[i]; if (!r || r.name === batter.name) continue; if (i + 1 >= 3) { r.gameStats.runs++; scoreRun(state); er++; state.bases[i] = null; av.push(`${r.name.split(' ').pop()} scores`); } else if (!state.bases[i + 1]) { state.bases[i + 1] = r; state.bases[i] = null; av.push(`${r.name.split(' ').pop()} to ${i + 1 === 2 ? 'third' : 'second'}`); } }
  if (er > 0) batter.gameStats.rbi += er;
  const r3 = state.bases[2], b1 = state.bases[0];
  if (b1 && b1.name === batter.name && r3 && !state.bases[1]) { const d = getDefensivePlayers(state); const oa = getOutfieldArm(d); const sc = 0.10 + (r3.speed / 10) * 0.35 - (oa / 10) * 0.08 + (batter.speed / 10) * 0.12; if (Math.random() < Math.max(0.03, Math.min(sc, 0.45))) { state.bases[1] = batter; state.bases[0] = null; av.push(`${batter.name.split(' ').pop()} takes second on the throw`); } }
  return av.length > 0 ? av.join(', ') : null;
}

function handleHitAndRunCaught(state) {
  for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const cc = 0.50 - (r.speed / 10) * 0.30; if (Math.random() < cc) { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; recordOut(state); const tb = i + 1; const bn = tb === 1 ? 'second' : tb === 2 ? 'third' : 'home'; state.log.push({ type: 'info', text: `❌ ${r.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, bn)} on the hit-and-run!` }); break; } else { if (i + 1 < 3) { state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, ['second','third'][i])} on the hit-and-run!` }); } } }
  state.hitAndRun = false;
}

function handleHitAndRunMiss(state) {
  for (let i = 0; i < 2; i++) { const r = state.bases[i]; if (!r || state.bases[i + 1]) continue; const d = getDefensivePlayers(state); const ca = getCatcherArm(d); const sc = 0.20 + (r.speed / 10) * 0.55 - (ca / 10) * 0.12; if (Math.random() < Math.max(0.10, Math.min(sc, 0.75))) { r.gameStats.sb = (r.gameStats.sb || 0) + 1; state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, i === 0 ? 'second' : 'third')} on the hit-and-run` }); } else { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; state.log.push({ type: 'info', text: `❌ ${r.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, i === 0 ? 'second' : 'third')} on the hit-and-run!` }); recordOut(state); } break; }
}

function runInjuryChecks(newState, batter) {
  const lp = newState.lastPlay; if (!lp) return;
  switch (lp.type) {
    case 'walk': if (lp.text?.includes('hit by the pitch')) { const r = checkPlayInjury(newState, 'hit_by_pitch', batter.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
    case 'steal': { const rn = newState.bases.find(b => b && b.name !== batter.name) || batter; const r = checkPlayInjury(newState, 'steal_success', rn.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
    case 'caughtstealing': { const rn = newState.bases.find(b => b) || batter; const r = checkPlayInjury(newState, 'steal_attempt', rn.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
    case 'homerun': { const r = checkPlayInjury(newState, 'homerun', batter.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
    case 'single': case 'double': case 'triple': { const r = checkPlayInjury(newState, 'sprint_to_first', batter.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
    case 'error': { const r = checkPlayInjury(newState, 'sprint_to_first', batter.name); if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); } } break;
  }
}

function applyInjuryState(newState, injuryResult) {
  if (!injuryResult) return;
  // Scares or minor injuries that stay in don't need substitution
  if (injuryResult.isScare || injuryResult.severity === 'MINOR') return;
  const pn = injuryResult.player;
  const ai = newState.awayLineup.findIndex(p => p.name === pn), hi = newState.homeLineup.findIndex(p => p.name === pn);
  const isA = ai >= 0; const tl = isA ? newState.awayLineup : newState.homeLineup; const ti = isA ? ai : hi;
  const tk = isA ? newState.awayTeam : newState.homeTeam; const td = TEAMS[tk];
  const bench = td?.bench || []; const bp2 = isA ? newState.awayBullpen : newState.homeBullpen;
  if (tl && ti >= 0) {
    const ip = tl[ti]; const iPs = ip.pos === 'SP' || ip.pos === 'RP' || ip.pos === 'CL' || (ip.assignedPos && ['SP','RP','CL'].includes(ip.assignedPos));
    const iCb = (isA && newState.awayBatterIndex % newState.awayLineup.length === ti) || (!isA && newState.homeBatterIndex % newState.homeLineup.length === ti);
    const hk = isA ? 'awayPlayerHistory' : 'homePlayerHistory';
    if (!newState[hk].find(p => p.name === pn)) newState[hk].push({ ...ip, injured: true, injuryType: injuryResult.severity, injuryName: injuryResult.injury.name });
    let bo = []; if (iPs && bp2.length > 0) bo = [...bp2].map(rp => ({ ...rp, pos: 'RP', reason: 'reliever' })); else if (bench.length > 0) bo = [...bench];
    if (bo.length > 0) { newState._pendingInjury = { ...injuryResult, isPitcher: iPs, isCurrentBatter: iCb, oldPos: ip.assignedPos || ip.pos, benchOptions: bo, isAway: isA, targetIdx: ti, injuryType: injuryResult.severity }; tl[ti] = { ...ip, injured: true, injuryType: injuryResult.severity, injuryName: injuryResult.injury.name, _injured: true }; }
    else { tl[ti] = { ...ip, injured: true, injuryType: injuryResult.severity, injuryName: injuryResult.injury.name }; newState.log.push({ type: 'info', text: `🚑 ${pn} injured — no bench replacements available!` }); }
  }
  if (newState.homePitcher?.name === pn && newState.homePitcher && !newState.homePitcher.injured) newState.homePitcher = { ...newState.homePitcher, injured: true, injuryType: injuryResult.severity };
  if (newState.awayPitcher?.name === pn && newState.awayPitcher && !newState.awayPitcher.injured) newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryType: injuryResult.severity };
}

export function processAtBat(state, pitchType, swingType) {
  const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
  const newState = JSON.parse(JSON.stringify(state));

  // ── Reach Back: specialty pitch — near-automatic strike ──
  const isReachBack = pitchType && (pitchType.name === '__reachback__' || pitchType === '__reachback__');
  if (isReachBack) {
    const pitcher = getCurrentPitcher(newState);
    // Reset reach-back counter when a different pitcher takes the mound
    if (newState._reachBackPitcher !== pitcher.name) {
      newState._reachBackUses = 0;
      newState._reachBackPitcher = pitcher.name;
    }
    newState._reachBackUses = (newState._reachBackUses || 0) + 1;
    newState._wasReachBack = true;
    pitcher.gameStats.pitches++;
    const batter = getCurrentBatter(newState);
    // Specialty pitch: 95% strike, 85% chance of inducing weak contact or whiff
    // Use pitcher's specialty name for the pitch, not raw "Reach Back"
    const spName = (pitcher.specialty?.name || pitcher.specialty) || 'blazing heater';
    newState.pitchResult = { pitchType: spName, isStrike: Math.random() < 0.95, location: 'on the black', isReachBack: true };
    if (!newState.userPitchTypes) newState.userPitchTypes = [];
    if (!newState.userPitchTypes.includes('__reachback__')) newState.userPitchTypes = [...newState.userPitchTypes, '__reachback__'];
    if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) { const sr = attemptSteal(newState, newState.pendingSteal); Object.assign(newState, sr); if (newState.gameOver) return newState; }
    const bjb = getCurrentBatter(newState);
    // Boosted pitch: effective 10s across the board for this pitch
    const boostedPitcher = { ...pitcher, effectivePitchSpeed: 10, effectiveControl: 10, effectiveOffSpeed: 10 };
    const origPitcher = { ...pitcher };
    // Snapshot the half-inning before resolveSwing — it may flip if 3 outs occur
    const pitchHalf = newState.halfInning;
    // Temporarily replace the pitcher for boosted ratings
    if (pitchHalf === 'top') newState.homePitcher = boostedPitcher;
    else newState.awayPitcher = boostedPitcher;
    resolveSwing(newState, swingType, newState.pitchResult);
    // Restore original pitcher using the SAVED half-inning (resolveSwing may have flipped it)
    if (!newState.gameOver) {
      if (pitchHalf === 'top') newState.homePitcher = origPitcher;
      else newState.awayPitcher = origPitcher;
    }
    if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); }
    if (!newState.gameOver) runInjuryChecks(newState, bjb);
    if (!newState.gameOver && !newState.lastInjury) { const pi = checkPitcherInjury(newState); if (pi) { newState.lastInjury = pi; applyInjuryState(newState, pi); newState.log.push({ type: 'injury', text: `🚑 ${pi.commentary}` }); } }
    return newState;
  }

  if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) { const sr = attemptSteal(newState, newState.pendingSteal); Object.assign(newState, sr); if (newState.gameOver) return newState; if (sr.lastPlay?.type === 'caughtstealing') return newState; }
  // Clear reach-back flag — it was consumed by the last render
  delete newState._wasReachBack;
  const pitcher = getCurrentPitcher(newState), effP = getEffectivePitcher(newState) || pitcher;
  const batter = getCurrentBatter(newState);
  const wc = Math.max(0.01, (10 - (effP.effectiveControl || effP.control)) * 0.005);
  if (Math.random() < wc) { batter.gameStats.bb++; pitcher.gameStats.bb++; pitcher.gameStats.pitches += 4; newState.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); newState.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(newState, batter); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off walk! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } return newState; }
  newState.pitchResult = resolvePitch(newState, pitchType);
  if (!newState.userPitchTypes) newState.userPitchTypes = [];
  if (!newState.userPitchTypes.includes(pitchType.name)) newState.userPitchTypes = [...newState.userPitchTypes, pitchType.name];
  if (newState.pitchResult.isWildPitch) { if (newState.balls >= 4) { const wb = getCurrentBatter(newState); wb.gameStats.bb++; getCurrentPitcher(newState).gameStats.bb++; newState.log.push({ type: 'walk', text: `${wb.name} walks on a wild pitch!` }); handleWalk(newState, wb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); } return newState; }
  if (newState.pitchResult.isHBP) { const hb = getCurrentBatter(newState); hb.gameStats.bb++; getCurrentPitcher(newState).gameStats.bb++; newState.log.push({ type: 'walk', text: `${hb.name} is hit by the pitch!` }); newState.lastPlay = { type: 'walk', text: `${hb.name} is hit by the pitch! — takes first` }; handleWalk(newState, hb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off HBP! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } return newState; }
  const bjb = getCurrentBatter(newState);
  resolveSwing(newState, swingType, newState.pitchResult);
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); }
  if (!newState.gameOver) runInjuryChecks(newState, bjb);
  if (!newState.gameOver && !newState.lastInjury) { const pi = checkPitcherInjury(newState); if (pi) { newState.lastInjury = pi; applyInjuryState(newState, pi); newState.log.push({ type: 'injury', text: `🚑 ${pi.commentary}` }); } }
  return newState;
}

export function cpuSelectPitch(state) {
  const p = getCurrentPitcher(state); const pitches = p.pitches || DEFAULT_PITCHES; const rand = Math.random();
  if (p.pitchSpeed >= 7 && rand < 0.35 && pitches.includes("Fastball")) return "Fastball";
  const bps = pitches.filter(x => ["Breaking Ball","Knuckleball","Screwball","Split-Finger"].includes(x));
  if (p.offSpeed >= 7 && rand < 0.50 && bps.length > 0) return bps[Math.floor(Math.random() * bps.length)];
  if (p.offSpeed >= 6 && rand < 0.55 && pitches.includes("Changeup")) return "Changeup";
  return pitches[Math.floor(Math.random() * pitches.length)] || "Fastball";
}

export function cpuSelectSwing(state) {
  const b = getCurrentBatter(state); const adj = getSituationalBatter(state); const rand = Math.random();
  if (state.strikes === 2) return rand < 0.75 ? 1 : 0;
  if (state.balls === 3) return rand < 0.45 ? 3 : 1;
  if (state.balls >= 2 && state.strikes === 0) { if (rand < 0.35) return 3; }
  if (adj.power >= 8 && rand < 0.30) return 2;
  if (adj.contact >= 8 && rand < 0.45) return 1;
  if (rand < 0.45) return 0; if (rand < 0.70) return 1; return 0;
}

export function getSituationalBatter(state) {
  const b = getCurrentBatter(state); const p = getCurrentPitcher(state);
  const adj = getSplitAdjustedPlayer(b, p.throws);
  const isHome = getBattingTeam(state) === 'home'; const isDay = state.weather?.isDay ?? true;
  const hcm = isHome ? 1.03 : 0.98, hpm = isHome ? 1.03 : 0.97;
  const dcm = isDay ? 1.02 : 0.99, dpm = isDay ? 1.01 : 1.00;
  return { ...adj, contact: Math.max(1, Math.min(10, Math.round(adj.contact * hcm * dcm))), power: Math.max(1, Math.min(10, Math.round(adj.power * hpm * dpm))) };
}

function getSplitAdjustedPlayer(player, pitcherHand) {
  if (!player.splits || !pitcherHand) return player;
  const split = pitcherHand === 'L' ? player.splits.vsLHP : player.splits.vsRHP; if (!split || split.ab < 20) return player;
  const vl = player.splits.vsLHP, vr = player.splits.vsRHP; const ta = vl.ab + vr.ab, th = vl.ba * vl.ab + vr.ba * vr.ab;
  const oBA = ta > 0 ? th / ta : 0.250, tHR = vl.hr + vr.hr, oHRR = ta > 0 ? tHR / ta : 0.020;
  const baR = oBA > 0 ? split.ba / oBA : 1;
  const ac = Math.max(1, Math.min(10, Math.round(player.contact * baR)));
  const sHRR = split.ab > 0 ? split.hr / split.ab : 0, hRR = oHRR > 0 ? sHRR / oHRR : 1;
  const cHRR = Math.max(0.4, Math.min(hRR, 1.8));
  return { ...player, contact: ac, power: Math.max(1, Math.min(10, Math.round(player.power * cHRR))) };
}

// --- INTENTIONAL WALK ---
export function intentionalWalk(state) {
  const newState = JSON.parse(JSON.stringify(state));
  const batter = getCurrentBatter(newState), pitcher = getCurrentPitcher(newState);
  batter.gameStats.bb++; pitcher.gameStats.bb++; pitcher.gameStats.pitches += 4;
  const msg = `${batter.name} — ${pickLine(INTENTIONAL_WALK_LINES)}`;
  newState.log.push({ type: 'walk', text: msg }); newState.lastPlay = { type: 'walk', text: msg };
  handleWalk(newState, batter); newState.balls = 0; newState.strikes = 0;
  advanceBatter(newState); return newState;
}

// --- CPU SUBSTITUTION LOGIC ---
export function cpuDecideSubstitutions(state, userTeam = 'home') {
  const newState = JSON.parse(JSON.stringify(state));
  if (newState.gameOver) return newState;
  const cpuSide = newState.homeTeam === userTeam ? 'away' : 'home';
  const cpuBattingSide = newState.halfInning === 'top' ? 'away' : 'home';
  const isCpuBatting = cpuBattingSide === cpuSide;

  if (isCpuBatting) {
    const cpuLineup = cpuSide === 'away' ? newState.awayLineup : newState.homeLineup;
    const cpuBench = TEAMS[cpuSide === 'away' ? newState.awayTeam : newState.homeTeam]?.bench;
    const inning = newState.inning, cpuScore = newState.score[cpuSide];
    const otherTeam = cpuSide === 'away' ? 'home' : 'away', trailing = cpuScore < newState.score[otherTeam];
    if (inning >= 7 && trailing && cpuBench && cpuBench.length > 0) {
      const batterIdx = cpuSide === 'away' ? newState.awayBatterIndex : newState.homeBatterIndex;
      const batter = cpuLineup[batterIdx % cpuLineup.length];
      const pitcherSpot = batter.assignedPos === 'SP' || batter.pos === 'SP';
      if (pitcherSpot) {
        const bestHitter = [...cpuBench].sort((a, b) => b.contact - a.contact)[0];
        const afterPH = pinchHit(newState, { ...bestHitter });
        if (cpuSide === 'away') {
          newState.awayLineup = afterPH.awayLineup; newState.awayBatterIndex = afterPH.awayBatterIndex;
          if (!newState.awayPlayerHistory) newState.awayPlayerHistory = [];
          afterPH.awayPlayerHistory?.forEach(p => { if (!newState.awayPlayerHistory.find(h => h.name === p.name)) newState.awayPlayerHistory.push(p); });
          if (!newState.awayBenchUsed) newState.awayBenchUsed = [];
          afterPH.awayBenchUsed?.forEach(p => { if (!newState.awayBenchUsed.find(h => h.name === p.name)) newState.awayBenchUsed.push(p); });
          newState.log = afterPH.log;
        } else {
          newState.homeLineup = afterPH.homeLineup; newState.homeBatterIndex = afterPH.homeBatterIndex;
          if (!newState.homePlayerHistory) newState.homePlayerHistory = [];
          afterPH.homePlayerHistory?.forEach(p => { if (!newState.homePlayerHistory.find(h => h.name === p.name)) newState.homePlayerHistory.push(p); });
          if (!newState.homeBenchUsed) newState.homeBenchUsed = [];
          afterPH.homeBenchUsed?.forEach(p => { if (!newState.homeBenchUsed.find(h => h.name === p.name)) newState.homeBenchUsed.push(p); });
          newState.log = afterPH.log;
        }
      } else if (batter.contact <= 3 && inning >= 8) {
        const bestHitter = [...cpuBench].sort((a, b) => b.contact - a.contact)[0];
        if (bestHitter.contact > batter.contact + 1) {
          const afterPH2 = pinchHit(newState, { ...bestHitter });
          if (cpuSide === 'away') {
            newState.awayLineup = afterPH2.awayLineup; newState.awayBatterIndex = afterPH2.awayBatterIndex;
            if (!newState.awayPlayerHistory) newState.awayPlayerHistory = [];
            afterPH2.awayPlayerHistory?.forEach(p => { if (!newState.awayPlayerHistory.find(h => h.name === p.name)) newState.awayPlayerHistory.push(p); });
            if (!newState.awayBenchUsed) newState.awayBenchUsed = [];
            afterPH2.awayBenchUsed?.forEach(p => { if (!newState.awayBenchUsed.find(h => h.name === p.name)) newState.awayBenchUsed.push(p); });
            newState.log = afterPH2.log;
          } else {
            newState.homeLineup = afterPH2.homeLineup; newState.homeBatterIndex = afterPH2.homeBatterIndex;
            if (!newState.homePlayerHistory) newState.homePlayerHistory = [];
            afterPH2.homePlayerHistory?.forEach(p => { if (!newState.homePlayerHistory.find(h => h.name === p.name)) newState.homePlayerHistory.push(p); });
            if (!newState.homeBenchUsed) newState.homeBenchUsed = [];
            afterPH2.homeBenchUsed?.forEach(p => { if (!newState.homeBenchUsed.find(h => h.name === p.name)) newState.homeBenchUsed.push(p); });
            newState.log = afterPH2.log;
          }
        }
      }
    }
    return newState;
  }

  const cpuPitchingSide = newState.halfInning === 'top' ? 'home' : 'away';
  if (cpuPitchingSide !== cpuSide) return newState;
  const cpuBullpen = cpuSide === 'away' ? newState.awayBullpen : newState.homeBullpen;
  const cpuLineupField = cpuSide === 'away' ? newState.awayLineup : newState.homeLineup;
  const cpuPitcherField = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const hasDH = !!newState.useDH;
  const pitcherInLineup = cpuLineupField.some(p => p.name === cpuPitcherField.name);
  if (!hasDH && !pitcherInLineup) {
    const oldP = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
    // Don't replace the pitcher just because he's not in the lineup — that can happen
    // transiently. Only replace if he's been subbed out (in playerHistory) or is a fresh
    // reliever we need to re-add. Otherwise just re-insert him into the lineup.
    const hk2 = cpuPitchingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    const isInHistory = (newState[hk2] || []).some(p => p.name === oldP.name);
    if (!isInHistory) {
      // Pitcher is still in the game, just missing from lineup — re-add him
      let si2 = cpuLineupField.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si2 >= 0) {
        cpuLineupField[si2] = { ...oldP, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      } else if (cpuLineupField.length < 10) {
        cpuLineupField.push({ ...oldP, order: cpuLineupField.length + 1, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } });
      }
      return newState;
    }
    // Pitcher was subbed out — replace with bullpen arm
    if (cpuBullpen.length > 0) {
      const sorted = [...cpuBullpen].sort((a, b) => b.control - a.control);
      const newPitcher = sorted[0], newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
      if (cpuPitchingSide === 'home') newState.homePitcher = newP; else newState.awayPitcher = newP;
      const bpi2 = cpuBullpen.findIndex(p => p.name === newPitcher.name); if (bpi2 >= 0) cpuBullpen.splice(bpi2, 1);
      if (!newState[hk2].find(p => p.name === oldP.name)) newState[hk2].push({ ...oldP });
      let si2 = cpuLineupField.findIndex(p => p.order === oldP.order);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p.name === oldP.name);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si2 >= 0) {
        const le2 = { ...newPitcher, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        cpuLineupField[si2] = le2;
      } else if (cpuLineupField.length < 10) {
        cpuLineupField.push({ ...newPitcher, order: cpuLineupField.length + 1, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } });
      }
      newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldP.name} on the mound (pinch-hit for earlier)` });
    }
    return newState;
  }

  const cpuPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const ip = cpuPitcher.gameStats.ip || 0, bbi = cpuPitcher.gameStats.bb || 0, runs = cpuPitcher.gameStats.r || 0;
  const inning = newState.inning, stamina = cpuPitcher.stamina || 5;
  const isReliever = ['RP','CL'].includes(cpuPitcher.pos) || ['RP','CL'].includes(cpuPitcher.assignedPos);
  const maxInnings = isReliever ? stamina * 0.4 : stamina * 0.7;
  const fatiguePull = ip >= maxInnings + 0.5, walksPull = bbi >= 5, blowupPull = inning < 6 && runs >= 5;
  const cpuScore = newState.score[cpuPitchingSide], userScore = newState.score[cpuBattingSide];
  const lateClose = inning >= 7 && Math.abs(cpuScore - userScore) <= 2 && ip >= 2;
  const recentCollapse = (runs >= 2 && bbi >= 2 && inning >= 5), severeFatigue = ip >= maxInnings + 2;
  const shouldChange = (severeFatigue || fatiguePull || walksPull || blowupPull || lateClose || recentCollapse) && cpuBullpen.length > 0;
  if (shouldChange) {
    // Bullpen management: don't waste closer in blowouts (trailing by 4+)
    const trailing = cpuScore < userScore;
    const bigDeficit = Math.abs(cpuScore - userScore) >= 4;
    let candidates;
    if (trailing && bigDeficit && inning <= 7) {
      // Mop-up duty — exclude closers, use worst available (inverted sort)
      candidates = [...cpuBullpen].filter(p => p.pos !== 'CL').sort((a, b) => a.control - b.control);
      if (candidates.length === 0) candidates = [...cpuBullpen].sort((a, b) => a.control - b.control);
    } else {
      // Normal: best pitcher first
      candidates = [...cpuBullpen].sort((a, b) => b.control - a.control);
    }
    const newPitcher = candidates[0];
    const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
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
      if (si >= 0) {
        const en = { ...newPitcher, order: fl[si].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        fl[si] = en;
      }
    }
    const reason = severeFatigue ? 'completely gassed' : fatiguePull ? `${ip} innings — arm is tiring` : walksPull ? 'lost command' : blowupPull ? 'rough outing' : 'high-leverage situation';
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound (${reason})` });
  }
  return newState;
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };