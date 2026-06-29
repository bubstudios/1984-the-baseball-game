import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { applyWeatherEffects } from './weather';
import { BALLPARKS, getBallparkEffect, getHitDirection, checkBallparkQuirk } from './ballparks';
import {
  pickLine, STRIKEOUT_LINES, WALK_LINES, INTENTIONAL_WALK_LINES,
  SINGLE_LINES, DOUBLE_LINES, TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  DOUBLE_PLAY_LINES, END_INNING_LINES, LINEOUT_LINES,
  SOFT_GROUNDOUT_LINES, HARD_GROUNDOUT_LINES,
  POPOUT_LINES, FOUL_BALL_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  INFIELD_POPUP_LINES,
  INFIELD_LINEOUT_SOFT_LINES, INFIELD_LINEOUT_HARD_LINES,
  SHALLOW_FLYOUT_LINES, MEDIUM_FLYOUT_LINES, DEEP_FLYOUT_LINES,
  OUTFIELD_LINEOUT_LINES,
  BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  STEAL_LINES, ERROR_LINES, FC_LINES, CAUGHT_STEALING_LINES,
  TAKEN_STRIKE_FASTBALL_LINES, TAKEN_STRIKE_BREAKING_LINES,
  TAKEN_STRIKE_CHANGEUP_LINES, TAKEN_STRIKE_GENERIC_LINES,
  SWINGING_STRIKE_FASTBALL_LINES, SWINGING_STRIKE_BREAKING_LINES,
  SWINGING_STRIKE_CHANGEUP_LINES, SWINGING_STRIKE_GENERIC_LINES,
  CALLED_BALL_FASTBALL_LINES, CALLED_BALL_BREAKING_LINES,
  CALLED_BALL_CHANGEUP_LINES, CALLED_BALL_GENERIC_LINES,
  STRETCH_OUT_LINES, STRETCH_SUCCESS_LINES,
  RUNNER_OUT_AT_THIRD_LINES, RUNNER_OUT_AT_HOME_LINES,
  TAG_UP_OUT_LINES,
  STRETCH_SINGLE_DOUBLE_OUT_LINES, STRETCH_DOUBLE_TRIPLE_OUT_LINES,
  STRETCH_TRIPLE_HR_OUT_LINES,
  RUNNER_FIRST_TO_THIRD_OUT_LINES, RUNNER_FIRST_TO_HOME_OUT_LINES,
  RUNNER_SECOND_TO_HOME_OUT_LINES,
  TAG_UP_FIRST_TO_SECOND_OUT_LINES, TAG_UP_SECOND_TO_THIRD_OUT_LINES,
  TAG_UP_THIRD_TO_HOME_OUT_LINES,
  pickHitLine,
} from './commentaryLines';
import { checkBatterStretch } from './aggressiveBaserunning';
import { checkPitcherInjury, checkPlayInjury, getPlayerDurability } from './injuries';
import { getUmpireZoneEffect, maybeMissedCall } from './umpires';
import { pinchHit, pinchRun, defensiveSwitch, changePitcher } from './substitutions';
import { isWallRobable, rollHRRobbery, getRobberyCall, rollDivingCatch, getDivingCatchCall, rollDivingStop, getDivingStopResult, rollRareCatchEvent, getRareCatchCall } from './defensivePlays';
import { shouldThrowAtBatter, registerHBP, registerHomeRun, registerBigStrikeout, checkForWarning, decayTension, getBeanballContext, checkHomePlateCollision } from './beanball';
import { rollPitcherKCelebration, rollBatFlip, rollHitCelebration, rollHRAdmire, rollFielderCelebration, rollStaredown, rollPitcherRetireSide } from './celebrations';
import { pitcherCelebration } from './celebrationSystem';
import { getStrikeoutSituationType, pickStrikeoutCelebration } from './strikeoutCelebrations';
import { rollCollision, rollTakeoutSlide } from './collisions';
import { maybeGetAnnouncerHRCall } from './announcerHRCalls';
import { calculateHomeRunDistance } from './homeRunDistance';
import { initializePitcherComposure, applyEventDelta, recoverComposure, calculateLeverage, applyLeadChangePenalty, checkMinorIssue, checkMajorAction, getBehaviorZone, BEHAVIOR_ZONES } from './pitcherComposure';
import { rollComposureEvent } from './composureEvents';
import { shouldBunt, resolveBunt } from './buntingDecision';
import { shouldPinchHit, choose_pinch_hitter, resolvePinchHit } from './pinchHittingDecision';
import { shouldIntentionalWalk, issue_ibb } from './intentionalWalkDecision';
import { choose_alignment, apply_alignment_modifiers, expect_bunt } from './defensivePositioning';
import { should_double_switch, find_double_switch_partner, execute_double_switch } from './doubleSwitch';
import { logRun } from './pitcherDecisions';

export { pinchHit, pinchRun, defensiveSwitch, changePitcher };

// ── Pitcher Fatigue (innings-based) ──
function getPitcherFatigue(inningsPitched, pitcher) {
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);
  const threshold = isReliever ? stamina * 0.4 : Math.max(4.2, stamina * 0.7);
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

export function createGameState(homeTeam, awayTeam, customHomeLineup, customAwayLineup, useDH = false, weather = null, umpire = null, startingPitcher = null, opponentStartingPitcher = null) {
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
  const enforceNineBatters = (lineup, teamData) => {
    let result = [...lineup];
    // Trim to 9 if over
    if (result.length > 9) result = result.slice(0, 9);
    // Fill from bench if under 9 (DH only — non-DH should already have pitcher)
    while (result.length < 9 && teamData?.bench?.length > 0) {
      const nextBench = teamData.bench.find(b => !result.some(p => p.name === b.name));
      if (!nextBench) break;
      result.push({ ...nextBench, assignedPos: nextBench.assignedPos || nextBench.pos || 'DH', order: result.length + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } });
    }
    // In non-DH, ensure the starting pitcher appears exactly once
    if (!useDH && teamData?.rotation?.length > 0) {
      const spName = teamData.rotation[0].name;
      const spCount = result.filter(p => p.name === spName).length;
      if (spCount === 0) {
        result.push({ ...teamData.rotation[0], assignedPos: 'SP', order: result.length + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } });
      } else if (spCount > 1) {
        // Remove duplicates — keep the first occurrence
        let seen = false;
        result = result.filter(p => {
          if (p.name === spName) { if (seen) return false; seen = true; }
          return true;
        });
      }
    }
    // Re-number batting order after any trim/fill
    result.forEach((p, i) => { p.order = i + 1; });
    if (result.length !== 9) {
      console.warn(`Lineup built with ${result.length} players — expected 9`);
    }
    return result;
  };
  const homeLineup = enforceNineBatters(buildLineup(customHomeLineup, home.lineup, home), home);
  let awayLineup = enforceNineBatters(buildLineup(customAwayLineup, away.lineup, away), away);
  // Override away SP if user selected a specific opponent starter
  const awaySPOverride = opponentStartingPitcher ? away.rotation.find(p => p.name === opponentStartingPitcher.name) : null;
  // Swap opponent SP if user selected a specific starter
  if (awaySPOverride && !useDH) {
    const spIdx = awayLineup.findIndex(p => p.assignedPos === 'SP');
    if (spIdx >= 0) {
      awayLineup[spIdx] = { ...awaySPOverride, order: awayLineup[spIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    }
  }
  const homeSP = homeLineup.find(p => p.assignedPos === 'SP') || (useDH && startingPitcher ? startingPitcher : home.rotation[0]);
  const awaySP = awayLineup.find(p => p.assignedPos === 'SP') || awaySPOverride || away.rotation[0];
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
    runLog: [],
    injuries_enabled: true, // §6 toggle — set false to fully disable injury checks
  };
}

function createPitcherState(p) {
  const archetype = p.temperament || 'PROFESSIONAL';  // Default archetype if not specified
  const composureState = initializePitcherComposure(p, archetype);
  return { 
    ...p, 
    pitchCount: 0, 
    pitches: p.pitches || DEFAULT_PITCHES, 
    gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 },
    _composure: composureState,
  };
}

// Centralized composure delta — uses leverage multiplier based on inning & score situation
function applyComposure(pitcher, state, eventType) {
  if (pitcher && pitcher._composure) {
    const leverage = calculateLeverage(state.inning, state);
    const { newComposure } = applyEventDelta(pitcher._composure, eventType, leverage);
    pitcher._composure.composure = newComposure;
  }
}

// Maps lastPlay.type → composure event and applies it
function applyComposureFromLastPlay(state, pitcher) {
  const lp = state.lastPlay;
  if (!lp || !lp.type) return;
  const typeMap = {
    walk: lp.isHBP ? 'hbp' : 'walk',
    strikeout: 'strikeout',
    single: 'single',
    double: 'double',
    triple: 'triple',
    homerun: 'homerun',
    groundout: 'out',
    flyout: 'out',
    lineout: 'out',
    popout: 'out',
    doubleplay: 'doubleplay',
    sacfly: 'sacfly',
    error: 'error',
    fc: 'out',
    caughtstealing: 'caughtstealing',
    steal: 'steal',
    strike: 'strike',
    ball: 'ball',
    foul: 'foul',
  };
  const eventType = typeMap[lp.type];
  if (eventType) applyComposure(pitcher, state, eventType);
}

// ── Composure-driven events: minor issues & major actions ──
// Called after composure updates — rolls for meltdowns based on current zone
function processComposureEvents(state, pitcher) {
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
              state.bases[i].gameStats.runs++;
              scoreRun(state);
              scored = state.bases[i];
              state.bases[i] = null;
            } else if (!state.bases[i + 1]) {
              state.bases[i + 1] = state.bases[i];
              state.bases[i] = null;
            }
          }
        }
        const desc = scored
          ? `${event.text} ${scored.name.split(' ').pop()} scores!`
          : `${event.text} Runners advance!`;
        state.log.push({ type: 'error', text: desc });
      } else {
        state.log.push({ type: 'info', text: `⚡ ${pitcher.name} spikes one into the dirt — no damage done.` });
      }
      break;
  }
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
  logRun(state);
  if (state.innings[state.inning - 1]) {
    const half = state.halfInning === 'top' ? 'away' : 'home';
    if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
    state.innings[state.inning - 1][half]++;
  }
}

function advanceRunners(state, bases, batter, isHit = false, hitDirection = null) {
  let runsScored = 0;
  const pitcher = getCurrentPitcher(state);
  if (bases === 4) {
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) {
        state.bases[i].gameStats.runs++; scoreRun(state); runsScored++;
        // Collision check for runners scoring at home
        const collision = rollCollision('home', state.bases[i].speed, 7);
        if (collision) {
          state.log.push({ type: 'info', text: `💥 ${collision.text}` });
          state.lastPlay = { ...state.lastPlay, collision: true };
          if (collision.injuryTrigger) {
            const runner = state.bases[i];
            const catcher = getDefensivePlayers(state)['C'] || null;
            state._pendingCollisionInjury = {
              runner: (collision.injuredParty === 'runner' || collision.injuredParty === 'both') ? runner : null,
              fielder: (collision.injuredParty === 'fielder' || collision.injuredParty === 'both') ? catcher : null,
              trigger: collision.injuryTrigger,
            };
          }
        }
        state.bases[i] = null;
      }
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
  const isOutfieldHit = hitDirection && ['LF', 'CF', 'RF', 'LCF', 'RCF'].some(d => hitDirection.includes(d));
  if (isHit && bases <= 2 && isOutfieldHit) {
    const ofArm = getOutfieldArm(defenders);
    const armPenalty = (ofArm / 10) * 0.18;
    const batterPower = batter.power / 10;
    const positioningPenalty = batterPower * 0.10;
    const outsMultiplier = state.outs >= 2 ? 1.60 : (state.outs === 1 ? 1.15 : 1.0);
    // Runner from 1st on a double — attempt to score from 3rd (standard advancement moved them 1st→3rd)
    if (bases === 2 && preBases[0]) {
      const runnerAt3rd = state.bases[2];
      if (runnerAt3rd && runnerAt3rd.name === preBases[0].name) {
        const sf = runnerAt3rd.speed / 10;
        const hc = (0.15 + sf * 0.50 - armPenalty - positioningPenalty) * outsMultiplier;
        if (Math.random() < Math.max(0.02, hc)) {
          const caughtChance = 0.04 + (ofArm / 10) * 0.10 - sf * 0.06;
          if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.12))) {
            runnerAt3rd.gameStats.cs = (runnerAt3rd.gameStats.cs || 0) + 1;
            state.bases[2] = null;
            if (!state._pendingBaseOuts) state._pendingBaseOuts = [];
            state._pendingBaseOuts.push({ text: `${runnerAt3rd.name} — ${pickLine(RUNNER_FIRST_TO_HOME_OUT_LINES)}` });
          } else {
            runnerAt3rd.gameStats.runs++; scoreRun(state); rbi++; state.bases[2] = null;
            state.log.push({ type: 'info', text: `${runnerAt3rd.name} hustles all the way home from first!` });
          }
        }
      }
    }
    // Runner from 1st to 3rd on a single (CF/RF only — standard advancement moved them 1st→2nd)
    if (bases === 1 && preBases[0] && hitDirection) {
      const runnerAt2nd = state.bases[1];
      if (runnerAt2nd && runnerAt2nd.name === preBases[0].name) {
        const isCORF = hitDirection.includes('CF') || hitDirection.includes('RF');
        if (isCORF) {
          const sf = runnerAt2nd.speed / 10;
          const tc = (0.12 + sf * 0.40 - armPenalty * 0.6 - positioningPenalty * 0.4) * outsMultiplier;
          if (Math.random() < Math.max(0.03, tc)) {
            const caughtChance = 0.03 + (ofArm / 10) * 0.12 - sf * 0.05;
            if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.10))) {
              runnerAt2nd.gameStats.cs = (runnerAt2nd.gameStats.cs || 0) + 1;
              state.bases[1] = null;
              if (!state._pendingBaseOuts) state._pendingBaseOuts = [];
              state._pendingBaseOuts.push({ text: `${runnerAt2nd.name} — ${pickLine(RUNNER_FIRST_TO_THIRD_OUT_LINES)}` });
            } else if (!state.bases[2]) {
              // Only move to 3rd if the base isn't already occupied (e.g., runner from 2nd stayed)
              state.bases[2] = runnerAt2nd; state.bases[1] = null;
              state.log.push({ type: 'info', text: `${runnerAt2nd.name} wheels to third on the single!` });
            }
          }
        }
      }
    }
    // Runner from 2nd scoring on single — runner moved to 3rd by standard advancement
    if (bases === 1 && preBases[1]) {
      const runnerAt3rd = state.bases[2];
      if (runnerAt3rd && runnerAt3rd.name === preBases[1].name) {
        const sf = runnerAt3rd.speed / 10;
        const twoOutBonus = state.outs >= 2 ? 0.28 : 0;
        const hc = (0.25 + sf * 0.55 - armPenalty * 0.9 - positioningPenalty * 0.8 + twoOutBonus) * outsMultiplier;
        if (Math.random() < Math.max(0.06, Math.min(hc, 0.92))) {
          const caughtChance = 0.03 + armPenalty * 0.8 - sf * 0.05;
          if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.12))) {
            runnerAt3rd.gameStats.cs = (runnerAt3rd.gameStats.cs || 0) + 1;
            state.bases[2] = null;
            if (!state._pendingBaseOuts) state._pendingBaseOuts = [];
            state._pendingBaseOuts.push({ text: `${runnerAt3rd.name} — ${pickLine(RUNNER_SECOND_TO_HOME_OUT_LINES)}` });
          } else {
            runnerAt3rd.gameStats.runs++; scoreRun(state); rbi++; state.bases[2] = null;
            state.log.push({ type: 'info', text: `${runnerAt3rd.name} scores from second on the single!` });
          }
        }
      }
    }
  }
  if (bases <= 3) state.bases[bases - 1] = batter;
  if (isHit && bases === 1 && isOutfieldHit) {
    const r3 = state.bases[2], b1 = state.bases[0];
    // Only allow "takes second on throw to third" when the runner on 3rd actually
    // advanced there during this play (wasn't already on 3rd before the hit).
    const preR3 = preBases[2];
    const r3AdvancedToThird = r3 && preR3 !== r3;
    if (b1 && b1.name === batter.name && r3AdvancedToThird && !state.bases[1]) {
      const ofArm = getOutfieldArm(defenders);
      const sc = 0.04 + (r3.speed / 10) * 0.20 - (ofArm / 10) * 0.06 + (batter.speed / 10) * 0.06;
      if (Math.random() < Math.max(0.01, Math.min(sc, 0.18))) {
        state.bases[1] = batter; state.bases[0] = null;
        const takeSecondText = `${batter.name.split(' ').pop()} takes second — defense threw to third!`;
        state.log.push({ type: 'info', text: takeSecondText });
        // Enhance lastPlay to include this exciting detail
        if (state.lastPlay && state.lastPlay.text) {
          state.lastPlay.text = `${state.lastPlay.text} — ${takeSecondText}`;
        }
      }
    }
  }
  batter.gameStats.rbi += rbi; pitcher.gameStats.r += rbi; pitcher.gameStats.er += rbi;
  return runsScored + rbi;
}

function recordOut(state) {
  state.outs++; getCurrentPitcher(state).gameStats.ip += 1/3;
  if (state.outs >= 3) {
    // Capture pitcher name BEFORE endHalfInning potentially changes the pitcher
    const pitcherName = getCurrentPitcher(state).name;
    state._pitcherRetiredSideName = pitcherName;
    endHalfInning(state);
  }
}

function endHalfInning(state) {
   const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
   const half = state.halfInning === 'top' ? 'away' : 'home';
   if (!state.innings[state.inning - 1]) state.innings[state.inning - 1] = { home: null, away: null };
   if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
   state.outs = 0; state.balls = 0; state.strikes = 0; state.bases = [null, null, null]; state.hitAndRun = false; state.pendingSteal = null;
   state._inningJustEnded = true;  // Flag for pitcher celebration
  
  // ── Pitcher composure recovery at half-inning boundary (gated by lead state) ──
   const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
   if (pitcher && pitcher._composure) {
     recoverComposure(pitcher._composure, state, 'inning_end');
     // Log recovery if significant
     if (pitcher._composure.composure > 75) {
       state.log.push({ type: 'info', text: `🧠 ${pitcher.name}'s composure is steady at ${Math.round(pitcher._composure.composure)}%` });
     }
   }
  
  // Decay beanball tension at half-inning transitions
  decayTension(state);
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
    if (baseIndex + 1 >= 3) { runner.gameStats.runs++; scoreRun(newState); newState.bases[baseIndex] = null; const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, 'home')}`; newState.log.push({ type: 'steal', text: stxt }); newState.lastPlay = { type: 'steal', text: stxt }; newState._celebrationBubble = stxt; }
    else { newState.bases[baseIndex + 1] = runner; newState.bases[baseIndex] = null; const stxt = `🏃 ${runner.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, ['second','third','home'][baseIndex])}`; newState.log.push({ type: 'steal', text: stxt }); newState.lastPlay = { type: 'steal', text: stxt }; newState._celebrationBubble = stxt; }
  } else {
    runner.gameStats.cs = (runner.gameStats.cs || 0) + 1; newState.bases[baseIndex] = null; recordOut(newState);
    const cstxt = `${runner.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, ['second','third','home'][baseIndex])} — ${pickLine(CAUGHT_STEALING_LINES)}`; newState.log.push({ type: 'caughtstealing', text: cstxt }); newState.lastPlay = { type: 'caughtstealing', text: cstxt }; newState._celebrationBubble = cstxt;
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
  for (let i = 0; i < 2; i++) {
    const r = state.bases[i];
    if (!r || state.bases[i + 1]) continue;
    // Slow runners (speed <= 3) almost never steal; speed 4 needs a big edge
    if (r.speed <= 2) continue;  // Never steal
    if (r.speed <= 3 && Math.random() > 0.03) continue;  // 3% chance
    if (r.speed <= 4 && Math.random() > 0.06) continue;  // 6% chance
    if (Math.random() < Math.max(0.02, 0.04 + (r.speed / 10) * 0.20 - armF - pitchF)) return i;
  }
  return -1;
}

function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  const effectiveP = getEffectivePitcher(state) || pitcher;
  pitcher.gameStats.pitches++;
  
  // ── Composure control modifier ──
  const composure = pitcher._composure;
  let controlFactor = (effectiveP.effectiveControl || effectiveP.control) / 10;
  if (composure) {
    const zone = getBehaviorZone(composure.composure);
    const controlMod = zone === BEHAVIOR_ZONES.LOCKED_IN ? 1.15 : 
                       zone === BEHAVIOR_ZONES.NORMAL ? 1.0 :
                       zone === BEHAVIOR_ZONES.PRESSING ? 0.85 : 0.65;
    controlFactor *= controlMod;
  }
  
  const effControl = effectiveP.effectiveControl || effectiveP.control;
  const wpChance = Math.max(0.002, (10 - effControl) * 0.002);
  
  // ── Wild pitch chance increases in RED_ZONE ──
  let wpAdjusted = wpChance;
  if (composure && getBehaviorZone(composure.composure) === BEHAVIOR_ZONES.RED_ZONE) {
    wpAdjusted *= 2.5;
  }
  
  if (Math.random() < wpAdjusted) {
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
      const wpDesc = scored ? `${wpBase} ${scored.name.split(' ').pop()} scores!${moved.length ? ' Runners advance.' : ''}` : `${wpBase} Runners advance!`;
      state.log.push({ type: 'error', text: wpDesc });
      state.lastPlay = { type: 'error', text: wpDesc };
    }
    state.balls++;
    return { pitchType: pitchType.name, isStrike: false, location: 'wild pitch', isWildPitch: true };
  }
  // Contextual HBP — use beanball engine (much less frequent now)
  const hbpReason = shouldThrowAtBatter(state, pitcher, getCurrentBatter(state));
  const baseHbpChance = Math.max(0.0008, (10 - effControl) * 0.0006);
  const hbpChance = hbpReason ? Math.min(0.15, baseHbpChance + (hbpReason.baseChance || 0.02) * (1 + (state._beanball?.tension || 0) / 100)) : baseHbpChance;
  if (Math.random() < hbpChance) return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true, hbpReason }; else if (Math.random() < baseHbpChance) return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true };
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
      {
        let takenLine;
        const pt = (pitch.pitchType || '').toLowerCase();
        if (pt.includes('fast')) takenLine = pickLine(TAKEN_STRIKE_FASTBALL_LINES);
        else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) takenLine = pickLine(TAKEN_STRIKE_BREAKING_LINES);
        else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) takenLine = pickLine(TAKEN_STRIKE_CHANGEUP_LINES);
        else takenLine = pickLine(TAKEN_STRIKE_GENERIC_LINES);
        const strikeText = `Strike ${state.strikes} — ${takenLine}`;
        state.log.push({ type: 'strike', text: strikeText });
        state.lastPlay = { type: 'strike', text: strikeText };
      }
    } else {
      state.balls++;
      if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; }
      {
        const pt = (pitch.pitchType || '').toLowerCase();
        let ballLine;
        if (pt.includes('fast')) ballLine = pickLine(CALLED_BALL_FASTBALL_LINES);
        else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) ballLine = pickLine(CALLED_BALL_BREAKING_LINES);
        else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) ballLine = pickLine(CALLED_BALL_CHANGEUP_LINES);
        else ballLine = pickLine(CALLED_BALL_GENERIC_LINES);
        const ballText = `Ball ${state.balls} — ${ballLine}`;
        state.log.push({ type: 'ball', text: ballText });
        state.lastPlay = { type: 'ball', text: ballText };
      }
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
    if (Math.random() < ((0.06 + buntingSkill * 0.15 + sf * 0.09) * pp)) {
      batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
      // Bunt single: runners advance at most one base — no scoring from 2nd (infield hit)
      let rbiB = 0;
      for (let br = 2; br >= 0; br--) {
        if (state.bases[br]) {
          if (br + 1 >= 3) { state.bases[br].gameStats.runs++; scoreRun(state); rbiB++; state.bases[br] = null; }
          else if (!state.bases[br + 1]) { state.bases[br + 1] = state.bases[br]; state.bases[br] = null; }
        }
      }
      state.bases[0] = batter;
      batter.gameStats.rbi += rbiB; pitcher.gameStats.r += rbiB; pitcher.gameStats.er += rbiB;
      const buntText = `${batter.name} ${pickLine(BUNT_SINGLE_LINES)}${rbiB ? ` ${rbiB} RBI!` : ''}`;
      state.log.push({ type: 'single', text: buntText });
      state.lastPlay = { type: 'single', text: buntText, infield: true };
      state.balls = 0; state.strikes = 0; advanceBatter(state); return;
    }
    else { state.strikes++; if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt — strike ${state.strikes}` }); state.lastPlay = { type: 'foul', text: `Foul bunt — strike ${state.strikes}` }; return; }
  }
  const isPower = swingType.name === 'Power Swing', isContact = swingType.name === 'Contact Swing';
  const adjBatter = getSituationalBatter(state);
  const contactRating = adjBatter.contact / 10;
  const isPitcherBatting = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let contactChance = 0.40 + contactRating * 0.38;
  if (isPitcherBatting) contactChance *= 0.55; // Pitchers are much worse hitters
  if (isPower) contactChance -= 0.10; if (isContact) contactChance += 0.12; if (!pitch.isStrike) contactChance -= 0.20;
  if (state.hitAndRun) { contactChance -= 0.08; contactChance = Math.max(0.03, contactChance); }
  const effP2 = getEffectivePitcher(state) || pitcher;
  contactChance -= (effP2.effectiveOffSpeed || effP2.offSpeed || pitcher.offSpeed) / 10 * 0.07 + (effP2.effectivePitchSpeed || effP2.pitchSpeed) / 10 * 0.05;
  if (effP2.fatigueLevel >= 3) contactChance += 0.08;
  contactChance = Math.max(0.05, Math.min(contactChance, 0.85));
  if (!(Math.random() < contactChance)) {
    if (!pitch.isStrike && !state.hitAndRun && Math.random() < 0.50 + contactRating * 0.18) { state.balls++; if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; } const pt2 = (pitch.pitchType || '').toLowerCase(); let bl; if (pt2.includes('fast')) bl = pickLine(CALLED_BALL_FASTBALL_LINES); else if (pt2.includes('break') || pt2.includes('curve') || pt2.includes('slider') || pt2.includes('hook')) bl = pickLine(CALLED_BALL_BREAKING_LINES); else if (pt2.includes('change') || pt2.includes('off') || pt2.includes('split') || pt2.includes('fork')) bl = pickLine(CALLED_BALL_CHANGEUP_LINES); else bl = pickLine(CALLED_BALL_GENERIC_LINES); const bt = `Ball ${state.balls} — ${bl}`; state.log.push({ type: 'ball', text: bt }); state.lastPlay = { type: 'ball', text: bt }; return; }
    state.strikes++;
    if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; registerBigStrikeout(state, pitcher, batter); const isLooking = pitch.location && ['outside corner','inside corner','high strike','low strike','down the middle'].includes(pitch.location) && Math.random() < 0.45; const sl = isLooking ? pickLine(STRIKEOUT_CALLED_LINES) : pickLine(STRIKEOUT_SWINGING_LINES); const msg = sl.endsWith('!') ? `${batter.name} ${sl}` : `${batter.name} ${sl} ${pitch.pitchType}!`; state.log.push({ type: 'strikeout', text: msg }); state.lastPlay = { type: 'strikeout', text: msg }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); 

    // ── New celebration system ──
    const situationType = getStrikeoutSituationType(state, pitcher, batter);
    const kCelebCheck = pitcherCelebration(state, situationType);
    if (kCelebCheck) {
      const celebText = pickStrikeoutCelebration(situationType) || rollPitcherKCelebration(pitcher);
      if (celebText) {
        state._celebrationBubble = celebText;
        state.log.push({ type: 'info', text: celebText });
      }
    } else if (Math.random() < 0.15) {
      // Legacy fallback for other K moments
      const kCelebration = rollPitcherKCelebration(pitcher);
      if (kCelebration) state.log.push({ type: 'info', text: `🔥 ${kCelebration}` });
    }

    if (state.hitAndRun && !state.gameOver) handleHitAndRunCaught(state); return; }
    if (state.hitAndRun && !state.gameOver) { state.hitAndRun = false; handleHitAndRunMiss(state); }
    {
      const pt = (pitch.pitchType || '').toLowerCase();
      let swingLine;
      if (pt.includes('fast')) swingLine = pickLine(SWINGING_STRIKE_FASTBALL_LINES);
      else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) swingLine = pickLine(SWINGING_STRIKE_BREAKING_LINES);
      else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) swingLine = pickLine(SWINGING_STRIKE_CHANGEUP_LINES);
      else swingLine = pickLine(SWINGING_STRIKE_GENERIC_LINES);
      const strikeLabel = `Strike ${state.strikes} — ${swingLine}`;
      state.log.push({ type: 'strike', text: strikeLabel });
      state.lastPlay = { type: 'strike', text: strikeLabel };
    }
    return;
  }
  if (state.hitAndRun) { state.hitAndRun = false; handleHitAndRunContact(state, batter, pitcher, adjBatter); return; }
  batter.gameStats.ab++;
  if (Math.random() < 0.18) { if (state.strikes < 2) state.strikes++; const foulLine = pickLine(FOUL_BALL_LINES); state.log.push({ type: 'foul', text: `${batter.name} — ${foulLine}` }); state.lastPlay = { type: 'foul', text: `Foul ball` }; batter.gameStats.ab--; return; }
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1, doubleMod = wx.doubleMod || 1, errorWx = wx.errorMult || 1, contactWx = wx.contactMod || 0;
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const ballparkEffect = getBallparkEffect(stadiumName, adjBatter.bats, state.weather);
  const ballparkHRMod = ballparkEffect.hrMod || 1;
  const hitDirection = getHitDirection(adjBatter.bats);
  const powerRating = adjBatter.power / 10;
  const isPitcherBatting2 = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let hitChance = 0.22 + (contactRating + contactWx / 10) * 0.28;
  if (isPitcherBatting2) hitChance *= 0.45; // Pitchers rarely get hits
  if (isPower) hitChance -= 0.04; if (isContact) hitChance += 0.06;
  const effP3 = getEffectivePitcher(state) || pitcher;
  hitChance -= (effP3.effectiveControl || effP3.control) / 10 * 0.03;
  if (effP3.fatigueLevel >= 3) hitChance += 0.05; if (effP3.fatigueLevel >= 4) hitChance += 0.03;
  const gs = effP3.effectivePitchSpeed || effP3.pitchSpeed; if (gs <= 2 && effP3.fatigueLevel >= 3) hitChance += 0.04;
  hitChance += (adjBatter.power / 10) * 0.03;
  const defenders = getDefensivePlayers(state);
  let rp = 0; Object.values(defenders).forEach(d => { const adj = getAdjustedPlayer(d); if (adj.pos !== (adj.assignedPos || adj.pos)) rp += 0.010; });
  hitChance += rp; hitChance = Math.max(0.11, Math.min(hitChance, 0.75));
  if (Math.random() < hitChance) {
     pitcher.gameStats.h++; batter.gameStats.hits++;
     let powerMod = isPower ? 1.50 : (isContact ? 0.5 : 1.0);
     const effPwr = powerRating * powerMod, sf2 = adjBatter.speed / 10, hr2 = Math.random();
     if (hr2 < effPwr * 0.085 * hrMod * ballparkHRMod) {
      // Check for HR robbery — rare but spectacular
      const isRobable = isWallRobable(stadiumName, hitDirection);
      const isRobbed = isRobable && rollHRRobbery();
      if (isRobbed) {
        // HR robbed! No HR stats — this becomes a deep flyout
        const fielder = defenders[['LF', 'CF', 'RF', 'RCF', 'LCF'][Math.floor(Math.random() * 5)]] || defenders['CF'] || { name: 'the outfielder' };
        const robberyCall = getRobberyCall(state.homeTeam, fielder.name);
        state.log.push({ type: 'flyout', text: robberyCall });
        state.lastPlay = { type: 'flyout', text: robberyCall };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        // Runners do NOT advance on HR robbery — it's a flyout
        return;
      }
      // Normal HR — register for beanball engine
       batter.gameStats.hr++; const didFlip = registerHomeRun(state, batter, pitcher); const runnersOn = state.bases.filter(b => b !== null).length; const rbi = advanceRunners(state, 4, batter);

       // Calculate HR distance
       const hrDistance = calculateHomeRunDistance(batter, pitcher, state, runnersOn === 3);
       batter.gameStats.lastHRDistance = hrDistance;
       batter.gameStats.longestHR = Math.max(batter.gameStats.longestHR || 0, hrDistance);

       const bp = BALLPARKS[stadiumName], fd = bp?.wallDesc?.[hitDirection] || `to ${hitDirection}`;
       let ht; const gs2 = runnersOn === 3;
       if (bp?.quirks?.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Up and over the Green Monster! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} clears the 37-foot wall!`;
       else if (bp?.quirks?.includes('shortRF') && hitDirection === 'RF' && adjBatter.bats === 'L') ht = `Into the short porch! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} hooks one just over ${fd}!`;
       else if (bp?.quirks?.includes('peskyPole') && hitDirection === 'RF') ht = `Around Pesky's Pole! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} wraps it inside the right field foul pole!`;
       else if (bp?.quirks?.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Onto Waveland Avenue! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} launches one over the ivy and out of Wrigley!`;
       else { ht = `${batter.name} sends it deep ${fd} —` + (gs2 ? ` GRAND SLAM! ${batter.name} clears the bases!` : (rbi > 1 ? ` a ${rbi}-run HOME RUN!` : ` a solo HOME RUN!`)); }
       const battingTeamKey = state.halfInning === 'top' ? state.awayTeam : state.homeTeam;
       const hrCall = maybeGetAnnouncerHRCall(battingTeamKey, { isGrandSlam: gs2, rbi, batterName: batter.name });
       if (hrCall) state.log.push({ type: 'homerun', text: `🎙️ ${hrCall}` });
       state.log.push({ type: 'homerun', text: `💥 ${ht}`, hrDistance, batterName: batter.name }); state.lastPlay = { type: 'homerun', text: `💥 ${ht}`, hrDistance, batterName: batter.name };
       const hrAdmire = rollHRAdmire(batter); if (hrAdmire) { state.log.push({ type: 'info', text: `✨ ${hrAdmire}` }); state._celebrationBubble = `✨ ${hrAdmire}`; }
    } else if (adjBatter.speed >= 4 && hr2 < (effPwr * 0.085 + sf2 * 0.02) * doubleMod) {
      const rbi = advanceRunners(state, 3, batter, true, hitDirection);
      let tripFlavor = '';
      const bpTrp = BALLPARKS[stadiumName];
      if (bpTrp?.quirks?.includes('hugeOutfield') || bpTrp?.quirks?.includes('fountains')) {
        tripFlavor = ` — the spacious outfield at ${stadiumName} gives the runner time!`;
      }
      const tripText = `${pickHitLine(TRIPLE_LINES, batter.name)}${tripFlavor}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: tripText });
      state.lastPlay = { type: 'triple', text: tripText };
      const tripleCeleb = rollHitCelebration(batter, true); if (tripleCeleb) { state.log.push({ type: 'info', text: `🔥 ${tripleCeleb}` }); state._celebrationBubble = `🔥 ${tripleCeleb}`; }
    } else if (hr2 < effPwr * 0.38 * doubleMod) {
      const rbi = advanceRunners(state, 2, batter, true, hitDirection);
      let dblFlavor = '';
      const bpDbl = BALLPARKS[stadiumName];
      if (bpDbl?.quirks?.includes('hugeOutfield') || bpDbl?.quirks?.includes('fountains')) {
        dblFlavor = ` — the big outfield at ${stadiumName} turns a single into two!`;
      }
      const dblText = `${pickHitLine(DOUBLE_LINES, batter.name)}${dblFlavor}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: dblText });
      state.lastPlay = { type: 'double', text: dblText };
    } else {
      const rbi = advanceRunners(state, 1, batter, true, hitDirection);
      const singleText = `${pickHitLine(SINGLE_LINES, batter.name)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'single', text: singleText });
      state.lastPlay = { type: 'single', text: singleText };
    }
    state.balls = 0; state.strikes = 0; advanceBatter(state);
    // Only process aggressive base advancement on OUTFIELD hits (single to OF or beyond), not infield plays
    const isOutfieldHit = state.lastPlay && ['single', 'double', 'triple'].includes(state.lastPlay.type) && !state.lastPlay.infield && hitDirection && (hitDirection.includes('LF') || hitDirection.includes('CF') || hitDirection.includes('RF') || hitDirection.includes('LCF') || hitDirection.includes('RCF'));
    if (isOutfieldHit && !state.gameOver) {
      processPostHitBaserunning(state, state.lastPlay.type, batter, defenders);
    }
  } else {
    const posNames = { '1B': 'first base', '2B': 'second base', '3B': 'third base', SS: 'shortstop', SP: 'the pitcher', C: 'the catcher', LF: 'left field', CF: 'center field', RF: 'right field' };
    const gps = [{ pos: 'SS', posName: 'shortstop' },{ pos: '2B', posName: 'second' },{ pos: '3B', posName: 'third' },{ pos: 'SP', posName: 'the pitcher' },{ pos: '1B', posName: 'first' }];
    const gp = gps[Math.floor(Math.random() * gps.length)];
    const gt = `${batter.name} ${pickLine(GROUNDOUT_LINES)}`.replace(/grounds out to (short|second|third|the pitcher|first)/, `grounds out to ${gp.posName}`);
    const sgt = `${pickLine(SOFT_GROUNDOUT_LINES)} ${defenders[gp.pos]?.name || gp.posName} makes the play.`;
    const hgt = `${pickLine(HARD_GROUNDOUT_LINES)} ${defenders[gp.pos]?.name || gp.posName} makes the play.`;
    const gts = [
      { text: gt, pos: gp.pos, posName: gp.posName, type: 'groundout' },
      { text: sgt, pos: gp.pos, posName: gp.posName, type: 'groundout' },
      { text: hgt, pos: gp.pos, posName: gp.posName, type: 'groundout' },
    ];
    const ff = { CF: ['center','center field'], RF: ['right','right field'], LF: ['left','left field'] };
    const fpk = ['CF','RF','LF']; const fp = fpk[Math.floor(Math.random() * fpk.length)];
    const depthRoll = Math.random();
    let flyoutLine, flyoutDepth;
    if (depthRoll < 0.20) { flyoutLine = pickLine(SHALLOW_FLYOUT_LINES); flyoutDepth = 'shallow'; }
    else if (depthRoll < 0.40) { flyoutLine = pickLine(MEDIUM_FLYOUT_LINES); flyoutDepth = 'medium'; }
    else { flyoutLine = pickLine(DEEP_FLYOUT_LINES); flyoutDepth = 'deep'; }
    const ftt = `${flyoutLine} ${defenders[fp]?.name || ff[fp][1]} makes the catch.`;
    const fts = [{ text: ftt, pos: fp, type: 'flyout', depth: flyoutDepth }];
    const loP = ['3B','SS','1B','2B']; const lp = loP[Math.floor(Math.random() * loP.length)];
    const lt = `${pickLine(Math.random() < 0.5 ? INFIELD_LINEOUT_SOFT_LINES : INFIELD_LINEOUT_HARD_LINES)} ${defenders[lp]?.name || posNames[lp]} makes the catch.`;
    const ofLoPos = ['CF','RF','LF']; const olp = ofLoPos[Math.floor(Math.random() * ofLoPos.length)];
    const olt = `${pickLine(OUTFIELD_LINEOUT_LINES)} ${defenders[olp]?.name || ff[olp][1]} makes the catch.`;
    const ppP = ['C','2B','3B']; const pp = ppP[Math.floor(Math.random() * ppP.length)];
    const pt = pickLine(INFIELD_POPUP_LINES);
    const pf = `${pt} ${defenders[pp]?.name || posNames[pp]} makes the catch.`;
    const oo = [{ text: pf, pos: pp, type: 'popout' },{ text: lt, pos: lp, type: 'lineout' },{ text: olt, pos: olp, type: 'lineout' }];
    const ao = [...gts, ...fts, ...oo]; const out = ao[Math.floor(Math.random() * ao.length)];
    const isFlyBall = ['CF','RF','LF'].includes(out.pos) || out.type === 'popout' || out.type === 'lineout';
    if (isFlyBall && out.type !== 'popout') {
      const q = checkBallparkQuirk(stadiumName, adjBatter.bats, hitDirection, state.weather);
      if (q && q.isHit) {
        batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
        if (q.isHR) { batter.gameStats.hr++; advanceRunners(state, 4, batter); }
        else advanceRunners(state, q.bases, batter, true);
        state.log.push({ type: q.type, text: q.text });
        state.lastPlay = { type: q.type, text: q.text };
        state.balls = 0; state.strikes = 0; advanceBatter(state); return;
      }
      if (q && !q.isHit) {
        state.log.push({ type: q.type, text: q.text });
        state.lastPlay = { type: q.type, text: q.text };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
      }
    }
    const isGrounder = !isFlyBall;
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) { const adjF = getAdjustedPlayer(fielder); if (Math.random() < getErrorChance(fielder.name) * adjF.errorMult * errorWx) { batter.gameStats.ab++; pitcher.gameStats.er++; advanceRunners(state, 1, batter, false); const errText = `${fielder.name} ${pickLine(ERROR_LINES)} ${batter.name} reaches on an error!`; state.log.push({ type: 'error', text: errText }); state.lastPlay = { type: 'error', text: errText }; state.balls = 0; state.strikes = 0; advanceBatter(state); return; } }
    }
    if (isGrounder) {
      // ── Apply alignment modifiers (Phase 3.0) ──
      const alignmentMod = apply_alignment_modifiers(state._defensiveAlignment, {
        type: 'grounder',
        location: out.pos,
        play_at_plate_available: !!state.bases[2],
      }, {});
      
      // Infield single check with alignment mods
      const fielder = defenders[out.pos];
      if (fielder) { 
        const af = getAdjustedPlayer(fielder); 
        const rp2 = af.pos !== (af.assignedPos || af.pos) ? 0.06 : 0; 
        let ihc = Math.max(0, (batter.speed / 10) * 0.30 - (af.arm / 10) * 0.15 - (af.defenseAdj / 10) * 0.05 + rp2);
        
        // Apply through-infield modifier if present
        if (alignmentMod.through_infield_for_hit_prob) {
          ihc += alignmentMod.through_infield_for_hit_prob;
        }
        ihc = Math.max(0, Math.min(1, ihc));
        
        if (Math.random() < ihc) { 
          batter.gameStats.ab++; 
          batter.gameStats.hits++; 
          pitcher.gameStats.h++; 
          // Infield single: runners advance at most one base, no scoring from 2nd
          for (let br = 2; br >= 0; br--) {
            if (state.bases[br]) {
              if (br + 1 >= 3) { state.bases[br].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.bases[br] = null; }
              else if (!state.bases[br + 1]) { state.bases[br + 1] = state.bases[br]; state.bases[br] = null; }
            }
          }
          state.bases[0] = batter; 
          const isText = `${batter.name} beats it out — infield single past ${fielder.name}!`;
          state.log.push({ type: 'single', text: isText });
          state.lastPlay = { type: 'single', text: isText, infield: true };
          state.balls = 0; 
          state.strikes = 0; 
          advanceBatter(state); 
          return; 
        } 
      }
    }
    if (isGrounder) {
      const r1 = state.bases[0], r2 = state.bases[1];
      if (r1 && state.outs < 2) {
        // With 2 outs: runners always go on contact. Speed-based advancement for r1→3rd on ground balls.
        if (state.outs >= 2 && r2 && isGrounder) {
          // Runners on 1st+2nd with 2 outs: ground ball anywhere — runners should be off on contact
          // Runner on 2nd may advance to 3rd based on where the ball was hit
          const r1speed = r1.speed / 10;
          const r2speed = r2.speed / 10;
          const r3 = state.bases[2];
          if (r3 && r3.name !== r1.name && r3.name !== r2.name) {
            r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++;
          }
          state.bases[2] = r2;
          state.bases[1] = r1;
          state.bases[0] = null;
          batter.gameStats.ab++;
          const fc2Out = `${batter.name} grounds to ${posNames[out.pos] || out.pos} — runners advance on contact, ${out.pos === 'SS' || out.pos === '2B' ? 'force at 1st' : 'out at 1st'}!`;
          state.log.push({ type: 'groundout', text: fc2Out });
          state.lastPlay = { type: 'groundout', text: fc2Out };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
          return;
        }
      }
      if (r1 && state.outs < 2) {
        const mi = getMiddleInfieldRating(defenders);
        let dpc = 0.30 + (mi / 10) * 0.22 - ((r1 ? r1.speed : 5) / 10) * 0.04; dpc = Math.max(0.10, Math.min(dpc, 0.45));
        const roll = Math.random();
        if (roll < dpc) {
          const isMI = ['2B','SS'].includes(out.pos);
          // Check for takeout slide breaking up the DP
          const takeout = r1 ? rollTakeoutSlide(r1) : null;
          if (takeout) {
            // Takeout slide — DP broken up, runner at 1B safe, but r1 is out at 2nd
            // r2 (runner on 2nd before the play) advances to 3rd on the slide
            if (r2 && !state.bases[2]) { state.bases[2] = r2; }
            state.bases[0] = batter; batter.gameStats.ab++;
            state.bases[1] = null; // r1 is out at 2nd
            state.log.push({ type: 'groundout', text: `${batter.name} grounds to ${out.posName || out.pos} — ${takeout.text}` });
            state.lastPlay = { type: 'groundout', text: `${batter.name} grounds — DP broken up` };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
            if (takeout.injuryTrigger) {
              const mi = getDefensivePlayers(state);
              const fielder2B = mi['2B'] || mi['SS'] || null;
              state._pendingCollisionInjury = {
                runner: (takeout.injuredParty === 'runner' || takeout.injuredParty === 'both') ? r1 : null,
                fielder: (takeout.injuredParty === 'fielder' || takeout.injuredParty === 'both') ? fielder2B : null,
                trigger: takeout.injuryTrigger,
              };
            }
            return;
          }
          if (r1 && r2 && !isMI) { const r3 = state.bases[2]; if (r3 && state.outs < 2) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; } state.bases[2] = null; state.bases[1] = r1 || null; state.bases[0] = null; }
          else { const r3dp = state.bases[2]; if (r3dp && state.outs < 2) { r3dp.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.bases[2] = null; } if (state.bases[1]) { state.bases[2] = state.bases[2] || state.bases[1]; state.bases[1] = null; } state.bases[0] = null; const dpLine = pickLine(DOUBLE_PLAY_LINES); const dpFielderPos = out.pos; const dpFielderName = defenders[dpFielderPos]?.name?.split(' ').pop() || dpFielderPos; const ssName = defenders['SS']?.name?.split(' ').pop() || 'short'; const b2Name = defenders['2B']?.name?.split(' ').pop() || 'second'; let dpRoute; if (dpFielderPos === '2B') { dpRoute = `${dpFielderName} to ${ssName} covering, relay to first`; } else if (dpFielderPos === 'SS') { dpRoute = `${dpFielderName} to ${b2Name} covering, relay to first`; } else if (dpFielderPos === '3B') { dpRoute = `${dpFielderName} to ${b2Name}, relay to first`; } else if (dpFielderPos === '1B') { dpRoute = `${dpFielderName} to ${ssName} covering second, back to first`; } else if (dpFielderPos === 'SP') { dpRoute = `${dpFielderName} to ${b2Name}, relay to first`; } else { dpRoute = `${b2Name} to first`; } const dpText = dpLine.includes('grounds into') ? `${batter.name} ${dpLine}` : `${batter.name} grounds to ${dpFielderName} — ${dpRoute} — ${dpLine}`; state.log.push({ type: 'doubleplay', text: dpText }); state.lastPlay = { type: 'doubleplay', text: dpText }; }
          state.balls = 0; state.strikes = 0; advanceBatter(state);
          recordOut(state); // first out of the DP
          if (!state.gameOver && state.outs < 3) { // only attempt the second out if the inning is still live
              recordOut(state); // second out (recordOut handles endHalfInning if this is the 3rd)
          }
          return;
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
    const isOutfieldFly = isFlyBall && out.type !== 'popout' && out.type !== 'lineout' && out.depth !== 'shallow';
    if (isOutfieldFly && state.bases[2] && state.outs < 2) { const r = state.bases[2]; const d2 = out.depth === 'deep'; const db = d2 ? 0.30 : 0.05; const sfc = 0.30 + db + (r.speed / 10) * 0.42 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.10, Math.min(sfc, 0.90))) { r.gameStats.runs++; scoreRun(state); state.bases[2] = null; batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; const sfText = `${batter.name} ${pickLine(SAC_FLY_LINES)} ${r.name} tags and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; state._celebrationBubble = sfText; batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } }
    if (isOutfieldFly) { const r3 = state.bases[2], r2 = state.bases[1], r1 = state.bases[0]; const isDeep = out.depth === 'deep'; if (r3 && state.outs < 2) { const db2 = isDeep ? 0.40 : 0.10; const htc = db2 + (r3.speed / 10) * 0.30 - (getOutfieldArm(defenders) / 10) * 0.08;         if (Math.random() < Math.max(0.05, Math.min(htc, 0.65))) { r3.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; state.bases[2] = null; const sfText = `${r3.name} tags up and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; state._celebrationBubble = sfText; if (r2 && state.outs < 2) { const tc2 = isDeep ? (0.15 + (r2.speed / 10) * 0.40 - (getOutfieldArm(defenders) / 10) * 0.10) : (0.05 + (r2.speed / 10) * 0.25 - (getOutfieldArm(defenders) / 10) * 0.08); if (Math.random() < Math.max(0.03, Math.min(tc2, 0.35))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r2.name} tags up and advances to third!`; } } batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } } if (r1 && isDeep && !state.bases[1] && state.outs < 2) { const r1Tag = state.bases[0]; if (r1Tag) { const tc1 = 0.15 + (r1Tag.speed / 10) * 0.45 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.06, Math.min(tc1, 0.55))) { state.bases[1] = r1Tag; state.bases[0] = null; state.log.push({ type: 'info', text: `${r1Tag.name} tags up and advances to second!` }); state._celebrationBubble = `🏃 ${r1Tag.name} tags up and advances to second!`; } } }     if (r2 && state.outs < 2 && !state.bases[2]) { const depthBonus2 = isDeep ? 0.25 : 0; const tc3 = 0.10 + (r2.speed / 10) * 0.35 - (getOutfieldArm(defenders) / 10) * 0.10 + depthBonus2; const cap2 = isDeep ? 0.85 : 0.35; if (Math.random() < Math.max(0.04, Math.min(tc3, cap2))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r2.name} tags up and advances to third!`; } } }
    // ── Defensive Plays: Diving Catches (flyouts) & Diving Stops (groundouts) ──
    const isDefFly = out.type === 'flyout';
    if (isDefFly) {
      // Rare catch event (snow cone, juggled, sliding) — very rare
      if (rollRareCatchEvent()) {
        const rareTypes = ['snowCone', 'juggled', 'sliding', 'overShoulder'];
        const rareType = rareTypes[Math.floor(Math.random() * rareTypes.length)];
        const fielder = defenders[out.pos] || { name: 'the fielder' };
        const rareCall = getRareCatchCall(fielder.name, rareType);
        out.text = rareCall;
        state.log.push({ type: 'flyout', text: rareCall });
        state.lastPlay = { type: 'flyout', text: rareCall };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        return;
      }
      // Diving catch
      if (rollDivingCatch()) {
        const fielder = defenders[out.pos] || { name: 'the outfielder' };
        const dcCall = getDivingCatchCall(state.homeTeam, fielder.name, out.pos);
        out.text = dcCall;
        out.isDivingCatch = true;
      }
    } else if (out.type === 'groundout') {
      // Diving ground-ball stop
      if (rollDivingStop()) {
        const fielder = defenders[out.pos] || { name: 'the infielder' };
        const dsResult = getDivingStopResult(state.homeTeam, fielder.name, out.pos);
        if (dsResult.type === 'out') {
          // Spectacular out — diving stop followed by throw
          out.text = dsResult.text;
          out.divingStopOut = true;
          out.divingStopPos = dsResult.pos;
        } else if (dsResult.type === 'knockdown') {
          // Knocked down — ball stayed in the infield, runners advance conservatively
          batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
          if (state.bases[2]) { state.bases[2].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.bases[2] = null; }
          if (state.bases[1]) { if (!state.bases[2]) { state.bases[2] = state.bases[1]; } else { state.bases[1].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; } state.bases[1] = null; }
          if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
          state.bases[0] = batter;
          state.log.push({ type: 'single', text: dsResult.text, divingStopPos: dsResult.pos });
          state.lastPlay = { type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, infield: true };
          state.balls = 0; state.strikes = 0; advanceBatter(state);
          return;
        } else {
          // Save a double — diving stop kept ball in the infield, holds batter to single
          batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
          if (state.bases[2]) { state.bases[2].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; state.bases[2] = null; }
          if (state.bases[1]) { if (!state.bases[2]) { state.bases[2] = state.bases[1]; } else { state.bases[1].gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; } state.bases[1] = null; }
          if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
          state.bases[0] = batter;
          state.log.push({ type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, divingStopSave: true });
          state.lastPlay = { type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, divingStopSave: true, infield: true };
          state.balls = 0; state.strikes = 0; advanceBatter(state);
          return;
        }
      }
    }

    const outExtra = {};
    if (out.divingStopOut) { outExtra.divingStopOut = true; outExtra.divingStopPos = out.divingStopPos; }
    state.log.push({ type: isFlyBall ? 'flyout' : 'groundout', text: out.text, ...outExtra });
    state.lastPlay = { type: isFlyBall ? 'flyout' : 'groundout', text: out.text, ...outExtra };
    state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
    // Celebrations on diving catch or inning-ending out
    if (out.isDivingCatch) {
      const fc = rollFielderCelebration(TEAMS[state.homeTeam]?.stadium); if (fc) { state.log.push({ type: 'info', text: `🎉 ${fc}` }); state._celebrationBubble = `🎉 ${fc}`; }
    }
    // Only celebrate retire-side on actual inning-ending 3rd out — check AFTER recordOut
    if (state.outs >= 3 && state._pitcherRetiredSideName && !state.gameOver) {
      const pitcherObj = { name: state._pitcherRetiredSideName };
      const rc = rollPitcherRetireSide(pitcherObj); if (rc) { state.log.push({ type: 'info', text: `🔥 ${rc}` }); state._celebrationBubble = `🔥 ${rc}`; }
      delete state._pitcherRetiredSideName;
    }
  }
}

// ── Process base outs from advanceRunners + batter stretching after a hit ──
function processPostHitBaserunning(state, hitType, batter, defenders) {
  if (state._pendingBaseOuts && state._pendingBaseOuts.length > 0) {
    for (const out of state._pendingBaseOuts) {
      state.log.push({ type: 'info', text: out.text });
      if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} — ${out.text}`;
      recordOut(state);
      if (state.outs >= 3) { delete state._pendingBaseOuts; return; }
    }
    delete state._pendingBaseOuts;
  }
  if (state.outs >= 3 || state.gameOver) return;
  const ofArm = getOutfieldArm(defenders);
  const stretch = checkBatterStretch(hitType, batter, ofArm);
  if (stretch.type === 'none') return;
  if (stretch.type === 'caught') {
    if (hitType === 'single') state.bases[0] = null;
    else if (hitType === 'double') state.bases[1] = null;
    else if (hitType === 'triple') state.bases[2] = null;
    state.log.push({ type: 'info', text: stretch.text });
    if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} — ${stretch.text}`;
    state._celebrationBubble = `${stretch.text}`;
    recordOut(state);
  } else if (stretch.type === 'safe_double') {
    state.bases[1] = batter; state.bases[0] = null;
    state.log.push({ type: 'info', text: stretch.text });
    if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} — ${stretch.text}`;
  } else if (stretch.type === 'safe_triple') {
    state.bases[2] = batter; state.bases[1] = null;
    state.log.push({ type: 'info', text: stretch.text });
    if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} — ${stretch.text}`;
  } else if (stretch.type === 'inside_park_hr') {
    state.bases[2] = null;
    batter.gameStats.hr++; batter.gameStats.runs++; batter.gameStats.rbi++;
    scoreRun(state);
    getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++;
    state.log.push({ type: 'homerun', text: stretch.text });
    state.lastPlay = { type: 'homerun', text: stretch.text };
  }
}

// ── Process tag-up outcomes on outfield flyouts (sac fly, 2nd→3rd, 1st→2nd) ──
// Returns true if a tag-up was resolved (caller should return), false otherwise.
function processFlyoutTagUps(state, out, defenders, batter) {
  const depth = out.depth;
  const fieldPos = out.pos;
  const ofArm = getOutfieldArm(defenders);

  // ── Runner on 3rd tagging up to score (sac fly) ──
  if (state.bases[2]) {
    const r = state.bases[2];
    const sf = r.speed / 10;
    let attemptChance;
    if (depth === 'deep') attemptChance = 0.50 + sf * 0.40;
    else if (depth === 'medium') attemptChance = 0.10 + sf * 0.50;
    else attemptChance = Math.max(0, (sf - 0.5) * 0.40);
    attemptChance = Math.max(0.02, Math.min(attemptChance, 0.92));

    if (Math.random() < attemptChance) {
      const caughtChance = 0.03 + (ofArm / 10) * 0.06 - sf * 0.03;
      if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.10))) {
        // Thrown out at home!
        r.gameStats.cs = (r.gameStats.cs || 0) + 1;
        state.bases[2] = null; batter.gameStats.ab--;
        const outText = `${r.name} — ${pickLine(TAG_UP_THIRD_TO_HOME_OUT_LINES)}`;
        state.log.push({ type: 'info', text: outText }); state.lastPlay = { type: 'info', text: outText };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        return true;
        }
        // Safe — scores
      r.gameStats.runs++; scoreRun(state); state.bases[2] = null;
      batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++;
      const sfText = `${batter.name} ${pickLine(SAC_FLY_LINES)} ${r.name} tags and scores!`;
      state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText };
      state._celebrationBubble = sfText;
      batter.gameStats.ab--;
      // Check if runner on 2nd also tags up to 3rd
      if (state.bases[1] && state.outs < 2 && !state.bases[2]) {
        const r2 = state.bases[1];
        const isCORF = ['CF', 'RF'].includes(fieldPos);
        if (isCORF && (depth === 'medium' || depth === 'deep')) {
          const r2sf = r2.speed / 10;
          const r2Chance = depth === 'deep' ? 0.15 + r2sf * 0.40 : 0.05 + r2sf * 0.25;
          if (Math.random() < Math.max(0.03, r2Chance)) {
            const r2Caught = 0.05 + (ofArm / 10) * 0.15 - r2sf * 0.08;
            if (Math.random() < Math.max(0.03, Math.min(r2Caught, 0.25))) {
              r2.gameStats.cs = (r2.gameStats.cs || 0) + 1;
              state.bases[1] = null;
              state.log.push({ type: 'info', text: `${r2.name} — ${pickLine(TAG_UP_SECOND_TO_THIRD_OUT_LINES)}` });
            } else {
              state.bases[2] = r2; state.bases[1] = null;
              state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r2.name} tags up and advances to third!`;
            }
          }
        }
      }
      state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
      return true;
    }
  }

  // ── Runner on 2nd tagging up to 3rd (CF/RF only, medium/deep, reduced frequency) ──
  if (state.bases[1] && !state.bases[2]) {
    const r = state.bases[1];
    const isCORF = ['CF', 'RF'].includes(fieldPos);
    if (isCORF && (depth === 'medium' || depth === 'deep')) {
      const sf = r.speed / 10;
      const attemptChance = depth === 'deep' ? 0.04 + sf * 0.20 : 0.02 + sf * 0.10;
      if (Math.random() < Math.max(0.008, attemptChance)) {
        const caughtChance = 0.05 + (ofArm / 10) * 0.15 - sf * 0.08;
        if (Math.random() < Math.max(0.03, Math.min(caughtChance, 0.25))) {
          r.gameStats.cs = (r.gameStats.cs || 0) + 1;
          state.bases[1] = null; batter.gameStats.ab--;
          const outText = `${r.name} — ${pickLine(TAG_UP_SECOND_TO_THIRD_OUT_LINES)}`;
          state.log.push({ type: 'info', text: outText }); state.lastPlay = { type: 'info', text: outText };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
          return true;
        }
        state.bases[2] = r; state.bases[1] = null;
        state.log.push({ type: 'info', text: `${r.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r.name} tags up and advances to third!`;
      }
    }
  }

  // ── Runner on 1st tagging up to 2nd (EXTREMELY rare, deep only, fast runner + poor arm) ──
  if (state.bases[0] && !state.bases[1] && depth === 'deep') {
    const r = state.bases[0];
    const sf = r.speed / 10;
    // Drastically reduced: only very fast runners (8+) with poor arms, 1% base chance max
    const attemptChance = Math.max(0, (sf - 0.6) * 0.04 - (ofArm / 10) * 0.03);
    if (Math.random() < Math.max(0.001, Math.min(attemptChance, 0.01))) {
      const caughedChance = 0.10 + (ofArm / 10) * 0.20 - sf * 0.10;
      if (Math.random() < Math.max(0.05, Math.min(caughedChance, 0.35))) {
        r.gameStats.cs = (r.gameStats.cs || 0) + 1;
        state.bases[0] = null; batter.gameStats.ab--;
        const outText = `${r.name} — ${pickLine(TAG_UP_FIRST_TO_SECOND_OUT_LINES)}`;
        state.log.push({ type: 'info', text: outText }); state.lastPlay = { type: 'info', text: outText };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        return true;
      }
      state.bases[1] = r; state.bases[0] = null;
      state.log.push({ type: 'info', text: `${r.name} tags up and advances to second!` }); state._celebrationBubble = `🏃 ${r.name} tags up and advances to second!`;
    }
  }

  return false;
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
  if (hrr < pr * 0.065 * hrMod) { batter.gameStats.hr++; const hrRbi = advanceRunners(state, 4, batter); const battingTeamKeyHR = state.halfInning === 'top' ? state.awayTeam : state.homeTeam; const hrCallHR = maybeGetAnnouncerHRCall(battingTeamKeyHR, { isGrandSlam: false, rbi: hrRbi, batterName: batter.name }); if (hrCallHR) state.log.push({ type: 'homerun', text: `🎙️ ${hrCallHR}` }); const hrText = `💥 ${batter.name} crushes one on the hit-and-run — HOME RUN!`; state.log.push({ type: 'homerun', text: hrText }); state.lastPlay = { type: 'homerun', text: hrText }; }
  else if (hrr < pr * 0.32 * doubleMod) { advanceRunners(state, 2, batter, true); const e = advanceHitAndRunRunners(state, batter); const dblText = e ? `${batter.name} rips a double on the hit-and-run! ${e}` : `${batter.name} doubles on the hit-and-run!`; state.log.push({ type: 'double', text: dblText }); state.lastPlay = { type: 'double', text: dblText }; }
  else { advanceRunners(state, 1, batter, true); const e = advanceHitAndRunRunners(state, batter); const sglText = e ? `${batter.name} slaps a single — hit-and-run! ${e}` : `${batter.name} singles on the hit-and-run!`; state.log.push({ type: 'single', text: sglText }); state.lastPlay = { type: 'single', text: sglText }; }
  } else {
    const orr = Math.random();
    if (orr < 0.45) { const gps = ['SS','2B','3B','SP','1B']; const gp = gps[Math.floor(Math.random() * gps.length)]; let sn = []; for (let i = 2; i >= 0; i--) { const r = state.bases[i]; if (!r) continue; if (i + 1 >= 3) { r.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; pitcher.gameStats.r++; pitcher.gameStats.er++; sn.push(r.name.split(' ').pop()); state.bases[i] = null; } else if (!state.bases[i + 1]) { state.bases[i + 1] = r; state.bases[i] = null; } } const goText = `${batter.name} grounds out to ${pn[gp]}${sn.length ? ` — ${sn.join(', ')} scores` : ''} — runners advance on the hit-and-run`; state.log.push({ type: 'groundout', text: goText }); state.lastPlay = { type: 'groundout', text: goText }; recordOut(state); }
    else if (orr < 0.68) { const fpk = ['LF','CF','RF']; const fp = fpk[Math.floor(Math.random() * fpk.length)]; const dr = Math.random(); const isD = dr < 0.35, isS = dr > 0.65; let foText; if (isS) foText = `${pickLine(SHALLOW_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch — caught on the hit-and-run.`; else if (isD) foText = `${pickLine(DEEP_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch — caught on the hit-and-run.`; else foText = `${pickLine(MEDIUM_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch — caught on the hit-and-run.`; state.log.push({ type: 'flyout', text: foText }); state.lastPlay = { type: 'flyout', text: foText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; if (isD && i === 2 && state.outs < 3) { const tc = 0.15 + (r.speed / 10) * 0.40; if (Math.random() < tc) { r.gameStats.runs++; scoreRun(state); batter.gameStats.rbi++; getCurrentPitcher(state).gameStats.r++; getCurrentPitcher(state).gameStats.er++; state.bases[i] = null; batter.gameStats.ab--; state.log.push({ type: 'sacfly', text: `${r.name} tags and scores on the deep fly!` }); } } else if (isS && state.outs < 3) { let ct = false, tb = ''; if (fp === 'RF' && i <= 1) { ct = true; tb = i === 0 ? 'first' : 'second'; } else if (fp === 'CF' && i === 1) { ct = true; tb = 'second'; } else if (fp === 'LF' && i >= 1) { ct = true; tb = i === 1 ? 'second' : 'third'; } if (ct) { const ofa = (defenders[fp]?.arm || 5) / 10; if (Math.random() < Math.max(0.05, Math.min(0.18 + ofa * 0.25 - (r.speed / 10) * 0.12, 0.50))) { state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} can't get back to ${tb} — doubled off on the hit-and-run!` }); recordOut(state); break; } } } } } }
    else if (orr < 0.88) { const lpk = ['3B','SS','1B','2B']; const lp = lpk[Math.floor(Math.random() * lpk.length)]; const f = defenders[lp]; const loText = `${pickLine(Math.random() < 0.5 ? INFIELD_LINEOUT_SOFT_LINES : INFIELD_LINEOUT_HARD_LINES)} ${f?.name || pn[lp]} makes the catch — caught on the hit-and-run.`; state.log.push({ type: 'lineout', text: loText }); state.lastPlay = { type: 'lineout', text: loText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const doc = 0.50 + ((f?.arm || 5) / 10) * 0.15 - (r.speed / 10) * 0.10; if (state.outs < 3 && Math.random() < Math.max(0.25, Math.min(doc, 0.75))) { state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} doubled off ${['first','second','third'][i]} — caught on the hit-and-run!` }); recordOut(state); break; } } } }
    else { const ppk = ['C','2B','3B']; const pp = ppk[Math.floor(Math.random() * ppk.length)]; const f = defenders[pp]; const poText = `${pickLine(INFIELD_POPUP_LINES)} ${f?.name || pn[pp]} makes the catch — runners hold on the hit-and-run.`; state.log.push({ type: 'popout', text: poText }); state.lastPlay = { type: 'popout', text: poText }; recordOut(state); }
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
  for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const cc = 0.50 - (r.speed / 10) * 0.30; if (Math.random() < cc) { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; recordOut(state); const tb = i + 1; const bn = tb === 1 ? 'second' : tb === 2 ? 'third' : 'home'; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, bn)} on the hit-and-run!` }); break; } else { if (i + 1 < 3) { state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, ['second','third'][i])} on the hit-and-run!` }); } } }
  state.hitAndRun = false;
}

function handleHitAndRunMiss(state) {
  for (let i = 0; i < 2; i++) { const r = state.bases[i]; if (!r || state.bases[i + 1]) continue; const d = getDefensivePlayers(state); const ca = getCatcherArm(d); const sc = 0.20 + (r.speed / 10) * 0.55 - (ca / 10) * 0.12; if (Math.random() < Math.max(0.10, Math.min(sc, 0.75))) { r.gameStats.sb = (r.gameStats.sb || 0) + 1; state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.success).replace(/second|third|home/, i === 0 ? 'second' : 'third')} on the hit-and-run` }); } else { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} ${pickLine(STEAL_LINES.caught).replace(/second|third|home/, i === 0 ? 'second' : 'third')} on the hit-and-run!` }); recordOut(state); } break; }
}

function runInjuryChecks(newState, batter) {
  const lp = newState.lastPlay; if (!lp) return;
  // §1 QUALIFYING events only — no checks on routine plays
  let eventType = null;
  let targetName = batter.name;

  if (lp.type === 'walk' && lp.isHBP) {
    // HBP: scale intensity by pitch speed
    const pitcher = getCurrentPitcher(newState);
    const pitchSpeed = pitcher?.pitchSpeed || 6;
    const r = checkPlayInjury(newState, 'hit_by_pitch', batter.name);
    // Pass pitch speed context via manual maybeInjure isn't exposed — the default is fine; pitchSpeed
    // modifier is handled via options but checkPlayInjury passes state; intensity is internal.
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  if (lp.type === 'steal') {
    // Sprint injury on successful steal
    const runner = newState.bases.find(b => b && b.name !== batter.name) || batter;
    const r = checkPlayInjury(newState, 'steal_success', runner.name);
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  if (lp.type === 'caughtstealing') {
    // Hard slide on caught stealing
    const runner = newState.bases.find(b => b) || batter;
    const r = checkPlayInjury(newState, 'steal_attempt', runner.name);
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  // ── Takeout slide: check when a double-play or FC is explicitly broken up ──
  if (lp.type === 'groundout' && lp.text?.toLowerCase().includes('takeout')) {
    // Both the pivot man and the runner can be hurt
    const r = checkPlayInjury(newState, 'takeout_slide', batter.name);
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  // ── Home-plate collision: explicit collision text ──
  if (lp.collision) {
    // The runner or the catcher — collision flag set by rollCollision
    const r = checkPlayInjury(newState, 'collision', batter.name);
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  // ── Diving catch: outfield diving play ──
  if (lp.isDivingCatch || lp.divingCatch) {
    const pitcher = getCurrentPitcher(newState);
    const defenders = getDefensivePlayers(newState);
    const outfielders = ['LF', 'CF', 'RF'];
    let fielder = null;
    for (const pos of outfielders) {
      if (defenders[pos]) { fielder = defenders[pos]; break; }
    }
    if (fielder) {
      const r = checkPlayInjury(newState, 'diving_catch', fielder.name);
      if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    }
    return;
  }

  // ── Sprint pull: triple (hard leg push) — optional rare wildcard ──
  if (lp.type === 'triple') {
    const r = checkPlayInjury(newState, 'sprint_pull', batter.name);
    if (r) { newState.lastInjury = r; applyInjuryState(newState, r); newState.log.push({ type: 'injury', text: `🚑 ${r.commentary}` }); }
    return;
  }

  // Everything else: no injury check (clean single, flyout, strikeout, HR, etc.)
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

// ── Single source of truth for control-side logic ──
function getControllingTeam(state, context) {
  // context: 'batting' | 'pitching' | null (either team)
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

export function processAtBat(state, pitchType, swingType) {
   const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
   const newState = JSON.parse(JSON.stringify(state));
   delete newState._celebrationBubble;

   // Track lead state BEFORE play for lead-change penalty detection
   const userSide = newState.homeTeam === newState.userTeam ? 'home' : 'away';
   const userScore = newState.score[userSide];
   const oppScore = newState.score[userSide === 'home' ? 'away' : 'home'];
   const preLead = userScore > oppScore ? 'ahead' : userScore === oppScore ? 'tied' : 'behind';
   newState._pitcherLeadState = preLead;

   // Track PITCHING TEAM's lead for symmetric lead-change penalty
   const _prePitchSide = newState.halfInning === 'top' ? 'home' : 'away';
   const _prePitchScore = newState.score[_prePitchSide];
   const _preBatScore = newState.score[_prePitchSide === 'home' ? 'away' : 'home'];
   newState._prePitchingLead = _prePitchScore > _preBatScore ? 'ahead' : _prePitchScore === _preBatScore ? 'tied' : 'behind';

   // ── PHASE 3.0: DEFENSIVE POSITIONING (per plate appearance) ──
   const defensiveAlignment = choose_alignment({
     runner_on_3rd: !!newState.bases[2],
     runner_on_1st: !!newState.bases[0],
     outs: newState.outs,
     inning: newState.inning,
     score_margin: newState.score[userSide] - newState.score[userSide === 'home' ? 'away' : 'home'],
     current_pitcher_leads_by: (by1, by2) => {
       const margin = newState.score[userSide] - newState.score[userSide === 'home' ? 'away' : 'home'];
       return margin >= by1 && margin <= by2;
     },
     current_batter_pwr: getCurrentBatter(newState).power || 5,
     expect_bunt: expect_bunt({
       batter_is_pitcher: getCurrentBatter(newState).is_pitcher || getCurrentBatter(newState).pos === 'SP',
       runner_on_1st: !!newState.bases[0],
       outs: newState.outs,
     }),
   });
   newState._defensiveAlignment = defensiveAlignment;
   
   // ── PHASE 2.9: INTENTIONAL WALK DECISION GATE (fresh count only) ──
   // Only evaluate at the START of a plate appearance (0-0 count)
   // CPU-CONTROLLED PITCHERS ONLY — user cannot auto-IBB
   if (newState.balls === 0 && newState.strikes === 0) {
     const isCpuPitching = getControllingTeam(newState, 'pitching') === 'cpu';

     if (isCpuPitching && newState.inning >= 7) {
       const batter = getCurrentBatter(newState);
       const battingTeam = getBattingTeam(newState);
       const battingTeamIndex = battingTeam === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex;
       const battingLineup = battingTeam === 'home' ? newState.homeLineup : newState.awayLineup;

       // Get on-deck batter (next in lineup)
       const onDeckIndex = (battingTeamIndex + 1) % battingLineup.length;
       const onDeckBatter = battingLineup[onDeckIndex];

       const ibbGate = shouldIntentionalWalk({
         current_batter: batter,
         on_deck_batter: onDeckBatter,
         runner_on_1st: !!newState.bases[0],
         runners_on_2nd: !!newState.bases[1],
         runners_on_3rd: !!newState.bases[2],
         bases_empty: !newState.bases.some(b => b !== null),
         outs: newState.outs,
         inning: newState.inning,
         score_margin: newState.score[userSide] - newState.score[userSide === 'home' ? 'away' : 'home'],
         batter_is_hot: newState._batter_hot_streak || false,
         first_base_open: !newState.bases[0],
         on_deck_gives_platoon_advantage: false,  // Optional: could add pitch hand logic
         walk_puts_winning_run_on_base: () => {
           // Winning run on base if: walk loads runner at scoring position in lead scenario
           return newState.score[userSide] > newState.score[userSide === 'home' ? 'away' : 'home'] &&
                  newState.bases[2] && newState.bases[0] === null;
         },
       });

       if (ibbGate) {
         const pitcher = getCurrentPitcher(newState);
         const ibbResult = issue_ibb({
           current_batter: batter,
           runner_on_1st: newState.bases[0],
           runner_on_2nd: newState.bases[1],
           runner_on_3rd: newState.bases[2],
         });

         // Execute the walk
         batter.gameStats.bb++;
         pitcher.gameStats.bb++;
         pitcher.gameStats.pitches += 4;  // Log 4 pitches for IBB

         // IBB: runners only advance if forced (when 1st base is occupied)
         const isForce = !!newState.bases[0];
         if (isForce) {
           // Forced advance: move all runners up one base
           if (newState.bases[2]) {
             newState.bases[2].gameStats.runs++;
             scoreRun(newState);
             batter.gameStats.rbi++;
             pitcher.gameStats.r++;
             pitcher.gameStats.er++;
           }
           if (newState.bases[1]) {
             newState.bases[2] = newState.bases[1];
           }
           if (newState.bases[0]) {
             newState.bases[1] = newState.bases[0];
           }
         }
         newState.bases[0] = batter;

         // Log
         newState.log.push({ type: 'walk', text: ibbResult.text });
         newState.lastPlay = { type: 'walk', text: ibbResult.text, isIBB: true };

         // Composure: pitcher not penalized (managerial call)
         // Batter walked intentionally = neutral
         // On-deck hitter = small pressure bonus
         applyComposure(pitcher, newState, 'ibb_issued');  // Neutral

         newState.balls = 0;
         newState.strikes = 0;
         advanceBatter(newState);

         if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
           newState.gameOver = true;
           newState.waitingForInput = false;
           newState.log.push({ type: 'info', text: `🎉 Walk-off IBB! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
         }

         return newState;
       }
     }
   }

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
    applyComposureFromLastPlay(newState, pitcher);

    // ── Symmetric lead-change penalty: whichever pitcher blew the lead gets penalized ──
    const _rbPitchSide = state.halfInning === 'top' ? 'home' : 'away';
    const _rbPostPitch = newState.score[_rbPitchSide];
    const _rbPostBat = newState.score[_rbPitchSide === 'home' ? 'away' : 'home'];
    const _rbPostLead = _rbPostPitch > _rbPostBat ? 'ahead' : _rbPostPitch === _rbPostBat ? 'tied' : 'behind';

    if (newState._prePitchingLead === 'ahead' && _rbPostLead === 'behind') {
      newState._just_lost_lead = true;
      if (pitcher && pitcher._composure) {
        applyLeadChangePenalty(pitcher._composure);
      }
    } else {
      newState._just_lost_lead = false;
    }

    processComposureEvents(newState, pitcher);
    return newState;
    }

  if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) { const sr = attemptSteal(newState, newState.pendingSteal); Object.assign(newState, sr); if (newState.gameOver) return newState; if (sr.lastPlay?.type === 'caughtstealing') { applyComposure(getCurrentPitcher(newState), newState, 'caughtstealing'); return newState; } }
  // Clear reach-back flag — it was consumed by the last render
  delete newState._wasReachBack;
  const pitcher = getCurrentPitcher(newState), effP = getEffectivePitcher(newState) || pitcher;
  const batter = getCurrentBatter(newState);
  const wc = Math.max(0.01, (10 - (effP.effectiveControl || effP.control)) * 0.005);
  if (Math.random() < wc) { batter.gameStats.bb++; pitcher.gameStats.bb++; pitcher.gameStats.pitches += 4; newState.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); newState.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(newState, batter); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off walk! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } applyComposure(pitcher, newState, 'walk'); return newState; }
  newState.pitchResult = resolvePitch(newState, pitchType);
  if (!newState.userPitchTypes) newState.userPitchTypes = [];
  if (!newState.userPitchTypes.includes(pitchType.name)) newState.userPitchTypes = [...newState.userPitchTypes, pitchType.name];
  if (newState.pitchResult.isWildPitch) { if (newState.balls >= 4) { const wb = getCurrentBatter(newState); wb.gameStats.bb++; getCurrentPitcher(newState).gameStats.bb++; newState.log.push({ type: 'walk', text: `${wb.name} walks on a wild pitch!` }); handleWalk(newState, wb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); } applyComposure(pitcher, newState, 'wildpitch'); return newState; }
  if (newState.pitchResult.isHBP) { const hb = getCurrentBatter(newState); const hbp = getCurrentPitcher(newState); hb.gameStats.bb++; hbp.gameStats.bb++; const hbpReason = newState.pitchResult.hbpReason || null; const wasWarned = newState._beanball?.warningIssued; registerHBP(newState, hbp, hb, hbpReason); const hbpText = `${hb.name} is hit by the pitch!`; newState.log.push({ type: 'walk', text: hbpText }); newState.lastPlay = { type: 'walk', text: `${hb.name} is hit by the pitch! — takes first`, isHBP: true, hbpReason }; handleWalk(newState, hb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); const warned = checkForWarning(newState); if (warned) newState._beanballWarning = true; if (wasWarned) { const pitchingSide = newState.halfInning === 'top' ? 'home' : 'away'; const ejectKey = pitchingSide === 'home' ? '_homePitcherEjected' : '_awayPitcherEjected'; const mgrEjectKey = pitchingSide === 'home' ? '_homeManagerEjected' : '_awayManagerEjected'; newState[ejectKey] = true; newState[mgrEjectKey] = true; newState._beanball.autoEjectionPitcher = hbp.name; newState._beanball.autoEjectionSide = pitchingSide; newState._pendingEjectionReplacement = true; const tAbbr = TEAMS[newState[pitchingSide === 'home' ? 'homeTeam' : 'awayTeam']]?.abbr || ''; newState.log.push({ type: 'ejection', text: `🟥 ${hbp.name} EJECTED — hit batter after warnings! ${tAbbr} manager also ejected!` }); } if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off HBP! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } applyComposure(pitcher, newState, 'hbp'); return newState; }
  const bjb = getCurrentBatter(newState);

  // ── PHASE 2.8: PINCH-HIT DECISION GATE (pitcher due at bat) ──
   // CPU-ONLY: only the computer manager decides to pinch-hit
   const isPitcherBatting = bjb.is_pitcher || bjb.pos === 'SP' || bjb.pos === 'RP' || bjb.pos === 'CL' || (bjb.assignedPos && ['SP', 'RP', 'CL'].includes(bjb.assignedPos));
   const isCpuBatting = getControllingTeam(newState, 'batting') === 'cpu';
   if (isPitcherBatting && isCpuBatting) {
    const battingTeamSide = getBattingTeam(newState) === 'home' ? 'home' : 'away';
    const benchTeam = battingTeamSide === 'home' ? newState.homeTeam : newState.awayTeam;
    const benchList = TEAMS[benchTeam]?.bench || [];
    const bullpen = battingTeamSide === 'home' ? newState.homeBullpen : newState.awayBullpen;
    const cpuPitcherObj = battingTeamSide === 'home' ? newState.homePitcher : newState.awayPitcher;

    const phGate = shouldPinchHit({
      runners_in_scoring_position: !!newState.bases[2] && (!!newState.bases[0] || !!newState.bases[1]),
      runners_on: !!newState.bases[0] || !!newState.bases[1] || !!newState.bases[2],
      outs: newState.outs,
      inning: newState.inning,
      score_margin: newState.score[getBattingTeam(newState)] === newState.score[getBattingTeam(newState) === 'home' ? 'away' : 'home'] ? 0 : newState.score[getBattingTeam(newState)] - newState.score[getBattingTeam(newState) === 'home' ? 'away' : 'home'],
      available_bench: benchList,
      current_pitcher_ip: cpuPitcherObj.gameStats.ip || 0,
      bullpen: bullpen,
      used_this_inning: [],
      is_starter: cpuPitcherObj.pos === 'SP',
      pitcher_runs_allowed: cpuPitcherObj.gameStats.r || 0,
      pitcher_walks_allowed: cpuPitcherObj.gameStats.bb || 0,
    });

    if (phGate) {
      const phitter = choose_pinch_hitter({
        available_bench: benchList,
        runners_in_scoring_position: !!newState.bases[2] && (!!newState.bases[0] || !!newState.bases[1]),
        need_baserunner: newState.score[getBattingTeam(newState)] < newState.score[getBattingTeam(newState) === 'home' ? 'away' : 'home'],
      });

      if (phitter) {
        // Pin-hitter substitution via the existing pinchHit function
        const afterPH = pinchHit(newState, phitter);

        // Merge substitution state
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

        // Mark pitcher as out of the game — bullpen must replace him next half-inning
        newState._pitcher_due_for_replacement = true;
        newState.log.push({ type: 'info', text: `🔄 ${phitter.name} pinch-hits for ${bjb.name}` });

        // Continue normal swing now with the pinch hitter
        const newBatter = getCurrentBatter(newState);
        const newPitcher = getCurrentPitcher(newState);

        resolveSwing(newState, swingType, newState.pitchResult);

        if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
          newState.gameOver = true; newState.waitingForInput = false;
          newState.log.push({ type: 'info', text: `🎉 Walk-off! ${TEAMS[newState.homeTeam].name} win ${newState.score.home}-${newState.score.away}!` });
        }
        if (!newState.gameOver) runInjuryChecks(newState, newBatter);
        if (!newState.gameOver && !newState.lastInjury) {
          const pi = checkPitcherInjury(newState);
          if (pi) { newState.lastInjury = pi; applyInjuryState(newState, pi); newState.log.push({ type: 'injury', text: `🚑 ${pi.commentary}` }); }
        }
        applyComposureFromLastPlay(newState, newPitcher);
        processComposureEvents(newState, newPitcher);
        return newState;
      }
    }
  }

  // ── PHASE 2.7: PRE-SWING BUNTING DECISION GATE (CPU-CONTROLLED TEAMS ONLY) ──
  const isCpuBattingForBunt = getControllingTeam(newState, 'batting') === 'cpu';
  const buntDecision = isCpuBattingForBunt ? shouldBunt(bjb, {
    runner_on_1st: !!newState.bases[0],
    runner_on_2nd: !!newState.bases[1],
    runner_on_3rd: !!newState.bases[2],
    outs: newState.outs,
    inning: newState.inning,
    score_margin: newState.score[getBattingTeam(newState)] - newState.score[getBattingTeam(newState) === 'home' ? 'away' : 'home'],
    bases_empty: !newState.bases.some(b => b !== null),
    third_baseman_playing_back: newState._third_baseman_playing_back || false,
  }) : null;

  if (buntDecision) {
    const buntResult = resolveBunt(buntDecision, bjb, newState);
    if (buntResult) {
      newState.log.push({ type: 'info', text: buntResult.text });
      newState._celebrationBubble = buntResult.text;
      newState.lastPlay = { type: buntDecision === 'sacrifice' ? 'groundout' : 'single', text: buntResult.text };

      if (buntResult.batterOut) {
        bjb.gameStats.ab++;
        // SACRIFICE: advance all existing runners exactly one base (scoring from 3rd) BEFORE recording the out.
        const pitcherForSac = getCurrentPitcher(newState);
        if (buntResult.type === 'sacrifice_success' || buntDecision === 'sacrifice') {
          for (let b = 2; b >= 0; b--) {
            if (newState.bases[b]) {
              if (b + 1 >= 3) {
                newState.bases[b].gameStats.runs++;
                scoreRun(newState);
                bjb.gameStats.rbi++;
                pitcherForSac.gameStats.r++; pitcherForSac.gameStats.er++;
                newState.bases[b] = null;
              } else if (!newState.bases[b + 1]) {
                newState.bases[b + 1] = newState.bases[b];
                newState.bases[b] = null;
              }
            }
          }
        }
        recordOut(newState);
      } else {
        // Bunt single — advance baserunners, batter to first
        bjb.gameStats.ab++;
        bjb.gameStats.hits++;
        const pitcher = getCurrentPitcher(newState);
        pitcher.gameStats.h++;
        const rbi = advanceRunners(newState, 1, bjb, true);
        bjb.gameStats.rbi += rbi;
      }

      // ── Composure feedback ──
      if (buntResult.composureDelta !== 0) {
        const pitcher = getCurrentPitcher(newState);
        if (pitcher && pitcher._composure) {
          const leverage = calculateLeverage(newState.inning, newState);
          const applied = buntResult.composureDelta * leverage;
          pitcher._composure.composure = Math.max(0, Math.min(100, pitcher._composure.composure + applied));
        }
      }

      newState.balls = 0;
      newState.strikes = 0;
      advanceBatter(newState);
      
      // Check if we need to advance to next batter (e.g., after recording an out)
      if (newState.outs >= 3) {
        endHalfInning(newState);
      }

      // ── Run post-play checks (injury, composure, collision) — same as normal swings ──
      if (!newState.gameOver) runInjuryChecks(newState, bjb);
      if (!newState.gameOver && !newState.lastInjury) {
        const pi = checkPitcherInjury(newState);
        if (pi) { newState.lastInjury = pi; applyInjuryState(newState, pi); newState.log.push({ type: 'injury', text: `🚑 ${pi.commentary}` }); }
      }
      const pitcher = getCurrentPitcher(newState);
      applyComposureFromLastPlay(newState, pitcher);
      processComposureEvents(newState, pitcher);

      return newState;  // CRITICAL: Return immediately — do NOT process another at-bat in this call
    }
  }

  resolveSwing(newState, swingType, newState.pitchResult);
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); }
  if (!newState.gameOver) runInjuryChecks(newState, bjb);
  if (!newState.gameOver && !newState.lastInjury) { const pi = checkPitcherInjury(newState); if (pi) { newState.lastInjury = pi; applyInjuryState(newState, pi); newState.log.push({ type: 'injury', text: `🚑 ${pi.commentary}` }); } }
  // Collision injury from home plate collision or takeout slide — can injure runner, fielder, or both
  if (!newState.gameOver && newState._pendingCollisionInjury) {
    const { runner, fielder, trigger } = newState._pendingCollisionInjury;
    delete newState._pendingCollisionInjury;
    const allPlayers = [...newState.homeLineup, ...newState.awayLineup];
    const candidates = [runner, fielder].filter(Boolean);
    for (const p of candidates) {
      if (newState.lastInjury) break; // only one injury per play
      const colPlayer = allPlayers.find(pl => pl.name === p.name) || p;
      if (colPlayer) {
        const ci = checkPlayInjury(newState, trigger || 'collision', colPlayer.name);
        if (ci) { newState.lastInjury = ci; applyInjuryState(newState, ci); newState.log.push({ type: 'injury', text: `🚑 ${ci.commentary}` }); }
      }
    }
  }
  // ── Symmetric lead-change penalty: whichever pitcher blew the lead gets penalized ──
  const _mainPitchSide = state.halfInning === 'top' ? 'home' : 'away';
  const _mainPostPitch = newState.score[_mainPitchSide];
  const _mainPostBat = newState.score[_mainPitchSide === 'home' ? 'away' : 'home'];
  const _mainPostLead = _mainPostPitch > _mainPostBat ? 'ahead' : _mainPostPitch === _mainPostBat ? 'tied' : 'behind';
  if (newState._prePitchingLead === 'ahead' && _mainPostLead === 'behind') {
    newState._just_lost_lead = true;
    if (pitcher && pitcher._composure) {
      applyLeadChangePenalty(pitcher._composure);
    }
  } else {
    newState._just_lost_lead = false;
  }

  applyComposureFromLastPlay(newState, pitcher);
  processComposureEvents(newState, pitcher);
  return newState;
}

export function cpuSelectPitch(state) {
  const p = getCurrentPitcher(state); const pitches = Array.isArray(p.pitches) ? p.pitches : DEFAULT_PITCHES; const rand = Math.random();
  if (p.pitchSpeed >= 7 && rand < 0.35 && Array.isArray(pitches) && pitches.includes("Fastball")) return "Fastball";
  const bps = Array.isArray(pitches) ? pitches.filter(x => ["Breaking Ball","Knuckleball","Screwball","Split-Finger"].includes(x)) : [];
  if (p.offSpeed >= 7 && rand < 0.50 && bps.length > 0) return bps[Math.floor(Math.random() * bps.length)];
  if (p.offSpeed >= 6 && rand < 0.55 && Array.isArray(pitches) && pitches.includes("Changeup")) return "Changeup";
  return Array.isArray(pitches) ? (pitches[Math.floor(Math.random() * pitches.length)] || "Fastball") : "Fastball";
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
  // ── Count-based modifiers (additive after base/situation multipliers) ──
  const balls = state.balls || 0, strikes = state.strikes || 0;
  const adjContact = Math.round(adj.contact * hcm * dcm);
  const adjPower = Math.round(adj.power * hpm * dpm);
  // Base ratings before count modifiers (for MatchupCard arrow display)
  const baseContact = Math.max(1, Math.min(10, adjContact));
  const basePower = Math.max(1, Math.min(10, adjPower));
  let finalContact = adjContact, finalPower = adjPower, countModReason = null;
  if (balls === 3 && strikes === 0) {
    finalPower += 2; finalContact += 1;
    countModReason = 'Green light — sitting dead red';
  } else if (balls === 2 && strikes === 0) {
    finalPower += 1;
    countModReason = 'Ahead in the count — looking to drive';
  } else if (balls === 3 && strikes === 1) {
    finalPower += 1; finalContact += 1;
    countModReason = 'Ahead 3-1 — taking a rip';
  } else if (balls === 0 && strikes === 2) {
    finalPower -= 2; finalContact -= 1;
    countModReason = 'Down 0-2 — choking up, protecting the plate';
  } else if (balls === 1 && strikes === 2) {
    finalPower -= 1;
    countModReason = 'Behind 1-2 — shortening up';
  }
  return {
    ...adj,
    baseContact,
    basePower,
    contact: Math.max(1, Math.min(10, finalContact)),
    power: Math.max(1, Math.min(10, finalPower)),
    countModReason,
    _rawBaseContact: adjContact,
    _rawBasePower: adjPower,
    _rawFinalContact: finalContact,
    _rawFinalPower: finalPower,
  };
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
  
  // ── PHASE 3.1: DOUBLE SWITCH (NL parks only, when changing pitchers) ──
  const ballpark = TEAMS[newState.homeTeam]?.stadium;
  const has_dh = newState.useDH;
  const making_pitching_change = false;  // Will be set true if we decide to change pitchers below
  
  // (Double switch evaluated later in the pitcher-change section)

  // ── Ejection: mark pitcher/manager as ejected but DO NOT auto-replace ──
  // User will be prompted to choose a replacement in Home.jsx
  if (newState._pendingEjectionReplacement) {
    const ejectedSide = newState._beanball?.autoEjectionSide;
    const oldP = newState[ejectedSide === 'home' ? 'homePitcher' : 'awayPitcher'];
    const hk = ejectedSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    if (!newState[hk].find(p => p.name === oldP.name)) {
      newState[hk].push({ ...oldP, ejected: true });
    }
    delete newState._pendingEjectionReplacement;
    delete newState._beanball.autoEjectionPitcher;
    delete newState._beanball.autoEjectionSide;
    return newState;
  }

  // Phase 2.8 (processAtBat) now handles CPU pinch-hitting for pitchers due at bat
   // cpuDecideSubstitutions focuses on substitutions BETWEEN at-bats only
   const cpuSide = newState.homeTeam === userTeam ? 'away' : 'home';
   const cpuBattingSide = newState.halfInning === 'top' ? 'away' : 'home';

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
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p._replacedPitcher);
      if (si2 >= 0) {
        cpuLineupField[si2] = { ...oldP, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      } else {
        // Fallback: replace the last slot — NEVER create a 10th entry
        const lastIdx = cpuLineupField.length - 1;
        if (lastIdx >= 0) {
          cpuLineupField[lastIdx] = { ...oldP, order: cpuLineupField[lastIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        }
      }
      return newState;
    }
    // Pitcher was subbed out — replace with bullpen arm
    if (cpuBullpen.length > 0) {
      const sorted = [...cpuBullpen].sort((a, b) => b.control - a.control);
      const newPitcher = sorted[0], newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: initializePitcherComposure(newPitcher, newPitcher.temperament || 'PROFESSIONAL') };
      if (cpuPitchingSide === 'home') newState.homePitcher = newP; else newState.awayPitcher = newP;
      const bpi2 = cpuBullpen.findIndex(p => p.name === newPitcher.name); if (bpi2 >= 0) cpuBullpen.splice(bpi2, 1);
      if (!newState[hk2].find(p => p.name === oldP.name)) newState[hk2].push({ ...oldP });
      let si2 = cpuLineupField.findIndex(p => p.order === oldP.order);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p.name === oldP.name);
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos));
      if (si2 < 0) si2 = cpuLineupField.findIndex(p => p._replacedPitcher);
      if (si2 >= 0) {
        const le2 = { ...newPitcher, order: cpuLineupField[si2].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        cpuLineupField[si2] = le2;
      } else {
        // Fallback: replace the last slot — NEVER create a 10th entry
        const lastIdx = cpuLineupField.length - 1;
        if (lastIdx >= 0) {
          cpuLineupField[lastIdx] = { ...newPitcher, order: cpuLineupField[lastIdx].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        }
      }
      newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldP.name} on the mound (pinch-hit for earlier)` });
    }
    return newState;
  }

  const cpuPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const ip = cpuPitcher.gameStats.ip || 0, bbi = cpuPitcher.gameStats.bb || 0, runs = cpuPitcher.gameStats.r || 0;
  const inning = newState.inning, stamina = cpuPitcher.stamina || 5;
  const isReliever = ['RP','CL'].includes(cpuPitcher.pos) || ['RP','CL'].includes(cpuPitcher.assignedPos);
  const maxInnings = isReliever ? stamina * 0.4 : Math.max(4.2, stamina * 0.7);
  const fatiguePull = ip >= maxInnings + 0.5, walksPull = bbi >= 5, blowupPull = inning < 6 && runs >= 5;
  const cpuScore = newState.score[cpuPitchingSide], userScore = newState.score[cpuBattingSide];
  const lateClose = inning >= 7 && Math.abs(cpuScore - userScore) <= 2 && ip >= 2;
  const recentCollapse = (runs >= 2 && bbi >= 2 && inning >= 5), severeFatigue = ip >= maxInnings + 2;
  // Don't pull starters with a lead unless severely fatigued
  const hasLead = cpuScore > userScore;
  const notSeverelyFatigued = !severeFatigue && !fatiguePull;
  // Fresh starter in early innings stays in — 1984 starters routinely went 7-9 innings
  if (!isReliever && inning < 6 && !severeFatigue && !fatiguePull && runs < 5 && bbi < 5) return newState;
  if (hasLead && notSeverelyFatigued && !walksPull && !blowupPull && !lateClose) return newState;

  const shouldChange = (severeFatigue || fatiguePull || walksPull || blowupPull || lateClose) && cpuBullpen.length > 0;
  if (shouldChange) {
    making_pitching_change = true;  // Flag for double-switch evaluation
    // Bullpen management: closers only in 8th+, mop-up guys in blowouts
    const trailing = cpuScore < userScore;
    const bigDeficit = Math.abs(cpuScore - userScore) >= 4;
    const isCloser = (p) => p.pos === 'CL' || p.assignedPos === 'CL';
    let candidates;
    if (trailing && bigDeficit && inning <= 7) {
      // Mop-up duty — exclude closers, use worst available
      candidates = [...cpuBullpen].filter(p => !isCloser(p)).sort((a, b) => a.control - b.control);
      if (candidates.length === 0) candidates = [...cpuBullpen].sort((a, b) => a.control - b.control);
    } else if (inning < 8) {
      // Before 8th inning — never use closers, pick best non-closer
      candidates = [...cpuBullpen].filter(p => !isCloser(p)).sort((a, b) => b.control - a.control);
      if (candidates.length === 0) candidates = [...cpuBullpen].sort((a, b) => b.control - a.control);
    } else {
      // 8th inning+ — closers allowed, best pitcher first
      candidates = [...cpuBullpen].sort((a, b) => b.control - a.control);
    }
    const newPitcher = candidates[0];
    const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 }, _composure: initializePitcherComposure(newPitcher, newPitcher.temperament || 'PROFESSIONAL') };
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
        const en = { ...newPitcher, order: fl[si].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
        fl[si] = en;
      }
    }
    const reason = severeFatigue ? 'completely gassed' : fatiguePull ? `${ip} innings — arm is tiring` : walksPull ? 'lost command' : blowupPull ? 'rough outing' : 'high-leverage situation';
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound (${reason})` });
    
    // ── PHASE 3.1: Double switch evaluation (NL parks only) ──
    const dsLineup = cpuPitchingSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const dsBench = TEAMS[cpuPitchingSide === 'home' ? newState.homeTeam : newState.awayTeam]?.bench || [];
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

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };