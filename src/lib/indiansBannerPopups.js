// 1984 Cleveland Indians Banner Popups & Exhibits
// Team-specific contextual banners, homestand exhibits, and bobblehead displays

export const INDIANS_BANNERS = [
  // ── TEAM HISTORY ──
  {
    id: 'ind_municipal_history',
    category: 'historic',
    exhibit: 'Municipal Stadium',
    icon: '🏛️',
    animation: 'heritage_shine',
    description: 'Cleveland Municipal Stadium stands as one of baseball\'s oldest and largest ballparks, a massive structure by Lake Erie that has hosted over 50 years of Indians baseball. A monument to the city\'s baseball tradition.'
  },
  {
    id: 'ind_franchise_tradition',
    category: 'tradition',
    exhibit: 'Indians Baseball Heritage',
    icon: '⚾',
    animation: 'heritage_shine',
    description: 'The Cleveland Indians have been playing since 1901, making them one of the AL\'s founding franchises. This team carries decades of tradition, from the 1920 World Series championship to the hopes of 1984.'
  },
  {
    id: 'ind_early_arrivals',
    category: 'inspiration',
    exhibit: 'Andre Thornton\'s Thunder',
    icon: '⚡',
    animation: 'power_nod',
    description: 'Andre Thornton is the Indians\' slugger, a powerful DH who swings for the fences. His towering home runs light up Municipal Stadium and give Cleveland fans something to cheer.'
  },
  {
    id: 'ind_brett_butler',
    category: 'inspiration',
    exhibit: 'Brett Butler\'s Speed',
    icon: '🏃',
    animation: 'power_nod',
    description: 'Brett Butler patrols center field with blazing speed and aggression. At just 26, he\'s the face of the Indians\' future, stealing bases and making diving catches on the Lake Erie winds.'
  },
  {
    id: 'ind_franco_promise',
    category: 'inspiration',
    exhibit: 'Julio Franco\'s Talent',
    icon: '🎯',
    animation: 'power_nod',
    description: 'Julio Franco is the Indians\' shortstop, a young talent with a unique swing and quick wrists. Franco represents the promise of a rebuilding Indians club.'
  },

  // ── CITY & CULTURE ──
  {
    id: 'ind_lake_erie',
    category: 'ballpark',
    exhibit: 'Lake Erie\'s Cold Winds',
    icon: '❄️',
    animation: 'heritage_shine',
    description: 'Lake Erie\'s icy winds sweep across Municipal Stadium, making April and September games brutally cold. Home runs sail differently here-sometimes aided, sometimes cut short by the lake wind.'
  },
  {
    id: 'ind_cleveland_grit',
    category: 'community',
    exhibit: 'Steel City Spirit',
    icon: '🏭',
    animation: 'heritage_shine',
    description: 'Cleveland is a steel and manufacturing town, a blue-collar city with gritty determination. The Indians reflect that spirit-hardworking, tough, and refusing to quit.'
  },
  {
    id: 'ind_rock_roll',
    category: 'community',
    exhibit: 'Rock and Roll Hometown',
    icon: '🎸',
    animation: 'enthusiasm_nod',
    description: 'Cleveland is the Rock and Roll Capital of the world, home to the Rock and Roll Hall of Fame. Music fills the city, and you can feel it in the stadium on game day.'
  },

  // ── FUNNY / QUIRKY ──
  {
    id: 'ind_cold_baseball',
    category: 'fans',
    exhibit: 'Hockey Weather Baseball',
    icon: '🧊',
    animation: 'enthusiastic_nod',
    description: 'Fans bundle up in parkas and thick coats even in mid-May at Municipal Stadium. Some nights the temperature feels more like hockey weather than baseball, but Cleveland fans show up anyway.'
  },
  {
    id: 'ind_pennant_drought',
    category: 'community',
    exhibit: 'Drought Dreams',
    icon: '📉',
    animation: 'enthusiasm_nod',
    description: 'The Indians haven\'t won a pennant since 1954-30 years of heartbreak. Fans dream of breaking that curse, of seeing October baseball return to Cleveland.'
  },
  {
    id: 'ind_city_pride',
    category: 'community',
    exhibit: 'Browns and Cavs Too',
    icon: '🏀',
    animation: 'sizzle_pop',
    description: 'Cleveland is a multi-sport town. Football (Browns), basketball (Cavs), and baseball (Indians) all compete for the city\'s passion and attention.'
  },

  // ── HOMESTAND EXHIBITS ──
  {
    id: 'ind_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Cleveland Indians bobbleheads as the homestand continues at Municipal Stadium. Each design honors a player from this historic franchise. Bring them all home!'
  },

  // ── TEAM POSTER ──
  {
    id: 'ind_team_poster',
    category: 'poster',
    exhibit: '1984 Indians Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your official 1984 Cleveland Indians team poster, featuring the full roster against the backdrop of Lake Erie and Municipal Stadium. A piece of Cleveland baseball history.'
  },

  // ── ADDITIONAL EXHIBITS ──
  {
    id: 'ind_blyleven_master',
    category: 'inspiration',
    exhibit: 'Bert Blyleven\'s Curveball',
    icon: '🌀',
    animation: 'fastball_zip',
    description: 'Bert Blyleven is a future Hall of Famer, and the Indians have him as their ace. His devastating curveball is one of the best pitches in baseball.'
  },
  {
    id: 'ind_hargrove_steady',
    category: 'inspiration',
    exhibit: 'Mike Hargrove\'s Consistency',
    icon: '👨‍💼',
    animation: 'power_nod',
    description: 'First baseman Mike Hargrove is the steady presence the Indians need, a veteran who guides younger players and provides stability.'
  },
  {
    id: 'ind_carter_future',
    category: 'inspiration',
    exhibit: 'Joe Carter\'s Rise',
    icon: '🚀',
    animation: 'power_nod',
    description: 'Young Joe Carter plays left field with raw power and potential. He\'s one of the bright spots in Cleveland\'s rebuilding effort.'
  },
  {
    id: 'ind_memorial_day',
    category: 'ballpark',
    exhibit: 'Memorial Day Classic',
    icon: '🇺🇸',
    animation: 'heritage_shine',
    description: 'Memorial Day games at Municipal Stadium are special traditions in Cleveland, honoring those who served while celebrating baseball under Lake Erie skies.'
  },
  {
    id: 'ind_rust_belt_tough',
    category: 'community',
    exhibit: 'Rust Belt Resilience',
    icon: '💪',
    animation: 'enthusiasm_nod',
    description: 'The rust belt doesn\'t give up. Cleveland fans have seen hard times but remain loyal to their Indians, their Browns, their city. Tough love, true love.'
  },
];

// Bobblehead variants for Indians
export const INDIANS_BOBBLEHEADS = [
  { id: 'ind_bob_butler', name: 'Brett Butler Bobblehead', player: 'Brett Butler', rarity: 'common', description: 'Butler in full sprint position' },
  { id: 'ind_bob_thornton', name: 'Andre Thornton Bobblehead', player: 'Andre Thornton', rarity: 'common', description: 'Thornton mid-swing with power stance' },
  { id: 'ind_bob_franco', name: 'Julio Franco Bobblehead', player: 'Julio Franco', rarity: 'common', description: 'Franco at shortstop ready position' },
  { id: 'ind_bob_blyleven', name: 'Bert Blyleven Bobblehead', player: 'Bert Blyleven', rarity: 'rare', description: 'Blyleven mid-delivery, curve ball spinning' },
  { id: 'ind_bob_team', name: 'Indians Logo Bobblehead', player: 'Team', rarity: 'common', description: 'Chief Wahoo mascot dancing with team cap' },
];

// Achievement unlock tracker
export function trackIndiansBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'ind_municipal_history': 'ind_banner_fan',
    'ind_team_poster': 'ind_poster_collector',
    'ind_homestand_bobble': 'ind_bobblehead_collector',
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