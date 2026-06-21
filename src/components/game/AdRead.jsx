import React, { useState, useEffect } from 'react';
import { Tv, X, Clock, User, Film } from 'lucide-react';
import { pickSynopsis, NETWORK_LOGOS, EASTER_EGGS } from '@/lib/tvGuideData';
import { trackSynopsisView, hasSynopsisBeenViewed } from '@/lib/tvAchievements';
import { findMovieIndex } from '@/lib/moviePopups';
import { findElectronicsEntry, trackElectronicsView } from '@/lib/electronicsPopups';
import MoviePopup from './MoviePopup';
import ElectronicsPopup from './ElectronicsPopup';
import GeneralProductsPopup from './GeneralProductsPopup';
import { findGeneralProductsEntry, trackGeneralProductsView } from '@/lib/generalProductsPopups';

// Map ad text to banner index — find the matching TV synopsis data
function findBannerIndex(adText) {
  if (!adText) return null;
  const lower = adText.toLowerCase();
  if (lower.includes('miami vice')) return lower.includes('routine investigation') ? 2 : lower.includes('don\'t miss') ? 3 : 1;
  if (lower.includes('magnum')) return lower.includes('isn\'t happy') ? 5 : lower.includes('spend your thursday') ? 6 : 4;
  if (lower.includes('a-team')) return lower.includes('rides again') ? 7 : lower.includes('explosions') ? 8 : 9;
  if (lower.includes('cheers')) return lower.includes('pull up a stool') ? 10 : lower.includes('everybody knows') ? 11 : 12;
  if (lower.includes('night court')) return lower.includes('strange evening') ? 13 : 14;
  if (lower.includes('family ties')) return lower.includes('another scheme') ? 15 : 16;
  if (lower.includes('simon & simon') || lower.includes('a.j. and rick')) return lower.includes('tackle another') ? 17 : 18;
  if (lower.includes('hardcastle')) return lower.includes('hit the road') ? 19 : 20;
  if (lower.includes('fall guy')) return lower.includes('colt seavers returns') ? 21 : 22;
  if (lower.includes('dynasty')) return 23;
  if (lower.includes('dallas')) return lower.includes('friday night') ? 24 : 25;
  return null;
}

export default function AdRead({ ad, onDismiss, autoDismissMs = 12000, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [synopsisData, setSynopsisData] = useState(null);
  const [isMovie, setIsMovie] = useState(false);
  const [isElectronics, setIsElectronics] = useState(false);
  const [elecEntry, setElecEntry] = useState(null);
  const [isGeneralProducts, setIsGeneralProducts] = useState(false);
  const [gpEntry, setGpEntry] = useState(null);

  // On mount, find the matching TV synopsis, movie, or electronics entry
  useEffect(() => {
    if (!ad) return;
    const tvIdx = findBannerIndex(ad.text);
    if (tvIdx) {
      const data = pickSynopsis(tvIdx);
      setSynopsisData(data);
    } else if (findMovieIndex(ad.text) !== null) {
      setIsMovie(true);
    } else {
      const elec = findElectronicsEntry(ad.text);
      if (elec) {
        setIsElectronics(true);
        setElecEntry(elec);
      } else {
        const gp = findGeneralProductsEntry(ad.text);
        if (gp) {
          setIsGeneralProducts(true);
          setGpEntry(gp);
        }
      }
    }
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [ad]);

  // Auto-dismiss only when not expanded AND not a movie (handles its own timing)
  useEffect(() => {
    if (!visible || expanded || autoDismissMs <= 0 || isMovie) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [visible, expanded, autoDismissMs, onDismiss, isMovie]);

  if (!ad || !visible) return null;

  // ── Movie Popup ──
  if (isMovie) {
    return <MoviePopup ad={ad} onDismiss={() => { setVisible(false); onDismiss(); }} onAchievement={onAchievement} />;
  }

  const showIcon = synopsisData?.icon || (isElectronics ? elecEntry?.icon : '📺');
  const networkInfo = synopsisData ? NETWORK_LOGOS[synopsisData.network] : null;

  const handleTap = () => {
    // Electronics: open the popup (stays until dismissed)
    if (isElectronics && elecEntry) {
      const unlocked = trackElectronicsView(elecEntry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setExpanded(true); // show popup
      return;
    }
    if (isGeneralProducts && gpEntry) {
      const unlocked = trackGeneralProductsView(gpEntry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setExpanded(true);
      return;
    }
    if (!synopsisData) {
      onDismiss();
      return;
    }
    if (!expanded) {
      setExpanded(true);
      // Track the view for achievements
      const unlocked = trackSynopsisView(synopsisData.show, synopsisData.bannerIndex, synopsisData.synopsis?.easterEgg);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    } else {
      setExpanded(false);
      onDismiss();
    }
  };

  // ── Electronics Popup (expanded) ──
  if (expanded && isElectronics && elecEntry) {
    return (
      <ElectronicsPopup
        entry={elecEntry}
        onDismiss={() => { setExpanded(false); onDismiss(); }}
        onAchievement={onAchievement}
      />
    );
  }

  // ── General Products Popup (expanded) ──
  if (expanded && isGeneralProducts && gpEntry) {
    return (
      <GeneralProductsPopup
        entry={gpEntry}
        onDismiss={() => { setExpanded(false); onDismiss(); }}
        onAchievement={onAchievement}
      />
    );
  }

  // ── TV Guide Detail View ──
  if (expanded && synopsisData) {
    const syn = synopsisData.synopsis;
    const hasEasterEgg = !!syn?.easterEgg;
    const eggInfo = hasEasterEgg ? EASTER_EGGS[syn.easterEgg] : null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleTap}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* TV Guide Card */}
        <div
          className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* TV Guide Header — network bug + time slot */}
          <div className="bg-[#0d0d1a] border-b border-amber-500/20 px-5 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{showIcon}</span>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground tracking-tight">{synopsisData.show}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    {networkInfo && (
                      <span
                        className="text-[10px] font-heading font-bold px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: networkInfo.color + '22', color: networkInfo.color }}
                      >
                        {networkInfo.label}
                      </span>
                    )}
                    {hasEasterEgg && eggInfo && (
                      <span className="text-[9px] font-display text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        ⭐ {eggInfo.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleTap}
                className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Time slot bar */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-heading">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {synopsisData.day}s • {synopsisData.time}
              </span>
              <span className="text-amber-400/50">|</span>
              <span>{synopsisData.duration}</span>
            </div>
          </div>

          {/* Synopsis body — TV Guide magazine style */}
          <div className="px-5 py-4 space-y-3">
            {/* Episode description */}
            <p className="text-sm font-body text-foreground/85 leading-relaxed">
              {syn.text}
            </p>

            {/* Guest Stars */}
            {syn.guests && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground/80">
                <User className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400/60" />
                <span className="italic">{syn.guests}</span>
              </div>
            )}

            {/* Network tagline */}
            {networkInfo && (
              <div className="border-t border-amber-500/10 pt-3 flex items-center justify-between">
                <span
                  className="text-[10px] font-heading font-bold tracking-wider"
                  style={{ color: networkInfo.color }}
                >
                  {synopsisData.network}
                </span>
                <span className="text-[9px] text-muted-foreground/50 font-heading italic">
                  "{networkInfo.tagline}"
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t border-amber-500/10">
            <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">
              TV Guide • 1984
            </span>
            <button
              onClick={handleTap}
              className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors"
            >
              tap to close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Compact Banner (pre-tap) ──
  return (
    <div
      onClick={(synopsisData || isElectronics || isGeneralProducts) ? handleTap : onDismiss}
      className={`animate-in slide-in-from-bottom-4 fade-in duration-300 rounded-xl px-4 py-3 text-center ${isElectronics ? 'bg-emerald-500/10 border border-emerald-500/20' : isGeneralProducts ? 'bg-sky-500/10 border border-sky-500/20' : 'bg-amber-500/10 border border-amber-500/20'} ${(synopsisData || isElectronics || isGeneralProducts) ? 'cursor-pointer hover:bg-amber-500/15 transition-colors' : 'cursor-pointer'}`}
    >
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <Tv className="w-3 h-3 text-amber-400" />
        <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-amber-400">
          {synopsisData ? 'TONIGHT ON TV' : isElectronics ? 'ELECTRONICS & COMPUTERS' : isGeneralProducts ? 'COMMERCIAL BREAK' : 'SPONSOR MESSAGE'}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1.5 mb-1">
        {synopsisData && <span className="text-base">{showIcon}</span>}
        {isElectronics && elecEntry && <span className="text-base">{elecEntry.icon}</span>}
        {isGeneralProducts && gpEntry && <span className="text-base">{gpEntry.icon}</span>}
        <p className="text-sm font-heading text-foreground/85 leading-relaxed italic">
          "{ad.text}"
        </p>
      </div>

      <p className="text-[9px] text-muted-foreground/40 mt-2 font-heading">
        {synopsisData ? 'tap for TV Guide synopsis' : isElectronics ? 'tap for product details' : isGeneralProducts ? 'tap for commercial' : 'tap to continue'}
      </p>
    </div>
  );
}