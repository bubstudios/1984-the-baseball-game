// ═══════════════════════════════════════════════════════════════
// SEASON TRANSACTION LOG
// Records all season events: injuries, suspensions, trades, awards,
// clinches, ejections, milestones. Gives the season its history.
// ═══════════════════════════════════════════════════════════════

import { base44 } from '@/api/base44Client';

const TOTAL_SEASON_GAMES = 162;

// ── Record a single transaction ──

export async function recordTransaction(seasonId, entry) {
  try {
    return await base44.entities.SeasonTransaction.create({
      seasonId,
      gameDate: entry.gameDate || null,
      gameDay: entry.gameDay || null,
      type: entry.type,
      teamKey: entry.teamKey || null,
      headline: entry.headline,
      details: entry.details || null,
      playerName: entry.playerName || null,
      awardType: entry.awardType || null,
    });
  } catch (e) {
    console.error('[transactionLog] Failed to record:', entry.type, e);
    return null;
  }
}

// ── Convenience recorders ──

export async function recordInjuryTxn(seasonId, injury) {
  return recordTransaction(seasonId, {
    gameDate: injury.gameDate,
    gameDay: injury.startedOnGameDay,
    type: 'injury',
    teamKey: injury.teamKey,
    playerName: injury.playerName,
    headline: `${injury.playerName} placed on ${getDLLabel(injury.severity)}`,
    details: `${injury.injuryType} (${injury.severity.replace(/_/g, ' ')})${injury.gamesRemaining ? `, expected back in ~${injury.gamesRemaining} games` : ''}`,
  });
}

export async function recordReturnFromInjuryTxn(seasonId, injury) {
  return recordTransaction(seasonId, {
    gameDate: injury.recoveredOnDate || injury.gameDate,
    type: 'return_from_injury',
    teamKey: injury.teamKey,
    playerName: injury.playerName,
    headline: `${injury.playerName} returns from injury`,
    details: `${injury.injuryType} - cleared to play`,
  });
}

export async function recordSuspensionTxn(seasonId, suspension) {
  const name = suspension.playerName || suspension.managerName;
  return recordTransaction(seasonId, {
    gameDate: suspension.gameDate || suspension.startedOnDate,
    gameDay: suspension.startedOnGameDay,
    type: suspension.managerName ? 'manager_suspension' : 'suspension',
    teamKey: suspension.teamKey,
    playerName: name,
    headline: `${name} suspended ${suspension.suspensionGames} game${suspension.suspensionGames !== 1 ? 's' : ''}`,
    details: suspension.suspensionReason || suspension.ejectionReason || 'Disciplinary action',
  });
}

export async function recordReturnFromSuspensionTxn(seasonId, suspension, resolvedDate) {
  const name = suspension.playerName || suspension.managerName;
  return recordTransaction(seasonId, {
    gameDate: resolvedDate || suspension.resolvedOnDate,
    type: suspension.managerName ? 'return_from_manager_suspension' : 'return_from_suspension',
    teamKey: suspension.teamKey,
    playerName: name,
    headline: `${name} returns from suspension`,
    details: 'Suspension served',
  });
}

export async function recordTradeTxn(seasonId, trade, gameDate) {
  const teamA = trade.teamA;
  const teamB = trade.teamB;
  const getsA = (trade.teamAGets || []).map(p => p.name).join(', ');
  const getsB = (trade.teamBGets || []).map(p => p.name).join(', ');
  return recordTransaction(seasonId, {
    gameDate,
    type: 'trade',
    teamKey: trade.isUserTrade ? teamA : null,
    headline: `${teamA.toUpperCase()} acquire ${getsA}`,
    details: `Sent ${getsB} to ${teamB.toUpperCase()}. ${trade.explanation || ''}`.trim(),
  });
}

export async function recordAllStarSelectionTxn(seasonId, teamKey, playerName, league, gameDate) {
  return recordTransaction(seasonId, {
    gameDate,
    type: 'allstar_selection',
    teamKey,
    playerName,
    headline: `${playerName} named ${league} All-Star`,
    details: `${league} All-Star roster announced`,
  });
}

export async function recordAwardTxn(seasonId, award) {
  return recordTransaction(seasonId, {
    gameDate: award.awardDate || '1984-10-01',
    type: 'award_winner',
    teamKey: award.team,
    playerName: award.winner,
    awardType: award.awardType,
    headline: `${award.winner} wins ${formatAwardType(award.awardType)}`,
    details: award.statLine || award.stats?.statLine || '',
  });
}

export async function recordClinchTxn(seasonId, teamKey, division, gameDate) {
  return recordTransaction(seasonId, {
    gameDate,
    type: 'postseason_clinch',
    teamKey,
    headline: `${teamKey.toUpperCase()} clinch ${division}`,
    details: 'Division title secured',
  });
}

export async function recordEliminationTxn(seasonId, teamKey, gameDate) {
  return recordTransaction(seasonId, {
    gameDate,
    type: 'elimination',
    teamKey,
    headline: `${teamKey.toUpperCase()} eliminated from postseason race`,
    details: 'Mathematically eliminated',
  });
}

export async function recordEjectionTxn(seasonId, ejection) {
  const isManager = !ejection.playerPos || ejection.playerPos === 'MGR';
  return recordTransaction(seasonId, {
    gameDate: ejection.gameDate,
    type: isManager ? 'manager_ejection' : 'player_ejection',
    teamKey: ejection.teamKey,
    playerName: ejection.playerName,
    headline: `${ejection.playerName} ejected`,
    details: formatEjectionReason(ejection.ejectionReason),
  });
}

// ── Querying ──

export async function getTransactions(seasonId, limit = 200) {
  try {
    return await base44.entities.SeasonTransaction.filter(
      { seasonId }, '-gameDay', limit
    );
  } catch (e) {
    return [];
  }
}

export async function getRecentTransactions(seasonId, count = 20) {
  return getTransactions(seasonId, count);
}

export async function getTransactionsByType(seasonId, type) {
  try {
    return await base44.entities.SeasonTransaction.filter(
      { seasonId, type }, '-gameDay', 200
    );
  } catch (e) {
    return [];
  }
}

export async function getTeamTransactions(seasonId, teamKey) {
  try {
    return await base44.entities.SeasonTransaction.filter(
      { seasonId, teamKey }, '-gameDay', 200
    );
  } catch (e) {
    return [];
  }
}

// ── Formatting helpers ──

function getDLLabel(severity) {
  const map = {
    minor: 'day-to-day',
    day_to_day: 'day-to-day',
    '15_day': '15-day IL',
    '60_day': '60-day IL',
    season_ending: '60-day IL',
    pregame_scratch: 'scratch list',
  };
  return map[severity] || 'injured list';
}

function formatAwardType(type) {
  const map = {
    MVP: 'MVP',
    CyYoung: 'Cy Young',
    ROY: 'Rookie of the Year',
    FiremanOfTheYear: 'Fireman of the Year',
    ManagerOfTheYear: 'Manager of the Year',
    PlayerOfTheWeek: 'Player of the Week',
    PitcherOfTheWeek: 'Pitcher of the Week',
    PlayerOfTheMonth: 'Player of the Month',
    PitcherOfTheMonth: 'Pitcher of the Month',
    RookieOfTheWeek: 'Rookie of the Week',
    RookieOfTheMonth: 'Rookie of the Month',
  };
  return map[type] || type;
}

function formatEjectionReason(reason) {
  const map = {
    hbp_after_warning: 'Hit batter after warnings',
    obvious_retaliation: 'Obvious retaliation',
    arguing_strikes: 'Arguing called strikes',
    arguing_call: 'Arguing a call',
    charging_mound: 'Charging the mound',
    fight_participant: 'Fight participant',
    bench_clearing_major: 'Bench-clearing incident',
  };
  return map[reason] || reason || 'Ejected';
}