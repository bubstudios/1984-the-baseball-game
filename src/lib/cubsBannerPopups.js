// Chicago Cubs Team-Specific Banner Popups

export const CUBS_BANNERS = [
  {
    id: 'cubs_bobblehead',
    category: 'bobblehead',
    icon: '🐻',
    color: '#0e3386',
    matchText: 'The Cubs continue their homestand tomorrow afternoon at Wrigley Field.',
    title: 'Bobblehead Night at Wrigley',
    isRotation: true,
    rotation: [
      {
        player: 'Ryne Sandberg',
        position: '2B',
        icon: '⭐',
        body: `Tonight's giveaway: the Ryne Sandberg Bobblehead!\n\nRyne Sandberg is having one of the greatest seasons in Cubs history, and may be the best second baseman in all of baseball.\n\nThe first 10,000 fans receive a limited-edition Sandberg bobblehead, complete with his trademark batting stance and #23.\n\n"Ryno is the heart and soul of this Cubs team." — Harry Caray\n\nFun Fact: Sandberg won the NL MVP award in 1984 after a historic June 23rd game against the Cardinals.`,
      },
      {
        player: 'Rick Sutcliffe',
        position: 'RHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Rick Sutcliffe Bobblehead!\n\nAfter coming over from Cleveland, Big Rick has been absolutely untouchable in a Cubs uniform.\n\nThe first 10,000 fans receive a Rick Sutcliffe bobblehead, featuring his imposing 6'7" frame and trademark red beard.\n\n"When Sutcliffe is on the mound, you feel like you've already won." — Cubs broadcaster\n\nFun Fact: Sutcliffe went 16-1 with the Cubs in 1984 after his mid-season trade.`,
      },
      {
        player: 'Leon Durham',
        position: '1B',
        icon: '💪',
        body: `Tonight's giveaway: the Leon Durham Bobblehead!\n\n"Bull" Durham is one of the most popular players in the Cubs clubhouse, combining power at the plate with solid defense.\n\nThe first 10,000 fans receive a Leon Durham bobblehead, featuring his powerful left-handed swing.\n\n"Bull is the kind of player you build a team around." — Jim Frey\n\nFun Fact: Durham hit .279 with 23 home runs in 1984.`,
      },
      {
        player: 'Jody Davis',
        position: 'C',
        icon: '🧤',
        body: `Tonight's giveaway: the Jody Davis Bobblehead!\n\nJody Davis is one of the finest catchers in the National League, combining a cannon arm with surprising power at the plate.\n\nThe first 10,000 fans receive a Jody Davis bobblehead, complete with his catcher's gear.\n\n"Jody calls a great game and nobody runs on him." — Harry Caray\n\nFun Fact: Davis drove in 94 runs in 1984, an impressive total for a catcher.`,
      },
      {
        player: 'Bob Dernier',
        position: 'CF',
        icon: '💨',
        body: `Tonight's giveaway: the Bob Dernier Bobblehead!\n\n"The Dude" Dernier is the Cubs' leadoff spark plug, using his blazing speed to create havoc on the bases.\n\nThe first 10,000 fans receive a Bob Dernier bobblehead, featuring his sprinting stance.\n\n"Dernier changes the game the moment he gets on base." — Cubs broadcaster\n\nFun Fact: Dernier stole 45 bases in 1984 and was a key part of the Cubs' NL East title run.`,
      },
    ],
    achievement: 'cubs_bobblehead_collector',
  },
  {
    id: 'cubs_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#0e3386',
    matchText: 'Stop by Wrigley Field on Sunday. The first 10,000 youngsters receive a Cubs team poster.',
    title: 'You Got Your Cubs Poster!',
    body: `Congratulations! You were one of the first 10,000 youngsters through the gates at Wrigley Field today.\n\nYour official 1984 Cubs Team Poster features the full roster in their home pinstripes, posed in front of the famous ivy-covered outfield wall.\n\nThe poster measures 24" x 36" and is suitable for framing. Hang it proudly in your room.\n\nFeatured players include:\n  • Ryne Sandberg — 2B\n  • Rick Sutcliffe — RHP\n  • Leon Durham — 1B\n  • Jody Davis — C\n  • Bob Dernier — CF\n  • And the rest of the 1984 Cubs!\n\n"First 10,000 youngsters only. Limit one per person."`,
    achievement: 'cubs_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_cubs_banner_views';

export function findCubsBannerEntry(text) {
  return CUBS_BANNERS.find(e => e.matchText === text) || null;
}

export function trackCubsBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['cubs_bobblehead'] && !achs['cubs_bobblehead_collector']) {
      achs['cubs_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('cubs_bobblehead_collector');
    }
    if (viewed['cubs_poster'] && !achs['cubs_poster_collector']) {
      achs['cubs_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('cubs_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}