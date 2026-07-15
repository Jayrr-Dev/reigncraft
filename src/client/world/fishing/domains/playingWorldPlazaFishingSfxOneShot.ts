/**
 * Soft short fishing one-shots with a quick fade-out tail.
 *
 * @module components/world/fishing/domains/playingWorldPlazaFishingSfxOneShot
 */

import type { SoundHandle } from '@/components/world/audio/definingWorldPlazaAudioTypes';
import { playingWorldPlazaStarAudioSfx } from '@/components/world/domains/managingWorldPlazaStarAudio';
import type { DefiningWorldPlazaFishingSfxPlaybackProfile } from '@/components/world/fishing/domains/definingWorldPlazaFishingSfxConstants';
import { resolvingWorldPlazaFishingSfxStarAudioId } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingSfxStarAudioId';

const DEFINING_WORLD_PLAZA_FISHING_SFX_FADE_STEPS = 6;

function fadingWorldPlazaFishingSfxHandle(
  handle: SoundHandle,
  peakVolume: number,
  fadeOutMs: number
): void {
  const stepMs = Math.max(16, Math.round(fadeOutMs / DEFINING_WORLD_PLAZA_FISHING_SFX_FADE_STEPS));
  let step = 0;

  const intervalId = globalThis.setInterval(() => {
    step += 1;
    const remainingRatio = 1 - step / DEFINING_WORLD_PLAZA_FISHING_SFX_FADE_STEPS;
    handle.setVolume(Math.max(0, peakVolume * remainingRatio));

    if (step >= DEFINING_WORLD_PLAZA_FISHING_SFX_FADE_STEPS) {
      globalThis.clearInterval(intervalId);
      handle.stop();
    }
  }, stepMs);
}

/**
 * Plays one fishing clip at peak volume, trims to duration, and fades the tail.
 */
export function playingWorldPlazaFishingSfxOneShot(
  profile: DefiningWorldPlazaFishingSfxPlaybackProfile
): void {
  const peakVolume = profile.peakVolume;

  if (peakVolume <= 0) {
    return;
  }

  const manifestKey =
    profile.starAudioId ??
    (profile.clipId
      ? resolvingWorldPlazaFishingSfxStarAudioId(profile.clipId)
      : null);

  if (!manifestKey) {
    return;
  }

  const handle = playingWorldPlazaStarAudioSfx(manifestKey, { volume: peakVolume });

  if (!handle) {
    return;
  }

  const fadeStartMs = Math.max(
    0,
    profile.durationSec * 1000 - profile.fadeOutMs
  );

  globalThis.setTimeout(() => {
    if (!handle.playing) {
      return;
    }

    fadingWorldPlazaFishingSfxHandle(handle, peakVolume, profile.fadeOutMs);
  }, fadeStartMs);

  globalThis.setTimeout(() => {
    if (handle.playing) {
      handle.stop();
    }
  }, profile.durationSec * 1000 + profile.fadeOutMs + 40);
}
