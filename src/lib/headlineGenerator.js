// headlineGenerator.js - Generates newspaper headlines from completed game results.
// Pure presentation layer - does NOT modify game engine balance or player ratings.

import { TEAMS } from './gameData';

function teamName(key) { return TEAMS[key]?.name || key; }
function teamCity(key) { return TEAMS[key]?.city || ''; }
function teamAbbr(key) { return TEAMS[key]?.abbr || key; }
function last(fullName) {
  if (!fullName) return '?';
  const p = fullName.trim().split(' ');
  return p.length > 1 ? p[p.length - 1] : fullName;
}
function leagueOf(key) { return TEAMS[key]?.league || 'NL'; }
function oppOf(result, teamKey) {
  return teamKey === result.homeTeam ? result.awayTeam : result.homeTeam;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Analyze a single GameResult and return headline candidates with priority scores.
function analyzeGame(result, userTeam) {
  const candidates = [];
  const bs = result.boxScore || {};
  const batting = bs.batting || [];
  const pitching = bs.pitching || [];
  const innings = result.innings || bs.innings || [];

  const homeWon = result.homeScore > result.awayScore;
  const winner = homeWon ? result.homeTeam : result.awayTeam;
  const loser = homeWon ? result.awayTeam : result.homeTeam;
  const margin = Math.abs(result.homeScore - result.awayScore);
  const totalRuns = result.homeScore + result.awayScore;
  const isUserGame = result.awayTeam === userTeam || result.homeTeam === userTeam;
  const isExtra = (innings || []).length > 9;
  const isBlowout = margin >= 8;
  const isDuel = totalRuns <= 3;
  const isShutout = result.homeScore === 0 || result.awayScore === 0;

  // Walk-off: home team wins, game ended in 9th or extra inning bottom
  let isWalkOff = false;
  if (homeWon && innings.length >= 9) {
    const lastInn = innings[innings.length - 1];
    // If extra innings, the last inning should have a home score but no away (or less)
    if (isExtra && lastInn) {
      isWalkOff = (lastInn.home !== null && lastInn.home !== undefined) && (lastInn.away === 0 || lastInn.away === null);
    } else if (innings.length === 9) {
      // Bottom 9th walk-off: home scored in 9th and won
      const inn9 = innings[8];
      if (inn9 && inn9.home !== null && inn9.home !== undefined && inn9.home > 0) {
        isWalkOff = true;
      }
    }
  }

  // Comeback: winner was down 4+ at midpoint
  let isComeback = false;
  if (innings.length >= 5) {
    const mid = Math.min(6, innings.length - 1);
    let aEarly = 0, hEarly = 0;
    for (let i = 0; i < mid; i++) {
      aEarly += innings[i]?.away || 0;
      hEarly += innings[i]?.home || 0;
    }
    const earlyGap = winner === result.homeTeam ? hEarly - aEarly : aEarly - hEarly;
    if (earlyGap <= -4) isComeback = true;
  }

  // ── Hitting performances ──
  for (const b of batting) {
    const hr = b.hr || 0;
    const rbi = b.rbi || 0;
    const hits = b.h || 0;
    const won = b.teamKey === winner;
    const opp = oppOf(result, b.teamKey);

    if (hr >= 2) {
      const templates = [
        `${last(b.name)} Blasts ${hr} Homers as ${teamName(b.teamKey)} ${won ? 'Top' : 'Fall to'} ${teamName(opp)}`,
        `${last(b.name)} Powers ${teamName(b.teamKey)} with ${hr}-HR Day`,
        `${last(b.name)} Hits ${hr} Out as ${teamName(b.teamKey)} ${won ? 'Win' : 'Fall'}`,
      ];
      candidates.push({ priority: 80 + hr * 10, type: 'multi_hr', headlineText: pick(templates), subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    } else if (rbi >= 3) {
      const templates = [
        `${last(b.name)} Drives in ${rbi} as ${teamName(b.teamKey)} ${won ? 'Beat' : 'Fall to'} ${teamName(opp)}`,
        `${last(b.name)}'s ${rbi} RBI Pace ${teamName(b.teamKey)}`,
      ];
      candidates.push({ priority: 55 + rbi * 3, type: 'big_rbi', headlineText: pick(templates), subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    }

    if (hits >= 4) {
      candidates.push({ priority: 50 + hits * 3, type: 'big_hit', headlineText: `${last(b.name)} Sparks ${teamName(b.teamKey)} with ${hits}-Hit Day`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    }
  }

  // ── Pitching performances ──
  for (const p of pitching) {
    const outs = p.outs || 0;
    const k = p.so || 0;
    const er = p.er || 0;
    const won = p.w === 1;
    const opp = oppOf(result, p.teamKey);
    const isCG = outs >= 27;
    const isNearCG = outs >= 24;

    if (isCG && er === 0) {
      candidates.push({ priority: 90, type: 'shutout', headlineText: `${last(p.name)} Spins Shutout as ${teamName(p.teamKey)} Blank ${teamName(opp)}`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    } else if (isCG && er <= 2) {
      candidates.push({ priority: 72, type: 'complete_game', headlineText: `${last(p.name)} Goes the Distance in ${teamName(p.teamKey)} Win`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    } else if (k >= 10) {
      candidates.push({ priority: 65 + k, type: 'big_k', headlineText: `${last(p.name)} Fans ${k} as ${teamName(p.teamKey)} ${won ? 'Beat' : 'Fall to'} ${teamName(opp)}`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    } else if (isNearCG && er <= 1) {
      candidates.push({ priority: 60, type: 'gem', headlineText: `${last(p.name)} Spins Gem for ${teamName(p.teamKey)}`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
    }
  }

  // ── Team/game events ──
  if (isWalkOff) {
    const innLabel = isExtra ? `${innings.length}th` : 'Ninth';
    candidates.push({ priority: 88, type: 'walkoff', headlineText: `${teamName(result.homeTeam)} Win It in the ${innLabel}`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }
  if (isExtra) {
    candidates.push({ priority: 50 + innings.length, type: 'extra', headlineText: `${teamName(winner)} Outlast ${teamName(loser)} in ${innings.length} Innings`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }
  if (isBlowout) {
    candidates.push({ priority: 40 + margin, type: 'blowout', headlineText: `${teamName(winner)} Pound ${teamName(loser)} in ${margin}-Run Rout`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }
  if (isDuel && !isShutout) {
    candidates.push({ priority: 45, type: 'duel', headlineText: `${teamName(winner)} Edge ${teamName(loser)} in ${totalRuns}-Run Duel`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }
  if (isComeback) {
    candidates.push({ priority: 62, type: 'comeback', headlineText: `${teamName(winner)} Rally Past ${teamName(loser)} for Comeback Win`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }
  if (isShutout && !candidates.some(c => c.type === 'shutout')) {
    const ws = winner === result.homeTeam ? result.homeScore : result.awayScore;
    candidates.push({ priority: 50, type: 'team_shutout', headlineText: `${teamName(winner)} Blank ${teamName(loser)} ${ws}-0`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }

  // User team headline (always included when user team played)
  if (isUserGame) {
    const userWon = result.winner === userTeam;
    const opp = oppOf(result, userTeam);
    const uScore = userWon ? Math.max(result.homeScore, result.awayScore) : Math.min(result.homeScore, result.awayScore);
    const oScore = userWon ? Math.min(result.homeScore, result.awayScore) : Math.max(result.homeScore, result.awayScore);
    let text;
    if (userWon) {
      text = pick([
        `${teamName(userTeam)} Ride to Victory, ${uScore}-${oScore} over ${teamName(opp)}`,
        `${teamName(userTeam)} Defeat ${teamName(opp)} ${uScore}-${oScore}`,
      ]);
    } else {
      text = pick([
        `${teamName(userTeam)} Fall Short Against ${teamName(opp)}, ${oScore}-${uScore}`,
        `${teamName(opp)} Top ${teamName(userTeam)} ${oScore}-${uScore}`,
      ]);
    }
    candidates.push({ priority: 76, type: 'user_game', headlineText: text, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}`, isUserHeadline: true });
  }

  // Default if nothing special happened
  if (candidates.length === 0) {
    candidates.push({ priority: 20, type: 'default', headlineText: `${teamName(winner)} Top ${teamName(loser)} ${Math.max(result.homeScore, result.awayScore)}-${Math.min(result.homeScore, result.awayScore)}`, subText: `${teamAbbr(result.awayTeam)} ${result.awayScore}, ${teamAbbr(result.homeTeam)} ${result.homeScore}` });
  }

  return candidates.map(c => ({ ...c, gameId: result.id, teams: { away: result.awayTeam, home: result.homeTeam } }));
}

// Generate a full newspaper from a day's completed games.
export function generateNewspaper(gameResults, dayNumber, gameDate, userTeam, seasonId) {
  if (!gameResults || gameResults.length === 0) return null;

  const allCandidates = [];
  for (const result of gameResults) {
    allCandidates.push(...analyzeGame(result, userTeam));
  }
  allCandidates.sort((a, b) => b.priority - a.priority);

  // Main headline = highest priority
  const mainHeadline = allCandidates[0];

  // Build secondary headlines: one per game, user team always included
  const usedGameIds = new Set([mainHeadline.gameId]);
  const secondaryHeadlines = [];

  const userHeadline = allCandidates.find(c => c.isUserHeadline && c.gameId !== mainHeadline.gameId);
  if (userHeadline) {
    secondaryHeadlines.push(userHeadline);
    usedGameIds.add(userHeadline.gameId);
  }

  for (const candidate of allCandidates) {
    if (secondaryHeadlines.length >= 6) break;
    if (candidate === mainHeadline) continue;
    if (secondaryHeadlines.includes(candidate)) continue;
    if (usedGameIds.has(candidate.gameId)) continue;
    secondaryHeadlines.push(candidate);
    usedGameIds.add(candidate.gameId);
  }

  // Fill if not enough
  for (const candidate of allCandidates) {
    if (secondaryHeadlines.length >= 4) break;
    if (candidate === mainHeadline) continue;
    if (secondaryHeadlines.includes(candidate)) continue;
    secondaryHeadlines.push(candidate);
  }

  const userResult = gameResults.find(r => r.awayTeam === userTeam || r.homeTeam === userTeam) || null;

  return {
    id: `${seasonId}-${dayNumber}`,
    seasonId,
    dayNumber,
    gameDate,
    mainHeadline,
    secondaryHeadlines: secondaryHeadlines.slice(0, 6),
    userTeamResult: userResult,
    weekNumber: dayNumber % 7 === 0 ? Math.floor(dayNumber / 7) : null,
  };
}

// Save newspaper to localStorage archive
export function saveNewspaperArchive(newspaper) {
  if (!newspaper) return;
  try {
    const key = `newspaper_${newspaper.seasonId}_${newspaper.dayNumber}`;
    localStorage.setItem(key, JSON.stringify({
      dayNumber: newspaper.dayNumber,
      gameDate: newspaper.gameDate,
      mainHeadline: newspaper.mainHeadline,
      secondaryHeadlines: newspaper.secondaryHeadlines,
    }));
  } catch (e) { /* non-fatal */ }
}

// Load newspaper archive list for a season
export function loadNewspaperArchiveList(seasonId) {
  const archives = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`newspaper_${seasonId}_`)) {
        const data = JSON.parse(localStorage.getItem(key));
        archives.push(data);
      }
    }
    archives.sort((a, b) => b.dayNumber - a.dayNumber);
  } catch (e) { /* non-fatal */ }
  return archives;
}