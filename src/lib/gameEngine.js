import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { applyWeatherEffects } from './weather';
import { BALLPARKS, getBallparkEffect, getHitDirection, checkBallparkQuirk } from './ballparks';

// Create initial game state with two selected teams
export function createGameState(homeTeam, awayTeam, customHomeLineup, customAwayLineup, useDH = false, weather = null) {
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  const buildLineup = (lineupData, defaultLineup, teamData) => {
    if (lineupData && lineupData.length >= 9) {
      return lineupData.slice(0, 9).map((p, i) => ({
        ...p,
        order: i + 1,
        assignedPos: p.assignedPos || p.pos,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
      }));
    }
    let lineup = defaultLineup.map((p, i) => ({
      ...p,
      order: i + 1,
      assignedPos: p.pos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
    }));
    // If DH and lineup has fewer than 9 (NL team in AL park), fill with bench player as DH
    if (useDH && lineup.length < 9 && teamData?.bench?.length > 0) {
      const benchDH = { ...teamData.bench[0], pos: 'DH', assignedPos: 'DH', defense: 0, arm: 0,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
        order: lineup.length + 1,
      };
      lineup.push(benchDH);
    }
    // No DH: ensure pitcher is in the 9th spot if not already in lineup
    if (!useDH && teamData?.rotation?.length > 0) {
      const spName = teamData.rotation[0].name;
      if (!lineup.find(p => p.name === spName)) {
        const sp = teamData.rotation[0];
        lineup.push({
          ...sp, assignedPos: 'SP',
          gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
          order: lineup.length + 1,
        });
      }
    }
    return lineup;
  };

  const homeLineup = buildLineup(customHomeLineup, home.lineup, home);
  const awayLineup = buildLineup(customAwayLineup, away.lineup, away);

  // Find the starting pitcher from the lineup (SP position), fall back to rotation[0]
  const homeSP = homeLineup.find(p => p.assignedPos === 'SP') || home.rotation[0];
  const awaySP = awayLineup.find(p => p.assignedPos === 'SP') || away.rotation[0];

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
    homePitcher: createPitcherState(homeSP),
    awayPitcher: createPitcherState(awaySP),
    homeBatterIndex: 0,
    awayBatterIndex: 0,
    log: [],
    gameOver: false,
    waitingForInput: true,
    lastPlay: null,
    pitchResult: null,
    hitAndRun: false,
    pendingSteal: null,
    weather: weather || null,
    homePlayerHistory: [],
    awayPlayerHistory: [],
  };
}

function createPitcherState(p) {
  return { ...p, pitchCount: 0, pitches: p.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
}

export { TEAM_IDS };

// Position group lookup
const POSITION_GROUPS = {
  C: 'C', '1B': 'IF', '2B': 'IF', '3B': 'IF', 'SS': 'IF',
  LF: 'OF', CF: 'OF', RF: 'OF', DH: 'DH',
  OF: 'OF', INF: 'IF', // generic positions for bench players
};

// Normalize position for group lookup (handles "C/3B", "OF", etc.)
function normalizePosGroup(pos) {
  if (!pos) return null;
  if (POSITION_GROUPS[pos]) return POSITION_GROUPS[pos];
  // Handle combined positions like "C/3B" — use the first one
  const parts = pos.split('/');
  for (const p of parts) {
    const trimmed = p.trim();
    if (POSITION_GROUPS[trimmed]) return POSITION_GROUPS[trimmed];
  }
  return null;
}

// Get adjusted player ratings based on position penalty
function getAdjustedPlayer(player) {
  const assignedPos = player.assignedPos || player.pos;
  const naturalPos = player.pos;

  if (assignedPos === 'DH' || naturalPos === assignedPos) {
    return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  }

  // Check if assigned position matches any part of a combo position (e.g., "C/3B" can play 3B without penalty)
  const naturalParts = naturalPos.split('/').map(p => p.trim());
  if (naturalParts.includes(assignedPos)) {
    return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  }

  const naturalGroup = normalizePosGroup(naturalPos);
  const assignedGroup = normalizePosGroup(assignedPos);

  if (!naturalGroup || !assignedGroup) {
    return { ...player, defenseAdj: player.defense, errorMult: 1.0 };
  }

  if (naturalGroup === assignedGroup) {
    // Same group: minor penalty
    return {
      ...player,
      defenseAdj: Math.max(1, player.defense - 1),
      errorMult: 1.5,
    };
  }

  // Cross-group: major penalty
  return {
    ...player,
    defenseAdj: Math.max(1, player.defense - 3),
    errorMult: 3.0,
  };
}

// Get the defensive team's position players and team data
function getDefensivePlayers(state) {
  const fieldingLineup = state.halfInning === 'top' ? state.homeLineup : state.awayLineup;
  const defenders = {};
  fieldingLineup.forEach(p => {
    const pos = p.assignedPos || p.pos;
    if (pos !== 'DH') defenders[pos] = p;
  });
  return defenders;
}

// Get best outfield arm among the defensive outfielders (with position penalty)
function getOutfieldArm(defenders) {
  const of = ['LF', 'CF', 'RF'];
  let bestArm = 5;
  of.forEach(pos => {
    if (defenders[pos]) {
      const adj = getAdjustedPlayer(defenders[pos]);
      const naturalGroup = normalizePosGroup(adj.pos);
      const arm = adj.assignedPos && adj.assignedPos !== adj.pos && naturalGroup !== 'OF' ? Math.max(1, adj.arm - 2) : adj.arm;
      if (arm > bestArm) bestArm = arm;
    }
  });
  return bestArm;
}

// Get middle infield defense + arm rating (for double plays) with position penalty
function getMiddleInfieldRating(defenders) {
  const ss = defenders['SS'];
  const b2 = defenders['2B'];
  const adjSS = ss ? getAdjustedPlayer(ss) : null;
  const adjB2 = b2 ? getAdjustedPlayer(b2) : null;
  const ssDef = adjSS ? (adjSS.defenseAdj + (adjSS.pos === 'SS' ? adjSS.arm : Math.max(1, adjSS.arm - 2))) / 2 : 5;
  const b2Def = adjB2 ? (adjB2.defenseAdj + (adjB2.pos === '2B' ? adjB2.arm : Math.max(1, adjB2.arm - 2))) / 2 : 5;
  return (ssDef + b2Def) / 2;
}

// Get catcher arm rating (with position penalty)
function getCatcherArm(defenders) {
  if (!defenders['C']) return 5;
  const adj = getAdjustedPlayer(defenders['C']);
  if (adj.pos !== 'C') return Math.max(1, adj.arm - 3);
  return adj.arm;
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

  // Save pre-advancement base state — speed checks should only apply to runners
  // who were already at that base before this hit, not runners moved by standard advancement
  const preBases = [...state.bases];

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

  // --- Speed-based extra base advancement on EXISTING runners (before placing batter) ---
  // Only applies to runners already on base, NOT the batter who just hit
  const defenders = getDefensivePlayers(state);
  if (isHit && bases <= 2) {
    const ofArm = getOutfieldArm(defenders);
    const armPenalty = (ofArm / 10) * 0.18; // strong OF arm reduces extra-base success

    // Outfield positioning: deeper vs power hitters = harder to take extra bases
    const batterPower = batter.power / 10;
    const positioningPenalty = batterPower * 0.10; // power hitters → deeper OF → harder extra bases

    for (let i = 0; i < 3; i++) {
      const runner = state.bases[i];
      if (!runner) continue;
      // Only check speed for runners who were already at this base BEFORE standard advancement
      if (preBases[i]?.name !== runner.name) continue;
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

  // Now place the batter on their hit base (after speed logic, so batter isn't mistaken for a runner)
  if (bases <= 3) {
    state.bases[bases - 1] = batter;
  }

  // Trailing runner sneaks extra base when defense throws elsewhere
  // On a single, the batter can take 2nd if the defense throws to 3rd (or home) trying to nail a runner
  if (isHit && bases === 1) {
    const runnerOn3rd = state.bases[2];
    const batterOn1st = state.bases[0];
    // Only if batter is on 1st, 2nd is open, and there's a runner at 3rd drawing a throw
    if (batterOn1st && batterOn1st.name === batter.name && runnerOn3rd && !state.bases[1]) {
      const ofArm = getOutfieldArm(defenders);
      const leadSpeed = runnerOn3rd.speed / 10;
      const batterSpeed = batter.speed / 10;
      const sneakChance = 0.08 + leadSpeed * 0.28 - (ofArm / 10) * 0.06 + batterSpeed * 0.10;
      if (Math.random() < Math.max(0.02, Math.min(sneakChance, 0.40))) {
        state.bases[1] = batter;
        state.bases[0] = null;
        state.log.push({ type: 'info', text: `${batter.name.split(' ').pop()} takes second — defense threw to third!` });
      }
    }
  }

  batter.gameStats.rbi += rbi;
  pitcher.gameStats.r += rbi;
  pitcher.gameStats.er += rbi;
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
  // Safety: ensure innings array has this slot
  if (!state.innings[state.inning - 1]) {
    state.innings[state.inning - 1] = { home: null, away: null };
  }
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
    // 7th inning stretch with stadium-specific flavor
    if (state.inning === 7) {
      const homeFlavor = TEAMS[state.homeTeam];
      const teamKey = state.homeTeam;
      const stretchLines = {
        cubs: `🎶 Harry Caray grabs the mic — "Take me out to the ballgame…" 🎶`,
        redsox: `🎶 The crowd belts out 'Sweet Caroline' in the middle of the 8th — but first, the 7th inning stretch at Fenway! 🎶`,
      };
      const stretchSong = stretchLines[teamKey] || `🎶 7th Inning Stretch at ${homeFlavor?.stadium || 'the ballpark'}! 🎶`;
      state.log.push({ type: 'info', text: stretchSong });
    }
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
    const stealTo = baseIndex + 1;
    const baseName = stealTo === 1 ? 'second' : stealTo === 2 ? 'third' : 'home';
    newState.log.push({ type: 'info', text: `❌ ${runner.name} caught stealing ${baseName}!` });
    newState.lastPlay = { type: 'caughtstealing', text: `${runner.name} caught stealing at ${baseName}!` };
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
  // Never steal with 2 outs or when it makes no strategic sense
  if (state.outs >= 2) return -1;

  const defenders = getDefensivePlayers(state);
  const catcherArm = getCatcherArm(defenders);
  const pitcher = getCurrentPitcher(state);
  const armFactor = (catcherArm / 10) * 0.30; // strong arm deters steals
  const pitchFactor = (pitcher.pitchSpeed / 10) * 0.12; // fast delivery deters steals

  for (let i = 0; i < 2; i++) { // Only steal 2nd (i=0) or 3rd (i=1), never home (i=2)
    const runner = state.bases[i];
    if (!runner) continue;
    // Can't steal into an occupied base
    if (state.bases[i + 1]) continue;
    // Pitchers and catchers don't steal (slow)
    if (runner.speed <= 2) continue;
    const speedFactor = runner.speed / 10;
    // CPU steals ~8-25% of opportunities based on speed, reduced by catcher arm + pitch speed
    if (Math.random() < Math.max(0.03, 0.06 + speedFactor * 0.22 - armFactor - pitchFactor)) {
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
      let scored = null;
      const moved = [];
      for (let i = 2; i >= 0; i--) {
        if (state.bases[i]) {
          if (i + 1 >= 3) {
            state.bases[i].gameStats.runs++;
            scoreRun(state);
            scored = state.bases[i];
            state.bases[i] = null;
          } else if (!state.bases[i + 1]) {
            state.bases[i + 1] = state.bases[i];
            state.bases[i] = null;
            moved.push(state.bases[i + 1]);
          }
        }
      }
      const logMsg = scored
        ? `Wild pitch! ${scored.name.split(' ').pop()} scores!${moved.length > 0 ? ' Runners advance.' : ''}`
        : `Wild pitch! Runners advance!`;
      const playMsg = scored
        ? `Wild pitch — ${scored.name.split(' ').pop()} scores!`
        : `Wild pitch!`;
      state.log.push({ type: 'error', text: logMsg });
      state.lastPlay = { type: 'error', text: playMsg };
    }
    state.balls++;
    return { pitchType: pitchType.name, isStrike: false, location: 'wild pitch', isWildPitch: true };
  }

  // HBP — hit by pitch
  const hbpChance = Math.max(0.002, (10 - pitcher.control) * 0.0015);
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

    // Pitchers always sacrifice when there's a runner to advance (slow, always bunting to move runner)
    const isPitcherHitting = batter.pos === 'SP' || batter.assignedPos === 'SP' || batter.speed <= 2;
    const hasRunnerOn1st = !!state.bases[0];
    const canSacrifice = state.outs < 2 && hasRunnerOn1st;

    if (isPitcherHitting && canSacrifice && !pitch.isStrike) {
      // Pitcher sacrifice bunt: always succeeds on a strike pitch, advance runner, batter out
      const r1 = state.bases[0];
      if (r1) {
        if (state.bases[1]) state.bases[2] = state.bases[1];
        state.bases[1] = r1;
        state.bases[0] = null;
      }
      batter.gameStats.ab++;
      pitcher.gameStats.so++;
      const msg = `${batter.name} lays down the sacrifice — ${r1?.name?.split(' ').pop()} moves to second`;
      state.log.push({ type: 'groundout', text: msg });
      state.lastPlay = { type: 'groundout', text: `Sacrifice bunt by ${batter.name}` };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }

    // Bunt success: Bunting skill + Speed for hit chance (sacrifice bunts are harder)
    const buntingSkill = (batter.bunting || 3) / 10;
    const speedFactor = batter.speed / 10;
    const buntSuccess = Math.random() < (0.12 + buntingSkill * 0.30 + speedFactor * 0.18);

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

  // Apply situational ratings: platoon split + home/away + day/night
  const adjBatter = getSituationalBatter(state);

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
      const strikeoutMsgs = pitch.isStrike ? [
        `${batter.name} goes down swinging!`,
        `${batter.name} can't catch up — strike three!`,
        `${batter.name} whiffs on strike three!`,
        `${batter.name} fans on a wicked ${pitch.pitchType}!`,
        `${batter.name} swings right through it — out!`,
      ] : [
        `${batter.name} chases one out of the zone — Struck out!`,
        `${batter.name} swings and misses — Struck out!`,
        `${batter.name} flails and misses — strike three!`,
        `${batter.name} hacks at ball four — strikeout!`,
      ];
      const msg = strikeoutMsgs[Math.floor(Math.random() * strikeoutMsgs.length)];
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

  // Weather effects on this swing
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1;
  const doubleMod = wx.doubleMod || 1;
  const errorWx = wx.errorMult || 1;
  const contactWx = wx.contactMod || 0;

  // Ballpark effects
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const ballparkEffect = getBallparkEffect(stadiumName, adjBatter.bats, state.weather);
  const ballparkHRMod = ballparkEffect.hrMod || 1;

  // Determine typical hit direction for this batter
  const hitDirection = getHitDirection(adjBatter.bats);

  // Ball in play — determine hit vs out
  const powerRating = adjBatter.power / 10;
  let hitChance = 0.20 + (contactRating + contactWx / 10) * 0.28;
  if (isPower) hitChance -= 0.04;
  if (isContact) hitChance += 0.08;

  hitChance -= (pitcher.control / 10) * 0.03;

  // Outfield positioning: power hitters → deeper OF → more singles drop in
  const ofPositioningBonus = (adjBatter.power / 10) * 0.05;
  hitChance += ofPositioningBonus;

  // Range penalty: out-of-position defenders allow more hits
  const defenders = getDefensivePlayers(state);
  let rangePenalty = 0;
  Object.values(defenders).forEach(d => {
    const adj = getAdjustedPlayer(d);
    if (adj.pos !== (adj.assignedPos || adj.pos)) {
      rangePenalty += 0.015; // each out-of-position defender slightly increases hit chance
    }
  });
  hitChance += rangePenalty;

  hitChance = Math.max(0.08, Math.min(hitChance, 0.72));

  const rand = Math.random();

  if (rand < hitChance) {
    // HIT!
    pitcher.gameStats.h++;
    batter.gameStats.hits++;

    let powerMod = isPower ? 1.6 : (isContact ? 0.5 : 1.0);
    const effectivePower = powerRating * powerMod;
    const speedFactor = adjBatter.speed / 10;
    const hitRoll = Math.random();

    if (hitRoll < effectivePower * 0.065 * hrMod * ballparkHRMod) {
      // HOME RUN
      batter.gameStats.hr++;
      const runnersOn = state.bases.filter(b => b !== null).length;
      const rbi = advanceRunners(state, 4, batter);
      const grandSlam = runnersOn === 3;

      // Ballpark-specific HR descriptions
      const ballpark = BALLPARKS[stadiumName];
      const fieldDesc = ballpark?.wallDesc?.[hitDirection] || `to ${hitDirection}`;
      let hrText;
      if (ballpark?.quirks?.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) {
        hrText = `Up and over the Green Monster! ${runnersOn === 3 ? 'GRAND SLAM! ' : ''}${batter.name} clears the 37-foot wall!`;
      } else if (ballpark?.quirks?.includes('shortRF') && hitDirection === 'RF' && adjBatter.bats === 'L') {
        hrText = `Into the short porch! ${runnersOn === 3 ? 'GRAND SLAM! ' : ''}${batter.name} hooks one just over ${fieldDesc}!`;
      } else if (ballpark?.quirks?.includes('peskyPole') && hitDirection === 'RF') {
        hrText = `Around Pesky's Pole! ${runnersOn === 3 ? 'GRAND SLAM! ' : ''}${batter.name} wraps it inside the right field foul pole!`;
      } else if (ballpark?.quirks?.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF')) {
        hrText = `Onto Waveland Avenue! ${runnersOn === 3 ? 'GRAND SLAM! ' : ''}${batter.name} launches one over the ivy and out of Wrigley!`;
      } else {
        hrText = `${batter.name} sends it deep ${fieldDesc} —`;
        hrText += grandSlam ? ` GRAND SLAM! ${batter.name} clears the bases!`
          : rbi > 1 ? ` a ${rbi}-run HOME RUN!`
          : ` a solo HOME RUN!`;
      }
      const msg = `💥 ${hrText}`;
      state.log.push({ type: 'homerun', text: msg });
      state.lastPlay = { type: 'homerun', text: msg };
    } else if (hitRoll < (effectivePower * 0.10 + speedFactor * 0.08) * doubleMod) {
      // TRIPLE — based on Contact, Power, and Speed
      const rbi = advanceRunners(state, 3, batter, true);
      const msg = `${batter.name} rips a triple into the gap!${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: msg });
      state.lastPlay = { type: 'triple', text: msg };
    } else if (hitRoll < effectivePower * 0.32 * doubleMod) {
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
    // (defenders already computed above for range penalty)

    // Pick an out type with position mapping
    const groundOutTypes = [
      { text: `${batter.name} grounds out to short`, pos: 'SS' },
      { text: `${batter.name} grounds out to second`, pos: '2B' },
      { text: `${batter.name} grounds out to third`, pos: '3B' },
      { text: `${batter.name} grounds out to the pitcher`, pos: 'SP' },
      { text: `${batter.name} grounds out to first`, pos: '1B' },
    ];
    const batterLast = batter.name.split(' ').pop();
    const flyFields = { CF: ['center', 'center field'], RF: ['right', 'right field'], LF: ['left', 'left field'] };
    const depths = ['shallow ', '', 'deep ', 'to the warning track in ', 'back at the wall in '];
    const actions = [
      'tracks it down', 'makes the catch', 'hauls it in', 'runs it down',
      'drifts over and makes the grab', 'has room and makes the catch',
      'goes back and makes the over-the-shoulder catch', 'makes a running grab',
      'dives and makes the catch!', 'lays out for it — what a play!',
    ];
    const flyPosKeys = ['CF', 'RF', 'LF'];
    const fPos = flyPosKeys[Math.floor(Math.random() * flyPosKeys.length)];
    const fField = flyFields[fPos];
    const depth = depths[Math.floor(Math.random() * depths.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    const flyOutTypes = [
      { text: `${batter.name} flies out to ${depth}${fField[0]} — ${batterLast} is retired`, pos: fPos },
      { text: `${batterLast} lifts one to ${depth}${fField[1]} — ${defenders[fPos]?.name || fField[0]} ${action}`, pos: fPos },
      { text: `High fly ball to ${depth}${fField[1]} — ${defenders[fPos]?.name || fField[0]} ${action}`, pos: fPos },
      { text: `${batterLast} sends it to ${depth}${fField[1]} — caught for the out`, pos: fPos },
      { text: `Routine fly to ${depth}${fField[0]} — ${defenders[fPos]?.name || 'the fielder'} settles under it`, pos: fPos },
    ];
    const otherOuts = [
      { text: `${batter.name} pops it up behind the plate — ${defenders['C']?.name || 'the catcher'} makes the grab`, pos: '2B', type: 'popout' },
      { text: `Infield pop-up — ${defenders['2B']?.name || 'the second baseman'} calls for it and makes the catch`, pos: '2B', type: 'popout' },
      { text: `${batterLast} pops one up in foul territory — ${defenders['3B']?.name || 'the third baseman'} makes the play`, pos: '3B', type: 'popout' },
      { text: `${batter.name} lines it right at ${defenders['3B']?.name || 'the third baseman'} — caught!`, pos: '3B', type: 'lineout' },
      { text: `${batterLast} smokes one toward ${defenders['SS']?.name || 'the shortstop'} — snared on a hop!`, pos: 'SS', type: 'lineout' },
      { text: `${batter.name} rips a liner — ${defenders['SS']?.name || 'the shortstop'} leaps and grabs it!`, pos: 'SS', type: 'lineout' },
      { text: `Hard liner to ${defenders['1B']?.name || 'first'} — stabbed and caught!`, pos: '1B', type: 'lineout' },
      { text: `${batterLast} lines one — ${defenders['2B']?.name || 'the second baseman'} dives and makes the stop!`, pos: '2B', type: 'lineout' },
      { text: `Laser shot right at ${defenders['3B']?.name || 'third'} — picks it clean!`, pos: '3B', type: 'lineout' },
    ];

    const allOuts = [...groundOutTypes, ...flyOutTypes, ...otherOuts];
    const out = allOuts[Math.floor(Math.random() * allOuts.length)];

    // Determine if it's a fly ball (CF/RF/LF positions) or ground ball
    const isFlyBall = ['CF', 'RF', 'LF'].includes(out.pos) || out.type === 'popout';
    const outType = out.type || (isFlyBall ? 'flyout' : 'groundout');

    // ---- BALLPARK QUIRK CHECK on fly balls ----
    if (isFlyBall && out.type !== 'popout') {
      const quirk = checkBallparkQuirk(stadiumName, adjBatter.bats, hitDirection, state.weather);
      if (quirk && quirk.isHit) {
        batter.gameStats.ab++;
        batter.gameStats.hits++;
        pitcher.gameStats.h++;
        if (quirk.isHR) {
          batter.gameStats.hr++;
          advanceRunners(state, 4, batter);
        } else {
          advanceRunners(state, quirk.bases, batter, true);
        }
        state.log.push({ type: quirk.type, text: quirk.text });
        state.lastPlay = { type: quirk.type, text: quirk.text };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        return;
      }
      if (quirk && !quirk.isHit) {
        // Quirk that confirms the out (e.g., deep RCF at Fenway)
        state.log.push({ type: quirk.type, text: quirk.text });
        state.lastPlay = { type: quirk.type, text: quirk.text };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
    }

    // ---- ERROR CHECK on ground balls ----
    const isGrounder = !isFlyBall && out.pos !== 'SP';
    if (isGrounder) {
      const fielder = defenders[out.pos];
      if (fielder) {
        const adjFielder = getAdjustedPlayer(fielder);
        const errorChance = getErrorChance(fielder.name) * adjFielder.errorMult * errorWx;
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
        const adjFielder = getAdjustedPlayer(fielder);
        const fielderArm = adjFielder.arm / 10;
        const runnerSpeed = batter.speed / 10;
        // Weak arm (SS/3B) + fast runner = infield hit chance — out-of-position defenders give it up more
        const rangePenalty = adjFielder.pos !== (adjFielder.assignedPos || adjFielder.pos) ? 0.06 : 0;
        const infieldHitChance = Math.max(0, (runnerSpeed * 0.30) - (fielderArm * 0.15) - (adjFielder.defenseAdj / 10) * 0.05 + rangePenalty);
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

    // ---- GROUND BALL FORCE PLAY / DOUBLE PLAY RESOLUTION ----
    if (isGrounder) {
      const runnerOn1st = state.bases[0];
      const runnerOn2nd = state.bases[1];
      const hasForceAt2nd = !!runnerOn1st;
      const hasForceAt3rd = runnerOn1st && runnerOn2nd;

      if (hasForceAt2nd && state.outs < 2) {
        const middleInfield = getMiddleInfieldRating(defenders);
        const dpFactor = (middleInfield / 10) * 0.22;
        const runnerSpeed = (runnerOn1st ? runnerOn1st.speed : 5) / 10;
        let dpChance = 0.30 + dpFactor - (runnerSpeed * 0.04);
        dpChance = Math.max(0.10, Math.min(dpChance, 0.45));

        const roll = Math.random();

        if (roll < dpChance) {
          if (hasForceAt3rd) {
            // Double play with force at 3rd: runner on 2nd forced at 3rd (out)
            // Runner on 1st advances to 2nd. If bases loaded, runner on 3rd scores.
            const runner3rd = state.bases[2];
            const runner1st = state.bases[0];
            if (runner3rd && state.outs < 2) {
              runner3rd.gameStats.runs++;
              scoreRun(state);
              batter.gameStats.rbi++;
              pitcher.gameStats.r++;
              pitcher.gameStats.er++;
              state.log.push({ type: 'info', text: `${runner3rd.name} scores on the double play` });
            }
            state.bases[2] = runner3rd || null; // runner3rd scored, so null; or was already null
            state.bases[1] = runner1st || null; // runner from 1st advances to 2nd
            state.bases[0] = null;               // batter out at 1st
            const msg = runner3rd
              ? `${batter.name} grounds into a double play — force at 3rd and 1st!`
              : `${batter.name} grounds into a double play — force at 3rd and 1st!`;
            state.log.push({ type: 'doubleplay', text: msg });
            state.lastPlay = { type: 'doubleplay', text: msg };
          } else {
            // Standard DP: runner on 1st forced at 2nd
            // If runner on 2nd exists (runners on 1st & 2nd, force at 2nd variant), they move to 3rd
            if (state.bases[1]) {
              state.bases[2] = state.bases[2] || state.bases[1];
              state.bases[1] = null;
            }
            state.bases[0] = null;
            const dpMsgs = [
              `${batter.name} grounds to short — toss to ${defenders['2B']?.name?.split(' ').pop() || 'second'} for one, relay to first — double play!`,
              `${batterLast} bounces it to ${defenders['2B']?.name?.split(' ').pop() || 'second'} — flips to ${defenders['SS']?.name?.split(' ').pop() || 'short'} for the force, over to first — two!`,
              `${batter.name} taps it to the mound — ${defenders['SP']?.name?.split(' ').pop() || 'the pitcher'} goes to second, on to first — inning-ending double play!`,
              `${batterLast} grounds sharply to third — ${defenders['3B']?.name?.split(' ').pop() || 'third'} steps on the bag, fires across — twin killing!`,
              `${batter.name} rolls one to short — underhand flip to ${defenders['2B']?.name?.split(' ').pop() || 'second'}, the turn and throw — double play!`,
            ];
            const msg = dpMsgs[Math.floor(Math.random() * dpMsgs.length)];
            state.log.push({ type: 'doubleplay', text: msg });
            state.lastPlay = { type: 'doubleplay', text: msg };
          }
          state.balls = 0; state.strikes = 0;
          advanceBatter(state);
          // First out
          state.outs++;
          getCurrentPitcher(state).gameStats.ip += 1/3;
          if (!state.gameOver && state.outs < 3) {
            // Second out — only if inning didn't end on first
            state.outs++;
            getCurrentPitcher(state).gameStats.ip += 1/3;
            if (state.outs >= 3) endHalfInning(state);
          }
          if (state.outs >= 3) endHalfInning(state);
          return;
        } else if (roll < dpChance + 0.30) {
          if (hasForceAt3rd && Math.random() < 0.55 && state.outs < 2) {
            // Force at 3rd: runner on 3rd scores (force at home removed, only if not already 2 outs)
            const runner3rd = state.bases[2];
            if (runner3rd) {
              runner3rd.gameStats.runs++;
              scoreRun(state);
              batter.gameStats.rbi++;
              pitcher.gameStats.r++;
              pitcher.gameStats.er++;
            }
            const forcedRunner = state.bases[1];
            state.bases[2] = null;
            state.bases[1] = state.bases[0];
            state.bases[0] = batter;
            batter.gameStats.ab++;
            const scoreText = runner3rd ? ` ${runner3rd.name.split(' ').pop()} scores` : '';
            const msg = `${batter.name} grounds to ${out.pos} — force out at 3rd! ${forcedRunner ? forcedRunner.name + ' retired' : ''}${scoreText} — batter reaches on fielder's choice.`;
            state.log.push({ type: 'fc', text: msg });
            state.lastPlay = { type: 'fc', text: msg };
          } else {
            // Force at 2nd with bases loaded: runner on 3rd scores
            const runner3rd = state.bases[2];
            if (runner3rd) {
              runner3rd.gameStats.runs++;
              scoreRun(state);
              batter.gameStats.rbi++;
              pitcher.gameStats.r++;
              pitcher.gameStats.er++;
            }
            state.bases[2] = state.bases[1];
            state.bases[1] = null;
            state.bases[0] = batter;
            batter.gameStats.ab++;
            const scoreText = runner3rd ? ` ${runner3rd.name.split(' ').pop()} scores` : '';
            const msg = `${batter.name} grounds to ${out.pos} — force out at 2nd! ${runnerOn1st ? runnerOn1st.name + ' retired' : ''}${scoreText} — batter reaches on fielder's choice.`;
            state.log.push({ type: 'fc', text: msg });
            state.lastPlay = { type: 'fc', text: msg };
          }
          state.balls = 0; state.strikes = 0;
          advanceBatter(state);
          recordOut(state);
          return;
        }
      }

      // Regular groundout: advance runner on 1st to 2nd (batter out, force removed)
      // Also handle bases loaded: runner on 3rd scores when force is at 1st/2nd (not home)
      if (hasForceAt2nd) {
        const r1 = state.bases[0];
        const runner3rd = state.bases[2];
        const r2 = state.bases[1];
        // Bases loaded: runner on 3rd scores ONLY if fewer than 2 outs (no run on force 3rd out)
        if (runner3rd && r2 && r1 && state.outs < 2) {
          runner3rd.gameStats.runs++;
          scoreRun(state);
          batter.gameStats.rbi++;
          pitcher.gameStats.r++;
          pitcher.gameStats.er++;
          out.text = `${out.text} — ${runner3rd.name.split(' ').pop()} scores`;
        }
        // Shift runners (force removed at 1st, runner at 1st advances to 2nd)
        if (state.bases[1] && !state.bases[2]) { state.bases[2] = state.bases[1]; }
        state.bases[1] = r1;
        state.bases[0] = null;
        state.bases[2] = runner3rd || state.bases[2];
        // Only add advancement text if this wasn't the 3rd out
        if (!out.text.includes('advances') && !out.text.includes('scores')) {
          const willBeThirdOut = state.outs >= 2;
          if (!willBeThirdOut) {
            out.text = `${out.text} — ${r1.name.split(' ').pop()} advances to second`;
          }
        }
      }
    }

    // ---- SACRIFICE FLY (outfield fly ball only, runner on 3rd) ----
    const isOutfieldFly = isFlyBall && out.type !== 'popout' && out.type !== 'lineout' &&
      !out.text.includes('shallow ');
    if (isOutfieldFly && state.bases[2] && state.outs < 2) {
      const runner = state.bases[2];
      const runnerSpeed = runner.speed / 10;
      const ofArm = getOutfieldArm(defenders) / 10;
      const isDeep = out.text.includes('deep ') || out.text.includes('warning track') || out.text.includes('back at the wall');
      // Sac fly: higher chance on deep flies, speed helps, strong OF arm hurts
      const depthBonus = isDeep ? 0.15 : 0;
      const sacFlyChance = 0.15 + depthBonus + runnerSpeed * 0.35 - ofArm * 0.08;
      if (Math.random() < Math.max(0.06, Math.min(sacFlyChance, 0.50))) {
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

    // ---- TAG-UP on outfield fly outs only (medium+ depth, 2nd→3rd) ----
    if (isOutfieldFly) {
      const runner = state.bases[1];
      if (runner && state.outs < 2) {
        const speedFactor = runner.speed / 10;
        const ofArm = getOutfieldArm(defenders) / 10;
        // Tag from 2nd to 3rd: fast runner, weak arm helps
        const tagChance = 0.05 + speedFactor * 0.35 - ofArm * 0.10;
        if (Math.random() < Math.max(0.02, Math.min(tagChance, 0.30))) {
          state.bases[2] = runner;
          state.bases[1] = null;
          state.log.push({ type: 'info', text: `${runner.name} tags up and advances to third!` });
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
  // Determine hit quality based on contact — NO speed-based extra advancement
  const hitRoll = Math.random();
  const hitChance = 0.25 + contactSkill * 0.30;

  if (hitRoll < hitChance) {
    // Hit on hit-and-run
    batter.gameStats.hits++;
    pitcher.gameStats.h++;

    if (hitRoll < powerRating * 0.06) {
      advanceRunners(state, 2, batter, false);
      const msg = `${batter.name} rips a double on the hit-and-run!`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      advanceRunners(state, 1, batter, false);
      // Hit-and-run: existing baserunners get one extra base (they were going on the pitch)
      // The batter stays at 1st — they just hit a single
      const runnerNames = advanceHitAndRunRunners(state, batter);
      const msg = runnerNames
        ? `${batter.name} slaps a single — hit-and-run! ${runnerNames}`
        : `${batter.name} slaps a single — hit-and-run works!`;
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

function advanceHitAndRunRunners(state, batter) {
  let extraRuns = 0;
  const advances = [];
  // Only advance runners already on base BEFORE the hit — skip the batter
  for (let i = 2; i >= 0; i--) {
    const runner = state.bases[i];
    if (!runner) continue;
    // Don't advance the batter — they stay at the base they earned
    if (runner.name === batter.name) continue;
    if (i + 1 >= 3) {
      runner.gameStats.runs++;
      scoreRun(state);
      extraRuns++;
      state.bases[i] = null;
      advances.push(`${runner.name.split(' ').pop()} scores`);
    } else if (!state.bases[i + 1]) {
      state.bases[i + 1] = runner;
      state.bases[i] = null;
      const baseName = i + 1 === 2 ? 'third' : 'second';
      advances.push(`${runner.name.split(' ').pop()} to ${baseName}`);
    }
  }
  if (extraRuns > 0) {
    batter.gameStats.rbi += extraRuns;
  }

  // Batter can sneak to 2nd if the defense throws to 3rd trying to nail the lead runner
  // Chance depends on lead runner speed (draws the throw) + batter speed (takes advantage)
  const runnerOn3rd = state.bases[2];
  const batterOn1st = state.bases[0];
  if (batterOn1st && batterOn1st.name === batter.name && runnerOn3rd && !state.bases[1]) {
    const defenders = getDefensivePlayers(state);
    const ofArm = getOutfieldArm(defenders);
    const leadSpeed = runnerOn3rd.speed / 10;
    const batterSpeed = batter.speed / 10;
    // Fast lead runner → more likely to draw throw → batter scoots to 2nd
    const sneakChance = 0.10 + leadSpeed * 0.35 - (ofArm / 10) * 0.08 + batterSpeed * 0.12;
    if (Math.random() < Math.max(0.03, Math.min(sneakChance, 0.45))) {
      state.bases[1] = batter;
      state.bases[0] = null;
      advances.push(`${batter.name.split(' ').pop()} takes second on the throw`);
    }
  }

  return advances.length > 0 ? advances.join(', ') : null;
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
      const toBase = i + 1;
      const baseName = toBase === 1 ? 'second' : toBase === 2 ? 'third' : 'home';
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
  // Reset hit-and-run after resolution — prevents cascading attempts
  state.hitAndRun = false;
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
    // Caught stealing ends the play — don't process pitch/swing
    if (stealResult.lastPlay?.type === 'caughtstealing') return newState;
  }

  // Walk trigger — pitcher loses command, instant walk regardless of count
  const pitcher = getCurrentPitcher(newState);
  const batter = getCurrentBatter(newState);
  const walkChance = Math.max(0.01, (10 - pitcher.control) * 0.005);
  if (Math.random() < walkChance) {
    batter.gameStats.bb++;
    pitcher.gameStats.bb++;
    pitcher.gameStats.pitches += 4; // jump pitch count for full at-bat
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

  // Wild pitch resolved entirely in resolvePitch — skip swing, just check for walk
  if (newState.pitchResult.isWildPitch) {
    if (newState.balls >= 4) {
      const walkBatter = getCurrentBatter(newState);
      walkBatter.gameStats.bb++;
      getCurrentPitcher(newState).gameStats.bb++;
      const msg = `${walkBatter.name} walks on a wild pitch!`;
      newState.log.push({ type: 'walk', text: msg });
      newState.lastPlay = { type: 'walk', text: msg };
      handleWalk(newState, walkBatter);
      newState.balls = 0; newState.strikes = 0;
      advanceBatter(newState);
    }
    return newState;
  }

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
  const adjBatter = getSituationalBatter(state);
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

// Situational ratings: platoon splits + home/away + day/night
// Based on 1980s MLB research: home BA +0.010, HR +6%; day games +0.005 BA
export function getSituationalBatter(state) {
  const batter = getCurrentBatter(state);
  const pitcher = getCurrentPitcher(state);
  const adj = getSplitAdjustedPlayer(batter, pitcher.throws);

  const isHome = getBattingTeam(state) === 'home';
  const isDay = state.weather?.isDay ?? true;

  // Home field advantage: +3% contact, +3% power (1980s MLB: ~.010 BA, ~6% HR at home)
  const homeContactMod = isHome ? 1.03 : 0.98;
  const homePowerMod = isHome ? 1.03 : 0.97;

  // Day game: better ball visibility, slightly higher contact (~.005 BA)
  const dayContactMod = isDay ? 1.02 : 0.99;
  const dayPowerMod = isDay ? 1.01 : 1.00;

  const adjustedContact = Math.max(1, Math.min(10, Math.round(adj.contact * homeContactMod * dayContactMod)));
  const adjustedPower = Math.max(1, Math.min(10, Math.round(adj.power * homePowerMod * dayPowerMod)));

  return { ...adj, contact: adjustedContact, power: adjustedPower };
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
  // Cap hrRatio: tiny sample sizes can cause absurd inflation (e.g., 2 HR = 3.4x)
  // Also floor to prevent zeroing out power for 0-HR splits
  const cappedHRRatio = Math.max(0.4, Math.min(hrRatio, 1.8));
  const adjustedPower = Math.max(1, Math.min(10, Math.round(player.power * cappedHRRatio)));

  return { ...player, contact: adjustedContact, power: adjustedPower };
}

// --- SUBSTITUTIONS ---

// Pinch hit: replace the current batter with a bench player
export function pinchHit(state, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const isAway = newState.halfInning === 'top';
  const lineup = isAway ? newState.awayLineup : newState.homeLineup;
  const batterIdx = isAway ? newState.awayBatterIndex : newState.homeBatterIndex;
  const idx = batterIdx % lineup.length;
  const oldBatter = lineup[idx];

  const benchPlayer = {
    ...newPlayer,
    order: oldBatter.order,
    assignedPos: newPlayer.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
  };
  lineup[idx] = benchPlayer;

  // Save old batter to player history so box score retains their stats
  const historyKey = isAway ? 'awayPlayerHistory' : 'homePlayerHistory';
  if (!newState[historyKey].find(p => p.name === oldBatter.name)) {
    newState[historyKey].push({ ...oldBatter });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} pinch-hits for ${oldBatter.name}` });
  return newState;
}

// Pinch run: replace a runner on base with a bench player
export function pinchRun(state, baseIndex, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  const runner = newState.bases[baseIndex];
  if (!runner) return state;

  const isAway = newState.halfInning === 'top';
  const lineup = isAway ? newState.awayLineup : newState.homeLineup;
  const slotIdx = lineup.findIndex(p => p.name === runner.name);

  const benchPlayer = {
    ...newPlayer,
    order: runner.order,
    assignedPos: runner.assignedPos || runner.pos,
    gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
  };

  if (slotIdx >= 0) {
    lineup[slotIdx] = benchPlayer;
  }
  newState.bases[baseIndex] = benchPlayer;

  // Save old runner to player history
  const historyKey = isAway ? 'awayPlayerHistory' : 'homePlayerHistory';
  if (!newState[historyKey].find(p => p.name === runner.name)) {
    newState[historyKey].push({ ...runner });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} pinch-runs for ${runner.name}` });
  return newState;
}

// Defensive switch: change position or replace a fielder
export function defensiveSwitch(state, slotIndex, newPos, newPlayer) {
  const newState = JSON.parse(JSON.stringify(state));
  // The fielding team: during top, home fields; during bottom, away fields
  const isAwayFielding = newState.halfInning === 'bottom';
  const lineup = isAwayFielding ? newState.awayLineup : newState.homeLineup;
  const oldPlayer = lineup[slotIndex];

  if (newPlayer) {
    // Replace fielder with bench player
    const benchPlayer = {
      ...newPlayer,
      order: oldPlayer.order,
      assignedPos: newPos,
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
    };
    lineup[slotIndex] = benchPlayer;

    // Save old fielder to player history
    const historyKey = isAwayFielding ? 'awayPlayerHistory' : 'homePlayerHistory';
    if (!newState[historyKey].find(p => p.name === oldPlayer.name)) {
      newState[historyKey].push({ ...oldPlayer });
    }

    newState.log.push({ type: 'info', text: `🔄 ${newPlayer.name} replaces ${oldPlayer.name} at ${newPos}` });
  } else {
    // Just change position
    lineup[slotIndex] = { ...oldPlayer, assignedPos: newPos };
    newState.log.push({ type: 'info', text: `🔄 ${oldPlayer.name} moves to ${newPos}` });
  }

  return newState;
}

// Pitching change: replace current pitcher with a reliever
export function changePitcher(state, newPitcher) {
  const newState = JSON.parse(JSON.stringify(state));
  // During top of inning, home team is pitching; during bottom, away team is pitching
  const isHomePitching = newState.halfInning === 'top';
  const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };

  const oldPitcher = isHomePitching ? newState.homePitcher : newState.awayPitcher;
  if (isHomePitching) {
    newState.homePitcher = newP;
  } else {
    newState.awayPitcher = newP;
  }

  // Save old pitcher to player history so box score retains their stats
  const historyKey = isHomePitching ? 'homePlayerHistory' : 'awayPlayerHistory';
  const existing = newState[historyKey].find(p => p.name === oldPitcher.name);
  if (existing) {
    // Merge pitching stats into existing entry (player was already saved via pinch-hit etc.)
    existing.gameStats = {
      ...existing.gameStats,
      pitches: oldPitcher.gameStats.pitches,
      ip: oldPitcher.gameStats.ip,
      // Preserve batting SO separate; pitcher SO for K display
      pitcherSo: oldPitcher.gameStats.so,
      pitcherBB: oldPitcher.gameStats.bb,
      pitcherH: oldPitcher.gameStats.h,
      pitcherR: oldPitcher.gameStats.r,
      pitcherER: oldPitcher.gameStats.er,
    };
  } else {
    newState[historyKey].push({ ...oldPitcher });
  }

  newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound` });

  return newState;
}

// --- INTENTIONAL WALK ---
export function intentionalWalk(state) {
  const newState = JSON.parse(JSON.stringify(state));
  const batter = getCurrentBatter(newState);
  const pitcher = getCurrentPitcher(newState);

  batter.gameStats.bb++;
  pitcher.gameStats.bb++;
  pitcher.gameStats.pitches += 4; // jump pitch count for full at-bat
  const msg = `${batter.name} is intentionally walked!`;
  newState.log.push({ type: 'walk', text: msg });
  newState.lastPlay = { type: 'walk', text: msg };
  handleWalk(newState, batter);
  newState.balls = 0;
  newState.strikes = 0;
  advanceBatter(newState);
  return newState;
}

// --- CPU SUBSTITUTION LOGIC ---
// Only acts on the CPU-controlled team, never the user's team
export function cpuDecideSubstitutions(state, userTeam = 'home') {
  const newState = JSON.parse(JSON.stringify(state));
  if (newState.gameOver) return newState;

  // userTeam is a team key (e.g. 'cubs'), not 'home'/'away' — figure out which side the CPU controls
  const cpuSide = newState.homeTeam === userTeam ? 'away' : 'home';
  const cpuBattingSide = newState.halfInning === 'top' ? 'away' : 'home';
  const isCpuBatting = cpuBattingSide === cpuSide;

  if (isCpuBatting) {
    // CPU is batting — consider pinch hitting in late innings
    const cpuLineup = cpuSide === 'away' ? newState.awayLineup : newState.homeLineup;
    const cpuBench = TEAMS[cpuSide === 'away' ? newState.awayTeam : newState.homeTeam]?.bench;
    const inning = newState.inning;
    const cpuScore = newState.score[cpuSide];
    const otherTeam = cpuSide === 'away' ? 'home' : 'away';
    const trailing = cpuScore < newState.score[otherTeam];

    if (inning >= 7 && trailing && cpuBench && cpuBench.length > 0) {
      const batterIdx = cpuSide === 'away' ? newState.awayBatterIndex : newState.homeBatterIndex;
      const batter = cpuLineup[batterIdx % cpuLineup.length];
      const pitcherSpot = batter.assignedPos === 'SP' || batter.pos === 'SP';

      if (pitcherSpot) {
        const bestHitter = [...cpuBench].sort((a, b) => b.contact - a.contact)[0];
        pinchHit(newState, { ...bestHitter });
      } else if (batter.contact <= 3 && inning >= 8) {
        const bestHitter = [...cpuBench].sort((a, b) => b.contact - a.contact)[0];
        if (bestHitter.contact > batter.contact + 1) {
          pinchHit(newState, { ...bestHitter });
        }
      }
    }
    return newState;
  }

  // CPU is fielding — only handle CPU pitching changes
  const cpuPitchingSide = newState.halfInning === 'top' ? 'home' : 'away';
  // STRICT GUARD: only act if CPU team is the one pitching
  if (cpuPitchingSide !== cpuSide) return newState;

  const cpuBullpen = cpuSide === 'away' ? newState.awayBullpen : newState.homeBullpen;
  const cpuPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const pitchCount = cpuPitcher.gameStats.pitches || 0;
  const bb = cpuPitcher.gameStats.bb || 0;
  const runs = cpuPitcher.gameStats.r || 0;
  const inning = newState.inning;

  // Pull starter: 90+ pitches, or struggling badly
  const fatiguePull = pitchCount >= 90;
  const walksPull = bb >= 6;
  const blowupPull = inning < 6 && runs >= 5;
  const cpuScore = newState.score[cpuPitchingSide];
  const userScore = newState.score[cpuBattingSide];
  const lateClose = inning >= 7 && Math.abs(cpuScore - userScore) <= 2;
  const recentCollapse = (runs >= 2 && bb >= 2 && inning >= 5);

  const shouldChangePitcher = (fatiguePull || walksPull || blowupPull || lateClose || recentCollapse) && cpuBullpen.length > 0;

  if (shouldChangePitcher) {
    const sorted = [...cpuBullpen].sort((a, b) => b.control - a.control);
    const newPitcher = sorted[0];
    const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };

    const oldPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
    if (cpuPitchingSide === 'home') {
      newState.homePitcher = newP;
    } else {
      newState.awayPitcher = newP;
    }

    const bpIdx = cpuBullpen.findIndex(p => p.name === newPitcher.name);
    if (bpIdx >= 0) cpuBullpen.splice(bpIdx, 1);

    const historyKey = cpuPitchingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    if (!newState[historyKey].find(p => p.name === oldPitcher.name)) {
      newState[historyKey].push({ ...oldPitcher });
    }

    const reason = fatiguePull ? 'tired arm' : walksPull ? 'lost command' : blowupPull ? 'rough outing' : 'high-leverage situation';
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound (${reason})` });
  }

  return newState;
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };