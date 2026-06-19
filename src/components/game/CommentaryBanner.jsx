import React from 'react';
import { pickHarryLine } from '@/lib/harryCarayLines';
import { pickPadresLine, pickPadresPlayerLine } from '@/lib/jerryColemanLines';
import { pickVinLine } from '@/lib/vinScullyLines';
import { pickMetsLine } from '@/lib/metsBroadcastLines';
import { pickYankeesLine, pickYankeesPlayerLine } from '@/lib/yankeesBroadcastLines';
import { pickRedSoxLine, pickRedSoxPlayerLine } from '@/lib/redSoxBroadcastLines';
import { pickTigersLine, pickTigersPlayerLine } from '@/lib/tigersBroadcastLines';
import { pickRedsLine, pickRedsPlayerLine } from '@/lib/redsBroadcastLines';
import { pickRoyalsLine, pickRoyalsPlayerLine } from '@/lib/royalsBroadcastLines';

// Player nicknames — researched from 1984 MLB lore
const NICKNAMES = {
  "Ryne Sandberg": ["Ryno"],
  "Kirk Gibson": ["Gibby"],
  "Dwight Gooden": ["Doc", "Dr. K"],
  "Tony Gwynn": ["Mr. Padre"],
  "Darryl Strawberry": ["The Straw", "Straw"],
  "Cal Ripken Jr.": ["The Iron Man"],
  "Keith Hernandez": ["Mex"],
  "Dave Winfield": ["Big Dave"],
  "Don Mattingly": ["Donnie Baseball", "The Hit Man"],
  "Jack Morris": ["The Cat"],
  "Alan Trammell": ["Tram"],
  "Rick Sutcliffe": ["The Red Baron"],
  "Phil Niekro": ["Knucksie"],
  "Fernando Valenzuela": ["El Toro"],
  "Goose Gossage": ["Goose"],
  "Lee Smith": ["Arthur", "Big Lee"],
  "Wade Boggs": ["Chicken Man"],
  "Lance Parrish": ["Big Wheel"],
  "Lou Whitaker": ["Sweet Lou"],
  "Bob Dernier": ["The Deer"],
  "Gary Matthews": ["Sarge"],
  "Ron Cey": ["The Penguin"],
  "Dwight Evans": ["Dewey"],
  "Jim Rice": ["Jim Ed"],
  "Andre Dawson": ["The Hawk"],
  "Eddie Murray": ["Steady Eddie"],
  "Dave Righetti": ["Rags"],
  "Ron Guidry": ["Louisiana Lightning", "Gator"],
  "Willie Hernandez": ["Guillermo"],
  "Orel Hershiser": ["Bulldog"],
  "Pedro Guerrero": ["Pete"],
  "Bill Buckner": ["Billy Buck"],
  "Mookie Wilson": ["Mook"],
  "Dennis Eckersley": ["Eck"],
  "Bruce Sutter": ["The Riddler"],
  "Dan Quisenberry": ["Quiz", "The Submarine"],
  "George Brett": ["Mullet", "The Captain"],
  "Willie Wilson": ["The Jet", "Mookie"],
  "Steve Balboni": ["Bye-Bye", "Bones"],
  "Bret Saberhagen": ["Sabes"],
  "Frank White": ["Smooth"],
  "Keith Moreland": ["Zonk"],
  "Leon Durham": ["Bull"],
  "Aurelio López": ["Señor Smoke"],
  "Howard Johnson": ["HoJo"],
  "Sparky Anderson": ["Captain Hook", "Sparky"],
  "Steve Garvey": ["Mr. Clean"],
  "Graig Nettles": ["Puff"],
  "Jody Davis": ["Jody, Jody, Davis"],
  "Hubie Brooks": ["Super Hubie"],
  "Wally Backman": ["Wally World"],
  "Mike Marshall": ["Moose"],
  "John Lowenstein": ["Brother Low"],
  "Mike Boddicker": ["Bud"],
  "Roger Clemens": ["The Rocket"],
  "Dennis Boyd": ["Oil Can"],
  "Mike Easler": ["The Hit Man"],
  "Carmelo Martínez": ["The M&M Boys"],
  "Kevin McReynolds": ["The M&M Boys"],
  "Pete Rose": ["Charlie Hustle"],
  "Dave Parker": ["The Cobra"],
  "Cesar Cedeno": ["The Hawk"],
  "Mario Soto": ["Soto"],
  "John Franco": ["El Presidente"],
  "Dave Concepcion": ["Davey"],
  "Gary Redus": ["Red Dog"],
  "Eric Davis": ["Eric the Red"],
  "Tony Perez": ["Big Dog"],
  "Johnny Bench": ["Hands"],
  "Joe Morgan": ["Little Joe"],
};

// 1984 Announcers & Stadium Flavor — expanded with real stadium atmosphere
export const STADIUM_FLAVOR = {
  chicagoCubs: {
    announcers: ["Harry Caray", "Steve Stone"],
    stadium: "Wrigley Field",
    nicknames: ["The Friendly Confines", "Wrigley"],
    flavor: [
      "the ivy-covered brick walls here at Wrigley",
      "the Bleacher Bums are on their feet out in left",
      "a classic afternoon at the Friendly Confines",
      "that brick wall — it'll eat up a line drive in a hurry",
      "the old manual scoreboard in center field — nothing like the classic charm of this ballpark",
      "the fans are packed onto the rooftops across Waveland and Sheffield avenues — spectacular view from up there",
      "the flagpoles out there — these fans are watching for the 'W' flag",
      "natural grass and sunshine on the North Side",
      "you can feel the history in this old ballpark",
    ],
    weatherFlavor: [
      "the wind is blowing straight out toward Waveland Avenue today — pitchers better keep it down or it'll be a long afternoon",
      "the wind is blowing straight in from center field today — gopher balls are turning into routine pop flies",
      "the mist is rolling in off Lake Michigan right now — temperature just plummeted about fifteen degrees in the last three innings",
    ],
    cityFlavor: [
      "if you're taking the Red Line home tonight, folks, the platform at Addison is going to be an absolute sea of blue",
      "I smell the charcoal and Italian beef wafting into the booth from the neighborhood — this ballpark sits right in the middle of a backyard party",
      "a beautiful summer afternoon on the North Side — Ernie Banks used to say 'let's play two'",
      "the Second City loves its Cubbies",
    ],
    loreFlavor: [
      "day baseball at Wrigley — it's a way of life for generations of Chicagoans",
      "the Bleacher Bums are in peak form today — if an opposing player catches a home run ball out there, you know it's coming right back onto the field",
      "this crowd stays loud whether it's April or September",
    ],
    stretchFlavor: "Harry Caray grabs the mic — \"Take me out to the ballgame… Let's get some runs!\"",
  },
  bostonRedSox: {
    announcers: ["Ned Martin", "Bob Montgomery", "Joe Castiglione"],
    stadium: "Fenway Park",
    nicknames: ["Fenway", "America's Most Beloved Ballpark"],
    flavor: [
      "the Green Monster looming out in left field",
      "Pesky's Pole just 302 feet down the right field line",
      "the manual scoreboard on the Monster",
      "so much history in this old yard — Ted Williams, Carl Yastrzemski",
      "the Triangle out in deep center field — a center fielder's absolute nightmare",
      "Fenway's been here since 1912",
      "those tight dimensions always keep things interesting",
      "the crowd is packed in tight along the baselines",
      "that short porch in right — Pesky's Pole is just waiting",
      "the legendary Red Seat out in right field — that one marks where Ted Williams' longest blast landed",
    ],
    weatherFlavor: [
      "that thick, damp April air is blowing right in off the Charles River tonight — hitters will really have to cut through a wall to get anything out",
      "the sun is setting over the third-base grandstands, creating some really tough shadows for the hitters right now",
    ],
    cityFlavor: [
      "the crowds are packing into Lansdowne Street outside the park tonight — you can feel the energy radiating right through the brick",
      "I grabbed a bowl of New England clam chowder behind home plate before the first pitch — thick as wet cement, just the way it should be",
      "if you're jumping on the T or navigating Storrow Drive after the game, good luck — pack your patience, folks",
      "Boston's been a baseball town since the beginning",
    ],
    loreFlavor: [
      "you look down at the grass and think of the absolute giants who played here: Teddy Ballgame, Yaz, Pedro, Papi — history baked into the dirt",
      "this crowd is notoriously demanding — they know the game inside and out and will let you hear it if you miss a cutoff man",
      "in New England, baseball isn't a pastime — it's a full-blown religion",
    ],
    stretchFlavor: "the crowd belts out 'Sweet Caroline' in the middle of the eighth — tradition like no other",
  },
  detroitTigers: {
    announcers: ["Ernie Harwell", "Paul Carey"],
    stadium: "Tiger Stadium",
    nicknames: ["The Corner", "Michigan and Trumbull"],
    nicknames: ["The Corner", "Tiger Stadium"],
    flavor: [
      "the right field overhang here at The Corner",
      "Tiger Stadium — baseball at Michigan and Trumbull",
      "the upper deck hangs right over the field",
      "Ty Cobb and Hank Greenberg called this place home",
      "the echoes of '68 still ring through these rafters",
      "look at the skyline lighting up over the left-field brick — best backdrop in baseball on a summer night",
      "the statues of the legends out in right field looking on: Cobb, Kaline, Newhouser",
      "the carousel and the Ferris wheel are lit up behind the stands — always a great atmosphere for families here",
    ],
    weatherFlavor: [
      "that heavy air rolling in over the outfield walls from the Detroit River tonight — hitting it out to dead center is going to be a monumental task",
      "it's early April in Michigan, folks — we've got fans in the front row wearing full winter parkas and drinking hot cocoa — that is real dedication",
      "a bit of a lake-effect breeze cutting across the diamond right now — pitchers are definitely going to need the rosin bag to keep the fingers warm",
    ],
    cityFlavor: [
      "you can tell the shift just let out over at the auto plants — the concourse is starting to pack in with that classic, hard-working Detroit crowd",
      "I grabbed a couple of Coney dogs before the game — heavy on the chili, heavy on the onions — breakfast of champions in this city",
      "if you're taking the Lodge or I-75 home after the final out, bless your heart — give yourself a little extra time",
      "the crowd is bringing the noise tonight — when the Tigers are rolling, the whole city vibrates",
    ],
    loreFlavor: [
      "as the legendary Ernie Harwell used to say on foul balls: 'A fan from Dearborn caught that one!'",
      "the 'Bless You Boys' spirit is alive in the bleachers tonight — fans still chasing that feeling from the magical '84 run",
      "reminds me of the split-finger stuff Jack Morris used to ride to a ring back in the day",
    ],
    stretchFlavor: null,
  },
  sanDiegoPadres: {
    announcers: ["Jerry Coleman", "Dave Campbell"],
    stadium: "Jack Murphy Stadium",
    nicknames: ["The Murph", "Jack Murphy"],
    flavor: [
      "the sun is setting over the Pacific — the sky over the Western Metal Supply Co. building is just a gorgeous shade of amber",
      "perfect San Diego weather at The Murph",
      "the palm trees swaying beyond the outfield",
      "Tony Gwynn territory out in right field",
      "the breeze off the Pacific keeping things cool",
      "you can see the beach area out in center field — a lucky fan might catch a home run while sitting in the sand",
      "the shadows are starting to stretch across the infield — always a tricky few frames for the hitters until the sun goes down completely",
    ],
    weatherFlavor: [
      "the classic San Diego marine layer is starting to creep over the stadium — the air is getting heavy and it's going to turn those deep drives into routine flyouts",
      "just a flawless, 75-degree day without a cloud in the sky — perfect weather for a ballgame, every single day of the week",
    ],
    cityFlavor: [
      "I grabbed a couple of fish tacos on the concourse before the first pitch — lots of lime, lots of cilantro — absolute perfection",
      "if you're taking the San Diego Trolley home tonight, the platforms are going to be a sea of brown and gold",
      "we've got a massive contingent from the local naval base out in the right-field grandstands today — always great to have our military families in the yard",
      "this city loves its baseball — when the Padres are hot, the energy downtown is unmatched",
    ],
    loreFlavor: [
      "you look down at the right-field line and you can't help but think of that giant number 19 — Tony Gwynn cast a massive, beautiful shadow over this franchise",
      "a spectacular play out there — somewhere, the old 'Goose' is smiling down on this defense",
      "the Friar is out on the dugout roof getting the crowd fired up",
    ],
    stretchFlavor: null,
  },
  newYorkYankees: {
    announcers: ["Phil Rizzuto", "Frank Messer", "Bill White"],
    stadium: "Yankee Stadium",
    nicknames: ["The House That Ruth Built", "The Stadium"],
    flavor: [
      "Monument Park out beyond the center field fence",
      "the ghosts of Ruth, Gehrig, and Mantle",
      "the short porch in right — 314 feet to the pole — you don't have to get all of it to get it out over there",
      "27 World Championships hanging in the rafters",
      "the Bronx is buzzing this afternoon",
      "you can hear the Bleacher Creatures starting up their Roll Call in right — they won't stop until every fielder waves back",
      "look at the field: no names on the back of the home jerseys — just classic pinstripes — tradition is everything in the Bronx",
      "a clean-shaven clubhouse, pants pulled up right — George Steinbrenner's grooming policy is alive and well",
    ],
    weatherFlavor: [
      "the wind is really pushing out toward that short porch in right field today",
      "a bit of a humid breeze coming off the Harlem River tonight — might give the breaking balls a tiny bit of extra bite",
    ],
    cityFlavor: [
      "if you're taking the D-train or the 4-line home tonight, good luck — it'll be bumper-to-bumper on the platform after this one",
      "I checked the traffic on the Major Deegan on the way in — standard Bronx parking lot — if you're driving, hope you brought patience",
      "I had a slice from a little spot on 161st before the game — burnt the roof of my mouth, but completely worth it — real New York pizza",
      "nothing like the sound of 'New York, New York' blasting over the PA after a big win — best closing song in sports",
    ],
    loreFlavor: [
      "I was looking at old clips of the 1927 Murderers' Row team — Babe Ruth and Lou Gehrig stood right where these guys are standing",
      "the ghosts of the old Stadium might be across the street, but you can still feel that classic October aura when the lights get bright",
    ],
    neurosisFlavor: [
      "this crowd is getting a little restless — in New York, a two-game losing streak feels like a full-blown crisis",
      "it's World Series or bust here — a 95-win season means absolutely nothing to these fans if you don't get the ring",
      "the talk on the local sports radio columns this morning was brutal — this town has zero patience for a prolonged slump",
    ],
    stretchFlavor: null,
  },
  baltimoreOrioles: {
    announcers: ["Chuck Thompson", "Brooks Robinson"],
    stadium: "Memorial Stadium",
    nicknames: ["Memorial Stadium", "The Old Gray Lady"],
    flavor: [
      "Memorial Stadium — home of the Birds since '54",
      "Brooks Robinson made magic at the hot corner here",
      "Cal Ripken's home field",
      "the Oriole Way — pitching and defense",
      "the warehouse looks absolutely spectacular against the twilight sky — best view in the Major Leagues",
      "you can smell the pit beef and crab cakes wafting down from Boog's BBQ behind the right-field flag court — making me hungry over here",
      "if you're looking for a ball down on the flag court, keep your eyes peeled — home run balls bounce hard off that concrete",
      "that deep left-field wall — the 'Lord Baltimore' wall — is where fly balls go to die",
    ],
    weatherFlavor: [
      "the humidity is rising off the Chesapeake tonight — the ball is going to carry a little better if you can get it up into the jet stream",
    ],
    cityFlavor: [
      "the crowd is fired up tonight, hon — this city absolutely bleeds orange when the weather gets warm",
      "if you're hitting the roads after the final out, watch out for the traffic piling up around the Inner Harbor",
      "the national anthem just finished, and as always, the Baltimore faithful let out a massive 'O!' that shook the upper deck",
      "I saw a few fans out in left field wearing full crab costumes — you gotta love the local flavor in this town",
    ],
    loreFlavor: [
      "you look down at the shortstop position and you can't help but think of the Iron Man — Number 8 cast a very long shadow in this stadium",
      "this organization prides itself on fundamental baseball — hit the cutoff man, protect the plate — that's classic 'Oriole Way' philosophy",
      "the ghosts of Earl Weaver are definitely hovering around the dugout tonight — you can almost hear him barking at the umpires",
      "a smooth, steady play — somewhere, Brooks and Eddie are smiling down on this infield defense",
    ],
    stretchFlavor: null,
  },
  losAngelesDodgers: {
    announcers: ["Vin Scully", "Jerry Doggett"],
    stadium: "Dodger Stadium",
    nicknames: ["Chavez Ravine", "Blue Heaven on Earth"],
    flavor: [
      "the San Gabriel Mountains beyond the outfield pavilions — absolutely painting the sky in purple and gold",
      "look at that beautiful pavilion out in left and right field — clean, classic, packed to the brim with Dodger blue",
      "Fernandomania was born right here",
      "the left field pavilion and those Dodger Dogs — still the gold standard for ballpark food",
      "the shadows are creeping across the infield from the grandstand — notoriously difficult time for hitters to pick up the spin",
      "you can spot a few Hollywood A-listers sitting behind home plate tonight — always a star-studded affair when the Dodgers are in town",
    ],
    weatherFlavor: [
      "a gorgeous, pristine 72-degree night in Southern California — not a cloud in the sky — it's tough to beat a night at the Ravine",
      "the marine layer is starting to roll in, making the air a little heavy — the ball might not carry quite as well into the deep gaps later",
    ],
    cityFlavor: [
      "it's the top of the third and the late-arriving LA crowd is finally settled into their seats — standard Friday night traffic on the 101",
      "if you're heading down Vin Scully Avenue after the final out, give yourself plenty of time — the parking lot at Chavez Ravine is a beast",
    ],
    loreFlavor: [
      "you look up at the press box and can't help but think of the master himself — 'It's time for Dodger baseball!' — those words still echo",
      "the spirit of Fernandomania is still alive in these stands — this fanbase has a deep, generational love for this team",
      "a beautifully executed curveball — somewhere, Sandy Koufax is looking down approvingly on that sequence",
    ],
    stretchFlavor: null,
  },
  newYorkMets: {
    announcers: ["Ralph Kiner", "Tim McCarver", "Bob Murphy"],
    stadium: "Shea Stadium",
    nicknames: ["Shea"],
    flavor: [
      "the jets taking off from LaGuardia beyond the outfield",
      "Shea Stadium in Flushing Meadows",
      "Doc Gooden's home turf",
      "he drives one deep to center — look at the giant apple rising up beyond the wall! That is a home run for the Mets!",
      "you can hear the rumble of the 7-train rolling past the outfield stands — that is the soundtrack of baseball in Queens",
      "the planes are roaring overhead out of LaGuardia — a little extra noise for the pitchers to work through on the mound",
      "that ball was absolutely hit a mile — drove it right into the left-field seats where the '7 Line Army' is going absolutely wild",
    ],
    weatherFlavor: [
      "a brisk, chilly night in Flushing — the wind is whipping in hard off Flushing Bay and it's going to knock down anything hit high into the air",
      "the summer humidity is thick out here tonight — the ball should jump off the bat if you can get it up over the infield line",
    ],
    cityFlavor: [
      "I grabbed a pastrami sandwich on rye before the first pitch — extra mustard, just the way they do it behind home plate here — unbelievable",
      "if you're jumping on the Grand Central Parkway or the Van Wyck after the game, bless your heart — good luck out there",
      "the crowd is starting to get that classic, high-octane Queens energy going — when this place gets loud, the whole structure vibrates",
      "the fans are up and on their feet as Mr. Met makes his rounds — there really isn't a more recognizable head in baseball",
    ],
    loreFlavor: [
      "you look down at the dugout and think about the magic of '69 — this franchise has a history of making the impossible happen",
      "a dazzling defensive play at first base — shades of Keith Hernandez saving a run with that spectacular glovework",
    ],
    neurosisFlavor: [
      "Mets fans are checking their pulses right now — in Queens, a three-run lead in the ninth inning still feels like a tightrope walk",
      "the sports talk radio phones are going to be absolutely melting tomorrow morning if they don't lock down this victory",
    ],
    stretchFlavor: null,
  },
  kansasCityRoyals: {
    announcers: ["Denny Matthews", "Fred White"],
    stadium: "Royals Stadium",
    nicknames: ["Royals Stadium", "The K"],
    flavor: [
      "the fountains are flowing beyond the outfield — just a gorgeous sight on a Kansas City evening",
      "one of baseball's most beautiful ballparks here at Royals Stadium",
      "a perfect summer night in the Heartland",
      "the water dancing in the fountains beyond the right-center field fence",
      "baseball and barbecue — not a bad combination in Kansas City",
      "Royals Stadium was built for baseball and nothing else — outstanding sightlines everywhere",
      "you can see the fountains sparkling from any seat in the ballpark",
      "this ballpark remains one of baseball's showcase facilities",
      "a gorgeous night in Kansas City — the fountains are flowing",
    ],
    weatherFlavor: [
      "a little hazy and humid tonight — typical Missouri summer — but the ball should carry",
      "a gorgeous, crisp Midwestern evening — perfect baseball weather at Royals Stadium",
    ],
    cityFlavor: [
      "if you're heading out after the game, the barbecue joints on the Missouri side will still be smoking",
      "I grabbed some burnt ends before the first pitch — that is pure Kansas City right there",
      "Kansas City has supported this club since day one — great baseball town",
      "the crowd is filing in from all across the metro — Johnson County, Wyandotte, even folks driving in from Lawrence and Topeka",
      "a great baseball crowd tonight — Kansas City always shows up for its Royals",
      "Baseball and barbecue — a pretty good combination, and Kansas City does both better than just about anyone",
    ],
    loreFlavor: [
      "you look around this ballpark and think of George Brett's .390 chase — that was must-see baseball every single night in 1980",
      "the Royals have built their reputation on pitching, speed, and defense, and you can feel that tradition in the stadium",
      "this franchise has been playing winning baseball since the late '70s — the crowd here expects excellence",
      "the Royals continue to draw some of baseball's best fans — Kansas City has always been a great baseball town",
    ],
    stretchFlavor: null,
  },
  cincinnatiReds: {
    announcers: ["Joe Nuxhall", "Marty Brennaman"],
    stadium: "Riverfront Stadium",
    nicknames: ["Riverfront", "The Concrete Doughnut"],
    flavor: [
      "the artificial turf playing quick tonight at Riverfront",
      "ground balls can really scoot through on this turf",
      "Riverfront Stadium on the banks of the Ohio River",
      "the symmetrical bowl here at Riverfront — baseball under the lights in Cincinnati",
      "you can see the downtown skyline just beyond the outfield — Carew Tower standing tall",
      "a few barges moving slowly down the Ohio beyond the outfield — classic Cincinnati scene",
      "the Queen City enjoying a beautiful evening at the old concrete doughnut",
      "this crowd knows its baseball — they've been watching it here since 1869",
      "Riverfront's been good to the Reds since it opened in 1970",
    ],
    weatherFlavor: [
      "the heat is radiating off the artificial turf — the ground temperature has to be pushing 120 degrees out there",
      "a little river fog drifting in from the Ohio tonight — might make it tough to track the ball in the outfield",
      "a humid summer evening along the river — the ball should carry better as the night warms up",
    ],
    cityFlavor: [
      "nothing wrong with a bowl of Cincinnati chili at Skyline before the game — three-way, extra cheese",
      "if you're taking I-75 or the Brent Spence Bridge after the final out, give yourself a few extra minutes",
      "the chili parlors downtown should be busy tonight — Skyline, Gold Star, Camp Washington — take your pick",
      "greetings from Cincinnati, the Queen City — baseball's first professional team, and this town's never forgotten it",
    ],
    loreFlavor: [
      "you look around this ballpark and think of the Big Red Machine — Bench, Morgan, Perez, Rose — my goodness, what a team that was",
      "this place was absolutely rocking during the World Series years of '75 and '76",
      "a lot of baseball history in this town — the Reds have been playing professional ball longer than most cities have even existed",
      "Pete Rose is out at first base tonight, still managing from the field at age 43 — nobody out-hustles Charlie Hustle",
      "that smooth play at short — Concepcion makes it look so easy, doesn't he?",
    ],
    neurosisFlavor: null,
    stretchFlavor: null,
  },
};

// Team key to flavor key mapping (matches TEAMS keys from gameData.js)
export const TEAM_TO_FLAVOR = {
  cubs: "chicagoCubs",
  redsox: "bostonRedSox",
  tigers: "detroitTigers",
  padres: "sanDiegoPadres",
  yankees: "newYorkYankees",
  orioles: "baltimoreOrioles",
  dodgers: "losAngelesDodgers",
  mets: "newYorkMets",
  reds: "cincinnatiReds",
  royals: "kansasCityRoyals",
};

function getCommentary(batter, pitcher, gameState, stadiumInfo) {
  const batterName = batter?.name || '';
  const lastName = batterName.split(' ').pop() || batterName;

  const ab = batter?.gameStats?.ab || 0;
  const hits = batter?.gameStats?.hits || 0;
  const rbi = batter?.gameStats?.rbi || 0;
  const hr = batter?.gameStats?.hr || 0;
  const avg = ab > 0 ? (hits / ab).toFixed(3) : '.000';

  const count = gameState.balls === 0 && gameState.strikes === 0 ? 'no balls and no strikes'
    : gameState.balls === 0 ? `0 and ${gameState.strikes}`
    : gameState.strikes === 0 ? `${gameState.balls} and 0`
    : `${gameState.balls} and ${gameState.strikes}`;
  const outs = gameState.outs;
  const inning = gameState.inning;
  const half = gameState.halfInning === 'top' ? 'top' : 'bottom';
  const pos = batter?.assignedPos || batter?.pos || '';
  const posName = { C: 'catcher', '1B': 'first baseman', '2B': 'second baseman', '3B': 'third baseman', SS: 'shortstop', LF: 'left fielder', CF: 'center fielder', RF: 'right fielder', DH: 'designated hitter', SP: 'pitcher' }[pos] || pos;

  const nicknames = NICKNAMES[batterName] || [];
  const hasNick = nicknames.length > 0;
  const runnersOn = gameState.bases.filter(b => b !== null).length;

  const info = stadiumInfo || {};
  const announcer = info.announcers ? info.announcers[Math.floor(Math.random() * info.announcers.length)] : null;

  const options = [];

  // Count/outs announcement
  options.push(`The ${count} count, ${outs === 0 ? 'nobody' : outs === 1 ? 'one' : 'two'} ${outs === 1 ? 'away' : 'out'}`);
  options.push(`${count} the count, ${outs} ${outs === 1 ? 'out' : 'outs'}, ${half} ${inning}`);

  // Player intro — fresh at-bat
  if (ab === 0) {
    options.push(`Now batting, ${posName}, ${batterName}`);
    options.push(`Up now, ${batterName}`);
    options.push(`Now at the plate: ${batterName}`);
    if (hasNick) {
      options.push(`Here comes ${nicknames[0]}`);
      if (announcer) options.push(`${announcer}: "Here comes ${nicknames[0]}"`);
    }
  }

  // With stats
  if (ab > 0) {
    options.push(`${batterName}, ${hits} for ${ab} today`);
    if (rbi > 0) options.push(`${batterName} — ${hits} for ${ab} with ${rbi} RBI${rbi !== 1 ? 's' : ''}`);
    if (hr > 0) options.push(`${lastName} has gone deep today — ${hits} for ${ab}`);
    options.push(`${batterName} hitting ${avg} on the afternoon`);
  }

  // Fatigue warnings
  const isFatigued = pitcher?.fatigueLevel > 0;
  const isGassed = pitcher?.fatigueLevel >= 3;

  // Pitcher focus — windup with bases empty, stretch with runners on
  const pitcherDelivery = runnersOn > 0
    ? `${pitcher?.name} deals from the stretch`
    : `${pitcher?.name} works from the windup`;
  options.push(pitcherDelivery);
  options.push(`${pitcher?.name} looks in for the sign`);
  if (runnersOn === 0) {
    options.push(`${pitcher?.name} winds and fires`);
    options.push(`${pitcher?.name} comes set — here's the pitch`);
  }
  if (runnersOn > 0) {
    options.push(`${pitcher?.name} comes to the stretch, checks the runner`);
    options.push(`${pitcher?.name} from the stretch — kicks and deals`);
  }

  // Fatigue commentary
  if (isGassed) {
    options.push(`${pitcher?.name} is running on fumes — the manager might need to think about the bullpen`);
    options.push(`${pitcher?.name} has lost a few ticks on the fastball — he's laboring out there`);
    options.push(`The velocity is dropping — ${pitcher?.name} is clearly gassed`);
    if (announcer) options.push(`${announcer}: "You can see the arm slot dropping — ${pitcher?.name} is running on empty"`);
  } else if (isFatigued) {
    options.push(`${pitcher?.name} is starting to show signs of fatigue — the command isn't quite as sharp`);
    options.push(`A little less zip on the fastball — ${pitcher?.name} is working deep into this one`);
    if (announcer) options.push(`${announcer}: "${pitcher?.name} is grinding — you can tell the tank is starting to get low"`);
  }

  // Runners on
  if (runnersOn === 1) options.push(`Runner aboard for ${lastName}`);
  if (runnersOn === 2) options.push(`Two on, two ${outs === 2 ? 'away' : 'down'}`);
  if (runnersOn === 3) options.push(`Bases loaded, ${outs === 0 ? 'nobody' : outs + ' ' + (outs === 1 ? 'out' : 'outs')}`);

  // Situation
  if (runnersOn > 0 && outs < 2) options.push(`Chance to drive in a run here`);
  if (outs === 2) options.push(`Two away, ${lastName} at the dish`);

  // --- Stadium Flavor ---
  // Determine if home team is trailing late — for neurosis lines
  const isBattingTeamHome = gameState.halfInning === 'bottom';
  const homeTrailing = (isBattingTeamHome && gameState.score.home < gameState.score.away) ||
    (!isBattingTeamHome && gameState.score.home < gameState.score.away);
  const isLateInning = gameState.inning >= 7;
  const useNeurosis = info.neurosisFlavor && homeTrailing && isLateInning && Math.random() < 0.50;

  if (useNeurosis) {
    const flav = info.neurosisFlavor[Math.floor(Math.random() * info.neurosisFlavor.length)];
    options.push(flav);
    if (announcer) options.push(`${announcer}: "${flav}"`);
  } else if (info.flavor) {
    // Mix in weather flavor ~20% of the time
    const useWeather = info.weatherFlavor && Math.random() < 0.20;
    if (useWeather) {
      const flav = info.weatherFlavor[Math.floor(Math.random() * info.weatherFlavor.length)];
      options.push(flav);
      if (announcer) options.push(`${announcer}: "${flav}"`);
    } else {
      const flav = info.flavor[Math.floor(Math.random() * info.flavor.length)];
      options.push(flav);
      if (announcer) options.push(`${announcer}: "${flav}"`);
    }
  }
  if (info.cityFlavor) {
    const cflav = info.cityFlavor[Math.floor(Math.random() * info.cityFlavor.length)];
    options.push(cflav);
  }
  // Occasional lore flavor
  if (info.loreFlavor && Math.random() < 0.25) {
    const lflav = info.loreFlavor[Math.floor(Math.random() * info.loreFlavor.length)];
    options.push(lflav);
  }

  // Classic baseball slang & sayings — filter by game context
  const anyRunners = runnersOn > 0;
  const runnerSlang = anyRunners ? [
    `Ducks on the pond for ${lastName}`,
    `Chance to clear the ducks off the pond here`,
    `Twin killing would be big right here`,
    `Double play depth — middle infielders creeping in`,
  ] : [];
  const allSlangOptions = [
    // Hitting
    ...runnerSlang,
    `${lastName} digging in at the dish`,
    `The hot corner is ready — ${lastName} steps in`,
    `Can of corn territory out there`,
    'Frozen rope — that was absolutely squared up',
    `This one's hit on a frozen rope!`,
    `${lastName} could use a little seeing-eye single right here`,
    `Texas Leaguer territory — bloop it in, ${lastName}`,
    `Worm burner down the line`,
    `That's a bleeder — might find some grass`,
    `Around the horn — let's see what develops`,
    `Warning track power out there`,
    `He's got warning track power but that's about it`,
    `No-doubter off the bat!`,
    `Looking for a dinger here`,
    `A moonshot would be something, wouldn't it?`,
    `Give it a ride, ${lastName} — send a tater out of here`,
    `Big fly time, ${lastName}`,
    // Pitching & Stuff
    `${pitcher?.name} bringing the high cheese`,
    `Here comes Uncle Charlie — buckle up`,
    `${pitcher?.name} might give him a little chin music`,
    `High and tight — ${pitcher?.name} backing ${lastName} off the plate`,
    `Public Enemy No. 1 from ${pitcher?.name}`,
    `Southpaw slinging from the left side — tough angle`,
    `No gopher balls here — ${pitcher?.name} keeping it down`,
    `${lastName} protecting the plate now`,
    `${lastName} crowds the dish`,
    `He'll take one for the team if he has to`,
    `${pitcher?.name} painting the corners`,
    `${pitcher?.name} dotting the black with that heater`,
    `He's got swing-and-miss stuff working today`,
    `The hook is on — ${pitcher?.name} dealing`,
    // In the Field
    `Around the horn they go`,
    `${lastName}'s below the Mendoza Line — needs to get it going`,
    `${lastName} looking for his pitch to drive`,
    `Gap-to-gap hitter, this ${posName}`,
    `Small ball might be the play here`,
    `Hit 'em where they ain't`,
    `Good wood on that one`,
    `He's in a groove — locked in at the plate`,
    // General
    `Pitcher's duel unfolding here at ${info.stadium || 'the ballpark'}`,
    `Hitters' counts and pitchers' counts — that's the chess match`,
    `Gotta love October-type baseball — every pitch matters`,
    `Just a cup of coffee in the big leagues — but every at-bat counts`,
    `A dribbler or a nubber — anything to get on base`,
    `The tools of ignorance — and ${lastName}'s wearing 'em proudly`,
  ];

  // Always mix in 1-2 slang terms for a colorful broadcast feel
  const shuffleSlang = [...allSlangOptions].sort(() => Math.random() - 0.5);
  const slangCount = Math.random() < 0.35 ? 2 : 1;
  for (let i = 0; i < slangCount; i++) {
    options.push(shuffleSlang[i]);
  }

  // Inning-specific atmosphere
  if (inning === 1) {
    options.push(`First inning here at ${info.stadium || 'the ballpark'}`);
    if (announcer) options.push(`${announcer}: "Welcome to ${info.stadium || 'the ballpark'}!"`);
  }
  if (inning === 9 && outs === 2 && half === 'bottom') {
    options.push(`Last call here at ${info.stadium || 'the ballpark'} — one out to go!`);
  }

  // Stadium-specific scoring context
  if (info.nicknames) {
    const nickname = info.nicknames[Math.floor(Math.random() * info.nicknames.length)];
    options.push(`A beautiful day at ${nickname}`);
  }

  return options[Math.floor(Math.random() * options.length)];
}

export default function CommentaryBanner({ batter, pitcher, gameState, lastPlay, stadium, homeTeamKey }) {
  if (!batter || !gameState) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
        <span className="text-sm text-muted-foreground font-heading italic">...and we're underway!</span>
      </div>
    );
  }

  const flavorKey = TEAM_TO_FLAVOR[homeTeamKey] || null;
  const stadiumInfo = flavorKey ? STADIUM_FLAVOR[flavorKey] : null;
  const isCubsGame = homeTeamKey === 'cubs';
  const isPadresGame = homeTeamKey === 'padres';
  const isDodgersGame = homeTeamKey === 'dodgers';
  const isMetsGame = homeTeamKey === 'mets';
  const isYankeesGame = homeTeamKey === 'yankees';
  const isRedSoxGame = homeTeamKey === 'redsox';
  const isTigersGame = homeTeamKey === 'tigers';
  const isRedsGame = homeTeamKey === 'reds';
  const isRoyalsGame = homeTeamKey === 'royals';
  // When there's a play result, show it as the main call — don't bury it under random flavor
  const isSteal = lastPlay?.type === 'steal';
  const isCaughtStealing = lastPlay?.type === 'caughtstealing';
  const hasPlayResult = lastPlay?.text && !['strike','ball','foul'].includes(lastPlay?.type);
  const wasReachBack = gameState?._wasReachBack;
  const reachBackPitcher = wasReachBack && pitcher?.specialty ? pitcher : null;

  let text;
  if (wasReachBack && reachBackPitcher) {
    // Super pitch announcer call — mention the signature weapon
    const spName = reachBackPitcher.specialty?.name || reachBackPitcher.specialty;
    const calls = [
      `${reachBackPitcher.name} reaches back for something extra — the ${spName} is coming!`,
      `${reachBackPitcher.name} goes to the well — here's that vintage ${spName}!`,
      `${reachBackPitcher.name} summons the ${spName} — the crowd rises!`,
      `${reachBackPitcher.name} uncorks the ${spName} — he's pulling out all the stops!`,
      `You can feel the electricity — ${reachBackPitcher.name} is about to unleash the ${spName}!`,
      `${reachBackPitcher.name} grips it, winds, and here it comes — the legendary ${spName}`,
    ];
    text = calls[Math.floor(Math.random() * calls.length)];
  } else if (hasPlayResult) {
    // Play result IS the headline — show it prominently
    text = lastPlay.text;
  } else if (isSteal && lastPlay?.text) {
    text = `He's going! ${lastPlay.text}`;
  } else if (isCaughtStealing && lastPlay?.text) {
    text = lastPlay.text;
  } else {
    // No play result yet (between pitches) — use team-specific or generic flavor
    text = isCubsGame && Math.random() < 0.65
      ? pickHarryLine()
      : isPadresGame && Math.random() < 0.65
        ? (pickPadresPlayerLine(batter?.name) || pickPadresLine())
        : isDodgersGame && Math.random() < 0.70
          ? pickVinLine()
          : isMetsGame && Math.random() < 0.65
            ? pickMetsLine()
            : isYankeesGame && Math.random() < 0.65
              ? (pickYankeesPlayerLine(batter?.name) || pickYankeesLine())
              : isRedSoxGame && Math.random() < 0.65
                ? (pickRedSoxPlayerLine(batter?.name) || pickRedSoxLine())
                : isTigersGame && Math.random() < 0.65
                  ? (pickTigersPlayerLine(batter?.name) || pickTigersLine())
                  : isRedsGame && Math.random() < 0.70
                    ? (pickRedsPlayerLine(batter?.name) || pickRedsLine())
                    : isRoyalsGame && Math.random() < 0.70
                      ? (pickRoyalsPlayerLine(batter?.name) || pickRoyalsLine())
                      : getCommentary(batter, pitcher, gameState, stadiumInfo);
  }

  return (
    <div className="bg-card/80 border border-border rounded-xl px-4 py-3 text-center overflow-hidden">
      {/* ON AIR banner */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
        <span className="text-xs text-muted-foreground/60 font-heading uppercase tracking-[0.25em]">
          {stadiumInfo?.announcers?.[0] || 'ON AIR'}
        </span>
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
      </div>

      {/* Announcer name tag */}
      {stadiumInfo?.announcers?.length >= 2 && (
        <div className="text-[10px] text-muted-foreground/50 font-heading tracking-wider mt-0.5">
          with {stadiumInfo.announcers.join(' & ')}
        </div>
      )}

      {/* Main call */}
      <p className="text-base sm:text-lg font-heading font-semibold text-foreground/95 mt-1.5 leading-snug italic">
        "{text}"
      </p>

      {/* Last play flash — only shown when main call is flavor, not play result */}
      {lastPlay && lastPlay.text && !hasPlayResult && (
        <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 inline-block">
          <span className="text-sm font-heading font-bold text-primary">{lastPlay.text}</span>
        </div>
      )}

      {/* Count indicators */}
      <div className="flex items-center justify-center gap-6 mt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">B</span>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.balls ? 'bg-green-500' : 'bg-muted/40'}`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">S</span>
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.strikes ? 'bg-primary' : 'bg-muted/40'}`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">O</span>
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.outs ? 'bg-destructive' : 'bg-muted/40'}`} />
          ))}
        </div>
      </div>

      {/* Stadium tag */}
      {stadiumInfo?.stadium && (
        <div className="mt-2 text-[10px] text-muted-foreground/40 font-heading tracking-wide">
          🏟 {stadiumInfo.stadium}
        </div>
      )}
    </div>
  );
}