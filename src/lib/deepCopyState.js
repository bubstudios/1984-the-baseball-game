// ── Reference-preserving deep copy ──
// JSON.parse(JSON.stringify(state)) breaks shared references: if the same player
// object appears in both state.homeLineup[0] and state.bases[0], the deep copy
// creates two SEPARATE clones. Incrementing gameStats.runs on the base clone
// then doesn't affect the lineup clone the box score reads. This function uses
// a Map to preserve identity: shared references stay shared after copy.
export function deepCopyState(state) {
  const seen = new Map();
  function copy(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (seen.has(obj)) return seen.get(obj);
    if (Array.isArray(obj)) {
      const arr = [];
      seen.set(obj, arr);
      for (const item of obj) arr.push(copy(item));
      return arr;
    }
    const clone = {};
    seen.set(obj, clone);
    for (const key of Object.keys(obj)) {
      clone[key] = copy(obj[key]);
    }
    return clone;
  }
  return copy(state);
}