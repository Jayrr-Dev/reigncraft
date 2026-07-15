/**
 * Fishing cast and catch SFX from `public/fishing/sfx/`.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingSfxConstants
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/** Public URL prefix for shipped fishing clips. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_ASSET_BASE_URL =
  '/fishing/sfx' as const;

export type DefiningWorldPlazaFishingSfxClipId =
  | 'cast_whoosh'
  | 'junk_splash'
  | 'reel_winding';

export type DefiningWorldPlazaFishingSfxPlaybackProfile = {
  readonly clipId?: DefiningWorldPlazaFishingSfxClipId;
  /** When set, plays a preloaded clip outside the fishing manifest (e.g. chest reward). */
  readonly starAudioId?: string;
  readonly peakVolume: number;
  readonly durationSec: number;
  readonly fadeOutMs: number;
};

/** Base reward volume by catch rarity before the SFX slider. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_CATCH_REWARD_TARGET_VOLUME_BY_RARITY: Record<
  DefiningWorldPlazaInventoryItemRarity,
  number
> = {
  basic: 0.14,
  common: 0.17,
  uncommon: 0.2,
  rare: 0.24,
  epic: 0.28,
  mythic: 0.32,
  legendary: 0.36,
  godly: 0.4,
};

/** Soft cast whoosh: short tail with fade. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_CAST_START_PROFILE: DefiningWorldPlazaFishingSfxPlaybackProfile =
  {
    clipId: 'cast_whoosh',
    peakVolume: 0.12,
    durationSec: 0.42,
    fadeOutMs: 120,
  };

/** Junk splash: quieter than fish reward. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_JUNK_CATCH_PROFILE: DefiningWorldPlazaFishingSfxPlaybackProfile =
  {
    clipId: 'junk_splash',
    peakVolume: 0.09,
    durationSec: 0.38,
    fadeOutMs: 100,
  };

/** Active cast reel click. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_REEL_PROFILE: DefiningWorldPlazaFishingSfxPlaybackProfile =
  {
    clipId: 'reel_winding',
    peakVolume: 0.1,
    durationSec: 0.32,
    fadeOutMs: 90,
  };

/** Chest reward clip (`chest_open`): peak volume from catch rarity. */
export const DEFINING_WORLD_PLAZA_FISHING_SFX_CREATURE_CATCH_PROFILE: Omit<
  DefiningWorldPlazaFishingSfxPlaybackProfile,
  'peakVolume'
> = {
  durationSec: 0.55,
  fadeOutMs: 120,
};
