// Player-to-player hostility tracking
// Tracks temporary tension between specific players during a single game

export function initializePlayerMemory() {
  return {
    hostilities: [], // Array of { sourcePlayer, targetPlayer, amount, reason, inning, resolved }
  };
}

export function addHostility(gameState, sourcePlayer, targetPlayer, amount, reason, inning) {
  if (!gameState._playerMemory) {
    gameState._playerMemory = initializePlayerMemory();
  }
  
  const existing = gameState._playerMemory.hostilities.find(
    h => h.sourcePlayer === sourcePlayer && h.targetPlayer === targetPlayer && !h.resolved
  );
  
  if (existing) {
    existing.amount += amount;
    existing.reason = reason; // most recent reason
    existing.inning = inning;
  } else {
    gameState._playerMemory.hostilities.push({
      sourcePlayer,
      targetPlayer,
      amount,
      reason,
      inning,
      resolved: false,
    });
  }
  
  return gameState;
}

export function getHostility(gameState, sourcePlayer, targetPlayer) {
  if (!gameState._playerMemory) return 0;
  const h = gameState._playerMemory.hostilities.find(
    h => h.sourcePlayer === sourcePlayer && h.targetPlayer === targetPlayer && !h.resolved
  );
  return h ? h.amount : 0;
}

export function resolveHostility(gameState, sourcePlayer, targetPlayer) {
  if (!gameState._playerMemory) return gameState;
  const h = gameState._playerMemory.hostilities.find(
    hh => hh.sourcePlayer === sourcePlayer && hh.targetPlayer === targetPlayer && !hh.resolved
  );
  if (h) h.resolved = true;
  return gameState;
}

// Higher hostility → higher chance of inside pitch, harder tag, aggressive slide
export function getHostilityEffect(hostility) {
  if (hostility < 5) return 0; // no effect
  if (hostility < 15) return 0.1; // 10% increased aggression
  if (hostility < 30) return 0.2; // 20% increased aggression
  return 0.3; // 30% max
}