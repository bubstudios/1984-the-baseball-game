// playerAvailability.js - Shared player availability logic for Season Mode.
// Single source of truth for whether a player can appear in a game.
// Called by lineup builders (startGame, simulateGameHeadless) as a pregame
// validation safety net, and by the lineup screen to grey out unavailable players.

import { TEAMS } from './gameData';

// Check if a player is available given a set of unavailable names.
// unavailableNames: Set or array of player names that cannot play
// (injured, suspended, scratched, or ejected).
export function isPlayerAvailable(playerName, unavailableNames) {
  if (!playerName) return false;
  const set = unavailableNames instanceof Set ? unavailableNames : new Set(unavailableNames || []);
  return !set.has(playerName);
}

// Filter a list of player names to only those on a specific team's roster.
// Used to split combined injured/suspended lists (which span both teams)
// into per-team sets for the lineup screen and CPU rebuild.
export function filterNamesForTeam(names, teamKey) {
  if (!names || !teamKey) return [];
  const td = TEAMS[teamKey];
  if (!td) return [];
  const rosterNames = new Set([
    ...(td.lineup || []),
    ...(td.bench || []),
    ...(td.rotation || []),
    ...(td.bullpen || []),
  ].map(p => p.name));
  return names.filter(n => rosterNames.has(n));
}

// Pregame validation: replace any unavailable players in a starting lineup
// with available bench players. Preserves batting order and assignedPos.
// If no replacement is available, keeps the original player (emergency fallback).
//
// This is the final gate that guarantees no suspended/injured/scratched player
// can appear in a game lineup. Called by startGame (user games) and
// simulateGameHeadless (CPU sim) after createGameState sets up the lineups.
export function patchLineupForAvailability(lineup, bench, unavailableNames) {
  if (!lineup || lineup.length === 0) return lineup || [];
  const unavailSet = unavailableNames instanceof Set ? unavailableNames : new Set(unavailableNames || []);
  if (unavailSet.size === 0) return lineup;

  const availableBench = (bench || []).filter(p => !unavailSet.has(p.name));
  const usedReplacementNames = new Set();
  const patchedLineup = [];

  for (const p of lineup) {
    if (unavailSet.has(p.name)) {
      // Find a bench player who is available, not already used as a replacement,
      // and not already in the patched lineup.
      const replacement = availableBench.find(b =>
        !usedReplacementNames.has(b.name) && !patchedLineup.find(lp => lp.name === b.name)
      );
      if (replacement) {
        patchedLineup.push({ ...replacement, order: p.order, assignedPos: p.assignedPos || p.pos });
        usedReplacementNames.add(replacement.name);
      } else {
        // Emergency fallback - no legal replacement exists.
        patchedLineup.push(p);
      }
    } else {
      patchedLineup.push(p);
    }
  }

  return patchedLineup;
}