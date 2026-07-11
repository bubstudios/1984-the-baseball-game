import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS } from '@/lib/gameData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy, Newspaper } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const DIVISIONS = [
  { label: 'AL East', teams: ['yankees', 'redsox', 'orioles', 'bluejays', 'brewers', 'tigers', 'indians'] },
  { label: 'AL West', teams: ['royals', 'whitesox', 'twins', 'angels', 'athletics', 'mariners', 'rangers'] },
  { label: 'NL East', teams: ['phillies', 'mets', 'cardinals', 'cubs', 'pirates', 'expos'] },
  { label: 'NL West', teams: ['reds', 'braves', 'dodgers', 'giants', 'padres', 'astros'] },
];

export default function SeasonTeamSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const seasons = await base44.entities.Season.filter({ status: 'active' });
        if (seasons.length > 0) {
          navigate('/season', { replace: true });
          return;
        }
      } catch (e) {
        console.error('Failed to check for active season:', e);
      }
      setChecking(false);
    })();
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (!selected) return;
    navigate('/season', { state: { userTeam: selected } });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Compact Header */}
      <div className="shrink-0 border-b border-border bg-card/50 px-4 py-2 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-xs font-heading text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-base font-bold text-foreground">1984 Season Mode</h1>
        </div>
        <div className="w-12" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Newspaper-style intro */}
          <div className="bg-stone-100 dark:bg-card border border-stone-300 dark:border-border rounded-xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Newspaper className="w-4 h-4 text-stone-600 dark:text-primary" />
              <span className="text-[9px] font-heading font-bold text-stone-600 dark:text-muted-foreground uppercase tracking-widest">Season Preview</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-stone-800 dark:text-foreground mb-1">Choose Your Franchise</h2>
            <p className="text-xs text-stone-600 dark:text-muted-foreground font-body">
              162 games. 26 teams. One shot at October glory.
            </p>
          </div>

          {DIVISIONS.map((div) => (
            <div key={div.label} className="space-y-2">
              <h3 className="font-heading text-xs font-bold text-primary uppercase tracking-wide px-1">
                {div.label}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {div.teams.map((key) => {
                  const team = TEAMS[key];
                  if (!team) return null;
                  const isSelected = selected === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`bg-card border-2 rounded-lg p-2.5 text-left transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="font-heading text-sm font-bold text-foreground truncate">
                            {team.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {team.city} · {team.abbr}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-primary text-sm shrink-0 ml-2">✓</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          <div className="h-16" />
        </div>
      </div>

      {/* Sticky Confirm */}
      <div className="shrink-0 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full gap-2"
            size="lg"
          >
            <Trophy className="w-5 h-5" />
            {selected
              ? `Start Season with ${TEAMS[selected].name}`
              : 'Select a team to continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}