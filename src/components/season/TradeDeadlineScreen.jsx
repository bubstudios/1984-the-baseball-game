import React from 'react';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, Newspaper } from 'lucide-react';
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

function TradeCard({ trade, index }) {
  const teamA = TEAMS[trade.teamA];
  const teamB = TEAMS[trade.teamB];
  const isPitcherTrade = trade.teamAGets[0]?.pos === 'SP' || trade.teamAGets[0]?.pos === 'RP' || trade.teamAGets[0]?.pos === 'CL';

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-3">
      {/* Headline */}
      <div className="border-b border-border pb-2 mb-3">
        <h3 className="font-heading text-sm font-bold text-primary uppercase tracking-wide">
          {trade.teamAGets[0].pos === 'SP' || trade.teamAGets[0].pos === 'RP' || trade.teamAGets[0].pos === 'CL'
            ? `${teamA?.city?.toUpperCase()} ADDS ${trade.teamAGets[0].pos === 'SP' ? 'PITCHING' : 'RELIEF HELP'}`
            : `${teamA?.city?.toUpperCase()} ADDS ${trade.teamAGets[0].pos || 'BAT'}`}
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
    </div>
  );
}

export default function TradeDeadlineScreen({ season, trades, onContinue }) {
  const userTeam = season?.userTeam;
  const userTrades = trades?.filter(t => t.teamA === userTeam || t.teamB === userTeam) || [];
  const otherTrades = trades?.filter(t => t.teamA !== userTeam && t.teamB !== userTeam) || [];

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
        <Button onClick={onContinue} size="sm" className="gap-1">
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
            {/* User team trades first */}
            {userTrades.length > 0 && (
              <div className="mb-4">
                <div className="bg-primary/10 border border-primary/30 rounded-md px-3 py-2 mb-3">
                  <p className="text-[10px] font-heading font-bold text-primary">
                    YOUR TEAM MADE A MOVE
                  </p>
                </div>
                {userTrades.map((trade, i) => (
                  <TradeCard key={i} trade={trade} index={i} />
                ))}
              </div>
            )}

            {/* Other trades */}
            {otherTrades.length > 0 && (
              <div>
                <div className="text-[10px] font-heading font-bold text-muted-foreground mb-2 uppercase">
                  Around the League
                </div>
                {otherTrades.map((trade, i) => (
                  <TradeCard key={i} trade={trade} index={i} />
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="mt-4 pt-3 border-t border-border text-center">
              <p className="text-[10px] text-muted-foreground">
                {trades.length} trade{trades.length !== 1 ? 's' : ''} completed.
                Rosters updated for September.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}