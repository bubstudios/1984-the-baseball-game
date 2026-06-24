// Obscure / Failed TV Show interactive popups for the 1984 game experience
// 10 entries matching the failed TV show banner ads in broadcastAds.js (#501-510)

const ENTRIES = [
  {
    id: 'hot_pursuit',
    show: 'Hot Pursuit',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🚐',
    day: 'Fridays',
    time: '8:00 PM',
    matchText: 'Catch "Hot Pursuit" this Friday night. Action, excitement, and crime-fighting from coast to coast.',
    tagline: "They're young. They're reckless. They're always one step behind the law.",
    description: "Hot Pursuit follows two adventurous brothers traveling across America in a beat-up van, stumbling into mysteries, criminals, and dangerous situations wherever they go.",
    cast: ['Kerrie Keane', 'Eric Pierpoint'],
    funFact: "NBC hoped Hot Pursuit would capture some of the magic of The A-Team and Magnum, P.I., but audiences never fully embraced the series.",
    quote: "Adventure is waiting around every corner.",
  },
  {
    id: 'legmen',
    show: 'Legmen',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '📰',
    day: 'Wednesdays',
    time: '9:00 PM',
    matchText: 'Don\'t miss the new detective series "Legmen," premiering this week.',
    tagline: 'Private investigators. Magazine reporters. Reluctant heroes.',
    description: "Jack Gage and Dave Tucker travel the country writing stories for a men's magazine while solving crimes that somehow find them first.",
    cast: ['Bruce Greenwood', 'John Cryer'],
    funFact: "Future movie star John Cryer appeared years before becoming famous on Two and a Half Men. The show mixed journalism, mystery, and comedy in an attempt to create a modern detective series.",
  },
  {
    id: 'er',
    show: 'E/R',
    network: 'CBS',
    networkColor: '#0ea5e9',
    icon: '🏥',
    day: 'Thursdays',
    time: '8:30 PM',
    matchText: 'The comedy "E/R" returns Thursday evening.',
    tagline: "The emergency room has never been this funny.",
    description: "Life inside Chicago's busiest hospital is anything but normal. Doctors, nurses, patients, and administrators collide daily in this fast-paced workplace comedy.",
    cast: ['Elliott Gould', 'Mary McDonnell', 'George Clooney'],
    funFact: "A young actor named George Clooney appears as orderly Ace. Few viewers realize they're watching a future Hollywood superstar.",
    specialAchievement: 'future_star_spotter',
  },
  {
    id: 'jennifer_slept_here',
    show: 'Jennifer Slept Here',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '👻',
    day: 'Saturdays',
    time: '8:00 PM',
    matchText: 'Jennifer and Bruce continue their adventures on "Jennifer Slept Here."',
    tagline: "Life is complicated. It's even more complicated when your house is haunted.",
    description: "Former movie star Jennifer Farrell has passed away—but she still lives in the house. Only teenager Joey can see her. Together they navigate family life, school problems, and supernatural misunderstandings.",
    cast: ['Ann Jillian'],
    funFact: "The series combined family sitcom humor with a friendly ghost concept popular during the 1980s.",
  },
  {
    id: 'paper_dolls',
    show: 'Paper Dolls',
    network: 'ABC',
    networkColor: '#e11d48',
    icon: '👗',
    day: 'Tuesdays',
    time: '9:00 PM',
    matchText: 'Join us for another episode of "Paper Dolls."',
    tagline: 'Beauty. Fame. Competition. Secrets.',
    description: "Behind the glamorous world of fashion modeling lies intense rivalry and personal drama. Paper Dolls follows the lives of models, agents, designers, and executives struggling to stay on top.",
    cast: ['Lloyd Bridges', 'Morgan Fairchild', 'Nicollette Sheridan'],
    funFact: "ABC hoped Paper Dolls would compete with the popularity of Dynasty and Dallas. The fashion world provided plenty of drama—but not enough ratings.",
  },
  {
    id: 'yellow_rose',
    show: 'The Yellow Rose',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🌹',
    day: 'Fridays',
    time: 'Nighttime',
    matchText: 'See what happens next on "The Yellow Rose."',
    tagline: "Everything is bigger in Texas—including family feuds.",
    description: "The Champion family struggles to maintain control of their sprawling Texas ranch while facing business rivals and personal conflicts.",
    cast: ['Sam Elliott', 'Cybill Shepherd'],
    funFact: "Many critics praised the performances and storytelling, but the show struggled against tough competition in the ratings. Sam Elliott's mustache alone became one of television's most recognizable sights.",
  },
  {
    id: 'partners_in_crime',
    show: 'Partners in Crime',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🔍',
    day: 'Saturdays',
    time: 'Nighttime',
    matchText: 'Don\'t miss "Partners in Crime" starring Loni Anderson and Lynda Carter.',
    tagline: 'Two women. One detective agency. Endless trouble.',
    description: "After inheriting a private detective business, two unlikely partners find themselves chasing crooks, solving mysteries, and creating chaos.",
    cast: ['Loni Anderson', 'Lynda Carter'],
    funFact: "The series united two of television's biggest stars: Loni Anderson from WKRP in Cincinnati and Lynda Carter from Wonder Woman. Network executives expected a major hit. The audience had other plans.",
  },
  {
    id: 'finder_of_lost_loves',
    show: 'Finder of Lost Loves',
    network: 'ABC',
    networkColor: '#e11d48',
    icon: '💝',
    day: 'Wednesdays',
    time: '10:00 PM',
    matchText: 'Tune in for "Finder of Lost Loves" this week.',
    tagline: 'Sometimes people need help finding what matters most.',
    description: "Cary Maxwell travels the country reuniting lost friends, family members, and former sweethearts. Each week brings a new emotional journey.",
    cast: ['Tony Franciosa', 'Deborah Adair'],
    funFact: "The show's premise inspired elements later seen in reunion and reality television programs decades later. Many episodes were surprisingly heartfelt for primetime television.",
  },
  {
    id: 'riptide',
    show: 'Riptide',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🚁',
    day: 'Tuesdays',
    time: '8:00 PM',
    matchText: 'The drama continues on "Riptide."',
    tagline: 'The detective agency with the coolest helicopter on television.',
    description: 'Vietnam veteran Cody Allen and computer genius Nick Ryder solve crimes from their boat-based detective headquarters. Helping them is "Murray," a pink robot. Yes, really.',
    cast: ['Perry King', 'Joe Penny', 'Thom Bray'],
    funFact: "Riptide actually developed a cult following after cancellation. Many fans still remember the pink robot Murray, the Sikorsky helicopter, and the boat called The Riptide. One of the most gloriously 1980s shows ever produced.",
    cultClassic: true,
  },
  {
    id: 'hardcastle_mccormick',
    show: 'Hardcastle and McCormick',
    network: 'ABC',
    networkColor: '#e11d48',
    icon: '🏎️',
    day: 'Sundays',
    time: '8:00 PM',
    matchText: 'Catch "Hardcastle and McCormick" following tonight\'s news.',
    altMatchTexts: ['Hardcastle and McCormick returns with another high-speed adventure.'],
    tagline: 'Justice never retires.',
    description: "Retired Judge Milton Hardcastle recruits race-car driver Mark McCormick to help pursue criminals who escaped punishment through legal loopholes. Together they tackle cases the system couldn't finish.",
    cast: ['Brian Keith', 'Daniel Hugh Kelly'],
    funFact: "The show's custom sports car, The Coyote X, became almost as famous as the stars. Unlike many shows on this list, Hardcastle and McCormick actually lasted several seasons and remains fondly remembered by 1980s television fans.",
    quote: "The law gave up. They didn't.",
  },
];

// Tracking for viewed obscure TV ads
const VIEWED_ADS = new Set();
const SHOW_VIEW_COUNTS = {};

/**
 * Find the obscure TV entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findObscureTvEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of an obscure TV ad. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackObscureTvView(entryId) {
  VIEWED_ADS.add(entryId);
  SHOW_VIEW_COUNTS[entryId] = (SHOW_VIEW_COUNTS[entryId] || 0) + 1;
  const unlocked = [];

  // View 5 obscure TV popups
  if (VIEWED_ADS.size >= 5) {
    unlocked.push('one_season_wonder');
  }

  // View all 10 obscure TV popups
  if (VIEWED_ADS.size >= 10) {
    unlocked.push('tv_guide_subscriber');
  }

  // View the E/R popup (George Clooney)
  if (entryId === 'er') {
    unlocked.push('future_star_spotter');
  }

  // View the Riptide popup 5 times
  if (entryId === 'riptide' && SHOW_VIEW_COUNTS['riptide'] >= 5) {
    unlocked.push('cult_classic');
  }

  return unlocked;
}

/**
 * Get count of viewed obscure TV ads.
 * @returns {number}
 */
export function getObscureTvViewCount() {
  return VIEWED_ADS.size;
}