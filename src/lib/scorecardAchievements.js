// Scorecard-based achievement definitions
// These achievements track cumulative career stats shown on the Career Scorecard

export const SCORECARD_ACHIEVEMENTS = [
  // ── GAMES PLAYED MILESTONES ──
  { id: 'century_club', name: 'Century Club', desc: 'Play 100 games', icon: '💯', category: 'milestone', threshold: 100 },
  { id: 'double_century', name: 'Double Century', desc: 'Play 200 games', icon: '2️⃣0️⃣0️⃣', category: 'milestone', threshold: 200 },
  { id: 'three_century', name: 'Triple Century', desc: 'Play 300 games', icon: '3️⃣0️⃣0️⃣', category: 'milestone', threshold: 300 },

  // ── TEAM LOYALTY ──
  { id: 'team_loyalist_25', name: 'Franchise Player', desc: 'Play 25 games with one team', icon: '💍', category: 'milestone', threshold: 25 },
  { id: 'team_loyalist_50', name: 'Team Legend', desc: 'Play 50 games with one team', icon: '🏅', category: 'milestone', threshold: 50 },
  { id: 'team_loyalist_100', name: 'One-Club Man', desc: 'Play 100 games with one team', icon: '🎖️', category: 'milestone', threshold: 100 },

  // ── HOME/ROAD DOMINANCE ──
  { id: 'home_field_advantage', name: 'Home Field Advantage', desc: 'Win 25 home games', icon: '🏠', category: 'milestone', threshold: 25 },
  { id: 'road_dominance', name: 'Road Warrior', desc: 'Win 25 road games', icon: '🚌', category: 'milestone', threshold: 25 },

  // ── WIN PERCENTAGE MILESTONES ──
  { id: 'winning_percentage_50', name: 'Above .500', desc: 'Achieve a 50% win rate with 50+ games', icon: '📊', category: 'milestone' },
  { id: 'winning_percentage_60', name: 'Winning Ballclub', desc: 'Achieve a 60% win rate with 100+ games', icon: '📈', category: 'milestone' },
  { id: 'dynasty_builder', name: 'Dynasty Builder', desc: 'Achieve a 70% win rate with 200+ games', icon: '👑', category: 'milestone' },
  { id: 'legendary_manager', name: 'Legendary Manager', desc: 'Achieve a 75% win rate with 500+ games', icon: '🏛️', category: 'milestone' },

  // ── STREAK MILESTONES ──
  { id: 'streak_starter', name: 'Streak Starter', desc: 'Build a 3-game winning streak', icon: '🔥', category: 'streak', threshold: 3 },
  { id: 'hot_hand', name: 'Hot Hand', desc: 'Build a 7-game winning streak', icon: '🔥🔥', category: 'streak', threshold: 7 },
  { id: 'untouchable', name: 'Untouchable', desc: 'Build a 15-game winning streak', icon: '🔥🔥🔥', category: 'streak', threshold: 15 },
  { id: 'historic_run', name: 'Historic Run', desc: 'Build a 20-game winning streak', icon: '📜', category: 'streak', threshold: 20 },

  // ── BALLPARK MILESTONES ──
  { id: 'ballpark_tourist', name: 'Ballpark Tourist', desc: 'Play in 15 different ballparks', icon: '🗺️', category: 'milestone', threshold: 15 },
  { id: 'ballpark_expert', name: 'Ballpark Expert', desc: 'Play in 20 different ballparks', icon: '🎯', category: 'milestone', threshold: 20 },
  { id: 'road_warrior_wins', name: 'Road Warrior', desc: 'Win in 15 different ballparks', icon: '✈️', category: 'milestone', threshold: 15 },
  { id: 'road_conqueror', name: 'Road Conqueror', desc: 'Win in 20 different ballparks', icon: '🏆', category: 'milestone', threshold: 20 },

  // ── PLAYER USAGE ──
  { id: 'player_collector_150', name: 'Roster Manager', desc: 'Use 150 different players', icon: '📋', category: 'completionist', threshold: 150 },
  { id: 'player_collector_300', name: 'Talent Scout', desc: 'Use 300 different players', icon: '🔍', category: 'completionist', threshold: 300 },
  { id: 'player_collector_500', name: 'Baseball Encyclopedia', desc: 'Use 500 different players', icon: '📚', category: 'completionist', threshold: 500 },

  // ── PITCHER USAGE ──
  { id: 'pitching_rotation_40', name: 'Deep Rotation', desc: 'Start 40 different pitchers', icon: '🎡', category: 'completionist', threshold: 40 },
  { id: 'pitching_rotation_60', name: 'Armchair GM', desc: 'Start 60 different pitchers', icon: '💼', category: 'completionist', threshold: 60 },
  { id: 'pitching_rotation_80', name: 'Full Staff', desc: 'Start 80 different pitchers', icon: '📊', category: 'completionist', threshold: 80 },

  // ── TIME INVESTED ──
  { id: 'time_invested_10h', name: 'Dedicated Manager', desc: 'Play for 10 hours', icon: '⌚', category: 'milestone', threshold: 600 },
  { id: 'time_invested_25h', name: 'Seasoned Veteran', desc: 'Play for 25 hours', icon: '🎯', category: 'milestone', threshold: 1500 },
  { id: 'time_invested_50h', name: 'Baseball Lifer', desc: 'Play for 50 hours', icon: '🏆', category: 'milestone', threshold: 3000 },
  { id: 'time_invested_100h', name: 'Hall of Fame Time', desc: 'Play for 100 hours', icon: '🏛️', category: 'milestone', threshold: 6000 },

  // ── HOME RUN RECORDS ──
  { id: 'longest_hr_450', name: 'Monster Shot', desc: 'Hit a 450-foot home run', icon: '📏', category: 'rare' },
  { id: 'longest_hr_475', name: 'Out of Sight', desc: 'Hit a 475-foot home run', icon: '🔭', category: 'rare' },
  { id: 'longest_hr_500', name: 'Into the Stratosphere', desc: 'Hit a 500-foot home run', icon: '🚀', category: 'rare' },

  // ── RUN SCORING RECORDS ──
  { id: 'runs_explosion_15', name: 'Offensive Explosion', desc: 'Score 15 runs in a game', icon: '💥', category: 'rare' },
  { id: 'runs_explosion_18', name: 'Run Fest', desc: 'Score 18 runs in a game', icon: '🎆', category: 'rare' },
  { id: 'runs_explosion_20', name: 'Twenty Gun Salute', desc: 'Score 20 runs in a game', icon: '🎉', category: 'rare' },

  // ── VICTORY MARGINS ──
  { id: 'blowout_12', name: 'Complete Domination', desc: 'Win by 12 runs', icon: '😤', category: 'rare' },
  { id: 'blowout_15', name: 'Mercy Rule', desc: 'Win by 15 runs', icon: '🩸', category: 'rare' },

  // ── PITCHING MILESTONES ──
  { id: 'shutout_master', name: 'Shutout Master', desc: 'Throw 10 shutouts', icon: '🔒', category: 'milestone', threshold: 10 },
  { id: 'shutout_legend', name: 'Shutout Legend', desc: 'Throw 25 shutouts', icon: '🏅', category: 'milestone', threshold: 25 },
  { id: 'no_hitter_club', name: 'No-Hitter Club', desc: 'Throw 3 no-hitters', icon: '👻', category: 'rare', threshold: 3 },
  { id: 'perfect_game_historic', name: 'Perfect Game', desc: 'Throw a perfect game', icon: '✨', category: 'rare' },
];

// ── Session-based achievements ──
export function checkSessionAchievements(stats, unlockFn) {
  // Power Hour: 5 games in one hour
  if (stats.sessionStartTime && (Date.now() - stats.sessionStartTime) < 60 * 60 * 1000 && stats.gamesInSession >= 5) {
    unlockFn('power_hour');
  }
  // Marathon Man: 20 games in one session
  if (stats.gamesInSession >= 20) {
    unlockFn('marathon_man');
  }
  // Ultra Marathon: 50 games in one session
  if (stats.gamesInSession >= 50) {
    unlockFn('ultra_marathon');
  }
}

// ── Win percentage achievements ──
export function checkWinPercentageAchievements(stats, unlockFn) {
  const { gamesCompleted, wins } = stats;
  
  if (gamesCompleted >= 50) {
    const winPct = wins / gamesCompleted;
    if (winPct >= 0.50) unlockFn('winning_percentage_50');
  }
  if (gamesCompleted >= 100) {
    const winPct = wins / gamesCompleted;
    if (winPct >= 0.60) unlockFn('winning_percentage_60');
  }
  if (gamesCompleted >= 200) {
    const winPct = wins / gamesCompleted;
    if (winPct >= 0.70) unlockFn('dynasty_builder');
  }
  if (gamesCompleted >= 500) {
    const winPct = wins / gamesCompleted;
    if (winPct >= 0.75) unlockFn('legendary_manager');
  }
}

// ── Day-based community achievements ──
export const DAY_ACHIEVEMENTS = [
  { id: 'weekend_warrior', threshold: 5, label: 'weekends' },
  { id: 'daily_grind', threshold: 14, label: 'consecutive days' },
  { id: 'month_of_mayhem', threshold: 30, label: 'days' },
  { id: 'season_ticket', threshold: 60, label: 'days' },
  { id: 'full_season', threshold: 90, label: 'days' },
  { id: 'calendar_year', threshold: 365, label: 'days' },
];