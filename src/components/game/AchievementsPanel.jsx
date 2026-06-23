import React from 'react';
import { ACHIEVEMENTS, loadAchievements, resetAchievements } from '@/lib/achievements';
import { Trophy, Lock, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import CardCollection from './CardCollection';

const CATEGORY_INFO = {
  first: { label: 'First-Time', color: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  hitting: { label: 'Hitting', color: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  pitching: { label: 'Pitching', color: 'bg-blue-500/10 border-blue-500/20', dot: 'bg-blue-400' },
  defense: { label: 'Defense', color: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  comeback: { label: 'Comebacks', color: 'bg-purple-500/10 border-purple-500/20', dot: 'bg-purple-400' },
  funny: { label: 'Funny / Hidden', color: 'bg-pink-500/10 border-pink-500/20', dot: 'bg-pink-400' },
  '1984': { label: '1984-Themed', color: 'bg-yellow-500/10 border-yellow-500/20', dot: 'bg-yellow-400' },
  rare: { label: 'Very Rare', color: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  milestone: { label: 'Milestones', color: 'bg-cyan-500/10 border-cyan-500/20', dot: 'bg-cyan-400' },
  streak: { label: 'Streaks', color: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400' },
  community: { label: 'Community', color: 'bg-teal-500/10 border-teal-500/20', dot: 'bg-teal-400' },
  hidden: { label: 'Hidden', color: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400' },
  teamSpecific: { label: 'Team-Specific', color: 'bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-400' },
  multiTeam: { label: 'Multi-Team', color: 'bg-violet-500/10 border-violet-500/20', dot: 'bg-violet-400' },
  ejection: { label: 'Arguments', color: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
  fan: { label: 'Fan Chatter', color: 'bg-lime-500/10 border-lime-500/20', dot: 'bg-lime-400' },
  victory: { label: 'Victory Traditions', color: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
};

const categoryOrder = ['first', 'hitting', 'pitching', 'defense', 'comeback', 'funny', '1984', 'rare', 'milestone', 'streak', 'victory', 'community', 'fan', 'hidden', 'teamSpecific', 'multiTeam', 'ejection'];

const TEAM_LABELS = {
  reds: 'CIN',
  cubs: 'CHC',
  mets: 'NYM',
  dodgers: 'LAD',
  padres: 'SD',
  tigers: 'DET',
  redsox: 'BOS',
  yankees: 'NYY',
  orioles: 'BAL',
  phillies: 'PHI',
  royals: 'KC',
};

export default function AchievementsPanel() {
  const [tab, setTab] = useState('achievements');
  const [unlocked, setUnlocked] = useState(loadAchievements());
  const [confirmReset, setConfirmReset] = useState(false);
  const totalUnlocked = Object.keys(unlocked).length;
  const total = ACHIEVEMENTS.length;

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAchievements();
    setUnlocked({});
    setConfirmReset(false);
  };

  // Group achievements by category
  const grouped = {};
  ACHIEVEMENTS.forEach(ach => {
    if (!grouped[ach.category]) grouped[ach.category] = [];
    grouped[ach.category].push(ach);
  });

  return (
    <div className="space-y-4">
      {/* Tab Buttons */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setTab('achievements')}
          className={`flex-1 py-2 px-3 font-heading text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            tab === 'achievements'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Trophy className="w-4 h-4" />
          Achievements
        </button>
        <button
          onClick={() => setTab('cards')}
          className={`flex-1 py-2 px-3 font-heading text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            tab === 'cards'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Zap className="w-4 h-4" />
          Cards
        </button>
      </div>

      {/* Cards Tab */}
      {tab === 'cards' && <CardCollection onClose={() => setTab('achievements')} />}

      {/* Achievements Tab */}
      {tab === 'achievements' && (
        <div className="space-y-4">
          {/* Progress header */}
          <div className="bg-card border border-border rounded-xl p-3 text-center relative">
            <button
              onClick={handleReset}
              className={`absolute top-2 right-2 h-7 px-2 rounded-md text-[10px] font-heading transition-all ${
                confirmReset
                  ? 'bg-destructive/20 border border-destructive/40 text-destructive'
                  : 'bg-muted/30 border border-muted/20 text-muted-foreground/50 hover:text-destructive/70 hover:border-destructive/30'
              }`}
            >
              {confirmReset ? 'Confirm?' : <Trash2 className="w-3 h-3" />}
            </button>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-heading text-sm text-foreground">Achievements</span>
            </div>
            <div className="text-[10px] text-muted-foreground">
              {totalUnlocked} of {total} unlocked
            </div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${(totalUnlocked / total) * 100}%` }}
              />
            </div>
          </div>

          {/* Grouped achievement lists */}
          {categoryOrder.map(cat => {
            const items = grouped[cat];
            if (!items || items.length === 0) return null;
            const info = CATEGORY_INFO[cat] || { label: cat, color: 'bg-muted', dot: 'bg-muted-foreground' };
            const unlockedInCat = items.filter(a => !!unlocked[a.id]).length;

            return (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${info.dot}`} />
                  <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-foreground/70">
                    {info.label}
                  </span>
                  <span className="text-[9px] text-foreground/50">
                    {unlockedInCat}/{items.length}
                  </span>
                </div>
                <div className="grid gap-1">
                  {items.map(ach => {
                    const isDone = !!unlocked[ach.id];
                    return (
                      <div
                        key={ach.id}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all ${
                          isDone ? `${info.color} opacity-100` : 'border-border/40 bg-card/60 opacity-75'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center text-sm shrink-0 ${
                          isDone ? 'bg-background' : 'bg-muted/40'
                        }`}>
                          {ach.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-heading text-[10px] font-bold block truncate ${isDone ? 'text-foreground' : 'text-foreground/60'}`}>
                              {ach.name}
                            </span>
                            {ach.team && TEAM_LABELS[ach.team] && (
                              <span className="text-[7px] font-heading font-bold bg-rose-500/20 text-rose-400 rounded px-1 py-px uppercase tracking-wider shrink-0">
                                {TEAM_LABELS[ach.team]}
                              </span>
                            )}
                          </div>
                          <p className={`text-[8px] truncate ${isDone ? 'text-foreground/50' : 'text-foreground/40'}`}>
                            {ach.desc}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isDone ? (
                            <Trophy className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Lock className="w-3 h-3 text-muted-foreground/30" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}