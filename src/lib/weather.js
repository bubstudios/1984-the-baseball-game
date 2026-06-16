// Weather generation for exhibition games — April 1 to October 1
// Based on 1984 city climates, month, and day/night

// Climate by city: month -> { avgHigh, avgLow, rainChance, snowChance, windChance }
const CLIMATE = {
  'Detroit': {
    4: { high: 58, low: 37, rain: 0.38, snow: 0.12, wind: 0.35 },
    5: { high: 70, low: 47, rain: 0.32, snow: 0.02, wind: 0.30 },
    6: { high: 80, low: 57, rain: 0.28, snow: 0,    wind: 0.25 },
    7: { high: 84, low: 62, rain: 0.26, snow: 0,    wind: 0.22 },
    8: { high: 82, low: 60, rain: 0.26, snow: 0,    wind: 0.22 },
    9: { high: 74, low: 52, rain: 0.30, snow: 0,    wind: 0.28 },
  },
  'Chicago': {
    4: { high: 58, low: 38, rain: 0.40, snow: 0.10, wind: 0.45 },
    5: { high: 70, low: 48, rain: 0.33, snow: 0.02, wind: 0.38 },
    6: { high: 80, low: 58, rain: 0.28, snow: 0,    wind: 0.30 },
    7: { high: 84, low: 63, rain: 0.26, snow: 0,    wind: 0.28 },
    8: { high: 82, low: 62, rain: 0.27, snow: 0,    wind: 0.28 },
    9: { high: 75, low: 53, rain: 0.30, snow: 0,    wind: 0.32 },
  },
  'New York': {
    4: { high: 61, low: 42, rain: 0.35, snow: 0.05, wind: 0.30 },
    5: { high: 71, low: 52, rain: 0.32, snow: 0,    wind: 0.25 },
    6: { high: 80, low: 62, rain: 0.28, snow: 0,    wind: 0.22 },
    7: { high: 85, low: 68, rain: 0.28, snow: 0,    wind: 0.20 },
    8: { high: 83, low: 66, rain: 0.27, snow: 0,    wind: 0.20 },
    9: { high: 76, low: 58, rain: 0.28, snow: 0,    wind: 0.24 },
  },
  'Boston': {
    4: { high: 56, low: 39, rain: 0.35, snow: 0.08, wind: 0.32 },
    5: { high: 67, low: 48, rain: 0.30, snow: 0,    wind: 0.28 },
    6: { high: 77, low: 58, rain: 0.28, snow: 0,    wind: 0.25 },
    7: { high: 83, low: 64, rain: 0.27, snow: 0,    wind: 0.22 },
    8: { high: 81, low: 63, rain: 0.28, snow: 0,    wind: 0.22 },
    9: { high: 73, low: 55, rain: 0.28, snow: 0,    wind: 0.25 },
  },
  'Baltimore': {
    4: { high: 64, low: 43, rain: 0.32, snow: 0.03, wind: 0.25 },
    5: { high: 74, low: 53, rain: 0.30, snow: 0,    wind: 0.22 },
    6: { high: 83, low: 63, rain: 0.28, snow: 0,    wind: 0.20 },
    7: { high: 87, low: 68, rain: 0.30, snow: 0,    wind: 0.18 },
    8: { high: 85, low: 66, rain: 0.30, snow: 0,    wind: 0.18 },
    9: { high: 78, low: 59, rain: 0.28, snow: 0,    wind: 0.22 },
  },
  'San Diego': {
    4: { high: 68, low: 55, rain: 0.12, snow: 0,    wind: 0.18 },
    5: { high: 69, low: 58, rain: 0.06, snow: 0,    wind: 0.18 },
    6: { high: 72, low: 61, rain: 0.03, snow: 0,    wind: 0.15 },
    7: { high: 76, low: 65, rain: 0.02, snow: 0,    wind: 0.15 },
    8: { high: 78, low: 66, rain: 0.03, snow: 0,    wind: 0.15 },
    9: { high: 77, low: 64, rain: 0.05, snow: 0,    wind: 0.15 },
  },
  'Los Angeles': {
    4: { high: 70, low: 53, rain: 0.10, snow: 0,    wind: 0.15 },
    5: { high: 73, low: 56, rain: 0.04, snow: 0,    wind: 0.15 },
    6: { high: 78, low: 60, rain: 0.02, snow: 0,    wind: 0.12 },
    7: { high: 84, low: 64, rain: 0.01, snow: 0,    wind: 0.12 },
    8: { high: 85, low: 65, rain: 0.02, snow: 0,    wind: 0.12 },
    9: { high: 83, low: 63, rain: 0.03, snow: 0,    wind: 0.12 },
  },
};

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const WIND_DIRECTIONS = ['in', 'out', 'left', 'right', 'swirling'];
const WIND_LABELS = {
  in: 'Blowing In',
  out: 'Blowing Out',
  left: 'Left to Right',
  right: 'Right to Left',
  swirling: 'Swirling',
};

const WIND_STRENGTHS = ['calm', 'light', 'moderate', 'strong'];

function randBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateWeather(city) {
  const climate = CLIMATE[city];
  if (!climate) {
    // Fallback for unknown cities
    return {
      date: 'June 15, 1984',
      month: 6,
      day: 15,
      isDay: true,
      temperature: 75,
      condition: 'clear',
      windSpeed: 'calm',
      windDirection: null,
      windLabel: null,
      summary: '75°F, Clear, Calm',
      effects: [],
      isIndoor: false,
    };
  }

  // Random date: April 1 to October 1
  const monthDays = { 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30 };
  const months = [4, 5, 6, 7, 8, 9];
  const totalDays = Object.values(monthDays).reduce((a, b) => a + b, 0);
  let dayOffset = randBetween(0, totalDays - 1);
  let month = 4;
  for (const m of months) {
    if (dayOffset < monthDays[m]) break;
    dayOffset -= monthDays[m];
    month = m;
  }
  const day = dayOffset + 1;

  const isDay = Math.random() < 0.65; // slightly more day games

  const data = climate[month];
  // Night games are cooler — drop temp by ~8-12 degrees
  const nightDrop = isDay ? 0 : randBetween(8, 12);
  const temp = randBetween(data.low, data.high) - nightDrop;

  // Determine condition
  const roll = Math.random();
  let condition = 'clear';
  if (data.snow > 0 && roll < data.snow) {
    condition = 'snow';
  } else if (roll < data.snow + data.rain) {
    condition = 'rain';
  } else if (roll < data.snow + data.rain + 0.15) {
    condition = 'overcast';
  }

  // Wind
  let windSpeed = 'calm';
  let windDirection = null;
  if (data.wind > 0 && Math.random() < data.wind) {
    const windRoll = Math.random();
    if (windRoll < 0.25) windSpeed = 'light';
    else if (windRoll < 0.65) windSpeed = 'moderate';
    else windSpeed = 'strong';
    windDirection = WIND_DIRECTIONS[Math.floor(Math.random() * WIND_DIRECTIONS.length)];
  }

  // Build summary
  const condLabel = condition === 'clear' ? 'Clear' : condition === 'overcast' ? 'Overcast' : condition === 'rain' ? 'Rain' : 'Snow';
  let summary = `${temp}°F, ${condLabel}`;
  let windLabel = null;
  if (windSpeed !== 'calm' && windDirection) {
    windLabel = `${windSpeed === 'light' ? 'Light' : windSpeed === 'moderate' ? 'Moderate' : 'Strong'} wind`;
    if (windDirection === 'swirling') windLabel += ', Swirling';
    else if (windDirection === 'in') windLabel += ', Blowing In';
    else if (windDirection === 'out') windLabel += ', Blowing Out';
    else windLabel += `, ${WIND_LABELS[windDirection]}`;
    summary += `, ${windLabel}`;
  } else if (windSpeed === 'calm') {
    windLabel = 'Calm';
  }

  // Effects
  const effects = [];
  if (condition === 'rain') effects.push('Rain increases fielding errors');
  if (condition === 'snow') effects.push('Snow increases errors and slows runners');
  if (temp < 45) effects.push('Cold weather suppresses power');
  if (temp > 85) effects.push('Heat drains pitcher stamina faster');
  if (windDirection === 'in' && windSpeed === 'strong') effects.push('Strong wind blowing in kills fly balls');
  if (windDirection === 'in' && windSpeed === 'moderate') effects.push('Wind blowing in suppresses fly balls');
  if (windDirection === 'out' && windSpeed === 'strong') effects.push('Strong wind blowing out carries fly balls');
  if (windDirection === 'out' && windSpeed === 'moderate') effects.push('Wind blowing out helps fly balls');
  if (windDirection === 'swirling' && windSpeed !== 'calm') effects.push('Swirling wind increases errors');
  if (!isDay) effects.push('Night game — slightly lower batting average');

  const dateStr = `${MONTH_NAMES[month]} ${day}, 1984`;

  return {
    date: dateStr,
    month,
    day,
    isDay,
    temperature: temp,
    condition,
    windSpeed,
    windDirection,
    windLabel,
    summary,
    effects,
    isIndoor: false,
  };
}

// Apply weather effects to game probabilities
// Called from game engine during hit resolution
export function applyWeatherEffects(weather, context) {
  if (!weather || weather.isIndoor) return context;

  const { condition, temperature, windSpeed, windDirection, isDay } = weather;
  const result = { ...context };

  // Rain: +15% errors, slightly slower runners
  if (condition === 'rain') {
    result.errorMult = (result.errorMult || 1) * 1.15;
    result.speedPenalty = (result.speedPenalty || 0) + 1;
  }
  // Snow: +25% errors, -2 speed
  if (condition === 'snow') {
    result.errorMult = (result.errorMult || 1) * 1.25;
    result.speedPenalty = (result.speedPenalty || 0) + 2;
  }
  // Cold: slight power drop
  if (temperature < 45) {
    result.powerMod = (result.powerMod || 0) - 0.5;
  }
  // Hot: stamina drain (handled in stamina logic)
  if (temperature > 85) {
    result.staminaDrain = (result.staminaDrain || 1) * 1.3;
  }
  // Wind effects on fly balls
  if (windDirection === 'in' && windSpeed === 'strong') {
    result.hrMod = (result.hrMod || 1) * 0.6;
    result.doubleMod = (result.doubleMod || 1) * 0.8;
    result.singleMod = (result.singleMod || 1) * 1.1;
  } else if (windDirection === 'in' && windSpeed === 'moderate') {
    result.hrMod = (result.hrMod || 1) * 0.8;
    result.doubleMod = (result.doubleMod || 1) * 0.9;
  } else if (windDirection === 'out' && windSpeed === 'strong') {
    result.hrMod = (result.hrMod || 1) * 1.35;
    result.doubleMod = (result.doubleMod || 1) * 1.15;
  } else if (windDirection === 'out' && windSpeed === 'moderate') {
    result.hrMod = (result.hrMod || 1) * 1.15;
    result.doubleMod = (result.doubleMod || 1) * 1.08;
  }
  // Swirling wind: +10% errors
  if (windDirection === 'swirling' && windSpeed !== 'calm') {
    result.errorMult = (result.errorMult || 1) * 1.10;
  }
  // Night: slight BA drop
  if (!isDay) {
    result.contactMod = (result.contactMod || 0) - 0.3;
  }

  return result;
}