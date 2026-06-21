// Electronics & Computers interactive popups for the 1984 game experience

const ENTRIES = [
  {
    id: 'tandy_1',
    brand: 'TANDY 1000',
    icon: '🖥️',
    color: '#4ade80',
    matchText: 'Visit Radio Shack and see the new Tandy 1000 personal computer.',
    title: 'The New Tandy 1000',
    body: `Radio Shack introduces the Tandy 1000 personal computer. Featuring an Intel 8088 processor, IBM PC compatibility, color graphics, and the DeskMate software package, the Tandy 1000 is designed for both home and business users.

Write letters, manage finances, or learn programming on one versatile machine.

Suggested retail price starts around $1,199.`,
  },
  {
    id: 'tandy_2',
    brand: 'TANDY 1000',
    icon: '🖥️',
    color: '#4ade80',
    matchText: 'The Tandy 1000 is available now at your neighborhood Radio Shack.',
    title: 'What The Experts Are Saying',
    body: `"A strong contender in the growing home computer market." — PC Magazine

"Excellent graphics and sound capabilities for a home-oriented PC." — Popular Computing

The Tandy 1000 combines affordability with compatibility and has quickly become one of Radio Shack's most successful computer launches.`,
  },
  {
    id: 'tandy_3',
    brand: 'TANDY 1000',
    icon: '🖥️',
    color: '#4ade80',
    matchText: 'Bring home the power of personal computing with the Tandy 1000.',
    title: 'Expand Your System',
    body: `Available accessories include:

• CM-5 Color Monitor
• DMP-130 Dot Matrix Printer
• Daisy Wheel Printer
• External Disk Drives
• Modems
• Memory Upgrades
• Joysticks

Build the computer system that grows with your family.`,
  },
  {
    id: 'tandy_4',
    brand: 'TANDY 1000',
    icon: '🖥️',
    color: '#4ade80',
    matchText: 'The Tandy 1000. A smart choice for work and home.',
    title: 'Business Software',
    body: `Popular programs available:

• Lotus 1-2-3
• Microsoft Multiplan
• WordStar
• dBASE II
• DeskMate

The Tandy 1000 helps manage schedules, spreadsheets, letters, and inventory.`,
  },
  {
    id: 'radioshack_1',
    brand: 'RADIO SHACK',
    icon: '📻',
    color: '#f87171',
    matchText: 'Radio Shack has everything from computers to batteries.',
    title: 'More Than Computers',
    body: `While you're visiting Radio Shack, be sure to see:

• CB Radios
• Cordless Phones
• Walkie-Talkies
• Stereo Systems
• Batteries
• Alarm Clocks
• Electronic Parts
• Remote-Control Cars

Radio Shack. America's technology store.`,
  },
  {
    id: 'c64_1',
    brand: 'COMMODORE 64',
    icon: '💾',
    color: '#60a5fa',
    matchText: "See the Commodore 64, one of America's most popular home computers.",
    title: "America's Best-Selling Home Computer",
    body: `With 64K RAM, advanced graphics, and powerful sound, the Commodore 64 continues to dominate the home computer market. More software is available for the Commodore 64 than any other personal computer.

Street prices often range between $199-$299.`,
  },
  {
    id: 'c64_2',
    brand: 'COMMODORE 64',
    icon: '💾',
    color: '#60a5fa',
    matchText: 'The Commodore 64 can help with education, business, and entertainment.',
    title: 'Hot Games For 1984',
    body: `Popular Commodore titles include:

• Summer Games
• Impossible Mission
• Bruce Lee
• Jumpman
• Beach Head
• Spy Hunter
• Pitstop II

Bring the arcade home.`,
  },
  {
    id: 'c64_3',
    brand: 'COMMODORE 64',
    icon: '💾',
    color: '#60a5fa',
    matchText: 'Ask your local dealer about the Commodore 64.',
    title: 'Learn BASIC Programming',
    body: `Every Commodore 64 includes BASIC programming language.

Thousands of students are learning:

• Programming
• Mathematics
• Problem Solving
• Computer Design

The computer that teaches while it entertains.`,
  },
  {
    id: 'atari_1',
    brand: 'ATARI',
    icon: '🕹️',
    color: '#fbbf24',
    matchText: 'Atari brings arcade excitement right into your living room.',
    title: 'Arcade Action At Home',
    body: `Defender. Centipede. Pole Position. Ms. Pac-Man.

Atari brings the excitement of the arcade directly into your living room. See the latest Atari consoles and computers at participating dealers nationwide.`,
  },
  {
    id: 'atari_2',
    brand: 'ATARI 800XL',
    icon: '🕹️',
    color: '#fbbf24',
    matchText: 'Enjoy your favorite Atari games at home.',
    title: 'Serious Computing. Serious Fun.',
    body: `Featuring:

• 64K RAM
• ANTIC Graphics Processor
• Four-Channel Sound
• Cartridge & Disk Support

Suggested retail price approximately $399, with promotional pricing available from many dealers.`,
  },
  {
    id: 'atari_3',
    brand: 'ATARI 800XL',
    icon: '🕹️',
    color: '#fbbf24',
    matchText: 'The Atari 800XL is available now.',
    title: 'Great Atari Software',
    body: `Popular titles include:

• Star Raiders
• M.U.L.E.
• Seven Cities of Gold
• Rescue on Fractalus
• Eastern Front 1941

See why Atari owners keep expanding their collections.`,
  },
  {
    id: 'apple_1',
    brand: 'APPLE IIe',
    icon: '🍎',
    color: '#a78bfa',
    matchText: 'Discover the future with the Apple IIe.',
    title: 'The Classroom Computer',
    body: `More schools use Apple computers than any other educational platform.

Students are learning:

• Math
• Science
• Writing
• Programming

The Apple IIe continues to shape the future of education.`,
  },
  {
    id: 'apple_2',
    brand: 'APPLE IIe',
    icon: '🍎',
    color: '#a78bfa',
    matchText: 'Apple IIe computers are helping students and businesses nationwide.',
    title: 'Business Computing',
    body: `Available software includes:

• AppleWorks
• VisiCalc
• Financial Planner
• Inventory Management Systems

The Apple IIe is equally at home in classrooms and offices.`,
  },
  {
    id: 'apple_3',
    brand: 'APPLE IIe',
    icon: '🍎',
    color: '#a78bfa',
    matchText: 'The future is here with the Apple IIe.',
    title: 'The Future Is Here',
    body: `The Apple IIe offers reliability, expandability, and one of the largest software libraries available today.

Suggested retail price around $1,395.

Apple. The personal computer leader.`,
  },
  {
    id: 'vhs_1',
    brand: 'VHS RECORDERS',
    icon: '📼',
    color: '#f472b6',
    matchText: 'Pick up a new VHS recorder and enjoy movies at home.',
    title: 'Record Your Favorite Shows',
    body: `Never miss Dallas, Cheers, Miami Vice, or Johnny Carson again.

Modern VHS recorders allow:

• Scheduled Recording
• Pause & Review
• Timer Recording
• Remote Operation

The future of television is here.`,
  },
  {
    id: 'vhs_2',
    brand: 'VHS RENTALS',
    icon: '📼',
    color: '#f472b6',
    matchText: 'Ask about VHS rentals at your local video store.',
    title: "This Week's Popular Rentals",
    body: `Available at participating video stores:

• Raiders of the Lost Ark
• WarGames
• Superman III
• Return of the Jedi
• The Natural

Please rewind before returning.`,
  },
  {
    id: 'vcr_1',
    brand: 'VCR TECHNOLOGY',
    icon: '📼',
    color: '#f472b6',
    matchText: 'More Americans than ever are bringing home VCRs.',
    title: 'Program Your Recorder',
    body: `New VCRs feature:

• 14-Day Timers
• One-Touch Recording
• Wireless Remotes
• Cable Compatibility

Convenience has never been easier.`,
  },
  {
    id: 'camcorder_1',
    brand: 'CAMCORDERS',
    icon: '📹',
    color: '#fb923c',
    matchText: 'Capture family memories with a new camcorder.',
    title: 'Capture Family Memories',
    body: `Portable camcorders allow families to record:

• Vacations
• Birthdays
• Weddings
• Sporting Events

Turn everyday moments into lasting memories.`,
  },
  {
    id: 'sony_1',
    brand: 'SONY',
    icon: '📺',
    color: '#2dd4bf',
    matchText: 'Sony electronics continue to lead the way in innovation.',
    title: 'Innovation From Sony',
    body: `Sony continues to lead the electronics industry with:

• Trinitron Televisions
• Walkman Players
• Stereo Systems
• VHS Equipment

Quality and innovation since 1946.`,
  },
  {
    id: 'panasonic_1',
    brand: 'PANASONIC',
    icon: '📻',
    color: '#e879f9',
    matchText: 'Panasonic brings quality electronics into your home.',
    title: 'Built For Reliability',
    body: `Panasonic products are known for:

• Long Life
• Clear Sound
• Durable Construction
• Advanced Features

See the latest Panasonic equipment today.`,
  },
  {
    id: 'stereo_1',
    brand: 'HOME STEREO',
    icon: '🔊',
    color: '#38bdf8',
    matchText: 'Upgrade your stereo system this weekend.',
    title: 'Bring The Concert Home',
    body: `Modern stereo systems deliver:

• Dual Cassette Decks
• Graphic Equalizers
• Powerful Speakers
• AM/FM Tuners

Enjoy concert-quality sound in your own living room.`,
  },
  {
    id: 'fm_1',
    brand: 'FM STEREO',
    icon: '📡',
    color: '#38bdf8',
    matchText: 'Bring concert-quality sound into your living room.',
    title: 'Crystal Clear Sound',
    body: `Today's stereo receivers provide:

• Digital Tuning
• Improved Reception
• Powerful Amplification
• Rich Audio Reproduction

Hear your favorite music like never before.`,
  },
  {
    id: 'cassette_1',
    brand: 'CASSETTE PLAYERS',
    icon: '🎵',
    color: '#facc15',
    matchText: "Enjoy crystal-clear FM stereo with today's latest equipment.",
    title: 'Music On The Move',
    body: `Portable cassette players let you enjoy music anywhere.

Popular artists this year include:

• Prince
• Bruce Springsteen
• Van Halen
• Cyndi Lauper
• Huey Lewis & The News

Take your music with you.`,
  },
  {
    id: 'audio_1',
    brand: 'HOME AUDIO',
    icon: '🎧',
    color: '#34d399',
    matchText: 'Ask your electronics dealer about the newest cassette players.',
    title: 'Complete Your Sound System',
    body: `Available accessories include:

• Speaker Stands
• Equalizers
• Headphones
• Blank Cassettes
• Cleaning Kits

Everything you need for the perfect listening experience.`,
  },
  {
    id: 'walkman_1',
    brand: 'SONY WALKMAN',
    icon: '🎧',
    color: '#2dd4bf',
    matchText: 'Portable music has never sounded better.',
    title: 'Portable Music Has Never Sounded Better',
    body: `The Sony Walkman revolution continues.

Features:

• Lightweight Design
• Stereo Headphones Included
• Long Battery Life
• Compact Cassette Playback

Typical prices range from $79-$149 depending on model.

More than a cassette player. It's a lifestyle.`,
  },
];

// Tracking for viewed electronics ads and achievement triggers
const VIEWED_ADS = new Set();

/**
 * Find the electronics entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findElectronicsEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Get an electronics entry by ID.
 * @param {string} id
 * @returns {object|null}
 */
export function getElectronicsEntry(id) {
  return ENTRIES.find(e => e.id === id) || null;
}

/**
 * Track a view of an electronics ad. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @returns {string[]}
 */
export function trackElectronicsView(entryId) {
  VIEWED_ADS.add(entryId);
  const unlocked = [];

  // Achievement: viewed first electronics ad
  if (VIEWED_ADS.size === 1) {
    unlocked.push('tech_enthusiast');
  }

  // Achievement: viewed 10 electronics ads
  if (VIEWED_ADS.size >= 10) {
    unlocked.push('gadget_guru');
  }

  // Achievement: viewed all 25 electronics ads
  if (VIEWED_ADS.size >= 25) {
    unlocked.push('computer_kid');
  }

  return unlocked;
}

/**
 * Get count of viewed electronics ads.
 * @returns {number}
 */
export function getElectronicsViewCount() {
  return VIEWED_ADS.size;
}

/**
 * Check if a specific entry has been viewed.
 * @param {string} entryId
 * @returns {boolean}
 */
export function hasElectronicsBeenViewed(entryId) {
  return VIEWED_ADS.has(entryId);
}