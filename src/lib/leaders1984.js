// 1984 MLB Leader Lists for Achievement Tracking
// Player names must match gameData.js exactly
// Each list defines an achievement requiring the user to accomplish a stat with EVERY player

export const LEADER_LISTS = {
  hr: {
    achievementId: 'leaders_hr',
    statKey: 'leaderHR',
    threshold: 1,
    title: '1984 Home Run Leaders',
    players: [
      'Tony Armas', 'Dale Murphy', 'Mike Schmidt', 'Dave Kingman',
      'Lance Parrish', 'Dwayne Murphy', 'Gary Carter', 'Darryl Strawberry',
      'Ron Cey', 'George Foster',
    ],
  },
  runs: {
    achievementId: 'leaders_runs',
    statKey: 'leaderRuns',
    threshold: 1,
    title: '1984 Runs Leaders',
    players: [
      'Dwight Evans', 'Ryne Sandberg', 'Rickey Henderson', 'Wade Boggs',
      'Brett Butler', 'Tony Armas', 'Tim Raines', 'Alan Wiggins',
      'Dave Winfield', 'Juan Samuel', 'Robin Yount',
    ],
  },
  rbi: {
    achievementId: 'leaders_rbi',
    statKey: 'leaderRBI',
    threshold: 1,
    title: '1984 RBI Leaders',
    players: [
      'Tony Armas', 'Jim Rice', 'Dave Kingman', 'Alvin Davis',
      'Eddie Murray', 'Kent Hrbek', 'Gary Carter', 'Mike Schmidt',
      'Dwight Evans', 'Don Mattingly', 'Dale Murphy',
    ],
  },
  hits: {
    achievementId: 'leaders_hits',
    statKey: 'leaderHits',
    threshold: 10,
    title: '1984 Hits Leaders',
    players: [
      'Don Mattingly', 'Wade Boggs', 'Dave Winfield', 'Alan Trammell',
      'Ryne Sandberg', 'Tony Gwynn', 'Willie Wilson', 'Dale Murphy',
      'Juan Samuel', 'Keith Hernandez',
    ],
  },
  doubles: {
    achievementId: 'leaders_doubles',
    statKey: 'leaderDoubles',
    threshold: 1,
    title: '1984 Doubles Leaders',
    players: [
      'Don Mattingly', 'Larry Parrish', 'George Bell', 'Tim Raines',
      'Johnny Ray', 'Dwight Evans', 'Cal Ripken Jr.', 'Buddy Bell',
      'Ryne Sandberg', 'Juan Samuel',
    ],
  },
  triples: {
    achievementId: 'leaders_triples',
    statKey: 'leaderTriples',
    threshold: 1,
    title: '1984 Triples Leaders',
    players: [
      'Juan Samuel', 'Ryne Sandberg', 'Willie Wilson', 'Brett Butler',
      'Lloyd Moseby', 'Alfredo Griffin', 'Kirk Gibson',
      'Roberto Kelly', 'Eddie Milner', 'Dave Winfield',
    ],
  },
  sb: {
    achievementId: 'leaders_sb',
    statKey: 'leaderSB',
    threshold: 1,
    title: '1984 Stolen Base Leaders',
    players: [
      'Tim Raines', 'Juan Samuel', 'Alan Wiggins', 'Rickey Henderson',
      'Brett Butler', 'Bob Dernier', 'Vince Coleman', 'Lonnie Smith',
      'Damaso Garcia', 'Gary Redus', 'Willie Wilson',
    ],
  },
  wins: {
    achievementId: 'leaders_wins',
    statKey: 'leaderWins',
    threshold: 1,
    title: '1984 Wins Leaders',
    players: [
      'Joaquin Andujar', 'Mike Boddicker', 'Jack Morris', 'Alejandro Pena',
      'Rick Sutcliffe', 'Bert Blyleven', 'Dwight Gooden', 'Bryn Smith',
      'Bud Black', 'Mario Soto',
    ],
  },
  saves: {
    achievementId: 'leaders_saves',
    statKey: 'leaderSaves',
    threshold: 1,
    title: '1984 Saves Leaders',
    players: [
      'Dan Quisenberry', 'Bruce Sutter', 'Donnie Moore', 'Dave Righetti',
      'Willie Hernandez', 'Goose Gossage', 'Lee Smith', 'Tom Hume',
      'Jeff Reardon', 'George Frazier', 'Al Holland',
    ],
  },
  so: {
    achievementId: 'leaders_so',
    statKey: 'leaderSO',
    threshold: 50,
    title: '1984 Strikeout Leaders',
    players: [
      'Dwight Gooden', 'Mark Langston', 'Fernando Valenzuela', 'Mario Soto',
      'Bert Blyleven', 'Jack Morris', 'Bruce Hurst', 'Joaquin Andujar',
      'John Tudor', 'Charlie Lea',
    ],
  },
};

// Helper: get progress for a leader achievement (for UI display)
export function getLeaderProgress(statKey) {
  const config = Object.values(LEADER_LISTS).find(c => c.statKey === statKey);
  if (!config) return null;
  let store = {};
  try {
    const raw = localStorage.getItem('bb84_stats');
    if (raw) {
      const stats = JSON.parse(raw);
      store = (stats.leaderStats && stats.leaderStats[statKey]) || {};
    }
  } catch (e) { /* ignore */ }
  const met = config.players.filter(name => (store[name] || 0) >= config.threshold).length;
  return { met, total: config.players.length, threshold: config.threshold };
}