import { useEffect, useRef } from 'react';
import { TEAMS } from '@/lib/gameData';

// Shared AudioContext - created/resumed within a user gesture via unlockRobotAnnouncer()
let _sharedAudioCtx = null;

// Call this from a click handler (user gesture) to unlock audio for the announcer
export function unlockRobotAnnouncer() {
  try {
    if (!_sharedAudioCtx) {
      _sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_sharedAudioCtx.state === 'suspended') _sharedAudioCtx.resume();
  } catch (e) { /* ignore */ }
  // Prime speechSynthesis within the user gesture so it works in later effects
  try {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance('');
      u.volume = 0;
      window.speechSynthesis.speak(u);
    }
  } catch (e) { /* ignore */ }
}

// Blowout promos disabled - user feedback

// Build player name set from all rosters
const PLAYER_NAMES = new Set();
Object.values(TEAMS).forEach(team => {
  team.lineup.forEach(p => PLAYER_NAMES.add(p.name));
  team.rotation.forEach(p => PLAYER_NAMES.add(p.name));
  team.bullpen.forEach(p => PLAYER_NAMES.add(p.name));
  team.bench?.forEach(p => PLAYER_NAMES.add(p.name));
});

// Voice profiles - each with a sex flag so broadcast pairs sound like two different people
// Lead announcers use 'male', color commentators use 'female' (or solo if only one announcer)
const ANNOUNCER_PROFILES = {
  'Harry Caray':    { pitch: 0.78, rate: 0.85, modFreq: 55,  modGain: 0.22, sex: 'male' },
  'Steve Stone':    { pitch: 1.30, rate: 0.95, modFreq: 105, modGain: 0.08, sex: 'female' },
  'Ned Martin':     { pitch: 0.52, rate: 0.92, modFreq: 78,  modGain: 0.16, sex: 'male' },
  'Bob Montgomery': { pitch: 1.25, rate: 0.98, modFreq: 90,  modGain: 0.09, sex: 'female' },
  'Ernie Harwell':  { pitch: 0.58, rate: 0.88, modFreq: 82,  modGain: 0.15, sex: 'male' },
  'Paul Carey':     { pitch: 1.20, rate: 0.95, modFreq: 100, modGain: 0.10, sex: 'female' },
  'Jerry Coleman':  { pitch: 0.62, rate: 1.05, modFreq: 95,  modGain: 0.12, sex: 'male' },
  'Dave Campbell':  { pitch: 1.35, rate: 0.98, modFreq: 110, modGain: 0.07, sex: 'female' },
  'Phil Rizzuto':   { pitch: 0.68, rate: 1.10, modFreq: 105, modGain: 0.11, sex: 'male' },
  'Bill White':     { pitch: 1.15, rate: 0.92, modFreq: 85,  modGain: 0.09, sex: 'female' },
  'Chuck Thompson': { pitch: 0.52, rate: 0.95, modFreq: 78,  modGain: 0.15, sex: 'male' },
  'Brooks Robinson':{ pitch: 1.28, rate: 0.90, modFreq: 92,  modGain: 0.08, sex: 'female' },
  'Vin Scully':     { pitch: 0.50, rate: 0.88, modFreq: 72,  modGain: 0.14, sex: 'male' },
  'Ralph Kiner':    { pitch: 0.54, rate: 0.95, modFreq: 82,  modGain: 0.15, sex: 'male' },
  'Tim McCarver':   { pitch: 1.22, rate: 1.00, modFreq: 95,  modGain: 0.08, sex: 'female' },
  'default':        { pitch: 0.50, rate: 1.05, modFreq: 80,  modGain: 0.15, sex: 'male' },
};

// Ball-in-play types that get the retro micro-pause treatment
const HIT_PLAY_TYPES = ['single', 'double', 'triple', 'homerun', 'groundout', 'flyout',
  'doubleplay', 'error', 'sacfly', 'popout', 'lineout', 'fc',
  'offMonster', 'ivyStuck', 'basketHR', 'shortPorch', 'peskyPole', 'triangle'];

// Speak text with a retro robot voice: player names get slow robotic treatment
// Uses onend chaining instead of setTimeout delays for reliable sequencing
function speakRobot(text, audioCtx, announcerName, delayMs = 0) {
  if (!('speechSynthesis' in window)) return;

  // Strip emojis - speech synth reads them literally (e.g. 💥 = "collision")
  const cleanedText = text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{2702}-\u{27B0}\u{1F900}-\u{1F9FF}\u{200D}\u{FE0F}]/gu, '').replace(/\s*-\s*/g, ', ').trim();
  if (!cleanedText) return;

  const doSpeak = () => {
    window.speechSynthesis.cancel();

    const profile = ANNOUNCER_PROFILES[announcerName] || ANNOUNCER_PROFILES['default'];
    const voices = window.speechSynthesis.getVoices();

    // Prefer a deep, authoritative male voice for broadcast feel
    let voice = null;
    const deepMalePatterns = ['Daniel', 'Google UK English Male', 'Microsoft David', 'male', 'deep'];
    for (const pattern of deepMalePatterns) {
      const match = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes(pattern.toLowerCase()));
      if (match) { voice = match; break; }
    }
    if (!voice) voice = voices.find(v => v.lang.startsWith('en')) || voices[0];

    // Split text into chunks by detecting player names via the roster set
    const words = cleanedText.split(' ');
    const chunks = [];
    let i = 0;

    while (i < words.length) {
      // Try 3-word name (e.g. "Cal Ripken Jr.")
      if (i + 2 < words.length) {
        const threeWord = `${words[i]} ${words[i+1]} ${words[i+2]}`;
        if (PLAYER_NAMES.has(threeWord)) {
          chunks.push({ text: threeWord, slow: true });
          i += 3;
          continue;
        }
      }
      // Try 2-word name (e.g. "Tony Gwynn")
      if (i + 1 < words.length) {
        const twoWord = `${words[i]} ${words[i+1]}`;
        if (PLAYER_NAMES.has(twoWord)) {
          chunks.push({ text: twoWord, slow: true });
          i += 2;
          continue;
        }
      }
      // Collect normal text
      { let normalWords = [];
      while (i < words.length) {
        let isNextName = false;
        if (i + 2 < words.length && PLAYER_NAMES.has(`${words[i]} ${words[i+1]} ${words[i+2]}`)) isNextName = true;
        else if (i + 1 < words.length && PLAYER_NAMES.has(`${words[i]} ${words[i+1]}`)) isNextName = true;
        if (isNextName) break;
        normalWords.push(words[i]);
        i++;
      }
      if (normalWords.length > 0) {
        chunks.push({ text: normalWords.join(' '), slow: false });
      } }
    }

    // Play chunks sequentially using onend for reliable chaining
    let idx = 0;
    function playNext() {
      if (idx >= chunks.length) return;
      const chunk = chunks[idx];
      idx++;

      const utterance = new SpeechSynthesisUtterance(chunk.text);
      if (voice) utterance.voice = voice;
      utterance.volume = 0.85;

      if (chunk.slow) {
        // Player names: distinct cadence but still intelligible
        utterance.pitch = Math.max(0.30, profile.pitch * 0.55);
        utterance.rate = Math.max(0.50, profile.rate * 0.55);
      } else {
        utterance.pitch = profile.pitch;
        utterance.rate = profile.rate;
      }

      let osc = null, gain = null, analyser = null;
      if (audioCtx) {
        osc = audioCtx.createOscillator();
        gain = audioCtx.createGain();
        analyser = audioCtx.createAnalyser();
        osc.type = 'sine';
        osc.frequency.value = chunk.slow ? profile.modFreq * 0.65 : profile.modFreq;
        gain.gain.value = chunk.slow ? profile.modGain * 1.8 : profile.modGain;
        osc.connect(gain);
        gain.connect(analyser);
        analyser.connect(audioCtx.destination);
        osc.start();
      }

      utterance.onend = () => {
        if (osc) { osc.stop(); osc.disconnect(); gain.disconnect(); analyser.disconnect(); }
        playNext();
      };
      utterance.onerror = () => {
        if (osc) { osc.stop(); osc.disconnect(); gain.disconnect(); analyser.disconnect(); }
        playNext();
      };

      window.speechSynthesis.speak(utterance);
    }

    playNext();
  };

  if (delayMs > 0) {
    setTimeout(doSpeak, delayMs);
  } else {
    doSpeak();
  }
}

export default function useRobotAnnouncer(gameState, enabled, announcerName) {
  const lastLogIdx = useRef(0);
  const ensureCtx = () => {
    if (!_sharedAudioCtx) {
      _sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (_sharedAudioCtx.state === 'suspended') {
      _sharedAudioCtx.resume();
    }
    return _sharedAudioCtx;
  };

  useEffect(() => {
    if (!enabled || !gameState?.log?.length) {
      lastLogIdx.current = gameState?.log?.length || 0;
      return;
    }

    const log = gameState.log;
    const newEntries = log.slice(lastLogIdx.current);

    if (newEntries.length > 0) {
      const speakable = newEntries.filter(e => {
        const t = e.type;
        return t === 'single' || t === 'double' || t === 'triple' || t === 'homerun' ||
               t === 'strikeout' || t === 'walk' || t === 'groundout' || t === 'flyout' ||
               t === 'doubleplay' || t === 'error' || t === 'fc' || t === 'sacfly' ||
               t === 'steal' || t === 'caughtstealing' || t === 'popout' || t === 'lineout' ||
               t === 'strike' || t === 'ball' || t === 'foul' ||
               t === 'offMonster' || t === 'ivyStuck' || t === 'basketHR' ||
               t === 'shortPorch' || t === 'peskyPole' || t === 'triangle';
      });

      if (speakable.length > 0) {
        const lastSpeakable = speakable[speakable.length - 1];
        const ctx = ensureCtx();

        // Micro-pause for ball-in-play: 400ms of silence (retro processing delay)
        const needPause = HIT_PLAY_TYPES.includes(lastSpeakable.type);
        const delay = needPause ? 450 : 0;

        speakRobot(lastSpeakable.text, ctx, announcerName, delay);
      }

      lastLogIdx.current = log.length;
    }
  }, [gameState?.log, enabled, announcerName]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);
}