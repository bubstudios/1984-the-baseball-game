// Commentary line pools with rarity tiers: 'common' (70%), 'uncommon' (25%), 'rare' (5%)
// Calling pickLine(lines) without tags treats all as common.

const RARITY_WEIGHTS = { common: 70, uncommon: 25, rare: 5 };

export function pickLine(lines) {
  // Compute total weight
  const weighted = [];
  let totalWeight = 0;
  for (const line of lines) {
    const rarity = line.rarity || 'common';
    const weight = RARITY_WEIGHTS[rarity] || 70;
    totalWeight += weight;
    weighted.push({ text: line.text, weight, total: totalWeight });
  }
  const roll = Math.random() * totalWeight;
  for (const entry of weighted) {
    if (roll < entry.total) return entry.text;
  }
  return lines[0].text;
}

// Template tag helper: string → { text, rarity? }
function c(text, rarity) { return { text, rarity }; }

// =========== STRIKEOUT ===========
const STRIKEOUT_LINES = [
  // neutral (common)
  c("Strike three."), c("He struck him out."), c("That's out number three."),
  c("Retired on strikes."), c("Down on strikes."),
  c("Strike three called."), c("Got him swinging."),
  // colorful (common)
  c("Sit down!"), c("Take a seat!"), c("Grab some bench!"),
  c("Ring him up!"), c("Got him looking!"), c("Sent him packing!"),
  c("That's three!"), c("Back to the dugout!"), c("Nothing doing!"),
  // old school (uncommon)
  c("He couldn't catch up to that one.", 'uncommon'),
  c("Blew it right by him — strike three.", 'uncommon'),
  c("Left him guessing.", 'uncommon'),
  c("Frozen at the plate.", 'uncommon'),
  c("Caught looking.", 'uncommon'),
  c("Overmatched on that pitch.", 'uncommon'),
  c("He'll take the slow walk back.", 'uncommon'),
  // rare gems
  c("He'll be seeing that one in his sleep tonight.", 'rare'),
  c("Not even close — that's a punchout.", 'rare'),
];

// =========== WALK ===========
const WALK_LINES = [
  c("Ball four."), c("Batter awarded first base on the walk."), c("He draws the walk."),
  c("Base on balls."),
  c("Free pass."), c("First class ticket to first base."),
  c("He'll take it — ball four."), c("Four wide ones."),
  c("Gift-wrapped first base."), c("No purchase necessary — ball four."),
  c("The pitcher lost him."),
  c("Showing patience at the plate.", 'uncommon'),
  c("Worked the count and earned it.", 'uncommon'),
  c("Good eye by the hitter.", 'uncommon'),
  c("Refused to chase.", 'uncommon'),
  c("That's a professional at-bat right there.", 'rare'),
  c("Didn't offer at a single pitch.", 'rare'),
];

// =========== INTENTIONAL WALK ===========
const INTENTIONAL_WALK_LINES = [
  c("They're putting him on intentionally."),
  c("Four wide ones — no intention of pitching to him."),
  c("They'd rather face the next guy."),
  c("The free pass is issued."),
  c("No respect — they're walking him to set up the force.", 'uncommon'),
  c("Smart baseball — take the bat out of his hands.", 'uncommon'),
];

// =========== SINGLE =========== (these are templates — batter name prefixed)
const SINGLE_LINES = [
  c("lines a single to left."), c("grounds a single through the hole."),
  c("bloops a single into shallow right."), c("singles sharply up the middle."),
  c("Base hit."), c("Single to center."), c("Sharp single."), c("One-base hit."),
  c("Base knock."), c("A little duck snort falls in.", 'uncommon'),
  c("A little flare drops in front of the outfielder."), c("That's a seeing-eye single."), c("Single — found some grass."),
  c("Looper into shallow center — base hit."), c("Drops one in front — single."),
  c("Base knock — just what the doctor ordered."), c("Clean single."),
  c("Single — solid piece of hitting.", 'uncommon'),
  c("Single — hit it where they weren't.", 'uncommon'),
  c("stayed with the pitch — base hit.", 'uncommon'),
  c("Single — nice stroke.", 'uncommon'),
  c("Poked it through the infield.", 'uncommon'),
  c("That's a frozen rope through the hole.", 'rare'),
  // Universal batted-ball calls — varied contact descriptions
  c("A clean base hit up the middle.", 'uncommon'),
  c("A hard single through the left side.", 'uncommon'),
  c("A line drive the other way — base hit.", 'uncommon'),
  c("He shoots it toward right field — single.", 'uncommon'),
  c("A ground ball that splits the middle infielders.", 'uncommon'),
  c("A hard shot between first and second — base hit.", 'uncommon'),
  c("A ground ball through the opposite side — he's on with a single.", 'uncommon'),
  c("A dart toward shortstop — finds the hole.", 'rare'),
  c("A rope into left-center — base hit.", 'rare'),
];

// =========== SINGLE — INFIELD HITS ===========
const INFIELD_SINGLE_LINES = [
  c("A slow roller, and he beats the throw to first."),
  c("He chops one into the ground and legs it out."),
  c("A little tapper turns into an infield hit."),
  c("He sends a slow bouncer across the dirt and reaches safely."),
  c("The ball dies on the infield, and there is no play."),
  c("He beats out a softly hit ground ball."),
  c("A high chopper gives him enough time to reach first."),
  c("He hustles down the line and turns a routine-looking grounder into a hit."),
  c("A weak roller finds just the right spot."),
  c("He sends a swinging bunt into open space and reaches safely."),
  c("The defense makes the play, but not quickly enough."),
  c("He gets jammed, but the ball rolls too slowly for an out."),
  c("A soft grounder and good speed produce an infield single."),
  c("He chops it off the plate and wins the race to first."),
  c("The throw is late, and he has himself an infield hit."),
  c("A dribbler stays fair, and he reaches without a throw."),
  c("He places a slow roller where no quick play can be made."),
  c("The ball takes a difficult hop, and the batter is safe."),
  c("He gets down the line in a hurry and beats it out."),
  c("A perfectly placed tapper becomes a base hit."),
  c("He barely gets the ball out of the dirt, but it is enough."),
  c("The defense charges, throws, and still cannot get him."),
  c("A little squibber turns into a single."),
  c("He catches the defense back and reaches on a slow roller."),
  c("The ball stays on the infield, but the batter does not."),
];

// =========== SINGLE — GROUNDERS THROUGH THE INFIELD ===========
const GROUNDER_SINGLE_LINES = [
  c("A ground ball finds its way through for a single."),
  c("He shoots a grounder through the infield."),
  c("A sharp bouncer gets into the outfield."),
  c("He sends one through the open side for a base hit."),
  c("The ground ball sneaks between the defenders."),
  c("He rolls it through the infield and reaches first."),
  c("A clean ground-ball single into the outfield."),
  c("He finds a hole with a hard grounder."),
  c("The ball skips through before anyone can cut it off."),
  c("He pulls a ground ball through for a hit."),
  c("A bouncer finds open grass."),
  c("He sends a grounder back through the middle."),
  c("The ball gets past the infield and into the outfield."),
  c("A well-placed ground ball produces a single."),
  c("He stays on the pitch and rolls it through."),
  c("The defense cannot close the gap in time."),
  c("A hard one-hopper finds its way through."),
  c("He punches a ground ball into an opening."),
  c("The ball hugs the ground and gets into the outfield."),
  c("He turns on the pitch and sends it through the infield."),
  c("A crisp grounder slips past the reach of the defense."),
  c("He finds the seam with a low shot."),
  c("The ground ball is just out of reach and rolls through."),
  c("He threads one between the defenders for a single."),
  c("A sharply hit grounder becomes a clean base hit."),
];

// =========== SINGLE — LINERS THROUGH THE INFIELD ===========
const LINER_SINGLE_LINES = [
  c("A line drive shoots through the infield for a single."),
  c("He ropes one into the outfield."),
  c("A sharp liner finds open grass."),
  c("He punches a line drive through for a base hit."),
  c("The ball comes off the bat hard and gets through."),
  c("He sends a low liner into the outfield."),
  c("A clean line-drive single."),
  c("He rifles one through the infield."),
  c("A hard shot skips into the outfield."),
  c("He squares it up and lines it through."),
  c("A crisp liner gets past the defense."),
  c("He shoots a line drive into an opening."),
  c("The ball flashes through before anyone can react."),
  c("He sends a frozen rope into the outfield."),
  c("A sharp liner finds the gap in the infield."),
  c("He drives the pitch on a line for a single."),
  c("The ball is hit too hard to be handled."),
  c("He lashes one through for a base hit."),
  c("A low line drive gets into open space."),
  c("He stays inside the pitch and lines it into the outfield."),
  c("The defense has no chance on that sharply hit ball."),
  c("He sends a bullet through the infield."),
  c("A firm line drive produces a clean single."),
  c("He barrels it and finds a hole."),
  c("A hard liner carries safely into the outfield."),
];

// =========== SINGLE — BLOOPS BETWEEN THE INFIELD AND OUTFIELD ===========
const BLOOP_SINGLE_LINES = [
  c("A soft blooper drops in for a single."),
  c("He lifts a little flare into open grass."),
  c("The ball falls between the converging defenders."),
  c("A shallow bloop lands safely."),
  c("He drops a soft single just beyond the infield."),
  c("A little parachute falls in for a hit."),
  c("The ball hangs up, then drops where nobody can reach it."),
  c("He gets just enough of it to find open space."),
  c("A soft flare lands untouched."),
  c("The blooper falls between the defense for a single."),
  c("He fights off the pitch and drops it into shallow territory."),
  c("A gentle loop finds the grass."),
  c("The ball floats beyond one defender and in front of another."),
  c("He places a soft single into no-man's-land."),
  c("A little humpback liner falls safely."),
  c("The defense closes in, but the ball drops first."),
  c("He flips a soft hit into shallow outfield territory."),
  c("A blooping shot lands just out of reach."),
  c("He gets jammed, but the ball finds an opening."),
  c("A softly hit ball falls between the layers of the defense."),
  c("The ball drops in front of the outfield for a base hit."),
  c("He serves a little flare into open space."),
  c("A weakly hit ball lands in exactly the right spot."),
  c("The defense cannot decide who can reach it, and it falls safely."),
  c("He drops one over the infield for a single."),
];

// =========== SINGLE — HARDER-HIT BALLS BETWEEN THE INFIELD AND OUTFIELD ===========
const HARD_SHALLOW_SINGLE_LINES = [
  c("A firm shot lands in front of the outfield for a single."),
  c("He drives a low ball into shallow outfield territory."),
  c("A hard sinking liner drops safely."),
  c("The ball falls in front of the defense and stays a single."),
  c("He sends a sharply hit ball into the open grass."),
  c("A low drive lands before it can be caught."),
  c("He rifles a shot that drops in for a base hit."),
  c("A firm liner falls just beyond the infield."),
  c("The ball sinks quickly and lands safely."),
  c("He drives one into the gap between the defense."),
  c("A sharp shot reaches the grass before anyone can close."),
  c("He hits it firmly, but low enough to fall in front."),
  c("A sinking line drive produces a single."),
  c("The ball is hit too sharply to catch, but not far enough for extra bases."),
  c("He sends a low laser into shallow territory."),
  c("A hard shot drops in front of the outfield."),
  c("He lines one into open space and stops at first."),
  c("A firm drive gets down quickly for a hit."),
  c("The ball carries over the infield and lands safely."),
  c("He smokes one into the shallow outfield."),
  c("A sharply struck ball finds the grass before the catch can be made."),
  c("He drives it through the open space for a single."),
  c("A low, hard liner falls safely."),
  c("The defense reacts quickly, but the ball is already down."),
  c("He hits it on the nose and settles for one base."),
];

// =========== SINGLE — BALLS NEAR THE LINE OR BETWEEN OUTFIELDERS — HELD TO SINGLE ===========
const HELD_AT_FIRST_SINGLE_LINES = [
  c("He sends it toward the gap, but the defense cuts it off quickly."),
  c("The ball gets between the outfielders, but not far enough for two."),
  c("A shot near the line is played quickly, holding him at first."),
  c("He finds open grass, but the ball is returned in a hurry."),
  c("A well-placed hit toward the gap produces only a single."),
  c("The ball reaches the line, but the defense gets there quickly."),
  c("He drives one between the outfielders and has to stop at first."),
  c("A sharp hit into the gap is cut off before he can think about second."),
  c("The ball lands safely near the line, but the quick recovery holds him."),
  c("He sends it into open territory, but the defense closes fast."),
  c("A hard single toward the gap, and he stays at first."),
  c("The ball gets down between the outfielders, but the return throw is immediate."),
  c("He drives one near the line and is held to a single."),
  c("A well-hit ball reaches the outfield, but not deeply enough for an extra base."),
  c("The defense cuts it off before the batter can make the turn."),
  c("He finds the gap, but the ball is played too quickly for two bases."),
  c("A sharp shot lands near the line and is returned without delay."),
  c("The ball rolls into open grass, but the defense prevents the extra base."),
  c("He sends a firm hit between the outfielders and stops at first."),
  c("A single into the gap, but no chance to stretch it."),
  c("The ball lands safely, and the quick pickup keeps him at first."),
  c("He hits it toward the corner, but the defense gets there in time."),
  c("A solid shot reaches the outfield, but the runner wisely holds."),
  c("The ball finds open space near the line, though the defense limits the damage."),
  c("He places it between the outfielders, but the play is made quickly enough to hold him to one."),
];

// =========== DOUBLE ===========
const DOUBLE_LINES = [
  c("doubles off the wall."), c("Double into the gap."),
  c("Two-base hit."), c("Stand-up double."),
  c("Splits the outfielders."), c("Into the alley!"),
  c("That's extra bases."), c("Two bags for him."),
  c("Double — a gapper."), c("Rattles around the wall."),
  c("Double — drove it with authority.", 'uncommon'),
  c("Shot into the gap.", 'uncommon'),
  c("Double — that's textbook hitting.", 'uncommon'),
  c("He was thinking two all the way.", 'uncommon'),
  c("One-hopped the wall — easy stand-up double.", 'rare'),
];

// =========== DOUBLE — STRETCHING A SINGLE ===========
const STRETCH_SINGLE_DOUBLE_LINES = [
  c("He rounds first aggressively and beats the throw into second."),
  c("He turns the single into a double with an aggressive sprint."),
  c("He never slows at first and slides safely into second."),
  c("The defense is slow getting the ball back, and he takes the extra base."),
  c("He sees an opening and stretches the hit into two bases."),
  c("A wide turn at first becomes a hustle double."),
  c("He challenges the throw and wins the race to second."),
  c("He keeps running and reaches second just ahead of the tag."),
  c("What looked like a single becomes a double through pure hustle."),
  c("He catches the defense relaxing and takes another ninety feet."),
  c("He puts his head down, races for second and makes it safely."),
  c("The ball is returned quickly, but not quickly enough."),
  c("He takes an aggressive turn and slides in with a double."),
  c("He forces the issue and converts the hit into two bases."),
  c("The throw is close, but he beats it into second."),
  c("He refuses to settle for one base and reaches second safely."),
  c("A quick burst out of the box allows him to stretch the play."),
  c("He sees the chance for two and takes it."),
  c("The defense nearly cuts him down, but he arrives safely."),
  c("He races out of the batter's box and earns himself a double."),
  c("The hit is fielded quickly, but his speed creates the extra base."),
  c("He presses the defense and wins a close play at second."),
  c("He rounds first at full speed and dives in ahead of the throw."),
  c("A routine single becomes an extra-base hit because of aggressive running."),
  c("He takes advantage of the slow recovery and reaches second standing."),
];

// =========== DOUBLE — HIT DOWN THE LINE ===========
const LINE_DOUBLE_LINES = [
  c("He shoots the ball down the line for a double."),
  c("A sharp drive hugs the line and rolls into the corner."),
  c("He pulls it inside the line and cruises into second."),
  c("The ball skips past the defense and races down the line."),
  c("He sends a hard shot into the corner for two bases."),
  c("A fair ball down the line produces an easy double."),
  c("He turns on the pitch and drives it inside the chalk."),
  c("The ball lands fair and rattles toward the corner."),
  c("He slices one down the line and reaches second comfortably."),
  c("A line drive stays fair and rolls deep into the outfield."),
  c("He drops one just inside the line for extra bases."),
  c("The ball kicks away near the corner, and he takes second."),
  c("He drills the pitch down the line for a stand-up double."),
  c("A sharp shot finds the chalk and keeps rolling."),
  c("He hooks one inside the line and into the corner."),
  c("The ball stays fair by a narrow margin and results in two bases."),
  c("He rips it down the line and races into second."),
  c("A hard grounder gets past the defense and heads for the corner."),
  c("He places the ball perfectly inside the line."),
  c("The hit skips along the line and gives him plenty of time for second."),
  c("He lashes one fair down the side for a double."),
  c("The ball lands near the line and continues into deep territory."),
  c("He turns on the inside pitch and drives it into the corner."),
  c("A fair ball just inside the line becomes an extra-base hit."),
  c("He sends it down the chalk and pulls into second with a double."),
];

// =========== DOUBLE — HIT BETWEEN OUTFIELDERS — DOES NOT REACH WALL ===========
const GAP_DOUBLE_SHORT_LINES = [
  c("He drives it between the outfielders for a double."),
  c("The ball lands in the gap, and he races into second."),
  c("A well-placed shot splits the defense."),
  c("He finds open grass between the outfielders for two bases."),
  c("The ball drops into the gap but is cut off before the wall."),
  c("He drives one into open space and reaches second standing."),
  c("A sharp hit lands between the converging defenders."),
  c("The ball gets down in the gap and rolls far enough for a double."),
  c("He threads one between the outfielders for extra bases."),
  c("A firm drive finds the open part of the outfield."),
  c("The defense closes quickly, but he has time to reach second."),
  c("He sends one into the alley and takes two bases."),
  c("A low drive splits the outfielders and results in a double."),
  c("The ball lands safely in the gap and is recovered before reaching the wall."),
  c("He drives it where nobody can make the catch."),
  c("A shot into open territory gives him an easy two-base hit."),
  c("He finds the seam between the outfielders."),
  c("The ball gets through the gap, but the defense cuts it off quickly."),
  c("He lines one into the alley and cruises into second."),
  c("A clean gapper produces two bases."),
  c("He drives it between the defenders and beats the return throw."),
  c("The ball lands in open grass and rolls long enough for a double."),
  c("A hard shot splits the defense without reaching the fence."),
  c("He finds the gap and takes second without a play."),
  c("The ball lands between the outfielders, and he settles for two."),
];

// =========== DOUBLE — HIT BETWEEN OUTFIELDERS — REACHES WALL ===========
const GAP_DOUBLE_LONG_LINES = [
  c("He drives it between the outfielders and all the way to the wall."),
  c("The ball splits the defense and rolls to the fence."),
  c("He sends one deep into the gap for a double."),
  c("The ball reaches the wall before anyone can cut it off."),
  c("He drives it into the alley and cruises into second."),
  c("A hard gapper rolls all the way to the fence."),
  c("The ball gets between the outfielders and keeps going."),
  c("He finds the deepest part of the gap for two bases."),
  c("A sharp drive splits the defense and reaches the wall."),
  c("He sends it racing through open territory and into the fence."),
  c("The ball rolls untouched to the wall, and he reaches second easily."),
  c("He drives one into the gap and has time to admire the double."),
  c("A well-struck shot reaches the fence between the outfielders."),
  c("The defense cannot cut it off before it reaches the wall."),
  c("He drills it into the alley for a stand-up double."),
  c("The ball gets all the way to the wall before being retrieved."),
  c("He splits the outfielders with a hard two-base hit."),
  c("A deep drive into the gap gives him an easy double."),
  c("The ball races toward the wall, and he rounds first without hesitation."),
  c("He sends a gap shot to the fence and pulls into second."),
  c("The ball lands between the defenders and rolls deep into the outfield."),
  c("He finds open space, and the ball carries all the way to the wall."),
  c("A deep gapper leaves the defense chasing it to the fence."),
  c("He drives it where the outfielders cannot reach it, and it rolls to the wall."),
  c("The ball splits the defense cleanly and produces a comfortable double."),
];

// =========== DOUBLE — HIT OVER OUTFIELDER'S HEAD — REACHES WALL ===========
const OVER_HEAD_DOUBLE_LINES = [
  c("He drives it over the outfielder's head and to the wall."),
  c("The ball sails beyond the defender and bounces against the fence."),
  c("He gets it over the defense for a double."),
  c("A deep drive clears the outfielder and reaches the wall."),
  c("The ball carries beyond the defender's reach and rolls to the fence."),
  c("He sends one over the outfielder's head for two bases."),
  c("The defender retreats, but the ball gets over him."),
  c("A long drive lands behind the outfielder and reaches the wall."),
  c("He lifts it over the defense and races into second."),
  c("The ball clears the outfielder by a few feet and keeps rolling."),
  c("He drives one deep enough to get beyond the defense."),
  c("The outfielder turns and runs, but the ball lands behind him."),
  c("A well-hit drive sails overhead and reaches the fence."),
  c("He sends the defense racing back, but the ball gets past."),
  c("The ball lands beyond the outfielder and rolls to the wall."),
  c("He drives it over the defense for a stand-up double."),
  c("A deep shot carries farther than the outfielder expected."),
  c("The ball gets over the outfielder's glove and reaches the fence."),
  c("He sends one well over the defender and into deep territory."),
  c("The outfielder misjudges the carry, and the ball sails overhead."),
  c("A long drive gets beyond the defense and rolls to the wall."),
  c("He lifts one over the outfielder for an extra-base hit."),
  c("The ball clears the defense and gives him plenty of time for second."),
  c("He drives it farther than the outfielder can retreat."),
  c("The ball sails overhead, reaches the wall and produces a double."),
];

// =========== DOUBLE — BALL HITS WALL ON FLY OR LINE DRIVE ===========
const WALL_DOUBLE_LINES = [
  c("He drives it off the wall for a double."),
  c("The ball slams against the fence and stays in play."),
  c("A hard drive hits the wall on the fly."),
  c("He sends a line drive ringing off the fence."),
  c("The ball crashes into the wall, and he races into second."),
  c("He nearly gets it out, but settles for a double off the wall."),
  c("A deep drive strikes the fence and caroms back into play."),
  c("He drills one off the wall for extra bases."),
  c("The ball hits high off the fence and stays in the park."),
  c("He sends a rocket into the wall and reaches second standing."),
  c("A long line drive bangs off the fence."),
  c("He puts a charge into it, but the wall keeps it in the park."),
  c("The ball strikes the wall on the fly and kicks back toward the field."),
  c("He drives it deep, and the fence turns it into a double."),
  c("A hard shot rattles off the wall."),
  c("He comes within a few feet of a home run and settles for two."),
  c("The ball smacks against the fence and drops into play."),
  c("He sends a screaming drive off the wall."),
  c("A deep liner reaches the fence before touching the ground."),
  c("The ball caroms sharply off the wall, but he stops at second."),
  c("He hits it about as far as possible without leaving the park."),
  c("A towering drive bangs off the fence for a double."),
  c("The wall denies the home run but cannot prevent the extra-base hit."),
  c("He crushes it off the fence and cruises into second."),
  c("The ball strikes the wall with authority, and he has himself a double."),
];

// =========== TRIPLE ===========
const TRIPLE_LINES = [
  c("rips a triple into the gap."), c("Triple."), c("Three-base hit."),
  c("Triple! Wheels!"), c("Triple! He's flying around the bases!"),
  c("Triple city!"), c("Standing on third with three bags."),
  c("Triple! Track meet around the bases."),
  c("Triple — turned on the jets.", 'uncommon'),
  c("Triple — excellent baserunning.", 'uncommon'),
  c("Triple — legged it out.", 'uncommon'),
  c("Triple! Hustle from the batter.", 'uncommon'),
  c("Slid into third with a cloud of dust.", 'rare'),
  c("That's the hardest hit in baseball — a stand-up triple.", 'rare'),
];

// =========== TRIPLE — STRETCHING A DOUBLE ===========
const STRETCH_DOUBLE_TRIPLE_LINES = [
  c("He rounds second aggressively and races safely into third."),
  c("He turns the double into a triple with pure hustle."),
  c("He never slows at second and beats the throw to third."),
  c("The defense is slow getting the ball back, and he takes the extra base."),
  c("He sees a chance for three and takes it."),
  c("A wide turn around second becomes a hustle triple."),
  c("He challenges the throw and wins the race to third."),
  c("He keeps running and slides in just ahead of the tag."),
  c("What looked like a double becomes a triple through aggressive baserunning."),
  c("He catches the defense relaxing and takes another ninety feet."),
  c("He puts his head down, races for third and makes it safely."),
  c("The relay is close, but not close enough."),
  c("He takes an aggressive turn and dives into third with a triple."),
  c("He forces the issue and converts the hit into three bases."),
  c("The throw arrives late, and he is safely into third."),
  c("He refuses to settle for two and takes the extra base."),
  c("A quick burst around second gives him the triple."),
  c("He sees the opening and never hesitates."),
  c("The defense nearly cuts him down, but he beats the tag."),
  c("He races out of second and earns himself a triple."),
  c("The ball is retrieved quickly, but his speed creates the extra base."),
  c("He presses the defense and wins a close play at third."),
  c("He rounds second at full speed and slides in safely."),
  c("A routine double becomes a triple because of aggressive running."),
  c("He takes advantage of the slow recovery and reaches third standing."),
];

// =========== TRIPLE — BALL SPLITS OUTFIELDERS AND REACHES WALL ===========
const GAP_TRIPLE_WALL_LINES = [
  c("He drives it between the outfielders and all the way to the wall."),
  c("The ball splits the defense and rolls to the fence."),
  c("He sends one deep into the gap and races for third."),
  c("The ball reaches the wall before anyone can cut it off."),
  c("He drives it into the alley and keeps running."),
  c("A hard gapper rolls all the way to the fence."),
  c("The ball gets between the outfielders and keeps going."),
  c("He finds the deepest part of the gap and takes three bases."),
  c("A sharp drive splits the defense and reaches the wall."),
  c("He sends it racing through open territory and into the fence."),
  c("The ball rolls untouched to the wall, and he heads for third."),
  c("He drives one into the gap and never considers stopping at second."),
  c("A well-struck shot reaches the fence between the outfielders."),
  c("The defense cannot cut it off before it reaches the wall."),
  c("He drills it into the alley and cruises into third."),
  c("The ball gets all the way to the wall before being retrieved."),
  c("He splits the outfielders with a three-base hit."),
  c("A deep drive into the gap gives him plenty of time for third."),
  c("The ball races toward the wall, and he rounds second without hesitation."),
  c("He sends a gap shot to the fence and pulls into third."),
  c("The ball lands between the defenders and rolls deep into the outfield."),
  c("He finds open space, and the ball carries all the way to the wall."),
  c("A deep gapper leaves the defense chasing it to the fence."),
  c("He drives it where nobody can reach it and races into third."),
  c("The ball splits the defense cleanly and produces a stand-up triple."),
];

// =========== TRIPLE — BALL OVER OUTFIELDER'S HEAD TO WALL ===========
const OVER_HEAD_TRIPLE_LINES = [
  c("He drives it over the outfielder's head and all the way to the wall."),
  c("The ball sails beyond the defender and bounces toward the fence."),
  c("He gets it over the defense and races into third."),
  c("A deep drive clears the outfielder and reaches the wall."),
  c("The ball carries beyond the defender's reach and rolls to the fence."),
  c("He sends one over the outfielder's head for three bases."),
  c("The defender retreats, but the ball gets over him."),
  c("A long drive lands behind the outfielder and reaches the wall."),
  c("He lifts it over the defense and never slows around second."),
  c("The ball clears the outfielder by a few feet and keeps rolling."),
  c("He drives one deep enough to get beyond the defense."),
  c("The outfielder turns and runs, but the ball lands behind him."),
  c("A well-hit drive sails overhead and reaches the fence."),
  c("He sends the defense racing back, but the ball gets past."),
  c("The ball lands beyond the outfielder and rolls to the wall."),
  c("He drives it over the defense for a stand-up triple."),
  c("A deep shot carries farther than the outfielder expected."),
  c("The ball gets over the glove and reaches the fence."),
  c("He sends one well over the defender and into deep territory."),
  c("The outfielder misjudges the carry, and the ball sails overhead."),
  c("A long drive gets beyond the defense and rolls to the wall."),
  c("He lifts one over the outfielder and races into third."),
  c("The ball clears the defense and gives him time for three."),
  c("He drives it farther than the outfielder can retreat."),
  c("The ball sails overhead, reaches the wall and produces a triple."),
];

// =========== TRIPLE — BALL BOUNCES OFF WALL AND BACK PAST OUTFIELDER ===========
const WALL_BOUNCE_TRIPLE_LINES = [
  c("The ball hits the wall and kicks back past the outfielder."),
  c("It caroms off the fence and rolls away from the defense."),
  c("The ball strikes the wall, takes a wild bounce and gets away."),
  c("He drives it off the fence, and the rebound skips past the outfielder."),
  c("The ball bangs off the wall and shoots back toward the field."),
  c("A strange carom sends the ball rolling away, and he races for third."),
  c("The wall gives the defense a bad bounce, and the runner takes advantage."),
  c("The ball strikes the fence and ricochets past the outfielder."),
  c("He gets a fortunate carom and never slows around second."),
  c("The rebound off the wall turns the play into a triple."),
  c("The ball bounces off the fence and skips into open space."),
  c("A hard carom leaves the defense chasing it back toward the field."),
  c("The ball hits the wall and takes off in the opposite direction."),
  c("He drives it deep, and the rebound carries past the outfielder."),
  c("The fence sends the ball bouncing away, and he heads for third."),
  c("A wicked carom off the wall gives him three bases."),
  c("The ball strikes the wall and rolls beyond the defense's reach."),
  c("The outfielder plays the wall, but the rebound gets past."),
  c("He benefits from a wild bounce and races safely into third."),
  c("The ball ricochets sharply off the fence and away from the play."),
  c("A tricky rebound off the wall turns extra bases into a triple."),
  c("The ball bangs off the fence and skips beyond the outfielder."),
  c("The wall sends it back toward the infield, but away from the defense."),
  c("He keeps running as the carom rolls into open territory."),
  c("The ball takes a wild bounce off the wall, and he arrives at third standing."),
];

// =========== HOME RUN ===========
const HOME_RUN_LINES = [
  c("sends it deep —"), c("Home run."), c("Gone."),
  c("Out of here."), c("He got all of that one."),
  c("Touch 'em all!"), c("Way back and gone!"),
  c("See ya later!"), c("Into the seats!"),
  c("A souvenir for the fans."), c("That ball had a family."),
  c("Kiss it goodbye."), c("Forget about it."), c("Moonshot!"),
  c("He knew it off the bat.", 'uncommon'),
  c("No doubt about that one.", 'uncommon'),
  c("A long drive into the seats.", 'uncommon'),
  c("Crushed it.", 'uncommon'), c("Hit a ton.", 'uncommon'),
  c("That's headed for tomorrow's newspaper.", 'uncommon'),
  c("That baseball may need a passport.", 'rare'),
  c("Somewhere a windshield is in danger.", 'rare'),
  c("That one is halfway to St. Louis.", 'rare'),
  c("Light tower power!", 'rare'),
  c("Call the highway patrol — that ball is leaving town.", 'rare'),
];

// =========== WILD PITCH ===========
const WILD_PITCH_LINES = [
  c("Wild pitch."), c("The pitch gets away."),
  c("Runner advances on the wild pitch."),
  c("Backstop special."), c("Nobody's catching that one."),
  c("All the way to the screen."),
  c("That one had a mind of its own."), c("The catcher never had a chance."),
  c("Lost control completely.", 'uncommon'),
  c("Spiked it badly.", 'uncommon'),
  c("A costly mistake.", 'uncommon'),
  c("That's one he'd like back.", 'uncommon'),
];

// =========== GROUNDOUT ===========
const GROUNDOUT_LINES = [
  c("grounds out to short."), c("grounds out to second."),
  c("grounds out to third."), c("grounds out to the pitcher."),
  c("grounds out to first."),
  c("ground ball to short."), c("routine groundout."),
  c("retired on a ground ball."),
  c("groundout — an easy hopper."), c("two hops and a throw — groundout."), c("routine as can be — groundout."),
  c("right at 'em — groundout.", 'uncommon'),
  c("groundout — nothing doing there.", 'uncommon'),
  c("groundout — good fundamentals.", 'uncommon'),
  c("ropes a one-hopper — snared on a hop.", 'rare'),
  c("a tailor-made double play ball — but only one out.", 'rare'),
  // Universal batted-ball calls
  c("A high chopper toward third — got him.", 'uncommon'),
  c("A hard one-hopper to second — routine out.", 'uncommon'),
  c("A slow roller up the first-base line — just not fast enough.", 'uncommon'),
  c("A little squibber toward first — he's out.", 'uncommon'),
  c("A ground ball back through the box — pitcher makes the play.", 'uncommon'),
  c("A sharp grounder to the left side — retires him.", 'uncommon'),
  c("A big Baltimore chop — third baseman waits and guns him down.", 'rare'),
  c("A wicked one-hop shot — nice play, groundout.", 'rare'),
];

// =========== INFIELD GROUNDOUT — SOFTLY HIT ===========
const SOFT_GROUNDOUT_LINES = [
  c("A soft ground ball is handled for the out."),
  c("He taps one weakly on the infield."),
  c("A slow roller gives the defense plenty of time."),
  c("He dribbles one into the dirt."),
  c("A softly hit grounder is gathered in cleanly."),
  c("He chops a weak ball into the infield."),
  c("A little roller is handled without trouble."),
  c("He gets jammed and sends a slow ground ball forward."),
  c("A soft bouncer is fielded and thrown across for the out."),
  c("He barely gets a piece of it, and the grounder is routine."),
  c("A weak tapper rolls harmlessly to the defense."),
  c("He sends a slow chopper toward the middle."),
  c("A softly struck ball stays on the infield."),
  c("He rolls one over for an easy play."),
  c("A little squibber is handled in plenty of time."),
  c("He chops down on the pitch and sends a slow roller."),
  c("A weak ground ball is picked up cleanly."),
  c("He taps one off the end of the bat."),
  c("A slow bouncer gives the defense no trouble."),
  c("He sends a soft grounder directly into the defense."),
  c("A gentle roller is turned into a routine out."),
  c("He gets tied up and dribbles one forward."),
  c("A weakly hit ground ball never has a chance to get through."),
  c("He rolls one slowly across the dirt."),
  c("A soft chopper is handled before he can reach the bag."),
  c("He fights off the pitch but sends it harmlessly on the ground."),
  c("A little tapper produces an easy out."),
  c("He sends a slow-moving grounder into waiting hands."),
  c("A weak bouncer is fielded cleanly."),
  c("He makes contact, but the ball dies on the infield."),
];

// =========== INFIELD GROUNDOUT — HARD-HIT ===========
const HARD_GROUNDOUT_LINES = [
  c("A hard ground ball is handled for the out."),
  c("He smashes one on the ground, but right at the defense."),
  c("A sharp grounder is fielded cleanly."),
  c("He hits it hard, but straight into the infield."),
  c("A scorching ground ball is turned into an out."),
  c("He rifles one along the dirt, but it is handled."),
  c("A hard bouncer is knocked down and secured."),
  c("He sends a rocket on the ground, but the play is made."),
  c("A sharply hit grounder finds a waiting glove."),
  c("He drills one through the infield, but the defense cuts it off."),
  c("A hot shot is fielded on the backhand."),
  c("He hammers the pitch into the ground, but it becomes an out."),
  c("A blistering ground ball is kept in front."),
  c("He smokes one along the dirt, but it is handled cleanly."),
  c("A hard chopper is gathered in for the play."),
  c("He turns on the pitch and sends a bullet on the ground."),
  c("A sharply struck ball is stopped before it can reach the outfield."),
  c("He hits a one-hopper that is fielded cleanly."),
  c("A sizzling grounder is handled on pure reaction."),
  c("He barrels it, but the ball goes directly to the defense."),
  c("A hard shot takes a tricky hop, but the play is completed."),
  c("He sends a vicious ground ball across the infield."),
  c("A sharply hit bouncer is picked cleanly."),
  c("He crushes it on the ground, but there is no opening."),
  c("A hard grounder nearly gets through, but the defense makes the play."),
  c("He hits it on the screws, but into the dirt and straight at somebody."),
  c("A screaming ground ball is cut off."),
  c("He sends a missile along the ground, but the out is recorded."),
  c("A hot smash is fielded and thrown across in time."),
  c("He could not have hit it much harder, but it still becomes a groundout."),
];

// =========== FLYOUT ===========
const FLYOUT_LINES = [
  c("flies out to"), c("fly ball to left —"), c("routine flyout —"),
  c("easy play —"),
  c("can of corn —"), c("camping under it —"),
  c("routine fly ball —"),
  c("easy chance for the outfielder —", 'uncommon'),
  c("fielder barely had to move —", 'uncommon'),
  c("routine fly ball —", 'uncommon'),
  // Universal batted-ball calls
  c("A soft fly ball — right at the center fielder.", 'uncommon'),
  c("A medium fly ball — routine catch.", 'uncommon'),
  c("A high fly ball — stays in the park, caught.", 'uncommon'),
  c("A towering pop-up — fielder settles under it.", 'uncommon'),
  c("A shallow fly — outfielder charges, makes the play.", 'uncommon'),
  c("A fly ball hit directly at the outfielder — no play needed.", 'uncommon'),
  c("A dying quail toward right — outfielder comes in and makes the catch.", 'rare'),
  c("A towering fly to the warning track — caught at the wall.", 'rare'),
];

// =========== OUTFIELD FLY-OUT — SHALLOW ===========
const SHALLOW_FLYOUT_LINES = [
  c("A shallow fly ball hangs up for the catch."),
  c("He lifts a soft fly into shallow outfield territory."),
  c("A little flare stays in the air long enough to be caught."),
  c("He sends a lazy fly just beyond the infield."),
  c("A soft fly ball is gathered in without trouble."),
  c("He gets under it and lifts a short fly."),
  c("A shallow fly drifts into waiting hands."),
  c("He floats one into the outfield, but it does not carry."),
  c("A gentle fly ball is caught on the move."),
  c("He lifts a weak fly that never threatens the gap."),
  c("A short fly ball drops neatly into a glove."),
  c("He gets jammed and sends a soft fly into shallow territory."),
  c("A looping fly is caught before it can fall."),
  c("He sends a modest fly ball into easy range."),
  c("A soft, hanging fly produces a routine out."),
  c("He gets beneath the pitch, but only sends it a short distance."),
  c("A shallow fly ball is tracked down with room to spare."),
  c("He lifts a little fly that stays up too long."),
  c("A weak fly is caught before reaching open grass."),
  c("He sends a harmless fly into the outfield."),
  c("A short fly ball is taken at chest height."),
  c("He punches one into the air, but it is easily handled."),
  c("A soft fly drifts toward the line and is caught."),
  c("He lifts it just beyond the dirt, but not far enough."),
  c("A shallow fly ball gives the defense plenty of time."),
  c("He sends a little parachute into waiting hands."),
  c("A blooping fly stays up for the out."),
  c("He does not get all of it, and the fly is caught easily."),
  c("A soft fly ball settles harmlessly into a glove."),
  c("He lifts a weak one into shallow outfield territory."),
];

// =========== OUTFIELD FLY-OUT — MEDIUM ===========
const MEDIUM_FLYOUT_LINES = [
  c("A routine fly ball is hit to medium depth."),
  c("He sends a fly ball well into the outfield, but it is playable."),
  c("A high fly hangs long enough for an easy catch."),
  c("He lifts one to comfortable outfield depth."),
  c("A well-hit fly ball is tracked down without difficulty."),
  c("He sends it into the air, but not far enough to cause trouble."),
  c("A medium-deep fly is caught in stride."),
  c("He gets under the pitch and lifts a routine fly."),
  c("A high fly ball drifts toward the gap and is handled."),
  c("He sends one deep enough to make the defense move, but not worry."),
  c("A fly ball carries into the outfield and settles into a glove."),
  c("He lifts a playable fly to medium depth."),
  c("A steady fly ball gives plenty of time to get underneath it."),
  c("He sends it high, but there is no real danger."),
  c("A routine fly is caught a few steps from the warning track."),
  c("He makes solid contact, but the ball stays in the park easily."),
  c("A medium fly ball is tracked from the moment it leaves the bat."),
  c("He lifts it toward the gap, but the play is made."),
  c("A high fly carries well before being caught."),
  c("He sends a fly ball deep enough for a comfortable read."),
  c("A routine outfield fly is pulled in cleanly."),
  c("He gets beneath it and sends it to ordinary depth."),
  c("A high fly ball is caught with time to set the feet."),
  c("He drives one into the air, but right into the defense's range."),
  c("A medium-depth fly is gathered in for the out."),
  c("He lifts a fly that briefly looks promising but loses steam."),
  c("A routine fly ball is caught after a few steps."),
  c("He sends it high and playable into the outfield."),
  c("A fly ball carries into open space, but not beyond reach."),
  c("He gets decent contact, but the defense has it measured."),
];

// =========== OUTFIELD FLY-OUT — DEEP ===========
const DEEP_FLYOUT_LINES = [
  c("A deep fly ball is caught near the warning track."),
  c("He drives it a long way, but not quite far enough."),
  c("A towering fly carries deep into the outfield."),
  c("He sends one toward the wall, but it is tracked down."),
  c("A long fly ball dies just short of the fence."),
  c("He gets all of it, but the ball stays in the park."),
  c("A deep drive is caught with room running out."),
  c("He sends a high fly to the deepest part of the yard."),
  c("A long fly ball is hauled in near the wall."),
  c("He gives it a ride, but the defense has it measured."),
  c("A deep fly carries to the warning track for the out."),
  c("He drives one toward the fence, but it falls short."),
  c("A towering shot stays up long enough to be caught."),
  c("He hits it well, but the ballpark holds it."),
  c("A deep fly ball sends the defense all the way back."),
  c("He puts a charge into it, but it is caught before the wall."),
  c("A long drive fades at the last moment."),
  c("He sends one deep, but there is just enough room."),
  c("A high, deep fly is caught with a step or two to spare."),
  c("He nearly gets it out of here, but not quite."),
  c("A booming fly ball is taken near the fence."),
  c("He turns on the pitch and drives it deep for an out."),
  c("A long fly reaches the warning track and goes no farther."),
  c("He sends a drive toward the wall, but the park contains it."),
  c("A deep fly ball is caught just shy of extra bases."),
  c("He barrels it up, but it becomes a long out."),
  c("A towering drive loses steam at the edge of the park."),
  c("He sends one to the wall, where it is caught."),
  c("A deep fly ball briefly brings the crowd to its feet."),
  c("He gives it a tremendous ride, but the defense makes the play."),
];

// =========== OUTFIELD LINE-OUT ===========
const OUTFIELD_LINEOUT_LINES = [
  c("A sharp line drive is caught for the out."),
  c("He lines it hard, but right at the defense."),
  c("A well-struck liner finds a glove."),
  c("He squares it up, but has nothing to show for it."),
  c("A hard shot is taken out of the air."),
  c("He sends a rope into the outfield, but it is caught."),
  c("A sinking liner is grabbed before it can drop."),
  c("He rifles the ball, but it goes directly to the defense."),
  c("A line drive streaks into the outfield and is caught."),
  c("He hits it on the screws, but right at somebody."),
  c("A firm liner hangs up just long enough."),
  c("He lashes the pitch, but there is no open ground."),
  c("A low line drive is taken cleanly."),
  c("He drives it on a line, but the defense has it measured."),
  c("A frozen rope is caught for the out."),
  c("He barrels the ball, but sends it to the wrong place."),
  c("A crisp line drive is gathered in."),
  c("He smokes one, but it stays within reach."),
  c("A rising liner is caught in stride."),
  c("He makes solid contact, but the ball finds leather."),
  c("A hard line drive is tracked down."),
  c("He sends a bullet into the outfield, but the play is made."),
  c("A sharply struck ball is caught at chest height."),
  c("He turns on the pitch and lines it directly to the defense."),
  c("A sinking shot is caught just above the grass."),
  c("He drills the ball, but it becomes a loud out."),
  c("A laser comes off the bat and is caught."),
  c("He hits it hard enough, but not where he needed to."),
  c("A screaming line drive is hauled in."),
  c("He could not have hit it much better, but it is still an out."),
];

// =========== DOUBLE PLAY ===========
const DOUBLE_PLAY_LINES = [
  c("grounds into a double play."),
  c("Double play."), c("Two away."), c("Around the horn for two."),
  c("Twin killing!"), c("Just what the doctor ordered!", 'uncommon'),
  c("Two for one special!"), c("That's a rally killer!"),
  c("Erased in a hurry!"),
  c("Textbook double play.", 'uncommon'),
  c("They turned it beautifully.", 'uncommon'),
  c("Smooth as silk.", 'uncommon'),
  c("Six-four-three if you're scoring at home.", 'rare'),
  c("Inning over on one swing of the bat.", 'rare'),
];

// =========== END OF INNING ===========
const END_INNING_LINES = [
  c("Side retired."), c("Three away."), c("That ends the inning."),
  c("That's all for this half inning."), c("Time to switch sides."),
  c("The threat is over."), c("Nobody left standing."),
  c("They'll head back to the dugout.", 'uncommon'),
  c("The side goes down in order.", 'uncommon'),
  c("Clean inning for the defense.", 'uncommon'),
  c("Nothing across that inning.", 'uncommon'),
  c("That's a quick one — grab a hot dog.", 'rare'),
];

// =========== LINE DRIVE / LINEOUT ===========
const LINEOUT_LINES = [
  c("lines it right at"), c("smokes one toward"),
  c("rips a liner — snared by"), c("hard liner to"),
  c("laser shot right at"),
  c("lines it — leaping grab by"),
  c("smokes one — stabbed by"), c("ropes a liner — picked clean by"),
  c("line drive — caught by", 'uncommon'),
  c("rips one right on the screws — snared by", 'uncommon'),
  c("robbed! That was smoked by", 'rare'),
  // Universal batted-ball calls
  c("A frozen rope — right at", 'uncommon'),
  c("A scorching line drive — snared by", 'uncommon'),
  c("A bullet off the bat — caught by", 'uncommon'),
  c("A vicious liner — snagged by", 'uncommon'),
  c("A sharp one-hopper — stabbed by", 'rare'),
  c("A screaming drive — grabbed by", 'rare'),
];

// =========== POPOUT ===========
const POPOUT_LINES = [
  c("pops it up behind the plate —"), c("Infield pop-up —"),
  c("pops one up in foul territory —"),
  c("calls for it and makes the catch."), c("makes the grab."),
  c("makes the play."),
  c("Pop-up on the infield —", 'uncommon'),
  c("Sky-high pop-up — the infield converges.", 'uncommon'),
];

// =========== FOUL BALLS ===========
const FOUL_BALL_LINES = [
  c("Fouled straight back."),
  c("He sends it into the seats."),
  c("A sharp foul off to the side."),
  c("He gets a piece and stays alive."),
  c("Fouled away out of play."),
  c("He spoils the pitch."),
  c("A late swing sends it foul."),
  c("He turns on it, but pulls it foul."),
  c("The ball slices into foul territory."),
  c("He fights it off and remains at the plate."),
  c("A hard foul rattles into the stands."),
  c("He just misses and sends it back out of play."),
  c("The pitch is fouled off near the screen."),
  c("He reaches for it and flips it foul."),
  c("A defensive swing keeps the at-bat going."),
  c("He chops it foul near the plate."),
  c("The ball skips into foul ground."),
  c("He hooks it foul by a few feet."),
  c("A towering foul ball drifts out of play."),
  c("He gets jammed and sends it foul."),
  c("A slicing foul carries toward the seats."),
  c("He stays alive with a foul tip."),
  c("The ball is tipped straight back."),
  c("He fouls it off the end of the bat."),
  c("A hard swing produces only a foul ball."),
  c("He was out in front and pulled it foul."),
  c("A late cut sends it the other way and foul."),
  c("He barely gets enough bat on it to extend the at-bat."),
  c("The pitch runs in, and he fights it foul."),
  c("He spoils another tough offering."),
  c("A sharp foul shoots out of play."),
  c("He sends a souvenir into the crowd."),
  c("The ball tails foul before it can drop."),
  c("He gets underneath it and sends it foul."),
  c("A high foul ball carries beyond reach."),
  c("He chops another one into foul territory."),
  c("The pitch is nicked back to the screen."),
  c("He protects the plate and fouls it away."),
  c("A long foul ball has the crowd reacting."),
  c("He gets around on it, but not quite fair."),
  c("The ball lands just outside the line."),
  c("He rips it foul down the side."),
  c("A soft foul dribbles away from the plate."),
  c("He checks his swing and still makes foul contact."),
  c("The bat catches just enough to send it out of play."),
  c("He battles off the pitch and lives for another one."),
  c("A foul ball keeps the count right where it is."),
  c("He sends it back over the roof."),
  c("The offering is turned around, but well foul."),
  c("He nearly squares it up, but the ball bends foul."),
];

// =========== STRIKEOUT SWINGING (name prefixed) ===========
const STRIKEOUT_SWINGING_LINES = [
  c("goes down swinging!"), c("can't catch up — strike three!"),
  c("whiffs on strike three!"),
  c("fans on a wicked"),
  c("chases a nasty"),
  c("buckles at a sharp"),
  c("flails at a filthy"),
  c("goes down hacking at a"),
  c("waves at a devastating"),
  c("can't catch up to a blazing"),
  c("whiffs on a knee-buckling"),
  c("swings right through it — out!"),
  c("chases one out of the zone — struck out!"),
  c("swings and misses — struck out!"),
  c("flails and misses — strike three!"),
  c("flails at one in the dirt — strikeout!"),
  c("couldn't lay off the high heat — strike three!", 'uncommon'),
  c("swings right over the top of it — strike three!", 'uncommon'),
  c("a big cut — and a big miss — strike three!", 'rare'),
];

// =========== CALLED STRIKEOUT (name prefixed) ===========
const STRIKEOUT_CALLED_LINES = [
  c("called out on strikes!"), c("frozen — strike three!"),
  c("watches strike three go by!"), c("caught looking!"),
  c("can't believe it — called strike three!"),
  c("goes down looking — strike three!", 'uncommon'),
  c("never took the bat off his shoulder — strike three!", 'uncommon'),
  c("Frozen like a statue at the plate — strike three!", 'rare'),
];

// =========== CAUGHT STEALING — PLAY-BY-PLAY ===========
const CAUGHT_STEALING_LINES = [
  c("The runner goes, and the throw is there in time."),
  c("He breaks for the next bag and is cut down."),
  c("The runner takes off, but the defense is ready."),
  c("A strong throw beats him to the bag."),
  c("He gets a good jump, but not a good enough one."),
  c("The runner is thrown out trying to steal."),
  c("He takes off and is erased on the bases."),
  c("The pitch is handled cleanly, and the runner is nailed."),
  c("He challenges the arm and loses."),
  c("The runner breaks, and the tag is applied in time."),
  c("He tries to swipe the bag, but the throw beats him."),
  c("The runner is caught stealing by a step."),
  c("He goes on the pitch, and the defense cuts him down."),
  c("The throw arrives just ahead of the runner."),
  c("He had the idea, but the defense had the answer."),
  c("The runner takes off and runs into an out."),
  c("A quick release produces a caught stealing."),
  c("He tries to get aggressive and pays for it."),
  c("The runner is out on a close play at the bag."),
  c("He breaks late and never has a chance."),
  c("The throw is right on the money, and the runner is gone."),
  c("He attempts the steal, but the tag beats him."),
  c("The runner gets a jump, but the ball gets there first."),
  c("He is cut down trying to move into scoring position."),
  c("The defense snuffs out the stolen-base attempt."),
  c("He takes off, and the throw is waiting for him."),
  c("The runner is caught leaning and thrown out."),
  c("He tries to steal the base, but the battery wins the battle."),
  c("The throw is strong, the tag is quick, and the runner is out."),
  c("He gambles on the steal and comes up empty."),
];

// =========== BUNT SINGLE ===========
const BUNT_SINGLE_LINES = [
  c("lays down a bunt single!"), c("drops a perfect bunt!"),
  c("bunts his way on!"), c("beats out the bunt!"),
  c("With the drag bunt — he's safe!", 'uncommon'),
];

// =========== SACRIFICE BUNT ===========
const SACRIFICE_BUNT_LINES = [
  c("lays down the sacrifice —"), c("drops the sac bunt —"),
  c("gets the bunt down —"),
  c("sacrifice bunt is down —", 'uncommon'),
];

// =========== SACRIFICE FLY ===========
const SAC_FLY_LINES = [
  c("hits a sacrifice fly —"), c("lifts a sacrifice fly —"),
  c("sends one deep enough —"),
  c("sac fly does the job.", 'uncommon'),
];

// =========== STEAL ===========
const STEAL_LINES = {
  success: [
    c("steals second!"), c("steals third!"), c("steals home!"),
    c("swipes second!"), c("swipes third!"),
    c("takes second easily."), c("picks up the steal."),
    c("He got a great jump.", 'uncommon'),
    c("The throw isn't even close.", 'uncommon'),
  ],
  caught: [
    c("caught stealing second!"), c("caught stealing third!"),
    c("caught stealing home!"), c("gunned down at second!"),
    c("gunned down at third!"),
    c("thrown out — bad read all the way."),
    c("he's out — that's a rally killer."),
    c("The catcher nails him!", 'uncommon'),
    c("Not even close — he's out by a mile.", 'uncommon'),
    c("That one's going to sting.", 'uncommon'),
    c("And the crowd lets him hear it.", 'uncommon'),
  ],
};

// =========== ERROR ===========
const ERROR_LINES = [
  c("boots it!"), c("can't handle it!"), c("muffs it!"),
  c("lets it go through the wickets!"),
  c("That's an error — he'll want that one back.", 'uncommon'),
  c("Routine chance — and he drops it.", 'rare'),
];

// =========== CALLED BALL — FASTBALL ===========
const CALLED_BALL_FASTBALL_LINES = [
  c("Fastball misses outside."), c("The heater sails high for a ball."), c("Fastball down and away."),
  c("He lays off the fastball off the plate."), c("The fastball misses just below the knees."), c("High heat, but too high."),
  c("The pitcher misses with the fastball inside."), c("That fastball runs off the outside edge."), c("The heater is up and out of the zone."),
  c("Fastball low, and the batter lets it go."), c("He takes the fastball just off the corner."), c("The pitch misses inside and backs him away."),
  c("A hard fastball, but it never finds the plate."), c("The heater rides above the strike zone."), c("Fastball outside, and the count moves in the hitter's favor."),
  c("He wisely lays off the high fastball."), c("The fastball tails too far inside."), c("The pitcher tries the outside corner but misses."),
  c("A low fastball bounces just before the plate."), c("The heater misses by a few inches."), c("Fastball at the letters, but the umpire says ball."),
  c("He does not chase the fastball above the zone."), c("The fastball is well outside."), c("That one had plenty of speed but not enough control."),
  c("The pitcher overthrows it and misses high."), c("Fastball down near the dirt."), c("The heater nearly clips him inside."),
  c("He pulls back as the fastball runs in."), c("The pitch catches glove but not plate."), c("Fastball just off the black."),
];

// =========== CALLED BALL — BREAKING BALL ===========
const CALLED_BALL_BREAKING_LINES = [
  c("Breaking ball misses outside."), c("The curveball drops below the zone."), c("He lays off the slider in the dirt."),
  c("The breaker sweeps too far away."), c("A curveball starts high and never drops enough."), c("The slider misses off the outside corner."),
  c("He does not chase the breaking ball down."), c("The curve bounces in front of the plate."), c("The breaker spins harmlessly outside."),
  c("That slider never threatened the strike zone."), c("The curveball hangs high but still misses."), c("He watches the breaking ball dive beneath the knees."),
  c("A sweeping slider finishes well off the plate."), c("The hook misses low and away."), c("The breaker backs up and stays outside."),
  c("He takes a tight slider just off the corner."), c("The curve slips beneath the bottom of the zone."), c("That breaking ball breaks too soon."),
  c("He holds up as the slider disappears outside."), c("The hook finishes in the dirt."), c("A backdoor breaking ball fails to come back."),
  c("The curve starts outside and stays there."), c("The slider misses beneath the barrel and the plate."), c("He shows good patience on the low breaker."),
  c("The breaking ball never turns the corner."), c("The curveball misses by a narrow margin."), c("The slider dives away from both hitter and strike zone."),
  c("He lets the breaking ball pass harmlessly."), c("The breaker nearly clips the outside edge."), c("The umpire refuses to give him the corner."),
];

// =========== CALLED BALL — CHANGEUP ===========
const CALLED_BALL_CHANGEUP_LINES = [
  c("Changeup misses low."), c("The changeup fades outside."), c("He lays off the off-speed pitch in the dirt."),
  c("The pitcher takes something off but misses the zone."), c("A sinking changeup drops beneath the knees."), c("The changeup drifts off the outside corner."),
  c("He waits and lets the soft pitch go by."), c("The off-speed offering finishes too low."), c("The changeup fades away from the plate."),
  c("He does not chase the change below the zone."), c("The pitcher pulls the string, but the pitch misses."), c("A soft changeup settles into the dirt."),
  c("The changeup stays high and outside."), c("That off-speed pitch never gets back to the corner."), c("He recognizes the changeup and takes it."),
  c("The change fades just beyond the reach of the strike zone."), c("The pitch dies before reaching the plate."), c("A well-disguised changeup, but it misses low."),
  c("He shows patience against the off-speed offering."), c("The changeup tumbles too far inside."), c("The pitcher misses down and away with the change."),
  c("The batter keeps the bat on his shoulder."), c("The changeup floats high for a ball."), c("He refuses to offer at the fading pitch."),
  c("The off-speed pitch finishes just beneath the zone."), c("The changeup nearly catches the corner."), c("He reads it well and lets it pass."),
  c("The pitcher cannot quite locate the softer offering."), c("The changeup runs away from the strike zone."), c("A good take on a deceptive pitch."),
];

// =========== CALLED BALL — GENERIC ===========
const CALLED_BALL_GENERIC_LINES = [
  c("Ball outside."), c("The pitch misses low."), c("That one is high."), c("Inside for a ball."),
  c("He takes it off the plate."), c("The pitch misses the outside corner."), c("Just below the knees."), c("He lays off that one."),
  c("The umpire calls it a ball."), c("That pitch never finds the zone."), c("He takes a close one outside."), c("The offering is low and away."),
  c("The pitch sails high."), c("He backs away from the inside pitch."), c("That one misses by a few inches."), c("The catcher reaches, but the umpire says ball."),
  c("The pitch is just off the black."), c("He shows good discipline and takes it."), c("The count moves in the batter's favor."), c("A borderline pitch is called outside."),
  c("The umpire will not give him the corner."), c("He refuses to chase."), c("That one is nowhere near the plate."), c("The pitch bounces in front of the catcher."),
  c("He takes it in the dirt."), c("The offering misses up and away."), c("The pitch runs too far inside."), c("He leans back as it comes close."),
  c("That one nearly brushes him."), c("The batter checks and lets it go."), c("The pitch is low, and the catcher blocks it."), c("He watches it sail outside."),
  c("The pitcher misses his target."), c("The catcher has to reach across the plate."), c("A close take, and the batter gets the call."), c("The umpire shakes his head—ball."),
  c("That pitch is off the edge."), c("He shows patience at the plate."), c("The offering never tempts him."), c("The pitcher falls behind with that miss."),
];

// =========== SWINGING STRIKE — FASTBALL ===========
const SWINGING_STRIKE_FASTBALL_LINES = [
  c("He swings through the fastball."), c("Fastball by him for a strike."), c("He comes up empty on the heater."),
  c("The fastball blows right past him."), c("He takes a healthy cut and misses."), c("High heat, and he cannot catch up."),
  c("The pitcher reaches back and throws it by him."), c("He was late on that fastball."), c("The heater wins that battle."),
  c("He swings underneath the fastball."), c("The fastball explodes past the bat."), c("Nothing but air against that heater."),
  c("He could not get the bat around in time."), c("The pitcher challenges him, and he swings right through it."), c("A hard fastball beats him upstairs."),
  c("He chases the rising fastball and misses."), c("The bat arrives after the ball is already in the mitt."), c("Straight heat, straight past him."),
  c("He takes a full cut but cannot touch it."), c("That fastball had a little extra behind it."), c("He was geared for something slower and missed the heater."),
  c("The fastball ties him up for a swinging strike."), c("He tries to pull the inside fastball and comes up empty."), c("The pitcher pours on the gas, and the batter cannot catch it."),
  c("A late swing against a lively fastball."), c("He waves at the high fastball."), c("The heater runs away from the barrel."),
  c("He swings over the fastball at the knees."), c("The fastball jumps through the zone before he can react."), c("He knew it was coming and still could not catch up."),
];

// =========== SWINGING STRIKE — BREAKING BALL ===========
const SWINGING_STRIKE_BREAKING_LINES = [
  c("He swings over the breaking ball."), c("The curveball gets him fishing."), c("He comes up empty on the breaker."),
  c("A sharp slider disappears beneath the bat."), c("He chases the curve into the dirt."), c("The breaking ball bends away from his swing."),
  c("He waves at a slider off the outside corner."), c("That curveball pulled the string on him."), c("He swings where the ball used to be."),
  c("The breaker dives beneath the barrel."), c("He cannot hold up on the low curve."), c("The slider sweeps past the bat."),
  c("A wicked breaking ball gets the swinging strike."), c("He reaches for the outside slider and misses."), c("The curve drops off the table."),
  c("That breaking ball had him badly fooled."), c("He chases the hook out of the zone."), c("The slider starts at the plate and finishes beyond the bat."),
  c("He lunges after the breaking ball and comes up empty."), c("The curveball buckles him and draws a late swing."), c("He bites on the back-foot breaking ball."),
  c("The breaker tumbles underneath his hands."), c("He tries to check his swing but goes too far."), c("The slider darts sharply away from the barrel."),
  c("He was looking fastball and had no chance against that curve."), c("The breaking ball leaves him reaching."), c("He swings across the top of a low slider."),
  c("The hook has him completely out in front."), c("He offers at a pitch that never reaches the plate."), c("The curveball finishes in the dirt, and the bat follows it down."),
];

// =========== SWINGING STRIKE — CHANGEUP ===========
const SWINGING_STRIKE_CHANGEUP_LINES = [
  c("He swings through the changeup."), c("The change of speed has him out in front."), c("He comes up empty on the off-speed pitch."),
  c("The pitcher pulls the string, and the batter misses."), c("He swings before the changeup arrives."), c("That changeup completely fools him."),
  c("He is way out in front of the pitch."), c("The changeup fades beneath the bat."), c("He lunges and misses the off-speed offering."),
  c("The batter was expecting heat and got something soft."), c("He swings over a sinking changeup."), c("The changeup leaves him reaching."),
  c("He cannot keep his hands back."), c("The pitcher takes something off, and the batter supplies only air."), c("A beautifully disguised changeup gets the swinging strike."),
  c("He is committed far too early."), c("The changeup tumbles away from the barrel."), c("He tries to adjust but cannot slow the bat."),
  c("That pitch had him fooled from the moment it left the hand."), c("He swings at the fastball that never arrived."), c("The off-speed pitch dies beneath his swing."),
  c("He chases the fading changeup outside."), c("The changeup has him leaning over the plate."), c("He reaches and comes up empty."),
  c("The pitcher changes speeds and wins the battle."), c("He swings well ahead of the ball."), c("The changeup falls away after drawing the commitment."),
  c("He cannot wait long enough to make contact."), c("The batter's timing is completely disrupted."), c("He was sitting fastball, and the changeup made him look foolish."),
];

// =========== SWINGING STRIKE — GENERIC ===========
const SWINGING_STRIKE_GENERIC_LINES = [
  c("Swing and a miss."), c("He comes up empty."), c("He takes a cut but misses."), c("Nothing but air on that swing."),
  c("He cannot make contact."), c("The batter offers and misses."), c("He waves at that one."), c("A mighty swing, but no contact."),
  c("He swings right through it."), c("The pitch beats the bat."), c("He takes his cut and comes up empty."), c("The catcher squeezes it after the miss."),
  c("He misses badly on that offering."), c("The batter is unable to pull the trigger in time."), c("He chases it out of the zone."), c("A defensive swing produces nothing."),
  c("He reaches for it and misses."), c("The pitcher gets him to offer."), c("He could not lay off that one."), c("The bat never finds the ball."),
  c("He swings underneath it."), c("He swings over the top."), c("A late swing and a miss."), c("He is out in front and misses."),
  c("The batter was fooled on that pitch."), c("He gets nothing but the breeze."), c("The pitch slips past the barrel."), c("He takes a big cut and finds only air."),
  c("He tries to check the swing but cannot stop it."), c("The umpire signals that he went around."), c("He was committed and could not adjust."), c("The pitch finishes well away from the bat."),
  c("He takes an awkward swing and misses."), c("The pitcher wins that exchange."), c("He chases a pitch he could not reach."), c("The batter guesses wrong."),
  c("He offers at a pitcher's pitch and misses."), c("The ball is safely in the catcher's glove before the swing is finished."), c("He had the right idea but missed the execution."), c("A clean swing, but the ball avoids the barrel."),
];

// =========== TAKEN STRIKE — FASTBALL ===========
const TAKEN_STRIKE_FASTBALL_LINES = [
  c("Fastball taken for a strike."),
  c("He watches the heater cross the plate."),
  c("A fastball whistles in for a called strike."),
  c("Straight heat, and he never offered."),
  c("The fastball catches the outside corner."),
  c("He takes a fastball right down Broadway."),
  c("A good hard fastball finds the zone."),
  c("The heater paints the inside corner."),
  c("Fastball at the knees—called strike."),
  c("He lets a belt-high fastball go by."),
  c("The fastball clips the black."),
  c("Smoke on the outside edge, and it is a strike."),
  c("He freezes as the fastball catches the corner."),
  c("A rising fastball taken for strike one."),
  c("The pitcher pumps one right through the zone."),
  c("That fastball had plenty on it, but the batter watched it."),
  c("A letter-high fastball gets the call."),
  c("The heater sneaks across the lower edge."),
  c("Fastball on the hands, and the umpire rings up a strike."),
  c("He takes the express right through the strike zone."),
  c("A firm fastball catches just enough plate."),
  c("The pitcher challenges him, and the fastball is called a strike."),
  c("He was looking for something else as the heater went by."),
  c("The fastball explodes into the mitt for a called strike."),
  c("Nothing fancy there—just a fastball over the plate."),
];

// =========== TAKEN STRIKE — BREAKING BALL ===========
const TAKEN_STRIKE_BREAKING_LINES = [
  c("Breaking ball taken for a strike."),
  c("The curve drops over the plate for a called strike."),
  c("He freezes as the breaking ball bends into the zone."),
  c("A big curveball falls across the outside corner."),
  c("The breaker catches the lower edge."),
  c("He watches that curve tumble in for a strike."),
  c("A sharp breaking ball clips the black."),
  c("The slider sweeps across the outside corner."),
  c("He gives up on it, but it breaks back for a strike."),
  c("The curve starts high and drops neatly into the zone."),
  c("A knee-buckling breaker, and he never moved the bat."),
  c("The slider darts over the inside edge."),
  c("He watches the hook fall in for strike one."),
  c("That breaking ball had him completely locked up."),
  c("A slow curve floats over for a called strike."),
  c("The breaker bends around the corner of the plate."),
  c("He thought it was outside, but it snapped back into the zone."),
  c("A tight slider taken at the knees."),
  c("The curveball kisses the outside corner."),
  c("He takes a sweeping breaking ball for a strike."),
  c("The hook drops in through the back door."),
  c("A backdoor breaking ball steals a strike."),
  c("He watches the slider carve out the lower corner."),
  c("The breaking ball buckles him without drawing a swing."),
  c("That one turned sharply and caught a piece of the plate."),
];

// =========== TAKEN STRIKE — CHANGEUP ===========
const TAKEN_STRIKE_CHANGEUP_LINES = [
  c("Changeup taken for a strike."),
  c("He watches the changeup float across the plate."),
  c("The pitcher takes something off, and it drops in for a strike."),
  c("A well-spotted changeup catches the outside corner."),
  c("He was looking fastball and took the change for a strike."),
  c("The changeup settles into the lower part of the zone."),
  c("He freezes on the off-speed pitch."),
  c("A soft changeup drifts over the plate."),
  c("The pitcher pulls the string, and the batter watches it go by."),
  c("A fading changeup catches the corner."),
  c("He waits for the fastball that never arrives."),
  c("The changeup tumbles in at the knees."),
  c("A fine change of pace earns a called strike."),
  c("He was geared for heat and could only watch that one."),
  c("The changeup fades across the outside edge."),
  c("The pitcher shows him something soft for a strike."),
  c("He takes the off-speed pitch right through the zone."),
  c("A deceptive changeup freezes him at the plate."),
  c("That one arrived late and caught the lower corner."),
  c("The changeup drops gently into the catcher's mitt."),
  c("He recognizes it too late and takes the strike."),
  c("The pitcher subtracts a few miles and steals a strike."),
  c("A sinking changeup finds the bottom of the zone."),
  c("He never pulled the trigger on that well-disguised changeup."),
  c("The change of speed leaves him standing there with the bat on his shoulder."),
];

// =========== TAKEN STRIKE — GENERIC ===========
const TAKEN_STRIKE_GENERIC_LINES = [
  c("Taken for a strike."),
  c("He watches it cross the plate."),
  c("Called strike on the outside corner."),
  c("He takes that one at the knees."),
  c("The pitch catches the inside edge."),
  c("He never offered, and the umpire calls a strike."),
  c("That one clips the corner."),
  c("The batter stands and watches strike one."),
  c("A called strike at the belt."),
  c("He takes a close one, and the pitcher gets the call."),
  c("The pitch catches just enough of the plate."),
  c("He lets that one go by for a strike."),
  c("Right over the outside edge."),
  c("The umpire points to the strike zone."),
  c("He watches that one find the black."),
  c("No swing, but it is a strike."),
  c("The pitch sneaks across the lower corner."),
  c("He was taking all the way."),
  c("The catcher holds it there, and the umpire gives him the strike."),
  c("That one finds the zone."),
  c("The batter disagrees, but the count says strike."),
  c("A borderline pitch goes the pitcher's way."),
  c("He started to offer, held up, and the pitch is called a strike."),
  c("The bat never leaves his shoulder."),
  c("The pitcher steals a strike on the edge."),
  c("He watches a perfectly placed pitch go by."),
  c("The offering catches the upper part of the zone."),
  c("The umpire gives a firm strike call."),
  c("He takes it, and the count moves in the pitcher's favor."),
  c("A quiet take and a loud strike call."),
];

// =========== INFIELD POP-UP — GENERIC PLAY-BY-PLAY ===========
const INFIELD_POPUP_LINES = [
  c("Popped straight up."),
  c("A towering pop-up."),
  c("He gets under it and sends it high into the air."),
  c("Popped into shallow territory."),
  c("A mile-high pop with plenty of time underneath it."),
  c("He gets jammed and lifts a harmless pop-up."),
  c("Popped high near the middle of the diamond."),
  c("A high pop drifting toward foul ground."),
  c("He lifts it almost straight into the air."),
  c("Popped up and playable."),
  c("A routine pop-up with plenty of time to make the catch."),
  c("He gets beneath that pitch and sends it skyward."),
  c("A high pop hanging over the infield."),
  c("Everyone looks up as the ball climbs."),
  c("Popped into foul territory."),
  c("A twisting pop-up sends several defenders toward it."),
  c("He gets tied up and loops it into the air."),
  c("The ball hangs up long enough for an easy play."),
  c("A soft pop-up on the infield."),
  c("He sends a lazy pop into shallow territory."),
  c("A towering pop briefly disappears against the sky."),
  c("Popped high near the line."),
  c("The ball goes almost straight up off the bat."),
  c("He fists it into the air."),
  c("A shallow pop-up with defenders closing in."),
  c("He sends a weak pop toward the center of the diamond."),
  c("One defender calls everyone else away."),
  c("A high foul pop stays within reach."),
  c("The wind begins to carry the pop-up."),
  c("He gets underneath the pitch, and this should be an easy out."),
];

// =========== INFIELD LINE-OUT — SOFT ===========
const INFIELD_LINEOUT_SOFT_LINES = [
  c("A soft liner hangs up for the catch."),
  c("He flips a gentle line drive into waiting hands."),
  c("A looping liner is caught before it can drop."),
  c("He gets just enough of it to send a soft liner into the air."),
  c("A little flare hangs up for an easy play."),
  c("He lifts a soft line drive that never reaches the grass."),
  c("A gentle liner floats directly to the defense."),
  c("He punches a soft line drive, but it stays in the air."),
  c("A lazy liner is gathered in for the out."),
  c("He sends a soft shot toward the middle, and it is caught."),
  c("A sinking liner is taken just before it reaches the ground."),
  c("He gets jammed and floats a liner into shallow territory."),
  c("A softly hit line drive finds a waiting glove."),
  c("He serves a little liner that stays up too long."),
  c("A looping shot is caught on the infield."),
  c("He pokes a soft liner, but there is no opening."),
  c("The ball floats off the bat and directly to the defense."),
  c("A short liner is caught at chest height."),
  c("He places a soft line drive within easy reach."),
  c("A gentle shot hangs in the air long enough for the play."),
  c("He fists a small liner that is caught cleanly."),
  c("A soft sinking shot is taken on the move."),
  c("He sends a modest liner directly into a glove."),
  c("A little humpback liner is caught for the out."),
  c("He reaches for the pitch and loops it into the air."),
  c("A softly struck liner is taken without difficulty."),
  c("The ball comes off the bat gently and stays airborne."),
  c("He drops the barrel on it, but the liner is caught."),
  c("A floating line drive produces a routine out."),
  c("He makes contact, but the soft liner goes directly to the defense."),
];

// =========== INFIELD LINE-OUT — HARD ===========
const INFIELD_LINEOUT_HARD_LINES = [
  c("A sharp line drive is caught for the out."),
  c("He smokes a liner, but it goes directly to the defense."),
  c("A hard shot is speared before it can get through."),
  c("He squares it up, but the line drive is caught."),
  c("A scorching liner finds a glove."),
  c("He drills the ball, but right at the defense."),
  c("A frozen rope is snagged for the out."),
  c("He hits it on the screws, but has nothing to show for it."),
  c("A blistering line drive is caught cleanly."),
  c("He rifles a shot that is taken out of the air."),
  c("A hard liner is knocked down and secured."),
  c("He crushes it, but the ball never reaches the outfield."),
  c("A screaming line drive is snared."),
  c("He sends a rocket across the infield, but it is caught."),
  c("A wicked liner is taken before anyone can react."),
  c("He tattoos the ball, but directly into a glove."),
  c("A line-drive bullet is caught for the out."),
  c("He hammers a shot, but the defense is perfectly positioned."),
  c("A sizzling liner is grabbed on the infield."),
  c("He could not have hit it much harder, but it is an out."),
  c("A sharply struck ball is caught at head height."),
  c("He turns on the pitch and lines it directly to the defense."),
  c("A laser comes off the bat and is somehow caught."),
  c("He rips the ball, but it finds leather instead of open ground."),
  c("A hard sinking liner is caught just above the dirt."),
  c("He sends a missile through the infield, but it is snared."),
  c("A vicious line drive is caught on pure reaction."),
  c("He barrels it up, but hits it to the wrong place."),
  c("The ball jumps off the bat and straight into a glove."),
  c("A terrific piece of contact results in nothing more than an out."),
];

// =========== FIELDER'S CHOICE ===========
const FC_LINES = [
  c("grounds to"), c("bounces one to"),
  c("sharply hit to"), c("taps one to"),
];

// =========== BATTER THROWN OUT STRETCHING ===========
const STRETCH_OUT_LINES = [
  c("is thrown out trying to stretch it into a double!"),
  c("is gunned down at second — too greedy!"),
  c("tries to stretch it and gets thrown out at second!"),
  c("is cut down trying for two!"),
  c("gets thrown out at second — bad decision!"),
  c("is tagged out sliding into second — tried to stretch!"),
  c("rounds first too far and gets thrown out at second!"),
  c("is thrown out trying to turn a single into a double!"),
  c("pushes his luck and is thrown out at second!"),
  c("is gunned down — the throw beats him to second!"),
  c("tries for the extra base and pays for it!", 'uncommon'),
  c("is caught stretching — the throw was right on the money!", 'uncommon'),
  c("is thrown out by a step at second!", 'uncommon'),
  c("rounds the bag and gets tagged out — caught stretching!", 'rare'),
  c("is thrown out trying to stretch it into a triple!", 'uncommon'),
  c("is gunned down at third — going for the triple!", 'uncommon'),
  c("is cut down at third trying to stretch a double!"),
  c("is thrown out at third — greed got the better of him!"),
  c("is tagged out at third trying to turn two into three!"),
  c("is gunned down at third — the relay was perfect!"),
  c("is thrown out at home trying for the inside-the-parker!", 'rare'),
  c("is cut down at the plate — just short of glory!", 'rare'),
];

// =========== BATTER STRETCH SUCCESS ===========
const STRETCH_SUCCESS_LINES = [
  c("stretches it into a double — safe at second!"),
  c("takes the extra base — safe at second with a double!"),
  c("makes it to second standing up — he stretched it!"),
  c("slides in safe at second — turned it into a double!"),
  c("stretches the single into a double — good hustle!"),
  c("turns on the speed and makes it to second!"),
];

// ── Stretch double→triple success (distinct pool so single→double never says "triple") ──
const STRETCH_SUCCESS_DOUBLE_TRIPLE_LINES = [
  c("stretches it into a triple — safe at third!"),
  c("makes it to third — he turned it into a triple!"),
  c("legs out the triple — safe at third standing up!"),
  c("turns the double into a triple with his speed!"),
];

// ── Stretch triple→HR success (inside-the-park home run) ──
const STRETCH_SUCCESS_TRIPLE_HR_LINES = [
  c("rounds the bases for an inside-the-park home run!"),
  c("legs it all the way home — inside-the-park homer!"),
  c("circles the bases — an inside-the-park home run!"),
];

// =========== RUNNER THROWN OUT AT THIRD ===========
const RUNNER_OUT_AT_THIRD_LINES = [
  c("is thrown out at third trying to take the extra base!"),
  c("is gunned down at third — the throw was perfect!"),
  c("is cut down trying for third on the single!"),
  c("gets thrown out at third — too aggressive!"),
  c("is tagged out sliding into third!"),
  c("is thrown out trying to go first to third!"),
  c("is gunned down — the outfielder's throw nails him at third!"),
  c("is thrown out at third by a step!"),
  c("is cut down at third — should have stayed at second!"),
  c("is thrown out at third — the relay was on target!"),
  c("is tagged out at third trying to be aggressive!", 'uncommon'),
  c("is thrown out at third — the cutoff man relayed it perfectly!", 'uncommon'),
  c("gets thrown out at third — he never should have gone!", 'rare'),
];

// =========== RUNNER THROWN OUT AT HOME ===========
const RUNNER_OUT_AT_HOME_LINES = [
  c("is thrown out at the plate!"),
  c("is gunned down at home — the throw was perfect!"),
  c("is cut down trying to score!"),
  c("is thrown out at home — no chance!"),
  c("is tagged out at the plate!"),
  c("is thrown out trying to score!"),
  c("is gunned down at home — the relay was on target!"),
  c("is thrown out at the plate by a mile!"),
  c("is cut down at home — the catcher blocks the plate!"),
  c("is thrown out trying to score — the throw beat him!"),
  c("is tagged out at the plate — he never had a chance!", 'uncommon'),
  c("is thrown out at home — the cutoff relay was perfect!", 'uncommon'),
  c("is gunned down at the plate — the throw was a strike!", 'uncommon'),
  c("is thrown out at home — why did they send him?!", 'rare'),
];

// =========== TAG UP THROWN OUT ===========
const TAG_UP_OUT_LINES = [
  c("tags up and is thrown out at the plate!"),
  c("is gunned down trying to tag and score!"),
  c("is thrown out tagging up at home!"),
  c("tags up and is cut down at the plate!"),
  c("is thrown out trying to advance on the fly!"),
  c("tags up and is thrown out at third!"),
  c("is gunned down tagging up at third!"),
  c("is thrown out trying to tag and take the extra base!"),
  c("tags up and is thrown out at second!"),
  c("is caught trying to advance on the catch!"),
  c("is thrown out — the throw beat him after the tag!", 'uncommon'),
  c("tags up and is cut down — the outfielder's arm was too strong!", 'uncommon'),
  c("is gunned down — the relay was perfect after the catch!", 'uncommon'),
  c("is thrown out tagging up by a mile!", 'rare'),
];

// =========== BATTER STRETCHING SINGLE INTO DOUBLE — CAUGHT ===========
const STRETCH_SINGLE_DOUBLE_OUT_LINES = [
  c("He rounds first and heads for second, but the throw beats him."),
  c("He tries to turn the single into two bases and is cut down."),
  c("He never slows at first, but the defense is ready for him."),
  c("He challenges the arm and loses at second."),
  c("He takes an aggressive turn, commits to second and is tagged out."),
  c("The hit is good for one base, but he tries for two and pays the price."),
  c("He races toward second, but the ball arrives ahead of the slide."),
  c("He sees a possible double, but the defense takes it away."),
  c("He tries to stretch the play and is thrown out by a step."),
  c("He keeps running after the single, and the gamble backfires."),
  c("A quick throw turns his extra-base attempt into an out."),
  c("He presses his luck beyond first and comes up short."),
  c("He tries to manufacture a double, but the tag is waiting."),
  c("He makes the wide turn and is erased trying for second."),
  c("An aggressive single becomes an out on the bases."),
];

// =========== BATTER STRETCHING DOUBLE INTO TRIPLE — CAUGHT ===========
const STRETCH_DOUBLE_TRIPLE_OUT_LINES = [
  c("He rounds second and heads for third, but the throw beats him."),
  c("He tries to turn the double into a triple and is cut down."),
  c("He never slows at second, but the defense recovers in time."),
  c("He challenges the throw and loses at third."),
  c("He sees three bases, but the defense allows only two."),
  c("He keeps running after the double and is tagged out at third."),
  c("The throw arrives just ahead of his slide."),
  c("He tries to take the extra ninety feet and comes up short."),
  c("A strong relay ends his bid for a triple."),
  c("He makes an aggressive turn around second and runs into an out."),
  c("He stretches the double too far and is erased at third."),
  c("He commits to third, but the ball gets there first."),
  c("The hit reaches the gap, but his attempt at three bases fails."),
  c("He presses the advantage and is thrown out trying for third."),
  c("What began as a double ends with the runner tagged out at third."),
];

// =========== BATTER STRETCHING TRIPLE INTO INSIDE-THE-PARK HR — CAUGHT ===========
const STRETCH_TRIPLE_HR_OUT_LINES = [
  c("He rounds third and heads for home, but the throw beats him to the plate."),
  c("He tries to complete the inside-the-park home run and is cut down."),
  c("He never stops at third, but the defense denies him the run."),
  c("He races for home and is tagged out at the plate."),
  c("He tries to circle the bases, but the final throw arrives in time."),
  c("The bid for an inside-the-park homer ends at home."),
  c("He challenges the defense for all four bases and loses at the plate."),
  c("He comes flying around third, but the ball is waiting for him."),
  c("The relay reaches home just ahead of the runner."),
  c("He tries to turn the triple into a home run and is erased."),
  c("He goes for the spectacular finish, but the tag beats him."),
  c("He makes the final turn at full speed and comes up short."),
  c("The crowd rises as he heads home, but the defense completes the play."),
  c("He nearly circles the bases, but the final ninety feet prove too much."),
  c("A thrilling trip around the bases ends with an out at home."),
];

// =========== RUNNER FROM FIRST THROWN OUT AT THIRD ===========
const RUNNER_FIRST_TO_THIRD_OUT_LINES = [
  c("The runner goes first to third, but the throw beats him."),
  c("He tries to take two bases and is cut down at third."),
  c("He races around second, but the defense is ready."),
  c("The runner challenges the arm and loses at third."),
  c("He tries to reach third on the play, but the tag is applied in time."),
  c("He never slows around second and runs into an out."),
  c("The throw reaches third just ahead of the slide."),
  c("He tries to move within ninety feet of home and is denied."),
  c("An aggressive trip from first ends with the runner tagged out."),
  c("He presses for third, but the defense cuts him down."),
  c("The runner makes the turn and commits, but the ball arrives first."),
  c("He attempts to advance two bases and comes up short."),
  c("A strong throw erases the runner at third."),
  c("He takes the extra base chance, and the gamble fails."),
  c("The runner is thrown out trying to go from first to third."),
];

// =========== RUNNER FROM FIRST THROWN OUT AT HOME ===========
const RUNNER_FIRST_TO_HOME_OUT_LINES = [
  c("The runner comes all the way from first, but the throw beats him home."),
  c("He tries to score from first and is cut down at the plate."),
  c("He races around third, but the defense completes the relay."),
  c("The runner challenges the throw home and loses."),
  c("He tries to score from first, but the tag beats his slide."),
  c("The relay reaches the plate just ahead of the runner."),
  c("He comes flying around third and is erased at home."),
  c("The runner tries to travel three bases on the play, but comes up short."),
  c("A strong throw prevents the run from scoring."),
  c("He is waved home from first, but the defense cuts him down."),
  c("The runner gives it everything he has, but the ball gets there first."),
  c("He tries to score the long way around and is tagged out."),
  c("The defense executes the relay perfectly at the plate."),
  c("He rounds third at full speed, but the run is denied."),
  c("The runner is thrown out attempting to score from first."),
];

// =========== RUNNER FROM SECOND THROWN OUT AT HOME ===========
const RUNNER_SECOND_TO_HOME_OUT_LINES = [
  c("The runner rounds third and heads home, but the throw beats him."),
  c("He tries to score from second and is cut down at the plate."),
  c("The runner challenges the arm, and the defense wins."),
  c("He races home, but the ball arrives ahead of the slide."),
  c("The throw comes in on target, and the runner is tagged out."),
  c("He tries to score on the hit, but the run is denied."),
  c("The runner gets the wave around third and is erased at home."),
  c("A strong throw cuts him down at the plate."),
  c("He comes charging home, but the tag is waiting."),
  c("The relay reaches home just in time."),
  c("He tries to score from second, but the defense executes perfectly."),
  c("The runner slides hard, but the ball beats him there."),
  c("He is sent home and thrown out by a step."),
  c("The defense prevents the runner from scoring from second."),
  c("He rounds third aggressively, but the play ends at the plate."),
];

// =========== TAG UP — RUNNER FROM FIRST THROWN OUT AT SECOND ===========
const TAG_UP_FIRST_TO_SECOND_OUT_LINES = [
  c("The runner tags at first and heads for second, but the throw beats him."),
  c("He tries to advance after the catch and is cut down at second."),
  c("The runner challenges the arm on the flyout and loses."),
  c("He tags and takes off, but the ball arrives ahead of him."),
  c("He tries to move up on the catch and is tagged out."),
  c("The runner attempts the unusual advance from first and comes up short."),
  c("A strong throw turns the flyout into a double play."),
  c("He tags at first, races for second and is erased."),
  c("The runner tries to take advantage of the deep catch, but the defense responds."),
  c("He advances after the catch, but the throw is right on target."),
  c("The ball reaches second before the sliding runner."),
  c("He tries to gain ninety feet on the flyout and is denied."),
  c("The runner tags legally, but cannot beat the throw."),
  c("An aggressive advance after the catch produces the second out."),
  c("He tests the arm from first and is thrown out at second."),
];

// =========== TAG UP — RUNNER FROM SECOND THROWN OUT AT THIRD ===========
const TAG_UP_SECOND_TO_THIRD_OUT_LINES = [
  c("The runner tags at second and heads for third, but the throw beats him."),
  c("He tries to advance after the catch and is cut down at third."),
  c("The runner challenges the arm and loses by a step."),
  c("He tags and races for third, but the ball arrives first."),
  c("A strong throw turns the flyout into a double play."),
  c("He tries to move within ninety feet of home and is denied."),
  c("The runner takes off after the catch, but the tag beats him."),
  c("He tests the defense from second and is thrown out at third."),
  c("The throw reaches the bag just ahead of the slide."),
  c("He tries to advance on the flyout, but the defense executes perfectly."),
  c("The runner tags properly, but cannot outrun the throw."),
  c("He presses for third and is erased after the catch."),
  c("The defense cuts down the advancing runner at third."),
  c("He tries to steal an extra ninety feet on the flyout and comes up short."),
  c("The runner is thrown out trying to tag from second to third."),
];

// =========== TAG UP — RUNNER FROM THIRD THROWN OUT AT HOME ===========
const TAG_UP_THIRD_TO_HOME_OUT_LINES = [
  c("The runner tags at third and heads home, but the throw beats him."),
  c("He tries to score on the flyout and is cut down at the plate."),
  c("The runner challenges the arm, and the defense wins."),
  c("He tags and races home, but the ball arrives ahead of the slide."),
  c("A strong throw prevents the sacrifice fly."),
  c("The catch is made, the throw comes home, and the runner is out."),
  c("He tries to score after the catch, but the tag beats him."),
  c("The runner comes charging toward the plate and is erased."),
  c("He tags immediately, but the defense completes the play."),
  c("The throw is right on target, and the run does not score."),
  c("He tests the arm from third and loses at home."),
  c("A perfect throw turns the flyout into a double play."),
  c("The runner slides for the plate, but the ball gets there first."),
  c("He tries to bring home the run, but the defense cuts him down."),
  c("The sacrifice-fly attempt ends with the runner tagged out at home."),
];

// ── Merge diverse sub-category lines into main pools for richer play-by-play ──
SINGLE_LINES.push(...INFIELD_SINGLE_LINES, ...GROUNDER_SINGLE_LINES, ...LINER_SINGLE_LINES,
  ...BLOOP_SINGLE_LINES, ...HARD_SHALLOW_SINGLE_LINES, ...HELD_AT_FIRST_SINGLE_LINES);
DOUBLE_LINES.push(...STRETCH_SINGLE_DOUBLE_LINES, ...LINE_DOUBLE_LINES, ...GAP_DOUBLE_SHORT_LINES,
  ...GAP_DOUBLE_LONG_LINES, ...OVER_HEAD_DOUBLE_LINES, ...WALL_DOUBLE_LINES);
TRIPLE_LINES.push(...STRETCH_DOUBLE_TRIPLE_LINES, ...GAP_TRIPLE_WALL_LINES,
  ...OVER_HEAD_TRIPLE_LINES, ...WALL_BOUNCE_TRIPLE_LINES);

/**
 * Smart hit-line picker: lines that start with a lowercase letter are
 * name-prefixed templates (e.g., "lines a single to left."), so the batter
 * name is prepended. Lines starting with uppercase are standalone sentences
 * (e.g., "A slow roller, and he beats the throw to first.") and render as-is.
 */
export function pickHitLine(lines, batterName) {
  const line = pickLine(lines);
  if (!line) return batterName;
  const first = line.charAt(0);
  if (first === first.toLowerCase() && first !== first.toUpperCase()) {
    return `${batterName} ${line}`;
  }
  return line;
}

// Export all pools
export {
  STRIKEOUT_LINES, WALK_LINES, INTENTIONAL_WALK_LINES,
  SINGLE_LINES, INFIELD_SINGLE_LINES, GROUNDER_SINGLE_LINES, LINER_SINGLE_LINES,
  BLOOP_SINGLE_LINES, HARD_SHALLOW_SINGLE_LINES, HELD_AT_FIRST_SINGLE_LINES,
  DOUBLE_LINES, STRETCH_SINGLE_DOUBLE_LINES, LINE_DOUBLE_LINES, GAP_DOUBLE_SHORT_LINES,
  GAP_DOUBLE_LONG_LINES, OVER_HEAD_DOUBLE_LINES, WALL_DOUBLE_LINES,
  TRIPLE_LINES, STRETCH_DOUBLE_TRIPLE_LINES, GAP_TRIPLE_WALL_LINES, OVER_HEAD_TRIPLE_LINES,
  WALL_BOUNCE_TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  SHALLOW_FLYOUT_LINES, MEDIUM_FLYOUT_LINES, DEEP_FLYOUT_LINES,
  OUTFIELD_LINEOUT_LINES,
  DOUBLE_PLAY_LINES, END_INNING_LINES, LINEOUT_LINES,
  SOFT_GROUNDOUT_LINES, HARD_GROUNDOUT_LINES,
  POPOUT_LINES, FOUL_BALL_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  STEAL_LINES, ERROR_LINES, FC_LINES, INFIELD_POPUP_LINES,
  CAUGHT_STEALING_LINES,
  INFIELD_LINEOUT_SOFT_LINES, INFIELD_LINEOUT_HARD_LINES,
  TAKEN_STRIKE_FASTBALL_LINES, TAKEN_STRIKE_BREAKING_LINES,
  TAKEN_STRIKE_CHANGEUP_LINES, TAKEN_STRIKE_GENERIC_LINES,
  SWINGING_STRIKE_FASTBALL_LINES, SWINGING_STRIKE_BREAKING_LINES,
  SWINGING_STRIKE_CHANGEUP_LINES, SWINGING_STRIKE_GENERIC_LINES,
  CALLED_BALL_FASTBALL_LINES, CALLED_BALL_BREAKING_LINES,
  CALLED_BALL_CHANGEUP_LINES, CALLED_BALL_GENERIC_LINES,
  STRETCH_OUT_LINES, STRETCH_SUCCESS_LINES,
  STRETCH_SUCCESS_DOUBLE_TRIPLE_LINES, STRETCH_SUCCESS_TRIPLE_HR_LINES,
  RUNNER_OUT_AT_THIRD_LINES, RUNNER_OUT_AT_HOME_LINES,
  TAG_UP_OUT_LINES,
  STRETCH_SINGLE_DOUBLE_OUT_LINES, STRETCH_DOUBLE_TRIPLE_OUT_LINES,
  STRETCH_TRIPLE_HR_OUT_LINES,
  RUNNER_FIRST_TO_THIRD_OUT_LINES, RUNNER_FIRST_TO_HOME_OUT_LINES,
  RUNNER_SECOND_TO_HOME_OUT_LINES,
  TAG_UP_FIRST_TO_SECOND_OUT_LINES, TAG_UP_SECOND_TO_THIRD_OUT_LINES,
  TAG_UP_THIRD_TO_HOME_OUT_LINES,
};