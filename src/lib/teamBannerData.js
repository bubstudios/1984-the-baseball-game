// teamBannerData.js - Extracted from Home.jsx to reduce file size.
// Centralizes all team banner imports and the TEAM_BANNERS lookup table.

import { PADRES_BANNERS } from '@/lib/bannerData/padresBanners';
import { DODGERS_BANNERS } from '@/lib/bannerData/dodgersBanners';
import { REDS_BANNERS } from '@/lib/bannerData/redsBanners';
import { BRAVES_BANNERS } from '@/lib/bannerData/bravesBanners';
import { ASTROS_BANNERS } from '@/lib/bannerData/astrosBanners';
import { GIANTS_BANNERS } from '@/lib/bannerData/giantsBanners';
import { CUBS_BANNERS } from '@/lib/bannerData/cubsBanners';
import { METS_BANNERS } from '@/lib/bannerData/metsBanners';
import { CARDINALS_BANNERS } from '@/lib/bannerData/cardinalsBanners';
import { PIRATES_BANNERS } from '@/lib/bannerData/piratesBanners';
import { PHILLIES_BANNERS } from '@/lib/bannerData/philliesBanners';
import { EXPOS_BANNERS } from '@/lib/bannerData/exposBanners';
import { REDSOX_BANNERS } from '@/lib/bannerData/redsoxBanners';
import { YANKEES_BANNERS } from '@/lib/bannerData/yankeesBanners';
import { BREWERS_BANNERS } from '@/lib/bannerData/brewersBanners';
import { TIGERS_BANNERS } from '@/lib/bannerData/tigersBanners';
import { INDIANS_BANNERS } from '@/lib/bannerData/indiansBanners';
import { ORIOLES_BANNERS } from '@/lib/bannerData/oriolesBanners';
import { BLUEJAYS_BANNERS } from '@/lib/bannerData/bluejaysBanners';
import { ROYALS_BANNERS } from '@/lib/bannerData/royalsBanners';
import { ANGELS_BANNERS } from '@/lib/bannerData/angelsBanners';
import { WHITESOX_BANNERS } from '@/lib/bannerData/whitesoxBanners';
import { ATHLETICS_BANNERS } from '@/lib/bannerData/athleticsBanners';
import { TWINS_BANNERS } from '@/lib/bannerData/twinsBanners';
import { MARINERS_BANNERS } from '@/lib/bannerData/marinersBanners';
import { RANGERS_BANNERS } from '@/lib/bannerData/rangersBanners';
import { MOVIES_1984_BANNERS } from '@/lib/bannerData/movies1984Banners';
import { ELECTRONICS_COMPUTERS_BANNER } from '@/lib/bannerData/electronicsComputersBanners';
import { GENERAL_PRODUCTS_BANNER } from '@/lib/bannerData/generalProductsBanners';
import { WRESTLING_BANNER } from '@/lib/bannerData/proWrestlingBanners';
import { OLYMPICS_1984_BANNER } from '@/lib/bannerData/olympics1984Banners';
import { SPACE_AVIATION_BANNER } from '@/lib/bannerData/spaceAviationBanners';
import { NEWSPAPERS_BANNER } from '@/lib/bannerData/newspapersClassifiedsBanners';
import { PHONE_WARS_BANNER } from '@/lib/bannerData/longDistancePhoneWarsBanners';
import { CAMERAS_FILM_BANNER } from '@/lib/bannerData/filmDevelopmentCamerasBanners';
import { SCREAM_1984_BANNER } from '@/lib/bannerData/thingsThatScream1984Banners';
import { MALL_CULTURE_BANNER } from '@/lib/bannerData/mallCultureBanners';
import { FORMAT_WARS_BANNER } from '@/lib/bannerData/formatWarsBanners';
import { COUNTY_FAIR_BANNER } from '@/lib/bannerData/countyFairBanners';
import { MUSIC_MTV_BANNER } from '@/lib/bannerData/musicMtvBanners';
import { CARS_ROAD_BANNER } from '@/lib/bannerData/carsRoadBanners';
import { SATURDAY_CARTOONS_BANNER } from '@/lib/bannerData/saturdayCartoonsBanners';
import { CEREAL_BANNER } from '@/lib/bannerData/cerealMascotsBanners';
import { PROMO_NIGHTS_BANNER } from '@/lib/bannerData/promoNightsBanners';
import { NATIONAL_TV_BANNERS } from '@/lib/bannerData/nationalTVBanners';
import { ARCADE_BANNER } from '@/lib/bannerData/arcadeVideoGamesBanners';

export const TEAM_BANNERS = {
  padres: PADRES_BANNERS,
  dodgers: DODGERS_BANNERS,
  reds: REDS_BANNERS,
  braves: BRAVES_BANNERS,
  astros: ASTROS_BANNERS,
  giants: GIANTS_BANNERS,
  cubs: CUBS_BANNERS,
  mets: METS_BANNERS,
  cardinals: CARDINALS_BANNERS,
  pirates: PIRATES_BANNERS,
  phillies: PHILLIES_BANNERS,
  expos: EXPOS_BANNERS,
  redsox: REDSOX_BANNERS,
  yankees: YANKEES_BANNERS,
  brewers: BREWERS_BANNERS,
  tigers: TIGERS_BANNERS,
  indians: INDIANS_BANNERS,
  orioles: ORIOLES_BANNERS,
  bluejays: BLUEJAYS_BANNERS,
  royals: ROYALS_BANNERS,
  angels: ANGELS_BANNERS,
  whitesox: WHITESOX_BANNERS,
  athletics: ATHLETICS_BANNERS,
  twins: TWINS_BANNERS,
  mariners: MARINERS_BANNERS,
  rangers: RANGERS_BANNERS,
};

export function getBannersForTeam(teamKey) {
  return TEAM_BANNERS[teamKey] || null;
}