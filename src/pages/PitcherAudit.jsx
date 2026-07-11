import React, { useState } from 'react';
import { runPitcherAudit } from '@/lib/pitcherAudit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

const fmt = (v, d = 2) => v != null && !isNaN(v) ? v.toFixed(d) : '-';
const fmt1 = (v) => fmt(v, 1);

function PitcherTable({ rows, title, highlight }) {
  if (!rows || rows.length === 0) return null;
  const cols = [
    { key: 'name', label: 'Pitcher', sub: 'team' },
    { key: 'ip', label: 'IP', fmt: fmt1 },
    { key: 'era', label: 'ERA', fmt: fmt },
    { key: 'ra9', label: 'RA9', fmt: fmt },
    { key: 'whip', label: 'WHIP', fmt: fmt },
    { key: 'h9', label: 'H/9', fmt: fmt },
    { key: 'bb9', label: 'BB/9', fmt: fmt },
    { key: 'hr9', label: 'HR/9', fmt: fmt },
    { key: 'k9', label: 'K/9', fmt: fmt },
    { key: 'erPct', label: 'ER/R%', fmt: (v) => fmt(v * 100, 0) + '%' },
    { key: 'lobPct', label: 'LOB%', fmt: (v) => fmt(v * 100, 0) + '%' },
    { key: 'babip', label: 'BABIP', fmt: (v) => fmt(v, 3) },
    { key: 'xbhAllowed', label: 'XBH', fmt: (v) => v },
    { key: 'hrWithMenOn', label: 'HR w/MenOn', fmt: (v) => v },
    { key: 'rispAvg', label: 'RISP AVG', fmt: (v) => fmt(v, 3) },
    { key: 'rispSlg', label: 'RISP SLG', fmt: (v) => fmt(v, 3) },
    { key: 'dpInduced', label: 'DP', fmt: (v) => v },
    { key: 'era13', label: 'ERA 1-3', fmt: fmt },
    { key: 'era46', label: 'ERA 4-6', fmt: fmt },
    { key: 'era79', label: 'ERA 7-9', fmt: fmt },
    { key: 'ops0_75', label: 'OPS <76p', fmt: fmt },
    { key: 'ops76_90', label: 'OPS 76-90p', fmt: fmt },
    { key: 'ops91_105', label: 'OPS 91-105p', fmt: fmt },
    { key: 'ops106', label: 'OPS 106+p', fmt: fmt },
  ];

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-sm font-heading font-bold text-primary mb-3">{title}</h3>
      <ScrollArea className="w-full overflow-x-auto">
        <table className="text-[10px] whitespace-nowrap">
          <thead>
            <tr className="border-b border-border">
              {cols.map(c => <th key={c.key} className="px-1.5 py-1 text-right text-muted-foreground font-medium">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.name + i} className={`border-b border-border/40 ${highlight === i ? 'bg-primary/10' : ''}`}>
                {cols.map(c => (
                  <td key={c.key} className={`px-1.5 py-0.5 text-right ${c.key === 'name' ? 'text-left font-medium' : ''}`}>
                    {c.key === 'name' ? (
                      <div>
                        <div className="text-foreground">{r.name}</div>
                        <div className="text-muted-foreground text-[8px] uppercase">{r.team}</div>
                      </div>
                    ) : c.fmt ? c.fmt(r[c.key]) : r[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </Card>
  );
}

function SummaryCard({ label, value, sub }) {
  return (
    <Card className="p-3 flex flex-col items-center justify-center">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-lg font-bold text-primary">{value}</span>
      {sub && <span className="text-[9px] text-muted-foreground">{sub}</span>}
    </Card>
  );
}

export default function PitcherAudit() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleRun = async () => {
    setRunning(true);
    setError(null);
    setReport(null);
    setProgress(0);
    try {
      const result = await runPitcherAudit((day, total, games) => {
        const pct = Math.round((day / total) * 100);
        setProgress(pct);
        setProgressLabel(`Day ${day}/${total} - ${games} games`);
      });
      if (result.error) {
        setError(result.error);
      } else {
        setReport(result);
      }
    } catch (e) {
      setError(e.message);
    }
    setRunning(false);
  };

  const comp = report?.comparisons;

  return (
    <div className="min-h-screen bg-background p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-primary">Pitcher ERA Audit</h1>
          <p className="text-xs text-muted-foreground">Instrumented full-season sim - per-pitcher metrics</p>
        </div>
        <Button onClick={handleRun} disabled={running} size="sm">
          {running ? 'Running...' : 'Run Full Season Audit'}
        </Button>
      </div>

      {running && (
        <Card className="p-4 mb-4">
          <Progress value={progress} className="mb-2" />
          <p className="text-xs text-muted-foreground">{progressLabel} ({progress}%)</p>
        </Card>
      )}

      {error && (
        <Card className="p-4 mb-4 border-destructive">
          <p className="text-sm text-destructive">{error}</p>
        </Card>
      )}

      {report && (
        <>
          {/* Summary grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
            <SummaryCard label="Runs/G" value={fmt(report.summary.runsPerTeamGame, 2)} />
            <SummaryCard label="Starter ERA" value={fmt(report.summary.leagueStarterERA, 2)} sub={`${report.comparisons.leagueStarters.count} pitchers`} />
            <SummaryCard label="Reliever ERA" value={fmt(report.summary.leagueRelieverERA, 2)} sub={`${report.comparisons.leagueRelievers.count} pitchers`} />
            <SummaryCard label="Qualified SP" value={report.summary.qualifiedCount} sub="162+ IP" />
            <SummaryCard label="Top 10 ERA" value={fmt(comp.top10[0]?.era, 2)} sub={comp.top10[0]?.name} />
            <SummaryCard label="Bottom 10 ERA" value={fmt(comp.bottom10[comp.bottom10.length - 1]?.era, 2)} sub={comp.bottom10[comp.bottom10.length - 1]?.name} />
          </div>

          {/* Comparison summary */}
          <Card className="p-4 mb-6">
            <h3 className="text-sm font-heading font-bold text-primary mb-3">ERA Distribution Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Top 10 Avg ERA</p>
                <p className="text-lg font-bold text-emerald-400">{fmt(comp.top10.reduce((s, p) => s + p.era, 0) / comp.top10.length, 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Middle 20 Avg ERA</p>
                <p className="text-lg font-bold text-foreground">{fmt(comp.middle20.length > 0 ? comp.middle20.reduce((s, p) => s + p.era, 0) / comp.middle20.length : 0, 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase">Bottom 10 Avg ERA</p>
                <p className="text-lg font-bold text-red-400">{fmt(comp.bottom10.reduce((s, p) => s + p.era, 0) / comp.bottom10.length, 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase">All Starter ERA</p>
                <p className="text-lg font-bold text-primary">{fmt(report.summary.leagueStarterERA, 2)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-muted-foreground uppercase">All Reliever ERA</p>
                <p className="text-lg font-bold text-secondary">{fmt(report.summary.leagueRelieverERA, 2)}</p>
              </div>
            </div>
          </Card>

          {/* Detailed tables */}
          <PitcherTable rows={comp.top10} title="Top 10 Qualified Starters (by ERA)" />
          <PitcherTable rows={comp.middle20} title="Middle 20 Qualified Starters" />
          <PitcherTable rows={comp.bottom10} title="Bottom 10 Qualified Starters (by ERA)" />

          {/* Full qualified list */}
          <Card className="p-4 mb-6">
            <h3 className="text-sm font-heading font-bold text-primary mb-2">All Qualified Starters ({report.qualifiedStarters.length})</h3>
            <ScrollArea className="max-h-96">
              <table className="text-[10px] w-full">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b border-border">
                    <th className="px-2 py-1 text-left">#</th>
                    <th className="px-2 py-1 text-left">Pitcher</th>
                    <th className="px-2 py-1 text-right">IP</th>
                    <th className="px-2 py-1 text-right">ERA</th>
                    <th className="px-2 py-1 text-right">WHIP</th>
                    <th className="px-2 py-1 text-right">LOB%</th>
                    <th className="px-2 py-1 text-right">BABIP</th>
                    <th className="px-2 py-1 text-right">K/9</th>
                    <th className="px-2 py-1 text-right">BB/9</th>
                    <th className="px-2 py-1 text-right">HR/9</th>
                  </tr>
                </thead>
                <tbody>
                  {report.qualifiedStarters.map((p, i) => (
                    <tr key={p.name + i} className="border-b border-border/40">
                      <td className="px-2 py-0.5 text-muted-foreground">{i + 1}</td>
                      <td className="px-2 py-0.5">
                        <span className="font-medium">{p.name}</span>
                        <span className="text-muted-foreground text-[8px] ml-1 uppercase">{p.team}</span>
                      </td>
                      <td className="px-2 py-0.5 text-right">{fmt1(p.ip)}</td>
                      <td className="px-2 py-0.5 text-right font-bold">{fmt(p.era)}</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.whip)}</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.lobPct * 100, 0)}%</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.babip, 3)}</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.k9)}</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.bb9)}</td>
                      <td className="px-2 py-0.5 text-right">{fmt(p.hr9)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </Card>
        </>
      )}

      {!report && !running && !error && (
        <Card className="p-8 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground mb-2">Run a full 162-game season simulation with per-pitcher instrumentation.</p>
          <p className="text-xs text-muted-foreground">Tracks ERA by inning range, OPS after pitch count, LOB%, BABIP, RISP splits, HR with men on, and more.</p>
        </Card>
      )}
    </div>
  );
}