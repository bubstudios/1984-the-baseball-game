import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import BatButtons from '@/components/game/BatButtons';

export default function ActionPanel({
  isPitching,
  onPitch,
  onSwing,
  onSteal,
  onHitAndRun,
  onIntBB,
  disabled,
  bases,
  hitAndRun,
  pitcherPitches,
  pitcherNeedsReplacement,
  onNeedReliever,
  pitcherSpecialty,
  reachBackUses,
  reachBackMax,
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

  const handleReachBack = () => {
    if (disabled || animatingPitch) return;
    setAnimatingPitch('__reachback__');
    setTimeout(() => {
      setAnimatingPitch(null);
      setActivePitch(null);
      onPitch('__reachback__');
    }, 600);
  };

  if (isPitching) {
    // Pitcher was pinch-hit for — must bring in a reliever first
    if (pitcherNeedsReplacement) {
      return (
        <div className="space-y-3 text-center">
          <div className="text-xs text-amber-400 font-heading">Pitcher was pinch-hit for — bring in a reliever</div>
          <Button
            variant="default"
            size="lg"
            onClick={onNeedReliever}
            className="w-full h-12 font-heading font-bold text-sm bg-amber-600 hover:bg-amber-700"
          >
            Bring in a Reliever
          </Button>
        </div>
      );
    }

    const pitches = pitcherPitches || ["Fastball", "Breaking Ball", "Changeup"];

    // Determine if bases are open for IBB (1st base empty = can put batter on)
    const canIBB = !bases || !bases[0];

    const pitchShortNames = {
      "Fastball": "FB",
      "Breaking Ball": "BB",
      "Changeup": "CU",
      "Knuckleball": "KN",
      "Screwball": "SC",
      "Split-Finger": "SF",
    };

    // Animation per pitch type
    const animClass = (name) => {
      if (animatingPitch !== name) return '';
      if (name === "Knuckleball") return 'animate-knuckle-shake';
      if (name === "Screwball") return 'animate-spin-diagonal';
      if (name === "Fastball" || name === "Changeup") return 'animate-spin-vertical';
      return 'animate-spin-horizontal';
    };

    const spinDuration = (name) => {
      if (name === "Fastball") return 'duration-350';
      if (name === "Changeup") return 'duration-700';
      if (name === "Knuckleball") return 'duration-300';
      return 'duration-500';
    };

    return (
      <div className="space-y-2">
        <div className="text-[10px] font-heading uppercase tracking-widest text-foreground/60 text-center mb-2">Select Pitch</div>
        <div className="flex items-center justify-center gap-3">
          {pitches.map((pitchName) => {
            const isFB = pitchName === "Fastball";
            const isCU = pitchName === "Changeup";
            const color = isFB ? 'bg-white/90 border-white/20' : isCU ? 'bg-amber-100/80 border-amber-200/30' : 'bg-red-100/70 border-red-200/30';
            const textColor = isFB ? 'text-slate-700' : isCU ? 'text-amber-800' : 'text-red-800';
            const ringColor = isFB ? 'ring-white/40' : isCU ? 'ring-amber-400/40' : 'ring-red-400/40';

            return (
              <button
                key={pitchName}
                disabled={disabled || !!animatingPitch}
                onClick={() => handlePitch(pitchName)}
                onMouseEnter={() => setActivePitch(pitchName)}
                onMouseLeave={() => setActivePitch(null)}
                className="relative flex flex-col items-center justify-center"
              >
                <div
                  className={`
                    w-14 h-14 rounded-full ${color}
                    border shadow-lg
                    flex items-center justify-center
                    transition-all duration-200
                    ${animClass(pitchName)} ${pitchName !== "Knuckleball" ? spinDuration(pitchName) : ''}
                    ${activePitch === pitchName ? `scale-110 shadow-xl ${ringColor} ring-2` : ''}
                    ${animatingPitch === pitchName ? `scale-110 ${ringColor} ring-2` : ''}
                    ${disabled ? 'opacity-40' : 'hover:scale-105 cursor-pointer'}
                  `}
                >
                  <span className={`font-display text-[15px] font-bold ${textColor} tracking-tight leading-none`}>
                    {pitchShortNames[pitchName] || pitchName.slice(0, 2)}
                  </span>
                </div>
                <span className="text-[9px] font-heading text-foreground/70 mt-1 text-center leading-tight">
                  {pitchName}
                </span>
              </button>
            );
          })}
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
          @keyframes spinDiagonal {
            0% { transform: rotate(0deg); }
            50% { transform: rotate(-55deg) translate(3px, 3px); }
            100% { transform: rotate(0deg); }
          }
          @keyframes knuckleShake {
            0% { transform: translate(0, 0) rotate(0deg); }
            10% { transform: translate(-4px, 3px) rotate(-8deg); }
            20% { transform: translate(5px, -2px) rotate(6deg); }
            30% { transform: translate(-6px, -4px) rotate(-5deg); }
            40% { transform: translate(3px, 5px) rotate(9deg); }
            50% { transform: translate(-5px, 1px) rotate(-7deg); }
            60% { transform: translate(6px, -3px) rotate(4deg); }
            70% { transform: translate(-3px, 4px) rotate(-10deg); }
            80% { transform: translate(4px, -5px) rotate(8deg); }
            90% { transform: translate(-2px, 2px) rotate(-3deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }
          .animate-spin-vertical { animation: spinVertical 0.5s ease-in-out; }
          .animate-spin-horizontal { animation: spinHorizontal 0.5s ease-in-out; }
          .animate-spin-diagonal { animation: spinDiagonal 0.55s ease-in-out; }
          .animate-knuckle-shake { animation: knuckleShake 0.6s ease-in-out; }
          @keyframes reachbackPulse {
            0%, 100% { box-shadow: 0 0 8px rgba(251,191,36,0.4); }
            50% { box-shadow: 0 0 20px rgba(251,191,36,0.7); }
          }
          .animate-reachback-pulse { animation: reachbackPulse 0.6s ease-in-out; }
          .duration-350 { animation-duration: 0.35s; }
          .duration-700 { animation-duration: 0.7s; }
          .duration-300 { animation-duration: 0.3s; }
        `}</style>

        {/* Reach Back — specialty pitch for iconic pitchers */}
        {pitcherSpecialty && (
          <div className="flex justify-center pt-1">
            <button
              disabled={disabled || !!animatingPitch || reachBackUses >= reachBackMax}
              onClick={handleReachBack}
              className={`relative flex items-center gap-1.5 h-10 px-4 rounded-xl border-2 transition-all ${
                reachBackUses >= reachBackMax
                  ? 'border-muted/20 bg-muted/10 text-muted-foreground/40'
                  : animatingPitch === '__reachback__'
                    ? 'border-amber-400/60 bg-amber-500/20 text-amber-200 scale-105'
                    : 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 hover:border-amber-400/70 text-amber-300'
              } ${animatingPitch === '__reachback__' ? 'animate-reachback-pulse' : ''}`}
            >
              <span className="text-[11px] font-heading font-bold">
                💪 {pitcherSpecialty.name}
              </span>
              <span className="text-[9px] font-heading text-amber-400/60">
                ({reachBackMax - reachBackUses} left)
              </span>
            </button>
          </div>
        )}

        {/* Intentional Walk + Change Pitcher */}
        <div className="flex justify-center gap-2 pt-1">
          {canIBB && (
            <button
              disabled={disabled}
              onClick={onIntBB}
              className="h-8 px-4 rounded-lg border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/10 text-[10px] font-heading font-bold text-amber-400/80 transition-all disabled:opacity-40"
            >
              🖐 Int. Walk
            </button>
          )}
          <button
            onClick={onNeedReliever}
            className="h-8 px-4 rounded-lg border border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10 text-[10px] font-heading font-bold text-blue-400/80 transition-all"
          >
            🔄 Change Pitcher
          </button>
        </div>
      </div>
    );
  }

  const runnersOn = bases && bases.some(b => b !== null);

  return (
    <div className="space-y-2">
      {/* Steal + Hit & Run — compact row above swing buttons */}
      {runnersOn && (
        <div className="space-y-1">
          <div className="text-[9px] font-heading uppercase tracking-widest text-amber-400/60 text-center">Runner Action</div>
          <div className="flex items-center gap-1.5 justify-center flex-wrap">
            {bases.map((runner, i) => {
              if (!runner || i + 1 >= 3 || bases[i + 1]) return null;
              return (
                <button
                  key={i}
                  disabled={disabled}
                  onClick={() => onSteal(i)}
                  className="h-8 px-3 rounded-lg border border-amber-500/40 hover:border-amber-400 hover:bg-amber-500/10 text-[11px] font-heading font-bold text-amber-400 bg-amber-500/5 transition-all disabled:opacity-30"
                >
                  🏃 Steal {i === 0 ? '2nd' : i === 1 ? '3rd' : 'Home'}
                </button>
              );
            })}
            <button
              disabled={disabled}
              onClick={onHitAndRun}
              className={`h-8 px-3 rounded-lg text-[11px] font-heading font-bold transition-all disabled:opacity-30 ${
                hitAndRun
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-500'
                  : 'border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-400 bg-cyan-500/5'
              }`}
            >
              {hitAndRun ? '✓ Hit & Run' : 'Hit & Run'}
            </button>
          </div>
        </div>
      )}

      {/* Swing buttons — bats */}
      <BatButtons onSwing={onSwing} disabled={disabled} />
    </div>
  );
}