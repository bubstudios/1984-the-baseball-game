// Cincinnati Reds Team-Specific Banner Popups

export const REDS_BANNERS = [
  {
    id: 'reds_bobblehead',
    category: 'bobblehead',
    icon: '🔴',
    color: '#c6011f',
    matchText: 'The Reds continue their homestand tomorrow night at Riverfront Stadium.',
    title: 'Bobblehead Night at Riverfront Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Pete Rose',
        position: '1B',
        icon: '⭐',
        body: `Tonight's giveaway: the Pete Rose Bobblehead!\n\n"Charlie Hustle" is chasing the all-time hits record and is still playing with the energy of a rookie at 43 years old.\n\nThe first 10,000 fans receive a limited-edition Rose bobblehead, complete with his iconic headfirst slide pose and #14.\n\n"Pete Rose plays baseball the way it's supposed to be played." - Joe Nuxhall\n\nFun Fact: Rose is within striking distance of Ty Cobb's all-time hit record of 4,191. The entire baseball world is watching.`,
      },
      {
        player: 'Dave Parker',
        position: 'RF',
        icon: '💪',
        body: `Tonight's giveaway: the Dave Parker Bobblehead!\n\n"The Cobra" Parker brings his immense physical gifts to Cincinnati after being one of the most feared hitters in the NL throughout the late 70s.\n\nThe first 10,000 fans receive a Dave Parker bobblehead, featuring his imposing left-handed stance and #39.\n\n"Parker hits the ball harder than anyone in this league." - Marty Brennaman\n\nFun Fact: Parker was the NL MVP in 1978 and an eight-time Gold Glove winner in right field.`,
      },
      {
        player: 'Mario Soto',
        position: 'RHP',
        icon: '🔥',
        body: `Tonight's giveaway: the Mario Soto Bobblehead!\n\nMario Soto is the unquestioned ace of the Reds staff - a Dominican right-hander with one of the nastiest changeups in the game.\n\nThe first 10,000 fans receive a Mario Soto bobblehead, featuring his deceptive delivery and #21.\n\n"Soto's changeup looks like a fastball until it just dies." - NL hitter\n\nFun Fact: Soto's changeup is rated as the best in the National League by opposing batters.`,
      },
      {
        player: 'Dave Concepcion',
        position: 'SS',
        icon: '🎯',
        body: `Tonight's giveaway: the Dave Concepcion Bobblehead!\n\nDavey Concepcion is a Cincinnati institution - the shortstop of the legendary Big Red Machine teams and still one of the finest in the NL.\n\nThe first 10,000 fans receive a Dave Concepcion bobblehead, complete with his elegant fielding style and #13.\n\n"Concepcion is Cincinnati baseball." - Joe Nuxhall\n\nFun Fact: Concepcion pioneered the one-hop throw from deep in the hole - a technique now used by shortstops worldwide.`,
      },
      {
        player: 'John Franco',
        position: 'CL',
        icon: '⚡',
        body: `Tonight's giveaway: the John Franco Bobblehead!\n\nJohn Franco is a scrappy Brooklyn kid who has emerged as one of the best closers in the National League.\n\nThe first 10,000 fans receive a John Franco bobblehead, featuring his intense southpaw delivery and #45.\n\n"Franco is the toughest out in the ninth inning in the NL." - Reds broadcaster\n\nFun Fact: Franco's screwball-heavy approach mirrors his mentor Tommy John and makes him virtually unhittable in save situations.`,
      },
    ],
    achievement: 'reds_bobblehead_collector',
  },
  {
    id: 'reds_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#c6011f',
    matchText: 'The first 10,000 fans this Sunday receive a commemorative Reds team poster.',
    title: 'You Got Your Reds Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Riverfront Stadium today.\n\nYour official 1984 Cincinnati Reds Team Poster features the full roster in their classic home reds, posed against the backdrop of the Ohio River.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Pete Rose - 1B\n  • Dave Parker - RF\n  • Mario Soto - RHP\n  • Dave Concepcion - SS\n  • John Franco - CL\n  • And the rest of the 1984 Reds!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'reds_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_reds_banner_views';

export function findRedsBannerEntry(text) {
  return REDS_BANNERS.find(e => e.matchText === text) || null;
}

export function trackRedsBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['reds_bobblehead'] && !achs['reds_bobblehead_collector']) {
      achs['reds_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('reds_bobblehead_collector');
    }
    if (viewed['reds_poster'] && !achs['reds_poster_collector']) {
      achs['reds_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('reds_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}