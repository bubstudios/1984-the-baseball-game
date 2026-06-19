// Yankees Broadcast — Phil Rizzuto, Frank Messer, Bill White
// Generic pool — no player-specific lines
// Use pickYankeesPlayerLine() for contextual player flavor

export function pickYankeesLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.gameCall.lines[0];
}

export function pickYankeesPlayerLine(playerName) {
  const map = {
    "Don Mattingly": ["Sweet swing. Sweetest swing in the American League.", "One of the best young hitters in baseball — Don Mattingly.", "He rarely gives away an at-bat. That's Donnie Baseball.", "Beautiful stroke. Just a beautiful stroke.", "A line-drive hitter. Doesn't try to lift the ball — just barrels it up.", "Donnie Baseball delivers again. He's something special."],
    "Dave Winfield": ["A tremendous athlete. Dave Winfield could have played any sport.", "Power to all fields — that's what makes Winfield so dangerous.", "Strong throwing arm. You don't run on Dave Winfield.", "One of the game's premier players, no question.", "Dangerous every trip to the plate. The pitcher knows it."],
  };
  const lines = map[playerName];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

const POOLS = {
  gameCall: { weight: 40, lines: [
    "\"One away.\"", "\"Runner on first.\"", "\"Nicely done.\"", "\"Good piece of hitting.\"",
    "\"A sharp single to right field.\"", "\"Deep to left field — way back — it is gone! A home run.\"",
    "\"The Yankees lead.\"", "\"Two down now.\"", "\"Here's the 3-2 pitch...\"",
    "\"Ground ball to short — over to first — in time.\"", "\"Line drive — base hit.\"",
    "\"Popped up — infield fly rule is in effect.\"", "\"Strike three called — he got him looking.\"",
    "\"And the inning is over.\"", "\"A well-played game so far.\"", "\"The pitcher is really dealing tonight.\"",
    "\"He's been outstanding through six innings.\"", "\"The Yankees go down in order.\"",
    "\"A long fly ball — the outfielder drifts back — makes the catch.\"",
    "\"The runner tags and scores — a sacrifice fly.\"", "\"And that'll be a double down the line.\"",
    "\"Three up, three down.\"", "\"The Yankees have something going here.\"", "\"A base hit drives in a run.\"",
  ]},
  analysis: { weight: 25, lines: [
    "\"The pitcher got ahead early — that's the key.\"", "\"Everything starts with strike one.\"",
    "\"Excellent location — right on the corner.\"", "\"Good fastball command.\"",
    "\"He stayed back nicely on that pitch. Didn't try to do too much.\"",
    "\"Used the whole field — that's a professional hitter.\"",
    "\"He didn't try to pull it. Let the pitch travel and went the other way.\"",
    "\"The pitcher has to establish the inside part of the plate.\"",
    "\"If you can't throw inside, the hitter owns the outer half.\"",
    "\"That's a veteran move — he knew what was coming.\"",
    "\"Good at-bat. Made the pitcher work.\"", "\"He's seeing the ball well tonight. Very dangerous.\"",
    "\"The pitcher is changing speeds effectively.\"", "\"You don't want to fall behind a hitter like this.\"",
    "\"He's got a lot of movement on that fastball.\"", "\"The breaking ball isn't there tonight.\"",
    "\"Smart pitching. Kept the ball down in the zone.\"", "\"He's a tough out. Doesn't give away at-bats.\"",
    "\"The approach has to be: don't let him beat you.\"", "\"That's just good fundamental baseball.\"",
  ]},
  tradition: { weight: 20, lines: [
    "\"The Yankees are never out of it. Never have been.\"",
    "\"This club expects to win every time they take the field.\"",
    "\"That's Yankee baseball — that's what this organization is all about.\"",
    "\"They've seen this situation before. This team doesn't panic.\"",
    "\"A veteran ballclub. They know what it takes.\"", "\"The crowd here at Yankee Stadium expects a winner.\"",
    "\"You look at the pennants, the retired numbers — this is a special place.\"",
    "\"The ghosts of Yankee Stadium have seen a lot of baseball.\"",
    "\"This franchise doesn't rebuild. They reload.\"", "\"The Yankees are always in the conversation.\"",
    "\"A good crowd at Yankee Stadium tonight. They know their baseball.\"",
    "\"The fans appreciate the effort — but they want results.\"",
    "\"They're getting restless in the stands. This is New York — patience is not a virtue here.\"",
    "\"The Yankees need something here. The crowd can feel it.\"",
    "\"There's an expectation that comes with wearing the pinstripes.\"",
    "\"Monument Park out beyond the center field fence — Ruth, Gehrig, DiMaggio, Mantle. That's a lot of history.\"",
    "\"You walk into this ballpark and you feel the weight of what's happened here.\"",
    "\"Twenty-two World Championships — more than any franchise in sports.\"",
    "\"The Bleacher Creatures are getting loud in right field. They don't sit down.\"",
  ]},
  scooter: { weight: 10, lines: [
    "\"Holy cow!\"", "\"Would ya believe it?\"", "\"I tell ya.\"", "\"What a ballgame.\"", "\"Boy oh boy.\"",
    "\"That reminds me — I gotta call my brother.\"", "\"Did you see that fellow behind home plate? Terrific hat.\"",
    "\"That's a beautiful shirt. Where do you even buy a shirt like that?\"",
    "\"I had a sandwich just like that once. Pastrami. Very good.\"",
    "\"Looks like traffic on the Major Deegan today. Hope you brought a book.\"",
    "\"You know what I love about this ballpark? The hot dogs. Best hot dogs in baseball.\"",
    "\"I knew a guy who caught a foul ball once. Kept it in his freezer for twenty years.\"",
    "\"My wife Cora is probably watching right now. Hi, Cora!\"",
    "\"Frank, did you see that? I missed it.\"", "\"Bill, help me out here — what just happened?\"",
    "\"I remember a play like that in 1951. Or maybe it was '52. One of the two.\"",
    "\"That ball took a funny hop. I don't like funny hops.\"",
    "\"You know who was great at that? Billy Martin. Billy was something else.\"",
    "\"Baseball is a funny game. I've been around it sixty years and it still surprises me.\"",
  ]},
  birthdays: { weight: 4, lines: [
    "\"Happy birthday to Joey from Yonkers. Joey's eight years old today.\"",
    "\"Mary turns 84 today. That's a lot of candles, Mary.\"",
    "\"Hope they're watching from home. Congratulations from all of us.\"",
    "\"We got a birthday in section 14 — Anthony from the Bronx. Happy birthday, Anthony.\"",
    "\"Somebody's holding up a sign behind the dugout — I can't quite read it. Probably a birthday.\"",
    "\"I see a lot of people celebrating something back there. Could be a birthday. Could be an anniversary. Good for them.\"",
    "\"Happy birthday to Mrs. Rizzuto's cousin's neighbor. I promised I'd mention him.\"",
  ]},
  distraction: { weight: 1, lines: [
    "\"You know what sounds good right now? Cannoli. A nice fresh cannoli.\"",
    "\"I haven't had lunch yet. Is it lunchtime? What time is it?\"",
    "\"Boy, am I hungry. Frank, you got anything to eat over there?\"",
    "\"I got mustard on my scorecard. How am I supposed to keep score like this?\"",
    "\"Where am I on this scorecard? I lost track three innings ago.\"",
    "\"I missed two batters. Who's up? Never mind, I'll figure it out.\"",
    "\"That reminds me of Newark. I don't know why.\"",
    "\"Never mind. I forgot what I was going to say.\"",
    "\"Frank, what inning is this? I'm not kidding.\"",
    "\"Holy cow, would ya look at that. I have no idea what I'm looking at, but look at it.\"",
    "\"I can't read my own writing. I need a new scorecard.\"",
    "\"Frank, help me out. Who was that again?\"",
    "\"You ever walk around the Bronx after a game? I got lost once. Took me two hours to find my car.\"",
  ]},
};