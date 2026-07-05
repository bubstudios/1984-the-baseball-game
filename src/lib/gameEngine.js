// gameEngine.js - Hub module. Re-exports from sub-modules + processAtBat.
// ALL run scoring goes through chargeRun() - no inline runs++ or pitcher R/ER.

import { TEAMS, PITCH_TYPES, SWING_TYPES } from './gameData';
import { deepCopyState } from './deepCopyState';
import { chargeRun, tagRunnerResponsiblePitcher } from './runScoring';
import { getEffectivePitcher, getPitcherFatigue } from './pitcherFatigue';
import { applyLeadChangePenalty, calculateLeverage } from './pitcherComposure';
import { shouldBunt, resolveBunt } from './buntingDecision';
import { shouldPinchHit, choose_pinch_hitter } from './pinchHittingDecision';
import { shouldIntentionalWalk, issue_ibb } from './intentionalWalkDecision';
import { choose_alignment, expect_bunt } from './defensivePositioning';
import { checkForWarning, registerHBP } from './beanball';
import { WALK_LINES, pickLine } from './commentaryLines';
import { pinchHit } from './substitutions';
import {
  getCurrentBatter, getCurrentPitcher, getBattingTeam, advanceBatter, recordOut,
  applyComposure, applyComposureFromLastPlay, processComposureEvents,
  getControllingTeam, handleWalk, processHoldingGame, endHalfInning,
} from './gameEngineHelpers';
import {
  resolvePitch, resolveSwing, advanceRunners,
  handleHitAndRunCaught, handleHitAndRunMiss,
} from './swingResolver';
import { attemptSteal, attemptDoubleSteal } from './baserunning';

// ── Re-exports for backward compatibility ──
export { getEffectivePitcher, getPitcherFatigue } from './pitcherFatigue';
export { createGameState, createPitcherState, getCurrentBatter, getCurrentPitcher, getBattingTeam, getSituationalBatter, intentionalWalk, getControllingTeam, handleWalk, processHoldingGame, processComposureEvents, applyComposure, applyComposureFromLastPlay, recordOut, endHalfInning, advanceBatter, scoreRun, isWalkOff, isCriticalRunSituation, getDefensivePlayers, getOutfieldArm, getCatcherArm, getMiddleInfieldRating, getErrorChance, getAdjustedPlayer, normalizePosGroup, POSITION_GROUPS, TEAM_IDS } from './gameEngineHelpers';
export { attemptSteal, attemptDoubleSteal, cpuDecideSteal, setHitAndRun, hasRunnersOnBase } from './baserunning';
export { cpuDecideSubstitutions, cpuCheckPinchHit, selectCpuReliever, pickCpuReliever, cpuSelectPitch, cpuSelectSwing } from './cpuManager';
export { resolvePitch, resolveSwing, advanceRunners, handleHitAndRunCaught, handleHitAndRunMiss, processPostHitBaserunning, processFlyoutTagUps } from './swingResolver';
export { chargeRun, tagRunnerResponsiblePitcher } from './runScoring';
export { pinchHit, pinchRun, defensiveSwitch, changePitcher } from './substitutions';

// ── processAtBat: the main at-bat orchestrator ──
export function processAtBat(state, pitchType, swingType) {
  const home = TEAMS[state.homeTeam], away = TEAMS[state.awayTeam];
  const newState = deepCopyState(state);
  delete newState._celebrationBubble;
  delete newState._lastActionWasPickoff;

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

  // ── DEFENSIVE POSITIONING ──
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

  // ── INTENTIONAL WALK DECISION GATE (fresh count only, CPU pitchers only) ──
  if (newState.balls === 0 && newState.strikes === 0) {
    const isCpuPitching = getControllingTeam(newState, 'pitching') === 'cpu';
    if (isCpuPitching && newState.inning >= 7) {
      const batter = getCurrentBatter(newState);
      const battingTeam = getBattingTeam(newState);
      const battingTeamIndex = battingTeam === 'home' ? newState.homeBatterIndex : newState.awayBatterIndex;
      const battingLineup = battingTeam === 'home' ? newState.homeLineup : newState.awayLineup;
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
        on_deck_gives_platoon_advantage: false,
        walk_puts_winning_run_on_base: () => {
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

        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        pitcher.gameStats.pitches += 4;

        const isForce = !!newState.bases[0];
        if (isForce) {
          if (newState.bases[2]) {
            chargeRun(newState, newState.bases[2]);
            batter.gameStats.rbi++;
          }
          if (newState.bases[1]) {
            newState.bases[2] = newState.bases[1];
          }
          if (newState.bases[0]) {
            newState.bases[1] = newState.bases[0];
          }
        }
        tagRunnerResponsiblePitcher(newState, batter);
        newState.bases[0] = batter;

        newState.log.push({ type: 'walk', text: ibbResult.text });
        newState.lastPlay = { type: 'walk', text: ibbResult.text, isIBB: true };

        applyComposure(pitcher, newState, 'ibb_issued');

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

  // ── Reach Back: specialty pitch ──
  const isReachBack = pitchType && (pitchType.name === '__reachback__' || pitchType === '__reachback__');
  if (isReachBack) {
    const pitcher = getCurrentPitcher(newState);
    if (newState._reachBackPitcher !== pitcher.name) {
      newState._reachBackUses = 0;
      newState._reachBackPitcher = pitcher.name;
    }
    newState._reachBackUses = (newState._reachBackUses || 0) + 1;
    newState._wasReachBack = true;
    pitcher.gameStats.pitches++;
    const batter = getCurrentBatter(newState);
    const spName = (pitcher.specialty?.name || pitcher.specialty) || 'blazing heater';
    newState.pitchResult = { pitchType: spName, isStrike: Math.random() < 0.95, location: 'on the black', isReachBack: true };
    if (!newState.userPitchTypes) newState.userPitchTypes = [];
    if (!newState.userPitchTypes.includes('__reachback__')) newState.userPitchTypes = [...newState.userPitchTypes, '__reachback__'];
    if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) { const sr = attemptSteal(newState, newState.pendingSteal); Object.assign(newState, sr); if (newState.gameOver) return newState; }
    const bjb = getCurrentBatter(newState);
    const boostedPitcher = { ...pitcher, effectivePitchSpeed: 10, effectiveControl: 10, effectiveOffSpeed: 10 };
    const origPitcher = { ...pitcher };
    const pitchHalf = newState.halfInning;
    if (pitchHalf === 'top') newState.homePitcher = boostedPitcher;
    else newState.awayPitcher = boostedPitcher;
    resolveSwing(newState, swingType, newState.pitchResult);
    if (!newState.gameOver) {
      if (pitchHalf === 'top') newState.homePitcher = origPitcher;
      else newState.awayPitcher = origPitcher;
    }
    if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); }
    applyComposureFromLastPlay(newState, pitcher);
    const _rbPitchSide = state.halfInning === 'top' ? 'home' : 'away';
    const _rbPostPitch = newState.score[_rbPitchSide];
    const _rbPostBat = newState.score[_rbPitchSide === 'home' ? 'away' : 'home'];
    const _rbPostLead = _rbPostPitch > _rbPostBat ? 'ahead' : _rbPostPitch === _rbPostBat ? 'tied' : 'behind';
    if (newState._prePitchingLead === 'ahead' && _rbPostLead === 'behind') {
      newState._just_lost_lead = true;
      if (pitcher && pitcher._composure) applyLeadChangePenalty(pitcher._composure);
    } else {
      newState._just_lost_lead = false;
    }
    processComposureEvents(newState, pitcher);
    return newState;
  }

  if (newState.pendingSteal === 'double') { const sr = attemptDoubleSteal(newState); Object.assign(newState, sr); if (newState.gameOver) return newState; if (sr.lastPlay?.type === 'caughtstealing') { applyComposure(getCurrentPitcher(newState), newState, 'caughtstealing'); return newState; } }
  else if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) {
    const stealBase = newState.pendingSteal;
    const runnerExists = typeof stealBase === 'number' && newState.bases[stealBase] !== null;
    if (runnerExists) {
      const sr = attemptSteal(newState, stealBase); Object.assign(newState, sr); if (newState.gameOver) return newState; if (sr.lastPlay?.type === 'caughtstealing') { applyComposure(getCurrentPitcher(newState), newState, 'caughtstealing'); return newState; }
    } else {
      newState.pendingSteal = null;
    }
  }
  delete newState._wasReachBack;
  const pitcher = getCurrentPitcher(newState), effP = getEffectivePitcher(newState) || pitcher;
  const batter = getCurrentBatter(newState);

  newState.bases.forEach(b => { if (b) delete b._heldClose; });

  // ── HOLDING GAME: Balks ──
  const holdingResult = processHoldingGame(newState);
  if (holdingResult) {
    if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
      newState.gameOver = true; newState.waitingForInput = false;
      newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
    }
    return newState;
  }

  const wc = Math.max(0.01, (10 - (effP.effectiveControl || effP.control)) * 0.005);
  if (Math.random() < wc) { batter.gameStats.bb++; pitcher.gameStats.bb++; pitcher.gameStats.pitches += 4; newState.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); newState.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(newState, batter); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off walk! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } applyComposure(pitcher, newState, 'walk'); return newState; }
  newState.pitchResult = resolvePitch(newState, pitchType);
  if (!newState.userPitchTypes) newState.userPitchTypes = [];
  if (!newState.userPitchTypes.includes(pitchType.name)) newState.userPitchTypes = [...newState.userPitchTypes, pitchType.name];
  if (newState.pitchResult.isWildPitch) { if (newState.balls >= 4) { const wb = getCurrentBatter(newState); wb.gameStats.bb++; getCurrentPitcher(newState).gameStats.bb++; newState.log.push({ type: 'walk', text: `${wb.name} walks on a wild pitch!` }); handleWalk(newState, wb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); } applyComposure(pitcher, newState, 'wildpitch'); return newState; }
  if (newState.pitchResult.isHBP) { const hb = getCurrentBatter(newState); const hbp = getCurrentPitcher(newState); hb.gameStats.bb++; hbp.gameStats.bb++; const hbpReason = newState.pitchResult.hbpReason || null; const wasWarned = newState._beanball?.warningIssued; registerHBP(newState, hbp, hb, hbpReason); const hbpText = `${hb.name} is hit by the pitch!`; newState.log.push({ type: 'walk', text: hbpText }); newState.lastPlay = { type: 'walk', text: `${hb.name} is hit by the pitch! - takes first`, isHBP: true, hbpReason }; handleWalk(newState, hb); newState.balls = 0; newState.strikes = 0; advanceBatter(newState); const warned = checkForWarning(newState); if (warned) newState._beanballWarning = true; if (wasWarned) { const pitchingSide = newState.halfInning === 'top' ? 'home' : 'away'; const ejectKey = pitchingSide === 'home' ? '_homePitcherEjected' : '_awayPitcherEjected'; const mgrEjectKey = pitchingSide === 'home' ? '_homeManagerEjected' : '_awayManagerEjected'; newState[ejectKey] = true; newState[mgrEjectKey] = true; newState._beanball.autoEjectionPitcher = hbp.name; newState._beanball.autoEjectionSide = pitchingSide; newState._pendingEjectionReplacement = true; const tAbbr = TEAMS[newState[pitchingSide === 'home' ? 'homeTeam' : 'awayTeam']]?.abbr || ''; newState.log.push({ type: 'ejection', text: `🟥 ${hbp.name} EJECTED - hit batter after warnings! ${tAbbr} manager also ejected!` }); } if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off HBP! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); } applyComposure(pitcher, newState, 'hbp'); return newState; }
  const bjb = getCurrentBatter(newState);

  // ── PINCH-HIT DECISION GATE (pitcher due at bat, CPU only) ──
  const isPitcherBatting = bjb.is_pitcher || bjb.pos === 'SP' || bjb.pos === 'RP' || bjb.pos === 'CL' || (bjb.assignedPos && ['SP', 'RP', 'CL'].includes(bjb.assignedPos));
  const isCpuBatting = getControllingTeam(newState, 'batting') === 'cpu';
  if (isPitcherBatting && isCpuBatting) {
    const battingTeamSide = getBattingTeam(newState) === 'home' ? 'home' : 'away';
    const benchTeam = battingTeamSide === 'home' ? newState.homeTeam : newState.awayTeam;
    const fullBench = TEAMS[benchTeam]?.bench || [];
    const benchUsedList = battingTeamSide === 'home' ? (newState.homeBenchUsed || []) : (newState.awayBenchUsed || []);
    const benchHistoryList = battingTeamSide === 'home' ? (newState.homePlayerHistory || []) : (newState.awayPlayerHistory || []);
    const battingLineup = battingTeamSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const usedBenchNames = new Set();
    [...benchUsedList, ...benchHistoryList, ...battingLineup].forEach(p => usedBenchNames.add(p.name));
    const benchList = fullBench.filter(p => !usedBenchNames.has(p.name));
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
        newState.log.push({ type: 'info', text: `🔄 ${phitter.name} pinch-hits for ${bjb.name}` });

        const newPitcher = getCurrentPitcher(newState);
        resolveSwing(newState, swingType, newState.pitchResult);

        if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
          newState.gameOver = true; newState.waitingForInput = false;
          newState.log.push({ type: 'info', text: `🎉 Walk-off! ${TEAMS[newState.homeTeam].name} win ${newState.score.home}-${newState.score.away}!` });
        }
        applyComposureFromLastPlay(newState, newPitcher);
        processComposureEvents(newState, newPitcher);
        return newState;
      }
    }
  }

  // ── BUNTING DECISION GATE (CPU-CONTROLLED TEAMS ONLY) ──
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
      const buntPlayType = buntResult.type === 'sacrifice_success' ? 'groundout' :
                           buntResult.type === 'bunt_single' ? 'single' :
                           buntResult.type === 'bunt_pop' ? 'popout' :
                           buntResult.type === 'bunt_force' ? 'fc' :
                           buntResult.type === 'bunt_for_hit_single' ? 'single' :
                           buntResult.type === 'bunt_for_hit_out' ? 'groundout' : 'groundout';
      newState.log.push({ type: buntPlayType, text: buntResult.text });
      newState._celebrationBubble = buntResult.text;
      newState.lastPlay = { type: buntPlayType, text: buntResult.text };

      if (buntResult.batterOut) {
        bjb.gameStats.ab++;
        const pitcherForSac = getCurrentPitcher(newState);
        if (buntResult.type === 'sacrifice_success') {
          for (let b = 2; b >= 0; b--) {
            if (newState.bases[b]) {
              if (b + 1 >= 3) {
                chargeRun(newState, newState.bases[b]);
                bjb.gameStats.rbi++;
                newState.bases[b] = null;
              } else if (!newState.bases[b + 1]) {
                newState.bases[b + 1] = newState.bases[b];
                newState.bases[b] = null;
              }
            }
          }
        } else if (buntResult.type === 'bunt_force') {
          if (newState.bases[2]) {
            newState.bases[2] = newState.bases[1];
            newState.bases[1] = newState.bases[0];
          } else if (newState.bases[1]) {
            newState.bases[1] = newState.bases[0];
          }
          tagRunnerResponsiblePitcher(newState, bjb);
          newState.bases[0] = bjb;
        }
        recordOut(newState);
      } else {
        bjb.gameStats.ab++;
        bjb.gameStats.hits++;
        const pitcher = getCurrentPitcher(newState);
        pitcher.gameStats.h++;
        const rbi = advanceRunners(newState, 1, bjb, true);
        bjb.gameStats.rbi += rbi;
      }

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

      if (newState.outs >= 3) {
        endHalfInning(newState);
      }

      const pitcher = getCurrentPitcher(newState);
      applyComposureFromLastPlay(newState, pitcher);
      processComposureEvents(newState, pitcher);

      return newState;
    }
  }

  resolveSwing(newState, swingType, newState.pitchResult);
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) { newState.gameOver = true; newState.waitingForInput = false; newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` }); }
  // ── Symmetric lead-change penalty ──
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