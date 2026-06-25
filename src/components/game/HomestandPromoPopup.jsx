import React from 'react';
import { X } from 'lucide-react';

export default function HomestandPromoPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎩</span>
            <h2 className="font-heading text-xl font-bold text-primary">Next Homestand Special Events</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            This homestand is packed with exciting promotions and giveaways! Get to the ballpark early for exclusive merchandise and fan experiences you won't find anywhere else.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">Featured Promotions:</h3>
            <div className="space-y-2 text-xs text-foreground/80">
              <div className="border-l-2 border-primary/30 pl-3">
                <p className="font-bold text-primary/80">Cap Night</p>
                <p>First 5,000 fans get an exclusive team cap!</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-3">
                <p className="font-bold text-primary/80">Magnetic Schedule Giveaway</p>
                <p>Free printed schedules with special magnetic backing.</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-3">
                <p className="font-bold text-primary/80">Family Package Specials</p>
                <p>Save when you bring the whole family!</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Visit the box office for tickets and details on all homestand events.
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