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

// 1984 Announcers & Stadium Flavor
const STADIUM_FLAVOR = {
  chicagoCubs: {
    announcers: ["Harry Caray", "Steve Stone"],
    stadium: "Wrigley Field",
    nicknames: ["The Friendly Confines", "Wrigley"],
    flavor: [
      "the ivy-covered brick walls here at Wrigley",
      "the Bleacher Bums are on their feet out in left",
      "a classic afternoon at the Friendly Confines",
      "that brick wall — it'll eat up a line drive in a hurry",
      "the wind is blowing out toward Waveland Avenue today",
      "natural grass and sunshine on the North Side",
      "you can feel the history in this old ballpark",
      "Ernie Banks used to say 'let's play two' right here",
      "the manual scoreboard out in center field",
      "Lake Michigan just a few blocks east of here",
    ],
    cityFlavor: [
      "the Windy City is buzzing today",
      "out on the North Side of Chicago",
      "a beautiful afternoon in Chicago",
      "the Second City loves its Cubbies",
      "deep dish pizza and baseball — doesn't get better",
    ],
  },
  bostonRedSox: {
    announcers: ["Ned Martin", "Bob Montgomery"],
    stadium: "Fenway Park",
    nicknames: ["Fenway", "America's Most Beloved Ballpark"],
    flavor: [
      "the Green Monster looming out in left field",
      "Pesky's Pole just 302 feet down the right field line",
      "the manual scoreboard on the Monster",
      "so much history in this old yard — Ted Williams, Carl Yastrzemski",
      "the Triangle out in deep center field",
      "Fenway's been here since 1912",
      "those tight dimensions always keep things interesting",
      "the crowd is packed in tight along the baselines",
      "that short porch in right — Pesky's Pole is just waiting",
    ],
    cityFlavor: [
      "the Back Bay is alive this afternoon",
      "clam chowder and baseball in Boston",
      "the Freedom Trail, the Charles River, and Fenway",
      "you can smell the sausage and peppers on Lansdowne Street",
      "Boston's been a baseball town since the beginning",
    ],
  },
  detroitTigers: {
    announcers: ["Ernie Harwell", "Paul Carey"],
    stadium: "Tiger Stadium",
    nicknames: ["The Corner", "Tiger Stadium"],
    flavor: [
      "the right field overhang here at The Corner",
      "Tiger Stadium — baseball at Michigan and Trumbull",
      "the upper deck hangs right over the field",
      "Ty Cobb and Hank Greenberg called this place home",
      "the echoes of '68 still ring through these rafters",
    ],
    cityFlavor: [
      "Motown is rocking this afternoon",
      "the Motor City and its Tigers",
      "a great afternoon in Detroit",
    ],
  },
  sanDiegoPadres: {
    announcers: ["Jerry Coleman", "Dave Campbell"],
    stadium: "Jack Murphy Stadium",
    nicknames: ["The Murph", "Jack Murphy"],
    flavor: [
      "perfect San Diego weather at The Murph",
      "the palm trees swaying beyond the outfield",
      "Tony Gwynn territory out in right field",
      "the breeze off the Pacific keeping things cool",
    ],
    cityFlavor: [
      "sunshine and baseball in San Diego",
      "America's Finest City enjoying a ballgame",
    ],
  },
  newYorkYankees: {
    announcers: ["Phil Rizzuto", "Bill White"],
    stadium: "Yankee Stadium",
    nicknames: ["The House That Ruth Built", "The Stadium"],
    flavor: [
      "Monument Park out beyond the center field fence",
      "the ghosts of Ruth, Gehrig, and Mantle",
      "the short porch in right — 314 feet to the pole",
      "27 World Championships hanging in the rafters",
      "the Bronx is buzzing this afternoon",
    ],
    cityFlavor: [
      "the Big Apple and its Yankees",
      "baseball in the Bronx",
    ],
  },
  baltimoreOrioles: {
    announcers: ["Chuck Thompson", "Brooks Robinson"],
    stadium: "Memorial Stadium",
    nicknames: ["Memorial Stadium", "The Old Gray Lady"],
    flavor: [
      "Memorial Stadium — home of the Birds since '54",
      "Brooks Robinson made magic at the hot corner here",
      "Cal Ripken's home field",
      "the Oriole Way — pitching and defense",
    ],
    cityFlavor: [
      "crab cakes and baseball in Baltimore",
      "Charm City loves its Orioles",
    ],
  },
  losAngelesDodgers: {
    announcers: ["Vin Scully"],
    stadium: "Dodger Stadium",
    nicknames: ["Chavez Ravine", "Blue Heaven on Earth"],
    flavor: [
      "the San Gabriel Mountains beyond the outfield pavilions",
      "Vin Scully's voice echoing through the Ravine",
      "Fernandomania was born right here",
      "perfect Southern California afternoon for baseball",
      "the left field pavilion and those Dodger Dogs",
    ],
    cityFlavor: [
      "sunshine and baseball in Los Angeles",
      "a beautiful afternoon at Chavez Ravine",
    ],
  },
  newYorkMets: {
    announcers: ["Ralph Kiner", "Tim McCarver"],
    stadium: "Shea Stadium",
    nicknames: ["Shea"],
    flavor: [
      "the jets taking off from LaGuardia beyond the outfield",
      "Shea Stadium in Flushing Meadows",
      "Doc Gooden's home turf",
      "the apple in the top hat beyond the center field fence",
    ],
    cityFlavor: [
      "Queens is loving its Mets today",
      "the other team in New York — but their fans are as loyal as they come",
    ],
  },
};

// Team key to flavor key mapping
const TEAM_TO_FLAVOR = {
  chicagoCubs: "chicagoCubs",
  bostonRedSox: "bostonRedSox",
  detroitTigers: "detroitTigers",
  sanDiegoPadres: "sanDiegoPadres",
  newYorkYankees: "newYorkYankees",
  baltimoreOrioles: "baltimoreOrioles",
  losAngelesDodgers: "losAngelesDodgers",
  newYorkMets: "newYorkMets",
};

function getCommentary(batter, pitcher, gameState, stadiumInfo) {
  const batterName = batter?.name || '';
  const lastName = batterName.split(' ').pop() || batterName;

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
  const runnersOn = gameState.bases.filter(b => b !== null).length;

  const info = stadiumInfo || {};
  const announcer = info.announcers ? info.announcers[Math.floor(Math.random() * info.announcers.length)] : null;

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
      if (announcer) options.push(`${announcer}: "Here comes ${nicknames[0]}"`);
    }
  }

  // With stats
  if (ab > 0) {
    options.push(`${batterName}, ${hits} for ${ab} today`);
    if (rbi > 0) options.push(`${batterName} — ${hits} for ${ab} with ${rbi} RBI${rbi !== 1 ? 's' : ''}`);
    if (hr > 0) options.push(`${lastName} has gone deep today — ${hits} for ${ab}`);
    options.push(`${batterName} hitting ${avg} on the afternoon`);
  }

  // Pitcher focus
  options.push(`${pitcher?.name} deals from the stretch`);
  options.push(`${pitcher?.name} looks in for the sign`);

  // Runners on
  if (runnersOn === 1) options.push(`Runner aboard for ${lastName}`);
  if (runnersOn === 2) options.push(`Two on, two ${outs === 2 ? 'away' : 'down'}`);
  if (runnersOn === 3) options.push(`Bases loaded, ${outs === 0 ? 'nobody' : outs + ' ' + (outs === 1 ? 'out' : 'outs')}`);

  // Situation
  if (runnersOn > 0 && outs < 2) options.push(`Chance to drive in a run here`);
  if (outs === 2) options.push(`Two away, ${lastName} at the dish`);

  // --- Stadium Flavor ---
  if (info.flavor) {
    const flav = info.flavor[Math.floor(Math.random() * info.flavor.length)];
    options.push(flav);
    if (announcer) options.push(`${announcer}: "${flav}"`);
  }
  if (info.cityFlavor) {
    const cflav = info.cityFlavor[Math.floor(Math.random() * info.cityFlavor.length)];
    options.push(cflav);
  }

  // Inning-specific atmosphere
  if (inning === 1) {
    options.push(`First inning here at ${info.stadium || 'the ballpark'}`);
    if (announcer) options.push(`${announcer}: "Welcome to ${info.stadium || 'the ballpark'}!"`);
  }
  if (inning === 9 && outs === 2 && half === 'bottom') {
    options.push(`Last call here at ${info.stadium || 'the ballpark'} — one out to go!`);
  }

  // Stadium-specific scoring context
  if (info.nicknames) {
    const nickname = info.nicknames[Math.floor(Math.random() * info.nicknames.length)];
    options.push(`A beautiful day at ${nickname}`);
  }

  return options[Math.floor(Math.random() * options.length)];
}

export default function CommentaryBanner({ batter, pitcher, gameState, lastPlay, stadium, homeTeamKey }) {
  if (!batter || !gameState) {
    return (
      <div className="bg-card border border-border rounded-xl px-4 py-3 text-center">
        <span className="text-sm text-muted-foreground font-heading italic">...and we're underway!</span>
      </div>
    );
  }

  const flavorKey = TEAM_TO_FLAVOR[homeTeamKey] || null;
  const stadiumInfo = flavorKey ? STADIUM_FLAVOR[flavorKey] : null;
  const text = getCommentary(batter, pitcher, gameState, stadiumInfo);

  return (
    <div className="bg-card/80 border border-border rounded-xl px-4 py-3 text-center overflow-hidden">
      {/* ON AIR banner */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
        <span className="text-xs text-muted-foreground/60 font-heading uppercase tracking-[0.25em]">
          {stadiumInfo?.announcers?.[0] || 'ON AIR'}
        </span>
        <span className="text-xs text-red-400 font-display animate-pulse">●</span>
      </div>

      {/* Announcer name tag */}
      {stadiumInfo?.announcers?.length >= 2 && (
        <div className="text-[10px] text-muted-foreground/50 font-heading tracking-wider mt-0.5">
          with {stadiumInfo.announcers.join(' & ')}
        </div>
      )}

      {/* Main call */}
      <p className="text-base sm:text-lg font-heading font-semibold text-foreground/95 mt-1.5 leading-snug italic">
        "{text}"
      </p>

      {/* Last play flash */}
      {lastPlay && lastPlay.text && (
        <div className="mt-2 bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5 inline-block">
          <span className="text-sm font-heading font-bold text-primary">{lastPlay.text}</span>
        </div>
      )}

      {/* Count indicators */}
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

      {/* Stadium tag */}
      {stadiumInfo?.stadium && (
        <div className="mt-2 text-[10px] text-muted-foreground/40 font-heading tracking-wide">
          🏟 {stadiumInfo.stadium}
        </div>
      )}
    </div>
  );
}