import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trackMoreObscureTvView3 } from '@/lib/moreObscureTvPopups3';

export default function MoreObscureTvPopup3({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible && entry?.id) {
      const unlocked = trackMoreObscureTvView3(entry.id);
      if (unlocked.length > 0 && onAchievement) {
        onAchievement(unlocked);
      }
    }
  }, [visible, entry?.id, onAchievement]);

  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0d0d1a] border-b border-amber-500/20 px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{entry.icon}</span>
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">{entry.title}</h2>
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
          <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-wrap">{entry.body}</p>
        </div>

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