// playerDiscipline.js - Player ejection and suspension system for Season Mode.
// Mirrors the managerSuspension.js pattern but for players.
//
// Ejections are in-game events; suspensions are Season Mode discipline events.
// Suspensions persist across games until the team plays enough games to clear them.
//
// Exhibition Mode: player ejections affect only the current game. No suspension.
// Season Mode: after a game with a player ejection, roll for suspension.

import { base44 } from '@/api/base44Client';
import { TEAMS } from './gameData';
import { recordSuspensionTxn, recordReturnFromSuspensionTxn } from './transactionLog';

// ── In-memory cache ──
let _cache = null;
let _cacheSeasonId = null;

export function clearPlayerDisciplineCache() {
  _cache = null;
  _cacheSeasonId = null;
}

// ── Suspension odds tables per ejection reason ──
// Returns { games, reason } or { games: 0, reason: null } if no suspension.
export function rollPlayerSuspension(ejectionReason, context = {}) {
  const r = Math.random();
  const hbpIntent = context.hbpIntent || null;

  switch (ejectionReason) {
    case 'hbp_after_warning':
      if (r < 0.20) return { games: 0, reason: null };
      if (r < 0.75) return { games: 1, reason: 'hitting batter after warning' };
      if (r < 0.95) return { games: 2, reason: 'HBP after warning' };
      return { games: 3, reason: 'repeated HBP after warning' };

    case 'obvious_retaliation':
      if (r < 0.05) return { games: 0, reason: null };
      if (r < 0.50) return { games: 2, reason: 'obvious retaliation pitch' };
      if (r < 0.85) return { games: 3, reason: 'intentional retaliation HBP' };
      return { games: 4 + Math.floor(Math.random() * 2), reason: 'dangerous retaliation pitch' }; // 4-5

    case 'arguing_strikes':
      if (r < 0.80) return { games: 0, reason: null };
      return { games: 1, reason: 'arguing balls and strikes' };

    case 'arguing_call':
      if (r < 0.90) return { games: 0, reason: null };
      return { games: 1, reason: 'arguing a call' };

    case 'charging_mound': {
      // Context-aware: charging after an accidental HBP is punished harder
      // (the batter escalated without provocation) than after an intentional one.
      if (hbpIntent === 'accidental') {
        if (r < 0.45) return { games: 2, reason: 'charged mound after unintentional HBP' };
        if (r < 0.85) return { games: 3, reason: 'charged mound after unintentional HBP' };
        return { games: 4 + Math.floor(Math.random() * 2), reason: 'charged mound after unintentional HBP' }; // 4-5
      }
      // Intentional/retaliation HBP — 10% escape, slightly lighter top end
      if (r < 0.10) return { games: 0, reason: null };
      if (r < 0.50) return { games: 2, reason: 'charged mound after intentional HBP' };
      if (r < 0.85) return { games: 3, reason: 'charged mound after intentional HBP' };
      return { games: 4 + Math.floor(Math.random() * 3), reason: 'charged mound, fight after intentional HBP' }; // 4-6
    }

    case 'fight_participant': {
      if (r < 0.25) return { games: 0, reason: null };
      if (r < 0.70) return { games: 1, reason: 'fight participant' };
      if (r < 0.90) return { games: 2, reason: 'fight participant' };
      return { games: 3, reason: 'active fight participant' };
    }

    case 'bench_clearing_major': {
      if (r < 0.35) return { games: 2, reason: 'bench-clearing brawl' };
      if (r < 0.75) return { games: 3, reason: 'bench-clearing brawl' };
      return { games: 4 + Math.floor(Math.random() * 4), reason: 'major brawl instigator' }; // 4-7
    }

    default:
      return { games: 0, reason: null };
  }
}

// ── Load all active player suspensions for a season (cached) ──
export async function loadActivePlayerSuspensions(seasonId) {
  if (!seasonId) return [];
  if (_cache && _cacheSeasonId === seasonId) return _cache;
  try {
    const suspensions = await base44.entities.PlayerDiscipline.filter({ seasonId, active: true });
    _cache = suspensions;
    _cacheSeasonId = seasonId;
    return suspensions;
  } catch (e) {
    console.error('[playerDiscipline] Failed to load active suspensions:', e);
    return [];
  }
}

// ── Synchronous checks (use a loaded suspensions array) ──

export function getSuspendedPlayerNames(suspensions, teamKey) {
  return suspensions
    .filter(s => s.teamKey === teamKey && s.active)
    .map(s => s.playerName);
}

export function isPlayerSuspended(suspensions, teamKey, playerName) {
  return suspensions.some(s => s.teamKey === teamKey && s.active && s.playerName === playerName);
}

// ── Record a suspension after a player ejection ──
export async function recordPlayerSuspension(seasonId, teamKey, playerName, playerPos, ejectionReason, gameDate, gameDay, inning, hbpIntent) {
  if (!seasonId || !teamKey || !playerName) return null;
  const roll = rollPlayerSuspension(ejectionReason, { hbpIntent });
  if (roll.games === 0) return { suspended: false, games: 0 };

  const record = {
    seasonId,
    teamKey,
    playerName,
    playerPos: playerPos || '?',
    ejectionReason,
    ejectionInning: inning || 0,
    suspensionGames: roll.games,
    gamesRemaining: roll.games,
    suspensionReason: roll.reason,
    startedOnDate: gameDate || null,
    startedOnGameDay: gameDay || null,
    active: true,
    gameDate: gameDate || null,
  };

  try {
    await base44.entities.PlayerDiscipline.create(record);
    clearPlayerDisciplineCache();
    await recordSuspensionTxn(seasonId, record);
    return { suspended: true, games: roll.games, reason: roll.reason };
  } catch (e) {
    console.error('[playerDiscipline] Failed to record suspension:', e);
    return null;
  }
}

// ── Decrement suspensions for teams that played today ──
// Called after a day's games are committed. Only teams that played a game
// have their suspension decremented - off days do NOT burn suspensions.
export async function decrementPlayerSuspensions(seasonId, teamKeysPlayed, currentDate) {
  if (!seasonId || !teamKeysPlayed || teamKeysPlayed.size === 0) return { resolved: [], updated: 0 };

  try {
    const suspensions = await base44.entities.PlayerDiscipline.filter({ seasonId, active: true });
    const resolved = [];
    let updatedCount = 0;

    for (const suspension of suspensions) {
      if (!teamKeysPlayed.has(suspension.teamKey)) continue;

      const newRemaining = (suspension.gamesRemaining || 0) - 1;
      if (newRemaining <= 0) {
        await base44.entities.PlayerDiscipline.update(suspension.id, {
          active: false,
          gamesRemaining: 0,
          resolvedOnDate: currentDate,
        });
        await recordReturnFromSuspensionTxn(seasonId, suspension, currentDate);
        resolved.push({
          teamKey: suspension.teamKey,
          playerName: suspension.playerName,
        });
      } else {
        await base44.entities.PlayerDiscipline.update(suspension.id, { gamesRemaining: newRemaining });
        updatedCount++;
      }
    }

    clearPlayerDisciplineCache();
    return { resolved, updated: updatedCount };
  } catch (e) {
    console.error('[playerDiscipline] Decrement failed:', e);
    return { resolved: [], updated: 0 };
  }
}

// ── Build suspended-player set for lineup/bullpen filtering ──
// Returns a Set of player names that are currently suspended for the given teams.
export function buildSuspendedPlayerSet(suspensions, teamKeys) {
  const keySet = teamKeys instanceof Set ? teamKeys : new Set(teamKeys);
  return new Set(
    suspensions
      .filter(s => s.active && keySet.has(s.teamKey))
      .map(s => s.playerName)
  );
}

// ── Newspaper headline generators ──
export function generatePlayerSuspensionHeadline(teamKey, playerName, games, reason) {
  const city = TEAMS[teamKey]?.city || teamKey;
  const team = TEAMS[teamKey]?.name || '';
  const lastName = playerName.split(' ').pop();

  if (games === 1) {
    return `${city} ${team} ${lastName} suspended one game after ${reason}.`;
  }
  return `${city} ${team} ${lastName} gets ${games} games after ${reason}.`;
}

export function generatePlayerReturnHeadline(teamKey, playerName) {
  const city = TEAMS[teamKey]?.city || teamKey;
  const team = TEAMS[teamKey]?.name || '';
  const lastName = playerName.split(' ').pop();
  return `${lastName} returns to the ${city} ${team} lineup.`;
}