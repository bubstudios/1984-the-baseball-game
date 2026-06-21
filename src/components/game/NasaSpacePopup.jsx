import React, { useState, useEffect, useRef } from 'react';
import { X, Rocket } from 'lucide-react';
import { trackNasaSpaceView } from '@/lib/nasaSpacePopups';

export default function NasaSpacePopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackNasaSpaceView(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 space-frame"
        style={{ boxShadow: '0 0 60px #0ea5e944' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-blue-950 to-slate-900 p-3 border-8 border-blue-700 rounded-2xl">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-blue-950 border-2 border-blue-600/66 p-4 mb-3 space-header">
            <div className="absolute inset-0 opacity-30 space-glow" style={{ background: 'radial-gradient(circle, #0ea5e955, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl space-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight space-title" style={{ color: '#0ea5e9', textShadow: '0 0 12px #0ea5e966' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-sky-300/80">{entry.tagline}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-blue-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 space-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto space-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Achievement badge */}
              {entry.achievement && (
                <div className="p-2 rounded bg-blue-600/15 border border-blue-600/40">
                  <div className="text-[9px] font-heading font-bold text-sky-400 mb-0.5">🚀 Achievement</div>
                  <p className="text-[9px] text-foreground/75">{entry.achievement}</p>
                </div>
              )}

              {/* Stats grid */}
              {(entry.viewers || entry.lunarTime || entry.height || entry.speed || entry.distance || entry.travelTime) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-blue-600/30 pt-2">
                  {entry.viewers && <div><div className="font-heading font-bold text-sky-400">Viewers</div><p className="text-foreground/75">{entry.viewers}</p></div>}
                  {entry.lunarTime && <div><div className="font-heading font-bold text-sky-400">Time</div><p className="text-foreground/75">{entry.lunarTime}</p></div>}
                  {entry.height && <div><div className="font-heading font-bold text-sky-400">Height</div><p className="text-foreground/75">{entry.height}</p></div>}
                  {entry.speed && <div><div className="font-heading font-bold text-sky-400">Speed</div><p className="text-foreground/75">{entry.speed}</p></div>}
                  {entry.distance && <div><div className="font-heading font-bold text-sky-400">Distance</div><p className="text-foreground/75">{entry.distance}</p></div>}
                  {entry.travelTime && <div><div className="font-heading font-bold text-sky-400">Travel Time</div><p className="text-foreground/75">{entry.travelTime}</p></div>}
                  {entry.period && <div><div className="font-heading font-bold text-sky-400">Orbit Period</div><p className="text-foreground/75">{entry.period}</p></div>}
                  {entry.mission && <div><div className="font-heading font-bold text-sky-400">Mission</div><p className="text-foreground/75">{entry.mission}</p></div>}
                </div>
              )}

              {/* Additional details */}
              {(entry.significance || entry.innovation || entry.capabilities || entry.missions || entry.background || entry.impact || entry.power || entry.location || entry.staff || entry.operation) && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  {entry.significance && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Significance:</span> {entry.significance}</div>}
                  {entry.innovation && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Innovation:</span> {entry.innovation}</div>}
                  {entry.capabilities && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Capabilities:</span> {entry.capabilities}</div>}
                  {entry.missions && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Missions:</span> {entry.missions}</div>}
                  {entry.background && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Background:</span> {entry.background}</div>}
                  {entry.impact && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Impact:</span> {entry.impact}</div>}
                  {entry.power && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Power:</span> {entry.power}</div>}
                  {entry.location && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Location:</span> {entry.location}</div>}
                  {entry.staff && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Staff:</span> {entry.staff}</div>}
                  {entry.operation && <div className="text-[9px]"><span className="font-heading font-bold text-sky-400">Operation:</span> {entry.operation}</div>}
                </div>
              )}

              {/* Lists */}
              {entry.achievements && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-sky-400">Achievements</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.achievements.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              )}
              {entry.functions && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-sky-400">Functions</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.functions.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.purposes && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-sky-400">Purposes</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.purposes.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-blue-600/33 bg-blue-600/08">
                  <div className="text-[9px] font-heading font-bold text-sky-400 mb-0.5">✨ Space Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-blue-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>NASA Space Exhibit</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Rocket className="w-4 h-4 text-sky-400 space-rocket" style={{ filter: 'drop-shadow(0 0 8px #0ea5e966)' }} />
          </div>
        </div>

        <style>{`
          .space-frame { position: relative; }
          .space-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .space-pulse { animation: spacePulse 3s ease-in-out infinite; }
          .space-title { text-shadow: 0 0 12px currentColor; animation: spaceTitle 2s ease-in-out infinite; }
          .space-rocket { animation: spaceRocket 2s ease-in-out infinite; }
          .space-scroll::-webkit-scrollbar { width: 4px; }
          .space-scroll::-webkit-scrollbar-track { background: transparent; }
          .space-scroll::-webkit-scrollbar-thumb { background: rgba(14, 165, 233, 0.2); border-radius: 2px; }

          @keyframes spacePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes spaceTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes spaceRocket {
            0%, 100% { opacity: 0.6; transform: scale(1) translateY(0); }
            50% { opacity: 1; transform: scale(1.2) translateY(-4px); }
          }
        `}</style>
      </div>
    </div>
  );
}