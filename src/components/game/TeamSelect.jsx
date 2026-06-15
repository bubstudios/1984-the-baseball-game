import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { Play } from 'lucide-react';

export default function TeamSelect({ onSelect }) {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const teamKeys = Object.keys(TEAMS);

  const handleStart = () => {
    if (homeTeam && awayTeam && homeTeam !== awayTeam) {
      onSelect(homeTeam, awayTeam);
    }
  };

  const Rating = ({ label, value, max = 10 }) => (
    <div className="flex items-center gap-1.5">
      <span className="text-[9px] text-muted-foreground w-12">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-3 rounded-sm ${i < value ? 'bg-primary' : 'bg-muted'}`}
          />
        ))}
      </div>
      <span className="text-[9px] text-foreground font-bold w-4">{value}</span>
    </div>
  );

  const TeamCard = ({ teamKey, selected, onClick, label }) => {
    const team = TEAMS[teamKey];
    if (!team) return null;
    const topHitter = [...team.lineup].sort((a, b) => b.power + b.contact - (a.power + a.contact))[0];
    const topPitcher = [...team.rotation].sort((a, b) => (b.pitchSpeed + b.offSpeed) - (a.pitchSpeed + a.offSpeed))[0];

    return (
      <button
        onClick={() => onClick(teamKey)}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
          selected
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card hover:border-primary/30 hover:bg-card/80'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="font-heading font-bold text-sm text-foreground">{team.city}</div>
            <div className="font-heading text-xs text-muted-foreground">{team.name}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">{team.league}</div>
            <div className="text-[10px] text-primary font-bold">{team.abbr}</div>
          </div>
        </div>
        <div className="border-t border-border/50 pt-2 space-y-1">
          <div className="text-[9px] text-muted-foreground font-heading">Top Hitter: {topHitter?.name}</div>
          <Rating label="Contact" value={topHitter?.contact || 0} />
          <Rating label="Power" value={topHitter?.power || 0} />
          <div className="text-[9px] text-muted-foreground font-heading mt-1">Top Pitcher: {topPitcher?.name}</div>
          <Rating label="Speed" value={topPitcher?.pitchSpeed || 0} />
          <Rating label="OffSpd" value={topPitcher?.offSpeed || 0} />
        </div>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">⚾</span>
            <h1 className="font-display text-[10px] text-primary tracking-wider">BASEBALL SIM</h1>
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">1984 Season</h2>
          <p className="font-body text-sm text-muted-foreground">
            Choose two teams to face off. Real 1984 rosters. Ratings 1-10 based on actual stats.
          </p>
        </div>

        {/* Home Team Selection */}
        <div>
          <h3 className="font-heading text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Home Team</h3>
          <div className="grid grid-cols-2 gap-2">
            {teamKeys.map(key => (
              <TeamCard
                key={key}
                teamKey={key}
                selected={homeTeam === key}
                onClick={setHomeTeam}
                label="Home"
              />
            ))}
          </div>
        </div>

        {/* Away Team Selection */}
        <div>
          <h3 className="font-heading text-xs font-bold text-foreground mb-2 uppercase tracking-wider">Away Team</h3>
          <div className="grid grid-cols-2 gap-2">
            {teamKeys.map(key => (
              <TeamCard
                key={key}
                teamKey={key}
                selected={awayTeam === key}
                onClick={setAwayTeam}
                label="Away"
              />
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          onClick={handleStart}
          disabled={!homeTeam || !awayTeam || homeTeam === awayTeam}
          className="w-full gap-2 font-heading text-sm py-5"
          size="lg"
        >
          <Play className="w-5 h-5" />
          {homeTeam && awayTeam && homeTeam === awayTeam
            ? 'Choose different teams'
            : `Play Ball! ${TEAMS[awayTeam]?.abbr || '---'} @ ${TEAMS[homeTeam]?.abbr || '---'}`}
        </Button>

        <p className="text-[10px] text-muted-foreground/50 text-center font-body">
          You pitch with the home team and bat with both
        </p>
      </div>
    </div>
  );
}