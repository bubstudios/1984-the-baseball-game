import React from 'react';
import { TEAMS } from '@/lib/gameData';

export default function PregameIllnessModal({ illnesses, homeTeamKey, awayTeamKey, onClose }) {
  if (!illnesses) return null;

  const homeTeam = TEAMS[homeTeamKey];
  const awayTeam = TEAMS[awayTeamKey];

  const allIll = [
    ...illnesses.home.map(p => ({ ...p, team: homeTeam?.name || homeTeamKey, teamEmoji: homeTeam?.emoji || '⚾' })),
    ...illnesses.away.map(p => ({ ...p, team: awayTeam?.name || awayTeamKey, teamEmoji: awayTeam?.emoji || '⚾' })),
  ];

  if (allIll.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-amber-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🤒</span>
          <h2 className="font-heading text-lg font-bold text-amber-400">Pre-Game Scratches</h2>
        </div>

        <p className="text-sm text-foreground/80 mb-4 text-center font-body">
          The following players are unavailable for today's game:
        </p>

        {/* Ill players list */}
        <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
          {allIll.map((p, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <div className="font-heading text-sm font-bold text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.team}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-heading text-amber-400">{p.illness}</div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-heading rounded-lg transition-colors"
        >
          Adjust Lineup
        </button>
      </div>
    </div>
  );
}