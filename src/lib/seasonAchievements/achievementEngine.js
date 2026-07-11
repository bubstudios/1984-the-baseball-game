// ═══════════════════════════════════════════════════════════════
// SEASON ACHIEVEMENT ENGINE
// Handles: context building, evaluation, persistence, popup queue
// ═══════════════════════════════════════════════════════════════

import { base44 } from '@/api/base44Client';
import { ACHIEVEMENTS } from './achievementCatalog';

// ── In-memory cache of unlocked achievement IDs (dedup) ──
let unlockedCache = null;
let cacheLoading = null;

// ── Popup queue (module-level, survives navigation) ──
let popupQueue = [];
const subscribers = new Set();

// ── Cache Management ──

export async function initAchievementCache() {
  if (unlockedCache) return unlockedCache;
  if (cacheLoading) return cacheLoading;
  cacheLoading = (async () => {
    try {
      const records = await base44.entities.SeasonAchievement.list(null, 5000);
      unlockedCache = new Set(records.map(r => r.achievementId));
    } catch (e) {
      console.error('[achievements] Cache init failed:', e);
      unlockedCache = new Set();
    }
    return unlockedCache;
  })();
  return cacheLoading;
}

export function clearAchievementCache() {
  unlockedCache = null;
  cacheLoading = null;
}

// ── Popup Queue ──

export function subscribeToPopupQueue(cb) {
  subscribers.add(cb);
  cb([...popupQueue]);
  return () => subscribers.delete(cb);
}

export function shiftPopupQueue() {
  popupQueue = popupQueue.slice(1);
  for (const cb of subscribers) cb([...popupQueue]);
}

function _enqueuePopup(achievement, context) {
  const item = {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    rarity: achievement.rarity || 'Common',
    category: achievement.category,
    teamKey: context?.userTeam || null,
    playerName: context?.playerName || null,
  };
  popupQueue = [...popupQueue, item];
  for (const cb of subscribers) cb([...popupQueue]);
}

// ── Unlock ──

export async function unlockAchievement(seasonId, achievement, context, options = {}) {
  if (!unlockedCache) await initAchievementCache();
  if (unlockedCache.has(achievement.id)) return false;

  try {
    await base44.entities.SeasonAchievement.create({
      seasonId: seasonId || 'unknown',
      achievementId: achievement.id,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      rarity: achievement.rarity || 'Common',
      unlockedAtDate: new Date().toISOString().split('T')[0],
      teamKey: context?.userTeam || null,
      playerName: context?.playerName || null,
      gameId: context?.gameId || null,
    });
    unlockedCache.add(achievement.id);
    if (!options.silent) {
      _enqueuePopup(achievement, context);
    }
    return true;
  } catch (e) {
    console.error('[achievements] Failed to save unlock:', achievement.id, e);
    return false;
  }
}

// ── Game Context Builder ──

export function buildGameContext(gameResult, finalState, userTeam, isUserGame, season) {
  if (!gameResult) return null;

  const userIsHome = gameResult.homeTeam === userTeam;
  const userScore = userIsHome ? gameResult.homeScore : gameResult.awayScore;
  const oppScore = userIsHome ? gameResult.awayScore : gameResult.homeScore;
  const userWon = gameResult.winner === userTeam;

  // Inning count from line score or box score innings
  const inningsArr = gameResult.innings || gameResult.boxScore?.innings || [];
  const innings = inningsArr.length || 9;

  // Walk-off detection (home team wins, scoring in bottom of final inning to take lead)
  let walkOff = false;
  if (userIsHome && userWon && innings >= 9) {
    const lastInn = inningsArr[inningsArr.length - 1];
    let homeBefore = 0;
    for (let i = 0; i < inningsArr.length - 1; i++) homeBefore += inningsArr[i].home || 0;
    const awayTotal = inningsArr.reduce((s, inn) => s + (inn.away || 0), 0);
    walkOff = (lastInn?.home || 0) > 0 && homeBefore <= awayTotal;
  }

  // Box score data (handles both raw result and DB GameResult formats)
  const bs = gameResult.boxScore || {};
  const batting = bs.batting || gameResult.batting || [];
  const pitching = bs.pitching || gameResult.pitching || [];
  const homeRuns = bs.homeRuns || gameResult.homeRuns || [];
  const decisions = bs.decisions || gameResult.decisions || {};
  const homeErrors = bs.homeErrors ?? gameResult.homeErrors ?? 0;
  const awayErrors = bs.awayErrors ?? gameResult.awayErrors ?? 0;

  const userBatting = batting.filter(b => b.teamKey === userTeam);
  const oppBatting = batting.filter(b => b.teamKey !== userTeam);
  const userPitching = pitching.filter(p => p.teamKey === userTeam);
  const oppPitching = pitching.filter(p => p.teamKey !== userTeam);
  const userHRs = homeRuns.filter(hr => hr.teamKey === userTeam);
  const oppHRs = homeRuns.filter(hr => hr.teamKey !== userTeam);

  const userErrors = userIsHome ? homeErrors : awayErrors;
  const oppErrors = userIsHome ? awayErrors : homeErrors;

  // Tracking data from finalState (in-game events)
  const tracking = finalState?._tracking || {};
  const injuries = tracking.injuriesOccurred || [];
  const ejections = tracking.ejections || tracking.playerEjections || [];
  const benchCleared = tracking.benchCleared || false;
  const warningsIssued = tracking.warningsIssued || false;

  return {
    phase: 'game',
    season, userTeam, isUserGame,
    gameResult, finalState,
    userIsHome, userScore, oppScore, userWon,
    totalRuns: (userScore || 0) + (oppScore || 0),
    margin: Math.abs((userScore || 0) - (oppScore || 0)),
    innings, extraInnings: innings > 9, walkOff,
    userBatting, oppBatting, userPitching, oppPitching,
    homeRuns, userHRs, oppHRs,
    userErrors, oppErrors,
    injuries, ejections, benchCleared, warningsIssued,
    decisions,
    gameDate: gameResult.gameDate,
    gameDay: gameResult.gameDay,
    extraData: {},
  };
}

// ── Evaluate Game Complete ──

export async function evaluateGameComplete(seasonId, userTeam, gameResult, finalState, isUserGame, season, options = {}) {
  if (!gameResult) return [];
  await initAchievementCache();

  const ctx = buildGameContext(gameResult, finalState, userTeam, isUserGame, season);
  if (!ctx) return [];

  // Merge any extra tracking data from options
  if (options.extraData) ctx.extraData = { ...ctx.extraData, ...options.extraData };

  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (ach.phase !== 'game') continue;
    try {
      if (ach.trigger(ctx)) {
        const unlocked = await unlockAchievement(seasonId, ach, ctx, options);
        if (unlocked) newlyUnlocked.push(ach);
      }
    } catch (e) { /* skip — never break game flow */ }
  }

  return newlyUnlocked;
}

// ── Evaluate Season Event ──

export async function evaluateSeasonEvent(seasonId, userTeam, season, phase, extraData = {}) {
  await initAchievementCache();

  const ctx = {
    phase,
    season, userTeam,
    standings: extraData.standings || null,
    allStarRosters: extraData.allStarRosters || season?.allStarRosters || null,
    trades: extraData.trades || season?.tradeDeadlineTrades || null,
    awards: extraData.awards || season?.seasonAwards || null,
    postseason: extraData.postseason || season?.postseason || null,
    extraData,
  };

  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS) {
    if (ach.phase !== 'season') continue;
    try {
      if (ach.trigger(ctx)) {
        const unlocked = await unlockAchievement(seasonId, ach, ctx, { silent: extraData.silent });
        if (unlocked) newlyUnlocked.push(ach);
      }
    } catch (e) { /* skip */ }
  }

  return newlyUnlocked;
}

// ── Gallery Data ──

export async function getUnlockedAchievements() {
  try {
    return await base44.entities.SeasonAchievement.list('-unlockedAtDate', 5000);
  } catch (e) {
    return [];
  }
}

export async function getUnlockedMap() {
  const records = await getUnlockedAchievements();
  const map = {};
  for (const r of records) {
    if (!map[r.achievementId]) {
      map[r.achievementId] = r;
    }
  }
  return map;
}