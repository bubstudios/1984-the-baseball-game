// postseasonHomeField.js
// World Series home-field is awarded to the league that wins the All-Star Game.
// LCS home field follows the 2-3 format (East/West rotation).

import { getDivision } from './seasonSchedule';

// ── LCS FORMAT ──
// Best-of-five, 2-3 format (NOT 2-2-1).
//   NLCS: NL East champion hosts Games 1-2; NL West champion hosts Games 3-5.
//   ALCS: AL West champion hosts Games 1-2; AL East champion hosts Games 3-5.

export function getLcsHomeField(league, eastChamp, westChamp) {
  if (league === 'NL') {
    return { earlyHost: eastChamp, lateHost: westChamp, format: '2-3', bestOf: 5 };
  }
  return { earlyHost: westChamp, lateHost: eastChamp, format: '2-3', bestOf: 5 };
}

export function getLcsGameHost(league, gameNumber, eastChamp, westChamp) {
  const hf = getLcsHomeField(league, eastChamp, westChamp);
  if ([1, 2].includes(gameNumber)) return hf.earlyHost;
  if ([3, 4, 5].includes(gameNumber)) return hf.lateHost;
  return null;
}

export function getLcsHomeFieldByTeams(league, champA, champB) {
  const divA = getDivision(champA);
  const eastChamp = divA && divA.endsWith('East') ? champA : champB;
  const westChamp = eastChamp === champA ? champB : champA;
  const hf = getLcsHomeField(league, eastChamp, westChamp);
  return { ...hf, eastChamp, westChamp };
}

// ── WORLD SERIES FORMAT ──
// Best-of-seven, 2-3-2 format.
// The league that won the All-Star Game hosts Games 1, 2, 6, 7.
// The other league's champion hosts Games 3, 4, 5.

export function getWorldSeriesHomeField(nlChamp, alChamp, asgWinnerLeague) {
  const winnerLeague = asgWinnerLeague || 'NL'; // fallback
  if (winnerLeague === 'AL') {
    return {
      topHost: alChamp,
      midHost: nlChamp,
      format: '2-3-2',
      bestOf: 7,
      asgWinnerLeague: 'AL',
    };
  }
  return {
    topHost: nlChamp,
    midHost: alChamp,
    format: '2-3-2',
    bestOf: 7,
    asgWinnerLeague: 'NL',
  };
}

export function getWorldSeriesGameHost(gameNumber, nlChamp, alChamp, asgWinnerLeague) {
  const hf = getWorldSeriesHomeField(nlChamp, alChamp, asgWinnerLeague);
  if ([1, 2, 6, 7].includes(gameNumber)) return hf.topHost;
  if ([3, 4, 5].includes(gameNumber)) return hf.midHost;
  return null;
}