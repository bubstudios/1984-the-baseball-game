// Detroit Tigers Bobblehead & Poster Banners (homestand/poster triggers)
// These supplement the existing detroitTigersBannerPopups.js

export const TIGERS_PROMO_BANNERS = [
  {
    id: 'tigers_bobblehead',
    category: 'bobblehead',
    icon: '🐯',
    color: '#0c2340',
    matchText: 'The Tigers continue their homestand tomorrow afternoon in Detroit.',
    title: 'Bobblehead Night at Tiger Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Alan Trammell',
        position: 'SS',
        icon: '⭐',
        body: `Tonight's giveaway: the Alan Trammell Bobblehead!\n\nAlan Trammell is the soul of the Detroit Tigers — a Gold Glove shortstop and consistent run producer.\n\nThe first 10,000 fans receive a limited-edition Trammell bobblehead, complete with his #3 and classic batting stance.\n\n"Trammell is the best shortstop in the American League." — Ernie Harwell\n\nFun Fact: Trammell and Lou Whitaker have been Detroit's double-play combination since 1977.`,
      },
      {
        player: 'Jack Morris',
        position: 'RHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Jack Morris Bobblehead!\n\nJack Morris is the undisputed ace of the Tigers staff, a fiery competitor who refuses to back down.\n\nThe first 10,000 fans receive a Jack Morris bobblehead, featuring his intense on-mound demeanor and #47.\n\n"Morris wants the ball every fourth day and doesn't want to come out." — Sparky Anderson\n\nFun Fact: Morris led the AL in wins in 1983 and is the iron man of the Tigers rotation.`,
      },
      {
        player: 'Kirk Gibson',
        position: 'RF',
        icon: '💪',
        body: `Tonight's giveaway: the Kirk Gibson Bobblehead!\n\nKirk Gibson brings the intensity of a football player to baseball, combining raw power with blazing speed.\n\nThe first 10,000 fans receive a Kirk Gibson bobblehead, featuring his powerful left-handed swing.\n\n"Gibson plays every game like it's Game 7." — Tigers broadcaster\n\nFun Fact: Gibson was an All-American wide receiver at Michigan State before choosing baseball.`,
      },
      {
        player: 'Lou Whitaker',
        position: '2B',
        icon: '🧢',
        body: `Tonight's giveaway: the Lou Whitaker Bobblehead!\n\n"Sweet Lou" Whitaker is one of the smoothest second basemen in the game, making the difficult look routine.\n\nThe first 10,000 fans receive a Lou Whitaker bobblehead, complete with his graceful fielding stance.\n\n"Lou Whitaker makes everything look easy." — Ernie Harwell\n\nFun Fact: Whitaker and Trammell won the AL Rookie of the Year together in 1978.`,
      },
      {
        player: 'Lance Parrish',
        position: 'C',
        icon: '⚡',
        body: `Tonight's giveaway: the Lance Parrish Bobblehead!\n\nLance Parrish is one of the most physically imposing catchers in baseball history — a three-time Gold Glove winner.\n\nThe first 10,000 fans receive a Lance Parrish bobblehead, complete with his catcher's gear and #13.\n\n"Nobody throws better than Parrish. Nobody." — Tigers broadcaster\n\nFun Fact: Parrish hit 33 home runs in 1984, making him one of the most powerful catchers in the AL.`,
      },
    ],
    achievement: 'tigers_bobblehead_collector',
  },
  {
    id: 'tigers_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#0c2340',
    matchText: 'The first 10,000 fans receive a Tigers team poster this Sunday.',
    title: 'You Got Your Tigers Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Tiger Stadium today.\n\nYour official 1984 Detroit Tigers Team Poster features the full roster in their home whites with the classic navy and orange trim.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Alan Trammell — SS\n  • Jack Morris — RHP\n  • Kirk Gibson — RF\n  • Lou Whitaker — 2B\n  • Lance Parrish — C\n  • And the rest of the 1984 Tigers!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'tigers_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_tigers_promo_banner_views';

export function findTigersBannerEntry2(text) {
  return TIGERS_PROMO_BANNERS.find(e => e.matchText === text) || null;
}

export function trackTigersBannerView2(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['tigers_bobblehead'] && !achs['tigers_bobblehead_collector']) {
      achs['tigers_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('tigers_bobblehead_collector');
    }
    if (viewed['tigers_poster'] && !achs['tigers_poster_collector']) {
      achs['tigers_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('tigers_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}