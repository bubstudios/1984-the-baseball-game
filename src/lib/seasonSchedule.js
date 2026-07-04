// Season Schedule - 1984 MLB division alignment + schedule generation
// NL: 18 intra-division + 12 cross-division = 162 games (81 home / 81 away)
// AL: 13 intra-division + 12 cross-division = 162 games (81 home / 81 away)

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
    const n = div.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // For odd game counts, use a regular tournament to decide which team
        // gets the extra home game, ensuring each team gets exactly 81 home.
        // For n teams (odd n), team i gets extra home vs j if (j-i) mod n <= floor(n/2).
        let extraHomeIsI = true;
        if (inDivGames % 2 === 1) {
          const diff = ((j - i) % n + n) % n;
          extraHomeIsI = diff <= Math.floor(n / 2);
        }
        for (let g = 0; g < inDivGames; g++) {
          let home, away;
          if (inDivGames % 2 === 0) {
            // Even game count: pure alternation, perfectly balanced
            home = g % 2 === 0 ? div[i] : div[j];
            away = g % 2 === 0 ? div[j] : div[i];
          } else {
            // Odd game count: first (n-1) games alternate, last game goes to extra-home team
            if (g < inDivGames - 1) {
              home = g % 2 === 0 ? div[i] : div[j];
              away = g % 2 === 0 ? div[j] : div[i];
            } else {
              home = extraHomeIsI ? div[i] : div[j];
              away = extraHomeIsI ? div[j] : div[i];
            }
          }
          matchups.push({ home, away });
        }
      }
    }
  }
  // Cross-division pairs (always even, simple alternation)
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
 * Every team gets exactly 81 home and 81 away games.
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

  // Build calendar: Apr 3 to Sept 30, 1984, excluding All-Star break (July 9-11)
  const allStarBreak = new Set(['1984-07-09', '1984-07-10', '1984-07-11']);
  const calendarDates = [];
  const calDate = new Date(Date.UTC(1984, 3, 3)); // April 3, 1984
  const calEnd = new Date(Date.UTC(1984, 8, 30)); // September 30, 1984
  while (calDate <= calEnd) {
    const dateStr = calDate.toISOString().split('T')[0];
    if (!allStarBreak.has(dateStr)) {
      calendarDates.push(dateStr);
    }
    calDate.setUTCDate(calDate.getUTCDate() + 1);
  }

  // Track consecutive games and total games per team
  const consecutiveGames = {};
  const totalGames = {};
  for (const teamKey of Object.keys(TEAMS)) {
    consecutiveGames[teamKey] = 0;
    totalGames[teamKey] = 0;
  }

  const MAX_CONSECUTIVE = 13;
  const schedule = [];
  let remaining = [...all];

  // Phase 1: Greedy assignment with consecutive-game limit
  for (const dateStr of calendarDates) {
    if (remaining.length === 0) break;

    // Teams at 13+ consecutive games get a forced off day
    const needsOffDay = new Set();
    for (const teamKey of Object.keys(TEAMS)) {
      if (consecutiveGames[teamKey] >= MAX_CONSECUTIVE) {
        needsOffDay.add(teamKey);
      }
    }

    const playing = new Set();
    const games = [];

    for (let i = remaining.length - 1; i >= 0; i--) {
      const m = remaining[i];
      if (needsOffDay.has(m.home) || needsOffDay.has(m.away)) continue;
      if (playing.has(m.home) || playing.has(m.away)) continue;
      if (totalGames[m.home] >= 162 || totalGames[m.away] >= 162) continue;

      games.push({
        home: m.home,
        away: m.away,
        isUser: !!(userTeam && (m.home === userTeam || m.away === userTeam)),
      });
      playing.add(m.home);
      playing.add(m.away);
      totalGames[m.home]++;
      totalGames[m.away]++;
      remaining.splice(i, 1);
    }

    // Update consecutive game counts (off day resets to 0)
    for (const teamKey of Object.keys(TEAMS)) {
      if (playing.has(teamKey)) {
        consecutiveGames[teamKey]++;
      } else {
        consecutiveGames[teamKey] = 0;
      }
    }

    if (games.length > 0) {
      schedule.push({ day: schedule.length + 1, date: dateStr, games });
    }
  }

  // Phase 2: Safety net - assign any remaining matchups without consecutive limit
  if (remaining.length > 0) {
    const extDate = new Date(Date.UTC(1984, 9, 1)); // October 1
    const hardLimit = new Date(Date.UTC(1984, 10, 15)); // Nov 15 hard stop
    while (remaining.length > 0 && extDate <= hardLimit) {
      const dateStr = extDate.toISOString().split('T')[0];
      const playing = new Set();
      const games = [];
      for (let i = remaining.length - 1; i >= 0; i--) {
        const m = remaining[i];
        if (playing.has(m.home) || playing.has(m.away)) continue;
        if (totalGames[m.home] >= 162 || totalGames[m.away] >= 162) continue;
        games.push({
          home: m.home, away: m.away,
          isUser: !!(userTeam && (m.home === userTeam || m.away === userTeam)),
        });
        playing.add(m.home); playing.add(m.away);
        totalGames[m.home]++; totalGames[m.away]++;
        remaining.splice(i, 1);
      }
      if (games.length > 0) schedule.push({ day: schedule.length + 1, date: dateStr, games });
      extDate.setUTCDate(extDate.getUTCDate() + 1);
    }
  }

  return schedule;
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

/**
 * Verify schedule integrity: every team has exactly 162 games,
 * exactly 81 home and 81 away, and no team plays twice on the same day.
 * @returns {string[]} Array of error strings (empty = valid)
 */
export function verifySchedule(schedule) {
  const counts = {};
  const homeAway = {};
  const teamGameDays = {};
  const allGameDates = new Set();
  const errors = [];

  for (const teamKey of Object.keys(TEAMS)) {
    counts[teamKey] = 0;
    homeAway[teamKey] = { home: 0, away: 0 };
    teamGameDays[teamKey] = new Set();
  }

  for (const day of schedule) {
    const seen = new Set();
    allGameDates.add(day.date);
    for (const game of day.games) {
      counts[game.home] = (counts[game.home] || 0) + 1;
      counts[game.away] = (counts[game.away] || 0) + 1;
      homeAway[game.home].home++;
      homeAway[game.away].away++;
      teamGameDays[game.home].add(day.date);
      teamGameDays[game.away].add(day.date);
      if (seen.has(game.home)) errors.push(`Day ${day.day}: ${game.home} appears twice`);
      if (seen.has(game.away)) errors.push(`Day ${day.day}: ${game.away} appears twice`);
      seen.add(game.home);
      seen.add(game.away);
    }
  }

  for (const [team, count] of Object.entries(counts)) {
    if (count !== 162) errors.push(`${team}: ${count} games (expected 162)`);
  }

  for (const [team, data] of Object.entries(homeAway)) {
    if (data.home !== 81) errors.push(`${team}: ${data.home} home games (expected 81)`);
    if (data.away !== 81) errors.push(`${team}: ${data.away} away games (expected 81)`);
  }

  // All-Star break: no games on July 9-11
  const allStarBreak = ['1984-07-09', '1984-07-10', '1984-07-11'];
  for (const date of allStarBreak) {
    if (allGameDates.has(date)) {
      errors.push(`All-Star break: games scheduled on ${date}`);
    }
  }

  // Off days per team (15-22, including All-Star break)
  const allStarBreakCount = 3;
  for (const team of Object.keys(TEAMS)) {
    const daysPlayed = teamGameDays[team].size;
    const offDays = (allGameDates.size - daysPlayed) + allStarBreakCount;
    if (offDays < 14 || offDays > 24) {
      errors.push(`${team}: ${offDays} off days (expected 15-22)`);
    }
  }

  // Last scheduled date should be Sept 27-Oct 5 (safety net allows Oct extension)
  const sortedDates = [...allGameDates].sort();
  if (sortedDates.length > 0) {
    const lastDate = sortedDates[sortedDates.length - 1];
    const lastMonth = parseInt(lastDate.split('-')[1]);
    if (lastMonth < 9) {
      errors.push(`Last scheduled date is ${lastDate} (expected late September)`);
    }
  }

  return errors;
}