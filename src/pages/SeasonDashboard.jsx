import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, TrendingUp, Play, Newspaper, FastForward } from 'lucide-react';
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
import { generateTradeDeadline, applyTrades, buildStatsMap, reapplyTradesFromLedger } from '@/lib/tradeDeadline';
import EndOfRegularSeasonScreen from '@/components/season/EndOfRegularSeasonScreen';
import PostseasonBracket from '@/components/season/PostseasonBracket';
import { calculateSeasonAwards } from '@/lib/seasonAwards';
import { generatePostseason } from '@/lib/postseason';
import { simGamesToDay } from '@/lib/seasonSimLoop';

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

      const currentSeason = seasons[0];
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

      try {
        const allResults = await base44.entities.GameResult.filter({ seasonId: currentSeason.id }, 'gameDay', 2106);
        setStandingsData(deriveStandings(allResults));
      } catch (e) { /* non-fatal */ }

      // Restore All-Star break state if the season is in a break phase
      if (currentSeason.allStarBreakPhase && currentSeason.allStarRosters) {
        setAllStarRosters(currentSeason.allStarRosters);
        setAllStarBreakVisible(true);
      } else {
        setAllStarRosters(null);
        setAllStarBreakVisible(false);
      }

      // Restore trade deadline state if the season has trades to show
      if (currentSeason.tradeDeadlinePhase === 'active' && currentSeason.tradeDeadlineTrades) {
        setTradeDeadlineTrades(currentSeason.tradeDeadlineTrades);
        setTradeDeadlineVisible(true);
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
      if (currentSeason.postseason && currentSeason.seasonPhase !== 'REGULAR_SEASON' && currentSeason.seasonPhase !== 'REGULAR_SEASON_COMPLETE') {
        setPostseasonData(currentSeason.postseason);
        setPostseasonVisible(true);
      } else {
        setPostseasonVisible(false);
        setPostseasonData(null);
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

      // 1984 rule: the All-Star Game result does NOT decide World Series home
      // field. The ASG is saved as a historical note only. WS home field is fixed
      // by the 1984 postseason rotation (NL hosts Games 1,2,6,7) - see
      // postseasonHomeField.js. We no longer write worldSeriesHomeFieldLeague here.
      await base44.entities.Season.update(season.id, {
        allStarBreakPhase: 'game_played',
        allStarGameResult: result,
        allStarMvp: mvp,
      });

      setSeason(prev => prev ? {
        ...prev,
        allStarBreakPhase: 'game_played',
        allStarGameResult: result,
        allStarMvp: mvp,
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

  const continueAfterTradeDeadline = async (approvedTrades) => {
    if (!season) return;
    try {
      setTradeDeadlineVisible(false);

      // Apply only approved trades (CPU trades always applied, user trades only if approved)
      if (approvedTrades && approvedTrades.length > 0) {
        applyTrades(approvedTrades);
      }

      // Mark which trades were applied in the persisted ledger so they can be
      // replayed on page reload (TEAMS re-imports fresh, losing in-memory mutations)
      const appliedPlayerNames = new Set();
      for (const t of (approvedTrades || [])) {
        t.teamAGets?.forEach(p => appliedPlayerNames.add(p.name));
        t.teamBGets?.forEach(p => appliedPlayerNames.add(p.name));
      }
      const updatedTrades = (tradeDeadlineTrades || []).map(t => ({
        ...t,
        applied: !t.isUserTrade || appliedPlayerNames.has(t.teamAGets?.[0]?.name),
      }));

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

      // No CPU games to sim on this day — advance to the next day with games
      if (toSim.length === 0) {
        await maybeAdvanceDay(season);
        await loadSeason();
        return;
      }

      const rotState = await loadRotationStateForActiveSeason();

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

        const homeSP = getProbableStarter(rotState, homeTeam, g.gameDate);
        const awaySP = getProbableStarter(rotState, awayTeam, g.gameDate);
        const unavailableRelievers = {
          home: getUnavailableRelievers(rotState, homeTeam, g.gameDate),
          away: getUnavailableRelievers(rotState, awayTeam, g.gameDate),
        };

        const finalState = simulateGameHeadless(homeTeam, awayTeam, { useDH, homeSP, awaySP, unavailableRelievers, rotationState: rotState, gameDate: g.gameDate });

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

        // Persist to SeasonAward entity
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
    if (showNewspaper || showWeeklyAwards || showMonthlyHonors || allStarBreakVisible || tradeDeadlineVisible || endOfRegularSeasonVisible || postseasonVisible) return;
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
  }, [simulating, season, schedule, showNewspaper, showWeeklyAwards, showMonthlyHonors, allStarBreakVisible, tradeDeadlineVisible, endOfRegularSeasonVisible, postseasonVisible]);

  const todaysUserGame = schedule.find(g => g.isUserGame && g.status !== 'final');
  const isUserOffDay = !todaysUserGame;

  const playUserGame = () => {
    if (!todaysUserGame || !season) return;
    // Session 23: pass the resolved starter NAMES in the launch URL so Home.jsx
    // uses the exact same pitcher the dashboard displayed — no re-resolution.
    const userSPName = probableStarters?.userSP?.name ? encodeURIComponent(probableStarters.userSP.name) : '';
    const oppSPName = probableStarters?.oppSP?.name ? encodeURIComponent(probableStarters.oppSP.name) : '';
    window.location.href = `/?seasonGame=${todaysUserGame.homeTeam},${todaysUserGame.awayTeam},${season.userTeam},${season.id},${todaysUserGame.gameDay},${todaysUserGame.id},${todaysUserGame.gameDate},${userSPName},${oppSPName}`;
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
            <Button onClick={loadSeason} variant="ghost" size="sm" className="px-2" disabled={simulating}>
              <RotateCcw className="w-3 h-3" />
            </Button>
            <Button onClick={handleReadNewspaper} variant="outline" size="sm" className="gap-1 text-[10px]" disabled={simulating || !gameResults?.length}>
              <Newspaper className="w-3 h-3" /> Paper
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline" size="sm" className="gap-1 text-[10px]">
              <Play className="w-3 h-3" /> Expo
            </Button>
          </div>
        </div>
      </div>

      {/* Next Game Hero Card */}
      <div className="shrink-0 bg-card border-b border-border px-4 py-3">
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
            <div className="flex items-center gap-3 mb-2 text-[10px] font-heading text-muted-foreground">
              <span className="text-foreground font-bold">{userSt.w}-{userSt.l}</span>
              {userSt.streakType && <span className={userSt.streakType === 'W' ? 'text-emerald-400' : 'text-red-400'}>Streak: {userSt.streakType}{userSt.streakLen}</span>}
              <span>{place}{suffix} {DIV_LABELS[userDiv]}</span>
              <span>{userSt.gb === 0 ? '-' : userSt.gb.toFixed(1) + ' GB'}</span>
              {lastGameLine && <span className="text-muted-foreground/70">Last: {lastGameLine}</span>}
            </div>
          );
        })()}

        {currentUserGame ? (
          <div className="space-y-2">
            <div>
              <div className="font-heading text-sm font-bold text-foreground">
                {TEAMS[currentUserGame.awayTeam]?.name} @ {TEAMS[currentUserGame.homeTeam]?.name}
              </div>
              {probableStarters && (
                <div className="text-[10px] text-muted-foreground font-heading">
                  {probableStarters.userSP?.name || 'TBD'} vs {probableStarters.oppSP?.name || 'TBD'}
                </div>
              )}
              <div className="text-[10px] text-muted-foreground">
                {TEAMS[currentUserGame.homeTeam]?.stadium}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {todaysUserGame ? (
                <Button onClick={playUserGame} className="gap-1 flex-1 min-w-[120px]" size="sm">
                  <Play className="w-4 h-4" /> Play My Game
                </Button>
              ) : (
                <>
                  <div className="text-[10px] font-heading text-amber-400 font-bold px-2">OFF DAY</div>
                  <Button onClick={simToNextUserGame} disabled={simulating} variant="secondary" size="sm" className="gap-1">
                    <FastForward className="w-3 h-3" /> Sim to My Next Game
                  </Button>
                </>
              )}
              <Button onClick={simulateDay} disabled={simulating} variant={todaysUserGame ? "outline" : "secondary"} size="sm" className="gap-1">
                {simulating ? <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                Simulate Day
              </Button>
              <Button onClick={() => simToMonthFinale(4)} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-amber-400">
                <FastForward className="w-3 h-3" /> Sim to April Finale
              </Button>
              <Button onClick={simToJuly8} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-cyan-400">
                <FastForward className="w-3 h-3" /> Sim to July 8
              </Button>
              <Button onClick={simToAugust30} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-amber-400">
                <FastForward className="w-3 h-3" /> Sim to Aug 30
              </Button>
              <Button onClick={simToUserFinalGame} disabled={simulating} variant="ghost" size="sm" className="gap-1 text-[10px] text-emerald-400">
                <FastForward className="w-3 h-3" /> Sim to Final Game
              </Button>
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
          onPlayGame={() => { /* Postseason game play - deferred */ }}
          onSimPostseason={() => { /* Postseason sim - deferred */ }}
          onContinue={() => setPostseasonVisible(false)}
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
    </div>
  );
}