import React, { useState, useEffect } from 'react';

export default function CatcherThrowOutPopup({ playerName, runnerName, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss?.(), 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
        visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-br from-red-900/95 to-red-800/95 border-2 border-red-400 rounded-2xl shadow-2xl px-8 py-6 text-center max-w-sm">
        {/* Celebration emoji */}
        <div className="text-6xl mb-4 animate-bounce text-red-300">
          🔥
        </div>

        {/* Title */}
        <h3 className="font-heading text-2xl font-bold mb-2 text-red-300">
          Runner Out!
        </h3>

        {/* Catcher name */}
        <p className="font-heading text-lg font-bold text-foreground mb-1">
          {playerName}
        </p>

        {/* Runner caught */}
        <p className="text-sm text-foreground/80 italic mb-3">
          Throws out {runnerName}
        </p>

        {/* Context */}
        <div className="text-xs font-heading tracking-wider text-red-400/60">
          Excellent defensive play!
        </div>
      </div>
    </div>
  );
}