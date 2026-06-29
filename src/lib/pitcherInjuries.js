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

// Injury chance by fatigue level (matches MatchupCard labels)
export function getPitcherInjuryChance(fatigueLevel) {
  if (fatigueLevel >= 3) return 0.0004; // GASSED
  if (fatigueLevel >= 2) return 0.0003; // TIRING
  if (fatigueLevel >= 1) return 0.0002; // FADING
  return 0.0001;                        // Base rate
}

export function rollPitcherInjury(fatigueLevel) {
  const chance = getPitcherInjuryChance(fatigueLevel);
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
  const injury = rollPitcherInjury(fatigue.fatigueLevel);

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