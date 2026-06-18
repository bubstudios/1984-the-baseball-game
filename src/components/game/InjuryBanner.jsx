import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, HeartPulse, Timer } from 'lucide-react';

const SEVERITY_COLORS = {
  DTD: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-400" },
  IL15: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-400" },
  IL60: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", badge: "bg-red-500/20 text-red-400" },
  SEASON: { bg: "bg-red-700/10", border: "border-red-700/40", text: "text-red-500", badge: "bg-red-700/20 text-red-500" },
};

export default function InjuryBanner({ injury, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!injury) return;
    setVisible(true);
    // Auto-dismiss after 5 seconds for less severe injuries
    const timeout = injury.severity === "IL60" || injury.severity === "SEASON" ? 7000 : 4500;
    const timer = setTimeout(() => onDismiss(), timeout);
    return () => clearTimeout(timer);
  }, [injury]);

  if (!injury || !visible) return null;

  const colors = SEVERITY_COLORS[injury.severity] || SEVERITY_COLORS.DTD;
  const isWeird = injury.isWeird;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onDismiss}>
      <div
        className={`relative ${colors.bg} ${colors.border} border rounded-2xl p-5 max-w-sm w-full mx-4 shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-card/50 hover:bg-card text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-3 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            {isWeird ? (
              <div className="w-12 h-12 bg-primary/10 border border-primary/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-primary/80" />
              </div>
            ) : injury.severity === "SEASON" || injury.severity === "IL60" ? (
              <div className="w-12 h-12 bg-destructive/10 border border-destructive/30 rounded-full flex items-center justify-center animate-pulse">
                <HeartPulse className="w-6 h-6 text-destructive/80" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                <Timer className="w-6 h-6 text-amber-400/80" />
              </div>
            )}
          </div>

          {/* Severity badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading font-bold ${colors.badge}`}>
            {injury.severityLabel}
          </span>

          {/* Player */}
          <div className="text-lg font-heading font-bold text-foreground">
            {injury.player}
          </div>
          <div className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
            {injury.position}
          </div>

          {/* Injury name */}
          <div className={`font-heading font-bold ${colors.text}`}>
            {injury.injury.name}
          </div>

          {/* Commentary */}
          <p className="text-sm font-heading text-foreground/80 italic leading-snug">
            "{injury.commentary}"
          </p>

          {/* Replacement note */}
          <p className="text-xs text-muted-foreground/70">
            {injury.replacementNote}
          </p>

          <button
            onClick={onDismiss}
            className="mt-2 px-4 py-2 rounded-lg bg-card/50 border border-border hover:bg-card text-foreground/80 font-heading text-sm transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}