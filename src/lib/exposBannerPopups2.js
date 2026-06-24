// 1984 Montreal Expos Banner Popups (Additions)

export const EXPOS_BANNERS_EXTRA = [
  {
    id: 'mon_olympic_stadium',
    category: 'historic',
    exhibit: 'Olympic Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Olympic Stadium was built for the 1976 Montreal Olympics and is now home to the Expos. A unique domed structure with a retractable roof.'
  },
  {
    id: 'mon_carter_promise',
    category: 'inspiration',
    exhibit: 'Gary Carter\'s Bat',
    icon: '⭐',
    animation: 'power_nod',
    description: 'Catcher Gary Carter is a future Hall of Famer and the Expos\' star, a complete player who can beat you any which way.'
  },
  {
    id: 'mon_raines_speed',
    category: 'inspiration',
    exhibit: 'Tim Raines\' Legs',
    icon: '💨',
    animation: 'power_nod',
    description: 'Left fielder Tim Raines is a speed demon, stealing bases at will and creating chaos on the basepaths.'
  },
  {
    id: 'mon_montreal_culture',
    category: 'community',
    exhibit: 'French Canada',
    icon: '🇨🇦',
    animation: 'heritage_shine',
    description: 'Montreal is Canada\'s second-largest city and the heart of French Canada. The Expos represent Quebec\'s baseball pride.'
  },
  {
    id: 'mon_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Expos bobbleheads at Olympic Stadium. Each celebrates a Montreal star.'
  },
  {
    id: 'mon_team_poster',
    category: 'poster',
    exhibit: '1984 Expos Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Montreal Expos team poster. Quebec baseball heritage on display.'
  },
];

export function trackExposBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'mon_olympic_stadium': 'mon_banner_fan',
    'mon_team_poster': 'mon_poster_collector',
    'mon_homestand_bobble': 'mon_bobblehead_collector',
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