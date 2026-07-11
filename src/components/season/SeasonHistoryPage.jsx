import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Trophy, Award, TrendingUp, TrendingDown, Star, Crown, Calendar, ScrollText } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { loadSeasonArchive } from '@/lib/seasonArchive';
import { generateSeasonArchive, saveSeasonArchive } from '@/lib/seasonArchive';

function teamName(teamKey) {
  return TEAMS[teamKey] ? `${TEAMS[teamKey].city} ${TEAMS[teamKey].name}` : teamKey;
}

function formatPct(pct) {
  if (!pct && pct !== 0) return '.000';
  return pct.toFixed(3).replace(/^0/, '');
}

function LeaderRow({ label, value, unit }) {
  return (
    <div className="flex items-center justify-between py-1 px-2 border-b border-border/20 last:border-0">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      <span className="text-[10px] font-heading font-bold text-foreground">{value}{unit}</span>
    </div>
  );
}

export default function SeasonHistoryPage({ season, onClose }) {
  const [archive, setArchive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      if (!season?.id) return;
      try {
        let existing = await loadSeasonArchive(season.id);
        if (!existing && season.seasonPhase === 'SEASON_COMPLETE') {
          setGenerating(true);
          existing = await generateSeasonArchive(season);
          if (existing) {
            await saveSeasonArchive(existing);
          }
          setGenerating(false);
        }
        setArchive(existing);
      } catch (e) {
        console.error('[seasonHistory] Load failed:', e);
      }
      setLoading(false);
    })();
  }, [season?.id]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-heading text-sm text-muted-foreground">
            {generating ? 'Compiling season history...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!archive) {
    return (
      <div className="fixed inset-0 z-[100] bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="font-heading text-sm text-muted-foreground">
            Season history is available after the season is complete.
          </p>
          <Button onClick={onClose} variant="outline" size="sm" className="mt-4">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const userRec = archive.userRecord || {};
  const champion = archive.champion;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              {archive.year} Season History
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {teamName(archive.userTeam)}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 max-w-md mx-auto w-full space-y-4">
        {/* Champion Banner */}
        {champion && (
          <div className={`rounded-lg p-4 text-center border-2 ${champion === archive.userTeam ? 'border-amber-400 bg-amber-900/20' : 'border-border bg-card'}`}>
            <Crown className={`w-8 h-8 mx-auto mb-2 ${champion === archive.userTeam ? 'text-amber-400' : 'text-muted-foreground'}`} />
            <div className="font-heading text-sm font-bold text-foreground">
              World Series Champion
            </div>
            <div className="font-heading text-base font-bold text-primary mt-1">
              {teamName(champion)}
            </div>
            {champion === archive.userTeam && (
              <div className="text-[10px] text-amber-400 font-heading mt-1">YOUR TEAM!</div>
            )}
          </div>
        )}

        {/* User Record */}
        <div className="bg-card border border-border rounded-lg p-3">
          <div className="font-heading text-xs font-bold text-primary mb-2">YOUR RECORD</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="font-heading text-lg font-bold text-foreground">{userRec.wins || 0}</div>
              <div className="text-[9px] text-muted-foreground">WINS</div>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-foreground">{userRec.losses || 0}</div>
              <div className="text-[9px] text-muted-foreground">LOSSES</div>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-foreground">{formatPct(userRec.pct)}</div>
              <div className="text-[9px] text-muted-foreground">PCT</div>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-foreground">{userRec.place || '-'}</div>
              <div className="text-[9px] text-muted-foreground">PLACE</div>
            </div>
          </div>
          <div className="text-[10px] text-muted-foreground text-center mt-2">
            {userRec.division ? userRec.division.replace(/_/g, ' ') : ''}
          </div>
        </div>

        {/* Streaks */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <TrendingUp className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <div className="font-heading text-xl font-bold text-foreground">{archive.longestWinStreak || 0}</div>
            <div className="text-[9px] text-muted-foreground">LONGEST WIN STREAK</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-3 text-center">
            <TrendingDown className="w-4 h-4 text-red-400 mx-auto mb-1" />
            <div className="font-heading text-xl font-bold text-foreground">{archive.longestLossStreak || 0}</div>
            <div className="text-[9px] text-muted-foreground">LONGEST SLUMP</div>
          </div>
        </div>

        {/* Team MVP */}
        {archive.teamMVP && (
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-3.5 h-3.5 text-primary" />
              <span className="font-heading text-xs font-bold text-primary">TEAM MVP</span>
            </div>
            <div className="font-heading text-sm font-bold text-foreground">{archive.teamMVP.name}</div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {formatPct(archive.teamMVP.stats?.avg)} AVG · {archive.teamMVP.stats?.hr || 0} HR · {archive.teamMVP.stats?.rbi || 0} RBI · {formatPct(archive.teamMVP.stats?.ops)} OPS
            </div>
          </div>
        )}

        {/* Best Game / Worst Loss */}
        {(archive.bestGame || archive.worstLoss) && (
          <div className="grid grid-cols-2 gap-2">
            {archive.bestGame && (
              <div className="bg-card border border-emerald-500/20 rounded-lg p-3">
                <div className="text-[9px] font-heading font-bold text-emerald-400 mb-1">BEST WIN</div>
                <div className="font-heading text-xs font-bold text-foreground">{archive.bestGame.score}</div>
                <div className="text-[9px] text-muted-foreground">vs {teamName(archive.bestGame.opponent)}</div>
                <div className="text-[9px] text-muted-foreground">{archive.bestGame.summary}</div>
              </div>
            )}
            {archive.worstLoss && (
              <div className="bg-card border border-red-500/20 rounded-lg p-3">
                <div className="text-[9px] font-heading font-bold text-red-400 mb-1">TOUGH LOSS</div>
                <div className="font-heading text-xs font-bold text-foreground">{archive.worstLoss.score}</div>
                <div className="text-[9px] text-muted-foreground">vs {teamName(archive.worstLoss.opponent)}</div>
                <div className="text-[9px] text-muted-foreground">{archive.worstLoss.summary}</div>
              </div>
            )}
          </div>
        )}

        {/* League Leaders */}
        {archive.leagueLeaders && (
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span className="font-heading text-xs font-bold text-primary">LEAGUE LEADERS</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {archive.leagueLeaders.homeRuns?.[0] && (
                <div>
                  <div className="text-[9px] text-muted-foreground">HR LEADER</div>
                  <div className="text-[10px] font-heading font-bold text-foreground">{archive.leagueLeaders.homeRuns[0].name}</div>
                  <div className="text-[9px] text-muted-foreground">{archive.leagueLeaders.homeRuns[0].value} HR</div>
                </div>
              )}
              {archive.leagueLeaders.battingAverage?.[0] && (
                <div>
                  <div className="text-[9px] text-muted-foreground">AVG LEADER</div>
                  <div className="text-[10px] font-heading font-bold text-foreground">{archive.leagueLeaders.battingAverage[0].name}</div>
                  <div className="text-[9px] text-muted-foreground">{formatPct(archive.leagueLeaders.battingAverage[0].value)}</div>
                </div>
              )}
              {archive.leagueLeaders.wins?.[0] && (
                <div>
                  <div className="text-[9px] text-muted-foreground">WINS LEADER</div>
                  <div className="text-[10px] font-heading font-bold text-foreground">{archive.leagueLeaders.wins[0].name}</div>
                  <div className="text-[9px] text-muted-foreground">{archive.leagueLeaders.wins[0].value} W</div>
                </div>
              )}
              {archive.leagueLeaders.era?.[0] && (
                <div>
                  <div className="text-[9px] text-muted-foreground">ERA LEADER</div>
                  <div className="text-[10px] font-heading font-bold text-foreground">{archive.leagueLeaders.era[0].name}</div>
                  <div className="text-[9px] text-muted-foreground">{(archive.leagueLeaders.era[0].value || 0).toFixed(2)} ERA</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Awards */}
        {archive.seasonAwards && archive.seasonAwards.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Trophy className="w-3.5 h-3.5 text-primary" />
              <span className="font-heading text-xs font-bold text-primary">AWARD WINNERS</span>
            </div>
            <div className="space-y-1">
              {archive.seasonAwards.map((a, i) => (
                <div key={i} className="flex items-center justify-between text-[10px]">
                  <span className="font-heading font-bold text-foreground">{a.winner}</span>
                  <span className="text-muted-foreground">{formatAwardType(a.awardType)}{a.league ? ` ${a.league}` : ''}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
          <div className="font-heading text-xl font-bold text-foreground">{archive.achievementsUnlocked || 0}</div>
          <div className="text-[9px] text-muted-foreground">ACHIEVEMENTS UNLOCKED</div>
        </div>

        <div className="text-center text-[9px] text-muted-foreground/50 pb-4">
          Archived {archive.archivedDate}
        </div>
      </div>
    </div>
  );
}

function formatAwardType(type) {
  const map = {
    MVP: 'MVP', CyYoung: 'Cy Young', ROY: 'ROY',
    FiremanOfTheYear: 'Fireman', ManagerOfTheYear: 'MOY',
  };
  return map[type] || type;
}