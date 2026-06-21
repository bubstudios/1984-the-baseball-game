// Red Sox Player Stats & Tidbits — 1984 season
// Used contextually when a specific player is at-bat or on the mound.

const PLAYERS = {
  "Wade Boggs": {
    names: ["Wade Boggs", "Boggs", "Wade", "Boggie", "Number 26"],
    lines: [
      "Wade Boggs was born in Omaha, Nebraska, while his father was serving in the military.",
      "Boggs spent six years climbing through the Red Sox farm system before reaching Boston.",
      "Wade Boggs was drafted by Boston in the seventh round of the 1976 draft.",
      "Boggs played for Bristol and Pawtucket before finally reaching the big leagues.",
      "Wade Boggs played in the famous 33-inning Pawtucket-Rochester game in 1981.",
      "Boggs led the International League in hits before getting the call to Boston.",
      "Wade Boggs made his major league debut in 1982.",
      "Boggs led the American League in hitting in 1983.",
      "Wade hit .361 last season — a remarkable rookie campaign.",
      "Boggs collected 203 hits in 1983.",
      "Wade Boggs is already becoming one of the toughest hitters in baseball to strike out.",
      "Boggs rarely gives away an at-bat.",
      "Wade Boggs won a Silver Slugger Award in 1983.",
      "Boggs reached base nearly forty-one percent of the time last year.",
      "Wade Boggs has quickly become the cornerstone of this Boston lineup.",
      "Boggs is known throughout baseball for spending hours studying opposing pitchers.",
      "Teammates say Boggs treats hitting like a science experiment.",
      "Boggs can often be found taking extra batting practice long after everyone else leaves.",
      "Wade attended Plant High School in Tampa, Florida.",
      "Boggs grew up moving around military bases before settling in Florida.",
    ],
    combo: [
      "Dwight Evans and Wade Boggs combined for nearly four hundred hits last season.",
      "Boggs and Marty Barrett give Boston one of the toughest top-of-the-order combinations.",
      "Wade Boggs and Jim Rice are a nightmare combination for opposing pitchers.",
      "Boggs gets on, Rice drives him in. It's a pretty simple formula.",
    ],
    rare: [
      "If there were a Hall of Fame for line drives to left field, Wade Boggs would already be in it.",
      "Wade Boggs doesn't strike out much because he seems to know where every pitch is headed.",
      "Boggs might be the toughest player in baseball to fool twice.",
    ],
  },

  "Dwight Evans": {
    names: ["Dwight Evans", "Evans", "Dewey", "Dwight", "Dewey Evans"],
    lines: [
      "Dwight Evans has spent his entire major league career with Boston.",
      "Dewey debuted with the Red Sox back in 1972.",
      "Dwight Evans won multiple Gold Gloves before the 1984 season.",
      "Evans is regarded as one of the finest defensive right fielders in baseball.",
      "Dewey possesses one of the strongest throwing arms in the American League.",
      "Dwight Evans led Boston in runs scored last season.",
      "Evans swatted 25 home runs in 1983.",
      "Dwight has twice topped 30 home runs in his career.",
      "Evans played over 160 games in 1983.",
      "Dewey is one of the most durable players in baseball.",
      "Dwight Evans draws more walks than most power hitters.",
      "Evans is among the smartest outfielders in the game.",
      "Dwight Evans was drafted by Boston in 1969.",
      "Teammates call him Dewey — always have.",
      "Dwight played every game in both 1982 and is on pace to do it again.",
      "Evans is respected throughout baseball for his work ethic.",
    ],
    combo: [
      "Dwight Evans and Jim Rice have been terrorizing American League pitchers for years.",
      "Evans and Rice give Boston tremendous power in the middle of the order.",
      "Evans and Boggs form one of baseball's best table-setting duos.",
      "Dewey, Rice, and Armas might be the most dangerous outfield in baseball.",
      "Jim Rice and Dwight Evans have been teammates for over a decade now. That's a lot of bus rides and clubhouse card games.",
    ],
    rare: [
      "Dewey might save more runs with his glove than some players produce with their bats.",
      "You don't run on Dewey unless you enjoy disappointment.",
      "The smartest thing a baserunner can do is pretend Dwight Evans doesn't exist.",
    ],
  },

  "Jim Rice": {
    names: ["Jim Rice", "Rice", "Jim Ed", "Jim"],
    lines: [
      "Jim Rice grew up in Anderson, South Carolina.",
      "Rice was drafted by Boston in 1971.",
      "Jim Rice spent his entire career with the Red Sox.",
      "Rice debuted with Boston in 1974.",
      "Jim Rice was the American League MVP in 1978.",
      "Rice led the league in home runs in 1978.",
      "Jim Ed became the first major leaguer in nearly two decades to reach 400 total bases.",
      "Jim Rice has surpassed 200 career home runs.",
      "Rice drove in over 120 runs last season.",
      "Jim Rice has topped 35 home runs multiple times.",
      "Rice is among the most feared hitters of his era.",
      "Jim Rice hits line drives harder than almost anyone in baseball.",
      "Rice has one of the strongest throwing arms among left fielders.",
      "Jim Ed attended T.L. Hanna High School in South Carolina.",
      "Rice led the majors in RBIs during the late 1970s.",
      "Between 1975 and 1986, Rice established himself as one of the game's elite hitters.",
    ],
    combo: [
      "Jim Rice and Tony Armas combined for more than seventy home runs last year.",
      "Rice and Evans have been the heart of Boston's offense for years.",
      "Rice and Boggs provide both power and average.",
    ],
    rare: [
      "When Jim Rice comes up, every outfielder takes a step back.",
      "You can hear the difference when Jim Rice squares one up.",
      "That ball had a family.",
      "Some baseballs never recover emotionally after meeting Jim Rice.",
    ],
  },

  "Tony Armas": {
    names: ["Tony Armas", "Armas", "Tony"],
    lines: [
      "Tony Armas was born in Venezuela.",
      "Armas signed as an amateur free agent.",
      "Tony Armas arrived in Boston after starring with Oakland.",
      "Armas led the American League in home runs in 1981.",
      "Tony Armas hit 43 home runs last season.",
      "Armas drove in 123 runs in 1983.",
      "Tony led the Red Sox in home runs last year.",
      "Armas combines power with outstanding defense in center field.",
      "Tony Armas has won a Gold Glove.",
      "Armas is capable of changing a game with one swing.",
      "Tony Armas has one of the quickest bats in baseball.",
    ],
    rare: [
      "Tony Armas doesn't need much of a mistake.",
      "If you're selling baseballs in Boston, Tony Armas is good for business.",
    ],
  },

  "Mike Easler": {
    names: ["Mike Easler", "Easler", "The Hit Man"],
    lines: [
      "Mike Easler is nicknamed The Hit Man.",
      "Easler came to Boston after several productive seasons in Pittsburgh.",
      "Mike Easler hit over .300 last season.",
      "The Hit Man collected 188 hits in 1983.",
      "Mike Easler can hit for both average and power.",
      "Easler is one of the most dangerous designated hitters in the league.",
      "Mike Easler was born in Ohio.",
      "The Hit Man has topped 20 home runs multiple times.",
    ],
  },

  "Bill Buckner": {
    names: ["Bill Buckner", "Buckner", "Buck", "Billy Buck"],
    lines: [
      "Bill Buckner debuted in the majors in 1969.",
      "Buckner has over 2,000 career hits entering 1984.",
      "Bill Buckner won a batting title in 1980.",
      "Buckner is one of baseball's toughest competitors.",
      "Bill Buckner rarely strikes out.",
      "Buckner has played both first base and the outfield over his career.",
      "Bill Buckner was originally drafted by the Dodgers.",
      "Buckner has spent more than a decade in the major leagues.",
      "Bill Buckner is known for playing through injuries.",
      "Buckner played for the Dodgers and Cubs before coming to Boston.",
    ],
    rare: [
      "Buckner doesn't strike out much because he believes every ball is hittable.",
      "Bill Buckner has forgotten more baseball than most players ever learn.",
      "Buckner looks like he was born carrying a bat.",
    ],
  },

  "Rich Gedman": {
    names: ["Rich Gedman", "Gedman", "Geddy"],
    lines: [
      "Rich Gedman is a Massachusetts native.",
      "Gedman grew up rooting for the Red Sox.",
      "Rich Gedman came through Boston's farm system.",
      "Gedman hit 24 home runs last season — remarkable for a catcher.",
      "Rich had a breakout year in 1983.",
      "Gedman is emerging as one of the league's better offensive catchers.",
      "Rich Gedman provides surprising power from behind the plate.",
      "Gedman handles Boston's pitching staff extremely well.",
      "Rich Gedman grew up dreaming of one day wearing a Red Sox uniform.",
    ],
    rare: [
      "Gedman gives Boston offense from a position where offense is hard to find.",
      "Catchers aren't supposed to hit like this.",
    ],
  },

  "Marty Barrett": {
    names: ["Marty Barrett", "Barrett", "Marty"],
    lines: [
      "Marty Barrett is a California native.",
      "Barrett climbed steadily through Boston's system.",
      "Marty Barrett hit over .300 last season.",
      "Barrett was a key contributor to Boston's offense in 1983.",
      "Marty Barrett is one of the toughest players in the league to strike out.",
    ],
    combo: [
      "Barrett and Boggs make a formidable contact-hitting duo at the top of the order.",
    ],
  },

  "Jackie Gutierrez": {
    names: ["Jackie Gutierrez", "Gutierrez", "Jackie"],
    lines: [
      "Jackie Gutierrez was born in Nicaragua.",
      "Gutierrez is one of very few Nicaraguan players in the major leagues.",
      "Jackie stole 12 bases last season.",
      "Gutierrez provides excellent range at shortstop.",
      "Jackie is known more for his defense than his bat.",
      "Gutierrez played 151 games for Boston last season.",
    ],
  },

  "Bruce Hurst": {
    names: ["Bruce Hurst", "Hurst", "Bruce"],
    lines: [
      "Bruce Hurst was born in Utah.",
      "Hurst attended Dixie College.",
      "Bruce Hurst debuted with Boston in 1980.",
      "Hurst won 12 games last season.",
      "Bruce Hurst led Boston in innings pitched in 1983.",
      "Hurst is known for his smooth left-handed delivery.",
      "Bruce Hurst has been one of Boston's most dependable starters.",
      "Hurst pitched over 200 innings last year.",
      "Bruce was a first-round draft pick.",
      "Hurst played in the famous 33-inning Pawtucket game.",
      "Teammates respect Bruce's calm demeanor on the mound.",
    ],
    combo: [
      "Bruce Hurst and Bob Ojeda give Boston two quality left-handers.",
    ],
    rare: [
      "Bruce Hurst never seems rattled out there.",
      "The left-hander works quickly and attacks hitters.",
      "Bruce Hurst doesn't beat himself.",
      "Bruce Hurst pitches like a man late for dinner.",
    ],
  },

  "Oil Can Boyd": {
    names: ["Oil Can Boyd", "Boyd", "Oil Can", "Dennis Boyd"],
    lines: [
      "Dennis Boyd — better known as Oil Can — earned one of baseball's greatest nicknames in Mississippi.",
      "Oil Can Boyd made his major league debut last season.",
      "Boyd won 12 games in 1983.",
      "Oil Can completed 10 games last season — an impressive total.",
      "Oil Can Boyd is known for pitching with tremendous confidence.",
      "Boyd has become a fan favorite almost overnight at Fenway.",
      "The nickname Oil Can came from a Mississippi expression for beer.",
      "Boyd was drafted by Boston in 1980.",
      "Oil Can quickly became one of Fenway's most popular players.",
      "Boyd isn't shy about talking to hitters — or anyone else.",
      "Oil Can Boyd throws harder than most starters in the league.",
      "Boyd's strikeout totals continue to rise.",
    ],
    combo: [
      "Oil Can Boyd and Bob Stanley couldn't have more different personalities.",
      "Bob Stanley is cool as ice, and Oil Can Boyd — well, Oil Can never met a pulse he didn't raise.",
    ],
    rare: [
      "Nobody in baseball has more personality than Oil Can Boyd.",
      "Oil Can doesn't just pitch the game — he performs it.",
      "If confidence were a pitch, Oil Can would throw it 98 miles an hour.",
      "Oil Can Boyd has never met a spotlight he didn't like.",
      "If Oil Can Boyd is pitching tonight, there's a decent chance the umpires hear about every call.",
    ],
  },

  "Bob Stanley": {
    names: ["Bob Stanley", "Stanley", "Steamer"],
    lines: [
      "Bob Stanley was drafted by Boston.",
      "Stanley spent his entire career with the Red Sox.",
      "Teammates nicknamed him Steamer.",
      "Bob became one of Boston's most durable pitchers over the years.",
      "Stanley led the league in appearances multiple times.",
      "By 1984, Bob Stanley had already appeared in hundreds of games.",
    ],
    rare: [
      "Bob Stanley seems to pitch every other day.",
      "The Red Sox have leaned heavily on Steamer over the years.",
      "Stanley can give you one inning or four — whatever the situation demands.",
      "If Boston has a pitching emergency, Bob Stanley is usually the answer.",
      "When Bob Stanley gets up in the bullpen, Boston fans know help is on the way.",
    ],
  },

  "Mark Clear": {
    names: ["Mark Clear", "Clear", "Mark"],
    lines: [
      "Mark Clear throws harder than most relievers.",
      "Clear was acquired from California.",
      "Mark emerged as an important bullpen arm for Boston.",
      "Clear's fastball can overpower hitters.",
    ],
    rare: [
      "Mark Clear comes right after hitters — no mystery, just heat.",
      "Mark Clear's pitching philosophy is refreshingly simple — throw it past him.",
    ],
  },

  "John Henry Johnson": {
    names: ["John Henry Johnson", "Johnson", "J.H."],
    lines: [
      "John Henry Johnson was born in Florida.",
      "Johnson worked his way through several organizations.",
      "He became a dependable left-handed option out of the bullpen.",
      "Johnson gives Boston another left-handed look.",
    ],
  },

  "Steve Crawford": {
    names: ["Steve Crawford", "Crawford", "Steve"],
    lines: [
      "Steve Crawford was drafted by Boston.",
      "Crawford came through the organization's system.",
      "Steve earned his way onto the major league staff.",
      "The Red Sox like Crawford's upside.",
    ],
    rare: [
      "Steve Crawford throws like he's trying to catch the next flight home.",
    ],
  },

  "Charlie Mitchell": {
    names: ["Charlie Mitchell", "Mitchell", "Charlie"],
    lines: [
      "Charlie Mitchell was born in Mississippi.",
      "Mitchell debuted as a teenager.",
      "Charlie was one of the younger pitchers in baseball.",
      "Scouts loved Mitchell's raw talent.",
    ],
    rare: [
      "Charlie Mitchell is young enough to still get carded ordering a soda.",
      "The Red Sox believe Mitchell's best years are still coming.",
    ],
  },

  "Al Nipper": {
    names: ["Al Nipper", "Nipper", "Al"],
    lines: [
      "Al Nipper attended Florida State University.",
      "Nipper reached the majors with Boston.",
      "Al won 11 games as a rookie in 1983.",
      "Nipper was one of Boston's pleasant surprises last year.",
      "Teammates admired his competitiveness on the mound.",
    ],
    rare: [
      "Al Nipper doesn't pitch scared.",
      "Nipper came out of nowhere and won eleven games.",
      "Nobody told Al Nipper he was supposed to be intimidated by major league hitters.",
    ],
  },

  "Bob Ojeda": {
    names: ["Bob Ojeda", "Ojeda", "Bobby O"],
    lines: [
      "Bob Ojeda was born in California.",
      "Ojeda attended UCLA.",
      "Bob was originally drafted by Cleveland.",
      "Ojeda arrived in Boston through a trade.",
      "Bob developed into a reliable left-handed starter.",
    ],
    rare: [
      "Bob Ojeda has excellent movement on his pitches.",
      "Ojeda relies on location rather than overpowering velocity.",
      "Ojeda treats the strike zone like a paintbrush.",
    ],
  },

  "Rick Miller": {
    names: ["Rick Miller", "Miller", "Rick"],
    lines: [
      "Rick Miller debuted with the Red Sox in 1971.",
      "Miller spent most of his career in Boston.",
      "Rick was known as one of the best defensive outfielders in baseball.",
      "Miller could play all three outfield positions.",
      "Teammates often praised Miller's preparation.",
      "Miller was a member of Boston's 1975 pennant-winning club.",
      "Rick entered 1984 with well over a thousand major league games played.",
      "Rick Miller has made a career out of doing the little things right.",
    ],
    rare: [
      "Rick Miller once made one of the greatest catches in Fenway Park history.",
      "Rick Miller has probably forgotten more Fenway Park trivia than most fans know.",
    ],
  },

  "Reid Nichols": {
    names: ["Reid Nichols", "Nichols", "Reid"],
    lines: [
      "Reid Nichols was born in Texas.",
      "Nichols was drafted by Boston.",
      "Reid came through the Red Sox farm system.",
      "Nichols spent time developing in Pawtucket.",
      "Reid made his major league debut in 1980.",
      "Boston still thinks Reid Nichols has plenty of upside.",
    ],
    rare: [
      "Reid Nichols has spent so much time riding buses in the minors he could probably drive one.",
    ],
  },

  "Ed Jurak": {
    names: ["Ed Jurak", "Jurak", "Eddie"],
    lines: [
      "Ed Jurak was born in California.",
      "Jurak played college baseball at Cal State Fullerton.",
      "Ed spent years working through the minor leagues.",
      "Jurak was valued for his versatility — can fill in all over.",
    ],
    rare: [
      "Ed Jurak can fill in all over the diamond.",
      "The easiest way to describe Ed Jurak — if somebody needs a day off, he'll be there.",
    ],
  },

  "Jeff Newman": {
    names: ["Jeff Newman", "Newman", "Jeff"],
    lines: [
      "Jeff Newman was drafted by Oakland.",
      "Newman eventually found a home in Boston.",
      "Jeff is known for handling pitchers well.",
      "Newman spent much of his career as a reliable backup catcher.",
    ],
    rare: [
      "Backup catchers don't get enough credit, and Jeff Newman is a perfect example.",
      "Nobody catches more bullpens than the backup catcher.",
    ],
  },

  "Glenn Hoffman": {
    names: ["Glenn Hoffman", "Hoffman", "Glenn"],
    lines: [
      "Glenn Hoffman is the older brother of a hard-throwing kid in the minors named Trevor.",
      "Hoffman was drafted by Boston.",
      "Glenn was known primarily for his defense at shortstop.",
      "Managers appreciated Hoffman's reliability.",
    ],
    rare: [
      "Glenn Hoffman won't wow you offensively, but he can really pick it.",
      "Glenn Hoffman believes every ground ball belongs to him.",
    ],
  },
};

// ── Combo lines for pairs/trios that fire when any of the duo are involved ──
const COMBO_LINES = [
  "Boggs, Barrett, Rice, Armas, Evans — there aren't many easy outs in this lineup.",
  "The Red Sox led the league in conversation starters and offensive production.",
  "Boggs gets on, Rice drives him in. It's a pretty simple formula.",
  "Dewey, Rice, and Armas might be the most dangerous outfield in baseball.",
  "The Red Sox have youth in Boggs and Gedman, veterans in Rice and Evans, and firepower everywhere in between.",
  "Boggs and Barrett may not hit a lot of homers, but they'll drive pitchers crazy.",
  "Rice, Armas, and Evans give Boston as much power as anybody in the league.",
  "Gedman is still learning from veterans like Buckner and Rice.",
  "The Red Sox blend veterans, stars, and young talent as well as any club in baseball.",
  "Boggs and Barrett are about as tough to strike out as any pair in baseball.",
];

/**
 * Pick a random player-specific tidbit.
 * Returns null if the player name doesn't match any entry.
 */
export function pickRedSoxPlayerTidbit(playerName) {
  const entry = PLAYERS[playerName];
  if (!entry || !entry.lines || entry.lines.length === 0) return null;

  // 25% chance to fire a combo line instead (when combo lines exist for this player)
  if (entry.combo && entry.combo.length > 0 && Math.random() < 0.25) {
    return entry.combo[Math.floor(Math.random() * entry.combo.length)];
  }

  // 5% chance for a rare/broadcast-style line
  if (entry.rare && entry.rare.length > 0 && Math.random() < 0.05) {
    return entry.rare[Math.floor(Math.random() * entry.rare.length)];
  }

  return entry.lines[Math.floor(Math.random() * entry.lines.length)];
}

/**
 * Pick a random combo line — fires occasionally when any Red Sox player is at bat.
 */
export function pickRedSoxComboLine() {
  return COMBO_LINES[Math.floor(Math.random() * COMBO_LINES.length)];
}