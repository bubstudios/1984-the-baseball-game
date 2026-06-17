import React from 'react';
import { ACHIEVEMENTS, loadAchievements } from '@/lib/achievements';
import { Trophy, Lock } from 'lucide-react';

const CATEGORY_COLORS = {
  batting: 'bg-amber-500/10 border-amber-500/30',
  pitching: 'bg-blue-500/10 border-blue-500/30',
  running: 'bg-emerald-500/10 border-emerald-500/30',
  game: 'bg-purple-500/10 border-purple-500/30',
};

const CATEGORY_DOTS = {
  batting: 'bg-amber-400',
  pitching: 'bg-blue-400',
  running: 'bg-emerald-400',
  game: 'bg-purple-400',
};

export default function AchievementsPanel() {
  const unlocked = loadAchievements();
  const totalUnlocked = Object.keys(unlocked).length;
  const total = ACHIEVEMENTS.length;

  return (
    <div className="space-y-4">
      {/* Progress header */}
      <div className="bg-card border border-border rounded-xl p-3 text-center">
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

      {/* Achievement grid */}
      <div className="grid gap-1.5">
        {ACHIEVEMENTS.map((ach) => {
          const isDone = !!unlocked[ach.id];
          return (
            <div
              key={ach.id}
              className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all ${
                isDone
                  ? `${CATEGORY_COLORS[ach.category]} opacity-100`
                  : 'border-border/40 bg-card/50 opacity-50'
              }`}
            >
              {/* Icon */}
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${
                isDone ? 'bg-background' : 'bg-muted/50'
              }`}>
                {ach.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${isDone ? CATEGORY_DOTS[ach.category] : 'bg-muted-foreground/30'}`} />
                  <span className={`font-heading text-[11px] font-bold ${isDone ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {ach.name}
                  </span>
                </div>
                <p className={`text-[9px] ${isDone ? 'text-foreground/60' : 'text-muted-foreground/50'} truncate`}>
                  {ach.desc}
                </p>
              </div>

              {/* Status */}
              <div className="shrink-0">
                {isDone ? (
                  <Trophy className="w-4 h-4 text-primary" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-muted-foreground/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}