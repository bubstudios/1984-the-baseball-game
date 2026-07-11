// ═══════════════════════════════════════════════════════════════
// DIVISION CLINCHING & MAGIC NUMBER LOGIC
// Computes magic numbers, elimination numbers, and detects clinches.
// ═══════════════════════════════════════════════════════════════

import { getDivision } from './seasonSchedule';
import { TEAMS } from './gameData';
import { recordClinchTxn, recordEliminationTxn } from './transactionLog';

const TOTAL_GAMES = 162;

/**
 * Calculate magic number for the division leader.
 * Magic Number = (Total Games + 1) - (Leader Wins + 2nd Place Losses)
 * When MN reaches 0, the leader has clinched.
 *
 * @param {object} standings - deriveStandings output: { AL_East: [...], ... }
 * @param {string} division - Division key (e.g. 'NL_East')
 * @returns {object|null} { teamKey, magicNumber, gamesBack2nd, leaderWins, leaderLosses }
 */
export function calculateMagicNumber(standings, division) {
  const div = standings?.[division];
  if (!div || div.length < 2) return null;

  const sorted = [...div].sort((a, b) => b.w - a.w || a.l - b.l);
  const leader = sorted[0];
  const second = sorted[1];

  if (!leader || leader.w === undefined) return null;

  const magicNumber = (TOTAL_GAMES + 1) - (leader.w + second.l);

  return {
    teamKey: leader.teamKey,
    magicNumber: Math.max(0, magicNumber),
    gamesBack2nd: second.gb || 0,
    leaderWins: leader.w,
    leaderLosses: leader.l,
    leaderGamesPlayed: leader.w + leader.l,
    leaderGamesRemaining: TOTAL_GAMES - (leader.w + leader.l),
    clinched: magicNumber <= 0,
  };
}

/**
 * Calculate elimination number for a trailing team.
 * Elimination Number = (Total Games + 1) - (Leader Wins + Team Losses)
 * When EN reaches 0, the team is eliminated.
 *
 * @param {object} standings
 * @param {string} division
 * @param {string} teamKey
 * @returns {object|null} { eliminationNumber, eliminated, gamesBack, leaderTeamKey }
 */
export function calculateEliminationNumber(standings, division, teamKey) {
  const div = standings?.[division];
  if (!div) return null;

  const sorted = [...div].sort((a, b) => b.w - a.w || a.l - b.l);
  const leader = sorted[0];
  const team = div.find(t => t.teamKey === teamKey);

  if (!leader || !team) return null;
  if (leader.teamKey === teamKey) {
    return {
      eliminationNumber: null,
      eliminated: false,
      gamesBack: 0,
      leaderTeamKey: teamKey,
      isLeader: true,
    };
  }

  const eliminationNumber = (TOTAL_GAMES + 1) - (leader.w + team.l);

  return {
    eliminationNumber: Math.max(0, eliminationNumber),
    eliminated: eliminationNumber <= 0,
    gamesBack: team.gb || 0,
    leaderTeamKey: leader.teamKey,
    isLeader: false,
  };
}

/**
 * Check all divisions for new clinches and eliminations.
 * Returns arrays of newly clinched teams and newly eliminated teams.
 * Also records transactions if seasonId is provided.
 *
 * @param {object} standings
 * @param {object} prevClinchStatus - { [teamKey]: 'clinched' | 'eliminated' | null }
 * @param {string} seasonId - for recording transactions
 * @param {string} gameDate - for transaction dates
 * @returns {object} { clinches: [], eliminations: [], newStatus: {} }
 */
export async function checkClinchesAndEliminations(standings, prevClinchStatus = {}, seasonId = null, gameDate = null) {
  const clinches = [];
  const eliminations = [];
  const newStatus = { ...prevClinchStatus };

  const divisions = Object.keys(standings || {});

  for (const division of divisions) {
    const div = standings[division];
    if (!div || div.length === 0) continue;
    const divLabel = formatDivisionLabel(division);

    // Check clinch for leader
    const mn = calculateMagicNumber(standings, division);
    if (mn && mn.clinched && newStatus[mn.teamKey] !== 'clinched') {
      newStatus[mn.teamKey] = 'clinched';
      clinches.push({ teamKey: mn.teamKey, division, divisionLabel: divLabel });
      if (seasonId) {
        await recordClinchTxn(seasonId, mn.teamKey, divLabel, gameDate);
      }
    }

    // Check elimination for non-leaders
    for (const team of div) {
      if (team.teamKey === mn?.teamKey) continue;
      const en = calculateEliminationNumber(standings, division, team.teamKey);
      if (en && en.eliminated && newStatus[team.teamKey] !== 'eliminated') {
        newStatus[team.teamKey] = 'eliminated';
        eliminations.push({ teamKey: team.teamKey, division, divisionLabel: divLabel });
        if (seasonId) {
          await recordEliminationTxn(seasonId, team.teamKey, gameDate);
        }
      }
    }
  }

  return { clinches, eliminations, newStatus };
}

/**
 * Get clinch status display data for a single team.
 * Returns magic number, elimination number, or '-' depending on standings.
 */
export function getTeamClinchStatus(standings, teamKey) {
  const division = getDivision(teamKey);
  if (!division || !standings?.[division]) return null;

  const mn = calculateMagicNumber(standings, division);
  const en = calculateEliminationNumber(standings, division, teamKey);

  if (mn && mn.teamKey === teamKey) {
    // Team is the leader
    if (mn.clinched) {
      return { type: 'clinched', label: 'CLINCHED', magicNumber: 0 };
    }
    return {
      type: 'magic_number',
      label: `Magic #: ${mn.magicNumber}`,
      magicNumber: mn.magicNumber,
      gamesRemaining: mn.leaderGamesRemaining,
    };
  }

  if (en && en.eliminated) {
    return { type: 'eliminated', label: 'ELIMINATED', eliminationNumber: 0 };
  }

  if (en && !en.isLeader && en.eliminationNumber !== null) {
    return {
      type: 'elimination_number',
      label: `Elim #: ${en.eliminationNumber}`,
      eliminationNumber: en.eliminationNumber,
      gamesBack: en.gamesBack,
    };
  }

  return null;
}

function formatDivisionLabel(division) {
  const map = {
    AL_East: 'AL East',
    AL_West: 'AL West',
    NL_East: 'NL East',
    NL_West: 'NL West',
  };
  return map[division] || division;
}