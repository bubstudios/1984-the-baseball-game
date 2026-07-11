import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Star, ChevronRight, ListOrdered, BarChart3, RefreshCw, Home } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

function AwardCard({ label, award, icon: Icon }) {
  if (!award) return null;
  const team = TEAMS[award.team];
  return (
    <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
      {Icon && <Icon className="w-5 h-5 text-primary shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-[9px] font-heading uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-heading text-sm font-bold text-foreground truncate">{award.name}</div>
        <div className="text-[10px] text-muted-foreground">{team ? `${team.city} ${team.name}` : award.team}</div>
        <div className="text-[10px] text-foreground/70 italic">{award.statLine}</div>
      </div>
    </div>
  );
}

export default function SeasonCompleteScreen({
  season,
  awards,
  champion,
  onViewBracket,
  onViewStandings,
  onViewLeaders,
  onStartNewSeason,
  onMainMenu,
}) {
  const champTeam = TEAMS[champion];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" />
        <h1 className="font-heading text-base font-bold text-foreground">1984 Season Complete</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {/* Champion banner */}
        {champTeam && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-5 text-center mb-4">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-2" />
            <div className="text-[9px] font-heading uppercase tracking-widest text-primary">World Series Champion</div>
            <div className="font-heading text-2xl font-bold text-foreground">
              {champTeam.city} {champTeam.name}
            </div>
          </div>
        )}

        {/* Postseason awards */}
        <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-2 mt-4">
          Postseason Awards
        </div>
        <div className="space-y-2 mb-4">
          <AwardCard label="World Series MVP" award={awards?.worldSeriesMVP} icon={Star} />
          <AwardCard label="ALCS MVP" award={awards?.alcsMVP} icon={Star} />
          <AwardCard label="NLCS MVP" award={awards?.nlcsMVP} icon={Star} />
          <AwardCard label="Postseason MVP" award={awards?.postseasonMVP} icon={Trophy} />
        </div>

        {/* Navigation buttons */}
        <div className="space-y-2 mt-6">
          <Button onClick={onViewBracket} variant="outline" className="w-full gap-2" size="sm">
            <ListOrdered className="w-4 h-4" /> View Final Bracket
          </Button>
          <Button onClick={onViewStandings} variant="outline" className="w-full gap-2" size="sm">
            <BarChart3 className="w-4 h-4" /> View Final Standings
          </Button>
          <Button onClick={onViewLeaders} variant="outline" className="w-full gap-2" size="sm">
            <Star className="w-4 h-4" /> View League Leaders
          </Button>
          <Button onClick={onStartNewSeason} className="w-full gap-2" size="sm">
            <RefreshCw className="w-4 h-4" /> Start New Season
          </Button>
          <Button onClick={onMainMenu} variant="ghost" className="w-full gap-2" size="sm">
            <Home className="w-4 h-4" /> Return to Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
}