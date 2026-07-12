import React from 'react';

// ── 1984 TV-broadcast scoreboard strip ──
// Shows the current batter's stat line: LASTNAME  AVG  HR  RBI
// Default state of the middle gameplay banner; special events override it.

function lastName(fullName) {
  if (!fullName) return '';
  const parts = fullName.trim().split(' ');
  return (parts.length > 1 ? parts[parts.length - 1] : fullName).toUpperCase();
}

function formatAvg(avg) {
  if (!avg || !isFinite(avg)) return '.000';
  return avg.toFixed(3).replace(/^0(?=\.)/, '');
}

export default function BatterStatBanner({ batter, stats }) {
  if (!batter || !batter.name) return null;

  const name = lastName(batter.name);
  const avg = formatAvg(stats?.avg);
  const hr = stats?.hr ?? 0;
  const rbi = stats?.rbi ?? '—';

  return (
    <div className="bg-black border border-primary/30 rounded-md px-3 py-1.5">
      <div className="flex items-center justify-center gap-4">
        <span className="font-mono text-sm font-bold text-amber-300 tracking-wider">
          {name}
        </span>
        <div className="flex items-center gap-3">
          <div className="text-center leading-none">
            <div className="font-mono text-sm font-bold text-foreground">{avg}</div>
            <div className="text-[7px] font-mono text-muted-foreground/50 uppercase tracking-wider">AVG</div>
          </div>
          <div className="text-center leading-none">
            <div className="font-mono text-sm font-bold text-foreground">{hr}</div>
            <div className="text-[7px] font-mono text-muted-foreground/50 uppercase tracking-wider">HR</div>
          </div>
          <div className="text-center leading-none">
            <div className="font-mono text-sm font-bold text-foreground">{rbi}</div>
            <div className="text-[7px] font-mono text-muted-foreground/50 uppercase tracking-wider">RBI</div>
          </div>
        </div>
      </div>
    </div>
  );
}