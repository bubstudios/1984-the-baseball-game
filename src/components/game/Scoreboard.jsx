import React from 'react';
import { TEAMS } from '@/lib/gameData';

export default function Scoreboard({ innings, score, currentInning, halfInning }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-xs font-heading">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-1.5 px-2 text-muted-foreground font-medium w-20">TEAM</th>
            {innings.map((_, i) => (
              <th
                key={i}
                className={`text-center py-1.5 px-1.5 min-w-[24px] font-medium ${
                  i + 1 === currentInning ? 'text-primary bg-primary/10 rounded' : 'text-muted-foreground'
                }`}
              >
                {i + 1}
              </th>
            ))}
            <th className="text-center py-1.5 px-2 text-primary font-bold border-l border-border min-w-[28px]">R</th>
            <th className="text-center py-1.5 px-2 text-muted-foreground font-medium min-w-[28px]">H</th>
          </tr>
        </thead>
        <tbody>
          {/* Away team */}
          <tr className={`border-b border-border/50 ${halfInning === 'top' ? 'bg-muted/30' : ''}`}>
            <td className="py-1.5 px-2 font-bold text-foreground">{TEAMS.away.abbr}</td>
            {innings.map((inn, i) => (
              <td key={i} className={`text-center py-1.5 px-1.5 ${i + 1 === currentInning && halfInning === 'top' ? 'text-primary font-bold' : 'text-foreground/70'}`}>
                {inn.away !== null ? inn.away : '-'}
              </td>
            ))}
            <td className="text-center py-1.5 px-2 font-bold text-primary border-l border-border">{score.away}</td>
            <td className="text-center py-1.5 px-2 text-muted-foreground">-</td>
          </tr>
          {/* Home team */}
          <tr className={`${halfInning === 'bottom' ? 'bg-muted/30' : ''}`}>
            <td className="py-1.5 px-2 font-bold text-foreground">{TEAMS.home.abbr}</td>
            {innings.map((inn, i) => (
              <td key={i} className={`text-center py-1.5 px-1.5 ${i + 1 === currentInning && halfInning === 'bottom' ? 'text-primary font-bold' : 'text-foreground/70'}`}>
                {inn.home !== null ? inn.home : '-'}
              </td>
            ))}
            <td className="text-center py-1.5 px-2 font-bold text-primary border-l border-border">{score.home}</td>
            <td className="text-center py-1.5 px-2 text-muted-foreground">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}