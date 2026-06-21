import React, { useState, useEffect, useRef } from 'react';
import { X, Power } from 'lucide-react';

// Retro ASCII-style brand wordmarks for select entries
const BRAND_GLYPHS = {
  tandy_1: '╔══════════════════╗\n║  TANDY  1000  ║\n╚══════════════════╝',
  tandy_2: '╔══════════════════╗\n║  TANDY  1000  ║\n╚══════════════════╝',
  tandy_3: '╔══════════════════╗\n║  TANDY  1000  ║\n╚══════════════════╝',
  tandy_4: '╔══════════════════╗\n║  TANDY  1000  ║\n╚══════════════════╝',
  c64_1: '▓▒░ COMMODORE 64 ░▒▓',
  c64_2: '▓▒░ COMMODORE 64 ░▒▓',
  c64_3: '▓▒░ COMMODORE 64 ░▒▓',
  atari_1: '◤◢ ATARI ◣◥',
  atari_2: '◤◢ ATARI 800XL ◣◥',
  atari_3: '◤◢ ATARI 800XL ◣◥',
  apple_1: '⌘ APPLE IIe ⌘',
  apple_2: '⌘ APPLE IIe ⌘',
  apple_3: '⌘ APPLE IIe ⌘',
  walkman_1: '►► SONY WALKMAN ◄◄',
  sony_1: '►► SONY ◄◄',
};

// Boot sequence lines for the "powering on" effect
const BOOT_LINES = [
  'SYSTEM READY',
  'LOADING...',
  'INITIALIZING...',
  'PLEASE STAND BY',
];

export default function ElectronicsPopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [booting, setBooting] = useState(true);
  const [bootLineIdx, setBootLineIdx] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry]);

  // Boot sequence animation — cycles through boot lines then reveals content
  useEffect(() => {
    if (!visible || !booting) return;
    if (bootLineIdx >= BOOT_LINES.length) {
      const t = setTimeout(() => setBooting(false), 250);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBootLineIdx(i => i + 1), 180);
    return () => clearTimeout(t);
  }, [visible, booting, bootLineIdx]);

  // Auto-dismiss after 10s if user hasn't interacted
  useEffect(() => {
    if (!visible || userInteracted || booting) return;
    autoDismissRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 10000);
    return () => clearTimeout(autoDismissRef.current);
  }, [visible, userInteracted, onDismiss, booting]);

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

  const color = entry.color || '#4ade80';
  const glyph = BRAND_GLYPHS[entry.id];
  const isRecording = ['camcorder_1', 'vhs_1', 'vhs_2', 'vcr_1'].includes(entry.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — retro CRT terminal aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#0a0e0a] border-2 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 crt-screen"
        style={{ borderColor: color + '66', boxShadow: `0 0 30px ${color}33, inset 0 0 40px ${color}11` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* CRT scanline overlay */}
        <div className="pointer-events-none absolute inset-0 z-20 crt-scanlines" />
        {/* CRT vignette */}
        <div className="pointer-events-none absolute inset-0 z-20 crt-vignette" />

        {/* Header */}
        <div className="relative z-10 bg-[#050805] border-b px-5 py-4" style={{ borderColor: color + '33' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Animated phosphor icon */}
              <div className="relative">
                <span
                  className="text-3xl inline-block crt-flicker"
                  style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                >
                  {entry.icon}
                </span>
              </div>
              <div>
                <span
                  className="text-[10px] font-heading font-bold tracking-wider uppercase crt-text-glow"
                  style={{ color }}
                >
                  {entry.brand}
                </span>
                <h2 className="font-heading text-lg font-bold text-foreground crt-text-glow" style={{ textShadow: `0 0 8px ${color}66` }}>
                  {entry.title}
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Power LED */}
              <div className="flex items-center gap-1">
                <Power className="w-3 h-3" style={{ color }} />
                <span
                  className="w-1.5 h-1.5 rounded-full power-led"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                />
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Category badge + REC indicator */}
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-heading font-bold px-2 py-0.5 rounded"
              style={{ backgroundColor: color + '22', color }}
            >
              ELECTRONICS & COMPUTERS
            </span>
            {isRecording && (
              <span className="flex items-center gap-1 text-[9px] font-heading font-bold text-red-400 rec-blink">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                REC
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 px-5 py-4 min-h-[120px]">
          {booting ? (
            <div className="font-mono text-xs space-y-1" style={{ color }}>
              <div className="opacity-60">{`> ${BOOT_LINES[Math.min(bootLineIdx, BOOT_LINES.length - 1)]}`}</div>
              <div className="inline-block w-2 h-3 bg-current crt-cursor" />
            </div>
          ) : (
            <>
              {glyph && (
                <pre
                  className="text-[10px] leading-tight mb-3 font-mono crt-text-glow whitespace-pre"
                  style={{ color, textShadow: `0 0 6px ${color}88` }}
                >
                  {glyph}
                </pre>
              )}
              <p className="text-sm font-body text-foreground/90 leading-relaxed whitespace-pre-line crt-text">
                {entry.body}
              </p>
              <div className="mt-3 inline-block w-2 h-3 crt-cursor" style={{ backgroundColor: color }} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 bg-[#050805] px-5 py-2.5 flex justify-between items-center border-t" style={{ borderColor: color + '1A' }}>
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">
            Radio Shack • 1984
          </span>
          <button
            onClick={handleDismiss}
            className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors"
          >
            tap to close
          </button>
        </div>

        {/* CRT styles + animations */}
        <style>{`
          .crt-screen { position: relative; }
          .crt-scanlines {
            background: repeating-linear-gradient(
              0deg,
              rgba(0,0,0,0.18) 0px,
              rgba(0,0,0,0.18) 1px,
              transparent 1px,
              transparent 3px
            );
            mix-blend-mode: multiply;
          }
          .crt-vignette {
            background: radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%);
          }
          .crt-text-glow { text-shadow: 0 0 6px currentColor; }
          .crt-text { text-shadow: 0 0 4px rgba(255,255,255,0.15); }
          .crt-flicker { animation: crtFlicker 3s infinite; }
          .crt-cursor { animation: crtBlink 1s steps(2) infinite; }
          .power-led { animation: powerPulse 2s ease-in-out infinite; }
          .rec-blink { animation: recBlink 1.2s steps(2) infinite; }
          @keyframes crtFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }
          @keyframes crtBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          @keyframes powerPulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 6px currentColor; }
            50% { opacity: 0.5; box-shadow: 0 0 2px currentColor; }
          }
          @keyframes recBlink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.25; }
          }
        `}</style>
      </div>
    </div>
  );
}