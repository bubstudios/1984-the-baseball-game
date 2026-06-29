/**
 * Composure-Driven Events
 * 
 * Rolls for minor issues and major actions when a pitcher's composure drops.
 * Returns event descriptors - the game engine applies the actual effects.
 */
import { checkMinorIssue, checkMajorAction, getBehaviorZone, BEHAVIOR_ZONES } from './pitcherComposure';

const MINOR_ISSUE_LINES = [
  "{name} kicks the rosin bag - he's fighting himself out there.",
  "{name} mutters something under his breath on the mound...",
  "The body language from {name} is deteriorating - shoulders slumping.",
  "{name} can't find a rhythm - he's pacing behind the mound.",
  "{name} stares at the dirt - this isn't going the way he drew it up.",
  "You can see the frustration building on {name}'s face.",
  "{name} takes off his cap and runs his hand through his hair - he's pressing.",
  "The pitching coach stirs in the dugout - {name} needs to settle down.",
];

const ARGUMENT_LINES = [
  "{name} starts barking at the umpire - he's had enough of this zone!",
  "{name} charges toward the plate ump - he's losing it completely!",
  "{name} is screaming from the mound - the umpire takes offense!",
  "{name} slams his glove on the mound and starts jawing at the ump!",
  "{name} gestures wildly at the last call - the umpire isn't having it!",
];

const THROWAT_LINES = [
  "{name} is staring a hole through the batter - the next one might be coming letter-high!",
  "{name} mutters something and zeroes in on the batter - tension is rising!",
  "The look on {name}'s face says it all - he's about to send a message!",
  "{name} is gearing up - this could get ugly fast!",
  "{name} glares at the batter and grips the ball tighter - watch out!",
];

const WALKOFF_LINES = [
  "{name} has completely checked out - his eyes are glassy on the mound!",
  "The wheels have come off for {name} - he looks like he wants to be anywhere else!",
  "{name} is going through the motions - the fight is gone from him!",
  "You can see it in {name}'s body language - he's mentally already in the clubhouse!",
  "{name} has that thousand-yard stare - this one's over for him mentally!",
  "The competitive fire in {name} has gone out - he's just hoping to survive!",
];

const COMPOSURE_WP_LINES = [
  "{name} uncorks one to the backstop - he completely lost his grip!",
  "The ball slips out of {name}'s hand - it rolls to the backstop!",
  "{name} spikes one into the dirt - it gets away from the catcher!",
];

function pickLine(lines) {
  return lines[Math.floor(Math.random() * lines.length)];
}

function formatLine(line, pitcher) {
  return line.replace(/{name}/g, pitcher.name.split(' ').pop());
}

/**
 * Roll for a composure event. Returns an event descriptor or null.
 * Does NOT modify state - the caller applies the effects.
 */
export function rollComposureEvent(state, pitcher) {
  if (!pitcher || !pitcher._composure) return null;
  if (state.gameOver) return null;

  const composure = pitcher._composure.composure;
  const zone = getBehaviorZone(composure);

  // Locked In pitchers don't have issues
  if (zone === BEHAVIOR_ZONES.LOCKED_IN) return null;

  // Check minor issue first
  if (checkMinorIssue(composure, pitcher._composure)) {
    return { action: 'minor', text: formatLine(pickLine(MINOR_ISSUE_LINES), pitcher), composure };
  }

  // Check major action (only in Pressing or Red Zone)
  const action = checkMajorAction(composure, pitcher._composure);
  if (!action) return null;

  switch (action) {
    case 'argument':
      return {
        action: 'argument',
        text: formatLine(pickLine(ARGUMENT_LINES), pitcher),
        composure,
        alreadyWarned: !!state._beanball?.warningIssued,
      };
    case 'throwat':
      return {
        action: 'throwat',
        text: formatLine(pickLine(THROWAT_LINES), pitcher),
        composure,
      };
    case 'walkoff': {
      const dropAmount = 15 + Math.floor(Math.random() * 10);
      return {
        action: 'walkoff',
        text: formatLine(pickLine(WALKOFF_LINES), pitcher),
        composure,
        dropAmount,
      };
    }
    case 'wildpitch': {
      const hasRunners = state.bases.some(b => b !== null);
      return {
        action: 'wildpitch',
        text: formatLine(pickLine(COMPOSURE_WP_LINES), pitcher),
        composure,
        hasRunners,
      };
    }
  }

  return null;
}