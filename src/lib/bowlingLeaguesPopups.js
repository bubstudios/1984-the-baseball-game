export function findBowlingLeaguesEntry(text) {
  const keywords = ['bowling', 'leagues forming', 'bowling leagues'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'bowling_leagues', name: 'Bowling Leagues' } : null;
}

export function trackBowlingLeaguesView(id) {
  return [];
}