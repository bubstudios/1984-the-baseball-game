// 1984 Pittsburgh Pirates Banner Popups (Additions)

export const PIRATES_BANNERS_EXTRA = [
  {
    id: 'pit_three_rivers',
    category: 'historic',
    exhibit: 'Three Rivers Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Three Rivers Stadium sits where the Allegheny, Monongahela, and Ohio Rivers meet. A unique ballpark with Pittsburgh\'s river heritage.'
  },
  {
    id: 'pit_pena_defense',
    category: 'inspiration',
    exhibit: 'Tony Pena\'s Arm',
    icon: '💪',
    animation: 'power_nod',
    description: 'Catcher Tony Pena is a future star, a defensive wizard who throws out runners and calls great games.'
  },
  {
    id: 'pit_rhoden_arm',
    category: 'inspiration',
    exhibit: 'Rick Rhoden\'s Pitch',
    icon: '⚡',
    animation: 'fastball_zip',
    description: 'Starting pitcher Rick Rhoden is an ace, delivering quality starts game after game for the Pirates.'
  },
  {
    id: 'pit_pittsburgh_steel',
    category: 'community',
    exhibit: 'Steel City',
    icon: '🏭',
    animation: 'heritage_shine',
    description: 'Pittsburgh is built on steel and hard work. The Pirates represent the city\'s blue-collar toughness and passion.'
  },
  {
    id: 'pit_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Pirates bobbleheads at Three Rivers. Each celebrates a Pittsburgh star.'
  },
  {
    id: 'pit_team_poster',
    category: 'poster',
    exhibit: '1984 Pirates Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Pittsburgh Pirates team poster. Steel City pride on display.'
  },
];

export function trackPiratesBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'pit_three_rivers': 'pit_banner_fan',
    'pit_team_poster': 'pit_poster_collector',
    'pit_homestand_bobble': 'pit_bobblehead_collector',
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