import React, { useState, useEffect } from 'react';
import { CloudLightning, Dog, Wrench, Users, Zap, Bird, Tv, Star } from 'lucide-react';

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
    const timer = setTimeout(() => onDismiss(), 4000);
    return () => clearTimeout(timer);
  }, [event]);

  if (!event || !visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-500">
      <div className={`bg-card/95 border ${borderColor} rounded-xl px-4 py-3 shadow-xl max-w-sm`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="w-5 h-5 text-primary/80" />
          </div>
          <div className="min-w-0">
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
        </div>
      </div>
    </div>
  );
}