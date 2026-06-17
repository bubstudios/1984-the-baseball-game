import { useEffect, useRef, useState } from 'react';

// Speak text with a retro robot voice using Web Speech API + AudioContext filter
function speakRobot(text, audioCtx) {
  if (!('speechSynthesis' in window)) return;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Pick a voice — prefer a deep English one, then fall back
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Daniel') || v.name.includes('Fred')) ||
                    voices.find(v => v.lang.startsWith('en') && v.name.includes('Male')) ||
                    voices.find(v => v.lang.startsWith('en'));
  if (preferred) utterance.voice = preferred;

  // Robotic: low pitch, slightly fast, flat intonation
  utterance.pitch = 0.5;
  utterance.rate = 1.05;
  utterance.volume = 0.85;

  // Route through AudioContext for robotic filter effect
  if (audioCtx) {
    const source = audioCtx.createMediaStreamDestination();
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const analyser = audioCtx.createAnalyser();

    // Ring modulation — classic robot voice
    oscillator.type = 'sine';
    oscillator.frequency.value = 80; // low rumble modulation
    gain.gain.value = 0.15;

    oscillator.connect(gain);
    gain.connect(analyser);
    analyser.connect(audioCtx.destination);

    oscillator.start();
    utterance.onend = () => {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      analyser.disconnect();
    };
    utterance.onerror = () => {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      analyser.disconnect();
    };
  }

  window.speechSynthesis.speak(utterance);
}

export default function useRobotAnnouncer(gameState, enabled) {
  const audioCtxRef = useRef(null);
  const lastLogIdx = useRef(0);

  // Lazy-init AudioContext (needs user interaction first)
  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    if (!enabled || !gameState?.log?.length) {
      lastLogIdx.current = gameState?.log?.length || 0;
      return;
    }

    const log = gameState.log;
    const newEntries = log.slice(lastLogIdx.current);

    if (newEntries.length > 0) {
      // Only read the LAST play entry (not info/ball/strike/foul noise)
      const speakable = newEntries.filter(e => {
        const t = e.type;
        return t === 'single' || t === 'double' || t === 'triple' || t === 'homerun' ||
               t === 'strikeout' || t === 'walk' || t === 'groundout' || t === 'flyout' ||
               t === 'doubleplay' || t === 'error' || t === 'fc' || t === 'sacfly' ||
               t === 'steal' || t === 'caughtstealing' || t === 'popout' || t === 'lineout';
      });

      if (speakable.length > 0) {
        const lastSpeakable = speakable[speakable.length - 1];
        const ctx = ensureCtx();
        speakRobot(lastSpeakable.text, ctx);
      }

      lastLogIdx.current = log.length;
    }
  }, [gameState?.log, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      audioCtxRef.current?.close();
    };
  }, []);
}