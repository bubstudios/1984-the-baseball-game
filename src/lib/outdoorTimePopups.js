export function findOutdoorTimeEntry(text) {
  const keywords = ['outdoor', 'outdoors', 'quality time', 'weekend'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'outdoor_time', name: 'Outdoor Time' } : null;
}

export function trackOutdoorTimeView(id) {
  return [];
}