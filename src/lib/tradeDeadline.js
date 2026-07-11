// tradeDeadline.js - August 30 Trade Deadline system for Season Mode.
// 5-STEP LOCKED LOGIC: Classify -> Identify Needs -> Position Compatibility -> Value/Fairness -> Display Validation
//
// Key rules:
// - A player may only fill a need if his primary/secondary position matches the need slot.
// - 1B does NOT solve 2B. RF does NOT solve CF. DH does NOT exist for NL teams.
// - User-team trades require explicit approval (core players protected).
// - Target 4-10 total trades (not every contender reshuffles).

import { TEAMS } from './gameData';
import { getDivision, getLeague } from './seasonSchedule';

// ── Position utilities ──
const INFIELD = new Set(['1B', '2B', '3B', 'SS']);
const OUTFIELD = new Set(['LF', 'CF', 'RF']);

// Get all positions a player can play (from their pos string, e.g. "C/3B" -> ["C","3B"])
export function getEligiblePositions(player) {
  const posStr = player.pos || player.assignedPos || '';
  if (!posStr) return [];
  return posStr.split('/').map(p => p.trim()).filter(Boolean);
}

// Check if player is DH-only (NL teams cannot acquire these)
function isDHOnly(player) {
  const eligible = getEligiblePositions(player);
  return eligible.length === 1 && eligible[0] === 'DH';
}

// Role category for broad role-matching in offers
export function getRoleCategory(player) {
  const pos = player.assignedPos || player.pos || '';
  if (pos === 'SP') return 'SP';
  if (pos === 'RP' || pos === 'CL') return 'RP';
  if (pos === 'C') return 'C';
  if (INFIELD.has(pos)) return 'IF';
  if (OUTFIELD.has(pos)) return 'OF';
  if (pos === 'DH') return 'DH';
  if (pos.includes('/')) {
    const parts = pos.split('/');
    if (parts.includes('C')) return 'C';
    if (parts.some(p => INFIELD.has(p))) return 'IF';
    if (parts.some(p => OUTFIELD.has(p))) return 'OF';
  }
  return 'IF';
}

// ── STEP 1: Classify every team ──
// CONTENDER: 1st place OR within 5 GB OR .530+
// FRINGE: 5.5-9 GB
// SELLER: 10+ GB or < .480
// NEUTRAL: doesn't fit (rarely trades)
export function classifyTeamStatus(teamKey, standingsData) {
  const div = getDivision(teamKey);
  if (!div || !standingsData || !standingsData[div]) return 'NEUTRAL';
  const divStandings = standingsData[div];
  const teamRow = divStandings.find(t => t.teamKey === teamKey);
  if (!teamRow) return 'NEUTRAL';

  const gb = teamRow.gb ?? 99;
  const pct = teamRow.pct ?? 0;
  const isFirst = divStandings.indexOf(teamRow) === 0;

  if (isFirst || gb <= 5.0 || pct >= 0.530) return 'CONTENDER';
  if (gb >= 10.0 || pct < 0.480) return 'SELLER';
  if (gb >= 5.5) return 'FRINGE';
  return 'NEUTRAL';
}

// ── Value calculation ──
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

  const base = (player.contact || 5) * 4 + (player.power || 5) * 3 +
    (player.speed || 5) * 1.5 + (player.defense || 5) * 2 + (player.arm || 5) * 1;
  const avg = stats?.battingAverage || 0.250;
  const hr = stats?.homeRuns || 0;
  const rbi = stats?.rbi || 0;
  const sb = stats?.stolenBases || 0;
  const obp = stats?.onBasePercentage || 0;
  const slg = stats?.sluggingPercentage || 0;
  const ops = obp + slg;
  // Weight OPS heavily so a .510 OPS player can't match a .794 OPS player
  const seasonBonus = avg * 200 + hr * 1.5 + rbi * 0.3 + sb * 0.5 + ops * 40;
  const scarcity = POSITION_SCARCITY[pos] || POSITION_SCARCITY[player.pos] || 5;
  return Math.max(10, base + seasonBonus + scarcity);
}

// ── STEP 2: Identify exact need slots ──
// Each need has an exact position or an approved broader bucket label.
export function evaluateTeamNeeds(teamKey, statsMap) {
  const team = TEAMS[teamKey];
  if (!team) return [];
  const isNL = getLeague(teamKey) === 'NL';
  const needs = [];

  // LH reliever need
  const bullpen = team.bullpen || [];
  const leftyRPs = bullpen.filter(p => p.throws === 'L' && (p.pos === 'RP' || p.pos === 'CL'));
  if (leftyRPs.length < 2) {
    needs.push({
      type: 'LH_RELIEVER', role: 'RP', position: null,
      priority: leftyRPs.length === 0 ? 'HIGH' : 'MEDIUM',
      reason: `Only ${leftyRPs.length} left-handed reliever${leftyRPs.length === 1 ? '' : 's'}`,
      label: 'left-handed reliever',
    });
  }

  // Position upgrades - EXACT slots from lineup
  const lineup = team.lineup || [];
  for (const player of lineup) {
    const assignedPos = player.assignedPos || player.pos;
    if (!assignedPos || ['SP', 'RP', 'CL', 'DH'].includes(assignedPos)) continue;
    if (assignedPos === 'DH' && isNL) continue;

    const stats = statsMap[`${teamKey}|${player.name}`];
    const obp = stats?.onBasePercentage || 0;
    const slg = stats?.sluggingPercentage || 0;
    const ops = obp + slg;
    const ab = stats?.atBats || 0;
    if (ab >= 80 && ops < 0.650) {
      needs.push({
        type: 'POSITION_UPGRADE', role: getRoleCategory(player), position: assignedPos,
        priority: ops < 0.600 ? 'HIGH' : 'MEDIUM',
        reason: `${assignedPos} OPS ${ops.toFixed(3)} needs upgrade`,
        label: `starting ${assignedPos}`,
        minValue: calculatePlayerValue(player, stats) - 5,
        currentOps: ops,
      });
    }
  }

  // Rotation weakness
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
      label: 'starting pitching',
      minValue: calculatePlayerValue(worstSP.player, worstSP.stats) - 5,
    });
  }

  // Bench bat need (broader bucket)
  const bench = team.bench || [];
  const positionBench = bench.filter(p => !['SP', 'RP', 'CL'].includes(p.pos));
  const weakBench = positionBench.filter(p => (p.contact || 5) <= 4);
  if (weakBench.length > 0) {
    const leftyBench = positionBench.filter(p => p.bats === 'L' || p.bats === 'S');
    if (leftyBench.length === 0) {
      needs.push({
        type: 'LH_BENCH_BAT', role: 'IF', position: null,
        priority: 'LOW',
        reason: 'No left-handed bat on the bench',
        label: 'left-handed bench bat',
      });
    } else {
      needs.push({
        type: 'BENCH_BAT', role: 'IF', position: null,
        priority: 'LOW',
        reason: 'Bench hitting could improve',
        label: 'bench bat',
      });
    }
  }

  // Backup catcher need
  const catchers = [...lineup, ...bench].filter(p =>
    (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
  );
  if (catchers.length < 2) {
    needs.push({
      type: 'BACKUP_CATCHER', role: 'C', position: 'C',
      priority: 'MEDIUM',
      reason: 'Need a backup catcher',
      label: 'backup catcher',
    });
  }

  return needs;
}

// ── STEP 3: Position compatibility rules (HARD RULES) ──
// A player may only fill a need if his eligible positions match the need.
// 1B does NOT solve 2B. RF does NOT solve CF. DH does NOT exist for NL teams.
function playerFillsNeed(player, need, buyerTeamKey) {
  const eligible = getEligiblePositions(player);
  const isNL = getLeague(buyerTeamKey) === 'NL';

  // NL teams cannot acquire DH-only players
  if (isNL && isDHOnly(player)) return false;

  // Starting pitcher need
  if (need.role === 'SP') {
    return eligible.includes('SP') || player.pos === 'SP';
  }

  // Relief pitcher need
  if (need.role === 'RP') {
    const isRP = eligible.includes('RP') || eligible.includes('CL') || player.pos === 'RP' || player.pos === 'CL';
    if (!isRP) return false;
    if (need.type === 'LH_RELIEVER') return player.throws === 'L';
    return true;
  }

  // Backup catcher
  if (need.type === 'BACKUP_CATCHER') {
    return eligible.includes('C');
  }

  // Exact position upgrade - HARD RULE: player must be able to play that position
  if (need.type === 'POSITION_UPGRADE' && need.position) {
    return eligible.includes(need.position);
  }

  // Broader bucket needs
  if (need.type === 'LH_BENCH_BAT') {
    const isPitcher = eligible.some(p => ['SP', 'RP', 'CL'].includes(p));
    if (isPitcher) return false;
    return player.bats === 'L' || player.bats === 'S';
  }
  if (need.type === 'BENCH_BAT') {
    const isPitcher = eligible.some(p => ['SP', 'RP', 'CL'].includes(p));
    if (isPitcher) return false;
    return true;
  }

  return false;
}

// ── User team protection ──
// Returns set of protected player names for the user's team.
// Protected = current starters, top 3 SP, closer, top 5 hitters.
export function getProtectedPlayers(teamKey, statsMap) {
  const team = TEAMS[teamKey];
  if (!team) return new Set();
  const protectedNames = new Set();

  // All current lineup starters
  for (const p of (team.lineup || [])) {
    protectedNames.add(p.name);
  }

  // Top 3 starters by value
  const starters = (team.rotation || []).map(p => ({
    name: p.name,
    value: calculatePlayerValue(p, statsMap[`${teamKey}|${p.name}`]),
  })).sort((a, b) => b.value - a.value);
  starters.slice(0, 3).forEach(s => protectedNames.add(s.name));

  // Closer
  const closer = (team.bullpen || []).find(p => p.pos === 'CL' || p.assignedPos === 'CL');
  if (closer) protectedNames.add(closer.name);

  // Top 5 hitters by value
  const hitters = (team.lineup || []).filter(p => !['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos))
    .map(p => ({
      name: p.name,
      value: calculatePlayerValue(p, statsMap[`${teamKey}|${p.name}`]),
    })).sort((a, b) => b.value - a.value);
  hitters.slice(0, 5).forEach(h => protectedNames.add(h.name));

  return protectedNames;
}

// ── Find a player on the buyer's team to offer in return ──
// Must be: same role category, not protected (for user team), fair value,
// and the buyer must not get much worse (incoming >= 80% of outgoing).
function findOfferForTrade(buyerTeamKey, sellerPlayer, sellerStats, need, statsMap, isUserTeam, playersTraded) {
  const team = TEAMS[buyerTeamKey];
  const sellerValue = calculatePlayerValue(sellerPlayer, sellerStats);
  const sellerRole = getRoleCategory(sellerPlayer);

  const protectedNames = isUserTeam ? getProtectedPlayers(buyerTeamKey, statsMap) : new Set();

  const candidates = [];
  const checkPool = (pool) => {
    for (const p of pool) {
      if (playersTraded.has(p.name)) continue;
      if (protectedNames.has(p.name)) continue;
      const role = getRoleCategory(p);
      if (role !== sellerRole) continue;
      const stats = statsMap[`${buyerTeamKey}|${p.name}`];
      const value = calculatePlayerValue(p, stats);
      candidates.push({ player: p, value, stats, role });
    }
  };
  checkPool(team.lineup || []);
  checkPool(team.bench || []);
  if (sellerRole === 'SP') checkPool(team.rotation || []);
  if (sellerRole === 'RP') checkPool(team.bullpen || []);

  if (candidates.length === 0) return null;

  // Sort by closest value (fair match)
  candidates.sort((a, b) => Math.abs(a.value - sellerValue) - Math.abs(b.value - sellerValue));

  const tolerance = isUserTeam ? 0.15 : 0.25;

  for (const candidate of candidates) {
    // Fairness check
    const diff = Math.abs(candidate.value - sellerValue);
    const maxVal = Math.max(candidate.value, sellerValue);
    if (maxVal > 0 && diff / maxVal > tolerance) continue;

    // Buyer must not get much worse: incoming >= 80% of outgoing
    if (sellerValue < candidate.value * 0.80) continue;

    // Roster depth check (relaxed for the need position - incoming fills it)
    if (!canSparePlayer(buyerTeamKey, candidate.player, sellerRole, need.position)) continue;

    return candidate;
  }

  return null;
}

// Check if a team can spare a player at a given role
function canSparePlayer(teamKey, player, role, needPosition) {
  const team = TEAMS[teamKey];
  if (role === 'C') {
    const catchers = [...(team.lineup || []), ...(team.bench || [])].filter(p =>
      (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
    );
    if (catchers.length <= 2) return false;
  }
  if (role === 'SP') {
    if ((team.rotation || []).length <= 4) return false;
  }
  if (role === 'RP') {
    if ((team.bullpen || []).length <= 5) return false;
  }
  // Don't trade away the only player at a position, UNLESS the need is at that position
  // (the incoming player fills the same slot)
  const assignedPos = player.assignedPos || player.pos;
  if (assignedPos && !['SP', 'RP', 'CL', 'DH'].includes(assignedPos) && assignedPos !== needPosition) {
    const samePos = [...(team.lineup || []), ...(team.bench || [])].filter(p =>
      getEligiblePositions(p).includes(assignedPos)
    );
    if (samePos.length <= 1) return false;
  }
  return true;
}

// ── STEP 5: Display validation ──
// Verify headline, need, acquired position, and explanation all agree.
function validateTradeDisplay(trade, need) {
  const acquired = trade.teamAGets[0];
  const eligible = getEligiblePositions({ pos: acquired.pos });

  // For position upgrades, acquired player must be able to play the need position
  if (need.type === 'POSITION_UPGRADE' && need.position) {
    if (!eligible.includes(need.position)) return false;
  }
  // For LH reliever, acquired must be a lefty
  if (need.type === 'LH_RELIEVER' && acquired.throws !== 'L') return false;
  // For NL buyers, acquired must not be DH-only
  if (getLeague(trade.teamA) === 'NL' && isDHOnly({ pos: acquired.pos })) return false;
  // For backup catcher, acquired must be able to catch
  if (need.type === 'BACKUP_CATCHER' && !eligible.includes('C')) return false;

  return true;
}

// ── Trade generation ──
export function generateTradeDeadline(standingsData, statsMap, userTeam) {
  const teamKeys = Object.keys(TEAMS).filter(k => !k.includes('ALLSTAR'));
  const statuses = {};
  for (const tk of teamKeys) {
    statuses[tk] = classifyTeamStatus(tk, standingsData);
  }

  const contenders = teamKeys.filter(tk => statuses[tk] === 'CONTENDER');
  const sellers = teamKeys.filter(tk => statuses[tk] === 'SELLER' && tk !== userTeam);
  const fringes = teamKeys.filter(tk => statuses[tk] === 'FRINGE');

  // Evaluate needs for contenders and fringe teams
  const teamNeeds = {};
  for (const tk of [...contenders, ...fringes]) {
    teamNeeds[tk] = evaluateTeamNeeds(tk, statsMap);
  }

  const trades = [];
  const teamsThatTraded = new Set();
  const playersTraded = new Set();

  // Target 4-10 total trades for realism
  const MAX_TRADES = 4 + Math.floor(Math.random() * 7);

  // Sort contenders by number of needs (most needy first)
  contenders.sort((a, b) => (teamNeeds[b]?.length || 0) - (teamNeeds[a]?.length || 0));

  // Fringe teams rarely trade (30% chance to participate as buyers)
  const fringeBuyers = fringes.filter(() => Math.random() < 0.3);
  const buyers = [...contenders, ...fringeBuyers];

  for (const buyerKey of buyers) {
    if (teamsThatTraded.has(buyerKey)) continue;
    if (trades.length >= MAX_TRADES) break;

    const needs = teamNeeds[buyerKey] || [];
    if (needs.length === 0) continue;

    const isUserTeam = buyerKey === userTeam;

    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    needs.sort((a, b) => (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3));

    for (const need of needs) {
      if (trades.length >= MAX_TRADES) break;
      if (teamsThatTraded.has(buyerKey)) break;

      for (const sellerKey of sellers) {
        if (teamsThatTraded.has(sellerKey)) continue;
        if (trades.length >= MAX_TRADES) break;

        const match = findTradeMatch(buyerKey, sellerKey, need, statsMap, isUserTeam, playersTraded);
        if (match) {
          // STEP 5: Display validation - reject if positions don't agree
          if (!validateTradeDisplay(match, need)) continue;

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

  return trades;
}

// Find a specific trade match between a buyer and seller for a need
function findTradeMatch(buyerKey, sellerKey, need, statsMap, isUserTeam, playersTraded) {
  const sellerTeam = TEAMS[sellerKey];
  if (!sellerTeam) return null;

  // STEP 3: Scan seller roster for players who FILL the exact need
  const sellerCandidates = [];
  const scanPool = (pool) => {
    for (const p of pool) {
      if (playersTraded.has(p.name)) continue;
      if (!playerFillsNeed(p, need, buyerKey)) continue;
      const stats = statsMap[`${sellerKey}|${p.name}`];
      const value = calculatePlayerValue(p, stats);
      sellerCandidates.push({ player: p, value, stats, role: getRoleCategory(p) });
    }
  };
  scanPool(sellerTeam.lineup || []);
  scanPool(sellerTeam.bench || []);
  if (need.role === 'SP') scanPool(sellerTeam.rotation || []);
  if (need.role === 'RP') scanPool(sellerTeam.bullpen || []);

  if (sellerCandidates.length === 0) return null;

  // Sort by value (best match first)
  sellerCandidates.sort((a, b) => b.value - a.value);

  for (const sellerCandidate of sellerCandidates) {
    if (!canSparePlayer(sellerKey, sellerCandidate.player, sellerCandidate.role, null)) continue;

    const offer = findOfferForTrade(buyerKey, sellerCandidate.player, sellerCandidate.stats, need, statsMap, isUserTeam, playersTraded);
    if (!offer) continue;

    // Final fairness check
    const tolerance = isUserTeam ? 0.15 : 0.25;
    const diff = Math.abs(offer.value - sellerCandidate.value);
    const maxVal = Math.max(offer.value, sellerCandidate.value);
    if (maxVal > 0 && diff / maxVal > tolerance) continue;

    const acquiredPos = sellerCandidate.player.assignedPos || sellerCandidate.player.pos;

    const trade = {
      teamA: buyerKey,
      teamB: sellerKey,
      isUserTrade: isUserTeam,
      requiresApproval: isUserTeam,
      needType: need.type,
      needLabel: need.label,
      needPosition: need.position || null,
      teamAGets: [{
        name: sellerCandidate.player.name,
        pos: acquiredPos,
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

// Generate explanation - uses exact need label for display consistency
function generateTradeExplanation(buyerKey, sellerKey, sellerCandidate, offer, need) {
  const buyerName = TEAMS[buyerKey]?.name || buyerKey;
  const buyerCity = TEAMS[buyerKey]?.city || '';
  const sellerName = TEAMS[sellerKey]?.name || sellerKey;
  const sellerCity = TEAMS[sellerKey]?.city || '';
  const acquiredLastName = sellerCandidate.player.name.split(' ').pop();
  const offerLastName = offer.player.name.split(' ').pop();

  let buyerContext = '';
  if (need.type === 'LH_RELIEVER') {
    buyerContext = `${buyerCity} ${buyerName}, bolstering their bullpen for the stretch run, added left-handed relief help in ${acquiredLastName}.`;
  } else if (need.type === 'SP_UPGRADE') {
    buyerContext = `${buyerCity} ${buyerName}, looking to solidify their rotation down the stretch, acquired ${acquiredLastName}.`;
  } else if (need.type === 'POSITION_UPGRADE') {
    buyerContext = `${buyerCity} ${buyerName}, addressing a weak spot at ${need.position}, brought in ${acquiredLastName}.`;
  } else if (need.type === 'BACKUP_CATCHER') {
    buyerContext = `${buyerCity} ${buyerName}, adding catching depth, acquired ${acquiredLastName}.`;
  } else if (need.type === 'LH_BENCH_BAT') {
    buyerContext = `${buyerCity} ${buyerName}, adding a left-handed bat to the bench, acquired ${acquiredLastName}.`;
  } else if (need.type === 'BENCH_BAT') {
    buyerContext = `${buyerCity} ${buyerName}, looking to strengthen their bench for the playoff push, added ${acquiredLastName}.`;
  } else {
    buyerContext = `${buyerCity} ${buyerName} made a move to improve their roster, acquiring ${acquiredLastName}.`;
  }

  const sellerContext = `${sellerCity} ${sellerName}, out of contention, received ${offerLastName} in return.`;

  return `${buyerContext} ${sellerContext}`;
}

// ── Apply trades to the TEAMS object (in-place mutation) ──
export function applyTrades(trades) {
  if (!trades || trades.length === 0) return;

  for (const trade of trades) {
    for (const playerInfo of trade.teamAGets) {
      movePlayerBetweenTeams(trade.teamB, trade.teamA, playerInfo.name);
    }
    for (const playerInfo of trade.teamBGets) {
      movePlayerBetweenTeams(trade.teamA, trade.teamB, playerInfo.name);
    }
    repairRoster(trade.teamA);
    repairRoster(trade.teamB);
  }
}

// Move a player from sourceTeam to destTeam
function movePlayerBetweenTeams(sourceKey, destKey, playerName) {
  const sourceTeam = TEAMS[sourceKey];
  const destTeam = TEAMS[destKey];
  if (!sourceTeam || !destTeam) return;

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

  const pos = found.assignedPos || found.pos;

  if (foundIn === 'lineup' && destTeam.lineup) {
    const slotIdx = destTeam.lineup.findIndex(p =>
      (p.assignedPos || p.pos) === pos && !['SP', 'RP', 'CL'].includes(p.assignedPos || p.pos)
    );
    if (slotIdx >= 0) {
      const displaced = destTeam.lineup[slotIdx];
      destTeam.lineup[slotIdx] = { ...found, assignedPos: pos, pos };
      if (destTeam.bench && !destTeam.bench.find(p => p.name === displaced.name)) {
        destTeam.bench.push(displaced);
      }
    } else {
      if (destTeam.bench) destTeam.bench.push(found);
      else destTeam.lineup.push(found);
    }
  } else if (foundIn === 'rotation' || pos === 'SP') {
    if (destTeam.rotation) destTeam.rotation.push(found);
  } else if (foundIn === 'bullpen' || pos === 'RP' || pos === 'CL') {
    if (destTeam.bullpen) destTeam.bullpen.push(found);
  } else {
    if (destTeam.bench) destTeam.bench.push(found);
    else if (destTeam.lineup) destTeam.lineup.push(found);
  }
}

// ── Roster validation and repair ──
export function repairRoster(teamKey) {
  const team = TEAMS[teamKey];
  if (!team) return;

  if (!team.lineup || team.lineup.length < 9) {
    while ((!team.lineup || team.lineup.length < 9) && team.bench && team.bench.length > 0) {
      const bp = team.bench.shift();
      team.lineup = team.lineup || [];
      team.lineup.push({ ...bp, assignedPos: bp.pos });
    }
  }

  if (team.lineup && team.lineup.length > 9) {
    const extras = team.lineup.slice(9);
    team.lineup = team.lineup.slice(0, 9);
    if (!team.bench) team.bench = [];
    extras.forEach(p => {
      if (!team.bench.find(b => b.name === p.name)) team.bench.push(p);
    });
  }

  const allPosition = [...(team.lineup || []), ...(team.bench || [])];
  const hasCatcher = allPosition.some(p =>
    (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
  );
  if (!hasCatcher && team.bench && team.bench.length > 0) {
    const canCatch = team.bench.find(p =>
      (p.pos || '').includes('C') || p.pos === 'C'
    );
    if (canCatch) {
      canCatch.assignedPos = 'C';
    }
  }

  if (!team.rotation || team.rotation.length < 4) {
    const bullpenSPs = (team.bullpen || []).filter(p => p.pos === 'SP' || p.stamina >= 6);
    while ((!team.rotation || team.rotation.length < 4) && bullpenSPs.length > 0) {
      const sp = bullpenSPs.shift();
      const idx = team.bullpen.indexOf(sp);
      if (idx >= 0) team.bullpen.splice(idx, 1);
      team.rotation = team.rotation || [];
      team.rotation.push({ ...sp, pos: 'SP' });
    }
  }

  if (!team.bullpen || team.bullpen.length < 5) {
    while ((!team.bullpen || team.bullpen.length < 5) && team.rotation && team.rotation.length > 4) {
      const sp = team.rotation.pop();
      team.bullpen = team.bullpen || [];
      team.bullpen.push({ ...sp, pos: 'RP' });
    }
  }

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

export function validateRoster(teamKey) {
  const team = TEAMS[teamKey];
  if (!team) return ['Team not found'];

  const errors = [];

  if (!team.lineup || team.lineup.length !== 9) {
    errors.push(`Lineup has ${team.lineup?.length || 0} players (expected 9)`);
  }

  const allPosition = [...(team.lineup || []), ...(team.bench || [])];
  const hasCatcher = allPosition.some(p =>
    (p.assignedPos || p.pos) === 'C' || (p.pos || '').includes('C')
  );
  if (!hasCatcher) errors.push('No catcher on roster');

  if (!team.rotation || team.rotation.length < 4) {
    errors.push(`Rotation has ${team.rotation?.length || 0} starters (expected 4+)`);
  }

  if (!team.bullpen || team.bullpen.length < 5) {
    errors.push(`Bullpen has ${team.bullpen?.length || 0} arms (expected 5+)`);
  }

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
export function buildStatsMap(playerStatsRecords) {
  const map = {};
  for (const s of playerStatsRecords || []) {
    map[`${s.team}|${s.playerName}`] = s;
  }
  return map;
}

// Reapply completed trades from a persisted ledger to the in-memory TEAMS object.
// Called on season load — TEAMS re-imports fresh from gameData.js on every page
// reload, so trade mutations are lost. This replays them from the stored ledger.
// applyTrades is naturally idempotent: movePlayerBetweenTeams returns early if
// the player is already on the destination team (not found in source arrays).
export function reapplyTradesFromLedger(trades) {
  if (!trades || trades.length === 0) return;
  const appliedTrades = trades.filter(t => t.applied);
  if (appliedTrades.length === 0) return;
  applyTrades(appliedTrades);
}