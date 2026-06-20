// TV Guide synopsis tracking & achievements
import { TV_SYNOPSES } from './tvGuideData';

const STORAGE_KEY = 'tvGuide1984_synopses';
const ACHIEVEMENTS_KEY = 'tvGuide1984_achievements';

// ── Persistent storage helpers ──
function getSynopses() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}

function saveSynopses(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function getAchievements() {
  try { return JSON.parse(localStorage.getItem(ACHIEVEMENTS_KEY) || '[]'); } catch { return []; }
}

function saveAchievement(id) {
  try {
    const list = getAchievements();
    if (!list.includes(id)) { list.push(id); localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(list)); }
  } catch {}
}

// ── Show name key → achievement ID map ──
const SHOW_ACHIEVEMENTS = {
  "Miami Vice": { id: 'miami_heat', label: 'Miami Heat' },
  "Magnum P.I.": { id: 'magnum_mania', label: 'Magnum Mania' },
  "The A-Team": { id: 'plan_comes_together', label: 'I Love It When A Plan Comes Together' },
  "Cheers": { id: 'everybody_knows', label: 'Everybody Knows Your Name' },
  "Night Court": { id: 'court_in_session', label: 'Court Is In Session' },
  "Family Ties": { id: 'alex_keaton', label: 'Alex P. Keaton Fan Club' },
  "Simon & Simon": { id: 'simon_says', label: 'Simon Says' },
  "Hardcastle & McCormick": { id: 'the_coyote', label: 'The Coyote' },
  "The Fall Guy": { id: 'stuntman', label: 'Stuntman' },
  "Dallas": { id: 'oil_baron', label: 'Oil Baron' },
  "Dynasty": { id: 'carrington', label: 'Carrington Collection' },
};

// All achievement definitions
export const TV_ACHIEVEMENTS = [
  { id: 'tv_prime_time_rookie', name: 'Prime Time Rookie', desc: 'Open your first TV synopsis', icon: '📺' },
  { id: 'tv_channel_surfer', name: 'Channel Surfer', desc: 'View 25 TV synopses', icon: '📡' },
  { id: 'tv_guide_subscriber', name: 'TV Guide Subscriber', desc: 'View 50 TV synopses', icon: '📖' },
  { id: 'tv_couch_potato', name: 'Couch Potato', desc: 'View 100 TV synopses', icon: '🛋️' },
  { id: 'tv_nielsen_family', name: 'Nielsen Family', desc: 'View all 125 TV synopses', icon: '📊' },
  { id: 'tv_miami_heat', name: 'Miami Heat', desc: 'View all Miami Vice synopses', icon: '🌴' },
  { id: 'tv_magnum_mania', name: 'Magnum Mania', desc: 'View all Magnum P.I. synopses', icon: '🌺' },
  { id: 'tv_plan_comes_together', name: 'I Love It When A Plan Comes Together', desc: 'View all A-Team synopses', icon: '🚐' },
  { id: 'tv_everybody_knows', name: 'Everybody Knows Your Name', desc: 'View all Cheers synopses', icon: '🍺' },
  { id: 'tv_court_in_session', name: 'Court Is In Session', desc: 'View all Night Court synopses', icon: '⚖️' },
  { id: 'tv_alex_keaton', name: 'Alex P. Keaton Fan Club', desc: 'View all Family Ties synopses', icon: '👔' },
  { id: 'tv_simon_says', name: 'Simon Says', desc: 'View all Simon & Simon synopses', icon: '🔍' },
  { id: 'tv_the_coyote', name: 'The Coyote', desc: 'View all Hardcastle & McCormick synopses', icon: '🏎️' },
  { id: 'tv_stuntman', name: 'Stuntman', desc: 'View all Fall Guy synopses', icon: '🎬' },
  { id: 'tv_oil_baron', name: 'Oil Baron', desc: 'View all Dallas synopses', icon: '🛢️' },
  { id: 'tv_carrington', name: 'Carrington Collection', desc: 'View all Dynasty synopses', icon: '💎' },
  { id: 'tv_rabbit_ears', name: 'Rabbit Ears', desc: 'View synopses from NBC, CBS, and ABC', icon: '🐰' },
  { id: 'tv_clark_behb', name: 'Clark & Behb Client', desc: 'Find the Clark & Behb Detective Agency easter egg', icon: '🕵️' },
  { id: 'tv_carmage', name: 'Carmage Unleashed', desc: 'Find the Carmage easter egg', icon: '💥' },
];

// ── Track a synopsis view and check for new achievements ──
export function trackSynopsisView(showName, bannerIndex, easterEgg) {
  const synopses = getSynopses();
  const key = `${showName}::${bannerIndex}`;
  if (synopses.includes(key)) return []; // Already viewed

  synopses.push(key);
  saveSynopses(synopses);

  const unlocked = [];
  const totalViews = synopses.length;

  // Count-based achievements
  if (totalViews >= 1) unlockOrAdd('tv_prime_time_rookie', unlocked);
  if (totalViews >= 25) unlockOrAdd('tv_channel_surfer', unlocked);
  if (totalViews >= 50) unlockOrAdd('tv_guide_subscriber', unlocked);
  if (totalViews >= 100) unlockOrAdd('tv_couch_potato', unlocked);
  if (totalViews >= 125) unlockOrAdd('tv_nielsen_family', unlocked);

  // Show-specific achievements — check if all synopses for this show are viewed
  const showKey = SHOW_ACHIEVEMENTS[showName];
  if (showKey) {
    // Count how many banners belong to this show
    const totalForShow = Object.values(TV_SYNOPSES).filter(s => s.show === showName).length * 5;
    const viewedForShow = synopses.filter(s => s.startsWith(showName + '::')).length;
    if (viewedForShow >= totalForShow) {
      unlockOrAdd('tv_' + showKey.id, unlocked);
    }
  }

  // Network-based achievement (NBC, CBS, ABC)
  const viewedShows = new Set(synopses.map(s => {
    const parts = s.split('::');
    const idx = parseInt(parts[1]);
    return TV_SYNOPSES[idx]?.network;
  }).filter(Boolean));
  if (viewedShows.has('NBC') && viewedShows.has('CBS') && viewedShows.has('ABC')) {
    unlockOrAdd('tv_rabbit_ears', unlocked);
  }

  // Easter eggs
  if (easterEgg === 'Clark & Behb') unlockOrAdd('tv_clark_behb', unlocked);
  if (easterEgg === 'Carmage') unlockOrAdd('tv_carmage', unlocked);

  return unlocked;
}

function unlockOrAdd(id, unlocked) {
  const existing = getAchievements();
  if (!existing.includes(id) && !unlocked.includes(id)) {
    saveAchievement(id);
    unlocked.push(id);
  }
}

export function hasSynopsisBeenViewed(showName, bannerIndex) {
  const synopses = getSynopses();
  return synopses.includes(`${showName}::${bannerIndex}`);
}

export function getSynopsisCount() {
  return getSynopses().length;
}

export function getUnlockedTVCount() {
  return getAchievements().length;
}

export function isAchievementUnlocked(id) {
  return getAchievements().includes(id);
}