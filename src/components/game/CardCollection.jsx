import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BaseballCard from './BaseballCard';
import { TIGERS_ROSTER, getCollectedCards, getCollectionProgress, loadCollectionFromStorage } from '@/lib/tigersBaseballCards';
import { PHILLIES_ROSTER, getPhilliesCollectedCards, getPhilliesCollectionProgress, loadPhilliesCollectionFromStorage } from '@/lib/philliesBaseballCards';

export default function CardCollection({ onClose }) {
  const [activeTeam, setActiveTeam] = useState('tigers');
  const [selectedCard, setSelectedCard] = useState(null);

  // Tigers state
  const [tigersCollected, setTigersCollected] = useState([]);
  const [tigersProgress, setTigersProgress] = useState({ collected: 0, total: 0, percentage: 0 });

  // Phillies state
  const [philliesCollected, setPhilliesCollected] = useState([]);
  const [philliesProgress, setPhilliesProgress] = useState({ collected: 0, total: 0, percentage: 0 });

  useEffect(() => {
    loadCollectionFromStorage();
    setTigersCollected(getCollectedCards());
    setTigersProgress(getCollectionProgress());

    loadPhilliesCollectionFromStorage();
    setPhilliesCollected(getPhilliesCollectedCards());
    setPhilliesProgress(getPhilliesCollectionProgress());
  }, []);

  const isTigers = activeTeam === 'tigers';
  const roster = isTigers ? TIGERS_ROSTER : PHILLIES_ROSTER;
  const collectedIds = isTigers ? tigersCollected : philliesCollected;
  const progress = isTigers ? tigersProgress : philliesProgress;

  const collectedDetails = collectedIds.map(id => roster.find(p => p.id === id)).filter(Boolean);
  const missingCards = roster.filter(p => !collectedIds.includes(p.id));

  const teamColor = isTigers ? '#f97316' : '#c0392b';
  const teamLabel = isTigers ? '🐯 Tigers' : '⚾ Phillies';
  const teamYear = '1984';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border-4 max-w-5xl w-full max-h-[90vh] overflow-y-auto" style={{ borderColor: teamColor }}>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between" style={{ borderBottom: `4px solid ${teamColor}` }}>
          <div>
            <h2 className="font-heading text-3xl font-bold uppercase tracking-wider" style={{ color: teamColor }}>
              Card Collection
            </h2>
            <p className="text-sm text-slate-300 mt-1">{teamYear} Season Roster</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-8 h-8" style={{ color: teamColor }} />
          </button>
        </div>

        {/* Team switcher */}
        <div className="px-6 pt-4 flex gap-3">
          <button
            onClick={() => { setActiveTeam('tigers'); setSelectedCard(null); }}
            className={`flex-1 py-2 rounded-lg font-heading font-bold text-sm transition-all border-2 ${
              isTigers ? 'bg-orange-500/20 border-orange-400 text-orange-300' : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-orange-500/50'
            }`}
          >
            🐯 Detroit Tigers
          </button>
          <button
            onClick={() => { setActiveTeam('phillies'); setSelectedCard(null); }}
            className={`flex-1 py-2 rounded-lg font-heading font-bold text-sm transition-all border-2 ${
              !isTigers ? 'bg-red-500/20 border-red-400 text-red-300' : 'bg-slate-700 border-slate-600 text-slate-400 hover:border-red-500/50'
            }`}
          >
            ⚾ Philadelphia Phillies
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold" style={{ color: teamColor }}>Collection Progress</span>
              <span className="font-heading font-bold text-lg text-white">{progress.collected} / {progress.total}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden border-2" style={{ borderColor: teamColor }}>
              <div
                className="h-full flex items-center justify-center font-heading font-bold text-slate-900 text-sm transition-all duration-300"
                style={{ width: `${progress.percentage}%`, background: `linear-gradient(90deg, ${teamColor}, ${teamColor}cc)` }}
              >
                {progress.percentage > 10 && `${progress.percentage}%`}
              </div>
            </div>
          </div>

          {/* Selected Card View */}
          {selectedCard && (
            <div className="border-4 rounded-lg p-6 bg-slate-800" style={{ borderColor: teamColor }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold" style={{ color: teamColor }}>Card Preview</h3>
                <button onClick={() => setSelectedCard(null)} style={{ color: teamColor }}>
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
                <button key={card.id} onClick={() => setSelectedCard(card)} className="relative group cursor-pointer">
                  <div className="rounded-lg p-3 border-2 h-full hover:shadow-lg transition-all" style={{ background: `${teamColor}22`, borderColor: `${teamColor}80` }}>
                    <div className="text-3xl mb-2 text-center">{card.position?.includes('P') || card.position === 'CL' || card.position === 'RP' || card.position === 'SP' ? '⚾' : '🧢'}</div>
                    <p className="font-heading text-xs font-bold text-white text-center truncate">{card.name.split(' ').slice(-1)[0]}</p>
                    <p className="text-[9px] text-slate-300 text-center">#{card.number}</p>
                  </div>
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">✓</div>
                </button>
              ))}
            </div>
          </div>

          {/* Missing Cards */}
          {missingCards.length > 0 && (
            <div>
              <h3 className="font-heading text-xl font-bold text-slate-400 mb-4 uppercase">○ Missing ({missingCards.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {missingCards.map(card => (
                  <div key={card.id} className="relative opacity-60">
                    <div className="bg-slate-700 rounded-lg p-3 border-2 border-slate-500 h-full">
                      <div className="text-3xl mb-2 text-center text-slate-500">❓</div>
                      <p className="font-heading text-xs font-bold text-slate-400 text-center">Unknown</p>
                      <p className="text-[9px] text-slate-500 text-center">#{card.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion */}
          {progress.collected === progress.total && progress.total > 0 && (
            <div className="rounded-lg p-6 text-center border-4 border-yellow-300" style={{ background: `linear-gradient(135deg, ${teamColor}, ${teamColor}88)` }}>
              <p className="font-heading text-2xl font-bold text-white uppercase tracking-wider">
                🏆 Complete Collection! 🏆
              </p>
              <p className="text-white/80 mt-2">You've collected the entire 1984 {isTigers ? 'Tigers' : 'Phillies'} roster!</p>
            </div>
          )}

          {/* Earn cards hint */}
          {progress.collected === 0 && (
            <div className="bg-slate-800 rounded-lg p-4 text-center border border-slate-600">
              <p className="text-sm text-slate-400 font-heading">
                Win home games as the {isTigers ? 'Tigers' : 'Phillies'} to earn cards!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}