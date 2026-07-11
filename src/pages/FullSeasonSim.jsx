import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, TrendingUp, Activity, Play, BarChart3 } from 'lucide-react';
import { runFullSeasonSim, getLeaders } from '@/lib/fullSeasonSim';
import { TEAMS } from '@/lib/gameData';
import { LEAGUES, DIVISIONS } from '@/lib/seasonSchedule';

const BATTING_CATEGORIES = [
  { key: 'battingAverage', label: 'AVG', field: 'battingAverage', qualify: true },
  { key: 'homeRuns', label: 'HR', field: 'homeRuns', qualify: false },
  { key: 'rbi', label: 'RBI', field: 'rbi', qualify: false },
  { key: 'hits', label: 'H', field: 'hits', qualify: false },
  { key: 'runs', label: 'R', field: 'runs', qualify: false },
  { key: 'stolenBases', label: 'SB', field: 'stolenBases', qualify: false },
  { key: 'doubles', label: '2B', field: 'doubles', qualify: false },
  { key: 'ops', label: 'OPS', field: 'ops', qualify: true },
];

const PITCHING_CATEGORIES = [
  { key: 'wins', label: 'W', field: 'wins', qualify: false },
  { key: 'era', label: 'ERA', field: 'era', qualify: true, lowerIsBetter: true },
  { key: 'pitchingStrikeouts', label: 'K', field: 'pitchingStrikeouts', qualify: false },
  { key: 'saves', label: 'SV', field: 'saves', qualify: false },
  { key: 'inningsPitched', label: 'IP', field: 'inningsPitched', qualify: false },
  { key: 'whip', label: 'WHIP', field: 'whip', qualify: true, lowerIsBetter: true },
  { key: 'losses', label: 'L', field: 'losses', qualify: false },
];

function formatVal(val, category) {
  if (category === 'battingAverage' || category === 'onBasePercentage' || category === 'sluggingPercentage' || category === 'ops')
    return (val || 0).toFixed(3);
  if (category === 'era' || category === 'whip') return (val || 0).toFixed(2);
  if (category === 'inningsPitched') return (val || 0).toFixed(1);
  return val || 0;
}

export default function FullSeasonSim() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ day: 0, total: 0, games: 0 });
  const [results, setResults] = useState(null);
  const [league, setLeague] = useState('AL');
  const [isPitching, setIsPitching] = useState(false);
  const [category, setCategory] = useState('battingAverage');

  const handleRun = useCallback(async () => {
    setRunning(true);
    setResults(null);
    setProgress({ day: 0, total: 0, games: 0 });
    try {
      const res = await runFullSeasonSim((day, total, games) => {
        setProgress({ day, total, games });
      });
      setResults(res);
    } catch (e) {
      console.error('Full season sim failed:', e);
      setResults({ error: e.message });
    } finally {
      setRunning(false);
    }
  }, []);

  const currentCategories = isPitching ? PITCHING_CATEGORIES : BATTING_CATEGORIES;
  const currentCategory = currentCategories.find(c => c.key === category) || currentCategories[0];

  let leaders = [];
  if (results?.playerStats && currentCategory) {
    leaders = getLeaders(results.playerStats, {
      field: currentCategory.field,
      league,
      isPitching,
      qualify: currentCategory.qualify,
      lowerIsBetter: currentCategory.lowerIsBetter,
      topN: 10,
    });
  }

  const standings = results ? buildStandings(results.teamStandings, league) : [];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary mb-1">Full Season Simulation</h1>
        <p className="text-sm text-muted-foreground">Simulate all 162 games for all 26 teams and view league leaders.</p>
      </div>

      {/* Run Button / Progress */}
      {!running && !results && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <Button size="lg" onClick={handleRun} className="gap-2">
            <Play className="w-5 h-5" />
            Run Full Season (26 Teams x 162 Games)
          </Button>
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            This simulates approximately 2,100 games and may take a few minutes. Keep this tab open while it runs.
          </p>
        </div>
      )}

      {running && (
        <div className="space-y-3 py-8">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Simulating...</span>
            <span className="font-heading font-bold text-primary">
              Day {progress.day} / {progress.total} - {progress.games} games
            </span>
          </div>
          <Progress value={progress.total > 0 ? (progress.day / progress.total) * 100 : 0} className="h-3" />
          <p className="text-xs text-muted-foreground text-center">Do not close this tab.</p>
        </div>
      )}

      {results?.error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
          Error: {results.error}
        </div>
      )}

      {results && !results.error && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <SummaryCard label="Games Simulated" value={results.summary.totalGames} />
            <SummaryCard label="Sim Errors" value={results.summary.simErrors} />
            <SummaryCard label="Days" value={results.summary.totalDays} />
          </div>

          {/* Standings */}
          <StandingsTable standings={standings} league={league} />

          {/* Leaders */}
          <div className="space-y-4">
            <div className="flex gap-2">
              {['AL', 'NL', 'MLB'].map(l => (
                <Button
                  key={l}
                  variant={league === l ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setLeague(l)}
                  className="flex-1"
                >
                  {l === 'AL' ? 'American League' : l === 'NL' ? 'National League' : 'All MLB'}
                </Button>
              ))}
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
            <ScrollArea className="h-[360px]">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="text-left py-2 px-2 font-medium w-12">Rank</th>
                    <th className="text-left py-2 px-2 font-medium">Player</th>
                    <th className="text-left py-2 px-2 font-medium w-16">Team</th>
                    <th className="text-right py-2 px-2 font-medium w-20">{currentCategory?.label}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaders.map((leader, idx) => (
                    <tr key={`${leader.team}-${leader.playerName}-${idx}`} className="border-b border-border/30">
                      <td className="py-2 px-2 text-foreground">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </td>
                      <td className="py-2 px-2 text-foreground font-medium">{leader.playerName}</td>
                      <td className="py-2 px-2 text-muted-foreground uppercase text-[10px]">{leader.team}</td>
                      <td className="py-2 px-2 text-right font-heading font-bold text-primary">
                        {formatVal(leader[currentCategory?.field], category)}
                      </td>
                    </tr>
                  ))}
                  {leaders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-muted-foreground">No qualifying players.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>

          {/* Re-run Button */}
          <div className="flex justify-center pt-2 pb-8">
            <Button variant="outline" onClick={handleRun} className="gap-2">
              <Play className="w-4 h-4" />
              Re-Run Season
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 text-center">
      <div className="font-heading text-2xl font-bold text-primary">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function buildStandings(teamStandings, league) {
  let teams = Object.keys(teamStandings);
  if (league === 'AL') teams = LEAGUES.AL;
  else if (league === 'NL') teams = LEAGUES.NL;

  // Group by division
  const divisions = league === 'AL' ? ['AL_East', 'AL_West'] : league === 'NL' ? ['NL_East', 'NL_West'] : ['AL_East', 'AL_West', 'NL_East', 'NL_West'];

  const result = [];
  for (const divKey of divisions) {
    const divTeams = DIVISIONS[divKey] || [];
    const sorted = divTeams
      .map(tk => ({ team: tk, ...teamStandings[tk] }))
      .sort((a, b) => {
        const apct = (a.w + a.l) > 0 ? a.w / (a.w + a.l) : 0;
        const bpct = (b.w + b.l) > 0 ? b.w / (b.w + b.l) : 0;
        return bpct - apct;
      });
    result.push({ division: divKey.replace('_', ' '), teams: sorted });
  }
  return result;
}

function StandingsTable({ standings, league }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-heading text-sm font-bold text-foreground">
          {league === 'MLB' ? 'MLB' : league} Standings
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {standings.map(div => (
          <div key={div.division}>
            <div className="text-xs font-heading font-bold text-muted-foreground uppercase mb-1">{div.division}</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-1 px-1 font-medium">Team</th>
                  <th className="text-right py-1 px-1 font-medium w-8">W</th>
                  <th className="text-right py-1 px-1 font-medium w-8">L</th>
                  <th className="text-right py-1 px-1 font-medium w-12">PCT</th>
                  <th className="text-right py-1 px-1 font-medium w-12">GB</th>
                </tr>
              </thead>
              <tbody>
                {div.teams.map((t, idx) => {
                  const pct = (t.w + t.l) > 0 ? t.w / (t.w + t.l) : 0;
                  const leader = div.teams[0];
                  const leaderLosses = leader.l;
                  const gb = idx === 0 ? '-' : ((leader.w - t.w) + (t.l - leaderLosses)) / 2;
                  return (
                    <tr key={t.team} className="border-b border-border/20">
                      <td className="py-1 px-1 text-foreground font-medium uppercase text-[10px]">
                        {TEAMS[t.team]?.name || t.team}
                      </td>
                      <td className="py-1 px-1 text-right text-foreground">{t.w}</td>
                      <td className="py-1 px-1 text-right text-foreground">{t.l}</td>
                      <td className="py-1 px-1 text-right text-muted-foreground">{pct.toFixed(3)}</td>
                      <td className="py-1 px-1 text-right text-muted-foreground">{typeof gb === 'number' ? gb.toFixed(1) : gb}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}