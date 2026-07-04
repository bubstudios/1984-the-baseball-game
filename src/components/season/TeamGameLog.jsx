import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TEAMS } from '@/lib/gameData';
import { buildTeamGameLog } from '@/lib/seasonStore';
import { ChevronRight } from 'lucide-react';
import ArchivedBoxScore from '@/components/season/ArchivedBoxScore';

export default function TeamGameLog({ seasonId, userTeam }) {
  const [selectedTeam, setSelectedTeam] = useState(userTeam);
  const [gameLog, setGameLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    setSelectedTeam(userTeam);
  }, [userTeam]);

  useEffect(() => {
    if (!seasonId || !selectedTeam) return;
    loadLog();
  }, [seasonId, selectedTeam]);

  const loadLog = async () => {
    setLoading(true);
    try {
      const results = await base44.entities.GameResult.filter({ seasonId }, 'gameDay', 2106);
      setGameLog(buildTeamGameLog(results, selectedTeam));
    } catch (e) {
      console.error('Failed to load game log:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading game log...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Team selector */}
      <select
        value={selectedTeam}
        onChange={(e) => setSelectedTeam(e.target.value)}
        className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {Object.entries(TEAMS).map(([key, t]) => (
          <option key={key} value={key}>{t.city} {t.name}{key === userTeam ? ' (You)' : ''}</option>
        ))}
      </select>

      {gameLog.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p className="font-heading">No games played yet</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-2 font-medium">Day</th>
                <th className="text-left py-2 px-2 font-medium">Opp</th>
                <th className="text-center py-2 px-2 font-medium">Result</th>
                <th className="text-center py-2 px-2 font-medium hidden sm:table-cell">Record</th>
                <th className="text-center py-2 px-2 font-medium hidden sm:table-cell">Starter</th>
                <th className="text-right py-2 px-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {gameLog.map((g, i) => {
                const oppData = TEAMS[g.opponent];
                return (
                  <tr
                    key={i}
                    onClick={() => g.boxScore && setSelectedGame({ ...g, boxScore: g.boxScore, homeTeam: g.isHome ? selectedTeam : g.opponent, awayTeam: g.isHome ? g.opponent : selectedTeam, homeScore: g.isHome ? parseInt(g.score.split('-')[0]) : parseInt(g.score.split('-')[1]), awayScore: g.isHome ? parseInt(g.score.split('-')[1]) : parseInt(g.score.split('-')[0]) })}
                    className={`border-b border-border/30 hover:bg-muted/30 cursor-pointer ${g.boxScore ? '' : 'opacity-60'}`}
                  >
                    <td className="py-2 px-2 text-muted-foreground">{g.gameDay}</td>
                    <td className="py-2 px-2 text-foreground">
                      {g.isHome ? 'vs ' : '@ '}{oppData?.abbr || g.opponent}
                    </td>
                    <td className="text-center py-2 px-2">
                      <span className={`font-heading font-bold ${g.result === 'W' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {g.result} {g.score}
                      </span>
                    </td>
                    <td className="text-center py-2 px-2 text-muted-foreground font-heading hidden sm:table-cell">{g.recordAfter}</td>
                    <td className="text-center py-2 px-2 text-muted-foreground hidden sm:table-cell">{g.starter || '-'}</td>
                    <td className="text-right py-2 px-2">
                      {g.boxScore && <ChevronRight className="w-3 h-3 text-muted-foreground inline" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedGame && (
        <ArchivedBoxScore
          gameResult={selectedGame}
          onClose={() => setSelectedGame(null)}
        />
      )}
    </div>
  );
}