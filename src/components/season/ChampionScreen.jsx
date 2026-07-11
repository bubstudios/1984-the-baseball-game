import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, ChevronRight } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

export default function ChampionScreen({ champion, onClose }) {
  const team = TEAMS[champion];
  if (!team) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl p-8 text-center">
        <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
        <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2">
          1984 World Series Champions
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          {team.city} {team.name}
        </h1>
        <div className="text-sm text-muted-foreground mb-6">
          Congratulations to the {team.name}!
        </div>
        <Button onClick={onClose} className="w-full gap-2" size="lg">
          Continue <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}