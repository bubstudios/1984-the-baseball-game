// ── Injury System for 1984: The Baseball Season ──
// Career durability drives risk. Exhibition mode: injuries reset after game.

// Player durability tiers (1-10, higher = more durable/less injury-prone)
// Based on real 1984 career durability: games played, injury history, longevity
export const PLAYER_DURABILITY = {
  // ── Iron Men (10 = almost never hurt) ──
  "Cal Ripken Jr.": 10,
  "Pete Rose": 10,
  "Steve Garvey": 10,
  "Dave Winfield": 9,
  "Eddie Murray": 9,
  "Dale Murphy": 9,
  "Dwight Evans": 9,
  "Lou Whitaker": 9,
  "Keith Hernandez": 9,
  "Bill Buckner": 9,
  "Jim Rice": 9,
  "Gary Carter": 9,
  "Tim Raines": 9,
  "Jose Cruz": 9,
  "Willie Wilson": 9,
  "Tony Gwynn": 9,
  "Alan Trammell": 9,
  "Buddy Bell": 9,
  "Frank White": 9,

  // ── Durable Regulars (8) ──
  "Wade Boggs": 8,
  "Ryne Sandberg": 8,
  "Don Mattingly": 8,
  "Kirk Gibson": 8,
  "Andre Dawson": 8,
  "Harold Baines": 8,
  "George Bell": 8,
  "Dave Parker": 8,
  "Jack Clark": 8,
  "Pedro Guerrero": 8,
  "Chet Lemon": 8,
  "Tony Fernandez": 8,
  "Lloyd Moseby": 8,
  "Rickey Henderson": 8,
  "Alfredo Griffin": 8,
  "Willie Randolph": 8,
  "Kent Hrbek": 8,
  "Tom Brunansky": 8,
  "Gary Gaetti": 8,
  "Kirby Puckett": 8,
  "Johnny Ray": 8,
  "Mike Schmidt": 8,
  "Tim Wallach": 8,

  // ── Standard (6-7) ──
  "Darryl Strawberry": 7,
  "Keith Moreland": 7,
  "Leon Durham": 7,
  "Jody Davis": 7,
  "Bob Dernier": 7,
  "Ron Cey": 7,
  "Lance Parrish": 7,
  "Howard Johnson": 7,
  "Mookie Wilson": 7,
  "Hubie Brooks": 7,
  "Wally Backman": 7,
  "Graig Nettles": 6,
  "Mike Marshall": 6,
  "Carmelo Martínez": 6,
  "Kevin McReynolds": 6,
  "Terry Kennedy": 7,
  "Garry Templeton": 7,
  "Ron Guidry": 7,
  "Dave Righetti": 6,
  "Dan Quisenberry": 7,
  "Bruce Sutter": 6,
  "Dennis Eckersley": 7,

  // ── Fragile / Injury Prone (4-5) ──
  "Fernando Valenzuela": 5,
  "Dwight Gooden": 5,
  "Orel Hershiser": 6,
  "John Candelaria": 5,
  "Mario Soto": 5,
  "Rick Sutcliffe": 6,
  "Eric Show": 5,
  "Bret Saberhagen": 6,
  "Bobby Ojeda": 5,
  "Ron Darling": 6,

  // ── Made of Glass (2-3) ──
  "Phil Niekro": 4,  // old knuckleballer, resilient but 45 years old
  "Don Sutton": 5,
  "Tommy John": 3,   // ironically, Tommy John himself
  "Steve Carlton": 5,
  "Nolan Ryan": 7,
  "Goose Gossage": 6,
  "Lee Smith": 6,
  "Bob Forsch": 5,
};

// Default durability for unlisted players
export const DEFAULT_DURABILITY = 6;

export function getPlayerDurability(playerName) {
  return PLAYER_DURABILITY[playerName] || DEFAULT_DURABILITY;
}

// ── Injury Types ──
export const INJURY_TYPES = {
  // DTD (Day-to-Day) — miss remainder of game
  DTD: "Day-to-Day",

  // 15-Day
  IL15: "15-Day IL",

  // 60-Day
  IL60: "60-Day IL",

  // Season-Ending
  SEASON: "Season-Ending",
};

// ── Injury Catalog ──
// Each entry: { id, name, bodyPart, category, triggers, severityWeights, isPitcher, isCatcher, isFielder }

const INJURIES = [
  // ── HAMSTRING ──
  { id: "hamstring_strain", name: "Hamstring Strain", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "steal", "stretch_double", "groundout_sprint"],
    severity: { DTD: 0.75, IL15: 0.18, IL60: 0.05, SEASON: 0.02 },
  },
  { id: "hamstring_tear", name: "Hamstring Tear", bodyPart: "leg", category: "leg",
    triggers: ["sprint", "steal"],
    severity: { DTD: 0.30, IL15: 0.40, IL60: 0.20, SEASON: 0.10 },
  },

  // ── ANKLE ──
  { id: "ankle_sprain", name: "Ankle Sprain", bodyPart: "leg", category: "leg",
    triggers: ["slide", "step_on_base", "bad_hop", "wet_turf"],
    severity: { DTD: 0.65, IL15: 0.25, IL60: 0.08, SEASON: 0.02 },
  },
  { id: "ankle_fracture", name: "Ankle Fracture", bodyPart: "leg", category: "leg",
    triggers: ["slide", "collision"],
    severity: { DTD: 0.05, IL15: 0.15, IL60: 0.50, SEASON: 0.30 },
  },

  // ── SHOULDER ──
  { id: "shoulder_soreness", name: "Shoulder Soreness", bodyPart: "arm", category: "arm",
    triggers: ["throw_deep", "overthrow", "catcher_throw"],
    severity: { DTD: 0.80, IL15: 0.15, IL60: 0.04, SEASON: 0.01 },
  },
  { id: "rotator_cuff", name: "Rotator Cuff Strain", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "high_pitch_count", "cold_weather_pitch"],
    severity: { DTD: 0.25, IL15: 0.45, IL60: 0.20, SEASON: 0.10 },
  },

  // ── ELBOW ──
  { id: "elbow_tightness", name: "Elbow Tightness", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "warmup_gone_wrong", "bullpen_overuse"],
    severity: { DTD: 0.55, IL15: 0.30, IL60: 0.12, SEASON: 0.03 },
  },
  { id: "tommy_john", name: "UCL Tear (Tommy John)", bodyPart: "arm", category: "arm",
    triggers: ["velocity_spike", "max_effort_pitches", "one_pitch_too_many"],
    severity: { DTD: 0.00, IL15: 0.05, IL60: 0.35, SEASON: 0.60 },
  },

  // ── BACK ──
  { id: "back_strain", name: "Back Strain", bodyPart: "core", category: "core",
    triggers: ["swing_awkward", "dive_catch", "catcher_crouch", "dugout_lift"],
    severity: { DTD: 0.70, IL15: 0.22, IL60: 0.06, SEASON: 0.02 },
  },

  // ── HAND / WRIST ──
  { id: "wrist_sprain", name: "Wrist Sprain", bodyPart: "arm", category: "arm",
    triggers: ["hbp_hands", "swing_collision", "dive_catch_impact"],
    severity: { DTD: 0.60, IL15: 0.28, IL60: 0.10, SEASON: 0.02 },
  },
  { id: "hand_contusion", name: "Hand Contusion", bodyPart: "arm", category: "arm",
    triggers: ["hbp", "foul_off_hands"],
    severity: { DTD: 0.85, IL15: 0.12, IL60: 0.02, SEASON: 0.01 },
  },

  // ── KNEE ──
  { id: "knee_sprain", name: "Knee Sprain", bodyPart: "leg", category: "leg",
    triggers: ["slide", "sudden_stop", "plate_collision"],
    severity: { DTD: 0.50, IL15: 0.32, IL60: 0.14, SEASON: 0.04 },
  },
  { id: "knee_acl", name: "Knee Ligament Tear", bodyPart: "leg", category: "leg",
    triggers: ["slide", "sudden_stop", "collision"],
    severity: { DTD: 0.01, IL15: 0.04, IL60: 0.30, SEASON: 0.65 },
  },

  // ── RIB ──
  { id: "rib_strain", name: "Rib Strain", bodyPart: "core", category: "core",
    triggers: ["dive_catch", "swing_rotation", "hbp_body"],
    severity: { DTD: 0.55, IL15: 0.30, IL60: 0.12, SEASON: 0.03 },
  },

  // ── PITCHER-SPECIFIC ──
  { id: "blister", name: "Blister on Finger", bodyPart: "arm", category: "arm",
    triggers: ["repeated_grip", "dry_balls", "hot_weather_pitch"],
    severity: { DTD: 0.92, IL15: 0.07, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "shoulder_fatigue", name: "Shoulder Fatigue", bodyPart: "arm", category: "arm",
    triggers: ["pitch_fatigue", "loss_of_velocity"],
    severity: { DTD: 0.88, IL15: 0.10, IL60: 0.02, SEASON: 0.00 },
  },

  // ── CONCUSSION ──
  { id: "concussion", name: "Concussion", bodyPart: "head", category: "head",
    triggers: ["fielder_collision", "wall_crash", "slide_elbow", "plate_collision"],
    severity: { DTD: 0.35, IL15: 0.45, IL60: 0.15, SEASON: 0.05 },
  },

  // ── CATCHER-SPECIFIC ──
  { id: "bruised_hand", name: "Bruised Hand", bodyPart: "arm", category: "arm",
    triggers: ["foul_tip_hand", "mask_impact"],
    severity: { DTD: 0.90, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "knee_soreness", name: "Knee Soreness", bodyPart: "leg", category: "leg",
    triggers: ["catcher_crouch", "catcher_throw"],
    severity: { DTD: 0.82, IL15: 0.14, IL60: 0.03, SEASON: 0.01 },
  },

  // ── WEIRD / OBSCURE ──
  { id: "stretch_injury", name: "Pulled Muscle While Stretching", bodyPart: "core", category: "core",
    triggers: ["pregame_stretch"],
    severity: { DTD: 0.95, IL15: 0.04, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "cough_strain", name: "Cough-Related Strain", bodyPart: "core", category: "core",
    triggers: ["dugout_cough"],
    severity: { DTD: 0.98, IL15: 0.02, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "celebration_injury", name: "Celebration Injury", bodyPart: "leg", category: "leg",
    triggers: ["hr_trot_hamstring", "dugout_celebration"],
    severity: { DTD: 0.88, IL15: 0.10, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "high_five_injury", name: "High-Five Injury", bodyPart: "arm", category: "arm",
    triggers: ["dugout_high_five", "dugout_celebration"],
    severity: { DTD: 0.99, IL15: 0.01, IL60: 0.00, SEASON: 0.00 },
  },
  { id: "manager_collision", name: "Manager Collision", bodyPart: "leg", category: "leg",
    triggers: ["bump_manager"],
    severity: { DTD: 0.92, IL15: 0.06, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "bat_drop", name: "Bat Drop Injury", bodyPart: "leg", category: "leg",
    triggers: ["drop_bat_on_foot"],
    severity: { DTD: 0.96, IL15: 0.03, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "step_out_twist", name: "Step-Out Twist", bodyPart: "leg", category: "leg",
    triggers: ["adjust_stance"],
    severity: { DTD: 0.90, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "ball_toss_jam", name: "Finger Jam (Tossing Ball)", bodyPart: "arm", category: "arm",
    triggers: ["toss_to_ump"],
    severity: { DTD: 0.97, IL15: 0.02, IL60: 0.01, SEASON: 0.00 },
  },
  { id: "helmet_neck", name: "Helmet Neck Strain", bodyPart: "head", category: "head",
    triggers: ["helmet_wrong"],
    severity: { DTD: 0.99, IL15: 0.01, IL60: 0.00, SEASON: 0.00 },
  },

  // ── EXTREME / LEGENDARY ──
  { id: "warmup_injury", name: "Injured on Warmup Toss", bodyPart: "arm", category: "arm",
    triggers: ["warmup_toss"],
    severity: { DTD: 0.15, IL15: 0.45, IL60: 0.28, SEASON: 0.12 },
  },
  { id: "routine_catch_injury", name: "Injured on Routine Catch", bodyPart: "arm", category: "arm",
    triggers: ["misjudge_popup"],
    severity: { DTD: 0.60, IL15: 0.28, IL60: 0.10, SEASON: 0.02 },
  },
  { id: "ump_collision_player", name: "Umpire Collision Injury", bodyPart: "core", category: "core",
    triggers: ["umpire_collision"],
    severity: { DTD: 0.50, IL15: 0.30, IL60: 0.15, SEASON: 0.05 },
  },
  { id: "bird_strike", name: "Bird Distraction Collision", bodyPart: "head", category: "head",
    triggers: ["bird_distraction"],
    severity: { DTD: 0.80, IL15: 0.15, IL60: 0.04, SEASON: 0.01 },
  },
  { id: "fan_object_injury", name: "Fan-Thrown Object Injury", bodyPart: "head", category: "head",
    triggers: ["fan_object"],
    severity: { DTD: 0.90, IL15: 0.08, IL60: 0.02, SEASON: 0.00 },
  },
  { id: "two_player_collision", name: "Two-Player Collision", bodyPart: "core", category: "core",
    triggers: ["fielder_collision"],
    severity: { DTD: 0.30, IL15: 0.35, IL60: 0.25, SEASON: 0.10 },
  },
];

// ── Trigger mapping: game play → possible triggers ──
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

// ── Commentary lines for injuries ──
export const INJURY_COMMENTARY = {
  generic: [
    "He's grabbing at his {bodyPart} — that doesn't look good.",
    "The trainer is out — {player} is down and in obvious discomfort.",
    "{player} is going to need a moment — he's feeling that one.",
    "That's an ominous sign — {player} is being looked at by the training staff.",
    "And {player} is slow to get up. The trainer is on his way.",
  ],
  DTD: [
    "Looks like he'll be day-to-day — {player} is done for the afternoon.",
    "Not serious, but {player} is out for the rest of this one.",
    "They're calling it day-to-day — precautionary move, but his day is over.",
  ],
  IL15: [
    "That could be a 15-day situation — {player} is clearly hurting.",
    "The way he's favoring that, this might be a couple weeks.",
  ],
  IL60: [
    "This one looks serious — {player} is being helped off the field.",
    "A potential 60-day injury for {player}. Devastating blow.",
  ],
  SEASON: [
    "Season-ending injury for {player}. The dugout is absolutely silent.",
    "Heartbreaking — {player}'s season appears to be over.",
  ],
  weird: [
    "You don't see that every day — {player} injured by a {cause}!",
    "The {cause} sends {player} to the trainer's room. Baseball is a strange game.",
    "Of all the ways to get hurt… {player} has been felled by a {cause}.",
  ],
};

function pickLine(pool) {
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Main injury roll ──
// Called after a game event that could cause injury. Returns null or an injury result object.

export function rollInjury(player, trigger, gameState = {}) {
  if (!player) return null;

  const durability = getPlayerDurability(player.name);
  const plays = PLAY_TO_TRIGGER[trigger] || [];

  // Find matching injuries
  const matchingInjuries = INJURIES.filter(inj =>
    inj.triggers.some(t => plays.includes(t))
  );

  if (matchingInjuries.length === 0) return null;

  // Base injury chance: ~2% per trigger, modified by durability
  const baseChance = 0.02;
  const durabilityFactor = (10 - durability) / 10; // 0 for durability 10, 1 for durability 0
  const adjustedChance = baseChance + durabilityFactor * 0.06;
  // Range: ~0.1% for durability 10, ~8% for durability 0

  // Pitchers pitching → higher base risk
  const isPitcherPitching = trigger === "pitcher_fatigue" || trigger === "pitcher_velocity";
  const pitcherMultiplier = isPitcherPitching ? 1.5 : 1.0;

  if (Math.random() > adjustedChance * pitcherMultiplier) return null;

  // Pick a random injury from matching ones
  const injury = matchingInjuries[Math.floor(Math.random() * matchingInjuries.length)];

  // Roll severity
  const sevRoll = Math.random();
  let cumulative = 0;
  let severity = "DTD";
  for (const [sev, weight] of Object.entries(injury.severity)) {
    cumulative += weight;
    if (sevRoll <= cumulative) {
      severity = sev;
      break;
    }
  }

  // Generate commentary
  const isWeird = ["cough_related", "stretch_injury", "celebration_injury",
    "high_five_injury", "manager_collision", "bat_drop", "step_out_twist",
    "ball_toss_jam", "helmet_neck"].includes(injury.id);

  let commentary;
  if (isWeird) {
    const cause = injury.name.toLowerCase();
    commentary = pickLine(INJURY_COMMENTARY.weird)
      .replace("{player}", player.name)
      .replace("{cause}", cause);
  } else {
    const sevPool = INJURY_COMMENTARY[severity] || INJURY_COMMENTARY.generic;
    commentary = pickLine(sevPool)
      .replace("{player}", player.name)
      .replace("{bodyPart}", injury.bodyPart);
  }

  // Determine replacement note
  const replacementNote = isPitcherPitching
    ? `${player.name} is done for the day — the manager will need to go to the bullpen.`
    : `The bench will need to fill in for ${player.name}.`;

  return {
    injury,
    severity,
    severityLabel: INJURY_TYPES[severity],
    player: player.name,
    position: player.assignedPos || player.pos,
    bodyPart: injury.bodyPart,
    category: injury.category,
    isWeird,
    commentary,
    replacementNote,
    trigger,
    isPitcher: player.pos === 'SP' || player.pos === 'RP' || player.pos === 'CL' || 
               (player.assignedPos && ['SP','RP','CL'].includes(player.assignedPos)),
    isCatcher: (player.assignedPos || player.pos) === 'C',
    isFielder: !['SP','RP','CL','P'].includes(player.pos) && 
               !['SP','RP','CL'].includes(player.assignedPos || ''),
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

// ── Check pitcher injury (fatigue-based) ──
export function checkPitcherInjury(state) {
  if (!state || state.gameOver) return null;

  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher) return null;

  const pitchCount = pitcher.gameStats?.pitches || 0;

  // No injury risk before 50 pitches
  if (pitchCount < 50) return null;

  // Escalating risk: 50-70 pitches low, 70-90 moderate, 90+ high
  let triggerChance = 0;
  if (pitchCount >= 90) triggerChance = 0.15;
  else if (pitchCount >= 70) triggerChance = 0.06;
  else triggerChance = 0.02;

  if (Math.random() > triggerChance) return null;

  // Determine trigger type
  const trigger = pitchCount >= 90 ? "pitch_fatigue" : "pitcher_fatigue";
  return rollInjury(pitcher, trigger, state);
}

// ── Apply injury: remove player from lineup ──
// Returns the modified state with the player marked as injured
export function applyInjury(state, injuryResult) {
  if (!injuryResult) return state;

  const newState = JSON.parse(JSON.stringify(state));
  const isFielding = injuryResult.position !== 'DH';
  const isBattingTeam = (newState.halfInning === 'top' && newState.awayLineup.some(p => p.name === injuryResult.player)) ||
                        (newState.halfInning === 'bottom' && newState.homeLineup.some(p => p.name === injuryResult.player));

  // Find the player in the lineup and mark as injured
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

  // If pitcher is injured, mark in pitcher state too
  if (injuryResult.isPitcher) {
    const isHomePitcher = newState.homePitcher?.name === injuryResult.player;
    if (isHomePitcher) {
      newState.homePitcher = { ...newState.homePitcher, injured: true, injuryType: injuryResult.severity };
    } else {
      newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryType: injuryResult.severity };
    }
  }

  return newState;
}

// ── Check if a player is currently injured ──
export function isPlayerInjured(player) {
  return player?.injured === true;
}