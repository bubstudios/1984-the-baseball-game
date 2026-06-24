// 1984 California Angels Banner Popups (Additions)
// Note: Basic banners already exist in angelsBannerPopups.js; this adds more

export const ANGELS_BANNERS_EXTRA = [
  {
    id: 'ang_halo_shine',
    category: 'tradition',
    exhibit: 'The Big A Halo',
    icon: '😇',
    animation: 'trophy_glow',
    description: 'The iconic Big A scoreboard with its glowing halo is the symbol of Angels baseball. When the team wins, the halo lights up in celebration.'
  },
  {
    id: 'ang_carew_legend',
    category: 'inspiration',
    exhibit: 'Rod Carew\'s Precision',
    icon: '🎯',
    animation: 'power_nod',
    description: 'Rod Carew is one of baseball\'s greatest hitters, a contact master who sprays hits to all fields. At 39, he\'s still performing at an elite level.'
  },
  {
    id: 'ang_anaheim_growth',
    category: 'community',
    exhibit: 'Anaheim Rising',
    icon: '🏙️',
    animation: 'heritage_shine',
    description: 'Anaheim is a growing Southern California city, a suburban boom area that\'s becoming a baseball town with the Angels\' presence.'
  },
  {
    id: 'ang_disneyland_neighbor',
    category: 'community',
    exhibit: 'Disneyland Is Close By',
    icon: '🎢',
    animation: 'enthusiasm_nod',
    description: 'Disneyland is just down the street from Anaheim Stadium, making it one of baseball\'s most magical locations.'
  },
  {
    id: 'ang_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Angels bobbleheads from Anaheim Stadium. Each celebrates a star from this talented California squad.'
  },
  {
    id: 'ang_team_poster',
    category: 'poster',
    exhibit: '1984 Angels Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 California Angels team poster, featuring the full roster under the Anaheim sunshine.'
  },
];

export function trackAngelsBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'ang_halo_shine': 'ang_banner_fan',
    'ang_team_poster': 'ang_poster_collector',
    'ang_homestand_bobble': 'ang_bobblehead_collector',
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