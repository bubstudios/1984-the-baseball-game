import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { trackMallCultureView } from '@/lib/mallCulturePopups';

export default function MallCulturePopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackMallCultureView(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 mall-frame"
        style={{ boxShadow: '0 0 60px #06b6d455' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-cyan-950 to-slate-900 p-3 border-8 border-cyan-700 rounded-2xl">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-cyan-950 border-2 border-cyan-600/66 p-4 mb-3 mall-header">
            <div className="absolute inset-0 opacity-30 mall-glow" style={{ background: 'radial-gradient(circle, #06b6d455, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl mall-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight mall-title" style={{ color: '#67e8f9', textShadow: '0 0 12px #06b6d466' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-cyan-300/80">{entry.tagline}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-cyan-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 mall-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto mall-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Stats grid */}
              {(entry.purpose || entry.function || entry.smell || entry.cost || entry.attire || entry.outcome || entry.items || entry.format || entry.condition || entry.activities || entry.options || entry.advantage || entry.time || entry.channels || entry.behavior || entry.setup || entry.ingredients || entry.reality || entry.fate || entry.payment || entry.knowledge || entry.risk || entry.collection || entry.equipment || entry.theme) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-cyan-600/30 pt-2">
                  {entry.purpose && <div><div className="font-heading font-bold text-cyan-400">Purpose</div><p className="text-foreground/75">{entry.purpose}</p></div>}
                  {entry.function && <div><div className="font-heading font-bold text-cyan-400">Function</div><p className="text-foreground/75">{entry.function}</p></div>}
                  {entry.smell && <div><div className="font-heading font-bold text-cyan-400">Smell</div><p className="text-foreground/75">{entry.smell}</p></div>}
                  {entry.cost && <div><div className="font-heading font-bold text-cyan-400">Cost</div><p className="text-foreground/75">{entry.cost}</p></div>}
                  {entry.outcome && <div><div className="font-heading font-bold text-cyan-400">Outcome</div><p className="text-foreground/75">{entry.outcome}</p></div>}
                  {entry.format && <div><div className="font-heading font-bold text-cyan-400">Format</div><p className="text-foreground/75">{entry.format}</p></div>}
                  {entry.condition && <div><div className="font-heading font-bold text-cyan-400">Condition</div><p className="text-foreground/75">{entry.condition}</p></div>}
                  {entry.time && <div><div className="font-heading font-bold text-cyan-400">Time</div><p className="text-foreground/75">{entry.time}</p></div>}
                  {entry.reality && <div><div className="font-heading font-bold text-cyan-400">Reality</div><p className="text-foreground/75">{entry.reality}</p></div>}
                  {entry.parking && <div><div className="font-heading font-bold text-cyan-400">Parking</div><p className="text-foreground/75">{entry.parking}</p></div>}
                  {entry.difficulty && <div><div className="font-heading font-bold text-cyan-400">Difficulty</div><p className="text-foreground/75">{entry.difficulty}</p></div>}
                  {entry.intention && <div><div className="font-heading font-bold text-cyan-400">Intention</div><p className="text-foreground/75">{entry.intention}</p></div>}
                  {entry.navigation && <div><div className="font-heading font-bold text-cyan-400">Navigation</div><p className="text-foreground/75">{entry.navigation}</p></div>}
                  {entry.disposal && <div><div className="font-heading font-bold text-cyan-400">Disposal</div><p className="text-foreground/75">{entry.disposal}</p></div>}
                  {entry.capacity && <div><div className="font-heading font-bold text-cyan-400">Capacity</div><p className="text-foreground/75">{entry.capacity}</p></div>}
                  {entry.marketing && <div><div className="font-heading font-bold text-cyan-400">Marketing</div><p className="text-foreground/75">{entry.marketing}</p></div>}
                  {entry.effect && <div><div className="font-heading font-bold text-cyan-400">Effect</div><p className="text-foreground/75">{entry.effect}</p></div>}
                  {entry.benefits && Array.isArray(entry.benefits) && <div><div className="font-heading font-bold text-cyan-400">Benefits</div><p className="text-foreground/75">{entry.benefits.join(', ')}</p></div>}
                </div>
              )}

              {/* Additional details */}
              {(entry.advantage || entry.appeal || entry.motivation || entry.status || entry.staff || entry.gravity || entry.catchphrase || entry.currency || entry.mystery) && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  {entry.advantage && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Advantage:</span> {entry.advantage}</div>}
                  {entry.appeal && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Appeal:</span> {entry.appeal}</div>}
                  {entry.motivation && Array.isArray(entry.motivation) && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Motivation:</span> {entry.motivation.join(', ')}</div>}
                  {entry.status && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Status:</span> {entry.status}</div>}
                  {entry.staff && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Staff:</span> {entry.staff}</div>}
                  {entry.gravity && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Gravity:</span> {entry.gravity}</div>}
                  {entry.catchphrase && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Catchphrase:</span> {entry.catchphrase}</div>}
                  {entry.currency && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Currency:</span> {entry.currency}</div>}
                  {entry.mystery && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Mystery:</span> {entry.mystery}</div>}
                  {entry.challenge && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Challenge:</span> {entry.challenge}</div>}
                  {entry.sampling && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Sampling:</span> {entry.sampling}</div>}
                  {entry.presentation && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Presentation:</span> {entry.presentation}</div>}
                  {entry.range && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Range:</span> {entry.range}</div>}
                  {entry.drawback && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Drawback:</span> {entry.drawback}</div>}
                  {entry.refrain && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Refrain:</span> {entry.refrain}</div>}
                  {entry.response && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Response:</span> {entry.response}</div>}
                  {entry.selection_criteria && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Selection:</span> {entry.selection_criteria}</div>}
                  {entry.panic && <div className="text-[9px]"><span className="font-heading font-bold text-cyan-400">Panic:</span> {entry.panic}</div>}
                </div>
              )}

              {/* Lists */}
              {entry.options && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Options</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.options.map((o, i) => <li key={i}>• {o}</li>)}
                  </ul>
                </div>
              )}
              {entry.items && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Items</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.items.map((i, idx) => <li key={idx}>• {i}</li>)}
                  </ul>
                </div>
              )}
              {entry.games && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Games</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.games.map((g, i) => <li key={i}>• {g}</li>)}
                  </ul>
                </div>
              )}
              {entry.activities && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Activities</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.activities.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              )}
              {entry.formats && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Formats</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.formats.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.chains && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Chains</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.chains.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.attire && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Attire</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.attire.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              )}
              {entry.decorations && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Decorations</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.decorations.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
              {entry.occupants && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Occupants</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.occupants.map((o, i) => <li key={i}>• {o}</li>)}
                  </ul>
                </div>
              )}
              {entry.products && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Products</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.products.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
              )}
              {entry.saturday_routine && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Saturday Routine</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.saturday_routine.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {entry.watches_for && (
                <div className="space-y-1 border-t border-cyan-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-cyan-400">Watches For</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.watches_for.map((w, i) => <li key={i}>• {w}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-cyan-600/33 bg-cyan-600/08">
                  <div className="text-[9px] font-heading font-bold text-cyan-400 mb-0.5">🛍️ Mall Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-cyan-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Mall Culture</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <ShoppingBag className="w-4 h-4 text-cyan-400 mall-icon" style={{ filter: 'drop-shadow(0 0 8px #06b6d466)' }} />
          </div>
        </div>

        <style>{`
          .mall-frame { position: relative; }
          .mall-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .mall-pulse { animation: mallPulse 3s ease-in-out infinite; }
          .mall-title { text-shadow: 0 0 12px currentColor; animation: mallTitle 2s ease-in-out infinite; }
          .mall-icon { animation: mallIcon 2s ease-in-out infinite; }
          .mall-scroll::-webkit-scrollbar { width: 4px; }
          .mall-scroll::-webkit-scrollbar-track { background: transparent; }
          .mall-scroll::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 2px; }

          @keyframes mallPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes mallTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes mallIcon {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(-8deg); }
          }
        `}</style>
      </div>
    </div>
  );
}