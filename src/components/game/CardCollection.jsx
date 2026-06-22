import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BaseballCard from './BaseballCard';
import { TIGERS_ROSTER, getCollectedCards, getCollectionProgress, loadCollectionFromStorage } from '@/lib/tigersBaseballCards';

export default function CardCollection({ onClose }) {
  const [collectedCards, setCollectedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [progress, setProgress] = useState({ collected: 0, total: 0, percentage: 0 });

  useEffect(() => {
    loadCollectionFromStorage();
    const collected = getCollectedCards();
    setCollectedCards(collected);
    setProgress(getCollectionProgress());
  }, []);

  const collectedDetails = collectedCards.map(cardId => 
    TIGERS_ROSTER.find(p => p.id === cardId)
  ).filter(Boolean);

  const missingCards = TIGERS_ROSTER.filter(p => !collectedCards.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border-4 border-yellow-400 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 border-b-4 border-yellow-400 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-3xl font-bold text-yellow-300 uppercase tracking-wider">
              Tigers Card Collection
            </h2>
            <p className="text-sm text-yellow-200 mt-1">1984 Season Roster</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-yellow-400/20 transition-colors"
          >
            <X className="w-8 h-8 text-yellow-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-yellow-300">Collection Progress</span>
              <span className="font-heading font-bold text-lg text-white">
                {progress.collected} / {progress.total}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden border-2 border-yellow-400">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-400 h-full flex items-center justify-center font-heading font-bold text-slate-900 text-sm transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              >
                {progress.percentage > 10 && `${progress.percentage}%`}
              </div>
            </div>
          </div>

          {/* Selected Card View */}
          {selectedCard && (
            <div className="border-4 border-yellow-400 rounded-lg p-6 bg-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-yellow-300">Card Preview</h3>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-center">
                <BaseballCard card={selectedCard} isNew={false} />
              </div>
            </div>
          )}

          {/* Collected Cards */}
          <div>
            <h3 className="font-heading text-xl font-bold text-green-400 mb-4 uppercase">
              ✓ Collected ({collectedDetails.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {collectedDetails.map(card => (
                <button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className="relative group cursor-pointer"
                >
                  <div className="bg-gradient-to-b from-red-500 to-red-600 rounded-lg p-3 border-2 border-yellow-300 h-full hover:shadow-lg hover:shadow-yellow-400/50 transition-all">
                    <div className="text-3xl mb-2 text-center">{card.position === 'P' ? '⚾' : '🧢'}</div>
                    <p className="font-heading text-xs font-bold text-white text-center truncate">{card.name.split(' ')[1]}</p>
                    <p className="text-[9px] text-yellow-200 text-center">#{card.number}</p>
                  </div>
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                    ✓
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Missing Cards */}
          {missingCards.length > 0 && (
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-400 mb-4 uppercase">
                ○ Missing ({missingCards.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {missingCards.map(card => (
                  <div key={card.id} className="relative group cursor-pointer">
                    <div className="bg-slate-700 rounded-lg p-3 border-2 border-slate-500 h-full opacity-60">
                      <div className="text-3xl mb-2 text-center text-slate-500">❓</div>
                      <p className="font-heading text-xs font-bold text-slate-400 text-center">Unknown</p>
                      <p className="text-[9px] text-slate-500 text-center">#{card.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Message */}
          {progress.collected === progress.total && (
            <div className="bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg p-6 text-center border-4 border-yellow-300">
              <p className="font-heading text-2xl font-bold text-slate-900 uppercase tracking-wider">
                🏆 Complete Collection! 🏆
              </p>
              <p className="text-slate-900 mt-2">You've collected the entire 1984 Tigers roster!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}