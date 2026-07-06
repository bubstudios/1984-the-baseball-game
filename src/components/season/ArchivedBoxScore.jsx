import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { X } from 'lucide-react';

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

function buildFootnotes(boxScore) {
  const notes = [];
  const batting = boxScore?.batting || [];
  const homeBat = batting.filter(b => b.teamKey === boxScore?.homeTeam);
  const awayBat = batting.filter(b => b.teamKey === boxScore?.awayTeam);

  const collect = (players, prefix) => {
    const hrs = players.filter(p => p.hr > 0);
    const dbls = players.filter(p => p.doubles > 0);
    const trps = players.filter(p => p.triples > 0);
    const sbs = players.filter(p => p.sb > 0);
    hrs.forEach(p => notes.push(`${prefix}: ${lastName(p.name)} (${p.hr})`));
    dbls.forEach(p => notes.push(`${prefix}: ${lastName(p.name)} 2B (${p.doubles})`));
    trps.forEach(p => notes.push(`${prefix}: ${lastName(p.name)} 3B (${p.triples})`));
    sbs.forEach(p => notes.push(`${prefix}: ${lastName(p.name)} SB (${p.sb})`));
  };
  collect(awayBat, 'a');
  collect(homeBat, 'h');
  return notes;
}

export default function ArchivedBoxScore({ gameResult, onClose }) {
  if (!gameResult) return null;
  const bs = gameResult.boxScore;
  const home = TEAMS[gameResult.homeTeam];
  const away = TEAMS[gameResult.awayTeam];
  const innings = gameResult.innings || bs?.innings || [];
  const batting = bs?.batting || [];
  const pitching = bs?.pitching || [];
  const footnotes = buildFootnotes(bs);

  const homeBat = batting.filter(b => b.teamKey === gameResult.homeTeam);
  const awayBat = batting.filter(b => b.teamKey === gameResult.awayTeam);
  const homePitch = pitching.filter(p => p.teamKey === gameResult.homeTeam);
  const awayPitch = pitching.filter(p => p.teamKey === gameResult.awayTeam);

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

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
          {/* Line score */}
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
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="py-1 px-1 font-heading font-bold text-foreground">{away?.abbr}</td>
                  {innings.map((inn, i) => (
                    <td key={i} className="text-center py-1 px-1 text-foreground">{inn.away ?? 0}</td>
                  ))}
                  <td className="text-center py-1 px-1 font-heading font-bold text-primary border-l border-border">{gameResult.awayScore}</td>
                  <td className="text-center py-1 px-1 text-foreground">{gameResult.awayHits}</td>
                </tr>
                <tr>
                  <td className="py-1 px-1 font-heading font-bold text-foreground">{home?.abbr}</td>
                  {innings.map((inn, i) => (
                    <td key={i} className="text-center py-1 px-1 text-foreground">{inn.home ?? 0}</td>
                  ))}
                  <td className="text-center py-1 px-1 font-heading font-bold text-primary border-l border-border">{gameResult.homeScore}</td>
                  <td className="text-center py-1 px-1 text-foreground">{gameResult.homeHits}</td>
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

          {/* W/L/S */}
          <div className="text-[10px] text-muted-foreground space-y-0.5 mb-3">
            <div>W: {gameResult.winningPitcher || 'TBD'}</div>
            <div>L: {gameResult.losingPitcher || 'TBD'}</div>
            {gameResult.savePitcher && <div>S: {gameResult.savePitcher}</div>}
          </div>

          {/* Footnotes */}
          {footnotes.length > 0 && (
            <div className="text-[9px] text-muted-foreground/70 border-t border-border/50 pt-2">
              {footnotes.join('  ·  ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}