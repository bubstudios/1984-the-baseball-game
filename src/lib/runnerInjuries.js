// 6 runner injury types - equal weight
export const RUNNER_INJURY_TYPES = [
  { id: 'hamstring_strain', name: 'Hamstring Strain', emoji: '🦵' },
  { id: 'groin_strain', name: 'Groin Strain', emoji: '🦵' },
  { id: 'quad_strain', name: 'Quad Strain', emoji: '🦵' },
  { id: 'ankle_sprain', name: 'Ankle Sprain', emoji: '🦶' },
  { id: 'knee_strain', name: 'Knee Strain', emoji: '🦵' },
  { id: 'calf_strain', name: 'Calf Strain', emoji: '🦵' },
];

export function rollRunnerInjury(isExhibition = false) {
  const base = 0.0006; // 0.06% Season; 0.12% Exhibition
  const chance = isExhibition ? base * 2 : base;
  if (Math.random() >= chance) return null;
  const injuryType = RUNNER_INJURY_TYPES[Math.floor(Math.random() * RUNNER_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true };
}