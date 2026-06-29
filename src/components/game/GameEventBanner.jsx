import React from 'react';
import { Radio, X, Zap, Trophy, Target } from 'lucide-react';

export default function GameEventBanner({ event, type, onClose }) {
  if (!event) return null;

  const getIcon = () => {
    if (type === 'celebration') return <Trophy className="w-4 h-4 text-primary" />;
    if (type === 'caughtstealing') return <Target className="w-4 h-4 text-destructive" />;
    if (type === 'ballpark') return <Zap className="w-4 h-4 text-primary" />;
    return <Radio className="w-4 h-4 text-primary" />;
  };

  const getBorderColor = () => {
    if (type === 'celebration') return 'border-primary/40';
    if (type === 'caughtstealing') return 'border-destructive/40';
    if (type === 'ballpark') return 'border-primary/40';
    return 'border-primary/40';
  };

  const getTitle = () => {
    if (type === 'celebration') return 'Celebration';
    if (type === 'caughtstealing') return 'Caught Stealing';
    if (type === 'ballpark') return 'Ballpark Event';
    return 'Game Event';
  };

  return (
    <div className={`relative bg-card border ${getBorderColor()} rounded-xl px-4 py-3 text-center`}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Close event"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        {getIcon()}
        <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-primary">
          {getTitle()}
        </span>
      </div>

      {/* Main text */}
      <p className="text-sm font-heading font-semibold text-foreground leading-snug px-4">
        {typeof event === 'string' ? event : event.text}
      </p>

      {/* Subtext for ballpark events */}
      {type === 'ballpark' && event?.rarity && (
        <p className="text-[10px] text-muted-foreground/50 italic mt-1">
          {event.rarity === 'legendary' ? '⚡ Legendary' : event.rarity === 'rare' ? '⭐ Rare' : 'Common'}
        </p>
      )}
    </div>
  );
}