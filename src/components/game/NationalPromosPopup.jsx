import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function NationalPromosPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!entry || !visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  const bgColor = entry.color || '#8b5cf6';
  const bgColorLight = bgColor + '22';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border-2 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ borderColor: bgColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0d0d1a] border-b-2 px-5 py-4" style={{ borderColor: bgColor }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{entry.icon}</span>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground tracking-tight">{entry.title}</h2>
                <p className="text-xs font-heading uppercase tracking-widest mt-1" style={{ color: bgColor }}>
                  {entry.type?.replace(/_/g, ' ')} • 1984
                </p>
              </div>
            </div>
            <button onClick={handleDismiss} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded">
          <div className="space-y-4">
            <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-wrap">{entry.body}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0d0d1a] px-6 py-3 flex justify-between items-center border-t-2" style={{ borderColor: bgColor }}>
          <span className="text-[9px] font-heading font-bold tracking-wider uppercase" style={{ color: bgColor }}>
            {entry.type?.replace(/_/g, ' ')}
          </span>
          <button onClick={handleDismiss} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}