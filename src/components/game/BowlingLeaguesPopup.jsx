import React from 'react';
import { X } from 'lucide-react';

export default function BowlingLeaguesPopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎳</span>
            <h2 className="font-heading text-xl font-bold text-primary">Bowling Leagues Now Forming</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Join the bowling craze sweeping the nation! Whether you're a seasoned bowler or just looking for a fun night out, there's a league for you. Bowling alleys are the hottest social destination for friends and families.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">League Options:</h3>
            <ul className="text-xs text-foreground/80 space-y-1 ml-4">
              <li>• Competitive leagues (Tuesday & Thursday nights)</li>
              <li>• Casual recreation bowling</li>
              <li>• Corporate team leagues</li>
              <li>• Youth and junior programs</li>
              <li>• Weekend mixed leagues</li>
            </ul>
          </div>
          <div className="bg-primary/5 rounded-lg p-3">
            <p className="text-xs text-foreground font-heading font-bold">Sign-up Bonus:</p>
            <p className="text-xs text-foreground/80">Free shoe rental for first two weeks!</p>
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