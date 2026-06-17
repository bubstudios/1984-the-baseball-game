// 1984 Ballpark Dimensions & Quirks
// Distances in feet, wall heights in feet
// HR factors: multiplier on home run probability per batter handedness

export const BALLPARKS = {
  "Tiger Stadium": {
    dimensions: {
      LF: { distance: 340, wallHeight: 8 },
      LCF: { distance: 365, wallHeight: 8 },
      CF: { distance: 440, wallHeight: 8 },
      RCF: { distance: 370, wallHeight: 8 },
      RF: { distance: 325, wallHeight: 8 },
    },
    quirks: ["overhangRF", "deepCF"],
    hrFactors: { LH: 1.05, RH: 1.08 },
    avgDistance: 368,
    description: "Deep center field (440'), but cozy corners. The right field overhang turns routine flies into souvenirs.",
    wallDesc: { LF: "the left field fence", LCF: "the left-center gap", CF: "deepest center field in baseball at 440 feet", RCF: "the right-center alley", RF: "the right field overhang" },
  },
  "Jack Murphy Stadium": {
    dimensions: {
      LF: { distance: 327, wallHeight: 8 },
      LCF: { distance: 370, wallHeight: 8 },
      CF: { distance: 405, wallHeight: 8 },
      RCF: { distance: 370, wallHeight: 8 },
      RF: { distance: 327, wallHeight: 8 },
    },
    quirks: [],
    hrFactors: { LH: 0.97, RH: 0.97 },
    avgDistance: 360,
    description: "Symmetrical dimensions. The marine layer can knock down deep flies late in the evening.",
    wallDesc: { LF: "the left field fence", LCF: "the left-center gap", CF: "the center field wall, 405 feet away", RCF: "the right-center alley", RF: "the right field fence" },
  },
  "Wrigley Field": {
    dimensions: {
      LF: { distance: 355, wallHeight: 12 },
      LCF: { distance: 368, wallHeight: 12 },
      CF: { distance: 400, wallHeight: 12 },
      RCF: { distance: 368, wallHeight: 10 },
      RF: { distance: 353, wallHeight: 10 },
    },
    quirks: ["ivy", "basket", "windTunnel"],
    hrFactors: { LH: 1.00, RH: 1.00 },
    avgDistance: 369,
    description: "Ivy-covered brick walls and a home run basket. Wind is everything here — blowing out, it's a launching pad; blowing in, forget it.",
    wallDesc: { LF: "the ivy-covered wall in left", LCF: "the ivy in left-center", CF: "the ivy-covered center field wall", RCF: "the ivy in right-center", RF: "the basket hanging over the right field wall" },
  },
  "Shea Stadium": {
    dimensions: {
      LF: { distance: 338, wallHeight: 8 },
      LCF: { distance: 378, wallHeight: 8 },
      CF: { distance: 410, wallHeight: 8 },
      RCF: { distance: 378, wallHeight: 8 },
      RF: { distance: 338, wallHeight: 8 },
    },
    quirks: ["windyFlushing"],
    hrFactors: { LH: 0.98, RH: 0.98 },
    avgDistance: 368,
    description: "Symmetrical and fair. Jets from LaGuardia provide a constant soundtrack.",
    wallDesc: { LF: "the left field fence", LCF: "the left-center gap", CF: "the center field wall, 410 feet from home", RCF: "the right-center alley", RF: "the right field fence" },
  },
  "Fenway Park": {
    dimensions: {
      LF: { distance: 310, wallHeight: 37 },
      LCF: { distance: 379, wallHeight: 37 },
      CF: { distance: 390, wallHeight: 17 },
      RCF: { distance: 420, wallHeight: 5 },
      RF: { distance: 302, wallHeight: 5 },
    },
    quirks: ["greenMonster", "peskyPole", "deepRCF", "triangle"],
    hrFactors: { LH: 0.80, RH: 1.15 },
    avgDistance: 360,
    description: "The Green Monster (37' wall in left) turns would-be HRs into singles. Pesky's Pole (302' in right) turns pop-ups into HRs.",
    wallDesc: { LF: "the Green Monster looming 37 feet high", LCF: "the Monster in left-center", CF: "the center field wall", RCF: "the deepest part of the park at 420 feet", RF: "Pesky's Pole just 302 feet away" },
  },
  "Yankee Stadium": {
    dimensions: {
      LF: { distance: 318, wallHeight: 8 },
      LCF: { distance: 387, wallHeight: 8 },
      CF: { distance: 417, wallHeight: 8 },
      RCF: { distance: 385, wallHeight: 8 },
      RF: { distance: 314, wallHeight: 8 },
    },
    quirks: ["shortRF", "monumentPark"],
    hrFactors: { LH: 1.28, RH: 0.92 },
    avgDistance: 364,
    description: "The short porch in right (314') is a left-handed pull hitter's dream. Monument Park sits beyond the center field fence.",
    wallDesc: { LF: "the left field corner at 318 feet", LCF: "the left-center gap", CF: "the center field wall past Monument Park at 417 feet", RCF: "the right-center alley", RF: "the short porch — just 314 feet down the line" },
  },
  "Memorial Stadium": {
    dimensions: {
      LF: { distance: 309, wallHeight: 8 },
      LCF: { distance: 378, wallHeight: 8 },
      CF: { distance: 405, wallHeight: 8 },
      RCF: { distance: 378, wallHeight: 8 },
      RF: { distance: 309, wallHeight: 8 },
    },
    quirks: [],
    hrFactors: { LH: 1.02, RH: 1.02 },
    avgDistance: 356,
    description: "Short down both lines (309') but quickly deepens. Fair for all hitters.",
    wallDesc: { LF: "the short left field porch at 309 feet", LCF: "the left-center gap", CF: "the center field wall at 405 feet", RCF: "the right-center alley", RF: "the short right field line at 309 feet" },
  },
  "Dodger Stadium": {
    dimensions: {
      LF: { distance: 330, wallHeight: 8 },
      LCF: { distance: 385, wallHeight: 8 },
      CF: { distance: 400, wallHeight: 8 },
      RCF: { distance: 385, wallHeight: 8 },
      RF: { distance: 330, wallHeight: 8 },
    },
    quirks: [],
    hrFactors: { LH: 0.95, RH: 0.95 },
    avgDistance: 366,
    description: "Pitcher-friendly with deep alleys. The marine layer at night can turn fly balls into warning track outs.",
    wallDesc: { LF: "the left field pavilion at 330 feet", LCF: "the deep left-center gap", CF: "the center field wall at 400 feet", RCF: "the right-center alley", RF: "the right field pavilion at 330 feet" },
  },
};

// Map field direction based on batter handedness and random pull tendency
// LHH: pulls to RF (60%), goes to CF (25%), opposite to LF (15%)
// RHH: pulls to LF (60%), goes to CF (25%), opposite to RF (15%)
export function getHitDirection(batterBats) {
  const roll = Math.random();
  if (batterBats === 'L') {
    if (roll < 0.60) return 'RF';       // pull
    if (roll < 0.85) return 'RCF';      // slight pull
    if (roll < 0.92) return 'CF';       // center
    if (roll < 0.96) return 'LCF';      // opposite
    return 'LF';                         // oppo
  } else {
    if (roll < 0.60) return 'LF';       // pull
    if (roll < 0.85) return 'LCF';      // slight pull
    if (roll < 0.92) return 'CF';       // center
    if (roll < 0.96) return 'RCF';      // opposite
    return 'RF';                         // oppo
  }
}

// Get the distance to a specific field section
export function getFieldDistance(ballpark, field) {
  return ballpark.dimensions[field]?.distance || 400;
}

// Get wall height for a field section
export function getWallHeight(ballpark, field) {
  return ballpark.dimensions[field]?.wallHeight || 8;
}

// Compute combined ballpark + weather HR multiplier for this at-bat
// Returns { hrMod, quirkOutcomes: [] }
export function getBallparkEffect(stadiumName, batterBats, weather) {
  const ballpark = BALLPARKS[stadiumName];
  if (!ballpark) return { hrMod: 1.0, quirkOutcomes: [] };

  // Base HR factor from ballpark
  const baseHR = ballpark.hrFactors[batterBats] || 1.0;

  // Wind interaction with ballpark dimensions
  let windMod = 1.0;
  const quirks = [];

  if (weather && weather.windDirection && weather.windSpeed !== 'calm') {
    const windStrength = weather.windSpeed === 'strong' ? 1.0 : weather.windSpeed === 'moderate' ? 0.55 : 0.25;
    const windDir = weather.windDirection;

    if (windDir === 'out') {
      windMod += windStrength * 0.40;
      // Wind blowing out at Wrigley = lots of HRs
      if (ballpark.quirks.includes('windTunnel')) windMod += windStrength * 0.15;
      // Wind blowing out to short porch = even more HRs
      if (batterBats === 'L' && ballpark.quirks.includes('shortRF') && windStrength > 0.5) {
        quirks.push('Wind blowing out toward the short porch — lefties are licking their chops');
      }
      if (batterBats === 'R' && ballpark.quirks.includes('greenMonster') && windStrength > 0.5) {
        quirks.push('Wind carrying toward the Monster — could turn a fly ball into trouble');
      }
    } else if (windDir === 'in') {
      windMod -= windStrength * 0.35;
      if (ballpark.quirks.includes('windTunnel')) windMod -= windStrength * 0.10;
      if (ballpark.quirks.includes('greenMonster')) {
        quirks.push('Wind blowing in, driving balls down off the Monster');
      }
    } else if (windDir === 'left') {
      // Cross-wind: slight HR effect + can create quirk
      if (batterBats === 'R' && windStrength > 0.5 && ballpark.quirks.includes('peskyPole')) {
        quirks.push('Cross-wind pushing toward Pesky\'s Pole — could help a right-handed pull');
      }
      if (batterBats === 'L' && windStrength > 0.5 && ballpark.quirks.includes('shortRF')) {
        quirks.push('Cross-wind drifting toward the short porch');
      }
    } else if (windDir === 'right') {
      if (batterBats === 'R' && windStrength > 0.5 && ballpark.quirks.includes('shortRF')) {
        // Wind pushing to RF helps RHH oppo power
        windMod += windStrength * 0.10;
      }
    } else if (windDir === 'swirling') {
      // Swirling wind: unpredictable
      windMod += (Math.random() - 0.5) * windStrength * 0.30;
    }
  }

  const hrMod = Math.max(0.3, Math.min(2.0, baseHR * windMod));
  return { hrMod, quirkOutcomes: quirks, ballpark };
}

// Check for ballpark quirk outcomes on deep fly balls (near the wall but not HR)
// Returns { type, text, bases } or null
export function checkBallparkQuirk(ballparkName, batterBats, hitDirection, weather) {
  const ballpark = BALLPARKS[ballparkName];
  if (!ballpark) return null;

  const quirks = ballpark.quirks;
  const roll = Math.random();

  // Green Monster: balls off the wall become singles/doubles instead of outs
  if (quirks.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) {
    if (roll < 0.22) {
      const isDouble = roll < 0.08;
      return {
        type: 'offMonster',
        text: isDouble
          ? `Off the Green Monster! ${batterBats === 'R' ? 'The righty' : 'The lefty'} rips it high off the wall — it caroms back toward the infield!`
          : `Lined off the Green Monster! The ball rattles around — the runner has to hold at first.`,
        bases: isDouble ? 2 : 1,
        isHit: true,
      };
    }
  }

  // Wrigley ivy: ball sticks in the ivy → ground rule double
  if (quirks.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF' || hitDirection === 'CF')) {
    if (roll < 0.06) {
      return {
        type: 'ivyStuck',
        text: `Into the ivy! The outfielder throws his hands up — the ball disappeared into the Wrigley Field ivy! Ground rule double.`,
        bases: 2,
        isHit: true,
      };
    }
  }

  // Wrigley basket catch / HR
  if (quirks.includes('basket') && (hitDirection === 'RF' || hitDirection === 'RCF')) {
    if (roll < 0.04) {
      return {
        type: 'basketHR',
        text: `Into the basket! The ball drops right into the home run basket hanging over the right field wall — that's a Wrigley Field special!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // Deep RCF at Fenway — turns would-be HRs into deep fly outs
  if (quirks.includes('deepRCF') && hitDirection === 'RCF') {
    if (roll < 0.30) {
      return {
        type: 'deepRCF',
        text: `Crushed to right-center — but this is the deepest part of Fenway at 420 feet! The outfielder runs it down on the warning track.`,
        bases: 0,
        isHit: false,
      };
    }
  }

  // Fenway Triangle
  if (quirks.includes('triangle') && hitDirection === 'CF') {
    if (roll < 0.12) {
      const isTriple = roll < 0.04;
      return {
        type: 'triangle',
        text: isTriple
          ? `Into the Triangle! The ball rattles around in the deepest corner of Fenway — the center fielder chases it down as the batter races for third!`
          : `Rolls into the Triangle! The batter pulls into second as the outfielder tracks it down in the weird angles of center field.`,
        bases: isTriple ? 3 : 2,
        isHit: true,
      };
    }
  }

  // Short porch at Yankee Stadium — routine fly can become HR
  if (quirks.includes('shortRF') && hitDirection === 'RF') {
    const windOut = weather?.windDirection === 'out';
    const porchChance = windOut ? 0.12 : 0.04;
    if (roll < porchChance) {
      return {
        type: 'shortPorch',
        text: `Down the line to right — and it's gone! The short porch giveth! ${batterBats === 'L' ? 'Classic lefty pull swing' : 'Opposite field'} into the first row!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // Pesky Pole — short RF at Fenway
  if (quirks.includes('peskyPole') && hitDirection === 'RF') {
    if (roll < 0.06) {
      return {
        type: 'peskyPole',
        text: `Hooked around Pesky's Pole! Just 302 feet — it wraps around the foul pole for a Fenway special!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // Yankee Stadium: deep LCF robs HRs
  if (quirks.includes('monumentPark') && (hitDirection === 'CF' || hitDirection === 'LCF')) {
    if (roll < 0.15) {
      return {
        type: 'deepYankee',
        text: `Hammered to deep left-center — but this is 417 feet to the wall past Monument Park! The outfielder makes the catch a step from the fence.`,
        bases: 0,
        isHit: false,
      };
    }
  }

  return null;
}