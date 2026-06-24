import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function InlineAdBanner({ entry, onDismiss }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  if (!visible) return null;

  // Color scheme by type for inline banners
  const typeColors = {
    sponsor: 'bg-muted/50 border-muted-foreground/30 text-foreground',
    charity: 'bg-green-950/40 border-green-600/30 text-green-100',
    service: 'bg-blue-950/40 border-blue-600/30 text-blue-100',
  };

  const colors = typeColors[entry.type] || 'bg-muted/50 border-muted-foreground/30 text-foreground';

  return (
    <div className={`${colors} border rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 fade-in duration-300`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-heading text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {entry.label || 'Message'}
          </div>
          <h3 className="font-heading text-sm font-bold text-foreground mb-1">{entry.title}</h3>
          <p className="text-xs text-muted-foreground">{entry.description}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}