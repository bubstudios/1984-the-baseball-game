import React from 'react';
import { X, HeartPulse, Ban, UserX } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { computeDaysRemaining } from '@/lib/injuryPersistence';

function teamName(teamKey) {
  return TEAMS[teamKey]?.name || teamKey;
}

function formatDate(dateStr) {
  if (!dateStr) return 'TBD';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (e) { return dateStr; }
}

function getILLabel(severity) {
  const map = {
    minor: 'DTD',
    day_to_day: 'DTD',
    '15_day': '15-day IL',
    '60_day': '60-day IL',
    season_ending: 'Out for Season',
    pregame_scratch: 'Scratched',
  };
  return map[severity] || 'IL';
}

function InjuryRow({ injury, currentDate }) {
  const label = getILLabel(injury.severity);
  const isSeasonEnding = injury.severity === 'season_ending';
  const isScratch = injury.severity === 'pregame_scratch';
  const daysLeft = isSeasonEnding || isScratch ? 0 : computeDaysRemaining(injury.eligibleReturnDate, currentDate);

  let countdownText;
  if (isSeasonEnding) {
    countdownText = null;
  } else if (daysLeft <= 0) {
    countdownText = 'Eligible';
  } else {
    countdownText = `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`;
  }

  const eligibleText = injury.eligibleReturnDate && !isSeasonEnding
    ? `eligible ${formatDate(injury.eligibleReturnDate)}`
    : null;

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/30 opacity-60">
      <HeartPulse className="w-3.5 h-3.5 text-red-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-heading text-xs text-foreground font-medium truncate line-through">
          {injury.playerName}
        </div>
        <div className="text-[10px] text-muted-foreground truncate">
          {injury.injuryType}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] font-heading font-bold text-red-400">
          {label}
        </div>
        {countdownText && (
          <div className="text-[9px] text-muted-foreground">{countdownText}</div>
        )}
        {eligibleText && (
          <div className="text-[9px] text-muted-foreground/70">{eligibleText}</div>
        )}
      </div>
    </div>
  );
}

function SuspensionRow({ suspension, isManager }) {
  const name = suspension.playerName || suspension.managerName;
  const icon = isManager ? <UserX className="w-3.5 h-3.5 text-amber-400 shrink-0" /> : <Ban className="w-3.5 h-3.5 text-orange-400 shrink-0" />;
  const gamesLeft = suspension.gamesRemaining || 0;
  const label = isManager ? 'MGR SUS' : 'SUS';

  let countdownText;
  if (gamesLeft <= 0) {
    countdownText = 'Reinstated';
  } else {
    countdownText = `${gamesLeft} game${gamesLeft !== 1 ? 's' : ''} remaining`;
  }

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/30 opacity-60">
      {icon}
      <div className="flex-1 min-w-0">
        <div className="font-heading text-xs text-foreground font-medium truncate line-through">
          {name}
        </div>
        <div className="text-[10px] text-muted-foreground truncate">
          {suspension.suspensionReason || 'Suspension'}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] font-heading font-bold text-amber-400">
          {label}
        </div>
        <div className="text-[9px] text-muted-foreground">{countdownText}</div>
      </div>
    </div>
  );
}

export default function UnavailablePlayersScreen({ season, injuries, playerSuspensions, managerSuspensions, onClose }) {
  const userTeam = season?.userTeam;
  const currentDate = season?.currentDate;
  const userInjuries = (injuries || []).filter(i => i.teamKey === userTeam && i.active);
  const userPlayerSusp = (playerSuspensions || []).filter(s => s.teamKey === userTeam && s.active);
  const userManagerSusp = (managerSuspensions || []).filter(s => s.teamKey === userTeam && s.active);

  const totalCount = userInjuries.length + userPlayerSusp.length + userManagerSusp.length;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-red-400" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              Unavailable Players
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {TEAMS[userTeam]?.name || userTeam} · {totalCount} unavailable
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 max-w-md mx-auto w-full">
        {totalCount === 0 ? (
          <div className="text-center py-12">
            <HeartPulse className="w-10 h-10 text-emerald-400/30 mx-auto mb-3" />
            <p className="font-heading text-sm text-emerald-400 font-bold">
              Full Roster Available
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              No injuries or suspensions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Injuries */}
            {userInjuries.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase">
                    Injured ({userInjuries.length})
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg divide-y divide-border/30">
                  {userInjuries.map((inj, i) => (
                    <InjuryRow key={inj.id || i} injury={inj} currentDate={currentDate} />
                  ))}
                </div>
              </div>
            )}

            {/* Player Suspensions */}
            {userPlayerSusp.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Ban className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase">
                    Suspended Players ({userPlayerSusp.length})
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg divide-y divide-border/30">
                  {userPlayerSusp.map((s, i) => (
                    <SuspensionRow key={s.id || i} suspension={s} isManager={false} />
                  ))}
                </div>
              </div>
            )}

            {/* Manager Suspensions */}
            {userManagerSusp.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <UserX className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-heading font-bold text-muted-foreground uppercase">
                    Manager Suspended ({userManagerSusp.length})
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg divide-y divide-border/30">
                  {userManagerSusp.map((s, i) => (
                    <SuspensionRow key={s.id || i} suspension={s} isManager={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}