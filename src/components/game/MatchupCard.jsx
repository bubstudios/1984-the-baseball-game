import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { AlertTriangle } from 'lucide-react';

export default function MatchupCard({ batter, adjustedBatter, pitcher, halfInning, homeTeam, awayTeam }) {
  const battingTeamKey = halfInning === 'top' ? awayTeam : homeTeam;
  const pitchingTeamKey = halfInning === 'top' ? homeTeam : awayTeam;
  const battingTeam = TEAMS[battingTeamKey];
  const pitchingTeam = TEAMS[pitchingTeamKey];

  const displayBatter = adjustedBatter || batter;
  const displayPos = batter.assignedPos || batter.pos;
  const isPitcher = ['SP','CL','RP','SP/RP','P'].includes(batter.pos) || batter.assignedPos === 'SP';
  const isOutOfPosition = !isPitcher && batter.assignedPos && batter.assignedPos !== 'DH' && batter.assignedPos !== batter.pos;
  const isCountAdjusted = adjustedBatter && (adjustedBatter.baseContact !== adjustedBatter.contact || adjustedBatter.basePower !== adjustedBatter.power);
  // Split advantage: compare base (pre-count) adjusted rating vs raw batter rating
  const splitContactDiff = adjustedBatter ? (adjustedBatter.baseContact ?? adjustedBatter.contact) - batter.contact : 0;
  const splitPowerDiff = adjustedBatter ? (adjustedBatter.basePower ?? adjustedBatter.power) - batter.power : 0;

  return (
    <div className="flex items-center justify-between gap-3">
      {/* Batter */}
      <div className="flex-1 bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-heading uppercase tracking-wider text-primary font-semibold">At Bat</span>
          <span className="text-[10px] text-muted-foreground">{battingTeam?.abbr || ''}</span>
        </div>
        <div className="font-heading font-bold text-sm text-foreground truncate">
          {batter.name}
          {batter.bats && <span className="text-[10px] text-muted-foreground ml-1">({batter.bats})</span>}
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className={`text-[10px] font-bold ${isOutOfPosition ? 'text-orange-400' : 'text-primary'} flex items-center gap-0.5`}>
            #{batter.order}
            {isOutOfPosition && <AlertTriangle className="w-3 h-3" />}
          </span>
          <span className="text-[10px] font-semibold text-primary">
            CON {displayBatter.contact}
            {isCountAdjusted && displayBatter.contact !== displayBatter.baseContact ? (
              <span className={`text-[9px] ml-0.5 ${displayBatter.contact > displayBatter.baseContact ? 'text-green-400' : 'text-red-400'}`}>
                {displayBatter.contact > displayBatter.baseContact ? '▲' : '▼'}
              </span>
            ) : splitContactDiff !== 0 && (
              <span className={`text-[9px] ml-0.5 ${splitContactDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {splitContactDiff > 0 ? '▲' : '▼'}
              </span>
            )}
          </span>
          <span className="text-[10px] font-semibold text-amber-400">
            PWR {displayBatter.power}
            {isCountAdjusted && displayBatter.power !== displayBatter.basePower ? (
              <span className={`text-[9px] ml-0.5 ${displayBatter.power > displayBatter.basePower ? 'text-green-400' : 'text-red-400'}`}>
                {displayBatter.power > displayBatter.basePower ? '▲' : '▼'}
              </span>
            ) : splitPowerDiff !== 0 && (
              <span className={`text-[9px] ml-0.5 ${splitPowerDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {splitPowerDiff > 0 ? '▲' : '▼'}
              </span>
            )}
          </span>
          <span className="text-[10px] text-cyan-400 font-semibold">SPD {displayBatter.speed}</span>
          <span className={`text-[10px] ${isOutOfPosition ? 'text-orange-400' : 'text-muted-foreground'}`}>DEF {displayBatter.defense}</span>
        </div>
        {batter.gameStats && (
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground/70">
            <span>{batter.gameStats.hits}-{batter.gameStats.ab}</span>
            {batter.gameStats.hr > 0 && <span className="text-primary">{batter.gameStats.hr} HR</span>}
            {batter.gameStats.rbi > 0 && <span>{batter.gameStats.rbi} RBI</span>}
            {batter.gameStats.sb > 0 && <span className="text-amber-400">{batter.gameStats.sb} SB</span>}
          </div>
        )}
        {/* Count modifier reason */}
        {displayBatter.countModReason && (
          <div className={`mt-1 text-[9px] font-heading italic px-1.5 py-0.5 rounded ${
            displayBatter.countModReason.includes('Down') || displayBatter.countModReason.includes('Behind')
              ? 'bg-red-500/10 text-red-400'
              : 'bg-green-500/10 text-green-400'
          }`}>
            {displayBatter.countModReason}
          </div>
        )}
      </div>

      {/* VS */}
      <div className="text-[10px] text-muted-foreground font-display">VS</div>

      {/* Pitcher */}
      <div className="flex-1 bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-heading uppercase tracking-wider text-secondary font-semibold">Pitching</span>
          <span className="text-[10px] text-muted-foreground">{pitchingTeam?.abbr || ''}</span>
          {pitcher.fatigueLevel > 0 && (
            <span className={`text-[9px] font-heading font-bold rounded px-1.5 py-0.5 ${pitcher.fatigueLevel >= 3 ? 'bg-red-500/20 text-red-400' : pitcher.fatigueLevel >= 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-amber-500/20 text-amber-400'}`}>
              {pitcher.fatigueLevel >= 3 ? 'GASSED' : pitcher.fatigueLevel >= 2 ? 'TIRING' : 'FADING'}
            </span>
          )}
        </div>
        <div className="font-heading font-bold text-sm text-foreground truncate">
          {pitcher.name}
          {pitcher.throws && <span className="text-[10px] text-muted-foreground ml-1">({pitcher.throws}HP)</span>}
        </div>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[10px] text-muted-foreground">{pitcher.assignedPos || pitcher.pos}</span>
          <span className={`text-[10px] font-semibold ${pitcher.fatigueSpeedPen ? 'text-orange-400' : 'text-emerald-400'}`}>
            SPD {pitcher.effectivePitchSpeed || pitcher.pitchSpeed}
            {pitcher.fatigueSpeedPen > 0 && <span className="text-[9px] text-red-400 ml-0.5">-{pitcher.fatigueSpeedPen}</span>}
          </span>
          <span className="text-[10px] text-purple-400 font-semibold">OFF {pitcher.offSpeed}</span>
          <span className={`text-[10px] font-semibold ${pitcher.fatigueControlPen ? 'text-orange-400' : 'text-blue-400'}`}>
            CTL {pitcher.effectiveControl || pitcher.control}
            {pitcher.fatigueControlPen > 0 && <span className="text-[9px] text-red-400 ml-0.5">-{pitcher.fatigueControlPen}</span>}
          </span>
        </div>
        {pitcher.gameStats && (
          <div className="flex gap-2 mt-1 text-[10px] text-muted-foreground/70">
            <span>{pitcher.gameStats.ip?.toFixed(1) || 0} IP</span>
            <span>{pitcher.gameStats.so} K</span>
            <span>{pitcher.gameStats.bb} BB</span>
          </div>
        )}
      </div>
    </div>
  );
}