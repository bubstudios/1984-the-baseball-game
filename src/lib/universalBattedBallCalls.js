// Universal batted-ball announcer calls — mixed by contact type and outcome

export const WEAK_CONTACT = [
  'A little dribbler toward third.',
  'A slow roller up the first-base line.',
  'A weak tapper in front of the plate.',
  'A little nubber toward the mound.',
  'A swinging bunt down the third-base side.',
  'A slow trickler toward shortstop.',
  'A soft roller to the right side.',
  'A little tap off the end of the bat.',
  'A weak ground ball toward second.',
  'A dribbler that may stay fair.',
  'A tiny roller near the line.',
  'A softly hit ball in front of home plate.',
  'A little squibber toward first.',
  'A weak tap back to the pitcher.',
  'A ball barely struck off the bat.',
];

export const GROUND_BALLS = [
  'A ground ball to shortstop.',
  'A routine roller to second base.',
  'A grounder toward third.',
  'A two-hopper to the first baseman.',
  'A ground ball right at the shortstop.',
  'A routine play on the left side.',
  'A grounder hit directly to second.',
  'A steady roller toward first.',
  'A ground ball near the bag.',
  'A routine chance for the third baseman.',
  'A ball hit on the ground toward short.',
  'A grounder that should be handled.',
  'A firm two-hopper to second.',
  'A routine roller across the infield.',
  'A ground ball directly at the pitcher.',
  'A ball hit right to the first baseman.',
  'A manageable grounder toward third.',
  'A routine ground ball up the middle.',
  'A slow two-hopper to shortstop.',
  'A ball hit sharply but directly at someone.',
];

export const HARD_GROUND_BALLS = [
  'A screaming ground ball toward third.',
  'A hard smash through the left side.',
  'A sharply hit grounder to short.',
  'A rocket along the ground toward first.',
  'A hard one-hopper to second.',
  'A sizzling ground ball up the middle.',
  'A bullet off the bat toward third base.',
  'A sharply hit ball toward the hole.',
  'A hard grounder that eats up the infielder.',
  'A shot past the pitcher.',
  'A hot smash down the line.',
  'A hard-hit ball toward the right side.',
  'A ground ball struck with authority.',
  'A rocket that stays on the ground.',
  'A sharply hit one-hopper near the bag.',
  'A hard shot that takes a wicked hop.',
  'A ground ball that gets on the infielder quickly.',
  'A scorching smash toward shortstop.',
  'A hot grounder through the middle.',
  'A hard-hit ball that may find the outfield.',
];

export const LINE_DRIVES = [
  'A scorching line drive toward shortstop.',
  'A low liner to second base.',
  'A hard line drive right at the third baseman.',
  'A bullet toward first.',
  'A sinking liner over the mound.',
  'A line shot toward the left side.',
  'A sharp liner headed for short.',
  'A low missile toward second.',
  'A frozen rope at the first baseman.',
  'A hard liner just above the infield.',
  'A screaming line drive through the box.',
  'A line shot near the third-base bag.',
  'A low liner that may carry through.',
  'A sharp drive toward the middle.',
  'A bullet off the bat toward the mound.',
  'A line drive that gets on the fielder quickly.',
  'A hard liner with almost no reaction time.',
  'A rope toward the shortstop.',
  'A vicious line drive toward third.',
  'A low shot at the second baseman.',
];

export const FLY_BALLS_SHALLOW = [
  'A short fly ball into center.',
  'A shallow fly toward left.',
  'A soft fly ball into right.',
  'A little fly ball behind second base.',
  'A fly ball dropping in front of the outfielder.',
  'A shallow drive toward left-center.',
  'A short fly that may fall safely.',
  'A ball lifted into shallow right.',
  'A fly ball caught between the infield and outfield.',
  'A short pop fly toward center.',
  'A shallow fly drifting toward the line.',
  'A little fly ball that forces the outfielder in.',
];

export const FLY_BALLS_ROUTINE = [
  'A fly ball to center field.',
  'A routine fly toward left.',
  'A medium fly ball into right.',
  'A fly ball hit directly at the center fielder.',
  'A routine chance in left field.',
  'A high fly toward straightaway right.',
  'A fly ball with ordinary depth.',
  'A routine outfield play.',
  'A ball lifted toward the warning track.',
  'A medium-depth fly to center.',
];

export const FLY_BALLS_DEEP = [
  'A deep fly ball toward left field.',
  'A towering drive to center.',
  'A high fly headed toward the warning track.',
  'A deep ball toward right-center.',
  'A fly ball carrying toward the wall.',
  'A high drive deep into left.',
  'A long fly ball toward straightaway center.',
  'A deep fly drifting toward the line.',
  'A towering ball headed for the track.',
  'A high fly with the outfielder going back.',
];

export const BLOOPERS_FLARES = [
  'A little blooper into shallow right.',
  'A soft fly ball toward left.',
  'A flare over the second baseman.',
  'A bloop single waiting to happen.',
  'A soft liner into shallow center.',
  'A little parachute behind shortstop.',
  'A dying quail toward right field.',
  'A flare into no-man\'s-land.',
  'A softly hit ball beyond the infield.',
  'A blooper that may fall between three fielders.',
];

export const POP_UPS = [
  'A towering pop-up over the infield.',
  'A light-pole-high pop-up near second.',
  'A high pop fly toward shortstop.',
  'A towering ball straight above home plate.',
  'A mile-high pop-up on the left side.',
  'A high pop that stays in the infield.',
  'A towering infield fly near first base.',
  'A straight-up pop behind the plate.',
  'A high fly ball near the pitcher\'s mound.',
  'A pop-up drifting toward third.',
];

export const GAP_SHOTS = [
  'A drive toward the left-center-field gap.',
  'A shot headed for right-center.',
  'A ball driven between the outfielders.',
  'A hard liner into the alley.',
  'A fly ball splitting the gap.',
  'A line drive headed for open grass.',
  'A drive toward the deepest part of the gap.',
  'A ball hit where neither outfielder may reach it.',
  'A sharp drive between left and center.',
  'A hard liner toward the right-center-field wall.',
];

export const DOWN_THE_LINE = [
  'A hard shot down the third-base line.',
  'A ground ball hugging the first-base line.',
  'A drive headed toward the left-field corner.',
  'A ball sliced down the right-field line.',
  'A sharp grounder inside the bag.',
  'A liner headed for the corner.',
  'A ball pulled hard toward the line.',
  'A drive that may stay fair.',
  'A shot just inside the chalk.',
  'A ground ball racing toward the corner.',
];

export const HOME_RUNS = [
  'Deep to left field!',
  'Sending a shot to right!',
  'That ball is CRUSHED!',
  'High fly into left-center...that\'s GONE!',
  'A rocket toward the wall...over it goes!',
  'Deep to right field...that\'s outta here!',
  'Long drive toward the left-field wall...HOME RUN!',
  'A towering shot to the deepest part of the park...it\'s gone!',
  'That ball is carrying toward the seats...and it\'s OUTTA HERE!',
  'Into the night sky...and GONE!',
];

export function getRandomCall(arr) {
  if (!arr || arr.length === 0) return 'A ball is put in play.';
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getBattedBallCallByType(resultType) {
  const type = resultType?.toLowerCase() || 'single';
  
  if (type === 'homerun') return HOME_RUNS;
  if (type === 'triple') return GAP_SHOTS;
  if (type === 'double') return GAP_SHOTS;
  if (type === 'single') return LINE_DRIVES;
  if (type === 'flyout' || type === 'lineout') return LINE_DRIVES;
  if (type === 'popout') return POP_UPS;
  if (type === 'groundout') return GROUND_BALLS;
  
  return GROUND_BALLS; // fallback
}