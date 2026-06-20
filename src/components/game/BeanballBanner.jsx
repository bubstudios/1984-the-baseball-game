import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Zap, Siren } from 'lucide-react';

// Severity styles
const STYLES = {
  hbp: { bg: 'bg-red-500/10', border: 'border-red-500/30', icon: Zap, iconColor: 'text-red-400', label: 'HIT BY PITCH' },
  warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: AlertTriangle, iconColor: 'text-amber-400', label: 'UMPIRE WARNING' },
  ejection: { bg: 'bg-red-600/15', border: 'border-red-500/40', icon: AlertTriangle, iconColor: 'text-red-500', label: 'EJECTION' },
  batFlip: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: Zap, iconColor: 'text-purple-400', label: 'BAT FLIP' },
  collision: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: AlertTriangle, iconColor: 'text-orange-400', label: 'COLLISION' },
  brawl: { bg: 'bg-red-700/15', border: 'border-red-600/50', icon: Siren, iconColor: 'text-red-500', label: 'BRAWL' },
};

export default function BeanballBanner({ event, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const style = STYLES[event?.type] || STYLES.hbp;
  const Icon = style.icon;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss HBP and bat flip after 6 seconds, others stay until tapped
  useEffect(() => {
    if (event?.type === 'hbp' || event?.type === 'batFlip') {
      const t = setTimeout(() => {
        setDismissing(true);
        setTimeout(onDismiss, 300);
      }, 6000);
      return () => clearTimeout(t);
    }
  }, [event, onDismiss]);

  const handleDismiss = () => {
    setDismissing(true);
    setTimeout(onDismiss, 300);
  };

  if (!event) return null;

  return (
    <div
      className={`fixed inset-0 z-30 flex items-end sm:items-center justify-center transition-all duration-300 ${visible ? 'opacity-100' : 'opacity-0'} ${dismissing ? 'opacity-0 translate-y-4' : ''}`}
      onClick={event.type !== 'hbp' ? undefined : handleDismiss}
    >
      {/* Backdrop for non-HBP events */}
      {event.type !== 'hbp' && event.type !== 'batFlip' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />
      )}

      {/* Card */}
      <div
        className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 ${style.bg} border ${style.border} rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Shake animation for brawls/ejections */}
        {event.type === 'brawl' && (
          <style>{`
            @keyframes shakeHard { 0%,100%{transform:translate(0,0) rotate(0)} 15%{transform:translate(-6px,0) rotate(-2deg)} 30%{transform:translate(6px,0) rotate(2deg)} 45%{transform:translate(-5px,0) rotate(-1.5deg)} 60%{transform:translate(4px,0) rotate(1deg)} 75%{transform:translate(-2px,0) rotate(-0.5deg)} }
            .animate-shake-hard { animation: shakeHard 0.6s ease-in-out; }
          `}</style>
        )}

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-foreground/5">
          <div className="flex items-center gap-2">
            <Icon className={`w-5 h-5 ${style.iconColor} ${event.type === 'brawl' ? 'animate-pulse' : ''}`} />
            <span className={`text-[10px] font-heading uppercase tracking-[0.15em] ${style.iconColor}`}>
              {style.label}
            </span>
            {event.type === 'brawl' && (
              <span className="text-[9px] font-display text-red-400 animate-pulse ml-1">⚡</span>
            )}
          </div>
          <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className={`px-5 py-4 ${event.type === 'brawl' ? 'animate-shake-hard' : ''}`}>
          <p className="text-base font-heading font-bold text-foreground leading-snug mb-1">
            {event.text}
          </p>
          {event.subtext && (
            <p className="text-xs text-muted-foreground/80 mt-1 font-body italic">
              {event.subtext}
            </p>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-2 border-t border-foreground/5 flex justify-between items-center">
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">
            {event.type === 'brawl' ? 'BENCHES CLEAR' : event.type === 'warning' ? 'BOTH SIDES' : event.type === 'ejection' ? 'THROWN OUT' : 'BEANBALL'}
          </span>
          <span className="text-[9px] text-muted-foreground/40 font-heading">
            tap to dismiss
          </span>
        </div>
      </div>
    </div>
  );
}