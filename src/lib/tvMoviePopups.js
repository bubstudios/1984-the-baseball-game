// TV Movie interactive popups for the 1984 game experience
// 5 entries: 3 single popups (511-513) + 2 randomizers (514: 10 real movies, 515: 10 fictional + 1 ultra-rare)

const ENTRIES = [
  // ── 511: Sunday Night Movie Event ──
  {
    id: 'tv_movie_511',
    type: 'single',
    matchText: 'Sunday night features a special made-for-television movie event.',
    network: 'ABC',
    networkColor: '#e11d48',
    icon: '🎬',
    badge: 'SUNDAY NIGHT MOVIE',
    title: 'ABC Sunday Night Movie',
    subtitle: 'Special Television Presentation',
    body: `This Sunday at 8:00 PM, gather the family for a major television movie event.

Before streaming, before cable channels dedicated to movies, network television premieres were often among the biggest entertainment events of the year.

Viewers across America will tune in simultaneously for a special presentation featuring Hollywood stars, big production values, and a story you won't want to miss.`,
    funFact: "In 1984, a successful television movie could attract 30–50 million viewers. That's more than many theatrical films ever reached.",
    quote: 'A Special Television Event.',
  },

  // ── 512: The Burning Bed ──
  {
    id: 'tv_movie_512',
    type: 'single',
    matchText: 'Don\'t miss "The Burning Bed" starring Farrah Fawcett.',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🔥',
    badge: 'WORLD PREMIERE MOVIE',
    title: 'The Burning Bed',
    subtitle: 'Farrah Fawcett delivers the performance of a lifetime',
    body: `Based on a true story, The Burning Bed tells the story of Francine Hughes, a woman trapped in an abusive marriage who reaches a breaking point.

Many viewers knew Farrah Fawcett primarily from Charlie's Angels. This dramatic role shocked audiences and critics alike, proving she was far more than a television sex symbol.

The performance earned Fawcett an Emmy nomination, a Golden Globe nomination, and critical acclaim nationwide.

The movie became one of the most discussed television events of 1984 and sparked national conversations about domestic violence.`,
    cast: ['Farrah Fawcett', 'Paul Le Mat'],
    broadcastDate: 'October 8, 1984',
    quote: 'Farrah Fawcett delivers a powerful and unforgettable performance.',
  },

  // ── 513: Special Television Presentation ──
  {
    id: 'tv_movie_513',
    type: 'single',
    matchText: 'A special television presentation airs this weekend.',
    network: 'CBS',
    networkColor: '#0ea5e9',
    icon: '📺',
    badge: 'SPECIAL PRESENTATION',
    title: 'The Network Event Everyone Will Be Talking About',
    subtitle: 'For one night only',
    body: `An all-star cast. An unforgettable story. A television event produced exclusively for network audiences.

Unlike theatrical releases, television movies are created specifically for the home viewer. That means no theater ticket required, family-friendly scheduling, commercial breaks built into the story, and event-style promotion.`,
    funFact: "Throughout the 1970s and 1980s, television movies launched the careers of dozens of future Hollywood stars.",
    quote: 'One Night. One Story. One Television Event.',
  },

  // ── 514: First Time on Network Television (randomizer: 10 real movies) ──
  {
    id: 'tv_movie_514',
    type: 'randomizer',
    matchText: 'Enjoy an evening movie from the comfort of home.',
    network: 'ABC',
    networkColor: '#e11d48',
    icon: '🎬',
    badge: 'FIRST TIME ON NETWORK TELEVISION',
    title: 'ABC Sunday Night Movie',
    movies: [
      {
        title: 'Raiders of the Lost Ark',
        icon: '🏛️',
        body: "The year's most adventurous archaeologist comes to television. Join Indiana Jones as he races Nazis around the globe in search of the legendary Ark of the Covenant.",
        cast: ['Harrison Ford', 'Karen Allen'],
        boxOffice: 'Over $200 million worldwide',
        quote: 'One of the greatest adventure films ever made.',
      },
      {
        title: 'Superman',
        icon: '🦸',
        body: "You'll believe a man can fly. The Man of Steel comes to network television for the first time in this spectacular superhero epic.",
        cast: ['Christopher Reeve', 'Margot Kidder'],
        boxOffice: 'Over $300 million worldwide',
        quote: "You'll believe a man can fly.",
      },
      {
        title: 'Rocky',
        icon: '🥊',
        body: "His whole life was a million-to-one shot. A small-time Philadelphia boxer gets a once-in-a-lifetime chance to fight the heavyweight champion of the world.",
        cast: ['Sylvester Stallone', 'Talia Shire'],
        boxOffice: 'Over $200 million worldwide',
        quote: 'His whole life was a million-to-one shot.',
      },
      {
        title: 'Jaws',
        icon: '🦈',
        body: "The terrifying movie that kept America out of the water. A great white shark terrorizes a small beach town, and the local sheriff must face his fears.",
        cast: ['Roy Scheider', 'Robert Shaw', 'Richard Dreyfuss'],
        boxOffice: 'Over $470 million worldwide',
        quote: "You're gonna need a bigger boat.",
      },
      {
        title: 'Smokey and the Bandit',
        icon: '🚚',
        body: "Bandit and Snowman haul contraband across state lines with Sheriff Buford T. Justice in hot pursuit. One of the biggest comedy hits of the decade.",
        cast: ['Burt Reynolds', 'Sally Field', 'Jackie Gleason'],
        boxOffice: 'Over $300 million worldwide',
        quote: "Bandit, you're getting a lot of tickets.",
      },
      {
        title: 'Close Encounters of the Third Kind',
        icon: '🛸',
        body: "We are not alone. An ordinary man becomes obsessed with mysterious encounters from another world after a close encounter in the Indiana countryside.",
        cast: ['Richard Dreyfuss', 'François Truffaut'],
        boxOffice: 'Over $300 million worldwide',
        quote: 'We are not alone.',
      },
      {
        title: 'Airplane!',
        icon: '✈️',
        body: "The hilarious movie that spoofed disaster films. When the crew of a commercial airliner gets sick, a traumatized ex-fighter pilot must land the plane.",
        cast: ['Robert Hays', 'Julie Hagerty', 'Leslie Nielsen'],
        boxOffice: 'Over $80 million worldwide',
        quote: "Surely you can't be serious. I am serious. And don't call me Shirley.",
      },
      {
        title: 'The Sting',
        icon: '🃏',
        body: "The greatest con movie ever made. Two grifters team up to pull off the ultimate swindle against a powerful mob boss in 1930s Chicago.",
        cast: ['Paul Newman', 'Robert Redford'],
        boxOffice: 'Over $150 million worldwide',
        quote: 'The greatest con movie ever made.',
      },
      {
        title: 'The Blues Brothers',
        icon: '🎷',
        body: "They're on a mission from God. Jake and Elwood Blues reunite their rhythm and blues band to raise money to save the orphanage where they were raised.",
        cast: ['John Belushi', 'Dan Aykroyd'],
        boxOffice: 'Over $115 million worldwide',
        quote: "They're on a mission from God.",
      },
      {
        title: 'The Muppet Movie',
        icon: '🐸',
        body: "Kermit and the gang hit the big screen in their first feature film. Follow the Muppets on a cross-country journey to Hollywood.",
        cast: ['Jim Henson', 'Frank Oz'],
        boxOffice: 'Over $65 million worldwide',
        quote: "Someday we'll find it, the rainbow connection.",
      },
    ],
  },

  // ── 515: World Premiere Television Movie (randomizer: 10 fictional + 1 ultra-rare) ──
  {
    id: 'tv_movie_515',
    type: 'randomizer',
    matchText: 'Stay tuned for a world premiere television movie.',
    network: 'NBC',
    networkColor: '#6366f1',
    icon: '🎬',
    badge: 'WORLD PREMIERE TELEVISION MOVIE',
    title: 'World Premiere Television Movie',
    movies: [
      {
        title: 'The Last Out',
        icon: '⚾',
        body: "Former major-league pitcher Jack Murphy thought his baseball career was over. When a small-town team facing financial ruin asks for help, he gets one final chance to prove himself.",
        cast: ['Robert Conrad'],
        runtime: '2 Hours',
        sponsor: 'National Chevrolet Dealers',
        quote: 'A touching sports drama for the whole family.',
      },
      {
        title: 'Midnight Freight',
        icon: '🚂',
        body: "A veteran railroad engineer discovers someone is sabotaging trains throughout the Midwest.",
        cast: ['Lee Majors'],
        quote: 'All aboard for suspense.',
      },
      {
        title: 'Hurricane Watch',
        icon: '🌀',
        body: "Meteorologists race against time to save a coastal town from a record-breaking storm.",
        cast: ['Linda Hamilton'],
        quote: 'The storm of the century is coming.',
      },
      {
        title: 'The Final Broadcast',
        icon: '📡',
        body: "A television station remains on the air during a massive national blackout.",
        cast: ['Darren McGavin'],
        quote: 'The lights went out. The story was just beginning.',
      },
      {
        title: 'Homecoming Summer',
        icon: '🏡',
        body: "A successful businessman returns to his hometown and discovers what truly matters.",
        cast: ['Tom Wopat'],
        quote: 'Sometimes you have to go back to move forward.',
      },
      {
        title: 'Code Red Chicago',
        icon: '🚨',
        body: "A bomb threat strikes downtown Chicago during rush hour. Police and firefighters race to prevent disaster.",
        cast: ['William Shatner'],
        quote: 'Every second counts.',
      },
      {
        title: 'Firestorm Mountain',
        icon: '🔥',
        body: "Trapped hikers battle a raging forest fire in the Rocky Mountains. Filmed on location.",
        quote: "Nature doesn't negotiate.",
      },
      {
        title: 'The Long Drive Home',
        icon: '🚗',
        body: "A father and son cross America after years apart. A heartwarming road movie featuring baseball, family, and second chances.",
        quote: 'The longest journeys lead home.',
      },
      {
        title: 'Dead Air',
        icon: '📻',
        body: "A late-night radio host begins receiving calls from a listener who appears to predict future crimes.",
        quote: 'Some signals should never be received.',
        warning: 'Contains suspenseful scenes.',
      },
      {
        title: 'Ninth Inning',
        icon: '⚾',
        body: "An aging catcher attempts one final season while mentoring baseball's next superstar.",
        cast: ['James Garner'],
        quote: 'One of the year\'s best sports dramas.',
      },
    ],
    ultraRareMovie: {
      title: 'The Starfighter Project',
      icon: '🛸',
      body: "Government scientists recover an object that crashes in the Nevada desert. What they discover may not be from Earth.",
      cast: ['Martin Landau'],
      quote: 'The television event of the season.',
      isUltraRare: true,
      achievementNote: 'Nobody remembers seeing this movie before. Was it real?',
    },
  },
];

// Tracking
const VIEWED_ENTRIES = new Set();
const VIEWED_514_MOVIES = new Set();
const VIEWED_515_MOVIES = new Set();

/**
 * Find the TV movie entry matching a given ad text.
 * @param {string} adText
 * @returns {object|null}
 */
export function findTvMovieEntry(adText) {
  return ENTRIES.find(e => e.matchText === adText) || null;
}

/**
 * Track a view of a TV movie popup. Returns newly unlocked achievement IDs.
 * @param {string} entryId
 * @param {string|null} movieTitle - For randomizer entries, the selected movie title
 * @returns {string[]}
 */
export function trackTvMovieView(entryId, movieTitle = null) {
  VIEWED_ENTRIES.add(entryId);
  const unlocked = [];

  if (VIEWED_ENTRIES.size >= 1) {
    unlocked.push('movie_night');
  }

  if (entryId === 'tv_movie_514' && movieTitle) {
    VIEWED_514_MOVIES.add(movieTitle);
    if (VIEWED_514_MOVIES.size >= 5) {
      unlocked.push('network_premiere');
    }
  }

  if (entryId === 'tv_movie_515' && movieTitle) {
    VIEWED_515_MOVIES.add(movieTitle);
    if (VIEWED_515_MOVIES.size >= 5) {
      unlocked.push('original_broadcast');
    }
    if (movieTitle === 'The Starfighter Project') {
      unlocked.push('lost_broadcast');
    }
  }

  return unlocked;
}