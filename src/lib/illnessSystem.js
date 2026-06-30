// 6 illness types - equal weight
// Season: 2% per team (not per player); Exhibition: 4% per team
export const ILLNESS_TYPES = [
  { id: 'flu', name: 'Flu-Like Symptoms', emoji: '🤒' },
  { id: 'stomach', name: 'Stomach Issues', emoji: '🤢' },
  { id: 'dizziness', name: 'Dizziness', emoji: '😵' },
  { id: 'dehydration', name: 'Dehydration', emoji: '🥵' },
  { id: 'migraine', name: 'Migraine', emoji: '🤕' },
  { id: 'cramps', name: 'Muscle Cramps', emoji: '🦵' },
];

export function rollIllnessesForTeam(teamData, isExhibition = false) {
  if (!teamData) return [];
  const allPlayers = [
    ...(teamData.lineup || []),
    ...(teamData.bench || []),
    ...(teamData.rotation || []),
    ...(teamData.bullpen || []),
  ];
  if (allPlayers.length === 0) return [];

  // Season: ~2% chance one player gets ill per team (roll once per team, pick a random player)
  // Exhibition: ~4% chance
  const teamChance = isExhibition ? 0.04 : 0.02;
  if (Math.random() >= teamChance) return [];

  // Pick one random player from the full roster to be ill
  const player = allPlayers[Math.floor(Math.random() * allPlayers.length)];
  const illness = ILLNESS_TYPES[Math.floor(Math.random() * ILLNESS_TYPES.length)];
  return [{ name: player.name, illness: illness.name, emoji: illness.emoji }];
}