// 1984 San Francisco Giants Banner Popups (Additions)

export const GIANTS_BANNERS_EXTRA = [
  {
    id: 'sf_candlestick',
    category: 'historic',
    exhibit: 'Candlestick Park',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Candlestick Park juts into the San Francisco Bay, exposed to famous Pacific winds. A unique ballpark with character and history.'
  },
  {
    id: 'sf_clark_star',
    category: 'inspiration',
    exhibit: 'Jack Clark\'s Talent',
    icon: '⭐',
    animation: 'power_nod',
    description: 'Right fielder Jack Clark is one of baseball\'s most complete hitters, a future star who brings power and intelligence.'
  },
  {
    id: 'sf_davis_charm',
    category: 'inspiration',
    exhibit: 'Chili Davis\' Speed',
    icon: '💨',
    animation: 'power_nod',
    description: 'Center fielder Chili Davis brings athleticism and speed to the Giants, a switch-hitter with burgeoning potential.'
  },
  {
    id: 'sf_bay_area',
    category: 'community',
    exhibit: 'Bay Area Legacy',
    icon: '🌉',
    animation: 'heritage_shine',
    description: 'The Giants carry San Francisco\'s baseball tradition back to New York and beyond. A storied franchise with West Coast pride.'
  },
  {
    id: 'sf_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Giants bobbleheads at Candlestick. Each celebrates a San Francisco legend.'
  },
  {
    id: 'sf_team_poster',
    category: 'poster',
    exhibit: '1984 Giants Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 San Francisco Giants team poster. Bay Area baseball heritage on display.'
  },
];

export function trackGiantsBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'sf_candlestick': 'sf_banner_fan',
    'sf_team_poster': 'sf_poster_collector',
    'sf_homestand_bobble': 'sf_bobblehead_collector',
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