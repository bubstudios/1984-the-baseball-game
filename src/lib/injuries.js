// ── Injury System for 1984: The Baseball Season ──
// Exhibition mode: injuries are rare, mostly minor, and often just scares.
// Philosophy: stars stay on the field. Realism serves fun, not the other way around.

// ── Player Durability (1-10, higher = more durable) ──
export const PLAYER_DURABILITY = {
  // Iron Men (10) — almost never hurt
  "Cal Ripken Jr.": 10,
  "Pete Rose": 10,
  "Steve Garvey": 10,
  "Phil Niekro": 10,     // 45 years old but indestructible

  // Extremely Durable (9)
  "Dave Winfield": 9, "Eddie Murray": 9, "Dale Murphy": 9,
  "Dwight Evans": 9, "Lou Whitaker": 9, "Keith Hernandez": 9,
  "Bill Buckner": 9, "Jim Rice": 9, "Gary Carter": 9,
  "Tim Raines": 9, "Jose Cruz": 9, "Willie Wilson": 9,
  "Tony Gwynn": 9, "Alan Trammell": 9, "Buddy Bell": 9,
  "Frank White": 9,

  // Durable Regulars (8)
  "Wade Boggs": 8, "Ryne Sandberg": 8, "Don Mattingly": 8,
  "Kirk Gibson": 8, "Andre Dawson": 8, "Harold Baines": 8,
  "George Bell": 8, "Dave Parker": 8, "Jack Clark": 8,
  "Pedro Guerrero": 8, "Chet Lemon": 8, "Tony Fernandez": 8,
  "Lloyd Moseby": 8, "Rickey Henderson": 8, "Alfredo Griffin": 8,
  "Willie Randolph": 8, "Kent Hrbek": 8, "Tom Brunansky": 8,
  "Gary Gaetti": 8, "Kirby Puckett": 8, "Johnny Ray": 8,
  "Mike Schmidt": 8, "Tim Wallach": 8, "Dwight Gooden": 8,
  "Nolan Ryan": 8,

  // Standard (6-7)
  "Darryl Strawberry": 7, "Keith Moreland": 7, "Leon Durham": 7,
  "Jody Davis": 7, "Bob Dernier": 7, "Ron Cey": 7,
  "Lance Parrish": 7, "Howard Johnson": 7, "Mookie Wilson": 7,
  "Hubie Brooks": 7, "Wally Backman": 7, "Terry Kennedy": 7,
  "Garry Templeton": 7, "Ron Guidry": 7, "Dan Quisenberry": 7,
  "Dennis Eckersley": 7, "Graig Nettles": 6, "Mike Marshall": 6,
  "Carmelo Martínez": 6, "Kevin McReynolds": 6, "Dave Righetti": 6,
  "Bruce Sutter": 6, "Orel Hershiser": 6, "Bret Saberhagen": 6,
  "Ron Darling": 6, "Rick Sutcliffe": 6, "Goose Gossage": 6,
  "Lee Smith": 6,

  // Fragile (4-5)
  "Fernando Valenzuela": 5, "John Candelaria": 5, "Mario Soto": 5,
  "Eric Show": 5, "Bobby Ojeda": 5, "Don Sutton": 5,
  "Steve Carlton": 5, "Bob Forsch": 5,

  // Made of Glass (2-3)
  "Tommy John": 3,
};

export const DEFAULT_DURABILITY = 6;

export function getPlayerDurability(playerName) {
  return PLAYER_DURABILITY[playerName] || DEFAULT_DURABILITY;
}

// ── Injury Severity ──
export const INJURY_TYPES = {
  MINOR: "Staying In",       // Bruise, cramp — plays through
  DTD: "Day-to-Day",         // Removed from game
  IL15: "15-Day IL",         // Exhibition: removed from game
  IL60: "60-Day IL",         // Exhibition: removed from game  
  SEASON: "Season-Ending",   // Devastating but extremely rare
};

// ── Position-Based Risk Multiplier ──
function getPositionRisk(player) {
  const pos = player.assignedPos || player.pos || '';
  if (pos === 'C') return 1.5;                   // Catchers take a beating
  if (['SS', '2B'].includes(pos)) return 1.15;   // Middle infielders
  if (['CF'].includes(pos)) return 1.1;          // Diving center fielders
  if (pos === 'SP' && (player.stamina || 5) >= 7) return 0.85; // Workhorse SPs
  if (['1B', 'DH'].includes(pos)) return 0.7;    // First basemen and DHs
  if (player.speed >= 8) return 1.1;             // Speedsters
  return 1.0;
}

// ── Star Protection — durability bonuses for legendary iron men ──
function getStarProtection(playerName) {
  const starProtection = {
    "Cal Ripken Jr.": 0.10,    // 90% reduction — The Iron Man
    "Pete Rose": 0.25,         // 75% reduction — played forever
    "Steve Garvey": 0.30,      // NL record consecutive games streak
    "Phil Niekro": 0.15,       // Pitched into his late 40s
  };
  return starProtection[playerName] || 1.0;
}

// ── Injury Catalog ──
const INJURIES = [
  // ── MINOR (stay in game) ──
  { id: "bruised_knee", name: "Bruised Knee", bodyPart: "leg", category: "leg",
    triggers: ["slide", "dive"],
    severity: { MINOR: 0.85, DTD: 0.12, IL15: 0.03, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "jammed_finger", name: "Jammed Finger", bodyPart: "arm", category: "arm",
    triggers: ["slide", "dive_catch", "foul_tip_hand"],
    severity: { MINOR: 0.88, DTD: 0.10, IL15: 0.02, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "foul_ball_foot", name: "Foul Ball Off Foot", bodyPart: "leg", category: "leg",
    triggers: ["foul_off_hands", "drop_bat_on_foot"],
    severity: { MINOR: 0.92, DTD: 0.07, IL15: 0.01, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "muscle_cramp", name: "Muscle Cramp", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "groundout_sprint", "catcher_crouch"],
    severity: { MINOR: 0.90, DTD: 0.08, IL15: 0.02, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "twisted_ankle", name: "Twisted Ankle", bodyPart: "leg", category: "leg",
    triggers: ["slide", "sudden_stop", "step_on_base", "wet_turf"],
    severity: { MINOR: 0.75, DTD: 0.20, IL15: 0.04, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "stinger", name: "Stinger (Neck/Shoulder)", bodyPart: "core", category: "core",
    triggers: ["collision", "fielder_collision", "wall_crash"],
    severity: { MINOR: 0.70, DTD: 0.22, IL15: 0.06, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "bruised_hand", name: "Bruised Hand", bodyPart: "arm", category: "arm",
    triggers: ["hbp_hands", "foul_tip_hand", "mask_impact"],
    severity: { MINOR: 0.88, DTD: 0.10, IL15: 0.02, IL60: 0.00, SEASON: 0.00 },
  },

  // ── DAY-TO-DAY (removed from game) ──
  { id: "hamstring_strain", name: "Hamstring Strain", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "steal", "stretch_double", "groundout_sprint"],
    severity: { MINOR: 0.35, DTD: 0.55, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "back_stiffness", name: "Back Stiffness", bodyPart: "core", category: "core",
    triggers: ["swing_awkward", "dive_catch", "catcher_crouch"],
    severity: { MINOR: 0.40, DTD: 0.50, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "wrist_soreness", name: "Wrist Soreness", bodyPart: "arm", category: "arm",
    triggers: ["hbp_hands", "swing_awkward", "swing_collision"],
    severity: { MINOR: 0.45, DTD: 0.45, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "shoulder_soreness", name: "Shoulder Soreness", bodyPart: "arm", category: "arm",
    triggers: ["throw_deep", "overthrow", "catcher_throw", "pitch_fatigue"],
    severity: { MINOR: 0.30, DTD: 0.58, IL15: 0.10, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "blister", name: "Blister on Finger", bodyPart: "arm", category: "arm",
    triggers: ["repeated_grip", "hot_weather_pitch"],
    severity: { MINOR: 0.20, DTD: 0.72, IL15: 0.07, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "ankle_sprain", name: "Ankle Sprain", bodyPart: "leg", category: "leg",
    triggers: ["slide", "step_on_base", "bad_hop", "wet_turf"],
    severity: { MINOR: 0.20, DTD: 0.55, IL15: 0.20, IL60: 0.04, SEASON: 0.01 },
  },

  // ── 15-DAY IL (rare removal) ──
  { id: "hamstring_tear", name: "Hamstring Tear", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "steal"],
    severity: { MINOR: 0.00, DTD: 0.10, IL15: 0.55, IL60: 0.30, SEASON: 0.05 },
  },
  { id: "elbow_tightness", name: "Elbow Tightness", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "high_pitch_count"],
    severity: { MINOR: 0.20, DTD: 0.30, IL15: 0.40, IL60: 0.08, SEASON: 0.02 },
  },
  { id: "rotator_cuff", name: "Rotator Cuff Strain", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "high_pitch_count", "cold_weather_pitch"],
    severity: { MINOR: 0.10, DTD: 0.25, IL15: 0.45, IL60: 0.15, SEASON: 0.05 },
  },
  { id: "knee_sprain", name: "Knee Sprain", bodyPart: "leg", category: "leg",
    triggers: ["slide", "sudden_stop", "plate_collision"],
    severity: { MINOR: 0.10, DTD: 0.30, IL15: 0.42, IL60: 0.14, SEASON: 0.04 },
  },
  { id: "rib_strain", name: "Rib Strain", bodyPart: "core", category: "core",
    triggers: ["dive_catch", "hbp_body", "swing_rotation"],
    severity: { MINOR: 0.15, DTD: 0.35, IL15: 0.38, IL60: 0.10, SEASON: 0.02 },
  },

  // ── 60-DAY / SEASON (very rare) ──
  { id: "acl_tear", name: "Torn ACL", bodyPart: "leg", category: "leg",
    triggers: ["slide", "sudden_stop", "collision"],
    severity: { MINOR: 0.00, DTD: 0.00, IL15: 0.05, IL60: 0.35, SEASON: 0.60 },
  },
  { id: "tommy_john", name: "UCL Tear (Tommy John)", bodyPart: "arm", category: "arm",
    triggers: ["velocity_spike", "max_effort_pitches", "one_pitch_too_many"],
    severity: { MINOR: 0.00, DTD: 0.00, IL15: 0.05, IL60: 0.35, SEASON: 0.60 },
  },
  { id: "rotator_cuff_tear", name: "Torn Rotator Cuff", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "high_pitch_count"],
    severity: { MINOR: 0.00, DTD: 0.00, IL15: 0.05, IL60: 0.30, SEASON: 0.65 },
  },
  { id: "broken_hand", name: "Broken Hand", bodyPart: "arm", category: "arm",
    triggers: ["hbp_hands", "fielder_collision"],
    severity: { MINOR: 0.00, DTD: 0.05, IL15: 0.20, IL60: 0.55, SEASON: 0.20 },
  },
  { id: "broken_wrist", name: "Broken Wrist", bodyPart: "arm", category: "arm",
    triggers: ["hbp_hands", "dive_catch_impact"],
    severity: { MINOR: 0.00, DTD: 0.05, IL15: 0.15, IL60: 0.55, SEASON: 0.25 },
  },
  { id: "concussion", name: "Concussion", bodyPart: "head", category: "head",
    triggers: ["fielder_collision", "wall_crash", "plate_collision", "slide_elbow"],
    severity: { MINOR: 0.10, DTD: 0.30, IL15: 0.40, IL60: 0.15, SEASON: 0.05 },
  },
  { id: "ankle_fracture", name: "Ankle Fracture", bodyPart: "leg", category: "leg",
    triggers: ["slide", "collision"],
    severity: { MINOR: 0.00, DTD: 0.05, IL15: 0.15, IL60: 0.50, SEASON: 0.30 },
  },
  { id: "torn_achilles", name: "Torn Achilles", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "sudden_stop"],
    severity: { MINOR: 0.00, DTD: 0.00, IL15: 0.00, IL60: 0.30, SEASON: 0.70 },
  },

  // ── WEIRD / MINOR (flavor only) ──
  { id: "stretch_injury", name: "Pulled Muscle While Stretching", bodyPart: "core", category: "core",
    triggers: ["pregame_stretch"], severity: { MINOR: 0.95, DTD: 0.04, IL15: 0.01, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "celebration_injury", name: "Celebration Injury", bodyPart: "leg", category: "leg",
    triggers: ["hr_trot_hamstring", "dugout_celebration"], severity: { MINOR: 0.88, DTD: 0.10, IL15: 0.02, SEASON: 0.00 },
  },
  { id: "bat_drop", name: "Bat Drop Injury", bodyPart: "leg", category: "leg",
    triggers: ["drop_bat_on_foot"], severity: { MINOR: 0.96, DTD: 0.03, IL15: 0.01, SEASON: 0.00 },
  },
];

// ── Trigger mapping ──
const PLAY_TO_TRIGGER = {
  hit_by_pitch: ["hbp", "hbp_hands", "hbp_body"],
  sprint_to_first: ["sprint", "groundout_sprint"],
  steal_attempt: ["steal"],
  steal_success: ["steal", "sprint"],
  slide: ["slide", "sudden_stop"],
  diving_catch: ["dive_catch", "dive_catch_impact"],
  throw_from_deep: ["throw_deep", "overthrow"],
  pitcher_fatigue: ["pitch_fatigue", "high_pitch_count"],
  pitcher_velocity: ["velocity_spike", "max_effort_pitches"],
  collision: ["fielder_collision", "wall_crash", "plate_collision"],
  foul_tip_catcher: ["foul_tip_hand", "mask_impact", "catcher_crouch"],
  homerun: ["hr_trot_hamstring"],
};

// ── Commentary ──
const COMMENTARY = {
  scare: [
    "Trainer is out to check on {player} — let's hope it's nothing serious.",
    "The training staff is taking a look at {player}. Looks like he might be okay.",
    "{player} is shaking it off, but the trainer wants to be sure.",
    "A quick visit from the trainer — {player} had a close call there.",
    "He's moving it around — looks like he'll be okay. Scary moment, though.",
  ],
  minor: [
    "{player} is staying in the game — just a {injury}.",
    "He'll rub some dirt on it — {player} is staying in.",
    "Looks like just a {injury} — {player} waves off the trainer.",
    "Nothing serious — {player} got a {injury} but he's good to go.",
    "The trainer heads back to the dugout — {player} is fine.",
  ],
  DTD: [
    "{player} is done for the day with a {injury}.",
    "They're being cautious — {player} is out for the rest of this one.",
    "Day-to-day with a {injury} — {player} will get the rest of the afternoon off.",
  ],
  IL15: [
    "{player} will be sidelined — looks like a {injury}. Would be a 15-day trip to the DL.",
    "A {injury} for {player} — that's a 15-day DL stint if this were the regular season.",
  ],
  IL60: [
    "Bad news — {player} has a {injury}. That's a 60-day DL injury.",
    "A tough break — {player} is down with a {injury}. Long-term concern.",
  ],
  SEASON: [
    "Devastating news — {player} has a {injury}. Season would be over.",
    "Oh no — {player} is done. {injury}. That's a season-ender.",
    "Heartbreaking — {player}'s season appears over with a {injury}.",
  ],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Main Injury Check (called after game events) ──
// Returns null, an injury-scare (stays in), or a real injury result
export function rollInjury(player, trigger, gameState = {}) {
  if (!player) return null;

  const durability = getPlayerDurability(player.name);
  const starFactor = getStarProtection(player.name);
  const positionRisk = getPositionRisk(player);

  // ── Base Chance: very low per trigger ──
  // Target: ~15-25% chance of any injury EVENT per game
  // With ~40-60 plays per game, that's ~0.4-0.6% per play
  const baseChance = 0.004;

  // Durability modifies: durability 10 → 0.2x, durability 4 → 1.5x
  const durabilityFactor = Math.max(0.1, (12 - durability) / 5);

  // Final per-play chance
  let chance = baseChance * durabilityFactor * positionRisk * starFactor;

  // Pitcher fatigue: slightly higher risk
  if (trigger === "pitcher_fatigue" || trigger === "pitcher_velocity") {
    chance *= 1.5;
  }

  if (Math.random() > chance) return null;

  // ── Find matching injuries ──
  const plays = PLAY_TO_TRIGGER[trigger] || [];
  const matching = INJURIES.filter(inj =>
    inj.triggers.some(t => plays.includes(t))
  );
  if (matching.length === 0) return null;

  const injury = matching[Math.floor(Math.random() * matching.length)];

  // ── Roll severity with modified distribution ──
  // Target: 70% MINOR, 20% DTD, 8% IL15, 2% IL60/SEASON
  // But we also use the injury's own weights for realism
  let sevRoll = Math.random();
  // Shift more weight toward minor outcomes
  const mildShift = 0.20 + (durability / 10) * 0.30; // Durability pushes more toward mild
  if (sevRoll < mildShift) sevRoll = sevRoll * 0.5; // Collapse upper range into minor

  let cumulative = 0;
  let severity = "MINOR";
  const weights = injury.severity;
  // Normalize: bump MINOR weight up
  const adjWeights = {
    MINOR: weights.MINOR * 1.5,
    DTD: weights.DTD * 0.9,
    IL15: weights.IL15 * 0.7,
    IL60: weights.IL60 * 0.5,
    SEASON: weights.SEASON * 0.3,
  };
  // Ensure zero-weight severities stay zero
  const total = adjWeights.MINOR + adjWeights.DTD + adjWeights.IL15 + adjWeights.IL60 + adjWeights.SEASON;
  if (total <= 0) {
    adjWeights.MINOR = 1.0;
  }
  const normTotal = Math.max(0.001, total);

  for (const [sev, w] of Object.entries(adjWeights)) {
    cumulative += w / normTotal;
    if (sevRoll <= cumulative) {
      severity = sev;
      break;
    }
  }

  // ── Injury SCARE check: 80% chance it's just a scare ──
  // If the roll lands on something that would remove the player,
  //   give it an 80% chance to be just a scare (minor cosmetic event)
  if (severity !== "MINOR" && Math.random() < 0.80) {
    return {
      injury: { id: "injury_scare", name: "Injury Scare", bodyPart: injury.bodyPart, category: injury.category },
      severity: "SCARE",
      severityLabel: "Injury Scare",
      player: player.name,
      position: player.assignedPos || player.pos,
      bodyPart: injury.bodyPart,
      category: injury.category,
      isWeird: false,
      commentary: pick(COMMENTARY.scare).replace("{player}", player.name).replace("{injury}", injury.name.toLowerCase()),
      replacementNote: null,
      trigger,
      isPitcher: player.pos === 'SP' || player.pos === 'RP' || player.pos === 'CL' ||
        (player.assignedPos && ['SP', 'RP', 'CL'].includes(player.assignedPos)),
      isCatcher: (player.assignedPos || player.pos) === 'C',
      isFielder: !['SP', 'RP', 'CL', 'P'].includes(player.pos),
      isScare: true,
    };
  }

  // ── Real injury (or minor one that stays in) ──
  const sevPool = COMMENTARY[severity] || COMMENTARY.DTD;
  const isWeird = ["stretch_injury", "celebration_injury", "bat_drop"].includes(injury.id);

  let commentary;
  if (isWeird) {
    commentary = `You don't see that every day — ${player.name} has a ${injury.name.toLowerCase()}!`;
  } else if (severity === "MINOR") {
    commentary = pick(COMMENTARY.minor)
      .replace("{player}", player.name)
      .replace("{injury}", injury.name.toLowerCase());
  } else {
    commentary = pick(sevPool)
      .replace("{player}", player.name)
      .replace("{injury}", injury.name.toLowerCase());
  }

  return {
    injury,
    severity,
    severityLabel: INJURY_TYPES[severity] || severity,
    player: player.name,
    position: player.assignedPos || player.pos,
    bodyPart: injury.bodyPart,
    category: injury.category,
    isWeird,
    commentary,
    replacementNote: severity !== "MINOR"
      ? `${player.name} is done for the day.`
      : `${player.name} is staying in the game.`,
    trigger,
    isPitcher: player.pos === 'SP' || player.pos === 'RP' || player.pos === 'CL' ||
      (player.assignedPos && ['SP', 'RP', 'CL'].includes(player.assignedPos)),
    isCatcher: (player.assignedPos || player.pos) === 'C',
    isFielder: !['SP', 'RP', 'CL', 'P'].includes(player.pos),
    isScare: false,
  };
}

// ── Check injury after a game play ──
export function checkPlayInjury(state, trigger, playerName) {
  if (!state || state.gameOver) return null;
  const lineup = state.halfInning === 'top' ? state.awayLineup : state.homeLineup;
  const player = lineup.find(p => p.name === playerName);
  if (!player) return null;
  return rollInjury(player, trigger, state);
}

// ── Check pitcher injury ──
export function checkPitcherInjury(state) {
  if (!state || state.gameOver) return null;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher) return null;

  const ip = pitcher.gameStats?.ip || 0;
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);

  // Much harder to get injured — only check when significantly past threshold
  const threshold = isReliever ? stamina * 0.5 : stamina * 0.8;
  if (ip < threshold) return null;

  const overThreshold = ip - threshold;
  let triggerChance = 0;
  if (overThreshold >= 3) triggerChance = 0.04;
  else if (overThreshold >= 2) triggerChance = 0.02;
  else if (overThreshold >= 1) triggerChance = 0.01;
  else triggerChance = 0.005;

  const lateMult = state.inning >= 9 ? 2.0 : state.inning >= 8 ? 1.5 : 1.0;
  triggerChance *= lateMult;

  const durability = getPlayerDurability(pitcher.name);
  // Iron men are dramatically harder to injure
  if (durability >= 9) triggerChance *= 0.15;
  else if (durability >= 7) triggerChance *= 0.5;
  else if (durability <= 4) triggerChance *= 1.5;

  const starFactor = getStarProtection(pitcher.name);
  triggerChance *= starFactor;

  if (Math.random() > triggerChance) return null;

  const trigger = overThreshold >= 3 ? "pitch_fatigue" : "pitcher_fatigue";
  return rollInjury(pitcher, trigger, state);
}

// ── Apply injury: mark player ──
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
    } else {
      newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryType: injuryResult.severity };
    }
  }

  return newState;
}

export function isPlayerInjured(player) {
  return player?.injured === true;
}