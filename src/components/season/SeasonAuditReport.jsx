import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bug, ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import { runSeasonAudit, REALISM_TARGETS } from '@/lib/seasonAudit';

const SEVERITY_CONFIG = {
  critical: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', label: 'Critical' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'Warning' },
  info: { icon: Info, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', label: 'Info' },
};

const CATEGORY_LABELS = {
  boxScore: { label: '1. Box Score Integrity', key: 'boxScore' },
  starters: { label: '2. Starting Pitcher Logic', key: 'starters' },
  bullpen: { label: '3. Bullpen / Reliever Logic', key: 'bullpen' },
  offense: { label: '4. Offensive Realism', key: 'offense' },
  buntSqueeze: { label: '5. Bunt / Squeeze Abuse', key: 'buntSqueeze' },
  events: { label: '6. Game Event Integrity', key: 'events' },
  outliers: { label: '7. Score Outliers', key: 'outliers' },
};

function StatRow({ label, value, status }) {
  const color = status === 'pass' ? 'text-emerald-400' : status === 'fail' ? 'text-red-400' : status === 'warn' ? 'text-amber-400' : 'text-foreground';
  return (
    <div className="flex items-center justify-between py-1 px-2 rounded text-xs">
      <span className="text-muted-foreground font-body">{label}</span>
      <span className={`font-heading font-bold ${color}`}>{value}</span>
    </div>
  );
}

function FlagItem({ flag }) {
  const config = SEVERITY_CONFIG[flag.severity] || SEVERITY_CONFIG.info;
  const Icon = config.icon;
  return (
    <div className={`flex items-start gap-2 p-2 rounded-lg ${config.bg} border ${config.border}`}>
      <Icon className={`w-4 h-4 ${config.color} flex-shrink-0 mt-0.5`} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body text-foreground">{flag.message}</p>
        {flag.gameRef && <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{flag.gameRef}</p>}
      </div>
    </div>
  );
}

function CategorySection({ label, stats, flags, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const categoryFlags = flags.filter(f => f.category.toLowerCase().includes(label.split('.')[1].toLowerCase().split(' ')[0]));
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-2">
          {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          <span className="font-heading text-sm font-bold text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {categoryFlags.length > 0 && (
            <span className="text-[10px] font-heading px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">{categoryFlags.length} flags</span>
          )}
          {categoryFlags.length === 0 && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2">
          {stats && Object.keys(stats).length > 0 && (
            <div className="bg-muted/20 rounded-lg p-2 space-y-0.5">
              {Object.entries(stats).map(([key, val]) => {
                if (val !== null && typeof val === 'object') return null;
                return (
                  <StatRow key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())} value={typeof val === 'number' ? val : String(val)} />
                );
              })}
            </div>
          )}
          {categoryFlags.length > 0 && (
            <div className="space-y-1.5">
              {categoryFlags.map((flag, i) => <FlagItem key={i} flag={flag} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SeasonAuditReport() {
  const [days, setDays] = useState(7);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ day: 0, total: 0, games: 0 });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleRun = useCallback(async () => {
    setRunning(true);
    setError(null);
    setReport(null);
    setProgress({ day: 0, total: days, games: 0 });
    try {
      const result = await runSeasonAudit(days, (day, total, games) => {
        setProgress({ day, total, games });
      });
      if (result.error) {
        setError(result.error);
      } else {
        setReport(result);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setRunning(false);
    }
  }, [days]);

  const flagsByCategory = (cat) => {
    if (!report) return [];
    const catLabel = CATEGORY_LABELS[cat]?.label || cat;
    const catName = catLabel.split('.')[1]?.trim().split(' ')[0]?.toLowerCase() || cat;
    return report.flags.filter(f => {
      const flagCat = f.category.toLowerCase();
      if (cat === 'boxScore') return flagCat.includes('box');
      if (cat === 'starters') return flagCat.includes('starter');
      if (cat === 'bullpen') return flagCat.includes('bullpen');
      if (cat === 'offense') return flagCat.includes('realism');
      if (cat === 'buntSqueeze') return flagCat.includes('bunt') || flagCat.includes('squeeze');
      if (cat === 'events') return flagCat.includes('event');
      if (cat === 'outliers') return flagCat.includes('outlier');
      return false;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Bug className="w-6 h-6 text-primary" />
            <h1 className="font-display text-[10px] text-primary tracking-wider">SEASON AUDIT REPORT</h1>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            Internal developer tool - runs headless simulations and flags season mode issues.
          </p>
        </div>

        {/* Control Panel */}
        {!report && !running && (
          <div className="bg-card border border-border rounded-xl p-4 mb-4">
            <h3 className="font-heading text-sm font-bold text-foreground mb-3 text-center">Select Test Duration</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`rounded-xl p-3 border transition-colors ${days === d ? 'bg-primary/20 border-primary text-primary' : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'}`}
                >
                  <span className="font-heading text-lg font-bold block">{d}</span>
                  <span className="text-[10px] font-body">days</span>
                </button>
              ))}
            </div>
            <Button onClick={handleRun} className="w-full gap-2">
              <Bug className="w-4 h-4" />
              Run Audit ({days} days, ~{days * 13} games)
            </Button>
          </div>
        )}

        {/* Progress */}
        {running && (
          <div className="bg-card border border-border rounded-xl p-6 mb-4 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-heading text-sm text-foreground">Simulating...</p>
            <p className="text-xs text-muted-foreground font-body mt-1">
              Day {progress.day} of {progress.total} - {progress.games} games simulated
            </p>
            <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-primary h-full transition-all" style={{ width: `${progress.total > 0 ? (progress.day / progress.total) * 100 : 0}%` }}></div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-sm text-red-400 font-body">{error}</p>
          </div>
        )}

        {/* Report */}
        {report && !running && (
          <div className="space-y-3">
            {/* Summary */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-foreground">{report.totalGames}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Games Simulated</p>
                </div>
                <div className="text-center">
                  <p className="font-heading text-2xl font-bold text-foreground">{report.daysSimulated}</p>
                  <p className="text-[10px] text-muted-foreground font-body">Days Simulated</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 text-center">
                  <p className="font-heading text-lg font-bold text-red-400">{report.flagCounts.critical}</p>
                  <p className="text-[9px] text-muted-foreground font-body">Critical</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 text-center">
                  <p className="font-heading text-lg font-bold text-amber-400">{report.flagCounts.warning}</p>
                  <p className="text-[9px] text-muted-foreground font-body">Warnings</p>
                </div>
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-2 text-center">
                  <p className="font-heading text-lg font-bold text-sky-400">{report.flagCounts.info}</p>
                  <p className="text-[9px] text-muted-foreground font-body">Info</p>
                </div>
              </div>
              {report.gamesWithErrors > 0 && (
                <div className="mt-2 bg-red-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-red-400 font-body">{report.gamesWithErrors} game(s) failed simulation</p>
                </div>
              )}
            </div>

            {/* Realism Targets */}
            {report.categories.offense && (
              <div className="bg-card border border-border rounded-xl p-3">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">Realism Targets</h3>
                <div className="space-y-0.5">
                  {Object.entries(report.categories.offense).map(([key, value]) => {
                    const target = REALISM_TARGETS[key];
                    if (!target) return null;
                    if (typeof value !== 'number') return null;
                    const inRange = value >= target.min && value <= target.max;
                    return (
                      <div key={key} className="flex items-center justify-between py-1 px-2 rounded text-xs">
                        <span className="text-muted-foreground font-body">{target.label}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-heading font-bold ${inRange ? 'text-emerald-400' : 'text-amber-400'}`}>{value.toFixed(2)}</span>
                          <span className="text-[9px] text-muted-foreground font-mono">{target.min}-{target.max}</span>
                          {inRange ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Sections */}
            {Object.entries(CATEGORY_LABELS).map(([cat, info]) => (
              <CategorySection
                key={cat}
                label={info.label}
                stats={report.categories[cat]}
                flags={flagsByCategory(cat)}
                defaultOpen={flagsByCategory(cat).length > 0}
              />
            ))}

            {/* All Flags List */}
            {report.flags.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-3">
                <h3 className="font-heading text-sm font-bold text-foreground mb-2">All Flags ({report.flags.length})</h3>
                <div className="space-y-1.5 max-h-96 overflow-y-auto">
                  {report.flags.map((flag, i) => <FlagItem key={i} flag={flag} />)}
                </div>
              </div>
            )}

            {/* Re-run */}
            <Button onClick={() => { setReport(null); }} variant="outline" className="w-full">
              Run Again
            </Button>
          </div>
        )}

        {/* Back */}
        {!report && !running && (
          <div className="text-center mt-4">
            <Button onClick={() => window.location.href = '/season'} variant="ghost" size="sm" className="text-muted-foreground">
              Back to Season
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}