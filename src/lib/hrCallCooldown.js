// Home Run Call Cooldown System
// Tracks recently used HR call templates to prevent repetition.
// - Tracks last 10 HR call template IDs globally (across all teams)
// - Tracks last 5 HR call template IDs per team
// - Launching Pad (Atlanta): max 1 per game, never same sentence twice in a game

const GLOBAL_COOLDOWN_SIZE = 10;
const TEAM_COOLDOWN_SIZE = 5;
const LAUNCHING_PAD_MAX_PER_GAME = 1;

// ── Get or create the cooldown tracker on game state ──
export function getHRCallCooldown(state) {
  if (!state._hrCallCooldown) {
    state._hrCallCooldown = {
      global: [],
      teams: {},
      launchingPad: {},
    };
  }
  return state._hrCallCooldown;
}

// ── Check if a template ID is on cooldown ──
export function isHRTemplateOnCooldown(state, templateId, teamKey) {
  const cd = getHRCallCooldown(state);
  if (cd.global.includes(templateId)) return true;
  const teamList = cd.teams[teamKey] || [];
  if (teamList.includes(templateId)) return true;
  return false;
}

// ── Pick a call from a pool, skipping any on cooldown ──
// calls = array of { id, text }
export function pickHRCall(state, teamKey, calls) {
  if (!calls || calls.length === 0) return null;
  const available = calls.filter(c => !isHRTemplateOnCooldown(state, c.id, teamKey));
  const pool = available.length > 0 ? available : calls;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── Record a template as used (adds to both global and team lists) ──
export function recordHRTemplateUsed(state, templateId, teamKey) {
  const cd = getHRCallCooldown(state);
  cd.global.unshift(templateId);
  if (cd.global.length > GLOBAL_COOLDOWN_SIZE) cd.global.length = GLOBAL_COOLDOWN_SIZE;
  if (!cd.teams[teamKey]) cd.teams[teamKey] = [];
  cd.teams[teamKey].unshift(templateId);
  if (cd.teams[teamKey].length > TEAM_COOLDOWN_SIZE) cd.teams[teamKey].length = TEAM_COOLDOWN_SIZE;
}

// ── Launching Pad specific (Atlanta) ──
// Max 1 Launching Pad call per game; never use the same sentence twice in a game.
export function canUseLaunchingPad(state, teamKey) {
  const cd = getHRCallCooldown(state);
  if (!cd.launchingPad[teamKey]) cd.launchingPad[teamKey] = { gameCount: 0, usedIds: [] };
  const lp = cd.launchingPad[teamKey];
  if (lp.gameCount >= LAUNCHING_PAD_MAX_PER_GAME) return false;
  return true;
}

// Pick a Launching Pad line, avoiding any already used this game.
// lines = array of { id, text }
export function pickLaunchingPadLine(state, teamKey, lines) {
  const cd = getHRCallCooldown(state);
  if (!cd.launchingPad[teamKey]) cd.launchingPad[teamKey] = { gameCount: 0, usedIds: [] };
  const lp = cd.launchingPad[teamKey];

  const available = lines.filter(l => !lp.usedIds.includes(l.id));
  const pool = available.length > 0 ? available : lines;
  const pick = pool[Math.floor(Math.random() * pool.length)];

  lp.usedIds.push(pick.id);
  lp.gameCount++;

  return pick;
}