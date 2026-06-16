import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';

// Create initial game state with two selected teams
export function createGameState(homeTeam, awayTeam) {
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  const homeLineup = home.lineup.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } }));
  const awayLineup = away.lineup.map((p, i) => ({ ...p, order: i + 1, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } }));

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
    hitAndRun: false,
    pendingSteal: null,
  };
}

function createPitcherState(p) {
  return { ...p, pitchCount: 0, pitches: p.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
}

export { TEAM_IDS };

// Get the defensive team's position players and team data
function getDefensivePlayers(state) {
  const fieldingLineup = state.halfInning === 'top' ? state.homeLineup : state.awayLineup;
  const defenders = {};
  fieldingLineup.forEach(p => {
    if (p.defense > 0) defenders[p.pos] = p;
  });
  return defenders;
}

// Get best outfield arm among the defensive outfielders
function getOutfieldArm(defenders) {
  const of = ['LF', 'CF', 'RF'];
  let bestArm = 5;
  of.forEach(pos => {
    if (defenders[pos] && defenders[pos].arm > bestArm) bestArm = defenders[pos].arm;
  });
  return bestArm;
}

// Get middle infield defense + arm rating (for double plays)
function getMiddleInfieldRating(defenders) {
  const ss = defenders['SS'];
  const b2 = defenders['2B'];
  const ssDef = ss ? (ss.defense + ss.arm) / 2 : 5;
  const b2Def = b2 ? (b2.defense + b2.arm) / 2 : 5;
  return (ssDef + b2Def) / 2;
}

// Get catcher arm rating
function getCatcherArm(defenders) {
  return defenders['C'] ? defenders['C'].arm : 5;
}

// Error probability for a given fielder on a ground ball (~1 chance per 600 total chances)
function getErrorChance(playerName) {
  const errors = PLAYER_ERRORS[playerName] || 10;
  return Math.min(0.05, errors / 500);
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

function advanceRunners(state, bases, batter, isHit = false) {
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
  // Standard advancement
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

  // --- Speed-based extra base advancement on hits (with OF arm + positioning) ---
  if (isHit && bases <= 2) {
    const defenders = getDefensivePlayers(state);
    const ofArm = getOutfieldArm(defenders);
    const armPenalty = (ofArm / 10) * 0.18; // strong OF arm reduces extra-base success

    // Outfield positioning: deeper vs power hitters = harder to take extra bases
    const batterPower = batter.power / 10;
    const positioningPenalty = batterPower * 0.10; // power hitters → deeper OF → harder extra bases

    for (let i = 0; i < 3; i++) {
      const runner = state.bases[i];
      if (!runner) continue;
      const speedFactor = runner.speed / 10;

      if (i === 0) {
        // Runner on 1st: on a single, try for 3rd; on a double, try for home
        if (bases === 2) {
          const homeChance = 0.15 + speedFactor * 0.50 - armPenalty - positioningPenalty;
          if (Math.random() < Math.max(0.02, homeChance)) {
            runner.gameStats.runs++;
            scoreRun(state);
            rbi++;
            state.bases[0] = null;
            state.log.push({ type: 'info', text: `${runner.name} hustles all the way home from first!` });
          }
        } else if (bases === 1) {
          const thirdChance = 0.05 + speedFactor * 0.40 - armPenalty * 0.6 - positioningPenalty * 0.4;
          if (Math.random() < Math.max(0.02, thirdChance)) {
            state.bases[2] = runner;
            state.bases[0] = null;
            state.log.push({ type: 'info', text: `${runner.name} wheels to third on the single!` });
          }
        }
      } else if (i === 1) {
        // Runner on 2nd: on a single, try for home
        if (bases === 1) {
          const homeChance = 0.20 + speedFactor * 0.55 - armPenalty - positioningPenalty;
          if (Math.random() < Math.max(0.03, homeChance)) {
            runner.gameStats.runs++;
            scoreRun(state);
            rbi++;
            state.bases[1] = null;
            state.log.push({ type: 'info', text: `${runner.name} scores from second on the single!` });
          }
        }
      }
    }
  }

  batter.gameStats.rbi += rbi;
  return runsScored + rbi;
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
  state.hitAndRun = false;
  state.pendingSteal = null;

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

// --- STOLEN BASE ---
export function attemptSteal(state, baseIndex) {
  const runner = state.bases[baseIndex];
  if (!runner) return state;

  const newState = JSON.parse(JSON.stringify(state));
  const speedFactor = runner.speed / 10;
  const pitcher = getCurrentPitcher(newState);
  const defenders = getDefensivePlayers(newState);
  const catcherArm = getCatcherArm(defenders);

  // Success based on speed + catcher arm + pitcher control + pitch speed (faster delivery = harder to steal)
  const pitchSpeedFactor = (pitcher.pitchSpeed / 10) * 0.13;
  let successChance = 0.20 + speedFactor * 0.55 - (catcherArm / 10) * 0.12 - (pitcher.control / 10) * 0.03 - pitchSpeedFactor;
  successChance = Math.max(0.08, Math.min(successChance, 0.80));
  const success = Math.random() < successChance;

  if (success) {
    runner.gameStats.sb = (runner.gameStats.sb || 0) + 1;
    // Move runner to next base
    if (baseIndex + 1 >= 3) {
      // Stealing home
      runner.gameStats.runs++;
      scoreRun(newState);
      newState.bases[baseIndex] = null;
      newState.log.push({ type: 'info', text: `🏃 ${runner.name} steals home!` });
      newState.lastPlay = { type: 'steal', text: `${runner.name} steals home!` };
    } else {
      newState.bases[baseIndex + 1] = runner;
      newState.bases[baseIndex] = null;
      const baseName = ['second', 'third', 'home'][baseIndex];
      newState.log.push({ type: 'info', text: `🏃 ${runner.name} steals ${baseName}!` });
      newState.lastPlay = { type: 'steal', text: `${runner.name} steals ${baseName}!` };
    }
  } else {
    runner.gameStats.cs = (runner.gameStats.cs || 0) + 1;
    newState.bases[baseIndex] = null;
    recordOut(newState);
    const baseName = ['second', 'third', 'home'][Math.min(baseIndex + 1, 2)];
    newState.log.push({ type: 'info', text: `❌ ${runner.name} caught stealing ${baseName}!` });
    newState.lastPlay = { type: 'caughtstealing', text: `${runner.name} caught stealing!` };
  }

  newState.pendingSteal = null;
  return newState;
}

export function hasRunnersOnBase(state) {
  return state.bases.some(b => b !== null);
}

// --- HIT AND RUN ---
export function setHitAndRun(state, active) {
  const newState = JSON.parse(JSON.stringify(state));
  newState.hitAndRun = active;
  return newState;
}

// --- CPU DECISIONS ---

// CPU decides whether to attempt a steal
export function cpuDecideSteal(state) {
  const defenders = getDefensivePlayers(state);
  const catcherArm = getCatcherArm(defenders);
  const pitcher = getCurrentPitcher(state);
  const armFactor = (catcherArm / 10) * 0.30; // strong arm deters steals
  const pitchFactor = (pitcher.pitchSpeed / 10) * 0.12; // fast delivery deters steals

  for (let i = 0; i < 3; i++) {
    const runner = state.bases[i];
    if (!runner) continue;
    const speedFactor = runner.speed / 10;
    // CPU steals ~10-35% of opportunities based on speed, reduced by catcher arm + pitch speed
    if (Math.random() < Math.max(0.04, 0.10 + speedFactor * 0.30 - armFactor - pitchFactor)) {
      return i;
    }
  }
  return -1; // no steal
}

// Resolve pitch outcome using pitcher ratings (1-10 scale)
function resolvePitch(state, pitchType) {
  const pitcher = getCurrentPitcher(state);
  pitcher.gameStats.pitches++;

  const controlFactor = pitcher.control / 10;

  // Wild pitch — low control pitchers lose it, runners advance
  const wpChance = Math.max(0.008, (10 - pitcher.control) * 0.008);
  if (Math.random() < wpChance) {
    const hasRunners = state.bases.some(b => b !== null);
    if (hasRunners) {
      for (let i = 2; i >= 0; i--) {
        if (state.bases[i]) {
          if (i + 1 >= 3) {
            state.bases[i].gameStats.runs++;
            scoreRun(state);
            state.bases[i] = null;
          } else if (!state.bases[i + 1]) {
            state.bases[i + 1] = state.bases[i];
            state.bases[i] = null;
          }
        }
      }
      state.log.push({ type: 'error', text: `Wild pitch! Runners advance!` });
      state.lastPlay = { type: 'error', text: `Wild pitch!` };
    }
    state.balls++;
    return { pitchType: pitchType.name, isStrike: false, location: 'wild pitch', isWildPitch: true };
  }

  // HBP — hit by pitch
  const hbpChance = Math.max(0.005, (10 - pitcher.control) * 0.004);
  if (Math.random() < hbpChance) {
    return { pitchType: pitchType.name, isStrike: false, location: 'hit batter', isHBP: true };
  }

  const baseStrikeChance = 0.35 + controlFactor * 0.28;
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

// Resolve swing outcome using batter ratings (1-10 scale)
function resolveSwing(state, swingType, pitch) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);

  // Take pitch (CPU only)
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

  // Bunt — success based on Contact + Speed
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

    // Bunt success: Contact (not bunting skill) + Speed for hit chance
    const contactSkill = batter.contact / 10;
    const speedFactor = batter.speed / 10;
    const buntSuccess = Math.random() < (0.25 + contactSkill * 0.28 + speedFactor * 0.17);

    if (buntSuccess) {
      batter.gameStats.ab++;
      batter.gameStats.hits++;
      pitcher.gameStats.h++;
      const rbi = advanceRunners(state, 1, batter, true);
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

  // Swing (Normal or Power)
  const isPower = swingType.name === 'Power Swing';
  const isContact = swingType.name === 'Contact Swing';

  // Apply split-adjusted ratings based on pitcher handedness
  const adjBatter = getSplitAdjustedPlayer(batter, pitcher.throws);

  // Contact chance
  const contactRating = adjBatter.contact / 10;
  let contactChance = 0.25 + contactRating * 0.35;

  if (isPower) contactChance -= 0.10;
  if (isContact) contactChance += 0.12;
  if (!pitch.isStrike) contactChance -= 0.20;

  // Hit-and-run: forced to swing, contact penalty but runners go
  if (state.hitAndRun) {
    contactChance -= 0.08;
    contactChance = Math.max(0.03, contactChance); // still possible but harder
  }

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

      // Hit-and-run: if strikeout and runner on base, check if runner caught
      if (state.hitAndRun && !state.gameOver) {
        handleHitAndRunCaught(state);
      }
      return;
    }
    state.log.push({ type: 'strike', text: `Swing and a miss! Strike ${state.strikes}` });
    state.lastPlay = { type: 'strike', text: `Swinging strike ${state.strikes}` };
    return;
  }

  // Made contact — hit-and-run: batter contact matters, runner speed for advancement
  if (state.hitAndRun) {
    // On hit-and-run contact, runners automatically advance one extra base
    batter.gameStats.ab++;
    state.hitAndRun = false;
    handleHitAndRunContact(state, batter, pitcher, adjBatter);
    return;
  }

  // Normal swing resolution
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
  const powerRating = adjBatter.power / 10;
  let hitChance = 0.20 + contactRating * 0.28;
  if (isPower) hitChance -= 0.04;
  if (isContact) hitChance += 0.08;

  hitChance -= (pitcher.control / 10) * 0.03;

  // Outfield positioning: power hitters → deeper OF → more singles drop in
  const ofPositioningBonus = (adjBatter.power / 10) * 0.05;
  hitChance += ofPositioningBonus;

  hitChance = Math.max(0.08, Math.min(hitChance, 0.65));

  const rand = Math.random();

  if (rand < hitChance) {
    // HIT!
    pitcher.gameStats.h++;
    batter.gameStats.hits++;

    let powerMod = isPower ? 1.6 : (isContact ? 0.5 : 1.0);
    const effectivePower = powerRating * powerMod;
    const speedFactor = adjBatter.speed / 10;
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
    } else if (hitRoll < effectivePower * 0.10 + speedFactor * 0.08) {
      // TRIPLE — based on Contact, Power, and Speed
      const rbi = advanceRunners(state, 3, batter, true);
      const msg = `${batter.name} rips a triple into the gap!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: msg });
      state.lastPlay = { type: 'triple', text: msg };
    } else if (hitRoll < effectivePower * 0.32) {
      const rbi = advanceRunners(state, 2, batter, true);
      const msg = `${batter.name} doubles off the wall!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      const rbi = advanceRunners(state, 1, batter, true);
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
    // OUT — determine out type first, then apply defense logic
    const defenders = getDefensivePlayers(state);

    // Pick an out type with position mapping
    const groundOutTypes = [
      { text: `${batter.name} grounds out to short`, pos: 'SS' },
      { text: `${batter.name} grounds out to second`, pos: '2B' },
      { text: `${batter.name} grounds out to third`, pos: '3B' },
      { text: `${batter.name} grounds out to the pitcher`, pos: 'SP' },
      { text: `${batter.name} grounds out to first`, pos: '1B' },
    ];
    const flyOutTypes = [
      { text: `${batter.name} flies out to center`, pos: 'CF' },
      { text: `${batter.name} flies out to right`, pos: 'RF' },
      { text: `${batter.name} flies out to left`, pos: 'LF' },
    ];
    const otherOuts = [
      { text: `${batter.name} pops up to second`, pos: '2B', type: 'flyout' },
      { text: `${batter.name} lines out to third`, pos: '3B', type: 'lineout' },
    ];

    const allOuts = [...groundOutTypes, ...flyOutTypes, ...otherOuts];
    const out = allOuts[Math.floor(Math.random() * allOuts.length)];

    // Determine if it's a fly ball (CF/RF/LF positions) or ground ball
    const isFlyBall = ['CF', 'RF', 'LF'].includes(out.pos);
    const outType = out.type || (isFlyBall ? 'flyout' : 'groundout');

    // ---- ERROR CHECK on ground balls ----
    const isGrounder = !isFlyBall && out.pos !== 'SP';
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) {
        const errorChance = getErrorChance(fielder.name);
        if (Math.random() < errorChance) {
          // Error! Batter reaches (not a hit), runners advance one base
          batter.gameStats.ab++;
          pitcher.gameStats.er++; // unearned, but simplified
          advanceRunners(state, 1, batter, false);
          const msg = `❌ ${fielder.name} boots it! ${batter.name} reaches on an error!`;
          state.log.push({ type: 'error', text: msg });
          state.lastPlay = { type: 'error', text: msg };
          state.balls = 0;
          state.strikes = 0;
          advanceBatter(state);
          return;
        }
      }
    }

    // ---- INFIELD HIT CHECK on ground balls ----
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) {
        const fielderArm = fielder.arm / 10;
        const runnerSpeed = batter.speed / 10;
        // Weak arm (SS/3B) + fast runner = infield hit chance
        const infieldHitChance = Math.max(0, (runnerSpeed * 0.30) - (fielderArm * 0.15) - (fielder.defense / 10) * 0.05);
        if (Math.random() < infieldHitChance) {
          batter.gameStats.ab++;
          batter.gameStats.hits++;
          pitcher.gameStats.h++;
          advanceRunners(state, 1, batter, true);
          const msg = `${batter.name} beats it out — infield single past ${fielder.name}!`;
          state.log.push({ type: 'single', text: msg });
          state.lastPlay = { type: 'single', text: msg };
          state.balls = 0;
          state.strikes = 0;
          advanceBatter(state);
          return;
        }
      }
    }

    // ---- DOUBLE PLAY (enhanced with defense + runner speed) ----
    if (state.outs < 2 && state.bases[0] && isGrounder) {
      const runner = state.bases[0];
      const runnerSpeed = runner.speed / 10;
      const middleInfield = getMiddleInfieldRating(defenders);
      const dpFactor = (middleInfield / 10) * 0.15;
      // Better infield → more DPs; fast runner → fewer DPs
      let dpChance = 0.10 + dpFactor - (runnerSpeed * 0.12);
      dpChance = Math.max(0.03, Math.min(dpChance, 0.30));

      if (Math.random() < dpChance) {
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
    }

    // ---- SACRIFICE FLY ----
    if (state.bases[2] && state.outs < 2) {
      const runner = state.bases[2];
      const runnerSpeed = runner.speed / 10;
      const sacFlyChance = 0.15 + runnerSpeed * 0.45;
      if (Math.random() < sacFlyChance) {
        runner.gameStats.runs++;
        scoreRun(state);
        state.bases[2] = null;
        batter.gameStats.rbi++;
        getCurrentPitcher(state).gameStats.r++;
        getCurrentPitcher(state).gameStats.er++;
        const msg = `${batter.name} hits a sacrifice fly — ${runner.name} tags and scores!`;
        state.log.push({ type: 'sacfly', text: msg });
        state.lastPlay = { type: 'sacfly', text: msg };
        batter.gameStats.ab--;
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
    }

    // ---- TAG-UP on fly outs ----
    if (isFlyBall) {
      for (let i = 0; i < 2; i++) {
        const runner = state.bases[i];
        if (!runner) continue;
        const speedFactor = runner.speed / 10;
        const ofArm = defenders[out.pos] ? defenders[out.pos].arm / 10 : 0.5;
        if (i === 1 && state.outs < 2) {
          const tagChance = 0.08 + speedFactor * 0.40 - ofArm * 0.12;
          if (Math.random() < Math.max(0.02, tagChance)) {
            state.bases[2] = runner;
            state.bases[1] = null;
            state.log.push({ type: 'info', text: `${runner.name} tags up and advances to third!` });
          }
        }
      }
    }

    state.log.push({ type: outType, text: out.text });
    state.lastPlay = { type: outType, text: out.text };
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

// --- HIT AND RUN RESOLUTION ---

function handleHitAndRunContact(state, batter, pitcher, adjBatter) {
  const contactSkill = adjBatter.contact / 10;
  const powerRating = adjBatter.power / 10;

  // On hit-and-run contact: higher ground ball tendency, runners advance
  // Determine hit quality based on contact
  const hitRoll = Math.random();
  const hitChance = 0.25 + contactSkill * 0.30;

  if (hitRoll < hitChance) {
    // Hit on hit-and-run
    batter.gameStats.hits++;
    pitcher.gameStats.h++;

    if (hitRoll < powerRating * 0.06) {
      advanceRunners(state, 2, batter, true);
      const msg = `${batter.name} rips a double on the hit-and-run!`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      advanceRunners(state, 1, batter, true);
      // On hit-and-run single, runners on base auto-advance one extra
      advanceHitAndRunRunners(state);
      const msg = `${batter.name} slaps a single — hit-and-run works!`;
      state.log.push({ type: 'single', text: msg });
      state.lastPlay = { type: 'single', text: msg };
    }
  } else {
    // Ground out on hit-and-run
    batter.gameStats.ab++;
    const outTypes = [
      `${batter.name} grounds out to second`,
      `${batter.name} grounds out to short`,
      `${batter.name} taps back to the pitcher`,
    ];
    const msg = outTypes[Math.floor(Math.random() * outTypes.length)];
    state.log.push({ type: 'groundout', text: msg });
    state.lastPlay = { type: 'groundout', text: msg };
    recordOut(state);
  }

  state.balls = 0;
  state.strikes = 0;
  advanceBatter(state);
}

function advanceHitAndRunRunners(state) {
  for (let i = 0; i < 3; i++) {
    const runner = state.bases[i];
    if (!runner) continue;
    if (i + 1 >= 3) {
      runner.gameStats.runs++;
      scoreRun(state);
      state.bases[i] = null;
    } else if (!state.bases[i + 1]) {
      state.bases[i + 1] = runner;
      state.bases[i] = null;
    }
  }
}

function handleHitAndRunCaught(state) {
  // On strikeout during hit-and-run, check if runner is caught stealing
  for (let i = 0; i < 3; i++) {
    const runner = state.bases[i];
    if (!runner) continue;
    const speedFactor = runner.speed / 10;
    const caughtChance = 0.50 - speedFactor * 0.30; // faster runners harder to catch
    if (Math.random() < caughtChance) {
      runner.gameStats.cs = (runner.gameStats.cs || 0) + 1;
      state.bases[i] = null;
      recordOut(state);
      const baseName = ['second', 'third', 'home'][Math.min(i + 1, 2)];
      state.log.push({ type: 'info', text: `❌ ${runner.name} caught stealing ${baseName} on the hit-and-run!` });
      break;
    } else {
      // Runner advances despite strikeout
      if (i + 1 < 3) {
        state.bases[i + 1] = runner;
        state.bases[i] = null;
        const baseName = ['second', 'third'][i];
        state.log.push({ type: 'info', text: `${runner.name} swipes ${baseName} on the hit-and-run!` });
      }
    }
  }
}

// --- PROCESS AT BAT ---

export function processAtBat(state, pitchType, swingType) {
  const home = TEAMS[state.homeTeam];
  const away = TEAMS[state.awayTeam];
  const newState = JSON.parse(JSON.stringify(state));

  // Process pending steal first
  if (newState.pendingSteal !== null && newState.pendingSteal !== undefined) {
    const stealResult = attemptSteal(newState, newState.pendingSteal);
    Object.assign(newState, stealResult);
    if (newState.gameOver) return newState;
  }

  // Walk trigger — pitcher loses command, instant walk regardless of count
  const pitcher = getCurrentPitcher(newState);
  const batter = getCurrentBatter(newState);
  const walkChance = Math.max(0.02, (10 - pitcher.control) * 0.014);
  if (Math.random() < walkChance) {
    batter.gameStats.bb++;
    pitcher.gameStats.bb++;
    const msg = `${batter.name} draws a walk!`;
    newState.log.push({ type: 'walk', text: msg });
    newState.lastPlay = { type: 'walk', text: msg };
    handleWalk(newState, batter);
    newState.balls = 0;
    newState.strikes = 0;
    advanceBatter(newState);
    if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
      newState.gameOver = true;
      newState.waitingForInput = false;
      newState.log.push({ type: 'info', text: `🎉 Walk-off walk! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
    }
    return newState;
  }

  newState.pitchResult = resolvePitch(newState, pitchType);

  // HBP bypasses swing entirely
  if (newState.pitchResult.isHBP) {
    const hbpBatter = getCurrentBatter(newState);
    hbpBatter.gameStats.bb++;
    getCurrentPitcher(newState).gameStats.bb++;
    const msg = `${hbpBatter.name} is hit by the pitch!`;
    newState.log.push({ type: 'walk', text: msg });
    newState.lastPlay = { type: 'walk', text: msg + ' — takes first' };
    handleWalk(newState, hbpBatter);
    newState.balls = 0;
    newState.strikes = 0;
    advanceBatter(newState);
    if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
      newState.gameOver = true;
      newState.waitingForInput = false;
      newState.log.push({ type: 'info', text: `🎉 Walk-off HBP! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
    }
    return newState;
  }

  resolveSwing(newState, swingType, newState.pitchResult);

  // Walk-off check
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
    newState.gameOver = true;
    newState.waitingForInput = false;
    newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
  }

  return newState;
}

// CPU pitch selection based on pitcher strengths and arsenal
export function cpuSelectPitch(state) {
  const pitcher = getCurrentPitcher(state);
  const pitches = pitcher.pitches || DEFAULT_PITCHES;
  const rand = Math.random();

  // Fastball preference for power pitchers
  if (pitcher.pitchSpeed >= 7 && rand < 0.35 && pitches.includes("Fastball")) return "Fastball";

  // Breaking ball preference for offspeed specialists
  const breakingPitches = pitches.filter(p => ["Breaking Ball", "Knuckleball", "Screwball", "Split-Finger"].includes(p));
  if (pitcher.offSpeed >= 7 && rand < 0.50 && breakingPitches.length > 0) {
    return breakingPitches[Math.floor(Math.random() * breakingPitches.length)];
  }

  // Changeup preference
  if (pitcher.offSpeed >= 6 && rand < 0.55 && pitches.includes("Changeup")) return "Changeup";

  // Random pick from available
  return pitches[Math.floor(Math.random() * pitches.length)] || "Fastball";
}

// CPU swing selection based on batter strengths and count
export function cpuSelectSwing(state) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  const adjBatter = getSplitAdjustedPlayer(batter, pitcher.throws);
  const rand = Math.random();

  if (state.strikes === 2) {
    return rand < 0.75 ? 1 : 0; // Contact or Normal
  }
  if (state.balls === 3) {
    return rand < 0.45 ? 3 : 1; // Take or Contact
  }
  if (state.balls >= 2 && state.strikes === 0) {
    if (rand < 0.35) return 3; // Take
  }

  if (adjBatter.power >= 8 && rand < 0.30) return 2; // Power swing
  if (adjBatter.contact >= 8 && rand < 0.45) return 1; // Contact swing
  if (rand < 0.45) return 0; // Normal swing
  if (rand < 0.70) return 1; // Contact
  return 0;
}

// Split-adjusted ratings based on 1984 real platoon splits
function getSplitAdjustedPlayer(player, pitcherHand) {
  if (!player.splits || !pitcherHand) return player;

  const split = pitcherHand === 'L' ? player.splits.vsLHP : player.splits.vsRHP;
  if (!split || split.ab < 20) return player;

  const vsL = player.splits.vsLHP;
  const vsR = player.splits.vsRHP;
  const totalAB = vsL.ab + vsR.ab;
  const totalH = vsL.ba * vsL.ab + vsR.ba * vsR.ab;
  const overallBA = totalAB > 0 ? totalH / totalAB : 0.250;
  const totalHR = vsL.hr + vsR.hr;
  const overallHRRate = totalAB > 0 ? totalHR / totalAB : 0.020;

  const baRatio = overallBA > 0 ? split.ba / overallBA : 1;
  const adjustedContact = Math.max(1, Math.min(10, Math.round(player.contact * baRatio)));

  const splitHRRate = split.ab > 0 ? split.hr / split.ab : 0;
  const hrRatio = overallHRRate > 0 ? splitHRRate / overallHRRate : 1;
  const adjustedPower = Math.max(1, Math.min(10, Math.round(player.power * hrRatio)));

  return { ...player, contact: adjustedContact, power: adjustedPower };
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };