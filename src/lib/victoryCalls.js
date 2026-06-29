// 1984 Team Victory Calls & Celebration Traditions
// Researched from 1984-era MLB broadcast history

// ── AUTHENTIC SIGNATURE CALLS (documented broadcaster sign-offs) ──
const SIGNATURE_CALLS = {
  cubs:      ['Cubs win! Cubs win! Cubs win!', 'Cubs win! Holy cow! Cubs win!'],
  reds:      ['And this one belongs to the Reds!', 'And the Reds have won it, folks!'],
  cardinals: ["That's a winner!", "And that's a winner for the Cardinals!"],
  mets:      ['And the Mets win the ballgame!', 'And the Mets have won it!'],
};

// ── ORIGINAL ERA-APPROPRIATE CALLS (1984 style, not a documented catchphrase) ──
const ERA_CALLS = {
  angels:    ['The Angels win it, and the halo shines tonight!', 'The Angels have won it, and the halo is lit!'],
  athletics: ['The Athletics put this one in the victory column!', 'The A\'s win it, and they\'re celebrating at the Coliseum!'],
  bluejays:  ['The Blue Jays have won the ballgame!', 'The Blue Jays win it here at Exhibition Stadium!'],
  brewers:   ['The Brewers win it here at County Stadium!', 'The Brewers have won it, and Bernie takes the slide!'],
  indians:   ['The Indians hold on and win it!', 'The Indians have won it at Cleveland Stadium!'],
  orioles:   ['The Orioles win it! A little Orioles Magic tonight!', 'The Orioles have won it, and there\'s magic in the air!'],
  redsox:    ['The Red Sox win it at Fenway Park!', 'The Red Sox have won it, and the Fenway faithful are on their feet!'],
  royals:    ['The Royals have won another one in Kansas City!', 'The Royals win it, and the fountains are flowing!'],
  mariners:  ['The Mariners sail away with the victory!', 'The Mariners have won it at the Kingdome!'],
  rangers:   ['The Rangers have put this one away!', 'The Rangers win it in Arlington!'],
  tigers:    ['The Tigers win it! Bless you, boys!', 'The Tigers have won it! Bless you, boys!'],
  twins:     ['The Twins win the ballgame!', 'The Twins have won it at the Metrodome!'],
  whitesox:  ['The White Sox are winners tonight!', 'The White Sox win it, and the scoreboard is firing!'],
  yankees:   ['The Yankees win! THAAAAA Yankees win!', 'The Yankees win! Holy cow, what a finish!'],
  braves:    ['The Braves have won it here in Atlanta!', 'The Braves win it at Fulton County Stadium!'],
  dodgers:   ['The Dodgers win the ballgame.', 'And the Dodgers have won it in Chavez Ravine.'],
  expos:     ['The Expos have won it in Montreal!', 'Les Expos ont gagné! The Expos win it!'],
  giants:    ['The Giants win it here at Candlestick!', 'The Giants have won it by the Bay!'],
  astros:    ['The Astros have won the ballgame!', 'The Astros win it in the Dome!'],
  padres:    ['The Padres win it at the Murph!', 'The Padres have won it in San Diego!'],
  phillies:  ['The Phillies have won it at Veterans Stadium!', 'The Phillies win it at the Vet!'],
  pirates:   ['The Pirates win it! Raise the Jolly Roger!', 'The Pirates have won it, and the family is celebrating!'],
};

// ── SITUATION-SPECIFIC ALTERNATE ENDINGS ──
const WALKOFF_ENDINGS = [
  'They win it! They win it in the bottom of the ninth!',
  'The winning run scores, and this place erupts!',
  'A walk-off winner!',
  'The ballgame is over, and look at that celebration!',
  'They pour out of the dugout!',
  'The winning run crosses the plate!',
  'The home club has stolen it at the finish!',
  'One swing ends the ballgame!',
  'He is mobbed by his teammates at home plate!',
  'They have won it in their final turn at bat!',
];

const SHUTOUT_ENDINGS = [
  'A shutout victory, and this one is over!',
  'He finishes it with a zero on the scoreboard!',
  'The final out preserves the shutout!',
  'They never allowed a run tonight!',
  'A brilliant pitching performance is complete!',
  'The opposition has been blanked!',
  'He closes the door and completes the shutout!',
  'Nine innings, no runs, and a victory!',
];

const EXTRA_INNING_ENDINGS = [
  'After a long night, they finally win it!',
  'The marathon is over!',
  'They win it in extra innings!',
  'At last, the winning run comes home!',
  'The final chapter belongs to them!',
  'They outlast them and win the ballgame!',
  'This one took extra work, but it belongs to them!',
  'The long night ends with a victory!',
];

const BLOWOUT_ENDINGS = [
  'A convincing victory from beginning to end!',
  'They leave no doubt about this one!',
  'A one-sided finish tonight!',
  'They put this game away early!',
  'The offense supplied more than enough tonight!',
  'A comfortable victory!',
  'They win this one going away!',
  'The final score tells the entire story!',
];

const CLOSE_GAME_ENDINGS = [
  'They escape with a one-run victory!',
  'They hold on by the narrowest of margins!',
  'The tying run is stranded, and the game is over!',
  'They survive one final scare!',
  'A close one, but it goes into the win column!',
  'The defense preserves the victory!',
  'The final out comes with the tying run aboard!',
  'They bend, but they do not break!',
];

const ROAD_WIN_ENDINGS = [
  'They quiet the crowd and win it on the road!',
  'The visitors come into town and take this one!',
  'They pack up a victory for the trip home!',
  'The home crowd goes quiet as the final out is made!',
  'They win this one away from home!',
  'A road victory for the visitors tonight!',
  'They take the series opener in enemy territory!',
  'They leave town with a win!',
];

const GENERIC_ENDINGS = [
  'The final out is recorded, and they win it!',
  'Put this one in the win column!',
  'That will do it-the ballgame is over!',
  'They shake hands around the mound after a victory!',
  'The final score is in, and they come away winners!',
  'They survive the ninth and win the ballgame!',
  'The bullpen closes the door, and this one is over!',
  'The final out is made, and the celebration begins!',
  'They have held on for the victory!',
  'They finish the job and put another one away!',
  'The catcher has it, and the ballgame is over!',
  'The final pitch is delivered, and they are winners!',
  'A hard-earned victory tonight!',
  'They take the opener of the series!',
  'They close out the homestand with a win!',
  'They send the crowd home happy!',
  'They win it before a roaring crowd!',
  'The players gather around the mound-this one is over!',
  'They have come from behind to win it!',
  'The lead holds up, and they win!',
];

// ── TEAM CELEBRATION TRADITIONS (1984-accurate) ──
export const TEAM_CELEBRATIONS = {
  cubs: {
    type: 'flag',
    title: 'FLY THE W',
    subtitle: 'White "W" flag raised over the scoreboard',
    song: 'Go, Cubs, Go',
    songNote: 'Introduced during the 1984 season',
    emoji: '🇨🇺',
  },
  yankees: {
    type: 'song',
    title: 'NEW YORK, NEW YORK',
    subtitle: 'Frank Sinatra plays over the Stadium speakers',
    song: 'Theme from New York, New York',
    songNote: 'Played after Yankees home victories since 1980',
    emoji: '🎩',
  },
  athletics: {
    type: 'song',
    title: 'CELEBRATION',
    subtitle: 'Kool & the Gang plays at the Coliseum',
    song: 'Celebration',
    songNote: 'Played after every A\'s home victory since 1981',
    emoji: '🎉',
  },
  angels: {
    type: 'halo',
    title: 'THE HALO SHINES',
    subtitle: 'The halo atop the Big A is illuminated',
    song: null,
    songNote: 'Drivers passing the stadium could see if the Angels won',
    emoji: '😇',
  },
  brewers: {
    type: 'bernie',
    title: 'BERNIE\'S SLIDE',
    subtitle: 'Bernie Brewer slides from the chalet into the beer mug',
    song: null,
    songNote: 'County Stadium tradition (chalet removed during 1984 renovation)',
    emoji: '🍺',
  },
  tigers: {
    type: 'motown',
    title: 'BLESS YOU, BOYS',
    subtitle: 'Motown sounds fill Tiger Stadium',
    song: 'Dancing in the Street',
    songNote: 'Martha and the Vandellas - the "Motor City" lyric',
    emoji: '🐯',
  },
  orioles: {
    type: 'song',
    title: 'ORIOLES MAGIC',
    subtitle: 'Orioles Magic plays at Memorial Stadium',
    song: 'Orioles Magic',
    songNote: 'Debuted in 1980 - played after dramatic wins',
    emoji: '🐦',
  },
  mets: {
    type: 'song',
    title: 'MEET THE METS',
    subtitle: '1984 recording of Meet the Mets plays at Shea',
    song: 'Meet the Mets',
    songNote: 'Used in broadcasts and ballpark presentation',
    emoji: '🔵',
  },
  pirates: {
    type: 'song',
    title: 'WE ARE FAMILY',
    subtitle: 'The 1979 anthem echoes at Three Rivers',
    song: 'We Are Family',
    songNote: 'Reserve for walk-offs and winning streaks',
    emoji: '🏴‍☠️',
  },
  padres: {
    type: 'song',
    title: 'CUB-BUSTERS',
    subtitle: 'Ghostbusters parody plays at the Murph',
    song: 'Cub-Busters',
    songNote: 'Postseason-specific - activate vs. Cubs',
    emoji: '⚾',
  },
};

// ── FLAVOR TEXT for teams without a documented tradition ──
const TEAM_FLAVOR = {
  redsox:    { emoji: '🧦', line: 'FENWAY FAITHFUL GO HOME HAPPY' },
  dodgers:   { emoji: '⚾', line: 'DODGER BLUE WINS IN THE RAVINE' },
  reds:      { emoji: '🔴', line: 'RIVERFRONT CELEBRATES' },
  royals:    { emoji: '👑', line: 'THE FOUNTAINS FLOW AT ROYALS STADIUM' },
  phillies:  { emoji: '🔔', line: 'THE VET SHAKES' },
  bluejays:  { emoji: '🐦', line: 'EXHIBITION STADIUM CHEERS' },
  indians:   { emoji: '⚾', line: 'THE TRIBE WINS ON THE LAKE' },
  twins:     { emoji: '⚾', line: 'THE DOME GOES WILD' },
  whitesox:  { emoji: '💥', line: 'SOUTH SIDE WINS - SCOREBOARD SALUTES!' },
  mariners:  { emoji: '⚾', line: 'THE KINGDOME RUMBLES' },
  rangers:   { emoji: '⭐', line: 'ARLINGTON ARENA RISES' },
  expos:     { emoji: '⚾', line: 'LE BIG O FÊTE LA VICTOIRE' },
  cardinals: { emoji: '🐦', line: 'BUSCH STADIUM CELEBRATES' },
  braves:    { emoji: '⚾', line: 'THE LAUNCHING PAD CELEBRATES' },
  astros:    { emoji: '⭐', line: 'THE ASTRODOME ROARS' },
  giants:    { emoji: '⚾', line: 'CANDLESTICK HOLDS ON FOR THE WIN' },
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Main function: get the victory call for a winning team ──
// teamKey: the winning team's key
// gameState: the final game state
// isHomeWin: whether the home team won
export function getVictoryCall(teamKey, gameState, isHomeWin) {
  const scoreDiff = gameState.score.home - gameState.score.away;
  const isWalkOff = gameState.halfInning === 'bottom' && isHomeWin && gameState.inning >= 9;
  const isShutout = (isHomeWin ? gameState.score.away : gameState.score.home) === 0;
  const isExtraInnings = gameState.inning > 9;
  const isBlowout = Math.abs(scoreDiff) >= 8;
  const isCloseGame = Math.abs(scoreDiff) <= 1;

  // 1. Walk-off takes priority
  if (isWalkOff) {
    return pickRandom(WALKOFF_ENDINGS);
  }

  // 2. Use team signature/era call 70% of the time, situation-specific 30%
  const useTeamCall = Math.random() < 0.7;

  if (useTeamCall) {
    const calls = SIGNATURE_CALLS[teamKey] || ERA_CALLS[teamKey];
    if (calls) return pickRandom(calls);
  }

  // 3. Situation-specific endings
  if (isShutout && Math.random() < 0.6) return pickRandom(SHUTOUT_ENDINGS);
  if (isExtraInnings) return pickRandom(EXTRA_INNING_ENDINGS);
  if (isBlowout) return pickRandom(BLOWOUT_ENDINGS);
  if (isCloseGame) return pickRandom(CLOSE_GAME_ENDINGS);
  if (!isHomeWin) return pickRandom(ROAD_WIN_ENDINGS);

  return pickRandom(GENERIC_ENDINGS);
}

// ── Get celebration metadata for a team ──
export function getCelebration(teamKey, gameState, isHomeWin) {
  const custom = TEAM_CELEBRATIONS[teamKey];

  // Orioles: only play "Orioles Magic" after dramatic wins (walk-off or comeback)
  if (teamKey === 'orioles') {
    const scoreDiff = gameState.score.home - gameState.score.away;
    const isWalkOff = gameState.halfInning === 'bottom' && isHomeWin && gameState.inning >= 9;
    if (!isWalkOff && Math.abs(scoreDiff) > 3) {
      return getGenericCelebration(teamKey);
    }
  }

  // Pirates: reserve "We Are Family" for walk-offs/streaks
  if (teamKey === 'pirates') {
    const isWalkOff = gameState.halfInning === 'bottom' && isHomeWin && gameState.inning >= 9;
    if (!isWalkOff && Math.random() < 0.7) {
      return getGenericCelebration(teamKey);
    }
  }

  // Padres: "Cub-Busters" only vs Cubs
  if (teamKey === 'padres') {
    const opponentIsCubs = gameState.awayTeam === 'cubs' || gameState.homeTeam === 'cubs';
    if (!opponentIsCubs) {
      return getGenericCelebration(teamKey);
    }
  }

  if (custom) return { ...custom, isCustom: true };
  return getGenericCelebration(teamKey);
}

function getGenericCelebration(teamKey) {
  const flavor = TEAM_FLAVOR[teamKey] || { emoji: '⚾', line: 'THE HOME TEAM WINS!' };
  return {
    type: 'generic',
    title: null,
    subtitle: flavor.line,
    song: null,
    songNote: null,
    emoji: flavor.emoji,
    isCustom: false,
  };
}