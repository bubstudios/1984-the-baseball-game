import React, { useState, useEffect, useRef } from 'react';
import { X, Radio } from 'lucide-react';

// Animation overlay components per brand type
function AnimationOverlay({ anim, color }) {
  if (anim === 'fries') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute gp-fry"
            style={{
              left: `${15 + i * 13}%`,
              bottom: '0',
              width: '3px',
              height: '12px',
              backgroundColor: color,
              opacity: 0.4,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (anim === 'flame') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute gp-flame"
            style={{
              left: `${10 + i * 20}%`,
              bottom: '0',
              width: '20px',
              height: '30px',
              background: `radial-gradient(ellipse at bottom, ${color}, transparent 70%)`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (anim === 'pulse') {
    return (
      <div
        className="absolute inset-0 pointer-events-none gp-pulse-overlay"
        style={{ backgroundColor: color, opacity: 0.06 }}
      />
    );
  }
  if (anim === 'wave') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute gp-wave"
            style={{
              left: '-20%',
              right: '-20%',
              top: `${30 + i * 20}%`,
              height: '2px',
              backgroundColor: color,
              opacity: 0.3,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (anim === 'swirl') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div
          className="gp-swirl"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, ${color}, transparent, ${color})`,
            opacity: 0.12,
          }}
        />
      </div>
    );
  }
  if (anim === 'bubbles') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute gp-bubble"
            style={{
              left: `${8 + i * 11}%`,
              bottom: '-10px',
              width: `${6 + (i % 3) * 4}px`,
              height: `${6 + (i % 3) * 4}px`,
              borderRadius: '50%',
              border: `1.5px solid ${color}`,
              opacity: 0.4,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>
    );
  }
  if (anim === 'bluelight') {
    return (
      <div
        className="absolute inset-0 pointer-events-none gp-bluelight-flash"
        style={{ backgroundColor: color }}
      />
    );
  }
  if (anim === 'shimmer') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="gp-shimmer-bar"
          style={{
            background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
          }}
        />
      </div>
    );
  }
  if (anim === 'drive') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-end">
        <div
          className="gp-drive"
          style={{ fontSize: '28px' }}
        >
          🚗
        </div>
      </div>
    );
  }
  if (anim === 'blimp') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="gp-blimp" style={{ fontSize: '24px' }}>🛸</div>
      </div>
    );
  }
  if (anim === 'route') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full gp-route-draw" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path
            d="M 20 150 Q 100 50 200 100 T 380 60"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="6 4"
            opacity="0.4"
          />
        </svg>
      </div>
    );
  }
  if (anim === 'static') {
    return (
      <div className="absolute inset-0 pointer-events-none gp-static-noise" />
    );
  }
  return null;
}

export default function GeneralProductsPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [variant, setVariant] = useState(null); // null | 'rare' | 'ultraRare'
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const showTimer = setTimeout(() => setVisible(true), 100);

    // Roll for bonus text (1% chance) on Sears/Kmart entries
    if (entry.bonusText && Math.random() < 0.01) {
      setShowBonus(true);
    }

    // Roll for broadcast variant (1% ultra-rare, 10% rare, 89% standard)
    if (entry.ultraRareVariant) {
      const roll = Math.random();
      if (roll < 0.01) {
        setVariant('ultraRare');
        if (onAchievement) onAchievement(['broadcast_interruption']);
      } else if (roll < 0.11) {
        setVariant('rare');
      }
    }

    return () => clearTimeout(showTimer);
  }, [entry]);

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

  const color = entry.color || '#0ea5e9';
  const isUltraRare = variant === 'ultraRare';
  const isRare = variant === 'rare';
  const displayTitle = isUltraRare ? entry.ultraRareVariant.title : isRare ? entry.rareVariant.title : entry.title;
  const displayBody = isUltraRare ? entry.ultraRareVariant.body : isRare ? entry.rareVariant.body : entry.body;
  const displayIcon = isUltraRare ? '📺' : entry.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — retro TV commercial aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 gp-tv-frame"
        style={{ boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Wood-grain TV bezel */}
        <div className="bg-gradient-to-b from-amber-950 to-amber-900 p-2.5">
          {/* Screen area */}
          <div
            className="relative rounded-lg overflow-hidden bg-[#0a0a0a] border-2 gp-screen"
            style={{ borderColor: color + '44', boxShadow: `inset 0 0 30px ${color}22` }}
          >
            {/* Animation overlay */}
            <AnimationOverlay anim={entry.anim} color={color} />

            {/* Scanlines */}
            <div className="pointer-events-none absolute inset-0 z-20 gp-scanlines" />

            {/* Header */}
            <div className="relative z-10 bg-[#050505] border-b px-4 py-3" style={{ borderColor: color + '22' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-2xl gp-flicker" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                    {displayIcon}
                  </span>
                  <div>
                    <span
                      className="text-[9px] font-heading font-bold tracking-wider uppercase block gp-text-glow"
                      style={{ color }}
                    >
                      {entry.brand}
                    </span>
                    <h2 className="font-heading text-base font-bold text-foreground leading-tight" style={{ textShadow: `0 0 6px ${color}55` }}>
                      {displayTitle}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* COMMERCIAL badge + variant indicators */}
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center gap-1 text-[8px] font-heading font-bold px-1.5 py-0.5 rounded gp-rec-blink"
                  style={{ backgroundColor: color + '22', color }}
                >
                  <Radio className="w-2.5 h-2.5" />
                  COMMERCIAL
                </span>
                {isUltraRare && (
                  <span className="text-[8px] font-heading font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 gp-rec-blink">
                    ⚠ TECHNICAL DIFFICULTIES
                  </span>
                )}
                {isRare && (
                  <span className="text-[8px] font-heading font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    ✦ RARE BROADCAST
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 px-4 py-3 max-h-[280px] overflow-y-auto gp-body-scroll">
              <p className="text-xs font-body text-foreground/90 leading-relaxed whitespace-pre-line">
                {displayBody}
              </p>

              {/* Bonus text (Sears/Kmart 1% chance) */}
              {showBonus && entry.bonusText && (
                <div
                  className="mt-3 p-2 rounded-lg border gp-bonus-glow"
                  style={{ borderColor: color + '44', backgroundColor: color + '11' }}
                >
                  <p className="text-[10px] font-heading italic" style={{ color }}>
                    ✦ {entry.bonusText}
                  </p>
                </div>
              )}

              {/* Ultra-rare achievement callout */}
              {isUltraRare && (
                <div className="mt-3 p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-center">
                  <p className="text-[10px] font-heading font-bold text-red-400">
                    🏆 Achievement Unlocked: Broadcast Interruption
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="relative z-10 bg-[#050505] px-4 py-2 flex justify-between items-center border-t" style={{ borderColor: color + '14' }}>
              <span className="text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider">
                1984 Broadcast
              </span>
              <button
                onClick={handleDismiss}
                className="text-[9px] font-heading text-muted-foreground hover:text-foreground transition-colors"
              >
                tap to close
              </button>
            </div>
          </div>
        </div>

        {/* TV knobs (decorative) */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-amber-950">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-700/60" />
            <div className="w-2 h-2 rounded-full bg-amber-700/60" />
          </div>
          <span className="text-[7px] font-heading text-amber-700/60 uppercase tracking-widest">
            Color TV
          </span>
          <div className="w-3 h-3 rounded-full bg-amber-700/40" />
        </div>

        {/* Styles + animations */}
        <style>{`
          .gp-tv-frame { position: relative; }
          .gp-screen { position: relative; }
          .gp-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.12) 0px,
              rgba(0,0,0,0.12) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .gp-text-glow { text-shadow: 0 0 5px currentColor; }
          .gp-flicker { animation: gpFlicker 4s infinite; }
          .gp-rec-blink { animation: gpRecBlink 1.5s steps(2) infinite; }
          .gp-bonus-glow { animation: gpBonusGlow 2s ease-in-out infinite; }
          .gp-body-scroll::-webkit-scrollbar { width: 4px; }
          .gp-body-scroll::-webkit-scrollbar-track { background: transparent; }
          .gp-body-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

          /* Fries animation */
          .gp-fry { animation: gpFryRise 2s ease-out infinite; }
          @keyframes gpFryRise {
            0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-60px) rotate(15deg); opacity: 0; }
          }

          /* Flame animation */
          .gp-flame { animation: gpFlameFlicker 0.8s ease-in-out infinite alternate; transform-origin: bottom; }
          @keyframes gpFlameFlicker {
            0% { transform: scaleY(1) scaleX(1); opacity: 0.5; }
            100% { transform: scaleY(1.3) scaleX(0.85); opacity: 0.7; }
          }

          /* Pulse overlay */
          .gp-pulse-overlay { animation: gpPulse 2s ease-in-out infinite; }
          @keyframes gpPulse {
            0%, 100% { opacity: 0.04; }
            50% { opacity: 0.12; }
          }

          /* Wave animation */
          .gp-wave { animation: gpWave 3s ease-in-out infinite; }
          @keyframes gpWave {
            0%, 100% { transform: translateX(0) scaleY(1); }
            50% { transform: translateX(15px) scaleY(1.5); }
          }

          /* Swirl animation */
          .gp-swirl { animation: gpSwirl 4s linear infinite; }
          @keyframes gpSwirl {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          /* Bubbles animation */
          .gp-bubble { animation: gpBubbleRise 3s ease-out infinite; }
          @keyframes gpBubbleRise {
            0% { transform: translateY(0); opacity: 0.4; }
            100% { transform: translateY(-200px); opacity: 0; }
          }

          /* Blue light flash */
          .gp-bluelight-flash { animation: gpBlueLightFlash 1.5s ease-in-out infinite; }
          @keyframes gpBlueLightFlash {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.15; }
          }

          /* Shimmer bar */
          .gp-shimmer-bar {
            position: absolute;
            top: 0; bottom: 0;
            width: 40%;
            animation: gpShimmerSweep 3s ease-in-out infinite;
          }
          @keyframes gpShimmerSweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }

          /* Drive animation */
          .gp-drive { animation: gpDrive 4s linear infinite; }
          @keyframes gpDrive {
            0% { transform: translateX(-40px); }
            100% { transform: translateX(calc(100vw)); }
          }

          /* Blimp float */
          .gp-blimp { animation: gpBlimpFloat 6s ease-in-out infinite; }
          @keyframes gpBlimpFloat {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(20px, -10px); }
          }

          /* Route draw */
          .gp-route-draw path {
            stroke-dasharray: 400;
            stroke-dashoffset: 400;
            animation: gpRouteDraw 3s ease-out infinite;
          }
          @keyframes gpRouteDraw {
            0% { stroke-dashoffset: 400; }
            60%, 100% { stroke-dashoffset: 0; }
          }

          /* TV static noise */
          .gp-static-noise {
            background-image:
              repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 2px, rgba(255,255,255,0.03) 4px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, transparent 2px, rgba(255,255,255,0.02) 4px);
            animation: gpStaticShift 0.2s steps(3) infinite;
          }
          @keyframes gpStaticShift {
            0% { background-position: 0 0; }
            33% { background-position: 2px 1px; }
            66% { background-position: -1px 2px; }
            100% { background-position: 1px -1px; }
          }

          /* Flicker */
          @keyframes gpFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          /* REC blink */
          @keyframes gpRecBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.4; }
          }

          /* Bonus glow */
          @keyframes gpBonusGlow {
            0%, 100% { box-shadow: 0 0 4px currentColor; }
            50% { box-shadow: 0 0 12px currentColor; }
          }
        `}</style>
      </div>
    </div>
  );
}