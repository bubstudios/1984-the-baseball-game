// 1984 Oakland Athletics Banner Popups & Exhibits

export const ATHLETICS_BANNERS = [
  {
    id: 'oak_coliseum_home',
    category: 'historic',
    exhibit: 'Oakland Coliseum',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'The Oakland-Alameda County Coliseum is a multipurpose facility that hosts both baseball and football. The A\'s call this massive structure home, creating a unique baseball atmosphere.'
  },
  {
    id: 'oak_rickey_runs',
    category: 'inspiration',
    exhibit: 'Rickey Henderson\'s Speed',
    icon: '💨',
    animation: 'power_nod',
    description: 'Rickey Henderson is the fastest man in baseball, a stolen base machine who can change games with his legs. At just 26, he\'s revolutionizing the A\'s offense.'
  },
  {
    id: 'oak_kingman_power',
    category: 'inspiration',
    exhibit: 'Dave Kingman\'s Tape Measures',
    icon: '⚡',
    animation: 'power_nod',
    description: 'Dave Kingman hits home runs farther than anyone else in baseball. His tape-measure blasts are legendary, and he\'s the A\'s power source.'
  },
  {
    id: 'oak_lansford_smooth',
    category: 'inspiration',
    exhibit: 'Carney Lansford\'s Bat',
    icon: '🏏',
    animation: 'power_nod',
    description: 'Third baseman Carney Lansford brings consistency and skill to the A\'s lineup, hitting for both average and power.'
  },
  {
    id: 'oak_bay_area',
    category: 'community',
    exhibit: 'Bay Area Baseball',
    icon: '🌉',
    animation: 'heritage_shine',
    description: 'The San Francisco Bay Area is a major metropolitan region with wealthy fans. Oakland is the blue-collar twin to San Francisco\'s glitz.'
  },
  {
    id: 'oak_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Oakland A\'s bobbleheads featuring Rickey, Kingman, and more. Each design honors this young, exciting roster.'
  },
  {
    id: 'oak_team_poster',
    category: 'poster',
    exhibit: '1984 Athletics Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your official 1984 Oakland Athletics team poster. A piece of Bay Area baseball history.'
  },
  {
    id: 'oak_celebration_track',
    category: 'tradition',
    exhibit: 'Celebration Song',
    icon: '🎵',
    animation: 'enthusiasm_nod',
    description: 'The A\'s play Kool & The Gang\'s "Celebration" after every victory at the Coliseum. It\'s become the soundtrack to winning.'
  },
  {
    id: 'oak_morgan_power',
    category: 'inspiration',
    exhibit: 'Joe Morgan\'s Wisdom',
    icon: '👨‍💼',
    animation: 'power_nod',
    description: 'Veteran second baseman Joe Morgan guides the younger A\'s with his Hall of Fame talent and experience.'
  },
  {
    id: 'oak_murphy_defense',
    category: 'inspiration',
    exhibit: 'Dwayne Murphy\'s Glove',
    icon: '🧤',
    animation: 'heritage_shine',
    description: 'Center fielder Dwayne Murphy is a defensive wizard, roaming the Coliseum grass with grace and skill.'
  },
];

export const ATHLETICS_BOBBLEHEADS = [
  { id: 'oak_bob_rickey', name: 'Rickey Henderson Bobblehead', player: 'Rickey Henderson', rarity: 'rare', description: 'Rickey in full sprint stealing a base' },
  { id: 'oak_bob_kingman', name: 'Dave Kingman Bobblehead', player: 'Dave Kingman', rarity: 'common', description: 'Kingman mid-swing with power pose' },
  { id: 'oak_bob_lansford', name: 'Carney Lansford Bobblehead', player: 'Carney Lansford', rarity: 'common', description: 'Lansford at third base ready position' },
  { id: 'oak_bob_morgan', name: 'Joe Morgan Bobblehead', player: 'Joe Morgan', rarity: 'rare', description: 'Morgan with helmet tipped to crowd' },
  { id: 'oak_bob_team', name: 'Athletics Logo Bobblehead', player: 'Team', rarity: 'common', description: 'A\'s elephant mascot with green and gold' },
];

export function trackAthleticsBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'oak_coliseum_home': 'oak_banner_fan',
    'oak_team_poster': 'oak_poster_collector',
    'oak_homestand_bobble': 'oak_bobblehead_collector',
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