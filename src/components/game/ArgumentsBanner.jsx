import React, { useState, useEffect } from 'react';
import { ArrowRight, X } from 'lucide-react';

const LEVEL_LABELS = ["Grumbling...", "Leaning out...", "On the field!", "In his face!", "NUCLEAR!"];
const LEVEL_COLORS = ["text-amber-400", "text-orange-400", "text-orange-500", "text-red-500", "text-red-600"];

export default function ArgumentsBanner({ result, onDismiss }) {
  const [stage, setStage] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!result) return;
    setVisible(true);
    setStage(0);

    // Step through escalation levels 0..result.escaLevel
    const totalStages = result.escaLevel + 1;
    let current = 0;

    const interval = setInterval(() => {
      current++;
      setStage(current);
      if (current >= totalStages) {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [result]);

  if (!result || !visible) return null;

  const isFinal = stage >= result.escaLevel;
  const levelColor = LEVEL_COLORS[Math.min(result.escaLevel, 4)];

  // Special effects
  const showHat = result.hatThrow && isFinal;
  const showDirt = result.dirtKick && isFinal;
  const showBasePickup = result.basePickup && isFinal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onDismiss}>
      <div className="relative bg-card border border-primary/30 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Argument animation */}
        <div className="space-y-4 text-center">
          {/* Stage indicator */}
          <div className="flex items-center justify-center gap-1.5">
            {Array.from({ length: result.escaLevel + 1 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i <= stage
                    ? `bg-gradient-to-r ${i === 0 ? 'from-amber-500 to-orange-500' :
                        i === 1 ? 'from-orange-500 to-orange-600' :
                        i === 2 ? 'from-orange-600 to-red-500' :
                        i === 3 ? 'from-red-500 to-red-600' :
                        'from-red-600 to-red-700'} w-8`
                    : 'bg-muted w-4'
                }`}
              />
            ))}
          </div>

          {/* Escalation label */}
          <div className={`font-heading text-lg font-bold ${levelColor} transition-all duration-300`}>
            {stage <= result.escaLevel ? LEVEL_LABELS[stage] || LEVEL_LABELS[0] : LEVEL_LABELS[result.escaLevel]}
          </div>

          {/* Who's arguing */}
          <div className="text-sm font-heading text-foreground/80">
            {result.whoArgues === 'manager' ? `Manager: ${result.managerName || 'The Skipper'}` :
             result.whoArgues === 'batter' ? 'Batter throws his hands up' :
             result.whoArgues === 'catcher' ? 'Catcher stands up to discuss' :
             result.whoArgues === 'pitcher' ? 'Pitcher stares at the umpire' : ''}
          </div>

          {/* Call being disputed */}
          <div className="text-xs text-muted-foreground italic">
            Disputed: {result.callType}
          </div>

          {/* Ejection — final state */}
          {isFinal && result.ejected && (
            <div className="bg-destructive/20 border border-destructive/40 rounded-xl p-3 animate-pulse">
              <div className="text-base font-heading font-bold text-destructive">⚡ EJECTED! ⚡</div>
              {showBasePickup && (
                <div className="text-xs text-destructive/80 mt-1">He's taking the base with him!</div>
              )}
              {showDirt && (
                <div className="text-xs text-destructive/80 mt-1">Dirt kicked all over home plate!</div>
              )}
              {showHat && (
                <div className="text-xs text-destructive/80 mt-1">Hat thrown to the ground!</div>
              )}
              {result.delayedEjection && (
                <div className="text-xs text-destructive/80 mt-1">The delayed ejection — he just couldn't help himself!</div>
              )}
            </div>
          )}

          {/* Special effect animation */}
          {showBasePickup && (
            <div className="text-4xl animate-bounce">🧢</div>
          )}
          {showDirt && (
            <div className="text-4xl animate-ping">💨</div>
          )}
          {showHat && (
            <div className="text-4xl animate-bounce">🎩</div>
          )}

          {/* Crowd reaction */}
          <div className="text-xs text-foreground/60 font-heading italic">
            {isFinal
              ? (result.basePickup ? "Crowd goes absolutely wild!" :
                 result.dirtKick ? "Crowd erupts — dirt everywhere!" :
                 result.hatThrow ? "Crowd roars as the cap hits the dirt!" :
                 result.ejected && result.escaLevel >= 3 ? "Huge ovation — the crowd is on its feet!" :
                 result.ejected ? "Crowd cheers — the manager is gone!" :
                 result.escaLevel >= 2 ? "Crowd stirs — this is getting interesting." :
                 "A few murmurs from the stands.")
              : '...'}
          </div>

          {/* Continue button */}
          {isFinal && (
            <button
              onClick={onDismiss}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 text-primary font-heading text-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}