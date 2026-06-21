import React, { useState, useEffect, useRef } from 'react';
import { X, Newspaper } from 'lucide-react';
import { trackNewspapersClassifiedsView } from '@/lib/newspapersClassifiedsPopups';

export default function NewspapersClassifiedsPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackNewspapersClassifiedsView(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 news-frame"
        style={{ boxShadow: '0 0 60px #94a3b844' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-slate-100 to-slate-200 p-3 border-8 border-slate-700 rounded-2xl">
          {/* Header — newspaper masthead style */}
          <div className="relative rounded-lg overflow-hidden bg-slate-50 border-2 border-slate-800/66 p-4 mb-3 news-header">
            <div className="absolute inset-0 opacity-20 news-glow" style={{ background: 'radial-gradient(circle, #94a3b855, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl news-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight news-title" style={{ color: '#1e293b', textShadow: '0 0 12px #94a3b866' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-slate-600">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-slate-700">{entry.tagline}</p>
          </div>

          {/* Content — newsprint style */}
          <div className="relative rounded-lg overflow-hidden bg-[#f5f5f0] border-2 border-slate-800/44">
            <div className="pointer-events-none absolute inset-0 z-10 news-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto news-scroll">
              <p className="text-xs font-body text-slate-900/85 leading-relaxed">{entry.description}</p>

              {/* Price badge */}
              {entry.price && (
                <div className="p-2 rounded bg-slate-800/10 border border-slate-800/30">
                  <div className="text-[9px] font-heading font-bold text-slate-700 mb-0.5">💰 Price</div>
                  <p className="text-[9px] text-slate-800">{entry.price}</p>
                </div>
              )}

              {/* Stats grid */}
              {(entry.founded || entry.circulation || entry.acreage || entry.originalCost || entry.pages) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-slate-800/30 pt-2">
                  {entry.founded && <div><div className="font-heading font-bold text-slate-700">Founded</div><p className="text-slate-800">{entry.founded}</p></div>}
                  {entry.circulation && <div><div className="font-heading font-bold text-slate-700">Circulation</div><p className="text-slate-800">{entry.circulation}</p></div>}
                  {entry.acreage && <div><div className="font-heading font-bold text-slate-700">Acreage</div><p className="text-slate-800">{entry.acreage}</p></div>}
                  {entry.originalCost && <div><div className="font-heading font-bold text-slate-700">Original Cost</div><p className="text-slate-800">{entry.originalCost}</p></div>}
                  {entry.pages && <div><div className="font-heading font-bold text-slate-700">First Edition</div><p className="text-slate-800">{entry.pages}</p></div>}
                </div>
              )}

              {/* Additional details */}
              {(entry.reputation || entry.famousFor || entry.specialty || entry.distinctive || entry.coverage || entry.callLetters || entry.sportsFocus || entry.innovation || entry.dilemma || entry.advice || entry.impact) && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  {entry.reputation && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Reputation:</span> <span className="text-slate-800">{entry.reputation}</span></div>}
                  {entry.famousFor && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Famous For:</span> <span className="text-slate-800">{entry.famousFor}</span></div>}
                  {entry.specialty && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Specialty:</span> <span className="text-slate-800">{entry.specialty}</span></div>}
                  {entry.distinctive && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Distinctive:</span> <span className="text-slate-800">{entry.distinctive}</span></div>}
                  {entry.coverage && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Coverage:</span> <span className="text-slate-800">{entry.coverage}</span></div>}
                  {entry.callLetters && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Call Letters:</span> <span className="text-slate-800">{entry.callLetters}</span></div>}
                  {entry.sportsFocus && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Sports Focus:</span> <span className="text-slate-800">{entry.sportsFocus}</span></div>}
                  {entry.innovation && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Innovation:</span> <span className="text-slate-800">{entry.innovation}</span></div>}
                  {entry.dilemma && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Dilemma:</span> <span className="text-slate-800">{entry.dilemma}</span></div>}
                  {entry.advice && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Advice:</span> <span className="text-slate-800">{entry.advice}</span></div>}
                  {entry.impact && <div className="text-[9px]"><span className="font-heading font-bold text-slate-700">Impact:</span> <span className="text-slate-800">{entry.impact}</span></div>}
                </div>
              )}

              {/* Lists */}
              {entry.sections && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Sections</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.sections.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {entry.listings && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Listings</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.listings.map((l, i) => <li key={i}>• {l}</li>)}
                  </ul>
                </div>
              )}
              {entry.features && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Features</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.businesses && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Businesses</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.businesses.map((b, i) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
              )}
              {entry.delivered && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Delivered</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.delivered.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
              {entry.uses && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Uses</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.uses.map((u, i) => <li key={i}>• {u}</li>)}
                  </ul>
                </div>
              )}
              {entry.redFlags && (
                <div className="space-y-1 border-t border-slate-800/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-slate-700">Red Flags</div>
                  <ul className="text-[9px] text-slate-800 space-y-0.5">
                    {entry.redFlags.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-slate-800/33 bg-slate-800/08">
                  <div className="text-[9px] font-heading font-bold text-slate-700 mb-0.5">📰 News Fact</div>
                  <p className="text-[9px] text-slate-800 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-slate-200 px-4 py-1.5 flex justify-between items-center border-t border-slate-800/22 text-[8px] text-slate-600 font-heading uppercase tracking-wider">
              <span>Newspaper & Classified Exhibit</span>
              <button onClick={handleDismiss} className="text-[8px] text-slate-600 hover:text-slate-900 transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Newspaper className="w-4 h-4 text-slate-700 news-icon" style={{ filter: 'drop-shadow(0 0 8px #94a3b866)' }} />
          </div>
        </div>

        <style>{`
          .news-frame { position: relative; }
          .news-glass { background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%); }
          .news-pulse { animation: newsPulse 3s ease-in-out infinite; }
          .news-title { text-shadow: 0 0 12px currentColor; animation: newsTitle 2s ease-in-out infinite; }
          .news-icon { animation: newsIcon 2s ease-in-out infinite; }
          .news-scroll::-webkit-scrollbar { width: 4px; }
          .news-scroll::-webkit-scrollbar-track { background: transparent; }
          .news-scroll::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 2px; }

          @keyframes newsPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes newsTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes newsIcon {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(-5deg); }
          }
        `}</style>
      </div>
    </div>
  );
}