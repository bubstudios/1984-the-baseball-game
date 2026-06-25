export function findChurchBakeSaleEntry(text) {
  const keywords = ['bake sale', 'church', 'women\'s auxiliary', 'food bank'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'church_bakesale', name: 'Church Bake Sale' } : null;
}

export function trackChurchBakeSaleView(id) {
  return [];
}