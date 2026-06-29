// Kansas City Royals Team-Specific Banner Popups

export const ROYALS_BANNERS = [
  {
    id: 'royals_bobblehead',
    category: 'bobblehead',
    icon: '👑',
    color: '#004687',
    matchText: 'The Royals continue their homestand tomorrow night at Royals Stadium.',
    title: 'Bobblehead Night at Royals Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'George Brett',
        position: '3B',
        icon: '⭐',
        body: `Tonight's giveaway: the George Brett Bobblehead!\n\nGeorge Brett is simply one of the greatest hitters who ever lived - a .300 hitter with power, leadership, and pure intensity.\n\nThe first 10,000 fans receive a limited-edition Brett bobblehead, complete with his classic left-handed stance and #5.\n\n"George Brett plays baseball the way you dream about it." - Denny Matthews\n\nFun Fact: Brett nearly hit .400 in 1980, finishing at .390 - the highest average since Ted Williams hit .406 in 1941.`,
      },
      {
        player: 'Dan Quisenberry',
        position: 'CL',
        icon: '⚡',
        body: `Tonight's giveaway: the Dan Quisenberry Bobblehead!\n\n"Quiz" Quisenberry is the best reliever in the American League - a submarine delivery artist who saves games with precision rather than power.\n\nThe first 10,000 fans receive a Dan Quisenberry bobblehead, complete with his unique underhand delivery and #29.\n\n"Quisenberry makes hitters look silly with that submarine ball." - AL announcer\n\nFun Fact: Quisenberry led the AL in saves five times and was the most dominant closer of the early 1980s.`,
      },
      {
        player: 'Frank White',
        position: '2B',
        icon: '🎯',
        body: `Tonight's giveaway: the Frank White Bobblehead!\n\nFrank White is a Kansas City native and one of the most beloved players in Royals history - an eight-time Gold Glove second baseman.\n\nThe first 10,000 fans receive a Frank White bobblehead, featuring his range and sure hands and #20.\n\n"Frank White is the best second baseman in the American League." - Denny Matthews\n\nFun Fact: White was born in Greenville, Mississippi but grew up in Kansas City and has been a Royal his entire career.`,
      },
      {
        player: 'Willie Wilson',
        position: 'CF',
        icon: '💨',
        body: `Tonight's giveaway: the Willie Wilson Bobblehead!\n\nWillie Wilson is one of the fastest players in all of baseball - a switch-hitting center fielder who turns singles into doubles.\n\nThe first 10,000 fans receive a Willie Wilson bobblehead, complete with his sprinting pose and #6.\n\n"Wilson is the fastest man in the American League. Maybe in all of baseball." - Denny Matthews\n\nFun Fact: Wilson stole 83 bases in 1979, breaking a Royals franchise record that may never be broken.`,
      },
      {
        player: 'Bret Saberhagen',
        position: 'RHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Bret Saberhagen Bobblehead!\n\nAt just 20 years old, Bret Saberhagen has pinpoint control and a poise beyond his years - one of the most promising young pitchers in the AL.\n\nThe first 10,000 fans receive a Bret Saberhagen bobblehead, featuring his crisp delivery and #18.\n\n"Sabes throws strikes. Every count, every situation - he throws strikes." - Dick Howser\n\nFun Fact: Saberhagen is on his way to becoming the 1985 World Series MVP and Cy Young Award winner.`,
      },
    ],
    achievement: 'royals_bobblehead_collector',
  },
  {
    id: 'royals_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#004687',
    matchText: 'The first 10,000 fans this Sunday receive a commemorative Royals team poster.',
    title: 'You Got Your Royals Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Royals Stadium today.\n\nYour official 1984 Kansas City Royals Team Poster features the full roster in their iconic powder blue road uniforms - the finest look in baseball.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • George Brett - 3B\n  • Dan Quisenberry - CL\n  • Frank White - 2B\n  • Willie Wilson - CF\n  • Bret Saberhagen - RHP\n  • And the rest of the 1984 Royals!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'royals_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_royals_banner_views';

export function findRoyalsBannerEntry(text) {
  return ROYALS_BANNERS.find(e => e.matchText === text) || null;
}

export function trackRoyalsBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['royals_bobblehead'] && !achs['royals_bobblehead_collector']) {
      achs['royals_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('royals_bobblehead_collector');
    }
    if (viewed['royals_poster'] && !achs['royals_poster_collector']) {
      achs['royals_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('royals_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}