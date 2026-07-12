// ejectionReplacement.js - Resolves pending pitcher-ejection replacements.
// Extracted from Home.jsx so the On-Field Incident window can gate the
// replacement flow: the incident shows first, and only after the user
// dismisses it does the replacement get triggered.
import { TEAMS } from './gameData';
import { changePitcher, pickCpuReliever } from './gameEngine';

// Returns the replacement action for a pending pitcher ejection.
//   { action: 'show_modal', ejectedSide, bullpen } - user must pick a reliever
//   { action: 'cpu_replaced', newState }             - CPU auto-selected a reliever
//   { action: 'none' }                              - no pending ejection
export function resolveEjectionReplacement(gameState, userTeam) {
  if (!gameState || !gameState._pendingEjectionReplacement) return { action: 'none' };
  const ejectedSide = gameState._beanball?.autoEjectionSide;
  if (!ejectedSide) return { action: 'none' };

  const isUserTeam = (ejectedSide === 'home' && userTeam === gameState.homeTeam) ||
                     (ejectedSide === 'away' && userTeam === gameState.awayTeam);

  if (isUserTeam) {
    let bullpen = ejectedSide === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
    // Filter out the ejected pitcher so they can't re-enter the game
    const ejectedPitcherName = gameState._beanball?.autoEjectionPitcher;
    if (ejectedPitcherName) {
      bullpen = bullpen.filter(p => p.name !== ejectedPitcherName);
    }
    // Emergency fallback: exhausted bullpen - offer any available roster pitcher
    // not already in the game or removed.
    if (!bullpen || bullpen.length === 0) {
      const teamKey = ejectedSide === 'home' ? gameState.homeTeam : gameState.awayTeam;
      const rosterPitchers = TEAMS[teamKey]?.bullpen || [];
      const inGame = new Set();
      (ejectedSide === 'home' ? gameState.homeLineup : gameState.awayLineup).forEach(p => inGame.add(p.name));
      (ejectedSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || [])).forEach(p => inGame.add(p.name));
      (gameState.removedPlayers || []).forEach(n => inGame.add(n));
      bullpen = rosterPitchers.filter(p => !inGame.has(p.name) && !(gameState.scratchedPlayers || []).includes(p.name));
    }
    return { action: 'show_modal', ejectedSide, bullpen };
  }

  // CPU team ejection - auto-select reliever
  const bullpen = ejectedSide === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
  const newReliever = pickCpuReliever(bullpen, gameState.inning, {
    cpuScore: gameState.score[ejectedSide],
    oppScore: gameState.score[ejectedSide === 'home' ? 'away' : 'home'],
  });
  if (newReliever) {
    const newState = changePitcher(gameState, newReliever, ejectedSide);
    return { action: 'cpu_replaced', newState };
  }
  return { action: 'none' };
}