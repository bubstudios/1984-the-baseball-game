import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { Play, User, Cpu } from 'lucide-react';

// MLB team logo IDs for mlbstatic.com
const TEAM_LOGOS = {
  tigers: 'https://www.mlbstatic.com/team-logos/116.svg',
  padres: 'https://www.mlbstatic.com/team-logos/135.svg',
  cubs: 'https://www.mlbstatic.com/team-logos/112.svg',
  mets: 'https://www.mlbstatic.com/team-logos/121.svg',
  redsox: 'https://www.mlbstatic.com/team-logos/111.svg',
  yankees: 'https://www.mlbstatic.com/team-logos/147.svg',
  orioles: 'https://www.mlbstatic.com/team-logos/110.svg',
  dodgers: 'https://www.mlbstatic.com/team-logos/119.svg',
};

const alTeams = Object.keys(TEAMS).filter(k => TEAMS[k].league === 'AL');
const nlTeams = Object.keys(TEAMS).filter(k => TEAMS[k].league === 'NL');

export default function TeamSelect({ onSelect }) {
  const [userTeam, setUserTeam] = useState(null);
  const [cpuTeam, setCpuTeam] = useState(null);

  const handleTeamClick = (teamKey) => {
    if (userTeam === teamKey) {
      setUserTeam(null);
    } else if (cpuTeam === teamKey) {
      setCpuTeam(null);
    } else if (!userTeam) {
      setUserTeam(teamKey);
    } else if (!cpuTeam) {
      setCpuTeam(teamKey);
    }
  };

  const handleStart = () => {
    if (userTeam && cpuTeam) {
      onSelect(userTeam, cpuTeam);
    }
  };

  const RatingPills = ({ value, max = 10 }) => (
    <div className="flex items-center gap-0.5">
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <div
            key={i}
            className={`w-1.5 h-2.5 rounded-sm ${i < value ? 'bg-primary' : 'bg-muted/60'}`}
          />
        ))}
      </div>
      <span className="text-[10px] text-foreground font-bold ml-1 w-3 text-right">{value}</span>
    </div>
  );

  const TeamCard = ({ teamKey }) => {
    const team = TEAMS[teamKey];
    if (!team) return null;
    const topHitter = [...team.lineup].sort((a, b) => b.power + b.contact - (a.power + a.contact))[0];
    const topPitcher = [...team.rotation].sort((a, b) => (b.pitchSpeed + b.offSpeed) - (a.pitchSpeed + a.offSpeed))[0];

    const isUser = userTeam === teamKey;
    const isCpu = cpuTeam === teamKey;
    const isSelected = isUser || isCpu;

    return (
      <button
        onClick={() => handleTeamClick(teamKey)}
        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
          isUser
            ? 'border-emerald-400 bg-emerald-400/5 shadow-lg shadow-emerald-400/10'
            : isCpu
            ? 'border-amber-400 bg-amber-400/5 shadow-lg shadow-amber-400/10'
            : 'border-border bg-card hover:border-primary/30 hover:bg-card/80'
        }`}
      >
        <div className="flex items-center gap-2.5 mb-2">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full bg-muted/80 flex items-center justify-center overflow-hidden flex-shrink-0">
            <img
              src={TEAM_LOGOS[teamKey]}
              alt={team.abbr}
              className="w-7 h-7 object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <span className="hidden font-display text-[8px] text-primary font-bold">{team.abbr}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-xs text-foreground truncate">{team.city}</div>
            <div className="font-heading text-[11px] text-muted-foreground">{team.name}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[9px] text-primary font-heading">{team.league}</div>
            <div className="text-[10px] text-primary/80 font-bold font-heading">{team.abbr}</div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-2 space-y-1">
          <div className="text-[9px] text-muted-foreground font-heading">
            Top Hitter: <span className="text-foreground">{topHitter?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-muted-foreground w-10">Contact</span>
            <RatingPills value={topHitter?.contact || 0} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-muted-foreground w-10">Power</span>
            <RatingPills value={topHitter?.power || 0} />
          </div>
          <div className="text-[9px] text-muted-foreground font-heading mt-1">
            Top Pitcher: <span className="text-foreground">{topPitcher?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-muted-foreground w-10">Speed</span>
            <RatingPills value={topPitcher?.pitchSpeed || 0} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-muted-foreground w-10">OffSpd</span>
            <RatingPills value={topPitcher?.offSpeed || 0} />
          </div>
        </div>

        {isSelected && (
          <div className={`mt-2 pt-2 border-t border-border/30 flex items-center gap-1.5 ${isUser ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isUser ? <User className="w-3 h-3" /> : <Cpu className="w-3 h-3" />}
            <span className="text-[9px] font-heading font-bold uppercase tracking-wider">
              {isUser ? 'Your Team' : 'CPU'}
            </span>
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-lg mx-auto space-y-5">
        {/* Header */}
        <div className="text-center space-y-1.5 pt-4">
          <div className="flex items-center justify-center gap-2.5">
            <span className="text-2xl">⚾</span>
            <h1 className="font-display text-[11px] text-primary tracking-wider">1984: THE BASEBALL SEASON</h1>
          </div>
          <p className="font-body text-sm text-muted-foreground">
            Pick your team and an opponent. Real 1984 rosters. Ratings 1–10 from actual stats.
          </p>
        </div>

        {/* Selection status */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${userTeam ? 'bg-emerald-400' : 'bg-muted'}`} />
            <span className="text-[10px] font-heading text-muted-foreground uppercase">
              {userTeam ? TEAMS[userTeam].abbr : 'Your Team'}
            </span>
          </div>
          <span className="text-muted-foreground/40">vs</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${cpuTeam ? 'bg-amber-400' : 'bg-muted'}`} />
            <span className="text-[10px] font-heading text-muted-foreground uppercase">
              {cpuTeam ? TEAMS[cpuTeam].abbr : 'Opponent'}
            </span>
          </div>
        </div>

        {/* AL Teams */}
        <div>
          <h3 className="font-heading text-xs font-bold text-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full inline-block" />
            American League
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {alTeams.map(key => (
              <TeamCard key={key} teamKey={key} />
            ))}
          </div>
        </div>

        {/* NL Teams */}
        <div>
          <h3 className="font-heading text-xs font-bold text-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full inline-block" />
            National League
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {nlTeams.map(key => (
              <TeamCard key={key} teamKey={key} />
            ))}
          </div>
        </div>

        {/* Play Ball */}
        <Button
          onClick={handleStart}
          disabled={!userTeam || !cpuTeam}
          className="w-full gap-2 font-heading text-sm py-5"
          size="lg"
        >
          <Play className="w-5 h-5" />
          {userTeam && cpuTeam
            ? `Play Ball! ${TEAMS[userTeam].abbr} vs ${TEAMS[cpuTeam].abbr}`
            : !userTeam
            ? 'Select your team'
            : 'Select an opponent'}
        </Button>

        <p className="text-[10px] text-muted-foreground/50 text-center font-body pb-8">
          You control batting and pitching for your team. CPU controls the opponent.
        </p>
      </div>
    </div>
  );
}