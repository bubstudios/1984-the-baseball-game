// squeezePlay.js - Squeeze play detection, resolution, and commentary.
// Pure logic: returns result objects, does NOT mutate game state.
// Used by BOTH the CPU bunt gate (gameEngine.js) and user bunt path (swingResolver.js).

// ── Detection ──
// Base check: runner on 3rd, fewer than 2 outs. Used only as a quick predicate.
// For the full tactical decision, use shouldAttemptSqueeze() instead.
export function isSqueezeSituation(state) {
  return !!(state.bases && state.bases[2]) && (state.outs || 0) < 2;
}

// ── Squeeze tracking (per-team, persists on game state) ──
export function getTeamSqueezeTracking(state, side) {
  if (!state._squeezeTracking) state._squeezeTracking = {};
  if (!state._squeezeTracking[side]) {
    state._squeezeTracking[side] = {
      attempts: 0,
      lastInning: null,
      lastPA: null,
      lastBuntInning: null,
    };
  }
  return state._squeezeTracking[side];
}

export function recordSqueezeAttempt(state) {
  const side = state.halfInning === 'top' ? 'away' : 'home';
  const tracking = getTeamSqueezeTracking(state, side);
  tracking.attempts++;
  tracking.lastInning = state.inning;
  tracking.lastPA = state._paCount || 0;
  tracking.lastBuntInning = state.inning;
}

export function recordBuntAttempt(state) {
  const side = state.halfInning === 'top' ? 'away' : 'home';
  const tracking = getTeamSqueezeTracking(state, side);
  tracking.lastBuntInning = state.inning;
}

// ── Full squeeze eligibility check ──
// Returns true only when a squeeze is tactically appropriate AND not on cooldown.
// This is the SINGLE gate for both CPU and user squeeze attempts.
// Squeeze should be RARE - a special tactical event, not the default CPU behavior.
export function shouldAttemptSqueeze(state, batter) {
  if (!state || !batter) return false;

  // Base situation: runner on 3rd, fewer than 2 outs
  if (!state.bases || !state.bases[2]) return false;
  if ((state.outs || 0) >= 2) return false;

  const battingSide = state.halfInning === 'top' ? 'away' : 'home';
  const fieldingSide = battingSide === 'home' ? 'away' : 'home';
  const margin = (state.score[battingSide] || 0) - (state.score[fieldingSide] || 0);

  // HARD BLOCK: never squeeze when ahead/behind by 4+ runs
  if (Math.abs(margin) >= 4) return false;

  // Must be 7th inning or later (squeezes are late-game tactical plays)
  if (state.inning < 7) return false;

  // Close game only: tied, down 1, or up 1
  if (Math.abs(margin) > 1) return false;

  // Cooldown and per-game caps
  const tracking = getTeamSqueezeTracking(state, battingSide);
  if (tracking.attempts >= 2) return false; // hard cap: 2 per game (rare max)
  if (tracking.attempts >= 1) {
    const inningsSince = state.inning - (tracking.lastInning || 0);
    const paSince = (state._paCount || 0) - (tracking.lastPA || 0);
    // Cooldown: 3 innings OR 12 PAs must pass before another squeeze
    if (inningsSince < 3 && paSince < 12) return false;
  }

  // Batter profile: don't squeeze with middle-of-order power hitters
  // (extremely rare 2% manager surprise exception)
  const isPitcher = batter.is_pitcher || ['SP','RP','CL'].includes(batter.pos || '') ||
    (batter.assignedPos && ['SP','RP','CL'].includes(batter.assignedPos));
  const power = batter.power || 5;
  if (power >= 7 && !isPitcher) {
    if (Math.random() > 0.02) return false;
  }

  // Runner on 3rd must not be extremely slow
  const runner = state.bases[2];
  if ((runner.speed || 5) <= 2) return false;

  // Don't squeeze if the team already bunted this inning (no back-to-back bunts)
  if (tracking.lastBuntInning === state.inning) return false;

  return true;
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

// ── Run labeling ──
// Computes the correct label for a run that's about to score (the squeeze runner from 3rd),
// based on PRE-PLAY score. A run is only "winning" if it actually ends the game
// (home team takes the lead in the bottom of the 9th or later).
export function getRunLabel(state) {
  const battingSide = state.halfInning === 'top' ? 'away' : 'home';
  const fieldingSide = battingSide === 'home' ? 'away' : 'home';
  const battingScore = state.score[battingSide] || 0;
  const fieldingScore = state.score[fieldingSide] || 0;
  const newBattingScore = battingScore + 1;

  // 1. Ties the game
  if (newBattingScore === fieldingScore) return 'tying';
  // 2/3. Takes the lead (was tied or trailing, now ahead)
  if (newBattingScore > fieldingScore && battingScore <= fieldingScore) {
    // 3. Home team takes the lead in bottom 9+ = walk-off winner
    if (battingSide === 'home' && state.inning >= 9) return 'winning';
    return 'go-ahead';
  }
  // 4. Extends an existing lead
  return 'insurance';
}

// Maps a run label to a descriptor phrase used in squeeze commentary.
function runPhrase(runLabel) {
  switch (runLabel) {
    case 'tying': return 'races home with the tying run';
    case 'winning': return 'races home with the winning run';
    case 'go-ahead': return 'races home to take the lead';
    case 'insurance': return 'races home for an insurance run';
    default: return 'races home';
  }
}

// ── Resolution ──
// Returns { type, text, logType, batterOut, runnerScores, runnerOut, missedBunt, squeezeType, composureDelta, walkOff }
export function resolveSqueeze(batter, state, squeezeType) {
  const runnerOn3rd = state.bases[2];
  const runnerName = runnerOn3rd?.name?.split(' ').pop() || 'the runner';
  const batterLast = batter.name?.split(' ').pop() || 'the batter';
  const runLabel = getRunLabel(state);
  const walkOff = runLabel === 'winning';

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
        text: pickSqueezeLine('bunt_single', batterLast, runnerName, squeezeType, runLabel),
        logType: 'single',
        batterOut: false,
        runnerScores: true,
        runnerOut: false,
        missedBunt: false,
        squeezeType,
        composureDelta: -12,
        walkOff,
      };
    }
    return {
      type: 'squeeze_success',
      text: pickSqueezeLine('success', batterLast, runnerName, squeezeType, runLabel),
      logType: 'groundout',
      batterOut: true,
      runnerScores: true,
      runnerOut: false,
      missedBunt: false,
      squeezeType,
      composureDelta: -8,
      walkOff,
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
// runLabel ('tying'|'winning'|'go-ahead'|'insurance') makes every scoring description
// score-context-correct - a run is only called "winning" if it ends the game.
function pickSqueezeLine(category, batterLast, runnerName, squeezeType, runLabel) {
  const phrase = runPhrase(runLabel);
  const pools = {
    success: squeezeType === 'suicide' ? [
      `The suicide squeeze is on! ${batterLast} gets it down, and ${runnerName} ${phrase}.`,
      `${batterLast} squares early - the squeeze is on! The bunt is down, and ${runnerName} ${phrase}. Perfect suicide squeeze.`,
      `Suicide squeeze! ${batterLast} lays it down perfectly, and ${runnerName} ${phrase}.`,
      `${batterLast} bunts it down the first-base line - ${runnerName} breaks early and ${phrase}! Brilliant suicide squeeze.`,
    ] : [
      `${batterLast} drops the bunt - here comes ${runnerName} from third! The throw goes to first, and ${runnerName} ${phrase}. Perfect safety squeeze.`,
      `Safety squeeze! ${batterLast} gets it down, and ${runnerName} ${phrase} as the batter is retired at first.`,
      `${batterLast} lays down a beauty - ${runnerName} ${phrase}! The defense had no chance.`,
      `The bunt is down and ${runnerName} ${phrase}! ${batterLast} is thrown out at first, but the squeeze works.`,
      `${batterLast} deadens it in front of the plate - ${runnerName} breaks for home! The only play is at first, and ${runnerName} ${phrase}.`,
    ],
    bunt_single: [
      `${batterLast} drops a perfect bunt up the first-base line - no play anywhere! ${runnerName} ${phrase}, and ${batterLast} reaches with a bunt single.`,
      `A beautiful bunt by ${batterLast} - nobody can make a play! ${runnerName} ${phrase}, and ${batterLast} is safe at first.`,
      `${batterLast} bunts it where nobody can get it - ${runnerName} ${phrase} and ${batterLast} has himself a squeeze bunt single!`,
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