import React, { useState, useMemo, useEffect } from 'react';
import { X } from 'lucide-react';
import { unlockAchievement } from '@/lib/achievements';
import { unlockBannerAchievement, checkBannerMetaAchievements } from '@/lib/bannerAchievements';
import { checkNationalCategoryAchievements } from '@/lib/nationalBannerAchievements';

// ── Markdown + metadata helpers for team-banner paragraphs ──

function renderInlineMarkdown(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-yellow-200">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function isMetadataParagraph(text) {
  return /\*?Achievement\b/i.test(text) ||
         /\*?Set achievement\b/i.test(text) ||
         /\*?Grand achievement\b/i.test(text) ||
         /\*?Meta-achievement\b/i.test(text) ||
         /Cooperstown of Bobbleheads/i.test(text) ||
         /Bobblehead Shelf/i.test(text);
}

function stripMetadataTail(text) {
  const markers = [
    /\*Achievement\b/i,
    /\*Achievement \(per/i,
    /\*Set achievement\b/i,
    /\*Grand achievement\b/i,
    /\*Meta-achievement\b/i,
  ];
  let earliest = -1;
  for (const re of markers) {
    const m = text.match(re);
    if (m && m.index !== undefined) {
      if (earliest === -1 || m.index < earliest) earliest = m.index;
    }
  }
  if (earliest === -1) return text;
  return text.slice(0, earliest).trim();
}

function cleanPlaceholders(text) {
  return text.replace(/\[Player\]/gi, 'this player');
}

// Field renderers for popup entries — handles electronics, movies, TV shows, and general products structures
const FIELD_RENDERERS = [
  // ── TV Show episode fields ──
  { key: 'day', label: null, render: (v, popup) => (
    <p className="text-sm font-heading text-yellow-200">
      {v}{popup?.time ? ` at ${popup.time}` : ''}{popup?.network ? ` on ${popup.network}` : ''}
    </p>
  ) },
  { key: 'time', label: null, render: () => null }, // handled by 'day' renderer
  { key: 'network', label: null, render: () => null }, // handled by 'day' renderer
  { key: 'plot', label: 'This Week', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'stars', label: 'Starring', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Starring:</span> {v}</p> },
  { key: 'guests', label: 'Guest Stars', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Guest Stars:</span> {v}</p> },
  { key: 'location', label: 'Filmed at', render: (v) => <p className="text-sm"><span className="font-bold text-yellow-300">Filmed at:</span> {v}</p> },
  { key: 'slogan', label: null, render: (v) => <p className="text-sm text-muted-foreground italic text-center">{v}</p> },
  // ── General / movie / electronics fields ──
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
  { key: 'whatItIs', label: 'What it is', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'theFun', label: 'The fun', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'theNote', label: 'The note', render: (v) => <p className="text-sm leading-relaxed italic text-muted-foreground">{v}</p> },
  { key: 'howItLands', label: 'How it lands', render: (v) => <p className="text-sm leading-relaxed">{v}</p> },
  { key: 'achievement', label: null, render: (v) => (
    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg px-3 py-2 text-center">
      <span className="text-sm font-heading font-bold text-yellow-300">{v}</span>
    </div>
  ) },
];

function PopupContent({ popup }) {
  const headerTitle = popup.title || (popup.num ? `Episode ${popup.num}` : null);
  return (
    <div className="space-y-3">
      {/* Popup header with emoji + title */}
      <div className="flex items-center gap-3 pb-2 border-b border-yellow-400/20">
        {popup.emoji && <span className="text-4xl">{popup.emoji}</span>}
        {headerTitle && <h3 className="font-heading text-xl font-bold text-yellow-300">{headerTitle}</h3>}
      </div>
      {/* Render all known fields dynamically */}
      {FIELD_RENDERERS.map(({ key, label, render }) => {
        if (popup[key] == null) return null;
        return (
          <div key={key}>
            {label && <div className="text-[10px] font-heading uppercase tracking-widest text-muted-foreground mb-0.5">{label}</div>}
            {render(popup[key], popup)}
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
    // Use pre-selected popup if available (persists across open/close cycles)
    if (!banner) return null;
    if (banner._selectedPopup) return banner._selectedPopup;
    const pool = banner.popups || banner.windows || banner.entries || banner.items;
    if (pool && Array.isArray(pool) && pool.length > 0) {
      try {
        return pool[Math.floor(Math.random() * pool.length)];
      } catch (e) {
        console.error('Popup selection failed:', e);
        return null;
      }
    }
    return null;
  }, [banner]);

  // Unlock the banner's achievement when the popup is opened
  // Checks both the banner-level achievementId and the selected popup's achievementId
  useEffect(() => {
    if (!banner) return;
    const bannerAchId = banner.achievementId;
    const popupAchId = selectedPopup?.achievementId;
    const achId = popupAchId || bannerAchId;
    if (achId) {
      try {
        unlockAchievement(achId);
        checkBannerMetaAchievements(unlockAchievement);
        checkNationalCategoryAchievements(unlockAchievement);
      } catch (e) {
        console.error('Banner achievement unlock failed:', e);
      }
    }
  }, [banner?.achievementId, selectedPopup?.achievementId]);

  // Guard: don't render if no banner
  if (!banner) return null;

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

          {/* Bobblehead wobble + friendly intro — shown for bobblehead banners */}
          {!selectedPopup && banner.id && banner.id.endsWith('_bobblehead') && (
            <>
              <div className="flex justify-center py-2">
                <div className="bobble-wobble text-6xl" aria-hidden="true">⚾</div>
              </div>
              <p className="text-sm leading-relaxed text-yellow-200 font-heading">
                ⚾ Congrats – tonight's giveaway bobblehead is yours! Added to your collection. Collect all five... and keep an eye out for all 26 teams!
              </p>
            </>
          )}

          {/* Team banners with paragraphs array — cleaned: strips metadata, renders bold, fixes placeholders */}
          {!selectedPopup && banner.paragraphs && banner.paragraphs
            .filter((para) => !isMetadataParagraph(para))
            .map((para) => stripMetadataTail(cleanPlaceholders(para)))
            .filter((para) => para && para.trim().length > 0)
            .map((para, i) => (
              <p key={i} className="text-sm leading-relaxed">{renderInlineMarkdown(para)}</p>
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

        <style>{`
          @keyframes bobblehead-bob {
            0%, 100% { transform: rotate(-8deg); }
            50% { transform: rotate(8deg); }
          }
          .bobble-wobble {
            display: inline-block;
            transform-origin: 50% 90%;
            animation: bobblehead-bob 1.1s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
}