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
  STEAL_LINES, ERROR_LINES, FC_LINES, INFIELD_POPUP_LINES,
  TAKEN_STRIKE_FASTBALL_LINES, TAKEN_STRIKE_BREAKING_LINES,
  TAKEN_STRIKE_CHANGEUP_LINES, TAKEN_STRIKE_GENERIC_LINES,
  SWINGING_STRIKE_FASTBALL_LINES, SWINGING_STRIKE_BREAKING_LINES,
  SWINGING_STRIKE_CHANGEUP_LINES, SWINGING_STRIKE_GENERIC_LINES,
  CALLED_BALL_FASTBALL_LINES, CALLED_BALL_BREAKING_LINES,
  CALLED_BALL_CHANGEUP_LINES, CALLED_BALL_GENERIC_LINES,
};