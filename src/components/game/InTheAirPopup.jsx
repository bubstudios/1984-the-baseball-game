import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function InTheAirPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <h2 className="font-heading text-xl font-bold text-primary">Chicago: 'In the Air Tonight'</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            One of the biggest rock bands of the '80s brings the synthesizer-driven sound that defined a decade. With their latest album dropping, Chicago continues to dominate the airwaves and concert venues.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-heading text-sm font-bold text-primary">Featured Hits:</h3>
              <ul className="text-xs text-foreground/80 space-y-1 ml-4">
                <li>• "Hard to Say I'm Sorry"</li>
                <li>• "Hard Habit to Break"</li>
                <li>• "Look Away"</li>
                <li>• "Feeling Stronger Every Day"</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Pick up the latest Chicago album at record stores and music retailers this week.
          </p>
          <button
            onClick={onDismiss}
            className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-heading font-bold py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}