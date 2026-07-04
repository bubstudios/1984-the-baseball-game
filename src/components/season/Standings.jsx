import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TEAMS } from '@/lib/gameData';
import { deriveStandings } from '@/lib/seasonStore';
import { TrendingUp } from 'lucide-react';

const DIV_LABELS = {
  AL_East: 'AL East',
  AL_West: 'AL West',
  NL_East: 'NL East',
  NL_West: 'NL West',
};

export default function Standings({ seasonId, userTeam }) {
  const [standings, setStandings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!seasonId) return;
    loadStandings();
  }, [seasonId]);

  const loadStandings = async () => {
    setLoading(true);
    try {
      const results = await base44.entities.GameResult.filter({ seasonId }, 'gameDay', 2106);
      setStandings(deriveStandings(results));
    } catch (e) {
      console.error('Failed to load standings:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading standings...</div>;
  }

  if (!standings) return null;

  return (
    <div className="space-y-6">
      {Object.entries(standings).map(([divKey, teams]) => (
        <div key={divKey} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="bg-primary/10 px-4 py-2 border-b border-border">
            <h3 className="font-heading text-sm font-bold text-primary">{DIV_LABELS[divKey] || divKey}</h3>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-2 px-3 font-medium">Team</th>
                <th className="text-center py-2 px-1 font-medium">W</th>
                <th className="text-center py-2 px-1 font-medium">L</th>
                <th className="text-center py-2 px-1 font-medium">PCT</th>
                <th className="text-center py-2 px-1 font-medium">GB</th>
                <th className="text-center py-2 px-1 font-medium hidden sm:table-cell">STRK</th>
                <th className="text-center py-2 px-1 font-medium hidden sm:table-cell">L10</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => {
                const teamData = TEAMS[t.teamKey];
                const isUser = t.teamKey === userTeam;
                return (
                  <tr key={t.teamKey} className={`border-b border-border/30 ${isUser ? 'bg-primary/5' : ''}`}>
                    <td className="py-2 px-3">
                      <span className={`font-heading font-bold ${isUser ? 'text-primary' : 'text-foreground'}`}>
                        {teamData?.city} {teamData?.name}
                      </span>
                    </td>
                    <td className="text-center py-2 px-1 text-foreground font-heading">{t.w}</td>
                    <td className="text-center py-2 px-1 text-foreground font-heading">{t.l}</td>
                    <td className="text-center py-2 px-1 text-muted-foreground font-heading">{t.pct.toFixed(3)}</td>
                    <td className="text-center py-2 px-1 text-muted-foreground font-heading">
                      {t.gb === 0 ? '-' : t.gb.toFixed(1)}
                    </td>
                    <td className="text-center py-2 px-1 hidden sm:table-cell">
                      <span className={t.streakType === 'W' ? 'text-emerald-400' : 'text-red-400'}>
                        {t.streakType === 'W' ? 'W' : 'L'}{t.streakLen}
                      </span>
                    </td>
                    <td className="text-center py-2 px-1 hidden sm:table-cell text-muted-foreground font-heading">
                      {t.last10Wins}-{10 - t.last10Wins}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}