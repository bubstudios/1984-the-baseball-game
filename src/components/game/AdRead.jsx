import React, { useState, useEffect } from 'react';
import { Megaphone, Tv, Film, Monitor, ShoppingBag, Heart, Calendar, MapPin, X, ExternalLink } from 'lucide-react';
import { findAdDetail } from '@/lib/adDetails';

const CATEGORY_META = {
  sponsor: { icon: Megaphone, label: 'SPONSOR MESSAGE', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  community: { icon: MapPin, label: 'COMMUNITY BULLETIN', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  charity: { icon: Heart, label: 'PUBLIC SERVICE', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  team_promo: { icon: Calendar, label: 'TEAM PROMOTION', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
};

export default function AdRead({ ad, onDismiss, autoDismissMs = 12000 }) {
  const [visible, setVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const meta = CATEGORY_META[ad?.category] || CATEGORY_META.sponsor;
  const Icon = meta.icon;

  const detail = ad?.text ? findAdDetail(ad.text) : null;

  useEffect(() => {
    if (!ad) return;
    setShowDetail(false);
    const showTimer = setTimeout(() => setVisible(true), 100);
    // Only auto-dismiss when not showing the detail view
    let dismissTimer;
    if (autoDismissMs > 0 && !showDetail) {
      dismissTimer = setTimeout(onDismiss, autoDismissMs + 100);
    }
    return () => {
      clearTimeout(showTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, [ad, onDismiss, autoDismissMs, showDetail]);

  if (!ad || !visible) return null;

  const handleTap = () => {
    // Tap always dismisses. Use the (i) button for details.
    onDismiss();
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      {/* Main ad banner */}
      <div
        className={`${detail ? 'cursor-pointer' : 'cursor-pointer'} ${meta.bg} border ${meta.border} rounded-xl px-4 py-3 text-center`}
        onClick={handleTap}
      >
        <div className="flex items-center justify-center gap-1.5 mb-1.5">
          <Icon className={`w-3 h-3 ${meta.color}`} />
          <span className={`text-[9px] font-heading uppercase tracking-[0.2em] ${meta.color}`}>
            {meta.label}
          </span>
        </div>

        <p className="text-sm font-heading text-foreground/85 leading-relaxed italic">
          "{ad.text}"
        </p>

        <p className="text-[9px] text-muted-foreground/40 mt-2 font-heading">
          {detail ? 'tap for details' : 'tap to continue'}
        </p>
      </div>

      {/* Detail modal — shown on tap when detail exists */}
      {showDetail && detail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => { setShowDetail(false); onDismiss(); }}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <div
            className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`${meta.bg} border-b ${meta.border} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${meta.color}`} />
                  <span className={`text-[10px] font-heading uppercase tracking-[0.2em] ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <button
                  onClick={() => { setShowDetail(false); onDismiss(); }}
                  className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">{detail.title}</h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">{detail.subtitle}</p>
              </div>
              <p className="text-sm font-body text-foreground/80 leading-relaxed">{detail.body}</p>
              {detail.extra && (
                <p className="text-xs font-body text-muted-foreground/70 leading-relaxed italic border-t border-border pt-3">
                  {detail.extra}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-muted/30 px-5 py-3 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground/50 font-heading">1984: The Baseball Season</span>
              <button
                onClick={() => { setShowDetail(false); onDismiss(); }}
                className="text-[10px] font-heading text-primary hover:text-primary/80 transition-colors"
              >
                Back to the game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}