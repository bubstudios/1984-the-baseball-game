export function findFireworksNightEntry(text) {
  const keywords = ['fireworks', 'fireworks night', 'stick around'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'fireworks_night', name: 'Fireworks Night' } : null;
}

export function trackFireworksNightView(id) {
  return [];
}