// postseasonHomeField.js
// 1984 MLB postseason home-field rules.
//
// In 1984, the All-Star Game result does NOT determine World Series home field,
// and regular-season record does NOT determine home field for the LCS or WS.
// Home field is fixed by league/division rotation per the actual 1984 postseason.
//
// Sources:
//   1984 ALCS: Games 1-2 in Kansas City (AL West champ), Game 3 in Detroit (AL East champ).
//   1984 NLCS: Games 1-2 at Wrigley (NL East champ), Games 3-5 in San Diego (NL West champ).
//   1984 WS:   NL has home field (Games 1,2,6,7 in NL park; 3,4,5 in AL park).

import { getDivision } from './seasonSchedule';

// ── LCS FORMAT ──
// Best-of-five, 2-3 format (NOT 2-2-1). No "best record" rule.
//   NLCS: NL East champion hosts Games 1-2; NL West champion hosts Games 3-5.
//   ALCS: AL West champion hosts Games 1-2; AL East champion hosts Games 3-5.

/**
 * Returns the LCS home-field structure for a given league's two champions.
 * @param {string} league - 'AL' or 'NL'
 * @param {string} eastChamp - team key of the East division champion
 * @param {string} westChamp - team key of the West division champion
 * @returns {{ earlyHost: string, lateHost: string, format: string, bestOf: number }}
 *   earlyHost = team hosting Games 1-2; lateHost = team hosting Games 3-5.
 */
export function getLcsHomeField(league, eastChamp, westChamp) {
  if (league === 'NL') {
    // NL East hosts Games 1-2; NL West hosts Games 3-5
    return { earlyHost: eastChamp, lateHost: westChamp, format: '2-3', bestOf: 5 };
  }
  // AL West hosts Games 1-2; AL East hosts Games 3-5
  return { earlyHost: westChamp, lateHost: eastChamp, format: '2-3', bestOf: 5 };
}

/**
 * Which team hosts a given LCS game number (1-5)?
 */
export function getLcsGameHost(league, gameNumber, eastChamp, westChamp) {
  const hf = getLcsHomeField(league, eastChamp, westChamp);
  if ([1, 2].includes(gameNumber)) return hf.earlyHost;
  if ([3, 4, 5].includes(gameNumber)) return hf.lateHost;
  return null;
}

/**
 * Convenience: given two NL (or AL) champ team keys (order-independent),
 * derive the LCS home-field by looking up each team's division.
 * @returns {{ earlyHost, lateHost, eastChamp, westChamp, format, bestOf }}
 */
export function getLcsHomeFieldByTeams(league, champA, champB) {
  const divA = getDivision(champA);
  const eastChamp = divA && divA.endsWith('East') ? champA : champB;
  const westChamp = eastChamp === champA ? champB : champA;
  const hf = getLcsHomeField(league, eastChamp, westChamp);
  return { ...hf, eastChamp, westChamp };
}

// ── WORLD SERIES FORMAT ──
// Best-of-seven, 2-3-2 format.
// In 1984 the National League has home-field advantage:
//   NL champion hosts Games 1, 2, 6, 7; AL champion hosts Games 3, 4, 5.
//
// Special 1984 Cubs exception: Wrigley Field had no permanent lights, so if the
// Cubs are the NL champion, the AL champion hosts Games 1, 2, 6, 7 and the
// Cubs host Games 3, 4, 5.

const CUBS_KEY = 'cubs';

/**
 * Returns the World Series home-field structure for 1984.
 * @param {string} nlChamp - team key of the NL champion
 * @param {string} alChamp - team key of the AL champion
 * @returns {{ topHost: string, midHost: string, format: string, bestOf: number,
 *            nlHasHomeField: boolean, cubsException: boolean }}
 *   topHost = team hosting Games 1,2,6,7; midHost = team hosting Games 3,4,5.
 */
export function getWorldSeriesHomeField(nlChamp, alChamp) {
  const cubsException = nlChamp === CUBS_KEY;
  if (cubsException) {
    // Cubs exception: AL hosts 1,2,6,7; Cubs host 3,4,5
    return {
      topHost: alChamp,
      midHost: nlChamp,
      format: '2-3-2',
      bestOf: 7,
      nlHasHomeField: false,
      cubsException: true,
    };
  }
  // Standard 1984: NL hosts 1,2,6,7; AL hosts 3,4,5
  return {
    topHost: nlChamp,
    midHost: alChamp,
    format: '2-3-2',
    bestOf: 7,
    nlHasHomeField: true,
    cubsException: false,
  };
}

/**
 * Which team hosts a given World Series game number (1-7)?
 */
export function getWorldSeriesGameHost(gameNumber, nlChamp, alChamp) {
  const hf = getWorldSeriesHomeField(nlChamp, alChamp);
  if ([1, 2, 6, 7].includes(gameNumber)) return hf.topHost;
  if ([3, 4, 5].includes(gameNumber)) return hf.midHost;
  return null;
}

// For 1984, the league that has World Series home field (stored on the Season
// entity as an informational reflection of the fixed rule). Always 'NL' unless
// the Cubs exception applies, which is resolved at WS time by the functions above.
export const WORLD_SERIES_HOME_FIELD_LEAGUE_1984 = 'NL';