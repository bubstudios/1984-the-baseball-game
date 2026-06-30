import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LeaderProgressPopup({ progress, onDismiss }) {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatingOut(true);
      setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const handleClose = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, 300);
  };

  if (!visible || !progress) return null;

  const { challengeName, playerName, playerProgress, totalPlayers, statType, icon } = progress;
  const percentage = Math.round((playerProgress / totalPlayers) * 100);

  return (
    <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${animatingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="bg-card border-2 border-primary/50 rounded-xl px-6 py-5 shadow-2xl max-w-sm relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse"></div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon and header */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">{icon}</div>
            <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wide">{challengeName}</h3>
          </div>

          {/* Player name and stat */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground mb-1">Progress with</p>
            <p className="font-heading text-lg font-bold text-primary">{playerName}</p>
            <p className="text-xs text-muted-foreground mt-1">{statType} recorded ✓</p>
          </div>

          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex justify-between text-[10px] font-heading text-muted-foreground mb-1">
              <span>CHALLENGE PROGRESS</span>
              <span>{playerProgress}/{totalPlayers} ({percentage}%)</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Auto-dismiss hint */}
          <p className="text-[9px] text-muted-foreground/40 text-center font-heading">continuing...</p>
        </div>
      </div>
    </div>
  );
}