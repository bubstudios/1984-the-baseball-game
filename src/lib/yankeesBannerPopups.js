// New York Yankees Team-Specific Banner Popups

export const YANKEES_BANNERS = [
  {
    id: 'yankees_bobblehead',
    category: 'bobblehead',
    icon: '⚾',
    color: '#003087',
    matchText: 'Join the Yankees this Sunday for Old-Timers Day at Yankee Stadium.',
    title: 'Bobblehead Night at Yankee Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Don Mattingly',
        position: '1B',
        icon: '⭐',
        body: `Tonight's giveaway: the Don Mattingly Bobblehead!\n\n"Donnie Baseball" is the most pure hitter to come along in years — a sweet left-handed swing and Gold Glove defense to match.\n\nThe first 10,000 fans receive a limited-edition Mattingly bobblehead, complete with his trademark batting stance and #23.\n\n"Mattingly is going to be the best player in baseball for the next decade." — Yankee Stadium faithful\n\nFun Fact: Mattingly is hitting over .340 in 1984 with the kind of contact and power combo that's rare in any era.`,
      },
      {
        player: 'Dave Winfield',
        position: 'RF',
        icon: '💪',
        body: `Tonight's giveaway: the Dave Winfield Bobblehead!\n\nDave Winfield is an elite force — one of the best all-around players in baseball with power, speed, and a cannon arm.\n\nThe first 10,000 fans receive a Dave Winfield bobblehead, featuring his imposing 6'6" frame and #31.\n\n"Winfield can beat you with the bat, the glove, or the arm." — Yankee broadcaster\n\nFun Fact: Winfield is a 12-time All-Star who also played basketball and was drafted by the NBA.`,
      },
      {
        player: 'Ron Guidry',
        position: 'LHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Ron Guidry Bobblehead!\n\n"Louisiana Lightning" Guidry is one of the most dominant left-handers of his era — still one of the most feared pitchers in the AL.\n\nThe first 10,000 fans receive a Ron Guidry bobblehead, complete with his explosive delivery and #49.\n\n"When Guidry is on, you're just hoping to foul one off." — AL batter\n\nFun Fact: Guidry went 25-3 in 1978 with a 1.74 ERA — one of the greatest pitching seasons ever.`,
      },
      {
        player: 'Dave Righetti',
        position: 'LHP/CL',
        icon: '⚡',
        body: `Tonight's giveaway: the Dave Righetti Bobblehead!\n\n"Rags" Righetti throws absolute smoke and is one of the most exciting closers in the game after his 1983 no-hitter.\n\nThe first 10,000 fans receive a Dave Righetti bobblehead, featuring his intense lefty delivery and #19.\n\n"When Righetti comes in, this game is over." — Yankee Stadium crowd\n\nFun Fact: Righetti threw a no-hitter against the Red Sox on July 4, 1983 — Independence Day at the Stadium.`,
      },
      {
        player: 'Willie Randolph',
        position: '2B',
        icon: '🎯',
        body: `Tonight's giveaway: the Willie Randolph Bobblehead!\n\nWillie Randolph is the quiet leader of the Yankees — a professional's professional who does everything right.\n\nThe first 10,000 fans receive a Willie Randolph bobblehead, featuring his steady, fundamental style and #30.\n\n"Randolph never makes mistakes. Never." — Yogi Berra\n\nFun Fact: Randolph has been a Yankee since 1976 and is one of the most consistent players in franchise history.`,
      },
    ],
    achievement: 'yankees_bobblehead_collector',
  },
  {
    id: 'yankees_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#003087',
    matchText: 'Stop by the souvenir stands for official Yankees yearbooks and scorecards.',
    title: 'You Got Your Yankees Poster!',
    body: `Congratulations! You were one of the first 15,000 fans through the gates at Yankee Stadium today.\n\nYour official 1984 New York Yankees Team Poster features the full roster in their classic pinstripes, posed in the famous Monument Park.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Don Mattingly — 1B\n  • Dave Winfield — RF\n  • Ron Guidry — LHP\n  • Dave Righetti — CL\n  • Willie Randolph — 2B\n  • And the rest of the 1984 Yankees!\n\n"First 15,000 fans only. Limit one per person."`,
    achievement: 'yankees_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_yankees_banner_views';

export function findYankeesBannerEntry(text) {
  return YANKEES_BANNERS.find(e => e.matchText === text) || null;
}

export function trackYankeesBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['yankees_bobblehead'] && !achs['yankees_bobblehead_collector']) {
      achs['yankees_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('yankees_bobblehead_collector');
    }
    if (viewed['yankees_poster'] && !achs['yankees_poster_collector']) {
      achs['yankees_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('yankees_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}