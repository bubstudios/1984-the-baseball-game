import React, { useState, useEffect } from 'react';
import { Megaphone, Tv, Film, Monitor, ShoppingBag, Heart, Calendar, MapPin } from 'lucide-react';

const CATEGORY_META = {
  sponsor: { icon: Megaphone, label: 'SPONSOR MESSAGE', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  community: { icon: MapPin, label: 'COMMUNITY BULLETIN', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  charity: { icon: Heart, label: 'PUBLIC SERVICE', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  team_promo: { icon: Calendar, label: 'TEAM PROMOTION', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function AdRead({ ad, onDismiss, autoDismissMs = 5000 }) {
  const [visible, setVisible] = useState(false);
  const meta = CATEGORY_META[ad?.category] || CATEGORY_META.sponsor;
  const Icon = meta.icon;

  useEffect(() => {
    if (!ad) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    let dismissTimer;
    if (autoDismissMs > 0) {
      dismissTimer = setTimeout(onDismiss, autoDismissMs + 100);
    }
    return () => {
      clearTimeout(showTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [ad, onDismiss, autoDismissMs]);

  if (!ad || !visible) return null;

  return (
    <div
      className="cursor-pointer animate-in slide-in-from-bottom-4 fade-in duration-300"
      onClick={onDismiss}
    >
      <div className={`${meta.bg} border ${meta.border} rounded-xl px-4 py-3 text-center`}>
        {/* Category label */}
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <Icon className={`w-3 h-3 ${meta.color}`} />
          <span className={`text-[9px] font-heading uppercase tracking-[0.2em] ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        {/* Ad text */}
        <p className="text-sm font-heading text-foreground/85 leading-relaxed italic">
          "{ad.text}"
        </p>

        {/* Dismiss hint */}
        <p className="text-[9px] text-muted-foreground/40 mt-2 font-heading">
          tap to continue
        </p>
      </div>
    </div>
  );
}