/**
 * Exclusive plaza music bus.
 *
 * star-audio's `music.crossfadeTo` orphans prior tracks when a new crossfade
 * starts before the previous fade-out timeout fires. This bus owns BGM via
 * SoundHandles so at most one outgoing + one incoming track exist, and a newer
 * switch hard-stops any prior fade-out.
 *
 * @module components/world/domains/managingWorldPlazaMusicBus
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import { checkingWorldPlazaStarAudioManifestKeyIsPreloaded } from '@/components/world/domains/managingWorldPlazaStarAudio';
import {
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import type { SoundHandle, StarAudio } from 'star-audio';

const DEFINING_WORLD_PLAZA_MUSIC_BUS_FADE_TICK_MS = 50;

/** Minimal star-audio surface the music bus needs. */
export type ManagingWorldPlazaMusicBusStarAudio = Pick<StarAudio, 'play'>;

type ManagingWorldPlazaMusicBusState = {
  activeStarAudioId: string | null;
  activeHandle: SoundHandle | null;
  fadingHandle: SoundHandle | null;
  targetVolume: number;
  fadeIntervalId: ReturnType<typeof setInterval> | null;
};

const managingWorldPlazaMusicBusState: ManagingWorldPlazaMusicBusState = {
  activeStarAudioId: null,
  activeHandle: null,
  fadingHandle: null,
  targetVolume: 0,
  fadeIntervalId: null,
};

function recordingWorldPlazaMusicBusPerformanceGauges(): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  const activeVoiceCount =
    (managingWorldPlazaMusicBusState.activeHandle?.playing ? 1 : 0) +
    (managingWorldPlazaMusicBusState.fadingHandle?.playing ? 1 : 0);

  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_MUSIC_ACTIVE_VOICE_COUNT,
    activeVoiceCount
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_MUSIC_IS_CROSSFADING,
    managingWorldPlazaMusicBusState.fadeIntervalId === null ? 0 : 1
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_MUSIC_TARGET_VOLUME,
    managingWorldPlazaMusicBusState.targetVolume
  );
}

function clearingWorldPlazaMusicBusFadeInterval(): void {
  if (managingWorldPlazaMusicBusState.fadeIntervalId === null) {
    return;
  }

  globalThis.clearInterval(managingWorldPlazaMusicBusState.fadeIntervalId);
  managingWorldPlazaMusicBusState.fadeIntervalId = null;
  recordingWorldPlazaMusicBusPerformanceGauges();
}

function stoppingWorldPlazaMusicBusHandle(handle: SoundHandle | null): void {
  if (!handle) {
    return;
  }

  handle.stop();
}

function applyingWorldPlazaMusicBusHandleVolume(
  handle: SoundHandle | null,
  volume: number
): void {
  if (!handle?.playing) {
    return;
  }

  handle.setVolume(Math.max(0, Math.min(1, volume)));
}

/**
 * Returns the star-audio id of the track the bus currently treats as active.
 */
export function gettingWorldPlazaMusicBusActiveStarAudioId(): string | null {
  return managingWorldPlazaMusicBusState.activeStarAudioId;
}

/**
 * Updates the bus target volume and applies it to the active handle only.
 *
 * Avoids star-audio `setMusicVolume`, which stomps every music Howl (including
 * tracks mid fade-out) back to full group gain.
 */
export function settingWorldPlazaMusicBusTargetVolume(volume: number): void {
  managingWorldPlazaMusicBusState.targetVolume = Math.max(
    0,
    Math.min(1, volume)
  );
  applyingWorldPlazaMusicBusHandleVolume(
    managingWorldPlazaMusicBusState.activeHandle,
    managingWorldPlazaMusicBusState.targetVolume
  );
  recordingWorldPlazaMusicBusPerformanceGauges();
}

export type CrossfadingWorldPlazaMusicBusToOptions = {
  durationSec: number;
  loop?: boolean;
};

/**
 * Crossfades to one music manifest id, hard-stopping any prior fade-out first.
 */
export function crossfadingWorldPlazaMusicBusTo(
  starAudio: ManagingWorldPlazaMusicBusStarAudio,
  starAudioId: string,
  options: CrossfadingWorldPlazaMusicBusToOptions
): void {
  const loop = options.loop ?? true;
  const durationSec = Math.max(0, options.durationSec);
  const targetVolume = managingWorldPlazaMusicBusState.targetVolume;

  if (
    managingWorldPlazaMusicBusState.activeStarAudioId === starAudioId &&
    managingWorldPlazaMusicBusState.activeHandle?.playing
  ) {
    applyingWorldPlazaMusicBusHandleVolume(
      managingWorldPlazaMusicBusState.activeHandle,
      targetVolume
    );
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  clearingWorldPlazaMusicBusFadeInterval();
  stoppingWorldPlazaMusicBusHandle(
    managingWorldPlazaMusicBusState.fadingHandle
  );
  managingWorldPlazaMusicBusState.fadingHandle = null;

  const previousHandle = managingWorldPlazaMusicBusState.activeHandle;

  // Cold music keys: skip starAudio.play so Howler does not warn-spam every
  // biome-music poll while preload is skipped or still in flight.
  if (!checkingWorldPlazaStarAudioManifestKeyIsPreloaded(starAudioId)) {
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  // Play at howl gain 1 so per-instance setVolume is not multiplied by 0.
  const nextHandle = starAudio.play(starAudioId, {
    group: 'music',
    loop,
    volume: 1,
  });

  if (!nextHandle) {
    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_MUSIC_PLAY_FAILURE
    );
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }
  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_MUSIC_SWITCH
  );

  nextHandle.setVolume(0);

  // play() may stomp Howl-wide volume on the new clip only; reassert outgoing.
  applyingWorldPlazaMusicBusHandleVolume(previousHandle, targetVolume);

  managingWorldPlazaMusicBusState.activeHandle = nextHandle;
  managingWorldPlazaMusicBusState.activeStarAudioId = starAudioId;
  managingWorldPlazaMusicBusState.fadingHandle = previousHandle;

  if (durationSec <= 0 || !previousHandle?.playing) {
    stoppingWorldPlazaMusicBusHandle(previousHandle);
    managingWorldPlazaMusicBusState.fadingHandle = null;
    nextHandle.setVolume(targetVolume);
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  const durationMs = durationSec * 1000;
  const startedAt = performance.now();
  const startOutVolume = targetVolume;

  managingWorldPlazaMusicBusState.fadeIntervalId = globalThis.setInterval(
    () => {
      const progress = Math.min(
        1,
        (performance.now() - startedAt) / durationMs
      );

      applyingWorldPlazaMusicBusHandleVolume(
        previousHandle,
        startOutVolume * (1 - progress)
      );
      applyingWorldPlazaMusicBusHandleVolume(
        nextHandle,
        targetVolume * progress
      );

      if (progress < 1) {
        recordingWorldPlazaMusicBusPerformanceGauges();
        return;
      }

      clearingWorldPlazaMusicBusFadeInterval();
      stoppingWorldPlazaMusicBusHandle(previousHandle);

      if (managingWorldPlazaMusicBusState.fadingHandle === previousHandle) {
        managingWorldPlazaMusicBusState.fadingHandle = null;
      }

      applyingWorldPlazaMusicBusHandleVolume(nextHandle, targetVolume);
      recordingWorldPlazaMusicBusPerformanceGauges();
    },
    DEFINING_WORLD_PLAZA_MUSIC_BUS_FADE_TICK_MS
  );
  recordingWorldPlazaMusicBusPerformanceGauges();
}

/**
 * Fades out and clears the active music track.
 */
export function stoppingWorldPlazaMusicBus(fadeSec = 0): void {
  clearingWorldPlazaMusicBusFadeInterval();
  stoppingWorldPlazaMusicBusHandle(
    managingWorldPlazaMusicBusState.fadingHandle
  );
  managingWorldPlazaMusicBusState.fadingHandle = null;

  const activeHandle = managingWorldPlazaMusicBusState.activeHandle;

  if (!activeHandle) {
    managingWorldPlazaMusicBusState.activeStarAudioId = null;
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  const durationSec = Math.max(0, fadeSec);

  if (durationSec <= 0 || !activeHandle.playing) {
    stoppingWorldPlazaMusicBusHandle(activeHandle);
    managingWorldPlazaMusicBusState.activeHandle = null;
    managingWorldPlazaMusicBusState.activeStarAudioId = null;
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  const durationMs = durationSec * 1000;
  const startedAt = performance.now();
  const startVolume = managingWorldPlazaMusicBusState.targetVolume;

  managingWorldPlazaMusicBusState.fadeIntervalId = globalThis.setInterval(
    () => {
      const progress = Math.min(
        1,
        (performance.now() - startedAt) / durationMs
      );

      applyingWorldPlazaMusicBusHandleVolume(
        activeHandle,
        startVolume * (1 - progress)
      );

      if (progress < 1) {
        recordingWorldPlazaMusicBusPerformanceGauges();
        return;
      }

      clearingWorldPlazaMusicBusFadeInterval();
      stoppingWorldPlazaMusicBusHandle(activeHandle);

      if (managingWorldPlazaMusicBusState.activeHandle === activeHandle) {
        managingWorldPlazaMusicBusState.activeHandle = null;
        managingWorldPlazaMusicBusState.activeStarAudioId = null;
      }
      recordingWorldPlazaMusicBusPerformanceGauges();
    },
    DEFINING_WORLD_PLAZA_MUSIC_BUS_FADE_TICK_MS
  );
  recordingWorldPlazaMusicBusPerformanceGauges();
}
