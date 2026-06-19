// ── Blowout Mode Commentary ──
// Activated in 8th inning+ with 8+ run margin.
// Announcers get bored and talk about random things instead of the game.
// Only fires on "between pitches" flavor (never overrides play results).

const BLOWOUT_LINES = {
  cubs: [
    // Harry Caray
    "You know, I got lost trying to find this ballpark once.",
    "I swear I saw a man bring an entire turkey into Wrigley Field.",
    "What happened to suspenders? Everybody used to wear suspenders.",
    "You ever notice hot dogs taste better at a ballpark?",
    "I had three hot dogs before the game. That's probably too many.",
    "Probably not though.",
    "Somebody just offered me peanuts.",
    "I accepted.",
    "You know what? They were pretty good.",
    "That gentleman in the bleachers hasn't sat down all night.",
    "I respect that.",
    "I once missed an inning because I was talking to a vendor.",
    "The inning wasn't very good anyway.",
    "You know, I think the ivy needs a trim. Not that I'm volunteering.",
    "Steve, did I ever tell you about the time I broadcast a game from the bleachers?",
    "I did it for nine innings. People kept handing me beers.",
    "I didn't pay for a single one.",
    "I once saw Ernie Banks order three scoops of ice cream between innings.",
    "He said, 'Harry, let's eat two.'",
    "Someone's waving at me from the upper deck. I waved back.",
    "Now they're all waving. I've started a trend.",
    "Chicago has the best hot dogs in America. That's not opinion, that's science.",
    "You know what's underrated? A good pretzel. With mustard.",
    "Not the yellow kind — the spicy brown mustard. That's the real stuff.",
    "I bet I could still hit a baseball. Not well, but I could hit it.",
    "Actually, looking at these pitchers, maybe not.",
    "The organist is playing 'Take Me Out to the Ballgame.'",
    "A little early, but I appreciate the enthusiasm.",
    "I once broadcast an entire inning while eating a bratwurst.",
    "The producers weren't happy. The bratwurst was excellent.",
  ],

  dodgers: [
    // Vin Scully
    "This reminds me of a game I saw in Montreal back in 1969.",
    "The pitcher was late because he stopped to help a stranded motorist.",
    "True story.",
    "The batter once worked summers at a hardware store.",
    "He sold lawn mowers.",
    "Baseball players always have interesting off-season jobs.",
    "I once asked a player what he did in the winter.",
    "He said, 'Try not to spend all my money.'",
    "Fair enough.",
    "The crowd has settled into a pleasant evening.",
    "Baseball can be wonderfully unhurried.",
    "Sometimes the game allows us time to think.",
    "You know, I once called a game where nothing happened for six innings.",
    "It was one of the most pleasant broadcasts of my life.",
    "The San Gabriel Mountains look especially beautiful tonight.",
    "They're painted in shades of purple and amber.",
    "We're very lucky to call baseball here.",
    "I remember a game where Tommy Lasorda argued a call for fourteen minutes.",
    "The umpire finally said, 'Tommy, I've got dinner reservations.'",
    "Tommy said, 'So do I. Let's go together.'",
    "I don't think they went.",
    "I once saw a fan catch three foul balls in one game.",
    "The next day he brought a bigger glove.",
    "The organist appears to be playing something from a Broadway show.",
    "I can't quite place it, but it's lovely.",
  ],

  yankees: [
    // Phil Rizzuto
    "Did I tell you about the cannoli place?",
    "Best cannoli in New York.",
    "Maybe the world.",
    "I don't know.",
    "I lost my scorecard again.",
    "Somebody help me find it.",
    "I had it two innings ago.",
    "Holy cow.",
    "You know what's expensive now?",
    "Everything.",
    "My wife told me not to say that.",
    "I'm saying it anyway.",
    "I saw a pigeon steal somebody's sandwich.",
    "That pigeon earned it.",
    "You think pigeons know baseball?",
    "I once tried to order a pizza during a game.",
    "Frank Messer took the phone away from me.",
    "He said I was on the air. I forgot.",
    "There's a hot dog vendor who's been in the same spot for twenty years.",
    "His name is Sal. Good guy.",
    "Makes a heck of a sausage and peppers too.",
    "The traffic on the Major Deegan wasn't bad today.",
    "I don't know how. Must be a holiday.",
    "My granddaughter called me during the third inning.",
    "I answered. She wanted to know if I'd seen her retainer.",
    "I had not.",
    "Bill White just gave me a look. I think I talked too long again.",
    "That happens.",
  ],

  padres: [
    // Jerry Coleman
    "The Padres aren't winning tonight.",
    "But the weather's terrific.",
    "You have to appreciate that.",
    "I once got sunburned at a night game.",
    "Still don't know how.",
    "Somebody explain it to me.",
    "There are three seagulls arguing over a hot dog.",
    "The hot dog appears to be winning.",
    "I've seen stranger things.",
    "Actually, maybe I haven't.",
    "Dave, did you ever try the fish tacos here?",
    "They're unbelievable. Little bit of lime, little bit of cabbage.",
    "I could eat six.",
    "Somebody in the upper deck is flying a kite.",
    "Well, that's San Diego for you.",
    "I once saw Tony Gwynn take batting practice for an hour.",
    "He didn't miss a single pitch. Not one.",
    "I stopped keeping track after forty.",
    "The marine layer is doing something interesting tonight.",
    "I don't know what. But it's interesting.",
    "Actually, it's just fog. Never mind.",
    "There's a guy in the stands wearing a full wetsuit.",
    "I'm not sure if he came from the beach or he's expecting something.",
  ],

  mets: [
    // Bob Murphy / Ralph Kiner
    "A gentleman in the front row has been keeping score since the first inning.",
    "That scorebook must weigh ten pounds.",
    "The Mets need ten runs.",
    "The scorebook may get heavier.",
    "I once met a fan who attended every game for twenty years.",
    "Never missed one.",
    "I don't think he missed tonight either.",
    "Baseball creates wonderful traditions.",
    "Ralph, did you ever hit a home run you didn't remember?",
    "I genuinely want to know.",
    "The 7 train just went by. Right on schedule.",
    "Some things in New York you can count on.",
    "There's a man in Section 17 eating what appears to be a pastrami sandwich.",
    "It's the size of a briefcase.",
    "I respect that enormously.",
    "The planes from LaGuardia are particularly active tonight.",
    "I think I can identify the airline by the tail fin at this point.",
    "That one was Delta.",
    "I once saw Mr. Met trip over the foul line.",
    "Got right back up. The head never came off. Professional.",
    "The crowd has really thinned out. Can't say I blame them.",
    "But the diehards are still here. That's something.",
  ],

  tigers: [
    // Ernie Harwell
    "A young fan just caught a foul ball.",
    "He'll remember that for a long time.",
    "Baseball memories have a way of sticking around.",
    "A father is teaching his son how to keep score.",
    "That's one of the great things about baseball.",
    "The game gets passed down.",
    "You never know what a youngster might remember years later.",
    "Maybe even tonight.",
    "The lights at Tiger Stadium have a certain warm glow.",
    "They've been shining on this corner since 1948.",
    "The crowd has gotten a little quieter.",
    "But you can still hear the hum of Michigan Avenue.",
    "I remember a game where it was so cold the hot dog vendor was selling coffee instead.",
    "Someone asked for a hot dog with his coffee.",
    "The vendor said, 'Son, today I'm a barista.'",
    "Food always tastes better at the ballpark.",
    "I don't know why. Maybe it's the fresh air.",
    "Maybe it's the hope.",
    "There's a young couple on a date behind the dugout.",
    "He's explaining the infield fly rule.",
    "I hope it works out for him.",
  ],

  orioles: [
    // Chuck Thompson
    "The coffee's hot.",
    "The game's not.",
    "But we're enjoying ourselves.",
    "Somebody behind home plate has eaten ice cream for seven innings.",
    "That's commitment.",
    "I admire dedication.",
    "The Orioles have some work to do.",
    "Fortunately there's still time.",
    "Not much, but some.",
    "Brooks, you ever get bored during these kinds of games?",
    "I'm asking for a friend.",
    "The warehouse looks beautiful against the twilight sky.",
    "Some nights you just appreciate being at the ballpark.",
    "There's a gentleman in Section 42 who's been here since batting practice.",
    "He brought a cooler. Smart man.",
    "I once saw Cal Ripken sign autographs for two hours after a game like this.",
    "He signed every single one.",
    "There's a reason they call him the Iron Man.",
    "The crab cake stand behind section 54 is doing brisk business.",
    "Can't say I'm surprised.",
    "A fan just held up a sign that says 'We Still Believe.'",
    "That's the spirit.",
  ],

  royals: [
    // Denny Matthews
    "The fountains look nice tonight.",
    "They usually do.",
    "A lot of people come early just to see them.",
    "Kansas City has changed quite a bit over the years.",
    "The barbecue remains excellent.",
    "Some things don't need improving.",
    "A fan just dropped a program into the aisle.",
    "Several people helped retrieve it.",
    "That's teamwork.",
    "Fred, have you ever tried to count the fountains from the booth?",
    "I did once. I got to forty-seven and lost track.",
    "I'll try again someday.",
    "Somebody in the parking lot is tailgating.",
    "I can smell the grill from here.",
    "They're probably having a better time than we are.",
    "Royals Stadium opened in 1973. I've been in this booth for most of it.",
    "You never get tired of the view.",
    "The crowd is starting to thin out, but the faithful are staying.",
    "That's Kansas City.",
    "I once saw a Royals game where the fog was so thick you couldn't see the outfield.",
    "The announcers just described what they thought was happening.",
    "We got about half of it right.",
  ],

  reds: [
    // Joe Nuxhall / Marty Brennaman
    "Somebody's grilling something outside the ballpark.",
    "I wish I knew where.",
    "The Reds are down by eight.",
    "But whatever they're cooking smells fantastic.",
    "I once played in a game where a dog ran onto the field.",
    "The dog had a pretty good arm.",
    "Might've helped our bullpen.",
    "The official scorer did not credit the dog with an assist.",
    "Marty, you ever been to that chili place on Fourth Street?",
    "The one with the neon sign. Three-way, extra cheese.",
    "I think about it more than I should.",
    "The river looks peaceful tonight. A few barges moving slowly.",
    "It's a nice view from the booth when the game gets like this.",
    "There's a man in the upper deck who's been reading a newspaper since the fifth inning.",
    "He's on the sports section now.",
    "At least he's staying current.",
    "I once broadcast a game where a seagull sat on the foul pole for six innings.",
    "We named him. We gave him a full biography.",
    "The game was 15-2. We had time.",
    "The organist is playing something by the Isley Brothers.",
    "Good choice.",
  ],

  redsox: [
    // Ned Martin / Joe Castiglione
    "A gentleman behind the dugout is keeping score in a leather-bound book.",
    "It looks like it's been passed down through generations.",
    "That's New England for you.",
    "I once saw a fan climb the Green Monster.",
    "He didn't get far, but he got closer than most.",
    "The ushers were not impressed.",
    "The manual scoreboard crew is doing excellent work tonight.",
    "They've been at it since 1934. Practice makes perfect.",
    "Somebody in the stands is eating what appears to be clam chowder.",
    "In a bread bowl. At a baseball game.",
    "I have so many questions.",
    "The Citgo sign is glowing across the way.",
    "Some things never change. Thank goodness.",
    "I remember a rain delay here that lasted four hours.",
    "The fans just stayed. Sang the whole time.",
    "Boston doesn't leave early.",
    "There's a kid in the front row with a glove bigger than he is.",
    "He hasn't taken it off all night.",
    "That's dedication.",
  ],
};

// ── Universal Rare Stories (available to any team) ──
const UNIVERSAL_RARE = [
  "The gentleman in Section 114 has been asleep for three innings.",
  "Nobody has disturbed him.",
  "A fan has dropped the same scorecard twice.",
  "The organist appears to be taking requests.",
  "Someone brought binoculars and is using them to watch the bullpen.",
  "A seagull has become very interested in the on-deck circle.",
  "A youngster just asked why they don't use aluminum bats.",
  "The scoreboard operator appears to be having a strong game.",
  "The scoreboard operator appeared to hear me say that.",
  "Somewhere in America, somebody is falling asleep watching this game.",
  "And honestly, we understand.",
];

// ── Blowout trigger line — said once when blowout mode activates ──
const ACTIVATION_LINES = [
  "Well, we've got a little time here.",
  "You know, we've got some time to fill.",
  "Well, let's find something to talk about.",
  "Not much happening on the field, so let's talk.",
  "Plenty of time to chat now.",
  "You know what, let me tell you something.",
  "Alright, let's get comfortable.",
  "While we wait for this to wrap up...",
];

/**
 * Determine if blowout mode should be active.
 * 8th inning or later, 8+ run margin.
 */
export function isBlowoutMode(state) {
  if (!state || state.inning < 8) return false;
  const margin = Math.abs((state.score.home || 0) - (state.score.away || 0));
  return margin >= 8;
}

/**
 * Get the blowout activation line (first time trigger).
 */
export function getBlowoutActivationLine() {
  return ACTIVATION_LINES[Math.floor(Math.random() * ACTIVATION_LINES.length)];
}

/**
 * Pick a blowout commentary line for the given team.
 * Returns null if no lines exist for that team.
 */
export function pickBlowoutLine(homeTeamKey) {
  const teamLines = BLOWOUT_LINES[homeTeamKey];
  let pool = teamLines || [];

  // Mix in universal rare stories (10% chance)
  if (Math.random() < 0.10 && UNIVERSAL_RARE.length > 0) {
    pool = [...pool, ...UNIVERSAL_RARE];
  }

  if (pool.length === 0) {
    // Fallback: universal lines only
    return UNIVERSAL_RARE[Math.floor(Math.random() * UNIVERSAL_RARE.length)] || "Plenty of time to chat now.";
  }

  return pool[Math.floor(Math.random() * pool.length)];
}