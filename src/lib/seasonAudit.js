// Season Audit Engine - runs headless multi-day simulations and reports
// on season mode stability, realism, and known bug detection.
// Purely in-memory: no DB writes, no interference with active seasons.

import { TEAMS } from './gameData';
import { generateScheduleValidated } from './seasonSchedule';
import { simulateGameHeadless, buildGameResultFromState } from './seasonEngine';
import {
  getProbableStarter, advanceRotation, recordPitcherWorkload,
  getUnavailableRelievers, getRestDays, isPitcherAvailable,
} from './seasonStore';

// ── Realism target ranges (early season, 7-30 day tests) ──
export const REALISM_TARGETS = {
  runsPerTeamGame: { min: 3.8, max: 4.8, label: 'Runs / team / game' },
  hitsPerTeamGame: { min: 8.0, max: 9.5, label: 'Hits / team / game' },
  hrPerGame: { min: 1.3, max: 1.9, label: 'HR / game (both teams)' },
  bbPerTeamGame: { min: 2.5, max: 3.5, label: 'Walks / team / game' },
  kPerTeamGame: { min: 4.5, max: 5.8, label: 'Strikeouts / team / game' },
  sbAttemptsPerTeamGame: { min: 0.5, max: 0.9, label: 'SB attempts / team / game' },
  sbSuccessPerTeamGame: { min: 0.3, max: 0.6, label: 'Successful SB / team / game' },
  sacBuntsPerTeamGame: { min: 0.25, max: 0.55, label: 'Sac bunts / team / game' },
};

/**
 * Run a full season audit simulation.
 * @param {number} days - Number of days to simulate (7, 14, or 30)
 * @param {function} onProgress - Callback(day, totalDays, gameCount)
 * @returns {object} Audit report
 */
export async function runSeasonAudit(days, onProgress) {
  const { days: scheduleDays, errors } = generateScheduleValidated('tigers', 5);
  if (errors.length > 0) {
    return { error: 'Schedule generation failed', scheduleErrors: errors.slice(0, 10) };
  }

  const rotationState = {};
  const gamesToSim = Math.min(days, scheduleDays.length);
  const capturedGames = [];
  let gameCount = 0;

  for (let dayIdx = 0; dayIdx < gamesToSim; dayIdx++) {
    const day = scheduleDays[dayIdx];

    for (const game of day.games) {
      const homeTeam = game.home;
      const awayTeam = game.away;
      const gameDate = day.date;
      const useDH = TEAMS[homeTeam]?.league === 'AL';

      const homeSP = getProbableStarter(rotationState, homeTeam, gameDate);
      const awaySP = getProbableStarter(rotationState, awayTeam, gameDate);
      // Capture rest days BEFORE advanceRotation mutates the state.
      // The audit runs after the full sim; looking up rest days then would
      // compare against the LAST start date, not the state at game time.
      const homeRestDays = homeSP ? getRestDays(rotationState, homeTeam, homeSP.name, gameDate) : Infinity;
      const awayRestDays = awaySP ? getRestDays(rotationState, awayTeam, awaySP.name, gameDate) : Infinity;
      const unavailableRelievers = {
        home: getUnavailableRelievers(rotationState, homeTeam, gameDate),
        away: getUnavailableRelievers(rotationState, awayTeam, gameDate),
      };

      let finalState, result;
      try {
        finalState = simulateGameHeadless(homeTeam, awayTeam, {
          useDH, homeSP, awaySP, unavailableRelievers,
          rotationState, gameDate,
        });
        result = buildGameResultFromState(finalState);
      } catch (e) {
        capturedGames.push({
          day: dayIdx + 1, gameDate, homeTeam, awayTeam,
          homeSPName: homeSP?.name || null, awaySPName: awaySP?.name || null,
          error: e.message, validationFailed: true,
        });
        gameCount++;
        if (onProgress) onProgress(dayIdx + 1, gamesToSim, gameCount);
        await new Promise(r => setTimeout(r, 0));
        continue;
      }

      // Capture rest days for the ACTUAL starters (from box score), not the
      // resolver's predicted pick. The actual starter may differ if the game
      // engine swaps someone in. This lookup runs BEFORE advanceRotation
      // mutates the rotationState, so rest days reflect game-time state.
      const actualHomeSP = result?.pitching?.find(p => p.teamKey === homeTeam && p.gs === 1);
      const actualAwaySP = result?.pitching?.find(p => p.teamKey === awayTeam && p.gs === 1);
      const homeRestActual = actualHomeSP ? getRestDays(rotationState, homeTeam, actualHomeSP.name, gameDate) : Infinity;
      const awayRestActual = actualAwaySP ? getRestDays(rotationState, awayTeam, actualAwaySP.name, gameDate) : Infinity;

      capturedGames.push({
        day: dayIdx + 1, gameDate, homeTeam, awayTeam, useDH,
        homeSPName: homeSP?.name || null,
        awaySPName: awaySP?.name || null,
        restDaysAtStart: { home: homeRestActual, away: awayRestActual },
        unavailableRelievers,
        result,
        log: finalState.log || [],
        score: { home: finalState.score.home, away: finalState.score.away },
        finalHomePitcher: finalState.homePitcher?.name,
        finalAwayPitcher: finalState.awayPitcher?.name,
        homePitcherHistory: (finalState.homePlayerHistory || []).map(p => p.name),
        awayPitcherHistory: (finalState.awayPlayerHistory || []).map(p => p.name),
        ejectionFlags: {
          homePitcher: !!finalState._homePitcherEjected,
          awayPitcher: !!finalState._awayPitcherEjected,
          homeManager: !!finalState._homeManagerEjected,
          awayManager: !!finalState._awayManagerEjected,
        },
        autoEjectionPitcher: finalState._beanball?.autoEjectionPitcher || null,
        validationFailed: !!finalState._validationFailed,
        validationError: finalState._validationError || null,
      });

      if (finalState.homeStartingPitcherName) advanceRotation(rotationState, homeTeam, finalState.homeStartingPitcherName, gameDate);
      if (finalState.awayStartingPitcherName) advanceRotation(rotationState, awayTeam, finalState.awayStartingPitcherName, gameDate);
      recordPitcherWorkload(rotationState, homeTeam, result.pitching.filter(p => p.teamKey === homeTeam), gameDate);
      recordPitcherWorkload(rotationState, awayTeam, result.pitching.filter(p => p.teamKey === awayTeam), gameDate);

      gameCount++;
      if (onProgress) onProgress(dayIdx + 1, gamesToSim, gameCount);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  return analyzeAuditResults(capturedGames, rotationState);
}

// ── Main analysis orchestrator ──
function analyzeAuditResults(games, rotationState) {
  const allFlags = [];

  const boxScore = analyzeBoxScores(games, allFlags);
  const starters = analyzeStarters(games, rotationState, allFlags);
  const bullpen = analyzeBullpen(games, rotationState, allFlags);
  const offense = analyzeOffense(games, allFlags);
  const buntSqueeze = analyzeBuntSqueeze(games, allFlags);
  const events = analyzeEvents(games, allFlags);
  const outliers = analyzeOutliers(games, allFlags);

  return {
    daysSimulated: games.length > 0 ? games[games.length - 1].day : 0,
    totalGames: games.length,
    gamesWithErrors: games.filter(g => g.error || g.validationFailed).length,
    categories: { boxScore, starters, bullpen, offense, buntSqueeze, events, outliers },
    flags: allFlags,
    flagCounts: {
      critical: allFlags.filter(f => f.severity === 'critical').length,
      warning: allFlags.filter(f => f.severity === 'warning').length,
      info: allFlags.filter(f => f.severity === 'info').length,
    },
  };
}

function gameRef(g) {
  return `Day ${g.day}: ${g.awayTeam}@${g.homeTeam}`;
}

function addFlag(flags, severity, category, message, g) {
  flags.push({ severity, category, message, gameRef: g ? gameRef(g) : null });
}

// ── 1. Box Score Integrity ──
function analyzeBoxScores(games, flags) {
  let missingBoxScore = 0, blankPitching = 0, tbdWinner = 0, tbdLoser = 0, validationFailed = 0;

  for (const g of games) {
    if (g.error || g.validationFailed) { validationFailed++; continue; }
    const r = g.result;
    if (!r || !r.batting || r.batting.length === 0) {
      missingBoxScore++;
      addFlag(flags, 'critical', 'Box Score', 'Missing batting box score', g);
    }
    if (!r || !r.pitching || r.pitching.length === 0) {
      blankPitching++;
      addFlag(flags, 'critical', 'Box Score', 'Blank pitching lines', g);
    }
    if (!r?.decisions?.winner) {
      tbdWinner++;
      addFlag(flags, 'critical', 'Box Score', 'Winner is TBD', g);
    }
    if (!r?.decisions?.loser) {
      tbdLoser++;
      addFlag(flags, 'critical', 'Box Score', 'Loser is TBD', g);
    }
  }

  return { totalGames: games.length, missingBoxScore, blankPitching, tbdWinner, tbdLoser, validationFailed };
}

// ── 2. Starting Pitcher Logic ──
function analyzeStarters(games, rotationState, flags) {
  let mismatchCount = 0, shortRestCount = 0, backToBackCount = 0;
  const teamStartersByDate = {}; // { teamKey: [{ date, name }] }

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    const r = g.result;
    if (!r?.pitching) continue;

    for (const teamKey of [g.homeTeam, g.awayTeam]) {
      const resolverName = teamKey === g.homeTeam ? g.homeSPName : g.awaySPName;
      const actualStarter = r.pitching.find(p => p.teamKey === teamKey && p.gs === 1);
      const actualName = actualStarter?.name || null;

      // Mismatch: resolver says X, box score says Y
      if (resolverName && actualName && resolverName !== actualName) {
        mismatchCount++;
        addFlag(flags, 'warning', 'Starters', `Resolver said ${resolverName} but box score shows ${actualName}`, g);
      }

      // Rest days check - use captured value from sim time (before advanceRotation)
      if (actualName) {
        const restDays = teamKey === g.homeTeam
          ? (g.restDaysAtStart?.home ?? Infinity)
          : (g.restDaysAtStart?.away ?? Infinity);
        // Infinity = never started before (first start of season) - never flag
        if (restDays !== Infinity && restDays < 3) {
          const isBullpenDay = resolverName && !(TEAMS[teamKey]?.rotation || []).some(p => p.name === resolverName);
          if (!isBullpenDay) {
            shortRestCount++;
            const severity = restDays <= 1 ? 'critical' : 'warning';
            addFlag(flags, severity, 'Starters', `${actualName} started on ${restDays} day(s) rest`, g);
          }
        }

        // Back-to-back: same starter on consecutive game dates
        if (!teamStartersByDate[teamKey]) teamStartersByDate[teamKey] = [];
        const prev = teamStartersByDate[teamKey][teamStartersByDate[teamKey].length - 1];
        if (prev && prev.name === actualName) {
          backToBackCount++;
          addFlag(flags, 'critical', 'Starters', `${actualName} started back-to-back games`, g);
        }
        teamStartersByDate[teamKey].push({ date: g.gameDate, name: actualName });
      }
    }
  }

  return { mismatchCount, shortRestCount, backToBackCount };
}

// ── 3. Bullpen / Reliever Logic ──
function analyzeBullpen(games, rotationState, flags) {
  let threeStraightCount = 0, unavailableUsedCount = 0, relieverAsStarterCount = 0, reentryCount = 0;
  const appearancesByPitcher = {}; // { teamKey|name: [dates] }

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    const r = g.result;
    if (!r?.pitching) continue;
    const unavailableSet = new Set([...(g.unavailableRelievers?.home || []), ...(g.unavailableRelievers?.away || [])]);

    for (const teamKey of [g.homeTeam, g.awayTeam]) {
      const teamPitchers = r.pitching.filter(p => p.teamKey === teamKey);
      const rotationNames = new Set((TEAMS[teamKey]?.rotation || []).map(p => p.name));

      for (const p of teamPitchers) {
        const key = `${teamKey}|${p.name}`;
        if (!appearancesByPitcher[key]) appearancesByPitcher[key] = [];
        appearancesByPitcher[key].push(g.gameDate);

        // Reliever used while marked unavailable
        if (p.gs !== 1 && unavailableSet.has(p.name)) {
          unavailableUsedCount++;
          addFlag(flags, 'critical', 'Bullpen', `${p.name} pitched while marked unavailable`, g);
        }

        // Reliever used as starter (not in rotation, but got gs=1)
        if (p.gs === 1 && !rotationNames.has(p.name)) {
          // This could be a bullpen-day opener - only flag if resolver didn't pick them
          const resolverName = teamKey === g.homeTeam ? g.homeSPName : g.awaySPName;
          if (resolverName !== p.name) {
            relieverAsStarterCount++;
            addFlag(flags, 'warning', 'Bullpen', `${p.name} (reliever) started but resolver didn't pick him`, g);
          }
        }
      }

      // Re-entry: pitcher appears multiple times in substitution history
      const history = teamKey === g.homeTeam ? g.homePitcherHistory : g.awayPitcherHistory;
      const bullpenNames = new Set([...(TEAMS[teamKey]?.rotation || []).map(p => p.name), ...(TEAMS[teamKey]?.bullpen || []).map(p => p.name)]);
      const historyPitcherCounts = {};
      for (const name of history) {
        if (bullpenNames.has(name)) {
          historyPitcherCounts[name] = (historyPitcherCounts[name] || 0) + 1;
        }
      }
      for (const [name, count] of Object.entries(historyPitcherCounts)) {
        if (count > 1) {
          reentryCount++;
          addFlag(flags, 'critical', 'Bullpen', `${name} exited and re-entered the same game`, g);
        }
      }
    }
  }

  // Check 3+ straight days
  for (const [key, dates] of Object.entries(appearancesByPitcher)) {
    const sorted = [...new Set(dates)].sort();
    for (let i = 2; i < sorted.length; i++) {
      const d1 = new Date(sorted[i - 2] + 'T00:00:00Z');
      const d2 = new Date(sorted[i - 1] + 'T00:00:00Z');
      const d3 = new Date(sorted[i] + 'T00:00:00Z');
      if ((d2 - d1) === 86400000 && (d3 - d2) === 86400000) {
        threeStraightCount++;
        flags.push({ severity: 'critical', category: 'Bullpen', message: `${key.split('|')[1]} pitched 3 straight days (${sorted[i-2]} → ${sorted[i]})`, gameRef: null });
      }
    }
  }

  return { threeStraightCount, unavailableUsedCount, relieverAsStarterCount, reentryCount };
}

// ── 4. Offensive Realism ──
function analyzeOffense(games, flags) {
  let totalRuns = 0, totalHits = 0, totalBB = 0, totalK = 0, totalHR = 0;
  let totalSB = 0, totalCS = 0, totalSacBunts = 0;
  const teamGames = games.filter(g => !g.error && !g.validationFailed).length * 2;
  const totalGames = games.filter(g => !g.error && !g.validationFailed).length;

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    const r = g.result;
    if (!r?.batting) continue;

    for (const b of r.batting) {
      totalRuns += b.r || 0;
      totalHits += b.h || 0;
      totalBB += b.bb || 0;
      totalK += b.so || 0;
      totalHR += b.hr || 0;
      totalSB += b.sb || 0;
    }

    // CS and sac bunts from log
    for (const entry of (g.log || [])) {
      if (entry.type === 'caughtstealing') totalCS++;
      const t = (entry.text || '').toLowerCase();
      if ((entry.type === 'groundout' || entry.type === 'foul') && (t.includes('bunt') || t.includes('sacrifice bunt'))) {
        totalSacBunts++;
      }
    }
  }

  const stats = {
    runsPerTeamGame: teamGames > 0 ? totalRuns / teamGames : 0,
    hitsPerTeamGame: teamGames > 0 ? totalHits / teamGames : 0,
    hrPerGame: totalGames > 0 ? totalHR / totalGames : 0,
    bbPerTeamGame: teamGames > 0 ? totalBB / teamGames : 0,
    kPerTeamGame: teamGames > 0 ? totalK / teamGames : 0,
    sbAttemptsPerTeamGame: teamGames > 0 ? (totalSB + totalCS) / teamGames : 0,
    sbSuccessPerTeamGame: teamGames > 0 ? totalSB / teamGames : 0,
    sacBuntsPerTeamGame: teamGames > 0 ? totalSacBunts / teamGames : 0,
  };

  // Flag out-of-range stats
  for (const [key, value] of Object.entries(stats)) {
    const target = REALISM_TARGETS[key];
    if (!target) continue;
    if (value < target.min || value > target.max) {
      const direction = value < target.min ? 'low' : 'high';
      addFlag(flags, 'info', 'Realism', `${target.label}: ${value.toFixed(2)} (target ${target.min}-${target.max}, ${direction})`, null);
    }
  }

  return { stats, teamGames, totalGames };
}

// ── 5. Bunt / Squeeze Abuse ──
function analyzeBuntSqueeze(games, flags) {
  let highBuntGames = 0, highSqueezeGames = 0, totalBunts = 0, totalSqueezes = 0;

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    let bunts = 0, squeezes = 0;
    for (const entry of (g.log || [])) {
      // Count by metadata tags (primary method). A squeeze IS a bunt,
      // so every squeeze also increments the bunt count.
      if (entry.isSqueeze) {
        squeezes++;
        bunts++;
      } else if (entry.isBunt) {
        bunts++;
      } else {
        // Fallback: text matching for entries without tags (backward compat)
        const t = (entry.text || '').toLowerCase();
        if (t.includes('squeeze')) {
          squeezes++;
          bunts++;
        } else if (t.includes('bunt') || t.includes('sacrifice bunt')) {
          bunts++;
        }
      }
    }
    totalBunts += bunts;
    totalSqueezes += squeezes;

    if (bunts >= 6) {
      highBuntGames++;
      addFlag(flags, 'warning', 'Bunt/Squeeze', `${bunts} bunts in one game (3+ per team)`, g);
    }
    if (squeezes >= 4) {
      highSqueezeGames++;
      addFlag(flags, 'warning', 'Bunt/Squeeze', `${squeezes} squeeze attempts in one game (2+ per team)`, g);
    }
    // Flag every squeeze for review
    if (squeezes > 0) {
      addFlag(flags, 'info', 'Bunt/Squeeze', `${squeezes} squeeze attempt(s) - review for timing/runner`, g);
    }
  }

  // Hard check: squeezes cannot exceed bunts (a squeeze IS a bunt subtype)
  if (totalSqueezes > totalBunts) {
    addFlag(flags, 'critical', 'Bunt/Squeeze', `Squeeze count (${totalSqueezes}) exceeds bunt count (${totalBunts}) - classification bug`, null);
  }

  return { highBuntGames, highSqueezeGames, totalBunts, totalSqueezes };
}

// ── 6. Game Event Integrity ──
function analyzeEvents(games, flags) {
  let ejectionCount = 0, ejectedPitcherStillActive = 0, hrMissingDistance = 0, hrMissingName = 0, totalHRs = 0;

  for (const g of games) {
    if (g.error || g.validationFailed) continue;

    // Ejections
    const hasEjection = g.ejectionFlags.homePitcher || g.ejectionFlags.awayPitcher ||
                        g.ejectionFlags.homeManager || g.ejectionFlags.awayManager;
    if (hasEjection) {
      ejectionCount++;
      // Check if ejected pitcher is still the final pitcher
      if (g.ejectionFlags.homePitcher && g.autoEjectionPitcher) {
        if (g.finalHomePitcher === g.autoEjectionPitcher) {
          ejectedPitcherStillActive++;
          addFlag(flags, 'critical', 'Events', `Ejected pitcher ${g.autoEjectionPitcher} still active at game end`, g);
        }
      }
      if (g.ejectionFlags.awayPitcher && g.autoEjectionPitcher) {
        if (g.finalAwayPitcher === g.autoEjectionPitcher) {
          ejectedPitcherStillActive++;
          addFlag(flags, 'critical', 'Events', `Ejected pitcher ${g.autoEjectionPitcher} still active at game end`, g);
        }
      }
    }

    // HR treatment - all type:'homerun' entries must have distance + batterName.
    // Announcer calls are now type:'info' so they won't be caught here.
    for (const entry of (g.log || [])) {
      if (entry.type === 'homerun') {
        totalHRs++;
        if (entry.hrDistance == null) {
          hrMissingDistance++;
          addFlag(flags, 'warning', 'Events', `HR log entry missing distance: "${(entry.text || '').substring(0, 50)}"`, g);
        }
        if (entry.batterName == null) {
          hrMissingName++;
          addFlag(flags, 'warning', 'Events', `HR log entry missing batter name: "${(entry.text || '').substring(0, 50)}"`, g);
        }
      }
    }
  }

  return { ejectionCount, ejectedPitcherStillActive, hrMissingDistance, hrMissingName, totalHRs };
}

// ── 7. Score Outliers ──
function analyzeOutliers(games, flags) {
  let highRunGames = 0, highCombinedGames = 0, highHitGames = 0, highERPitchers = 0;

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    const homeScore = g.score?.home || 0;
    const awayScore = g.score?.away || 0;
    const combined = homeScore + awayScore;

    if (homeScore >= 13 || awayScore >= 13) {
      highRunGames++;
      addFlag(flags, 'warning', 'Outliers', `High score: ${awayScore}-${homeScore} (13+ runs by one team)`, g);
    }
    if (combined >= 25) {
      highCombinedGames++;
      addFlag(flags, 'warning', 'Outliers', `Combined ${combined} runs in one game`, g);
    }

    // Hits
    const r = g.result;
    if (r?.batting) {
      const homeHits = r.batting.filter(b => b.teamKey === g.homeTeam).reduce((s, b) => s + (b.h || 0), 0);
      const awayHits = r.batting.filter(b => b.teamKey === g.awayTeam).reduce((s, b) => s + (b.h || 0), 0);
      if (homeHits >= 20 || awayHits >= 20) {
        highHitGames++;
        addFlag(flags, 'warning', 'Outliers', `High hits: ${awayHits}-${homeHits} (20+ by one team)`, g);
      }
    }

    // Pitcher ER
    if (r?.pitching) {
      for (const p of r.pitching) {
        if ((p.er || 0) >= 8) {
          highERPitchers++;
          addFlag(flags, 'warning', 'Outliers', `${p.name} allowed ${p.er} earned runs`, g);
        }
      }
    }
  }

  return { highRunGames, highCombinedGames, highHitGames, highERPitchers };
}