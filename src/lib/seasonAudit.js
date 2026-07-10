// Season Audit Engine - runs headless multi-day simulations and reports
// on season mode stability, realism, and known bug detection.
// Purely in-memory: no DB writes, no interference with active seasons.

import { TEAMS } from './gameData';
import { generateScheduleValidated } from './seasonSchedule';
import { simulateGameHeadless, buildGameResultFromState } from './seasonEngine';
import {
  getProbableStarter, advanceRotation, recordPitcherWorkload,
  getUnavailableRelievers, getRestDays, isPitcherAvailable, getStarterRestDays,
  getPregameAvailability,
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
      const pregameAvailability = {
        home: getPregameAvailability(rotationState, homeTeam, gameDate),
        away: getPregameAvailability(rotationState, awayTeam, gameDate),
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

      // Capture rest data for the ACTUAL starters (from box score), not the
      // resolver's predicted pick. ALL lookups run BEFORE advanceRotation mutates
      // state, so the snapshot reflects the rotation state AT GAME TIME.
      // Uses getStarterRestDays() for bulletproof first-start detection.
      const actualHomeSP = result?.pitching?.find(p => p.teamKey === homeTeam && p.gs === 1);
      const actualAwaySP = result?.pitching?.find(p => p.teamKey === awayTeam && p.gs === 1);
      const homeRestInfo = actualHomeSP ? getStarterRestDays(rotationState, homeTeam, actualHomeSP.name, gameDate) : null;
      const awayRestInfo = actualAwaySP ? getStarterRestDays(rotationState, awayTeam, actualAwaySP.name, gameDate) : null;
      // Snapshot the FULL lastStartDateByPitcher for the team at game time
      // so the audit can see exactly what the rest calculation was based on.
      const homeStartSnapshot = { ...(rotationState[homeTeam]?.lastStartDateByPitcher || {}) };
      const awayStartSnapshot = { ...(rotationState[awayTeam]?.lastStartDateByPitcher || {}) };
      const homeRotationNames = rotationState[homeTeam]?.rotation || [];
      const awayRotationNames = rotationState[awayTeam]?.rotation || [];

      capturedGames.push({
        day: dayIdx + 1, gameDate, homeTeam, awayTeam, useDH,
        homeSPName: homeSP?.name || null,
        awaySPName: awaySP?.name || null,
        restDaysAtStart: {
          home: homeRestInfo?.restDays ?? Infinity,
          away: awayRestInfo?.restDays ?? Infinity,
        },
        starterDebug: {
          home: {
            name: actualHomeSP?.name || null,
            restDays: homeRestInfo?.restDays ?? null,
            previousStart: homeRestInfo?.previousStart ?? null,
            calendarDays: homeRestInfo?.calendarDays ?? null,
            isFirstStart: homeRestInfo?.status === 'FIRST_START',
            shortRest: homeRestInfo?.shortRest ?? false,
            rotationSlot: actualHomeSP ? (homeRotationNames.indexOf(actualHomeSP.name) + 1) || null : null,
            isRotationSP: actualHomeSP ? homeRotationNames.includes(actualHomeSP.name) : false,
            startSnapshot: homeStartSnapshot,
          },
          away: {
            name: actualAwaySP?.name || null,
            restDays: awayRestInfo?.restDays ?? null,
            previousStart: awayRestInfo?.previousStart ?? null,
            calendarDays: awayRestInfo?.calendarDays ?? null,
            isFirstStart: awayRestInfo?.status === 'FIRST_START',
            shortRest: awayRestInfo?.shortRest ?? false,
            rotationSlot: actualAwaySP ? (awayRotationNames.indexOf(actualAwaySP.name) + 1) || null : null,
            isRotationSP: actualAwaySP ? awayRotationNames.includes(actualAwaySP.name) : false,
            startSnapshot: awayStartSnapshot,
          },
        },
        unavailableRelievers,
        pregameAvailability,
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
        wasExtraInnings: (finalState.innings?.length || 9) > 9 || finalState.inning > 9,
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

      // Rest days check - use the structured debug snapshot captured at sim time.
      // The snapshot was taken BEFORE advanceRotation, so it reflects the
      // rotation state AT GAME TIME (previous start date, not today's).
      if (actualName) {
        const isHome = teamKey === g.homeTeam;
        const dbg = isHome ? g.starterDebug?.home : g.starterDebug?.away;

        // BULLETPROOF FIRST-START GUARD: if getStarterRestDays returned
        // status FIRST_START (no previous start date exists for this pitcher),
        // NEVER flag for short rest. Triple-checked to eliminate edge cases.
        const isFirstStart = dbg?.isFirstStart === true ||
                             dbg?.previousStart === null ||
                             dbg?.previousStart === undefined ||
                             dbg?.restDays === null ||
                             dbg?.restDays === Infinity;

        if (!isFirstStart && dbg?.restDays != null && dbg.restDays < 3) {
          // Skip bullpen days (non-rotation openers do not follow SP rest rules)
          const isBullpenDay = !dbg?.isRotationSP;
          if (!isBullpenDay) {
            shortRestCount++;
            const severity = dbg.restDays <= 1 ? 'critical' : 'warning';
            addFlag(flags, severity, 'Starters',
              `SHORT REST: ${actualName} (${teamKey}) started on ${dbg.restDays} day(s) rest | ` +
              `Game Day ${g.day} | Game Date ${g.gameDate} | ` +
              `Previous Start: ${dbg.previousStart || 'N/A'} | ` +
              `Calendar Days Between: ${dbg.calendarDays ?? 'N/A'} | ` +
              `Rest Days: ${dbg.restDays} | ` +
              `Is First Start: NO | ` +
              `Rotation Slot: ${dbg.rotationSlot || 'N/A'} | ` +
              `Starter Source: ${dbg.isRotationSP ? 'scheduled rotation' : 'emergency/bullpen'}`, g);
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
  let legalEmergencyCount = 0;
  const appearancesByPitcher = {}; // { teamKey|name: [dates] }

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    const r = g.result;
    if (!r?.pitching) continue;
    // Check for emergency-use log entries in this game
    const emergencyPitchersInGame = new Set();
    for (const entry of (g.log || [])) {
      const t = (entry.text || '');
      if (t.includes('EMERGENCY') && t.includes('UNAVAILABLE')) {
        const match = t.match(/:\s*(.+?)\s+enters/);
        if (match) emergencyPitchersInGame.add(match[1].trim());
      }
    }

    for (const teamKey of [g.homeTeam, g.awayTeam]) {
      const side = teamKey === g.homeTeam ? 'home' : 'away';
      const teamPitchers = r.pitching.filter(p => p.teamKey === teamKey);
      const rotationNames = new Set((TEAMS[teamKey]?.rotation || []).map(p => p.name));

      // Per-team pregame snapshot (NOT combined across both teams)
      const teamHardUnavailable = new Set(g.unavailableRelievers?.[side] || []);
      const teamEmergencyOnly = new Set(g.pregameAvailability?.[side]?.emergencyOnly || []);
      const teamLegalArms = g.pregameAvailability?.[side]?.legalArmCount ?? -1;
      const isExtra = g.wasExtraInnings || false;

      for (const p of teamPitchers) {
        const key = `${teamKey}|${p.name}`;
        if (!appearancesByPitcher[key]) appearancesByPitcher[key] = [];
        appearancesByPitcher[key].push(g.gameDate);

        // HARD_UNAVAILABLE used (should never happen except absolute last resort)
        if (p.gs !== 1 && teamHardUnavailable.has(p.name)) {
          if (emergencyPitchersInGame.has(p.name) && isExtra) {
            legalEmergencyCount++;
            addFlag(flags, 'info', 'Bullpen', `Legal emergency (extra innings): ${p.name} was HARD_UNAVAILABLE but no legal arms`, g);
          } else if (emergencyPitchersInGame.has(p.name)) {
            legalEmergencyCount++;
            addFlag(flags, 'info', 'Bullpen', `Legal emergency: ${p.name} was HARD_UNAVAILABLE, no legal arms, not extra innings`, g);
          } else {
            unavailableUsedCount++;
            addFlag(flags, 'critical', 'Bullpen', `${p.name} pitched while HARD_UNAVAILABLE (no emergency log)`, g);
          }
        }

        // EMERGENCY_ONLY used - check if legal arms were available
        if (p.gs !== 1 && teamEmergencyOnly.has(p.name)) {
          if (teamLegalArms > 0 && !isExtra) {
            unavailableUsedCount++;
            addFlag(flags, 'critical', 'Bullpen', `${p.name} (EMERGENCY_ONLY) used when ${teamLegalArms} legal arms were available`, g);
          } else {
            legalEmergencyCount++;
            addFlag(flags, 'info', 'Bullpen', `Legal emergency: ${p.name} used (EMERGENCY_ONLY), ${teamLegalArms} legal arms available, extra=${isExtra}`, g);
          }
        }

        // Reliever used as starter (not in rotation, but got gs=1)
        if (p.gs === 1 && !rotationNames.has(p.name)) {
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

  // Check 3+ straight days with debug data
  for (const [key, dates] of Object.entries(appearancesByPitcher)) {
    const sorted = [...new Set(dates)].sort();
    for (let i = 2; i < sorted.length; i++) {
      const d1 = new Date(sorted[i - 2] + 'T00:00:00Z');
      const d2 = new Date(sorted[i - 1] + 'T00:00:00Z');
      const d3 = new Date(sorted[i] + 'T00:00:00Z');
      if ((d2 - d1) === 86400000 && (d3 - d2) === 86400000) {
        const [teamKey, pitcherName] = key.split('|');
        const game3 = games.find(g => g.gameDate === sorted[i] && (g.homeTeam === teamKey || g.awayTeam === teamKey));
        const wasExtra = game3?.wasExtraInnings || false;
        const side3 = game3?.homeTeam === teamKey ? 'home' : 'away';
        const legalArms = game3?.pregameAvailability?.[side3]?.legalArmCount ?? -1;
        const emergencyOnlyArms = game3?.pregameAvailability?.[side3]?.emergencyOnly?.length ?? -1;
        const wasEmergencyOnly = (game3?.pregameAvailability?.[side3]?.emergencyOnly || []).includes(pitcherName);
        const hasEmergencyLog = (game3?.log || []).some(e => {
          const t = (e.text || '');
          return t.includes('EMERGENCY') && t.includes('UNAVAILABLE') && t.includes(pitcherName);
        });
        if (wasExtra || hasEmergencyLog) {
          legalEmergencyCount++;
          flags.push({
            severity: 'info',
            category: 'Bullpen',
            message: `Legal emergency 3-straight: ${pitcherName} (${teamKey}) pitched 3 straight days (${sorted[i-2]}, ${sorted[i-1]}, ${sorted[i]}) | Extra Innings: ${wasExtra ? 'YES' : 'NO'} | Emergency logged: ${hasEmergencyLog ? 'YES' : 'NO'} | Legal arms at game time: ${legalArms} | Emergency-only arms: ${emergencyOnlyArms}`,
            gameRef: game3 ? gameRef(game3) : null,
          });
        } else {
          threeStraightCount++;
          flags.push({
            severity: 'critical',
            category: 'Bullpen',
            message: `${pitcherName} (${teamKey}) pitched 3 straight days (${sorted[i-2]}, ${sorted[i-1]}, ${sorted[i]}) | Extra Innings: ${wasExtra ? 'YES' : 'NO'} | Legal arms at game time: ${legalArms} | Emergency-only arms: ${emergencyOnlyArms} | Was EMERGENCY_ONLY: ${wasEmergencyOnly ? 'YES' : 'NO'}`,
            gameRef: game3 ? gameRef(game3) : null,
          });
        }
      }
    }
  }

  return { threeStraightCount, unavailableUsedCount, relieverAsStarterCount, reentryCount, legalEmergencyCount };
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

  // Spread stats into top level so CategorySection renders each field
  // individually instead of showing [object Object] for the nested stats object
  return { ...stats, teamGames, totalGames };
}

// ── 5. Bunt / Squeeze Abuse ──
function analyzeBuntSqueeze(games, flags) {
  let highBuntGames = 0, highSqueezeGames = 0, totalBunts = 0, totalSqueezes = 0;

  for (const g of games) {
    if (g.error || g.validationFailed) continue;
    let bunts = 0, squeezes = 0;
    for (const entry of (g.log || [])) {
      // Count by metadata tags ONLY for squeezes (text matching caused
      // massive false positives - any commentary mentioning "squeeze" was
      // counted as a squeeze attempt).
      // Bunts use metadata tags + text fallback for untagged bunt entries.
      if (entry.isSqueeze) {
        squeezes++;
        bunts++;
      } else if (entry.isBunt) {
        bunts++;
      } else {
        // Text fallback for bunts only - NEVER count "squeeze" from text
        const t = (entry.text || '').toLowerCase();
        if (t.includes('squeeze')) {
          // Skip - squeeze text without isSqueeze tag is commentary, not an attempt
          continue;
        }
        if (t.includes('bunt') || t.includes('sacrifice bunt')) {
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

  // Hard cap: a squeeze is a bunt subtype, so squeezes can never exceed bunts.
  // This guarantees the invariant even if a code path sets isSqueeze without isBunt.
  const cappedSqueezes = Math.min(totalSqueezes, totalBunts);
  return { highBuntGames, highSqueezeGames, totalBunts, totalSqueezes: cappedSqueezes };
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