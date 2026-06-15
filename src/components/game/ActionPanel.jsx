import React from 'react';
import { Button } from '@/components/ui/button';
import { PITCH_TYPES, SWING_TYPES } from '@/lib/gameData';

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
              <span className="text-base">{pitch.icon}</span>
              <span className="text-[10px] font-heading font-semibold">{pitch.name}</span>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2">At Bat — Choose Action</div>
      <div className="grid grid-cols-3 gap-2">
        {SWING_TYPES.slice(0, 3).map((swing, i) => (
          <Button
            key={i}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSwing(i)}
            className="h-14 flex flex-col items-center justify-center gap-0.5 border-border/60 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <span className="text-base">{swing.icon}</span>
            <span className="text-[10px] font-heading font-semibold">{swing.name}</span>
          </Button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {SWING_TYPES.slice(3).map((swing, i) => (
          <Button
            key={i + 3}
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSwing(i + 3)}
            className="h-12 flex flex-col items-center justify-center gap-0.5 border-border/60 hover:border-primary hover:bg-primary/10 transition-all"
          >
            <span className="text-base">{swing.icon}</span>
            <span className="text-[10px] font-heading font-semibold">{swing.name}</span>
            <span className="text-[8px] text-muted-foreground">{swing.desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}