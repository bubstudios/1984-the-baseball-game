// Extended Team Achievements for the final 15 teams added to the game
// Each team gets 8 team-specific achievements following the same pattern as the original 11 teams

export const EXTENDED_TEAM_ACHIEVEMENTS = [
  // ── BLUE JAYS ──
  { id: 'bluejays_first_win', name: 'True North', desc: 'Win your first Blue Jays game', icon: '🍁', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_home_win', name: 'Exhibition Excellence', desc: 'Win a game at Exhibition Stadium', icon: '🏟️', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_3_hr', name: 'Northern Lights', desc: 'Hit 3 home runs in a game as the Blue Jays', icon: '💥', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_10_runs', name: 'Maple Mash', desc: 'Score 10 runs in a game as the Blue Jays', icon: '🥞', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_comeback', name: 'Comeback North', desc: 'Win after trailing as the Blue Jays', icon: '🔄', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_15_hits', name: 'Rookie Rake', desc: 'Record 15 hits in a game as the Blue Jays', icon: '🍂', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_shutout', name: 'Frozen Out', desc: 'Throw a shutout as the Blue Jays', icon: '🧊', category: 'teamSpecific', team: 'bluejays' },
  { id: 'bluejays_4_sb', name: 'Northern Charge', desc: 'Steal 4 bases in a game as the Blue Jays', icon: '🏃', category: 'teamSpecific', team: 'bluejays' },

  // ── INDIANS ──
  { id: 'indians_first_win', name: 'Cleveland Pride', desc: 'Win your first Indians game', icon: '⚒️', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_home_win', name: 'Municipal Marvel', desc: 'Win a game at Cleveland Municipal Stadium', icon: '🏟️', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_3_hr', name: 'Lake Effect Power', desc: 'Hit 3 home runs in a game as the Indians', icon: '💥', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_10_runs', name: 'Cleveland Crush', desc: 'Score 10 runs in a game as the Indians', icon: '🏏', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_comeback', name: 'Comeback Kids', desc: 'Win after trailing as the Indians', icon: '🔄', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_15_hits', name: 'Tribe Hitting', desc: 'Record 15 hits in a game as the Indians', icon: '🪶', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_shutout', name: 'Cleveland Shutdown', desc: 'Throw a shutout as the Indians', icon: '🔒', category: 'teamSpecific', team: 'indians' },
  { id: 'indians_3_sb', name: 'Speed on the Lake', desc: 'Steal 3 bases in a game as the Indians', icon: '🏃', category: 'teamSpecific', team: 'indians' },

  // ── BREWERS ──
  { id: 'brewers_first_win', name: 'Brew City', desc: 'Win your first Brewers game', icon: '🍺', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_home_win', name: 'County Charm', desc: 'Win a game at County Stadium', icon: '🏟️', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_4_hr', name: 'Harvey\'s Wallbangers', desc: 'Hit 4 home runs in a game as the Brewers', icon: '💥', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_12_runs', name: 'Brewers Bash', desc: 'Score 12 runs in a game as the Brewers', icon: '🍻', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_comeback', name: 'Never Say Die', desc: 'Win after trailing as the Brewers', icon: '🔄', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_15_hits', name: 'Milwaukee Mashers', desc: 'Record 15 hits in a game as the Brewers', icon: '🧀', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_shutout', name: 'Last Call', desc: 'Throw a shutout as the Brewers', icon: '🔒', category: 'teamSpecific', team: 'brewers' },
  { id: 'brewers_3_sb', name: 'Sausage Race Speed', desc: 'Steal 3 bases in a game as the Brewers', icon: '🌭', category: 'teamSpecific', team: 'brewers' },

  // ── TWINS ──
  { id: 'twins_first_win', name: 'Twin Cities', desc: 'Win your first Twins game', icon: '👥', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_home_win', name: 'Dome Sweet Dome', desc: 'Win a game at the Metrodome', icon: '🏟️', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_3_hr', name: 'Dome Run Derby', desc: 'Hit 3 home runs in a game as the Twins', icon: '💥', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_10_runs', name: 'Minnesota Nice', desc: 'Score 10 runs in a game as the Twins', icon: '❄️', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_comeback', name: 'Comeback in the Dome', desc: 'Win after trailing as the Twins', icon: '🔄', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_15_hits', name: 'Twin Bats', desc: 'Record 15 hits in a game as the Twins', icon: '🥤', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_shutout', name: 'Deep Freeze', desc: 'Throw a shutout as the Twins', icon: '🧊', category: 'teamSpecific', team: 'twins' },
  { id: 'twins_3_sb', name: 'Minnesota Lightning', desc: 'Steal 3 bases in a game as the Twins', icon: '⚡', category: 'teamSpecific', team: 'twins' },

  // ── ATHLETICS ──
  { id: 'athletics_first_win', name: 'East Bay Pride', desc: 'Win your first Athletics game', icon: '🐘', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_home_win', name: 'Coliseum King', desc: 'Win a game at the Oakland Coliseum', icon: '🏟️', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_3_hr', name: 'Swingin\' A\'s', desc: 'Hit 3 home runs in a game as the Athletics', icon: '💥', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_10_runs', name: 'Mustache Gang', desc: 'Score 10 runs in a game as the Athletics', icon: '👔', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_comeback', name: 'Comeback A\'s', desc: 'Win after trailing as the Athletics', icon: '🔄', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_15_hits', name: 'Green and Gold', desc: 'Record 15 hits in a game as the Athletics', icon: '🟢', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_shutout', name: 'Oakland Lockdown', desc: 'Throw a shutout as the Athletics', icon: '🔒', category: 'teamSpecific', team: 'athletics' },
  { id: 'athletics_4_sb', name: 'Billy Ball', desc: 'Steal 4 bases in a game as the Athletics', icon: '🏃', category: 'teamSpecific', team: 'athletics' },

  // ── ANGELS ──
  { id: 'angels_first_win', name: 'Halo Winner', desc: 'Win your first Angels game', icon: '😇', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_home_win', name: 'Anaheim Advantage', desc: 'Win a game at Anaheim Stadium', icon: '🏟️', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_3_hr', name: 'Halos Power', desc: 'Hit 3 home runs in a game as the Angels', icon: '💥', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_10_runs', name: 'SoCal Surge', desc: 'Score 10 runs in a game as the Angels', icon: '☀️', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_comeback', name: 'Angel Comeback', desc: 'Win after trailing as the Angels', icon: '🔄', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_15_hits', name: 'Halo Hits', desc: 'Record 15 hits in a game as the Angels', icon: '🪽', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_shutout', name: 'Heavenly Defense', desc: 'Throw a shutout as the Angels', icon: '🔒', category: 'teamSpecific', team: 'angels' },
  { id: 'angels_3_sb', name: 'Angel Speed', desc: 'Steal 3 bases in a game as the Angels', icon: '🏃', category: 'teamSpecific', team: 'angels' },

  // ── WHITE SOX ──
  { id: 'whitesox_first_win', name: 'South Side', desc: 'Win your first White Sox game', icon: '⚫', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_home_win', name: 'Comiskey Classic', desc: 'Win a game at Comiskey Park', icon: '🏟️', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_4_hr', name: 'South Side Sluggers', desc: 'Hit 4 home runs in a game as the White Sox', icon: '💥', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_10_runs', name: 'Chi-Town Crush', desc: 'Score 10 runs in a game as the White Sox', icon: '🏙️', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_comeback', name: 'South Side Comeback', desc: 'Win after trailing as the White Sox', icon: '🔄', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_15_hits', name: 'White Hot Bats', desc: 'Record 15 hits in a game as the White Sox', icon: '🔥', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_shutout', name: 'South Side Silence', desc: 'Throw a shutout as the White Sox', icon: '🔒', category: 'teamSpecific', team: 'whitesox' },
  { id: 'whitesox_3_sb', name: 'Go-Go Sox', desc: 'Steal 3 bases in a game as the White Sox', icon: '🏃', category: 'teamSpecific', team: 'whitesox' },

  // ── MARINERS ──
  { id: 'mariners_first_win', name: 'Emerald City', desc: 'Win your first Mariners game', icon: '⚓', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_home_win', name: 'Kingdome Crown', desc: 'Win a game at the Kingdome', icon: '🏟️', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_3_hr', name: 'Seattle Surge', desc: 'Hit 3 home runs in a game as the Mariners', icon: '💥', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_10_runs', name: 'Rain City Rally', desc: 'Score 10 runs in a game as the Mariners', icon: '🌧️', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_comeback', name: 'Comeback at Sea', desc: 'Win after trailing as the Mariners', icon: '🔄', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_15_hits', name: 'Puget Sound Bats', desc: 'Record 15 hits in a game as the Mariners', icon: '🌊', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_shutout', name: 'Seattle Silence', desc: 'Throw a shutout as the Mariners', icon: '🔒', category: 'teamSpecific', team: 'mariners' },
  { id: 'mariners_3_sb', name: 'Mariner Speed', desc: 'Steal 3 bases in a game as the Mariners', icon: '🏃', category: 'teamSpecific', team: 'mariners' },

  // ── RANGERS ──
  { id: 'rangers_first_win', name: 'Lone Star', desc: 'Win your first Rangers game', icon: '⭐', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_home_win', name: 'Arlington Authority', desc: 'Win a game at Arlington Stadium', icon: '🏟️', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_4_hr', name: 'Texas-Sized Power', desc: 'Hit 4 home runs in a game as the Rangers', icon: '💥', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_12_runs', name: 'Lone Star Bash', desc: 'Score 12 runs in a game as the Rangers', icon: '🤠', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_comeback', name: 'Texas Comeback', desc: 'Win after trailing as the Rangers', icon: '🔄', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_15_hits', name: 'Texas Heat Bats', desc: 'Record 15 hits in a game as the Rangers', icon: '🔥', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_shutout', name: 'Lone Star Lockdown', desc: 'Throw a shutout as the Rangers', icon: '🔒', category: 'teamSpecific', team: 'rangers' },
  { id: 'rangers_3_sb', name: 'Texas Lightning', desc: 'Steal 3 bases in a game as the Rangers', icon: '⚡', category: 'teamSpecific', team: 'rangers' },

  // ── EXPOS ──
  { id: 'expos_first_win', name: 'Bonjour Baseball', desc: 'Win your first Expos game', icon: '🇨🇦', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_home_win', name: 'Olympic Glory', desc: 'Win a game at Olympic Stadium', icon: '🏟️', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_3_hr', name: 'Montreal Mash', desc: 'Hit 3 home runs in a game as the Expos', icon: '💥', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_10_runs', name: 'Stade Surge', desc: 'Score 10 runs in a game as the Expos', icon: '🏟️', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_comeback', name: 'Comeback en Français', desc: 'Win after trailing as the Expos', icon: '🔄', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_15_hits', name: 'Montreal Mauling', desc: 'Record 15 hits in a game as the Expos', icon: '🥐', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_shutout', name: 'Montreal Mute', desc: 'Throw a shutout as the Expos', icon: '🔒', category: 'teamSpecific', team: 'expos' },
  { id: 'expos_4_sb', name: 'Quebec Speed', desc: 'Steal 4 bases in a game as the Expos', icon: '🏃', category: 'teamSpecific', team: 'expos' },

  // ── CARDINALS ──
  { id: 'cardinals_first_win', name: 'Gateway City', desc: 'Win your first Cardinals game', icon: '🔴', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_home_win', name: 'Busch Stadium Brilliance', desc: 'Win a game at Busch Stadium', icon: '🏟️', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_3_hr', name: 'Cardinal Power', desc: 'Hit 3 home runs in a game as the Cardinals', icon: '💥', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_10_runs', name: 'St. Louis Surge', desc: 'Score 10 runs in a game as the Cardinals', icon: '🏛️', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_comeback', name: 'Rally Cards', desc: 'Win after trailing as the Cardinals', icon: '🔄', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_15_hits', name: 'Redbird Rake', desc: 'Record 15 hits in a game as the Cardinals', icon: '🐦', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_shutout', name: 'Cardinal Silence', desc: 'Throw a shutout as the Cardinals', icon: '🔒', category: 'teamSpecific', team: 'cardinals' },
  { id: 'cardinals_3_sb', name: 'Cardinal Speed', desc: 'Steal 3 bases in a game as the Cardinals', icon: '🏃', category: 'teamSpecific', team: 'cardinals' },

  // ── PIRATES ──
  { id: 'pirates_first_win', name: 'Pittsburgh Pride', desc: 'Win your first Pirates game', icon: '🏴‍☠️', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_home_win', name: 'Three Rivers Triumph', desc: 'Win a game at Three Rivers Stadium', icon: '🏟️', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_3_hr', name: 'Bucco Blast', desc: 'Hit 3 home runs in a game as the Pirates', icon: '💥', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_10_runs', name: 'Steel City Surge', desc: 'Score 10 runs in a game as the Pirates', icon: '🏗️', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_comeback', name: 'Bucco Comeback', desc: 'Win after trailing as the Pirates', icon: '🔄', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_15_hits', name: 'Pittsburgh Plunder', desc: 'Record 15 hits in a game as the Pirates', icon: '⚔️', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_shutout', name: 'Steel City Silence', desc: 'Throw a shutout as the Pirates', icon: '🔒', category: 'teamSpecific', team: 'pirates' },
  { id: 'pirates_4_sb', name: 'Pirate Plunder', desc: 'Steal 4 bases in a game as the Pirates', icon: '🏃', category: 'teamSpecific', team: 'pirates' },

  // ── BRAVES ──
  { id: 'braves_first_win', name: 'Atlanta Pride', desc: 'Win your first Braves game', icon: '🪓', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_home_win', name: 'Atlanta Authority', desc: 'Win a game at Atlanta-Fulton County Stadium', icon: '🏟️', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_4_hr', name: 'Tomahawk Chop', desc: 'Hit 4 home runs in a game as the Braves', icon: '💥', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_10_runs', name: 'Atlanta Attack', desc: 'Score 10 runs in a game as the Braves', icon: '🔥', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_comeback', name: 'Braves Comeback', desc: 'Win after trailing as the Braves', icon: '🔄', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_15_hits', name: 'Peach State Bats', desc: 'Record 15 hits in a game as the Braves', icon: '🍑', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_shutout', name: 'Atlanta Silence', desc: 'Throw a shutout as the Braves', icon: '🔒', category: 'teamSpecific', team: 'braves' },
  { id: 'braves_3_sb', name: 'Braves Speed', desc: 'Steal 3 bases in a game as the Braves', icon: '🏃', category: 'teamSpecific', team: 'braves' },

  // ── ASTROS ──
  { id: 'astros_first_win', name: 'Space City', desc: 'Win your first Astros game', icon: '🚀', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_home_win', name: 'Astrodome Authority', desc: 'Win a game at the Astrodome', icon: '🏟️', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_3_hr', name: 'Houston Launch', desc: 'Hit 3 home runs in a game as the Astros', icon: '💥', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_10_runs', name: 'Texas Tea Party', desc: 'Score 10 runs in a game as the Astros', icon: '🛢️', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_comeback', name: 'Astros Comeback', desc: 'Win after trailing as the Astros', icon: '🔄', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_15_hits', name: 'Space City Bats', desc: 'Record 15 hits in a game as the Astros', icon: '🌟', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_shutout', name: 'Houston Silence', desc: 'Throw a shutout as the Astros', icon: '🔒', category: 'teamSpecific', team: 'astros' },
  { id: 'astros_3_sb', name: 'Astros Speed', desc: 'Steal 3 bases in a game as the Astros', icon: '🏃', category: 'teamSpecific', team: 'astros' },

  // ── GIANTS ──
  { id: 'giants_first_win', name: 'Bay City', desc: 'Win your first Giants game', icon: '🌉', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_home_win', name: 'Candlestick Classic', desc: 'Win a game at Candlestick Park', icon: '🏟️', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_3_hr', name: 'Bay Area Blast', desc: 'Hit 3 home runs in a game as the Giants', icon: '💥', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_10_runs', name: 'San Francisco Surge', desc: 'Score 10 runs in a game as the Giants', icon: '🌁', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_comeback', name: 'Giant Comeback', desc: 'Win after trailing as the Giants', icon: '🔄', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_15_hits', name: 'Bay Bats', desc: 'Record 15 hits in a game as the Giants', icon: '🌊', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_shutout', name: 'Fog City Silence', desc: 'Throw a shutout as the Giants', icon: '🔒', category: 'teamSpecific', team: 'giants' },
  { id: 'giants_3_sb', name: 'Giant Speed', desc: 'Steal 3 bases in a game as the Giants', icon: '🏃', category: 'teamSpecific', team: 'giants' },
];

// Team config: stadium name, HR threshold, runs threshold, hits threshold, SB threshold
const TEAM_CONFIGS = {
  bluejays:  { stadium: 'Exhibition Stadium',              hr: 3, runs: 10, hits: 15, sb: 4 },
  indians:   { stadium: 'Cleveland Municipal Stadium',      hr: 3, runs: 10, hits: 15, sb: 3 },
  brewers:   { stadium: 'County Stadium',                   hr: 4, runs: 12, hits: 15, sb: 3 },
  twins:     { stadium: 'Hubert H. Humphrey Metrodome',     hr: 3, runs: 10, hits: 15, sb: 3 },
  athletics: { stadium: 'Oakland-Alameda County Coliseum',  hr: 3, runs: 10, hits: 15, sb: 4 },
  angels:    { stadium: 'Anaheim Stadium',                   hr: 3, runs: 10, hits: 15, sb: 3 },
  whitesox:  { stadium: 'Comiskey Park',                     hr: 4, runs: 10, hits: 15, sb: 3 },
  mariners:  { stadium: 'Kingdome',                          hr: 3, runs: 10, hits: 15, sb: 3 },
  rangers:   { stadium: 'Arlington Stadium',                 hr: 4, runs: 12, hits: 15, sb: 3 },
  expos:     { stadium: 'Olympic Stadium',                   hr: 3, runs: 10, hits: 15, sb: 4 },
  cardinals: { stadium: 'Busch Stadium',                     hr: 3, runs: 10, hits: 15, sb: 3 },
  pirates:   { stadium: 'Three Rivers Stadium',              hr: 3, runs: 10, hits: 15, sb: 4 },
  braves:    { stadium: 'Atlanta-Fulton County Stadium',     hr: 4, runs: 10, hits: 15, sb: 3 },
  astros:    { stadium: 'Astrodome',                         hr: 3, runs: 10, hits: 15, sb: 3 },
  giants:    { stadium: 'Candlestick Park',                  hr: 3, runs: 10, hits: 15, sb: 3 },
};

/**
 * Check extended team-specific achievements for the 15 final teams.
 * Called from checkGameAchievements in achievements.js.
 * @returns array of newly unlocked achievement IDs
 */
export function checkExtendedTeamAchievements(teamKey, userWon, userScore, stadium, totalHR, allSB, userHitsAll, maxDeficit, unlockFn) {
  const config = TEAM_CONFIGS[teamKey];
  if (!config) return;

  if (userWon) unlockFn(`${teamKey}_first_win`);
  if (userWon && stadium === config.stadium) unlockFn(`${teamKey}_home_win`);
  if (totalHR >= config.hr) unlockFn(`${teamKey}_${config.hr}_hr`);
  if (userScore >= config.runs) unlockFn(`${teamKey}_${config.runs}_runs`);
  if (userWon && maxDeficit > 0) unlockFn(`${teamKey}_comeback`);
  if (userHitsAll >= config.hits) unlockFn(`${teamKey}_${config.hits}_hits`);
  if (userScore === 0 && !userWon) { /* opponent scored 0 = user shutout */ }
  // Shutout: opponent scored 0 (but we need opponentScore — check via the caller)
  // Actually shutout is when the USER's pitcher allows 0 runs, meaning opponentScore === 0
  // We'll handle this in the caller
  if (allSB >= config.sb) unlockFn(`${teamKey}_${config.sb}_sb`);
}

/**
 * Check shutout achievement for extended teams (called separately since it needs opponentScore)
 */
export function checkExtendedShutout(teamKey, opponentScore, unlockFn) {
  if (!TEAM_CONFIGS[teamKey]) return;
  if (opponentScore === 0) unlockFn(`${teamKey}_shutout`);
}