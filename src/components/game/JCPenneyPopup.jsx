import React from 'react';
import { X } from 'lucide-react';

export default function JCPenneyPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👗</span>
            <h2 className="font-heading text-xl font-bold text-primary">JCPenney's Fashion Forward Style</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            JCPenney brings the hottest trends of 1984 straight to your local shopping center. From preppy pastels to bold geometric prints, we have everything your family needs for the new season.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">This Season's Essentials:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
              <div>• Pastel Blazers</div>
              <div>• Acid Wash Denim</div>
              <div>• Leg Warmers</div>
              <div>• Popped Collars</div>
              <div>• Oversized Sweaters</div>
              <div>• Miami Vice Prints</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">
            Visit JCPenney today and get 20% off select items. Your style is our priority.
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