import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Newspaper, Check, ShieldCheck } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';

function lastName(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function teamAbbr(teamKey) {
  return TEAMS[teamKey]?.abbr || teamKey;
}

function teamFullName(teamKey) {
  const t = TEAMS[teamKey];
  return t ? `${t.city} ${t.name}` : teamKey;
}

function PitcherStats({ stats }) {
  return (
    <div className="text-[10px] font-body text-muted-foreground">
      <span className="text-foreground font-medium">{stats.label}</span>
      {' | '}
      {stats.era !== '—' ? `${stats.era} ERA` : ''}
      {' | '}
      {stats.whip !== '—' ? `${stats.whip} WHIP` : ''}
      {' | '}
      {stats.ip !== '0' ? `${stats.ip} IP` : '0 IP'}
      {stats.sv > 0 ? ` | ${stats.sv} SV` : ''}
    </div>
  );
}

function BatterStats({ stats }) {
  return (
    <div className="text-[10px] font-body text-muted-foreground">
      <span className="text-foreground font-medium">{stats.label}</span>
      {' | '}
      {stats.avg !== '—' ? `${stats.avg} AVG` : ''}
      {' | '}
      {stats.hr > 0 ? `${stats.hr} HR` : '0 HR'}
      {' | '}
      {stats.rbi > 0 ? `${stats.rbi} RBI` : '0 RBI'}
      {stats.ops !== '—' ? ` | ${stats.ops} OPS` : ''}
    </div>
  );
}

// Headline text derived from the NEED, not the acquired player's raw pos.
// This guarantees the headline matches the stated need.
function getHeadline(trade) {
  const city = TEAMS[trade.teamA]?.city?.toUpperCase() || trade.teamA.toUpperCase();
  if (trade.needPosition) {
    return `${city} ADDS ${trade.needPosition}`;
  }
  if (trade.needType === 'LH_RELIEVER') return `${city} ADDS LH RELIEVER`;
  if (trade.needType === 'SP_UPGRADE') return `${city} ADDS PITCHING`;
  if (trade.needType === 'BACKUP_CATCHER') return `${city} ADDS CATCHING`;
  if (trade.needType === 'LH_BENCH_BAT') return `${city} ADDS LH BAT`;
  if (trade.needType === 'BENCH_BAT') return `${city} ADDS BENCH BAT`;
  return `${city} ADDS ${trade.teamAGets[0]?.pos || 'BAT'}`;
}

function TradeCard({ trade, index, isApproved, onToggleApproval, showApproval }) {
  const teamA = TEAMS[trade.teamA];
  const isPitcherTrade = trade.teamAGets[0]?.pos === 'SP' || trade.teamAGets[0]?.pos === 'RP' || trade.teamAGets[0]?.pos === 'CL';

  return (
    <div className={`bg-card border rounded-lg p-4 mb-3 ${showApproval ? (isApproved ? 'border-primary/50' : 'border-border') : 'border-border'}`}>
      {/* Headline */}
      <div className="border-b border-border pb-2 mb-3">
        <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wide">
          {getHeadline(trade)}
        </h3>
      </div>

      {/* Trade details */}
      <div className="space-y-3">
        {/* Team A receives */}
        <div>
          <div className="text-[10px] font-heading font-bold text-muted-foreground mb-1">
            {teamFullName(trade.teamA)} receive:
          </div>
          {trade.teamAGets.map((p, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="font-heading text-sm text-foreground font-bold">{lastName(p.name)}</span>
              {isPitcherTrade
                ? <PitcherStats stats={p.stats} />
                : <BatterStats stats={p.stats} />}
            </div>
          ))}
          <div className="text-[9px] text-muted-foreground/60">
            from {teamFullName(trade.teamB)}
          </div>
        </div>

        {/* Arrow */}
        <div className="flex items-center justify-center py-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-[10px] font-heading">{teamAbbr(trade.teamA)}</span>
            <ArrowRight className="w-3 h-3" />
            <ArrowRight className="w-3 h-3 rotate-180" />
            <span className="text-[10px] font-heading">{teamAbbr(trade.teamB)}</span>
          </div>
        </div>

        {/* Team B receives */}
        <div>
          <div className="text-[10px] font-heading font-bold text-muted-foreground mb-1">
            {teamFullName(trade.teamB)} receive:
          </div>
          {trade.teamBGets.map((p, i) => (
            <div key={i} className="flex items-baseline gap-2">
              <span className="font-heading text-sm text-foreground font-bold">{lastName(p.name)}</span>
              {isPitcherTrade
                ? <PitcherStats stats={p.stats} />
                : <BatterStats stats={p.stats} />}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div className="mt-3 pt-2 border-t border-border/50">
        <p className="text-[10px] font-body text-muted-foreground italic leading-relaxed">
          {trade.explanation}
        </p>
      </div>

      {/* Approval controls for user-team trades */}
      {showApproval && (
        <div className="mt-3 pt-2 border-t border-border/50">
          {isApproved ? (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-heading font-bold text-primary">
                <Check className="w-3 h-3" /> APPROVED
              </span>
              <Button onClick={() => onToggleApproval(index)} variant="outline" size="sm" className="h-7 text-[10px]">
                Revoke
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-heading text-amber-400">
                <ShieldCheck className="w-3 h-3" /> PENDING APPROVAL
              </span>
              <Button onClick={() => onToggleApproval(index)} variant="default" size="sm" className="h-7 text-[10px] gap-1">
                <Check className="w-3 h-3" /> Approve Trade
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TradeDeadlineScreen({ season, trades, onContinue }) {
  const [approvedSet, setApprovedSet] = useState(new Set());

  const toggleApproval = (index) => {
    setApprovedSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleContinue = () => {
    // CPU trades always applied; user trades only if approved
    const tradesToApply = trades.filter((t, i) => !t.isUserTrade || approvedSet.has(i));
    onContinue(tradesToApply);
  };

  const userTeam = season?.userTeam;
  // Map each trade to its index in the full array
  const userTradeEntries = trades.map((t, i) => ({ trade: t, index: i })).filter(e => e.trade.isUserTrade);
  const otherTradeEntries = trades.map((t, i) => ({ trade: t, index: i })).filter(e => !e.trade.isUserTrade);
  const approvedCount = trades.filter((t, i) => t.isUserTrade && approvedSet.has(i)).length;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              1984 Trade Deadline
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              August 30 - Transactions Wire
            </p>
          </div>
        </div>
        <Button onClick={handleContinue} size="sm" className="gap-1">
          Continue to September <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-md mx-auto w-full">
        {trades.length === 0 ? (
          <div className="text-center py-12">
            <Newspaper className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-heading text-sm text-muted-foreground">
              No trades were made at this year's deadline.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">
              No fair deals could be reached.
            </p>
          </div>
        ) : (
          <>
            {/* User team trades - require approval */}
            {userTradeEntries.length > 0 && (
              <div className="mb-4">
                <div className="bg-primary/10 border border-primary/30 rounded-md px-3 py-2 mb-3">
                  <p className="text-[10px] font-heading font-bold text-primary">
                    YOUR TEAM HAS PENDING TRADES
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">
                    Approve trades involving {teamFullName(userTeam)} or continue without them.
                  </p>
                </div>
                {userTradeEntries.map(({ trade, index }) => (
                  <TradeCard
                    key={index}
                    trade={trade}
                    index={index}
                    isApproved={approvedSet.has(index)}
                    onToggleApproval={toggleApproval}
                    showApproval={true}
                  />
                ))}
                {approvedCount === 0 && (
                  <p className="text-[9px] text-muted-foreground/60 text-center mt-2">
                    No trades approved - your roster stays as-is.
                  </p>
                )}
              </div>
            )}

            {/* CPU trades */}
            {otherTradeEntries.length > 0 && (
              <div>
                <div className="text-[10px] font-heading font-bold text-muted-foreground mb-2 uppercase">
                  Around the League
                </div>
                {otherTradeEntries.map(({ trade, index }) => (
                  <TradeCard
                    key={index}
                    trade={trade}
                    index={index}
                    showApproval={false}
                  />
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-border text-center">
              <p className="text-[10px] text-muted-foreground">
                {trades.length} trade{trades.length !== 1 ? 's' : ''} completed
                {approvedCount > 0 ? ` (${approvedCount} approved by you)` : ''}.
                Rosters updated for September.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}