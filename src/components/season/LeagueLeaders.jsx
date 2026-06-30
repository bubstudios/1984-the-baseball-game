import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, TrendingUp, Activity } from 'lucide-react';

const BATTING_CATEGORIES = [
  { key: 'battingAverage', label: 'Batting Avg', icon: '🏆', sortField: 'battingAverage' },
  { key: 'homeRuns', label: 'Home Runs', icon: '💪', sortField: 'homeRuns' },
  { key: 'rbi', label: 'RBI', icon: '🎯', sortField: 'rbi' },
  { key: 'runs', label: 'Runs', icon: '⚡', sortField: 'runs' },
  { key: 'hits', label: 'Hits', icon: '🎪', sortField: 'hits' },
  { key: 'stolenBases', label: 'Stolen Bases', icon: '🏃', sortField: 'stolenBases' },
  { key: 'ops', label: 'OPS', icon: '📊', sortField: 'ops' },
];

const PITCHING_CATEGORIES = [
  { key: 'era', label: 'ERA', icon: '🎯', sortField: 'era', lowerIsBetter: true },
  { key: 'wins', label: 'Wins', icon: '🏆', sortField: 'wins' },
  { key: 'strikeouts', label: 'Strikeouts', icon: '💨', sortField: 'pitchingStrikeouts' },
  { key: 'saves', label: 'Saves', icon: '🔒', sortField: 'saves' },
  { key: 'whip', label: 'WHIP', icon: '📊', sortField: 'whip', lowerIsBetter: true },
  { key: 'inningsPitched', label: 'Innings', icon: '⏱️', sortField: 'inningsPitched' },
];

export default function LeagueLeaders({ seasonId }) {
  const [league, setLeague] = useState('AL');
  const [category, setCategory] = useState('battingAverage');
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPitching, setIsPitching] = useState(false);

  useEffect(() => {
    if (!seasonId) return;
    loadLeaders();
  }, [seasonId, league, category, isPitching]);

  const loadLeaders = async () => {
    setLoading(true);
    try {
      const allStats = await base44.entities.PlayerStats.filter({ seasonId });
      
      // Filter by league (AL: yankees, redsox, orioles, bluejays, rays, indians, tigers, royals, whitesox, twins, angels, athletics, mariners, rangers, astros)
      // NL: braves, mets, phillies, nationals, marlins, cubs, brewers, reds, pirates, cardinals, dodgers, giants, padres, diamondbacks, rockies
      const AL_TEAMS = ['yankees', 'redsox', 'orioles', 'bluejays', 'rays', 'indians', 'tigers', 'royals', 'whitesox', 'twins', 'angels', 'athletics', 'mariners', 'rangers', 'astros'];
      const NL_TEAMS = ['braves', 'mets', 'phillies', 'nationals', 'marlins', 'cubs', 'brewers', 'reds', 'pirates', 'cardinals', 'dodgers', 'giants', 'padres', 'diamondbacks', 'rockies'];
      
      const leagueTeams = league === 'AL' ? AL_TEAMS : NL_TEAMS;
      const leagueStats = allStats.filter(s => leagueTeams.includes(s.team));

      // Sort by selected category
      const categories = isPitching ? PITCHING_CATEGORIES : BATTING_CATEGORIES;
      const cat = categories.find(c => c.key === category);
      const localSortField = cat?.sortField || category;
      
      const sorted = leagueStats.sort((a, b) => {
        const aVal = a[localSortField] || 0;
        const bVal = b[localSortField] || 0;
        return cat?.lowerIsBetter ? aVal - bVal : bVal - aVal;
      }).slice(0, 10);

      setLeaders(sorted);
    } catch (error) {
      console.error('Failed to load leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategories = isPitching ? PITCHING_CATEGORIES : BATTING_CATEGORIES;
  const currentCategory = currentCategories.find(c => c.key === category);
  const sortField = currentCategory?.sortField || category;

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
        <div className="grid grid-cols-3 gap-2">
          {currentCategories.map((cat) => (
            <Button
              key={cat.key}
              variant={category === cat.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat.key)}
              className="text-xs"
            >
              <span className="mr-1">{cat.icon}</span>
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
            {league} {isPitching ? 'Pitching' : 'Batting'} Leaders - {currentCategory?.label}
          </h3>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading leaders...</div>
        ) : (
          <ScrollArea className="h-[300px]">
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
                {leaders.map((leader, idx) => (
                  <tr key={leader.id} className="border-b border-border/30 hover:bg-muted/30">
                    <td className="py-2 px-2 text-foreground">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                    </td>
                    <td className="py-2 px-2 text-foreground font-medium">{leader.playerName}</td>
                    <td className="py-2 px-2 text-muted-foreground uppercase text-[10px]">{leader.team}</td>
                    <td className="py-2 px-2 text-right font-heading font-bold text-primary">
                      {(() => {
                        const val = leader[sortField] || 0;
                        if (category === 'battingAverage' || category === 'ops' || category === 'era' || category === 'whip') {
                          return (val || 0).toFixed(3);
                        }
                        return val || 0;
                      })()}
                    </td>
                  </tr>
                ))}
                {leaders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                      No stats available yet
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