// Season Schedule - 1984 MLB division alignment + schedule generation
// NL: 18 intra-division + 12 cross-division = 162 games
// AL: 13 intra-division + 12 cross-division = 162 games

import { TEAMS } from './gameData';

export const DIVISIONS = {
  AL_East: ['tigers', 'bluejays', 'yankees', 'redsox', 'orioles', 'indians', 'brewers'],
  AL_West: ['royals', 'angels', 'twins', 'athletics', 'mariners', 'whitesox', 'rangers'],
  NL_East: ['cubs', 'mets', 'cardinals', 'phillies', 'expos', 'pirates'],
  NL_West: ['padres', 'braves', 'astros', 'dodgers', 'reds', 'giants'],
};

export const LEAGUES = {
  AL: [...DIVISIONS.AL_East, ...DIVISIONS.AL_West],
  NL: [...DIVISIONS.NL_East, ...DIVISIONS.NL_West],
};

export function getDivision(teamKey) {
  for (const [div, teams] of Object.entries(DIVISIONS)) {
    if (teams.includes(teamKey)) return div;
  }
  return null;
}

export function getLeague(teamKey) {
  return LEAGUES.AL.includes(teamKey) ? 'AL' : 'NL';
}

export function getDivisionRivals(teamKey) {
  const div = getDivision(teamKey);
  if (!div) return [];
  return DIVISIONS[div].filter(t => t !== teamKey);
}

// Generate all matchups for a league, then shuffle and assign to days
function generateMatchups(divA, divB, inDivGames, crossDivGames) {
  const matchups = [];
  // Intra-division pairs
  for (const div of [divA, divB]) {
    for (let i = 0; i < div.length; i++) {
      for (let j = i + 1; j < div.length; j++) {
        for (let g = 0; g < inDivGames; g++) {
          matchups.push({ home: g % 2 === 0 ? div[i] : div[j], away: g % 2 === 0 ? div[j] : div[i] });
        }
      }
    }
  }
  // Cross-division pairs
  for (const a of divA) {
    for (const b of divB) {
      for (let g = 0; g < crossDivGames; g++) {
        matchups.push({ home: g % 2 === 0 ? a : b, away: g % 2 === 0 ? b : a });
      }
    }
  }
  return matchups;
}

/**
 * Generate a full 162-game schedule as an array of Day objects.
 * Each Day holds all games across both leagues for that date.
 * No team appears more than once per day.
 * @param {string} userTeam - Team key for the user's team (marks isUser games)
 * @returns {Array<{day, date, games: [{home, away, isUser}]}>}
 */
export function generateSchedule(userTeam) {
  const alMatchups = generateMatchups(DIVISIONS.AL_East, DIVISIONS.AL_West, 13, 12);
  const nlMatchups = generateMatchups(DIVISIONS.NL_East, DIVISIONS.NL_West, 18, 12);
  let all = [...alMatchups, ...nlMatchups];

  // Shuffle for random day assignment
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }

  // Greedy: assign each matchup to the earliest day where neither team is playing
  const startDate = new Date('1984-04-03');
  const schedule = [];
  let dayIndex = 0;
  let remaining = [...all];

  while (remaining.length > 0) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayIndex);
    const dateStr = date.toISOString().split('T')[0];

    const playing = new Set();
    const games = [];

    for (let i = remaining.length - 1; i >= 0; i--) {
      const m = remaining[i];
      if (!playing.has(m.home) && !playing.has(m.away)) {
        games.push({
          home: m.home,
          away: m.away,
          isUser: !!(userTeam && (m.home === userTeam || m.away === userTeam)),
        });
        playing.add(m.home);
        playing.add(m.away);
        remaining.splice(i, 1);
      }
    }

    schedule.push({ day: dayIndex + 1, date: dateStr, games });
    dayIndex++;
  }

  return schedule;
}

/**
 * Verify schedule integrity: every team has exactly 162 games,
 * no team plays twice on the same day.
 * @returns {string[]} Array of error strings (empty = valid)
 */
export function verifySchedule(schedule) {
  const counts = {};
  const errors = [];

  for (const teamKey of Object.keys(TEAMS)) counts[teamKey] = 0;

  for (const day of schedule) {
    const seen = new Set();
    for (const game of day.games) {
      counts[game.home] = (counts[game.home] || 0) + 1;
      counts[game.away] = (counts[game.away] || 0) + 1;
      if (seen.has(game.home)) errors.push(`Day ${day.day}: ${game.home} appears twice`);
      if (seen.has(game.away)) errors.push(`Day ${day.day}: ${game.away} appears twice`);
      seen.add(game.home);
      seen.add(game.away);
    }
  }

  for (const [team, count] of Object.entries(counts)) {
    if (count !== 162) errors.push(`${team}: ${count} games (expected 162)`);
  }

  return errors;
}