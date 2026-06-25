import React from 'react';
import { X } from 'lucide-react';

export default function OutdoorTimePopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏕️</span>
            <h2 className="font-heading text-xl font-bold text-primary">Spend Quality Time Outdoors</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            With summer in full swing, there's no better time to get outside with family and friends. From camping to picnics, hiking to fishing—the great outdoors awaits. Create memories that will last a lifetime!
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">Outdoor Ideas:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
              <div>🏕️ Camping & Campfires</div>
              <div>🎣 Fishing Trips</div>
              <div>🥾 Hiking Adventures</div>
              <div>🚴 Bike Riding</div>
              <div>🧺 Picnics & BBQs</div>
              <div>🌲 Nature Walks</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Check with your local parks department for camping sites, trails, and recreational facilities in your area. The summer season is the perfect time to disconnect and enjoy the outdoors!
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