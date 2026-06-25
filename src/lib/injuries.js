// ── Phase 4.1 — Gated Injury System ──
// Injuries are GATED outcomes: a check ONLY happens when a qualifying physical event fires.
// Clean singles, strikeouts, routine groundouts = zero injury possibility. That was the original bug.
//
// Exhibition mode: "shaken" (stays in, rating ding) and "minor" (leaves game) are what you feel.
// "moderate" and "severe" exist and are computed — Season Mode reads them; Exhibition ignores them.
// Toggle: state.injuries_enabled === false → zero checks anywhere.

// ── Player Durability (1-10, higher = more durable) ──
export const PLAYER_DURABILITY = {
  // Iron Men (10)
  "Cal Ripken Jr.": 10, "Pete Rose": 10, "Steve Garvey": 10, "Phil Niekro": 10,
  // Extremely Durable (9)
  "Dave Winfield": 9, "Eddie Murray": 9, "Dale Murphy": 9, "Dwight Evans": 9,
  "Lou Whitaker": 9, "Keith Hernandez": 9, "Bill Buckner": 9, "Jim Rice": 9,
  "Gary Carter": 9, "Tim Raines": 9, "Jose Cruz": 9, "Willie Wilson": 9,
  "Tony Gwynn": 9, "Alan Trammell": 9, "Buddy Bell": 9, "Frank White": 9,
  // Durable Regulars (8)
  "Wade Boggs": 8, "Ryne Sandberg": 8, "Don Mattingly": 8, "Kirk Gibson": 8,
  "Andre Dawson": 8, "Harold Baines": 8, "George Bell": 8, "Dave Parker": 8,
  "Jack Clark": 8, "Pedro Guerrero": 8, "Chet Lemon": 8, "Tony Fernandez": 8,
  "Lloyd Moseby": 8, "Rickey Henderson": 8, "Alfredo Griffin": 8,
  "Willie Randolph": 8, "Kent Hrbek": 8, "Tom Brunansky": 8,
  "Gary Gaetti": 8, "Kirby Puckett": 8, "Johnny Ray": 8,
  "Mike Schmidt": 8, "Tim Wallach": 8, "Dwight Gooden": 8, "Nolan Ryan": 8,
  // Standard (6-7)
  "Darryl Strawberry": 7, "Keith Moreland": 7, "Leon Durham": 7, "Jody Davis": 7,
  "Bob Dernier": 7, "Ron Cey": 7, "Lance Parrish": 7, "Howard Johnson": 7,
  "Mookie Wilson": 7, "Hubie Brooks": 7, "Wally Backman": 7, "Terry Kennedy": 7,
  "Garry Templeton": 7, "Ron Guidry": 7, "Dan Quisenberry": 7,
  "Dennis Eckersley": 7, "Graig Nettles": 6, "Mike Marshall": 6,
  "Kevin McReynolds": 6, "Dave Righetti": 6, "Bruce Sutter": 6,
  "Orel Hershiser": 6, "Bret Saberhagen": 6, "Ron Darling": 6,
  "Rick Sutcliffe": 6, "Goose Gossage": 6, "Lee Smith": 6,
  // Fragile (4-5)
  "Fernando Valenzuela": 5, "John Candelaria": 5, "Mario Soto": 5,
  "Eric Show": 5, "Don Sutton": 5, "Steve Carlton": 5, "Bob Forsch": 5,
  // Made of Glass (2-3)
  "Tommy John": 3,
};

export const DEFAULT_DURABILITY = 6;

export function getPlayerDurability(playerName) {
  return PLAYER_DURABILITY[playerName] || DEFAULT_DURABILITY;
}

// ── §1 QUALIFYING EVENTS — the ONLY things that can cause an injury check ──
// Base chance per event. Everything else: no check, period.
const INJURY_CHANCE = {
  hit_by_pitch:    0.06,   // HBP — low, scaled by pitch velocity
  takeout_slide:   0.04,   // Hard takeout at 2B — the pivot man or the runner
  collision:       0.08,   // Home-plate collision — catcher or runner
  diving_catch:    0.03,   // Fielder crashing into the wall or full-extension dive
  wall_crash:      0.03,   // Outfield wall
  bench_scrum:     0.02,   // Bench-clearing (per player involved)
  awkward_swing:   0.005,  // Freak — tweaked something; the "tweaked a something" wildcard
  pitcher_fatigue: 0.008,  // Pitching strain after heavy use
  sprint_pull:     0.008,  // Hard baserunning sprint, leg pull
  steal_success:   0.006,  // Aggressive sprint on steal
  steal_attempt:   0.007,  // Hard slide on caught-stealing
};

// ── §5 Season Mode seam — computed now, read later ──
// In Exhibition, games_out is set but the game ends before it matters.
// Season Mode adds the reader that checks this between games.
const TIER_DURATION = {
  shaken:   0,   // stays in game — zero games missed
  minor:    0,   // leaves THIS game — Season Mode would add 1-3 missed
  moderate: 2,   // Season: 1-3 games unavailable
  severe:   30,  // Season: long-term / rest of season
};

// ── §3 Severity roll ──
// Design target: most rolls land on "shaken". Severe should feel like a gut punch precisely because it's rare.
function rollSeverityTier() {
  const r = Math.random();
  if (r < 0.60) return "shaken";    // 60% — stays in, brief ding
  if (r < 0.88) return "minor";     // 28% — leaves this game
  if (r < 0.98) return "moderate";  // 10% — multi-game (Season seam)
  return "severe";                   //  2% — long-term (Season seam)
}

// ── Injury flavor catalog by body part ──
const INJURY_CATALOG = {
  leg: [
    { name: "Hamstring Strain", tier_floor: "minor" },
    { name: "Twisted Ankle",    tier_floor: "shaken" },
    { name: "Knee Sprain",      tier_floor: "minor" },
    { name: "Leg Cramp",        tier_floor: "shaken" },
    { name: "Pulled Quadriceps",tier_floor: "minor" },
    { name: "Ankle Sprain",     tier_floor: "minor" },
  ],
  arm: [
    { name: "Bruised Hand",       tier_floor: "shaken" },
    { name: "Jammed Finger",      tier_floor: "shaken" },
    { name: "Wrist Soreness",     tier_floor: "minor" },
    { name: "Shoulder Stiffness", tier_floor: "shaken" },
    { name: "Forearm Tightness",  tier_floor: "minor" },
    { name: "Elbow Tightness",    tier_floor: "minor" },
  ],
  core: [
    { name: "Stinger (Neck/Shoulder)", tier_floor: "shaken" },
    { name: "Rib Bruise",              tier_floor: "minor" },
    { name: "Back Stiffness",          tier_floor: "shaken" },
    { name: "Hip Flexor Strain",       tier_floor: "minor" },
    { name: "Abdominal Strain",        tier_floor: "minor" },
  ],
  head: [
    { name: "Concussion",    tier_floor: "minor" },
    { name: "Bell Rung",     tier_floor: "shaken" },
    { name: "Facial Bruise", tier_floor: "shaken" },
  ],
};

// Map qualifying event → primary body part
const EVENT_BODY_PART = {
  hit_by_pitch:    "arm",
  takeout_slide:   "leg",
  collision:       "core",
  diving_catch:    "arm",
  wall_crash:      "core",
  bench_scrum:     "core",
  awkward_swing:   "arm",
  pitcher_fatigue: "arm",
  sprint_pull:     "leg",
  steal_success:   "leg",
  steal_attempt:   "leg",
};

function getBodyPart(eventType) {
  const base = EVENT_BODY_PART[eventType] || "leg";
  // Small variance — HBP can hit the hip/leg, collision can rattle the head
  if (eventType === 'hit_by_pitch' && Math.random() < 0.25) return "leg";
  if (eventType === 'collision' && Math.random() < 0.20) return "head";
  return base;
}

function pickInjuryFlavor(bodyPart, tier) {
  const catalog = INJURY_CATALOG[bodyPart] || INJURY_CATALOG.leg;
  const tierOrder = ["shaken", "minor", "moderate", "severe"];
  const tierIdx = tierOrder.indexOf(tier);
  const eligible = catalog.filter(inj => tierOrder.indexOf(inj.tier_floor) <= tierIdx);
  const pool = eligible.length > 0 ? eligible : catalog;
  return pool[Math.floor(Math.random() * pool.length)].name;
}

// ── Commentary ──
const COMMENTARY = {
  shaken: [
    "Trainer is out to check on {player} — looks like he'll be okay.",
    "{player} is shaking it off. Quick check from the trainer and he's good.",
    "A brief visit from the training staff — {player} waves it off. He's in there.",
    "{player} winces but stays in the game. Just a scare.",
    "He's moving it around — {player} is going to gut it out.",
    "The trainer heads back to the dugout — {player} is staying in.",
  ],
  minor: [
    "{player} is done for the day with a {injury}.",
    "They're being cautious — {player} is out for the rest of this one.",
    "{player} is heading to the clubhouse. Day-to-day with a {injury}.",
    "He tried to stay in, but {player} is being removed with a {injury}.",
    "{player} can't continue — he's got a {injury}.",
  ],
  moderate: [
    "{player} has a {injury}. That's a multi-game concern.",
    "Bad news — {player} is out. A {injury} that'll take some time.",
    "They're going to be cautious with {player} and his {injury}.",
  ],
  severe: [
    "Devastating — {player} is down with a {injury}. Long-term concern.",
    "That's a serious {injury} for {player}. Could be out for a while.",
    "Heartbreaking — {player} is being helped off the field. {injury}.",
  ],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function buildCommentary(tier, playerName, injuryName) {
  const pool = COMMENTARY[tier] || COMMENTARY.minor;
  return pick(pool).replace("{player}", playerName).replace("{injury}", injuryName.toLowerCase());
}

// Backward-compat: existing UI checks severity === 'MINOR' (no sub) vs DTD/IL15/SEASON (sub needed)
const TIER_TO_SEVERITY = {
  shaken:   "MINOR",
  minor:    "DTD",
  moderate: "IL15",
  severe:   "SEASON",
};

const TIER_TO_LABEL = {
  shaken:   "Shaken Up",
  minor:    "Day-to-Day",
  moderate: "Multi-Game",
  severe:   "Long-Term",
};

// §4 Rating ding for "shaken" — brief penalty for the rest of this game
function getRatingDing(bodyPart) {
  if (bodyPart === 'leg')  return { stat: 'speed',   amount: -1 };
  if (bodyPart === 'arm')  return { stat: 'power',   amount: -1 };
  if (bodyPart === 'core') return { stat: 'defense', amount: -1 };
  if (bodyPart === 'head') return { stat: 'contact', amount: -1 };
  return null;
}

// ── §2 Core: maybe_injure ──
function maybeInjure(eventType, player, gameState, options = {}) {
  // §6 Toggle — injuries_enabled defaults to true; set false to fully disable
  if (gameState && gameState.injuries_enabled === false) return null;

  // §1 Gate: if this event isn't in the qualifying list, return immediately
  const baseChance = INJURY_CHANCE[eventType];
  if (!baseChance) return null;

  let chance = baseChance;

  // §2 Context scaling
  if (options.intensity_factor) chance *= options.intensity_factor;

  // HBP: heat hurts more — high-velocity pitches increase injury chance
  if (eventType === 'hit_by_pitch' && options.pitchSpeed) {
    chance *= (options.pitchSpeed / 7.0); // 7 = average MLB fastball on our 1-10 scale
  }

  // Durability scaling (optional — per spec §2)
  const durability = getPlayerDurability(player.name);
  // durability 10 → 0.14 (near-immune), durability 6 → 0.71 (standard), durability 3 → 1.14
  const durabilityFactor = Math.max(0.10, (11 - durability) / 7.0);
  chance *= durabilityFactor;

  if (Math.random() >= chance) return null;

  // §3 Severity roll
  const tier = rollSeverityTier();

  // Pick flavor
  const bodyPart = getBodyPart(eventType);
  const injuryName = pickInjuryFlavor(bodyPart, tier);
  const commentary = buildCommentary(tier, player.name, injuryName);

  const isPitcher = ['SP', 'RP', 'CL'].includes(player.pos) ||
                    ['SP', 'RP', 'CL'].includes(player.assignedPos);

  // §5 Season seam: games_out computed now, used later by Season Mode
  const games_out = tier === 'moderate' ? TIER_DURATION.moderate :
                    tier === 'severe'   ? TIER_DURATION.severe   : 0;

  return {
    // §5 Season seam fields (inert in Exhibition — Season Mode reads these)
    tier,
    games_out,
    recovery_clock: null,

    // Backward-compat fields (existing UI reads these)
    injury: { id: `${eventType}_${tier}`, name: injuryName, bodyPart, category: bodyPart },
    severity: TIER_TO_SEVERITY[tier],
    severityLabel: TIER_TO_LABEL[tier],
    player: player.name,
    position: player.assignedPos || player.pos,
    bodyPart,
    category: bodyPart,
    isWeird: false,
    commentary,
    replacementNote: tier === 'shaken'
      ? `${player.name} is staying in the game.`
      : `${player.name} is done for the day.`,
    trigger: eventType,
    isPitcher,
    isCatcher: (player.assignedPos || player.pos) === 'C',
    isFielder: !isPitcher,
    isScare: false,

    // §4 In-game effect: shaken players take a brief rating ding
    ratingDing: tier === 'shaken' ? getRatingDing(bodyPart) : null,

    // §4 Bad-blood linkage: dirty-play injury = biggest single bad-blood deposit
    isBadBloodTrigger: ['takeout_slide', 'collision', 'bench_scrum', 'hit_by_pitch'].includes(eventType),
  };
}

// ── Public API ──

/**
 * Check for injury after a qualifying physical event.
 * Searches both lineups + active pitchers — safe for fielding-side injuries (collisions, etc.).
 */
export function checkPlayInjury(state, eventType, playerName) {
  if (!state || state.gameOver) return null;
  // Search both lineups and active pitchers
  const allPlayers = [
    ...(state.homeLineup || []),
    ...(state.awayLineup || []),
  ];
  let player = allPlayers.find(p => p.name === playerName);
  if (!player) {
    if (state.homePitcher?.name === playerName) player = state.homePitcher;
    else if (state.awayPitcher?.name === playerName) player = state.awayPitcher;
  }
  if (!player) return null;
  return maybeInjure(eventType, player, state);
}

/**
 * Check for pitcher arm strain after exceeding stamina threshold.
 * Uses 'pitcher_fatigue' qualifying event — gated and rare.
 */
export function checkPitcherInjury(state) {
  if (!state || state.gameOver) return null;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher) return null;

  const ip = pitcher.gameStats?.ip || 0;
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);

  // Only check once well past stamina threshold
  const threshold = isReliever ? stamina * 0.5 : stamina * 0.8;
  if (ip < threshold) return null;

  // Throttle: only evaluate 15% of pitches past threshold (prevents every pitch from rolling)
  if (Math.random() > 0.15) return null;

  const overThreshold = ip - threshold;
  const intensity_factor = Math.min(2.5, 1.0 + overThreshold * 0.35);

  return maybeInjure('pitcher_fatigue', pitcher, state, { intensity_factor });
}

/**
 * Apply injury flags to player in state (for backward compat with existing sub logic).
 */
export function applyInjury(state, injuryResult) {
  if (!injuryResult) return state;
  const newState = JSON.parse(JSON.stringify(state));

  const awayIdx = newState.awayLineup.findIndex(p => p.name === injuryResult.player);
  const homeIdx = newState.homeLineup.findIndex(p => p.name === injuryResult.player);
  const targetLineup = awayIdx >= 0 ? newState.awayLineup : homeIdx >= 0 ? newState.homeLineup : null;
  const targetIdx = awayIdx >= 0 ? awayIdx : homeIdx;

  if (targetLineup && targetIdx >= 0) {
    targetLineup[targetIdx] = {
      ...targetLineup[targetIdx],
      injured: true,
      injuryType: injuryResult.severity,
      injuryName: injuryResult.injury.name,
    };
  }

  if (injuryResult.isPitcher) {
    if (newState.homePitcher?.name === injuryResult.player) {
      newState.homePitcher = { ...newState.homePitcher, injured: true, injuryType: injuryResult.severity };
    } else if (newState.awayPitcher?.name === injuryResult.player) {
      newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryType: injuryResult.severity };
    }
  }

  return newState;
}

export function isPlayerInjured(player) {
  return player?.injured === true;
}