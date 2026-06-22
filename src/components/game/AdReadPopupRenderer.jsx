import React from 'react';
import MoviePopup from './MoviePopup';
import ElectronicsPopup from './ElectronicsPopup';
import MoreObscureTvPopup from './MoreObscureTvPopup';
import MoreObscureTvPopup3 from './MoreObscureTvPopup3';
import ArcadePopup from './ArcadePopup';
import ArcadeVidGamePopup from './ArcadeVidGamePopup';
import WrestlingPopup from './WrestlingPopup';
import VanishedStoresPopup from './VanishedStoresPopup';
import Peak1984Popup from './Peak1984Popup';
import Olympics1984Popup from './Olympics1984Popup';
import OlympicsAthletes1984Popup from './OlympicsAthletes1984Popup';
import NasaSpacePopup from './NasaSpacePopup';
import NewspapersClassifiedsPopup from './NewspapersClassifiedsPopup';
import LongDistancePhoneWarsPopup from './LongDistancePhoneWarsPopup';
import FilmDevelopmentCamerasPopup from './FilmDevelopmentCamerasPopup';
import ThingsThatScream1984Popup from './ThingsThatScream1984Popup';
import MallCulturePopup from './MallCulturePopup';
import TvMoviePopup from './TvMoviePopup';
import ObscureTvPopup from './ObscureTvPopup';
import GeneralProductsPopup from './GeneralProductsPopup';
import RedSoxBannerPopup from './RedSoxBannerPopup';
import NationalCharityPopup from './NationalCharityPopup';
import NationalPromosPopup from './NationalPromosPopup';
import NationalWrestlingPopup from './NationalWrestlingPopup';
import VhsBetamaxLaserDiscPopup from './VhsBetamaxLaserDiscPopup';
import DetroitTigersBannerPopup from './DetroitTigersBannerPopup';
import TeamBannerPopup from './TeamBannerPopup';
import TigersStadiumPopup from './TigersStadiumPopup';
import PhilliesBannerPopup from './PhilliesBannerPopup';
import { trackPhilliesBannerView } from '@/lib/philliesBannerPopups';
import GenericAdPopup from './GenericAdPopup';
import { trackCubsBannerView } from '@/lib/cubsBannerPopups';
import { trackTigersBannerView2 } from '@/lib/tigersBannerPopups2';
import { trackMetsBannerView } from '@/lib/metsBannerPopups';
import { trackYankeesBannerView } from '@/lib/yankeesBannerPopups';
import { trackOriolesBannerView } from '@/lib/oriolesBannerPopups';
import { trackDodgersBannerView } from '@/lib/dodgersBannerPopups';
import { trackPadresBannerView } from '@/lib/padresBannerPopups';
import { trackRedsBannerView } from '@/lib/redsBannerPopups';
import { trackRoyalsBannerView } from '@/lib/royalsBannerPopups';

export default function AdReadPopupRenderer({
  expanded, isMovie, synopsisData, onDismiss, onAchievement,
  isElectronics, elecEntry,
  isMoreObscureTv, moreObscureTvEntry,
  isMoreObscureTv3, moreObscureTvEntry3,
  isArcade, arcadeEntry,
  isArcadeVidGame, arcadeVidGameEntry,
  isWrestling, wrestlingEntry,
  isVanishedStores, vanishedStoresEntry,
  isPeak1984, peak1984Entry,
  isOlympics, olympicsEntry,
  isOlympicsAthletes, olympicsAthletesEntry,
  isNasaSpace, nasaSpaceEntry,
  isNewspapersClassifieds, newspapersClassifiedsEntry,
  isLongDistancePhoneWars, longDistancePhoneWarsEntry,
  isFilmDevelopmentCameras, filmDevelopmentCamerasEntry,
  isThingsThatScream1984, thingsThatScream1984Entry,
  isMallCulture, mallCultureEntry,
  isRedSoxBanner, redSoxBannerEntry,
  isNationalCharity, nationalCharityEntry,
  isNationalPromos, nationalPromosEntry,
  isNationalWrestling, nationalWrestlingEntry,
  isVhsBetamax, vhsBetamaxEntry,
  isDetroitTigers, detroitTigersEntry,
  isCubsBanner, cubsBannerEntry,
  isTigersBanner2, tigersBanner2Entry,
  isMetsBanner, metsBannerEntry,
  isYankeesBanner, yankeesBannerEntry,
  isOriolesBanner, oriolesBannerEntry,
  isDodgersBanner, dodgersBannerEntry,
  isPadresBanner, padresBannerEntry,
  isRedsBanner, redsBannerEntry,
  isRoyalsBanner, royalsBannerEntry,
  isTigersStadium, tigersStadiumEntry,
  isPhilliesBanner, philliesBannerEntry,
  isTvMovie, tvMovieEntry,
  isObscureTv, obscureTvEntry,
  isGeneralProducts, gpEntry,
  isGenericAd, genericAdEntry,
  handleTap, NETWORK_LOGOS, EASTER_EGGS, Clock, User, X, ad
}) {
  if (isMovie) return <MoviePopup ad={{ text: '' }} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;

  if (expanded && isElectronics && elecEntry) {
    return <ElectronicsPopup entry={elecEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isMoreObscureTv && moreObscureTvEntry) {
    return <MoreObscureTvPopup entry={moreObscureTvEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isMoreObscureTv3 && moreObscureTvEntry3) {
    return <MoreObscureTvPopup3 entry={moreObscureTvEntry3} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isArcade && arcadeEntry) {
    return <ArcadePopup entry={arcadeEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isArcadeVidGame && arcadeVidGameEntry) {
    return <ArcadeVidGamePopup entry={arcadeVidGameEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isWrestling && wrestlingEntry) {
    return <WrestlingPopup entry={wrestlingEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isVanishedStores && vanishedStoresEntry) {
    return <VanishedStoresPopup entry={vanishedStoresEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isPeak1984 && peak1984Entry) {
    return <Peak1984Popup entry={peak1984Entry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isOlympics && olympicsEntry) {
    return <Olympics1984Popup entry={olympicsEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isOlympicsAthletes && olympicsAthletesEntry) {
    return <OlympicsAthletes1984Popup entry={olympicsAthletesEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isNasaSpace && nasaSpaceEntry) {
    return <NasaSpacePopup entry={nasaSpaceEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isNewspapersClassifieds && newspapersClassifiedsEntry) {
    return <NewspapersClassifiedsPopup entry={newspapersClassifiedsEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isLongDistancePhoneWars && longDistancePhoneWarsEntry) {
    return <LongDistancePhoneWarsPopup entry={longDistancePhoneWarsEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isFilmDevelopmentCameras && filmDevelopmentCamerasEntry) {
    return <FilmDevelopmentCamerasPopup entry={filmDevelopmentCamerasEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isThingsThatScream1984 && thingsThatScream1984Entry) {
    return <ThingsThatScream1984Popup entry={thingsThatScream1984Entry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isMallCulture && mallCultureEntry) {
    return <MallCulturePopup entry={mallCultureEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isRedSoxBanner && redSoxBannerEntry) {
    return <RedSoxBannerPopup entry={redSoxBannerEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isNationalCharity && nationalCharityEntry) {
    return <NationalCharityPopup entry={nationalCharityEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isNationalPromos && nationalPromosEntry) {
    return <NationalPromosPopup entry={nationalPromosEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isNationalWrestling && nationalWrestlingEntry) {
    return <NationalWrestlingPopup entry={nationalWrestlingEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isVhsBetamax && vhsBetamaxEntry) {
    return <VhsBetamaxLaserDiscPopup entry={vhsBetamaxEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isDetroitTigers && detroitTigersEntry) {
    return <DetroitTigersBannerPopup entry={detroitTigersEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isCubsBanner && cubsBannerEntry) {
    return <TeamBannerPopup entry={cubsBannerEntry} teamColor="#0e3386" teamIcon="🐻" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackCubsBannerView} />;
  }
  if (expanded && isTigersBanner2 && tigersBanner2Entry) {
    return <TeamBannerPopup entry={tigersBanner2Entry} teamColor="#0c2340" teamIcon="🐯" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackTigersBannerView2} />;
  }
  if (expanded && isMetsBanner && metsBannerEntry) {
    return <TeamBannerPopup entry={metsBannerEntry} teamColor="#002d72" teamIcon="🗽" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackMetsBannerView} />;
  }
  if (expanded && isYankeesBanner && yankeesBannerEntry) {
    return <TeamBannerPopup entry={yankeesBannerEntry} teamColor="#003087" teamIcon="⚾" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackYankeesBannerView} />;
  }
  if (expanded && isOriolesBanner && oriolesBannerEntry) {
    return <TeamBannerPopup entry={oriolesBannerEntry} teamColor="#df4601" teamIcon="🐦" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackOriolesBannerView} />;
  }
  if (expanded && isDodgersBanner && dodgersBannerEntry) {
    return <TeamBannerPopup entry={dodgersBannerEntry} teamColor="#005a9c" teamIcon="🏟️" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackDodgersBannerView} />;
  }
  if (expanded && isPadresBanner && padresBannerEntry) {
    return <TeamBannerPopup entry={padresBannerEntry} teamColor="#7f411c" teamIcon="⚾" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackPadresBannerView} />;
  }
  if (expanded && isRedsBanner && redsBannerEntry) {
    return <TeamBannerPopup entry={redsBannerEntry} teamColor="#c6011f" teamIcon="🔴" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackRedsBannerView} />;
  }
  if (expanded && isRoyalsBanner && royalsBannerEntry) {
    return <TeamBannerPopup entry={royalsBannerEntry} teamColor="#004687" teamIcon="👑" onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackRoyalsBannerView} />;
  }
  if (expanded && isTigersStadium && tigersStadiumEntry) {
    return <TigersStadiumPopup entry={tigersStadiumEntry} onDismiss={() => onDismiss()} onAchievement={onAchievement} />;
  }
  if (expanded && isPhilliesBanner && philliesBannerEntry) {
    return <PhilliesBannerPopup entry={philliesBannerEntry} onDismiss={() => onDismiss()} onAchievement={onAchievement} trackView={trackPhilliesBannerView} />;
  }
  if (expanded && isTvMovie && tvMovieEntry) {
    return <TvMoviePopup entry={tvMovieEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isObscureTv && obscureTvEntry) {
    return <ObscureTvPopup entry={obscureTvEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isGeneralProducts && gpEntry) {
    return <GeneralProductsPopup entry={gpEntry} onDismiss={() => { onDismiss(); }} onAchievement={onAchievement} />;
  }
  if (expanded && isGenericAd && genericAdEntry) {
    return <GenericAdPopup entry={genericAdEntry} onDismiss={() => { onDismiss(); }} />;
  }

  // TV Guide detail view
  if (expanded && synopsisData) {
    const syn = synopsisData.synopsis;
    const hasEasterEgg = !!syn?.easterEgg;
    const eggInfo = hasEasterEgg ? EASTER_EGGS[syn.easterEgg] : null;
    const showIcon = synopsisData?.icon || '📺';
    const networkInfo = synopsisData ? NETWORK_LOGOS[synopsisData.network] : null;

    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleTap}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div
          className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-[#1a1a2e] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 fade-in duration-300"
          onClick={(e) => e.stopPropagation()}
        >
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
              <button onClick={handleTap} className="p-1.5 rounded-full hover:bg-foreground/10 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-heading">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {synopsisData.day}s • {synopsisData.time}
              </span>
              <span className="text-amber-400/50">|</span>
              <span>{synopsisData.duration}</span>
            </div>
          </div>
          <div className="px-5 py-4 space-y-3">
            <p className="text-sm font-body text-foreground/85 leading-relaxed">{syn.text}</p>
            {syn.guests && (
              <div className="flex items-start gap-2 text-xs text-muted-foreground/80">
                <User className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400/60" />
                <span className="italic">{syn.guests}</span>
              </div>
            )}
            {networkInfo && (
              <div className="border-t border-amber-500/10 pt-3 flex items-center justify-between">
                <span className="text-[10px] font-heading font-bold tracking-wider" style={{ color: networkInfo.color }}>
                  {synopsisData.network}
                </span>
                <span className="text-[9px] text-muted-foreground/50 font-heading italic">"{networkInfo.tagline}"</span>
              </div>
            )}
          </div>
          <div className="bg-[#0d0d1a] px-5 py-2.5 flex justify-between items-center border-t border-amber-500/10">
            <span className="text-[9px] text-muted-foreground/40 font-heading uppercase tracking-wider">TV Guide • 1984</span>
            <button onClick={handleTap} className="text-[10px] font-heading text-muted-foreground hover:text-foreground transition-colors">
              tap to close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: clickable banner for any ad type
  return (
    <div
      onClick={handleTap}
      className="bg-card/80 border border-amber-500/30 rounded-xl px-4 py-3 cursor-pointer hover:bg-card hover:border-amber-500/50 transition-all"
    >
      <div className="text-center space-y-1">
        <div className="text-[10px] font-heading uppercase tracking-widest text-amber-400/60">📻 Sponsor Message</div>
        <p className="text-sm font-heading text-foreground/90">{synopsisData?.tagline || ad?.text || 'Advertisement'}</p>
        <p className="text-[9px] text-muted-foreground/50 font-heading">tap for details</p>
      </div>
    </div>
  );
}