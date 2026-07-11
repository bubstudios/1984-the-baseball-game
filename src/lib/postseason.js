// postseason.js - 1984 postseason bracket generation.
// 4 division winners only (no Wild Cards, no Division Series).
// ALCS: AL East champ vs AL West champ (best-of-5, 2-3 format).
// NLCS: NL East champ vs NL West champ (best-of-5, 2-3 format).
// World Series: AL champ vs NL champ (best-of-7, 2-3-2, NL home field).
// Uses postseasonHomeField.js for the 1984 rotation rules (including Cubs exception).

import { TEAMS } from './gameData';
import { DIVISIONS, getDivision, getLeague } from './seasonSchedule';
import { getLcsHomeFieldByTeams, getWorldSeriesHomeField } from './postseasonHomeField';

// Get the 4 division winners from standings data
export function getDivisionWinners(standingsData) {
  const winners = {};
  for (const divName of Object.keys(DIVISIONS)) {
    const divStandings = standingsData?.[divName] || [];
    if (divStandings.length > 0) {
      winners[divName] = divStandings[0].teamKey;
    }
  }
  return winners;
}

// LCS dates: 1984 ALCS started Oct 2, NLCS started Oct 2.
// Games 1-2 on consecutive days, travel day, Games 3-5 on consecutive days.
function generateLcsGames(earlyHost, lateHost, startDate) {
  const baseDate = new Date(startDate + 'T00:00:00Z');
  const dateStr = (offset) => {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().split('T')[0];
  };
  return [
    { gameNumber: 1, homeTeam: earlyHost, awayTeam: lateHost, date: dateStr(0) },
    { gameNumber: 2, homeTeam: earlyHost, awayTeam: lateHost, date: dateStr(1) },
    { gameNumber: 3, homeTeam: lateHost, awayTeam: earlyHost, date: dateStr(3) },
    { gameNumber: 4, homeTeam: lateHost, awayTeam: earlyHost, date: dateStr(4) },
    { gameNumber: 5, homeTeam: lateHost, awayTeam: earlyHost, date: dateStr(5) },
  ];
}

// World Series dates: starts after both LCS complete. 2-3-2 format with travel days.
function generateWsGames(topHost, midHost, startDate) {
  const baseDate = new Date(startDate + 'T00:00:00Z');
  const dateStr = (offset) => {
    const d = new Date(baseDate);
    d.setUTCDate(d.getUTCDate() + offset);
    return d.toISOString().split('T')[0];
  };
  return [
    { gameNumber: 1, homeTeam: topHost, awayTeam: midHost, date: dateStr(0) },
    { gameNumber: 2, homeTeam: topHost, awayTeam: midHost, date: dateStr(1) },
    { gameNumber: 3, homeTeam: midHost, awayTeam: topHost, date: dateStr(3) },
    { gameNumber: 4, homeTeam: midHost, awayTeam: topHost, date: dateStr(4) },
    { gameNumber: 5, homeTeam: midHost, awayTeam: topHost, date: dateStr(5) },
    { gameNumber: 6, homeTeam: topHost, awayTeam: midHost, date: dateStr(7) },
    { gameNumber: 7, homeTeam: topHost, awayTeam: midHost, date: dateStr(8) },
  ];
}

// Generate the full postseason bracket
export function generatePostseason(standingsData) {
  const winners = getDivisionWinners(standingsData);

  const alEast = winners.AL_East;
  const alWest = winners.AL_West;
  const nlEast = winners.NL_East;
  const nlWest = winners.NL_West;

  if (!alEast || !alWest || !nlEast || !nlWest) {
    return null;
  }

  // ALCS: AL West hosts Games 1-2, AL East hosts Games 3-5
  const alcs = getLcsHomeFieldByTeams('AL', alEast, alWest);
  const alcsGames = generateLcsGames(alcs.earlyHost, alcs.lateHost, '1984-10-02');

  // NLCS: NL East hosts Games 1-2, NL West hosts Games 3-5
  const nlcs = getLcsHomeFieldByTeams('NL', nlEast, nlWest);
  const nlcsGames = generateLcsGames(nlcs.earlyHost, nlcs.lateHost, '1984-10-02');

  // World Series: NL has home field (Games 1,2,6,7) unless Cubs exception
  // NL champ and AL champ are TBD until LCS complete, but we pre-assign
  // the home-field structure based on which division wins each league.
  // For WS home field, we need the actual NL and AL champ teams. Since LCS
  // aren't played yet, we store the structure and resolve at WS time.
  // But we CAN determine home field by league: NL winner hosts 1,2,6,7.
  // The Cubs exception is checked when we know the NL champ.
  const ws = {
    format: '2-3-2',
    bestOf: 7,
    nlChamp: null, // TBD after NLCS
    alChamp: null, // TBD after ALCS
    topHost: null, // NL champ (or AL if Cubs exception) - resolved at WS time
    midHost: null,
    games: [],
    status: 'pending', // pending -> scheduled -> in_progress -> complete
    winner: null,
  };

  return {
    divisionWinners: winners,
    alcs: {
      league: 'AL',
      eastChamp: alEast,
      westChamp: alWest,
      earlyHost: alcs.earlyHost,
      lateHost: alcs.lateHost,
      format: alcs.format,
      bestOf: alcs.bestOf,
      games: alcsGames,
      status: 'scheduled',
      winner: null,
    },
    nlcs: {
      league: 'NL',
      eastChamp: nlEast,
      westChamp: nlWest,
      earlyHost: nlcs.earlyHost,
      lateHost: nlcs.lateHost,
      format: nlcs.format,
      bestOf: nlcs.bestOf,
      games: nlcsGames,
      status: 'scheduled',
      winner: null,
    },
    worldSeries: ws,
  };
}

// Resolve World Series home field once both LCS winners are known
export function resolveWorldSeriesHomeField(postseason, nlChamp, alChamp) {
  if (!nlChamp || !alChamp) return postseason;
  const hf = getWorldSeriesHomeField(nlChamp, alChamp);
  const ws = { ...postseason.worldSeries };
  ws.nlChamp = nlChamp;
  ws.alChamp = alChamp;
  ws.topHost = hf.topHost;
  ws.midHost = hf.midHost;
  ws.cubsException = hf.cubsException;
  ws.nlHasHomeField = hf.nlHasHomeField;
  ws.games = generateWsGames(hf.topHost, hf.midHost, '1984-10-09');
  ws.status = 'scheduled';
  return { ...postseason, worldSeries: ws };
}

// Check if user's team made the postseason
export function userTeamInPostseason(postseason, userTeam) {
  if (!postseason?.divisionWinners) return false;
  const w = postseason.divisionWinners;
  return w.AL_East === userTeam || w.AL_West === userTeam ||
    w.NL_East === userTeam || w.NL_West === userTeam;
}