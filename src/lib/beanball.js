// Beanball Engine - HBP, retaliation, celebrations, collisions, brawls
// Tracks game-wide tension and fires contextual events

// ── Beanball Context (mutates gameState._beanball) ──
export function getBeanballContext(state) {
  if (!state._beanball) {
    state._beanball = {
      tension: 0,
      lastHRBatter: null,
      lastHRPitcher: null,
      lastHBPTeam: null,
      lastHBPBatter: null,
      lastHBPPitcher: null,
      lastHBPInning: 0,
      warningIssued: false,
      warningInning: 0,
      retaliations: 0,
      collisions: 0,
      hardSlides: 0,
      beanballHits: 0,
      brawlTriggered: false,
      batFlips: [],
      fistPumps: [],
      recentEvents: [], // last 5 events for context
    };
  }
  return state._beanball;
}

// ── Tension modifiers per event ──
export function addTension(state, amount, reason) {
  const ctx = getBeanballContext(state);
  ctx.tension = Math.min(100, ctx.tension + amount);
  ctx.recentEvents.unshift({ reason, amount, inning: state.inning });
  if (ctx.recentEvents.length > 5) ctx.recentEvents.pop();
}

// ── Should batter celebrate? (bat flip, fist pump) ──
export function shouldBatFlip(batter) {
  const power = batter.power || 5;
  return Math.random() < 0.03 + (power / 10) * 0.06; // 3-9% chance
}

export function shouldFistPump(pitcher, wasBigK = false) {
  if (wasBigK) return Math.random() < 0.08; // 8% on big Ks
  return Math.random() < 0.02; // 2% otherwise
}

// ── HBP Context Reasons ──
const HBP_REASONS = {
  revengeHR: { baseChance: 0.15, tensionAdd: 40, label: 'Revenge - homered off him earlier' },
  revengeHRTeammate: { baseChance: 0.10, tensionAdd: 25, label: 'Frustration - previous batter homered' },
  frustration: { baseChance: 0.08, tensionAdd: 20, label: 'Frustration - rough inning' },
  retaliation: { baseChance: 0.25, tensionAdd: 50, label: 'Retaliation - payback for hitting their guy' },
  celebration: { baseChance: 0.12, tensionAdd: 30, label: 'Revenge - excessive celebration' },
  random: { baseChance: 0.02, tensionAdd: 5, label: 'Got away from him' },
};

// ── Check if pitcher should intentionally hit batter ──
export function shouldThrowAtBatter(state, pitcher, batter) {
  const ctx = getBeanballContext(state);
  
  // Don't bean in close games with 2 outs unless tension is sky-high
  if (state.outs >= 2 && ctx.tension < 60) return null;
  
  // After warnings, any HBP = ejection - much lower chance
  const warningMult = ctx.warningIssued ? 0.15 : 1.0;
  
  // Check each reason
  const reasons = [];

  // 1. Revenge: this batter homered off this pitcher earlier
  if (ctx.lastHRBatter === batter.name && ctx.lastHRPitcher === pitcher.name && Math.random() < 0.12) {
    reasons.push(HBP_REASONS.revengeHR);
  }

  // 2. Teammate homered: previous batter hit a HR, pitcher is fuming
  if (ctx.lastHRPitcher === pitcher.name && ctx.lastHRBatter && ctx.lastHRBatter !== batter.name && Math.random() < 0.08) {
    reasons.push(HBP_REASONS.revengeHRTeammate);
  }

  // 3. Frustration: pitcher just gave up 3+ hits in a row or lost the lead (rare)
  if (isPitcherFrustrated(state, pitcher) && Math.random() < 0.06) {
    reasons.push(HBP_REASONS.frustration);
  }

  // 4. Retaliation: opposing pitcher hit one of ours earlier this game
  const battingSide = state.halfInning === 'top' ? 'away' : 'home';
  const pitchingSide = battingSide === 'top' ? 'home' : 'away';
  if (ctx.lastHBPTeam && ctx.lastHBPTeam !== pitchingSide && ctx.lastHBPInning < state.inning && Math.random() < 0.10) {
    reasons.push(HBP_REASONS.retaliation);
  }

  // 5. Celebration revenge: batter recently did a bat flip (very rare)
  const recentFlip = ctx.batFlips.find(f => f.batter === batter.name);
  if (recentFlip && Math.random() < 0.08) {
    reasons.push(HBP_REASONS.celebration);
  }

  // 6. Random (always possible but very low)
  reasons.push(HBP_REASONS.random);

  // Roll each reason - first one that hits triggers
  for (const reason of reasons) {
    const adjustedChance = reason.baseChance * warningMult * (1 + ctx.tension / 100);
    if (Math.random() < Math.min(adjustedChance, 0.18)) {
      return reason;
    }
  }

  return null;
}

function isPitcherFrustrated(state, pitcher) {
  // Check if pitcher gave up lead or multiple hits recently
  const recentLog = state.log.slice(-6);
  let hitsAllowed = 0;
  let lostLead = false;
  
  for (const entry of recentLog) {
    if (['single', 'double', 'triple', 'homerun'].includes(entry.type)) hitsAllowed++;
    if (entry.type === 'homerun') lostLead = true;
  }
  
  return hitsAllowed >= 3 || lostLead;
}

// ── Retaliation check: pitcher from team that was hit before ──
export function shouldRetaliate(state, pitcher) {
  const ctx = getBeanballContext(state);
  if (!ctx.lastHBPTeam) return false;
  if (ctx.warningIssued) return Math.random() < 0.05; // 5% after warnings
  const pitchingSide = state.halfInning === 'top' ? 'home' : 'away';
  return ctx.lastHBPTeam !== pitchingSide && ctx.retaliations < 2 && Math.random() < 0.15;
}

// ── Register events ──
export function registerHBP(state, pitcher, batter, reason) {
  const ctx = getBeanballContext(state);
  const pitchingSide = state.halfInning === 'top' ? 'home' : 'away';
  ctx.lastHBPTeam = pitchingSide;
  ctx.lastHBPBatter = batter.name;
  ctx.lastHBPPitcher = pitcher.name;
  ctx.lastHBPInning = state.inning;
  ctx.beanballHits++;
  if (reason && reason !== HBP_REASONS.random) {
    ctx.retaliations++;
  }
  addTension(state, reason ? reason.tensionAdd : 10, 'HBP');
}

export function registerHomeRun(state, batter, pitcher) {
  const ctx = getBeanballContext(state);
  ctx.lastHRBatter = batter.name;
  ctx.lastHRPitcher = pitcher.name;
  
  // Check for bat flip
  if (shouldBatFlip(batter)) {
    ctx.batFlips.push({ batter: batter.name, inning: state.inning });
    addTension(state, 15, `Bat flip by ${batter.name.split(' ').pop()}`);
    return true; // did bat flip
  }
  return false;
}

export function registerBigStrikeout(state, pitcher, batter) {
  const ctx = getBeanballContext(state);
  // 2-strike count with runners on = big moment
  const bigMoment = state.strikes >= 2 && state.bases.some(b => b !== null);
  if (bigMoment && shouldFistPump(pitcher, true)) {
    ctx.fistPumps.push({ pitcher: pitcher.name, inning: state.inning });
    addTension(state, 10, `Fist pump by ${pitcher.name.split(' ').pop()}`);
    return true;
  }
  return false;
}

// ── Umpire Warnings ──
export function checkForWarning(state) {
  const ctx = getBeanballContext(state);
  if (ctx.warningIssued) return false;
  
  // Issue warnings when tension crosses thresholds or after retaliatory HBP
  const shouldWarn = ctx.tension >= 50 || (ctx.retaliations >= 1 && ctx.tension >= 30);
  
  if (shouldWarn && ctx.beanballHits >= 1) {
    ctx.warningIssued = true;
    ctx.warningInning = state.inning;
    return true;
  }
  return false;
}

// ── Collision System ──
export function checkHomePlateCollision(state, runner, catcher) {
  const ctx = getBeanballContext(state);
  // Only check when runner scores and play was close
  const runnerSpeed = runner.speed || 5;
  const catcherArm = catcher.arm || 5;
  const collisionChance = 0.03 + (runnerSpeed / 10) * 0.08;
  
  if (Math.random() < collisionChance) {
    ctx.collisions++;
    addTension(state, 35, `Collision at home - ${runner.name.split(' ').pop()} and ${catcher.name.split(' ').pop()}`);
    return {
      type: 'homePlate',
      runner: runner.name,
      catcher: catcher.name,
      runnerInjured: Math.random() < 0.15,
      catcherInjured: Math.random() < 0.12,
      benchesClear: ctx.tension >= 60 && Math.random() < 0.30,
    };
  }
  return null;
}

export function checkHardSlide(state, runner, fielder) {
  const ctx = getBeanballContext(state);
  const runnerSpeed = runner.speed || 5;
  const slideChance = 0.02 + (runnerSpeed / 10) * 0.05;
  
  if (Math.random() < slideChance) {
    ctx.hardSlides++;
    addTension(state, 20, `Hard slide by ${runner.name.split(' ').pop()} into ${fielder.name.split(' ').pop()}`);
    return {
      type: 'hardSlide',
      runner: runner.name,
      fielder: fielder.name,
      fielderInjured: Math.random() < 0.08,
      benchesClear: ctx.tension >= 70 && Math.random() < 0.20,
    };
  }
  return null;
}

// ── Bench-Clearing Brawl ──
export function checkForBrawl(state) {
  const ctx = getBeanballContext(state);
  if (ctx.brawlTriggered) return null;
  
  // Brawls happen at very high tension after a trigger event
  const brawlChance = (ctx.tension - 70) / 100 * 0.15; // 0% at 70, 4.5% at 100
  if (ctx.tension >= 70 && Math.random() < Math.max(0, brawlChance)) {
    ctx.brawlTriggered = true;
    return {
      tension: ctx.tension,
      inning: state.inning,
      ejections: Math.floor(Math.random() * 2) + 1, // 1-2 ejections
    };
  }
  return null;
}

// ── Tension decay at half-inning transitions ──
export function decayTension(state) {
  const ctx = state._beanball;
  if (!ctx) return;
  ctx.tension = Math.max(0, ctx.tension - 5);
}