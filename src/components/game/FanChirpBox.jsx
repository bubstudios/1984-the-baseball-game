import React, { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { pickFanYell, trackFanYell } from '@/lib/fanChatter';

const MAX_MESSAGES = 6;
const INTERVAL_MS = 4500;

export default function FanChirpBox({ homeTeamKey, isGameActive, onAchievement }) {
  const [messages, setMessages] = useState([]);
  const intervalRef = useRef(null);
  const counterRef = useRef(0);

  useEffect(() => {
    if (!isGameActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const text = pickFanYell(homeTeamKey);
      const unlocked = trackFanYell(text);
      if (unlocked.length > 0 && onAchievement) onAchievement(unlocked);

      counterRef.current += 1;
      const id = counterRef.current;

      setMessages(prev => {
        const next = [...prev, { id, text }];
        return next.slice(-MAX_MESSAGES);
      });
    }, INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isGameActive, homeTeamKey]);

  if (!isGameActive || messages.length === 0) return null;

  return (
    <div className="w-full mt-2">
      <div className="bg-[#1a2e1a] border border-green-700/40 rounded-xl px-3 py-2">
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-1.5 border-b border-green-700/20 pb-1">
          <Users className="w-3 h-3 text-green-400/70" />
          <span className="text-[9px] font-heading uppercase tracking-widest text-green-400/60">
            From the Stands
          </span>
        </div>
        {/* Message list */}
        <div className="space-y-0.5">
          {messages.map((msg, idx) => {
            const isLatest = idx === messages.length - 1;
            return (
              <div
                key={msg.id}
                className={`text-[11px] font-heading transition-all duration-300 ${
                  isLatest
                    ? 'text-green-300 font-semibold'
                    : 'text-green-400/50'
                }`}
              >
                {isLatest ? '▶ ' : '  '}
                {msg.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}