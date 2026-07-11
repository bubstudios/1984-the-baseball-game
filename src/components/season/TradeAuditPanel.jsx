import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

function lastName(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function StatusBadge({ status }) {
  if (status === 'applied') {
    return <span className="flex items-center gap-1 text-[9px] font-heading font-bold text-emerald-400"><CheckCircle2 className="w-3 h-3" /> APPLIED</span>;
  }
  if (status === 'failed') {
    return <span className="flex items-center gap-1 text-[9px] font-heading font-bold text-red-400"><XCircle className="w-3 h-3" /> FAILED</span>;
  }
  return <span className="flex items-center gap-1 text-[9px] font-heading font-bold text-amber-400"><AlertTriangle className="w-3 h-3" /> GENERATED</span>;
}

function TradeAuditRow({ trade }) {
  const teamA = TEAMS[trade.teamA];
  const teamB = TEAMS[trade.teamB];
  const acquiredName = trade.teamAGets?.[0]?.name;
  const sentName = trade.teamBGets?.[0]?.name;
  const errors = trade.validationErrors || [];
  const isApplied = trade.status === 'applied';
  const isFailed = trade.status === 'failed';

  return (
    <div className={`bg-card border rounded-md p-2 mb-2 ${isFailed ? 'border-red-500/40' : isApplied ? 'border-emerald-500/30' : 'border-border'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] font-heading font-bold text-foreground">
          {lastName(acquiredName)} <span className="text-muted-foreground">to</span> {teamA?.abbr || trade.teamA}
        </div>
        <StatusBadge status={trade.status} />
      </div>
      <div className="text-[9px] text-muted-foreground mb-1">
        {lastName(sentName)} <span className="text-muted-foreground">to</span> {teamB?.abbr || trade.teamB}
      </div>
      <div className="text-[9px] text-muted-foreground/60 mb-1">
        ID: {trade.id || 'legacy'}
      </div>
      {errors.length > 0 ? (
        <div className="mt-1 pt-1 border-t border-border/50">
          <div className="text-[9px] font-heading text-red-400 mb-1">VALIDATION ERRORS:</div>
          {errors.map((e, i) => (
            <div key={i} className="text-[9px] text-red-400/80 ml-2">- {e}</div>
          ))}
        </div>
      ) : isApplied && (
        <div className="mt-1 pt-1 border-t border-border/50">
          <div className="grid grid-cols-2 gap-1 text-[9px]">
            <span className="text-emerald-400">Old team roster: PASS</span>
            <span className="text-emerald-400">New team roster: PASS</span>
            <span className="text-emerald-400">Old lineup removed: PASS</span>
            <span className="text-emerald-400">New role assigned: PASS</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TradeAuditPanel({ trades }) {
  if (!trades || trades.length === 0) return null;

  const applied = trades.filter(t => t.status === 'applied');
  const failed = trades.filter(t => t.status === 'failed');
  const generated = trades.filter(t => !t.status || t.status === 'generated');

  return (
    <div className="mb-4 bg-amber-950/30 border border-amber-500/30 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-heading text-xs font-bold text-amber-400 uppercase tracking-wide">Trade Audit (Debug)</h3>
        <div className="text-[9px] font-heading text-muted-foreground">
          {applied.length} applied / {failed.length} failed / {generated.length} pending
        </div>
      </div>
      {generated.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-md px-2 py-1 mb-2">
          <p className="text-[9px] text-red-400 font-bold">HARD STOP: {generated.length} trade(s) still at "generated" status. Season cannot advance.</p>
        </div>
      )}
      <div className="max-h-60 overflow-y-auto">
        {trades.map((t, i) => <TradeAuditRow key={t.id || i} trade={t} />)}
      </div>
    </div>
  );
}