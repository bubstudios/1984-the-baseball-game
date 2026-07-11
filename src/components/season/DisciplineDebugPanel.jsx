import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { recordPlayerSuspension } from '@/lib/playerDiscipline';

// DisciplineDebugPanel - temporary debug buttons for testing player ejections/suspensions.
// These force-trigger events that are too rare to test naturally.
export default function DisciplineDebugPanel({ season, activePlayerSuspensions, onClose }) {
  const [teamKey, setTeamKey] = useState(season?.userTeam || 'tigers');
  const [result, setResult] = useState(null);

  const handleForceSuspension = async (reason, label) => {
    if (!season) return;
    const team = TEAMS[teamKey];
    if (!team) return;
    // Pick a random player from the team
    const lineup = team.lineup || team.battingOrder || [];
    const player = lineup[Math.floor(Math.random() * lineup.length)];
    if (!player) {
      setResult({ error: 'No players found for ' + teamKey });
      return;
    }
    const todayDate = season.currentDate || '1984-04-02';
    const gameDay = season.currentGameDay || 1;
    const res = await recordPlayerSuspension(
      season.id, teamKey, player.name, player.pos || 'OF',
      reason, todayDate, gameDay, 5
    );
    setResult({ label, player: player.name, team: teamKey, ...res });
  };

  const teams = Object.keys(TEAMS).filter(k => TEAMS[k].lineup || TEAMS[k].battingOrder);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl max-w-md w-full p-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Discipline Debug
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-3">
          <label className="text-[10px] font-heading text-muted-foreground block mb-1">TEAM</label>
          <select
            value={teamKey}
            onChange={(e) => setTeamKey(e.target.value)}
            className="w-full bg-muted border border-border rounded-md px-2 py-1 text-xs text-foreground"
          >
            {teams.map(k => (
              <option key={k} value={k}>{TEAMS[k].city} {TEAMS[k].name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2 mb-3">
          <Button onClick={() => handleForceSuspension('hbp_after_warning', 'HBP After Warning')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Pitcher HBP Ejection + Suspension
          </Button>
          <Button onClick={() => handleForceSuspension('obvious_retaliation', 'Obvious Retaliation')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Obvious Retaliation Suspension
          </Button>
          <Button onClick={() => handleForceSuspension('arguing_strikes', 'Arguing Strikes')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Batter Argues Strike Three
          </Button>
          <Button onClick={() => handleForceSuspension('charging_mound', 'Charging Mound')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Charging the Mound
          </Button>
          <Button onClick={() => handleForceSuspension('fight_participant', 'Fight Participant')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Fight Participant
          </Button>
          <Button onClick={() => handleForceSuspension('bench_clearing_major', 'Bench-Clearing')} variant="outline" size="sm" className="w-full text-[10px] gap-1">
            <Zap className="w-3 h-3" /> Force Bench-Clearing Brawl
          </Button>
        </div>

        {result && (
          <div className="bg-muted/50 rounded-md p-2 mb-3 text-[10px]">
            {result.error ? (
              <p className="text-red-400">{result.error}</p>
            ) : (
              <>
                <p className="text-foreground font-bold">{result.label}</p>
                <p className="text-muted-foreground">Player: {result.player} ({result.team})</p>
                <p className={result.suspended ? 'text-amber-400' : 'text-muted-foreground'}>
                  {result.suspended ? `Suspended ${result.games} game(s) - ${result.reason}` : 'No suspension rolled'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Active player suspensions list */}
        <div className="border-t border-border pt-2">
          <p className="text-[10px] font-heading font-bold text-muted-foreground mb-1">
            ACTIVE PLAYER SUSPENSIONS ({activePlayerSuspensions.length})
          </p>
          {activePlayerSuspensions.length === 0 ? (
            <p className="text-[10px] text-muted-foreground/60">None</p>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {activePlayerSuspensions.map((s, i) => (
                <div key={i} className="text-[10px] text-foreground bg-muted/30 rounded px-2 py-1">
                  <span className="font-bold">{s.playerName}</span>
                  <span className="text-muted-foreground"> ({s.teamKey}) - {s.gamesRemaining}G left</span>
                  <span className="text-muted-foreground/60 block">{s.suspensionReason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}