import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TEAMS, PITCH_TYPES, SWING_TYPES } from '@/lib/gameData';
import { createGameState, processAtBat, cpuSelectPitch, cpuSelectSwing, getCurrentBatter, getCurrentPitcher, getBattingTeam } from '@/lib/gameEngine';
import TeamSelect from '@/components/game/TeamSelect';
import DiamondView from '@/components/game/DiamondView';
import Scoreboard from '@/components/game/Scoreboard';
import CountDisplay from '@/components/game/CountDisplay';
import MatchupCard from '@/components/game/MatchupCard';
import ActionPanel from '@/components/game/ActionPanel';
import PlayLog from '@/components/game/PlayLog';
import BoxScore from '@/components/game/BoxScore';
import { RotateCcw, Trophy } from 'lucide-react';

export default function Home() {
  const [gameState, setGameState] = useState(null);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [tab, setTab] = useState('game');

  const startGame = useCallback((home, away) => {
    setHomeTeam(home);
    setAwayTeam(away);
    setUserTeam(home); // user controls home team
    const state = createGameState(home, away);
    const homeName = TEAMS[home].name;
    const awayName = TEAMS[away].name;
    state.log.push({ type: 'info', text: `⚾ Play ball! ${awayName} at ${homeName}` });
    state.log.push({ type: 'info', text: `Top of inning 1 — ${awayName} batting` });
    setGameState(state);
  }, []);

  const isUserBatting = gameState && (
    (gameState.halfInning === 'top' && userTeam === gameState.awayTeam) ||
    (gameState.halfInning === 'bottom' && userTeam === gameState.homeTeam)
  );

  const isUserPitching = gameState && !isUserBatting;

  const handlePitch = useCallback((pitchIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    const cpuSwing = cpuSelectSwing(gameState);
    const newState = processAtBat(gameState, PITCH_TYPES[pitchIndex], SWING_TYPES[cpuSwing]);
    setGameState(newState);
    setProcessing(false);
  }, [gameState, processing]);

  const handleSwing = useCallback((swingIndex) => {
    if (!gameState || gameState.gameOver || processing) return;
    setProcessing(true);
    const cpuPitch = cpuSelectPitch(gameState);
    const newState = processAtBat(gameState, PITCH_TYPES[cpuPitch], SWING_TYPES[swingIndex]);
    setGameState(newState);
    setProcessing(false);
  }, [gameState, processing]);

  const handleNewGame = () => {
    setGameState(null);
    setHomeTeam(null);
    setAwayTeam(null);
    setUserTeam(null);
    setTab('game');
  };

  if (!gameState) {
    return <TeamSelect onSelect={startGame} />;
  }

  const batter = getCurrentBatter(gameState);
  const pitcher = getCurrentPitcher(gameState);
  const battingTeamKey = getBattingTeam(gameState) === 'home' ? homeTeam : awayTeam;
  const battingTeamName = TEAMS[battingTeamKey]?.name || '';
  const inningLabel = `${gameState.halfInning === 'top' ? '▲' : '▼'} ${gameState.inning}`;
  const home = TEAMS[homeTeam];
  const away = TEAMS[awayTeam];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚾</span>
            <div>
              <div className="font-display text-[10px] text-primary tracking-wider">1984 BASEBALL SIM</div>
              <div className="font-heading text-xs text-muted-foreground">{inningLabel} · {battingTeamName} batting</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
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
      <div className="max-w-2xl mx-auto px-4 py-4">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="game" className="font-heading text-xs">Game</TabsTrigger>
            <TabsTrigger value="log" className="font-heading text-xs">Play Log</TabsTrigger>
            <TabsTrigger value="box" className="font-heading text-xs">Box Score</TabsTrigger>
          </TabsList>

          <TabsContent value="game" className="space-y-4">
            {/* Scoreboard */}
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

            {/* Diamond + Count */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-3 flex flex-col items-center justify-center">
                <DiamondView bases={gameState.bases} lastPlay={gameState.lastPlay} />
              </div>
              <div className="bg-card border border-border rounded-xl p-3 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2">Count</div>
                  <CountDisplay balls={gameState.balls} strikes={gameState.strikes} outs={gameState.outs} />
                </div>
                <div className="mt-3">
                  <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-1.5">Last Play</div>
                  {gameState.lastPlay ? (
                    <p className="text-xs font-body text-foreground/80 leading-relaxed">{gameState.lastPlay.text}</p>
                  ) : (
                    <p className="text-xs font-body text-muted-foreground/50 italic">Waiting for first pitch...</p>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-heading">YOU:</span>
                    <span className="text-[10px] text-primary font-heading font-semibold">
                      {isUserBatting ? '🏏 Batting' : '⚾ Pitching'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matchup */}
            <div className="bg-card border border-border rounded-xl p-3">
              <MatchupCard
                batter={batter}
                pitcher={pitcher}
                halfInning={gameState.halfInning}
                homeTeam={homeTeam}
                awayTeam={awayTeam}
              />
            </div>

            {/* Actions or Game Over */}
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
              <div className="bg-card border border-border rounded-xl p-3">
                <ActionPanel
                  isPitching={isUserPitching}
                  onPitch={handlePitch}
                  onSwing={handleSwing}
                  disabled={processing}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="log">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Play-by-Play</h3>
              <PlayLog log={gameState.log} />
            </div>
          </TabsContent>

          <TabsContent value="box">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-heading text-sm font-bold text-foreground mb-3">Box Score</h3>
              <BoxScore state={gameState} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t border-border mt-8">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground/40 font-body">1984 Baseball Simulation</span>
          <Button variant="ghost" size="sm" onClick={handleNewGame} className="text-[10px] text-muted-foreground hover:text-foreground gap-1">
            <RotateCcw className="w-3 h-3" />
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
}