/**
 * Season Engine - Headless game simulation wrapper
 * 
 * This module provides stateless functions for simulating games
 * without UI dependencies. Used by backend functions and Season Mode.
 */

import { TEAMS, DEFAULT_PITCHES } from './gameData';
import { 
  createGameState, 
  processAtBat, 
  cpuSelectPitch, 
  cpuSelectSwing, 
  cpuDecideSubstitutions,
  getCurrentBatter,
  getCurrentPitcher
} from './gameEngine';

/**
 * Simulate a complete game headlessly
 * @param {string} homeTeam - Home team key
 * @param {string} awayTeam - Away team key
 * @param {object} options - Simulation options
 * @returns {object} Final game state with stats
 */
export function simulateGameHeadless(homeTeam, awayTeam, options = {}) {
  const {
    useDH = false,
    weather = null,
    umpire = null,
    homeLineup = null,
    awayLineup = null
  } = options;

  // Create initial state
  let state = createGameState(
    homeTeam, 
    awayTeam, 
    homeLineup, 
    awayLineup, 
    useDH, 
    weather, 
    umpire
  );
  
  state._headlessMode = true;

  // Safety limit to prevent infinite loops
  const maxIterations = 500;
  let iterations = 0;

  while (!state.gameOver && iterations < maxIterations) {
    iterations++;
    
    // Get current batter and pitcher
    const batter = getCurrentBatter(state);
    const pitcher = getCurrentPitcher(state);
    
    // CPU vs CPU - both sides use AI
    const pitchType = cpuSelectPitch(state);
    const swingType = cpuSelectSwing(state);
    
    // Process the at-bat
    state = processAtBat(state, pitchType, swingType);
    
    // Handle substitutions between at-bats
    state = cpuDecideSubstitutions(state, null);
  }

  if (iterations >= maxIterations) {
    console.warn('Game simulation hit iteration limit - forcing end');
    state.gameOver = true;
  }

  return state;
}

/**
 * Extract game summary from final state
 * @param {object} state - Final game state
 * @returns {object} Game summary for database storage
 */
export function extractGameSummary(state) {
  const homeHRs = (state.homePlayerHistory || [])
    .filter(p => p.gameStats?.hr > 0)
    .map(p => ({
      playerName: p.name,
      distance: p.gameStats?.lastHRDistance || 0,
      inning: p.gameStats?.hrInning || 0
    }));

  const awayHRs = (state.awayPlayerHistory || [])
    .filter(p => p.gameStats?.hr > 0)
    .map(p => ({
      playerName: p.name,
      distance: p.gameStats?.lastHRDistance || 0,
      inning: p.gameStats?.hrInning || 0
    }));

  const homeHits = state.homeLineup.reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);
  const awayHits = state.awayLineup.reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);

  return {
    homeScore: state.score.home,
    awayScore: state.score.away,
    winner: state.score.home > state.score.away ? state.homeTeam : state.awayTeam,
    homeHits,
    awayHits,
    homeHRs,
    awayHRs,
    innings: state.innings,
    log: state.log // Keep for debugging
  };
}

/**
 * Generate a full 162-game schedule for a team
 * @param {string} teamKey - Team to generate schedule for
 * @param {number} year - Season year
 * @returns {array} Array of game objects
 */
export function generateTeamSchedule(teamKey, year = 1984) {
  const schedule = [];
  const allTeams = Object.keys(TEAMS).filter(t => t !== teamKey);
  
  // Simplified schedule generation
  // In reality, this would follow MLB scheduling rules
  
  let gameDay = 1;
  const startDate = new Date(`${year}-04-02`);
  
  // Each team plays 162 games
  // 12 games vs each division mate (4 teams × 12 = 48)
  // 6-7 games vs other teams in league
  // Interleague play (in 1984 there was none, but we'll add some for fun)
  
  const divisionRivals = getDivisionRivals(teamKey);
  const leagueTeams = getLeagueTeams(teamKey);
  const otherLeagueTeams = allTeams.filter(t => !leagueTeams.includes(t));

  // Division games (12 games each)
  divisionRivals.forEach(rival => {
    for (let i = 0; i < 12; i++) {
      const isHome = i % 2 === 0;
      schedule.push({
        gameDay,
        gameDate: new Date(startDate.getTime() + (gameDay - 1) * 86400000).toISOString().split('T')[0],
        homeTeam: isHome ? teamKey : rival,
        awayTeam: isHome ? rival : teamKey,
        isUserGame: true
      });
      gameDay++;
    }
  });

  // Fill remaining games with league and interleague opponents
  while (schedule.length < 162) {
    const remaining = 162 - schedule.length;
    
    // Pick opponent
    let opponent;
    if (remaining > 50) {
      opponent = leagueTeams[Math.floor(Math.random() * leagueTeams.length)];
    } else if (remaining > 20) {
      opponent = otherLeagueTeams[Math.floor(Math.random() * otherLeagueTeams.length)];
    } else {
      opponent = divisionRivals[Math.floor(Math.random() * divisionRivals.length)];
    }

    const isHome = Math.random() > 0.5;
    schedule.push({
      gameDay,
      gameDate: new Date(startDate.getTime() + (gameDay - 1) * 86400000).toISOString().split('T')[0],
      homeTeam: isHome ? teamKey : opponent,
      awayTeam: isHome ? opponent : teamKey,
      isUserGame: true
    });
    gameDay++;
  }

  return schedule.slice(0, 162);
}

/**
 * Get division rivals for a team
 */
function getDivisionRivals(teamKey) {
  const divisions = {
    ALEast: ['yankees', 'redsox', 'orioles', 'bluejays', 'brewers'],
    ALCentral: ['whitesox', 'royals', 'twins', 'indians', 'tigers'],
    ALWest: ['athletics', 'angels', 'mariners', 'rangers'],
    NLEast: ['mets', 'phillies', 'expos', 'pirates', 'cubs'],
    NLCentral: ['cardinals', ['braves'], ['reds'], ['astros']],
    NLWest: ['dodgers', ['giants'], ['padres'], ['reds']]
  };

  // Find which division the team is in
  for (const [div, teams] of Object.entries(divisions)) {
    if (teams.includes(teamKey)) {
      return teams.filter(t => t !== teamKey);
    }
  }

  return [];
}

/**
 * Get all teams in the same league
 */
function getLeagueTeams(teamKey) {
  const AL = ['yankees', 'redsox', 'orioles', 'bluejays', 'brewers', 'whitesox', 'royals', 'twins', 'indians', 'tigers', 'athletics', 'angels', 'mariners', 'rangers'];
  const NL = ['mets', 'phillies', 'expos', 'pirates', 'cubs', 'cardinals', 'braves', 'reds', 'astros', 'dodgers', 'giants', 'padres'];

  if (AL.includes(teamKey)) return AL.filter(t => t !== teamKey);
  if (NL.includes(teamKey)) return NL.filter(t => t !== teamKey);
  return [];
}

/**
 * Calculate batting statistics from game data
 */
export function calculateBattingStats(playerGames) {
  const stats = playerGames.reduce((acc, game) => {
    acc.atBats += game.ab || 0;
    acc.hits += game.hits || 0;
    acc.homeRuns += game.hr || 0;
    acc.rbi += game.rbi || 0;
    acc.runs += game.runs || 0;
    acc.walks += game.bb || 0;
    acc.strikeouts += game.so || 0;
    acc.doubles += game.doubles || 0;
    acc.triples += game.triples || 0;
    acc.stolenBases += game.sb || 0;
    return acc;
  }, {
    atBats: 0, hits: 0, homeRuns: 0, rbi: 0, runs: 0,
    walks: 0, strikeouts: 0, doubles: 0, triples: 0, stolenBases: 0
  });

  const avg = stats.atBats > 0 ? stats.hits / stats.atBats : 0;
  const obp = (stats.atBats + stats.walks) > 0 
    ? (stats.hits + stats.walks) / (stats.atBats + stats.walks) 
    : 0;
  const slg = stats.atBats > 0 
    ? (stats.hits + stats.doubles + 2 * stats.triples + 3 * stats.homeRuns) / stats.atBats 
    : 0;

  return {
    ...stats,
    battingAverage: avg,
    onBasePercentage: obp,
    sluggingPercentage: slg,
    ops: obp + slg
  };
}

/**
 * Calculate pitching statistics from game data
 */
export function calculatePitchingStats(playerGames) {
  const stats = playerGames.reduce((acc, game) => {
    acc.inningsPitched += game.ip || 0;
    acc.hits += game.h || 0;
    acc.runs += game.r || 0;
    acc.earnedRuns += game.er || 0;
    acc.walks += game.bb || 0;
    acc.strikeouts += game.so || 0;
    acc.homeRuns += game.hr || 0;
    acc.wins += game.w || 0;
    acc.losses += game.l || 0;
    acc.saves += game.sv || 0;
    return acc;
  }, {
    inningsPitched: 0, hits: 0, runs: 0, earnedRuns: 0,
    walks: 0, strikeouts: 0, homeRuns: 0, wins: 0, losses: 0, saves: 0
  });

  const era = stats.inningsPitched > 0 
    ? (stats.earnedRuns * 9) / stats.inningsPitched 
    : 0;
  const whip = stats.inningsPitched > 0 
    ? (stats.hits + stats.walks) / stats.inningsPitched 
    : 0;

  return {
    ...stats,
    era,
    whip
  };
}