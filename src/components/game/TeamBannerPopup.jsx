import React, { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

const ROTATION_STATE_KEY = 'bb84_bobblehead_rotation';

function getNextRotationIndex(entryId, total) {
  try {
    const raw = localStorage.getItem(ROTATION_STATE_KEY);
    const state = raw ? JSON.parse(raw) : {};
    const current = state[entryId] || 0;
    const next = (current + 1) % total;
    state[entryId] = next;
    localStorage.setItem(ROTATION_STATE_KEY, JSON.stringify(state));
    return current;
  } catch (e) {
    return 0;
  }
}

export default function TeamBannerPopup({ entry, teamColor, teamIcon, onDismiss, onAchievement, trackView }) {
  const [visible, setVisible] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);

  useEffect(() => {
    if (!entry) return;
    if (entry.isRotation && entry.rotation) {
      setRotationIndex(getNextRotationIndex(entry.id, entry.rotation.length));
    }
    const timer = setTimeout(() => setVisible(true), 80);
    if (trackView) {
      const unlocked = trackView(entry.id);
      if (unlocked?.length > 0 && onAchievement) onAchievement(unlocked);
    }
    return () => clearTimeout(timer);
  }, [entry]);

  if (!entry || !visible) return null;

  const isPoster = entry.category === 'poster';
  const isBobblehead = entry.isRotation && entry.rotation;
  const rotation = isBobblehead ? entry.rotation[rotationIndex] : null;

  const accentColor = teamColor || '#c9a84c';
  const icon = teamIcon || '⚾';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onDismiss}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ backgroundColor: '#1a1a2e', border: `2px solid ${accentColor}55` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ backgroundColor: accentColor + '22', borderBottom: `1px solid ${accentColor}33` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isBobblehead ? (rotation?.icon || icon) : icon}</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">
                {entry.title}
              </h2>
              <p className="text-[10px] font-heading uppercase tracking-wider mt-0.5"
                style={{ color: accentColor }}>
                {isBobblehead ? `Tonight's Player: ${rotation?.player}` : entry.category}
              </p>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {isPoster ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5" style={{ color: accentColor }} />
                <span className="font-heading text-sm font-bold text-foreground">Congratulations!</span>
              </div>
              <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-line">
                {entry.body}
              </p>
            </div>
          ) : isBobblehead && rotation ? (
            <div className="space-y-3">
              <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-line">
                {rotation.body}
              </p>
              <div
                className="text-[10px] font-heading uppercase tracking-wider text-center py-1.5 rounded-lg mt-2"
                style={{ backgroundColor: accentColor + '22', color: accentColor }}
              >
                {rotationIndex + 1} of {entry.rotation.length} — Collect all {entry.rotation.length}!
              </div>
            </div>
          ) : (
            <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-line">
              {entry.body}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 flex justify-between items-center"
          style={{ backgroundColor: '#0d0d1a', borderTop: `1px solid ${accentColor}22` }}
        >
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">
            {isPoster ? '🖼️ Poster Giveaway' : '🎯 Bobblehead Night'} • 1984
          </span>
          <button
            onClick={onDismiss}
            className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}