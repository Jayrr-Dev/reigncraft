/**
 * Runtime budgets for the Howler-only plaza audio engine.
 *
 * @module components/world/audio/engine/definingWorldPlazaAudioEngineConstants
 */

export type DefiningWorldPlazaAudioPerformanceProfile = {
  readonly maxActiveSfxVoices: number;
  readonly maxActiveAmbienceVoices: number;
  readonly maxResidentBufferedAssets: number;
  readonly maxResidentMusicAssets: number;
  readonly hiddenEvictionDelayMs: number;
};

export const DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_MOBILE: DefiningWorldPlazaAudioPerformanceProfile =
  {
    maxActiveSfxVoices: 20,
    maxActiveAmbienceVoices: 6,
    maxResidentBufferedAssets: 40,
    maxResidentMusicAssets: 2,
    hiddenEvictionDelayMs: 30_000,
  };

export const DEFINING_WORLD_PLAZA_AUDIO_PERFORMANCE_PROFILE_DESKTOP: DefiningWorldPlazaAudioPerformanceProfile =
  {
    maxActiveSfxVoices: 40,
    maxActiveAmbienceVoices: 10,
    maxResidentBufferedAssets: 120,
    maxResidentMusicAssets: 2,
    hiddenEvictionDelayMs: 30_000,
  };

/** Inactive Howler sound nodes retained per asset for fast replay. */
export const DEFINING_WORLD_PLAZA_AUDIO_HOWL_POOL_SIZE = 8;

/** Grace before an unreferenced loaded asset becomes an LRU candidate. */
export const DEFINING_WORLD_PLAZA_AUDIO_ASSET_EVICTION_GRACE_MS = 30_000;

/** Low-frequency cache maintenance; never runs on the gameplay tick. */
export const DEFINING_WORLD_PLAZA_AUDIO_EVICTION_INTERVAL_MS = 5_000;

/** Long clips use HTML5 streaming instead of decoded Web Audio buffers. */
export const DEFINING_WORLD_PLAZA_AUDIO_STREAM_PATH_FRAGMENTS = [
  '/environment/music/',
  '/environment/ambience/',
  '/fire/sfx/',
] as const;
