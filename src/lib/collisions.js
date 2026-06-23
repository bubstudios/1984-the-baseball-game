// ── Runner Collisions System ──
// Happens when a runner slides hard into 2B, 3B, or Home
// Can cause: normal play, injury scare, real injury, or brawl trigger

// ── Collision calls at Home Plate ──
const HOME_PLATE_COLLISION_CALLS = [
  "COLLISION AT THE PLATE! The runner came in hard — and the catcher holds on!",
  "He BOWLS OVER the catcher — the ball pops loose! SAFE!",
  "The runner absolutely crushes the catcher — the ball squirts away!",
  "Big collision at home — the catcher holds his ground and the runner is OUT!",
  "He came in with his spikes high — the catcher makes the tag and hangs on!",
  "The runner lowered the boom at home — SAFE! And the catcher is down!",
  "What a collision at home plate — he scored, but nobody's moving for a moment.",
  "Hard slide at the plate — the tag is made — OUT! And both players are shaking it off.",
];

// ── Collision calls at 2B ──
const SECOND_BASE_COLLISION_CALLS = [
  "The runner came in hard at second — the fielder held on for the out!",
  "Hard slide into second — the ball pops loose — SAFE!",
  "He came in with a takeout slide — broke up the double play attempt!",
  "Aggressive slide into second — the throw is off — no double play!",
  "The runner went in hard — and the shortstop had to dodge!",
  "He upended the second baseman — the relay throw is nowhere near first!",
];

// ── Collision calls at 3B ──
const THIRD_BASE_COLLISION_CALLS = [
  "He came in hot at third — the tag is applied and he's out!",
  "Hard slide into third — he beats the tag!",
  "He crashed into third base — and the ball skips away! He's safe!",
  "The runner came in hard at third — both players are fine.",
];

export function rollCollision(baseIndex, runnerSpeed, fielderArm) {
  // baseIndex: 0=1B, 1=2B, 2=3B, 'home'=home
  // Collisions only at 2B, 3B, and Home
  if (baseIndex !== 1 && baseIndex !== 2 && baseIndex !== 'home') return null;

  // Base probability: ~8% per contested play at the bag
  const speedFactor = (runnerSpeed || 5) / 10;
  const chance = 0.06 + speedFactor * 0.04; // faster runners more aggressive

  if (Math.random() > chance) return null;

  let calls, base;
  if (baseIndex === 'home') { calls = HOME_PLATE_COLLISION_CALLS; base = 'home'; }
  else if (baseIndex === 2) { calls = THIRD_BASE_COLLISION_CALLS; base = 'third'; }
  else { calls = SECOND_BASE_COLLISION_CALLS; base = 'second'; }

  const text = calls[Math.floor(Math.random() * calls.length)];

  // Determine outcome: safe, out, or ambiguous
  const ballPopped = text.includes('pops loose') || text.includes('skips away') || text.includes('ball squirts');
  const isOut = text.includes('OUT') && !ballPopped;
  const isBrawlRisk = text.includes('spikes high') || text.includes('bowls over') || text.includes('absolutely crushes');

  // Who gets hurt? Runner, fielder, or both — weighted by play intensity
  const trigger = ballPopped ? 'collision' : (isBrawlRisk ? 'plate_collision' : null);
  let injuredParty = null;
  if (trigger) {
    const roll = Math.random();
    if (isBrawlRisk) {
      // Violent collision — fielder more likely hurt (took the blow), both possible
      if (roll < 0.40) injuredParty = 'fielder';
      else if (roll < 0.65) injuredParty = 'runner';
      else if (roll < 0.75) injuredParty = 'both';
      else injuredParty = null;
    } else {
      // Standard collision — runner more likely hurt (sliding in)
      if (roll < 0.35) injuredParty = 'runner';
      else if (roll < 0.55) injuredParty = 'fielder';
      else if (roll < 0.60) injuredParty = 'both';
      else injuredParty = null;
    }
  }

  return {
    text,
    base,
    ballPopped,
    isOut,
    isBrawlRisk,
    injuryTrigger: trigger,
    injuredParty,  // 'runner' | 'fielder' | 'both' | null
  };
}

// Hard takeout slide at 2B to break up a double play
// Called when a DP is attempted and there's a runner
export function rollTakeoutSlide(runner) {
  if (!runner) return null;
  const aggressionChance = 0.12 + (runner.speed || 5) / 100;
  if (Math.random() > aggressionChance) return null;

  const TAKEOUT_CALLS = [
    `${runner.name.split(' ').pop()} came in hard to break up the double play — and it worked!`,
    `Takeout slide by ${runner.name.split(' ').pop()}! The relay throw goes wide — batter safe at first!`,
    `${runner.name.split(' ').pop()} goes in hard at second — the fielder had to throw off-balance!`,
    `Big slide at second by ${runner.name.split(' ').pop()} — the double play is broken up!`,
  ];

  const roll = Math.random();
  // Takeout slides: fielder (2B/SS) absorbs the hit — more likely to injure fielder
  let injuredParty = null;
  if (roll < 0.30) injuredParty = 'fielder';
  else if (roll < 0.45) injuredParty = 'runner';
  else if (roll < 0.50) injuredParty = 'both';

  return {
    text: TAKEOUT_CALLS[Math.floor(Math.random() * TAKEOUT_CALLS.length)],
    brokeUpDP: true,
    injuryTrigger: 'collision',
    injuredParty,
  };
}