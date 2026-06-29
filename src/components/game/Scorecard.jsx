import React, { useState } from 'react';
import { getStats, resetAllData, ensureStatsInit } from '@/lib/achievements';
import { TEAMS } from '@/lib/gameData';
import { BarChart3, Clock, MapPin, Users, Trophy, TrendingUp, Calendar, Zap, Ruler, Target, Swords, RotateCcw, AlertTriangle } from 'lucide-react';

const TEAM_LOGOS = {
  tigers: 'https://www.mlbstatic.com/team-logos/116.svg',
  padres: 'https://www.mlbstatic.com/team-logos/135.svg',
  cubs: 'https://www.mlbstatic.com/team-logos/112.svg',
  mets: 'https://www.mlbstatic.com/team-logos/121.svg',
  redsox: 'https://www.mlbstatic.com/team-logos/111.svg',
  yankees: 'https://www.mlbstatic.com/team-logos/147.svg',
  orioles: 'https://www.mlbstatic.com/team-logos/110.svg',
  dodgers: 'https://www.mlbstatic.com/team-logos/119.svg',
  reds: 'https://www.mlbstatic.com/team-logos/113.svg',
  royals: 'https://www.mlbstatic.com/team-logos/118.svg',
  phillies: 'https://www.mlbstatic.com/team-logos/143.svg',
  bluejays: 'https://www.mlbstatic.com/team-logos/141.svg',
  indians: 'https://www.mlbstatic.com/team-logos/114.svg',
  brewers: 'https://www.mlbstatic.com/team-logos/158.svg',
  twins: 'https://www.mlbstatic.com/team-logos/142.svg',
  athletics: 'https://www.mlbstatic.com/team-logos/133.svg',
  angels: 'https://www.mlbstatic.com/team-logos/108.svg',
  whitesox: 'https://www.mlbstatic.com/team-logos/145.svg',
  mariners: 'https://www.mlbstatic.com/team-logos/136.svg',
  rangers: 'https://www.mlbstatic.com/team-logos/140.svg',
  expos: 'https://www.mlbstatic.com/team-logos/120.svg',
  cardinals: 'https://www.mlbstatic.com/team-logos/138.svg',
  pirates: 'https://www.mlbstatic.com/team-logos/134.svg',
  braves: 'https://www.mlbstatic.com/team-logos/144.svg',
  astros: 'https://www.mlbstatic.com/team-logos/117.svg',
  giants: 'https://www.mlbstatic.com/team-logos/137.svg',
};

function formatTime(minutes) {
  if (!minutes || minutes === 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) { return dateStr; }
}

function StatCard({ icon, label, value, sub, color = 'primary' }) {
  const colorMap = {
    primary: 'text-primary',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    rose: 'text-rose-400',
  };
  return (
    <div className="bg-card border border-border rounded-lg p-2.5 text-center">
      <div className={`flex justify-center mb-1 ${colorMap[color] || colorMap.primary}`}>
        {icon}
      </div>
      <div className="font-heading text-lg font-bold text-foreground leading-none">{value}</div>
      <div className="font-heading text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</div>
      {sub && <div className="text-[8px] text-muted-foreground/60 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function Scorecard() {
  const [stats, setStats] = useState(getStats());
  const [confirmReset, setConfirmReset] = useState(false);
  const games = stats.gamesCompleted || 0;
  const wins = stats.wins || 0;
  const losses = stats.losses || 0;
  const winPct = games > 0 ? ((wins / games) * 100).toFixed(1) : '0.0';
  const totalTeams = Object.keys(TEAMS).length;

  // Build team stats array sorted by games played
  const teamStats = Object.entries(stats.teamGames || {})
    .map(([key, gp]) => {
      const w = stats.teamWins?.[key] || 0;
      const l = gp - w;
      const wpct = gp > 0 ? ((w / gp) * 100).toFixed(0) : '0';
      const bestStr = stats.teamBestStreak?.[key] || 0;
      const hits = stats.teamHitsTotal?.[key] || 0;
      const team = TEAMS[key];
      return { key, gp, w, l, wpct, bestStr, hits, name: team?.name || key, city: team?.city || '', abbr: team?.abbr || key };
    })
    .sort((a, b) => b.gp - a.gp);

  const mostUsedTeam = teamStats[0] || null;
  const bestTeam = [...teamStats].sort((a, b) => b.w - a.w)[0] || null;

  // Records
  const longestHR = stats.longestHR || 0;
  const longestHRBatter = stats.longestHRBatter || '';
  const longestHRTeam = stats.longestHRTeam || '';
  const mostRunsInGame = stats.mostRunsInGame || 0;
  const mostRunsInGameTeam = stats.mostRunsInGameTeam || '';
  const mostRunsInGameOpp = stats.mostRunsInGameOpponent || '';
  const largestVictoryMargin = stats.largestVictoryMargin || 0;
  const largestVictoryTeam = stats.largestVictoryMarginTeam || '';

  const hasRecords = longestHR > 0 || mostRunsInGame > 0 || largestVictoryMargin > 0;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <BarChart3 className="w-4 h-4 text-primary" />
          <span className="font-heading text-sm font-bold text-foreground">Career Scorecard</span>
        </div>
        <div className="text-[10px] text-muted-foreground">
          {games > 0 ? `${games} games played since ${formatDate(stats.firstVisitDate)}` : 'No games played yet'}
        </div>
      </div>

      {games === 0 ? (
        <div className="bg-card border border-border rounded-xl p-6 text-center">
          <Trophy className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground font-body">
            Play your first game to start building your scorecard!
          </p>
        </div>
      ) : (
        <>
          {/* Career Summary - stat grid */}
          <div className="grid grid-cols-3 gap-2">
            <StatCard icon={<Trophy className="w-4 h-4" />} label="Wins" value={wins} color="emerald" />
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Losses" value={losses} color="rose" />
            <StatCard icon={<BarChart3 className="w-4 h-4" />} label="Win %" value={winPct} sub={`${games} games`} color="primary" />
            <StatCard icon={<TrendingUp className="w-4 h-4" />} label="Current Streak" value={stats.currentStreak || 0} color="amber" />
            <StatCard icon={<Trophy className="w-4 h-4" />} label="Best Streak" value={stats.bestStreak || 0} color="amber" />
            <StatCard icon={<Clock className="w-4 h-4" />} label="Time Played" value={formatTime(stats.totalTimePlayed || 0)} color="blue" />
          </div>

          {/* Highlights */}
          {(mostUsedTeam || bestTeam) && (
            <div className="grid grid-cols-2 gap-2">
              {mostUsedTeam && (
                <div className="bg-card border border-border rounded-lg p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={TEAM_LOGOS[mostUsedTeam.key]} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading text-[8px] text-muted-foreground uppercase tracking-wider">Most Used Team</div>
                    <div className="font-heading text-[11px] font-bold text-foreground truncate">{mostUsedTeam.city}</div>
                    <div className="text-[9px] text-muted-foreground">{mostUsedTeam.gp} games</div>
                  </div>
                </div>
              )}
              {bestTeam && bestTeam.w > 0 && (
                <div className="bg-card border border-border rounded-lg p-2.5 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                    <img src={TEAM_LOGOS[bestTeam.key]} alt="" className="w-6 h-6 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading text-[8px] text-muted-foreground uppercase tracking-wider">Best Record</div>
                    <div className="font-heading text-[11px] font-bold text-foreground truncate">{bestTeam.city}</div>
                    <div className="text-[9px] text-emerald-400">{bestTeam.w}-{bestTeam.l}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Records */}
          {hasRecords && (
            <div className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-heading text-[11px] font-bold text-foreground uppercase tracking-wider">Career Records</span>
              </div>
              <div className="space-y-2">
                {longestHR > 0 && (
                  <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <Ruler className="w-3 h-3 text-primary shrink-0" />
                      <div>
                        <div className="font-heading text-[9px] text-muted-foreground uppercase tracking-wider">Longest Home Run</div>
                        {longestHRBatter && <div className="font-heading text-[10px] text-foreground/70">{longestHRBatter}</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-heading text-base font-bold text-primary">{longestHR} <span className="text-xs">ft</span></div>
                      {longestHRTeam && TEAMS[longestHRTeam] && (
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <img src={TEAM_LOGOS[longestHRTeam]} alt="" className="w-3 h-3 object-contain" onError={(e) => { e.target.style.display='none'; }} />
                          <span className="text-[8px] text-muted-foreground">{TEAMS[longestHRTeam].abbr}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {mostRunsInGame > 0 && (
                  <div className="flex items-center justify-between py-1.5 border-b border-border/30">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-heading text-[9px] text-muted-foreground uppercase tracking-wider">Most Runs in a Game</div>
                        {mostRunsInGameTeam && TEAMS[mostRunsInGameTeam] && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <img src={TEAM_LOGOS[mostRunsInGameTeam]} alt="" className="w-3 h-3 object-contain" onError={(e) => { e.target.style.display='none'; }} />
                            <span className="text-[8px] text-muted-foreground">vs {TEAMS[mostRunsInGameOpp]?.abbr || mostRunsInGameOpp}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-heading text-base font-bold text-emerald-400">{mostRunsInGame} <span className="text-xs text-muted-foreground">runs</span></div>
                  </div>
                )}
                {largestVictoryMargin > 0 && (
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <Swords className="w-3 h-3 text-rose-400 shrink-0" />
                      <div>
                        <div className="font-heading text-[9px] text-muted-foreground uppercase tracking-wider">Largest Victory Margin</div>
                        {largestVictoryTeam && TEAMS[largestVictoryTeam] && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <img src={TEAM_LOGOS[largestVictoryTeam]} alt="" className="w-3 h-3 object-contain" onError={(e) => { e.target.style.display='none'; }} />
                            <span className="text-[8px] text-muted-foreground">{TEAMS[largestVictoryTeam].abbr}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="font-heading text-base font-bold text-rose-400">+{largestVictoryMargin} <span className="text-xs text-muted-foreground">runs</span></div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exploration stats */}
          <div className="grid grid-cols-2 gap-2">
            <StatCard icon={<MapPin className="w-4 h-4" />} label="Ballparks Visited" value={`${(stats.ballparksVisited || []).length}/${26}`} color="purple" />
            <StatCard icon={<MapPin className="w-4 h-4" />} label="Ballparks Won At" value={`${(stats.ballparksWon || []).length}/${26}`} color="purple" />
            <StatCard icon={<Users className="w-4 h-4" />} label="Players Used" value={(stats.playersUsed || []).length} color="blue" />
            <StatCard icon={<Users className="w-4 h-4" />} label="Pitchers Used" value={(stats.pitchersUsed || []).length} color="blue" />
            <StatCard icon={<Calendar className="w-4 h-4" />} label="Days Played" value={(stats.daysPlayed || []).length} color="amber" />
            <StatCard icon={<Trophy className="w-4 h-4" />} label="Teams Won With" value={`${(stats.teamsWon || []).length}/${totalTeams}`} color="emerald" />
          </div>

          {/* Card Collection summary */}
          {((stats.completedTeamSets || []).length > 0 || (stats.managerCardsCollected || []).length > 0) && (
            <div className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                <span className="font-heading text-[11px] font-bold text-foreground uppercase tracking-wider">Card Collection</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center">
                  <div className="font-heading text-lg font-bold text-primary">{(stats.completedTeamSets || []).length}</div>
                  <div className="text-[9px] text-muted-foreground">Team Sets</div>
                </div>
                <div className="text-center">
                  <div className="font-heading text-lg font-bold text-primary">{(stats.managerCardsCollected || []).length}</div>
                  <div className="text-[9px] text-muted-foreground">Manager Cards</div>
                </div>
              </div>
            </div>
          )}

          {/* Team-by-Team Table */}
          {teamStats.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                <span className="font-heading text-[11px] font-bold text-foreground uppercase tracking-wider">Team-by-Team</span>
              </div>
              <div className="space-y-1">
                {teamStats.map(ts => (
                  <div key={ts.key} className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-muted/30 transition-colors">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={TEAM_LOGOS[ts.key]} alt="" className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-heading text-[10px] font-bold text-foreground truncate block">{ts.city}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-heading shrink-0">
                      <span className="text-muted-foreground w-14 text-center">
                        <span className="text-emerald-400">{ts.w}</span>
                        <span className="text-muted-foreground/40">-</span>
                        <span className="text-rose-400">{ts.l}</span>
                      </span>
                      <span className="text-foreground/70 w-8 text-right">{ts.wpct}%</span>
                      {ts.bestStr > 0 && (
                        <span className="text-amber-400 w-6 text-right" title="Best win streak">🔥{ts.bestStr}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reset All Career Data */}
          <div className="pt-2">
            {confirmReset ? (
              <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-3 text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span className="font-heading text-xs font-bold text-rose-300">Erase Everything?</span>
                </div>
                <p className="text-[10px] text-muted-foreground">All stats, achievements, and card collections will be deleted. This cannot be undone.</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 h-8 rounded-lg border border-border hover:bg-muted/30 text-[10px] font-heading text-muted-foreground transition-colors"
                  >Cancel</button>
                  <button
                    onClick={() => {
                      resetAllData();
                      try {
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith('bb84_cards_') || key.startsWith('bb84_quests') || key.startsWith('ach_groover')) {
                            localStorage.removeItem(key);
                          }
                        });
                      } catch (e) { /* ignore */ }
                      ensureStatsInit();
                      setStats(getStats());
                      setConfirmReset(false);
                    }}
                    className="flex-1 h-8 rounded-lg bg-rose-600 hover:bg-rose-700 text-[10px] font-heading font-bold text-white transition-colors"
                  >Yes, Erase Everything</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full h-8 rounded-lg border border-border/50 hover:border-rose-500/40 hover:bg-rose-950/20 text-[10px] font-heading text-muted-foreground hover:text-rose-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                Reset All Career Data
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}