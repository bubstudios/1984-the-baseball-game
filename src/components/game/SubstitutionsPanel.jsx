import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Users } from 'lucide-react';

const ALL_POSITIONS = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

// Normalize 'SP'/'RP'/'CL' to 'P' for display in the defensive alignment dropdown
function normalizePos(pos) {
  if (['SP', 'RP', 'CL', 'P'].includes(pos)) return 'P';
  return pos;
}

export default function SubstitutionsPanel({ gameState, teams, userTeam, onClose, onPinchHit, onPinchRun, onDefensiveSwitch, onChangePitcher, initialTab = 'pinchhit', unavailableRelievers = {} }) {
  const [tab, setTab] = useState(initialTab);

  // Determine which side the user's team is on
  const userIsHome = userTeam === gameState.homeTeam;
  const userIsBatting = (gameState.halfInning === 'top' && !userIsHome) || (gameState.halfInning === 'bottom' && userIsHome);

  // Get rosters for the user's team
  const myTeam = teams[userTeam];
  const myBattingLineup = userIsHome ? gameState.homeLineup : gameState.awayLineup;
  const myFieldingLineup = userIsHome ? gameState.homeLineup : gameState.awayLineup;

  // Current batter (user's team when they're batting, opponent's when user is pitching)
  const currentBattingLineup = gameState.halfInning === 'top' ? gameState.awayLineup : gameState.homeLineup;
  const currentBattingIndex = gameState.halfInning === 'top' ? gameState.awayBatterIndex : gameState.homeBatterIndex;
  const batter = currentBattingLineup[currentBattingIndex % currentBattingLineup.length];

  // The opposing pitcher the pinch-hitter will face
  const opposingPitcher = gameState.halfInning === 'top' ? gameState.homePitcher : gameState.awayPitcher;

  const runners = gameState.bases.map((b, i) => b ? { ...b, baseIndex: i } : null).filter(Boolean);

  // Track all bench players who have been used this game (pinch-hit, pinch-run, or defensive sub)
  const benchUsed = userIsHome ? (gameState.homeBenchUsed || []) : (gameState.awayBenchUsed || []);
  const usedNames = useMemo(() => {
    const names = new Set();
    const allLineup = [...gameState.homeLineup, ...gameState.awayLineup];
    allLineup.forEach(p => names.add(p.name));
    benchUsed.forEach(p => names.add(p.name));
    // Also include players in history (substituted out earlier)
    (gameState.homePlayerHistory || []).forEach(p => names.add(p.name));
    (gameState.awayPlayerHistory || []).forEach(p => names.add(p.name));
    return names;
  }, [gameState.homeLineup, gameState.awayLineup, benchUsed, gameState.homePlayerHistory, gameState.awayPlayerHistory]);

  // Show ALL bench players - used ones will be grayed out
  const myBench = useMemo(() => {
    if (!myTeam) return [];
    // DERIVED bench: full position-player roster minus anyone currently in the
    // game or already removed by an in-game substitution.  This ensures displaced
    // starters (pre-game lineup swaps) are available and starting players are not
    // listed.  Pre-game swaps never set a "used" flag.
    const fullRoster = [...(myTeam.lineup || []), ...(myTeam.bench || [])];
    return fullRoster.filter(p => !usedNames.has(p.name));
  }, [myTeam, usedNames]);

  const isBenchUsed = (player) => usedNames.has(player.name);

  // Use in-game bullpen (relievers are removed as they're used)
  const bullpen = userIsHome ? (gameState.homeBullpen || []) : (gameState.awayBullpen || []);
  const currentPitcher = userIsHome ? gameState.homePitcher : gameState.awayPitcher;

  const tabs = [
    { id: 'pinchhit', label: 'Pinch Hit' },
    { id: 'pinchrun', label: 'Pinch Run', disabled: runners.length === 0 },
    { id: 'defense', label: 'Defense' },
    { id: 'pitching', label: 'Pitching' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex items-start justify-center pt-8 px-4 overflow-y-auto">
      <div className="max-w-md w-full bg-card border border-border rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <h2 className="font-heading text-sm font-bold text-foreground">Substitutions</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => !t.disabled && setTab(t.id)}
              disabled={t.disabled}
              className={`flex-1 py-2 text-[10px] font-heading uppercase tracking-wider transition-colors ${
                tab === t.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              } ${t.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {/* Pinch Hit */}
          {tab === 'pinchhit' && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Current Batter</div>
                <div className="font-heading font-bold text-sm text-foreground">{batter?.name}</div>
                <div className="flex gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span>CON {batter?.contact}</span>
                  <span>PWR {batter?.power}</span>
                  <span>SPD {batter?.speed}</span>
                </div>
              </div>

              <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                Bench ({myBench.length}) - {myTeam?.name}
              </div>

              {myBench.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No bench players available for {myTeam?.name}</p>
              ) : (
                <div className="space-y-1.5">
                  {myBench.map((p, i) => {
                    // Matchup vs opposing pitcher
                    const vsSameHand = p.bats === opposingPitcher?.throws;
                    const matchNote = vsSameHand ? 'vs same hand' : 'platoon adv.';
                    const conDelta = p.contact - (batter?.contact || 0);
                    const pwrDelta = p.power - (batter?.power || 0);
                    const used = isBenchUsed(p);

                    return (
                    <button
                      key={i}
                      onClick={() => !used && onPinchHit(p)}
                      disabled={used}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        used
                          ? 'border-border/40 opacity-40 cursor-not-allowed'
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-heading font-bold text-sm ${used ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {used ? 'USED' : `${p.pos} (${p.bats})`}
                        </span>
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px] items-center">
                        <span className="text-primary">
                          CON {p.contact}
                          {conDelta !== 0 && (
                            <span className={conDelta > 0 ? 'text-green-400 ml-0.5' : 'text-red-400/60 ml-0.5'}>
                              {conDelta > 0 ? '↑' : '↓'}{Math.abs(conDelta)}
                            </span>
                          )}
                        </span>
                        <span className="text-amber-400">
                          PWR {p.power}
                          {pwrDelta !== 0 && (
                            <span className={pwrDelta > 0 ? 'text-green-400 ml-0.5' : 'text-red-400/60 ml-0.5'}>
                              {pwrDelta > 0 ? '↑' : '↓'}{Math.abs(pwrDelta)}
                            </span>
                          )}
                        </span>
                        <span className="text-cyan-400">SPD {p.speed}</span>
                        {!used && (
                          <span className={`ml-auto text-[9px] ${vsSameHand ? 'text-red-400/60' : 'text-green-400/70'}`}>
                            {matchNote}
                          </span>
                        )}
                      </div>
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Pinch Run */}
          {tab === 'pinchrun' && (
            <div className="space-y-3">
              <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">Runners on Base</div>

              {runners.map((runner) => (
                <div key={runner.baseIndex} className="bg-muted/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading font-bold text-sm text-foreground">{runner.name}</span>
                    <span className="text-[10px] text-cyan-400 font-semibold">SPD {runner.speed}</span>
                  </div>

                  <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Replace with</div>
                  <div className="space-y-1">
                    {myBench.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No bench players available</p>
                    )}
                    {/* Show faster bench players first */}
                    {[...myBench].sort((a, b) => b.speed - a.speed).map((p, i) => {
                      const used = isBenchUsed(p);
                      return (
                      <button
                        key={i}
                        onClick={() => !used && p.speed > runner.speed && onPinchRun(runner.baseIndex, p)}
                        disabled={used || p.speed <= runner.speed}
                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                          used
                            ? 'border-border/40 opacity-40 cursor-not-allowed'
                            : p.speed > runner.speed
                              ? 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10'
                              : 'border-border/50 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-heading font-bold text-xs ${used ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{p.name}</span>
                          <div className="flex items-center gap-2">
                            {used ? (
                              <span className="text-[9px] text-muted-foreground">USED</span>
                            ) : (
                              <>
                                {p.speed > runner.speed && (
                                  <span className="text-[9px] text-cyan-400">↑{p.speed - runner.speed} SPD</span>
                                )}
                                <span className="text-[10px] text-cyan-400 font-semibold">SPD {p.speed}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {runners.length === 0 && (
                <p className="text-xs text-muted-foreground italic">No runners on base</p>
              )}
            </div>
          )}

          {/* Defensive Switch */}
          {tab === 'defense' && (
            <div className="space-y-3">
              <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">
                Defensive Alignment - {myTeam?.name}
              </div>

              {myFieldingLineup.filter(p => (p.assignedPos || p.pos) !== 'DH').map((player, idx) => {
                const actualIdx = myFieldingLineup.indexOf(player);
                const rawPos = player.assignedPos || player.pos;
                const currentPos = normalizePos(rawPos);
                const isPitcher = ['SP', 'RP', 'CL', 'P'].includes(rawPos);
                const isUsed = isBenchUsed(player);
                
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                      <span className="font-heading font-bold text-xs text-foreground flex-1 truncate">{player.name}</span>
                      <select
                        value={currentPos}
                        onChange={(e) => onDefensiveSwitch(actualIdx, e.target.value, null)}
                        disabled={isPitcher}
                        className="w-14 bg-input border border-border rounded-md px-1.5 py-1 text-[10px] text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
                      >
                        {ALL_POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                      {currentPos !== normalizePos(player.pos) && !isPitcher && (
                        <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Replace with bench player */}
                    {myBench.length > 0 && !isPitcher && (
                      <div className="pl-2 space-y-1">
                        <div className="text-[9px] text-muted-foreground">Replace with bench:</div>
                        <div className="flex flex-wrap gap-1">
                          {myBench.map((benchPlayer, bi) => {
                            const used = isBenchUsed(benchPlayer);
                            return (
                              <button
                                key={bi}
                                onClick={() => !used && onDefensiveSwitch(actualIdx, normalizePos(benchPlayer.pos), benchPlayer)}
                                disabled={used}
                                className={`text-[9px] px-2 py-1 rounded border transition-all ${
                                  used
                                    ? 'border-border/40 opacity-40 cursor-not-allowed text-muted-foreground'
                                    : 'border-border hover:border-primary hover:bg-primary/10 text-foreground'
                                }`}
                              >
                                {benchPlayer.name.split(' ').pop()} ({normalizePos(benchPlayer.pos)})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {isPitcher && (
                      <div className="text-[9px] text-amber-400 italic pl-1">
                        ⚠ Use Pitching tab to replace pitcher
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Pitching Change */}
          {tab === 'pitching' && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-1">Current Pitcher</div>
                <div className="font-heading font-bold text-sm text-foreground">{currentPitcher?.name}</div>
                <div className="flex gap-3 mt-1 text-[10px]">
                  <span className="text-muted-foreground">{currentPitcher?.gameStats?.pitches || 0} P</span>
                  <span className="text-emerald-400">SPD {currentPitcher?.pitchSpeed}</span>
                  <span className="text-purple-400">OFF {currentPitcher?.offSpeed}</span>
                  <span className="text-blue-400">CTL {currentPitcher?.control}</span>
                </div>
              </div>

              <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground">
                Bullpen ({bullpen.length})
              </div>

              {bullpen.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No relievers available</p>
              ) : (
                <div className="space-y-1.5">
                  {bullpen.map((p, i) => {
                    const unavailableReason = unavailableRelievers[p.name];
                    const unavailable = !!unavailableReason;
                    return (
                    <button
                      key={i}
                      onClick={() => !unavailable && onChangePitcher(p)}
                      disabled={unavailable}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        unavailable
                          ? 'border-border/40 opacity-40 cursor-not-allowed'
                          : 'border-border hover:border-primary hover:bg-primary/5'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className={`font-heading font-bold text-sm ${unavailable ? 'text-muted-foreground' : 'text-foreground'}`}>{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{unavailable ? 'UNAVAILABLE' : `${p.pos} (${p.throws}HP)`}</span>
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px]">
                        <span className="text-emerald-400">SPD {p.pitchSpeed}</span>
                        <span className="text-purple-400">OFF {p.offSpeed}</span>
                        <span className="text-blue-400">CTL {p.control}</span>
                        <span className="text-muted-foreground">STA {p.stamina}</span>
                      </div>
                      {unavailable && <div className="text-[9px] text-amber-400 mt-1">{unavailableReason}</div>}
                    </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}