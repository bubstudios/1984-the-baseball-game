// Defensive Plays — Diving Catches, Diving Stops, HR Robberies
// Commentary and wall-height logic for 1984: The Baseball Season

import { BALLPARKS, getWallHeight } from './ballparks';

// ── Wall height check: can a HR be robbed at this ballpark+direction? ──
export function isWallRobable(ballparkName, hitDirection) {
  const bp = BALLPARKS[ballparkName];
  if (!bp) return false;
  const wallHeight = getWallHeight(bp, hitDirection);
  // Green Monster (37') — impossible
  if (wallHeight > 11) return false;
  // Wrigley: ivy + basket makes robberies impractical
  if (bp.quirks.includes('ivy') || bp.quirks.includes('basket')) return false;
  // Fenway LF/LCF = Green Monster
  if (bp.quirks.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) return false;
  return true;
}

// ── HR ROBBERY CHANCE ──
// Very rare: ~3% per home run (about 1 per 12-15 games)
export function rollHRRobbery() {
  return Math.random() < 0.03;
}

// ── GENERIC HR ROBBERY CALLS ──
const GENERIC_ROBBERY_CALLS = [
  "HE TOOK A HOME RUN AWAY!",
  "What a catch — he robbed him!",
  "He climbed the wall and brought it back!",
  "That ball looked gone!",
  "A game-saving grab at the wall!",
  "He timed his leap perfectly — robbed a home run!",
];

// ── TEAM-SPECIFIC HR ROBBERY CALLS ──
const ROBBERY_TEAM_CALLS = {
  cubs: [
    "HOLY COW! HE TOOK IT BACK!",
    "I don't believe it — he robbed a home run!",
    "That ball was gone and he brought it back!",
  ],
  dodgers: [
    "He climbed the wall... and caught it.",
    "A remarkable play — he robbed a home run.",
    "He brought it back from beyond the fence.",
  ],
  yankees: [
    "Holy Cow! Are you kidding me?! He took a home run away!",
    "I thought that was gone! What a grab!",
    "He reached over the wall and stole a homer!",
  ],
  tigers: [
    "What a catch — he took away a home run.",
    "Fans won't forget that one — he robbed him!",
    "He leaped and brought it back from over the fence.",
  ],
  padres: [
    "Oh Doctor! He took a home run away!",
    "You can hang a star on that one, baby — what a robbery!",
    "He climbed the wall — that ball was gone and he stole it!",
  ],
  redsox: [
    "He jumped and pulled it back — robbed a home run!",
    "That ball was over the fence and he brought it back!",
    "An incredible theft at the wall!",
  ],
  mets: [
    "He climbed the wall and stole a home run — the crowd at Shea goes wild!",
    "He reached over the fence — he took a homer away!",
    "What a play! He robbed a home run!",
  ],
  orioles: [
    "He climbed the wall and brought it back — a home run robbery!",
    "That ball was gone and he pulled it back!",
    "He stole a home run from the birds!",
  ],
  reds: [
    "He climbed the wall at Riverfront — he took a home run away!",
    "He timed his jump perfectly — the ball is in his glove!",
    "He reached over the fence — a spectacular home run robbery!",
  ],
  royals: [
    "He leaped at the wall near the fountains — he robbed a home run!",
    "He climbed and brought it back — what a grab at Royals Stadium!",
    "He reached over the fence — that's a home run robbery!",
  ],
};

export function getRobberyCall(homeTeamKey, playerName) {
  const calls = ROBBERY_TEAM_CALLS[homeTeamKey] || GENERIC_ROBBERY_CALLS;
  const call = calls[Math.floor(Math.random() * calls.length)];
  return `⭐ ${playerName} — ${call}`;
}

// ── DIVING CATCHES ──
// Chance: ~2.5% per flyout (about 1 per game)

const DIVING_CATCH_CALLS = [
  "HE LAID OUT FOR IT!",
  "What a catch — full extension!",
  "He got there! Diving grab!",
  "A tremendous defensive play — he laid out!",
  "He dove and made the catch — spectacular!",
  "Full extension — and he snatches it out of the air!",
];

const DIVING_CATCH_TEAM_CALLS = {
  cubs: ["HOLY COW WHAT A CATCH!", "He dove and came up with it! Holy cow!"],
  dodgers: ["A marvelous diving catch.", "He laid out and made the grab — brilliant."],
  yankees: ["Holy Cow! What a diving catch!", "He dove — and he caught it! Holy cow!"],
  tigers: ["He caught it while horizontal — what a play!", "A diving grab — that's a little bit of leather there."],
  padres: ["Oh Doctor! He dove and made the catch!", "What a diving catch — you can hang a star on that!"],
  redsox: ["He dove and made the grab — the Fenway faithful are on their feet!", "Full extension — what a catch!"],
  mets: ["He laid out — and he caught it! What a play at Shea!", "A diving catch — the crowd erupts!"],
  orioles: ["He dove and made the catch — outstanding defense!", "Full extension — he got there!"],
  reds: ["He laid out and made the catch — Riverfront is buzzing!", "A diving grab — spectacular defense!"],
  royals: ["He dove and made the catch — great defense at Royals Stadium!", "He laid out — and came up with the ball!"],
};

export function rollDivingCatch() {
  return Math.random() < 0.025;
}

export function getDivingCatchCall(homeTeamKey, playerName, pos) {
  const teamCalls = DIVING_CATCH_TEAM_CALLS[homeTeamKey];
  const useTeam = teamCalls && Math.random() < 0.55;
  const calls = useTeam ? teamCalls : DIVING_CATCH_CALLS;
  return `🧤 ${playerName} ${calls[Math.floor(Math.random() * calls.length)]}`;
}

// ── DIVING GROUND-BALL STOPS ──
// Chance: ~10% per groundout (about 2 per game)
// Outcomes: spectacular out (20%), knockdown (50%), save a double (30%)

// ── Sub-outcomes for diving stops ──
// outcomeType: 'out_throw' | 'out_run_to_bag' | 'out_knees_throw' | 'knockdown' | 'save'
// 'out_throw'      — fielder dives, pops up, fires to 1B (most common out play)
// 'out_run_to_bag' — fielder dives, scrambles to step on 1B/2B/3B themselves
// 'out_knees_throw'— fielder stays down, fires from his knees

const DIVING_STOP_OUT_THROW_CALLS = [
  "He dove, popped up, and fired to first — GOT HIM!",
  "Outstanding play — he dove, came up throwing, and the runner is out!",
  "He dove and threw him out on a bang-bang play at first!",
  "Incredible range — he dove, fired across the diamond, OUT!",
  "He made the stop and gunned him down at first!",
];

const DIVING_STOP_OUT_RUN_CALLS = [
  "He dove, scrambled to his feet, and beat the runner to the bag!",
  "He dove for it — got up and ran to first himself — SAFE? NO, OUT!",
  "He dove, popped up and stepped on first before the runner could get there!",
  "He knocked it down and hustled to the bag — OUT!",
];

// Shortstop/2B stepping on bag to force a runner
const DIVING_STOP_FORCE_CALLS = [
  "He dove, scrambled up, and stepped on second for the force out!",
  "He knocked it down, bounced up, and tagged the bag — force play!",
  "He dove, got up in a flash, and stepped on the bag before the runner!",
];

// Throw from knees — dramatic
const DIVING_STOP_KNEES_CALLS = [
  "He never got up — fired it from his knees — AND HE GOT HIM!",
  "From the ground! He threw from his knees — the runner is OUT!",
  "Still on the turf — he launched a throw from his knees — OUT at first!",
  "He stayed down and rifled it from his knees — what a play!",
  "On one knee — and he fired it over — GOT HIM!",
];

const DIVING_STOP_OUT_CALLS = [
  "What a stop! He got him!",
  "How did he make that play?!",
  "Outstanding defensive play — he dove and threw him out!",
  "He dove, popped up, and fired — OUT!",
  "From his knees — and he still got him!",
];

const DIVING_STOP_KNOCKDOWN_CALLS = [
  "He kept it in the infield — saved extra bases.",
  "Great effort — he knocked it down.",
  "He dove and kept it on the dirt — nice stop.",
  "He knocked it down but couldn't make the play — infield single.",
  "He got a glove on it — saves a run.",
];

const DIVING_STOP_SAVE_CALLS = [
  "Diving stop — but no throw! He kept it in the infield.",
  "He dove and knocked it down — the runner holds at first.",
  "Great range to get to that — holds the runner to a single.",
  "He dove and kept it from reaching the outfield.",
];

const DIVING_STOP_TEAM_CALLS = {
  cubs: { out: ["HOLY COW! WHAT A PLAY! HE GOT HIM!", "He dove and fired — HOLY COW what a stop!"], knock: ["He kept it in the infield — nice play.", "Great effort — he knocked it down."], save: ["He dove and kept it in the infield — runner reaches with a single.", "He knocked it down — holds the batter to one."] },
  dodgers: { out: ["A sparkling defensive play — he dove and threw him out.", "Brilliant diving stop — and the throw to first is in time."], knock: ["He kept it in the infield — fine defensive effort.", "Knocked it down — prevented extra bases."], save: ["He dove and kept it from reaching the outfield — fine play.", "Great range — holds the batter to a single."] },
  yankees: { out: ["Holy Cow, what a stop — and he got the out!", "He dove, got up, and fired — OUT at first!"], knock: ["He kept it in the infield — nice effort.", "Knocked it down — saved a run."], save: ["Diving stop — holds the batter to a single.", "Great range — keeps the ball in front."] },
  tigers: { out: ["A little bit of leather there — diving stop and he throws him out!", "He dove and made the play — outstanding!"], knock: ["He knocked it down — but the runner reaches on an infield single.", "Good effort — keeps it in the infield."], save: ["He dove and kept it in the infield — the runner holds at first with a single.", "Diving stop — the runner has to hold."] },
  padres: { out: ["Oh Doctor! He dove and threw him out!", "What a diving stop — and he got the out!"], knock: ["He kept it in the infield — oh doctor!", "Knocked it down — saved extra bases."], save: ["Diving stop — holds the batter to a single.", "Great effort to keep the ball in the infield."] },
  redsox: { out: ["He dove and made the play — the Fenway faithful roar!", "Diving stop — and the throw to first is in time!"], knock: ["He knocked it down — great effort.", "Kept it on the infield — nice play."], save: ["Diving stop — holds the batter to a single.", "Great range at Fenway."] },
  mets: { out: ["Diving stop — and he gets the out! Shea is on its feet!", "He dove and threw from his knees — OUT!"], knock: ["He knocked it down — good effort.", "Ball stays in the infield — but it's a knock."], save: ["Diving stop — holds the runner to a single.", "He dove and kept it from going through."] },
  orioles: { out: ["Diving stop — and he throws him out!", "He dove for it — great play!"], knock: ["He knocked it down — saved a run.", "Good effort to keep it in front."], save: ["Diving stop — holds the batter to a single.", "He dove and kept it from the outfield."] },
  reds: { out: ["Diving stop — and he fires to first! OUT!", "He dove and threw him out — great defense!"], knock: ["He knocked it down on the Riverfront turf.", "Kept it in the infield — good play."], save: ["Diving stop — holds the batter to a single on the turf.", "Great range — keeps it in the infield."] },
  royals: { out: ["Diving stop — and he gets the out at first!", "Great play — he dove and threw him out!"], knock: ["He knocked it down — keeps the ball in front.", "Saved extra bases with that dive."], save: ["Diving stop — holds the batter to a single.", "He dove and kept it from reaching the outfield."] },
};

export function rollDivingStop() {
  return Math.random() < 0.10;
}

// Returns { type: 'out'|'knockdown'|'save', subType, pos, text }
export function getDivingStopResult(homeTeamKey, playerName, pos) {
  const roll = Math.random();
  let outcomeType;

  if (roll < 0.20) {
    // Out scenario — pick sub-type based on position
    const outRoll = Math.random();
    const isMiddleIF = pos === 'SS' || pos === '2B';
    const is3B = pos === '3B';
    const is1B = pos === '1B';
    if ((is3B || isMiddleIF) && outRoll < 0.30) {
      outcomeType = 'out_force'; // step on bag for force
    } else if (is1B && outRoll < 0.25) {
      outcomeType = 'out_run'; // 1B scrambles to bag
    } else if (outRoll < 0.20) {
      outcomeType = 'out_knees'; // fires from knees
    } else if (outRoll < 0.50) {
      outcomeType = 'out_run';
    } else {
      outcomeType = 'out_throw';
    }
  } else if (roll < 0.65) {
    outcomeType = 'knockdown';
  } else {
    outcomeType = 'save';
  }

  const teamCalls = DIVING_STOP_TEAM_CALLS[homeTeamKey];
  let calls;
  if (outcomeType === 'out_throw') calls = DIVING_STOP_OUT_THROW_CALLS;
  else if (outcomeType === 'out_run') calls = DIVING_STOP_OUT_RUN_CALLS;
  else if (outcomeType === 'out_force') calls = DIVING_STOP_FORCE_CALLS;
  else if (outcomeType === 'out_knees') calls = DIVING_STOP_KNEES_CALLS;
  else if (outcomeType === 'knockdown') calls = teamCalls && Math.random() < 0.50 ? teamCalls.knock : DIVING_STOP_KNOCKDOWN_CALLS;
  else calls = teamCalls && Math.random() < 0.50 ? teamCalls.save : DIVING_STOP_SAVE_CALLS;

  const call = calls[Math.floor(Math.random() * calls.length)];
  const isOut = outcomeType.startsWith('out');
  return { type: isOut ? 'out' : outcomeType, subType: outcomeType, pos: pos || null, text: `🧤 ${playerName} — ${call}` };
}

// ── RARE DEFENSIVE EVENTS ──
// Very rare additions for extra flavor (fired on flyouts/catches)

const RARE_CATCH_EVENTS = [
  "snowCone",       // Ball barely stays in glove
  "juggled",        // Juggled but caught
  "overShoulder",   // Over-the-shoulder basket catch
];

const SLIDING_CATCH_CALLS = [
  "He slid and made the catch — old school style!",
  "Sliding catch in the outfield — he gathered it in!",
];

const SNOW_CONE_CALLS = [
  "Snow cone! The ball was barely in the webbing — but he held on!",
  "He showed the ump the ball — barely hanging in the webbing!",
];

const JUGGLED_CALLS = [
  "He juggled it — and still made the catch!",
  "Bobbled it once, twice — and secures it for the out!",
];

export function rollRareCatchEvent() {
  return Math.random() < 0.005; // 0.5% — very rare
}

export function getRareCatchCall(playerName, eventType) {
  switch (eventType) {
    case 'sliding': return SLIDING_CATCH_CALLS[Math.floor(Math.random() * SLIDING_CATCH_CALLS.length)].replace('He', playerName);
    case 'snowCone': return SNOW_CONE_CALLS[Math.floor(Math.random() * SNOW_CONE_CALLS.length)];
    case 'juggled': return JUGGLED_CALLS[Math.floor(Math.random() * JUGGLED_CALLS.length)];
    case 'overShoulder': return `${playerName} makes the over-the-shoulder catch — Willie Mays style!`;
    default: return `${playerName} makes a rare catch!`;
  }
}