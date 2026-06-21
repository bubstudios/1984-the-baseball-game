import React, { useState, useEffect, useRef } from 'react';
import { X, Phone } from 'lucide-react';
import { trackLongDistancePhoneWarsView } from '@/lib/longDistancePhoneWarsPopups';

export default function LongDistancePhoneWarsPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackLongDistancePhoneWarsView(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 phone-frame"
        style={{ boxShadow: '0 0 60px #3b82f644' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-blue-950 to-slate-900 p-3 border-8 border-blue-800 rounded-2xl">
          {/* Header — telecom masthead style */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-blue-950 border-2 border-blue-600/66 p-4 mb-3 phone-header">
            <div className="absolute inset-0 opacity-30 phone-glow" style={{ background: 'radial-gradient(circle, #3b82f655, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl phone-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight phone-title" style={{ color: '#60a5fa', textShadow: '0 0 12px #3b82f666' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-blue-300/80">{entry.tagline}</p>
          </div>

          {/* Content */}
          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-blue-600/44">
            <div className="pointer-events-none absolute inset-0 z-10 phone-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto phone-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Stats grid */}
              {(entry.date || entry.role || entry.network || entry.slogan || entry.campaign || entry.innovation || entry.code || entry.technology || entry.designer || entry.meaning || entry.behavior || entry.practice || entry.full || entry.format) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-blue-600/30 pt-2">
                  {entry.date && <div><div className="font-heading font-bold text-blue-400">Date</div><p className="text-foreground/75">{entry.date}</p></div>}
                  {entry.role && <div><div className="font-heading font-bold text-blue-400">Role</div><p className="text-foreground/75">{entry.role}</p></div>}
                  {entry.network && <div><div className="font-heading font-bold text-blue-400">Network</div><p className="text-foreground/75">{entry.network}</p></div>}
                  {entry.slogan && <div><div className="font-heading font-bold text-blue-400">Slogan</div><p className="text-foreground/75">{entry.slogan}</p></div>}
                  {entry.campaign && <div><div className="font-heading font-bold text-blue-400">Campaign</div><p className="text-foreground/75">{entry.campaign}</p></div>}
                  {entry.innovation && <div><div className="font-heading font-bold text-blue-400">Innovation</div><p className="text-foreground/75">{entry.innovation}</p></div>}
                  {entry.code && <div><div className="font-heading font-bold text-blue-400">Code</div><p className="text-foreground/75">{entry.code}</p></div>}
                  {entry.technology && <div><div className="font-heading font-bold text-blue-400">Technology</div><p className="text-foreground/75">{entry.technology}</p></div>}
                  {entry.designer && <div><div className="font-heading font-bold text-blue-400">Designer</div><p className="text-foreground/75">{entry.designer}</p></div>}
                  {entry.meaning && <div><div className="font-heading font-bold text-blue-400">Meaning</div><p className="text-foreground/75">{entry.meaning}</p></div>}
                  {entry.behavior && <div><div className="font-heading font-bold text-blue-400">Behavior</div><p className="text-foreground/75">{entry.behavior}</p></div>}
                  {entry.practice && <div><div className="font-heading font-bold text-blue-400">Practice</div><p className="text-foreground/75">{entry.practice}</p></div>}
                  {entry.full && <div><div className="font-heading font-bold text-blue-400">Full Name</div><p className="text-foreground/75">{entry.full}</p></div>}
                  {entry.format && <div><div className="font-heading font-bold text-blue-400">Format</div><p className="text-foreground/75">{entry.format}</p></div>}
                </div>
              )}

              {/* Additional details */}
              {(entry.significance || entry.result || entry.strategy || entry.purpose || entry.effect || entry.message || entry.before || entry.after || entry.features || entry.users || entry.process || entry.popularWith || entry.services || entry.trend || entry.locations || entry.localCall || entry.benefit || entry.advantage || entry.nickname || entry.symbol || entry.legacy || entry.sentiment || entry.fear || entry.growth || entry.callers || entry.status || entry.count || entry.capacity || entry.benefits || entry.lesson) && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  {entry.significance && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Significance:</span> {entry.significance}</div>}
                  {entry.result && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Result:</span> {entry.result}</div>}
                  {entry.strategy && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Strategy:</span> {entry.strategy}</div>}
                  {entry.purpose && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Purpose:</span> {entry.purpose}</div>}
                  {entry.effect && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Effect:</span> {entry.effect}</div>}
                  {entry.message && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Message:</span> {entry.message}</div>}
                  {entry.before && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Before:</span> {entry.before}</div>}
                  {entry.after && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">After:</span> {entry.after}</div>}
                  {entry.users && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Users:</span> {entry.users}</div>}
                  {entry.process && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Process:</span> {entry.process}</div>}
                  {entry.popularWith && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Popular With:</span> {entry.popularWith}</div>}
                  {entry.trend && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Trend:</span> {entry.trend}</div>}
                  {entry.localCall && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Local Call:</span> {entry.localCall}</div>}
                  {entry.benefit && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Benefit:</span> {entry.benefit}</div>}
                  {entry.advantage && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Advantage:</span> {entry.advantage}</div>}
                  {entry.nickname && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Nickname:</span> {entry.nickname}</div>}
                  {entry.symbol && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Symbol:</span> {entry.symbol}</div>}
                  {entry.legacy && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Legacy:</span> {entry.legacy}</div>}
                  {entry.sentiment && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Sentiment:</span> {entry.sentiment}</div>}
                  {entry.fear && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Fear:</span> {entry.fear}</div>}
                  {entry.growth && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Growth:</span> {entry.growth}</div>}
                  {entry.callers && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Callers:</span> {entry.callers}</div>}
                  {entry.status && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Status:</span> {entry.status}</div>}
                  {entry.count && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Count:</span> {entry.count}</div>}
                  {entry.capacity && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Capacity:</span> {entry.capacity}</div>}
                  {entry.lesson && <div className="text-[9px]"><span className="font-heading font-bold text-blue-400">Lesson:</span> {entry.lesson}</div>}
                </div>
              )}

              {/* Lists */}
              {entry.companies && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-blue-400">Baby Bells</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.companies.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.services && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-blue-400">Services</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.services.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {entry.locations && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-blue-400">Locations</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.locations.map((l, i) => <li key={i}>• {l}</li>)}
                  </ul>
                </div>
              )}
              {entry.benefits && (
                <div className="space-y-1 border-t border-blue-600/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-blue-400">Benefits</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.benefits.map((b, i) => <li key={i}>• {b}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-blue-600/33 bg-blue-600/08">
                  <div className="text-[9px] font-heading font-bold text-blue-400 mb-0.5">📞 Phone Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-blue-600/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Long-Distance Phone Wars</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Phone className="w-4 h-4 text-blue-400 phone-icon" style={{ filter: 'drop-shadow(0 0 8px #3b82f666)' }} />
          </div>
        </div>

        <style>{`
          .phone-frame { position: relative; }
          .phone-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .phone-pulse { animation: phonePulse 3s ease-in-out infinite; }
          .phone-title { text-shadow: 0 0 12px currentColor; animation: phoneTitle 2s ease-in-out infinite; }
          .phone-icon { animation: phoneIcon 2s ease-in-out infinite; }
          .phone-scroll::-webkit-scrollbar { width: 4px; }
          .phone-scroll::-webkit-scrollbar-track { background: transparent; }
          .phone-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 2px; }

          @keyframes phonePulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes phoneTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes phoneIcon {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(-8deg); }
          }
        `}</style>
      </div>
    </div>
  );
}