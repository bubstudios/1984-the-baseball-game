import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { determinePitcherDecisions } from '@/lib/pitcherDecisions';

function lastName(name) {
  if (!name) return '';
  return name.split(' ').pop();
}

function buildFootnotes(allBatters) {
  const parts = [];
  const fmt = (players, key) => {
    const filtered = players.filter(p => (p.gameStats?.[key] || 0) > 0);
    if (filtered.length === 0) return null;
    return filtered.map(p => {
      const n = lastName(p.name);
      const c = p.gameStats[key];
      return c > 1 ? `${n} ${c}` : n;
    }).join(', ');
  };

  const dbl = fmt(allBatters, 'doubles');
  if (dbl) parts.push(`2B \u2013 ${dbl}`);
  const tpl = fmt(allBatters, 'triples');
  if (tpl) parts.push(`3B \u2013 ${tpl}`);
  const hr = fmt(allBatters, 'hr');
  if (hr) parts.push(`HR \u2013 ${hr}`);
  const sb = fmt(allBatters, 'sb');
  if (sb) parts.push(`SB \u2013 ${sb}`);

  return parts.length > 0 ? parts.join('. ') + '.' : null;
}

function BatterRow({ p }) {
  const isPitcher = ['SP','RP','CL'].includes(p.assignedPos || p.pos);
  return (
    <tr className="border-b border-border/30">
      <td className="py-1 px-1.5 text-foreground font-medium truncate max-w-[120px]">{p.name}</td>
      <td className="text-center py-1 px-1 text-muted-foreground">{p.assignedPos || p.pos}</td>
      <td className="text-center py-1 px-1">{p.gameStats.ab}</td>
      <td className="text-center py-1 px-1">{p.gameStats.hits}</td>
      <td className="text-center py-1 px-1">{p.gameStats.runs}</td>
      <td className="text-center py-1 px-1">{p.gameStats.rbi}</td>
      <td className="text-center py-1 px-1">{p.gameStats.bb}</td>
      <td className="text-center py-1 px-1">{isPitcher ? '-' : p.gameStats.so}</td>
      <td className="text-center py-1 px-1 text-primary font-semibold">{p.gameStats.hr || '-'}</td>
      <td className="text-center py-1 px-1">{p.gameStats.sb || '-'}</td>
      <td className="text-center py-1 px-1">{p.gameStats.cs || '-'}</td>
    </tr>
  );
}

function TeamBox({ team, lineup, pitcher, playerHistory, label }) {
  // Merge active lineup + player history (deduplicate by name)
  const activeNames = new Set(lineup.map(p => p.name));
  const historical = (playerHistory || []).filter(p => !activeNames.has(p.name));
  const allBatters = [...lineup, ...historical];
  const footnotes = buildFootnotes(allBatters);

  // Collect all pitchers: current pitcher + history + lineup pitchers who pitched
  const pitcherNames = new Set();
  const allPitchers = [];
  if (pitcher) {
    pitcherNames.add(pitcher.name);
    allPitchers.push(pitcher);
  }
  (playerHistory || []).forEach(p => {
    if ((p.gameStats?.pitches > 0 || p.gameStats?.ip > 0) && !pitcherNames.has(p.name)) {
      pitcherNames.add(p.name);
      allPitchers.push(p);
    }
  });
  // Also check the lineup for pitchers who have accumulated stats but aren't the active pitcher
  lineup.forEach(p => {
    const isPitcherSlot = ['SP','RP','CL'].includes(p.assignedPos || p.pos);
    if (isPitcherSlot && (p.gameStats?.pitches > 0 || p.gameStats?.ip > 0) && !pitcherNames.has(p.name)) {
      pitcherNames.add(p.name);
      allPitchers.push(p);
    }
  });

  return (
    <div className="space-y-2">
      <h3 className="font-heading font-bold text-sm text-foreground">{label} — {team.name}</h3>

      {/* Batters */}
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-body">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left py-1 px-1.5 font-medium">Player</th>
              <th className="text-center py-1 px-1 font-medium">POS</th>
              <th className="text-center py-1 px-1 font-medium">AB</th>
              <th className="text-center py-1 px-1 font-medium">H</th>
              <th className="text-center py-1 px-1 font-medium">R</th>
              <th className="text-center py-1 px-1 font-medium">RBI</th>
              <th className="text-center py-1 px-1 font-medium">BB</th>
              <th className="text-center py-1 px-1 font-medium">SO</th>
              <th className="text-center py-1 px-1 font-medium">HR</th>
              <th className="text-center py-1 px-1 font-medium">SB</th>
              <th className="text-center py-1 px-1 font-medium">CS</th>
            </tr>
          </thead>
          <tbody>
            {allBatters.map((p, i) => (
              <BatterRow key={i} p={p} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footnotes - 1984 newspaper style */}
      {footnotes && (
        <div className="text-[10px] font-body text-muted-foreground px-1 py-1 italic">
          {footnotes}
        </div>
      )}

      {/* Pitchers */}
      {allPitchers.length > 0 && (
        <div className="mt-2">
          <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">
            Pitcher{allPitchers.length > 1 ? 's' : ''}
          </div>
          {allPitchers.map((p, i) => {
            // Use merged pitcher stats (pitcherSo etc.) when available, fall back to current-pitcher fields
            const k = p.gameStats?.pitcherSo ?? p.gameStats?.so ?? 0;
            const bb = p.gameStats?.pitcherBB ?? p.gameStats?.bb ?? 0;
            const h = p.gameStats?.pitcherH ?? p.gameStats?.h ?? 0;
            const r = p.gameStats?.pitcherR ?? p.gameStats?.r ?? 0;
            return (
              <div key={i} className="flex items-center gap-3 text-[11px] font-body py-0.5">
                <span className="text-foreground font-medium">{p.name}</span>
                <span className="text-muted-foreground">{p.gameStats?.pitches || 0} P</span>
                <span className="text-muted-foreground">{k} K</span>
                <span className="text-muted-foreground">{bb} BB</span>
                <span className="text-muted-foreground">{h} H</span>
                <span className="text-muted-foreground">{r} R</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BoxScore({ state }) {
  const away = TEAMS[state.awayTeam];
  const home = TEAMS[state.homeTeam];
  const decisions = state.gameOver ? determinePitcherDecisions(state) : null;

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-6 p-1">
        <TeamBox team={away} lineup={state.awayLineup} pitcher={state.awayPitcher} playerHistory={state.awayPlayerHistory} label="Away" />
        <TeamBox team={home} lineup={state.homeLineup} pitcher={state.homePitcher} playerHistory={state.homePlayerHistory} label="Home" />
        {decisions && (
          <div className="border-t border-border pt-3 space-y-1">
            <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Decisions</div>
            <div className="flex items-center gap-2 text-[11px] font-body">
              <span className="text-emerald-400 font-bold w-6">W</span>
              <span className="text-foreground font-medium">{decisions.win.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-body">
              <span className="text-red-400 font-bold w-6">L</span>
              <span className="text-foreground font-medium">{decisions.loss.name}</span>
            </div>
            {decisions.save && (
              <div className="flex items-center gap-2 text-[11px] font-body">
                <span className="text-primary font-bold w-6">SV</span>
                <span className="text-foreground font-medium">{decisions.save.name}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}