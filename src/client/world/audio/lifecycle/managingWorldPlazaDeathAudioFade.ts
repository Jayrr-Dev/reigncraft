/**
 * Fades Howler global volume on player death / respawn.
 *
 * Uses Howler.volume so music, ambience, and SFX all duck together without
 * touching the persisted music slider preference.
 *
 * @module components/world/audio/lifecycle/managingWorldPlazaDeathAudioFade
 */

import {
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_IN_MS,
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS,
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_TICK_MS,
  DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME,
} from '@/components/world/audio/lifecycle/definingWorldPlazaDeathAudioFadeConstants';
import { Howler } from 'howler';

type ManagingWorldPlazaDeathAudioFadeState = {
  fadeIntervalId: ReturnType<typeof setInterval> | null;
  currentVolume: number;
};

const managingWorldPlazaDeathAudioFadeState: ManagingWorldPlazaDeathAudioFadeState =
  {
    fadeIntervalId: null,
    currentVolume: DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME,
  };

function clampingWorldPlazaDeathAudioVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME;
  }

  return Math.min(1, Math.max(0, volume));
}

function clearingWorldPlazaDeathAudioFadeInterval(): void {
  if (managingWorldPlazaDeathAudioFadeState.fadeIntervalId === null) {
    return;
  }

  globalThis.clearInterval(
    managingWorldPlazaDeathAudioFadeState.fadeIntervalId
  );
  managingWorldPlazaDeathAudioFadeState.fadeIntervalId = null;
}

function applyingWorldPlazaDeathAudioHowlerVolume(volume: number): void {
  const clampedVolume = clampingWorldPlazaDeathAudioVolume(volume);
  managingWorldPlazaDeathAudioFadeState.currentVolume = clampedVolume;
  Howler.volume(clampedVolume);
}

function fadingWorldPlazaDeathAudioTo(
  targetVolume: number,
  durationMs: number
): void {
  clearingWorldPlazaDeathAudioFadeInterval();

  const startVolume = managingWorldPlazaDeathAudioFadeState.currentVolume;
  const clampedTarget = clampingWorldPlazaDeathAudioVolume(targetVolume);

  if (durationMs <= 0 || startVolume === clampedTarget) {
    applyingWorldPlazaDeathAudioHowlerVolume(clampedTarget);
    return;
  }

  const startedAtMs = Date.now();

  managingWorldPlazaDeathAudioFadeState.fadeIntervalId = globalThis.setInterval(
    () => {
      const elapsedMs = Date.now() - startedAtMs;
      const progress = Math.min(1, elapsedMs / durationMs);
      const nextVolume = startVolume + (clampedTarget - startVolume) * progress;

      applyingWorldPlazaDeathAudioHowlerVolume(nextVolume);

      if (progress >= 1) {
        clearingWorldPlazaDeathAudioFadeInterval();
      }
    },
    DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_TICK_MS
  );
}

/**
 * Fades every Howler voice to silence when the death screen starts.
 */
export function fadingWorldPlazaAudioOutOnPlayerDeath(): void {
  fadingWorldPlazaDeathAudioTo(0, DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS);
}

/**
 * Fades Howler global volume back in after Remake / Origin.
 */
export function fadingWorldPlazaAudioInOnPlayerRespawn(): void {
  fadingWorldPlazaDeathAudioTo(
    DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME,
    DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_IN_MS
  );
}

/**
 * Snaps Howler volume back to full and cancels any in-flight death fade.
 * Used when leaving the world session so title / loading music is not muted.
 */
export function restoringWorldPlazaAudioVolumeAfterDeath(): void {
  clearingWorldPlazaDeathAudioFadeInterval();
  applyingWorldPlazaDeathAudioHowlerVolume(
    DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME
  );
}
