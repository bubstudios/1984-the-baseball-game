// Ad-Based Quest System — 1984 Baseball Simulation
// Watching specific categories of broadcast ads unlocks bonus baseball cards and achievements.
// Quests are tracked in localStorage and shown as "clue" text inside popups.

const QUEST_STORAGE_KEY = 'bb84_adQuests';

// ── Quest Definitions ──
// Each quest tracks how many ads of a given category the player has seen.
// On completion, the player earns a bonus card from a specific team.
export const AD_QUESTS = [
  {
    id: 'quest_arcade',
    name: '🕹️ Quarter Drop',
    desc: 'Visit 5 arcade or video game ads. The machines are waiting.',
    goal: 5,
    category: 'arcade',
    reward: { type: 'card', team: 'tigers', clue: 'A Motor City slugger is hiding in the coin slots.' },
    completionMsg: '🕹️ You pumped enough quarters! Bonus card awarded from the Detroit Tigers!',
  },
  {
    id: 'quest_electronics',
    name: '💾 Byte by Byte',
    desc: 'View 6 electronics or home computer ads. The future is now.',
    goal: 6,
    category: 'electronics',
    reward: { type: 'card', team: 'cubs', clue: 'A Wrigley Field hero is encoded somewhere in these circuits.' },
    completionMsg: '💾 System loaded. Bonus card awarded from the 1984 Chicago Cubs!',
  },
  {
    id: 'quest_wrestling',
    name: '🤼 Body Slam Fan',
    desc: 'Watch 4 wrestling event ads. These guys are serious athletes.',
    goal: 4,
    category: 'wrestling',
    reward: { type: 'card', team: 'royals', clue: 'A Kansas City legend delivers his finishing move in right field.' },
    completionMsg: '🤼 And the winner is... you! Bonus card from the Kansas City Royals!',
  },
  {
    id: 'quest_movies',
    name: '🎬 Popcorn Machine',
    desc: 'Watch 4 movie or TV movie ads. The lights dim. The curtain rises.',
    goal: 4,
    category: 'movies',
    reward: { type: 'card', team: 'dodgers', clue: 'A Hollywood ace is headlining the rotation.' },
    completionMsg: '🎬 Showtime! Bonus card from the Los Angeles Dodgers!',
  },
  {
    id: 'quest_charity',
    name: '🤝 Community Champion',
    desc: 'Read 5 charity or community service ads.',
    goal: 5,
    category: 'charity',
    reward: { type: 'card', team: 'phillies', clue: 'South Philadelphia thanks you. A Vet Stadium legend awaits.' },
    completionMsg: '🤝 The community appreciates you! Bonus card from the Philadelphia Phillies!',
  },
  {
    id: 'quest_tv',
    name: '📺 Couch Potato',
    desc: 'Browse 5 TV show or obscure TV ads. Channel surfing at its finest.',
    goal: 5,
    category: 'tv',
    reward: { type: 'card', team: 'mets', clue: 'A Shea Stadium hero is between the commercials.' },
    completionMsg: '📺 You stayed up past your bedtime! Bonus card from the New York Mets!',
  },
  {
    id: 'quest_vhs',
    name: '📼 Be Kind, Rewind',
    desc: 'Check out 4 VHS, Betamax, or video rental ads.',
    goal: 4,
    category: 'vhs',
    reward: { type: 'card', team: 'redsox', clue: 'A Fenway legend is on tape at the back of the store.' },
    completionMsg: '📼 Rewound and ready! Bonus card from the Boston Red Sox!',
  },
  {
    id: 'quest_psa',
    name: '🚗 Buckle Up',
    desc: 'Read 3 public service announcements or safety ads.',
    goal: 3,
    category: 'psa',
    reward: { type: 'card', team: 'orioles', clue: 'An Oriole Magic hero is doing his part for the community.' },
    completionMsg: '🚗 Safety first! Bonus card from the Baltimore Orioles!',
  },
  {
    id: 'quest_food',
    name: '🌭 Hot Dog, Hot Dog',
    desc: 'Spot 3 food or restaurant ads during the broadcast.',
    goal: 3,
    category: 'food',
    reward: { type: 'card', team: 'padres', clue: 'A San Diego closer is sizzling on the mound — just like the grill.' },
    completionMsg: '🌭 Extra mustard! Bonus card from the San Diego Padres!',
  },
  {
    id: 'quest_culture',
    name: '🕰️ 1984 Time Capsule',
    desc: 'Explore 6 Peak 1984 culture, mall culture, or Things That Scream 1984 exhibits.',
    goal: 6,
    category: 'culture',
    reward: { type: 'card', team: 'yankees', clue: 'A Bronx Bomber was there for all of it.' },
    completionMsg: '🕰️ Time capsule sealed! Bonus card from the New York Yankees!',
  },
  {
    id: 'quest_olympics',
    name: '🥇 Gold Medal Fan',
    desc: 'View 5 Olympic or NASA/space exhibits.',
    goal: 5,
    category: 'olympics',
    reward: { type: 'card', team: 'reds', clue: 'A Big Red Machine legend brought home the gold on the diamond.' },
    completionMsg: '🥇 Standing on the podium! Bonus card from the Cincinnati Reds!',
  },
  {
    id: 'quest_team_banners',
    name: '⚾ Scorecard Complete',
    desc: 'Tap 8 team-specific broadcast banners from any teams.',
    goal: 8,
    category: 'teamBanner',
    reward: { type: 'card', team: 'tigers', clue: 'A World Series champion is lurking in the sponsor boards.' },
    completionMsg: '⚾ You read every banner! Bonus card — a surprise from the 1984 Tigers!',
  },
];

// ── Category detection — maps ad types to quest categories ──
export const AD_CATEGORY_MAP = {
  // arcade / video games
  arcade: 'arcade',
  arcadeVidGame: 'arcade',
  // electronics / computers
  electronics: 'electronics',
  // wrestling
  wrestling: 'wrestling',
  nationalWrestling: 'wrestling',
  // movies
  movie: 'movies',
  tvMovie: 'movies',
  // charity / PSAs
  nationalCharity: 'charity',
  // TV shows
  obscureTv: 'tv',
  moreObscureTv: 'tv',
  moreObscureTv3: 'tv',
  nationalPromos: 'tv',
  // VHS / video rental
  vhsBetamax: 'vhs',
  // culture
  peak1984: 'culture',
  mallCulture: 'culture',
  thingsThatScream1984: 'culture',
  vanishedStores: 'culture',
  // Olympics / Space
  olympics: 'olympics',
  olympicsAthletes: 'olympics',
  nasaSpace: 'olympics',
  // team banners
  philliesBanner: 'teamBanner',
  cubsBanner: 'teamBanner',
  tigersBanner2: 'teamBanner',
  metsBanner: 'teamBanner',
  yankeesBanner: 'teamBanner',
  oriolesBanner: 'teamBanner',
  dodgersBanner: 'teamBanner',
  padresBanner: 'teamBanner',
  redsBanner: 'teamBanner',
  royalsBanner: 'teamBanner',
  detroitTigers: 'teamBanner',
  redSoxBanner: 'teamBanner',
  tigersStadium: 'teamBanner',
};

// ── Generic ad fallback keyword → category ──
const KEYWORD_CATEGORY = [
  { keywords: ['hot dog', 'pizza', 'burger', 'McDonald', 'Wendy', 'Arby', 'restaurant', 'food', 'barbecue', 'BBQ', 'grill', 'cheesesteak', 'diner', 'pancake', 'bake sale', 'blood drive'], category: 'charity' },
  { keywords: ['drive safely', 'seatbelt', 'buckle up', 'drink responsibly', 'blood pressure', 'CPR', 'Red Cross', 'health department', 'PSA', 'fire department', 'emergency'], category: 'psa' },
  { keywords: ['VCR', 'Betamax', 'video rental', 'tape', 'rewind', 'VideoDisc', 'LaserDisc', 'cassette'], category: 'vhs' },
  { keywords: ['arcade', 'quarter', 'video game', 'Atari', 'Commodore', 'Nintendo', 'ColecoVision', 'joystick', 'high score'], category: 'arcade' },
  { keywords: ['wrestling', 'Hulk Hogan', 'Wrestl', 'cage match', 'AWA', 'NWA', 'WWF', 'championship belt'], category: 'wrestling' },
  { keywords: ['movie', 'theater', 'cinema', 'film', 'starring', 'opening', 'now playing', 'The Natural'], category: 'movies' },
  { keywords: ['computer', 'IBM', 'Apple', 'Macintosh', 'software', 'floppy disk', 'modem', 'byte', 'technology', 'phone system'], category: 'electronics' },
  { keywords: ['mall', 'Kmart', 'Sears', 'JCPenney', 'Woolworth', 'back-to-school', 'back to school', 'shopping'], category: 'culture' },
  { keywords: ['library', 'reading program', 'blood drive', 'United Way', 'March of Dimes', 'Salvation Army', 'food bank', 'Philabundance', 'CHOP', 'Children\'s Hospital', 'Kiwanis', 'youth baseball', 'community'], category: 'charity' },
];

function detectGenericCategory(adText) {
  if (!adText) return null;
  for (const entry of KEYWORD_CATEGORY) {
    if (entry.keywords.some(kw => adText.toLowerCase().includes(kw.toLowerCase()))) {
      return entry.category;
    }
  }
  return null;
}

// ── Storage helpers ──
function loadQuestState() {
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return {};
}

function saveQuestState(state) {
  try {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* ignore */ }
}

export function getQuestState() {
  return loadQuestState();
}

export function getQuestProgress(questId) {
  const state = loadQuestState();
  return state[questId] || { progress: 0, completed: false };
}

export function isQuestComplete(questId) {
  return getQuestProgress(questId).completed;
}

// ── Core: Record an ad view and check for quest completion ──
// adType = one of the keys in AD_CATEGORY_MAP, or 'generic'
// adText = raw ad text (for generic fallback keyword detection)
// Returns array of { quest, justCompleted } for quests that progressed this view
export function recordAdView(adType, adText = '') {
  const category = AD_CATEGORY_MAP[adType] || detectGenericCategory(adText);
  if (!category) return [];

  const state = loadQuestState();
  const results = [];

  for (const quest of AD_QUESTS) {
    if (quest.category !== category) continue;
    if (!state[quest.id]) state[quest.id] = { progress: 0, completed: false };
    const q = state[quest.id];
    if (q.completed) continue;

    q.progress = (q.progress || 0) + 1;
    const justCompleted = q.progress >= quest.goal;
    if (justCompleted) q.completed = true;

    results.push({ quest, justCompleted, progress: q.progress });
  }

  saveQuestState(state);
  return results;
}

// ── Get clue text for a given ad type (shown at bottom of popup) ──
export function getQuestClueForAd(adType, adText = '') {
  const category = AD_CATEGORY_MAP[adType] || detectGenericCategory(adText);
  if (!category) return null;

  const state = loadQuestState();
  for (const quest of AD_QUESTS) {
    if (quest.category !== category) continue;
    const q = state[quest.id] || { progress: 0, completed: false };
    if (q.completed) continue;
    const remaining = quest.goal - (q.progress || 0);
    return {
      questName: quest.name,
      clue: quest.reward.clue,
      progress: q.progress || 0,
      goal: quest.goal,
      remaining,
    };
  }
  return null;
}

// ── Get all quests with current progress ──
export function getAllQuestProgress() {
  const state = loadQuestState();
  return AD_QUESTS.map(q => ({
    ...q,
    progress: state[q.id]?.progress || 0,
    completed: state[q.id]?.completed || false,
  }));
}