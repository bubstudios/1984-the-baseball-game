// Mets Broadcast — Ralph Kiner, Tim McCarver, Bob Murphy
// 35% strategy, 25% Murph optimism, 20% future stars, 15% Kiner stories, 4% name confusion, 1% legendary

const POOLS = {
  strategy: {
    weight: 35,
    lines: [
      // Tim McCarver: pitch sequences, catcher strategy, hitter psychology
      "\"He set him up beautifully — fastball inside, then went away with the breaking ball.\"",
      "\"That fastball was established earlier in the count. Now the hitter has to respect it.\"",
      "\"The hitter was looking for something else entirely.\"",
      "\"That's catcher and pitcher working together right there.\"",
      "\"You establish the inside part of the plate, and everything else opens up.\"",
      "\"The pitcher never got ahead in the count — and that's when trouble starts.\"",
      "\"A professional at-bat. He refused to chase.\"",
      "\"He was looking for that pitch. You could see it in his stance.\"",
      "\"The count favored the hitter there. Pitcher had to come in.\"",
      "\"That's what a veteran catcher brings — he knows what pitch to call and when.\"",
      "\"The changeup is most effective when the hitter doesn't see it coming. He saw it coming.\"",
      "\"You don't want to fall behind this lineup. They'll make you pay.\"",
      "\"Good sequencing — he's kept the hitter off balance all at-bat.\"",
      "\"That started with a mistake — and this lineup doesn't miss mistakes.\"",
      "\"Location over velocity. You can throw 95, but if it's over the middle, it's going a long way.\"",
      "\"He's pitching backward today — breaking balls early, fastballs late in the count.\"",
      "\"The hitter guessed fastball and got a slider. That's a helpless feeling.\"",
      "\"This is where the game gets interesting — the chess match between pitcher and hitter.\"",
      "\"Good pitch selection wins ballgames. Bad pitch selection ends careers.\"",
      "\"Two strikes — you expand the zone. But not too far. This hitter knows the strike zone.\"",
      "\"The catcher set up outside, the pitcher missed inside — and that's the difference between an out and a hit.\"",
    ],
  },
  optimistic: {
    weight: 25,
    lines: [
      // Bob Murphy: relentlessly optimistic, always finds the silver lining
      "\"A beautiful afternoon for baseball here at Shea.\"",
      "\"Good crowd on hand today — the fans are ready for something special.\"",
      "\"The Mets have something working here. You can feel it.\"",
      "\"You never know in this game. That's what makes it wonderful.\"",
      "\"Still plenty of baseball left, folks.\"",
      "\"Fasten your seat belts — this one isn't over yet.\"",
      "\"Things are getting interesting now.\"",
      "\"The crowd senses an opportunity.\"",
      "\"These fans have been through a lot. They deserve a good season.\"",
      "\"You get the feeling something big is about to happen.\"",
      "\"The energy in this ballpark is electric tonight.\"",
      "\"This is what baseball is all about — a tight game in the late innings.\"",
      "\"Anything can happen — and usually does at Shea Stadium.\"",
      "\"The Mets are making things happen. That's good baseball.\"",
      "\"Hard not to get excited about what's going on here.\"",
      "\"The crowd is getting into it now — they smell a rally.\"",
      "\"You can't keep this team down for long.\"",
      "\"These young players don't know they're supposed to lose.\"",
    ],
  },
  youngStars: {
    weight: 20,
    lines: [
      // 1984 Mets: Gooden, Strawberry, Hernandez — something was building
      "\"That young man throws awfully hard. Nineteen years old and he's already got the league's attention.\"",
      "\"The future is bright for this young pitcher.\"",
      "\"He's only getting started. Wait until he really figures it out.\"",
      "\"Special talent — you don't see arms like that very often.\"",
      "\"Tremendous power. The ball just jumps off his bat.\"",
      "\"Natural hitter. He's going to hit a lot of home runs before he's done.\"",
      "\"A professional hitter if there ever was one. He's a joy to watch.\"",
      "\"One of the finest defensive first basemen I've ever seen play this game.\"",
      "\"A leader on this club. He sets the tone for the whole lineup.\"",
      "\"You look at this young core and you can't help but think about what's coming.\"",
      "\"This team is going to be very good. Maybe not this year, but soon.\"",
      "\"The kids can play. They just need a little time to figure it out at this level.\"",
      "\"That's a future All-Star right there — you can write it down.\"",
      "\"He doesn't play like a rookie. There's a maturity to his game.\"",
      "\"Watch this kid. In a couple years, everybody's going to know his name.\"",
      "\"This is the most exciting young team in baseball — you can quote me on that.\"",
      "\"They're putting the pieces together. Patience, Mets fans. Patience.\"",
    ],
  },
  kinerStory: {
    weight: 15,
    lines: [
      // Ralph Kiner: old baseball stories, rambling about former players
      "\"That reminds me of a fellow I played with in Pittsburgh...\"",
      "\"Back in 1949, we had a pitcher who threw nothing but fastballs. Didn't even own a glove.\"",
      "\"I remember a game very much like this — '53, I believe. Or maybe '52.\"",
      "\"That fellow could really hit. Used a bat that looked like a toothpick.\"",
      "\"You don't see many players like that anymore. Different era.\"",
      "\"Hank Greenberg told me once — and Hank knew a thing or two about hitting...\"",
      "\"I hit 51 home runs one year. Of course, we finished last, but nobody remembers that part.\"",
      "\"Casey Stengel used to say — and I never understood half of what Casey said...\"",
      "\"The Dodgers had a kid in the 40s — could run like the wind. What was his name?\"",
      "\"I faced Bob Feller once. Once was enough.\"",
      "\"Ted Williams — now there was a hitter. He could tell you what pitch was coming before the pitcher knew.\"",
      "\"We didn't have batting gloves in my day. Calluses the size of silver dollars.\"",
      "\"Warren Spahn threw at me so often I thought it was part of his warmup routine.\"",
      "\"Stan Musial could hit .300 in a rocking chair. Natural born hitter.\"",
      "\"I once hit a home run off a pitcher who'd been dead for three years. It was a different era.\"",
      "\"They pay these kids more now than I made in my entire career. But we had more fun, I'll tell you that.\"",
      "\"The commissioner's office sent a letter to every team in '47 — 'do not throw at Kiner.' Didn't help.\"",
      "\"I led the league in home runs seven straight years. The secret is I couldn't do anything else.\"",
    ],
  },
  confusion: {
    weight: 4,
    lines: [
      // Ralph Kiner name confusion — classic malapropisms
      "\"Gary Cooper... I mean Gary Carter. Although Gary Cooper was a fine actor.\"",
      "\"Keith Strawberry — you know who I mean — tremendous power.\"",
      "\"Darryl Hernandez with the play at first.\"",
      "\"—you know the fellow I'm talking about. Tall kid. Hits left-handed.\"",
      "\"I'm sorry, I have the wrong name. There's a lot of players on both teams.\"",
      "\"What's his name — the pitcher — anyway, good fastball.\"",
      "\"I'll get the names right eventually. Baseball has too many names.\"",
      "\"Mookie Hernandez — wait, that's two different players. They're both good.\"",
      "\"The catcher — let me start over — a fine defensive play regardless of who did it.\"",
    ],
  },
  nonsense: {
    weight: 1,
    lines: [
      // Legendary Kiner nonsense — delivered with total sincerity
      "\"It's Mother's Day. Happy Birthday to all the mothers out there.\"",
      "\"I've always said that. I may never have said it before, but I've always thought it.\"",
      "\"If Casey Stengel were here, he'd probably say something I wouldn't understand.\"",
      "\"That's why they play the games. Otherwise they'd just mail in the scores.\"",
      "\"Home runs are still popular. I think they always will be.\"",
      "\"Pitching is important. I don't think anyone would disagree with that.\"",
      "\"It's generally easier to win when you score more runs than the other team.\"",
      "\"The object is to get on base. And then ideally, come around to score.\"",
      "\"Baseball is ninety percent mental. The other half is physical.\"",
      "\"Two-thirds of the Earth is covered by water. The other third is covered by Garry Maddox.\"",
      "\"Solo home runs usually come with no one on base.\"",
      "\"That's a good question. I'm glad you asked. I don't have an answer, but I'm glad you asked.\"",
    ],
  },
};

export function pickMetsLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) {
      return pool.lines[Math.floor(Math.random() * pool.lines.length)];
    }
  }
  return POOLS.strategy.lines[0];
}