// 1984 American Baseball League Umpiring Crew - 20 named umpires
// Each with distinct strike zones, accuracy, temperament, and hidden traits

export const UMPIRES = {
  jack_brennan: {
    id: "jack_brennan",
    name: "Jack Brennan",
    nick: "The Veteran",
    experience: 28,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 95,
    safeOutAccuracy: 95,
    temperament: { type: "calm", leash: 0.10, quickEject: false, warningChance: 0.75 },
    traits: ["veteranRespect", "stoneFace"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Jack Brennan has the plate tonight. One of the most respected umpires in baseball.",
    rareAnnouncement: "Tonight's crew chief, Jack Brennan, is working his 3,000th professional game.",
  },
  walter_mccloskey: {
    id: "walter_mccloskey",
    name: "Walter McCloskey",
    nick: "Wide Walt",
    experience: 19,
    zone: { type: "wide", widthMod: 8, lowMod: 3, highMod: 2, outsideMod: 6 },
    consistency: 90,
    safeOutAccuracy: 89,
    temperament: { type: "standard", leash: 0.22, quickEject: false, warningChance: 0.45 },
    traits: [],
    pitcherFriendly: true,
    hitterFriendly: false,
    pregameLine: "McCloskey's known for giving the corners. Pitchers love working with Wide Walt behind the dish.",
    rareAnnouncement: "Walter McCloskey has been behind the plate for three no-hitters.",
  },
  frank_delaney: {
    id: "frank_delaney",
    name: "Frank Delaney",
    nick: "The Professor",
    experience: 24,
    zone: { type: "neutral", widthMod: 1, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 98,
    safeOutAccuracy: 97,
    temperament: { type: "calm", leash: 0.08, quickEject: false, warningChance: 0.80 },
    traits: ["stoneFace"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Frank Delaney behind the plate tonight. Deliberate. Precise. Players trust him.",
  },
  eddie_russo: {
    id: "eddie_russo",
    name: "Eddie Russo",
    nick: "The Showman",
    experience: 16,
    zone: { type: "neutral", widthMod: 1, lowMod: -1, highMod: 2, outsideMod: 0 },
    consistency: 87,
    safeOutAccuracy: 88,
    temperament: { type: "standard", leash: 0.30, quickEject: false, warningChance: 0.35 },
    traits: ["attentionSeeker"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Eddie Russo works the plate tonight. Known for theatrical strike-three calls. The crowd loves the show.",
  },
  leonard_grimes: {
    id: "leonard_grimes",
    name: "Leonard Grimes",
    nick: "The Tight Zone",
    experience: 14,
    zone: { type: "tight", widthMod: -8, lowMod: -4, highMod: -5, outsideMod: -7 },
    consistency: 88,
    safeOutAccuracy: 86,
    temperament: { type: "standard", leash: 0.20, quickEject: false, warningChance: 0.50 },
    traits: [],
    pitcherFriendly: false,
    hitterFriendly: true,
    pregameLine: "Pitchers are never happy to see Leonard Grimes back there. Tiny strike zone - he makes you earn it.",
  },
  tommy_keeler: {
    id: "tommy_keeler",
    name: "Tommy Keeler",
    nick: "The Rookie",
    experience: 1,
    zone: { type: "neutral", widthMod: -2, lowMod: -2, highMod: -1, outsideMod: -2 },
    consistency: 80,
    safeOutAccuracy: 85,
    temperament: { type: "standard", leash: 0.25, quickEject: false, warningChance: 0.40 },
    traits: ["rookieNerves"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Tommy Keeler is the youngest umpire currently working in professional baseball. Still earning respect.",
    rareAnnouncement: "Tommy Keeler is the youngest umpire currently working in professional baseball.",
  },
  bill_rourke: {
    id: "bill_rourke",
    name: "Bill Rourke",
    nick: "The Sheriff",
    experience: 22,
    zone: { type: "neutral", widthMod: 2, lowMod: 1, highMod: 0, outsideMod: 1 },
    consistency: 90,
    safeOutAccuracy: 90,
    temperament: { type: "shortFuse", leash: 0.45, quickEject: true, warningChance: 0.10 },
    traits: ["thickSkin"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Bill Rourke has the plate. Quick hook. Don't argue with The Sheriff.",
    rareAnnouncement: "Bill Rourke has ejected more managers than any active umpire.",
  },
  howard_pritchard: {
    id: "howard_pritchard",
    name: "Howard Pritchard",
    nick: "The Peacemaker",
    experience: 19,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 90,
    safeOutAccuracy: 90,
    temperament: { type: "calm", leash: 0.40, quickEject: false, warningChance: 0.90 },
    traits: [],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Howard Pritchard is calling balls and strikes tonight. He'll talk you down before he tosses you.",
  },
  sam_bianchi: {
    id: "sam_bianchi",
    name: "Sam Bianchi",
    nick: "Low Strike Sam",
    experience: 13,
    zone: { type: "low", widthMod: 0, lowMod: 9, highMod: -2, outsideMod: 0 },
    consistency: 85,
    safeOutAccuracy: 87,
    temperament: { type: "standard", leash: 0.25, quickEject: false, warningChance: 0.40 },
    traits: [],
    pitcherFriendly: true,
    hitterFriendly: false,
    pregameLine: "Sam Bianchi behind the dish. Loves the low strike - sinkerballers, tonight's your night.",
  },
  ray_tuttle: {
    id: "ray_tuttle",
    name: "Ray Tuttle",
    nick: "High Strike Ray",
    experience: 15,
    zone: { type: "high", widthMod: 1, lowMod: -2, highMod: 8, outsideMod: 0 },
    consistency: 86,
    safeOutAccuracy: 88,
    temperament: { type: "standard", leash: 0.25, quickEject: false, warningChance: 0.45 },
    traits: [],
    pitcherFriendly: true,
    hitterFriendly: false,
    pregameLine: "Ray Tuttle works the top of the zone. High fastball pitchers are going to like working with him.",
  },
  charlie_vance: {
    id: "charlie_vance",
    name: "Charlie Vance",
    nick: "Corner Charlie",
    experience: 17,
    zone: { type: "outside", widthMod: 2, lowMod: 1, highMod: 1, outsideMod: 9 },
    consistency: 88,
    safeOutAccuracy: 85,
    temperament: { type: "standard", leash: 0.20, quickEject: false, warningChance: 0.45 },
    traits: ["rabbitEars"],
    pitcherFriendly: true,
    hitterFriendly: false,
    pregameLine: "Charlie Vance is known for giving the outside corner. Left-handed batters are already grumbling.",
  },
  gene_maddox: {
    id: "gene_maddox",
    name: "Gene Maddox",
    nick: "Mr. Consistent",
    experience: 20,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 96,
    safeOutAccuracy: 93,
    temperament: { type: "calm", leash: 0.12, quickEject: false, warningChance: 0.70 },
    traits: ["thickSkin"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Gene Maddox calling the game tonight. You know exactly what you're getting with Mr. Consistent.",
  },
  pete_muldoon: {
    id: "pete_muldoon",
    name: "Pete Muldoon",
    nick: "The Coin Flip",
    experience: 8,
    zone: { type: "erratic", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 55,
    safeOutAccuracy: 80,
    temperament: { type: "shortFuse", leash: 0.35, quickEject: true, warningChance: 0.20 },
    traits: ["rabbitEars", "homeCrowdSensitive"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Pete Muldoon behind the plate. Same pitch could be a strike or a ball. Nobody knows. Least of all Muldoon.",
  },
  al_dugan: {
    id: "al_dugan",
    name: "Al Dugan",
    nick: "Old School Al",
    experience: 26,
    zone: { type: "neutral", widthMod: 2, lowMod: 2, highMod: 1, outsideMod: 1 },
    consistency: 88,
    safeOutAccuracy: 91,
    temperament: { type: "standard", leash: 0.20, quickEject: false, warningChance: 0.50 },
    traits: ["veteranRespect"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Al Dugan has the plate. Old school. Respects the veterans - you earn your calls with Dugan.",
  },
  victor_salazar: {
    id: "victor_salazar",
    name: "Victor Salazar",
    nick: "The Young Gun",
    experience: 4,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 94,
    safeOutAccuracy: 93,
    temperament: { type: "calm", leash: 0.15, quickEject: false, warningChance: 0.65 },
    traits: ["stoneFace"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Victor Salazar behind the plate. New to the league but already one of the sharpest eyes in the game.",
  },
  marty_hensley: {
    id: "marty_hensley",
    name: "Marty Hensley",
    nick: "The Crowd Villain",
    experience: 12,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 85,
    safeOutAccuracy: 84,
    temperament: { type: "standard", leash: 0.22, quickEject: false, warningChance: 0.45 },
    traits: ["homeCrowdSensitive", "rabbitEars"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Marty Hensley works the dish. Somehow always ends up in the middle of controversy. The boos will come early.",
  },
  frank_omalley: {
    id: "frank_omalley",
    name: "Frank O'Malley",
    nick: "The Marathon Man",
    experience: 18,
    zone: { type: "neutral", widthMod: 1, lowMod: 0, highMod: 0, outsideMod: 1 },
    consistency: 91,
    safeOutAccuracy: 92,
    temperament: { type: "calm", leash: 0.15, quickEject: false, warningChance: 0.70 },
    traits: ["stoneFace"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Frank O'Malley behind the plate. Deliberate pace. He takes his time with every call. Settle in for a long one.",
  },
  jimmy_baxter: {
    id: "jimmy_baxter",
    name: "Jimmy Baxter",
    nick: "The Quick Trigger",
    experience: 10,
    zone: { type: "neutral", widthMod: 1, lowMod: 0, highMod: 1, outsideMod: 0 },
    consistency: 89,
    safeOutAccuracy: 87,
    temperament: { type: "standard", leash: 0.25, quickEject: false, warningChance: 0.50 },
    traits: [],
    pitcherFriendly: true,
    hitterFriendly: false,
    pregameLine: "Jimmy Baxter calls 'em fast. Quick pace, quick calls. Pitchers love working with this guy.",
  },
  artie_malone: {
    id: "artie_malone",
    name: "Artie Malone",
    nick: "The Makeup Artist",
    experience: 15,
    zone: { type: "neutral", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 87,
    safeOutAccuracy: 86,
    temperament: { type: "standard", leash: 0.22, quickEject: false, warningChance: 0.50 },
    traits: ["makeupArtist"],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Artie Malone behind the dish. Known for evening things up - if he misses one, the next close call goes the other way.",
  },
  doug_farnsworth: {
    id: "doug_farnsworth",
    name: "Doug Farnsworth",
    nick: "The Enigma",
    experience: 7,
    zone: { type: "random", widthMod: 0, lowMod: 0, highMod: 0, outsideMod: 0 },
    consistency: 85,
    safeOutAccuracy: 87,
    temperament: { type: "standard", leash: 0.25, quickEject: false, warningChance: 0.40 },
    traits: [],
    pitcherFriendly: false,
    hitterFriendly: false,
    pregameLine: "Nobody quite knows what to expect from Doug Farnsworth tonight. Every game is a different zone.",
  },
};

// ── Pick a random umpire ──
export function pickUmpire() {
  const ids = Object.keys(UMPIRES);
  return UMPIRES[ids[Math.floor(Math.random() * ids.length)]];
}

// ── Zone effect on strike chance (percentage points) ──
export function getUmpireZoneEffect(umpire) {
  if (!umpire || !umpire.zone) return 0;

  const zone = umpire.zone;
  let effect = 0;

  // Base width modifier: +widthMod = wider zone (positive for pitchers)
  effect += zone.widthMod * 0.8;

  // Low zone: helps sinkerballers
  effect += zone.lowMod * 0.5;

  // High zone: helps fastball pitchers
  effect += zone.highMod * 0.5;

  // Outside corner: helps pitchers paint the black
  effect += zone.outsideMod * 0.6;

  // Erratic (Muldoon): random per pitch variation
  if (zone.type === "erratic") {
    effect += (Math.random() - 0.5) * 16; // -8 to +8 random swing
  }

  // Random zone (Farnsworth): random overall profile
  if (zone.type === "random") {
    const profile = Math.floor(Math.random() * 6); // 0-5 different profiles
    switch (profile) {
      case 0: effect += 8; break;   // wide zone tonight
      case 1: effect -= 8; break;   // tight zone tonight
      case 2: effect += 5; break;   // low zone
      case 3: effect += 5; break;   // high zone
      case 4: effect += 4; break;   // outside corner
      default: effect += 0; break;  // neutral
    }
  }

  // Consistency: how predictable the zone is
  // Lower consistency = more variance around the effect
  if (umpire.consistency < 95) {
    const variance = (100 - umpire.consistency) * 0.10;
    effect += (Math.random() - 0.5) * variance * 2;
  }

  return Math.round(effect);
}

// ── Safe/out missed call chance ──
export function maybeMissedCall(umpire) {
  if (!umpire) return false;
  // Accuracy of 100 → never misses. Accuracy of 70 → ~3% miss chance per close play
  const missChance = Math.max(0, (100 - umpire.safeOutAccuracy) * 0.001);
  return Math.random() < missChance;
}

// ── Get argument modifier from umpire temperament ──
export function getUmpireArgumentMod(umpire) {
  if (!umpire || !umpire.temperament) return { leash: 0.25, quickEject: false, warningChance: 0.40 };

  const t = umpire.temperament;
  return {
    leash: t.leash || 0.25,
    quickEject: t.quickEject || false,
    warningChance: t.warningChance || 0.40,
    type: t.type || "standard",
  };
}

// ── Manager-umpire relationship modifiers ──
const MANAGER_UMPIRE_RELATIONS = {
  cubs: { walter_mccloskey: -10, jack_brennan: 5 },
  dodgers: { jack_brennan: 10, bill_rourke: -5 },
  mets: { bill_rourke: -15, walter_mccloskey: 5 },
  yankees: { frank_delaney: 8 },
  redsox: { gene_maddox: 8 },
  tigers: { howard_pritchard: 8 },
  padres: { bill_rourke: -10 },
  orioles: { jack_brennan: 10 },
};

export function getManagerUmpireRelation(teamKey, umpireId) {
  if (!teamKey || !umpireId) return 0;
  const relations = MANAGER_UMPIRE_RELATIONS[teamKey];
  if (!relations) return 0;
  return relations[umpireId] || 0;
}