import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { Play, MapPin, Users } from 'lucide-react';

export default function BallparkSelect({ userTeam, cpuTeam, onConfirm, onBack }) {
  const [selectedPark, setSelectedPark] = useState(null);
  const [selectedParkTeam, setSelectedParkTeam] = useState(null);

  const userTeamData = TEAMS[userTeam];
  const cpuTeamData = TEAMS[cpuTeam];

  const handleSelect = (park, teamKey) => {
    setSelectedPark(park);
    setSelectedParkTeam(teamKey);
  };

  const handleConfirm = () => {
    if (selectedParkTeam) {
      const useDH = TEAMS[selectedParkTeam].league === 'AL';
      onConfirm(selectedParkTeam, useDH);
    }
  };

  const ParkCard = ({ teamKey, isUser }) => {
    const team = TEAMS[teamKey];
    const isSelected = selectedPark === team.stadium;
    const leagueRule = team.league === 'AL' ? 'DH RULES' : 'NO DH — PITCHER HITS';

    return (
      <button
        onClick={() => handleSelect(team.stadium, teamKey)}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
            : 'border-border bg-card hover:border-primary/30 hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-sm text-foreground">{team.stadium}</div>
            <div className="text-[10px] text-muted-foreground">
              {team.city} {team.name} · {team.league}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className={`text-[9px] font-heading font-bold px-2 py-0.5 rounded ${
              team.league === 'AL'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              {team.league}
            </span>
          </div>
        </div>

        <div className={`rounded-lg p-3 ${
          team.league === 'AL' ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-emerald-500/5 border border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <Users className={`w-3.5 h-3.5 ${team.league === 'AL' ? 'text-amber-400' : 'text-emerald-400'}`} />
            <span className={`text-[10px] font-heading font-bold uppercase tracking-wider ${
              team.league === 'AL' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {leagueRule}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {team.league === 'AL'
              ? 'Designated hitter bats for the pitcher. Both lineups use a DH in the 9th spot.'
              : 'Pitchers bat for themselves. The 9th spot in the order is the starting pitcher.'}
          </p>
        </div>

        {isSelected && (
          <div className="mt-3 text-[10px] font-heading font-bold text-primary uppercase tracking-wider text-center">
            Selected
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
      <div className="max-w-lg w-full space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5 pt-4">
          <div className="flex items-center justify-center gap-2.5">
            <span className="text-2xl">🏟️</span>
            <h1 className="font-display text-[11px] text-primary tracking-wider">1984: THE BASEBALL SEASON</h1>
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">Choose Ballpark</h2>
          <p className="font-body text-sm text-muted-foreground">
            {userTeamData.abbr} vs {cpuTeamData.abbr} — where should they play? The home team&apos;s league determines the DH rule.
          </p>
        </div>

        {/* Ballpark cards */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Your Team — {userTeamData.name}
          </div>
          <ParkCard teamKey={userTeam} isUser={true} />

          <div className="flex items-center gap-2 text-[10px] font-heading uppercase tracking-wider text-amber-400 mt-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Opponent — {cpuTeamData.name}
          </div>
          <ParkCard teamKey={cpuTeam} isUser={false} />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-shrink-0 font-heading text-sm">
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedPark}
            className="flex-1 gap-2 font-heading text-sm py-5"
            size="lg"
          >
            <Play className="w-5 h-5" />
            {selectedPark ? `Play at ${TEAMS[selectedParkTeam]?.stadium}` : 'Select a ballpark'}
          </Button>
        </div>
      </div>
    </div>
  );
}