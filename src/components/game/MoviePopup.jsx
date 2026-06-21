import React, { useState, useEffect, useRef } from 'react';
import { X, Star, Film, Popcorn, Ticket, Clapperboard } from 'lucide-react';
import { getMovieEntry, findMovieIndex, pickBonusEntry, trackMovieView } from '@/lib/moviePopups';

const CATEGORY_STYLES = {
  box_office: { icon: '📊', label: 'BOX OFFICE REPORT', color: '#4ade80' },
  coming_soon: { icon: '🎥', label: 'COMING SOON', color: '#60a5fa' },
  concession: { icon: '🍿', label: 'CONCESSION STAND', color: '#fbbf24' },
  drive_in: { icon: '🚗', label: 'DRIVE-IN', color: '#f87171' },
  letter: { icon: '✉️', label: 'LETTER TO THE EDITOR', color: '#c084fc' },
  incident: { icon: '🎞️', label: 'MANAGEMENT NOTICE', color: '#fb923c' },
  survey: { icon: '📋', label: 'AUDIENCE SURVEY', color: '#2dd4bf' },
  trivia_challenge: { icon: '🎓', label: 'TRIVIA CHALLENGE', color: '#a78bfa' },
  gossip: { icon: '💬', label: 'HOLLYWOOD GOSSIP', color: '#f472b6' },
  quote: { icon: '🎬', label: 'MOVIE QUOTE', color: '#facc15' },
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map(i => (
        <Star key={i} className={`w-4 h-4 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted/30'}`} />
      ))}
    </div>
  );
}

export default function MoviePopup({ ad, onDismiss, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState('synopsis'); // synopsis | review | trivia
  const [bonusEntry, setBonusEntry] = useState(null);
  const [entry, setEntry] = useState(null);
  const [isBonus, setIsBonus] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const autoDismissRef = useRef(null);

  useEffect(() => {
    if (!ad) return;

    // Try to find a matching movie entry
    const idx = findMovieIndex(ad.text);
    if (idx) {
      const e = getMovieEntry(idx);
      setEntry(e);
      setIsBonus(false);
    } else {
      // Fall back to a random bonus entry
      const b = pickBonusEntry();
      setBonusEntry(b);
      setIsBonus(true);
    }

    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [ad]);

  // Auto-dismiss after 10s if user hasn't interacted
  useEffect(() => {
    if (!visible || userInteracted) return;
    autoDismissRef.current = setTimeout(() => {
      setVisible(false);
      onDismiss();
    }, 10000);
    return () => clearTimeout(autoDismissRef.current);
  }, [visible, userInteracted, onDismiss]);

  // Track view for achievements (must be before any early return)
  useEffect(() => {
    if (entry && visible) {
      const unlocked = trackMovieView(entry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    } else if (bonusEntry && visible) {
      const unlocked = trackMovieView(bonusEntry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    }
  }, [entry, bonusEntry, visible]);

  const handleDismiss = () => {
    clearTimeout(autoDismissRef.current);
    setVisible(false);
    onDismiss();
  };

  const markInteraction = () => {
    if (!userInteracted) {
      setUserInteracted(true);
      clearTimeout(autoDismissRef.current);
    }
  };

  if (!visible || (!entry && !bonusEntry)) return null;

  // ── Bonus Entry Rendering ──
  if (isBonus && bonusEntry) {
    const style = CATEGORY_STYLES[bonusEntry.type] || { icon: '🎬', label: bonusEntry.type.toUpperCase(), color: '#facc15' };

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#0d0d1a] border-b border-amber-500/20 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{style.icon}</span>
                <div>
                  <span className="text-[10px] font-heading font-bold tracking-wider" style={{ color: style.color }}>
                    {style.label}
                  </span>
                  {bonusEntry.title && (
                    <h2 className="font-heading text-lg font-bold text-foreground">{bonusEntry.title}</h2>
                  )}
                  {bonusEntry.source && (
                    <p className="text-xs text-muted-foreground italic">— {bonusEntry.source}</p>
                  )}
                </div>
              </div>
              <button onClick={handleDismiss} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            {bonusEntry.meta && (
              <p className="text-xs text-muted-foreground/70 mt-1 ml-8">{bonusEntry.meta}</p>
            )}
          </div>

          <div className="px-5 py-4">
            {/* Trivia challenge: question → answer (tap to reveal style) */}
            {bonusEntry.type === 'trivia_challenge' ? (
              <TriviaChallengeCard entry={bonusEntry} onInteract={markInteraction} />
            ) : (
              <p className="text-sm font-body text-foreground/85 leading-relaxed whitespace-pre-line">
                {bonusEntry.text}
              </p>
            )}
          </div>

          <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t border-amber-500/10">
            <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">Movie Times · 1984</span>
            <button onClick={handleDismiss} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">tap to close</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Movie Entry Rendering ──
  if (!entry) return null;

  const syn = entry.synopsis;
  const rev = entry.review || entry.sillyReview;
  const trivia = entry.trivia;
  const hasReview = !!rev;
  const hasTrivia = !!trivia;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleDismiss}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0d0d1a] border-b border-amber-500/20 px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-heading uppercase tracking-[0.2em] text-amber-400">NOW SHOWING</span>
            </div>
            <button onClick={handleDismiss} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 bg-muted/30 rounded-lg p-0.5">
            <TabButton active={tab === 'synopsis'} onClick={() => { markInteraction(); setTab('synopsis'); }} label="Synopsis" />
            {hasReview && <TabButton active={tab === 'review'} onClick={() => { markInteraction(); setTab('review'); }} label={entry.sillyReview ? "Review" : "Review"} />}
            {hasTrivia && <TabButton active={tab === 'trivia'} onClick={() => { markInteraction(); setTab('trivia'); }} label="Trivia" />}
          </div>
        </div>

        {/* Tab content */}
        <div className="px-5 py-4 min-h-[180px]">
          {tab === 'synopsis' && (
            <div className="space-y-3">
              <h2 className="font-heading text-xl font-bold text-foreground">{syn.title}</h2>
              {syn.meta && <p className="text-xs text-muted-foreground font-heading">{syn.meta}</p>}
              <p className="text-sm font-body text-foreground/85 leading-relaxed">{syn.body}</p>
              {syn.cast && (
                <div className="text-xs text-muted-foreground/70 italic border-t border-amber-500/10 pt-2 mt-2">
                  {syn.cast}
                </div>
              )}
            </div>
          )}

          {tab === 'review' && rev && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={rev.rating} />
                <span className="text-[10px] font-heading text-muted-foreground">{rev.rating}/4</span>
              </div>
              <h2 className="font-heading text-lg font-bold text-foreground">{rev.source}</h2>
              <p className={`text-sm leading-relaxed ${entry.sillyReview ? 'text-foreground/80 italic' : 'text-foreground/85'}`}>
                {rev.text}
              </p>
            </div>
          )}

          {tab === 'trivia' && trivia && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clapperboard className="w-5 h-5 text-amber-400" />
                <h2 className="font-heading text-lg font-bold text-foreground">Did You Know?</h2>
              </div>
              <p className="text-sm font-body text-foreground/85 leading-relaxed italic">
                {trivia}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t border-amber-500/10">
          <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">Movie Times · 1984</span>
          <button onClick={handleDismiss} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">tap to close</button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ──

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-xs font-heading rounded-md transition-colors ${
        active ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

function TriviaChallengeCard({ entry, onInteract }) {
  const [revealed, setRevealed] = useState(false);
  const handleReveal = () => {
    setRevealed(true);
    if (onInteract) onInteract();
  };
  return (
    <div className="space-y-4" onClick={handleReveal}>
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎓</span>
        <h2 className="font-heading text-lg font-bold text-foreground">Movie Trivia Challenge</h2>
      </div>
      <p className="text-sm font-body text-foreground/85 font-semibold">{entry.question}</p>
      {!revealed ? (
        <p className="text-xs text-muted-foreground/50 italic cursor-pointer hover:text-amber-400 transition-colors">
          tap to reveal answer
        </p>
      ) : (
        <p className="text-sm font-heading font-bold text-amber-400 bg-amber-400/10 rounded-lg px-3 py-2 animate-in fade-in duration-300">
          {entry.answer}
        </p>
      )}
    </div>
  );
}