// Home run distance calculation based on realistic factors
import { BALLPARKS } from './ballparks';
import { applyWeatherEffects } from './weather';
import { TEAMS } from './gameData';

export function calculateHomeRunDistance(batter, pitcher, state, isGrandSlam = false) {
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const baseDistance = getBaseDistance(stadiumName, isGrandSlam);
  
  // Batter power is the primary driver (1-10 scale)
  const powerMod = (batter.power / 10) * 0.40; // power accounts for ~40% of variance
  
  // Weather effects on distance
  const wx = applyWeatherEffects(state.weather, {});
  const wxMod = (wx.hrMod || 1) - 1; // convert multiplier to modifier
  
  // Pitcher fatigue (tired pitchers give up longer HRs)
  const pitcher_stats = pitcher.gameStats || {};
  const ip = pitcher_stats.ip || 0;
  const stamina = pitcher.stamina || 5;
  const fatigueModifier = ip >= stamina * 0.7 ? 0.06 : 0;
  
  // Pitcher control (poor control → balls more hittable, slight distance bonus)
  const controlMod = (pitcher.control < 5) ? 0.03 : 0;
  
  // Base distance with multiplicative modifiers
  let distance = baseDistance * (1 + powerMod + wxMod + fatigueModifier + controlMod);
  
  // Add randomness (±15 feet)
  const randomFactor = (Math.random() - 0.5) * 30;
  distance += randomFactor;
  
  // Clamp to realistic range
  distance = Math.max(320, Math.min(505, distance));
  
  // Round to realistic number (avoid .0, .5 endings)
  distance = Math.round(distance);
  // Avoid round numbers-add 1-3 feet randomly if it ends in 0 or 5
  if (distance % 10 === 0 || distance % 10 === 5) {
    distance += Math.floor(Math.random() * 3) + 1;
  }
  
  return distance;
}

function getBaseDistance(stadiumName, isGrandSlam = false) {
  // Stadium base distances (average HR distance for that park)
  // These are researched 1984 ballpark characteristics
  const stadiumDistances = {
    'Yankee Stadium': 408,
    'Fenway Park': 395,
    'Tiger Stadium': 400,
    'Memorial Stadium': 398,
    'Comiskey Park': 402,
    'Municipal Stadium': 404,
    'Exhibition Stadium': 406,
    'Milwaukee County Stadium': 403,
    'Metropolitan Stadium': 405,
    'Royals Stadium': 408,
    'Oakland Coliseum': 399,
    'Angels Stadium': 394,
    'Kingdome': 410,
    'Tropicana Field': 408, // placeholder for 1984 era (similar ballpark)
    'Candlestick Park': 396,
    'Dodger Stadium': 391,
    'Jack Murphy Stadium': 392,
    'Shea Stadium': 397,
    'Veterans Stadium': 400,
    'Three Rivers Stadium': 402,
    'Riverfront Stadium': 398,
    'Wrigley Field': 394,
    'County Stadium': 403,
  };
  
  let base = stadiumDistances[stadiumName] || 399; // default 399 ft
  
  // Grand slams are often hit with more leverage, slight bump
  if (isGrandSlam) base += 2;
  
  return base;
}

// Achievement tier detection
export function getHomeRunAchievement(distance) {
  if (distance >= 475) return { tier: '475+', label: '475+ Foot Blast', icon: '🚀' };
  if (distance >= 450) return { tier: '450+', label: '450+ Foot Bomb', icon: '💣' };
  if (distance >= 425) return { tier: '425+', label: '425+ Foot Shot', icon: '⚡' };
  if (distance >= 400) return { tier: '400+', label: '400+ Foot Homer', icon: '🎯' };
  return null;
}

// Check if it's a new record in the game
export function isNewRecord(distance, previousRecord) {
  return distance > (previousRecord || 0);
}