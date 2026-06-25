import React from 'react';
import { X } from 'lucide-react';

export default function ChurchBakeSalePopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥧</span>
            <h2 className="font-heading text-xl font-bold text-primary">Women's Auxiliary Bake Sale</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            The women's auxiliary is hosting a bake sale at the church hall this weekend. All proceeds support youth programs and community outreach initiatives. Come enjoy fresh-baked goodness while supporting a great cause!
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">What You'll Find:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-foreground/80">
              <div>🍰 Fresh Cakes & Pies</div>
              <div>🍪 Homemade Cookies</div>
              <div>🧁 Cupcakes & Pastries</div>
              <div>🥐 Donuts & Breads</div>
              <div>🍩 Brownies</div>
              <div>🍫 Fudge & Candy</div>
            </div>
          </div>
          <div className="bg-primary/5 rounded-lg p-3">
            <p className="text-xs text-foreground font-heading font-bold">When:</p>
            <p className="text-xs text-foreground/80">Saturday & Sunday at the Church Hall</p>
            <p className="text-xs text-foreground font-heading font-bold mt-2">Why:</p>
            <p className="text-xs text-foreground/80">Supporting the local food bank & youth programs</p>
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