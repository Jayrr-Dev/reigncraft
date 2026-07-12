/**
 * Shared Howler audio engine for every plaza SFX and music hook.
 *
 * This compatibility facade preserves existing hook APIs while the engine
 * owns Howl caching, loading, voices, visibility, and eviction.
 *
 * @module components/world/domains/managingWorldPlazaStarAudio
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { creatingWorldPlazaHowlerAudioEngine } from '@/components/world/audio/engine/managingWorldPlazaHowlerAudioEngine';
import type { ManagingWorldPlazaHowlerAudioEngine } from '@/components/world/audio/engine/managingWorldPlazaHowlerAudioEngine';
import type {
  Manifest,
  SoundHandle,
  StarAudio,
} from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_DESKTOP,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_MOBILE,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_DESKTOP,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_MOBILE,
} from '@/components/world/domains/definingWorldPlazaWorldBootStarAudioConstants';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  beginningWorldPlazaPerformanceSample,
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  incrementingWorldPlazaPerformanceDiagnosticsCounter,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
let managingWorldPlazaStarAudioInstance: ManagingWorldPlazaHowlerAudioEngine | null =
  null;
let managingWorldPlazaStarAudioAcquireCount = 0;
let managingWorldPlazaStarAudioPageUnloadHookRegistered = false;
let managingWorldPlazaStarAudioLastSfxGroupVolume = Number.NaN;
let managingWorldPlazaStarAudioNextGaugeRecordAtMs = 0;
const MANAGING_WORLD_PLAZA_STAR_AUDIO_GAUGE_RECORD_INTERVAL_MS = 250;
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
/** Global Howler decode semaphore shared by every concurrent hook preload. */
let activeWorldPlazaStarAudioPreloadCount = 0;
const pendingWorldPlazaStarAudioPreloadStarters: (() => void)[] = [];

type ManagingWorldPlazaStarAudioActiveSfxPlay = {
  id: string;
  handle: SoundHandle;
  volume: number;
};

/**
 * Active one-shots tracked for spatial gain updates and diagnostics.
 */
const managingWorldPlazaStarAudioActiveSfxPlays: ManagingWorldPlazaStarAudioActiveSfxPlay[] =
  [];

function recordingWorldPlazaStarAudioPerformanceGauges(force = false): void {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return;
  }

  const nowMs = performance.now();

  if (!force && nowMs < managingWorldPlazaStarAudioNextGaugeRecordAtMs) {
    return;
  }

  managingWorldPlazaStarAudioNextGaugeRecordAtMs =
    nowMs + MANAGING_WORLD_PLAZA_STAR_AUDIO_GAUGE_RECORD_INTERVAL_MS;

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
    activeWorldPlazaStarAudioPreloadCount
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
 * Compatibility reassertion. Direct Howler playback already uses sound ids,
 * but callers may still request a full active-volume synchronization.
 */
function reassertingWorldPlazaStarAudioActiveSfxVolumesForId(
  id: string,
  newestHandle: SoundHandle
): void {
  for (const activePlay of managingWorldPlazaStarAudioActiveSfxPlays) {
    if (activePlay.id !== id || activePlay.handle === newestHandle) {
      continue;
    }

    activePlay.handle.setVolume(activePlay.volume);
  }
}

/**
 * Re-applies tracked per-instance volumes after Howler group-volume stomps.
 */
export function reassertingWorldPlazaStarAudioActiveSfxVolumes(): void {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX
    )
  ) {
    return;
  }

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
 * Returns true when this manifest key finished Howler preload on the shared
 * instance. Used to avoid `starAudio.play` warn spam for keys still cold
 * (debug skip-preload, or race before warm completes).
 */
export function checkingWorldPlazaStarAudioManifestKeyIsPreloaded(
  manifestKey: string
): boolean {
  return preloadedWorldPlazaStarAudioManifestKeys.has(manifestKey);
}

/**
 * Plays an SFX clip with stable per-instance volume.
 *
 * Direct Howler playback applies volume by sound id, so simultaneous instances
 * of the same clip retain independent spatial gain.
 */
export function playingWorldPlazaStarAudioSfx(
  id: string,
  options: PlayingWorldPlazaStarAudioSfxOptions
): SoundHandle | null {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX
    )
  ) {
    return null;
  }

  const finishSample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AUDIO_SFX_PLAY
  );
  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_SFX_PLAY_REQUEST
  );

  // Cold keys: skip starAudio.play. Howler logs a long warn per miss, and
  // ambience/music poll loops would spam the console every tick.
  if (!checkingWorldPlazaStarAudioManifestKeyIsPreloaded(id)) {
    recordingWorldPlazaStarAudioPerformanceGauges();
    finishSample();
    return null;
  }

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

  pruningWorldPlazaStarAudioInactiveSfxPlays();
  managingWorldPlazaStarAudioActiveSfxPlays.push({
    id,
    handle,
    volume: options.volume,
  });
  reassertingWorldPlazaStarAudioActiveSfxVolumesForId(id, handle);

  // Duration remains a facade feature; stop long source files at the cap.
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
  const clampedVolume = Math.max(0, Math.min(1, volume));

  if (managingWorldPlazaStarAudioLastSfxGroupVolume === clampedVolume) {
    return;
  }

  const starAudio = ensuringWorldPlazaStarAudioInstance();
  starAudio.setSfxVolume(clampedVolume);
  managingWorldPlazaStarAudioLastSfxGroupVolume = clampedVolume;
  reassertingWorldPlazaStarAudioActiveSfxVolumes();
}

function destroyingWorldPlazaStarAudioInstance(): void {
  managingWorldPlazaStarAudioInstance?.destroy();
  managingWorldPlazaStarAudioInstance = null;
  managingWorldPlazaStarAudioAcquireCount = 0;
  managingWorldPlazaStarAudioLastSfxGroupVolume = Number.NaN;
  managingWorldPlazaStarAudioNextGaugeRecordAtMs = 0;
  preloadedWorldPlazaStarAudioManifestKeys.clear();
  inflightWorldPlazaStarAudioManifestKeyLoads.clear();
  warmingWorldPlazaStarAudioAssetFetchesByUrl.clear();
  activeWorldPlazaStarAudioPreloadCount = 0;
  pendingWorldPlazaStarAudioPreloadStarters.length = 0;
  activeWorldPlazaStarAudioWarmFetchCount = 0;
  pendingWorldPlazaStarAudioWarmFetchStarters.length = 0;
  managingWorldPlazaStarAudioActiveSfxPlays.length = 0;
  recordingWorldPlazaStarAudioPerformanceGauges(true);
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

function resolvingWorldPlazaStarAudioWarmFetchConcurrency(): number {
  if (checkingWildlifeTextureEvictionMobileViewport()) {
    return DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_MOBILE;
  }

  return DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_DESKTOP;
}

/** Semaphore state for warm fetches (see warm fetch concurrency constants). */
let activeWorldPlazaStarAudioWarmFetchCount = 0;
const pendingWorldPlazaStarAudioWarmFetchStarters: (() => void)[] = [];

async function acquiringWorldPlazaStarAudioWarmFetchSlot(): Promise<void> {
  if (
    activeWorldPlazaStarAudioWarmFetchCount <
    resolvingWorldPlazaStarAudioWarmFetchConcurrency()
  ) {
    activeWorldPlazaStarAudioWarmFetchCount += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    pendingWorldPlazaStarAudioWarmFetchStarters.push(resolve);
  });
}

function releasingWorldPlazaStarAudioWarmFetchSlot(): void {
  const startNextWarmFetch =
    pendingWorldPlazaStarAudioWarmFetchStarters.shift();

  if (startNextWarmFetch) {
    // Hand the slot to the next waiter without dropping the active count.
    startNextWarmFetch();
    return;
  }

  activeWorldPlazaStarAudioWarmFetchCount = Math.max(
    0,
    activeWorldPlazaStarAudioWarmFetchCount - 1
  );
}

/**
 * Consumes a response body in streaming chunks that are discarded as read.
 *
 * The full body must be consumed for the file to land in the HTTP cache, but
 * buffering it (`arrayBuffer()`) holds every audio file in JS memory at once
 * during boot, which spikes heap and GC on mobile.
 */
async function drainingWorldPlazaStarAudioWarmFetchBody(
  response: Response
): Promise<void> {
  const bodyReader = response.body?.getReader();

  if (!bodyReader) {
    await response.arrayBuffer();
    return;
  }

  let isBodyDone = false;

  while (!isBodyDone) {
    const chunkResult = await bodyReader.read();
    isBodyDone = chunkResult.done;
  }
}

/**
 * Warms the HTTP cache for pending manifest entries ahead of Howler loads.
 *
 * Howler html5 loads are capped (2 on mobile) so the WebMediaPlayer pool
 * cannot stall, which serializes the network wait to ~2 files at a time.
 * Plain fetches consume no media players, so files download ahead of the
 * Howler workers and each Howl load resolves from disk cache in a few ms.
 * Warm fetches are themselves capped so a large manifest cannot saturate
 * mobile bandwidth or memory while gameplay is running.
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
        (async () => {
          await acquiringWorldPlazaStarAudioWarmFetchSlot();

          try {
            const response = await fetch(assetUrl, {
              priority: 'low',
              credentials: 'same-origin',
            });
            await drainingWorldPlazaStarAudioWarmFetchBody(response);
          } catch {
            // Howler retries over the network when its own load starts.
          } finally {
            releasingWorldPlazaStarAudioWarmFetchSlot();
          }
        })()
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
 * Yields one animation frame so deferred Howler decode cannot monopolize the
 * main thread across back-to-back preload keys.
 */
function yieldingWorldPlazaStarAudioPreloadToNextFrame(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
}

async function acquiringWorldPlazaStarAudioPreloadSlot(): Promise<void> {
  if (
    activeWorldPlazaStarAudioPreloadCount <
    resolvingWorldPlazaStarAudioPreloadConcurrency()
  ) {
    activeWorldPlazaStarAudioPreloadCount += 1;
    return;
  }

  await new Promise<void>((resolve) => {
    pendingWorldPlazaStarAudioPreloadStarters.push(resolve);
  });
}

function releasingWorldPlazaStarAudioPreloadSlot(): void {
  const startNextPreload = pendingWorldPlazaStarAudioPreloadStarters.shift();

  if (startNextPreload) {
    startNextPreload();
    return;
  }

  activeWorldPlazaStarAudioPreloadCount = Math.max(
    0,
    activeWorldPlazaStarAudioPreloadCount - 1
  );
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

  incrementingWorldPlazaPerformanceDiagnosticsCounter(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_COUNTER.AUDIO_PRELOAD_REQUEST
  );
  const loadPromise = (async () => {
    await acquiringWorldPlazaStarAudioPreloadSlot();

    // Sample only decode work after the semaphore, not queue wait time.
    const finishSample = beginningWorldPlazaPerformanceSample(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.AUDIO_PRELOAD
    );

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
      releasingWorldPlazaStarAudioPreloadSlot();
      inflightWorldPlazaStarAudioManifestKeyLoads.delete(manifestKey);
      recordingWorldPlazaStarAudioPerformanceGauges();
      finishSample();
      // Yield so plaza ticks / Pixi can run between Howler decodes.
      await yieldingWorldPlazaStarAudioPreloadToNextFrame();
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

function ensuringWorldPlazaStarAudioInstance(): ManagingWorldPlazaHowlerAudioEngine {
  if (!managingWorldPlazaStarAudioInstance) {
    managingWorldPlazaStarAudioInstance = creatingWorldPlazaHowlerAudioEngine();
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
 * The shared instance stays alive for the page session so React StrictMode
 * remounts cannot tear down Howls still shared by another hook.
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
  // Boot-only skip lives in `preloadingWorldPlazaWorldBootStarAudio`. This
  // runtime path must still warm keys — play() refuses cold ids, so a global
  // skip here left music/SFX permanently silent after `?skipAudioPreload=1`.

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

/**
 * Retains every manifest key for a lifecycle scope after ensuring it is loaded.
 */
export async function retainingWorldPlazaAudioManifest(
  manifest: Manifest
): Promise<void> {
  await preloadingWorldPlazaStarAudioManifest(manifest);
  ensuringWorldPlazaStarAudioInstance().retainingManifestKeys(
    Object.keys(manifest)
  );
}

/**
 * Releases lifecycle ownership. Active voices still protect their assets.
 */
export function releasingWorldPlazaAudioManifest(manifest: Manifest): void {
  ensuringWorldPlazaStarAudioInstance().releasingManifestKeys(
    Object.keys(manifest)
  );
}

/**
 * Unloads unreferenced, inactive manifest keys immediately.
 */
export function unloadingWorldPlazaAudioManifestKeys(
  manifestKeys: readonly string[]
): void {
  ensuringWorldPlazaStarAudioInstance().unloadingManifestKeys(manifestKeys);

  for (const manifestKey of manifestKeys) {
    if (
      !ensuringWorldPlazaStarAudioInstance().checkingManifestKeyIsLoaded(
        manifestKey
      )
    ) {
      preloadedWorldPlazaStarAudioManifestKeys.delete(manifestKey);
    }
  }

  recordingWorldPlazaStarAudioPerformanceGauges(true);
}

/** Runs budget-based LRU eviction for unreferenced assets. */
export function evictingWorldPlazaUnusedAudioAssets(force = false): void {
  ensuringWorldPlazaStarAudioInstance().evictingUnusedAssets(force);

  for (const manifestKey of preloadedWorldPlazaStarAudioManifestKeys) {
    if (
      !ensuringWorldPlazaStarAudioInstance().checkingManifestKeyIsLoaded(
        manifestKey
      )
    ) {
      preloadedWorldPlazaStarAudioManifestKeys.delete(manifestKey);
    }
  }

  recordingWorldPlazaStarAudioPerformanceGauges(true);
}
