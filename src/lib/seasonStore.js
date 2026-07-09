// Season Stats Store - the single source of truth for all season data.
// Stores raw counting stats only; rate stats (AVG/ERA/etc) are computed on read.
// Pitching IP stored as integer outs; display via formatIP().

import { TEAMS } from './gameData';
import { base44 } from '@/api/base44Client';
import { DIVISIONS, getLeague } from './seasonSchedule';

// ── Player ID helper ──
export function playerId(teamKey, name) {
  return `${teamKey}|${name}`;
}

// ── Create fresh season state with pre-seeded accumulators ──
export function createSeasonState(userTeam) {
  const { batting, pitching } = preSeedAccumulators();
  const standings = {};
  for (const teamKey of Object.keys(TEAMS)) {
    standings[teamKey] = { w: 0, l: 0, rf: 0, ra: 0, streakType: null, streakLen: 0, last10: [] };
  }
  return {
    year: 1984,
    userTeam,
    userLeague: getLeague(userTeam),
    currentDay: 0,
    phase: 'regular',
    schedule: [],
    standings,
    batting,
    pitching,
    monthly: {},
    lastDayEvents: [],
    awards: { potm: {}, pom: {}, mvp: {}, cyYoung: {}, fireman: {}, allStarMVP: null, postseasonMVP: {} },
    postseason: null,
    achievements: [],
  };
}

function preSeedAccumulators() {
  const batting = {};
  const pitching = {};
  for (const [teamKey, teamData] of Object.entries(TEAMS)) {
    const allPlayers = [
      ...teamData.lineup,
      ...(teamData.bench || []),
      ...teamData.rotation,
      ...(teamData.bullpen || []),
    ];
    for (const p of allPlayers) {
      const pid = playerId(teamKey, p.name);
      batting[pid] = {
        teamKey, name: p.name, pos: p.pos,
        g: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0,
        bb: 0, so: 0, sb: 0, hbp: 0, sf: 0,
      };
      if (['SP', 'RP', 'CL'].includes(p.pos)) {
        pitching[pid] = {
          teamKey, name: p.name, pos: p.pos,
          g: 0, gs: 0, w: 0, l: 0, sv: 0, hld: 0,
          outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, bf: 0,
        };
      }
    }
  }
  return { batting, pitching };
}

// ── Apply a GameResult to the season state (mutates in place) ──
export function applyGameResult(seasonState, result, gameDate) {
  const homeWon = result.homeScore > result.awayScore;
  const winner = homeWon ? result.homeTeam : result.awayTeam;
  const loser = homeWon ? result.awayTeam : result.homeTeam;
  const winnerScore = homeWon ? result.homeScore : result.awayScore;
  const loserScore = homeWon ? result.awayScore : result.homeScore;

  // Standings
  const ws = seasonState.standings[winner];
  const ls = seasonState.standings[loser];
  if (ws && ls) {
    ws.w++; ls.l++;
    ws.rf += winnerScore; ws.ra += loserScore;
    ls.rf += loserScore; ls.ra += winnerScore;
    ws.last10.push('W'); ls.last10.push('L');
    if (ws.last10.length > 10) ws.last10.shift();
    if (ls.last10.length > 10) ls.last10.shift();
    if (ws.streakType === 'W') ws.streakLen++; else { ws.streakType = 'W'; ws.streakLen = 1; }
    if (ls.streakType === 'L') ls.streakLen++; else { ls.streakType = 'L'; ls.streakLen = 1; }
  }

  // Batting accumulators
  for (const bat of result.batting) {
    let acc = seasonState.batting[bat.playerId];
    if (!acc) {
      acc = { teamKey: bat.teamKey, name: bat.name, pos: '?', g: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0, hbp: 0, sf: 0 };
      seasonState.batting[bat.playerId] = acc;
    }
    acc.g++; acc.ab += bat.ab; acc.h += bat.h;
    acc.doubles += bat.doubles || 0; acc.triples += bat.triples || 0;
    acc.hr += bat.hr; acc.rbi += bat.rbi; acc.r += bat.r;
    acc.bb += bat.bb; acc.so += bat.so; acc.sb += bat.sb;
  }

  // Pitching accumulators
  for (const pitch of result.pitching) {
    let acc = seasonState.pitching[pitch.playerId];
    if (!acc) {
      acc = { teamKey: pitch.teamKey, name: pitch.name, pos: '?', g: 0, gs: 0, w: 0, l: 0, sv: 0, hld: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, bf: 0 };
      seasonState.pitching[pitch.playerId] = acc;
    }
    acc.g++;
    if (pitch.gs) acc.gs++;
    acc.outs += pitch.outs || 0;
    acc.h += pitch.h || 0; acc.r += pitch.r || 0; acc.er += pitch.er || 0;
    acc.bb += pitch.bb || 0; acc.so += pitch.so || 0;
    acc.hr += pitch.hr || 0; acc.bf += pitch.bf || 0;
    if (pitch.w) acc.w++;
    if (pitch.l) acc.l++;
    if (pitch.sv) acc.sv++;
  }

  // Monthly buckets
  const month = getMonthFromDate(gameDate);
  if (month) {
    const mbKey = `batting|${month}`;
    const mpKey = `pitching|${month}`;
    if (!seasonState.monthly[mbKey]) seasonState.monthly[mbKey] = {};
    if (!seasonState.monthly[mpKey]) seasonState.monthly[mpKey] = {};
    applyToMonthlyBucket(seasonState.monthly[mbKey], result.batting);
    applyToMonthlyBucket(seasonState.monthly[mpKey], result.pitching);
  }
}

function applyToMonthlyBucket(bucket, entries) {
  for (const entry of entries) {
    if (!bucket[entry.playerId]) {
      bucket[entry.playerId] = entry.teamKey
        ? { teamKey: entry.teamKey, name: entry.name, pos: '?', g: 0, ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0, hbp: 0, sf: 0 }
        : { teamKey: entry.teamKey, name: entry.name, pos: '?', g: 0, gs: 0, w: 0, l: 0, sv: 0, hld: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, bf: 0 };
    }
    const m = bucket[entry.playerId];
    m.g++;
    if ('ab' in entry) {
      m.ab += entry.ab; m.h += entry.h;
      m.doubles += entry.doubles || 0; m.triples += entry.triples || 0;
      m.hr += entry.hr; m.rbi += entry.rbi; m.r += entry.r;
      m.bb += entry.bb; m.so += entry.so; m.sb += entry.sb;
    } else {
      if (entry.gs) m.gs++;
      m.outs += entry.outs || 0; m.h += entry.h || 0; m.r += entry.r || 0;
      m.er += entry.er || 0; m.bb += entry.bb || 0; m.so += entry.so || 0;
      m.hr += entry.hr || 0; m.bf += entry.bf || 0;
      if (entry.w) m.w++; if (entry.l) m.l++; if (entry.sv) m.sv++;
    }
  }
}

function getMonthFromDate(dateStr) {
  if (!dateStr) return null;
  const month = parseInt(dateStr.split('-')[1]);
  const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month] || null;
}

// ── Rate stat computers (computed on read, never stored) ──
export function computeBattingRateStats(player) {
  const ab = player.ab || 0;
  const h = player.h || 0;
  const bb = player.bb || 0;
  const hbp = player.hbp || 0;
  const sf = player.sf || 0;
  const doubles = player.doubles || 0;
  const triples = player.triples || 0;
  const hr = player.hr || 0;
  const singles = Math.max(0, h - doubles - triples - hr);
  const pa = ab + bb + hbp + sf;
  const avg = ab > 0 ? h / ab : 0;
  const obp = pa > 0 ? (h + bb + hbp) / pa : 0;
  const slg = ab > 0 ? (singles + 2 * doubles + 3 * triples + 4 * hr) / ab : 0;
  return { avg, obp, slg, ops: obp + slg, pa, singles };
}

export function computePitchingRateStats(player) {
  const outs = player.outs || 0;
  const er = player.er || 0;
  const h = player.h || 0;
  const bb = player.bb || 0;
  const ip = outs / 3;
  const era = ip > 0 ? (er * 9) / ip : 0;
  const whip = ip > 0 ? (h + bb) / ip : 0;
  return { era, whip, ip };
}

export function formatIP(outs) {
  const innings = Math.floor(outs / 3);
  const remainder = outs % 3;
  return `${innings}.${remainder}`;
}

// ── Persistence (localStorage) ──
const STORAGE_KEY = 'seasonState_1984';

export function saveSeasonState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save season state:', e);
  }
}

export function loadSeasonState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load season state:', e);
    return null;
  }
}

export function clearSeasonState() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Standings computation (grouped by division, with GB) ──
export function getStandings(seasonState) {
  const result = {};
  for (const [divName, teams] of Object.entries(DIVISIONS)) {
    const sorted = teams.map(t => {
      const s = seasonState.standings[t] || { w: 0, l: 0, rf: 0, ra: 0, streakType: null, streakLen: 0, last10: [] };
      const pct = s.w + s.l > 0 ? s.w / (s.w + s.l) : 0;
      return {
        teamKey: t, w: s.w, l: s.l, pct, rf: s.rf, ra: s.ra,
        streakType: s.streakType, streakLen: s.streakLen,
        last10: s.last10 || [],
      };
    }).sort((a, b) => b.pct - a.pct);
    const leader = sorted[0];
    for (const team of sorted) {
      team.gb = leader ? ((leader.w - team.w) + (team.l - leader.l)) / 2 : 0;
    }
    result[divName] = sorted;
  }
  return result;
}

// ── League leaders (with qualification thresholds) ──
export function getLeagueLeaders(seasonState, stat, type, limit = 10) {
  const store = type === 'batting' ? seasonState.batting : seasonState.pitching;
  const players = Object.values(store);
  const teamGames = seasonState.currentDay || 0;

  let qualified;
  if (type === 'batting') {
    const minPA = Math.floor(teamGames * 3.1);
    qualified = players.filter(p => {
      const rates = computeBattingRateStats(p);
      return rates.pa >= minPA && p.ab > 0;
    });
  } else {
    const minIP = teamGames;
    qualified = players.filter(p => (p.outs || 0) / 3 >= minIP);
  }

  const lowerIsBetter = stat === 'era' || stat === 'whip';
  qualified.sort((a, b) => {
    let av, bv;
    if (['avg', 'obp', 'slg', 'ops', 'pa'].includes(stat)) {
      av = computeBattingRateStats(a)[stat]; bv = computeBattingRateStats(b)[stat];
    } else if (['era', 'whip', 'ip'].includes(stat)) {
      av = computePitchingRateStats(a)[stat]; bv = computePitchingRateStats(b)[stat];
    } else {
      av = a[stat] || 0; bv = b[stat] || 0;
    }
    return lowerIsBetter ? av - bv : bv - av;
  });

  return qualified.slice(0, limit).map(p => {
    const rates = type === 'batting' ? computeBattingRateStats(p) : computePitchingRateStats(p);
    return { ...p, ...rates };
  });
}

// ── Rotation logic (day-based rest: 4 full calendar days between starts) ──
// rotationState persists on the Season entity:
// { [teamKey]: { rotation: [name1,name2,name3,name4], rotationIndex, lastStartDateByPitcher: {name: 'YYYY-MM-DD'}, workload: { name: [{date, pitches, outs}] } } }

// Compute calendar days between two ISO date strings
function daysBetween(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return Infinity;
  const d1 = new Date(dateStr1 + 'T00:00:00Z');
  const d2 = new Date(dateStr2 + 'T00:00:00Z');
  return Math.round((d2 - d1) / 86400000);
}

function shiftDate(dateStr, days) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().split('T')[0];
}

function ensureTeamRotationState(rotationState, teamKey) {
  const team = TEAMS[teamKey];
  const rot = team.rotation || [];
  if (!rotationState[teamKey]) {
    rotationState[teamKey] = {
      rotation: rot.map(p => p.name),
      rotationIndex: 0,
      lastStartDateByPitcher: {},
      workload: {},
    };
  }
  const rs = rotationState[teamKey];
  // Migrate old format: lastStartByPitcher (game numbers) -> lastStartDateByPitcher (dates)
  // Old game numbers are incompatible with date-based logic, so clear them
  if (rs.lastStartByPitcher && !rs.lastStartDateByPitcher) {
    rs.lastStartDateByPitcher = {};
    delete rs.lastStartByPitcher;
  }
  if (!rs.rotation) rs.rotation = rot.map(p => p.name);
  if (rs.rotationIndex === undefined) rs.rotationIndex = 0;
  if (!rs.lastStartDateByPitcher) rs.lastStartDateByPitcher = {};
  // Migrate old lastGameRelievers → workload ledger
  if (rs.lastGameRelievers && !rs.workload) {
    rs.workload = {};
    delete rs.lastGameRelievers;
  }
  if (!rs.workload) rs.workload = {};
  return rs;
}

// 1984 starter eligibility: a starter may start with 3+ rest days (4+ calendar days
// since last start). At exactly 3 rest days he is "slightly tired" but still starts
// (see getStarterFatigueStatus). 2 rest days = emergency only. Never-started = eligible.
export function isStarterEligible(rotationState, teamKey, pitcherName, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs) return true;
  const last = rs.lastStartDateByPitcher?.[pitcherName];
  if (last === undefined) return true;
  return daysBetween(last, gameDate) >= 4;
}

// Starter fatigue from season rest: returns { tired, penalty, restDays, reason }.
// 4+ rest days = fresh; 3 = slightly tired; 2 = emergency short-rest; <2 = severe.
// The penalty flows into _seasonFatiguePenalty so getEffectivePitcher applies it.
export function getStarterFatigueStatus(rotationState, teamKey, pitcherName, gameDate) {
  if (!gameDate) return { tired: false, penalty: 0, restDays: Infinity, reason: null };
  const restDays = getRestDays(rotationState, teamKey, pitcherName, gameDate);
  if (restDays === Infinity || restDays >= 4) return { tired: false, penalty: 0, restDays, reason: null };
  if (restDays === 3) return { tired: true, penalty: 8, restDays, reason: '3 days rest' };
  if (restDays === 2) return { tired: true, penalty: 18, restDays, reason: 'short rest (2 days)' };
  return { tired: true, penalty: 25, restDays, reason: `${restDays} day rest` };
}

// Full rest days elapsed since last start (Infinity = never started)
export function getRestDays(rotationState, teamKey, pitcherName, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs) return Infinity;
  const last = rs.lastStartDateByPitcher?.[pitcherName];
  if (last === undefined) return Infinity;
  return Math.max(0, daysBetween(last, gameDate) - 1);
}

// Bullpen day opener: highest-STA reliever excluding closer, subject to unavailability rule.
export function getBullpenDayOpener(rotationState, teamKey, gameDate) {
  const team = TEAMS[teamKey];
  const bullpen = team.bullpen || [];
  const unavailable = new Set(getUnavailableRelievers(rotationState, teamKey, gameDate));

  const candidates = bullpen.filter(p => {
    const pos = p.pos || p.assignedPos || '';
    return pos !== 'CL' && !unavailable.has(p.name);
  });

  if (candidates.length === 0) {
    const fallback = bullpen.filter(p => !unavailable.has(p.name));
    if (fallback.length > 0) return fallback[0];
    // Emergency valve: all arms unavailable - use least-recently-used
    console.error(`[rotation] ${teamKey}: all bullpen arms unavailable on ${gameDate} - using least-recently-used`);
    return getLeastRecentlyUsedArm(rotationState, teamKey, bullpen, gameDate);
  }

  // Prefer fresh relievers; only use tired-but-available ones if no fresh arm exists
  const fresh = candidates.filter(p => {
    const avail = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    return !avail.tired;
  });
  const pool = fresh.length > 0 ? fresh : candidates;

  pool.sort((a, b) => {
    const staDiff = (b.stamina || 0) - (a.stamina || 0);
    if (staDiff !== 0) return staDiff;
    const aTier = (a.pitchSpeed || 0) + (a.offSpeed || 0) + (a.control || 0);
    const bTier = (b.pitchSpeed || 0) + (b.offSpeed || 0) + (b.control || 0);
    return bTier - aTier;
  });

  return pool[0];
}

// Check if the probable starter for a team on this date is a bullpen opener (fallback, not rotation SP)
export function isBullpenDayForTeam(rotationState, teamKey, gameDate) {
  const probable = getProbableStarter(rotationState, teamKey, gameDate);
  if (!probable) return false;
  const rotation = TEAMS[teamKey]?.rotation || [];
  return !rotation.some(p => p.name === probable.name);
}

// True if at least one non-closer reliever is fully available (not tired, not unavailable).
// Used to decide bullpen-day vs short-rest emergency start.
export function hasFreshReliever(rotationState, teamKey, gameDate) {
  const team = TEAMS[teamKey];
  const bullpen = team?.bullpen || [];
  for (const p of bullpen) {
    const pos = p.pos || p.assignedPos || '';
    if (pos === 'CL') continue;
    const avail = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    if (avail.available && !avail.tired) return true;
  }
  return false;
}

// THE single resolver: returns the probable starter object for a team's next game.
// 1984 rules: prefer the rotation SP at the pointer if he has 3+ rest days (tired at
// exactly 3). If he can't go, scan the rest of the rotation for any SP with 3+ rest
// days. Only if NO SP has 3+ rest days do we accept a 2-rest-day emergency start
// (severe penalty). A real starter on short rest is always preferred over a reliever.
// Bullpen day (opener) is used ONLY when no rotation SP can legally start.
export function getProbableStarter(rotationState, teamKey, gameDate) {
  const team = TEAMS[teamKey];
  const rot = team.rotation || [];
  if (rot.length === 0) return getBullpenDayOpener(rotationState, teamKey, gameDate);

  const rs = ensureTeamRotationState(rotationState, teamKey);
  const rotation = rs.rotation;
  const findSP = (name) => rot.find(p => p.name === name) || rot[0];

  // Tier 1: any rotation SP with 3+ rest days who is workload-available.
  // Scans from the pointer so the normal rotation order is preserved.
  for (let offset = 0; offset < rotation.length; offset++) {
    const name = rotation[(rs.rotationIndex + offset) % rotation.length];
    if (!isStarterEligible(rotationState, teamKey, name, gameDate)) continue;
    const avail = isPitcherAvailable(rotationState, teamKey, name, gameDate);
    if (avail.available) return findSP(name);
  }

  // Tier 2: emergency short-rest start (2 rest days) - ONLY when no fresh reliever
  // is available. Per 1984 rest rules: if a rested reliever is available, a bullpen
  // opener is preferred over a short-rest starter. A short-rest SP start is the
  // last resort, used only when the bullpen is also exhausted.
  if (!hasFreshReliever(rotationState, teamKey, gameDate)) {
    for (let offset = 0; offset < rotation.length; offset++) {
      const name = rotation[(rs.rotationIndex + offset) % rotation.length];
      const restDays = getRestDays(rotationState, teamKey, name, gameDate);
      if (restDays < 2) continue;
      const avail = isPitcherAvailable(rotationState, teamKey, name, gameDate);
      if (avail.available) {
        console.warn(`[rotation] ${teamKey}: emergency short-rest start for ${name} (${restDays} days rest) - no fresh relievers available`);
        return findSP(name);
      }
    }
  }

  // No rotation SP can legally start - true bullpen day (very rare).
  console.warn(`[rotation] ${teamKey}: no rotation SP available on ${gameDate} - bullpen day`);
  return getBullpenDayOpener(rotationState, teamKey, gameDate);
}

// Guard: verify a pitcher about to start satisfies rest eligibility.
export function validateStarterGuard(rotationState, teamKey, gameDate, pitcherToUse) {
  if (!rotationState || !teamKey || !gameDate || !pitcherToUse) return pitcherToUse;
  const resolverAnswer = getProbableStarter(rotationState, teamKey, gameDate);
  if (pitcherToUse.name === resolverAnswer?.name) return pitcherToUse;

  const eligible = isStarterEligible(rotationState, teamKey, pitcherToUse.name, gameDate);
  const isPenDay = isBullpenDayForTeam(rotationState, teamKey, gameDate);
  if (!eligible && !isPenDay) {
    console.error(
      `[rotation-guard] ${teamKey} ${gameDate}: init path was about to use "${pitcherToUse.name}" ` +
      `but resolver says "${resolverAnswer?.name}". Short-rest starter blocked - using resolver answer.`
    );
    return resolverAnswer;
  }
  return pitcherToUse;
}

// Call AFTER a game commits to record the start date and advance the rotation pointer.
export function advanceRotation(rotationState, teamKey, starterName, gameDate) {
  const team = TEAMS[teamKey];
  const rot = team.rotation || [];
  if (rot.length === 0) return;
  const rs = ensureTeamRotationState(rotationState, teamKey);
  // Only advance the pointer if this was a rotation SP start (not a bullpen day)
  if (rs.rotation.includes(starterName)) {
    rs.lastStartDateByPitcher[starterName] = gameDate;
    rs.rotationIndex = ((rs.rotationIndex || 0) + 1) % rs.rotation.length;
  }
}

// ── Reliever workload rest (Session 11) ──
// Per-pitcher, per-date workload ledger. Replaces the old "2+ IP yesterday" rule.
// One isPitcherAvailable() function; every consumer calls it.

// Estimate pitches from outs if pitch data unavailable (~5 pitches per out)
function estimatePitches(outs) {
  return outs * 5;
}

// Session 19 Part 1: outs-based rest tiers (start conservative for 1984).
// Replaces pitch-based tiers; outs is the authoritative workload measure.
function getRequiredRestDays(pitches, outs) {
  const o = outs || 0;
  if (o <= 3) return 0;  // <= 1 inning: available next day (short relief)
  if (o <= 6) return 1;  // ~2 innings: down 1 day
  if (o <= 9) return 2;  // ~3 innings: down 2 days
  return 3;               // 3+ innings (long relief): down 3 days
}

// Least-recently-used arm for emergency valve
function getLeastRecentlyUsedArm(rotationState, teamKey, bullpen, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload) return bullpen[0] || null;
  return [...bullpen].sort((a, b) => {
    const aLast = (rs.workload[a.name] || []).slice(-1)[0]?.date || '0000-01-01';
    const bLast = (rs.workload[b.name] || []).slice(-1)[0]?.date || '0000-01-01';
    return aLast.localeCompare(bLast);
  })[0] || bullpen[0] || null;
}

// Record pitcher workload after a game commits. Writes to the same ledger as starts.
export function recordPitcherWorkload(rotationState, teamKey, pitchingLine, gameDate) {
  if (!gameDate) return;
  const rs = ensureTeamRotationState(rotationState, teamKey);
  for (const p of pitchingLine) {
    if (!p.name) continue;
    const pitches = p.pitches || estimatePitches(p.outs || 0);
    if (pitches === 0 && !p.outs) continue;
    if (!rs.workload[p.name]) rs.workload[p.name] = [];
    // Idempotent: remove existing entry for this date
    rs.workload[p.name] = rs.workload[p.name].filter(e => e.date !== gameDate);
    rs.workload[p.name].push({ date: gameDate, pitches, outs: p.outs || 0 });
    // Keep last 10 entries
    if (rs.workload[p.name].length > 10) {
      rs.workload[p.name] = rs.workload[p.name].slice(-10);
    }
  }
}

// THE ONE shared availability function. Used by BOTH CPU and human bullpen paths.
// Returns { available, reason, tired, fatiguePenalty }.
// 1984 reliever rest tiers (by yesterday's pitch count):
//   40+ pitches yesterday → unavailable
//   30-39 pitches yesterday → available but tired, avoid if possible (penalty 20)
//   20-29 pitches yesterday → available but slightly reduced (penalty 10)
//   0-19 pitches yesterday  → available (fresh)
// Back-to-back with heavy workload → unavailable; light back-to-back → tired.
// 3 appearances in 3 days → unavailable. Multi-day outs-based rest still applies.
export function isPitcherAvailable(rotationState, teamKey, pitcherName, gameDate) {
  if (!gameDate) return { available: true, reason: null, tired: false, fatiguePenalty: 0 };
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload || !rs.workload[pitcherName]) {
    return { available: true, reason: null, tired: false, fatiguePenalty: 0 };
  }
  const history = rs.workload[pitcherName];
  if (!history || history.length === 0) {
    return { available: true, reason: null, tired: false, fatiguePenalty: 0 };
  }

  const dayBefore = shiftDate(gameDate, -1);
  const twoDaysBefore = shiftDate(gameDate, -2);
  const threeDaysBefore = shiftDate(gameDate, -3);
  const appearedYesterday = history.find(e => e.date === dayBefore);
  const appearedDayBefore = history.find(e => e.date === twoDaysBefore);
  const appeared3DaysAgo = history.find(e => e.date === threeDaysBefore);
  const appearancesLast3Days = [appearedYesterday, appearedDayBefore, appeared3DaysAgo].filter(Boolean).length;

  // 3 appearances in 3 days → unavailable (nobody pitches 3 straight days)
  if (appearancesLast3Days >= 3) {
    return { available: false, reason: 'Used 3 times in 3 days', tired: false, fatiguePenalty: 0 };
  }

  const yesterdayPitches = appearedYesterday
    ? (appearedYesterday.pitches || estimatePitches(appearedYesterday.outs || 0))
    : 0;

  // Back-to-back: pitched each of the last 2 days.
  // Block only if the combined workload is heavy; a light back-to-back is allowed but tired.
  if (appearedYesterday && appearedDayBefore) {
    const dayBeforePitches = appearedDayBefore.pitches || estimatePitches(appearedDayBefore.outs || 0);
    if (yesterdayPitches >= 25 || dayBeforePitches >= 30) {
      return { available: false, reason: 'Back-to-back with heavy workload', tired: false, fatiguePenalty: 0 };
    }
    return { available: true, reason: 'Back-to-back appearances', tired: true, fatiguePenalty: 15 };
  }

  // Yesterday pitch-count tiers (authoritative reliever rest spec)
  if (appearedYesterday) {
    if (yesterdayPitches >= 40) {
      return { available: false, reason: `${yesterdayPitches} pitches yesterday`, tired: false, fatiguePenalty: 0 };
    }
    if (yesterdayPitches >= 30) {
      return { available: true, reason: `${yesterdayPitches} pitches yesterday`, tired: true, fatiguePenalty: 20 };
    }
    if (yesterdayPitches >= 20) {
      return { available: true, reason: `${yesterdayPitches} pitches yesterday`, tired: true, fatiguePenalty: 10 };
    }
    // < 20 pitches yesterday: available, fall through to older-appearance rest check
  }

  // Older appearances (>= 2 days ago): outs-based rest tiers still apply
  let blockingEntry = null;
  let blockingPitches = 0;
  for (const entry of history) {
    if (entry.date === dayBefore) continue; // yesterday handled by pitch tiers above
    const requiredRest = getRequiredRestDays(entry.pitches, entry.outs);
    if (requiredRest === 0) continue;
    const daysSince = daysBetween(entry.date, gameDate);
    if (daysSince <= requiredRest) {
      const entryPitches = entry.pitches || estimatePitches(entry.outs || 0);
      if (!blockingEntry || entryPitches > blockingPitches) {
        blockingEntry = entry;
        blockingPitches = entryPitches;
      }
    }
  }
  if (blockingEntry) {
    const daysSince = daysBetween(blockingEntry.date, gameDate);
    const when = daysSince === 2 ? '2 days ago' : `${daysSince} days ago`;
    const ip = blockingEntry.outs ? ` (${Math.floor(blockingEntry.outs / 3)}.${blockingEntry.outs % 3} IP)` : '';
    return { available: false, reason: `${blockingPitches} pitches ${when}${ip}`, tired: false, fatiguePenalty: 0 };
  }

  // 2 appearances in last 3 days (but not back-to-back) → slightly tired
  if (appearancesLast3Days === 2) {
    return { available: true, reason: 'Used twice in last 3 days', tired: true, fatiguePenalty: 10 };
  }

  return { available: true, reason: null, tired: false, fatiguePenalty: 0 };
}

// Session 21 Part 2: Returns a fatigue penalty (0-30) for tired-but-available relievers.
// 0 = fresh, 10 = slightly tired, 20 = medium-heavy, 30 = heavy (shouldn't be available).
// The CPU selection can use this to deprioritize tired arms.
export function getRelieverFatiguePenalty(rotationState, teamKey, pitcherName, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload || !rs.workload[pitcherName]) return 0;
  const history = rs.workload[pitcherName];
  if (!history || history.length === 0) return 0;

  const dayBefore = shiftDate(gameDate, -1);
  const lastAppearance = history.find(e => e.date === dayBefore);
  if (!lastAppearance) return 0;

  const outs = lastAppearance.outs || 0;
  const pitches = lastAppearance.pitches || estimatePitches(outs);

  if (outs >= 9 || pitches >= 40) return 30;
  if (outs >= 6 || pitches >= 30) return 20;
  if (outs >= 3 || pitches >= 20) return 10;
  return 0;
}

// Backward-compatible: returns array of unavailable reliever names
export function getUnavailableRelievers(rotationState, teamKey, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload) return [];
  const team = TEAMS[teamKey];
  if (!team) return [];
  const allPitchers = [...(team.bullpen || []), ...(team.rotation || [])];
  const unavailable = [];
  for (const p of allPitchers) {
    const result = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    if (!result.available) unavailable.push(p.name);
  }
  return unavailable;
}

// Returns { [pitcherName]: reason } for UI display
export function getUnavailableRelieverReasons(rotationState, teamKey, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload) return {};
  const team = TEAMS[teamKey];
  if (!team) return {};
  const allPitchers = [...(team.bullpen || []), ...(team.rotation || [])];
  const reasons = {};
  for (const p of allPitchers) {
    const result = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    if (!result.available) reasons[p.name] = result.reason;
  }
  return reasons;
}

// Session 23: Returns { [pitcherName]: reason } for tired-but-available relievers.
// Used by the human substitution panel to show a "tired" badge.
export function getTiredRelievers(rotationState, teamKey, gameDate) {
  const rs = rotationState?.[teamKey];
  if (!rs || !rs.workload) return {};
  const team = TEAMS[teamKey];
  if (!team) return {};
  const allPitchers = [...(team.bullpen || []), ...(team.rotation || [])];
  const tired = {};
  for (const p of allPitchers) {
    const result = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    if (result.available && result.tired) {
      tired[p.name] = result.reason;
    }
  }
  return tired;
}

// Backward-compatible wrapper
export function recordRelieverUsage(rotationState, teamKey, pitchingLine, gameDate) {
  recordPitcherWorkload(rotationState, teamKey, pitchingLine, gameDate);
}

// Backward-compatible wrapper
export function pickStarter(teamKey, gameDate, rotationState) {
  return getProbableStarter(rotationState, teamKey, gameDate);
}

// Backward-compatible wrapper - delegates to advanceRotation
export function recordStart(teamKey, pitcherName, gameDate, rotationState) {
  advanceRotation(rotationState, teamKey, pitcherName, gameDate);
}

export async function loadRotationStateForActiveSeason() {
  try {
    const seasons = await base44.entities.Season.filter({ status: 'active' });
    if (seasons.length === 0) return {};
    return seasons[0].rotationState || {};
  } catch (e) {
    console.error('Failed to load rotation state:', e);
    return {};
  }
}

export async function persistRotationState(seasonId, rotationState) {
  try {
    await base44.entities.Season.update(seasonId, { rotationState });
  } catch (e) {
    console.error('Failed to persist rotation state:', e);
  }
}

// Build a GameResult entity from the final game state + season context
export function buildSeasonGameResultFromState(state, ctx) {
  const homeWon = state.score.home > state.score.away;
  const winner = homeWon ? state.homeTeam : state.awayTeam;

  const homeAll = [...state.homeLineup, ...(state.homePlayerHistory || [])];
  const awayAll = [...state.awayLineup, ...(state.awayPlayerHistory || [])];
  const homeHits = homeAll.reduce((s, p) => s + (p.gameStats?.hits || 0), 0);
  const awayHits = awayAll.reduce((s, p) => s + (p.gameStats?.hits || 0), 0);

  return {
    seasonId: ctx.seasonId,
    gameDay: ctx.gameDay,
    gameDate: ctx.gameDate || null,
    homeTeam: state.homeTeam,
    awayTeam: state.awayTeam,
    homeScore: state.score.home,
    awayScore: state.score.away,
    winner,
    isUserGame: true,
    homeHits,
    awayHits,
    stadium: TEAMS[state.homeTeam]?.stadium || null,
    innings: (state.innings || []).map(inn => ({ home: inn.home || 0, away: inn.away || 0 })),
  };
}

// ── Current user game resolver — the ONE source of truth for "what game is next" ──
export async function getCurrentUserGame(season) {
  if (!season?.id) return null;
  try {
    const games = await base44.entities.Schedule.filter({
      seasonId: season.id,
      isUserGame: true,
    }, 'gameDay', 50);
    const next = games.find(g => g.status !== 'final');
    // Consistency guard: if the next unplayed user game is before the day pointer, desync exists
    if (next && next.gameDay < (season.currentGameDay || 1)) {
      console.error(`[seasonStore] DESYNC: next unplayed user game is day ${next.gameDay} but season pointer is day ${season.currentGameDay || 1}`);
    }
    return next || null;
  } catch (e) {
    console.error('Failed to get current user game:', e);
    return null;
  }
}

// Mark a schedule row as final (the game has been played)
export async function markScheduleRowFinal(scheduleId) {
  if (!scheduleId) return;
  try {
    await base44.entities.Schedule.update(scheduleId, { status: 'final' });
  } catch (e) {
    console.error('Failed to mark schedule row final:', e);
  }
}

// Auto-advance the league day if ALL games for the current day are final
export async function maybeAdvanceDay(season) {
  if (!season?.id) return season;
  const day = season.currentGameDay || 1;
  try {
    const dayGames = await base44.entities.Schedule.filter({
      seasonId: season.id, gameDay: day,
    });
    if (dayGames.length === 0) return season;
    if (!dayGames.every(g => g.status === 'final')) return season;
    const nextDay = day + 1;
    const update = { currentGameDay: nextDay };
    // Derive the next date from the schedule if available
    const nextSched = await base44.entities.Schedule.filter({ seasonId: season.id, gameDay: nextDay });
    if (nextSched.length > 0 && nextSched[0].gameDate) update.currentDate = nextSched[0].gameDate;
    await base44.entities.Season.update(season.id, update);
    return { ...season, ...update };
  } catch (e) {
    console.error('Failed to check/advance day:', e);
    return season;
  }
}

// ── Stage 3: Stats pipeline + derivations (read-only presentation) ──

// Commit player stats from game batting/pitching arrays to the PlayerStats entity (upsert).
// Aggregates multiple games per player in one call. Called at every commit (sim + user).
export async function commitPlayerStats(seasonId, batting, pitching) {
  if (!seasonId || (!batting?.length && !pitching?.length)) return;
  try {
    const existing = await base44.entities.PlayerStats.filter({ seasonId }, null, 1500);
    const statMap = {};
    for (const s of existing) statMap[`${s.team}|${s.playerName}`] = s;

    const deltas = {};
    const getDelta = (key) => {
      if (!deltas[key]) {
        const [team, name] = key.split('|');
        deltas[key] = { rec: statMap[key], team, name, bat: null, pitch: null };
      }
      return deltas[key];
    };

    for (const b of batting) {
      if (!b?.name) continue;
      const d = getDelta(`${b.teamKey}|${b.name}`);
      if (!d.bat) d.bat = { g:0, ab:0, h:0, doubles:0, triples:0, hr:0, rbi:0, r:0, bb:0, so:0, sb:0 };
      d.bat.g++; d.bat.ab += b.ab||0; d.bat.h += b.h||0;
      d.bat.doubles += b.doubles||0; d.bat.triples += b.triples||0;
      d.bat.hr += b.hr||0; d.bat.rbi += b.rbi||0; d.bat.r += b.r||0;
      d.bat.bb += b.bb||0; d.bat.so += b.so||0; d.bat.sb += b.sb||0;
    }
    for (const p of pitching) {
      if (!p?.name) continue;
      const d = getDelta(`${p.teamKey}|${p.name}`);
      if (!d.pitch) d.pitch = { g:0, gs:0, outs:0, h:0, r:0, er:0, bb:0, so:0, hr:0, w:0, l:0, sv:0 };
      d.pitch.g++; if (p.gs) d.pitch.gs++;
      d.pitch.outs += p.outs||0; d.pitch.h += p.h||0; d.pitch.r += p.r||0;
      d.pitch.er += p.er||0; d.pitch.bb += p.bb||0; d.pitch.so += p.so||0;
      d.pitch.hr += p.hr||0;
      if (p.w) d.pitch.w++; if (p.l) d.pitch.l++; if (p.sv) d.pitch.sv++;
    }

    const toUpdate = [];
    const toCreate = [];

    for (const d of Object.values(deltas)) {
      const rec = d.rec;
      const merged = {};

      if (d.bat) {
        const ab = (rec?.atBats||0) + d.bat.ab;
        const h = (rec?.hits||0) + d.bat.h;
        const doubles = (rec?.doubles||0) + d.bat.doubles;
        const triples = (rec?.triples||0) + d.bat.triples;
        const hr = (rec?.homeRuns||0) + d.bat.hr;
        const bb = (rec?.walks||0) + d.bat.bb;
        const pa = ab + bb;
        const singles = Math.max(0, h - doubles - triples - hr);
        Object.assign(merged, {
          gamesPlayed: (rec?.gamesPlayed||0) + d.bat.g,
          atBats: ab, hits: h, doubles, triples, homeRuns: hr,
          rbi: (rec?.rbi||0) + d.bat.rbi, runs: (rec?.runs||0) + d.bat.r,
          walks: bb, strikeouts: (rec?.strikeouts||0) + d.bat.so,
          stolenBases: (rec?.stolenBases||0) + d.bat.sb,
          battingAverage: ab > 0 ? h / ab : 0,
          onBasePercentage: pa > 0 ? (h + bb) / pa : 0,
          sluggingPercentage: ab > 0 ? (singles + 2*doubles + 3*triples + 4*hr) / ab : 0,
        });
        merged.ops = (merged.onBasePercentage||0) + (merged.sluggingPercentage||0);
      }

      if (d.pitch) {
        const ip = (rec?.inningsPitched||0) + (d.pitch.outs / 3);
        const pHits = (rec?.pitchingHits||0) + d.pitch.h;
        const pBB = (rec?.pitchingWalks||0) + d.pitch.bb;
        const pER = (rec?.pitchingEarnedRuns||0) + d.pitch.er;
        Object.assign(merged, {
          pitchingGames: (rec?.pitchingGames||0) + d.pitch.g,
          pitchingGamesStarted: (rec?.pitchingGamesStarted||0) + d.pitch.gs,
          inningsPitched: ip,
          pitchingHits: pHits,
          pitchingRuns: (rec?.pitchingRuns||0) + d.pitch.r,
          pitchingEarnedRuns: pER,
          pitchingWalks: pBB,
          pitchingStrikeouts: (rec?.pitchingStrikeouts||0) + d.pitch.so,
          pitchingHomeRuns: (rec?.pitchingHomeRuns||0) + d.pitch.hr,
          wins: (rec?.wins||0) + d.pitch.w,
          losses: (rec?.losses||0) + d.pitch.l,
          saves: (rec?.saves||0) + d.pitch.sv,
          era: ip > 0 ? (pER * 9) / ip : 0,
          whip: ip > 0 ? (pHits + pBB) / ip : 0,
        });
      }

      if (rec) {
        toUpdate.push({ id: rec.id, ...merged });
      } else {
        toCreate.push({
          seasonId, playerName: d.name, team: d.team,
          gamesPlayed:0, atBats:0, hits:0, doubles:0, triples:0, homeRuns:0,
          rbi:0, runs:0, walks:0, strikeouts:0, stolenBases:0,
          battingAverage:0, onBasePercentage:0, sluggingPercentage:0, ops:0,
          pitchingGames:0, pitchingGamesStarted:0, inningsPitched:0,
          pitchingHits:0, pitchingRuns:0, pitchingEarnedRuns:0,
          pitchingWalks:0, pitchingStrikeouts:0, pitchingHomeRuns:0,
          wins:0, losses:0, saves:0, era:0, whip:0,
          ...merged,
        });
      }
    }

    if (toUpdate.length > 0) await base44.entities.PlayerStats.bulkUpdate(toUpdate);
    if (toCreate.length > 0) await base44.entities.PlayerStats.bulkCreate(toCreate);
  } catch (e) {
    console.error('commitPlayerStats failed:', e);
  }
}

// Derive standings from GameResult records (pure derivation, never stored as a mutable table).
export function deriveStandings(gameResults) {
  const teams = {};
  for (const teamKey of Object.keys(TEAMS)) {
    teams[teamKey] = { w:0, l:0, streakType:null, streakLen:0, last10:[] };
  }

  const sorted = [...gameResults].sort((a, b) => (a.gameDay||0) - (b.gameDay||0));
  for (const r of sorted) {
    const homeWon = (r.homeScore ?? 0) > (r.awayScore ?? 0);
    const winner = homeWon ? r.homeTeam : r.awayTeam;
    const loser = homeWon ? r.awayTeam : r.homeTeam;
    if (teams[winner]) {
      teams[winner].w++;
      teams[winner].last10.push('W');
      if (teams[winner].last10.length > 10) teams[winner].last10.shift();
      teams[winner].streakType = teams[winner].streakType === 'W' ? 'W' : 'W';
      teams[winner].streakLen = teams[winner].streakType === 'W' ? teams[winner].streakLen + 1 : 1;
    }
    if (teams[loser]) {
      teams[loser].l++;
      teams[loser].last10.push('L');
      if (teams[loser].last10.length > 10) teams[loser].last10.shift();
      teams[loser].streakType = teams[loser].streakType === 'L' ? 'L' : 'L';
      teams[loser].streakLen = teams[loser].streakType === 'L' ? teams[loser].streakLen + 1 : 1;
    }
  }

  const result = {};
  for (const [divName, divTeams] of Object.entries(DIVISIONS)) {
    const arr = divTeams.map(t => {
      const s = teams[t] || { w:0, l:0, streakType:null, streakLen:0, last10:[] };
      const pct = s.w + s.l > 0 ? s.w / (s.w + s.l) : 0;
      return {
        teamKey: t, w: s.w, l: s.l, pct,
        streakType: s.streakType, streakLen: s.streakLen,
        last10: s.last10, last10Wins: s.last10.filter(x => x === 'W').length,
      };
    }).sort((a, b) => b.pct - a.pct);
    const leader = arr[0];
    for (const team of arr) {
      team.gb = leader ? ((leader.w - team.w) + (team.l - leader.l)) / 2 : 0;
    }
    result[divName] = arr;
  }
  return result;
}

// Build a per-team game log from GameResult records (chronological).
export function buildTeamGameLog(gameResults, teamKey) {
  const teamGames = gameResults
    .filter(r => r.homeTeam === teamKey || r.awayTeam === teamKey)
    .sort((a, b) => (a.gameDay||0) - (b.gameDay||0));

  let w = 0, l = 0;
  return teamGames.map(r => {
    const isHome = r.homeTeam === teamKey;
    const teamScore = isHome ? r.homeScore : r.awayScore;
    const oppScore = isHome ? r.awayScore : r.homeScore;
    const oppTeam = isHome ? r.awayTeam : r.homeTeam;
    const won = teamScore > oppScore;
    if (won) w++; else l++;
    return {
      gameDay: r.gameDay,
      gameDate: r.gameDate,
      opponent: oppTeam,
      isHome,
      result: won ? 'W' : 'L',
      score: `${teamScore}-${oppScore}`,
      recordAfter: `${w}-${l}`,
      starter: isHome ? r.winningPitcher : r.losingPitcher, // best available
      gameResultId: r.id,
      boxScore: r.boxScore,
    };
  });
}

// Archive any existing active seasons before creating a new one (prevents duplicates)
export async function archiveActiveSeasons() {
  try {
    const active = await base44.entities.Season.filter({ status: 'active' });
    for (const s of active) {
      await base44.entities.Season.update(s.id, { status: 'completed' });
    }
  } catch (e) {
    console.error('Failed to archive active seasons:', e);
  }
}