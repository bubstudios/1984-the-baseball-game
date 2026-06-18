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
  c("Base knock."), c("A little duck snort falls in."),
  c("That's a seeing-eye single."), c("Single — found some grass."),
  c("Base knock — just what the doctor ordered."), c("Clean single."),
  c("Single — solid piece of hitting.", 'uncommon'),
  c("Single — hit it where they weren't.", 'uncommon'),
  c("stayed with the pitch — base hit.", 'uncommon'),
  c("Single — nice stroke.", 'uncommon'),
  c("Poked it through the infield.", 'uncommon'),
  c("That's a frozen rope through the hole.", 'rare'),
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
];

// =========== DOUBLE PLAY ===========
const DOUBLE_PLAY_LINES = [
  c("grounds into a double play."),
  c("Double play."), c("Two away."), c("Around the horn for two."),
  c("Twin killing!"), c("Just what the doctor ordered!"),
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
  c("Three up, three down.", 'uncommon'),
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

// =========== STRIKEOUT SWINGING (name prefixed) ===========
const STRIKEOUT_SWINGING_LINES = [
  c("goes down swinging!"), c("can't catch up — strike three!"),
  c("whiffs on strike three!"), c("fans on a wicked"),
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
    c("The catcher nails him!", 'uncommon'),
    c("Not even close — he's out by a mile.", 'uncommon'),
  ],
};

// =========== ERROR ===========
const ERROR_LINES = [
  c("boots it!"), c("can't handle it!"), c("muffs it!"),
  c("lets it go through the wickets!"),
  c("That's an error — he'll want that one back.", 'uncommon'),
  c("Routine chance — and he drops it.", 'rare'),
];

// =========== FIELDER'S CHOICE ===========
const FC_LINES = [
  c("grounds to"), c("bounces one to"),
  c("sharply hit to"), c("taps one to"),
];

// Export all pools
export {
  STRIKEOUT_LINES, WALK_LINES, INTENTIONAL_WALK_LINES,
  SINGLE_LINES, DOUBLE_LINES, TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  DOUBLE_PLAY_LINES, END_INNING_LINES, LINEOUT_LINES,
  POPOUT_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  STEAL_LINES, ERROR_LINES, FC_LINES,
};