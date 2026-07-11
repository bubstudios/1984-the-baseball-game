// tradeDeadline.js - August 30 Trade Deadline system for Season Mode.
// AI-generated trades only (user never manually creates trades).
// Trades happen between Aug 30 games and Sept 1 games.

import { TEAMS } from './gameData';
import { DIVISIONS, getDivision, getLeague } from './seasonSchedule';

// ── Position / Role classification ──
const INFIELD = new Set(['1B', '2B', '3B', 'SS']);
const OUTFIELD = new Set(['LF', 'CF', 'RF']);

// Returns a role category for role-matching in trades.
// SP, RP (includes CL), C, IF, OF, DH
export function getRoleCategory(player) {
  const pos = player.assignedPos || player.pos || '';
  if (pos === 'SP') return 'SP';
  if (pos === 'RP' || pos === 'CL') return 'RP';
  if (pos === 'C') return 'C';
  if (INFIELD.has(pos)) return 'IF';
  if (OUTFIELD.has(pos)) return 'OF';
  if (pos === 'DH') return 'DH';
  // Multi-position bench (e.g. "C/3B", "1B/3B", "OF/1B")
  if (pos.includes('/')) {
    const parts = pos.split('/');
    if (parts.includes('C')) return 'C';
    if (parts.some(p => INFIELD.has(p))) return 'IF';
    if (parts.some(p => OUTFIELD.has(p))) return 'OF';
  }
  return 'IF';
}

// Roles are compatible if they're the same category.
// DH can swap with IF (both are corner/bat-first roles).
function rolesCompatible(roleA, roleB) {
  if (roleA === roleB) return true;
  if ((roleA === 'DH' && roleB === 'IF') || (roleA === 'IF' && roleB === 'DH')) return true;
  return false;
}

// ── Team status classification ──
// CONTENDER: 1st place, within 6 GB, or .520+
// BUBBLE: 6.5-10 GB or .475-.519
// SELLER: >10 GB or <.475
export function classifyTeamStatus(teamKey, standingsData) {
  const div = getDivision(teamKey);
  if (!div || !standingsData || !standingsData[div]) return 'BUBBLE';
  const divStandings = standingsData[div];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  if (!teamRow) return 'BUBBLE';

  const gb = teamRow.gb ?? 99;
  const pct = teamRow.pct ?? 0;
  const isFirst = divStandings.indexOf(teamRow) === 0;

  if (isFirst || gb <= 6.0 || pct >= 0.520) return 'CONTENDER';
  if (gb > 10.0 || pct < 0.475) return 'SELLER';
  return 'BUBBLE';
}

// ── Player trade value calculation ──
// Combines base ratings + season performance + position/role scarcity.
// Returns a numeric score (roughly 20-120 range).
const POSITION_SCARCITY = {
  'C': 15, 'SS': 12, '2B': 10, 'CF': 10, '3B': 8, '1B': 5, 'LF': 5, 'RF': 5, 'DH': 0, 'OF': 7,
};

const ROLE_BONUS = { 'CL': 15, 'SP': 10, 'RP': 5 };

export function calculatePlayerValue(player, stats) {
  const pos = player.assignedPos || player.pos || '';
  const isPitcher = pos === 'SP' || pos === 'RP' || pos === 'CL';

  if (isPitcher) {
    const base = (player.pitchSpeed || 5) * 2.5 + (player.offSpeed || 5) * 2.5 +
      (player.control || 5) * 3 + (player.stamina || 5) * 2;
    const ip = stats?.inningsPitched || 0;
    const era = stats?.era || 4.50;
    const whip = stats?.whip || 1.40;
    const so = stats?.pitchingStrikeouts || 0;
    const wins = stats?.wins || 0;
    const saves = stats?.saves || 0;
    const seasonBonus = ip * 0.4 + so * 0.15 + wins * 2 + saves * 1.5 - era * 3 - whip * 8;
    const roleBonus = ROLE_BONUS[pos] || 5;
    return Math.max(10, base + seasonBonus + roleBonus);
  }

  // Position player
  const base = (player.contact || 5) * 4 + (player.power || 5) * 3 +
    (player.speed || 5) * 1.5 + (player.defense || 5) * 2 + (player.arm || 5) * 1;
  const avg = stats?.battingAverage || 0.250;
  const hr = stats?.homeRuns || 0;
  const rbi = stats?.rbi || 0;
  const sb = stats?.stolenBases || 0;
  const seasonBonus = avg * 200 + hr * 1.5 + rbi * 0.3 + sb * 0.5;
  const scarcity = POSITION_SCARCITY[pos] || POSITION_SCARCITY[player.pos] || 5;
  return Math.max(10, base + seasonBonus + scarcity);
}

// ── Team needs evaluation ──
// Returns array of need objects: { type, role, position, priority, reason }
export function evaluateTeamNeeds(teamKey, statsMap) {
  const team = TEAMS[teamKey];
  if (!team) return [];
  const needs = [];

  // Bullpen L/R balance
  const bullpen = team.bullpen || [];
  const leftyRPs = bullpen.filter(p => p.throws === 'L' && (p.pos === 'RP' || p.pos === 'CL'));
  if (leftyRPs.length < 2) {
    needs.push({
      type: 'LH_RELIEVER', role: 'RP', position: null,
      priority: leftyRPs.length === 0 ? 'HIGH' : 'MEDIUM',
      reason: `Only ${leftyRPs.length} left-handed reliever${leftyRPs.length === 1 ? '' : 's'}`,
    });
  }

  // Weakest starting position player (by OPS)
  const lineup = team.lineup || [];
  for (const player of lineup) {
    const pos = player.assignedPos || player.pos;
    if (['SP', 'RP', 'CL'].includes(pos)) continue;
    const stats = statsMap[`${teamKey}|${player.name}`];
    const obp = stats?.onBasePercentage || 0;
    const slg = stats?.sluggingPercentage || 0;
    const ops = obp + slg;
    const ab = stats?.atBats || 0;
    // Only flag if they have enough ABs to be a real weakness
    if (ab >= 100 && ops < 0.650) {
      const role = getRoleCategory(player);
      needs.push({
        type: 'POSITION_UPGRADE', role, position: pos,
        priority: ops < 0.600 ? 'HIGH' : 'MEDIUM',
        reason: `${pos} OPS ${ops.toFixed(3)} needs upgrade`,
        minValue: calculatePlayerValue(player, stats) - 5,
      });
    }
  }

  // Rotation weakness (worst ERA starter with enough IP)
  const rotation = team.rotation || [];
  let worstSP = null;
  let worstERA = 0;
  for (const sp of rotation) {
    const stats = statsMap[`${teamKey}|${sp.name}`];
    const ip = stats?.inningsPitched || 0;
    const era = stats?.era || 0;
    if (ip >= 50 && era > worstERA) {
      worstERA = era;
      worstSP = { player: sp, era, stats };
    }
  }
  if (worstSP && worstERA > 4.50) {
    needs.push({
      type: 'SP_UPGRADE', role: 'SP', position: null,
      priority: worstERA > 5.00 ? 'HIGH' : 'MEDIUM',
      reason: `5th starter ERA ${worstERA.toFixed(2)}`,
      minValue: calculatePlayerValue(worstSP.player, worstSP.stats) - 5,
    });
  }

  // Bench bat weakness (bench player with poor contact)
  const bench = team.bench || [];
  const weakBench = bench.filter(p => (p.contact || 5) <= 3 && !['SP', 'RP', 'CL'].includes(p.pos));
  if (weakBench.length > 0) {
    needs.push({
      type: 'BENCH_BAT', role: getRoleCategory(weakBench[0]), position: null,
      priority: 'LOW',
      reason: 'Bench hitting could improve',
    });
  }

  return needs;
}

// ── Find a player on the buyer's team to offer in return ──
// Must be: same role category, not the best player at that role,
// fair value (within tolerance of target), and the team can spare them.
function findOfferForTrade(buyerTeamKey, sellerPlayer, sellerStats, buyerNeed, statsMap, userTeam, isUserTeam) {
  const team = TEAMS[buyerTeamKey];
  const sellerRole = getRoleCategory(sellerPlayer);
  const sellerValue = calculatePlayerValue(sellerPlayer, sellerStats);

  // Gather all players in the same role category from the buyer
  const candidates = [];
  const checkPool = (pool, isLineup) => {
    for (const p of pool) {
      const pos = p.assignedPos || p.pos;
      if (['SP', 'RP', 'CL'].includes(pos) && sellerRole !== 'SP' && sellerRole !== 'RP') continue;
      const role = getRoleCategory(p);
      if (!rolesCompatible(role, sellerRole)) continue;
      const stats = statsMap[`${buyerTeamKey}|${p.name}`];
      const value = calculatePlayerValue(p, stats);
      candidates.push({ player: p, value, stats, role, isLineup });
    }
  };
  checkPool(team.lineup || [], true);
  checkPool(team.bench || [], false);
  if (sellerRole === 'SP') checkPool(team.rotation || [], false);
  if (sellerRole === 'RP') checkPool(team.bullpen || [], false);

  if (candidates.length === 0) return null;

  // Sort by value closest to seller's value (fair match)
  candidates.sort((a, b) => {
    const aDiff = Math.abs(a.value - sellerValue);
    const bDiff = Math.abs(b.value - sellerValue);
    return aDiff - bDiff;
  });

  // Fairness tolerance: 25% for 1-for-1, tighter (15%) for user's team
  const tolerance = isUserTeam ? 0.15 : 0.25;

  for (const candidate of candidates) {
    // Skip the best player at this role (don't gut the team)
    const sameRolePlayers = candidates.filter(c => c.role === candidate.role);
    if (sameRolePlayers.length > 1) {
      const maxValue = Math.max(...sameRolePlayers.map(c => c.value));
      // Don't trade away your best player at a role unless you have 3+ at that role
      if (candidate.value === maxValue && sameRolePlayers.length < 4) continue;
    }

    // Fairness check
    const diff = Math.abs(candidate.value - sellerValue);
    const maxVal = Math.max(candidate.value, sellerValue);
    if (maxVal > 0 && diff / maxVal > tolerance) continue;

    // Roster depth check: can the buyer spare this player?
    if (!canSparePlayer(buyerTeamKey, candidate.player, sellerRole)) continue;

    // For user's team: never trade the overall best player
    if (isUserTeam) {
      const allPlayers = [...(team.lineup || []), ...(team.bench || [])];
      const bestPlayer = allPlayers.reduce((best, p) => {
        const v = calculatePlayerValue(p, statsMap[`${buyerTeamKey}|${p.name}`]);
        return v > best.v ? { p, v } : best;
      }, { p: null, v: 0 });
      if (candidate.player.name === bestPlayer.p?.name) continue;
    }

    return candidate;
  }

  return null;
}

// Check if a team can spare a player at a given role
function canSparePlayer(teamKey, player, role) {
  const team = TEAMS[teamKey];
  if (role === 'C') {
    // Must have at least 2 catchers (1 starter + 1 backup)
    const catchers = [...(team.lineup || []), ...(team.bench || [])].filter(p =>
      (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
    );
    if (catchers.length <= 2) return false;
  }
  if (role === 'SP') {
    // Must have at least 4 starters
    if ((team.rotation || []).length <= 4) return false;
  }
  if (role === 'RP') {
    // Must have at least 5 bullpen arms
    if ((team.bullpen || []).length <= 5) return false;
  }
  return true;
}

// ── Trade generation ──
// Orchestrates the full trade deadline. Returns array of trade objects.
export function generateTradeDeadline(standingsData, statsMap, userTeam) {
  const teamKeys = Object.keys(TEAMS).filter(k => !k.includes('ALLSTAR'));
  const statuses = {};
  for (const tk of teamKeys) {
    statuses[tk] = classifyTeamStatus(tk, standingsData);
  }

  const contenders = teamKeys.filter(tk => statuses[tk] === 'CONTENDER');
  const sellers = teamKeys.filter(tk => statuses[tk] === 'SELLER');
  const bubbles = teamKeys.filter(tk => statuses[tk] === 'BUBBLE');

  // Evaluate needs for contenders and bubble teams
  const teamNeeds = {};
  for (const tk of [...contenders, ...bubbles]) {
    teamNeeds[tk] = evaluateTeamNeeds(tk, statsMap);
  }

  const trades = [];
  const teamsThatTraded = new Set();
  const playersTraded = new Set(); // global no-duplicate guard

  // Sort contenders by number of needs (most needy first)
  contenders.sort((a, b) => (teamNeeds[b]?.length || 0) - (teamNeeds[a]?.length || 0));

  // Bubble teams rarely trade, but check them after contenders
  const buyers = [...contenders, ...bubbles.filter(tk => Math.random() < 0.3)];

  for (const buyerKey of buyers) {
    if (teamsThatTraded.has(buyerKey)) continue;
    if (trades.length >= 14) break;

    const needs = teamNeeds[buyerKey] || [];
    if (needs.length === 0) continue;

    const isUserTeam = buyerKey === userTeam;

    // Sort needs by priority
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    needs.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

    for (const need of needs) {
      if (trades.length >= 14) break;
      if (teamsThatTraded.has(buyerKey)) break;

      // Find sellers with players matching this need
      for (const sellerKey of sellers) {
        if (teamsThatTraded.has(sellerKey)) continue;
        if (trades.length >= 14) break;

        const match = findTradeMatch(buyerKey, sellerKey, need, statsMap, userTeam, isUserTeam, playersTraded);
        if (match) {
          trades.push(match);
          teamsThatTraded.add(buyerKey);
          teamsThatTraded.add(sellerKey);
          match.teamAGets.forEach(p => playersTraded.add(p.name));
          match.teamBGets.forEach(p => playersTraded.add(p.name));
          break;
        }
      }
    }
  }

  // Enforce minimum: if fewer than 3 trades, that's OK (no forced bad trades)
  return trades;
}

// Find a specific trade match between a buyer and seller for a need
function findTradeMatch(buyerKey, sellerKey, need, statsMap, userTeam, isUserTeam, playersTraded) {
  const sellerTeam = TEAMS[sellerKey];
  if (!sellerTeam) return null;

  // Find players on the seller matching the need's role
  const sellerCandidates = [];
  const scanPool = (pool, isLineup) => {
    for (const p of pool) {
      if (playersTraded.has(p.name)) continue;
      const role = getRoleCategory(p);
      if (!rolesCompatible(role, need.role)) continue;

      // For LH_RELIEVER need, only match lefty throwers
      if (need.type === 'LH_RELIEVER' && p.throws !== 'L') continue;

      const stats = statsMap[`${sellerKey}|${p.name}`];
      const value = calculatePlayerValue(p, stats);
      sellerCandidates.push({ player: p, value, stats, role, isLineup });
    }
  };
  scanPool(sellerTeam.lineup || [], true);
  scanPool(sellerTeam.bench || [], false);
  if (need.role === 'SP') scanPool(sellerTeam.rotation || [], false);
  if (need.role === 'RP') scanPool(sellerTeam.bullpen || [], false);

  if (sellerCandidates.length === 0) return null;

  // Sort seller candidates by value (best match for the need first)
  sellerCandidates.sort((a, b) => b.value - a.value);

  for (const sellerCandidate of sellerCandidates) {
    // Check seller can spare this player
    if (!canSparePlayer(sellerKey, sellerCandidate.player, sellerCandidate.role)) continue;

    // Find a buyer player to offer in return
    const offer = findOfferForTrade(buyerKey, sellerCandidate.player, sellerCandidate.stats, need, statsMap, userTeam, isUserTeam);
    if (!offer) continue;

    // Final fairness check (both directions)
    const tolerance = isUserTeam ? 0.15 : 0.25;
    const diff = Math.abs(offer.value - sellerCandidate.value);
    const maxVal = Math.max(offer.value, sellerCandidate.value);
    if (maxVal > 0 && diff / maxVal > tolerance) continue;

    // Generate the trade object
    const trade = {
      teamA: buyerKey,
      teamB: sellerKey,
      teamAGets: [{
        name: sellerCandidate.player.name,
        pos: sellerCandidate.player.assignedPos || sellerCandidate.player.pos,
        throws: sellerCandidate.player.throws,
        bats: sellerCandidate.player.bats,
        role: sellerCandidate.role,
        value: Math.round(sellerCandidate.value),
        stats: formatStatsForDisplay(sellerCandidate.player, sellerCandidate.stats),
      }],
      teamBGets: [{
        name: offer.player.name,
        pos: offer.player.assignedPos || offer.player.pos,
        throws: offer.player.throws,
        bats: offer.player.bats,
        role: offer.role,
        value: Math.round(offer.value),
        stats: formatStatsForDisplay(offer.player, offer.stats),
      }],
      explanation: generateTradeExplanation(buyerKey, sellerKey, sellerCandidate, offer, need),
      needAddressed: need.reason,
    };

    return trade;
  }

  return null;
}

// Format player stats for the trade card display
function formatStatsForDisplay(player, stats) {
  const pos = player.assignedPos || player.pos || '';
  const isPitcher = pos === 'SP' || pos === 'RP' || pos === 'CL';
  if (isPitcher) {
    return {
      label: `${pos} ${player.throws === 'L' ? 'LHP' : 'RHP'}`,
      era: stats?.era ? stats.era.toFixed(2) : '—',
      whip: stats?.whip ? stats.whip.toFixed(2) : '—',
      ip: stats?.inningsPitched ? stats.inningsPitched.toFixed(1) : '0',
      w: stats?.wins || 0,
      sv: stats?.saves || 0,
      k: stats?.pitchingStrikeouts || 0,
    };
  }
  return {
    label: `${pos} ${player.bats === 'L' ? 'LHB' : player.bats === 'S' ? 'SH' : 'RHB'}`,
    avg: stats?.battingAverage ? stats.battingAverage.toFixed(3).replace(/^0\./, '.') : '—',
    hr: stats?.homeRuns || 0,
    rbi: stats?.rbi || 0,
    ops: stats?.ops ? stats.ops.toFixed(3).replace(/^0\./, '.') : '—',
    sb: stats?.stolenBases || 0,
  };
}

// Generate a short AI explanation for the trade
function generateTradeExplanation(buyerKey, sellerKey, sellerCandidate, offer, need) {
  const buyerName = TEAMS[buyerKey]?.name || buyerKey;
  const sellerName = TEAMS[sellerKey]?.name || sellerKey;
  const buyerCity = TEAMS[buyerKey]?.city || '';
  const sellerCity = TEAMS[sellerKey]?.city || '';

  let buyerContext = '';
  if (need.type === 'LH_RELIEVER') {
    buyerContext = `${buyerCity} ${buyerName}, bolstering their bullpen for the stretch run, added a left-handed relief option.`;
  } else if (need.type === 'SP_UPGRADE') {
    buyerContext = `${buyerCity} ${buyerName}, looking to solidify their rotation down the stretch, acquired starting pitching depth.`;
  } else if (need.type === 'POSITION_UPGRADE') {
    buyerContext = `${buyerCity} ${buyerName}, addressing a weak spot at ${need.position}, brought in an upgrade.`;
  } else if (need.type === 'BENCH_BAT') {
    buyerContext = `${buyerCity} ${buyerName}, looking to strengthen their bench for the playoff push, added a bat.`;
  } else {
    buyerContext = `${buyerCity} ${buyerName} made a move to improve their roster.`;
  }

  const sellerContext = `${sellerCity} ${sellerName}, out of contention, received a fair return in ${offer.player.name.split(' ').pop()}.`;

  return `${buyerContext} ${sellerContext}`;
}

// ── Apply trades to the TEAMS object (in-place mutation) ──
// Swaps players between teams' roster arrays.
export function applyTrades(trades) {
  if (!trades || trades.length === 0) return;

  for (const trade of trades) {
    // teamA gets trade.teamAGets (from teamB), teamB gets trade.teamBGets (from teamA)
    for (const playerInfo of trade.teamAGets) {
      movePlayerBetweenTeams(trade.teamB, trade.teamA, playerInfo.name);
    }
    for (const playerInfo of trade.teamBGets) {
      movePlayerBetweenTeams(trade.teamA, trade.teamB, playerInfo.name);
    }

    // Repair both teams' rosters after the swap
    repairRoster(trade.teamA);
    repairRoster(trade.teamB);
  }
}

// Move a player from sourceTeam to destTeam, placing them in the right roster slot
function movePlayerBetweenTeams(sourceKey, destKey, playerName) {
  const sourceTeam = TEAMS[sourceKey];
  const destTeam = TEAMS[destKey];
  if (!sourceTeam || !destTeam) return;

  // Find the player in the source team's roster
  let found = null;
  let foundIn = null;

  for (const arrName of ['lineup', 'bench', 'rotation', 'bullpen']) {
    const arr = sourceTeam[arrName];
    if (!arr) continue;
    const idx = arr.findIndex(p => p.name === playerName);
    if (idx >= 0) {
      found = arr[idx];
      foundIn = arrName;
      arr.splice(idx, 1);
      break;
    }
  }

  if (!found) return;

  // Place in the destination team's corresponding roster slot
  const pos = found.assignedPos || found.pos;

  if (foundIn === 'lineup' && destTeam.lineup) {
    // Try to find a slot with the same position
    const slotIdx = destTeam.lineup.findIndex(p =>
      (p.assignedPos || p.pos) === pos && !['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos)
    );
    if (slotIdx >= 0) {
      // Replace the player in that slot (the displaced player goes to bench)
      const displaced = destTeam.lineup[slotIdx];
      destTeam.lineup[slotIdx] = { ...found, assignedPos: pos, pos };
      if (destTeam.bench && !destTeam.bench.find(p => p.name === displaced.name)) {
        destTeam.bench.push(displaced);
      }
    } else {
      // No matching slot, add to bench
      if (destTeam.bench) destTeam.bench.push(found);
      else destTeam.lineup.push(found);
    }
  } else if (foundIn === 'rotation' || pos === 'SP') {
    if (destTeam.rotation) destTeam.rotation.push(found);
  } else if (foundIn === 'bullpen' || pos === 'RP' || pos === 'CL') {
    if (destTeam.bullpen) destTeam.bullpen.push(found);
  } else {
    // Bench player or fallback
    if (destTeam.bench) destTeam.bench.push(found);
    else if (destTeam.lineup) destTeam.lineup.push(found);
  }
}

// ── Roster validation and repair ──
// Validates that a team has legal rosters after trades. Fixes issues.
export function repairRoster(teamKey) {
  const team = TEAMS[teamKey];
  if (!team) return;

  // Ensure lineup has 9 players
  if (!team.lineup || team.lineup.length < 9) {
    // Pull from bench to fill
    while ((!team.lineup || team.lineup.length < 9) && team.bench && team.bench.length > 0) {
      const bp = team.bench.shift();
      team.lineup = team.lineup || [];
      team.lineup.push({ ...bp, assignedPos: bp.pos });
    }
  }

  // Trim lineup to 9 if somehow too many
  if (team.lineup && team.lineup.length > 9) {
    const extras = team.lineup.slice(9);
    team.lineup = team.lineup.slice(0, 9);
    if (!team.bench) team.bench = [];
    extras.forEach(p => {
      if (!team.bench.find(b => b.name === p.name)) team.bench.push(p);
    });
  }

  // Ensure at least one catcher in lineup+bench
  const allPosition = [...(team.lineup || []), ...(team.bench || [])];
  const hasCatcher = allPosition.some(p =>
    (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
  );
  if (!hasCatcher && team.bench && team.bench.length > 0) {
    // Find a multi-position player who can catch and assign them as C
    const canCatch = team.bench.find(p =>
      (p.pos || '').includes('C') || p.pos === 'C'
    );
    if (canCatch) {
      canCatch.assignedPos = 'C';
    }
  }

  // Ensure rotation has at least 4 starters
  if (!team.rotation || team.rotation.length < 4) {
    // Pull from bullpen (SP-eligible arms)
    const bullpenSPs = (team.bullpen || []).filter(p => p.pos === 'SP' || p.stamina >= 6);
    while ((!team.rotation || team.rotation.length < 4) && bullpenSPs.length > 0) {
      const sp = bullpenSPs.shift();
      const idx = team.bullpen.indexOf(sp);
      if (idx >= 0) team.bullpen.splice(idx, 1);
      team.rotation = team.rotation || [];
      team.rotation.push({ ...sp, pos: 'SP' });
    }
  }

  // Ensure bullpen has at least 5 arms
  if (!team.bullpen || team.bullpen.length < 5) {
    // Pull excess from rotation (if 5+ starters)
    while ((!team.bullpen || team.bullpen.length < 5) && team.rotation && team.rotation.length > 4) {
      const sp = team.rotation.pop();
      team.bullpen = team.bullpen || [];
      team.bullpen.push({ ...sp, pos: 'RP' });
    }
  }

  // Remove any duplicate player names (keep first occurrence)
  const seenNames = new Set();
  for (const arrName of ['lineup', 'bench', 'rotation', 'bullpen']) {
    if (!team[arrName]) continue;
    team[arrName] = team[arrName].filter(p => {
      if (seenNames.has(p.name)) return false;
      seenNames.add(p.name);
      return true;
    });
  }
}

// Validate roster - returns array of error strings (empty = valid)
export function validateRoster(teamKey) {
  const team = TEAMS[teamKey];
  if (!team) return ['Team not found'];

  const errors = [];

  // Check lineup
  if (!team.lineup || team.lineup.length !== 9) {
    errors.push(`Lineup has ${team.lineup?.length || 0} players (expected 9)`);
  }

  // Check catcher
  const allPosition = [...(team.lineup || []), ...(team.bench || [])];
  const hasCatcher = allPosition.some(p =>
    (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
  );
  if (!hasCatcher) errors.push('No catcher on roster');

  // Check rotation
  if (!team.rotation || team.rotation.length < 4) {
    errors.push(`Rotation has ${team.rotation?.length || 0} starters (expected 4+)`);
  }

  // Check bullpen
  if (!team.bullpen || team.bullpen.length < 5) {
    errors.push(`Bullpen has ${team.bullpen?.length || 0} arms (expected 5+)`);
  }

  // Check for duplicates across all arrays
  const allPlayers = [
    ...(team.lineup || []), ...(team.bench || []),
    ...(team.rotation || []), ...(team.bullpen || []),
  ];
  const nameSet = new Set();
  for (const p of allPlayers) {
    if (nameSet.has(p.name)) errors.push(`Duplicate player: ${p.name}`);
    nameSet.add(p.name);
  }

  return errors;
}

// ── Build stats map from PlayerStats records ──
// Returns { "teamKey|playerName": { ...stats } }
export function buildStatsMap(playerStatsRecords) {
  const map = {};
  for (const s of playerStatsRecords || []) {
    map[`${s.team}|${s.playerName}`] = s;
  }
  return map;
}