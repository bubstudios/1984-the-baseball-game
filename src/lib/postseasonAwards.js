// postseasonAwards.js - Calculate postseason MVP awards from game box scores.
// WS MVP: World Series stats only, prefer winning team.
// ALCS/NLCS MVP: that series's stats only, prefer winning team.
// Postseason MVP: all postseason stats, prefer WS champion.

// Aggregate batting stats across completed games for a specific team
function aggregateBatting(games, teamKey) {
  const stats = {};
  for (const game of games) {
    if (game.status !== 'complete' || !game.batting) continue;
    for (const b of game.batting) {
      if (b.teamKey !== teamKey) continue;
      if (!stats[b.playerId]) {
        stats[b.playerId] = {
          name: b.name, teamKey, playerId: b.playerId,
          ab: 0, h: 0, doubles: 0, triples: 0, hr: 0, rbi: 0, r: 0, bb: 0, so: 0, sb: 0,
        };
      }
      const s = stats[b.playerId];
      s.ab += b.ab || 0;
      s.h += b.h || 0;
      s.doubles += b.doubles || 0;
      s.triples += b.triples || 0;
      s.hr += b.hr || 0;
      s.rbi += b.rbi || 0;
      s.r += b.r || 0;
      s.bb += b.bb || 0;
      s.so += b.so || 0;
      s.sb += b.sb || 0;
    }
  }
  return stats;
}

// Aggregate pitching stats across completed games for a specific team
function aggregatePitching(games, teamKey) {
  const stats = {};
  for (const game of games) {
    if (game.status !== 'complete' || !game.pitching) continue;
    for (const p of game.pitching) {
      if (p.teamKey !== teamKey) continue;
      if (!stats[p.playerId]) {
        stats[p.playerId] = {
          name: p.name, teamKey, playerId: p.playerId,
          gs: 0, outs: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, hr: 0, bf: 0, w: 0, l: 0, sv: 0,
        };
      }
      const s = stats[p.playerId];
      s.gs += p.gs || 0;
      s.outs += p.outs || 0;
      s.h += p.h || 0;
      s.r += p.r || 0;
      s.er += p.er || 0;
      s.bb += p.bb || 0;
      s.so += p.so || 0;
      s.hr += p.hr || 0;
      s.bf += p.bf || 0;
      if (game.decisions) {
        if (game.decisions.winner === p.playerId) s.w++;
        if (game.decisions.loser === p.playerId) s.l++;
        if (game.decisions.save === p.playerId) s.sv++;
      }
    }
  }
  return stats;
}

function scoreHitter(s) {
  return (s.rbi || 0) * 4 + (s.hr || 0) * 5 + (s.h || 0) * 2 + (s.r || 0) * 2 +
         (s.doubles || 0) * 2 + (s.triples || 0) * 3 + (s.sb || 0) * 2 + (s.bb || 0) * 1 -
         (s.so || 0) * 0.5;
}

function scoreStarter(s) {
  const ip = (s.outs || 0) / 3;
  return (s.w || 0) * 8 + ip * 1.5 + (s.so || 0) * 1 - (s.er || 0) * 3 - (s.h || 0) * 0.5 - (s.bb || 0) * 0.5;
}

function scoreReliever(s) {
  const ip = (s.outs || 0) / 3;
  return (s.sv || 0) * 8 + (s.w || 0) * 5 + ip * 2 + (s.so || 0) * 1 - (s.er || 0) * 4;
}

function formatHitterLine(s) {
  const avg = s.ab > 0 ? (s.h / s.ab).toFixed(3).replace(/^0/, '') : '.000';
  return `${avg} AVG, ${s.hr} HR, ${s.rbi} RBI, ${s.r} R`;
}

function formatPitcherLine(s) {
  const ip = (s.outs || 0) / 3;
  const ipStr = `${Math.floor(ip)}.${(s.outs || 0) % 3}`;
  const era = ip > 0 ? ((s.er || 0) * 9 / ip).toFixed(2) : '0.00';
  return `${s.w}-${s.l}, ${era} ERA, ${s.so} K, ${ipStr} IP`;
}

// Calculate MVP for a single series (or aggregated "series" of all games)
function calculateSeriesMVP(series, winnerTeam) {
  if (!series || !series.games) return null;

  const completedGames = series.games.filter(g => g.status === 'complete');
  if (completedGames.length === 0) return null;

  const teams = new Set();
  for (const g of completedGames) {
    teams.add(g.homeTeam);
    teams.add(g.awayTeam);
  }

  const allBatting = {};
  const allPitching = {};

  for (const teamKey of teams) {
    Object.assign(allBatting, aggregateBatting(completedGames, teamKey));
    Object.assign(allPitching, aggregatePitching(completedGames, teamKey));
  }

  const candidates = [];

  for (const s of Object.values(allBatting)) {
    if (s.ab === 0 && s.bb === 0) continue;
    candidates.push({
      name: s.name,
      team: s.teamKey,
      score: scoreHitter(s),
      statLine: formatHitterLine(s),
      isHitter: true,
    });
  }

  for (const s of Object.values(allPitching)) {
    if (s.outs === 0) continue;
    const isStarter = s.gs > 0;
    candidates.push({
      name: s.name,
      team: s.teamKey,
      score: isStarter ? scoreStarter(s) : scoreReliever(s),
      statLine: formatPitcherLine(s),
      isHitter: false,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.score - a.score);

  // Prefer winner team players; allow losing-team player only if clearly dominant (1.5x)
  const winnerCandidates = candidates.filter(c => c.team === winnerTeam);
  const loserCandidates = candidates.filter(c => c.team !== winnerTeam);

  if (winnerCandidates.length > 0) {
    const topWinner = winnerCandidates[0];
    if (loserCandidates.length > 0 && loserCandidates[0].score > topWinner.score * 1.5) {
      return loserCandidates[0];
    }
    return topWinner;
  }

  return candidates[0];
}

// Calculate all postseason awards
export function calculatePostseasonAwards(postseason) {
  const alcsWinner = postseason?.alcs?.winner;
  const nlcsWinner = postseason?.nlcs?.winner;
  const wsWinner = postseason?.worldSeries?.winner;

  const alcsMVP = calculateSeriesMVP(postseason?.alcs, alcsWinner);
  const nlcsMVP = calculateSeriesMVP(postseason?.nlcs, nlcsWinner);
  const worldSeriesMVP = calculateSeriesMVP(postseason?.worldSeries, wsWinner);

  // Postseason MVP: aggregate across ALL postseason games
  const allGames = [
    ...(postseason?.alcs?.games || []),
    ...(postseason?.nlcs?.games || []),
    ...(postseason?.worldSeries?.games || []),
  ];
  const postseasonMVP = calculateSeriesMVP({ games: allGames }, wsWinner);

  return { worldSeriesMVP, alcsMVP, nlcsMVP, postseasonMVP };
}