import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function PhilliesBannerPopup({ entry, onDismiss, onAchievement, trackView }) {
  const [viewed, setViewed] = useState(false);

  const handleView = () => {
    if (!viewed && trackView) {
      const unlocked = trackView(entry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setViewed(true);
    }
  };

  useEffect(() => {
    handleView();
  }, []);

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
              <span className="text-3xl">{entry.icon}</span>
              <div>
                <h2 className="font-heading text-lg font-bold text-white tracking-tight">{entry.title}</h2>
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
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          <pre className="text-xs text-white/80 font-body whitespace-pre-wrap leading-relaxed">
            {entry.body}
          </pre>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 flex justify-between items-center"
          style={{ background: `${entry.color}15`, borderTop: `1px solid ${entry.color}25` }}
        >
          <span className="text-[9px] text-white/40 font-heading uppercase tracking-wider">Philadelphia Phillies · 1984</span>
          <button
            onClick={onDismiss}
            className="text-[10px] font-heading text-white/50 hover:text-white transition-colors"
          >
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}