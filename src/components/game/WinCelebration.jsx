import React, { useEffect, useState } from 'react';
import { getCelebration } from '@/lib/victoryCalls';

// W Flag SVG for Cubs
function WFlag() {
  return (
    <svg viewBox="0 0 200 140" className="w-28 h-20 md:w-36 md:h-24 drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="0" width="5" height="140" rx="2" fill="#8B7355" />
      <rect x="13" y="4" width="182" height="102" rx="3" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="1.5" />
      <text x="104" y="88" textAnchor="middle" fontFamily="'Oswald', 'Arial Black', sans-serif" fontSize="80" fontWeight="900" fill="#1E3A8A">W</text>
      <line x1="13" y1="55" x2="195" y2="55" stroke="#E5E7EB" strokeWidth="0.5" opacity="0.5" />
      <path d="M40 20 Q70 16 100 20 Q130 24 160 20" fill="none" stroke="#E5E7EB" strokeWidth="0.8" opacity="0.6" />
      <circle cx="12" cy="6" r="3" fill="#A0522D" />
    </svg>
  );
}

// Big A halo for Angels
function BigAHalo() {
  return (
    <div className="relative w-28 h-20 md:w-36 md:h-24 flex items-center justify-center">
      <svg viewBox="0 0 200 140" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* The Big A structure */}
        <path d="M60 130 L80 40 L90 40 L110 130 L95 130 L90 110 L80 110 L75 130 Z" fill="#FFD700" stroke="#B8860B" strokeWidth="2" />
        <path d="M82 95 L88 95 L85 70 Z" fill="#B8860B" />
        {/* Halo ring - animated glow */}
        <ellipse cx="85" cy="30" rx="35" ry="8" fill="none" stroke="#FFD700" strokeWidth="3" opacity="0.9">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
          <animate attributeName="rx" values="32;38;32" dur="2s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="85" cy="30" rx="42" ry="10" fill="none" stroke="#FFD700" strokeWidth="1.5" opacity="0.4">
          <animate attributeName="opacity" values="0.1;0.5;0.1" dur="2s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  );
}

// Bernie Brewer slide for Brewers
function BernieSlide() {
  return (
    <div className="relative w-28 h-20 md:w-36 md:h-24 flex items-center justify-center text-4xl">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="animate-bounce" style={{ animationDuration: '1.5s', animationIterationCount: '2' }}>⛷️</span>
      </div>
      <div className="absolute bottom-2 right-4 text-2xl">🍺</div>
    </div>
  );
}

// Generic celebration with team emoji
function GenericEmoji({ emoji }) {
  return (
    <div className="text-4xl animate-in zoom-in-50 duration-500">
      {emoji}
    </div>
  );
}

export default function WinCelebration({ teamKey, gameState, isHomeWin }) {
  const [showSong, setShowSong] = useState(false);
  const celebration = getCelebration(teamKey, gameState, isHomeWin);

  useEffect(() => {
    // Song note fades in after a delay
    const timer = setTimeout(() => setShowSong(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderVisual = () => {
    switch (celebration.type) {
      case 'flag': return <WFlag />;
      case 'halo': return <BigAHalo />;
      case 'bernie': return <BernieSlide />;
      case 'song':
      case 'motown':
        return <GenericEmoji emoji={celebration.emoji} />;
      default:
        return <GenericEmoji emoji={celebration.emoji} />;
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 py-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Visual */}
      {renderVisual()}

      {/* Title */}
      {celebration.title && (
        <p className="font-heading text-sm md:text-base font-bold text-primary tracking-wide">
          {celebration.title}
        </p>
      )}

      {/* Subtitle */}
      <p className="text-[10px] text-muted-foreground/70 font-heading tracking-wider text-center max-w-[280px]">
        {celebration.subtitle}
      </p>

      {/* Song note */}
      {showSong && celebration.song && (
        <div className="flex items-center gap-1.5 mt-1 animate-in fade-in duration-1000">
          <span className="text-xs">🎵</span>
          <span className="text-[10px] font-heading italic text-primary/60">
            {celebration.song}
          </span>
        </div>
      )}
      {showSong && celebration.songNote && (
        <p className="text-[9px] text-muted-foreground/40 font-body text-center max-w-[260px]">
          {celebration.songNote}
        </p>
      )}
    </div>
  );
}