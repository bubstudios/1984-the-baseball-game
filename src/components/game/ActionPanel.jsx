import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const BAT_ACTIONS = [
  { label: 'Swing', swingIndex: 0, desc: 'Standard swing' },
  { label: 'Power', swingIndex: 2, desc: 'Swing for the fences' },
  { label: 'Bunt', swingIndex: 4, desc: 'Lay one down' },
];

export default function ActionPanel({
  isPitching,
  onPitch,
  onSwing,
  onSteal,
  onHitAndRun,
  disabled,
  bases,
  hitAndRun,
  pitcherPitches,
}) {
  const [activePitch, setActivePitch] = useState(null);
  const [animatingPitch, setAnimatingPitch] = useState(null);

  const handlePitch = (pitchName) => {
    if (disabled || animatingPitch) return;
    setAnimatingPitch(pitchName);

    // Spin animation then fire
    setTimeout(() => {
      setAnimatingPitch(null);
      setActivePitch(null);
      onPitch(pitchName);
    }, 500);
  };

  if (isPitching) {
    const pitches = pitcherPitches || ["Fastball", "Breaking Ball", "Changeup"];

    const pitchShortNames = {
      "Fastball": "FB",
      "Breaking Ball": "BB",
      "Changeup": "CU",
      "Knuckleball": "KN",
      "Screwball": "SC",
      "Split-Finger": "SF",
    };

    // Spin direction per pitch type
    const spinClass = (name) => {
      if (animatingPitch === name) {
        if (name === "Fastball" || name === "Changeup") return 'animate-spin-vertical';
        return 'animate-spin-horizontal';
      }
      return '';
    };

    const spinDuration = (name) => {
      if (name === "Changeup") return 'duration-700';
      if (name === "Knuckleball") return 'duration-300';
      return 'duration-500';
    };

    return (
      <div className="space-y-2">
        <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground text-center mb-2">Select Pitch</div>
        <div className="flex items-center justify-center gap-3">
          {pitches.map((pitchName) => (
            <button
              key={pitchName}
              disabled={disabled || !!animatingPitch}
              onClick={() => handlePitch(pitchName)}
              onMouseEnter={() => setActivePitch(pitchName)}
              onMouseLeave={() => setActivePitch(null)}
              className="relative flex flex-col items-center justify-center"
            >
              {/* Baseball circle */}
              <div
                className={`
                  w-16 h-16 rounded-full 
                  bg-gradient-to-br from-white via-gray-50 to-gray-200
                  border-2 border-gray-300 shadow-md
                  flex items-center justify-center
                  transition-all duration-200
                  ${spinClass(pitchName)} ${spinDuration(pitchName)}
                  ${activePitch === pitchName ? 'scale-110 shadow-lg ring-2 ring-primary/40' : ''}
                  ${animatingPitch === pitchName ? 'scale-110 ring-2 ring-primary/60' : ''}
                  ${disabled ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}
                `}
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #fff, #e8e0d0 40%, #d4c8b0 80%, #c0b498 100%)',
                }}
              >
                {/* Seams */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M10,50 Q30,20 50,50 Q70,80 90,50" fill="none" stroke="#d4c8b0" strokeWidth="1.5" />
                  <path d="M10,50 Q30,80 50,50 Q70,20 90,50" fill="none" stroke="#d4c8b0" strokeWidth="1.5" />
                </svg>
                <span className="relative font-display text-[14px] font-bold text-gray-700 tracking-tight leading-none z-10">
                  {pitchShortNames[pitchName] || pitchName.slice(0, 2)}
                </span>
              </div>
              <span className="text-[9px] font-heading text-muted-foreground mt-1 text-center leading-tight">
                {pitchName}
              </span>
            </button>
          ))}
        </div>

        <style>{`
          @keyframes spinVertical {
            0% { transform: rotateX(0deg); }
            50% { transform: rotateX(360deg); }
            100% { transform: rotateX(0deg); }
          }
          @keyframes spinHorizontal {
            0% { transform: rotateY(0deg); }
            50% { transform: rotateY(360deg); }
            100% { transform: rotateY(0deg); }
          }
          .animate-spin-vertical { animation: spinVertical 0.5s ease-in-out; }
          .animate-spin-horizontal { animation: spinHorizontal 0.5s ease-in-out; }
          .duration-700 { animation-duration: 0.7s; }
          .duration-300 { animation-duration: 0.3s; }
        `}</style>
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
        <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground text-center mb-2">Choose Swing</div>
        <div className="grid grid-cols-3 gap-2">
          {BAT_ACTIONS.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              disabled={disabled}
              onClick={() => onSwing(action.swingIndex)}
              className="h-14 flex flex-col items-center justify-center gap-0.5 border-border/60 hover:border-primary hover:bg-primary/10 transition-all"
            >
              <span className="font-heading font-bold text-sm text-foreground">{action.label}</span>
              <span className="text-[9px] text-muted-foreground/60">{action.desc}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}