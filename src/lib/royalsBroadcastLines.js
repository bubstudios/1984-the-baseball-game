// Denny Matthews-style commentary — professional, smooth, understated
// Not a screamer. Not Harry Caray. The voice of Kansas City.

export function pickRoyalsLine() {
  const all = [...ROUTINE, ...RARE, ...ULTRA_RARE, ...FOUNTAIN_LINES, ...KC_REFERENCES, ...HR_LINES, ...GEORGE_BRETT, ...WILSON, ...WHITE, ...BALBONI, ...QUISENBERRY];
  return all[Math.floor(Math.random() * all.length)];
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

// ── Singles ──
const SINGLE_LINES = [
  "A clean base hit.",
  "Through the right side.",
  "Back up the middle.",
  "Into center field.",
  "That's a base hit.",
  "The Royals have something going.",
  "That'll keep the inning alive.",
  "A solid piece of hitting.",
  "A single for Kansas City.",
  "Cleanly into the outfield.",
];

// ── Doubles ──
const DOUBLE_LINES = [
  "Into the gap.",
  "That one's headed for the wall.",
  "He'll make second easily.",
  "A stand-up double.",
  "Extra bases for Kansas City.",
  "That'll score a run.",
  "A big hit for the Royals.",
  "Driven into the alley.",
  "That ball was squared up.",
];

// ── Triples ──
const TRIPLE_LINES = [
  "He's got a chance for three.",
  "Wilson can fly.",
  "The throw won't be in time.",
  "He's standing on third.",
  "A triple for the Royals.",
  "The speed of Willie Wilson on display.",
  "That'll be a three-bagger.",
  "The big outfield here at Royals Stadium pays off.",
];

// ── Home Runs ──
const HR_LINES = [
  "That ball is gone.",
  "Way back and out of here.",
  "Into the seats.",
  "A home run for Kansas City.",
  "He knew it.",
  "No doubt about that one.",
  "That one won't come back.",
  "He got all of it.",
  "The Royals strike quickly.",
  "Goodbye baseball.",
  "A big swing for Kansas City.",
  "The Royals have the lead.",
  "Way back and gone.",
];

// ── George Brett Specific ──
const GEORGE_BRETT = [
  "Another hit for George Brett.",
  "Brett continues to swing a hot bat.",
  "That's what George Brett does.",
  "George Brett drives one into the gap.",
  "A classic Brett swing.",
  "George Brett has tied it.",
  "Brett goes deep.",
  "The Royals' captain comes through again.",
  "Brett is putting on a show tonight.",
  "George Brett is carrying the offense.",
  "The best hitter in the American League.",
  "Brett delivers.",
];

// ── Willie Wilson Specific ──
const WILSON = [
  "There he goes.",
  "Wilson gets a great jump.",
  "Safe easily.",
  "Nobody runs better than Willie Wilson.",
  "You have to keep an eye on him.",
  "This is where Wilson is dangerous.",
  "He's flying around the bases.",
  "Wilson turns on the jets.",
  "The league's most dangerous baserunner.",
  "Willie Wilson can change a game with his speed.",
];

// ── Frank White Specific ──
const WHITE = [
  "A smooth play by Frank White.",
  "Gold Glove work.",
  "That's why he's one of the best.",
  "Frank White makes it look easy.",
  "Another fine defensive play.",
  "You won't find many smoother fielders than Frank White.",
  "White ranges to his right.",
  "The best second baseman in the league.",
];

// ── Steve Balboni Specific ──
const BALBONI = [
  "Balboni got all of that.",
  "That's a long home run.",
  "Bye-Bye Balboni strikes again.",
  "That ball was hit a long way.",
  "Big swing and a miss.",
  "Balboni was looking for the long ball.",
  "The big first baseman takes a mighty cut.",
  "Balboni is a threat every time he steps in.",
];

// ── Dan Quisenberry Specific ──
const QUISENBERRY = [
  "Here comes Quisenberry.",
  "The Royals turn it over to Quiz.",
  "One of baseball's best closers.",
  "Quisenberry got him.",
  "That sidearm delivery can be tough.",
  "Ballgame.",
  "Another save for Quisenberry.",
  "The Royals win it.",
  "Quisenberry drops down low.",
  "That ball looked like it came out of the grass.",
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
  "That one nearly found the fountains.",
  "The fountains have been getting almost as much attention as the game.",
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
  "Kansas City has supported this club since the beginning.",
  "This ballpark remains one of baseball's showcase facilities.",
  "A beautiful baseball night in the Heartland.",
  "Baseball is alive and well in Kansas City.",
  "You can smell barbecue somewhere beyond the ballpark tonight.",
  "Nothing beats Kansas City barbecue.",
  "The smoke should be rolling from barbecue pits across town tonight.",
  "Kansas City has a rich jazz tradition.",
  "A fine crowd on hand here in Kansas City.",
];

// ── Ken Coleman-style HR calls ──
export const ROYALS_HR_LINES = {
  routine: [
    "That ball is gone.",
    "A home run for Kansas City.",
    "Way back and gone.",
    "He got all of that one.",
    "The Royals strike quickly.",
    "Into the seats.",
  ],
  bigMoment: [
    "Way back and out of here!",
    "A big home run for Kansas City!",
    "The Royals have the lead!",
    "Goodbye baseball!",
    "A big swing for the Boys in Blue!",
  ],
  legendary: [
    "That'll find a fountain somewhere.",
    "That ball may not come down until tomorrow.",
  ],
};

// ── Rare Color Lines (1-in-500) ──
const RARE = [
  "A fine crowd on hand here in Kansas City.",
  "Not many prettier ballparks in baseball.",
  "The Royals have built a reputation on pitching and defense.",
  "George Brett has been doing this for a long time.",
  "Willie Wilson can change a game with his speed.",
  "You won't find many smoother fielders than Frank White.",
  "Kansas City fans know their baseball.",
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