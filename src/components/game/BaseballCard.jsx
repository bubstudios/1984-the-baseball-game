import React, { useState } from 'react';
import { getCardImage } from '@/lib/cardImages';
import { findTeamForPlayer, TEAM_CARD_META } from '@/lib/baseballCards';

export default function BaseballCard({ card, isNew = false }) {
  const [imgError, setImgError] = useState(false);
  if (!card) return null;

  const isPitcher = card.position === 'P' || card.position === 'SP' || card.position === 'RP' || card.position === 'CL';
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

  // Fallback: Full 1984 Topps facsimile-style card (CSS-rendered)
  const teamKey = findTeamForPlayer(card.name);
  const teamMeta = teamKey ? TEAM_CARD_META[teamKey] : null;
  const teamColor = teamMeta?.color || '#c6011f';
  const teamLabel = teamMeta?.label?.replace(/^[^\s]+\s/, '') || 'MAJOR LEAGUE';
  const isManager = card.isManager;

  // Position label for the banner
  const posLabel = isManager ? 'MANAGER' : isPitcher ? 'PITCHER' : card.position;
  const posText = isManager ? 'SKIPPER' : isPitcher ? 'PITCHER' : (() => {
    const posMap = { 'C': 'CATCHER', '1B': 'FIRST BASE', '2B': 'SECOND BASE', '3B': 'THIRD BASE', 'SS': 'SHORTSTOP', 'LF': 'LEFT FIELD', 'CF': 'CENTER FIELD', 'RF': 'RIGHT FIELD', 'DH': 'DESIGNATED HITTER', 'OF': 'OUTFIELDER', 'UT': 'UTILITY' };
    return posMap[card.position] || card.position;
  })();

  return (
    <div className="relative w-72 mx-auto" style={{ aspectRatio: '2.5/3.5' }}>
      {isNew && (
        <div className="absolute -top-3 -right-3 z-10 bg-yellow-400 text-red-700 text-[10px] font-heading font-bold px-2 py-1 rounded-full border-2 border-red-600 shadow-lg animate-bounce">
          NEW!
        </div>
      )}
      {/* Card frame - white border like real Topps cards */}
      <div className="w-full h-full bg-white rounded-sm shadow-2xl overflow-hidden flex flex-col border border-gray-300">
        {/* Top color band with team name */}
        <div className="px-2 py-1.5 flex items-center justify-center" style={{ backgroundColor: teamColor }}>
          <span className="font-heading font-bold text-white text-sm tracking-wide uppercase truncate" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.4)' }}>
            {teamLabel}
          </span>
        </div>

        {/* Photo area - simulated with gradient + silhouette */}
        <div className="flex-1 relative overflow-hidden" style={{ background: `linear-gradient(160deg, ${teamColor}33, ${teamColor}88, ${teamColor}aa)` }}>
          {/* Field pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 9px)`
          }} />
          {/* Player silhouette icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl opacity-80" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
              {isManager ? '📋' : isPitcher ? '⚾' : card.position === 'C' ? '🧤' : '🧢'}
            </span>
          </div>
          {/* Position badge top-right */}
          <div className="absolute top-1 right-1 bg-white/90 rounded px-1.5 py-0.5">
            <span className="text-[8px] font-heading font-bold" style={{ color: teamColor }}>{card.position}</span>
          </div>
        </div>

        {/* Position banner bar */}
        <div className="px-2 py-1 flex items-center justify-between" style={{ backgroundColor: teamColor }}>
          <span className="font-heading font-bold text-white text-[10px] uppercase tracking-wider">
            {posText}
          </span>
        </div>

        {/* Player name */}
        <div className="px-2 py-1.5 bg-white border-t border-gray-200">
          <h3 className="font-heading font-bold text-sm uppercase leading-tight" style={{ color: teamColor }}>
            {card.name}
          </h3>
        </div>

        {/* Stats row */}
        <div className="px-2 pb-1 bg-white">
          <div className="flex items-center justify-between text-[9px] font-heading font-bold">
            <div className="flex gap-2">
              {isPitcher ? (
                <>
                  <div className="text-center">
                    <div className="text-gray-500 text-[7px]">ERA</div>
                    <div className="text-gray-800">{card.era}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[7px]">ROLE</div>
                    <div className="text-gray-800 text-[7px] max-w-[80px] leading-tight">{card.role}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-gray-500 text-[7px]">AVG</div>
                    <div className="text-gray-800">{card.ba}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[7px]">HR</div>
                    <div className="text-gray-800">{card.hr}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-500 text-[7px]">RBI</div>
                    <div className="text-gray-800">{card.rbi}</div>
                  </div>
                </>
              )}
            </div>
            {/* Card number box */}
            <div className="border border-gray-800 bg-white px-1 py-0.5">
              <span className="text-[8px] font-heading font-bold text-gray-800">#{card.number}</span>
            </div>
          </div>
        </div>

        {/* Bottom branding strip */}
        <div className="px-2 py-1 flex items-center justify-between bg-gray-100 border-t border-gray-200">
          <span className="text-[7px] italic text-gray-600 font-heading">{card.role}</span>
          <span className="text-[7px] font-heading font-bold text-gray-800 tracking-wider">1984 TOPPS</span>
        </div>
      </div>
    </div>
  );
}