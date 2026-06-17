import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, Users } from 'lucide-react';

const ALL_POSITIONS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];

export default function SubstitutionsPanel({ gameState, teams, userTeam, onClose, onPinchHit, onPinchRun, onDefensiveSwitch, onChangePitcher, initialTab = 'pinchhit' }) {
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

  const runners = gameState.bases.map((b, i) => b ? { ...b, baseIndex: i } : null).filter(Boolean);

  // Available bench players for the user's team
  const usedNames = useMemo(() => {
    const names = new Set();
    const allLineup = [...gameState.homeLineup, ...gameState.awayLineup];
    allLineup.forEach(p => names.add(p.name));
    return names;
  }, [gameState.homeLineup, gameState.awayLineup]);

  const myBench = useMemo(() => {
    if (!myTeam?.bench) return [];
    return myTeam.bench.filter(p => !usedNames.has(p.name));
  }, [myTeam, usedNames]);

  const bullpen = myTeam?.bullpen || [];
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
                Available Bench ({myBench.length}) — {myTeam?.name}
              </div>

              {myBench.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No bench players available for {myTeam?.name}</p>
              ) : (
                <div className="space-y-1.5">
                  {myBench.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => onPinchHit(p)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-sm text-foreground">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.pos} ({p.bats})</span>
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px]">
                        <span className="text-primary">CON {p.contact}</span>
                        <span className="text-amber-400">PWR {p.power}</span>
                        <span className="text-cyan-400">SPD {p.speed}</span>
                      </div>
                    </button>
                  ))}
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
                    {myBench.filter(p => p.speed > runner.speed).length === 0 && myBench.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No bench players available</p>
                    )}
                    {/* Show faster bench players first */}
                    {[...myBench].sort((a, b) => b.speed - a.speed).map((p, i) => (
                      <button
                        key={i}
                        onClick={() => onPinchRun(runner.baseIndex, p)}
                        className={`w-full text-left p-2 rounded-lg border transition-all ${
                          p.speed > runner.speed
                            ? 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10'
                            : 'border-border/50 hover:border-primary/30 opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-heading font-bold text-xs text-foreground">{p.name}</span>
                          <div className="flex items-center gap-2">
                            {p.speed > runner.speed && (
                              <span className="text-[9px] text-cyan-400">↑{p.speed - runner.speed} SPD</span>
                            )}
                            <span className="text-[10px] text-cyan-400 font-semibold">SPD {p.speed}</span>
                          </div>
                        </div>
                      </button>
                    ))}
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
                Defensive Alignment — {myTeam?.name}
              </div>

              {myFieldingLineup.filter(p => (p.assignedPos || p.pos) !== 'DH' && p.pos !== 'SP').map((player, idx) => {
                const actualIdx = myFieldingLineup.indexOf(player);
                const currentPos = player.assignedPos || player.pos;
                return (
                  <div key={idx} className="flex items-center gap-2 bg-muted/30 rounded-lg p-2">
                    <span className="font-heading font-bold text-xs text-foreground flex-1 truncate">{player.name}</span>
                    <select
                      value={currentPos}
                      onChange={(e) => onDefensiveSwitch(actualIdx, e.target.value, null)}
                      className="w-14 bg-input border border-border rounded-md px-1.5 py-1 text-[10px] text-foreground text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {ALL_POSITIONS.map(pos => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                    {currentPos !== player.pos && (
                      <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    )}
                  </div>
                );
              })}

              {/* Replace fielder with bench player */}
              {myBench.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border">
                  <div className="text-[10px] font-heading uppercase tracking-wider text-muted-foreground mb-2">
                    Replace Fielder with Bench Player — {myTeam?.name}
                  </div>
                  {myFieldingLineup.filter(p => (p.assignedPos || p.pos) !== 'DH' && p.pos !== 'SP').map((player, fieldIdx) => {
                    const actualIdx = myFieldingLineup.indexOf(player);
                    const currentPos = player.assignedPos || player.pos;
                    return (
                      <div key={fieldIdx} className="mb-2">
                        <div className="text-[10px] text-muted-foreground mb-1">
                          Replace {player.name} ({currentPos}) with:
                        </div>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const benchPlayer = myBench.find(p => p.name === e.target.value);
                              if (benchPlayer) onDefensiveSwitch(actualIdx, currentPos, benchPlayer);
                            }
                          }}
                          className="w-full bg-input border border-border rounded-md px-2 py-1 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">-- Select bench player --</option>
                          {myBench.map((p, i) => (
                            <option key={i} value={p.name}>{p.name} ({p.pos}, CON {p.contact})</option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  {bullpen.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => onChangePitcher(p)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-heading font-bold text-sm text-foreground">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground">{p.pos} ({p.throws}HP)</span>
                      </div>
                      <div className="flex gap-3 mt-1 text-[10px]">
                        <span className="text-emerald-400">SPD {p.pitchSpeed}</span>
                        <span className="text-purple-400">OFF {p.offSpeed}</span>
                        <span className="text-blue-400">CTL {p.control}</span>
                        <span className="text-muted-foreground">STA {p.stamina}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}