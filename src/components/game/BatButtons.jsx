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
    }, 400);
  };

  return (
    <div className="space-y-2">
      <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground text-center mb-2">Choose Swing</div>
      <div className="flex items-end justify-center gap-3">
        {BAT_ACTIONS.map((action) => {
          const isActive = swinging === action.swingIndex;
          return (
            <button
              key={action.swingIndex}
              disabled={disabled || swinging !== null}
              onClick={() => handleSwing(action.swingIndex)}
              className="flex flex-col items-center gap-1"
            >
              {/* Bat shape */}
              <div
                className={`
                  relative w-8 h-24 origin-bottom
                  transition-all duration-150
                  ${isActive ? 'animate-bat-swing' : 'hover:-rotate-12 hover:scale-105'}
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <svg viewBox="0 0 40 120" className="w-full h-full">
                  {/* Bat handle */}
                  <rect x="17" y="0" width="6" height="35" rx="2" fill="#8B6914" />
                  {/* Handle tape/grip lines */}
                  <line x1="17" y1="8" x2="23" y2="8" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="17" y1="14" x2="23" y2="14" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="17" y1="20" x2="23" y2="20" stroke="#6B4F12" strokeWidth="1" />
                  <line x1="17" y1="26" x2="23" y2="26" stroke="#6B4F12" strokeWidth="1" />
                  {/* Knob */}
                  <rect x="14" y="0" width="12" height="5" rx="2" fill="#6B4F12" />
                  {/* Barrel — tapers out */}
                  <path d="M17,35 Q17,55 5,110 L35,110 Q23,55 23,35 Z" fill="#C4903C" stroke="#A07028" strokeWidth="1" />
                  {/* Sweet spot highlight */}
                  <ellipse cx="20" cy="85" rx="9" ry="12" fill="#D4A44C" opacity="0.5" />
                  {/* Grain lines */}
                  <line x1="10" y1="90" x2="10" y2="105" stroke="#A07028" strokeWidth="0.5" opacity="0.6" />
                  <line x1="30" y1="90" x2="30" y2="105" stroke="#A07028" strokeWidth="0.5" opacity="0.6" />
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
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-30deg); }
          50% { transform: rotate(15deg); }
          70% { transform: rotate(-5deg); }
          85% { transform: rotate(2deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-bat-swing {
          animation: batSwing 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}