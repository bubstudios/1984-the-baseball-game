import React, { useState } from 'react';
import { getCardImage } from '@/lib/cardImages';

export default function BaseballCard({ card, isNew = false }) {
  const [imgError, setImgError] = useState(false);
  if (!card) return null;

  const isHitter = card.position !== 'P' && card.position !== 'SP' && card.position !== 'RP' && card.position !== 'CL';
  const imgUrl = getCardImage(card.name);

  // If we have a real card image, render it photo-style
  if (imgUrl && !imgError) {
    return (
      <div className="relative w-72 mx-auto" style={{ aspectRatio: '2.5/3.5' }}>
        {isNew && (
          <div className="absolute -top-3 -right-3 z-10 bg-yellow-400 text-red-700 text-[10px] font-heading font-bold px-2 py-1 rounded-full border-2 border-red-600 shadow-lg">
            NEW!
          </div>
        )}
        <img
          src={imgUrl}
          alt={`${card.name} 1984 Topps card`}
          className="w-full h-full object-cover rounded-lg shadow-2xl"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Fallback: styled card with stats
  const getRarityStyle = (rarity) => {
    switch (rarity) {
      case 'rare':     return { border: 'border-yellow-400', bg: 'from-yellow-900 to-yellow-800', text: 'text-yellow-300' };
      case 'uncommon': return { border: 'border-cyan-400',   bg: 'from-cyan-900 to-cyan-800',   text: 'text-cyan-300' };
      default:         return { border: 'border-red-500',    bg: 'from-red-900 to-red-800',     text: 'text-red-300' };
    }
  };
  const style = getRarityStyle(card.rarity);

  return (
    <div className={`relative w-72 mx-auto bg-gradient-to-b ${style.bg} rounded-lg shadow-2xl overflow-hidden border-4 ${style.border}`} style={{ aspectRatio: '2.5/3.5' }}>
      <div className="absolute top-0 left-0 right-0 bg-yellow-300 text-red-700 text-center py-1 font-heading font-bold tracking-widest text-sm">
        TOPPS '84
      </div>
      <div className="pt-10 px-4 pb-4 h-full flex flex-col">
        <div className="bg-gray-800 flex-1 rounded border-2 border-yellow-200/30 mb-3 flex items-center justify-center">
          <span className="text-6xl">{card.position === 'P' || card.position === 'SP' || card.position === 'CL' || card.position === 'RP' ? '⚾' : '🧢'}</span>
          {isNew && (
            <div className="absolute top-12 right-4 bg-yellow-400 text-red-600 text-[10px] font-heading font-bold px-2 py-1 rounded-full border border-red-600">
              NEW!
            </div>
          )}
        </div>
        <div className="text-center mb-2">
          <h3 className={`font-heading text-lg font-bold uppercase tracking-tight ${style.text}`}>{card.name}</h3>
          <p className="text-xs text-yellow-200/60 font-heading uppercase">#{card.number} • {card.position}</p>
        </div>
        <div className="bg-yellow-200/10 rounded px-3 py-2 border border-yellow-400/20">
          <div className="grid grid-cols-2 gap-1 text-[11px] font-heading font-bold text-center">
            {isHitter ? (
              <>
                <div><div className={`${style.text} text-xs`}>AVG</div><div className="text-white">{card.ba}</div></div>
                <div><div className={`${style.text} text-xs`}>HR</div><div className="text-white">{card.hr}</div></div>
                <div><div className={`${style.text} text-xs`}>RBI</div><div className="text-white">{card.rbi}</div></div>
                <div><div className={`${style.text} text-xs`}>POS</div><div className="text-white text-[9px]">{card.role}</div></div>
              </>
            ) : (
              <>
                <div><div className={`${style.text} text-xs`}>ERA</div><div className="text-white">{card.era}</div></div>
                <div><div className={`${style.text} text-xs`}>ROLE</div><div className="text-white text-[9px]">{card.role}</div></div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}