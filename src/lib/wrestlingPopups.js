// Wrestling interactive popups for the 1984 game experience
// 25 entries matching the wrestling banner ads in broadcastAds.js (#676-700)

const ENTRIES = [
  {
    id: 'hulk_hogan',
    wrestler: 'Hulk Hogan',
    icon: '💪',
    title: 'Hulkamania Is Running Wild!',
    matchText: 'See Hulk Hogan in action this weekend.',
    tagline: 'Whatcha gonna do when Hulkamania runs wild on you?',
    height: '6\'7"',
    weight: '302 lbs',
    finisher: 'Leg Drop',
    description: 'The WWF Heavyweight Champion continues to dominate professional wrestling. After defeating The Iron Sheik for the championship, Hulk Hogan has become the biggest star in sports entertainment.',
    funFact: 'Hogan\'s merchandise sales are setting records nationwide.',
  },
  {
    id: 'roddy_piper',
    wrestler: 'Rowdy Roddy Piper',
    icon: '🎤',
    title: 'Rowdy Roddy Piper',
    matchText: 'Don\'t miss Rowdy Roddy Piper.',
    tagline: 'Just when they think they know the answer, I change the question.',
    from: 'Glasgow, Scotland',
    finisher: 'Sleeper Hold',
    tvSegment: 'Piper\'s Pit',
    description: 'The most controversial man in professional wrestling. Love him or hate him, Piper always has something to say.',
    funFact: 'Piper\'s Pit has become one of television\'s most talked-about wrestling interviews.',
  },
  {
    id: 'andre_giant',
    wrestler: 'Andre the Giant',
    icon: '🦣',
    title: 'The Eighth Wonder of the World',
    matchText: 'Andre the Giant continues to amaze audiences nationwide.',
    tagline: 'There is only one Andre.',
    height: '7\'4"',
    weight: '500+ Pounds',
    description: 'Crowds everywhere stand in awe of Andre the Giant. Legends claim he can drink entire cases of beer, lift opponents with ease, and draw larger crowds than almost anyone in wrestling.',
    funFact: 'Andre remains undefeated in the minds of many fans.',
    feats: ['Drink entire cases of beer', 'Lift opponents with ease', 'Draw larger crowds than almost anyone'],
  },
  {
    id: 'junkyard_dog',
    wrestler: 'Junkyard Dog',
    icon: '🐕',
    title: 'JYD Has Arrived!',
    matchText: 'Junkyard Dog appears this weekend.',
    tagline: 'Thump! Thump! Thump!',
    from: 'Louisiana',
    theme: 'Another One Bites The Dust',
    description: 'The Junkyard Dog continues to electrify audiences with his chain around his neck and unstoppable energy.',
    funFact: 'Fans pack arenas just to hear JYD\'s music begin.',
  },
  {
    id: 'sgt_slaughter',
    wrestler: 'Sgt. Slaughter',
    icon: '⚔️',
    title: 'Attention!',
    matchText: 'Watch Sgt. Slaughter take on all challengers.',
    tagline: 'I want maggots! Not excuses!',
    signature: 'Cobra Clutch',
    description: 'Former Marine Sgt. Slaughter is taking on all challengers. Known for the Cobra Clutch, military drills, and intimidating interviews.',
    funFact: 'Slaughter has appeared in GI Joe cartoons and toys.',
    known: ['Cobra Clutch', 'Military drills', 'Intimidating interviews'],
  },
  {
    id: 'iron_sheik',
    wrestler: 'The Iron Sheik',
    icon: '🇮🇷',
    title: 'Iran\'s Most Dangerous Export',
    matchText: 'The Iron Sheik returns to the ring this Saturday.',
    tagline: 'Make him humble!',
    finisher: 'Camel Clutch',
    manager: 'Freddie Blassie',
    description: 'The Iron Sheik continues to insult America and challenge fan favorites. Crowds nationwide shower the Sheik with boos.',
    funFact: 'Defeating the Iron Sheik launched Hulk Hogan\'s championship reign.',
  },
  {
    id: 'wrestling_town',
    wrestler: 'Professional Wrestling Comes to Your Town',
    icon: '🎪',
    title: 'One Night Only!',
    matchText: 'Professional wrestling is coming to the civic center next week.',
    tagline: 'Card subject to change.',
    date: 'Saturday Night',
    time: '8:00 PM',
    venue: 'Civic Center Arena',
    featured: ['Hulk Hogan', 'Roddy Piper', 'Andre the Giant', 'Junkyard Dog', 'Big John Studd'],
    tickets: { ringside: '$15', reserved: '$10', general: '$7' },
    description: 'One night only featuring the biggest stars in professional wrestling.',
    funFact: 'Children under 12 receive half-price admission.',
  },
  {
    id: 'championship_wrestling',
    wrestler: 'Championship Wrestling',
    icon: '🏆',
    title: 'The Gold Is On The Line',
    matchText: 'Championship matches are scheduled throughout the summer.',
    tagline: 'One mistake can cost everything.',
    description: 'Every champion enters the ring with one goal: To leave with the title.',
    championships: ['WWF Heavyweight Championship', 'Intercontinental Championship', 'Tag Team Championship'],
    funFact: 'Championship wrestling draws some of the largest crowds of the year.',
  },
  {
    id: 'heels_1984',
    wrestler: 'The Heels of 1984',
    icon: '😈',
    title: 'Wrestling\'s Most Hated Men',
    matchText: 'Rivalries continue to heat up across the wrestling world.',
    tagline: 'Everybody loves a hero. Everybody needs a villain.',
    featured: ['Roddy Piper', 'Iron Sheik', 'Big John Studd', 'Paul Orndorff'],
    description: 'Wrestling\'s most despised villains continue to draw huge crowds.',
    funFact: 'Fans buy tickets hoping to see these villains finally get what\'s coming.',
  },
  {
    id: 'babyfaces',
    wrestler: 'The Babyfaces',
    icon: '⭐',
    title: 'Wrestling\'s Good Guys',
    matchText: 'See your favorite wrestling superstars live.',
    tagline: 'Say your prayers and take your vitamins.',
    featured: ['Hulk Hogan', 'Junkyard Dog', 'Tito Santana', 'Andre the Giant'],
    description: 'Wrestling\'s good guys continue filling arenas across America.',
    funFact: 'Fan favorite wrestlers drive some of the biggest gate receipts.',
  },
  {
    id: 'wrestling_magazine',
    wrestler: 'Wrestling Magazine Special',
    icon: '📰',
    title: 'Inside The WWF',
    matchText: 'Meet your favorite wrestling stars at special appearances.',
    tagline: 'Only $1.95 at newsstands.',
    features: ['Hulk Hogan poster', 'Andre interview', 'Roddy Piper feature', 'Upcoming event schedule'],
    description: 'This month\'s special issue includes the biggest names in professional wrestling.',
    funFact: 'Wrestling magazines were among the best-selling specialty magazines of the mid-1980s.',
    price: '$1.95',
  },
  {
    id: 'pipers_pit',
    wrestler: 'Piper\'s Pit',
    icon: '🎬',
    title: 'Anything Can Happen',
    matchText: 'Television cameras will be on hand.',
    tagline: 'Viewer discretion is advised.',
    host: 'Roddy Piper',
    description: 'Hosted by Roddy Piper. Guests never know what awaits them. Fans never know what Piper will say. Television executives never know what Piper will do.',
    funFact: 'Piper\'s Pit has become wrestling\'s most unpredictable interview segment.',
  },
  {
    id: 'big_john_studd',
    wrestler: 'Big John Studd',
    icon: '🏋️',
    title: 'Wrestling\'s Giant Challenge',
    matchText: 'The excitement begins when the bell rings.',
    tagline: 'One of the few men large enough to stand eye-to-eye with Andre.',
    height: '6\'10"',
    weight: '360 lbs',
    manager: 'Bobby "The Brain" Heenan',
    challenge: 'Body Slam Andre The Giant',
    prize: '$15,000',
    description: 'Big John Studd offers a massive prize to anyone who can body slam Andre the Giant.',
    funFact: 'The $15,000 prize became one of wrestling\'s most famous challenges.',
  },
  {
    id: 'bobby_heenan',
    wrestler: 'Bobby "The Brain" Heenan',
    icon: '🧠',
    title: 'The Smartest Manager In Wrestling',
    matchText: 'Fans of all ages enjoy the excitement of professional wrestling.',
    tagline: 'Winners hire Heenan.',
    description: 'If a wrestler wins, chances are The Brain had something to do with it.',
    clients: ['Big John Studd', 'King Kong Bundy', 'Paul Orndorff'],
    funFact: 'Heenan\'s managing career spans decades of professional wrestling history.',
  },
  {
    id: 'wrestling_tv',
    wrestler: 'Wrestling on Television',
    icon: '📺',
    title: 'Saturday Morning Wrestling',
    matchText: 'Professional wrestling excitement is coming to your area.',
    tagline: 'Check local listings.',
    features: ['Interviews', 'Match highlights', 'Upcoming events', 'Championship action'],
    description: 'For many fans, this is appointment viewing every weekend.',
    funFact: 'Wrestling television programming drew millions of viewers nationwide.',
  },
  {
    id: 'hulkamania_merch',
    wrestler: 'Hulkamania Merchandise',
    icon: '🛍️',
    title: 'Now Available Everywhere',
    matchText: 'A sold-out crowd is expected.',
    tagline: 'Retailers nationwide report record sales.',
    products: ['T-Shirts', 'Headbands', 'Posters', 'Action Figures'],
    description: 'Hulk Hogan merchandise is flying off shelves across America.',
    funFact: 'Hulk Hogan merchandise became one of the hottest licensed products of the decade.',
  },
  {
    id: 'wrestlemania',
    wrestler: 'The Road to WrestleMania',
    icon: '🎭',
    title: 'A New Era Begins',
    matchText: 'The action is bigger than ever.',
    tagline: 'Coming Soon: WrestleMania',
    description: 'Professional wrestling is bigger than ever. Sold-out arenas. National television. Larger-than-life personalities. The future has arrived.',
    funFact: 'WrestleMania would become the biggest annual wrestling event in the world.',
  },
  {
    id: 'wrestling_trivia',
    wrestler: 'Wrestling Trivia',
    icon: '❓',
    title: 'Did You Know?',
    matchText: 'The excitement begins when the bell rings.',
    tagline: 'Wrestling history goes beyond the ring.',
    facts: [
      'Andre the Giant once appeared in movies and television.',
      'Hulk Hogan appeared in Rocky III.',
      'Roddy Piper was once a real bagpipe player.',
      'The Iron Sheik was an Olympic wrestler.',
    ],
    description: 'Professional wrestlers have careers that extend far beyond the wrestling ring.',
    funFact: 'Many wrestlers have appeared in movies and television outside of wrestling.',
  },
  {
    id: 'tag_teams',
    wrestler: 'The Tag Team Division',
    icon: '👥',
    title: 'Two Men. One Goal.',
    matchText: 'Rivalries continue to heat up across the wrestling world.',
    tagline: 'Tag team wrestling continues to draw huge crowds.',
    teams: ['The US Express', 'The Wild Samoans', 'The North-South Connection'],
    description: 'Tag team wrestling features some of the most exciting matches.',
    funFact: 'Tag team championships became some of wrestling\'s most prestigious titles.',
  },
  {
    id: 'civic_center',
    wrestler: 'Live From the Civic Center',
    icon: '🎪',
    title: 'Tonight\'s Main Event',
    matchText: 'Professional wrestling excitement is coming to your area.',
    tagline: 'Expected Attendance: Sellout',
    mainEvent: 'Hulk Hogan vs. Big John Studd',
    specialAttraction: 'Andre the Giant',
    bellTime: '8 PM',
    description: 'The biggest wrestling event comes to your local civic center.',
    funFact: 'Sellout crowds became common for wrestling events in 1984.',
  },
  {
    id: 'fan_club',
    wrestler: 'Wrestling Fan Club',
    icon: '🎟️',
    title: 'Join Today!',
    matchText: 'Meet your favorite wrestling stars at special appearances.',
    tagline: 'Only $9.95 per year.',
    includes: ['Newsletter', 'Photos', 'Merchandise Discounts', 'Event Information'],
    price: '$9.95 per year',
    description: 'Join thousands of wrestling fans in the official fan club.',
    funFact: 'Wrestling fan clubs became extremely popular during the 1984 boom.',
  },
  {
    id: 'saturday_night',
    wrestler: 'Saturday Night Main Event',
    icon: '🌙',
    title: 'Wrestling\'s Biggest Stars',
    matchText: 'Wrestling fans won\'t want to miss this one.',
    tagline: 'No other sport offers this much excitement.',
    weekly: ['Heroes', 'Villains', 'Championships', 'Rivalries'],
    description: 'Every week brings the biggest stars and most exciting matches.',
    funFact: 'Saturday Night Main Event became one of television\'s most popular wrestling programs.',
  },
  {
    id: 'crowd_waiting',
    wrestler: 'The Crowd is Waiting',
    icon: '👥',
    title: 'The Arena Before Bell Time',
    matchText: 'The crowd is waiting.',
    tagline: 'For thousands of fans, there is nothing else like it.',
    description: 'The lights dim. The music starts. The crowd rises. The wrestlers emerge.',
    funFact: 'Wrestling crowds became known for their incredible enthusiasm and energy.',
  },
  {
    id: 'stars_ready',
    wrestler: 'The Stars Are Ready',
    icon: '⭐',
    title: 'Who Will Be Next?',
    matchText: 'The stars are ready.',
    tagline: 'The future of professional wrestling has never looked brighter.',
    stars: ['Hulk Hogan', 'Roddy Piper', 'Andre the Giant', 'Junkyard Dog', 'Tito Santana'],
    description: 'The biggest names in wrestling prepare for their greatest challenges.',
    funFact: 'The 1984 wrestling class would define the decade to come.',
  },
  {
    id: 'time_wrestling',
    wrestler: 'It\'s Time for Professional Wrestling',
    icon: '⏰',
    title: 'America Loves Wrestling',
    matchText: 'It\'s time for professional wrestling.',
    tagline: '1984 is the year wrestling went national.',
    description: 'From packed arenas to sold-out merchandise stands, professional wrestling is becoming one of the hottest forms of entertainment in the country.',
    funFact: 'Professional wrestling would explode in popularity throughout the 1980s.',
  },
];

// Tracking for viewed wrestling ads
const VIEWED_ADS = new Set();
const WRESTLER_VIEW_COUNTS = {};

/**
 * Find the wrestling entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findWrestlingEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of a wrestling ad. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackWrestlingView(entryId) {
  VIEWED_ADS.add(entryId);
  WRESTLER_VIEW_COUNTS[entryId] = (WRESTLER_VIEW_COUNTS[entryId] || 0) + 1;
  const unlocked = [];

  if (VIEWED_ADS.size >= 5) {
    unlocked.push('wrestling_fan');
  }
  if (VIEWED_ADS.size >= 15) {
    unlocked.push('wrestling_devotee');
  }
  if (VIEWED_ADS.size >= 25) {
    unlocked.push('wrestling_legend');
  }

  return unlocked;
}

/**
 * Get count of viewed wrestling ads.
 * @returns {number}
 */
export function getWrestlingViewCount() {
  return VIEWED_ADS.size;
}