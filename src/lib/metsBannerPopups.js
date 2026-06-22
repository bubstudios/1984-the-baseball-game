// New York Mets Team-Specific Banner Popups

export const METS_BANNERS = [
  {
    id: 'mets_bobblehead',
    category: 'bobblehead',
    icon: '🗽',
    color: '#002d72',
    matchText: 'The Mets continue their homestand tomorrow evening at Shea Stadium.',
    title: 'Bobblehead Night at Shea',
    isRotation: true,
    rotation: [
      {
        player: 'Dwight Gooden',
        position: 'RHP',
        icon: '⚡',
        body: `Tonight's giveaway: the Dwight Gooden Bobblehead!\n\nAt just 19 years old, "Doc" Gooden is the most exciting young pitcher in all of baseball. His fastball explodes and his curveball — "Lord Charles" — breaks right off the table.\n\nThe first 10,000 fans receive a Dwight Gooden bobblehead, complete with his high leg kick and #16.\n\n"The kid is from another planet." — Shea Stadium faithful\n\nFun Fact: Gooden struck out 276 batters in 1984, setting a new NL rookie record.`,
      },
      {
        player: 'Darryl Strawberry',
        position: 'RF',
        icon: '🌟',
        body: `Tonight's giveaway: the Darryl Strawberry Bobblehead!\n\nDarryl Strawberry's sweet left-handed swing produces some of the longest home runs in Shea Stadium history.\n\nThe first 10,000 fans receive a Darryl Strawberry bobblehead, featuring his towering follow-through and #18.\n\n"When Straw connects, you don't need to watch — you just listen for the crowd." — Shea broadcaster\n\nFun Fact: Strawberry was the #1 overall pick in the 1980 draft.`,
      },
      {
        player: 'Keith Hernandez',
        position: '1B',
        icon: '🧤',
        body: `Tonight's giveaway: the Keith Hernandez Bobblehead!\n\nKeith Hernandez is widely considered the best defensive first baseman in baseball history, and his bat is no slouch either.\n\nThe first 10,000 fans receive a Keith Hernandez bobblehead, featuring his trademark mustache and #17.\n\n"Hernandez redefines what a first baseman can do." — Mets broadcaster\n\nFun Fact: Hernandez won 11 consecutive Gold Gloves at first base.`,
      },
      {
        player: 'Mookie Wilson',
        position: 'CF',
        icon: '💨',
        body: `Tonight's giveaway: the Mookie Wilson Bobblehead!\n\nMookie Wilson is pure joy to watch — a switch-hitting speedster who plays with infectious enthusiasm.\n\nThe first 10,000 fans receive a Mookie Wilson bobblehead, complete with his wide smile and #1.\n\n"Mookie makes everyone smile — the fans, the teammates, even the umpires." — Shea broadcaster\n\nFun Fact: Wilson stole 54 bases in 1982 and remains one of the fastest players in the NL.`,
      },
      {
        player: 'Ron Darling',
        position: 'RHP',
        icon: '⚾',
        body: `Tonight's giveaway: the Ron Darling Bobblehead!\n\nRon Darling brings intelligence and athleticism to the mound — a Yale graduate with a nasty repertoire.\n\nThe first 10,000 fans receive a Ron Darling bobblehead, featuring his studious expression and #12.\n\n"Darling pitches with his head as much as his arm." — Mets broadcaster\n\nFun Fact: Darling no-hit St. John's for 11 innings in the 1981 NCAA Tournament.`,
      },
    ],
    achievement: 'mets_bobblehead_collector',
  },
  {
    id: 'mets_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#002d72',
    matchText: 'The first 10,000 fans at Shea Stadium receive a commemorative Mets poster.',
    title: 'You Got Your Mets Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Shea Stadium today.\n\nYour official 1984 New York Mets Team Poster features the full roster in their home pinstripes, posed in front of the Shea Stadium scoreboard.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Dwight Gooden — RHP\n  • Darryl Strawberry — RF\n  • Keith Hernandez — 1B\n  • Mookie Wilson — CF\n  • Ron Darling — RHP\n  • And the rest of the 1984 Mets!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'mets_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_mets_banner_views';

export function findMetsBannerEntry(text) {
  return METS_BANNERS.find(e => e.matchText === text) || null;
}

export function trackMetsBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['mets_bobblehead'] && !achs['mets_bobblehead_collector']) {
      achs['mets_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('mets_bobblehead_collector');
    }
    if (viewed['mets_poster'] && !achs['mets_poster_collector']) {
      achs['mets_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('mets_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}