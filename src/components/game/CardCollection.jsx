import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BaseballCard from './BaseballCard';
import { ALL_ROSTERS, TEAM_CARD_META, getCollectedIds, getProgress, loadFromStorage } from '@/lib/baseballCards';
import { getCardImage } from '@/lib/cardImages';

const TEAM_KEYS = Object.keys(TEAM_CARD_META);

export default function CardCollection({ onClose }) {
  const [activeTeam, setActiveTeam] = useState(TEAM_KEYS[0]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [collectionData, setCollectionData] = useState({});

  useEffect(() => {
    // Load all teams from storage
    const data = {};
    TEAM_KEYS.forEach(key => {
      loadFromStorage(key);
      data[key] = {
        collectedIds: getCollectedIds(key),
        progress: getProgress(key),
      };
    });
    setCollectionData(data);
  }, []);

  const meta = TEAM_CARD_META[activeTeam];
  const teamColor = meta?.color || '#888';
  const roster = ALL_ROSTERS[activeTeam] || [];
  const collectedIds = collectionData[activeTeam]?.collectedIds || [];
  const progress = collectionData[activeTeam]?.progress || { collected: 0, total: roster.length, percentage: 0 };

  const collectedCards = collectedIds.map(id => roster.find(p => p.id === id)).filter(Boolean);
  const missingCards = roster.filter(p => !collectedIds.includes(p.id));

  const handleTeamSwitch = (key) => {
    setActiveTeam(key);
    setSelectedCard(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <div className="bg-slate-900 rounded-2xl border-4 max-w-5xl w-full max-h-[95vh] flex flex-col" style={{ borderColor: teamColor }}>

        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between rounded-t-xl" style={{ borderBottom: `3px solid ${teamColor}` }}>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wider" style={{ color: teamColor }}>
              Card Collection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">1984 Season — Win home games to earn cards</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" style={{ color: teamColor }} />
          </button>
        </div>

        {/* Team tabs — scrollable row */}
        <div className="shrink-0 px-3 pt-3 pb-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {TEAM_KEYS.map(key => {
              const m = TEAM_CARD_META[key];
              const prog = collectionData[key]?.progress;
              const isActive = activeTeam === key;
              return (
                <button
                  key={key}
                  onClick={() => handleTeamSwitch(key)}
                  className={`px-3 py-1.5 rounded-lg font-heading text-xs font-bold transition-all border-2 whitespace-nowrap`}
                  style={{
                    borderColor: isActive ? m.color : 'rgba(255,255,255,0.1)',
                    background: isActive ? `${m.color}22` : 'transparent',
                    color: isActive ? m.color : '#888',
                  }}
                >
                  {m.label}
                  {prog && prog.collected > 0 && (
                    <span className="ml-1.5 text-[10px] opacity-70">{prog.collected}/{prog.total}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-heading">
              <span style={{ color: teamColor }}>Collection Progress</span>
              <span className="text-white font-bold">{progress.collected} / {progress.total}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden border" style={{ borderColor: `${teamColor}44` }}>
              <div
                className="h-full flex items-center justify-center font-heading font-bold text-slate-900 text-xs transition-all duration-500"
                style={{ width: `${progress.percentage}%`, background: `linear-gradient(90deg, ${teamColor}, ${teamColor}cc)`, minWidth: progress.percentage > 0 ? '2rem' : 0 }}
              >
                {progress.percentage > 10 && `${progress.percentage}%`}
              </div>
            </div>
          </div>

          {/* Selected Card Preview */}
          {selectedCard && (
            <div className="border-2 rounded-xl p-4 bg-slate-800" style={{ borderColor: teamColor }}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading text-base font-bold" style={{ color: teamColor }}>{selectedCard.name}</h3>
                  <p className="text-xs text-slate-400">{selectedCard.role} · #{selectedCard.number}</p>
                </div>
                <button onClick={() => setSelectedCard(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex justify-center">
                <BaseballCard card={selectedCard} isNew={false} />
              </div>
            </div>
          )}

          {/* Collected Cards */}
          {collectedCards.length > 0 && (
            <div>
              <h3 className="font-heading text-sm font-bold text-green-400 mb-3 uppercase tracking-wide">
                ✓ Collected ({collectedCards.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {collectedCards.map(card => {
                  const img = getCardImage(card.name);
                  return (
                    <button key={card.id} onClick={() => setSelectedCard(card)} className="relative group hover:scale-105 transition-transform">
                      {img ? (
                        <img src={img} alt={card.name} className="w-full rounded-lg shadow-md border-2" style={{ borderColor: teamColor }} />
                      ) : (
                        <div className="rounded-lg p-2 border-2 aspect-[2.5/3.5] flex flex-col items-center justify-center" style={{ background: `${teamColor}22`, borderColor: `${teamColor}80` }}>
                          <span className="text-xl mb-1">🧢</span>
                          <p className="font-heading text-[10px] font-bold text-white text-center leading-tight">{card.name.split(' ').slice(-1)[0]}</p>
                        </div>
                      )}
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-md rounded-tr-md">✓</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missing Cards */}
          {missingCards.length > 0 && (
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-500 mb-3 uppercase tracking-wide">
                ○ Missing ({missingCards.length})
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {missingCards.map(card => (
                  <div key={card.id} className="opacity-40">
                    <div className="bg-slate-700 rounded-lg border-2 border-slate-600 aspect-[2.5/3.5] flex flex-col items-center justify-center">
                      <span className="text-xl mb-1">❓</span>
                      <p className="font-heading text-[10px] text-slate-500 text-center">#{card.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {collectedCards.length === 0 && (
            <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
              <p className="text-2xl mb-2">🃏</p>
              <p className="font-heading text-sm text-slate-400">
                Win home games as the {meta?.label} to earn cards!
              </p>
            </div>
          )}

          {/* Complete! */}
          {progress.collected > 0 && progress.collected === progress.total && (
            <div className="rounded-xl p-4 text-center border-4 border-yellow-300" style={{ background: `linear-gradient(135deg, ${teamColor}cc, ${teamColor}66)` }}>
              <p className="font-heading text-xl font-bold text-white uppercase tracking-wider">🏆 Complete Set! 🏆</p>
              <p className="text-white/80 text-sm mt-1">You've collected the entire 1984 {meta?.label} roster!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}