import React, { useState, useEffect } from 'react';
import { X, Radio } from 'lucide-react';
import { trackRedSoxBannerView } from '@/lib/redSoxBannerPopups';

export default function RedSoxBannerPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    if (!entry) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    // Pick a random rotation entry if this is a rotation popup
    if (entry.isRotation && entry.rotation) {
      setRotationIndex(Math.floor(Math.random() * entry.rotation.length));
    }
    // Track view and check achievements
    const unlocked = trackRedSoxBannerView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    return () => clearTimeout(showTimer);
  }, [entry]);

  if (!visible || !entry) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  const color = entry.color || '#bd3039';
  const isRotation = entry.isRotation && entry.rotation;
  const displayEntry = isRotation ? entry.rotation[rotationIndex] : entry;
  const displayTitle = isRotation ? `${entry.title} — ${displayEntry.player}` : entry.title;
  const displayBody = displayEntry.body || entry.body;
  const displayIcon = isRotation ? (displayEntry.icon || entry.icon) : entry.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — Fenway / Red Sox aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 sox-frame"
        style={{ boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Monster textured header */}
        <div className="bg-gradient-to-br from-[#0a3d0a] to-[#0d5c0d] p-2.5">
          {/* Screen area */}
          <div
            className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border-2 sox-screen"
            style={{ borderColor: color + '44', boxShadow: `inset 0 0 30px ${color}22` }}
          >
            {/* Scanlines */}
            <div className="pointer-events-none absolute inset-0 z-20 sox-scanlines" />

            {/* Header */}
            <div className="relative z-10 bg-[#050505] border-b px-4 py-3" style={{ borderColor: color + '22' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl sox-flicker" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                    {displayIcon}
                  </span>
                  <div>
                    <span
                      className="text-[9px] font-heading font-bold tracking-wider uppercase block sox-text-glow"
                      style={{ color }}
                    >
                      BOSTON RED SOX
                    </span>
                    <h2 className="font-heading text-base font-bold text-foreground leading-tight" style={{ textShadow: `0 0 6px ${color}55` }}>
                      {displayTitle}
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

              {/* BROADCAST badge */}
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 text-[8px] font-heading font-bold px-1.5 py-0.5 rounded sox-rec-blink"
                  style={{ backgroundColor: color + '22', color }}
                >
                  <Radio className="w-2.5 h-2.5" />
                  FENWAY BROADCAST
                </span>
                {isRotation && (
                  <span className="text-[8px] font-heading font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    ✦ BOBBLEHEAD NIGHT
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 px-4 py-3 max-h-[320px] overflow-y-auto sox-body-scroll">
              <p className="text-xs font-body text-foreground/90 leading-relaxed whitespace-pre-line">
                {displayBody}
              </p>

              {/* Rotation indicator */}
              {isRotation && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {entry.rotation.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === rotationIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-10 bg-[#050505] px-4 py-2 flex justify-between items-center border-t" style={{ borderColor: color + '14' }}>
              <span className="text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
                Fenway Park • 1984
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

        {/* Decorative footer — Green Monster bricks */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#0a3d0a]">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-700/60" />
            <div className="w-2 h-2 rounded-full bg-green-700/60" />
          </div>
          <span className="text-[7px] font-heading text-green-600/60 uppercase tracking-widest">
            Fenway Faithful
          </span>
          <div className="w-3 h-3 rounded-full bg-green-700/40" />
        </div>

        {/* Styles + animations */}
        <style>{`
          .sox-frame { position: relative; }
          .sox-screen { position: relative; }
          .sox-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.12) 0px,
              rgba(0,0,0,0.12) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .sox-text-glow { text-shadow: 0 0 5px currentColor; }
          .sox-flicker { animation: soxFlicker 4s infinite; }
          .sox-rec-blink { animation: soxRecBlink 1.5s steps(2) infinite; }
          .sox-body-scroll::-webkit-scrollbar { width: 4px; }
          .sox-body-scroll::-webkit-scrollbar-track { background: transparent; }
          .sox-body-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

          @keyframes soxFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          @keyframes soxRecBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.4; }
          }
        `}</style>
      </div>
    </div>
  );
}