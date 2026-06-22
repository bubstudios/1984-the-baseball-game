import React, { useState, useEffect, useRef } from 'react';
import { pickFanYell } from '@/lib/fanChatter';

// Fires a fan chirp toast from the stands on ~20% of pitches
// Distinct from bench chirps: teal/cyan color, upper-right screen position
export default function FanChirpToast({ trigger, homeTeamKey }) {
  const [chirp, setChirp] = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const prevTrigger = useRef(0);

  useEffect(() => {
    if (!trigger || trigger === prevTrigger.current) return;
    prevTrigger.current = trigger;

    // ~22% chance
    if (Math.random() > 0.22) return;

    const text = pickFanYell(homeTeamKey);

    // Clear any existing timer and chirp before setting new one
    clearTimeout(timerRef.current);
    setVisible(false);

    // Small delay so fade-out plays if replacing a stuck chirp
    setTimeout(() => {
      setChirp(text);
      setVisible(true);

      timerRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setChirp(null), 400);
      }, 3800);
    }, 50);

    return () => clearTimeout(timerRef.current);
  }, [trigger]);

  if (!chirp) return null;

  return (
    <div
      className={`fixed top-24 right-3 z-50 pointer-events-none transition-all duration-400 max-w-[220px] ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}
    >
      <div className="bg-cyan-900/95 border border-cyan-400/50 rounded-2xl px-3 py-2 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">📣</span>
          <span className="text-sm font-heading text-cyan-100 leading-snug">
            "{chirp}"
          </span>
        </div>
        <div className="text-[9px] text-cyan-400/50 font-heading mt-1 text-right">FROM THE STANDS</div>
      </div>
    </div>
  );
}