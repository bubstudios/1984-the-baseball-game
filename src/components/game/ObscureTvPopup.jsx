import React, { useState, useEffect, useRef } from 'react';
import { X, Tv, Clock, User, Star } from 'lucide-react';

export default function ObscureTvPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
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

  const color = entry.networkColor || '#6366f1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — retro cancelled TV show aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 otv-tv-frame"
        style={{ boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Wood-grain TV bezel */}
        <div className="bg-gradient-to-b from-amber-950 to-amber-900 p-2.5">
          {/* Screen area */}
          <div
            className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border-2 otv-screen"
            style={{ borderColor: color + '44', boxShadow: `inset 0 0 30px ${color}22` }}
          >
            {/* TV static/snow animation */}
            <div className="pointer-events-none absolute inset-0 z-10 otv-static" />
            {/* Scanlines */}
            <div className="pointer-events-none absolute inset-0 z-20 otv-scanlines" />

            {/* CANCELLED stamp */}
            <div className="pointer-events-none absolute top-3 right-3 z-30 otv-cancelled-stamp">
              <span
                className="block text-[11px] font-heading font-bold uppercase tracking-wider px-2 py-1 rounded border-2 transform rotate-[-8deg]"
                style={{ color: color, borderColor: color + '88', backgroundColor: color + '11' }}
              >
                Cancelled
              </span>
            </div>

            {/* Header */}
            <div className="relative z-20 bg-[#050505] border-b px-4 py-3" style={{ borderColor: color + '22' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl otv-flicker" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                    {entry.icon}
                  </span>
                  <div>
                    <span
                      className="text-[9px] font-heading font-bold tracking-wider uppercase block otv-text-glow"
                      style={{ color }}
                    >
                      {entry.network}
                    </span>
                    <h2 className="font-heading text-base font-bold text-foreground leading-tight" style={{ textShadow: `0 0 6px ${color}55` }}>
                      {entry.show}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Time slot bar */}
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-heading">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {entry.day} • {entry.time}
                </span>
                <span style={{ color: color + '66' }}>|</span>
                <span className="flex items-center gap-1">
                  <Tv className="w-3 h-3" />
                  Obscure TV
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="relative z-20 px-4 py-3 max-h-[300px] overflow-y-auto otv-body-scroll">
              {/* Tagline */}
              <p
                className="text-xs font-heading font-bold italic mb-2 leading-relaxed"
                style={{ color }}
              >
                {entry.tagline}
              </p>

              {/* Description */}
              <p className="text-xs font-body text-foreground/85 leading-relaxed mb-3">
                {entry.description}
              </p>

              {/* Cast */}
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3 h-3" style={{ color }} />
                  <span className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color }}>
                    Starring
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {entry.cast.map((actor, i) => (
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

              {/* Fun Fact */}
              <div
                className="p-2 rounded-lg border mb-2"
                style={{ borderColor: color + '22', backgroundColor: color + '08' }}
              >
                <span className="text-[8px] font-heading font-bold uppercase tracking-wider block mb-1" style={{ color }}>
                  Fun Fact
                </span>
                <p className="text-[10px] font-body text-foreground/75 leading-relaxed">
                  {entry.funFact}
                </p>
              </div>

              {/* Quote */}
              {entry.quote && (
                <p className="text-[10px] font-heading italic text-center" style={{ color: color + 'cc' }}>
                  "{entry.quote}"
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-[#050505] px-4 py-2 flex justify-between items-center border-t" style={{ borderColor: color + '14' }}>
              <span className="text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
                TV Guide • 1984
              </span>
              <button
                onClick={handleDismiss}
                className="text-[9px] font-heading text-muted-foreground hover:text-foreground transition-colors"
              >
                tap to close
              </button>
            </div>
          </div>
        </div>

        {/* TV knobs (decorative) */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-amber-950">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-700/60" />
            <div className="w-2 h-2 rounded-full bg-amber-700/60" />
          </div>
          <span className="text-[7px] font-heading text-amber-700/60 uppercase tracking-widest">
            Color TV
          </span>
          <div className="w-3 h-3 rounded-full bg-amber-700/40" />
        </div>

        {/* Styles + animations */}
        <style>{`
          .otv-tv-frame { position: relative; }
          .otv-screen { position: relative; }
          .otv-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.12) 0px,
              rgba(0,0,0,0.12) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .otv-text-glow { text-shadow: 0 0 5px currentColor; }
          .otv-flicker { animation: otvFlicker 4s infinite; }
          .otv-cancelled-stamp { animation: otvStampIn 0.5s ease-out 0.3s both; }
          .otv-body-scroll::-webkit-scrollbar { width: 4px; }
          .otv-body-scroll::-webkit-scrollbar-track { background: transparent; }
          .otv-body-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

          /* TV static/snow */
          .otv-static {
            background-image:
              repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, transparent 1px, rgba(255,255,255,0.025) 2px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, rgba(255,255,255,0.015) 2px);
            animation: otvStaticShift 0.15s steps(4) infinite;
            opacity: 0.5;
          }
          @keyframes otvStaticShift {
            0% { background-position: 0 0; }
            25% { background-position: 3px 1px; }
            50% { background-position: -1px 2px; }
            75% { background-position: 2px -1px; }
            100% { background-position: 1px 3px; }
          }

          /* Flicker */
          @keyframes otvFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          /* Cancelled stamp entrance */
          @keyframes otvStampIn {
            0% { transform: scale(2) rotate(-20deg); opacity: 0; }
            100% { transform: scale(1) rotate(-8deg); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}