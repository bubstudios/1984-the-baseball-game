import React from 'react';
import { Radio, X } from 'lucide-react';

export default function InlineSponsorBanner({ banner, onTap, onHide }) {
  if (!banner) return null;

  return (
    <div className="relative bg-card border border-primary/40 rounded-xl px-4 py-3 text-center">
      {/* Close button */}
      <button
        onClick={onHide}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 transition-colors"
        aria-label="Close sponsor message"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-center gap-1.5 mb-1.5">
        <Radio className="w-3.5 h-3.5 text-primary" />
        <span className="text-[9px] font-heading uppercase tracking-[0.2em] text-primary">
          Sponsor Message
        </span>
      </div>

      {/* Main text */}
      <p className="text-sm font-heading font-semibold text-foreground leading-snug px-4">
        {banner.title}
      </p>

      {/* Subtext */}
      <p className="text-[10px] text-muted-foreground/50 italic mt-1">
        tap for details
      </p>

      {/* Tap target overlay */}
      <button
        onClick={onTap}
        className="absolute inset-0 w-full h-full cursor-pointer"
        aria-label="View sponsor details"
      />
    </div>
  );
}