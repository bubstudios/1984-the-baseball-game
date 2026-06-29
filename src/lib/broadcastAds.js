// Broadcast ad reads for the 1984 game experience
// Organized by category and team specificity
//
// Categories (matching real 1984 broadcast feel):
//   sponsor:    60% - product ads, TV shows, movies
//   community:  20% - local events, public service
//   charity:    10% - blood drives, fundraisers
//   team_promo: 10% - upcoming games, promotions

// ── GENERAL (playable in any stadium) ──

const GENERAL_SPONSOR = [
  // TV Shows (#001-025)
  "Catch an all-new episode of Miami Vice this Thursday at 8. Crockett and Tubbs race against time to stop a major drug shipment before it reaches Miami.",
  "Miami Vice returns Thursday night. A routine investigation turns dangerous when an undercover operation is compromised.",
  "Don't miss Miami Vice. New action, new music, and another tough case for Crockett and Tubbs.",
  "Tune in for Magnum P.I. this Thursday. Thomas Magnum investigates the disappearance of a valuable Hawaiian artifact.",
  "Magnum P.I. returns with an all-new adventure. Higgins isn't happy, and that usually means trouble.",
  "Spend your Thursday evening with Magnum P.I., only on CBS.",
  "The A-Team rides again Friday night. A small-town sheriff needs help, and Hannibal has a plan.",
  "Catch The A-Team this week. Explosions, action, and Mr. T doing what Mr. T does best.",
  "The A-Team returns Friday. If you have a problem, they just might solve it.",
  "Pull up a stool for an all-new episode of Cheers. Sam, Diane, and the gang are back.",
  "Spend some time where everybody knows your name. Cheers, Thursday night.",
  "A misunderstanding at the bar leads to trouble in an all-new episode of Cheers.",
  "Night Court returns with another strange evening in Manhattan Criminal Court.",
  "Judge Harry Stone has his hands full once again on Night Court.",
  "Don't miss Family Ties this week. Alex has another scheme, and it may not go as planned.",
  "Family Ties returns with laughs for the whole family.",
  "Catch an all-new episode of Simon & Simon this Thursday evening.",
  "Hardcastle and McCormick returns with another high-speed adventure.",
  "Fall Guy returns this week. Colt Seavers faces his toughest stunt yet.",
  "Don't miss Dynasty this Wednesday night. The drama continues.",
  "Dallas returns this week. The Ewing family has another problem to solve.",
  "Remington Steele returns Thursday night with another mystery.",
  "Murder, She Wrote continues this week. Jessica Fletcher is on the case.",
  "Hill Street Blues returns with another gripping episode.",
  "St. Elsewhere continues this week with new challenges for the staff.",

  // Movies (#026-050)
  "Now playing nationwide, Ghostbusters. Who ya gonna call?",
  "Ghostbusters continues to delight audiences across the country.",
  "See Ghostbusters this weekend at your local theater.",
  "Beverly Hills Cop starring Eddie Murphy is now playing everywhere.",
  "Beverly Hills Cop has become one of the year's biggest hits.",
  "Axel Foley is bringing laughs and action to theaters nationwide.",
  "The Karate Kid continues to draw crowds this summer.",
  "Daniel-san faces his greatest challenge in The Karate Kid.",
  "Don't miss The Karate Kid at your neighborhood theater.",
  "Gremlins is now playing. Just remember: no bright light, no water, and never feed them after midnight.",
  "Gremlins continues to surprise moviegoers everywhere.",
  "See Indiana Jones and the Temple of Doom this week.",
  "Indiana Jones returns for another adventure on the big screen.",
  "Temple of Doom continues to thrill audiences nationwide.",
  "Splash starring Tom Hanks is now playing.",
  "Enjoy a night at the movies with Splash.",
  "Romancing the Stone continues its successful run in theaters.",
  "Romancing the Stone combines adventure, romance, and comedy.",
  "The Natural starring Robert Redford is now playing.",
  "The Natural tells the story of a mysterious baseball hero.",
  "See The Natural this week at your local theater.",
  "Footloose continues to get audiences on their feet.",
  "Enjoy the music and excitement of Footloose.",
  "Star Trek III: The Search for Spock is now playing.",
  "The crew of the Enterprise returns in Star Trek III.",

  // Electronics & Computers (#051-075)
  "Visit Radio Shack and see the new Tandy 1000 personal computer.",
  "The Tandy 1000 is available now at your neighborhood Radio Shack.",
  "Bring home the power of personal computing with the Tandy 1000.",
  "The Tandy 1000. A smart choice for work and home.",
  "Radio Shack has everything from computers to batteries.",
  "See the Commodore 64, one of America's most popular home computers.",
  "The Commodore 64 can help with education, business, and entertainment.",
  "Ask your local dealer about the Commodore 64.",
  "Atari brings arcade excitement right into your living room.",
  "Enjoy your favorite Atari games at home.",
  "The Atari 800XL is available now.",
  "Discover the future with the Apple IIe.",
  "Apple IIe computers are helping students and businesses nationwide.",
  "The future is here with the Apple IIe.",
  "Pick up a new VHS recorder and enjoy movies at home.",
  "Ask about VHS rentals at your local video store.",
  "More Americans than ever are bringing home VCRs.",
  "Capture family memories with a new camcorder.",
  "Sony electronics continue to lead the way in innovation.",
  "Panasonic brings quality electronics into your home.",
  "Upgrade your stereo system this weekend.",
  "Bring concert-quality sound into your living room.",
  "Enjoy crystal-clear FM stereo with today's latest equipment.",
  "Ask your electronics dealer about the newest cassette players.",
  "Portable music has never sounded better.",

  // General Products (#076-100)
  "McDonald's reminds you that you deserve a break today.",
  "Stop by McDonald's after today's game.",
  "Try a Quarter Pounder with Cheese at McDonald's.",
  "Burger King invites you to have it your way.",
  "Visit Burger King for flame-broiled flavor.",
  "Wendy's asks a simple question: Where's the beef?",
  "Find out for yourself at Wendy's.",
  "Coca-Cola reminds you that Coke is it.",
  "Enjoy an ice-cold Coca-Cola during the game.",
  "Pepsi is the choice of a new generation.",
  "Pick up a refreshing Pepsi today.",
  "7-Up. The Uncola.",
  "Enjoy the crisp taste of 7-Up.",
  "Visit your local Sears and discover great values for the family.",
  "Sears has appliances, tools, and clothing for every household.",
  "Kmart reminds you that today's savings can make tomorrow brighter.",
  "Blue Light Specials are waiting at Kmart.",
  "Stop by JCPenney for quality and value.",
  "See the latest fashions at JCPenney.",
  "Visit your local Ford dealer and test drive the new Ford Tempo.",
  "Chevrolet invites you to see the 1984 Cavalier.",
  "Chrysler introduces a new way to travel with its innovative minivan.",
  "Goodyear reminds you that quality tires make a difference.",
  "Plan your summer vacation with AAA.",
  "Thanks for joining us today. We'll be back with more baseball right after this.",
];

// ── NATIONAL PROMOS #501-600: Failed TV, Movies, Cartoons, Tech, Music ──
const R_NATIONAL_501_600 = [
  // Failed & Forgotten TV Shows (#501-510)
  "Catch \"Hot Pursuit\" this Friday night. Action, excitement, and crime-fighting from coast to coast.",
  "Don't miss the new detective series \"Legmen,\" premiering this week.",
  "The comedy \"E/R\" returns Thursday evening.",
  "Jennifer and Bruce continue their adventures on \"Jennifer Slept Here.\"",
  "Join us for another episode of \"Paper Dolls.\"",
  "See what happens next on \"The Yellow Rose.\"",
  "Don't miss \"Partners in Crime\" starring Loni Anderson and Lynda Carter.",
  "Tune in for \"Finder of Lost Loves\" this week.",
  "The drama continues on \"Riptide.\"",
  "Catch \"Hardcastle and McCormick\" following tonight's news.",
  // TV Movies (#511-515)
  "Sunday night features a special made-for-television movie event.",
  "Don't miss \"The Burning Bed\" starring Farrah Fawcett.",
  "A special television presentation airs this weekend.",
  "Enjoy an evening movie from the comfort of home.",
  "Stay tuned for a world premiere television movie.",
  // Cartoons (#516-525)
  "Saturday morning means cartoons for the whole family.",
  "Catch \"Mister T\" Saturday morning.",
  "The adventures continue on \"Alvin and the Chipmunks.\"",
  "See \"The Littles\" this Saturday.",
  "Join \"Heathcliff\" for more animated fun.",
  "Don't miss \"Inspector Gadget.\"",
  "The Smurfs return Saturday morning.",
  "Kids everywhere are tuning in for \"Dungeons & Dragons.\"",
  "See Spider-Man and His Amazing Friends.",
  "The Pac-Man cartoon continues this weekend.",
  // Video Games (#526-540)
  "Visit your local arcade and try Dragon's Lair.",
  "Dragon's Lair continues to amaze players nationwide.",
  "Challenge your friends to a game of Pole Position.",
  "Take control in Spy Hunter.",
  "The arcade hit Q*bert is waiting.",
  "Can you master Zaxxon?",
  "Try BurgerTime at your local arcade.",
  "Centipede remains one of America's favorite arcade games.",
  "Defender continues to challenge players.",
  "See if you can survive Robotron 2084.",
  "The arcade phenomenon Donkey Kong is still drawing crowds.",
  "Ms. Pac-Man remains a favorite with players of all ages.",
  "Challenge the high score in Galaga.",
  "Joust continues to attract competitors.",
  "Bring home Atari baseball and play anytime.",
  // Home Computers (#541-550)
  "The Commodore 64 is changing the way America computes.",
  "Bring home educational software for your family computer.",
  "The TRS-80 remains a trusted home computer.",
  "Ask your local Radio Shack about computer classes.",
  "Home computers are becoming more affordable every year.",
  "Store your files on the latest floppy disk technology.",
  "Computer programming can be fun and educational.",
  "See why families are bringing computers into their homes.",
  "The future may very well fit on a floppy disk.",
  "Ask about computer software at your local electronics dealer.",
  // Weird Technology (#551-560)
  "Compact Discs may be the future of recorded music.",
  "Ask your music dealer about the new Compact Disc format.",
  "Compact Disc players offer crystal-clear sound.",
  "Cellular telephones are now available in select markets.",
  "The future of communication may fit inside your automobile.",
  "Electronic banking services continue to expand nationwide.",
  "More businesses are using fax machines every day.",
  "Word processors are replacing traditional typewriters.",
  "Technology continues to change the workplace.",
  "The information age is only beginning.",
  // Odd Products (#561-570)
  "Ask your dealer about the new Chrysler minivan.",
  "The Chrysler minivan offers seating for the whole family.",
  "Ford introduces the all-new Tempo.",
  "Take a test drive in the Chevrolet Cavalier.",
  "The Pontiac Fiero is turning heads nationwide.",
  "See the sporty new Pontiac Fiero today.",
  "The Dodge Caravan may redefine family transportation.",
  "America is discovering the convenience of microwave ovens.",
  "Microwave cooking can save time and energy.",
  "See the latest cordless telephones at participating retailers.",
  // Music (#571-580)
  "The new album from Bruce Springsteen is available now.",
  "Bruce Springsteen's \"Born in the U.S.A.\" is climbing the charts.",
  "Enjoy the latest music from Prince.",
  "Prince continues to dominate the airwaves.",
  "The soundtrack to Footloose is available now.",
  "Pick up the latest release from Huey Lewis and the News.",
  "The Cars continue to produce hit records.",
  "Chicago's latest album is now available.",
  "Discover the latest music at your neighborhood record store.",
  "Cassette tapes remain a popular way to enjoy music on the go.",
  // Random 1984 Life (#581-590)
  "Remember to set your VCR before leaving home.",
  "Video rental stores are adding new titles every week.",
  "More Americans are renting movies than ever before.",
  "Family game night remains a great American tradition.",
  "Board games continue to bring families together.",
  "The Rubik's Cube craze shows no signs of slowing down.",
  "Can you solve all six sides of a Rubik's Cube?",
  "Neighborhood bowling leagues are now forming.",
  "Support your local movie theater.",
  "Take the family out for an evening at the drive-in.",
  // Public Service (#591-600)
  "Please remember to buckle your seatbelt.",
  "Never drink and drive.",
  "Help keep America's highways clean.",
  "Support your local volunteer fire department.",
  "Donate blood and help save lives.",
  "Visit your local library this week.",
  "Reading can open a world of possibilities.",
  "Take a youngster to a ballgame this summer.",
  "Enjoy America's pastime responsibly.",
  "Baseball. Hot dogs. Summer. It doesn't get much better than this.",
];
GENERAL_SPONSOR.push(...R_NATIONAL_501_600);

// ── NATIONAL PROMOS #601-650: More Obscure TV ──
GENERAL_SPONSOR.push(
  "Catch an all-new episode of \"Cover Up\" this Friday night.",
  "Don't miss \"Riptide,\" featuring adventure on the California coast.",
  "\"Mickey Spillane's Mike Hammer\" returns with another mystery this week.",
  "Tune in for \"Hotel\" Wednesday evening.",
  "The drama continues on \"Falcon Crest.\"",
  "See what happens next on \"Knots Landing.\"",
  "Don't miss \"Lottery!\" this Thursday night.",
  "An all-new episode of \"Airwolf\" takes flight this weekend.",
  "Join Stringfellow Hawke for another mission on \"Airwolf.\"",
  "Catch \"Blue Thunder\" this week.",
  "Stay tuned for a special television presentation following tonight's game.",
  "Enjoy a network movie premiere this Sunday evening.",
  "A two-night television event begins this week.",
  "Grab some popcorn and enjoy a movie at home.",
  "Stay tuned for late-night entertainment after your local news.",
  "\"Scarecrow and Mrs. King\" returns this week.",
  "The adventure continues on \"T.J. Hooker.\"",
  "William Shatner stars in another exciting episode of \"T.J. Hooker.\"",
  "Don't miss \"Hunter\" this weekend.",
  "Fred Dryer stars in \"Hunter\" Thursday night.",
  "\"Matt Houston\" returns with another case.",
  "Join us for an all-new episode of \"Webster.\"",
  "Family laughs continue on \"Punky Brewster.\"",
  "Don't miss \"Charles in Charge.\"",
  "The laughs continue this week on \"Night Court.\"",
);

// ── NATIONAL PROMOS #651-675: Arcades & Video Games ──
GENERAL_SPONSOR.push(
  "Challenge your friends to a game of Marble Madness.",
  "New arcade machines are arriving weekly at locations nationwide.",
  "Test your skills in Xevious.",
  "Can you survive a game of Dig Dug?",
  "The action never stops in Track & Field.",
  "Try your hand at Moon Patrol.",
  "Rally-X continues to challenge players.",
  "The race is on in Pole Position.",
  "Master the mazes of Pac-Man.",
  "Find out why players can't stop talking about Dragon's Lair.",
  "Space Ace is arriving in arcades across America.",
  "Take command in Star Wars, now at select arcades.",
  "Battle alien invaders in Galaxian.",
  "Defend the city in Rampage.",
  "Become a hero in Gauntlet.",
  "New high scores are being set every day.",
  "Bring a roll of quarters and see how long you last.",
  "Arcades continue to be America's favorite hangout.",
  "Challenge the local champion this weekend.",
  "Every game starts with a single quarter.",
  "New Atari titles are available now.",
  "Bring the arcade experience home.",
  "Electronic gaming continues to grow in popularity.",
  "Visit your local arcade and beat the heat.",
  "Some lucky player is setting a high score right now.",
);

// ── NATIONAL PROMOS #676-700: Wrestling ──
GENERAL_SPONSOR.push(
  "Catch the stars of professional wrestling this Saturday night.",
  "See Hulk Hogan in action this weekend.",
  "Don't miss Rowdy Roddy Piper.",
  "Professional wrestling excitement is coming to your area.",
  "Andre the Giant continues to amaze audiences nationwide.",
  "Junkyard Dog appears this weekend.",
  "Watch Sgt. Slaughter take on all challengers.",
  "The Iron Sheik returns to the ring this Saturday.",
  "Professional wrestling is coming to the civic center next week.",
  "Tickets remain available while supplies last.",
  "See your favorite wrestling superstars live.",
  "Championship matches are scheduled throughout the summer.",
  "Fans of all ages enjoy the excitement of professional wrestling.",
  "A sold-out crowd is expected.",
  "Wrestling continues to grow in popularity nationwide.",
  "Meet your favorite wrestling stars at special appearances.",
  "The excitement begins when the bell rings.",
  "Rivalries continue to heat up across the wrestling world.",
  "Wrestling fans won't want to miss this one.",
  "Bring the family out for an unforgettable evening.",
  "Television cameras will be on hand.",
  "The action is bigger than ever.",
  "The stars are ready.",
  "The crowd is waiting.",
  "It's time for professional wrestling.",
);

// ── NATIONAL PROMOS #701-725: Stores That Barely Exist Anymore ──
GENERAL_SPONSOR.push(
  "Visit Montgomery Ward for quality products at affordable prices.",
  "Montgomery Ward has great values throughout the store.",
  "Stop by Woolworth's this weekend.",
  "Woolworth's remains a trusted American retailer.",
  "Venture stores invite you to save this week.",
  "Blue light specials continue at Kmart.",
  "Service Merchandise has gifts for every occasion.",
  "Visit Service Merchandise and browse their showroom.",
  "Gold Circle offers savings throughout the store.",
  "Ames Department Stores welcomes shoppers this weekend.",
  "Stop by your neighborhood Ben Franklin store.",
  "Value and selection await at your local department store.",
  "Shop early for the best selection.",
  "Back-to-school savings are now underway.",
  "Family fashions are available now.",
  "Home appliances are on sale this week.",
  "Discover quality and value under one roof.",
  "Save on electronics this weekend.",
  "Furniture specials continue throughout the month.",
  "Don't miss these limited-time offers.",
  "See store for complete details.",
  "Quantities may be limited.",
  "Shop local whenever possible.",
  "Friendly service makes the difference.",
  "Visit your favorite department store today.",
);

// ── NATIONAL PROMOS #726-750: Peak 1984 Culture ──
GENERAL_SPONSOR.push(
  "Remember to rewind your VHS tapes before returning them.",
  "Please be kind and rewind.",
  "Video rental memberships are available now.",
  "New releases arrive every Tuesday.",
  "Reserve your favorite movie before it's gone.",
  "The VCR continues to revolutionize home entertainment.",
  "More families are recording television programs at home.",
  "Set your VCR before leaving for work.",
  "Video stores are adding more titles every week.",
  "The cassette tape remains a popular choice for music lovers.",
  "Create your own custom mixtape.",
  "Music lovers continue to embrace portable cassette players.",
  "Take your music wherever you go.",
  "The Walkman remains one of the hottest products in America.",
  "Bring your favorite songs with you everywhere.",
  "Ask your record store about the latest releases.",
  "Record stores are featuring special promotions this week.",
  "Compact discs may someday replace records.",
  "Only time will tell.",
  "The future seems to arrive faster every year.",
  "Home computers continue to find their way into American households.",
  "Some experts believe every home may one day have a computer.",
  "Imagine that.",
  "Technology keeps moving forward.",
  "And baseball keeps moving right along.",
);

// ── NATIONAL PROMOS #751-775: The 1984 Olympics ──
GENERAL_SPONSOR.push(
  "The Summer Olympics are coming to Los Angeles this year.",
  "Athletes from around the world will gather in Southern California this summer.",
  "Make plans now to experience Olympic excitement.",
  "The Olympic Torch Relay continues its journey across America.",
  "Los Angeles prepares to welcome the world.",
  "Olympic souvenirs are now available at participating retailers.",
  "America's athletes are training hard for the Games.",
  "The world's greatest competitors will soon take center stage.",
  "Follow Olympic coverage throughout the summer.",
  "The countdown to the Summer Games is underway.",
  "Tickets remain available for select Olympic events.",
  "Olympic fever is spreading across the country.",
  "The spirit of competition arrives in Los Angeles.",
  "The world will be watching.",
  "Let the games begin.",
  "Team USA continues preparations.",
  "Olympic venues are nearing completion.",
  "The opening ceremonies promise to be spectacular.",
  "Athletes dream of Olympic gold.",
  "America is ready.",
  "Southern California welcomes the world.",
  "Olympic excitement is building every day.",
  "This summer promises to be unforgettable.",
  "The Games are almost here.",
  "See history unfold.",
);

// ── NATIONAL PROMOS #776-800: Space Shuttle & NASA ──
GENERAL_SPONSOR.push(
  "America's Space Shuttle program continues to expand the frontiers of science.",
  "The Space Shuttle Discovery is preparing for future missions.",
  "NASA scientists continue to explore new possibilities.",
  "Space exploration remains one of mankind's greatest achievements.",
  "America's astronauts continue to inspire future generations.",
  "Discover the wonders of science at your local museum.",
  "Space technology continues to improve everyday life.",
  "New discoveries are being made every day.",
  "The future of space travel looks bright.",
  "Learn more about America's space program.",
  "Astronauts continue to push the limits of human achievement.",
  "Science and innovation go hand in hand.",
  "Today's students may become tomorrow's astronauts.",
  "Space exploration captures the imagination.",
  "The stars have never seemed closer.",
  "America's journey into space continues.",
  "Research today shapes tomorrow.",
  "NASA remains at the forefront of discovery.",
  "The next great breakthrough may be just around the corner.",
  "Science is opening new doors.",
  "Curiosity drives progress.",
  "The future belongs to those who explore.",
  "Keep looking up.",
  "Great things await beyond the horizon.",
  "The adventure continues.",
);

// ── NATIONAL PROMOS #801-825: Newspapers ──
GENERAL_SPONSOR.push(
  "Start your morning with your local newspaper.",
  "Stay informed about events in your community.",
  "Newspaper delivery is available seven days a week.",
  "Read the sports section for complete baseball coverage.",
  "Catch up on local news every morning.",
  "The newspaper remains America's daily connection to the world.",
  "Home delivery makes staying informed easy.",
  "Read tomorrow's headlines today.",
  "Your local newspaper covers the stories that matter.",
  "Stay connected with your community.",
  "Sports, business, entertainment, and more.",
  "Read all about it.",
  "Extra editions may be available during major events.",
  "Follow baseball all season long.",
  "Read expert analysis every day.",
  "Classified ads can help you find what you're looking for.",
  "Opportunities await in the classified section.",
  "Looking for a car? Check the classifieds.",
  "Looking for a job? Check the classifieds.",
  "Looking for an apartment? Check the classifieds.",
  "The classified section connects buyers and sellers.",
  "Thousands of listings are available daily.",
  "Newspapers remain an American tradition.",
  "Pick up a copy today.",
  "Stay informed.",
);

// ── NATIONAL PROMOS #826-850: Long Distance Telephone Wars ──
GENERAL_SPONSOR.push(
  "Reach out and touch someone with AT&T.",
  "Long-distance rates continue to fall.",
  "Stay in touch with friends and family across the country.",
  "MCI offers competitive long-distance service.",
  "More Americans are comparing long-distance providers.",
  "A phone call can bring people together.",
  "Long-distance service has never been more important.",
  "Compare rates before making your next call.",
  "Telephone service continues to evolve.",
  "Clear connections matter.",
  "Keep in touch with loved ones.",
  "Every call counts.",
  "Call home tonight.",
  "Distance doesn't have to keep families apart.",
  "Technology helps people stay connected.",
  "The telecommunications industry continues to grow.",
  "New services are becoming available nationwide.",
  "America's phone system is changing.",
  "Innovation continues.",
  "Communication is the future.",
  "The future may arrive through a telephone line.",
  "New possibilities emerge every day.",
  "The world is getting smaller.",
  "Connections matter.",
  "Stay in touch.",
);

// ── NATIONAL PROMOS #851-875: Film Development & Cameras ──
GENERAL_SPONSOR.push(
  "Don't forget to drop off your vacation film for development.",
  "Capture life's special moments on film.",
  "Kodak helps preserve your memories.",
  "Film processing is available at participating retailers.",
  "Bring your vacation photos to life.",
  "Every picture tells a story.",
  "Share your memories with friends and family.",
  "Keep your camera ready.",
  "Great moments happen unexpectedly.",
  "Film remains the best way to capture memories.",
  "Kodak reminds you to save your favorite moments.",
  "Family photographs become family treasures.",
  "The best memories deserve to be preserved.",
  "Photo albums help keep history alive.",
  "Don't leave those rolls undeveloped.",
  "Summer vacations create lasting memories.",
  "Bring your camera wherever you go.",
  "A picture is worth a thousand words.",
  "Capture today for tomorrow.",
  "You'll be glad you did.",
  "Life moves quickly.",
  "Memories don't have to.",
  "Film development is available now.",
  "Relive your favorite moments.",
  "Smile for the camera.",
);

// ── NATIONAL PROMOS #876-900: Things That Scream 1984 ──
GENERAL_SPONSOR.push(
  "Have you solved your Rubik's Cube yet?",
  "Millions of Americans are still trying.",
  "CB radio enthusiasts continue to connect nationwide.",
  "Breaker one-nine, anybody got their ears on?",
  "The truckers are keeping America moving.",
  "CB radios remain popular across the country.",
  "Membership has its privileges.",
  "American Express continues to serve travelers worldwide.",
  "Discover the convenience of automatic teller machines.",
  "More banks are offering ATM access.",
  "Banking after hours has never been easier.",
  "The automated age continues.",
  "Electronic banking is here to stay.",
  "More businesses are using computers every day.",
  "Some experts predict a computer in every office.",
  "Some even predict a computer in every home.",
  "Imagine that.",
  "Word processors are replacing typewriters nationwide.",
  "Secretaries are learning new technology every day.",
  "The office of tomorrow is arriving today.",
  "Fax machines are changing business communications.",
  "Documents can now travel across the country in minutes.",
  "Technology never stops advancing.",
  "The future looks exciting.",
  "We'll be right back after these messages.",
);

// ── NATIONAL PROMOS #901-925: Mall Culture ──
GENERAL_SPONSOR.push(
  "Spend the day at your local shopping mall this weekend.",
  "The food court is open and waiting for hungry shoppers.",
  "Visit over 100 stores under one roof.",
  "Extended shopping hours continue through Saturday.",
  "Bring the family out for a day at the mall.",
  "Free parking is available.",
  "The mall fountain remains a popular meeting place.",
  "Don't forget to stop by the arcade while you're there.",
  "New stores are opening every month.",
  "Shop in air-conditioned comfort.",
  "Pick up school supplies before the rush begins.",
  "Back-to-school sales continue this week.",
  "Browse the latest fashions.",
  "Take a break and enjoy a soft pretzel.",
  "Orange Julius is serving refreshing drinks.",
  "Stop by Waldenbooks for the latest bestsellers.",
  "B. Dalton Bookseller welcomes readers of all ages.",
  "Visit the record store and hear the latest hits.",
  "Spencer Gifts has something unusual for everyone.",
  "The mall remains America's gathering place.",
  "See what's new at your local shopping center.",
  "Bring the kids and make a day of it.",
  "Window shopping is always free.",
  "The mall is open late tonight.",
  "See you at the mall.",
);

// ── NATIONAL PROMOS #926-950: VHS, Betamax & LaserDisc ──
GENERAL_SPONSOR.push(
  "Remember to rewind your videotapes before returning them.",
  "Please be kind and rewind.",
  "New releases arrive at your neighborhood video store every Tuesday.",
  "Reserve your favorite movie before it's rented out.",
  "Video rental memberships are available now.",
  "Discover the growing world of home video.",
  "VHS continues to gain popularity nationwide.",
  "Betamax users can still find great titles.",
  "Ask your dealer about LaserDisc technology.",
  "LaserDisc offers incredible picture quality.",
  "Home entertainment continues to evolve.",
  "Build your own movie collection.",
  "Watch your favorite films anytime.",
  "More Americans are enjoying movies at home.",
  "The VCR has changed family entertainment.",
  "Recording your favorite television programs has never been easier.",
  "Program your VCR before leaving for work.",
  "Some people can actually set those things.",
  "The rest of us are still trying.",
  "Don't forget which tape has your wedding on it.",
  "Label your videotapes carefully.",
  "That football game may be recorded over something important.",
  "Double-check before pressing record.",
  "Future generations will thank you.",
  "Or at least they'll know where the remote is.",
);

// ── NATIONAL PROMOS #951-975: County Fairs & Americana ──
GENERAL_SPONSOR.push(
  "The county fair returns this weekend.",
  "Enjoy rides, games, and family entertainment.",
  "Blue-ribbon livestock will be on display.",
  "The midway opens Friday evening.",
  "Bring the whole family.",
  "Homemade pies, local crafts, and live music await.",
  "The demolition derby is scheduled for Saturday night.",
  "Don't miss the tractor pull competition.",
  "Local farmers will compete for top honors.",
  "The giant pumpkin contest returns this year.",
  "See prize-winning livestock from across the county.",
  "Enjoy an old-fashioned summer tradition.",
  "The Ferris wheel offers a spectacular view.",
  "Cotton candy, funnel cakes, and lemonade are available throughout the grounds.",
  "Try your luck at the ring toss.",
  "The carnival is in town.",
  "Summer only comes once a year.",
  "Make the most of it.",
  "Local bands will perform throughout the weekend.",
  "The fairgrounds open at 9 a.m.",
  "Children under twelve receive discounted admission.",
  "Parking attendants will direct traffic.",
  "Don't forget your camera.",
  "There's something for everyone.",
  "We'll see you at the fair.",
);

// ── NATIONAL PROMOS #976-1000: Truly Absurd 1984 Stuff ──
GENERAL_SPONSOR.push(
  "Cabbage Patch Kids continue to fly off store shelves nationwide.",
  "Parents are encouraged to shop early.",
  "Some stores are limiting purchases due to demand.",
  "Collectors continue searching for rare dolls.",
  "The craze shows no signs of slowing down.",
  "Have you solved your Rubik's Cube yet?",
  "If so, please explain it to the rest of us.",
  "CB radio operators continue to keep America connected.",
  "Breaker one-nine, what's your twenty?",
  "Truckers across the country are listening tonight.",
  "Giant satellite dishes are becoming a familiar sight in suburban backyards.",
  "Ask your electronics dealer about satellite television.",
  "Hundreds of channels may someday be available.",
  "Imagine that.",
  "Some experts predict one day you'll be able to shop from home using your television.",
  "Others think that's ridiculous.",
  "Time will tell.",
  "Home computers continue to gain popularity.",
  "Some people use them for business.",
  "Some use them for games.",
  "Most are still trying to figure out how they work.",
  "Technology is changing rapidly.",
  "Baseball remains wonderfully unchanged.",
  "Thanks for spending part of your day with us.",
  "And somewhere, somebody just spilled mustard on their scorecard.",
);

// Community announcements - generic, playable anywhere
const GENERAL_COMMUNITY = [
  "The local blood drive continues tomorrow at the community center from 9 AM to 3 PM. All donors receive a free t-shirt and a coupon for a half-gallon of ice cream.",
  "Registration is now open for summer youth baseball leagues. Sign up at your local parks and recreation office. All skill levels welcome, ages 5 through 15.",
  "The annual downtown street fair is this Saturday from 10 to 6. Live music, food vendors, and a classic car show - free admission for the whole family.",
  "The public library's summer reading program kicks off next week. Kids who read ten books earn a free pass to the water park. Stop by any branch to sign up.",
  "The high school band boosters are holding a pancake breakfast this Saturday morning at the school cafeteria. Five dollars gets you all-you-can-eat pancakes and sausage.",
  "The Kiwanis Club reminds you that their annual charity golf tournament is coming up on the 15th. All proceeds benefit the children's hospital.",
  "The local fire department is hosting an open house this Sunday. Bring the kids to see the trucks, meet the firefighters, and learn about fire safety.",
  "The city parks department needs volunteers for the spring cleanup day next Saturday. Gloves and trash bags provided - just show up at the main pavilion at 8 AM.",
  "The women's auxiliary is hosting a bake sale at the church hall this weekend. All proceeds go to the local food bank.",
  "Congratulations to the Central High baseball team on winning the regional championship. The whole town is proud of you, boys.",
];

// Charity / public service announcements
const GENERAL_CHARITY = [
  "United Way reminds you that your contributions make a difference in our community. If you haven't given yet, there's still time.",
  "The American Heart Association encourages you to get your blood pressure checked. Free screenings are available at the health department.",
  "The March of Dimes walkathon is this Sunday morning at the park. Join thousands of your neighbors in the fight against birth defects.",
  "The Salvation Army thanks you for your continued support. Your donations help families in need right here in our community.",
  "The Red Cross is holding a CPR training session next Tuesday evening at the fire station. The life you save could be someone you love.",
];

// Team promotions - generic
const GENERAL_TEAM_PROMO = [
  "Don't miss Bat Day this Sunday! The first five thousand kids through the gates receive a free Louisville Slugger.",
  "Fireworks Night is this Friday after the game - stick around for a spectacular show set to music. Ask at the box office for details.",
  "Next homestand features Cap Night and a magnetic schedule giveaway. Check the scorecard for details.",
  "Family Night tickets are available for every Tuesday home game - four tickets, four hot dogs, four sodas for one low price. Ask at the box office.",
];

// ── EXPORT: ad pools by team ──

const AD_CATEGORIES = {
  sponsor: { weight: 0.60, general: GENERAL_SPONSOR },
  community: { weight: 0.20, general: GENERAL_COMMUNITY },
  charity: { weight: 0.10, general: GENERAL_CHARITY },
  team_promo: { weight: 0.10, general: GENERAL_TEAM_PROMO },
};

// Team-specific overrides - each team can have its own ads that mix with general ones
const TEAM_POOLS = {};
// These will be populated as users send team-specific ads.
// Structure: TEAM_POOLS["cubs"] = { sponsor: [...], community: [...], ... }

/**
 * Pick a random ad for a given home team.
 * Mixes team-specific ads (when available) with general pools.
 * Category distribution: 60% sponsor, 20% community, 10% charity, 10% team_promo.
 *
 * @param {string} homeTeamKey - Team key (e.g. 'cubs', 'dodgers')
 * @returns {{ text: string, category: string, isTeamSpecific: boolean }}
 */
export function pickAd(homeTeamKey = null) {
  const teamPool = TEAM_POOLS[homeTeamKey];
  const hasTeamAds = teamPool && Object.values(teamPool).some(arr => arr.length > 0);

  // Adjust weights when team-specific ads are available
  let weights;
  if (hasTeamAds) {
    weights = { sponsor: 0.25, community: 0.40, charity: 0.10, team_promo: 0.25 };
  } else {
    weights = { sponsor: 0.60, community: 0.20, charity: 0.10, team_promo: 0.10 };
  }

  // Pick category by weight
  const roll = Math.random();
  let cumulative = 0;
  let chosenCategory = 'sponsor';
  for (const [cat, w] of Object.entries(weights)) {
    cumulative += w;
    if (roll < cumulative) {
      chosenCategory = cat;
      break;
    }
  }

  const categoryConfig = AD_CATEGORIES[chosenCategory];

  // Build the pool: team-specific ads first (if any), then general
  let pool = [...categoryConfig.general];
  if (teamPool && teamPool[chosenCategory] && teamPool[chosenCategory].length > 0) {
    // Mix team ads into the pool - they appear frequently when available
    pool = [...pool, ...teamPool[chosenCategory], ...teamPool[chosenCategory]];
  }

  if (pool.length === 0) {
    // Fallback: use general sponsor pool
    pool = GENERAL_SPONSOR;
  }

  const text = pool[Math.floor(Math.random() * pool.length)];
  const isTeamSpecific = teamPool && teamPool[chosenCategory]?.includes(text);

  return { text, category: chosenCategory, isTeamSpecific };
}

/**
 * Register team-specific ads. Call this to add new batches.
 *
 * @param {string} teamKey - e.g. 'cubs', 'redsox'
 * @param {string} category - 'sponsor' | 'community' | 'charity' | 'team_promo'
 * @param {string[]} ads - Array of ad read strings
 */
export function registerTeamAds(teamKey, category, ads) {
  if (!TEAM_POOLS[teamKey]) {
    TEAM_POOLS[teamKey] = { sponsor: [], community: [], charity: [], team_promo: [] };
  }
  TEAM_POOLS[teamKey][category].push(...ads);
}

/**
 * Returns a greeting/ad read that sounds like a natural broadcast transition.
 */
export function getAdLeadIn(announcerName = null) {
  const leadIns = [
    "We'll pause for a brief message from our sponsors.",
    "A quick word from the folks who make this broadcast possible.",
    "We'd like to take a moment to recognize our sponsors.",
    "Here's a word from our friends at",
    "We'd like to thank the following for their support.",
  ];
  const leadIn = leadIns[Math.floor(Math.random() * leadIns.length)];
  if (announcerName) {
    return `${announcerName}: "${leadIn}"`;
  }
  return leadIn;
}

/**
 * Get the closing transition back to the game.
 */
export function getAdLeadOut(announcerName = null) {
  const leadOuts = [
    "And now back to the action.",
    "We return to the ballgame.",
    "Play ball! Let's get back to it.",
    "Thanks again to our sponsors. Back to baseball.",
  ];
  const leadOut = leadOuts[Math.floor(Math.random() * leadOuts.length)];
  if (announcerName) {
    return `${announcerName}: "${leadOut}"`;
  }
  return leadOut;
}

// ── TEAM-SPECIFIC ADS ──
// Registered at import-time so they're available immediately.

// ── Cubs / Chicago (#101–200) ──

registerTeamAds('cubs', 'team_promo', [
  // Player signings & events
  "Don't forget, Ryne Sandberg will be signing autographs Saturday morning at the Woodfield Mall in Schaumburg.",
  "Bob Dernier and Keith Moreland will meet fans this Saturday at Navy Pier.",
  "Stop by Wrigley Field on Sunday. The first 10,000 youngsters receive a Cubs team poster.",
  "Join the Cubs Charities softball game next weekend featuring several current and former Cubs players.",
  // Giveaways at Wrigley
  "Visit Wrigley Field next Sunday for Family Day festivities.",
  "Kids 12 and under receive a complimentary Cubs pennant next Sunday.",
  "Sunday is Bat Day at Wrigley Field. Arrive early while supplies last.",
  "The first 15,000 fans next Saturday receive a commemorative Cubs cap.",
  // Cubs merchandise
  "Pick up your official Cubs yearbook at concession stands throughout the ballpark.",
  "The 1984 Cubs yearbook is now available for just three dollars.",
  "Collect official Cubs baseball cards available throughout the stadium.",
  "Stop by the Cubs souvenir stand for shirts, caps, and pennants.",
  "Show your Cubs pride with officially licensed merchandise.",
  "Remember to keep your ticket stub for special promotional discounts.",
  // Concessions & ballpark experience
  "Enjoy a hot dog and cold soda while watching today's game.",
  "Wrigley Field concessions feature Chicago-style hot dogs and fresh popcorn.",
  "Nothing goes better with baseball than peanuts and popcorn.",
  "Take home a scorecard and keep track of today's action.",
  "Be sure to score along at home and settle those baseball arguments later.",
  "Cubs fans are encouraged to bring their gloves for batting practice home run balls.",
  "Arrive early and watch batting practice before tomorrow's game.",
  // Tickets & upcoming games
  "The Cubs continue their homestand tomorrow afternoon at Wrigley Field.",
  "Tickets remain available for tomorrow's matchup.",
  "Call the Cubs ticket office for information on upcoming games.",
  "Group ticket packages are available for churches, schools, and organizations.",
  "Bring your church group out to the ballpark this summer.",
  "Organize a company outing and enjoy Cubs baseball together.",
  // Wrigley atmosphere
  "Summer is baseball season in Chicago.",
  "There's nothing quite like a summer afternoon at Wrigley Field.",
  "The ivy is looking beautiful at Wrigley once again.",
  "The famous ivy continues to be one of baseball's unique sights.",
  "The wind appears to be blowing out toward Waveland Avenue today.",
  "Fans on Waveland Avenue should keep an eye on those fly balls.",
  "A reminder that rooftop seating is available across from Wrigley Field.",
  "Some lucky fans are enjoying today's game from the rooftops.",
]);

registerTeamAds('cubs', 'sponsor', [
  // WGN
  "WGN reminds viewers to stay tuned after the game for the evening news.",
  "Join Jack Brickhouse tonight for special Cubs highlights on WGN.",
  "Stay tuned to WGN for your favorite shows following today's ballgame.",
  "WGN proudly brings Cubs baseball to fans throughout America.",
  "Cubs baseball on WGN is seen from coast to coast.",
  "Greetings to Cubs fans watching all across America on WGN.",
  // General broadcast
  "Baseball truly is the national pastime.",
  "Thanks for spending part of your afternoon with us.",
  "Stay tuned for more Cubs baseball all season long.",
  "The Cubs thank fans listening throughout Illinois, Iowa, Wisconsin, and Indiana.",
]);

registerTeamAds('cubs', 'community', [
  // Museums & attractions
  "Visit the Museum of Science and Industry and see the new computer technology exhibit.",
  "The Museum of Science and Industry welcomes visitors seven days a week.",
  "Take the family to Brookfield Zoo this weekend and see animals from around the world.",
  "Brookfield Zoo is featuring special summer exhibits throughout the month.",
  "Spend a day at Lincoln Park Zoo. Admission is always free.",
  "Enjoy the beautiful summer weather along Chicago's lakefront.",
  "Visit the Sears Tower Skydeck and see Chicago from 103 stories above the city.",
  "The observation deck at Sears Tower offers one of the finest views in America.",
  "Plan a trip to Navy Pier and enjoy dining, shopping, and entertainment.",
  "Take an architectural boat tour along the Chicago River this weekend.",
  "The Chicago Historical Society invites you to explore the city's rich history.",
  "Catch a performance by the Chicago Symphony Orchestra this weekend.",
  "The Art Institute of Chicago is featuring a special impressionist exhibit.",
  "Spend an afternoon exploring the Art Institute's world-famous collection.",
  // Events
  "The Taste of Chicago returns next month with food from across the city.",
  "Mark your calendars for the annual Taste of Chicago celebration.",
  "The Chicago Air and Water Show is coming soon to the lakefront.",
  "Don't miss one of the nation's largest free air shows right here in Chicago.",
  "Visit Old Chicago amusement park in Bolingbrook for rides and family fun.",
  "The DuPage County Fair begins this week with rides, games, and live entertainment.",
  "The Illinois State Fair is just around the corner in Springfield.",
  "Enjoy live music and family activities at Grant Park this weekend.",
  "Buckingham Fountain is putting on a spectacular display all summer long.",
  "Spend an evening along Michigan Avenue and see why it's called the Magnificent Mile.",
  "Take a stroll down Michigan Avenue and enjoy Chicago's finest shopping.",
  "Chicago's lakefront beaches are open and ready for summer visitors.",
  // Shedd & Adler
  "Visit Shedd Aquarium and discover fascinating sea life from around the globe.",
  "Shedd Aquarium is featuring special exhibits throughout the summer.",
  "The Adler Planetarium invites visitors to explore the wonders of space.",
  "Learn about the stars and planets at the Adler Planetarium.",
  // Harry Caray / traffic / birthdays
  "Harry Caray reminds everyone to drive carefully on the Kennedy Expressway tonight.",
  "Traffic is reportedly heavy on the Eisenhower this afternoon.",
  "Harry says if you're heading home after the game, give yourself a little extra time.",
  "If you're stuck in traffic, at least you'll have the Cubs game on the radio.",
  "Harry Caray would like to wish a happy 79th birthday to Mrs. Helen Kowalski of Cicero.",
  "Happy anniversary to Frank and Dolores celebrating 42 years together in Oak Park.",
  "A birthday greeting goes out to Tommy in Joliet, who turns 10 today.",
  "Congratulations to the graduating class of Lane Tech High School.",
  "Best wishes to all the graduates across the Chicago area this month.",
  // Rooftop / closing
  "Harry wonders if those rooftop fans paid for tickets.",
  "Steve says they probably did, Harry.",
  "Harry says he'd like to watch one game from up there himself.",
  // General Chicago color
  "Enjoy the game, enjoy the weather, and enjoy Chicago.",
  "We hope you're having a wonderful day wherever you're watching from.",
  "Thanks again for joining us from the Friendly Confines.",
  "We'll be back with more Cubs baseball right after this message.",
]);

registerTeamAds('cubs', 'charity', [
  "Cubs Charities thanks fans for their continued support.",
  "Consider donating to your local Little League program this summer.",
  "Sign up now for youth baseball clinics hosted by local coaches throughout Chicagoland.",
  "Encourage your youngsters to get involved in baseball this summer.",
  "Registration is open for neighborhood park district baseball leagues.",
  "The Chicago Park District offers activities for children all summer long.",
  "The Cubs remind fans to recycle aluminum cans whenever possible.",
  "Help keep Chicago's parks and neighborhoods clean.",
  "Support your local community organizations this summer.",
]);

// ── Yankees / New York (#201–300) ──

// Yankees-specific team promos
registerTeamAds('yankees', 'team_promo', [
  "Join the Yankees this Sunday for Old-Timers Day at Yankee Stadium.",
  "Don't miss Old-Timers Day as Yankee legends return to the Bronx.",
  "The Yankees invite youngsters to attend Youth Baseball Day next weekend.",
  "Stop by the souvenir stands for official Yankees yearbooks and scorecards.",
]);

// Mets-specific team promos
registerTeamAds('mets', 'team_promo', [
  "The Mets continue their homestand tomorrow evening at Shea Stadium.",
  "Kids Day returns to Shea Stadium this Sunday.",
  "The first 10,000 fans at Shea Stadium receive a commemorative Mets poster.",
  "Meet several Mets players this Saturday during a special fan event.",
]);

// Yankees player appearances
registerTeamAds('yankees', 'team_promo', [
  "Don Mattingly will be signing autographs Saturday afternoon in White Plains.",
  "Meet Don Mattingly and several Yankee teammates this weekend.",
  "Ron Guidry will appear at a charity fundraiser in the Bronx on Saturday.",
  "Dave Winfield will meet fans following a youth baseball clinic.",
]);

// Mets player appearances
registerTeamAds('mets', 'team_promo', [
  "Keith Hernandez will sign autographs this weekend on Long Island.",
  "Darryl Strawberry will appear at a baseball card show Saturday morning.",
  "Several Mets players will participate in a charity softball game this weekend.",
  "Dwight Gooden is scheduled to appear at a youth baseball event.",
]);

// Shared NY team promos (both teams)
const NY_SHARED_TEAM_PROMO = [
  "Stop by and meet members of both New York clubs at upcoming charity functions.",
  "Fans are encouraged to check local listings for player appearances.",
];
registerTeamAds('yankees', 'team_promo', NY_SHARED_TEAM_PROMO);
registerTeamAds('mets', 'team_promo', NY_SHARED_TEAM_PROMO);

// Shared NY charity (both teams)
const NY_SHARED_CHARITY = [
  "Youth baseball clinics continue throughout New York this summer.",
  "Sign up now for Little League camps across the metropolitan area.",
];
registerTeamAds('yankees', 'charity', NY_SHARED_CHARITY);
registerTeamAds('mets', 'charity', NY_SHARED_CHARITY);

// Shared NY community - landmarks, Broadway, family attractions (both teams)
const NY_SHARED_COMMUNITY = [
  // Landmarks
  "Take a ferry ride and visit the Statue of Liberty this weekend.",
  "Lady Liberty continues to welcome visitors from around the world.",
  "Spend an afternoon exploring Ellis Island.",
  "The Statue of Liberty restoration project continues thanks to generous donations.",
  "Visit the Empire State Building for one of the finest views in America.",
  "The observation deck atop the Empire State Building is open daily.",
  "Take in the sights of New York from the top of Rockefeller Center.",
  "Rockefeller Center remains one of the city's most popular attractions.",
  "Visit the Metropolitan Museum of Art this weekend.",
  "Explore thousands of years of history at the Metropolitan Museum of Art.",
  "The Museum of Modern Art features exciting new exhibits this summer.",
  "Spend a day at the American Museum of Natural History.",
  "The Hayden Planetarium welcomes visitors throughout the week.",
  "Learn about the universe at the Hayden Planetarium.",
  "Visit the Guggenheim Museum and enjoy its unique architecture.",
  // Broadway
  "Broadway continues to offer world-class entertainment.",
  "See one of New York's great musicals this weekend.",
  "Cats continues its successful Broadway run.",
  "Tickets remain available for select Broadway performances.",
  "Enjoy an evening in the theater district after today's game.",
  "New productions are opening regularly throughout Manhattan.",
  "Broadway remains one of New York's greatest attractions.",
  "Consider making a night of it with dinner and a show.",
  "Visitors from around the world continue to flock to Broadway.",
  "Check local listings for performance times and ticket availability.",
  // Family attractions
  "Visit the Bronx Zoo and see animals from around the globe.",
  "The Bronx Zoo remains one of America's largest zoological parks.",
  "Spend a day exploring Central Park.",
  "Central Park offers activities for visitors of all ages.",
  "Enjoy a relaxing afternoon in Central Park this weekend.",
  "Visit the New York Botanical Garden in the Bronx.",
  "The Botanical Garden is featuring beautiful summer displays.",
  "Take the family to Coney Island for rides and entertainment.",
  "Enjoy the boardwalk attractions at Coney Island.",
  "Spend a day along the beaches of Long Island.",
  // Community events
  "The New York Public Library invites visitors to its summer programs.",
  "Reading programs are underway at libraries throughout the city.",
  "Support your neighborhood Little League this season.",
  "Youth baseball remains one of America's great traditions.",
  "Community recreation programs continue throughout New York this summer.",
  "Consider volunteering with local youth organizations.",
  "New York parks offer activities for the entire family.",
  "Enjoy free concerts in city parks throughout the summer.",
  "Outdoor movie nights continue across the five boroughs.",
  "Check local listings for neighborhood festivals and events.",
  // General New York flavor
  "It's another beautiful day in New York City.",
  "The skyline never gets old.",
  "New York remains one of the most exciting cities in the world.",
  "Visitors continue to arrive from every corner of the globe.",
  "There's always something happening in New York.",
  "The city is alive today.",
  "Baseball and New York simply belong together.",
  "The sounds of summer are everywhere today.",
  "A fine day for baseball in the Big Apple.",
  "New York baseball fans know their game.",
];
registerTeamAds('yankees', 'community', NY_SHARED_COMMUNITY);
registerTeamAds('mets', 'community', NY_SHARED_COMMUNITY);

// Shared NY sponsor - radio & TV (both teams)
const NY_SHARED_SPONSOR = [
  "Stay tuned after the game for local news and weather updates.",
  "Join us later tonight for sports highlights from around the league.",
  "Baseball fans can catch additional coverage following today's game.",
  "Stay with us for postgame interviews and analysis.",
  "More Yankees baseball is coming your way tomorrow evening.",
];
registerTeamAds('yankees', 'sponsor', NY_SHARED_SPONSOR);
registerTeamAds('mets', 'sponsor', [
  "Stay tuned after the game for local news and weather updates.",
  "Join us later tonight for sports highlights from around the league.",
  "Baseball fans can catch additional coverage following today's game.",
  "Stay with us for postgame interviews and analysis.",
  "More Mets baseball is coming your way tomorrow evening.",
]);

// Phil Rizzuto-style reads - Yankees only
registerTeamAds('yankees', 'community', [
  "Holy cow, traffic looks heavy on the Major Deegan today.",
  "If you're heading home through the Bronx, give yourself a little extra time.",
  "Phil says it's a beautiful day to be at the ballpark.",
  "Scooter says he'd rather be here than sitting in traffic.",
  "Phil would like to wish a happy birthday to Joey in Yonkers.",
  "Happy anniversary to Frank and Marie celebrating 35 years in Queens.",
  "A birthday greeting goes out to Mrs. Sullivan in Staten Island.",
  "Phil says hello to everyone listening from New Jersey.",
  "Greetings to Yankee fans throughout Connecticut.",
  "Thanks for spending your afternoon with us.",
  // Rare / funny Rizzuto reads
  "Phil says he got lost driving to the stadium again.",
  "Scooter claims every road in the Bronx goes the wrong direction.",
  "Phil says he once missed batting practice because of traffic.",
  "Holy cow, somebody just handed Phil another birthday card.",
  "Phil has now received three birthday announcements this inning.",
  "Scooter says he's still trying to figure out his new VCR.",
  "Phil says the instruction manual was thicker than a phone book.",
  "Somebody sent Phil a fruit basket and he'd like to say thank you.",
  "Phil would also like to thank the nice lady who mailed him homemade cookies.",
  "And now, back to baseball from New York City.",
]);

// ── Dodgers / California (#301–400) ──

// Dodgers-specific team promos
registerTeamAds('dodgers', 'team_promo', [
  "The Dodgers return home tomorrow night for another exciting series at Dodger Stadium.",
  "Pick up your official Dodgers yearbook at souvenir stands throughout the ballpark.",
  "The first 15,000 fans this Saturday receive a commemorative Dodgers cap.",
  "Bring the family to Dodger Stadium for Family Day this Sunday.",
  "Orel Hershiser will meet fans at a special community event this weekend.",
  "Meet several Dodgers players during an upcoming autograph session.",
  "Youth baseball clinics continue throughout Southern California this summer.",
  "Register now for Dodgers-sponsored youth baseball camps.",
  "The Dodgers thank fans throughout California for their continued support.",
  "Tickets remain available for upcoming games at Dodger Stadium.",
]);

// Padres-specific team promos
registerTeamAds('padres', 'team_promo', [
  "The Padres continue their homestand tomorrow evening at Jack Murphy Stadium.",
  "Join the Padres this weekend for Youth Baseball Day.",
  "The first 10,000 fans receive a Padres team poster.",
  "Padres players will participate in a charity softball event this weekend.",
  "Sign up now for youth baseball programs throughout San Diego County.",
  "Support local baseball and recreation programs this summer.",
  "Visit the Padres team store for official merchandise.",
  "The Padres thank their loyal fans across Southern California.",
  "Group ticket packages remain available for upcoming games.",
  "Bring your Little League team out to a Padres game this summer.",
]);

// Shared CA community - Disneyland, Universal, beaches, San Diego, aerospace (both teams)
const CA_SHARED_COMMUNITY = [
  // Disneyland
  "Spend a magical day at Disneyland in Anaheim.",
  "Disneyland continues to create memories for families from around the world.",
  "Visit Disneyland and experience exciting attractions for all ages.",
  "Make Disneyland part of your Southern California vacation plans.",
  "New attractions and entertainment await visitors at Disneyland.",
  "Disneyland remains one of America's favorite family destinations.",
  "Enjoy the rides, parades, and excitement of Disneyland.",
  "Plan your next family adventure at Disneyland.",
  "Thousands of visitors are enjoying Disneyland this summer.",
  "Disneyland welcomes guests every day of the year.",
  // Universal Studios & Hollywood
  "Visit Universal Studios Hollywood and see how movies are made.",
  "Take a behind-the-scenes tour at Universal Studios.",
  "Universal Studios offers excitement for movie fans of all ages.",
  "See famous movie sets and special effects demonstrations.",
  "Experience Hollywood magic at Universal Studios.",
  "Visit the famous Hollywood Walk of Fame this weekend.",
  "Take a stroll past the stars along Hollywood Boulevard.",
  "Explore the entertainment capital of the world.",
  "See iconic Hollywood landmarks throughout Los Angeles.",
  "Hollywood remains one of America's most famous destinations.",
  // Beaches & SoCal lifestyle
  "Enjoy the sunshine along the beaches of Southern California.",
  "Huntington Beach welcomes visitors throughout the summer.",
  "Spend a relaxing afternoon along the Pacific Coast.",
  "The beaches are beautiful this time of year.",
  "Take a drive along the scenic Pacific Coast Highway.",
  "Southern California offers some of the finest weather anywhere.",
  "Enjoy a day of surfing, swimming, and sunshine.",
  "The Pacific Ocean provides a spectacular backdrop for summer fun.",
  "Plan a family picnic at one of California's beautiful beaches.",
  "Another perfect Southern California day is underway.",
  // San Diego attractions
  "Visit the world-famous San Diego Zoo this weekend.",
  "The San Diego Zoo remains one of the finest zoological parks in the world.",
  "Spend a day exploring Balboa Park.",
  "Balboa Park offers museums, gardens, and cultural attractions.",
  "SeaWorld San Diego invites visitors to enjoy marine life exhibits.",
  "SeaWorld continues to delight families from across the country.",
  "Enjoy the beautiful San Diego waterfront.",
  "Take a harbor cruise and explore San Diego Bay.",
  "Visit historic Old Town San Diego.",
  "San Diego's year-round climate makes it a wonderful place to visit.",
  // Aerospace & technology
  "Southern California continues to lead the nation in aerospace innovation.",
  "Thousands of Californians work in the aerospace industry.",
  "New advances in aviation and technology are shaping the future.",
  "California remains a center of scientific achievement.",
  "The future is being built right here in Southern California.",
  "Visit local science museums and discover tomorrow's technology.",
  "Aerospace exhibits are now open throughout the region.",
  "Learn about aviation history at area museums.",
  "California's engineers continue to push the boundaries of innovation.",
  "Technology is changing the way America lives and works.",
  // Vin Scully storytelling
  "A summer afternoon and a baseball game. Some things never go out of style.",
  "Baseball has a way of bringing people together.",
  "Another beautiful day beneath the California sun.",
  "The game continues to connect generations of fans.",
  "Summer memories often begin at a ballpark.",
  "A father and son enjoying a game together-that's baseball.",
  "Every game tells a story.",
  "Baseball remains one of America's great traditions.",
  "There is something special about a day at the ballpark.",
  "Wherever you're listening from today, we're glad you're with us.",
  // Rare California color
  "Traffic is reportedly heavy on the Hollywood Freeway this afternoon.",
  "Give yourself extra time if you're heading toward Anaheim tonight.",
  "Southern California drivers are encouraged to take it easy out there.",
  "It seems everyone decided to head to the beach today.",
  "Another postcard-perfect California afternoon.",
  "Somewhere, someone is probably stuck on the freeway listening to this game.",
  "At least they're spending the time with baseball.",
  "The palm trees are swaying gently beyond the outfield.",
  "We hope you're enjoying this beautiful California day.",
  "Stay tuned for more baseball from the Golden State.",
];
registerTeamAds('dodgers', 'community', CA_SHARED_COMMUNITY);
registerTeamAds('padres', 'community', CA_SHARED_COMMUNITY);

// Military & naval flavor - shared but especially Padres territory
const CA_SHARED_MILITARY = [
  "We salute the men and women serving at Naval Base San Diego.",
  "Our thanks to military personnel listening throughout Southern California.",
  "The Navy remains an important part of San Diego life.",
  "Military families are an important part of our community.",
  "We extend our appreciation to those serving our country.",
  "San Diego proudly supports America's armed forces.",
  "Greetings to sailors stationed throughout the Pacific Fleet.",
  "We thank military families for their service and sacrifice.",
  "Naval aviation continues to play a vital role in national defense.",
  "Many service members are enjoying today's ballgame with us.",
];
registerTeamAds('dodgers', 'community', CA_SHARED_MILITARY);
registerTeamAds('padres', 'community', CA_SHARED_MILITARY);

// ── Tigers / Detroit (#401–425) ──

registerTeamAds('tigers', 'team_promo', [
  "Visit historic Tiger Stadium and experience one of baseball's great ballparks.",
  "The Tigers continue their homestand tomorrow afternoon in Detroit.",
  "Stop by the team store for official Tigers merchandise.",
  "The first 10,000 fans receive a Tigers team poster this Sunday.",
  "Join the Tigers for Youth Baseball Day next weekend.",
]);

registerTeamAds('tigers', 'community', [
  "Visit the Detroit Zoo and enjoy exhibits from around the world.",
  "The Detroit Zoo welcomes visitors all summer long.",
  "Take the family to Greenfield Village this weekend.",
  "Explore American history at Greenfield Village.",
  "Visit the Henry Ford Museum and discover America's industrial heritage.",
  "Detroit remains the automobile capital of the world.",
  "Tour one of Detroit's automotive museums this summer.",
  "We salute the hardworking men and women of Michigan's auto industry.",
  "Take a stroll along the Detroit Riverfront this weekend.",
  "Summer concerts continue throughout metropolitan Detroit.",
  "The Tigers thank fans listening throughout Michigan.",
  "Greetings to baseball fans across the Great Lakes region.",
  "Ernie Harwell wishes everyone a pleasant evening.",
  "Another beautiful Michigan afternoon for baseball.",
  "The folks here in Detroit are enjoying this one.",
  "Happy birthday to Mr. Harold Simmons of Dearborn, celebrating his 82nd today.",
  "Congratulations to the graduates of Detroit Central High School.",
  "Support your local Little League programs this summer.",
  "Baseball remains a wonderful game for youngsters everywhere.",
  "The Tigers appreciate your support all season long.",
]);

// ── Orioles / Baltimore (#426–450) ──

registerTeamAds('orioles', 'team_promo', [
  "The Orioles return home tomorrow night at Memorial Stadium.",
  "The first 10,000 fans receive an Orioles commemorative cap.",
  "Orioles players will participate in a youth clinic this Saturday.",
  "Pick up your official Orioles yearbook at concession stands.",
  "Support Orioles Charities and local youth baseball.",
]);

registerTeamAds('orioles', 'community', [
  "Visit Baltimore's beautiful Inner Harbor this weekend.",
  "The Inner Harbor continues to attract visitors from around the country.",
  "Spend the day exploring Baltimore's waterfront attractions.",
  "The National Aquarium welcomes visitors daily.",
  "Discover fascinating marine life at the National Aquarium.",
  "Visit historic Fort McHenry, birthplace of our national anthem.",
  "Fort McHenry remains one of Maryland's most treasured landmarks.",
  "Enjoy a harbor cruise through Baltimore Harbor.",
  "Baltimore offers history, culture, and family fun.",
  "Baltimore remains one of baseball's great cities.",
  "The fans here know their baseball.",
  "We thank listeners throughout Maryland and the Mid-Atlantic region.",
  "Chuck Thompson reminds everyone to enjoy the game.",
  "Happy anniversary to George and Martha celebrating 40 years in Towson.",
  "A birthday greeting goes out to young Michael in Annapolis.",
  "Summer activities continue throughout Baltimore County.",
  "Community baseball programs are underway across Maryland.",
  "The Orioles appreciate your loyal support.",
  "Baseball and Baltimore have always gone hand in hand.",
  "Ain't the beer cold.",
]);

// ── Red Sox / Boston (#451–475) ──

registerTeamAds('redsox', 'team_promo', [
  "The Red Sox continue their homestand tomorrow at Fenway Park.",
  "The first 15,000 fans receive a Red Sox team poster.",
  "Stop by the souvenir stands for official Red Sox merchandise.",
  "Youth baseball clinics continue across New England.",
  "Support local baseball programs throughout Massachusetts.",
]);

registerTeamAds('redsox', 'community', [
  "Take a walk along Boston's historic Freedom Trail.",
  "Visit the Freedom Trail and explore America's past.",
  "The USS Constitution remains one of Boston's most popular attractions.",
  "Tour historic Boston Harbor this weekend.",
  "The New England Aquarium welcomes visitors daily.",
  "Explore the wonders of the ocean at the New England Aquarium.",
  "Spend the afternoon at Faneuil Hall Marketplace.",
  "Faneuil Hall continues to attract visitors from around the world.",
  "Visit the Museum of Fine Arts this weekend.",
  "Discover history and culture throughout Boston.",
  "Fenway Park remains one of baseball's most beloved ballparks.",
  "Red Sox fans are among the most knowledgeable in baseball.",
  "Greetings to listeners throughout New England.",
  "Another fine evening for baseball in Boston.",
  "Happy birthday to Mrs. O'Leary of Worcester.",
  "Congratulations to graduates throughout Massachusetts.",
  "Summer festivals continue across New England.",
  "We thank Red Sox fans for their continued support.",
  "There's nothing quite like baseball at Fenway Park.",
  "Enjoy the game and enjoy Boston.",
]);

// ── Generic MLB / PSA / Community (#476–490) ──

const GENERAL_PSA = [
  "Support your local youth baseball league this summer.",
  "Encourage children to get involved in sports and recreation.",
  "Reading is important. Visit your local library this week.",
  "Libraries across America offer summer reading programs.",
  "Drive safely and always wear your seatbelt.",
  "Please remember to drink responsibly.",
  "Support community organizations in your hometown.",
  "Volunteer opportunities are available throughout your community.",
  "Keep America's parks clean and beautiful.",
  "Recycle aluminum cans whenever possible.",
  "Baseball is best enjoyed with family and friends.",
  "Take a youngster to a ballgame this summer.",
  "Spend quality time outdoors this weekend.",
  "Support local charities and community events.",
  "Thank you for being a baseball fan.",
];

// Merge PSAs into general community pool - they play everywhere
GENERAL_COMMUNITY.push(...GENERAL_PSA);

// ── Rare Easter Egg Ads (#491–500) ──

// Announcer-specific rare reads - registered to their teams
registerTeamAds('cubs', 'community', [
  "Harry says he's pretty sure he left his scorecard in the seventh inning.",
  "Just want to say hello to little Jimmy Cochrane, who skipped school today to watch his favorite team.",
]);
registerTeamAds('yankees', 'community', [
  "Phil Rizzuto is still trying to program his VCR.",
]);
registerTeamAds('dodgers', 'community', [
  "Vin Scully notes that somewhere, someone is listening to this game while stuck in traffic.",
]);
registerTeamAds('padres', 'community', [
  "Jerry Coleman believes the seagulls have taken over left field.",
]);
registerTeamAds('tigers', 'community', [
  "Ernie Harwell says this game reminds him of one he saw thirty years ago.",
]);

// Generic heartwarming Easter eggs - playable anywhere
const EASTER_EGG_FINALE = [
  "The organist appears to know more songs than the announcers.",
  "A fan has reportedly caught three foul balls today. That's a good day.",
  "Someone in the upper deck is keeping score the old-fashioned way.",
  "The hot dog vendor appears to be winning his section by a wide margin.",
  "Somewhere, a youngster is falling in love with baseball for the first time today.",
  // Ultra-Rare "Announcer Lost the Plot" Reads (<0.05%) - fires once every few hundred games
  "You know, I still don't understand microwave ovens.",
  "My nephew says computers are the future. We'll see.",
  "I accidentally recorded over our vacation tape with a bowling tournament.",
  "The gentleman in Section 312 appears to have brought an entire watermelon.",
  "Somebody just caught a foul ball in a cowboy hat.",
  "The organist is currently winning an argument with a seagull.",
  "A young fan has been trying to start the wave for three innings with limited success.",
  "The scoreboard operator deserves a raise.",
  "The scoreboard operator may have just heard me say that.",
  "A fan in the upper deck has dropped his program three times and recovered it every time.",
];
GENERAL_COMMUNITY.push(...EASTER_EGG_FINALE);

// ── Reds / Cincinnati (#501–550) ──

registerTeamAds('reds', 'team_promo', [
  "The Reds continue their homestand tomorrow night at Riverfront Stadium.",
  "The first 10,000 fans this Sunday receive a commemorative Reds team poster.",
  "Stop by souvenir stands for your official 1984 Reds yearbook.",
  "Join the Reds for Youth Baseball Day next Saturday afternoon.",
  "Little League Night returns to Riverfront Stadium next week.",
  "Reds players will sign autographs this Saturday at the Carew Tower concourse.",
  "Don't miss Bat Day at Riverfront Stadium - the first 5,000 youngsters receive a free Louisville Slugger.",
  "Team Photo Day is coming up - check the scorecard for details.",
  "Reds Baseball Camp registration is now open for ages 8 through 14.",
  "Johnny Bench will appear at a special Big Red Machine autograph event next month.",
]);

registerTeamAds('reds', 'sponsor', [
  "Visit your local Skyline Chili and enjoy Cincinnati's favorite three-way.",
  "Skyline Chili - the official chili of Reds baseball.",
  "Gold Star Chili invites you to stop in after tonight's game.",
  "Hudepohl Beer - Cincinnati's own since 1885.",
  "Enjoy a cold Hudepohl at the ballpark tonight.",
  "WKRP in Cincinnati brings you all the hits, all summer long.",
  "Tune in to WLW 700 for complete Reds coverage throughout the season.",
  "WLW - the 50,000-watt voice of the Cincinnati Reds.",
  "Kings Island is now open for the summer season - ride The Beast if you dare.",
  "Kings Island welcomes families from across the region.",
  "Visit your local Kroger for fresh produce and great deals.",
  "P&G - bringing quality products to Cincinnati families for over a century.",
  "Cincinnati Bell - connecting the Queen City.",
]);

registerTeamAds('reds', 'community', [
  "Visit the Cincinnati Zoo this weekend - home of the world-famous white Bengal tigers.",
  "The Cincinnati Zoo welcomes visitors all summer long.",
  "Take the family to Kings Island this weekend.",
  "The Beast roller coaster is waiting.",
  "Visit the observation deck atop Carew Tower and see Cincinnati from above.",
  "Tour historic Union Terminal and experience the grand Art Deco architecture.",
  "Take a riverboat cruise along the Ohio River this weekend.",
  "Enjoy dinner aboard one of Cincinnati's famous riverboats.",
  "Walk along the Serpentine Wall and enjoy the view of the Ohio.",
  "The banks of the Ohio River offer a beautiful setting for a summer afternoon.",
  "Explore the Krohn Conservatory in Eden Park.",
  "The Krohn Conservatory features beautiful botanical displays all summer.",
  "Visit the Cincinnati Art Museum and discover works from around the world.",
  "Eden Park offers one of the best views of the city.",
  "Spend an afternoon at Coney Island on the river.",
  "Baseball fans throughout the tri-state area are enjoying this one.",
  "Greetings to listeners in Kentucky, Indiana, and across the Ohio Valley.",
  "Thank you to our loyal Reds fans throughout the Queen City.",
  "Joe and Marty thank you for spending your evening with us.",
  "A beautiful night along the river for baseball.",
]);

registerTeamAds('reds', 'charity', [
  "Support Reds Community Fund youth baseball programs throughout the tri-state area.",
  "Registration is open for summer youth baseball leagues in Cincinnati.",
  "Consider donating to local Little League programs this summer.",
  "Help keep youth baseball strong in the Queen City.",
  "The Reds remind fans to please recycle bottles and aluminum cans at Riverfront Stadium.",
]);

// ── Royals / Kansas City (#551–600) ──

registerTeamAds('royals', 'team_promo', [
  "The Royals continue their homestand tomorrow night at Royals Stadium.",
  "The first 10,000 fans this Sunday receive a commemorative Royals team poster.",
  "Stop by souvenir stands for your official 1984 Royals yearbook.",
  "Join the Royals for Youth Baseball Day next Saturday afternoon.",
  "Little League Night returns to Royals Stadium next week.",
  "Royals players will sign autographs this Saturday at Crown Center.",
  "Don't miss Bat Day at Royals Stadium - the first 5,000 youngsters receive a free Louisville Slugger.",
  "Team Photo Day is coming up - check the scorecard for details.",
  "Royals Baseball Camp registration is now open for ages 8 through 14.",
  "George Brett will appear at a special autograph event next month.",
]);

registerTeamAds('royals', 'sponsor', [
  "Visit Gates Bar-B-Q and taste Kansas City's finest barbecue.",
  "Arthur Bryant's Barbeque - a Kansas City tradition since the 1920s.",
  "Stop by Jack Stack Barbecue after tonight's game.",
  "Boulevard Beer - Kansas City's own, brewed right here in the heartland.",
  "Russell Stover Candies - proudly made in Kansas City since 1923.",
  "Tune in to WIBW 580 for complete Royals coverage throughout the season.",
  "The Royals Radio Network brings you baseball all across the Midwest.",
  "Visit your local Hallmark store - Kansas City's own - for cards and gifts.",
  "Hallmark Cards - when you care enough to send the very best.",
  "Worlds of Fun is now open for the summer season - ride the Orient Express if you dare.",
  "Worlds of Fun welcomes families from across the region.",
  "Visit your local Price Chopper for fresh produce and great deals.",
  "Kansas City Power & Light - powering the heartland.",
]);

registerTeamAds('royals', 'community', [
  "Visit the Country Club Plaza this weekend - Kansas City's original outdoor shopping district.",
  "The Plaza fountains are flowing beautifully this summer.",
  "Kansas City is the City of Fountains - over 200 throughout the metro area.",
  "Take the family to Worlds of Fun this weekend.",
  "The Timber Wolf and Orient Express are waiting.",
  "Visit the Kansas City Zoo and see animals from around the world.",
  "The Kansas City Zoo welcomes visitors all summer long.",
  "Spend an afternoon exploring the Nelson-Atkins Museum of Art.",
  "The giant shuttlecocks on the lawn are a Kansas City landmark.",
  "Visit historic Union Station and experience the grand Beaux-Arts architecture.",
  "Tour the Arabia Steamboat Museum and see treasures from the Missouri River.",
  "Walk through the City Market on a Saturday morning.",
  "Fresh produce and local goods every weekend at the City Market.",
  "Take a drive through Swope Park - one of the largest urban parks in America.",
  "Spend a summer evening at Starlight Theatre.",
  "Baseball fans throughout the heartland are enjoying this one.",
  "Greetings to listeners in Kansas, Missouri, Nebraska, and across the Midwest.",
  "Thank you to our loyal Royals fans throughout the metro area.",
  "Denny Matthews and Fred White thank you for spending your evening with us.",
  "A gorgeous night in Kansas City for baseball.",
]);

registerTeamAds('royals', 'charity', [
  "Support Royals Charities youth baseball programs throughout the metro area.",
  "Registration is open for summer youth baseball leagues in Kansas City.",
  "Consider donating to local Little League programs this summer.",
  "Help keep youth baseball strong in the heartland.",
  "The Royals remind fans to please recycle bottles and aluminum cans at Royals Stadium.",
]);

// ── Phillies / Philadelphia (#601–650) ──

registerTeamAds('phillies', 'team_promo', [
  // Non-bobblehead promos (the bulk of the pool, so homestand banner is rare by dilution)
  "Free 1984 Phillies team poster - pick yours up at the main gate.",
  "Youth Baseball Day at Veterans Stadium - kids run the bases after the game.",
  "Don't miss Bat Day this Sunday! The first five thousand kids through the gates receive a free Louisville Slugger.",
  "Phillies Old-Timers Day returns to Veterans Stadium this weekend.",
  "The Phillies continue their homestand tomorrow night at Veterans Stadium.",
  "Stop by the Phillies team store for official 1984 merchandise.",
  "Mike Schmidt will sign autographs this Saturday at the Gallery in Center City.",
  "Steve Carlton will appear at a special charity event benefiting South Philadelphia youth.",
  "Juan Samuel and Glenn Wilson will meet fans at a youth baseball clinic Saturday morning.",
  "Group ticket packages are available for remaining Phillies homestand games.",
  "The Phillies invite Little League teams to attend a special field day at The Vet.",
  "Eagles season tickets are now on sale - call Veterans Stadium for information.",
  // Homestand bobblehead banner - appears once in pool (rare among 12 other entries)
  "The homestand continues tomorrow at Veterans Stadium - come out and join us.",
]);

registerTeamAds('phillies', 'sponsor', [
  "Eagles season tickets are now on sale - call Veterans Stadium for information.",
  "Tastykake - Philadelphia's own - available throughout Veterans Stadium.",
  "Tastykake reminds you to save room for dessert.",
  "WCAU 1210 AM brings you every Phillies broadcast, home and away.",
  "Harry Kalas and Richie Ashburn thank you for listening on WCAU.",
  "PHL-17 brings you Phillies baseball every night - check local listings.",
  "Ballantine Beer - the official beer of Philadelphia baseball.",
  "Schmidts Beer of Philadelphia - brewed right here in the city.",
  "Frank's Black Cherry Wishniak - a South Philadelphia tradition since 1925.",
  "Horn & Hardart - the original automat - serving Philadelphia since 1902.",
  "Acme Markets welcomes Phillies fans throughout the Delaware Valley.",
  "Genuardi's Family Markets - family-owned, Philadelphia-proud.",
]);

registerTeamAds('phillies', 'community', [
  // Veterans Stadium / Philadelphia lore
  "Veterans Stadium - South Philadelphia's home since 1971.",
  "Broad Street - the spine of Philadelphia - runs right past The Vet.",
  "South Philadelphia is the home of the original cheesesteak.",
  "Pat's versus Geno's - Philadelphia's longest-running debate.",
  "The Italian Market on 9th Street is open every morning.",
  "Visit the Philadelphia Museum of Art this weekend - the steps are famous.",
  "The Liberty Bell and Independence Hall welcome visitors daily.",
  "Penn's Landing on the Delaware River offers summer entertainment all season.",
  "The Philadelphia Zoo in Fairmount Park is one of America's oldest.",
  "Please Drive Safely on I-95 and the Schuylkill Expressway after the game.",
  "The SEPTA Broad Street Line runs directly to the Pattison Avenue stop.",
  "Harry Kalas thanks everyone for coming out to Veterans Stadium tonight.",
  "Richie Ashburn would like to wish happy birthday to Mrs. Colangelo of Cheltenham.",
  "A birthday greeting to young Michael Fratelli, celebrating his 10th at tonight's game.",
  "Greetings to Phillies fans throughout Pennsylvania, New Jersey, and Delaware.",
  "South Philly, North Philly, the suburbs - welcome, all of you.",
  "The Phillies thank the five-county region for their continued support.",
  "Baseball and Philadelphia have always belonged together.",
]);

registerTeamAds('phillies', 'charity', [
  "Phillies Charities supports youth baseball throughout the Delaware Valley.",
  "Registration is open for youth baseball leagues throughout Philadelphia.",
  "Support the Children's Hospital of Philadelphia with your donations.",
  "CHOP - the Children's Hospital of Philadelphia - counts on community support.",
  "The Phillies encourage fans to donate to Philabundance, the regional food bank.",
  "Help feed families in need throughout Philadelphia through Philabundance.",
]);

// ── Royals Easter Eggs ──

registerTeamAds('royals', 'community', [
  "Denny Matthews recalls a game from '77 when Brett hit three doubles in one afternoon.",
  "The fountains are putting on a spectacular show tonight - timed perfectly to the music.",
  "A gentleman in Section 220 has been keeping score since the first pitch of the season.",
  "Someone in the upper deck is grilling in the parking lot on a portable hibachi.",
  "The smell of Arthur Bryant's is drifting across the Truman Sports Complex.",
  "Denny says this crowd reminds him of the '80 pennant race.",
  "The Royals have some of the best fans in baseball.",
  "Fred White notes the fountains look particularly blue tonight.",
]);

// ── Expos / Montreal (#651–700) ──

registerTeamAds('expos', 'team_promo', [
  "The Expos continue their homestand tomorrow night at Olympic Stadium.",
  "Les Expos de Montréal vous remercient de votre soutien - thank you, Montreal!",
  "The first 10,000 fans this Sunday receive a commemorative Expos team poster.",
  "Stop by souvenir stands for your official 1984 Expos yearbook.",
  "Join the Expos for Youth Baseball Day next Saturday afternoon.",
  "Little League Night returns to Olympic Stadium next week.",
  "Tim Raines and Gary Carter will appear at a special fan event this weekend.",
  "Don't miss Bat Day at Olympic Stadium - the first 5,000 youngsters receive a free Louisville Slugger.",
  "Team Photo Day is coming up - check the scorecard for details.",
  "Expos Baseball Camp registration is now open for ages 8 through 14.",
  "Gary Carter will sign autographs this Saturday at Place Bonaventure.",
  "Group ticket packages are available for remaining Expos homestand games.",
  "Bring your Little League team out to Olympic Stadium this summer.",
]);

registerTeamAds('expos', 'sponsor', [
  "CKAC Radio Montreal - la voix francophone des Expos.",
  "Dave Van Horne and Duke Snider thank you for listening to Expos baseball.",
  "Stay tuned to CJAD 800 for complete Expos coverage throughout the season.",
  "The Expos Radio Network brings baseball to fans across Quebec and the Maritimes.",
  "Molson Canadian - fière commanditaire des Expos de Montréal.",
  "Dow Brewery - brassée ici à Montréal depuis 1790.",
  "La Brasserie Molson vous invite à profiter du match avec un Molson Canadian.",
  "Les Ailes de la Mode - pour les vrais partisans des Expos.",
  "Steinberg's Supermarkets - proudly serving Montreal since 1917.",
  "Eaton's of Montreal invites you to browse their summer collections.",
  "Pascal Hardware - everything you need for your Montreal home.",
  "La Caisse Desjardins - la banque coopérative du Québec.",
]);

registerTeamAds('expos', 'community', [
  // Olympic Stadium and local landmarks
  "Bienvenue au Stade Olympique - welcome to Olympic Stadium, home of the Montreal Expos.",
  "Olympic Stadium stands as a testament to Montreal's 1976 Summer Games.",
  "The tower of Olympic Stadium is the world's largest inclined tower at 175 meters.",
  "Visit the Olympic Park complex and discover world-class facilities for all ages.",
  "The Biodôme - soon to open inside the velodrome - will showcase four ecosystems.",
  // Montreal neighborhoods and culture
  "Spend a Sunday morning in Le Plateau-Mont-Royal - the heart of Montreal's artistic soul.",
  "Stroll through Vieux-Montréal this weekend and experience 350 years of history.",
  "Visit the Basilique Notre-Dame de Montréal - one of North America's finest churches.",
  "Place Jacques-Cartier in Old Montreal is the city's outdoor living room in summer.",
  "The Jean-Talon Market in Little Italy is open six days a week - best produce in the city.",
  "Atwater Market offers fresh Quebec produce, cheeses, and local specialties.",
  "Take a walk along Rue Sherbrooke and admire Montreal's architectural heritage.",
  "Crescent Street is alive with patios, music, and Montreal's famous summer energy.",
  "Saint-Denis Street in the Quartier Latin - cafés, bookshops, and Quebec culture.",
  // Quebec pride
  "Les Québécois sont fiers de leurs Expos - a bilingual city and a bilingual team.",
  "Baseball in two languages - only in Montreal.",
  "The Expos represent Quebec on the continental stage. Allez les Expos!",
  "Tim Raines, Gary Carter, Andre Dawson - this team belongs to Montreal.",
  // Community events and local flavor
  "The International Jazz Festival returns to Montreal this July - free outdoor concerts all week.",
  "Just for Laughs comedy festival is coming - Montreal becomes the comedy capital of the world.",
  "Montreal's film festival is one of the world's oldest - celebrating the art of cinema.",
  "Enjoy free outdoor concerts at Parc Lafontaine this summer.",
  "The Festival des Films du Monde celebrates international cinema right here in Montreal.",
  "Visit the Musée des Beaux-Arts de Montréal and discover Quebec's artistic tradition.",
  "The McCord Museum on Sherbrooke Street tells the story of Montreal through the ages.",
  "Take the metro to any station - Montreal's underground city keeps you cool all summer.",
  "The Montreal Underground City connects 60 blocks of shops, restaurants, and offices.",
  "La Main - boulevard Saint-Laurent - divides east and west Montreal and unites them.",
  // Broadcasters and fan culture
  "Dave Van Horne calls the play - un jeu magnifique pour les partisans des Expos!",
  "Expos fans know their baseball. This city has lived and breathed the team since 1969.",
  "Greetings to Expos fans listening across Quebec, Ontario, and the Maritimes.",
  "From Laval to Longueuil, from Quebec City to Sherbrooke - merci aux partisans!",
  "Another beautiful Montreal evening for baseball at the Big Owe.",
  "The Big O - as some call it - is one of baseball's most distinctive stadiums.",
  "Denny's of Montreal - open late for Expos fans heading home from the game.",
  "The traffic on Autoroute 20 is reportedly moving well tonight.",
  "Take the Pie-IX metro station directly to Olympic Stadium - fast and efficient.",
  "Bienvenue à tous les partisans - welcome to all fans joining us tonight.",
  // Quebec food culture
  "After the game, try a classic Montreal smoked meat sandwich at Schwartz's on Saint-Laurent.",
  "Fairmount Bagel - open 24 hours - makes the best wood-fired bagels in the world.",
  "St-Viateur Bagels - the great Montreal bagel debate continues. Either way, you win.",
  "Poutine at La Banquise on Rachel - the classic Quebec comfort food done right.",
  "A Montreal-style hot dog - steamed bun, fried sausage, coleslaw - is a thing of beauty.",
]);

registerTeamAds('expos', 'charity', [
  "Les Expos de Montréal soutiennent les jeunes de la communauté - supporting youth in Quebec.",
  "Youth baseball registration is open across the island of Montreal this summer.",
  "Support Little League programs across Quebec this summer.",
  "Expos Community Foundation helps youth baseball thrive across the province.",
  "Volunteer opportunities with Montreal youth sports programs are available this summer - call your local ligue de baseball.",
  "Help keep baseball strong in Quebec. Sign up to coach a local youth team.",
  "Donate to your local Montreal community center - keeping youth off the streets and on the diamond.",
  "The Expos encourage fans to support community organizations throughout Quebec.",
  "La Croix-Rouge canadienne remercie les bénévoles de Montréal pour leur soutien.",
  "Montreal's food banks need your support - contact Moisson Montréal to donate.",
]);

// ── Reds Easter Eggs ──

registerTeamAds('reds', 'community', [
  "Joe Nuxhall says he still remembers his first big league pitch - he was 15 years old.",
  "Joe says he once pitched both ends of a doubleheader and still had energy for a chili three-way after.",
  "The organist appears to know every song written since 1869.",
  "A gentleman in Section 314 has now kept score for 43 consecutive innings.",
  "Someone just spilled an entire tray of chili dogs in the upper deck.",
  "The barge horns on the Ohio are so loud tonight you'd think they're in the stadium.",
  "Marty says this crowd reminds him of the Big Red Machine days.",
  "The Reds have played baseball in Cincinnati longer than most American cities have had professional sports.",
]);