import React from 'react';

export default function Scoreboard({ innings, score, currentInning, halfInning, awayAbbr, homeAbbr }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-[11px] font-heading">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1 px-1.5 text-muted-foreground font-medium w-12">TEAM</th>
            {innings.map((_, i) => (
              <th
                key={i}
                className={`text-center py-1 px-1 min-w-[18px] font-medium ${
                  i + 1 === currentInning ? 'text-primary bg-primary/10 rounded' : 'text-muted-foreground'
                }`}
              >
                {i + 1}
              </th>
            ))}
            <th className="text-center py-1 px-1.5 text-primary font-bold border-l border-border min-w-[22px] text-[10px]">R</th>
            <th className="text-center py-1 px-1.5 text-muted-foreground font-medium min-w-[22px] text-[10px]">H</th>
          </tr>
        </thead>
        <tbody>
          <tr className={`border-b border-border/50 ${halfInning === 'top' ? 'bg-muted/30' : ''}`}>
            <td className="py-1 px-1.5 font-bold text-foreground">{awayAbbr}</td>
            {innings.map((inn, i) => (
              <td key={i} className={`text-center py-1 px-1 ${i + 1 === currentInning && halfInning === 'top' ? 'text-primary font-bold' : 'text-foreground/70'}`}>
                {inn.away !== null ? inn.away : '-'}
              </td>
            ))}
            <td className="text-center py-1 px-1.5 font-bold text-primary border-l border-border">{score.away}</td>
            <td className="text-center py-1 px-1.5 text-muted-foreground">-</td>
          </tr>
          <tr className={`${halfInning === 'bottom' ? 'bg-muted/30' : ''}`}>
            <td className="py-1 px-1.5 font-bold text-foreground">{homeAbbr}</td>
            {innings.map((inn, i) => (
              <td key={i} className={`text-center py-1 px-1 ${i + 1 === currentInning && halfInning === 'bottom' ? 'text-primary font-bold' : 'text-foreground/70'}`}>
                {inn.home !== null ? inn.home : '-'}
              </td>
            ))}
            <td className="text-center py-1 px-1.5 font-bold text-primary border-l border-border">{score.home}</td>
            <td className="text-center py-1 px-1.5 text-muted-foreground">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}