// ── Celebrations, Bat Flips, Pitcher Fist Pumps, Player Reactions ──
// Triggered on big plays: strikeouts, big hits, diving plays, game-changing moments

import { pickLine } from './commentaryLines';

// ── Pitcher Celebrations (after big Ks, retiring the side, etc.) ──
const PITCHER_FIST_PUMP = [
  "{pitcher} pumps his fist after the strikeout!",
  "{pitcher} lets out a yell - that was a big one!",
  "{pitcher} points to the sky - fired up after that strikeout!",
  "{pitcher} slaps his glove - he's locked in right now.",
  "{pitcher} comes off the mound pumping his fist!",
  "{pitcher} roars - the dugout is alive!",
  "{pitcher} spins on the mound - he knows that was filthy.",
];

const PITCHER_RETIRE_SIDE = [
  "{pitcher} walks off the mound with a swagger - big inning for the defense.",
  "{pitcher} claps his hands twice - that's how you do it.",
  "{pitcher} points to the catcher - great game-calling back there.",
  "{pitcher} tips his cap to the dugout - quality work.",
  "{pitcher} exits with a quiet confidence - three up, three down.",
];

// ── Batter Celebrations ──
const BATTER_ADMIRE = [
  "{batter} watches it go - he knew it off the bat.",
  "{batter} flips the bat and takes a slow walk to first.",
  "{batter} stands in the box a beat too long - and the dugout goes crazy.",
  "{batter} punches the air as he rounds first - big moment!",
  "{batter} points to the dugout - that one was for the boys.",
];

const BATTER_TRIPLE_HUSTLE = [
  "{batter} slides into third and hops up, pumping his fist!",
  "{batter} pulls into third and points to the sky!",
  "{batter} stands on third clapping - that's a hustle triple!",
];

const BATTER_HIT_CELEBRATION = [
  "{batter} slaps hands all the way down the dugout.",
  "{batter} gets a standing ovation from the bench.",
  "The dugout erupts - big hit by {batter}!",
  "{batter} points back to the dugout - they're all on their feet.",
];

// ── Bat Flips ──
const BAT_FLIP_LINES = [
  "{batter} flips the bat high in the air - no doubt about it!",
  "{batter} gives the bat a toss - he knew that one was gone the moment it left his hands.",
  "{batter} flings the bat aside and watches the ball disappear.",
  "{batter} flips the bat with authority - the crowd loves it!",
  "{batter} tosses the bat - a beautiful arc, just like the ball.",
];

// ── Fielder / Team Celebrations on Big Plays ──
const FIELDER_WEB_GEM_REACTION = [
  "The infield converges - everyone going nuts over that play!",
  "Teammates come running - that's the play of the day.",
  "The whole dugout is off the bench - that was something special.",
  "The crowd at {stadium} gives him a standing ovation.",
];

const INNING_ENDING_CELEBRATION = [
  "The pitcher pumps both fists - big inning for the defense.",
  "High fives all around - they needed that one.",
  "The dugout erupts as the third out is recorded.",
  "The team jogs off the field with energy - big momentum shift.",
];

// ── Smack Talk / Trash Talk Flavor (subtle) ──
const PITCHER_STAREDOWN = [
  "{pitcher} watches the batter all the way back to the dugout.",
  "{pitcher} lingers on the mound - making the batter feel it.",
  "{pitcher} stares in - and says something under his breath.",
];

const BATTER_STAREDOWN = [
  "{batter} took one step out of the box - just watching that one go.",
  "{batter} says something as he rounds the bases - the catcher doesn't appreciate it.",
];

// ── Roll functions ──

// Pitcher K celebration: ~30% chance
export function rollPitcherKCelebration(pitcher, isStranding = false) {
  if (Math.random() > 0.30) return null;
  const lines = isStranding ? [...PITCHER_FIST_PUMP, ...PITCHER_STAREDOWN] : PITCHER_FIST_PUMP;
  const line = lines[Math.floor(Math.random() * lines.length)];
  return line.replace(/{pitcher}/g, pitcher.name?.split(' ').pop() || pitcher.name);
}

// Pitcher retire side: ~40% chance (ONLY call this after inning ends, not mid-inning)
export function rollPitcherRetireSide(pitcher) {
   if (Math.random() > 0.40) return null;
   const line = PITCHER_RETIRE_SIDE[Math.floor(Math.random() * PITCHER_RETIRE_SIDE.length)];
   return line.replace(/{pitcher}/g, pitcher.name?.split(' ').pop() || pitcher.name);
}

// HR bat flip: ~35% chance (separate from regular bat flip tracking)
export function rollBatFlip(batter) {
  if (Math.random() > 0.35) return null;
  const line = BAT_FLIP_LINES[Math.floor(Math.random() * BAT_FLIP_LINES.length)];
  return line.replace(/{batter}/g, batter.name?.split(' ').pop() || batter.name);
}

// Big hit (XBH / RBI single) celebration: ~25% chance
export function rollHitCelebration(batter, isTriple = false) {
  if (Math.random() > 0.25) return null;
  const pool = isTriple ? BATTER_TRIPLE_HUSTLE : BATTER_HIT_CELEBRATION;
  const line = pool[Math.floor(Math.random() * pool.length)];
  return line.replace(/{batter}/g, batter.name?.split(' ').pop() || batter.name);
}

// Big HR admiration: ~40% on HR (separate entry)
export function rollHRAdmire(batter) {
  if (Math.random() > 0.40) return null;
  const pool = [...BATTER_ADMIRE, ...BAT_FLIP_LINES];
  const line = pool[Math.floor(Math.random() * pool.length)];
  return line.replace(/{batter}/g, batter.name?.split(' ').pop() || batter.name);
}

// Web gem / diving play celebration: ~50% chance
export function rollFielderCelebration(stadium = '') {
  if (Math.random() > 0.50) return null;
  const pool = [...FIELDER_WEB_GEM_REACTION, ...INNING_ENDING_CELEBRATION];
  const line = pool[Math.floor(Math.random() * pool.length)];
  return line.replace(/{stadium}/g, stadium || 'the ballpark');
}

// Staredown after K or HR: ~15%
export function rollStaredown(actor, isPitcher = true) {
  if (Math.random() > 0.15) return null;
  const pool = isPitcher ? PITCHER_STAREDOWN : BATTER_STAREDOWN;
  const line = pool[Math.floor(Math.random() * pool.length)];
  const name = actor.name?.split(' ').pop() || actor.name;
  return line.replace(/{pitcher}/g, name).replace(/{batter}/g, name);
}

// Stolen base celebration: ~60% chance
export function rollStolenBaseCelebration(runner, base) {
  if (Math.random() > 0.60) return null;
  const baseName = base === 0 ? 'second' : base === 1 ? 'third' : 'home';
  const lines = [
    `{runner} swipes {base}!`,
    `{runner} is safe at {base} - clean steal!`,
    `{runner} takes {base} on a dirty steal!`,
    `{runner} motors to {base} - no play!`,
    `{runner} jumps to {base} - got a good jump!`,
  ];
  const line = lines[Math.floor(Math.random() * lines.length)];
  return line.replace(/{runner}/g, runner.name?.split(' ').pop() || runner.name).replace(/{base}/g, baseName);
}