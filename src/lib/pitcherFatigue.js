// Pitcher fatigue calculation based on innings pitched and stamina rating.

export function getPitcherFatigue(inningsPitched, pitcher) {
  const stamina = pitcher.stamina || 5;
  const isReliever = ['RP', 'CL'].includes(pitcher.pos) || ['RP', 'CL'].includes(pitcher.assignedPos);
  const threshold = isReliever ? stamina * 0.4 : Math.max(4.2, stamina * 0.7);
  if (inningsPitched <= threshold) return { fatigueLevel: 0, speedPen: 0, controlPen: 0 };
  const overThreshold = inningsPitched - threshold;
  const speedPen = Math.min(5, Math.round(overThreshold * 0.5));
  const controlPen = Math.min(5, Math.round(overThreshold * 0.7));
  const fatigueLevel = Math.min(4, Math.floor(overThreshold));
  return { fatigueLevel, speedPen, controlPen };
}

export function getEffectivePitcher(state) {
  if (!state) return null;
  const pitcher = state.halfInning === 'top' ? state.homePitcher : state.awayPitcher;
  if (!pitcher || !pitcher.stamina) return pitcher || null;
  const actualIP = pitcher.gameStats?.ip || 0;
  const fatigue = getPitcherFatigue(actualIP, pitcher);
  // Season-rest fatigue (starters on short rest + tired relievers). Set at game start
  // via getStarterFatigueStatus / isPitcherAvailable; 0 when fresh.
  const seasonPen = pitcher._seasonFatiguePenalty || 0;
  if (fatigue.fatigueLevel === 0 && seasonPen === 0) return pitcher;
  const offSpeedPen = fatigue.fatigueLevel >= 3 ? Math.min(4, Math.round((fatigue.fatigueLevel - 2) * 1.5)) : 0;
  const seasonControlPen = Math.round(seasonPen / 3);
  const seasonSpeedPen = Math.round(seasonPen / 6);
  const seasonOffPen = Math.round(seasonPen / 4);
  return {
    ...pitcher,
    effectivePitchSpeed: Math.max(1, pitcher.pitchSpeed - fatigue.speedPen - seasonSpeedPen),
    effectiveControl: Math.max(1, pitcher.control - fatigue.controlPen - seasonControlPen),
    effectiveOffSpeed: Math.max(1, pitcher.offSpeed - offSpeedPen - seasonOffPen),
    fatigueLevel: fatigue.fatigueLevel,
    fatigueSpeedPen: fatigue.speedPen + seasonSpeedPen,
    fatigueControlPen: fatigue.controlPen + seasonControlPen,
    seasonFatigue: seasonPen,
  };
}