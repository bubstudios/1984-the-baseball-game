import React, { useState, useEffect } from 'react';
import { TEAMS } from '@/lib/gameData';
import { X } from 'lucide-react';
import { base44 } from '@/api/base44Client';

function lastName(fullName) {
  if (!fullName) return '?';
  const parts = fullName.trim().split(' ');
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function formatIP(outs) {
  if (outs === undefined || outs === null) return '0.0';
  const inn = Math.floor(outs / 3);
  const rem = outs % 3;
  return `${inn}.${rem}`;
}

// ── Derive W/L/S names from the pitching array's w/l/sv flags ──
// This is the authoritative source - buildGameResultFromState always sets
// these flags. The top-level winningPitcher string can be null/stale.
function deriveDecisions(pitching, boxDecisions) {
  const result = { win: null, loss: null, save: null };
  for (const p of pitching) {
    if (p.w) result.win = p.name;
    if (p.l) result.loss = p.name;
    if (p.sv) result.save = p.name;
  }
  // Fallback: resolve from boxScore.decisions playerIds if flags missing
  if (!result.win && boxDecisions?.winner) {
    const found = pitching.find(p => p.playerId === boxDecisions.winner);
    if (found) result.win = found.name;
  }
  if (!result.loss && boxDecisions?.loser) {
    const found = pitching.find(p => p.playerId === boxDecisions.loser);
    if (found) result.loss = found.name;
  }
  if (!result.save && boxDecisions?.save) {
    const found = pitching.find(p => p.playerId === boxDecisions.save);
    if (found) result.save = found.name;
  }
  return result;
}

// ── Build the offensive summary (HR/2B/3B/RBI with season totals) ──
function buildGameSummary(batting, seasonTotals) {
  const lines = [];
  const fmt = (players, key, gameKey) => {
    const filtered = players.filter(p => (p[key] || 0) > 0);
    if (filtered.length === 0) return null;
    return filtered.map(p => {
      const game = p[key];
      const season = seasonTotals?.[p.playerId]?.[gameKey] ?? null;
      return season != null ? `${lastName(p.name)} ${game} (${season})` : `${lastName(p.name)} ${game}`;
    }).join(', ');
  };

  const hr = fmt(batting, 'hr', 'hr');
  if (hr) lines.push(`HR - ${hr}`);
  const dbl = fmt(batting, 'doubles', 'doubles');
  if (dbl) lines.push(`2B - ${dbl}`);
  const tpl = fmt(batting, 'triples', 'triples');
  if (tpl) lines.push(`3B - ${tpl}`);
  const rbi = fmt(batting, 'rbi', 'rbi');
  if (rbi) lines.push(`RBI - ${rbi}`);

  return lines;
}

export default function ArchivedBoxScore({ gameResult, onClose }) {
  const [seasonTotals, setSeasonTotals] = useState(
    gameResult?.boxScore?.seasonTotals || null
  );
  const [loadingTotals, setLoadingTotals] = useState(false);

  // If no precomputed seasonTotals on the boxScore, fetch from PlayerStats
  useEffect(() => {
    if (seasonTotals || !gameResult?.boxScore) return;
    const bs = gameResult.boxScore;
    const batting = bs.batting || [];
    if (batting.length === 0) return;

    let cancelled = false;
    const fetchTotals = async () => {
      try {
        setLoadingTotals(true);
        const playerIds = batting.map(b => b.playerId).filter(Boolean);
        const stats = await base44.entities.PlayerStats.filter({
          seasonId: gameResult.seasonId,
        }, null, 1500);
        const map = {};
        for (const s of stats) {
          const pid = `${s.team}|${s.playerName}`;
          if (playerIds.includes(pid)) {
            map[pid] = {
              hr: s.homeRuns || 0,
              doubles: s.doubles || 0,
              triples: s.triples || 0,
              rbi: s.rbi || 0,
            };
          }
        }
        if (!cancelled) setSeasonTotals(map);
      } catch (e) {
        // Non-fatal - summary will show without season totals
      } finally {
        if (!cancelled) setLoadingTotals(false);
      }
    };
    fetchTotals();
    return () => { cancelled = true; };
  }, [gameResult, seasonTotals]);

  if (!gameResult) return null;
  const bs = gameResult.boxScore;
  const home = TEAMS[gameResult.homeTeam];
  const away = TEAMS[gameResult.awayTeam];
  const innings = gameResult.innings || bs?.innings || [];
  const batting = bs?.batting || [];
  const pitching = bs?.pitching || [];
  const decisions = deriveDecisions(pitching, bs?.decisions);

  const homeBat = batting.filter(b => b.teamKey === gameResult.homeTeam);
  const awayBat = batting.filter(b => b.teamKey === gameResult.awayTeam);
  const homePitch = pitching.filter(p => p.teamKey === gameResult.homeTeam);
  const awayPitch = pitching.filter(p => p.teamKey === gameResult.awayTeam);

  const homeErrors = bs?.homeErrors ?? 0;
  const awayErrors = bs?.awayErrors ?? 0;
  const homeHits = gameResult.homeHits ?? homeBat.reduce((s, b) => s + (b.h || 0), 0);
  const awayHits = gameResult.awayHits ?? awayBat.reduce((s, b) => s + (b.h || 0), 0);

  const renderBattingTable = (players, teamName) => (
    <div className="mb-3">
      <div className="text-[10px] font-heading font-bold text-primary mb-1">{teamName}</div>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-1 px-1 font-medium">Player</th>
            <th className="text-center py-1 px-1 font-medium">AB</th>
            <th className="text-center py-1 px-1 font-medium">R</th>
            <th className="text-center py-1 px-1 font-medium">H</th>
            <th className="text-center py-1 px-1 font-medium">RBI</th>
            <th className="text-center py-1 px-1 font-medium">BB</th>
            <th className="text-center py-1 px-1 font-medium">SO</th>
            <th className="text-center py-1 px-1 font-medium">SB</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i} className="border-b border-border/20">
              <td className="py-1 px-1 text-foreground">{lastName(p.name)}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.ab}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.r}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.h}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.rbi}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.bb}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.so}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.sb || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPitchingTable = (players, teamName) => (
    <div className="mb-2">
      <div className="text-[10px] font-heading font-bold text-primary mb-1">{teamName}</div>
      <table className="w-full text-[10px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="text-left py-1 px-1 font-medium">Pitcher</th>
            <th className="text-center py-1 px-1 font-medium">IP</th>
            <th className="text-center py-1 px-1 font-medium">H</th>
            <th className="text-center py-1 px-1 font-medium">R</th>
            <th className="text-center py-1 px-1 font-medium">ER</th>
            <th className="text-center py-1 px-1 font-medium">BB</th>
            <th className="text-center py-1 px-1 font-medium">K</th>
            <th className="text-center py-1 px-1 font-medium">HR</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr key={i} className="border-b border-border/20">
              <td className="py-1 px-1 text-foreground">
                {lastName(p.name)}
                {p.w ? ' W' : p.l ? ' L' : p.sv ? ' S' : ''}
              </td>
              <td className="text-center py-1 px-1 text-foreground">{formatIP(p.outs)}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.h}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.r}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.er}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.bb}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.so}</td>
              <td className="text-center py-1 px-1 text-foreground">{p.hr || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const gameSummary = buildGameSummary(batting, seasonTotals);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-card border border-border rounded-xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-foreground">Box Score</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4">
          {/* Line score with R-H-E */}
          <div className="mb-4">
            <table className="w-full text-[10px]">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-1 px-1 font-medium"></th>
                  {innings.map((_, i) => (
                    <th key={i} className="text-center py-1 px-1 font-medium">{i + 1}</th>
                  ))}
                  <th className="text-center py-1 px-1 font-medium border-l border-border">R</th>
                  <th className="text-center py-1 px-1 font-medium">H</th>
                  <th className="text-center py-1 px-1 font-medium">E</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-1 px-1 font-heading font-bold text-foreground">{away?.abbr}</td>
                  {innings.map((inn, i) => (
                    <td key={i} className="text-center py-1 px-1 text-foreground">{inn.away ?? '-'}</td>
                  ))}
                  <td className="text-center py-1 px-1 font-heading font-bold text-primary border-l border-border">{gameResult.awayScore}</td>
                  <td className="text-center py-1 px-1 text-foreground">{awayHits}</td>
                  <td className="text-center py-1 px-1 text-foreground">{awayErrors}</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 font-heading font-bold text-foreground">{home?.abbr}</td>
                  {innings.map((inn, i) => (
                    <td key={i} className="text-center py-1 px-1 text-foreground">{inn.home !== null && inn.home !== undefined ? inn.home : 'X'}</td>
                  ))}
                  <td className="text-center py-1 px-1 font-heading font-bold text-primary border-l border-border">{gameResult.homeScore}</td>
                  <td className="text-center py-1 px-1 text-foreground">{homeHits}</td>
                  <td className="text-center py-1 px-1 text-foreground">{homeErrors}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Batting */}
          {renderBattingTable(awayBat, `${away?.city} ${away?.name}`)}
          {renderBattingTable(homeBat, `${home?.city} ${home?.name}`)}

          {/* Pitching */}
          {renderPitchingTable(awayPitch, `${away?.city} ${away?.name}`)}
          {renderPitchingTable(homePitch, `${home?.city} ${home?.name}`)}

          {/* W/L/S Decisions - derived from pitching array flags */}
          <div className="text-[10px] text-muted-foreground space-y-0.5 mb-3 border-t border-border pt-2">
            <div><span className="text-emerald-400 font-bold">W:</span> {decisions.win || 'TBD'}</div>
            <div><span className="text-red-400 font-bold">L:</span> {decisions.loss || 'TBD'}</div>
            {decisions.save ? (
              <div><span className="text-primary font-bold">S:</span> {decisions.save}</div>
            ) : (
              <div><span className="text-muted-foreground font-bold">S:</span> None</div>
            )}
          </div>

          {/* Game Stat Summary - HR/2B/3B/RBI with season totals */}
          {gameSummary.length > 0 && (
            <div className="text-[10px] text-muted-foreground border-t border-border/50 pt-2 space-y-0.5">
              {loadingTotals && <div className="italic text-muted-foreground/50">Loading season totals...</div>}
              {gameSummary.map((line, i) => (
                <div key={i} className="font-body">{line}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}