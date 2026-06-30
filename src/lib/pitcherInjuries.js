import { getPitcherFatigue } from './gameEngine';

// 6 pitcher injury types - equal weight
export const PITCHER_INJURY_TYPES = [
  { id: 'shoulder_soreness', name: 'Shoulder Soreness', emoji: '💪' },
  { id: 'elbow_soreness', name: 'Elbow Soreness', emoji: '💪' },
  { id: 'forearm_strain', name: 'Forearm Strain', emoji: '💪' },
  { id: 'blister', name: 'Blister on Pitching Hand', emoji: '✋' },
  { id: 'back_spasms', name: 'Back Spasms', emoji: '🤕' },
  { id: 'oblique_strain', name: 'Oblique Strain', emoji: '🤕' },
];

// Season rates per pitch (0.005% base, scales with fatigue)
// Exhibition rates: double each
export function getPitcherInjuryChance(fatigueLevel, isExhibition = false) {
  let base;
  if (fatigueLevel >= 3) base = 0.00020; // GASSED
  else if (fatigueLevel >= 2) base = 0.00015; // TIRING
  else if (fatigueLevel >= 1) base = 0.00010; // FADING
  else base = 0.00005;                         // Base rate (0.005%)
  return isExhibition ? base * 2 : base;
}

export function rollPitcherInjury(fatigueLevel, isExhibition = false) {
  const chance = getPitcherInjuryChance(fatigueLevel, isExhibition);
  if (Math.random() >= chance) return null;
  const injuryType = PITCHER_INJURY_TYPES[Math.floor(Math.random() * PITCHER_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true };
}

// Called after every pitch resolves. Mutates newState (already a deep copy).
export function checkPitcherInjury(prevState, newState) {
  // Skip if pitcher was already ejected this pitch
  if (newState._pendingEjectionReplacement) return newState;

  const pitchingSide = prevState.halfInning === 'top' ? 'home' : 'away';
  const pitcherObj = pitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  if (!pitcherObj) return newState;

  const ip = pitcherObj.gameStats?.ip || 0;
  const fatigue = getPitcherFatigue(ip, pitcherObj);
  const isExhibition = !prevState.seasonId;
  const injury = rollPitcherInjury(fatigue.fatigueLevel, isExhibition);

  if (injury) {
    // Mark pitcher as injured (out for rest of game)
    if (pitchingSide === 'home') {
      newState.homePitcher = { ...newState.homePitcher, injured: true, injuryName: injury.name };
    } else {
      newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryName: injury.name };
    }

    newState._pendingPitcherInjury = {
      ...injury,
      side: pitchingSide,
      pitcherName: pitcherObj.name,
    };

    newState.log.push({ type: 'injury', text: `🚑 ${pitcherObj.name} is done - ${injury.name}!` });
  }

  return newState;
}