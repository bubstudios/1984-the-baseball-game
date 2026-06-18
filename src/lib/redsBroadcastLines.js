// Joe Nuxhall & Marty Brennaman — Cincinnati Reds 1984 broadcast lines
// Folksy, Midwestern, friendly. Nuxhall was a former pitcher — simple, comfortable, knows the game.

const LINES = [
  // ── General observation ──
  "That'll work.",
  "Young man did a nice job there.",
  "Nothing wrong with that.",
  "You can't teach that.",
  "Hit it right where they weren't.",
  "He got just enough of it.",
  "That's baseball.",
  "Just a good, solid ballplayer.",
  "He knows what he's doing out there.",
  "Simple game when you execute.",
  "That's the way you draw it up.",
  "A professional at-bat right there.",
  "He's a gamer.",
  "This young club plays hard every night.",
  "Pete has them ready to play.",

  // ── Pitching comments ──
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
  "That's the Mario Soto we know.",
  "He's painting the corners.",

  // ── Home runs ──
  "And that one's headed toward Kentucky!",
  "Way back and gone!",
  "That's into the seats in a hurry.",
  "That'll make the trip.",
  "See you later!",
  "That one is long gone, folks.",
  "Marty, I think that one landed in the Ohio River.",
  "He got all of that one.",
  "That's not coming back.",

  // ── Hits ──
  "That's a base hit.",
  "Line drive — base hit.",
  "He'll take that.",
  "Rattles around out there.",
  "He'll coast into second.",
  "A hustle double right there.",
  "That's good baserunning.",

  // ── Triples ──
  "He may not stop.",
  "They're waving him on.",
  "Standing up with three.",
  "He'll make it to third easily.",
  "That's fun to watch.",

  // ── Strikeouts ──
  "Got him looking.",
  "That's number three.",
  "He froze him.",
  "Good morning, good afternoon, good night.",
  "Right down the chute — strike three.",
  "He didn't have a chance.",
  "Nasty pitch.",

  // ── Walks ──
  "Four-pitch pass.",
  "He'll take first.",
  "Didn't miss by much.",
  "Just off the plate.",
  "Good eye, young man.",

  // ── Defense ──
  "Concepcion makes it look easy.",
  "Davey still has the glove.",
  "Nothing getting through that infield.",
  "Oester with the sure hands.",
  "Parker runs it down.",
  "That's a big league play.",

  // ── Pete Rose ──
  "Pete grinding out there, as always.",
  "Charlie Hustle doing what he does.",
  "Number 14 — still the hardest worker in baseball.",
  "He's 43 years old and still playing like a kid.",
  "Nobody out-hustles Pete Rose.",
  "He may not have the power anymore, but he'll find a way on base.",
  "That's why he's the all-time hit king right there.",

  // ── Riverfront / atmosphere ──
  "A few barges moving down the Ohio this evening.",
  "It's another beautiful night along the river.",
  "A little haze hanging over downtown Cincinnati.",
  "The turf is playing quick tonight.",
  "Ground balls can get through in a hurry on this surface.",
  "The ball carries well in the summer heat.",
  "The Cincinnati faithful appreciate good baseball.",
  "A nice crowd on hand tonight.",
  "The folks here know the game.",

  // ── Big Red Machine memories ──
  "This place was rocking during the Big Red Machine years.",
  "A lot of memories in this ballpark.",
  "If you were here in '75 and '76, you know what this town can sound like.",
  "Some of the greatest teams ever played right here.",
  "They set a standard that'll be hard to match.",
  "Bench, Morgan, Perez — my goodness, what a ballclub that was.",

  // ── Cincinnati flavor ──
  "Nothing wrong with a bowl of Cincinnati chili before the game.",
  "The chili parlors should be busy tonight.",
  "Hope somebody saved me a three-way at Skyline.",
  "The Queen City is enjoying some baseball tonight.",
  "Greetings from Cincinnati, the Queen City.",

  // ── Rare / misc ──
  "Joe says he once pitched both ends of a doubleheader.",
  "The Reds have been playing baseball in Cincinnati longer than most cities have had professional sports.",
  "The organist appears to know every song ever written.",
  "A little river fog drifting in.",
  "You can hear a towboat on the river.",
  "The turf temperature is reported near 120 degrees.",
];

export function pickRedsLine() {
  return LINES[Math.floor(Math.random() * LINES.length)];
}

export default LINES;