import React, { useState, useEffect } from 'react';

export default function AttractiveAdBanner({ banner, onTap, autoHideMs = 12000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!autoHideMs) return;
    const timer = setTimeout(() => setIsVisible(false), autoHideMs);
    return () => clearTimeout(timer);
  }, [autoHideMs]);

  if (!isVisible) return null;

  return (
    <div
      onClick={onTap}
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl p-4 shadow-2xl cursor-pointer hover:shadow-3xl hover:scale-105 transition-all duration-200 border-2 border-yellow-400 animate-in slide-in-from-bottom-4 fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl flex-shrink-0">{banner.icon || '📺'}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-yellow-300 text-sm truncate">
            {banner.title}
          </h3>
          <p className="text-xs text-white/90 mt-1 line-clamp-2">
            {banner.subtitle}
          </p>
        </div>
      </div>
      <div className="mt-2 text-xs text-yellow-200 font-heading">
        ✨ Tap to explore
      </div>
    </div>
  );
}