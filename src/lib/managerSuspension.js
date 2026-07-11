// managerSuspension.js - Manager discipline system for Season Mode.
// Ejections are game events; suspensions are Season Mode discipline events.
// Suspensions persist across games until the team plays enough games to clear them.
//
// Exhibition Mode: suspensions never occur. Ejections affect only the current game.
// Season Mode: after a game with an ejection, roll for suspension based on severity.

import { base44 } from '@/api/base44Client';
import { TEAMS, MANAGERS } from './gameData';

// ── In-memory cache ──
let _cache = null;
let _cacheSeasonId = null;

export function clearSuspensionCache() {
  _cache = null;
  _cacheSeasonId = null;
}

// ── Map game escaLevel (0-4) to discipline severity (1-4) ──
// escaLevel 0-1 = normal argument (Level 1)
// escaLevel 2   = heated argument (Level 2)
// escaLevel 3   = contact / extreme conduct (Level 3)
// escaLevel 4   = fight / benches-clearing (Level 4)
export function mapEscaLevelToSeverity(escaLevel) {
  if (escaLevel >= 4) return 4;
  if (escaLevel >= 3) return 3;
  if (escaLevel >= 2) return 2;
  return 1;
}

// ── Roll suspension after a manager ejection ──
// Returns { games, reason } or { games: 0, reason: null } if no suspension.
export function rollManagerSuspension(escaLevel) {
  const severity = mapEscaLevelToSeverity(escaLevel);
  const r = Math.random();

  switch (severity) {
    case 1: // Normal argument
      if (r < 0.85) return { games: 0, reason: null };
      return { games: 1, reason: 'ejection after argument' };

    case 2: // Heated argument
      if (r < 0.50) return { games: 0, reason: null };
      if (r < 0.90) return { games: 1, reason: 'heated argument with umpire' };
      return { games: 2, reason: 'heated argument, prolonged confrontation' };

    case 3: { // Contact / extreme conduct
      if (r < 0.50) return { games: 2, reason: 'making contact with umpire' };
      if (r < 0.85) return { games: 3, reason: 'bumping umpire during argument' };
      const g = 4 + Math.floor(Math.random() * 2); // 4-5
      return { games: g, reason: 'extreme conduct, making contact with umpire' };
    }

    case 4: { // Fight / benches-clearing
      if (r < 0.30) return { games: 0, reason: null };
      if (r < 0.75) return { games: 1, reason: 'benches-clearing incident' };
      if (r < 0.95) return { games: 2, reason: 'escalating benches-clearing altercation' };
      const g = 3 + Math.floor(Math.random() * 3); // 3-5
      return { games: g, reason: 'fight, had to be restrained' };
    }

    default:
      return { games: 0, reason: null };
  }
}

// ── Load all active suspensions for a season (cached) ──
export async function loadActiveSuspensions(seasonId) {
  if (!seasonId) return [];
  if (_cache && _cacheSeasonId === seasonId) return _cache;
  try {
    const suspensions = await base44.entities.ManagerSuspension.filter({ seasonId, active: true });
    _cache = suspensions;
    _cacheSeasonId = seasonId;
    return suspensions;
  } catch (e) {
    console.error('[suspensions] Failed to load active suspensions:', e);
    return [];
  }
}

// ── Synchronous checks (use a loaded suspensions array) ──

export function isManagerSuspended(suspensions, teamKey) {
  return suspensions.some(s => s.teamKey === teamKey && s.active);
}

export function getSuspendedTeamKeys(suspensions) {
  return new Set(suspensions.filter(s => s.active).map(s => s.teamKey));
}

export function getManagerStatusForTeam(suspensions, teamKey) {
  const suspension = suspensions.find(s => s.teamKey === teamKey && s.active);
  if (!suspension) return null;
  const team = TEAMS[teamKey];
  const managerName = suspension.managerName || MANAGERS[teamKey]?.name || 'Manager';
  const actingName = MANAGERS[teamKey]?.coach || 'Bench Coach';
  return {
    suspended: true,
    managerName,
    actingManagerName: actingName,
    gamesRemaining: suspension.gamesRemaining || 0,
    suspensionGames: suspension.suspensionGames || 0,
    reason: suspension.suspensionReason || 'ejection',
  };
}

// ── Record a suspension after an ejection ──
export async function recordSuspension(seasonId, teamKey, managerName, escaLevel, ejectionReason, gameDate, gameDay) {
  if (!seasonId || !teamKey) return null;
  const roll = rollManagerSuspension(escaLevel);
  if (roll.games === 0) return { suspended: false, games: 0 };

  const suspension = {
    seasonId,
    teamKey,
    managerName: managerName || MANAGERS[teamKey]?.name || 'Manager',
    ejectionSeverity: mapEscaLevelToSeverity(escaLevel),
    suspensionGames: roll.games,
    gamesRemaining: roll.games,
    suspensionReason: roll.reason,
    ejectionReason: ejectionReason || 'argument with umpire',
    startedOnDate: gameDate || null,
    startedOnGameDay: gameDay || null,
    active: true,
    gameDate: gameDate || null,
  };

  try {
    await base44.entities.ManagerSuspension.create(suspension);
    clearSuspensionCache();
    return { suspended: true, games: roll.games, reason: roll.reason };
  } catch (e) {
    console.error('[suspensions] Failed to record suspension:', e);
    return null;
  }
}

// ── Decrement suspensions for teams that played today ──
// Called after a day's games are committed. Only teams that played a game
// have their suspension decremented - off days do NOT burn suspensions.
export async function decrementTeamSuspensions(seasonId, teamKeysPlayed, currentDate) {
  if (!seasonId || !teamKeysPlayed || teamKeysPlayed.size === 0) return { resolved: [], updated: 0 };

  try {
    const suspensions = await base44.entities.ManagerSuspension.filter({ seasonId, active: true });
    const resolved = [];
    let updatedCount = 0;

    for (const suspension of suspensions) {
      if (!teamKeysPlayed.has(suspension.teamKey)) continue;

      const newRemaining = (suspension.gamesRemaining || 0) - 1;
      if (newRemaining <= 0) {
        await base44.entities.ManagerSuspension.update(suspension.id, {
          active: false,
          gamesRemaining: 0,
          resolvedOnDate: currentDate,
        });
        resolved.push({
          teamKey: suspension.teamKey,
          managerName: suspension.managerName,
        });
      } else {
        await base44.entities.ManagerSuspension.update(suspension.id, { gamesRemaining: newRemaining });
        updatedCount++;
      }
    }

    clearSuspensionCache();
    return { resolved, updated: updatedCount };
  } catch (e) {
    console.error('[suspensions] Decrement failed:', e);
    return { resolved: [], updated: 0 };
  }
}

// ── Newspaper headline generators ──
export function generateSuspensionHeadline(teamKey, managerName, games, reason) {
  const city = TEAMS[teamKey]?.city || teamKey;
  const team = TEAMS[teamKey]?.name || '';
  const skipper = managerName || MANAGERS[teamKey]?.name || 'Manager';

  if (games === 1) {
    return `${city} ${team} manager ${skipper} suspended one game after ${reason}.`;
  }
  return `${city} ${team} skipper ${skipper} gets ${games} games after ${reason}.`;
}

export function generateReturnHeadline(teamKey, managerName) {
  const city = TEAMS[teamKey]?.city || teamKey;
  const team = TEAMS[teamKey]?.name || '';
  const skipper = managerName || MANAGERS[teamKey]?.name || 'Manager';
  return `${skipper} returns to the ${city} ${team} dugout.`;
}

export function generateNoSuspensionHeadline(teamKey, managerName) {
  const city = TEAMS[teamKey]?.city || teamKey;
  const team = TEAMS[teamKey]?.name || '';
  const skipper = managerName || MANAGERS[teamKey]?.name || 'Manager';
  return `${city} ${team} manager ${skipper} ejected, avoids suspension.`;
}