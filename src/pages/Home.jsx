import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEAMS, PITCH_TYPES, SWING_TYPES } from '@/lib/gameData';
import { createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing, getCurrentBatter, getCurrentPitcher, getBattingTeam, getSituationalBatter, attemptSteal, setHitAndRun, cpuDecideSteal, cpuDecideSubstitutions, hasRunnersOnBase, pinchHit, pinchRun, defensiveSwitch, changePitcher, intentionalWalk } from '@/lib/gameEngine';
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
import useRobotAnnouncer from '@/hooks/useRobotAnnouncer';
import TutorialModal, { hasSeenTutorial } from '@/components/game/TutorialModal';
import RetroLoading from '@/components/game/RetroLoading';
import useRetroAudio from '@/hooks/useRetroAudio';
import { RotateCcw, Trophy, Users, Volume2, VolumeX, HelpCircle, Radio } from 'lucide-react';

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
  const prevLastPlay = useRef(null);

  // Auto-show tutorial on first visit
  useEffect(() => {
    if (!hasSeenTutorial()) {
      setShowTutorial(true);
    }
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
      if (lastPlay.type === 'homerun' && battingTeam === 'home') {
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
  }, [gameState]);

  const isUserBatting = gameState && (
    (gameState.halfInning === 'top' && userTeam === gameState.awayTeam) ||
    (gameState.halfInning === 'bottom' && userTeam === gameState.homeTeam)
  );

  const isUserPitching = gameState && !isUserBatting;

  const handlePitch = useCallback((pitchName) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);

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
    const afterSubs = cpuDecideSubstitutions(resultState);
    setGameState(afterSubs);
    setProcessing(false);
  }, [gameState, processing]);

  const handleSwing = useCallback((swingIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    const cpuPitch = cpuSelectPitch(gameState);
    const resultState = processAtBat(gameState, PITCH_TYPES[cpuPitch], SWING_TYPES[swingIndex]);
    // CPU may make substitutions after the at-bat
    const afterSubs = cpuDecideSubstitutions(resultState);
    setGameState(afterSubs);
    setProcessing(false);
  }, [gameState, processing]);

  const handleSteal = useCallback((baseIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    const stealState = attemptSteal(gameState, baseIndex);
    // Only process the steal — don't auto-pitch. Batter keeps their turn.
    setGameState(stealState);
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
            onClick={() => setRetroAudio(!retroAudio)}
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
  const pitcher = getCurrentPitcher(gameState);

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚾</span>
            <div>
              <div className="font-display text-[10px] text-primary tracking-wider">1984: THE BASEBALL SEASON</div>
              <div className="font-heading text-xs text-muted-foreground">
                                {inningLabel} · {battingTeamName} batting
                                {gameStadium && <span className="mx-1.5 text-primary/50">|</span>}
                                {gameStadium && <span className="text-primary/60">{gameStadium}</span>}
                                {useDH !== null && <span className="text-[9px] text-muted-foreground/50 ml-1">({useDH ? 'DH' : 'No DH'})</span>}
                              </div>
                              {gameWeather && (
                                <div className="font-heading text-[10px] text-muted-foreground/70 mt-0.5">
                                  {gameWeather.date} · {gameWeather.temperature}°F · {gameWeather.condition === 'clear' ? 'Clear' : gameWeather.condition === 'overcast' ? 'Overcast' : gameWeather.condition === 'rain' ? 'Rain' : 'Snow'}
                                  {gameWeather.windSpeed !== 'calm' && gameWeather.windLabel && <> · {gameWeather.windLabel}</>}
                                  {gameWeather.isDay ? ' · Day' : ' · Night'}
                                </div>
                              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRetroAudio(!retroAudio)}
              className={`h-7 px-2 text-[10px] font-heading gap-1 ${retroAudio ? 'border-primary/50 text-primary' : ''}`}
              title={retroAudio ? 'Retro audio on' : 'Retro audio off'}
            >
              <Radio className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRobotVoice(!robotVoice)}
              className={`h-7 px-2 text-[10px] font-heading gap-1 ${robotVoice ? 'border-primary/50 text-primary' : ''}`}
              title={robotVoice ? 'Mute announcer' : 'Robot announcer'}
            >
              {robotVoice ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </Button>
            {!gameState.gameOver && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSubsTab('pinchhit'); setShowSubs(true); }}
                className="h-7 px-2 text-[10px] font-heading gap-1"
              >
                <Users className="w-3 h-3" />
                Subs
              </Button>
            )}
            <div className="text-center">
              <div className="font-heading text-2xl font-bold text-foreground">
                {gameState.score.away}
                <span className="text-muted-foreground mx-2 text-sm">-</span>
                {gameState.score.home}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-heading text-muted-foreground">
                <span>{away?.abbr}</span>
                <span>·</span>
                <span>{home?.abbr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3 mb-4">
            <TabsTrigger value="game" className="font-heading text-xs">Game</TabsTrigger>
            <TabsTrigger value="log" className="font-heading text-xs">Play Log</TabsTrigger>
            <TabsTrigger value="box" className="font-heading text-xs">Box Score</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Scoreboard + Diamond */}
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-xl p-3">
                  <Scoreboard
                    innings={gameState.innings}
                    score={gameState.score}
                    currentInning={gameState.inning}
                    halfInning={gameState.halfInning}
                    awayAbbr={away?.abbr}
                    homeAbbr={home?.abbr}
                  />
                </div>

                <div className="bg-card/50 border border-border rounded-xl p-4 flex flex-col items-center justify-center">
                  <DiamondView
                    bases={gameState.bases}
                    lastPlay={gameState.lastPlay}
                    isDay={gameWeather?.isDay}
                  />
                </div>
              </div>

              {/* Right Column: Commentary, Matchup, Actions */}
              <div className="space-y-4">
                <CommentaryBanner batter={situationalBatter} pitcher={pitcher} gameState={gameState} lastPlay={gameState.lastPlay} stadium={gameStadium} homeTeamKey={homeTeam} />

                <div className="bg-card border border-border rounded-xl p-3">
                  <MatchupCard
                    batter={batter}
                    adjustedBatter={situationalBatter}
                    pitcher={pitcher}
                    halfInning={gameState.halfInning}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                  />
                </div>

                {gameState.gameOver ? (
                  <div className="bg-card border border-primary/30 rounded-xl p-6 text-center space-y-4">
                    <Trophy className="w-10 h-10 text-primary mx-auto" />
                    <div>
                      <h2 className="font-heading text-lg font-bold text-foreground">Game Over!</h2>
                      <p className="font-body text-sm text-muted-foreground mt-1">
                        Final: {away?.name} {gameState.score.away} — {home?.name} {gameState.score.home}
                      </p>
                      <p className="font-heading text-primary font-bold mt-2">
                        {gameState.score.home > gameState.score.away ? home?.name : away?.name} Win!
                      </p>
                    </div>
                    <Button onClick={handleNewGame} className="gap-2">
                      <RotateCcw className="w-4 h-4" />
                      <span className="font-heading">New Game</span>
                    </Button>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-xl p-3 space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[10px] text-muted-foreground font-heading uppercase tracking-wider">YOU:</span>
                      <span className="text-[11px] text-primary font-heading font-bold">
                        {isUserBatting ? '🏏 Batting' : '⚾ Pitching'}
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
          </TabsContent>

          <TabsContent value="log">
            <div className="bg-card border border-border rounded-xl p-4 max-w-2xl mx-auto">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Play-by-Play</h3>
              <PlayLog log={gameState.log} />
            </div>
          </TabsContent>

          <TabsContent value="box">
            <div className="bg-card border border-border rounded-xl p-4 max-w-2xl mx-auto">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Box Score</h3>
              <BoxScore state={gameState} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-8">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/40 font-body">1984: The Baseball Season</span>
          <Button variant="ghost" size="sm" onClick={handleNewGame} className="text-[10px] text-muted-foreground hover:text-foreground gap-1">
            <RotateCcw className="w-3 h-3" />
            New Game
          </Button>
        </div>
      </div>

      {/* Fireworks */}
      <Fireworks trigger={hrTrigger} type="hr" />
      <Fireworks trigger={winTrigger} type="win" />

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