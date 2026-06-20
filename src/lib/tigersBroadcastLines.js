// Tigers Broadcast — Ernie Harwell & Paul Carey
// Generic pool + rich player-specific stats via tigersPlayerStats.js
import { pickTigersPlayerTidbit, pickTigersComboLine } from './tigersPlayerStats';

export function pickTigersLine() {
  const totalWeight = Object.values(POOLS).reduce((sum, pool) => sum + pool.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const [category, pool] of Object.entries(POOLS)) {
    roll -= pool.weight;
    if (roll <= 0) return pool.lines[Math.floor(Math.random() * pool.lines.length)];
  }
  return POOLS.gameAction.lines[0];
}

export function pickTigersPlayerLine(playerName) {
  // Use the new rich player tidbit system
  const tidbit = pickTigersPlayerTidbit(playerName);
  if (tidbit) return tidbit;

  // Fallback: generic combo line (fires ~12% of the time when no specific tidbit matches)
  if (playerName && Math.random() < 0.12) return pickTigersComboLine();

  return null;
}

const POOLS = {
  gameAction: { weight: 35, lines: [
    "\"Strike three called.\"", "\"Got him looking.\"", "\"He never offered at that one.\"",
    "\"Caught him on the corner.\"", "\"Back to the dugout he goes.\"",
    "\"Long drive to left field — way back — gone. Home run.\"", "\"That ball is out of here.\"",
    "\"A line drive — base hit.\"", "\"He swings and misses — strike three.\"",
    "\"Ground ball to short — over to first — in time.\"", "\"Fly ball to center field — the outfielder drifts under it.\"",
    "\"Popped up behind the plate — the catcher makes the catch.\"",
    "\"Here's the pitch — swung on and lined into right field.\"",
    "\"A sharp single — that'll bring in a run.\"", "\"The runner tags and scores — a sacrifice fly.\"",
    "\"Two down now.\"", "\"The side is retired.\"", "\"A well-struck ball — that's a double into the gap.\"",
    "\"He got a piece of it — foul tip into the catcher's mitt, strike three.\"",
    "\"That one's a Baltimore chop — the infielder charges, makes the play.\"",
    "\"A towering fly ball — carrying toward the wall...\"", "\"The pitcher delivers — and it's in there for a strike.\"",
    "\"The Tigers have something going here in the inning.\"",
  ]},
  teamPraise: { weight: 20, lines: [
    "\"This club finds ways to win. They've done it all season.\"",
    "\"They're playing excellent baseball — top to bottom.\"",
    "\"A very confident ballclub. You can see it in how they carry themselves.\"",
    "\"They do the little things well. That's the mark of a good team.\"",
    "\"The Tigers continue to impress. Night after night.\"",
    "\"This team doesn't beat itself. They make you earn everything.\"",
    "\"There's a chemistry here that's hard to describe but easy to see.\"",
    "\"From the starting pitching to the bullpen to the bats — this is a complete ballclub.\"",
    "\"The Tigers work hard. A lunch-pail ballclub, as they say around here.\"",
    "\"They come to play every day. Never take a game off.\"",
    "\"The fans appreciate hustle, and this team hustles.\"",
    "\"Sparky Anderson has this club believing. They expect to win.\"",
    "\"Winning is a habit, and this ballclub is in a very good habit.\"",
    "\"There's no panic in this dugout. They've been here before.\"",
  ]},
  players: { weight: 15, lines: [
    "\"The young players are contributing — that's what makes this team special.\"",
    "\"A very balanced lineup. You can't pitch around anybody.\"",
    "\"This pitching staff has been outstanding all year long.\"",
  ]},
  atmosphere: { weight: 15, lines: [
    "\"A beautiful afternoon for baseball here in Detroit.\"",
    "\"The flags are moving gently in the breeze.\"", "\"The sun is shining brightly over The Corner.\"",
    "\"Another beautiful Michigan afternoon.\"", "\"Good day for baseball.\"",
    "\"A pleasant breeze coming in from the outfield.\"", "\"The sky is clear — a perfect evening at the ballpark.\"",
    "\"You can smell the summer in the air. Nothing quite like it.\"",
    "\"The shadows are beginning to stretch across the diamond.\"",
    "\"A cool evening settling in — the kind where you want a hot dog and a coffee.\"",
    "\"The lights are on now at Tiger Stadium. Always a beautiful sight.\"",
    "\"The upper deck is packed — the folks are out in force tonight.\"",
    "\"Tiger Stadium at Michigan and Trumbull — there's no place quite like it.\"",
    "\"The right field overhang is casting its shadow — that can make things tricky for the outfielders.\"",
  ]},
  crowd: { weight: 10, lines: [
    "\"The fans appreciate that effort — a nice ovation from the crowd.\"",
    "\"Listen to that crowd. They're into this ballgame.\"", "\"The folks here enjoyed that one.\"",
    "\"The crowd came to life on that play.\"", "\"A nice ovation for a job well done.\"",
    "\"The fans are on their feet here at The Corner.\"",
    "\"The folks in the upper deck are making some noise.\"",
    "\"A fine crowd here today. Good to see the ballpark full.\"",
    "\"You can feel the energy in the stands. The Tigers' fans are loving this.\"",
    "\"The Detroit faithful — they know their baseball.\"",
    "\"The crowd is standing and applauding — that's well deserved.\"",
    "\"A warm reception from the fans — and rightly so.\"",
  ]},
  folksy: { weight: 4, lines: [
    "\"Good to have you with us this afternoon.\"", "\"A fine crowd here today at Tiger Stadium.\"",
    "\"Hope you're enjoying the ballgame wherever you may be.\"",
    "\"Glad you're spending part of your day with us.\"",
    "\"Baseball has a way of bringing people together, doesn't it?\"",
    "\"It's good to be at the ballpark. It's always good to be at the ballpark.\"",
    "\"There's nothing quite like an afternoon at the old ball yard.\"",
    "\"The great thing about baseball is you never know what you might see.\"",
    "\"Every game has its own story. That's the beauty of it.\"",
    "\"Thank you for joining us. We appreciate you spending your time here.\"",
    "\"Baseball and summer — they just go together.\"",
    "\"You see families here, kids keeping score. That's what it's all about.\"",
  ]},
  signature: { weight: 1, lines: [
    "\"He stood there like the house by the side of the road.\"",
    "\"That one is long gone — and found a souvenir hunter in the upper deck.\"",
    "\"The folks are enjoying this one.\"", "\"That ball had a passport on it.\"",
    "\"You won't see many better than that one.\"",
    "\"That's a young man who's going to hit a lot of baseballs a long way.\"",
    "\"Strike three called — and he just stood there and admired it.\"",
    "\"That foul ball was caught by a gentleman from Dearborn.\"",
    "\"Two for the price of one — that's a Tigers special right there.\"",
    "\"A standing ovation as he leaves the mound — the folks know quality when they see it.\"",
  ]},
};