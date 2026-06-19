// Red Sox Broadcast — Ned Martin & Bob Montgomery
// Generic pool only. Player-specific lines via pickRedSoxPlayerLine().

export function pickRedSoxLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.fundamentals.lines[0];
}

export function pickRedSoxPlayerLine(playerName) {
  const map = {
    "Jim Rice": ["One of baseball's most feared hitters — Jim Rice. Tremendous power.", "Dangerous every time up. The pitcher knows he can't afford a mistake."],
    "Dwight Evans": ["Outstanding right fielder — Dwight Evans. Strong throwing arm, and he knows how to use it.", "Excellent all-around player. Evans does everything well."],
    "Wade Boggs": ["Wade Boggs rarely strikes out. It's remarkable how consistent he is.", "A hitting machine — Boggs studies the game like a professor.", "A student of hitting. Wade Boggs approaches every at-bat with a plan."],
  };
  const lines = map[playerName];
  if (!lines) return null;
  return lines[Math.floor(Math.random() * lines.length)];
}

const POOLS = {
  fundamentals: { weight: 40, lines: [
    "\"Nicely done.\"", "\"A solid piece of hitting.\"", "\"He stayed with that pitch.\"",
    "\"That's good baseball.\"", "\"He was fooled on that one.\"", "\"Excellent pitch — never had a chance.\"",
    "\"Caught looking.\"", "\"Deep to left — that ball is gone. A long home run.\"", "\"He got all of it.\"",
    "\"A patient hitter — good strike-zone judgment.\"", "\"Uses the entire field. Professional approach.\"",
    "\"Works quickly on the mound. Changes speeds effectively.\"", "\"Gets ahead in the count. That's the foundation.\"",
    "\"Excellent command of the strike zone.\"", "\"That's a fundamentally sound play.\"",
    "\"Good baserunning — he read that ball off the bat.\"", "\"He's seeing the ball well this evening.\"",
    "\"A difficult pitch to handle — he did well just to make contact.\"",
    "\"The pitcher is locating his fastball where he wants it.\"", "\"That's how you work a count — patience rewarded.\"",
    "\"He didn't try to do too much. Smart baseball.\"", "\"Kept the ball down — that's where the outs live.\"",
    "\"Good pitch selection — kept the hitter guessing.\"",
    "\"He took what the pitcher gave him. That's a mature approach.\"",
  ]},
  fenway: { weight: 25, lines: [
    "\"Off the wall — the Monster played that one perfectly.\"",
    "\"A Fenway double. That ball would be a routine out anywhere else.\"",
    "\"The left fielder played that carom off the wall expertly.\"",
    "\"Short porch over there in right — inviting target for left-handed hitters.\"",
    "\"Pesky's Pole is just 302 feet away. That's a very short trip for a well-hit ball.\"",
    "\"The Triangle out in deep center field — a center fielder's absolute nightmare.\"",
    "\"This ballpark has a personality all its own. Every game finds a new way to surprise you.\"",
    "\"The Green Monster turns singles into doubles and doubles into singles. It has a mind of its own.\"",
    "\"That carom off the wall can be tricky — the left fielder has to know exactly what to expect.\"",
    "\"Fenway's dimensions have been confounding hitters and pitchers for over seventy years.\"",
    "\"The manual scoreboard on the Monster — still operated by hand. There's a charm to that.\"",
    "\"The bullpens out in right field — not the most comfortable place for a reliever to warm up.\"",
    "\"The shadows are getting long across the infield. The last few innings at Fenway can be challenging for hitters.\"",
    "\"No two games at Fenway are ever quite the same. The wall sees to that.\"",
    "\"The crowd is packed tight along the baselines — you're practically sitting on top of the field here.\"",
  ]},
  players: { weight: 15, lines: [
    "\"The Red Sox lineup is deep — one through nine, you have to work for every out.\"",
    "\"That young pitcher has a lively arm. The Red Sox have been developing arms well.\"",
    "\"He's hitting over .300 — quietly, as usual. That's the kind of player you appreciate more over time.\"",
    "\"The batter has a very compact swing. Not a lot of wasted movement.\"",
    "\"He's put together a very nice season. Dependable, day in and day out.\"",
    "\"You don't see many hitters with his combination of power and plate discipline.\"",
    "\"Consistently productive. You look up at the end of the year and he's hit .350 again.\"",
  ]},
  history: { weight: 10, lines: [
    "\"This ballpark has seen a lot of baseball. Since 1912 — think of all the great players who've stood in that batter's box.\"",
    "\"The history here is remarkable. Ted Williams. Carl Yastrzemski. You feel it every time you walk in.\"",
    "\"Fenway Park remains one of baseball's treasures. There's nothing else quite like it.\"",
    "\"Many great players have worn this uniform. The tradition runs deep in New England.\"",
    "\"This franchise has produced some of the game's finest hitters. Williams, Yaz, now Rice and Boggs.\"",
    "\"You look around this park and you're reminded of what baseball means to this city.\"",
    "\"Generations of New Englanders have grown up watching baseball in this ballpark.\"",
    "\"The Red Seat out in right field — marks the spot where Ted Williams hit the longest home run ever measured here.\"",
    "\"Fenway has been hosting baseball since before the First World War. That's a lot of ballgames.\"",
    "\"Some of the most memorable moments in baseball history have unfolded right here on this field.\"",
  ]},
  crowd: { weight: 8, lines: [
    "\"A knowledgeable crowd here tonight. They've seen a few games in this park.\"",
    "\"The fans appreciate good baseball. You don't have to explain the game to this audience.\"",
    "\"They've seen a few games in this park — they know when something significant is happening.\"",
    "\"Fenway is buzzing. The crowd senses something developing.\"",
    "\"They're paying attention now. Every pitch matters at this stage.\"",
    "\"The crowd came to life — that's the sound of people who know baseball.\"",
    "\"The fans know the significance of this situation.\"",
    "\"This crowd is notoriously demanding — and right now, they're fully engaged.\"",
    "\"A quiet murmur in the stands. They're watching closely.\"",
    "\"The fans are on their feet. They know what's at stake here.\"",
    "\"New England baseball fans — there's nothing quite like them. Passionate, knowledgeable, and not afraid to let you know how they feel.\"",
  ]},
  dryHumor: { weight: 2, lines: [
    "\"Well, that should help.\"", "\"The Red Sox will gladly take that.\"",
    "\"That changes things rather quickly.\"", "\"Not his finest moment.\"",
    "\"He'd like another opportunity there.\"", "\"That's unfortunate.\"",
    "\"That should make the train ride home more pleasant.\"", "\"The crowd will discuss that one for a while.\"",
    "\"Baseball occasionally rewards persistence.\"", "\"The fans appear unconvinced.\"",
    "\"I suspect there are a few people in the grandstand who would have preferred a different outcome.\"",
    "\"That was not the intended result.\"",
    "\"Perhaps we'll look back on that play with more appreciation later. Much later.\"",
    "\"Well. Baseball is a long season.\"", "\"That's one way to handle that situation. There were others.\"",
  ]},
};