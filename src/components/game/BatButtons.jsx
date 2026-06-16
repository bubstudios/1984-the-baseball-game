import React, { useState } from 'react';

const BAT_ACTIONS = [
  { label: 'Swing', swingIndex: 0, desc: 'Standard swing' },
  { label: 'Power', swingIndex: 2, desc: 'Swing for the fences' },
  { label: 'Bunt', swingIndex: 4, desc: 'Lay one down' },
];

export default function BatButtons({ onSwing, disabled }) {
  const [swinging, setSwinging] = useState(null);

  const handleSwing = (swingIndex) => {
    if (disabled || swinging !== null) return;
    setSwinging(swingIndex);
    setTimeout(() => {
      setSwinging(null);
      onSwing(swingIndex);
    }, 450);
  };

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-heading uppercase tracking-widest text-slate-400 text-center mb-2">Choose Swing</div>
      <div className="flex items-end justify-center gap-4 sm:gap-6">
        {BAT_ACTIONS.map((action) => {
          const isActive = swinging === action.swingIndex;
          return (
            <button
              key={action.swingIndex}
              disabled={disabled || swinging !== null}
              onClick={() => handleSwing(action.swingIndex)}
              className="flex flex-col items-center gap-1"
            >
              {/* Bat — horizontal, arcs upward on swing */}
              <div
                className={`
                  relative w-32 h-9
                  ${isActive ? 'animate-bat-swing' : 'hover:scale-110 transition-transform'}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 160 45" className="w-full h-full">
                  <defs>
                    <linearGradient id="barrelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FDF4DC" />
                      <stop offset="30%" stopColor="#F7D49D" />
                      <stop offset="60%" stopColor="#E8C078" />
                      <stop offset="100%" stopColor="#C99850" />
                    </linearGradient>
                    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5A3518" />
                      <stop offset="50%" stopColor="#4A2810" />
                      <stop offset="100%" stopColor="#3B1E08" />
                    </linearGradient>
                  </defs>

                  {/* Barrel — gradually tapers from wide left to narrow right */}
                  <polygon points="52,18 52,27 5,13 5,32" fill="url(#barrelGrad)" stroke="#3B1E08" strokeWidth="1.2" />
                  {/* Barrel rounded cap on left end */}
                  <path d="M5,13 C2,13 2,32 5,32" fill="url(#barrelGrad)" stroke="#3B1E08" strokeWidth="1.2" />
                  {/* Barrel highlight — top edge glow */}
                  <path d="M7,16 Q28,19 48,20" fill="none" stroke="#FFFDF5" strokeWidth="1.8" opacity="0.5" strokeLinecap="round" />
                  {/* Bottom shadow on barrel */}
                  <path d="M7,30 Q28,27 48,25" fill="none" stroke="#A07040" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

                  {/* Transition zone — barrel to handle */}
                  <polygon points="52,18 52,27 64,24.5 64,20.5" fill="#6B4226" stroke="#3B1E08" strokeWidth="0.8" />

                  {/* Handle — darker wood */}
                  <rect x="64" y="19.5" width="55" height="6" rx="2.5" fill="url(#handleGrad)" stroke="#3B1E08" strokeWidth="1" />

                  {/* Grip tape — white with black hash marks */}
                  <rect x="83" y="18.5" width="33" height="8" rx="1" fill="#F0ECE0" stroke="#3B1E08" strokeWidth="0.8" />
                  {/* Diagonal hash marks on the grip tape */}
                  {[
                    [86, 18.5, 90, 26.5],
                    [90, 18.5, 94, 26.5],
                    [94, 18.5, 98, 26.5],
                    [98, 18.5, 102, 26.5],
                    [102, 18.5, 106, 26.5],
                    [106, 18.5, 110, 26.5],
                  ].map(([x1, y1, x2, y2], i) => (
                    <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#222" strokeWidth="1" opacity="0.7" />
                  ))}

                  {/* Tapered neck between grip and knob */}
                  <rect x="119" y="20.5" width="13" height="4" rx="1" fill="#3B1E08" stroke="#2A1405" strokeWidth="0.6" />

                  {/* Knob — flared base on the right */}
                  <rect x="132" y="17" width="12" height="11" rx="4" fill="url(#barrelGrad)" stroke="#3B1E08" strokeWidth="1.2" />
                  {/* Knob highlight */}
                  <rect x="134" y="18" width="8" height="2" rx="1" fill="#FFFDF5" opacity="0.35" />

                  {/* Brand logo placeholder — oval on barrel */}
                  <ellipse cx="28" cy="22.5" rx="7" ry="4.5" fill="none" stroke="#3B1E08" strokeWidth="0.6" opacity="0.25" />
                </svg>
              </div>
              <span className="font-heading font-bold text-xs text-foreground">{action.label}</span>
              <span className="text-[9px] text-slate-300 -mt-1">{action.desc}</span>
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
      `}</style>
    </div>
  );
}