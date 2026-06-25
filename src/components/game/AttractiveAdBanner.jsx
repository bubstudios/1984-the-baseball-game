import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AttractiveAdBanner({ entry, onDismiss, onClick }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = (e) => {
    e?.stopPropagation();
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  const handleClick = () => {
    if (onClick) onClick();
  };

  if (!visible) return null;

  // Determine accent color based on type
  const accentColors = {
    sponsor: 'border-amber-600/40',
    charity: 'border-emerald-600/40',
    service: 'border-blue-600/40',
    broadcast: 'border-amber-600/40',
  };

  const accentColor = accentColors[entry.type] || 'border-amber-600/40';

  return (
    <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div
        onClick={handleClick}
        className={`w-full bg-background/80 backdrop-blur border-2 ${accentColor} rounded-2xl px-6 py-5 text-center transition-all hover:bg-background/95 hover:border-amber-600/60 active:scale-95 group cursor-pointer relative`}
      >
        {/* Label/Category */}
        {entry.label && (
          <div className="flex items-center justify-center gap-2 mb-2">
            {entry.icon && <span className="text-lg animate-bounce">{entry.icon}</span>}
            <span className="font-heading text-xs uppercase tracking-widest text-amber-600/70 group-hover:text-amber-500 transition-colors">
              {entry.label}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-foreground mb-2 leading-tight">
          {entry.title}
        </h3>

        {/* Description/Subtitle */}
        {entry.description && (
          <p className="text-sm text-muted-foreground mb-3">{entry.description}</p>
        )}

        {/* CTA */}
        <p className="text-xs text-muted-foreground/60 font-body italic">tap for details</p>

        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss(e);
          }}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors z-10"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}