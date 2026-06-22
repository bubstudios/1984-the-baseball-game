import React from 'react';

export default function BaseballCard({ card, isNew = false }) {
  if (!card) return null;

  const getCardColor = (rarity) => {
    switch (rarity) {
      case 'rare':
        return 'from-yellow-500 to-yellow-600';
      case 'uncommon':
        return 'from-cyan-400 to-cyan-500';
      case 'common':
      default:
        return 'from-red-500 to-red-600';
    }
  };

  const isHitter = card.position !== 'P';
  const bgGradient = getCardColor(card.rarity);

  return (
    <div className="relative w-80 h-96 mx-auto perspective">
      {/* Card Container */}
      <div className={`relative w-full h-full bg-gradient-to-b ${bgGradient} rounded-lg shadow-2xl overflow-hidden border-4 border-yellow-300`}>
        
        {/* Top Banner - Topps Logo */}
        <div className="absolute top-0 left-0 right-0 bg-yellow-300 text-red-600 text-center py-1 border-b-2 border-red-600 font-heading font-bold tracking-widest text-sm">
          TOPPS
        </div>

        {/* Main Content Area */}
        <div className="pt-10 px-4 pb-4 h-full flex flex-col">
          
          {/* Player Photo Area */}
          <div className="bg-gray-300 h-32 rounded border-2 border-yellow-200 mb-3 flex items-center justify-center overflow-hidden relative">
            <div className="text-6xl text-center">
              {card.position === 'P' ? '⚾' : '🧢'}
            </div>
            {isNew && (
              <div className="absolute top-1 right-1 bg-yellow-400 text-red-600 text-[10px] font-heading font-bold px-2 py-1 rounded-full border border-red-600">
                NEW!
              </div>
            )}
          </div>

          {/* Player Name and Position */}
          <div className="text-center mb-2">
            <h3 className="font-heading text-xl font-bold text-white uppercase tracking-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              {card.name}
            </h3>
            <p className="text-xs text-yellow-200 font-heading font-bold uppercase tracking-wider">
              #{card.number} • {card.position}
            </p>
          </div>

          {/* Stats Section */}
          <div className="bg-yellow-200/90 rounded px-3 py-2 mb-3 border-2 border-red-600 flex-1">
            <div className="grid grid-cols-2 gap-2 text-[11px] font-heading font-bold">
              {isHitter ? (
                <>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">AVG</div>
                    <div className="text-red-700 font-bold">{card.ba}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">HR</div>
                    <div className="text-red-700 font-bold">{card.hr}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">RBI</div>
                    <div className="text-red-700 font-bold">{card.rbi}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">POS</div>
                    <div className="text-red-700 font-bold">{card.role}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">ERA</div>
                    <div className="text-red-700 font-bold">{card.era}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 text-xs">ROLE</div>
                    <div className="text-red-700 font-bold text-[9px]">{card.role}</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center border-t-2 border-yellow-300 pt-2">
            <p className="text-[9px] text-yellow-100 font-heading font-bold uppercase tracking-widest">
              Detroit Tigers • 1984
            </p>
            <p className="text-[7px] text-yellow-200 mt-0.5">© TOPPS</p>
          </div>
        </div>

        {/* Rarity Indicator */}
        <div className="absolute bottom-2 right-2 text-xs font-heading font-bold text-white/80 uppercase">
          {card.rarity}
        </div>
      </div>
    </div>
  );
}