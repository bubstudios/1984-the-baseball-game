import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft, CircleDot } from 'lucide-react';

const STEPS = [
  {
    title: 'Pick Your Teams',
    icon: '⚾',
    text: 'Choose your squad from the 1984 MLB rosters. You\'ll face a CPU opponent — pick any matchup you want.',
  },
  {
    title: 'Choose the Ballpark',
    icon: '🏟️',
    text: 'Pick whose home field to play at. The stadium determines DH rules (AL parks use the DH, NL parks have pitchers hit) and affects weather conditions like wind and temperature.',
  },
  {
    title: 'Set Your Lineup',
    icon: '📋',
    text: 'Customize your batting order and defensive positions. Playing a player out of position carries defensive penalties — check the warning badges.',
  },
  {
    title: 'When Batting',
    icon: '🏏',
    text: (
      <>
        <strong>Normal Swing</strong> — balanced contact and power<br />
        <strong>Contact Swing</strong> — higher contact, less power<br />
        <strong>Power Swing</strong> — swing for the fences, lower contact<br />
        <strong>Bunt</strong> — lay one down to advance runners<br />
        <br />
        With runners on, you can <strong>Steal</strong> a base or toggle <strong>Hit &amp; Run</strong>.
      </>
    ),
  },
  {
    title: 'When Pitching',
    icon: '⚾',
    text: (
      <>
        Pick from your pitcher\'s arsenal:<br />
        <strong>FB</strong> Fastball · <strong>BB</strong> Breaking Ball · <strong>CU</strong> Changeup<br />
        <strong>KN</strong> Knuckleball · <strong>SC</strong> Screwball · <strong>SF</strong> Split-Finger<br />
        <br />
        Faster pitches are harder to hit but easier to steal on. Breaking balls have higher strike chances.
      </>
    ),
  },
  {
    title: 'Manage the Game',
    icon: '🔄',
    text: 'Use the <strong>Subs</strong> button during any half-inning to pinch-hit, pinch-run, make defensive switches, or change pitchers. Watch your bullpen!',
  },
];

const HAS_SEEN_TUTORIAL = 'bb84_tutorial_seen';

export default function TutorialModal({ onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    localStorage.setItem(HAS_SEEN_TUTORIAL, 'true');
  }, []);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="font-heading text-base font-bold text-foreground">{s.title}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 min-h-[160px]">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">{s.text}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          {/* Dots */}
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === step ? 'bg-primary scale-125' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={prev} className="h-8 px-3 text-xs font-heading gap-1">
                <ChevronLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={isLast ? onClose : next}
              className="h-8 px-4 text-xs font-heading gap-1"
            >
              {isLast ? 'Play Ball!' : 'Next'}
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Check if user has seen the tutorial
export function hasSeenTutorial() {
  return localStorage.getItem(HAS_SEEN_TUTORIAL) === 'true';
}