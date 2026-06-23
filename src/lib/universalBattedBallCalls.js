// Universal Batted-Ball Calls — 1984 Announcer Commentary
// Generic, ballpark-agnostic calls for varied play-by-play texture
// All marked common rarity by default; mix into existing play-by-play

function c(text, rarity = 'common') { return { text, rarity }; }

// =========== LITTLE DRIBBLERS AND WEAK CONTACT ===========
export const DRIBBLERS = [
  c("A little dribbler toward third."),
  c("A slow roller up the first-base line."),
  c("A weak tapper in front of the plate."),
  c("A little nubber toward the mound."),
  c("A swinging bunt down the third-base side."),
  c("A slow trickler toward shortstop."),
  c("A soft roller to the right side."),
  c("A little tap off the end of the bat."),
  c("A weak ground ball toward second."),
  c("A dribbler that may stay fair."),
  c("A tiny roller near the line."),
  c("A softly hit ball in front of home plate."),
  c("A little squibber toward first."),
  c("A weak tap back to the pitcher."),
  c("A ball barely struck off the bat."),
  c("A slow roller that dies in the grass."),
  c("A soft little grounder toward third."),
  c("A weakly hit ball toward the middle."),
  c("A little excuse-me swing toward first."),
  c("A harmless-looking roller up the line."),
];

// =========== CHOPPERS AND HIGH BOUNCERS ===========
export const CHOPPERS = [
  c("A high chopper toward third."),
  c("A big Baltimore chop over the mound."),
  c("A hard chopper to shortstop."),
  c("A high bounce over the pitcher's head."),
  c("A chopper toward the hole."),
  c("A sharply hit hop to the left side."),
  c("A ball chopped straight into the dirt."),
  c("A high-bounding grounder toward second."),
  c("A tough in-between hop to third."),
  c("A big hop off the artificial turf."),
  c("A chopper that hangs in the air."),
  c("A high hopper toward first base."),
  c("A ball chopped over the third baseman."),
  c("A high bounce that buys the runner time."),
  c("A nasty hop toward short."),
];

// =========== ROUTINE GROUND BALLS ===========
export const ROUTINE_GROUNDERS = [
  c("A ground ball to shortstop."),
  c("A routine roller to second base."),
  c("A grounder toward third."),
  c("A two-hopper to the first baseman."),
  c("A ground ball right at the shortstop."),
  c("A routine play on the left side."),
  c("A grounder hit directly to second."),
  c("A steady roller toward first."),
  c("A ground ball near the bag."),
  c("A routine chance for the third baseman."),
  c("A ball hit on the ground toward short."),
  c("A grounder that should be handled."),
  c("A firm two-hopper to second."),
  c("A routine roller across the infield."),
  c("A ground ball directly at the pitcher."),
  c("A ball hit right to the first baseman."),
];

// =========== HARD GROUND BALLS ===========
export const HARD_GROUNDERS = [
  c("A screaming ground ball toward third."),
  c("A hard smash through the left side."),
  c("A sharply hit grounder to short."),
  c("A rocket along the ground toward first."),
  c("A hard one-hopper to second."),
  c("A sizzling ground ball up the middle."),
  c("A bullet off the bat toward third base."),
  c("A sharply hit ball toward the hole."),
  c("A hard grounder that eats up the infielder."),
  c("A shot past the pitcher."),
  c("A hot smash down the line."),
  c("A hard-hit ball toward the right side."),
  c("A ground ball struck with authority."),
  c("A rocket that stays on the ground."),
  c("A hard-hit ball that may find the outfield."),
  c("A ground ball ripped toward first."),
  c("A sizzling smash toward shortstop."),
];

// =========== BALLS UP THE MIDDLE ===========
export const UP_THE_MIDDLE = [
  c("A ground ball back through the box."),
  c("A shot up the middle."),
  c("A hard roller toward second base."),
  c("A grounder behind the bag."),
  c("A ball hit directly over the mound."),
  c("A bouncing ball through the center of the diamond."),
  c("A sharp one-hopper past the pitcher."),
  c("A slow roller near second base."),
  c("A ball ticketed for the middle."),
  c("A chopper over the mound."),
  c("A ground ball that splits the middle infielders."),
  c("A hard-hit ball behind second."),
  c("A roller through the center of the infield."),
];

// =========== BALLS TOWARD THE HOLE ===========
export const HOLE_SHOTS = [
  c("A ground ball deep in the shortstop hole."),
  c("A shot between third and short."),
  c("A ball headed for the six-hole."),
  c("A hard grounder toward the backhand side."),
  c("A roller between first and second."),
  c("A ground ball deep to the right side."),
  c("A sharply hit ball toward the hole."),
  c("A one-hopper between the infielders."),
  c("A grounder that forces a long throw."),
  c("A ball hit where no infielder is standing."),
  c("A shot just beyond the third baseman's reach."),
  c("A ground ball that may split the right side."),
];

// =========== INFIELD LINE DRIVES ===========
export const INFIELD_LINERS = [
  c("A scorching line drive toward shortstop."),
  c("A low liner to second base."),
  c("A hard line drive right at the third baseman."),
  c("A bullet toward first."),
  c("A sinking liner over the mound."),
  c("A line shot toward the left side."),
  c("A sharp liner headed for short."),
  c("A low missile toward second."),
  c("A frozen rope at the first baseman."),
  c("A hard liner just above the infield."),
  c("A screaming line drive through the box."),
  c("A bullet off the bat toward the mound."),
  c("A rope toward the shortstop."),
  c("A vicious line drive toward third."),
  c("A low shot at the second baseman."),
];

// =========== OUTFIELD LINE DRIVES ===========
export const OUTFIELD_LINERS = [
  c("A line drive into left field."),
  c("A sharp liner toward center."),
  c("A hard line drive into right."),
  c("A sinking liner in front of the outfielder."),
  c("A rope toward the left-center-field gap."),
  c("A line shot to straightaway center."),
  c("A bullet toward right-center."),
  c("A hard liner down the left-field line."),
  c("A frozen rope into the outfield."),
  c("A sharply hit line drive toward the gap."),
  c("A screaming drive over the shortstop."),
  c("A line shot just beyond the infield."),
  c("A hard drive into the left-field corner."),
  c("A rope headed toward the warning track."),
  c("A line drive that carries over the outfielder."),
  c("A sharply struck ball toward right field."),
  c("A low missile into center."),
  c("A hard liner slicing toward the line."),
];

// =========== BLOOPERS AND SOFT FLIES ===========
export const BLOOPERS = [
  c("A little blooper into shallow right."),
  c("A soft fly ball toward left."),
  c("A flare over the second baseman."),
  c("A bloop single waiting to happen."),
  c("A soft liner into shallow center."),
  c("A little parachute behind shortstop."),
  c("A dying quail toward right field."),
  c("A flare into no-man's-land."),
  c("A softly hit ball beyond the infield."),
  c("A blooper that may fall between three fielders."),
  c("A little duck snort toward left."),
  c("A soft fly that hangs over second base."),
  c("A dying liner into shallow right."),
  c("A flare just beyond the first baseman."),
  c("A little pop fly behind third."),
  c("A soft ball dropping toward center."),
  c("A blooper with nobody underneath it."),
  c("A little flare toward the foul line."),
  c("A weak fly ball drifting into shallow left."),
];

// =========== INFIELD POP-UPS ===========
export const INFIELD_POPS = [
  c("A towering pop-up over the infield."),
  c("A light-pole-high pop-up near second."),
  c("A high pop fly toward shortstop."),
  c("A towering ball straight above home plate."),
  c("A mile-high pop-up on the left side."),
  c("A high pop that stays in the infield."),
  c("A towering infield fly near first base."),
  c("A straight-up pop behind the plate."),
  c("A high fly ball near the pitcher's mound."),
  c("A pop-up drifting toward third."),
  c("A towering ball with plenty of hang time."),
  c("A high pop over the right side of the infield."),
  c("A little pop fly near the second-base bag."),
  c("A sky-high ball toward shortstop."),
  c("A towering pop that gives everyone time."),
];

// =========== SHALLOW FLY BALLS ===========
export const SHALLOW_FLYS = [
  c("A short fly ball into center."),
  c("A shallow fly toward left."),
  c("A soft fly ball into right."),
  c("A little fly ball behind second base."),
  c("A fly ball dropping in front of the outfielder."),
  c("A shallow drive toward left-center."),
  c("A short fly that may fall safely."),
  c("A ball lifted into shallow right."),
  c("A shallow fly drifting toward the line."),
  c("A little fly ball that forces the outfielder in."),
  c("A ball hit softly into shallow left."),
  c("A short fly that requires a quick charge."),
  c("A shallow pop toward right-center."),
];

// =========== ROUTINE OUTFIELD FLY BALLS ===========
export const ROUTINE_FLYS = [
  c("A fly ball to center field."),
  c("A routine fly toward left."),
  c("A medium fly ball into right."),
  c("A fly ball hit directly at the center fielder."),
  c("A routine chance in left field."),
  c("A high fly toward straightaway right."),
  c("A fly ball with ordinary depth."),
  c("A routine outfield play."),
  c("A ball lifted toward the warning track."),
  c("A medium-depth fly to center."),
  c("A routine fly with plenty of hang time."),
  c("A high fly ball directly at the outfielder."),
  c("A ball lifted into the center fielder's area."),
  c("A fly ball that should be handled."),
];

// =========== DEEP FLY BALLS ===========
export const DEEP_FLYS = [
  c("A deep fly ball toward left field."),
  c("A towering drive to center."),
  c("A high fly headed toward the warning track."),
  c("A deep ball toward right-center."),
  c("A fly ball carrying toward the wall."),
  c("A high drive deep into left."),
  c("A long fly ball toward straightaway center."),
  c("A deep fly drifting toward the line."),
  c("A towering ball headed for the track."),
  c("A high fly with the outfielder going back."),
  c("A deep drive toward the power alley."),
  c("A ball carrying well toward right."),
  c("A fly ball that sends the center fielder back."),
  c("A high drive toward the deepest part of the park."),
  c("A long fly that may reach the wall."),
];

// =========== GAP SHOTS ===========
export const GAP_SHOTS = [
  c("A drive toward the left-center-field gap."),
  c("A shot headed for right-center."),
  c("A ball driven between the outfielders."),
  c("A hard liner into the alley."),
  c("A fly ball splitting the gap."),
  c("A line drive headed for open grass."),
  c("A drive toward the deepest part of the gap."),
  c("A ball hit where neither outfielder may reach it."),
  c("A sharp drive between left and center."),
  c("A hard liner toward the right-center-field wall."),
  c("A shot headed into the power alley."),
  c("A drive that may roll all the way to the fence."),
  c("A ball splitting the outfield defense."),
  c("A liner racing toward the warning track."),
];

// =========== BALLS DOWN THE LINE ===========
export const DOWN_THE_LINE = [
  c("A hard shot down the third-base line."),
  c("A ground ball hugging the first-base line."),
  c("A drive headed toward the left-field corner."),
  c("A ball sliced down the right-field line."),
  c("A sharp grounder inside the bag."),
  c("A liner headed for the corner."),
  c("A ball pulled hard toward the line."),
  c("A drive that may stay fair."),
  c("A shot just inside the chalk."),
  c("A ground ball racing toward the corner."),
  c("A hard liner near the foul line."),
  c("A ball slicing toward the right-field corner."),
  c("A drive hugging the left-field line."),
  c("A shot down the line with the outfielder chasing."),
];

// =========== BROKEN-BAT CONTACT ===========
export const BROKEN_BAT = [
  c("A broken-bat grounder toward short."),
  c("The bat shatters on a little flare."),
  c("A broken-bat blooper into shallow left."),
  c("The bat splinters on a roller to second."),
  c("A broken-bat liner toward the mound."),
  c("A shattered-bat ground ball toward third."),
  c("A broken-bat pop-up near first."),
  c("The bat breaks on a soft fly to center."),
  c("A splintered-bat roller up the middle."),
  c("A broken-bat flare toward right."),
  c("A shattered-bat ball into shallow center."),
  c("A broken-bat dribbler toward the pitcher."),
];

// =========== CHECKED SWINGS AND ACCIDENTAL CONTACT ===========
export const CHECKED_SWINGS = [
  c("He checks his swing and taps it foul."),
  c("A checked-swing roller toward first."),
  c("He gets just enough bat on it."),
  c("An accidental tap toward the mound."),
  c("A half-swing produces a little grounder."),
  c("He tries to hold up and makes contact."),
  c("A checked-swing blooper toward right."),
  c("A defensive swing sends it toward third."),
  c("He fights it off into the infield."),
  c("A last-second swing produces a weak roller."),
  c("He gets the bat on it with two strikes."),
  c("A defensive tap toward shortstop."),
];

// =========== OPPOSITE-FIELD CONTACT ===========
export const OPPOSITE_FIELD = [
  c("A line drive the other way."),
  c("He shoots it toward right field."),
  c("A ground ball through the opposite side."),
  c("He serves it into left."),
  c("A flare toward the opposite-field line."),
  c("A hard drive the other way."),
  c("He stays back and lines it to right."),
  c("A grounder toward the opposite-field hole."),
  c("He inside-outs the ball toward right."),
  c("A soft liner the other way."),
  c("He punches it into left field."),
];

// =========== PULLED CONTACT ===========
export const PULLED_CONTACT = [
  c("He pulls it sharply toward third."),
  c("A hard drive into left field."),
  c("A ground ball pulled through the right side."),
  c("He turns on it and sends it toward the line."),
  c("A sharply pulled ball into the corner."),
  c("He gets the bat head out in front."),
  c("A hard pull-side grounder."),
  c("A drive headed toward the pull-side gap."),
  c("He hooks it toward the foul line."),
  c("A pulled fly ball deep toward left."),
  c("He turns on the inside pitch."),
  c("A sharp liner to the pull side."),
];

// =========== COLORFUL TECHNICAL PHRASES ===========
export const COLORFUL_PHRASES = [
  c("A seed into center field."),
  c("A rope toward the gap."),
  c("A frozen rope down the line."),
  c("A laser into right field."),
  c("A missile off the bat."),
  c("A rocket toward the wall."),
  c("A shot through the box."),
  c("A bullet into left."),
  c("A screamer toward third."),
  c("A pea into center field."),
  c("A smash into the gap."),
  c("A dart toward shortstop."),
  c("A tracer down the line."),
  c("A blast toward deep right."),
  c("A cannon shot into left-center."),
  c("A thunderbolt toward the wall."),
  c("A clothesline into the outfield."),
  c("A one-hop rocket through the infield."),
  c("A scorcher toward the corner."),
  c("A screaming liner into right-center."),
];

// Master export for game engine to randomly interleave
export const ALL_BATTED_BALL_CALLS = {
  DRIBBLERS,
  CHOPPERS,
  ROUTINE_GROUNDERS,
  HARD_GROUNDERS,
  UP_THE_MIDDLE,
  HOLE_SHOTS,
  INFIELD_LINERS,
  OUTFIELD_LINERS,
  BLOOPERS,
  INFIELD_POPS,
  SHALLOW_FLYS,
  ROUTINE_FLYS,
  DEEP_FLYS,
  GAP_SHOTS,
  DOWN_THE_LINE,
  BROKEN_BAT,
  CHECKED_SWINGS,
  OPPOSITE_FIELD,
  PULLED_CONTACT,
  COLORFUL_PHRASES,
};

export function pickUniversalCall(category) {
  if (!ALL_BATTED_BALL_CALLS[category]) return null;
  const lines = ALL_BATTED_BALL_CALLS[category];
  return lines[Math.floor(Math.random() * lines.length)].text;
}