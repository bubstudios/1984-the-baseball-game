import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trackExposBannerView } from '@/lib/exposBannerPopups2';

export default function ExposBannerPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    const unlocked = trackExposBannerView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
  }, [entry.id, onAchievement]);
  if (!visible) return null;

  const categoryColors = {
    bobblehead: 'from-red-700 to-blue-700',
    poster: 'from-red-800 to-blue-800',
    historic: 'from-blue-700 to-red-700',
    inspiration: 'from-blue-600 to-red-600',
    community: 'from-red-600 to-orange-600',
  };
  const bgGradient = categoryColors[entry.category] || 'from-slate-600 to-gray-700';
  const animationClass = getAnimationClass(entry.animation);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-gradient-to-br ${bgGradient} rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ${animationClass}`} onClick={(e) => e.stopPropagation()}>
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
        </div>
        <div className="bg-black/40 px-5 py-2.5 flex justify-between items-center border-t border-white/20">
          <span className="text-[9px] text-white/50 font-heading uppercase tracking-wider">🇨🇦 Expos Pride</span>
          <button onClick={onDismiss} className="text-[10px] font-heading text-white/70 hover:text-white transition-colors">tap to close</button>
        </div>
      </div>
    </div>
  );
}

function getAnimationClass(animationType) {
  const animations = {
    heritage_shine: 'animate-pulse',
    power_nod: 'animate-bounce',
    trophy_glow: 'animate-pulse',
    letter_glow: 'animate-pulse',
  };
  return animations[animationType] || '';
}