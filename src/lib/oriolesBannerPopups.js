// Baltimore Orioles Team-Specific Banner Popups

export const ORIOLES_BANNERS = [
  {
    id: 'orioles_bobblehead',
    category: 'bobblehead',
    icon: '🐦',
    color: '#df4601',
    matchText: 'The Orioles return home tomorrow night at Memorial Stadium.',
    title: 'Bobblehead Night at Memorial Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Cal Ripken Jr.',
        position: 'SS',
        icon: '⭐',
        body: `Tonight's giveaway: the Cal Ripken Jr. Bobblehead!\n\nCal Ripken Jr. is redefining the shortstop position - a big man playing a small man's position, and doing it better than anyone.\n\nThe first 10,000 fans receive a limited-edition Ripken bobblehead, complete with his #8 and upright batting stance.\n\n"Cal is the best thing to happen to Baltimore baseball since Brooks Robinson." - Chuck Thompson\n\nFun Fact: Ripken has not missed a game since May 30, 1982 - his consecutive games streak is already historic.`,
      },
      {
        player: 'Eddie Murray',
        position: '1B',
        icon: '💪',
        body: `Tonight's giveaway: the Eddie Murray Bobblehead!\n\n"Steady Eddie" Murray is one of the most quietly dominant players in baseball - a switch-hitter who hits with power from both sides.\n\nThe first 10,000 fans receive an Eddie Murray bobblehead, featuring his no-nonsense stance and #33.\n\n"Murray doesn't talk much. He just produces." - Chuck Thompson\n\nFun Fact: Murray had his best seasons from both sides of the plate in 1983 as the Orioles won the World Series.`,
      },
      {
        player: 'Mike Boddicker',
        position: 'RHP',
        icon: '🎯',
        body: `Tonight's giveaway: the Mike Boddicker Bobblehead!\n\nMike Boddicker won the 1983 ALCS with a masterful shutout and is now one of the premier pitchers in the American League.\n\nThe first 10,000 fans receive a Mike Boddicker bobblehead, featuring his tricky off-speed delivery and #21.\n\n"Boddicker doesn't overpower you. He outsmarts you." - AL hitter\n\nFun Fact: Boddicker went 20-11 in 1984 and was a legitimate Cy Young candidate.`,
      },
      {
        player: 'Rick Dempsey',
        position: 'C',
        icon: '🧤',
        body: `Tonight's giveaway: the Rick Dempsey Bobblehead!\n\nRick Dempsey is the fiery leader behind the plate for the defending World Champions - nobody handles a pitching staff better.\n\nThe first 10,000 fans receive a Rick Dempsey bobblehead, complete with his catcher's gear and #24.\n\n"Dempsey calls the perfect game, every time." - Orioles broadcaster\n\nFun Fact: Dempsey was named the 1983 World Series MVP after hitting .385 with a home run.`,
      },
      {
        player: 'Scott McGregor',
        position: 'LHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Scott McGregor Bobblehead!\n\nScott McGregor won Game 5 of the 1983 World Series with a complete game shutout - the Orioles' craftiest lefthander.\n\nThe first 10,000 fans receive a Scott McGregor bobblehead, featuring his smooth delivery and #22.\n\n"McGregor is the most complete pitcher in the American League." - Chuck Thompson\n\nFun Fact: McGregor pitched the clinching Game 5 shutout of the 1983 World Series against the Phillies.`,
      },
    ],
    achievement: 'orioles_bobblehead_collector',
  },
  {
    id: 'orioles_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#df4601',
    matchText: 'The first 10,000 fans receive an Orioles commemorative cap.',
    title: 'You Got Your Orioles Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Memorial Stadium today.\n\nYour official 1984 Baltimore Orioles Team Poster features the World Champions in their home whites with the iconic Orioles bird logo.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Cal Ripken Jr. - SS\n  • Eddie Murray - 1B\n  • Mike Boddicker - RHP\n  • Rick Dempsey - C\n  • Scott McGregor - LHP\n  • And the rest of the 1984 Orioles!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'orioles_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_orioles_banner_views';

export function findOriolesBannerEntry(text) {
  return ORIOLES_BANNERS.find(e => e.matchText === text) || null;
}

export function trackOriolesBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['orioles_bobblehead'] && !achs['orioles_bobblehead_collector']) {
      achs['orioles_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('orioles_bobblehead_collector');
    }
    if (viewed['orioles_poster'] && !achs['orioles_poster_collector']) {
      achs['orioles_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('orioles_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}