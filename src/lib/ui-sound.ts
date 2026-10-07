"use client";

export type UiSoundKind = "tap" | "success" | "chain" | "boss" | "reward" | "undo";

let sharedContext: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  if (!sharedContext) sharedContext = new AudioContext();
  return sharedContext;
}

function tone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  gainValue: number,
  type: OscillatorType = "sine",
  endFrequency?: number
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, start + duration);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function noiseClick(context: AudioContext, start: number, duration: number, gainValue: number) {
  const length = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    const envelope = 1 - index / length;
    channel[index] = (Math.random() * 2 - 1) * envelope;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  filter.type = "highpass";
  filter.frequency.value = 1800;
  gain.gain.setValueAtTime(gainValue, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  source.start(start);
}

export function playUiSound(kind: UiSoundKind, enabled: boolean) {
  if (!enabled) return;
  const context = getContext();
  if (!context) return;

  try {
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime + 0.01;

    if (kind === "tap") {
      tone(context, 520, now, 0.055, 0.025, "triangle", 430);
      return;
    }

    if (kind === "undo") {
      tone(context, 420, now, 0.075, 0.024, "sine", 330);
      return;
    }

    if (kind === "success") {
      tone(context, 660, now, 0.11, 0.035, "sine");
      tone(context, 880, now + 0.075, 0.15, 0.032, "sine");
      return;
    }

    if (kind === "chain") {
      noiseClick(context, now, 0.07, 0.025);
      tone(context, 1260, now, 0.095, 0.028, "triangle", 930);
      tone(context, 1780, now + 0.022, 0.12, 0.018, "sine", 1180);
      return;
    }

    if (kind === "boss") {
      noiseClick(context, now, 0.08, 0.018);
      tone(context, 392, now, 0.18, 0.032, "triangle");
      tone(context, 523.25, now + 0.08, 0.19, 0.034, "triangle");
      tone(context, 783.99, now + 0.17, 0.28, 0.036, "sine");
      return;
    }

    tone(context, 659.25, now, 0.12, 0.028, "sine");
    tone(context, 987.77, now + 0.07, 0.14, 0.03, "sine");
    tone(context, 1318.51, now + 0.145, 0.25, 0.028, "sine");
  } catch {
    // Audio feedback is optional; interaction must never fail if the browser blocks audio.
  }
}
