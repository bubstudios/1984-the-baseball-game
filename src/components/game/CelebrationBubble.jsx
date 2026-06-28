import React, { useState, useEffect, useRef } from 'react';

// Displays pitcher/batter/fielder celebration moments in a fire-themed bubble
// Bottom-left corner, 10 seconds duration
export default function CelebrationBubble({ celebration }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const prevCelebration = useRef(null);

  useEffect(() => {
    if (!celebration || celebration === prevCelebration.current) return;
    prevCelebration.current = celebration;

    clearTimeout(timerRef.current);
    setVisible(true);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        prevCelebration.current = null;
      }, 400);
    }, 10000);
  }, [celebration]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  if (!celebration) return null;

  return (
    <div
      className={`fixed bottom-24 left-3 z-20 pointer-events-none transition-all duration-500 max-w-[240px] ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
    >
      <div className="bg-gradient-to-r from-orange-900/95 to-red-900/95 border-2 border-orange-400/60 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <span className="text-lg leading-none mt-0.5">🔥</span>
          <span className="text-sm font-heading text-orange-100 leading-snug">
            {celebration}
          </span>
        </div>
      </div>
    </div>
  );
}