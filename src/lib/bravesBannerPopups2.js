// 1984 Atlanta Braves Banner Popups (Additions)

export const BRAVES_BANNERS_EXTRA = [
  {
    id: 'atl_fulton_county',
    category: 'historic',
    exhibit: 'Atlanta-Fulton County Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Atlanta-Fulton County Stadium is home to the Braves, a stadium in the heart of the American South where baseball tradition meets Southern pride.'
  },
  {
    id: 'atl_murphy_slugger',
    category: 'inspiration',
    exhibit: 'Dale Murphy\'s Power',
    icon: '⚡',
    animation: 'power_nod',
    description: 'Center fielder Dale Murphy is a future MVP, combining power, defense, and athleticism. He\'s the face of the Braves franchise.'
  },
  {
    id: 'atl_horner_bat',
    category: 'inspiration',
    exhibit: 'Bob Horner\'s Thunder',
    icon: '💥',
    animation: 'power_nod',
    description: 'Third baseman Bob Horner brings home run power to the Braves, a slugger who can change games with one swing.'
  },
  {
    id: 'atl_atlanta_rising',
    category: 'community',
    exhibit: 'New South',
    icon: '🏛️',
    animation: 'heritage_shine',
    description: 'Atlanta is a rising city in the New South, growing and modernizing. The Braves represent Atlanta\'s ambitions and future.'
  },
  {
    id: 'atl_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Braves bobbleheads at Fulton County Stadium. Each celebrates an Atlanta legend.'
  },
  {
    id: 'atl_team_poster',
    category: 'poster',
    exhibit: '1984 Braves Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Atlanta Braves team poster. Southern baseball pride on display.'
  },
];

export function trackBravesBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'atl_fulton_county': 'atl_banner_fan',
    'atl_team_poster': 'atl_poster_collector',
    'atl_homestand_bobble': 'atl_bobblehead_collector',
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