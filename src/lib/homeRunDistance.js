// Home run distance calculation: wall distance in ball's direction + carry margin
import { BALLPARKS } from './ballparks';
import { applyWeatherEffects } from './weather';
import { TEAMS } from './gameData';

export function calculateHomeRunDistance(batter, pitcher, state, hitDirection, isPowerSwing = false, isGrandSlam = false) {
  const stadiumName = TEAMS[state.homeTeam]?.stadium;
  const ballpark = BALLPARKS[stadiumName];

  // Wall distance in the ball's direction (minimum distance for a HR)
  const wallDistance = ballpark?.dimensions?.[hitDirection]?.distance || 400;

  // ── Carry margin: how far the ball carries PAST the wall ──
  // Driven by: hitter Power rating, swing type, randomness
  // Envelope: +5 to +120 ft; wall-scrapers common, 450+ ft rare and PWR-9/10 territory
  const power = batter.power || 5; // 1-10 scale

  let powerCarry;
  if (power <= 3) {
    powerCarry = 5 + Math.random() * 12;    // 5-17 ft - wall-scrapers
  } else if (power <= 6) {
    powerCarry = 8 + Math.random() * 22;   // 8-30 ft - clears the wall
  } else if (power <= 8) {
    powerCarry = 12 + Math.random() * 38;  // 12-50 ft - into the seats
  } else {
    powerCarry = 18 + Math.random() * 65;  // 18-83 ft - tape-measure territory (PWR 9-10)
  }

  // Power swing adds carry (hitter selling out for distance)
  if (isPowerSwing) {
    powerCarry += 5 + Math.random() * 18;  // +5-23 ft
  }

  // Weather effects on carry (partial - weather mainly affects HR probability)
  const wx = applyWeatherEffects(state.weather, {});
  const wxMod = (wx.hrMod || 1) - 1;
  powerCarry *= (1 + wxMod * 0.4);

  // Pitcher fatigue (tired pitchers give up longer HRs)
  const pitcherStats = pitcher.gameStats || {};
  const ip = pitcherStats.ip || 0;
  const stamina = pitcher.stamina || 5;
  if (ip >= stamina * 0.7) {
    powerCarry += 3 + Math.random() * 7;  // +3-10 ft
  }

  // Small random variance
  powerCarry += (Math.random() - 0.5) * 8;  // ±4 ft

  // Ensure minimum carry (ball must clear the wall)
  powerCarry = Math.max(5, powerCarry);

  // Total distance = wall distance + carry
  let distance = wallDistance + powerCarry;

  // Grand slam: slight bump (leverage adrenaline)
  if (isGrandSlam) distance += 2;

  // Cap at 500 ft
  distance = Math.min(500, distance);

  // Round to integer
  distance = Math.round(distance);
  // Avoid round numbers - add 1-3 feet if it ends in 0 or 5
  if (distance % 10 === 0 || distance % 10 === 5) {
    distance += Math.floor(Math.random() * 3) + 1;
  }

  return distance;
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