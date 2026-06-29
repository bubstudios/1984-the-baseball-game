// San Diego Padres Team-Specific Banner Popups

export const PADRES_BANNERS = [
  {
    id: 'padres_bobblehead',
    category: 'bobblehead',
    icon: '⚾',
    color: '#2f241d',
    matchText: 'The Padres continue their homestand tomorrow evening at Jack Murphy Stadium.',
    title: 'Bobblehead Night at Jack Murphy Stadium',
    isRotation: true,
    rotation: [
      {
        player: 'Tony Gwynn',
        position: 'RF',
        icon: '⭐',
        body: `Tonight's giveaway: the Tony Gwynn Bobblehead!\n\nTony Gwynn is the best pure hitter in the National League - a line-drive machine with the sweetest left-handed swing in the game.\n\nThe first 10,000 fans receive a limited-edition Gwynn bobblehead, complete with his trademark compact stance and #19.\n\n"Gwynn doesn't miss pitches. He never misses pitches." - Jerry Coleman\n\nFun Fact: Gwynn is challenging for the NL batting title in 1984, hitting well over .350 with his patented inside-out swing.`,
      },
      {
        player: 'Steve Garvey',
        position: '1B',
        icon: '💪',
        body: `Tonight's giveaway: the Steve Garvey Bobblehead!\n\nSteve Garvey is one of the most respected players in baseball - an iron man first baseman who plays in pain and never complains.\n\nThe first 10,000 fans receive a Steve Garvey bobblehead, featuring his square jaw and number #6.\n\n"Garvey is a professional's professional." - Dick Williams\n\nFun Fact: Garvey played in 1,207 consecutive games - the NL record - before it ended in 1983.`,
      },
      {
        player: 'Goose Gossage',
        position: 'CL',
        icon: '🔥',
        body: `Tonight's giveaway: the Goose Gossage Bobblehead!\n\n"Goose" Gossage is one of the most terrifying relief pitchers ever - a mustachioed fireman who throws pure heat.\n\nThe first 10,000 fans receive a Goose Gossage bobblehead, complete with his intimidating glare and #54.\n\n"When Gossage comes in, hitters just hope to survive." - Jerry Coleman\n\nFun Fact: Gossage's fastball was clocked at over 100 mph as recently as 1982.`,
      },
      {
        player: 'Graig Nettles',
        position: '3B',
        icon: '🧤',
        body: `Tonight's giveaway: the Graig Nettles Bobblehead!\n\nGraig Nettles is widely considered the greatest defensive third baseman of his generation - a vacuum at the hot corner.\n\nThe first 10,000 fans receive a Graig Nettles bobblehead, featuring his famous diving backhand stop and #9.\n\n"Nettles is still as good as anyone in the National League at third." - Padres broadcaster\n\nFun Fact: Nettles' 1978 World Series defensive performance is considered one of the greatest in Series history.`,
      },
      {
        player: 'Eric Show',
        position: 'RHP',
        icon: '⚾',
        body: `Tonight's giveaway: the Eric Show Bobblehead!\n\nEric Show is the ace of the Padres staff - an intellectual right-hander who outthinks hitters with a deep repertoire.\n\nThe first 10,000 fans receive an Eric Show bobblehead, featuring his intense delivery and #23.\n\n"Show is the smartest pitcher on our staff." - Dick Williams\n\nFun Fact: Show once surrendered Pete Rose's record-breaking 4,192nd career hit in 1985.`,
      },
    ],
    achievement: 'padres_bobblehead_collector',
  },
  {
    id: 'padres_poster',
    category: 'poster',
    icon: '🖼️',
    color: '#2f241d',
    matchText: 'The first 10,000 fans receive a Padres team poster.',
    title: 'You Got Your Padres Poster!',
    body: `Congratulations! You were one of the first 10,000 fans through the gates at Jack Murphy Stadium today.\n\nYour official 1984 San Diego Padres Team Poster features the full roster in their brown and gold home uniforms, posed under the San Diego sunshine.\n\nThe poster measures 24" x 36" and is suitable for framing.\n\nFeatured players include:\n  • Tony Gwynn - RF\n  • Steve Garvey - 1B\n  • Goose Gossage - CL\n  • Graig Nettles - 3B\n  • Eric Show - RHP\n  • And the rest of the 1984 Padres!\n\n"First 10,000 fans only. Limit one per person."`,
    achievement: 'padres_poster_collector',
  },
];

const VIEWED_KEY = 'bb84_padres_banner_views';

export function findPadresBannerEntry(text) {
  return PADRES_BANNERS.find(e => e.matchText === text) || null;
}

export function trackPadresBannerView(entryId) {
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    const viewed = raw ? JSON.parse(raw) : {};
    viewed[entryId] = (viewed[entryId] || 0) + 1;
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
    const unlocked = [];
    const achRaw = localStorage.getItem('bb84_achievements');
    const achs = achRaw ? JSON.parse(achRaw) : {};
    if (viewed['padres_bobblehead'] && !achs['padres_bobblehead_collector']) {
      achs['padres_bobblehead_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('padres_bobblehead_collector');
    }
    if (viewed['padres_poster'] && !achs['padres_poster_collector']) {
      achs['padres_poster_collector'] = Date.now();
      localStorage.setItem('bb84_achievements', JSON.stringify(achs));
      unlocked.push('padres_poster_collector');
    }
    return unlocked;
  } catch (e) { return []; }
}