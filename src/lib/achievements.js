// Achievement definitions for 1984: The Baseball Season
// Organized by category with id, name, desc, icon, and category

import { TEAMS } from './gameData';
import { LEADER_LISTS } from './leaders1984';

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
  { id: 'fence_patrol', name: 'Fence Patrol', desc: 'Rob 5 home runs', icon: '🚧', category: 'defense', threshold: 5 },
  { id: 'grand_theft_homer', name: 'Grand Theft Homer', desc: 'Rob a home run with runners aboard', icon: '🚨', category: 'defense' },
  { id: 'highway_robbery', name: 'Highway Robbery', desc: 'Rob a game-tying home run', icon: '🛣️', category: 'defense' },
  { id: 'no_souvenir', name: 'No Souvenir For You', desc: 'Rob a home run in front of fans', icon: '✋', category: 'defense' },
  { id: 'bring_it_back', name: 'Bring It Back', desc: 'Rob a home run and win the game', icon: '🎁', category: 'defense' },
  { id: 'gold_glove_def', name: 'Gold Glove Award', desc: 'Rob 10 home runs', icon: '🥇', category: 'defense', threshold: 10 },
  { id: 'highlight_reel', name: 'Human Highlight Reel', desc: 'Rob a home run and hit one in the same game', icon: '🎬', category: 'defense' },
  { id: 'web_gems_5', name: 'Web Gem Collection', desc: 'Make 10 diving catches', icon: '📸', category: 'defense', threshold: 10 },
  { id: 'full_extension', name: 'Full Extension', desc: 'Make a diving catch', icon: '📐', category: 'defense' },
  { id: 'lay_out', name: 'Lay Out', desc: 'Record your first diving catch', icon: '🛏️', category: 'defense' },
  { id: 'air_traffic', name: 'Air Traffic Control', desc: 'Make 3 diving catches in one game', icon: '✈️', category: 'defense' },
  { id: 'human_vacuum', name: 'Human Vacuum Cleaner', desc: 'Make 25 diving catches', icon: '🧹', category: 'defense', threshold: 25 },
  { id: 'first_stop', name: 'Leather', desc: 'Make your first diving ground-ball stop', icon: '⛑️', category: 'defense' },
  { id: 'vacuum_25', name: 'Vacuum Cleaner', desc: 'Make 25 diving stops', icon: '🪣', category: 'defense', threshold: 25 },
  { id: 'hot_corner', name: 'Hot Corner Hero', desc: 'Make a diving stop at third base', icon: '🔥', category: 'defense' },
  { id: 'wizardry', name: 'Wizardry', desc: 'Turn a diving stop into an out', icon: '🧙', category: 'defense' },
  { id: 'save_the_pitcher', name: 'Save The Pitcher', desc: 'Prevent extra bases with a diving stop', icon: '🛟', category: 'defense' },
  { id: 'gold_glove_candidate', name: 'Gold Glove Candidate', desc: 'Make 50 diving stops', icon: '🏅', category: 'defense', threshold: 50 },

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
  { id: 'hr_400ft', name: 'Tape Measure Shot', desc: 'Hit a home run 400+ feet', icon: '🎯', category: 'hitting' },
  { id: 'hr_425ft', name: 'Prodigious Blast', desc: 'Hit a home run 425+ feet', icon: '⚡', category: 'hitting' },
  { id: 'hr_450ft', name: 'Moon Shot', desc: 'Hit a home run 450+ feet', icon: '💣', category: 'hitting' },
  { id: 'hr_475ft', name: 'Gone to Another Zip Code', desc: 'Hit a home run 475+ feet', icon: '🚀', category: 'rare' },
  { id: 'mr_perfect', name: 'Mr. Perfect', desc: 'Perfect game with 10+ strikeouts', icon: '💫', category: 'rare' },

  // ── BLOWOUT & MISCELLANEOUS FUN ──
  { id: 'blowout_broadcast', name: 'Blowout Broadcast', desc: 'Announcers start talking about sandwiches in a blowout', icon: '🥪', category: 'funny' },
  { id: 'laugher', name: 'Laugher', desc: 'Win by 10 runs', icon: '😂', category: 'funny' },
  { id: 'shellacked', name: 'Shellacked', desc: 'Lose by 10 runs', icon: '😵', category: 'funny' },
  { id: 'crooked_number', name: 'Crooked Number', desc: 'Score 5+ runs in a single inning', icon: '🔢', category: 'funny' },
  { id: 'ten_spot', name: 'Ten-Spot', desc: 'Score 10+ runs in a game', icon: '🔟', category: 'funny' },
  { id: 'pitching_duel', name: "Pitcher's Duel", desc: 'Win a 1-0 game', icon: '🤺', category: 'funny' },
  { id: 'double_digits_drubbing', name: 'Double Digit Drubbing', desc: 'Allow 10+ runs in a game', icon: '🫣', category: 'funny' },
  { id: 'heart_of_the_order', name: 'Heart of the Order', desc: 'Have your 3-4-5 hitters each drive in a run', icon: '❤️', category: 'funny' },
  { id: 'oppo_taco', name: 'Oppo Taco', desc: 'Hit an opposite field home run', icon: '🌮', category: 'funny' },
  { id: 'seven_innings_plus', name: 'Seven Innings Plus', desc: 'Reach the 7th inning stretch (have a lead after 7)', icon: '🎤', category: 'funny' },

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

  // ── VICTORY TRADITIONS ──
  { id: 'fly_the_w', name: 'Fly the W', desc: 'Win a home game as the Cubs and see the W flag raised', icon: '🚩', category: 'victory' },
  { id: 'start_spreading', name: 'Start Spreading the News', desc: 'Win a home game as the Yankees and hear Sinatra', icon: '🎩', category: 'victory' },
  { id: 'celebration_time', name: 'Celebration Time', desc: 'Win a home game as the Athletics and hear Celebration', icon: '🎉', category: 'victory' },
  { id: 'halo_shines', name: 'The Halo Shines', desc: 'Win a game as the Angels and light the Big A halo', icon: '😇', category: 'victory' },
  { id: 'bernie_slide', name: 'Bernie\'s Slide', desc: 'Win a home game as the Brewers and watch Bernie slide', icon: '🍺', category: 'victory' },
  { id: 'bless_you_boys', name: 'Bless You Boys', desc: 'Win a home game as the Tigers with Motown playing', icon: '🐯', category: 'victory' },
  { id: 'orioles_magic', name: 'Orioles Magic', desc: 'Win a dramatic game as the Orioles and hear the anthem', icon: '🪄', category: 'victory' },
  { id: 'meet_the_mets', name: 'Meet the Mets', desc: 'Win a home game as the Mets and hear the fight song', icon: '🎵', category: 'victory' },
  { id: 'we_are_family', name: 'We Are Family', desc: 'Win a walk-off as the Pirates and hear the anthem', icon: '🏴‍☠️', category: 'victory' },
  { id: 'cub_busters', name: 'Cub-Busters', desc: 'Beat the Cubs as the Padres and hear Cub-Busters', icon: '👻', category: 'victory' },
  { id: 'that_belongs_to_reds', name: 'Belongs to the Reds', desc: 'Hear Marty Brennaman\'s sign-off after a Reds win', icon: '🎙️', category: 'victory' },
  { id: 'thats_a_winner', name: 'That\'s a Winner', desc: 'Hear Jack Buck\'s sign-off after a Cardinals win', icon: '🏆', category: 'victory' },
  { id: 'cubs_win_cubs_win', name: 'Cubs Win! Cubs Win!', desc: 'Hear Harry Caray\'s call after a Cubs win', icon: '📣', category: 'victory' },

  // ── TEAM-SPECIFIC: CUBS ──
  { id: 'cubs_wrigley_win', name: 'Friendly Confines', desc: 'Win a game at Wrigley Field', icon: '🏟️', category: 'teamSpecific', team: 'cubs' },
  { id: 'cubs_3_hr', name: 'Waveland Avenue', desc: 'Hit 3 home runs in a game as the Cubs', icon: '🌊', category: 'teamSpecific', team: 'cubs' },
  { id: 'cubs_comeback', name: 'Windy City Baseball', desc: 'Win after trailing as the Cubs', icon: '🌬️', category: 'teamSpecific', team: 'cubs' },
  { id: 'cubs_10_runs', name: 'Bleacher Bum', desc: 'Score 10+ runs at Wrigley', icon: '🍻', category: 'teamSpecific', team: 'cubs' },
  { id: 'cubs_25_home', name: 'Day Baseball', desc: 'Win 25 Cubs home games', icon: '☀️', category: 'teamSpecific', team: 'cubs', threshold: 25 },
  { id: 'cubs_100_wins', name: 'North Side Pride', desc: 'Win 100 games as the Cubs', icon: '🏴', category: 'teamSpecific', team: 'cubs', threshold: 100 },
  { id: 'cubs_15_hits', name: 'Ivy Covered', desc: 'Record 15 hits in a game as the Cubs', icon: '🌿', category: 'teamSpecific', team: 'cubs' },
  { id: 'cubs_walkoff', name: 'Go Cubs Go', desc: 'Win a walk-off game as the Cubs', icon: '🎵', category: 'teamSpecific', team: 'cubs' },

  // ── TEAM-SPECIFIC: YANKEES ──
  { id: 'yanks_4_hr', name: 'Bronx Bombers', desc: 'Hit 4 home runs in one game as the Yankees', icon: '💣', category: 'teamSpecific', team: 'yankees' },
  { id: 'yanks_shutout', name: 'Monumental', desc: 'Throw a shutout as the Yankees', icon: '🗿', category: 'teamSpecific', team: 'yankees' },
  { id: 'yanks_12_runs', name: 'Pinstripe Power', desc: 'Score 12 runs in a game as the Yankees', icon: '👔', category: 'teamSpecific', team: 'yankees' },
  { id: 'yanks_all_hit', name: "Murderers' Row", desc: 'Have every starter record a hit as the Yankees', icon: '☠️', category: 'teamSpecific', team: 'yankees' },
  { id: 'yanks_100_wins', name: 'The House That Ruth Built', desc: 'Win 100 games as the Yankees', icon: '🏛️', category: 'teamSpecific', team: 'yankees', threshold: 100 },
  { id: 'yanks_10_streak', name: 'October Expectations', desc: 'Win 10 straight games as the Yankees', icon: '📈', category: 'teamSpecific', team: 'yankees', threshold: 10 },
  { id: 'yanks_2000_hits', name: 'Yankee Tradition', desc: 'Record 2,000 total Yankees hits', icon: '📊', category: 'teamSpecific', team: 'yankees', threshold: 2000 },
  { id: 'yanks_15_so', name: 'Roll Call', desc: 'Strike out 15 batters as the Yankees', icon: '📣', category: 'teamSpecific', team: 'yankees' },

  // ── TEAM-SPECIFIC: METS ──
  { id: 'mets_extras', name: 'Shea Crazy', desc: 'Win in extra innings as the Mets', icon: '⏱️', category: 'teamSpecific', team: 'mets' },
  { id: 'mets_comeback_5', name: "Amazin'", desc: 'Come back from 5 runs down as the Mets', icon: '😲', category: 'teamSpecific', team: 'mets' },
  { id: 'mets_50_wins', name: 'Flushing Faithful', desc: 'Win 50 games as the Mets', icon: '🟠', category: 'teamSpecific', team: 'mets', threshold: 50 },
  { id: 'mets_20_hits', name: 'Orange and Blue', desc: 'Record 20 hits in a game as the Mets', icon: '🧡', category: 'teamSpecific', team: 'mets' },
  { id: 'mets_100_games', name: 'Queens Baseball', desc: 'Play 100 Mets games', icon: '🚇', category: 'teamSpecific', team: 'mets', threshold: 100 },
  { id: 'mets_3_errors_win', name: 'Miracle in Queens', desc: 'Win despite committing 3+ errors as the Mets', icon: '🤯', category: 'teamSpecific', team: 'mets' },
  { id: 'mets_wall_scraper', name: 'Shea Wind', desc: 'Hit a home run that barely clears the fence as the Mets', icon: '🌬️', category: 'teamSpecific', team: 'mets' },
  { id: 'mets_late_comeback', name: 'Ya Gotta Believe', desc: 'Win after trailing entering the 8th as the Mets', icon: '🙏', category: 'teamSpecific', team: 'mets' },

  // ── TEAM-SPECIFIC: DODGERS ──
  { id: 'dodgers_ds_win', name: 'Blue Heaven', desc: 'Win at Dodger Stadium', icon: '💙', category: 'teamSpecific', team: 'dodgers' },
  { id: 'dodgers_cg', name: 'Vin Would Approve', desc: 'Throw a complete game as the Dodgers', icon: '🎙️', category: 'teamSpecific', team: 'dodgers' },
  { id: 'dodgers_50_wins', name: 'Chavez Ravine', desc: 'Win 50 Dodgers games', icon: '🏔️', category: 'teamSpecific', team: 'dodgers', threshold: 50 },
  { id: 'dodgers_walkoff', name: 'Hollywood Ending', desc: 'Walk-off victory as the Dodgers', icon: '🎬', category: 'teamSpecific', team: 'dodgers' },
  { id: 'dodgers_1_hit', name: "Sandy's Shadow", desc: 'Throw a one-hit game as the Dodgers', icon: '👻', category: 'teamSpecific', team: 'dodgers' },
  { id: 'dodgers_100_home', name: 'Sunset Baseball', desc: 'Play 100 Dodgers home games', icon: '🌅', category: 'teamSpecific', team: 'dodgers', threshold: 100 },
  { id: 'dodgers_10_road', name: 'West Coast Swing', desc: 'Win 10 road games as the Dodgers', icon: '🛫', category: 'teamSpecific', team: 'dodgers', threshold: 10 },
  { id: 'dodgers_12_so', name: 'Boys in Blue', desc: 'Strike out 12 batters in a game as the Dodgers', icon: '🔵', category: 'teamSpecific', team: 'dodgers' },

  // ── TEAM-SPECIFIC: PADRES ──
  { id: 'padres_murph_win', name: 'Friar Faithful', desc: 'Win at Jack Murphy Stadium', icon: '✝️', category: 'teamSpecific', team: 'padres' },
  { id: 'padres_100_games', name: 'Pacific Coast', desc: 'Play 100 Padres games', icon: '🌊', category: 'teamSpecific', team: 'padres', threshold: 100 },
  { id: 'padres_day_win', name: 'Sunny San Diego', desc: 'Win a day game as the Padres', icon: '☀️', category: 'teamSpecific', team: 'padres' },
  { id: 'padres_3_doubles', name: 'Sea Level Shot', desc: 'Hit 3 doubles in a game as the Padres', icon: '🌴', category: 'teamSpecific', team: 'padres' },
  { id: 'padres_5_sb', name: 'Mission Bay', desc: 'Steal 5 bases as the Padres', icon: '🏃', category: 'teamSpecific', team: 'padres' },
  { id: 'padres_50_wins', name: 'Brown and Gold', desc: 'Win 50 games as the Padres', icon: '🟤', category: 'teamSpecific', team: 'padres', threshold: 50 },
  { id: 'padres_15_hits', name: 'Southern California Baseball', desc: 'Record 15 hits in a game as the Padres', icon: '🌞', category: 'teamSpecific', team: 'padres' },
  { id: 'padres_comeback_4', name: 'Coastal Comeback', desc: 'Win after trailing by 4 as the Padres', icon: '🏖️', category: 'teamSpecific', team: 'padres' },

  // ── TEAM-SPECIFIC: RED SOX ──
  { id: 'sox_10_doubles', name: 'Green Monster', desc: 'Hit 10 doubles as the Red Sox', icon: '🧱', category: 'teamSpecific', team: 'redsox', threshold: 10 },
  { id: 'sox_fenway_win', name: 'Fenway Favorite', desc: 'Win at Fenway Park', icon: '❤️', category: 'teamSpecific', team: 'redsox' },
  { id: 'sox_pole_hr', name: "Pesky's Pole", desc: 'Hit a home run down the line at Fenway', icon: '📍', category: 'teamSpecific', team: 'redsox' },
  { id: 'sox_100_games', name: 'Yawkey Way', desc: 'Play 100 Red Sox games', icon: '🛣️', category: 'teamSpecific', team: 'redsox', threshold: 100 },
  { id: 'sox_100_wins', name: 'Red Sox Nation', desc: 'Win 100 games as Boston', icon: '🗺️', category: 'teamSpecific', team: 'redsox', threshold: 100 },
  { id: 'sox_15_runs', name: 'Monster Mash', desc: 'Score 15 runs as the Red Sox', icon: '🎸', category: 'teamSpecific', team: 'redsox' },
  { id: 'sox_shutout', name: 'Boston Strong', desc: 'Throw a shutout as the Red Sox', icon: '💪', category: 'teamSpecific', team: 'redsox' },
  { id: 'sox_25_home', name: 'Sweet Caroline', desc: 'Win 25 home games as the Red Sox', icon: '🎶', category: 'teamSpecific', team: 'redsox', threshold: 25 },

  // ── TEAM-SPECIFIC: TIGERS ──
  { id: 'tigers_win', name: 'Bless You Boys', desc: 'Win a Tigers game', icon: '🐅', category: 'teamSpecific', team: 'tigers' },
  { id: 'tigers_100_games', name: 'Motor City Baseball', desc: 'Play 100 Tigers games', icon: '🏭', category: 'teamSpecific', team: 'tigers', threshold: 100 },
  { id: 'tigers_50_wins', name: 'Tiger Town', desc: 'Win 50 Tigers games', icon: '🏙️', category: 'teamSpecific', team: 'tigers', threshold: 50 },
  { id: 'tigers_10_runs', name: 'Roar of the Crowd', desc: 'Score 10 runs in a game as the Tigers', icon: '🦁', category: 'teamSpecific', team: 'tigers' },
  { id: 'tigers_cg', name: 'Detroit Iron', desc: 'Throw a complete game as the Tigers', icon: '🔩', category: 'teamSpecific', team: 'tigers' },
  { id: 'tigers_25_home', name: 'Michigan Summer', desc: 'Win 25 home games as the Tigers', icon: '🌻', category: 'teamSpecific', team: 'tigers', threshold: 25 },
  { id: 'tigers_4_hr', name: 'Motor City Mashers', desc: 'Hit 4 home runs as the Tigers', icon: '🚗', category: 'teamSpecific', team: 'tigers' },
  { id: 'tigers_18_hits', name: 'Corner Heroes', desc: 'Record 18 hits in a game as the Tigers', icon: '⚾', category: 'teamSpecific', team: 'tigers' },

  // ── TEAM-SPECIFIC: ORIOLES ──
  { id: 'orioles_mem_win', name: 'Birdland', desc: 'Win a game at Memorial Stadium', icon: '🐦', category: 'teamSpecific', team: 'orioles' },
  { id: 'orioles_extras', name: 'Oriole Magic', desc: 'Win in extra innings as the Orioles', icon: '🪄', category: 'teamSpecific', team: 'orioles' },
  { id: 'orioles_100_games', name: 'Charm City', desc: 'Play 100 Orioles games', icon: '🦀', category: 'teamSpecific', team: 'orioles', threshold: 100 },
  { id: 'orioles_50_wins', name: 'Baltimore Baseball', desc: 'Win 50 Orioles games', icon: '⚓', category: 'teamSpecific', team: 'orioles', threshold: 50 },
  { id: 'orioles_3_hr', name: 'Warehouse District', desc: 'Hit 3 home runs as the Orioles', icon: '🏗️', category: 'teamSpecific', team: 'orioles' },
  { id: 'orioles_4_sb', name: 'Chesapeake Charge', desc: 'Steal 4 bases as the Orioles', icon: '🌊', category: 'teamSpecific', team: 'orioles' },
  { id: 'orioles_12_runs', name: 'Orange Crush', desc: 'Score 12 runs as the Orioles', icon: '🟠', category: 'teamSpecific', team: 'orioles' },
  { id: 'orioles_comeback_6', name: 'Maryland Miracle', desc: 'Come back from 6 runs down as the Orioles', icon: '🌟', category: 'teamSpecific', team: 'orioles' },

  // ── TEAM-SPECIFIC: REDS ──
  { id: 'reds_first_game', name: 'First Professional', desc: 'Play a Reds game', icon: '🔴', category: 'teamSpecific', team: 'reds' },
  { id: 'reds_riverfront_win', name: 'Queen City Baseball', desc: 'Win at Riverfront Stadium', icon: '👑', category: 'teamSpecific', team: 'reds' },
  { id: 'reds_100_games', name: 'Along the Ohio', desc: 'Play 100 Reds games', icon: '🚢', category: 'teamSpecific', team: 'reds', threshold: 100 },
  { id: 'reds_50_wins', name: 'Big Red Legacy', desc: 'Win 50 Reds games', icon: '🏆', category: 'teamSpecific', team: 'reds', threshold: 50 },
  { id: 'reds_4_sb', name: 'Riverboat Gambler', desc: 'Steal 4 bases in a game as the Reds', icon: '🎰', category: 'teamSpecific', team: 'reds' },
  { id: 'reds_10_runs', name: 'Machine Memories', desc: 'Score 10+ runs as the Reds', icon: '💥', category: 'teamSpecific', team: 'reds' },
  { id: 'reds_5run_inning', name: 'Cincinnati Chili', desc: 'Score 5 runs in one inning as the Reds', icon: '🍲', category: 'teamSpecific', team: 'reds' },
  { id: 'reds_100_home', name: 'Riverfront Regular', desc: 'Play 100 games at Riverfront', icon: '🏛️', category: 'teamSpecific', team: 'reds', threshold: 100 },

  // ── TEAM-SPECIFIC: ROYALS ──
  { id: 'royals_first_win', name: 'Fountain City', desc: 'Win your first Royals game', icon: '⛲', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_50_wins', name: 'Royal Treatment', desc: 'Win 50 games as Kansas City', icon: '👑', category: 'teamSpecific', team: 'royals', threshold: 50 },
  { id: 'royals_100_wins', name: 'Crown Jewel', desc: 'Win 100 games as Kansas City', icon: '💎', category: 'teamSpecific', team: 'royals', threshold: 100 },
  { id: 'royals_25_home', name: 'Water Works', desc: 'Play 25 games at Royals Stadium', icon: '🌊', category: 'teamSpecific', team: 'royals', threshold: 25 },
  { id: 'royals_george_3', name: "George's Team", desc: 'Win with George Brett recording 3 hits', icon: '🐐', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_balboni_hr', name: 'Bye-Bye', desc: 'Hit a home run with Steve Balboni', icon: '👋', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_4_sb', name: 'Small Ball', desc: 'Steal 4 bases in one game as the Royals', icon: '🏃', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_15_hits', name: 'Kansas City Baseball', desc: 'Record 15 hits as the Royals', icon: '🎯', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_3_hr_at_home', name: 'Fountain Show', desc: 'Hit 3 home runs at Royals Stadium', icon: '🎆', category: 'teamSpecific', team: 'royals' },
  { id: 'royals_zero_errors', name: 'Royals Way', desc: 'Win while committing zero errors as the Royals', icon: '🧹', category: 'teamSpecific', team: 'royals' },

  // ── MULTI-TEAM ──
  { id: 'nl_tour', name: 'National League Tour', desc: 'Win with the Cubs, Mets, Dodgers, Padres, and Reds', icon: '🏟️', category: 'multiTeam' },
  { id: 'al_tour', name: 'American League Tour', desc: 'Win with the Yankees, Red Sox, Tigers, and Orioles', icon: '🏟️', category: 'multiTeam' },
  { id: 'coast_to_coast', name: 'Coast to Coast', desc: 'Win with every team', icon: '🗺️', category: 'multiTeam' },
  { id: 'all_stadiums', name: 'Frequent Flyer', desc: 'Play a game in every stadium', icon: '✈️', category: 'multiTeam' },
  { id: 'games_250_total', name: 'Baseball Traveler', desc: 'Play 250 total games', icon: '🧭', category: 'multiTeam', threshold: 250 },
  { id: 'franchise_hopper', name: 'Franchise Hopper', desc: 'Win 10 games with each team', icon: '🦘', category: 'multiTeam' },
  { id: 'local_hero', name: 'Local Hero', desc: 'Unlock every team-specific achievement for one franchise', icon: '🦸', category: 'multiTeam' },
  { id: 'historian', name: 'Historian', desc: 'Unlock at least one achievement for every team', icon: '📜', category: 'multiTeam' },

  // ── HIDDEN: ROYALS EASTER EGGS ──
  { id: 'easter_fountains', name: 'The Fountains', desc: 'Hear 25 fountain references in Royals games', icon: '⛲', category: 'hidden', threshold: 25 },
  { id: 'easter_fountain_keeper', name: 'Fountain Keeper', desc: 'Rob a home run near the fountains at Royals Stadium', icon: '⛲', category: 'hidden' },

  // ── TEAM-SPECIFIC DEFENSIVE HIDDEN ──
  { id: 'easter_ivy_league', name: 'Ivy League', desc: 'Rob a home run at Wrigley Field', icon: '🌿', category: 'hidden' },
  { id: 'easter_big_red_defense', name: 'Big Red Defense', desc: '3 diving plays in one game as the Reds', icon: '🔴', category: 'hidden' },
  { id: 'easter_shea_magic_rob', name: 'Shea Magic', desc: 'Rob a home run at Shea Stadium', icon: '🍎', category: 'hidden' },
  { id: 'easter_bronx_theft', name: 'Bronx Theft', desc: 'Rob a home run in right field at Yankee Stadium', icon: '🦹', category: 'hidden' },
  { id: 'easter_fenway_leather', name: 'Fenway Leather', desc: 'Make 5 diving catches at Fenway', icon: '🧤', category: 'hidden' },
  { id: 'easter_motor_city_glove', name: 'Motor City Glove', desc: 'Turn a diving stop into a double play as the Tigers', icon: '🐅', category: 'hidden' },
  { id: 'easter_oriole_magic_rob', name: 'Oriole Magic', desc: 'Rob a home run as the Orioles', icon: '🐦', category: 'hidden' },
  { id: 'easter_mission_impossible', name: 'Mission Impossible', desc: 'Rob a home run as the Padres', icon: '✝️', category: 'hidden' },
  { id: 'easter_hollywood_ending_rob', name: 'Hollywood Ending', desc: 'Rob a game-winning home run as the Dodgers', icon: '🎬', category: 'hidden' },

  { id: 'easter_barbecue_ad', name: 'Barbecue Run', desc: 'Hear a Kansas City barbecue advertisement', icon: '🍖', category: 'hidden' },
  { id: 'easter_jazz_night', name: 'Jazz Night', desc: 'Hear a jazz-related Kansas City reference', icon: '🎷', category: 'hidden' },
  { id: 'easter_quiz_save', name: 'Quiz', desc: 'Record a save with Dan Quisenberry', icon: '📊', category: 'hidden' },
  { id: 'easter_submarine', name: 'Submarine', desc: 'Strike out a batter with Dan Quisenberry', icon: '🚢', category: 'hidden' },

  // ── HIDDEN / TIME-BASED ──
  { id: 'night_game', name: 'Night Game', desc: 'Play after 10 PM local time', icon: '🦉', category: 'hidden' },
  { id: 'early_bird', name: 'Early Bird', desc: 'Play before 6 AM', icon: '🐦', category: 'hidden' },
  { id: 'rain_delay_pause', name: 'Rain Delay', desc: 'Stay paused for 15 minutes', icon: '🌧️', category: 'hidden' },
  { id: 'couldnt_put_down', name: "Couldn't Put It Down", desc: 'Play 5 hours without closing', icon: '📖', category: 'hidden' },

  // ── HIDDEN / EASTER EGG (team broadcast events) ──
  { id: 'easter_wrigley_weather', name: 'Wrigley Weather', desc: 'Game includes a wind-related commentary event', icon: '💨', category: 'hidden' },
  { id: 'easter_hollywood_traffic', name: 'Hollywood Traffic', desc: 'California traffic announcement occurs', icon: '🚗', category: 'hidden' },
  { id: 'easter_holy_cow', name: 'Holy Cow!', desc: 'Receive a Harry Caray birthday announcement', icon: '🎂', category: 'hidden' },
  { id: 'easter_scooter', name: 'Scooter Says', desc: 'Receive a Phil Rizzuto off-topic announcement', icon: '🗣️', category: 'hidden' },
  { id: 'easter_riverboat', name: 'Riverboat', desc: 'Hear a barge horn announcement in Cincinnati', icon: '📯', category: 'hidden' },
  { id: 'easter_fenway_faithful', name: 'Fenway Faithful', desc: 'Hear a crowd sing-along announcement', icon: '🎤', category: 'hidden' },
  { id: 'easter_birdland', name: 'Birdland Bonus', desc: 'Fan catches multiple foul balls in Baltimore', icon: '🧤', category: 'hidden' },
  { id: 'easter_motor_city', name: 'Motor City Classic', desc: 'Game includes a vintage Tigers history reference', icon: '🏭', category: 'hidden' },

  // ── ARGUMENTS & EJECTIONS ──
  { id: 'first_argument', name: 'Have a Word', desc: 'First manager argument', icon: '🗣️', category: 'ejection' },
  { id: 'youre_gone', name: "You're Gone!", desc: 'First manager ejection', icon: '👋', category: 'ejection' },
  { id: 'frequent_flyer', name: 'Frequent Flyer', desc: '10 manager ejections', icon: '✈️', category: 'ejection', threshold: 10 },
  { id: 'billy_martin', name: 'Billy Martin Award', desc: '25 manager ejections', icon: '😤', category: 'ejection', threshold: 25 },
  { id: 'earl_weaver', name: 'Earl Weaver Special', desc: 'Get ejected and win anyway', icon: '😈', category: 'ejection' },
  { id: 'dirt_kicker', name: 'Dirt Kicker', desc: 'Kick dirt on home plate', icon: '🦶', category: 'ejection' },
  { id: 'base_thief', name: 'Base Thief', desc: 'Manager removes first base in protest', icon: '🏟️', category: 'ejection' },
  { id: 'bench_tossed', name: 'Didn\'t Even Leave the Dugout', desc: 'Manager ejected from the bench', icon: '🪑', category: 'ejection' },

  // ── HIDDEN / EASTER EGGS ──
  { id: 'reds_streaker', name: 'Riverfront Visitor', desc: 'A most unusual guest interrupts a Reds game', icon: '🏃', category: 'hidden' },

  // ── TEAM-SPECIFIC: PHILLIES ──
  { id: 'phillies_first_win', name: 'Broad Street Believer', desc: 'Win your first Phillies game', icon: '🔴', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_50_wins', name: 'Citizens of Brotherly Love', desc: 'Win 50 games as Philadelphia', icon: '🏆', category: 'teamSpecific', team: 'phillies', threshold: 50 },
  { id: 'phillies_schmidt_hr', name: 'Michael Jack', desc: 'Hit a home run with Mike Schmidt', icon: '💣', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_carlton_k', name: 'Lefty', desc: 'Strike out 10 batters as the Phillies', icon: '🎳', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_vet_win', name: 'South Philly Faithful', desc: 'Win at Veterans Stadium', icon: '🏟️', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_samuel_sb', name: 'Dominican Lightning', desc: 'Steal 3 bases in one game as the Phillies', icon: '⚡', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_15_hits', name: 'Veteran Lineup', desc: 'Record 15 hits in a game as the Phillies', icon: '📋', category: 'teamSpecific', team: 'phillies' },
  { id: 'phillies_comeback', name: 'Ya Gotta Believe (Philly Edition)', desc: 'Win after trailing as the Phillies', icon: '💪', category: 'teamSpecific', team: 'phillies' },

  // ── PHILLIES CARD COLLECTION ──
  { id: 'phi_card_starter', name: 'Phillies Collector', desc: 'Collect 5 Phillies cards', icon: '🎴', category: 'community' },
  { id: 'phi_card_collector', name: 'Half the Roster', desc: 'Collect 11 Phillies cards', icon: '📦', category: 'community' },
  { id: 'phi_complete_roster', name: '1984 Phillies Complete Set', desc: 'Collect all 22 Phillies cards', icon: '🏆', category: 'community' },

  // ── FAN CHATTER ──
  { id: 'fan_chatter_10', name: 'Bleacher Bum', desc: 'Heard 10 fan yells during play', icon: '📣', category: 'fan' },
  { id: 'fan_chatter_50', name: 'Section 36', desc: 'Heard 50 fan yells across games', icon: '🗣️', category: 'fan' },
  { id: 'fan_chatter_100', name: 'Die-Hard', desc: 'Heard 100 fan yells — you never leave early', icon: '🏟️', category: 'fan' },
  { id: 'fan_chatter_ump', name: 'Kill the Ump', desc: 'Heard 10 crowd complaints about the umpire', icon: '😤', category: 'fan' },
  { id: 'fan_chatter_rally', name: 'Rally Crowd', desc: "Heard the crowd yell 'Let's start a rally!' five times", icon: '🚀', category: 'fan' },

  // ── COMPLETIONIST: PLAY AS EVERY TEAM ──
  { id: 'play_all_26', name: 'Around the League', desc: 'Play as all 26 teams', icon: '🗺️', category: 'completionist', threshold: 26 },
  { id: 'win_all_26', name: 'Baseball Historian', desc: 'Win at least one game as all 26 teams', icon: '📚', category: 'completionist', threshold: 26 },
  { id: 'play_al_all', name: 'Junior Circuit', desc: 'Play as every American League team', icon: '🇦', category: 'completionist', threshold: 14 },
  { id: 'play_nl_all', name: 'Senior Circuit', desc: 'Play as every National League team', icon: '🇳', category: 'completionist', threshold: 12 },

  // ── COMPLETIONIST: USE EVERY STARTER ──
  { id: 'use_starters_10', name: 'Rotation Sampler', desc: 'Start 10 different pitchers across your games', icon: '⚾', category: 'completionist', threshold: 10 },
  { id: 'use_starters_25', name: 'Mound Master', desc: 'Start 25 different pitchers across your games', icon: '🎯', category: 'completionist', threshold: 25 },
  { id: 'use_starters_50', name: 'Arm Collector', desc: 'Start 50 different pitchers across your games', icon: '💪', category: 'completionist', threshold: 50 },
  { id: 'use_starters_all', name: 'Every Ace in the Deck', desc: 'Start every starting pitcher in the 1984 MLB', icon: '🃏', category: 'completionist', threshold: 104 },

  // ── COMPLETIONIST: USE EVERY PLAYER ──
  { id: 'use_players_50', name: 'Deep Roster', desc: 'Use 50 different players across your games', icon: '👥', category: 'completionist', threshold: 50 },
  { id: 'use_players_100', name: 'Roster Rover', desc: 'Use 100 different players across your games', icon: '📋', category: 'completionist', threshold: 100 },
  { id: 'use_players_250', name: 'Encyclopedia', desc: 'Use 250 different players across your games', icon: '📖', category: 'completionist', threshold: 250 },
  { id: 'use_players_all', name: 'The 1984 Who\'s Who', desc: 'Use every player in the 1984 MLB database', icon: '🏛️', category: 'completionist', threshold: 650 },

  // ── COMPLETIONIST: CARD COLLECTION ──
  { id: 'cards_team_5', name: 'Rookie Collector', desc: 'Complete the card set for 5 teams', icon: '🎴', category: 'completionist', threshold: 5 },
  { id: 'cards_team_13', name: 'Half the League', desc: 'Complete the card set for 13 teams', icon: '📦', category: 'completionist', threshold: 13 },
  { id: 'cards_team_all', name: 'The Complete 1984 Set', desc: 'Complete every card set for all 26 teams', icon: '🏆', category: 'completionist', threshold: 26 },
  { id: 'cards_manager_5', name: 'Field Generals', desc: 'Collect 5 Manager cards', icon: '📋', category: 'completionist', threshold: 5 },
  { id: 'cards_manager_all', name: 'Meet the Managers', desc: 'Collect all 26 Manager cards', icon: '🤝', category: 'completionist', threshold: 26 },
  { id: 'cards_all_rare', name: 'The Rarest of the Rare', desc: 'Collect every Rare card in the set', icon: '💎', category: 'completionist' },

  // ── COMPLETIONIST: BALLPARK MASTERY ──
  { id: 'ballpark_win_all', name: 'World Traveler', desc: 'Win a game in every 1984 ballpark', icon: '✈️', category: 'completionist', threshold: 26 },

  // ── COMPLETIONIST: SPECIAL MILESTONE ──
  { id: 'the_completionist', name: 'The Completionist', desc: 'Unlock every other completionist achievement', icon: '👑', category: 'completionist' },

  // ── 1984 LEADER CHALLENGES ──
  { id: 'leaders_hr', name: 'Home Run King Challenge', desc: 'Hit a home run with each of the 1984 HR Leaders (10 players)', icon: '💥', category: 'leaders' },
  { id: 'leaders_runs', name: 'Runs Scored Challenge', desc: 'Score a run with each of the 1984 Runs Leaders (11 players)', icon: '🏃', category: 'leaders' },
  { id: 'leaders_rbi', name: 'RBI Challenge', desc: 'Drive in a run with each of the 1984 RBI Leaders (11 players)', icon: '🎯', category: 'leaders' },
  { id: 'leaders_hits', name: 'Hits Challenge', desc: 'Get 10 hits with each of the 1984 Hits Leaders (10 players)', icon: '⚡', category: 'leaders' },
  { id: 'leaders_doubles', name: 'Doubles Challenge', desc: 'Hit a double with each of the 1984 Doubles Leaders (10 players)', icon: '✌️', category: 'leaders' },
  { id: 'leaders_triples', name: 'Triples Challenge', desc: 'Hit a triple with each of the 1984 Triples Leaders (10 players)', icon: '💨', category: 'leaders' },
  { id: 'leaders_sb', name: 'Stolen Base Challenge', desc: 'Steal a base with each of the 1984 SB Leaders (11 players)', icon: '🥷', category: 'leaders' },
  { id: 'leaders_wins', name: 'Wins Challenge', desc: 'Earn a win with each of the 1984 Wins Leaders (10 pitchers)', icon: '🏆', category: 'leaders' },
  { id: 'leaders_saves', name: 'Saves Challenge', desc: 'Record a save with each of the 1984 Saves Leaders (11 pitchers)', icon: '🛡️', category: 'leaders' },
  { id: 'leaders_so', name: 'Strikeout Challenge', desc: 'Strike out 50 batters with each of the 1984 K Leaders (10 pitchers)', icon: '🎳', category: 'leaders' },

  // ── THE GROOVERS ──
  // Unlock by witnessing all 6 rare 1984 Easter eggs:
  //   1. Rainbow-mane horse ballpark event
  //   2. Reds streaker (sombrero, pillow, Spock bust)
  //   3. "I bet I could hit .220" fan chirp (Reds)
  //   4. "I ordered a pound of fries!" fan chirp (Cubs)
  //   5. Clark & Behb Detective Agency TV popup
  //   6. Carmie TV popup
  { id: 'the_groovers', name: 'The Groovers', desc: 'Witness all 6 rare Easter eggs: the rainbow horse, the Riverfront streaker, the .220 guy, the fries guy, Clark & Behb, and Carmie', icon: '🌈', category: 'hidden' },
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
    teamsWon: [],              // teams where user won at least 1 game
    ballparksVisited: [],
    ballparksWon: [],          // ballparks where user won at least 1 game
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
    // Per-team tracking
    teamGames: {},             // { teamKey: count }
    teamWins: {},              // { teamKey: count }
    teamHomeGames: {},         // { teamKey: count }
    teamHomeWins: {},          // { teamKey: count }
    teamRoadWins: {},          // { teamKey: count }
    teamHitsTotal: {},         // { teamKey: cumulative }
    teamWinStreak: {},         // { teamKey: current streak }
    teamBestStreak: {},        // { teamKey: best streak }
    teamStreakReset: {},       // { teamKey: lastOpponent } to detect streak resets
    // Completionist trackers
    pitchersUsed: [],          // unique pitcher names ever used as starter
    playersUsed: [],           // unique player names ever used
    completedTeamSets: [],     // teams where full card set is collected
    managerCardsCollected: [], // teams where manager card collected
    leaderStats: {},           // per-player cumulative stats for 1984 leader achievements
    // Records
    longestHR: 0,              // longest home run (feet) ever hit
    longestHRBatter: '',       // who hit it
    longestHRTeam: '',         // which team
    mostRunsInGame: 0,         // most runs scored in a single game
    mostRunsInGameTeam: '',
    mostRunsInGameOpponent: '',
    largestVictoryMargin: 0,   // biggest win margin
    largestVictoryMarginTeam: '',
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

export function resetAchievements() {
  try {
    localStorage.removeItem(ACH_KEY);
  } catch (e) { /* ignore */ }
}

// ── THE GROOVERS: Track sightings of all 6 rare Easter eggs ──
const GROOVERS_KEY = 'ach_groover_sightings';
const GROOVER_ITEMS = [
  'rainbow_horse',     // ballpark event
  'reds_streaker',     // ballpark event
  'fan_220',           // fan chirp (Reds)
  'fan_fries',         // fan chirp (Cubs)
  'tv_clark_behb',     // National TV popup (tv_511)
  'tv_carmie',         // National TV popup (tv_512)
];

/**
 * Record a sighting of one of the 6 Groover Easter eggs.
 * Unlocks 'the_groovers' when all 6 have been seen.
 * Returns true if the achievement was newly unlocked.
 */
export function trackGrooverSighting(key) {
  if (!GROOVER_ITEMS.includes(key)) return false;
  let sightings = [];
  try {
    const raw = localStorage.getItem(GROOVERS_KEY);
    sightings = raw ? JSON.parse(raw) : [];
  } catch (e) { sightings = []; }
  if (!sightings.includes(key)) {
    sightings.push(key);
    try { localStorage.setItem(GROOVERS_KEY, JSON.stringify(sightings)); } catch (e) {}
  }
  if (sightings.length >= GROOVER_ITEMS.length) {
    return unlockAchievement('the_groovers');
  }
  return false;
}

// All secondary tracking keys used by popup-specific trackers
const SECONDARY_TRACKING_KEYS = [
  'nationalCharityViewed',
  'electronicsViewed',
  'generalProductsViewed',
  'detroitTigersBannerViewed',
  'tigersStadiumViewed',
  'philliesBannerViewed',
  'redSoxBannerViewed',
  'cubsBannerViewed',
  GROOVERS_KEY,
];

export function resetAllData() {
  try {
    localStorage.removeItem(ACH_KEY);
    localStorage.removeItem(STATS_KEY);
    SECONDARY_TRACKING_KEYS.forEach(key => localStorage.removeItem(key));
  } catch (e) { /* ignore */ }
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
export function trackGameCompleted(userWon, userTeam, opponentTeam, stadiumName, userHitCount, opponentHitCount, isHomeGame = true) {
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
  if (userWon && userTeam && !stats.teamsWon.includes(userTeam)) stats.teamsWon.push(userTeam);

  // Track ballparks
  if (stadiumName && !stats.ballparksVisited.includes(stadiumName)) stats.ballparksVisited.push(stadiumName);
  if (userWon && stadiumName && !stats.ballparksWon.includes(stadiumName)) stats.ballparksWon.push(stadiumName);

  // Per-team tracking
  if (userTeam) {
    stats.teamGames[userTeam] = (stats.teamGames[userTeam] || 0) + 1;
    stats.teamHomeGames[userTeam] = (stats.teamHomeGames[userTeam] || 0) + (isHomeGame ? 1 : 0);
    stats.teamHitsTotal[userTeam] = (stats.teamHitsTotal[userTeam] || 0) + (userHitCount || 0);

    // Team win streak
    const prevStreakTeam = stats.teamStreakReset?.[userTeam];
    if (userWon) {
      stats.teamWinStreak[userTeam] = (stats.teamWinStreak[userTeam] || 0) + 1;
      if ((stats.teamWinStreak[userTeam] || 0) > (stats.teamBestStreak[userTeam] || 0)) {
        stats.teamBestStreak[userTeam] = stats.teamWinStreak[userTeam];
      }
      stats.teamWins[userTeam] = (stats.teamWins[userTeam] || 0) + 1;
      if (isHomeGame) {
        stats.teamHomeWins[userTeam] = (stats.teamHomeWins[userTeam] || 0) + 1;
      } else {
        stats.teamRoadWins[userTeam] = (stats.teamRoadWins[userTeam] || 0) + 1;
      }
    } else {
      stats.teamWinStreak[userTeam] = 0;
    }
    stats.teamStreakReset[userTeam] = opponentTeam;

    // Team games thresholds
    checkThreshold('cubs_100_wins', stats.teamWins['cubs'] || 0);
    checkThreshold('yanks_100_wins', stats.teamWins['yankees'] || 0);
    checkThreshold('mets_50_wins', stats.teamWins['mets'] || 0);
    checkThreshold('dodgers_50_wins', stats.teamWins['dodgers'] || 0);
    checkThreshold('padres_50_wins', stats.teamWins['padres'] || 0);
    checkThreshold('sox_100_wins', stats.teamWins['redsox'] || 0);
    checkThreshold('tigers_50_wins', stats.teamWins['tigers'] || 0);
    checkThreshold('orioles_50_wins', stats.teamWins['orioles'] || 0);
    checkThreshold('reds_50_wins', stats.teamWins['reds'] || 0);
    checkThreshold('royals_50_wins', stats.teamWins['royals'] || 0);
    checkThreshold('royals_100_wins', stats.teamWins['royals'] || 0);
    checkThreshold('phillies_50_wins', stats.teamWins['phillies'] || 0);
    checkThreshold('royals_25_home', stats.teamHomeGames['royals'] || 0);

    // Cumulative team stats
    checkThreshold('yanks_2000_hits', stats.teamHitsTotal['yankees'] || 0);
    checkThreshold('sox_10_doubles', stats.teamHitsTotal['redsox'] || 0);

    // Team games played
    checkThreshold('mets_100_games', stats.teamGames['mets'] || 0);
    checkThreshold('padres_100_games', stats.teamGames['padres'] || 0);
    checkThreshold('sox_100_games', stats.teamGames['redsox'] || 0);
    checkThreshold('tigers_100_games', stats.teamGames['tigers'] || 0);
    checkThreshold('orioles_100_games', stats.teamGames['orioles'] || 0);
    checkThreshold('reds_100_games', stats.teamGames['reds'] || 0);

    // Team home games
    checkThreshold('cubs_25_home', stats.teamHomeWins['cubs'] || 0);
    checkThreshold('sox_25_home', stats.teamHomeWins['redsox'] || 0);
    checkThreshold('tigers_25_home', stats.teamHomeWins['tigers'] || 0);
    checkThreshold('dodgers_100_home', stats.teamHomeGames['dodgers'] || 0);
    checkThreshold('reds_100_home', stats.teamHomeGames['reds'] || 0);

    // Team streaks
    checkThreshold('yanks_10_streak', stats.teamWinStreak['yankees'] || 0);

    // Team road wins
    checkThreshold('dodgers_10_road', stats.teamRoadWins['dodgers'] || 0);
  }

  // Games completed thresholds
  checkThreshold('games_1', stats.gamesCompleted);
  checkThreshold('games_2', stats.gamesCompleted);
  checkThreshold('games_10', stats.gamesCompleted);
  checkThreshold('games_25', stats.gamesCompleted);
  checkThreshold('games_50', stats.gamesCompleted);
  checkThreshold('games_100', stats.gamesCompleted);
  checkThreshold('games_250', stats.gamesCompleted);
  checkThreshold('games_250_total', stats.gamesCompleted);
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

  // Completionist: teams played/won
  checkThreshold('play_all_26', stats.teamsUsed.length);
  checkThreshold('win_all_26', stats.teamsWon.length);
  checkThreshold('ballpark_win_all', stats.ballparksWon.length);
  // AL/NL teams played
  const AL_TEAMS_C = ['tigers','redsox','yankees','orioles','brewers','bluejays','indians','angels','royals','twins','mariners','whitesox','rangers','athletics'];
  const NL_TEAMS_C = ['padres','cubs','mets','dodgers','cardinals','braves','astros','expos','phillies','pirates','reds','giants'];
  const playedAL = AL_TEAMS_C.filter(t => stats.teamsUsed.includes(t)).length;
  const playedNL = NL_TEAMS_C.filter(t => stats.teamsUsed.includes(t)).length;
  checkThreshold('play_al_all', playedAL);
  checkThreshold('play_nl_all', playedNL);

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

  // Multi-team: Franchise Hopper (10 wins with each team)
  checkFranchiseHopper(stats);

  saveStats(stats);
}

// Track home run distance records and achievements
export function trackHomeRunDistance(distance, batterName, teamKey) {
  if (!distance || distance <= 0) return;
  const stats = loadStats();
  let newRecord = false;
  if (distance > (stats.longestHR || 0)) {
    stats.longestHR = distance;
    stats.longestHRBatter = batterName || '';
    stats.longestHRTeam = teamKey || '';
    newRecord = true;
  }
  saveStats(stats);

  // Unlock distance achievements
  if (distance >= 400) unlockAchievement('hr_400ft');
  if (distance >= 425) unlockAchievement('hr_425ft');
  if (distance >= 450) unlockAchievement('hr_450ft');
  if (distance >= 475) unlockAchievement('hr_475ft');
  if (distance >= 500) unlockAchievement('no_doubter');

  return newRecord;
}

// Track game-level records (runs scored, victory margin)
export function trackGameRecords(userScore, opponentScore, userWon, userTeam, opponentTeam) {
  const stats = loadStats();
  let changed = false;
  if (userScore > (stats.mostRunsInGame || 0)) {
    stats.mostRunsInGame = userScore;
    stats.mostRunsInGameTeam = userTeam || '';
    stats.mostRunsInGameOpponent = opponentTeam || '';
    changed = true;
  }
  if (userWon && (userScore - opponentScore) > (stats.largestVictoryMargin || 0)) {
    stats.largestVictoryMargin = userScore - opponentScore;
    stats.largestVictoryMarginTeam = userTeam || '';
    changed = true;
  }
  if (changed) saveStats(stats);
}

// Track which players/pitchers were used (call at game end with arrays of names)
export function trackPlayersUsed(playerNames, starterPitcherNames) {
  const stats = loadStats();
  if (!stats.pitchersUsed) stats.pitchersUsed = [];
  if (!stats.playersUsed) stats.playersUsed = [];

  let changed = false;
  (playerNames || []).forEach(n => {
    if (n && !stats.playersUsed.includes(n)) { stats.playersUsed.push(n); changed = true; }
  });
  (starterPitcherNames || []).forEach(n => {
    if (n && !stats.pitchersUsed.includes(n)) { stats.pitchersUsed.push(n); changed = true; }
  });

  if (changed) {
    checkThreshold('use_starters_10', stats.pitchersUsed.length);
    checkThreshold('use_starters_25', stats.pitchersUsed.length);
    checkThreshold('use_starters_50', stats.pitchersUsed.length);
    checkThreshold('use_starters_all', stats.pitchersUsed.length);
    checkThreshold('use_players_50', stats.playersUsed.length);
    checkThreshold('use_players_100', stats.playersUsed.length);
    checkThreshold('use_players_250', stats.playersUsed.length);
    checkThreshold('use_players_all', stats.playersUsed.length);
    saveStats(stats);
  }
}

// Track card collection completions
export function trackCardSetCompleted(teamKey, isManagerCard) {
  const stats = loadStats();
  if (!stats.completedTeamSets) stats.completedTeamSets = [];
  if (!stats.managerCardsCollected) stats.managerCardsCollected = [];

  if (isManagerCard) {
    if (!stats.managerCardsCollected.includes(teamKey)) {
      stats.managerCardsCollected.push(teamKey);
      checkThreshold('cards_manager_5', stats.managerCardsCollected.length);
      checkThreshold('cards_manager_all', stats.managerCardsCollected.length);
      saveStats(stats);
    }
  } else {
    if (!stats.completedTeamSets.includes(teamKey)) {
      stats.completedTeamSets.push(teamKey);
      checkThreshold('cards_team_5', stats.completedTeamSets.length);
      checkThreshold('cards_team_13', stats.completedTeamSets.length);
      checkThreshold('cards_team_all', stats.completedTeamSets.length);
      // Check super completionist
      if (stats.completedTeamSets.length >= 26 && stats.managerCardsCollected.length >= 26) {
        unlockAchievement('the_completionist');
      }
      saveStats(stats);
    }
  }
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

// ── Defensive Play Tracking ──
function trackDivingCatches(count) {
  const stats = loadStats();
  stats.divingCatches = (stats.divingCatches || 0) + count;
  checkThreshold('web_gems_5', stats.divingCatches);
  checkThreshold('human_vacuum', stats.divingCatches);
  saveStats(stats);
}

function trackDivingStops(count) {
  const stats = loadStats();
  stats.divingStops = (stats.divingStops || 0) + count;
  checkThreshold('vacuum_25', stats.divingStops);
  checkThreshold('gold_glove_candidate', stats.divingStops);
  saveStats(stats);
}

function trackHRRobberies(count) {
  const stats = loadStats();
  stats.hrRobberies = (stats.hrRobberies || 0) + count;
  checkThreshold('fence_patrol', stats.hrRobberies);
  checkThreshold('gold_glove_def', stats.hrRobberies);
  saveStats(stats);
}

// ── In-game achievement checker (called when game ends) ──

export function checkGameAchievements(gameState, userTeam) {
  const newlyUnlocked = [];
  const u = (id) => { if (unlockAchievement(id)) newlyUnlocked.push(id); };

  // Determine user side from team key (supports both 'home'/'away' legacy and team key like 'cubs')
  let userSide;
  if (userTeam === 'home' || userTeam === 'away') {
    userSide = userTeam;
  } else if (gameState.homeTeam === userTeam) {
    userSide = 'home';
  } else if (gameState.awayTeam === userTeam) {
    userSide = 'away';
  } else {
    userSide = 'home'; // fallback
  }
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
  const userHitsAll = allUserPlayers.reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);

  const log = gameState.log || [];
  const logText = log.map(l => l.text).join(' ');
  const userNames = allUserPlayers.map(p => p.name);

  // Pre-compute values used throughout (must be before any usage below)
  const teamKey = userTeam && userTeam !== 'home' && userTeam !== 'away' ? userTeam : (userSide === 'home' ? gameState.homeTeam : gameState.awayTeam);
  const stadium = (TEAMS[gameState.homeTeam] || {}).stadium || '';
  const totalHR = allUserPlayers.reduce((sum, p) => sum + (p.gameStats?.hr || 0), 0);

  // ── FIRST-TIME ──
  u('play_ball');
  if (allUserPlayers.some(p => (p.gameStats?.hits || 0) > 0)) u('batter_up');
  // Crossed the Plate: check gameStats AND log for scoring mentions
  const userScoredLog = log.filter(l => {
    if (!l.text) return false;
    const mentionsScore = /scores/i.test(l.text) || /HOME RUN/i.test(l.text);
    if (!mentionsScore) return false;
    return userNames.some(n => l.text.includes(n));
  }).length > 0;
  if (allUserPlayers.some(p => (p.gameStats?.runs || 0) > 0) || (userScore > 0 && userScoredLog)) {
    u('crossed_plate');
  }
  if (logText.includes('double play') && userIsFielding(gameState, userSide, log)) u('around_horn');
  // Three up, three down: check for any inning with 0 runs allowed + no baserunner log entries
  const hadCleanInning = checkCleanInning(gameState, userSide, log);
  if (hadCleanInning) u('three_up_down');
  if (userWon) u('ballgame');

  // ── HITTING (user team only) ──
  // userNames already defined above
  if (log.some(l => l.type === 'single' && l.text && (l.text.includes('infield single') || l.text.includes('beats it out')) && userNames.some(n => l.text.includes(n)))) u('infield_hit');
  if (log.some(l => l.type === 'double' && l.text && userNames.some(n => l.text.includes(n)))) u('gap_power');
  if (log.some(l => l.type === 'triple' && l.text && userNames.some(n => l.text.includes(n)))) u('legs_for_days');
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

  if (allUserPlayers.some(p => (p.gameStats?.hr || 0) > 0 && (p.gameStats?.rbi || 0) >= 4) || log.filter(l => l.type === 'homerun' && l.text && l.text.includes('GRAND SLAM') && userNames.some(n => l.text.includes(n))).length > 0) u('grand_salami');
  if (userWon && logText.includes('Walk-off')) u('walk_off_hero');

  // ── PITCHING ──
  const totalUserSO = userPitchers.reduce((sum, p) => sum + (p.gameStats?.so || 0), 0);
  if (totalUserSO > 0) u('punchout');
  if (totalUserSO >= 10) u('k_artist');
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
  // ── DEFENSE (user team fielding) ──
  const userIsFielder = userIsFielding(gameState, userSide, log);
  // Frozen Rope: user's pitchers struck out the side (user is PITCHING, not fielding)
  if (logText.includes('strike out the side') || logText.includes('struck out the side')) u('frozen_rope');
  if (userIsFielder && (logText.includes('thrown out at home') || logText.includes('nailed at the plate'))) u('cannon_arm');
  if (userIsFielder && log.some(l => l.type === 'caughtstealing')) u('caught_stealing');
  if (userIsFielder && logText.includes('double play')) u('twin_killing');
  if (userIsFielder && (logText.includes('5-4-3') || logText.includes('6-4-3') || logText.includes('Six-four-three') || logText.includes('Around the horn for two') || logText.includes('around the horn for two'))) u('around_horn_dp');

  // ── DIVING CATCHES ──
  const divingCatchCount = log.filter(l => l.type === 'flyout' && l.text && l.text.includes('🧤')).length;
  const hasDivingCatch = divingCatchCount > 0 || (userIsFielder && (logText.includes('laid out') || logText.includes('Full extension') || logText.includes('diving catch')));
  if (hasDivingCatch) {
    u('leather_glove');
    u('full_extension');
    u('lay_out');
    trackDivingCatches(Math.max(1, divingCatchCount));
    if (divingCatchCount >= 3) u('air_traffic');
  }

  // ── DIVING GROUND-BALL STOPS ──
  // Detect by 🧤 emoji on groundout/single entries (stops emit these)
  const divingStopLogs = log.filter(l => l.text && l.text.includes('🧤') && (l.type === 'groundout' || l.type === 'single'));
  const divingStopCount = divingStopLogs.length;
  const hasDivingStop = divingStopCount > 0;
  if (hasDivingStop) {
    u('first_stop');
    // Hot Corner: any diving stop where the fielder was at 3B
    if (divingStopLogs.some(l => l.divingStopPos === '3B')) u('hot_corner');
    // Wizardry: diving stop that resulted in an out (type='groundout' with 🧤, or divingStopOut flag)
    if (divingStopLogs.some(l => l.type === 'groundout' || l.divingStopOut)) u('wizardry');
    // Save the Pitcher: diving stop that saved extra bases (save type)
    if (divingStopLogs.some(l => l.divingStopSave)) u('save_the_pitcher');
    trackDivingStops(Math.max(1, divingStopCount));
    // Motor City Glove: diving stop turned into DP as Tigers
    if (teamKey === 'tigers' && logText.includes('double play') && divingStopLogs.length > 0) u('easter_motor_city_glove');
  }

  // ── HR ROBBERY ──
  const hasRobbery = userIsFielder && (logText.includes('robbed a home run') || logText.includes('took a home run away') || logText.includes('TOOK A HOME RUN') || logText.includes('stole a home run') || logText.includes('stole a homer') || logText.includes('home run robbery') || logText.includes('robs') && logText.includes('home run'));
  if (hasRobbery) {
    u('web_gem');
    // Check if robbery had runners aboard
    const runnersAboard = log.some(l => l.text && l.text.includes('robbed') && (l.text.includes('with runners') || logText.includes('run hom') && !logText.includes('solo')));
    if (runnersAboard || (gameState.bases.some(b => b !== null) && logText.includes('robbed'))) u('grand_theft_homer');
    // Rob and win
    if (userWon) u('bring_it_back');
    // Human Highlight Reel: rob HR and hit one
    if (totalHR >= 1) u('highlight_reel');
    // Track cumulative robberies
    trackHRRobberies(1);
    // Team-specific
    if (teamKey === 'mets' && stadium === 'Shea Stadium') u('easter_shea_magic_rob');
    if (teamKey === 'yankees' && (logText.includes('right field') || logText.includes('short porch'))) u('easter_bronx_theft');
    if (teamKey === 'orioles') u('easter_oriole_magic_rob');
    if (teamKey === 'padres') u('easter_mission_impossible');
    if (teamKey === 'royals') u('easter_fountain_keeper');
    // Hollywood Ending: rob game-winning HR
    if (teamKey === 'dodgers' && userWon && userScore - opponentScore <= 2) u('easter_hollywood_ending_rob');
    // No Souvenir: any robbery
    u('no_souvenir');
    // Highway Robbery: game-tying situation (score was close)
    if (Math.abs(userScore - opponentScore) <= 2) u('highway_robbery');
  }

  // ── Fenway Leather: 5 diving catches as Red Sox ──
  if (teamKey === 'redsox' && userIsFielder && divingCatchCount >= 5) u('easter_fenway_leather');
  // Big Red Defense: 3 diving plays (catches + stops) in one game as Reds
  if (teamKey === 'reds' && userIsFielder && (divingCatchCount + divingStopCount) >= 3) u('easter_big_red_defense');

  // ── COMEBACKS ──
  const maxDeficit = computeMaxDeficit(gameState, userSide);
  if (userWon && maxDeficit >= 3) u('never_quit');
  if (userWon && maxDeficit >= 5) u('cardiac_kids');
  if (userWon && gameState.inning >= 9 && maxDeficit > 0) u('last_chance');
  if (userWon && gameState.inning > 9) u('extra_baseball');
  if (userWon && (logText.includes('Walk-off') || logText.includes('walk-off'))) u('bottom_ninth');

  // ── FUNNY ──
  const userKs = {};
  allUserPlayers.forEach(p => { if (p.gameStats?.so) userKs[p.name] = p.gameStats.so; });
  if (Object.values(userKs).some(k => k >= 4)) u('golden_sombrero');
  if (Object.values(userKs).some(k => k >= 3)) u('silver_sombrero');
  if (userIsFielder && logText.includes('error') && (logText.match(/error/gi) || []).length >= 3) u('oops');
  if (allUserPlayers.some(p => p.gameStats?.runs > 0) && logText.includes('reaches on an error')) u('little_league');
  if (gameState.inning >= 15) u('free_baseball');
  // Beanball: HBP by user pitcher
  const userP = currentPitcher;
  const hbpCount = (logText.match(/hit by the pitch/gi) || []).length;
  if (userIsFielder && hbpCount >= 3) u('beanball');

  // ── 1984-THEMED ──
  u('like_its_1984');

  // Small ball: scored a run without a hit (user team only)
  if (userScore > 0 && logText.includes('scores') && (logText.includes('bunt') || logText.includes('sacrifice fly') || logText.includes('steals home'))) u('small_ball');
  const allSB = allUserPlayers.reduce((sum, p) => sum + (p.gameStats?.sb || 0), 0);
  if (allSB >= 5) u('whitey_ball');
  // The Wizard: 10+ assists by user SS
  if (userIsFielder && (logText.match(/to short/gi) || []).length >= 10) u('the_wizard');
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

  // ── VICTORY TRADITIONS ──
  if (userWon && userSide === 'home') {
    if (teamKey === 'cubs') { u('fly_the_w'); u('cubs_win_cubs_win'); }
    if (teamKey === 'yankees') u('start_spreading');
    if (teamKey === 'athletics') u('celebration_time');
    if (teamKey === 'brewers') u('bernie_slide');
    if (teamKey === 'tigers') u('bless_you_boys');
    if (teamKey === 'mets') u('meet_the_mets');
    if (teamKey === 'cardinals') u('thats_a_winner');
    if (teamKey === 'reds') u('that_belongs_to_reds');
  }
  if (userWon && teamKey === 'angels') u('halo_shines');
  if (userWon && teamKey === 'orioles' && (maxDeficit > 0 || logText.includes('Walk-off') || gameState.inning > 9)) u('orioles_magic');
  if (userWon && teamKey === 'pirates' && (logText.includes('Walk-off') || logText.includes('walk-off'))) u('we_are_family');
  if (userWon && teamKey === 'padres' && (gameState.awayTeam === 'cubs' || gameState.homeTeam === 'cubs')) u('cub_busters');

  // ───────────────────────────────────────────────────
  // ── TEAM-SPECIFIC ACHIEVEMENTS (user team only) ──
  // ───────────────────────────────────────────────────

  // ── CUBS ──
  if (teamKey === 'cubs') {
    if (userWon && stadium === 'Wrigley Field') u('cubs_wrigley_win');
    if (totalHR >= 3) u('cubs_3_hr');
    if (userWon && maxDeficit > 0) u('cubs_comeback');
    if (userScore >= 10 && stadium === 'Wrigley Field') u('cubs_10_runs');
    if (userHitsAll >= 15) u('cubs_15_hits');
    if (userWon && (logText.includes('Walk-off') || logText.includes('walk-off'))) u('cubs_walkoff');
  }

  // ── YANKEES ──
  if (teamKey === 'yankees') {
    if (totalHR >= 4) u('yanks_4_hr');
    if (opponentScore === 0) u('yanks_shutout');
    if (userScore >= 12) u('yanks_12_runs');
    if (userWon && userPitchers.some(p => (p.gameStats?.so || 0) >= 15) || allOppPlayers.reduce((s, p) => s + (p.gameStats?.so || 0), 0) >= 15) u('yanks_15_so');
    // Murderers' Row: every starter (starting lineup, up to 9) has at least 1 hit
    const starters = userLineup.slice(0, 9);
    if (starters.length >= 9 && starters.every(p => (p.gameStats?.hits || 0) > 0)) u('yanks_all_hit');
  }

  // ── METS ──
  if (teamKey === 'mets') {
    if (userWon && gameState.inning > 9) u('mets_extras');
    if (userWon && maxDeficit >= 5) u('mets_comeback_5');
    if (userHitsAll >= 20) u('mets_20_hits');
    // Win despite 3+ errors
    const userErrorCount = (logText.match(/error/gi) || []).length;
    if (userWon && userErrorCount >= 3) u('mets_3_errors_win');
    // Wall-scraper HR (ballpark quirk or 'barely clears' in commentary)
    if (logText.includes('barely clears') || logText.includes('short porch') || logText.includes('Pesky')) u('mets_wall_scraper');
    // Win after trailing entering 8th
    if (userWon && didTrailAfterInning(gameState, userSide, 7)) u('mets_late_comeback');
  }

  // ── DODGERS ──
  if (teamKey === 'dodgers') {
    if (userWon && stadium === 'Dodger Stadium') u('dodgers_ds_win');
    if (userPitchers.some(p => (p.gameStats?.ip || 0) >= 9)) u('dodgers_cg');
    if (userWon && (logText.includes('Walk-off') || logText.includes('walk-off'))) u('dodgers_walkoff');
    if (oppHits === 1 && gameState.inning >= 9) u('dodgers_1_hit');
    if (userPitchers.some(p => (p.gameStats?.so || 0) >= 12) || allOppPlayers.reduce((s, p) => s + (p.gameStats?.so || 0), 0) >= 12) u('dodgers_12_so');
  }

  // ── PADRES ──
  if (teamKey === 'padres') {
    if (userWon && stadium === 'Jack Murphy Stadium') u('padres_murph_win');
    if (userWon && gameState.weather?.isDay !== false) u('padres_day_win');
    // 3 doubles
    const doubleCount = log.filter(l => l.type === 'double' && l.text && userNames.some(n => l.text.includes(n))).length;
    if (doubleCount >= 3) u('padres_3_doubles');
    if (allSB >= 5) u('padres_5_sb');
    if (userHitsAll >= 15) u('padres_15_hits');
    if (userWon && maxDeficit >= 4) u('padres_comeback_4');
  }

  // ── RED SOX ──
  if (teamKey === 'redsox') {
    if (userWon && stadium === 'Fenway Park') u('sox_fenway_win');
    if (userScore >= 15) u('sox_15_runs');
    if (opponentScore === 0) u('sox_shutout');
    // Pesky's Pole: HR down the RF line at Fenway
    if (stadium === 'Fenway Park' && logText.includes("Pesky's Pole") || logText.includes('right field foul pole') && logText.includes('home run')) u('sox_pole_hr');
  }

  // ── TIGERS ──
  if (teamKey === 'tigers') {
    if (userWon) u('tigers_win');
    if (userScore >= 10) u('tigers_10_runs');
    if (userPitchers.some(p => (p.gameStats?.ip || 0) >= 9)) u('tigers_cg');
    if (totalHR >= 4) u('tigers_4_hr');
    if (userHitsAll >= 18) u('tigers_18_hits');
  }

  // ── ORIOLES ──
  if (teamKey === 'orioles') {
    if (userWon && stadium === 'Memorial Stadium') u('orioles_mem_win');
    if (userWon && gameState.inning > 9) u('orioles_extras');
    if (totalHR >= 3) u('orioles_3_hr');
    if (allSB >= 4) u('orioles_4_sb');
    if (userScore >= 12) u('orioles_12_runs');
    if (userWon && maxDeficit >= 6) u('orioles_comeback_6');
  }

  // ── REDS ──
  if (teamKey === 'reds') {
    u('reds_first_game');
    if (userWon && stadium === 'Riverfront Stadium') u('reds_riverfront_win');
    if (allSB >= 4) u('reds_4_sb');
    if (userScore >= 10) u('reds_10_runs');
    // 5-run inning
    const had5RunInning = checkFiveRunInning(gameState, userSide);
    if (had5RunInning) u('reds_5run_inning');
  }

  // ── PHILLIES ──
  if (teamKey === 'phillies') {
    if (userWon) u('phillies_first_win');
    if (userWon && stadium === 'Veterans Stadium') u('phillies_vet_win');
    if (userWon && maxDeficit > 0) u('phillies_comeback');
    if (userHitsAll >= 15) u('phillies_15_hits');
    if (allSB >= 3) u('phillies_samuel_sb');
    const schmidt = allUserPlayers.find(p => p.name === 'Mike Schmidt');
    if (schmidt && (schmidt.gameStats?.hr || 0) > 0) u('phillies_schmidt_hr');
    if (totalUserSO >= 10) u('phillies_carlton_k');
  }

  // ── ROYALS ──
  if (teamKey === 'royals') {
    if (userWon) u('royals_first_win');
    if (totalHR >= 3 && stadium === 'Royals Stadium') u('royals_3_hr_at_home');
    if (allSB >= 4) u('royals_4_sb');
    if (userHitsAll >= 15) u('royals_15_hits');
    const royalsErrorCount = (logText.match(/error/gi) || []).length;
    if (userWon && royalsErrorCount === 0) u('royals_zero_errors');
    // George Brett: 3+ hits
    const brett = allUserPlayers.find(p => p.name === 'George Brett');
    if (brett && (brett.gameStats?.hits || 0) >= 3 && userWon) u('royals_george_3');
    // Balboni HR
    const balboni = allUserPlayers.find(p => p.name === 'Steve Balboni');
    if (balboni && (balboni.gameStats?.hr || 0) > 0) u('royals_balboni_hr');
  }

  // ────────────────────────────────────────────
  // ── HIDDEN / EASTER EGG CHECKS ──
  // ────────────────────────────────────────────
  // Wrigley Weather: wind-related commentary
  if ((logText.includes('wind is blowing') || logText.includes('wind blowing') || logText.includes('wind off the lake')) &&
      (stadium === 'Wrigley Field' || gameState.homeTeam === 'cubs')) u('easter_wrigley_weather');
  // Hollywood Traffic: California traffic mention
  if ((logText.includes('freeway') || logText.includes('traffic') && logText.includes('Los Angeles')) &&
      (teamKey === 'dodgers' || teamKey === 'padres')) u('easter_hollywood_traffic');
  // Holy Cow: Harry Caray birthday
  if (logText.includes('birthday') && (gameState.homeTeam === 'cubs' || teamKey === 'cubs')) u('easter_holy_cow');
  // Scooter Says: Rizzuto off-topic
  if ((logText.includes('Holy cow') || logText.includes('Scooter says')) && (teamKey === 'yankees' || gameState.homeTeam === 'yankees')) u('easter_scooter');
  // Riverboat: barge horn in Cincinnati
  if ((logText.includes('barge') || logText.includes('riverboat')) && (teamKey === 'reds' || gameState.homeTeam === 'reds')) u('easter_riverboat');
  // Fenway Faithful: crowd sing-along
  if ((logText.includes('Sweet Caroline') || logText.includes('crowd belts') || logText.includes('sing-along')) &&
      (stadium === 'Fenway Park' || gameState.homeTeam === 'redsox')) u('easter_fenway_faithful');
  // Reds Streaker Easter Egg
  if (logText.includes('sombrero') && logText.includes('Spock') && (teamKey === 'reds' || gameState.homeTeam === 'reds' || gameState.awayTeam === 'reds')) u('reds_streaker');

  // Birdland Bonus: multiple foul balls in Baltimore
  if ((logText.match(/foul ball/gi) || []).length >= 3 && (teamKey === 'orioles' || gameState.homeTeam === 'orioles')) u('easter_birdland');
  // Motor City Classic: vintage Tigers reference
  if ((logText.includes('Ernie Harwell') && logText.includes('years ago')) && (teamKey === 'tigers' || gameState.homeTeam === 'tigers')) u('easter_motor_city');

  // ── VERY RARE ──
  if (userScore >= 21) u('twenty_one_guns');
  if (userWon && (userScore - opponentScore) >= 15) u('mercy');
  // Immaculate inning: 9 pitches, 3 Ks in one inning — check log
  if (logText.includes('immaculate') || logText.includes('9 pitches')) u('immaculate');
  if (totalHR >= 5) u('four_bagger_frenzy');
  if (log.filter(l => l.type === 'homerun' && l.text && l.text.includes('500') && userNames.some(n => l.text.includes(n))).length > 0) u('no_doubter');

  // ── BLOWOUT & MISCELLANEOUS FUN ──
  // Blowout Broadcast: announcers start chatting (game in 8th+ with 8+ run margin)
  if (gameState.inning >= 8 && Math.abs(userScore - opponentScore) >= 8) u('blowout_broadcast');
  // Laugher: win by 10+
  if (userWon && (userScore - opponentScore) >= 10) u('laugher');
  // Shellacked: lose by 10+
  if (!userWon && (opponentScore - userScore) >= 10) u('shellacked');
  // Crooked Number: 5+ runs in one inning
  if (checkFiveRunInning(gameState, userSide)) u('crooked_number');
  // Ten-Spot: score 10+ runs
  if (userScore >= 10) u('ten_spot');
  // Pitcher's Duel: win 1-0
  if (userWon && userScore === 1 && opponentScore === 0) u('pitching_duel');
  // Double Digit Drubbing: allow 10+ runs
  if (opponentScore >= 10) u('double_digits_drubbing');
  // Heart of the Order: 3-4-5 hitters each with RBI
  const order345 = userLineup.filter(p => p.order === 3 || p.order === 4 || p.order === 5);
  if (order345.length >= 3 && order345.every(p => (p.gameStats?.rbi || 0) > 0)) u('heart_of_the_order');
  // Oppo Taco: opposite field HR mentioned in log
  if (logText.includes('opposite field') && logText.includes('home run') && userNames.some(n => logText.includes(n))) u('oppo_taco');
  // Seven Innings Plus: had a lead after 7 innings
  if (!didTrailAfterInning(gameState, userSide, 7) && computeMaxDeficit(gameState, userSide) <= 0) u('seven_innings_plus');

  // ── 1984 LEADER CHALLENGES (cumulative per-player tracking) ──
  trackLeaderAchievements(allUserPlayers, userPitchers, log, userWon, userScore, opponentScore, u);

  return newlyUnlocked;
}

// ── 1984 Leader Achievement Tracking ──
// Accumulates per-player stats across games and unlocks when every player on a list meets the threshold
function trackLeaderAchievements(allUserPlayers, userPitchers, log, userWon, userScore, opponentScore, unlockFn) {
  const stats = loadStats();
  if (!stats.leaderStats) stats.leaderStats = {};
  const ls = stats.leaderStats;

  // Build per-player game stat map for hitters
  const hitterGameStats = {};
  allUserPlayers.forEach(p => {
    if (!p || !p.name) return;
    const gs = p.gameStats || {};
    hitterGameStats[p.name] = {
      hits: gs.hits || 0,
      hr: gs.hr || 0,
      rbi: gs.rbi || 0,
      runs: gs.runs || 0,
      sb: gs.sb || 0,
      doubles: 0,
      triples: 0,
    };
  });

  // Count doubles and triples from log (by play type + player name)
  (log || []).forEach(l => {
    if (!l.text) return;
    if (l.type === 'double') {
      Object.keys(hitterGameStats).forEach(name => {
        if (l.text.includes(name)) hitterGameStats[name].doubles++;
      });
    }
    if (l.type === 'triple') {
      Object.keys(hitterGameStats).forEach(name => {
        if (l.text.includes(name)) hitterGameStats[name].triples++;
      });
    }
  });

  // --- Hitter stats: accumulate and check ---
  const hitterConfigs = ['hr', 'runs', 'rbi', 'hits', 'doubles', 'triples', 'sb'];
  hitterConfigs.forEach(statType => {
    const config = LEADER_LISTS[statType];
    if (!ls[config.statKey]) ls[config.statKey] = {};
    const store = ls[config.statKey];

    config.players.forEach(playerName => {
      const gs = hitterGameStats[playerName];
      if (!gs) return;
      const value = gs[statType] || 0;
      if (value > 0) {
        store[playerName] = (store[playerName] || 0) + value;
      }
    });

    const allMet = config.players.every(name => (store[name] || 0) >= config.threshold);
    if (allMet) unlockFn(config.achievementId);
  });

  // --- Pitcher stats: accumulate and check ---
  const lastPitcher = userPitchers[0];
  const winMargin = userScore - opponentScore;

  // Strikeouts: accumulate from all pitchers who appeared
  const soConfig = LEADER_LISTS.so;
  if (!ls[soConfig.statKey]) ls[soConfig.statKey] = {};
  const soStore = ls[soConfig.statKey];
  userPitchers.forEach(p => {
    if (!p || !p.name) return;
    const k = p.gameStats?.so || 0;
    if (k > 0 && soConfig.players.includes(p.name)) {
      soStore[p.name] = (soStore[p.name] || 0) + k;
    }
  });
  if (soConfig.players.every(name => (soStore[name] || 0) >= soConfig.threshold)) {
    unlockFn(soConfig.achievementId);
  }

  // Wins: if user won, last pitcher gets the win
  const winsConfig = LEADER_LISTS.wins;
  if (!ls[winsConfig.statKey]) ls[winsConfig.statKey] = {};
  const winsStore = ls[winsConfig.statKey];
  if (userWon && lastPitcher && winsConfig.players.includes(lastPitcher.name)) {
    winsStore[lastPitcher.name] = (winsStore[lastPitcher.name] || 0) + 1;
  }
  if (winsConfig.players.every(name => (winsStore[name] || 0) >= winsConfig.threshold)) {
    unlockFn(winsConfig.achievementId);
  }

  // Saves: if user won by 1-3 runs and last pitcher is a reliever
  const savesConfig = LEADER_LISTS.saves;
  if (!ls[savesConfig.statKey]) ls[savesConfig.statKey] = {};
  const savesStore = ls[savesConfig.statKey];
  if (userWon && winMargin >= 1 && winMargin <= 3 && lastPitcher) {
    const pos = lastPitcher.pos || lastPitcher.assignedPos || '';
    const isReliever = pos === 'CL' || pos === 'RP';
    if (isReliever && savesConfig.players.includes(lastPitcher.name)) {
      savesStore[lastPitcher.name] = (savesStore[lastPitcher.name] || 0) + 1;
    }
  }
  if (savesConfig.players.every(name => (savesStore[name] || 0) >= savesConfig.threshold)) {
    unlockFn(savesConfig.achievementId);
  }

  saveStats(stats);
}

// Helper: determine if the user's team was fielding when a given event happened
function userIsFielding(gameState, userSide, log) {
  // The user's team fields when the batting team is NOT the user's side
  // During top of inning: away bats (if user is home, user fields)
  // During bottom: home bats (if user is away, user fields)
  // We check if there's any log entry that indicates user defense made a play
  const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
  const userFielders = userLineup.filter(p => (p.assignedPos || p.pos) !== 'DH').map(p => p.name);
  return log.some(l => l.text && userFielders.some(f => l.text.includes(f)));
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
  const AL_TEAMS = ['tigers','redsox','yankees','orioles','brewers','bluejays','indians','angels','royals','twins','mariners','whitesox','rangers','athletics'];
  const NL_TEAMS = ['padres','cubs','mets','dodgers','cardinals','braves','astros','expos','phillies','pirates','reds','giants'];

  const usedAL = AL_TEAMS.filter(t => stats.teamsUsed.includes(t));
  const usedNL = NL_TEAMS.filter(t => stats.teamsUsed.includes(t));

  if (usedAL.length >= AL_TEAMS.length) unlockAchievement('teams_al');
  if (usedNL.length >= NL_TEAMS.length) unlockAchievement('teams_nl');
  if (stats.teamsUsed.length >= 26) unlockAchievement('teams_all');
  if (stats.ballparksVisited.length >= 26) unlockAchievement('parks_all');

  // Multi-team: NL Tour (win with Cubs, Mets, Dodgers, Padres, Reds)
  const nlTourTeams = ['cubs', 'mets', 'dodgers', 'padres', 'reds'];
  if (nlTourTeams.every(t => (stats.teamWins[t] || 0) > 0)) unlockAchievement('nl_tour');

  // Multi-team: AL Tour (win with Yankees, Red Sox, Tigers, Orioles)
  const alTourTeams = ['yankees', 'redsox', 'tigers', 'orioles'];
  if (alTourTeams.every(t => (stats.teamWins[t] || 0) > 0)) unlockAchievement('al_tour');

  // Multi-team: Coast to Coast (win with every team)
  const allTeams = [...AL_TEAMS, ...NL_TEAMS];
  if (allTeams.every(t => (stats.teamWins[t] || 0) > 0)) unlockAchievement('coast_to_coast');

  // Multi-team: Frequent Flyer (play in every stadium)
  const allStadiums = [
    'Wrigley Field', 'Shea Stadium', 'Dodger Stadium', 'Jack Murphy Stadium', 'Riverfront Stadium',
    'Yankee Stadium', 'Fenway Park', 'Tiger Stadium', 'Memorial Stadium', 'Royals Stadium',
    'Veterans Stadium', 'Exhibition Stadium', 'Cleveland Municipal Stadium', 'County Stadium',
    'Hubert H. Humphrey Metrodome', 'Oakland-Alameda County Coliseum', 'Anaheim Stadium',
    'Comiskey Park', 'Kingdome', 'Arlington Stadium', 'Olympic Stadium', 'Busch Stadium',
    'Three Rivers Stadium', 'Atlanta-Fulton County Stadium', 'Astrodome', 'Candlestick Park',
  ];
  if (allStadiums.every(s => stats.ballparksVisited.includes(s))) unlockAchievement('all_stadiums');

  // Multi-team: Historian (at least one achievement for every team)
  checkHistorian();

  // Multi-team: Local Hero (all team-specific achievements for one franchise)
  checkLocalHero();
}

function checkFranchiseHopper(stats) {
  const allTeams = ['tigers','redsox','yankees','orioles','brewers','bluejays','indians','angels','royals','twins','mariners','whitesox','rangers','athletics','padres','cubs','mets','dodgers','cardinals','braves','astros','expos','phillies','pirates','reds','giants'];
  if (allTeams.every(t => (stats.teamWins[t] || 0) >= 10)) unlockAchievement('franchise_hopper');
}

function checkHistorian() {
  const achs = loadAchievements();
  const teamAchIds = {
    cubs: ['cubs_wrigley_win', 'cubs_3_hr', 'cubs_comeback', 'cubs_10_runs', 'cubs_25_home', 'cubs_100_wins', 'cubs_15_hits', 'cubs_walkoff'],
    mets: ['mets_extras', 'mets_comeback_5', 'mets_50_wins', 'mets_20_hits', 'mets_100_games', 'mets_3_errors_win', 'mets_wall_scraper', 'mets_late_comeback'],
    dodgers: ['dodgers_ds_win', 'dodgers_cg', 'dodgers_50_wins', 'dodgers_walkoff', 'dodgers_1_hit', 'dodgers_100_home', 'dodgers_10_road', 'dodgers_12_so'],
    padres: ['padres_murph_win', 'padres_100_games', 'padres_day_win', 'padres_3_doubles', 'padres_5_sb', 'padres_50_wins', 'padres_15_hits', 'padres_comeback_4'],
    reds: ['reds_first_game', 'reds_riverfront_win', 'reds_100_games', 'reds_50_wins', 'reds_4_sb', 'reds_10_runs', 'reds_5run_inning', 'reds_100_home'],
    yankees: ['yanks_4_hr', 'yanks_shutout', 'yanks_12_runs', 'yanks_all_hit', 'yanks_100_wins', 'yanks_10_streak', 'yanks_2000_hits', 'yanks_15_so'],
    redsox: ['sox_10_doubles', 'sox_fenway_win', 'sox_pole_hr', 'sox_100_games', 'sox_100_wins', 'sox_15_runs', 'sox_shutout', 'sox_25_home'],
    tigers: ['tigers_win', 'tigers_100_games', 'tigers_50_wins', 'tigers_10_runs', 'tigers_cg', 'tigers_25_home', 'tigers_4_hr', 'tigers_18_hits'],
    orioles: ['orioles_mem_win', 'orioles_extras', 'orioles_100_games', 'orioles_50_wins', 'orioles_3_hr', 'orioles_4_sb', 'orioles_12_runs', 'orioles_comeback_6'],
    royals: ['royals_first_win', 'royals_50_wins', 'royals_100_wins', 'royals_25_home', 'royals_george_3', 'royals_balboni_hr', 'royals_4_sb', 'royals_15_hits', 'royals_3_hr_at_home', 'royals_zero_errors'],
  };

  const teamsWithAch = Object.entries(teamAchIds).filter(([_, ids]) => ids.some(id => achs[id]));
  if (teamsWithAch.length >= Object.keys(teamAchIds).length) unlockAchievement('historian');
}

function checkLocalHero() {
  const achs = loadAchievements();
  const teamAchIds = {
    cubs: ['cubs_wrigley_win', 'cubs_3_hr', 'cubs_comeback', 'cubs_10_runs', 'cubs_25_home', 'cubs_100_wins', 'cubs_15_hits', 'cubs_walkoff'],
    mets: ['mets_extras', 'mets_comeback_5', 'mets_50_wins', 'mets_20_hits', 'mets_100_games', 'mets_3_errors_win', 'mets_wall_scraper', 'mets_late_comeback'],
    dodgers: ['dodgers_ds_win', 'dodgers_cg', 'dodgers_50_wins', 'dodgers_walkoff', 'dodgers_1_hit', 'dodgers_100_home', 'dodgers_10_road', 'dodgers_12_so'],
    padres: ['padres_murph_win', 'padres_100_games', 'padres_day_win', 'padres_3_doubles', 'padres_5_sb', 'padres_50_wins', 'padres_15_hits', 'padres_comeback_4'],
    reds: ['reds_first_game', 'reds_riverfront_win', 'reds_100_games', 'reds_50_wins', 'reds_4_sb', 'reds_10_runs', 'reds_5run_inning', 'reds_100_home'],
    yankees: ['yanks_4_hr', 'yanks_shutout', 'yanks_12_runs', 'yanks_all_hit', 'yanks_100_wins', 'yanks_10_streak', 'yanks_2000_hits', 'yanks_15_so'],
    redsox: ['sox_10_doubles', 'sox_fenway_win', 'sox_pole_hr', 'sox_100_games', 'sox_100_wins', 'sox_15_runs', 'sox_shutout', 'sox_25_home'],
    tigers: ['tigers_win', 'tigers_100_games', 'tigers_50_wins', 'tigers_10_runs', 'tigers_cg', 'tigers_25_home', 'tigers_4_hr', 'tigers_18_hits'],
    orioles: ['orioles_mem_win', 'orioles_extras', 'orioles_100_games', 'orioles_50_wins', 'orioles_3_hr', 'orioles_4_sb', 'orioles_12_runs', 'orioles_comeback_6'],
    royals: ['royals_first_win', 'royals_50_wins', 'royals_100_wins', 'royals_25_home', 'royals_george_3', 'royals_balboni_hr', 'royals_4_sb', 'royals_15_hits', 'royals_3_hr_at_home', 'royals_zero_errors'],
  };

  if (Object.values(teamAchIds).some(ids => ids.every(id => achs[id]))) unlockAchievement('local_hero');
}

// Check if user's team was trailing after a specific inning
function didTrailAfterInning(gameState, userSide, inning) {
  const oppSide = userSide === 'home' ? 'away' : 'home';
  const innings = gameState.innings || [];
  let userTotal = 0, oppTotal = 0;
  for (let i = 0; i < Math.min(inning, innings.length); i++) {
    if (innings[i][userSide] !== null) userTotal += innings[i][userSide];
    if (innings[i][oppSide] !== null) oppTotal += innings[i][oppSide];
  }
  return oppTotal > userTotal;
}

// Check if user team scored 5+ runs in any single inning
function checkFiveRunInning(gameState, userSide) {
  const innings = gameState.innings || [];
  return innings.some(inn => (inn[userSide] || 0) >= 5);
}

// Check if any half-inning was a 1-2-3 (clean) inning for the user's pitching side
function checkCleanInning(gameState, userSide, log) {
  const oppSide = userSide === 'home' ? 'away' : 'home';
  const innings = gameState.innings || [];
  for (let i = 0; i < innings.length; i++) {
    const inn = innings[i];
    if (inn[oppSide] === null || inn[oppSide] > 0) continue;
    // Check no baserunner events for this inning in log
    const innNum = i + 1;
    const halfLabel = userSide === 'home' ? 'top' : 'bottom';
    const hadRunner = log.some(l => {
      if (!l.text) return false;
      // Look for baserunner mentions around this inning
      if (l.text.includes(`inning ${innNum}`) || l.text.includes(`inning, ${innNum}`)) {
        return /single|double|triple|walk|hit by pitch|error|reaches/i.test(l.text);
      }
      return false;
    });
    if (!hadRunner) return true;
  }
  return false;
}