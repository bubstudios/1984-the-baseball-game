export function findPepsiEntry(text) {
  const keywords = ['pepsi', 'choice of a new generation', 'choice'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'pepsi_choice', name: 'Pepsi' } : null;
}

export function trackPepsiView(id) {
  return [];
}