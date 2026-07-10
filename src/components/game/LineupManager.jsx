import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { ArrowUp, ArrowDown, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateSituationalRatings, getRatingBadgeClass } from '@/lib/situationalRatings';
import { getRestDays, getUnavailableRelievers } from '@/lib/seasonStore';

const ALL_POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

const POSITION_GROUPS = {
  C: 'C', '1B': 'IF', '2B': 'IF', '3B': 'IF', 'SS': 'IF',
  LF: 'OF', CF: 'OF', RF: 'OF', DH: 'DH',
  OF: 'OF', INF: 'IF',
};

function getPositionPenalty(naturalPos, assignedPos) {
  if (assignedPos === 'DH' || naturalPos === assignedPos) return null;

  const naturalParts = naturalPos.split('/').map(p => p.trim());
  if (naturalParts.includes(assignedPos)) return null;

  const naturalGroup = POSITION_GROUPS[naturalPos] || (naturalParts.length > 0 ? POSITION_GROUPS[naturalParts[0]] : null);
  const assignedGroup = POSITION_GROUPS[assignedPos];
  if (!naturalGroup || !assignedGroup) return null;

  if (naturalGroup === assignedGroup) {
    return { label: 'Slight penalty', defenseMod: -1, errorMult: 1.5, severity: 'low' };
  }
  return { label: 'Major penalty', defenseMod: -3, errorMult: 3.0, severity: 'high' };
}

// Calculate platoon advantage vs opposing pitcher
function getPlatoonAdvantage(batter, opposingPitcher) {
  if (!batter || !opposingPitcher) return { type: 'neutral', label: 'No matchup data' };
  
  const batterBats = batter.bats;
  const pitcherThrows = opposingPitcher.throws;
  
  if (!batterBats || !pitcherThrows) return { type: 'neutral', label: 'Unknown handedness' };
  
  // Lefty batter vs RHP = advantage
  // Righty batter vs LHP = advantage
  // Same handedness = disadvantage
  if (batterBats === 'L' && pitcherThrows === 'R') {
    return { type: 'advantage', label: 'L vs R - Platoon advantage' };
  }
  if (batterBats === 'R' && pitcherThrows === 'L') {
    return { type: 'advantage', label: 'R vs L - Platoon advantage' };
  }
  if (batterBats === pitcherThrows) {
    return { type: 'disadvantage', label: 'Same handedness - Platoon disadvantage' };
  }
  // Switch hitter = always advantage (bats from opposite side of pitcher)
  return { type: 'advantage', label: 'Switch hitter - Platoon advantage' };
}

function PlayerSlot({ slot, index, total, allPlayers, usedIds, availablePositions, opposingPitcher, gameConditions, onPlayerChange, onPositionChange, onMoveUp, onMoveDown, onRemove }) {
  const penalty = getPositionPenalty(slot.naturalPos, slot.assignedPos);
  const availablePlayers = allPlayers.filter(p => !usedIds.has(p.name) || p.name === slot.name);
  const playerData = availablePlayers.find(p => p.name === slot.name);
  const platoonAdvantage = getPlatoonAdvantage(playerData, opposingPitcher);
  const situational = calculateSituationalRatings(playerData, opposingPitcher, gameConditions);

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${penalty?.severity === 'high' ? 'bg-red-500/10 border border-red-500/30' : penalty?.severity === 'low' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-muted/30'}`}>
      <span className="font-heading font-bold text-sm text-muted-foreground w-6 text-center">{index + 1}</span>

      {/* Player select */}
      <select
        value={slot.name}
        onChange={(e) => onPlayerChange(index, e.target.value)}
        className="flex-1 bg-input border border-border rounded-md px-2 py-1.5 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
      >
        {availablePlayers.map(p => (
          <option key={p.name} value={p.name}>{p.name} ({p.pos})</option>
        ))}
      </select>

      {/* Position select */}
      <select
        value={slot.assignedPos}
        onChange={(e) => onPositionChange(index, e.target.value)}
        className="w-16 bg-input border border-border rounded-md px-1.5 py-1.5 text-xs font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
      >
        {availablePositions.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>

      {/* Situational ratings display (amplified card + delta arrow) */}
      {playerData && opposingPitcher && (() => {
        const cDelta = situational.contact - situational.baseContact;
        const pDelta = situational.power - situational.basePower;
        const cArrow = cDelta > 0 ? '▲' : cDelta < 0 ? '▼' : '';
        const pArrow = pDelta > 0 ? '▲' : pDelta < 0 ? '▼' : '';
        const cColor = cDelta > 0 ? 'text-emerald-400' : cDelta < 0 ? 'text-red-400' : 'text-muted-foreground';
        const pColor = pDelta > 0 ? 'text-emerald-400' : pDelta < 0 ? 'text-red-400' : 'text-muted-foreground';
        return (
          <div className="flex items-center gap-1.5 flex-shrink-0" title={situational.factors.join(', ')}>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] text-muted-foreground leading-none">C</span>
              <div className="flex items-center gap-0.5">
                <span className={`text-xs font-bold leading-none ${getRatingBadgeClass(situational.contact)}`}>{situational.contact}</span>
                {cDelta !== 0 && <span className={`text-[8px] ${cColor}`}>{cArrow}{Math.abs(cDelta) >= 2 ? Math.abs(cDelta) : ''}</span>}
              </div>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-[8px] text-muted-foreground leading-none">P</span>
              <div className="flex items-center gap-0.5">
                <span className={`text-xs font-bold leading-none ${getRatingBadgeClass(situational.power)}`}>{situational.power}</span>
                {pDelta !== 0 && <span className={`text-[8px] ${pColor}`}>{pArrow}{Math.abs(pDelta) >= 2 ? Math.abs(pDelta) : ''}</span>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Speed & Defense base ratings */}
      {playerData && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] text-muted-foreground leading-none">S</span>
            <span className="text-xs font-bold leading-none text-foreground">{playerData.speed || 0}</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[8px] text-muted-foreground leading-none">D</span>
            <span className={`text-xs font-bold leading-none ${(penalty?.defenseMod || 0) < 0 ? 'text-amber-400' : 'text-foreground'}`}>{Math.max(0, (playerData.defense || 0) + (penalty?.defenseMod || 0))}</span>
          </div>
        </div>
      )}

      {/* Platoon advantage indicator */}
      {opposingPitcher && platoonAdvantage.type !== 'neutral' && (
        <div
          className={`flex-shrink-0 ${platoonAdvantage.type === 'advantage' ? 'text-emerald-400' : 'text-red-400'}`}
          title={platoonAdvantage.label}
        >
          {platoonAdvantage.type === 'advantage'
            ? <TrendingUp className="w-3.5 h-3.5" />
            : <TrendingDown className="w-3.5 h-3.5" />
          }
        </div>
      )}

      {/* Penalty indicator */}
      {penalty && (
        <div className="flex items-center gap-0.5" title={penalty.label}>
          <AlertTriangle className={`w-3.5 h-3.5 ${penalty.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
          <span className={`text-[9px] font-body ${penalty.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`}>
            {penalty.label}
          </span>
        </div>
      )}

      {/* Move buttons */}
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => onMoveUp(index)}
          disabled={index === 0}
          className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowUp className="w-3 h-3 text-muted-foreground" />
        </button>
        <button
          onClick={() => onMoveDown(index)}
          disabled={index === total - 1}
          className="p-0.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDown className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>

      {/* Remove */}
      <button onClick={() => onRemove(index)} className="p-1 rounded hover:bg-destructive/20 transition-colors">
        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
      </button>
    </div>
  );
}

export default function LineupManager({ teamKey, teamData, opponentTeamData, useDH, parkTeam, weather, onConfirm, onBack, illPlayerNames = [], opponentIllPlayerNames = [], seasonMode = false, forcedOpponentSP = null, forcedUserSP = null, seasonGameDate = null, seasonRotationState = null, isBullpenDay = false }) {
  const illSet = useMemo(() => new Set(illPlayerNames), [illPlayerNames]);
  const oppIllSet = useMemo(() => new Set(opponentIllPlayerNames), [opponentIllPlayerNames]);
  const rotationPitchers = useMemo(() => (teamData.rotation || []).filter(p => !illSet.has(p.name)), [teamData, illSet]);
  const [selectedPitcher, setSelectedPitcher] = useState(forcedUserSP?.name || rotationPitchers[0]?.name || '');
  const bullpenPitchers = useMemo(() => {
    if (!isBullpenDay) return [];
    const unavailable = new Set(seasonRotationState ? getUnavailableRelievers(seasonRotationState, teamKey, seasonGameDate) : []);
    return (teamData.bullpen || []).filter(p => !illSet.has(p.name) && !unavailable.has(p.name));
  }, [teamData, isBullpenDay, illSet, seasonRotationState, teamKey]);
  const selectedPitcherData = useMemo(() => {
    return rotationPitchers.find(p => p.name === selectedPitcher)
      || bullpenPitchers.find(p => p.name === selectedPitcher)
      || forcedUserSP
      || rotationPitchers[0]
      || null;
  }, [rotationPitchers, bullpenPitchers, selectedPitcher, forcedUserSP]);

  // Opponent starting pitcher selection
  const opponentRotation = useMemo(() => (opponentTeamData?.rotation || []).filter(p => !oppIllSet.has(p.name)), [opponentTeamData, oppIllSet]);
  const [opponentSP, setOpponentSP] = useState(forcedOpponentSP?.name || opponentRotation[0]?.name || '');
  // Season mode: use the resolver's answer directly (forcedOpponentSP).
  // This is the ONE source of truth - never derive the opponent starter from rotation math here,
  // because a bullpen-day opener is a reliever and won't be found in opponentRotation,
  // causing a silent fallback to SP1 (the split-brain bug).
  const opponentSPData = useMemo(() => {
    if (forcedOpponentSP) return forcedOpponentSP;
    return opponentRotation.find(p => p.name === opponentSP) || opponentRotation[0] || null;
  }, [opponentRotation, opponentSP, forcedOpponentSP]);

  // Sync state when team data changes (new team selection)
  useEffect(() => {
    setSelectedPitcher(forcedUserSP?.name || rotationPitchers[0]?.name || '');
  }, [rotationPitchers, forcedUserSP]);

  useEffect(() => {
    setOpponentSP(forcedOpponentSP?.name || opponentRotation[0]?.name || '');
  }, [opponentRotation, forcedOpponentSP]);

  const allPositionPlayers = useMemo(() => {
    const players = [...teamData.lineup, ...(teamData.bench || [])].filter(p => !illSet.has(p.name));
    if (!useDH) {
      const allPitchers = [...teamData.rotation, ...teamData.bullpen].filter(p => !illSet.has(p.name));
      allPitchers.forEach(p => {
        players.push({
          ...p,
          pos: p.pos || 'SP',
          defense: 0,
          arm: 0,
        });
      });
    }
    return players;
  }, [teamData, useDH, illSet]);

  const availablePositions = useMemo(() => {
    return useDH ? ALL_POSITIONS : [...ALL_POSITIONS.filter(p => p !== 'DH'), 'SP'];
  }, [useDH]);

  const defaultLineup = useMemo(() => {
    const healthyLineup = teamData.lineup.filter(p => !illSet.has(p.name));
    const healthyBench = (teamData.bench || []).filter(p => !illSet.has(p.name));
    const usedNames = new Set();

    if (useDH) {
      const slots = healthyLineup.slice(0, 9).map(p => {
        usedNames.add(p.name);
        return { name: p.name, naturalPos: p.pos, assignedPos: p.pos };
      });
      let benchIdx = 0;
      while (slots.length < 9 && benchIdx < healthyBench.length) {
        const bp = healthyBench[benchIdx++];
        if (!usedNames.has(bp.name)) {
          usedNames.add(bp.name);
          slots.push({ name: bp.name, naturalPos: bp.pos, assignedPos: bp.pos });
        }
      }
      return slots;
    }
    // No DH: 8 position players + starting pitcher in 9th spot
    const slots = healthyLineup.slice(0, 8).map(p => {
      usedNames.add(p.name);
      return { name: p.name, naturalPos: p.pos, assignedPos: p.pos };
    });
    let benchIdx = 0;
    while (slots.length < 8 && benchIdx < healthyBench.length) {
      const bp = healthyBench[benchIdx++];
      if (!usedNames.has(bp.name)) {
        usedNames.add(bp.name);
        slots.push({ name: bp.name, naturalPos: bp.pos, assignedPos: bp.pos });
      }
    }
    const sp = forcedUserSP || rotationPitchers[0];
    if (sp) {
      slots.push({ name: sp.name, naturalPos: 'SP', assignedPos: 'SP' });
    }
    return slots;
  }, [teamData, useDH, illSet, rotationPitchers]);

  const [lineup, setLineup] = useState(defaultLineup);

  // Sync lineup when team data changes (new team selection)
  useEffect(() => {
    setLineup(defaultLineup);
  }, [defaultLineup]);

  const usedPlayerIds = useMemo(() => {
    const ids = new Set();
    lineup.forEach(s => ids.add(s.name));
    return ids;
  }, [lineup]);

  // Check for duplicate positions (excluding DH which can have duplicates)
  const positionCounts = useMemo(() => {
    const counts = {};
    lineup.forEach(s => {
      if (s.assignedPos !== 'DH' && s.assignedPos !== 'SP') {
        counts[s.assignedPos] = (counts[s.assignedPos] || 0) + 1;
      }
    });
    return counts;
  }, [lineup]);

  const duplicatePositions = Object.entries(positionCounts)
    .filter(([_, count]) => count > 1)
    .map(([pos]) => pos);

  const handlePlayerChange = (index, newName) => {
    const newLineup = [...lineup];
    const playerData = allPositionPlayers.find(p => p.name === newName);
    newLineup[index] = {
      name: newName,
      naturalPos: playerData?.pos || 'DH',
      assignedPos: playerData?.pos || 'DH',
    };
    setLineup(newLineup);
  };

  const handlePositionChange = (index, newPos) => {
    const newLineup = [...lineup];
    newLineup[index] = { ...newLineup[index], assignedPos: newPos };
    setLineup(newLineup);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newLineup = [...lineup];
    [newLineup[index - 1], newLineup[index]] = [newLineup[index], newLineup[index - 1]];
    setLineup(newLineup);
  };

  const handleMoveDown = (index) => {
    if (index === lineup.length - 1) return;
    const newLineup = [...lineup];
    [newLineup[index], newLineup[index + 1]] = [newLineup[index + 1], newLineup[index]];
    setLineup(newLineup);
  };

  const handleRemove = (index) => {
    if (lineup.length <= 1) return;
    const newLineup = lineup.filter((_, i) => i !== index);
    setLineup(newLineup);
  };

  const handleAddPlayer = () => {
    // Find first player not in lineup
    const nextPlayer = allPositionPlayers.find(p => !usedPlayerIds.has(p.name));
    if (nextPlayer) {
      setLineup([...lineup, { name: nextPlayer.name, naturalPos: nextPlayer.pos, assignedPos: nextPlayer.pos }]);
    }
  };

  const handleConfirm = () => {
    // Season mode: validate SP rest. 2+ rest days = allowed (short-rest, marked tired).
    // <2 rest days = blocked (truly unavailable).
    if (seasonMode && seasonRotationState && seasonGameDate) {
      const spToCheck = useDH ? selectedPitcherData : (lineup.find(s => s.assignedPos === 'SP') ? { name: lineup.find(s => s.assignedPos === 'SP').name } : null);
      if (spToCheck) {
        const restDays = getRestDays(seasonRotationState, teamKey, spToCheck.name, seasonGameDate);
        if (restDays < 2) {
          alert(`${spToCheck.name} has only ${restDays} rest day(s) - cannot start. Pitchers need at least 2 rest days.`);
          return;
        }
      }
    }
    // Build full player objects with assignedPos
    const customLineup = lineup.map((slot, order) => {
      const player = allPositionPlayers.find(p => p.name === slot.name);
      return {
        ...player,
        assignedPos: slot.assignedPos,
        order: order + 1,
        gameStats: { ab: 0, hits: 0, runs: 0, rbi: 0, bb: 0, so: 0, hr: 0, sb: 0, cs: 0 },
      };
    });
    // Pass user's SP (for DH) AND opponent's SP
    onConfirm(customLineup, useDH ? selectedPitcherData : null, opponentSPData);
  };

  const hasDuplicates = duplicatePositions.length > 0;
  const playerCount = lineup.length;
  const validLineup = playerCount >= 8 && playerCount <= 10 && !hasDuplicates;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-lg">⚾</span>
          <h1 className="font-display text-[10px] text-primary tracking-wider mt-1">LINEUP MANAGER</h1>
          <h2 className="font-heading text-xl font-bold text-foreground mt-1">{teamData.city} {teamData.name}</h2>
          <p className="text-xs text-muted-foreground font-body mt-1">
            {useDH
              ? `DH rules — pitchers do not bat. Set your 9 hitters at ${TEAMS[parkTeam]?.stadium || ''}.`
              : `No DH — pitchers hit for themselves. ${teamData.rotation[0]?.name} will bat 9th.`}
          </p>
        </div>

        {/* DH/No DH notice */}
        <div className={`rounded-lg p-3 mb-4 text-center ${
          useDH ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-emerald-500/5 border border-emerald-500/20'
        }`}>
          <span className={`text-[10px] font-heading font-bold uppercase tracking-wider ${
            useDH ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {useDH ? '🏏 DH RULE — Designated hitter bats for the pitcher' : '⚾ PITCHER HITS — Pitcher bats in the 9th spot'}
          </span>
        </div>

        {/* Legends */}
        <div className="bg-card border border-border rounded-xl p-3 mb-4 space-y-1.5">
          <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-1">Lineup Guide</div>
          {opponentSPData && (
            <div className="pb-2 mb-2 border-b border-border/50">
              <div className="text-[10px] font-heading text-muted-foreground mb-1">vs. {opponentSPData.name} ({opponentSPData.throws || 'R'}HP)</div>
              <div className="flex items-center gap-2 text-xs font-body">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="text-foreground/80">Platoon advantage (opposite hand)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-body mt-0.5">
                <TrendingDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                <span className="text-foreground/80">Platoon disadvantage (same hand)</span>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-foreground/80">Natural position — no penalty</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-foreground/80">Same group (OF↔OF, IF↔IF) — slight defense drop</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-foreground/80">Cross-group (IF→OF, OF→IF) — major defense drop</span>
          </div>
        </div>

        {/* Lineup slots */}
        <div className="bg-card border border-border rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-sm font-bold text-foreground">
              Starting Lineup ({playerCount})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddPlayer}
              disabled={playerCount >= 10}
              className="text-[10px] h-7 px-2"
            >
              + Add Player
            </Button>
          </div>

          <div className="space-y-1.5">
            {/* Column headers */}
            <div className="flex items-center gap-2 px-2 mb-1">
              <span className="w-6"></span>
              <span className="flex-1 text-[9px] font-heading uppercase text-muted-foreground tracking-wider">Player</span>
              <span className="w-16 text-center text-[9px] font-heading uppercase text-muted-foreground tracking-wider">Pos</span>
              <span className="text-[9px] font-heading uppercase text-muted-foreground tracking-wider">C</span>
              <span className="text-[9px] font-heading uppercase text-muted-foreground tracking-wider">P</span>
              <span className="text-[9px] font-heading uppercase text-muted-foreground tracking-wider">S</span>
              <span className="text-[9px] font-heading uppercase text-muted-foreground tracking-wider">D</span>
            </div>

            {lineup.map((slot, i) => (
              <PlayerSlot
                key={i}
                slot={slot}
                index={i}
                total={lineup.length}
                allPlayers={allPositionPlayers}
                usedIds={usedPlayerIds}
                availablePositions={availablePositions}
                opposingPitcher={opponentSPData}
                gameConditions={{
                  isNight: weather ? !weather.isDay : true,
                  isHome: parkTeam === teamKey,
                  h2hStats: null,
                }}
                onPlayerChange={handlePlayerChange}
                onPositionChange={handlePositionChange}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

        {/* Bench matchup overview — shows bench players' platoon advantage vs opponent SP with situational ratings */}
        {opponentSPData && (() => {
          const benchPlayers = [...(teamData.bench || [])].filter(p => !illSet.has(p.name) && !usedPlayerIds.has(p.name));
          if (benchPlayers.length === 0) return null;
          const withMatchup = benchPlayers.map(p => ({ ...p, matchup: getPlatoonAdvantage(p, opponentSPData) }));
          const advantages = withMatchup.filter(p => p.matchup.type === 'advantage');
          if (advantages.length === 0) return null;
          return (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 mb-4">
              <div className="text-[10px] font-heading uppercase tracking-widest text-emerald-400 mb-2">Bench - Platoon Advantages vs {opponentSPData.throws || 'R'}HP</div>
              <div className="space-y-1">
                {advantages.map(p => {
                  const situational = calculateSituationalRatings(p, opponentSPData, { isNight: weather ? !weather.isDay : true, isHome: parkTeam === teamKey });
                  const adjContact = situational.contact;
                  const adjPower = situational.power;
                  const cDelta = adjContact - situational.baseContact;
                  const pDelta = adjPower - situational.basePower;
                  const cArrow = cDelta > 0 ? '▲' : cDelta < 0 ? '▼' : '';
                  const pArrow = pDelta > 0 ? '▲' : pDelta < 0 ? '▼' : '';
                  return (
                    <div key={p.name} className="flex items-center gap-2 text-xs font-body">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="text-foreground font-bold">{p.name}</span>
                      <span className="text-muted-foreground">({p.pos}, {p.bats}B)</span>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-[10px] text-muted-foreground">C:<span className={`${adjContact >= 7 ? 'text-emerald-400' : adjContact <= 4 ? 'text-red-400' : 'text-foreground'}`}>{adjContact}</span>{cDelta !== 0 && <span className={`text-[8px] ${cDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{cArrow}{Math.abs(cDelta) >= 2 ? Math.abs(cDelta) : ''}</span>}</span>
                        <span className="text-[10px] text-muted-foreground">P:<span className={`${adjPower >= 7 ? 'text-emerald-400' : adjPower <= 4 ? 'text-red-400' : 'text-foreground'}`}>{adjPower}</span>{pDelta !== 0 && <span className={`text-[8px] ${pDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{pArrow}{Math.abs(pDelta) >= 2 ? Math.abs(pDelta) : ''}</span>}</span>
                        <span className="text-[10px] text-muted-foreground">S:<span className="text-foreground font-bold">{p.speed || 0}</span></span>
                        <span className="text-[10px] text-muted-foreground">D:<span className="text-foreground font-bold">{p.defense || 0}</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* Opponent Starting Pitcher — shown first because it drives the C/P ratings */}
        {opponentTeamData && opponentSPData && (
          <div className="bg-card border border-primary/40 rounded-xl p-3 mb-4">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              Opponent Starting Pitcher
            </h3>
            {seasonMode ? (
              <>
                <p className="text-[10px] text-muted-foreground mb-2 font-body">
                  Set by {opponentTeamData.city} {opponentTeamData.name}'s rotation. You face:
                </p>
                <div className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-body text-foreground">
                  {opponentSPData.name} — SPD {opponentSPData.pitchSpeed} | OFF {opponentSPData.offSpeed} | CTL {opponentSPData.control} | STA {opponentSPData.stamina}
                </div>
              </>
            ) : (
              <>
                <p className="text-[10px] text-primary mb-2 font-body font-medium">
                  This drives the Contact/Power ratings above — pick who you'll face from {opponentTeamData.city} {opponentTeamData.name}'s rotation.
                </p>
                <select
                  value={opponentSP}
                  onChange={(e) => setOpponentSP(e.target.value)}
                  className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {opponentRotation.map(p => (
                    <option key={p.name} value={p.name}>
                      {p.name} — SPD {p.pitchSpeed} | OFF {p.offSpeed} | CTL {p.control} | STA {p.stamina}
                    </option>
                  ))}
                </select>
              </>
            )}
            {opponentSPData && (
              <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                <span>Throws: <span className="text-foreground font-bold">{opponentSPData.throws || 'R'}</span></span>
                <span>Stamina: <span className="text-foreground font-bold">{opponentSPData.stamina}/10</span></span>
              </div>
            )}
          </div>
        )}

        {/* Starting Pitcher selector — only when DH is on */}
        {useDH && (
          <div className="bg-card border border-border rounded-xl p-3 mb-4">
            <h3 className="font-heading text-sm font-bold text-foreground mb-2">
              {isBullpenDay ? 'Bullpen Day - Opener' : 'Your Starting Pitcher'}
            </h3>
            <p className="text-[10px] text-muted-foreground mb-2 font-body">
              {isBullpenDay
                ? 'Your rotation is on rest. Select an opener from the bullpen.'
                : 'Choose your starter - they will not bat with the DH rule in effect.'}
            </p>
            <select
              value={selectedPitcher}
              onChange={(e) => setSelectedPitcher(e.target.value)}
              className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {isBullpenDay && bullpenPitchers.map(p => (
                <option key={p.name} value={p.name}>
                  {p.name} - SPD {p.pitchSpeed} | CTL {p.control} | STA {p.stamina} ({p.pos})
                </option>
              ))}
              {rotationPitchers.map(p => {
                const restDays = seasonMode && seasonRotationState ? getRestDays(seasonRotationState, teamKey, p.name, seasonGameDate) : Infinity;
                const fullyRested = !seasonMode || !seasonRotationState || restDays >= 3;
                const shortRest = seasonMode && seasonRotationState && restDays < 3 && restDays >= 2;
                const unavailable = seasonMode && seasonRotationState && restDays < 2;
                const isScheduled = forcedUserSP && p.name === forcedUserSP.name;
                const badge = isBullpenDay ? ' (rest)' : isScheduled ? ' ◀ SCHEDULED' : fullyRested ? '' : shortRest ? ` (TIRED - ${restDays}d rest)` : unavailable ? ` (UNAVAILABLE - ${restDays}d)` : '';
                return (
                  <option key={p.name} value={p.name} disabled={isBullpenDay || unavailable}>
                    {p.name} - SPD {p.pitchSpeed} | OFF {p.offSpeed} | CTL {p.control} | STA {p.stamina}{badge}
                  </option>
                );
              })}
            </select>
            {selectedPitcherData && (
              <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                <span>Throws: <span className="text-foreground font-bold">{selectedPitcherData.throws || 'R'}</span></span>
                <span>Stamina: <span className="text-foreground font-bold">{selectedPitcherData.stamina}/10</span></span>
              </div>
            )}
          </div>
        )}

        {/* Validation messages */}
        {hasDuplicates && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-2 mb-4">
            <p className="text-xs text-destructive font-body">
              Duplicate positions: {duplicatePositions.join(', ')}. Each position can only have one fielder.
            </p>
          </div>
        )}
        {playerCount < 9 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2 mb-4">
            <p className="text-xs text-amber-400 font-body">Need at least 9 players in the lineup.</p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack} className="flex-1 font-heading text-sm">
            Back
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!validLineup || playerCount < 9}
            className="flex-1 font-heading text-sm"
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}