// Harry Caray & Steve Stone commentary for Cubs home games
// Frequency weights: 60% baseball, 20% birthday, 10% weather, 5% food, 4% Steve, 1% bizarre

const POOLS = {
  baseball: {
    weight: 60,
    lines: [
      // Harry general
      "Harry: \"This kid's got a beautiful swing, Steve. Just beautiful.\"",
      "Harry: \"You know, I love a good fastball. Nothing fancy. Just here it is, hit it.\"",
      "Harry: \"Steve, that was a Major League pitch right there.\"",
      "Harry: \"Baseball's the greatest game in the world, and don't let anyone tell you different.\"",
      "Harry: \"Cubs baseball — there's nothing like it anywhere.\"",
      "Harry: \"Let me tell you something about this ballpark. There's magic in these bricks.\"",
      "Harry: \"I've been doing this a long time, and I still get excited for a 3-2 pitch.\"",
      // Harry on players
      "Harry: \"Now THAT'S a ballplayer, Steve. That guy could play on my team any day.\"",
      "Harry: \"You know what I like about this kid? He hustles. First to third, doesn't think twice.\"",
      "Harry: \"He's got that look in his eye. That's the look of a hitter who's seeing the ball.\"",
      "Harry: \"I'll tell you what — that's a professional at-bat.\"",
      "Harry: \"This guy could hit with a toothpick. Doesn't matter what you throw.\"",
      // Harry on fans
      "Harry: \"Look at this crowd! Look at 'em! They're on their feet!\"",
      "Harry: \"The Bleacher Bums are awake now, Steve. You hear that?\"",
      "Harry: \"These fans deserve a winner. They've been coming here for generations.\"",
      "Harry: \"That's why you come to the ballpark — for moments like this.\"",
      // Steve analysis
      "Steve: \"He spotted that fastball perfectly on the outside corner.\"",
      "Steve: \"The late movement on that pitch — that's what makes it so effective.\"",
      "Steve: \"Watch how he stayed inside the baseball. Textbook.\"",
      "Steve: \"That's the third straight breaking ball. He's setting something up.\"",
      "Steve: \"Good pitch sequence. Kept him off balance.\"",
      "Steve: \"He never picked up the rotation. That's why he was late.\"",
      "Steve: \"The change of speeds there was the key. Ninety-four then seventy-eight.\"",
      "Steve: \"You can't teach that kind of plate discipline. He just doesn't chase.\"",
      "Steve: \"That's what happens when you're behind in the count.\"",
      "Steve: \"The hitter was guessing fastball and got a slider.\"",
      // Steve on defense
      "Steve: \"Textbook turn. You won't see it done any better.\"",
      "Steve: \"That's a pitcher's best friend right there — the ground ball double play.\"",
      "Steve: \"Good read off the bat. That's instinct — you can't coach that.\"",
      // Steve on homers
      "Steve: \"That ball was gone immediately. No doubt off the bat.\"",
      "Steve: \"He got every bit of it. That's out of any ballpark.\"",
      // Harry reacting to Steve
      "Harry: \"Steve knows what he's talking about, folks. He pitched in the big leagues.\"",
      "Harry: \"I love when Steve breaks it down like that. Makes me feel smarter.\"",
      "Harry: \"See, that's why I keep him around.\"",
      "Steve: \"He pays me in hot dogs.\"",
      "Harry: \"That's not true.\"",
      "Steve: \"It's partially true.\"",
    ],
  },
  birthday: {
    weight: 20,
    lines: [
      "Harry: \"And a happy birthday to Mary Jo McGuire from Skokie. She's 98 years young today!\"",
      "Harry: \"Tom and Betty out in section 212 — forty-two years of marriage. Congratulations!\"",
      "Harry: \"Little Bobby Jenkins turns 8 years old today. Happy birthday, Bobby!\"",
      "Harry: \"A birthday greeting to Frank in Rockford. Number 73 today. Holy cow!\"",
      "Harry: \"Margaret from Des Plaines is celebrating her 91st birthday with us. God bless you, Margaret!\"",
      "Harry: \"The Kowalski family is here — three generations of Cubs fans. That's what it's all about.\"",
      "Harry: \"Happy anniversary to Joe and Rita in the upper deck. Thirty years!\"",
      "Harry: \"Somebody named Patty from Schaumburg is turning 40, and she's spending it at Wrigley. Smart woman.\"",
      "Harry: \"A birthday wish to Dominic in the left field bleachers — 12 years old!\"",
      "Harry: \"And hello to Steve from Joliet.\"",
      "Steve: \"That's all we know about Steve.\"",
      "Harry: \"That's all I know about Steve.\"",
      "Harry: \"Happy birthday to Nancy on the third base side. She's not telling me how old.\"",
      "Steve: \"Smart move, Nancy.\"",
      "Harry: \"And a very happy birthday to my producer Arne. He's probably not listening.\"",
      "Harry: \"Someone named Bill from Naperville is here. Bill, wave to the booth.\"",
      "Steve: \"Is he waving?\"",
      "Harry: \"I can't tell. There's 35,000 people here.\"",
    ],
  },
  weather: {
    weight: 10,
    lines: [
      "Harry: \"Flags are dancing today, Steve.\"",
      "Harry: \"The wind is blowing out. Or maybe in.\"",
      "Steve: \"It's blowing out, Harry.\"",
      "Harry: \"I knew it was one of those two.\"",
      "Harry: \"Boy, it's a hot one out there. Hotter than the hot dog grill.\"",
      "Harry: \"Perfect day for baseball. Not a cloud in the sky.\"",
      "Harry: \"The wind is doing something strange out there. The flags say one thing, the flag says another.\"",
      "Steve: \"That's the same flag, Harry.\"",
      "Harry: \"Then it's confused.\"",
      "Harry: \"A little breeze coming in off the lake. That'll knock down anything hit to left.\"",
      "Harry: \"The sun is brutal in the bleachers today. Hope those folks brought sunscreen.\"",
      "Harry: \"It's one of those days where the ball just jumps off the bat. The air is thin.\"",
      "Steve: \"That's not really how it works, Harry.\"",
      "Harry: \"Well, it sounds good.\"",
      "Harry: \"Beautiful sunshine. Not too hot, not too cold. This is baseball weather.\"",
      "Harry: \"If you're at the game today, stay hydrated. I'm taking my own advice.\"",
      "Steve: \"Is that water?\"",
      "Harry: \"It's definitely a liquid.\"",
    ],
  },
  food: {
    weight: 5,
    lines: [
      "Harry: \"Now THAT'S a hot dog inning.\"",
      "Harry: \"Looks like a mustard crowd today.\"",
      "Harry: \"Steve, you're a ketchup guy, aren't you?\"",
      "Steve: \"I don't trust ketchup on a hot dog.\"",
      "Harry: \"See? Steve knows. Never put ketchup on a hot dog.\"",
      "Harry: \"You know what goes with baseball? A cold beer.\"",
      "Harry: \"I had two bratwursts before the game. Might regret it by the seventh.\"",
      "Harry: \"You ever eat a bratwurst before breakfast?\"",
      "Steve: \"I can't say that I have.\"",
      "Harry: \"I have. More than once.\"",
      "Harry: \"The Italian beef sandwich here at Wrigley — now that's a meal.\"",
      "Harry: \"I'm thinking about hot dogs. Not for any particular reason.\"",
      "Harry: \"How many hot dogs could you eat during a doubleheader, Steve?\"",
      "Steve: \"I've never actually counted.\"",
      "Harry: \"That sounds like an answer from a man who's counted.\"",
      "Harry: \"The peanuts are fresh today. I can smell 'em from here.\"",
      "Harry: \"Beer man's coming down the aisle. That's the most important guy in the ballpark.\"",
    ],
  },
  steve: {
    weight: 4,
    lines: [
      "Harry: \"Steve, how hard is it to hit a curveball?\"",
      "Steve: \"The baseball answer or the honest answer?\"",
      "Harry: \"Give me both.\"",
      "Harry: \"Steve, could you hit this guy?\"",
      "Steve: \"I was a pitcher, Harry.\"",
      "Harry: \"So that's a no?\"",
      "Steve: \"That's a definitely no.\"",
      "Harry: \"Steve, why don't more pitchers throw knuckleballs?\"",
      "Steve: \"Because it's impossible to control and it destroys your fingernails.\"",
      "Harry: \"Fair enough.\"",
      "Harry: \"Steve, how many gloves did you have when you played?\"",
      "Steve: \"Maybe three or four a season.\"",
      "Harry: \"I would've had a dozen. You can never have too many gloves.\"",
      "Harry: \"Steve, could a really good college team beat a bad Major League team?\"",
      "Steve: \"Harry, I don't think that's in the scouting report.\"",
      "Harry: \"I'm just curious.\"",
      "Harry: \"Steve, what's the strangest thing you ever saw in a bullpen?\"",
      "Steve: \"I can't tell that story on the air.\"",
      "Harry: \"Now I really want to know.\"",
      "Harry: \"Steve, how much spit is actually involved in a spitball?\"",
      "Steve: \"More than you'd think and less than you'd hope.\"",
      "Harry: \"That's a great answer.\"",
      "Harry: \"Steve, if a seagull grabbed the ball mid-flight, what's the ruling?\"",
      "Steve: \"I genuinely don't know.\"",
      "Harry: \"Me neither. But I'd love to see it.\"",
    ],
  },
  bizarre: {
    weight: 1,
    lines: [
      "Harry: \"If the moon were made of ribs, would you eat it?\"",
      "Steve: \"I — what?\"",
      "Harry: \"I know I would.\"",
      "Harry: \"Do you think dogs enjoy baseball?\"",
      "Steve: \"I've never considered that.\"",
      "Harry: \"I bet some do. The smart ones.\"",
      "Harry: \"Holy cow.\"",
      "Harry: \"That reminds me of a guy I knew in St. Louis.\"",
      "Steve: \"Should we stay with the game?\"",
      "Harry: \"This has absolutely nothing to do with baseball.\"",
      "Harry: \"Have you ever noticed pigeons always face into the wind?\"",
      "Steve: \"I have not noticed that, no.\"",
      "Harry: \"Well, they do. I've been watching.\"",
      "Harry: \"Steve, do fish sleep?\"",
      "Steve: \"I don't think so.\"",
      "Harry: \"That's a serious question.\"",
      "Steve: \"I don't have a serious answer.\"",
      "Harry: \"I wonder if any of the players have ever thought about being a mailman.\"",
      "Steve: \"Probably not during the game, Harry.\"",
      "Harry: \"You'd be surprised what players think about during a game.\"",
      "Harry: \"I had a dream last night that I was playing shortstop. I made three errors and woke up exhausted.\"",
      "Steve: \"Let's go back to the baseball.\"",
    ],
  },
};

// Pick a random line from the weighted pool distribution
export function pickHarryLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) {
      const lines = pool.lines;
      // For multi-line banter, pick a starting point and return paired lines
      // Multi-line entries are grouped: lines with "Harry:" followed by "Steve:" etc
      return lines[Math.floor(Math.random() * lines.length)];
    }
  }
  return POOLS.baseball.lines[0];
}

// Check if a line has a follow-up (multi-part banter)
export function getHarrySequence(startLine) {
  // Look for this line's index and see if the next line is a response
  for (const pool of Object.values(POOLS)) {
    const idx = pool.lines.indexOf(startLine);
    if (idx >= 0 && idx < pool.lines.length - 1) {
      const next = pool.lines[idx + 1];
      // If next line is a response to current speaker
      if ((startLine.startsWith('Harry:') && next.startsWith('Steve:')) ||
          (startLine.startsWith('Steve:') && next.startsWith('Harry:'))) {
        return [startLine, next];
      }
    }
  }
  // Check if line ends with a question mark and next line is a response
  for (const pool of Object.values(POOLS)) {
    const idx = pool.lines.indexOf(startLine);
    if (idx >= 0 && idx < pool.lines.length - 1) {
      const next = pool.lines[idx + 1];
      if (startLine.includes('?') && (next.startsWith('Steve:') || next.startsWith('Harry:'))) {
        return [startLine, next];
      }
    }
  }
  return [startLine];
}