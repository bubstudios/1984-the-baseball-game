import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { trackDetroitTigersBannerView } from '@/lib/detroitTigersBannerPopups';

export default function DetroitTigersBannerPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const unlocked = trackDetroitTigersBannerView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
  }, [entry.id, onAchievement]);

  if (!visible) return null;

  const categoryColors = {
    bobblehead: 'from-orange-600 to-amber-600',
    poster: 'from-blue-600 to-cyan-600',
    tradition: 'from-indigo-600 to-purple-600',
    fans: 'from-red-600 to-pink-600',
    rivalry: 'from-slate-600 to-gray-700',
    historic: 'from-yellow-600 to-amber-600',
    honors: 'from-green-600 to-emerald-600',
    legacy: 'from-purple-600 to-violet-600',
    prospects: 'from-lime-600 to-green-600',
    media: 'from-cyan-600 to-blue-600',
    ballpark: 'from-amber-600 to-orange-600',
    inspiration: 'from-pink-600 to-rose-600',
    community: 'from-green-600 to-teal-600',
  };

  const bgGradient = categoryColors[entry.category] || 'from-slate-600 to-gray-700';
  const animationClass = getAnimationClass(entry.animationTrigger || entry.animation);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className={`relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-gradient-to-br ${bgGradient} rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 ${animationClass}`}
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
        </div>

        <div className="bg-black/40 px-5 py-2.5 flex justify-between items-center border-t border-white/20">
          <span className="text-[9px] text-white/50 font-heading uppercase tracking-wider">🐯 Tigers Tradition</span>
          <button onClick={onDismiss} className="text-[10px] font-heading text-white/70 hover:text-white transition-colors">
            tap to close
          </button>
        </div>
      </div>
    </div>
  );
}

function getAnimationClass(animationType) {
  const animations = {
    spin: 'animate-spin',
    wiggle: 'animate-pulse',
    fierce_shake: 'animate-bounce',
    power_nod: 'animate-pulse',
    enthusiastic_nod: 'animate-bounce',
    trophy_glow: 'animate-pulse',
    heritage_shine: 'animate-pulse',
    stadium_lights: 'animate-pulse',
    fastball_zip: 'animate-bounce',
    park_sparkle: 'animate-pulse',
    letter_glow: 'animate-pulse',
    stripe_wave: 'animate-pulse',
    heart_pulse: 'animate-pulse',
    lightning_clash: 'animate-bounce',
    victory_glow: 'animate-pulse',
    star_twinkle: 'animate-pulse',
    crown_shine: 'animate-pulse',
    medal_gleam: 'animate-pulse',
    legacy_glow: 'animate-pulse',
    growth_glow: 'animate-pulse',
    signal_wave: 'animate-pulse',
    sizzle_pop: 'animate-bounce',
    future_gleam: 'animate-pulse',
    hands_together: 'animate-pulse',
  };
  return animations[animationType] || '';
}