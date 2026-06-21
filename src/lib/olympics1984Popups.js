// 1984 Los Angeles Olympics interactive museum exhibits
// 25 entries showcasing the historic Summer Games celebration

const ENTRIES = [
  {
    id: 'olympics_coming',
    exhibit: 'The Summer Olympics Are Coming',
    icon: '🏅',
    matchText: 'The Summer Olympics are coming to Los Angeles this year.',
    tagline: 'A Historic Announcement',
    year: '1984',
    description: 'The Summer Olympics are coming to Los Angeles this year. It\'s the first time the Games will be held in Southern California.',
    significance: 'Historic home Games',
    category: 'announcement',
    funFact: 'LA would host the Olympic Games only once until 2028.',
  },
  {
    id: 'world_gathers',
    exhibit: 'Athletes From Around The World',
    icon: '🌍',
    matchText: 'Athletes from around the world will gather in Southern California this summer.',
    tagline: 'Global Gathering',
    description: 'Athletes from around the world will gather in Southern California this summer to compete at the highest level.',
    expectation: 'International assembly',
    category: 'gathering',
    funFact: 'Over 10,000 athletes from more than 140 countries participated.',
  },
  {
    id: 'experience_excitement',
    exhibit: 'Olympic Excitement',
    icon: '✨',
    matchText: 'Make plans now to experience Olympic excitement.',
    tagline: 'Once In A Lifetime',
    description: 'Make plans now to experience Olympic excitement. This is the chance to witness the world\'s greatest athletes competing in your own state.',
    opportunity: 'Historic event',
    category: 'experience',
    funFact: 'Attendance at the 1984 LA Olympics exceeded all previous Games.',
  },
  {
    id: 'torch_relay',
    exhibit: 'The Olympic Torch Relay',
    icon: '🔥',
    matchText: 'The Olympic Torch Relay continues its journey across America.',
    tagline: 'Journey Across The Nation',
    description: 'The Olympic Torch Relay continues its journey across America, bringing the spirit of the Games to communities nationwide.',
    spectacle: 'Cross-country journey',
    category: 'ceremony',
    funFact: 'The 1984 torch relay was the longest in Olympic history to that date.',
  },
  {
    id: 'la_welcomes',
    exhibit: 'Los Angeles Prepares',
    icon: '🏙️',
    matchText: 'Los Angeles prepares to welcome the world.',
    tagline: 'City Ready',
    description: 'Los Angeles prepares to welcome the world with newly built facilities and infrastructure improvements.',
    preparation: 'Major construction projects',
    category: 'preparation',
    funFact: 'LA upgraded its sports facilities and transportation specifically for the Games.',
  },
  {
    id: 'olympic_souvenirs',
    exhibit: 'Olympic Souvenirs',
    icon: '🎁',
    matchText: 'Olympic souvenirs are now available at participating retailers.',
    tagline: 'Commemorative Merchandise',
    description: 'Olympic souvenirs are now available at participating retailers throughout Southern California and nationwide.',
    merchandise: 'Official memorabilia',
    category: 'commerce',
    funFact: 'Olympic merchandise became collectible items worth significant money over time.',
  },
  {
    id: 'team_usa_training',
    exhibit: 'Team USA Training',
    icon: '💪',
    matchText: 'America\'s athletes are training hard for the Games.',
    tagline: 'Preparation Complete',
    description: 'America\'s athletes are training hard for the Games, pushing themselves to peak physical condition.',
    dedication: 'Intense preparation',
    category: 'athletes',
    funFact: 'American athletes trained year-round for their Olympic moment.',
  },
  {
    id: 'greatest_competitors',
    exhibit: 'The World\'s Greatest Competitors',
    icon: '⭐',
    matchText: 'The world\'s greatest competitors will soon take center stage.',
    tagline: 'Champions Assemble',
    description: 'The world\'s greatest competitors will soon take center stage in Los Angeles to demonstrate their exceptional athleticism.',
    level: 'Peak competition',
    category: 'athletes',
    funFact: 'The 1984 Games showcased record-breaking performances across nearly every sport.',
  },
  {
    id: 'olympic_coverage',
    exhibit: 'Olympic Coverage',
    icon: '📺',
    matchText: 'Follow Olympic coverage throughout the summer.',
    tagline: 'Broadcasting the Games',
    description: 'Follow Olympic coverage throughout the summer on television, radio, and newspapers.',
    access: 'Media everywhere',
    category: 'media',
    funFact: 'The 1984 Olympics received unprecedented television coverage.',
  },
  {
    id: 'countdown_begins',
    exhibit: 'The Countdown Begins',
    icon: '⏳',
    matchText: 'The countdown to the Summer Games is underway.',
    tagline: 'Days Away',
    description: 'The countdown to the Summer Games is underway. The opening ceremonies are just weeks away.',
    anticipation: 'Growing excitement',
    category: 'anticipation',
    funFact: 'Olympic anticipation built throughout the spring and early summer.',
  },
  {
    id: 'tickets_available',
    exhibit: 'Olympic Tickets',
    icon: '🎟️',
    matchText: 'Tickets remain available for select Olympic events.',
    tagline: 'Reserve Your Seat',
    description: 'Tickets remain available for select Olympic events. Reserve your spot to witness history live.',
    access: 'Limited availability',
    category: 'tickets',
    funFact: 'Olympic tickets became highly sought-after items.',
  },
  {
    id: 'olympic_fever',
    exhibit: 'Olympic Fever',
    icon: '🌡️',
    matchText: 'Olympic fever is spreading across the country.',
    tagline: 'National Excitement',
    description: 'Olympic fever is spreading across the country as Americans prepare to support their teams.',
    mood: 'Infectious enthusiasm',
    category: 'culture',
    funFact: 'American patriotism reached peak levels during the 1984 Summer Games.',
  },
  {
    id: 'spirit_of_competition',
    exhibit: 'The Spirit Of Competition',
    icon: '🏆',
    matchText: 'The spirit of competition arrives in Los Angeles.',
    tagline: 'Competitive Excellence',
    description: 'The spirit of competition arrives in Los Angeles, where athletes will push themselves to the absolute limit.',
    essence: 'Olympic ideals',
    category: 'values',
    funFact: 'The Olympic spirit of fair play and excellence defined these Games.',
  },
  {
    id: 'world_watching',
    exhibit: 'The World Is Watching',
    icon: '👀',
    matchText: 'The world will be watching.',
    tagline: 'Global Audience',
    description: 'The world will be watching as Los Angeles hosts the Summer Olympic Games. Billions will tune in.',
    viewership: 'Unprecedented reach',
    category: 'global',
    funFact: 'The 1984 LA Olympics reached television audiences worldwide.',
  },
  {
    id: 'let_games_begin',
    exhibit: 'Let The Games Begin',
    icon: '🎪',
    matchText: 'Let the games begin.',
    tagline: 'Moment of Glory',
    description: 'Let the games begin. The moment when athletes step onto the Olympic stage to compete for gold.',
    readiness: 'All systems ready',
    category: 'ceremony',
    funFact: 'The opening ceremony was a spectacular display of California showmanship.',
  },
  {
    id: 'team_usa_final',
    exhibit: 'Team USA Final Preparations',
    icon: '🇺🇸',
    matchText: 'Team USA continues preparations.',
    tagline: 'Last Minute Details',
    description: 'Team USA continues preparations as the Games draw near. Every detail matters.',
    status: 'Nearly complete',
    category: 'preparation',
    funFact: 'American athletes earned 83 medals at the 1984 LA Olympics.',
  },
  {
    id: 'venues_ready',
    exhibit: 'Olympic Venues',
    icon: '🏟️',
    matchText: 'Olympic venues are nearing completion.',
    tagline: 'Infrastructure Complete',
    description: 'Olympic venues are nearing completion. State-of-the-art facilities stand ready to host the world.',
    construction: 'Final touches',
    category: 'infrastructure',
    funFact: 'Many 1984 Olympic venues remained important sports facilities for decades.',
  },
  {
    id: 'opening_ceremony',
    exhibit: 'The Opening Ceremony',
    icon: '🎭',
    matchText: 'The opening ceremonies promise to be spectacular.',
    tagline: 'A Show To Remember',
    description: 'The opening ceremonies promise to be spectacular. Los Angeles will put on an unforgettable display.',
    expectation: 'Grand celebration',
    category: 'ceremony',
    funFact: 'The 1984 LA opening ceremony featured 1,000+ performers and lasted 3 hours.',
  },
  {
    id: 'athletes_dream',
    exhibit: 'Athletes Dream Of Gold',
    icon: '🥇',
    matchText: 'Athletes dream of Olympic gold.',
    tagline: 'Quest For Glory',
    description: 'Athletes dream of Olympic gold. For many, this is the moment they\'ve trained their entire lives for.',
    motivation: 'Ultimate prize',
    category: 'athletes',
    funFact: 'Winning Olympic gold remained the pinnacle achievement in amateur sports.',
  },
  {
    id: 'america_ready',
    exhibit: 'America Is Ready',
    icon: '🦅',
    matchText: 'America is ready.',
    tagline: 'Nation Prepared',
    description: 'America is ready. The nation stands prepared to host and celebrate the Olympic Games.',
    status: 'Fully prepared',
    category: 'national',
    funFact: '1984 marked a moment of American confidence and optimism.',
  },
  {
    id: 'so_cal_welcomes',
    exhibit: 'Southern California Welcomes',
    icon: '☀️',
    matchText: 'Southern California welcomes the world.',
    tagline: 'Hospitality First',
    description: 'Southern California welcomes the world with characteristic warmth and excitement.',
    spirit: 'Open arms',
    category: 'regional',
    funFact: 'Southern California\'s Mediterranean climate was ideal for summer games.',
  },
  {
    id: 'excitement_building',
    exhibit: 'Excitement Is Building',
    icon: '🎉',
    matchText: 'Olympic excitement is building every day.',
    tagline: 'Energy Rising',
    description: 'Olympic excitement is building every day as the Games draw closer.',
    momentum: 'Crescendo',
    category: 'culture',
    funFact: 'Media coverage amplified excitement daily in the weeks before the Games.',
  },
  {
    id: 'unforgettable_summer',
    exhibit: 'An Unforgettable Summer',
    icon: '☀️',
    matchText: 'This summer promises to be unforgettable.',
    tagline: 'Historic Season',
    description: 'This summer promises to be unforgettable. The 1984 Olympics will define the season for millions.',
    promise: 'Once-in-lifetime event',
    category: 'experience',
    funFact: '1984 summer became iconic for Americans who witnessed the Games.',
  },
  {
    id: 'games_almost_here',
    exhibit: 'The Games Are Almost Here',
    icon: '⏰',
    matchText: 'The Games are almost here.',
    tagline: 'Final Hours',
    description: 'The Games are almost here. Days away from the opening ceremony and first competitions.',
    imminence: 'Moment at hand',
    category: 'anticipation',
    funFact: 'The final days before the opening saw peak media coverage and preparation.',
  },
  {
    id: 'see_history',
    exhibit: 'See History Unfold',
    icon: '📜',
    matchText: 'See history unfold.',
    tagline: 'Live The Moment',
    description: 'See history unfold. The 1984 Los Angeles Olympics will be remembered for generations.',
    legacy: 'Historic Games',
    category: 'legacy',
    funFact: 'The 1984 LA Olympics became one of the most economically successful Games ever.',
  },
];

// Tracking for viewed Olympics exhibits
const VIEWED_EXHIBITS = new Set();
const EXHIBIT_VIEW_COUNTS = {};

/**
 * Find the Olympics entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findOlympics1984Entry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of an Olympics exhibit. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackOlympics1984View(entryId) {
  VIEWED_EXHIBITS.add(entryId);
  EXHIBIT_VIEW_COUNTS[entryId] = (EXHIBIT_VIEW_COUNTS[entryId] || 0) + 1;
  const unlocked = [];

  if (VIEWED_EXHIBITS.size >= 5) {
    unlocked.push('olympic_fan');
  }
  if (VIEWED_EXHIBITS.size >= 15) {
    unlocked.push('olympic_enthusiast');
  }
  if (VIEWED_EXHIBITS.size >= 25) {
    unlocked.push('olympic_devotee');
  }

  return unlocked;
}

/**
 * Get count of viewed Olympics exhibits.
 * @returns {number}
 */
export function getOlympics1984ViewCount() {
  return VIEWED_EXHIBITS.size;
}