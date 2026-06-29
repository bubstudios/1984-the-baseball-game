import React, { useState, useEffect } from 'react';
import { CloudLightning, Dog, Wrench, Users, Zap, Bird, Tv, Star, X } from 'lucide-react';

const CATEGORY_ICONS = {
  fans: Users,
  equipment: Wrench,
  stadium: Tv,
  grounds: Wrench,
  weather: CloudLightning,
  animals: Dog,
  umpire: Users,
  player: Users,
  retro: Tv,
  legendary: Star,
};

const RARITY_COLORS = {
  common: "border-muted-foreground/20",
  uncommon: "border-primary/30",
  rare: "border-primary/50",
  legendary: "border-primary",
};

export default function BallparkEventBanner({ event, onDismiss }) {
  const [closing, setClosing] = useState(false);
  const Icon = CATEGORY_ICONS[event?.category] || Zap;
  const borderColor = RARITY_COLORS[event?.rarity] || "border-muted-foreground/20";

  useEffect(() => {
    if (!event) return;
    setClosing(false);
    const timer = setTimeout(() => {
      setClosing(true);
      setTimeout(onDismiss, 300);
    }, 10000);
    return () => clearTimeout(timer);
  }, [event]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!event) return null;

  const handleDismiss = () => {
    setClosing(true);
    setTimeout(onDismiss, 300);
  };

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      onClick={handleDismiss}
    >
      <div
        className={`bg-card/95 border-2 ${borderColor} rounded-xl px-5 py-4 shadow-2xl max-w-[280px] cursor-pointer`}
        onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="w-5 h-5 text-primary/80" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-heading uppercase tracking-wider text-primary/60">
                {event.rarity === "legendary" ? "⚡ Legendary Event" : "Ballpark Event"}
              </span>
            </div>
            <p className="text-sm font-heading text-foreground/90 leading-snug">{event.text}</p>
            {event.delay > 0 && (
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Brief delay - ~{event.delay} seconds
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}