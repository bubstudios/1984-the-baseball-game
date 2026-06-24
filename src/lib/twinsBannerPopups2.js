// 1984 Minnesota Twins Banner Popups (Additions)

export const TWINS_BANNERS_EXTRA = [
  {
    id: 'min_metrodome',
    category: 'historic',
    exhibit: 'Hubert H. Humphrey Metrodome',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'The Metrodome is Minnesota\'s futuristic domed stadium, a climate-controlled venue where the Twins play indoors year-round.'
  },
  {
    id: 'min_puckett_future',
    category: 'inspiration',
    exhibit: 'Kirby Puckett\'s Smile',
    icon: '⭐',
    animation: 'power_nod',
    description: 'Young center fielder Kirby Puckett is a joy to watch, bringing speed, defense, and hitting ability to the Twins.'
  },
  {
    id: 'min_hrbek_power',
    category: 'inspiration',
    exhibit: 'Kent Hrbek\'s Bat',
    icon: '⚡',
    animation: 'power_nod',
    description: 'First baseman Kent Hrbek is the Twins\' slugger, a local Minnesota hero bringing power and pride.'
  },
  {
    id: 'min_minnesota_winters',
    category: 'community',
    exhibit: 'Cold Weather Baseball',
    icon: '❄️',
    animation: 'heritage_shine',
    description: 'Minnesota is brutally cold, but inside the Metrodome, fans stay warm while watching the Twins play all season long.'
  },
  {
    id: 'min_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Twins bobbleheads at the Metrodome. Each celebrates a Minnesota legend.'
  },
  {
    id: 'min_team_poster',
    category: 'poster',
    exhibit: '1984 Twins Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Minnesota Twins team poster. Land of 10,000 Lakes baseball pride.'
  },
];

export function trackTwinsBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'min_metrodome': 'min_banner_fan',
    'min_team_poster': 'min_poster_collector',
    'min_homestand_bobble': 'min_bobblehead_collector',
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