import React, { useState, useEffect, useRef } from 'react';
import { Trophy, X } from 'lucide-react';
import { ACHIEVEMENTS } from '@/lib/achievements';

const FLASH_DURATION = 4000; // total flash display before auto-dim (user can still tap to dismiss)
const FLASH_INTERVAL = 150;   // strobe speed

export default function AchievementPopup({ achievementIds, onDismiss }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('flash'); // 'flash' | 'display'
  const [flashCount, setFlashCount] = useState(0);
  const flashTimer = useRef(null);
  const audioCtx = useRef(null);

  const current = ACHIEVEMENTS.find(a => a.id === achievementIds[currentIndex]);
  const total = achievementIds.length;

  // Play "DING DING DING" using Web Audio oscillators
  useEffect(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.current = ctx;
      const playDing = (freq, delay) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.6);
        }, delay);
      };
      playDing(1174, 0);     // D6
      playDing(1397, 180);   // F6  
      playDing(1568, 360);   // G6
    } catch (e) { /* Audio not available */ }
  }, [achievementIds.join(',')]);

  // Flash strobe effect for ~1.5 seconds then settle
  useEffect(() => {
    if (phase === 'flash') {
      flashTimer.current = setInterval(() => {
        setFlashCount(c => {
          if (c >= 10) {
            clearInterval(flashTimer.current);
            setPhase('display');
            return c;
          }
          return c + 1;
        });
      }, FLASH_INTERVAL);
      return () => clearInterval(flashTimer.current);
    }
  }, [phase]);

  // Auto-advance through multiple achievements
  useEffect(() => {
    if (phase === 'display' && total > 1 && currentIndex < total - 1) {
      const t = setTimeout(() => {
        setCurrentIndex(i => i + 1);
        setPhase('flash');
        setFlashCount(0);
      }, 2500);
      return () => clearTimeout(t);
    }
  }, [phase, currentIndex, total]);

  const isStrobe = phase === 'flash' && flashCount % 2 === 0;
  const bgClass = isStrobe ? 'bg-amber-500/30' : 'bg-background/95';
  const shakeClass = phase === 'flash' ? 'animate-shake-gentle' : '';

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
    >
      {/* Full-screen flash overlay */}
      <div className={`absolute inset-0 transition-colors ${bgClass} ${isStrobe ? 'duration-75' : 'duration-300'}`} />
      
      {/* Content card */}
      <div className={`relative bg-card/95 border-2 border-primary/60 rounded-2xl p-6 max-w-sm w-[90%] text-center shadow-2xl shadow-primary/20 ${shakeClass}`}>
        {/* Close hint */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Trophy icon */}
        <div className={`mb-3 transition-transform ${phase === 'flash' ? 'animate-bounce' : ''}`}>
          <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
            <Trophy className="w-9 h-9 text-primary" />
          </div>
        </div>

        {/* Achievement name */}
        <h2 className="font-heading text-lg font-bold text-primary mb-1">{current.name}</h2>

        {/* Description */}
        <p className="text-sm text-foreground/80 mb-1">{current.desc}</p>

        {/* Icon */}
        <div className="text-3xl my-2">{current.icon}</div>

        {/* Category badge */}
        <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground/60">
          Achievement Unlocked
        </div>

        {/* Multiple indicator */}
        {total > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5">
            {achievementIds.map((id, i) => (
              <div
                key={id}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i <= currentIndex ? 'bg-primary' : 'bg-muted/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Tap to dismiss */}
        <p className="text-[9px] text-muted-foreground/40 mt-4 font-heading">tap anywhere to continue</p>
      </div>

      <style>{`
        @keyframes shakeGentle {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-3px, 1px) rotate(-1deg); }
          50% { transform: translate(3px, -1px) rotate(1deg); }
          75% { transform: translate(-2px, -2px) rotate(-0.5deg); }
        }
        .animate-shake-gentle { animation: shakeGentle 0.2s infinite; }
      `}</style>
    </div>
  );
}