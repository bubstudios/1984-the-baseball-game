import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS } from '@/lib/gameData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Trophy } from 'lucide-react';
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

  // Root Cause A fix: if an active season already exists, skip team selection
  // and go straight to the dashboard. Prevents re-entry from forcing team selection.
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
    // Store selected team and navigate to season dashboard
    // The dashboard will create the season with this team
    navigate('/season', { state: { userTeam: selected } });
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/50 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-heading text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-lg font-bold text-foreground">Season Mode</h1>
        </div>
        <div className="w-16" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-heading text-2xl font-bold text-foreground">Choose Your Team</h2>
            <p className="text-sm text-muted-foreground">
              Select the team you'll manage through the 1984 season
            </p>
          </div>

          {DIVISIONS.map((div) => (
            <div key={div.label} className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wide px-1">
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
                      className={`bg-card border-2 rounded-lg p-3 text-left transition-all ${
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

          <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border py-3 -mx-4 px-4">
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
    </div>
  );
}