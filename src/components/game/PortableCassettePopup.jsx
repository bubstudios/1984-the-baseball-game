import React from 'react';
import { X } from 'lucide-react';

export default function PortableCassettePopup({ onDismiss }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card border-2 border-primary/50 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-card border-b border-primary/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎧</span>
            <h2 className="font-heading text-xl font-bold text-primary">Portable Cassette Players</h2>
          </div>
          <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-foreground leading-relaxed">
            Music lovers continue to embrace portable cassette technology! Whether it's a Sony Walkman or similar model, these devices let you take your favorite music with you wherever you go. The freedom to enjoy any album on the move has revolutionized personal audio.
          </p>
          <div className="bg-muted/50 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-heading text-sm font-bold text-primary">Popular Models:</h3>
            <ul className="text-xs text-foreground/80 space-y-1 ml-4">
              <li>• Sony Walkman — The industry standard</li>
              <li>• Panasonic RQ — Compact and durable</li>
              <li>• Regency — Budget-friendly options</li>
              <li>• Toshiba KT — Japanese engineering</li>
            </ul>
          </div>
          <div className="bg-primary/5 rounded-lg p-3">
            <p className="text-xs text-foreground font-heading font-bold">Pro Tip:</p>
            <p className="text-xs text-foreground/80">Make your own custom mix tapes! Record your favorite songs and share them with friends.</p>
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