import React from 'react';
import { TEAMS } from '@/lib/gameData';

export default function MatchupCard({ batter, pitcher, halfInning }) {
  const battingTeam = halfInning === 'top' ? TEAMS.away : TEAMS.home;
  const pitchingTeam = halfInning === 'top' ? TEAMS.home : TEAMS.away;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Batter */}
      <div className="flex-1 bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-heading uppercase tracking-wider text-primary font-semibold">At Bat</span>
          <span className="text-[10px] text-muted-foreground">{battingTeam.abbr}</span>
        </div>
        <div className="font-heading font-bold text-sm text-foreground truncate">{batter.name}</div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] text-muted-foreground">{batter.pos}</span>
          <span className="text-[10px] text-primary font-semibold">.{(batter.avg * 1000).toFixed(0).padStart(3, '0')}</span>
          <span className="text-[10px] text-muted-foreground">PWR {batter.power}</span>
          <span className="text-[10px] text-muted-foreground">SPD {batter.speed}</span>
        </div>
        {batter.gameStats && (
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground/70">
            <span>{batter.gameStats.hits}-{batter.gameStats.ab}</span>
            {batter.gameStats.hr > 0 && <span className="text-primary">{batter.gameStats.hr} HR</span>}
            {batter.gameStats.rbi > 0 && <span>{batter.gameStats.rbi} RBI</span>}
          </div>
        )}
      </div>

      {/* VS */}
      <div className="text-[10px] text-muted-foreground font-display">VS</div>

      {/* Pitcher */}
      <div className="flex-1 bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-heading uppercase tracking-wider text-secondary font-semibold">Pitching</span>
          <span className="text-[10px] text-muted-foreground">{pitchingTeam.abbr}</span>
        </div>
        <div className="font-heading font-bold text-sm text-foreground truncate">{pitcher.name}</div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] text-muted-foreground">{pitcher.pos}</span>
          <span className="text-[10px] text-secondary font-semibold">{pitcher.era.toFixed(2)} ERA</span>
          <span className="text-[10px] text-muted-foreground">VEL {pitcher.velocity}</span>
          <span className="text-[10px] text-muted-foreground">CTL {pitcher.control}</span>
        </div>
        {pitcher.gameStats && (
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground/70">
            <span>{pitcher.gameStats.pitches} P</span>
            <span>{pitcher.gameStats.so} K</span>
            <span>{pitcher.gameStats.bb} BB</span>
          </div>
        )}
      </div>
    </div>
  );
}