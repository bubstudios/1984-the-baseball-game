import React, { useState, useEffect, useRef } from 'react';
import { X, Film } from 'lucide-react';
import { trackFilmDevelopmentCamerasView } from '@/lib/filmDevelopmentCamerasPopups';

export default function FilmDevelopmentCamerasPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackFilmDevelopmentCamerasView(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 film-frame"
        style={{ boxShadow: '0 0 60px #a855f744' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-purple-950 to-slate-900 p-3 border-8 border-purple-800 rounded-2xl">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-purple-950 border-2 border-purple-600/66 p-4 mb-3 film-header">
            <div className="absolute inset-0 opacity-30 film-glow" style={{ background: 'radial-gradient(circle, #a855f755, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl film-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight film-title" style={{ color: '#d8b4fe', textShadow: '0 0 12px #a855f766' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-purple-300/80">{entry.tagline}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-purple-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 film-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto film-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Stats grid */}
              {(entry.available || entry.characteristic || entry.producer || entry.brand || entry.strength || entry.appeal || entry.feature || entry.use || entry.technology || entry.advantage || entry.drawback || entry.cost || entry.impact || entry.perception || entry.type || entry.purpose || entry.tools || entry.durability || entry.appeal || entry.timeline || entry.advancement || entry.risk || entry.format || entry.adoption || entry.balance || entry.market_condition || entry.competition || entry.perspective || entry.archival_life || entry.content || entry.influence || entry.masters || entry.legacy || entry.significance) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-purple-600/30 pt-2">
                  {entry.available && <div><div className="font-heading font-bold text-purple-400">Available</div><p className="text-foreground/75">{entry.available}</p></div>}
                  {entry.characteristic && <div><div className="font-heading font-bold text-purple-400">Characteristic</div><p className="text-foreground/75">{entry.characteristic}</p></div>}
                  {entry.producer && <div><div className="font-heading font-bold text-purple-400">Producer</div><p className="text-foreground/75">{entry.producer}</p></div>}
                  {entry.brand && <div><div className="font-heading font-bold text-purple-400">Brand</div><p className="text-foreground/75">{entry.brand}</p></div>}
                  {entry.strength && <div><div className="font-heading font-bold text-purple-400">Strength</div><p className="text-foreground/75">{entry.strength}</p></div>}
                  {entry.appeal && <div><div className="font-heading font-bold text-purple-400">Appeal</div><p className="text-foreground/75">{entry.appeal}</p></div>}
                  {entry.feature && <div><div className="font-heading font-bold text-purple-400">Feature</div><p className="text-foreground/75">{entry.feature}</p></div>}
                  {entry.use && <div><div className="font-heading font-bold text-purple-400">Use</div><p className="text-foreground/75">{entry.use}</p></div>}
                  {entry.technology && <div><div className="font-heading font-bold text-purple-400">Technology</div><p className="text-foreground/75">{entry.technology}</p></div>}
                  {entry.advantage && <div><div className="font-heading font-bold text-purple-400">Advantage</div><p className="text-foreground/75">{entry.advantage}</p></div>}
                  {entry.drawback && <div><div className="font-heading font-bold text-purple-400">Drawback</div><p className="text-foreground/75">{entry.drawback}</p></div>}
                  {entry.cost && <div><div className="font-heading font-bold text-purple-400">Cost</div><p className="text-foreground/75">{entry.cost}</p></div>}
                  {entry.impact && <div><div className="font-heading font-bold text-purple-400">Impact</div><p className="text-foreground/75">{entry.impact}</p></div>}
                  {entry.perception && <div><div className="font-heading font-bold text-purple-400">Perception</div><p className="text-foreground/75">{entry.perception}</p></div>}
                  {entry.timeline && <div><div className="font-heading font-bold text-purple-400">Timeline</div><p className="text-foreground/75">{entry.timeline}</p></div>}
                  {entry.advancement && <div><div className="font-heading font-bold text-purple-400">Advancement</div><p className="text-foreground/75">{entry.advancement}</p></div>}
                  {entry.risk && <div><div className="font-heading font-bold text-purple-400">Risk</div><p className="text-foreground/75">{entry.risk}</p></div>}
                  {entry.format && <div><div className="font-heading font-bold text-purple-400">Format</div><p className="text-foreground/75">{entry.format}</p></div>}
                  {entry.adoption && <div><div className="font-heading font-bold text-purple-400">Adoption</div><p className="text-foreground/75">{entry.adoption}</p></div>}
                  {entry.balance && <div><div className="font-heading font-bold text-purple-400">Balance</div><p className="text-foreground/75">{entry.balance}</p></div>}
                  {entry.archival_life && <div><div className="font-heading font-bold text-purple-400">Archival Life</div><p className="text-foreground/75">{entry.archival_life}</p></div>}
                  {entry.market_condition && <div><div className="font-heading font-bold text-purple-400">Market</div><p className="text-foreground/75">{entry.market_condition}</p></div>}
                  {entry.competition && <div><div className="font-heading font-bold text-purple-400">Competition</div><p className="text-foreground/75">{entry.competition}</p></div>}
                  {entry.perspective && <div><div className="font-heading font-bold text-purple-400">Perspective</div><p className="text-foreground/75">{entry.perspective}</p></div>}
                  {entry.durability && <div><div className="font-heading font-bold text-purple-400">Durability</div><p className="text-foreground/75">{entry.durability}</p></div>}
                  {entry.investment && <div><div className="font-heading font-bold text-purple-400">Investment</div><p className="text-foreground/75">{entry.investment}</p></div>}
                  {entry.influence && <div><div className="font-heading font-bold text-purple-400">Influence</div><p className="text-foreground/75">{entry.influence}</p></div>}
                  {entry.legacy && <div><div className="font-heading font-bold text-purple-400">Legacy</div><p className="text-foreground/75">{entry.legacy}</p></div>}
                  {entry.significance && <div><div className="font-heading font-bold text-purple-400">Significance</div><p className="text-foreground/75">{entry.significance}</p></div>}
                </div>
              )}

              {/* Lists */}
              {entry.premium_brands && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Premium Brands</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.premium_brands.map((b, i) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
              )}
              {entry.famous_fast_films && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Famous Fast Films</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.famous_fast_films.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.uses && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Uses</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.uses.map((u, i) => <li key={i}>• {u}</li>)}
                  </ul>
                </div>
              )}
              {entry.types && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Types</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.types.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
              )}
              {entry.titles && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Magazines</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.titles.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
              )}
              {entry.content && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Content</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.content.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.masters && (
                <div className="space-y-1 border-t border-purple-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-purple-400">Masters</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.masters.map((m, i) => <li key={i}>• {m}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-purple-600/33 bg-purple-600/08">
                  <div className="text-[9px] font-heading font-bold text-purple-400 mb-0.5">📸 Photo Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-purple-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Film Development & Cameras</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Film className="w-4 h-4 text-purple-400 film-icon" style={{ filter: 'drop-shadow(0 0 8px #a855f766)' }} />
          </div>
        </div>

        <style>{`
          .film-frame { position: relative; }
          .film-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .film-pulse { animation: filmPulse 3s ease-in-out infinite; }
          .film-title { text-shadow: 0 0 12px currentColor; animation: filmTitle 2s ease-in-out infinite; }
          .film-icon { animation: filmIcon 2s ease-in-out infinite; }
          .film-scroll::-webkit-scrollbar { width: 4px; }
          .film-scroll::-webkit-scrollbar-track { background: transparent; }
          .film-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 2px; }

          @keyframes filmPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes filmTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes filmIcon {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(-8deg); }
          }
        `}</style>
      </div>
    </div>
  );
}