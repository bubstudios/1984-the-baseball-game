// 6 illness types — equal weight, 1% chance per player on roster
export const ILLNESS_TYPES = [
  { id: 'flu', name: 'Flu-Like Symptoms', emoji: '🤒' },
  { id: 'stomach', name: 'Stomach Issues', emoji: '🤢' },
  { id: 'dizziness', name: 'Dizziness', emoji: '😵' },
  { id: 'dehydration', name: 'Dehydration', emoji: '🥵' },
  { id: 'migraine', name: 'Migraine', emoji: '🤕' },
  { id: 'cramps', name: 'Muscle Cramps', emoji: '🦵' },
];

export function rollIllnessesForTeam(teamData) {
  if (!teamData) return [];
  const allPlayers = [
    ...(teamData.lineup || []),
    ...(teamData.bench || []),
    ...(teamData.rotation || []),
    ...(teamData.bullpen || []),
  ];
  const ill = [];
  for (const player of allPlayers) {
    if (Math.random() < 0.01) {
      const illness = ILLNESS_TYPES[Math.floor(Math.random() * ILLNESS_TYPES.length)];
      ill.push({ name: player.name, illness: illness.name, emoji: illness.emoji });
    }
  }
  return ill;
}