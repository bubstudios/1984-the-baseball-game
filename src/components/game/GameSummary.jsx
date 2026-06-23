import React, { useMemo } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

export default function GameSummary({ gameState, homeTeam, awayTeam, userTeam, onClose }) {
  const userSide = userTeam === homeTeam ? 'home' : 'away';
  const opponentSide = userSide === 'home' ? 'away' : 'home';

  // Extract critical plays from log
  const criticalPlays = useMemo(() => {
    const plays = [];
    const homeRuns = [];
    const keyHits = [];
    const defensivePlays = [];

    gameState.log.forEach(entry => {
      if (!entry.text) return;
      const text = entry.text;

      if (text.includes('HOME RUN') || text.includes('HOMERUN')) {
        homeRuns.push(text);
      } else if (text.includes('double') || text.includes('triple') || text.includes('BASE HIT')) {
        keyHits.push(text);
      } else if (text.includes('double play') || text.includes('flying out') || text.includes('strikeout')) {
        defensivePlays.push(text);
      }
    });

    // Top 3 of each category
    plays.push(...homeRuns.slice(0, 3));
    plays.push(...keyHits.slice(0, 2));
    plays.push(...defensivePlays.slice(0, 2));

    return plays.slice(0, 6);
  }, [gameState]);

  // Calculate MVP: player with most hits + runs + RBIs
  const userLineup = userSide === 'home' ? gameState.homeLineup : gameState.awayLineup;
  const allPlayers = [...userLineup, ...(userSide === 'home' ? (gameState.homePlayerHistory || []) : (gameState.awayPlayerHistory || []))];
  const mvp = useMemo(() => {
    let topPlayer = null;
    let topScore = -1;

    allPlayers.forEach(p => {
      const stats = p.gameStats || {};
      const score = (stats.hits || 0) * 3 + (stats.runs || 0) * 2 + (stats.rbi || 0) * 2;
      if (score > topScore) {
        topScore = score;
        topPlayer = p;
      }
    });

    return topPlayer;
  }, [allPlayers]);

  // Get hitting leaders
  const hittingLeaders = useMemo(() => {
    return allPlayers
      .map(p => ({
        name: p.name,
        hits: (p.gameStats?.hits || 0),
        runs: (p.gameStats?.runs || 0),
        rbi: (p.gameStats?.rbi || 0),
      }))
      .filter(p => p.hits > 0 || p.runs > 0 || p.rbi > 0)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 3);
  }, [allPlayers]);

  const userWon = gameState.score[userSide] > gameState.score[opponentSide];
  const winnerName = userWon ? TEAMS[userTeam]?.name : TEAMS[userTeam === homeTeam ? awayTeam : homeTeam]?.name;
  const finalScore = `${gameState.score.home} - ${gameState.score.away}`;

  if (!gameState || !gameState.gameOver) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-card to-card/80 border-2 border-primary/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6 text-center border-b border-primary/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="font-heading text-2xl font-bold text-primary">Game Summary</h2>
          </div>
          <p className="text-sm text-muted-foreground">Final Score</p>
        </div>

        {/* Final Score */}
        <div className="p-6 text-center space-y-4 border-b border-border">
          <div className="space-y-1">
            <h3 className="font-heading text-xl font-bold text-foreground">{winnerName} Win!</h3>
            <p className="font-heading text-3xl font-bold text-primary">{finalScore}</p>
          </div>
          {userWon && (
            <p className="text-sm text-secondary animate-pulse">🎉 Congratulations! Your team won!</p>
          )}
        </div>

        {/* MVP */}
        {mvp && (
          <div className="p-6 border-b border-border">
            <h3 className="font-heading text-sm font-bold text-primary mb-3 uppercase tracking-wider">⭐ MVP</h3>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="font-heading text-lg font-bold text-foreground">{mvp.name.split(' ').pop()}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-primary font-bold">{mvp.gameStats?.hits || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Hits</p>
                </div>
                <div>
                  <p className="text-primary font-bold">{mvp.gameStats?.runs || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Runs</p>
                </div>
                <div>
                  <p className="text-primary font-bold">{mvp.gameStats?.rbi || 0}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">RBI</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Moments */}
        {criticalPlays.length > 0 && (
          <div className="p-6 border-b border-border">
            <h3 className="font-heading text-sm font-bold text-primary mb-3 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Key Moments
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {criticalPlays.map((play, i) => (
                <div key={i} className="text-xs text-foreground/80 bg-muted/30 rounded p-2 leading-relaxed">
                  {play}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hitting Leaders */}
        {hittingLeaders.length > 0 && (
          <div className="p-6 border-b border-border">
            <h3 className="font-heading text-sm font-bold text-primary mb-3 uppercase tracking-wider">Hitting Leaders</h3>
            <div className="space-y-2">
              {hittingLeaders.map((player, i) => (
                <div key={i} className="flex justify-between items-center text-sm bg-muted/30 rounded p-2">
                  <span className="font-heading font-semibold text-foreground">{player.name.split(' ').pop()}</span>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{player.hits} H</span>
                    <span>{player.runs} R</span>
                    <span>{player.rbi} RBI</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="p-4 text-center border-t border-border">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-heading px-6 py-2 rounded-lg transition-colors"
          >
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}