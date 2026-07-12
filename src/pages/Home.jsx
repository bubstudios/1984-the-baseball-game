import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS, PITCH_TYPES, SWING_TYPES, MANAGERS } from '@/lib/gameData';
import { createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing, getCurrentBatter, getCurrentPitcher, getEffectivePitcher, getBattingTeam, getSituationalBatter, attemptSteal, setHitAndRun, cpuDecideSteal, cpuDecideSubstitutions, hasRunnersOnBase, pinchHit, pinchRun, defensiveSwitch, changePitcher, intentionalWalk, cpuCheckPinchHit, pickCpuReliever } from '@/lib/gameEngine';
import { resolveEjectionReplacement } from '@/lib/ejectionReplacement';
import { applyWeatherEffects, generateWeather, generateIndoorWeather } from '@/lib/weather';
import { STADIUM_WEATHER_CITIES, DOMED_STADIUMS } from '@/lib/ballparks';
import ModeSelect from '@/components/game/ModeSelect';
import TeamSelect from '@/components/game/TeamSelect';
import BallparkSelect from '@/components/game/BallparkSelect';
import LineupManager from '@/components/game/LineupManager';
import DiamondView from '@/components/game/DiamondView';
import Scoreboard from '@/components/game/Scoreboard';
import CommentaryBanner, { TEAM_TO_FLAVOR, STADIUM_FLAVOR } from '@/components/game/CommentaryBanner';
import MatchupCard from '@/components/game/MatchupCard';
import ActionPanel from '@/components/game/ActionPanel';
import PlayLog from '@/components/game/PlayLog';
import BoxScore from '@/components/game/BoxScore';
import SubstitutionsPanel from '@/components/game/SubstitutionsPanel';
import Fireworks from '@/components/game/Fireworks';
import ArgumentsBanner from '@/components/game/ArgumentsBanner';
import BallparkEventBanner from '@/components/game/BallparkEventBanner';
import PitcherIsPumpedPopup from '@/components/game/PitcherIsPumpedPopup';
import IncidentLog from '@/components/game/IncidentLog';

import BeanballBanner from '@/components/game/BeanballBanner';
import GameSummary from '@/components/game/GameSummary';
import GameEventBanner from '@/components/game/GameEventBanner';
import PitcherInjuryModal from '@/components/game/PitcherInjuryModal';
import BatterInjuryModal from '@/components/game/BatterInjuryModal';
import PregameIllnessModal from '@/components/game/PregameIllnessModal';
import InjuryAlertModal from '@/components/game/InjuryAlertModal';

import { getHBPCall, getWarningCall, getEjectionCall, getBatFlipCall, getCollisionCall, getBrawlCall } from '@/lib/beanballCommentary';
import { getNoWarningExplanation } from '@/lib/beanball';
import ErrorBoundary from '@/components/game/ErrorBoundary';
import { getArgumentSeverity, resolveArgument, getEjectionCommentary, maybeDugoutChirp } from '@/lib/umpireArguments';
import { pickUmpire, getManagerUmpireRelation } from '@/lib/umpires';
import { rollBallparkEvent, resetBallparkEvents } from '@/lib/ballparkEvents';
import { trackGrooverSighting } from '@/lib/achievements';
import useRobotAnnouncer, { unlockRobotAnnouncer } from '@/hooks/useRobotAnnouncer';
import TutorialModal, { hasSeenTutorial } from '@/components/game/TutorialModal';
import RetroLoading from '@/components/game/RetroLoading';
import useRetroAudio, { unlockAudio } from '@/hooks/useRetroAudio';
import { checkGameAchievements, ACHIEVEMENTS, getUnlockedCount, ensureStatsInit, trackSessionStart, trackGameCompleted, trackGameEndTime, checkTeamAchievements, unlockAchievement, trackHomeRunDistance, trackGameRecords, trackPlayersUsed, trackTimePlayed } from '@/lib/achievements';
import { base44 } from '@/api/base44Client';
import AchievementPopup from '@/components/game/AchievementPopup';
import LeaderProgressPopup from '@/components/game/LeaderProgressPopup';
import { RotateCcw, Trophy, Users, Volume2, VolumeX, HelpCircle, Radio } from 'lucide-react';
import InlineSponsorBanner from '@/components/game/InlineSponsorBanner';
import BannerPopup from '@/components/game/BannerPopup';
import BatterStatBanner from '@/components/game/BatterStatBanner';
import { checkRunnerInjury as checkRunnerInjuryBase, checkSlidingInjury as checkSlidingInjuryBase, checkFielderInjury as checkFielderInjuryBase } from '@/lib/injuryChecks';
import { TEAM_BANNERS, getBannersForTeam } from '@/lib/teamBannerData';

import WinCelebration from '@/components/game/WinCelebration';
import { getVictoryCall } from '@/lib/victoryCalls';
import CardAwardModal from '@/components/game/CardAwardModal';
import { getRandomCardForTeam, addCard, loadFromStorage, saveToStorage, migrateLegacyStorage, getCollectedIds } from '@/lib/baseballCards';
import FanChirpToast from '@/components/game/FanChirpToast';
import { checkAndResolveIncident } from '@/lib/incidentIntegration';
import { checkPitcherInjury } from '@/lib/pitcherInjuries';
import { rollBatterInjury, rollHBPIfBatter, replaceInjuredBatter } from '@/lib/batterInjuries';
import { rollRunnerInjury } from '@/lib/runnerInjuries';
import { rollSlidingInjury, getSlideChance } from '@/lib/slidingInjuries';
import { rollFielderInjury } from '@/lib/fielderInjuries';
import { rollIllnessesForTeam } from '@/lib/illnessSystem';
import { getProbableStarter, advanceRotation, loadRotationStateForActiveSeason, persistRotationState, getUnavailableRelievers, getUnavailableRelieverReasons, getTiredRelievers, recordPitcherWorkload, isPitcherAvailable, buildSeasonGameResultFromState, markScheduleRowFinal, maybeAdvanceDay, isBullpenDayForTeam, validateStarterGuard, commitPlayerStats, getStarterFatigueStatus, isStarterEligible, hasFreshReliever, getBullpenDayOpener, getRestDays } from '@/lib/seasonStore';
import { buildGameResultFromState } from '@/lib/seasonEngine';
import { injectAllStarTeams, removeAllStarTeams } from '@/lib/allStarTeams';
import { calculateAllStarMvp } from '@/lib/allStarMvp';
import { hasReachedAllStarPitchLimit } from '@/lib/allStarRules';
import { checkBatterInjury as checkBatterInjuryExternal } from '@/lib/batterInjuryCheck';
import { loadActiveInjuries, recordInjury, resolveStarterSkippingInjuries } from '@/lib/injuryPersistence';
import { loadActiveSuspensions, recordSuspension } from '@/lib/managerSuspension';
import { checkArgumentLogic } from '@/lib/argumentLogic';
import { checkHBPEjection, checkChargingMound, checkBatterArguesStrikes, applyPlayerEjection, applyMultipleEjections, checkBenchClearingBrawl, getGameEjections, findPlayerInGame, getPreviousBatter } from '@/lib/playerEjectionEngine';
import DisciplineIncidentBanner from '@/components/game/DisciplineIncidentBanner';
import { recordPlayerSuspension, loadActivePlayerSuspensions, buildSuspendedPlayerSet } from '@/lib/playerDiscipline';
import { recordEjectionTxn } from '@/lib/transactionLog';
import AtmosphereDebugPanel from '@/components/game/AtmosphereDebugPanel';
import { inc as incAtmo, resetCounters as resetAtmoCounters, forceBallparkEvent, forceCelebrationText, forceBenchChirp, forceRobbedHRText } from '@/lib/atmosphereDebug';


export default function Home() {
  const [gameMode, setGameMode] = useState(null); // 'exhibition' | 'season'
  const [gameState, setGameState] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [seasonUserTeam, setSeasonUserTeam] = useState(null);
  const [forcedStarters, setForcedStarters] = useState(null); // { user, cpu } in season mode; null in exhibition
  const [starterNotice, setStarterNotice] = useState(null); // shown when a short-rest SP is replaced by a bullpen opener
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('game');
  const [ballparkPhase, setBallparkPhase] = useState(null); // { home, away }
  const [lineupPhase, setLineupPhase] = useState(null); // { home, away, useDH, parkTeam }
  const [gameStadium, setGameStadium] = useState(null);
  const [useDH, setUseDH] = useState(false);
  const [gameWeather, setGameWeather] = useState(null);
  const [showSubs, setShowSubs] = useState(false);
  const [subsTab, setSubsTab] = useState('pinchhit');
  const [hrTrigger, setHrTrigger] = useState(0);
  const [winTrigger, setWinTrigger] = useState(0);
  const [robotVoice, setRobotVoice] = useState(false);
  const [retroAudio, setRetroAudio] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);
  const [newAchievements, setNewAchievements] = useState([]);
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [leaderProgress, setLeaderProgress] = useState(null);  // {challengeName, playerName, playerProgress, totalPlayers, statType, icon}
  const [argumentResult, setArgumentResult] = useState(null);
  const [selectedUmpire, setSelectedUmpire] = useState(null);
  const [ejectionCount, setEjectionCount] = useState(0);
  const [ballparkEvent, setBallparkEvent] = useState(null);
  const [ejectionResult, setEjectionResult] = useState(null);
  const [pitcherInjury, setPitcherInjury] = useState(null);
  const [batterInjury, setBatterInjury] = useState(null);
  const [runnerInjury, setRunnerInjury] = useState(null);
  const [slidingInjury, setSlidingInjury] = useState(null);
  const [fielderInjury, setFielderInjury] = useState(null);
  const [pregameIllnesses, setPregameIllnesses] = useState(null);
  const [injuryAlert, setInjuryAlert] = useState(null);
  const seasonContextRef = useRef(null); // { seasonId, gameDay, homeTeam, awayTeam, userTeam }
  const seasonRotationStateRef = useRef({}); // persisted to Season entity
  const gameModeRef = useRef(null); // mirrors gameMode so startGame (empty-deps callback) always reads the latest value
  const prevLastPlay = useRef(null);
  const prevArgPlay = useRef(null);
  const prevGameOver = useRef(false);
  const gameStartTimeRef = useRef(null);
  const prevLogLength = useRef(0);
  const prevInning = useRef(null);
  const prevBallparkPlay = useRef(null);
  const achievementsQueuedRef = useRef(false);
  const [showStretch, setShowStretch] = useState(null);
  const [bannerQueue, setBannerQueue] = useState([]);
  const [activeBanner, setActiveBanner] = useState(null);
  const [bannerSeq, setBannerSeq] = useState(0);
  const [bannerPopup, setBannerPopup] = useState(null);
  const [beanballEvent, setBeanballEvent] = useState(null);
  const [cardAward, setCardAward] = useState(null);
  const [cardPending, setCardPending] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [catcherThrowOut, setCatcherThrowOut] = useState(null);
  const [collisionPopup, setCollisionPopup] = useState(null);
  const [inlineGameEvent, setInlineGameEvent] = useState(null); // { type: 'celebration'|'caughtstealing'|'ballpark', event: data }
  const [gameOverPopup, setGameOverPopup] = useState(null); // { winner, score, finalPlay }
  const [seasonCommitting, setSeasonCommitting] = useState(false);
  const [disciplineIncident, setDisciplineIncident] = useState(null);
  const seasonCommitPromiseRef = useRef(null);
  const prevCelebrationBubble = useRef(null);
  const seasonInjuriesRef = useRef([]);
  const seasonSuspendedTeamsRef = useRef(new Set());
  const seasonSuspendedPlayerNamesRef = useRef(new Set());
  const [seasonBatterStatsMap, setSeasonBatterStatsMap] = useState({});
  const seasonStatsLoadedRef = useRef(false);
  const [forceFanChirpTrigger, setForceFanChirpTrigger] = useState(0);

  // Keep gameModeRef in sync so startGame (empty-deps useCallback) always reads the latest mode.
  // Without this, a season game launch would see gameMode=null in startGame's closure and skip
  // the CPU bullpen filtering + unavailable-reliever tracking for the user's team.
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

  // Load season batter stats once when a season game starts (for the scoreboard banner)
  useEffect(() => {
    if (!gameState || gameMode !== 'season' || seasonStatsLoadedRef.current) return;
    const ctx = seasonContextRef.current;
    if (!ctx?.seasonId) return;
    seasonStatsLoadedRef.current = true;
    (async () => {
      try {
        const stats = await base44.entities.PlayerStats.filter({ seasonId: ctx.seasonId }, null, 1500);
        const map = {};
        for (const s of stats) {
          map[`${s.team}|${s.playerName}`] = {
            ab: s.atBats || 0, h: s.hits || 0,
            hr: s.homeRuns || 0, rbi: s.rbi || 0,
          };
        }
        setSeasonBatterStatsMap(map);
      } catch (e) { console.error('Batter stats load failed:', e); }
    })();
  }, [gameState, gameMode]);

  // Auto-show tutorial on first visit & init stats
  useEffect(() => {
    // Detect season game launch (?seasonGame=homeTeam,awayTeam,userTeam) and jump straight to ballpark phase
    const urlParams = new URLSearchParams(window.location.search);
    const seasonGame = urlParams.get('seasonGame');
    if (seasonGame) {
      // Clean the URL so a subsequent "New Game" doesn't re-trigger
      window.history.replaceState({}, '', '/');
      (async () => {
        try {
          const parts = seasonGame.split(',');
          const homeTeamKey = parts[0];
          const awayTeamKey = parts[1];
          const userTeamParam = parts[2] || homeTeamKey;
          const seasonId = parts[3] || null;
          const gameDayNum = parts[4] ? parseInt(parts[4], 10) : 1;
          const scheduleId = parts[5] || null;
          const gameDateStr = parts[6] || null;
          if (!homeTeamKey || !awayTeamKey || !TEAMS[homeTeamKey] || !TEAMS[awayTeamKey]) {
            console.error('[season-launch] Invalid team keys in seasonGame param, redirecting to /season');
            window.location.href = '/season';
            return;
          }
          setGameMode('season');
          setSeasonUserTeam(userTeamParam);
          seasonContextRef.current = { seasonId, gameDay: gameDayNum, gameDate: gameDateStr, homeTeam: homeTeamKey, awayTeam: awayTeamKey, userTeam: userTeamParam, scheduleId };
          // Load rotation state and pick starters (day-based rest enforced)
          const rotState = await loadRotationStateForActiveSeason();
          seasonRotationStateRef.current = rotState;
          const oppTeamKey = (userTeamParam === homeTeamKey) ? awayTeamKey : homeTeamKey;
          // Session 23: Starter identity lock. The dashboard resolved the probable
          // starters and passed their names in the URL. Use those EXACT names
          // instead of re-resolving — prevents the displayed starter drifting from
          // the actual game starter (Rijo-shown / Niekro-pitched bug).
          const userStarterName = parts[7] ? decodeURIComponent(parts[7]) : null;
          const oppStarterName = parts[8] ? decodeURIComponent(parts[8]) : null;
          const suspendedPlayerNamesParam = parts[9] ? decodeURIComponent(parts[9]).split('|').filter(n => n) : [];
          const findPitcherByName = (teamKey, name) => {
            if (!name || !teamKey) return null;
            const td = TEAMS[teamKey];
            const pool = [...(td.rotation || []), ...(td.bullpen || [])];
            return pool.find(p => p.name === name) || null;
          };
          const userStarter = userStarterName ? findPitcherByName(userTeamParam, userStarterName) : getProbableStarter(rotState, userTeamParam, gameDateStr);
          const cpuStarter = oppStarterName ? findPitcherByName(oppTeamKey, oppStarterName) : getProbableStarter(rotState, oppTeamKey, gameDateStr);
          if (userStarterName && (!userStarter || userStarter.name !== userStarterName)) {
            console.error(`[season-launch] STARTER LOCK MISMATCH: dashboard said "${userStarterName}" but could not resolve that pitcher for ${userTeamParam}`);
          }
          // getProbableStarter is the single source of truth. It already enforces rest
          // rules and only returns a bullpen opener when the ENTIRE rotation is
          // exhausted. We do NOT override a rotation SP with a bullpen opener just
          // because a fresh reliever exists — that caused premature bullpen days.
          // A short-rest SP start is always preferred over a reliever.
          const validateSeasonStarter = (resolved, teamKey) => {
            if (!resolved || !gameDateStr || !teamKey) return resolved;
            // Only warn if the resolved starter is on short rest (the resolver may
            // have chosen a Tier 2 emergency short-rest start). Do NOT replace him.
            if (!isStarterEligible(rotState, teamKey, resolved.name, gameDateStr)) {
              const restDays = getRestDays(rotState, teamKey, resolved.name, gameDateStr);
              const rotationNames = (TEAMS[teamKey]?.rotation || []).map(p => p.name);
              const isRotationSP = rotationNames.includes(resolved.name);
              if (isRotationSP) {
                console.warn(`[starter-validation] ${teamKey}: ${resolved.name} starting on short rest (${restDays} days) - rotation SP, not replaced`);
              }
            }
            return resolved;
          };
          const validatedUserStarter = validateSeasonStarter(userStarter, userTeamParam);
          const validatedCpuStarter = validateSeasonStarter(cpuStarter, oppTeamKey);
          setForcedStarters({ user: validatedUserStarter, cpu: validatedCpuStarter });
          // Season games use the home team's stadium (schedule-determined) - skip BallparkSelect
          const stadium = TEAMS[homeTeamKey].stadium;
          let weather;
          if (DOMED_STADIUMS.has(stadium)) {
            weather = generateIndoorWeather();
          } else {
            const weatherCity = STADIUM_WEATHER_CITIES[stadium] || TEAMS[homeTeamKey].city;
            weather = generateWeather(weatherCity);
          }
          const umpire = pickUmpire();
          setSelectedUmpire(umpire);
          const useDHFlag = TEAMS[homeTeamKey].league === 'AL';
          const homeIll = rollIllnessesForTeam(TEAMS[homeTeamKey], false);
          const awayIll = rollIllnessesForTeam(TEAMS[awayTeamKey], false);
          const illPlayers = { home: homeIll, away: awayIll };
          setPregameIllnesses(homeIll.length > 0 || awayIll.length > 0 ? illPlayers : null);
          // Load active season injuries - injured players are scratched for this game
          let injuredPlayerNames = [];
          if (seasonId) {
            try {
              const seasonInjuries = await loadActiveInjuries(seasonId);
              injuredPlayerNames = seasonInjuries.filter(i => i.teamKey === homeTeamKey || i.teamKey === awayTeamKey).map(i => i.playerName);
            } catch (e) { console.error('[injuries] Load failed:', e); }
          }
          // Load active manager suspensions - suspended managers can't argue or be ejected
          let suspendedTeamKeys = new Set();
          if (seasonId) {
            try {
              const suspensions = await loadActiveSuspensions(seasonId);
              suspendedTeamKeys = new Set(suspensions.filter(s => s.teamKey === homeTeamKey || s.teamKey === awayTeamKey).map(s => s.teamKey));
              seasonSuspendedTeamsRef.current = suspendedTeamKeys;
            } catch (e) { console.error('[suspensions] Load failed:', e); }
          // Load active player suspensions - suspended players can't play
          if (seasonId) {
            try {
              const playerSuspensions = await loadActivePlayerSuspensions(seasonId);
              const suspendedNames = buildSuspendedPlayerSet(playerSuspensions, new Set([homeTeamKey, awayTeamKey]));
              // Merge with URL-passed names (from dashboard)
              for (const n of suspendedPlayerNamesParam) suspendedNames.add(n);
              seasonSuspendedPlayerNamesRef.current = suspendedNames;
            } catch (e) { console.error('[playerDiscipline] Load failed:', e); }
          }
          }
          setLineupPhase({ home: homeTeamKey, away: awayTeamKey, useDH: useDHFlag, parkTeam: homeTeamKey, weather, illPlayers, seasonUserTeam: userTeamParam, rotationState: rotState, gameDay: gameDayNum, gameDate: gameDateStr, injuredPlayerNames, suspendedTeamKeys: [...suspendedTeamKeys], suspendedPlayerNames: [...seasonSuspendedPlayerNamesRef.current] });
          setLoadingScreen(false);
        } catch (launchError) {
          // Season launch failed (e.g. rotation state load error) — don't leave the user
          // stranded on the Exhibition TeamSelect screen with gameMode='season' but no lineup.
          // Reset and redirect back to the season dashboard.
          console.error('[season-launch] Failed to launch season game:', launchError);
          setGameMode(null);
          setSeasonUserTeam(null);
          seasonContextRef.current = null;
          window.location.href = '/season';
        }
      })();
    }
    // Detect All-Star Game launch (?allStarGame=homeTeamKey,awayTeamKey,userAllStarKey,seasonId,stadium,homeLeague)
    const allStarParam = urlParams.get('allStarGame');
    if (allStarParam) {
      window.history.replaceState({}, '', '/');
      (async () => {
        try {
          const parts = allStarParam.split(',');
          const homeTeamKey = parts[0];
          const awayTeamKey = parts[1];
          const userAllStarKey = parts[2];
          const seasonId = parts[3] || null;
          const stadiumName = parts[4] ? decodeURIComponent(parts[4]) : 'All-Star Stadium';
          const homeLeague = parts[5] || 'NL';

          // Load the season to get allStarRosters
          const s = await base44.entities.Season.get(seasonId);
          if (!s || !s.allStarRosters) {
            console.error('[allstar-launch] No All-Star rosters found on season');
            window.location.href = '/season';
            return;
          }

          // Inject synthetic All-Star teams into TEAMS
          injectAllStarTeams(s.allStarRosters);

          setGameMode('allstar');
          setSeasonUserTeam(userAllStarKey);
          seasonContextRef.current = {
            seasonId, gameDay: 0, gameDate: '1984-07-10',
            homeTeam: homeTeamKey, awayTeam: awayTeamKey,
            userTeam: userAllStarKey, scheduleId: null,
            isAllStar: true, allStarRosters: s.allStarRosters, stadium: stadiumName,
          };

          // Find starting pitchers from the rosters
          const findAllStarSP = (league) => {
            const roster = s.allStarRosters[league];
            if (!roster) return null;
            const spName = roster.pitchers?.startingPitcherName;
            if (!spName) return null;
            const spEntry = (roster.pitchers?.starters || []).find(p => p.name === spName);
            if (!spEntry) return null;
            // Look up full player object from TEAMS
            const td = TEAMS[spEntry.teamKey];
            if (!td) return null;
            const pool = [...(td.rotation || []), ...(td.bullpen || [])];
            return pool.find(p => p.name === spName) || null;
          };

          const homeLeagueKey = homeLeague;
          const awayLeagueKey = homeLeague === 'AL' ? 'NL' : 'AL';
          const homeSP = findAllStarSP(homeLeagueKey);
          const awaySP = findAllStarSP(awayLeagueKey);

          // Generate weather for the stadium
          const stadiumTeam = TEAMS[s.allStarRosters.stadiumTeamKey];
          let weather;
          if (stadiumTeam && DOMED_STADIUMS.has(stadiumTeam.stadium)) {
            weather = generateIndoorWeather();
          } else {
            const weatherCity = stadiumTeam ? (STADIUM_WEATHER_CITIES[stadiumTeam.stadium] || stadiumTeam.city) : 'New York';
            weather = generateWeather(weatherCity);
          }
          const umpire = pickUmpire();
          setSelectedUmpire(umpire);

          // Start the All-Star Game (no DH, no illnesses, no scratches)
          startGame(homeTeamKey, awayTeamKey, null, null, false, weather, homeSP, awaySP, userAllStarKey, []);
          setLoadingScreen(false);
        } catch (launchError) {
          console.error('[allstar-launch] Failed to launch All-Star game:', launchError);
          removeAllStarTeams();
          window.location.href = '/season';
        }
      })();
    }
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
    }
    ensureStatsInit();
    trackSessionStart();
    migrateLegacyStorage();
    try { base44.analytics.track({ eventName: 'session_start' }); } catch (e) { /* analytics optional */ }
  }, []);

  // Robot announcer - use stadium's lead announcer voice
  const announcerName = homeTeam && TEAM_TO_FLAVOR[homeTeam]
    ? STADIUM_FLAVOR[TEAM_TO_FLAVOR[homeTeam]]?.announcers?.[0]
    : null;
  useRobotAnnouncer(gameState, robotVoice, announcerName);
  useRetroAudio(gameState, retroAudio);

  const startGame = useCallback((home, away, customHomeLineup, customAwayLineup, useDHFlag, weather, startingPitcher, opponentStartingPitcher, seasonUserTeam, scratchedPlayers) => {
    setHomeTeam(home);
    setAwayTeam(away);
    const effectiveUserTeam = seasonUserTeam || home;
    setUserTeam(effectiveUserTeam);
    setUseDH(useDHFlag);
    const umpire = selectedUmpire || pickUmpire();
    setSelectedUmpire(umpire);
    setEjectionCount(0);
    setArgumentResult(null);
    setBallparkEvent(null);
    setBeanballEvent(null);
    setPitcherInjury(null);
    setBatterInjury(null);
    setRunnerInjury(null);
    setSlidingInjury(null);
    setFielderInjury(null);
    resetBallparkEvents();
    const stadium = TEAMS[home]?.stadium || null;
    setGameStadium(stadium);
    setGameWeather(weather || null);
    // Map SPs: startingPitcher = user's SP, opponentStartingPitcher = CPU's SP
    // createGameState expects: param 8 = home SP, param 9 = away SP
    let homeSP, awaySP;
    if (effectiveUserTeam === home) {
      homeSP = startingPitcher;
      awaySP = opponentStartingPitcher;
    } else {
      homeSP = opponentStartingPitcher;
      awaySP = startingPitcher;
    }
    const state = createGameState(home, away, customHomeLineup, customAwayLineup, useDHFlag, weather, umpire, homeSP, awaySP, scratchedPlayers);
    state.userTeam = effectiveUserTeam; // CRITICAL: gates in getControllingTeam() read state.userTeam to distinguish CPU from user
    state.homeStartingPitcherName = homeSP?.name || null;
    state.awayStartingPitcherName = awaySP?.name || null;
    // Scratched players (illness/ailment) are unavailable for the entire game.
    // Filter them from both bullpens so no substitution system can select them.
    if (scratchedPlayers && scratchedPlayers.length > 0) {
      state.scratchedPlayers = [...scratchedPlayers];
      state.homeBullpen = state.homeBullpen.filter(p => !scratchedPlayers.includes(p.name));
      state.awayBullpen = state.awayBullpen.filter(p => !scratchedPlayers.includes(p.name));
    }
    // Season mode: set suspended manager flags so argument/ejection system skips them
    if (gameModeRef.current === 'season') {
      const suspended = seasonSuspendedTeamsRef.current;
      if (suspended.has(home)) state._homeManagerSuspended = true;
      if (suspended.has(away)) state._awayManagerSuspended = true;
    }
    // Session 23: Starter identity lock check. The actual mound pitcher must
    // match the locked starter from the launch path. Loud console.error so a
    // mismatch is caught immediately instead of silently starting the wrong arm.
    if (gameModeRef.current === 'season' && forcedStarters) {
      const expectedUserSP = forcedStarters.user?.name;
      if (expectedUserSP) {
        const actualUserSP = effectiveUserTeam === home ? state.homePitcher?.name : state.awayPitcher?.name;
        if (actualUserSP && actualUserSP !== expectedUserSP) {
          console.error(`[starter-lock] MISMATCH: scheduled "${expectedUserSP}" but actual "${actualUserSP}" for ${effectiveUserTeam}`);
        }
      }
    }
    // Season mode: filter CPU bullpen for unavailable relievers + track user's unavailable relievers.
    // Use gameModeRef (not gameMode) because this useCallback has empty deps — the closure
    // would otherwise capture the initial gameMode=null and skip season bullpen filtering.
    if (gameModeRef.current === 'season' && seasonRotationStateRef.current) {
      const cpuSide = effectiveUserTeam === home ? 'away' : 'home';
      const cpuTeamKey = cpuSide === 'home' ? home : away;
      const gameDate = seasonContextRef.current?.gameDate || null;
      const cpuUnavailable = getUnavailableRelievers(seasonRotationStateRef.current, cpuTeamKey, gameDate);
      if (cpuUnavailable.length > 0) {
        const bullpenKey = cpuSide === 'home' ? 'homeBullpen' : 'awayBullpen';
        state[bullpenKey] = state[bullpenKey].filter(p => !cpuUnavailable.includes(p.name));
      }
      state._unavailableRelievers = getUnavailableRelievers(seasonRotationStateRef.current, effectiveUserTeam, gameDate);
      state._unavailableRelieverReasons = getUnavailableRelieverReasons(seasonRotationStateRef.current, effectiveUserTeam, gameDate);
      state._tiredRelievers = getTiredRelievers(seasonRotationStateRef.current, effectiveUserTeam, gameDate);
      // Annotate season fatigue penalty on all bullpen arms for CPU ranking + UI badges
      const annotateFatigue = (bullpen, teamKey) => {
        bullpen.forEach(p => {
          const avail = isPitcherAvailable(seasonRotationStateRef.current, teamKey, p.name, gameDate);
          p._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
        });
      };
      annotateFatigue(state.homeBullpen, home);
      annotateFatigue(state.awayBullpen, away);

      // Annotate starting pitchers with season-rest fatigue (3+ days rest = fresh,
      // 2 = short rest). getEffectivePitcher applies the penalty.
      if (gameDate) {
        const annotateStarter = (pitcher, teamKey) => {
          if (!pitcher) return;
          const isRotationSP = (TEAMS[teamKey]?.rotation || []).some(p => p.name === pitcher.name);
          if (isRotationSP) {
            const status = getStarterFatigueStatus(seasonRotationStateRef.current, teamKey, pitcher.name, gameDate);
            pitcher._seasonFatiguePenalty = status.penalty;
          } else {
            // Bullpen opener - apply reliever workload fatigue, not starter rest fatigue
            const avail = isPitcherAvailable(seasonRotationStateRef.current, teamKey, pitcher.name, gameDate);
            pitcher._seasonFatiguePenalty = avail.tired ? avail.fatiguePenalty : 0;
          }
        };
        annotateStarter(state.homePitcher, home);
        annotateStarter(state.awayPitcher, away);
      }
    }
    const homeName = TEAMS[home].name;
    const awayName = TEAMS[away].name;
    state.log.push({ type: 'info', text: `⚾ Play ball! ${awayName} at ${homeName}` });
    if (umpire) {
      state.log.push({ type: 'info', text: `👨‍⚖️ Home plate umpire: ${umpire.name} - "${umpire.nick}"` });
      state.log.push({ type: 'info', text: `   ${umpire.pregameLine}` });
    }
    if (weather) {
      state.log.push({ type: 'info', text: `🌤 ${weather.summary} - ${weather.date}` });
      if (weather.effects.length > 0) {
        weather.effects.forEach(e => state.log.push({ type: 'info', text: `   ${e}` }));
      }
    }
    state.log.push({ type: 'info', text: `Top of inning 1 - ${awayName} batting` });
    setGameState(state);
    setLineupPhase(null);
    gameStartTimeRef.current = Date.now();
    try { base44.analytics.track({ eventName: 'game_started', properties: { home_team: home, away_team: away, use_dh: useDHFlag, mode: gameMode || 'exhibition' } }); } catch (e) { /* analytics optional */ }
  }, []);

  const handleModeSelect = useCallback((mode) => {
    if (mode === 'exhibition') {
      setGameMode('exhibition');
    }
    if (mode === 'season') {
      window.location.href = '/season';
    }
  }, []);

  const handleTeamSelect = useCallback((home, away) => {
    setBallparkPhase({ home, away });
  }, []);

  const handleBallparkConfirm = useCallback((parkTeam, useDHFlag, weather, umpire) => {
    setSelectedUmpire(umpire);
    // Ballpark's team is always home; swap if needed
    const homeTeam = parkTeam;
    const awayTeam = parkTeam === ballparkPhase.home ? ballparkPhase.away : ballparkPhase.home;
    // Preserve the user's selected team through the park swap.
    // In exhibition, ballparkPhase.home IS the user's team (TeamSelect passes userTeam first).
    // In season, seasonUserTeam is already set; if a swap happened, map it to the new home/away.
    let updatedSeasonUser = seasonUserTeam || ballparkPhase.home;
    if (seasonUserTeam && homeTeam !== ballparkPhase.home) {
      updatedSeasonUser = seasonUserTeam === ballparkPhase.home ? awayTeam : homeTeam;
    }
    // Roll pre-game illnesses (Season: ~2% per team; Exhibition: ~4% per team)
    const isExhibitionMode = gameMode === 'exhibition';
    const homeIll = rollIllnessesForTeam(TEAMS[homeTeam], isExhibitionMode);
    const awayIll = rollIllnessesForTeam(TEAMS[awayTeam], isExhibitionMode);
    const illPlayers = { home: homeIll, away: awayIll };
    setPregameIllnesses(homeIll.length > 0 || awayIll.length > 0 ? illPlayers : null);
    setLineupPhase({ home: homeTeam, away: awayTeam, useDH: useDHFlag, parkTeam, weather, illPlayers, seasonUserTeam: updatedSeasonUser });
    setBallparkPhase(null);
  }, [ballparkPhase, seasonUserTeam, gameMode]);

  const handleLineupConfirm = useCallback((customLineup, startingPitcher, opponentStartingPitcher) => {
    const seasonUser = lineupPhase.seasonUserTeam;
    const userIsHome = !seasonUser || seasonUser === lineupPhase.home;

    // The CPU team is the one the user is NOT managing
    const cpuTeamKey = userIsHome ? lineupPhase.away : lineupPhase.home;
    const cpuIllKey = userIsHome ? 'away' : 'home';
    const cpuIll = lineupPhase.illPlayers?.[cpuIllKey] || [];

    let customHomeLineup = userIsHome ? customLineup : null;
    let customAwayLineup = userIsHome ? null : customLineup;
    let adjustedOpponentSP = opponentStartingPitcher;

    // Build CPU lineup with ill/injured players replaced by bench
    const cpuInjuredNames = (lineupPhase.injuredPlayerNames || []).filter(n => {
      const cd = TEAMS[cpuTeamKey];
      return cd && [...cd.lineup, ...(cd.bench || []), ...(cd.rotation || []), ...(cd.bullpen || [])].some(p => p.name === n);
    });
    if (cpuIll.length > 0 || cpuInjuredNames.length > 0) {
      const cpuData = TEAMS[cpuTeamKey];
      const illNames = new Set([...cpuIll.map(p => p.name), ...cpuInjuredNames]);
      const usedNames = new Set(illNames);
      const healthyBench = (cpuData.bench || []).filter(p => !illNames.has(p.name));
      const cpuLineup = cpuData.lineup.map(p => {
        if (illNames.has(p.name)) {
          const replacement = healthyBench.find(b => !usedNames.has(b.name));
          if (replacement) {
            usedNames.add(replacement.name);
            return replacement;
          }
        }
        usedNames.add(p.name);
        return p;
      });
      if (userIsHome) {
        customAwayLineup = cpuLineup;
      } else {
        customHomeLineup = cpuLineup;
      }
      // Replace CPU SP if ill
      if (adjustedOpponentSP && illNames.has(adjustedOpponentSP.name)) {
        const healthyPitchers = (cpuData.rotation || []).filter(p => !illNames.has(p.name));
        adjustedOpponentSP = healthyPitchers[0] || adjustedOpponentSP;
      }
    }
    // Season mode: the locked starters from the launch path are the single source
    // of truth. Use them directly — do NOT re-resolve or override via the guard.
    // Rest eligibility was already enforced when the dashboard resolved probable
    // starters; re-validating here caused the Rijo→Niekro override bug.
    let effectiveUserStarter = startingPitcher;
    if (gameMode === 'season' && forcedStarters) {
      adjustedOpponentSP = forcedStarters.cpu || opponentStartingPitcher;
      effectiveUserStarter = forcedStarters.user || startingPitcher;
    }
    const illNames = [];
    if (lineupPhase.illPlayers) {
      [...(lineupPhase.illPlayers.home || []), ...(lineupPhase.illPlayers.away || [])].forEach(p => illNames.push(p.name));
    }
    if (lineupPhase.injuredPlayerNames) {
      illNames.push(...lineupPhase.injuredPlayerNames);
    }
    // Suspended players are scratched for this game
    if (lineupPhase.suspendedPlayerNames) {
      illNames.push(...lineupPhase.suspendedPlayerNames);
    }
    startGame(lineupPhase.home, lineupPhase.away, customHomeLineup, customAwayLineup, lineupPhase.useDH, lineupPhase.weather, effectiveUserStarter, adjustedOpponentSP, seasonUser, illNames);
  }, [lineupPhase, startGame, gameMode, forcedStarters]);

  // Fireworks: detect home team HRs and wins
  useEffect(() => {
    if (!gameState) return;
    const lastPlay = gameState.lastPlay;
    if (lastPlay && lastPlay !== prevLastPlay.current) {
      prevLastPlay.current = lastPlay;
      const battingTeam = gameState.halfInning === 'bottom' ? 'home' : 'away';
      if (['homerun', 'peskyPole', 'basketHR', 'shortPorch'].includes(lastPlay.type) && battingTeam === 'home') {
        setHrTrigger(t => t + 1);
      }
      // Caught stealing → inline GameEventBanner (same spot as celebrations)
      if (lastPlay.type === 'caughtstealing') {
        setInlineGameEvent({ type: 'caughtstealing', event: lastPlay.text });
        setTimeout(() => setInlineGameEvent(null), 5000);
      }
      // Stolen base (including hit-and-run steals) → inline GameEventBanner
      if (lastPlay.type === 'steal') {
        setInlineGameEvent({ type: 'steal', event: lastPlay.text });
        setTimeout(() => setInlineGameEvent(null), 5000);
      }
      // Collision at the plate (but not on HRs)
      if (lastPlay.type !== 'homerun' && lastPlay.text?.includes('bowls over')) {
        setCollisionPopup(lastPlay.text);
      }
    }
    if (gameState.gameOver && !gameState._victoryCallLogged) {
      const isHomeWin = gameState.score.home > gameState.score.away;
      const winningTeam = isHomeWin ? gameState.homeTeam : gameState.awayTeam;
      const call = getVictoryCall(winningTeam, gameState, isHomeWin);
      setGameState(prev => prev ? {
        ...prev,
        log: [...prev.log, { type: 'gameover', text: `🎙️ ${call}` }],
        _victoryCallLogged: true,
      } : prev);
      // Show game-over popup with winner info
      setGameOverPopup({
        winner: winningTeam,
        score: `${gameState.score.home}-${gameState.score.away}`,
        finalPlay: gameState.lastPlay?.text || 'Game over',
      });
      // Auto-switch to Game tab so user sees the final state
      setTab('game');
    }
    if (gameState.gameOver && gameState.score.home > gameState.score.away) {
      // Only trigger once per game
      if (prevLastPlay.current?.type !== '__win_fired__') {
        prevLastPlay.current = { type: '__win_fired__' };
        setTimeout(() => setWinTrigger(t => t + 1), 300);
      }
    }

    // ── Beanball events: HBP, warnings, bat flips ──
    // Reuse the existing lastPlay variable (declared above at line 143)
    if (lastPlay && lastPlay !== prevLastPlay.current) {
      // HBP detection
      if (lastPlay.isHBP) {
        setBeanballEvent({ type: 'hbp', text: getHBPCall(homeTeam, lastPlay.hbpReason), subtext: lastPlay.hbpReason?.label || 'Hit by pitch' });
      }
      // Bat flip on HR
      if (lastPlay.type === 'homerun' && gameState._beanball?.batFlips?.length) {
        const lastFlip = gameState._beanball.batFlips[gameState._beanball.batFlips.length - 1];
        if (lastFlip && lastFlip.inning === gameState.inning) {
          setBeanballEvent({ type: 'batFlip', text: getBatFlipCall(homeTeam, lastFlip.batter), subtext: `${lastFlip.batter.split(' ').pop()} flipped his bat` });
        }
      }
    }
    // Umpire warnings
    if (gameState._beanballWarning && !beanballEvent) {
      // Clear the flag and show warning
      setBeanballEvent({ type: 'warning', text: getWarningCall(homeTeam), subtext: `Tension at ${gameState._beanball?.tension || 0}% - both dugouts warned` });
      setGameState(prev => prev ? { ...prev, _beanballWarning: false } : prev);
    }

    // Check for pitcher ejections - prompt user for replacement.
    // GATED by !disciplineIncident: the On-Field Incident window must be seen
    // and dismissed BEFORE the replacement is forced. When the incident is
    // showing, we pause here; the dismissal handler calls
    // resolveEjectionReplacement() to resume.
    if (gameState._pendingEjectionReplacement && !ejectionResult) {
      if (!disciplineIncident) {
        const r = resolveEjectionReplacement(gameState, userTeam);
        if (r.action === 'show_modal') setEjectionResult({ ejectedSide: r.ejectedSide, bullpen: r.bullpen });
        else if (r.action === 'cpu_replaced') setGameState(r.newState);
      }
      return;
    }

    // Pitcher injury - alert first, then modal/auto-replace on dismiss
    if (gameState._pendingPitcherInjury && !injuryAlert && !pitcherInjury) {
      const injury = gameState._pendingPitcherInjury;
      const teamKey = injury.side === 'home' ? gameState.homeTeam : gameState.awayTeam;
      setInjuryAlert({ type: 'pitcher', injury, teamKey });
      return;
    }

    // Batter injury - alert first, then modal/auto-replace on dismiss
    if (gameState._pendingBatterInjury && !injuryAlert && !batterInjury) {
      const injury = gameState._pendingBatterInjury;
      const teamKey = injury.side === 'home' ? gameState.homeTeam : gameState.awayTeam;
      setInjuryAlert({ type: 'batter', injury, teamKey });
      return;
    }

    // Runner injury - alert first, then modal/auto-replace on dismiss
    if (gameState._pendingRunnerInjury && !injuryAlert && !runnerInjury) {
      const injury = gameState._pendingRunnerInjury;
      const teamKey = injury.side === 'home' ? gameState.homeTeam : gameState.awayTeam;
      setInjuryAlert({ type: 'runner', injury, teamKey });
      return;
    }

    // Sliding injury - alert first, then modal/auto-replace on dismiss
    if (gameState._pendingSlidingInjury && !injuryAlert && !slidingInjury) {
      const injury = gameState._pendingSlidingInjury;
      const teamKey = injury.side === 'home' ? gameState.homeTeam : gameState.awayTeam;
      setInjuryAlert({ type: 'sliding', injury, teamKey });
      return;
    }

    // Fielder injury - alert first, then modal/auto-replace on dismiss
    if (gameState._pendingFielderInjury && !injuryAlert && !fielderInjury) {
      const injury = gameState._pendingFielderInjury;
      const teamKey = injury.side === 'home' ? gameState.homeTeam : gameState.awayTeam;
      setInjuryAlert({ type: 'fielder', injury, teamKey });
      return;
    }

    // Ballpark Event Handler - Award card if bobblehead
    if (ballparkEvent && ballparkEvent.id === 'homestand_bobblehead' && !cardAward) {
      try {
        loadFromStorage(homeTeam);
        const card = getRandomCardForTeam(homeTeam);
        if (card) {
          const isNew = !getCollectedIds(homeTeam).includes(card.id);
          const achievementIds = addCard(homeTeam, card.id);
          saveToStorage(homeTeam);
          setCardAward({ ...card, isNew });
          if (achievementIds.length > 0) {
            setNewAchievements(prev => [...prev, ...achievementIds]);
            achievementsQueuedRef.current = true;
          }
        }
      } catch (e) { console.error('bobblehead card award failed:', e); }
    }

    // Track HR distances and surface celebration lines from new log entries
    if (gameState.log.length > prevLogLength.current) {
      const newEntries = gameState.log.slice(prevLogLength.current);
      newEntries.forEach(entry => {
        if (entry.type === 'homerun' && entry.hrDistance && entry.batterName) {
          // Only track HRs hit by the user's own team
          const userSide = userTeam === gameState.homeTeam ? 'home' : 'away';
          const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
          const userHistory = userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []);
          const isUserBatter = [...userLineup, ...userHistory].some(p => p.name === entry.batterName);
          if (isUserBatter) {
            try {
              trackHomeRunDistance(entry.hrDistance, entry.batterName, userTeam);
            } catch (e) { console.error('trackHomeRunDistance failed:', e); }
          }
        }
        // Surface hitting celebrations as the celebration bubble (bat flips, admires, staredowns, etc.)
         if ((entry.type === 'info' || entry.type === 'homerun') && entry.text) {
           incAtmo('celeb_checked');
           // Detect hitting celebrations: bat flips, home run admiration, hitting celebrations, triple hustle, staredowns
           const isBatFlip = entry.text.includes('flips the bat') || entry.text.includes('flips his bat') || entry.text.includes('tosses the bat') || entry.text.includes('flings the bat');
           const isHRAdmire = entry.text.includes('watches it go') || entry.text.includes('flips the bat and takes') || entry.text.includes('punches the air') || entry.text.includes('stands in the box a beat');
           const isHitCeleb = entry.text.includes('slaps hands') || entry.text.includes('standing ovation') || entry.text.includes('dugout erupts') || entry.text.includes('points back to the dugout') || entry.text.includes('points to the dugout');
           const isTripleHustle = entry.text.includes('slides into third') || entry.text.includes('pulls into third') || entry.text.includes('stands on third clapping');
           const isStaredown = entry.text.includes('watches the batter') || entry.text.includes('watched the batter') || entry.text.includes('lingers on the mound') || entry.text.includes('stares in') || entry.text.includes('stares in -');
           
           if (isBatFlip || isHRAdmire || isHitCeleb || isTripleHustle || isStaredown) {
             incAtmo('celeb_fired');
             setInlineGameEvent({ type: 'celebration', event: entry.text });
             setTimeout(() => setInlineGameEvent(null), 7500);
           }
         }

      });
    }

    // Detect 7th inning stretch
    if (gameState.log.length > prevLogLength.current) {
      const newEntries = gameState.log.slice(prevLogLength.current);
      const stretchEntry = newEntries.find(l => l.type === 'info' && l.text && l.text.includes('🎶'));
      if (stretchEntry && !gameState.gameOver) {
        setShowStretch(stretchEntry.text);
      }
    }

    prevLogLength.current = gameState.log.length;

    // Game-over: handler path processes achievements via finally block.
    // No need to double-process here - trackGameCompleted is not idempotent.
  }, [gameState]);

  // Celebration bubble from game engine - route to inline banner
  useEffect(() => {
    if (gameState?._celebrationBubble) {
      // Use lastPlay._seq if available to distinguish identical back-to-back events
      const key = gameState.lastPlay?._seq
        ? `${gameState._celebrationBubble}__${gameState.lastPlay._seq}`
        : gameState._celebrationBubble;
      if (key !== prevCelebrationBubble.current) {
        prevCelebrationBubble.current = key;
        incAtmo('bubble_fired');
        // Steal/caught-stealing events are already handled by lastPlay detection - use correct type
        const lpType = gameState.lastPlay?.type;
        const eventType = lpType === 'steal' ? 'steal' : lpType === 'caughtstealing' ? 'caughtstealing' : lpType === 'pickoff' ? 'pickoff' : 'celebration';
        setInlineGameEvent({ type: eventType, event: gameState._celebrationBubble });
        setTimeout(() => setInlineGameEvent(null), lpType === 'pickoff' ? 4000 : lpType === 'steal' || lpType === 'caughtstealing' ? 5000 : 7500);
      }
    }
  }, [gameState]);

  // CPU pinch-hit pre-check - apply the substitution BEFORE the user throws a pitch
  // so the pinch-hitter is visible on screen and the user can decide on a pitching change.
  // The existing pinch-hit gate inside processAtBat acts as a fallback if this doesn't fire.
  useEffect(() => {
    if (!gameState || gameState.gameOver || processing) return;
    const newState = cpuCheckPinchHit(gameState);
    if (newState) {
      setGameState(newState);
    }
  }, [gameState, processing]);

  // Track in-game injuries for Season Mode persistence at game end
  useEffect(() => {
    if (!injuryAlert || gameMode !== 'season') return;
    const injury = injuryAlert.injury;
    if (!injury) return;
    const playerName = injury.batterName || injury.pitcherName || injury.runnerName || injury.fielderName || injury.playerName;
    const teamKey = injuryAlert.teamKey;
    if (playerName && teamKey) {
      const sourceMap = { pitcher: 'pitching_fatigue', batter: 'in_game', runner: 'running', sliding: 'sliding', fielder: 'fielding' };
      seasonInjuriesRef.current.push({ playerName, teamKey, source: sourceMap[injuryAlert.type] || 'in_game' });
    }
  }, [injuryAlert, gameMode]);

  // Argument check via effect after a play resolves
  // Uses its own ref (prevArgPlay) so the main effect's prevLastPlay doesn't block it
  useEffect(() => {
    if (!gameState || gameState.gameOver || !gameState.lastPlay) return;
    
    // Only check once per play
    if (gameState.lastPlay === prevArgPlay.current) return;
    prevArgPlay.current = gameState.lastPlay;

    incAtmo('bench_checked');
    checkForArgumentLogic(gameState);
  }, [gameState, homeTeam, awayTeam]);

  // Ballpark events - separate effect (not blocked by prevLastPlay consumption in main effect)
  useEffect(() => {
    if (!gameState || gameState.gameOver || !gameState.lastPlay) return;
    if (gameState.lastPlay === prevBallparkPlay.current) return;
    prevBallparkPlay.current = gameState.lastPlay;

    // Trigger between at-bats (count reset for new batter)
    const isBetweenAtBats = gameState.balls === 0 && gameState.strikes === 0;
    if (isBetweenAtBats) {
      incAtmo('bp_checked');
      const bpEvent = rollBallparkEvent(gameState);
      if (bpEvent) {
        incAtmo('bp_fired');
        setInlineGameEvent({ type: 'ballpark', event: bpEvent });
        setTimeout(() => setInlineGameEvent(null), 10000);
        if (bpEvent.id === 'rainbow_horse' || bpEvent.id === 'reds_streaker' || bpEvent.id === 'clark_bub_sign') {
          trackGrooverSighting(bpEvent.id);
        }
      }
    }
  }, [gameState]);

  const checkForArgumentLogic = useCallback((state) => {
    return checkArgumentLogic(state, { homeTeam, awayTeam, setArgumentResult, setEjectionCount });
  }, [homeTeam, awayTeam]);

  // ── Atmosphere debug: force event handlers ──
  const handleForceAtmoEvent = useCallback((eventId) => {
    if (!gameState) return;
    if (eventId === 'ballpark') {
      const event = forceBallparkEvent(gameState);
      if (event) { setInlineGameEvent({ type: 'ballpark', event }); incAtmo('bp_fired'); }
    } else if (eventId === 'celebration') {
      const batter = getCurrentBatter(gameState);
      const pitcher = getEffectivePitcher(gameState) || getCurrentPitcher(gameState);
      const text = forceCelebrationText(batter, pitcher);
      if (text) { setInlineGameEvent({ type: 'celebration', event: text }); incAtmo('celeb_fired'); }
    } else if (eventId === 'fanchirp') {
      setForceFanChirpTrigger(t => t + 1);
      incAtmo('fan_fired');
    } else if (eventId === 'benchchirp') {
      const chirp = forceBenchChirp();
      setArgumentResult({ ...chirp, ejected: false, homeTeamKey: homeTeam || awayTeam, managerName: MANAGERS[homeTeam]?.name || 'The Manager' });
      incAtmo('bench_fired');
    } else if (eventId === 'ejection') {
      setArgumentResult({
        ejected: true,
        managerName: MANAGERS[homeTeam]?.name || 'The Manager',
        escaLevel: 3,
        callType: 'forced ejection test',
        whoArgues: 'manager',
        homeTeamKey: homeTeam || awayTeam,
        hatThrow: true,
        dirtKick: true,
      });
      incAtmo('bench_fired');
    } else if (eventId === 'robbedhr') {
      const batter = getCurrentBatter(gameState);
      const text = forceRobbedHRText(batter?.name, 'The outfielder');
      setInlineGameEvent({ type: 'celebration', event: text });
      incAtmo('celeb_fired');
    }
  }, [gameState, homeTeam, awayTeam]);



  // ── Game-over achievement processing (called from effect AND play handlers) ──
  const processGameOver = useCallback((state) => {
    if (!state || !state.gameOver) return;
    // Use state.userTeam (set at game start) instead of React closure - more reliable
    const effectiveUserTeam = state.userTeam || userTeam;
    const userSide = state.homeTeam === effectiveUserTeam ? 'home' : 'away';
    const opponentSide = userSide === 'home' ? 'away' : 'home';
    const userWon = state.gameOver && state.score[userSide] > state.score[opponentSide];
    const userLineup = userSide === 'home' ? state.homeLineup : state.awayLineup;
    const opponentLineup = userSide === 'home' ? state.awayLineup : state.homeLineup;

    const userHits = [...userLineup, ...(userSide === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []))]
      .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);
    const oppHits = [...opponentLineup, ...(userSide === 'home' ? (state.awayPlayerHistory || []) : (state.homePlayerHistory || []))]
      .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);

    const opponentTeam = userSide === 'home' ? state.awayTeam : state.homeTeam;
    const isHomeGame = userSide === 'home';
    const stadium = gameStadium || TEAMS[state.homeTeam]?.stadium || null;

    // Run stats tracking and achievements independently - one failure shouldn't block the other
    try { trackGameCompleted(userWon, userTeam, opponentTeam, stadium, userHits, oppHits, isHomeGame); } catch (e) { console.error('trackGameCompleted failed:', e); }
    try { trackGameEndTime(); } catch (e) { console.error('trackGameEndTime failed:', e); }
    try { checkTeamAchievements(); } catch (e) { console.error('checkTeamAchievements failed:', e); }
    try { trackGameRecords(state.score[userSide], state.score[opponentSide], userWon, userTeam, opponentTeam); } catch (e) { console.error('trackGameRecords failed:', e); }

    // Track unique players and pitchers used across all games
    try {
      const allUserPlayers = [...userLineup, ...(userSide === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []))];
      const userPitchers = [userSide === 'home' ? state.homePitcher : state.awayPitcher, ...allUserPlayers.filter(p => ['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos))];
      trackPlayersUsed(
        allUserPlayers.map(p => p.name).filter(Boolean),
        userPitchers.map(p => p.name).filter(Boolean)
      );
    } catch (e) { console.error('trackPlayersUsed failed:', e); }

    // Track time played (elapsed minutes from game start to game end)
    try {
      if (gameStartTimeRef.current) {
        const elapsedMin = Math.max(1, Math.round((Date.now() - gameStartTimeRef.current) / 60000));
        trackTimePlayed(elapsedMin);
        gameStartTimeRef.current = null;
      }
    } catch (e) { console.error('trackTimePlayed failed:', e); }

    if (state._managerEjected && userWon) {
      try { unlockAchievement('earl_weaver'); } catch (e) { console.error('earl_weaver failed:', e); }
    }

    // Award a baseball card ONLY on user wins (not CPU wins)
    let cardWillAward = false;
    if (userWon && userTeam) {
      try {
        loadFromStorage(userTeam);
        const card = getRandomCardForTeam(userTeam);
        if (card) {
          cardWillAward = true;
          const isNew = !getCollectedIds(userTeam).includes(card.id);
          const achievementIds = addCard(userTeam, card.id);
          saveToStorage(userTeam);
          setCardPending(true);
          setTimeout(() => setCardAward({ ...card, isNew }), 3000);
          if (achievementIds.length > 0) {
            setNewAchievements(prev => [...prev, ...achievementIds]);
            achievementsQueuedRef.current = true;
          }
        }
      } catch (e) { console.error('cardAward failed:', e); }
    }

    try {
      const result = checkGameAchievements(state, userTeam);
      const newOnes = result.newlyUnlocked || [];
      const progress = result.newProgress || [];
      if (newOnes.length > 0) {
        setNewAchievements(newOnes);
        achievementsQueuedRef.current = true;
      }
      if (progress.length > 0) {
        setLeaderProgress(progress[0]);
      }
    } catch (e) {
      console.error('checkGameAchievements failed:', e);
    }
    // Achievements are shown via effect once gameOverPopup AND cardAward are both closed

    // Season mode: persist result, advance rotation cooldown
    if (gameMode === 'season' && seasonContextRef.current) {
      const ctx = seasonContextRef.current;
      setSeasonCommitting(true);
      seasonCommitPromiseRef.current = (async () => {
        try {
          const result = buildSeasonGameResultFromState(state, ctx);
          // Use the shared summary function (same one headless sim uses) for W/L/S decisions
          const summary = buildGameResultFromState(state);
          if (summary.decisions.winner) result.winningPitcher = summary.decisions.winner.split('|')[1];
          if (summary.decisions.loser) result.losingPitcher = summary.decisions.loser.split('|')[1];
          if (summary.decisions.save) result.savePitcher = summary.decisions.save.split('|')[1];
          result.homeHRs = summary.homeRuns.filter(hr => hr.teamKey === state.homeTeam).map(hr => ({ playerName: hr.name, inning: hr.inning || 0 }));
          result.awayHRs = summary.homeRuns.filter(hr => hr.teamKey === state.awayTeam).map(hr => ({ playerName: hr.name, inning: hr.inning || 0 }));
          result.boxScore = summary;
          await base44.entities.GameResult.create(result);
          await commitPlayerStats(ctx.seasonId, summary.batting, summary.pitching);
          const rotState = seasonRotationStateRef.current;
          if (state.homeStartingPitcherName) advanceRotation(rotState, state.homeTeam, state.homeStartingPitcherName, ctx.gameDate);
          if (state.awayStartingPitcherName) advanceRotation(rotState, state.awayTeam, state.awayStartingPitcherName, ctx.gameDate);
          recordPitcherWorkload(rotState, state.homeTeam, summary.pitching.filter(p => p.teamKey === state.homeTeam), ctx.gameDate);
          recordPitcherWorkload(rotState, state.awayTeam, summary.pitching.filter(p => p.teamKey === state.awayTeam), ctx.gameDate);
          if (ctx.seasonId) await persistRotationState(ctx.seasonId, rotState);
          // Atomic commit: mark the schedule row as played so it can't be re-launched
          if (ctx.scheduleId) await markScheduleRowFinal(ctx.scheduleId);
          // Increment completed-games counter (user games count too, not just simmed ones)
          if (ctx.seasonId) {
            try {
              const s = await base44.entities.Season.get(ctx.seasonId);
              await base44.entities.Season.update(ctx.seasonId, { completedGames: (s.completedGames || 0) + 1 });
            } catch (e) { console.error('Failed to increment completedGames:', e); }
          }
          // Auto-advance the league day if all games for this day are now complete
          // Persist in-game injuries to the Injury entity (Season Mode only)
          if (seasonInjuriesRef.current.length > 0 && ctx.seasonId) {
            for (const inj of seasonInjuriesRef.current) {
              await recordInjury(ctx.seasonId, inj.teamKey, inj.playerName, '?', inj.source, ctx.gameDate, ctx.gameDay);
            }
            seasonInjuriesRef.current = [];
          }
          // Roll for manager suspension after an ejection (Season Mode only)
          if (state._seasonEjection && ctx.seasonId) {
            const ej = state._seasonEjection;
            const mgr = MANAGERS[ej.teamKey];
            await recordSuspension(ctx.seasonId, ej.teamKey, mgr?.name, ej.escaLevel, ej.reason, ctx.gameDate, ctx.gameDay);
          }
          // Roll for player suspensions after ejections (Season Mode only)
          const playerEjections = getGameEjections(state);
          for (const ej of playerEjections) {
            const playerPos = ej.playerPos || '?';
            await recordPlayerSuspension(ctx.seasonId, ej.teamKey, ej.playerName, playerPos, ej.reason, ctx.gameDate, ctx.gameDay, ej.inning, ej.hbpIntent);
          }
          // Record ejection transactions for the wire
          if (state._seasonEjection) {
            await recordEjectionTxn(ctx.seasonId, {
              gameDate: ctx.gameDate,
              teamKey: state._seasonEjection.teamKey,
              playerName: MANAGERS[state._seasonEjection.teamKey]?.name || 'Manager',
              playerPos: 'MGR',
              ejectionReason: state._seasonEjection.reason,
            });
          }
          for (const ej of playerEjections) {
            await recordEjectionTxn(ctx.seasonId, {
              gameDate: ctx.gameDate,
              teamKey: ej.teamKey,
              playerName: ej.playerName,
              playerPos: ej.playerPos || '?',
              ejectionReason: ej.reason,
            });
          }
          if (ctx.seasonId) await maybeAdvanceDay({ id: ctx.seasonId, currentGameDay: ctx.gameDay });
        } catch (e) {
          console.error('Season result save failed:', e);
        } finally {
          setSeasonCommitting(false);
          seasonCommitPromiseRef.current = null;
        }
      })();
    }

    // All-Star Game: calculate MVP, store result, navigate to /season
    if (gameMode === 'allstar' && seasonContextRef.current?.isAllStar) {
      const ctx = seasonContextRef.current;
      setSeasonCommitting(true);
      seasonCommitPromiseRef.current = (async () => {
        try {
          const rosters = ctx.allStarRosters;
          const mvp = calculateAllStarMvp(state, rosters);
          const homeWon = state.score.home > state.score.away;
          const homeLeague = rosters.homeLeague;
          const winningLeague = homeWon ? homeLeague : (homeLeague === 'AL' ? 'NL' : 'AL');
          const result = {
            homeScore: state.score.home,
            awayScore: state.score.away,
            winner: homeWon ? state.homeTeam : state.awayTeam,
            winningLeague,
            homeTeam: state.homeTeam,
            awayTeam: state.awayTeam,
            stadium: ctx.stadium,
          };
          await base44.entities.Season.update(ctx.seasonId, {
            allStarBreakPhase: 'game_played',
            allStarGameResult: result,
            allStarMvp: mvp,
            worldSeriesHomeFieldLeague: winningLeague,
          });
        } catch (e) {
          console.error('All-Star result save failed:', e);
        } finally {
          setSeasonCommitting(false);
          seasonCommitPromiseRef.current = null;
        }
      })();
    }

    // Analytics: game completed
    try {
      const durationMin = gameStartTimeRef.current ? Math.max(1, Math.round((Date.now() - gameStartTimeRef.current) / 60000)) : 0;
      base44.analytics.track({
        eventName: 'game_completed',
        properties: {
          user_team: effectiveUserTeam,
          opponent_team: opponentTeam,
          user_won: userWon,
          user_score: state.score[userSide],
          opponent_score: state.score[opponentSide],
          innings: state.inning,
          duration_minutes: durationMin,
          stadium: stadium,
          mode: gameMode || 'exhibition',
        },
      });
    } catch (e) { /* analytics optional */ }
  }, [userTeam, gameStadium, gameMode]);

  // Show queued achievements only after game-over popup AND card modal are both closed
  useEffect(() => {
    if (achievementsQueuedRef.current && !gameOverPopup && !cardAward && !cardPending && newAchievements.length > 0) {
      achievementsQueuedRef.current = false;
      setShowAchievementPopup(true);
    }
  }, [gameOverPopup, cardAward, cardPending, newAchievements]);

  const isUserBatting = gameState && (
    (gameState.halfInning === 'top' && userTeam === gameState.awayTeam) ||
    (gameState.halfInning === 'bottom' && userTeam === gameState.homeTeam)
  );

  const isUserPitching = gameState && !isUserBatting;

  // ASG: force pitcher change when usage limit reached (3 IP starter, 2 IP others)
  useEffect(() => {
    if (!gameState || gameState.gameOver || gameMode !== 'allstar' || !isUserPitching || showSubs) return;
    const p = getEffectivePitcher(gameState) || getCurrentPitcher(gameState);
    if (!p) return;
    const us = userTeam === gameState.homeTeam ? 'home' : 'away';
    if (hasReachedAllStarPitchLimit(p, p.name === (us === 'home' ? gameState.homeStartingPitcherName : gameState.awayStartingPitcherName))) { setSubsTab('pitching'); setShowSubs(true); }
  }, [gameState, gameMode, isUserPitching, showSubs, userTeam]);

  const handlePitch = useCallback((pitchName) => {
    if (!gameState || gameState.gameOver) return;
    setProcessing(true);
    const prePitchSnapshot = JSON.parse(JSON.stringify(gameState));
    let endingState = null;
    try {
      // CPU may attempt steal when user is pitching
      let updatedState = gameState;
      const cpuSteal = cpuDecideSteal(gameState);
      if (cpuSteal >= 0) {
        updatedState = { ...gameState, pendingSteal: cpuSteal };
      }

      const cpuSwing = cpuSelectSwing(updatedState);
       // Handle Reach Back specialty pitch
       const isReachBack = pitchName === '__reachback__';
       const pitchObj = isReachBack ? { name: '__reachback__' } : (PITCH_TYPES[pitchName] || PITCH_TYPES["Fastball"]);
       const resultState = processAtBat(updatedState, pitchObj, SWING_TYPES[cpuSwing]);

       // CPU may make substitutions after the at-bat
       const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
       checkPitcherInjury(updatedState, afterSubs);
       if (afterSubs.gameOver) endingState = afterSubs;
       setGameState(afterSubs);

       // Process ballpark events - check if a giveaway event occurred
       if (afterSubs._ballparkEvent && afterSubs._ballparkEvent.awardCard) {
         try {
           loadFromStorage(userTeam);
           const card = getRandomCardForTeam(userTeam);
           if (card) {
             const isNew = !getCollectedIds(userTeam).includes(card.id);
             const achievementIds = addCard(userTeam, card.id);
             saveToStorage(userTeam);
             setCardAward({ ...card, isNew });
             if (achievementIds.length > 0) {
               setNewAchievements(prev => [...prev, ...achievementIds]);
               achievementsQueuedRef.current = true;
             }
           }
         } catch (e) { console.error('ballpark card award failed:', e); }
       }

       // Batter injury - 2% chance on every swing
       checkBatterInjury(updatedState, afterSubs);

       // Runner injury - 2% chance when a runner moves
       checkRunnerInjury(updatedState, afterSubs);

       // Sliding injury - 7%/14% chance on slides
       checkSlidingInjury(updatedState, afterSubs);

       // Fielder injury - 3%/10%/14% on diving stops/catches/collisions
       checkFielderInjury(updatedState, afterSubs);

       // ── Player ejection checks (Season Mode only) ──
       if (gameModeRef.current === 'season') {
         const ctx = afterSubs._beanball;
         const isHBP = afterSubs.lastPlay?.type === 'walk' && (afterSubs.lastPlay?.text?.includes('hit by the pitch') || afterSubs.lastPlay?.text?.includes('HBP'));

         // Use the ACTUAL hit batter and pitcher from the beanball context.
         // getSituationalBatter returns the NEXT batter (advanceBatter already ran).
         let batter = null, pitcher = null;
         if (isHBP && ctx) {
           const battingSide = afterSubs.halfInning === 'top' ? 'away' : 'home';
           const battingTeamKey = battingSide === 'home' ? afterSubs.homeTeam : afterSubs.awayTeam;
           const pitchingTeamKey = battingSide === 'home' ? afterSubs.awayTeam : afterSubs.homeTeam;
           batter = ctx.lastHBPBatter ? findPlayerInGame(afterSubs, ctx.lastHBPBatter, battingTeamKey) : null;
           pitcher = ctx.lastHBPPitcher ? findPlayerInGame(afterSubs, ctx.lastHBPPitcher, pitchingTeamKey) : null;
           if (!pitcher) pitcher = getEffectivePitcher(afterSubs) || getCurrentPitcher(afterSubs);
         } else {
           batter = getSituationalBatter(afterSubs);
           pitcher = getEffectivePitcher(afterSubs) || getCurrentPitcher(afterSubs);
         }

         const incidentSteps = [];
         let totalEjections = 0;

         // HBP ejection + mound charge
         if (isHBP && pitcher && batter) {
           incidentSteps.push({ text: `${batter.name.split(' ').pop()} is hit by the pitch!`, type: 'hbp' });
           if (afterSubs._beanballWarning) {
             // Warning was just issued on this HBP
             incidentSteps.push({ text: 'Both benches have been warned!', type: 'warning' });
           } else if (ctx?.warningIssued) {
             // Warnings were already active before this HBP
             incidentSteps.push({ text: 'Warnings were already issued!', type: 'warning' });
           } else {
             // No warning - add explanation so the popup isn't empty
             const explanation = getNoWarningExplanation(afterSubs);
             incidentSteps.push({ text: explanation, type: 'info' });
           }
           const hbpEjection = checkHBPEjection(afterSubs, pitcher, batter);
           if (hbpEjection) {
             applyPlayerEjection(afterSubs, hbpEjection);
             totalEjections++;
             incidentSteps.push({ text: hbpEjection.commentary, type: 'ejection' });
           }
           // Charging the mound - uses the ACTUAL hit batter (the core fix)
           const chargeResult = checkChargingMound(afterSubs, pitcher, batter);
           if (chargeResult) {
             applyMultipleEjections(afterSubs, chargeResult.ejections);
             totalEjections += chargeResult.ejections.length;
             incidentSteps.push({ text: chargeResult.commentary, type: chargeResult.type === 'bench_clearing' ? 'brawl' : 'mound_charge' });
             for (const ej of chargeResult.ejections) {
               incidentSteps.push({ text: ej.commentary, type: 'ejection' });
             }
           }
         }
         // Called strikeout argument check - use the batter who actually struck out
         // (getSituationalBatter returns the NEXT batter since advanceBatter already ran)
         if (afterSubs.lastPlay?.type === 'strikeout') {
           const prevBatter = getPreviousBatter(afterSubs) || batter;
           if (prevBatter) {
             const strikeArg = checkBatterArguesStrikes(afterSubs, prevBatter);
             if (strikeArg) {
               applyPlayerEjection(afterSubs, strikeArg);
               totalEjections++;
               incidentSteps.push({ text: strikeArg.commentary, type: 'ejection' });
             }
           }
         }
         // Bench-clearing brawl check - ONLY after an actual HBP, not on every
         // pitch. Running it unconditionally caused phantom ejections: tension
         // from a prior HBP could trigger a brawl on a routine groundout,
         // ejecting random players who were never involved in any incident.
         if (isHBP && pitcher && batter) {
           const brawlResult = checkBenchClearingBrawl(afterSubs);
           if (brawlResult) {
             applyMultipleEjections(afterSubs, brawlResult.ejections);
             totalEjections += brawlResult.ejections.length;
             incidentSteps.push({ text: brawlResult.commentary, type: 'brawl' });
             for (const ej of brawlResult.ejections) {
               incidentSteps.push({ text: ej.commentary, type: 'ejection' });
             }
           }
         }

         // Show incident on main screen if any events occurred
         if (incidentSteps.length > 0) {
           setDisciplineIncident({ steps: incidentSteps, totalEjections });
           setEjectionCount(prev => prev + totalEjections);
         }
       }

       } catch (e) {
       console.error('handlePitch error:', e);
      console.error('Stack:', e.stack);
      setGameState(prePitchSnapshot);
      alert(`Pitch error: ${e.message}`);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, userTeam, processGameOver]);

  const handleSwing = useCallback((swingIndex) => {
    if (!gameState || gameState.gameOver) return;
    setProcessing(true);
    const prePitchSnapshot = JSON.parse(JSON.stringify(gameState));
    let endingState = null;
    try {
      const cpuPitch = cpuSelectPitch(gameState);
      const resultState = processAtBat(gameState, PITCH_TYPES[cpuPitch], SWING_TYPES[swingIndex]);

      // CPU may make substitutions after the at-bat
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      checkPitcherInjury(gameState, afterSubs);
      if (afterSubs.gameOver) endingState = afterSubs;
      setGameState(afterSubs);

      // Process ballpark events - check if a giveaway event occurred
      if (afterSubs._ballparkEvent && afterSubs._ballparkEvent.awardCard) {
        try {
          loadFromStorage(userTeam);
          const card = getRandomCardForTeam(userTeam);
          if (card) {
            const isNew = !getCollectedIds(userTeam).includes(card.id);
            const achievementIds = addCard(userTeam, card.id);
            saveToStorage(userTeam);
            setCardAward({ ...card, isNew });
            if (achievementIds.length > 0) {
              setNewAchievements(prev => [...prev, ...achievementIds]);
              setShowAchievementPopup(true);
            }
          }
        } catch (e) { console.error('ballpark card award failed:', e); }
      }

      // Batter injury - 2% chance on every swing
      checkBatterInjury(gameState, afterSubs);

      // Runner injury - 2% chance when a runner moves
      checkRunnerInjury(gameState, afterSubs);

      // Sliding injury - 7%/14% chance on slides
      checkSlidingInjury(gameState, afterSubs);

      // Fielder injury - 3%/10%/14% on diving stops/catches/collisions
      checkFielderInjury(gameState, afterSubs);

      // ── Player ejection checks (Season Mode only) ──
      // Mirrors handlePitch: uses the ACTUAL hit batter from beanball context
      // (not getSituationalBatter which returns the next batter), and gates
      // brawl checks behind a real HBP to prevent phantom ejections.
      if (gameModeRef.current === 'season') {
        const ctx = afterSubs._beanball;
        const isHBP = afterSubs.lastPlay?.type === 'walk' && (afterSubs.lastPlay?.text?.includes('hit by the pitch') || afterSubs.lastPlay?.text?.includes('HBP'));

        let batter = null, pitcher = null;
        if (isHBP && ctx) {
          const battingSide = afterSubs.halfInning === 'top' ? 'away' : 'home';
          const battingTeamKey = battingSide === 'home' ? afterSubs.homeTeam : afterSubs.awayTeam;
          const pitchingTeamKey = battingSide === 'home' ? afterSubs.awayTeam : afterSubs.homeTeam;
          batter = ctx.lastHBPBatter ? findPlayerInGame(afterSubs, ctx.lastHBPBatter, battingTeamKey) : null;
          pitcher = ctx.lastHBPPitcher ? findPlayerInGame(afterSubs, ctx.lastHBPPitcher, pitchingTeamKey) : null;
          if (!pitcher) pitcher = getEffectivePitcher(afterSubs) || getCurrentPitcher(afterSubs);
        } else {
          batter = getSituationalBatter(afterSubs);
          pitcher = getEffectivePitcher(afterSubs) || getCurrentPitcher(afterSubs);
        }

        const incidentSteps = [];
        let totalEjections = 0;

        if (isHBP && pitcher && batter) {
          incidentSteps.push({ text: `${batter.name.split(' ').pop()} is hit by the pitch!`, type: 'hbp' });
          const hbpEjection = checkHBPEjection(afterSubs, pitcher, batter);
          if (hbpEjection) {
            applyPlayerEjection(afterSubs, hbpEjection);
            totalEjections++;
            incidentSteps.push({ text: hbpEjection.commentary, type: 'ejection' });
          }
          const chargeResult = checkChargingMound(afterSubs, pitcher, batter);
          if (chargeResult) {
            applyMultipleEjections(afterSubs, chargeResult.ejections);
            totalEjections += chargeResult.ejections.length;
            incidentSteps.push({ text: chargeResult.commentary, type: chargeResult.type === 'bench_clearing' ? 'brawl' : 'mound_charge' });
            for (const ej of chargeResult.ejections) {
              incidentSteps.push({ text: ej.commentary, type: 'ejection' });
            }
          }
          const brawlResult = checkBenchClearingBrawl(afterSubs);
          if (brawlResult) {
            applyMultipleEjections(afterSubs, brawlResult.ejections);
            totalEjections += brawlResult.ejections.length;
            incidentSteps.push({ text: brawlResult.commentary, type: 'brawl' });
            for (const ej of brawlResult.ejections) {
              incidentSteps.push({ text: ej.commentary, type: 'ejection' });
            }
          }
        }
        if (afterSubs.lastPlay?.type === 'strikeout') {
          const prevBatter = getPreviousBatter(afterSubs) || batter;
          if (prevBatter) {
            const strikeArg = checkBatterArguesStrikes(afterSubs, prevBatter);
            if (strikeArg) {
              applyPlayerEjection(afterSubs, strikeArg);
              totalEjections++;
              incidentSteps.push({ text: strikeArg.commentary, type: 'ejection' });
            }
          }
        }

        if (incidentSteps.length > 0) {
          setDisciplineIncident({ steps: incidentSteps, totalEjections });
          setEjectionCount(prev => prev + totalEjections);
        }
      }
      } catch (e) {
      console.error('handleSwing error:', e);
      console.error('Stack:', e.stack);
      setGameState(prePitchSnapshot);
      alert(`Swing error: ${e.message}`);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, userTeam, processGameOver]);

  const handleSteal = useCallback((baseIndex) => {
    if (!gameState || gameState.gameOver) return;
    setProcessing(true);
    const prePitchSnapshot = JSON.parse(JSON.stringify(gameState));
    let endingState = null;
    try {
      // Steal attempt: runner goes on the pitch, batter takes automatically
      const stealPending = { ...gameState, pendingSteal: baseIndex };
      // CPU selects pitch, batter takes (swingType 3 = Take Pitch)
      const cpuPitch = cpuSelectPitch(stealPending);
      const resultState = processAtBat(stealPending, PITCH_TYPES[cpuPitch], SWING_TYPES[3]);
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      checkPitcherInjury(stealPending, afterSubs);
      if (afterSubs.gameOver) endingState = afterSubs;
      setGameState(afterSubs);

      // Batter injury - 2% chance on every swing (steal attempt = swing)
      checkBatterInjury(stealPending, afterSubs);

      // Runner injury - 2% chance when a runner moves (steal attempt)
      checkRunnerInjury(stealPending, afterSubs);

      // Sliding injury - 7%/14% chance on slides (steal attempt)
      checkSlidingInjury(stealPending, afterSubs);

      // Fielder injury - 3%/10%/14% on diving stops/catches/collisions
      checkFielderInjury(stealPending, afterSubs);
    } catch (e) {
      console.error('handleSteal error:', e);
      setGameState(prePitchSnapshot);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, userTeam, processGameOver]);

  const handleHitAndRun = useCallback(() => {
    if (!gameState || gameState.gameOver || processing) return;
    const newState = setHitAndRun(gameState, !gameState.hitAndRun);
    setGameState(newState);
  }, [gameState, processing]);

  const handleIntBB = useCallback(() => {
    if (!gameState || gameState.gameOver) return;
    setProcessing(true);
    const prePitchSnapshot = JSON.parse(JSON.stringify(gameState));
    let endingState = null;
    try {
      const newState = intentionalWalk(gameState);
      checkPitcherInjury(gameState, newState);
      if (newState.gameOver) endingState = newState;
      setGameState(newState);
    } catch (e) {
      console.error('handleIntBB error:', e);
      setGameState(prePitchSnapshot);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, processGameOver]);

  const handlePinchHit = useCallback((player) => {
    setGameState(prev => {
      if (!prev || prev.gameOver) return prev;
      return pinchHit(prev, player);
    });
    setShowSubs(false);
  }, []);

  const handlePinchRun = useCallback((baseIndex, player) => {
    setGameState(prev => {
      if (!prev || prev.gameOver) return prev;
      return pinchRun(prev, baseIndex, player);
    });
    setShowSubs(false);
  }, []);

  const handleDefensiveSwitch = useCallback((slotIndex, newPos, newPlayer) => {
    setGameState(prev => {
      if (!prev || prev.gameOver) return prev;
      return defensiveSwitch(prev, slotIndex, newPos, newPlayer);
    });
    if (newPlayer) setShowSubs(false);
  }, []);

  const handlePitchingChange = useCallback((newPitcher) => {
    setGameState(prev => {
      if (!prev || prev.gameOver) return prev;
      try {
        const side = userTeam === prev.homeTeam ? 'home' : 'away';
        const newState = changePitcher(prev, newPitcher, side);
        return newState;
      } catch (e) {
        return prev;
      }
    });
    setShowSubs(false);
  }, [userTeam]);

  const handleEjectionReplacement = (chosenPitcher) => {
    if (!gameState || !ejectionResult) return;
    const newState = changePitcher(gameState, chosenPitcher, ejectionResult.ejectedSide);
    // Remove the ejected pitcher from the bullpen so they can't re-enter
    const ejectedPitcherName = gameState._beanball?.autoEjectionPitcher;
    if (ejectedPitcherName) {
      const bpKey = ejectionResult.ejectedSide === 'home' ? 'homeBullpen' : 'awayBullpen';
      newState[bpKey] = (newState[bpKey] || []).filter(p => p.name !== ejectedPitcherName);
      if (!newState.removedPlayers) newState.removedPlayers = [];
      if (!newState.removedPlayers.includes(ejectedPitcherName)) {
        newState.removedPlayers.push(ejectedPitcherName);
      }
    }
    // Clear the ejection flags so the modal doesn't re-trigger after dismissal
    delete newState._pendingEjectionReplacement;
    if (newState._beanball) {
      delete newState._beanball.autoEjectionPitcher;
      delete newState._beanball.autoEjectionSide;
    }
    setGameState(newState);
    setEjectionResult(null);
  };

  const handlePitcherInjuryReplacement = (chosenPitcher) => {
    if (!gameState || !pitcherInjury) return;
    const newState = changePitcher(gameState, chosenPitcher, pitcherInjury.side);
    delete newState._pendingPitcherInjury;
    setGameState(newState);
    setPitcherInjury(null);
  };

  const isExhibition = gameMode === 'exhibition';

  const checkBatterInjury = (prevState, newState) => checkBatterInjuryExternal(prevState, newState, gameMode === 'exhibition');

  const handleBatterInjuryReplacement = (chosenPlayer) => {
    if (!gameState || !batterInjury) return;
    let newState;
    if (batterInjury.stillAtPlate) {
      // Batter is still at the plate - pinchHit handles the at-bat swap
      newState = pinchHit(gameState, chosenPlayer);
    } else {
      // Batter completed their at-bat - replace directly in the lineup
      newState = replaceInjuredBatter(gameState, batterInjury.batterName, batterInjury.side, chosenPlayer, batterInjury.name);
    }
    delete newState._pendingBatterInjury;
    setGameState(newState);
    setBatterInjury(null);
  };

  const checkRunnerInjury = (prevState, newState) => checkRunnerInjuryBase(prevState, newState, isExhibition);

  const handleRunnerInjuryReplacement = (chosenPlayer) => {
    if (!gameState || !runnerInjury) return;
    let newState;
    if (runnerInjury.baseIndex >= 0) {
      // Runner is on base - use pinchRun
      newState = pinchRun(gameState, runnerInjury.baseIndex, chosenPlayer);
    } else {
      // Runner scored/was out - replace directly in lineup
      newState = replaceInjuredBatter(gameState, runnerInjury.runnerName, runnerInjury.side, chosenPlayer, runnerInjury.name);
    }
    delete newState._pendingRunnerInjury;
    setGameState(newState);
    setRunnerInjury(null);
  };

  const checkSlidingInjury = (prevState, newState) => checkSlidingInjuryBase(prevState, newState, isExhibition);

  const handleSlidingInjuryReplacement = (chosenPlayer) => {
    if (!gameState || !slidingInjury) return;
    let newState;
    if (slidingInjury.baseIndex >= 0) {
      newState = pinchRun(gameState, slidingInjury.baseIndex, chosenPlayer);
    } else {
      newState = replaceInjuredBatter(gameState, slidingInjury.runnerName, slidingInjury.side, chosenPlayer, slidingInjury.name);
    }
    delete newState._pendingSlidingInjury;
    setGameState(newState);
    setSlidingInjury(null);
  };

  const checkFielderInjury = (prevState, newState) => checkFielderInjuryBase(prevState, newState, isExhibition);

  const handleFielderInjuryReplacement = (chosenPlayer) => {
    if (!gameState || !fielderInjury) return;
    const newState = replaceInjuredBatter(gameState, fielderInjury.fielderName, fielderInjury.side, chosenPlayer, fielderInjury.name);
    delete newState._pendingFielderInjury;
    setGameState(newState);
    setFielderInjury(null);
  };

  const handleInjuryAlertDismiss = useCallback(() => {
    if (!injuryAlert || !gameState) return;
    const { type, injury } = injuryAlert;
    setInjuryAlert(null);

    const isUserTeam = (injury.side === 'home' && userTeam === gameState.homeTeam) ||
                       (injury.side === 'away' && userTeam === gameState.awayTeam);

    if (type === 'pitcher') {
      if (isUserTeam) {
        const bullpen = injury.side === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
        setPitcherInjury({ ...injury, bullpen });
      } else {
        const bullpen = injury.side === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
        const newReliever = pickCpuReliever(bullpen, gameState.inning, {
          cpuScore: gameState.score[injury.side],
          oppScore: gameState.score[injury.side === 'home' ? 'away' : 'home'],
        });
        if (newReliever) {
          const newState = changePitcher(gameState, newReliever, injury.side);
          delete newState._pendingPitcherInjury;
          setGameState(newState);
        }
      }
    } else if (type === 'batter') {
      if (isUserTeam) {
        setBatterInjury(injury);
      } else {
        const bench = injury.bench || [];
        if (bench.length > 0) {
          const sorted = [...bench].sort((a, b) => (b.contact + b.power) - (a.contact + a.power));
          const replacement = sorted[0];
          let newState;
          if (injury.stillAtPlate) {
            newState = pinchHit(gameState, replacement);
          } else {
            newState = replaceInjuredBatter(gameState, injury.batterName, injury.side, replacement, injury.name);
          }
          delete newState._pendingBatterInjury;
          setGameState(newState);
        }
      }
    } else if (type === 'runner') {
      if (isUserTeam) {
        setRunnerInjury(injury);
      } else {
        const bench = injury.bench || [];
        if (bench.length > 0) {
          const sorted = [...bench].sort((a, b) => b.speed - a.speed);
          const replacement = sorted[0];
          let newState;
          if (injury.baseIndex >= 0) {
            newState = pinchRun(gameState, injury.baseIndex, replacement);
          } else {
            newState = replaceInjuredBatter(gameState, injury.runnerName, injury.side, replacement, injury.name);
          }
          delete newState._pendingRunnerInjury;
          setGameState(newState);
        }
      }
    } else if (type === 'sliding') {
      if (isUserTeam) {
        setSlidingInjury(injury);
      } else {
        const bench = injury.bench || [];
        if (bench.length > 0) {
          const sorted = [...bench].sort((a, b) => b.speed - a.speed);
          const replacement = sorted[0];
          let newState;
          if (injury.baseIndex >= 0) {
            newState = pinchRun(gameState, injury.baseIndex, replacement);
          } else {
            newState = replaceInjuredBatter(gameState, injury.runnerName, injury.side, replacement, injury.name);
          }
          delete newState._pendingSlidingInjury;
          setGameState(newState);
        }
      }
    } else if (type === 'fielder') {
      if (isUserTeam) {
        setFielderInjury(injury);
      } else {
        const bench = injury.bench || [];
        if (bench.length > 0) {
          const sorted = [...bench].sort((a, b) => (b.contact + b.power) - (a.contact + a.power));
          const replacement = sorted[0];
          const newState = replaceInjuredBatter(gameState, injury.fielderName, injury.side, replacement, injury.name);
          delete newState._pendingFielderInjury;
          setGameState(newState);
        }
      }
    }
  }, [injuryAlert, gameState, userTeam]);

  const handleNewGame = () => {
    if (gameMode === 'season' || gameMode === 'allstar') {
      removeAllStarTeams();
      window.location.href = '/season';
      return;
    }
    setGameMode(null);
    setGameState(null);
    setBallparkPhase(null);
    setLineupPhase(null);
    setGameStadium(null);
    setUseDH(false);
    setGameWeather(null);
    setShowSubs(false);
    setHomeTeam(null);
    setAwayTeam(null);
    setUserTeam(null);
    setSeasonUserTeam(null);
    setForcedStarters(null);
    setStarterNotice(null);
    setTab('game');
    setNewAchievements([]);
    setShowAchievementPopup(false);
    setArgumentResult(null);
    setSelectedUmpire(null);
    prevGameOver.current = false;
    seasonContextRef.current = null;
    seasonRotationStateRef.current = {};
    seasonSuspendedTeamsRef.current = new Set();
    seasonSuspendedPlayerNamesRef.current = new Set();
    prevArgPlay.current = null;
    prevLogLength.current = 0;
    prevInning.current = null;
    setShowStretch(null);
    setActiveBanner(null);
    setBannerSeq(0);
    setBannerPopup(null);
    setBeanballEvent(null);
    setEjectionResult(null);
    setCardAward(null);
    setCardPending(false);
    setShowSummary(false);
    setPitcherInjury(null);
    setBatterInjury(null);
    setRunnerInjury(null);
    setSlidingInjury(null);
    setFielderInjury(null);
    setPregameIllnesses(null);
    setInjuryAlert(null);
    achievementsQueuedRef.current = false;
    setSeasonCommitting(false);
    seasonCommitPromiseRef.current = null;
    seasonStatsLoadedRef.current = false;
    setSeasonBatterStatsMap({});
    setForceFanChirpTrigger(0);
    resetAtmoCounters();
  };

  if (ballparkPhase) {
    return (
      <ErrorBoundary>
      <BallparkSelect
        userTeam={ballparkPhase.home}
        cpuTeam={ballparkPhase.away}
        onConfirm={handleBallparkConfirm}
        onBack={() => setBallparkPhase(null)}
      />
      </ErrorBoundary>
    );
  }

  if (lineupPhase) {
    const userIsHome = !lineupPhase.seasonUserTeam || lineupPhase.seasonUserTeam === lineupPhase.home;
    const userTeamKey = userIsHome ? lineupPhase.home : lineupPhase.away;
    const oppTeamKey = userIsHome ? lineupPhase.away : lineupPhase.home;
    return (
      <ErrorBoundary>
      {starterNotice && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]">
          <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl px-4 py-3 flex items-start gap-3 shadow-lg">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-sm font-heading text-amber-300 leading-snug flex-1">{starterNotice}</p>
            <button onClick={() => setStarterNotice(null)} className="text-amber-300/60 hover:text-amber-300 text-lg shrink-0" aria-label="Dismiss">×</button>
          </div>
        </div>
      )}
      <LineupManager
        key={`${lineupPhase.home}-${lineupPhase.away}-${lineupPhase.useDH}`}
        teamKey={userTeamKey}
        teamData={TEAMS[userTeamKey]}
        opponentTeamData={TEAMS[oppTeamKey]}
        useDH={lineupPhase.useDH}
        parkTeam={lineupPhase.parkTeam}
        weather={lineupPhase.weather}
        onConfirm={handleLineupConfirm}
        onBack={() => { setLineupPhase(null); setBallparkPhase({ home: lineupPhase.home, away: lineupPhase.away }); }}
        illPlayerNames={[...(lineupPhase.illPlayers?.[userIsHome ? 'home' : 'away'] || []).map(p => p.name), ...(lineupPhase.injuredPlayerNames || []), ...(lineupPhase.suspendedPlayerNames || [])]}
        opponentIllPlayerNames={[...(lineupPhase.illPlayers?.[userIsHome ? 'away' : 'home'] || []).map(p => p.name), ...(lineupPhase.injuredPlayerNames || []), ...(lineupPhase.suspendedPlayerNames || [])]}
        seasonMode={gameMode === 'season'}
        forcedOpponentSP={forcedStarters?.cpu || null}
        forcedUserSP={forcedStarters?.user || null}
        seasonGameDay={lineupPhase.gameDay}
        seasonRotationState={lineupPhase.rotationState}
        isBullpenDay={lineupPhase.gameDate && lineupPhase.rotationState ? isBullpenDayForTeam(lineupPhase.rotationState, lineupPhase.seasonUserTeam || lineupPhase.home, lineupPhase.gameDate) : false}
        seasonGameDate={lineupPhase.gameDate}
      />
      {pregameIllnesses && (
        <PregameIllnessModal
          illnesses={pregameIllnesses}
          homeTeamKey={lineupPhase.home}
          awayTeamKey={lineupPhase.away}
          onClose={() => setPregameIllnesses(null)}
        />
      )}
      </ErrorBoundary>
    );
  }

  if (!gameState) {
    if (loadingScreen) {
      return <RetroLoading onComplete={() => setLoadingScreen(false)} />;
    }
    // Mode selection screen
    if (!gameMode) {
      return (
        <>
          <ModeSelect onSelectMode={handleModeSelect} onBack={() => setGameMode(null)} />
          {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
        </>
      );
    }
    // Team selection (Exhibition mode only)
    return (
      <>
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          <Button
            size="sm"
            onClick={() => { if (!retroAudio) unlockAudio(); setRetroAudio(!retroAudio); }}
            className={`h-9 w-9 p-0 rounded-full ${retroAudio ? 'bg-primary/15 text-primary border-2 border-primary/50' : 'bg-card text-primary border-2 border-primary/40 hover:bg-primary/10'}`}
            title={retroAudio ? 'Retro audio on' : 'Retro audio off'}
          >
            <Radio className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="h-9 w-9 p-0 rounded-full bg-card text-primary border-2 border-primary/40 hover:bg-primary/10 transition-colors"
            title="How to play"
          >
            <HelpCircle className="w-4 h-4" />
          </Button>
        </div>
        <TeamSelect onSelect={handleTeamSelect} />
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
      </>
    );
  }

  const batter = getCurrentBatter(gameState);
  const pitcher = getEffectivePitcher(gameState) || getCurrentPitcher(gameState);

  // Detect if the user's current pitcher was pinch-hit for and needs a replacement
  const userFieldingLineup = isUserPitching
    ? (gameState.halfInning === 'top' ? gameState.homeLineup : gameState.awayLineup)
    : null;
  // Only flag pitcher as needing replacement if DH is off (pitcher was in lineup and removed)
  // With DH on, the pitcher never bats, so they won't be in the lineup - that's expected
  const pitcherNeedsReplacement = isUserPitching && pitcher && userFieldingLineup && !useDH && pitcher.name
    ? !userFieldingLineup.some(p => p.name === pitcher.name)
    : false;

  // Reach Back - specialty pitch for iconic pitchers
  const pitcherSpecialty = pitcher?.specialty || null;
  const reachBackUses = gameState._pitcherSpecialUses?.[pitcher?.name] || 0;
  const isStarter = pitcher?.pos === 'SP' || pitcher?.assignedPos === 'SP';
  const reachBackMax = isStarter ? 3 : 1;

  const situationalBatter = getSituationalBatter(gameState);
  const battingTeamKey = getBattingTeam(gameState) === 'home' ? homeTeam : awayTeam;
  const battingTeamName = TEAMS[battingTeamKey]?.name || '';
  const inningLabel = `${gameState.halfInning === 'top' ? '▲' : '▼'} ${gameState.inning}`;
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  // Compute batter stats for the 1984 scoreboard banner
  // Season: pre-game totals from PlayerStats + in-game deltas from gameStats
  // Exhibition: 1984 splits + in-game deltas
  let batterStats = null;
  if (situationalBatter && !gameState.gameOver) {
    const battingSide = getBattingTeam(gameState);
    const batterTeamKey = battingSide === 'home' ? homeTeam : awayTeam;
    const gameGS = situationalBatter.gameStats || {};
    if (gameMode === 'season') {
      // Default to zeros when no stats record exists yet (new season). Banner
      // always shows in Season Mode — not gated behind a save flag.
      const ss = seasonBatterStatsMap[`${batterTeamKey}|${situationalBatter.name}`] || { ab: 0, h: 0, hr: 0, rbi: 0 };
      const totalAB = ss.ab + (gameGS.ab || 0);
      const totalH = ss.h + (gameGS.hits || 0);
      batterStats = { avg: totalAB > 0 ? totalH / totalAB : 0, hr: ss.hr + (gameGS.hr || 0), rbi: ss.rbi + (gameGS.rbi || 0) };
    } else {
      const sp = situationalBatter.splits;
      if (sp) {
        const vsL = sp.vsLHP || {};
        const vsR = sp.vsRHP || {};
        const exAB = (vsL.ab || 0) + (vsR.ab || 0);
        const exH = Math.round((vsL.ab || 0) * (vsL.ba || 0) + (vsR.ab || 0) * (vsR.ba || 0));
        const exHR = (vsL.hr || 0) + (vsR.hr || 0);
        const totalAB = exAB + (gameGS.ab || 0);
        const totalH = exH + (gameGS.hits || 0);
        batterStats = {
          avg: totalAB > 0 ? totalH / totalAB : 0,
          hr: exHR + (gameGS.hr || 0),
          rbi: '—',
        };
      }
    }
  }

  return (
    <ErrorBoundary>
    <div className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Compact Top Bar */}
      <div className="shrink-0 border-b border-border bg-card/50 px-3 md:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm shrink-0">⚾</span>
          <div className="min-w-0">
            <div className="font-heading text-[11px] text-foreground font-bold truncate">
              {away?.abbr} {gameState.score.away} - {gameState.score.home} {home?.abbr}
            </div>
            <div className="font-heading text-[9px] text-muted-foreground truncate">
              {inningLabel} · {gameStadium || battingTeamName}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={() => { if (!retroAudio) unlockAudio(); setRetroAudio(!retroAudio); }}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${retroAudio ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            aria-label={retroAudio ? 'Retro audio on' : 'Retro audio off'}
          >
            <Radio className="w-4 h-4" />
          </button>
          <button
            onClick={() => { if (!robotVoice) unlockRobotAnnouncer(); setRobotVoice(!robotVoice); }}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${robotVoice ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            aria-label={robotVoice ? 'Mute announcer' : 'Robot announcer'}
          >
            {robotVoice ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          {!gameState.gameOver && (
            <button
              onClick={() => { setSubsTab('pinchhit'); setShowSubs(true); }}
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Substitutions"
            >
              <Users className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleNewGame}
            className="w-9 h-9 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="New Game"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tab buttons */}
      <div className="shrink-0 bg-card/50 border-b border-border">
        <div className="grid grid-cols-3 gap-1 px-3 py-1">
          <button
            onClick={() => setTab('game')}
            className={`font-heading text-xs rounded-md py-1.5 transition-all ${tab === 'game' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Game</button>
          <button
            onClick={() => setTab('log')}
            className={`font-heading text-xs rounded-md py-1.5 transition-all ${tab === 'log' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Play Log</button>
          <button
            onClick={() => setTab('box')}
            className={`font-heading text-xs rounded-md py-1.5 transition-all ${tab === 'box' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Box Score</button>
        </div>
      </div>

      {/* Middle content - single centered column on all screens */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-2 w-full max-w-2xl md:max-w-5xl mx-auto">
        <div className="space-y-2">
            {tab === 'game' && (
              <div className="md:grid md:grid-cols-[2fr_3fr] md:gap-4 space-y-2 md:space-y-0">
                {/* LEFT column: Scoreboard + Diamond */}
                <div className="space-y-2">
                {/* Scoreboard - compact */}
                <div className="bg-card border border-border rounded-lg px-2 py-1.5">
                  <Scoreboard
                    innings={gameState.innings}
                    score={gameState.score}
                    currentInning={gameState.inning}
                    halfInning={gameState.halfInning}
                    awayAbbr={away?.abbr}
                    homeAbbr={home?.abbr}
                  />
                </div>

                {/* Diamond */}
                <div className="flex justify-center">
                  <DiamondView
                    bases={gameState.bases}
                    lastPlay={gameState.lastPlay}
                    isDay={gameWeather?.isDay}
                  />
                </div>

                {/* 7th Inning Stretch banner */}
                {showStretch && (
                  <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-center cursor-pointer animate-in slide-in-from-bottom-4 fade-in duration-500" onClick={() => setShowStretch(null)}>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-xs font-display text-primary animate-pulse">🎤</span>
                      <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-primary/80">7th Inning Stretch</span>
                      <span className="text-xs font-display text-primary animate-pulse">🎤</span>
                    </div>
                    <p className="text-sm font-heading text-foreground/90 leading-relaxed italic">{showStretch}</p>
                    <p className="text-[9px] text-muted-foreground/40 mt-2 font-heading">tap to continue</p>
                  </div>
                )}
                </div>{/* end LEFT column */}

                {/* RIGHT column: Banner + Commentary + Matchup + Controls */}
                <div className="space-y-2">
                {/* Middle Banner: special events override the default batter stat line */}
                {inlineGameEvent ? (
                  <GameEventBanner
                    event={inlineGameEvent.event}
                    type={inlineGameEvent.type}
                    onClose={() => setInlineGameEvent(null)}
                  />
                ) : (
                  batterStats && <BatterStatBanner batter={situationalBatter} stats={batterStats} />
                )}

                {/* Commentary */}
                <CommentaryBanner batter={situationalBatter} pitcher={pitcher} gameState={gameState} lastPlay={gameState.lastPlay} stadium={gameStadium} homeTeamKey={homeTeam} />

                {/* Matchup */}
                <div className="bg-card border border-border rounded-lg px-2 py-1.5">
                  <MatchupCard
                    batter={batter}
                    adjustedBatter={situationalBatter}
                    pitcher={pitcher}
                    halfInning={gameState.halfInning}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                  />
                </div>

                {/* Game Over state */}
                {gameState.gameOver && (
                  <div className="bg-card border border-primary/30 rounded-xl p-4 text-center space-y-3">
                    {/* Home win celebration - 1984 accurate */}
                    {gameState.score.home > gameState.score.away && (
                      <WinCelebration teamKey={homeTeam} gameState={gameState} isHomeWin={true} />
                    )}
                    <Trophy className="w-8 h-8 text-primary mx-auto" />
                    <div>
                      <h2 className="font-heading text-base font-bold text-foreground">Game Over!</h2>
                      <p className="font-heading text-primary font-bold mt-1">
                        {gameState.score.home > gameState.score.away ? home?.name : away?.name} Win!
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => setShowSummary(true)} variant="outline" className="flex-1 gap-2">
                        <Trophy className="w-4 h-4" />
                        <span className="font-heading">Summary</span>
                      </Button>
                      <Button onClick={handleNewGame} className="flex-1 gap-2">
                        <RotateCcw className="w-4 h-4" />
                        <span className="font-heading">New Game</span>
                      </Button>
                    </div>
                  </div>
                )}

                {/* Achievement popup moved to end of component (unified Exhibition + Season) */}

                {/* Leader Challenge Progress popup */}
                {leaderProgress && (
                  <LeaderProgressPopup
                    progress={leaderProgress}
                    onDismiss={() => setLeaderProgress(null)}
                  />
                )}

                {/* Desktop: Action Panel in right column */}
                {!gameState.gameOver && (
                  <div className="hidden md:block bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xs text-muted-foreground font-heading uppercase tracking-wider">YOU:</span>
                      <span className="text-sm text-primary font-heading font-bold">
                        {isUserBatting ? 'Batting' : 'Pitching'}
                      </span>
                    </div>
                    <ActionPanel
                      isPitching={isUserPitching}
                      onPitch={handlePitch}
                      onSwing={handleSwing}
                      onSteal={handleSteal}
                      onHitAndRun={handleHitAndRun}
                      onIntBB={handleIntBB}
                      disabled={processing || !!ejectionResult}
                      bases={gameState.bases}
                      hitAndRun={gameState.hitAndRun}
                      pitcherPitches={pitcher.pitches}
                      pitcherNeedsReplacement={pitcherNeedsReplacement}
                      onNeedReliever={() => { setSubsTab('pitching'); setShowSubs(true); }}
                      pitcherSpecialty={pitcherSpecialty}
                      reachBackUses={reachBackUses}
                      reachBackMax={reachBackMax}
                      situationalBatter={situationalBatter}
                      lastPlay={gameState.lastPlay}
                    />
                  </div>
                )}
                </div>{/* end RIGHT column */}
              </div>
            )}

            {tab === 'log' && (
              <div className="space-y-3">
                <IncidentLog gameState={gameState} />
                <div className="bg-card border border-border rounded-xl p-3">
                  <h3 className="font-heading text-sm font-bold text-foreground mb-2">Play-by-Play</h3>
                  <PlayLog log={gameState.log} />
                </div>
              </div>
            )}

            {tab === 'box' && (
              <div className="bg-card border border-border rounded-xl p-3">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">Box Score</h3>
                <BoxScore state={gameState} />
              </div>
            )}
        </div>
      </div>

      {/* Action Panel - pinned to bottom on mobile only */}
      {!gameState.gameOver && (
        <div className="shrink-0 border-t border-border bg-card/90 backdrop-blur px-3 py-2 w-full max-w-2xl mx-auto md:hidden" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.5rem)' }}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] md:text-xs text-muted-foreground font-heading uppercase tracking-wider">YOU:</span>
            <span className="text-[11px] md:text-sm text-primary font-heading font-bold">
              {isUserBatting ? 'Batting' : 'Pitching'}
            </span>
          </div>
          <ActionPanel
            isPitching={isUserPitching}
            onPitch={handlePitch}
            onSwing={handleSwing}
            onSteal={handleSteal}
            onHitAndRun={handleHitAndRun}
            onIntBB={handleIntBB}
            disabled={processing || !!ejectionResult}
            bases={gameState.bases}
            hitAndRun={gameState.hitAndRun}
            pitcherPitches={pitcher.pitches}
            pitcherNeedsReplacement={pitcherNeedsReplacement}
            onNeedReliever={() => { setSubsTab('pitching'); setShowSubs(true); }}
            pitcherSpecialty={pitcherSpecialty}
            reachBackUses={reachBackUses}
            reachBackMax={reachBackMax}
            situationalBatter={situationalBatter}
            lastPlay={gameState.lastPlay}
          />
        </div>
      )}



      {bannerPopup && (
        <BannerPopup
          banner={bannerPopup}
          onClose={() => setBannerPopup(null)}
        />
      )}

      {/* Fan Chirp Toast - teal bubble from the stands */}
      {gameState && !gameState.gameOver && (
        <FanChirpToast
          trigger={gameState.log.length}
          homeTeamKey={homeTeam}
          forceTrigger={forceFanChirpTrigger}
          onCheck={() => incAtmo('fan_checked')}
          onFire={() => incAtmo('fan_fired')}
        />
      )}

      {/* Atmosphere Debug Panel - hidden in normal play; add ?atmo to URL to view */}
      {gameState && !gameState.gameOver && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('atmo') && (
        <AtmosphereDebugPanel onForce={handleForceAtmoEvent} />
      )}



      {/* Fireworks */}
      <Fireworks trigger={hrTrigger} type="hr" />
      <Fireworks trigger={winTrigger} type="win" />



      {/* Beanball Banner - HBP, warnings, bat flips, collisions, brawls */}
      {beanballEvent && (
        <BeanballBanner
          event={beanballEvent}
          onDismiss={() => setBeanballEvent(null)}
        />
      )}

      {/* Arguments Banner */}
      {argumentResult && (
        <ArgumentsBanner
          result={argumentResult}
          onDismiss={() => setArgumentResult(null)}
        />
      )}

      {/* Discipline Incident Banner */}
      {disciplineIncident && (
        <DisciplineIncidentBanner
          incident={disciplineIncident}
          onDismiss={() => {
            setDisciplineIncident(null);
            // After the user has seen the incident story, trigger the pending
            // pitching replacement (it was blocked while the incident was showing).
            if (gameState?._pendingEjectionReplacement && !ejectionResult) {
              const r = resolveEjectionReplacement(gameState, userTeam);
              if (r.action === 'show_modal') setEjectionResult({ ejectedSide: r.ejectedSide, bullpen: r.bullpen });
              else if (r.action === 'cpu_replaced') setGameState(r.newState);
            }
          }}
        />
      )}





      {/* Collision Popup */}
      {collisionPopup && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-95 fade-in duration-300">
          <div className="bg-card border-2 border-amber-400 rounded-xl px-8 py-6 shadow-2xl text-center max-w-sm">
            <div className="text-5xl mb-3 animate-bounce">💥</div>
            <p className="font-heading text-lg font-bold text-amber-300 mb-3">COLLISION AT THE PLATE!</p>
            <p className="text-sm text-foreground/80 mb-4 italic">{collisionPopup}</p>
            <button
              onClick={() => setCollisionPopup(null)}
              className="font-heading text-sm px-6 py-2 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 rounded-lg transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}



      {/* Injury Alert Modal - shows injury details before replacement */}
      {injuryAlert && (
        <InjuryAlertModal
          injury={injuryAlert.injury}
          type={injuryAlert.type}
          teamKey={injuryAlert.teamKey}
          onClose={handleInjuryAlertDismiss}
        />
      )}

      {/* Pitcher Injury Modal - user picks replacement from bullpen */}
      {pitcherInjury && (
        <PitcherInjuryModal
          injury={pitcherInjury}
          bullpen={pitcherInjury.bullpen}
          onSelect={handlePitcherInjuryReplacement}
        />
      )}

      {/* Batter Injury Modal - user picks pinch hitter from bench */}
      {batterInjury && (
        <BatterInjuryModal
          injury={batterInjury}
          bench={batterInjury.bench}
          onSelect={handleBatterInjuryReplacement}
        />
      )}

      {/* Runner Injury Modal - user picks pinch runner / replacement */}
      {runnerInjury && (
        <BatterInjuryModal
          injury={runnerInjury}
          bench={runnerInjury.bench}
          onSelect={handleRunnerInjuryReplacement}
        />
      )}

      {/* Sliding Injury Modal - user picks replacement after slide injury */}
      {slidingInjury && (
        <BatterInjuryModal
          injury={slidingInjury}
          bench={slidingInjury.bench}
          onSelect={handleSlidingInjuryReplacement}
        />
      )}

      {/* Fielder Injury Modal - user picks replacement after fielding injury */}
      {fielderInjury && (
        <BatterInjuryModal
          injury={fielderInjury}
          bench={fielderInjury.bench}
          onSelect={handleFielderInjuryReplacement}
        />
      )}

      {/* Ejection Replacement Modal - user picks replacement pitcher */}
      {ejectionResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-destructive/50 rounded-xl p-6 max-w-md w-full">
            <h2 className="font-heading text-lg font-bold text-destructive mb-3">🟥 Pitcher Ejected</h2>
            <p className="text-sm text-foreground/80 mb-4">Choose a replacement pitcher from your bullpen:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {ejectionResult.bullpen && ejectionResult.bullpen.length > 0 ? (
                ejectionResult.bullpen.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleEjectionReplacement(p)}
                    className="w-full text-left bg-muted hover:bg-muted/80 rounded-lg p-3 transition-colors"
                  >
                    <div className="font-heading text-sm font-bold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">Control: {p.control} | Stamina: {p.stamina}</div>
                  </button>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No relievers available in bullpen</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Award Modal - Tigers home win */}
      {cardAward && (
        <CardAwardModal
          card={cardAward}
          onDismiss={() => {
            setCardAward(null);
            setCardPending(false);
          }}
        />
      )}

      {/* Game Over Popup - shows when game ends with winner announcement */}
      {gameOverPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-card border-2 border-primary/50 rounded-xl px-8 py-6 shadow-2xl text-center max-w-md w-full mx-4 animate-in zoom-in-95 duration-300">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">GAME OVER!</h2>
            <p className="font-heading text-lg text-primary font-bold mb-1">
              {TEAMS[gameOverPopup.winner]?.name} Win!
            </p>
            <p className="text-sm text-muted-foreground mb-3">{gameOverPopup.score}</p>
            <div className="bg-muted/50 rounded-lg px-3 py-2 mb-4">
              <p className="text-xs text-foreground/80 italic">{gameOverPopup.finalPlay}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { setShowSummary(true); setGameOverPopup(null); }} variant="outline" className="flex-1 gap-2">
                <Trophy className="w-4 h-4" />
                <span className="font-heading">Summary</span>
              </Button>
              {gameMode === 'season' ? (
                <Button
                  onClick={async () => {
                    if (seasonCommitPromiseRef.current) {
                      setSeasonCommitting(true);
                      await seasonCommitPromiseRef.current;
                    }
                    window.location.href = '/season';
                  }}
                  disabled={seasonCommitting}
                  className="flex-1 gap-2"
                >
                  {seasonCommitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span className="font-heading">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Trophy className="w-4 h-4" />
                      <span className="font-heading">Back to Season</span>
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNewGame} className="flex-1 gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-heading">New Game</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Game Summary Modal */}
      {showSummary && gameState && gameState.gameOver && (
        <GameSummary
          gameState={gameState}
          homeTeam={homeTeam}
          awayTeam={awayTeam}
          userTeam={userTeam}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* Substitutions Panel */}
      {showSubs && (
        <SubstitutionsPanel
          gameState={gameState}
          teams={TEAMS}
          userTeam={userTeam}
          onClose={() => { setShowSubs(false); setSubsTab('pinchhit'); }}
          onPinchHit={handlePinchHit}
          onPinchRun={handlePinchRun}
          onDefensiveSwitch={handleDefensiveSwitch}
          onChangePitcher={handlePitchingChange}
          initialTab={subsTab}
          unavailableRelievers={gameState._unavailableRelieverReasons || {}}
          tiredRelievers={gameState._tiredRelievers || {}}
        />
      )}

      <AchievementPopup
        achievementIds={showAchievementPopup ? newAchievements : []}
        onDismiss={() => setShowAchievementPopup(false)}
      />
    </div>
    </ErrorBoundary>
  );
}