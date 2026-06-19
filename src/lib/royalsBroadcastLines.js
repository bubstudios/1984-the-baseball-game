// Denny Matthews-style commentary — professional, smooth, understated
// Player-specific lines only used when that player is involved (at bat or on mound)

// ── Generic flavor pool (NO player-specific lines) ──
export function pickRoyalsLine() {
  const all = [...ROUTINE, ...RARE, ...ULTRA_RARE, ...FOUNTAIN_LINES, ...KC_REFERENCES, ...STRIKEOUT_LINES, ...PITCHING_NOTES];
  return all[Math.floor(Math.random() * all.length)];
}

// ── Contextual player line — used when a specific batter or pitcher is involved ──
export function pickRoyalsPlayerLine(playerName) {
  const map = {
    "George Brett": BRETT_FLAVOR,
    "Willie Wilson": WILSON_FLAVOR,
    "Frank White": WHITE_FLAVOR,
    "Steve Balboni": BALBONI_FLAVOR,
    "Dan Quisenberry": QUISENBERRY_FLAVOR,
  };
  const lines = map[playerName];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

// ── Routine Outs ──
const ROUTINE = [
  "One away.",
  "Two down.",
  "Side retired.",
  "An easy play.",
  "Handled cleanly.",
  "No trouble there.",
  "Right where he was supposed to be.",
  "Routine chance.",
  "Three up, three down.",
  "That'll do it.",
  "A smooth play.",
  "Not a difficult chance.",
  "That's an out.",
  "Back to the dugout.",
];

// ── Strikeouts ──
const STRIKEOUT_LINES = [
  "He got him.",
  "Strike three called.",
  "He struck him out.",
  "That'll retire the side.",
  "A big strikeout.",
  "The fastball wins that battle.",
  "Couldn't catch up to it.",
  "Went fishing.",
  "He chased one out of the zone.",
  "The breaking ball got him.",
  "Swing and a miss.",
  "Right down the middle — strike three.",
  "That's a punchout.",
  "He froze him.",
];

// ── Pitching notes (non-player-specific) ──
const PITCHING_NOTES = [
  "Here comes the sidearm delivery.",
  "That one looked like it came out of the grass.",
  "He drops down low.",
];

// ── George Brett flavor — only when Brett is batting ──
const BRETT_FLAVOR = [
  "George Brett steps in — always an event at Royals Stadium.",
  "Brett digs in — the fans rise a little in their seats.",
  "Brett is locked in tonight.",
  "The Royals' captain.",
  "The best hitter in the American League.",
  "Brett is putting on a show tonight.",
  "George Brett has been doing this for a long time.",
  "George Brett is carrying the offense.",
  "Brett — one of the purest swings in baseball.",
];

// ── Willie Wilson flavor ──
const WILSON_FLAVOR = [
  "Wilson at the plate — always a stolen base threat.",
  "Nobody runs better than Willie Wilson.",
  "You have to keep an eye on him.",
  "Willie Wilson — the league's most dangerous baserunner.",
  "Wilson can change a game with his speed.",
  "Willie Wilson — speed to burn.",
  "The Royals love having Wilson on the bases.",
];

// ── Frank White flavor ──
const WHITE_FLAVOR = [
  "Frank White — Gold Glove second baseman.",
  "You won't find many smoother fielders than Frank White.",
  "White is one of the best defensive second basemen in the game.",
  "Frank White makes it look easy.",
  "White — steady as they come.",
];

// ── Steve Balboni flavor ──
const BALBONI_FLAVOR = [
  "Bye-Bye Balboni — always a threat to leave the yard.",
  "Balboni steps in with that big swing.",
  "The big first baseman — power to all fields.",
  "Balboni is a threat every time he steps in.",
  "Balboni has that light-tower power.",
];

// ── Dan Quisenberry flavor ──
const QUISENBERRY_FLAVOR = [
  "Here comes Quisenberry.",
  "The Royals turn it over to Quiz.",
  "One of baseball's best closers.",
  "Quisenberry — that submarine delivery is so unusual.",
  "The Royals fans rise for Quiz.",
];

// ── Fountains ──
const FOUNTAIN_LINES = [
  "The fountains are flowing beyond the outfield.",
  "A beautiful evening at Royals Stadium.",
  "One of baseball's most attractive settings.",
  "The fountains remain one of the game's great sights.",
  "The water is sparkling tonight.",
  "Fans continue to enjoy the fountains beyond the fence.",
  "The fountains are flowing tonight.",
  "One of baseball's most beautiful ballparks.",
  "A gorgeous evening in Kansas City.",
  "The fountains beyond the outfield are lit beautifully tonight.",
  "The water is flowing behind the fence.",
  "Few ballparks have a view quite like this.",
  "The fountains are always a crowd favorite.",
];

// ── Kansas City References ──
const KC_REFERENCES = [
  "A great baseball town.",
  "The fans are filing in from all across the metro area.",
  "Another strong crowd tonight.",
  "Kansas City has always supported its baseball team.",
  "Baseball and barbecue—a pretty good combination.",
  "A beautiful night in the Heartland.",
  "Kansas City fans know their baseball.",
  "The Royals continue to draw some of baseball's best fans.",
  "This ballpark remains one of baseball's showcase facilities.",
  "A beautiful baseball night in the Heartland.",
  "Baseball is alive and well in Kansas City.",
  "A fine crowd on hand here in Kansas City.",
];

// ── Rare Color Lines ──
const RARE = [
  "A fine crowd on hand here in Kansas City.",
  "Not many prettier ballparks in baseball.",
  "The Royals have built a reputation on pitching and defense.",
  "Kansas City fans know their baseball.",
  "You can smell barbecue somewhere beyond the ballpark tonight.",
  "Nothing beats Kansas City barbecue.",
  "Kansas City has a rich jazz tradition.",
];

// ── Ultra-Rare (1-in-500 games) ──
const ULTRA_RARE = [
  "A youngster in the front row has been keeping score all night.",
  "Somebody just lost a scorecard to the wind.",
  "The fountains may need an official scorer.",
  "A fan appears to be explaining baseball to his dog.",
  "The gentleman behind home plate has not missed a game all season... at least according to him.",
  "A fan just tried to photograph the fountains and missed the play.",
  "The barbecue smells are drifting into the ballpark.",
  "Someone in the upper deck appears determined to keep score with a golf pencil.",
  "The fountains may be getting more attention than the game.",
  "The grounds crew deserves a raise.",
];