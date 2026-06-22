import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Clock, Film, Award, AlertTriangle } from 'lucide-react';
import { trackTvMovieView } from '@/lib/tvMoviePopups';

export default function TvMoviePopup({ entry, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!entry) return;

    // For randomizer entries, pick a random movie on mount
    let movie = null;
    if (entry.type === 'randomizer') {
      // 1% chance for ultra-rare (515 only)
      if (entry.ultraRareMovie && Math.random() < 0.01) {
        movie = entry.ultraRareMovie;
      } else {
        movie = entry.movies[Math.floor(Math.random() * entry.movies.length)];
      }
      setSelectedMovie(movie);
    }

    // Track view and unlock achievements
    const unlocked = trackTvMovieView(entry.id, movie?.title);
    if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);

    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [entry]);

  // No auto-dismiss — only closes when X is tapped

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

  const color = entry.networkColor || '#e11d48';
  const movie = entry.type === 'randomizer' ? selectedMovie : entry;
  const isUltraRare = movie?.isUltraRare;
  const displayIcon = movie?.icon || entry.icon;
  const displayTitle = entry.type === 'randomizer' ? movie?.title : entry.title;
  const displayBody = movie?.body || entry.body;
  const displayCast = movie?.cast || entry.cast;
  const displayQuote = movie?.quote || entry.quote;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Popup Card — retro network movie premiere aesthetic */}
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300 tvm-frame"
        style={{ boxShadow: `0 0 30px ${color}33` }}
        onClick={(e) => { e.stopPropagation(); handleInteract(); }}
      >
        {/* Film reel decorations (sides) */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#0a0a0a] z-30 flex flex-col items-center justify-around py-4 tvm-reel-bar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full border-2 tvm-reel-hole" style={{ borderColor: color + '44' }} />
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-[#0a0a0a] z-30 flex flex-col items-center justify-around py-4 tvm-reel-bar">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-full border-2 tvm-reel-hole" style={{ borderColor: color + '44' }} />
          ))}
        </div>

        {/* Main content area */}
        <div className="mx-6 bg-[#0a0a0a]">
          {/* Ultra-rare static overlay */}
          {isUltraRare && <div className="pointer-events-none absolute inset-0 z-10 tvm-static" />}

          {/* Header */}
          <div className="relative z-20 bg-gradient-to-b from-[#111] to-[#0a0a0a] border-b px-4 py-3" style={{ borderColor: color + '22' }}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl tvm-flicker" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
                  {displayIcon}
                </span>
                <div>
                  <span
                    className="text-[8px] font-heading font-bold tracking-wider uppercase block tvm-text-glow"
                    style={{ color }}
                  >
                    {entry.network}
                  </span>
                  <span
                    className="text-[8px] font-heading font-bold tracking-wider uppercase px-1.5 py-0.5 rounded tvm-badge-blink"
                    style={{ backgroundColor: color + '22', color }}
                  >
                    {entry.badge}
                  </span>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Movie title */}
            <h2 className="font-heading text-lg font-bold text-foreground leading-tight mt-1" style={{ textShadow: `0 0 8px ${color}55` }}>
              {displayTitle}
            </h2>

            {/* Subtitle / tagline */}
            {(entry.subtitle || movie?.boxOffice) && (
              <p className="text-[10px] font-heading italic mt-0.5" style={{ color: color + 'cc' }}>
                {entry.subtitle || movie?.boxOffice}
              </p>
            )}

            {/* Ultra-rare badge */}
            {isUltraRare && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-[8px] font-heading font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 tvm-badge-blink">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  LOST BROADCAST
                </span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="relative z-20 px-4 py-3 max-h-[280px] overflow-y-auto tvm-body-scroll">
            {/* Description */}
            <p className="text-xs font-body text-foreground/85 leading-relaxed mb-3">
              {displayBody}
            </p>

            {/* Cast */}
            {displayCast && displayCast.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star className="w-3 h-3" style={{ color }} />
                  <span className="text-[9px] font-heading font-bold uppercase tracking-wider" style={{ color }}>
                    Starring
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {displayCast.map((actor, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-body px-2 py-0.5 rounded"
                      style={{ backgroundColor: color + '15', color: 'hsl(var(--foreground))' }}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Broadcast date / runtime / sponsor */}
            <div className="flex flex-wrap gap-3 mb-2 text-[9px] font-heading text-muted-foreground">
              {entry.broadcastDate && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {entry.broadcastDate}
                </span>
              )}
              {movie?.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {movie.runtime}
                </span>
              )}
              {movie?.boxOffice && !entry.subtitle && (
                <span className="flex items-center gap-1" style={{ color }}>
                  <Award className="w-2.5 h-2.5" />
                  {movie.boxOffice}
                </span>
              )}
            </div>

            {/* Sponsor */}
            {movie?.sponsor && (
              <p className="text-[9px] font-heading text-muted-foreground/60 mb-2">
                Presented Commercial-Free By {movie.sponsor}
              </p>
            )}

            {/* Warning */}
            {movie?.warning && (
              <p className="text-[9px] font-heading text-amber-400/70 mb-2">
                ⚠ TV Guide Warning: {movie.warning}
              </p>
            )}

            {/* Fun Fact */}
            {entry.funFact && (
              <div
                className="p-2 rounded-lg border mb-2"
                style={{ borderColor: color + '22', backgroundColor: color + '08' }}
              >
                <span className="text-[8px] font-heading font-bold uppercase tracking-wider block mb-1" style={{ color }}>
                  Television Viewing Fact
                </span>
                <p className="text-[10px] font-body text-foreground/75 leading-relaxed">
                  {entry.funFact}
                </p>
              </div>
            )}

            {/* Ultra-rare achievement note */}
            {isUltraRare && (
              <div className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-center mb-2">
                <p className="text-[10px] font-heading italic text-red-400">
                  {movie.achievementNote}
                </p>
                <p className="text-[10px] font-heading font-bold text-red-400 mt-1">
                  🏆 Achievement Unlocked: Lost Broadcast
                </p>
              </div>
            )}

            {/* Quote */}
            {displayQuote && (
              <p className="text-[10px] font-heading italic text-center" style={{ color: color + 'cc' }}>
                "{displayQuote}"
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="relative z-20 bg-[#050505] px-4 py-2 flex justify-between items-center border-t" style={{ borderColor: color + '14' }}>
            <span className="text-[8px] text-muted-foreground/40 font-heading uppercase tracking-wider flex items-center gap-1">
              <Film className="w-2.5 h-2.5" />
              Network Premiere • 1984
            </span>
            <button
              onClick={handleDismiss}
              className="text-[9px] font-heading text-muted-foreground hover:text-foreground transition-colors"
            >
              tap to close
            </button>
          </div>
        </div>

        {/* Styles + animations */}
        <style>{`
          .tvm-frame { position: relative; }
          .tvm-text-glow { text-shadow: 0 0 5px currentColor; }
          .tvm-flicker { animation: tvmFlicker 4s infinite; }
          .tvm-badge-blink { animation: tvmBadgeBlink 2s ease-in-out infinite; }
          .tvm-reel-bar { animation: tvmReelSpin 8s linear infinite; }
          .tvm-reel-hole { animation: tvmReelPulse 2s ease-in-out infinite; }
          .tvm-body-scroll::-webkit-scrollbar { width: 4px; }
          .tvm-body-scroll::-webkit-scrollbar-track { background: transparent; }
          .tvm-body-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }

          /* TV static for ultra-rare */
          .tvm-static {
            background-image:
              repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0px, transparent 1px, rgba(255,255,255,0.02) 2px),
              repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px, rgba(255,255,255,0.015) 2px);
            animation: tvmStaticShift 0.15s steps(4) infinite;
            opacity: 0.4;
          }
          @keyframes tvmStaticShift {
            0% { background-position: 0 0; }
            25% { background-position: 3px 1px; }
            50% { background-position: -1px 2px; }
            75% { background-position: 2px -1px; }
            100% { background-position: 1px 3px; }
          }

          @keyframes tvmFlicker {
            0%, 96%, 100% { opacity: 1; }
            97% { opacity: 0.85; }
            98% { opacity: 1; }
            99% { opacity: 0.9; }
          }

          @keyframes tvmBadgeBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          @keyframes tvmReelSpin {
            0% { transform: translateY(0); }
            100% { transform: translateY(12px); }
          }

          @keyframes tvmReelPulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
        `}</style>
      </div>
    </div>
  );
}