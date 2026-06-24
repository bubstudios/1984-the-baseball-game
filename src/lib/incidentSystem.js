// ══════════════════════════════════════════════════════════════════
// INCIDENT SYSTEM
// Central event system for on-field incidents, reactions, and escalations
// ══════════════════════════════════════════════════════════════════

export const INCIDENT_TYPES = {
  HBP: 'hbp',
  PITCH_BEHIND: 'pitch_behind',
  CATCHER_COLLISION: 'catcher_collision',
  BASE_COLLISION: 'base_collision',
  FIELDER_COLLISION: 'fielder_collision',
  HARD_SLIDE: 'hard_slide',
  DOUBLE_PLAY_TAKEOUT: 'double_play_takeout',
  HARD_TAG: 'hard_tag',
  BATTER_CHARGES_MOUND: 'batter_charges_mound',
  PITCHER_CONFRONTS_BATTER: 'pitcher_confronts_batter',
  EXCESSIVE_CELEBRATION: 'excessive_celebration',
  BAT_FLIP: 'bat_flip',
  PITCHER_CELEBRATES_AT_BATTER: 'pitcher_celebrates_at_batter',
  TAUNTING: 'taunting',
  CONTROVERSIAL_CALL: 'controversial_call',
  RETALIATION: 'retaliation',
};

export const CONTACT_SEVERITY = {
  ROUTINE: 0,
  NOTICEABLE: 1,
  ROUGH: 2,
  DANGEROUS: 3,
  EXTREME: 4,
};

export const INTENT_LEVEL = {
  CLEARLY_ACCIDENTAL: 0,
  PROBABLY_ACCIDENTAL: 1,
  UNCLEAR: 2,
  PROBABLY_INTENTIONAL: 3,
  CLEARLY_INTENTIONAL: 4,
};

export const CONTROVERSY_LEVEL = {
  NONE: 0,
  MILD: 1,
  STRONG: 2,
  HEATED: 3,
  MAJOR_RISK: 4,
};

export const INJURY_STATUS = {
  UNAFFECTED: 'unaffected',
  SHAKEN_UP: 'shaken_up',
  TEMPORARILY_HURT: 'temporarily_hurt',
  MUST_LEAVE: 'must_leave',
  SERIOUS: 'serious',
};

export const ESCALATION_LEVEL = {
  NO_REACTION: 0,
  VISIBLE_REACTION: 1,
  VERBAL_CONFRONTATION: 2,
  PHYSICAL_CONFRONTATION: 3,
  BENCHES_CLEAR: 4,
  FIGHT: 5,
};

export function createIncident(type, inning, gameState) {
  return {
    incidentType: type,
    inning,
    scoreDifference: gameState.score.away - gameState.score.home,
    offensiveTeam: gameState.halfInning === 'top' ? gameState.awayTeam : gameState.homeTeam,
    defensiveTeam: gameState.halfInning === 'top' ? gameState.homeTeam : gameState.awayTeam,
    primaryPlayer: null,
    secondaryPlayer: null,
    contactSeverity: CONTACT_SEVERITY.ROUTINE,
    apparentIntent: INTENT_LEVEL.CLEARLY_ACCIDENTAL,
    injuryRisk: 0,
    controversyLevel: CONTROVERSY_LEVEL.NONE,
    currentGameTension: gameState._gameTension || 0,
    priorRelevantIncidents: [],
    teamsWarned: false,
    callWasClose: false,
    playEndedInning: false,
    runScored: false,
    playChangedLead: false,
    
    // Resolution results
    resolution: {
      primaryPlayerInjury: INJURY_STATUS.UNAFFECTED,
      secondaryPlayerInjury: INJURY_STATUS.UNAFFECTED,
      primaryPlayerReaction: null,
      secondaryPlayerReaction: null,
      teammateIntervention: false,
      managerArgued: false,
      managerEjected: false,
      primaryPlayerEjected: false,
      secondaryPlayerEjected: false,
      umpireAction: null,
      escalationLevel: ESCALATION_LEVEL.NO_REACTION,
      tensionChange: 0,
      commentary: [],
      tempAttributePenalties: {},
    },
  };
}

// Resolve a full incident through all stages
export function resolveIncident(incident, gameState, managers) {
  // Stage 1: Check injuries
  resolveInjuries(incident, gameState);
  
  // Stage 2: Determine immediate player reactions
  resolvePrimaryPlayerReaction(incident, gameState);
  resolveSecondaryPlayerReaction(incident, gameState);
  
  // Stage 3: Determine teammate reactions
  resolveTeammateReactions(incident, gameState);
  
  // Stage 4: Umpire response
  resolveUmpireResponse(incident, gameState);
  
  // Stage 5: Manager response
  resolveManagerResponse(incident, gameState, managers);
  
  // Stage 6: Update game tension
  updateGameTension(incident, gameState);
  
  // Stage 7: Record incident in game memory
  recordIncidentInMemory(incident, gameState);
  
  return incident;
}

function resolveInjuries(incident, gameState) {
  // Determine injury severity based on contact severity and intent
  const injuryChance = Math.min(0.9, (incident.contactSeverity / 4) * 0.7 + (incident.injuryRisk / 100) * 0.3);
  
  // Primary player
  if (Math.random() < injuryChance * 0.6) {
    const roll = Math.random();
    if (roll < 0.5) incident.resolution.primaryPlayerInjury = INJURY_STATUS.SHAKEN_UP;
    else if (roll < 0.8) incident.resolution.primaryPlayerInjury = INJURY_STATUS.TEMPORARILY_HURT;
    else if (roll < 0.95) incident.resolution.primaryPlayerInjury = INJURY_STATUS.MUST_LEAVE;
    else incident.resolution.primaryPlayerInjury = INJURY_STATUS.SERIOUS;
  }
  
  // Secondary player (if applicable)
  if (incident.secondaryPlayer && Math.random() < injuryChance * 0.5) {
    const roll = Math.random();
    if (roll < 0.5) incident.resolution.secondaryPlayerInjury = INJURY_STATUS.SHAKEN_UP;
    else if (roll < 0.8) incident.resolution.secondaryPlayerInjury = INJURY_STATUS.TEMPORARILY_HURT;
    else if (roll < 0.95) incident.resolution.secondaryPlayerInjury = INJURY_STATUS.MUST_LEAVE;
    else incident.resolution.secondaryPlayerInjury = INJURY_STATUS.SERIOUS;
  }
  
  // Apply temporary penalties for injuries
  if (incident.resolution.primaryPlayerInjury !== INJURY_STATUS.UNAFFECTED) {
    const penalty = incident.resolution.primaryPlayerInjury === INJURY_STATUS.SHAKEN_UP ? 5 : 10;
    incident.resolution.tempAttributePenalties[`${incident.primaryPlayer}:speed`] = -penalty;
    incident.resolution.tempAttributePenalties[`${incident.primaryPlayer}:contact`] = -penalty;
  }
}

function resolvePrimaryPlayerReaction(incident, gameState) {
  const player = getPlayer(incident.primaryPlayer, gameState);
  if (!player) return;
  
  const temper = player.temper || 5;
  const composure = player.composure || 5;
  const retaliation = player.retaliation || 5;
  const injuryStatus = incident.resolution.primaryPlayerInjury;
  
  // Determine reaction based on temper, composure, injury, and incident severity
  const reactionRoll = Math.random();
  const temperInfluence = (temper / 10) * 0.4;
  const injuryInfluence = (injuryStatus !== INJURY_STATUS.UNAFFECTED ? 0.2 : 0);
  const contactInfluence = (incident.contactSeverity / 4) * 0.3;
  const intentInfluence = (incident.apparentIntent / 4) * 0.1;
  
  const reactivityScore = temperInfluence + injuryInfluence + contactInfluence + intentInfluence;
  
  if (reactionRoll < 0.4) {
    incident.resolution.primaryPlayerReaction = 'gets_up_returns';
  } else if (reactionRoll < 0.6) {
    incident.resolution.primaryPlayerReaction = 'stares';
  } else if (reactionRoll < 0.75 && reactivityScore > 0.4) {
    incident.resolution.primaryPlayerReaction = 'exchanges_words';
  } else if (reactionRoll < 0.88 && reactivityScore > 0.6 && incident.apparentIntent >= INTENT_LEVEL.UNCLEAR) {
    incident.resolution.primaryPlayerReaction = 'shoves';
  } else if (reactionRoll < 0.98 && reactivityScore > 0.8 && incident.apparentIntent >= INTENT_LEVEL.PROBABLY_INTENTIONAL) {
    incident.resolution.primaryPlayerReaction = 'charges';
  } else {
    incident.resolution.primaryPlayerReaction = 'gets_up_returns';
  }
  
  // If injured or shaken, reduce reaction intensity
  if (injuryStatus === INJURY_STATUS.MUST_LEAVE || injuryStatus === INJURY_STATUS.SERIOUS) {
    incident.resolution.primaryPlayerReaction = 'remains_down';
  }
}

function resolveSecondaryPlayerReaction(incident, gameState) {
  const player = getPlayer(incident.secondaryPlayer, gameState);
  if (!player) return;
  
  const injuryStatus = incident.resolution.secondaryPlayerInjury;
  const primaryReaction = incident.resolution.primaryPlayerReaction;
  
  if (injuryStatus === INJURY_STATUS.MUST_LEAVE || injuryStatus === INJURY_STATUS.SERIOUS) {
    incident.resolution.secondaryPlayerReaction = 'remains_down';
    return;
  }
  
  // React to primary player's reaction
  if (primaryReaction === 'exchanges_words' || primaryReaction === 'shoves' || primaryReaction === 'charges') {
    incident.resolution.secondaryPlayerReaction = 'exchanges_words';
  } else if (primaryReaction === 'stares') {
    incident.resolution.secondaryPlayerReaction = 'stares_back';
  } else {
    incident.resolution.secondaryPlayerReaction = 'gets_up_returns';
  }
}

function resolveTeammateReactions(incident, gameState) {
  // Small chance teammates intervene if things are heating up
  const primaryReaction = incident.resolution.primaryPlayerReaction;
  const secondaryReaction = incident.resolution.secondaryPlayerReaction;
  
  const needsIntervention = 
    primaryReaction === 'exchanges_words' || 
    primaryReaction === 'shoves' || 
    primaryReaction === 'charges' ||
    secondaryReaction === 'exchanges_words';
  
  if (needsIntervention && Math.random() < 0.6) {
    incident.resolution.teammateIntervention = true;
  }
}

function resolveUmpireResponse(incident, gameState) {
  // Umpire evaluates severity, intent, prior warnings, etc.
  const umpire = gameState.umpire || {};
  const strictness = umpire.strictness || 5;
  const tolerance = umpire.tolerance || 5;
  const teamsAlreadyWarned = gameState._teamsWarned || false;
  
  const primaryReaction = incident.resolution.primaryPlayerReaction;
  const secondaryReaction = incident.resolution.secondaryPlayerReaction;
  
  const escalationScore = 
    (incident.contactSeverity / 4) * 0.3 +
    (incident.apparentIntent / 4) * 0.2 +
    (primaryReaction === 'charges' ? 0.5 : primaryReaction === 'shoves' ? 0.3 : 0);
  
  const umpireThreshold = (tolerance / 10) - (strictness / 20);
  
  if (escalationScore > 0.7) {
    // Likely ejection or strong warning
    if (Math.random() < 0.6 && incident.apparentIntent >= INTENT_LEVEL.PROBABLY_INTENTIONAL) {
      incident.resolution.umpireAction = 'eject_player';
      if (primaryReaction === 'charges') {
        incident.resolution.primaryPlayerEjected = true;
      } else {
        incident.resolution.secondaryPlayerEjected = true;
      }
    } else {
      incident.resolution.umpireAction = 'warn_both_teams';
      gameState._teamsWarned = true;
    }
  } else if (escalationScore > 0.3) {
    incident.resolution.umpireAction = 'separate_players';
    if (!teamsAlreadyWarned && Math.random() < 0.4) {
      gameState._teamsWarned = true;
      incident.resolution.umpireAction = 'warn_both_teams';
    }
  } else {
    incident.resolution.umpireAction = 'no_action';
  }
}

function resolveManagerResponse(incident, gameState, managers) {
  const managingTeam = incident.primaryPlayer ? incident.offensiveTeam : incident.defensiveTeam;
  const manager = managers[managingTeam];
  if (!manager) return;
  
  const managerTemper = manager.personality || 5;
  const protectiveness = manager.protectiveness || 5;
  const injurySeverity = incident.resolution.primaryPlayerInjury !== INJURY_STATUS.UNAFFECTED ? 1 : 0;
  const callAgainstTeam = incident.offensiveTeam === managingTeam && incident.contactSeverity > 1;
  
  const arguementLikelihood = 
    (managerTemper / 10) * 0.3 +
    (injurySeverity * 0.3) +
    (callAgainstTeam ? 0.3 : 0);
  
  if (Math.random() < arguementLikelihood && incident.resolution.umpireAction) {
    incident.resolution.managerArgued = true;
    
    // Chance of manager ejection if heated
    if (Math.random() < (managerTemper / 10) * 0.4 && incident.resolution.umpireAction === 'warn_both_teams') {
      incident.resolution.managerEjected = true;
    }
  }
}

function updateGameTension(incident, gameState) {
  let tensionDelta = 0;
  
  // Base tension from contact severity
  switch (incident.contactSeverity) {
    case CONTACT_SEVERITY.ROUTINE:
      tensionDelta = 0;
      break;
    case CONTACT_SEVERITY.NOTICEABLE:
      tensionDelta = 2;
      break;
    case CONTACT_SEVERITY.ROUGH:
      tensionDelta = incident.apparentIntent >= INTENT_LEVEL.UNCLEAR ? 12 : 5;
      break;
    case CONTACT_SEVERITY.DANGEROUS:
      tensionDelta = 15;
      break;
    case CONTACT_SEVERITY.EXTREME:
      tensionDelta = 25;
      break;
  }
  
  // Escalation modifiers
  if (incident.resolution.escalationLevel >= ESCALATION_LEVEL.VERBAL_CONFRONTATION) tensionDelta += 8;
  if (incident.resolution.escalationLevel >= ESCALATION_LEVEL.PHYSICAL_CONFRONTATION) tensionDelta += 15;
  if (incident.resolution.escalationLevel >= ESCALATION_LEVEL.BENCHES_CLEAR) tensionDelta += 20;
  
  // Action modifiers
  if (incident.resolution.primaryPlayerEjected || incident.resolution.secondaryPlayerEjected) tensionDelta += 10;
  if (incident.resolution.managerEjected) tensionDelta += 15;
  if (incident.resolution.primaryPlayerInjury !== INJURY_STATUS.UNAFFECTED) tensionDelta += 5;
  
  incident.resolution.tensionChange = tensionDelta;
  gameState._gameTension = (gameState._gameTension || 0) + tensionDelta;
  
  // Clamp tension
  gameState._gameTension = Math.max(0, Math.min(100, gameState._gameTension));
}

function recordIncidentInMemory(incident, gameState) {
  if (!gameState._incidents) gameState._incidents = [];
  gameState._incidents.push(incident);
}

function getPlayer(playerName, gameState) {
  if (!playerName) return null;
  const allPlayers = [
    ...gameState.homeLineup,
    ...gameState.awayLineup,
    ...(gameState.homePlayerHistory || []),
    ...(gameState.awayPlayerHistory || []),
  ];
  return allPlayers.find(p => p.name === playerName);
}

export function escalateToBenches(incident, gameState) {
  // Trigger benches clearing
  incident.resolution.escalationLevel = ESCALATION_LEVEL.BENCHES_CLEAR;
  incident.resolution.tensionChange += 20;
  gameState._gameTension = Math.min(100, (gameState._gameTension || 0) + 20);
}

export function getIncidentReport(gameState) {
  const incidents = gameState._incidents || [];
  return {
    totalIncidents: incidents.length,
    incidents,
    finalTension: gameState._gameTension || 0,
    playersEjected: incidents.filter(i => i.resolution.primaryPlayerEjected || i.resolution.secondaryPlayerEjected),
    managersEjected: incidents.filter(i => i.resolution.managerEjected),
    benchClears: incidents.filter(i => i.resolution.escalationLevel >= ESCALATION_LEVEL.BENCHES_CLEAR),
  };
}