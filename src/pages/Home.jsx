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
import { getArgumentSeverity, resolveArgument, getEjectionCommentary, rollUmpire, maybeDugoutChirp } from '@/lib/umpireArguments';
import { rollBallparkEvent, resetBallparkEvents } from '@/lib/ballparkEvents';
import useRobotAnnouncer from '@/hooks/useRobotAnnouncer';
import TutorialModal, { hasSeenTutorial } from '@/components/game/TutorialModal';
import RetroLoading from '@/components/game/RetroLoading';
import useRetroAudio, { unlockAudio } from '@/hooks/useRetroAudio';
import { checkGameAchievements, ACHIEVEMENTS, getUnlockedCount, ensureStatsInit, trackSessionStart, trackGameCompleted, trackGameEndTime, checkTeamAchievements, unlockAchievement } from '@/lib/achievements';
import { RotateCcw, Trophy, Users, Volume2, VolumeX, HelpCircle, Radio } from 'lucide-react';
import { pickAd } from '@/lib/broadcastAds';
import AdRead from '@/components/game/AdRead';

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
  const [argumentResult, setArgumentResult] = useState(null);
  const [gameUmpire, setGameUmpire] = useState(null);
  const [ejectionCount, setEjectionCount] = useState(0);
  const [ballparkEvent, setBallparkEvent] = useState(null);
  const [injuryResult, setInjuryResult] = useState(null);
  const prevLastPlay = useRef(null);
  const prevGameOver = useRef(false);
  const prevLogLength = useRef(0);
  const prevHalfInning = useRef(null);
  const [showAd, setShowAd] = useState(null);

  // Auto-show tutorial on first visit & init stats
  useEffect(() => {
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
    }
    ensureStatsInit();
    trackSessionStart();
  }, []);

  // Robot announcer — use stadium's lead announcer voice
  const announcerName = homeTeam && TEAM_TO_FLAVOR[homeTeam]
    ? STADIUM_FLAVOR[TEAM_TO_FLAVOR[homeTeam]]?.announcers?.[0]
    : null;
  useRobotAnnouncer(gameState, robotVoice, announcerName);
  useRetroAudio(gameState, retroAudio);

  const startGame = useCallback((home, away, customHomeLineup, customAwayLineup, useDHFlag, weather) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setUserTeam(home); // user controls home team
    setUseDH(useDHFlag);
    setGameUmpire(rollUmpire());
    setEjectionCount(0);
    setArgumentResult(null);
    setBallparkEvent(null);
    setInjuryResult(null);
    resetBallparkEvents();
    setGameStadium(lineupPhase?.parkTeam ? TEAMS[lineupPhase.parkTeam]?.stadium : null);
    setGameWeather(weather || null);
    const state = createGameState(home, away, customHomeLineup, customAwayLineup, useDHFlag, weather);
    const homeName = TEAMS[home].name;
    const awayName = TEAMS[away].name;
    state.log.push({ type: 'info', text: `⚾ Play ball! ${awayName} at ${homeName}` });
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

  const handleBallparkConfirm = useCallback((parkTeam, useDHFlag, weather) => {
    setLineupPhase({ home: ballparkPhase.home, away: ballparkPhase.away, useDH: useDHFlag, parkTeam, weather });
    setBallparkPhase(null);
  }, [ballparkPhase]);

  const handleLineupConfirm = useCallback((customLineup) => {
    startGame(lineupPhase.home, lineupPhase.away, customLineup, null, lineupPhase.useDH, lineupPhase.weather);
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

    // Check for injuries — only show once per injury
    if (gameState.lastInjury && !injuryResult && !gameState._injuryShown) {
      setInjuryResult(gameState.lastInjury);
      // Mark as shown to prevent re-triggering
      setGameState(prev => prev ? { ...prev, _injuryShown: true } : prev);
    }

    // Trigger ads on half-inning transition or pitching change
    const currentHalf = `${gameState.halfInning}-${gameState.inning}`;
    if (prevHalfInning.current && prevHalfInning.current !== currentHalf && !gameState.gameOver) {
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

    // Check achievements when game ends
    if (gameState.gameOver && !prevGameOver.current) {
      prevGameOver.current = true;
      const userSide = gameState.homeTeam === userTeam ? 'home' : 'away';
      const opponentSide = userSide === 'home' ? 'away' : 'home';
      const userWon = gameState.score[userSide] > gameState.score[opponentSide];
      const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
      const opponentLineup = userSide === 'home' ? gameState.awayLineup : gameState.homeLineup;

      // Count hits
      const userHits = [...userLineup, ...(userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []))]
        .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);
      const oppHits = [...opponentLineup, ...(userSide === 'home' ? (gameState.awayPlayerHistory || []) : (gameState.homePlayerHistory || []))]
        .reduce((sum, p) => sum + (p.gameStats?.hits || 0), 0);

      // Track stats for milestone achievements
      trackGameCompleted(userWon, userTeam, null, gameStadium, userHits, oppHits);
      trackGameEndTime();
      checkTeamAchievements();

      // Earl Weaver Special: manager ejected + team won
      if (gameState._managerEjected && userWon) {
        unlockAchievement('earl_weaver');
      }

      // Check gameplay achievements
      const newOnes = checkGameAchievements(gameState, userTeam);
      if (newOnes.length > 0) {
        setNewAchievements(newOnes);
      }
    }
  }, [gameState]);

  // Argument check after a play resolves
  const checkForArgument = useCallback((state) => {
    if (!state || state.gameOver) return state;

    // Check for random ballpark event (one per game)
    const bpEvent = rollBallparkEvent(state);
    if (bpEvent && !ballparkEvent) {
      setBallparkEvent(bpEvent);
    }

    // First: check for a real play-based argument
    const severity = state.lastPlay ? getArgumentSeverity(state.lastPlay, state) : null;

    if (!severity) {
      // No play argument — maybe just a random dugout chirp
      const chirp = maybeDugoutChirp(state);
      if (chirp) {
        const battingKeystr = getBattingTeam(state) === 'home' ? homeTeam : awayTeam;
        const manager = MANAGERS[battingKeystr];
        const umpire = gameUmpire || 'standard';
        const battingScore = state.score[getBattingTeam(state)];
        const fieldingScore = state.score[getBattingTeam(state) === 'home' ? 'away' : 'home'];
        const scoreDiff = fieldingScore - battingScore;
        const chirpResult = resolveArgument(chirp, manager?.personality || 5, umpire, state.inning, scoreDiff, getBattingTeam(state) === 'home');
        if (chirpResult) {
          chirpResult.managerName = manager?.name || 'The Manager';
          setArgumentResult({ ...chirpResult, homeTeamKey: battingKeystr });
        }
      }
      return state;
    }

    // Has a real argument — continue with full resolution

    // Which team is arguing? The one that got the bad call (batting team)
    const battingKeystr = getBattingTeam(state) === 'home' ? homeTeam : awayTeam;
    const manager = MANAGERS[battingKeystr];
    const umpire = gameUmpire || 'standard';
    const battingScore = state.score[getBattingTeam(state)];
    const fieldingScore = state.score[getBattingTeam(state) === 'home' ? 'away' : 'home'];
    const scoreDiff = fieldingScore - battingScore;

    const result = resolveArgument(
      severity,
      manager?.personality || 5,
      umpire,
      state.inning,
      scoreDiff,
      getBattingTeam(state) === 'home'
    );

    if (!result) return state;

    // Attach manager name
    result.managerName = manager?.name || 'The Manager';

    // Track argument for first_argument achievement
    unlockAchievement('first_argument');

    // If ejected, log it and check achievements
    if (result.ejected && result.whoArgues === 'manager') {
      const cmt = getEjectionCommentary(battingKeystr, result);
      const ejectedTeam = getBattingTeam(state);
      state = {
        ...state,
        log: [...state.log, { type: 'ejection', text: `🟥 ${cmt}` }],
        // Track that this team/manager was ejected (for Earl Weaver Special)
        _managerEjected: true,
        _ejectedTeam: ejectedTeam,
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
      const cmt = getEjectionCommentary(battingKeystr, result);
      state = { ...state, log: [...state.log, { type: 'info', text: `🗣️ ${cmt}` }] };
    }

    // Show the animation
    setArgumentResult({ ...result, homeTeamKey: battingKeystr });

    return state;
  }, [homeTeam, awayTeam, gameUmpire]);

  const isUserBatting = gameState && (
    (gameState.halfInning === 'top' && userTeam === gameState.awayTeam) ||
    (gameState.halfInning === 'bottom' && userTeam === gameState.homeTeam)
  );

  const isUserPitching = gameState && !isUserBatting;

  const handlePitch = useCallback((pitchName) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);

    try {
      // CPU may attempt steal when user is pitching
      let updatedState = gameState;
      const cpuSteal = cpuDecideSteal(gameState);
      if (cpuSteal >= 0) {
        updatedState = { ...gameState, pendingSteal: cpuSteal };
      }

      const cpuSwing = cpuSelectSwing(updatedState);
      const pitchObj = PITCH_TYPES[pitchName] || PITCH_TYPES["Fastball"];
      const resultState = processAtBat(updatedState, pitchObj, SWING_TYPES[cpuSwing]);
      // CPU may make substitutions after the at-bat
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      const withArgs = checkForArgument(afterSubs);
      setGameState(withArgs);
    } finally {
      setProcessing(false);
    }
  }, [gameState, processing, userTeam]);

  const handleSwing = useCallback((swingIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    try {
      const cpuPitch = cpuSelectPitch(gameState);
      const resultState = processAtBat(gameState, PITCH_TYPES[cpuPitch], SWING_TYPES[swingIndex]);
      // CPU may make substitutions after the at-bat
      const afterSubs = cpuDecideSubstitutions(resultState, userTeam);
      const withArgs = checkForArgument(afterSubs);
      setGameState(withArgs);
    } finally {
      setProcessing(false);
    }
  }, [gameState, processing, userTeam]);

  const handleSteal = useCallback((baseIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    const stealState = attemptSteal(gameState, baseIndex);
    // Only process the steal — don't auto-pitch. Batter keeps their turn.
    const withArgs = checkForArgument(stealState);
    setGameState(withArgs);
    setProcessing(false);
  }, [gameState, processing]);

  const handleHitAndRun = useCallback(() => {
    if (!gameState || gameState.gameOver || processing) return;
    const newState = setHitAndRun(gameState, !gameState.hitAndRun);
    setGameState(newState);
  }, [gameState, processing]);

  const handleIntBB = useCallback(() => {
    if (!gameState || gameState.gameOver || processing) return;
    const newState = intentionalWalk(gameState);
    setGameState(newState);
  }, [gameState, processing]);

  const handlePinchHit = useCallback((player) => {
    if (!gameState || gameState.gameOver) return;
    const newState = pinchHit(gameState, player);
    setGameState(newState);
    setShowSubs(false);
  }, [gameState]);

  const handlePinchRun = useCallback((baseIndex, player) => {
    if (!gameState || gameState.gameOver) return;
    const newState = pinchRun(gameState, baseIndex, player);
    setGameState(newState);
    setShowSubs(false);
  }, [gameState]);

  const handleDefensiveSwitch = useCallback((slotIndex, newPos, newPlayer) => {
    if (!gameState || gameState.gameOver) return;
    const newState = defensiveSwitch(gameState, slotIndex, newPos, newPlayer);
    setGameState(newState);
    if (newPlayer) setShowSubs(false);
  }, [gameState]);

  const handlePitchingChange = useCallback((newPitcher) => {
    if (!gameState || gameState.gameOver) return;
    const newState = changePitcher(gameState, newPitcher);
    setGameState(newState);
    setShowSubs(false);
  }, [gameState]);

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
    setArgumentResult(null);
    setGameUmpire(null);
    setInjuryResult(null);
    prevGameOver.current = false;
    prevHalfInning.current = null;
    prevLogLength.current = 0;
    setShowAd(null);
  };

  if (ballparkPhase) {
    return (
      <BallparkSelect
        userTeam={ballparkPhase.home}
        cpuTeam={ballparkPhase.away}
        onConfirm={handleBallparkConfirm}
        onBack={() => setBallparkPhase(null)}
      />
    );
  }

  if (lineupPhase) {
    return (
      <LineupManager
        teamKey={lineupPhase.home}
        teamData={TEAMS[lineupPhase.home]}
        useDH={lineupPhase.useDH}
        parkTeam={lineupPhase.parkTeam}
        onConfirm={handleLineupConfirm}
        onBack={() => { setLineupPhase(null); setBallparkPhase({ home: lineupPhase.home, away: lineupPhase.away }); }}
      />
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
  const pitcherNeedsReplacement = isUserPitching && pitcher && userFieldingLineup && !useDH
    ? !userFieldingLineup.some(p => p.name === pitcher.name)
    : false;
  const situationalBatter = getSituationalBatter(gameState);
  const battingTeamKey = getBattingTeam(gameState) === 'home' ? homeTeam : awayTeam;
  const battingTeamName = TEAMS[battingTeamKey]?.name || '';
  const inningLabel = `${gameState.halfInning === 'top' ? '▲' : '▼'} ${gameState.inning}`;
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  return (
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
                  <AdRead ad={showAd} onDismiss={() => setShowAd(null)} autoDismissMs={10000} />
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
                    <Trophy className="w-8 h-8 text-primary mx-auto" />
                    <div>
                      <h2 className="font-heading text-base font-bold text-foreground">Game Over!</h2>
                      <p className="font-heading text-primary font-bold mt-1">
                        {gameState.score.home > gameState.score.away ? home?.name : away?.name} Win!
                      </p>
                    </div>
                    <Button onClick={handleNewGame} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span className="font-heading">New Game</span>
                    </Button>
                  </div>
                )}

                {/* Newly unlocked achievements */}
                {newAchievements.length > 0 && (
                  <div className="bg-card border border-primary/40 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="font-heading text-xs text-foreground">Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!</span>
                    </div>
                    {newAchievements.map(id => {
                      const ach = ACHIEVEMENTS.find(a => a.id === id);
                      if (!ach) return null;
                      return (
                        <div key={id} className="flex items-center gap-2 text-[11px] text-foreground/80">
                          <span>{ach.icon}</span>
                          <span className="font-heading font-bold">{ach.name}</span>
                          <span className="text-muted-foreground">— {ach.desc}</span>
                        </div>
                      );
                    })}
                  </div>
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
          />
        </div>
      )}

      {/* Fireworks */}
      <Fireworks trigger={hrTrigger} type="hr" />
      <Fireworks trigger={winTrigger} type="win" />

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

      {/* Injury Banner */}
      {injuryResult && (
        <InjuryBanner
          injury={injuryResult}
          onDismiss={() => setInjuryResult(null)}
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
  );
}