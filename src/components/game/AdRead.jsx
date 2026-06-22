import React, { useState, useEffect } from 'react';
import { Clock, User, X, Tv } from 'lucide-react';
import MoviePopup from './MoviePopup';
import ElectronicsPopup from './ElectronicsPopup';
import MoreObscureTvPopup from './MoreObscureTvPopup';
import ArcadePopup from './ArcadePopup';
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
import AdReadPopupRenderer from './AdReadPopupRenderer';
import { trackSynopsisView, pickSynopsis, NETWORK_LOGOS, EASTER_EGGS } from '@/lib/tvGuideData';
import { findMovieIndex } from '@/lib/moviePopups';
import { findElectronicsEntry, trackElectronicsView } from '@/lib/electronicsPopups';
import { findGeneralProductsEntry, trackGeneralProductsView } from '@/lib/generalProductsPopups';
import { findObscureTvEntry, trackObscureTvView } from '@/lib/obscureTvPopups';
import { findMoreObscureTvEntry } from '@/lib/moreObscureTvPopups';
import { findArcadeEntry } from '@/lib/arcadePopups';
import { findWrestlingEntry } from '@/lib/wrestlingPopups';
import { findVanishedStoresEntry } from '@/lib/vanishedStoresPopups';
import { findPeak1984Entry } from '@/lib/peak1984Popups';
import { findOlympics1984Entry } from '@/lib/olympics1984Popups';
import { findOlympicsAthletes1984Entry } from '@/lib/olympicsAthletes1984Popups';
import { findNasaSpaceEntry } from '@/lib/nasaSpacePopups';
import { findNewspapersClassifiedsEntry } from '@/lib/newspapersClassifiedsPopups';
import { findLongDistancePhoneWarsEntry } from '@/lib/longDistancePhoneWarsPopups';
import { findFilmDevelopmentCamerasEntry } from '@/lib/filmDevelopmentCamerasPopups';
import { findThingsThatScream1984Entry } from '@/lib/thingsThatScream1984Popups';
import { findMallCultureEntry } from '@/lib/mallCulturePopups';

export default function AdRead({ ad, onDismiss, autoDismissMs = 12000, onAchievement }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [synopsisData, setSynopsisData] = useState(null);
  const [isMovie, setIsMovie] = useState(false);
  const [isElectronics, setIsElectronics] = useState(false);
  const [elecEntry, setElecEntry] = useState(null);
  const [isGeneralProducts, setIsGeneralProducts] = useState(false);
  const [gpEntry, setGpEntry] = useState(null);
  const [isObscureTv, setIsObscureTv] = useState(false);
  const [obscureTvEntry, setObscureTvEntry] = useState(null);
  const [isMoreObscureTv, setIsMoreObscureTv] = useState(false);
  const [moreObscureTvEntry, setMoreObscureTvEntry] = useState(null);
  const [isTvMovie, setIsTvMovie] = useState(false);
  const [tvMovieEntry, setTvMovieEntry] = useState(null);
  const [isArcade, setIsArcade] = useState(false);
  const [arcadeEntry, setArcadeEntry] = useState(null);
  const [isWrestling, setIsWrestling] = useState(false);
  const [wrestlingEntry, setWrestlingEntry] = useState(null);
  const [isVanishedStores, setIsVanishedStores] = useState(false);
  const [vanishedStoresEntry, setVanishedStoresEntry] = useState(null);
  const [isPeak1984, setIsPeak1984] = useState(false);
  const [peak1984Entry, setPeak1984Entry] = useState(null);
  const [isOlympics, setIsOlympics] = useState(false);
  const [olympicsEntry, setOlympicsEntry] = useState(null);
  const [isOlympicsAthletes, setIsOlympicsAthletes] = useState(false);
  const [olympicsAthletesEntry, setOlympicsAthletesEntry] = useState(null);
  const [isNasaSpace, setIsNasaSpace] = useState(false);
  const [nasaSpaceEntry, setNasaSpaceEntry] = useState(null);
  const [isNewspapersClassifieds, setIsNewspapersClassifieds] = useState(false);
  const [newspapersClassifiedsEntry, setNewspapersClassifiedsEntry] = useState(null);
  const [isLongDistancePhoneWars, setIsLongDistancePhoneWars] = useState(false);
  const [longDistancePhoneWarsEntry, setLongDistancePhoneWarsEntry] = useState(null);
  const [isFilmDevelopmentCameras, setIsFilmDevelopmentCameras] = useState(false);
  const [filmDevelopmentCamerasEntry, setFilmDevelopmentCamerasEntry] = useState(null);
  const [isThingsThatScream1984, setIsThingsThatScream1984] = useState(false);
  const [thingsThatScream1984Entry, setThingsThatScream1984Entry] = useState(null);
  const [isMallCulture, setIsMallCulture] = useState(false);
  const [mallCultureEntry, setMallCultureEntry] = useState(null);

  // Detect ad type on mount
  useEffect(() => {
    if (!ad || !ad.text) return;
    const movie = findMovieIndex(ad.text);
    if (findObscureTvEntry(ad.text)) {
      setIsObscureTv(true);
      setObscureTvEntry(findObscureTvEntry(ad.text));
    } else if (findMoreObscureTvEntry(ad.text)) {
      setIsMoreObscureTv(true);
      setMoreObscureTvEntry(findMoreObscureTvEntry(ad.text));
    } else if (findArcadeEntry(ad.text)) {
      setIsArcade(true);
      setArcadeEntry(findArcadeEntry(ad.text));
    } else if (findWrestlingEntry(ad.text)) {
      setIsWrestling(true);
      setWrestlingEntry(findWrestlingEntry(ad.text));
    } else if (findVanishedStoresEntry(ad.text)) {
      setIsVanishedStores(true);
      setVanishedStoresEntry(findVanishedStoresEntry(ad.text));
    } else if (findPeak1984Entry(ad.text)) {
      setIsPeak1984(true);
      setPeak1984Entry(findPeak1984Entry(ad.text));
    } else if (findOlympics1984Entry(ad.text)) {
      setIsOlympics(true);
      setOlympicsEntry(findOlympics1984Entry(ad.text));
    } else if (findOlympicsAthletes1984Entry(ad.text)) {
      setIsOlympicsAthletes(true);
      setOlympicsAthletesEntry(findOlympicsAthletes1984Entry(ad.text));
    } else if (findNasaSpaceEntry(ad.text)) {
      setIsNasaSpace(true);
      setNasaSpaceEntry(findNasaSpaceEntry(ad.text));
    } else if (findNewspapersClassifiedsEntry(ad.text)) {
      setIsNewspapersClassifieds(true);
      setNewspapersClassifiedsEntry(findNewspapersClassifiedsEntry(ad.text));
    } else if (findLongDistancePhoneWarsEntry(ad.text)) {
      setIsLongDistancePhoneWars(true);
      setLongDistancePhoneWarsEntry(findLongDistancePhoneWarsEntry(ad.text));
    } else if (findFilmDevelopmentCamerasEntry(ad.text)) {
      setIsFilmDevelopmentCameras(true);
      setFilmDevelopmentCamerasEntry(findFilmDevelopmentCamerasEntry(ad.text));
    } else if (findThingsThatScream1984Entry(ad.text)) {
      setIsThingsThatScream1984(true);
      setThingsThatScream1984Entry(findThingsThatScream1984Entry(ad.text));
    } else if (findMallCultureEntry(ad.text)) {
      setIsMallCulture(true);
      setMallCultureEntry(findMallCultureEntry(ad.text));
    } else if (movie !== null) {
      setIsTvMovie(true);
    } else {
      // Try to match synopsis by banner text (TV_SYNOPSES keys 1-25)
      for (let i = 1; i <= 25; i++) {
        const data = pickSynopsis(i);
        if (data && data.tagline === ad.text) {
          setSynopsisData(data);
          break;
        }
      }
      const elec = findElectronicsEntry(ad.text);
      if (elec) {
        setIsElectronics(true);
        setElecEntry(elec);
      } else {
        const gp = findGeneralProductsEntry(ad.text);
        if (gp) {
          setIsGeneralProducts(true);
          setGpEntry(gp);
        } else if (movie !== null) {
          setIsMovie(true);
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
    if (isElectronics && elecEntry) {
      const unlocked = trackElectronicsView(elecEntry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setExpanded(true);
      return;
    }
    if (isGeneralProducts && gpEntry) {
      const unlocked = trackGeneralProductsView(gpEntry.id);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      setExpanded(true);
      return;
    }
    const specialTypes = [isObscureTv, isMoreObscureTv, isTvMovie, isArcade, isWrestling, isVanishedStores, isPeak1984, isOlympics, isOlympicsAthletes, isNasaSpace, isNewspapersClassifieds, isLongDistancePhoneWars, isFilmDevelopmentCameras, isThingsThatScream1984, isMallCulture];
    if (specialTypes.some(t => t)) {
      setExpanded(true);
      return;
    }
    if (!synopsisData) {
      onDismiss();
      return;
    }
    if (!expanded) {
      setExpanded(true);
      const unlocked = trackSynopsisView(synopsisData.show, synopsisData.bannerIndex, synopsisData.synopsis?.easterEgg);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
    } else {
      setExpanded(false);
      onDismiss();
    }
  };

  return (
    <AdReadPopupRenderer
      expanded={expanded}
      isMovie={isMovie}
      synopsisData={synopsisData}
      onDismiss={() => { setExpanded(false); onDismiss(); }}
      onAchievement={onAchievement}
      isElectronics={isElectronics}
      elecEntry={elecEntry}
      isMoreObscureTv={isMoreObscureTv}
      moreObscureTvEntry={moreObscureTvEntry}
      isArcade={isArcade}
      arcadeEntry={arcadeEntry}
      isWrestling={isWrestling}
      wrestlingEntry={wrestlingEntry}
      isVanishedStores={isVanishedStores}
      vanishedStoresEntry={vanishedStoresEntry}
      isPeak1984={isPeak1984}
      peak1984Entry={peak1984Entry}
      isOlympics={isOlympics}
      olympicsEntry={olympicsEntry}
      isOlympicsAthletes={isOlympicsAthletes}
      olympicsAthletesEntry={olympicsAthletesEntry}
      isNasaSpace={isNasaSpace}
      nasaSpaceEntry={nasaSpaceEntry}
      isNewspapersClassifieds={isNewspapersClassifieds}
      newspapersClassifiedsEntry={newspapersClassifiedsEntry}
      isLongDistancePhoneWars={isLongDistancePhoneWars}
      longDistancePhoneWarsEntry={longDistancePhoneWarsEntry}
      isFilmDevelopmentCameras={isFilmDevelopmentCameras}
      filmDevelopmentCamerasEntry={filmDevelopmentCamerasEntry}
      isThingsThatScream1984={isThingsThatScream1984}
      thingsThatScream1984Entry={thingsThatScream1984Entry}
      isMallCulture={isMallCulture}
      mallCultureEntry={mallCultureEntry}
      isTvMovie={isTvMovie}
      tvMovieEntry={tvMovieEntry}
      isObscureTv={isObscureTv}
      obscureTvEntry={obscureTvEntry}
      isGeneralProducts={isGeneralProducts}
      gpEntry={gpEntry}
      handleTap={handleTap}
      showIcon={showIcon}
      NETWORK_LOGOS={NETWORK_LOGOS}
      EASTER_EGGS={EASTER_EGGS}
      Clock={Clock}
      User={User}
      X={X}
      Tv={Tv}
      ad={ad}
    />
  );
}