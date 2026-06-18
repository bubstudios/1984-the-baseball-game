// Umpire Arguments & Ejections — 1984 Theatrical System
// Severity scoring, escalation levels, manager/umpire personalities, booth-specific commentary

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

// ── Disputed Call Severity ──
// gameState param provides context for verifying claims like "bases loaded"
export function getArgumentSeverity(lastPlay, gameState) {
  if (!lastPlay || !gameState) return null;

  const type = lastPlay?.type;
  const text = lastPlay?.text || "";

  // LOW severity
  if (["strike", "foul"].includes(type)) {
    // Only trigger on strike 3 or borderline
    if (text.includes("Strike 3") || text.includes("strike 3") || text.includes("called strike three") || text.includes("takes a") || text.includes("watches it")) {
      return { severity: "low", score: 1, callType: "strike call", text };
    }
    return null;
  }

  // MEDIUM severity
  if (["single", "groundout", "double"].includes(type)) {
    if (text.includes("beats it out") || text.includes("infield single")) {
      return { severity: "medium", score: 3, callType: "safe/out at first", text };
    }
    if (text.includes("fielder's choice") || text.includes("fielder's choice")) {
      return { severity: "medium", score: 3, callType: "force play", text };
    }
    if (text.includes("double play") && Math.random() < 0.15) {
      return { severity: "medium", score: 3, callType: "close force play", text };
    }
    return null;
  }

  // HIGH severity
  if (["sacfly", "strikeout"].includes(type)) {
    if (text.includes("scores") && text.includes("tags") && Math.random() < 0.25) {
      return { severity: "high", score: 6, callType: "home plate play", text };
    }
    // Bases loaded strikeout — only if bases were actually loaded
    const basesLoaded = gameState.bases?.filter(b => b !== null).length === 3;
    if (basesLoaded && (text.includes("fans on") || text.includes("strikes out")) && Math.random() < 0.25) {
      return { severity: "high", score: 5, callType: "bases-loaded strikeout", text };
    }
    return null;
  }

  // walk: borderline check
  if (type === "walk") {
    if (Math.random() < 0.12) {
      return { severity: "low", score: 1, callType: "ball/strike count", text };
    }
    return null;
  }

  // HBP always triggers something
  if (type === "walk" && (text.includes("hit by the pitch") || text.includes("HBP"))) {
    return { severity: "medium", score: 4, callType: "hit-by-pitch", text };
  }

  // Error calls occasionally trigger
  if (type === "error") {
    if (Math.random() < 0.08) {
      return { severity: "medium", score: 3, callType: "trapped ball", text };
    }
    return null;
  }

  // triple — sparky managers argue close tag-ups
  if (type === "triple" && Math.random() < 0.15) {
    return { severity: "medium", score: 3, callType: "close tag-up at third", text };
  }

  return null;
}

// ── Decide who argues and escalation level ──
export function resolveArgument(severityInfo, managerPersonality, umpireType, inning, scoreDiff, isHomeTeam) {
  if (!severityInfo) return null;

  const manager = managerPersonality; // 1-10
  const umpire = UMPIRE_TYPES[umpireType] || UMPIRE_TYPES.standard;
  const severityScore = severityInfo.score + (manager / 3); // fiery managers push score higher

  // Determine if manager gets involved
  let whoArgues = null;
  let escaLevel = 0;

  // Who reacts?
  const roll = Math.random();
  if (severityScore >= 7 || (manager >= 7 && severityScore >= 4)) {
    whoArgues = "manager";
  } else if (severityScore >= 4 && roll < 0.60) {
    whoArgues = "manager";
  } else if (roll < 0.70) {
    whoArgues = "batter";
  } else if (roll < 0.88) {
    whoArgues = "catcher";
  } else {
    whoArgues = "pitcher";
  }

  // Escalation level (0-4)
  if (whoArgues === "batter" || whoArgues === "catcher" || whoArgues === "pitcher") {
    escaLevel = 0; // grumbling only
  } else if (whoArgues === "manager") {
    const escRoll = Math.random();
    const lateGameBonus = inning >= 7 ? 0.15 : 0;
    const closeGameBonus = Math.abs(scoreDiff) <= 2 ? 0.10 : 0;
    const managerFire = (manager / 10) * 0.25;

    if (escRoll < 0.30 - managerFire) {
      escaLevel = 0; // grumbling from dugout
    } else if (escRoll < 0.60 - managerFire + lateGameBonus) {
      escaLevel = 1; // leaning out
    } else if (escRoll < 0.85 - managerFire * 0.5 + lateGameBonus + closeGameBonus) {
      escaLevel = 2; // on the field
    } else if (escRoll < 0.95) {
      escaLevel = 3; // in umpire's face
    } else {
      escaLevel = 4; // nuclear
    }

    // Tommy Lasorda and Dick Williams go nuclear more often
    if (manager >= 8 && escaLevel >= 2 && Math.random() < 0.30) {
      escaLevel = Math.min(4, escaLevel + 1);
    }
    // Very calm managers rarely go above level 1
    if (manager <= 3 && escaLevel >= 3 && Math.random() < 0.70) {
      escaLevel = 2;
    }
  }

  // Ejection chance by level (modified by umpire type)
  const ejectionChances = {
    0: 0,
    1: 0.05 + umpire.leash * 0.3,
    2: 0.20 + umpire.leash * 0.5,
    3: 0.70 + umpire.leash * 0.3,
    4: 1.0,
  };

  const ejectionChance = ejectionChances[escaLevel] || 0;
  const ejected = Math.random() < ejectionChance;

  // Special: delayed ejection (manager walks away, says one more thing)
  const delayedEjection = ejected && escaLevel >= 2 && Math.random() < 0.12;

  // Special: bench ejection (manager never leaves dugout)
  const benchEjection = ejected && escaLevel <= 1 && Math.random() < 0.08;

  // Special: hat throw
  const hatThrow = escaLevel >= 3 && Math.random() < 0.25;

  // Special: dirt kick
  const dirtKick = escaLevel >= 3 && !hatThrow && Math.random() < 0.20;

  // Special: base pickup (Earl Weaver style — ultra rare)
  const basePickup = escaLevel === 4 && Math.random() < 0.05;

  return {
    whoArgues,
    escaLevel,
    ejected,
    delayedEjection,
    benchEjection,
    hatThrow,
    dirtKick,
    basePickup,
    manager,
    umpireType,
    callType: severityInfo.callType,
    callText: severityInfo.text,
    crowdExcitement: escaLevel * 15 + (ejected ? 25 : 0) + (hatThrow ? 10 : 0) + (dirtKick ? 15 : 0) + (basePickup ? 20 : 0),
  };
}

// ── Booth-Specific Ejection Commentary ──
export function getEjectionCommentary(homeTeamKey, result) {
  const { whoArgues, escaLevel, ejected, hatThrow, dirtKick, basePickup, delayedEjection, benchEjection, manager } = result;

  const byBooth = {
    cubs: {
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

// ── Crowd reaction text ──
export function getCrowdReaction(result) {
  const { escaLevel, ejected, hatThrow, dirtKick, basePickup } = result;

  if (basePickup) return "Crowd goes absolutely wild — they've never seen anything like it!";
  if (dirtKick) return "Crowd erupts — dirt everywhere!";
  if (hatThrow) return "Crowd roars as the cap hits the dirt!";
  if (ejected && escaLevel >= 3) return "Huge ovation — the crowd is on its feet!";
  if (ejected) return "Crowd cheers — the manager is gone!";
  if (escaLevel >= 2) return "Crowd stirs — this is getting interesting.";
  if (escaLevel >= 1) return "Mild buzz from the crowd.";
  return "A few murmurs from the stands.";
}