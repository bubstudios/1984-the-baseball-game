// 1984 MLB Announcer-Specific Home Run Calls
// Documented signature calls for known broadcasters; original calls for other booths.
// Fires ~40% of home runs; the remaining 60% use the existing descriptive calls.

const ANNOUNCER_CALLS = {
  // ── DOCUMENTED SIGNATURE CALLS ──

  cubs: {
    tracking: ['High drive, deep to left field!', "There's a drive!", 'Deep to left!', 'A drive into deep left field!', 'Deep to right field!'],
    payoff: ['It might be... it could be... it is!', 'It might be... it could be... it is! Holy cow!', 'Holy cow! A home run for the Cubs!'],
  },
  phillies: {
    tracking: ['Long drive... deep left field...', 'That ball is...', 'Deep to right field...', 'A long drive into deep left field...'],
    payoff: ['Outta here!', 'and it is outta here!', "That ball is outta here!", 'A long home run, and that ball is outta here!'],
  },
  brewers: {
    tracking: ['Get up!', 'He got all of it!', 'A drive to deep left field!', 'Deep into the Milwaukee night!'],
    payoff: ['Get up! Get outta here! Gone!', 'Get up! Get out! Gone for the Brewers!', 'Get up, ball! Get outta here! Gone!', "He got all of it! Get up! Get outta here! Gone!"],
  },
  tigers: {
    tracking: ['A drive to deep left...', 'He hits a high fly ball...', 'A drive toward the seats!', 'Deep to left field!'],
    payoff: ['That ball is long gone!', 'and it is long gone!', 'That baseball is long gone into the upper deck!', 'That one is long gone!'],
  },
  expos: {
    tracking: ['A high drive!', 'Deep to left field!', 'A high fly ball into deep left!', 'Deep to right field!'],
    payoff: ['Up, up and away!', 'That ball is gone! Up, up and away!', 'Up, up and away — it is gone!'],
  },
  athletics: {
    // Lon Simmons & Bill King shared the booth
    tracking: ['A long drive to right!', 'He got all of that one!', 'Deep into the Coliseum seats!', 'A tremendous drive!', 'A drive to deep right field!'],
    payoff: ['Tell it goodbye!', "Holy Toledo! What a shot!", 'Holy Toledo! That ball is gone!', 'Holy Toledo!', 'Tell it goodbye!'],
  },
  mariners: {
    tracking: ['A high drive!', 'Deep to right field!', 'A high fly ball into deep right!', 'Deep to left field!'],
    payoff: ['It will fly, fly away!', 'It is gone! Fly, fly away!', 'Fly away!'],
    grandSlam: ['Get out the rye bread and mustard, Grandma! It is grand salami time!', 'Break out the rye bread and mustard! Grand salami!'],
  },
  whitesox: {
    tracking: ['Stretch! Stretch!', 'He hurt it!', 'A drive toward the seats!', 'Deep to left field!'],
    payoff: ["You can put it on the board... yes!", 'Mercy! Put it on the board... yes!', "You can put it on the board... yes!"],
  },
  cardinals: {
    tracking: ['Deep to left!', 'A drive to deep left field!', 'He hits a high fly ball!', 'Deep to right field!'],
    payoff: ['Get up, baby! Get up! Get up! Gone!', "Get up, baby! That ball is gone!", 'Come on, ball! Get up! Get up! Home run!'],
  },
  padres: {
    tracking: ['A drive to deep left!', 'Deep to right field!', 'A high drive into deep left!', 'A drive toward the seats!'],
    payoff: ['Ball going... ball gone! Oh, Doctor!', 'Oh, Doctor! That ball is gone!', 'You can hang a star on that one, baby!', 'Ball going... going... gone for the Padres!'],
  },
  yankees: {
    tracking: ['Deep to right field!', 'Holy cow!', 'A drive to deep right!', 'He really got hold of that one!'],
    payoff: ['Holy cow! What a shot!', "Holy cow! That ball is gone!", 'Goodbye, baseball! Holy cow!', "Holy cow! He really got hold of that one!"],
  },
  dodgers: {
    tracking: ['A high fly ball into deep left field...', 'A towering drive to right...', 'Back goes the outfielder... to the wall...', 'A long drive into the pavilion...', 'He hit it high, he hit it deep...'],
    payoff: ['she is gone!', 'and she is gone!', 'and he hit it out!', 'home run.'],
  },
  orioles: {
    tracking: ['A tremendous drive!', 'Deep into the seats!', 'A drive to deep right field!', 'A high fly ball into deep left!'],
    payoff: ['Go to war, Miss Agnes! That ball is gone!', "Ain't the beer cold!", 'Go to war, Miss Agnes!', "The Orioles have another home run! Ain't the beer cold!"],
  },

  // ── ORIGINAL CALLS FOR OTHER 1984 BOOTHS ──

  bluejays: {
    tracking: ['A high drive to left field...', 'Deep to right!', 'The outfielder is at the wall...', 'A drive toward the seats!'],
    payoff: ['and that ball is gone!', 'The Blue Jays have a home run!', 'and he will not get it!', 'That ball carries over the fence for a Toronto home run!'],
  },
  indians: {
    tracking: ['High and deep to left field...', 'A drive toward the seats!', 'A high fly ball into deep left!'],
    payoff: ['gone!', 'That ball is hit a long way, and it is out of here!', 'The Indians have a home run!', 'The outfielder looks up, and that ball is gone!'],
  },
  redsox: {
    tracking: ['A high drive toward the left-field wall...', 'Deep to right field!', 'A drive toward the seats!'],
    payoff: ['gone!', 'That ball clears the Green Monster!', 'A tremendous shot into the screen above the wall!', 'and that one is into the seats!', 'Mercy, what a drive!'],
  },
  royals: {
    tracking: ['High and deep to left field...', 'A drive toward the wall...', 'The outfielder goes back...'],
    payoff: ['gone.', 'That ball is driven over the wall for a home run.', 'looks up, and it is gone.', 'A two-run home run gives Kansas City the lead!'],
  },
  twins: {
    tracking: ['A drive to deep right field...', 'A high fly ball into deep left!', 'High and deep to left!'],
    payoff: ['and it is gone!', 'That ball carries into the seats for a Twins home run!', 'The outfielder has run out of room!', 'He can touch them all after that one!'],
  },
  angels: {
    tracking: ['A towering drive to right field...', 'A high fly ball into deep right!', 'A long drive into the Anaheim night!'],
    payoff: ['and it is gone!', 'The Angels have another run!', 'The halo has another reason to shine!'],
  },
  rangers: {
    tracking: ['A high drive to deep left...', 'A drive toward the seats!', 'A long drive into the Texas night!'],
    payoff: ['goodbye, baseball!', 'That ball is headed into the seats!', 'A long home run for the Rangers!', 'He turned on that pitch and sent it over the wall!'],
  },
  mets: {
    tracking: ['A high drive to right field...', 'A drive toward the wall...', 'A high fly ball into deep right!'],
    payoff: ['it is gone!', 'A home run for the Mets!', 'That ball carries over the wall, and Shea Stadium comes alive!', 'He got all of that pitch and sent it into the seats!'],
  },
  reds: {
    tracking: ['High fly ball, deep left field...', 'A drive toward the wall...', 'A high fly ball into deep left!'],
    payoff: ['and that one is gone!', 'A long home run for the Reds!', 'The outfielder goes to the wall, looks up, and it is gone!', 'He turned that pitch around in a hurry!'],
  },
  braves: {
    tracking: ['A high fly ball, deep left...', 'A drive toward the seats!', 'A high drive into deep left field!'],
    payoff: ['There it goes! A long drive into the seats!', 'That ball is headed toward downtown!', 'home run!', "Well, that pitch will not be coming back."],
  },
  astros: {
    tracking: ['A high drive to left field...', 'A drive toward the seats!', 'A high fly ball into deep right!'],
    payoff: ['and that ball is gone.', 'He sends it into the seats for a home run.', 'The outfielder reaches the warning track and watches it leave.', 'A well-hit ball that clears the fence in right field.'],
  },
  pirates: {
    tracking: ['A deep drive to right field...', 'A drive toward the seats!', 'A high fly ball into deep right!'],
    payoff: ['there was no doubt about it!', 'That ball is gone, and the Pirates are on the board!', 'A tremendous shot into the seats!', 'He hit that one a long, long way!'],
  },
  giants: {
    tracking: ['A high drive to deep left...', 'A drive toward the seats!', 'A high fly ball into deep right field!'],
    payoff: ['and that ball is gone!', 'The wind will not keep that one in Candlestick!', 'A long home run into the right-field seats!', 'That ball has found shelter beyond the outfield fence!'],
  },
};

/**
 * Returns an announcer-specific home run call string ~40% of the time,
 * or null to fall back to the existing descriptive home run text.
 *
 * @param {string} teamKey - The batting team's key (e.g. 'cubs')
 * @param {object} context - { isGrandSlam, rbi, batterName }
 * @returns {string|null}
 */
export function maybeGetAnnouncerHRCall(teamKey, context = {}) {
  const calls = ANNOUNCER_CALLS[teamKey];
  if (!calls) return null;
  if (Math.random() > 0.40) return null;

  const tracking = calls.tracking[Math.floor(Math.random() * calls.tracking.length)];

  // Grand slam special call (Niehaus, etc.)
  if (context.isGrandSlam && calls.grandSlam) {
    const gs = calls.grandSlam[Math.floor(Math.random() * calls.grandSlam.length)];
    return `${tracking} ${gs}`;
  }

  const payoff = calls.payoff[Math.floor(Math.random() * calls.payoff.length)];
  return `${tracking} ${payoff}`;
}