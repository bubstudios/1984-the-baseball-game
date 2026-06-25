import React from 'react';
import { X } from 'lucide-react';

export default function FireworksNightPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🎆</span>
            <h2 className="font-heading text-xl font-bold text-primary">Fireworks Night at the Ballpark!</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            There's nothing quite like fireworks at the ballpark! As the crowd roars and the sun sets, the night sky lights up with brilliant colors and explosive bursts. It's an American tradition that gets everyone excited.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">What to Expect:</h3>
            <ul className="text-xs text-foreground/80 space-y-1 ml-4">
              <li>• Spectacular pyrotechnics after the game</li>
              <li>• Family-friendly fun for all ages</li>
              <li>• Patriotic and celebratory themes</li>
              <li>• Perfect photo opportunities</li>
              <li>• Unforgettable memories under the stars</li>
            </ul>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Mark your calendar! Fireworks nights are some of the most-attended games of the season. Arrive early for the best viewing spots.
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