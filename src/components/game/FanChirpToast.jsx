import React, { useState, useEffect, useRef } from 'react';
import { pickFanYell } from '@/lib/fanChatter';

// Fires a fan chirp toast from the stands on ~20% of pitches
// Distinct from bench chirps: teal/cyan color, bottom of screen, shorter duration
export default function FanChirpToast({ trigger, homeTeamKey }) {
  const [chirp, setChirp] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    // ~20% chance
    if (Math.random() > 0.20) return;

    const text = pickFanYell(homeTeamKey);
    setChirp(text);
    setVisible(true);

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setChirp(null), 300);
    }, 3200);

    return () => clearTimeout(timerRef.current);
  }, [trigger]);

  if (!chirp) return null;

  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="bg-cyan-900/90 border border-cyan-400/40 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-sm flex items-center gap-2 max-w-xs">
        <span className="text-xs">📣</span>
        <span className="text-xs font-heading text-cyan-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[220px]">
          "{chirp}"
        </span>
      </div>
    </div>
  );
}