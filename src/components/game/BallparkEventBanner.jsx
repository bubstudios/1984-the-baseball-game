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
  const [visible, setVisible] = useState(false);
  const Icon = CATEGORY_ICONS[event.category] || Zap;
  const borderColor = RARITY_COLORS[event.rarity] || "border-muted-foreground/20";

  useEffect(() => {
    if (!event) return;
    setVisible(true);
  }, [event]);

  if (!event || !visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500" onClick={onDismiss}>
      <div className={`bg-card/95 border ${borderColor} rounded-xl px-4 py-3 shadow-xl max-w-sm cursor-pointer`}>
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
                Brief delay — ~{event.delay} seconds
              </p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}