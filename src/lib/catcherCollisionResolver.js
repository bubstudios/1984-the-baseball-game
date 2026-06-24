// ════════════════════════════════════════════════════════════════
// CATCHER COLLISION RESOLVER
// Specialized incident handling for runner-catcher collisions
// ════════════════════════════════════════════════════════════════

import {
  createIncident,
  resolveIncident,
  INCIDENT_TYPES,
  CONTACT_SEVERITY,
  INTENT_LEVEL,
  CONTROVERSY_LEVEL,
  ESCALATION_LEVEL,
} from './incidentSystem.js';

export function resolveCatcherCollision(gameState, runnerName, catcherName, result, managers) {
  // Create incident
  const incident = createIncident(INCIDENT_TYPES.CATCHER_COLLISION, gameState.inning, gameState);
  
  // Step 1: Analyze the play mechanics
  const catcherHadBall = result.catcherHadBall !== false;
  const catcherWasBlocking = result.catcherWasBlocking !== false;
  const runnerSlid = result.runnerSlid === true;
  const runnerLoweredShoulder = result.runnerLoweredShoulder === true;
  const runnerMadeAvoidableContact = result.runnerMadeAvoidableContact !== false;
  
  // Determine contact severity based on mechanics
  let contactSeverity = CONTACT_SEVERITY.ROUTINE;
  
  if (runnerLoweredShoulder) {
    contactSeverity = CONTACT_SEVERITY.EXTREME;
  } else if (runnerMadeAvoidableContact && !runnerSlid) {
    contactSeverity = CONTACT_SEVERITY.ROUGH;
  } else if (!runnerSlid && catcherWasBlocking) {
    contactSeverity = CONTACT_SEVERITY.NOTICEABLE;
  } else {
    contactSeverity = CONTACT_SEVERITY.ROUTINE;
  }
  
  // Determine intent
  let apparentIntent = INTENT_LEVEL.CLEARLY_ACCIDENTAL;
  
  if (runnerLoweredShoulder) {
    apparentIntent = INTENT_LEVEL.PROBABLY_INTENTIONAL;
  } else if (!runnerSlid && catcherWasBlocking) {
    apparentIntent = INTENT_LEVEL.UNCLEAR;
  } else if (runnerMadeAvoidableContact && catcherWasBlocking) {
    apparentIntent = INTENT_LEVEL.PROBABLY_ACCIDENTAL;
  }
  
  // Set incident properties
  incident.primaryPlayer = runnerName;
  incident.secondaryPlayer = catcherName;
  incident.contactSeverity = contactSeverity;
  incident.apparentIntent = apparentIntent;
  incident.injuryRisk = contactSeverity * 20; // 0-80 risk
  incident.controversyLevel = 
    catcherWasBlocking && runnerMadeAvoidableContact ? CONTROVERSY_LEVEL.STRONG : CONTROVERSY_LEVEL.MILD;
  
  // Determine if run scored (affects tension)
  incident.runScored = result.runScored === true;
  
  // Resolve the incident through full sequence
  resolveIncident(incident, gameState, managers);
  
  // Set escalation level based on resolution
  const primaryReaction = incident.resolution.primaryPlayerReaction;
  const secondaryReaction = incident.resolution.secondaryPlayerReaction;
  const managerArgued = incident.resolution.managerArgued;
  
  if (incident.resolution.primaryPlayerEjected || incident.resolution.secondaryPlayerEjected) {
    incident.resolution.escalationLevel = ESCALATION_LEVEL.PHYSICAL_CONFRONTATION;
  } else if (primaryReaction === 'charges' || primaryReaction === 'shoves') {
    incident.resolution.escalationLevel = ESCALATION_LEVEL.PHYSICAL_CONFRONTATION;
  } else if (primaryReaction === 'exchanges_words' && secondaryReaction === 'exchanges_words') {
    incident.resolution.escalationLevel = ESCALATION_LEVEL.VERBAL_CONFRONTATION;
  } else if (primaryReaction === 'stares' || secondaryReaction === 'stares_back') {
    incident.resolution.escalationLevel = ESCALATION_LEVEL.VISIBLE_REACTION;
  }
  
  return incident;
}

export function getCatcherCollisionDescription(incident) {
  const runner = incident.primaryPlayer;
  const catcher = incident.secondaryPlayer;
  const contactSev = incident.contactSeverity;
  const intent = incident.apparentIntent;
  
  if (contactSev === CONTACT_SEVERITY.EXTREME) {
    return `A violent, shoulder-first collision between ${runner} and catcher ${catcher}!`;
  } else if (contactSev === CONTACT_SEVERITY.DANGEROUS) {
    return `${runner} and ${catcher} collide hard at the plate!`;
  } else if (contactSev === CONTACT_SEVERITY.ROUGH) {
    const intentStr = intent >= INTENT_LEVEL.UNCLEAR ? 'questionable ' : '';
    return `A ${intentStr}collision at home plate as ${runner} and ${catcher} meet!`;
  } else if (contactSev === CONTACT_SEVERITY.NOTICEABLE) {
    return `${runner} and ${catcher} make contact at the plate.`;
  } else {
    return `${runner} slides into home and ${catcher} applies the tag.`;
  }
}