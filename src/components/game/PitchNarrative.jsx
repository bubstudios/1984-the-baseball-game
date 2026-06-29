import React, { useState, useEffect } from 'react';

export default function PitchNarrative({ narrative, autoDismissMs = 4000, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!narrative) {
      setVisible(false);
      return;
    }

    setVisible(true);
    
    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) setTimeout(onDismiss, 300); // brief fade delay
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [narrative, autoDismissMs, onDismiss]);

  if (!visible || !narrative) return null;

  // Handle both old string format and new dual-field format
  const playByPlay = typeof narrative === 'string' ? narrative : narrative?.playByPlay || '';
  const colorCommentary = typeof narrative === 'object' ? narrative?.colorCommentary || '' : '';

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-40">
      <div
        className="relative bg-card/95 border border-primary/40 rounded-xl px-6 py-4 max-w-2xl w-full mx-4 shadow-2xl backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
      >
        {/* On-air indicator */}
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <span className="text-xs text-red-400 font-display animate-pulse">●</span>
          <span className="text-[9px] text-muted-foreground/60 font-heading uppercase tracking-wider">
            Live
          </span>
        </div>

        <div className="space-y-3">
          {/* Play-by-play: audible, orange, primary focus */}
          <p className="text-sm md:text-base font-body text-primary/90 leading-relaxed font-semibold">
            "{playByPlay}"
          </p>

          {/* Color commentary: silent, muted, expert analysis */}
          {colorCommentary && (
            <p className="text-xs md:text-sm font-body text-foreground/60 leading-relaxed italic border-l-2 border-primary/20 pl-3">
              {colorCommentary}
            </p>
          )}
        </div>

        {/* Progress bar - visual indicator of auto-dismiss */}
        <div className="mt-3 h-0.5 bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary/60 rounded-full animate-out fade-out duration-500"
            style={{
              animation: `shrink ${(4000 - 300) / 1000}s linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}