import React, { useState, useEffect } from 'react';
import { Smartphone } from 'lucide-react';

/**
 * Detects whether the visitor is on a mobile-sized screen.
 * Uses both viewport width and user-agent for robustness.
 * Breakpoint: 768px (Tailwind's `md` boundary).
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    const uaMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
    const widthMobile = window.innerWidth < 768;
    return uaMobile || widthMobile;
  });

  useEffect(() => {
    const check = () => {
      const uaMobile = /iphone|ipad|ipod|android/i.test(navigator.userAgent);
      const widthMobile = window.innerWidth < 768;
      setIsMobile(uaMobile || widthMobile);
    };
    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);
    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isMobile;
}

/**
 * MobileGate — wraps the app and blocks access on laptop/tablet screens.
 * Shows a friendly retro-themed message directing visitors to their phone.
 */
export default function MobileGate({ children }) {
  const isMobile = useIsMobile();

  if (isMobile) return children;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            ⚾ Mobile Only
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            1984: The Baseball Game is designed for your phone. Please open it on
            a mobile device to play.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Visit{' '}
            <span className="text-primary font-heading font-bold">
              1984thebaseballgame.com
            </span>{' '}
            on your phone's browser.
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground/50 font-heading uppercase tracking-widest">
          Step up to the plate — on mobile
        </p>
      </div>
    </div>
  );
}