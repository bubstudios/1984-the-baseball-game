import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NationalCharityPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!entry) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry]);

  if (!visible || !entry) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss();
  };

  const color = entry.color || '#E81B23';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 mb-4 sm:mb-0 bg-gradient-to-b from-slate-900 to-slate-950 border-2 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ borderColor: color + '66', boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 border-b px-5 py-4" style={{ borderColor: color + '33' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{entry.icon}</span>
              <div>
                <span className="text-[10px] font-heading font-bold tracking-wider uppercase" style={{ color }}>
                  {entry.category}
                </span>
                <h2 className="font-heading text-xl font-bold text-foreground">{entry.title}</h2>
                <p className="text-[10px] text-muted-foreground/60 font-heading mt-0.5">{entry.organization}</p>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
          <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-wrap">{entry.body}</p>

          {/* History badge */}
          <div className="border-t border-muted/30 pt-3">
            <p className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground/70 mb-2">Historical Context</p>
            <p className="text-xs font-body text-muted-foreground/80 italic">{entry.history}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-3 border-t flex justify-between items-center" style={{ borderColor: color + '22' }}>
          <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground/50">
            {entry.logo} — 1984
          </span>
          <button onClick={handleDismiss} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}