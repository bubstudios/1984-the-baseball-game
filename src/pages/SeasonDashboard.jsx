import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Calendar, TrendingUp, Users, Play } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { generateSchedule as buildSchedule, verifySchedule } from '@/lib/seasonSchedule';
import LeagueLeaders from '@/components/season/LeagueLeaders';
import FullSchedule from '@/components/season/FullSchedule';

export default function SeasonDashboard() {
  const location = useLocation();
  const [season, setSeason] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // schedule, results, leaders, standings
  const pendingUserTeam = location.state?.userTeam || null;

  // Load current season
  useEffect(() => {
    loadSeason();
  }, []);

  const loadSeason = async () => {
    try {
      setLoading(true);
      // Get active season
      const seasons = await base44.entities.Season.filter({ status: 'active' });
      if (seasons.length === 0) {
        // No active season and no team selected - send to team selection
        if (!pendingUserTeam) {
          window.location.href = '/season-setup';
          return;
        }
        // No active season - create one with selected team
        await createNewSeason();
        return;
      }
      
      const currentSeason = seasons[0];
      setSeason(currentSeason);

      // Load schedule for current game day
      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: currentSeason.id,
        gameDay: currentSeason.currentGameDay || 1
      });
      setSchedule(daySchedule);

      // Load recent results
      const results = await base44.entities.GameResult.filter(
        { seasonId: currentSeason.id },
        '-gameDay',
        20
      );
      setGameResults(results);

    } catch (error) {
      console.error('Failed to load season:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewSeason = async () => {
    const userTeam = pendingUserTeam || 'tigers';
    try {
      const newSeason = await base44.entities.Season.create({
        year: 1984,
        startDate: '1984-04-03',
        endDate: '1984-10-14',
        currentGameDay: 1,
        currentDate: '1984-04-03',
        status: 'active',
        userTeam,
        completedGames: 0,
        totalGames: 2106
      });
      
      // Generate full schedule with user's team
      await generateSchedule(newSeason.id, userTeam);
      
      setSeason(newSeason);
      loadSeason();
    } catch (error) {
      console.error('Failed to create season:', error);
    }
  };

  const generateSchedule = async (seasonId, team) => {
    try {
      setLoading(true);
      // Clear any existing schedule rows for this season FIRST.
      // Without this, regeneration appends to the old (possibly broken) schedule.
      await base44.entities.Schedule.deleteMany({ seasonId });
      console.log('Cleared existing schedule rows before regenerating.');

      // Build the schedule locally with the verified generator.
      const days = buildSchedule(team); // Array<{ day, date, games: [{home, away, isUser}] }>

      // Integrity check before persisting - do not write a broken schedule.
      const errors = verifySchedule(days);
      if (errors.length > 0) {
        console.error('Schedule failed verification, not saving:', errors);
        alert('Schedule generation failed integrity check. See console.');
        return;
      }

      // Flatten Day objects into Schedule entity rows.
      const rows = [];
      for (const d of days) {
        for (const g of d.games) {
          rows.push({
            seasonId,
            gameDay: d.day,
            gameDate: d.date,
            homeTeam: g.home,
            awayTeam: g.away,
            isUserGame: g.isUser,
            status: 'scheduled',
          });
        }
      }

      // Fix stale totalGames on the season entity (old backend may have set 2430).
      await base44.entities.Season.update(seasonId, { totalGames: 2106 });

      // Bulk-create the schedule rows in max-size chunks with a delay to avoid rate limits.
      const CHUNK = 500;
      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < rows.length; i += CHUNK) {
        await base44.entities.Schedule.bulkCreate(rows.slice(i, i + CHUNK));
        if (i + CHUNK < rows.length) await delay(800);
      }
      console.log(`Schedule generated locally: ${rows.length} games across ${days.length} days.`);

      // Reload the season + schedule so the UI reflects the fresh data.
      await loadSeason();
    } catch (error) {
      console.error('Failed to generate schedule:', error);
      alert('Failed to generate schedule: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const simulateDay = async () => {
    if (!season) return;
    
    try {
      setSimulating(true);
      
      const response = await base44.functions.invoke('simulateDay', {
        seasonId: season.id,
        gameDay: season.currentGameDay || 1
      });

      if (response.data?.success) {
        // Refresh data
        await loadSeason();
      }
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed: ' + error.message);
    } finally {
      setSimulating(false);
    }
  };

  const advanceToNextDay = () => {
    if (!season) return;
    // Just update the day - user will simulate
    setSeason(prev => ({
      ...prev,
      currentGameDay: (prev.currentGameDay || 1) + 1
    }));
    loadSeason();
  };

  const playUserGame = () => {
    const userGame = schedule.find(g => g.isUserGame);
    if (!userGame || !season) return;
    // Pass actual schedule home/away + user's team so the game respects the schedule
    window.location.href = `/?seasonGame=${userGame.homeTeam},${userGame.awayTeam},${season.userTeam}`;
  };

  if (loading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="font-heading text-lg text-foreground">Loading Season...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/50 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">
                1984 Season
                {season?.userTeam && (
                  <span className="text-primary"> · {TEAMS[season.userTeam]?.name || season.userTeam}</span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground font-heading">
                Day {season?.currentGameDay || 1} of 162 · {season?.currentDate || 'April 3, 1984'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={loadSeason}
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={simulating}
            >
              <RotateCcw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Play className="w-4 h-4" />
              Exhibition
            </Button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="shrink-0 bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={simulateDay}
              disabled={simulating || !season}
              className="gap-2"
            >
              {simulating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Simulating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  Simulate Day {season?.currentGameDay || 1}
                </>
              )}
            </Button>
            <Button
              onClick={advanceToNextDay}
              variant="outline"
              disabled={simulating}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Next Day
            </Button>
            {schedule.some(g => g.isUserGame) && (
              <Button
                onClick={playUserGame}
                variant="secondary"
                className="gap-2"
              >
                <Play className="w-4 h-4" />
                Play My Game
              </Button>
            )}
          </div>
          <div className="text-sm text-muted-foreground font-heading">
            {season?.completedGames || 0} / {season?.totalGames || 2106} games completed
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0 bg-card/50 border-b border-border px-6">
        <div className="grid grid-cols-4 gap-1 py-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`font-heading text-sm rounded-md py-2 transition-all ${
              activeTab === 'schedule'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Today's Games
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`font-heading text-sm rounded-md py-2 transition-all ${
              activeTab === 'results'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Recent Results
          </button>
          <button
            onClick={() => setActiveTab('leaders')}
            className={`font-heading text-sm rounded-md py-2 transition-all ${
              activeTab === 'leaders'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            League Leaders
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`font-heading text-sm rounded-md py-2 transition-all ${
              activeTab === 'standings'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Standings
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {activeTab === 'schedule' && season && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">
                Full Season Schedule
              </h2>
              <Button
                onClick={() => generateSchedule(season.id, season.userTeam)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
            <FullSchedule seasonId={season.id} userTeam={season.userTeam} />
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">
              Recent Results
            </h2>
            {gameResults.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-heading">No games completed yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {gameResults.map((result) => (
                  <div
                    key={result.id}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-heading">
                        Day {result.gameDay} · {result.stadium}
                      </span>
                      <span className="text-xs text-muted-foreground font-heading">
                        {result.homeHRs?.length || 0} HRs | {result.awayHRs?.length || 0} HRs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-foreground">
                            {TEAMS[result.awayTeam]?.abbr || result.awayTeam}
                          </span>
                          <span className="font-heading text-lg font-bold text-primary">
                            {result.awayScore}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-foreground">
                            {TEAMS[result.homeTeam]?.abbr || result.homeTeam}
                          </span>
                          <span className="font-heading text-lg font-bold text-primary">
                            {result.homeScore}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground font-heading mb-1">
                          W: {result.winningPitcher || 'TBD'}
                        </div>
                        <div className="text-xs text-muted-foreground font-heading">
                          L: {result.losingPitcher || 'TBD'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leaders' && season && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-foreground">
              League Leaders
            </h2>
            <LeagueLeaders seasonId={season.id} />
          </div>
        )}

        {activeTab === 'standings' && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Standings
            </h2>
            <div className="text-center py-12 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-heading">Coming Soon</p>
              <p className="text-sm mt-2">AL and NL East/Central/West divisions</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}