import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles } from 'lucide-react';
import { trackThingsThatScream1984View } from '@/lib/thingsThatScream1984Popups';

export default function ThingsThatScream1984Popup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const unlocked = trackThingsThatScream1984View(entry.id);
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
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 scream-frame"
        style={{ boxShadow: '0 0 60px #ec489944' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        <div className="bg-gradient-to-b from-pink-950 to-slate-900 p-3 border-8 border-pink-700 rounded-2xl">
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-950 to-pink-950 border-2 border-pink-500/66 p-4 mb-3 scream-header">
            <div className="absolute inset-0 opacity-30 scream-glow" style={{ background: 'radial-gradient(circle, #ec489955, transparent)' }} />

            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-5xl scream-pulse">{entry.icon}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-lg font-bold leading-tight scream-title" style={{ color: '#f9a8d4', textShadow: '0 0 12px #ec489966' }}>
                    {entry.exhibit}
                  </h2>
                  {entry.year && <p className="text-xs font-body italic text-muted-foreground/70">{entry.year}</p>}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs font-heading italic text-pink-300/80">{entry.tagline}</p>
          </div>

          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-pink-500/44">
            <div className="pointer-events-none absolute inset-0 z-10 scream-glass" />

            <div className="relative z-20 p-4 space-y-3 max-h-[420px] overflow-y-auto scream-scroll">
              <p className="text-xs font-body text-foreground/85 leading-relaxed">{entry.description}</p>

              {/* Stats grid */}
              {(entry.producer || entry.introduced || entry.inventor || entry.sold || entry.feature || entry.demand || entry.launched || entry.first_video || entry.price || entry.memory || entry.ghosts || entry.merchandise || entry.network || entry.premiered || entry.released || entry.director || entry.star || entry.album_released || entry.film_released || entry.chart_topped || entry.singles || entry.athletes || entry.nations || entry.date || entry.reagan_electoral || entry.brand || entry.mondale_electoral || entry.founded || entry.debuted || entry.origin || entry.milestone || entry.betamax || entry.vhs) && (
                <div className="grid grid-cols-2 gap-2 text-[9px] border-t border-pink-500/30 pt-2">
                  {entry.producer && <div><div className="font-heading font-bold text-pink-400">Producer</div><p className="text-foreground/75">{entry.producer}</p></div>}
                  {entry.introduced && <div><div className="font-heading font-bold text-pink-400">Introduced</div><p className="text-foreground/75">{entry.introduced}</p></div>}
                  {entry.inventor && <div><div className="font-heading font-bold text-pink-400">Inventor</div><p className="text-foreground/75">{entry.inventor}</p></div>}
                  {entry.sold && <div><div className="font-heading font-bold text-pink-400">Sold</div><p className="text-foreground/75">{entry.sold}</p></div>}
                  {entry.feature && <div><div className="font-heading font-bold text-pink-400">Feature</div><p className="text-foreground/75">{entry.feature}</p></div>}
                  {entry.demand && <div><div className="font-heading font-bold text-pink-400">Demand</div><p className="text-foreground/75">{entry.demand}</p></div>}
                  {entry.launched && <div><div className="font-heading font-bold text-pink-400">Launched</div><p className="text-foreground/75">{entry.launched}</p></div>}
                  {entry.first_video && <div><div className="font-heading font-bold text-pink-400">First Video</div><p className="text-foreground/75">{entry.first_video}</p></div>}
                  {entry.price && <div><div className="font-heading font-bold text-pink-400">Price</div><p className="text-foreground/75">{entry.price}</p></div>}
                  {entry.memory && <div><div className="font-heading font-bold text-pink-400">Memory</div><p className="text-foreground/75">{entry.memory}</p></div>}
                  {entry.network && <div><div className="font-heading font-bold text-pink-400">Network</div><p className="text-foreground/75">{entry.network}</p></div>}
                  {entry.premiered && <div><div className="font-heading font-bold text-pink-400">Premiered</div><p className="text-foreground/75">{entry.premiered}</p></div>}
                  {entry.released && <div><div className="font-heading font-bold text-pink-400">Released</div><p className="text-foreground/75">{entry.released}</p></div>}
                  {entry.director && <div><div className="font-heading font-bold text-pink-400">Director</div><p className="text-foreground/75">{entry.director}</p></div>}
                  {entry.star && <div><div className="font-heading font-bold text-pink-400">Star</div><p className="text-foreground/75">{entry.star}</p></div>}
                  {entry.album_released && <div><div className="font-heading font-bold text-pink-400">Album Released</div><p className="text-foreground/75">{entry.album_released}</p></div>}
                  {entry.film_released && <div><div className="font-heading font-bold text-pink-400">Film Released</div><p className="text-foreground/75">{entry.film_released}</p></div>}
                  {entry.chart_topped && <div><div className="font-heading font-bold text-pink-400">Chart Topped</div><p className="text-foreground/75">{entry.chart_topped}</p></div>}
                  {entry.singles && <div><div className="font-heading font-bold text-pink-400">Singles</div><p className="text-foreground/75">{entry.singles}</p></div>}
                  {entry.athletes && <div><div className="font-heading font-bold text-pink-400">Athletes</div><p className="text-foreground/75">{entry.athletes}</p></div>}
                  {entry.nations && <div><div className="font-heading font-bold text-pink-400">Nations</div><p className="text-foreground/75">{entry.nations}</p></div>}
                  {entry.date && <div><div className="font-heading font-bold text-pink-400">Date</div><p className="text-foreground/75">{entry.date}</p></div>}
                  {entry.reagan_electoral && <div><div className="font-heading font-bold text-pink-400">Reagan EV</div><p className="text-foreground/75">{entry.reagan_electoral}</p></div>}
                  {entry.mondale_electoral && <div><div className="font-heading font-bold text-pink-400">Mondale EV</div><p className="text-foreground/75">{entry.mondale_electoral}</p></div>}
                  {entry.brand && <div><div className="font-heading font-bold text-pink-400">Brand</div><p className="text-foreground/75">{entry.brand}</p></div>}
                  {entry.founded && <div><div className="font-heading font-bold text-pink-400">Founded</div><p className="text-foreground/75">{entry.founded}</p></div>}
                  {entry.debuted && <div><div className="font-heading font-bold text-pink-400">Debuted</div><p className="text-foreground/75">{entry.debuted}</p></div>}
                  {entry.origin && <div><div className="font-heading font-bold text-pink-400">Origin</div><p className="text-foreground/75">{entry.origin}</p></div>}
                  {entry.milestone && <div><div className="font-heading font-bold text-pink-400">Milestone</div><p className="text-foreground/75">{entry.milestone}</p></div>}
                  {entry.betamax && <div><div className="font-heading font-bold text-pink-400">Betamax</div><p className="text-foreground/75">{entry.betamax}</p></div>}
                  {entry.vhs && <div><div className="font-heading font-bold text-pink-400">VHS</div><p className="text-foreground/75">{entry.vhs}</p></div>}
                </div>
              )}

              {/* Additional details */}
              {(entry.function || entry.impact || entry.behavior || entry.perception || entry.style || entry.stars || entry.moves || entry.movies || entry.equipment || entry.earnings || entry.count || entry.factions || entry.catchphrase || entry.sold || entry.misconception || entry.top_singles || entry.usa_gold || entry.usa_total || entry.phrase || entry.political_use || entry.family || entry.parents || entry.winner || entry.risk || entry.advantages || entry.drawbacks || entry.features || entry.trend || entry.appeal || entry.popularized_by || entry.paired_with || entry.strategy || entry.techniques || entry.participants || entry.gender || entry.obstacle) && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  {entry.function && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Function:</span> {entry.function}</div>}
                  {entry.impact && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Impact:</span> {entry.impact}</div>}
                  {entry.behavior && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Behavior:</span> {entry.behavior}</div>}
                  {entry.perception && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Perception:</span> {entry.perception}</div>}
                  {entry.style && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Style:</span> {entry.style}</div>}
                  {entry.earnings && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Earnings:</span> {entry.earnings}</div>}
                  {entry.count && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Count:</span> {entry.count}</div>}
                  {entry.catchphrase && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Catchphrase:</span> {entry.catchphrase}</div>}
                  {entry.misconception && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Misconception:</span> {entry.misconception}</div>}
                  {entry.top_singles && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Top Singles:</span> {entry.top_singles}</div>}
                  {entry.usa_gold && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">USA Gold:</span> {entry.usa_gold}</div>}
                  {entry.usa_total && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">USA Total:</span> {entry.usa_total}</div>}
                  {entry.phrase && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Phrase:</span> {entry.phrase}</div>}
                  {entry.political_use && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Political Use:</span> {entry.political_use}</div>}
                  {entry.family && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Family:</span> {entry.family}</div>}
                  {entry.parents && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Parents:</span> {entry.parents}</div>}
                  {entry.winner && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Winner:</span> {entry.winner}</div>}
                  {entry.risk && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Risk:</span> {entry.risk}</div>}
                  {entry.trend && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Trend:</span> {entry.trend}</div>}
                  {entry.appeal && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Appeal:</span> {entry.appeal}</div>}
                  {entry.popularized_by && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Popularized By:</span> {entry.popularized_by}</div>}
                  {entry.strategy && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Strategy:</span> {entry.strategy}</div>}
                  {entry.gender && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Gender:</span> {entry.gender}</div>}
                  {entry.obstacle && <div className="text-[9px]"><span className="font-heading font-bold text-pink-400">Obstacle:</span> {entry.obstacle}</div>}
                </div>
              )}

              {/* Lists */}
              {entry.features && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Features</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.features.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.ghosts && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Ghosts</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.ghosts.map((g, i) => <li key={i}>• {g}</li>)}
                  </ul>
                </div>
              )}
              {entry.categories && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Categories</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.categories.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.stars && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Stars</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.stars.map((s, i) => <li key={i}>• {s}</li>)}
                  </ul>
                </div>
              )}
              {entry.moves && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Moves</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.moves.map((m, i) => <li key={i}>• {m}</li>)}
                  </ul>
                </div>
              )}
              {entry.movies && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Movies</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.movies.map((m, i) => <li key={i}>• {m}</li>)}
                  </ul>
                </div>
              )}
              {entry.factions && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Factions</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.factions.map((f, i) => <li key={i}>• {f}</li>)}
                  </ul>
                </div>
              )}
              {entry.characters && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Characters</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.characters.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.cast && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Cast</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.cast.map((c, i) => <li key={i}>• {c}</li>)}
                  </ul>
                </div>
              )}
              {entry.hits && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Hits</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.hits.map((h, i) => <li key={i}>• {h}</li>)}
                  </ul>
                </div>
              )}
              {entry.iconic_looks && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Iconic Looks</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.iconic_looks.map((l, i) => <li key={i}>• {l}</li>)}
                  </ul>
                </div>
              )}
              {entry.advantages && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Advantages</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.advantages.map((a, i) => <li key={i}>• {a}</li>)}
                  </ul>
                </div>
              )}
              {entry.drawbacks && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Drawbacks</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.drawbacks.map((d, i) => <li key={i}>• {d}</li>)}
                  </ul>
                </div>
              )}
              {entry.paired_with && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Paired With</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.paired_with.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
              )}
              {entry.techniques && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Techniques</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.techniques.map((t, i) => <li key={i}>• {t}</li>)}
                  </ul>
                </div>
              )}
              {entry.participants && (
                <div className="space-y-1 border-t border-pink-500/30 pt-2">
                  <div className="text-[9px] font-heading font-bold text-pink-400">Participants</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.participants.map((p, i) => <li key={i}>• {p}</li>)}
                  </ul>
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border border-pink-500/33 bg-pink-500/08">
                  <div className="text-[9px] font-heading font-bold text-pink-400 mb-0.5">✨ 1984 Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed italic">{entry.funFact}</p>
                </div>
              )}
            </div>

            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-pink-500/22 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Things That Scream 1984</span>
              <button onClick={handleDismiss} className="text-[8px] text-muted-foreground hover:text-foreground transition-colors">close</button>
            </div>
          </div>

          <div className="mt-2 flex justify-center">
            <Sparkles className="w-4 h-4 text-pink-400 scream-icon" style={{ filter: 'drop-shadow(0 0 8px #ec489966)' }} />
          </div>
        </div>

        <style>{`
          .scream-frame { position: relative; }
          .scream-glass { background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%); }
          .scream-pulse { animation: screamPulse 3s ease-in-out infinite; }
          .scream-title { text-shadow: 0 0 12px currentColor; animation: screamTitle 2s ease-in-out infinite; }
          .scream-icon { animation: screamIcon 2s ease-in-out infinite; }
          .scream-scroll::-webkit-scrollbar { width: 4px; }
          .scream-scroll::-webkit-scrollbar-track { background: transparent; }
          .scream-scroll::-webkit-scrollbar-thumb { background: rgba(236, 72, 153, 0.2); border-radius: 2px; }

          @keyframes screamPulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }

          @keyframes screamTitle {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes screamIcon {
            0%, 100% { opacity: 0.6; transform: scale(1) rotate(0deg); }
            50% { opacity: 1; transform: scale(1.2) rotate(-8deg); }
          }
        `}</style>
      </div>
    </div>
  );
}