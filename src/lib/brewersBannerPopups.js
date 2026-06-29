// 1984 Milwaukee Brewers Banner Popups & Exhibits
// Team-specific contextual banners, homestand exhibits, and bobblehead displays

export const BREWERS_BANNERS = [
  // ── TEAM HISTORY ──
  {
    id: 'brew_county_stadium',
    category: 'historic',
    exhibit: 'County Stadium',
    icon: '🏟️',
    animation: 'heritage_shine',
    description: 'County Stadium in Milwaukee is a classic American ballpark, a place where fans come to enjoy cold beer, hot dogs, and Brewers baseball. It\'s the heart of Milwaukee sports culture.'
  },
  {
    id: 'brew_expansion_journey',
    category: 'tradition',
    exhibit: 'From Seattle to Milwaukee',
    icon: '🔄',
    animation: 'heritage_shine',
    description: 'The Brewers only arrived in Milwaukee in 1970, moving from Seattle. In just 14 years, they\'ve established themselves as part of Wisconsin\'s fabric, and the city has embraced them.'
  },
  {
    id: 'brew_robin_yount',
    category: 'inspiration',
    exhibit: 'Robin Yount\'s Excellence',
    icon: '⭐',
    animation: 'power_nod',
    description: 'Robin Yount is the Brewers\' superstar shortstop, a homegrown talent who will define this franchise for decades. At just 28, he\'s already a future Hall of Famer and Milwaukee icon.'
  },
  {
    id: 'brew_molitor_dh',
    category: 'inspiration',
    exhibit: 'Paul Molitor\'s Bat',
    icon: '🏏',
    animation: 'power_nod',
    description: 'Paul Molitor has joined the Brewers as their DH, bringing veteran leadership and a potent bat. His presence signals Milwaukee\'s ambitions to compete in the AL.'
  },
  {
    id: 'brew_cooper_first',
    category: 'inspiration',
    exhibit: 'Cecil Cooper\'s Power',
    icon: '⚡',
    animation: 'power_nod',
    description: 'First baseman Cecil Cooper is the Brewers\' slugger, a steady power source who drives in runs and provides stability in the middle of the lineup.'
  },

  // ── CITY & CULTURE ──
  {
    id: 'brew_beer_city',
    category: 'community',
    exhibit: 'America\'s Beer City',
    icon: '🍺',
    animation: 'enthusiasm_nod',
    description: 'Milwaukee is synonymous with beer. Breweries line the streets, and beer culture is woven into the fabric of the city. The Brewers name is perfect-this team belongs here.'
  },
  {
    id: 'brew_wisconsin_pride',
    category: 'community',
    exhibit: 'Cheese and Pride',
    icon: '🧀',
    animation: 'heritage_shine',
    description: 'Wisconsin is the dairy state, the land of cheese and innovation. Brewers fans are passionate, loyal, and take pride in their hard-working heritage.'
  },
  {
    id: 'brew_great_lakes',
    category: 'ballpark',
    exhibit: 'Great Lakes Spirit',
    icon: '🌊',
    animation: 'heritage_shine',
    description: 'Milwaukee sits on Lake Michigan, one of the Great Lakes. The cool water influences the weather, and you can feel the lake\'s presence at County Stadium.'
  },

  // ── FUNNY / QUIRKY ──
  {
    id: 'brew_tailgate_culture',
    category: 'fans',
    exhibit: 'Tailgate Party Culture',
    icon: '🎉',
    animation: 'enthusiastic_nod',
    description: 'Milwaukee fans arrive at County Stadium early with coolers, grills, and cases of beer. The parking lot is a party before, during, and after the game.'
  },
  {
    id: 'brew_ale_house',
    category: 'community',
    exhibit: 'Miller Park Beer',
    icon: '🥤',
    animation: 'sizzle_pop',
    description: 'Miller Brewing Company is Milwaukee\'s pride, and their products flow through County Stadium. Fans toast with ice-cold Miller High Life throughout the ballpark.'
  },
  {
    id: 'brew_wisconsin_weather',
    category: 'fans',
    exhibit: 'Wisconsin Winter Baseball',
    icon: '❄️',
    animation: 'enthusiastic_nod',
    description: 'September games at County Stadium can get surprisingly cold as Lake Michigan winds kick up. Fans bundle up and still show up to support their Brewers.'
  },

  // ── HOMESTAND EXHIBITS ──
  {
    id: 'brew_homestand_bobble',
    category: 'bobblehead',
    exhibit: 'Homestand Continues: Bobblehead Collection',
    icon: '🎯',
    animation: 'trophy_glow',
    description: 'Collect exclusive Milwaukee Brewers bobbleheads as the homestand continues at County Stadium. Each design celebrates a player or moment from this Wisconsin tradition. Bring them all home!'
  },

  // ── TEAM POSTER ──
  {
    id: 'brew_team_poster',
    category: 'poster',
    exhibit: '1984 Brewers Poster',
    icon: '🖼️',
    animation: 'letter_glow',
    description: 'Claim your official 1984 Milwaukee Brewers team poster, featuring the full roster at County Stadium with Lake Michigan in the distance. A piece of Wisconsin baseball history.'
  },

  // ── ADDITIONAL EXHIBITS ──
  {
    id: 'brew_fingers_closer',
    category: 'inspiration',
    exhibit: 'Rollie Fingers\' Slider',
    icon: '🎯',
    animation: 'fastball_zip',
    description: 'Rollie Fingers is the Brewers\' closer, one of baseball\'s great relievers with his iconic mustache and devastating slider.'
  },
  {
    id: 'brew_caldwell_steady',
    category: 'inspiration',
    exhibit: 'Mike Caldwell\'s Arm',
    icon: '💪',
    animation: 'power_nod',
    description: 'Left-hander Mike Caldwell anchors the Brewers rotation with steady, reliable pitching night after night.'
  },
  {
    id: 'brew_simmons_wisdom',
    category: 'inspiration',
    exhibit: 'Ted Simmons\' Veteran Presence',
    icon: '👨‍💼',
    animation: 'power_nod',
    description: 'Veteran catcher Ted Simmons provides leadership and wisdom to the younger Brewers, directing pitchers and calling games with experience.'
  },
  {
    id: 'brew_gantner_glove',
    category: 'inspiration',
    exhibit: 'Jim Gantner\'s Defense',
    icon: '🧤',
    animation: 'heritage_shine',
    description: 'Second baseman Jim Gantner is a defensive wizard, turning double plays and providing stability up the middle for the Brewers infield.'
  },
  {
    id: 'brew_packers_town',
    category: 'community',
    exhibit: 'Green and Gold Tradition',
    icon: '🏈',
    animation: 'enthusiasm_nod',
    description: 'Wisconsin is Packers country, where football is religion. The Brewers are building their own legacy in a state passionate about sports and community.'
  },
];

// Bobblehead variants for Brewers
export const BREWERS_BOBBLEHEADS = [
  { id: 'brew_bob_yount', name: 'Robin Yount Bobblehead', player: 'Robin Yount', rarity: 'rare', description: 'Yount at shortstop ready position' },
  { id: 'brew_bob_molitor', name: 'Paul Molitor Bobblehead', player: 'Paul Molitor', rarity: 'rare', description: 'Molitor mid-swing at the plate' },
  { id: 'brew_bob_cooper', name: 'Cecil Cooper Bobblehead', player: 'Cecil Cooper', rarity: 'common', description: 'Cooper with bat on shoulder' },
  { id: 'brew_bob_fingers', name: 'Rollie Fingers Bobblehead', player: 'Rollie Fingers', rarity: 'rare', description: 'Fingers mid-delivery with famous mustache' },
  { id: 'brew_bob_team', name: 'Brewers Logo Bobblehead', player: 'Team', rarity: 'common', description: 'Brewers "M" logo with baseball cap jiggling' },
];

// Achievement unlock tracker
export function trackBrewersBannerView(bannerId) {
  const unlocked = [];
  const bannerToAch = {
    'brew_county_stadium': 'brew_banner_fan',
    'brew_team_poster': 'brew_poster_collector',
    'brew_homestand_bobble': 'brew_bobblehead_collector',
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