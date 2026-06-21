import React, { useState, useEffect, useRef } from 'react';
import { X, ShoppingBag, Tag, MapPin } from 'lucide-react';
import { trackVanishedStoresView } from '@/lib/vanishedStoresPopups';

export default function VanishedStoresPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    // Track view and unlock achievements
    const unlocked = trackVanishedStoresView(entry.id);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry, onAchievement]);

  // Auto-dismiss after 10s if user hasn't interacted
  useEffect(() => {
    if (!visible || userInteracted) return;
    autoDismissRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 10000);
    return () => clearTimeout(autoDismissRef.current);
  }, [visible, userInteracted, onDismiss]);

  if (!visible || !entry) return null;

  const handleInteract = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      clearTimeout(autoDismissRef.current);
    }
  };

  const handleDismiss = () => {
    clearTimeout(autoDismissRef.current);
    setVisible(false);
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Retro Mall Store Window */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 store-window"
        style={{ boxShadow: '0 0 40px rgba(34, 197, 94, 0.44)' }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Storefront Frame (1980s mall aesthetic) */}
        <div className="bg-gradient-to-b from-green-950 to-green-900 p-4 border-4 border-green-800 rounded-2xl">
          {/* Storefront Header */}
          <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-green-700 p-4 mb-3 store-header">
            {/* Neon glow effect */}
            <div className="absolute inset-0 opacity-20 store-neon-glow" />

            {/* Header Content */}
            <div className="relative z-20 flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl store-flicker">{entry.icon}</span>
                <div className="flex-1">
                  <h2
                    className="font-heading text-lg font-bold leading-tight store-marquee"
                    style={{ color: '#4ade80', textShadow: '0 0 12px #22c55e66' }}
                  >
                    {entry.store}
                  </h2>
                  {entry.founded && (
                    <p className="text-xs font-body text-green-400/70">Est. {entry.founded}</p>
                  )}
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Tagline */}
            <p className="text-xs font-heading italic text-green-300/90" style={{ textShadow: '0 0 6px #22c55e44' }}>
              "{entry.tagline}"
            </p>
          </div>

          {/* Store Window Content */}
          <div className="relative rounded-lg overflow-hidden bg-[#1a1a1a] border-2 border-green-700">
            {/* Scanlines for retro effect */}
            <div className="pointer-events-none absolute inset-0 z-10 store-scanlines" />

            {/* Content */}
            <div className="relative z-20 p-4 space-y-3 max-h-[400px] overflow-y-auto store-content-scroll">
              {/* Description */}
              <p className="text-xs font-body text-foreground/85 leading-relaxed">
                {entry.description}
              </p>

              {/* Featured Items / Specials */}
              {entry.featured && Object.keys(entry.featured).length > 0 && (
                <div className="space-y-1.5 border-t border-green-700/50 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    Featured Specials
                  </div>
                  {Object.entries(entry.featured).map(([item, price]) => (
                    <div key={item} className="text-[9px] text-foreground/75 flex justify-between">
                      <span>{item}</span>
                      <span className="text-green-400 font-bold">{price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Specials */}
              {entry.specials && Object.keys(entry.specials).length > 0 && (
                <div className="space-y-1.5 border-t border-green-700/50 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    This Week's Specials
                  </div>
                  {Object.entries(entry.specials).map(([item, price]) => (
                    <div key={item} className="text-[9px] text-foreground/75 flex justify-between">
                      <span>{item}</span>
                      <span className="text-green-400 font-bold">{price}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Items List */}
              {entry.items && Array.isArray(entry.items) && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">Featured Items:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.items.map((item, i) => (
                      <span key={i} className="text-[9px] bg-green-900/40 px-2 py-0.5 rounded text-green-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sections */}
              {entry.sections && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">Browse:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.sections.map((sec, i) => (
                      <span key={i} className="text-[9px] bg-green-900/40 px-2 py-0.5 rounded text-green-100">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu */}
              {entry.menu && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">Menu:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.menu.map((item, i) => (
                      <span key={i} className="text-[9px] bg-green-900/40 px-2 py-0.5 rounded text-green-100">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Notice */}
              {entry.special && (
                <div className="p-2 rounded bg-yellow-900/30 border border-yellow-700/50 text-[9px] font-heading text-yellow-300">
                  {entry.special}
                </div>
              )}

              {/* Announcement */}
              {entry.announcement && (
                <div className="p-2 rounded bg-blue-900/30 border border-blue-700/50 text-[9px] font-heading italic text-blue-300">
                  "{entry.announcement}"
                </div>
              )}

              {/* Warning */}
              {entry.warning && (
                <div className="p-2 rounded bg-red-900/30 border border-red-700/50 text-[9px] font-heading text-red-300">
                  ⚠️ {entry.warning}
                </div>
              )}

              {/* Fun Fact */}
              {entry.funFact && (
                <div className="p-2 rounded border bg-green-900/10 border-green-700/30">
                  <div className="text-[9px] font-heading font-bold text-green-400 mb-0.5">💡 Fun Fact</div>
                  <p className="text-[9px] text-foreground/75 leading-relaxed">{entry.funFact}</p>
                </div>
              )}

              {/* Services / Values */}
              {entry.services && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">Services:</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.services.map((svc, i) => (
                      <li key={i}>• {svc}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Values */}
              {entry.values && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">What Sets Us Apart:</div>
                  <ul className="text-[9px] text-foreground/75 space-y-0.5">
                    {entry.values.map((val, i) => (
                      <li key={i}>• {val}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Anchor Stores */}
              {entry.anchor && (
                <div className="space-y-1 border-t border-green-700/50 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">
                    <MapPin className="w-3 h-3" />
                    Anchor Stores
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {entry.anchor.map((store, i) => (
                      <span key={i} className="text-[9px] bg-green-900/40 px-2 py-0.5 rounded text-green-100 font-bold">
                        {store}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tenants */}
              {entry.tenants && (
                <div className="space-y-1">
                  <div className="text-[9px] font-heading font-bold text-green-400 uppercase tracking-wider">Also Visit:</div>
                  <div className="flex flex-wrap gap-1">
                    {entry.tenants.map((tenant, i) => (
                      <span key={i} className="text-[9px] bg-green-900/40 px-2 py-0.5 rounded text-green-100">
                        {tenant}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultural Note */}
              {entry.cultural && (
                <div className="p-2 rounded bg-purple-900/20 border border-purple-700/40 text-[9px] font-body italic text-purple-300/90 border-t border-green-700/50 mt-2 pt-2">
                  {entry.cultural}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-20 bg-[#0a0a0a] px-4 py-1.5 flex justify-between items-center border-t border-green-700/30 text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              <span>Shopping • 1984</span>
              <button
                onClick={handleDismiss}
                className="text-[8px] text-muted-foreground hover:text-foreground transition-colors"
              >
                tap to close
              </button>
            </div>
          </div>

          {/* Shopping Bag Icon (decorative) */}
          <div className="mt-2 flex justify-center">
            <ShoppingBag className="w-5 h-5 text-green-500/60 store-swing" />
          </div>
        </div>

        {/* Styles */}
        <style>{`
          .store-window { position: relative; }
          .store-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.15) 0px,
              rgba(0,0,0,0.15) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .store-marquee { text-shadow: 0 0 12px currentColor; animation: storeMarquee 3s ease-in-out infinite; }
          .store-flicker { animation: storeFlicker 4s infinite; }
          .store-neon-glow { background: radial-gradient(circle, rgba(34, 197, 94, 0.3), transparent); animation: storeGlow 3s ease-in-out infinite; }
          .store-header { position: relative; }
          .store-content-scroll::-webkit-scrollbar { width: 4px; }
          .store-content-scroll::-webkit-scrollbar-track { background: transparent; }
          .store-content-scroll::-webkit-scrollbar-thumb { background: rgba(74, 222, 128, 0.2); border-radius: 2px; }
          .store-swing { animation: storeSwing 3s ease-in-out infinite; transform-origin: top center; }

          @keyframes storeMarquee {
            0%, 100% { text-shadow: 0 0 12px currentColor; }
            50% { text-shadow: 0 0 20px currentColor; }
          }

          @keyframes storeFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          @keyframes storeGlow {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
          }

          @keyframes storeSwing {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
          }
        `}</style>
      </div>
    </div>
  );
}