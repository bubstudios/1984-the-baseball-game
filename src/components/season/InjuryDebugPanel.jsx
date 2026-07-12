import React from 'react';
import { HeartPulse, CheckCircle2, XCircle } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { getSeverityLabel } from '@/lib/injuryConfig';
import { formatGameDate } from '@/lib/seasonSchedule';
import { computeDaysRemaining } from '@/lib/injuryPersistence';

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

export default function InjuryDebugPanel({ injuries, season }) {
  if (!injuries || injuries.length === 0) {
    return (
      <div className="mb-4 bg-card border border-border rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <HeartPulse className="w-4 h-4 text-red-400" />
          <span className="font-heading text-xs font-bold text-foreground">INJURY DEBUG</span>
        </div>
        <p className="text-[10px] text-muted-foreground">No active injuries.</p>
      </div>
    );
  }

  return (
    <div className="mb-4 bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <HeartPulse className="w-4 h-4 text-red-400" />
        <span className="font-heading text-xs font-bold text-foreground">INJURY DEBUG</span>
        <span className="text-[10px] text-muted-foreground">({injuries.length} active)</span>
      </div>

      <div className="space-y-2">
        {injuries.map((injury, i) => {
          const team = TEAMS[injury.teamKey];
          const rosterHas = team && (
            [...(team.lineup || []), ...(team.bench || []), ...(team.rotation || []), ...(team.bullpen || [])]
              .some(p => p.name === injury.playerName)
          );
          return (
            <div key={i} className="text-[10px] border border-border/50 rounded p-2">
              <div className="flex items-baseline justify-between">
                <span className="font-heading font-bold text-foreground">
                  {injury.playerName}
                </span>
                <span className="text-muted-foreground">
                  {teamAbbr(injury.teamKey)} - {injury.playerPos}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 text-muted-foreground">
                <span>Type: <span className="text-foreground">{injury.injuryType}</span></span>
                <span>Severity: <span className="text-amber-400">{getSeverityLabel(injury.severity)}</span></span>
                <span>Source: <span className="text-foreground">{injury.source}</span></span>
                <span>Started: <span className="text-foreground">{formatGameDate(injury.startedOnDate)}</span></span>
                <span>Return: <span className="text-foreground">{formatGameDate(injury.eligibleReturnDate)}</span></span>
                <span>Days Left: <span className="text-foreground">{computeDaysRemaining(injury.eligibleReturnDate, season?.currentDate)}</span></span>
              </div>
              <div className="flex items-center gap-2 mt-1 pt-1 border-t border-border/30">
                <span className="flex items-center gap-1">
                  {rosterHas ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <XCircle className="w-2.5 h-2.5 text-red-400" />}
                  <span className="text-muted-foreground">On Roster</span>
                </span>
                <span className="flex items-center gap-1">
                  {injury.active ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> : <XCircle className="w-2.5 h-2.5 text-red-400" />}
                  <span className="text-muted-foreground">Active</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}