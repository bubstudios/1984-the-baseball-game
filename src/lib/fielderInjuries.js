// 6 fielder injury types - equal weight
export const FIELDER_INJURY_TYPES = [
  { id: 'shoulder_strain', name: 'Shoulder Strain', emoji: '💪' },
  { id: 'wrist_sprain', name: 'Wrist Sprain', emoji: '✋' },
  { id: 'bruised_ribs', name: 'Bruised Ribs', emoji: '🫁' },
  { id: 'knee_strain', name: 'Knee Strain', emoji: '🦵' },
  { id: 'jammed_finger', name: 'Jammed Finger', emoji: '🤕' },
  { id: 'ankle_strain', name: 'Ankle Strain/Sprain', emoji: '🦶' },
];

// Trigger chances: diving stop 3%, diving catch 10%, collision 14%
const TRIGGER_CHANCES = {
  divingStop: 0.02,
  divingCatch: 0.06,
  collision: 0.09,
};

export function rollFielderInjury(triggerType) {
  const chance = TRIGGER_CHANCES[triggerType] || 0;
  if (chance === 0 || Math.random() >= chance) return null;
  const injuryType = FIELDER_INJURY_TYPES[Math.floor(Math.random() * FIELDER_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true, trigger: triggerType };
}