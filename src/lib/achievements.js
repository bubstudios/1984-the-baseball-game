// Achievement definitions for 1984: The Baseball Season
// Organized by category with id, name, desc, icon, and category

export const ACHIEVEMENTS = [
  // ── FIRST-TIME ──
  { id: 'play_ball', name: 'Play Ball!', desc: 'Start your first game', icon: '⚾', category: 'first' },
  { id: 'batter_up', name: 'Batter Up', desc: 'Record your first hit', icon: '🪶', category: 'first' },
  { id: 'crossed_plate', name: 'Crossed the Plate', desc: 'Score your first run', icon: '🏁', category: 'first' },
  { id: 'around_horn', name: 'Around the Horn', desc: 'Turn a double play', icon: '🔄', category: 'first' },
  { id: 'three_up_down', name: 'Three Up, Three Down', desc: 'Retire a side in order', icon: '✅', category: 'first' },
  { id: 'ballgame', name: 'Ballgame', desc: 'Win your first game', icon: '🏆', category: 'first' },

  // ── HITTING ──
  { id: 'infield_hit', name: 'Seeing Eye Single', desc: 'Get an infield hit', icon: '👀', category: 'hitting' },
  { id: 'gap_power', name: 'Gap Power', desc: 'Hit a double', icon: '⚡', category: 'hitting' },
  { id: 'legs_for_days', name: 'Legs for Days', desc: 'Hit a triple', icon: '💨', category: 'hitting' },
  { id: 'touch_em_all', name: "Touch 'Em All", desc: 'Hit a home run', icon: '🚀', category: 'hitting' },
  { id: 'rally_starter', name: 'Rally Starter', desc: 'Get 3 hits with one player', icon: '🎯', category: 'hitting' },
  { id: 'perfect_day', name: 'Perfect Day', desc: 'Go 4-for-4 with one player', icon: '💎', category: 'hitting' },
  { id: 'cycle_watch', name: 'Cycle Watch', desc: 'Record 3 different hit types with one player', icon: '🔭', category: 'hitting' },
  { id: 'the_cycle', name: 'The Cycle', desc: 'Hit for the cycle', icon: '🌟', category: 'hitting' },
  { id: 'grand_salami', name: 'Grand Salami', desc: 'Hit a grand slam', icon: '🧹', category: 'hitting' },
  { id: 'walk_off_hero', name: 'Walk-Off Hero', desc: 'Win on a walk-off hit', icon: '🎉', category: 'hitting' },

  // ── PITCHING ──
  { id: 'punchout', name: 'Punchout', desc: 'Record your first strikeout', icon: '🤏', category: 'pitching' },
  { id: 'k_artist', name: 'K Artist', desc: 'Strike out 10 batters in a game', icon: '🖌️', category: 'pitching' },
  { id: 'cruising', name: 'Cruising', desc: 'Allow 3 hits or fewer', icon: '🧊', category: 'pitching' },
  { id: 'lights_out', name: 'Lights Out', desc: 'Throw a shutout', icon: '🔒', category: 'pitching' },
  { id: 'untouchable', name: 'Untouchable', desc: 'Throw a no-hitter', icon: '👻', category: 'pitching' },
  { id: 'perfect_afternoon', name: 'Perfect Afternoon', desc: 'Throw a perfect game', icon: '✨', category: 'pitching' },
  { id: 'frozen_rope', name: 'Frozen Rope', desc: 'Strike out the side', icon: '🥶', category: 'pitching' },

  // ── DEFENSE ──
  { id: 'leather_glove', name: 'Leather Glove', desc: 'Make a diving catch (web gem)', icon: '🧤', category: 'defense' },
  { id: 'cannon_arm', name: 'Cannon Arm', desc: 'Throw out a runner at home', icon: '💪', category: 'defense' },
  { id: 'caught_stealing', name: 'Caught Stealing', desc: 'Nab a base thief', icon: '🚫', category: 'defense' },
  { id: 'twin_killing', name: 'Twin Killing', desc: 'Turn a double play', icon: '✂️', category: 'defense' },
  { id: 'around_horn_dp', name: 'Around the Horn', desc: 'Turn a 5-4-3 or 6-4-3 double play', icon: '🔃', category: 'defense' },
  { id: 'web_gem', name: 'Web Gem', desc: 'Rob a home run', icon: '🕸️', category: 'defense' },

  // ── COMEBACKS ──
  { id: 'never_quit', name: 'Never Quit', desc: 'Win after trailing by 3', icon: '🦾', category: 'comeback' },
  { id: 'cardiac_kids', name: 'Cardiac Kids', desc: 'Win after trailing by 5', icon: '💓', category: 'comeback' },
  { id: 'last_chance', name: 'Last Chance', desc: 'Win in the final inning', icon: '⏳', category: 'comeback' },
  { id: 'extra_baseball', name: 'Extra Baseball', desc: 'Win in extra innings', icon: '⏰', category: 'comeback' },
  { id: 'bottom_ninth', name: 'Bottom of the Ninth', desc: 'Walk-off victory', icon: '🎭', category: 'comeback' },

  // ── FUNNY / HIDDEN ──
  { id: 'golden_sombrero', name: 'Golden Sombrero', desc: 'Strike out 4 times with one batter', icon: '🤠', category: 'funny' },
  { id: 'silver_sombrero', name: 'Silver Sombrero', desc: 'Strike out 3 times with one batter', icon: '🎩', category: 'funny' },
  { id: 'oops', name: 'Oops', desc: 'Commit 3 errors in a game', icon: '😬', category: 'funny' },
  { id: 'little_league', name: 'Little League Baseball', desc: 'Score on an error', icon: '🦋', category: 'funny' },
  { id: 'free_baseball', name: 'Free Baseball', desc: 'Reach the 15th inning', icon: '🆓', category: 'funny' },
  { id: 'rain_delay_ach', name: 'Rain Delay', desc: 'Pause the game for 10 minutes', icon: '🌧️', category: 'funny' },
  { id: 'beanball', name: 'Beanball', desc: 'Hit 3 batters in one game', icon: '🎯', category: 'funny' },
  { id: 'mendoza_line', name: 'The Mendoza Line', desc: 'Win despite getting only 3 hits', icon: '📉', category: 'funny' },
  { id: 'how_ach', name: 'How?!', desc: 'Lose despite out-hitting your opponent by 10', icon: '🤷', category: 'funny' },

  // ── 1984-THEMED ──
  { id: 'like_its_1984', name: "Like It's 1984", desc: 'Complete a game using 1984 teams', icon: '📼', category: '1984' },
  { id: 'small_ball', name: 'Small Ball', desc: 'Score a run without a hit', icon: '🏓', category: '1984' },
  { id: 'whitey_ball', name: 'Whitey Ball', desc: 'Steal 5 bases in a game', icon: '🏃', category: '1984' },
  { id: 'the_wizard', name: 'The Wizard', desc: 'Make 10 assists with your shortstop', icon: '🧙', category: '1984' },
  { id: 'power_surge', name: 'Power Surge', desc: 'Hit 4 team home runs', icon: '💥', category: '1984' },
  { id: 'ace_of_staff', name: 'Ace of the Staff', desc: 'Complete a game with your starting pitcher', icon: '🃏', category: '1984' },
  { id: 'workhorse', name: 'Workhorse', desc: 'Throw 140+ pitches with one pitcher', icon: '🐴', category: '1984' },
  { id: 'old_school', name: 'Old School Manager', desc: 'Win without making a pitching change', icon: '👴', category: '1984' },
  { id: 'one_pitch_wonder', name: 'One-Pitch Wonder', desc: 'Complete a game using only one type of pitch', icon: '🌀', category: '1984' },

  // ── VERY RARE ──
  { id: 'twenty_one_guns', name: '21 Guns', desc: 'Score 21 runs in a game', icon: '🔫', category: 'rare' },
  { id: 'mercy', name: 'Mercy?', desc: 'Win by 15 runs', icon: '🩸', category: 'rare' },
  { id: 'immaculate', name: 'Immaculate Inning', desc: '3 strikeouts on 9 pitches', icon: '😇', category: 'rare' },
  { id: 'four_bagger_frenzy', name: 'Four-Bagger Frenzy', desc: 'Hit 5 home runs in a game', icon: '💣', category: 'rare' },
  { id: 'no_doubter', name: 'No Doubter', desc: 'Hit a 500-foot home run', icon: '📏', category: 'rare' },
  { id: 'mr_perfect', name: 'Mr. Perfect', desc: 'Perfect game with 10+ strikeouts', icon: '💫', category: 'rare' },

  // ── GAMES COMPLETED ──
  { id: 'games_1', name: 'First Pitch', desc: 'Complete 1 game', icon: '1️⃣', category: 'milestone', threshold: 1 },
  { id: 'games_2', name: 'Doubleheader', desc: 'Complete 2 games', icon: '2️⃣', category: 'milestone', threshold: 2 },
  { id: 'games_10', name: 'Homestand', desc: 'Complete 10 games', icon: '🔟', category: 'milestone', threshold: 10 },
  { id: 'games_25', name: 'Road Warrior', desc: 'Complete 25 games', icon: '🛣️', category: 'milestone', threshold: 25 },
  { id: 'games_50', name: 'Season Ticket Holder', desc: 'Complete 50 games', icon: '🎟️', category: 'milestone', threshold: 50 },
  { id: 'games_100', name: 'Everyday Player', desc: 'Complete 100 games', icon: '💯', category: 'milestone', threshold: 100 },
  { id: 'games_250', name: 'Iron Man', desc: 'Complete 250 games', icon: '🦿', category: 'milestone', threshold: 250 },
  { id: 'games_500', name: 'Hall of Fame Career', desc: 'Complete 500 games', icon: '🏛️', category: 'milestone', threshold: 500 },
  { id: 'games_1000', name: 'Baseball Addict', desc: 'Complete 1,000 games', icon: '🤯', category: 'milestone', threshold: 1000 },

  // ── TIME PLAYED (in minutes) ──
  { id: 'time_60', name: 'Warming Up', desc: '1 hour played', icon: '🕐', category: 'milestone', threshold: 60 },
  { id: 'time_420', name: 'Seventh Inning Stretch', desc: '7 hours played', icon: '🎶', category: 'milestone', threshold: 420 },
  { id: 'time_1500', name: 'Extra Innings', desc: '25 hours played', icon: '⏱️', category: 'milestone', threshold: 1500 },
  { id: 'time_3000', name: 'Clubhouse Veteran', desc: '50 hours played', icon: '🛋️', category: 'milestone', threshold: 3000 },
  { id: 'time_6000', name: 'Baseball Lifer', desc: '100 hours played', icon: '🧓', category: 'milestone', threshold: 6000 },
  { id: 'time_15000', name: 'Living at the Ballpark', desc: '250 hours played', icon: '🏟️', category: 'milestone', threshold: 15000 },
  { id: 'time_30000', name: 'Commissioner for Life', desc: '500 hours played', icon: '👑', category: 'milestone', threshold: 30000 },

  // ── WINS ──
  { id: 'wins_1', name: 'First Victory', desc: 'Win 1 game', icon: '🥇', category: 'milestone', threshold: 1 },
  { id: 'wins_10', name: 'Winning Ballclub', desc: 'Win 10 games', icon: '📈', category: 'milestone', threshold: 10 },
  { id: 'wins_50', name: 'Above .500', desc: 'Win 50 games', icon: '⚖️', category: 'milestone', threshold: 50 },
  { id: 'wins_100', name: 'Pennant Contender', desc: 'Win 100 games', icon: '🏴', category: 'milestone', threshold: 100 },
  { id: 'wins_500', name: 'Franchise Legend', desc: 'Win 500 games', icon: '🏅', category: 'milestone', threshold: 500 },

  // ── TEAMS USED ──
  { id: 'teams_2', name: 'New Uniform', desc: 'Use 2 different teams', icon: '👕', category: 'milestone', threshold: 2 },
  { id: 'teams_10', name: 'World Traveler', desc: 'Use 10 different teams', icon: '🌍', category: 'milestone', threshold: 10 },
  { id: 'teams_15', name: 'Club Collector', desc: 'Use 15 different teams', icon: '🏷️', category: 'milestone', threshold: 15 },
  { id: 'teams_al', name: 'League Explorer', desc: 'Use every AL team', icon: '🇦', category: 'milestone', threshold: 14 },
  { id: 'teams_nl', name: 'National Pastime', desc: 'Use every NL team', icon: '🇳', category: 'milestone', threshold: 12 },
  { id: 'teams_all', name: 'Baseball Historian', desc: 'Use every team', icon: '📚', category: 'milestone', threshold: 26 },

  // ── BALLPARKS VISITED ──
  { id: 'parks_5', name: 'Road Trip', desc: 'Play in 5 ballparks', icon: '🚗', category: 'milestone', threshold: 5 },
  { id: 'parks_10', name: 'Frequent Flyer', desc: 'Play in 10 ballparks', icon: '✈️', category: 'milestone', threshold: 10 },
  { id: 'parks_all', name: 'Ballpark Chaser', desc: 'Play in every stadium', icon: '🗺️', category: 'milestone', threshold: 26 },

  // ── STREAKS ──
  { id: 'streak_2', name: 'Two in a Row', desc: 'Win 2 games in a row', icon: '2️⃣', category: 'streak', threshold: 2 },
  { id: 'streak_5', name: 'Five in a Row', desc: 'Win 5 games in a row', icon: '5️⃣', category: 'streak', threshold: 5 },
  { id: 'streak_10', name: 'Ten in a Row', desc: 'Win 10 games in a row', icon: '🔟', category: 'streak', threshold: 10 },
  { id: 'streak_25', name: 'Dynasty', desc: 'Win 25 games in a row', icon: '👑', category: 'streak', threshold: 25 },

  // ── COMMUNITY / DAYS PLAYED ──
  { id: 'welcome', name: 'Welcome to the Show', desc: 'Launch the game', icon: '👋', category: 'community' },
  { id: 'back_again', name: 'Back Again', desc: 'Play on 2 different days', icon: '📅', category: 'community', threshold: 2 },
  { id: 'regular_customer', name: 'Regular Customer', desc: 'Play on 7 different days', icon: '📆', category: 'community', threshold: 7 },
  { id: 'dedicated_fan', name: 'Dedicated Fan', desc: 'Play on 30 different days', icon: '🗓️', category: 'community', threshold: 30 },
  { id: 'one_more_game', name: 'One More Game', desc: 'Finish a game after midnight', icon: '🌙', category: 'community' },
  { id: 'just_one_more', name: 'Just One More', desc: 'Play 3 games in one session', icon: '🎮', category: 'community' },
  { id: 'marathon', name: 'Marathon Session', desc: 'Play 10 games in one session', icon: '🏃‍♂️', category: 'community' },

  // ── HIDDEN / TIME-BASED ──
  { id: 'night_game', name: 'Night Game', desc: 'Play after 10 PM local time', icon: '🦉', category: 'hidden' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Play before 6 AM', icon: '🐦', category: 'hidden' },
  { id: 'rain_delay_pause', name: 'Rain Delay', desc: 'Stay paused for 15 minutes', icon: '🌧️', category: 'hidden' },
  { id: 'couldnt_put_down', name: "Couldn't Put It Down", desc: 'Play 5 hours without closing', icon: '📖', category: 'hidden' },

  // ── ARGUMENTS & EJECTIONS ──
  { id: 'first_argument', name: 'Have a Word', desc: 'First manager argument', icon: '🗣️', category: 'ejection' },
  { id: 'youre_gone', name: "You're Gone!", desc: 'First manager ejection', icon: '👋', category: 'ejection' },
  { id: 'frequent_flyer', name: 'Frequent Flyer', desc: '10 manager ejections', icon: '✈️', category: 'ejection', threshold: 10 },
  { id: 'billy_martin', name: 'Billy Martin Award', desc: '25 manager ejections', icon: '😤', category: 'ejection', threshold: 25 },
  { id: 'earl_weaver', name: 'Earl Weaver Special', desc: 'Get ejected and win anyway', icon: '😈', category: 'ejection' },
  { id: 'dirt_kicker', name: 'Dirt Kicker', desc: 'Kick dirt on home plate', icon: '🦶', category: 'ejection' },
  { id: 'base_thief', name: 'Base Thief', desc: 'Manager removes first base in protest', icon: '🏟️', category: 'ejection' },
  { id: 'bench_tossed', name: 'Didn\'t Even Leave the Dugout', desc: 'Manager ejected from the bench', icon: '🪑', category: 'ejection' },
];

// ── Stats storage ──

const STATS_KEY = 'bb84_stats';

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return getDefaultStats();
}

function getDefaultStats() {
  return {
    gamesCompleted: 0,
    wins: 0,
    losses: 0,
    totalTimePlayed: 0,        // minutes
    teamsUsed: [],
    ballparksVisited: [],
    daysPlayed: [],
    currentStreak: 0,
    bestStreak: 0,
    gamesInSession: 0,
    sessionStartTime: null,
    lastGameEndTime: null,
    firstVisitDate: null,
    pauseStartTime: null,
    totalPauseTime: 0,
    lastHourHeartbeat: null,
    // Achievement-specific trackers
    errorCounts: {},            // per game error count by team
    hbpCounts: {},             // HBP per game
  };
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) { /* ignore */ }
}

// ── Achievements storage ──

const ACH_KEY = 'bb84_achievements';

export function loadAchievements() {
  try {
    const raw = localStorage.getItem(ACH_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return {};
}

export function saveAchievements(achs) {
  try {
    localStorage.setItem(ACH_KEY, JSON.stringify(achs));
  } catch (e) { /* ignore */ }
}

export function unlockAchievement(id) {
  const achs = loadAchievements();
  if (achs[id]) return false;
  achs[id] = Date.now();
  saveAchievements(achs);
  return true;
}

export function isUnlocked(id) {
  return !!loadAchievements()[id];
}

export function getUnlockedCount() {
  return Object.keys(loadAchievements()).length;
}

// ── Public stat helpers ──

export function getStats() { return loadStats(); }

// Initialize stats on first ever visit
export function ensureStatsInit() {
  const stats = loadStats();
  if (!stats.firstVisitDate) {
    // "Welcome to the Show" triggers on first launch
    unlockAchievement('welcome');

    const today = getDateKey();
    stats.firstVisitDate = today;
    stats.daysPlayed = [today];
    stats.sessionStartTime = Date.now();
    saveStats(stats);
    return stats;
  }
  return stats;
}

// Track a day played
export function trackDayPlayed() {
  const stats = loadStats();
  const today = getDateKey();
  if (!stats.daysPlayed.includes(today)) {
    stats.daysPlayed.push(today);
  }

  // Check day-based achievements
  const days = stats.daysPlayed.length;
  checkThreshold('back_again', days);
  checkThreshold('regular_customer', days);
  checkThreshold('dedicated_fan', days);

  saveStats(stats);
}

// Called when starting a new session (app opened)
export function trackSessionStart() {
  const stats = loadStats();
  const now = Date.now();

  // Check if this counts as a new session
  if (stats.lastGameEndTime && (now - stats.lastGameEndTime) > 30 * 60 * 1000) {
    stats.gamesInSession = 0; // reset session count after 30 min break
  }
  if (!stats.sessionStartTime) {
    stats.sessionStartTime = now;
  }

  // Track day
  const today = getDateKey();
  if (!stats.daysPlayed.includes(today)) {
    stats.daysPlayed.push(today);
  }
  const days = stats.daysPlayed.length;
  checkThreshold('back_again', days);
  checkThreshold('regular_customer', days);
  checkThreshold('dedicated_fan', days);

  // Hidden time-of-day achievements
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 6) unlockAchievement('night_game');
  if (hour >= 4 && hour < 6) unlockAchievement('early_bird');

  saveStats(stats);
}

// Called when a game finishes
export function trackGameCompleted(userWon, userTeam, opponentTeam, stadiumName, userHitCount, opponentHitCount) {
  const stats = loadStats();
  stats.gamesCompleted++;
  stats.gamesInSession++;
  stats.lastGameEndTime = Date.now();

  if (userWon) {
    stats.wins++;
    stats.currentStreak++;
    if (stats.currentStreak > stats.bestStreak) stats.bestStreak = stats.currentStreak;
  } else {
    stats.losses++;
    stats.currentStreak = 0;
  }

  // Track teams used
  if (userTeam && !stats.teamsUsed.includes(userTeam)) stats.teamsUsed.push(userTeam);
  if (opponentTeam && !stats.teamsUsed.includes(opponentTeam)) stats.teamsUsed.push(opponentTeam);

  // Track ballparks
  if (stadiumName && !stats.ballparksVisited.includes(stadiumName)) stats.ballparksVisited.push(stadiumName);

  // Games completed thresholds
  checkThreshold('games_1', stats.gamesCompleted);
  checkThreshold('games_2', stats.gamesCompleted);
  checkThreshold('games_10', stats.gamesCompleted);
  checkThreshold('games_25', stats.gamesCompleted);
  checkThreshold('games_50', stats.gamesCompleted);
  checkThreshold('games_100', stats.gamesCompleted);
  checkThreshold('games_250', stats.gamesCompleted);
  checkThreshold('games_500', stats.gamesCompleted);
  checkThreshold('games_1000', stats.gamesCompleted);

  // Wins thresholds
  checkThreshold('wins_1', stats.wins);
  checkThreshold('wins_10', stats.wins);
  checkThreshold('wins_50', stats.wins);
  checkThreshold('wins_100', stats.wins);
  checkThreshold('wins_500', stats.wins);

  // Teams used thresholds
  checkThreshold('teams_2', stats.teamsUsed.length);
  checkThreshold('teams_10', stats.teamsUsed.length);
  checkThreshold('teams_15', stats.teamsUsed.length);

  // Ballparks thresholds
  checkThreshold('parks_5', stats.ballparksVisited.length);
  checkThreshold('parks_10', stats.ballparksVisited.length);

  // Streak thresholds
  checkThreshold('streak_2', stats.currentStreak);
  checkThreshold('streak_5', stats.currentStreak);
  checkThreshold('streak_10', stats.currentStreak);
  checkThreshold('streak_25', stats.currentStreak);

  // Session-based
  if (stats.gamesInSession >= 3) unlockAchievement('just_one_more');
  if (stats.gamesInSession >= 10) unlockAchievement('marathon');

  // Funny / hidden: Mendoza Line (win with 3 or fewer hits)
  if (userWon && userHitCount !== undefined && userHitCount <= 3) unlockAchievement('mendoza_line');
  // How?! (lose despite out-hitting by 10)
  if (!userWon && userHitCount !== undefined && opponentHitCount !== undefined &&
      userHitCount - opponentHitCount >= 10) unlockAchievement('how_ach');

  saveStats(stats);
}

// Track time played (call every minute from a setInterval, or batch at game end)
export function trackTimePlayed(minutes) {
  const stats = loadStats();
  stats.totalTimePlayed += minutes;

  checkThreshold('time_60', stats.totalTimePlayed);
  checkThreshold('time_420', stats.totalTimePlayed);
  checkThreshold('time_1500', stats.totalTimePlayed);
  checkThreshold('time_3000', stats.totalTimePlayed);
  checkThreshold('time_6000', stats.totalTimePlayed);
  checkThreshold('time_15000', stats.totalTimePlayed);
  checkThreshold('time_30000', stats.totalTimePlayed);

  // Couldn't Put It Down: 5 hours in one session
  if (stats.sessionStartTime && (Date.now() - stats.sessionStartTime) > 5 * 60 * 60 * 1000) {
    unlockAchievement('couldnt_put_down');
  }

  saveStats(stats);
}

// Track pause time (for Rain Delay achievement)
export function trackPauseStart() {
  const stats = loadStats();
  stats.pauseStartTime = Date.now();
  saveStats(stats);
}

export function trackPauseEnd() {
  const stats = loadStats();
  if (stats.pauseStartTime) {
    const pausedMs = Date.now() - stats.pauseStartTime;
    stats.totalPauseTime += pausedMs;
    if (pausedMs > 10 * 60 * 1000) unlockAchievement('rain_delay_ach');
    if (pausedMs > 15 * 60 * 1000) unlockAchievement('rain_delay_pause');
    stats.pauseStartTime = null;
  }
  saveStats(stats);
}

// "One More Game" — finished after midnight
export function trackGameEndTime() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    unlockAchievement('one_more_game');
  }
}

// ── In-game achievement checker (called when game ends) ──

export function checkGameAchievements(gameState, userTeam = 'home') {
  const newlyUnlocked = [];
  const u = (id) => { if (unlockAchievement(id)) newlyUnlocked.push(id); };

  const userSide = userTeam === 'home' ? 'home' : 'away';
  const opponentSide = userSide === 'home' ? 'away' : 'home';
  const userScore = gameState.score[userSide];
  const opponentScore = gameState.score[opponentSide];
  const userWon = userScore > opponentScore;
  const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
  const opponentLineup = userSide === 'home' ? gameState.awayLineup : gameState.homeLineup;
  const userHistory = userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []);
  const currentPitcher = userSide === 'home' ? gameState.homePitcher : gameState.awayPitcher;
  const userPitchers = [currentPitcher, ...userHistory.filter(p => p.gameStats?.pitches !== undefined)];
  const allUserPlayers = [...userLineup, ...userHistory];
  const allOppPlayers = [...opponentLineup, ...(userSide === 'home' ? (gameState.awayPlayerHistory || []) : (gameState.homePlayerHistory || []))];

  const log = gameState.log || [];
  const logText = log.map(l => l.text).join(' ');

  // ── FIRST-TIME ──
  u('play_ball');
  if (allUserPlayers.some(p => p.gameStats?.hits > 0)) u('batter_up');
  if (allUserPlayers.some(p => p.gameStats?.runs > 0)) u('crossed_plate');
  if (logText.includes('double play')) u('around_horn');
  if (logText.includes('1-2-3') || logText.includes('retired in order')) u('three_up_down');
  if (userWon) u('ballgame');

  // ── HITTING ──
  if (logText.includes('infield single') || logText.includes('beats it out')) u('infield_hit');
  if (logText.includes('double') && logText.includes('double play') === false) u('gap_power');
  if (logText.includes('triple')) u('legs_for_days');
  if (allUserPlayers.some(p => p.gameStats?.hr > 0)) u('touch_em_all');
  if (allUserPlayers.some(p => p.gameStats?.hits >= 3)) u('rally_starter');
  if (allUserPlayers.some(p => p.gameStats?.hits >= 4)) u('perfect_day');

  // Cycle check: player needs 1B, 2B, 3B, HR — check log for a single player
  for (const p of allUserPlayers) {
    const pName = p.name;
    const nameRegex = new RegExp(pName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const hasSingle = /single/i.test(logText) && logText.includes(pName);
    // Check for triples and HRs per player
    if (hasSingle && logText.includes('double') && logText.includes(pName) &&
        (logText.includes('triple') && logText.includes(pName)) && p.gameStats?.hr > 0) {
      u('the_cycle');
    }
    // Cycle watch: 3 different hit types (1B, 2B, 3B, or HR)
    let hitTypes = 0;
    if (logText.includes('single') && logText.includes(pName)) hitTypes++;
    const doubleMatch = log.filter(l => l.type === 'double' && l.text.includes(pName));
    if (doubleMatch.length > 0) hitTypes++;
    const tripleMatch = log.filter(l => l.type === 'triple' && l.text.includes(pName));
    if (tripleMatch.length > 0) hitTypes++;
    if (p.gameStats?.hr > 0) hitTypes++;
    if (hitTypes >= 3) u('cycle_watch');
  }

  if (logText.includes('GRAND SLAM')) u('grand_salami');
  if (logText.includes('Walk-off') || logText.includes('walk-off')) u('walk_off_hero');

  // ── PITCHING ──
  if (userPitchers.some(p => (p.gameStats?.so || 0) > 0)) u('punchout');
  if (userPitchers.some(p => (p.gameStats?.so || 0) >= 10)) u('k_artist');
  // Total opponent hits
  const oppHits = allOppPlayers.reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);
  if (oppHits <= 3) u('cruising');
  if (opponentScore === 0) u('lights_out');
  // No-hitter: 0 opponent hits
  if (oppHits === 0 && gameState.inning >= 9) {
    u('untouchable');
    // Perfect game: no hits + no walks + no errors
    const oppWalks = allOppPlayers.reduce((sum, p) => sum + (p.gameStats?.bb || 0), 0);
    if (oppWalks === 0 && !logText.includes('error') && !logText.includes('reach on an error')) {
      u('perfect_afternoon');
      if (userPitchers.some(p => (p.gameStats?.so || 0) >= 10)) u('mr_perfect');
    }
  }
  if (logText.includes('strike out the side') || logText.includes('struck out the side')) u('frozen_rope');

  // ── DEFENSE ──
  if (logText.includes('diving catch') || logText.includes('dives and makes the catch') || logText.includes('lays out')) u('leather_glove');
  if (logText.includes('thrown out at home') || logText.includes('nailed at the plate')) u('cannon_arm');
  if (logText.includes('caught stealing')) u('caught_stealing');
  if (logText.includes('double play')) u('twin_killing');
  if (logText.includes('to short') || logText.includes('to third')) u('around_horn_dp');
  if (logText.includes('robs') && logText.includes('home run')) u('web_gem');

  // ── COMEBACKS ──
  const maxDeficit = computeMaxDeficit(gameState, userSide);
  if (userWon && maxDeficit >= 3) u('never_quit');
  if (userWon && maxDeficit >= 5) u('cardiac_kids');
  if (userWon && gameState.inning >= 9 && maxDeficit > 0) u('last_chance');
  if (userWon && gameState.inning > 9) u('extra_baseball');
  if (userWon && (logText.includes('Walk-off') || logText.includes('walk-off'))) u('bottom_ninth');

  // ── FUNNY ──
  // Golden/Silver Sombrero: check for player with 4/3 K's
  const userKs = {};
  allUserPlayers.forEach(p => { if (p.gameStats?.so) userKs[p.name] = p.gameStats.so; });
  if (Object.values(userKs).some(k => k >= 4)) u('golden_sombrero');
  if (Object.values(userKs).some(k => k >= 3)) u('silver_sombrero');
  if (logText.includes('error') && (logText.match(/error/gi) || []).length >= 3) u('oops');
  if (logText.includes('reaches on an error')) u('little_league');
  if (gameState.inning >= 15) u('free_baseball');
  // Beanball tracked separately — HBP count
  const hbpCount = (logText.match(/hit by the pitch/gi) || []).length;
  if (hbpCount >= 3) u('beanball');

  // ── 1984-THEMED ──
  u('like_its_1984');
  // Small ball: scored a run but no hits in an inning — tricky, approximate via walk + SB + SF
  if (logText.includes('scores') && (logText.includes('bunt') || logText.includes('sacrifice fly') || logText.includes('steals home'))) u('small_ball');
  const allSB = allUserPlayers.reduce((sum, p) => sum + (p.gameStats?.sb || 0), 0);
  if (allSB >= 5) u('whitey_ball');
  // The Wizard: 10+ assists — we approximate via log mentions of SS
  if ((logText.match(/to short/gi) || []).length >= 10) u('the_wizard');
  const totalHR = allUserPlayers.reduce((sum, p) => sum + (p.gameStats?.hr || 0), 0);
  if (totalHR >= 4) u('power_surge');
  // Ace of the Staff: complete game (pitcher with 9+ IP)
  if (userPitchers.some(p => (p.gameStats?.ip || 0) >= 9)) u('ace_of_staff');
  // Workhorse: 140+ pitches
  if (userPitchers.some(p => (p.gameStats?.pitches || 0) >= 140)) u('workhorse');
  // Old School: no pitching change (only 1 pitcher all game)
  const pitcherCount = new Set(userPitchers.map(p => p.name)).size;
  if (pitcherCount === 1 && userWon) u('old_school');
  // One-Pitch Wonder: completed game using only one pitch type
  const pitchTypes = gameState.userPitchTypes || [];
  if (pitchTypes.length === 1 && gameState.inning >= 5) u('one_pitch_wonder');

  // ── VERY RARE ──
  if (userScore >= 21) u('twenty_one_guns');
  if (userWon && (userScore - opponentScore) >= 15) u('mercy');
  // Immaculate inning: 9 pitches, 3 Ks in one inning — check log
  if (logText.includes('immaculate') || logText.includes('9 pitches')) u('immaculate');
  if (totalHR >= 5) u('four_bagger_frenzy');
  if (logText.includes('500')) u('no_doubter');

  return newlyUnlocked;
}

function computeMaxDeficit(gameState, userSide) {
  const oppSide = userSide === 'home' ? 'away' : 'home';
  const innings = gameState.innings || [];
  let userTotal = 0, oppTotal = 0, maxDeficit = 0;
  for (const inn of innings) {
    if (inn[userSide] !== null) userTotal += inn[userSide];
    if (inn[oppSide] !== null) oppTotal += inn[oppSide];
    if (oppTotal - userTotal > maxDeficit) maxDeficit = oppTotal - userTotal;
  }
  return maxDeficit;
}

// ── Helper ──

function getDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function checkThreshold(baseId, value) {
  const ach = ACHIEVEMENTS.find(a => a.id === baseId);
  if (!ach || !ach.threshold) return;
  if (value >= ach.threshold) unlockAchievement(baseId);
}

// Also check league-specific team achievements
export function checkTeamAchievements() {
  const stats = loadStats();
  const AL_TEAMS = ['tigers', 'redsox', 'yankees', 'orioles', 'brewers', 'bluejays', 'indians', 'angels', 'royals', 'twins', 'mariners', 'whitesox', 'rangers', 'athletics'];
  const NL_TEAMS = ['padres', 'cubs', 'mets', 'dodgers', 'cardinals', 'braves', 'astros', 'expos', 'phillies', 'pirates', 'reds', 'giants'];

  const usedAL = AL_TEAMS.filter(t => stats.teamsUsed.includes(t));
  const usedNL = NL_TEAMS.filter(t => stats.teamsUsed.includes(t));

  if (usedAL.length >= AL_TEAMS.length) unlockAchievement('teams_al');
  if (usedNL.length >= NL_TEAMS.length) unlockAchievement('teams_nl');
  if (stats.teamsUsed.length >= 26) unlockAchievement('teams_all');
  if (stats.ballparksVisited.length >= 26) unlockAchievement('parks_all');
}