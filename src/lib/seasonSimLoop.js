// seasonSimLoop.js - Shared simulation loop for Season Mode.
// Extracted to avoid duplicating the 80-line sim loop across multiple functions.

import { base44 } from '@/api/base44Client';
import { TEAMS } from './gameData';
import { simulateGameHeadless, buildGameResultFromState, validateCompletedGame } from './seasonEngine';
import {
  loadRotationStateForActiveSeason, persistRotationState,
  getProbableStarter, advanceRotation, recordPitcherWorkload,
  getUnavailableRelievers, commitPlayerStats, maybeAdvanceDay,
} from './seasonStore';
import { loadActiveInjuries, buildInjuredRoster, runDailyRecovery, resolveStarterSkippingInjuries, getInjuredPitcherNames, recordInjury } from './injuryPersistence';
import { decrementTeamSuspensions } from './managerSuspension';
import { loadActivePlayerSuspensions, buildSuspendedPlayerSet, decrementPlayerSuspensions } from './playerDiscipline';
import { evaluateGameComplete } from './seasonAchievements/achievementEngine';
import { recordInjuryTxn } from './transactionLog';

/**
 * Simulate all non-final games from the current day up to (but not including) targetGameDay.
 * @param {number} targetGameDay - Stop before this day (exclusive)
 * @param {object} seasonObj - The season entity
 * @param {function} onProgress - Callback for progress updates (string | null)
 */
export async function simGamesToDay(targetGameDay, seasonObj, onProgress) {
  let currentDay = seasonObj.currentGameDay || 1;
  if (currentDay >= targetGameDay) return;

  const rotState = await loadRotationStateForActiveSeason();
  let dayInjuries = await loadActiveInjuries(seasonObj.id);
  let dayPlayerSuspensions = await loadActivePlayerSuspensions(seasonObj.id);
  const simInjuries = [];

  while (currentDay < targetGameDay) {
    onProgress?.(`Simulating day ${currentDay} of ${targetGameDay - 1}...`);

    const daySchedule = await base44.entities.Schedule.filter({
      seasonId: seasonObj.id, gameDay: currentDay,
    });

    const toSim = daySchedule.filter(g => g.status !== 'final');
    if (toSim.length === 0) {
      const offDate = daySchedule[0]?.gameDate || seasonObj.currentDate;
      await runDailyRecovery(seasonObj.id, offDate);
      dayInjuries = await loadActiveInjuries(seasonObj.id);
      currentDay++; continue;
    }

    const existingStats = await base44.entities.PlayerStats.filter({ seasonId: seasonObj.id }, null, 1500);
    const statsAccum = {};
    for (const s of existingStats) {
      statsAccum[`${s.team}|${s.playerName}`] = {
        hr: s.homeRuns || 0, doubles: s.doubles || 0,
        triples: s.triples || 0, rbi: s.rbi || 0, sb: s.stolenBases || 0,
      };
    }

    const resultRows = [];
    const allBatting = [];
    const allPitching = [];

    for (const g of toSim) {
      const homeTeam = g.homeTeam;
      const awayTeam = g.awayTeam;
      const useDH = TEAMS[homeTeam]?.league === 'AL';
      const homeSP = resolveStarterSkippingInjuries(getProbableStarter(rotState, homeTeam, g.gameDate), homeTeam, dayInjuries);
      const awaySP = resolveStarterSkippingInjuries(getProbableStarter(rotState, awayTeam, g.gameDate), awayTeam, dayInjuries);
      const homeRoster = buildInjuredRoster(homeTeam, dayInjuries);
      const awayRoster = buildInjuredRoster(awayTeam, dayInjuries);
      // Add suspended players to the scratched list so they can't play
      const suspendedNames = buildSuspendedPlayerSet(dayPlayerSuspensions, new Set([homeTeam, awayTeam]));
      const allScratched = [...new Set([...homeRoster.scratchedPlayers, ...awayRoster.scratchedPlayers, ...suspendedNames])];
      const unavailableRelievers = {
        home: [...getUnavailableRelievers(rotState, homeTeam, g.gameDate), ...getInjuredPitcherNames(dayInjuries, homeTeam)],
        away: [...getUnavailableRelievers(rotState, awayTeam, g.gameDate), ...getInjuredPitcherNames(dayInjuries, awayTeam)],
      };

      const finalState = simulateGameHeadless(homeTeam, awayTeam, {
        useDH, homeSP, awaySP, unavailableRelievers, rotationState: rotState, gameDate: g.gameDate,
        homeLineup: homeRoster.lineup, awayLineup: awayRoster.lineup, scratchedPlayers: allScratched,
      });

      if (finalState._tracking?.injuriesOccurred) {
        for (const inj of finalState._tracking.injuriesOccurred) {
          simInjuries.push({ ...inj, gameDate: g.gameDate });
        }
      }
      if (finalState._validationFailed) {
        throw new Error(`Sim stall for ${awayTeam}@${homeTeam}: ${finalState._validationError}`);
      }

      const result = buildGameResultFromState(finalState, { headless: true });
      validateCompletedGame({
        status: 'FINAL', gameId: g.id, awayTeam, homeTeam,
        boxScore: result,
        winningPitcherId: result.decisions?.winner || null,
        losingPitcherId: result.decisions?.loser || null,
      });

      allBatting.push(...result.batting);
      allPitching.push(...result.pitching);

      if (finalState.homeStartingPitcherName) advanceRotation(rotState, homeTeam, finalState.homeStartingPitcherName, g.gameDate);
      if (finalState.awayStartingPitcherName) advanceRotation(rotState, awayTeam, finalState.awayStartingPitcherName, g.gameDate);
      recordPitcherWorkload(rotState, homeTeam, result.pitching.filter(p => p.teamKey === homeTeam), g.gameDate);
      recordPitcherWorkload(rotState, awayTeam, result.pitching.filter(p => p.teamKey === awayTeam), g.gameDate);

      const winnerName = result.decisions.winner ? result.decisions.winner.split('|')[1] : null;
      const loserName = result.decisions.loser ? result.decisions.loser.split('|')[1] : null;
      const saveName = result.decisions.save ? result.decisions.save.split('|')[1] : null;
      const homeHRs = result.homeRuns.filter(hr => hr.teamKey === homeTeam).map(hr => ({ playerName: hr.name, inning: hr.inning }));
      const awayHRs = result.homeRuns.filter(hr => hr.teamKey === awayTeam).map(hr => ({ playerName: hr.name, inning: hr.inning }));
      const homeHits = result.batting.filter(b => b.teamKey === homeTeam).reduce((s, b) => s + b.h, 0);
      const awayHits = result.batting.filter(b => b.teamKey === awayTeam).reduce((s, b) => s + b.h, 0);

      const gameSeasonTotals = {};
      for (const b of result.batting) {
        const key = `${b.teamKey}|${b.name}`;
        if (!statsAccum[key]) statsAccum[key] = { hr: 0, doubles: 0, triples: 0, rbi: 0, sb: 0 };
        statsAccum[key].hr += b.hr || 0;
        statsAccum[key].doubles += b.doubles || 0;
        statsAccum[key].triples += b.triples || 0;
        statsAccum[key].rbi += b.rbi || 0;
        statsAccum[key].sb += b.sb || 0;
        if ((b.hr || 0) > 0 || (b.doubles || 0) > 0 || (b.triples || 0) > 0 || (b.rbi || 0) > 0 || (b.sb || 0) > 0) {
          gameSeasonTotals[b.playerId] = { ...statsAccum[key] };
        }
      }
      result.seasonTotals = gameSeasonTotals;

      resultRows.push({
        seasonId: seasonObj.id, gameDay: currentDay, gameDate: g.gameDate, boxScore: result,
        homeTeam, awayTeam,
        homeScore: result.homeScore, awayScore: result.awayScore, winner: result.winner,
        isUserGame: g.isUserGame, homeHits, awayHits, homeHRs, awayHRs,
        homeErrors: result.homeErrors || 0, awayErrors: result.awayErrors || 0,
        winningPitcher: winnerName, losingPitcher: loserName, savePitcher: saveName,
        stadium: TEAMS[homeTeam]?.stadium || null,
        innings: result.innings?.map(inn => ({ home: inn.home || 0, away: inn.away || 0 })) || [],
      });

      // Evaluate achievements for games involving the user's team (silent during batch sim)
      if (homeTeam === seasonObj.userTeam || awayTeam === seasonObj.userTeam) {
        try {
          await evaluateGameComplete(seasonObj.id, seasonObj.userTeam, result, finalState, g.isUserGame, seasonObj, { silent: true });
        } catch (e) { /* non-fatal — never break sim */ }
      }

      await new Promise(r => setTimeout(r, 0));
      }

      await commitPlayerStats(seasonObj.id, allBatting, allPitching);
    await persistRotationState(seasonObj.id, rotState);

    if (resultRows.length > 0) {
      const CHUNK = 50;
      for (let i = 0; i < resultRows.length; i += CHUNK) {
        await Promise.all(resultRows.slice(i, i + CHUNK).map(r => base44.entities.GameResult.create(r)));
      }
    }

    for (const g of toSim) {
      try { await base44.entities.Schedule.update(g.id, { status: 'final' }); } catch (e) { /* non-fatal */ }
    }

    // Decrement player suspensions for teams that played today
    const playerTeamsPlayed = new Set();
    for (const g of toSim) {
      playerTeamsPlayed.add(g.homeTeam);
      playerTeamsPlayed.add(g.awayTeam);
    }
    for (const g of daySchedule) {
      if (g.status === 'final') {
        playerTeamsPlayed.add(g.homeTeam);
        playerTeamsPlayed.add(g.awayTeam);
      }
    }
    if (playerTeamsPlayed.size > 0) {
      await decrementPlayerSuspensions(seasonObj.id, playerTeamsPlayed, todayDate);
      dayPlayerSuspensions = await loadActivePlayerSuspensions(seasonObj.id);
    }

    await base44.entities.Season.update(seasonObj.id, {
      completedGames: (seasonObj.completedGames || 0) + resultRows.length,
    });
    await maybeAdvanceDay({ ...seasonObj, currentGameDay: currentDay, id: seasonObj.id });

    // Persist injuries that occurred during headless sim + run daily recovery
    for (const inj of simInjuries) {
      await recordInjury(seasonObj.id, inj.teamKey, inj.playerName, inj.playerPos, inj.source, inj.gameDate, currentDay);
      // Record transaction for user team injuries
      if (inj.teamKey === seasonObj.userTeam) {
        await recordInjuryTxn(seasonObj.id, {
          teamKey: inj.teamKey, playerName: inj.playerName,
          injuryType: inj.injuryType || 'Injury', severity: inj.severity || 'day_to_day',
          gamesRemaining: inj.gamesRemaining || 0, gameDate: inj.gameDate, startedOnGameDay: currentDay,
        });
      }
    }
    simInjuries.length = 0;
    const todayDate = daySchedule[0]?.gameDate || seasonObj.currentDate;
    await runDailyRecovery(seasonObj.id, todayDate);
    dayInjuries = await loadActiveInjuries(seasonObj.id);

    // Decrement manager suspensions for teams that played today
    const teamsPlayed = new Set();
    for (const g of toSim) {
      teamsPlayed.add(g.homeTeam);
      teamsPlayed.add(g.awayTeam);
    }
    for (const g of daySchedule) {
      if (g.status === 'final') {
        teamsPlayed.add(g.homeTeam);
        teamsPlayed.add(g.awayTeam);
      }
    }
    if (teamsPlayed.size > 0) {
      await decrementTeamSuspensions(seasonObj.id, teamsPlayed, todayDate);
    }

    currentDay++;
  }

  await base44.entities.Season.update(seasonObj.id, { currentGameDay: targetGameDay });
}