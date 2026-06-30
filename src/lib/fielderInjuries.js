// 6 fielder injury types - equal weight
export const FIELDER_INJURY_TYPES = [
  { id: 'shoulder_strain', name: 'Shoulder Strain', emoji: '💪' },
  { id: 'wrist_sprain', name: 'Wrist Sprain', emoji: '✋' },
  { id: 'bruised_ribs', name: 'Bruised Ribs', emoji: '🫁' },
  { id: 'knee_strain', name: 'Knee Strain', emoji: '🦵' },
  { id: 'jammed_finger', name: 'Jammed Finger', emoji: '🤕' },
  { id: 'ankle_strain', name: 'Ankle Strain/Sprain', emoji: '🦶' },
];

// Season rates: diving stop 0.25%, diving catch 0.70%, collision 1.25%
// Exhibition rates: double each
const TRIGGER_CHANCES = {
  divingStop: 0.0025,
  divingCatch: 0.007,
  collision: 0.0125,
};

export function rollFielderInjury(triggerType, isExhibition = false) {
  const base = TRIGGER_CHANCES[triggerType] || 0;
  const chance = isExhibition ? base * 2 : base;
  if (chance === 0 || Math.random() >= chance) return null;
  const injuryType = FIELDER_INJURY_TYPES[Math.floor(Math.random() * FIELDER_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true, trigger: triggerType };
}