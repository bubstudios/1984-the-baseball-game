import React from 'react';
import { X } from 'lucide-react';

export default function PepsiPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥤</span>
            <h2 className="font-heading text-xl font-bold text-primary">Pepsi: The Choice of a New Generation</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            It's the soda that's taking over the nation—sleek, bold, and unapologetically modern. Pepsi isn't just a drink; it's a lifestyle for the young and the young at heart.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">Why Pepsi?</h3>
            <ul className="text-xs text-foreground/80 space-y-1 ml-4">
              <li>✓ Refreshing taste that stands out</li>
              <li>✓ The drink of tomorrow's leaders</li>
              <li>✓ Cool, sleek packaging</li>
              <li>✓ Featured in the hottest nightclubs and concerts</li>
            </ul>
          </div>
          <div className="bg-primary/5 rounded-lg p-3 text-center">
            <p className="font-heading text-sm font-bold text-primary italic">
              "Pepsi — It's the real choice for a real generation."
            </p>
          </div>
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