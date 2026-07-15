import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, Users } from 'lucide-react';
import { formatRating } from '@/lib/ratingFormat';

const FIELD_POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'];

function normalizePos(pos) {
  if (['SP', 'RP', 'CL', 'P'].includes(pos)) return 'P';
  return pos;
}

/**
 * Multi-step Double Switch flow for NL games (no DH).
 *
 * Step 1: Select new pitcher from the bullpen
 * Step 2: Select which position player's batting slot the new pitcher will take
 * Step 3: Select a bench player to fill the pitcher's old batting slot
 * Step 4: Confirm and apply
 */
export default function DoubleSwitchFlow({ gameState, teams, userTeam, unavailableRelievers = {}, tiredRelievers = {}, onApply, onCancel }) {
  const [step, setStep] = useState(1);
  const [selectedPitcher, setSelectedPitcher] = useState(null);
  const [selectedSlotIdx, setSelectedSlotIdx] = useState(null);
  const [selectedReplacement, setSelectedReplacement] = useState(null);

  const userIsHome = userTeam === gameState.homeTeam;
  const myTeam = teams[userTeam];
  const lineup = userIsHome ? gameState.homeLineup : gameState.awayLineup;
  const currentPitcher = userIsHome ? gameState.homePitcher : gameState.awayPitcher;
  const removedPlayers = gameState.removedPlayers || [];
  const scratchedSet = new Set(gameState.scratchedPlayers || []);

  // Find the pitcher's current batting slot so we can exclude it from step 2
  const pitcherSlotIdx = useMemo(() => {
    let idx = lineup.findIndex(p => p.name === currentPitcher?.name);
    if (idx < 0 && currentPitcher?.order) idx = lineup.findIndex(p => p.order === currentPitcher.order);
    if (idx < 0) idx = lineup.findIndex(p => ['SP', 'RP', 'CL'].includes(p.assignedPos) || p._replacedPitcher);
    return idx;
  }, [lineup, currentPitcher]);

  // Available relievers (same filter as SubstitutionsPanel pitching tab)
  const bullpen = (userIsHome ? (gameState.homeBullpen || []) : (gameState.awayBullpen || []))
    .filter(p => p.name !== currentPitcher?.name && !removedPlayers.includes(p.name));

  // Available bench players for step 3
  const benchUsed = userIsHome ? (gameState.homeBenchUsed || []) : (gameState.awayBenchUsed || []);
  const usedNames = useMemo(() => {
    const names = new Set();
    [...gameState.homeLineup, ...gameState.awayLineup].forEach(p => names.add(p.name));
    benchUsed.forEach(p => names.add(p.name));
    (gameState.homePlayerHistory || []).forEach(p => names.add(p.name));
    (gameState.awayPlayerHistory || []).forEach(p => names.add(p.name));
    return names;
  }, [gameState.homeLineup, gameState.awayLineup, benchUsed, gameState.homePlayerHistory, gameState.awayPlayerHistory]);

  const availableBench = useMemo(() => {
    if (!myTeam) return [];
    const fullRoster = [...(myTeam.lineup || []), ...(myTeam.bench || [])];
    return fullRoster.filter(p => !usedNames.has(p.name) && !scratchedSet.has(p.name));
  }, [myTeam, usedNames, scratchedSet]);

  // The outgoing fielder being removed
  const outgoingFielder = selectedSlotIdx != null ? lineup[selectedSlotIdx] : null;
  const outgoingFielderPos = outgoingFielder ? normalizePos(outgoingFielder.assignedPos || outgoingFielder.pos) : null;

  // Filter bench players who can play the outgoing fielder's position
  const eligibleReplacements = useMemo(() => {
    if (!outgoingFielderPos) return availableBench;
    return availableBench;
  }, [availableBench, outgoingFielderPos]);

  const canProceed = () => {
    if (step === 1) return selectedPitcher != null;
    if (step === 2) return selectedSlotIdx != null && selectedSlotIdx !== pitcherSlotIdx;
    if (step === 3) return selectedReplacement != null;
    return true;
  };

  const handleConfirm = () => {
    if (!selectedPitcher || selectedSlotIdx == null || !selectedReplacement) return;
    onApply(selectedPitcher, selectedSlotIdx, selectedReplacement);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-2.5 border border-primary/30">
        <Users className="w-4 h-4 text-primary flex-shrink-0" />
        <div>
          <div className="text-[10px] font-heading uppercase tracking-wider text-primary">Double Switch</div>
          <div className="text-[9px] text-muted-foreground">NL rules - bury the pitcher's spot in the order</div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 text-[9px] font-heading">
        {[1, 2, 3, 4].map(s => (
          <React.Fragment key={s}>
            <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>{s}</div>
            {s < 4 && <div className={`h-0.5 w-4 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Select pitcher */}
      {step === 1 && (
        <div className="space-y-2">
          <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
            Step 1 - Select New Pitcher
          </div>
          {bullpen.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No relievers available</p>
          ) : (
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto">
              {bullpen.map((p, i) => {
                const unavailableReason = unavailableRelievers[p.name];
                const unavailable = !!unavailableReason;
                const tiredReason = tiredRelievers[p.name];
                const tired = !unavailable && !!tiredReason;
                const isSelected = selectedPitcher?.name === p.name;
                return (
                  <button
                    key={i}
                    onClick={() => !unavailable && setSelectedPitcher(p)}
                    disabled={unavailable}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : unavailable
                          ? 'border-border/40 opacity-40 cursor-not-allowed'
                          : tired
                            ? 'border-yellow-500/30 hover:border-yellow-400/60 hover:bg-yellow-500/5'
                            : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-xs text-foreground">{p.name}</span>
                      <span className="text-[9px] text-muted-foreground">{unavailable ? 'UNAVAIL' : tired ? 'TIRED' : `${p.pos} (${p.throws}HP)`}</span>
                    </div>
                    <div className="flex gap-2 mt-0.5 text-[9px]">
                      <span className="text-emerald-400">SPD {formatRating(p.pitchSpeed)}</span>
                      <span className="text-purple-400">OFF {formatRating(p.offSpeed)}</span>
                      <span className="text-blue-400">CTL {formatRating(p.control)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Select batting slot for new pitcher */}
      {step === 2 && (
        <div className="space-y-2">
          <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
            Step 2 - Select Batting Slot for {selectedPitcher?.name}
          </div>
          <div className="text-[9px] text-muted-foreground italic">
            The pitcher will take this player's spot in the order. That player leaves the game.
          </div>
          <div className="space-y-1 max-h-[40vh] overflow-y-auto">
            {lineup.map((player, idx) => {
              if (idx === pitcherSlotIdx) return null;
              const pos = normalizePos(player.assignedPos || player.pos);
              const isPitcherSlot = ['SP', 'RP', 'CL', 'P'].includes(player.assignedPos || player.pos);
              if (isPitcherSlot) return null;
              const isSelected = selectedSlotIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSlotIdx(idx)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-heading font-bold text-xs text-foreground">#{player.order} {player.name}</span>
                    <span className="text-[9px] text-muted-foreground">{pos}</span>
                  </div>
                  <div className="flex gap-2 mt-0.5 text-[9px]">
                    <span className="text-primary">CON {formatRating(player.contact)}</span>
                    <span className="text-amber-400">PWR {formatRating(player.power)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Select replacement player */}
      {step === 3 && (
        <div className="space-y-2">
          <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
            Step 3 - Replacement for {outgoingFielderPos} (bats #{outgoingFielder?.order})
          </div>
          <div className="text-[9px] text-muted-foreground italic">
            This player takes the pitcher's old batting slot and plays {outgoingFielderPos}.
          </div>
          {eligibleReplacements.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No bench players available</p>
          ) : (
            <div className="space-y-1.5 max-h-[40vh] overflow-y-auto">
              {eligibleReplacements.map((p, i) => {
                const isSelected = selectedReplacement?.name === p.name;
                const playerPos = normalizePos(p.pos);
                const posMatch = playerPos === outgoingFielderPos;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedReplacement(p)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-xs text-foreground">{p.name}</span>
                      <span className={`text-[9px] ${posMatch ? 'text-green-400' : 'text-amber-400'}`}>
                        {playerPos}{!posMatch && ' (out of pos)'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-0.5 text-[9px]">
                      <span className="text-primary">CON {formatRating(p.contact)}</span>
                      <span className="text-amber-400">PWR {formatRating(p.power)}</span>
                      <span className="text-cyan-400">SPD {formatRating(p.speed)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Confirm */}
      {step === 4 && (
        <div className="space-y-2">
          <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
            Step 4 - Confirm Double Switch
          </div>
          <div className="bg-muted/50 rounded-lg p-3 space-y-2">
            <div className="text-[11px] text-foreground leading-relaxed">
              <span className="font-bold text-primary">{selectedPitcher?.name}</span> enters pitching, batting <span className="font-bold">#{outgoingFielder?.order}</span>.
            </div>
            <div className="text-[11px] text-foreground leading-relaxed">
              <span className="font-bold text-primary">{selectedReplacement?.name}</span> enters at <span className="font-bold">{outgoingFielderPos}</span>, batting <span className="font-bold">#{lineup[pitcherSlotIdx]?.order}</span>.
            </div>
            <div className="text-[11px] text-muted-foreground leading-relaxed">
              {outgoingFielder?.name} leaves the game.
              {lineup[pitcherSlotIdx]?.name !== currentPitcher?.name && (
                <> {lineup[pitcherSlotIdx]?.name} leaves the game.</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => step === 1 ? onCancel() : setStep(step - 1)}
          className="text-[10px]"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        {step < 4 ? (
          <Button
            size="sm"
            disabled={!canProceed()}
            onClick={() => setStep(step + 1)}
            className="text-[10px]"
          >
            Next
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleConfirm}
            className="text-[10px]"
          >
            <Check className="w-3 h-3 mr-1" />
            Apply
          </Button>
        )}
      </div>
    </div>
  );
}