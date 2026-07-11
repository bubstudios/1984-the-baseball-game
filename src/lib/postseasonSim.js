// postseasonSim.js - Postseason game simulation + series progression
// Separate from regular-season simulateDay(). Each call sims ONE game.

import { TEAMS } from './gameData';
import { simulateGameHeadless } from './seasonEngine';
import { resolveWorldSeriesHomeField } from './postseason';

function clone(postseason) {
  return JSON.parse(JSON.stringify(postseason));
}

// Count wins for each team in a series
export function getSeriesWins(series) {
  const wins = {};
  for (const game of (series.games || [])) {
    if (game.status === 'complete' && game.winner) {
      wins[game.winner] = (wins[game.winner] || 0) + 1;
    }
  }
  return wins;
}

// Is the series complete (a team won enough games)?
export function isSeriesComplete(series) {
  if (series.status === 'complete') return true;
  const wins = getSeriesWins(series);
  const needed = Math.floor((series.bestOf || 7) / 2) + 1;
  return Object.values(wins).some(w => w >= needed);
}

// Get the winner of a completed series
export function getSeriesWinner(series) {
  if (!isSeriesComplete(series)) return null;
  const wins = getSeriesWins(series);
  const needed = Math.floor((series.bestOf || 7) / 2) + 1;
  for (const [team, w] of Object.entries(wins)) {
    if (w >= needed) return team;
  }
  return null;
}

// Find the next unplayed postseason game across all active series
export function getNextPostseasonGame(postseason) {
  const candidates = [];

  for (const seriesKey of ['alcs', 'nlcs']) {
    const series = postseason[seriesKey];
    if (!series || series.status === 'complete' || series.status === 'pending') continue;
    for (const game of (series.games || [])) {
      if (!game.status || game.status === 'scheduled') {
        candidates.push({ seriesKey, gameNumber: game.gameNumber, date: game.date });
      }
    }
  }

  const ws = postseason.worldSeries;
  if (ws && ws.status !== 'pending' && ws.status !== 'complete' && (ws.games || []).length > 0) {
    for (const game of ws.games) {
      if (!game.status || game.status === 'scheduled') {
        candidates.push({ seriesKey: 'worldSeries', gameNumber: game.gameNumber, date: game.date });
      }
    }
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    const order = { alcs: 0, nlcs: 1, worldSeries: 2 };
    return (order[a.seriesKey] || 0) - (order[b.seriesKey] || 0);
  });

  return candidates[0];
}

// Simulate one postseason game and update series/bracket state.
// Returns { postseason, event } where event.type is:
//   'game_complete' - one game simmed
//   'ws_created'    - both LCS done, World Series created
//   'champion'      - World Series complete, champion crowned
//   'complete'      - no more games to play
export function simPostseasonStep(postseason, asgWinnerLeague) {
  const next = getNextPostseasonGame(postseason);

  if (!next) {
    const champion = postseason.worldSeries?.winner || null;
    return { postseason, event: { type: champion ? 'complete' : 'no_games', champion } };
  }

  const updated = clone(postseason);
  const series = updated[next.seriesKey];
  const game = series.games.find(g => g.gameNumber === next.gameNumber);

  const useDH = TEAMS[game.homeTeam]?.league === 'AL';

  const finalState = simulateGameHeadless(game.homeTeam, game.awayTeam, {
    useDH,
    rotationState: {},
    gameDate: game.date,
  });

  const homeWon = finalState.score.home > finalState.score.away;
  const winner = homeWon ? game.homeTeam : game.awayTeam;

  game.status = 'complete';
  game.homeScore = finalState.score.home;
  game.awayScore = finalState.score.away;
  game.winner = winner;

  // Check if this series is now complete
  if (isSeriesComplete(series)) {
    const sw = getSeriesWinner(series);
    series.status = 'complete';
    series.winner = sw;
    for (const g of series.games) {
      if (!g.status || g.status === 'scheduled') g.status = 'not_needed';
    }
  }

  // Create World Series if both LCS are complete
  if (updated.alcs.status === 'complete' && updated.nlcs.status === 'complete' &&
      updated.worldSeries.status === 'pending') {
    const resolved = resolveWorldSeriesHomeField(
      updated, updated.nlcs.winner, updated.alcs.winner, asgWinnerLeague
    );
    return {
      postseason: resolved,
      event: { type: 'ws_created', alChamp: updated.alcs.winner, nlChamp: updated.nlcs.winner },
    };
  }

  // Check if World Series is complete
  if (updated.worldSeries.status === 'scheduled' || updated.worldSeries.status === 'in_progress') {
    if (isSeriesComplete(updated.worldSeries)) {
      const champion = getSeriesWinner(updated.worldSeries);
      updated.worldSeries.status = 'complete';
      updated.worldSeries.winner = champion;
      for (const g of updated.worldSeries.games) {
        if (!g.status || g.status === 'scheduled') g.status = 'not_needed';
      }
      return {
        postseason: updated,
        event: { type: 'champion', champion },
      };
    }
  }

  return {
    postseason: updated,
    event: { type: 'game_complete', seriesKey: next.seriesKey, gameNumber: next.gameNumber,
             winner, homeScore: game.homeScore, awayScore: game.awayScore },
  };
}

export function isPostseasonComplete(postseason) {
  return postseason?.worldSeries?.status === 'complete';
}