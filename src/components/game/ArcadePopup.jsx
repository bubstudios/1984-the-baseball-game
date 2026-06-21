import React, { useState, useEffect, useRef } from 'react';
import { X, Zap, TrendingUp } from 'lucide-react';
import { trackArcadeView } from '@/lib/arcadePopups';

export default function ArcadePopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    // Track view and unlock achievements
    const unlocked = trackArcadeView(entry.id);
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

  const arcadeColor = entry.type === 'arcade' ? '#fbbf24' : entry.type === 'home' ? '#60a5fa' : '#a78bfa';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Arcade Cabinet Frame */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 arcade-cabinet"
        style={{ boxShadow: `0 0 40px ${arcadeColor}44` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Outer Cabinet Frame (3D effect) */}
        <div
          className="border-4 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-2"
          style={{ borderColor: arcadeColor + '88' }}
        >
          {/* Inner Screen Bezel */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-3 arcade-screen-bezel">
            {/* CRT Screen */}
            <div
              className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border-2 arcade-screen"
              style={{ borderColor: arcadeColor + '44' }}
            >
              {/* Scanlines */}
              <div className="pointer-events-none absolute inset-0 z-10 arcade-scanlines" />

              {/* Content */}
              <div className="relative z-20 p-4 space-y-3">
                {/* Type Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl arcade-flicker">{entry.icon}</span>
                    <div>
                      <div
                        className="text-[10px] font-heading font-bold tracking-widest uppercase arcade-text-glow"
                        style={{ color: arcadeColor }}
                      >
                        {entry.type.toUpperCase()}
                      </div>
                      <div className="text-[9px] text-muted-foreground/60 font-heading">
                        {entry.publisher} • {entry.year}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Game Title */}
                <div className="border-t border-t-foreground/10 pt-2">
                  <h2
                    className="font-heading text-base font-bold leading-tight arcade-title-glow"
                    style={{ color: arcadeColor, textShadow: `0 0 8px ${arcadeColor}66` }}
                  >
                    {entry.game}
                  </h2>
                </div>

                {/* Tagline */}
                <p
                  className="text-xs font-heading italic"
                  style={{ color: arcadeColor + 'dd' }}
                >
                  {entry.tagline}
                </p>

                {/* Description */}
                <p className="text-xs font-body text-foreground/85 leading-relaxed">
                  {entry.description}
                </p>

                {/* Features */}
                {entry.features && entry.features.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: arcadeColor }}>
                      <Zap className="w-3 h-3" />
                      Features
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {entry.features.map((feat, i) => (
                        <div
                          key={i}
                          className="text-[9px] font-body px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: arcadeColor + '15', color: 'hsl(var(--foreground))' }}
                        >
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fun Fact */}
                <div
                  className="p-2 rounded-lg border text-[10px]"
                  style={{ borderColor: arcadeColor + '22', backgroundColor: arcadeColor + '08' }}
                >
                  <div className="font-heading font-bold mb-0.5" style={{ color: arcadeColor }}>
                    💡 Fun Fact
                  </div>
                  <p className="text-foreground/75 leading-relaxed">{entry.funFact}</p>
                </div>

                {/* High Score / Price */}
                {entry.highScore && (
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-foreground/5 border border-foreground/10">
                    <TrendingUp className="w-3.5 h-3.5" style={{ color: arcadeColor }} />
                    <span className="text-[9px] font-heading font-bold">
                      <span style={{ color: arcadeColor }}>HIGH SCORE:</span> {entry.highScore}
                    </span>
                  </div>
                )}

                {entry.price && (
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-foreground/5 border border-foreground/10">
                    <span className="text-sm">💰</span>
                    <span className="text-[9px] font-heading font-bold">
                      <span style={{ color: arcadeColor }}>Price:</span> {entry.price}
                    </span>
                  </div>
                )}

                {/* Quote */}
                <p className="text-[9px] font-heading italic text-center border-t border-t-foreground/10 pt-2" style={{ color: arcadeColor + 'cc' }}>
                  "{entry.quote}"
                </p>
              </div>

              {/* Footer */}
              <div className="relative z-20 bg-[#050505] px-3 py-1.5 flex justify-between items-center border-t border-foreground/10 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
                <span>INSERT COIN • 1984</span>
                <button
                  onClick={handleDismiss}
                  className="text-[8px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  tap to close
                </button>
              </div>
            </div>
          </div>

          {/* Control Panel (decorative) */}
          <div className="mt-3 mx-3 p-2 rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[7px] font-heading text-gray-600 uppercase tracking-widest">Arcade • Control</span>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500/60" />
                <div className="w-3 h-3 rounded-full bg-purple-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
          .arcade-cabinet { position: relative; }
          .arcade-screen { position: relative; }
          .arcade-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .arcade-text-glow { text-shadow: 0 0 8px currentColor; }
          .arcade-title-glow { text-shadow: 0 0 12px currentColor; }
          .arcade-flicker { animation: arcadeFlicker 4s infinite; }
          .arcade-screen-bezel { box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); }

          @keyframes arcadeFlicker {
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