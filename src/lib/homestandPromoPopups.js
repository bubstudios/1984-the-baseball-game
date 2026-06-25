export function findHomestandPromoEntry(text) {
  const keywords = ['homestand', 'cap night', 'magnetic schedule'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'homestand_promo', name: 'Homestand Promo' } : null;
}

export function trackHomestandPromoView(id) {
  return [];
}