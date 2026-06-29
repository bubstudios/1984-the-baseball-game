import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function Fireworks({ trigger, type = 'hr' }) {
  const prevTrigger = useRef(trigger);

  useEffect(() => {
    if (trigger !== prevTrigger.current && trigger) {
      prevTrigger.current = trigger;

      if (type === 'hr') {
        // Home run - burst from center
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { x: 0.5, y: 0.5 },
          colors: ['#facc15', '#f59e0b', '#eab308', '#22c55e', '#ef4444', '#3b82f6'],
          ticks: 200,
          gravity: 0.8,
          scalar: 1.2,
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.3, y: 0.6 },
            colors: ['#facc15', '#f59e0b', '#eab308'],
          });
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { x: 0.7, y: 0.6 },
            colors: ['#22c55e', '#3b82f6', '#ef4444'],
          });
        }, 150);
      } else if (type === 'win') {
        // Win - extended celebration
        const end = Date.now() + 3000;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.7 },
            colors: ['#facc15', '#f59e0b', '#eab308'],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.7 },
            colors: ['#22c55e', '#3b82f6', '#ef4444'],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        // Initial burst
        confetti({
          particleCount: 200,
          spread: 160,
          origin: { x: 0.5, y: 0.4 },
          colors: ['#facc15', '#f59e0b', '#eab308', '#22c55e', '#ef4444', '#3b82f6'],
          ticks: 300,
          scalar: 1.3,
        });
        setTimeout(frame, 400);
      }
    }
  }, [trigger, type]);

  return null;
}