import React, { useRef, useEffect } from 'react';

const typeStyles = {
  homerun: 'text-yellow-400 font-bold',
  triple: 'text-green-400',
  double: 'text-blue-400',
  single: 'text-emerald-400',
  walk: 'text-cyan-400',
  strikeout: 'text-red-400',
  strike: 'text-orange-300/70',
  ball: 'text-muted-foreground/70',
  foul: 'text-muted-foreground/60',
  groundout: 'text-muted-foreground',
  flyout: 'text-muted-foreground',
  lineout: 'text-muted-foreground',
  doubleplay: 'text-red-400',
  sacfly: 'text-amber-400',
  steal: 'text-amber-400 font-semibold',
  caughtstealing: 'text-red-400',
  info: 'text-primary font-semibold',
};

export default function PlayLog({ log }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log.length]);

  const recent = log.slice(-30);

  return (
    <div ref={scrollRef} className="h-40 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
      {recent.length === 0 && (
        <p className="text-muted-foreground/50 text-xs italic font-body">Play-by-play will appear here...</p>
      )}
      {recent.map((entry, i) => (
        <div
          key={log.length - recent.length + i}
          className={`text-xs font-body leading-relaxed ${typeStyles[entry.type] || 'text-muted-foreground'}`}
        >
          {entry.text}
        </div>
      ))}
    </div>
  );
}