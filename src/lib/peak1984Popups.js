// Peak 1984 Culture interactive museum exhibits
// 25 entries showcasing VHS, cassettes, early computers, and tech optimism

const ENTRIES = [
  {
    id: 'be_kind_rewind',
    exhibit: 'Be Kind, Rewind',
    icon: '📼',
    matchText: 'Remember to rewind your VHS tapes before returning them.',
    tagline: 'Video Store Courtesy Reminder',
    year: '1984',
    description: 'Please remember to rewind all VHS tapes before returning them. Failure to rewind may result in a 50¢ fee.',
    theme: 'iconic',
    funFact: '"Be Kind, Rewind" became one of the most recognizable phrases of the video-rental era.',
    quote: 'Be Kind, Rewind.',
    category: 'video',
  },
  {
    id: 'video_rentals_boom',
    exhibit: 'Video Rentals Are Booming',
    icon: '🎬',
    matchText: 'Please be kind and rewind.',
    tagline: 'Friday Night Starts Here',
    description: 'A typical video store now carries hundreds of titles. Popular rentals include Ghostbusters, Indiana Jones, Star Wars, and The Karate Kid.',
    featured: ['Ghostbusters', 'Indiana Jones', 'Star Wars', 'The Karate Kid'],
    trend: 'Many stores report lines out the door on weekends.',
    category: 'video',
    funFact: 'Video rental stores became social hubs during the 1980s.',
  },
  {
    id: 'video_club',
    exhibit: 'Video Club Membership',
    icon: '🎟️',
    matchText: 'Video rental memberships are available now.',
    tagline: 'Join Today',
    description: 'Membership benefits include overnight rentals, new release reservations, and family discounts.',
    benefits: ['Overnight Rentals', 'New Release Reservations', 'Family Discounts'],
    trend: 'Thousands of Americans are discovering the convenience of home movies.',
    category: 'video',
    funFact: 'Video rental memberships were a significant family commitment.',
  },
  {
    id: 'new_release_tuesday',
    exhibit: 'New Release Tuesday',
    icon: '✨',
    matchText: 'New releases arrive every Tuesday.',
    tagline: 'Just Arrived',
    description: 'Today\'s new rentals include The Natural, Splash, and Romancing the Stone.',
    featured: ['The Natural', 'Splash', 'Romancing the Stone'],
    warning: 'The hottest titles rarely stay on the shelf long. Reserve early.',
    category: 'video',
    funFact: 'Tuesday became the standard new release day for video rentals.',
  },
  {
    id: 'movie_reservations',
    exhibit: 'Movie Reservations',
    icon: '📋',
    matchText: 'Reserve your favorite movie before it\'s gone.',
    tagline: 'Coming Soon',
    description: 'Waiting lists have formed for several major releases. Customers are encouraged to reserve copies in advance.',
    urgent: true,
    category: 'video',
    funFact: 'Popular films could have weeks-long waiting lists at rental stores.',
  },
  {
    id: 'vcr_revolution',
    exhibit: 'The VCR Revolution',
    icon: '📺',
    matchText: 'The VCR continues to revolutionize home entertainment.',
    tagline: 'Entertainment On Your Schedule',
    description: 'For the first time in history, viewers can watch movies whenever they choose. Industry experts predict millions of homes will own VCRs before the decade ends.',
    impact: 'Home entertainment transformed forever',
    category: 'video',
    funFact: 'The VCR was one of the most significant consumer electronics innovations of its era.',
  },
  {
    id: 'recording_television',
    exhibit: 'Recording Television',
    icon: '⏺️',
    matchText: 'More families are recording television programs at home.',
    tagline: 'Don\'t Miss Your Favorite Shows',
    description: 'Forgot to watch Dallas? Missed Cheers? Set your VCR and record it. The future has arrived.',
    examples: ['Dallas', 'Cheers'],
    category: 'video',
    funFact: 'Time-shifting television became possible with the VCR for the first time.',
  },
  {
    id: 'programming_vcr',
    exhibit: 'Programming the VCR',
    icon: '⏰',
    matchText: 'Set your VCR before leaving for work.',
    tagline: 'Challenge Accepted',
    description: 'The average American spends nearly fifteen minutes trying to set a VCR clock. Success is not guaranteed.',
    difficulty: 'Surprisingly Challenging',
    category: 'video',
    humor: true,
    funFact: 'Programming a VCR became a cultural joke about technology complexity.',
  },
  {
    id: 'video_store_boom',
    exhibit: 'The Video Store Boom',
    icon: '🏪',
    matchText: 'Video stores are adding more titles every week.',
    tagline: 'A New Store On Every Corner',
    description: 'Video rental shops are opening across America at record pace. Many experts compare the industry\'s growth to fast food franchises.',
    trend: 'Opening at unprecedented rates',
    category: 'video',
    funFact: 'Video rental stores became one of the fastest-growing retail segments of the 1980s.',
  },
  {
    id: 'cassette_era',
    exhibit: 'The Cassette Tape Era',
    icon: '🎵',
    matchText: 'The cassette tape remains a popular choice for music lovers.',
    tagline: 'Music Goes Mobile',
    description: 'Cassette tapes now outsell 8-tracks nationwide. Favorite albums can be enjoyed at home, in the car, or on a Walkman.',
    uses: ['At Home', 'In The Car', 'On A Walkman'],
    category: 'music',
    funFact: 'Cassettes became the dominant music format of the 1980s.',
  },
  {
    id: 'perfect_mixtape',
    exhibit: 'The Perfect Mixtape',
    icon: '🎧',
    matchText: 'Create your own custom mixtape.',
    tagline: 'Some Assembly Required',
    description: 'Hours spent beside the radio. Finger hovering over the Record button. Waiting for your favorite song. A rite of passage for an entire generation.',
    ritual: 'Cultural touchstone',
    category: 'music',
    funFact: 'Creating mixtapes became an art form and expression of personal taste.',
  },
  {
    id: 'portable_music',
    exhibit: 'Portable Music',
    icon: '🎤',
    matchText: 'Music lovers continue to embrace portable cassette players.',
    tagline: 'Music Anywhere',
    description: 'Portable cassette players are transforming how Americans listen to music. No longer tied to the living room stereo.',
    freedom: 'Unprecedented mobility',
    category: 'music',
    funFact: 'Portable cassette players liberated music from fixed locations.',
  },
  {
    id: 'music_with_you',
    exhibit: 'Take Your Music With You',
    icon: '🏃',
    matchText: 'Take your music wherever you go.',
    tagline: 'Freedom Sounds Like This',
    description: 'Joggers, students, travelers-everyone seems to be wearing headphones. Some adults remain confused by the trend.',
    adoption: 'Widespread and growing',
    category: 'music',
    humor: true,
    funFact: 'Portable music became ubiquitous, changing social behavior.',
  },
  {
    id: 'sony_walkman',
    exhibit: 'The Sony Walkman',
    icon: '🎙️',
    matchText: 'The Walkman remains one of the hottest products in America.',
    tagline: 'The Must-Have Gadget',
    description: 'Price: Around $100. Status Symbol: Absolutely. One of the most desired electronic products of the decade.',
    price: '$100',
    status: 'Cultural icon',
    category: 'music',
    funFact: 'The Walkman became one of the most successful consumer electronics products ever.',
  },
  {
    id: 'every_song_pocket',
    exhibit: 'Every Song You Love',
    icon: '💿',
    matchText: 'Bring your favorite songs with you everywhere.',
    tagline: 'In Your Pocket',
    description: 'The Walkman has become synonymous with portable music. Millions have already been sold worldwide.',
    sales: 'Record-breaking',
    category: 'music',
    funFact: 'The Walkman defined personal audio for a generation.',
  },
  {
    id: 'record_store',
    exhibit: 'The Record Store Experience',
    icon: '🎸',
    matchText: 'Ask your record store about the latest releases.',
    tagline: 'New Releases This Week',
    description: 'Visit your local music retailer and browse rock, country, pop, heavy metal, and soundtracks. No internet required.',
    sections: ['Rock', 'Country', 'Pop', 'Heavy Metal', 'Soundtracks'],
    category: 'music',
    funFact: 'Record stores were cultural gathering places for music fans.',
  },
  {
    id: 'album_cover_art',
    exhibit: 'Album Cover Art',
    icon: '🎨',
    matchText: 'Record stores are featuring special promotions this week.',
    tagline: 'Bigger Is Better',
    description: 'Records remain popular partly because album artwork is displayed on a full 12-inch sleeve. Compact discs can\'t compete. At least not yet.',
    advantage: '12-inch sleeve display',
    category: 'music',
    funFact: 'Album art became a significant part of the music experience.',
  },
  {
    id: 'compact_discs',
    exhibit: 'Compact Discs',
    icon: '💿',
    matchText: 'Compact discs may someday replace records.',
    tagline: 'The Future Of Music?',
    description: 'Compact discs promise no pops, no scratches, and crystal clear sound. Many consumers remain skeptical.',
    features: ['No Pops', 'No Scratches', 'Crystal Clear Sound'],
    reception: 'Skeptical',
    category: 'music',
    funFact: 'CDs were initially viewed with suspicion by dedicated record collectors.',
  },
  {
    id: 'records_disappear',
    exhibit: 'Will Records Disappear?',
    icon: '📀',
    matchText: 'Only time will tell.',
    tagline: 'Industry Debate',
    description: 'Some experts believe CDs will replace records. Others say vinyl will last forever. Only time will tell. (Everyone is wrong somehow.)',
    debate: 'Ongoing',
    category: 'music',
    humor: true,
    funFact: 'This prediction proved partially wrong-vinyl experienced a resurgence decades later.',
  },
  {
    id: 'future_arriving',
    exhibit: 'The Future Is Arriving Fast',
    icon: '⚡',
    matchText: 'The future seems to arrive faster every year.',
    tagline: '1984 Technology Report',
    description: 'In the last decade, home computers, video games, VCRs, and cable TV have all become part of everyday life.',
    innovations: ['Home Computers', 'Video Games', 'VCRs', 'Cable TV'],
    category: 'tech',
    funFact: 'The pace of technological adoption accelerated throughout the 1980s.',
  },
  {
    id: 'home_computers',
    exhibit: 'Home Computers',
    icon: '💻',
    matchText: 'Home computers continue to find their way into American households.',
    tagline: 'Not Just For Businesses Anymore',
    description: 'Popular models include the Commodore 64, Apple IIe, Atari 800XL, and IBM PCjr. Many families are buying their first computer.',
    models: ['Commodore 64', 'Apple IIe', 'Atari 800XL', 'IBM PCjr'],
    category: 'tech',
    funFact: 'Home computers were transforming from hobbyist tools to consumer products.',
  },
  {
    id: 'computer_every_home',
    exhibit: 'A Computer In Every Home?',
    icon: '🖥️',
    matchText: 'Some experts believe every home may one day have a computer.',
    tagline: 'A Bold Prediction',
    description: 'Technology analysts suggest that one day nearly every household may own a personal computer. Many readers find this difficult to believe.',
    reception: 'Skeptical but intrigued',
    category: 'tech',
    funFact: 'This prediction proved accurate, though took longer than many expected.',
  },
  {
    id: 'imagine_that',
    exhibit: 'Imagine That',
    icon: '🔮',
    matchText: 'Imagine that.',
    tagline: 'The Year 2000',
    description: 'Experts predict electronic shopping, video telephones, and computer banking could become commonplace. We\'ll see.',
    predictions: ['Electronic Shopping', 'Video Telephones', 'Computer Banking'],
    category: 'tech',
    humor: true,
    funFact: 'Some of these predictions came true; others took unexpected forms.',
  },
  {
    id: 'technology_marches',
    exhibit: 'Technology Marches On',
    icon: '🚀',
    matchText: 'Technology keeps moving forward.',
    tagline: 'What Comes Next?',
    description: 'The pace of change shows no signs of slowing. Whatever the future brings, Americans appear ready for it.',
    trend: 'Unstoppable momentum',
    category: 'tech',
    funFact: 'The 1980s set the stage for the digital revolution that followed.',
  },
  {
    id: 'baseball_eternal',
    exhibit: 'And Baseball Keeps Moving Right Along',
    icon: '⚾',
    matchText: 'And baseball keeps moving right along.',
    tagline: 'Through All The Changes',
    description: 'New computers, new music, new gadgets, new movies. But summer still means baseball. And tonight\'s game is brought to you exactly the way it always has been: one pitch at a time.',
    constant: 'Baseball endures',
    category: 'timeless',
    philosophy: true,
    funFact: 'Baseball remained the constant in a rapidly changing technological landscape.',
  },
];

// Tracking for viewed Peak 1984 exhibits
const VIEWED_EXHIBITS = new Set();
const EXHIBIT_VIEW_COUNTS = {};

/**
 * Find the Peak 1984 entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findPeak1984Entry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of a Peak 1984 exhibit. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackPeak1984View(entryId) {
  VIEWED_EXHIBITS.add(entryId);
  EXHIBIT_VIEW_COUNTS[entryId] = (EXHIBIT_VIEW_COUNTS[entryId] || 0) + 1;
  const unlocked = [];

  if (VIEWED_EXHIBITS.size >= 5) {
    unlocked.push('tech_curator');
  }
  if (VIEWED_EXHIBITS.size >= 15) {
    unlocked.push('retro_collector');
  }
  if (VIEWED_EXHIBITS.size >= 25) {
    unlocked.push('1984_historian');
  }

  return unlocked;
}

/**
 * Get count of viewed Peak 1984 exhibits.
 * @returns {number}
 */
export function getPeak1984ViewCount() {
  return VIEWED_EXHIBITS.size;
}