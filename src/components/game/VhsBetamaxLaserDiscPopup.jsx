import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trackVhsBetamaxLaserDiscView } from '@/lib/vhsBetamaxLaserDiscPopups';

export default function VhsBetamaxLaserDiscPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const unlocked = trackVhsBetamaxLaserDiscView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
  }, [entry.id, onAchievement]);

  if (!visible) return null;

  const categoryColors = {
    technology: 'from-cyan-600 to-blue-600',
    culture: 'from-purple-600 to-pink-600',
    retail: 'from-amber-600 to-orange-600',
    media: 'from-indigo-600 to-purple-600',
    legal: 'from-red-600 to-pink-600',
    entertainment: 'from-pink-600 to-red-600',
    business: 'from-slate-600 to-gray-600',
  };

  const bgGradient = categoryColors[entry.category] || 'from-slate-600 to-gray-600';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-gradient-to-br ${bgGradient} rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-black/40 border-b border-white/20 px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{entry.icon}</span>
              <div>
                <h2 className="font-heading text-xl font-bold text-white tracking-tight">{entry.exhibit}</h2>
                <p className="text-[10px] font-heading text-white/60 uppercase tracking-widest mt-1">{entry.category}</p>
              </div>
            </div>
            <button onClick={onDismiss} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-white/80" />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
          <p className="text-sm font-body text-white/90 leading-relaxed">{entry.description}</p>
          <div className="border-t border-white/20 pt-3 space-y-2">
            <p className="text-xs font-heading text-white/70 uppercase tracking-wide">Fun Fact</p>
            <p className="text-sm font-body text-white/85 italic">{entry.funFact}</p>
          </div>
        </div>

        <div className="bg-black/40 px-5 py-2.5 flex justify-between items-center border-t border-white/20">
          <span className="text-[9px] text-white/50 font-heading uppercase tracking-wider">VHS Museum • 1984</span>
          <button onClick={onDismiss} className="text-[10px] font-heading text-white/70 hover:text-white transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}