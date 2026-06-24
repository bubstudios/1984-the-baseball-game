import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function IncidentLog({ gameState }) {
  const [expanded, setExpanded] = useState(false);

  if (!gameState?._incidents || gameState._incidents.length === 0) {
    return null;
  }

  const incidents = gameState._incidents.slice().reverse(); // Most recent first

  return (
    <div className="bg-card border border-border rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-heading font-bold">🎯 Incidents</span>
          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-heading">
            {incidents.length}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-3 py-2 space-y-2 max-h-64 overflow-y-auto">
          {incidents.map((incident, idx) => (
            <div
              key={idx}
              className={`text-xs border-l-2 pl-2 py-1 ${getIncidentStyle(incident.type)}`}
            >
              <div className="font-heading font-bold text-foreground">
                {incident.inning ? `${incident.inning}` : '?'} — {incident.title}
              </div>
              <div className="text-muted-foreground text-[10px] mt-0.5">{incident.description}</div>
              {incident.consequence && (
                <div className="text-primary text-[10px] mt-1">⚠️ {incident.consequence}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getIncidentStyle(type) {
  const styles = {
    hbp: 'border-destructive/50 bg-destructive/5',
    collision: 'border-amber-400/50 bg-amber-400/5',
    ejection: 'border-destructive border-l-4 bg-destructive/10',
    warning: 'border-orange-400/50 bg-orange-400/5',
    argument: 'border-yellow-500/50 bg-yellow-500/5',
    default: 'border-muted/50 bg-muted/5',
  };
  return styles[type] || styles.default;
}

// Helper to log an incident into gameState
export function logIncident(gameState, title, description, type = 'default', consequence = null) {
  if (!gameState._incidents) {
    gameState._incidents = [];
  }
  gameState._incidents.push({
    title,
    description,
    type,
    consequence,
    inning: `${gameState.halfInning === 'top' ? '▲' : '▼'} ${gameState.inning}`,
  });
  return gameState;
}