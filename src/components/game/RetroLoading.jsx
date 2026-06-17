import React, { useState, useEffect, useRef } from 'react';
import { startDiskClack, stopDiskClack } from '@/hooks/useRetroAudio';

export default function RetroLoading({ onComplete }) {
  const [dots, setDots] = useState('');
  const [loaded, setLoaded] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      startDiskClack();
    }

    // Blinking cursor animation
    const dotInterval = setInterval(() => {
      setDots(d => d.length < 3 ? d + '.' : '');
    }, 400);

    // Loading completes after ~5 seconds
    const loadTimer = setTimeout(() => {
      clearInterval(dotInterval);
      setLoaded(true);
      stopDiskClack();
    }, 4800);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(loadTimer);
      stopDiskClack();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }
  }, [loaded, onComplete]);

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Retro monitor glow */}
        <div className="inline-block px-8 py-6 bg-[#0d1a0d] border-2 border-[#1a3a1a] rounded-sm shadow-[0_0_30px_rgba(0,255,0,0.08)]">
          {/* Title */}
          <div className="font-display text-[13px] tracking-[0.3em] text-[#33cc33] mb-6">
            1984: THE BASEBALL SEASON
          </div>

          {/* Studio credit */}
          <div className="font-mono text-[9px] text-[#2a8a2a] mb-5 tracking-[0.15em]">
            created by Bub Studios
          </div>

          {/* Loading line */}
          <div className="flex items-center justify-center gap-1 font-mono text-sm text-[#44dd44] mb-2">
            <span>LOADING PROGRAM{dots}</span>
            <span className={`inline-block w-2 h-4 bg-[#44dd44] ${loaded ? 'animate-none opacity-0' : 'animate-pulse'}`} />
          </div>

          {/* Status bar — fills up */}
          <div className="w-64 h-2 bg-[#0a150a] border border-[#1a3a1a] rounded-sm overflow-hidden mt-3">
            <div
              className="h-full bg-[#33cc33] transition-all ease-linear rounded-sm"
              style={{ width: loaded ? '100%' : '0%', transitionDuration: '4800ms' }}
            />
          </div>

          {/* Memory/version line */}
          <div className="mt-4 text-[9px] font-mono text-[#226622] tracking-wider">
            VER 1.0 · 64K RAM SYSTEM · (C)1984
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-[8px] font-mono text-[#1a441a] tracking-[0.2em]">
          INSERT COIN TO CONTINUE
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 0.8s infinite;
        }
      `}</style>
    </div>
  );
}