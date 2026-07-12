import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, HeartPulse, Calendar, ArrowLeft } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { getSeverityLabel } from '@/lib/injuryConfig';
import { formatGameDate } from '@/lib/seasonSchedule';
import { computeDaysRemaining } from '@/lib/injuryPersistence';

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

function teamFullName(teamKey) {
  const t = TEAMS[teamKey];
  return t ? `${t.city} ${t.name}` : teamKey;
}

export default function InjuryReportScreen({ season, injuries, onClose }) {
  const [selectedTeam, setSelectedTeam] = useState(season?.userTeam || null);

  const userTeam = season?.userTeam;
  const userInjuries = injuries.filter(i => i.teamKey === userTeam);
  const otherInjuries = injuries.filter(i => i.teamKey !== userTeam);

  const selectedInjuries = selectedTeam
    ? injuries.filter(i => i.teamKey === selectedTeam)
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-400" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              Injury Report
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {formatGameDate(season?.currentDate)} - Active Injuries
            </p>
          </div>
        </div>
        <Button onClick={onClose} variant="ghost" size="sm" className="px-2">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {injuries.length === 0 ? (
          <div className="text-center py-12">
            <HeartPulse className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-heading text-sm text-muted-foreground">
              No active injuries across the league.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              All rosters are healthy.
            </p>
          </div>
        ) : (
          <>
            {/* User team injuries */}
            {userInjuries.length > 0 && (
              <div className="mb-4">
                <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 mb-3">
                  <p className="text-[10px] font-heading font-bold text-red-400">
                    YOUR TEAM - {teamFullName(userTeam)}
                  </p>
                </div>
                {userInjuries.map((injury, i) => (
                  <InjuryCard key={i} injury={injury} currentDate={season?.currentDate} />
                ))}
              </div>
            )}

            {/* Around the league */}
            {otherInjuries.length > 0 && (
              <div>
                <div className="text-[10px] font-heading font-bold text-muted-foreground mb-2 uppercase">
                  Around the League
                </div>
                {otherInjuries.map((injury, i) => (
                  <InjuryCard key={i} injury={injury} currentDate={season?.currentDate} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function InjuryCard({ injury, currentDate }) {
  const [expanded, setExpanded] = useState(false);
  const severityColor = {
    day_to_day: 'text-amber-400',
    '15_day': 'text-orange-400',
    '60_day': 'text-red-400',
    season_ending: 'text-red-500',
    pregame_scratch: 'text-yellow-400',
    minor: 'text-muted-foreground',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-3 mb-2">
      <div className="flex items-baseline justify-between">
        <div>
          <span className="font-heading text-sm text-foreground font-bold">
            {injury.playerName}
          </span>
          <span className="text-[10px] text-muted-foreground ml-2">
            {injury.playerPos} - {teamAbbr(injury.teamKey)}
          </span>
        </div>
        <span className={`text-[10px] font-heading font-bold ${severityColor[injury.severity] || 'text-muted-foreground'}`}>
          {getSeverityLabel(injury.severity)}
        </span>
      </div>
      <div className="text-[10px] font-body text-muted-foreground mt-1">
        {injury.injuryType}
      </div>
      {injury.severity !== 'season_ending' && injury.severity !== 'minor' && (
        <div className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
          <Calendar className="w-2.5 h-2.5" />
          Eligible: {formatGameDate(injury.eligibleReturnDate)}
          {(() => { const dr = computeDaysRemaining(injury.eligibleReturnDate, currentDate); return dr > 0 ? ` (${dr}d left)` : ''; })()}
        </div>
      )}
    </div>
  );
}