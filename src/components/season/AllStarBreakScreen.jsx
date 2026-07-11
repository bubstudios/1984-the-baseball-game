import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Star, Trophy, Play, MapPin, ChevronRight } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { getLeague } from '@/lib/seasonSchedule';

function lastName(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

export default function AllStarBreakScreen({
  season,
  rosters,
  allStarMvp,
  allStarGameResult,
  onPlayAllStarGame,
  onSimAllStarGame,
  onContinue,
}) {
  const [view, setView] = useState('main'); // 'main', 'AL', 'NL', 'starters'
  const phase = season?.allStarBreakPhase;
  const gamePlayed = phase === 'game_played';
  const userLeague = getLeague(season?.userTeam);
  const userControlsLeague = userLeague;
  const stadium = rosters?.stadium || 'All-Star Stadium';
  const homeLeague = rosters?.homeLeague || 'NL';

  // ── MVP / Post-game screen ──
  if (gamePlayed) {
    const result = allStarGameResult || {};
    const mvp = allStarMvp;
    const winningLeague = result.winningLeague;
    const homeWon = result.homeScore > result.awayScore;
    const homeTeam = result.homeTeam === 'AL_ALLSTAR' ? 'AL All-Stars' : 'NL All-Stars';
    const awayTeam = result.awayTeam === 'AL_ALLSTAR' ? 'AL All-Stars' : 'NL All-Stars';

    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl">
          <div className="p-6 text-center">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">
              {winningLeague === 'AL' ? 'American League' : 'National League'} Wins!
            </h2>
            <p className="font-heading text-sm text-muted-foreground mb-4">
              1984 All-Star Game
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="font-heading text-xs text-muted-foreground">{awayTeam}</div>
                  <div className="font-heading text-2xl font-bold text-foreground">{result.awayScore}</div>
                </div>
                <div className="text-muted-foreground font-heading text-sm">vs</div>
                <div className="text-center">
                  <div className="font-heading text-xs text-muted-foreground">{homeTeam}</div>
                  <div className="font-heading text-2xl font-bold text-foreground">{result.homeScore}</div>
                </div>
              </div>
            </div>

            {mvp && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="font-heading text-xs uppercase tracking-wider text-primary">All-Star MVP</span>
                </div>
                <div className="font-heading text-lg font-bold text-foreground">{mvp.name}</div>
                <div className="text-xs text-muted-foreground mb-1">
                  {mvp.league === 'AL' ? 'AL' : 'NL'} All-Stars · {TEAMS[mvp.team]?.name || mvp.team}
                </div>
                <div className="text-xs text-foreground/80 italic">{mvp.statLine}</div>
              </div>
            )}

            <p className="text-xs text-muted-foreground mb-4">
              {result.winningLeague === 'AL' ? 'The American League' : 'The National League'} has earned World Series home-field advantage!
            </p>

            <Button onClick={onContinue} className="w-full gap-2">
              Continue to Season <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Roster view ──
  if (view === 'AL' || view === 'NL') {
    const roster = rosters?.[view];
    if (!roster) return null;
    const leagueName = view === 'AL' ? 'American League' : 'National League';

    return (
      <div className="fixed inset-0 z-50 bg-background flex items-start justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl mt-4">
          <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-foreground">{leagueName} All-Stars</h3>
            <button onClick={() => setView('main')} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <div className="text-[10px] font-heading font-bold text-primary mb-1">STARTING LINEUP</div>
              <table className="w-full text-[10px]">
                <tbody>
                  {roster.battingOrder?.map((p, i) => (
                    <tr key={i} className="border-b border-border/20">
                      <td className="py-1 px-1 text-muted-foreground w-6">{i + 1}.</td>
                      <td className="py-1 px-1 text-foreground font-medium">{lastName(p.name)}</td>
                      <td className="py-1 px-1 text-muted-foreground text-right">{p.pos}</td>
                      <td className="py-1 px-1 text-muted-foreground text-right">{teamAbbr(p.teamKey)}</td>
                    </tr>
                  ))}
                  {roster.pitchers?.startingPitcherName && (
                    <tr className="border-b border-border/20">
                      <td className="py-1 px-1 text-muted-foreground">{roster.battingOrder?.length + 1}.</td>
                      <td className="py-1 px-1 text-foreground font-medium">
                        {lastName(roster.pitchers.startingPitcherName)} <span className="text-[9px] text-primary">SP</span>
                      </td>
                      <td className="py-1 px-1 text-muted-foreground text-right">P</td>
                      <td className="py-1 px-1 text-muted-foreground text-right"></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div>
              <div className="text-[10px] font-heading font-bold text-primary mb-1">BENCH</div>
              <div className="grid grid-cols-2 gap-1">
                {roster.bench?.map((p, i) => (
                  <div key={i} className="text-[10px] flex justify-between">
                    <span className="text-foreground">{lastName(p.name)}</span>
                    <span className="text-muted-foreground">{teamAbbr(p.teamKey)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-heading font-bold text-primary mb-1">PITCHERS</div>
              <div className="grid grid-cols-2 gap-1">
                <div className="col-span-2 text-[9px] text-muted-foreground">Starters</div>
                {roster.pitchers?.starters?.map((p, i) => (
                  <div key={i} className="text-[10px] flex justify-between">
                    <span className="text-foreground">{lastName(p.name)}</span>
                    <span className="text-muted-foreground">{teamAbbr(p.teamKey)}</span>
                  </div>
                ))}
                <div className="col-span-2 text-[9px] text-muted-foreground mt-1">Relievers</div>
                {roster.pitchers?.relievers?.map((p, i) => (
                  <div key={i} className="text-[10px] flex justify-between">
                    <span className="text-foreground">{lastName(p.name)}</span>
                    <span className="text-muted-foreground">{teamAbbr(p.teamKey)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Starters view ──
  if (view === 'starters') {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-start justify-center p-4 overflow-y-auto">
        <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl mt-4">
          <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
            <h3 className="font-heading text-sm font-bold text-foreground">All-Star Starters</h3>
            <button onClick={() => setView('main')} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            {['AL', 'NL'].map(league => {
              const roster = rosters?.[league];
              if (!roster) return null;
              return (
                <div key={league}>
                  <div className="text-[10px] font-heading font-bold text-primary mb-1">
                    {league === 'AL' ? 'AMERICAN LEAGUE' : 'NATIONAL LEAGUE'}
                  </div>
                  <table className="w-full text-[10px] mb-2">
                    <tbody>
                      {roster.battingOrder?.map((p, i) => (
                        <tr key={i} className="border-b border-border/20">
                          <td className="py-0.5 px-1 text-muted-foreground w-5">{i + 1}</td>
                          <td className="py-0.5 px-1 text-foreground font-medium">{lastName(p.name)}</td>
                          <td className="py-0.5 px-1 text-muted-foreground text-right">{p.pos}</td>
                          <td className="py-0.5 px-1 text-muted-foreground text-right">{teamAbbr(p.teamKey)}</td>
                        </tr>
                      ))}
                      {roster.pitchers?.startingPitcherName && (
                        <tr className="border-b border-border/20">
                          <td className="py-0.5 px-1 text-muted-foreground">P</td>
                          <td className="py-0.5 px-1 text-foreground font-medium">{lastName(roster.pitchers.startingPitcherName)}</td>
                          <td className="py-0.5 px-1 text-muted-foreground text-right">SP</td>
                          <td className="py-0.5 px-1 text-muted-foreground text-right"></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Main break screen ──
  const homeTeamName = homeLeague === 'AL' ? 'AL All-Stars' : 'NL All-Stars';
  const awayTeamName = homeLeague === 'AL' ? 'NL All-Stars' : 'AL All-Stars';

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl">
        <div className="p-6 text-center">
          <Star className="w-10 h-10 text-primary mx-auto mb-2" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">1984 All-Star Break</h2>
          <p className="text-xs text-muted-foreground mb-4">July 10, 1984</p>

          <div className="bg-muted/50 rounded-lg p-4 mb-4">
            <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Tomorrow</div>
            <div className="font-heading text-base font-bold text-foreground">
              {awayTeamName} vs {homeTeamName}
            </div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" /> {stadium}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <Button onClick={() => setView('AL')} variant="outline" size="sm" className="text-[10px]">AL Roster</Button>
            <Button onClick={() => setView('NL')} variant="outline" size="sm" className="text-[10px]">NL Roster</Button>
            <Button onClick={() => setView('starters')} variant="outline" size="sm" className="text-[10px]">Starters</Button>
          </div>

          <Button onClick={onPlayAllStarGame} className="w-full gap-2 mb-2" size="lg">
            <Play className="w-5 h-5" />
            Play as {userControlsLeague === 'AL' ? 'AL' : 'NL'} All-Stars
          </Button>
          <Button onClick={onSimAllStarGame} variant="outline" className="w-full gap-2" size="sm">
            Simulate All-Star Game
          </Button>
        </div>
      </div>
    </div>
  );
}