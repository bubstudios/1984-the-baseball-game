import React from 'react';
import { TEAMS } from '@/lib/gameData';
import { Trophy } from 'lucide-react';
import { formatGameDate } from '@/lib/seasonSchedule';

function teamName(key) { return TEAMS[key]?.name || key; }
function teamAbbr(key) { return TEAMS[key]?.abbr || key; }
function teamCity(key) { return TEAMS[key]?.city || ''; }

function AwardCard({ award }) {
  if (!award) return null;
  const isPitcher = award.type === 'PitcherOfTheWeek';
  const team = TEAMS[award.teamKey];

  return (
    <div className="bg-stone-200/60 border-2 border-stone-700 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Trophy className="w-4 h-4 text-amber-700" />
        <div className="text-[10px] font-serif font-bold text-stone-600 uppercase tracking-wide">
          {award.league} {isPitcher ? 'Pitcher' : 'Player'} of the Week
        </div>
      </div>
      <div className="font-serif text-lg font-black text-stone-900 leading-tight">
        {award.playerName}
      </div>
      <div className="font-serif text-xs text-stone-600 mb-2">
        {teamCity(award.teamKey)} {teamName(award.teamKey)}
      </div>
      <div className="font-serif text-sm font-bold text-stone-800 mb-1">
        {award.statLine}
      </div>
      <p className="font-serif text-[11px] text-stone-600 italic leading-snug">
        {award.blurb}
      </p>
    </div>
  );
}

export default function WeeklyAwardsScreen({ awardsData, onClose }) {
  if (!awardsData) return null;

  const { weekNumber, dayRange, awards } = awardsData;
  const nlBatter = awards.find(a => a.league === 'NL' && a.type === 'PlayerOfTheWeek');
  const nlPitcher = awards.find(a => a.league === 'NL' && a.type === 'PitcherOfTheWeek');
  const alBatter = awards.find(a => a.league === 'AL' && a.type === 'PlayerOfTheWeek');
  const alPitcher = awards.find(a => a.league === 'AL' && a.type === 'PitcherOfTheWeek');

  const dateStr = dayRange?.start ? `Days ${dayRange.start}-${dayRange.end}` : `Week ${weekNumber}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-stone-100 my-4 mx-2 md:mx-4 w-full max-w-3xl shadow-2xl border-2 border-stone-800">
        {/* Masthead */}
        <div className="border-b-4 border-double border-stone-800 px-4 md:px-6 pt-3 pb-2 text-center">
          <div className="text-[10px] font-serif text-stone-600 mb-1">{dateStr}</div>
          <h1 className="font-serif text-2xl md:text-3xl font-black tracking-tight text-stone-900 leading-none">
            BASEBALL WEEKLY HONORS
          </h1>
          <div className="font-serif text-[10px] md:text-xs text-stone-500 mt-0.5">
            PLAYERS OF THE WEEK · WEEK {weekNumber}
          </div>
        </div>

        {/* Awards grid */}
        <div className="px-4 md:px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AwardCard award={alBatter} />
            <AwardCard award={nlBatter} />
            <AwardCard award={alPitcher} />
            <AwardCard award={nlPitcher} />
          </div>

          {awards.length < 4 && (
            <div className="text-center mt-4">
              <p className="font-serif text-[11px] text-stone-500 italic">
                {awards.length} award{awards.length !== 1 ? 's' : ''} presented this week.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-double border-stone-800 px-4 md:px-6 py-3 flex items-center justify-between bg-stone-200">
          <div className="text-[10px] font-serif text-stone-500">
            Week {weekNumber} Complete
          </div>
          <button
            onClick={onClose}
            className="bg-stone-800 text-stone-100 font-serif text-xs px-4 py-1.5 rounded hover:bg-stone-900 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}