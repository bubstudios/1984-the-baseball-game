import React, { useState, useEffect } from 'react';
import { getHomeRunAchievement, isNewRecord } from '@/lib/homeRunDistance';

export default function HomeRunDistancePopup({ distance, batterName, isNewRecord: newRecord, onClose }) {
  const [show, setShow] = useState(true);
  const achievement = getHomeRunAchievement(distance);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onClose) setTimeout(onClose, 500);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div
        className={`
          text-center p-8 rounded-xl backdrop-blur-sm transition-all duration-300
          ${show ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          ${newRecord ? 'bg-yellow-500/20 border-2 border-yellow-400' : 'bg-blue-500/20 border-2 border-blue-400'}
        `}
      >
        {/* Distance Display */}
        <div className="mb-4">
          <div className="text-6xl font-display font-bold text-primary">
            {distance}
            <span className="text-3xl">ft</span>
          </div>
          <div className="text-sm text-foreground/70 font-body mt-1">
            {batterName} hits it
          </div>
        </div>

        {/* Achievement Badge */}
        {achievement && (
          <div className="mb-3 inline-block px-4 py-2 bg-primary/20 rounded-lg border border-primary/40">
            <div className="text-2xl">{achievement.icon}</div>
            <div className="text-xs font-heading font-bold text-primary uppercase tracking-wider mt-1">
              {achievement.label}
            </div>
          </div>
        )}

        {/* New Record */}
        {newRecord && (
          <div className="text-xs font-heading font-bold text-yellow-400 uppercase tracking-widest">
            ⭐ NEW RECORD ⭐
          </div>
        )}
      </div>
    </div>
  );
}