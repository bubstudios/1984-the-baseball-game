import { useState, useRef, useEffect } from 'react';
import { isAuthenticated } from '@/components/GateLogin';

const INNINGS_KEY = 'exhibition_innings_played';
const FREE_INNINGS_LIMIT = 6;

export function getExhibitionInnings() {
  return parseInt(localStorage.getItem(INNINGS_KEY) || '0', 10);
}

export function hasReachedInningLimit() {
  return getExhibitionInnings() >= FREE_INNINGS_LIMIT;
}

/**
 * Tracks exhibition innings played (persisted in localStorage) and manages
 * the auth modal. Users can play freely until 6 innings are completed,
 * after which they must sign up to continue.
 */
export function useExhibitionAuth(gameState, gameMode) {
  const [showModal, setShowModal] = useState(false);
  const prevInningRef = useRef(null);

  useEffect(() => {
    if (!gameState || gameMode !== 'exhibition') return;
    const inning = gameState.inning;
    if (prevInningRef.current !== null && inning > prevInningRef.current) {
      const next = getExhibitionInnings() + 1;
      localStorage.setItem(INNINGS_KEY, String(next));
      if (next >= FREE_INNINGS_LIMIT && !isAuthenticated()) {
        setShowModal(true);
      }
    }
    prevInningRef.current = inning;
  }, [gameState, gameMode]);

  const blocked = !isAuthenticated() && hasReachedInningLimit();

  return {
    showModal,
    blocked,
    require: () => setShowModal(true),
    dismiss: () => setShowModal(false),
  };
}