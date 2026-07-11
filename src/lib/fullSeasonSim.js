// Full Season Simulation - runs all 162 games for all 26 teams,
// accumulates player stats, and returns league leaders + standings.
// Purely in-memory: no DB writes.

import { TEAMS } from './gameData';
import { generateScheduleValidated, LEAGUES } from './seasonSchedule';
import { simulateGameHeadless, buildGameResultFromState } from './seasonEngine';
import {
  getProbableStarter, advanceRotation, recordPitcherWorkload,
  getUnavailableRelievers, getPregameAvailability,
} from './seasonStore';

/**
 * Run a full 162-game season simulation.
 * @param {function} onProgress - Callback(day, totalDays, gameCount)
 * @returns {object} { playerStats, teamStandings, summary }
 */
export async function runFullSeasonSim(onProgress) {
  const { days: scheduleDays, errors } = generateScheduleValidated('tigers', 15);
  if (errors.length > 0) {
    return { error: 'Schedule generation failed', scheduleErrors: errors.slice(0, 10) };
  }

  const rotationState = {};
  const playerStats = {}; // key: "teamKey|playerName"
  const teamStandings = {}; // { teamKey: { w, l, runsFor, runsAgainst } }
  for (const tk of Object.keys(TEAMS)) {
    teamStandings[tk] = { w: 0, l: 0, runsFor: 0, runsAgainst: 0 };
  }

  let gameCount = 0;
  let simErrors = 0;
  const totalDays = scheduleDays.length;

  for (let dayIdx = 0; dayIdx < totalDays; dayIdx++) {
    const day = scheduleDays[dayIdx];

    for (const game of day.games) {
      const homeTeam = game.home;
      const awayTeam = game.away;
      const gameDate = day.date;
      const useDH = TEAMS[homeTeam]?.league === 'AL';

      const homeSP = getProbableStarter(rotationState, homeTeam, gameDate);
      const awaySP = getProbableStarter(rotationState, awayTeam, gameDate);
      const unavailableRelievers = {
        home: getUnavailableRelievers(rotationState, homeTeam, gameDate),
        away: getUnavailableRelievers(rotationState, awayTeam, gameDate),
      };

      let finalState, result;
      try {
        finalState = simulateGameHeadless(homeTeam, awayTeam, {
          useDH, homeSP, awaySP, unavailableRelievers,
          rotationState, gameDate,
        });
        result = buildGameResultFromState(finalState);
      } catch (e) {
        simErrors++;
        gameCount++;
        continue;
      }

      // Accumulate batting stats
      if (result?.batting) {
        for (const b of result.batting) {
          accumulateBatting(playerStats, b);
        }
      }

      // Accumulate pitching stats
      if (result?.pitching) {
        for (const p of result.pitching) {
          accumulatePitching(playerStats, p);
        }
      }

      // Team standings
      const homeScore = finalState.score.home;
      const awayScore = finalState.score.away;
      const homeWon = homeScore > awayScore;
      if (homeWon) {
        teamStandings[homeTeam].w++;
        teamStandings[awayTeam].l++;
      } else {
        teamStandings[awayTeam].w++;
        teamStandings[homeTeam].l++;
      }
      teamStandings[homeTeam].runsFor += homeScore;
      teamStandings[homeTeam].runsAgainst += awayScore;
      teamStandings[awayTeam].runsFor += awayScore;
      teamStandings[awayTeam].runsAgainst += homeScore;

      // Advance rotation + record workload
      if (finalState.homeStartingPitcherName) advanceRotation(rotationState, homeTeam, finalState.homeStartingPitcherName, gameDate);
      if (finalState.awayStartingPitcherName) advanceRotation(rotationState, awayTeam, finalState.awayStartingPitcherName, gameDate);
      recordPitcherWorkload(rotationState, homeTeam, result?.pitching?.filter(p => p.teamKey === homeTeam) || [], gameDate);
      recordPitcherWorkload(rotationState, awayTeam, result?.pitching?.filter(p => p.teamKey === awayTeam) || [], gameDate);

      gameCount++;
    }

    if (onProgress) onProgress(dayIdx + 1, totalDays, gameCount);
    await new Promise(r => setTimeout(r, 0));
  }

  // Compute derived stats
  const allStats = Object.values(playerStats);
  for (const ps of allStats) {
    ps.battingAverage = ps.atBats > 0 ? ps.hits / ps.atBats : 0;
    const pa = ps.atBats + ps.walks;
    ps.onBasePercentage = pa > 0 ? (ps.hits + ps.walks) / pa : 0;
    ps.sluggingPercentage = ps.atBats > 0 ? (ps.hits + ps.doubles + 2 * ps.triples + 3 * ps.homeRuns) / ps.atBats : 0;
    ps.ops = ps.onBasePercentage + ps.sluggingPercentage;
    ps.era = ps.inningsPitched > 0 ? (9 * ps.pitchingEarnedRuns) / ps.inningsPitched : 0;
    ps.whip = ps.inningsPitched > 0 ? (ps.pitchingWalks + ps.pitchingHits) / ps.inningsPitched : 0;
  }

  const summary = {
    totalGames: gameCount,
    simErrors,
    totalDays,
  };

  return { playerStats: allStats, teamStandings, summary };
}

function newPlayerStats(teamKey, name) {
  return {
    team: teamKey,
    playerName: name,
    gamesPlayed: 0,
    atBats: 0,
    hits: 0,
    runs: 0,
    doubles: 0,
    triples: 0,
    homeRuns: 0,
    rbi: 0,
    walks: 0,
    strikeouts: 0,
    stolenBases: 0,
    pitchingGames: 0,
    pitchingGamesStarted: 0,
    inningsPitched: 0,
    pitchingHits: 0,
    pitchingRuns: 0,
    pitchingEarnedRuns: 0,
    pitchingWalks: 0,
    pitchingStrikeouts: 0,
    pitchingHomeRuns: 0,
    wins: 0,
    losses: 0,
    saves: 0,
  };
}

function accumulateBatting(playerStats, b) {
  const key = `${b.teamKey}|${b.name}`;
  if (!playerStats[key]) playerStats[key] = newPlayerStats(b.teamKey, b.name);
  const ps = playerStats[key];
  ps.gamesPlayed++;
  ps.atBats += b.ab || 0;
  ps.hits += b.h || 0;
  ps.runs += b.r || 0;
  ps.doubles += b.doubles || 0;
  ps.triples += b.triples || 0;
  ps.homeRuns += b.hr || 0;
  ps.rbi += b.rbi || 0;
  ps.walks += b.bb || 0;
  ps.strikeouts += b.so || 0;
  ps.stolenBases += b.sb || 0;
}

function accumulatePitching(playerStats, p) {
  const key = `${p.teamKey}|${p.name}`;
  if (!playerStats[key]) playerStats[key] = newPlayerStats(p.teamKey, p.name);
  const ps = playerStats[key];
  ps.pitchingGames++;
  if (p.gs === 1) ps.pitchingGamesStarted++;
  ps.inningsPitched += (p.outs || 0) / 3;
  ps.pitchingHits += p.h || 0;
  ps.pitchingRuns += p.r || 0;
  ps.pitchingEarnedRuns += p.er || 0;
  ps.pitchingWalks += p.bb || 0;
  ps.pitchingStrikeouts += p.so || 0;
  ps.pitchingHomeRuns += p.hr || 0;
  ps.wins += p.w || 0;
  ps.losses += p.l || 0;
  ps.saves += p.sv || 0;
}

// ── Helper: get sorted leaders for a category ──
export function getLeaders(playerStats, { field, league, isPitching, qualify, lowerIsBetter, topN = 10 }) {
  let pool = playerStats;
  if (league === 'AL') pool = pool.filter(s => LEAGUES.AL.includes(s.team));
  else if (league === 'NL') pool = pool.filter(s => LEAGUES.NL.includes(s.team));

  // Qualification: batters need 3.1 PA per team game (~502 PA); pitchers need 1 IP per team game (~162 IP)
  let qualified = pool.filter(s => {
    if (isPitching) {
      if (qualify) return s.inningsPitched >= 162;
      return (s[field] || 0) > 0;
    }
    const pa = s.atBats + s.walks;
    if (qualify) return pa >= 502;
    return pa > 0 && (s[field] || 0) > 0;
  });

  qualified.sort((a, b) => {
    const av = a[field] || 0;
    const bv = b[field] || 0;
    return lowerIsBetter ? av - bv : bv - av;
  });

  return qualified.slice(0, topN);
}