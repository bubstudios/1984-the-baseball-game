import { TEAMS } from './gameData';

// Create initial game state
export function createGameState(userTeam = 'home') {
  const homeLineup = TEAMS.home.players.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0 } }));
  const awayLineup = TEAMS.away.players.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0 } }));

  return {
    userTeam,
    inning: 1,
    halfInning: 'top', // top = away batting, bottom = home batting
    outs: 0,
    balls: 0,
    strikes: 0,
    bases: [null, null, null], // 1st, 2nd, 3rd
    score: { home: 0, away: 0 },
    innings: Array(9).fill(null).map(() => ({ home: null, away: null })),
    homeLineup,
    awayLineup,
    homePitcher: { ...TEAMS.home.pitchers[0], pitchCount: 0, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } },
    awayPitcher: { ...TEAMS.away.pitchers[0], pitchCount: 0, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } },
    homeBatterIndex: 0,
    awayBatterIndex: 0,
    log: [],
    gameOver: false,
    waitingForInput: true,
    lastPlay: null,
    pitchResult: null,
  };
}

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

function advanceRunnersFixed(state, bases, batter) {
  let runnersScored = 0;
  const pitcher = getCurrentPitcher(state);

  if (bases === 4) {
    for (let i = 2; i >= 0; i--) {
      if (state.bases[i]) {
        state.bases[i].gameStats.runs++;
        scoreRun(state);
        runnersScored++;
        state.bases[i] = null;
      }
    }
    batter.gameStats.runs++;
    batter.gameStats.rbi += runnersScored + 1;
    scoreRun(state);
    pitcher.gameStats.r += runnersScored + 1;
    pitcher.gameStats.er += runnersScored + 1;
    return runnersScored + 1;
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
        if (state.bases[newBase] && newBase < 2) {
          // force advance
          const pushedBase = newBase + 1;
          if (pushedBase >= 3) {
            state.bases[newBase].gameStats.runs++;
            scoreRun(state);
            rbi++;
          } else {
            state.bases[pushedBase] = state.bases[newBase];
          }
        }
        state.bases[newBase] = state.bases[i];
        if (i !== newBase) state.bases[i] = null;
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
    // Check walk-off situation: bottom of 9+ and home is ahead
    if (state.inning >= 9 && state.score.home > state.score.away) {
      state.gameOver = true;
      state.waitingForInput = false;
      state.log.push({ type: 'info', text: `Game Over! ${TEAMS.home.name} win ${state.score.home}-${state.score.away}!` });
      return;
    }
  } else {
    // End of full inning
    if (state.inning >= 9 && state.score.home !== state.score.away) {
      state.gameOver = true;
      state.waitingForInput = false;
      const winner = state.score.home > state.score.away ? TEAMS.home.name : TEAMS.away.name;
      const winScore = Math.max(state.score.home, state.score.away);
      const loseScore = Math.min(state.score.home, state.score.away);
      state.log.push({ type: 'info', text: `Game Over! ${winner} win ${winScore}-${loseScore}!` });
      return;
    }
    state.halfInning = 'top';
    state.inning++;
    // Add extra innings
    if (state.inning > state.innings.length) {
      state.innings.push({ home: null, away: null });
    }
  }

  const battingTeam = state.halfInning === 'top' ? TEAMS.away.name : TEAMS.home.name;
  state.log.push({ type: 'info', text: `${state.halfInning === 'top' ? 'Top' : 'Bottom'} of inning ${state.inning} — ${battingTeam} batting` });
}

// Determine pitch outcome
function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  pitcher.gameStats.pitches++;
  pitcher.pitchCount++;

  const controlFactor = pitcher.control / 100;
  const isStrike = Math.random() < (0.45 + controlFactor * 0.2);

  return {
    pitchType: pitchType.name,
    isStrike,
    location: isStrike
      ? ['inside corner', 'outside corner', 'down the middle', 'high strike', 'low strike'][Math.floor(Math.random() * 5)]
      : ['high', 'low', 'inside', 'outside', 'way outside', 'in the dirt'][Math.floor(Math.random() * 6)],
  };
}

// Determine swing outcome
function resolveSwing(state, swingType, pitch) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);

  // Taking the pitch
  if (swingType.name === 'Take') {
    if (pitch.isStrike) {
      state.strikes++;
      if (state.strikes >= 3) {
        batter.gameStats.ab++;
        batter.gameStats.so++;
        pitcher.gameStats.so++;
        pitcher.gameStats.h += 0; // no hit
        const msg = `${batter.name} called out on strikes!`;
        state.log.push({ type: 'strikeout', text: msg });
        state.lastPlay = { type: 'strikeout', text: msg };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
      const msg = `Strike ${state.strikes} — ${batter.name} takes a ${pitch.location} ${pitch.pitchType}`;
      state.log.push({ type: 'strike', text: msg });
      state.lastPlay = { type: 'strike', text: msg };
      return;
    } else {
      state.balls++;
      if (state.balls >= 4) {
        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        // Walk — advance runners if forced
        const msg = `${batter.name} draws a walk!`;
        state.log.push({ type: 'walk', text: msg });
        state.lastPlay = { type: 'walk', text: msg };
        handleWalk(state, batter);
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        return;
      }
      const msg = `Ball ${state.balls} — ${pitch.pitchType} ${pitch.location}`;
      state.log.push({ type: 'ball', text: msg });
      state.lastPlay = { type: 'ball', text: msg };
      return;
    }
  }

  // Bunt attempt
  if (swingType.name === 'Bunt') {
    if (!pitch.isStrike && Math.random() < 0.6) {
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
      const msg = `Ball ${state.balls} — ${batter.name} pulls back the bunt`;
      state.log.push({ type: 'ball', text: msg });
      state.lastPlay = { type: 'ball', text: msg };
      return;
    }

    const buntSuccess = Math.random() < (0.45 + batter.speed / 300);
    if (buntSuccess) {
      batter.gameStats.ab++;
      batter.gameStats.hits++;
      pitcher.gameStats.h++;
      // Advance runners 1 base
      const rbi = advanceRunnersFixed(state, 1, batter);
      const msg = `${batter.name} lays down a sacrifice bunt!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
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
      const msg = `${batter.name} fouls off the bunt attempt — Strike ${state.strikes}`;
      state.log.push({ type: 'foul', text: msg });
      state.lastPlay = { type: 'foul', text: msg };
      return;
    }
  }

  // Swing or Power or Contact
  const isPower = swingType.name === 'Power';
  const isContact = swingType.name === 'Contact';

  // Chance to make contact
  let contactChance = (batter.avg * 2.5);
  if (isPower) contactChance *= 0.72;
  if (isContact) contactChance *= 1.25;
  if (!pitch.isStrike) contactChance *= 0.55;

  // Pitcher stuff reduces contact
  contactChance *= (1 - pitcher.stuff / 350);

  const madeContact = Math.random() < contactChance;

  if (!madeContact) {
    if (!pitch.isStrike) {
      // Swung and missed at a ball
      state.strikes++;
      if (state.strikes >= 3) {
        batter.gameStats.ab++;
        batter.gameStats.so++;
        pitcher.gameStats.so++;
        const msg = `${batter.name} swings and misses — Struck out!`;
        state.log.push({ type: 'strikeout', text: msg });
        state.lastPlay = { type: 'strikeout', text: msg };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
      const msg = `${batter.name} swings and misses — Strike ${state.strikes}`;
      state.log.push({ type: 'strike', text: msg });
      state.lastPlay = { type: 'strike', text: msg };
      return;
    }
    state.strikes++;
    if (state.strikes >= 3) {
      batter.gameStats.ab++;
      batter.gameStats.so++;
      pitcher.gameStats.so++;
      const msg = `${batter.name} goes down swinging!`;
      state.log.push({ type: 'strikeout', text: msg });
      state.lastPlay = { type: 'strikeout', text: msg };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }
    const msg = `Swing and a miss! Strike ${state.strikes}`;
    state.log.push({ type: 'strike', text: msg });
    state.lastPlay = { type: 'strike', text: msg };
    return;
  }

  // Made contact — determine result
  batter.gameStats.ab++;

  // Foul ball check
  if (Math.random() < 0.28) {
    if (state.strikes < 2) {
      state.strikes++;
    }
    const msg = `${batter.name} fouls it off — ${state.balls}-${state.strikes} count`;
    state.log.push({ type: 'foul', text: msg });
    state.lastPlay = { type: 'foul', text: msg };
    batter.gameStats.ab--; // fouls don't count as AB
    return;
  }

  // Ball in play
  let hitChance = batter.avg;
  if (isPower) hitChance *= 0.85;
  if (isContact) hitChance *= 1.12;

  const rand = Math.random();

  if (rand < hitChance * 0.95) {
    // It's a hit!
    pitcher.gameStats.h++;
    batter.gameStats.hits++;

    // Determine hit type
    let powerFactor = batter.power / 100;
    if (isPower) powerFactor *= 1.5;
    if (isContact) powerFactor *= 0.6;

    const hitRoll = Math.random();

    if (hitRoll < powerFactor * 0.08) {
      // HOME RUN
      batter.gameStats.hr++;
      const runnersOn = state.bases.filter(b => b !== null).length;
      const rbi = advanceRunnersFixed(state, 4, batter);
      const grandSlam = runnersOn === 3;
      const msg = grandSlam
        ? `💥 GRAND SLAM! ${batter.name} clears the bases! ${rbi} RBIs!`
        : rbi > 1
        ? `💥 ${batter.name} hits a ${rbi}-run HOME RUN!`
        : `💥 ${batter.name} hits a solo HOME RUN!`;
      state.log.push({ type: 'homerun', text: msg });
      state.lastPlay = { type: 'homerun', text: msg };
    } else if (hitRoll < powerFactor * 0.15) {
      // Triple
      const rbi = advanceRunnersFixed(state, 3, batter);
      const msg = `${batter.name} rips a triple to the gap!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: msg });
      state.lastPlay = { type: 'triple', text: msg };
    } else if (hitRoll < powerFactor * 0.35) {
      // Double
      const rbi = advanceRunnersFixed(state, 2, batter);
      const msg = `${batter.name} doubles off the wall!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      // Single
      const rbi = advanceRunnersFixed(state, 1, batter);
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
    // Out
    const outTypes = [
      { text: `${batter.name} grounds out to short`, type: 'groundout' },
      { text: `${batter.name} flies out to center`, type: 'flyout' },
      { text: `${batter.name} pops up to second`, type: 'flyout' },
      { text: `${batter.name} lines out to third`, type: 'lineout' },
      { text: `${batter.name} grounds out to the pitcher`, type: 'groundout' },
      { text: `${batter.name} flies out to right`, type: 'flyout' },
      { text: `${batter.name} flies out to left`, type: 'flyout' },
    ];

    // Double play chance
    if (state.outs < 2 && state.bases[0] && Math.random() < 0.18) {
      const dpRunner = state.bases[0];
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
      batter.gameStats.ab--; // sac fly doesn't count as AB
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }

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
  // Force runners forward if needed
  if (state.bases[0]) {
    if (state.bases[1]) {
      if (state.bases[2]) {
        // Bases loaded walk
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
  const newState = JSON.parse(JSON.stringify(state));

  // Restore object references for bases
  const homeLineup = newState.homeLineup;
  const awayLineup = newState.awayLineup;

  // Resolve the pitch
  const pitch = resolvePitch(newState, pitchType);
  newState.pitchResult = pitch;

  // Resolve the swing
  resolveSwing(newState, swingType, pitch);

  // Check walk-off
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
    newState.gameOver = true;
    newState.waitingForInput = false;
    newState.log.push({ type: 'info', text: `🎉 Walk-off! ${TEAMS.home.name} win ${newState.score.home}-${newState.score.away}!` });
  }

  return newState;
}

// CPU picks a pitch
export function cpuSelectPitch(state) {
  const pitcher = getCurrentPitcher(state);
  const rand = Math.random();
  // Weight toward fastball but vary
  if (rand < 0.38) return 0; // fastball
  if (rand < 0.58) return 2; // slider
  if (rand < 0.78) return 1; // curveball
  return 3; // changeup
}

// CPU picks a swing
export function cpuSelectSwing(state) {
  const batter = getCurrentBatter(state);
  const rand = Math.random();

  // Smart AI — considers count
  if (state.strikes === 2) {
    // Protect the plate
    if (rand < 0.7) return 1; // Contact
    return 0; // Swing
  }
  if (state.balls === 3) {
    if (rand < 0.5) return 3; // Take
    return 1; // Contact
  }
  if (state.balls >= 2 && state.strikes === 0) {
    if (rand < 0.4) return 3; // Take
  }

  // Mix based on power
  if (batter.power > 80 && rand < 0.3) return 2; // Power
  if (rand < 0.5) return 0; // Swing
  if (rand < 0.75) return 1; // Contact
  return 0;
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };