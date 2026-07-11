// argumentLogic.js - Extracted from Home.jsx to reduce file size.
// Handles umpire argument checks, ejections, and manager suspension gating.
//
// Suspension gating: if a team's manager is suspended (Season Mode), the acting
// manager is in charge and cannot argue or be ejected. The suspended manager
// flags (_homeManagerSuspended / _awayManagerSuspended) are set on the game state
// in startGame based on the season's active suspensions.

import { getArgumentSeverity, resolveArgument, getEjectionCommentary, maybeDugoutChirp } from '@/lib/umpireArguments';
import { getBattingTeam } from '@/lib/gameEngine';
import { MANAGERS } from '@/lib/gameData';
import { unlockAchievement } from '@/lib/achievements';

/**
 * Check for and resolve umpire arguments after a play.
 * @param {object} state - Current game state
 * @param {object} ctx - { homeTeam, awayTeam, setArgumentResult, setEjectionCount }
 * @returns {object} Updated game state
 */
export function checkArgumentLogic(state, ctx) {
  const { homeTeam, awayTeam, setArgumentResult, setEjectionCount } = ctx;
  if (!state || state.gameOver) return state;

  const severity = state.lastPlay ? getArgumentSeverity(state.lastPlay, state, state._argTopicCounts) : null;

  if (!severity) {
    // No play argument - maybe just a random dugout chirp
    const chirp = maybeDugoutChirp(state);
    if (chirp) {
      const battingSide = getBattingTeam(state);
      const chirpSide = Math.random() < 0.5 ? battingSide : (battingSide === 'home' ? 'away' : 'home');
      const chirpTeamKey = chirpSide === 'home' ? homeTeam : awayTeam;
      // Suspended manager: acting manager in charge - no chirps
      const isChirpTeamSuspended = chirpSide === 'home' ? state._homeManagerSuspended : state._awayManagerSuspended;
      if (!isChirpTeamSuspended) {
        const manager = MANAGERS[chirpTeamKey];
        const chirpScore = state.score[chirpSide];
        const oppScore = state.score[chirpSide === 'home' ? 'away' : 'home'];
        const scoreDiff = oppScore - chirpScore;
        const chirpResult = resolveArgument(chirp, manager?.personality || 5, state.umpire, state.inning, scoreDiff, chirpSide === 'home');
        if (chirpResult) {
          chirpResult.managerName = manager?.name || 'The Manager';
          setArgumentResult({ ...chirpResult, homeTeamKey: chirpTeamKey });
        }
      }
    }
    return state;
  }

  // Determine which team argues based on the play outcome
  const playType = state.lastPlay?.type;
  const playText = state.lastPlay?.text || '';
  const isHBP = playType === 'walk' && (playText.includes('hit by the pitch') || playText.includes('HBP'));
  const FIELDING_ARGUES = isHBP ? [] : ['single', 'double', 'triple', 'homerun', 'walk', 'error', 'ball'];
  const OUT_ARGUES = ['flyout', 'groundout', 'lineout', 'strikeout', 'popout', 'doubleplay', 'sacfly', 'strike', 'foul', 'caughtstealing'];
  const battingSide = getBattingTeam(state);
  const fieldingSide = battingSide === 'home' ? 'away' : 'home';
  let arguingSide;
  if (isHBP) arguingSide = battingSide;
  else if (FIELDING_ARGUES.includes(playType)) arguingSide = fieldingSide;
  else if (OUT_ARGUES.includes(playType)) arguingSide = battingSide;
  else arguingSide = fieldingSide;
  const arguingTeamKey = arguingSide === 'home' ? homeTeam : awayTeam;
  const manager = MANAGERS[arguingTeamKey];

  // Suspended manager: acting manager in charge - no arguments or ejections
  const isManagerSuspended = arguingSide === 'home' ? state._homeManagerSuspended : state._awayManagerSuspended;
  if (isManagerSuspended) return state;

  // Check if this team's manager was already ejected
  const isManagerEjected = arguingSide === 'home' ? state._homeManagerEjected : state._awayManagerEjected;
  if (isManagerEjected && severity.severity === 'chirp') return state;

  const umpireObj = state.umpire || 'standard';
  const arguingScore = state.score[arguingSide];
  const opposingScore = state.score[arguingSide === 'home' ? 'away' : 'home'];
  const scoreDiff = opposingScore - arguingScore;

  const result = resolveArgument(
    severity,
    manager?.personality || 5,
    umpireObj,
    state.inning,
    scoreDiff,
    arguingSide === 'home',
    arguingSide === fieldingSide
  );

  if (!result) return state;

  // Use coach name if manager was ejected
  if (isManagerEjected) {
    result.managerName = manager?.coach || 'The Acting Manager';
    result.isActingManager = true;
    if (result.escaLevel > 2) result.escaLevel = 2;
    result.ejected = false;
  } else {
    result.managerName = manager?.name || 'The Manager';
    result.isActingManager = false;
  }

  // Track topic usage
  if (severity.topicKey) {
    const counts = { ...(state._argTopicCounts || {}) };
    counts[severity.topicKey] = (counts[severity.topicKey] || 0) + 1;
    state = { ...state, _argTopicCounts: counts };
  }

  // Track argument for first_argument achievement
  unlockAchievement('first_argument');

  // If ejected, log it and check achievements
  if (result.ejected && result.whoArgues === 'manager') {
    const cmt = getEjectionCommentary(arguingTeamKey, result);
    const ejectedKey = arguingSide === 'home' ? '_homeManagerEjected' : '_awayManagerEjected';
    state = {
      ...state,
      log: [...state.log, { type: 'ejection', text: `🟥 ${cmt}` }],
      _managerEjected: true,
      _ejectedTeam: arguingSide,
      [ejectedKey]: true,
      // Track ejection info for post-game suspension roll (Season Mode)
      _seasonEjection: {
        teamKey: arguingTeamKey,
        escaLevel: result.escaLevel,
        reason: result.callType || 'argument with umpire',
      },
    };
    setEjectionCount(c => {
      const newCount = c + 1;
      unlockAchievement('youre_gone');
      if (newCount >= 10) unlockAchievement('frequent_flyer');
      if (newCount >= 25) unlockAchievement('billy_martin');
      if (result.dirtKick) unlockAchievement('dirt_kicker');
      if (result.basePickup) unlockAchievement('base_thief');
      if (result.benchEjection) unlockAchievement('bench_tossed');
      return newCount;
    });
  } else {
    // Non-ejection argument - log it
    const cmt = getEjectionCommentary(arguingTeamKey, result);
    state = { ...state, log: [...state.log, { type: 'info', text: `🗣️ ${cmt}` }] };
  }

  // Show the animation - use the arguing team's key for correct commentary
  setArgumentResult({ ...result, homeTeamKey: arguingTeamKey });
  return state;
}