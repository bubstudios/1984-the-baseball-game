import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Filter } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

export default function FullSchedule({ seasonId, userTeam }) {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTeam, setFilterTeam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [groupedByDay, setGroupedByDay] = useState({});

  useEffect(() => {
    if (!seasonId) return;
    loadSchedule();
  }, [seasonId, filterTeam, filterStatus]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      let allGames = await base44.entities.Schedule.filter({ seasonId });
      
      // Apply filters
      if (filterTeam !== 'all') {
        allGames = allGames.filter(g => 
          g.homeTeam === filterTeam || g.awayTeam === filterTeam
        );
      }
      
      if (filterStatus !== 'all') {
        allGames = allGames.filter(g => g.status === filterStatus);
      }

      // Sort by gameDay
      allGames.sort((a, b) => a.gameDay - b.gameDay);

      // Group by gameDay
      const grouped = {};
      allGames.forEach(game => {
        if (!grouped[game.gameDay]) {
          grouped[game.gameDay] = [];
        }
        grouped[game.gameDay].push(game);
      });

      setGroupedByDay(grouped);
      setSchedule(allGames);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const gameDays = Object.keys(groupedByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="bg-transparent text-sm font-heading text-foreground outline-none"
          >
            <option value="all">All Teams</option>
            {Object.entries(TEAMS).map(([key, team]) => (
              <option key={key} value={key}>{team.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-sm font-heading text-foreground outline-none"
          >
            <option value="all">All Games</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground font-heading self-center">
          {schedule.length} games
        </div>
      </div>

      {/* Schedule List */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-heading">Loading schedule...</p>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <div className="space-y-4">
            {gameDays.map((day) => (
              <div key={day} className="space-y-2">
                <div className="sticky top-0 bg-background/95 backdrop-blur py-2 border-b border-border">
                  <h3 className="font-heading text-sm font-bold text-primary">
                    Day {day} - {groupedByDay[day]?.[0]?.gameDate}
                  </h3>
                </div>
                
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {groupedByDay[day].map((game) => {
                    const isUserTeam = userTeam && (game.homeTeam === userTeam || game.awayTeam === userTeam);
                    return (
                      <div
                        key={game.id}
                        className={`bg-card border rounded-lg p-3 ${
                          isUserTeam ? 'border-primary/50 bg-primary/5' : 'border-border'
                        } ${game.status === 'completed' ? 'opacity-75' : ''}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-muted-foreground font-heading uppercase">
                            {game.stadium?.split(' ')[0] || 'Stadium'}
                          </span>
                          {isUserTeam && (
                            <span className="text-[9px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded font-heading">
                              YOUR TEAM
                            </span>
                          )}
                          {game.status === 'completed' && (
                            <span className="text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-heading">
                              FINAL
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className={`font-heading text-xs font-bold ${
                              game.status === 'completed' && game.awayScore > game.homeScore 
                                ? 'text-primary' 
                                : 'text-foreground'
                            }`}>
                              {TEAMS[game.awayTeam]?.abbr || game.awayTeam}
                            </span>
                            {game.status === 'completed' && (
                              <span className={`font-heading text-sm font-bold ${
                                game.awayScore > game.homeScore ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                {game.awayScore}
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`font-heading text-xs font-bold ${
                              game.status === 'completed' && game.homeScore > game.awayScore 
                                ? 'text-primary' 
                                : 'text-foreground'
                            }`}>
                              {TEAMS[game.homeTeam]?.abbr || game.homeTeam}
                            </span>
                            {game.status === 'completed' && (
                              <span className={`font-heading text-sm font-bold ${
                                game.homeScore > game.awayScore ? 'text-primary' : 'text-muted-foreground'
                              }`}>
                                {game.homeScore}
                              </span>
                            )}
                          </div>
                        </div>

                        {game.status === 'completed' && game.winner && (
                          <div className="mt-2 text-[9px] text-muted-foreground font-heading">
                            W: {TEAMS[game.winner]?.name || game.winner}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {gameDays.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-heading">No games found</p>
                <p className="text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}