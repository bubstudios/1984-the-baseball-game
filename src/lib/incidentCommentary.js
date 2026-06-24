// ════════════════════════════════════════════════════════════════
// INCIDENT COMMENTARY POOLS
// Commentary for all incident stages and outcomes
// ════════════════════════════════════════════════════════════════

export const COLLISION_COMMENTARY = {
  violent: [
    "A violent collision at the plate!",
    "The runner and catcher meet with tremendous force!",
    "Both players are down after that impact!",
    "That was a violent, old-fashioned collision!",
  ],
  hard: [
    "A hard collision at home plate!",
    "The catcher and runner collide with intensity!",
    "That was a heavy collision!",
  ],
  moderate: [
    "The runner and catcher make contact at the plate.",
    "A collision as the runner reaches home.",
  ],
};

export const PLAYER_REACTION_COMMENTARY = {
  gets_up_returns: [
    "The {player} gets up and returns to position.",
    "Both players shake it off and continue.",
  ],
  stares: [
    "The {player} gets up and stares toward the {other_player}.",
    "The catcher stares at the runner after the collision.",
  ],
  stares_back: [
    "The other player returns the stare.",
    "They exchange a long look.",
  ],
  exchanges_words: [
    "The {player} and {other_player} are exchanging words.",
    "Both players are now talking to each other.",
    "{player} has something to say about that collision.",
  ],
  shoves: [
    "The {player} shoves {other_player}!",
    "That shove could escalate things!",
  ],
  charges: [
    "The {player} charges toward {other_player}!",
    "{player} is coming at {other_player}!",
  ],
  remains_down: [
    "The {player} remains down after that collision.",
    "{player} is still on the ground.",
  ],
};

export const TEAMMATE_INTERVENTION_COMMENTARY = [
  "Teammates quickly step between the two players.",
  "Players from both teams are moving toward the action.",
  "The benches are aware—everyone is watching closely.",
  "A teammate puts a hand on the {player} and leads him away.",
];

export const INJURY_CHECK_COMMENTARY = {
  shaken_up: [
    "The trainer is coming out to check on the {player}.",
    "The {player} is shaken up but appears to be okay.",
    "He's moving slowly, but determined to stay in the game.",
  ],
  temporarily_hurt: [
    "The trainer is examining the {player} carefully.",
    "He's hurt—they're checking his shoulder.",
    "The {player} may need a moment before continuing.",
  ],
  must_leave: [
    "The {player} is unable to continue.",
    "He's coming out of the game.",
    "The injury is serious enough that {he/she} must be replaced.",
  ],
  serious: [
    "Medical personnel are rushing onto the field.",
    "The {player} is in significant distress.",
  ],
};

export const UMPIRE_ACTION_COMMENTARY = {
  no_action: [
    "The umpire watches the play closely but takes no action.",
    "Play resumes without any warnings.",
  ],
  separate_players: [
    "The umpire steps between the two players.",
    "The home plate umpire separates the combatants.",
  ],
  warn_both_teams: [
    "The umpire is warning both teams to settle down.",
    "Both benches have now been warned.",
    "The umpire makes it clear: one more incident and someone's gone.",
  ],
  eject_player: [
    "The umpire points—that player has been ejected!",
    "He has been thrown out of the ballgame!",
  ],
  call_managers: [
    "The umpire is calling the managers together.",
    "This is serious—the managers are coming to home plate.",
  ],
};

export const MANAGER_RESPONSE_COMMENTARY = {
  argued: [
    "The manager is out of the dugout immediately.",
    "He's coming out to argue the call!",
    "The manager believes that contact was unnecessary.",
  ],
  ejected: [
    "And now the manager is being ejected!",
    "The umpire has heard enough from the bench!",
    "The manager is gone—he's been tossed from the game!",
  ],
};

export const BENCH_RESPONSE_COMMENTARY = [
  "Players are standing up in both dugouts.",
  "The benches are emptying—everyone is focused on home plate.",
  "Coaches are trying to keep the clubs separated.",
  "Tempers are flaring after that play.",
  "This game has reached a heated emotional level.",
];

export const POST_INCIDENT_COMMENTARY = {
  resolved: [
    "Order has been restored.",
    "The game is ready to resume.",
    "Both teams settle back in.",
  ],
  tension: [
    "The teams return to their dugouts, but this may not be over.",
    "Everyone will be watching the next inside pitch.",
    "That collision has changed the mood of this ballgame.",
    "The league office may review what just happened here.",
  ],
};

export function formatCommentary(template, data = {}) {
  let text = template;
  Object.entries(data).forEach(([key, value]) => {
    text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return text;
}

export function getRandomCommentary(pool) {
  if (Array.isArray(pool)) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return '';
}