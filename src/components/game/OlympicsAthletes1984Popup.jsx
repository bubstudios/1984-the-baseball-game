import React, { useState, useEffect, useRef } from 'react';
import { X, Star } from 'lucide-react';
import { trackOlympicsAthletes1984View } from '@/lib/olympicsAthletes1984Popups';

export default function OlympicsAthletes1984Popup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackOlympicsAthletes1984View(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 athlete-frame"
        style={{ boxShadow: '0 0 60px #06b6d466' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 p-3 border-8 border-cyan-700 rounded-2xl">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-slate-800 border-2 border-cyan-600/66 p-4 mb-3 athlete-header">
            <div className="absolute inset-0 opacity-30 athlete-glow" style={{ background: 'radial-gradient(circle, #06b6d455, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl athlete-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight athlete-title" style={{ color: '#06b6d4', textShadow: '0 0 12px #06b6d466' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.sport && <p className="text-xs font-body italic text-muted-foreground/70">{entry.sport}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-cyan-300/80">{entry.tagline}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-cyan-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 athlete-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto athlete-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Achievement badge */}
              {entry.achievement && (
                <div className="p-2 rounded bg-cyan-600/15 border border-cyan-600/40">
                  <div className="text-[9px] font-heading font-bold text-cyan-400 mb-0.5">🏆 Achievement</div>
                  <p className="text-[9px] text-foreground/75">{entry.achievement}</p>
                </div>
              )}

              {/* Stats grid */}
              {(entry.medals || entry.goldMedals || entry.totalMedals || entry.viewers || entry.capacity) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-cyan-600/30 pt-2">
                  {entry.medals && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Medals</div>
                      <p className="text-foreground/75">{entry.medals}</p>
                    </div>
                  )}
                  {entry.goldMedals && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Gold Medals</div>
                      <p className="text-foreground/75">{entry.goldMedals}</p>
                    </div>
                  )}
                  {entry.totalMedals && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Total Medals</div>
                      <p className="text-foreground/75">{entry.totalMedals}</p>
                    </div>
                  )}
                  {entry.viewers && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Viewers</div>
                      <p className="text-foreground/75">{entry.viewers}</p>
                    </div>
                  )}
                  {entry.capacity && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Capacity</div>
                      <p className="text-foreground/75">{entry.capacity}</p>
                    </div>
                  )}
                  {entry.winStreak && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Streak</div>
                      <p className="text-foreground/75">{entry.winStreak}</p>
                    </div>
                  )}
                  {entry.ranking && (
                    <div>
                      <div className="font-heading font-bold text-cyan-400">Ranking</div>
                      <p className="text-foreground/75">{entry.ranking}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Stars list */}
              {entry.stars && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Team Stars</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.stars.map((star, i) => <li key={i}>• {star}</li>)}
                  </ul>
                </div>
              )}

              {/* Additional info */}
              {(entry.hometown || entry.college || entry.team || entry.venue || entry.records || entry.story) && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  {entry.hometown && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Hometown:</span> {entry.hometown}</div>}
                  {entry.college && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">College:</span> {entry.college}</div>}
                  {entry.team && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Team:</span> {entry.team}</div>}
                  {entry.venue && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Venue:</span> {entry.venue}</div>}
                  {entry.records && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Records:</span> {entry.records}</div>}
                  {entry.story && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Story:</span> {entry.story}</div>}
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-cyan-600/33 bg-cyan-600/08">
                  <div className="text-[9px] font-heading font-bold text-cyan-400 mb-0.5">⭐ Olympic Legend</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-cyan-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>1984 LA Olympic Star</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Star className="w-4 h-4 text-cyan-400 athlete-star" style={{ filter: 'drop-shadow(0 0 8px #06b6d466)' }} />
          </div>
        </div>

        <style>{`
          .athlete-frame { position: relative; }
          .athlete-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .athlete-pulse { animation: athletePulse 3s ease-in-out infinite; }
          .athlete-title { text-shadow: 0 0 12px currentColor; animation: athleteTitle 2s ease-in-out infinite; }
          .athlete-star { animation: athleteStar 2s ease-in-out infinite; }
          .athlete-scroll::-webkit-scrollbar { width: 4px; }
          .athlete-scroll::-webkit-scrollbar-track { background: transparent; }
          .athlete-scroll::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 2px; }

          @keyframes athletePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes athleteTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes athleteStar {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    </div>
  );
}