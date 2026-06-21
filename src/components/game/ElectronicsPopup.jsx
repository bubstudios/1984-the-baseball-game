import React, { useState, useEffect, useRef } from 'react';
import { X, Monitor, Radio } from 'lucide-react';

export default function ElectronicsPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry]);

  // Auto-dismiss after 10s if user hasn't interacted
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

  const color = entry.color || '#4ade80';
  const Icon = entry.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ borderColor: color + '4D' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Header */}
        <div className="bg-[#0d0d1a] border-b px-5 py-4" style={{ borderColor: color + '33' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{entry.icon}</span>
              <div>
                <span
                  className="text-[10px] font-heading font-bold tracking-wider uppercase"
                  style={{ color }}
                >
                  {entry.brand}
                </span>
                <h2 className="font-heading text-lg font-bold text-foreground">{entry.title}</h2>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-heading font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: color + '22', color }}
            >
              ELECTRONICS & COMPUTERS
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-line">
            {entry.body}
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t" style={{ borderColor: color + '1A' }}>
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">Radio Shack • 1984</span>
          <button
            onClick={handleDismiss}
            className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}