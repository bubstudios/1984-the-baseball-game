import { useEffect, useRef } from 'react';

// Voice profiles for each announcer — different pitch, rate, and modulation
const ANNOUNCER_PROFILES = {
  'Harry Caray':    { pitch: 0.75, rate: 0.85, modFreq: 55,  modGain: 0.20 }, // gravelly, slower
  'Steve Stone':    { pitch: 0.55, rate: 1.00, modFreq: 95,  modGain: 0.12 },
  'Ned Martin':     { pitch: 0.50, rate: 0.95, modFreq: 80,  modGain: 0.14 },
  'Bob Montgomery': { pitch: 0.40, rate: 1.00, modFreq: 75,  modGain: 0.16 },
  'Ernie Harwell':  { pitch: 0.55, rate: 0.90, modFreq: 85,  modGain: 0.14 },
  'Paul Carey':     { pitch: 0.50, rate: 1.00, modFreq: 90,  modGain: 0.13 },
  'Jerry Coleman':  { pitch: 0.60, rate: 1.10, modFreq: 100, modGain: 0.11 },
  'Dave Campbell':  { pitch: 0.50, rate: 1.00, modFreq: 80,  modGain: 0.14 },
  'Phil Rizzuto':   { pitch: 0.65, rate: 1.15, modFreq: 110, modGain: 0.10 }, // Scooter — higher, quicker
  'Bill White':     { pitch: 0.35, rate: 0.95, modFreq: 70,  modGain: 0.18 }, // deep, smooth
  'Chuck Thompson': { pitch: 0.50, rate: 0.95, modFreq: 80,  modGain: 0.14 },
  'Brooks Robinson':{ pitch: 0.45, rate: 0.90, modFreq: 75,  modGain: 0.15 },
  'Vin Scully':     { pitch: 0.50, rate: 0.88, modFreq: 70,  modGain: 0.13 }, // smooth, measured
  'Ralph Kiner':    { pitch: 0.50, rate: 1.00, modFreq: 85,  modGain: 0.14 },
  'Tim McCarver':   { pitch: 0.55, rate: 1.05, modFreq: 90,  modGain: 0.12 },
  'default':        { pitch: 0.50, rate: 1.05, modFreq: 80,  modGain: 0.15 },
};

// Speak text with a retro robot voice using Web Speech API + AudioContext filter
function speakRobot(text, audioCtx, announcerName) {
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

  // Apply announcer-specific profile
  const profile = ANNOUNCER_PROFILES[announcerName] || ANNOUNCER_PROFILES['default'];
  utterance.pitch = profile.pitch;
  utterance.rate = profile.rate;
  utterance.volume = 0.85;

  // Route through AudioContext for robotic filter effect
  if (audioCtx) {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const analyser = audioCtx.createAnalyser();

    // Ring modulation — classic robot voice
    oscillator.type = 'sine';
    oscillator.frequency.value = profile.modFreq;
    gain.gain.value = profile.modGain;

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

export default function useRobotAnnouncer(gameState, enabled, announcerName) {
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
        speakRobot(lastSpeakable.text, ctx, announcerName);
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