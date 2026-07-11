// gameEngineHelpers.js - Core helpers, state creation, and scoring infrastructure.
// Extracted from gameEngine.js. No circular dependencies.

import { TEAMS, DEFAULT_PITCHES, PLAYER_ERRORS } from './gameData';
import { initializePitcherComposure, calculateLeverage, applyEventDelta, recoverComposure, getBehaviorZone, BEHAVIOR_ZONES } from './pitcherComposure';
import { rollComposureEvent } from './composureEvents';
import { logRun } from './pitcherDecisions';
import { HOLDING_GAME_RATES, decideBalk, fillHoldingTemplate, pickHoldingLine, BALK_LINES } from './holdingGame';
import { deepCopyState } from './deepCopyState';
import { calculateSituationalRatings } from './situationalRatings';
import { getEffectivePitcher } from './pitcherFatigue';
import { chargeRun, tagRunnerResponsiblePitcher } from './runScoring';
import { END_INNING_LINES, WALK_LINES, INTENTIONAL_WALK_LINES, pickLine } from './commentaryLines';
import { decayTension } from './beanball';

export { TEAM_IDS } from './gameData';

export function createGameState(homeTeam, awayTeam, customHomeLineup, customAwayLineup, useDH = false, weather = null, umpire = null, startingPitcher = null, opponentStartingPitcher = null) {
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];
  const buildLineup = (lineupData, defaultLineup, teamData, spName) => {
    if (lineupData && lineupData.length >= 9) {
      return lineupData.slice(0, 9).map((p, i) => ({
        ...p, order: i + 1, assignedPos: p.assignedPos || p.pos,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
      }));
    }
    let lineup = defaultLineup.map((p, i) => ({
      ...p, order: i + 1, assignedPos: p.pos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
    }));
    if (useDH && lineup.length < 9 && teamData?.bench?.length > 0) {
      lineup.push({ ...teamData.bench[0], pos: 'DH', assignedPos: 'DH', defense: 0, arm: 0,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
        order: lineup.length + 1 });
    }
    if (!useDH) {
      lineup = lineup.filter(p => p.pos !== 'DH');
      if (teamData?.rotation?.length > 0) {
        const starterName = spName || teamData.rotation[0].name;
        const spPlayer = teamData.rotation.find(p => p.name === starterName) || (teamData.bullpen || []).find(p => p.name === starterName) || teamData.rotation[0];
        if (!lineup.find(p => p.name === starterName)) {
          lineup.push({ ...spPlayer, assignedPos: 'SP',
            gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 },
            order: lineup.length + 1 });
        }
      }
    }
    return lineup;
  };
  const enforceNineBatters = (lineup, teamData, startingSPName) => {
    let result = [...lineup];
    if (result.length > 9) result = result.slice(0, 9);
    while (result.length < 9 && teamData?.bench?.length > 0) {
      const nextBench = teamData.bench.find(b => !result.some(p => p.name === b.name));
      if (!nextBench) break;
      result.push({ ...nextBench, assignedPos: nextBench.assignedPos || nextBench.pos || 'DH', order: result.length + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } });
    }
    if (!useDH && teamData?.rotation?.length > 0) {
      const spName = startingSPName || teamData.rotation[0].name;
      const spCount = result.filter(p => p.name === spName).length;
      if (spCount === 0) {
        const spPlayer = teamData.rotation.find(p => p.name === spName) || (teamData.bullpen || []).find(p => p.name === spName) || teamData.rotation[0];
        result.push({ ...spPlayer, assignedPos: 'SP', order: result.length + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } });
      } else if (spCount > 1) {
        let seen = false;
        result = result.filter(p => { if (p.name === spName) { if (seen) return false; seen = true; } return true; });
      }
    }
    result.forEach((p, i) => { p.order = i + 1; });
    if (result.length !== 9) console.warn(`Lineup built with ${result.length} players - expected 9`);
    return result;
  };
  const homeLineup = enforceNineBatters(buildLineup(customHomeLineup, home.lineup, home, startingPitcher?.name), home, startingPitcher?.name);
  let awayLineup = enforceNineBatters(buildLineup(customAwayLineup, away.lineup, away, opponentStartingPitcher?.name), away, opponentStartingPitcher?.name);
  const awaySPOverride = opponentStartingPitcher ? away.rotation.find(p => p.name === opponentStartingPitcher.name) : null;
  if (awaySPOverride && !useDH) {
    const spIdx = awayLineup.findIndex(p => p.assignedPos === 'SP');
    if (spIdx >= 0) awayLineup[spIdx] = { ...awaySPOverride, order: awayLineup[spIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
  }
  const homeSPOverride = startingPitcher ? home.rotation.find(p => p.name === startingPitcher.name) : null;
  if (homeSPOverride && !useDH) {
    const spIdx = homeLineup.findIndex(p => p.assignedPos === 'SP');
    if (spIdx >= 0) homeLineup[spIdx] = { ...homeSPOverride, order: homeLineup[spIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0, doubles: 0, triples: 0 } };
  }
  const homeSP = homeLineup.find(p => p.assignedPos === 'SP') || (useDH && startingPitcher ? startingPitcher : home.rotation[0]);
  const awaySP = awayLineup.find(p => p.assignedPos === 'SP') || awaySPOverride || away.rotation[0];
  return {
    homeTeam, awayTeam, inning: 1, halfInning: 'top', outs: 0, balls: 0, strikes: 0,
    bases: [null, null, null], score: { home: 0, away: 0 },
    innings: Array(9).fill(null).map(() => ({ home: null, away: null })),
    homeLineup, awayLineup,
    homeRotation: [...home.rotation], awayRotation: [...away.rotation],
    homeBullpen: home.bullpen.map(p => ({ ...p })), awayBullpen: away.bullpen.map(p => ({ ...p })),
    homeBenchUsed: [], awayBenchUsed: [],
    homePitcher: createPitcherState(homeSP), awayPitcher: createPitcherState(awaySP),
    homeBatterIndex: 0, awayBatterIndex: 0, log: [],
    gameOver: false, waitingForInput: true, lastPlay: null, pitchResult: null,
    hitAndRun: false, pendingSteal: null,
    weather: weather || null, umpire: umpire || null,
    useDH: !!useDH,
    homePlayerHistory: [], awayPlayerHistory: [],
    runLog: [],
  };
}

export function createPitcherState(p) {
  const archetype = p.temperament || 'PROFESSIONAL';
  return { ...p, pitchCount: 0, pitches: p.pitches || DEFAULT_PITCHES,
    gameStats: { ip: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 },
    _composure: initializePitcherComposure(p, archetype) };
}

export function applyComposure(pitcher, state, eventType) {
  if (pitcher && pitcher._composure) {
    const leverage = calculateLeverage(state.inning, state);
    const { newComposure } = applyEventDelta(pitcher._composure, eventType, leverage);
    pitcher._composure.composure = newComposure;
  }
}

export function applyComposureFromLastPlay(state, pitcher) {
  const lp = state.lastPlay;
  if (!lp || !lp.type) return;
  const typeMap = { walk: lp.isHBP ? 'hbp' : 'walk', strikeout: 'strikeout', single: 'single', double: 'double', triple: 'triple', homerun: 'homerun', groundout: 'out', flyout: 'out', lineout: 'out', popout: 'out', doubleplay: 'doubleplay', sacfly: 'sacfly', error: 'error', fc: 'out', caughtstealing: 'caughtstealing', steal: 'steal', strike: 'strike', ball: 'ball', foul: 'foul' };
  const eventType = typeMap[lp.type];
  if (eventType) applyComposure(pitcher, state, eventType);
}

export function processComposureEvents(state, pitcher) {
  const event = rollComposureEvent(state, pitcher);
  if (!event) return;
  switch (event.action) {
    case 'minor':
      state.log.push({ type: 'info', text: `😤 ${event.text}` });
      state._celebrationBubble = `😤 ${event.text}`;
      break;
    case 'argument':
      state.log.push({ type: 'ejection', text: `🟥 ${event.text}` });
      if (event.alreadyWarned) {
        const pitchingSide = state.homePitcher?.name === pitcher.name ? 'home' : 'away';
        state[pitchingSide === 'home' ? '_homePitcherEjected' : '_awayPitcherEjected'] = true;
        state[pitchingSide === 'home' ? '_homeManagerEjected' : '_awayManagerEjected'] = true;
        state._pendingEjectionReplacement = true;
        if (!state._beanball) state._beanball = {};
        state._beanball.autoEjectionPitcher = pitcher.name;
        state._beanball.autoEjectionSide = pitchingSide;
        state.log.push({ type: 'ejection', text: `🟥 ${pitcher.name} is EJECTED for arguing! The manager is tossed too!` });
      }
      state._celebrationBubble = `🟥 ${event.text}`;
      break;
    case 'throwat':
      if (!state._beanball) state._beanball = {};
      state._beanball.tension = Math.min(100, (state._beanball.tension || 0) + 25);
      state.log.push({ type: 'info', text: `⚡ ${event.text}` });
      state._celebrationBubble = `⚡ ${event.text}`;
      break;
    case 'walkoff':
      pitcher._composure.composure = Math.max(0, pitcher._composure.composure - event.dropAmount);
      state.log.push({ type: 'info', text: `😤 ${event.text}` });
      state._celebrationBubble = `😤 ${event.text}`;
      break;
    case 'wildpitch':
      if (event.hasRunners) {
        let scored = null;
        for (let i = 2; i >= 0; i--) {
          if (state.bases[i]) {
            if (i + 1 >= 3) {
              chargeRun(state, state.bases[i]);
              scored = state.bases[i];
              state.bases[i] = null;
            } else if (!state.bases[i + 1]) {
              state.bases[i + 1] = state.bases[i];
              state.bases[i] = null;
            }
          }
        }
        const desc = scored ? `${event.text} ${scored.name.split(' ').pop()} scores!` : `${event.text} Runners advance!`;
        state.log.push({ type: 'error', text: desc });
      } else {
        state.log.push({ type: 'info', text: `⚡ ${pitcher.name} spikes one into the dirt - no damage done.` });
      }
      break;
  }
}

export const POSITION_GROUPS = { C: 'C', '1B': 'IF', '2B': 'IF', '3B': 'IF', SS: 'IF', LF: 'OF', CF: 'OF', RF: 'OF', DH: 'DH', OF: 'OF', INF: 'IF' };

export function normalizePosGroup(pos) {
  if (!pos) return null;
  if (POSITION_GROUPS[pos]) return POSITION_GROUPS[pos];
  const parts = pos.split('/');
  for (const p of parts) { const t = p.trim(); if (POSITION_GROUPS[t]) return POSITION_GROUPS[t]; }
  return null;
}

export function getAdjustedPlayer(player) {
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

export function getDefensivePlayers(state) {
  const fieldingLineup = state.halfInning === 'top' ? state.homeLineup : state.awayLineup;
  const defenders = {};
  fieldingLineup.forEach(p => { const pos = p.assignedPos || p.pos; if (pos !== 'DH') defenders[pos] = p; });
  return defenders;
}

export function getOutfieldArm(defenders) {
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

export function getMiddleInfieldRating(defenders) {
  const ss = defenders['SS'], b2 = defenders['2B'];
  const adjSS = ss ? getAdjustedPlayer(ss) : null, adjB2 = b2 ? getAdjustedPlayer(b2) : null;
  const ssDef = adjSS ? (adjSS.defenseAdj + (adjSS.pos === 'SS' ? adjSS.arm : Math.max(1, adjSS.arm - 2))) / 2 : 5;
  const b2Def = adjB2 ? (adjB2.defenseAdj + (adjB2.pos === '2B' ? adjB2.arm : Math.max(1, adjB2.arm - 2))) / 2 : 5;
  return (ssDef + b2Def) / 2;
}

export function getCatcherArm(defenders) {
  if (!defenders['C']) return 5;
  const adj = getAdjustedPlayer(defenders['C']);
  if (adj.pos !== 'C') return Math.max(1, adj.arm - 3);
  return adj.arm;
}

export function getErrorChance(playerName) {
  const errors = PLAYER_ERRORS?.[playerName] || 10;
  return Math.min(0.05, errors / 500);
}

export function getCurrentBatter(state) {
  if (state.halfInning === 'top') return state.awayLineup[state.awayBatterIndex % state.awayLineup.length];
  return state.homeLineup[state.homeBatterIndex % state.homeLineup.length];
}

export function getCurrentPitcher(state) {
  return state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
}

export function getBattingTeam(state) {
  return state.halfInning === 'top' ? 'away' : 'home';
}

export function advanceBatter(state) {
  state._paCount = (state._paCount || 0) + 1;
  if (state.halfInning === 'top') state.awayBatterIndex = (state.awayBatterIndex + 1) % state.awayLineup.length;
  else state.homeBatterIndex = (state.homeBatterIndex + 1) % state.homeLineup.length;
}

export function scoreRun(state) {
  const team = getBattingTeam(state);
  state.score[team]++;
  logRun(state);
  if (state.innings[state.inning - 1]) {
    const half = state.halfInning === 'top' ? 'away' : 'home';
    if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
    state.innings[state.inning - 1][half]++;
  }
}

export function recordOut(state) {
  state.outs++;
  const _p = getCurrentPitcher(state);
  _p.gameStats.outs = (_p.gameStats.outs || 0) + 1;
  _p.gameStats.ip += 1/3;
  if (state.outs >= 3) {
    const pitcherName = getCurrentPitcher(state).name;
    state._pitcherRetiredSideName = pitcherName;
    endHalfInning(state);
  }
}

export function endHalfInning(state) {
  const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
  const half = state.halfInning === 'top' ? 'away' : 'home';
  if (!state.innings[state.inning - 1]) state.innings[state.inning - 1] = { home: null, away: null };
  if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
  state.outs = 0; state.balls = 0; state.strikes = 0; state.bases = [null, null, null]; state.hitAndRun = false; state.pendingSteal = null;
  state._throwOverCount = {};
  state._inningJustEnded = true;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (pitcher && pitcher._composure) {
    recoverComposure(pitcher._composure, state, 'inning_end');
    if (pitcher._composure.composure > 75) {
      state.log.push({ type: 'info', text: `🧠 ${pitcher.name}'s composure is steady at ${Math.round(pitcher._composure.composure)}%` });
    }
  }
  decayTension(state);
  if (state.halfInning === 'top') {
    state.halfInning = 'bottom';
    if (state.inning === 7) {
      const stretchLines = { cubs: `🎶 Harry Caray grabs the mic - "Take me out to the ballgame… Let's get some runs!" 🎶`, redsox: `🎶 The crowd belts out 'Sweet Caroline' in the middle of the 8th - but first, the 7th inning stretch at Fenway! 🎶` };
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
  state.log.push({ type: 'info', text: `${pickLine(END_INNING_LINES)} ${state.halfInning === 'top' ? 'Bottom' : 'Top'} of inning ${state.inning} - ${bt} batting` });
}

export function isWalkOff(state) {
  return state.halfInning === 'bottom' && state.inning >= 9 && state.score.home > state.score.away;
}

export function isCriticalRunSituation(state) {
  if (!state.bases[2]) return false;
  if (state.outs >= 2) return false;
  const battingTeam = getBattingTeam(state);
  const battingScore = state.score[battingTeam];
  const fieldingScore = state.score[battingTeam === 'home' ? 'away' : 'home'];
  // Tying or go-ahead run on 3rd (any inning)
  if ((battingScore + 1) >= fieldingScore) return true;
  // Close game: 7th inning or later, score margin <= 3
  const margin = Math.abs(battingScore - fieldingScore);
  if (state.inning >= 7 && margin <= 3) return true;
  return false;
}

export function getControllingTeam(state, context) {
  const userSide = state.homeTeam === state.userTeam ? 'home' : 'away';
  const cpuSide = userSide === 'home' ? 'away' : 'home';
  if (context === 'batting') {
    const battingSide = getBattingTeam(state);
    return battingSide === cpuSide ? 'cpu' : 'user';
  }
  if (context === 'pitching') {
    const pitchingSide = state.halfInning === 'top' ? 'home' : 'away';
    return pitchingSide === cpuSide ? 'cpu' : 'user';
  }
  return null;
}

// handleWalk - THE walk handler. Tags batter with responsible pitcher at time of reaching base.
export function handleWalk(state, batter) {
  if (state.bases[0]) {
    if (state.bases[1]) {
      if (state.bases[2]) {
        chargeRun(state, state.bases[2]);
        batter.gameStats.rbi++;
      }
      state.bases[2] = state.bases[1];
    }
    state.bases[1] = state.bases[0];
  }
  tagRunnerResponsiblePitcher(state, batter);
  state.bases[0] = batter;
}

export function processHoldingGame(state) {
  if (state.gameOver || state.outs >= 3) return null;
  const hasRunner = state.bases.some(b => b !== null);
  if (!hasRunner) return null;
  const pitcher = getCurrentPitcher(state);
  if (decideBalk(state)) {
    const pitcherName = pitcher?.name || 'The pitcher';
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) {
        if (i + 1 >= 3) {
          chargeRun(state, state.bases[i]);
          state.bases[i] = null;
        } else if (!state.bases[i + 1]) {
          state.bases[i + 1] = state.bases[i];
          state.bases[i] = null;
        }
      }
    }
    const text = fillHoldingTemplate(pickHoldingLine(BALK_LINES), { pitcher: pitcherName });
    state.log.push({ type: 'balk', text });
    state.lastPlay = { type: 'balk', text };
    state._celebrationBubble = text;
    return { balk: true };
  }
  return null;
}

export function getSituationalBatter(state) {
  const b = getCurrentBatter(state);
  const effP = getEffectivePitcher(state) || getCurrentPitcher(state);
  const isHome = getBattingTeam(state) === 'home';
  const isDay = state.weather?.isDay ?? true;
  const sit = calculateSituationalRatings(b, effP, { isHome, isNight: !isDay });
  const balls = state.balls || 0, strikes = state.strikes || 0;
  let finalContact = sit.contact, finalPower = sit.power, countModReason = null;
  if (balls === 3 && strikes === 0) { finalPower += 2; finalContact += 1; countModReason = 'Green light - sitting dead red'; }
  else if (balls === 2 && strikes === 0) { finalPower += 1; countModReason = 'Ahead in the count - looking to drive'; }
  else if (balls === 3 && strikes === 1) { finalPower += 1; finalContact += 1; countModReason = 'Ahead 3-1 - taking a rip'; }
  else if (balls === 0 && strikes === 2) { finalPower -= 2; finalContact -= 1; countModReason = 'Down 0-2 - choking up, protecting the plate'; }
  else if (balls === 1 && strikes === 2) { finalPower -= 1; countModReason = 'Behind 1-2 - shortening up'; }
  return { ...b, contact: Math.max(1, Math.min(10, finalContact)), power: Math.max(1, Math.min(10, finalPower)), baseContact: sit.contact, basePower: sit.power, countModReason, contactMult: sit.contactMult, powerMult: sit.powerMult };
}

export function intentionalWalk(state) {
  const newState = deepCopyState(state);
  const batter = getCurrentBatter(newState), pitcher = getCurrentPitcher(newState);
  batter.gameStats.bb++; pitcher.gameStats.bb++; pitcher.gameStats.pitches += 4;
  const msg = `${batter.name} - ${pickLine(INTENTIONAL_WALK_LINES)}`;
  newState.log.push({ type: 'walk', text: msg });
  newState.lastPlay = { type: 'walk', text: msg };
  handleWalk(newState, batter);
  newState.balls = 0; newState.strikes = 0;
  advanceBatter(newState);
  return newState;
}