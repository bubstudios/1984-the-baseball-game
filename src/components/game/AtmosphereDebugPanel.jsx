import React, { useState, useEffect } from 'react';
import { Bug, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { getCounters, resetCounters } from '@/lib/atmosphereDebug';

const COUNTER_LABELS = [
  { key: 'bp_checked', label: 'BP Checked', color: 'text-blue-400' },
  { key: 'bp_fired', label: 'BP Fired', color: 'text-green-400' },
  { key: 'bp_blocked_cooldown', label: 'BP Blk CD', color: 'text-orange-400' },
  { key: 'celeb_checked', label: 'Celeb Chk', color: 'text-blue-400' },
  { key: 'celeb_fired', label: 'Celeb Fxd', color: 'text-green-400' },
  { key: 'bubble_fired', label: 'Bubble Fxd', color: 'text-green-400' },
  { key: 'fan_checked', label: 'Fan Chk', color: 'text-blue-400' },
  { key: 'fan_fired', label: 'Fan Fxd', color: 'text-green-400' },
  { key: 'bench_checked', label: 'Bench Chk', color: 'text-blue-400' },
  { key: 'bench_fired', label: 'Bench Fxd', color: 'text-green-400' },
  { key: 'blocked_banner', label: 'Blk Banner', color: 'text-red-400' },
  { key: 'blocked_gamestate', label: 'Blk GS', color: 'text-red-400' },
];

const BUTTONS = [
  { id: 'ballpark', label: 'Force BP Event', color: 'bg-blue-600/80 hover:bg-blue-600' },
  { id: 'celebration', label: 'Force Celeb', color: 'bg-purple-600/80 hover:bg-purple-600' },
  { id: 'fanchirp', label: 'Force Fan Chirp', color: 'bg-cyan-600/80 hover:bg-cyan-600' },
  { id: 'benchchirp', label: 'Force Bench Chirp', color: 'bg-amber-600/80 hover:bg-amber-600' },
  { id: 'ejection', label: 'Force Ejection', color: 'bg-red-600/80 hover:bg-red-600' },
  { id: 'robbedhr', label: 'Force Robbed HR', color: 'bg-indigo-600/80 hover:bg-indigo-600' },
];

export default function AtmosphereDebugPanel({ onForce }) {
  const [expanded, setExpanded] = useState(false);
  const [counts, setCounts] = useState(getCounters());

  useEffect(() => {
    if (!expanded) return;
    const interval = setInterval(() => setCounts(getCounters()), 500);
    return () => clearInterval(interval);
  }, [expanded]);

  const handleForce = (id) => {
    onForce?.(id);
    setTimeout(() => setCounts(getCounters()), 100);
  };

  return (
    <div className="fixed bottom-24 left-3 z-40 pointer-events-auto">
      {/* Toggle button */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="flex items-center gap-1 bg-card/90 border border-primary/40 rounded-full px-2.5 py-1.5 shadow-lg text-primary font-heading text-xs hover:bg-primary/10 transition-colors"
      >
        <Bug className="w-3.5 h-3.5" />
        <span>Atmo</span>
        {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-1.5 bg-card/95 border border-border rounded-xl p-2.5 shadow-2xl w-[200px] backdrop-blur-sm">
          {/* Counters */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-heading uppercase tracking-wider text-muted-foreground">Counters</span>
              <button
                onClick={() => { resetCounters(); setCounts(getCounters()); }}
                className="text-[9px] text-muted-foreground hover:text-foreground flex items-center gap-0.5"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {COUNTER_LABELS.map(({ key, label, color }) => (
                <div key={key} className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-bold ${color}`}>{counts[key] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-2" />

          {/* Force buttons */}
          <div className="space-y-1">
            {BUTTONS.map(btn => (
              <button
                key={btn.id}
                onClick={() => handleForce(btn.id)}
                className={`w-full text-[10px] font-heading font-semibold text-white rounded-md py-1.5 transition-colors ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}