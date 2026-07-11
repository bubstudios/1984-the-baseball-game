import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Play, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { getSeriesWins } from '@/lib/postseasonSim';

function teamFullName(teamKey) {
  const t = TEAMS[teamKey];
  return t ? `${t.city} ${t.name}` : teamKey;
}

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

function SeriesCard({ title, series }) {
  if (!series) return null;
  const isPending = series.status === 'pending';
  const isComplete = series.status === 'complete';
  const wins = getSeriesWins(series);

  const isWS = title === 'World Series';
  const teamA = isWS ? series.topHost : series.earlyHost;
  const teamB = isWS ? series.midHost : series.lateHost;
  const hostLabelA = isWS ? 'Hosts G1,2,6,7' : 'Hosts G1-2';
  const hostLabelB = isWS ? 'Hosts G3,4,5' : 'Hosts G3-5';

  return (
    <div className={`bg-card border rounded-lg p-3 mb-3 ${isComplete ? 'border-primary/40' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wide">{title}</h3>
        <span className="text-[9px] font-heading text-muted-foreground">
          {isPending ? 'PENDING' : `BEST OF ${series.bestOf}`}
        </span>
      </div>

      {isPending ? (
        <div className="text-center py-4">
          <p className="text-[10px] text-muted-foreground">
            {isWS ? 'Awaiting LCS winners.' : 'TBD'}
          </p>
        </div>
      ) : (
        <>
          {/* Series score */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border/30">
            <div className="flex-1 text-center">
              <div className={`font-heading text-sm font-bold ${series.winner === teamA ? 'text-primary' : 'text-foreground'}`}>
                {teamAbbr(teamA)}
              </div>
              <div className="text-[8px] text-muted-foreground">{hostLabelA}</div>
              <div className="text-lg font-heading font-bold text-foreground mt-0.5">{wins[teamA] || 0}</div>
            </div>
            <div className="text-muted-foreground text-[10px] font-heading px-2 self-center">
              {isComplete ? `${teamAbbr(series.winner)} WINS` : 'vs'}
            </div>
            <div className="flex-1 text-center">
              <div className={`font-heading text-sm font-bold ${series.winner === teamB ? 'text-primary' : 'text-foreground'}`}>
                {teamAbbr(teamB)}
              </div>
              <div className="text-[8px] text-muted-foreground">{hostLabelB}</div>
              <div className="text-lg font-heading font-bold text-foreground mt-0.5">{wins[teamB] || 0}</div>
            </div>
          </div>

          {/* Games */}
          <div className="space-y-0.5">
            {series.games.map((g, i) => (
              <div key={i} className="flex items-center gap-2 text-[9px] py-0.5">
                <span className="text-muted-foreground w-6">G{g.gameNumber}</span>
                {g.status === 'complete' ? (
                  <>
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" /> {g.date}
                    </span>
                    <span className={`font-medium ml-auto ${g.winner === g.homeTeam ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
                      {teamAbbr(g.awayTeam)} {g.awayScore}-{g.homeScore} {teamAbbr(g.homeTeam)}
                    </span>
                  </>
                ) : g.status === 'not_needed' ? (
                  <span className="text-muted-foreground/40 ml-auto">not needed</span>
                ) : (
                  <>
                    <span className="text-muted-foreground flex items-center gap-0.5">
                      <Calendar className="w-2.5 h-2.5" /> {g.date}
                    </span>
                    <span className="text-muted-foreground ml-auto">
                      {teamAbbr(g.awayTeam)} @ {teamAbbr(g.homeTeam)}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Stadium */}
          {!isWS && (
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-1 text-[9px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              {TEAMS[series.earlyHost]?.stadium} / {TEAMS[series.lateHost]?.stadium}
            </div>
          )}
          {isWS && teamA && teamB && (
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center gap-1 text-[9px] text-muted-foreground">
              <MapPin className="w-2.5 h-2.5" />
              {TEAMS[teamA]?.stadium} / {TEAMS[teamB]?.stadium}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function PostseasonBracket({
  season,
  postseason,
  simulating,
  onPlayGame,
  onSimPostseason,
  onContinue,
}) {
  const userTeam = season?.userTeam;
  const userInPostseason = postseason?.divisionWinners &&
    Object.values(postseason.divisionWinners).includes(userTeam);
  const wsComplete = postseason?.worldSeries?.status === 'complete';
  const champion = wsComplete ? postseason.worldSeries.winner : null;

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
              {wsComplete ? 'World Series Complete' : 'League Championship Series'}
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

        {/* Champion banner */}
        {champion && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-3 text-center">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-1" />
            <div className="text-[9px] font-heading uppercase tracking-widest text-primary">World Series Champion</div>
            <div className="font-heading text-lg font-bold text-foreground">{teamFullName(champion)}</div>
          </div>
        )}

        {/* Non-qualifier message */}
        {!userInPostseason && !wsComplete && (
          <p className="text-[10px] text-muted-foreground text-center mb-2">
            Your team did not qualify for the postseason.
          </p>
        )}

        {/* Action buttons */}
        {!wsComplete && (
          <Button
            onClick={onSimPostseason}
            disabled={simulating}
            className="w-full gap-2 mb-2"
            size="lg"
          >
            {simulating ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            Sim Next Game
          </Button>
        )}

        {/* Home field note */}
        <div className="text-center text-[9px] text-muted-foreground/60 mt-2">
          World Series home field awarded to the league that won the All-Star Game.
        </div>
      </div>
    </div>
  );
}