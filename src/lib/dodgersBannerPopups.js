// Los Angeles Dodgers Team-Specific Banner Popups

export const DODGERS_BANNERS = [
  {
    id: 'dodgers_bobblehead',
    category: 'bobblehead',
    icon: '🏟️',
    color: '#005a9c',
    matchText: 'The Dodgers return home tomorrow night for another exciting series at Dodger Stadium.',
    title: 'Bobblehead Night at Dodger Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Fernando Valenzuela',
        position: 'LHP',
        icon: '🌟',
        body: `Tonight's giveaway: the Fernando Valenzuela Bobblehead!\n\n"Fernandomania" swept all of baseball when this young Mexican left-hander arrived and took the NL by storm with his legendary screwball.\n\nThe first 10,000 fans receive a Fernando Valenzuela bobblehead, complete with his famous sky-gazing windup and #34.\n\n"Fernando made fans out of people who never watched baseball." - Vin Scully\n\nFun Fact: In 1981, Valenzuela won both the Cy Young and Rookie of the Year awards - one of only two players to ever accomplish that.`,
      },
      {
        player: 'Pedro Guerrero',
        position: '3B',
        icon: '💪',
        body: `Tonight's giveaway: the Pedro Guerrero Bobblehead!\n\nPedro Guerrero is one of the most feared hitters in the National League - combining a .300 average with 30+ home run power.\n\nThe first 10,000 fans receive a Pedro Guerrero bobblehead, featuring his compact, powerful right-handed swing and #28.\n\n"Guerrero might be the best hitter in the NL right now." - Vin Scully\n\nFun Fact: Guerrero won the 1981 World Series co-MVP with Ron Cey and Steve Yeager.`,
      },
      {
        player: 'Orel Hershiser',
        position: 'RHP',
        icon: '⚾',
        body: `Tonight's giveaway: the Orel Hershiser Bobblehead!\n\n"The Bulldog" Hershiser is developing into one of the premier pitchers in all of baseball - a workhorse with pinpoint control.\n\nThe first 10,000 fans receive an Orel Hershiser bobblehead, featuring his intense on-mound concentration and #55.\n\n"Hershiser attacks hitters. He just attacks them." - Dodger broadcaster\n\nFun Fact: Hershiser will one day set the record for most consecutive scoreless innings, but for now he's just getting started.`,
      },
      {
        player: 'Steve Sax',
        position: '2B',
        icon: '💨',
        body: `Tonight's giveaway: the Steve Sax Bobblehead!\n\nSteve Sax is the 1982 NL Rookie of the Year and one of the most energetic players on the Dodgers roster.\n\nThe first 10,000 fans receive a Steve Sax bobblehead, complete with his hustle-first style and #3.\n\n"Sax plays every game at full speed." - Vin Scully\n\nFun Fact: Sax was a key contributor to the Dodgers' 1981 World Series championship.`,
      },
      {
        player: 'Mike Scioscia',
        position: 'C',
        icon: '🧤',
        body: `Tonight's giveaway: the Mike Scioscia Bobblehead!\n\nMike Scioscia is one of the toughest catchers in baseball - a master of the plate block and a steady hand behind the dish.\n\nThe first 10,000 fans receive a Mike Scioscia bobblehead, featuring his legendary blocking stance and #14.\n\n"Scioscia is the toughest player to score on in the NL. Period." - Dodger broadcaster\n\nFun Fact: Scioscia once blocked home plate and held on against a freight-train collision from Jack Clark.`,
      },
    ],
    achievement: 'dodgers_bobblehead_collector',
  },
  {
    id: 'dodgers_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#005a9c',
    matchText: 'The first 15,000 fans this Saturday receive a commemorative Dodgers cap.',
    title: 'You Got Your Dodgers Poster!',
    body: `Congratulations! You were one of the first 15,000 fans through the gates at Dodger Stadium today.\n\nYour official 1984 Los Angeles Dodgers Team Poster features the full roster in their classic home whites, posed against the beautiful backdrop of the San Gabriel Mountains.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Fernando Valenzuela - LHP\n  • Pedro Guerrero - 3B\n  • Orel Hershiser - RHP\n  • Steve Sax - 2B\n  • Mike Scioscia - C\n  • And the rest of the 1984 Dodgers!\n\n"First 15,000 fans only. Limit one per person."`,
    achievement: 'dodgers_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_dodgers_banner_views';

export function findDodgersBannerEntry(text) {
  return DODGERS_BANNERS.find(e => e.matchText === text) || null;
}

export function trackDodgersBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['dodgers_bobblehead'] && !achs['dodgers_bobblehead_collector']) {
      achs['dodgers_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('dodgers_bobblehead_collector');
    }
    if (viewed['dodgers_poster'] && !achs['dodgers_poster_collector']) {
      achs['dodgers_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('dodgers_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}