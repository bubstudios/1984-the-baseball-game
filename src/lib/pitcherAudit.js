// pitcherAudit.js - Instrumented full-season sim that tracks per-pitcher
// metrics the standard box score doesn't capture: ERA by inning range,
// OPS allowed after pitch-count thresholds, LOB%, BABIP, RISP splits,
// HR with men on, double plays induced, and ER/R ratio.
//
// Does NOT modify the batting engine. Wraps the existing sim with tracking.

import { TEAMS } from './gameData';
import { generateScheduleValidated, LEAGUES } from './seasonSchedule';
import {
  createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing,
  cpuDecideSubstitutions, cpuDecideSteal, getCurrentBatter,
} from './gameEngine';
import { buildGameResultFromState } from './seasonEngine';
import {
  getProbableStarter, advanceRotation, recordPitcherWorkload,
  getUnavailableRelievers, playerId, isPitcherAvailable, getStarterFatigueStatus,
} from './seasonStore';

// ── Per-pitcher metric accumulator ──
function newMetric(name, team, pos) {
  const blank = () => ({ bf: 0, h: 0, r: 0, bb: 0, so: 0, hr: 0, doubles: 0, triples: 0, outs: 0 });
  return {
    name, team, pos,
    games: 0, gs: 0, w: 0, l: 0, sv: 0,
    // Accurate totals from buildGameResultFromState
    totOuts: 0, totH: 0, totR: 0, totER: 0, totBB: 0, totSO: 0, totHR: 0, totBF: 0, totPitches: 0,
    // Per-at-bat tracked breakdowns
    byInning: { '1-3': blank(), '4-6': blank(), '7-9': blank(), '10+': blank() },
    byPC: { '0-75': blank(), '76-90': blank(), '91-105': blank(), '106+': blank() },
    risp: blank(),
    menOn: blank(),
    hrWithMenOn: 0,
    dpInduced: 0,
    sfInduced: 0,
  };
}

function inningBucket(inning) {
  if (inning <= 3) return '1-3';
  if (inning <= 6) return '4-6';
  if (inning <= 9) return '7-9';
  return '10+';
}

function pcBucket(pc) {
  if (pc <= 75) return '0-75';
  if (pc <= 90) return '76-90';
  if (pc <= 105) return '91-105';
  return '106+';
}

const OUTCOMES = {
  single: { h: 1 }, double: { h: 1, doubles: 1 }, triple: { h: 1, triples: 1 },
  homerun: { h: 1, hr: 1 }, walk: { bb: 1 }, strikeout: { so: 1, outs: 1 },
  groundout: { outs: 1 }, flyout: { outs: 1 }, lineout: { outs: 1 },
  popout: { outs: 1 }, fc: { outs: 1 }, sacfly: { outs: 1, sf: 1 },
  doubleplay: { outs: 2 }, caughtstealing: { outs: 1 },
};

// ── Run the full season with instrumentation ──
export async function runPitcherAudit(onProgress) {
  const { days: scheduleDays, errors } = generateScheduleValidated('tigers', 15);
  if (errors.length > 0) return { error: 'Schedule generation failed', scheduleErrors: errors.slice(0, 10) };

  const rotationState = {};
  const metrics = {};
  const totals = {};
  const teamStandings = {};
  for (const tk of Object.keys(TEAMS)) teamStandings[tk] = { w: 0, l: 0, rf: 0, ra: 0 };

  let gameCount = 0, simErrors = 0;
  const totalDays = scheduleDays.length;

  for (let dayIdx = 0; dayIdx < totalDays; dayIdx++) {
    const day = scheduleDays[dayIdx];
    for (const game of day.games) {
      try {
        simulateGameInstrumented(game.home, game.away, {
          useDH: TEAMS[game.home]?.league === 'AL',
          rotationState, gameDate: day.date,
          homeSP: getProbableStarter(rotationState, game.home, day.date),
          awaySP: getProbableStarter(rotationState, game.away, day.date),
          unavailableRelievers: {
            home: getUnavailableRelievers(rotationState, game.home, day.date),
            away: getUnavailableRelievers(rotationState, game.away, day.date),
          },
        }, metrics, totals, teamStandings);
      } catch (e) { simErrors++; }
      gameCount++;
    }
    if (onProgress) onProgress(dayIdx + 1, totalDays, gameCount);
    await new Promise(r => setTimeout(r, 0));
  }

  return generateAuditReport(metrics, totals, teamStandings, { totalGames: gameCount, simErrors, totalDays });
}

// ── Instrumented single-game simulation ──
function simulateGameInstrumented(homeTeam, awayTeam, options, metrics, totals, standings) {
  const { useDH, homeSP, awaySP, unavailableRelievers, rotationState, gameDate } = options;

  let state = createGameState(homeTeam, awayTeam, null, null, useDH, null, null, homeSP, awaySP);
  state._headlessMode = true;
  state.homeStartingPitcherName = homeSP?.name || null;
  state.awayStartingPitcherName = awaySP?.name || null;

  if (rotationState && gameDate) {
    annotateBullpen(state, homeTeam, 'home', rotationState, gameDate);
    annotateBullpen(state, awayTeam, 'away', rotationState, gameDate);
    annotateEmergencyStarters(state, homeTeam, 'home', rotationState, gameDate);
    annotateEmergencyStarters(state, awayTeam, 'away', rotationState, gameDate);
    annotateStarter(state, homeTeam, 'home', rotationState, gameDate);
    annotateStarter(state, awayTeam, 'away', rotationState, gameDate);
  }

  // ── Instrumented game loop ──
  let atBatCtx = null;
  let prevBatterName = null;
  let iterations = 0;
  const maxIter = 500;

  while (!state.gameOver && iterations < maxIter) {
    iterations++;

    const battingSide = state.halfInning === 'top' ? 'away' : 'home';
    const pitchingSide = battingSide === 'home' ? 'away' : 'home';
    const battingTeamKey = battingSide === 'home' ? state.homeTeam : state.awayTeam;
    const pitchingTeamKey = pitchingSide === 'home' ? state.homeTeam : state.awayTeam;
    const currentPitcher = pitchingSide === 'home' ? state.homePitcher : state.awayPitcher;
    const batter = getCurrentBatter(state);
    const pid = playerId(pitchingTeamKey, currentPitcher.name);

    // Detect new at-bat
    if (!atBatCtx || batter.name !== prevBatterName || atBatCtx.halfInning !== state.halfInning) {
      atBatCtx = {
        batterName: batter.name,
        halfInning: state.halfInning,
        inning: state.inning,
        pitcherName: currentPitcher.name,
        pitcherPid: pid,
        pitchCount: currentPitcher.gameStats?.pitches || 0,
        outs: state.outs,
        runners: [!!state.bases[0], !!state.bases[1], !!state.bases[2]],
        isRISP: !!state.bases[2] && (!!state.bases[0] || !!state.bases[1]),
        menOn: state.bases.some(b => b !== null),
        prevScore: { ...state.score },
      };
      prevBatterName = batter.name;
    }

    const prevScore = state.score[battingSide];
    const prevOuts = state.outs;
    const prevHalf = state.halfInning;

    // CPU steal
    if (state.pendingSteal === null || state.pendingSteal === undefined) {
      const sb = cpuDecideSteal(state);
      if (sb >= 0) state.pendingSteal = sb;
    }

    // Process one pitch/action
    state = processAtBat(state, cpuSelectPitch(state), cpuSelectSwing(state));
    state = cpuDecideSubstitutions(state, state.awayTeam);
    state = cpuDecideSubstitutions(state, state.homeTeam);

    // Check if at-bat ended
    const newBatter = getCurrentBatter(state);
    const atBatEnded = newBatter.name !== batter.name || state.halfInning !== prevHalf || state.gameOver;

    if (atBatEnded && atBatCtx) {
      const runsScored = state.score[battingSide] - atBatCtx.prevScore[battingSide];
      const playType = state.lastPlay?.type || 'unknown';
      const outsRecorded = state.halfInning !== prevHalf
        ? 3 - atBatCtx.outs
        : state.outs - atBatCtx.outs;
      recordAtBat(metrics, atBatCtx, playType, runsScored, Math.max(0, outsRecorded));
      atBatCtx = null;
    }
  }

  // ── Accumulate accurate totals from box score ──
  const result = buildGameResultFromState(state);
  const homeWon = state.score.home > state.score.away;
  if (homeWon) {
    standings[homeTeam].w++; standings[awayTeam].l++;
    standings[homeTeam].rf += state.score.home; standings[homeTeam].ra += state.score.away;
    standings[awayTeam].rf += state.score.away; standings[awayTeam].ra += state.score.home;
  } else {
    standings[awayTeam].w++; standings[homeTeam].l++;
    standings[awayTeam].rf += state.score.away; standings[awayTeam].ra += state.score.home;
    standings[homeTeam].rf += state.score.home; standings[homeTeam].ra += state.score.away;
  }

  if (result?.pitching) {
    for (const p of result.pitching) {
      const key = `${p.teamKey}|${p.name}`;
      if (!totals[key]) totals[key] = { name: p.name, team: p.teamKey, pos: p.gs === 1 ? 'SP' : 'RP', games: 0, gs: 0, w: 0, l: 0, sv: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, bf: 0, pitches: 0 };
      const t = totals[key];
      t.games++; if (p.gs) t.gs++;
      t.outs += p.outs || 0; t.h += p.h || 0; t.r += p.r || 0; t.er += p.er || 0;
      t.bb += p.bb || 0; t.so += p.so || 0; t.hr += p.hr || 0; t.bf += p.bf || 0; t.pitches += p.pitches || 0;
      if (p.w) t.w++; if (p.l) t.l++; if (p.sv) t.sv++;
    }
  }

  // Advance rotation + workload
  if (state.homeStartingPitcherName) advanceRotation(rotationState, homeTeam, state.homeStartingPitcherName, gameDate);
  if (state.awayStartingPitcherName) advanceRotation(rotationState, awayTeam, state.awayStartingPitcherName, gameDate);
  if (result?.pitching) {
    recordPitcherWorkload(rotationState, homeTeam, result.pitching.filter(p => p.teamKey === homeTeam), gameDate);
    recordPitcherWorkload(rotationState, awayTeam, result.pitching.filter(p => p.teamKey === awayTeam), gameDate);
  }
}

// ── Record one at-bat outcome into per-pitcher metrics ──
function recordAtBat(metrics, ctx, playType, runs, outs) {
  let m = metrics[ctx.pitcherPid];
  if (!m) {
    const pos = ctx.pitcherName && TEAMS[ctx.pitcherTeam]
      ? (TEAMS[ctx.pitcherTeam].rotation?.find(p => p.name === ctx.pitcherName)?.pos ||
         TEAMS[ctx.pitcherTeam].bullpen?.find(p => p.name === ctx.pitcherName)?.pos || 'SP')
      : 'SP';
    m = newMetric(ctx.pitcherName, ctx.pitcherTeam, pos);
    metrics[ctx.pitcherPid] = m;
  }

  const ib = inningBucket(ctx.inning);
  const pb = pcBucket(ctx.pitchCount);
  const oc = OUTCOMES[playType] || {};

  // Update buckets
  const buckets = [m.byInning[ib], m.byPC[pb]];
  if (ctx.isRISP) buckets.push(m.risp);
  if (ctx.menOn) buckets.push(m.menOn);

  for (const b of buckets) {
    b.bf++;
    b.h += oc.h || 0;
    b.bb += oc.bb || 0;
    b.so += oc.so || 0;
    b.hr += oc.hr || 0;
    b.doubles += oc.doubles || 0;
    b.triples += oc.triples || 0;
    b.r += runs;
  }
  m.byInning[ib].outs += outs;

  // HR with men on
  if (playType === 'homerun' && ctx.menOn) m.hrWithMenOn++;
  // DP induced
  if (playType === 'doubleplay') m.dpInduced++;
  // Sac fly
  if (playType === 'sacfly') m.sfInduced++;
}

// ── Annotation helpers (replicated from seasonEngine.js) ──
function annotateBullpen(state, teamKey, side, rotationState, gameDate) {
  const bp = side === 'home' ? state.homeBullpen : state.awayBullpen;
  bp.forEach(p => {
    const avail = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
    p._seasonAvailable = avail.available;
    p._seasonEmergencyOnly = avail.emergencyOnly || false;
    p._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
    p._seasonTier = avail.tier || 'AVAILABLE';
  });
}

function annotateEmergencyStarters(state, teamKey, side, rotationState, gameDate) {
  const rotation = TEAMS[teamKey]?.rotation || [];
  const currentSP = side === 'home' ? state.homePitcher : state.awayPitcher;
  const starters = rotation
    .filter(p => p.name !== currentSP?.name)
    .map(p => {
      const avail = isPitcherAvailable(rotationState, teamKey, p.name, gameDate);
      return { ...p, _seasonAvailable: avail.available, _seasonEmergencyOnly: avail.emergencyOnly || false, _seasonFatiguePenalty: avail.tired ? avail.fatiguePenalty : 0, _seasonTier: avail.tier || 'AVAILABLE', _isEmergencyStarter: true };
    });
  if (side === 'home') state.homeEmergencyStarters = starters;
  else state.awayEmergencyStarters = starters;
}

function annotateStarter(state, teamKey, side, rotationState, gameDate) {
  const pitcher = side === 'home' ? state.homePitcher : state.awayPitcher;
  if (!pitcher) return;
  const isRotSP = (TEAMS[teamKey]?.rotation || []).some(p => p.name === pitcher.name);
  if (isRotSP) {
    const status = getStarterFatigueStatus(rotationState, teamKey, pitcher.name, gameDate);
    pitcher._seasonFatiguePenalty = status.penalty;
  } else {
    const avail = isPitcherAvailable(rotationState, teamKey, pitcher.name, gameDate);
    pitcher._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
    pitcher._seasonAvailable = avail.available;
    pitcher._seasonEmergencyOnly = avail.emergencyOnly || false;
    pitcher._seasonTier = avail.tier || 'AVAILABLE';
  }
}

// ── Generate the audit report ──
function generateAuditReport(metrics, totals, standings, summary) {
  // Merge per-at-bat metrics with accurate totals
  const allPitchers = [];
  for (const [key, t] of Object.entries(totals)) {
    const m = metrics[key] || newMetric(t.name, t.team, t.pos);
    const ip = t.outs / 3;
    const isStarter = t.gs > 0 && t.pos === 'SP';
    allPitchers.push({
      pid: key,
      name: t.name, team: t.team, pos: t.pos,
      games: t.games, gs: t.gs, w: t.w, l: t.l, sv: t.sv,
      outs: t.outs, ip,
      h: t.h, r: t.r, er: t.er, bb: t.bb, so: t.so, hr: t.hr, bf: t.bf, pitches: t.pitches,
      era: ip > 0 ? (9 * t.er) / ip : 0,
      ra9: ip > 0 ? (9 * t.r) / ip : 0,
      whip: ip > 0 ? (t.h + t.bb) / ip : 0,
      h9: ip > 0 ? (9 * t.h) / ip : 0,
      bb9: ip > 0 ? (9 * t.bb) / ip : 0,
      hr9: ip > 0 ? (9 * t.hr) / ip : 0,
      k9: ip > 0 ? (9 * t.so) / ip : 0,
      erPct: t.r > 0 ? t.er / t.r : 1,
      lobPct: (t.h + t.bb - t.r) > 0 && (t.h + t.bb - t.hr) > 0
        ? (t.h + t.bb - t.r) / (t.h + t.bb - t.hr) : 0,
      babip: (t.bf - t.bb - t.so - t.hr) > 0
        ? (t.h - t.hr) / (t.bf - t.bb - t.so - t.hr) : 0,
      xbhAllowed: (m.byInning['1-3'].doubles + m.byInning['4-6'].doubles + m.byInning['7-9'].doubles + m.byInning['10+'].doubles) +
                  (m.byInning['1-3'].triples + m.byInning['4-6'].triples + m.byInning['7-9'].triples + m.byInning['10+'].triples) +
                  t.hr,
      hrWithMenOn: m.hrWithMenOn,
      dpInduced: m.dpInduced,
      sfInduced: m.sfInduced,
      isStarter,
      // Breakdowns
      eraByInning: {
        '1-3': eraForBucket(m.byInning['1-3']),
        '4-6': eraForBucket(m.byInning['4-6']),
        '7-9': eraForBucket(m.byInning['7-9']),
        '10+': eraForBucket(m.byInning['10+']),
      },
      opsAfterPC: {
        '0-75': opsForBucket(m.byPC['0-75']),
        '76-90': opsForBucket(m.byPC['76-90']),
        '91-105': opsForBucket(m.byPC['91-105']),
        '106+': opsForBucket(m.byPC['106+']),
      },
      risp: {
        avg: m.risp.bf > 0 ? m.risp.h / (m.risp.bf - m.risp.bb) : 0,
        slg: slgForBucket(m.risp),
        ops: opsForBucket(m.risp),
      },
      menOn: {
        avg: m.menOn.bf > 0 ? m.menOn.h / (m.menOn.bf - m.menOn.bb) : 0,
        slg: slgForBucket(m.menOn),
      },
      metrics: m,
    });
  }

  // Qualified starters (162+ IP)
  const qualifiedStarters = allPitchers
    .filter(p => p.isStarter && p.ip >= 162)
    .sort((a, b) => a.era - b.era);

  const leagueStarters = allPitchers.filter(p => p.isStarter && p.ip > 0);
  const leagueRelievers = allPitchers.filter(p => !p.isStarter && p.ip > 0);

  const sumERA = (list) => {
    const totER = list.reduce((s, p) => s + p.er, 0);
    const totIP = list.reduce((s, p) => s + p.ip, 0);
    return totIP > 0 ? (9 * totER) / totIP : 0;
  };
  const avgStat = (list, fn) => list.length > 0 ? list.reduce((s, p) => s + fn(p), 0) / list.length : 0;

  // League offense summary
  const totalRuns = Object.values(standings).reduce((s, t) => s + t.rf, 0);
  const totalGames = summary.totalGames || 1;
  const runsPerTeamGame = totalRuns / (totalGames * 2);

  return {
    summary: {
      ...summary,
      runsPerTeamGame,
      leagueStarterERA: sumERA(leagueStarters),
      leagueRelieverERA: sumERA(leagueRelievers),
      qualifiedCount: qualifiedStarters.length,
      totalPitchers: allPitchers.length,
    },
    qualifiedStarters: qualifiedStarters.map(p => formatPitcherRow(p)),
    comparisons: {
      top10: qualifiedStarters.slice(0, 10),
      middle20: qualifiedStarters.length > 30
        ? qualifiedStarters.slice(Math.floor(qualifiedStarters.length / 2) - 10, Math.floor(qualifiedStarters.length / 2) + 10)
        : qualifiedStarters.slice(10),
      bottom10: qualifiedStarters.slice(-10),
      leagueStarters: { era: sumERA(leagueStarters), count: leagueStarters.length },
      leagueRelievers: { era: sumERA(leagueRelievers), count: leagueRelievers.length },
    },
    allPitchers,
    teamStandings: standings,
  };
}

function eraForBucket(b) {
  const ip = b.outs / 3;
  return ip > 0 ? (9 * b.r) / ip : 0;
}

function opsForBucket(b) {
  const ab = b.bf - b.bb;
  if (ab <= 0) return 0;
  const singles = b.h - b.doubles - b.triples - b.hr;
  const obp = (b.h + b.bb) / (ab + b.bb);
  const slg = (singles + 2 * b.doubles + 3 * b.triples + 4 * b.hr) / ab;
  return obp + slg;
}

function slgForBucket(b) {
  const ab = b.bf - b.bb;
  if (ab <= 0) return 0;
  const singles = b.h - b.doubles - b.triples - b.hr;
  return (singles + 2 * b.doubles + 3 * b.triples + 4 * b.hr) / ab;
}

function formatPitcherRow(p) {
  return {
    name: p.name, team: p.team, pos: p.pos,
    ip: p.ip, era: p.era, ra9: p.ra9, whip: p.whip,
    h9: p.h9, bb9: p.bb9, hr9: p.hr9, k9: p.k9,
    erPct: p.erPct, lobPct: p.lobPct, babip: p.babip,
    xbhAllowed: p.xbhAllowed, hrWithMenOn: p.hrWithMenOn,
    rispAvg: p.risp.avg, rispSlg: p.risp.slg, rispOPS: p.risp.ops,
    dpInduced: p.dpInduced,
    era13: p.eraByInning['1-3'], era46: p.eraByInning['4-6'], era79: p.eraByInning['7-9'],
    ops0_75: p.opsAfterPC['0-75'], ops76_90: p.opsAfterPC['76-90'],
    ops91_105: p.opsAfterPC['91-105'], ops106: p.opsAfterPC['106+'],
    menOnAvg: p.menOn.avg, menOnSlg: p.menOn.slg,
    gs: p.gs, w: p.w, l: p.l, sv: p.sv, bf: p.bf, pitches: p.pitches,
  };
}