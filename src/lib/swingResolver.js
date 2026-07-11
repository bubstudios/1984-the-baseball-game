// swingResolver.js - Pitch resolution, swing resolution, hit advancement, and tag-up logic.
// ALL run scoring goes through chargeRun() - no inline runs++ or pitcher R/ER increments.
// Every runner is tagged with responsiblePitcherId at time of reaching base.

import { TEAMS, PITCH_TYPES, SWING_TYPES, PLAYER_ERRORS } from './gameData';
import { applyWeatherEffects } from './weather';
import { BALLPARKS, getBallparkEffect, getHitDirection, checkBallparkQuirk } from './ballparks';
import {
  pickLine, pickHitLine, STRIKEOUT_LINES, WALK_LINES,
  SINGLE_LINES, INFIELD_SINGLE_LINES, DOUBLE_LINES, TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  DOUBLE_PLAY_LINES, LINEOUT_LINES,
  SOFT_GROUNDOUT_LINES, HARD_GROUNDOUT_LINES,
  POPOUT_LINES, FOUL_BALL_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  INFIELD_POPUP_LINES, INFIELD_LINEOUT_SOFT_LINES, INFIELD_LINEOUT_HARD_LINES,
  SHALLOW_FLYOUT_LINES, MEDIUM_FLYOUT_LINES, DEEP_FLYOUT_LINES,
  OUTFIELD_LINEOUT_LINES, BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  ERROR_LINES, FC_LINES,
  TAG_UP_THIRD_TO_HOME_OUT_LINES, TAG_UP_SECOND_TO_THIRD_OUT_LINES, TAG_UP_FIRST_TO_SECOND_OUT_LINES,
  RUNNER_FIRST_TO_THIRD_OUT_LINES, RUNNER_FIRST_TO_HOME_OUT_LINES, RUNNER_SECOND_TO_HOME_OUT_LINES,
  TAKEN_STRIKE_FASTBALL_LINES, TAKEN_STRIKE_BREAKING_LINES, TAKEN_STRIKE_CHANGEUP_LINES, TAKEN_STRIKE_GENERIC_LINES,
  SWINGING_STRIKE_FASTBALL_LINES, SWINGING_STRIKE_BREAKING_LINES, SWINGING_STRIKE_CHANGEUP_LINES, SWINGING_STRIKE_GENERIC_LINES,
  CALLED_BALL_FASTBALL_LINES, CALLED_BALL_BREAKING_LINES, CALLED_BALL_CHANGEUP_LINES, CALLED_BALL_GENERIC_LINES,
} from './commentaryLines';
import { getUmpireZoneEffect } from './umpires';
import { shouldThrowAtBatter, registerHBP, registerHomeRun, registerBigStrikeout, checkForWarning } from './beanball';
import { rollPitcherKCelebration, rollHRAdmire, rollHitCelebration, rollFielderCelebration, rollPitcherRetireSide } from './celebrations';
import { pitcherCelebration } from './celebrationSystem';
import { getStrikeoutSituationType, pickStrikeoutCelebration } from './strikeoutCelebrations';
import { rollCollision, rollTakeoutSlide } from './collisions';
import { maybeGetAnnouncerHRCall } from './announcerHRCalls';
import { calculateHomeRunDistance } from './homeRunDistance';
import { isWallRobable, rollHRRobbery, getRobberyCall, rollDivingCatch, getDivingCatchCall, rollDivingStop, getDivingStopResult, rollRareCatchEvent, getRareCatchCall } from './defensivePlays';
import { checkBatterStretch } from './aggressiveBaserunning';
import { apply_alignment_modifiers } from './defensivePositioning';
import { getEffectivePitcher } from './pitcherFatigue';
import { getBehaviorZone, BEHAVIOR_ZONES } from './pitcherComposure';
import { chargeRun, tagRunnerResponsiblePitcher } from './runScoring';
import { determineSqueezeType, resolveSqueeze, shouldAttemptSqueeze, recordSqueezeAttempt, recordBuntAttempt } from './squeezePlay';
import {
  getCurrentBatter, getCurrentPitcher, getBattingTeam, advanceBatter, recordOut,
  endHalfInning, isWalkOff, isCriticalRunSituation,
  getDefensivePlayers, getOutfieldArm, getCatcherArm, getMiddleInfieldRating,
  getErrorChance, getAdjustedPlayer, handleWalk, getSituationalBatter,
} from './gameEngineHelpers';

// ── advanceRunners: moves runners and scores via chargeRun ──
export function advanceRunners(state, bases, batter, isHit = false, hitDirection = null) {
  let runsScored = 0;
  if (bases === 4) {
    // Home run - all runners and batter score
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) {
        chargeRun(state, state.bases[i]);
        runsScored++;
        const collision = rollCollision('home', state.bases[i].speed, 7);
        if (collision) {
          const fLineup = state.halfInning === 'top' ? state.homeLineup : state.awayLineup;
          const catcher = fLineup.find(p => p.assignedPos === 'C' || p.pos === 'C');
          state.log.push({ type: 'info', text: `💥 ${collision.text}` });
          state.lastPlay = { ...state.lastPlay, collision: true, collisionFielder: catcher?.name };
        }
        state.bases[i] = null;
      }
    }
    batter.gameStats.rbi += runsScored + 1;
    chargeRun(state, batter); // HR: batter scores immediately, chargeRun falls back to current pitcher
    return runsScored + 1;
  }
  let rbi = 0;
  const preBases = [...state.bases];
  for (let i = 2; i >= 0; i--) {
    if (state.bases[i]) {
      const newBase = i + bases;
      if (newBase >= 3) {
        if (rbi > 0 && isWalkOff(state)) { state.bases[2] = state.bases[i]; state.bases[i] = null; }
        else { chargeRun(state, state.bases[i]); rbi++; state.bases[i] = null; }
      }
      else { state.bases[newBase] = state.bases[i]; state.bases[i] = null; }
    }
  }
  // Walk-off guard
  if (isWalkOff(state)) {
    if (bases <= 3) { tagRunnerResponsiblePitcher(state, batter); state.bases[bases - 1] = batter; }
    batter.gameStats.rbi += rbi;
    return runsScored + rbi;
  }
  const defenders = getDefensivePlayers(state);
  const isOutfieldHit = hitDirection && ['LF', 'CF', 'RF', 'LCF', 'RCF'].some(d => hitDirection.includes(d));
  if (isHit && bases <= 2 && isOutfieldHit) {
    const ofArm = getOutfieldArm(defenders);
    const armPenalty = (ofArm / 10) * 0.18;
    const batterPower = batter.power / 10;
    const positioningPenalty = batterPower * 0.10;
    const outsMultiplier = state.outs >= 2 ? 1.60 : (state.outs === 1 ? 1.15 : 1.0);
    // Runner from 1st on a double
    if (bases === 2 && preBases[0]) {
      const runnerAt3rd = state.bases[2];
      if (runnerAt3rd && runnerAt3rd.name === preBases[0].name) {
        const sf = runnerAt3rd.speed / 10;
        // Offensive tuning: faster runners score from 1st on doubles more often.
        const hc = (0.34 + sf * 0.60 - armPenalty - positioningPenalty) * outsMultiplier;
        if (Math.random() < Math.max(0.02, hc)) {
          const caughtChance = 0.04 + (ofArm / 10) * 0.10 - sf * 0.06;
          if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.12))) {
            runnerAt3rd.gameStats.cs = (runnerAt3rd.gameStats.cs || 0) + 1;
            state.bases[2] = null;
            if (!state._pendingBaseOuts) state._pendingBaseOuts = [];
            state._pendingBaseOuts.push({ text: `${runnerAt3rd.name} - ${pickLine(RUNNER_FIRST_TO_HOME_OUT_LINES)}` });
          } else {
            chargeRun(state, runnerAt3rd); rbi++; state.bases[2] = null;
            state.log.push({ type: 'info', text: `${runnerAt3rd.name} hustles all the way home from first!` });
          }
        }
      }
    }
    // Runner from 1st to 3rd on a single
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
              state._pendingBaseOuts.push({ text: `${runnerAt2nd.name} - ${pickLine(RUNNER_FIRST_TO_THIRD_OUT_LINES)}` });
            } else if (!state.bases[2]) {
              state.bases[2] = runnerAt2nd; state.bases[1] = null;
              state.log.push({ type: 'info', text: `${runnerAt2nd.name} wheels to third on the single!` });
            }
          }
        }
      }
    }
    // Runner from 2nd scoring on single
    if (bases === 1 && preBases[1]) {
      const runnerAt3rd = state.bases[2];
      if (runnerAt3rd && runnerAt3rd.name === preBases[1].name) {
        const sf = runnerAt3rd.speed / 10;
        // Offensive tuning: two-out RBI conversion slightly higher for good
        // contact hitters. Base 0.32 + contact rating bonus.
        const twoOutBonus = state.outs >= 2 ? 0.32 + ((batter.contact || 5) / 10) * 0.08 : 0;
        // Offensive tuning: runner from 2nd scores on singles more often,
        // especially with 2 outs (twoOutBonus now contact-weighted).
        const hc = (0.42 + sf * 0.66 - armPenalty * 0.9 - positioningPenalty * 0.8 + twoOutBonus) * outsMultiplier;
        if (Math.random() < Math.max(0.06, Math.min(hc, 0.92))) {
          const caughtChance = 0.03 + armPenalty * 0.8 - sf * 0.05;
          if (Math.random() < Math.max(0.02, Math.min(caughtChance, 0.12))) {
            runnerAt3rd.gameStats.cs = (runnerAt3rd.gameStats.cs || 0) + 1;
            state.bases[2] = null;
            if (!state._pendingBaseOuts) state._pendingBaseOuts = [];
            state._pendingBaseOuts.push({ text: `${runnerAt3rd.name} - ${pickLine(RUNNER_SECOND_TO_HOME_OUT_LINES)}` });
          } else {
            chargeRun(state, runnerAt3rd); rbi++; state.bases[2] = null;
            state.log.push({ type: 'info', text: `${runnerAt3rd.name} scores from second on the single!` });
          }
        }
      }
    }
  }
  if (bases <= 3) { tagRunnerResponsiblePitcher(state, batter); state.bases[bases - 1] = batter; }
  if (isHit && bases === 1 && isOutfieldHit) {
    const r3 = state.bases[2], b1 = state.bases[0];
    const preR3 = preBases[2];
    const r3AdvancedToThird = r3 && preR3 !== r3;
    if (b1 && b1.name === batter.name && r3AdvancedToThird && !state.bases[1]) {
      const ofArm = getOutfieldArm(defenders);
      const sc = 0.04 + (r3.speed / 10) * 0.20 - (ofArm / 10) * 0.06 + (batter.speed / 10) * 0.06;
      if (Math.random() < Math.max(0.01, Math.min(sc, 0.18))) {
        state.bases[1] = batter; state.bases[0] = null;
        const takeSecondText = `${batter.name.split(' ').pop()} takes second - defense threw to third!`;
        state.log.push({ type: 'info', text: takeSecondText });
        if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} - ${takeSecondText}`;
      }
    }
  }
  batter.gameStats.rbi += rbi;
  return runsScored + rbi;
}

// ── resolvePitch ──
export function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  const effectiveP = getEffectivePitcher(state) || pitcher;
  pitcher.gameStats.pitches++;
  const composure = pitcher._composure;
  let controlFactor = (effectiveP.effectiveControl || effectiveP.control) / 10;
  if (composure) {
    const zone = getBehaviorZone(composure.composure);
    const controlMod = zone === BEHAVIOR_ZONES.LOCKED_IN ? 1.15 : zone === BEHAVIOR_ZONES.NORMAL ? 1.0 : zone === BEHAVIOR_ZONES.PRESSING ? 0.85 : 0.65;
    controlFactor *= controlMod;
  }
  const effControl = effectiveP.effectiveControl || effectiveP.control;
  const wpChance = Math.max(0.002, (10 - effControl) * 0.002);
  let wpAdjusted = wpChance;
  if (composure) {
    if (getBehaviorZone(composure.composure) === BEHAVIOR_ZONES.RED_ZONE) wpAdjusted *= 2.5;
  }
  if (Math.random() < wpAdjusted) {
    const hasR = state.bases.some(b => b !== null);
    if (hasR) {
      let scored = null; const moved = [];
      for (let i = 2; i >= 0; i--) {
        if (state.bases[i]) {
          if (i + 1 >= 3) { chargeRun(state, state.bases[i]); scored = state.bases[i]; state.bases[i] = null; }
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
  const hbpReason = shouldThrowAtBatter(state, pitcher, getCurrentBatter(state));
  const baseHbpChance = Math.max(0.0008, (10 - effControl) * 0.0006);
  const hbpChance = hbpReason ? Math.min(0.15, baseHbpChance + (hbpReason.baseChance || 0.02) * (1 + (state._beanball?.tension || 0) / 100)) : baseHbpChance;
  if (Math.random() < hbpChance) return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true, hbpReason };
  else if (Math.random() < baseHbpChance) return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true };
  // Walk tuning: strike rate lowered further to raise walks toward target.
  // Wild pitchers (low control) still punished more via the control multiplier.
  let strikeChance = 0.235 + controlFactor * 0.255 + (pitchType.controlBonus || 0) * 0.04;
  if (state.umpire) strikeChance += getUmpireZoneEffect(state.umpire) / 100;
  const isStrike = Math.random() < Math.min(Math.max(strikeChance, 0.08), 0.92);
  return { pitchType: pitchType.name, isStrike, location: isStrike ? ['inside corner','outside corner','down the middle','high strike','low strike'][Math.floor(Math.random() * 5)] : ['high','low','inside','outside','way outside','in the dirt'][Math.floor(Math.random() * 6)] };
}

// ── resolveSwing - the big one ──
export function resolveSwing(state, swingType, pitch) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  if (swingType.name === 'Take Pitch') {
    // Hit-and-run + take: runner goes, batter doesn't swing (risky!)
    if (state.hitAndRun && !state.gameOver) {
      state.hitAndRun = false;
      const halfBefore = state.halfInning;
      handleHitAndRunMiss(state);
      if (state.gameOver || state.halfInning !== halfBefore) return;
    }
    if (pitch.isStrike) {
      state.strikes++;
      if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} ${pickLine(STRIKEOUT_CALLED_LINES)}` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} ${pickLine(STRIKEOUT_CALLED_LINES)}` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
      { let takenLine; const pt = (pitch.pitchType || '').toLowerCase();
        if (pt.includes('fast')) takenLine = pickLine(TAKEN_STRIKE_FASTBALL_LINES);
        else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) takenLine = pickLine(TAKEN_STRIKE_BREAKING_LINES);
        else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) takenLine = pickLine(TAKEN_STRIKE_CHANGEUP_LINES);
        else takenLine = pickLine(TAKEN_STRIKE_GENERIC_LINES);
        const strikeText = `Strike ${state.strikes} - ${takenLine}`;
        state.log.push({ type: 'strike', text: strikeText }); state.lastPlay = { type: 'strike', text: strikeText };
      }
    } else {
      state.balls++;
      if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; }
      { const pt = (pitch.pitchType || '').toLowerCase(); let ballLine;
        if (pt.includes('fast')) ballLine = pickLine(CALLED_BALL_FASTBALL_LINES);
        else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) ballLine = pickLine(CALLED_BALL_BREAKING_LINES);
        else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) ballLine = pickLine(CALLED_BALL_CHANGEUP_LINES);
        else ballLine = pickLine(CALLED_BALL_GENERIC_LINES);
        const ballText = `Ball ${state.balls} - ${ballLine}`;
        state.log.push({ type: 'ball', text: ballText }); state.lastPlay = { type: 'ball', text: ballText };
      }
    }
    return;
  }
  if (swingType.name === 'Bunt') {
    if (!pitch.isStrike && Math.random() < 0.55) { state.balls++; if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; } state.log.push({ type: 'ball', text: `Ball ${state.balls} - ${batter.name} pulls back the bunt` }); state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` }; return; }
    // ── SQUEEZE PLAY DETECTION (full tactical eligibility required) ──
    // In headless mode, squeezes are handled by the gameEngine.js CPU bunt gate
    // (with 5% random gate). Skip here to prevent double-firing at 100% rate.
    if (!state._headlessMode && shouldAttemptSqueeze(state, batter)) {
      const sqType = determineSqueezeType(batter);
      const sq = resolveSqueeze(batter, state, sqType);
      state.log.push({ type: sq.logType, text: sq.text, isBunt: true, isSqueeze: true });
      state._celebrationBubble = sq.text;
      state.lastPlay = { type: sq.logType, text: sq.text, isBunt: true, isSqueeze: true };
      recordSqueezeAttempt(state);
      recordBuntAttempt(state);

      if (sq.batterOut) {
        batter.gameStats.ab++;
        if (sq.runnerScores) {
          for (let b = 2; b >= 0; b--) {
            if (state.bases[b]) {
              if (b + 1 >= 3) { chargeRun(state, state.bases[b]); batter.gameStats.rbi++; state.bases[b] = null; }
              else if (!state.bases[b + 1]) { state.bases[b + 1] = state.bases[b]; state.bases[b] = null; }
            }
          }
        }
        recordOut(state);
        state.balls = 0; state.strikes = 0; advanceBatter(state);
        return;
      } else if (sq.type === 'squeeze_failed_runner_out') {
        batter.gameStats.ab++;
        if (state.bases[2]) { recordOut(state); state.bases[2] = null; }
        if (state.bases[1]) { state.bases[2] = state.bases[1]; state.bases[1] = null; }
        if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
        tagRunnerResponsiblePitcher(state, batter);
        state.bases[0] = batter;
        state.balls = 0; state.strikes = 0; advanceBatter(state);
        return;
      } else if (sq.type === 'squeeze_missed') {
        if (state.bases[2]) { recordOut(state); state.bases[2] = null; }
        state.strikes++;
        if (state.strikes >= 3) {
          batter.gameStats.ab++; batter.gameStats.so++;
          pitcher.gameStats.so = (pitcher.gameStats.so || 0) + 1;
          recordOut(state);
          state.balls = 0; state.strikes = 0; advanceBatter(state);
        }
        return;
      } else {
        batter.gameStats.ab++; batter.gameStats.hits++;
        pitcher.gameStats.h++;
        let sqRbi = 0;
        for (let b = 2; b >= 0; b--) {
          if (state.bases[b]) {
            if (b + 1 >= 3) { chargeRun(state, state.bases[b]); sqRbi++; state.bases[b] = null; }
            else if (!state.bases[b + 1]) { state.bases[b + 1] = state.bases[b]; state.bases[b] = null; }
          }
        }
        tagRunnerResponsiblePitcher(state, batter);
        state.bases[0] = batter;
        batter.gameStats.rbi += sqRbi;
        state.balls = 0; state.strikes = 0; advanceBatter(state);
        return;
      }
    }

    // Normal bunt path - record bunt attempt for cooldown tracking
    recordBuntAttempt(state);

    const isPH = batter.pos === 'SP' || batter.assignedPos === 'SP';
    const isRelieverPitcher = batter.pos === 'RP' || batter.pos === 'CL' || batter.assignedPos === 'RP' || batter.assignedPos === 'CL';
    const hasR1 = !!state.bases[0];
    const canSac = state.outs < 2 && hasR1;
    if (isPH && canSac) {
      const pitcherBuntSkill = isRelieverPitcher ? 0.55 : 0.75;
      if (Math.random() < pitcherBuntSkill) {
        const r1 = state.bases[0];
        if (r1) {
          if (state.bases[2]) { chargeRun(state, state.bases[2]); batter.gameStats.rbi++; state.log.push({ type: 'info', text: `${state.bases[2].name.split(' ').pop()} scores on the sacrifice` }); }
          state.bases[2] = state.bases[1] || null; state.bases[1] = r1; state.bases[0] = null;
        }
        batter.gameStats.ab++; pitcher.gameStats.so++;
        state.log.push({ type: 'groundout', text: `${batter.name} ${pickLine(SACRIFICE_BUNT_LINES)} ${r1?.name?.split(' ').pop()} moves to second` });
        state.lastPlay = { type: 'groundout', text: `Sacrifice bunt by ${batter.name}` };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
      } else {
        const failRoll = Math.random();
        if (failRoll < 0.45) { state.strikes++; if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} can't get the bunt down - strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} fails to bunt - strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } state.log.push({ type: 'strike', text: `${batter.name} misses the bunt - strike ${state.strikes}` }); state.lastPlay = { type: 'strike', text: `Missed bunt - strike ${state.strikes}` }; return; }
        else if (failRoll < 0.70) { batter.gameStats.ab++; pitcher.gameStats.so++; state.log.push({ type: 'popout', text: `${batter.name} pops up the bunt attempt - caught by the catcher!` }); state.lastPlay = { type: 'popout', text: `Pop-up bunt - out!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; }
        else { state.strikes++; if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt - strike ${state.strikes}` }); state.lastPlay = { type: 'foul', text: `Foul bunt - strike ${state.strikes}` }; return; }
      }
    }
    const buntingSkill = (batter.bunting || 3) / 10;
    const sf = batter.speed / 10;
    const pp = isPH ? 0.02 : 1.0;
    if (Math.random() < ((0.06 + buntingSkill * 0.15 + sf * 0.09) * pp)) {
      batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
      let rbiB = 0;
      for (let br = 2; br >= 0; br--) {
        if (state.bases[br]) {
          if (br + 1 >= 3) { chargeRun(state, state.bases[br]); rbiB++; state.bases[br] = null; }
          else if (!state.bases[br + 1]) { state.bases[br + 1] = state.bases[br]; state.bases[br] = null; }
        }
      }
      tagRunnerResponsiblePitcher(state, batter);
      state.bases[0] = batter;
      batter.gameStats.rbi += rbiB;
      const buntText = `${batter.name} ${pickLine(BUNT_SINGLE_LINES)}${rbiB ? ` ${rbiB} RBI!` : ''}`;
      state.log.push({ type: 'single', text: buntText });
      state.lastPlay = { type: 'single', text: buntText, infield: true };
      state.balls = 0; state.strikes = 0; advanceBatter(state); return;
    }
    else { state.strikes++; if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; state.log.push({ type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }); state.lastPlay = { type: 'strikeout', text: `${batter.name} bunts foul for strike three!` }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt - strike ${state.strikes}` }); state.lastPlay = { type: 'foul', text: `Foul bunt - strike ${state.strikes}` }; return; }
  }
  const isPower = swingType.name === 'Power Swing', isContact = swingType.name === 'Contact Swing';
  const adjBatter = getSituationalBatter(state);
  const contactRating = (adjBatter.baseContact || adjBatter.contact) / 10;
  const isPitcherBatting = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let contactChance = 0.43 + contactRating * 0.38;
  if (isPitcherBatting) contactChance *= 0.55;
  if (isPower) contactChance -= 0.10; if (isContact) contactChance += 0.12; if (!pitch.isStrike) contactChance -= 0.20;
  if (state.hitAndRun) { contactChance -= 0.08; contactChance = Math.max(0.03, contactChance); }
  const effP2 = getEffectivePitcher(state) || pitcher;
  contactChance -= (effP2.effectiveOffSpeed || effP2.offSpeed || pitcher.offSpeed) / 10 * 0.07 + (effP2.effectivePitchSpeed || effP2.pitchSpeed) / 10 * 0.05;
  if (effP2.fatigueLevel >= 3) contactChance += 0.08;
  contactChance *= Math.max(0.85, Math.min(1.15, adjBatter.contactMult || 1));
  contactChance = Math.max(0.05, Math.min(contactChance, 0.85));
  if (!(Math.random() < contactChance)) {
    if (!pitch.isStrike && !state.hitAndRun && Math.random() < 0.55 + contactRating * 0.18) { state.balls++; if (state.balls >= 4) { batter.gameStats.bb++; pitcher.gameStats.bb++; state.log.push({ type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }); state.lastPlay = { type: 'walk', text: `${batter.name} ${pickLine(WALK_LINES)}` }; handleWalk(state, batter); state.balls = 0; state.strikes = 0; advanceBatter(state); return; } const pt2 = (pitch.pitchType || '').toLowerCase(); let bl; if (pt2.includes('fast')) bl = pickLine(CALLED_BALL_FASTBALL_LINES); else if (pt2.includes('break') || pt2.includes('curve') || pt2.includes('slider') || pt2.includes('hook')) bl = pickLine(CALLED_BALL_BREAKING_LINES); else if (pt2.includes('change') || pt2.includes('off') || pt2.includes('split') || pt2.includes('fork')) bl = pickLine(CALLED_BALL_CHANGEUP_LINES); else bl = pickLine(CALLED_BALL_GENERIC_LINES); const bt = `Ball ${state.balls} - ${bl}`; state.log.push({ type: 'ball', text: bt }); state.lastPlay = { type: 'ball', text: bt }; return; }
    state.strikes++;
    if (state.strikes >= 3) { batter.gameStats.ab++; batter.gameStats.so++; pitcher.gameStats.so++; registerBigStrikeout(state, pitcher, batter); const isLooking = pitch.location && ['outside corner','inside corner','high strike','low strike','down the middle'].includes(pitch.location) && Math.random() < 0.45; const sl = isLooking ? pickLine(STRIKEOUT_CALLED_LINES) : pickLine(STRIKEOUT_SWINGING_LINES); const msg = sl.endsWith('!') ? `${batter.name} ${sl}` : `${batter.name} ${sl} ${pitch.pitchType}!`; state.log.push({ type: 'strikeout', text: msg }); state.lastPlay = { type: 'strikeout', text: msg }; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
      const situationType = getStrikeoutSituationType(state, pitcher, batter);
      const kCelebCheck = pitcherCelebration(state, situationType);
      if (kCelebCheck) { const celebText = pickStrikeoutCelebration(situationType) || rollPitcherKCelebration(pitcher); if (celebText) { state._celebrationBubble = celebText; state.log.push({ type: 'info', text: celebText }); } }
      else if (Math.random() < 0.15) { const kCelebration = rollPitcherKCelebration(pitcher); if (kCelebration) state.log.push({ type: 'info', text: `🔥 ${kCelebration}` }); }
      if (state.hitAndRun && !state.gameOver) handleHitAndRunCaught(state); return; }
    if (state.hitAndRun && !state.gameOver) { state.hitAndRun = false; handleHitAndRunMiss(state); }
    { const pt = (pitch.pitchType || '').toLowerCase(); let swingLine;
      if (pt.includes('fast')) swingLine = pickLine(SWINGING_STRIKE_FASTBALL_LINES);
      else if (pt.includes('break') || pt.includes('curve') || pt.includes('slider') || pt.includes('hook')) swingLine = pickLine(SWINGING_STRIKE_BREAKING_LINES);
      else if (pt.includes('change') || pt.includes('off') || pt.includes('split') || pt.includes('fork')) swingLine = pickLine(SWINGING_STRIKE_CHANGEUP_LINES);
      else swingLine = pickLine(SWINGING_STRIKE_GENERIC_LINES);
      const strikeLabel = `Strike ${state.strikes} - ${swingLine}`;
      state.log.push({ type: 'strike', text: strikeLabel }); state.lastPlay = { type: 'strike', text: strikeLabel };
    }
    return;
  }
  if (state.hitAndRun) { state.hitAndRun = false; handleHitAndRunContact(state, batter, pitcher, adjBatter); return; }
  batter.gameStats.ab++;
  if (Math.random() < 0.18) { if (state.strikes < 2) state.strikes++; const foulLine = pickLine(FOUL_BALL_LINES); state.log.push({ type: 'foul', text: `${batter.name} - ${foulLine}` }); state.lastPlay = { type: 'foul', text: `Foul ball` }; batter.gameStats.ab--; return; }
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1, doubleMod = wx.doubleMod || 1, errorWx = wx.errorMult || 1, contactWx = wx.contactMod || 0;
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const ballparkEffect = getBallparkEffect(stadiumName, adjBatter.bats, state.weather);
  const ballparkHRMod = ballparkEffect.hrMod || 1;
  const hitDirection = getHitDirection(adjBatter.bats);
  const powerRating = (adjBatter.basePower || adjBatter.power) / 10;
  const isPitcherBatting2 = batter.pos === 'SP' || batter.pos === 'RP' || batter.pos === 'CL' || (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  let hitChance = 0.14 + (contactRating + contactWx / 10) * 0.20;
  if (isPitcherBatting2) hitChance *= 0.45;
  if (isPower) hitChance -= 0.04; if (isContact) hitChance += 0.06;
  const effP3 = getEffectivePitcher(state) || pitcher;
  hitChance -= (effP3.effectiveControl || effP3.control) / 10 * 0.03;
  if (effP3.fatigueLevel >= 3) hitChance += 0.05; if (effP3.fatigueLevel >= 4) hitChance += 0.03;
  const gs = effP3.effectivePitchSpeed || effP3.pitchSpeed; if (gs <= 2 && effP3.fatigueLevel >= 3) hitChance += 0.04;
  hitChance += ((adjBatter.basePower || adjBatter.power) / 10) * 0.03;
  const defenders = getDefensivePlayers(state);
  let rp = 0; Object.values(defenders).forEach(d => { const adj = getAdjustedPlayer(d); if (adj.pos !== (adj.assignedPos || adj.pos)) rp += 0.010; });
  hitChance += rp; hitChance *= Math.max(0.85, Math.min(1.15, adjBatter.contactMult || 1)); hitChance = Math.max(0.11, Math.min(hitChance, 0.75));
  if (Math.random() < hitChance) {
    pitcher.gameStats.h++; batter.gameStats.hits++;
    let powerMod = isPower ? 1.50 : (isContact ? 0.5 : 1.0);
    const pwrMult = Math.max(0.85, Math.min(1.15, adjBatter.powerMult || 1)); const effPwr = powerRating * powerMod * pwrMult, sf2 = adjBatter.speed / 10, hr2 = Math.random();
    if (hr2 < effPwr * 0.40 * hrMod * ballparkHRMod) {
      const isRobable = isWallRobable(stadiumName, hitDirection);
      const isRobbed = isRobable && rollHRRobbery();
      if (isRobbed) {
        const fielder = defenders[['LF', 'CF', 'RF', 'RCF', 'LCF'][Math.floor(Math.random() * 5)]] || defenders['CF'] || { name: 'the outfielder' };
        const robberyCall = getRobberyCall(state.homeTeam, fielder.name);
        state.log.push({ type: 'flyout', text: robberyCall });
        state.lastPlay = { type: 'flyout', text: robberyCall };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        return;
      }
      batter.gameStats.hr++; registerHomeRun(state, batter, pitcher); const runnersOn = state.bases.filter(b => b !== null).length; const rbi = advanceRunners(state, 4, batter);
      const hrDistance = calculateHomeRunDistance(batter, pitcher, state, hitDirection, isPower, runnersOn === 3);
      batter.gameStats.lastHRDistance = hrDistance;
      batter.gameStats.longestHR = Math.max(batter.gameStats.longestHR || 0, hrDistance);
      const bp = BALLPARKS[stadiumName];
      const dirLabel = { LF: 'left field', LCF: 'left-center', CF: 'center field', RCF: 'right-center', RF: 'right field' }[hitDirection] || hitDirection;
      const distStr = hrDistance >= 430 ? `${hrDistance} feet - a tape-measure shot!` : `${hrDistance} feet`;
      let ht; const gs2 = runnersOn === 3;
      if (bp?.quirks?.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Up and over the Green Monster! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} clears the 37-foot wall at ${distStr}!`;
      else if (bp?.quirks?.includes('shortRF') && hitDirection === 'RF' && adjBatter.bats === 'L') ht = `Into the short porch! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} hooks it over the fence at ${distStr}!`;
      else if (bp?.quirks?.includes('peskyPole') && hitDirection === 'RF') ht = `Around Pesky's Pole! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} wraps it around the foul pole at ${distStr}!`;
      else if (bp?.quirks?.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF')) ht = `Onto Waveland Avenue! ${gs2 ? 'GRAND SLAM! ' : ''}${batter.name} launches one out of Wrigley at ${distStr}!`;
      else { ht = `${batter.name} sends it deep to ${dirLabel} at ${distStr} -` + (gs2 ? ` GRAND SLAM! ${batter.name} clears the bases!` : (rbi > 1 ? ` a ${rbi}-run HOME RUN!` : ` a solo HOME RUN!`)); }
      const battingTeamKey = state.halfInning === 'top' ? state.awayTeam : state.homeTeam;
      const hrCall = maybeGetAnnouncerHRCall(battingTeamKey, { isGrandSlam: gs2, rbi, batterName: batter.name, state });
      if (hrCall) state.log.push({ type: 'info', text: `🎙️ ${hrCall}` });
      state.log.push({ type: 'homerun', text: `💥 ${ht}`, hrDistance, batterName: batter.name }); state.lastPlay = { type: 'homerun', text: `💥 ${ht}`, hrDistance, batterName: batter.name };
      const hrAdmire = rollHRAdmire(batter); if (hrAdmire) { state.log.push({ type: 'info', text: `✨ ${hrAdmire}` }); state._celebrationBubble = `✨ ${hrAdmire}`; }
    } else if (adjBatter.speed >= 4 && hr2 < (effPwr * 0.40 + sf2 * 0.04) * doubleMod) {
      const rbi = advanceRunners(state, 3, batter, true, hitDirection);
      batter.gameStats.triples = (batter.gameStats.triples || 0) + 1;
      const tripText = `${pickHitLine(TRIPLE_LINES, batter.name)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: tripText });
      state.lastPlay = { type: 'triple', text: tripText };
      const tripleCeleb = rollHitCelebration(batter, true); if (tripleCeleb) { state.log.push({ type: 'info', text: `🔥 ${tripleCeleb}` }); state._celebrationBubble = `🔥 ${tripleCeleb}`; }
    // Offensive tuning: slight bump to extra-base (doubles) conversion so more
    // balls find the gap. Raises SLG/runs without inflating hit count or HR rate.
    } else if (hr2 < effPwr * 0.66 * doubleMod) {
      const rbi = advanceRunners(state, 2, batter, true, hitDirection);
      batter.gameStats.doubles = (batter.gameStats.doubles || 0) + 1;
      const dblText = `${pickHitLine(DOUBLE_LINES, batter.name)}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: dblText });
      state.lastPlay = { type: 'double', text: dblText };
    } else {
      const singleLine = pickHitLine(SINGLE_LINES, batter.name);
      const isInfieldHitLine = INFIELD_SINGLE_LINES.some(l => singleLine.includes(l.text));
      const effectiveDirection = isInfieldHitLine ? null : hitDirection;
      const rbi = advanceRunners(state, 1, batter, !isInfieldHitLine, effectiveDirection);
      const singleText = `${singleLine}${rbi ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'single', text: singleText });
      state.lastPlay = { type: 'single', text: singleText, infield: isInfieldHitLine };
    }
    state.balls = 0; state.strikes = 0; advanceBatter(state);
    const isOutfieldHit = state.lastPlay && ['single', 'double', 'triple'].includes(state.lastPlay.type) && !state.lastPlay.infield && hitDirection && (hitDirection.includes('LF') || hitDirection.includes('CF') || hitDirection.includes('RF') || hitDirection.includes('LCF') || hitDirection.includes('RCF'));
    if (isOutfieldHit && !state.gameOver) { processPostHitBaserunning(state, state.lastPlay.type, batter, defenders); }
  } else {
    const posNames = { '1B': 'first base', '2B': 'second base', '3B': 'third base', SS: 'shortstop', SP: 'the pitcher', C: 'the catcher', LF: 'left field', CF: 'center field', RF: 'right field' };
    const gps = [{ pos: 'SS', posName: 'shortstop' },{ pos: '2B', posName: 'second' },{ pos: '3B', posName: 'third' },{ pos: 'SP', posName: 'the pitcher' },{ pos: '1B', posName: 'first' }];
    const gp = gps[Math.floor(Math.random() * gps.length)];
    const gt = `${batter.name} ${pickLine(GROUNDOUT_LINES)}`.replace(/grounds out to (short|second|third|the pitcher|first)/, `grounds out to ${gp.posName}`);
    const sgt = `${pickLine(SOFT_GROUNDOUT_LINES)} ${defenders[gp.pos]?.name || gp.posName} makes the play.`;
    const hgt = `${pickLine(HARD_GROUNDOUT_LINES)} ${defenders[gp.pos]?.name || gp.posName} makes the play.`;
    const gts = [{ text: gt, pos: gp.pos, posName: gp.posName, type: 'groundout' },{ text: sgt, pos: gp.pos, posName: gp.posName, type: 'groundout' },{ text: hgt, pos: gp.pos, posName: gp.posName, type: 'groundout' }];
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
    if (isFlyBall) { state.pendingSteal = null; }
    if (isFlyBall && out.type !== 'popout') {
      const q = checkBallparkQuirk(stadiumName, adjBatter.bats, hitDirection, state.weather, batter.name, state);
      if (q && q.isHit) {
        batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
        if (q.isHR) {
          // Route ballpark-quirk HRs through the same pipeline as normal HRs
          // so they get: type:'homerun', hrDistance, batterName, announcer call,
          // celebration bubble, and proper display treatment (orange text, not white).
          batter.gameStats.hr++; registerHomeRun(state, batter, pitcher);
          const qRbi = advanceRunners(state, 4, batter);
          const qDist = calculateHomeRunDistance(batter, pitcher, state, hitDirection, false, false);
          batter.gameStats.lastHRDistance = qDist;
          batter.gameStats.longestHR = Math.max(batter.gameStats.longestHR || 0, qDist);
          const battingTeamKey = state.halfInning === 'top' ? state.awayTeam : state.homeTeam;
          const qCall = maybeGetAnnouncerHRCall(battingTeamKey, { isGrandSlam: qRbi === 4, rbi: qRbi, batterName: batter.name, state });
          if (qCall) state.log.push({ type: 'info', text: `🎙️ ${qCall}` });
          const qHt = `${q.text} ${qDist} feet!`;
          state.log.push({ type: 'homerun', text: `💥 ${qHt}`, hrDistance: qDist, batterName: batter.name });
          state.lastPlay = { type: 'homerun', text: `💥 ${qHt}`, hrDistance: qDist, batterName: batter.name };
          const qAdmire = rollHRAdmire(batter);
          if (qAdmire) { state.log.push({ type: 'info', text: `✨ ${qAdmire}` }); state._celebrationBubble = `✨ ${qAdmire}`; }
        } else {
          advanceRunners(state, q.bases, batter, true);
          state.log.push({ type: q.type, text: q.text });
          state.lastPlay = { type: q.type, text: q.text };
        }
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
      if (fielder) { const adjF = getAdjustedPlayer(fielder); if (Math.random() < getErrorChance(fielder.name) * adjF.errorMult * errorWx) { batter.gameStats.ab++; advanceRunners(state, 1, batter, false); const errText = `${fielder.name} ${pickLine(ERROR_LINES)} ${batter.name} reaches on an error!`; state.log.push({ type: 'error', text: errText }); state.lastPlay = { type: 'error', text: errText }; state.balls = 0; state.strikes = 0; advanceBatter(state); return; } }
    }
    if (isGrounder) {
      const alignmentMod = apply_alignment_modifiers(state._defensiveAlignment, { type: 'grounder', location: out.pos, play_at_plate_available: !!state.bases[2] }, {});
      const fielder = defenders[out.pos];
      if (fielder) {
        const af = getAdjustedPlayer(fielder);
        const rp2 = af.pos !== (af.assignedPos || af.pos) ? 0.06 : 0;
        let ihc = Math.max(0, (batter.speed / 10) * 0.22 - (af.arm / 10) * 0.15 - (af.defenseAdj / 10) * 0.05 + rp2);
        if (alignmentMod.through_infield_for_hit_prob) ihc += alignmentMod.through_infield_for_hit_prob;
        ihc = Math.max(0, Math.min(1, ihc));
        if (Math.random() < ihc) {
          batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
          for (let br = 2; br >= 0; br--) {
            if (state.bases[br]) {
              if (br + 1 >= 3) { chargeRun(state, state.bases[br]); batter.gameStats.rbi++; state.bases[br] = null; }
              else if (!state.bases[br + 1]) { state.bases[br + 1] = state.bases[br]; state.bases[br] = null; }
            }
          }
          tagRunnerResponsiblePitcher(state, batter);
          state.bases[0] = batter;
          const isText = `${batter.name} beats it out - infield single past ${fielder.name}!`;
          state.log.push({ type: 'single', text: isText });
          state.lastPlay = { type: 'single', text: isText, infield: true };
          state.balls = 0; state.strikes = 0; advanceBatter(state); return;
        }
      }
    }
    if (isGrounder) {
      const r1 = state.bases[0], r2 = state.bases[1];
      if (r1 && state.outs < 2) {
        if (state.outs >= 2 && r2 && isGrounder) {
          const r3 = state.bases[2];
          if (r3 && r3.name !== r1.name && r3.name !== r2.name) { chargeRun(state, r3); batter.gameStats.rbi++; }
          state.bases[2] = r2; state.bases[1] = r1; state.bases[0] = null;
          batter.gameStats.ab++;
          const fc2Out = `${batter.name} grounds to ${posNames[out.pos] || out.pos} - runners advance on contact, ${out.pos === 'SS' || out.pos === '2B' ? 'force at 1st' : 'out at 1st'}!`;
          state.log.push({ type: 'groundout', text: fc2Out });
          state.lastPlay = { type: 'groundout', text: fc2Out };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
        }
      }
      if (isCriticalRunSituation(state)) {
        const r3cr = state.bases[2];
        const forceAtHome = !!state.bases[0] && !!state.bases[1];
        const fielderName = defenders[out.pos]?.name?.split(' ').pop() || posNames[out.pos] || out.pos;
        const catcherName = defenders['C']?.name?.split(' ').pop() || 'the catcher';
        const firstBaseName = defenders['1B']?.name?.split(' ').pop() || 'first';
        if (forceAtHome) {
          const r2cr = state.bases[1], r1cr = state.bases[0];
          state.bases[2] = r2cr; state.bases[1] = r1cr; state.bases[0] = null;
          batter.gameStats.ab++;
          if (Math.random() < 0.15) {
            tagRunnerResponsiblePitcher(state, batter);
            state.bases[0] = batter;
            const fcText = `${batter.name} grounds to ${fielderName} - throws home to force ${r3cr.name}! Batter beats the relay to first - run held, no run scores!`;
            state.log.push({ type: 'fc', text: fcText }); state.lastPlay = { type: 'fc', text: fcText };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
          } else {
            const dpLine = pickLine(DOUBLE_PLAY_LINES);
            const dpText = `${batter.name} grounds to ${fielderName} - throws home for the force, ${catcherName} relays to ${firstBaseName} - ${dpLine}! ${r3cr.name} held - no run scores!`;
            state.log.push({ type: 'doubleplay', text: dpText }); state.lastPlay = { type: 'doubleplay', text: dpText };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
            if (!state.gameOver && state.outs < 3) recordOut(state); return;
          }
        } else {
          if (Math.random() < 0.55) {
            state.bases[2] = null;
            if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
            tagRunnerResponsiblePitcher(state, batter);
            state.bases[0] = batter;
            batter.gameStats.ab++;
            const fcText = `${batter.name} grounds to ${fielderName} - throws home! ${catcherName} tags out ${r3cr.name} at the plate! Run prevented!`;
            state.log.push({ type: 'fc', text: fcText }); state.lastPlay = { type: 'fc', text: fcText };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
          } else {
            if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
            tagRunnerResponsiblePitcher(state, batter);
            state.bases[0] = batter;
            batter.gameStats.ab++;
            const goText = `${batter.name} grounds out to ${fielderName} - ${r3cr.name} holds at third, out at first.`;
            state.log.push({ type: 'groundout', text: goText }); state.lastPlay = { type: 'groundout', text: goText };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
          }
        }
      }
      if (r1 && state.outs < 2) {
        const mi = getMiddleInfieldRating(defenders);
        let dpc = 0.30 + (mi / 10) * 0.22 - ((r1 ? r1.speed : 5) / 10) * 0.04; dpc = Math.max(0.10, Math.min(dpc, 0.45));
        const roll = Math.random();
        if (roll < dpc) {
          const isMI = ['2B','SS'].includes(out.pos);
          const takeout = r1 ? rollTakeoutSlide(r1) : null;
          if (takeout) {
            if (r2 && !state.bases[2]) { state.bases[2] = r2; }
            tagRunnerResponsiblePitcher(state, batter);
            state.bases[0] = batter; batter.gameStats.ab++;
            state.bases[1] = null;
            state.log.push({ type: 'groundout', text: `${batter.name} grounds to ${out.posName || out.pos} - ${takeout.text}` });
            state.lastPlay = { type: 'groundout', text: `${batter.name} grounds - DP broken up`, collision: true, collisionFielder: defenders['2B']?.name || defenders['SS']?.name };
            state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
          }
          if (r1 && r2 && !isMI) { const r3 = state.bases[2]; if (r3 && state.outs === 0) { chargeRun(state, r3); batter.gameStats.rbi++; } state.bases[2] = null; state.bases[1] = r1 || null; state.bases[0] = null; const dpLine3 = pickLine(DOUBLE_PLAY_LINES); const dpFPos3 = out.pos; const dpFName3 = defenders[dpFPos3]?.name?.split(' ').pop() || dpFPos3; const firstNm = defenders['1B']?.name?.split(' ').pop() || 'first'; let dpRoute3; if (dpFPos3 === '3B') { dpRoute3 = `${dpFName3} steps on third, throws to ${firstNm}`; } else if (dpFPos3 === '1B') { dpRoute3 = `${dpFName3} steps on first, fires to third`; } else if (dpFPos3 === 'SP') { dpRoute3 = `${dpFName3} pounces, throws to third, relay to first`; } else { dpRoute3 = `${dpFName3} to third, relay to first`; } const dpText3 = `${batter.name} grounds to ${dpFName3} - ${dpRoute3} - ${dpLine3}`; state.log.push({ type: 'doubleplay', text: dpText3 }); state.lastPlay = { type: 'doubleplay', text: dpText3 }; }
          else { const r3dp = state.bases[2]; if (r3dp && state.outs === 0) { chargeRun(state, r3dp); batter.gameStats.rbi++; state.bases[2] = null; } if (state.bases[1]) { state.bases[2] = state.bases[2] || state.bases[1]; state.bases[1] = null; } state.bases[0] = null; const dpLine = pickLine(DOUBLE_PLAY_LINES); const dpFielderPos = out.pos; const dpFielderName = defenders[dpFielderPos]?.name?.split(' ').pop() || dpFielderPos; const ssName = defenders['SS']?.name?.split(' ').pop() || 'short'; const b2Name = defenders['2B']?.name?.split(' ').pop() || 'second'; let dpRoute; if (dpFielderPos === '2B') { dpRoute = `${dpFielderName} to ${ssName} covering, relay to first`; } else if (dpFielderPos === 'SS') { dpRoute = `${dpFielderName} to ${b2Name} covering, relay to first`; } else if (dpFielderPos === '3B') { dpRoute = `${dpFielderName} to ${b2Name}, relay to first`; } else if (dpFielderPos === '1B') { dpRoute = `${dpFielderName} to ${ssName} covering second, back to first`; } else if (dpFielderPos === 'SP') { dpRoute = `${dpFielderName} to ${b2Name}, relay to first`; } else { dpRoute = `${b2Name} to first`; } const dpText = dpLine.includes('grounds into') ? `${batter.name} ${dpLine}` : `${batter.name} grounds to ${dpFielderName} - ${dpRoute} - ${dpLine}`; state.log.push({ type: 'doubleplay', text: dpText }); state.lastPlay = { type: 'doubleplay', text: dpText }; }
          if (!state.lastPlay || state.lastPlay.type !== 'doubleplay') { const _fbDP = `${batter.name} grounds into a double play`; state.log.push({ type: 'doubleplay', text: _fbDP }); state.lastPlay = { type: 'doubleplay', text: _fbDP }; console.error('[gameEngine] DP resolved without narration - fallback used'); }
          state.balls = 0; state.strikes = 0; advanceBatter(state);
          recordOut(state);
          if (!state.gameOver && state.outs < 3) recordOut(state);
          return;
        } else if (roll < dpc + 0.30) {
          let fcText;
          const fielderPos = out.pos;
          const r1runner = r1, r2runner = r2;
          if (r1runner && r2runner && state.outs < 2) {
            const r3 = state.bases[2];
            const forceAtThird = fielderPos === '3B' || (fielderPos === 'SP' && Math.random() < 0.4);
            if (forceAtThird) {
              if (r3) { chargeRun(state, r3); batter.gameStats.rbi++; }
              state.bases[2] = null; state.bases[1] = r1runner;
              tagRunnerResponsiblePitcher(state, batter);
              state.bases[0] = batter; batter.gameStats.ab++;
              fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[fielderPos] || fielderPos} - force out at 3rd! ${r2runner ? r2runner.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} - batter reaches on fielder's choice.`;
            } else {
              if (r3) { chargeRun(state, r3); batter.gameStats.rbi++; }
              state.bases[2] = state.bases[1]; state.bases[1] = null;
              tagRunnerResponsiblePitcher(state, batter);
              state.bases[0] = batter; batter.gameStats.ab++;
              fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[fielderPos] || fielderPos} - force out at 2nd! ${r1runner ? r1runner.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} - batter reaches on fielder's choice.`;
            }
          }
          else { const r3 = state.bases[2]; if (r3) { chargeRun(state, r3); batter.gameStats.rbi++; } state.bases[2] = state.bases[1]; state.bases[1] = null; tagRunnerResponsiblePitcher(state, batter); state.bases[0] = batter; batter.gameStats.ab++; fcText = `${batter.name} ${pickLine(FC_LINES)} ${posNames[out.pos] || out.pos} - force out at 2nd! ${r1 ? r1.name + ' retired' : ''}${r3 ? ` ${r3.name.split(' ').pop()} scores` : ''} - batter reaches on fielder's choice.`; }
          state.log.push({ type: 'fc', text: fcText }); state.lastPlay = { type: 'fc', text: fcText };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
        }
      }
      if (r1 && isGrounder) { const r1n = state.bases[0], r3n = state.bases[2], r2n = state.bases[1]; if (r3n && r2n && r1n && state.outs < 2) { chargeRun(state, r3n); batter.gameStats.rbi++; out.text = `${out.text} - ${r3n.name.split(' ').pop()} scores`; state.bases[2] = null; } const sr2 = state.bases[1]; state.bases[0] = null; state.bases[1] = r1n; state.bases[2] = sr2 || state.bases[2]; if (!out.text.includes('advances') && !out.text.includes('scores') && !(state.outs >= 2)) out.text = `${out.text} - ${r1n.name.split(' ').pop()} advances to second`; }
      if (!r1 && state.bases[1] && !state.bases[2] && state.outs < 2 && isGrounder) { const runner = state.bases[1]; const isRS = ['1B','2B'].includes(out.pos); const ac = isRS ? 0.55 + (runner.speed / 10) * 0.35 : 0.05 + (runner.speed / 10) * 0.20; if (Math.random() < Math.max(0.05, ac)) { state.bases[2] = runner; state.bases[1] = null; out.text = `${out.text} - ${runner.name.split(' ').pop()} advances to third`; } }
      // Productive groundout: runner on 3rd scores on grounder with < 2 outs
      // (non-critical situation, infield playing back). Right-side grounders
      // score more often. This was entirely missing - runners on 3rd never
      // scored on routine groundouts outside DP/FC/critical paths.
      if (state.bases[2] && state.outs < 2) {
        const r3p = state.bases[2];
        const isRS2 = ['1B', '2B'].includes(out.pos);
        const prodC = isRS2 ? 0.58 + (r3p.speed / 10) * 0.30 : 0.28 + (r3p.speed / 10) * 0.20;
        if (Math.random() < Math.max(0.08, Math.min(prodC, 0.80))) {
          chargeRun(state, r3p); batter.gameStats.rbi++; state.bases[2] = null;
          out.text = `${out.text} - ${r3p.name.split(' ').pop()} scores on the productive out!`;
        }
      }
    }
    const isOutfieldFly = isFlyBall && out.type !== 'popout' && out.type !== 'lineout' && out.depth !== 'shallow';
    if (isOutfieldFly && state.bases[2] && state.outs < 2) { const r = state.bases[2]; const d2 = out.depth === 'deep'; const db = d2 ? 0.30 : 0.05; const sfc = 0.43 + db + (r.speed / 10) * 0.48 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.10, Math.min(sfc, 0.90))) { chargeRun(state, r); state.bases[2] = null; batter.gameStats.rbi++; const sfText = `${batter.name} ${pickLine(SAC_FLY_LINES)} ${r.name} tags and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; state._celebrationBubble = sfText; batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } }
    if (isOutfieldFly) { const r3 = state.bases[2], r2 = state.bases[1], r1 = state.bases[0]; const isDeep = out.depth === 'deep'; if (r3 && state.outs < 2) { const db2 = isDeep ? 0.42 : 0.12; const htc = db2 + (r3.speed / 10) * 0.40 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.05, Math.min(htc, 0.65))) { chargeRun(state, r3); batter.gameStats.rbi++; state.bases[2] = null; const sfText = `${r3.name} tags up and scores!`; state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText }; state._celebrationBubble = sfText; if (r2 && state.outs < 2) { const tc2 = isDeep ? (0.15 + (r2.speed / 10) * 0.40 - (getOutfieldArm(defenders) / 10) * 0.10) : (0.05 + (r2.speed / 10) * 0.25 - (getOutfieldArm(defenders) / 10) * 0.08); if (Math.random() < Math.max(0.03, Math.min(tc2, 0.35))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r2.name} tags up and advances to third!`; } } batter.gameStats.ab--; state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return; } } if (r1 && isDeep && !state.bases[1] && state.outs < 2) { const r1Tag = state.bases[0]; if (r1Tag) { const tc1 = 0.15 + (r1Tag.speed / 10) * 0.45 - (getOutfieldArm(defenders) / 10) * 0.08; if (Math.random() < Math.max(0.06, Math.min(tc1, 0.55))) { state.bases[1] = r1Tag; state.bases[0] = null; state.log.push({ type: 'info', text: `${r1Tag.name} tags up and advances to second!` }); state._celebrationBubble = `🏃 ${r1Tag.name} tags up and advances to second!`; } } } if (r2 && state.outs < 2 && !state.bases[2]) { const depthBonus2 = isDeep ? 0.25 : 0; const tc3 = 0.10 + (r2.speed / 10) * 0.35 - (getOutfieldArm(defenders) / 10) * 0.10 + depthBonus2; const cap2 = isDeep ? 0.85 : 0.35; if (Math.random() < Math.max(0.04, Math.min(tc3, cap2))) { state.bases[2] = r2; state.bases[1] = null; state.log.push({ type: 'info', text: `${r2.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r2.name} tags up and advances to third!`; } } }
    const isDefFly = out.type === 'flyout';
    if (isDefFly) {
      if (rollRareCatchEvent()) {
        const rareTypes = ['snowCone', 'juggled', 'sliding', 'overShoulder'];
        const rareType = rareTypes[Math.floor(Math.random() * rareTypes.length)];
        const fielder = defenders[out.pos] || { name: 'the fielder' };
        const rareCall = getRareCatchCall(fielder.name, rareType);
        out.text = rareCall;
        state.log.push({ type: 'flyout', text: rareCall }); state.lastPlay = { type: 'flyout', text: rareCall };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state); return;
      }
      if (rollDivingCatch()) {
        const fielder = defenders[out.pos] || { name: 'the outfielder' };
        const dcCall = getDivingCatchCall(state.homeTeam, fielder.name, out.pos);
        out.text = dcCall; out.isDivingCatch = true; out.divingCatchFielder = fielder.name;
      }
    } else if (out.type === 'groundout') {
      if (rollDivingStop()) {
        const fielder = defenders[out.pos] || { name: 'the infielder' };
        const dsResult = getDivingStopResult(state.homeTeam, fielder.name, out.pos);
        if (dsResult.type === 'out') {
          out.text = dsResult.text; out.divingStopOut = true; out.divingStopPos = dsResult.pos; out.divingStopFielder = fielder.name;
        } else if (dsResult.type === 'knockdown') {
          batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
          if (state.bases[2]) { chargeRun(state, state.bases[2]); batter.gameStats.rbi++; state.bases[2] = null; }
          if (state.bases[1]) { if (!state.bases[2]) { state.bases[2] = state.bases[1]; } else { chargeRun(state, state.bases[1]); batter.gameStats.rbi++; } state.bases[1] = null; }
          if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
          tagRunnerResponsiblePitcher(state, batter); state.bases[0] = batter;
          state.log.push({ type: 'single', text: dsResult.text, divingStopPos: dsResult.pos });
          state.lastPlay = { type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, infield: true, divingStop: true, divingStopFielder: fielder.name };
          state.balls = 0; state.strikes = 0; advanceBatter(state); return;
        } else {
          batter.gameStats.ab++; batter.gameStats.hits++; pitcher.gameStats.h++;
          if (state.bases[2]) { chargeRun(state, state.bases[2]); batter.gameStats.rbi++; state.bases[2] = null; }
          if (state.bases[1]) { if (!state.bases[2]) { state.bases[2] = state.bases[1]; } else { chargeRun(state, state.bases[1]); batter.gameStats.rbi++; } state.bases[1] = null; }
          if (state.bases[0]) { state.bases[1] = state.bases[0]; state.bases[0] = null; }
          tagRunnerResponsiblePitcher(state, batter); state.bases[0] = batter;
          state.log.push({ type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, divingStopSave: true });
          state.lastPlay = { type: 'single', text: dsResult.text, divingStopPos: dsResult.pos, divingStopSave: true, infield: true, divingStop: true, divingStopFielder: fielder.name };
          state.balls = 0; state.strikes = 0; advanceBatter(state); return;
        }
      }
    }
    const outExtra = {};
    if (out.divingStopOut) { outExtra.divingStopOut = true; outExtra.divingStopPos = out.divingStopPos; }
    if (out.divingCatchFielder) { outExtra.divingCatch = true; outExtra.divingCatchFielder = out.divingCatchFielder; }
    if (out.divingStopFielder) { outExtra.divingStop = true; outExtra.divingStopFielder = out.divingStopFielder; }
    state.log.push({ type: isFlyBall ? 'flyout' : 'groundout', text: out.text, ...outExtra });
    state.lastPlay = { type: isFlyBall ? 'flyout' : 'groundout', text: out.text, ...outExtra };
    if (out.isDivingCatch || out.divingStopOut) { state._celebrationBubble = out.text; }
    state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
    if (out.isDivingCatch) { const fc = rollFielderCelebration(TEAMS[state.homeTeam]?.stadium); if (fc) { state.log.push({ type: 'info', text: `🎉 ${fc}` }); state._celebrationBubble = `🎉 ${fc}`; } }
    if (state.outs >= 3 && state._pitcherRetiredSideName && !state.gameOver) {
      const pitcherObj = { name: state._pitcherRetiredSideName };
      const rc = rollPitcherRetireSide(pitcherObj); if (rc) { state.log.push({ type: 'info', text: `🔥 ${rc}` }); state._celebrationBubble = `🔥 ${rc}`; }
      delete state._pitcherRetiredSideName;
    }
  }
}

// ── Hit-and-run helpers ──
export function handleHitAndRunContact(state, batter, pitcher, adjBatter) {
  const cr = adjBatter.contact / 10, pr = adjBatter.power / 10;
  const defenders = getDefensivePlayers(state);
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1, doubleMod = wx.doubleMod || 1;
  const pn = { '1B':'first','2B':'second','3B':'third',SS:'shortstop',SP:'the pitcher',C:'the catcher',LF:'left',CF:'center',RF:'right' };
  if (Math.random() < 0.18) { if (state.strikes < 2) state.strikes++; state.hitAndRun = true; state.log.push({ type: 'foul', text: `${batter.name} fouls it off on the hit-and-run - runner holds` }); return; }
  batter.gameStats.ab++;
  const effP = getEffectivePitcher(state) || pitcher;
  let hc = 0.18 + cr * 0.28; hc -= (pitcher.offSpeed / 10) * 0.07 + (effP.effectivePitchSpeed || effP.pitchSpeed) / 10 * 0.05; hc = Math.max(0.08, Math.min(hc, 0.68));
  if (Math.random() < hc) {
    batter.gameStats.hits++; pitcher.gameStats.h++;
    const hrr = Math.random();
    if (hrr < pr * 0.09 * hrMod) { batter.gameStats.hr++; const hrRbi = advanceRunners(state, 4, batter); const hrDirHR = getHitDirection(adjBatter.bats); const hrDistanceHR = calculateHomeRunDistance(batter, pitcher, state, hrDirHR, false, false); batter.gameStats.lastHRDistance = hrDistanceHR; batter.gameStats.longestHR = Math.max(batter.gameStats.longestHR || 0, hrDistanceHR); const battingTeamKeyHR = state.halfInning === 'top' ? state.awayTeam : state.homeTeam;           const hrCallHR = maybeGetAnnouncerHRCall(battingTeamKeyHR, { isGrandSlam: false, rbi: hrRbi, batterName: batter.name, state }); if (hrCallHR) state.log.push({ type: 'info', text: `🎙️ ${hrCallHR}` }); const hrText = `💥 ${batter.name} crushes one on the hit-and-run - HOME RUN at ${hrDistanceHR} feet!`; state.log.push({ type: 'homerun', text: hrText, hrDistance: hrDistanceHR, batterName: batter.name }); state.lastPlay = { type: 'homerun', text: hrText, hrDistance: hrDistanceHR, batterName: batter.name }; }
    else if (hrr < pr * 0.32 * doubleMod) { advanceRunners(state, 2, batter, true); const e = advanceHitAndRunRunners(state, batter); const dblText = e ? `${batter.name} rips a double on the hit-and-run! ${e}` : `${batter.name} doubles on the hit-and-run!`; state.log.push({ type: 'double', text: dblText }); state.lastPlay = { type: 'double', text: dblText }; }
    else { advanceRunners(state, 1, batter, true); const e = advanceHitAndRunRunners(state, batter); const sglText = e ? `${batter.name} slaps a single - hit-and-run! ${e}` : `${batter.name} singles on the hit-and-run!`; state.log.push({ type: 'single', text: sglText }); state.lastPlay = { type: 'single', text: sglText }; }
  } else {
    const orr = Math.random();
    if (orr < 0.45) { const gps = ['SS','2B','3B','SP','1B']; const gp = gps[Math.floor(Math.random() * gps.length)]; let sn = []; for (let i = 2; i >= 0; i--) { const r = state.bases[i]; if (!r) continue; if (i + 1 >= 3) { chargeRun(state, r); batter.gameStats.rbi++; sn.push(r.name.split(' ').pop()); state.bases[i] = null; } else if (!state.bases[i + 1]) { state.bases[i + 1] = r; state.bases[i] = null; } } const goText = `${batter.name} grounds out to ${pn[gp]}${sn.length ? ` - ${sn.join(', ')} scores` : ''} - runners advance on the hit-and-run`; state.log.push({ type: 'groundout', text: goText }); state.lastPlay = { type: 'groundout', text: goText }; recordOut(state); }
    else if (orr < 0.68) { const fpk = ['LF','CF','RF']; const fp = fpk[Math.floor(Math.random() * fpk.length)]; const dr = Math.random(); const isD = dr < 0.35, isS = dr > 0.65; let foText; if (isS) foText = `${pickLine(SHALLOW_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch - caught on the hit-and-run.`; else if (isD) foText = `${pickLine(DEEP_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch - caught on the hit-and-run.`; else foText = `${pickLine(MEDIUM_FLYOUT_LINES)} ${defenders[fp]?.name || pn[fp]} makes the catch - caught on the hit-and-run.`; state.log.push({ type: 'flyout', text: foText }); state.lastPlay = { type: 'flyout', text: foText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; if (isD && i === 2 && state.outs < 3) { const tc = 0.15 + (r.speed / 10) * 0.40; if (Math.random() < tc) { chargeRun(state, r); batter.gameStats.rbi++; state.bases[i] = null; batter.gameStats.ab--; state.log.push({ type: 'sacfly', text: `${r.name} tags and scores on the deep fly!` }); } } else if (isS && state.outs < 3) { let ct = false, tb = ''; if (fp === 'RF' && i <= 1) { ct = true; tb = i === 0 ? 'first' : 'second'; } else if (fp === 'CF' && i === 1) { ct = true; tb = 'second'; } else if (fp === 'LF' && i >= 1) { ct = true; tb = i === 1 ? 'second' : 'third'; } if (ct) { const ofa = (defenders[fp]?.arm || 5) / 10; if (Math.random() < Math.max(0.05, Math.min(0.18 + ofa * 0.25 - (r.speed / 10) * 0.12, 0.50))) { state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} can't get back to ${tb} - doubled off on the hit-and-run!` }); recordOut(state); break; } } } } } }
    else if (orr < 0.88) { const lpk = ['3B','SS','1B','2B']; const lp = lpk[Math.floor(Math.random() * lpk.length)]; const f = defenders[lp]; const loText = `${pickLine(Math.random() < 0.5 ? INFIELD_LINEOUT_SOFT_LINES : INFIELD_LINEOUT_HARD_LINES)} ${f?.name || pn[lp]} makes the catch - caught on the hit-and-run.`; state.log.push({ type: 'lineout', text: loText }); state.lastPlay = { type: 'lineout', text: loText }; recordOut(state); if (!state.gameOver) { for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const doc = 0.50 + ((f?.arm || 5) / 10) * 0.15 - (r.speed / 10) * 0.10; if (state.outs < 3 && Math.random() < Math.max(0.25, Math.min(doc, 0.75))) { state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} doubled off ${['first','second','third'][i]} - caught on the hit-and-run!` }); recordOut(state); break; } } } }
    else { const ppk = ['C','2B','3B']; const pp = ppk[Math.floor(Math.random() * ppk.length)]; const f = defenders[pp]; const poText = `${pickLine(INFIELD_POPUP_LINES)} ${f?.name || pn[pp]} makes the catch - runners hold on the hit-and-run.`; state.log.push({ type: 'popout', text: poText }); state.lastPlay = { type: 'popout', text: poText }; recordOut(state); }
  }
  state.balls = 0; state.strikes = 0; advanceBatter(state);
}

export function advanceHitAndRunRunners(state, batter) {
  let er = 0; const av = [];
  for (let i = 2; i >= 0; i--) { const r = state.bases[i]; if (!r || r.name === batter.name) continue; if (i + 1 >= 3) { chargeRun(state, r); er++; state.bases[i] = null; av.push(`${r.name.split(' ').pop()} scores`); } else if (!state.bases[i + 1]) { state.bases[i + 1] = r; state.bases[i] = null; av.push(`${r.name.split(' ').pop()} to ${i + 1 === 2 ? 'third' : 'second'}`); } }
  if (er > 0) batter.gameStats.rbi += er;
  const r3 = state.bases[2], b1 = state.bases[0];
  if (b1 && b1.name === batter.name && r3 && !state.bases[1]) { const d = getDefensivePlayers(state); const oa = getOutfieldArm(d); const sc = 0.10 + (r3.speed / 10) * 0.35 - (oa / 10) * 0.08 + (batter.speed / 10) * 0.12; if (Math.random() < Math.max(0.03, Math.min(sc, 0.45))) { state.bases[1] = batter; state.bases[0] = null; av.push(`${batter.name.split(' ').pop()} takes second on the throw`); } }
  return av.length > 0 ? av.join(', ') : null;
}

export function handleHitAndRunCaught(state) {
  for (let i = 0; i < 3; i++) { const r = state.bases[i]; if (!r) continue; const cc = 0.50 - (r.speed / 10) * 0.30; if (Math.random() < cc) { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; recordOut(state); const tb = i + 1; const bn = tb === 1 ? 'second' : tb === 2 ? 'third' : 'home'; const cstxt = `${r.name} caught stealing on the hit-and-run!`; state.log.push({ type: 'caughtstealing', text: cstxt }); state.lastPlay = { type: 'caughtstealing', text: cstxt }; state._celebrationBubble = cstxt; break; } else { if (i + 1 < 3) { state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} advances on the hit-and-run!` }); } } }
  state.hitAndRun = false;
}

export function handleHitAndRunMiss(state) {
  for (let i = 0; i < 2; i++) { const r = state.bases[i]; if (!r || state.bases[i + 1]) continue; const d = getDefensivePlayers(state); const ca = getCatcherArm(d); const sc = 0.20 + (r.speed / 10) * 0.55 - (ca / 10) * 0.12; if (Math.random() < Math.max(0.10, Math.min(sc, 0.75))) { r.gameStats.sb = (r.gameStats.sb || 0) + 1; state.bases[i + 1] = r; state.bases[i] = null; state.log.push({ type: 'info', text: `${r.name} steals on the hit-and-run` }); } else { r.gameStats.cs = (r.gameStats.cs || 0) + 1; state.bases[i] = null; const cstxt = `${r.name} caught stealing on the hit-and-run!`; state.log.push({ type: 'caughtstealing', text: cstxt }); state.lastPlay = { type: 'caughtstealing', text: cstxt }; state._celebrationBubble = cstxt; recordOut(state); } break; }
}

// ── Process base outs + batter stretching after a hit ──
export function processPostHitBaserunning(state, hitType, batter, defenders) {
  if (state._pendingBaseOuts && state._pendingBaseOuts.length > 0) {
    for (const out of state._pendingBaseOuts) {
      state.log.push({ type: 'info', text: out.text });
      if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} - ${out.text}`;
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
    state.log.push({ type: 'caughtstealing', text: stretch.text });
    state.lastPlay = { type: 'caughtstealing', text: stretch.text };
    state._celebrationBubble = stretch.text;
    recordOut(state);
  } else if (stretch.type === 'safe_double') {
    if (state.bases[1] && state.bases[1].name !== batter.name) {
      if (!state.bases[2]) {
        state.bases[2] = state.bases[1];
        state.log.push({ type: 'info', text: `${state.bases[1].name} advances to third on the stretch!` });
      } else {
        chargeRun(state, state.bases[1]); batter.gameStats.rbi++;
        state.log.push({ type: 'info', text: `${state.bases[1].name} scores on the stretch!` });
      }
    }
    state.bases[1] = batter; state.bases[0] = null;
    state.log.push({ type: 'info', text: stretch.text });
    if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} - ${stretch.text}`;
  } else if (stretch.type === 'safe_triple') {
    if (state.bases[2] && state.bases[2].name !== batter.name) {
      chargeRun(state, state.bases[2]); batter.gameStats.rbi++;
      state.log.push({ type: 'info', text: `${state.bases[2].name} scores on the stretch to third!` });
    }
    state.bases[2] = batter; state.bases[1] = null;
    state.log.push({ type: 'info', text: stretch.text });
    if (state.lastPlay && state.lastPlay.text) state.lastPlay.text = `${state.lastPlay.text} - ${stretch.text}`;
  } else if (stretch.type === 'inside_park_hr') {
    state.bases[2] = null;
    batter.gameStats.hr++; batter.gameStats.rbi++;
    chargeRun(state, batter);
    const iphrDistance = calculateHomeRunDistance(batter, getCurrentPitcher(state), state, 'CF', false, false);
    batter.gameStats.lastHRDistance = iphrDistance;
    batter.gameStats.longestHR = Math.max(batter.gameStats.longestHR || 0, iphrDistance);
    state.log.push({ type: 'homerun', text: stretch.text, hrDistance: iphrDistance, batterName: batter.name });
    state.lastPlay = { type: 'homerun', text: stretch.text, hrDistance: iphrDistance, batterName: batter.name };
  }
}

// ── Tag-up outcomes on outfield flyouts ──
export function processFlyoutTagUps(state, out, defenders, batter) {
  const depth = out.depth;
  const fieldPos = out.pos;
  const ofArm = getOutfieldArm(defenders);
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
        r.gameStats.cs = (r.gameStats.cs || 0) + 1;
        state.bases[2] = null; batter.gameStats.ab--;
        const outText = `${r.name} - ${pickLine(TAG_UP_THIRD_TO_HOME_OUT_LINES)}`;
        state.log.push({ type: 'info', text: outText }); state.lastPlay = { type: 'info', text: outText };
        state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
        return true;
      }
      chargeRun(state, r); state.bases[2] = null;
      batter.gameStats.rbi++;
      const sfText = `${batter.name} ${pickLine(SAC_FLY_LINES)} ${r.name} tags and scores!`;
      state.log.push({ type: 'sacfly', text: sfText }); state.lastPlay = { type: 'sacfly', text: sfText };
      state._celebrationBubble = sfText;
      batter.gameStats.ab--;
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
              state.log.push({ type: 'info', text: `${r2.name} - ${pickLine(TAG_UP_SECOND_TO_THIRD_OUT_LINES)}` });
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
          const outText = `${r.name} - ${pickLine(TAG_UP_SECOND_TO_THIRD_OUT_LINES)}`;
          state.log.push({ type: 'info', text: outText }); state.lastPlay = { type: 'info', text: outText };
          state.balls = 0; state.strikes = 0; advanceBatter(state); recordOut(state);
          return true;
        }
        state.bases[2] = r; state.bases[1] = null;
        state.log.push({ type: 'info', text: `${r.name} tags up and advances to third!` }); state._celebrationBubble = `🏃 ${r.name} tags up and advances to third!`;
      }
    }
  }
  if (state.bases[0] && !state.bases[1] && depth === 'deep') {
    const r = state.bases[0];
    const sf = r.speed / 10;
    const attemptChance = Math.max(0, (sf - 0.6) * 0.04 - (ofArm / 10) * 0.03);
    if (Math.random() < Math.max(0.001, Math.min(attemptChance, 0.01))) {
      const caughedChance = 0.10 + (ofArm / 10) * 0.20 - sf * 0.10;
      if (Math.random() < Math.max(0.05, Math.min(caughedChance, 0.35))) {
        r.gameStats.cs = (r.gameStats.cs || 0) + 1;
        state.bases[0] = null; batter.gameStats.ab--;
        const outText = `${r.name} - ${pickLine(TAG_UP_FIRST_TO_SECOND_OUT_LINES)}`;
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