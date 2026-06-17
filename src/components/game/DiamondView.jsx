import React from 'react';

export default function DiamondView({ bases, lastPlay, isDay = false }) {
  const getPlayTypeColor = (type) => {
    if (!type) return '';
    const colors = {
      homerun: 'text-yellow-400',
      triple: 'text-green-400',
      double: 'text-blue-400',
      single: 'text-emerald-400',
      walk: 'text-cyan-400',
      strikeout: 'text-red-400',
      groundout: 'text-muted-foreground',
      flyout: 'text-muted-foreground',
      lineout: 'text-muted-foreground',
      doubleplay: 'text-red-500',
      sacfly: 'text-amber-400',
    };
    return colors[type] || '';
  };

  const skyBg = isDay
    ? 'bg-gradient-to-b from-[#e8f0fe] via-[#dce8f8] to-[#f5f0e0]'
    : 'bg-card';

  const grassColor = isDay ? 'bg-emerald-600/40' : 'bg-secondary/30';
  const grassBorder = isDay ? 'border-emerald-600/50' : 'border-secondary/40';
  const dirtFill = isDay ? '#c4a462' : 'hsl(30, 40%, 25%)';
  const dirtStroke = isDay ? '#b8943c' : 'hsl(30, 40%, 35%)';
  const moundFill = isDay ? '#d4b46c' : 'hsl(30, 35%, 30%)';
  const moundStroke = isDay ? '#c4a462' : 'hsl(45, 30%, 55%)';

  return (
    <div className={`relative w-full aspect-square max-w-[260px] sm:max-w-[300px] mx-auto rounded-xl overflow-hidden ${skyBg} transition-colors duration-500`}>
      {/* Outfield grass */}
      <div className="absolute inset-0 rounded-t-full overflow-hidden">
        <div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[140%] aspect-square rounded-full ${grassColor} border-2 ${grassBorder}`}
          style={{ bottom: '-35%' }}
        />
      </div>

      {/* Infield diamond */}
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10">
        {/* Infield dirt */}
        <polygon
          points="100,40 160,100 100,160 40,100"
          fill={dirtFill}
          stroke={dirtStroke}
          strokeWidth="1"
        />

        {/* Base paths */}
        <line x1="100" y1="40" x2="160" y2="100" stroke={isDay ? '#d4b46c' : "hsl(45, 30%, 60%)"} strokeWidth="1.5" opacity="0.5" />
        <line x1="160" y1="100" x2="100" y2="160" stroke={isDay ? '#d4b46c' : "hsl(45, 30%, 60%)"} strokeWidth="1.5" opacity="0.5" />
        <line x1="100" y1="160" x2="40" y2="100" stroke={isDay ? '#d4b46c' : "hsl(45, 30%, 60%)"} strokeWidth="1.5" opacity="0.5" />
        <line x1="40" y1="100" x2="100" y2="40" stroke={isDay ? '#d4b46c' : "hsl(45, 30%, 60%)"} strokeWidth="1.5" opacity="0.5" />

        {/* Pitcher's mound */}
        <circle cx="100" cy="105" r="6" fill={moundFill} stroke={moundStroke} strokeWidth="1" />
        <rect x="97" y="103" width="6" height="1.5" fill="white" rx="0.5" />

        {/* Home plate */}
        <polygon points="100,160 96,156 96,152 104,152 104,156" fill="white" />

        {/* 1st base */}
        <rect
          x="155" y="95" width="10" height="10"
          fill={bases[0] ? 'hsl(38, 85%, 55%)' : 'white'}
          transform="rotate(45, 160, 100)"
          className="transition-colors duration-300"
        />

        {/* 2nd base */}
        <rect
          x="95" y="35" width="10" height="10"
          fill={bases[1] ? 'hsl(38, 85%, 55%)' : 'white'}
          transform="rotate(45, 100, 40)"
          className="transition-colors duration-300"
        />

        {/* 3rd base */}
        <rect
          x="35" y="95" width="10" height="10"
          fill={bases[2] ? 'hsl(38, 85%, 55%)' : 'white'}
          transform="rotate(45, 40, 100)"
          className="transition-colors duration-300"
        />

        {/* Runner dots */}
        {bases[0] && <circle cx="160" cy="100" r="5" fill="hsl(38, 85%, 55%)" stroke="white" strokeWidth="1.5" className="animate-pulse" />}
        {bases[1] && <circle cx="100" cy="40" r="5" fill="hsl(38, 85%, 55%)" stroke="white" strokeWidth="1.5" className="animate-pulse" />}
        {bases[2] && <circle cx="40" cy="100" r="5" fill="hsl(38, 85%, 55%)" stroke="white" strokeWidth="1.5" className="animate-pulse" />}
      </svg>

      {/* Runner names with speed */}
      {bases[0] && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] text-primary font-heading font-semibold bg-card/80 px-1.5 py-0.5 rounded">
          {bases[0].name.split(' ').pop()}
          <span className="text-[8px] text-muted-foreground ml-0.5 align-top">SPD{bases[0].speed}</span>
        </div>
      )}
      {bases[1] && (
        <div className="absolute left-1/2 -translate-x-1/2 top-2 text-[10px] text-primary font-heading font-semibold bg-card/80 px-1.5 py-0.5 rounded">
          {bases[1].name.split(' ').pop()}
          <span className="text-[8px] text-muted-foreground ml-0.5 align-top">SPD{bases[1].speed}</span>
        </div>
      )}
      {bases[2] && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 text-[10px] text-primary font-heading font-semibold bg-card/80 px-1.5 py-0.5 rounded">
          {bases[2].name.split(' ').pop()}
          <span className="text-[8px] text-muted-foreground ml-0.5 align-top">SPD{bases[2].speed}</span>
        </div>
      )}


    </div>
  );
}