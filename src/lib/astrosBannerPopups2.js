// 1984 Houston Astros Banner Popups (Additions)

export const ASTROS_BANNERS_EXTRA = [
  {
    id: 'hou_astrodome',
    category: 'historic',
    exhibit: 'The Astrodome',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'The Astrodome is baseball\'s first fully domed stadium and a marvel of modern architecture. "The Eighth Wonder of the World" sits in Houston like a spaceship.'
  },
  {
    id: 'hou_ryan_express',
    category: 'inspiration',
    exhibit: 'Nolan Ryan\'s Express',
    icon: '⚡',
    animation: 'fastball_zip',
    description: 'Nolan Ryan is the most dominant pitcher in baseball, throwing pure heat and striking out batters at will. "The Express" runs through the Astros rotation.'
  },
  {
    id: 'hou_cruz_power',
    category: 'inspiration',
    exhibit: 'Jose Cruz\'s Bat',
    icon: '💪',
    animation: 'power_nod',
    description: 'Left fielder Jose Cruz brings consistent power and intelligence to the Astros lineup, a future Hall of Famer.'
  },
  {
    id: 'hou_houston_space',
    category: 'community',
    exhibit: 'Space City',
    icon: '🚀',
    animation: 'heritage_shine',
    description: 'Houston is "Space City," home to NASA\'s Johnson Space Center. The Astros represent the city\'s boldness and ambition.'
  },
  {
    id: 'hou_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Astros bobbleheads at the Astrodome. Each celebrates a Houston star.'
  },
  {
    id: 'hou_team_poster',
    category: 'poster',
    exhibit: '1984 Astros Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Houston Astros team poster. Space City baseball pride on display.'
  },
];

export function trackAstrosBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'hou_astrodome': 'hou_banner_fan',
    'hou_team_poster': 'hou_poster_collector',
    'hou_homestand_bobble': 'hou_bobblehead_collector',
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