/**
 * Shared star-audio instance for every plaza SFX and music hook.
 *
 * One Howler pool keeps Chrome from exhausting WebMediaPlayers in the
 * Devvit iframe. Manifest keys preload once and are reused by every hook.
 *
 * @module components/world/domains/managingWorldPlazaStarAudio
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_DESKTOP,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_MOBILE,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioConstants';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
import {
  createStarAudio,
  type Manifest,
  type SoundHandle,
  type StarAudio,
} from 'star-audio';

let managingWorldPlazaStarAudioInstance: StarAudio | null = null;
let managingWorldPlazaStarAudioAcquireCount = 0;
let managingWorldPlazaStarAudioPageUnloadHookRegistered = false;
const preloadedWorldPlazaStarAudioManifestKeys = new Set<string>();
/** In-flight per-key loads so home + boot + loading music share one Howl. */
const inflightWorldPlazaStarAudioManifestKeyLoads = new Map<
  string,
  Promise<void>
>();
/** Asset URLs fetch-warmed into the HTTP cache this session, by warm promise. */
const warmingWorldPlazaStarAudioAssetFetchesByUrl = new Map<
  string,
  Promise<void>
>();

type ManagingWorldPlazaStarAudioActiveSfxPlay = {
  handle: SoundHandle;
  volume: number;
};

/**
 * Active one-shots that need per-instance volume restored after star-audio
 * stomps Howler group volume on each `play()` / `setSfxVolume()`.
 */
const managingWorldPlazaStarAudioActiveSfxPlays: ManagingWorldPlazaStarAudioActiveSfxPlay[] =
  [];

function recordingWorldPlazaStarAudioPerformanceGauges(): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_ACTIVE_SFX_COUNT,
    managingWorldPlazaStarAudioActiveSfxPlays.length
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_PRELOADED_ASSET_COUNT,
    preloadedWorldPlazaStarAudioManifestKeys.size
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_INFLIGHT_LOAD_COUNT,
    inflightWorldPlazaStarAudioManifestKeyLoads.size
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_CONSUMER_COUNT,
    managingWorldPlazaStarAudioAcquireCount
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_IS_LOCKED,
    managingWorldPlazaStarAudioInstance?.state === 'locked' ? 1 : 0
  );
}

function pruningWorldPlazaStarAudioInactiveSfxPlays(): void {
  for (
    let index = managingWorldPlazaStarAudioActiveSfxPlays.length - 1;
    index >= 0;
    index -= 1
  ) {
    if (!managingWorldPlazaStarAudioActiveSfxPlays[index]?.handle.playing) {
      managingWorldPlazaStarAudioActiveSfxPlays.splice(index, 1);
    }
  }
}

/**
 * Re-applies tracked per-instance volumes after Howler group-volume stomps.
 */
export function reassertingWorldPlazaStarAudioActiveSfxVolumes(): void {
  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AUDIO_SFX_VOLUME_SYNC
  );
  pruningWorldPlazaStarAudioInactiveSfxPlays();

  for (const activePlay of managingWorldPlazaStarAudioActiveSfxPlays) {
    activePlay.handle.setVolume(activePlay.volume);
  }
  recordingWorldPlazaStarAudioPerformanceGauges();
  finishSample();
}

export type PlayingWorldPlazaStarAudioSfxOptions = {
  volume: number;
  rate?: number;
  duration?: number;
  loop?: boolean;
};

/**
 * Plays an SFX clip with stable per-instance volume.
 *
 * star-audio calls `howl.volume(v)` (no sound id) before `play()`, and Howler
 * applies that to every active instance of the clip. Without reassertion, a
 * nearby animal vocal can make a distant one of the same clip jump to full
 * volume mid-playback.
 */
export function playingWorldPlazaStarAudioSfx(
  id: string,
  options: PlayingWorldPlazaStarAudioSfxOptions
): SoundHandle | null {
  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AUDIO_SFX_PLAY
  );
  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_SFX_PLAY_REQUEST
  );
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  const handle = starAudio.play(id, {
    group: 'sfx',
    volume: options.volume,
    ...(options.rate !== undefined ? { rate: options.rate } : {}),
    ...(options.loop !== undefined ? { loop: options.loop } : {}),
  });

  if (!handle) {
    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_SFX_PLAY_FAILURE
    );
    recordingWorldPlazaStarAudioPerformanceGauges();
    finishSample();
    return null;
  }

  managingWorldPlazaStarAudioActiveSfxPlays.push({
    handle,
    volume: options.volume,
  });
  reassertingWorldPlazaStarAudioActiveSfxVolumes();

  // star-audio's play() ignores `duration`; stop the instance ourselves so long
  // source files (or shared Howl assets) cannot keep emitting past the cap.
  if (
    options.duration !== undefined &&
    options.duration > 0 &&
    typeof window !== 'undefined'
  ) {
    window.setTimeout(() => {
      if (handle.playing) {
        handle.stop();
      }
      pruningWorldPlazaStarAudioInactiveSfxPlays();
      recordingWorldPlazaStarAudioPerformanceGauges();
    }, options.duration * 1000);
  }

  recordingWorldPlazaStarAudioPerformanceGauges();
  finishSample();
  return handle;
}

/**
 * Updates the tracked volume for one active play and applies it to the handle.
 *
 * Use while a long one-shot is still playing so distance falloff can follow
 * the listener / source after the initial `play()` volume.
 */
export function updatingWorldPlazaStarAudioActiveSfxPlayVolume(
  handle: SoundHandle,
  volume: number
): void {
  if (checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    pruningWorldPlazaStarAudioInactiveSfxPlays();
  }

  const clampedVolume = Math.max(0, Math.min(1, volume));
  const activePlay = managingWorldPlazaStarAudioActiveSfxPlays.find(
    (play) => play.handle === handle
  );

  if (activePlay) {
    activePlay.volume = clampedVolume;
  }

  handle.setVolume(clampedVolume);
  recordingWorldPlazaStarAudioPerformanceGauges();
}

/**
 * Sets the shared SFX group gain, then restores tracked per-instance volumes.
 */
export function settingWorldPlazaStarAudioSfxGroupVolume(volume: number): void {
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  starAudio.setSfxVolume(volume);
  reassertingWorldPlazaStarAudioActiveSfxVolumes();
}

function destroyingWorldPlazaStarAudioInstance(): void {
  managingWorldPlazaStarAudioInstance?.destroy();
  managingWorldPlazaStarAudioInstance = null;
  managingWorldPlazaStarAudioAcquireCount = 0;
  preloadedWorldPlazaStarAudioManifestKeys.clear();
  inflightWorldPlazaStarAudioManifestKeyLoads.clear();
  warmingWorldPlazaStarAudioAssetFetchesByUrl.clear();
  managingWorldPlazaStarAudioActiveSfxPlays.length = 0;
  recordingWorldPlazaStarAudioPerformanceGauges();
}

/**
 * Extracts fetchable asset URLs from one manifest entry.
 *
 * Procedural entries (synth presets / definitions) have no URL. Plain strings
 * are only treated as URLs when they contain a path separator, so preset
 * names like `'coin'` are never fetched.
 */
function resolvingWorldPlazaStarAudioManifestEntryUrls(
  manifestEntry: Manifest[string]
): readonly string[] {
  if (typeof manifestEntry === 'string') {
    return manifestEntry.includes('/') ? [manifestEntry] : [];
  }

  if (Array.isArray(manifestEntry)) {
    return manifestEntry.filter((source) => source.includes('/'));
  }

  if (typeof manifestEntry === 'object' && manifestEntry !== null) {
    if ('src' in manifestEntry || 'url' in manifestEntry) {
      const sources = manifestEntry.src ?? manifestEntry.url;

      if (typeof sources === 'string') {
        return sources.includes('/') ? [sources] : [];
      }

      if (Array.isArray(sources)) {
        return sources.filter((source) => source.includes('/'));
      }
    }
  }

  return [];
}

/**
 * Warms the HTTP cache for pending manifest entries with parallel fetches.
 *
 * Howler html5 loads are capped (2 on mobile) so the WebMediaPlayer pool
 * cannot stall, which serializes the network wait to ~2 files at a time.
 * Plain fetches consume no media players, so all pending files download in
 * parallel and each later Howl load resolves from disk cache in a few ms
 * instead of a full network round trip.
 */
function warmingWorldPlazaStarAudioAssetFetches(
  pendingEntries: readonly (readonly [string, Manifest[string]])[]
): void {
  if (typeof window === 'undefined' || typeof fetch !== 'function') {
    return;
  }

  for (const [, manifestEntry] of pendingEntries) {
    for (const assetUrl of resolvingWorldPlazaStarAudioManifestEntryUrls(
      manifestEntry
    )) {
      if (warmingWorldPlazaStarAudioAssetFetchesByUrl.has(assetUrl)) {
        continue;
      }

      warmingWorldPlazaStarAudioAssetFetchesByUrl.set(
        assetUrl,
        fetch(assetUrl, {
          priority: 'low',
          credentials: 'same-origin',
        })
          .then((response) => {
            // Drain the body so the full file lands in the HTTP cache.
            return response.arrayBuffer().then(() => undefined);
          })
          .catch(() => {
            // Howler retries over the network when its own load starts.
          })
      );
    }
  }
}

/**
 * Resolves when every warm fetch for the entry's URLs has settled, so the
 * Howl load that follows does not race its own duplicate network request.
 */
function awaitingWorldPlazaStarAudioAssetWarmFetches(
  manifestEntry: Manifest[string]
): Promise<void> {
  const warmPromises = resolvingWorldPlazaStarAudioManifestEntryUrls(
    manifestEntry
  )
    .map((assetUrl) =>
      warmingWorldPlazaStarAudioAssetFetchesByUrl.get(assetUrl)
    )
    .filter((warmPromise) => warmPromise !== undefined);

  if (warmPromises.length === 0) {
    return Promise.resolve();
  }

  return Promise.all(warmPromises).then(() => undefined);
}

function resolvingWorldPlazaStarAudioPreloadConcurrency(): number {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_MOBILE;
  }

  return DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_DESKTOP;
}

/**
 * Loads one manifest key, sharing any in-flight promise for the same id.
 */
function preloadingWorldPlazaStarAudioManifestKey(
  manifestKey: string,
  manifestEntry: Manifest[string]
): Promise<void> {
  if (preloadedWorldPlazaStarAudioManifestKeys.has(manifestKey)) {
    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_PRELOAD_CACHE_HIT
    );
    return Promise.resolve();
  }

  const inflightLoad =
    inflightWorldPlazaStarAudioManifestKeyLoads.get(manifestKey);

  if (inflightLoad) {
    incrementingWorldPlazaPerformanceDiagnosticsCounter(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_PRELOAD_INFLIGHT_HIT
    );
    return inflightLoad;
  }

  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AUDIO_PRELOAD
  );
  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_PRELOAD_REQUEST
  );
  const loadPromise = (async () => {
    try {
      await awaitingWorldPlazaStarAudioAssetWarmFetches(manifestEntry);
      const starAudio = ensuringWorldPlazaStarAudioInstance();
      await starAudio.preload({ [manifestKey]: manifestEntry });
      preloadedWorldPlazaStarAudioManifestKeys.add(manifestKey);
    } catch {
      incrementingWorldPlazaPerformanceDiagnosticsCounter(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_PRELOAD_FAILURE
      );
      // Runtime hooks retry when their components mount.
    } finally {
      inflightWorldPlazaStarAudioManifestKeyLoads.delete(manifestKey);
      recordingWorldPlazaStarAudioPerformanceGauges();
      finishSample();
    }
  })();

  inflightWorldPlazaStarAudioManifestKeyLoads.set(manifestKey, loadPromise);
  recordingWorldPlazaStarAudioPerformanceGauges();
  return loadPromise;
}

function registeringWorldPlazaStarAudioPageUnloadHook(): void {
  if (
    managingWorldPlazaStarAudioPageUnloadHookRegistered ||
    typeof window === 'undefined'
  ) {
    return;
  }

  managingWorldPlazaStarAudioPageUnloadHookRegistered = true;
  window.addEventListener('pagehide', destroyingWorldPlazaStarAudioInstance);
}

function ensuringWorldPlazaStarAudioInstance(): StarAudio {
  if (!managingWorldPlazaStarAudioInstance) {
    managingWorldPlazaStarAudioInstance = createStarAudio({
      unlockWith: 'auto',
      suspendOnHidden: true,
    });
    registeringWorldPlazaStarAudioPageUnloadHook();
  }

  return managingWorldPlazaStarAudioInstance;
}

/** Returns the shared plaza star-audio instance, creating it when needed. */
export function acquiringWorldPlazaStarAudio(): StarAudio {
  managingWorldPlazaStarAudioAcquireCount += 1;
  const starAudio = ensuringWorldPlazaStarAudioInstance();
  recordingWorldPlazaStarAudioPerformanceGauges();
  return starAudio;
}

/**
 * Releases one plaza star-audio consumer.
 *
 * The shared instance stays alive for the page session. star-audio warms 17
 * procedural presets as blob URLs on init; destroying during React StrictMode
 * remounts revokes those URLs while Howler is still loading them, which spams
 * `ERR_FILE_NOT_FOUND` in the Devvit iframe. Teardown runs on `pagehide`.
 */
export function releasingWorldPlazaStarAudio(): void {
  managingWorldPlazaStarAudioAcquireCount = Math.max(
    0,
    managingWorldPlazaStarAudioAcquireCount - 1
  );
  recordingWorldPlazaStarAudioPerformanceGauges();
}

/**
 * Preloads manifest entries that are not already warmed on the shared instance.
 *
 * Concurrent callers for the same key share one Howl load (home title music,
 * loading-screen biome music, and the boot audio step all hit the same plains
 * track). Mobile caps parallel key decode so the HTML5 Audio pool cannot stall
 * with neither `onload` nor `onloaderror`.
 */
export async function preloadingWorldPlazaStarAudioManifest(
  manifest: Manifest
): Promise<void> {
  // Include in-flight keys so concurrent callers (home title + boot + loading
  // music) await the shared Howl instead of spawning a second one.
  const pendingEntries = Object.entries(manifest).filter(
    ([manifestKey]) =>
      !preloadedWorldPlazaStarAudioManifestKeys.has(manifestKey) ||
      inflightWorldPlazaStarAudioManifestKeyLoads.has(manifestKey)
  );

  if (pendingEntries.length === 0) {
    return;
  }

  // Download everything in parallel up front; the capped Howler workers below
  // then load from HTTP cache instead of waiting on the network one by one.
  warmingWorldPlazaStarAudioAssetFetches(pendingEntries);

  // Ensure the shared instance exists before workers start.
  ensuringWorldPlazaStarAudioInstance();

  const concurrency = Math.min(
    resolvingWorldPlazaStarAudioPreloadConcurrency(),
    pendingEntries.length
  );
  let nextEntryIndex = 0;

  async function preloadingNextManifestKeyWorker(): Promise<void> {
    while (nextEntryIndex < pendingEntries.length) {
      const entryIndex = nextEntryIndex;
      nextEntryIndex += 1;
      const pendingEntry = pendingEntries[entryIndex];

      if (!pendingEntry) {
        continue;
      }

      const [manifestKey, manifestEntry] = pendingEntry;
      await preloadingWorldPlazaStarAudioManifestKey(
        manifestKey,
        manifestEntry
      );
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => preloadingNextManifestKeyWorker())
  );
}
