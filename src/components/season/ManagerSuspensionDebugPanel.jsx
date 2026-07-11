import React from 'react';
import { ShieldAlert, Gavel, UserCheck } from 'lucide-react';
import { TEAMS, MANAGERS } from '@/lib/gameData';

export default function ManagerSuspensionDebugPanel({ suspensions, season }) {
  if (!suspensions || suspensions.length === 0) {
    return (
      <div className="mb-3 bg-card border border-border rounded-lg p-3 text-[10px] text-muted-foreground font-mono">
        <div className="flex items-center gap-1 mb-1">
          <ShieldAlert className="w-3 h-3 text-muted-foreground/50" />
          <span className="font-bold">Manager Discipline Audit</span>
        </div>
        <p>No active suspensions.</p>
      </div>
    );
  }

  return (
    <div className="mb-3 bg-card border border-border rounded-lg p-3 text-[10px] font-mono space-y-2">
      <div className="flex items-center gap-1 mb-1">
        <ShieldAlert className="w-3 h-3 text-amber-400" />
        <span className="font-bold text-amber-400">Manager Discipline Audit</span>
      </div>
      {suspensions.map((s, i) => {
        const team = TEAMS[s.teamKey];
        const mgr = MANAGERS[s.teamKey];
        return (
          <div key={i} className="border border-border/50 rounded p-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-bold">
                {team?.city} {team?.name}
              </span>
              <span className={s.active ? 'text-red-400' : 'text-emerald-400'}>
                {s.active ? 'SUSPENDED' : 'RESOLVED'}
              </span>
            </div>
            <div className="text-muted-foreground">
              Manager: {s.managerName || mgr?.name} | Acting: {mgr?.coach}
            </div>
            <div className="text-muted-foreground">
              Games: {s.suspensionGames} | Remaining: {s.gamesRemaining}
            </div>
            <div className="text-muted-foreground">
              Reason: {s.suspensionReason || 'N/A'}
            </div>
            <div className="text-muted-foreground">
              Severity: L{s.ejectionSeverity} | Started: Day {s.startedOnGameDay}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Gavel className="w-2.5 h-2.5 text-muted-foreground/50" />
              <span className="text-muted-foreground/70">Ejection: {s.ejectionReason || 'N/A'}</span>
            </div>
            {s.active && (
              <div className="flex items-center gap-1 text-emerald-400/70">
                <UserCheck className="w-2.5 h-2.5" />
                <span>Acting manager active - no arguments/ejections</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}