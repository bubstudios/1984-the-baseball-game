import React, { useState, useEffect } from 'react';

const BAT_ACTIONS = [
  { label: 'Swing', swingIndex: 0, desc: 'Standard swing', statKey: 'contact' },
  { label: 'Power', swingIndex: 2, desc: 'Swing for the fences', statKey: 'power' },
  { label: 'Bunt', swingIndex: 4, desc: 'Lay one down', statKey: null },
];

export default function BatButtons({ onSwing, disabled, situationalBatter, lastPlay }) {
  const [swinging, setSwinging] = useState(null);
  const [hitEffect, setHitEffect] = useState(null);

  const handleSwing = (swingIndex) => {
    if (disabled || swinging !== null) return;
    setSwinging(swingIndex);
    setTimeout(() => {
      setSwinging(null);
      onSwing(swingIndex);
    }, 450);
  };

  // Detect hits and trigger effect
  React.useEffect(() => {
    if (lastPlay && ['single', 'double', 'triple', 'homerun'].includes(lastPlay.type)) {
      setHitEffect(lastPlay.type);
      setTimeout(() => setHitEffect(null), 2000);
    }
  }, [lastPlay?.type]);

  // Determine count-based advantage color for a stat
  const getCountColor = (statKey) => {
    if (!situationalBatter || !statKey) return '';
    const cap = statKey.charAt(0).toUpperCase() + statKey.slice(1);
    const base = situationalBatter[`_rawBase${cap}`];
    const current = situationalBatter[`_rawFinal${cap}`];
    if (current === undefined || base === undefined) return '';
    if (current > base) return 'border-emerald-500 bg-emerald-950/40';
    if (current < base) return 'border-rose-500 bg-rose-950/40';
    return '';
  };

  return (
    <div className="space-y-2 relative">
      {/* Hit effect overlay */}
      {hitEffect && (
        <>
          <div className="absolute inset-0 z-10 pointer-events-none animate-in fade-out duration-500" style={{animationDelay: '1.5s'}}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {hitEffect === 'homerun' ? (
                // Ball flying out for HR
                <>
                  <div className="animate-[ping_1.5s_ease-out_1] absolute w-4 h-4 bg-white rounded-full left-0 top-0 shadow-lg shadow-yellow-400"></div>
                  <div className="animate-[pulse_1.5s_ease-out_1] absolute w-6 h-6 border-2 border-yellow-400 rounded-full left--1 top-1"></div>
                </>
              ) : (
                // Explosion effect for regular hits
                <div className="animate-[bounce_1s_ease-out_1] text-5xl">
                  💥
                </div>
              )}
            </div>
          </div>
          {hitEffect === 'homerun' && (
            <div className="absolute inset-0 z-5 pointer-events-none overflow-hidden rounded-xl">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-[spin_2s_linear_infinite]"
                  style={{
                    left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 40}%`,
                    top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 40}%`,
                    animation: `popOut 1.5s ease-out forwards`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                ></div>
              ))}
            </div>
          )}
        </>
      )}
      <div className="text-[9px] font-heading uppercase tracking-widest text-foreground/60 text-center mb-1">Choose Swing</div>
      <div className="flex items-end justify-center gap-3 sm:gap-4">
        {BAT_ACTIONS.map((action) => {
          const isActive = swinging === action.swingIndex;
          const countColor = getCountColor(action.statKey);
          return (
            <button
              key={action.swingIndex}
              disabled={disabled || swinging !== null}
              onClick={() => handleSwing(action.swingIndex)}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 transition-colors border ${
                countColor
                  ? `${countColor} border-2`
                  : 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-800/20'
              }`}
            >
              {/* Bat — horizontal, arcs upward on swing */}
              <div
                className={`
                  relative w-24 h-8
                  ${isActive ? 'animate-bat-swing' : 'hover:scale-110 transition-transform'}
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 180 50" className="w-full h-full">
                  <defs>
                    <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FDF4DC" />
                      <stop offset="25%" stopColor="#F9DEB0" />
                      <stop offset="55%" stopColor="#E8C078" />
                      <stop offset="100%" stopColor="#C99850" />
                    </linearGradient>
                    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6B4226" />
                      <stop offset="40%" stopColor="#4A2810" />
                      <stop offset="100%" stopColor="#3B1E08" />
                    </linearGradient>
                    <linearGradient id="knobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#5A3518" />
                      <stop offset="100%" stopColor="#2A1405" />
                    </linearGradient>
                  </defs>

                  {/* Barrel — smooth gradual taper from thick barrel end to thin handle */}
                  <path d="M6,13
                    C6,10 10,8 14,8
                    L68,17.5
                    L68,32.5
                    L14,42
                    C10,42 6,40 6,37
                    Z"
                    fill="url(#barrelGrad)" stroke="#3B1E08" strokeWidth="1.5"
                  />

                  {/* Barrel end grain — rounded cap */}
                  <ellipse cx="10" cy="25" rx="5" ry="16" fill="url(#barrelGrad)" stroke="#3B1E08" strokeWidth="1.2" />

                  {/* Barrel top highlight */}
                  <path d="M14,12 Q40,17 64,18" fill="none" stroke="#FFFDF5" strokeWidth="2.2" opacity="0.45" strokeLinecap="round" />
                  {/* Barrel bottom shadow */}
                  <path d="M14,39 Q40,34 64,31" fill="none" stroke="#8B6040" strokeWidth="1.8" opacity="0.35" strokeLinecap="round" />

                  {/* Handle — thin uniform wood */}
                  <rect x="68" y="21" width="72" height="8" rx="1" fill="url(#handleGrad)" stroke="#3B1E08" strokeWidth="1" />

                  {/* Grip tape */}
                  <rect x="88" y="20" width="38" height="10" rx="1.5" fill="#F0ECE0" stroke="#3B1E08" strokeWidth="0.8" />
                  {[
                    [91,20,95,30],
                    [95,20,99,30],
                    [99,20,103,30],
                    [103,20,107,30],
                    [107,20,111,30],
                    [111,20,115,30],
                    [115,20,119,30],
                    [119,20,123,30],
                  ].map(([x1,y1,x2,y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="0.9" opacity="0.6" />
                  ))}

                  {/* Knob — rounded pill-shaped button */}
                  <rect x="140" y="17" width="16" height="16" rx="8" fill="url(#knobGrad)" stroke="#3B1E08" strokeWidth="1.3" />
                  <ellipse cx="148" cy="21" rx="5" ry="2.5" fill="#8B6040" opacity="0.4" />

                  {/* Grain lines on barrel */}
                  <path d="M12,18 Q40,22 64,20" fill="none" stroke="#D0A060" strokeWidth="0.7" opacity="0.4" />
                  <path d="M12,22 Q40,25 64,23" fill="none" stroke="#D0A060" strokeWidth="0.5" opacity="0.3" />
                  <path d="M12,30 Q40,29 64,27" fill="none" stroke="#C89840" strokeWidth="0.6" opacity="0.3" />
                  <path d="M12,34 Q40,32 64,29" fill="none" stroke="#C89840" strokeWidth="0.5" opacity="0.25" />
                </svg>
              </div>
              <span className="font-heading font-bold text-[10px] text-foreground">{action.label}</span>
              <span className="text-[8px] text-foreground/50 -mt-0.5">{action.desc}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes batSwing {
          0% { transform: rotate(0deg) translateY(0px); }
          15% { transform: rotate(-5deg) translateY(-2px); }
          35% { transform: rotate(-55deg) translateY(-18px); }
          60% { transform: rotate(-65deg) translateY(-8px); }
          80% { transform: rotate(-20deg) translateY(4px); }
          100% { transform: rotate(0deg) translateY(0px); }
        }
        .animate-bat-swing {
          animation: batSwing 0.45s ease-out;
          transform-origin: right center;
        }
        @keyframes popOut {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
        }
      `}</style>
    </div>
  );
}