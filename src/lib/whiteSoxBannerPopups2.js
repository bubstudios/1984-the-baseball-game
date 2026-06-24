// 1984 Chicago White Sox Banner Popups (Additions)

export const WHITESOX_BANNERS_EXTRA = [
  {
    id: 'sox_comiskey_south',
    category: 'historic',
    exhibit: 'Comiskey Park South Side',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Comiskey Park on the South Side of Chicago is one of baseball\'s great stadiums, a historic venue with charm and character.'
  },
  {
    id: 'sox_harold_bomb',
    animation: 'power_nod',
    category: 'inspiration',
    exhibit: 'Harold Baines\' Talent',
    icon: '⚡',
    description: 'Young right fielder Harold Baines brings elite hitting ability to the Sox. At just 22, he has a bright future ahead.'
  },
  {
    id: 'sox_carlton_power',
    category: 'inspiration',
    exhibit: 'Carlton Fisk\'s Bat',
    icon: '💪',
    animation: 'power_nod',
    description: 'Catcher Carlton Fisk anchors the White Sox defense and drives in runs with his powerful bat.'
  },
  {
    id: 'sox_chicago_grit',
    category: 'community',
    exhibit: 'South Side Chicago',
    icon: '🏙️',
    animation: 'heritage_shine',
    description: 'The South Side of Chicago is working-class and tough, home to White Sox fans who bleed for their team.'
  },
  {
    id: 'sox_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive White Sox bobbleheads at Comiskey Park. Each celebrates a South Side star.'
  },
  {
    id: 'sox_team_poster',
    category: 'poster',
    exhibit: '1984 White Sox Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 White Sox team poster. South Side pride on display.'
  },
];

export function trackWhiteSoxBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'sox_comiskey_south': 'sox_banner_fan',
    'sox_team_poster': 'sox_poster_collector',
    'sox_homestand_bobble': 'sox_bobblehead_collector',
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