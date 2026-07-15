/**
 * Howler-only audio engine for plaza music, ambience, and SFX.
 *
 * Owns Howl caching, per-instance gain, voice budgets, visibility lifecycle,
 * and safe unload. Gameplay code talks through the local StarAudio-compatible
 * facade while callers migrate to the engine vocabulary.
 *
 * @module components/world/audio/engine/managingWorldPlazaHowlerAudioEngine
 */

import type {
  Manifest,
  SoundHandle,
  StarAudio,
  WorldPlazaAudioEngineEvent,
  WorldPlazaAudioEngineState,
  WorldPlazaAudioGroup,
  WorldPlazaAudioManifestEntry,
  WorldPlazaAudioPlayOptions,
} from '@/components/world/audio/definingWorldPlazaAudioTypes';
import {
  DEFINING_WORLD_PLAZA_AUDIO_ASSET_EVICTION_GRACE_MS,
  DEFINING_WORLD_PLAZA_AUDIO_EVICTION_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_AUDIO_HOWL_POOL_SIZE,
  DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_DESKTOP,
  DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_MOBILE,
  DEFINING_WORLD_PLAZA_AUDIO_STREAM_PATH_FRAGMENTS,
  type DefiningWorldPlazaAudioPerformanceProfile,
} from '@/components/world/audio/engine/definingWorldPlazaAudioEngineConstants';
import { checkingWildlifeTextureEvictionMobileViewport } from '@/components/world/wildlife/domains/resolvingWildlifeTextureEvictionProfile';
import { Howl, Howler } from 'howler';

type ManagingWorldPlazaHowlerCachedAsset = {
  readonly id: string;
  readonly sources: readonly string[];
  readonly group: WorldPlazaAudioGroup;
  readonly isStreamed: boolean;
  readonly howl: Howl;
  loaded: boolean;
  scopeReferenceCount: number;
  activeVoiceCount: number;
  lastUsedAtMs: number;
};

type ManagingWorldPlazaHowlerActiveVoice = {
  readonly engineVoiceId: string;
  readonly asset: ManagingWorldPlazaHowlerCachedAsset;
  readonly soundId: number;
  readonly group: WorldPlazaAudioGroup;
  readonly loop: boolean;
  readonly priority: number;
  readonly startedAtMs: number;
  baseVolume: number;
  pausedByVisibility: boolean;
};

function clampingWorldPlazaAudioVolume(volume: number): number {
  if (!Number.isFinite(volume)) {
    return 1;
  }

  return Math.min(1, Math.max(0, volume));
}

function checkingWorldPlazaAudioManifestEntryIsSourceArray(
  entry: WorldPlazaAudioManifestEntry
): entry is readonly string[] {
  return Array.isArray(entry);
}

function resolvingWorldPlazaAudioManifestEntrySources(
  entry: WorldPlazaAudioManifestEntry
): readonly string[] {
  if (typeof entry === 'string') {
    return [entry];
  }

  if (checkingWorldPlazaAudioManifestEntryIsSourceArray(entry)) {
    return entry;
  }

  const sources = entry.src ?? entry.url;

  if (typeof sources === 'string') {
    return [sources];
  }

  return sources ?? [];
}

function resolvingWorldPlazaAudioManifestEntryGroup(
  entry: WorldPlazaAudioManifestEntry
): WorldPlazaAudioGroup {
  if (
    typeof entry === 'string' ||
    checkingWorldPlazaAudioManifestEntryIsSourceArray(entry) ||
    entry.group === undefined
  ) {
    return 'sfx';
  }

  return entry.group;
}

function checkingWorldPlazaAudioManifestEntryStreams(
  entry: WorldPlazaAudioManifestEntry,
  sources: readonly string[]
): boolean {
  if (
    typeof entry !== 'string' &&
    !checkingWorldPlazaAudioManifestEntryIsSourceArray(entry) &&
    entry.stream !== undefined
  ) {
    return entry.stream;
  }

  if (
    typeof entry !== 'string' &&
    !checkingWorldPlazaAudioManifestEntryIsSourceArray(entry) &&
    entry.group === 'music'
  ) {
    return true;
  }

  return sources.some((source) =>
    DEFINING_WORLD_PLAZA_AUDIO_STREAM_PATH_FRAGMENTS.some((fragment) =>
      source.includes(fragment)
    )
  );
}

function resolvingWorldPlazaAudioPerformanceProfile(): DefiningWorldPlazaAudioPerformanceProfile {
  return checkingWildlifeTextureEvictionMobileViewport()
    ? DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_MOBILE
    : DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_DESKTOP;
}

async function resumingWorldPlazaHowlerContext(): Promise<boolean> {
  if (!Howler.usingWebAudio) {
    return true;
  }

  try {
    if (Howler.ctx.state !== 'running') {
      await Howler.ctx.resume();
    }
  } catch {
    return false;
  }

  return Howler.ctx.state === 'running';
}

function waitingForWorldPlazaHowlLoad(howl: Howl): Promise<void> {
  if (howl.state() === 'loaded') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const handlingLoad = (): void => {
      howl.off('loaderror', handlingLoadError);
      resolve();
    };
    const handlingLoadError = (_soundId: number, error: unknown): void => {
      howl.off('load', handlingLoad);
      reject(
        new Error(
          `Howler failed to load plaza audio: ${
            error instanceof Error ? error.message : String(error)
          }`
        )
      );
    };

    howl.once('load', handlingLoad);
    howl.once('loaderror', handlingLoadError);
    howl.load();
  });
}

export type ManagingWorldPlazaHowlerAudioEngine = StarAudio & {
  checkingManifestKeyIsLoaded: (id: string) => boolean;
  retainingManifestKeys: (ids: readonly string[]) => void;
  releasingManifestKeys: (ids: readonly string[]) => void;
  unloadingManifestKeys: (ids: readonly string[]) => void;
  evictingUnusedAssets: (force?: boolean) => void;
  gettingLoadedAssetCount: () => number;
  gettingActiveSfxVoiceCount: () => number;
};

/**
 * Creates one page-session audio engine. Caller owns singleton lifetime.
 */
export function creatingWorldPlazaHowlerAudioEngine(): ManagingWorldPlazaHowlerAudioEngine {
  const cachedAssets = new Map<string, ManagingWorldPlazaHowlerCachedAsset>();
  const inflightLoads = new Map<string, Promise<void>>();
  const activeVoices = new Map<string, ManagingWorldPlazaHowlerActiveVoice>();
  const eventListeners = new Map<WorldPlazaAudioEngineEvent, Set<() => void>>();
  let engineState: WorldPlazaAudioEngineState = 'locked';
  let stateBeforeVisibilitySuspend: WorldPlazaAudioEngineState = 'locked';
  let nextVoiceSequence = 1;
  let sfxGroupVolume = 1;
  let hiddenEvictionTimeoutId: ReturnType<typeof setTimeout> | null = null;

  const emitting = (event: WorldPlazaAudioEngineEvent): void => {
    eventListeners.get(event)?.forEach((listener) => listener());
  };

  const resolvingVoiceEffectiveVolume = (
    voice: ManagingWorldPlazaHowlerActiveVoice
  ): number =>
    clampingWorldPlazaAudioVolume(
      voice.baseVolume * (voice.group === 'sfx' ? sfxGroupVolume : 1)
    );

  const removingVoice = (engineVoiceId: string): void => {
    const voice = activeVoices.get(engineVoiceId);

    if (!voice) {
      return;
    }

    activeVoices.delete(engineVoiceId);
    voice.asset.activeVoiceCount = Math.max(
      0,
      voice.asset.activeVoiceCount - 1
    );
    voice.asset.lastUsedAtMs = Date.now();
  };

  const stoppingVoice = (voice: ManagingWorldPlazaHowlerActiveVoice): void => {
    voice.asset.howl.stop(voice.soundId);
    removingVoice(voice.engineVoiceId);
  };

  const pruningInactiveVoices = (): void => {
    for (const voice of activeVoices.values()) {
      if (!voice.asset.howl.playing(voice.soundId)) {
        removingVoice(voice.engineVoiceId);
      }
    }
  };

  const freeingVoiceSlot = (
    group: Exclude<WorldPlazaAudioGroup, 'music'>,
    priority: number
  ): boolean => {
    pruningInactiveVoices();
    const profile = resolvingWorldPlazaAudioPerformanceProfile();
    const voiceLimit =
      group === 'ambience'
        ? profile.maxActiveAmbienceVoices
        : profile.maxActiveSfxVoices;
    const groupVoices = [...activeVoices.values()].filter(
      (voice) => voice.group === group
    );

    if (groupVoices.length < voiceLimit) {
      return true;
    }

    const stealableVoices = groupVoices
      .filter((voice) => !voice.loop && voice.priority <= priority)
      .sort(
        (left, right) =>
          left.priority - right.priority ||
          resolvingVoiceEffectiveVolume(left) -
            resolvingVoiceEffectiveVolume(right) ||
          left.startedAtMs - right.startedAtMs
      );
    const victim = stealableVoices[0];

    if (!victim) {
      return false;
    }

    stoppingVoice(victim);
    return true;
  };

  const unloadingAsset = (
    asset: ManagingWorldPlazaHowlerCachedAsset
  ): boolean => {
    if (asset.activeVoiceCount > 0 || asset.scopeReferenceCount > 0) {
      return false;
    }

    asset.howl.unload();
    cachedAssets.delete(asset.id);
    inflightLoads.delete(asset.id);
    return true;
  };

  const evictingUnusedAssets = (force = false): void => {
    pruningInactiveVoices();
    const profile = resolvingWorldPlazaAudioPerformanceProfile();
    const nowMs = Date.now();
    const candidates = [...cachedAssets.values()]
      .filter(
        (asset) =>
          asset.activeVoiceCount === 0 &&
          asset.scopeReferenceCount === 0 &&
          (force ||
            nowMs - asset.lastUsedAtMs >=
              DEFINING_WORLD_PLAZA_AUDIO_ASSET_EVICTION_GRACE_MS)
      )
      .sort((left, right) => left.lastUsedAtMs - right.lastUsedAtMs);
    const bufferedCount = [...cachedAssets.values()].filter(
      (asset) => !asset.isStreamed
    ).length;
    const musicCount = [...cachedAssets.values()].filter(
      (asset) => asset.group === 'music'
    ).length;
    let bufferedOverBudget = Math.max(
      0,
      bufferedCount - profile.maxResidentBufferedAssets
    );
    let musicOverBudget = Math.max(
      0,
      musicCount - profile.maxResidentMusicAssets
    );

    for (const asset of candidates) {
      const shouldUnload =
        force ||
        (asset.group === 'music'
          ? musicOverBudget > 0
          : !asset.isStreamed && bufferedOverBudget > 0);

      if (!shouldUnload || !unloadingAsset(asset)) {
        continue;
      }

      if (asset.group === 'music') {
        musicOverBudget = Math.max(0, musicOverBudget - 1);
      } else if (!asset.isStreamed) {
        bufferedOverBudget = Math.max(0, bufferedOverBudget - 1);
      }
    }
  };

  const loadingManifestEntry = (
    id: string,
    entry: WorldPlazaAudioManifestEntry
  ): Promise<void> => {
    const cached = cachedAssets.get(id);

    if (cached?.loaded) {
      cached.lastUsedAtMs = Date.now();
      return Promise.resolve();
    }

    const inflight = inflightLoads.get(id);

    if (inflight) {
      return inflight;
    }

    const sources = resolvingWorldPlazaAudioManifestEntrySources(entry);

    if (sources.length === 0) {
      return Promise.reject(
        new Error(`Plaza audio manifest entry "${id}" has no source URL.`)
      );
    }

    const group = resolvingWorldPlazaAudioManifestEntryGroup(entry);
    const isStreamed = checkingWorldPlazaAudioManifestEntryStreams(
      entry,
      sources
    );
    // Default 0 so HTML5/WebAudio inherit silence on play(); per-id volume is
    // applied immediately after. Volume 1 here made lava/water ambience blast
    // max for one frame before proximity gain landed.
    const howl = new Howl({
      src: [...sources],
      html5: isStreamed,
      preload: false,
      pool: DEFINING_WORLD_PLAZA_AUDIO_HOWL_POOL_SIZE,
      volume: 0,
    });
    const asset: ManagingWorldPlazaHowlerCachedAsset = {
      id,
      sources,
      group,
      isStreamed,
      howl,
      loaded: false,
      scopeReferenceCount: 0,
      activeVoiceCount: 0,
      lastUsedAtMs: Date.now(),
    };
    cachedAssets.set(id, asset);

    const loadPromise = waitingForWorldPlazaHowlLoad(howl)
      .then(() => {
        asset.loaded = true;
        asset.lastUsedAtMs = Date.now();
        evictingUnusedAssets();
      })
      .catch((error: unknown) => {
        howl.unload();
        cachedAssets.delete(id);
        throw error;
      })
      .finally(() => {
        inflightLoads.delete(id);
      });

    inflightLoads.set(id, loadPromise);
    return loadPromise;
  };

  const playing = (
    id: string,
    options: WorldPlazaAudioPlayOptions = {}
  ): SoundHandle | null => {
    if (engineState !== 'running') {
      return null;
    }

    const asset = cachedAssets.get(id);

    if (!asset?.loaded) {
      return null;
    }

    const group = options.group ?? asset.group;
    const priority = options.priority ?? 0;
    const loop = options.loop ?? false;

    if (group !== 'music' && !freeingVoiceSlot(group, priority)) {
      return null;
    }

    const baseVolume = clampingWorldPlazaAudioVolume(options.volume ?? 1);

    if (baseVolume <= 0) {
      return null;
    }

    const soundId = asset.howl.play();

    if (typeof soundId !== 'number') {
      return null;
    }

    const engineVoiceId = `${id}:${nextVoiceSequence}`;
    nextVoiceSequence += 1;
    const voice: ManagingWorldPlazaHowlerActiveVoice = {
      engineVoiceId,
      asset,
      soundId,
      group,
      loop,
      priority,
      startedAtMs: Date.now(),
      baseVolume,
      pausedByVisibility: false,
    };
    activeVoices.set(engineVoiceId, voice);
    asset.activeVoiceCount += 1;
    asset.lastUsedAtMs = Date.now();
    // Apply gain before loop/rate so streamed ambience never audibly starts at
    // the Howl default (0) without the proximity target.
    asset.howl.volume(resolvingVoiceEffectiveVolume(voice), soundId);

    if (options.rate !== undefined) {
      asset.howl.rate(options.rate, soundId);
    }

    if (loop) {
      asset.howl.loop(true, soundId);
    } else {
      // Looping voices must stay tracked across Howler 'end' ticks (fires each
      // cycle). Only one-shots release the voice slot when the clip finishes.
      asset.howl.once(
        'end',
        () => {
          removingVoice(engineVoiceId);
        },
        soundId
      );
    }

    return {
      id: engineVoiceId,
      soundId,
      get playing(): boolean {
        return asset.howl.playing(soundId);
      },
      stop: (): void => {
        asset.howl.stop(soundId);
        removingVoice(engineVoiceId);
      },
      setVolume: (volume: number): void => {
        voice.baseVolume = clampingWorldPlazaAudioVolume(volume);
        asset.howl.volume(resolvingVoiceEffectiveVolume(voice), soundId);
      },
    };
  };

  const suspendingForVisibility = (): void => {
    if (engineState === 'suspended') {
      return;
    }

    stateBeforeVisibilitySuspend = engineState;
    engineState = 'suspended';

    for (const voice of activeVoices.values()) {
      if (!voice.asset.howl.playing(voice.soundId)) {
        continue;
      }

      voice.asset.howl.pause(voice.soundId);
      voice.pausedByVisibility = true;
    }

    if (Howler.usingWebAudio && Howler.ctx.state === 'running') {
      void Howler.ctx.suspend().catch(() => {
        // Visibility state still gates engine playback if suspension fails.
      });
    }

    emitting('suspended');
    const profile = resolvingWorldPlazaAudioPerformanceProfile();
    hiddenEvictionTimeoutId = globalThis.setTimeout(() => {
      hiddenEvictionTimeoutId = null;
      evictingUnusedAssets(true);
    }, profile.hiddenEvictionDelayMs);
  };

  const resumingVoicesPausedByVisibility = (): void => {
    for (const voice of activeVoices.values()) {
      if (!voice.pausedByVisibility) {
        continue;
      }

      voice.pausedByVisibility = false;
      voice.asset.howl.play(voice.soundId);
    }
  };

  const resumingFromVisibility = (): void => {
    if (engineState !== 'suspended') {
      return;
    }

    if (hiddenEvictionTimeoutId !== null) {
      globalThis.clearTimeout(hiddenEvictionTimeoutId);
      hiddenEvictionTimeoutId = null;
    }

    const resuming = async (): Promise<void> => {
      const didResumeContext = await resumingWorldPlazaHowlerContext();
      engineState =
        stateBeforeVisibilitySuspend === 'locked' || !didResumeContext
          ? 'locked'
          : 'running';

      if (engineState === 'running') {
        resumingVoicesPausedByVisibility();
        emitting('resumed');
      }
    };

    void resuming();
  };

  const handlingVisibilityChange = (): void => {
    if (document.hidden) {
      suspendingForVisibility();
      return;
    }

    resumingFromVisibility();
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', handlingVisibilityChange);
  }
  const evictionIntervalId = globalThis.setInterval(
    () => evictingUnusedAssets(),
    DEFINING_WORLD_PLAZA_AUDIO_EVICTION_INTERVAL_MS
  );

  const engine: ManagingWorldPlazaHowlerAudioEngine = {
    get state(): WorldPlazaAudioEngineState {
      return engineState;
    },
    play: playing,
    preload: async (manifest: Manifest): Promise<void> => {
      await Promise.all(
        Object.entries(manifest).map(([id, entry]) =>
          loadingManifestEntry(id, entry)
        )
      );
    },
    setSfxVolume: (volume: number): void => {
      sfxGroupVolume = clampingWorldPlazaAudioVolume(volume);

      for (const voice of activeVoices.values()) {
        if (voice.group === 'sfx') {
          voice.asset.howl.volume(
            resolvingVoiceEffectiveVolume(voice),
            voice.soundId
          );
        }
      }
    },
    unlock: async (): Promise<void> => {
      if (engineState === 'running') {
        return;
      }

      if (!(await resumingWorldPlazaHowlerContext())) {
        engineState = 'locked';
        return;
      }

      engineState = 'running';
      stateBeforeVisibilitySuspend = 'running';
      resumingVoicesPausedByVisibility();
      emitting('unlocked');
    },
    on: (event: WorldPlazaAudioEngineEvent, listener: () => void): void => {
      const listeners = eventListeners.get(event) ?? new Set<() => void>();
      listeners.add(listener);
      eventListeners.set(event, listeners);
    },
    off: (event: WorldPlazaAudioEngineEvent, listener: () => void): void => {
      eventListeners.get(event)?.delete(listener);
    },
    destroy: (): void => {
      globalThis.clearInterval(evictionIntervalId);

      if (hiddenEvictionTimeoutId !== null) {
        globalThis.clearTimeout(hiddenEvictionTimeoutId);
        hiddenEvictionTimeoutId = null;
      }

      if (typeof document !== 'undefined') {
        document.removeEventListener(
          'visibilitychange',
          handlingVisibilityChange
        );
      }

      for (const voice of activeVoices.values()) {
        voice.asset.howl.stop(voice.soundId);
      }

      activeVoices.clear();

      for (const asset of cachedAssets.values()) {
        asset.howl.unload();
      }

      cachedAssets.clear();
      inflightLoads.clear();
      eventListeners.clear();
      engineState = 'locked';
      Howler.unload();
    },
    checkingManifestKeyIsLoaded: (id: string): boolean =>
      cachedAssets.get(id)?.loaded ?? false,
    retainingManifestKeys: (ids: readonly string[]): void => {
      for (const id of ids) {
        const asset = cachedAssets.get(id);

        if (asset) {
          asset.scopeReferenceCount += 1;
          asset.lastUsedAtMs = Date.now();
        }
      }
    },
    releasingManifestKeys: (ids: readonly string[]): void => {
      for (const id of ids) {
        const asset = cachedAssets.get(id);

        if (asset) {
          asset.scopeReferenceCount = Math.max(
            0,
            asset.scopeReferenceCount - 1
          );
          asset.lastUsedAtMs = Date.now();
        }
      }

      evictingUnusedAssets();
    },
    unloadingManifestKeys: (ids: readonly string[]): void => {
      for (const id of ids) {
        const asset = cachedAssets.get(id);

        if (asset) {
          unloadingAsset(asset);
        }
      }
    },
    evictingUnusedAssets,
    gettingLoadedAssetCount: (): number =>
      [...cachedAssets.values()].filter((asset) => asset.loaded).length,
    gettingActiveSfxVoiceCount: (): number => {
      pruningInactiveVoices();
      return [...activeVoices.values()].filter((voice) => voice.group === 'sfx')
        .length;
    },
  };

  return engine;
}
