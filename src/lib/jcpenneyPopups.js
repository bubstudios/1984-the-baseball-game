export function findJCPenneyEntry(text) {
  const keywords = ['jcpenney', 'fashion', 'latest fashions', 'see the latest fashions'];
  return keywords.some(k => text.toLowerCase().includes(k)) ? { id: 'jcpenney_fashion', name: 'JCPenney Fashion' } : null;
}

export function trackJCPenneyView(id) {
  return [];
}