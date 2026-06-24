import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { Play, User, Cpu, Trophy, Dice5 } from 'lucide-react';
import AchievementsPanel from '@/components/game/AchievementsPanel';
import { getUnlockedCount } from '@/lib/achievements';

const TEAM_LOGOS = {
  tigers:   'https://www.mlbstatic.com/team-logos/116.svg',
  padres:   'https://www.mlbstatic.com/team-logos/135.svg',
  cubs:     'https://www.mlbstatic.com/team-logos/112.svg',
  mets:     'https://www.mlbstatic.com/team-logos/121.svg',
  redsox:   'https://www.mlbstatic.com/team-logos/111.svg',
  yankees:  'https://www.mlbstatic.com/team-logos/147.svg',
  orioles:  'https://www.mlbstatic.com/team-logos/110.svg',
  dodgers:  'https://www.mlbstatic.com/team-logos/119.svg',
  reds:     'https://www.mlbstatic.com/team-logos/113.svg',
  royals:   'https://www.mlbstatic.com/team-logos/118.svg',
  phillies: 'https://www.mlbstatic.com/team-logos/143.svg',
  bluejays: 'https://www.mlbstatic.com/team-logos/141.svg',
  indians:  'https://www.mlbstatic.com/team-logos/114.svg',
  brewers:  'https://www.mlbstatic.com/team-logos/158.svg',
  twins:    'https://www.mlbstatic.com/team-logos/142.svg',
  athletics:'https://www.mlbstatic.com/team-logos/133.svg',
  angels:   'https://www.mlbstatic.com/team-logos/108.svg',
  whitesox: 'https://www.mlbstatic.com/team-logos/145.svg',
  mariners: 'https://www.mlbstatic.com/team-logos/136.svg',
  rangers:  'https://www.mlbstatic.com/team-logos/140.svg',
  expos:    'https://www.mlbstatic.com/team-logos/120.svg',
  cardinals:'https://www.mlbstatic.com/team-logos/138.svg',
  pirates:  'https://www.mlbstatic.com/team-logos/134.svg',
  braves:   'https://www.mlbstatic.com/team-logos/144.svg',
  astros:   'https://www.mlbstatic.com/team-logos/117.svg',
  giants:   'https://www.mlbstatic.com/team-logos/137.svg',
};

const DIVISIONS = [
  { label: 'AL East', color: '#1e40af', teams: ['tigers','redsox','yankees','orioles','bluejays','indians','brewers'] },
  { label: 'AL West', color: '#065f46', teams: ['royals','athletics','angels','whitesox','mariners','rangers','twins'] },
  { label: 'NL East', color: '#7c2d12', teams: ['mets','phillies','expos','cardinals','pirates','cubs'] },
  { label: 'NL West', color: '#4c1d95', teams: ['dodgers','padres','reds','braves','astros','giants'] },
];

export default function TeamSelect({ onSelect }) {
  const [userTeam, setUserTeam] = useState(null);
  const [cpuTeam, setCpuTeam] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);

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
    if (userTeam && cpuTeam) onSelect(userTeam, cpuTeam);
  };

  const handleRandomize = () => {
    const allKeys = Object.keys(TEAMS);
    const first = allKeys[Math.floor(Math.random() * allKeys.length)];
    let second = allKeys[Math.floor(Math.random() * allKeys.length)];
    while (second === first) {
      second = allKeys[Math.floor(Math.random() * allKeys.length)];
    }
    setUserTeam(first);
    setCpuTeam(second);
  };

  const RatingPills = ({ value, max = 10 }) => (
    <div className="flex items-center gap-0.5">
      <div className="flex gap-0.5">
        {Array.from({ length: max }, (_, i) => (
          <div key={i} className={`w-1.5 h-2.5 rounded-sm ${i < value ? 'bg-primary' : 'bg-muted/60'}`} />
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
          <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center overflow-hidden flex-shrink-0">
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
            <div className="text-[9px] text-primary font-heading">{team.abbr}</div>
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
            Pick your team and an opponent. All 26 teams. Real 1984 rosters.
          </p>

          <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-1 mt-3">
            <button
              onClick={() => setShowAchievements(false)}
              className={`font-heading text-[11px] rounded-md py-1.5 transition-all ${
                !showAchievements ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ⚾ New Game
            </button>
            <button
              onClick={() => setShowAchievements(true)}
              className={`font-heading text-[11px] rounded-md py-1.5 transition-all flex items-center justify-center gap-1 ${
                showAchievements ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Trophy className="w-3 h-3" />
              Achievements
              <span className="text-[9px] text-primary/70">({getUnlockedCount()})</span>
            </button>
          </div>
        </div>

        {showAchievements ? (
          <AchievementsPanel />
        ) : (
          <>
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

            {/* Division sections */}
            {DIVISIONS.map(div => (
              <div key={div.label}>
                <h3 className="font-heading text-xs font-bold text-foreground mb-2 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: div.color }} />
                  {div.label}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {div.teams.filter(k => TEAMS[k]).map(key => (
                    <TeamCard key={key} teamKey={key} />
                  ))}
                </div>
              </div>
            ))}

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
          </>
        )}
      </div>
    </div>
  );
}