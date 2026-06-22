import React from 'react';
import { X } from 'lucide-react';

export default function TigersStadiumPopup({ entry, onDismiss, onAchievement }) {
  const isHarwell = entry.id === 'harwell_easter_egg';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onDismiss} />
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        style={{ background: isHarwell ? '#0c1a2e' : '#0d1a0d', border: `2px solid ${entry.color}44` }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 py-4 flex items-start justify-between"
          style={{ background: `${entry.color}18`, borderBottom: `1px solid ${entry.color}33` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">{entry.icon}</span>
            <div>
              <h2 className="font-heading text-xl font-bold text-white tracking-tight leading-tight">
                {entry.title}
              </h2>
              {isHarwell && (
                <span className="text-[10px] font-heading tracking-wider uppercase px-2 py-0.5 rounded mt-1 inline-block"
                  style={{ background: `${entry.color}33`, color: entry.color }}>
                  Voice of the Detroit Tigers
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto">
          <pre className="text-sm font-body text-white/85 leading-relaxed whitespace-pre-wrap">
            {entry.body}
          </pre>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-2.5 flex items-center justify-between"
          style={{ borderTop: `1px solid ${entry.color}22` }}
        >
          <span className="text-[9px] text-white/30 font-heading uppercase tracking-wider">
            {isHarwell ? '🎙️ Tiger Stadium' : '🏟️ Detroit Tigers'}
          </span>
          <button
            onClick={onDismiss}
            className="text-[10px] font-heading text-white/40 hover:text-white/70 transition-colors"
          >
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}