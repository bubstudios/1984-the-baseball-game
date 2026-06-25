/**
 * Composure System Simulation Test
 * Run N games and track zone transitions, meltdowns, recovery patterns
 */

import { TEAMS } from './gameData.js';
import { createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing, cpuDecideSubstitutions, getCurrentBatter, getCurrentPitcher } from './gameEngine.js';
import { initializeComposureTracking, trackComposureEvent, trackMeltdown, trackRecovery, generateComposureReport } from './composureTracking.js';
import { getBehaviorZone } from './pitcherComposure.js';
import { PITCH_TYPES, SWING_TYPES } from './gameData.js';

export async function runComposureSimTests(numGames = 12) {
  const tracking = initializeComposureTracking();
  const teamKeys = Object.keys(TEAMS);
  
  console.log(`\n🎮 Starting ${numGames} sim games to test pitcher composure system...\n`);
  
  for (let gameNum = 0; gameNum < numGames; gameNum++) {
    // Random matchup
    const homeTeam = teamKeys[Math.floor(Math.random() * teamKeys.length)];
    let awayTeam = teamKeys[Math.floor(Math.random() * teamKeys.length)];
    while (awayTeam === homeTeam) {
      awayTeam = teamKeys[Math.floor(Math.random() * teamKeys.length)];
    }
    
    let state = createGameState(homeTeam, awayTeam);
    console.log(`\n--- Game ${gameNum + 1}/${numGames}: ${TEAMS[homeTeam].name} vs ${TEAMS[awayTeam].name} ---`);
    
    let atBatCount = 0;
    const maxAtBats = 150; // ~full game worth
    
    while (!state.gameOver && atBatCount < maxAtBats) {
      // Track pitcher composure before this at-bat
      const pitcher = getCurrentPitcher(state);
      const oldZone = pitcher._composure ? getBehaviorZone(pitcher._composure.composure).label : 'NONE';
      
      try {
        // CPU-driven sim (both sides)
        const cpuPitch = cpuSelectPitch(state);
        const cpuSwing = cpuSelectSwing(state);
        state = processAtBat(state, PITCH_TYPES[cpuPitch], SWING_TYPES[cpuSwing]);
        
        // Track zone transition
        const newZone = pitcher._composure ? getBehaviorZone(pitcher._composure.composure).label : 'NONE';
        trackComposureEvent(tracking, pitcher.name, oldZone, newZone, pitcher._composure?.composure || 100);
        
        // Apply CPU substitutions
        const userTeam = homeTeam;
        state = cpuDecideSubstitutions(state, userTeam);
        
        atBatCount++;
      } catch (e) {
        console.error(`Error in at-bat ${atBatCount}:`, e.message);
        break;
      }
    }
    
    console.log(`  Final: ${state.score.home}-${state.score.away} (${atBatCount} at-bats)`);
  }
  
  // Generate report
  generateComposureReport(tracking);
  return tracking;
}

// Export for manual testing in browser console
if (typeof window !== 'undefined') {
  window.runComposureSimTests = runComposureSimTests;
}