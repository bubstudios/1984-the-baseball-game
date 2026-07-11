import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { X } from 'lucide-react';

function lastName(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function RosterTable({ label, players, highlightNames }) {
  if (!players || players.length === 0) return null;
  return (
    <div>
      <div className="text-[9px] font-heading font-bold text-primary mb-1">{label}</div>
      <table className="w-full text-[10px]">
        <tbody>
          {players.map((p, i) => {
            const isHighlighted = highlightNames?.has(p.name);
            return (
              <tr key={i} className={`border-b border-border/20 ${isHighlighted ? 'bg-primary/10' : ''}`}>
                <td className="py-0.5 px-1 text-foreground font-medium">{lastName(p.name)}</td>
                <td className="py-0.5 px-1 text-muted-foreground text-right">{p.assignedPos || p.pos}</td>
                {p.bats && <td className="py-0.5 px-1 text-muted-foreground text-right">{p.bats}</td>}
                {p.throws && <td className="py-0.5 px-1 text-muted-foreground text-right">{p.throws}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TeamRosterView({ teamKey, highlightNames, onClose }) {
  const team = TEAMS[teamKey];
  if (!team) return null;
  const highlightSet = highlightNames ? new Set(highlightNames) : null;

  return (
    <div className="fixed inset-0 z-[60] bg-background flex items-start justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl mt-4">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-foreground">
            {team.city} {team.name} Roster
          </h3>
          {onClose && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="p-4 space-y-3">
          <RosterTable label="LINEUP" players={team.lineup} highlightNames={highlightSet} />
          <RosterTable label="BENCH" players={team.bench} highlightNames={highlightSet} />
          <RosterTable label="ROTATION" players={team.rotation} highlightNames={highlightSet} />
          <RosterTable label="BULLPEN" players={team.bullpen} highlightNames={highlightSet} />
        </div>
      </div>
    </div>
  );
}