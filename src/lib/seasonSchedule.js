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
 * exactly 81 home and 81 away, and no team plays twice on the same day.
 * @returns {string[]} Array of error strings (empty = valid)
 */
export function verifySchedule(schedule) {
  const counts = {};
  const homeAway = {};
  const errors = [];

  for (const teamKey of Object.keys(TEAMS)) {
    counts[teamKey] = 0;
    homeAway[teamKey] = { home: 0, away: 0 };
  }

  for (const day of schedule) {
    const seen = new Set();
    for (const game of day.games) {
      counts[game.home] = (counts[game.home] || 0) + 1;
      counts[game.away] = (counts[game.away] || 0) + 1;
      homeAway[game.home].home++;
      homeAway[game.away].away++;
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

  return errors;
}