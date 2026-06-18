import { TEAMS, PITCH_TYPES, SWING_TYPES, TEAM_IDS, PLAYER_ERRORS, DEFAULT_PITCHES } from './gameData';
import { applyWeatherEffects } from './weather';
import { BALLPARKS, getBallparkEffect, getHitDirection, checkBallparkQuirk } from './ballparks';
import {
  pickLine, STRIKEOUT_LINES, WALK_LINES, INTENTIONAL_WALK_LINES,
  SINGLE_LINES, DOUBLE_LINES, TRIPLE_LINES, HOME_RUN_LINES,
  WILD_PITCH_LINES, GROUNDOUT_LINES, FLYOUT_LINES,
  DOUBLE_PLAY_LINES, END_INNING_LINES, LINEOUT_LINES,
  POPOUT_LINES, STRIKEOUT_SWINGING_LINES, STRIKEOUT_CALLED_LINES,
  BUNT_SINGLE_LINES, SACRIFICE_BUNT_LINES, SAC_FLY_LINES,
  STEAL_LINES, ERROR_LINES, FC_LINES,
} from './commentaryLines';
import { checkPitcherInjury, checkPlayInjury, getPlayerDurability } from './injuries';

// ── Pitcher Fatigue (innings-based) ──
// Stamina 10 → can go 8-9 innings. Stamina 4 (reliever) → gassed after 2 innings.
// Starters (SP): fatigueThreshold = stamina * 0.7 innings
// Relievers (RP/CL): fatigueThreshold = stamina * 0.4 innings (much sharper drop-off)
function getPitcherFatigue(inningsPitched, pitcher) {
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);
  const threshold = isReliever ? stamina * 0.4 : stamina * 0.7;

  if (inningsPitched <= threshold) return { fatigueLevel: 0, speedPen: 0, controlPen: 0, injuryMult: 1 };

  const overThreshold = inningsPitched - threshold;
  // Each inning beyond threshold adds penalties
  // Speed drops ~0.5 per inning over; Control drops ~0.7 per inning over
  const speedPen = Math.min(5, Math.round(overThreshold * 0.5));
  const controlPen = Math.min(5, Math.round(overThreshold * 0.7));
  const fatigueLevel = Math.min(4, Math.floor(overThreshold));

  // Injury multiplier increases in late innings
  const injuryMult = inningsPitched >= 8 ? 2.5 : inningsPitched >= 6 ? 1.5 : 1;

  return { fatigueLevel, speedPen, controlPen, injuryMult };
}

// Get the current pitcher with fatigue-adjusted ratings
export function getEffectivePitcher(state) {
  if (!state) return null;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher || !pitcher.stamina) return pitcher || null;

  const ip = (pitcher.gameStats?.ip || 0) + (pitcher.pitchCount || 0) * 0.03; // approximate innings from pitches
  // Better: track actual innings from gameStats.ip (already incremented per out)
  const actualIP = pitcher.gameStats?.ip || 0;
  const fatigue = getPitcherFatigue(actualIP, pitcher);

  if (fatigue.fatigueLevel === 0) return pitcher;

  return {
    ...pitcher,
    effectivePitchSpeed: Math.max(1, pitcher.pitchSpeed - fatigue.speedPen),
    effectiveControl: Math.max(1, pitcher.control - fatigue.controlPen),
    fatigueLevel: fatigue.fatigueLevel,
    fatigueSpeedPen: fatigue.speedPen,
    fatigueControlPen: fatigue.controlPen,
    injuryRiskMult: fatigue.injuryMult,
  };
}

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

    // Runners are much more aggressive with 2 outs — running on any contact
    const outsMultiplier = state.outs >= 2 ? 1.60 : (state.outs === 1 ? 1.15 : 1.0);

    for (let i = 0; i < 3; i++) {
      const runner = state.bases[i];
      if (!runner) continue;
      // Only check speed for runners who were already at this base BEFORE standard advancement
      if (preBases[i]?.name !== runner.name) continue;
      const speedFactor = runner.speed / 10;

      if (i === 0) {
        // Runner on 1st: on a single, try for 3rd; on a double, try for home
        if (bases === 2) {
          const homeChance = (0.15 + speedFactor * 0.50 - armPenalty - positioningPenalty) * outsMultiplier;
          if (Math.random() < Math.max(0.02, homeChance)) {
            runner.gameStats.runs++;
            scoreRun(state);
            rbi++;
            state.bases[0] = null;
            state.log.push({ type: 'info', text: `${runner.name} hustles all the way home from first!` });
          }
        } else if (bases === 1) {
          const thirdChance = (0.12 + speedFactor * 0.40 - armPenalty * 0.6 - positioningPenalty * 0.4) * outsMultiplier;
          if (Math.random() < Math.max(0.03, thirdChance)) {
            state.bases[2] = runner;
            state.bases[0] = null;
            state.log.push({ type: 'info', text: `${runner.name} wheels to third on the single!` });
          }
        }
      } else if (i === 1) {
        // Runner on 2nd: on a single, try for home
        // With 2 outs, runners go on any contact — extremely aggressive
        if (bases === 1) {
          const twoOutBonus = state.outs >= 2 ? 0.20 : 0;
          const homeChance = (0.28 + speedFactor * 0.55 - armPenalty - positioningPenalty + twoOutBonus) * outsMultiplier;
          if (Math.random() < Math.max(0.05, homeChance)) {
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
        cubs: `🎶 Harry Caray grabs the mic — "Take me out to the ballgame… Let's get some runs!" 🎶`,
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
  const inningEnd = pickLine(END_INNING_LINES);
  state.log.push({ type: 'info', text: `${inningEnd} ${state.halfInning === 'top' ? 'Bottom' : 'Top'} of inning ${state.inning} — ${battingTeam} batting` });
}

// --- STOLEN BASE ---
export function attemptSteal(state, baseIndex) {
  const runner = state.bases[baseIndex];
  if (!runner) return state;

  const newState = JSON.parse(JSON.stringify(state));
  const speedFactor = runner.speed / 10;
  const pitcher = getCurrentPitcher(newState);
  const effPForSteal = getEffectivePitcher(newState) || pitcher;
  const defenders = getDefensivePlayers(newState);
  const catcherArm = getCatcherArm(defenders);

  // Success based on speed + catcher arm + pitcher control + pitch speed (faster delivery = harder to steal)
  const pSpeed = effPForSteal.effectivePitchSpeed || effPForSteal.pitchSpeed;
  const pCtrl = effPForSteal.effectiveControl || effPForSteal.control;
  const pitchSpeedFactor = (pSpeed / 10) * 0.13;
  let successChance = 0.20 + speedFactor * 0.55 - (catcherArm / 10) * 0.12 - (pCtrl / 10) * 0.03 - pitchSpeedFactor;
  successChance = Math.max(0.08, Math.min(successChance, 0.80));
  const success = Math.random() < successChance;

  if (success) {
    runner.gameStats.sb = (runner.gameStats.sb || 0) + 1;
    const stealBaseNames = ['second', 'third', 'home'];
    const stealLine = pickLine(STEAL_LINES.success);
    // Move runner to next base
    if (baseIndex + 1 >= 3) {
      // Stealing home
      runner.gameStats.runs++;
      scoreRun(newState);
      newState.bases[baseIndex] = null;
      const stealMsg = `🏃 ${runner.name} ${stealLine.replace(/second|third|home/, 'home')}`;
      newState.log.push({ type: 'info', text: stealMsg });
      newState.lastPlay = { type: 'steal', text: stealMsg.replace('🏃 ', '') };
    } else {
      newState.bases[baseIndex + 1] = runner;
      newState.bases[baseIndex] = null;
      const baseName = stealBaseNames[baseIndex];
      const stealMsg = `🏃 ${runner.name} ${stealLine.replace(/second|third|home/, baseName)}`;
      newState.log.push({ type: 'info', text: stealMsg });
      newState.lastPlay = { type: 'steal', text: stealMsg.replace('🏃 ', '') };
    }
  } else {
    runner.gameStats.cs = (runner.gameStats.cs || 0) + 1;
    newState.bases[baseIndex] = null;
    recordOut(newState);
    const stealTo = baseIndex + 1;
    const baseName = stealTo === 1 ? 'second' : stealTo === 2 ? 'third' : 'home';
    const caughtLine = pickLine(STEAL_LINES.caught);
    const caughtMsg = `❌ ${runner.name} ${caughtLine.replace(/second|third|home/, baseName)}`;
    newState.log.push({ type: 'info', text: caughtMsg });
    newState.lastPlay = { type: 'caughtstealing', text: caughtMsg.replace('❌ ', '') };
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
  const effPForCpu = getEffectivePitcher(state) || pitcher;
  const armFactor = (catcherArm / 10) * 0.30; // strong arm deters steals
  const pitchFactor = ((effPForCpu.effectivePitchSpeed || effPForCpu.pitchSpeed) / 10) * 0.12;

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
  const effectiveP = getEffectivePitcher(state) || pitcher;
  pitcher.gameStats.pitches++;

  const controlFactor = effectiveP.effectiveControl
    ? effectiveP.effectiveControl / 10
    : effectiveP.control / 10;

  // Wild pitch — low control pitchers lose it, runners advance
  const effControl = effectiveP.effectiveControl || effectiveP.control;
  const wpChance = Math.max(0.008, (10 - effControl) * 0.008);
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
      const wpBase = pickLine(WILD_PITCH_LINES);
      const logMsg = scored
        ? `${wpBase} ${scored.name.split(' ').pop()} scores!${moved.length > 0 ? ' Runners advance.' : ''}`
        : `${wpBase} Runners advance!`;
      const playMsg = scored
        ? `${wpBase} — ${scored.name.split(' ').pop()} scores!`
        : wpBase;
      state.log.push({ type: 'error', text: logMsg });
      state.lastPlay = { type: 'error', text: playMsg };
    }
    state.balls++;
    return { pitchType: pitchType.name, isStrike: false, location: 'wild pitch', isWildPitch: true };
  }

  // HBP — hit by pitch
  const hbpChance = Math.max(0.002, (10 - (effectiveP.effectiveControl || effectiveP.control)) * 0.0015);
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
        const msg = `${batter.name} ${pickLine(STRIKEOUT_CALLED_LINES)}`;
        state.log.push({ type: 'strikeout', text: msg });
        state.lastPlay = { type: 'strikeout', text: msg };
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        recordOut(state);
        return;
      }
      state.log.push({ type: 'strike', text: `Strike ${state.strikes} — ${batter.name} takes a ${pitch.location} ${pitch.pitchType}` });
      state.lastPlay = { type: 'strike', text: `Strike ${state.strikes} — ${batter.name} watches it` };
      return;
    } else {
      state.balls++;
      if (state.balls >= 4) {
        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        const walkMsg = `${batter.name} ${pickLine(WALK_LINES)}`;
        state.log.push({ type: 'walk', text: walkMsg });
        state.lastPlay = { type: 'walk', text: walkMsg };
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
        const walkMsg = `${batter.name} ${pickLine(WALK_LINES)}`;
        state.log.push({ type: 'walk', text: walkMsg });
        state.lastPlay = { type: 'walk', text: walkMsg };
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
    const isPitcherHitting = batter.pos === 'SP' || batter.assignedPos === 'SP';
    const hasRunnerOn1st = !!state.bases[0];
    const canSacrifice = state.outs < 2 && hasRunnerOn1st;

    if (isPitcherHitting && canSacrifice) {
      // Pitcher sacrifice bunt: always succeeds, advance runner, batter out
      const r1 = state.bases[0];
      if (r1) {
        // Runner on 3rd scores if bases loaded
        if (state.bases[2]) {
          state.bases[2].gameStats.runs++;
          scoreRun(state);
          batter.gameStats.rbi++;
          pitcher.gameStats.r++;
          pitcher.gameStats.er++;
          state.log.push({ type: 'info', text: `${state.bases[2].name.split(' ').pop()} scores on the sacrifice` });
        }
        state.bases[2] = state.bases[1] || null; // runner from 2nd to 3rd (or empty)
        state.bases[1] = r1;                      // runner from 1st to 2nd
        state.bases[0] = null;                    // batter out at 1st
      }
      batter.gameStats.ab++;
      pitcher.gameStats.so++;
      const sacBuntLine = pickLine(SACRIFICE_BUNT_LINES);
      const msg = `${batter.name} ${sacBuntLine} ${r1?.name?.split(' ').pop()} moves to second`;
      state.log.push({ type: 'groundout', text: msg });
      state.lastPlay = { type: 'groundout', text: `Sacrifice bunt by ${batter.name}` };
      state.balls = 0;
      state.strikes = 0;
      advanceBatter(state);
      recordOut(state);
      return;
    }

    // Bunt success: Bunting skill + Speed for hit chance
    // Pitchers: nearly impossible to leg out a bunt hit
    const buntingSkill = (batter.bunting || 3) / 10;
    const speedFactor = batter.speed / 10;
    const pitcherPenalty = isPitcherHitting ? 0.02 : 1.0; // pitchers have 2% normal chance
    const buntSuccess = Math.random() < ((0.12 + buntingSkill * 0.30 + speedFactor * 0.18) * pitcherPenalty);

    if (buntSuccess) {
      batter.gameStats.ab++;
      batter.gameStats.hits++;
      pitcher.gameStats.h++;
      const rbi = advanceRunners(state, 1, batter, true);
      const buntLine = pickLine(BUNT_SINGLE_LINES);
      const msg = `${batter.name} ${buntLine}${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
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
      state.log.push({ type: 'foul', text: `${batter.name} fouls off the bunt — strike ${state.strikes}` });
      state.lastPlay = { type: 'foul', text: `Foul bunt — strike ${state.strikes}` };
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
  let contactChance = 0.38 + contactRating * 0.35;

  if (isPower) contactChance -= 0.10;
  if (isContact) contactChance += 0.12;
  if (!pitch.isStrike) contactChance -= 0.20;

  // Hit-and-run: forced to swing, contact penalty but runners go
  if (state.hitAndRun) {
    contactChance -= 0.08;
    contactChance = Math.max(0.03, contactChance); // still possible but harder
  }

  // Pitcher's off-speed and pitch speed affect contact (use effective ratings)
  const effPitcher2 = getEffectivePitcher(state) || pitcher;
  const effSpeed = effPitcher2.effectivePitchSpeed || effPitcher2.pitchSpeed;
  const pitcherDifficulty = (pitcher.offSpeed / 10) * 0.07 + (effSpeed / 10) * 0.05;
  contactChance -= pitcherDifficulty;
  contactChance = Math.max(0.05, Math.min(contactChance, 0.85));

  const madeContact = Math.random() < contactChance;

  if (!madeContact) {
    state.strikes++;
    if (state.strikes >= 3) {
      batter.gameStats.ab++;
      batter.gameStats.so++;
      pitcher.gameStats.so++;
      // Mix called vs swinging strikeouts based on pitch location
      const isLooking = pitch.location && ['outside corner', 'inside corner', 'high strike', 'low strike', 'down the middle'].includes(pitch.location) && Math.random() < 0.45;
      const strikeoutLine = isLooking
        ? pickLine(STRIKEOUT_CALLED_LINES)
        : pickLine(STRIKEOUT_SWINGING_LINES);
      const msg = strikeoutLine.includes('fans on a wicked')
        ? `${batter.name} fans on a wicked ${pitch.pitchType}!`
        : `${batter.name} ${strikeoutLine}`;
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
    // Checked swing on a ball — umpire rules it's not a swing
    if (!pitch.isStrike && Math.random() < 0.09) {
      state.balls++;
      if (state.balls >= 4) {
        batter.gameStats.bb++;
        pitcher.gameStats.bb++;
        const walkMsg = `${batter.name} ${pickLine(WALK_LINES)}`;
        state.log.push({ type: 'walk', text: walkMsg });
        state.lastPlay = { type: 'walk', text: walkMsg };
        handleWalk(state, batter);
        state.balls = 0;
        state.strikes = 0;
        advanceBatter(state);
        return;
      }
      const ballLabels = [
        `Pulled the bat back — ball ${state.balls} called`,
        `Held up — ball ${state.balls}`,
        `Checked the swing — no, he didn't go — ball ${state.balls}`,
      ];
      const ballLabel = ballLabels[Math.floor(Math.random() * ballLabels.length)];
      state.log.push({ type: 'ball', text: ballLabel });
      state.lastPlay = { type: 'ball', text: ballLabel };
      if (state.hitAndRun && !state.gameOver) {
        state.hitAndRun = false;
        handleHitAndRunMiss(state);
      }
      return;
    }

    // Mix non-strikeout strike descriptions (weighted: common first, rare last)
    const strikeLabels = [
      `Swing and a miss — strike ${state.strikes}`,
      `Checked his swing — strike ${state.strikes}`,
      `Couldn't hold up — strike ${state.strikes}`,
      `Taken at the knees — strike ${state.strikes}`,
      `Just pulled the bat back — strike ${state.strikes} called`,
      `Waves at a ${pitch.pitchType} — strike ${state.strikes}`,
      `Waves at a ${pitch.pitchType} — strike ${state.strikes}`,
      // Rare — announcer confused about a foul tip
      `Fouled off attempt — nope, swing and a miss, strike ${state.strikes}`,
    ];
    const strikeLabel = strikeLabels[Math.floor(Math.random() * strikeLabels.length)];
    state.log.push({ type: 'strike', text: strikeLabel });
    state.lastPlay = { type: 'strike', text: strikeLabel };
    if (state.hitAndRun && !state.gameOver) {
      state.hitAndRun = false;
      handleHitAndRunMiss(state);
    }
    return;
  }

  // Made contact — hit-and-run: runner was going, batter swinging
  if (state.hitAndRun) {
    state.hitAndRun = false;
    handleHitAndRunContact(state, batter, pitcher, adjBatter);
    return;
  }

  // Normal swing resolution
  batter.gameStats.ab++;

  // Foul ball
  if (Math.random() < 0.18) {
    if (state.strikes < 2) state.strikes++;
    state.log.push({ type: 'foul', text: `${batter.name} fouls it off — ${state.balls} and ${state.strikes}` });
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

  const effPitcher3 = getEffectivePitcher(state) || pitcher;
  const effCtrl2 = effPitcher3.effectiveControl || effPitcher3.control;
  hitChance -= (effCtrl2 / 10) * 0.03;

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
      const tripleLine = pickLine(TRIPLE_LINES);
      const msg = `${batter.name} ${tripleLine}${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'triple', text: msg });
      state.lastPlay = { type: 'triple', text: msg };
    } else if (hitRoll < effectivePower * 0.32 * doubleMod) {
      const rbi = advanceRunners(state, 2, batter, true);
      const doubleLine = pickLine(DOUBLE_LINES);
      const msg = `${batter.name} ${doubleLine}${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      const rbi = advanceRunners(state, 1, batter, true);
      const singleLine = pickLine(SINGLE_LINES);
      const msg = `${batter.name} ${singleLine}${rbi > 0 ? ` ${rbi} RBI!` : ''}`;
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
    // Position names for commentary — avoid "1B" / "2B" abbreviations in spoken text
    const posNames = { '1B': 'first base', '2B': 'second base', '3B': 'third base', 'SS': 'shortstop', 'SP': 'the pitcher', 'C': 'the catcher', 'LF': 'left field', 'CF': 'center field', 'RF': 'right field' };
    const batterLast = batter.name.split(' ').pop();

    // Groundout — pick position + use pool
    const groundPositions = [
      { pos: 'SS', posName: 'shortstop', text: `${batter.name} grounds out to short` },
      { pos: '2B', posName: 'second', text: `${batter.name} grounds out to second` },
      { pos: '3B', posName: 'third', text: `${batter.name} grounds out to third` },
      { pos: 'SP', posName: 'the pitcher', text: `${batter.name} grounds out to the pitcher` },
      { pos: '1B', posName: 'first', text: `${batter.name} grounds out to first` },
    ];
    const groundPos = groundPositions[Math.floor(Math.random() * groundPositions.length)];
    const groundOutText = `${batter.name} ${pickLine(GROUNDOUT_LINES)}`.replace(/grounds out to (short|second|third|the pitcher|first)/, `grounds out to ${groundPos.posName}`);
    const groundOutTypes = [
      { text: groundOutText, pos: groundPos.pos, posName: groundPos.posName, type: 'groundout' },
    ];

    // Flyout — pick position + depth + action from flyout pool
    const flyFields = { CF: ['center', 'center field'], RF: ['right', 'right field'], LF: ['left', 'left field'] };
    const depths = ['shallow ', '', 'deep ', 'the warning track in ', 'back at the wall in '];
    const flyPosKeys = ['CF', 'RF', 'LF'];
    const fPos = flyPosKeys[Math.floor(Math.random() * flyPosKeys.length)];
    const fField = flyFields[fPos];
    const depth = depths[Math.floor(Math.random() * depths.length)];
    const flyLine = pickLine(FLYOUT_LINES);
    const flyOutText = flyLine.includes('flies out to')
      ? `${batter.name} ${flyLine} ${depth}${fField[0]}`
      : flyLine.includes(' — ')
        ? `${batter.name} ${flyLine} ${depth}${fField[0]}`
        : `${batter.name} flies out — ${flyLine} ${depth}${fField[0]} — caught`;
    const flyOutTypes = [
      { text: flyOutText, pos: fPos, type: 'flyout' },
    ];

    // Lineouts and popouts from pools
    const lineoutPositions = ['3B', 'SS', '1B', '2B'];
    const loPos = lineoutPositions[Math.floor(Math.random() * lineoutPositions.length)];
    const lineoutText = `${batter.name} ${pickLine(LINEOUT_LINES)} ${defenders[loPos]?.name || posNames[loPos]}`;
    const popPositions = ['C', '2B', '3B'];
    const poPos = popPositions[Math.floor(Math.random() * popPositions.length)];
    const popoutText = pickLine(POPOUT_LINES);
    const popoutFull = popoutText.includes('pops it up') || popoutText.includes('pops one')
      ? `${batter.name} ${popoutText} ${defenders[poPos]?.name || posNames[poPos]} makes the catch`
      : `Infield pop-up — ${defenders[poPos]?.name || posNames[poPos]} ${popoutText}`;
    const otherOuts = [
      { text: popoutFull, pos: poPos, type: 'popout' },
      { text: lineoutText, pos: loPos, type: 'lineout' },
    ];

    const allOuts = [...groundOutTypes, ...flyOutTypes, ...otherOuts];
    const out = allOuts[Math.floor(Math.random() * allOuts.length)];

    // Determine if it's a fly ball (CF/RF/LF positions) or ground ball
    // Lineouts and popouts are caught in the air — NOT ground balls (no force plays)
    const isFlyBall = ['CF', 'RF', 'LF'].includes(out.pos) || out.type === 'popout' || out.type === 'lineout';
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
    const isGrounder = !isFlyBall;
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
          const errLine = pickLine(ERROR_LINES);
          const msg = `❌ ${fielder.name} ${errLine} ${batter.name} reaches on an error!`;
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
          const infieldSingle = `${batter.name} beats it out — infield single past ${fielder.name}!`;
          state.log.push({ type: 'single', text: infieldSingle });
          state.lastPlay = { type: 'single', text: infieldSingle };
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
          // Middle-infield grounders (2B, SS) → prefer 4-6-3 / 6-4-3 (force at 2nd)
          const isMiddleInfield = ['2B', 'SS'].includes(out.pos);

          if (hasForceAt3rd && !isMiddleInfield) {
            // Double play with force at 3rd (only for 3B/1B/P grounders)
            // Runner on 2nd forced at 3rd (out)
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
            state.bases[2] = null;            // runner scored + forced out at 3rd — base empty
            state.bases[1] = runner1st || null; // runner from 1st advances to 2nd
            state.bases[0] = null;               // batter out at 1st
            const msg = runner3rd
              ? `${batter.name} grounds into a double play — force at 3rd and 1st!`
              : `${batter.name} grounds into a double play — force at 3rd and 1st!`;
            state.log.push({ type: 'doubleplay', text: msg });
            state.lastPlay = { type: 'doubleplay', text: msg };
          } else {
            // Standard DP: runner on 1st forced at 2nd
            // If runner on 3rd exists, they score (DP is at 2nd + 1st, run counts)
            const runner3rdDP = state.bases[2];
            if (runner3rdDP && state.outs < 2) {
              runner3rdDP.gameStats.runs++;
              scoreRun(state);
              batter.gameStats.rbi++;
              pitcher.gameStats.r++;
              pitcher.gameStats.er++;
              state.bases[2] = null;
            }
            // If runner on 2nd exists (runners on 1st & 2nd, force at 2nd variant), they move to 3rd
            if (state.bases[1]) {
              state.bases[2] = state.bases[2] || state.bases[1];
              state.bases[1] = null;
            }
            state.bases[0] = null;
            const dpLine = pickLine(DOUBLE_PLAY_LINES);
            const dpPos = ['short', 'second', 'third', 'the pitcher'][Math.floor(Math.random() * 4)];
            const dpPartner = defenders['2B']?.name?.split(' ').pop() || 'second';
            const msg = dpLine.includes('grounds into')
              ? `${batter.name} ${dpLine}`
              : `${batter.name} grounds to ${dpPos} — flip to ${dpPartner}, relay to first — ${dpLine}`;
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
            const fcLine = pickLine(FC_LINES);
            const forcePosName = posNames[out.pos] || out.pos;
            const msg = `${batter.name} ${fcLine} ${forcePosName} — force out at 3rd! ${forcedRunner ? forcedRunner.name + ' retired' : ''}${scoreText} — batter reaches on fielder's choice.`;
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
            const fcLine2 = pickLine(FC_LINES);
            const force2PosName = posNames[out.pos] || out.pos;
            const msg = `${batter.name} ${fcLine2} ${force2PosName} — force out at 2nd! ${runnerOn1st ? runnerOn1st.name + ' retired' : ''}${scoreText} — batter reaches on fielder's choice.`;
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
      // NOTE: Only for ground balls, not lineouts (caught in the air = no force advance)
      if (hasForceAt2nd && isGrounder) {
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
          // Remove runner3rd from base so runner2nd can advance
          state.bases[2] = null;
        }
        // Shift runners (force removed at 1st, runner at 1st advances to 2nd)
        const savedR2 = state.bases[1];
        state.bases[0] = null;                    // batter out at 1st
        state.bases[1] = r1;                      // runner from 1st to 2nd
        state.bases[2] = savedR2 || state.bases[2]; // runner from 2nd to 3rd (force)
        // Only add advancement text if this wasn't the 3rd out
        if (!out.text.includes('advances') && !out.text.includes('scores')) {
          const willBeThirdOut = state.outs >= 2;
          if (!willBeThirdOut) {
            out.text = `${out.text} — ${r1.name.split(' ').pop()} advances to second`;
          }
        }
      }

      // Runner on 2nd, less than 2 outs, groundout to right side → advance to 3rd
      if (!hasForceAt2nd && state.bases[1] && !state.bases[2] && state.outs < 2 && isGrounder) {
        const runner = state.bases[1];
        const isRightSide = ['1B', '2B'].includes(out.pos);
        const speedFactor = runner.speed / 10;
        // Right-side grounders: runner on 2nd can advance to 3rd (fielder goes to 1st for the out)
        // Higher chance on right side (1B/2B), lower on left side (SS/3B) — throw is shorter
        const advanceChance = isRightSide
          ? 0.55 + speedFactor * 0.35  // right side: 55-90%
          : 0.05 + speedFactor * 0.20; // left side: 5-25%
        if (Math.random() < Math.max(0.05, advanceChance)) {
          state.bases[2] = runner;
          state.bases[1] = null;
          out.text = `${out.text} — ${runner.name.split(' ').pop()} advances to third`;
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
      const depthBonus = isDeep ? 0.30 : 0.05;
      const sacFlyChance = 0.30 + depthBonus + runnerSpeed * 0.42 - ofArm * 0.08;
      if (Math.random() < Math.max(0.10, Math.min(sacFlyChance, 0.90))) {
        runner.gameStats.runs++;
        scoreRun(state);
        state.bases[2] = null;
        batter.gameStats.rbi++;
        getCurrentPitcher(state).gameStats.r++;
        getCurrentPitcher(state).gameStats.er++;
        const sacFlyLine = pickLine(SAC_FLY_LINES);
        const msg = `${batter.name} ${sacFlyLine} ${runner.name} tags and scores!`;
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

    // ---- TAG-UP on outfield fly outs only (medium+ depth, 2nd→3rd AND 3rd→home) ----
    if (isOutfieldFly) {
      const runner3rd = state.bases[2];
      const runner2nd = state.bases[1];
      const isDeep = out.text.includes('deep ') || out.text.includes('warning track') || out.text.includes('back at the wall');

      // Runner on 3rd: always tags on deep flies, sometimes on medium depth
      if (runner3rd && state.outs < 2) {
        const speedFactor = runner3rd.speed / 10;
        const ofArm = getOutfieldArm(defenders) / 10;
        const depthBonus = isDeep ? 0.40 : 0.10;
        // Deep fly: even slow runners score. Medium: speed-dependent.
        const homeTagChance = depthBonus + speedFactor * 0.30 - ofArm * 0.08;
        if (Math.random() < Math.max(0.05, Math.min(homeTagChance, 0.65))) {
          runner3rd.gameStats.runs++;
          scoreRun(state);
          batter.gameStats.rbi++;
          getCurrentPitcher(state).gameStats.r++;
          getCurrentPitcher(state).gameStats.er++;
          state.bases[2] = null;
          state.log.push({ type: 'sacfly', text: `${runner3rd.name} tags up and scores!` });
          // After scoring, runner from 2nd can now tag to 3rd
          if (runner2nd && state.outs < 2) {
            const sf2 = runner2nd.speed / 10;
            const tag2Chance = isDeep ? (0.15 + sf2 * 0.40 - ofArm * 0.10) : (0.05 + sf2 * 0.25 - ofArm * 0.08);
            if (Math.random() < Math.max(0.03, Math.min(tag2Chance, 0.35))) {
              state.bases[2] = runner2nd;
              state.bases[1] = null;
              state.log.push({ type: 'info', text: `${runner2nd.name} tags up and advances to third!` });
            }
          }
          batter.gameStats.ab--;
          state.balls = 0;
          state.strikes = 0;
          advanceBatter(state);
          recordOut(state);
          return;
        }
      }

      // Runner on 2nd: tag to 3rd only if 3rd is open
      if (runner2nd && state.outs < 2 && !state.bases[2]) {
        const speedFactor = runner2nd.speed / 10;
        const ofArm = getOutfieldArm(defenders) / 10;
        const tagChance = 0.10 + speedFactor * 0.35 - ofArm * 0.10;
        if (Math.random() < Math.max(0.04, Math.min(tagChance, 0.35))) {
          state.bases[2] = runner2nd;
          state.bases[1] = null;
          state.log.push({ type: 'info', text: `${runner2nd.name} tags up and advances to third!` });
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
  const contactRating = adjBatter.contact / 10;
  const powerRating = adjBatter.power / 10;
  const defenders = getDefensivePlayers(state);
  const wx = applyWeatherEffects(state.weather, {});
  const hrMod = wx.hrMod || 1;
  const doubleMod = wx.doubleMod || 1;
  const posNames = { '1B': 'first', '2B': 'second', '3B': 'third', SS: 'shortstop', SP: 'the pitcher', C: 'the catcher', LF: 'left', CF: 'center', RF: 'right' };

  // Foul ball — runner goes back, at-bat continues, H&R stays on
  if (Math.random() < 0.18) {
    if (state.strikes < 2) state.strikes++;
    state.hitAndRun = true; // restore for next pitch
    state.log.push({ type: 'foul', text: `${batter.name} fouls it off on the hit-and-run — runner holds` });
    state.lastPlay = { type: 'foul', text: `Foul ball — runner goes back` };
    return;
  }

  batter.gameStats.ab++;

  // Hit vs out
  const effPitcher = getEffectivePitcher(state) || pitcher;
  let hitChance = 0.18 + contactRating * 0.28;
  hitChance -= (pitcher.offSpeed / 10) * 0.07 + ((effPitcher.effectivePitchSpeed || effPitcher.pitchSpeed) / 10) * 0.05;
  hitChance = Math.max(0.08, Math.min(hitChance, 0.68));

  if (Math.random() < hitChance) {
    // ── HIT — runners get extra base from head start ──
    batter.gameStats.hits++;
    pitcher.gameStats.h++;
    const hitRoll = Math.random();
    if (hitRoll < powerRating * 0.065 * hrMod) {
      batter.gameStats.hr++;
      advanceRunners(state, 4, batter);
      const msg = `💥 ${batter.name} crushes one on the hit-and-run — HOME RUN!`;
      state.log.push({ type: 'homerun', text: msg });
      state.lastPlay = { type: 'homerun', text: msg };
    } else if (hitRoll < powerRating * 0.32 * doubleMod) {
      advanceRunners(state, 2, batter, true);
      const extra = advanceHitAndRunRunners(state, batter);
      const msg = extra ? `${batter.name} rips a double on the hit-and-run! ${extra}` : `${batter.name} doubles on the hit-and-run!`;
      state.log.push({ type: 'double', text: msg });
      state.lastPlay = { type: 'double', text: msg };
    } else {
      advanceRunners(state, 1, batter, true);
      const extra = advanceHitAndRunRunners(state, batter);
      const msg = extra ? `${batter.name} slaps a single — hit-and-run! ${extra}` : `${batter.name} singles on the hit-and-run!`;
      state.log.push({ type: 'single', text: msg });
      state.lastPlay = { type: 'single', text: msg };
    }
  } else {
    // ── OUT — type determines runner fate ──
    const outRoll = Math.random();

    if (outRoll < 0.45) {
      // GROUND BALL — runners had head start, no DP possible, they advance
      const gPositions = ['SS', '2B', '3B', 'SP', '1B'];
      const gPos = gPositions[Math.floor(Math.random() * gPositions.length)];
      let scoredNames = [];
      for (let i = 2; i >= 0; i--) {
        const runner = state.bases[i];
        if (!runner) continue;
        if (i + 1 >= 3) {
          runner.gameStats.runs++;
          scoreRun(state);
          batter.gameStats.rbi++;
          pitcher.gameStats.r++;
          pitcher.gameStats.er++;
          scoredNames.push(runner.name.split(' ').pop());
          state.bases[i] = null;
        } else if (!state.bases[i + 1]) {
          state.bases[i + 1] = runner;
          state.bases[i] = null;
        }
      }
      const scoreText = scoredNames.length > 0 ? ` — ${scoredNames.join(', ')} scores` : '';
      const msg = `${batter.name} grounds out to ${posNames[gPos]}${scoreText} — runners advance on the hit-and-run`;
      state.log.push({ type: 'groundout', text: msg });
      state.lastPlay = { type: 'groundout', text: msg };
      recordOut(state);

    } else if (outRoll < 0.68) {
      // FLY OUT to outfield — runner was going, needs to get back
      const fPositions = ['LF', 'CF', 'RF'];
      const fPos = fPositions[Math.floor(Math.random() * fPositions.length)];
      const depthRoll = Math.random();
      const isDeep = depthRoll < 0.35;
      const isShallow = depthRoll > 0.65;
      const depthLabel = isDeep ? 'deep ' : isShallow ? 'shallow ' : '';
      const msg = `${batter.name} flies out to ${depthLabel}${posNames[fPos]}`;
      state.log.push({ type: 'flyout', text: msg });
      state.lastPlay = { type: 'flyout', text: msg };
      recordOut(state);
      if (!state.gameOver) {
        for (let i = 0; i < 3; i++) {
          const runner = state.bases[i];
          if (!runner) continue;
          if (isDeep) {
            // Deep fly: runner gets back safely, might tag from 3rd
            if (i === 2 && state.outs < 3) {
              const tagChance = 0.15 + (runner.speed / 10) * 0.40;
              if (Math.random() < tagChance) {
                runner.gameStats.runs++;
                scoreRun(state);
                batter.gameStats.rbi++;
                getCurrentPitcher(state).gameStats.r++;
                getCurrentPitcher(state).gameStats.er++;
                state.bases[i] = null;
                batter.gameStats.ab--;
                state.log.push({ type: 'sacfly', text: `${runner.name} tags and scores on the deep fly!` });
              }
            }
          } else if (isShallow) {
            // Shallow fly — runner might get doubled off based on fielder position
            let canThrow = false, throwBase = '';
            if (fPos === 'RF' && i <= 1) { canThrow = true; throwBase = i === 0 ? 'first' : 'second'; }
            else if (fPos === 'CF' && i === 1) { canThrow = true; throwBase = 'second'; }
            else if (fPos === 'LF' && i >= 1) { canThrow = true; throwBase = i === 1 ? 'second' : 'third'; }
            if (canThrow && state.outs < 3) {
              const ofArm = (defenders[fPos]?.arm || 5) / 10;
              const catchChance = 0.18 + ofArm * 0.25 - (runner.speed / 10) * 0.12;
              if (Math.random() < Math.max(0.05, Math.min(catchChance, 0.50))) {
                state.bases[i] = null;
                state.log.push({ type: 'info', text: `❌ ${runner.name} can't get back to ${throwBase} — doubled off on the hit-and-run!` });
                recordOut(state);
                break;
              }
            }
          }
          // Medium depth: runner returns safely
        }
      }

    } else if (outRoll < 0.88) {
      // LINE OUT to infielder — DANGEROUS, runner very likely doubled off
      const loPositions = ['3B', 'SS', '1B', '2B'];
      const loPos = loPositions[Math.floor(Math.random() * loPositions.length)];
      const fielder = defenders[loPos];
      const fielderName = fielder?.name || posNames[loPos];
      const msg = `${batter.name} lines out to ${fielderName}!`;
      state.log.push({ type: 'lineout', text: msg });
      state.lastPlay = { type: 'lineout', text: msg };
      recordOut(state);
      if (!state.gameOver) {
        for (let i = 0; i < 3; i++) {
          const runner = state.bases[i];
          if (!runner) continue;
          const doubleOffChance = 0.50 + ((fielder?.arm || 5) / 10) * 0.15 - (runner.speed / 10) * 0.10;
          if (state.outs < 3 && Math.random() < Math.max(0.25, Math.min(doubleOffChance, 0.75))) {
            const baseName = ['first', 'second', 'third'][i];
            state.bases[i] = null;
            state.log.push({ type: 'info', text: `❌ ${runner.name} doubled off ${baseName} — caught on the hit-and-run!` });
            recordOut(state);
            break;
          }
        }
      }

    } else {
      // POP OUT — ball goes high enough, runner has time to get back
      const poPositions = ['C', '2B', '3B'];
      const poPos = poPositions[Math.floor(Math.random() * poPositions.length)];
      const fielder = defenders[poPos];
      const fielderName = fielder?.name || posNames[poPos];
      const msg = `${batter.name} pops out to ${fielderName} — runners hold on the hit-and-run`;
      state.log.push({ type: 'popout', text: msg });
      state.lastPlay = { type: 'popout', text: msg };
      recordOut(state);
    }
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
      const hrCaughtLine = pickLine(STEAL_LINES.caught).replace(/second|third|home/, baseName);
      state.log.push({ type: 'info', text: `❌ ${runner.name} ${hrCaughtLine} on the hit-and-run!` });
      break;
    } else {
      // Runner advances despite strikeout
      if (i + 1 < 3) {
        state.bases[i + 1] = runner;
        state.bases[i] = null;
        const baseName = ['second', 'third'][i];
        const hrStealLine = pickLine(STEAL_LINES.success).replace(/second|third|home/, baseName);
        state.log.push({ type: 'info', text: `${runner.name} ${hrStealLine} on the hit-and-run!` });
      }
    }
  }
  // Reset hit-and-run after resolution — prevents cascading attempts
  state.hitAndRun = false;
}

// Runner was going on hit-and-run but batter missed — treat as steal attempt
function handleHitAndRunMiss(state) {
  for (let i = 0; i < 2; i++) {
    const runner = state.bases[i];
    if (!runner || state.bases[i + 1]) continue;
    const speedFactor = runner.speed / 10;
    const defenders = getDefensivePlayers(state);
    const catcherArm = getCatcherArm(defenders);
    const successChance = 0.20 + speedFactor * 0.55 - (catcherArm / 10) * 0.12;
    const baseName = i === 0 ? 'second' : 'third';
    if (Math.random() < Math.max(0.10, Math.min(successChance, 0.75))) {
      runner.gameStats.sb = (runner.gameStats.sb || 0) + 1;
      state.bases[i + 1] = runner;
      state.bases[i] = null;
      const stealLine = pickLine(STEAL_LINES.success).replace(/second|third|home/, baseName);
      state.log.push({ type: 'info', text: `${runner.name} ${stealLine} on the hit-and-run` });
    } else {
      runner.gameStats.cs = (runner.gameStats.cs || 0) + 1;
      state.bases[i] = null;
      const caughtLine = pickLine(STEAL_LINES.caught).replace(/second|third|home/, baseName);
      state.log.push({ type: 'info', text: `❌ ${runner.name} ${caughtLine} on the hit-and-run!` });
      recordOut(state);
    }
    break;
  }
}

// --- PROCESS AT BAT ---

// Run injury checks after a play — modifies state in place
function runInjuryChecks(newState, batter) {
  const lastPlay = newState.lastPlay;
  if (!lastPlay) return;

  switch (lastPlay.type) {
    case 'walk': {
      // HBP → check batter for hand/wrist/rib injury
      if (lastPlay.text?.includes('hit by the pitch')) {
        const hbpResult = checkPlayInjury(newState, 'hit_by_pitch', batter.name);
        if (hbpResult) {
          newState.lastInjury = hbpResult;
          applyInjuryState(newState, hbpResult);
          newState.log.push({ type: 'injury', text: `🚑 ${hbpResult.commentary}` });
        }
      }
      break;
    }
    case 'steal': {
      const runner = newState.bases.find(b => b && b.name !== batter.name) || batter;
      const stealResult = checkPlayInjury(newState, 'steal_success', runner.name);
      if (stealResult) {
        newState.lastInjury = stealResult;
        applyInjuryState(newState, stealResult);
        newState.log.push({ type: 'injury', text: `🚑 ${stealResult.commentary}` });
      }
      break;
    }
    case 'caughtstealing': {
      const csRunner = newState.bases.find(b => b) || batter;
      const csResult = checkPlayInjury(newState, 'steal_attempt', csRunner.name);
      if (csResult) {
        newState.lastInjury = csResult;
        applyInjuryState(newState, csResult);
        newState.log.push({ type: 'injury', text: `🚑 ${csResult.commentary}` });
      }
      break;
    }
    case 'homerun': {
      const hrResult = checkPlayInjury(newState, 'homerun', batter.name);
      if (hrResult) {
        newState.lastInjury = hrResult;
        applyInjuryState(newState, hrResult);
        newState.log.push({ type: 'injury', text: `🚑 ${hrResult.commentary}` });
      }
      break;
    }
    case 'single':
    case 'double':
    case 'triple': {
      const hitResult = checkPlayInjury(newState, 'sprint_to_first', batter.name);
      if (hitResult) {
        newState.lastInjury = hitResult;
        applyInjuryState(newState, hitResult);
        newState.log.push({ type: 'injury', text: `🚑 ${hitResult.commentary}` });
      }
      break;
    }
    case 'error': {
      const errResult = checkPlayInjury(newState, 'sprint_to_first', batter.name);
      if (errResult) {
        newState.lastInjury = errResult;
        applyInjuryState(newState, errResult);
        newState.log.push({ type: 'injury', text: `🚑 ${errResult.commentary}` });
      }
      break;
    }
    default:
      break;
  }
}

// Mark a player as injured and auto-substitute them out
function applyInjuryState(newState, injuryResult) {
  if (!injuryResult) return;
  const playerName = injuryResult.player;

  // Determine which team the player is on
  const awayIdx = newState.awayLineup.findIndex(p => p.name === playerName);
  const homeIdx = newState.homeLineup.findIndex(p => p.name === playerName);
  const isAway = awayIdx >= 0;
  const targetLineup = isAway ? newState.awayLineup : newState.homeLineup;
  const targetIdx = isAway ? awayIdx : homeIdx;
  const teamKey = isAway ? newState.awayTeam : newState.homeTeam;
  const teamData = TEAMS[teamKey];
  const bench = teamData?.bench || [];
  const bullpen = isAway ? newState.awayBullpen : newState.homeBullpen;

  // If not in either starting lineup, check player history
  if (targetLineup && targetIdx >= 0) {
    const injuredPlayer = targetLineup[targetIdx];
    const isPitcher = injuredPlayer.pos === 'SP' || injuredPlayer.pos === 'RP' || injuredPlayer.pos === 'CL' ||
                      (injuredPlayer.assignedPos && ['SP','RP','CL'].includes(injuredPlayer.assignedPos));
    const isCurrentBatter = (isAway && newState.awayBatterIndex % newState.awayLineup.length === targetIdx) ||
                            (!isAway && newState.homeBatterIndex % newState.homeLineup.length === targetIdx);

    // Save to player history before replacing
    const historyKey = isAway ? 'awayPlayerHistory' : 'homePlayerHistory';
    if (!newState[historyKey].find(p => p.name === playerName)) {
      newState[historyKey].push({ ...injuredPlayer, injured: true, injuryType: injuryResult.severity, injuryName: injuryResult.injury.name });
    }

    // Auto-substitute based on player role
    if (isPitcher && bullpen.length > 0) {
      // Pitcher injured → replace with best reliever
      const bestRP = [...bullpen].sort((a, b) => b.control - a.control)[0];
      const newP = { ...bestRP, pitchCount: 0, pitches: bestRP.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
      if (isAway) {
        newState.awayPitcher = newP;
      } else {
        newState.homePitcher = newP;
      }
      const bpIdx = bullpen.findIndex(p => p.name === bestRP.name);
      if (bpIdx >= 0) bullpen.splice(bpIdx, 1);
      targetLineup[targetIdx] = { ...bestRP, order: injuredPlayer.order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      newState.log.push({ type: 'info', text: `🚑 ${playerName} injured — ${bestRP.name} takes the mound` });
    } else if (isCurrentBatter && bench.length > 0) {
      // Injured batter → pinch hit
      const bestPH = [...bench].sort((a, b) => b.contact - a.contact)[0];
      targetLineup[targetIdx] = { ...bestPH, order: injuredPlayer.order, assignedPos: bestPH.pos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      newState.log.push({ type: 'info', text: `🚑 ${playerName} injured — ${bestPH.name} pinch-hits` });
    } else if (bench.length > 0) {
      // Injured fielder → defensive replacement
      const bestSub = [...bench].sort((a, b) => b.defense - a.defense)[0];
      const oldPos = injuredPlayer.assignedPos || injuredPlayer.pos;
      targetLineup[targetIdx] = { ...bestSub, order: injuredPlayer.order, assignedPos: oldPos, gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      newState.log.push({ type: 'info', text: `🚑 ${playerName} injured — ${bestSub.name} takes over at ${oldPos}` });
    } else {
      // No bench available — just mark injured
      targetLineup[targetIdx] = { ...injuredPlayer, injured: true, injuryType: injuryResult.severity, injuryName: injuryResult.injury.name };
    }
  }

  // Also mark in pitcher state if the injured player was the pitcher
  if (newState.homePitcher?.name === playerName && newState.homePitcher) {
    if (!newState.homePitcher.injured) {
      newState.homePitcher = { ...newState.homePitcher, injured: true, injuryType: injuryResult.severity };
    }
  }
  if (newState.awayPitcher?.name === playerName && newState.awayPitcher) {
    if (!newState.awayPitcher.injured) {
      newState.awayPitcher = { ...newState.awayPitcher, injured: true, injuryType: injuryResult.severity };
    }
  }
}

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
  const effPForWalk = getEffectivePitcher(newState) || pitcher;
  const batter = getCurrentBatter(newState);
  const walkCtrl = effPForWalk.effectiveControl || effPForWalk.control;
  const walkChance = Math.max(0.01, (10 - walkCtrl) * 0.005);
  if (Math.random() < walkChance) {
    batter.gameStats.bb++;
    pitcher.gameStats.bb++;
    pitcher.gameStats.pitches += 4; // jump pitch count for full at-bat
    const walkMsg = `${batter.name} ${pickLine(WALK_LINES)}`;
    newState.log.push({ type: 'walk', text: walkMsg });
    newState.lastPlay = { type: 'walk', text: walkMsg };
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

  // Track distinct pitch types used by the user (for One-Pitch Wonder achievement)
  if (!newState.userPitchTypes) newState.userPitchTypes = [];
  if (!newState.userPitchTypes.includes(pitchType.name)) {
    newState.userPitchTypes = [...newState.userPitchTypes, pitchType.name];
  }

  // Wild pitch resolved entirely in resolvePitch — skip swing, just check for walk
  if (newState.pitchResult.isWildPitch) {
    if (newState.balls >= 4) {
      const walkBatter = getCurrentBatter(newState);
      walkBatter.gameStats.bb++;
      getCurrentPitcher(newState).gameStats.bb++;
      const wpWalkMsg = `${walkBatter.name} walks on a wild pitch!`;
      newState.log.push({ type: 'walk', text: wpWalkMsg });
      newState.lastPlay = { type: 'walk', text: wpWalkMsg };
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
    const hbpMsg = `${hbpBatter.name} is hit by the pitch!`;
    newState.log.push({ type: 'walk', text: hbpMsg });
    newState.lastPlay = { type: 'walk', text: hbpMsg + ' — takes first' };
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

  const batterWhoJustBatted = getCurrentBatter(newState);

  resolveSwing(newState, swingType, newState.pitchResult);

  // Walk-off check
  if (newState.halfInning === 'bottom' && newState.inning >= 9 && newState.score.home > newState.score.away && !newState.gameOver) {
    newState.gameOver = true;
    newState.waitingForInput = false;
    newState.log.push({ type: 'info', text: `🎉 Walk-off! ${home.name} win ${newState.score.home}-${newState.score.away}!` });
  }

  // Run injury checks after the play resolves (use the batter who actually batted)
  if (!newState.gameOver) {
    runInjuryChecks(newState, batterWhoJustBatted);
  }

  // Pitcher fatigue injury check (only if no injury happened this play)
  if (!newState.gameOver && !newState.lastInjury) {
    const pInjury = checkPitcherInjury(newState);
    if (pInjury) {
      newState.lastInjury = pInjury;
      applyInjuryState(newState, pInjury);
      newState.log.push({ type: 'injury', text: `🚑 ${pInjury.commentary}` });
    }
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

  // Remove reliever from the bullpen
  const bullpen = isHomePitching ? newState.homeBullpen : newState.awayBullpen;
  const bpIdx = bullpen.findIndex(p => p.name === newPitcher.name);
  if (bpIdx >= 0) bullpen.splice(bpIdx, 1);

  // Swap the new pitcher into the fielding lineup (replace old pitcher's batting slot)
  const lineup = isHomePitching ? newState.homeLineup : newState.awayLineup;
  const oldPitcherSlot = lineup.findIndex(p => p.name === oldPitcher.name);
  if (oldPitcherSlot >= 0) {
    lineup[oldPitcherSlot] = {
      ...newPitcher,
      order: lineup[oldPitcherSlot].order,
      assignedPos: 'SP',
      gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
    };
  } else if (oldPitcher.order) {
    // Pitcher was pinch-hit for — find their original slot by order number (don't create a new slot)
    const slotByOrder = lineup.findIndex(p => p.order === oldPitcher.order);
    if (slotByOrder >= 0) {
      lineup[slotByOrder] = {
        ...newPitcher,
        order: oldPitcher.order,
        assignedPos: 'SP',
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
      };
    }
  }

  // Save old pitcher to player history so box score retains their stats
  const historyKey = isHomePitching ? 'homePlayerHistory' : 'awayPlayerHistory';
  const existing = newState[historyKey].find(p => p.name === oldPitcher.name);
  if (existing) {
    existing.gameStats = {
      ...existing.gameStats,
      pitches: oldPitcher.gameStats.pitches,
      ip: oldPitcher.gameStats.ip,
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
  const ibbMsg = `${batter.name} — ${pickLine(INTENTIONAL_WALK_LINES)}`;
  newState.log.push({ type: 'walk', text: ibbMsg });
  newState.lastPlay = { type: 'walk', text: ibbMsg };
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
        const afterPinchHit = pinchHit(newState, { ...bestHitter });
        // Apply the pinch-hit result to newState
        if (isCpuBatting) {
          if (cpuSide === 'away') {
            newState.awayLineup = afterPinchHit.awayLineup;
            newState.awayBatterIndex = afterPinchHit.awayBatterIndex;
            if (!newState.awayPlayerHistory) newState.awayPlayerHistory = [];
            afterPinchHit.awayPlayerHistory?.forEach(p => {
              if (!newState.awayPlayerHistory.find(h => h.name === p.name)) newState.awayPlayerHistory.push(p);
            });
            newState.log = afterPinchHit.log;
          } else {
            newState.homeLineup = afterPinchHit.homeLineup;
            newState.homeBatterIndex = afterPinchHit.homeBatterIndex;
            if (!newState.homePlayerHistory) newState.homePlayerHistory = [];
            afterPinchHit.homePlayerHistory?.forEach(p => {
              if (!newState.homePlayerHistory.find(h => h.name === p.name)) newState.homePlayerHistory.push(p);
            });
            newState.log = afterPinchHit.log;
          }
        }
      } else if (batter.contact <= 3 && inning >= 8) {
        const bestHitter = [...cpuBench].sort((a, b) => b.contact - a.contact)[0];
        if (bestHitter.contact > batter.contact + 1) {
          const afterPinchHit2 = pinchHit(newState, { ...bestHitter });
          if (cpuSide === 'away') {
            newState.awayLineup = afterPinchHit2.awayLineup;
            newState.awayBatterIndex = afterPinchHit2.awayBatterIndex;
            if (!newState.awayPlayerHistory) newState.awayPlayerHistory = [];
            afterPinchHit2.awayPlayerHistory?.forEach(p => {
              if (!newState.awayPlayerHistory.find(h => h.name === p.name)) newState.awayPlayerHistory.push(p);
            });
            newState.log = afterPinchHit2.log;
          } else {
            newState.homeLineup = afterPinchHit2.homeLineup;
            newState.homeBatterIndex = afterPinchHit2.homeBatterIndex;
            if (!newState.homePlayerHistory) newState.homePlayerHistory = [];
            afterPinchHit2.homePlayerHistory?.forEach(p => {
              if (!newState.homePlayerHistory.find(h => h.name === p.name)) newState.homePlayerHistory.push(p);
            });
            newState.log = afterPinchHit2.log;
          }
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

  // Auto-replace CPU pitcher if they were pinch-hit for (DH off only)
  const cpuLineupField = cpuSide === 'away' ? newState.awayLineup : newState.homeLineup;
  const cpuPitcherField = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const pitcherInLineup = cpuLineupField.some(p => p.name === cpuPitcherField.name);
  if (!pitcherInLineup && cpuBullpen.length > 0) {
    const sorted = [...cpuBullpen].sort((a, b) => b.control - a.control);
    const newPitcher = sorted[0];
    const newP = { ...newPitcher, pitchCount: 0, pitches: newPitcher.pitches || DEFAULT_PITCHES, gameStats: { ip: 0, h: 0, r: 0, er: 0, bb: 0, so: 0, pitches: 0 } };
    const oldP = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
    if (cpuPitchingSide === 'home') newState.homePitcher = newP;
    else newState.awayPitcher = newP;
    const bpIdx = cpuBullpen.findIndex(p => p.name === newPitcher.name);
    if (bpIdx >= 0) cpuBullpen.splice(bpIdx, 1);
    const historyKey = cpuPitchingSide === 'home' ? 'homePlayerHistory' : 'awayPlayerHistory';
    if (!newState[historyKey].find(p => p.name === oldP.name)) newState[historyKey].push({ ...oldP });
    // Replace the pinch hitter (or old pitcher's slot) instead of pushing a new slot
    const slotByOrder = cpuLineupField.findIndex(p => p.order === oldP.order);
    if (slotByOrder >= 0) {
      cpuLineupField[slotByOrder] = { ...newPitcher, order: oldP.order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    }
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldP.name} on the mound (pinch-hit for earlier)` });
    return newState;
  }

  const cpuPitcher = cpuPitchingSide === 'home' ? newState.homePitcher : newState.awayPitcher;
  const ip = cpuPitcher.gameStats.ip || 0;
  const bb = cpuPitcher.gameStats.bb || 0;
  const runs = cpuPitcher.gameStats.r || 0;
  const inning = newState.inning;
  const stamina = cpuPitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(cpuPitcher.pos) || ['RP', 'CL'].includes(cpuPitcher.assignedPos);
  const maxInnings = isReliever ? stamina * 0.4 : stamina * 0.7;

  // Pull logic based on innings vs stamina
  const fatiguePull = ip >= maxInnings + 0.5; // half inning past threshold
  const walksPull = bb >= 5;
  const blowupPull = inning < 6 && runs >= 5;
  const cpuScore = newState.score[cpuPitchingSide];
  const userScore = newState.score[cpuBattingSide];
  const lateClose = inning >= 7 && Math.abs(cpuScore - userScore) <= 2 && ip >= 2;
  const recentCollapse = (runs >= 2 && bb >= 2 && inning >= 5);
  const severeFatigue = ip >= maxInnings + 2; // 2 innings past threshold = must pull

  const shouldChangePitcher = (severeFatigue || fatiguePull || walksPull || blowupPull || lateClose || recentCollapse) && cpuBullpen.length > 0;

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

    const reason = severeFatigue ? 'completely gassed' : fatiguePull ? `${ip} innings — arm is tiring` : walksPull ? 'lost command' : blowupPull ? 'rough outing' : 'high-leverage situation';
    newState.log.push({ type: 'info', text: `🔄 ${newPitcher.name} replaces ${oldPitcher.name} on the mound (${reason})` });

    // Update the batting lineup so the new pitcher replaces the old one's spot
    const fieldLineup = cpuPitchingSide === 'home' ? newState.homeLineup : newState.awayLineup;
    const oldSlot = fieldLineup.findIndex(p => p.name === oldPitcher.name);
    if (oldSlot >= 0) {
      fieldLineup[oldSlot] = { ...newPitcher, order: fieldLineup[oldSlot].order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
    } else if (oldPitcher.order) {
      const slotByOrder = fieldLineup.findIndex(p => p.order === oldPitcher.order);
      if (slotByOrder >= 0) {
        fieldLineup[slotByOrder] = { ...newPitcher, order: oldPitcher.order, assignedPos: 'SP', gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 } };
      }
    }
  }

  return newState;
}

export { getCurrentBatter, getCurrentPitcher, getBattingTeam };