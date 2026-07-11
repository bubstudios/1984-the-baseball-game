import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Play, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

function teamFullName(teamKey) {
  const t = TEAMS[teamKey];
  return t ? `${t.city} ${t.name}` : teamKey;
}

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

function SeriesCard({ title, series, statusLabel }) {
  if (!series) return null;
  const isPending = series.status === 'pending';

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wide">{title}</h3>
        <span className="text-[9px] font-heading text-muted-foreground">
          {isPending ? 'PENDING LCS' : `BEST OF ${series.bestOf}`}
        </span>
      </div>

      {isPending ? (
        <div className="text-center py-4">
          <p className="text-[10px] text-muted-foreground">
            World Series matchup TBD - awaiting LCS winners.
          </p>
        </div>
      ) : (
        <>
          {/* Matchup */}
          <div className="flex items-center justify-between mb-2">
            <div className="text-center flex-1">
              <div className="font-heading text-sm font-bold text-foreground">{teamAbbr(series.earlyHost)}</div>
              <div className="text-[9px] text-muted-foreground">Hosts G1-2</div>
            </div>
            <div className="text-muted-foreground text-[10px] font-heading px-2">vs</div>
            <div className="text-center flex-1">
              <div className="font-heading text-sm font-bold text-foreground">{teamAbbr(series.lateHost)}</div>
              <div className="text-[9px] text-muted-foreground">Hosts G3-5</div>
            </div>
          </div>

          {/* Games schedule */}
          <div className="space-y-0.5">
            {series.games.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] py-0.5">
                <span className="text-muted-foreground w-6">G{g.gameNumber}</span>
                <span className="text-muted-foreground flex items-center gap-0.5">
                  <Calendar className="w-2.5 h-2.5" /> {g.date}
                </span>
                <span className="text-foreground font-medium ml-auto">
                  {teamAbbr(g.awayTeam)} @ {teamAbbr(g.homeTeam)}
                </span>
              </div>
            ))}
          </div>

          {/* Stadium */}
          <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-1 text-[9px] text-muted-foreground">
            <MapPin className="w-2.5 h-2.5" />
            {TEAMS[series.earlyHost]?.stadium} / {TEAMS[series.lateHost]?.stadium}
          </div>
        </>
      )}
    </div>
  );
}

export default function PostseasonBracket({
  season,
  postseason,
  onPlayGame,
  onSimPostseason,
  onContinue,
}) {
  const userTeam = season?.userTeam;
  const userInPostseason = postseason?.divisionWinners &&
    Object.values(postseason.divisionWinners).includes(userTeam);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              1984 Postseason
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              League Championship Series
            </p>
          </div>
        </div>
        <Button onClick={onContinue} variant="outline" size="sm" className="gap-1">
          Continue <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {/* Division Winners summary */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {postseason?.divisionWinners && Object.entries(postseason.divisionWinners).map(([div, team]) => (
            <div key={div} className={`rounded-lg p-2 border ${team === userTeam ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'}`}>
              <div className="text-[9px] font-heading text-muted-foreground">{div.replace('_', ' ')}</div>
              <div className="font-heading text-xs font-bold text-foreground">{teamAbbr(team)}</div>
            </div>
          ))}
        </div>

        {/* ALCS */}
        <SeriesCard title="ALCS" series={postseason?.alcs} />

        {/* NLCS */}
        <SeriesCard title="NLCS" series={postseason?.nlcs} />

        {/* World Series */}
        <SeriesCard title="World Series" series={postseason?.worldSeries} />

        {/* Action buttons */}
        {userInPostseason ? (
          <Button onClick={onPlayGame} className="w-full gap-2 mb-2" size="lg">
            <Play className="w-5 h-5" /> Play Game 1
          </Button>
        ) : (
          <>
            <Button onClick={onSimPostseason} className="w-full gap-2 mb-2" size="lg">
              <Play className="w-5 h-5" /> Sim Postseason
            </Button>
            <p className="text-[10px] text-muted-foreground text-center mb-2">
              Your team did not qualify for the postseason.
            </p>
          </>
        )}

        {/* Home field note */}
        <div className="text-center text-[9px] text-muted-foreground/60 mt-2">
          1984 Rules: NL has World Series home-field advantage.
          All-Star Game result does not affect home field.
        </div>
      </div>
    </div>
  );
}