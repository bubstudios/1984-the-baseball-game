// 1984 Toronto Blue Jays Banner Popups & Exhibits
// Team-specific contextual banners, homestand exhibits, and bobblehead displays

export const BLUEJAYS_BANNERS = [
  // ── TEAM HISTORY & PRIDE ──
  {
    id: 'bj_exhibition_start',
    category: 'tradition',
    exhibit: 'Exhibition Stadium',
    icon: '🏟️',
    animation: 'stadium_lights',
    description: 'The Blue Jays call Exhibition Stadium home, a unique split-purpose venue in Toronto that also hosts football. It\'s the northernmost stadium in Major League Baseball, bringing the big leagues to Canada for the first time.'
  },
  {
    id: 'bj_expansion_pride',
    category: 'historic',
    exhibit: 'Expansion Pride',
    icon: '🇨🇦',
    animation: 'power_nod',
    description: 'The 1984 Blue Jays are only 8 years into their franchise history, and they\'re building something special in Toronto. This young team represents Canadian baseball and is starting to contend in a competitive AL East.'
  },
  {
    id: 'bj_moseby_flight',
    category: 'inspiration',
    exhibit: 'Lloyd Moseby Takes Flight',
    icon: '🛫',
    animation: 'power_nod',
    description: 'Lloyd Moseby, the CF for this Jays squad, is nicknamed "Mr. Moseby" and brings speed and athleticism to center field. A cornerstone of the team\'s future, Moseby is the embodiment of the Jays\' young, dynamic roster.'
  },
  {
    id: 'bj_barfield_arm',
    category: 'inspiration',
    exhibit: 'Barfield\'s Cannon',
    icon: '🎯',
    animation: 'power_nod',
    description: 'Jesse Barfield patrols right field with one of the best arms in baseball. At just 25, he\'s a future star who combines power, speed, and elite defense-exactly what the Jays are building around.'
  },
  {
    id: 'bj_upshaw_power',
    category: 'inspiration',
    exhibit: 'Upshaw\'s Left-Handed Power',
    icon: '⚡',
    animation: 'power_nod',
    description: 'Willie Upshaw is the Jays\' answer at first base, bringing steady power and consistency. A Canadian native himself, Upshaw represents the homegrown talent the Jays are developing.'
  },

  // ── CITY & CULTURE ──
  {
    id: 'bj_toronto_maple',
    category: 'community',
    exhibit: 'Maple Leaf City',
    icon: '🍁',
    animation: 'heritage_shine',
    description: 'Toronto is a vibrant, multicultural city on Lake Ontario-Canada\'s largest and a gateway to the Great Lakes. The Blue Jays are bringing baseball pride to a nation that\'s embracing the sport.'
  },
  {
    id: 'bj_niagara_falls',
    category: 'ballpark',
    exhibit: 'Niagara Falls & the Border',
    icon: '💧',
    animation: 'heritage_shine',
    description: 'Just 80 miles south of Exhibition Stadium, Niagara Falls roars on the Canadian-American border. It\'s a symbol of the natural wonder surrounding Toronto and the Jays\' unique Canadian home.'
  },
  {
    id: 'bj_ontario_pride',
    category: 'community',
    exhibit: 'Ontario Province',
    icon: '🏛️',
    animation: 'heritage_shine',
    description: 'Ontario is Canada\'s most populous province, and Toronto is its crown jewel. The Blue Jays carry the hopes of millions of Canadians who finally have their own Major League Baseball team.'
  },

  // ── FUNNY / QUIRKY ──
  {
    id: 'bj_cold_play',
    category: 'fans',
    exhibit: 'Bundled Baseball',
    icon: '🧥',
    animation: 'enthusiastic_nod',
    description: 'April games at Exhibition Stadium can get downright cold. Fans arrive in winter coats and parkas to cheer the Jays, turning the ballpark into a sea of blue jackets and Canadian gear.'
  },
  {
    id: 'bj_border_commute',
    category: 'fans',
    exhibit: 'Crossing the Bridge',
    icon: '🌉',
    animation: 'enthusiastic_nod',
    description: 'American fans are crossing into Canada to catch Blue Jays games, making the drive from Buffalo or Detroit. It\'s become a baseball pilgrimage for Northeastern fans seeking something different.'
  },
  {
    id: 'bj_metric_confusion',
    category: 'community',
    exhibit: 'Metric vs. Miles',
    icon: '📏',
    animation: 'sizzle_pop',
    description: 'The Blue Jays play in Canada where the metric system reigns-distances are in kilometers, temperatures in Celsius. Home run distances on the scoreboard confuse American visitors!'
  },

  // ── HOMESTAND EXHIBITS ──
  {
    id: 'bj_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Blue Jays bobbleheads as the homestand continues. Each unique design celebrates a player or moment from this exciting young franchise. Bring them all home!'
  },

  // ── PLAYOFF DREAMS ──
  {
    id: 'bj_pennant_race',
    category: 'inspiration',
    exhibit: 'Chasing October',
    icon: '🏆',
    animation: 'victory_glow',
    description: 'The 1984 Blue Jays are hungry. While they may not reach the playoffs this year, this team is building toward a championship future. Toronto\'s first World Series dream is closer than ever.'
  },

  // ── TEAM POSTER ──
  {
    id: 'bj_team_poster',
    category: 'poster',
    exhibit: '1984 Blue Jays Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your official 1984 Toronto Blue Jays team poster. Features the full roster under the Canadian sky, from Exhibition Stadium to the hopes of a nation. Frame it and display your Jays pride!'
  },

  // ── ADDITIONAL EXHIBITS ──
  {
    id: 'bj_garcia_steady',
    category: 'inspiration',
    exhibit: 'Damaso Garcia\'s Leadership',
    icon: '👨‍💼',
    animation: 'power_nod',
    description: 'Second baseman Damaso Garcia is the glue of this young infield, leading the Jays with consistency and baseball smarts. A captain in all but name.'
  },
  {
    id: 'bj_fisk_power',
    category: 'inspiration',
    exhibit: 'Carlton Fisk Joins the Fold',
    icon: '💪',
    animation: 'power_nod',
    description: 'Carlton Fisk, one of baseball\'s greatest catchers, is now a Blue Jay. His arrival signals Toronto\'s readiness to compete at the highest level.'
  },
  {
    id: 'bj_stieb_future',
    category: 'inspiration',
    exhibit: 'Dave Stieb\'s Arm',
    icon: '⚾',
    animation: 'fastball_zip',
    description: 'Dave Stieb is the ace Toronto has been waiting for. This young pitcher throws with power and promise, leading the Jays\' rotation toward stardom.'
  },
  {
    id: 'bj_lake_ontario',
    category: 'ballpark',
    exhibit: 'Lake Ontario Breeze',
    icon: '🌊',
    animation: 'heritage_shine',
    description: 'Lake Ontario sits right across from Exhibition Stadium, its cool breezes and waters influencing every game. On warm days, fans cool off with views of the lake beyond the outfield.'
  },
  {
    id: 'bj_maple_leaf_gardens',
    category: 'community',
    exhibit: 'Hockey City Goes Baseball',
    icon: '🏒',
    animation: 'enthusiasm_nod',
    description: 'Toronto is a hockey-mad city-the Maple Leafs are an institution. But the Blue Jays are winning over the city one game at a time, bringing baseball to Maple Leaf territory.'
  },
];

// Bobblehead variants for Blue Jays (for display collection)
export const BLUEJAYS_BOBBLEHEADS = [
  { id: 'bj_bob_moseby', name: 'Lloyd Moseby Bobblehead', player: 'Lloyd Moseby', rarity: 'common', description: 'Mr. Moseby in full flight pose' },
  { id: 'bj_bob_barfield', name: 'Jesse Barfield Bobblehead', player: 'Jesse Barfield', rarity: 'common', description: 'Barfield with cannon arm raised' },
  { id: 'bj_bob_fisk', name: 'Carlton Fisk Bobblehead', player: 'Carlton Fisk', rarity: 'rare', description: 'The legendary Fisk in catcher\'s stance' },
  { id: 'bj_bob_stieb', name: 'Dave Stieb Bobblehead', player: 'Dave Stieb', rarity: 'rare', description: 'Stieb mid-windup on the mound' },
  { id: 'bj_bob_team', name: 'Blue Jays Team Logo Bobblehead', player: 'Team', rarity: 'common', description: 'Jigging maple leaf with Blue Jays cap' },
];

// Achievement unlock tracker
export function trackBluejaysBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'bj_exhibition_start': 'bj_banner_fan',
    'bj_team_poster': 'bj_poster_collector',
    'bj_homestand_bobble': 'bj_bobblehead_collector',
  };
  
  if (bannerToAch[bannerId]) {
    const achId = bannerToAch[bannerId];
    const achs = JSON.parse(localStorage.getItem('bb84_achievements') || '{}');
    if (!achs[achId]) {
      achs[achId] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push(achId);
    }
  }
  return unlocked;
}