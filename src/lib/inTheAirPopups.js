export function findInTheAirEntry(text) {
  const keywords = ['chicago', 'album', 'latest album'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'chicago_album', name: 'Chicago Album' } : null;
}

export function trackInTheAirView(id) {
  return [];
}