import React from 'react';

// Player nicknames — researched from 1984 MLB lore
const NICKNAMES = {
  "Ryne Sandberg": ["Ryno"],
  "Kirk Gibson": ["Gibby"],
  "Dwight Gooden": ["Doc", "Dr. K"],
  "Tony Gwynn": ["Mr. Padre"],
  "Darryl Strawberry": ["Straw"],
  "Cal Ripken Jr.": ["The Iron Man"],
  "Keith Hernandez": ["Mex"],
  "Dave Winfield": ["Big Dave"],
  "Don Mattingly": ["Donnie Baseball", "The Hit Man"],
  "Jack Morris": ["The Cat"],
  "Alan Trammell": ["Tram"],
  "Rick Sutcliffe": ["The Red Baron"],
  "Phil Niekro": ["Knucksie"],
  "Fernando Valenzuela": ["El Toro"],
  "Goose Gossage": ["Goose"],
  "Lee Smith": ["Big Lee"],
  "Wade Boggs": ["Chicken Man"],
  "Lance Parrish": ["Big Wheel"],
  "Lou Whitaker": ["Sweet Lou"],
  "Bob Dernier": ["The Deer"],
  "Gary Matthews": ["Sarge"],
  "Ron Cey": ["The Penguin"],
  "Dwight Evans": ["Dewey"],
  "Jim Rice": ["Jim Ed"],
  "Andre Dawson": ["The Hawk"],
  "Eddie Murray": ["Steady Eddie"],
  "Dave Righetti": ["Rags"],
  "Ron Guidry": ["Louisiana Lightning", "Gator"],
  "Willie Hernandez": ["Guillermo"],
  "Orel Hershiser": ["Bulldog"],
  "Pedro Guerrero": ["Pete"],
  "Bill Buckner": ["Billy Buck"],
  "Mookie Wilson": ["Mook"],
  "Dennis Eckersley": ["Eck"],
  "Bruce Sutter": ["The Riddler"],
  "Dan Quisenberry": ["Quiz"],
};

function getCommentary(batter, pitcher, gameState) {
  const batterName = batter?.name || '';
  const lastName = batterName.split(' ').pop() || batterName;

  // Stats for this game
  const ab = batter?.gameStats?.ab || 0;
  const hits = batter?.gameStats?.hits || 0;
  const rbi = batter?.gameStats?.rbi || 0;
  const hr = batter?.gameStats?.hr || 0;
  const avg = ab > 0 ? (hits / ab).toFixed(3) : '.000';

  const count = `${gameState.balls}-${gameState.strikes}`;
  const outs = gameState.outs;
  const inning = gameState.inning;
  const half = gameState.halfInning === 'top' ? 'top' : 'bottom';
  const pos = batter?.assignedPos || batter?.pos || '';
  const posName = { C: 'catcher', '1B': 'first baseman', '2B': 'second baseman', '3B': 'third baseman', SS: 'shortstop', LF: 'left fielder', CF: 'center fielder', RF: 'right fielder', DH: 'designated hitter', SP: 'pitcher' }[pos] || pos;

  const nicknames = NICKNAMES[batterName] || [];
  const hasNick = nicknames.length > 0;

  const options = [];

  // Count/outs announcement
  options.push(`The ${count} count, ${outs === 0 ? 'nobody' : outs === 1 ? 'one' : 'two'} ${outs === 1 ? 'away' : 'out'}`);
  options.push(`${count} the count, ${outs} ${outs === 1 ? 'out' : 'outs'}, ${half} ${inning}`);

  // Player intro — fresh at-bat
  if (ab === 0) {
    options.push(`Now batting, ${posName}, ${batterName}`);
    options.push(`Up now, ${batterName}`);
    options.push(`Now at the plate: ${batterName}`);
    if (hasNick) {
      options.push(`Here comes ${nicknames[0]}`);
      options.push(`Up now, ${batterName} — they call him ${nicknames[0]}`);
    }
  }

  // With stats
  if (ab > 0) {
    options.push(`${batterName}, ${hits} for ${ab} today`);
    if (rbi > 0) options.push(`${batterName} — ${hits} for ${ab} with ${rbi} RBI${rbi !== 1 ? 's' : ''}`);
    if (hr > 0) options.push(`${lastName} has gone deep today — ${hits} for ${ab}`);
    options.push(`${batterName} hitting ${avg} on the afternoon`);
    if (hasNick) {
      options.push(`${nicknames[0]} steps in — ${hits} for ${ab} today`);
    }
  }

  // Pitcher focus
  options.push(`${pitcher?.name} deals from the stretch`);
  options.push(`${pitcher?.name} looks in for the sign`);

  // Runners on
  const runnersOn = gameState.bases.filter(b => b !== null).length;
  if (runnersOn === 1) options.push(`Runner aboard for ${lastName}`);
  if (runnersOn === 2) options.push(`Two on, two ${outs === 2 ? 'away' : 'down'}`);
  if (runnersOn === 3) options.push(`Bases loaded, ${outs === 0 ? 'nobody' : outs + ' ' + (outs === 1 ? 'out' : 'outs')}`);

  // Situation
  if (runnersOn > 0 && outs < 2) options.push(`Chance to drive in a run here`);
  if (outs === 2) options.push(`Two away, ${lastName} at the dish`);

  return options[Math.floor(Math.random() * options.length)];
}

export default function CommentaryBanner({ batter, pitcher, gameState }) {
  if (!batter || !gameState) {
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-1.5 text-center">
        <span className="text-[10px] text-muted-foreground font-heading italic">...and we're underway!</span>
      </div>
    );
  }

  const text = getCommentary(batter, pitcher, gameState);

  return (
    <div className="bg-card/80 border border-border rounded-xl px-4 py-3 text-center overflow-hidden">
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
        <span className="text-xs text-muted-foreground/60 font-heading uppercase tracking-[0.25em]">ON AIR</span>
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
      </div>
      <p className="text-base sm:text-lg font-heading font-semibold text-foreground/95 mt-1.5 leading-snug italic">
        "{text}"
      </p>
      {/* Count indicators inline */}
      <div className="flex items-center justify-center gap-6 mt-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">B</span>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.balls ? 'bg-green-500' : 'bg-muted/40'}`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">S</span>
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.strikes ? 'bg-primary' : 'bg-muted/40'}`} />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-muted-foreground">O</span>
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < gameState.outs ? 'bg-destructive' : 'bg-muted/40'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}