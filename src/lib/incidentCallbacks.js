// Incident callback commentary
// Announcers reference earlier events in the game

const CALLBACK_LINES = {
  hbp_repeat: [
    'He was hit the last time these two met.',
    'The pitcher may be remembering the earlier incident.',
    'History between these two now.',
  ],
  
  collision_repeat: [
    'That is the catcher involved in the hard play earlier.',
    'There is clearly still some unfinished business.',
    'The runner who collided with him earlier-this could get tense.',
  ],

  after_ejection: [
    'The ejection has changed the dynamics of this game.',
    'Without their manager, the team will need to stay composed.',
    'That ejection may have fired up the dugout.',
  ],

  after_warning: [
    'After the earlier warning, both sides need to be careful.',
    'The umpire has already issued warnings-no more chances.',
    'One more incident and we could see another ejection.',
  ],

  argument_history: [
    'The manager has already had words with the umpire.',
    'After the earlier confrontation, tensions are still high.',
    'He is running out of patience with this crew.',
  ],

  hr_celebrated: [
    'That home run was celebrated pretty hard.',
    'The pitcher may not have forgotten how that last one was shown up.',
    'A little showboating can come back to haunt you.',
  ],

  momentum_negative: [
    'This team is pressing now.',
    'Frustration is starting to build.',
    'The momentum has clearly shifted.',
  ],
};

export function pickCallbackCommentary(gameState, eventType, sourcePlayer, targetPlayer) {
  if (!gameState._incidents || gameState._incidents.length === 0) return null;

  const recentIncidents = gameState._incidents.slice(-5);

  // HBP callback
  if (eventType === 'hbp' && targetPlayer) {
    const priorHBP = recentIncidents.find(
      i => i.type === 'hbp' && i.description.includes(sourcePlayer?.name || '')
    );
    if (priorHBP) {
      return CALLBACK_LINES.hbp_repeat[Math.floor(Math.random() * CALLBACK_LINES.hbp_repeat.length)];
    }
  }

  // Collision callback
  if (eventType === 'collision' && targetPlayer) {
    const priorCollision = recentIncidents.find(
      i => i.type === 'collision' && i.description.includes(targetPlayer?.name || '')
    );
    if (priorCollision) {
      return CALLBACK_LINES.collision_repeat[
        Math.floor(Math.random() * CALLBACK_LINES.collision_repeat.length)
      ];
    }
  }

  // Ejection callback
  if (eventType === 'after_ejection') {
    return CALLBACK_LINES.after_ejection[Math.floor(Math.random() * CALLBACK_LINES.after_ejection.length)];
  }

  // Warning history callback
  if (eventType === 'pitch' && gameState._umpirePatience) {
    const recentWarning = recentIncidents.find(i => i.type === 'warning');
    if (recentWarning && gameState._umpirePatience.patience < 70) {
      return CALLBACK_LINES.after_warning[
        Math.floor(Math.random() * CALLBACK_LINES.after_warning.length)
      ];
    }
  }

  // Home run celebration callback
  if (eventType === 'pitch_after_hr') {
    const recentHR = recentIncidents.find(i => i.type === 'homerun' && i.description.includes('celebrated'));
    if (recentHR) {
      return CALLBACK_LINES.hr_celebrated[Math.floor(Math.random() * CALLBACK_LINES.hr_celebrated.length)];
    }
  }

  return null;
}