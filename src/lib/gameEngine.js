import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS } from './gameData';

// Create initial game state with two selected teams
export function createGameState(homeTeam, awayTeam) {
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  const homeLineup = home.lineup.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0 } }));
  const awayLineup = away.lineup.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0 } }));

  return {
    homeTeam,
    awayTeam,
    inning: 1,
    halfInning: 'top',
    outs: 0,
    balls: 0,
    strikes: 0,
    bases: [null, null, null],
    score: { home: 0, away: 0 },
    innings: Array(9).fill(null).map(() => ({ home: null, away: null })),
    homeLineup,
    awayLineup,
    homeRotation: [...home.rotation],
    awayRotation: [...away.rotation],
    homeBullpen: [...home.bullpen],
    awayBullpen: [...away.bullpen],
    homePitcher: createPitcherState(home.rotation[0]),
    awayPitcher: createPitcherState(away.rotation[0]),
    homeBatterIndex: 0,
    awayBatterIndex: 0,
    log: [],
    gameOver: false,
    waitingForInput: true,
    lastPlay: null,
    pitchResult: null,
  };
}

function createPitcherState(p) {
  return { ...p, pitchCount: 0, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
}

export { TEAM_IDS };

function getCurrentBatter(state) {
  if (state.halfInning === 'top') {
    return state.awayLineup[state.awayBatterIndex % state.awayLineup.length];
  }
  return state.homeLineup[state.homeBatterIndex % state.homeLineup.length];
}

function getCurrentPitcher(state) {
  return state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
}

function getBattingTeam(state) {
  return state.halfInning === 'top' ? 'away' : 'home';
}

function advanceBatter(state) {
  if (state.halfInning === 'top') {
    state.awayBatterIndex = (state.awayBatterIndex + 1) % state.awayLineup.length;
  } else {
    state.homeBatterIndex = (state.homeBatterIndex + 1) % state.homeLineup.length;
  }
}

function scoreRun(state) {
  const team = getBattingTeam(state);
  state.score[team]++;
  if (state.innings[state.inning - 1]) {
    const half = state.halfInning === 'top' ? 'away' : 'home';
    if (state.innings[state.inning - 1][half] === null) state.innings[state.inning - 1][half] = 0;
    state.innings[state.inning - 1][half]++;
  }
}

function advanceRunners(state, bases, batter) {
  let runsScored = 0;
  const pitcher = getCurrentPitcher(state);

  if (bases === 4) {
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) {
        state.bases[i].gameStats.runs++;
        scoreRun(state);
        runsScored++;
        state.bases[i] = null;
      }
    }
    batter.gameStats.runs++;
    batter.gameStats.rbi += runsScored + 1;
    scoreRun(state);
    pitcher.gameStats.r += runsScored + 1;
    pitcher.gameStats.er += runsScored + 1;
    return runsScored + 1;
  }

  let rbi = 0;
  for (let i = 2; i >= 0; i--) {
    if (state.bases[i]) {
      const newBase = i + bases;
      if (newBase >= 3) {
        state.bases[i].gameStats.runs++;
        scoreRun(state);
        rbi++;
        state.bases[i] = null;
      } else {
        state.bases[newBase] = state.bases[i];
        state.bases[i] = null;
      }
    }
  }

  if (bases <= 3) {
    state.bases[bases - 1] = batter;
  }

  batter.gameStats.rbi += rbi;
  pitcher.gameStats.r += rbi;
  pitcher.gameStats.er += rbi;
  return rbi;
}

function recordOut(state) {
  state.outs++;
  const pitcher = getCurrentPitcher(state);
  pitcher.gameStats.ip += 1/3;

  if (state.outs >= 3) {
    endHalfInning(state);
  }
}

function endHalfInning(state) {
  const home = TEAMS[state.homeTeam];
  const away = TEAMS[state.awayTeam];
  const half = state.halfInning === 'top' ? 'away' : 'home';
  if (state.innings[state.inning - 1][half] === null) {
    state.innings[state.inning - 1][half] = 0;
  }

  state.outs = 0;
  state.balls = 0;
  state.strikes = 0;
  state.bases = [null, null, null];

  if (state.halfInning === 'top') {
    state.halfInning = 'bottom';
    if (state.inning >= 9 && state.score.home > state.score.away) {
      state.gameOver = true;
      state.waitingForInput = false;
      state.log.push({ type: 'info', text: `Game Over! ${home.name} win ${state.score.home}-${state.score.away}!` });
      return;
    }
  } else {
    if (state.inning >= 9 && state.score.home !== state.score.away) {
      state.gameOver = true;
      state.waitingForInput = false;
      const winner = state.score.home > state.score.away ? home.name : away.name;
      const winScore = Math.max(state.score.home, state.score.away);
      const loseScore = Math.min(state.score.home, state.score.away);
      state.log.push({ type: 'info', text: `Game Over! ${winner} win ${winScore}-${loseScore}!` });
      return;
    }
    state.halfInning = 'top';
    state.inning++;
    if (state.inning > state.innings.length) {
      state.innings.push({ home: null, away: null });
    }
  }

  const battingTeam = state.halfInning === 'top' ? away.name : home.name;
  state.log.push({ type: 'info', text: `${state.halfInning === 'top' ? 'Top' : 'Bottom'} of inning ${state.inning} — ${battingTeam} batting` });
}

// Resolve pitch outcome using new pitcher ratings (1-10 scale)
function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  pitcher.gameStats.pitches++;

  // Control rating (1-10) determines strike zone accuracy
  const controlFactor = pitcher.control / 10;
  const baseStrikeChance = 0.35 + controlFactor * 0.28;

  // Pitch type affects accuracy
  const controlBonus = pitchType.controlBonus || 0;
  const strikeChance = baseStrikeChance + (controlBonus * 0.04);

  const isStrike = Math.random() < Math.min(strikeChance, 0.82);

  return {
    pitchType: pitchType.name,
    isStrike,
    location: isStrike
      ? ['inside corner', 'outside corner', 'down the middle', 'high strike', 'low strike'][Math.floor(Math.random() * 5)]
      : ['high', 'low', 'inside', 'outside', 'way outside', 'in the dirt'][Math.floor(Math.random() * 6)],
  };
}

// Resolve swing outcome using new batter ratings (1-10 scale)
function resolveSwing(state, swingType, pitch) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  const home = TEAMS[state.homeTeam];
  const away = TEAMS[state.awayTeam];

  // Take pitch
  if (swingType.name === 'Take Pitch') {
    if (pitch.isStrike) {
      state.strikes++;
      if (state.strikes >= 3) {
        batter.gameStats.ab++;
        batter.gameStats.so++;
        pitcher.gameStats.so++;
        const msg = `${batter.name} called out on strikes!`;
        state.log.push({ type: 'strikeout', text: msg });
        state.lastPlay = { type: 'strikeout', text: msg };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
      state.log.push({ type: 'strike', text: `Strike ${state.strikes} — ${batter.name} takes a ${pitch.location} ${pitch.pitchType}` });
      state.lastPlay = { type: 'strike', text: `Strike ${state.strikes} — ${batter.name} takes it` };
      return;
    } else {
      state.balls++;
      if (state.balls >= 4) {
        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        const msg = `${batter.name} draws a walk!`;
        state.log.push({ type: 'walk', text: msg });
        state.lastPlay = { type: 'walk', text: msg };
        handleWalk(state, batter);
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        return;
      }
      state.log.push({ type: 'ball', text: `Ball ${state.balls} — ${pitch.pitchType} ${pitch.location}` });
      state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` };
      return;
    }
  }

  // Bunt
  if (swingType.name === 'Bunt') {
    if (!pitch.isStrike && Math.random() < 0.55) {
      state.balls++;
      if (state.balls >= 4) {
        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        const msg = `${batter.name} draws a walk!`;
        state.log.push({ type: 'walk', text: msg });
        state.lastPlay = { type: 'walk', text: msg };
        handleWalk(state, batter);
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        return;
      }
      state.log.push({ type: 'ball', text: `Ball ${state.balls} — ${batter.name} pulls back the bunt` });
      state.lastPlay = { type: 'ball', text: `Ball ${state.balls}` };
      return;
    }

    // Bunt success based on bunting skill (1-10) and speed
    const buntSkill = batter.bunting / 10;
    const speedFactor = batter.speed / 10;
    const buntSuccess = Math.random() < (0.3 + buntSkill * 0.30 + speedFactor * 0.10);

    if (buntSuccess) {
      batter.gameStats.ab++;
      batter.gameStats.hits++;
      pitcher.gameStats.h++;
      const rbi = advanceRunners(state, 1, batter);
      const msg = `${batter.name} lays down a bunt single!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'single', text: msg });
      state.lastPlay = { type: 'single', text: msg };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      return;
    } else {
      state.strikes++;
      if (state.strikes >= 3) {
        batter.gameStats.ab++;
        batter.gameStats.so++;
        pitcher.gameStats.so++;
        const msg = `${batter.name} bunts foul for strike three!`;
        state.log.push({ type: 'strikeout', text: msg });
        state.lastPlay = { type: 'strikeout', text: msg };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
      state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt — Strike ${state.strikes}` });
      state.lastPlay = { type: 'foul', text: `Foul bunt — Strike ${state.strikes}` };
      return;
    }
  }

  // Swing (Normal, Contact, or Power)
  const isPower = swingType.name === 'Power Swing';
  const isContact = swingType.name === 'Contact Swing';

  // Contact chance: based on contact rating (1-10)
  const contactRating = batter.contact / 10;
  let contactChance = 0.25 + contactRating * 0.35;

  if (isPower) contactChance -= 0.10;
  if (isContact) contactChance += 0.12;
  if (!pitch.isStrike) contactChance -= 0.20;

  // Pitcher's off-speed and pitch speed affect contact
  const pitcherDifficulty = (pitcher.offSpeed / 10) * 0.07 + (pitcher.pitchSpeed / 10) * 0.05;
  contactChance -= pitcherDifficulty;
  contactChance = Math.max(0.05, Math.min(contactChance, 0.85));

  const madeContact = Math.random() < contactChance;

  if (!madeContact) {
    state.strikes++;
    if (state.strikes >= 3) {
      batter.gameStats.ab++;
      batter.gameStats.so++;
      pitcher.gameStats.so++;
      const msg = pitch.isStrike
        ? `${batter.name} goes down swinging!`
        : `${batter.name} swings and misses — Struck out!`;
      state.log.push({ type: 'strikeout', text: msg });
      state.lastPlay = { type: 'strikeout', text: msg };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }
    state.log.push({ type: 'strike', text: `Swing and a miss! Strike ${state.strikes}` });
    state.lastPlay = { type: 'strike', text: `Swinging strike ${state.strikes}` };
    return;
  }

  // Made contact
  batter.gameStats.ab++;

  // Foul ball
  if (Math.random() < 0.25) {
    if (state.strikes < 2) state.strikes++;
    state.log.push({ type: 'foul', text: `${batter.name} fouls it off — ${state.balls}-${state.strikes}` });
    state.lastPlay = { type: 'foul', text: `Foul ball` };
    batter.gameStats.ab--;
    return;
  }

  // Ball in play — determine hit vs out
  const powerRating = batter.power / 10;
  let hitChance = 0.20 + contactRating * 0.28;
  if (isPower) hitChance -= 0.04;
  if (isContact) hitChance += 0.08;

  // Pitcher control reduces hard contact
  hitChance -= (pitcher.control / 10) * 0.03;
  hitChance = Math.max(0.08, Math.min(hitChance, 0.65));

  const rand = Math.random();

  if (rand < hitChance) {
    // HIT!
    pitcher.gameStats.h++;
    batter.gameStats.hits++;

    let powerMod = isPower ? 1.6 : (isContact ? 0.5 : 1.0);
    const effectivePower = powerRating * powerMod;
    const hitRoll = Math.random();

    if (hitRoll < effectivePower * 0.065) {
      // HOME RUN
      batter.gameStats.hr++;
      const runnersOn = state.bases.filter(b => b !== null).length;
      const rbi = advanceRunners(state, 4, batter);
      const grandSlam = runnersOn === 3;
      const msg = grandSlam
        ? `💥 GRAND SLAM! ${batter.name} clears the bases!`
        : rbi > 1
        ? `💥 ${batter.name} hits a ${rbi}-run HOME RUN!`
        : `💥 ${batter.name} hits a solo HOME RUN!`;
      state.log.push({ type: 'homerun', text: msg });
      state.lastPlay = { type: 'homerun', text: msg };
    } else if (hitRoll < effectivePower * 0.15) {
      const rbi = advanceRunners(state, 3, batter);
      const msg = `${batter.name} rips a triple!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: msg });
      state.lastPlay = { type: 'triple', text: msg };
    } else if (hitRoll < effectivePower * 0.32) {
      const rbi = advanceRunners(state, 2, batter);
      const msg = `${batter.name} doubles off the wall!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      const rbi = advanceRunners(state, 1, batter);
      const singles = [
        `${batter.name} lines a single to left!`,
        `${batter.name} grounds a single through the hole!`,
        `${batter.name} bloops a single into shallow right!`,
        `${batter.name} singles sharply up the middle!`,
      ];
      const msg = singles[Math.floor(Math.random() * singles.length)] + (rbi > 0 ? ` ${rbi} RBI!` : '');
      state.log.push({ type: 'single', text: msg });
      state.lastPlay = { type: 'single', text: msg };
    }
    state.balls = 0;
    state.strikes = 0;
    advanceBatter(state);
  } else {
    // OUT
    // Double play chance
    if (state.outs < 2 && state.bases[0] && Math.random() < 0.18) {
      state.bases[0] = null;
      const msg = `${batter.name} grounds into a double play!`;
      state.log.push({ type: 'doubleplay', text: msg });
      state.lastPlay = { type: 'doubleplay', text: msg };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      if (!state.gameOver && state.outs < 3) recordOut(state);
      return;
    }

    // Sacrifice fly
    if (state.bases[2] && state.outs < 2 && Math.random() < 0.35) {
      const runner = state.bases[2];
      runner.gameStats.runs++;
      scoreRun(state);
      state.bases[2] = null;
      batter.gameStats.rbi++;
      getCurrentPitcher(state).gameStats.r++;
      getCurrentPitcher(state).gameStats.er++;
      const msg = `${batter.name} hits a sacrifice fly — runner scores from third!`;
      state.log.push({ type: 'sacfly', text: msg });
      state.lastPlay = { type: 'sacfly', text: msg };
      batter.gameStats.ab--;
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }

    const outTypes = [
      { text: `${batter.name} grounds out to short`, type: 'groundout' },
      { text: `${batter.name} flies out to center`, type: 'flyout' },
      { text: `${batter.name} pops up to second`, type: 'flyout' },
      { text: `${batter.name} lines out to third`, type: 'lineout' },
      { text: `${batter.name} grounds out to the pitcher`, type: 'groundout' },
      { text: `${batter.name} flies out to right`, type: 'flyout' },
      { text: `${batter.name} grounds out to first`, type: 'groundout' },
    ];
    const out = outTypes[Math.floor(Math.random() * outTypes.length)];
    state.log.push({ type: out.type, text: out.text });
    state.lastPlay = { type: out.type, text: out.text };
    state.balls = 0;
    state.strikes = 0;
    advanceBatter(state);
    recordOut(state);
  }
}

function handleWalk(state, batter) {
  if (state.bases[0]) {
    if (state.bases[1]) {
      if (state.bases[2]) {
        state.bases[2].gameStats.runs++;
        scoreRun(state);
        batter.gameStats.rbi++;
        getCurrentPitcher(state).gameStats.r++;
        getCurrentPitcher(state).gameStats.er++;
      }
      state.bases[2] = state.bases[1];
    }
    state.bases[1] = state.bases[0];
  }
  state.bases[0] = batter;
}

// Main game step
export function processAtBat(state, pitchType, swingType) {
  const home = TEAMS[state.homeTeam];
  const away = TEAMS[state.awayTeam];
  const newState = JSON.parse(JSON.stringify(state));

  newState.pitchResult = resolvePitch(newState, pitchType);
  resolveSwing(newState, swingType, newState.pitchResult);

  // Walk-off check
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
    newState.gameOver = true;
    newState.waitingForInput = false;
    newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
  }

  return newState;
}

// CPU pitch selection based on pitcher strengths
export function cpuSelectPitch(state) {
  const pitcher = getCurrentPitcher(state);
  const rand = Math.random();

  // Favor pitch types that match pitcher's strengths
  if (pitcher.pitchSpeed >= 8 && rand < 0.40) return 0; // Fastball
  if (pitcher.offSpeed >= 8 && rand < 0.55) return 1; // Curveball
  if (rand < 0.70) return 2; // Slider
  if (rand < 0.88) return 3; // Changeup
  return 0; // Default fastball
}

// CPU swing selection based on batter strengths and count
export function cpuSelectSwing(state) {
  const batter = getCurrentBatter(state);
  const rand = Math.random();

  // Count-aware decisions
  if (state.strikes === 2) {
    return rand < 0.75 ? 1 : 0; // Contact or Normal
  }
  if (state.balls === 3) {
    return rand < 0.45 ? 3 : 1; // Take or Contact
  }
  if (state.balls >= 2 && state.strikes === 0) {
    if (rand < 0.35) return 3; // Take
  }

  // Based on batter type
  if (batter.power >= 8 && rand < 0.30) return 2; // Power swing
  if (batter.contact >= 8 && rand < 0.45) return 1; // Contact swing
  if (rand < 0.45) return 0; // Normal swing
  if (rand < 0.70) return 1; // Contact
  return 0;
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };