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
  // Pick category by weight
  const roll = Math.random();
  let cumulative = 0;
  let chosenCategory = 'sponsor';
  for (const [cat, cfg] of Object.entries(AD_CATEGORIES)) {
    cumulative += cfg.weight;
    if (roll < cumulative) {
      chosenCategory = cat;
      break;
    }
  }

  const categoryConfig = AD_CATEGORIES[chosenCategory];
  const teamPool = TEAM_POOLS[homeTeamKey];

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