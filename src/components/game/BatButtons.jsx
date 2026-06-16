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
      <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground text-center mb-2">Choose Swing</div>
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
                  relative w-24 h-10
                  ${isActive ? 'animate-bat-swing' : 'hover:scale-110 transition-transform'}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 120 40" className="w-full h-full">
                  {/* Bat barrel — left side */}
                  <path d="M0,20 Q10,10 30,15 L30,25 Q10,30 0,20 Z" fill="#C4903C" stroke="#A07028" strokeWidth="1" />
                  {/* Sweet spot */}
                  <ellipse cx="12" cy="20" rx="6" ry="5" fill="#D4A44C" opacity="0.5" />
                  {/* Grain lines */}
                  <line x1="5" y1="17" x2="10" y2="17" stroke="#A07028" strokeWidth="0.5" opacity="0.6" />
                  <line x1="5" y1="23" x2="10" y2="23" stroke="#A07028" strokeWidth="0.5" opacity="0.6" />
                  {/* Handle — right side */}
                  <rect x="30" y="16" width="85" height="8" rx="3" fill="#8B6914" />
                  {/* Grip lines */}
                  <line x1="35" y1="16" x2="35" y2="24" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="45" y1="16" x2="45" y2="24" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="55" y1="16" x2="55" y2="24" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="65" y1="16" x2="65" y2="24" stroke="#6B4F12" strokeWidth="1" />
                  {/* Knob — rightmost */}
                  <rect x="112" y="14" width="8" height="12" rx="2" fill="#6B4F12" />
                </svg>
              </div>
              <span className="font-heading font-bold text-xs text-foreground">{action.label}</span>
              <span className="text-[9px] text-muted-foreground/60 -mt-1">{action.desc}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes batSwing {
          0% { transform: rotate(0deg) translateY(0px); }
          15% { transform: rotate(-8deg) translateY(-2px); }
          35% { transform: rotate(-60deg) translateY(-18px); }
          60% { transform: rotate(-70deg) translateY(-8px); }
          80% { transform: rotate(-25deg) translateY(4px); }
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