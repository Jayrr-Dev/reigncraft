/**
 * Exclusive plaza music bus.
 *
 * Owns BGM via SoundHandles so at most one outgoing and one incoming track
 * exist. Mid-fade retargets coalesce instead of restarting the blend.
 *
 * @module components/world/domains/managingWorldPlazaMusicBus
 */

import type {
  SoundHandle,
  StarAudio,
} from '@/components/world/audio/definingWorldPlazaAudioTypes';
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

const DEFINING_WORLD_PLAZA_MUSIC_BUS_FADE_TICK_MS = 50;

/** Minimal shared-audio surface the music bus needs. */
export type ManagingWorldPlazaMusicBusStarAudio = Pick<StarAudio, 'play'>;

export type CrossfadingWorldPlazaMusicBusToOptions = {
  durationSec: number;
  loop?: boolean;
};

type ManagingWorldPlazaMusicBusPendingCrossfade = {
  starAudio: ManagingWorldPlazaMusicBusStarAudio;
  starAudioId: string;
  options: CrossfadingWorldPlazaMusicBusToOptions;
};

type ManagingWorldPlazaMusicBusState = {
  activeStarAudioId: string | null;
  activeHandle: SoundHandle | null;
  fadingHandle: SoundHandle | null;
  targetVolume: number;
  fadeIntervalId: ReturnType<typeof setInterval> | null;
  /** Latest requested track while a crossfade is already running. */
  pendingCrossfade: ManagingWorldPlazaMusicBusPendingCrossfade | null;
};

const managingWorldPlazaMusicBusState: ManagingWorldPlazaMusicBusState = {
  activeStarAudioId: null,
  activeHandle: null,
  fadingHandle: null,
  targetVolume: 0,
  fadeIntervalId: null,
  pendingCrossfade: null,
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
 * Returns the audio manifest id the bus currently treats as active.
 */
export function gettingWorldPlazaMusicBusActiveStarAudioId(): string | null {
  return managingWorldPlazaMusicBusState.activeStarAudioId;
}

/**
 * Updates the bus target volume and applies it to the active handle only.
 *
 * Applies target volume by sound id so a fading track keeps independent gain.
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

function clearingWorldPlazaMusicBusPendingCrossfade(): void {
  managingWorldPlazaMusicBusState.pendingCrossfade = null;
}

function applyingWorldPlazaMusicBusPendingCrossfade(): void {
  const pending = managingWorldPlazaMusicBusState.pendingCrossfade;

  if (!pending) {
    return;
  }

  clearingWorldPlazaMusicBusPendingCrossfade();
  crossfadingWorldPlazaMusicBusTo(
    pending.starAudio,
    pending.starAudioId,
    pending.options
  );
}

/**
 * Crossfades to one music manifest id.
 *
 * Mid-fade retargets (day/night scrub, rapid biome edges) coalesce to the
 * latest id instead of hard-stopping the outgoing fade. That stops two music
 * Howls fighting while Howler also keeps decoding boot preloads.
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
    clearingWorldPlazaMusicBusPendingCrossfade();
    applyingWorldPlazaMusicBusHandleVolume(
      managingWorldPlazaMusicBusState.activeHandle,
      targetVolume
    );
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  // Already fading toward something else: keep the current blend intact and
  // remember only the newest desired track for after this fade finishes.
  if (managingWorldPlazaMusicBusState.fadeIntervalId !== null) {
    managingWorldPlazaMusicBusState.pendingCrossfade = {
      starAudio,
      starAudioId,
      options: {
        durationSec,
        loop,
      },
    };
    recordingWorldPlazaMusicBusPerformanceGauges();
    return;
  }

  clearingWorldPlazaMusicBusPendingCrossfade();
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
    applyingWorldPlazaMusicBusPendingCrossfade();
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
      applyingWorldPlazaMusicBusPendingCrossfade();
    },
    DEFINING_WORLD_PLAZA_MUSIC_BUS_FADE_TICK_MS
  );
  recordingWorldPlazaMusicBusPerformanceGauges();
}

/**
 * Fades out and clears the active music track.
 */
export function stoppingWorldPlazaMusicBus(fadeSec = 0): void {
  clearingWorldPlazaMusicBusPendingCrossfade();
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
