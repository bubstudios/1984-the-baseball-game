// Season Schedule - 1984 MLB division alignment + REAL 1984 schedule
// The schedule is imported from Retrosheet's 1984SKED data (see realSchedule1984.js).
// Every team plays exactly 162 games (2106 total). Real dates, off days, and doubleheaders.

import { TEAMS } from './gameData';
import { SCHEDULE_1984 } from './realSchedule1984';

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

// Build the real 1984 schedule as an array of Day objects.
// Each Day: { day, date, games: [{ home, away, isUser }] }
// Day numbers are sequential (1, 2, 3, ...) for dates with games, skipping league off days.
export function generateSchedule(userTeam) {
  const dateMap = {};
  for (const [date, away, home] of SCHEDULE_1984) {
    if (!dateMap[date]) dateMap[date] = [];
    dateMap[date].push({
      home,
      away,
      isUser: !!(userTeam && (home === userTeam || away === userTeam)),
    });
  }

  const sortedDates = Object.keys(dateMap).sort();
  return sortedDates.map((date, i) => ({
    day: i + 1,
    date,
    games: dateMap[date],
  }));
}

// Get the sequential game day number for a specific date (1-based).
// Returns null if the date has no scheduled games (league off day).
export function getGameDayForDate(dateStr) {
  const dateSet = [...new Set(SCHEDULE_1984.map(g => g[0]))].sort();
  const idx = dateSet.indexOf(dateStr);
  return idx >= 0 ? idx + 1 : null;
}

// Format an ISO date string (e.g. '1984-05-01') as 'Tue, May 1, 1984'
export function formatGameDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  const d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[d.getUTCDay()]}, ${months[d.getUTCMonth() + 1]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

// Verify schedule integrity: every team has exactly 162 games (81H/81A).
export function verifySchedule(schedule) {
  const counts = {};
  const homeAway = {};
  const errors = [];

  for (const teamKey of Object.keys(TEAMS)) {
    counts[teamKey] = 0;
    homeAway[teamKey] = { home: 0, away: 0 };
  }

  for (const day of schedule) {
    for (const game of day.games) {
      counts[game.home] = (counts[game.home] || 0) + 1;
      counts[game.away] = (counts[game.away] || 0) + 1;
      homeAway[game.home].home++;
      homeAway[game.away].away++;
    }
  }

  for (const [team, count] of Object.entries(counts)) {
    if (count !== 162) errors.push(`${team}: ${count} games (expected 162)`);
  }
  for (const [team, data] of Object.entries(homeAway)) {
    if (data.home !== 81) errors.push(`${team}: ${data.home} home games (expected 81)`);
    if (data.away !== 81) errors.push(`${team}: ${data.away} away games (expected 81)`);
  }

  return errors;
}

// Generate a validated schedule. With the real 1984 schedule, this always succeeds.
export function generateScheduleValidated(userTeam) {
  const days = generateSchedule(userTeam);
  const errors = verifySchedule(days);
  return { days, errors, attempts: 1 };
}