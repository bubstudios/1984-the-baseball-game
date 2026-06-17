// Achievement definitions for 1984: The Baseball Season
// Each achievement has an id, name, description, icon (emoji), and category

export const ACHIEVEMENTS = [
  // --- BATTING ---
  {
    id: 'first_hit',
    name: 'First Hit',
    desc: 'Record your first base hit',
    icon: '🪶',
    category: 'batting',
  },
  {
    id: 'going_yard',
    name: 'Going Yard',
    desc: 'Hit a home run',
    icon: '🚀',
    category: 'batting',
  },
  {
    id: 'grand_salami',
    name: 'Grand Salami',
    desc: 'Hit a grand slam',
    icon: '🧹',
    category: 'batting',
  },
  {
    id: 'back_to_back',
    name: 'Back-to-Back',
    desc: 'Hit home runs with consecutive batters',
    icon: '💥',
    category: 'batting',
  },
  {
    id: 'multi_hr',
    name: 'Multi-Homer Game',
    desc: 'Hit 2+ home runs with one player',
    icon: '💣',
    category: 'batting',
  },
  {
    id: 'three_hit_game',
    name: 'Three-Hit Game',
    desc: 'One of your players gets 3+ hits',
    icon: '🎯',
    category: 'batting',
  },
  {
    id: 'four_hit_game',
    name: 'Four-Hit Game',
    desc: 'One of your players gets 4+ hits',
    icon: '🔥',
    category: 'batting',
  },
  {
    id: 'walk_off',
    name: 'Walk-Off Winner',
    desc: 'Win the game in the bottom of the 9th (or later)',
    icon: '🎉',
    category: 'batting',
  },
  {
    id: 'lead_off_hr',
    name: 'Leadoff Launch',
    desc: 'Hit a home run with the first batter of the game',
    icon: '⚡',
    category: 'batting',
  },
  {
    id: 'bases_clearing',
    name: 'Bases Juiced Hit',
    desc: 'Get a hit that clears the bases',
    icon: '🧃',
    category: 'batting',
  },
  {
    id: 'pinch_hit_hero',
    name: 'Pinch Hit Hero',
    desc: 'Get a hit with a pinch hitter',
    icon: '🦸',
    category: 'batting',
  },
  {
    id: 'small_ball',
    name: 'Small Ball',
    desc: 'Successfully bunt for a hit',
    icon: '🏓',
    category: 'batting',
  },
  {
    id: 'batting_around',
    name: 'Batting Around',
    desc: 'Score 5+ runs in a single inning',
    icon: '🎠',
    category: 'batting',
  },

  // --- PITCHING ---
  {
    id: 'first_k',
    name: 'First Strikeout',
    desc: 'Record your first strikeout',
    icon: '🤏',
    category: 'pitching',
  },
  {
    id: 'double_digit_k',
    name: 'Double-Digit K\'s',
    desc: 'One of your pitchers records 10+ strikeouts',
    icon: '💨',
    category: 'pitching',
  },
  {
    id: 'shutout',
    name: 'Shutout',
    desc: 'Hold the opponent scoreless for the entire game',
    icon: '🔒',
    category: 'pitching',
  },
  {
    id: 'perfect_frame',
    name: 'Perfect Frame',
    desc: 'Record a 1-2-3 inning',
    icon: '✅',
    category: 'pitching',
  },
  {
    id: 'strand_em',
    name: 'Strand \'Em',
    desc: 'Escape a bases-loaded jam without allowing a run',
    icon: '🧵',
    category: 'pitching',
  },
  {
    id: 'double_play_ball',
    name: 'Twin Killing',
    desc: 'Induce a double play',
    icon: '✂️',
    category: 'pitching',
  },
  {
    id: 'iron_man',
    name: 'Iron Man',
    desc: 'Have a pitcher throw a complete game (9 IP)',
    icon: '🦾',
    category: 'pitching',
  },

  // --- BASERUNNING ---
  {
    id: 'stolen_base',
    name: 'Swiped Bag',
    desc: 'Successfully steal a base',
    icon: '🏃',
    category: 'running',
  },
  {
    id: 'stealing_home',
    name: 'Stealing Home',
    desc: 'Successfully steal home plate',
    icon: '🏠',
    category: 'running',
  },

  // --- GAME ---
  {
    id: 'comeback_win',
    name: 'Comeback Kid',
    desc: 'Win after trailing by 3+ runs',
    icon: '🔄',
    category: 'game',
  },
  {
    id: 'blowout_win',
    name: 'Blowout',
    desc: 'Win by 5+ runs',
    icon: '🌊',
    category: 'game',
  },
  {
    id: 'extra_innings',
    name: 'Extra Innings',
    desc: 'Play a game that goes past 9 innings',
    icon: '⏰',
    category: 'game',
  },
  {
    id: 'nail_biter',
    name: 'Nail-Biter',
    desc: 'Win by exactly 1 run',
    icon: '😬',
    category: 'game',
  },
  {
    id: 'first_win',
    name: 'First Win',
    desc: 'Win your first game',
    icon: '🏆',
    category: 'game',
  },
];

// Load achievements from localStorage
export function loadAchievements() {
  try {
    const stored = localStorage.getItem('bb84_achievements');
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return {};
}

// Save achievements to localStorage
export function saveAchievements(achievements) {
  try {
    localStorage.setItem('bb84_achievements', JSON.stringify(achievements));
  } catch (e) { /* ignore */ }
}

// Unlock an achievement — returns true if newly unlocked
export function unlockAchievement(id) {
  const achievements = loadAchievements();
  if (achievements[id]) return false; // already unlocked
  achievements[id] = Date.now();
  saveAchievements(achievements);
  return true;
}

// Check if an achievement is unlocked
export function isUnlocked(id) {
  const achievements = loadAchievements();
  return !!achievements[id];
}

// Get total unlocked count
export function getUnlockedCount() {
  const achievements = loadAchievements();
  return Object.keys(achievements).length;
}

// Check all achievements against a completed game state
// Returns array of newly-unlocked achievement IDs
export function checkGameAchievements(gameState, userTeam = 'home') {
  const newlyUnlocked = [];
  const u = (id) => {
    if (unlockAchievement(id)) newlyUnlocked.push(id);
  };

  const userSide = userTeam === 'home' ? 'home' : 'away';
  const opponentSide = userSide === 'home' ? 'away' : 'home';
  const userScore = gameState.score[userSide];
  const opponentScore = gameState.score[opponentSide];
  const userWon = userScore > opponentScore;
  const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
  const userPitchers = [
    ...(userSide === 'home' ? [gameState.homePitcher] : [gameState.awayPitcher]),
    ...(userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []))
      .filter(p => p.gameStats?.pitches !== undefined || p.gameStats?.ip > 0),
  ];
  // Add current pitcher too if not already included
  const currentP = userSide === 'home' ? gameState.homePitcher : gameState.awayPitcher;
  if (currentP && !userPitchers.find(p => p.name === currentP.name)) {
    userPitchers.push(currentP);
  }

  // Merge all players: lineup + history
  const allUserPlayers = [...userLineup, ...(userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []))];
  const lineupNames = new Set(userLineup.map(p => p.name));
  const allPlayers = allUserPlayers.filter(p => {
    if (p.gameStats?.ab > 0 || p.gameStats?.hits > 0 || p.gameStats?.runs > 0 || p.gameStats?.rbi > 0 || p.gameStats?.hr > 0) return true;
    return lineupNames.has(p.name);
  });

  const log = gameState.log || [];
  const logText = log.map(l => l.text).join(' ');

  // --- BATTING ---
  if (allPlayers.some(p => p.gameStats?.hits > 0)) u('first_hit');
  if (allPlayers.some(p => p.gameStats?.hr > 0)) u('going_yard');
  if (logText.includes('GRAND SLAM')) u('grand_salami');
  if (logText.includes('back-to-back')) u('back_to_back');
  if (allPlayers.some(p => p.gameStats?.hr >= 2)) u('multi_hr');
  if (allPlayers.some(p => p.gameStats?.hits >= 3)) u('three_hit_game');
  if (allPlayers.some(p => p.gameStats?.hits >= 4)) u('four_hit_game');

  // Walk-off: user won and game ended in bottom 9+
  const walkOffLog = logText.includes('Walk-off') || logText.includes('walk-off');
  if (userWon && walkOffLog) u('walk_off');

  // Leadoff HR: check if first batter of the game hit a HR
  const firstBatter = userLineup[0];
  if (firstBatter?.gameStats?.hr > 0 && userSide !== (gameState.halfInning === 'top' ? 'away' : 'home')) {
    // First batter's team must be the away team (bats first) — check if their HR was in the 1st inning
    // Simplified: if firstBatter has a HR and was the first batter, check log
    if (logText.includes(firstBatter.name.split(' ').pop()) && logText.includes('HOME RUN') && logText.includes('inning 1')) {
      u('lead_off_hr');
    }
  }
  // Simpler: just check if first batter has a HR and the game started with them
  if (firstBatter?.gameStats?.hr >= 1) {
    // Heuristic: if user is away team (bats first) and has HR
    const userBatsFirst = userTeam === 'away';
    if (userBatsFirst) u('lead_off_hr');
  }

  if (logText.includes('clears the bases')) u('bases_clearing');
  if (logText.includes('pinch-hits')) u('pinch_hit_hero');
  if (logText.includes('bunt single')) u('small_ball');

  // Batting around: 5+ runs in an inning
  const inningScores = gameState.innings || [];
  if (inningScores.some(inn => (inn[userSide] || 0) >= 5)) u('batting_around');

  // --- PITCHING ---
  if (userPitchers.some(p => (p.gameStats?.so || 0) > 0)) u('first_k');
  if (userPitchers.some(p => (p.gameStats?.so || 0) >= 10)) u('double_digit_k');
  if (opponentScore === 0) u('shutout');
  if (logText.includes('1-2-3')) u('perfect_frame');
  if (logText.includes('gets out of the jam') || logText.includes('bases loaded') && logText.includes('no runs')) u('strand_em');
  if (logText.includes('double play')) u('double_play_ball');
  if (userPitchers.some(p => (p.gameStats?.ip || 0) >= 9)) u('iron_man');

  // --- BASERUNNING ---
  if (allPlayers.some(p => (p.gameStats?.sb || 0) > 0)) u('stolen_base');
  if (logText.includes('steals home')) u('stealing_home');

  // --- GAME ---
  // Comeback: user trailed by 3+ at some point and won
  const maxDeficit = computeMaxDeficit(gameState, userSide);
  if (userWon && maxDeficit >= 3) u('comeback_win');
  if (userWon && (userScore - opponentScore) >= 5) u('blowout_win');
  if (gameState.inning > 9) u('extra_innings');
  if (userWon && (userScore - opponentScore) === 1) u('nail_biter');
  if (userWon) u('first_win');

  return newlyUnlocked;
}

// Compute the maximum deficit the user faced during the game
function computeMaxDeficit(gameState, userSide) {
  const oppSide = userSide === 'home' ? 'away' : 'home';
  const innings = gameState.innings || [];
  let userTotal = 0;
  let oppTotal = 0;
  let maxDeficit = 0;

  for (let i = 0; i < innings.length; i++) {
    const inn = innings[i];
    if (inn[userSide] !== null) userTotal += inn[userSide];
    if (inn[oppSide] !== null) oppTotal += inn[oppSide];
    const deficit = oppTotal - userTotal;
    if (deficit > maxDeficit) maxDeficit = deficit;
  }
  return maxDeficit;
}