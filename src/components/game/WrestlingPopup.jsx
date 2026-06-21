import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, Award, Users } from 'lucide-react';
import { trackWrestlingView } from '@/lib/wrestlingPopups';

export default function WrestlingPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    // Track view and unlock achievements
    const unlocked = trackWrestlingView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry, onAchievement]);

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Wrestling Event Poster Frame */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 wrestling-poster"
        style={{ boxShadow: '0 0 40px rgba(239, 68, 68, 0.44)' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Poster Border (theater style) */}
        <div className="bg-gradient-to-b from-red-900 to-red-950 p-3 border-4 border-red-800 rounded-2xl">
          {/* Poster Content */}
          <div className="relative rounded-lg overflow-hidden bg-[#1a0f0f] border-2 border-red-900">
            {/* Scanlines for retro effect */}
            <div className="pointer-events-none absolute inset-0 z-10 wrestling-scanlines" />

            {/* Content */}
            <div className="relative z-20 p-5 space-y-3">
              {/* Icon & Title */}
              <div className="flex items-start gap-3">
                <span className="text-4xl wrestling-flicker">{entry.icon}</span>
                <div className="flex-1">
                  <h2
                    className="font-heading text-lg font-bold leading-tight wrestling-title-glow"
                    style={{ color: '#fca5a5', textShadow: '0 0 12px #dc262644' }}
                  >
                    {entry.title}
                  </h2>
                  <p className="text-xs font-heading italic text-red-400/80 mt-0.5">
                    {entry.wrestler}
                  </p>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Tagline */}
              <p className="text-xs font-heading italic text-red-300 border-t border-red-800/50 pt-2">
                "{entry.tagline}"
              </p>

              {/* Description */}
              <p className="text-xs font-body text-foreground/85 leading-relaxed">
                {entry.description}
              </p>

              {/* Stats (height/weight/finisher) */}
              {(entry.height || entry.weight || entry.finisher || entry.from) && (
                <div className="space-y-1.5 border-t border-red-800/50 pt-2">
                  {entry.height && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Height:</span> {entry.height}</div>}
                  {entry.weight && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Weight:</span> {entry.weight}</div>}
                  {entry.finisher && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Finisher:</span> {entry.finisher}</div>}
                  {entry.from && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">From:</span> {entry.from}</div>}
                  {entry.manager && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Manager:</span> {entry.manager}</div>}
                </div>
              )}

              {/* Featured List */}
              {entry.featured && entry.featured.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold text-red-400 uppercase tracking-wider">
                    <Users className="w-3 h-3" />
                    Featuring
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {entry.featured.map((name, i) => (
                      <div key={i} className="text-[9px] font-body px-1.5 py-0.5 rounded bg-red-900/30 text-red-100">
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Feats / Known For */}
              {(entry.feats || entry.known) && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold text-red-400 uppercase tracking-wider">
                    <Zap className="w-3 h-3" />
                    Known For
                  </div>
                  <div className="space-y-0.5">
                    {(entry.feats || entry.known).map((feat, i) => (
                      <div key={i} className="text-[9px] text-foreground/75">• {feat}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Details */}
              {(entry.date || entry.time || entry.venue) && (
                <div className="space-y-1 border-t border-red-800/50 pt-2">
                  {entry.date && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Date:</span> {entry.date}</div>}
                  {entry.time && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Time:</span> {entry.time}</div>}
                  {entry.venue && <div className="text-[9px] text-muted-foreground"><span className="text-red-400 font-bold">Venue:</span> {entry.venue}</div>}
                </div>
              )}

              {/* Tickets */}
              {entry.tickets && (
                <div className="space-y-1 p-2 rounded bg-red-900/20 border border-red-800/50">
                  <div className="text-[9px] font-heading font-bold text-red-400 uppercase tracking-wider">Tickets</div>
                  {Object.entries(entry.tickets).map(([type, price]) => (
                    <div key={type} className="text-[9px] text-foreground/75">
                      {type.charAt(0).toUpperCase() + type.slice(1)}: {price}
                    </div>
                  ))}
                </div>
              )}

              {/* Prize */}
              {entry.prize && (
                <div className="flex items-center gap-1.5 p-2 rounded bg-yellow-900/30 border border-yellow-700/50">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-[9px] font-heading font-bold text-yellow-300">Prize: {entry.prize}</span>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border bg-red-900/10 border-red-800/30">
                  <div className="text-[9px] font-heading font-bold text-red-400 mb-0.5">💡 Fun Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed">{entry.funFact}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-[#0a0505] px-4 py-1.5 flex justify-between items-center border-t border-red-800/30 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Wrestling • 1984</span>
              <button
                onClick={handleDismiss}
                className="text-[8px] text-muted-foreground hover:text-foreground transition-colors"
              >
                tap to close
              </button>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          .wrestling-poster { position: relative; }
          .wrestling-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .wrestling-title-glow { text-shadow: 0 0 12px currentColor; }
          .wrestling-flicker { animation: wrestlingFlicker 4s infinite; }

          @keyframes wrestlingFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }
        `}</style>
      </div>
    </div>
  );
}