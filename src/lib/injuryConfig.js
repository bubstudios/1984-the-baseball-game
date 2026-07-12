// injuryConfig.js - Tunable injury severity rolls, duration table, and injury type names.
// All injury tuning lives here. Change weights/durations in one place.

// ── Severity Roll Table ──
// Weights are relative probabilities (not percentages). They sum to 100 for clarity.
export const SEVERITY_ROLLS = [
  { severity: 'minor',          weight: 45 },
  { severity: 'day_to_day',     weight: 32 },
  { severity: '15_day',          weight: 18 },
  { severity: '60_day',          weight: 4 },
  { severity: 'season_ending',  weight: 1 },
];

// Roll a severity using the weighted table above.
export function rollInjurySeverity() {
  const total = SEVERITY_ROLLS.reduce((s, r) => s + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of SEVERITY_ROLLS) {
    roll -= r.weight;
    if (roll <= 0) return r.severity;
  }
  return 'minor';
}

// ── Injury Type Names by Source ──
// Realistic injury descriptions keyed by how the injury was triggered.
const INJURY_TYPES = {
  hbp: ['bruised rib', 'bruised arm', 'bruised hand', 'jammed finger', 'sore wrist', 'contused forearm'],
  swing: ['oblique strain', 'pulled muscle', 'sore back', 'tight hamstring', 'strained side'],
  sliding: ['jammed finger', 'sprained ankle', 'bruised knee', 'jammed shoulder', 'scraped hand'],
  collision: ['concussion', 'bruised shoulder', 'sprained knee', 'bruised ribs', 'jammed neck'],
  pitching_fatigue: ['dead arm', 'sore elbow', 'tired shoulder', 'forearm strain', 'tight rotator cuff'],
  fielding: ['jammed thumb', 'bruised hand', 'sprained wrist', 'split fingertip'],
  running: ['pulled hamstring', 'groin strain', 'tight calf', 'strained quad', 'tweaked ankle'],
  pregame_scratch: ['flu-like symptoms', 'stomach bug', 'personal matter', 'tightness in back'],
  generic: ['strained muscle', 'soreness', 'tweaked joint'],
};

export function getInjuryTypeName(source) {
  const types = INJURY_TYPES[source] || INJURY_TYPES.generic;
  return types[Math.floor(Math.random() * types.length)];
}

// ── Duration Calculation ──
// Returns { eligibleReturnDate, gamesRemaining, daysRemaining } for a given severity.
// startDateStr is an ISO date string like '1984-04-12'.
export function calculateInjuryDuration(severity, startDateStr) {
  if (!startDateStr) startDateStr = '1984-04-02';
  const parts = startDateStr.split('-').map(Number);
  const startDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  };

  switch (severity) {
    case 'minor':
      // Clears after the current game - no persistent state needed
      return { eligibleReturnDate: startDateStr, gamesRemaining: 0, daysRemaining: 0 };

    case 'day_to_day': {
      const days = 1 + Math.floor(Math.random() * 6); // 1-6 calendar days
      return {
        eligibleReturnDate: addDays(startDate, days),
        gamesRemaining: Math.max(1, Math.ceil(days / 1.1)),
        daysRemaining: days,
      };
    }

    case '15_day': {
      const days = 15;
      return {
        eligibleReturnDate: addDays(startDate, days),
        gamesRemaining: 15,
        daysRemaining: days,
      };
    }

    case '60_day': {
      const days = 60;
      return {
        eligibleReturnDate: addDays(startDate, days),
        gamesRemaining: 60,
        daysRemaining: days,
      };
    }

    case 'season_ending':
      return {
        eligibleReturnDate: '1984-10-31',
        gamesRemaining: 999,
        daysRemaining: 999,
      };

    case 'pregame_scratch': {
      // Clears after the current game - available next day
      return {
        eligibleReturnDate: addDays(startDate, 1),
        gamesRemaining: 1,
        daysRemaining: 1,
      };
    }

    default:
      return { eligibleReturnDate: startDateStr, gamesRemaining: 0, daysRemaining: 0 };
  }
}

// ── Severity Display Labels ──
export const SEVERITY_LABELS = {
  minor: 'Minor',
  day_to_day: 'Day-to-Day',
  '15_day': '15-Day DL',
  '60_day': '60-Day DL',
  season_ending: 'Out for Season',
  pregame_scratch: 'Scratched',
};

export function getSeverityLabel(severity) {
  return SEVERITY_LABELS[severity] || severity;
}