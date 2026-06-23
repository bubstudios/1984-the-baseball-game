import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trackMoreObscureTvView3 } from '@/lib/moreObscureTvPopups3';

function getSeenPanels(achievementKey) {
  try { return JSON.parse(localStorage.getItem(achievementKey + '_seen') || '[]'); } catch { return []; }
}
function saveSeenPanels(achievementKey, arr) {
  localStorage.setItem(achievementKey + '_seen', JSON.stringify(arr));
}

export default function MoreObscureTvPopup3({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [seenPanels, setSeenPanels] = useState([]);
  const [currentPanel, setCurrentPanel] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!entry) return;

    // Handle rotation entries (like St. Elsewhere 5-parter)
    if (entry.isRotation && entry.rotation?.length > 0) {
      const stored = getSeenPanels(entry.achievementKey || entry.id);
      setSeenPanels(stored);

      // Pick a random unseen panel first; if all seen, pick random
      const unseen = entry.rotation.filter(p => !stored.includes(p.id));
      const pick = unseen.length > 0
        ? unseen[Math.floor(Math.random() * unseen.length)]
        : entry.rotation[Math.floor(Math.random() * entry.rotation.length)];

      setCurrentPanel(pick);

      if (!stored.includes(pick.id)) {
        const updated = [...stored, pick.id];
        saveSeenPanels(entry.achievementKey || entry.id, updated);
        setSeenPanels(updated);

        // Achievement when all panels seen
        if (updated.length >= entry.rotation.length && entry.achievementKey) {
          if (!localStorage.getItem(entry.achievementKey)) {
            localStorage.setItem(entry.achievementKey, Date.now());
            if (onAchievement) onAchievement([entry.achievementId || entry.achievementKey]);
          }
        }
      }
    }

    // Standard view tracking
    if (entry.id) {
      const unlocked = trackMoreObscureTvView3(entry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    }
  }, [entry?.id]);

  if (!entry) return null;

  const isRotation = entry.isRotation && entry.rotation?.length > 0;
  const totalPanels = entry.rotation?.length || 0;
  const seenCount = Math.min(seenPanels.length, totalPanels);
  const allSeen = seenCount >= totalPanels;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={isRotation ? { borderColor: entry.color + '60' } : {}}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="border-b px-5 py-4"
          style={{ background: isRotation ? entry.color + '22' : '#0d0d1a', borderColor: isRotation ? entry.color + '40' : 'rgba(245,158,11,0.2)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{(isRotation && currentPanel) ? currentPanel.icon : entry.icon}</span>
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">
                  {isRotation && currentPanel ? `${entry.title} — ${currentPanel.label}` : entry.title}
                </h2>
                {entry.network && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: entry.color + '22', color: entry.color }}
                    >
                      {entry.network}
                    </span>
                    {entry.time && (
                      <span className="text-[9px] text-muted-foreground/50 font-heading">{entry.time}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            <button onClick={onDismiss} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-96 overflow-y-auto space-y-3">
          {isRotation && currentPanel && !seenPanels.includes(currentPanel.id) && (
            <div className="mb-2">
              <span className="text-xs font-heading font-bold text-amber-400 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-1">
                🆕 New Entry Unlocked!
              </span>
            </div>
          )}
          <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-wrap">
            {isRotation && currentPanel ? currentPanel.body : entry.body}
          </p>
        </div>

        {/* Collection progress for rotation entries */}
        {isRotation && (
          <div
            className="px-5 py-2.5 border-t"
            style={{ background: entry.color + '15', borderColor: entry.color + '25' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-heading text-white/50 uppercase tracking-wider">
                TV Guide Progress
              </span>
              <span className="text-[10px] font-heading font-bold" style={{ color: entry.color }}>
                {seenCount}/{totalPanels} entries
              </span>
            </div>
            <div className="flex gap-1">
              {entry.rotation.map((panel, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full"
                  style={{ background: seenPanels.includes(panel.id) ? entry.color : entry.color + '30' }}
                  title={panel.label}
                />
              ))}
            </div>
            {allSeen && (
              <div className="mt-1.5 text-center">
                <span className="text-[11px] font-heading font-bold text-amber-400">
                  🏆 Complete! You've read the full St. Elsewhere TV Guide!
                </span>
              </div>
            )}
            {!allSeen && (
              <p className="text-[9px] text-white/30 font-heading mt-1 text-center">
                Click again later to unlock another entry
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t border-amber-500/10">
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">TV 1984</span>
          <button onClick={onDismiss} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}