// Arcades & Video Games #651-675 (1984 arcade classics + home consoles)

const ENTRIES = [
  {
    id: 'avp_651',
    title: 'Marble Madness',
    icon: '🎱',
    color: '#f97316',
    anim: 'bounce',
    matchText: 'Marble Madness challenges you at the arcade.',
    body: `MARBLE MADNESS ARRIVES!

Can you guide your marble through twisting ramps, narrow pathways, deadly obstacles, and impossible jumps before time runs out?

PUBLISHER: Atari Games
RELEASED: 1984
CONTROLS: Trackball

THE INNOVATION
Marble Madness was one of the first arcade games to use a true isometric 3D perspective, creating a revolutionary visual experience.

THE CHALLENGE
Six different levels with increasing difficulty, from simple ramps to impossible jumps and disappearing platforms.

THE GAMEPLAY
Guide your marble with precision using the trackball controller. One mistake and you're rolling back to the start.

CURRENT HIGH SCORE AT AL'S ARCADE: 47,830

THE APPEAL
Simple concept, incredibly difficult execution. Marble Madness attracts serious players seeking the ultimate challenge.

"Easy to learn. Nearly impossible to master."`,
  },
  {
    id: 'avp_652',
    title: 'New Arcade Machines',
    icon: '🕹️',
    color: '#8b5cf6',
    anim: 'pulse',
    matchText: 'New arcade games arrive weekly at your local arcade.',
    body: `NEW ARCADE GAMES ARRIVING WEEKLY!

America's arcades have never been busier.

RECENT ARRIVALS INCLUDE:
• Marble Madness
• Spy Hunter
• Punch-Out!!
• Dragon's Lair
• Track & Field
• Pole Position II

THE COST
Most machines cost 25 cents per play, though some deluxe cabinets now charge 50 cents.

THE PHENOMENON
The arcade industry is expected to generate over $5 billion this year, making arcades the hottest entertainment destination for teenagers and young adults.

THE COMMUNITY
Arcades have become social centers where players compete for high scores and bragging rights.

THE FUTURE
New games arrive almost weekly as manufacturers race to capitalize on arcade mania.

"The next great game may already be waiting."`,
  },
  {
    id: 'avp_653',
    title: 'Xevious',
    icon: '✈️',
    color: '#06b6d4',
    anim: 'pulse',
    matchText: 'Xevious attacks at the arcade.',
    body: `CAN YOU SAVE EARTH?

The alien forces of Xevious are attacking.

Pilot the Solvalou fighter, destroy enemy aircraft, and bomb hidden ground installations as you battle wave after wave of attackers.

MANUFACTURER: Namco
RELEASED: 1983

THE GAMEPLAY
Unique dual-action gameplay requires destroying both air and ground targets, adding strategic depth.

THE INNOVATION
Xevious became one of Japan's biggest arcade hits and helped define the scrolling shooter genre.

THE CHALLENGE
Enemy patterns become increasingly complex as you progress through wave after wave of attackers.

THE APPEAL
Combining air and ground targets creates a tactical element missing from simpler shooters.

THE LEGACY
Xevious influenced countless shooters and remains a beloved classic.

"One quarter. One ship. One chance."`,
  },
  {
    id: 'avp_654',
    title: 'Dig Dug',
    icon: '⛏️',
    color: '#ef4444',
    anim: 'pulse',
    matchText: 'Dig Dug challenges you underground.',
    body: `DIG DUG

The underground challenge continues.

Inflate enemies until they burst or crush them with falling rocks as you tunnel through an ever-changing maze.

ENEMIES:
• Pooka - Round red creatures
• Fygar - Dragon-like monsters that breathe fire

THE GAMEPLAY
Navigate underground mazes while avoiding enemies. Use inflation to destroy them or drop rocks for instant kills.

THE STRATEGY
Each enemy type requires different tactics. Learning to use the environment becomes crucial for survival.

WORLD RECORD SCORES CONTINUE TO RISE NATIONWIDE

THE APPEAL
Simple mechanics with surprising depth. The inflation mechanic adds unique strategic choices.

THE FUN FACT
Fygar can breathe fire, adding an extra threat level compared to the simpler Pooka.

"If you stop digging, you're probably dead."`,
  },
  {
    id: 'avp_655',
    title: 'Track & Field',
    icon: '🏃',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'Track & Field brings Olympic competition to arcades.',
    body: `THE ARCADE OLYMPICS

Can you break the world record?

COMPETE IN:
• 100 Meter Dash
• Long Jump
• Javelin
• Hurdles
• Hammer Throw

PUBLISHER: Konami

THE GAMEPLAY
Button mashing determines speed and power. Learn the rhythm for each event to maximize performance.

THE PHENOMENON
Players routinely pounded buttons so hard that arcade operators had to replace them weekly.

THE APPEAL
Competitive, skill-based gameplay appeals to athletes and arcade enthusiasts alike.

THE VARIETY
Five different events provide variety and require mastering multiple techniques.

THE INTENSITY
The rapid button-mashing creates physical exhaustion, adding to the challenge.

"Speed. Strength. Endurance."`,
  },
  {
    id: 'avp_656',
    title: 'Moon Patrol',
    icon: '🌙',
    color: '#1f2937',
    anim: 'bounce',
    matchText: 'Moon Patrol awaits on the lunar surface.',
    body: `PATROL THE LUNAR SURFACE

Jump craters.

Destroy alien attackers.

Survive the moon.

PUBLISHER: Irem
RELEASED: 1982

THE INNOVATION
Moon Patrol was among the first arcade games to feature parallax scrolling backgrounds, creating illusion of depth.

THE GAMEPLAY
Navigate lunar terrain while destroying alien threats. Jump over craters and obstacles while managing ammo.

THE SETTING
The harsh lunar environment constantly changes, keeping players alert.

THE CHALLENGE
Balancing movement, jumping, and shooting requires significant skill and timing.

THE APPEAL
Unique setting and innovative scrolling graphics made Moon Patrol a standout arcade experience.

"The moon is not safe."`,
  },
  {
    id: 'avp_657',
    title: 'Rally-X',
    icon: '🏎️',
    color: '#ef4444',
    anim: 'pulse',
    matchText: 'Rally-X tests your driving skills.',
    body: `RALLY-X

Collect all the flags before fuel runs out.

Avoid enemy cars.

Use smoke screens wisely.

PUBLISHER: Namco

THE GAMEPLAY
Navigate a scrolling maze collecting flags while enemy cars pursue you. Strategic smoke screen use is crucial.

THE INNOVATION
Rally-X was one of the first games to feature a scrolling map larger than a single screen.

THE STRATEGY
Planning your route becomes essential. Should you grab all flags or rush to the exit?

THE FUEL MECHANIC
Limited fuel creates tension and forces risk/reward decisions throughout each level.

THE APPEAL
Combines exploration, resource management, and combat in a compact arcade package.

"Drive fast. Think faster."`,
  },
  {
    id: 'avp_658',
    title: 'Pole Position',
    icon: '🏁',
    color: '#059669',
    anim: 'pulse',
    matchText: 'Pole Position racing comes to arcades.',
    body: `POLE POSITION

The checkered flag awaits.

Qualify for the race, then battle for victory at over 180 miles per hour.

PUBLISHER: Namco

THE GAMEPLAY
First, qualify by beating a target time. Then race against opponents on various courses at breakneck speeds.

THE APPEAL
Arcade racing at its finest. Intense wheel controller gives authentic driving feel.

THE INNOVATION
Pole Position became one of the highest-grossing arcade racing games ever made.

THE COURSES
Multiple tracks with different challenges keep gameplay fresh.

THE SENSATION
Speed and intensity create genuine adrenaline rush.

"Prepare to qualify."`,
  },
  {
    id: 'avp_659',
    title: 'Donkey Kong',
    icon: '🦍',
    color: '#f97316',
    anim: 'bounce',
    matchText: 'Donkey Kong challenges you at the arcade.',
    body: `THE ORIGINAL BARREL CHALLENGE

Jump.

Climb.

Survive.

Mario faces his greatest challenge yet as he attempts to rescue Pauline from the giant ape Donkey Kong.

PUBLISHER: Nintendo
RELEASED: 1981

THE BREAKTHROUGH
This was the first appearance of Mario, though he was originally called "Jumpman."

THE GAMEPLAY
Navigate platforms, dodge barrels, jump gaps, and reach the top to rescue Pauline.

THE DESIGN
Four unique screens with increasing difficulty. Each screen introduces new obstacles and hazards.

THE LEGACY
Donkey Kong launched one of gaming's most iconic franchises and proved arcades could tell stories.

THE CHARACTER
Mario's charm and the ape's personality created emotional investment unusual for arcade games.

"It all started here."`,
  },
  {
    id: 'avp_660',
    title: 'Pac-Man',
    icon: '👾',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'Pac-Man mazes await your challenge.',
    body: `JOIN THE PAC-MAN REVOLUTION

Over 300,000 Pac-Man machines have been sold worldwide.

Guide Pac-Man through the maze while avoiding:
• Blinky
• Pinky
• Inky
• Clyde

THE PHENOMENON
Pac-Man broke through arcade gaming into mainstream culture, becoming a global icon.

THE GHOSTS
Each ghost has unique behavior patterns, requiring different strategies to evade.

THE APPEAL
Deceptively simple gameplay with surprising strategic depth. Perfect balance of luck and skill.

THE CHARACTER
Pac-Man remains the most recognizable video game character in the world.

THE LEGACY
Pac-Man proved that arcade games could achieve mass market success and cultural significance.

"Waka waka waka."`,
  },
  {
    id: 'avp_661',
    title: 'Galaga',
    icon: '👽',
    color: '#3b82f6',
    anim: 'bounce',
    matchText: 'Galaga defends your galaxy.',
    body: `DEFEND THE GALAXY

Alien forces attack in massive formations.

Destroy them before they capture your fighter.

PUBLISHER: Namco

THE GAMEPLAY
Waves of aliens descend in formation. Dodge their fire while destroying them before they overrun your position.

THE TRICK
Skilled players intentionally allowed their ships to be captured to create double-fighter formations.

THE CHALLENGE
Each wave increases in speed and complexity. Mastering the patterns becomes essential.

THE APPEAL
Perfect difficulty curve and addictive gameplay made Galaga one of arcade's greatest achievements.

THE LEGACY
Galaga remains one of the greatest shooters ever made and earned massive arcade revenue.

"One of the greatest shooters ever made."`,
  },
  {
    id: 'avp_662',
    title: 'Defender',
    icon: '🛸',
    color: '#06b6d4',
    anim: 'pulse',
    matchText: 'Defender tests your arcade skills.',
    body: `NOT FOR BEGINNERS

Defender remains one of the most difficult arcade games ever created.

Protect astronauts.

Destroy alien invaders.

Master one of gaming's steepest learning curves.

PUBLISHER: Williams

THE GAMEPLAY
Defend the planet from alien invaders while protecting astronauts on the surface. Multiple threats attack simultaneously.

THE CHALLENGE
Defender throws everything at players. Control complexity is legendary-considered hardest arcade game to master.

THE MECHANICS
Hyperspace escape, smart bombs, reverse direction-multiple tools create strategic options.

THE APPEAL
For serious players seeking ultimate challenge. Casual players find it nearly impossible.

THE LEGACY
Defender proved arcade games could have incredible depth and complexity.

"Most players never survive long enough to understand everything."`,
  },
  {
    id: 'avp_663',
    title: 'Asteroids',
    icon: '🪨',
    color: '#8b5cf6',
    anim: 'spin',
    matchText: 'Asteroids rocks your world.',
    body: `THE CLASSIC RETURNS

Rotate.

Fire.

Survive.

The simple formula that changed arcades forever continues to attract crowds.

PUBLISHER: Atari

THE APPEAL
Vector graphics and pure gameplay created timeless experience that still attracts players.

THE INNOVATION
Asteroids became Atari's best-selling arcade game and proved arcade gaming's staying power.

THE GAMEPLAY
Simple mechanics: rotate your ship, fire at asteroids, dodge enemy UFOs.

THE ADDICTION
Deceptively simple with surprising difficulty. High skill ceiling keeps players returning.

THE LEGACY
Asteroids remains one of arcade gaming's greatest achievements and most influential games.

"The rocks never stop coming."`,
  },
  {
    id: 'avp_664',
    title: 'Atari 2600',
    icon: '🎮',
    color: '#000000',
    anim: 'pulse',
    matchText: 'Atari 2600 brings arcades home.',
    body: `BRING THE ARCADE HOME

The Atari 2600 remains America's best-selling home video game system.

POPULAR GAMES INCLUDE:
• Pac-Man
• Pitfall!
• Frogger
• Missile Command
• Space Invaders

TYPICAL PRICE: $99-$129

THE REVOLUTION
Home gaming became possible for regular families, transforming how people experienced video games.

THE LIBRARY
Hundreds of games available, from arcade conversions to original titles designed for home play.

THE CONTROLLERS
Joystick and button pad allowed players to experience arcade-style gameplay at home.

THE IMPACT
Atari 2600 established home console gaming as a major entertainment medium.

THE APPEAL
Play arcade favorites anytime without leaving home or spending quarters.

"The arcade in your living room."`,
  },
  {
    id: 'avp_665',
    title: 'Intellivision',
    icon: '📺',
    color: '#3b82f6',
    anim: 'pulse',
    matchText: 'Intellivision offers intelligent gaming.',
    body: `INTELLIGENT TELEVISION

Intellivision offers realistic sports, strategy games, and advanced graphics.

POPULAR TITLES INCLUDE:
• Major League Baseball
• NFL Football
• Utopia

PROCESSORS
Intellivision's advanced hardware delivers superior graphics and gameplay compared to competitors.

THE APPEAL
Serious gamers appreciate the advanced technical capabilities and sports simulation accuracy.

THE SPORTS GAMES
Many sports fans consider Intellivision baseball the best home baseball game available.

THE STRATEGY
Strategic games like Utopia appeal to players seeking deeper gaming experiences.

THE POSITION
Intellivision carves out market space by emphasizing advanced technology and quality games.

"The thinking person's video game system."`,
  },
  {
    id: 'avp_666',
    title: 'ColecoVision',
    icon: '🎯',
    color: '#f97316',
    anim: 'pulse',
    matchText: 'ColecoVision brings arcade quality home.',
    body: `ARCADE QUALITY AT HOME

ColecoVision delivers some of the closest arcade conversions available.

POPULAR GAMES:
• Donkey Kong
• Zaxxon
• Turbo

THE PROMISE
ColecoVision's powerful hardware enables nearly arcade-perfect home conversions.

THE PACK-IN
Donkey Kong was packed with many ColecoVision systems, making it instantly appealing to arcade fans.

THE APPEAL
Players who love arcade games can now play their favorites at home with minimal compromises.

THE QUALITY
ColecoVision's conversions maintain arcade gameplay and appeal better than cheaper competitors.

THE SELECTION
Growing library of quality arcade conversions appeals directly to arcade enthusiasts.

"The next best thing to the arcade."`,
  },
  {
    id: 'avp_667',
    title: 'Commodore 64',
    icon: '💻',
    color: '#8b5cf6',
    anim: 'pulse',
    matchText: 'Commodore 64 gaming is revolutionary.',
    body: `MORE THAN A COMPUTER

The Commodore 64 isn't just for school and business.

POPULAR GAMES INCLUDE:
• Summer Games
• Impossible Mission
• Jumpman
• Wizard of Wor

PRICE: Around $199-$250

THE APPEAL
The Commodore 64 offers both computing and gaming in one affordable package.

THE GRAPHICS
Advanced graphics and sound capabilities enable games surpassing home console quality.

THE LIBRARY
Growing library of games designed specifically for Commodore 64's unique capabilities.

THE POTENTIAL
It may become the best-selling computer in history due to its versatility and price.

THE FUTURE
As more developers create games for Commodore 64, its gaming potential expands exponentially.

"64K of possibilities."`,
  },
  {
    id: 'avp_668',
    title: 'Apple II',
    icon: '🍎',
    color: '#059669',
    anim: 'pulse',
    matchText: 'Apple II offers educational gaming.',
    body: `LEARN WHILE YOU PLAY

The Apple II remains the king of educational software.

POPULAR PROGRAMS INCLUDE:
• Oregon Trail
• Lemonade Stand
• Number Munchers

THE CLASSROOM
Schools nationwide continue adopting Apple computers for educational programs.

THE GAMES
Educational games make learning fun while teaching valuable skills.

THE APPEAL
Parents appreciate computers that combine education with entertainment.

THE LEGACY
Apple II established the home computer as educational tool, not just business device.

THE SOFTWARE
Developer community creates both educational and entertainment programs for Apple II.

"Education meets entertainment."`,
  },
  {
    id: 'avp_669',
    title: 'Nintendo Game & Watch',
    icon: '⌚',
    color: '#ef4444',
    anim: 'bounce',
    matchText: 'Nintendo Game & Watch fits in your pocket.',
    body: `POCKET-SIZED FUN

Nintendo's Game & Watch series lets players take games anywhere.

POPULAR MODELS:
• Donkey Kong
• Mario Bros.
• Fire
• Oil Panic

BATTERY POWERED
Play for hours on replaceable batteries.

PORTABLE GAMING
Fits in your pocket-take video games with you anywhere.

THE APPEAL
Nintendo perfected portable gaming with simple, addictive LCD games.

THE COLLECTORS
Game & Watch handhelds became collector's items as Nintendo released multiple models.

THE INNOVATION
Game & Watch proved portable gaming could be engaging and fun.

"Video games beyond the arcade."`,
  },
  {
    id: 'avp_670',
    title: 'Home Computers Gaming',
    icon: '🖥️',
    color: '#0891b2',
    anim: 'pulse',
    matchText: 'Home computers revolutionize gaming.',
    body: `THE FUTURE IS HERE

Millions of Americans are discovering computer gaming.

LEADING SYSTEMS INCLUDE:
• Commodore 64
• Apple II
• Atari 800XL
• TRS-80 Color Computer

THE REVOLUTION
Games now feature deeper stories, better graphics, and endless possibilities compared to arcade limitations.

THE POTENTIAL
Computer gaming offers unlimited potential-no cartridge or arcade hardware limitations.

THE LIBRARY
Growing library of games designed for home computers expands options daily.

THE APPEAL
Serious gamers appreciate the advanced capabilities and creative possibilities of computer gaming.

THE FUTURE
Home computer gaming represents the future of interactive entertainment.

"The next generation of gaming has arrived."`,
  },
  {
    id: 'avp_671',
    title: 'Frogger',
    icon: '🐸',
    color: '#059669',
    anim: 'bounce',
    matchText: 'Frogger crosses the road at the arcade.',
    body: `WHY DID THE FROG CROSS THE ROAD?

To become an arcade legend.

Guide Frogger across busy highways and dangerous rivers while avoiding disaster.

THE APPEAL
Simple concept with addictive gameplay made Frogger an instant classic.

THE CHALLENGE
Timing and precision required to dodge traffic and navigate water dangers.

THE RECOGNITION
One of the most recognizable games ever created. Frogger transcended arcade culture.

THE GAMEPLAY
Multiple obstacles and hazards create varied challenges across different screens.

THE SUCCESS
Frogger's popularity spawned home console versions and sequels.

"Hop to it."`,
  },
  {
    id: 'avp_672',
    title: 'Centipede',
    icon: '🐛',
    color: '#ef4444',
    anim: 'pulse',
    matchText: 'Centipede attacks at the arcade.',
    body: `BUGS, BLASTERS, AND HIGH SCORES

Defend yourself against:
• Centipedes
• Fleas
• Spiders
• Scorpions

PUBLISHER: Atari

THE GAMEPLAY
Destroy centipedes that threaten you while avoiding various enemies. Position and timing are crucial.

THE APPEAL
Centipede attracted more female players than most arcade games, broadening gaming's audience.

THE ENEMIES
Each enemy type behaves differently, requiring strategic approach variations.

THE DIFFICULTY
Waves increase in speed and complexity, challenging even experienced players.

THE LEGACY
Centipede proved arcade games could appeal across demographic boundaries.

"Shoot fast. Think faster."`,
  },
  {
    id: 'avp_673',
    title: 'Tempest',
    icon: '🌀',
    color: '#ec4899',
    anim: 'spin',
    matchText: 'Tempest welcomes you to its web.',
    body: `WELCOME TO THE WEB

Battle enemies crawling through geometric tunnels in one of the most visually unique games ever created.

PUBLISHER: Atari
DESIGNER: Dave Theurer

THE GRAPHICS
Tempest became famous for its color vector graphics, creating stunning visual experience.

THE GAMEPLAY
Rotate around the web's rim, move in and out of the tunnel, destroy enemies before they escape.

THE INNOVATION
Vector graphics delivered visuals never before seen in arcade gaming.

THE APPEAL
Unique visual style and engaging gameplay created devoted following.

THE CHALLENGE
Players must master both rim rotation and depth movement mechanics.

"Nothing else looks like Tempest."`,
  },
  {
    id: 'avp_674',
    title: 'Zaxxon',
    icon: '🏰',
    color: '#fbbf24',
    anim: 'bounce',
    matchText: 'Zaxxon enters its third dimension.',
    body: `ENTER THE THIRD DIMENSION

Zaxxon introduced isometric graphics to arcades, creating the illusion of true depth.

Pilot your spacecraft through heavily defended enemy fortresses.

PUBLISHER: Sega

THE INNOVATION
Revolutionary isometric perspective allowed players to judge altitude and depth.

THE GAMEPLAY
Navigate fortress structures while destroying enemies and avoiding obstacles.

THE CHALLENGE
Judging altitude became crucial-a revolutionary concept for arcade gaming at the time.

THE APPEAL
Unique visual perspective and novel gameplay mechanics attracted players seeking fresh experiences.

THE DESIGN
Fortress stages offer varied environments and strategic options.

"See arcade gaming from a new angle."`,
  },
  {
    id: 'avp_675',
    title: 'Robotron: 2084',
    icon: '🤖',
    color: '#ef4444',
    anim: 'pulse',
    matchText: 'Robotron: 2084 needs humanity.',
    body: `SAVE THE LAST HUMANS

The machines have taken over.

You are humanity's final hope.

Destroy endless robotic enemies while rescuing survivors.

PUBLISHER: Williams
CONTROLS: Dual Joysticks

THE GAMEPLAY
Simultaneous movement and fire directions via dual joysticks creates intense, complex control scheme.

THE INTENSITY
Robotron is considered one of the most intense arcade games ever created.

THE CHALLENGE
Managing movement and fire in different directions requires skill and practice.

THE APPEAL
Dual-joystick control creates strategic depth and genuine challenge.

THE LEGACY
Robotron's control scheme influenced countless games and remains challenging decades later.

"Humanity needs you."`,
  },
];

const VIEWED_ENTRIES = new Set();

export function findArcadeVidGameEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

export function getArcadeVidGameEntry(id) {
  return ENTRIES.find(e => e.id === id) || null;
}

export function trackArcadeVidGameView(entryId) {
  VIEWED_ENTRIES.add(entryId);
  const unlocked = [];

  if (VIEWED_ENTRIES.size === 1) {
    unlocked.push('avp_first');
  }
  if (VIEWED_ENTRIES.size === 5) {
    unlocked.push('avp_5');
  }
  if (VIEWED_ENTRIES.size === 10) {
    unlocked.push('avp_10');
  }
  if (VIEWED_ENTRIES.size === 25) {
    unlocked.push('avp_all');
  }

  return unlocked;
}

export function getArcadeVidGameViewCount() {
  return VIEWED_ENTRIES.size;
}