import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Award, ChevronRight, Star } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { DIVISIONS, getDivision } from '@/lib/seasonSchedule';

const DIV_LABELS = { AL_East: 'AL East', AL_West: 'AL West', NL_East: 'NL East', NL_West: 'NL West' };

function teamFullName(teamKey) {
  const t = TEAMS[teamKey];
  return t ? `${t.city} ${t.name}` : teamKey;
}

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

function AwardRow({ award }) {
  const leagueLabel = award.league === 'AL' ? 'American League' : 'National League';
  let awardLabel = '';
  let icon = null;
  switch (award.awardType) {
    case 'MVP': awardLabel = 'MVP'; icon = <Trophy className="w-3 h-3 text-primary" />; break;
    case 'CyYoung': awardLabel = 'Cy Young'; icon = <Star className="w-3 h-3 text-primary" />; break;
    case 'FiremanOfTheYear': awardLabel = 'Fireman of the Year'; icon = <Star className="w-3 h-3 text-primary" />; break;
    case 'ManagerOfTheYear': awardLabel = 'Manager of the Year'; icon = <Award className="w-3 h-3 text-primary" />; break;
    default: awardLabel = award.awardType;
  }

  return (
    <div className="flex items-baseline gap-2 py-1.5 border-b border-border/30">
      <div className="w-8 shrink-0">{icon}</div>
      <div className="w-20 shrink-0">
        <div className="text-[9px] font-heading text-muted-foreground">{leagueLabel}</div>
        <div className="text-[10px] font-heading font-bold text-primary">{awardLabel}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-heading text-sm font-bold text-foreground">{award.winner}</div>
        <div className="text-[10px] text-muted-foreground">{teamFullName(award.team)}</div>
      </div>
      <div className="text-[9px] text-muted-foreground text-right max-w-[140px] leading-tight">
        {award.statLine}
      </div>
    </div>
  );
}

export default function EndOfRegularSeasonScreen({
  season,
  standingsData,
  awards,
  onCreatePostseason,
  onContinue,
}) {
  const userTeam = season?.userTeam;
  const userDiv = getDivision(userTeam);

  // Find user team standings
  let userStanding = null;
  if (standingsData && userDiv) {
    userStanding = standingsData[userDiv]?.find(t => t.teamKey === userTeam);
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              1984 Regular Season Complete
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {season?.year} Season - Final Results
            </p>
          </div>
        </div>
        <Button onClick={onContinue} variant="outline" size="sm" className="gap-1">
          Continue <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {/* User team summary */}
        {userStanding && (
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4 text-center">
            <div className="text-[10px] font-heading text-muted-foreground mb-1">YOUR TEAM</div>
            <div className="font-heading text-lg font-bold text-foreground">
              {teamFullName(userTeam)}
            </div>
            <div className="font-heading text-2xl font-bold text-primary">
              {userStanding.w}-{userStanding.l}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {DIV_LABELS[userDiv]} · {userStanding.gb === 0 ? 'Division Winner' : `${userStanding.gb.toFixed(1)} GB`}
            </div>
          </div>
        )}

        {/* Division Winners */}
        <div className="mb-4">
          <h2 className="font-heading text-sm font-bold text-foreground mb-2">Division Winners</h2>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(DIVISIONS).map(([div, teams]) => {
              const winner = standingsData?.[div]?.[0];
              if (!winner) return null;
              const isUserDiv = div === userDiv;
              return (
                <div key={div} className={`rounded-lg p-2 border ${isUserDiv ? 'bg-primary/10 border-primary/30' : 'bg-card border-border'}`}>
                  <div className="text-[9px] font-heading text-muted-foreground">{DIV_LABELS[div]}</div>
                  <div className="font-heading text-xs font-bold text-foreground">{teamAbbr(winner.teamKey)}</div>
                  <div className="text-[9px] text-muted-foreground">{winner.w}-{winner.l}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Standings */}
        <div className="mb-4">
          <h2 className="font-heading text-sm font-bold text-foreground mb-2">Final Standings</h2>
          <div className="space-y-2">
            {Object.entries(DIVISIONS).map(([div, teams]) => (
              <div key={div}>
                <div className="text-[10px] font-heading font-bold text-muted-foreground mb-1">{DIV_LABELS[div]}</div>
                <table className="w-full text-[10px]">
                  <tbody>
                    {standingsData?.[div]?.map((t, i) => (
                      <tr key={t.teamKey} className={`border-b border-border/20 ${t.teamKey === userTeam ? 'bg-primary/5' : ''}`}>
                        <td className="py-0.5 px-1 text-muted-foreground w-5">{i + 1}</td>
                        <td className="py-0.5 px-1 text-foreground font-medium">{teamAbbr(t.teamKey)}</td>
                        <td className="py-0.5 px-1 text-foreground text-right">{t.w}-{t.l}</td>
                        <td className="py-0.5 px-1 text-muted-foreground text-right">{t.gb === 0 ? '-' : t.gb.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary" />
              <h2 className="font-heading text-sm font-bold text-foreground">Award Winners</h2>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              {awards.map((a, i) => <AwardRow key={i} award={a} />)}
            </div>
          </div>
        )}

        {/* Create Postseason Button */}
        <Button onClick={onCreatePostseason} className="w-full gap-2 mb-3" size="lg">
          <Trophy className="w-5 h-5" /> Create Postseason
        </Button>
      </div>
    </div>
  );
}