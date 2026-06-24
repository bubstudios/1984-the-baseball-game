// 1984 Texas Rangers Banner Popups (Additions)

export const RANGERS_BANNERS_EXTRA = [
  {
    id: 'tex_arlington_stadium',
    category: 'historic',
    exhibit: 'Arlington Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Arlington Stadium is the Rangers\' home, a modern facility in the heart of Texas. Hot summers and long home runs are part of the Arlington experience.'
  },
  {
    id: 'tex_bell_gunslinger',
    category: 'inspiration',
    exhibit: 'Buddy Bell\'s Excellence',
    icon: '⭐',
    animation: 'power_nod',
    description: 'Third baseman Buddy Bell is a future Hall of Famer, one of baseball\'s most complete players with hitting, defense, and durability.'
  },
  {
    id: 'tex_parrish_power',
    category: 'inspiration',
    exhibit: 'Larry Parrish\'s Slugging',
    icon: '⚡',
    animation: 'power_nod',
    description: 'Designated hitter Larry Parrish brings power to the Rangers lineup, a dependable run producer in the Texas heat.'
  },
  {
    id: 'tex_texas_pride',
    category: 'community',
    exhibit: 'Lone Star State',
    icon: '⭐',
    animation: 'heritage_shine',
    description: 'Texas is vast and proud, and the Rangers represent the state\'s baseball ambitions in the heart of the Lone Star Country.'
  },
  {
    id: 'tex_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Rangers bobbleheads at Arlington Stadium. Each celebrates a Texas star under the hot sun.'
  },
  {
    id: 'tex_team_poster',
    category: 'poster',
    exhibit: '1984 Rangers Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Texas Rangers team poster. Lone Star pride on display.'
  },
];

export function trackRangersBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'tex_arlington_stadium': 'tex_banner_fan',
    'tex_team_poster': 'tex_poster_collector',
    'tex_homestand_bobble': 'tex_bobblehead_collector',
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