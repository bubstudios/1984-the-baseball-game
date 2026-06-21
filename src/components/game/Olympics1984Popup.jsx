import React, { useState, useEffect, useRef } from 'react';
import { X, Award } from 'lucide-react';
import { trackOlympics1984View } from '@/lib/olympics1984Popups';

export default function Olympics1984Popup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackOlympics1984View(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry, onAchievement]);

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 olympic-frame"
        style={{ boxShadow: '0 0 60px #fbbf2466' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-3 border-8 border-yellow-700 rounded-2xl">
          {/* Header */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-slate-800 border-2 border-yellow-600/66 p-4 mb-3 olympic-header">
            <div className="absolute inset-0 opacity-30 olympic-glow" style={{ background: 'radial-gradient(circle, #fbbf2455, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl olympic-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2
                    className="font-heading text-lg font-bold leading-tight olympic-title"
                    style={{ color: '#fbbf24', textShadow: '0 0 12px #fbbf2466' }}
                  >
                    {entry.exhibit}
                  </h2>
                  <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-yellow-300/80">{entry.tagline}</p>
          </div>

          {/* Content */}
          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-yellow-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 olympic-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto olympic-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Info cards */}
              {(entry.significance || entry.expectation || entry.opportunity || entry.spectacle || entry.preparation || entry.merchandise || entry.dedication || entry.level) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-yellow-600/30 pt-2">
                  {entry.significance && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Significance</div>
                      <p className="text-foreground/75">{entry.significance}</p>
                    </div>
                  )}
                  {entry.expectation && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Expectation</div>
                      <p className="text-foreground/75">{entry.expectation}</p>
                    </div>
                  )}
                  {entry.opportunity && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Opportunity</div>
                      <p className="text-foreground/75">{entry.opportunity}</p>
                    </div>
                  )}
                  {entry.spectacle && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Spectacle</div>
                      <p className="text-foreground/75">{entry.spectacle}</p>
                    </div>
                  )}
                  {entry.preparation && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Preparation</div>
                      <p className="text-foreground/75">{entry.preparation}</p>
                    </div>
                  )}
                  {entry.merchandise && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Merchandise</div>
                      <p className="text-foreground/75">{entry.merchandise}</p>
                    </div>
                  )}
                  {entry.dedication && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Dedication</div>
                      <p className="text-foreground/75">{entry.dedication}</p>
                    </div>
                  )}
                  {entry.level && (
                    <div>
                      <div className="font-heading font-bold text-yellow-400">Level</div>
                      <p className="text-foreground/75">{entry.level}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Other attributes */}
              {(entry.access || entry.anticipation || entry.mood || entry.essence || entry.viewership || entry.readiness || entry.status || entry.construction || entry.expectation || entry.motivation || entry.spirit || entry.momentum || entry.promise || entry.imminence || entry.legacy) && (
                <div className="space-y-1 border-t border-yellow-600/30 pt-2">
                  {entry.access && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Access:</span> {entry.access}
                    </div>
                  )}
                  {entry.anticipation && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Anticipation:</span> {entry.anticipation}
                    </div>
                  )}
                  {entry.mood && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Mood:</span> {entry.mood}
                    </div>
                  )}
                  {entry.essence && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Essence:</span> {entry.essence}
                    </div>
                  )}
                  {entry.viewership && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Viewership:</span> {entry.viewership}
                    </div>
                  )}
                  {entry.readiness && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Readiness:</span> {entry.readiness}
                    </div>
                  )}
                  {entry.status && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Status:</span> {entry.status}
                    </div>
                  )}
                  {entry.construction && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Construction:</span> {entry.construction}
                    </div>
                  )}
                  {entry.motivation && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Motivation:</span> {entry.motivation}
                    </div>
                  )}
                  {entry.spirit && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Spirit:</span> {entry.spirit}
                    </div>
                  )}
                  {entry.momentum && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Momentum:</span> {entry.momentum}
                    </div>
                  )}
                  {entry.promise && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Promise:</span> {entry.promise}
                    </div>
                  )}
                  {entry.imminence && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Imminence:</span> {entry.imminence}
                    </div>
                  )}
                  {entry.legacy && (
                    <div className="text-[9px]">
                      <span className="font-heading font-bold text-yellow-400">Legacy:</span> {entry.legacy}
                    </div>
                  )}
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-yellow-600/33 bg-yellow-600/08">
                  <div className="text-[9px] font-heading font-bold text-yellow-400 mb-0.5">🏅 Olympic Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-yellow-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>1984 LA Olympics</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">
                close
              </button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Award className="w-4 h-4 text-yellow-400 olympic-medal" style={{ filter: 'drop-shadow(0 0 8px #fbbf2466)' }} />
          </div>
        </div>

        <style>{`
          .olympic-frame { position: relative; }
          .olympic-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .olympic-pulse { animation: olympicPulse 3s ease-in-out infinite; }
          .olympic-title { text-shadow: 0 0 12px currentColor; animation: olympicTitle 2s ease-in-out infinite; }
          .olympic-medal { animation: olympicMedal 2s ease-in-out infinite; }
          .olympic-scroll::-webkit-scrollbar { width: 4px; }
          .olympic-scroll::-webkit-scrollbar-track { background: transparent; }
          .olympic-scroll::-webkit-scrollbar-thumb { background: rgba(251, 191, 36, 0.2); border-radius: 2px; }

          @keyframes olympicPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes olympicTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes olympicMedal {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(10deg); }
          }
        `}</style>
      </div>
    </div>
  );
}