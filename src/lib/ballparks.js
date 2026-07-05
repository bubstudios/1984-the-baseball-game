// 1984 Ballpark Dimensions & Quirks - all 26 MLB stadiums
// Dimensions verified against 1984 MLB records
// Wall heights in feet, distances in feet
// HR factors: multiplier on home run probability per batter handedness
// weatherCity: key used by weather.js CLIMATE lookup

export const BALLPARKS = {

  // ── AL EAST ──

  "Tiger Stadium": {
    weatherCity: "Detroit",
    dimensions: {
      LF:  { distance: 340, wallHeight: 9 },
      LCF: { distance: 365, wallHeight: 9 },
      CF:  { distance: 440, wallHeight: 9 },
      RCF: { distance: 370, wallHeight: 9 },
      RF:  { distance: 325, wallHeight: 9 },
    },
    quirks: ["overhangRF", "deepCF"],
    hrFactors: { LH: 1.05, RH: 1.10 },
    avgDistance: 368,
    description: "Deep center (440'), short corners. The famous second-deck RF overhang - 10 feet over fair territory - turns routine fly balls into home runs.",
    wallDesc: {
      LF:  "the left field fence at 340 feet",
      LCF: "the left-center gap at 365 feet",
      CF:  "deepest center field in baseball - a monstrous 440 feet",
      RCF: "the right-center alley at 370 feet",
      RF:  "the right field overhang, jutting 10 feet over fair territory at 325",
    },
    specialRules: ["RF overhang: any ball hitting the underside is in play; landing in seats is a HR"],
  },

  "Memorial Stadium": {
    weatherCity: "Baltimore",
    dimensions: {
      LF:  { distance: 309, wallHeight: 14 },
      LCF: { distance: 378, wallHeight: 14 },
      CF:  { distance: 405, wallHeight: 14 },
      RCF: { distance: 378, wallHeight: 14 },
      RF:  { distance: 309, wallHeight: 14 },
    },
    quirks: ["turfWarningTrack"],
    hrFactors: { LH: 1.04, RH: 1.04 },
    avgDistance: 358,
    description: "Old-school symmetry with surprisingly tall 14-foot fences. Short down the lines (309') but the walls keep balls in the park.",
    wallDesc: {
      LF:  "the 14-foot left field fence just 309 feet away",
      LCF: "the left-center gap at 378 feet",
      CF:  "the center field wall at 405 feet",
      RCF: "the right-center alley at 378 feet",
      RF:  "the 14-foot right field fence just 309 feet away",
    },
    specialRules: [],
  },

  "Fenway Park": {
    weatherCity: "Boston",
    dimensions: {
      LF:  { distance: 315, wallHeight: 37 },
      LCF: { distance: 379, wallHeight: 37 },
      CF:  { distance: 390, wallHeight: 17 },
      RCF: { distance: 420, wallHeight: 5  },
      RF:  { distance: 302, wallHeight: 5  },
    },
    quirks: ["greenMonster", "peskyPole", "deepRCF", "triangle", "ladderOnMonster"],
    hrFactors: { LH: 0.82, RH: 1.18 },
    avgDistance: 362,
    description: "The Green Monster (37' left field wall, 315') suppresses LHH HRs but turns everything into doubles. Pesky's Pole at 302' right field is the shortest fair pole in baseball.",
    wallDesc: {
      LF:  "the Green Monster - 37 feet of green steel looming at 315 feet",
      LCF: "the Monster in left-center at 379 feet",
      CF:  "the center field wall, 390 feet out",
      RCF: "the deepest corner of Fenway at 420 feet - the bullpen triangle",
      RF:  "Pesky's Pole, just 302 feet - shortest foul pole in baseball",
    },
    specialRules: [
      "Green Monster: ladder attached - in-play if ball hits ladder (ground rule double if lodged)",
      "Pesky's Pole: ball that hits the pole is a HR regardless of where it lands",
      "The Triangle: deepest point in the park; balls in the triangle corner are in play",
    ],
  },

  "Yankee Stadium": {
    weatherCity: "New York",
    dimensions: {
      LF:  { distance: 312, wallHeight: 8  },
      LCF: { distance: 387, wallHeight: 8  },
      CF:  { distance: 417, wallHeight: 8  },
      RCF: { distance: 385, wallHeight: 8  },
      RF:  { distance: 310, wallHeight: 8  },
    },
    quirks: ["shortRF", "deepLCF", "monumentPark"],
    hrFactors: { LH: 1.30, RH: 0.90 },
    avgDistance: 362,
    description: "The short right-field porch (310') is a left-handed pull hitter's paradise. Death Valley in left-center (387') eats right-handed power. Monument Park sits in deep center.",
    wallDesc: {
      LF:  "the left field corner at 312 feet",
      LCF: "Death Valley - the deep left-center gap at 387 feet",
      CF:  "the center field wall beyond Monument Park at 417 feet",
      RCF: "the right-center alley at 385 feet",
      RF:  "the short right-field porch - a lefty's dream at just 310 feet",
    },
    specialRules: [
      "Monument Park: balls rolling under the fence or into monuments - ground rule double",
    ],
  },

  "Exhibition Stadium": {
    weatherCity: "Toronto",
    dimensions: {
      LF:  { distance: 330, wallHeight: 12 },
      LCF: { distance: 375, wallHeight: 12 },
      CF:  { distance: 400, wallHeight: 12 },
      RCF: { distance: 375, wallHeight: 12 },
      RF:  { distance: 330, wallHeight: 12 },
    },
    quirks: ["artificialTurf", "lakeWinds"],
    hrFactors: { LH: 0.95, RH: 0.95 },
    avgDistance: 362,
    description: "A converted football stadium on the Lake Ontario waterfront. Artificial turf and frigid spring winds off Lake Ontario make for miserable early-season conditions.",
    wallDesc: {
      LF:  "the left field fence at 330 feet",
      LCF: "the left-center gap at 375 feet",
      CF:  "the center field wall at 400 feet",
      RCF: "the right-center alley at 375 feet",
      RF:  "the right field fence at 330 feet",
    },
    specialRules: ["Artificial turf: ground balls shoot through the infield faster"],
  },

  "Cleveland Municipal Stadium": {
    weatherCity: "Cleveland",
    dimensions: {
      LF:  { distance: 320, wallHeight: 9 },
      LCF: { distance: 377, wallHeight: 9 },
      CF:  { distance: 404, wallHeight: 9 },
      RCF: { distance: 377, wallHeight: 9 },
      RF:  { distance: 320, wallHeight: 9 },
    },
    quirks: ["massiveStadium", "lakeWinds"],
    hrFactors: { LH: 0.96, RH: 0.96 },
    avgDistance: 360,
    description: "The cavernous Municipal Stadium seats 74,000 but usually draws 2,000 fans in 1984. Cold winds off Lake Erie are a constant factor - and the outfield is huge.",
    wallDesc: {
      LF:  "the left field fence at 320 feet",
      LCF: "the left-center gap at 377 feet",
      CF:  "the center field wall at 404 feet",
      RCF: "the right-center alley at 377 feet",
      RF:  "the right field fence at 320 feet",
    },
    specialRules: [],
  },

  "County Stadium": {
    weatherCity: "Milwaukee",
    dimensions: {
      LF:  { distance: 315, wallHeight: 10 },
      LCF: { distance: 362, wallHeight: 10 },
      CF:  { distance: 402, wallHeight: 10 },
      RCF: { distance: 362, wallHeight: 10 },
      RF:  { distance: 315, wallHeight: 10 },
    },
    quirks: [],
    hrFactors: { LH: 1.04, RH: 1.04 },
    avgDistance: 351,
    description: "Intimate AL park with short corners (315') and a cozy atmosphere. One of baseball's more homer-friendly environments in the early 1980s.",
    wallDesc: {
      LF:  "the left field fence at 315 feet",
      LCF: "the left-center gap at 362 feet",
      CF:  "the center field wall at 402 feet",
      RCF: "the right-center alley at 362 feet",
      RF:  "the right field fence at 315 feet",
    },
    specialRules: [],
  },

  // ── AL WEST ──

  "Royals Stadium": {
    weatherCity: "Kansas City",
    dimensions: {
      LF:  { distance: 330, wallHeight: 12 },
      LCF: { distance: 385, wallHeight: 12 },
      CF:  { distance: 410, wallHeight: 12 },
      RCF: { distance: 385, wallHeight: 12 },
      RF:  { distance: 330, wallHeight: 12 },
    },
    quirks: ["fountains", "hugeOutfield", "tripleAlley", "artificialTurf"],
    hrFactors: { LH: 0.93, RH: 0.93 },
    avgDistance: 368,
    description: "One of baseball's most beautiful parks. The water spectacular beyond the outfield, massive gaps (385' alleys), and artificial turf make this a triples-and-speed park.",
    wallDesc: {
      LF:  "the left field fence at 330 feet, fountains just beyond",
      LCF: "the cavernous left-center gap at 385 feet",
      CF:  "the center field wall at 410 feet, the water spectacular behind it",
      RCF: "the right-center alley at 385 feet",
      RF:  "the right field fence at 330 feet",
    },
    specialRules: ["Artificial turf: ground balls reach the outfield wall fast"],
  },

  "Oakland-Alameda County Coliseum": {
    weatherCity: "Oakland",
    dimensions: {
      LF:  { distance: 330, wallHeight: 10 },
      LCF: { distance: 378, wallHeight: 10 },
      CF:  { distance: 397, wallHeight: 10 },
      RCF: { distance: 378, wallHeight: 10 },
      RF:  { distance: 330, wallHeight: 10 },
    },
    quirks: ["coldBayFog", "massiveFoulTerritory"],
    hrFactors: { LH: 0.93, RH: 0.93 },
    avgDistance: 363,
    description: "Enormous foul territory turns would-be foul outs into extra outs for pitchers. Cold Bay Area fog can be a factor for night games. One of the more pitcher-friendly parks in the AL.",
    wallDesc: {
      LF:  "the left field fence at 330 feet",
      LCF: "the left-center gap at 378 feet",
      CF:  "the center field wall at 397 feet",
      RCF: "the right-center alley at 378 feet",
      RF:  "the right field fence at 330 feet",
    },
    specialRules: ["Massive foul territory: foul pop-ups converted to outs at higher rate"],
  },

  "Anaheim Stadium": {
    weatherCity: "Anaheim",
    dimensions: {
      LF:  { distance: 333, wallHeight: 8 },
      LCF: { distance: 386, wallHeight: 8 },
      CF:  { distance: 404, wallHeight: 8 },
      RCF: { distance: 386, wallHeight: 8 },
      RF:  { distance: 333, wallHeight: 8 },
    },
    quirks: ["bigA"],
    hrFactors: { LH: 0.96, RH: 0.96 },
    avgDistance: 368,
    description: "The Big A. Symmetrical and fair. Night games in warm Southern California air can get lively. The famous Big A scoreboard sits beyond the outfield.",
    wallDesc: {
      LF:  "the left field fence at 333 feet",
      LCF: "the left-center gap at 386 feet",
      CF:  "the center field wall at 404 feet",
      RCF: "the right-center alley at 386 feet",
      RF:  "the right field fence at 333 feet",
    },
    specialRules: [],
  },

  "Comiskey Park": {
    weatherCity: "Chicago",
    dimensions: {
      LF:  { distance: 347, wallHeight: 10 },
      LCF: { distance: 382, wallHeight: 10 },
      CF:  { distance: 401, wallHeight: 10 },
      RCF: { distance: 382, wallHeight: 10 },
      RF:  { distance: 347, wallHeight: 10 },
    },
    quirks: ["explodingScoreboard", "windyCity"],
    hrFactors: { LH: 0.97, RH: 0.97 },
    avgDistance: 372,
    description: "The original Comiskey Park. The famous exploding scoreboard in center is a Chicago landmark. South Side winds can really blow - in or out depending on the day.",
    wallDesc: {
      LF:  "the left field fence at 347 feet",
      LCF: "the left-center alley at 382 feet",
      CF:  "the center field fence at 401 feet, the exploding scoreboard beyond",
      RCF: "the right-center alley at 382 feet",
      RF:  "the right field fence at 347 feet",
    },
    specialRules: [],
  },

  "Kingdome": {
    weatherCity: "Seattle",
    dimensions: {
      LF:  { distance: 316, wallHeight: 11 },
      LCF: { distance: 357, wallHeight: 11 },
      CF:  { distance: 405, wallHeight: 11 },
      RCF: { distance: 357, wallHeight: 11 },
      RF:  { distance: 316, wallHeight: 11 },
    },
    quirks: ["domed", "artificialTurf", "lowCeiling"],
    hrFactors: { LH: 1.06, RH: 1.06 },
    avgDistance: 350,
    description: "The domed Kingdome - no weather factor, but the low ceiling and artificial turf create their own madness. Short corners (316') and a tight feel. Balls carry in the climate-controlled air.",
    wallDesc: {
      LF:  "the left field fence at 316 feet",
      LCF: "the left-center gap at 357 feet",
      CF:  "the center field wall at 405 feet, under the Kingdome roof",
      RCF: "the right-center alley at 357 feet",
      RF:  "the right field fence at 316 feet",
    },
    specialRules: [
      "Domed stadium: no weather effects - temperature always ~68°F, no wind",
      "Ball hitting roof speaker in fair territory: ground rule double",
      "Artificial turf: ground balls shoot fast",
    ],
  },

  "Arlington Stadium": {
    weatherCity: "Dallas",
    dimensions: {
      LF:  { distance: 330, wallHeight: 10 },
      LCF: { distance: 380, wallHeight: 10 },
      CF:  { distance: 400, wallHeight: 10 },
      RCF: { distance: 380, wallHeight: 10 },
      RF:  { distance: 330, wallHeight: 10 },
    },
    quirks: ["texasHeat"],
    hrFactors: { LH: 1.02, RH: 1.02 },
    avgDistance: 364,
    description: "Texas summer heat drains pitcher stamina fast. This converted minor-league park in Arlington bakes in 100°F heat. Balls carry well on hot summer afternoons.",
    wallDesc: {
      LF:  "the left field fence at 330 feet",
      LCF: "the left-center gap at 380 feet",
      CF:  "the center field wall at 400 feet",
      RCF: "the right-center alley at 380 feet",
      RF:  "the right field fence at 330 feet",
    },
    specialRules: [],
  },

  "Hubert H. Humphrey Metrodome": {
    weatherCity: "Minneapolis",
    dimensions: {
      LF:  { distance: 343, wallHeight: 7  },
      LCF: { distance: 385, wallHeight: 7  },
      CF:  { distance: 408, wallHeight: 7  },
      RCF: { distance: 367, wallHeight: 23 },
      RF:  { distance: 327, wallHeight: 23 },
    },
    quirks: ["domed", "artificialTurf", "baggyRFWall", "loudCrowd"],
    hrFactors: { LH: 1.08, RH: 0.92 },
    avgDistance: 366,
    description: "The Hubert H. Humphrey Metrodome opened in 1982. The 23-foot padded right field 'Baggie' is unique - balls hit it and drop straight down, creating ground-rule confusion. Incredibly loud indoors.",
    wallDesc: {
      LF:  "the left field fence at 343 feet",
      LCF: "the left-center gap at 385 feet",
      CF:  "the center field wall at 408 feet, under the dome",
      RCF: "the right-center area in front of the 23-foot Baggie",
      RF:  "the padded Baggie - 23 feet of billowing fabric at 327 feet",
    },
    specialRules: [
      "Domed stadium: no weather effects",
      "Baggie (RF wall): ball hitting the Baggie is a double if it drops in play; HR if it goes over",
      "Artificial turf: ground balls shoot fast and true",
    ],
  },

  // ── NL EAST ──

  "Wrigley Field": {
    weatherCity: "Chicago",
    dimensions: {
      LF:  { distance: 355, wallHeight: 12 },
      LCF: { distance: 368, wallHeight: 12 },
      CF:  { distance: 400, wallHeight: 12 },
      RCF: { distance: 368, wallHeight: 10 },
      RF:  { distance: 353, wallHeight: 10 },
    },
    quirks: ["ivy", "basket", "windTunnel", "noLights"],
    hrFactors: { LH: 1.00, RH: 1.00 },
    avgDistance: 369,
    description: "Ivy-covered brick walls and the famous home run basket. No lights - all day games in 1984. Wind is everything: blowing out it's a launching pad, blowing in it's a pitcher's heaven.",
    wallDesc: {
      LF:  "the ivy-covered brick wall at 355 feet in left",
      LCF: "the ivy in left-center at 368 feet",
      CF:  "the ivy-covered center field wall at 400 feet",
      RCF: "the ivy in right-center at 368 feet",
      RF:  "the basket hanging over the right field wall at 353 feet",
    },
    specialRules: [
      "Ivy: ball lost in ivy → ground rule double (umpire must signal)",
      "Basket: ball landing in basket without clearing wall → home run",
      "No lights: all games are day games in 1984",
    ],
  },

  "Shea Stadium": {
    weatherCity: "New York",
    dimensions: {
      LF:  { distance: 338, wallHeight: 8 },
      LCF: { distance: 371, wallHeight: 8 },
      CF:  { distance: 410, wallHeight: 8 },
      RCF: { distance: 371, wallHeight: 8 },
      RF:  { distance: 338, wallHeight: 8 },
    },
    quirks: ["windyFlushing", "jets"],
    hrFactors: { LH: 0.97, RH: 0.97 },
    avgDistance: 366,
    description: "The open bowl of Shea creates vicious wind swirls from Flushing Bay. LaGuardia Airport jets constantly thunder overhead. The 410-foot center field gap is a real dead zone.",
    wallDesc: {
      LF:  "the left field fence at 338 feet",
      LCF: "the left-center gap at 371 feet",
      CF:  "the center field wall, a distant 410 feet from home plate",
      RCF: "the right-center alley at 371 feet",
      RF:  "the right field fence at 338 feet",
    },
    specialRules: [],
  },

  "Veterans Stadium": {
    weatherCity: "Philadelphia",
    dimensions: {
      LF:  { distance: 330, wallHeight: 12 },
      LCF: { distance: 371, wallHeight: 12 },
      CF:  { distance: 408, wallHeight: 12 },
      RCF: { distance: 371, wallHeight: 12 },
      RF:  { distance: 330, wallHeight: 12 },
    },
    quirks: ["artificialTurf", "bouncyTurf"],
    hrFactors: { LH: 1.01, RH: 1.01 },
    avgDistance: 362,
    description: "Philadelphia's cookie-cutter stadium with notoriously unpredictable artificial turf. Bad bounces are a Philadelphia tradition. The Philly faithful are among the most passionate - and ruthless - in baseball.",
    wallDesc: {
      LF:  "the left field fence at 330 feet",
      LCF: "the left-center gap at 371 feet",
      CF:  "the center field wall at 408 feet",
      RCF: "the right-center alley at 371 feet",
      RF:  "the right field fence at 330 feet",
    },
    specialRules: ["Artificial turf: ground balls shoot fast; bad bounces increase error rate"],
  },

  "Olympic Stadium": {
    weatherCity: "Montreal",
    dimensions: {
      LF:  { distance: 325, wallHeight: 12 },
      LCF: { distance: 375, wallHeight: 12 },
      CF:  { distance: 404, wallHeight: 12 },
      RCF: { distance: 375, wallHeight: 12 },
      RF:  { distance: 325, wallHeight: 12 },
    },
    quirks: ["artificialTurf", "retractableRoof", "coldSpring"],
    hrFactors: { LH: 1.00, RH: 1.00 },
    avgDistance: 363,
    description: "The Big Owe. The retractable roof (when it works) keeps out Montreal's frigid spring weather. Artificial turf on a symmetrical field. The tower looms over left field.",
    wallDesc: {
      LF:  "the left field wall at 325 feet under the tower",
      LCF: "the left-center gap at 375 feet",
      CF:  "the center field wall at 404 feet",
      RCF: "the right-center alley at 375 feet",
      RF:  "the right field wall at 325 feet",
    },
    specialRules: ["Artificial turf: ground balls shoot fast"],
  },

  "Busch Stadium": {
    weatherCity: "St. Louis",
    dimensions: {
      LF:  { distance: 330, wallHeight: 10 },
      LCF: { distance: 383, wallHeight: 10 },
      CF:  { distance: 414, wallHeight: 10 },
      RCF: { distance: 383, wallHeight: 10 },
      RF:  { distance: 330, wallHeight: 10 },
    },
    quirks: ["artificialTurf", "stLouisHeat", "deepCF"],
    hrFactors: { LH: 0.96, RH: 0.96 },
    avgDistance: 368,
    description: "Busch Stadium II - a symmetrical cookie-cutter with deep alleys (383') and a 414-foot center field. Artificial turf and brutal St. Louis summer heat drain pitchers fast.",
    wallDesc: {
      LF:  "the left field line at 330 feet",
      LCF: "the deep left-center gap at 383 feet",
      CF:  "the massive center field wall at 414 feet",
      RCF: "the right-center alley at 383 feet",
      RF:  "the right field line at 330 feet",
    },
    specialRules: ["Artificial turf: ground balls shoot through fast"],
  },

  "Three Rivers Stadium": {
    weatherCity: "Pittsburgh",
    dimensions: {
      LF:  { distance: 335, wallHeight: 10 },
      LCF: { distance: 375, wallHeight: 10 },
      CF:  { distance: 400, wallHeight: 10 },
      RCF: { distance: 375, wallHeight: 10 },
      RF:  { distance: 335, wallHeight: 10 },
    },
    quirks: ["artificialTurf", "riverHumidity"],
    hrFactors: { LH: 1.00, RH: 1.00 },
    avgDistance: 364,
    description: "Nestled at the confluence of the Allegheny, Monongahela, and Ohio rivers. The river humidity can be oppressive in summer. Artificial turf on a perfectly symmetrical field.",
    wallDesc: {
      LF:  "the left field fence at 335 feet",
      LCF: "the left-center gap at 375 feet",
      CF:  "the center field fence at 400 feet",
      RCF: "the right-center alley at 375 feet",
      RF:  "the right field fence at 335 feet",
    },
    specialRules: ["Artificial turf: ground balls carry quickly to the outfield"],
  },

  // ── NL WEST ──

  "Dodger Stadium": {
    weatherCity: "Los Angeles",
    dimensions: {
      LF:  { distance: 330, wallHeight: 8 },
      LCF: { distance: 385, wallHeight: 8 },
      CF:  { distance: 395, wallHeight: 8 },
      RCF: { distance: 385, wallHeight: 8 },
      RF:  { distance: 330, wallHeight: 8 },
    },
    quirks: ["marineLay", "pitchersFriend"],
    hrFactors: { LH: 0.93, RH: 0.93 },
    avgDistance: 365,
    description: "Pitcher-friendly with symmetrical deep alleys (385'). The marine layer at night drops balls out of the air. One of the most beautiful parks in the game - and one of the toughest on hitters.",
    wallDesc: {
      LF:  "the left field pavilion at 330 feet",
      LCF: "the deep left-center gap at 385 feet",
      CF:  "the center field wall at 395 feet",
      RCF: "the right-center alley at 385 feet",
      RF:  "the right field pavilion at 330 feet",
    },
    specialRules: [],
  },

  "Jack Murphy Stadium": {
    weatherCity: "San Diego",
    dimensions: {
      LF:  { distance: 327, wallHeight: 8 },
      LCF: { distance: 370, wallHeight: 8 },
      CF:  { distance: 405, wallHeight: 8 },
      RCF: { distance: 370, wallHeight: 8 },
      RF:  { distance: 327, wallHeight: 8 },
    },
    quirks: ["marineLay"],
    hrFactors: { LH: 0.97, RH: 0.97 },
    avgDistance: 360,
    description: "Symmetrical and fair. The ocean marine layer rolls in late - evening games can turn into fly-ball cemeteries. One of the more neutral parks in the NL.",
    wallDesc: {
      LF:  "the left field fence at 327 feet",
      LCF: "the left-center gap at 370 feet",
      CF:  "the center field wall at 405 feet",
      RCF: "the right-center alley at 370 feet",
      RF:  "the right field fence at 327 feet",
    },
    specialRules: [],
  },

  "Riverfront Stadium": {
    weatherCity: "Cincinnati",
    dimensions: {
      LF:  { distance: 330, wallHeight: 12 },
      LCF: { distance: 375, wallHeight: 12 },
      CF:  { distance: 404, wallHeight: 12 },
      RCF: { distance: 375, wallHeight: 12 },
      RF:  { distance: 330, wallHeight: 12 },
    },
    quirks: ["artificialTurf", "riverHumidity"],
    hrFactors: { LH: 1.02, RH: 1.02 },
    avgDistance: 363,
    description: "Cookie-cutter on the banks of the Ohio. Artificial turf makes grounders shoot and speeds up the game. Ohio River humidity can be oppressive in July and August.",
    wallDesc: {
      LF:  "the left field fence at 330 feet",
      LCF: "the left-center alley at 375 feet",
      CF:  "the center field wall at 404 feet",
      RCF: "the right-center gap at 375 feet",
      RF:  "the right field line at 330 feet",
    },
    specialRules: ["Artificial turf: ground balls shoot through the infield"],
  },

  "Atlanta-Fulton County Stadium": {
    weatherCity: "Atlanta",
    dimensions: {
      LF:  { distance: 330, wallHeight: 10 },
      LCF: { distance: 385, wallHeight: 10 },
      CF:  { distance: 402, wallHeight: 10 },
      RCF: { distance: 385, wallHeight: 10 },
      RF:  { distance: 330, wallHeight: 10 },
    },
    quirks: ["altitude", "atlantaHeat"],
    hrFactors: { LH: 1.08, RH: 1.08 },
    avgDistance: 366,
    description: "The launching pad. At 1,050 feet above sea level, Atlanta's thin air carries fly balls further than anywhere in the NL. A hitter's paradise - especially in summer heat.",
    wallDesc: {
      LF:  "the left field fence at 330 feet, the thin Atlanta air beyond",
      LCF: "the left-center gap at 385 feet",
      CF:  "the center field wall at 402 feet",
      RCF: "the right-center alley at 385 feet",
      RF:  "the right field fence at 330 feet, balls carry here",
    },
    specialRules: ["Altitude boost: HR probability increased due to elevated location"],
  },

  "Astrodome": {
    weatherCity: "Houston",
    dimensions: {
      LF:  { distance: 340, wallHeight: 10 },
      LCF: { distance: 375, wallHeight: 10 },
      CF:  { distance: 400, wallHeight: 10 },
      RCF: { distance: 375, wallHeight: 10 },
      RF:  { distance: 340, wallHeight: 10 },
    },
    quirks: ["domed", "artificialTurf", "astroturf"],
    hrFactors: { LH: 0.93, RH: 0.93 },
    avgDistance: 368,
    description: "The Eighth Wonder of the World - the world's first domed stadium. The dead air inside kills fly balls. Astroturf (the original) makes ground balls lightning fast. Comfortable 72°F no matter what.",
    wallDesc: {
      LF:  "the left field fence at 340 feet, inside the Astrodome",
      LCF: "the left-center gap at 375 feet",
      CF:  "the center field wall at 400 feet under the dome",
      RCF: "the right-center alley at 375 feet",
      RF:  "the right field fence at 340 feet",
    },
    specialRules: [
      "Domed stadium: no weather effects - always 72°F with no wind",
      "Artificial turf: ground balls shoot extremely fast",
      "Dead air: HR probability reduced - fly balls die at the warning track",
    ],
  },

  "Candlestick Park": {
    weatherCity: "San Francisco",
    dimensions: {
      LF:  { distance: 335, wallHeight: 10 },
      LCF: { distance: 365, wallHeight: 10 },
      CF:  { distance: 400, wallHeight: 10 },
      RCF: { distance: 365, wallHeight: 10 },
      RF:  { distance: 335, wallHeight: 10 },
    },
    quirks: ["candlestickWind", "coldFog"],
    hrFactors: { LH: 0.88, RH: 0.88 },
    avgDistance: 360,
    description: "The most wind-affected park in baseball. Afternoon winds swirl off San Francisco Bay - balls change direction mid-flight. Bring a jacket. Even in July, night games are brutal.",
    wallDesc: {
      LF:  "the left field fence at 335 feet - wind permitting",
      LCF: "the left-center gap at 365 feet",
      CF:  "the center field wall at 400 feet",
      RCF: "the right-center alley at 365 feet",
      RF:  "the right field fence at 335 feet - the wind owns this ballpark",
    },
    specialRules: [
      "Candlestick wind: swirling conditions increase HR suppression and error rates",
      "Cold fog: night games in August can feel like October",
    ],
  },
};

// Weather city fallback map for cities not in CLIMATE (weather.js will use fallback)
export const STADIUM_WEATHER_CITIES = {
  "Tiger Stadium": "Detroit",
  "Memorial Stadium": "Baltimore",
  "Fenway Park": "Boston",
  "Yankee Stadium": "New York",
  "Exhibition Stadium": "Toronto",
  "Cleveland Municipal Stadium": "Cleveland",
  "County Stadium": "Milwaukee",
  "Royals Stadium": "Kansas City",
  "Oakland-Alameda County Coliseum": "Oakland",
  "Anaheim Stadium": "Anaheim",
  "Comiskey Park": "Chicago",
  "Kingdome": "Seattle",
  "Arlington Stadium": "Dallas",
  "Hubert H. Humphrey Metrodome": "Minneapolis",
  "Wrigley Field": "Chicago",
  "Shea Stadium": "New York",
  "Veterans Stadium": "Philadelphia",
  "Olympic Stadium": "Montreal",
  "Busch Stadium": "St. Louis",
  "Three Rivers Stadium": "Pittsburgh",
  "Dodger Stadium": "Los Angeles",
  "Jack Murphy Stadium": "San Diego",
  "Riverfront Stadium": "Cincinnati",
  "Atlanta-Fulton County Stadium": "Atlanta",
  "Astrodome": "Houston",
  "Candlestick Park": "San Francisco",
};

// Domed stadiums never use weather
export const DOMED_STADIUMS = new Set([
  "Kingdome",
  "Hubert H. Humphrey Metrodome",
  "Astrodome",
]);

// Map field direction based on batter handedness and random pull tendency
// LHH: pulls to RF (60%), goes to CF (25%), opposite to LF (15%)
// RHH: pulls to LF (60%), goes to CF (25%), opposite to RF (15%)
export function getHitDirection(batterBats) {
  const roll = Math.random();
  if (batterBats === 'L') {
    if (roll < 0.60) return 'RF';
    if (roll < 0.85) return 'RCF';
    if (roll < 0.92) return 'CF';
    if (roll < 0.96) return 'LCF';
    return 'LF';
  } else if (batterBats === 'R') {
    if (roll < 0.60) return 'LF';
    if (roll < 0.85) return 'LCF';
    if (roll < 0.92) return 'CF';
    if (roll < 0.96) return 'RCF';
    return 'RF';
  } else {
    // Switch hitter - more balanced
    if (roll < 0.50) return Math.random() < 0.5 ? 'LF' : 'RF';
    if (roll < 0.80) return Math.random() < 0.5 ? 'LCF' : 'RCF';
    return 'CF';
  }
}

// Get the distance to a specific field section
export function getFieldDistance(ballpark, field) {
  return ballpark.dimensions[field]?.distance || 400;
}

// Get wall height for a field section
export function getWallHeight(ballpark, field) {
  return ballpark.dimensions[field]?.wallHeight || 10;
}

// Compute combined ballpark + weather HR multiplier for this at-bat
// Returns { hrMod, quirkOutcomes: [] }
export function getBallparkEffect(stadiumName, batterBats, weather) {
  const ballpark = BALLPARKS[stadiumName];
  if (!ballpark) return { hrMod: 1.0, quirkOutcomes: [] };

  const baseHR = ballpark.hrFactors[batterBats] || ballpark.hrFactors['LH'] || 1.0;

  // Domed stadiums: no wind effect
  const isDomed = DOMED_STADIUMS.has(stadiumName);

  let windMod = 1.0;
  const quirks = [];

  if (!isDomed && weather && weather.windDirection && weather.windSpeed !== 'calm') {
    const windStrength = weather.windSpeed === 'strong' ? 1.0 : weather.windSpeed === 'moderate' ? 0.55 : 0.25;
    const windDir = weather.windDirection;

    if (windDir === 'out') {
      windMod += windStrength * 0.40;
      if (ballpark.quirks.includes('windTunnel')) windMod += windStrength * 0.15;
      if (batterBats === 'L' && ballpark.quirks.includes('shortRF') && windStrength > 0.5) {
        quirks.push('Wind blowing out toward the short porch - lefties are licking their chops');
      }
      if (ballpark.quirks.includes('candlestickWind')) {
        quirks.push('Candlestick wind blowing out - but could swirl at any time');
      }
    } else if (windDir === 'in') {
      windMod -= windStrength * 0.35;
      if (ballpark.quirks.includes('windTunnel')) windMod -= windStrength * 0.10;
      if (ballpark.quirks.includes('greenMonster')) {
        quirks.push('Wind blowing in, driving balls down off the Monster');
      }
      if (ballpark.quirks.includes('candlestickWind')) {
        windMod -= windStrength * 0.15;
        quirks.push('Bay wind howling in off the water - nothing is leaving the yard tonight');
      }
    } else if (windDir === 'left') {
      if (batterBats === 'R' && windStrength > 0.5 && ballpark.quirks.includes('peskyPole')) {
        quirks.push("Cross-wind pushing toward Pesky's Pole - could help a right-handed pull");
      }
      if (batterBats === 'L' && windStrength > 0.5 && ballpark.quirks.includes('shortRF')) {
        quirks.push('Cross-wind drifting toward the short porch');
      }
    } else if (windDir === 'right') {
      if (batterBats === 'R' && windStrength > 0.5 && ballpark.quirks.includes('shortRF')) {
        windMod += windStrength * 0.10;
      }
    } else if (windDir === 'swirling') {
      windMod += (Math.random() - 0.5) * windStrength * 0.30;
      if (ballpark.quirks.includes('candlestickWind')) {
        windMod += (Math.random() - 0.5) * 0.20;
        quirks.push('Candlestick swirling wind - even the outfielders have no idea where it\'s going');
      }
    }
  }

  // Altitude bonus for Atlanta
  if (ballpark.quirks.includes('altitude')) {
    windMod *= 1.05;
  }

  // Dead air penalty for Astrodome
  if (ballpark.quirks.includes('astroturf') && ballpark.quirks.includes('domed')) {
    windMod *= 0.90;
  }

  const hrMod = Math.max(0.3, Math.min(2.0, baseHR * windMod));
  return { hrMod, quirkOutcomes: quirks, ballpark };
}

// Check for ballpark quirk outcomes on deep fly balls
// Returns { type, text, bases } or null
export function checkBallparkQuirk(ballparkName, batterBats, hitDirection, weather, batterName) {
  const ballpark = BALLPARKS[ballparkName];
  if (!ballpark) return null;
  const bn = batterName || (() => { console.error('[checkBallparkQuirk] batterName missing - rendering nameless HR call'); return 'The batter'; })();

  const quirks = ballpark.quirks;
  const roll = Math.random();

  // ── Green Monster (Fenway) ──
  if (quirks.includes('greenMonster') && (hitDirection === 'LF' || hitDirection === 'LCF')) {
    if (roll < 0.25) {
      const isDouble = roll < 0.10;
      return {
        type: 'offMonster',
        text: isDouble
          ? `Smashed high off the Green Monster! The ball caroms back into the field - the runner's in with a double!`
          : `Lined off the Green Monster! The carom comes right back to the left fielder - hold at first!`,
        bases: isDouble ? 2 : 1,
        isHit: true,
      };
    }
  }

  // ── Pesky's Pole (Fenway) ──
  if (quirks.includes('peskyPole') && hitDirection === 'RF') {
    if (roll < 0.07) {
      return {
        type: 'peskyPole',
        text: `Hooked around Pesky's Pole! ${bn} wraps it around the right field foul pole at 302 feet - that's a Fenway home run!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // ── Fenway Triangle (deep RCF) ──
  if (quirks.includes('triangle') && hitDirection === 'RCF') {
    if (roll < 0.28) {
      return {
        type: 'deepRCF',
        text: `Crushed to right-center - but this is the Triangle, deepest corner of Fenway at 420 feet! The outfielder tracks it down on the warning track!`,
        bases: 0,
        isHit: false,
      };
    }
  }

  // ── Fenway CF/LCF deep ──
  if (quirks.includes('triangle') && hitDirection === 'CF') {
    if (roll < 0.12) {
      const isTriple = roll < 0.04;
      return {
        type: 'triangle',
        text: isTriple
          ? `Into the Triangle corner! The ball caroms off the angled wall - the batter races for THIRD!`
          : `Into the Triangle! Weird angles send the ball sideways - the batter pulls into second.`,
        bases: isTriple ? 3 : 2,
        isHit: true,
      };
    }
  }

  // ── Wrigley ivy ──
  if (quirks.includes('ivy') && (hitDirection === 'LF' || hitDirection === 'LCF' || hitDirection === 'CF' || hitDirection === 'RCF')) {
    if (roll < 0.06) {
      return {
        type: 'ivyStuck',
        text: `Into the ivy at Wrigley! The outfielder throws his hands up - the ball vanished into the ivy! Ground rule double!`,
        bases: 2,
        isHit: true,
      };
    }
  }

  // ── Wrigley basket (RF) ──
  if (quirks.includes('basket') && (hitDirection === 'RF' || hitDirection === 'RCF')) {
    if (roll < 0.04) {
      return {
        type: 'basketHR',
        text: `Into the basket! ${bn} drops one into the Wrigley Field home run basket hanging over the wall - that counts!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // ── Yankee Stadium short porch (RF) ──
  if (quirks.includes('shortRF') && hitDirection === 'RF') {
    const windOut = weather?.windDirection === 'out';
    const porchChance = windOut ? 0.12 : 0.05;
    if (roll < porchChance) {
      return {
        type: 'shortPorch',
        text: `${bn} down the right field line - gone into the short porch! ${batterBats === 'L' ? 'Classic lefty pull' : 'Opposite field shot'} - Yankee Stadium gives again!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // ── Yankee Stadium Death Valley (LCF) ──
  if (quirks.includes('deepLCF') && (hitDirection === 'CF' || hitDirection === 'LCF')) {
    if (roll < 0.18) {
      return {
        type: 'deathValley',
        text: `Crushed to deep left-center - Death Valley! Four hundred and seventeen feet to the wall. The outfielder runs it down at the warning track.`,
        bases: 0,
        isHit: false,
      };
    }
  }

  // ── Royals Stadium triple alley ──
  if (quirks.includes('hugeOutfield') && (hitDirection === 'LCF' || hitDirection === 'RCF')) {
    if (roll < 0.10) {
      return {
        type: 'royalsTriple',
        text: `Into the gap at Royals Stadium! The huge outfield gives him time - he's streaking for THIRD! The throw won't get there!`,
        bases: 3,
        isHit: true,
      };
    }
  }

  // ── Metrodome Baggie (RF) ──
  if (quirks.includes('baggyRFWall') && (hitDirection === 'RF' || hitDirection === 'RCF')) {
    if (roll < 0.08) {
      return {
        type: 'baggie',
        text: `Off the Baggie in right! The ball hits the padded fabric wall and drops straight down - the right fielder has to play it on the short hop! That's a double!`,
        bases: 2,
        isHit: true,
      };
    }
  }

  // ── Tiger Stadium RF overhang ──
  if (quirks.includes('overhangRF') && hitDirection === 'RF') {
    if (roll < 0.06) {
      return {
        type: 'overhang',
        text: `${bn} caught the overhang in right field at Tiger Stadium! The second deck juts out over fair territory - that ball never had a chance to be caught!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  // ── Candlestick wind swirl ──
  if (quirks.includes('candlestickWind') && weather?.windDirection === 'swirling') {
    if (roll < 0.12) {
      return {
        type: 'candlestickSwirl',
        text: `The Candlestick wind gets it! The outfielder had it, then he didn't - the swirling wind off the Bay takes the ball right out of his path! Error!`,
        bases: 1,
        isHit: false,
        isError: true,
      };
    }
  }

  // ── Astrodome dead air ──
  if (quirks.includes('astroturf') && (hitDirection === 'CF' || hitDirection === 'LCF' || hitDirection === 'RCF')) {
    if (roll < 0.10) {
      return {
        type: 'domeDeadAir',
        text: `Crushed deep but the Astrodome's dead air kills it at the warning track! The outfielder barely has to move - that dome eats home runs.`,
        bases: 0,
        isHit: false,
      };
    }
  }

  // ── Atlanta altitude carry ──
  if (quirks.includes('altitude') && (hitDirection === 'CF' || hitDirection === 'LCF' || hitDirection === 'RCF')) {
    if (roll < 0.07) {
      return {
        type: 'altitudeCarry',
        text: `${bn} drives one to deep center - the thin Atlanta air carries it! It looked like a routine fly, but it just kept going - off the warning track and over the wall! The altitude giveth!`,
        bases: 4,
        isHit: true,
        isHR: true,
      };
    }
  }

  return null;
}