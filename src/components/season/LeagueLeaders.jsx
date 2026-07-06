import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, TrendingUp, Activity } from 'lucide-react';
import { LEAGUES } from '@/lib/seasonSchedule';

const BATTING_CATEGORIES = [
  { key: 'battingAverage', label: 'AVG', field: 'battingAverage', qualify: true },
  { key: 'homeRuns', label: 'HR', field: 'homeRuns', qualify: false },
  { key: 'rbi', label: 'RBI', field: 'rbi', qualify: false },
  { key: 'hits', label: 'H', field: 'hits', qualify: false },
  { key: 'runs', label: 'R', field: 'runs', qualify: false },
  { key: 'stolenBases', label: 'SB', field: 'stolenBases', qualify: false },
  { key: 'doubles', label: '2B', field: 'doubles', qualify: false },
  { key: 'triples', label: '3B', field: 'triples', qualify: false },
];

const PITCHING_CATEGORIES = [
  { key: 'wins', label: 'W', field: 'wins', qualify: false },
  { key: 'era', label: 'ERA', field: 'era', qualify: true, lowerIsBetter: true },
  { key: 'pitchingStrikeouts', label: 'K', field: 'pitchingStrikeouts', qualify: false },
  { key: 'saves', label: 'SV', field: 'saves', qualify: false },
  { key: 'inningsPitched', label: 'IP', field: 'inningsPitched', qualify: false },
];

function formatVal(val, category) {
  if (category === 'battingAverage') return (val || 0).toFixed(3);
  if (category === 'era') return (val || 0).toFixed(2);
  if (category === 'inningsPitched') return (val || 0).toFixed(1);
  return val || 0;
}

export default function LeagueLeaders({ seasonId, userTeam }) {
  const [league, setLeague] = useState('AL');
  const [category, setCategory] = useState('battingAverage');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPitching, setIsPitching] = useState(false);
  const [userPlayerRow, setUserPlayerRow] = useState(null);

  useEffect(() => {
    if (!seasonId) return;
    loadLeaders();
  }, [seasonId, league, category, isPitching]);

  const loadLeaders = async () => {
    setLoading(true);
    try {
      const allStats = await base44.entities.PlayerStats.filter({ seasonId }, null, 1500);
      const leagueTeams = league === 'AL' ? LEAGUES.AL : LEAGUES.NL;
      const leagueStats = allStats.filter(s => leagueTeams.includes(s.team));

      // Compute team games played (max gamesPlayed for batters, max pitchingGames for pitchers)
      const teamGames = {};
      for (const s of leagueStats) {
        const gp = isPitching ? (s.pitchingGames || 0) : (s.gamesPlayed || 0);
        if (gp > (teamGames[s.team] || 0)) teamGames[s.team] = gp;
      }

      const categories = isPitching ? PITCHING_CATEGORIES : BATTING_CATEGORIES;
      const cat = categories.find(c => c.key === category) || categories[0];

      // Qualification filter
      let qualified = leagueStats.filter(s => {
        if (!s || !s.team) return false;
        const tg = teamGames[s.team] || 0;
        if (cat.qualify) {
          if (isPitching) {
            // ERA: 1.0 IP per team game
            return (s.inningsPitched || 0) >= tg;
          } else {
            // AVG: 3.1 PA per team game
            const pa = (s.atBats || 0) + (s.walks || 0);
            return pa >= tg * 3.1;
          }
        }
        // Session 20 Part 2: counting stats require PA > 0 to exclude pitchers (DH leagues)
        if (!isPitching) {
          const pa = (s.atBats || 0) + (s.walks || 0);
          return pa > 0;
        }
        return true;
      });

      const lowerIsBetter = cat.lowerIsBetter;
      qualified.sort((a, b) => {
        const av = a[cat.field] || 0;
        const bv = b[cat.field] || 0;
        return lowerIsBetter ? av - bv : bv - av;
      });

      // Session 20 Part 2: exclude zeros for counting stats (not rate stats)
      if (!cat.qualify && !cat.lowerIsBetter) {
        qualified = qualified.filter(s => (s[cat.field] || 0) > 0);
      }

      const top10 = qualified.slice(0, 10);
      setLeaders(top10);

      // Find highest-ranked user player outside top 10
      if (userTeam && leagueTeams.includes(userTeam)) {
        const userRanked = qualified.findIndex(s => s.team === userTeam);
        if (userRanked >= 10) {
          setUserPlayerRow({ stat: qualified[userRanked], rank: userRanked + 1 });
        } else {
          setUserPlayerRow(null);
        }
      } else {
        setUserPlayerRow(null);
      }
    } catch (error) {
      console.error('Failed to load leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = isPitching ? PITCHING_CATEGORIES : BATTING_CATEGORIES;
  const currentCategory = currentCategories.find(c => c.key === category);

  return (
    <div className="space-y-4">
      {/* League & Category Tabs */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            variant={league === 'AL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLeague('AL')}
            className="flex-1"
          >
            American League
          </Button>
          <Button
            variant={league === 'NL' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLeague('NL')}
            className="flex-1"
          >
            National League
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={!isPitching ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setIsPitching(false); setCategory('battingAverage'); }}
            className="flex-1 gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Batting
          </Button>
          <Button
            variant={isPitching ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setIsPitching(true); setCategory('era'); }}
            className="flex-1 gap-2"
          >
            <Activity className="w-4 h-4" />
            Pitching
          </Button>
        </div>

        {/* Stat Categories */}
        <div className="grid grid-cols-4 gap-2">
          {currentCategories.map((cat) => (
            <Button
              key={cat.key}
              variant={category === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.key)}
              className="text-xs"
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Leaders Table */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-primary" />
          <h3 className="font-heading text-sm font-bold text-foreground">
            {league} {isPitching ? 'Pitching' : 'Batting'} - {currentCategory?.label}
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading leaders...</div>
        ) : (
          <ScrollArea className="h-[340px]">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-2 font-medium">Rank</th>
                  <th className="text-left py-2 px-2 font-medium">Player</th>
                  <th className="text-left py-2 px-2 font-medium">Team</th>
                  <th className="text-right py-2 px-2 font-medium">{currentCategory?.label}</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, idx) => {
                  const isUser = leader.team === userTeam;
                  return (
                    <tr key={leader.id} className={`border-b border-border/30 ${isUser ? 'bg-primary/10' : ''}`}>
                      <td className="py-2 px-2 text-foreground">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </td>
                      <td className="py-2 px-2 text-foreground font-medium">{leader.playerName}</td>
                      <td className="py-2 px-2 text-muted-foreground uppercase text-[10px]">{leader.team}</td>
                      <td className="py-2 px-2 text-right font-heading font-bold text-primary">
                        {formatVal(leader[currentCategory?.field], category)}
                      </td>
                    </tr>
                  );
                })}
                {userPlayerRow && (
                  <>
                    <tr className="border-b border-border/10">
                      <td colSpan={4} className="py-1 px-2 text-center text-[10px] text-muted-foreground/50">. . .</td>
                    </tr>
                    <tr className="bg-primary/5">
                      <td className="py-2 px-2 text-primary font-bold">#{userPlayerRow.rank}</td>
                      <td className="py-2 px-2 text-foreground font-medium">{userPlayerRow.stat.playerName}</td>
                      <td className="py-2 px-2 text-primary uppercase text-[10px]">{userPlayerRow.stat.team}</td>
                      <td className="py-2 px-2 text-right font-heading font-bold text-primary">
                        {formatVal(userPlayerRow.stat[currentCategory?.field], category)}
                      </td>
                    </tr>
                  </>
                )}
                {leaders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No leaders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}