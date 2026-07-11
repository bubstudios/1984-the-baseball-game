import React, { useState, useEffect } from 'react';
import { X, Trophy, Lock, EyeOff, Star, Award, Crown, Zap, Target, Shield, Flame, AlertTriangle, Repeat, Calendar, Anchor } from 'lucide-react';
import { ACHIEVEMENTS, ACHIEVEMENT_CATEGORIES } from '@/lib/seasonAchievements/achievementCatalog';
import { getUnlockedMap } from '@/lib/seasonAchievements/achievementEngine';

const CATEGORY_ICONS = {
  Calendar, Trophy, Zap, Target, Shield, Flame, AlertTriangle, Star, Repeat, Award, Crown, Anchor, EyeOff,
};

const RARITY_COLORS = {
  Common: 'text-slate-400 bg-slate-700/50',
  Uncommon: 'text-emerald-400 bg-emerald-900/30',
  Rare: 'text-blue-400 bg-blue-900/30',
  Epic: 'text-purple-400 bg-purple-900/30',
  Legendary: 'text-amber-400 bg-amber-900/30',
};

export default function AchievementsGallery({ onClose }) {
  const [unlockedMap, setUnlockedMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const map = await getUnlockedMap();
        setUnlockedMap(map);
      } catch (e) { /* non-fatal */ }
      setLoading(false);
    })();
  }, []);

  const filtered = activeCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory);

  const unlockedCount = ACHIEVEMENTS.filter(a => unlockedMap[a.id]).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPct = Math.round((unlockedCount / totalCount) * 100);

  // Rarity counts
  const rarityCounts = {};
  for (const ach of ACHIEVEMENTS) {
    if (!rarityCounts[ach.rarity]) rarityCounts[ach.rarity] = { unlocked: 0, total: 0 };
    rarityCounts[ach.rarity].total++;
    if (unlockedMap[ach.id]) rarityCounts[ach.rarity].unlocked++;
  }

  return (
    <div className="fixed inset-0 z-[150] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">Achievements</h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {unlockedCount} of {totalCount} unlocked ({progressPct}%)
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="shrink-0 px-4 py-2 bg-card/50 border-b border-border">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-amber-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {/* Rarity summary */}
        <div className="flex flex-wrap gap-2 mt-2">
          {['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'].map(r => {
            const rc = rarityCounts[r];
            if (!rc) return null;
            return (
              <span key={r} className={`text-[9px] font-heading font-bold px-1.5 py-0.5 rounded ${RARITY_COLORS[r]}`}>
                {r}: {rc.unlocked}/{rc.total}
              </span>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div className="shrink-0 px-4 py-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-heading font-bold transition-all whitespace-nowrap ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted/50'}`}
          >
            All
          </button>
          {ACHIEVEMENT_CATEGORIES.map(cat => {
            const Icon = CATEGORY_ICONS[cat.icon] || Trophy;
            const count = ACHIEVEMENTS.filter(a => a.category === cat.id).length;
            const unlocked = ACHIEVEMENTS.filter(a => a.category === cat.id && unlockedMap[a.id]).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-heading font-bold transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted/50'}`}
              >
                <Icon className="w-3 h-3" />
                {cat.label}
                <span className="opacity-60">{unlocked}/{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-w-4xl mx-auto">
            {filtered.map(ach => {
              const unlocked = !!unlockedMap[ach.id];
              const isHidden = ach.hidden && !unlocked;
              return (
                <div
                  key={ach.id}
                  className={`rounded-lg border p-2.5 transition-all ${unlocked
                    ? 'border-primary/30 bg-card'
                    : 'border-border bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Icon */}
                    <div className={`shrink-0 w-7 h-7 rounded flex items-center justify-center ${unlocked ? 'bg-primary/20' : 'bg-muted'}`}>
                      {unlocked ? (
                        <Trophy className="w-4 h-4 text-primary" />
                      ) : isHidden ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className={`font-heading text-xs font-bold leading-tight ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {isHidden ? '???' : ach.title}
                        </h3>
                      </div>
                      <p className={`text-[10px] leading-snug mt-0.5 ${unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {isHidden ? 'Hidden achievement - keep playing to discover it.' : ach.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[8px] font-heading font-bold px-1 py-0.5 rounded ${RARITY_COLORS[ach.rarity] || RARITY_COLORS.Common}`}>
                          {ach.rarity}
                        </span>
                        {unlocked && unlockedMap[ach.id]?.unlockedAtDate && (
                          <span className="text-[8px] text-muted-foreground font-heading">
                            {unlockedMap[ach.id].unlockedAtDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}