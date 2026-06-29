// Tigers Player Stats & Tidbits - 1984 season
// Used contextually when a specific player is at-bat or on the mound.

const PLAYERS = {
  "Lou Whitaker": {
    names: ["Lou Whitaker", "Lou", "Whitaker", "Sweet Lou"],
    lines: [
      "Lou Whitaker was the American League Rookie of the Year back in 1978.",
      "Sweet Lou and Alan Trammell have been turning double plays together since the late seventies.",
      "Whitaker came up through the Tigers system after being drafted out of Martinsville, Virginia.",
      "Lou Whitaker made his major league debut at just twenty-one years old.",
      "Sweet Lou hit over .300 in 1983.",
      "Whitaker was an All-Star in 1983.",
      "Lou Whitaker has become one of the most dependable second basemen in baseball.",
      "Whitaker and Trammell are widely regarded as one of baseball's finest middle-infield combinations.",
      "Sweet Lou possesses more power than many second basemen.",
      "Lou Whitaker led all American League second basemen in putouts in 1983.",
      "Whitaker has played his entire major league career with Detroit.",
      "Lou was teammates with Alan Trammell in the minor leagues before both reached Detroit.",
      "Lou Whitaker grew up in Martinsville, Virginia.",
      "Whitaker was born in Brooklyn before his family moved south.",
      "Sweet Lou was just twenty years old when he won Rookie of the Year.",
      "Lou has spent his entire professional career in the Detroit organization.",
      "Whitaker was drafted by the Tigers in 1975.",
      "Lou Whitaker and Alan Trammell reached the major leagues together in September of 1977.",
      "Sweet Lou made an All-Star team before turning twenty-seven.",
      "Lou became one of the youngest regulars in the American League.",
      "Whitaker is one of the few second basemen who can hit for both average and power.",
    ],
    combo: [
      "Sweet Lou and Tram have been side-by-side for years now.",
      "Whitaker and Trammell know where each other are on the field without looking.",
      "When people mention Whitaker, they usually mention Trammell in the same sentence.",
      "Lou and Tram have been together so long they practically finish each other's plays.",
      "Whitaker and Trammell came through the Tigers system side by side.",
      "Sweet Lou and Tram debuted in the same game.",
      "You won't find many middle-infield combinations with more experience together.",
    ],
  },

  "Alan Trammell": {
    names: ["Alan Trammell", "Tram", "Trammell"],
    lines: [
      "Alan Trammell was drafted by Detroit directly out of high school.",
      "Trammell has spent his entire career with the Tigers.",
      "Tram won a Gold Glove in 1980.",
      "Alan Trammell was selected to the All-Star team in 1980.",
      "Trammell is known as one of the smartest players in baseball.",
      "Alan Trammell has become a leader in the Tigers clubhouse.",
      "Tram and Lou Whitaker debuted together in 1977.",
      "Trammell played over 150 games in 1983.",
      "Many managers consider Trammell among the best defensive shortstops in baseball.",
      "Alan Trammell hit .319 in 1980.",
      "Tram has excellent range to both sides.",
      "Alan Trammell attended Kearny High School in San Diego.",
      "Trammell was born in Garden Grove, California.",
      "Detroit drafted Alan right out of high school.",
      "Tram never played college baseball.",
      "Alan was still a teenager when he reached the majors.",
      "Trammell was Detroit's second-round pick in 1976.",
      "Alan won a Gold Glove in 1980.",
      "Managers rave about Trammell's baseball instincts.",
      "Tram isn't flashy, but he almost never beats himself.",
      "Alan's quick release is one reason he's such an outstanding shortstop.",
      "Alan Trammell grew up rooting for Southern California ballclubs.",
      "Tram has spent his entire career wearing a Detroit uniform.",
      "Few players make routine plays look easier than Alan Trammell.",
    ],
    combo: [
      "Whitaker and Trammell might be the best double-play combination in baseball.",
      "Whitaker and Trammell have been together longer than some marriages.",
      "Sweet Lou and Tram know each other's tendencies better than most brothers.",
    ],
  },

  "Kirk Gibson": {
    names: ["Kirk Gibson", "Gibson", "Gibby"],
    lines: [
      "Kirk Gibson played football at Michigan State.",
      "Gibson was drafted by both NFL and Major League teams.",
      "Gibby possesses one of the strongest throwing arms in the league.",
      "Kirk Gibson stole 30 bases in 1983.",
      "Gibson hit 25 home runs last season.",
      "Few players combine power and speed the way Gibson does.",
      "Kirk Gibson is known for playing with tremendous intensity.",
      "Gibby can change a game with one swing.",
      "Gibson was an All-Star in 1983.",
      "Many opponents say Gibson plays every inning like it's the ninth.",
      "Kirk Gibson may be the toughest player on this ballclub.",
      "Kirk Gibson starred in both football and baseball at Michigan State.",
      "Gibby was drafted by an NFL team before choosing baseball.",
      "Some scouts believed Gibson's future was actually in football.",
      "Kirk was an All-American football player.",
      "Gibson might be the best football player on any baseball field.",
      "Gibson grew up in Michigan.",
      "Gibby attended Waterford Kettering High School.",
      "Kirk is one of the hometown favorites on this Tigers club.",
      "Few players compete harder than Kirk Gibson.",
      "The Tigers made Gibson a first-round draft choice.",
      "Gibson reached the major leagues quickly.",
      "Kirk combines power, speed, and a cannon arm.",
      "Some managers say Gibson can beat you three different ways.",
      "Gibby stole thirty bases last season.",
      "Kirk Gibson plays baseball the same way some men play football.",
      "There aren't many easy innings when Gibson is due up.",
    ],
    rare: [
      "Kirk Gibson may be the toughest player on this ballclub.",
    ],
  },

  "Lance Parrish": {
    names: ["Lance Parrish", "Parrish", "Big Wheel"],
    lines: [
      "Lance Parrish is one of the game's premier catchers.",
      "Parrish won a Gold Glove in 1983.",
      "Big Wheel hit 27 home runs last season.",
      "Lance Parrish was an All-Star in 1983.",
      "Parrish caught more than 130 games in 1983.",
      "Many pitchers credit Parrish for helping call a game.",
      "Lance possesses tremendous power for a catcher.",
      "Parrish was born in Pennsylvania before making his name in Detroit.",
      "Big Wheel has become a fan favorite at Tiger Stadium.",
      "Lance Parrish led American League catchers in home runs last season.",
      "Lance Parrish grew up in Southern California.",
      "Parrish attended Walnut High School.",
      "Lance starred in football, basketball, and baseball as a teenager.",
      "Big Wheel was offered a football scholarship to UCLA.",
      "Parrish was originally drafted as a third baseman.",
      "The Tigers eventually converted Lance into a catcher.",
      "Big Wheel has become one of baseball's premier catchers.",
      "Parrish owns one of the strongest throwing arms in the league.",
      "Lance was a first-round draft choice.",
      "Many Detroit pitchers love throwing to Parrish.",
      "Catchers aren't supposed to hit this many home runs.",
      "Big Wheel probably carries more equipment than anybody in the clubhouse.",
    ],
  },

  "Darrell Evans": {
    names: ["Darrell Evans", "Evans"],
    lines: [
      "Darrell Evans entered the league with Atlanta back in 1969.",
      "Evans hit 41 home runs in 1973.",
      "Darrell Evans has always been known for patience at the plate.",
      "Evans drew over 100 walks in multiple seasons.",
      "Few hitters work a count better than Darrell Evans.",
      "Evans reached 30 home runs as recently as 1983.",
      "Darrell can play both first and third base.",
      "Evans was an All-Star with Atlanta.",
      "Darrell Evans has over 200 career home runs entering this season.",
      "Evans is one of the most experienced players on this Detroit club.",
      "Darrell Evans attended Pasadena High School.",
      "Evans grew up in California.",
      "Darrell entered professional baseball during the Nixon administration.",
      "He's one of the most experienced players in either league.",
      "Evans broke in with Atlanta in 1969.",
      "Darrell hit forty-one home runs in 1973.",
      "Few hitters have drawn more walks than Evans.",
      "Darrell has always believed in making pitchers work.",
      "Evans can still hit the ball a long way.",
      "Darrell Evans has forgotten more baseball than most rookies know.",
    ],
  },

  "Chet Lemon": {
    names: ["Chet Lemon", "Lemon", "Chet"],
    lines: [
      "Chet Lemon came over from the White Sox before the 1982 season.",
      "Lemon was an All-Star with Chicago.",
      "Chet Lemon hit 24 home runs in 1979.",
      "Many consider Lemon among baseball's finest defensive center fielders.",
      "Chet covers a tremendous amount of ground.",
      "Lemon led the American League in hit-by-pitches in 1978.",
      "Chet has excellent power for a center fielder.",
      "Lemon has recorded over 1,000 hits in his career.",
      "Chet was born in Mississippi.",
      "Lemon combines speed, defense, and power.",
      "Chet Lemon was born in Mississippi.",
      "Lemon later grew up in California.",
      "Chet was originally developed as a catcher.",
      "The White Sox once viewed Lemon as a future franchise player.",
      "Detroit acquired Lemon from Chicago.",
      "Chet made an All-Star team before joining the Tigers.",
      "Many consider Lemon among baseball's best defensive center fielders.",
      "Chet plays unusually deep in center field.",
      "Lemon gets tremendous jumps on fly balls.",
      "A lot of center fielders run fast. Chet Lemon starts fast.",
    ],
  },

  "Larry Herndon": {
    names: ["Larry Herndon", "Herndon"],
    lines: [
      "Larry Herndon came to Detroit from San Francisco.",
      "Herndon hit over .300 in 1983.",
      "Larry drove in 92 runs last season.",
      "Herndon posted career highs in several offensive categories in 1983.",
      "Larry has become one of Detroit's most reliable run producers.",
      "Herndon broke into the majors with the Cardinals.",
      "Many fans forget Herndon has played all three outfield positions.",
      "Herndon was among Detroit's RBI leaders in 1983.",
      "Larry Herndon attended Ole Miss.",
      "Herndon played college baseball in the Southeastern Conference.",
      "Larry was originally drafted out of college.",
      "Herndon has played in both leagues.",
      "Larry broke into the majors with St. Louis.",
      "Herndon spent several seasons in San Francisco.",
      "Detroit fans really got to know Herndon last year.",
      "Larry had one of the finest seasons of his career in 1983.",
    ],
  },

  "Howard Johnson": {
    names: ["Howard Johnson", "HoJo", "Johnson"],
    lines: [
      "Howard Johnson was born in Florida.",
      "Johnson made his major league debut in 1982.",
      "HoJo is one of the younger players on this club.",
      "Howard Johnson has shown surprising power.",
      "Johnson can play multiple infield positions.",
      "The Tigers believe Howard Johnson has a bright future.",
      "HoJo hit 13 home runs in limited duty last year.",
      "Johnson has excellent bat speed.",
      "Howard Johnson grew up in Clearwater, Florida.",
      "HoJo attended Clearwater High School.",
      "Johnson was drafted by Detroit in 1979.",
      "Howard is one of the youngest regulars on this ballclub.",
      "The Tigers have high hopes for Howard Johnson.",
      "HoJo hit thirteen home runs last season.",
      "Howard's power is what scouts noticed first.",
      "Some folks in this organization think Howard Johnson's best years are still ahead.",
    ],
    rare: [
      "Several scouts believe Howard Johnson may become a star.",
    ],
  },

  "Barbaro Garbey": {
    names: ["Barbaro Garbey", "Garbey"],
    lines: [
      "Barbaro Garbey defected from Cuba before reaching the major leagues.",
      "Garbey spent several seasons in the minors before arriving in Detroit.",
      "Barbaro was a star player in Cuba.",
      "Garbey possesses excellent bat control.",
      "Detroit fans have quickly taken to Barbaro Garbey.",
      "Garbey can play both the outfield and serve as designated hitter.",
    ],
  },

  "Jack Morris": {
    names: ["Jack Morris", "Morris"],
    lines: [
      "Jack Morris led the American League with 20 wins in 1981.",
      "Morris won 20 games again in 1983.",
      "Jack Morris was an All-Star in 1981.",
      "Many hitters consider Morris one of the toughest competitors in baseball.",
      "Jack has thrown over 250 innings in a season.",
      "Morris led the league in strikeouts in 1983.",
      "Jack Morris relies heavily on his fastball.",
      "Morris was drafted out of Brigham Young University.",
      "Few pitchers work deeper into games than Jack Morris.",
      "Jack has been Detroit's ace for several seasons.",
      "If there's a big game, Sparky Anderson usually wants the ball in Jack Morris's hands.",
      "Jack Morris attended Brigham Young University.",
      "Morris grew up in St. Paul, Minnesota.",
      "Jack was drafted by Detroit in 1976.",
      "Morris and Trammell came from the same draft class.",
      "Jack won twenty games in 1981.",
      "Morris won twenty again in 1983.",
      "Few pitchers work deeper into games.",
      "Jack believes a starter's job is to finish what he starts.",
      "Morris led the league in strikeouts last year.",
      "Jack Morris never met a complete game he didn't like.",
      "Morris pitches like he's angry at the baseball.",
      "If Sparky Anderson needs a big game, he usually starts with Jack Morris.",
    ],
  },

  "Dan Petry": {
    names: ["Dan Petry", "Petry"],
    lines: [
      "Dan Petry won 19 games in 1983.",
      "Petry was among the American League leaders in victories last year.",
      "Dan attended Eastern Michigan University.",
      "Petry emerged as one of Detroit's most dependable starters.",
      "Dan has excellent control.",
      "Petry has improved each season in the majors.",
      "Many clubs would love to have Dan Petry as their number one starter.",
      "Dan Petry attended Eastern Michigan University.",
      "Petry was drafted by Detroit in 1976.",
      "Dan worked his way through every level of the Tigers system.",
      "Petry won nineteen games last season.",
      "Dan might be a number one starter on several clubs.",
      "Petry's control has improved every year.",
      "He doesn't overpower hitters, but he rarely gives in.",
    ],
  },

  "Milt Wilcox": {
    names: ["Milt Wilcox", "Wilcox"],
    lines: [
      "Milt Wilcox broke into the majors with Cincinnati.",
      "Wilcox has pitched for several organizations.",
      "Milt won 14 games in 1983.",
      "Wilcox brings veteran experience to Detroit's rotation.",
      "Milt has over a decade of major league experience.",
      "Wilcox has pitched in both leagues.",
    ],
  },

  "Juan Berenguer": {
    names: ["Juan Berenguer", "Berenguer", "Juan"],
    lines: [
      "Juan Berenguer was born in the Dominican Republic.",
      "Berenguer throws hard.",
      "Juan came to Detroit from Kansas City.",
      "Berenguer can start or relieve.",
      "Hitters often struggle with Juan's movement.",
      "Berenguer's fastball can be explosive.",
    ],
  },

  "Willie Hernandez": {
    names: ["Willie Hernandez", "Hernandez", "Willie"],
    lines: [
      "Willie Hernandez was acquired from Philadelphia before the season.",
      "Hernandez features a devastating screwball.",
      "Willie was born in Puerto Rico.",
      "Hitters often struggle to pick up Hernandez's delivery.",
    ],
  },

  "Aurelio Lopez": {
    names: ["Aurelio Lopez", "Lopez", "Aurelio", "Señor Smoke"],
    lines: [
      "Aurelio Lopez is known as Señor Smoke.",
      "Lopez was born in Mexico.",
      "Aurelio has been one of Detroit's most dependable relievers.",
    ],
  },

  "Doug Bair": {
    names: ["Doug Bair", "Bair"],
    lines: [
      "Doug Bair has pitched in over 500 major league games.",
      "Bair brings veteran leadership to the bullpen.",
    ],
  },

  "Bill Scherrer": {
    names: ["Bill Scherrer", "Scherrer"],
    lines: [
      "Bill Scherrer is one of Sparky Anderson's trusted left-handers.",
    ],
  },

  "Sid Monge": {
    names: ["Sid Monge", "Monge"],
    lines: [
      "Sid Monge was born in Mexico.",
      "Monge gives Detroit another quality left-handed option.",
    ],
  },

  "Johnny Grubb": {
    names: ["Johnny Grubb", "Grubb"],
    lines: [
      "Johnny Grubb was an All-Star with Cleveland.",
      "Grubb has played all three outfield positions.",
      "Johnny is one of Detroit's most experienced reserves.",
    ],
  },

  "Rusty Kuntz": {
    names: ["Rusty Kuntz", "Kuntz"],
    lines: [
      "Rusty Kuntz is one of the fastest players on the roster.",
      "Kuntz is often used as a defensive replacement.",
      "Rusty can change a game on the bases.",
    ],
  },

  "Dave Bergman": {
    names: ["Dave Bergman", "Bergman"],
    lines: [
      "Dave Bergman came over from San Francisco.",
      "Bergman is known for a disciplined approach.",
    ],
  },

  "Marty Castillo": {
    names: ["Marty Castillo", "Castillo"],
    lines: [
      "Marty Castillo was born in California.",
      "Castillo provides infield depth and versatility.",
    ],
  },

  "Tom Brookens": {
    names: ["Tom Brookens", "Brookens"],
    lines: [
      "Tom Brookens can play several infield positions.",
      "Brookens reached the majors in 1979.",
    ],
  },

  "Sparky Anderson": {
    names: ["Sparky Anderson", "Sparky"],
    lines: [
      "Sparky Anderson has won World Series titles in both leagues.",
      "Sparky was the manager of the Big Red Machine in Cincinnati.",
      "Captain Hook got that nickname from his quick hook with pitchers.",
    ],
  },
};

// ── Combo lines for pairs/trios that fire when any of the duo are involved ──
const COMBO_LINES = [
  "Whitaker and Trammell have been together longer than some marriages.",
  "Sweet Lou and Tram know each other's tendencies better than most brothers.",
  "Morris has thrown to Parrish so often they practically communicate without signs.",
  "Gibson, Lemon, and Herndon cover a lot of real estate in that outfield.",
  "Parrish and Morris have worked together for years.",
  "Whitaker, Trammell, Gibson, and Parrish form the core of this Detroit club.",
  "Sparky Anderson built this team around up-the-middle defense.",
  "The Tigers have homegrown stars all over the diamond.",
];

/**
 * Pick a random player-specific tidbit.
 * Returns null if the player name doesn't match any entry.
 */
export function pickTigersPlayerTidbit(playerName) {
  const entry = PLAYERS[playerName];
  if (!entry || !entry.lines || entry.lines.length === 0) return null;

  // 25% chance to fire a combo line instead (when combo lines exist for this player)
  if (entry.combo && entry.combo.length > 0 && Math.random() < 0.25) {
    return entry.combo[Math.floor(Math.random() * entry.combo.length)];
  }

  // 5% chance for a rare line
  if (entry.rare && entry.rare.length > 0 && Math.random() < 0.05) {
    return entry.rare[Math.floor(Math.random() * entry.rare.length)];
  }

  return entry.lines[Math.floor(Math.random() * entry.lines.length)];
}

/**
 * Pick a random combo line - fires occasionally when any Tigers player is at bat.
 */
export function pickTigersComboLine() {
  return COMBO_LINES[Math.floor(Math.random() * COMBO_LINES.length)];
}