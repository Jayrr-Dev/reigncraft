import { computingWorldPlazaBiomeMusicSlotTargetGain } from '@/components/world/domains/computingWorldPlazaBiomeMusicSlotTargetGain';
import { gettingWorldPlazaMasterVolume } from '@/components/world/domains/managingWorldPlazaMasterVolumeStore';

const DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_CURVE_SAMPLES = 64;

export type SchedulingWorldPlazaBiomeMusicGainRampPlayback = {
  cancel: () => void;
};

function buildingWorldPlazaBiomeMusicEqualPowerCrossfadeCurves(
  outgoingFromGain: number,
  incomingTargetGain: number
): {
  outgoingCurve: Float32Array;
  incomingCurve: Float32Array;
} {
  const sampleCount = DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_CURVE_SAMPLES;
  const outgoingCurve = new Float32Array(sampleCount);
  const incomingCurve = new Float32Array(sampleCount);

  for (let sampleIndex = 0; sampleIndex < sampleCount; sampleIndex += 1) {
    const progress = sampleCount === 1 ? 1 : sampleIndex / (sampleCount - 1);
    const fadeOutGain = Math.cos(progress * Math.PI * 0.5);
    const fadeInGain = Math.sin(progress * Math.PI * 0.5);

    outgoingCurve[sampleIndex] = outgoingFromGain * fadeOutGain;
    incomingCurve[sampleIndex] = incomingTargetGain * fadeInGain;
  }

  return { outgoingCurve, incomingCurve };
}

/**
 * Applies the master volume slider to the shared output bus.
 */
export function applyingWorldPlazaBiomeMusicMasterGain(
  audioContext: AudioContext,
  masterGainNode: GainNode
): void {
  const audioNow = audioContext.currentTime;
  masterGainNode.gain.cancelScheduledValues(audioNow);
  masterGainNode.gain.setValueAtTime(
    Math.min(1, Math.max(0, gettingWorldPlazaMasterVolume())),
    audioNow
  );
}

/**
 * Fades one slot gain node to the biome music slot target.
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
  const targetGain = computingWorldPlazaBiomeMusicSlotTargetGain();

  gainNode.gain.cancelScheduledValues(audioNow);
  gainNode.gain.setValueAtTime(fromGain, audioNow);
  gainNode.gain.linearRampToValueAtTime(targetGain, audioNow + durationSec);

  const timeoutId = window.setTimeout(() => {
    onComplete?.();
  }, durationMs + 48);

  return {
    cancel: () => {
      window.clearTimeout(timeoutId);
      gainNode.gain.cancelScheduledValues(audioContext.currentTime);
    },
  };
}

/**
 * Crossfades outgoing and incoming biome music gain nodes with an equal-power curve.
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
  const incomingTargetGain = computingWorldPlazaBiomeMusicSlotTargetGain();
  const { outgoingCurve, incomingCurve } =
    buildingWorldPlazaBiomeMusicEqualPowerCrossfadeCurves(
      outgoingFromGain,
      incomingTargetGain
    );

  outgoingGainNode.gain.cancelScheduledValues(audioNow);
  incomingGainNode.gain.cancelScheduledValues(audioNow);
  outgoingGainNode.gain.setValueAtTime(outgoingFromGain, audioNow);
  incomingGainNode.gain.setValueAtTime(0, audioNow);
  outgoingGainNode.gain.setValueCurveAtTime(
    outgoingCurve,
    audioNow,
    durationSec
  );
  incomingGainNode.gain.setValueCurveAtTime(
    incomingCurve,
    audioNow,
    durationSec
  );

  const timeoutId = window.setTimeout(() => {
    onComplete?.();
  }, durationMs + 48);

  return {
    cancel: () => {
      window.clearTimeout(timeoutId);
      const cancelAt = audioContext.currentTime;
      outgoingGainNode.gain.cancelScheduledValues(cancelAt);
      incomingGainNode.gain.cancelScheduledValues(cancelAt);
    },
  };
}
