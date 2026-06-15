import React from 'react';

export default function CountDisplay({ balls, strikes, outs }) {
  return (
    <div className="flex items-center gap-6 font-heading">
      {/* Balls */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">B</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i < balls ? 'bg-green-500 shadow-sm shadow-green-500/30' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Strikes */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">S</span>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i < strikes ? 'bg-primary shadow-sm shadow-primary/30' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Outs */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground tracking-widest uppercase">O</span>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                i < outs ? 'bg-destructive shadow-sm shadow-destructive/30' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}