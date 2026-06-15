import React from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';

export default function TeamSelect({ onSelect }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-3">
          <div className="text-4xl">⚾</div>
          <h1 className="font-display text-lg text-primary tracking-wide leading-relaxed">
            BASEBALL<br />SIMULATION
          </h1>
          <p className="font-body text-sm text-muted-foreground max-w-xs mx-auto">
            A classic baseball sim inspired by the golden era of computer baseball games
          </p>
        </div>

        {/* Team selection */}
        <div className="space-y-4">
          <h2 className="font-heading text-sm uppercase tracking-widest text-muted-foreground">Choose Your Team</h2>

          <div className="grid grid-cols-2 gap-4">
            {['home', 'away'].map((side) => {
              const team = TEAMS[side];
              return (
                <button
                  key={side}
                  onClick={() => onSelect(side)}
                  className="group relative bg-card border border-border rounded-xl p-5 hover:border-primary/60 transition-all hover:bg-muted/30 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center text-xl font-heading font-bold text-white" style={{ backgroundColor: team.color }}>
                      {team.abbr[0]}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-foreground">{team.name}</div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{team.abbr}</div>
                    </div>
                    <div className="space-y-1">
                      {team.players.slice(0, 4).map((p, i) => (
                        <div key={i} className="text-[10px] text-muted-foreground font-body">
                          {p.name} <span className="text-primary/70">.{(p.avg * 1000).toFixed(0)}</span>
                        </div>
                      ))}
                      <div className="text-[10px] text-muted-foreground/50 font-body">+ {team.players.length - 4} more</div>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-body">
                      SP: {team.pitchers[0].name}
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground/40 font-body">
          You'll control batting and pitching for your team. The CPU manages the opponent.
        </p>
      </div>
    </div>
  );
}