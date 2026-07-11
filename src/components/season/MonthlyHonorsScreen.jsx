import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { Trophy } from 'lucide-react';

function teamName(key) { return TEAMS[key]?.name || key; }
function teamCity(key) { return TEAMS[key]?.city || ''; }

function AwardCard({ award }) {
  if (!award) return null;
  const isPitcher = award.type === 'PitcherOfTheMonth';

  return (
    <div className="bg-stone-200/60 border-2 border-stone-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-5 h-5 text-amber-700" />
        <div className="text-[11px] font-serif font-bold text-stone-600 uppercase tracking-wide">
          {award.league} {isPitcher ? 'Pitcher' : 'Player'} of the Month
        </div>
      </div>
      <div className="font-serif text-xl font-black text-stone-900 leading-tight">
        {award.playerName}
      </div>
      <div className="font-serif text-xs text-stone-600 mb-2">
        {teamCity(award.teamKey)} {teamName(award.teamKey)} - {award.role}
      </div>
      <div className="font-serif text-sm font-bold text-stone-800 mb-2">
        {award.statLine}
      </div>
      <p className="font-serif text-[12px] text-stone-600 italic leading-snug">
        {award.blurb}
      </p>
    </div>
  );
}

export default function MonthlyHonorsScreen({ honorsData, onClose }) {
  if (!honorsData) return null;

  const { monthName, awards } = honorsData;

  const nlBatter = awards.find(a => a.league === 'NL' && a.type === 'PlayerOfTheMonth');
  const nlPitcher = awards.find(a => a.league === 'NL' && a.type === 'PitcherOfTheMonth');
  const alBatter = awards.find(a => a.league === 'AL' && a.type === 'PlayerOfTheMonth');
  const alPitcher = awards.find(a => a.league === 'AL' && a.type === 'PitcherOfTheMonth');

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-stone-100 my-4 mx-2 md:mx-4 w-full max-w-4xl shadow-2xl border-2 border-stone-800">
        {/* Masthead */}
        <div className="border-b-4 border-double border-stone-800 px-4 md:px-6 pt-4 pb-3 text-center">
          <div className="text-[10px] font-serif text-stone-600 mb-1">1984 Season</div>
          <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tight text-stone-900 leading-none">
            {monthName.toUpperCase()} HONORS
          </h1>
          <div className="font-serif text-xs md:text-sm text-stone-500 mt-1">
            PLAYERS OF THE MONTH - {monthName.toUpperCase()}
          </div>
        </div>

        {/* Awards grid */}
        <div className="px-4 md:px-6 py-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AwardCard award={nlBatter} />
            <AwardCard award={alBatter} />
            <AwardCard award={nlPitcher} />
            <AwardCard award={alPitcher} />
          </div>

          {awards.length < 4 && (
            <div className="text-center mt-4">
              <p className="font-serif text-[12px] text-stone-500 italic">
                {awards.length} award{awards.length !== 1 ? 's' : ''} presented for {monthName}.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-double border-stone-800 px-4 md:px-6 py-3 flex items-center justify-between bg-stone-200">
          <div className="text-[10px] font-serif text-stone-500">
            {monthName} Complete
          </div>
          <button
            onClick={onClose}
            className="bg-stone-800 text-stone-100 font-serif text-sm px-6 py-2 rounded hover:bg-stone-900 transition-colors"
          >
            Continue to Next Month
          </button>
        </div>
      </div>
    </div>
  );
}