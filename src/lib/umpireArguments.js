// Umpire Arguments & Ejections — 1984 Theatrical System
// Comprehensive: dugout chirping, graduated escalation, rare events, manager personalities

// ── 1984 Manager Personalities (1=calm, 5=fiery, 10=explosive) ──
export const MANAGERS = {
  tigers: { name: "Sparky Anderson", personality: 3, team: "tigers" },
  padres: { name: "Dick Williams", personality: 7, team: "padres" },
  cubs: { name: "Jim Frey", personality: 5, team: "cubs" },
  mets: { name: "Davey Johnson", personality: 4, team: "mets" },
  redsox: { name: "Ralph Houk", personality: 5, team: "redsox" },
  yankees: { name: "Yogi Berra", personality: 6, team: "yankees" },
  orioles: { name: "Joe Altobelli", personality: 4, team: "orioles" },
  dodgers: { name: "Tommy Lasorda", personality: 9, team: "dodgers" },
};

// ── Umpire Personalities ──
const UMPIRE_TYPES = {
  easygoing: { name: "Easygoing", leash: 0.15, warningChance: 0.70 },
  standard: { name: "Standard", leash: 0.25, warningChance: 0.40 },
  shortFuse: { name: "Short Fuse", leash: 0.40, warningChance: 0.15 },
};

export function rollUmpire() {
  const roll = Math.random();
  if (roll < 0.30) return "easygoing";
  if (roll < 0.80) return "standard";
  return "shortFuse";
}

// ── Trigger Decision — what sparked this, and how serious is it? ──
// Returns { callType, severity: "chirp"|"low"|"medium"|"high"|"obscure", score: 0-10 }
export function getArgumentSeverity(lastPlay, gameState) {
  if (!lastPlay || !gameState) return null;
  const type = lastPlay?.type;
  const text = lastPlay?.text || "";
  const r = Math.random();

  // ── BALLS & STRIKES (most common argument engine) ──
  if (["strike", "foul"].includes(type)) {
    // Called strike three — classic spark
    if (text.includes("Strike 3") || text.includes("strike 3") || text.includes("called strike three")) {
      return { callType: "called strike three", severity: "medium", score: 3 };
    }
    // Watch strike on 2-strike count
    if ((text.includes("takes a") || text.includes("watches it")) && r < 0.18) {
      return { callType: "borderline strike", severity: "low", score: 1 };
    }
    // Swinging strike at borderline pitch — minor chirp
    if ((text.includes("Swinging strike") || text.includes("Swing and a miss")) && r < 0.10) {
      return { callType: "pitch appeared outside", severity: "chirp", score: 0 };
    }
    return null;
  }

  if (type === "ball") {
    // Ball 4 walk on full count
    if (text.includes("Ball 4") && r < 0.30) {
      return { callType: "borderline ball four", severity: "low", score: 1 };
    }
    // Regular ball — dugout may chirp about missed strike
    if (r < 0.04) {
      return { callType: "pitch looked good", severity: "chirp", score: 0 };
    }
    return null;
  }

  // ── SAFE / OUT ──
  if (["single", "groundout", "double"].includes(type)) {
    if (text.includes("beats it out") || text.includes("infield single")) {
      return { callType: "bang-bang play at first", severity: "medium", score: 4 };
    }
    if (text.includes("fielder's choice")) {
      return { callType: "close force play", severity: "medium", score: 3 };
    }
    // Double play: did the runner slide hard? Was the turn legal?
    if (text.includes("double play") && r < 0.12) {
      return { callType: "hard slide into second", severity: "medium", score: 3 };
    }
    return null;
  }

  // Ball in play — safe/out at first
  if (type === "lineout" && r < 0.08) {
    return { callType: "did infielder trap it?", severity: "low", score: 2 };
  }

  // ── FAIR / FOUL ──
  if (["foul", "single", "double"].includes(type)) {
    if ((text.includes("down the line") || text.includes("past the bag")) && r < 0.15) {
      return { callType: "fair or foul down the line", severity: "medium", score: 4 };
    }
  }

  // ── HOME RUN DISPUTES (always high severity) ──
  if (type === "homerun" && r < 0.20) {
    const hrCalls = ["fair or foul HR", "fan reached over wall", "ball hit catwalk/obstruction"];
    return { callType: hrCalls[Math.floor(Math.random() * hrCalls.length)], severity: "high", score: 7 };
  }

  // ── FAN INTERFERENCE (rare) ──
  if (["flyout", "sacfly"].includes(type) && r < 0.02) {
    const fanCalls = ["fan interfered with catch", "fan reached onto field", "fan touched live ball"];
    return { callType: fanCalls[Math.floor(Math.random() * fanCalls.length)], severity: "high", score: 6 };
  }

  // ── HIT BY PITCH ──
  if (type === "walk" && (text.includes("hit by the pitch") || text.includes("HBP"))) {
    const hbpCalls = ["he leaned into it", "that was intentional", "you hit me"];
    return { callType: hbpCalls[Math.floor(Math.random() * hbpCalls.length)], severity: "medium", score: 5 };
  }

  // ── CHECK SWINGS ──
  if (type === "strike" && (text.includes("Swinging strike") || text.includes("Swing and a miss")) && r < 0.06) {
    return { callType: "check swing appeal", severity: "low", score: 2 };
  }
  if (type === "strikeout" && r < 0.04) {
    return { callType: "strike three — check swing", severity: "medium", score: 3 };
  }

  // ── BALKS (rare, obscure, very 1980s) ──
  if (r < 0.008 && !["homerun", "error", "strikeout"].includes(type)) {
    const balkCalls = ["that's not a balk", "he's been doing that all game", "I didn't move"];
    return { callType: balkCalls[Math.floor(Math.random() * balkCalls.length)], severity: "medium", score: 3 };
  }

  // ── TRAP vs CATCH ──
  if (type === "error" && r < 0.10) {
    return { callType: "did it hit the grass?", severity: "medium", score: 3 };
  }
  if (["lineout", "flyout", "popout"].includes(type) && r < 0.03) {
    return { callType: "trapped or clean catch?", severity: "low", score: 2 };
  }

  // ── COLLISION PLAYS (1984 baseball had lots) ──
  if ((type === "sacfly" || type === "homerun") && text.includes("scores") && r < 0.15) {
    const collCalls = ["runner into catcher", "catcher blocked the plate", "that was a clean block"];
    return { callType: collCalls[Math.floor(Math.random() * collCalls.length)], severity: "high", score: 6 };
  }

  // ── GROUND RULE DISPUTES (rare but fun) ──
  if ((type === "double" || type === "triple") && r < 0.02) {
    const grCalls = ["ball lodged in fence", "ball bounced into stands", "ground-rule double vs HR"];
    return { callType: grCalls[Math.floor(Math.random() * grCalls.length)], severity: "high", score: 7 };
  }

  // ── EQUIPMENT (very 1980s) ──
  if (r < 0.006) {
    const equipCalls = ["pine tar issue", "scuffed ball", "broken bat debate"];
    return { callType: equipCalls[Math.floor(Math.random() * equipCalls.length)], severity: "low", score: 1 };
  }

  // ── BASE RUNNING ──
  if (["steal", "caughtstealing"].includes(type) && r < 0.08) {
    return { callType: "missed the bag on appeal", severity: "medium", score: 3 };
  }
  if (type === "double" && r < 0.03) {
    return { callType: "did he touch first?", severity: "low", score: 1 };
  }

  // ── TIME / PACE ──
  if (r < 0.004) {
    const timeCalls = ["ump won't grant time", "pitcher quick-pitching"];
    return { callType: timeCalls[Math.floor(Math.random() * timeCalls.length)], severity: "chirp", score: 0 };
  }

  // ── BENCH JOCKEYING (can happen without any play) ──
  if (!type && r < 0.003) {
    return { callType: "chirps from the dugout", severity: "chirp", score: 0 };
  }

  // ── OBSCURE RARE EVENTS (1 in 500+ games) ──
  if (r < 0.002) {
    const obscureEvents = [
      "fan runs on the field",
      "animal on the field",
      "ball hits a bird",
      "grounds crew interference",
      "umpire hit by batted ball",
      "wrong count displayed",
      "extra baseball thrown onto field",
      "fielder threw glove at ball",
      "argument about a call from three innings ago",
    ];
    return { callType: obscureEvents[Math.floor(Math.random() * obscureEvents.length)], severity: "obscure", score: 8 };
  }

  // ── Extra chance: dugout chirping on any ball-in-play ──
  if (r < 0.015 && type) {
    const genericChirps = [
      "come on, Blue!", "that's been a strike all day", "consistent zone suddenly changes",
      "missed strike call", "repeated edge calls"
    ];
    return { callType: genericChirps[Math.floor(Math.random() * genericChirps.length)], severity: "chirp", score: 0 };
  }

  return null;
}

// ── Dugout Chirp Generator (for no-play bench jockeying) ──
// Called periodically even when no triggering play exists
export function maybeDugoutChirp(gameState) {
  if (!gameState || gameState.gameOver) return null;
  const r = Math.random();
  // ~1.5% chance per check — frequent enough to feel alive
  if (r < 0.015) {
    const chirps = [
      "COME ON, BLUE!",
      "That's been a strike all day!",
      "Where was that one?!",
      "You've gotta be kidding!",
      "He's been calling that all game!",
      "The dugout is getting restless...",
      "Someone's barking from the bench",
      "Chirps coming from the dugout",
    ];
    return { callType: chirps[Math.floor(Math.random() * chirps.length)], severity: "chirp", score: 0 };
  }
  return null;
}

// ── Resolve the argument: who argues, how far, what happens ──
export function resolveArgument(severityInfo, managerPersonality, umpireType, inning, scoreDiff, isHomeTeam) {
  if (!severityInfo) return null;

  const manager = managerPersonality || 5;
  const umpire = UMPIRE_TYPES[umpireType] || UMPIRE_TYPES.standard;
  const managerFire = manager / 10;

  // ── Manager decides whether to engage ──
  let whoArgues = null;
  let escaLevel = 0;
  const r = Math.random();

  // Chirp: just a shout from the dugout, no escalation
  if (severityInfo.severity === "chirp") {
    if (r < 0.25 + managerFire * 0.3) whoArgues = "manager";
    else if (r < 0.50) whoArgues = "batter";
    else if (r < 0.70) whoArgues = "catcher";
    else whoArgues = "dugout";
    escaLevel = 0;
    return {
      whoArgues, escaLevel: 0, ejected: false,
      manager, umpireType, callType: severityInfo.callType,
      callText: severityInfo.callType,
      crowdExcitement: 5,
      isChirp: true,
    };
  }

  // Calm manager (1-3): only argues major calls
  if (manager <= 3 && severityInfo.severity === "low") return null;
  if (manager <= 2 && severityInfo.severity === "medium" && r < 0.40) return null;

  // Hothead (7-8): argues everything
  const hotheadBoost = manager >= 7 ? 0.15 : 0;

  // Billy Martin mode (9-10): extreme
  const billyMartin = manager >= 9;

  // ── Who argues? ──
  // Batters don't argue walks, HBP, or ball calls — they just got on base
  const callIsWalk = severityInfo.callType?.includes("ball four") || severityInfo.callType?.includes("ball/strike") || severityInfo.callType?.includes("hit by the pitch") || severityInfo.callType?.includes("borderline");
  const canBatterArgue = !callIsWalk;

  if (severityInfo.severity === "obscure" || severityInfo.severity === "high") {
    whoArgues = "manager";
  } else if (severityInfo.severity === "medium") {
    if (r < 0.55 + hotheadBoost) whoArgues = "manager";
    else if (canBatterArgue && r < 0.72) whoArgues = "batter";
    else if (r < 0.85) whoArgues = "catcher";
    else whoArgues = "pitcher";
  } else { // low
    if (r < 0.30 + hotheadBoost) whoArgues = "manager";
    else if (canBatterArgue && r < 0.55) whoArgues = "batter";
    else if (r < 0.75) whoArgues = "catcher";
    else whoArgues = "pitcher";
  }

  // ── Escalation (manager only) ──
  if (whoArgues === "manager") {
    const lateBonus = inning >= 7 ? 0.12 : 0;
    const closeBonus = Math.abs(scoreDiff) <= 2 ? 0.08 : 0;
    const severityPush = severityInfo.score / 10 * 0.20;

    if (r < 0.35 - managerFire * 0.3) {
      escaLevel = 0; // grumbling from dugout — stays calm
    } else if (r < 0.55 - managerFire * 0.2 + lateBonus) {
      escaLevel = 1; // leaning out
    } else if (r < 0.80 - managerFire * 0.4 + lateBonus + closeBonus + severityPush) {
      escaLevel = 2; // on the field
    } else if (r < 0.93 + severityPush * 0.4) {
      escaLevel = 3; // in umpire's face
    } else {
      escaLevel = 4; // nuclear
    }

    // Lasorda (9) and Dick Williams (7) escalate faster
    if (manager >= 8 && escaLevel >= 1 && r < 0.25) escaLevel = Math.min(4, escaLevel + 1);
    if (manager >= 7 && escaLevel >= 2 && r < 0.20) escaLevel = Math.min(4, escaLevel + 1);

    // Calm managers rarely go above level 2
    if (manager <= 3 && escaLevel >= 3) escaLevel = 2;
  }

  // Non-manager arguments: just grumbling
  if (whoArgues !== "manager") escaLevel = 0;

  // ── Ejection chance (by escalation level, modified by umpire) ──
  const ejectionChances = {
    0: 0,
    1: 0.03 + umpire.leash * 0.2,
    2: 0.18 + umpire.leash * 0.4,
    3: 0.65 + umpire.leash * 0.3,
    4: 1.0,
  };
  const ejected = r < (ejectionChances[escaLevel] || 0);

  // Billy Martin mode: arguing from 3 innings ago always gets ejected if caught
  if (billyMartin && severityInfo.callType.includes("three innings ago")) {
    // Always nuclear, always ejected
    escaLevel = 4;
  }

  // ── Special effects ──
  const delayedEjection = ejected && escaLevel >= 2 && r < 0.10;
  const benchEjection = ejected && escaLevel <= 1 && r < 0.06;
  const hatThrow = escaLevel >= 3 && r < 0.22;
  const dirtKick = escaLevel >= 3 && !hatThrow && r < 0.18;
  const basePickup = escaLevel === 4 && r < 0.04;

  return {
    whoArgues, escaLevel, ejected,
    delayedEjection, benchEjection, hatThrow, dirtKick, basePickup,
    manager, umpireType,
    callType: severityInfo.callType,
    callText: severityInfo.callType,
    crowdExcitement: escaLevel * 15 + (ejected ? 25 : 0) + (hatThrow ? 10 : 0) + (dirtKick ? 15 : 0) + (basePickup ? 20 : 0),
    isChirp: false,
  };
}

// ── Booth-Specific Ejection Commentary ──
export function getEjectionCommentary(homeTeamKey, result) {
  const { whoArgues, escaLevel, ejected, hatThrow, dirtKick, basePickup,
          delayedEjection, benchEjection, isChirp } = result;

  const byBooth = {
    cubs: {
      chirp: ["\"COME ON, BLUE!\"", "\"Where was that?!\"", "\"Oh, he didn't like that one.\"", "\"That's all day!\""],
      grumble: ["\"Come on, Blue!\"", "\"Where was that?\"", "\"You've gotta be kidding!\"", "\"Harry, that was a ball all day.\"", "\"That's all day!\"", "\"Oh, he didn't like that one bit.\""],
      level1: ["\"Uh oh! Here he comes!\"", "\"He's not happy, Steve.\"", "\"The manager would like a word.\"", "\"He's leaning out — this could get interesting.\""],
      level2: ["\"And here comes the manager!\"", "\"He's out of the dugout — this oughta be good!\"", "\"Walking toward the umpire — and he's got plenty to say.\""],
      level3: ["\"Holy cow! He's in his face!\"", "\"Nose-to-nose! Steve, this is getting good!\"", "\"Kicking dirt — this is a real argument!\"", "\"He's really giving it to him!\""],
      level4: ["\"He's tossing everything! The hat! The dirt!\"", "\"This is unbelievable! The manager has lost it!\"", "\"Kicked dirt all over home plate — what a show!\""],
      ejected: ["\"And he's gone!\"", "\"He's outta here!\"", "\"The umpire gives him the thumb!\"", "\"Ejected! The crowd loves it!\""],
      basePickup: ["\"He's taking the base! I've never seen anything like it!\"", "\"The manager is walking off with first base!\""],
      benchEjection: ["\"He didn't even leave the dugout and he's gone!\"", "\"The umpire heard enough — he's tossed him from the bench!\""],
      delayed: ["\"He was walking away... and then said one more thing. Gone!\"", "\"He just couldn't help himself — and now he's ejected!\""],
    },
    dodgers: {
      chirp: ["\"Lasorda has something to say.\"", "\"The dugout disagrees.\""],
      grumble: ["\"The dugout is not pleased.\"", "\"Some disagreement on that call.\"", "\"Tommy Lasorda has something to say.\""],
      level1: ["\"And the manager would like a word. This discussion appears animated.\"", "\"Tommy Lasorda is on the top step. He has a point to make.\""],
      level2: ["\"And now Lasorda is out of the dugout. He's walking toward the umpire.\"", "\"The discussion has moved onto the field. And tempers flare.\""],
      level3: ["\"This is a full-scale argument. Lasorda is right in his face!\"", "\"Nose-to-nose at home plate — this is classic Lasorda.\""],
      level4: ["\"Lasorda has completely lost it! Look at this scene!\"", "\"He's throwing everything he can find! This is extraordinary!\""],
      ejected: ["\"And Lasorda has been ejected. He's leaving the field to a chorus of boos.\"", "\"The umpire has heard enough. Tommy Lasorda is gone.\""],
      basePickup: ["\"I don't believe it — he's taken the base! That's one for the ages.\""],
      benchEjection: ["\"Lasorda didn't even need to leave the dugout to get tossed.\""],
      delayed: ["\"He was turning away... and then one more comment. And that's the ballgame for him.\""],
    },
    tigers: {
      chirp: ["\"Some disagreement from the dugout.\"", "\"The manager lets the umpire hear it.\""],
      grumble: ["\"The manager disagrees with that call.\"", "\"He's not happy in the dugout.\"", "\"A difference of opinion on that one.\""],
      level1: ["\"Sparky Anderson on the top step — he's got something to say.\"", "\"The manager has come out to discuss the call.\""],
      level2: ["\"And Sparky Anderson walks onto the field. He disagrees with the ruling.\"", "\"The discussion moves to the infield. Anderson wants an explanation.\""],
      level3: ["\"This is a heated exchange. Anderson is making his case — animatedly.\"", "\"He's right there — this is a serious discussion.\""],
      level4: ["\"Well now — this is rare. Sparky Anderson is furious.\"", "\"He's letting the umpire have it. You don't see this often from Anderson.\""],
      ejected: ["\"And the umpire has heard enough. Sparky Anderson has been ejected.\"", "\"He's been tossed. The crowd appreciates the effort.\""],
      basePickup: ["\"I don't believe what I'm seeing — he's taken the base with him!\""],
      benchEjection: ["\"From the dugout — the umpire ejects Anderson without him ever stepping on the field.\""],
      delayed: ["\"Anderson was on his way back — and then turned around. That did it.\""],
    },
    mets: {
      chirp: ["\"The Mets dugout has words.\"", "\"Johnson doesn't agree.\""],
      grumble: ["\"Davey Johnson doesn't agree.\"", "\"The Mets dugout has words for the umpire.\"", "\"That call is being questioned.\""],
      level1: ["\"And now Davey Johnson heads up the steps. He wants a word.\"", "\"The manager is leaning out — this could escalate.\""],
      level2: ["\"Davey Johnson is out of the dugout. He's coming out to argue.\"", "\"The manager has taken the field. He's got a point to make.\""],
      level3: ["\"He's in the umpire's face! Johnson is furious!\"", "\"This is a full-blown argument! The Shea crowd is loving it!\""],
      level4: ["\"Johnson has completely exploded! Look at this!\"", "\"He's kicking dirt, throwing his hat — this is a scene!\""],
      ejected: ["\"And he's gone! Johnson has been ejected!\"", "\"The umpire tosses Davey Johnson! The crowd roars!\""],
      basePickup: ["\"He's taken the base! Johnson is walking off with first base — unreal!\""],
      benchEjection: ["\"Johnson never left the dugout and he's still been tossed!\""],
      delayed: ["\"He was walking away — and then one more word. The umpire's arm goes up!\""],
    },
    yankees: {
      chirp: ["\"Berra's chirping from the steps.\"", "\"Holy cow!\"", "\"The Yankee dugout has opinions.\""],
      grumble: ["\"Yogi Berra has something to say about that one.\"", "\"The Yankee dugout isn't happy with that call.\"", "\"Berra's chirping from the steps.\""],
      level1: ["\"Holy cow! Yogi's leaning out!\"", "\"Berra's on the top step — this could be interesting.\"", "\"The manager wants a word with the umpire.\""],
      level2: ["\"And here comes Yogi Berra! He's out of the dugout!\"", "\"Berra's on the field — and he's making his case.\""],
      level3: ["\"Holy cow! He's in his face! Yogi's really giving it to him!\"", "\"This is a classic Yankees argument! Berra is furious!\""],
      level4: ["\"I can't believe this — Yogi's throwing everything!\"", "\"This is chaos! Berra has completely lost it!\""],
      ejected: ["\"And he's gone! Yogi Berra has been ejected!\"", "\"The umpire tosses him! Holy cow!\""],
      basePickup: ["\"He's taking the base! I've never seen Yogi do that!\""],
      benchEjection: ["\"He never even left the dugout! The umpire just tossed him from the bench!\""],
      delayed: ["\"Yogi was headed back — and then he said one more thing. Gone!\""],
    },
    redsox: {
      chirp: ["\"The Red Sox dugout has words.\"", "\"Houk isn't happy.\""],
      grumble: ["\"Ralph Houk disagrees with that one.\"", "\"The Red Sox dugout has some words.\"", "\"A difference of opinion from the Boston bench.\""],
      level1: ["\"Ralph Houk is on the top step. He wants some clarification.\"", "\"The manager is leaning out — he's got something to say.\""],
      level2: ["\"And Houk is out of the dugout. He's coming out to discuss it.\"", "\"The manager takes the field — this could get heated.\""],
      level3: ["\"He's right in the umpire's face! Houk is making his point — emphatically!\"", "\"This is a serious argument! Houk is furious at Fenway!\""],
      level4: ["\"I've never seen Houk like this — he's absolutely lost it!\"", "\"He's kicking dirt, throwing his cap — this is remarkable!\""],
      ejected: ["\"And the umpire has ejected Ralph Houk! The Fenway crowd is on its feet!\"", "\"He's been tossed! Houk is heading to the clubhouse.\""],
      basePickup: ["\"He's taken the base! Houk is carrying first base off the field!\""],
      benchEjection: ["\"Houk never even left the dugout — and he's been ejected anyway!\""],
      delayed: ["\"Houk turned around for one last word — and the umpire's arm goes up!\""],
    },
    padres: {
      chirp: ["\"Williams has something to say.\"", "\"The Padres dugout chirps.\""],
      grumble: ["\"Dick Williams has something to say about that.\"", "\"The Padres dugout isn't thrilled with that call.\"", "\"Williams is chirping from the bench.\""],
      level1: ["\"Dick Williams is out to the top step. He wants a word.\"", "\"The manager is leaning out — Williams has a point to make.\""],
      level2: ["\"And Williams comes out of the dugout. This could get spicy.\"", "\"Dick Williams takes the field — he's going to have his say.\""],
      level3: ["\"Williams is in his face now! This is a full-blown argument!\"", "\"Nose-to-nose! Dick Williams is giving the umpire everything!\""],
      level4: ["\"Williams has gone nuclear! He's kicking dirt everywhere!\"", "\"This is vintage Dick Williams! He's throwing his cap!\""],
      ejected: ["\"And he's gone! Dick Williams is ejected!\"", "\"The umpire tosses him! Williams heads to the clubhouse to a standing ovation.\""],
      basePickup: ["\"He's taking the base! Williams is walking off with first base — incredible!\""],
      benchEjection: ["\"From the dugout — Williams is tossed before he even steps on the field!\""],
      delayed: ["\"Oh, doctor! Williams was headed back and said one more thing — and that's it!\""],
    },
    orioles: {
      chirp: ["\"The Orioles dugout has words.\"", "\"Altobelli lets him hear it.\""],
      grumble: ["\"Joe Altobelli doesn't agree with that call.\"", "\"The Orioles dugout has some words for the umpire.\"", "\"Altobelli is letting the umpire hear it from the bench.\""],
      level1: ["\"Joe Altobelli is on the top step. He wants to have a word.\"", "\"The manager is leaning out. He's got a point to discuss.\""],
      level2: ["\"And Altobelli comes out of the dugout. He's going to have his say.\"", "\"The manager takes the field — this could escalate.\""],
      level3: ["\"Altobelli is right in the umpire's face! This is a heated exchange!\"", "\"He's making his case — and he's not backing down!\""],
      level4: ["\"I don't believe this — Altobelli has completely lost his composure!\"", "\"He's kicking dirt, throwing his hat — what a scene at Memorial Stadium!\""],
      ejected: ["\"And Altobelli has been ejected. The crowd voices their displeasure.\"", "\"The umpire gives him the thumb. Altobelli is gone.\""],
      basePickup: ["\"He's taking the base! Altobelli is carrying it back to the dugout!\""],
      benchEjection: ["\"Altobelli didn't even leave the dugout — and he's been tossed!\""],
      delayed: ["\"He was on his way back — then turned around. That's all it took.\""],
    },
  };

  const booth = byBooth[homeTeamKey] || byBooth.cubs;
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  if (isChirp) return pick(booth.chirp || booth.grumble);

  if (ejected) {
    if (basePickup) return pick(booth.basePickup);
    if (benchEjection) return pick(booth.benchEjection);
    if (delayedEjection) return pick(booth.delayed);
    return pick(booth.ejected);
  }

  if (escaLevel >= 4) return pick(booth.level4);
  if (escaLevel >= 3) return pick(booth.level3);
  if (escaLevel >= 2) return pick(booth.level2);
  if (escaLevel >= 1) return pick(booth.level1);
  return pick(booth.grumble);
}