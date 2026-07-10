// TEMP DEBUG: Rotation state display for Season Mode testing.
// Shows the persistent rotation pointer, scheduled starter, and rest status
// so you can immediately verify the rotation is cycling SP1→SP2→SP3→SP4→SP5→SP1.

export default function RotationDebugPanel({ debugInfo }) {
  if (!debugInfo) return null;

  const { teamName, rotationNames, rotationIndex, scheduledStarter, probableStarter, isBullpenDay, lastStarts } = debugInfo;

  return (
    <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-3 mb-4">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] font-display text-amber-400">DEBUG</span>
        <span className="text-[10px] font-heading uppercase tracking-widest text-amber-400/70">Rotation State - {teamName}</span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-body mb-2">
        <div>
          <span className="text-muted-foreground">Rotation:</span>{' '}
          <span className="text-foreground font-bold">{rotationNames.join(', ')}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Next Index:</span>{' '}
          <span className="text-foreground font-bold">{rotationIndex}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Scheduled:</span>{' '}
          <span className="text-primary font-bold">{scheduledStarter}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Probable:</span>{' '}
          <span className={isBullpenDay ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
            {probableStarter}{isBullpenDay ? ' (BULLPEN DAY)' : ''}
          </span>
        </div>
      </div>

      <div className="border-t border-amber-500/20 pt-2">
        <div className="text-[9px] font-heading uppercase tracking-widest text-muted-foreground mb-1">Last Start / Rest</div>
        <div className="space-y-0.5">
          {lastStarts.map((ls) => (
            <div key={ls.name} className="flex items-center justify-between text-[10px] font-body">
              <span className={ls.isScheduled ? 'text-primary font-bold' : 'text-foreground/80'}>
                {ls.isScheduled ? '▶ ' : '  '}{ls.name}
              </span>
              <span className="text-muted-foreground">
                {ls.lastStartDate || '—'} ({ls.restDays})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[8px] text-muted-foreground/60 mt-2 italic">
        Acceptance test: starter should cycle SP1→SP2→SP3→SP4→SP5→SP1 with no back-to-back repeats.
      </div>
    </div>
  );
}