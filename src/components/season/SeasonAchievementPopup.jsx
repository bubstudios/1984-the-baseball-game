import React, { useState, useEffect, useRef } from 'react';
import { Trophy, X } from 'lucide-react';
import { subscribeToPopupQueue, shiftPopupQueue } from '@/lib/seasonAchievements/achievementEngine';

const RARITY_STYLES = {
  Common: { border: 'border-slate-400', glow: 'shadow-[0_0_12px_rgba(148,163,184,0.4)]', badge: 'bg-slate-600' },
  Uncommon: { border: 'border-emerald-400', glow: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]', badge: 'bg-emerald-600' },
  Rare: { border: 'border-blue-400', glow: 'shadow-[0_0_12px_rgba(96,165,250,0.4)]', badge: 'bg-blue-600' },
  Epic: { border: 'border-purple-400', glow: 'shadow-[0_0_16px_rgba(168,85,247,0.5)]', badge: 'bg-purple-600' },
  Legendary: { border: 'border-amber-400', glow: 'shadow-[0_0_20px_rgba(251,191,36,0.6)]', badge: 'bg-amber-600' },
};

function playAchievementSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(659, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
    osc.frequency.setValueAtTime(1047, ctx.currentTime + 0.16);
    osc.type = 'square';
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* AudioContext blocked */ }
}

export default function SeasonAchievementPopup() {
  const [queue, setQueue] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return subscribeToPopupQueue((newQueue) => {
      setQueue([...newQueue]);
    });
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    playAchievementSound();
    timerRef.current = setTimeout(() => {
      shiftPopupQueue();
    }, 3800);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [queue[0]?.id]);

  if (queue.length === 0) return null;
  const current = queue[0];
  const rarity = RARITY_STYLES[current.rarity] || RARITY_STYLES.Common;

  return (
    <div className="fixed top-4 right-4 z-[200] animate-in slide-in-from-right duration-300">
      <div className={`bg-gradient-to-br from-amber-50 to-amber-100 border-2 ${rarity.border} ${rarity.glow} rounded-lg p-3 w-72 shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b border-amber-300">
          <Trophy className="w-4 h-4 text-amber-700" />
          <span className="font-heading text-[9px] font-bold uppercase tracking-widest text-amber-700">
            Achievement Unlocked
          </span>
          <span className={`ml-auto ${rarity.badge} text-white text-[8px] font-heading font-bold px-1.5 py-0.5 rounded`}>
            {current.rarity}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-sm font-bold text-stone-900 leading-tight mb-0.5">
          {current.title}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-stone-600 font-body leading-snug">
          {current.description}
        </p>

        {/* Team/Player */}
        {(current.teamKey || current.playerName) && (
          <div className="mt-1.5 pt-1.5 border-t border-amber-300 text-[9px] text-stone-500 font-heading">
            {current.playerName && <span>{current.playerName}</span>}
            {current.playerName && current.teamKey && <span> · </span>}
            {current.teamKey && <span>{current.teamKey.toUpperCase()}</span>}
          </div>
        )}
      </div>
    </div>
  );
}