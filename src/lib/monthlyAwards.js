// monthlyAwards.js - Calculates AL/NL Player and Pitcher of the Month.
// Uses calendar-month filtering on GameResult.gameDate.
// Awards are based on monthly stats only, not season totals.

import { TEAMS } from './gameData';

function leagueOf(key) { return TEAMS[key]?.league || 'NL'; }
function last(fullName) {
  if (!fullName) return '?';
  const p = fullName.trim().split(' ');
  return p.length > 1 ? p[p.length - 1] : fullName;
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getMonthName(monthNum) {
  return MONTH_NAMES[monthNum] || '';
}

// Filter GameResults by calendar month (gameDate YYYY-MM-DD)
function filterByMonth(gameResults, year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  return gameResults.filter(r => r.gameDate && r.gameDate.startsWith(prefix));
}

// Aggregate batting stats across a set of GameResults
function aggregateBatting(gameResults) {
  const players = {};
  for (const result of gameResults) {
    const batting = result.boxScore?.batting || [];
    for (const b of batting) {
      if (!b.playerId) continue;
      if (!players[b.playerId]) {
        players[b.playerId] = {
          playerId: b.playerId, name: b.name, teamKey: b.teamKey,
          league: leagueOf(b.teamKey),
          games: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0,
        };
      }
      const p = players[b.playerId];
      if (b.ab > 0) p.games++;
      p.ab += b.ab || 0;
      p.h += b.h || 0;
      p.doubles += b.doubles || 0;
      p.triples += b.triples || 0;
      p.hr += b.hr || 0;
      p.rbi += b.rbi || 0;
      p.r += b.r || 0;
      p.bb += b.bb || 0;
      p.so += b.so || 0;
      p.sb += b.sb || 0;
    }
  }
  return players;
}

// Aggregate pitching stats
function aggregatePitching(gameResults) {
  const players = {};
  for (const result of gameResults) {
    const pitching = result.boxScore?.pitching || [];
    for (const p of pitching) {
      if (!p.playerId) continue;
      if (!players[p.playerId]) {
        players[p.playerId] = {
          playerId: p.playerId, name: p.name, teamKey: p.teamKey,
          league: leagueOf(p.teamKey),
          games: 0, starts: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0,
          wins: 0, losses: 0, saves: 0,
        };
      }
      const pp = players[p.playerId];
      pp.games++;
      if (p.gs === 1) pp.starts++;
      pp.outs += p.outs || 0;
      pp.h += p.h || 0;
      pp.r += p.r || 0;
      pp.er += p.er || 0;
      pp.bb += p.bb || 0;
      pp.so += p.so || 0;
      pp.hr += p.hr || 0;
      if (p.w) pp.wins++;
      if (p.l) pp.losses++;
      if (p.sv) pp.saves++;
    }
  }
  return players;
}

// Score a hitter for the month using the spec formula:
//   OPS * 100 + HR * 6 + RBI * 2 + R * 1.5 + SB * 1.5 + AVG * 40
// Eligibility: 50+ PA, OR 35+ PA with elite production (OPS >= 0.900)
function scoreHitter(p) {
  const pa = p.ab + p.bb;
  if (pa < 35) return -1;

  const avg = p.ab > 0 ? p.h / p.ab : 0;
  const singles = Math.max(0, p.h - p.doubles - p.triples - p.hr);
  const obp = pa > 0 ? (p.h + p.bb) / pa : 0;
  const slg = p.ab > 0 ? (singles + 2 * p.doubles + 3 * p.triples + 4 * p.hr) / p.ab : 0;
  const ops = obp + slg;

  // Playing-time penalty: scale down between 35-49 PA
  let penaltyMult = 1.0;
  if (pa < 50) {
    penaltyMult = 0.5 + ((pa - 35) / 15) * 0.5;
  }

  let score =
    ops * 100 +
    p.hr * 6 +
    p.rbi * 2 +
    p.r * 1.5 +
    p.sb * 1.5 +
    avg * 40;

  score *= penaltyMult;

  // Elite production check for 35-49 PA
  if (pa < 50 && ops < 0.900) return -1;

  return score;
}

// Score a pitcher for the month.
// Starters: (50 - ERA*8) + (25 - WHIP*10) + W*8 + K*1 + IP*0.8
// Relievers: (50 - ERA*8) + (25 - WHIP*10) + SV*8 + W*4 + K*1.2 + IP*0.6
// Eligibility: starters 20+ IP; relievers 8+ IP OR 5+ saves
function scorePitcher(p) {
  const ip = p.outs / 3;
  const era = ip > 0 ? (p.er * 9) / ip : 99;
  const whip = ip > 0 ? (p.h + p.bb) / ip : 99;

  const isStarter = p.starts > 0;
  if (isStarter && ip < 20) return -1;
  if (!isStarter && ip < 8 && p.saves < 5) return -1;

  let score;
  if (isStarter) {
    score = (50 - era * 8) +
      (25 - whip * 10) +
      p.wins * 8 +
      p.so * 1 +
      ip * 0.8;
  } else {
    score = (50 - era * 8) +
      (25 - whip * 10) +
      p.saves * 8 +
      p.wins * 4 +
      p.so * 1.2 +
      ip * 0.6;
  }

  return score;
}

function buildHitterBlurb(p, monthName) {
  const avg = p.ab > 0 ? (p.h / p.ab).toFixed(3) : '.000';
  const singles = Math.max(0, p.h - p.doubles - p.triples - p.hr);
  const obp = (p.ab + p.bb) > 0 ? ((p.h + p.bb) / (p.ab + p.bb)).toFixed(3) : '.000';
  const slg = p.ab > 0 ? ((singles + 2 * p.doubles + 3 * p.triples + 4 * p.hr) / p.ab).toFixed(3) : '.000';
  const ops = (parseFloat(obp) + parseFloat(slg)).toFixed(3);

  const parts = [`${avg} AVG`, `${p.hr} HR`, `${p.rbi} RBI`, `${p.r} R`];
  if (p.sb > 0) parts.push(`${p.sb} SB`);

  const blurb = `${last(p.name)} hit ${avg} with ${p.hr} home run${p.hr !== 1 ? 's' : ''} and ${p.rbi} RBI in ${monthName}.`;
  return { statLine: parts.join(', '), blurb, role: 'Hitter' };
}

function buildPitcherBlurb(p, monthName) {
  const ip = p.outs / 3;
  const era = ip > 0 ? ((p.er * 9) / ip).toFixed(2) : '0.00';
  const whip = ip > 0 ? ((p.h + p.bb) / ip).toFixed(2) : '0.00';
  const innStr = Math.floor(ip) + (p.outs % 3 > 0 ? `.${p.outs % 3}` : '.0');
  const isStarter = p.starts > 0;
  const role = isStarter ? 'Starter' : 'Reliever';

  const parts = [`${p.wins}-${p.losses}`, `${era} ERA`, `${whip} WHIP`, `${innStr} IP`, `${p.so} K`];
  if (p.saves > 0) parts.push(`${p.saves} SV`);

  const blurb = `${last(p.name)} posted a ${era} ERA with ${p.so} strikeouts across ${innStr} innings of ${isStarter ? 'starting' : 'relief'} work in ${monthName}.`;
  return { statLine: parts.join(', '), blurb, role };
}

// Main entry: calculate monthly awards for a given year/month.
// allGameResults = all GameResult entities for the season (will be filtered by month)
export function calculateMonthlyAwards(allGameResults, year, month) {
  const monthResults = filterByMonth(allGameResults, year, month);
  if (monthResults.length === 0) return null;

  const monthName = getMonthName(month);
  const batters = aggregateBatting(monthResults);
  const pitchers = aggregatePitching(monthResults);

  const awards = [];
  const leagues = ['AL', 'NL'];

  for (const league of leagues) {
    // Best hitter in league
    const leagueBatters = Object.values(batters).filter(p => p.league === league);
    leagueBatters.forEach(p => { p._score = scoreHitter(p); });
    leagueBatters.sort((a, b) => b._score - a._score);

    const topBatter = leagueBatters[0];
    if (topBatter && topBatter._score > 0) {
      const { statLine, blurb, role } = buildHitterBlurb(topBatter, monthName);
      awards.push({
        league, type: 'PlayerOfTheMonth', month, monthName,
        playerName: topBatter.name, teamKey: topBatter.teamKey,
        playerId: topBatter.playerId, statLine, blurb, role,
        score: topBatter._score,
      });
    }

    // Best pitcher in league
    const leaguePitchers = Object.values(pitchers).filter(p => p.league === league);
    leaguePitchers.forEach(p => { p._score = scorePitcher(p); });
    leaguePitchers.sort((a, b) => b._score - a._score);

    const topPitcher = leaguePitchers[0];
    if (topPitcher && topPitcher._score > 0) {
      const { statLine, blurb, role } = buildPitcherBlurb(topPitcher, monthName);
      awards.push({
        league, type: 'PitcherOfTheMonth', month, monthName,
        playerName: topPitcher.name, teamKey: topPitcher.teamKey,
        playerId: topPitcher.playerId, statLine, blurb, role,
        score: topPitcher._score,
      });
    }
  }

  return { year, month, monthName, awards };
}