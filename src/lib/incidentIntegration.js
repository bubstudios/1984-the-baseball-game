// ═════════════════════════════════════════════════════════════════
// INCIDENT INTEGRATION HELPERS
// Bridges incident system with game engine and player behavior
// ═════════════════════════════════════════════════════════════════

import { resolveCatcherCollision } from './catcherCollisionResolver.js';
import { MANAGERS } from './gameData.js';

/**
 * Check if a play should trigger an incident and resolve it
 * Returns the incident object or null
 */
export function checkAndResolveIncident(gameState, lastPlay, managers) {
  if (!gameState || !lastPlay) return null;
  
  const incidents = gameState._incidents || [];
  
  // Catcher collision detection
  if (lastPlay.type === 'walk' && lastPlay.text && lastPlay.text.includes('bowls over')) {
    // Extract runner and catcher names from play context
    const catcher = getCatcherName(gameState);
    const runner = getCurrentBatterName(gameState);
    
    if (catcher && runner) {
      const incident = resolveCatcherCollision(gameState, runner, catcher, {
        catcherHadBall: lastPlay.catcherHadBall !== false,
        catcherWasBlocking: lastPlay.catcherWasBlocking !== false,
        runnerSlid: false, // Collision occurred because runner didn't slide
        runnerLoweredShoulder: lastPlay.text.includes('shoulder'),
        runnerMadeAvoidableContact: true,
        runScored: lastPlay.type === 'walk' || lastPlay.type === 'safe',
      }, managers);
      
      if (!gameState._incidents) gameState._incidents = [];
      gameState._incidents.push(incident);
      
      return incident;
    }
  }
  
  return null;
}

function getCatcherName(gameState) {
  const defenders = gameState.halfInning === 'top' ? gameState.homeLineup : gameState.awayLineup;
  const catcher = defenders.find(p => p.assignedPos === 'C' || p.pos === 'C');
  return catcher ? catcher.name : null;
}

function getCurrentBatterName(gameState) {
  const lineup = gameState.halfInning === 'top' ? gameState.awayLineup : gameState.homeLineup;
  const bIdx = gameState.halfInning === 'top' ? gameState.awayBatterIndex : gameState.homeBatterIndex;
  return lineup[bIdx % lineup.length]?.name;
}