// ═══════════════════════════════════════════════════════════════
// SEASON SAVE MIGRATION / SAFE DEFAULTS
// Ensures old season saves have all required fields so new features
// don't crash on undefined objects/arrays.
// ═══════════════════════════════════════════════════════════════

import { base44 } from '@/api/base44Client';

const SAFE_DEFAULTS = {
  currentGameDay: 1,
  currentDate: '1984-04-02',
  completedGames: 0,
  totalGames: 2106,
  seasonPhase: 'REGULAR_SEASON',
  monthlyHonorsShown: {},
  allStarRosters: null,
  allStarBreakPhase: null,
  worldSeriesHomeFieldLeague: null,
  allStarMvp: null,
  allStarGameResult: null,
  tradeDeadlinePhase: null,
  tradeDeadlineTrades: null,
  postseason: null,
  postseasonAwards: null,
  seasonAwards: null,
  champion: null,
  rotationState: null,
  clinchStatus: null,
};

/**
 * Migrate a season object to ensure all fields exist with safe defaults.
 * Returns a new object — does not mutate the original.
 * Also persists the migration to the database if changes were made.
 */
export function migrateSeason(season) {
  if (!season) return season;

  let changed = false;
  const migrated = { ...season };

  for (const [key, defaultValue] of Object.entries(SAFE_DEFAULTS)) {
    if (migrated[key] === undefined || migrated[key] === null) {
      if (defaultValue !== null) {
        migrated[key] = defaultValue;
        changed = true;
      }
    }
  }

  return { season: migrated, changed };
}

/**
 * Migrate season and persist if needed.
 */
export async function migrateAndPersistSeason(season) {
  const { season: migrated, changed } = migrateSeason(season);
  if (changed && migrated.id) {
    try {
      // Only persist the newly-added fields to avoid overwriting concurrent changes
      const updates = {};
      for (const key of Object.keys(SAFE_DEFAULTS)) {
        if (season[key] === undefined && migrated[key] !== undefined) {
          updates[key] = migrated[key];
        }
      }
      if (Object.keys(updates).length > 0) {
        await base44.entities.Season.update(migrated.id, updates);
      }
    } catch (e) {
      console.error('[seasonMigration] Failed to persist:', e);
    }
  }
  return migrated;
}

/**
 * Ensure a season object is safe for in-memory use (no DB write).
 * Use this when you just need to read fields without crashing.
 */
export function ensureSafeSeason(season) {
  return migrateSeason(season).season;
}