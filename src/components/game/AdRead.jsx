import React, { useState, useEffect } from 'react';
import { Clock, User, X, Tv } from 'lucide-react';
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
import AdReadPopupRenderer from './AdReadPopupRenderer';
import { trackSynopsisView, pickSynopsis, NETWORK_LOGOS, EASTER_EGGS } from '@/lib/tvGuideData';
import { findMovieIndex } from '@/lib/moviePopups';
import { findElectronicsEntry, trackElectronicsView } from '@/lib/electronicsPopups';
import { findGeneralProductsEntry, trackGeneralProductsView } from '@/lib/generalProductsPopups';
import { findObscureTvEntry, trackObscureTvView } from '@/lib/obscureTvPopups';
import { findMoreObscureTvEntry } from '@/lib/moreObscureTvPopups';
import { findMoreObscureTvEntry3 } from '@/lib/moreObscureTvPopups3';
import { findNationalCharityEntry, trackNationalCharityView } from '@/lib/nationalCharityPopups';
import { findArcadeEntry } from '@/lib/arcadePopups';
import { findArcadeVidGameEntry } from '@/lib/arcadeVidGamePopups';
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
import { findRedSoxBannerEntry, trackRedSoxBannerView } from '@/lib/redSoxBannerPopups';
import { findNationalPromosEntry, trackNationalPromosView } from '@/lib/nationalPromosPopups';
import { findNationalWrestlingEntry } from '@/lib/nationalWrestlingPopups';
import { findVhsBetamaxLaserDiscEntry } from '@/lib/vhsBetamaxLaserDiscPopups';
import { findDetroitTigersBannerEntry, trackDetroitTigersBannerView } from '@/lib/detroitTigersBannerPopups';
import { findTigersStadiumEntry, trackTigersStadiumView } from '@/lib/tigersStadiumPopups';
import { findPhilliesBannerEntry, trackPhilliesBannerView } from '@/lib/philliesBannerPopups';
import { findGenericAdEntry } from '@/lib/genericAdPopups';
import GenericBannerPopup from './GenericBannerPopup';
import AttractiveAdBanner from './AttractiveAdBanner';
import { generateFallbackEntry } from '@/lib/genericAdFallback';
import { findGenericBannerEntry } from '@/lib/genericBannerMatchers';
import { recordAdView, getQuestClueForAd } from '@/lib/adQuests';
import { getRandomCardForTeam, addCard, saveToStorage } from '@/lib/baseballCards';
import { findCubsBannerEntry, trackCubsBannerView } from '@/lib/cubsBannerPopups';
import { findTigersBannerEntry2, trackTigersBannerView2 } from '@/lib/tigersBannerPopups2';
import { findMetsBannerEntry, trackMetsBannerView } from '@/lib/metsBannerPopups';
import { findYankeesBannerEntry, trackYankeesBannerView } from '@/lib/yankeesBannerPopups';
import { findOriolesBannerEntry, trackOriolesBannerView } from '@/lib/oriolesBannerPopups';
import { findDodgersBannerEntry, trackDodgersBannerView } from '@/lib/dodgersBannerPopups';
import { findPadresBannerEntry, trackPadresBannerView } from '@/lib/padresBannerPopups';
import { findRedsBannerEntry, trackRedsBannerView } from '@/lib/redsBannerPopups';
import { findRoyalsBannerEntry, trackRoyalsBannerView } from '@/lib/royalsBannerPopups';

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
  const [isMoreObscureTv3, setIsMoreObscureTv3] = useState(false);
  const [moreObscureTvEntry3, setMoreObscureTvEntry3] = useState(null);
  const [isTvMovie, setIsTvMovie] = useState(false);
  const [tvMovieEntry, setTvMovieEntry] = useState(null);
  const [isArcade, setIsArcade] = useState(false);
  const [arcadeEntry, setArcadeEntry] = useState(null);
  const [isArcadeVidGame, setIsArcadeVidGame] = useState(false);
  const [arcadeVidGameEntry, setArcadeVidGameEntry] = useState(null);
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
  const [isRedSoxBanner, setIsRedSoxBanner] = useState(false);
  const [redSoxBannerEntry, setRedSoxBannerEntry] = useState(null);
  const [isNationalCharity, setIsNationalCharity] = useState(false);
  const [nationalCharityEntry, setNationalCharityEntry] = useState(null);
  const [isNationalPromos, setIsNationalPromos] = useState(false);
  const [nationalPromosEntry, setNationalPromosEntry] = useState(null);
  const [isNationalWrestling, setIsNationalWrestling] = useState(false);
  const [nationalWrestlingEntry, setNationalWrestlingEntry] = useState(null);
  const [isVhsBetamax, setIsVhsBetamax] = useState(false);
  const [vhsBetamaxEntry, setVhsBetamaxEntry] = useState(null);
  const [isDetroitTigers, setIsDetroitTigers] = useState(false);
  const [detroitTigersEntry, setDetroitTigersEntry] = useState(null);
  const [isCubsBanner, setIsCubsBanner] = useState(false);
  const [cubsBannerEntry, setCubsBannerEntry] = useState(null);
  const [isTigersBanner2, setIsTigersBanner2] = useState(false);
  const [tigersBanner2Entry, setTigersBanner2Entry] = useState(null);
  const [isMetsBanner, setIsMetsBanner] = useState(false);
  const [metsBannerEntry, setMetsBannerEntry] = useState(null);
  const [isYankeesBanner, setIsYankeesBanner] = useState(false);
  const [yankeesBannerEntry, setYankeesBannerEntry] = useState(null);
  const [isOriolesBanner, setIsOriolesBanner] = useState(false);
  const [oriolesBannerEntry, setOriolesBannerEntry] = useState(null);
  const [isDodgersBanner, setIsDodgersBanner] = useState(false);
  const [dodgersBannerEntry, setDodgersBannerEntry] = useState(null);
  const [isPadresBanner, setIsPadresBanner] = useState(false);
  const [padresBannerEntry, setPadresBannerEntry] = useState(null);
  const [isRedsBanner, setIsRedsBanner] = useState(false);
  const [redsBannerEntry, setRedsBannerEntry] = useState(null);
  const [isRoyalsBanner, setIsRoyalsBanner] = useState(false);
  const [royalsBannerEntry, setRoyalsBannerEntry] = useState(null);
  const [isTigersStadium, setIsTigersStadium] = useState(false);
  const [tigersStadiumEntry, setTigersStadiumEntry] = useState(null);
  const [isPhilliesBanner, setIsPhilliesBanner] = useState(false);
  const [philliesBannerEntry, setPhilliesBannerEntry] = useState(null);
  const [isGenericAd, setIsGenericAd] = useState(false);
  const [genericAdEntry, setGenericAdEntry] = useState(null);
  const [questResult, setQuestResult] = useState(null);
  const [alreadyTracked, setAlreadyTracked] = useState(false);

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
    } else if (findMoreObscureTvEntry3(ad.text)) {
      setIsMoreObscureTv3(true);
      setMoreObscureTvEntry3(findMoreObscureTvEntry3(ad.text));
    } else if (findArcadeEntry(ad.text)) {
      setIsArcade(true);
      setArcadeEntry(findArcadeEntry(ad.text));
    } else if (findArcadeVidGameEntry(ad.text)) {
      setIsArcadeVidGame(true);
      setArcadeVidGameEntry(findArcadeVidGameEntry(ad.text));
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
    } else if (findRedSoxBannerEntry(ad.text)) {
      setIsRedSoxBanner(true);
      setRedSoxBannerEntry(findRedSoxBannerEntry(ad.text));
    } else if (findNationalCharityEntry(ad.text)) {
      setIsNationalCharity(true);
      setNationalCharityEntry(findNationalCharityEntry(ad.text));
    } else if (findNationalPromosEntry(ad.text)) {
      setIsNationalPromos(true);
      setNationalPromosEntry(findNationalPromosEntry(ad.text));
    } else if (findNationalWrestlingEntry(ad.text)) {
      setIsNationalWrestling(true);
      setNationalWrestlingEntry(findNationalWrestlingEntry(ad.text));
    } else if (findVhsBetamaxLaserDiscEntry(ad.text)) {
      setIsVhsBetamax(true);
      setVhsBetamaxEntry(findVhsBetamaxLaserDiscEntry(ad.text));
    } else if (findDetroitTigersBannerEntry(ad.text)) {
      setIsDetroitTigers(true);
      setDetroitTigersEntry(findDetroitTigersBannerEntry(ad.text));
    } else if (findCubsBannerEntry(ad.text)) {
      setIsCubsBanner(true);
      setCubsBannerEntry(findCubsBannerEntry(ad.text));
    } else if (findTigersBannerEntry2(ad.text)) {
      setIsTigersBanner2(true);
      setTigersBanner2Entry(findTigersBannerEntry2(ad.text));
    } else if (findMetsBannerEntry(ad.text)) {
      setIsMetsBanner(true);
      setMetsBannerEntry(findMetsBannerEntry(ad.text));
    } else if (findYankeesBannerEntry(ad.text)) {
      setIsYankeesBanner(true);
      setYankeesBannerEntry(findYankeesBannerEntry(ad.text));
    } else if (findOriolesBannerEntry(ad.text)) {
      setIsOriolesBanner(true);
      setOriolesBannerEntry(findOriolesBannerEntry(ad.text));
    } else if (findDodgersBannerEntry(ad.text)) {
      setIsDodgersBanner(true);
      setDodgersBannerEntry(findDodgersBannerEntry(ad.text));
    } else if (findPadresBannerEntry(ad.text)) {
      setIsPadresBanner(true);
      setPadresBannerEntry(findPadresBannerEntry(ad.text));
    } else if (findRedsBannerEntry(ad.text)) {
      setIsRedsBanner(true);
      setRedsBannerEntry(findRedsBannerEntry(ad.text));
    } else if (findRoyalsBannerEntry(ad.text)) {
      setIsRoyalsBanner(true);
      setRoyalsBannerEntry(findRoyalsBannerEntry(ad.text));
    } else if (findTigersStadiumEntry(ad.text)) {
      setIsTigersStadium(true);
      setTigersStadiumEntry(findTigersStadiumEntry(ad.text));
    } else if (findPhilliesBannerEntry(ad.text)) {
      setIsPhilliesBanner(true);
      setPhilliesBannerEntry(findPhilliesBannerEntry(ad.text));
    } else if (findGenericAdEntry(ad.text)) {
      setIsGenericAd(true);
      setGenericAdEntry(findGenericAdEntry(ad.text));
    } else if (movie !== null) {
      setIsMovie(true);
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
        } else {
          // Try keyword-based generic banner matcher first, then fallback
          const genericBanner = findGenericBannerEntry(ad.text);
          if (genericBanner) {
            setIsGenericAd(true);
            setGenericAdEntry(genericBanner);
          } else {
            const richFallback = generateFallbackEntry(ad.text);
            if (richFallback) {
              setIsGenericAd(true);
              setGenericAdEntry(richFallback);
            }
          }
        }
      }
    }
    const showTimer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(showTimer);
  }, [ad]);

  // Auto-dismiss only when not expanded AND not a movie (handles its own timing)
  // Also don't auto-dismiss if ANY rich popup type is active
  // AND don't auto-dismiss if user hasn't tapped yet (expanded tracks first tap)
  const hasRichPopup = isElectronics || isGeneralProducts || isMoreObscureTv || isMoreObscureTv3 || isArcade || isArcadeVidGame || isWrestling || isVanishedStores || isPeak1984 || isOlympics || isOlympicsAthletes || isNasaSpace || isNewspapersClassifieds || isLongDistancePhoneWars || isFilmDevelopmentCameras || isThingsThatScream1984 || isMallCulture || isRedSoxBanner || isNationalCharity || isNationalPromos || isNationalWrestling || isVhsBetamax || isDetroitTigers || isCubsBanner || isTigersBanner2 || isMetsBanner || isYankeesBanner || isOriolesBanner || isDodgersBanner || isPadresBanner || isRedsBanner || isRoyalsBanner || isTigersStadium || isPhilliesBanner || isGenericAd;
  useEffect(() => {
    // Only auto-dismiss if autoDismissMs > 0 AND user has tapped (expanded=true)
    if (!visible || !expanded || hasRichPopup || autoDismissMs <= 0 || isMovie) return;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [visible, expanded, hasRichPopup, autoDismissMs, onDismiss, isMovie]);

  if (!ad || !visible) return null;

  // ── Movie Popup ──
  if (isMovie) {
    return <MoviePopup ad={ad} onDismiss={() => { setVisible(false); onDismiss(); }} onAchievement={onAchievement} />;
  }

  // ── Generic Attractive Banner ──
  if (isGenericAd && genericAdEntry) {
    return <AttractiveAdBanner entry={genericAdEntry} onDismiss={() => { setVisible(false); onDismiss(); }} onClick={handleTap} />;
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
    const specialTypes = [isObscureTv, isMoreObscureTv, isMoreObscureTv3, isTvMovie, isArcade, isArcadeVidGame, isWrestling, isVanishedStores, isPeak1984, isOlympics, isOlympicsAthletes, isNasaSpace, isNewspapersClassifieds, isLongDistancePhoneWars, isFilmDevelopmentCameras, isThingsThatScream1984, isMallCulture, isRedSoxBanner, isNationalCharity, isNationalPromos, isNationalWrestling, isVhsBetamax, isDetroitTigers, isCubsBanner, isTigersBanner2, isMetsBanner, isYankeesBanner, isOriolesBanner, isDodgersBanner, isPadresBanner, isRedsBanner, isRoyalsBanner, isTigersStadium, isPhilliesBanner, isGenericAd];
    if (specialTypes.some(t => t)) {
      setExpanded(true);
      // ── Quest tracking ──
      const adTypeKey = isArcade ? 'arcade' : isArcadeVidGame ? 'arcadeVidGame' : isElectronics ? 'electronics'
        : isWrestling ? 'wrestling' : isNationalWrestling ? 'nationalWrestling'
        : isVhsBetamax ? 'vhsBetamax' : isObscureTv ? 'obscureTv' : isMoreObscureTv ? 'moreObscureTv'
        : isMoreObscureTv3 ? 'moreObscureTv3' : isTvMovie ? 'tvMovie' : isNationalPromos ? 'nationalPromos'
        : isPeak1984 ? 'peak1984' : isMallCulture ? 'mallCulture' : isThingsThatScream1984 ? 'thingsThatScream1984'
        : isVanishedStores ? 'vanishedStores' : isOlympics ? 'olympics' : isOlympicsAthletes ? 'olympicsAthletes'
        : isNasaSpace ? 'nasaSpace' : isNationalCharity ? 'nationalCharity'
        : isPhilliesBanner ? 'philliesBanner' : isCubsBanner ? 'cubsBanner' : isTigersBanner2 ? 'tigersBanner2'
        : isMetsBanner ? 'metsBanner' : isYankeesBanner ? 'yankeesBanner' : isOriolesBanner ? 'oriolesBanner'
        : isDodgersBanner ? 'dodgersBanner' : isPadresBanner ? 'padresBanner' : isRedsBanner ? 'redsBanner'
        : isRoyalsBanner ? 'royalsBanner' : isDetroitTigers ? 'detroitTigers' : isRedSoxBanner ? 'redSoxBanner'
        : isTigersStadium ? 'tigersStadium' : isGenericAd ? 'generic' : null;
      if (adTypeKey && !alreadyTracked) {
        setAlreadyTracked(true);
        const qResults = recordAdView(adTypeKey, ad?.text);
        const clue = getQuestClueForAd(adTypeKey, ad?.text);
        const completed = qResults.find(r => r.justCompleted);
        if (completed) {
          // Award bonus card for quest completion
          const rewardTeam = completed.quest.reward.team;
          const card = getRandomCardForTeam(rewardTeam);
          if (card) {
            addCard(rewardTeam, card.id);
            saveToStorage(rewardTeam);
          }
        }
        setQuestResult({ clue, completedQuest: completed?.quest || null });
      }
      if (isNationalCharity && nationalCharityEntry && !alreadyTracked) {
        setAlreadyTracked(true);
        const unlocked = trackNationalCharityView(nationalCharityEntry.id);
        if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      }
      if (isDetroitTigers && detroitTigersEntry) {
        const unlocked = trackDetroitTigersBannerView(detroitTigersEntry.id);
        if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      }
      if (isTigersStadium && tigersStadiumEntry) {
        const unlocked = trackTigersStadiumView(tigersStadiumEntry.id);
        if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      }
      if (isPhilliesBanner && philliesBannerEntry) {
        const unlocked = trackPhilliesBannerView(philliesBannerEntry.id);
        if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);
      }
      // New team banners — tracking is handled inside TeamBannerPopup via trackView prop
      return;
    }
    if (!synopsisData) {
      // Try keyword-based rich fallback; if none found, just dismiss — no bland "Broadcast Message"
      const richFallback = generateFallbackEntry(ad?.text);
      if (richFallback) {
        setIsGenericAd(true);
        setGenericAdEntry(richFallback);
        setExpanded(true);
      } else {
        setExpanded(false);
        onDismiss();
      }
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
      isMoreObscureTv3={isMoreObscureTv3}
      moreObscureTvEntry3={moreObscureTvEntry3}
      isArcade={isArcade}
      arcadeEntry={arcadeEntry}
      isArcadeVidGame={isArcadeVidGame}
      arcadeVidGameEntry={arcadeVidGameEntry}
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
      isRedSoxBanner={isRedSoxBanner}
      redSoxBannerEntry={redSoxBannerEntry}
      isNationalCharity={isNationalCharity}
      nationalCharityEntry={nationalCharityEntry}
      isNationalPromos={isNationalPromos}
      nationalPromosEntry={nationalPromosEntry}
      isNationalWrestling={isNationalWrestling}
      nationalWrestlingEntry={nationalWrestlingEntry}
      isVhsBetamax={isVhsBetamax}
      vhsBetamaxEntry={vhsBetamaxEntry}
      isDetroitTigers={isDetroitTigers}
      detroitTigersEntry={detroitTigersEntry}
      isCubsBanner={isCubsBanner}
      cubsBannerEntry={cubsBannerEntry}
      isTigersBanner2={isTigersBanner2}
      tigersBanner2Entry={tigersBanner2Entry}
      isMetsBanner={isMetsBanner}
      metsBannerEntry={metsBannerEntry}
      isYankeesBanner={isYankeesBanner}
      yankeesBannerEntry={yankeesBannerEntry}
      isOriolesBanner={isOriolesBanner}
      oriolesBannerEntry={oriolesBannerEntry}
      isDodgersBanner={isDodgersBanner}
      dodgersBannerEntry={dodgersBannerEntry}
      isPadresBanner={isPadresBanner}
      padresBannerEntry={padresBannerEntry}
      isRedsBanner={isRedsBanner}
      redsBannerEntry={redsBannerEntry}
      isRoyalsBanner={isRoyalsBanner}
      royalsBannerEntry={royalsBannerEntry}
      isTigersStadium={isTigersStadium}
      tigersStadiumEntry={tigersStadiumEntry}
      isPhilliesBanner={isPhilliesBanner}
      philliesBannerEntry={philliesBannerEntry}
      isGenericAd={isGenericAd}
      genericAdEntry={genericAdEntry}
      questResult={questResult}
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