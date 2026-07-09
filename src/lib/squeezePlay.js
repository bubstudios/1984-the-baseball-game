// squeezePlay.js - Squeeze play detection, resolution, and commentary.
// Pure logic: returns result objects, does NOT mutate game state.
// Used by BOTH the CPU bunt gate (gameEngine.js) and user bunt path (swingResolver.js).

// ── Detection ──
// A squeeze situation: runner on 3rd, fewer than 2 outs.
export function isSqueezeSituation(state) {
  return !!(state.bases && state.bases[2]) && (state.outs || 0) < 2;
}

// Safety squeeze: runner breaks on bunt contact (safer).
// Suicide squeeze: runner breaks before pitch (higher reward, higher risk).
export function determineSqueezeType(batter) {
  const isPitcher = batter.is_pitcher || ['SP', 'RP', 'CL'].includes(batter.pos || '') ||
    (batter.assignedPos && ['SP', 'RP', 'CL'].includes(batter.assignedPos));
  // Pitchers tend toward safety squeeze; position players mix it up more.
  const suicideChance = isPitcher ? 0.30 : 0.40;
  return Math.random() < suicideChance ? 'suicide' : 'safety';
}

// ── Resolution ──
// Returns { type, text, logType, batterOut, runnerScores, runnerOut, missedBunt, squeezeType, composureDelta }
export function resolveSqueeze(batter, state, squeezeType) {
  const runnerOn3rd = state.bases[2];
  const runnerName = runnerOn3rd?.name?.split(' ').pop() || 'the runner';
  const batterLast = batter.name?.split(' ').pop() || 'the batter';

  const conRating = (batter.contact || 3) / 10;
  const buntSkill = (batter.bunting || 3) / 10;
  const isPitcher = batter.is_pitcher || ['SP', 'RP', 'CL'].includes(batter.pos || '');

  // Base chance of getting the bunt down cleanly
  let successChance = 0.50 + conRating * 0.20 + buntSkill * 0.15;
  if (isPitcher) successChance += 0.08; // pitchers practice bunting daily
  if (squeezeType === 'suicide') successChance -= 0.05; // harder with runner breaking early
  successChance = Math.max(0.30, Math.min(0.75, successChance));

  const roll = Math.random();

  if (roll < successChance) {
    // SUCCESS - bunt is down, runner scores
    // Small chance of bunt single (no play anywhere)
    if (roll < successChance * 0.18) {
      return {
        type: 'squeeze_bunt_single',
        text: pickSqueezeLine('bunt_single', batterLast, runnerName, squeezeType),
        logType: 'single',
        batterOut: false,
        runnerScores: true,
        runnerOut: false,
        missedBunt: false,
        squeezeType,
        composureDelta: -12,
      };
    }
    return {
      type: 'squeeze_success',
      text: pickSqueezeLine('success', batterLast, runnerName, squeezeType),
      logType: 'groundout',
      batterOut: true,
      runnerScores: true,
      runnerOut: false,
      missedBunt: false,
      squeezeType,
      composureDelta: -8,
    };
  } else if (roll < successChance + 0.10) {
    // FAILED - bunt too firm, pitcher comes home, runner out at plate
    return {
      type: 'squeeze_failed_runner_out',
      text: pickSqueezeLine('failed_runner_out', batterLast, runnerName, squeezeType),
      logType: 'fc',
      batterOut: false,
      runnerScores: false,
      runnerOut: true,
      missedBunt: false,
      squeezeType,
      composureDelta: 6,
    };
  } else if (roll < successChance + 0.22 && squeezeType === 'suicide') {
    // MISSED BUNT (suicide) - runner hung out to dry, tagged out
    return {
      type: 'squeeze_missed',
      text: pickSqueezeLine('missed', batterLast, runnerName, squeezeType),
      logType: 'info',
      batterOut: false,
      runnerScores: false,
      runnerOut: true,
      missedBunt: true,
      squeezeType,
      composureDelta: 10,
    };
  } else {
    // POPPED UP - batter out, runner holds at 3rd
    return {
      type: 'squeeze_popup',
      text: pickSqueezeLine('popup', batterLast, runnerName, squeezeType),
      logType: 'popout',
      batterOut: true,
      runnerScores: false,
      runnerOut: false,
      missedBunt: false,
      squeezeType,
      composureDelta: -3,
    };
  }
}

// ── Commentary ──
// Uses standard hyphens (-) per project convention.
function pickSqueezeLine(category, batterLast, runnerName, squeezeType) {
  const pools = {
    success: squeezeType === 'suicide' ? [
      `${batterLast} squares early - the squeeze is on! The bunt is down, and ${runnerName} scores easily. Perfect suicide squeeze.`,
      `The suicide squeeze is on! ${batterLast} gets it down, and ${runnerName} races home with the winning run.`,
      `${batterLast} bunts it down the first-base line - ${runnerName} breaks early and scores without a throw. Brilliant suicide squeeze.`,
      `Suicide squeeze! ${batterLast} lays it down perfectly, and ${runnerName} slides across the plate.`,
    ] : [
      `${batterLast} drops the bunt - here comes ${runnerName} from third! The throw goes to first, and the run scores. Perfect safety squeeze.`,
      `${batterLast} deadens it in front of the plate - ${runnerName} breaks for home! The only play is at first, and they steal a run.`,
      `Safety squeeze! ${batterLast} gets it down, and ${runnerName} scores as the batter is retired at first.`,
      `${batterLast} lays down a beauty - ${runnerName} crosses the plate! The defense had no chance.`,
      `The bunt is down and ${runnerName} scores! ${batterLast} is thrown out at first, but the squeeze works.`,
    ],
    bunt_single: [
      `${batterLast} drops a perfect bunt up the first-base line - no play anywhere! ${runnerName} scores, and ${batterLast} reaches with a bunt single.`,
      `A beautiful bunt by ${batterLast} - nobody can make a play! ${runnerName} crosses the plate, and ${batterLast} is safe at first.`,
      `${batterLast} bunts it where nobody can get it - ${runnerName} scores and ${batterLast} has himself a squeeze bunt single!`,
    ],
    failed_runner_out: [
      `The squeeze is on, but ${batterLast} bunts it too firm - the pitcher comes home with it, and ${runnerName} is tagged out at the plate!`,
      `${batterLast} can't get the bunt down soft enough - the pitcher fields it and throws home to nail ${runnerName}! The squeeze fails.`,
      `Squeeze attempt foiled! ${batterLast} bunts it right back to the mound, and ${runnerName} is cut down at the plate.`,
    ],
    missed: [
      `He misses the bunt! ${runnerName} is hung up halfway - the catcher runs him down and makes the tag. Disaster on the suicide squeeze!`,
      `${batterLast} can't get the bunt down, and ${runnerName} is caught dead to rights! The catcher chases him back and tags him out.`,
      `The squeeze is on, but ${batterLast} misses the pitch! ${runnerName} is tagged out trying to scramble back to third.`,
    ],
    popup: [
      `${batterLast} pops up the bunt! The catcher squeezes it for the out, and ${runnerName} dives back to third just in time.`,
      `He pops it up! The catcher makes the catch, and the squeeze is broken up. ${runnerName} scrambles back to the bag.`,
      `${batterLast} pops the bunt up - caught by the catcher! ${runnerName} holds at third, and the squeeze is ruined.`,
    ],
  };
  const pool = pools[category] || pools.success;
  return pool[Math.floor(Math.random() * pool.length)];
}