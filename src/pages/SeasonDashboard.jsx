import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Calendar, TrendingUp, Users, Play } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

export default function SeasonDashboard() {
  const [season, setSeason] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // schedule, results, leaders, standings

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
        // No active season - create one
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
    try {
      const newSeason = await base44.entities.Season.create({
        year: 1984,
        startDate: '1984-04-02',
        endDate: '1984-10-14',
        currentGameDay: 1,
        currentDate: '1984-04-02',
        status: 'active',
        userTeam: 'cubs', // Default - would be selected in real flow
        completedGames: 0,
        totalGames: 2430
      });
      
      // Generate full schedule
      await generateSchedule(newSeason.id);
      
      setSeason(newSeason);
      loadSeason();
    } catch (error) {
      console.error('Failed to create season:', error);
    }
  };

  const generateSchedule = async (seasonId) => {
    // Placeholder - would generate 162-game schedule for all 26 teams
    console.log('Generating schedule for season', seasonId);
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
    if (userGame) {
      // Launch game in exhibition mode with season context
      // This would integrate with existing Home.jsx game flow
      alert(`Playing: ${userGame.awayTeam} @ ${userGame.homeTeam}`);
    }
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
              <h1 className="font-heading text-xl font-bold text-foreground">1984 Season</h1>
              <p className="text-xs text-muted-foreground font-heading">
                Day {season?.currentGameDay || 1} of 162 · {season?.currentDate || 'April 2, 1984'}
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
            {season?.completedGames || 0} / 2430 games completed
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
        {activeTab === 'schedule' && (
          <div className="space-y-3">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">
              Games for {season?.currentDate || 'Day ' + (season?.currentGameDay || 1)}
            </h2>
            {schedule.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-heading">No games scheduled</p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {schedule.map((game) => (
                  <div
                    key={game.id}
                    className={`bg-card border rounded-lg p-4 ${
                      game.isUserGame ? 'border-primary/50 bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-heading">
                        {game.stadium || 'Stadium'}
                      </span>
                      {game.isUserGame && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded font-heading">
                          YOUR GAME
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-bold text-foreground">
                          {TEAMS[game.awayTeam]?.abbr || game.awayTeam}
                        </span>
                        {game.status === 'completed' && (
                          <span className="font-heading text-lg font-bold text-foreground">
                            {game.awayScore}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-bold text-foreground">
                          {TEAMS[game.homeTeam]?.abbr || game.homeTeam}
                        </span>
                        {game.status === 'completed' && (
                          <span className="font-heading text-lg font-bold text-foreground">
                            {game.homeScore}
                          </span>
                        )}
                      </div>
                    </div>
                    {game.status === 'completed' && (
                      <div className="mt-2 text-xs text-muted-foreground font-heading">
                        Winner: {TEAMS[game.winner]?.name || game.winner}
                      </div>
                    )}
                    {game.status === 'pending_user' && (
                      <div className="mt-2 text-xs text-primary font-heading">
                        Awaiting user play
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
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

        {activeTab === 'leaders' && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-foreground">
              League Leaders
            </h2>
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-heading">Coming Soon</p>
              <p className="text-sm mt-2">Batting, Pitching, and Fielding stats</p>
            </div>
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