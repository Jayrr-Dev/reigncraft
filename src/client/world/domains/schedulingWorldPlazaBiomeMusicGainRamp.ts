import { computingWorldPlazaBiomeMusicEffectiveTargetVolume } from '@/components/world/domains/computingWorldPlazaBiomeMusicEffectiveTargetVolume';

export type SchedulingWorldPlazaBiomeMusicGainRampPlayback = {
  cancel: () => void;
};

/**
 * Fades one gain node to the current effective biome music target volume.
 */
export function schedulingWorldPlazaBiomeMusicGainFadeIn(
  audioContext: AudioContext,
  gainNode: GainNode,
  fromGain: number,
  durationMs: number,
  onComplete?: () => void
): SchedulingWorldPlazaBiomeMusicGainRampPlayback {
  const durationSec = durationMs / 1000;
  const audioNow = audioContext.currentTime;
  const targetGain = computingWorldPlazaBiomeMusicEffectiveTargetVolume();

  gainNode.gain.cancelScheduledValues(audioNow);
  gainNode.gain.setValueAtTime(fromGain, audioNow);
  gainNode.gain.linearRampToValueAtTime(targetGain, audioNow + durationSec);

  const timeoutId = window.setTimeout(() => {
    onComplete?.();
  }, durationMs + 32);

  return {
    cancel: () => {
      window.clearTimeout(timeoutId);
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    },
  };
}

/**
 * Crossfades outgoing and incoming biome music gain nodes on the audio clock.
 */
export function schedulingWorldPlazaBiomeMusicGainCrossfade(
  audioContext: AudioContext,
  outgoingGainNode: GainNode,
  incomingGainNode: GainNode,
  outgoingFromGain: number,
  durationMs: number,
  onComplete?: () => void
): SchedulingWorldPlazaBiomeMusicGainRampPlayback {
  const durationSec = durationMs / 1000;
  const audioNow = audioContext.currentTime;
  const incomingTargetGain =
    computingWorldPlazaBiomeMusicEffectiveTargetVolume();

  outgoingGainNode.gain.cancelScheduledValues(audioNow);
  incomingGainNode.gain.cancelScheduledValues(audioNow);
  outgoingGainNode.gain.setValueAtTime(outgoingFromGain, audioNow);
  incomingGainNode.gain.setValueAtTime(0, audioNow);
  outgoingGainNode.gain.linearRampToValueAtTime(0, audioNow + durationSec);
  incomingGainNode.gain.linearRampToValueAtTime(
    incomingTargetGain,
    audioNow + durationSec
  );

  const timeoutId = window.setTimeout(() => {
    onComplete?.();
  }, durationMs + 32);

  return {
    cancel: () => {
      window.clearTimeout(timeoutId);
      const cancelAt = audioContext.currentTime;
      outgoingGainNode.gain.cancelScheduledValues(cancelAt);
      incomingGainNode.gain.cancelScheduledValues(cancelAt);
    },
  };
}
