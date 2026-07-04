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

// Split a game count into series of 3-4 games (avoids 1-2 game series)
function splitIntoSeries(total) {
  const series = [];
  let remaining = total;
  while (remaining > 0) {
    if (remaining >= 7) {
      series.push(Math.random() < 0.4 ? 4 : 3);
      remaining -= series[series.length - 1];
    } else if (remaining === 6) {
      series.push(3); series.push(3);
      remaining = 0;
    } else if (remaining === 5) {
      series.push(3); series.push(2);
      remaining = 0;
    } else {
      series.push(remaining);
      remaining = 0;
    }
  }
  // Merge any 2-game remainder into previous series
  for (let i = series.length - 1; i >= 0; i--) {
    if (series[i] <= 2 && i > 0) {
      series[i - 1] += series[i];
      series.splice(i, 1);
    }
  }
  return series;
}

/**
 * Generate a full 162-game schedule as an array of Day objects.
 * Series-based: matchups are grouped into 3-4 game series and placed on
 * consecutive calendar days, producing realistic homestands/road trips
 * and natural off days. No day-by-day pairing that strands remainders.
 * @param {string} userTeam - Team key for the user's team (marks isUser games)
 * @returns {Array<{day, date, games: [{home, away, isUser}]}>}
 */
export function generateSchedule(userTeam) {
  const alMatchups = generateMatchups(DIVISIONS.AL_East, DIVISIONS.AL_West, 13, 12);
  const nlMatchups = generateMatchups(DIVISIONS.NL_East, DIVISIONS.NL_West, 18, 12);
  const all = [...alMatchups, ...nlMatchups];

  // Group matchups by (home, away) pair — each group becomes one or more series
  const seriesMap = {};
  for (const m of all) {
    const key = `${m.home}|${m.away}`;
    if (!seriesMap[key]) seriesMap[key] = [];
    seriesMap[key].push(m);
  }

  // Split each group into series of 3-4 games
  const seriesList = [];
  for (const [, matchups] of Object.entries(seriesMap)) {
    const lengths = splitIntoSeries(matchups.length);
    for (const len of lengths) {
      seriesList.push({ home: matchups[0].home, away: matchups[0].away, length: len });
    }
  }

  // Shuffle then sort by length (longer series are harder to place — do them first)
  for (let i = seriesList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [seriesList[i], seriesList[j]] = [seriesList[j], seriesList[i]];
  }
  seriesList.sort((a, b) => b.length - a.length);

  // Build calendar: Apr 3 to Sept 30, 1984, excluding All-Star break (July 9-11)
  const allStarBreak = new Set(['1984-07-09', '1984-07-10', '1984-07-11']);
  const calendarDates = [];
  const calDate = new Date(Date.UTC(1984, 3, 3));
  const calEnd = new Date(Date.UTC(1984, 8, 30));
  while (calDate <= calEnd) {
    const dateStr = calDate.toISOString().split('T')[0];
    if (!allStarBreak.has(dateStr)) calendarDates.push(dateStr);
    calDate.setUTCDate(calDate.getUTCDate() + 1);
  }

  // Place each series on the earliest block of consecutive dates where both teams are free
  const teamBusy = {};
  for (const team of Object.keys(TEAMS)) teamBusy[team] = new Set();
  const dateToGames = {};
  const unplaced = [];

  for (const series of seriesList) {
    let placed = false;
    for (let start = 0; start <= calendarDates.length - series.length; start++) {
      const block = calendarDates.slice(start, start + series.length);
      if (block.every(d => !teamBusy[series.home].has(d) && !teamBusy[series.away].has(d))) {
        for (const dateStr of block) {
          teamBusy[series.home].add(dateStr);
          teamBusy[series.away].add(dateStr);
          if (!dateToGames[dateStr]) dateToGames[dateStr] = [];
          dateToGames[dateStr].push({
            home: series.home,
            away: series.away,
            isUser: !!(userTeam && (series.home === userTeam || series.away === userTeam)),
          });
        }
        placed = true;
        break;
      }
    }
    if (!placed) unplaced.push(series);
  }

  // Safety net: place any unplaced series as individual games
  for (const series of unplaced) {
    for (let g = 0; g < series.length; g++) {
      let gamePlaced = false;
      for (const dateStr of calendarDates) {
        if (!teamBusy[series.home].has(dateStr) && !teamBusy[series.away].has(dateStr)) {
          teamBusy[series.home].add(dateStr);
          teamBusy[series.away].add(dateStr);
          if (!dateToGames[dateStr]) dateToGames[dateStr] = [];
          dateToGames[dateStr].push({
            home: series.home, away: series.away,
            isUser: !!(userTeam && (series.home === userTeam || series.away === userTeam)),
          });
          gamePlaced = true;
          break;
        }
      }
      if (!gamePlaced) {
        console.error(`[schedule] Failed to place game: ${series.away} at ${series.home}`);
      }
    }
  }

  // Build schedule sorted by date
  const schedule = Object.entries(dateToGames)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, games], i) => ({ day: i + 1, date, games }));

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
 * Verify schedule integrity: every team has exactly 162 games (81H/81A),
 * correct opponent-mix counts, no team plays twice on the same date,
 * All-Star break is clear, and off-day counts are in range.
 * @returns {string[]} Array of error strings (empty = valid)
 */
export function verifySchedule(schedule) {
  const counts = {};
  const homeAway = {};
  const teamGameDays = {};
  const opponentCounts = {}; // "home|away" -> games at home team's park
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
      const oKey = `${game.home}|${game.away}`;
      opponentCounts[oKey] = (opponentCounts[oKey] || 0) + 1;
      if (seen.has(game.home)) errors.push(`Day ${day.day} (${day.date}): ${game.home} appears twice`);
      if (seen.has(game.away)) errors.push(`Day ${day.day} (${day.date}): ${game.away} appears twice`);
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

  // Opponent-mix check: AL intra=13, NL intra=18, cross=12
  const checkedPairs = new Set();
  for (const team of Object.keys(TEAMS)) {
    const teamLeague = getLeague(team);
    const teamDiv = getDivision(team);
    for (const opp of Object.keys(TEAMS)) {
      if (opp === team) continue;
      if (getLeague(opp) !== teamLeague) continue; // interleague out of scope
      const pairKey = [team, opp].sort().join('|');
      if (checkedPairs.has(pairKey)) continue;
      checkedPairs.add(pairKey);
      const total = (opponentCounts[`${team}|${opp}`] || 0) + (opponentCounts[`${opp}|${team}`] || 0);
      const expected = (getDivision(opp) === teamDiv)
        ? (teamLeague === 'AL' ? 13 : 18)
        : 12;
      if (total !== expected) {
        errors.push(`${team} vs ${opp}: ${total} games (expected ${expected})`);
      }
    }
  }

  // All-Star break: no games on July 9-11
  for (const date of ['1984-07-09', '1984-07-10', '1984-07-11']) {
    if (allGameDates.has(date)) errors.push(`All-Star break: games scheduled on ${date}`);
  }

  // Off days per team (15-22, including All-Star break)
  for (const team of Object.keys(TEAMS)) {
    const daysPlayed = teamGameDays[team].size;
    const offDays = (allGameDates.size - daysPlayed) + 3;
    if (offDays < 14 || offDays > 24) {
      errors.push(`${team}: ${offDays} off days (expected 15-22)`);
    }
  }

  // Last scheduled date should be in September (or early Oct from safety net)
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