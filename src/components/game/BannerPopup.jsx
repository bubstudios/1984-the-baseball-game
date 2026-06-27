import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// Field renderers for popup entries — handles electronics, movies, and general products structures
const FIELD_RENDERERS = [
  { key: 'tagline', label: null, render: (v) => <p className="text-sm text-yellow-200 font-heading italic">— {v}</p> },
  { key: 'price', label: 'Price', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Price:</span> {v}</p> },
  { key: 'premiere', label: 'Premiere', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Premiere:</span> {v}</p> },
  { key: 'runtime', label: 'Runtime', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Runtime:</span> {v}</p> },
  { key: 'genre', label: 'Genre', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Genre:</span> {v}</p> },
  { key: 'specs', label: 'Specs', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Specs:</span> {v}</p> },
  { key: 'synopsis', label: 'Synopsis', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'starring', label: 'Starring', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Starring:</span> {v}</p> },
  { key: 'whatItWas', label: 'What it was', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'howChanged', label: 'How it changed things', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'howAged', label: 'How it aged', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'funFacts', label: 'Fun facts', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Fun facts:</span> {v}</p> },
  { key: 'craze', label: 'The craze', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">The craze:</span> {v}</p> },
  {
    key: 'reviews', label: 'Reviews', render: (v) => (
      <div className="space-y-1.5">
        {v.map((r, i) => (
          <div key={i} className="text-sm bg-muted/30 rounded-lg px-3 py-1.5">
            <span className="text-yellow-300">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
            <span className="ml-2 text-foreground/90">{r.quote}</span>
          </div>
        ))}
      </div>
    )
  },
  { key: 'achievement', label: null, render: (v) => (
    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-2 text-center">
      <span className="text-sm font-heading font-bold text-yellow-300">{v}</span>
    </div>
  ) },
];

function PopupContent({ popup }) {
  return (
    <div className="space-y-3">
      {/* Popup header with emoji + title */}
      <div className="flex items-center gap-3 pb-2 border-b border-yellow-400/20">
        {popup.emoji && <span className="text-4xl">{popup.emoji}</span>}
        <h3 className="font-heading text-xl font-bold text-yellow-300">{popup.title}</h3>
      </div>
      {/* Render all known fields dynamically */}
      {FIELD_RENDERERS.map(({ key, label, render }) => {
        if (popup[key] == null) return null;
        return (
          <div key={key}>
            {label && <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-0.5">{label}</div>}
            {render(popup[key])}
          </div>
        );
      })}
    </div>
  );
}

export default function BannerPopup({ banner, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  // If banner has a `popups` array, pick a random one once on mount
  const selectedPopup = useMemo(() => {
    if (banner?.popups && Array.isArray(banner.popups) && banner.popups.length > 0) {
      return banner.popups[Math.floor(Math.random() * banner.popups.length)];
    }
    return null;
  }, [banner]);

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
        {/* Header — shows the banner's headline (not the popup's) */}
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
          {/* National banners with popups array — show the selected popup's detail content */}
          {selectedPopup && <PopupContent popup={selectedPopup} />}

          {/* Team banners with paragraphs array */}
          {!selectedPopup && banner.paragraphs && banner.paragraphs.map((para, i) => (
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