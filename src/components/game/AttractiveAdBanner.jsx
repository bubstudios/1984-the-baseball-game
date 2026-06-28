import React, { useState, useEffect } from 'react';

export default function AttractiveAdBanner({ banner, onTap, autoHideMs = 12000, onHide }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoHideMs) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onHide) onHide();
    }, autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  if (!isVisible) return null;

  return (
    <div
      onClick={onTap}
      className="fixed bottom-24 md:bottom-4 right-4 z-40 w-72 bg-card/95 backdrop-blur rounded-xl p-3 shadow-xl cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 border border-primary/30 animate-in slide-in-from-bottom-4 fade-in"
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] font-heading uppercase tracking-[0.15em] text-muted-foreground/50">Sponsored</span>
      </div>
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{banner.icon || '📺'}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-primary text-sm truncate">
            {banner.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {banner.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-1.5 text-[10px] text-primary/60 font-heading">
        Tap to explore →
      </div>
    </div>
  );
}