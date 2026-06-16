import React from 'react';
import { Button } from '@/components/ui/button';
import { PITCH_TYPES } from '@/lib/gameData';

const BAT_ACTIONS = [
  { label: 'Swing', swingIndex: 0, desc: 'Standard swing' },
  { label: 'Power', swingIndex: 2, desc: 'Swing for the fences' },
  { label: 'Bunt', swingIndex: 4, desc: 'Lay one down' },
];

const BASE_NAMES = ['1st', '2nd', '3rd'];

export default function ActionPanel({
  isPitching,
  onPitch,
  onSwing,
  onSteal,
  onHitAndRun,
  disabled,
  bases,
  hitAndRun,
}) {
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

  const runnersOn = bases && bases.some(b => b !== null);

  return (
    <div className="space-y-2.5">
      {/* Steal buttons */}
      {runnersOn && (
        <div className="space-y-1.5">
          <div className="text-[9px] font-heading uppercase tracking-widest text-amber-400/80">Steal Base</div>
          <div className="flex gap-2">
            {bases.map((runner, i) => {
              if (!runner || i + 1 >= 3) return null;
              return (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => onSteal(i)}
                  className="flex-1 h-10 border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 transition-all"
                >
                  <span className="font-heading font-bold text-xs text-amber-400">
                    🏃 Steal {i === 0 ? '2nd' : i === 1 ? '3rd' : 'Home'}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hit-and-run toggle */}
      {runnersOn && (
        <div className="flex justify-center">
          <Button
            variant={hitAndRun ? 'default' : 'outline'}
            size="sm"
            disabled={disabled}
            onClick={onHitAndRun}
            className={`h-9 px-4 text-xs font-heading font-bold transition-all ${
              hitAndRun
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                : 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-400'
            }`}
          >
            {hitAndRun ? '✓ Hit & Run ON' : 'Hit & Run'}
          </Button>
        </div>
      )}

      {/* Swing buttons */}
      <div>
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
    </div>
  );
}