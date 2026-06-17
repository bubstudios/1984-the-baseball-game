import { useEffect, useRef, useCallback } from 'react';

// Retro 8-bit audio effects using Web Audio API
// White noise crowd, bat crack (square wave burst), disk drive clack

let sharedCtx = null;
function getAudioCtx() {
  if (!sharedCtx) {
    sharedCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return sharedCtx;
}

// Call this from a user gesture (click/tap) to unlock the AudioContext
export function unlockAudio() {
  const ctx = getAudioCtx();
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
}

function ensureResumed() {
  if (sharedCtx && sharedCtx.state === 'suspended') {
    sharedCtx.resume().catch(() => {});
  }
}

// ─── White Noise Crowd Generator ────────────────────────────────────
// Steady low-volume hiss that modulates on big plays

let crowdNode = null;
let crowdGain = null;
let crowdFilter = null;
let crowdRunning = false;

function startCrowdNoise() {
  if (crowdRunning) return;
  ensureResumed();
  const ctx = getAudioCtx();
  crowdRunning = true;

  // Create white noise via buffer
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.06; // low-volume base noise
  }

  crowdNode = ctx.createBufferSource();
  crowdNode.buffer = buffer;
  crowdNode.loop = true;

  crowdFilter = ctx.createBiquadFilter();
  crowdFilter.type = 'bandpass';
  crowdFilter.frequency.value = 1200;
  crowdFilter.Q.value = 0.8;

  crowdGain = ctx.createGain();
  crowdGain.gain.value = 0.05; // very quiet baseline

  crowdNode.connect(crowdFilter);
  crowdFilter.connect(crowdGain);
  crowdGain.connect(ctx.destination);
  crowdNode.start();
}

function stopCrowdNoise() {
  if (!crowdRunning) return;
  try {
    crowdNode?.stop();
    crowdNode?.disconnect();
    crowdFilter?.disconnect();
    crowdGain?.disconnect();
  } catch (e) { /* already disconnected */ }
  crowdRunning = false;
  crowdNode = null;
  crowdGain = null;
  crowdFilter = null;
}

// Modulate crowd: ramp volume and shift filter frequency
function crowdReact(intensity = 'mild') {
  if (!crowdRunning || !crowdGain || !crowdFilter) {
    startCrowdNoise();
    if (!crowdGain || !crowdFilter) return;
  }
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  if (intensity === 'hr' || intensity === 'bigHit') {
    crowdGain.gain.cancelScheduledValues(now);
    crowdGain.gain.setValueAtTime(crowdGain.gain.value, now);
    crowdGain.gain.linearRampToValueAtTime(0.35, now + 0.3);
    crowdGain.gain.linearRampToValueAtTime(0.20, now + 2.0);
    crowdGain.gain.linearRampToValueAtTime(0.06, now + 4.0);

    crowdFilter.frequency.cancelScheduledValues(now);
    crowdFilter.frequency.setValueAtTime(crowdFilter.frequency.value, now);
    crowdFilter.frequency.linearRampToValueAtTime(2400, now + 0.4);
    crowdFilter.frequency.linearRampToValueAtTime(1200, now + 3.0);
  } else if (intensity === 'strikeout' || intensity === 'dp') {
    crowdGain.gain.cancelScheduledValues(now);
    crowdGain.gain.setValueAtTime(crowdGain.gain.value, now);
    crowdGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    crowdGain.gain.linearRampToValueAtTime(0.05, now + 1.5);

    crowdFilter.frequency.cancelScheduledValues(now);
    crowdFilter.frequency.setValueAtTime(crowdFilter.frequency.value, now);
    crowdFilter.frequency.linearRampToValueAtTime(1800, now + 0.3);
    crowdFilter.frequency.linearRampToValueAtTime(1200, now + 1.5);
  } else if (intensity === 'error' || intensity === 'run') {
    crowdGain.gain.cancelScheduledValues(now);
    crowdGain.gain.setValueAtTime(crowdGain.gain.value, now);
    crowdGain.gain.linearRampToValueAtTime(0.22, now + 0.25);
    crowdGain.gain.linearRampToValueAtTime(0.06, now + 2.0);
  } else if (intensity === 'walkoff') {
    crowdGain.gain.cancelScheduledValues(now);
    crowdGain.gain.setValueAtTime(crowdGain.gain.value, now);
    crowdGain.gain.linearRampToValueAtTime(0.50, now + 0.5);
    crowdGain.gain.linearRampToValueAtTime(0.30, now + 5.0);
    crowdGain.gain.linearRampToValueAtTime(0.10, now + 8.0);

    crowdFilter.frequency.cancelScheduledValues(now);
    crowdFilter.frequency.setValueAtTime(crowdFilter.frequency.value, now);
    crowdFilter.frequency.linearRampToValueAtTime(3000, now + 0.6);
    crowdFilter.frequency.linearRampToValueAtTime(1500, now + 4.0);
    crowdFilter.frequency.linearRampToValueAtTime(1200, now + 8.0);
  } else {
    // Mild reaction — slight bump
    crowdGain.gain.cancelScheduledValues(now);
    crowdGain.gain.setValueAtTime(crowdGain.gain.value, now);
    crowdGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    crowdGain.gain.linearRampToValueAtTime(0.05, now + 1.0);
  }
}

// ─── Crack of the Bat ───────────────────────────────────────────────
// Brief square-wave burst + noise spike — bat hits ball

export function playBatCrack() {
  ensureResumed();
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.35, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.07);

  // White noise burst layered underneath
  const bufSize = ctx.sampleRate * 0.1;
  const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    d[i] = (Math.random() * 2 - 1) * Math.max(0, 1 - i / bufSize);
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.20, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  noise.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.09);
}

// ─── Out Tone ────────────────────────────────────────────────────────
// Low descending buzz for any out

export function playOutTone() {
  ensureResumed();
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.32);
}

// ─── Steal Tone ──────────────────────────────────────────────────────
// Two quick ascending chirps — "boop-beep"

export function playStealTone() {
  ensureResumed();
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  [0, 0.12].forEach((delay, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = i === 0 ? 440 : 660;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.10);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + delay);
    osc.stop(now + delay + 0.11);
  });
}

// ─── Walk / HBP Tone ─────────────────────────────────────────────────
// Neutral flat buzz

export function playWalkTone() {
  ensureResumed();
  const ctx = getAudioCtx();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.value = 300;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.20);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.22);
}

// ─── Run Scored ──────────────────────────────────────────────────────
// Four quick ascending tones (touching all 4 bases)

export function playRunScore() {
  ensureResumed();
  const ctx = getAudioCtx();
  const now = ctx.currentTime;
  const freqs = [330, 440, 550, 660];

  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.10, now + i * 0.10);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.10 + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.10);
    osc.stop(now + i * 0.10 + 0.10);
  });
}

// ─── Disk Drive Clack ───────────────────────────────────────────────
// Rhythmic low-frequency clack simulating 1541 disk drive

let diskInterval = null;

export function startDiskClack() {
  stopDiskClack();
  const ctx = getAudioCtx();
  let tick = 0;

  diskInterval = setInterval(() => {
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // Alternating short clacks at ~10Hz (simulates disk head stepping)
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = tick % 2 === 0 ? 60 : 55;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);

    tick++;
  }, 100);
}

export function stopDiskClack() {
  if (diskInterval) {
    clearInterval(diskInterval);
    diskInterval = null;
  }
}

// ─── Hook ───────────────────────────────────────────────────────────
// Monitors gameState for play events and triggers retro audio

export default function useRetroAudio(gameState, enabled) {
  const prevLogIdx = useRef(0);
  const started = useRef(false);

  // Start/stop crowd noise
  useEffect(() => {
    if (enabled && gameState && !started.current) {
      started.current = true;
      startCrowdNoise();
    }
    if ((!enabled || !gameState) && started.current) {
      started.current = false;
      stopCrowdNoise();
    }
    return () => {
      if (started.current) {
        stopCrowdNoise();
        started.current = false;
      }
    };
  }, [enabled, !!gameState]);

  // React to play events
  useEffect(() => {
    if (!enabled || !gameState?.log?.length) {
      prevLogIdx.current = gameState?.log?.length || 0;
      return;
    }

    const log = gameState.log;
    const newEntries = log.slice(prevLogIdx.current);

    // Bat-on-ball: bat actually made contact with the ball
    const batContactTypes = new Set([
      'single', 'double', 'triple', 'homerun',
      'groundout', 'flyout', 'doubleplay', 'popout', 'lineout',
      'sacfly', 'fc', 'offMonster', 'ivyStuck',
      'basketHR', 'shortPorch', 'peskyPole', 'triangle',
    ]);

    // Any kind of out
    const outTypes = new Set([
      'strikeout', 'groundout', 'flyout', 'doubleplay',
      'popout', 'lineout', 'caughtstealing', 'fc',
    ]);

    if (newEntries.length > 0) {
      newEntries.forEach(entry => {
        const t = entry.type;

        // ── Sound effects ──
        if (t === 'foul') {
          playBatCrack(); // foul = bat hit ball
        } else if (batContactTypes.has(t)) {
          playBatCrack();
          if (outTypes.has(t)) {
            // Delay out tone slightly so both are heard
            setTimeout(playOutTone, 180);
          }
        } else if (t === 'strikeout') {
          playOutTone();
        } else if (t === 'steal') {
          playStealTone();
        } else if (t === 'walk') {
          playWalkTone();
        } else if (t === 'caughtstealing') {
          playOutTone();
        }

        // Check for runs scored in the commentary text
        if (entry.text && /\d+\s*(run|RBI)/i.test(entry.text) && batContactTypes.has(t)) {
          setTimeout(playRunScore, 120);
        }

        // ── Crowd reactions ──
        if (t === 'homerun' || t === 'basketHR' || t === 'shortPorch' || t === 'peskyPole') {
          crowdReact('hr');
        } else if (t === 'strikeout' || t === 'doubleplay') {
          crowdReact('strikeout');
        } else if (t === 'error' || t === 'steal') {
          crowdReact('error');
        } else if (t === 'single' || t === 'double' || t === 'triple' || t === 'offMonster' || t === 'ivyStuck' || t === 'triangle') {
          crowdReact('mild');
        } else if (t === 'walk') {
          crowdReact('mild');
        }

        // Walk-off and game over
        if (entry.text && entry.text.includes('Walk-off')) {
          crowdReact('walkoff');
        }
        if (entry.text && entry.text.includes('Game Over') && t === 'info') {
          crowdReact(entry.text.includes('win') ? 'walkoff' : 'hr');
        }
      });

      prevLogIdx.current = log.length;
    }
  }, [gameState?.log, enabled]);
}

export { startCrowdNoise, stopCrowdNoise, crowdReact };