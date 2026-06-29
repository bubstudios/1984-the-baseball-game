import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { X } from 'lucide-react';

const HBP_INJURY_IDS = ['forearm_contusion', 'thigh_contusion', 'bruised_ribs', 'bruised_hand', 'bruised_elbow', 'bruised_foot'];

const TRIGGER_LABELS = {
  divingStop: 'making a diving stop',
  divingCatch: 'making a diving catch',
  collision: 'during a home plate collision',
};

const BASE_NAMES = ['1st', '2nd', '3rd'];

function getInjuryContext(injury, type) {
  const playerName = injury.pitcherName || injury.batterName || injury.runnerName || injury.fielderName || 'A player';

  let mechanism = '';
  let location = '';

  switch (type) {
    case 'pitcher':
      mechanism = 'while throwing a pitch';
      location = 'on the mound';
      break;
    case 'batter':
      if (HBP_INJURY_IDS.includes(injury.id)) {
        mechanism = 'after being hit by a pitch';
      } else {
        mechanism = 'while swinging the bat';
      }
      location = 'at the plate';
      break;
    case 'runner':
      mechanism = 'while running the bases';
      location = 'on the basepaths';
      break;
    case 'sliding': {
      const baseLabel = injury.baseIndex >= 0 ? BASE_NAMES[injury.baseIndex] + ' base' : 'a base';
      mechanism = injury.contact
        ? `while sliding into ${baseLabel} with contact`
        : `while sliding into ${baseLabel}`;
      location = 'on the basepaths';
      break;
    }
    case 'fielder':
      mechanism = TRIGGER_LABELS[injury.trigger] || 'while fielding';
      location = `at ${injury.pos || 'his position'}`;
      break;
  }

  return { playerName, mechanism, location };
}

export default function InjuryAlertModal({ injury, type, teamKey, onClose }) {
  if (!injury) return null;

  const { playerName, mechanism, location } = getInjuryContext(injury, type);
  const team = TEAMS[teamKey];
  const teamName = team ? `${team.city} ${team.name}` : '';
  const emoji = injury.emoji || '🚑';

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-[60] p-4">
      <div className="bg-gradient-to-br from-red-950 to-slate-900 rounded-2xl max-w-md w-full border-2 border-red-500/60 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-red-600/90 border-b-2 border-red-500/50 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚑</span>
            <h2 className="font-heading text-lg font-bold text-white tracking-wide">INJURY!</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Player name + team */}
          <div className="text-center">
            <div className="text-5xl mb-2">{emoji}</div>
            <h3 className="font-heading text-xl font-bold text-white">{playerName}</h3>
            <p className="text-sm text-red-300/80 font-heading">{teamName}</p>
          </div>

          {/* Injury details */}
          <div className="bg-black/30 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground w-16 shrink-0 pt-0.5">What</span>
              <span className="text-sm text-white font-heading font-semibold">{injury.name}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground w-16 shrink-0 pt-0.5">How</span>
              <span className="text-sm text-foreground/90">{mechanism}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground w-16 shrink-0 pt-0.5">Where</span>
              <span className="text-sm text-foreground/90">{location}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-xs font-heading uppercase tracking-widest text-muted-foreground w-16 shrink-0 pt-0.5">Status</span>
              <span className="text-sm text-red-400 font-semibold">Out for the rest of the game</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-red-500/30 p-4 bg-slate-900/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-heading rounded-lg transition-colors font-bold"
          >
            Select Replacement →
          </button>
        </div>
      </div>
    </div>
  );
}