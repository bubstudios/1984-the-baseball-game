// Jerry Coleman & Dave Campbell commentary for Padres home games
// Generic pool — no player-specific lines
// Use pickPadresPlayerLine() for contextual player flavor

export function pickPadresLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.baseball.lines[0];
}

// Player-specific flavor — only used when that player is at bat
export function pickPadresPlayerLine(playerName) {
  const map = {
    "Tony Gwynn": ["Nobody works harder on their craft than Tony Gwynn.", "Tony studies pitchers more than anyone in the league.", "Pick a spot — any spot — and Tony can hit it there."],
    "Steve Garvey": ["Steve Garvey — the definition of consistency.", "Garvey knows the strike zone better than the umpires."],
  };
  const lines = map[playerName];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

const POOLS = {
  baseball: {
    weight: 75,
    lines: [
      "Jerry: \"Oh, Doctor!\"",
      "Jerry: \"You can hang a star on that one, baby!\"",
      "Jerry: \"And the beat goes on.\"",
      "Jerry: \"The natives are getting restless.\"",
      "Jerry: \"The Padres put pressure on you.\"",
      "Jerry: \"They're aggressive on the bases.\"",
      "Jerry: \"They manufacture runs.\"",
      "Jerry: \"That's Padre baseball.\"",
      "Jerry: \"They'll take the extra base.\"",
      "Jerry: \"This club doesn't quit.\"",
      "Jerry: \"This is a scrappy ballclub.\"",
      "Jerry: \"That's the way you play the game right there.\"",
      "Jerry: \"Outstanding baseball from both sides tonight.\"",
      "Jerry: \"This is what makes this game so great.\"",
      "Jerry: \"You've got to love this kind of baseball.\"",
      "Jerry: \"The Friars are playing with a lot of confidence.\"",
      "Jerry: \"Every pitch matters in this ballgame.\"",
      "Jerry: \"That's heads-up baseball right there.\"",
      "Jerry: \"Good things happen when you put the ball in play.\"",
      "Jerry: \"That's a situation where both clubs would like to score.\"",
      "Jerry: \"The pitcher is ahead unless he isn't.\"",
      "Jerry: \"He's really dealing out there.\"",
      "Dave: \"Good pitch sequence there.\"",
      "Dave: \"Excellent location.\"",
      "Dave: \"That's what the count allows you to do.\"",
      "Dave: \"He stayed within himself on that swing.\"",
      "Dave: \"Got him chasing.\"",
      "Dave: \"The hitter was guessing.\"",
      "Dave: \"You don't want to fall behind this guy.\"",
      "Dave: \"Smart hitter — he waited for his pitch.\"",
      "Dave: \"That's professional hitting.\"",
      "Dave: \"He'll take that all day.\"",
      "Dave: \"Fundamentally sound baseball.\"",
      "Dave: \"That's exactly what the pitcher needed.\"",
      "Dave: \"Couldn't have worked out better.\"",
      "Dave: \"Clean turn at second.\"",
      "Dave: \"Mistake pitch.\"",
      "Dave: \"He got too much of the plate.\"",
      "Dave: \"The hitter was ready for that one.\"",
    ],
  },
  defense: {
    weight: 15,
    lines: [
      "Jerry: \"Oh, Doctor! What a play!\"",
      "Jerry: \"Oh, Doctor!\"",
      "Jerry: \"Outstanding defense!\"",
      "Jerry: \"You can hang a star on that one, baby!\"",
      "Jerry: \"A tremendous effort out there.\"",
      "Jerry: \"That'll save a run.\"",
      "Jerry: \"That's Gold Glove caliber.\"",
      "Jerry: \"The fans appreciate that one.\"",
      "Jerry: \"Absolutely robbed him!\"",
      "Jerry: \"That was a major league play.\"",
      "Jerry: \"He made that look easy.\"",
      "Dave: \"That play doesn't show up in the box score, but it should.\"",
      "Dave: \"That's a run-saving play right there.\"",
      "Dave: \"Range, instincts, arm — he's got all three.\"",
      "Dave: \"That's why you play defense.\"",
      "Dave: \"The defense has been outstanding tonight.\"",
      "Dave: \"Positioned perfectly.\"",
    ],
  },
  weather: {
    weight: 8,
    lines: [
      "Jerry: \"Another beautiful afternoon in San Diego.\"",
      "Jerry: \"Hard to beat this weather.\"",
      "Jerry: \"Not many better places to watch baseball.\"",
      "Jerry: \"Perfect baseball weather.\"",
      "Jerry: \"A great crowd at Jack Murphy Stadium.\"",
      "Jerry: \"The sun is shining on The Murph.\"",
      "Jerry: \"Just gorgeous out here.\"",
      "Dave: \"That marine layer is starting to roll in.\"",
      "Dave: \"The ball won't carry as well once the sun goes down.\"",
      "Dave: \"Classic San Diego evening — you couldn't ask for better conditions.\"",
      "Jerry: \"The breeze off the Pacific keeping things cool.\"",
      "Jerry: \"Look at that sky behind the Western Metal building. Just beautiful.\"",
      "Dave: \"Great night for baseball — the weather here is always a factor in the hitter's favor early.\"",
      "Jerry: \"We want to thank all our servicemen and women here tonight.\"",
      "Jerry: \"A big salute to the sailors from the naval base.\"",
      "Dave: \"Great crowd tonight — lots of military families in the stands.\"",
      "Jerry: \"The beach towels are out in the bleachers.\"",
      "Jerry: \"Looks like everyone brought their sunscreen today.\"",
    ],
  },
  bizarre: {
    weight: 2,
    lines: [
      "Jerry: \"Well, that's interesting.\"",
      "Dave: \"...what is, Jerry?\"",
      "Jerry: \"I haven't seen that in quite some time.\"",
      "Jerry: \"You don't draw that up.\"",
      "Jerry: \"Baseball continues to amaze me.\"",
      "Jerry: \"That ball was hit exactly where it landed.\"",
      "Dave: \"Well said, Jerry.\"",
      "Jerry: \"The Padres need a hit here.\"",
      "Dave: \"That's generally true.\"",
      "Jerry: \"That's generally helpful.\"",
      "Jerry: \"That's a situation where both clubs would like to score.\"",
      "Dave: \"...I think both clubs would always like to score, Jerry.\"",
      "Jerry: \"And the beat goes on.\"",
      "Dave: \"Yes it does, Jerry.\"",
      "Jerry: \"The pitcher is ahead unless he isn't.\"",
      "Jerry: \"The natives are getting restless.\"",
      "Dave: \"It's a close ballgame — I think that's expected.\"",
    ],
  },
};