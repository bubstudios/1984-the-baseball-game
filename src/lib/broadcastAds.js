// Broadcast ad reads for the 1984 game experience
// Organized by category and team specificity
//
// Categories (matching real 1984 broadcast feel):
//   sponsor:    60% — product ads, TV shows, movies
//   community:  20% — local events, public service
//   charity:    10% — blood drives, fundraisers
//   team_promo: 10% — upcoming games, promotions

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

// Community announcements — generic, playable anywhere
const GENERAL_COMMUNITY = [
  "The local blood drive continues tomorrow at the community center from 9 AM to 3 PM. All donors receive a free t-shirt and a coupon for a half-gallon of ice cream.",
  "Registration is now open for summer youth baseball leagues. Sign up at your local parks and recreation office. All skill levels welcome, ages 5 through 15.",
  "The annual downtown street fair is this Saturday from 10 to 6. Live music, food vendors, and a classic car show — free admission for the whole family.",
  "The public library's summer reading program kicks off next week. Kids who read ten books earn a free pass to the water park. Stop by any branch to sign up.",
  "The high school band boosters are holding a pancake breakfast this Saturday morning at the school cafeteria. Five dollars gets you all-you-can-eat pancakes and sausage.",
  "The Kiwanis Club reminds you that their annual charity golf tournament is coming up on the 15th. All proceeds benefit the children's hospital.",
  "The local fire department is hosting an open house this Sunday. Bring the kids to see the trucks, meet the firefighters, and learn about fire safety.",
  "The city parks department needs volunteers for the spring cleanup day next Saturday. Gloves and trash bags provided — just show up at the main pavilion at 8 AM.",
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

// Team promotions — generic
const GENERAL_TEAM_PROMO = [
  "Don't miss Bat Day this Sunday! The first five thousand kids through the gates receive a free Louisville Slugger.",
  "Fireworks Night is this Friday after the game. Stick around for a spectacular show set to music.",
  "Next homestand features Cap Night and a magnetic schedule giveaway. Check the scorecard for details.",
  "Family Night tickets are available for every Tuesday home game — four tickets, four hot dogs, four sodas for one low price. Ask at the box office.",
];

// ── EXPORT: ad pools by team ──

const AD_CATEGORIES = {
  sponsor: { weight: 0.60, general: GENERAL_SPONSOR },
  community: { weight: 0.20, general: GENERAL_COMMUNITY },
  charity: { weight: 0.10, general: GENERAL_CHARITY },
  team_promo: { weight: 0.10, general: GENERAL_TEAM_PROMO },
};

// Team-specific overrides — each team can have its own ads that mix with general ones
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
    // Mix team ads into the pool — they appear frequently when available
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

// Shared NY community — landmarks, Broadway, family attractions (both teams)
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

// Shared NY sponsor — radio & TV (both teams)
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

// Phil Rizzuto-style reads — Yankees only
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

// Shared CA community — Disneyland, Universal, beaches, San Diego, aerospace (both teams)
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
  "A father and son enjoying a game together—that's baseball.",
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

// Military & naval flavor — shared but especially Padres territory
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

// Merge PSAs into general community pool — they play everywhere
GENERAL_COMMUNITY.push(...GENERAL_PSA);

// ── Rare Easter Egg Ads (#491–500) ──

// Announcer-specific rare reads — registered to their teams
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

// Generic heartwarming Easter eggs — playable anywhere
const EASTER_EGG_FINALE = [
  "The organist appears to know more songs than the announcers.",
  "A fan has reportedly caught three foul balls today. That's a good day.",
  "Someone in the upper deck is keeping score the old-fashioned way.",
  "The hot dog vendor appears to be winning his section by a wide margin.",
  "Somewhere, a youngster is falling in love with baseball for the first time today.",
];
GENERAL_COMMUNITY.push(...EASTER_EGG_FINALE);