// 5 batter swing-injury types - equal weight
export const BATTER_INJURY_TYPES = [
  { id: 'oblique_strain', name: 'Oblique Strain', emoji: '🤕' },
  { id: 'back_strain', name: 'Back Strain', emoji: '🤕' },
  { id: 'wrist_sprain', name: 'Wrist Sprain', emoji: '✋' },
  { id: 'hand_strain', name: 'Hand Strain', emoji: '✋' },
  { id: 'shoulder_strain', name: 'Shoulder Strain', emoji: '💪' },
];

// 6 HBP injury types - equal weight
export const HBP_INJURY_TYPES = [
  { id: 'forearm_contusion', name: 'Forearm Contusion', emoji: '🤕' },
  { id: 'thigh_contusion', name: 'Thigh Contusion', emoji: '🤕' },
  { id: 'bruised_ribs', name: 'Bruised Ribs', emoji: '🤕' },
  { id: 'bruised_hand', name: 'Bruised Hand', emoji: '✋' },
  { id: 'bruised_elbow', name: 'Bruised Elbow', emoji: '💪' },
  { id: 'bruised_foot', name: 'Bruised Foot', emoji: '🦶' },
];

export function rollBatterInjury() {
  const chance = 0.002; // 0.2% on every swing
  if (Math.random() >= chance) return null;
  const injuryType = BATTER_INJURY_TYPES[Math.floor(Math.random() * BATTER_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true };
}

export function rollHBPIfBatter(hbpCount) {
  const chance = hbpCount >= 2 ? 0.03 : 0.015; // 1.5% first HBP, 3% on 2nd+ HBP same batter
  if (Math.random() >= chance) return null;
  const injuryType = HBP_INJURY_TYPES[Math.floor(Math.random() * HBP_INJURY_TYPES.length)];
  return { ...injuryType, outForGame: true };
}

// Direct lineup replacement for a batter who completed their at-bat.
// (When still at the plate, caller should use pinchHit instead.)
// Also replaces the injured player on base if they're a runner.
export function replaceInjuredBatter(state, batterName, side, replacementPlayer, injuryName) {
  const newState = JSON.parse(JSON.stringify(state));
  const lineupField = side === 'home' ? 'homeLineup' : 'awayLineup';
  const lineup = newState[lineupField];
  const idx = lineup.findIndex(p => p.name === batterName);
  if (idx < 0) return newState;

  const oldPlayer = lineup[idx];
  const histKey = side === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
  if (!newState[histKey]) newState[histKey] = [];
  if (!newState[histKey].find(p => p.name === batterName)) {
    newState[histKey].push({ ...oldPlayer, injured: true, injuryName });
  }
  lineup[idx] = {
    ...replacementPlayer,
    order: oldPlayer.order,
    assignedPos: oldPlayer.assignedPos || replacementPlayer.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
  };
  const benchKey = side === 'home' ? 'homeBenchUsed' : 'awayBenchUsed';
  if (!newState[benchKey]) newState[benchKey] = [];
  if (!newState[benchKey].find(p => p.name === replacementPlayer.name)) {
    newState[benchKey].push(replacementPlayer);
  }

  // Also replace on bases if injured player is a runner (e.g. HBP on first)
  if (newState.bases) {
    newState.bases = newState.bases.map(runner => {
      if (runner?.name === batterName) {
        return { ...replacementPlayer };
      }
      return runner;
    });
  }

  newState.log.push({ type: 'info', text: `🔄 ${replacementPlayer.name} replaces injured ${batterName}` });
  return newState;
}