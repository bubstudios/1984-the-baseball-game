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
                  relative w-28 h-8
                  ${isActive ? 'animate-bat-swing' : 'hover:scale-110 transition-transform'}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 140 40" className="w-full h-full">
                  {/* Barrel — tapered thick end on the left */}
                  <ellipse cx="12" cy="20" rx="4" ry="9" fill="#D4A44C" />
                  <path d="M16,11 Q30,12 38,16 L38,24 Q30,28 16,29 Z" fill="#C4903C" stroke="#A07028" strokeWidth="0.8" />
                  {/* Sweet spot grain oval */}
                  <ellipse cx="22" cy="20" rx="7" ry="6" fill="#D4A44C" opacity="0.3" />
                  {/* Grain lines along barrel */}
                  <line x1="18" y1="16" x2="34" y2="16" stroke="#A07028" strokeWidth="0.4" opacity="0.5" />
                  <line x1="18" y1="20" x2="38" y2="20" stroke="#A07028" strokeWidth="0.4" opacity="0.5" />
                  <line x1="18" y1="24" x2="34" y2="24" stroke="#A07028" strokeWidth="0.4" opacity="0.5" />
                  {/* Handle — tapers from barrel */}
                  <rect x="38" y="17" width="92" height="6" rx="3" fill="#8B6914" />
                  {/* Handle tape wrapping lines */}
                  <line x1="42" y1="17" x2="42" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="50" y1="17" x2="50" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="58" y1="17" x2="58" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="66" y1="17" x2="66" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="74" y1="17" x2="74" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="82" y1="17" x2="82" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="90" y1="17" x2="90" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="98" y1="17" x2="98" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  <line x1="106" y1="17" x2="106" y2="23" stroke="#6B4F12" strokeWidth="0.8" />
                  {/* Knob — flared end on the right */}
                  <rect x="130" y="14" width="10" height="12" rx="3" fill="#6B4F12" stroke="#4A3610" strokeWidth="0.5" />
                  {/* Highlight on barrel */}
                  <path d="M20,14 Q30,13 37,16" fill="none" stroke="#E8C878" strokeWidth="1" opacity="0.4" />
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
          15% { transform: rotate(-5deg) translateY(-2px); }
          35% { transform: rotate(-55deg) translateY(-16px); }
          60% { transform: rotate(-65deg) translateY(-6px); }
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