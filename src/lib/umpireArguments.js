// Umpire Arguments & Ejections - 1984 Theatrical System
// Categories: routine | major | rare | ridiculous
// Each gets its own frequency, cap, and commentary weight

// ── Argument trigger builder helper ──
function arg(callType, severity, score, topicKey, category = 'routine') {
  return { callType, severity, score, topicKey, category };
}

// ── Random from array ──
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Umpire Personalities (legacy) ──
export function rollUmpire() {
  const roll = Math.random();
  if (roll < 0.30) return "easygoing";
  if (roll < 0.80) return "standard";
  return "shortFuse";
}

// ── OBSOLETE: MANAGERS now lives in gameData.js - kept here only for backward compat ──
export const MANAGERS = {};

// ════════════════════════════════════════════════════
// TRIGGER DECISION - comprehensive argument engine
// ════════════════════════════════════════════════════
export function getArgumentSeverity(lastPlay, gameState, usedTopics) {
  if (!lastPlay || !gameState) return null;
  const type = lastPlay?.type;
  const text = lastPlay?.text || "";
  const r = Math.random();

  const tc = usedTopics || {};
  function capped(key, max) { return (tc[key] || 0) >= max; }

  // ── BALL / STRIKE ARGUMENTS (routine - unlimited) ──
  if (["strike","foul"].includes(type)) {
    if (text.includes("Strike 3") || text.includes("strike 3") || text.includes("called strike three")) {
      const calls = ["called strike three","high strike - above the letters","low strike - was it at the knees?","inside strike - batter says off the plate","outside corner - catcher pulled it back"];
      return arg(pick(calls), "medium", 3, "strikeZone", "routine");
    }
    if ((text.includes("takes a") || text.includes("watches it")) && r < 0.22)
      return arg("borderline strike call", "low", 1, "strikeZone", "routine");
    if ((text.includes("Swinging") || text.includes("Swing and")) && r < 0.10)
      return arg("pitch looked outside", "chirp", 0, "strikeZone", "routine");
    return null;
  }
  if (type === "ball") {
    if (text.includes("Ball 4") && r < 0.32)
      return arg("borderline ball four", "low", 1, "strikeZone", "routine");
    if (r < 0.05)
      return arg(pick(["pitch looked good - missed call","that painted the corner","inconsistent strike zone - same pitch was a strike earlier"]), "chirp", 0, "strikeZone", "routine");
    return null;
  }

  // ── SAFE / OUT ARGUMENTS (routine to major) ──
  if (["single","groundout","double"].includes(type)) {
    if (text.includes("beats it out") || text.includes("infield single")) {
      if (!capped("safeOut", 4))
        return arg(pick(["bang-bang play at first","pulled foot by the first baseman","stretch off the bag","late throw - missed by a hair","swipe tag caught the jersey"]), "medium", 4, "safeOut", "routine");
    }
    if (text.includes("fielder's choice")) {
      if (!capped("safeOut", 4))
        return arg(pick(["close force play at second","did the middle infielder touch the bag?","neighborhood play - foot was nowhere near","runner beat the relay"]), "medium", 3, "safeOut", "routine");
    }
    if (text.includes("double play") && r < 0.14) {
      if (!capped("dpPlay", 3))
        return arg(pick(["hard slide into second - legal or interference?","neighborhood play at the bag","runner broke up the double play","missed the base on the pivot","did he touch first on the relay?"]), "medium", 3, "dpPlay", "major");
    }
    return null;
  }

  // ── CATCH / NO CATCH (low to major) ──
  // Lineout → infield trap dispute
  if (["lineout"].includes(type) && r < 0.10) {
    if (!capped("trappedBall", 1))
      return arg(pick(["did the infielder trap it?","short hop or clean catch?","ball hit the dirt first","shoestring grab or did it bounce?","diving catch - did the ball touch grass?"]), "low", 2, "trappedBall", "major");
  }
  // Flyout/popout/sacfly → outfield trap dispute (only when ball went to outfield)
  if (["flyout","sacfly"].includes(type) && r < 0.04) {
    if (!capped("trappedBall", 1)) {
      const inPlay = text && !text.includes("pop-up") && !text.includes("infield");
      const calls = inPlay
        ? ["trapped or clean catch?","outfielder claims he caught it","ball glanced off the wall first","did he squeeze it before it hit the wall?","catch made in the crowd - fan interference?"]
        : ["did the infielder trap it?","short hop or clean catch?","ball hit the dirt first","did it bounce?"];
      return arg(pick(calls), "low", 2, "trappedBall", "major");
    }
  }
  if (type === "error" && r < 0.10) {
    if (!capped("trappedBall", 1))
      return arg("did it hit the grass?", "medium", 3, "trappedBall", "major");
  }

  // ── FAIR / FOUL (routine) ──
  if (["foul","single","double"].includes(type)) {
    if ((text.includes("down the line") || text.includes("past the bag")) && r < 0.18) {
      if (!capped("fairFoul", 2))
        return arg(pick(["fair or foul down the line","ball hit the chalk","did it curve late?","ball landed right near the pole","ground ball past the bag - fair or foul?"]), "medium", 4, "fairFoul", "routine");
    }
  }

  // ── HOME RUN DISPUTES (major to rare) ──
  if (type === "homerun" && r < 0.22) {
    if (!capped("hrDispute", 1)) {
      return arg(pick([
        "fair or foul HR near the pole","fan reached over the wall - interference?",
        "ball hit the railing - HR or in play?","over the fence or ground-rule double?",
        "ball hit the top of the wall","ball left park fair but landed foul",
      ]), "high", 7, "hrDispute", "major");
    }
  }

  // ── FAN / SPECTATOR INTERFERENCE (rare) ──
  if (["flyout","sacfly","homerun"].includes(type) && r < 0.025) {
    if (!capped("fanInterference", 1))
      return arg(pick(["fan interfered with the catch","fan reached onto the field","fan touched a live ball","object thrown onto the field"]), "high", 6, "fanInterference", "rare");
  }

  // ── HIT BY PITCH (major) ──
  // Batting team argues (their player got hit). Calls reflect that perspective.
  if (type === "walk" && (text.includes("hit by the pitch") || text.includes("HBP"))) {
    const hbpHits = gameState?._beanball?.beanballHits || 0;
    const hbpCalls = [
      "that was intentional - warnings should be issued",
      "retaliation from earlier in the game",
      "no warning before - that one had intent",
      "you've got to protect your hitters",
      ...(hbpHits > 1 ? ["that's the second time - eject him"] : []),
    ];
    return arg(pick(hbpCalls), "medium", 5, "hbp", "major");
  }

  // ── CHECK SWINGS (routine) ──
  if (type === "strike" && (text.includes("Swinging") || text.includes("Checked")) && r < 0.08)
    return arg("did he go? - check swing appeal", "low", 2, "checkSwing", "routine");
  // Check-swing strikeout only triggers on actual strikeouts (not first pitch)
  if (type === "strikeout" && gameState.balls + gameState.strikes >= 2 && r < 0.05)
    return arg("strike three - check swing called", "medium", 3, "checkSwing", "routine");

  // ── BALKS (major - managers went nuclear over these) ──
  if (r < 0.009 && !["homerun","error","strikeout"].includes(type)) {
    if (!capped("balk", 1))
      return arg(pick([
        "that's not a balk","he didn't stop - illegal motion",
        "fake to first and then threw home","shoulder flinch - he moved",
        "quick pitch - batter wasn't ready","hidden ball trick - that's a balk!"
      ]), "medium", 3, "balk", "major");
  }

  // ── COLLISION / OBSTRUCTION (rare) ──
  if ((type === "sacfly" || type === "homerun") && text.includes("scores") && r < 0.15) {
    if (!capped("collision", 1))
      return arg(pick(["runner into catcher - blocking the plate","catcher blocked the plate without the ball","fielder obstructed the runner","runner forced wide - obstruction!","clean block or interference?"]), "high", 6, "collision", "rare");
  }

  // ── GROUND RULE DISPUTES (rare) ──
  if ((type === "double" || type === "triple") && r < 0.025) {
    if (!capped("groundRule", 1))
      return arg(pick(["ball lodged in the fence","ball bounced into the stands","ground-rule double vs HR debate","ball stuck in the ivy - what's the call?"]), "high", 7, "groundRule", "rare");
  }

  // ── CATCHER'S INTERFERENCE (rare) ──
  if (["strike","foul"].includes(type) && r < 0.006) {
    if (!capped("catcherInterference", 1))
      return arg("catcher's interference - glove hit the bat", "medium", 4, "catcherInterference", "rare");
  }

  // ── RUNNER LEFT EARLY (routine) ──
  if (["sacfly","flyout"].includes(type) && text.includes("tags") && r < 0.09) {
    if (!capped("leftEarly", 2))
      return arg(pick(["runner left early on the tag-up","appeal at third - did he leave too soon?","tag-up was before the catch?","runner didn't go back to tag"]), "medium", 3, "leftEarly", "routine");
  }

  // ── ILLEGAL PITCH / DOCTORING (rare) ──
  if (r < 0.005 && !["homerun","error"].includes(type)) {
    if (!capped("doctoring", 1))
      return arg(pick(["pitcher going to his mouth on the mound","something on the ball - check his glove","scuffed ball - let me see it","foreign substance on his cap brim","suspicious movement - check the pitcher"]), "low", 1, "doctoring", "rare");
  }

  // ── EQUIPMENT ISSUES (rare) ──
  if (r < 0.007) {
    if (!capped("equipment", 1))
      return arg(pick(["pine tar on the bat handle","cracked bat - fair ball or dead ball?","helmet flew off - time should've been called","illegal bat - too much pine tar","defective glove - illegal equipment"]), "low", 1, "equipment", "rare");
  }

  // ── STEAL / BASE RUNNING (routine) ──
  if (["steal","caughtstealing"].includes(type) && r < 0.10) {
    if (!capped("baseRunning", 3))
      return arg(pick(["missed the bag on the slide","runner came off the bag","tag wasn't applied in time","runner avoided the tag","did he beat the throw?"]), "medium", 3, "baseRunning", "routine");
  }
  if (type === "steal" && r < 0.04)
    return arg("pitchout - they knew he was going", "chirp", 0, "baseRunning", "routine");
  if (type === "double" && r < 0.04) {
    if (!capped("baseRunning", 3))
      return arg("did he touch first?", "low", 1, "baseRunning", "routine");
  }

  // ── PICKOFF PLAYS (routine) ──
  if (r < 0.006 && !["homerun","error","strikeout"].includes(type)) {
    return arg(pick(["pickoff move - he's out! Wait… safe!","did the pitcher balk on that pickoff?","runner got back just in time","that pickoff was close - did he get him?"]), "chirp", 2, "pickoff", "routine");
  }

  // ── INFIELD FLY (rare - still confuses everyone) ──
  if (r < 0.004 && ["popout","flyout"].includes(type)) {
    if (!capped("infieldFly", 1))
      return arg(pick(["infield fly rule - called too early?","the fielder wasn't camped under it","wind pushed the ball - should it be infield fly?","fielder wasn't near the ball - that's not an infield fly"]), "medium", 5, "infieldFly", "rare");
  }

  // ── WEATHER DISPUTES (rare) ──
  if (r < 0.003 && gameState.weather?.effects?.length > 0) {
    if (!capped("weather", 1))
      return arg(pick(["should've called for the tarp earlier","field is too wet - dangerous conditions","rain delay should be longer","wind is making it impossible to field","mound is a mess - pitcher can't get footing"]), "low", 2, "weather", "rare");
  }

  // ── CROWD DELAYS (rare) ──
  if (r < 0.004) {
    if (!capped("crowd", 1))
      return arg(pick(["crowd noise delaying the game","fans won't settle down","the crowd is throwing things onto the field","spectators refusing to leave the railing"]), "chirp", 1, "crowd", "rare");
  }

  // ── LINEUP CARD ISSUES (very rare) ──
  if (r < 0.0015) {
    if (!capped("lineup", 1))
      return arg(pick(["batting out of order - who was supposed to be up?","wrong player listed on the lineup card","illegal substitution - that player already left the game","DH confusion - who is the designated hitter?"]), "medium", 5, "lineup", "ridiculous");
  }

  // ── TIME / PACE (chirp) ──
  if (r < 0.005) {
    return arg(pick(["ump won't grant time","pitcher quick-pitching","batter not ready - should've been dead ball","batter stepping out too many times"]), "chirp", 0, "timePace", "routine");
  }

  // ── BENCH JOCKEYING (chirp) ──
  if (!type && r < 0.004) {
    return arg(pick(["chirps from the dugout","sarcastic applause from the bench","someone just threw a towel","the dugout is getting loud"]), "chirp", 0, "chirp", "routine");
  }

  // ── OBSCURE / RIDICULOUS EVENTS (cap at 1) ──
  if (r < 0.0025) {
    if (!capped("obscure", 1)) {
      const events = [
        "fan runs on the field","animal on the field","ball hits a bird",
        "grounds crew interference","umpire hit by batted ball","wrong count displayed on the scoreboard",
        "extra baseball thrown onto the field","fielder threw his glove at the ball",
        "argument about a call from three innings ago","bat flying into the dugout",
        "ball lodged in fielder's uniform","broken bat causes dispute",
        "PA announcer introduced the wrong batter","stadium clock malfunction",
        "fireworks went off mid-play","mascot ran across the field during the play",
        "coach accidentally touched a live ball",
      ];
      return arg(pick(events), "obscure", 8, "obscure", "ridiculous");
    }
  }

  // ── Extra chance: dugout chirping on any ball-in-play ──
  if (r < 0.018 && type) {
    const chirps = [
      "come on, Blue!","that's been a strike all day","zone keeps changing",
      "where was that pitch?","get some glasses, ump","inconsistent zone all night",
      "he's been calling that all game","you gotta be kidding me","that's not even close",
      "the dugout disagrees","someone's barking from the bench","bench is restless",
    ];
    return arg(pick(chirps), "chirp", 0, "chirp", "routine");
  }

  return null;
}

// ── Dugout Chirp Generator (no-play bench jockeying) ──
export function maybeDugoutChirp(gameState) {
  if (!gameState || gameState.gameOver) return null;
  const r = Math.random();
  if (r < 0.018) {
    const chirps = [
      "COME ON, BLUE!","That's been a strike all day!","Where was that one?!",
      "You've gotta be kidding!","He's been calling that all game!",
      "The dugout is getting restless...","Someone's barking from the bench",
      "Chirps coming from the dugout","The bench is letting Blue hear it",
      "Sarcastic cheering from the dugout","Someone just threw a towel onto the field",
      "Voices raised in the dugout - they want a call",
      "The manager is having a word from the top step",
    ];
    return { callType: pick(chirps), severity: "chirp", score: 0, category: "routine" };
  }
  return null;
}

// ── Resolve the argument: who argues, how far, what happens ──
export function resolveArgument(severityInfo, managerPersonality, umpire, inning, scoreDiff, isHomeTeam, isFieldingTeamArguing = true) {
  if (!severityInfo) return null;

  const managerFire = (managerPersonality || 5) / 10;

  // Support both new umpire objects and legacy string types
  let umpireData;
  if (typeof umpire === 'object' && umpire !== null) {
    umpireData = {
      name: umpire.name || "Standard",
      leash: umpire.temperament?.leash || 0.25,
      warningChance: umpire.temperament?.warningChance || 0.40,
      quickEject: umpire.temperament?.quickEject || false,
      type: umpire.temperament?.type || "standard",
      patience: umpire.temperament?.patience || 50,
      ego: umpire.temperament?.ego || 50,
    };
    umpire.umpireData = umpireData;
  } else {
    const legacyTypes = {
      easygoing: { name: "Easygoing", leash: 0.15, warningChance: 0.70, quickEject: false, type: "easygoing", patience: 80, ego: 30 },
      standard: { name: "Standard", leash: 0.25, warningChance: 0.40, quickEject: false, type: "standard", patience: 50, ego: 50 },
      shortFuse: { name: "Short Fuse", leash: 0.40, warningChance: 0.15, quickEject: true, type: "shortFuse", patience: 20, ego: 80 },
    };
    umpireData = legacyTypes[umpire] || legacyTypes.standard;
    umpire = { umpireData };
  }

  let whoArgues = null;
  let escaLevel = 0;
  const r = Math.random();

  // ── HBP: batter vs pitcher tension ──
  const isHBP = severityInfo.callType?.includes("hit by the pitch") ||
                severityInfo.callType?.includes("leaned into it") ||
                severityInfo.callType?.includes("that was intentional") ||
                severityInfo.callType?.includes("retaliation") ||
                severityInfo.callType?.includes("crowded the plate");

  if (isHBP) {
    const hbpReactions = [
      "batter glares at the pitcher","batter says something to the mound",
      "batter stares down at the pitcher on his way to first","batter and catcher exchange words",
      "batter takes his time getting to first - not happy",
    ];
    const reaction = pick(hbpReactions);
    if (r < 0.20 + managerFire * 0.18) {
      return { whoArgues: "manager", escaLevel: 1, ejected: false,
        manager: managerPersonality, umpireType: umpireData.type, umpireName: umpire?.name,
        callType: severityInfo.callType, callText: reaction, crowdExcitement: 10,
        isChirp: false, isHBP: true };
    }
    return { whoArgues: "batter", escaLevel: 0, ejected: false,
      manager: managerPersonality, umpireType: umpireData.type, umpireName: umpire?.name,
      callType: severityInfo.callType, callText: reaction, crowdExcitement: 5,
      isChirp: true, isHBP: true };
  }

  // Chirp: shout from the dugout, no escalation
  if (severityInfo.severity === "chirp") {
    if (r < 0.25 + managerFire * 0.3) whoArgues = "manager";
    else if (r < 0.50) whoArgues = "batter";
    else if (r < 0.70) whoArgues = "catcher";
    else whoArgues = "dugout";
    return { whoArgues, escaLevel: 0, ejected: false,
      manager: managerPersonality, umpireType: umpireData.type, umpireName: umpire?.name,
      callType: severityInfo.callType, callText: severityInfo.callType,
      crowdExcitement: 5, isChirp: true };
  }

  // Calm manager: only argues major calls
  if (managerPersonality <= 3 && severityInfo.severity === "low") return null;
  if (managerPersonality <= 2 && severityInfo.severity === "medium" && r < 0.40) return null;

  // Hothead boost
  const hotheadBoost = managerPersonality >= 7 ? 0.15 : 0;
  const billyMartin = managerPersonality >= 9;

  // ── Who argues? ──
  const callIsWalk = severityInfo.callType?.includes("ball four") ||
    severityInfo.callType?.includes("hit by the pitch") || severityInfo.callType?.includes("borderline");
  const canBatterArgue = !callIsWalk;

  if (severityInfo.severity === "obscure" || severityInfo.severity === "high") {
    whoArgues = "manager";
  } else if (severityInfo.severity === "medium") {
    if (r < 0.55 + hotheadBoost) whoArgues = "manager";
    else if (!isFieldingTeamArguing && canBatterArgue && r < 0.72) whoArgues = "batter";
    else if (isFieldingTeamArguing && r < 0.80) whoArgues = "catcher";
    else if (isFieldingTeamArguing) whoArgues = "pitcher";
    else if (!isFieldingTeamArguing) whoArgues = "batter";
    else whoArgues = "manager";
  } else {
    if (r < 0.30 + hotheadBoost) whoArgues = "manager";
    else if (!isFieldingTeamArguing && canBatterArgue && r < 0.55) whoArgues = "batter";
    else if (isFieldingTeamArguing && r < 0.75) whoArgues = "catcher";
    else if (isFieldingTeamArguing) whoArgues = "pitcher";
    else if (!isFieldingTeamArguing) whoArgues = "batter";
    else whoArgues = "manager";
  }

  // ── Escalation (manager only) ──
  if (whoArgues === "manager") {
    const lateBonus = inning >= 7 ? 0.12 : 0;
    const closeBonus = Math.abs(scoreDiff) <= 2 ? 0.08 : 0;
    const severityPush = (severityInfo.score || 0) / 10 * 0.20;
    const categoryPush = severityInfo.category === "ridiculous" ? 0.10 : severityInfo.category === "rare" ? 0.05 : 0;

    if (r < 0.35 - managerFire * 0.3) escaLevel = 0;
    else if (r < 0.55 - managerFire * 0.2 + lateBonus) escaLevel = 1;
    else if (r < 0.80 - managerFire * 0.4 + lateBonus + closeBonus + severityPush + categoryPush) escaLevel = 2;
    else if (r < 0.93 + severityPush * 0.4) escaLevel = 3;
    else escaLevel = 4;

    if (managerPersonality >= 8 && escaLevel >= 1 && r < 0.25) escaLevel = Math.min(4, escaLevel + 1);
    if (managerPersonality >= 7 && escaLevel >= 2 && r < 0.20) escaLevel = Math.min(4, escaLevel + 1);
    if (managerPersonality <= 3 && escaLevel >= 3) escaLevel = 2;
  }

  if (whoArgues !== "manager") escaLevel = 0;

  // ── Ejection chance ──
  const ejectionChances = { 0: 0, 1: 0.03 + umpireData.leash * 0.2, 2: 0.18 + umpireData.leash * 0.4, 3: 0.65 + umpireData.leash * 0.3, 4: 1.0 };
  let ejected = r < (ejectionChances[escaLevel] || 0);

  if (billyMartin && severityInfo.callType?.includes("three innings ago")) { escaLevel = 4; ejected = true; }

  // ── Special effects ──
  const delayedEjection = ejected && escaLevel >= 2 && r < 0.10;
  const benchEjection = ejected && escaLevel <= 1 && r < 0.06;
  const hatThrow = escaLevel >= 3 && r < 0.22;
  const dirtKick = escaLevel >= 3 && !hatThrow && r < 0.18;
  const basePickup = escaLevel === 4 && r < 0.04;
  const fingerInFace = escaLevel >= 3 && r < 0.30;
  const throwingEquipment = escaLevel >= 2 && r < 0.08;

  return {
    whoArgues, escaLevel, ejected, delayedEjection, benchEjection, hatThrow, dirtKick, basePickup, fingerInFace, throwingEquipment,
    manager: managerPersonality, umpireType: umpireData.type, umpireName: umpire?.name,
    callType: severityInfo.callType, callText: severityInfo.callType,
    crowdExcitement: escaLevel * 15 + (ejected ? 25 : 0) + (hatThrow ? 10 : 0) + (dirtKick ? 15 : 0) + (basePickup ? 20 : 0) + (fingerInFace ? 8 : 0),
    isChirp: false,
  };
}

// ── Booth-Specific Ejection Commentary ──
export function getEjectionCommentary(homeTeamKey, result) {
  const { whoArgues, escaLevel, ejected, hatThrow, dirtKick, basePickup,
          delayedEjection, benchEjection, isChirp } = result;

  const byBooth = {
    cubs: {
      chirp: ["\"COME ON, BLUE!\"","\"Where was that?!\"","\"Oh, he didn't like that one.\"","\"That's all day!\""],
      grumble: ["\"Come on, Blue!\"","\"Where was that?\"","\"You've gotta be kidding!\"","\"Harry, that was a ball all day.\"","\"That's all day!\"","\"Oh, he didn't like that one bit.\""],
      level1: ["\"Uh oh! Here he comes!\"","\"He's not happy, Steve.\"","\"The manager would like a word.\"","\"He's leaning out - this could get interesting.\""],
      level2: ["\"And here comes the manager!\"","\"He's out of the dugout - this oughta be good!\"","\"Walking toward the umpire - and he's got plenty to say.\""],
      level3: ["\"Holy cow! He's in his face!\"","\"Nose-to-nose! Steve, this is getting good!\"","\"Kicking dirt - this is a real argument!\"","\"He's really giving it to him!\""],
      level4: ["\"He's tossing everything! The hat! The dirt!\"","\"This is unbelievable! The manager has lost it!\"","\"Kicked dirt all over home plate - what a show!\""],
      ejected: ["\"And he's gone!\"","\"He's outta here!\"","\"The umpire gives him the thumb!\"","\"Ejected! The crowd loves it!\""],
      basePickup: ["\"He's taking the base! I've never seen anything like it!\"","\"The manager is walking off with first base!\""],
      benchEjection: ["\"He didn't even leave the dugout and he's gone!\"","\"The umpire heard enough - he's tossed him from the bench!\""],
      delayed: ["\"He was walking away... and then said one more thing. Gone!\"","\"He just couldn't help himself - and now he's ejected!\""],
    },
    dodgers: {
      chirp: ["\"Lasorda has something to say.\"","\"The dugout disagrees.\""],
      grumble: ["\"The dugout is not pleased.\"","\"Some disagreement on that call.\"","\"Tommy Lasorda has something to say.\""],
      level1: ["\"And the manager would like a word. This discussion appears animated.\"","\"Tommy Lasorda is on the top step. He has a point to make.\""],
      level2: ["\"And now Lasorda is out of the dugout. He's walking toward the umpire.\"","\"The discussion has moved onto the field. And tempers flare.\""],
      level3: ["\"This is a full-scale argument. Lasorda is right in his face!\"","\"Nose-to-nose at home plate - this is classic Lasorda.\""],
      level4: ["\"Lasorda has completely lost it! Look at this scene!\"","\"He's throwing everything he can find! This is extraordinary!\""],
      ejected: ["\"And Lasorda has been ejected. He's leaving the field to a chorus of boos.\"","\"The umpire has heard enough. Tommy Lasorda is gone.\""],
      basePickup: ["\"I don't believe it - he's taken the base! That's one for the ages.\""],
      benchEjection: ["\"Lasorda didn't even need to leave the dugout to get tossed.\""],
      delayed: ["\"He was turning away... and then one more comment. And that's the ballgame for him.\""],
    },
    tigers: {
      chirp: ["\"Some disagreement from the dugout.\"","\"The manager lets the umpire hear it.\""],
      grumble: ["\"The manager disagrees with that call.\"","\"He's not happy in the dugout.\"","\"A difference of opinion on that one.\""],
      level1: ["\"Sparky Anderson on the top step - he's got something to say.\"","\"The manager has come out to discuss the call.\""],
      level2: ["\"And Sparky Anderson walks onto the field. He disagrees with the ruling.\"","\"The discussion moves to the infield. Anderson wants an explanation.\""],
      level3: ["\"This is a heated exchange. Anderson is making his case - animatedly.\"","\"He's right there - this is a serious discussion.\""],
      level4: ["\"Well now - this is rare. Sparky Anderson is furious.\"","\"He's letting the umpire have it. You don't see this often from Anderson.\""],
      ejected: ["\"And the umpire has heard enough. Sparky Anderson has been ejected.\"","\"He's been tossed. The crowd appreciates the effort.\""],
      basePickup: ["\"I don't believe what I'm seeing - he's taken the base with him!\""],
      benchEjection: ["\"From the dugout - the umpire ejects Anderson without him ever stepping on the field.\""],
      delayed: ["\"Anderson was on his way back - and then turned around. That did it.\""],
    },
    mets: {
      chirp: ["\"The Mets dugout has words.\"","\"Johnson doesn't agree.\""],
      grumble: ["\"Davey Johnson doesn't agree.\"","\"The Mets dugout has words for the umpire.\"","\"That call is being questioned.\""],
      level1: ["\"And now Davey Johnson heads up the steps. He wants a word.\"","\"The manager is leaning out - this could escalate.\""],
      level2: ["\"Davey Johnson is out of the dugout. He's coming out to argue.\"","\"The manager has taken the field. He's got a point to make.\""],
      level3: ["\"He's in the umpire's face! Johnson is furious!\"","\"This is a full-blown argument! The Shea crowd is loving it!\""],
      level4: ["\"Johnson has completely exploded! Look at this!\"","\"He's kicking dirt, throwing his hat - this is a scene!\""],
      ejected: ["\"And he's gone! Johnson has been ejected!\"","\"The umpire tosses Davey Johnson! The crowd roars!\""],
      basePickup: ["\"He's taken the base! Johnson is walking off with first base - unreal!\""],
      benchEjection: ["\"Johnson never left the dugout and he's still been tossed!\""],
      delayed: ["\"He was walking away - and then one more word. The umpire's arm goes up!\""],
    },
    yankees: {
      chirp: ["\"Berra's chirping from the steps.\"","\"Holy cow!\"","\"The Yankee dugout has opinions.\""],
      grumble: ["\"Yogi Berra has something to say about that one.\"","\"The Yankee dugout isn't happy with that call.\"","\"Berra's chirping from the steps.\""],
      level1: ["\"Holy cow! Yogi's leaning out!\"","\"Berra's on the top step - this could be interesting.\"","\"The manager wants a word with the umpire.\""],
      level2: ["\"And here comes Yogi Berra! He's out of the dugout!\"","\"Berra's on the field - and he's making his case.\""],
      level3: ["\"Holy cow! He's in his face! Yogi's really giving it to him!\"","\"This is a classic Yankees argument! Berra is furious!\""],
      level4: ["\"I can't believe this - Yogi's throwing everything!\"","\"This is chaos! Berra has completely lost it!\""],
      ejected: ["\"And he's gone! Yogi Berra has been ejected!\"","\"The umpire tosses him! Holy cow!\""],
      basePickup: ["\"He's taking the base! I've never seen Yogi do that!\""],
      benchEjection: ["\"He never even left the dugout! The umpire just tossed him from the bench!\""],
      delayed: ["\"Yogi was headed back - and then he said one more thing. Gone!\""],
    },
    redsox: {
      chirp: ["\"The Red Sox dugout has words.\"","\"Houk isn't happy.\""],
      grumble: ["\"Ralph Houk disagrees with that one.\"","\"The Red Sox dugout has some words.\"","\"A difference of opinion from the Boston bench.\""],
      level1: ["\"Ralph Houk is on the top step. He wants some clarification.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And Houk is out of the dugout. He's coming out to discuss it.\"","\"The manager takes the field - this could get heated.\""],
      level3: ["\"He's right in the umpire's face! Houk is making his point - emphatically!\"","\"This is a serious argument! Houk is furious at Fenway!\""],
      level4: ["\"I've never seen Houk like this - he's absolutely lost it!\"","\"He's kicking dirt, throwing his cap - this is remarkable!\""],
      ejected: ["\"And the umpire has ejected Ralph Houk! The Fenway crowd is on its feet!\"","\"He's been tossed! Houk is heading to the clubhouse.\""],
      basePickup: ["\"He's taken the base! Houk is carrying first base off the field!\""],
      benchEjection: ["\"Houk never even left the dugout - and he's been ejected anyway!\""],
      delayed: ["\"Houk turned around for one last word - and the umpire's arm goes up!\""],
    },
    padres: {
      chirp: ["\"Williams has something to say.\"","\"The Padres dugout chirps.\""],
      grumble: ["\"Dick Williams has something to say about that.\"","\"The Padres dugout isn't thrilled with that call.\"","\"Williams is chirping from the bench.\""],
      level1: ["\"Dick Williams is out to the top step. He wants a word.\"","\"The manager is leaning out - Williams has a point to make.\""],
      level2: ["\"And Williams comes out of the dugout. This could get spicy.\"","\"Dick Williams takes the field - he's going to have his say.\""],
      level3: ["\"Williams is in his face now! This is a full-blown argument!\"","\"Nose-to-nose! Dick Williams is giving the umpire everything!\""],
      level4: ["\"Williams has gone nuclear! He's kicking dirt everywhere!\"","\"This is vintage Dick Williams! He's throwing his cap!\""],
      ejected: ["\"And he's gone! Dick Williams is ejected!\"","\"The umpire tosses him! Williams heads to the clubhouse to a standing ovation.\""],
      basePickup: ["\"He's taking the base! Williams is walking off with first base - incredible!\""],
      benchEjection: ["\"From the dugout - Williams is tossed before he even steps on the field!\""],
      delayed: ["\"Oh, doctor! Williams was headed back and said one more thing - and that's it!\""],
    },
    orioles: {
      chirp: ["\"The Orioles dugout has words.\"","\"Altobelli lets him hear it.\""],
      grumble: ["\"Joe Altobelli doesn't agree with that call.\"","\"The Orioles dugout has some words for the umpire.\"","\"Altobelli is letting the umpire hear it from the bench.\""],
      level1: ["\"Joe Altobelli is on the top step. He wants to have a word.\"","\"The manager is leaning out. He's got a point to discuss.\""],
      level2: ["\"And Altobelli comes out of the dugout. He's going to have his say.\"","\"The manager takes the field - this could escalate.\""],
      level3: ["\"Altobelli is right in the umpire's face! This is a heated exchange!\"","\"He's making his case - and he's not backing down!\""],
      level4: ["\"I don't believe this - Altobelli has completely lost his composure!\"","\"He's kicking dirt, throwing his hat - what a scene at Memorial Stadium!\""],
      ejected: ["\"And Altobelli has been ejected. The crowd voices their displeasure.\"","\"The umpire gives him the thumb. Altobelli is gone.\""],
      basePickup: ["\"He's taking the base! Altobelli is carrying it back to the dugout!\""],
      benchEjection: ["\"Altobelli didn't even leave the dugout - and he's been tossed!\""],
      delayed: ["\"He was on his way back - then turned around. That's all it took.\""],
    },
    reds: {
      chirp: ["\"Rose isn't happy with that one.\"","\"The Reds dugout has words.\""],
      grumble: ["\"Pete Rose isn't happy with that call.\"","\"The Reds bench has something to say.\"","\"Rose is letting the umpire hear it from the dugout.\""],
      level1: ["\"Pete Rose on the top step - he's going to have his say.\"","\"The player-manager wants a word with the umpire.\""],
      level2: ["\"And here comes Rose out of the dugout! He's walking toward the umpire.\"","\"Pete Rose takes the field - he's got a point to make and he's going to make it.\""],
      level3: ["\"Rose is in the umpire's face now! This is vintage Charlie Hustle!\"","\"He's nose-to-nose with the umpire - Pete Rose is furious!\""],
      level4: ["\"Pete Rose has completely lost it! He's kicking dirt everywhere!\"","\"This is extraordinary - Rose is throwing his hat, kicking the ground!\""],
      ejected: ["\"And Rose has been ejected! The Riverfront crowd is on its feet!\"","\"The umpire tosses Pete Rose! He's done for the night!\""],
      basePickup: ["\"He's taking the base! Rose is walking off with first base!\""],
      benchEjection: ["\"Rose never left the dugout and he's been tossed anyway!\""],
      delayed: ["\"He was walking away... then turned around and said one more thing. Gone!\""],
    },
    braves: {
      chirp: ["\"Torre has a word from the bench.\"","\"The Braves dugout isn't happy.\""],
      grumble: ["\"Joe Torre doesn't agree with that one.\"","\"The Braves dugout has some words.\"","\"Torre's seen enough of that call.\""],
      level1: ["\"Joe Torre on the top step - he wants a word.\"","\"Torre is leaning out. He'd like to discuss that.\""],
      level2: ["\"And here comes Torre. He's walking out to the umpire.\"","\"Torre takes the field - calmly, but firmly.\""],
      level3: ["\"Torre is right in his face now! He's had enough!\"","\"This is a heated one - Torre isn't backing down!\""],
      level4: ["\"Joe Torre has lost it - you don't see this often!\"","\"He's kicking dirt, throwing his cap - Torre is furious!\""],
      ejected: ["\"And Torre's been ejected! The Atlanta crowd lets the umpire hear it!\"","\"The umpire tosses Joe Torre! He's gone!\""],
      basePickup: ["\"He's taking the base! Torre is walking off with first base!\""],
      benchEjection: ["\"Torre never left the dugout - and he's been tossed!\""],
      delayed: ["\"Torre turned back for one last word - and that's the ballgame for him!\""],
    },
    astros: {
      chirp: ["\"Lillis has something to say.\"","\"The Astros dugout chirps.\""],
      grumble: ["\"Bob Lillis doesn't like that call.\"","\"The Astros bench disagrees.\"","\"Lillis is letting the umpire hear it from the dugout.\""],
      level1: ["\"Bob Lillis on the top step. He wants clarification.\"","\"The manager is leaning out - he's got a question.\""],
      level2: ["\"And Lillis comes out of the dugout. He's going to have his say.\"","\"Lillis walks toward the umpire - this could heat up.\""],
      level3: ["\"Lillis is right in the umpire's face! He's not backing down!\"","\"This is getting heated - Lillis is making his case emphatically!\""],
      level4: ["\"Lillis has gone off! He's kicking dirt everywhere!\"","\"You don't see this from Bob Lillis - he's completely lost it!\""],
      ejected: ["\"And Lillis has been ejected! The Astrodome crowd boos the umpire!\"","\"The umpire tosses Bob Lillis! He's done!\""],
      basePickup: ["\"He's taking the base! Lillis is walking off with it!\""],
      benchEjection: ["\"Lillis didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Lillis was headed back - then turned around. That did it!\""],
    },
    giants: {
      chirp: ["\"Robinson has a word.\"","\"The Giants dugout chirps.\""],
      grumble: ["\"Frank Robinson doesn't agree with that call.\"","\"The Giants bench has something to say.\"","\"Robinson is letting the umpire hear it.\""],
      level1: ["\"Frank Robinson on the top step. He wants a word.\"","\"The player-manager is leaning out - this could get interesting.\""],
      level2: ["\"And here comes Robinson! He's out of the dugout!\"","\"Robinson takes the field - and he's got plenty to say.\""],
      level3: ["\"Robinson is in the umpire's face! This is a Hall of Famer who won't back down!\"","\"Nose-to-nose! Frank Robinson is furious!\""],
      level4: ["\"Robinson has completely lost it! He's kicking dirt everywhere!\"","\"This is a fiery one - Robinson is throwing his cap!\""],
      ejected: ["\"And Frank Robinson has been ejected! The Candlestick crowd is on its feet!\"","\"The umpire tosses Robinson! He's gone!\""],
      basePickup: ["\"He's taking the base! Robinson is walking off with first base!\""],
      benchEjection: ["\"Robinson never left the dugout - and he's been tossed!\""],
      delayed: ["\"Robinson turned back for one more word - and the umpire's arm went up!\""],
    },
    cardinals: {
      chirp: ["\"Herzog has something to say.\"","\"The Cardinals dugout chirps.\""],
      grumble: ["\"Whitey Herzog doesn't like that call one bit.\"","\"The Cardinals bench is letting the umpire hear it.\"","\"Herzog disagrees - and he's not quiet about it.\""],
      level1: ["\"Whitey Herzog on the top step - he wants a word.\"","\"The White Rat is leaning out. This could get good.\""],
      level2: ["\"And here comes Herzog! He's out of the dugout!\"","\"Herzog takes the field - and he's got a point to make.\""],
      level3: ["\"Herzog is in the umpire's face! The White Rat is furious!\"","\"Nose-to-nose! This is classic Herzog!\""],
      level4: ["\"Herzog has gone nuclear! He's kicking dirt everywhere!\"","\"The White Rat has completely lost it - what a scene!\""],
      ejected: ["\"And Herzog has been ejected! The Busch Stadium crowd loves it!\"","\"The umpire tosses Whitey Herzog! He's done for the night!\""],
      basePickup: ["\"He's taking the base! Herzog is walking off with first base!\""],
      benchEjection: ["\"Herzog didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Herzog was headed back - then turned around. That's all it took!\""],
    },
    pirates: {
      chirp: ["\"Tanner has a word.\"","\"The Pirates dugout chirps.\""],
      grumble: ["\"Chuck Tanner doesn't agree with that one.\"","\"The Pirates bench has some words.\"","\"Tanner's letting the umpire hear it.\""],
      level1: ["\"Chuck Tanner on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Tanner! He's out of the dugout!\"","\"Tanner takes the field - this could get interesting.\""],
      level3: ["\"Tanner is in the umpire's face! He's not backing down!\"","\"This is a heated one - Tanner is making his case!\""],
      level4: ["\"Tanner has lost it! He's kicking dirt everywhere!\"","\"You don't see this often from Chuck Tanner - he's furious!\""],
      ejected: ["\"And Tanner's been ejected! The Three Rivers crowd boos the umpire!\"","\"The umpire tosses Chuck Tanner! He's gone!\""],
      basePickup: ["\"He's taking the base! Tanner is walking off with first base!\""],
      benchEjection: ["\"Tanner never left the dugout - and he's been tossed!\""],
      delayed: ["\"Tanner turned back for one more word - and that's it!\""],
    },
    phillies: {
      chirp: ["\"Owens has a word.\"","\"The Phillies dugout chirps.\""],
      grumble: ["\"Paul Owens doesn't like that call.\"","\"The Phillies bench has some words for the umpire.\"","\"Owens is letting him hear it from the dugout.\""],
      level1: ["\"Paul Owens on the top step. He wants a word.\"","\"The Pope is leaning out - he's got a point to make.\""],
      level2: ["\"And here comes Owens! He's out of the dugout!\"","\"Owens takes the field - this could heat up.\""],
      level3: ["\"Owens is in the umpire's face! He's not backing down!\"","\"This is a heated exchange - Owens is furious!\""],
      level4: ["\"Owens has lost it! He's kicking dirt everywhere!\"","\"The Pope has completely lost his composure!\""],
      ejected: ["\"And Owens has been ejected! The Vet crowd lets the umpire hear it!\"","\"The umpire tosses Paul Owens! He's gone!\""],
      basePickup: ["\"He's taking the base! Owens is walking off with first base!\""],
      benchEjection: ["\"Owens didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Owens turned back for one last word - and that did it!\""],
    },
    expos: {
      chirp: ["\"Virdon has a word.\"","\"The Expos dugout chirps.\""],
      grumble: ["\"Bill Virdon doesn't agree with that call.\"","\"The Expos bench has some words.\"","\"Virdon's not happy with that one.\""],
      level1: ["\"Bill Virdon on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Virdon! He's out of the dugout!\"","\"Virdon takes the field - calmly, but firmly.\""],
      level3: ["\"Virdon is in the umpire's face! He's making his case!\"","\"This is a heated one - Virdon isn't backing down!\""],
      level4: ["\"Virdon has lost it! He's kicking dirt everywhere!\"","\"You don't see this from Bill Virdon - he's completely lost it!\""],
      ejected: ["\"And Virdon's been ejected! The Olympic Stadium crowd boos!\"","\"The umpire tosses Bill Virdon! He's gone!\""],
      basePickup: ["\"He's taking the base! Virdon is walking off with first base!\""],
      benchEjection: ["\"Virdon never left the dugout - and he's been tossed!\""],
      delayed: ["\"Virdon turned back for one more word - and that's it!\""],
    },
    brewers: {
      chirp: ["\"Lachemann has a word.\"","\"The Brewers dugout chirps.\""],
      grumble: ["\"Rene Lachemann doesn't like that call.\"","\"The Brewers bench has some words.\"","\"Lachemann is letting the umpire hear it.\""],
      level1: ["\"Rene Lachemann on the top step. He wants a word.\"","\"The young manager is leaning out - this could heat up.\""],
      level2: ["\"And here comes Lachemann! He's out of the dugout!\"","\"Lachemann takes the field - and he's fired up!\""],
      level3: ["\"Lachemann is in the umpire's face! He's not backing down!\"","\"This is a heated one - Lachemann is furious!\""],
      level4: ["\"Lachemann has lost it! He's kicking dirt everywhere!\"","\"The young skipper has completely lost his composure!\""],
      ejected: ["\"And Lachemann's been ejected! The County Stadium crowd loves it!\"","\"The umpire tosses Rene Lachemann! He's gone!\""],
      basePickup: ["\"He's taking the base! Lachemann is walking off with first base!\""],
      benchEjection: ["\"Lachemann didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Lachemann turned back for one more word - and that did it!\""],
    },
    indians: {
      chirp: ["\"Corrales has a word.\"","\"The Indians dugout chirps.\""],
      grumble: ["\"Pat Corrales doesn't agree with that call.\"","\"The Indians bench has some words.\"","\"Corrales is letting the umpire hear it.\""],
      level1: ["\"Pat Corrales on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Corrales! He's out of the dugout!\"","\"Corrales takes the field - this could get heated.\""],
      level3: ["\"Corrales is in the umpire's face! He's not backing down!\"","\"This is a heated exchange - Corrales is furious!\""],
      level4: ["\"Corrales has lost it! He's kicking dirt everywhere!\"","\"You don't see this often - Corrales has completely lost it!\""],
      ejected: ["\"And Corrales has been ejected! The Cleveland crowd boos the umpire!\"","\"The umpire tosses Pat Corrales! He's gone!\""],
      basePickup: ["\"He's taking the base! Corrales is walking off with first base!\""],
      benchEjection: ["\"Corrales never left the dugout - and he's been tossed!\""],
      delayed: ["\"Corrales turned back for one more word - and that's it!\""],
    },
    bluejays: {
      chirp: ["\"Cox has a word.\"","\"The Blue Jays dugout chirps.\""],
      grumble: ["\"Bobby Cox doesn't agree with that call.\"","\"The Blue Jays bench has some words.\"","\"Cox is letting the umpire hear it.\""],
      level1: ["\"Bobby Cox on the top step. He wants a word.\"","\"The manager is leaning out - he's got a point to make.\""],
      level2: ["\"And here comes Cox! He's out of the dugout!\"","\"Cox takes the field - this could get interesting.\""],
      level3: ["\"Cox is in the umpire's face! He's not backing down!\"","\"This is a heated one - Cox is making his case!\""],
      level4: ["\"Cox has lost it! He's kicking dirt everywhere!\"","\"Bobby Cox has completely lost his composure!\""],
      ejected: ["\"And Cox has been ejected! The Exhibition Stadium crowd boos!\"","\"The umpire tosses Bobby Cox! He's gone!\""],
      basePickup: ["\"He's taking the base! Cox is walking off with first base!\""],
      benchEjection: ["\"Cox didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Cox turned back for one more word - and that did it!\""],
    },
    royals: {
      chirp: ["\"Howser has a word.\"","\"The Royals dugout chirps.\""],
      grumble: ["\"Dick Howser doesn't agree with that call.\"","\"The Royals bench has some words.\"","\"Howser is letting the umpire hear it.\""],
      level1: ["\"Dick Howser on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Howser! He's out of the dugout!\"","\"Howser takes the field - calmly, but firmly.\""],
      level3: ["\"Howser is in the umpire's face! He's not backing down!\"","\"This is a heated one - Howser is making his case!\""],
      level4: ["\"Howser has lost it! He's kicking dirt everywhere!\"","\"You don't see this from Dick Howser - he's completely lost it!\""],
      ejected: ["\"And Howser's been ejected! The Royals Stadium crowd boos the umpire!\"","\"The umpire tosses Dick Howser! He's gone!\""],
      basePickup: ["\"He's taking the base! Howser is walking off with first base!\""],
      benchEjection: ["\"Howser never left the dugout - and he's been tossed!\""],
      delayed: ["\"Howser turned back for one more word - and that's it!\""],
    },
    angels: {
      chirp: ["\"McNamara has a word.\"","\"The Angels dugout chirps.\""],
      grumble: ["\"John McNamara doesn't agree with that call.\"","\"The Angels bench has some words.\"","\"McNamara is letting the umpire hear it.\""],
      level1: ["\"John McNamara on the top step. He wants a word.\"","\"The manager is leaning out - he's got a point to make.\""],
      level2: ["\"And here comes McNamara! He's out of the dugout!\"","\"McNamara takes the field - this could get heated.\""],
      level3: ["\"McNamara is in the umpire's face! He's not backing down!\"","\"This is a heated exchange - McNamara is furious!\""],
      level4: ["\"McNamara has lost it! He's kicking dirt everywhere!\"","\"McNamara has completely lost his composure!\""],
      ejected: ["\"And McNamara's been ejected! The Anaheim crowd boos!\"","\"The umpire tosses John McNamara! He's gone!\""],
      basePickup: ["\"He's taking the base! McNamara is walking off with first base!\""],
      benchEjection: ["\"McNamara didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"McNamara turned back for one more word - and that did it!\""],
    },
    whitesox: {
      chirp: ["\"LaRussa has a word.\"","\"The White Sox dugout chirps.\""],
      grumble: ["\"Tony LaRussa doesn't agree with that call.\"","\"The White Sox bench has some words.\"","\"LaRussa is letting the umpire hear it.\""],
      level1: ["\"Tony LaRussa on the top step. He wants a word.\"","\"The manager is leaning out - he's got a point to make.\""],
      level2: ["\"And here comes LaRussa! He's out of the dugout!\"","\"LaRussa takes the field - this could get interesting.\""],
      level3: ["\"LaRussa is in the umpire's face! He's not backing down!\"","\"This is a heated one - LaRussa is making his case!\""],
      level4: ["\"LaRussa has lost it! He's kicking dirt everywhere!\"","\"Tony LaRussa has completely lost his composure!\""],
      ejected: ["\"And LaRussa's been ejected! The Comiskey Park crowd loves it!\"","\"The umpire tosses Tony LaRussa! He's gone!\""],
      basePickup: ["\"He's taking the base! LaRussa is walking off with first base!\""],
      benchEjection: ["\"LaRussa didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"LaRussa turned back for one more word - and that did it!\""],
    },
    athletics: {
      chirp: ["\"Boros has a word.\"","\"The A's dugout chirps.\""],
      grumble: ["\"Steve Boros doesn't agree with that call.\"","\"The A's bench has some words.\"","\"Boros is letting the umpire hear it.\""],
      level1: ["\"Steve Boros on the top step. He wants a word.\"","\"The manager is leaning out - he's got a point to make.\""],
      level2: ["\"And here comes Boros! He's out of the dugout!\"","\"Boros takes the field - this could get heated.\""],
      level3: ["\"Boros is in the umpire's face! He's not backing down!\"","\"This is a heated exchange - Boros is furious!\""],
      level4: ["\"Boros has lost it! He's kicking dirt everywhere!\"","\"Steve Boros has completely lost his composure!\""],
      ejected: ["\"And Boros has been ejected! The Oakland Coliseum crowd boos!\"","\"The umpire tosses Steve Boros! He's gone!\""],
      basePickup: ["\"He's taking the base! Boros is walking off with first base!\""],
      benchEjection: ["\"Boros didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Boros turned back for one more word - and that did it!\""],
    },
    twins: {
      chirp: ["\"Gardner has a word.\"","\"The Twins dugout chirps.\""],
      grumble: ["\"Billy Gardner doesn't agree with that call.\"","\"The Twins bench has some words.\"","\"Gardner is letting the umpire hear it.\""],
      level1: ["\"Billy Gardner on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Gardner! He's out of the dugout!\"","\"Gardner takes the field - this could get heated.\""],
      level3: ["\"Gardner is in the umpire's face! He's not backing down!\"","\"This is a heated one - Gardner is making his case!\""],
      level4: ["\"Gardner has lost it! He's kicking dirt everywhere!\"","\"Billy Gardner has completely lost his composure!\""],
      ejected: ["\"And Gardner's been ejected! The Metrodome crowd boos!\"","\"The umpire tosses Billy Gardner! He's gone!\""],
      basePickup: ["\"He's taking the base! Gardner is walking off with first base!\""],
      benchEjection: ["\"Gardner didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Gardner turned back for one more word - and that did it!\""],
    },
    mariners: {
      chirp: ["\"Crandall has a word.\"","\"The Mariners dugout chirps.\""],
      grumble: ["\"Del Crandall doesn't agree with that call.\"","\"The Mariners bench has some words.\"","\"Crandall is letting the umpire hear it.\""],
      level1: ["\"Del Crandall on the top step. He wants a word.\"","\"The manager is leaning out - he's got something to say.\""],
      level2: ["\"And here comes Crandall! He's out of the dugout!\"","\"Crandall takes the field - this could get heated.\""],
      level3: ["\"Crandall is in the umpire's face! He's not backing down!\"","\"This is a heated one - Crandall is making his case!\""],
      level4: ["\"Crandall has lost it! He's kicking dirt everywhere!\"","\"Del Crandall has completely lost his composure!\""],
      ejected: ["\"And Crandall's been ejected! The Kingdome crowd boos!\"","\"The umpire tosses Del Crandall! He's gone!\""],
      basePickup: ["\"He's taking the base! Crandall is walking off with first base!\""],
      benchEjection: ["\"Crandall didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Crandall turned back for one more word - and that did it!\""],
    },
    rangers: {
      chirp: ["\"Rader has a word.\"","\"The Rangers dugout chirps.\""],
      grumble: ["\"Doug Rader doesn't agree with that call.\"","\"The Rangers bench has some words.\"","\"The Red Rooster is letting the umpire hear it.\""],
      level1: ["\"Doug Rader on the top step. He wants a word.\"","\"The Red Rooster is leaning out - this could get good.\""],
      level2: ["\"And here comes Rader! He's out of the dugout!\"","\"Rader takes the field - and he's fired up!\""],
      level3: ["\"Rader is in the umpire's face! The Red Rooster is furious!\"","\"This is a heated one - Rader isn't backing down!\""],
      level4: ["\"Rader has lost it! He's kicking dirt everywhere!\"","\"The Red Rooster has completely lost his composure - what a scene!\""],
      ejected: ["\"And Rader's been ejected! The Arlington crowd loves it!\"","\"The umpire tosses Doug Rader! He's gone!\""],
      basePickup: ["\"He's taking the base! Rader is walking off with first base!\""],
      benchEjection: ["\"Rader didn't even leave the dugout - tossed from the bench!\""],
      delayed: ["\"Rader turned back for one more word - and that did it!\""],
    },
  };

  const booth = byBooth[homeTeamKey] || byBooth.cubs;

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