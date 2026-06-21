import React, { useState, useEffect, useRef } from 'react';
import { X, Zap } from 'lucide-react';
import { trackPeak1984View } from '@/lib/peak1984Popups';

export default function Peak1984Popup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    // Track view and unlock achievements
    const unlocked = trackPeak1984View(entry.id);
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

  const categoryColor = {
    video: '#06b6d4',    // cyan
    music: '#ec4899',    // pink
    tech: '#f59e0b',     // amber
    timeless: '#8b5cf6', // purple
  }[entry.category] || '#6366f1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Museum Exhibit Card */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 exhibit-frame"
        style={{ boxShadow: `0 0 50px ${categoryColor}44` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Museum Frame */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-3 border-8 border-amber-900 rounded-2xl">
          {/* Exhibit Header */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-slate-800 border-2 p-4 mb-3 exhibit-header" style={{ borderColor: categoryColor + '66' }}>
            {/* Museum label glow */}
            <div className="absolute inset-0 opacity-30 exhibit-glow" style={{ background: `radial-gradient(circle, ${categoryColor}33, transparent)` }} />

            {/* Header Content */}
            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl exhibit-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2
                    className="font-heading text-lg font-bold leading-tight exhibit-title"
                    style={{ color: categoryColor, textShadow: `0 0 12px ${categoryColor}66` }}
                  >
                    {entry.exhibit}
                  </h2>
                  <p className="text-xs font-body italic text-muted-foreground/70">{entry.year || '1984'}</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Tagline */}
            <p className="text-xs font-heading italic" style={{ color: categoryColor + 'cc' }}>
              {entry.tagline}
            </p>
          </div>

          {/* Exhibit Content */}
          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2" style={{ borderColor: categoryColor + '44' }}>
            {/* Museum glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-10 exhibit-glass" />

            {/* Content */}
            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto exhibit-scroll">
              {/* Description */}
              <p className="text-xs font-body text-foreground/85 leading-relaxed">
                {entry.description}
              </p>

              {/* Featured Items */}
              {entry.featured && entry.featured.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Featured Items
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.featured.map((item, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: categoryColor + '15', color: categoryColor }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Models */}
              {entry.models && entry.models.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Popular Models
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.models.map((model, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: categoryColor + '15', color: categoryColor }}>
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uses */}
              {entry.uses && entry.uses.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Usage Contexts
                  </div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.uses.map((use, i) => (
                      <li key={i}>• {use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sections */}
              {entry.sections && entry.sections.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Browse
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.sections.map((section, i) => (
                      <span key={i} className="text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: categoryColor + '15', color: categoryColor }}>
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {entry.benefits && entry.benefits.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Benefits
                  </div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.benefits.map((benefit, i) => (
                      <li key={i}>• {benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Predictions */}
              {entry.predictions && entry.predictions.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Predictions
                  </div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.predictions.map((pred, i) => (
                      <li key={i}>• {pred}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Innovation Items */}
              {entry.innovations && entry.innovations.length > 0 && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                    Recent Innovations
                  </div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.innovations.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trend or Feature */}
              {(entry.trend || entry.features || entry.examples) && (
                <div className="space-y-1 border-t border-slate-700/50 pt-2">
                  {entry.trend && (
                    <div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        Trend
                      </div>
                      <p className="text-[9px] text-foreground/75">{entry.trend}</p>
                    </div>
                  )}
                  {entry.features && (
                    <div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        Features
                      </div>
                      <ul className="text-[9px] text-foreground/75 space-y-0.5">
                        {entry.features.map((feat, i) => (
                          <li key={i}>• {feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.examples && (
                    <div>
                      <div className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        Examples
                      </div>
                      <p className="text-[9px] text-foreground/75">{entry.examples.join(', ')}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Warnings/Notes */}
              {(entry.warning || entry.difficulty || entry.reception) && (
                <div className="p-2 rounded" style={{ backgroundColor: categoryColor + '10', borderLeft: `3px solid ${categoryColor}` }}>
                  {entry.warning && (
                    <p className="text-[9px] font-heading text-foreground/80">{entry.warning}</p>
                  )}
                  {entry.difficulty && (
                    <p className="text-[9px] font-heading text-foreground/80">Difficulty: {entry.difficulty}</p>
                  )}
                  {entry.reception && (
                    <p className="text-[9px] font-heading text-foreground/80">Reception: {entry.reception}</p>
                  )}
                </div>
              )}

              {/* Price or Status */}
              {(entry.price || entry.status || entry.constant) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-700/50 pt-2">
                  {entry.price && (
                    <div>
                      <div className="font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        Price
                      </div>
                      <p className="text-foreground/75">{entry.price}</p>
                    </div>
                  )}
                  {entry.status && (
                    <div>
                      <div className="font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        Status
                      </div>
                      <p className="text-foreground/75">{entry.status}</p>
                    </div>
                  )}
                  {entry.constant && (
                    <div className="col-span-2">
                      <div className="font-heading font-bold uppercase tracking-wider" style={{ color: categoryColor }}>
                        The Constant
                      </div>
                      <p className="text-foreground/75">{entry.constant}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border" style={{ borderColor: categoryColor + '33', backgroundColor: categoryColor + '08' }}>
                  <div className="text-[9px] font-heading font-bold uppercase tracking-wider mb-0.5" style={{ color: categoryColor }}>
                    💡 Museum Label
                  </div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}

              {/* Quote */}
              {entry.quote && (
                <div className="p-2 rounded bg-slate-900/50 border-l-2" style={{ borderColor: categoryColor }}>
                  <p className="text-[10px] font-heading italic text-center" style={{ color: categoryColor + 'dd' }}>
                    "{entry.quote}"
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider" style={{ borderColor: categoryColor + '22' }}>
              <span>Exhibit • 1984</span>
              <button
                onClick={handleDismiss}
                className="text-[8px] text-muted-foreground hover:text-foreground transition-colors"
              >
                close exhibit
              </button>
            </div>
          </div>

          {/* Museum Placard Badge */}
          <div className="mt-2 flex justify-center">
            <Zap className="w-4 h-4" style={{ color: categoryColor, filter: `drop-shadow(0 0 8px ${categoryColor}66)` }} className="exhibit-spark" />
          </div>
        </div>

        {/* Styles */}
        <style>{`
          .exhibit-frame { position: relative; }
          .exhibit-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .exhibit-pulse { animation: exhibitPulse 3s ease-in-out infinite; }
          .exhibit-title { text-shadow: 0 0 12px currentColor; animation: exhibitTitle 2s ease-in-out infinite; }
          .exhibit-spark { animation: exhibitSpark 2s ease-in-out infinite; }
          .exhibit-scroll::-webkit-scrollbar { width: 4px; }
          .exhibit-scroll::-webkit-scrollbar-track { background: transparent; }
          .exhibit-scroll::-webkit-scrollbar-thumb { background: rgba(148, 163, 184, 0.2); border-radius: 2px; }

          @keyframes exhibitPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes exhibitTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes exhibitSpark {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
          }
        `}</style>
      </div>
    </div>
  );
}