import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, TrendingUp, Play, Newspaper, FastForward, HeartPulse, Zap, ScrollText, BookOpen } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { generateScheduleValidated, formatGameDate, getLeague, getGameDayForDate } from '@/lib/seasonSchedule';
import { simulateGameHeadless, buildGameResultFromState, validateCompletedGame } from '@/lib/seasonEngine';
import { getCurrentUserGame, maybeAdvanceDay, archiveActiveSeasons, loadRotationStateForActiveSeason, persistRotationState, getProbableStarter, advanceRotation, recordPitcherWorkload, getUnavailableRelievers, commitPlayerStats, getRotationDebugInfo } from '@/lib/seasonStore';
import LeagueLeaders from '@/components/season/LeagueLeaders';
import FullSchedule from '@/components/season/FullSchedule';
import Standings from '@/components/season/Standings';
import TeamGameLog from '@/components/season/TeamGameLog';
import RotationDebugPanel from '@/components/season/RotationDebugPanel';
import ArchivedBoxScore from '@/components/season/ArchivedBoxScore';
import NewspaperScreen from '@/components/season/NewspaperScreen';
import WeeklyAwardsScreen from '@/components/season/WeeklyAwardsScreen';
import SeasonHomeTab from '@/components/season/SeasonHomeTab';
import { generateNewspaper, saveNewspaperArchive } from '@/lib/headlineGenerator';
import { calculateWeeklyAwards } from '@/lib/weeklyAwards';
import { deriveStandings } from '@/lib/seasonStore';
import { getDivision } from '@/lib/seasonSchedule';
import MonthlyHonorsScreen from '@/components/season/MonthlyHonorsScreen';
import { calculateMonthlyAwards } from '@/lib/monthlyAwards';
import AllStarBreakScreen from '@/components/season/AllStarBreakScreen';
import { generateAllStarRosters } from '@/lib/allStarRosters';
import { calculateAllStarMvp } from '@/lib/allStarMvp';
import { injectAllStarTeams, removeAllStarTeams, getAllStarTeamKey } from '@/lib/allStarTeams';
import { resetAllFatigue } from '@/lib/seasonStore';
import TradeDeadlineScreen from '@/components/season/TradeDeadlineScreen';
import TradeAuditPanel from '@/components/season/TradeAuditPanel';
import { generateTradeDeadline, applyTradesWithValidation, allTradesResolved, buildStatsMap, reapplyTradesFromLedger } from '@/lib/tradeDeadline';
import EndOfRegularSeasonScreen from '@/components/season/EndOfRegularSeasonScreen';
import PostseasonBracket from '@/components/season/PostseasonBracket';
import { calculateSeasonAwards } from '@/lib/seasonAwards';
import { generatePostseason } from '@/lib/postseason';
import { simGamesToDay } from '@/lib/seasonSimLoop';
import { simPostseasonStep } from '@/lib/postseasonSim';
import { calculatePostseasonAwards } from '@/lib/postseasonAwards';
import ChampionScreen from '@/components/season/ChampionScreen';
import SeasonCompleteScreen from '@/components/season/SeasonCompleteScreen';
import { loadActiveInjuries, buildInjuredRoster, runDailyRecovery, resolveStarterSkippingInjuries, clearInjuryCache, getInjuredPitcherNames, recordInjury } from '@/lib/injuryPersistence';
import { getSeverityLabel } from '@/lib/injuryConfig';
import InjuryReportScreen from '@/components/season/InjuryReportScreen';
import InjuryDebugPanel from '@/components/season/InjuryDebugPanel';
import DisciplineDebugPanel from '@/components/season/DisciplineDebugPanel';
import { loadActiveSuspensions, decrementTeamSuspensions, getManagerStatusForTeam } from '@/lib/managerSuspension';
import { loadActivePlayerSuspensions, buildSuspendedPlayerSet, decrementPlayerSuspensions, recordPlayerSuspension } from '@/lib/playerDiscipline';
import { forcePitcherHBPEjection, forceBatterArguesStrikes, forceChargingMound, forceBenchClearingBrawl, applyPlayerEjection, applyMultipleEjections, getGameEjections } from '@/lib/playerEjectionEngine';
import SeasonAchievementPopup from '@/components/season/SeasonAchievementPopup';
import AchievementsGallery from '@/components/season/AchievementsGallery';
import { evaluateGameComplete, evaluateSeasonEvent, initAchievementCache } from '@/lib/seasonAchievements/achievementEngine';
import UnavailablePlayersScreen from '@/components/season/UnavailablePlayersScreen';
import TransactionLogScreen from '@/components/season/TransactionLogScreen';
import SeasonHistoryPage from '@/components/season/SeasonHistoryPage';
import { recordInjuryTxn, recordReturnFromInjuryTxn, recordSuspensionTxn, recordTradeTxn, recordAllStarSelectionTxn, recordAwardTxn, recordClinchTxn, recordEjectionTxn } from '@/lib/transactionLog';
import { checkClinchesAndEliminations, getTeamClinchStatus } from '@/lib/clinching';
import { ensureSafeSeason } from '@/lib/seasonMigration';

const DIV_LABELS = { AL_East: 'AL East', AL_West: 'AL West', NL_East: 'NL East', NL_West: 'NL West' };

export default function SeasonDashboard() {
  const location = useLocation();
  const [season, setSeason] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [currentUserGame, setCurrentUserGame] = useState(null);
  const [probableStarters, setProbableStarters] = useState(null);
  const [rotationDebug, setRotationDebug] = useState(null);
  const [userGameNumber, setUserGameNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [showNewspaper, setShowNewspaper] = useState(false);
  const [newspaperData, setNewspaperData] = useState(null);
  const [dayGameResults, setDayGameResults] = useState([]);
  const [showWeeklyAwards, setShowWeeklyAwards] = useState(false);
  const [weeklyAwardsData, setWeeklyAwardsData] = useState(null);
  const [standingsData, setStandingsData] = useState(null);
  const [showMonthlyHonors, setShowMonthlyHonors] = useState(false);
  const [monthlyHonorsData, setMonthlyHonorsData] = useState(null);
  const [allStarRosters, setAllStarRosters] = useState(null);
  const [allStarBreakVisible, setAllStarBreakVisible] = useState(false);
  const [tradeDeadlineVisible, setTradeDeadlineVisible] = useState(false);
  const [tradeDeadlineTrades, setTradeDeadlineTrades] = useState(null);
  const [simToFinaleProgress, setSimToFinaleProgress] = useState(null);
  const [endOfRegularSeasonVisible, setEndOfRegularSeasonVisible] = useState(false);
  const [endOfSeasonAwards, setEndOfSeasonAwards] = useState(null);
  const [endOfSeasonStandings, setEndOfSeasonStandings] = useState(null);
  const [postseasonVisible, setPostseasonVisible] = useState(false);
  const [postseasonData, setPostseasonData] = useState(null);
  const [championTeam, setChampionTeam] = useState(null);
  const [seasonCompleteVisible, setSeasonCompleteVisible] = useState(false);
  const [postseasonAwardsData, setPostseasonAwardsData] = useState(null);
  const [activeInjuries, setActiveInjuries] = useState([]);
  const [activeSuspensions, setActiveSuspensions] = useState([]);
  const [activePlayerSuspensions, setActivePlayerSuspensions] = useState([]);
  const [showInjuryReport, setShowInjuryReport] = useState(false);
  const [showDebugDiscipline, setShowDebugDiscipline] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showTransactionLog, setShowTransactionLog] = useState(false);
  const [showSeasonHistory, setShowSeasonHistory] = useState(false);
  const [clinchStatus, setClinchStatus] = useState({});
  const simulatingRef = useRef(false);
  const lastAdvanceDayRef = useRef(null);
  const pendingUserTeam = location.state?.userTeam || null;

  useEffect(() => {
    loadSeason();
  }, []);

  const loadSeason = async () => {
    try {
      setLoading(true);
      const seasons = await base44.entities.Season.filter({ status: 'active' });
      if (seasons.length === 0) {
        if (!pendingUserTeam) {
          window.location.href = '/season-setup';
          return;
        }
        await createNewSeason();
        return;
      }

      const currentSeason = ensureSafeSeason(seasons[0]);
      setSeason(currentSeason);

      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: currentSeason.id,
        gameDay: currentSeason.currentGameDay || 1
      });
      setSchedule(daySchedule);

      const results = await base44.entities.GameResult.filter(
        { seasonId: currentSeason.id },
        '-gameDay',
        20
      );
      setGameResults(results);

      // Evaluate achievements for recent game results (catches user games after returning from Home.jsx)
      try {
        await initAchievementCache();
        for (const gr of results.slice(0, 10)) {
          const involvesUser = gr.homeTeam === currentSeason.userTeam || gr.awayTeam === currentSeason.userTeam;
          if (involvesUser) {
            await evaluateGameComplete(currentSeason.id, currentSeason.userTeam, gr, null, gr.isUserGame, currentSeason, { silent: !gr.isUserGame });
          }
        }
      } catch (e) { /* non-fatal */ }

      const userGame = await getCurrentUserGame(currentSeason);
      setCurrentUserGame(userGame);

      if (userGame) {
        const rotState = await loadRotationStateForActiveSeason();
        const oppTeam = userGame.homeTeam === currentSeason.userTeam ? userGame.awayTeam : userGame.homeTeam;
        setProbableStarters({
          userSP: getProbableStarter(rotState, currentSeason.userTeam, userGame.gameDate),
          oppSP: getProbableStarter(rotState, oppTeam, userGame.gameDate),
        });
        setRotationDebug(getRotationDebugInfo(rotState, currentSeason.userTeam, userGame.gameDate));
      } else {
        setProbableStarters(null);
        setRotationDebug(null);
      }

      try {
        const userSched = await base44.entities.Schedule.filter({
          seasonId: currentSeason.id, isUserGame: true,
        }, 'gameDay', 200);
        const userGamesPlayed = userSched.filter(g => g.status === 'final').length;
        setUserGameNumber(Math.min(162, userGamesPlayed + 1));
      } catch (e) { /* non-fatal */ }

      let seasonStandings = null;
      try {
        const allResults = await base44.entities.GameResult.filter({ seasonId: currentSeason.id }, 'gameDay', 2106);
        seasonStandings = deriveStandings(allResults);
        setStandingsData(seasonStandings);
        // Check for clinches/eliminations (September onward or when close)
        if (seasonStandings) {
          const todayDate = currentSeason.currentDate || '1984-04-02';
          const { newStatus } = await checkClinchesAndEliminations(
            seasonStandings, currentSeason.clinchStatus || {}, currentSeason.id, todayDate
          );
          setClinchStatus(newStatus);
          if (newStatus !== (currentSeason.clinchStatus || {})) {
            try {
              await base44.entities.Season.update(currentSeason.id, { clinchStatus: newStatus });
            } catch (e) { /* non-fatal */ }
          }
        }
      } catch (e) { /* non-fatal */ }

      // Evaluate season milestone achievements (progress, team record, allstar, trade, awards, postseason, season_complete)
      try {
        const userLeague = getLeague(currentSeason.userTeam);
        if (currentSeason.allStarBreakPhase) {
          await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'allstar', { userLeague });
        }
        if (currentSeason.tradeDeadlinePhase) {
          await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'trade', {});
        }
        if (currentSeason.seasonPhase === 'REGULAR_SEASON_COMPLETE' || currentSeason.seasonPhase === 'AWARDS_REVEALED') {
          await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'awards', { standings: seasonStandings });
        }
        if (currentSeason.seasonPhase && !['REGULAR_SEASON', 'REGULAR_SEASON_COMPLETE', 'AWARDS_REVEALED'].includes(currentSeason.seasonPhase)) {
          await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'postseason', {});
        }
        if (currentSeason.seasonPhase === 'SEASON_COMPLETE') {
          await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'season_complete', { standings: seasonStandings });
        }
        await evaluateSeasonEvent(currentSeason.id, currentSeason.userTeam, currentSeason, 'milestone', { standings: seasonStandings, userLeague });
      } catch (e) { /* non-fatal */ }

      // Save migration: ensure all fields have safe defaults
      const migrated = ensureSafeSeason(currentSeason);
      if (migrated !== currentSeason) {
        setSeason(migrated);
      }

      // Load active injuries for the season (persistent injury layer)
      try {
        clearInjuryCache();
        const injuries = await loadActiveInjuries(currentSeason.id);
        setActiveInjuries(injuries);
      } catch (e) { /* non-fatal */ }

      // Load active manager suspensions for the season
      try {
        const suspensions = await loadActiveSuspensions(currentSeason.id);
        setActiveSuspensions(suspensions);
      } catch (e) { /* non-fatal */ }

      // Load active player suspensions for the season
      try {
        const playerSusp = await loadActivePlayerSuspensions(currentSeason.id);
        setActivePlayerSuspensions(playerSusp);
      } catch (e) { /* non-fatal */ }

      // Restore All-Star break state if the season is in a break phase
      if (currentSeason.allStarBreakPhase && currentSeason.allStarRosters) {
        setAllStarRosters(currentSeason.allStarRosters);
        setAllStarBreakVisible(true);
      } else {
        setAllStarRosters(null);
        setAllStarBreakVisible(false);
      }

      // Restore trade deadline state
      if (currentSeason.tradeDeadlinePhase === 'active' && currentSeason.tradeDeadlineTrades) {
        setTradeDeadlineTrades(currentSeason.tradeDeadlineTrades);
        setTradeDeadlineVisible(true);
      } else if (currentSeason.tradeDeadlinePhase === 'completed' && currentSeason.tradeDeadlineTrades) {
        // Keep trades in state for audit panel even after deadline is completed
        setTradeDeadlineTrades(currentSeason.tradeDeadlineTrades);
        setTradeDeadlineVisible(false);
      } else {
        setTradeDeadlineTrades(null);
        setTradeDeadlineVisible(false);
      }

      // Reapply completed trade deadline transactions to TEAMS (in-memory
      // mutations are lost on page reload — replay from the persisted ledger)
      if (currentSeason.tradeDeadlinePhase === 'completed' && currentSeason.tradeDeadlineTrades) {
        reapplyTradesFromLedger(currentSeason.tradeDeadlineTrades);
      }

      // Restore end-of-regular-season state
      if (currentSeason.seasonPhase === 'REGULAR_SEASON_COMPLETE' || currentSeason.seasonPhase === 'AWARDS_REVEALED') {
        if (currentSeason.seasonAwards) {
          setEndOfSeasonAwards(currentSeason.seasonAwards);
          setEndOfRegularSeasonVisible(true);
        }
      } else {
        setEndOfRegularSeasonVisible(false);
        setEndOfSeasonAwards(null);
      }

      // Restore postseason state
      if (currentSeason.seasonPhase === 'SEASON_COMPLETE' && currentSeason.postseasonAwards) {
        setPostseasonData(currentSeason.postseason);
        setPostseasonAwardsData(currentSeason.postseasonAwards);
        setSeasonCompleteVisible(true);
        setPostseasonVisible(false);
        setChampionTeam(null);
      } else if (currentSeason.postseason && currentSeason.seasonPhase !== 'REGULAR_SEASON' && currentSeason.seasonPhase !== 'REGULAR_SEASON_COMPLETE') {
        setPostseasonData(currentSeason.postseason);
        setPostseasonVisible(true);
        if (currentSeason.seasonPhase === 'SEASON_COMPLETE' && currentSeason.champion) {
          setChampionTeam(currentSeason.champion);
        }
      } else {
        setPostseasonVisible(false);
        setPostseasonData(null);
        setChampionTeam(null);
        setSeasonCompleteVisible(false);
        setPostseasonAwardsData(null);
      }

    } catch (error) {
      console.error('Failed to load season:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAndShowMonthlyHonors = async (seasonObj) => {
    const s = seasonObj || season;
    if (!s) return;
    try {
      const recentResults = await base44.entities.GameResult.filter(
        { seasonId: s.id }, '-gameDay', 1
      );
      if (recentResults.length === 0) return;

      const lastResult = recentResults[0];
      if (!lastResult.gameDate) return;

      const monthStr = lastResult.gameDate.substring(0, 7);
      const [year, month] = monthStr.split('-').map(Number);

      const shown = s.monthlyHonorsShown || {};
      if (shown[monthStr]) return;

      const allSched = await base44.entities.Schedule.filter(
        { seasonId: s.id }, 'gameDay', 2200
      );
      const monthGames = allSched.filter(g => g.gameDate && g.gameDate.startsWith(monthStr));
      if (monthGames.length === 0) return;
      if (!monthGames.every(g => g.status === 'final')) return;

      const allResults = await base44.entities.GameResult.filter(
        { seasonId: s.id }, 'gameDay', 2200
      );
      const monthGameResults = allResults.filter(r => r.gameDate && r.gameDate.startsWith(monthStr));
      if (monthGameResults.length === 0) return;

      const awards = calculateMonthlyAwards(monthGameResults, year, month);
      if (!awards || awards.awards.length === 0) return;

      setMonthlyHonorsData(awards);
      setShowMonthlyHonors(true);
    } catch (e) {
      console.error('Monthly honors check failed:', e);
    }
  };

  const handleCloseMonthlyHonors = async () => {
    setShowMonthlyHonors(false);
    if (monthlyHonorsData && season) {
      const key = `${monthlyHonorsData.year}-${String(monthlyHonorsData.month).padStart(2, '0')}`;
      const shown = { ...(season.monthlyHonorsShown || {}), [key]: true };
      try {
        await base44.entities.Season.update(season.id, { monthlyHonorsShown: shown });
      } catch (e) { /* non-fatal */ }
      setSeason(prev => prev ? { ...prev, monthlyHonorsShown: shown } : prev);
    }
    setMonthlyHonorsData(null);
  };

  // ── All-Star Break logic ──
  // After July 8 is fully complete, generate All-Star rosters (once) and show the break screen.
  const checkAndShowAllStarBreak = async (seasonObj) => {
    const s = seasonObj || season;
    if (!s) return;
    try {
      // If the game has already been played, show the MVP screen
      if (s.allStarBreakPhase === 'game_played') {
        const rosters = s.allStarRosters;
        if (rosters) {
          setAllStarRosters(rosters);
          setAllStarBreakVisible(true);
        }
        return;
      }

      // If rosters are already generated and phase is 'break', show the break screen
      if (s.allStarBreakPhase === 'break' && s.allStarRosters) {
        setAllStarRosters(s.allStarRosters);
        setAllStarBreakVisible(true);
        return;
      }

      // Check if July 8 is fully complete
      const july8Sched = await base44.entities.Schedule.filter({
        seasonId: s.id, gameDate: '1984-07-08',
      });
      if (july8Sched.length === 0) return;
      if (!july8Sched.every(g => g.status === 'final')) return;

      // July 8 is complete — generate rosters (only once per season)
      if (s.allStarRosters) return; // already generated

      const rosters = await generateAllStarRosters(s.id);
      if (!rosters) {
        console.error('[allstar] Failed to generate rosters');
        return;
      }

      await base44.entities.Season.update(s.id, {
        allStarRosters: rosters,
        allStarBreakPhase: 'break',
      });

      setAllStarRosters(rosters);
      setAllStarBreakVisible(true);
      setSeason(prev => prev ? { ...prev, allStarRosters: rosters, allStarBreakPhase: 'break' } : prev);
    } catch (e) {
      console.error('All-Star break check failed:', e);
    }
  };

  const playAllStarGame = () => {
    if (!season || !allStarRosters) return;
    const userLeague = getLeague(season.userTeam);
    const userAllStarKey = getAllStarTeamKey(userLeague);
    const homeLeague = allStarRosters.homeLeague;
    const homeTeamKey = getAllStarTeamKey(homeLeague);
    const awayTeamKey = getAllStarTeamKey(homeLeague === 'AL' ? 'NL' : 'AL');
    // Launch the All-Star Game: homeTeam, awayTeam, userTeam (All-Star key), seasonId, stadium
    const params = [
      homeTeamKey,
      awayTeamKey,
      userAllStarKey,
      season.id,
      allStarRosters.stadium || 'All-Star Stadium',
      homeLeague,
    ];
    window.location.href = `/?allStarGame=${encodeURIComponent(params.join(','))}`;
  };

  const simAllStarGame = async () => {
    if (!season || !allStarRosters) return;
    try {
      setSimulating(true);
      const homeLeague = allStarRosters.homeLeague;
      const awayLeague = homeLeague === 'AL' ? 'NL' : 'AL';
      const homeTeamKey = getAllStarTeamKey(homeLeague);
      const awayTeamKey = getAllStarTeamKey(awayLeague);
      const stadium = allStarRosters.stadium || 'All-Star Stadium';

      // Inject synthetic teams for headless sim
      injectAllStarTeams(allStarRosters);
      const useDH = false; // No DH for All-Star Game

      const finalState = simulateGameHeadless(homeTeamKey, awayTeamKey, {
        useDH, rotationState: {}, gameDate: '1984-07-10',
      });

      const homeWon = finalState.score.home > finalState.score.away;
      const winningLeague = homeWon ? homeLeague : awayLeague;
      const mvp = calculateAllStarMvp(finalState, allStarRosters);

      const result = {
        homeScore: finalState.score.home,
        awayScore: finalState.score.away,
        winner: homeWon ? homeTeamKey : awayTeamKey,
        winningLeague,
        homeTeam: homeTeamKey,
        awayTeam: awayTeamKey,
        stadium,
      };

      // The All-Star Game winner earns World Series home-field advantage.
      await base44.entities.Season.update(season.id, {
        allStarBreakPhase: 'game_played',
        allStarGameResult: result,
        allStarMvp: mvp,
        worldSeriesHomeFieldLeague: winningLeague,
      });

      // Record All-Star selections as transactions for user team players
      try {
        const userLeague = getLeague(season.userTeam);
        const roster = allStarRosters[userLeague];
        if (roster) {
          const allPlayers = [
            ...(roster.battingOrder || []),
            ...(roster.bench || []),
            ...(roster.pitchers?.starters || []),
            ...(roster.pitchers?.relievers || []),
          ];
          for (const p of allPlayers) {
            if (p.teamKey === season.userTeam) {
              await recordAllStarSelectionTxn(season.id, p.teamKey, p.name, userLeague, '1984-07-10');
            }
          }
        }
      } catch (e) { /* non-fatal */ }

      setSeason(prev => prev ? {
        ...prev,
        allStarBreakPhase: 'game_played',
        allStarGameResult: result,
        allStarMvp: mvp,
        worldSeriesHomeFieldLeague: winningLeague,
      } : prev);
      setAllStarBreakVisible(true);
    } catch (e) {
      console.error('All-Star game sim failed:', e);
      alert('All-Star game simulation failed: ' + e.message);
    } finally {
      removeAllStarTeams();
      setSimulating(false);
    }
  };

  const continueAfterAllStar = async () => {
    if (!season) return;
    try {
      setAllStarBreakVisible(false);
      // Reset all pitcher/player fatigue
      const rotState = await loadRotationStateForActiveSeason();
      resetAllFatigue(rotState);
      await persistRotationState(season.id, rotState);

      // Advance to July 12 (first regular season game after the break)
      const july12Sched = await base44.entities.Schedule.filter({
        seasonId: season.id, gameDate: '1984-07-12',
      }, 'gameDay', 1);
      if (july12Sched.length > 0) {
        await base44.entities.Season.update(season.id, {
          allStarBreakPhase: null,
          currentGameDay: july12Sched[0].gameDay,
          currentDate: '1984-07-12',
        });
      } else {
        await base44.entities.Season.update(season.id, { allStarBreakPhase: null });
      }
      await loadSeason();
    } catch (e) {
      console.error('Continue after All-Star failed:', e);
    }
  };

  // ── Trade Deadline logic ──
  // After August 30 is fully complete, generate AI trades and show the screen.
  const checkAndShowTradeDeadline = async (seasonObj) => {
    const s = seasonObj || season;
    if (!s) return;
    try {
      // Already processed - show the screen if needed
      if (s.tradeDeadlinePhase === 'active' && s.tradeDeadlineTrades) {
        setTradeDeadlineTrades(s.tradeDeadlineTrades);
        setTradeDeadlineVisible(true);
        return;
      }
      // Already completed - don't re-trigger
      if (s.tradeDeadlinePhase === 'completed') return;

      // Check if August 30 games are all complete
      const aug30Sched = await base44.entities.Schedule.filter({
        seasonId: s.id, gameDate: '1984-08-30',
      });
      if (aug30Sched.length === 0) return;
      if (!aug30Sched.every(g => g.status === 'final')) return;

      // August 30 is complete - generate trades
      const allStats = await base44.entities.PlayerStats.filter({ seasonId: s.id }, null, 1500);
      const statsMap = buildStatsMap(allStats);

      const allResults = await base44.entities.GameResult.filter({ seasonId: s.id }, 'gameDay', 2200);
      const standings = deriveStandings(allResults);

      const trades = generateTradeDeadline(standings, statsMap, s.userTeam);

      // Store on the season entity. Trades are NOT applied yet - user-team
      // trades require approval first. Applied on continue via applyTrades().
      await base44.entities.Season.update(s.id, {
        tradeDeadlinePhase: 'active',
        tradeDeadlineTrades: trades,
      });

      setTradeDeadlineTrades(trades);
      setTradeDeadlineVisible(true);
      setSeason(prev => prev ? { ...prev, tradeDeadlinePhase: 'active', tradeDeadlineTrades: trades } : prev);
    } catch (e) {
      console.error('Trade deadline check failed:', e);
    }
  };

  const handlePreviewRoster = (approvedTrades) => {
    if (approvedTrades && approvedTrades.length > 0) {
      applyTradesWithValidation(approvedTrades);
    }
  };

  const continueAfterTradeDeadline = async (approvedTrades) => {
    if (!season) return;
    try {
      // Apply trades with validation: snapshot -> apply -> validate -> rollback on failure
      let validatedTrades = [];
      if (approvedTrades && approvedTrades.length > 0) {
        validatedTrades = applyTradesWithValidation(approvedTrades);
      }

      // Hard stop: don't advance until all trades are resolved (applied or failed)
      if (!allTradesResolved(validatedTrades)) {
        console.error('[trade] Trades still at "generated" status - hard stop');
        alert('Trade deadline processing incomplete. Check Trade Audit.');
        return;
      }

      setTradeDeadlineVisible(false);

      // Merge validated trades back into the full trade ledger
      const validatedByName = {};
      for (const t of validatedTrades) {
        const name = t.teamAGets?.[0]?.name;
        if (name) validatedByName[name] = t;
      }
      const updatedTrades = (tradeDeadlineTrades || []).map(t => {
        const name = t.teamAGets?.[0]?.name;
        if (name && validatedByName[name]) {
          return { ...t, ...validatedByName[name], applied: validatedByName[name].status === 'applied' };
        }
        // User trade not approved - mark as failed
        if (t.isUserTrade) {
          return { ...t, status: 'failed', applied: false, validationErrors: ['Trade not approved by user'] };
        }
        return { ...t, status: 'failed', applied: false, validationErrors: ['Trade was not processed'] };
      });

      setTradeDeadlineTrades(updatedTrades);

      // Record trade transactions for user team
      for (const t of updatedTrades) {
        if (t.status === 'applied' && (t.teamA === season.userTeam || t.teamB === season.userTeam)) {
          await recordTradeTxn(season.id, t, '1984-08-30');
        }
      }

      // Advance to September 1 (first game after the deadline)
      const sep1Sched = await base44.entities.Schedule.filter({
        seasonId: season.id, gameDate: '1984-09-01',
      }, 'gameDay', 1);
      const update = {
        tradeDeadlinePhase: 'completed',
        tradeDeadlineTrades: updatedTrades,
      };
      if (sep1Sched.length > 0) {
        update.currentGameDay = sep1Sched[0].gameDay;
        update.currentDate = '1984-09-01';
      }
      await base44.entities.Season.update(season.id, update);
      await loadSeason();
    } catch (e) {
      console.error('Continue after trade deadline failed:', e);
    }
  };

  const simToAugust30 = async () => {
    if (!season) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Simulating to August 30...');

      const aug30Day = getGameDayForDate('1984-08-30');
      if (!aug30Day) {
        alert('No games scheduled on August 30');
        return;
      }

      await simGamesToDay(aug30Day + 1, season, setSimToFinaleProgress);

      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim to August 30 failed:', error);
      alert('Sim to August 30 failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  const simToJuly8 = async () => {
    if (!season) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Simulating to July 8...');

      const july8Day = getGameDayForDate('1984-07-08');
      if (!july8Day) {
        alert('No games scheduled on July 8');
        return;
      }

      await simGamesToDay(july8Day + 1, season, setSimToFinaleProgress);

      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim to July 8 failed:', error);
      alert('Sim to July 8 failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  const createNewSeason = async () => {
    const userTeam = pendingUserTeam || 'tigers';
    try {
      await archiveActiveSeasons();
      const newSeason = await base44.entities.Season.create({
        year: 1984,
        startDate: '1984-04-02',
        endDate: '1984-10-14',
        currentGameDay: 1,
        currentDate: '1984-04-02',
        status: 'active',
        userTeam,
        completedGames: 0,
        totalGames: 2106
      });

      await generateSchedule(newSeason.id, userTeam);

      setSeason(newSeason);
      loadSeason();
    } catch (error) {
      console.error('Failed to create season:', error);
    }
  };

  const generateSchedule = async (seasonId, team) => {
    try {
      setLoading(true);
      await base44.entities.Schedule.deleteMany({ seasonId });

      const { days, errors, attempts } = generateScheduleValidated(team);
      if (errors.length > 0) {
        console.error(`Schedule failed verification after ${attempts} attempts:`, errors);
        const shown = errors.slice(0, 8).join('\n');
        const more = errors.length > 8 ? `\n...and ${errors.length - 8} more` : '';
        alert(`Schedule generation failed integrity check after ${attempts} attempts:\n\n${shown}${more}`);
        return;
      }

      const rows = [];
      for (const d of days) {
        for (const g of d.games) {
          rows.push({
            seasonId,
            gameDay: d.day,
            gameDate: d.date,
            homeTeam: g.home,
            awayTeam: g.away,
            isUserGame: g.isUser,
            status: 'scheduled',
          });
        }
      }

      await base44.entities.Season.update(seasonId, { totalGames: 2106 });

      const CHUNK = 500;
      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < rows.length; i += CHUNK) {
        await base44.entities.Schedule.bulkCreate(rows.slice(i, i + CHUNK));
        if (i + CHUNK < rows.length) await delay(800);
      }

      await loadSeason();
    } catch (error) {
      console.error('Failed to generate schedule:', error);
      alert('Failed to generate schedule: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateDay = async () => {
    if (!season) return;

    try {
      simulatingRef.current = true;
      setSimulating(true);
      const gameDay = season.currentGameDay || 1;

      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: season.id,
        gameDay,
      });

      const toSim = daySchedule.filter(g => !g.isUserGame && g.status !== 'final');

      // No CPU games to sim on this day — run daily recovery, then advance
      if (toSim.length === 0) {
        const todayDate = daySchedule[0]?.gameDate || season.currentDate;
        await runDailyRecovery(season.id, todayDate);
        const updatedInj = await loadActiveInjuries(season.id);
        setActiveInjuries(updatedInj);
        await maybeAdvanceDay(season);
        await loadSeason();
        return;
      }

      const rotState = await loadRotationStateForActiveSeason();

      // Load active injuries for injury-aware lineup/bullpen filtering
      const dayInjuries = await loadActiveInjuries(season.id);
      setActiveInjuries(dayInjuries);
      // Load active player suspensions for filtering
      const dayPlayerSusp = await loadActivePlayerSuspensions(season.id);
      setActivePlayerSuspensions(dayPlayerSusp);
      const suspendedNames = buildSuspendedPlayerSet(dayPlayerSusp, new Set(toSim.flatMap(g => [g.homeTeam, g.awayTeam])));
      const simInjuries = [];

      const resultRows = [];
      const allBatting = [];
      const allPitching = [];
      // Season totals accumulator: load once, apply per-game deltas so each
      // game's boxScore.seasonTotals reflects the snapshot AFTER that game.
      const existingStats = await base44.entities.PlayerStats.filter({ seasonId: season.id }, null, 1500);
      const statsAccum = {};
      for (const s of existingStats) {
        statsAccum[`${s.team}|${s.playerName}`] = {
          hr: s.homeRuns || 0, doubles: s.doubles || 0,
          triples: s.triples || 0, rbi: s.rbi || 0,
          sb: s.stolenBases || 0,
        };
      }
      // Session 23: SINGLE finalization path. No score-only fallback exists.
      // Every Season game builds a full record (box score + W/L). A hard failure
      // in any game throws and stops the entire day from committing.
      for (const g of toSim) {
        const homeTeam = g.homeTeam;
        const awayTeam = g.awayTeam;
        const useDH = TEAMS[homeTeam]?.league === 'AL';

        const homeSPBase = getProbableStarter(rotState, homeTeam, g.gameDate);
        const awaySPBase = getProbableStarter(rotState, awayTeam, g.gameDate);
        // Skip injured starters - fall through to next available rotation member
        const homeSP = resolveStarterSkippingInjuries(homeSPBase, homeTeam, dayInjuries);
        const awaySP = resolveStarterSkippingInjuries(awaySPBase, awayTeam, dayInjuries);
        // Build injury-filtered rosters: injured starters replaced by bench,
        // injured bench/relievers removed, all injured names added to scratchedPlayers
        const homeRoster = buildInjuredRoster(homeTeam, dayInjuries);
        const awayRoster = buildInjuredRoster(awayTeam, dayInjuries);
        const allScratched = [...new Set([...homeRoster.scratchedPlayers, ...awayRoster.scratchedPlayers, ...suspendedNames])];
        const unavailableRelievers = {
          home: [...getUnavailableRelievers(rotState, homeTeam, g.gameDate), ...getInjuredPitcherNames(dayInjuries, homeTeam)],
          away: [...getUnavailableRelievers(rotState, awayTeam, g.gameDate), ...getInjuredPitcherNames(dayInjuries, awayTeam)],
        };

        const finalState = simulateGameHeadless(homeTeam, awayTeam, {
          useDH, homeSP, awaySP, unavailableRelievers, rotationState: rotState, gameDate: g.gameDate,
          homeLineup: homeRoster.lineup, awayLineup: awayRoster.lineup,
          scratchedPlayers: allScratched,
        });

        // Collect injuries that occurred during the headless sim for persistence
        if (finalState._tracking?.injuriesOccurred) {
          for (const inj of finalState._tracking.injuriesOccurred) {
            simInjuries.push({ ...inj, gameDate: g.gameDate });
          }
        }

        // Hard block: a stalled sim (never reached gameOver) has incomplete data.
        if (finalState._validationFailed) {
          throw new Error(`Sim stall for ${awayTeam}@${homeTeam}: ${finalState._validationError}`);
        }

        const result = buildGameResultFromState(finalState, { headless: true });

        // Hard block: every final game MUST have a box score + W/L decisions.
        // Throws → propagates to outer catch → day stops, nothing committed.
        validateCompletedGame({
          status: 'FINAL',
          gameId: g.id,
          awayTeam, homeTeam,
          boxScore: result,
          winningPitcherId: result.decisions?.winner || null,
          losingPitcherId: result.decisions?.loser || null,
        });

        // Finalization diagnostics — same fields for every game, no more mystery paths.
        console.log('GAME FINALIZATION CHECK', {
          gameId: g.id, dayNumber: gameDay,
          awayTeam, homeTeam,
          finalScore: `${finalState.score.away}-${finalState.score.home}`,
          hasBoxScore: !!result,
          hasBattingBox: (result.batting || []).length > 0,
          hasPitchingBox: (result.pitching || []).length > 0,
          winningPitcherId: result.decisions?.winner || null,
          losingPitcherId: result.decisions?.loser || null,
          savePitcherId: result.decisions?.save || null,
          finalizationPath: 'full',
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

        // Build season totals snapshot for players with HR/2B/3B/RBI in this game.
        // Apply this game's deltas to the accumulator FIRST, then snapshot, so
        // the parenthetical number reflects the updated season total after this game.
        const gameSeasonTotals = {};
        for (const b of result.batting) {
          const key = `${b.teamKey}|${b.name}`;
          if (!statsAccum[key]) statsAccum[key] = { hr: 0, doubles: 0, triples: 0, rbi: 0 };
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
          seasonId: season.id, gameDay, gameDate: g.gameDate, boxScore: result,
          homeTeam, awayTeam,
          homeScore: result.homeScore, awayScore: result.awayScore, winner: result.winner,
          isUserGame: false, homeHits, awayHits, homeHRs, awayHRs,
          homeErrors: result.homeErrors || 0, awayErrors: result.awayErrors || 0,
          winningPitcher: winnerName, losingPitcher: loserName, savePitcher: saveName,
          stadium: TEAMS[homeTeam]?.stadium || null,
          innings: result.innings?.map(inn => ({ home: inn.home || 0, away: inn.away || 0 })) || [],
        });

        await new Promise(r => setTimeout(r, 0));
      }

      // Session 23: Log high-score outliers (no tuning yet — just track for analysis).
      for (const row of resultRows) {
        const totalRuns = row.homeScore + row.awayScore;
        if (row.homeScore >= 15 || row.awayScore >= 15 || totalRuns >= 22) {
          console.warn('HIGH SCORE OUTLIER', {
            gameId: row.id || `${row.awayTeam}${row.homeTeam}`, dayNumber: gameDay,
            score: `${row.awayScore}-${row.homeScore}`, totalRuns,
            pitchingBox: row.boxScore?.pitching || [],
          });
        }
      }

      // Session 23: Final game audit — re-validate every built row before any DB commit.
      // If any game is invalid, throw and stop the day (no partial commit).
      for (const row of resultRows) {
        validateCompletedGame({
          status: 'FINAL',
          gameId: row.id || `${row.awayTeam}${row.homeTeam}`,
          awayTeam: row.awayTeam, homeTeam: row.homeTeam,
          boxScore: row.boxScore,
          winningPitcherId: row.winningPitcher,
          losingPitcherId: row.losingPitcher,
        });
        console.log('AUDIT GAME', {
          gameId: row.id || `${row.awayTeam}${row.homeTeam}`,
          matchup: `${row.awayTeam} @ ${row.homeTeam}`,
          score: `${row.awayScore}-${row.homeScore}`,
          hasBoxScore: !!row.boxScore,
          W: row.winningPitcher, L: row.losingPitcher,
          clickable: !!row.boxScore,
        });
      }

      const teamResultCounts = {};
      for (const r of resultRows) {
        teamResultCounts[r.homeTeam] = (teamResultCounts[r.homeTeam] || 0) + 1;
        teamResultCounts[r.awayTeam] = (teamResultCounts[r.awayTeam] || 0) + 1;
      }
      for (const [team, count] of Object.entries(teamResultCounts)) {
        if (count > 1) {
          console.error(`[day-commit] ASSERTION FAILED: ${team} has ${count} results on day ${gameDay}`);
        }
      }

      // Commit player stats to PlayerStats entity (Stage 3: stats pipeline)
      await commitPlayerStats(season.id, allBatting, allPitching);

      await persistRotationState(season.id, rotState);

      // Persist injuries that occurred during headless sim games
      for (const inj of simInjuries) {
        await recordInjury(season.id, inj.teamKey, inj.playerName, inj.playerPos, inj.source, inj.gameDate, gameDay);
        // Record transaction for user team injuries
        if (inj.teamKey === season.userTeam) {
          await recordInjuryTxn(season.id, {
            teamKey: inj.teamKey, playerName: inj.playerName,
            injuryType: inj.injuryType || 'Injury', severity: inj.severity || 'day_to_day',
            gamesRemaining: inj.gamesRemaining || 0, gameDate: inj.gameDate, startedOnGameDay: gameDay,
          });
        }
      }

      // Daily injury recovery: decrement daysRemaining, clear eligible returns
      const todayDate = daySchedule[0]?.gameDate || season.currentDate;
      await runDailyRecovery(season.id, todayDate);
      const updatedInjuries = await loadActiveInjuries(season.id);
      setActiveInjuries(updatedInjuries);

      // Decrement manager suspensions for teams that played today
      const teamsPlayed = new Set();
      for (const g of toSim) {
        teamsPlayed.add(g.homeTeam);
        teamsPlayed.add(g.awayTeam);
      }
      const userGame = daySchedule.find(g => g.isUserGame);
      if (userGame && userGame.status === 'final') {
        teamsPlayed.add(userGame.homeTeam);
        teamsPlayed.add(userGame.awayTeam);
      }
      if (teamsPlayed.size > 0) {
        await decrementTeamSuspensions(season.id, teamsPlayed, todayDate);
        const updatedSuspensions = await loadActiveSuspensions(season.id);
        setActiveSuspensions(updatedSuspensions);
        // Decrement player suspensions too
        await decrementPlayerSuspensions(season.id, teamsPlayed, todayDate);
        const updatedPlayerSusp = await loadActivePlayerSuspensions(season.id);
        setActivePlayerSuspensions(updatedPlayerSusp);
      }

      if (resultRows.length > 0) {
        const CHUNK = 50;
        for (let i = 0; i < resultRows.length; i += CHUNK) {
          await Promise.all(resultRows.slice(i, i + CHUNK).map(r => base44.entities.GameResult.create(r)));
        }
      }

      for (const g of toSim) {
        try { await base44.entities.Schedule.update(g.id, { status: 'final' }); } catch (e) { /* non-fatal */ }
      }

      await base44.entities.Season.update(season.id, {
        completedGames: (season.completedGames || 0) + resultRows.length,
      });

      await maybeAdvanceDay(season);

      // ── Newspaper + Weekly Awards generation ──
      // After the day's games are committed, fetch all results for the day
      // (including user game if played) and generate the newspaper sports page.
      try {
        const dayResults = await base44.entities.GameResult.filter({
          seasonId: season.id,
          gameDay,
        }, null, 50);

        if (dayResults.length > 0) {
          const newspaper = generateNewspaper(
            dayResults, gameDay,
            daySchedule[0]?.gameDate || season.currentDate,
            season.userTeam, season.id
          );
          if (newspaper) {
            saveNewspaperArchive(newspaper);
            setDayGameResults(dayResults);
            setNewspaperData(newspaper);

            // Weekly awards every 7 calendar days
            if (gameDay % 7 === 0) {
              const weeklyResults = await base44.entities.GameResult.filter({
                seasonId: season.id,
                gameDay: { $gte: gameDay - 6, $lte: gameDay },
              }, '-gameDay', 200);

              const awards = calculateWeeklyAwards(
                weeklyResults,
                Math.floor(gameDay / 7),
                { start: gameDay - 6, end: gameDay }
              );

              // Persist awards to SeasonAward entity
              for (const award of awards.awards) {
                try {
                  await base44.entities.SeasonAward.create({
                    seasonId: season.id,
                    awardType: award.type,
                    winner: award.playerName,
                    team: award.teamKey,
                    weekNumber: award.weekNumber,
                    stats: { statLine: award.statLine, blurb: award.blurb, score: award.score },
                    awardDate: daySchedule[0]?.gameDate || season.currentDate,
                  });
                } catch (e) { /* non-fatal */ }
              }

              setWeeklyAwardsData(awards);
            }

            setShowNewspaper(true);
          }
        }
      } catch (e) {
        console.error('Newspaper generation failed:', e);
      }

      await loadSeason();
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
    }
  };

  const simToMonthFinale = async (targetMonth) => {
    if (!season) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Finding target game...');

      const userSched = await base44.entities.Schedule.filter({
        seasonId: season.id, isUserGame: true,
      }, 'gameDay', 200);

      const monthPrefix = `${season.year}-${String(targetMonth).padStart(2, '0')}`;
      const monthUserGames = userSched.filter(g => g.gameDate && g.gameDate.startsWith(monthPrefix));
      if (monthUserGames.length === 0) {
        alert(`No ${TEAMS[season.userTeam]?.name} games found in that month`);
        return;
      }

      monthUserGames.sort((a, b) => b.gameDay - a.gameDay);
      const targetGame = monthUserGames[0];

      let currentDay = season.currentGameDay || 1;

      if (currentDay >= targetGame.gameDay) {
        setSimToFinaleProgress(null);
        await loadSeason();
        return;
      }

      const rotState = await loadRotationStateForActiveSeason();

      while (currentDay < targetGame.gameDay) {
        setSimToFinaleProgress(`Simulating day ${currentDay} of ${targetGame.gameDay - 1}...`);

        const daySchedule = await base44.entities.Schedule.filter({
          seasonId: season.id, gameDay: currentDay,
        });

        const toSim = daySchedule.filter(g => g.status !== 'final');
        if (toSim.length === 0) {
          currentDay++;
          continue;
        }

        const existingStats = await base44.entities.PlayerStats.filter({ seasonId: season.id }, null, 1500);
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

          const homeSP = getProbableStarter(rotState, homeTeam, g.gameDate);
          const awaySP = getProbableStarter(rotState, awayTeam, g.gameDate);
          const unavailableRelievers = {
            home: getUnavailableRelievers(rotState, homeTeam, g.gameDate),
            away: getUnavailableRelievers(rotState, awayTeam, g.gameDate),
          };

          const finalState = simulateGameHeadless(homeTeam, awayTeam, {
            useDH, homeSP, awaySP, unavailableRelievers,
            rotationState: rotState, gameDate: g.gameDate,
          });

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
            seasonId: season.id, gameDay: currentDay, gameDate: g.gameDate, boxScore: result,
            homeTeam, awayTeam,
            homeScore: result.homeScore, awayScore: result.awayScore, winner: result.winner,
            isUserGame: g.isUserGame, homeHits, awayHits, homeHRs, awayHRs,
            homeErrors: result.homeErrors || 0, awayErrors: result.awayErrors || 0,
            winningPitcher: winnerName, losingPitcher: loserName, savePitcher: saveName,
            stadium: TEAMS[homeTeam]?.stadium || null,
            innings: result.innings?.map(inn => ({ home: inn.home || 0, away: inn.away || 0 })) || [],
          });

          await new Promise(r => setTimeout(r, 0));
        }

        await commitPlayerStats(season.id, allBatting, allPitching);
        await persistRotationState(season.id, rotState);

        if (resultRows.length > 0) {
          const CHUNK = 50;
          for (let i = 0; i < resultRows.length; i += CHUNK) {
            await Promise.all(resultRows.slice(i, i + CHUNK).map(r => base44.entities.GameResult.create(r)));
          }
        }

        for (const g of toSim) {
          try { await base44.entities.Schedule.update(g.id, { status: 'final' }); } catch (e) { /* non-fatal */ }
        }

        await base44.entities.Season.update(season.id, {
          completedGames: (season.completedGames || 0) + resultRows.length,
        });

        await maybeAdvanceDay({ ...season, currentGameDay: currentDay, id: season.id });

        currentDay++;
      }

      await base44.entities.Season.update(season.id, { currentGameDay: targetGame.gameDay });

      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim to finale failed:', error);
      alert('Sim to finale failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  // ── Sim to the user's next scheduled game (skips off days) ──
  const simToNextUserGame = async () => {
    if (!season || !currentUserGame) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Finding your next game...');
      await simGamesToDay(currentUserGame.gameDay, season, setSimToFinaleProgress);
      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim to next game failed:', error);
      alert('Sim to next game failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  // ── End of Regular Season: sim to user's final game ──
  const simToUserFinalGame = async () => {
    if (!season) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Finding your final game...');

      const userSched = await base44.entities.Schedule.filter({
        seasonId: season.id, isUserGame: true,
      }, 'gameDay', 200);

      if (userSched.length === 0) {
        alert('No user games found');
        return;
      }
      userSched.sort((a, b) => b.gameDay - a.gameDay);
      const finalGame = userSched[0];

      await simGamesToDay(finalGame.gameDay, season, setSimToFinaleProgress);

      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim to final game failed:', error);
      alert('Sim to final game failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  // ── Simulate all remaining MLB games after user's season is done ──
  const simRemainingMLBGames = async () => {
    if (!season) return;
    try {
      simulatingRef.current = true;
      setSimulating(true);
      setSimToFinaleProgress('Simulating remaining MLB games...');

      const allSched = await base44.entities.Schedule.filter({
        seasonId: season.id,
      }, 'gameDay', 2200);

      if (allSched.length === 0) return;
      const lastDay = allSched[allSched.length - 1].gameDay;

      // +1 so the last day is included (simGamesToDay is exclusive of target)
      await simGamesToDay(lastDay + 1, season, setSimToFinaleProgress);

      setSimToFinaleProgress(null);
      await loadSeason();
    } catch (error) {
      console.error('Sim remaining MLB games failed:', error);
      alert('Sim remaining MLB games failed: ' + error.message);
    } finally {
      simulatingRef.current = false;
      setSimulating(false);
      setSimToFinaleProgress(null);
    }
  };

  // ── Check if ALL regular-season games are complete, then show End of Season screen ──
  const checkAndShowEndOfRegularSeason = async (seasonObj) => {
    const s = seasonObj || season;
    if (!s) return;

    // Season complete (postseason done) - show awards/wrap screen
    if (s.seasonPhase === 'SEASON_COMPLETE') {
      if (s.postseasonAwards && !seasonCompleteVisible && !postseasonVisible && !championTeam) {
        setPostseasonData(s.postseason);
        setPostseasonAwardsData(s.postseasonAwards);
        setSeasonCompleteVisible(true);
      }
      return;
    }

    // Already past this phase - show screen if needed
    if (s.seasonPhase === 'REGULAR_SEASON_COMPLETE' || s.seasonPhase === 'AWARDS_REVEALED') {
      if (s.seasonAwards && !endOfRegularSeasonVisible) {
        try {
          const allResults = await base44.entities.GameResult.filter({ seasonId: s.id }, 'gameDay', 2200);
          setEndOfSeasonStandings(deriveStandings(allResults));
        } catch (e) { /* non-fatal */ }
        setEndOfSeasonAwards(s.seasonAwards);
        setEndOfRegularSeasonVisible(true);
      }
      return;
    }

    // Already in postseason phase
    if (s.seasonPhase && s.seasonPhase !== 'REGULAR_SEASON') {
      if (s.postseason && !postseasonVisible) {
        setPostseasonData(s.postseason);
        setPostseasonVisible(true);
      }
      return;
    }

    try {
      // Check if ALL scheduled games are final
      const remaining = await base44.entities.Schedule.filter({
        seasonId: s.id, status: 'scheduled',
      }, null, 1);

      if (remaining.length > 0) return; // Games still remaining

      // Fetch all results for validation and standings
      const allResults = await base44.entities.GameResult.filter({ seasonId: s.id }, 'gameDay', 2200);
      const standings = deriveStandings(allResults);

      // Validate: every team must have exactly 162 games (wins + losses)
      let allAt162 = true;
      for (const div of Object.keys(standings)) {
        for (const t of standings[div]) {
          if (t.w + t.l !== 162) {
            console.error(`[season] ${t.teamKey} has ${t.w + t.l} games (expected 162)`);
            allAt162 = false;
          }
        }
      }
      if (!allAt162) {
        console.error('[season] Season cannot end: not all teams at 162 games');
        return; // Block postseason until all teams have 162 games
      }

      // All games complete - generate awards (idempotent)
      let awards = s.seasonAwards;
      if (!awards || awards.length === 0) {
        const allStats = await base44.entities.PlayerStats.filter({ seasonId: s.id }, null, 1500);
        const { awards: calcAwards } = calculateSeasonAwards(allStats, allResults);
        awards = calcAwards;

        await base44.entities.Season.update(s.id, {
          seasonPhase: 'REGULAR_SEASON_COMPLETE',
          seasonAwards: awards,
        });

        // Persist to SeasonAward entity + record transactions
        for (const a of awards) {
          try {
            await base44.entities.SeasonAward.create({
              seasonId: s.id,
              awardType: a.awardType,
              league: a.league,
              winner: a.winner,
              team: a.team,
              stats: { statLine: a.statLine },
              awardDate: '1984-10-01',
            });
            // Record transaction for user team award winners
            if (a.team === s.userTeam) {
              await recordAwardTxn(s.id, { ...a, awardDate: '1984-10-01' });
            }
          } catch (e) { /* non-fatal */ }
        }
      }

      setEndOfSeasonStandings(standings);
      setEndOfSeasonAwards(awards);
      setEndOfRegularSeasonVisible(true);
      setSeason(prev => prev ? { ...prev, seasonPhase: 'REGULAR_SEASON_COMPLETE', seasonAwards: awards } : prev);
    } catch (e) {
      console.error('End of regular season check failed:', e);
    }
  };

  // ── Create postseason bracket ──
  const createPostseason = async () => {
    if (!season) return;
    try {
      // Idempotent: use cached bracket if already generated
      if (season.postseason) {
        setPostseasonData(season.postseason);
        setPostseasonVisible(true);
        setEndOfRegularSeasonVisible(false);
        return;
      }

      const allResults = await base44.entities.GameResult.filter({ seasonId: season.id }, 'gameDay', 2200);
      const standings = deriveStandings(allResults);

      const bracket = generatePostseason(standings);
      if (!bracket) {
        alert('Could not generate postseason bracket - division winners not determined');
        return;
      }

      await base44.entities.Season.update(season.id, {
        postseason: bracket,
        seasonPhase: 'POSTSEASON_READY',
      });

      setPostseasonData(bracket);
      setPostseasonVisible(true);
      setEndOfRegularSeasonVisible(false);
      setSeason(prev => prev ? { ...prev, postseason: bracket, seasonPhase: 'POSTSEASON_READY' } : prev);
    } catch (e) {
      console.error('Create postseason failed:', e);
      alert('Failed to create postseason: ' + e.message);
    }
  };

  // ── Postseason simulation: sim one game per click ──
  const handleSimPostseason = async () => {
    if (!season?.postseason) return;
    try {
      setSimulating(true);
      const asgWinnerLeague = season.worldSeriesHomeFieldLeague || season.allStarGameResult?.winningLeague || 'NL';
      const { postseason: updated, event } = simPostseasonStep(season.postseason, asgWinnerLeague);

      const update = { postseason: updated };

      if (event.type === 'ws_created') {
        update.seasonPhase = 'WORLD_SERIES';
      } else if (event.type === 'champion') {
        update.seasonPhase = 'SEASON_COMPLETE';
        update.champion = event.champion;
        const awards = calculatePostseasonAwards(updated);
        update.postseasonAwards = awards;
      } else if (season.seasonPhase === 'POSTSEASON_READY' &&
                 (updated.alcs?.status === 'complete' || updated.nlcs?.status === 'complete')) {
        update.seasonPhase = 'ALCS_NLCS';
      }

      await base44.entities.Season.update(season.id, update);
      setSeason(prev => ({ ...prev, ...update }));
      setPostseasonData(updated);

      if (event.type === 'champion') {
        setPostseasonAwardsData(update.postseasonAwards);
        setChampionTeam(event.champion);
      }
    } catch (e) {
      console.error('Postseason sim failed:', e);
      alert('Postseason simulation failed: ' + e.message);
    } finally {
      setSimulating(false);
    }
  };

  const isDebug = new URLSearchParams(window.location.search).has('debug');

  const handleReadNewspaper = async () => {
    if (!season || !gameResults?.length) return;
    try {
      const recentDay = gameResults[0]?.gameDay;
      if (!recentDay) return;
      const dayResults = await base44.entities.GameResult.filter({
        seasonId: season.id, gameDay: recentDay,
      }, null, 50);
      if (dayResults.length === 0) return;
      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: season.id, gameDay: recentDay,
      });
      const newspaper = generateNewspaper(
        dayResults, recentDay,
        daySchedule[0]?.gameDate || season.currentDate,
        season.userTeam, season.id
      );
      if (newspaper) {
        setDayGameResults(dayResults);
        setNewspaperData(newspaper);
        setShowNewspaper(true);
      }
    } catch (e) {
      console.error('Failed to load newspaper:', e);
    }
  };

  // Auto-sim remaining CPU games + check monthly honors + end of season after load/sim
  useEffect(() => {
    if (simulating || !season) return;
    if (showNewspaper || showWeeklyAwards || showMonthlyHonors || allStarBreakVisible || tradeDeadlineVisible || endOfRegularSeasonVisible || postseasonVisible || seasonCompleteVisible) return;
    if (schedule.length > 0) {
      const userGame = schedule.find(g => g.isUserGame);
      const cpuRemaining = schedule.filter(g => !g.isUserGame && g.status !== 'final');
      // User's game is done, CPU games remain — auto-sim them
      if (userGame && userGame.status === 'final' && cpuRemaining.length > 0) {
        simulateDay();
        return;
      }
      // No user game today, CPU games remain — auto-sim them (CPU-only day)
      if (!userGame && cpuRemaining.length > 0) {
        simulateDay();
        return;
      }
      // All games on current day are final — check special events BEFORE advancing
      if (cpuRemaining.length === 0 && (!userGame || userGame.status === 'final')) {
        const todayDate = schedule[0]?.gameDate;
        // All-Star break: don't advance past July 8 until the break is resolved
        if (todayDate === '1984-07-08' && season.allStarBreakPhase !== 'game_played') {
          checkAndShowAllStarBreak();
          checkAndShowMonthlyHonors();
          return;
        }
        // Trade deadline: don't advance past August 30 until the deadline is resolved
        if (todayDate === '1984-08-30' && season.tradeDeadlinePhase !== 'completed') {
          checkAndShowTradeDeadline();
          return;
        }
        // Not a special event day — advance to next day
        if (lastAdvanceDayRef.current !== season.currentGameDay) {
          lastAdvanceDayRef.current = season.currentGameDay;
          checkAndShowMonthlyHonors();
          simulateDay();
        } else {
          // Already tried advancing this day — check for end of season
          checkAndShowEndOfRegularSeason();
        }
        return;
      }
    } else {
      // No games on current day (league off day) — advance to next day
      if (lastAdvanceDayRef.current !== season.currentGameDay) {
        lastAdvanceDayRef.current = season.currentGameDay;
        simulateDay();
      } else {
        checkAndShowEndOfRegularSeason();
      }
      return;
    }
    checkAndShowAllStarBreak();
    checkAndShowMonthlyHonors();
    checkAndShowTradeDeadline();
    checkAndShowEndOfRegularSeason();
  }, [simulating, season, schedule, showNewspaper, showWeeklyAwards, showMonthlyHonors, allStarBreakVisible, tradeDeadlineVisible, endOfRegularSeasonVisible, postseasonVisible, seasonCompleteVisible]);

  const todaysUserGame = schedule.find(g => g.isUserGame && g.status !== 'final');
  const isUserOffDay = !todaysUserGame;

  const playUserGame = () => {
    if (!todaysUserGame || !season) return;
    // Session 23: pass the resolved starter NAMES in the launch URL so Home.jsx
    // uses the exact same pitcher the dashboard displayed — no re-resolution.
    const userSPName = probableStarters?.userSP?.name ? encodeURIComponent(probableStarters.userSP.name) : '';
    const oppSPName = probableStarters?.oppSP?.name ? encodeURIComponent(probableStarters.oppSP.name) : '';
    // Pass suspended player names so Home.jsx scratches them for the game
    const suspendedNames = activePlayerSuspensions
      .filter(s => s.teamKey === todaysUserGame.homeTeam || s.teamKey === todaysUserGame.awayTeam)
      .map(s => s.playerName);
    const suspendedParam = suspendedNames.length > 0 ? ',' + encodeURIComponent(suspendedNames.join('|')) : '';
    window.location.href = `/?seasonGame=${todaysUserGame.homeTeam},${todaysUserGame.awayTeam},${season.userTeam},${season.id},${todaysUserGame.gameDay},${todaysUserGame.id},${todaysUserGame.gameDate},${userSPName},${oppSPName}${suspendedParam}`;
  };

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-heading text-lg text-foreground">Loading Season...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">
      {/* Compact Header */}
      <div className="shrink-0 border-b border-border bg-card/50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <h1 className="font-heading text-base md:text-lg font-bold text-foreground">
                1984{season?.userTeam ? ` ${TEAMS[season.userTeam]?.name}` : ' Season'}
              </h1>
              <p className="text-[10px] text-muted-foreground font-heading">
                Game {userGameNumber} of 162 · {formatGameDate(schedule[0]?.gameDate || season?.currentDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button onClick={loadSeason} variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={simulating} title="Refresh">
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button onClick={() => setShowInjuryReport(true)} variant="outline" size="sm" className="h-7 w-7 p-0" disabled={simulating || activeInjuries.length === 0} title="Injury Report">
              <HeartPulse className="w-3 h-3" />
            </Button>
            <Button onClick={() => setShowAchievements(true)} variant="outline" size="sm" className="h-7 w-7 p-0" disabled={simulating} title="Achievements">
              <Trophy className="w-3 h-3" />
            </Button>
            <Button onClick={() => setShowTransactionLog(true)} variant="outline" size="sm" className="h-7 w-7 p-0" disabled={simulating} title="Transaction Wire">
              <ScrollText className="w-3 h-3" />
            </Button>
            {season?.seasonPhase === 'SEASON_COMPLETE' && (
              <Button onClick={() => setShowSeasonHistory(true)} variant="outline" size="sm" className="h-7 w-7 p-0" disabled={simulating} title="Season History">
                <BookOpen className="w-3 h-3" />
              </Button>
            )}
            {isDebug && (
              <Button onClick={() => setShowDebugDiscipline(true)} variant="outline" size="sm" className="h-7 w-7 p-0 text-amber-400" disabled={simulating} title="Discipline Debug">
                <Zap className="w-3 h-3" />
              </Button>
            )}
            <Button onClick={handleReadNewspaper} variant="outline" size="sm" className="h-7 w-7 p-0" disabled={simulating || !gameResults?.length} title="Newspaper">
              <Newspaper className="w-3 h-3" />
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" size="sm" className="h-7 w-7 p-0" title="Exhibition Mode">
              <Play className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Next Game Hero Card */}
      <div className="shrink-0 bg-card border-b border-border px-4 py-2">
        {standingsData && season && (() => {
          const userDiv = getDivision(season.userTeam);
          const divStandings = standingsData[userDiv] || [];
          const userSt = divStandings.find(t => t.teamKey === season.userTeam);
          if (!userSt) return null;
          const place = divStandings.indexOf(userSt) + 1;
          const suffix = place === 1 ? 'st' : place === 2 ? 'nd' : place === 3 ? 'rd' : 'th';
          const lastUserResult = gameResults?.find(r => r.homeTeam === season.userTeam || r.awayTeam === season.userTeam);
          let lastGameLine = null;
          if (lastUserResult) {
            const isHome = lastUserResult.homeTeam === season.userTeam;
            const opp = isHome ? lastUserResult.awayTeam : lastUserResult.homeTeam;
            const userWon = lastUserResult.winner === season.userTeam;
            const userRuns = isHome ? lastUserResult.homeScore : lastUserResult.awayScore;
            const oppRuns = isHome ? lastUserResult.awayScore : lastUserResult.homeScore;
            lastGameLine = `${userWon ? 'W' : 'L'} ${userRuns}-${oppRuns} vs ${TEAMS[opp]?.abbr || opp}`;
          }
          return (
            <div className="flex items-center gap-2 mb-1 text-[10px] font-heading text-muted-foreground">
              <span className="text-foreground font-bold">{userSt.w}-{userSt.l}</span>
              {userSt.streakType && <span className={userSt.streakType === 'W' ? 'text-emerald-400' : 'text-red-400'}>Streak: {userSt.streakType}{userSt.streakLen}</span>}
              <span>{place}{suffix} {DIV_LABELS[userDiv]}</span>
              <span>{userSt.gb === 0 ? '-' : userSt.gb.toFixed(1) + ' GB'}</span>
              {(() => {
                const clinch = getTeamClinchStatus(standingsData, season.userTeam);
                if (!clinch) return null;
                if (clinch.type === 'clinched') return <span className="text-emerald-400 font-bold">CLINCHED</span>;
                if (clinch.type === 'eliminated') return <span className="text-red-400 font-bold">ELIMINATED</span>;
                if (clinch.type === 'magic_number') return <span className="text-amber-400 font-bold">{clinch.label}</span>;
                if (clinch.type === 'elimination_number') return <span className="text-orange-400">{clinch.label}</span>;
                return null;
              })()}
              {lastGameLine && <span className="text-muted-foreground/70">Last: {lastGameLine}</span>}
            </div>
          );
        })()}

        {currentUserGame ? (
          <div className="space-y-1">
            <div>
              <div className="font-heading text-sm font-bold text-foreground">
                {TEAMS[currentUserGame.awayTeam]?.name} @ {TEAMS[currentUserGame.homeTeam]?.name}
              </div>
              {probableStarters && (
                <div className="text-[10px] text-muted-foreground font-heading">
                  {probableStarters.userSP?.name || 'TBD'} vs {probableStarters.oppSP?.name || 'TBD'}
                </div>
              )}
              {activeInjuries.length > 0 && currentUserGame && (() => {
                const ut = season.userTeam;
                const ot = currentUserGame.homeTeam === ut ? currentUserGame.awayTeam : currentUserGame.homeTeam;
                const inj = activeInjuries.filter(i => i.teamKey === ut || i.teamKey === ot);
                if (inj.length === 0) return null;
                const fmt = (i) => `${i.playerName.split(' ').pop()} (${getSeverityLabel(i.severity)})`;
                return (
                  <div className="text-[10px] text-red-400/80 font-heading">
                    Unavailable: {inj.map(fmt).join('; ')}
                  </div>
                );
              })()}
              {activeSuspensions.length > 0 && currentUserGame && (() => {
                const ut = season.userTeam;
                const ot = currentUserGame.homeTeam === ut ? currentUserGame.awayTeam : currentUserGame.homeTeam;
                const userStatus = getManagerStatusForTeam(activeSuspensions, ut);
                const oppStatus = getManagerStatusForTeam(activeSuspensions, ot);
                if (!userStatus && !oppStatus) return null;
                const lines = [];
                if (userStatus) lines.push(`${userStatus.managerName} suspended (${userStatus.gamesRemaining}G)`);
                if (oppStatus) lines.push(`${oppStatus.managerName} suspended (${oppStatus.gamesRemaining}G)`);
                return (
                  <div className="text-[10px] text-amber-400/80 font-heading">
                    Manager: {lines.join(' - ')}
                  </div>
                );
              })()}
              {activePlayerSuspensions.length > 0 && currentUserGame && (() => {
                const ut = season.userTeam;
                const ot = currentUserGame.homeTeam === ut ? currentUserGame.awayTeam : currentUserGame.homeTeam;
                const suspended = activePlayerSuspensions.filter(s => s.teamKey === ut || s.teamKey === ot);
                if (suspended.length === 0) return null;
                const fmt = (s) => `${s.playerName.split(' ').pop()} (${s.gamesRemaining}G)`;
                return (
                  <div className="text-[10px] text-red-400/80 font-heading">
                    Suspended: {suspended.map(fmt).join('; ')}
                  </div>
                );
              })()}
              <div className="text-[10px] text-muted-foreground">
                {TEAMS[currentUserGame.homeTeam]?.stadium}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {todaysUserGame ? (
                <Button onClick={playUserGame} className="gap-1 w-full" size="sm">
                  <Play className="w-4 h-4" /> Play My Game
                </Button>
              ) : (
                <Button onClick={simToNextUserGame} disabled={simulating} variant="secondary" size="sm" className="gap-1 w-full">
                  <FastForward className="w-3 h-3" /> Sim to My Next Game
                </Button>
              )}
              <Button onClick={simulateDay} disabled={simulating} variant={todaysUserGame ? "outline" : "secondary"} size="sm" className="gap-1 w-full">
                {simulating ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                Simulate Day
              </Button>
              <div className="grid grid-cols-2 gap-1.5">
                <Button onClick={() => simToMonthFinale(4)} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-amber-400">
                  <FastForward className="w-3 h-3" /> April Finale
                </Button>
                <Button onClick={simToJuly8} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-cyan-400">
                  <FastForward className="w-3 h-3" /> July 8 (ASG)
                </Button>
                <Button onClick={simToAugust30} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-amber-400">
                  <FastForward className="w-3 h-3" /> Aug 30 (Trade)
                </Button>
                <Button onClick={simToUserFinalGame} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-emerald-400">
                  <FastForward className="w-3 h-3" /> Final Game
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="font-heading text-sm text-muted-foreground">
              Your regular season is complete.
            </div>
            <Button onClick={simRemainingMLBGames} disabled={simulating} variant="secondary" size="sm" className="gap-1">
              {simulating ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <FastForward className="w-4 h-4" />}
              Simulate Final MLB Games
            </Button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0 bg-card/50 border-b border-border px-4">
        <div className="grid grid-cols-5 gap-1 py-2">
          <button onClick={() => setActiveTab('home')} className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'home' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Home</button>
          <button onClick={() => setActiveTab('schedule')} className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'schedule' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Schedule</button>
          <button onClick={() => setActiveTab('standings')} className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'standings' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Standings</button>
          <button onClick={() => setActiveTab('leaders')} className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'leaders' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Leaders</button>
          <button onClick={() => setActiveTab('gamelog')} className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'gamelog' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Game Log</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isDebug && rotationDebug && <RotationDebugPanel debugInfo={rotationDebug} />}

        {isDebug && tradeDeadlineTrades && <TradeAuditPanel trades={tradeDeadlineTrades} />}

        {isDebug && <InjuryDebugPanel injuries={activeInjuries} season={season} />}

        {activeTab === 'home' && season && (
          <SeasonHomeTab
            season={season}
            standingsData={standingsData}
            gameResults={gameResults}
            onReadNewspaper={handleReadNewspaper}
            onViewSchedule={() => setActiveTab('schedule')}
            onViewStandings={() => setActiveTab('standings')}
          />
        )}

        {activeTab === 'schedule' && season && (
          <FullSchedule seasonId={season.id} userTeam={season.userTeam} />
        )}

        {activeTab === 'standings' && season && (
          <Standings seasonId={season.id} userTeam={season.userTeam} />
        )}

        {activeTab === 'leaders' && season && (
          <LeagueLeaders seasonId={season.id} userTeam={season.userTeam} />
        )}

        {activeTab === 'gamelog' && season && (
          <TeamGameLog seasonId={season.id} userTeam={season.userTeam} />
        )}
      </div>

      {selectedArchive && (
        <ArchivedBoxScore gameResult={selectedArchive} onClose={() => setSelectedArchive(null)} />
      )}

      {showNewspaper && newspaperData && (
        <NewspaperScreen
          newspaper={newspaperData}
          gameResults={dayGameResults}
          userTeam={season?.userTeam}
          onClose={() => {
            setShowNewspaper(false);
            if (weeklyAwardsData) setShowWeeklyAwards(true);
            else checkAndShowMonthlyHonors();
          }}
        />
      )}

      {showWeeklyAwards && weeklyAwardsData && (
        <WeeklyAwardsScreen
          awardsData={weeklyAwardsData}
          onClose={() => { setShowWeeklyAwards(false); setWeeklyAwardsData(null); checkAndShowMonthlyHonors(); }}
        />
      )}

      {showMonthlyHonors && monthlyHonorsData && (
        <MonthlyHonorsScreen
          honorsData={monthlyHonorsData}
          onClose={handleCloseMonthlyHonors}
        />
      )}

      {allStarBreakVisible && allStarRosters && (
        <AllStarBreakScreen
          season={season}
          rosters={allStarRosters}
          allStarMvp={season?.allStarMvp}
          allStarGameResult={season?.allStarGameResult}
          onPlayAllStarGame={playAllStarGame}
          onSimAllStarGame={simAllStarGame}
          onContinue={continueAfterAllStar}
        />
      )}

      {tradeDeadlineVisible && tradeDeadlineTrades && (
        <TradeDeadlineScreen
          season={season}
          trades={tradeDeadlineTrades}
          onContinue={continueAfterTradeDeadline}
          onPreviewRoster={handlePreviewRoster}
        />
      )}

      {endOfRegularSeasonVisible && (
        <EndOfRegularSeasonScreen
          season={season}
          standingsData={endOfSeasonStandings || standingsData}
          awards={endOfSeasonAwards}
          onCreatePostseason={createPostseason}
          onContinue={() => setEndOfRegularSeasonVisible(false)}
        />
      )}

      {postseasonVisible && postseasonData && (
        <PostseasonBracket
          season={season}
          postseason={postseasonData}
          simulating={simulating}
          onPlayGame={() => { /* Postseason game play - deferred */ }}
          onSimPostseason={handleSimPostseason}
          onContinue={() => {
            if (season?.seasonPhase === 'SEASON_COMPLETE') {
              setPostseasonVisible(false);
              setSeasonCompleteVisible(true);
            } else {
              setPostseasonVisible(false);
            }
          }}
        />
      )}

      {championTeam && (
        <ChampionScreen champion={championTeam} onClose={() => {
          setChampionTeam(null);
          setSeasonCompleteVisible(true);
        }} />
      )}

      {seasonCompleteVisible && postseasonAwardsData && (
        <SeasonCompleteScreen
          season={season}
          awards={postseasonAwardsData}
          champion={season?.champion}
          onViewBracket={() => {
            setSeasonCompleteVisible(false);
            setPostseasonVisible(true);
          }}
          onViewStandings={() => {
            setSeasonCompleteVisible(false);
            setActiveTab('standings');
          }}
          onViewLeaders={() => {
            setSeasonCompleteVisible(false);
            setActiveTab('leaders');
          }}
          onStartNewSeason={() => {
            window.location.href = '/season-setup';
          }}
          onMainMenu={() => {
            window.location.href = '/';
          }}
        />
      )}

      {simToFinaleProgress && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl px-6 py-4 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-heading text-sm text-foreground">{simToFinaleProgress}</p>
          </div>
        </div>
      )}

      {showInjuryReport && (
        <UnavailablePlayersScreen
          season={season}
          injuries={activeInjuries}
          playerSuspensions={activePlayerSuspensions}
          managerSuspensions={activeSuspensions}
          onClose={() => setShowInjuryReport(false)}
        />
      )}

      {showDebugDiscipline && (
        <DisciplineDebugPanel
          season={season}
          activePlayerSuspensions={activePlayerSuspensions}
          onClose={() => setShowDebugDiscipline(false)}
        />
      )}

      <SeasonAchievementPopup />

      {showAchievements && (
        <AchievementsGallery onClose={() => setShowAchievements(false)} />
      )}

      {showTransactionLog && (
        <TransactionLogScreen season={season} onClose={() => setShowTransactionLog(false)} />
      )}

      {showSeasonHistory && (
        <SeasonHistoryPage season={season} onClose={() => setShowSeasonHistory(false)} />
      )}
    </div>
  );
}