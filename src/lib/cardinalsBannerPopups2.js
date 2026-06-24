// 1984 St. Louis Cardinals Banner Popups (Additions)

export const CARDINALS_BANNERS_EXTRA = [
  {
    id: 'stl_busch_stadium',
    category: 'historic',
    exhibit: 'Busch Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'Busch Stadium is the Cardinals\' home, a classic NL ballpark with great sightlines and St. Louis baseball tradition.'
  },
  {
    id: 'stl_ozzie_wizard',
    category: 'inspiration',
    exhibit: 'Ozzie Smith\'s Magic',
    icon: '🧙',
    animation: 'power_nod',
    description: 'Shortstop Ozzie Smith is the Wizard, a defensive genius who turns double plays and makes impossible plays look routine.'
  },
  {
    id: 'stl_sutter_splitter',
    category: 'inspiration',
    exhibit: 'Bruce Sutter\'s Split',
    icon: '🎯',
    animation: 'fastball_zip',
    description: 'Closer Bruce Sutter has the split-fingered fastball, one of baseball\'s most devastating pitches that baffles hitters.'
  },
  {
    id: 'stl_st_louis_river',
    category: 'community',
    exhibit: 'Gateway City',
    icon: '🌉',
    animation: 'heritage_shine',
    description: 'St. Louis is the Gateway to the West on the Mississippi River. The Cardinals carry the history and tradition of baseball in America\'s heartland.'
  },
  {
    id: 'stl_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Cardinals bobbleheads at Busch Stadium. Each celebrates a St. Louis legend.'
  },
  {
    id: 'stl_team_poster',
    category: 'poster',
    exhibit: '1984 Cardinals Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 St. Louis Cardinals team poster. Cardinals pride and tradition captured forever.'
  },
];

export function trackCardinalsBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'stl_busch_stadium': 'stl_banner_fan',
    'stl_team_poster': 'stl_poster_collector',
    'stl_homestand_bobble': 'stl_bobblehead_collector',
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