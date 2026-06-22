import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Persistent storage key for Phillies bobblehead collection
const BOBBLEHEAD_KEY = 'phi_bobblehead_collection';

function getCollected() {
  try { return JSON.parse(localStorage.getItem(BOBBLEHEAD_KEY) || '[]'); } catch { return []; }
}
function saveCollected(arr) {
  localStorage.setItem(BOBBLEHEAD_KEY, JSON.stringify(arr));
}

export default function PhilliesBannerPopup({ entry, onDismiss, onAchievement, trackView }) {
  const [viewed, setViewed] = useState(false);
  const [bobblehead, setBobblehead] = useState(null);
  const [collected, setCollected] = useState([]);

  useEffect(() => {
    if (entry.isRotation && entry.rotation) {
      const stored = getCollected();
      setCollected(stored);
      // Pick a random bobblehead from the rotation
      const pick = entry.rotation[Math.floor(Math.random() * entry.rotation.length)];
      setBobblehead(pick);

      // Award it to collection
      if (!stored.includes(pick.player)) {
        const updated = [...stored, pick.player];
        saveCollected(updated);
        setCollected(updated);

        // Achievement: collect all 5
        if (updated.length === 5) {
          const achKey = 'ach_phi_all_bobbleheads';
          if (!localStorage.getItem(achKey)) {
            localStorage.setItem(achKey, Date.now());
            if (onAchievement) onAchievement(['phi_all_bobbleheads']);
          }
        }
      }
    }

    if (!viewed && trackView) {
      const unlocked = trackView(entry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setViewed(true);
    }
  }, []);

  const allCollected = collected.length >= (entry.rotation?.length || 5);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ background: `linear-gradient(135deg, ${entry.color}22 0%, #1a1a2e 100%)`, border: `2px solid ${entry.color}60` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4" style={{ background: `${entry.color}30`, borderBottom: `1px solid ${entry.color}40` }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{bobblehead ? bobblehead.icon : entry.icon}</span>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-tight">
                  {bobblehead ? `${bobblehead.player} Bobblehead!` : entry.title}
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className="text-[10px] font-heading font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${entry.color}40`, color: '#ffffff', border: `1px solid ${entry.color}60` }}
                  >
                    ⚾ PHILLIES
                  </span>
                  <span className="text-[10px] font-heading text-white/50">Veterans Stadium · 1984</span>
                </div>
              </div>
            </div>
            <button onClick={onDismiss} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[55vh] overflow-y-auto">
          {bobblehead ? (
            <>
              {/* New/duplicate badge */}
              <div className="mb-3">
                {!collected.includes(bobblehead.player) ? (
                  <span className="text-xs font-heading font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-1">
                    🆕 New Addition to Your Collection!
                  </span>
                ) : (
                  <span className="text-xs font-heading text-muted-foreground bg-muted/30 rounded-full px-3 py-1">
                    Already in your collection — duplicate!
                  </span>
                )}
              </div>
              <pre className="text-xs text-white/80 font-body whitespace-pre-wrap leading-relaxed">
                {bobblehead.body}
              </pre>
            </>
          ) : (
            <pre className="text-xs text-white/80 font-body whitespace-pre-wrap leading-relaxed">
              {entry.body}
            </pre>
          )}
        </div>

        {/* Collection progress */}
        {entry.isRotation && (
          <div
            className="px-5 py-2.5"
            style={{ background: `${entry.color}15`, borderTop: `1px solid ${entry.color}25` }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-heading text-white/50 uppercase tracking-wider">
                Collection Progress
              </span>
              <span className="text-[10px] font-heading font-bold text-amber-400">
                {Math.min(collected.length, entry.rotation?.length || 5)}/{entry.rotation?.length || 5}
              </span>
            </div>
            <div className="flex gap-1">
              {(entry.rotation || []).map((r, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ background: collected.includes(r.player) ? entry.color : `${entry.color}30` }}
                  title={r.player}
                />
              ))}
            </div>
            {allCollected && (
              <div className="mt-1.5 text-center">
                <span className="text-[11px] font-heading font-bold text-amber-400">
                  🏆 Complete Set! All 5 Phillies Bobbleheads Collected!
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div
          className="px-5 py-2 flex justify-between items-center"
          style={{ background: `${entry.color}10`, borderTop: `1px solid ${entry.color}20` }}
        >
          <span className="text-[9px] text-white/40 font-heading uppercase tracking-wider">Philadelphia Phillies · 1984</span>
          <button onClick={onDismiss} className="text-[10px] font-heading text-white/50 hover:text-white transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}