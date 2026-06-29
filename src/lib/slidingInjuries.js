// 6 sliding injury types - equal weight
export const SLIDING_INJURY_TYPES = [
  { id: 'jammed_finger', name: 'Jammed Finger', emoji: '🤕' },
  { id: 'sprained_thumb', name: 'Sprained Thumb', emoji: '🤕' },
  { id: 'wrist_sprain', name: 'Wrist Sprain', emoji: '✋' },
  { id: 'ankle_sprain', name: 'Ankle Sprain', emoji: '🦶' },
  { id: 'knee_sprain', name: 'Knee Sprain', emoji: '🦵' },
  { id: 'leg_contusion', name: 'Leg Contusion', emoji: '🦵' },
];

// Base entry: 1st base = 99% standing up; 2nd/3rd/home = 50/50
export function getSlideChance(destinationBase) {
  // destinationBase: 0=1st, 1=2nd, 2=3rd, -1=home (scored or out)
  if (destinationBase === 0) return 0.01; // 1st base: 1% slide
  return 0.50; // 2nd, 3rd, home: 50% slide
}

export function rollSlidingInjury(hasContact) {
  const chance = hasContact ? 0.06 : 0.03; // 3% base, 6% with fielder contact
  if (Math.random() >= chance) return null;
  const injuryType = SLIDING_INJURY_TYPES[Math.floor(Math.random() * SLIDING_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true };
}