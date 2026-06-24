// 1984 Seattle Mariners Banner Popups (Additions)

export const MARINERS_BANNERS_EXTRA = [
  {
    id: 'sea_kingdome_wonder',
    category: 'historic',
    exhibit: 'Inside the Kingdome',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'The Kingdome is one of baseball\'s first fully enclosed domed stadiums, a technological marvel in Seattle. No rain delays, but artificial turf changes the game.'
  },
  {
    id: 'sea_langston_fire',
    category: 'inspiration',
    exhibit: 'Mark Langston\'s Arm',
    icon: '🔥',
    animation: 'fastball_zip',
    description: 'Young left-hander Mark Langston throws fire for the Mariners, a future ace in the making with a dominant fastball.'
  },
  {
    id: 'sea_seattle_tech',
    category: 'community',
    exhibit: 'Emerald City',
    icon: '🌲',
    animation: 'heritage_shine',
    description: 'Seattle is a growing tech and coffee city, surrounded by mountains and Puget Sound. The Mariners represent the Pacific Northwest\'s rising prominence.'
  },
  {
    id: 'sea_rain_culture',
    category: 'community',
    exhibit: 'Rain City Baseball',
    icon: '🌧️',
    animation: 'enthusiasm_nod',
    description: 'Seattle is famous for rain, but inside the Kingdome, fans stay dry while watching the Mariners play in climate-controlled comfort.'
  },
  {
    id: 'sea_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Mariners bobbleheads from the Kingdome. Each celebrates Seattle\'s young baseball stars.'
  },
  {
    id: 'sea_team_poster',
    category: 'poster',
    exhibit: '1984 Mariners Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your 1984 Seattle Mariners team poster. Pacific Northwest pride captured forever.'
  },
];

export function trackMarinersBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'sea_kingdome_wonder': 'sea_banner_fan',
    'sea_team_poster': 'sea_poster_collector',
    'sea_homestand_bobble': 'sea_bobblehead_collector',
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