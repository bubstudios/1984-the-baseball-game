import React from 'react';

export default function BatterInjuryModal({ injury, bench, onSelect }) {
  if (!injury) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-red-500/60 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🚑</span>
          <h2 className="font-heading text-lg font-bold text-red-400">Batter Injury</h2>
        </div>

        {/* Injury details */}
        <div className="text-center mb-4 py-2">
          <div className="text-4xl mb-2">{injury.emoji}</div>
          <p className="font-heading text-base font-bold text-foreground">{injury.batterName}</p>
          <p className="text-sm text-red-400 mt-1">{injury.name}</p>
          <p className="text-xs text-muted-foreground mt-2">Out for the rest of the game</p>
        </div>

        {/* Bench picker */}
        {bench && bench.length > 0 ? (
          <>
            <p className="text-sm text-foreground/80 mb-3 text-center font-heading">Choose a pinch hitter:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {bench.map((p) => (
                <button
                  key={p.name}
                  onClick={() => onSelect(p)}
                  className="w-full text-left bg-muted hover:bg-muted/80 rounded-lg p-3 transition-colors"
                >
                  <div className="font-heading text-sm font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Contact: {p.contact} | Power: {p.power} | Speed: {p.speed}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">No bench players available.</p>
        )}
      </div>
    </div>
  );
}