import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function GenericBannerPopup({ entry, onDismiss }) {
  const [visible, setVisible] = useState(true);

  const handleDismiss = () => {
    setVisible(false);
    setTimeout(onDismiss, 200);
  };

  if (!visible) return null;

  // Color scheme by type
  const typeColors = {
    film: 'bg-yellow-900/80 border-yellow-600/50 text-yellow-100',
    charity: 'bg-green-900/80 border-green-600/50 text-green-100',
    retail: 'bg-pink-900/80 border-pink-600/50 text-pink-100',
    service: 'bg-blue-900/80 border-blue-600/50 text-blue-100',
    recreation: 'bg-purple-900/80 border-purple-600/50 text-purple-100',
    media: 'bg-cyan-900/80 border-cyan-600/50 text-cyan-100',
    ballpark: 'bg-orange-900/80 border-orange-600/50 text-orange-100',
  };

  const colors = typeColors[entry.type] || 'bg-slate-900/80 border-slate-600/50 text-slate-100';

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className={`${colors} border border-opacity-50 rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-300`}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="font-heading text-lg font-bold">{entry.title}</h2>
          <button
            onClick={handleDismiss}
            className="text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm opacity-90">{entry.description}</p>

        {/* Content */}
        <div className="bg-black/30 rounded-lg p-4 text-sm leading-relaxed">
          {entry.content}
        </div>

        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="w-full bg-white/20 hover:bg-white/30 text-current font-heading py-2 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}