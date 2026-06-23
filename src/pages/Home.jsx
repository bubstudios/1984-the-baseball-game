import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS, PITCH_TYPES, SWING_TYPES, MANAGERS } from '@/lib/gameData';
import { createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing, getCurrentBatter, getCurrentPitcher, getEffectivePitcher, getBattingTeam, getSituationalBatter, attemptSteal, setHitAndRun, cpuDecideSteal, cpuDecideSubstitutions, hasRunnersOnBase, pinchHit, pinchRun, defensiveSwitch, changePitcher, intentionalWalk } from '@/lib/gameEngine';
import { applyWeatherEffects } from '@/lib/weather';
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
import InjuryBanner from '@/components/game/InjuryBanner';

import InjuryReplacementModal from '@/components/game/InjuryReplacementModal';
import BeanballBanner from '@/components/game/BeanballBanner';
import GameSummary from '@/components/game/GameSummary';
import { getHBPCall, getWarningCall, getEjectionCall, getBatFlipCall, getCollisionCall, getBrawlCall } from '@/lib/beanballCommentary';
import ErrorBoundary from '@/components/game/ErrorBoundary';
import { applyInjuryReplacement } from '@/lib/injuryReplacement';
import { getArgumentSeverity, resolveArgument, getEjectionCommentary, maybeDugoutChirp } from '@/lib/umpireArguments';
import { pickUmpire, getManagerUmpireRelation } from '@/lib/umpires';
import { rollBallparkEvent, resetBallparkEvents } from '@/lib/ballparkEvents';
import useRobotAnnouncer from '@/hooks/useRobotAnnouncer';
import TutorialModal, { hasSeenTutorial } from '@/components/game/TutorialModal';
import RetroLoading from '@/components/game/RetroLoading';
import useRetroAudio, { unlockAudio } from '@/hooks/useRetroAudio';
import { checkGameAchievements, ACHIEVEMENTS, getUnlockedCount, ensureStatsInit, trackSessionStart, trackGameCompleted, trackGameEndTime, checkTeamAchievements, unlockAchievement } from '@/lib/achievements';
import AchievementPopup from '@/components/game/AchievementPopup';
import { RotateCcw, Trophy, Users, Volume2, VolumeX, HelpCircle, Radio } from 'lucide-react';
import { pickAd } from '@/lib/broadcastAds';
import AdRead from '@/components/game/AdRead';
import FlyWFlag from '@/components/game/FlyWFlag';
import CardAwardModal from '@/components/game/CardAwardModal';
import { getRandomCardForTeam, addCard, loadFromStorage, saveToStorage, migrateLegacyStorage, getCollectedIds } from '@/lib/baseballCards';
import FanChirpToast from '@/components/game/FanChirpToast';

export default function Home() {
  const [gameState, setGameState] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
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
  const [argumentResult, setArgumentResult] = useState(null);
  const [selectedUmpire, setSelectedUmpire] = useState(null);
  const [ejectionCount, setEjectionCount] = useState(0);
  const [ballparkEvent, setBallparkEvent] = useState(null);
  const [injuryResult, setInjuryResult] = useState(null);
  const [ejectionResult, setEjectionResult] = useState(null);
  const prevLastPlay = useRef(null);
  const prevGameOver = useRef(false);
  const prevLogLength = useRef(0);
  const prevHalfInning = useRef(null);
  const [showAd, setShowAd] = useState(null);
  const [showStretch, setShowStretch] = useState(null);
  const [beanballEvent, setBeanballEvent] = useState(null);
  const [cardAward, setCardAward] = useState(null);
  const [showSummary, setShowSummary] = useState(false);

  // Auto-show tutorial on first visit & init stats
  useEffect(() => {
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
    }
    ensureStatsInit();
    trackSessionStart();
    migrateLegacyStorage();
  }, []);

  // Robot announcer — use stadium's lead announcer voice
  const announcerName = homeTeam && TEAM_TO_FLAVOR[homeTeam]
    ? STADIUM_FLAVOR[TEAM_TO_FLAVOR[homeTeam]]?.announcers?.[0]
    : null;
  useRobotAnnouncer(gameState, robotVoice, announcerName);
  useRetroAudio(gameState, retroAudio);

  const startGame = useCallback((home, away, customHomeLineup, customAwayLineup, useDHFlag, weather, startingPitcher, opponentStartingPitcher) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setUserTeam(home); // user controls home team
    setUseDH(useDHFlag);
    const umpire = selectedUmpire || pickUmpire();
    setSelectedUmpire(umpire);
    setEjectionCount(0);
    setArgumentResult(null);
    setBallparkEvent(null);
    setInjuryResult(null);
    setBeanballEvent(null);
    resetBallparkEvents();
    const stadium = TEAMS[home]?.stadium || null;
    setGameStadium(stadium);
    setGameWeather(weather || null);
    const state = createGameState(home, away, customHomeLineup, customAwayLineup, useDHFlag, weather, umpire, startingPitcher, opponentStartingPitcher);
    const homeName = TEAMS[home].name;
    const awayName = TEAMS[away].name;
    state.log.push({ type: 'info', text: `⚾ Play ball! ${awayName} at ${homeName}` });
    if (umpire) {
      state.log.push({ type: 'info', text: `👨‍⚖️ Home plate umpire: ${umpire.name} — "${umpire.nick}"` });
      state.log.push({ type: 'info', text: `   ${umpire.pregameLine}` });
    }
    if (weather) {
      state.log.push({ type: 'info', text: `🌤 ${weather.summary} — ${weather.date}` });
      if (weather.effects.length > 0) {
        weather.effects.forEach(e => state.log.push({ type: 'info', text: `   ${e}` }));
      }
    }
    state.log.push({ type: 'info', text: `Top of inning 1 — ${awayName} batting` });
    setGameState(state);
    setLineupPhase(null);
  }, []);

  const handleTeamSelect = useCallback((home, away) => {
    setBallparkPhase({ home, away });
  }, []);

  const handleBallparkConfirm = useCallback((parkTeam, useDHFlag, weather, umpire) => {
    setSelectedUmpire(umpire);
    setLineupPhase({ home: ballparkPhase.home, away: ballparkPhase.away, useDH: useDHFlag, parkTeam, weather });
    setBallparkPhase(null);
  }, [ballparkPhase]);

  const handleLineupConfirm = useCallback((customLineup, startingPitcher, opponentStartingPitcher) => {
    startGame(lineupPhase.home, lineupPhase.away, customLineup, null, lineupPhase.useDH, lineupPhase.weather, startingPitcher, opponentStartingPitcher);
  }, [lineupPhase, startGame]);

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
      setBeanballEvent({ type: 'warning', text: getWarningCall(homeTeam), subtext: `Tension at ${gameState._beanball?.tension || 0}% — both dugouts warned` });
      setGameState(prev => prev ? { ...prev, _beanballWarning: false } : prev);
    }

    // Check for pitcher ejections — prompt user for replacement
    if (gameState._pendingEjectionReplacement && !ejectionResult) {
      const ejectedSide = gameState._beanball?.autoEjectionSide;
      const isUserTeam = ejectedSide === 'home' && userTeam === gameState.homeTeam || ejectedSide === 'away' && userTeam === gameState.awayTeam;
      if (isUserTeam) {
        // User must pick a replacement pitcher
        const bullpen = ejectedSide === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
        setEjectionResult({ ejectedSide, bullpen });
      } else {
        // CPU team ejection — auto-select best reliever
        const bullpen = ejectedSide === 'home' ? gameState.homeBullpen : gameState.awayBullpen;
        if (bullpen && bullpen.length > 0) {
          const sorted = [...bullpen].sort((a, b) => b.control - a.control);
          const newReliever = sorted[0];
          const newState = changePitcher(gameState, newReliever, ejectedSide);
          setGameState(prev => newState);
        }
      }
      return;
    }

    // Check for injuries — only show once per injury
    if (gameState._pendingInjury && !injuryResult) {
      const isUserTeam = gameState._pendingInjury.isAway
        ? userTeam === gameState.awayTeam
        : userTeam === gameState.homeTeam;
      if (isUserTeam) {
        // User must pick a replacement for their own team's injury
        setInjuryResult({ ...gameState._pendingInjury, _pending: true });
      } else {
        // CPU team injury — auto-select first bench option
        const benchOptions = gameState._pendingInjury.benchOptions || [];
        if (benchOptions.length > 0) {
          const newState = applyInjuryReplacement(gameState, benchOptions[0]);
          setGameState(prev => newState);
        }
      }
      return;
    }
    if (gameState.lastInjury && !injuryResult && !gameState._injuryShown) {
      // If injury was already auto-handled (no bench), show the standard banner
      if (!gameState._pendingInjury) {
        setInjuryResult(gameState.lastInjury);
      }
      setGameState(prev => prev ? { ...prev, _injuryShown: true } : prev);
    }

    // Detect 7th inning stretch
    if (gameState.log.length > prevLogLength.current) {
      const newEntries = gameState.log.slice(prevLogLength.current);
      const stretchEntry = newEntries.find(l => l.type === 'info' && l.text && l.text.includes('🎶'));
      if (stretchEntry && !gameState.gameOver) {
        setShowStretch(stretchEntry.text);
      }
    }

    // Trigger ads on half-inning transition or pitching change
    const currentHalf = gameState.halfInning;
    if (prevHalfInning.current !== currentHalf && !gameState.gameOver) {
      // New half-inning started — ad break (only if no ad is currently showing)
      setShowAd(prev => prev ? prev : pickAd(homeTeam));
    } else if (gameState.log.length > prevLogLength.current) {
      // Check newest log entries for pitching changes
      const newEntries = gameState.log.slice(prevLogLength.current);
      const hasPitchingChange = newEntries.some(l =>
        l.type === 'info' && l.text && l.text.includes('replaces') && l.text.includes('on the mound')
      );
      if (hasPitchingChange && !gameState.gameOver) {
        setShowAd(prev => prev ? prev : pickAd(homeTeam));
      }
    }
    prevLogLength.current = gameState.log.length;
    prevHalfInning.current = currentHalf;

    // Game-over: handler path processes achievements via finally block.
    // No need to double-process here — trackGameCompleted is not idempotent.
  }, [gameState]);

  // Argument check via effect after a play resolves
  useEffect(() => {
    if (!gameState || gameState.gameOver || !gameState.lastPlay) return;
    
    // Only check once per play
    if (gameState.lastPlay === prevLastPlay.current) return;
    prevLastPlay.current = gameState.lastPlay;

    checkForArgumentLogic(gameState);
  }, [gameState, homeTeam, awayTeam]);

  const checkForArgumentLogic = useCallback((state) => {
    if (!state || state.gameOver) return state;

    // Check for random ballpark event (one per game) — only between at-bats
    const isBetweenAtBats = state.balls === 0 && state.strikes === 0;
    const bpEvent = isBetweenAtBats ? rollBallparkEvent(state) : null;
    if (bpEvent && !ballparkEvent) {
      setBallparkEvent(bpEvent);
    }

    // First: check for a real play-based argument
    const severity = state.lastPlay ? getArgumentSeverity(state.lastPlay, state, state._argTopicCounts) : null;

    if (!severity) {
      // No play argument — maybe just a random dugout chirp
      const chirp = maybeDugoutChirp(state);
      if (chirp) {
        // Chirps can come from either dugout
        const battingSide = getBattingTeam(state);
        const chirpSide = Math.random() < 0.5 ? battingSide : (battingSide === 'home' ? 'away' : 'home');
        const chirpTeamKey = chirpSide === 'home' ? homeTeam : awayTeam;
        const manager = MANAGERS[chirpTeamKey];
        // Skip if this team's manager was ejected
        const isEjected = chirpSide === 'home' ? state._homeManagerEjected : state._awayManagerEjected;
        if (isEjected) return state;
        const umpireObj = state.umpire || 'standard';
        const chirpScore = state.score[chirpSide];
        const oppScore = state.score[chirpSide === 'home' ? 'away' : 'home'];
        const scoreDiff = oppScore - chirpScore;
        const chirpResult = resolveArgument(chirp, manager?.personality || 5, umpireObj, state.inning, scoreDiff, chirpSide === 'home');
        if (chirpResult) {
          chirpResult.managerName = manager?.name || 'The Manager';
          setArgumentResult({ ...chirpResult, homeTeamKey: chirpTeamKey });
        }
      }
      return;
    }

    // Determine which team argues based on the play outcome
    // Batting team argues when their guy got HBP (want retaliation/warnings)
    // Fielding team argues when the call went against them (hits, walks)
    const playType = state.lastPlay?.type;
    const playText = state.lastPlay?.text || '';
    const isHBP = playType === 'walk' && (playText.includes('hit by the pitch') || playText.includes('HBP'));
    // HBP: batting team argues (their player got hit)
    // FIELDING_ARGUES: fielding team argues (hit/walk/error went against them)
    // OUT_ARGUES: batting team argues (their guy was called out on a disputed play)
    // Fielding team argues when a hit/walk/error went against them
    // Batting team argues when a strike/out call went against them
    const FIELDING_ARGUES = isHBP ? [] : ['single', 'double', 'triple', 'homerun', 'walk', 'error', 'ball'];
    const OUT_ARGUES = ['flyout', 'groundout', 'lineout', 'strikeout', 'popout', 'doubleplay', 'sacfly', 'strike', 'foul', 'caughtstealing'];
    const battingSide = getBattingTeam(state);
    const fieldingSide = battingSide === 'home' ? 'away' : 'home';
    let arguingSide;
    if (isHBP) arguingSide = battingSide;
    else if (FIELDING_ARGUES.includes(playType)) arguingSide = fieldingSide;
    else if (OUT_ARGUES.includes(playType)) arguingSide = battingSide;
    else arguingSide = fieldingSide;
    const arguingTeamKey = arguingSide === 'home' ? homeTeam : awayTeam;
    const manager = MANAGERS[arguingTeamKey];

    // Check if this team's manager was already ejected
    const isManagerEjected = arguingSide === 'home' ? state._homeManagerEjected : state._awayManagerEjected;
    if (isManagerEjected && severity.severity === 'chirp') return state;

    const umpireObj = state.umpire || 'standard';
    const arguingScore = state.score[arguingSide];
    const opposingScore = state.score[arguingSide === 'home' ? 'away' : 'home'];
    const scoreDiff = opposingScore - arguingScore;

    const result = resolveArgument(
      severity,
      manager?.personality || 5,
      umpireObj,
      state.inning,
      scoreDiff,
      arguingSide === 'home',
      arguingSide === fieldingSide  // isFieldingTeamArguing
    );

    if (!result) return state;

    // Use coach name if manager was ejected
    if (isManagerEjected) {
      result.managerName = manager?.coach || 'The Acting Manager';
      if (result.escaLevel > 2) result.escaLevel = 2;
      result.ejected = false;
    } else {
      result.managerName = manager?.name || 'The Manager';
    }

    // Track topic usage
    if (severity.topicKey) {
      const counts = { ...(state._argTopicCounts || {}) };
      counts[severity.topicKey] = (counts[severity.topicKey] || 0) + 1;
      state = { ...state, _argTopicCounts: counts };
    }

    // Track argument for first_argument achievement
    unlockAchievement('first_argument');

    // If ejected, log it and check achievements
    if (result.ejected && result.whoArgues === 'manager') {
      const cmt = getEjectionCommentary(arguingTeamKey, result);
      const ejectedKey = arguingSide === 'home' ? '_homeManagerEjected' : '_awayManagerEjected';
      state = {
        ...state,
        log: [...state.log, { type: 'ejection', text: `🟥 ${cmt}` }],
        _managerEjected: true,
        _ejectedTeam: arguingSide,
        [ejectedKey]: true,
      };
      setEjectionCount(c => {
        const newCount = c + 1;
        unlockAchievement('youre_gone');
        if (newCount >= 10) unlockAchievement('frequent_flyer');
        if (newCount >= 25) unlockAchievement('billy_martin');
        if (result.dirtKick) unlockAchievement('dirt_kicker');
        if (result.basePickup) unlockAchievement('base_thief');
        if (result.benchEjection) unlockAchievement('bench_tossed');
        return newCount;
      });
    } else {
      // Non-ejection argument — log it
      const cmt = getEjectionCommentary(arguingTeamKey, result);
      state = { ...state, log: [...state.log, { type: 'info', text: `🗣️ ${cmt}` }] };
    }

    // Show the animation — use the arguing team's key for correct commentary
    setArgumentResult({ ...result, homeTeamKey: arguingTeamKey });
  }, [homeTeam, awayTeam]);

  // ── Game-over achievement processing (called from effect AND play handlers) ──
  const processGameOver = useCallback((state) => {
    if (!state || !state.gameOver) return;
    const userSide = state.homeTeam === userTeam ? 'home' : 'away';
    const opponentSide = userSide === 'home' ? 'away' : 'home';
    const userWon = state.score[userSide] > state.score[opponentSide];
    const userLineup = userSide === 'home' ? state.homeLineup : state.awayLineup;
    const opponentLineup = userSide === 'home' ? state.awayLineup : state.homeLineup;

    const userHits = [...userLineup, ...(userSide === 'home' ? (state.homePlayerHistory || []) : (state.awayPlayerHistory || []))]
      .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);
    const oppHits = [...opponentLineup, ...(userSide === 'home' ? (state.awayPlayerHistory || []) : (state.homePlayerHistory || []))]
      .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);

    // Run stats tracking and achievements independently — one failure shouldn't block the other
    try { trackGameCompleted(userWon, userTeam, null, gameStadium, userHits, oppHits); } catch (e) { console.error('trackGameCompleted failed:', e); }
    try { trackGameEndTime(); } catch (e) { console.error('trackGameEndTime failed:', e); }
    try { checkTeamAchievements(); } catch (e) { console.error('checkTeamAchievements failed:', e); }

    if (state._managerEjected && userWon) {
      try { unlockAchievement('earl_weaver'); } catch (e) { console.error('earl_weaver failed:', e); }
    }

    // Award a baseball card on any home win
    if (userWon && userTeam) {
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
      } catch (e) { console.error('cardAward failed:', e); }
    }

    try {
      const newOnes = checkGameAchievements(state, userTeam);
      if (newOnes.length > 0) {
        setNewAchievements(newOnes);
        setShowAchievementPopup(true);
      }
    } catch (e) {
      console.error('checkGameAchievements failed:', e);
    }
  }, [userTeam, gameStadium]);

  const isUserBatting = gameState && (
    (gameState.halfInning === 'top' && userTeam === gameState.awayTeam) ||
    (gameState.halfInning === 'bottom' && userTeam === gameState.homeTeam)
  );

  const isUserPitching = gameState && !isUserBatting;

  const handlePitch = useCallback((pitchName) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
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
      console.log('Processing pitch:', pitchName, 'cpuSwing:', cpuSwing);
      const resultState = processAtBat(updatedState, pitchObj, SWING_TYPES[cpuSwing]);
      console.log('After processAtBat:', resultState);
      
      // CPU may make substitutions after the at-bat
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      if (afterSubs.gameOver) endingState = afterSubs;
      console.log('Setting game state with new play:', afterSubs.lastPlay);
      setGameState(afterSubs);
    } catch (e) {
      console.error('handlePitch error:', e);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, processing, userTeam, processGameOver]);

  const handleSwing = useCallback((swingIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    let endingState = null;
    try {
      const cpuPitch = cpuSelectPitch(gameState);
      console.log('Swing:', swingIndex, 'CPU pitch:', cpuPitch);
      const resultState = processAtBat(gameState, PITCH_TYPES[cpuPitch], SWING_TYPES[swingIndex]);
      console.log('After processAtBat:', resultState);
      
      // CPU may make substitutions after the at-bat
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      if (afterSubs.gameOver) endingState = afterSubs;
      console.log('Setting game state with new play:', afterSubs.lastPlay);
      setGameState(afterSubs);
    } catch (e) {
      console.error('handleSwing error:', e);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, processing, userTeam, processGameOver]);

  const handleSteal = useCallback((baseIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    let endingState = null;
    try {
      // Steal attempt: runner goes on the pitch, batter takes automatically
      const stealPending = { ...gameState, pendingSteal: baseIndex };
      // CPU selects pitch, batter takes (swingType 3 = Take Pitch)
      const cpuPitch = cpuSelectPitch(stealPending);
      const resultState = processAtBat(stealPending, PITCH_TYPES[cpuPitch], SWING_TYPES[3]);
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      if (afterSubs.gameOver) endingState = afterSubs;
      setGameState(afterSubs);
    } catch (e) {
      console.error('handleSteal error:', e);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, processing, userTeam, processGameOver]);

  const handleHitAndRun = useCallback(() => {
    if (!gameState || gameState.gameOver || processing) return;
    const newState = setHitAndRun(gameState, !gameState.hitAndRun);
    setGameState(newState);
  }, [gameState, processing]);

  const handleIntBB = useCallback(() => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    let endingState = null;
    try {
      const newState = intentionalWalk(gameState);
      if (newState.gameOver) endingState = newState;
      setGameState(newState);
    } catch (e) {
      console.error('handleIntBB error:', e);
    } finally {
      if (endingState) {
        try { processGameOver(endingState); } catch (e) { console.error('processGameOver failed:', e); }
      }
      setProcessing(false);
    }
  }, [gameState, processing, processGameOver]);

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

  const handleInjuryReplacement = (chosenPlayer) => {
    if (!gameState || !gameState._pendingInjury) return;
    const newState = applyInjuryReplacement(gameState, chosenPlayer);
    setGameState(newState);
    setInjuryResult(null);
  };

  const handleEjectionReplacement = (chosenPitcher) => {
    if (!gameState || !ejectionResult) return;
    const newState = changePitcher(gameState, chosenPitcher, ejectionResult.ejectedSide);
    setGameState(newState);
    setEjectionResult(null);
  };

  const handleNewGame = () => {
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
    setTab('game');
    setNewAchievements([]);
    setShowAchievementPopup(false);
    setArgumentResult(null);
    setSelectedUmpire(null);
    setInjuryResult(null);
    prevGameOver.current = false;
    prevHalfInning.current = null;
    prevLogLength.current = 0;
    setShowAd(null);
    setShowStretch(null);
    setBeanballEvent(null);
    setEjectionResult(null);
    setCardAward(null);
    setShowSummary(false);
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
    return (
      <ErrorBoundary>
      <LineupManager
        teamKey={lineupPhase.home}
        teamData={TEAMS[lineupPhase.home]}
        opponentTeamData={TEAMS[lineupPhase.away]}
        useDH={lineupPhase.useDH}
        parkTeam={lineupPhase.parkTeam}
        onConfirm={handleLineupConfirm}
        onBack={() => { setLineupPhase(null); setBallparkPhase({ home: lineupPhase.home, away: lineupPhase.away }); }}
      />
      </ErrorBoundary>
    );
  }

  if (!gameState) {
    if (loadingScreen) {
      return <RetroLoading onComplete={() => setLoadingScreen(false)} />;
    }
    return (
      <>
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { if (!retroAudio) unlockAudio(); setRetroAudio(!retroAudio); }}
            className={`h-8 w-8 p-0 rounded-full border-muted-foreground/30 hover:border-primary/50 ${retroAudio ? 'bg-primary/10 border-primary/50' : ''}`}
            title={retroAudio ? 'Retro audio on' : 'Retro audio off'}
          >
            <Radio className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="h-8 w-8 p-0 rounded-full border-muted-foreground/30 hover:border-primary/50"
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
  // With DH on, the pitcher never bats, so they won't be in the lineup — that's expected
  const pitcherNeedsReplacement = isUserPitching && pitcher && userFieldingLineup && !useDH && pitcher.name
    ? !userFieldingLineup.some(p => p.name === pitcher.name)
    : false;

  // Reach Back — specialty pitch for iconic pitchers
  const pitcherSpecialty = pitcher?.specialty || null;
  const reachBackUses = gameState._reachBackUses || 0;
  const isStarter = pitcher?.pos === 'SP' || pitcher?.assignedPos === 'SP';
  const reachBackMax = isStarter ? 3 : 1;

  const situationalBatter = getSituationalBatter(gameState);
  const battingTeamKey = getBattingTeam(gameState) === 'home' ? homeTeam : awayTeam;
  const battingTeamName = TEAMS[battingTeamKey]?.name || '';
  const inningLabel = `${gameState.halfInning === 'top' ? '▲' : '▼'} ${gameState.inning}`;
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  return (
    <ErrorBoundary>
    <div className="h-[100dvh] md:h-auto md:min-h-screen bg-background text-foreground flex flex-col overflow-hidden md:overflow-visible">
      {/* Compact Top Bar */}
      <div className="shrink-0 border-b border-border bg-card/50 px-3 md:px-6 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm shrink-0">⚾</span>
          <div className="min-w-0">
            <div className="font-heading text-[11px] text-foreground font-bold truncate">
              {away?.abbr} {gameState.score.away} — {gameState.score.home} {home?.abbr}
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
            onClick={() => setRobotVoice(!robotVoice)}
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

      {/* Middle content — responsive: single column mobile, two-column desktop */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-2 md:max-w-6xl md:mx-auto md:w-full">
        {/* Desktop: Game tab gets two-column layout */}
        <div className="md:flex md:gap-4">
          {/* Left column: Diamond + Commentary + Matchup */}
          <div className="md:flex-1 md:min-w-0 space-y-2">
            {tab === 'game' && (
              <>
                {/* Scoreboard — compact */}
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

                {/* Ad read — appears between innings / during pitching changes */}
                {showAd && (
                  <AdRead
                    ad={showAd}
                    onDismiss={() => setShowAd(null)}
                    autoDismissMs={0}
                    onAchievement={(ids) => {
                      if (ids.length > 0) {
                        setNewAchievements(ids);
                        setShowAchievementPopup(true);
                      }
                    }}
                  />
                )}

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
                    {/* Fly the W — Cubs home win */}
                    {homeTeam === 'cubs' && gameState.score.home > gameState.score.away && (
                      <FlyWFlag />
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

                {/* Achievement popup — flashy overlay */}
                {showAchievementPopup && newAchievements.length > 0 && (
                  <AchievementPopup
                    achievementIds={newAchievements}
                    onDismiss={() => setShowAchievementPopup(false)}
                  />
                )}
              </>
            )}

            {tab === 'log' && (
              <div className="bg-card border border-border rounded-xl p-3">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">Play-by-Play</h3>
                <PlayLog log={gameState.log} />
              </div>
            )}

            {tab === 'box' && (
              <div className="bg-card border border-border rounded-xl p-3">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">Box Score</h3>
                <BoxScore state={gameState} />
              </div>
            )}
          </div>

          {/* Right column: Action Panel (desktop) */}
          <div className="hidden md:block md:w-72 md:shrink-0">
            {!gameState.gameOver && (
              <div className="bg-card border border-border rounded-xl p-4 sticky top-4">
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
                  disabled={processing}
                  bases={gameState.bases}
                  hitAndRun={gameState.hitAndRun}
                  pitcherPitches={pitcher.pitches}
                  pitcherNeedsReplacement={pitcherNeedsReplacement}
                  onNeedReliever={() => { setSubsTab('pitching'); setShowSubs(true); }}
                  pitcherSpecialty={pitcherSpecialty}
                  reachBackUses={reachBackUses}
                  reachBackMax={reachBackMax}
                  situationalBatter={situationalBatter}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Panel — pinned to bottom on mobile only */}
      {!gameState.gameOver && (
        <div className="shrink-0 border-t border-border bg-card/90 backdrop-blur px-3 py-2 md:hidden">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider">YOU:</span>
            <span className="text-[11px] text-primary font-heading font-bold">
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
            disabled={processing}
            bases={gameState.bases}
            hitAndRun={gameState.hitAndRun}
            pitcherPitches={pitcher.pitches}
            pitcherNeedsReplacement={pitcherNeedsReplacement}
            onNeedReliever={() => { setSubsTab('pitching'); setShowSubs(true); }}
            pitcherSpecialty={pitcherSpecialty}
            reachBackUses={reachBackUses}
            reachBackMax={reachBackMax}
            situationalBatter={situationalBatter}
          />
        </div>
      )}

      {/* Fan Chirp Toast — teal bubble from the stands */}
      {gameState && !gameState.gameOver && (
        <FanChirpToast trigger={gameState.log.length} homeTeamKey={homeTeam} />
      )}

      {/* Fireworks */}
      <Fireworks trigger={hrTrigger} type="hr" />
      <Fireworks trigger={winTrigger} type="win" />

      {/* Beanball Banner — HBP, warnings, bat flips, collisions, brawls */}
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

      {/* Ballpark Event Banner */}
      {ballparkEvent && (
        <BallparkEventBanner
          event={ballparkEvent}
          onDismiss={() => setBallparkEvent(null)}
        />
      )}

      {/* Injury Banner — standard notification when no bench choice needed */}
      {injuryResult && !injuryResult._pending && (
        <InjuryBanner
          injury={injuryResult}
          onDismiss={() => setInjuryResult(null)}
        />
      )}

      {/* Injury Replacement Modal — forced bench selection */}
      {injuryResult && injuryResult._pending && (
        <InjuryReplacementModal
          pendingInjury={injuryResult}
          onSelect={handleInjuryReplacement}
        />
      )}

      {/* Ejection Replacement Modal — user picks replacement pitcher */}
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

      {/* Card Award Modal — Tigers home win */}
      {cardAward && (
        <CardAwardModal
          card={cardAward}
          onDismiss={() => setCardAward(null)}
        />
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
        />
      )}
    </div>
    </ErrorBoundary>
  );
}