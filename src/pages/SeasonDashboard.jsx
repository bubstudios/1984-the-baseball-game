import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Calendar, TrendingUp, Play, FileText } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { generateSchedule as buildSchedule, verifySchedule, formatGameDate } from '@/lib/seasonSchedule';
import { simulateGameHeadless, buildGameResultFromState } from '@/lib/seasonEngine';
import { getCurrentUserGame, maybeAdvanceDay, archiveActiveSeasons, loadRotationStateForActiveSeason, persistRotationState, getProbableStarter, advanceRotation, recordPitcherWorkload, getUnavailableRelievers, commitPlayerStats } from '@/lib/seasonStore';
import LeagueLeaders from '@/components/season/LeagueLeaders';
import FullSchedule from '@/components/season/FullSchedule';
import Standings from '@/components/season/Standings';
import TeamGameLog from '@/components/season/TeamGameLog';
import ArchivedBoxScore from '@/components/season/ArchivedBoxScore';

export default function SeasonDashboard() {
  const location = useLocation();
  const [season, setSeason] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [currentUserGame, setCurrentUserGame] = useState(null);
  const [probableStarters, setProbableStarters] = useState(null);
  const [userGameNumber, setUserGameNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedArchive, setSelectedArchive] = useState(null);
  const pendingUserTeam = location.state?.userTeam || null;

  useEffect(() => {
    loadSeason();
  }, []);

  const loadSeason = async () => {
    try {
      setLoading(true);
      const seasons = await base44.entities.Season.filter({ status: 'active' });
      if (seasons.length === 0) {
        if (!pendingUserTeam) {
          window.location.href = '/season-setup';
          return;
        }
        await createNewSeason();
        return;
      }

      const currentSeason = seasons[0];
      setSeason(currentSeason);

      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: currentSeason.id,
        gameDay: currentSeason.currentGameDay || 1
      });
      setSchedule(daySchedule);

      const results = await base44.entities.GameResult.filter(
        { seasonId: currentSeason.id },
        '-gameDay',
        20
      );
      setGameResults(results);

      const userGame = await getCurrentUserGame(currentSeason);
      setCurrentUserGame(userGame);

      if (userGame) {
        const rotState = await loadRotationStateForActiveSeason();
        const oppTeam = userGame.homeTeam === currentSeason.userTeam ? userGame.awayTeam : userGame.homeTeam;
        setProbableStarters({
          userSP: getProbableStarter(rotState, currentSeason.userTeam, userGame.gameDate),
          oppSP: getProbableStarter(rotState, oppTeam, userGame.gameDate),
        });
      } else {
        setProbableStarters(null);
      }

      try {
        const userSched = await base44.entities.Schedule.filter({
          seasonId: currentSeason.id, isUserGame: true,
        }, 'gameDay', 200);
        const userGamesPlayed = userSched.filter(g => g.status === 'final').length;
        setUserGameNumber(Math.min(162, userGamesPlayed + 1));
      } catch (e) { /* non-fatal */ }

    } catch (error) {
      console.error('Failed to load season:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewSeason = async () => {
    const userTeam = pendingUserTeam || 'tigers';
    try {
      await archiveActiveSeasons();
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
      await base44.entities.Schedule.deleteMany({ seasonId });

      const days = buildSchedule(team);

      const errors = verifySchedule(days);
      if (errors.length > 0) {
        console.error('Schedule failed verification:', errors);
        const shown = errors.slice(0, 8).join('\n');
        const more = errors.length > 8 ? `\n...and ${errors.length - 8} more` : '';
        alert(`Schedule generation failed integrity check:\n\n${shown}${more}`);
        return;
      }

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

      await base44.entities.Season.update(seasonId, { totalGames: 2106 });

      const CHUNK = 500;
      const delay = (ms) => new Promise(r => setTimeout(r, ms));
      for (let i = 0; i < rows.length; i += CHUNK) {
        await base44.entities.Schedule.bulkCreate(rows.slice(i, i + CHUNK));
        if (i + CHUNK < rows.length) await delay(800);
      }

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
      const gameDay = season.currentGameDay || 1;

      const daySchedule = await base44.entities.Schedule.filter({
        seasonId: season.id,
        gameDay,
      });

      const toSim = daySchedule.filter(g => !g.isUserGame && g.status !== 'final');

      const rotState = await loadRotationStateForActiveSeason();

      const resultRows = [];
      const allBatting = [];
      const allPitching = [];
      let validationFailures = 0;
      for (const g of toSim) {
        try {
          const homeTeam = g.homeTeam;
          const awayTeam = g.awayTeam;
          const useDH = TEAMS[homeTeam]?.league === 'AL';

          const homeSP = getProbableStarter(rotState, homeTeam, g.gameDate);
          const awaySP = getProbableStarter(rotState, awayTeam, g.gameDate);
          const unavailableRelievers = {
            home: getUnavailableRelievers(rotState, homeTeam, g.gameDate),
            away: getUnavailableRelievers(rotState, awayTeam, g.gameDate),
          };

          const finalState = simulateGameHeadless(homeTeam, awayTeam, { useDH, homeSP, awaySP, unavailableRelievers });

          // Session 21 Part 1: BLOCKING GATE - do NOT commit stats if validation failed
          if (finalState._validationFailed) {
            console.error(`[day-commit] SKIPPING ${awayTeam} @ ${homeTeam} - validation failed: ${finalState._validationError}`);
            validationFailures++;
            continue;
          }

          const result = buildGameResultFromState(finalState, { headless: true });
          allBatting.push(...result.batting);
          allPitching.push(...result.pitching);

          if (finalState.homeStartingPitcherName) advanceRotation(rotState, homeTeam, finalState.homeStartingPitcherName, g.gameDate);
          if (finalState.awayStartingPitcherName) advanceRotation(rotState, awayTeam, finalState.awayStartingPitcherName, g.gameDate);
          recordPitcherWorkload(rotState, homeTeam, result.pitching.filter(p => p.teamKey === homeTeam), g.gameDate);
          recordPitcherWorkload(rotState, awayTeam, result.pitching.filter(p => p.teamKey === awayTeam), g.gameDate);

          const winnerName = result.decisions.winner ? result.decisions.winner.split('|')[1] : null;
          const loserName = result.decisions.loser ? result.decisions.loser.split('|')[1] : null;
          const saveName = result.decisions.save ? result.decisions.save.split('|')[1] : null;

          const homeHRs = result.homeRuns.filter(hr => hr.teamKey === homeTeam).map(hr => ({
            playerName: hr.name,
            inning: hr.inning,
          }));
          const awayHRs = result.homeRuns.filter(hr => hr.teamKey === awayTeam).map(hr => ({
            playerName: hr.name,
            inning: hr.inning,
          }));

          const homeHits = result.batting.filter(b => b.teamKey === homeTeam).reduce((s, b) => s + b.h, 0);
          const awayHits = result.batting.filter(b => b.teamKey === awayTeam).reduce((s, b) => s + b.h, 0);

          resultRows.push({
            seasonId: season.id,
            gameDay,
            gameDate: g.gameDate,
            boxScore: result,
            homeTeam,
            awayTeam,
            homeScore: result.homeScore,
            awayScore: result.awayScore,
            winner: result.winner,
            isUserGame: false,
            homeHits,
            awayHits,
            homeHRs,
            awayHRs,
            winningPitcher: winnerName,
            losingPitcher: loserName,
            savePitcher: saveName,
            stadium: TEAMS[homeTeam]?.stadium || null,
            innings: result.innings?.map(inn => ({ home: inn.home || 0, away: inn.away || 0 })) || [],
          });

          await new Promise(r => setTimeout(r, 0));
        } catch (gameError) {
          console.error(`[day-commit] Game failed: ${g.awayTeam} @ ${g.homeTeam}:`, gameError);
          validationFailures++;
        }
      }

      if (validationFailures > 0) {
        console.error(`[day-commit] ${validationFailures} game(s) failed validation and were skipped`);
      }

      const teamResultCounts = {};
      for (const r of resultRows) {
        teamResultCounts[r.homeTeam] = (teamResultCounts[r.homeTeam] || 0) + 1;
        teamResultCounts[r.awayTeam] = (teamResultCounts[r.awayTeam] || 0) + 1;
      }
      for (const [team, count] of Object.entries(teamResultCounts)) {
        if (count > 1) {
          console.error(`[day-commit] ASSERTION FAILED: ${team} has ${count} results on day ${gameDay}`);
        }
      }

      // Commit player stats to PlayerStats entity (Stage 3: stats pipeline)
      await commitPlayerStats(season.id, allBatting, allPitching);

      await persistRotationState(season.id, rotState);

      if (resultRows.length > 0) {
        const CHUNK = 50;
        for (let i = 0; i < resultRows.length; i += CHUNK) {
          await Promise.all(resultRows.slice(i, i + CHUNK).map(r => base44.entities.GameResult.create(r)));
        }
      }

      for (const g of toSim) {
        try { await base44.entities.Schedule.update(g.id, { status: 'final' }); } catch (e) { /* non-fatal */ }
      }

      await base44.entities.Season.update(season.id, {
        completedGames: (season.completedGames || 0) + resultRows.length,
      });

      await maybeAdvanceDay(season);

      await loadSeason();
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Simulation failed: ' + error.message);
    } finally {
      setSimulating(false);
    }
  };

  const todaysUserGame = schedule.find(g => g.isUserGame && g.status !== 'final');
  const isUserOffDay = !todaysUserGame;

  const playUserGame = () => {
    if (!todaysUserGame || !season) return;
    window.location.href = `/?seasonGame=${todaysUserGame.homeTeam},${todaysUserGame.awayTeam},${season.userTeam},${season.id},${todaysUserGame.gameDay},${todaysUserGame.id},${todaysUserGame.gameDate}`;
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
      <div className="shrink-0 border-b border-border bg-card/50 px-4 md:px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <div>
              <h1 className="font-heading text-lg md:text-xl font-bold text-foreground">
                1984 Season
                {season?.userTeam && (
                  <span className="text-primary"> · {TEAMS[season.userTeam]?.name || season.userTeam}</span>
                )}
              </h1>
              <p className="text-xs text-muted-foreground font-heading">
                Game {userGameNumber} of 162 · {formatGameDate(schedule[0]?.gameDate || season?.currentDate)}
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
      <div className="shrink-0 bg-card border-b border-border px-4 md:px-6 py-3">
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
            {todaysUserGame ? (
              <div className="flex items-center gap-3">
                <Button
                  onClick={playUserGame}
                  variant="secondary"
                  className="gap-2"
                >
                  <Play className="w-4 h-4" />
                  Play My Game
                </Button>
                {probableStarters && (
                  <div className="text-[10px] text-muted-foreground font-heading leading-tight">
                    <div><span className="text-primary">{probableStarters.userSP?.name || 'TBD'}</span> (you)</div>
                    <div>vs <span className="text-foreground">{probableStarters.oppSP?.name || 'TBD'}</span></div>
                  </div>
                )}
              </div>
            ) : isUserOffDay && currentUserGame ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                  <span className="text-xs font-heading text-amber-400 font-bold">OFF DAY</span>
                </div>
                {probableStarters && (
                  <div className="text-[10px] text-muted-foreground font-heading leading-tight">
                    <div className="text-amber-400/70">Next game:</div>
                    <div><span className="text-primary">{probableStarters.userSP?.name || 'TBD'}</span> (you)</div>
                    <div>vs <span className="text-foreground">{probableStarters.oppSP?.name || 'TBD'}</span></div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <div className="text-sm text-muted-foreground font-heading">
            {season?.completedGames || 0} / {season?.totalGames || 2106} games
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="shrink-0 bg-card/50 border-b border-border px-4 md:px-6">
        <div className="grid grid-cols-5 gap-1 py-2">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'schedule' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Schedule</button>
          <button
            onClick={() => setActiveTab('results')}
            className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'results' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Results</button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'standings' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Standings</button>
          <button
            onClick={() => setActiveTab('leaders')}
            className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'leaders' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Leaders</button>
          <button
            onClick={() => setActiveTab('gamelog')}
            className={`font-heading text-xs rounded-md py-2 transition-all ${activeTab === 'gamelog' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >Game Log</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
        {activeTab === 'schedule' && season && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-foreground">Full Season Schedule</h2>
              <Button
                onClick={() => generateSchedule(season.id, season.userTeam)}
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={loading || (season.completedGames || 0) > 0}
                title={(season.completedGames || 0) > 0 ? 'Schedule locked - games already committed' : 'Regenerate schedule'}
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
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Recent Results</h2>
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
                    onClick={() => result.boxScore && setSelectedArchive(result)}
                    className={`bg-card border border-border rounded-lg p-4 ${result.boxScore ? 'cursor-pointer hover:border-primary/40 transition-colors' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-heading">
                        Day {result.gameDay} · {result.stadium}
                      </span>
                      <div className="flex items-center gap-2">
                        {result.boxScore && <FileText className="w-3 h-3 text-primary" />}
                        <span className="text-xs text-muted-foreground font-heading">
                          {result.homeHRs?.length || 0} HRs | {result.awayHRs?.length || 0} HRs
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-foreground">
                            {TEAMS[result.awayTeam]?.abbr || result.awayTeam}
                          </span>
                          <span className="font-heading text-lg font-bold text-primary">{result.awayScore}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading text-sm font-bold text-foreground">
                            {TEAMS[result.homeTeam]?.abbr || result.homeTeam}
                          </span>
                          <span className="font-heading text-lg font-bold text-primary">{result.homeScore}</span>
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

        {activeTab === 'standings' && season && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Standings</h2>
            <Standings seasonId={season.id} userTeam={season.userTeam} />
          </div>
        )}

        {activeTab === 'leaders' && season && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">League Leaders</h2>
            <LeagueLeaders seasonId={season.id} userTeam={season.userTeam} />
          </div>
        )}

        {activeTab === 'gamelog' && season && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-bold text-foreground mb-4">Team Game Log</h2>
            <TeamGameLog seasonId={season.id} userTeam={season.userTeam} />
          </div>
        )}
      </div>

      {selectedArchive && (
        <ArchivedBoxScore
          gameResult={selectedArchive}
          onClose={() => setSelectedArchive(null)}
        />
      )}
    </div>
  );
}