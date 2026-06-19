import React from 'react';
import { AlertTriangle, HeartPulse, Timer, UserPlus } from 'lucide-react';

const SEVERITY_COLORS = {
  DTD: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", badge: "bg-amber-500/20 text-amber-400" },
  IL15: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-400" },
  IL60: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-400", badge: "bg-red-500/20 text-red-400" },
  SEASON: { bg: "bg-red-700/10", border: "border-red-700/40", text: "text-red-500", badge: "bg-red-700/20 text-red-500" },
};

export default function InjuryReplacementModal({ pendingInjury, onSelect }) {
  if (!pendingInjury) return null;
  const colors = SEVERITY_COLORS[pendingInjury.severity] || SEVERITY_COLORS.DTD;
  const options = pendingInjury.benchOptions || [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className={`relative ${colors.bg} ${colors.border} border rounded-2xl p-5 max-w-sm w-full mx-4 shadow-2xl`}>
        <div className="space-y-3 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            {pendingInjury.severity === "SEASON" || pendingInjury.severity === "IL60" ? (
              <div className="w-12 h-12 bg-destructive/10 border border-destructive/30 rounded-full flex items-center justify-center animate-pulse">
                <HeartPulse className="w-6 h-6 text-destructive/80" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                <Timer className="w-6 h-6 text-amber-400/80" />
              </div>
            )}
          </div>

          <span className={`inline-block px-3 py-1 rounded-full text-xs font-heading font-bold ${colors.badge}`}>
            {pendingInjury.severityLabel}
          </span>

          <div className="text-lg font-heading font-bold text-foreground">{pendingInjury.player}</div>
          {pendingInjury.oldPos && (
            <div className="text-xs text-muted-foreground font-heading uppercase tracking-wider">
              {pendingInjury.isPitcher ? 'Pitcher' : pendingInjury.oldPos}
            </div>
          )}
          <div className={`font-heading font-bold ${colors.text}`}>{pendingInjury.injury?.name}</div>
          <p className="text-sm font-heading text-foreground/80 italic leading-snug">"{pendingInjury.commentary}"</p>

          {/* Force choice */}
          <div className="border-t border-border/50 pt-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <UserPlus className="w-4 h-4 text-primary" />
              <span className="text-xs font-heading text-primary font-bold uppercase tracking-wider">
                Select a Replacement
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {options.map((p, i) => (
                <button
                  key={p.name + i}
                  onClick={() => onSelect(p)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-card/60 hover:bg-card border border-border/50 hover:border-primary/40 transition-colors text-left"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-heading font-bold text-foreground truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {p.reason === 'reliever' ? `RP · Ctrl ${p.control}` : `${p.pos} · Con ${p.contact} Pwr ${p.power}`}
                    </div>
                  </div>
                  <span className="text-[9px] text-primary/60 font-heading shrink-0 ml-2">SELECT →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}