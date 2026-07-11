// injuryPersistence.js - Core persistent injury system for Season Mode.
// Injuries are stored as Injury entity records, NOT inside the game state.
// This module is the single source of truth for injury availability across
// lineups, benches, rotations, bullpens, and daily recovery.
//
// Exhibition Mode: injuries are game-only (no persistence). This module is
// never called in Exhibition Mode.
// Season Mode: injuries persist in the Injury entity until recovery date.

import { base44 } from '@/api/base44Client';
import { TEAMS } from './gameData';
import { rollInjurySeverity, getInjuryTypeName, calculateInjuryDuration } from './injuryConfig';

// ── In-memory cache of active injuries per season ──
// Avoids re-fetching the Injury entity on every game within the same day.
let _cache = null;
let _cacheSeasonId = null;

export function clearInjuryCache() {
  _cache = null;
  _cacheSeasonId = null;
}

// Load all active injuries for a season (cached per seasonId).
export async function loadActiveInjuries(seasonId) {
  if (!seasonId) return [];
  if (_cache && _cacheSeasonId === seasonId) return _cache;
  try {
    const injuries = await base44.entities.Injury.filter({ seasonId, active: true });
    _cache = injuries;
    _cacheSeasonId = seasonId;
    return injuries;
  } catch (e) {
    console.error('[injuries] Failed to load active injuries:', e);
    return [];
  }
}

// ── Synchronous availability checks (use a loaded injuries array) ──

export function isPlayerInjured(injuries, playerName) {
  return injuries.some(i => i.playerName === playerName && i.active);
}

export function getPlayerInjury(injuries, playerName) {
  return injuries.find(i => i.playerName === playerName && i.active) || null;
}

// Get all injured player names for a specific team.
export function getInjuredPlayerNames(injuries, teamKey) {
  return injuries
    .filter(i => i.teamKey === teamKey && i.active)
    .map(i => i.playerName);
}

// Get injured pitcher names for a team (SP, RP, CL).
export function getInjuredPitcherNames(injuries, teamKey) {
  return injuries
    .filter(i => i.teamKey === teamKey && i.active && ['SP', 'RP', 'CL'].includes(i.playerPos))
    .map(i => i.playerName);
}

// ── Record a new injury (creates an Injury entity record) ──
// Only non-minor severities are persisted. Minor injuries clear after the game.
export async function recordInjury(seasonId, teamKey, playerName, playerPos, source, gameDate, gameDay) {
  if (!seasonId || !teamKey || !playerName) return null;

  const severity = rollInjurySeverity();
  const injuryType = getInjuryTypeName(source);
  const duration = calculateInjuryDuration(severity, gameDate);

  // Minor injuries don't persist - they clear after the current game.
  if (severity === 'minor') {
    return { severity: 'minor', injuryType, persisted: false };
  }

  const injury = {
    seasonId,
    teamKey,
    playerName,
    playerPos: playerPos || '?',
    injuryType,
    severity,
    source: source || 'in_game',
    startedOnDate: gameDate || null,
    startedOnGameDay: gameDay || null,
    eligibleReturnDate: duration.eligibleReturnDate,
    gamesRemaining: duration.gamesRemaining,
    daysRemaining: duration.daysRemaining,
    active: true,
    canPlayThrough: false,
    gameDate: gameDate || null,
  };

  try {
    await base44.entities.Injury.create(injury);
    clearInjuryCache();
    return { ...injury, persisted: true };
  } catch (e) {
    console.error('[injuries] Failed to record injury:', e);
    return null;
  }
}

// ── Build a patched roster for a team based on active injuries ──
// Returns { lineup, bench, rotation, bullpen, scratchedPlayers } where:
// - lineup: starting lineup with injured starters replaced by bench players
// - bench: bench with injured bench players AND promoted replacements removed
// - rotation: rotation with injured starters removed
// - bullpen: bullpen with injured relievers removed
// - scratchedPlayers: array of all injured player names (for state.scratchedPlayers)
export function buildInjuredRoster(teamKey, injuries) {
  const team = TEAMS[teamKey];
  if (!team) return { lineup: [], bench: [], rotation: [], bullpen: [], scratchedPlayers: [] };

  const teamInjuries = injuries.filter(i => i.teamKey === teamKey && i.active);
  const injuredNames = new Set(teamInjuries.map(i => i.playerName));

  if (injuredNames.size === 0) {
    return {
      lineup: [...(team.lineup || [])],
      bench: [...(team.bench || [])],
      rotation: [...(team.rotation || [])],
      bullpen: [...(team.bullpen || [])],
      scratchedPlayers: [],
    };
  }

  // Filter bench, rotation, bullpen - remove injured players
  const availableBench = (team.bench || []).filter(p => !injuredNames.has(p.name));
  const availableRotation = (team.rotation || []).filter(p => !injuredNames.has(p.name));
  const availableBullpen = (team.bullpen || []).filter(p => !injuredNames.has(p.name));

  // Build patched lineup: replace injured starters with available bench players
  const patchedLineup = [];
  const usedReplacementNames = new Set();
  for (const p of (team.lineup || [])) {
    if (injuredNames.has(p.name)) {
      // Find a bench player who isn't injured and hasn't been used as a replacement
      const replacement = availableBench.find(b =>
        !usedReplacementNames.has(b.name) && !patchedLineup.find(lp => lp.name === b.name)
      );
      if (replacement) {
        patchedLineup.push({ ...replacement, assignedPos: p.pos });
        usedReplacementNames.add(replacement.name);
      } else {
        // No replacement available - keep the injured player (emergency)
        patchedLineup.push(p);
      }
    } else {
      patchedLineup.push(p);
    }
  }

  // Remove used replacements from the available bench
  const finalBench = availableBench.filter(p => !usedReplacementNames.has(p.name));

  return {
    lineup: patchedLineup,
    bench: finalBench,
    rotation: availableRotation,
    bullpen: availableBullpen,
    scratchedPlayers: [...injuredNames],
  };
}

// ── Daily recovery: decrement daysRemaining, clear eligible returns ──
// Called after all games for a calendar day are completed.
export async function runDailyRecovery(seasonId, currentDate) {
  if (!seasonId) return { recovered: [], updated: 0 };

  try {
    const injuries = await base44.entities.Injury.filter({ seasonId, active: true });
    const recovered = [];
    let updatedCount = 0;

    for (const injury of injuries) {
      const newDaysRemaining = Math.max(0, (injury.daysRemaining || 0) - 1);

      // Primary check: eligibleReturnDate has passed (the last unavailable day).
      // The player becomes available for the NEXT game after this date's games.
      const eligibleToReturn = !injury.eligibleReturnDate || currentDate >= injury.eligibleReturnDate;

      if (eligibleToReturn) {
        await base44.entities.Injury.update(injury.id, {
          active: false,
          daysRemaining: 0,
          recoveredOnDate: currentDate,
        });
        recovered.push({
          playerName: injury.playerName,
          teamKey: injury.teamKey,
          injuryType: injury.injuryType,
        });
      } else {
        await base44.entities.Injury.update(injury.id, { daysRemaining: newDaysRemaining });
        updatedCount++;
      }
    }

    clearInjuryCache();
    return { recovered, updated: updatedCount };
  } catch (e) {
    console.error('[injuries] Daily recovery failed:', e);
    return { recovered: [], updated: 0 };
  }
}

// ── Pick a starting pitcher, skipping injured starters ──
// Wraps the existing getProbableStarter but falls through to the next
// available rotation member if the resolved starter is injured.
export function resolveStarterSkippingInjuries(baseStarter, teamKey, injuries) {
  if (!baseStarter) return baseStarter;
  const injuredNames = new Set(getInjuredPitcherNames(injuries, teamKey));
  if (!injuredNames.has(baseStarter.name)) return baseStarter;

  // Starter is injured - find the next available rotation member
  const rotation = TEAMS[teamKey]?.rotation || [];
  const next = rotation.find(p => !injuredNames.has(p.name));
  if (next) {
    console.warn(`[injuries] ${baseStarter.name} injured - replacing with ${next.name}`);
    return next;
  }
  // No rotation member available - try bullpen
  const bullpen = TEAMS[teamKey]?.bullpen || [];
  const bpNext = bullpen.find(p => !injuredNames.has(p.name));
  if (bpNext) return bpNext;

  // Absolute fallback - keep the injured starter (emergency)
  console.error(`[injuries] No available pitcher for ${teamKey} - using injured ${baseStarter.name}`);
  return baseStarter;
}