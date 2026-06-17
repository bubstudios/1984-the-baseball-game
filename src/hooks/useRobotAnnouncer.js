import { useEffect, useRef } from 'react';

// 1984 blowout promo lines — injected when one team leads by 6+ in 7th+
const BLOWOUT_PROMOS = [
  "STAY... TUNED... FOR... THE... A-TEAM... AFTER... THE... GAME.",
  "BUY... THE... NEW... MACINTOSH... COMPUTER... TODAY.",
  "POST... GAME... CONCERT... BY... HUEY... LEWIS... AND... THE... NEWS.",
  "DON'T... MISS... MIAMI... VICE... FRIDAY... NIGHT... ON... NBC.",
  "THIS... GAME... BROUGHT... TO... YOU... BY... CHEVROLET... THE... HEARTBEAT... OF... AMERICA.",
  "COMING... UP... NEXT... WEEK... THE... ALL-STAR... GAME... LIVE... FROM... SAN... FRANCISCO.",
  "VISIT... YOUR... LOCAL... RADIO... SHACK... FOR... THE... LATEST... TANDY... COMPUTERS.",
  "NOW... AVAILABLE... ON... VHS... AND... BETAMAX... THE... NATURAL... STARRING... ROBERT... REDFORD.",
  "CALL... 1-800... COLLECT... TO... PLACE... YOUR... SEASON... TICKET... ORDER... TODAY.",
  "TRY... NEW... COKE... THE... OFFICIAL... SOFT... DRINK... OF... MAJOR... LEAGUE... BASEBALL.",
];

// Voice profiles for each announcer — different pitch, rate, and modulation
const ANNOUNCER_PROFILES = {
  'Harry Caray':    { pitch: 0.75, rate: 0.85, modFreq: 55,  modGain: 0.20 },
  'Steve Stone':    { pitch: 0.55, rate: 1.00, modFreq: 95,  modGain: 0.12 },
  'Ned Martin':     { pitch: 0.50, rate: 0.95, modFreq: 80,  modGain: 0.14 },
  'Bob Montgomery': { pitch: 0.40, rate: 1.00, modFreq: 75,  modGain: 0.16 },
  'Ernie Harwell':  { pitch: 0.55, rate: 0.90, modFreq: 85,  modGain: 0.14 },
  'Paul Carey':     { pitch: 0.50, rate: 1.00, modFreq: 90,  modGain: 0.13 },
  'Jerry Coleman':  { pitch: 0.60, rate: 1.10, modFreq: 100, modGain: 0.11 },
  'Dave Campbell':  { pitch: 0.50, rate: 1.00, modFreq: 80,  modGain: 0.14 },
  'Phil Rizzuto':   { pitch: 0.65, rate: 1.15, modFreq: 110, modGain: 0.10 },
  'Bill White':     { pitch: 0.35, rate: 0.95, modFreq: 70,  modGain: 0.18 },
  'Chuck Thompson': { pitch: 0.50, rate: 0.95, modFreq: 80,  modGain: 0.14 },
  'Brooks Robinson':{ pitch: 0.45, rate: 0.90, modFreq: 75,  modGain: 0.15 },
  'Vin Scully':     { pitch: 0.50, rate: 0.88, modFreq: 70,  modGain: 0.13 },
  'Ralph Kiner':    { pitch: 0.50, rate: 1.00, modFreq: 85,  modGain: 0.14 },
  'Tim McCarver':   { pitch: 0.55, rate: 1.05, modFreq: 90,  modGain: 0.12 },
  'default':        { pitch: 0.50, rate: 1.05, modFreq: 80,  modGain: 0.15 },
};

// Ball-in-play types that get the retro micro-pause treatment
const HIT_PLAY_TYPES = ['single', 'double', 'triple', 'homerun', 'groundout', 'flyout',
  'doubleplay', 'error', 'sacfly', 'popout', 'lineout', 'fc',
  'offMonster', 'ivyStuck', 'basketHR', 'shortPorch', 'peskyPole', 'triangle'];

// Player names from rosters — detect these for slow, robotic enunciation
const PLAYER_NAMES = new Set();

// Speak text with a retro robot voice using Web Speech API + AudioContext filter
// delayMs: intentional micro-pause (retro processing delay) before speaking
function speakRobot(text, audioCtx, announcerName, delayMs = 0) {
  if (!('speechSynthesis' in window)) return;

  // Strip emojis — speech synth reads them literally (e.g. 💥 = "collision")
  const cleanedText = text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{2702}-\u{27B0}\u{1F900}-\u{1F9FF}\u{200D}\u{FE0F}]/gu, '').trim();

  const doSpeak = () => {
    window.speechSynthesis.cancel();

    const profile = ANNOUNCER_PROFILES[announcerName] || ANNOUNCER_PROFILES['default'];

    // Split text into chunks: player names get slow robot treatment, rest is normal speed
    // Player names are capitalized multi-word names — slow them down for retro game feel
    const words = cleanedText.split(' ');
    const chunks = [];
    let currentChunk = '';
    let currentIsName = false;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isCapitalized = /^[A-Z][a-z]+$/.test(word) && word.length > 1;
      const isRetired = word === 'retired';
      const nextWord = words[i + 1];
      const nextIsCapitalized = nextWord ? /^[A-Z][a-z]+$/.test(nextWord) && nextWord.length > 1 : false;
      const nextIsJr = nextWord === 'Jr.';

      // Detect multi-word names (e.g. "Tony Gwynn", "Cal Ripken Jr.")
      const isNameWord = isCapitalized && !isRetired;
      const isNameContinuation = currentIsName && (isCapitalized || (word === 'Jr.' || word === 'Sr.'));

      if (isNameWord || isNameContinuation) {
        if (!currentIsName && currentChunk) {
          chunks.push({ text: currentChunk.trim(), slow: false });
          currentChunk = '';
        }
        currentIsName = true;
        currentChunk += word + ' ';
      } else {
        if (currentIsName && currentChunk) {
          chunks.push({ text: currentChunk.trim(), slow: true });
          currentChunk = '';
          currentIsName = false;
        }
        currentChunk += word + ' ';
      }
    }
    if (currentChunk.trim()) {
      chunks.push({ text: currentChunk.trim(), slow: currentIsName });
    }

    // Play chunks sequentially
    let delay = 0;
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Fred')) ||
                           voices.find(v => v.lang.startsWith('en') && v.name.includes('Male')) ||
                           voices.find(v => v.lang.startsWith('en'));

    chunks.forEach((chunk) => {
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(chunk.text);
        if (preferredVoice) utterance.voice = preferredVoice;

        if (chunk.slow) {
          // Robot voice for names: slower rate, lower pitch, more robotic
          utterance.pitch = Math.max(0.1, profile.pitch - 0.25);
          utterance.rate = Math.max(0.25, profile.rate * 0.35);
        } else {
          utterance.pitch = profile.pitch;
          utterance.rate = profile.rate;
        }
        utterance.volume = 0.85;

        if (audioCtx) {
          const oscillator = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const analyser = audioCtx.createAnalyser();

          oscillator.type = 'sine';
          oscillator.frequency.value = chunk.slow ? profile.modFreq * 0.7 : profile.modFreq;
          gain.gain.value = chunk.slow ? profile.modGain * 1.4 : profile.modGain;

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
      }, delay);
      // Estimate chunk duration: slow names ~500ms per word, normal ~300ms per word
      delay += chunk.slow ? chunk.text.split(' ').length * 500 : chunk.text.split(' ').length * 300;
    });
  };

  if (delayMs > 0) {
    setTimeout(doSpeak, delayMs);
  } else {
    doSpeak();
  }
}

export default function useRobotAnnouncer(gameState, enabled, announcerName) {
  const audioCtxRef = useRef(null);
  const lastLogIdx = useRef(0);
  const promoCooldown = useRef(0);

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Check if it's a blowout — 6+ run lead in 7th+
  const isBlowout = (state) => {
    if (!state || state.inning < 7) return false;
    const diff = Math.abs(state.score.home - state.score.away);
    return diff >= 6;
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

      // Blowout promo injection: occasionally sneak in a vintage promo
      if (isBlowout(gameState) && promoCooldown.current <= 0 && Math.random() < 0.15) {
        const promo = BLOWOUT_PROMOS[Math.floor(Math.random() * BLOWOUT_PROMOS.length)];
        const ctx = ensureCtx();
        const delay = speakable.length > 0 ? 2500 : 500; // wait for last speech to finish
        speakRobot(promo, ctx, announcerName, delay);
        promoCooldown.current = 8; // cooldown ~8 plays
      }
      if (promoCooldown.current > 0) promoCooldown.current--;

      lastLogIdx.current = log.length;
    }
  }, [gameState?.log, enabled, announcerName]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      audioCtxRef.current?.close();
    };
  }, []);
}