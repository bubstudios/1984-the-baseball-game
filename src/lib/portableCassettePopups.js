export function findPortableCassetteEntry(text) {
  const keywords = ['cassette', 'portable', 'music', 'walkman'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'portable_cassette', name: 'Portable Cassette' } : null;
}

export function trackPortableCassetteView(id) {
  return [];
}