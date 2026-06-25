import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function BannerPopup({ banner, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 150);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-150 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-2xl max-h-[85vh] overflow-y-auto border-2 border-yellow-400 shadow-2xl transition-all duration-150 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-700 border-b-2 border-yellow-400 p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-4xl flex-shrink-0">{banner.icon || '📺'}</div>
            <div className="flex-1 min-w-0">
              <h2 className="font-heading font-bold text-yellow-300 text-lg">
                {banner.title}
              </h2>
              <p className="text-yellow-200 text-sm mt-1">{banner.subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex-shrink-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-foreground">
          {banner.paragraphs && banner.paragraphs.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {para}
            </p>
          ))}

          {banner.content && (
            <div
              className="prose prose-sm max-w-none text-foreground/90"
              dangerouslySetInnerHTML={{ __html: banner.content }}
            />
          )}

          {banner.longDescription && (
            <div className="space-y-3 mt-4">
              {Array.isArray(banner.longDescription) ? (
                banner.longDescription.map((item, i) => (
                  <p key={i} className="text-sm leading-relaxed">
                    {item}
                  </p>
                ))
              ) : (
                <p className="text-sm leading-relaxed">{banner.longDescription}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-yellow-400/30 p-4 bg-slate-900/50">
          <button
            onClick={handleClose}
            className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-heading rounded-lg transition-colors"
          >
            ✓ Close
          </button>
        </div>
      </div>
    </div>
  );
}