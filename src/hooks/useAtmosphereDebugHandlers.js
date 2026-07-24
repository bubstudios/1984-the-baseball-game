import { useCallback } from 'react';
import { getCurrentBatter, getCurrentPitcher, getEffectivePitcher } from '@/lib/gameEngine';
import { MANAGERS } from '@/lib/gameData';
import { inc as incAtmo, forceBallparkEvent, forceCelebrationText, forceBenchChirp, forceRobbedHRText } from '@/lib/atmosphereDebug';

/**
 * Atmosphere debug event handlers, extracted from Home.jsx to reduce file size.
 * Returns the handleForceAtmoEvent callback.
 */
export function useAtmosphereDebugHandlers(gameState, homeTeam, awayTeam, setInlineGameEvent, setForceFanChirpTrigger, setArgumentResult) {
  return useCallback((eventId) => {
    if (!gameState) return;
    if (eventId === 'ballpark') {
      const event = forceBallparkEvent(gameState);
      if (event) { setInlineGameEvent({ type: 'ballpark', event }); incAtmo('bp_fired'); }
    } else if (eventId === 'celebration') {
      const batter = getCurrentBatter(gameState);
      const pitcher = getEffectivePitcher(gameState) || getCurrentPitcher(gameState);
      const text = forceCelebrationText(batter, pitcher);
      if (text) { setInlineGameEvent({ type: 'celebration', event: text }); incAtmo('celeb_fired'); }
    } else if (eventId === 'fanchirp') {
      setForceFanChirpTrigger(t => t + 1);
      incAtmo('fan_fired');
    } else if (eventId === 'benchchirp') {
      const chirp = forceBenchChirp();
      setArgumentResult({ ...chirp, ejected: false, homeTeamKey: homeTeam || awayTeam, managerName: MANAGERS[homeTeam]?.name || 'The Manager' });
      incAtmo('bench_fired');
    } else if (eventId === 'ejection') {
      setArgumentResult({
        ejected: true,
        managerName: MANAGERS[homeTeam]?.name || 'The Manager',
        escaLevel: 3,
        callType: 'forced ejection test',
        whoArgues: 'manager',
        homeTeamKey: homeTeam || awayTeam,
        hatThrow: true,
        dirtKick: true,
      });
      incAtmo('bench_fired');
    } else if (eventId === 'robbedhr') {
      const batter = getCurrentBatter(gameState);
      const text = forceRobbedHRText(batter?.name, 'The outfielder');
      setInlineGameEvent({ type: 'celebration', event: text });
      incAtmo('celeb_fired');
    }
  }, [gameState, homeTeam, awayTeam]);
}