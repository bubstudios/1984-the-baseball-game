// Vin Scully & Ross Porter / Jerry Doggett commentary for Dodgers home games
// Frequency: 40% player story, 25% baseball, 15% stats, 10% stadium/weather, 8% history, 2% Vin gems

const POOLS = {
  story: {
    weight: 40,
    lines: [
      // Vin weaving biographies into the game
      "\"His father was a mechanic. Worked the late shift, but never missed a game.\"",
      "\"He grew up in a small farming town you've probably never heard of. Population about 800.\"",
      "\"His mother worked three jobs after his father passed. She's in the stands somewhere tonight.\"",
      "\"He was a star quarterback in high school, believe it or not. Could have gone either way.\"",
      "\"His first baseball glove was a hand-me-down from his older brother. Still has it in his garage.\"",
      "\"His high school coach told him he was too small. He carries that conversation with him every day.\"",
      "\"Grew up listening to Dodgers games on a transistor radio under his pillow.\"",
      "\"His favorite player as a kid wasn't a Dodger - it was Roberto Clemente. He still wears a wristband with Clemente's number.\"",
      "\"He spends his winters volunteering at children's hospitals. Never wants any publicity for it.\"",
      "\"A very quiet young man. Lets his bat do the talking.\"",
      "\"His wife is expecting their first child next month. It's been on his mind all season.\"",
      "\"He proposed to her right over there, by the left field foul pole, during batting practice. She said yes.\"",
      "\"He's the first member of his family to graduate from college. His parents couldn't be prouder.\"",
      "\"He grew up playing on dirt fields with no grass. Had to learn to field bad hops or go home bruised.\"",
      "\"His father used to throw him batting practice after working a twelve-hour shift. Just the two of them under the lights.\"",
      "\"He wrote a letter to the Dodgers when he was twelve, asking for a tryout. They wrote back, politely, but he kept that letter.\"",
      "\"He's fluent in three languages. Teammates say he's the unofficial interpreter for half the clubhouse.\"",
      "\"His grandmother raised him. She's 92 now and still watches every game on television.\"",
      "\"He grew up in Brooklyn. His whole family were Dodgers fans, even after the move.\"",
      "\"He was cut from his freshman baseball team. Made the varsity as a sophomore and never looked back.\"",
      "\"His favorite subject in school was history. Still reads biographies of presidents in the clubhouse.\"",
      "\"He carries a small notebook everywhere. Writes down observations about pitchers he faces. Has notebooks going back five years.\"",
      "\"He worked construction every summer through college. Says it taught him more about life than any classroom.\"",
      "\"A favorite among his teammates. They say he's the first one at the park and the last one to leave.\"",
      "\"His high school retired his number. He went back for the ceremony last winter.\"",
      "\"He played four sports growing up. His mother finally told him he had to pick one or she'd go broke buying equipment.\"",
      "\"He still returns home every offseason. Coaches Little League for the same team he played on as a kid.\"",
      "\"His father worked construction in Bakersfield. Every Saturday they'd drive three hours just to see a Dodgers game.\"",
      "\"One of the nicest young men you'll ever meet. Sends handwritten thank-you notes to the clubhouse staff after every season.\"",
      "\"He grew up idolizing Sandy Koufax. Has a signed baseball in a glass case at home. Won't let anyone touch it.\"",
    ],
  },
  baseball: {
    weight: 25,
    lines: [
      // Vin's calm, poetic baseball calls
      "\"A high fly ball to left, Guerrero drifting back...\"",
      "\"Way back toward the warning track...\"",
      "\"She is gone!\"",
      "\"Home run.\"",
      "\"Into the pavilion.\"",
      "\"He hit that one a country mile.\"",
      "\"That ball is long gone.\"",
      "\"The Dodgers take the lead.\"",
      "\"And the crowd rises as one.\"",
      "\"A magnificent swing.\"",
      // Pitching duel observations
      "\"Runs are proving difficult to come by tonight.\"",
      "\"Neither club has solved the opposing pitcher.\"",
      "\"A well-pitched ballgame here at Chavez Ravine.\"",
      "\"The tension beginning to build with every pitch.\"",
      "\"Every pitch takes on greater importance now.\"",
      "\"This is as crisp a ballgame as you'll see all year.\"",
      "\"Both pitchers are painting the corners tonight.\"",
      // Vin's understated defensive praise
      "\"What a play - and he makes it look easy.\"",
      "\"Magnificent.\"",
      "\"Beautifully done.\"",
      "\"That saves a run - and possibly a ballgame.\"",
      "\"Simply outstanding.\"",
      "\"And a tip of the cap from the pitcher.\"",
      "\"That's a play worthy of Gold Glove consideration.\"",
      // General Vin delivery
      "\"A little roller up the middle - the shortstop has a long way to go...\"",
      "\"And the runners will hold.\"",
      "\"Two down now.\"",
      "\"The crowd here at Dodger Stadium, on its feet.\"",
      "\"The Dodgers have six hits - half a dozen in all.\"",
      "\"Three runs on half a dozen hits.\"",
      "\"Only two baserunners thus far.\"",
      "\"A quiet afternoon offensively for both clubs.\"",
    ],
  },
  stats: {
    weight: 15,
    lines: [
      // Ross Porter / Vin stats style
      "\"That's his twelfth double of the season.\"",
      "\"Batting .318 against left-handed pitching.\"",
      "\"Three runs batted in over his last two games.\"",
      "\"His fourth home run this month.\"",
      "\"The Dodgers are 15-and-8 in one-run games this season.\"",
      "\"He's hitting .342 with runners in scoring position.\"",
      "\"Seven strikeouts through five innings of work.\"",
      "\"The opposition is just one-for-twelve with runners on base.\"",
      "\"That's his 27th RBI - second on the club.\"",
      "\"A dozen home runs now for the young man.\"",
      "\"He's reached base safely in 18 consecutive games.\"",
      "\"The bullpen has thrown eight and a third scoreless innings this homestand.\"",
      "\"He's struck out the side twice tonight.\"",
      "\"This is his fourth complete game of the season.\"",
      "\"He's thrown 104 pitches - 68 of them for strikes.\"",
      "\"The Dodger pitching staff leads the National League in ERA.\"",
    ],
  },
  stadium: {
    weight: 10,
    lines: [
      "\"Another beautiful evening in Los Angeles.\"",
      "\"The shadows beginning to creep across the infield.\"",
      "\"The sun slowly disappearing behind the grandstand.\"",
      "\"Not much breeze tonight.\"",
      "\"Perfect baseball weather at Chavez Ravine.\"",
      "\"The San Gabriel Mountains painted in shades of purple and gold beyond the outfield.\"",
      "\"A picture-postcard evening here at Dodger Stadium.\"",
      "\"The crowd of forty-five thousand settling in for what promises to be a fine ballgame.\"",
      "\"The flags are perfectly still above the outfield pavilion.\"",
      "\"The sky is just beginning to show the first hint of sunset.\"",
      "\"The pavilions are full - the left field crowd on their feet.\"",
      "\"A Dodger Dog in one hand, a scorecard in the other - that's summer in Los Angeles.\"",
      "\"The grass as green as you'll see anywhere - the grounds crew takes tremendous pride in this field.\"",
      "\"You can see the stars starting to come out over the mountains. Just a magical place to watch a ballgame.\"",
    ],
  },
  history: {
    weight: 8,
    lines: [
      "\"I remember Sandy Koufax telling me once that the only thing he feared was the hitter guessing right.\"",
      "\"Jackie Robinson's number 42 is retired by every team, but it means a little more here in Los Angeles.\"",
      "\"The Dodgers have a rich history of great pitching - from Drysdale to Koufax to Hershiser.\"",
      "\"Kirk Gibson's home run in the World Series - I can still see it. I can still hear this crowd.\"",
      "\"Fernandomania swept this city in 1981. You couldn't walk down the street without seeing a Fernando jersey.\"",
      "\"Walter Alston managed this club for 23 years. Quiet man. Quiet leader. Tremendous success.\"",
      "\"The Dodgers and Giants have been doing this since New York. Some rivalries never fade.\"",
      "\"Maury Wills stole 104 bases in 1962. Changed the way the game was played.\"",
      "\"This franchise was built on pitching, defense, and speed - the Dodger Way.\"",
      "\"Roy Campanella used to say you have to be a man to play this game, but you have to have a lot of little boy in you too.\"",
      "\"I've been doing this a long time - and I've never seen a player quite like him.\"",
      "\"Baseball has given us so many wonderful moments in this old ballpark.\"",
      "\"Don Drysdale would have loved watching this pitcher work. Cut from the same cloth.\"",
      "\"The Dodgers once had four different pitchers win 20 games in a single season. Think about that.\"",
      "\"I called a game here once where the temperature was 102 degrees at first pitch. The fans brought ice packs and stayed all nine.\"",
    ],
  },
  gems: {
    weight: 2,
    lines: [
      "\"Pull up a chair, folks. This is going to be a good one.\"",
      "\"Let me tell you a little story about this young man...\"",
      "\"Baseball has a wonderful way of surprising you.\"",
      "\"You just never know - and isn't that the beauty of it?\"",
      "\"And isn't that what makes this game so special?\"",
      "\"In a year that has been so improbable, the impossible has happened.\"",
      "\"There are moments in baseball that transcend the game itself. This might be one of them.\"",
      "\"The greatest thing about baseball is that you never run out of time. There's no clock. The game will wait for the drama.\"",
      "\"Every player out there has a story. Every single one. And if you listen long enough, the game will tell you that story.\"",
      "\"Some nights, baseball gives you a gift. A moment you'll carry with you for the rest of your life. This could be one of those nights.\"",
      "\"I've called over 5,000 baseball games. And I'll tell you - there's still nothing quite like a close game in the late innings.\"",
      "\"The crack of the bat, the roar of the crowd - it's the soundtrack of summer in Los Angeles.\"",
      "\"If you're just joining us, you've picked a wonderful night for baseball.\"",
      "\"There's no place I'd rather be than right here, right now, watching this ballgame with you.\"",
      "\"Baseball reminds us that patience is rewarded. Sometimes you wait three hours for one perfect moment - and it's worth every second.\"",
    ],
  },
};

export function pickVinLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) {
      return pool.lines[Math.floor(Math.random() * pool.lines.length)];
    }
  }
  return POOLS.story.lines[0];
}