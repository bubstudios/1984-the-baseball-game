// seasonAwards.js - End-of-regular-season awards for 1984 Season Mode.
// Generates: AL/NL MVP, AL/NL Cy Young, AL/NL Fireman of the Year, AL/NL Manager of the Year.
// Uses full regular-season PlayerStats + GameResult records.

import { TEAMS } from './gameData';
import { getLeague, getDivision, DIVISIONS } from './seasonSchedule';
import { deriveStandings } from './seasonStore';

// 1984 MLB managers (for Manager of the Year display)
const MANAGERS_1984 = {
  tigers: 'Sparky Anderson', bluejays: 'Bobby Cox', yankees: 'Yogi Berra',
  redsox: 'John McNamara', orioles: 'Joe Altobelli', indians: 'Pat Corrales',
  brewers: 'Rene Lachemann',
  royals: 'Dick Howser', angels: 'Gene Mauch', twins: 'Billy Gardner',
  athletics: 'Steve Boros', mariners: 'Del Crandall', whitesox: 'Tony La Russa',
  rangers: 'Doug Rader',
  cubs: 'Jim Frey', mets: 'Davey Johnson', cardinals: 'Whitey Herzog',
  phillies: 'Paul Owens', expos: 'Bill Virdon', pirates: 'Chuck Tanner',
  padres: 'Dick Williams', braves: 'Eddie Haas', astros: 'Bob Lillis',
  dodgers: 'Tommy Lasorda', reds: 'Vern Rapp', giants: 'Frank Robinson',
};

// Find a player's primary position from the TEAMS roster data
function findPlayerPos(teamKey, playerName) {
  const team = TEAMS[teamKey];
  if (!team) return null;
  for (const pool of [team.lineup, team.bench, team.rotation, team.bullpen]) {
    if (!pool) continue;
    const p = pool.find(p => p.name === playerName);
    if (p) return p.assignedPos || p.pos || null;
  }
  return null;
}

// ── MVP scoring (hitters only) ──
// Weighted mix of AVG, HR, RBI, R, SB, team success, games played.
// Position bonus for C/SS/CF/2B. Penalty for low games played.
function calculateMvpScore(stats, teamKey, standingsData) {
  const pos = findPlayerPos(teamKey, stats.playerName);
  if (!pos || ['SP', 'RP', 'CL'].includes(pos)) return null;

  const gp = stats.gamesPlayed || 0;
  const ab = stats.atBats || 0;
  const h = stats.hits || 0;
  const hr = stats.homeRuns || 0;
  const rbi = stats.rbi || 0;
  const r = stats.runs || 0;
  const sb = stats.stolenBases || 0;
  const avg = stats.battingAverage || 0;
  const ops = stats.ops || 0;

  // Minimum playing time: 100 games
  if (gp < 100) return null;

  // Team wins for team success factor
  const div = getDivision(teamKey);
  const divStandings = standingsData?.[div] || [];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  const teamWins = teamRow?.w || 0;
  const isDivWinner = divStandings.indexOf(teamRow) === 0;

  // Position bonus (defensive difficulty)
  const POS_BONUS = { 'C': 15, 'SS': 12, 'CF': 10, '2B': 8, '3B': 5, '1B': 0, 'LF': 0, 'RF': 0, 'DH': 0 };
  let posBonus = POS_BONUS[pos] || 0;
  // Multi-position: use the best eligible position
  if (pos && pos.includes('/')) {
    for (const p of pos.split('/')) {
      posBonus = Math.max(posBonus, POS_BONUS[p] || 0);
    }
  }

  // Games played penalty: below 130, scale down
  const gpFactor = gp >= 140 ? 1.0 : gp / 140;

  const score = (
    avg * 250 +
    hr * 4.5 +
    rbi * 1.8 +
    r * 1.2 +
    sb * 1.5 +
    ops * 60 +
    posBonus +
    (isDivWinner ? 20 : 0) +
    teamWins * 0.3
  ) * gpFactor;

  return score;
}

// ── Cy Young scoring (starting pitchers) ──
// ERA, WHIP, Wins, IP, K, K/9, team success. Minimum 130 IP.
function calculateCyYoungScore(stats, teamKey, standingsData) {
  const ip = stats.inningsPitched || 0;
  if (ip < 130) return null;

  const era = stats.era || 99;
  const whip = stats.whip || 99;
  const wins = stats.wins || 0;
  const so = stats.pitchingStrikeouts || 0;
  const gs = stats.pitchingGamesStarted || 0;
  const k9 = ip > 0 ? (so / ip) * 9 : 0;

  // Must be primarily a starter
  if (gs < 15) return null;

  const div = getDivision(teamKey);
  const divStandings = standingsData?.[div] || [];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  const teamWins = teamRow?.w || 0;
  const isDivWinner = divStandings.indexOf(teamRow) === 0;

  // Lower ERA/WHIP = higher score (invert and scale)
  const score =
    (6.00 - Math.min(era, 6.00)) * 25 +
    (1.60 - Math.min(whip, 1.60)) * 30 +
    wins * 3.5 +
    ip * 0.15 +
    so * 0.2 +
    k9 * 1.5 +
    (isDivWinner ? 15 : 0) +
    teamWins * 0.2;

  return score;
}

// ── Fireman of the Year scoring (relievers only) ──
// Saves, ERA, WHIP, relief appearances, K/9. Minimum 40 relief appearances.
function calculateFiremanScore(stats, teamKey, standingsData) {
  const ip = stats.inningsPitched || 0;
  const gp = stats.pitchingGames || 0;
  const gs = stats.pitchingGamesStarted || 0;
  const reliefApps = gp - gs;

  if (reliefApps < 40) return null;
  if (gs > reliefApps) return null; // primarily a starter

  const era = stats.era || 99;
  const whip = stats.whip || 99;
  const saves = stats.saves || 0;
  const so = stats.pitchingStrikeouts || 0;
  const k9 = ip > 0 ? (so / ip) * 9 : 0;

  const div = getDivision(teamKey);
  const divStandings = standingsData?.[div] || [];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  const teamWins = teamRow?.w || 0;
  const isDivWinner = divStandings.indexOf(teamRow) === 0;

  const score =
    saves * 4.5 +
    (4.00 - Math.min(era, 4.00)) * 15 +
    (1.40 - Math.min(whip, 1.40)) * 20 +
    reliefApps * 0.3 +
    k9 * 1.0 +
    (isDivWinner ? 10 : 0) +
    teamWins * 0.15;

  return score;
}

// ── Manager of the Year scoring ──
// Division winner bonus + win total + close race surprise bonus.
function calculateManagerScore(teamKey, standingsData) {
  const div = getDivision(teamKey);
  const divStandings = standingsData?.[div] || [];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  if (!teamRow) return 0;

  const wins = teamRow.w || 0;
  const isDivWinner = divStandings.indexOf(teamRow) === 0;
  const gb = teamRow.gb ?? 0;
  const closeRace = isDivWinner && gb <= 2.0 && (divStandings[1]?.w || 0) >= wins - 2;

  return wins + (isDivWinner ? 15 : 0) + (closeRace ? 8 : 0);
}

// Format a stat line for display
function formatMvpLine(s) {
  return `${(s.battingAverage || 0).toFixed(3).replace(/^0\./, '.')} AVG, ${s.homeRuns || 0} HR, ${s.rbi || 0} RBI, ${s.runs || 0} R, ${s.stolenBases || 0} SB`;
}
function formatCyYoungLine(s) {
  return `${(s.era || 0).toFixed(2)} ERA, ${(s.whip || 0).toFixed(2)} WHIP, ${s.wins || 0}-${s.losses || 0}, ${(s.inningsPitched || 0).toFixed(1)} IP, ${s.pitchingStrikeouts || 0} K`;
}
function formatFiremanLine(s) {
  return `${s.saves || 0} SV, ${(s.era || 0).toFixed(2)} ERA, ${(s.whip || 0).toFixed(2)} WHIP, ${(s.inningsPitched || 0).toFixed(1)} IP`;
}
function formatManagerLine(teamKey, standingsData) {
  const div = getDivision(teamKey);
  const divStandings = standingsData?.[div] || [];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  if (!teamRow) return '';
  const divLabel = div.replace('_', ' ');
  return `${teamRow.w}-${teamRow.l} (${divLabel} Winner)`;
}

// ── Main: calculate all awards ──
// Returns { awards: [{ awardType, league, winner, team, statLine }] }
// Idempotent: same input always produces same output (deterministic sort).
export function calculateSeasonAwards(playerStatsRecords, gameResults) {
  const standingsData = deriveStandings(gameResults);

  const awards = [];

  for (const league of ['AL', 'NL']) {
    // Filter players in this league
    const leaguePlayers = playerStatsRecords.filter(s => {
      const tl = getLeague(s.team);
      return tl === league;
    });

    // MVP (hitters only)
    let bestMvp = null;
    let bestMvpScore = -1;
    for (const s of leaguePlayers) {
      const score = calculateMvpScore(s, s.team, standingsData);
      if (score !== null && score > bestMvpScore) {
        bestMvpScore = score;
        bestMvp = s;
      }
    }
    if (bestMvp) {
      awards.push({
        awardType: 'MVP',
        league,
        winner: bestMvp.playerName,
        team: bestMvp.team,
        statLine: formatMvpLine(bestMvp),
      });
    }

    // Cy Young (starters)
    let bestCy = null;
    let bestCyScore = -1;
    for (const s of leaguePlayers) {
      const score = calculateCyYoungScore(s, s.team, standingsData);
      if (score !== null && score > bestCyScore) {
        bestCyScore = score;
        bestCy = s;
      }
    }
    if (bestCy) {
      awards.push({
        awardType: 'CyYoung',
        league,
        winner: bestCy.playerName,
        team: bestCy.team,
        statLine: formatCyYoungLine(bestCy),
      });
    }

    // Fireman of the Year (relievers)
    let bestFireman = null;
    let bestFiremanScore = -1;
    for (const s of leaguePlayers) {
      const score = calculateFiremanScore(s, s.team, standingsData);
      if (score !== null && score > bestFiremanScore) {
        bestFiremanScore = score;
        bestFireman = s;
      }
    }
    if (bestFireman) {
      awards.push({
        awardType: 'FiremanOfTheYear',
        league,
        winner: bestFireman.playerName,
        team: bestFireman.team,
        statLine: formatFiremanLine(bestFireman),
      });
    }

    // Manager of the Year
    const leagueTeams = Object.keys(TEAMS).filter(tk =>
      !tk.includes('ALLSTAR') && getLeague(tk) === league
    );
    let bestMgr = null;
    let bestMgrScore = -1;
    for (const tk of leagueTeams) {
      const score = calculateManagerScore(tk, standingsData);
      if (score > bestMgrScore) {
        bestMgrScore = score;
        bestMgr = tk;
      }
    }
    if (bestMgr) {
      awards.push({
        awardType: 'ManagerOfTheYear',
        league,
        winner: MANAGERS_1984[bestMgr] || `${TEAMS[bestMgr]?.name} Manager`,
        team: bestMgr,
        statLine: formatManagerLine(bestMgr, standingsData),
      });
    }
  }

  return { awards };
}