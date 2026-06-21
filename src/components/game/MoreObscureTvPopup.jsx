import React, { useState, useEffect, useRef } from 'react';
import { X, Tv, Clock, Star, Film } from 'lucide-react';
import { trackMoreObscureTvView } from '@/lib/moreObscureTvPopups';

export default function MoreObscureTvPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    // 50% chance to show spotlight variant if available
    let showedSpotlight = false;
    if (entry.spotlight && Math.random() < 0.5) {
      setShowSpotlight(true);
      showedSpotlight = true;
    }
    // Track view and unlock achievements
    const unlocked = trackMoreObscureTvView(entry.id, showedSpotlight);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry]);

  // Auto-dismiss after 10s if user hasn't interacted
  useEffect(() => {
    if (!visible || userInteracted) return;
    autoDismissRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 10000);
    return () => clearTimeout(autoDismissRef.current);
  }, [visible, userInteracted, onDismiss]);

  if (!visible || !entry) return null;

  const handleInteract = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      clearTimeout(autoDismissRef.current);
    }
  };

  const handleDismiss = () => {
    clearTimeout(autoDismissRef.current);
    setVisible(false);
    onDismiss();
  };

  // Use spotlight data if showing spotlight variant
  const data = showSpotlight && entry.spotlight ? entry.spotlight : entry;
  const color = entry.networkColor || '#6366f1';
  const isSpecial = entry.type === 'special';
  const isSpotlight = entry.type === 'spotlight' || showSpotlight;
  const badgeText = isSpecial ? 'SPECIAL PRESENTATION' : isSpotlight ? 'SPOTLIGHT' : 'NOW SHOWING';
  const badgeIcon = isSpecial ? '🎬' : isSpotlight ? '⭐' : '📺';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — retro TV Guide magazine aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 motv-frame"
        style={{ boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* TV Guide-style header */}
        <div className="relative bg-[#0a0a0a] border-b" style={{ borderColor: color + '33' }}>
          {/* Subtle scanlines */}
          <div className="pointer-events-none absolute inset-0 z-10 motv-scanlines" />

          {/* Badge bar */}
          <div className="relative z-20 flex items-center justify-between px-4 pt-2.5 pb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{badgeIcon}</span>
              <span
                className="text-[8px] font-heading font-bold tracking-wider uppercase px-1.5 py-0.5 rounded motv-badge-glow"
                style={{ backgroundColor: color + '22', color }}
              >
                {badgeText}
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Show title + network */}
          <div className="relative z-20 px-4 pb-2.5">
            <div className="flex items-start gap-2">
              <span
                className="text-3xl motv-flicker shrink-0"
                style={{ filter: `drop-shadow(0 0 4px ${color})` }}
              >
                {data.icon || entry.icon}
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-heading text-base font-bold text-foreground leading-tight" style={{ textShadow: `0 0 6px ${color}55` }}>
                  {data.show || entry.show}
                </h2>
                <span
                  className="text-[9px] font-heading font-bold tracking-wider uppercase block mt-0.5 motv-text-glow"
                  style={{ color }}
                >
                  {entry.network}
                </span>
              </div>
            </div>

            {/* Time slot bar */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-heading mt-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {entry.day} • {entry.time}
              </span>
              <span style={{ color: color + '66' }}>|</span>
              <span className="flex items-center gap-1">
                <Tv className="w-3 h-3" />
                More Obscure TV
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative z-20 bg-[#050505] px-4 py-3 max-h-[300px] overflow-y-auto motv-body-scroll">
          {/* Tagline */}
          <p
            className="text-xs font-heading font-bold italic mb-2 leading-relaxed"
            style={{ color }}
          >
            {data.tagline}
          </p>

          {/* Description */}
          <p className="text-xs font-body text-foreground/85 leading-relaxed mb-3">
            {data.description}
          </p>

          {/* Cast */}
          {data.cast && data.cast.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Star className="w-3 h-3" style={{ color }} />
                <span className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color }}>
                  Starring
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {data.cast.map((actor, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-body px-2 py-0.5 rounded"
                    style={{ backgroundColor: color + '15', color: 'hsl(var(--foreground))' }}
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Fun Fact */}
          <div
            className="p-2 rounded-lg border mb-2"
            style={{ borderColor: color + '22', backgroundColor: color + '08' }}
          >
            <span className="text-[8px] font-heading font-bold uppercase tracking-wider block mb-1" style={{ color }}>
              Fun Fact
            </span>
            <p className="text-[10px] font-body text-foreground/75 leading-relaxed">
              {data.funFact}
            </p>
          </div>

          {/* Quote */}
          {data.quote && (
            <p className="text-[10px] font-heading italic text-center" style={{ color: color + 'cc' }}>
              "{data.quote}"
            </p>
          )}

          {/* Spotlight achievement notification */}
          {showSpotlight && entry.spotlight?.achievementId && (
            <div className="mt-2 p-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-center">
              <p className="text-[9px] font-heading font-bold text-amber-400">
                🏆 Achievement Unlocked: Bull Shannon Fan
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20 bg-[#050505] px-4 py-2 flex justify-between items-center border-t" style={{ borderColor: color + '14' }}>
          <span className="text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider flex items-center gap-1">
            {isSpecial ? <Film className="w-2.5 h-2.5" /> : <Tv className="w-2.5 h-2.5" />}
            TV Guide • 1984
          </span>
          <button
            onClick={handleDismiss}
            className="text-[9px] font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            tap to close
          </button>
        </div>

        {/* Styles + animations */}
        <style>{`
          .motv-frame { position: relative; }
          .motv-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.08) 0px,
              rgba(0,0,0,0.08) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .motv-text-glow { text-shadow: 0 0 5px currentColor; }
          .motv-badge-glow { animation: motvBadgeGlow 2s ease-in-out infinite; }
          .motv-flicker { animation: motvFlicker 4s infinite; }
          .motv-body-scroll::-webkit-scrollbar { width: 4px; }
          .motv-body-scroll::-webkit-scrollbar-track { background: transparent; }
          .motv-body-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

          @keyframes motvFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          @keyframes motvBadgeGlow {
            0%, 100% { opacity: 1; box-shadow: 0 0 4px currentColor; }
            50% { opacity: 0.7; box-shadow: 0 0 1px currentColor; }
          }
        `}</style>
      </div>
    </div>
  );
}