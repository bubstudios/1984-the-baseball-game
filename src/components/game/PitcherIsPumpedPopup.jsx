import React, { useState, useEffect } from 'react';

export default function PitcherIsPumpedPopup({ message, playerName, onDismiss, isHitter = false, isFielder = false }) {
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
      <div className={`
        rounded-2xl shadow-2xl px-8 py-6 text-center max-w-sm
        ${isHitter ? 'bg-gradient-to-br from-emerald-900/95 to-emerald-800/95 border-2 border-emerald-400' 
          : isFielder ? 'bg-gradient-to-br from-blue-900/95 to-blue-800/95 border-2 border-blue-400'
          : 'bg-gradient-to-br from-amber-900/95 to-amber-800/95 border-2 border-amber-400'}
      `}>
        {/* Celebration emoji */}
        <div className={`text-6xl mb-4 animate-bounce ${
          isHitter ? 'text-emerald-300' 
          : isFielder ? 'text-blue-300'
          : 'text-amber-300'
        }`}>
          {isHitter ? '🔥' : isFielder ? '⚡' : '💪'}
        </div>

        {/* Title */}
        <h3 className={`font-heading text-2xl font-bold mb-2 ${
          isHitter ? 'text-emerald-300'
          : isFielder ? 'text-blue-300'
          : 'text-amber-300'
        }`}>
          {isHitter ? 'Clutch Hit!' : isFielder ? 'Brilliant Catch!' : 'Pitcher Is Pumped!'}
        </h3>

        {/* Player name */}
        <p className="font-heading text-lg font-bold text-foreground mb-3">
          {playerName}
        </p>

        {/* Message */}
        {message && (
          <p className="text-sm text-foreground/80 italic mb-3">
            "{message}"
          </p>
        )}

        {/* Context */}
        <div className={`text-xs font-heading tracking-wider ${
          isHitter ? 'text-emerald-400/60'
          : isFielder ? 'text-blue-400/60'
          : 'text-amber-400/60'
        }`}>
          {isHitter ? 'Potential argument brewing...' 
            : isFielder ? 'Showboating could stir up trouble'
            : 'Teammates fired up'}
        </div>
      </div>
    </div>
  );
}