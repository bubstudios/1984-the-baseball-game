import React from 'react';
import { X } from 'lucide-react';

export default function GenericAdPopup({ entry, onDismiss, questResult }) {
  if (!entry) return null;

  const clue = questResult?.clue;
  const completed = questResult?.completedQuest;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onDismiss}>
      <div
        className="bg-slate-900 rounded-2xl border-2 max-w-md w-full max-h-[85vh] overflow-y-auto"
        style={{ borderColor: entry.color }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 px-5 py-4 flex items-start justify-between" style={{ background: entry.color + '22', borderBottom: `2px solid ${entry.color}44` }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{entry.icon}</span>
            <h2 className="font-heading text-lg font-bold text-white leading-tight">{entry.title}</h2>
          </div>
          <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/10 transition-colors ml-2 shrink-0">
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Quest Completion Banner */}
        {completed && (
          <div className="mx-5 mt-4 rounded-xl px-4 py-3 bg-amber-500/20 border border-amber-400/50">
            <p className="text-xs font-heading font-bold text-amber-400 uppercase tracking-wider mb-1">🎴 Quest Complete!</p>
            <p className="text-sm font-body text-amber-200">{completed.completionMsg || `You completed: ${completed.name}`}</p>
            <p className="text-xs text-amber-400/70 mt-1">A bonus baseball card has been added to your collection!</p>
          </div>
        )}

        {/* Body */}
        <div className="px-5 py-4">
          {entry.body.split('\n').map((line, i) => {
            const isHeader = line === line.toUpperCase() && line.trim().length > 2 && !line.startsWith('•') && !line.startsWith('-');
            if (!line.trim()) return <div key={i} className="h-2" />;
            if (isHeader) {
              return (
                <p key={i} className="font-heading text-xs font-bold tracking-widest uppercase mt-3 mb-1" style={{ color: entry.color }}>
                  {line}
                </p>
              );
            }
            return (
              <p key={i} className="text-sm text-slate-200 font-body leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>

        {/* Quest Clue Footer */}
        {clue && !completed && (
          <div className="mx-5 mb-4 rounded-xl px-4 py-3 bg-slate-800 border border-slate-600">
            <p className="text-[10px] font-heading uppercase tracking-widest text-amber-400/70 mb-1">🗺️ {clue.questName}</p>
            <p className="text-xs font-body text-slate-300 italic">"{clue.clue}"</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (clue.progress / clue.goal) * 100)}%`, backgroundColor: entry.color }}
                />
              </div>
              <span className="text-[10px] font-heading text-slate-400">{clue.progress}/{clue.goal}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-700 flex justify-end">
          <button onClick={onDismiss} className="text-xs font-heading text-slate-400 hover:text-white transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}