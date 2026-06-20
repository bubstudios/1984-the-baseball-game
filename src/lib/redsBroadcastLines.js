// Joe Nuxhall & Marty Brennaman — Cincinnati Reds 1984 broadcast lines
// Generic pool: atmosphere, flavor, and between-pitch filler ONLY.
// No result-describing lines (hits, HRs, strikeouts, walks, base running).
// Player-specific via pickRedsPlayerLine() — atmosphere only, no play calls.

export function pickRedsLine() {
  return GENERIC[Math.floor(Math.random() * GENERIC.length)];
}

export function pickRedsPlayerLine(playerName) {
  const map = {
    "Dave Concepcion": ["Concepcion makes it look easy.", "Davey still has the glove."],
    "Ron Oester": ["Oester with the sure hands.", "Nothing getting through that infield."],
    "Dave Parker": ["Parker has been a great addition to this lineup.", "The Cobra brings a presence to the batter's box."],
    "Pete Rose": ["Pete grinding out there, as always.", "Charlie Hustle doing what he does.", "Number 14 — still the hardest worker in baseball.", "He's 43 years old and still playing like a kid.", "Nobody out-hustles Pete Rose.", "He may not have the power anymore, but he'll find a way on base.", "That's why he's the all-time hit king right there."],
    "Mario Soto": ["Soto's had a strong year on the mound.", "When Soto's on, he's as tough as anyone."],
    "John Franco": ["Young Franco has a bright future.", "El Presidente coming in from the pen."],
    "Dave Concepcion": ["Concepcion makes it look easy.", "Davey still has the glove."],
  };
  const lines = map[playerName];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

const GENERIC = [
  // ── General vibe / between-pitch filler ──
  "That'll work.",
  "Young man did a nice job there.",
  "Nothing wrong with that.",
  "You can't teach that.",
  "That's baseball.",
  "Just a good, solid ballplayer.",
  "He knows what he's doing out there.",
  "Simple game when you execute.",
  "That's the way you draw it up.",
  "He's a gamer.",
  "This young club plays hard every night.",
  "Pete has them ready to play.",

  // ── Pitching — process, not outcome ──
  "He's getting ahead of hitters.",
  "He's working quickly tonight.",
  "He's keeping the ball down.",
  "That's a pitcher's pitch.",
  "Changed speeds beautifully.",
  "He's in a nice rhythm.",
  "Not overpowering, just effective.",
  "Locating the fastball well.",
  "He's trusting his stuff.",
  "Good tilt on that breaking ball.",
  "He's painting the corners.",

  // ── Neutral / atmosphere ──
  "That's fun to watch.",
  "That's a big league play.",

  // ── Riverfront / Cincinnati atmosphere ──
  "A few barges moving down the Ohio this evening.",
  "It's another beautiful night along the river.",
  "A little haze hanging over downtown Cincinnati.",
  "The turf is playing quick tonight.",
  "Ground balls can get through in a hurry on this surface.",
  "The ball carries well in the summer heat.",
  "The Cincinnati faithful appreciate good baseball.",
  "A nice crowd on hand tonight.",
  "The folks here know the game.",
  "This place was rocking during the Big Red Machine years.",
  "A lot of memories in this ballpark.",
  "If you were here in '75 and '76, you know what this town can sound like.",
  "Some of the greatest teams ever played right here.",
  "They set a standard that'll be hard to match.",
  "Bench, Morgan, Perez — my goodness, what a ballclub that was.",
  "Nothing wrong with a bowl of Cincinnati chili before the game.",
  "The chili parlors should be busy tonight.",
  "Hope somebody saved me a three-way at Skyline.",
  "The Queen City is enjoying some baseball tonight.",
  "Greetings from Cincinnati, the Queen City.",
  "Joe says he once pitched both ends of a doubleheader.",
  "The Reds have been playing baseball in Cincinnati longer than most cities have had professional sports.",
  "The organist appears to know every song ever written.",
  "A little river fog drifting in.",
  "You can hear a towboat on the river.",
  "The turf temperature is reported near 120 degrees.",
  "The symmetry of this stadium makes for fair baseball.",
  "Riverfront was built for both sports but baseball always felt right here.",
  "The downtown skyline is lighting up — Carew Tower looking grand.",
  "Marty, I think this is going to be a good one tonight.",
  "The Reds haven't missed a beat with this young infield.",
  "Pete's got 'em playing aggressive baseball.",
  "You can feel the history in this old cookie-cutter.",
  "Across the river they can probably hear this crowd.",
  "A towboat captain just gave us a wave.",
  "The grounds crew keeps that turf in perfect condition.",
  "Not a blade of artificial grass out of place.",
  "Sun setting behind the first base side now.",
];

export default GENERIC;