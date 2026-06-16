import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { ScrollArea } from '@/components/ui/scroll-area';

function TeamBox({ team, lineup, pitcher, label }) {
  return (
    <div className="space-y-2">
      <h3 className="font-heading font-bold text-sm text-foreground">{label} — {team.name}</h3>

      {/* Batters */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-body">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-1 px-1.5 font-medium">Player</th>
              <th className="text-center py-1 px-1 font-medium">POS</th>
              <th className="text-center py-1 px-1 font-medium">AB</th>
              <th className="text-center py-1 px-1 font-medium">H</th>
              <th className="text-center py-1 px-1 font-medium">R</th>
              <th className="text-center py-1 px-1 font-medium">RBI</th>
              <th className="text-center py-1 px-1 font-medium">BB</th>
              <th className="text-center py-1 px-1 font-medium">SO</th>
              <th className="text-center py-1 px-1 font-medium">HR</th>
              <th className="text-center py-1 px-1 font-medium">SB</th>
              <th className="text-center py-1 px-1 font-medium">CS</th>
            </tr>
          </thead>
          <tbody>
            {lineup.map((p, i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="py-1 px-1.5 text-foreground font-medium truncate max-w-[120px]">{p.name}</td>
                <td className="text-center py-1 px-1 text-muted-foreground">{p.assignedPos || p.pos}</td>
                <td className="text-center py-1 px-1">{p.gameStats.ab}</td>
                <td className="text-center py-1 px-1">{p.gameStats.hits}</td>
                <td className="text-center py-1 px-1">{p.gameStats.runs}</td>
                <td className="text-center py-1 px-1">{p.gameStats.rbi}</td>
                <td className="text-center py-1 px-1">{p.gameStats.bb}</td>
                <td className="text-center py-1 px-1">{p.gameStats.so}</td>
                <td className="text-center py-1 px-1 text-primary font-semibold">{p.gameStats.hr || '-'}</td>
                <td className="text-center py-1 px-1">{p.gameStats.sb || '-'}</td>
                <td className="text-center py-1 px-1">{p.gameStats.cs || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pitcher */}
      <div className="mt-2">
        <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Pitcher</div>
        <div className="flex items-center gap-3 text-[11px] font-body">
          <span className="text-foreground font-medium">{pitcher.name}</span>
          <span className="text-muted-foreground">{pitcher.gameStats.pitches} P</span>
          <span className="text-muted-foreground">{pitcher.gameStats.so} K</span>
          <span className="text-muted-foreground">{pitcher.gameStats.bb} BB</span>
          <span className="text-muted-foreground">{pitcher.gameStats.h} H</span>
          <span className="text-muted-foreground">{pitcher.gameStats.r} R</span>
        </div>
      </div>
    </div>
  );
}

export default function BoxScore({ state }) {
  const away = TEAMS[state.awayTeam];
  const home = TEAMS[state.homeTeam];

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-6 p-1">
        <TeamBox team={away} lineup={state.awayLineup} pitcher={state.awayPitcher} label="Away" />
        <TeamBox team={home} lineup={state.homeLineup} pitcher={state.homePitcher} label="Home" />
      </div>
    </ScrollArea>
  );
}