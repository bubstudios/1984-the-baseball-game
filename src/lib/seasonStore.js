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

// ── Rotation logic (4-day starter cooldown) ──
// rotationState persists on the Season entity: { teamKey: { lastStarted: { pitcherName: gameDay } } }

export function pickStarter(teamKey, gameDay, rotationState) {
  const team = TEAMS[teamKey];
  const rot = team.rotation || [];
  if (rot.length === 0) return null;

  const rs = rotationState?.[teamKey];
  if (!rs || !rs.lastStarted) return rot[0];

  // First available starter in rotation order (>=4 days rest)
  const available = rot.filter(p => (gameDay - (rs.lastStarted[p.name] ?? -99)) >= 4);
  if (available.length > 0) return available[0];

  // Nobody rested enough - "bullpen/long-man day": use the most-rested arm
  let best = rot[0], bestRest = -Infinity;
  for (const p of rot) {
    const rest = gameDay - (rs.lastStarted[p.name] ?? -99);
    if (rest > bestRest) { bestRest = rest; best = p; }
  }
  return best;
}

// Call AFTER a game to record that a starter was used. Mutates rotationState in place.
export function recordStart(teamKey, pitcherName, gameDay, rotationState) {
  if (!rotationState[teamKey]) rotationState[teamKey] = { lastStarted: {} };
  rotationState[teamKey].lastStarted[pitcherName] = gameDay;
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