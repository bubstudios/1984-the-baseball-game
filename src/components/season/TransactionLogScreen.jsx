import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, ScrollText, Trophy, TrendingUp, TrendingDown, Calendar, Award, Star } from 'lucide-react';
import { TEAMS } from '@/lib/gameData';
import { getTransactions } from '@/lib/transactionLog';

const TYPE_ICONS = {
  injury: '🏥',
  return_from_injury: '✅',
  suspension: '⛔',
  return_from_suspension: '✅',
  manager_suspension: '⛔',
  return_from_manager_suspension: '✅',
  trade: '🔄',
  allstar_selection: '⭐',
  award_winner: '🏆',
  postseason_clinch: '🎉',
  elimination: '❌',
  manager_ejection: '💢',
  player_ejection: '💢',
  milestone: '📅',
  roster_move: '📋',
};

export default function TransactionLogScreen({ season, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    (async () => {
      if (!season?.id) return;
      try {
        const txns = await getTransactions(season.id, 500);
        setTransactions(txns);
      } catch (e) { /* non-fatal */ }
      setLoading(false);
    })();
  }, [season?.id]);

  const filtered = filter === 'all'
    ? transactions
    : filter === 'team'
    ? transactions.filter(t => t.teamKey === season?.userTeam)
    : transactions.filter(t => {
        // Group filters
        if (filter === 'injuries') return ['injury', 'return_from_injury'].includes(t.type);
        if (filter === 'suspensions') return ['suspension', 'return_from_suspension', 'manager_suspension', 'return_from_manager_suspension', 'player_ejection', 'manager_ejection'].includes(t.type);
        if (filter === 'trades') return t.type === 'trade';
        if (filter === 'awards') return ['award_winner', 'allstar_selection'].includes(t.type);
        if (filter === 'clinch') return ['postseason_clinch', 'elimination'].includes(t.type);
        return false;
      });

  // Group by date
  const byDate = {};
  for (const t of filtered) {
    const date = t.gameDate || 'Unknown Date';
    if (!byDate[date]) byDate[date] = [];
    byDate[date].push(t);
  }
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a));

  const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'team', label: 'My Team' },
    { id: 'injuries', label: 'Injuries' },
    { id: 'suspensions', label: 'Discipline' },
    { id: 'trades', label: 'Trades' },
    { id: 'awards', label: 'Awards' },
    { id: 'clinch', label: 'Clinch' },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border bg-card/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-heading text-base font-bold text-foreground">
              Transaction Wire
            </h1>
            <p className="text-[10px] text-muted-foreground font-heading">
              {season?.year || 1984} Season · {filtered.length} entries
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="shrink-0 px-4 py-2 border-b border-border overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-heading font-bold transition-all whitespace-nowrap ${filter === f.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground bg-muted/50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 max-w-md mx-auto w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : sortedDates.length === 0 ? (
          <div className="text-center py-12">
            <ScrollText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="font-heading text-sm text-muted-foreground">
              No transactions yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedDates.map(date => (
              <div key={date}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] font-heading font-bold text-muted-foreground">
                    {formatDate(date)}
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg divide-y divide-border/30">
                  {byDate[date].map((t, i) => (
                    <div key={t.id || i} className="flex items-start gap-2 py-1.5 px-2">
                      <span className="text-sm shrink-0 mt-0.5">{TYPE_ICONS[t.type] || '•'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-heading text-xs text-foreground font-medium leading-tight">
                          {t.headline}
                        </div>
                        {t.details && (
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {t.details}
                          </div>
                        )}
                      </div>
                      {t.teamKey && (
                        <span className="text-[9px] font-heading font-bold text-muted-foreground shrink-0 mt-0.5">
                          {TEAMS[t.teamKey]?.abbr || t.teamKey.toUpperCase()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === 'Unknown Date') return 'Unknown Date';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) { return dateStr; }
}