// Philadelphia Phillies Broadcast Lines — 1984
// Harry Kalas & Richie Ashburn — Voice of the Phillies at Veterans Stadium

export function pickPhilliesLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, p) => sum + p.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.teamPraise.lines[0];
}

export function pickPhilliesPlayerLine(playerName) {
  const entry = PLAYER_TIDBITS[playerName];
  if (!entry || !entry.lines || entry.lines.length === 0) return null;
  return entry.lines[Math.floor(Math.random() * entry.lines.length)];
}

const POOLS = {
  gameAction: { weight: 0, lines: [
    "\"Strike three called.\"", "\"Got him looking.\"", "\"A line drive — base hit.\"",
    "\"Long drive to left — way back — gone. Home run!\"",
    "\"Ground ball to short — over to first — in time.\"",
  ]},
  teamPraise: { weight: 20, lines: [
    "\"The Phillies have some very dangerous hitters in this lineup.\"",
    "\"Hard to believe, Harry — this ballclub can explode for runs at any moment.\"",
    "\"Philadelphia baseball at its finest tonight at Veterans Stadium.\"",
    "\"This is a deep, experienced ballclub. They've been here before.\"",
    "\"The Phillies are never out of it. That's what experience does for a ball team.\"",
    "\"A battle-tested lineup — Michael Jack Schmidt leading the way.\"",
    "\"Talent up and down this roster. The Phillies are a dangerous team.\"",
    "\"South Philadelphia is rocking tonight — good crowd for good baseball.\"",
    "\"This is a proud franchise with a proud history.\"",
    "\"Philadelphia fans bring the energy. This crowd is into it tonight.\"",
    "\"Hard to believe, Harry — the Phillies simply do not quit.\"",
    "\"A fine ballclub in every respect. The Phillies are playing good baseball.\"",
  ]},
  players: { weight: 15, lines: [
    "\"Schmidt may be the finest third baseman who ever played the game.\"",
    "\"Steve Carlton has been doing this for fifteen years — pure mastery.\"",
    "\"Juan Samuel gives this team a completely different dimension with his speed.\"",
    "\"The Phanatic is fired up — that's always a good sign for the Phillies.\"",
    "\"This pitching staff has the pedigree to keep the Phillies in any game.\"",
    "\"Hard to believe, Harry — what Michael Jack Schmidt has meant to this franchise.\"",
    "\"Garry Maddox covers that outfield like no one else in baseball.\"",
    "\"Carlton's slider — you simply cannot hit it when it's working.\"",
    "\"Two-thirds of the world is covered by water, Harry. The rest is covered by Garry Maddox.\"",
  ]},
  atmosphere: { weight: 15, lines: [
    "\"A beautiful night here at Veterans Stadium in South Philadelphia.\"",
    "\"The lights are on at The Vet — that always means business.\"",
    "\"Veterans Stadium — the home of Phillies baseball since 1971.\"",
    "\"A fine crowd in South Philadelphia. These fans know the game.\"",
    "\"Hard to believe, Harry — you couldn't ask for a better night for baseball.\"",
    "\"The Phanatic is at it again — always keeping the crowd entertained.\"",
    "\"The artificial turf is quick here at The Vet — everything happens fast.\"",
    "\"A warm summer evening in Philadelphia — perfect for baseball.\"",
    "\"Veterans Stadium — a great place to watch a ballgame.\"",
    "\"The old ballpark on Broad Street, and the Phillies are playing tonight.\"",
  ]},
  crowd: { weight: 10, lines: [
    "\"The crowd at Veterans Stadium is into this ballgame.\"",
    "\"Philadelphia fans are knowledgeable — they appreciate fine play.\"",
    "\"South Philly fans are not shy about letting you know how they feel.\"",
    "\"The upper deck is making some noise tonight.\"",
    "\"Hard to believe, Harry — listen to this crowd!\"",
    "\"The Phillies fans gave that a fine ovation.\"",
    "\"Nobody roars like a Philadelphia crowd when the home team delivers.\"",
    "\"This crowd is wound up. You can feel it.\"",
    "\"The Phillies faithful are behind their team tonight.\"",
  ]},
  folksy: { weight: 6, lines: [
    "\"Welcome to Veterans Stadium, everyone. A wonderful evening for baseball.\"",
    "\"Good to have you with us tonight. We appreciate you spending time with us.\"",
    "\"Baseball at its best, right here in the City of Brotherly Love.\"",
    "\"Hard to believe, Harry — what a game this has been.\"",
    "\"A great game of baseball — that's what South Philadelphia is all about.\"",
    "\"Harry Kalas here alongside Richie Ashburn — the best seat in the house.\"",
    "\"There's something special about baseball at The Vet on a summer night.\"",
    "\"Take care of yourselves, everybody. Enjoy the ballgame.\"",
    "\"The great thing about baseball is you never know what's coming next.\"",
  ]},
  signature: { weight: 1, lines: [
    "\"Watch that baby — OUTTA HERE! Michael Jack Schmidt has done it again!\"",
    "\"He crushed it — that ball is outta here, and the Phillies lead!\"",
    "\"Hard to believe, Harry — did you see how far that one went?\"",
    "\"A magnificent piece of hitting. Simply magnificent.\"",
    "\"The Phillies are making their move here at The Vet.\"",
    "\"Absolutely nobody does it like Michael Jack Schmidt.\"",
    "\"That ball is long gone. Harry Kalas calls it a home run for Philadelphia!\"",
  ]},
};

const PLAYER_TIDBITS = {
  "Mike Schmidt": {
    lines: [
      "Mike Schmidt entered professional baseball in 1971 as the Phillies' second-round draft choice.",
      "Schmidt grew up in Dayton, Ohio and attended Ohio University.",
      "Michael Jack Schmidt has won eight Gold Gloves at third base.",
      "Schmidt led the National League in home runs six times entering this season.",
      "Mike Schmidt was the NL MVP in 1980, 1981, and 1986.",
      "Schmidt hit 48 home runs in 1980 — an extraordinary season.",
      "Michael Jack Schmidt is widely regarded as the finest third baseman in the history of the National League.",
      "Schmidt has been an All-Star representative for Philadelphia for over a decade.",
      "Few players in the history of this game combine offensive and defensive excellence the way Schmidt does.",
      "Hard to believe, Harry — what Michael Jack has accomplished in a Phillies uniform.",
      "Michael Jack drives in runs. That is what he does.",
      "Schmidt provides both exceptional power and outstanding defense. He does everything.",
      "You simply cannot give Schmidt a pitch he can handle. He will not miss it.",
      "Schmidt is the cornerstone of this franchise. Has been for over a decade.",
    ],
  },
  "Steve Carlton": {
    lines: [
      "Steve Carlton won the Cy Young Award in 1972, 1977, 1980, and 1982 — four times.",
      "Carlton pitched a remarkable 346 innings in 1972 — one of the finest pitching seasons in modern baseball.",
      "Lefty doesn't talk to the press. He prefers to let his performances do the speaking.",
      "Steve Carlton grew up in Miami, Florida.",
      "Carlton developed his slider through years of meticulous practice.",
      "Many batters consider Carlton's slider the most difficult pitch in baseball to hit.",
      "Steve Carlton has thrown over 4,000 career strikeouts.",
      "Hard to believe, Harry — what Lefty has accomplished in a Phillies uniform.",
      "Carlton came to Philadelphia from St. Louis in a controversial trade — and became a legend.",
      "Lefty's slider breaks so sharply it almost seems to disappear.",
      "Steve Carlton is a workout fanatic — still in magnificent condition at this stage of his career.",
      "Even now, Steve Carlton remains one of baseball's elite starting pitchers.",
      "The slider is the great equalizer for Carlton — it neutralizes right-handed and left-handed hitters alike.",
    ],
  },
  "Juan Samuel": {
    lines: [
      "Juan Samuel burst onto the scene with one of the most exciting rookie seasons in Phillies history.",
      "Samuel was born in San Pedro de Macoris in the Dominican Republic.",
      "Juan Samuel can beat you with his bat, his glove, or his legs.",
      "The speed of Juan Samuel on the basepaths is something to behold.",
      "Samuel reached the major leagues quickly and has been magnificent.",
      "Juan has exceptional instincts as a leadoff hitter and baserunner.",
      "Samuel's bat speed alone would make him a prospect — the legs make him special.",
      "Hard to believe, Harry — the season this young man is having.",
    ],
  },
  "Von Hayes": {
    lines: [
      "Von Hayes was part of the famous five-for-one trade with Cleveland.",
      "Hayes came to Philadelphia from Cleveland for five players — controversial at the time.",
      "Von Hayes has settled in as one of Philadelphia's better hitters.",
      "Hayes can play multiple positions — first base or the outfield.",
      "Von Hayes was born in Stockton, California.",
      "He's developing into exactly the kind of run-producer the Phillies envisioned.",
    ],
  },
  "Glenn Wilson": {
    lines: [
      "Glenn Wilson possesses one of the strongest throwing arms in the National League.",
      "Wilson was acquired from Detroit before the season.",
      "Glenn Wilson has been a very pleasant surprise for the Phillies offense.",
      "Few outfielders can match Glenn Wilson's throwing arm — runners must respect it.",
      "Wilson was born in Baytown, Texas.",
      "Glenn Wilson hustles on every single play.",
    ],
  },
  "Garry Maddox": {
    lines: [
      "Two-thirds of the world is covered by water, Harry. The other third is covered by Garry Maddox.",
      "Maddox won eight consecutive Gold Gloves in center field.",
      "Garry Maddox may be the finest defensive center fielder in the National League.",
      "Hard to believe, Harry — how Garry Maddox covers that outfield.",
      "Maddox has been the defensive anchor of this outfield for years.",
      "Garry Maddox served in Vietnam before his baseball career.",
      "Eight consecutive Gold Gloves — that tells you everything about Garry Maddox.",
    ],
  },
  "Kent Tekulve": {
    lines: [
      "Kent Tekulve throws from a submarine delivery — completely unique in professional baseball.",
      "Tekulve came over from Pittsburgh where he was part of the We Are Family Pirates.",
      "The submarine delivery is nearly impossible to emulate — Tekulve is one of a kind.",
      "Teke's sinker comes at such an unusual angle that hitters rarely square it up.",
      "Kent Tekulve has pitched in over 800 major league games in his career.",
      "The submarine delivery puts stress on the arm — yet Tekulve has pitched for years.",
    ],
  },
  "Al Holland": {
    lines: [
      "Al Holland emerged as one of the National League's finest closers in 1983.",
      "Holland goes by 'Mr. T' — a reference that will not be lost on anyone who's seen him.",
      "Al Holland: the mohawk, the fastball, and the composure. The original Mr. T of baseball.",
      "Holland was dominant closing games for this Phillies club.",
    ],
  },
  "Ozzie Virgil Jr.": {
    lines: [
      "Ozzie Virgil Jr. is the son of former major leaguer Ozzie Virgil Sr.",
      "Young Virgil has emerged as one of the more dangerous power-hitting catchers in the National League.",
      "Ozzie Virgil Jr. was born in Mayagüez, Puerto Rico.",
      "Virgil combined with Carlton and the staff to form an effective battery this season.",
    ],
  },
  "Jeff Stone": {
    lines: [
      "Jeff Stone has hit over .360 since arriving — an extraordinary showing.",
      "Stone's speed is his calling card — few players get from the batter's box to first as quickly.",
      "Hard to believe, Harry — the numbers Jeff Stone has put up since joining the club.",
      "Jeff Stone grew up in Kennett, Missouri.",
    ],
  },
  "Paul Owens": {
    lines: [
      "Paul Owens — 'The Pope' — has been a fixture in the Philadelphia organization for decades.",
      "Paul Owens managed this team to the 1983 pennant.",
      "Owens took over the managerial duties from Pat Corrales in 1983 and guided the club to the World Series.",
    ],
  },
};