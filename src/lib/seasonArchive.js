// ═══════════════════════════════════════════════════════════════
// SEASON ARCHIVE
// Generates and stores a historical summary when a season completes.
// ═══════════════════════════════════════════════════════════════

import { base44 } from '@/api/base44Client';
import { TEAMS } from './gameData';
import { getDivision } from './seasonSchedule';
import { deriveStandings } from './seasonStore';

/**
 * Generate a full season archive from completed season data.
 */
export async function generateSeasonArchive(season) {
  if (!season) return null;

  try {
    const allResults = await base44.entities.GameResult.filter(
      { seasonId: season.id }, 'gameDay', 2200
    );
    const standings = deriveStandings(allResults);
    const allStats = await base44.entities.PlayerStats.filter(
      { seasonId: season.id }, null, 1500
    );

    // User record
    const userDiv = getDivision(season.userTeam);
    const divStandings = standings[userDiv] || [];
    const userStanding = divStandings.find(t => t.teamKey === season.userTeam) || {};
    const userPlace = divStandings.indexOf(userStanding) + 1;
    const userWins = userStanding.w || 0;
    const userLosses = userStanding.l || 0;
    const userPct = userWins + userLosses > 0 ? userWins / (userWins + userLosses) : 0;

    // Team MVP — highest OPS among hitters with enough PA
    const userBatters = allStats.filter(s => s.team === season.userTeam && (s.atBats || 0) >= 200);
    userBatters.sort((a, b) => (b.ops || 0) - (a.ops || 0));
    const teamMVP = userBatters[0] ? {
      name: userBatters[0].playerName,
      stats: {
        avg: userBatters[0].battingAverage,
        hr: userBatters[0].homeRuns,
        rbi: userBatters[0].rbi,
        ops: userBatters[0].ops,
      },
    } : null;

    // Best game — highest scoring user win or walk-off
    const userResults = allResults.filter(
      r => r.homeTeam === season.userTeam || r.awayTeam === season.userTeam
    );
    let bestGame = null;
    let worstLoss = null;
    let longestWinStreak = 0;
    let longestLossStreak = 0;
    let currentWinStreak = 0;
    let currentLossStreak = 0;

    const sortedResults = [...userResults].sort((a, b) => a.gameDay - b.gameDay);
    for (const r of sortedResults) {
      const won = r.winner === season.userTeam;
      const isHome = r.homeTeam === season.userTeam;
      const opp = isHome ? r.awayTeam : r.homeTeam;
      const userScore = isHome ? r.homeScore : r.awayScore;
      const oppScore = isHome ? r.awayScore : r.homeScore;
      const margin = userScore - oppScore;

      if (won) {
        currentWinStreak++;
        currentLossStreak = 0;
        if (currentWinStreak > longestWinStreak) longestWinStreak = currentWinStreak;

        // Track best game — prefer walk-offs or big comebacks, then big margins
        const score = `${userScore}-${oppScore}`;
        if (!bestGame || margin > (bestGame.margin || -999)) {
          bestGame = {
            date: r.gameDate,
            opponent: opp,
            score,
            summary: `Won ${margin > 0 ? `by ${margin}` : 'in extras'}`,
            margin,
          };
        }
      } else {
        currentLossStreak++;
        currentWinStreak = 0;
        if (currentLossStreak > longestLossStreak) longestLossStreak = currentLossStreak;

        const score = `${userScore}-${oppScore}`;
        if (!worstLoss || margin < (worstLoss.margin || 999)) {
          worstLoss = {
            date: r.gameDate,
            opponent: opp,
            score,
            summary: `Lost by ${Math.abs(margin)}`,
            margin,
          };
        }
      }
    }

    // League leaders
    const leagueLeaders = extractLeagueLeaders(allStats);

    // Achievements count
    let achievementsCount = 0;
    try {
      const achievements = await base44.entities.SeasonAchievement.filter(
        { seasonId: season.id }, null, 5000
      );
      achievementsCount = achievements.length;
    } catch (e) { /* non-fatal */ }

    const archive = {
      seasonId: season.id,
      year: season.year || 1984,
      userTeam: season.userTeam,
      champion: season.champion || null,
      finalStandings: standings,
      postseasonBracket: season.postseason || null,
      seasonAwards: season.seasonAwards || [],
      leagueLeaders,
      userRecord: {
        wins: userWins,
        losses: userLosses,
        pct: userPct,
        place: userPlace,
        division: userDiv,
      },
      teamMVP,
      bestGame,
      worstLoss,
      longestWinStreak,
      longestLossStreak,
      achievementsUnlocked: achievementsCount,
      archivedDate: new Date().toISOString().split('T')[0],
    };

    return archive;
  } catch (e) {
    console.error('[seasonArchive] Failed to generate:', e);
    return null;
  }
}

/**
 * Save an archive to the database. Idempotent — replaces existing.
 */
export async function saveSeasonArchive(archive) {
  if (!archive) return null;
  try {
    // Check for existing archive
    const existing = await base44.entities.SeasonArchive.filter(
      { seasonId: archive.seasonId }, null, 1
    );
    if (existing.length > 0) {
      return await base44.entities.SeasonArchive.update(existing[0].id, archive);
    }
    return await base44.entities.SeasonArchive.create(archive);
  } catch (e) {
    console.error('[seasonArchive] Failed to save:', e);
    return null;
  }
}

/**
 * Load an existing archive by seasonId.
 */
export async function loadSeasonArchive(seasonId) {
  try {
    const results = await base44.entities.SeasonArchive.filter(
      { seasonId }, null, 1
    );
    return results.length > 0 ? results[0] : null;
  } catch (e) {
    return null;
  }
}

// ── League leader extraction ──

function extractLeagueLeaders(allStats) {
  const hitters = allStats.filter(s => (s.atBats || 0) >= 400);
  const pitchers = allStats.filter(s => (s.inningsPitched || 0) >= 100);

  const topBy = (arr, field, n = 5) =>
    [...arr].sort((a, b) => (b[field] || 0) - (a[field] || 0)).slice(0, n)
      .map(s => ({ name: s.playerName, team: s.team, value: s[field] || 0 }));

  return {
    battingAverage: topBy(hitters, 'battingAverage'),
    homeRuns: topBy(hitters, 'homeRuns'),
    rbi: topBy(hitters, 'rbi'),
    stolenBases: topBy(hitters, 'stolenBases'),
    era: [...pitchers].sort((a, b) => (a.era || 999) - (b.era || 999)).slice(0, 5)
      .map(s => ({ name: s.playerName, team: s.team, value: s.era || 0 })),
    wins: topBy(pitchers, 'wins'),
    strikeouts: topBy(pitchers, 'pitchingStrikeouts'),
    saves: topBy(pitchers, 'saves'),
  };
}