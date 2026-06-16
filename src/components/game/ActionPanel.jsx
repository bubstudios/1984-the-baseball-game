import React from 'react';
import { Button } from '@/components/ui/button';
import { PITCH_TYPES } from '@/lib/gameData';

const BAT_ACTIONS = [
  { label: 'Swing', swingIndex: 0, color: 'primary', desc: 'Standard swing' },
  { label: 'Power', swingIndex: 2, color: 'amber', desc: 'Swing for the fences' },
  { label: 'Bunt', swingIndex: 4, color: 'emerald', desc: 'Lay one down' },
];

export default function ActionPanel({ isPitching, onPitch, onSwing, disabled }) {
  if (isPitching) {
    return (
      <div className="space-y-2">
        <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2">Select Pitch</div>
        <div className="grid grid-cols-2 gap-2">
          {PITCH_TYPES.map((pitch, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onPitch(i)}
              className="h-12 flex flex-col items-center justify-center gap-0.5 border-border/60 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <span className="font-heading font-bold text-sm text-foreground">{pitch.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2">At Bat — Choose Swing</div>
      <div className="grid grid-cols-3 gap-2">
        {BAT_ACTIONS.map((action, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSwing(action.swingIndex)}
            className="h-16 flex flex-col items-center justify-center gap-1 border-border/60 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <span className="font-heading font-bold text-base text-foreground">{action.label}</span>
            <span className="text-[9px] text-muted-foreground/60">{action.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}