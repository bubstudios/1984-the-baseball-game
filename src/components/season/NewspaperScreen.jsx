import React, { useState } from 'react';
import { TEAMS } from '@/lib/gameData';
import { X, Newspaper } from 'lucide-react';
import ArchivedBoxScore from '@/components/season/ArchivedBoxScore';
import { formatGameDate } from '@/lib/seasonSchedule';

function teamAbbr(key) { return TEAMS[key]?.abbr || key; }
function teamName(key) { return TEAMS[key]?.name || key; }

export default function NewspaperScreen({ newspaper, gameResults, userTeam, onClose }) {
  const [selectedResult, setSelectedResult] = useState(null);
  const [archivedList, setArchivedList] = useState(null);

  if (!newspaper) return null;

  const dateStr = newspaper.gameDate ? formatGameDate(newspaper.gameDate) : `Day ${newspaper.dayNumber}`;
  const dayLabel = `DAY ${newspaper.dayNumber}`;
  const weekLabel = newspaper.weekNumber ? `WEEK ${newspaper.weekNumber}` : null;

  const findResult = (gameId) => {
    return gameResults?.find(r => r.id === gameId);
  };

  const Headline = ({ headline, isMain }) => {
    if (!headline) return null;
    const result = findResult(headline.gameId);
    const clickable = !!result;
    return (
      <div
        className={`${isMain ? '' : 'border-b border-stone-300 pb-2 mb-2'} ${clickable ? 'cursor-pointer hover:bg-stone-200/50' : ''} transition-colors`}
        onClick={() => clickable && setSelectedResult(result)}
      >
        <h3 className={`${isMain ? 'text-2xl md:text-3xl leading-tight mb-1' : 'text-sm md:text-base leading-snug'} font-serif font-bold text-stone-900`}>
          {headline.headlineText}
        </h3>
        {headline.subText && (
          <p className={`${isMain ? 'text-sm' : 'text-[11px]'} font-serif text-stone-600 italic`}>
            {headline.subText}{clickable ? ' - tap for box score' : ''}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto">
      <div className="bg-stone-100 my-4 mx-2 md:mx-4 w-full max-w-3xl shadow-2xl border-2 border-stone-800">
        {/* Masthead */}
        <div className="border-b-4 border-double border-stone-800 px-4 md:px-6 pt-3 pb-2">
          <div className="flex items-center justify-between text-[10px] font-serif text-stone-600 mb-1">
            <span>{dayLabel}{weekLabel ? ` · ${weekLabel}` : ''}</span>
            <span>25¢</span>
          </div>
          <div className="text-center">
            <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tight text-stone-900 leading-none">
              THE DAILY DIAMOND
            </h1>
            <div className="font-serif text-[10px] md:text-xs text-stone-500 mt-0.5">
              1984 BASEBALL ROUNDUP · {dateStr.toUpperCase()}
            </div>
          </div>
          <div className="border-b border-stone-400 mt-2"></div>
        </div>

        {/* Content */}
        <div className="px-4 md:px-6 py-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main column - headlines */}
            <div className="md:col-span-2 space-y-3">
              {newspaper.mainHeadline && (
                <div className="border-b-2 border-stone-400 pb-3 mb-2">
                  <Headline headline={newspaper.mainHeadline} isMain={true} />
                </div>
              )}
              <div className="space-y-2">
                {newspaper.secondaryHeadlines?.map((h, i) => (
                  <Headline key={i} headline={h} isMain={false} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-3 border-l-0 md:border-l border-stone-400 md:pl-4">
              {/* User team result */}
              {newspaper.userTeamResult && (
                <div className="bg-stone-200/60 border border-stone-300 p-2">
                  <div className="text-[9px] font-serif font-bold text-stone-500 uppercase tracking-wide mb-1">Your Team</div>
                  <div className="font-serif text-sm font-bold text-stone-900">
                    {teamAbbr(newspaper.userTeamResult.awayTeam)} {newspaper.userTeamResult.awayScore}
                  </div>
                  <div className="font-serif text-sm font-bold text-stone-900">
                    {teamAbbr(newspaper.userTeamResult.homeTeam)} {newspaper.userTeamResult.homeScore}
                  </div>
                  <div className="text-[10px] font-serif text-stone-600 mt-1">
                    {newspaper.userTeamResult.winner === userTeam ? 'WIN' : 'LOSS'}
                  </div>
                </div>
              )}

              {/* Weekly awards tease */}
              {newspaper.weekNumber && (
                <div className="bg-amber-100/60 border border-amber-300 p-2">
                  <div className="text-[9px] font-serif font-bold text-amber-700 uppercase tracking-wide">Weekly Honors</div>
                  <div className="text-[11px] font-serif text-stone-700 mt-0.5">
                    Players of the Week announced - see next page
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-double border-stone-800 px-4 md:px-6 py-3 flex items-center justify-between bg-stone-200">
          <div className="text-[10px] font-serif text-stone-500">
            Vol. 1 · No. {newspaper.dayNumber}
          </div>
          <div className="flex items-center gap-2">
            {gameResults && gameResults.length > 0 && (
              <button
                onClick={() => setArchivedList(true)}
                className="text-[11px] font-serif text-stone-600 hover:text-stone-900 underline"
              >
                Archive
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-stone-800 text-stone-100 font-serif text-xs px-4 py-1.5 rounded hover:bg-stone-900 transition-colors"
            >
              {newspaper.weekNumber ? 'Continue to Awards' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* Box score modal */}
      {selectedResult && (
        <ArchivedBoxScore gameResult={selectedResult} onClose={() => setSelectedResult(null)} />
      )}

      {/* Archive browser */}
      {archivedList && (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4" onClick={() => setArchivedList(false)}>
          <div className="bg-stone-100 border-2 border-stone-800 max-w-sm w-full p-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif font-bold text-stone-900 mb-2">Newspaper Archive</h3>
            <p className="text-[11px] font-serif text-stone-600 mb-3">Browse past daily editions.</p>
            <button onClick={() => setArchivedList(false)} className="text-[11px] font-serif text-stone-600 underline">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}