// Umpire patience tracking
// Umpires lose patience over repeated complaints and arguments
// Affects ejection thresholds throughout the game

export function initializeUmpirePatience(umpire) {
  return {
    umpire,
    patience: 100, // 0-100 scale
    complaintsByPlayer: {}, // { playerName: count }
    argumentsByManager: {}, // { managerName: count }
    warnings: [], // { player, type, inning }
  };
}

export function reducePatience(gameState, amount, reason, playerOrManager) {
  if (!gameState._umpirePatience) {
    gameState._umpirePatience = initializeUmpirePatience(gameState.umpire);
  }
  gameState._umpirePatience.patience = Math.max(0, gameState._umpirePatience.patience - amount);
  return gameState;
}

export function addComplaint(gameState, playerName) {
  if (!gameState._umpirePatience) {
    gameState._umpirePatience = initializeUmpirePatience(gameState.umpire);
  }
  gameState._umpirePatience.complaintsByPlayer[playerName] = 
    (gameState._umpirePatience.complaintsByPlayer[playerName] || 0) + 1;
  
  const count = gameState._umpirePatience.complaintsByPlayer[playerName];
  
  // First complaint: -2, each subsequent: escalating
  const penalty = count === 1 ? 2 : count === 2 ? 7 : 15;
  reducePatience(gameState, penalty, `complaint_${count}`, playerName);
  
  return gameState;
}

export function addManagerArgument(gameState, managerName) {
  if (!gameState._umpirePatience) {
    gameState._umpirePatience = initializeUmpirePatience(gameState.umpire);
  }
  gameState._umpirePatience.argumentsByManager[managerName] = 
    (gameState._umpirePatience.argumentsByManager[managerName] || 0) + 1;
  
  reducePatience(gameState, 8, `manager_argument`, managerName);
  return gameState;
}

export function getPatience(gameState) {
  if (!gameState._umpirePatience) return 100;
  return gameState._umpirePatience.patience;
}

export function getComplaintCount(gameState, playerName) {
  if (!gameState._umpirePatience) return 0;
  return gameState._umpirePatience.complaintsByPlayer[playerName] || 0;
}

// Patience meter affects ejection threshold
export function getEjectionThreshold(umpire, currentPatience) {
  // High patience = harder to eject (higher threshold)
  // Low patience = easier to eject (lower threshold)
  const baseThreshold = umpire?.ejectTolerance || 5;
  const adjustment = (100 - currentPatience) / 20; // 0 to 5 added severity
  return baseThreshold - adjustment;
}

// Patience recovers slightly during quiet innings
export function recoverPatience(gameState) {
  if (!gameState._umpirePatience) return gameState;
  gameState._umpirePatience.patience = Math.min(100, gameState._umpirePatience.patience + 3);
  return gameState;
}