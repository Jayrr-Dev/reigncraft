import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Cozy Tunes v1.5.3 biome background music catalog.
 *
 * Assets live under `public/Cozy Tunes v1.5.3/Cozy Tunes/Audio/ogg/`.
 *
 * @module components/world/domains/definingWorldPlazaBiomeMusicConstants
 */

/** Public URL prefix for Cozy Tunes OGG files. */
export const DEFINING_WORLD_PLAZA_COZY_TUNES_ASSET_BASE_URL =
  '/Cozy Tunes v1.5.3/Cozy Tunes/Audio/ogg' as const;

/** Stable ids for each bundled Cozy Tunes track. */
export type DefiningWorldPlazaCozyTuneId =
  | 'chickens_in_the_meadow'
  | 'cuddle_clouds'
  | 'drifting_memories'
  | 'evening_harmony'
  | 'floating_dream'
  | 'forgotten_biomes'
  | 'gentle_breeze'
  | 'golden_gleam'
  | 'pineapple_under_the_sea'
  | 'polar_lights'
  | 'sheep'
  | 'strange_worlds'
  | 'sunlight_through_leaves'
  | 'wanderers_tale'
  | 'what_clouds_are_made_of'
  | 'whispering_woods'
  | 'wildflowers_by_the_river'
  | 'wind_over_the_trees';

/** One Cozy Tunes track entry. */
export type DefiningWorldPlazaCozyTuneDefinition = {
  /** Stable tune id. */
  id: DefiningWorldPlazaCozyTuneId;
  /** OGG filename on disk (may contain spaces). */
  fileName: string;
};

/** Every Cozy Tunes track shipped in the plaza public folder. */
export const DEFINING_WORLD_PLAZA_COZY_TUNES_CATALOG: Record<
  DefiningWorldPlazaCozyTuneId,
  DefiningWorldPlazaCozyTuneDefinition
> = {
  chickens_in_the_meadow: {
    id: 'chickens_in_the_meadow',
    fileName: 'Chickens In The Meadow.ogg',
  },
  cuddle_clouds: {
    id: 'cuddle_clouds',
    fileName: 'Cuddle Clouds.ogg',
  },
  drifting_memories: {
    id: 'drifting_memories',
    fileName: 'Drifting Memories.ogg',
  },
  evening_harmony: {
    id: 'evening_harmony',
    fileName: 'Evening Harmony.ogg',
  },
  floating_dream: {
    id: 'floating_dream',
    fileName: 'Floating Dream.ogg',
  },
  forgotten_biomes: {
    id: 'forgotten_biomes',
    fileName: 'Forgotten Biomes.ogg',
  },
  gentle_breeze: {
    id: 'gentle_breeze',
    fileName: 'Gentle Breeze.ogg',
  },
  golden_gleam: {
    id: 'golden_gleam',
    fileName: 'Golden Gleam.ogg',
  },
  pineapple_under_the_sea: {
    id: 'pineapple_under_the_sea',
    fileName: 'Pineapple Under The Sea.ogg',
  },
  polar_lights: {
    id: 'polar_lights',
    fileName: 'Polar Lights.ogg',
  },
  sheep: {
    id: 'sheep',
    fileName: 'Sheep.ogg',
  },
  strange_worlds: {
    id: 'strange_worlds',
    fileName: 'Strange Worlds.ogg',
  },
  sunlight_through_leaves: {
    id: 'sunlight_through_leaves',
    fileName: 'Sunlight Through Leaves.ogg',
  },
  wanderers_tale: {
    id: 'wanderers_tale',
    fileName: "Wanderer's Tale.ogg",
  },
  what_clouds_are_made_of: {
    id: 'what_clouds_are_made_of',
    fileName: 'What Clouds Are Made Of.ogg',
  },
  whispering_woods: {
    id: 'whispering_woods',
    fileName: 'Whispering Woods.ogg',
  },
  wildflowers_by_the_river: {
    id: 'wildflowers_by_the_river',
    fileName: 'Wildflowers By The River.ogg',
  },
  wind_over_the_trees: {
    id: 'wind_over_the_trees',
    fileName: 'Wind Over The Trees.ogg',
  },
};

/**
 * Primary Cozy Tunes track per biome, chosen by thematic name fit.
 */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_BY_KIND: Record<
  DefiningWorldPlazaBiomeKind,
  DefiningWorldPlazaCozyTuneId
> = {
  plains: 'chickens_in_the_meadow',
  forest: 'sunlight_through_leaves',
  flower_forest: 'wildflowers_by_the_river',
  jungle: 'wind_over_the_trees',
  desert: 'golden_gleam',
  snowy_plains: 'polar_lights',
  swamp: 'drifting_memories',
  savanna: 'sheep',
  badlands: 'forgotten_biomes',
  beach: 'gentle_breeze',
  ocean: 'pineapple_under_the_sea',
  rocky: 'strange_worlds',
  firelands: 'forgotten_biomes',
};

/**
 * Optional night-only tracks that replace the daytime pick for a biome.
 */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_NIGHT_OVERRIDES: Partial<
  Record<DefiningWorldPlazaBiomeKind, DefiningWorldPlazaCozyTuneId>
> = {
  forest: 'whispering_woods',
  jungle: 'whispering_woods',
};

/** How often biome music checks the player's current biome (ms). */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_POLL_INTERVAL_MS = 750;

/** Target loop volume once playback is unlocked. */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_TARGET_VOLUME = 0.38;

/** Crossfade duration when switching biome tracks (ms). */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_CROSSFADE_MS = 1400;

/** DOM events that unlock biome music playback on mobile browsers. */
export const DEFINING_WORLD_PLAZA_BIOME_MUSIC_UNLOCK_EVENTS = [
  'pointerdown',
  'touchstart',
  'keydown',
] as const;
