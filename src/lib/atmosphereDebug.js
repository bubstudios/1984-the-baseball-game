// atmosphereDebug.js - Temporary debug counters for atmosphere event systems
// Tracks whether events are: checked, fired, or blocked by various conditions

const counters = {
  bp_checked: 0,
  bp_fired: 0,
  bp_blocked_cooldown: 0,
  celeb_checked: 0,
  celeb_fired: 0,
  bubble_fired: 0,
  fan_checked: 0,
  fan_fired: 0,
  bench_checked: 0,
  bench_fired: 0,
  blocked_banner: 0,
  blocked_gamestate: 0,
};

export function inc(key) {
  counters[key] = (counters[key] || 0) + 1;
}

export function resetCounters() {
  Object.keys(counters).forEach(k => { counters[k] = 0; });
}

export function getCounters() {
  return { ...counters };
}

// ── Force event generators (for test buttons) ──

import { BALLPARK_EVENTS, rollBallparkEvent } from './ballparkEvents';
import { rollBatFlip, rollHRAdmire, rollHitCelebration, rollPitcherKCelebration, rollStaredown, rollFielderCelebration } from './celebrations';

export function forceBallparkEvent(gameState) {
  const event = rollBallparkEvent(gameState);
  if (event) return event;
  const homeTeam = gameState?.homeTeam;
  const pool = BALLPARK_EVENTS.filter(e => !e.team || e.team === homeTeam);
  return pool[Math.floor(Math.random() * pool.length)] || BALLPARK_EVENTS[0];
}

export function forceCelebrationText(batter, pitcher) {
  const generators = [
    () => rollBatFlip(batter),
    () => rollHRAdmire(batter),
    () => rollHitCelebration(batter, false),
    () => rollHitCelebration(batter, true),
    () => rollPitcherKCelebration(pitcher),
    () => rollStaredown(pitcher, true),
    () => rollStaredown(batter, false),
    () => rollFielderCelebration(),
  ];
  for (const gen of generators.sort(() => Math.random() - 0.5)) {
    const text = gen();
    if (text) return text;
  }
  return `${batter?.name?.split(' ').pop() || 'The batter'} flips the bat with authority!`;
}

export function forceBenchChirp() {
  const chirps = [
    "COME ON, BLUE!",
    "That's been a strike all day!",
    "Where was that one?!",
    "You've gotta be kidding!",
    "He's been calling that all game!",
    "The dugout is getting restless...",
    "Someone's barking from the bench",
    "Chirps coming from the dugout",
    "The bench is letting Blue hear it",
    "Sarcastic cheering from the dugout",
  ];
  return {
    callType: chirps[Math.floor(Math.random() * chirps.length)],
    severity: "chirp",
    score: 0,
    category: "routine",
    isChirp: true,
  };
}

export function forceRobbedHRText(batterName, fielderName) {
  return `${batterName || 'The batter'} sends it deep - ${fielderName || 'the outfielder'} climbs the wall and brings it back! HOME RUN ROBBED!`;
}