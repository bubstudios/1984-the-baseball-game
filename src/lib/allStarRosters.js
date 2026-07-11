// allStarRosters.js - All-Star roster generation + scoring logic.
// Generates 30-player rosters (20 position players + 10 pitchers) for AL and NL.
// Guarantees every MLB team has at least one representative.
// Stores lightweight roster data (name + teamKey + pos); full player objects
// are looked up from TEAMS at game-launch time by allStarTeams.js.

import { base44 } from '@/api/base44Client';
import { TEAMS } from './gameData';
import { LEAGUES, getLeague } from './seasonSchedule';

// ── Position normalization ──
// Maps multi-position strings to a single primary position group.
function normalizePos(pos) {
  if (!pos) return 'UTIL';
  const p = pos.toUpperCase();
  if (p.startsWith('C')) return 'C';
  if (p.includes('1B')) return '1B';
  if (p.includes('2B')) return '2B';
  if (p.includes('3B')) return '3B';
  if (p.includes('SS')) return 'SS';
  if (['LF', 'CF', 'RF', 'OF'].some(o => p.includes(o))) return 'OF';
  if (p.includes('DH')) return 'DH';
  return 'UTIL';
}

// ── Look up a player's full object from TEAMS by teamKey + name ──
function lookupPlayer(teamKey, name) {
  const td = TEAMS[teamKey];
  if (!td) return null;
  const pool = [...(td.lineup || []), ...(td.bench || []), ...(td.rotation || []), ...(td.bullpen || [])];
  return pool.find(p => p.name === name) || null;
}

// ── Scoring functions ──

function scoreHitter(stats) {
  const ab = stats.atBats || 0;
  if (ab < 15) return -1; // minimum plate appearance threshold
  const avg = stats.battingAverage || 0;
  const hr = stats.homeRuns || 0;
  const rbi = stats.rbi || 0;
  const r = stats.runs || 0;
  const h = stats.hits || 0;
  const doubles = stats.doubles || 0;
  const triples = stats.triples || 0;
  const sb = stats.stolenBases || 0;
  const bb = stats.walks || 0;
  // Defense bonus from TEAMS ratings
  const player = lookupPlayer(stats.team, stats.playerName);
  const def = player ? ((player.defense || 0) + (player.arm || 0)) : 0;
  return (avg * 1000) + hr * 5 + rbi * 2 + r * 2 + h + doubles * 1.5 + triples * 2.5 + sb * 2 + bb + def * 2;
}

function scoreStarter(stats) {
  const ip = stats.inningsPitched || 0;
  const gs = stats.pitchingGamesStarted || 0;
  if (ip < 20 || gs < 3) return -1; // starter threshold
  const era = stats.era || 99;
  const whip = stats.whip || 99;
  const w = stats.wins || 0;
  const so = stats.pitchingStrikeouts || 0;
  const eraBonus = Math.max(0, (4.00 - era) * 15);
  const whipBonus = Math.max(0, (1.40 - whip) * 30);
  return ip + w * 8 + so + eraBonus + whipBonus;
}

function scoreReliever(stats) {
  const ip = stats.inningsPitched || 0;
  const g = stats.pitchingGames || 0;
  if (ip < 10 || g < 8) return -1; // reliever threshold
  const era = stats.era || 99;
  const whip = stats.whip || 99;
  const sv = stats.saves || 0;
  const so = stats.pitchingStrikeouts || 0;
  const eraBonus = Math.max(0, (3.50 - era) * 15);
  const whipBonus = Math.max(0, (1.30 - whip) * 30);
  return sv * 7 + g + so + eraBonus + whipBonus;
}

// ── Main roster generation entry point ──
// Returns { AL, NL, stadium, stadiumTeamKey, homeLeague } or null on failure.
export async function generateAllStarRosters(seasonId) {
  if (!seasonId) return null;
  const stats = await base44.entities.PlayerStats.filter({ seasonId }, null, 1500);
  if (!stats || stats.length === 0) return null;

  const alRoster = buildLeagueRoster(stats, 'AL');
  const nlRoster = buildLeagueRoster(stats, 'NL');

  if (!alRoster || !nlRoster) return null;

  // Pick a random stadium from all 26 MLB teams
  const allTeamKeys = Object.keys(TEAMS);
  const stadiumTeamKey = allTeamKeys[Math.floor(Math.random() * allTeamKeys.length)];
  const stadium = TEAMS[stadiumTeamKey]?.stadium || 'All-Star Stadium';
  const homeLeague = getLeague(stadiumTeamKey);

  return {
    AL: alRoster,
    NL: nlRoster,
    stadium,
    stadiumTeamKey,
    homeLeague,
  };
}

// ── Build a single league's roster ──
function buildLeagueRoster(allStats, league) {
  const leagueTeams = LEAGUES[league];
  if (!leagueTeams) return null;

  // Filter stats to this league's teams
  const leagueStats = allStats.filter(s => leagueTeams.includes(s.team));
  if (leagueStats.length === 0) return null;

  // Separate into hitters and pitchers, scoring each
  const hitters = [];
  const starters = [];
  const relievers = [];

  for (const s of leagueStats) {
    const player = lookupPlayer(s.team, s.playerName);
    if (!player) continue;
    const pos = player.pos || '';
    const isPitcher = ['SP', 'RP', 'CL'].includes(pos);

    if (!isPitcher) {
      const hScore = scoreHitter(s);
      if (hScore > 0) {
        hitters.push({
          name: s.playerName,
          teamKey: s.team,
          pos: normalizePos(pos),
          rawPos: pos,
          score: hScore,
          stats: { ab: s.atBats, h: s.hits, hr: s.homeRuns, rbi: s.rbi, avg: s.battingAverage, sb: s.stolenBases },
        });
      }
    } else {
      const sScore = scoreStarter(s);
      const rScore = scoreReliever(s);
      if (pos === 'SP' && sScore > 0) {
        starters.push({
          name: s.playerName, teamKey: s.team, pos: 'SP', score: sScore,
          stats: { ip: s.inningsPitched, w: s.wins, so: s.pitchingStrikeouts, era: s.era, whip: s.whip },
        });
      } else if (rScore > 0) {
        relievers.push({
          name: s.playerName, teamKey: s.team, pos: pos === 'SP' ? 'RP' : pos, score: rScore,
          stats: { ip: s.inningsPitched, sv: s.saves, so: s.pitchingStrikeouts, era: s.era, whip: s.whip, g: s.pitchingGames },
        });
      } else if (sScore > 0) {
        // SP who doesn't meet reliever threshold but meets starter threshold
        starters.push({
          name: s.playerName, teamKey: s.team, pos: 'SP', score: sScore,
          stats: { ip: s.inningsPitched, w: s.wins, so: s.pitchingStrikeouts, era: s.era, whip: s.whip },
        });
      }
    }
  }

  // Sort by score descending
  hitters.sort((a, b) => b.score - a.score);
  starters.sort((a, b) => b.score - a.score);
  relievers.sort((a, b) => b.score - a.score);

  // ── Step 1: Guarantee one representative per team ──
  const selected = new Set();
  const guaranteedHitters = [];
  const guaranteedStarters = [];
  const guaranteedRelievers = [];

  for (const teamKey of leagueTeams) {
    // Find the best player from this team (hitter or pitcher)
    const teamHitters = hitters.filter(h => h.teamKey === teamKey);
    const teamStarters = starters.filter(p => p.teamKey === teamKey);
    const teamRelievers = relievers.filter(p => p.teamKey === teamKey);

    const bestHitter = teamHitters[0];
    const bestStarter = teamStarters[0];
    const bestReliever = teamRelievers[0];

    // Compare scores across categories
    const candidates = [
      bestHitter, bestStarter, bestReliever,
    ].filter(Boolean).sort((a, b) => b.score - a.score);

    if (candidates.length === 0) continue;
    const best = candidates[0];
    selected.add(best.name);
    if (best === bestHitter) guaranteedHitters.push(best);
    else if (best === bestStarter) guaranteedStarters.push(best);
    else guaranteedRelievers.push(best);
  }

  // ── Step 2: Fill remaining roster spots ──
  // Target: 20 position players, 10 pitchers (6 SP + 4 RP)
  let hitterSlots = 20 - guaranteedHitters.length;
  let starterSlots = 6 - guaranteedStarters.length;
  let relieverSlots = 4 - guaranteedRelievers.length;

  // Clamp negative slots (too many guaranteed at one position)
  const overflow = Math.max(0, -hitterSlots) + Math.max(0, -starterSlots) + Math.max(0, -relieverSlots);
  hitterSlots = Math.max(0, hitterSlots);
  starterSlots = Math.max(0, starterSlots);
  relieverSlots = Math.max(0, relieverSlots);

  // Fill starters
  const filledStarters = [...guaranteedStarters];
  for (const p of starters) {
    if (filledStarters.length >= 6) break;
    if (selected.has(p.name)) continue;
    filledStarters.push(p);
    selected.add(p.name);
  }

  // Fill relievers
  const filledRelievers = [...guaranteedRelievers];
  for (const p of relievers) {
    if (filledRelievers.length >= 4) break;
    if (selected.has(p.name)) continue;
    filledRelievers.push(p);
    selected.add(p.name);
  }

  // Fill hitters with position balance
  const filledHitters = [...guaranteedHitters];
  const posCounts = {};
  for (const h of filledHitters) {
    posCounts[h.pos] = (posCounts[h.pos] || 0) + 1;
  }

  // Position minimums: 2C, 2(1B), 2(2B), 2(3B), 2(SS), 6OF
  const posMinimums = { C: 2, '1B': 2, '2B': 2, '3B': 2, SS: 2, OF: 6 };

  // First pass: fill position minimums
  for (const [pos, min] of Object.entries(posMinimums)) {
    while ((posCounts[pos] || 0) < min && filledHitters.length < 20) {
      const next = hitters.find(h => !selected.has(h.name) && h.pos === pos);
      if (!next) break;
      filledHitters.push(next);
      selected.add(next.name);
      posCounts[pos] = (posCounts[pos] || 0) + 1;
    }
  }

  // Second pass: fill remaining slots with best available
  for (const h of hitters) {
    if (filledHitters.length >= 20) break;
    if (selected.has(h.name)) continue;
    filledHitters.push(h);
    selected.add(h.name);
    posCounts[h.pos] = (posCounts[h.pos] || 0) + 1;
  }

  // If still under 20 (rare), pad with any remaining
  while (filledHitters.length < 20) {
    const next = hitters.find(h => !selected.has(h.name));
    if (!next) break;
    filledHitters.push(next);
    selected.add(next.name);
  }

  // ── Step 3: Select starting lineup (8 position players + batting order) ──
  const battingOrder = buildStartingLineup(filledHitters);

  // ── Step 4: Bench (remaining position players) ──
  const starterNames = new Set(battingOrder.map(p => p.name));
  const bench = filledHitters.filter(h => !starterNames.has(h.name));

  // ── Step 5: Starting pitcher (highest-scored SP) ──
  const startingPitcher = filledStarters[0] || null;

  return {
    battingOrder: battingOrder.map(stripScore),
    bench: bench.map(stripScore),
    pitchers: {
      starters: filledStarters.map(stripScore),
      relievers: filledRelievers.map(stripScore),
      startingPitcherName: startingPitcher?.name || null,
    },
  };
}

// Strip score/stats from the final roster entry (lightweight storage)
function stripScore(p) {
  return { name: p.name, teamKey: p.teamKey, pos: p.pos };
}

// ── Build the starting lineup (8 position players) with intelligent batting order ──
// Order: 1. Speed/contact, 2. Contact/OBP, 3. Best overall, 4. Best power,
//        5. Second-best power/RBI, 6. Next best, 7. Catcher/lower, 8. Weakest, 9. Pitcher
function buildStartingLineup(hitters) {
  // Pick one starter per position: C, 1B, 2B, 3B, SS, then 3 OF
  const byPos = {};
  for (const h of hitters) {
    if (!byPos[h.pos]) byPos[h.pos] = [];
    byPos[h.pos].push(h);
  }
  byPos['C'] = (byPos['C'] || []).sort((a, b) => b.score - a.score);
  byPos['1B'] = (byPos['1B'] || []).sort((a, b) => b.score - a.score);
  byPos['2B'] = (byPos['2B'] || []).sort((a, b) => b.score - a.score);
  byPos['3B'] = (byPos['3B'] || []).sort((a, b) => b.score - a.score);
  byPos['SS'] = (byPos['SS'] || []).sort((a, b) => b.score - a.score);
  byPos['OF'] = (byPos['OF'] || []).sort((a, b) => b.score - a.score);

  const used = new Set();
  const pick = (pos) => {
    const pool = byPos[pos] || [];
    const found = pool.find(h => !used.has(h.name));
    if (found) { used.add(found.name); return found; }
    // Fallback: pick from UTIL/DH
    const util = (byPos['UTIL'] || byPos['DH'] || []).find(h => !used.has(h.name));
    if (util) { used.add(util.name); return util; }
    return null;
  };

  const c = pick('C');
  const first = pick('1B');
  const second = pick('2B');
  const third = pick('3B');
  const ss = pick('SS');
  const of1 = pick('OF');
  const of2 = pick('OF');
  const of3 = pick('OF');

  const starters = [c, first, second, third, ss, of1, of2, of3].filter(Boolean);
  // Assign OF positions: LF, CF, RF (by speed: fastest = CF)
  const ofStarters = [of1, of2, of3].filter(Boolean);
  ofStarters.sort((a, b) => {
    const pa = lookupPlayer(a.teamKey, a.name);
    const pb = lookupPlayer(b.teamKey, b.name);
    return (pb?.speed || 0) - (pa?.speed || 0);
  });
  if (ofStarters[0]) ofStarters[0].pos = 'CF';
  if (ofStarters[1]) ofStarters[1].pos = 'RF';
  if (ofStarters[2]) ofStarters[2].pos = 'LF';

  // Build batting order from the 8 starters
  // Look up full player data for ratings
  const withRatings = starters.map(s => {
    const p = lookupPlayer(s.teamKey, s.name);
    return { ...s, contact: p?.contact || 0, power: p?.power || 0, speed: p?.speed || 0, defense: p?.defense || 0 };
  });

  // Sort by score for ordering reference
  const sorted = [...withRatings].sort((a, b) => b.score - a.score);

  // Assign to batting order slots
  const order = new Array(8).fill(null);
  const remaining = [...withRatings];

  // Slot 1: best speed+contact
  remaining.sort((a, b) => (b.speed + b.contact) - (a.speed + a.contact));
  order[0] = remaining.shift();

  // Slot 2: best contact
  remaining.sort((a, b) => b.contact - a.contact);
  order[1] = remaining.shift();

  // Slot 3: best overall score
  remaining.sort((a, b) => b.score - a.score);
  order[2] = remaining.shift();

  // Slot 4: best power
  remaining.sort((a, b) => b.power - a.power);
  order[3] = remaining.shift();

  // Slot 5: second-best power (or RBI proxy = score)
  remaining.sort((a, b) => b.power - a.power);
  order[4] = remaining.shift();

  // Slots 6-8: next best by score
  remaining.sort((a, b) => b.score - a.score);
  order[5] = remaining.shift();
  order[6] = remaining.shift();
  order[7] = remaining.shift();

  return order.filter(Boolean);
}