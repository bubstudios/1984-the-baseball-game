// allStarMvp.js - All-Star Game MVP calculation.
// Scores every player on both teams, picks the highest from the winning league.
// Rare losing-league MVP allowed only if score is overwhelmingly higher.

import { TEAMS } from './gameData';

// Score a hitter's All-Star Game performance
function scoreHitterMvp(p) {
  const gs = p.gameStats || {};
  let score = 0;
  score += (gs.hr || 0) * 8;
  score += (gs.rbi || 0) * 3;
  score += (gs.runs || 0) * 2;
  score += (gs.hits || 0) * 2;
  score += (gs.doubles || 0) * 3;
  score += (gs.triples || 0) * 4;
  score += (gs.bb || 0) * 1;
  score += (gs.sb || 0) * 3;
  return score;
}

// Score a pitcher's All-Star Game performance
function scorePitcherMvp(p) {
  const gs = p.gameStats || {};
  let score = 0;
  const outs = gs.outs || 0;
  const ip = outs / 3;
  const er = gs.er || 0;
  // Scoreless innings: +3 each
  if (er === 0) {
    score += Math.floor(ip) * 3;
    if (ip >= 2) score += 2; // bonus for 2+ scoreless innings
  } else {
    // Partial credit for innings with runs allowed
    score += Math.max(0, Math.floor(ip) * 3 - er * 3);
  }
  score += (gs.so || 0) * 1;
  if (gs.sv) score += 5;
  if (gs.w) score += 3;
  // Blown save / runs allowed penalty
  if (er > 0) score -= er * 2;
  return score;
}

// Build a stat line string for display
function buildStatLine(p) {
  const gs = p.gameStats || {};
  const isPitcher = ['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos);
  if (isPitcher) {
    const outs = gs.outs || 0;
    const ip = `${Math.floor(outs / 3)}.${outs % 3}`;
    const parts = [];
    parts.push(`${ip} IP`);
    if (gs.so) parts.push(`${gs.so} K`);
    if (gs.er === 0) parts.push('0 ER');
    if (gs.w) parts.push('W');
    if (gs.sv) parts.push('SV');
    return parts.join(', ');
  }
  const ab = gs.ab || 0;
  const h = gs.hits || 0;
  const parts = [`${h}-${ab}`];
  if (gs.hr) parts.push('HR');
  if (gs.rbi) parts.push(`${gs.rbi} RBI`);
  if (gs.runs) parts.push(`${gs.runs} R`);
  if (gs.sb) parts.push('SB');
  if (gs.bb) parts.push('BB');
  return parts.join(', ');
}

// Main MVP calculation
// gameState: the final game state after the All-Star Game
// rosters: the all-star rosters (for team/league lookup)
// Returns { name, team, league, statLine, score }
export function calculateAllStarMvp(gameState, rosters) {
  if (!gameState || !rosters) return null;

  const homeLeague = rosters.homeLeague; // 'AL' or 'NL'
  const awayLeague = homeLeague === 'AL' ? 'NL' : 'AL';
  const homeWon = gameState.score.home > gameState.score.away;
  const winningLeague = homeWon ? homeLeague : awayLeague;

  const allPlayers = [];

  // Collect all players from both teams (lineup + history)
  const collectTeam = (lineup, history, side) => {
    const league = (side === 'home') ? homeLeague : awayLeague;
    for (const p of [...lineup, ...(history || [])]) {
      const isPitcher = ['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos);
      const score = isPitcher ? scorePitcherMvp(p) : scoreHitterMvp(p);
      if (score > 0) {
        allPlayers.push({
          name: p.name,
          team: findPlayerTeam(p.name, rosters, league),
          league,
          statLine: buildStatLine(p),
          score,
          isPitcher,
        });
      }
    }
  };

  collectTeam(gameState.homeLineup, gameState.homePlayerHistory, 'home');
  collectTeam(gameState.awayLineup, gameState.awayPlayerHistory, 'away');

  if (allPlayers.length === 0) return null;

  // Sort by score
  allPlayers.sort((a, b) => b.score - a.score);

  // Default: pick highest from winning league
  const winningLeaguePlayers = allPlayers.filter(p => p.league === winningLeague);
  const losingLeaguePlayers = allPlayers.filter(p => p.league !== winningLeague);

  let mvp = winningLeaguePlayers[0];

  // Rare losing-team MVP: only if score is 50%+ higher than the best winning player
  if (!mvp && losingLeaguePlayers.length > 0) {
    mvp = losingLeaguePlayers[0];
  } else if (mvp && losingLeaguePlayers.length > 0) {
    const bestLoser = losingLeaguePlayers[0];
    if (bestLoser.score > mvp.score * 1.5 && bestLoser.score >= 15) {
      mvp = bestLoser;
    }
  }

  if (!mvp) return null;
  return {
    name: mvp.name,
    team: mvp.team,
    league: mvp.league,
    statLine: mvp.statLine,
    score: mvp.score,
  };
}

// Find which MLB team a player belongs to from the rosters
function findPlayerTeam(name, rosters, league) {
  const roster = rosters[league];
  if (!roster) return '?';
  const allEntries = [
    ...(roster.battingOrder || []),
    ...(roster.bench || []),
    ...((roster.pitchers?.starters || []).map(p => ({ ...p, teamKey: p.teamKey }))),
    ...((roster.pitchers?.relievers || []).map(p => ({ ...p, teamKey: p.teamKey }))),
  ];
  const found = allEntries.find(p => p.name === name);
  return found?.teamKey || '?';
}