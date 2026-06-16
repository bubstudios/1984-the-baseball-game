import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { TEAMS } from '@/lib/gameData';
import { ArrowUp, ArrowDown, X, AlertTriangle } from 'lucide-react';

const ALL_POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

const POSITION_GROUPS = {
  C: 'C', '1B': 'IF', '2B': 'IF', '3B': 'IF', 'SS': 'IF',
  LF: 'OF', CF: 'OF', RF: 'OF', DH: 'DH',
  OF: 'OF', INF: 'IF',
};

function getPositionPenalty(naturalPos, assignedPos) {
  if (assignedPos === 'DH' || naturalPos === assignedPos) return null; // no penalty

  // Combo positions: "C/3B" can play C or 3B without penalty
  const naturalParts = naturalPos.split('/').map(p => p.trim());
  if (naturalParts.includes(assignedPos)) return null;

  const naturalGroup = POSITION_GROUPS[naturalPos] || (naturalParts.length > 0 ? POSITION_GROUPS[naturalParts[0]] : null);
  const assignedGroup = POSITION_GROUPS[assignedPos];
  if (!naturalGroup || !assignedGroup) return null;

  if (naturalGroup === assignedGroup) {
    // Same group (e.g., LF→RF or 2B→SS): minor
    return { label: 'Slight penalty', defenseMod: -1, errorMult: 1.5, severity: 'low' };
  }
  // Cross-group (e.g., 2B→CF): major
  return { label: 'Major penalty', defenseMod: -3, errorMult: 3.0, severity: 'high' };
}

function PlayerSlot({ slot, index, total, allPlayers, usedIds, availablePositions, onPlayerChange, onPositionChange, onMoveUp, onMoveDown, onRemove }) {
  const penalty = getPositionPenalty(slot.naturalPos, slot.assignedPos);
  const availablePlayers = allPlayers.filter(p => !usedIds.has(p.name) || p.name === slot.name);

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

export default function LineupManager({ teamKey, teamData, useDH, parkTeam, onConfirm, onBack }) {
  const allPositionPlayers = useMemo(() => {
    const players = [...teamData.lineup];
    if (teamData.bench) players.push(...teamData.bench);
    // Without DH, pitchers are available to hit (with their batting stats)
    if (!useDH) {
      const allPitchers = [...teamData.rotation, ...teamData.bullpen];
      allPitchers.forEach(p => {
        players.push({
          name: p.name,
          pos: 'SP',
          bats: p.bats || 'R',
          contact: p.contact || 2,
          power: p.power || 1,
          bunting: p.bunting || 3,
          speed: p.speed || 2,
          defense: 0,
          arm: 0,
        });
      });
    }
    return players;
  }, [teamData, useDH]);

  const availablePositions = useMemo(() => {
    return useDH ? ALL_POSITIONS : [...ALL_POSITIONS.filter(p => p !== 'DH'), 'SP'];
  }, [useDH]);

  const defaultLineup = useMemo(() => {
    if (useDH) {
      return teamData.lineup.slice(0, 9).map(p => ({
        name: p.name,
        naturalPos: p.pos,
        assignedPos: p.pos,
      }));
    }
    // No DH: 8 position players + starting pitcher in 9th spot
    const slots = teamData.lineup.slice(0, 8).map(p => ({
      name: p.name,
      naturalPos: p.pos,
      assignedPos: p.pos,
    }));
    const sp = teamData.rotation[0];
    slots.push({
      name: sp.name,
      naturalPos: 'SP',
      assignedPos: 'SP',
    });
    return slots;
  }, [teamData, useDH]);

  const [lineup, setLineup] = useState(defaultLineup);

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
    onConfirm(customLineup);
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

        {/* Position penalty legend */}
        <div className="bg-card border border-border rounded-xl p-3 mb-4 space-y-1.5">
          <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground">Position Penalties</div>
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-foreground/80">Natural position — no penalty</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-foreground/80">Same group (OF↔OF, IF↔IF) — slight defense drop, more errors</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-body">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-foreground/80">Cross-group (IF→OF, OF→IF) — major defense drop, many errors</span>
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
              <span className="w-14"></span>
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
                onPlayerChange={handlePlayerChange}
                onPositionChange={handlePositionChange}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>

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