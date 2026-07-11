// weeklyAwards.js - Calculates AL/NL Player and Pitcher of the Week.
// Presentation layer only - does NOT change player ratings.

import { TEAMS } from './gameData';

function leagueOf(key) { return TEAMS[key]?.league || 'NL'; }
function last(fullName) {
  if (!fullName) return '?';
  const p = fullName.trim().split(' ');
  return p.length > 1 ? p[p.length - 1] : fullName;
}

// Aggregate batting stats across a set of completed GameResults.
function aggregateBatting(gameResults) {
  const players = {}; // playerId -> { name, teamKey, league, ab, h, 2b, 3b, hr, rbi, r, bb, so, sb, games }

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

// Aggregate pitching stats across a set of completed GameResults.
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

// Score a hitter for the week.
function scoreHitter(p) {
  const pa = p.ab + p.bb;
  if (pa < 10) return -1; // Eligibility: min ~10-12 PA

  const avg = p.ab > 0 ? p.h / p.ab : 0;
  const ops = p.ab > 0 ? (p.h + p.bb) / p.ab : 0; // simplified OBP+SLG proxy

  let score =
    p.h * 1.0 +
    p.doubles * 1.5 +
    p.triples * 2.0 +
    p.hr * 4.0 +
    p.rbi * 1.5 +
    p.r * 1.0 +
    p.bb * 0.8 +
    p.sb * 1.5 -
    p.so * 0.25;

  // Bonuses
  if (p.hr >= 2) score += 3;
  if (p.h >= 5) score += 3;
  if (p.sb >= 3) score += 2;

  return score;
}

// Score a pitcher for the week (starters and relievers combined, one winner).
function scorePitcher(p) {
  const ip = p.outs / 3;

  // Eligibility: starters need 1+ start and 6+ IP; relievers need 2+ appearances or 1+ save
  if (p.starts > 0 && ip < 6) return -1;
  if (p.starts === 0 && p.games < 2 && p.saves < 1) return -1;

  const era = ip > 0 ? (p.er * 9) / ip : 99;

  let score;
  if (p.starts > 0) {
    // Starter scoring
    score = ip * 2.0 +
      p.so * 0.75 +
      p.wins * 6 +
      (p.outs >= 27 ? 5 : 0) + // CG
      (p.outs >= 27 && p.er === 0 ? 8 : 0) + // SHO
      p.saves * 3 + // rare starter save
      p.losses * -3;
  } else {
    // Reliever scoring
    score = p.saves * 6 +
      p.wins * 3 +
      ip * 1.5 +
      p.so * 0.75 +
      p.losses * -3;
  }

  // Common adjustments
  score -= p.er * 3;
  score -= p.bb * 0.75;
  score -= p.h * 0.5;

  return score;
}

function buildHitterBlurb(p) {
  const avg = p.ab > 0 ? (p.h / p.ab).toFixed(3) : '.000';
  const parts = [`${avg} AVG`, `${p.hr} HR`, `${p.rbi} RBI`];
  if (p.sb > 0) parts.push(`${p.sb} SB`);
  const blurb = `${last(p.name)} hit ${avg} with ${p.hr} home run${p.hr !== 1 ? 's' : ''} and ${p.rbi} RBI${p.sb > 0 ? ` while stealing ${p.sb} base${p.sb !== 1 ? 's' : ''}` : ''} during the week.`;
  return { statLine: parts.join(', '), blurb };
}

function buildPitcherBlurb(p) {
  const ip = p.outs / 3;
  const era = ip > 0 ? ((p.er * 9) / ip).toFixed(2) : '0.00';
  const innStr = Math.floor(ip) + (p.outs % 3 > 0 ? `.${p.outs % 3}` : '.0');
  const parts = [`${p.wins}-${p.losses}`, `${era} ERA`, `${innStr} IP`, `${p.so} K`];
  if (p.saves > 0) parts.push(`${p.saves} SV`);
  const role = p.starts > 0 ? 'start' : 'relief';
  const blurb = `${last(p.name)} posted a ${era} ERA with ${p.so} strikeouts across ${innStr} innings of ${role} during the week.`;
  return { statLine: parts.join(', '), blurb };
}

// Calculate weekly awards for a 7-day block.
// dayRange = { start: dayNum, end: dayNum }
// gameResults = all GameResults with gameDay in [start, end]
export function calculateWeeklyAwards(gameResults, weekNumber, dayRange) {
  const batters = aggregateBatting(gameResults);
  const pitchers = aggregatePitching(gameResults);

  const awards = [];
  const leagues = ['AL', 'NL'];

  for (const league of leagues) {
    // Best hitter in league
    const leagueBatters = Object.values(batters).filter(p => p.league === league);
    leagueBatters.forEach(p => { p._score = scoreHitter(p); });
    leagueBatters.sort((a, b) => b._score - a._score);

    const topBatter = leagueBatters[0];
    if (topBatter && topBatter._score > 0) {
      const { statLine, blurb } = buildHitterBlurb(topBatter);
      awards.push({
        league, type: 'PlayerOfTheWeek', weekNumber,
        playerName: topBatter.name, teamKey: topBatter.teamKey,
        playerId: topBatter.playerId,
        statLine, blurb, score: topBatter._score,
      });
    }

    // Best pitcher in league
    const leaguePitchers = Object.values(pitchers).filter(p => p.league === league);
    leaguePitchers.forEach(p => { p._score = scorePitcher(p); });
    leaguePitchers.sort((a, b) => b._score - a._score);

    const topPitcher = leaguePitchers[0];
    if (topPitcher && topPitcher._score > 0) {
      const { statLine, blurb } = buildPitcherBlurb(topPitcher);
      awards.push({
        league, type: 'PitcherOfTheWeek', weekNumber,
        playerName: topPitcher.name, teamKey: topPitcher.teamKey,
        playerId: topPitcher.playerId,
        statLine, blurb, score: topPitcher._score,
      });
    }
  }

  return {
    weekNumber,
    dayRange,
    awards,
  };
}