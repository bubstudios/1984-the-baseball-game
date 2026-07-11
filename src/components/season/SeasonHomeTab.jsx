import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { TEAMS } from '@/lib/gameData';
import { Button } from '@/components/ui/button';
import { Newspaper, ChevronRight } from 'lucide-react';
import { formatGameDate, getDivision } from '@/lib/seasonSchedule';
import { generateNewspaper } from '@/lib/headlineGenerator';
import ArchivedBoxScore from '@/components/season/ArchivedBoxScore';

const DIV_LABELS = {
  AL_East: 'AL East', AL_West: 'AL West',
  NL_East: 'NL East', NL_West: 'NL West',
};

function teamAbbr(key) { return TEAMS[key]?.abbr || key; }
function teamCity(key) { return TEAMS[key]?.city || ''; }
function teamName(key) { return TEAMS[key]?.name || key; }

export default function SeasonHomeTab({ season, standingsData, gameResults, onReadNewspaper, onViewSchedule, onViewStandings }) {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!season?.id) return;
    loadData();
  }, [season?.id]);

  const loadData = async () => {
    try {
      const userSched = await base44.entities.Schedule.filter({
        seasonId: season.id, isUserGame: true,
      }, 'gameDay', 200);
      setUpcomingGames(userSched.filter(g => g.status !== 'final').slice(0, 3));
    } catch (e) {
      console.error('Home tab load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>;
  }

  if (!season) return null;
  const userTeam = season.userTeam;

  // Last user game from gameResults
  const lastUserGame = gameResults?.find(r => r.homeTeam === userTeam || r.awayTeam === userTeam);

  // Standings for user's division
  const userDiv = getDivision(userTeam);
  const divStandings = (standingsData && userDiv) ? (standingsData[userDiv] || []) : [];

  // Headlines from most recent day
  let headlines = [];
  if (gameResults && gameResults.length > 0) {
    const recentDay = gameResults[0].gameDay;
    const dayResults = gameResults.filter(r => r.gameDay === recentDay);
    if (dayResults.length > 0) {
      const newspaper = generateNewspaper(dayResults, recentDay, dayResults[0]?.gameDate, userTeam, season.id);
      if (newspaper) {
        headlines = [newspaper.mainHeadline, ...(newspaper.secondaryHeadlines || [])].filter(Boolean).slice(0, 4);
      }
    }
  }

  const findResult = (gameId) => gameResults?.find(r => r.id === gameId);

  return (
    <div className="space-y-3">
      {/* Last Game */}
      {lastUserGame && (
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wide mb-1">Last Game</div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-heading text-sm font-bold text-foreground">
                {teamAbbr(lastUserGame.awayTeam)} {lastUserGame.awayScore}, {teamAbbr(lastUserGame.homeTeam)} {lastUserGame.homeScore}
              </div>
              <div className="text-[10px] text-muted-foreground font-heading">
                W: {lastUserGame.winningPitcher || 'TBD'} · L: {lastUserGame.losingPitcher || 'TBD'}
              </div>
            </div>
            <div className={`text-xs font-heading font-bold px-2 py-0.5 rounded ${lastUserGame.winner === userTeam ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>
              {lastUserGame.winner === userTeam ? 'WIN' : 'LOSS'}
            </div>
          </div>
          {lastUserGame.boxScore && (
            <Button onClick={() => setSelectedResult(lastUserGame)} variant="outline" size="sm" className="w-full text-[10px] h-7">
              View Box Score
            </Button>
          )}
        </div>
      )}

      {/* Around the League */}
      {headlines.length > 0 && (
        <div className="bg-stone-100 dark:bg-card border border-stone-300 dark:border-border rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[9px] font-serif font-bold text-stone-600 dark:text-muted-foreground uppercase tracking-wide">Today's Sports Page</div>
            <Newspaper className="w-3 h-3 text-stone-600 dark:text-primary" />
          </div>
          <div className="space-y-1.5">
            {headlines.map((h, i) => {
              const result = findResult(h.gameId);
              return (
                <div
                  key={i}
                  onClick={() => result && setSelectedResult(result)}
                  className={`text-[11px] font-serif ${result ? 'cursor-pointer hover:text-primary' : 'text-stone-700 dark:text-foreground'} transition-colors leading-snug`}
                >
                  <span className="font-bold">{h.headlineText}</span>
                  {h.subText && <span className="text-stone-500 dark:text-muted-foreground ml-1 font-normal">· {h.subText}</span>}
                </div>
              );
            })}
          </div>
          <Button onClick={onReadNewspaper} variant="ghost" size="sm" className="w-full mt-2 text-[10px] h-7 text-stone-600 dark:text-primary">
            Read Newspaper <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Mini Standings */}
      {divStandings.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wide mb-2">
            {DIV_LABELS[userDiv] || userDiv}
          </div>
          <div className="space-y-1">
            {divStandings.map((t) => (
              <div key={t.teamKey} className={`flex items-center justify-between text-xs ${t.teamKey === userTeam ? 'text-primary font-bold' : 'text-foreground'}`}>
                <span>{teamCity(t.teamKey)} {teamName(t.teamKey)}</span>
                <span className="font-heading">{t.w}-{t.l} · {t.gb === 0 ? '-' : t.gb.toFixed(1) + ' GB'}</span>
              </div>
            ))}
          </div>
          <Button onClick={onViewStandings} variant="ghost" size="sm" className="w-full mt-2 text-[10px] h-7">
            Full Standings <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-3">
          <div className="text-[9px] font-heading font-bold text-muted-foreground uppercase tracking-wide mb-2">Upcoming Games</div>
          <div className="space-y-1">
            {upcomingGames.map((g, i) => {
              const isHome = g.homeTeam === userTeam;
              const opp = isHome ? g.awayTeam : g.homeTeam;
              return (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{formatGameDate(g.gameDate).split(',')[0]}</span>
                  <span className="font-heading font-bold">{isHome ? 'vs' : '@'} {teamAbbr(opp)}</span>
                </div>
              );
            })}
          </div>
          <Button onClick={onViewSchedule} variant="ghost" size="sm" className="w-full mt-2 text-[10px] h-7">
            Full Schedule <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {selectedResult && (
        <ArchivedBoxScore gameResult={selectedResult} onClose={() => setSelectedResult(null)} />
      )}
    </div>
  );
}