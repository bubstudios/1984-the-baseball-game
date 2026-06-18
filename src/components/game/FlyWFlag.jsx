import React from 'react';
import { Flag } from 'lucide-react';

export default function FlyWFlag() {
  return (
    <div className="flex flex-col items-center gap-3 py-2">
      {/* White flag with blue W */}
      <div className="relative animate-in slide-in-from-top-4 fade-in duration-700">
        <svg
          viewBox="0 0 200 140"
          className="w-28 h-20 md:w-36 md:h-24 drop-shadow-lg"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flag pole */}
          <rect x="8" y="0" width="5" height="140" rx="2" fill="#8B7355" />
          {/* Flag fabric */}
          <rect x="13" y="4" width="182" height="102" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
          {/* Blue W */}
          <text
            x="104"
            y="88"
            textAnchor="middle"
            fontFamily="'Oswald', 'Arial Black', sans-serif"
            fontSize="80"
            fontWeight="900"
            fill="#1E3A8A"
          >
            W
          </text>
          {/* Subtle fold lines */}
          <line x1="13" y1="55" x2="195" y2="55" stroke="#E5E7EB" strokeWidth="0.5" opacity="0.5" />
          {/* Wind ripple */}
          <path
            d="M40 20 Q70 16 100 20 Q130 24 160 20"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <path
            d="M30 85 Q65 81 100 85 Q135 89 170 85"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="0.8"
            opacity="0.6"
          />
          {/* Rope tie */}
          <circle cx="12" cy="6" r="3" fill="#A0522D" />
        </svg>

        {/* Flag waving animation keyframes */}
        <style>{`
          @keyframes flagWave {
            0%, 100% { transform: rotate(-0.5deg); }
            50% { transform: rotate(0.5deg); }
          }
          .flag-wave {
            animation: flagWave 2s ease-in-out infinite;
            transform-origin: top left;
          }
        `}</style>
      </div>

      {/* Text */}
      <div className="text-center">
        <p className="font-heading text-sm md:text-base font-bold text-primary tracking-wide">
          FLY THE W!
        </p>
        <p className="text-[10px] text-muted-foreground/60 font-heading tracking-wider mt-0.5">
          CUBS WIN AT WRIGLEY
        </p>
      </div>
    </div>
  );
}