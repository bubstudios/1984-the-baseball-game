export function findChryslerMinivanEntry(text) {
  const keywords = ['chrysler', 'minivan', 'america reimagined'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'chrysler_minivan', name: 'Chrysler Minivan' } : null;
}

export function trackChryslerMinivanView(id) {
  return [];
}