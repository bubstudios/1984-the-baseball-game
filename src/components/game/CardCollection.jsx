import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import BaseballCard from './BaseballCard';
import { ALL_ROSTERS_FULL as ALL_ROSTERS, TEAM_CARD_META, getCollectedIds, getProgress, loadFromStorage } from '@/lib/baseballCards';
import { getCardImage } from '@/lib/cardImages';
import { getAllQuestProgress } from '@/lib/adQuests';

const TEAM_KEYS = Object.keys(TEAM_CARD_META);

export default function CardCollection({ onClose }) {
  const [activeTeam, setActiveTeam] = useState(TEAM_KEYS[0]);
  const [activeTab, setActiveTab] = useState('cards');
  const [selectedCard, setSelectedCard] = useState(null);
  const [collectionData, setCollectionData] = useState({});
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    const data = {};
    TEAM_KEYS.forEach(key => {
      loadFromStorage(key);
      data[key] = {
        collectedIds: getCollectedIds(key),
        progress: getProgress(key),
      };
    });
    setCollectionData(data);
    setQuests(getAllQuestProgress());
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

  const completedQuests = quests.filter(q => q.completed);
  const activeQuests = quests.filter(q => !q.completed);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
      <div className="bg-slate-900 rounded-2xl border-4 max-w-5xl w-full max-h-[95vh] flex flex-col" style={{ borderColor: teamColor }}>

        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-slate-800 to-slate-900 px-4 py-3 flex items-center justify-between rounded-t-xl" style={{ borderBottom: `3px solid ${teamColor}` }}>
          <div>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-wider" style={{ color: teamColor }}>
              Card Collection
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">1984 Season — Win games & explore ads to earn cards</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" style={{ color: teamColor }} />
          </button>
        </div>

        {/* Main Tabs */}
        <div className="shrink-0 px-4 flex gap-4 border-b border-slate-700">
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-2.5 font-heading text-sm font-bold transition-colors border-b-2 -mb-px ${activeTab === 'cards' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            🃏 Cards
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`py-2.5 font-heading text-sm font-bold transition-colors border-b-2 -mb-px ${activeTab === 'quests' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            🗺️ Ad Quests
            {completedQuests.length > 0 && (
              <span className="ml-1.5 text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                {completedQuests.length}
              </span>
            )}
          </button>
        </div>

        {/* ── CARDS TAB ── */}
        {activeTab === 'cards' && (
          <>
            {/* Team tabs */}
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
                      className="px-3 py-1.5 rounded-lg font-heading text-xs font-bold transition-all border-2 whitespace-nowrap"
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
                  <p className="text-xs text-slate-500 mt-1">Also: tap broadcast ads during games to complete quests for bonus cards.</p>
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
          </>
        )}

        {/* ── QUESTS TAB ── */}
        {activeTab === 'quests' && (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            <p className="text-xs text-slate-400 font-body">
              Tap broadcast ads during games to make progress. Complete each quest to earn a bonus card from a specific 1984 team.
            </p>

            {/* Completed Quests */}
            {completedQuests.length > 0 && (
              <div>
                <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-green-400 mb-2">✓ Completed ({completedQuests.length})</h3>
                {completedQuests.map(q => (
                  <div key={q.id} className="mb-2 rounded-xl px-4 py-3 bg-green-900/30 border border-green-500/40 flex items-center gap-3">
                    <span className="text-2xl">{q.reward.type === 'card' ? '🎴' : '⭐'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-green-300">{q.name}</p>
                      <p className="text-xs text-slate-400 truncate">{q.desc}</p>
                    </div>
                    <span className="text-[10px] font-heading text-green-400 bg-green-500/20 px-2 py-1 rounded-full shrink-0">DONE</span>
                  </div>
                ))}
              </div>
            )}

            {/* Active Quests */}
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">🗺️ In Progress ({activeQuests.length})</h3>
              {activeQuests.map(q => {
                const pct = Math.min(100, Math.round((q.progress / q.goal) * 100));
                const rewardMeta = TEAM_CARD_META[q.reward.team];
                return (
                  <div key={q.id} className="mb-3 rounded-xl px-4 py-3 bg-slate-800 border border-slate-600">
                    <div className="flex items-start gap-3 mb-2">
                      <span className="text-2xl shrink-0">🎴</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-bold text-white">{q.name}</p>
                        <p className="text-xs text-slate-400">{q.desc}</p>
                      </div>
                    </div>
                    {/* Clue */}
                    <p className="text-[11px] italic text-amber-300/80 mb-2 pl-9">"{q.reward.clue}"</p>
                    {/* Progress bar */}
                    <div className="pl-9">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: rewardMeta?.color || '#f59e0b' }}
                          />
                        </div>
                        <span className="text-[10px] font-heading text-slate-400 shrink-0">{q.progress}/{q.goal}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Reward: bonus card — {rewardMeta?.label || q.reward.team}
                      </p>
                    </div>
                  </div>
                );
              })}

              {activeQuests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-3xl mb-2">🏆</p>
                  <p className="font-heading text-sm text-amber-400">All quests complete! You're a true 1984 broadcast fan.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}