import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * Plaza biome ambience loops (FilmCow, TomMusic, NOX Iceland Flows, and Butterfly).
 *
 * @module components/world/domains/definingWorldPlazaBiomeAmbienceConstants
 */

/** Public URL prefix for shipped FilmCow ambience loops. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_FILMCOW_ASSET_BASE_URL =
  '/environment/ambience/filmcow-ambience' as const;

/** Public URL prefix for TomMusic BGS loops. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TOMMUSIC_ASSET_BASE_URL =
  '/environment/ambience/tommusic-ambience' as const;

/** Public URL prefix for NOX Iceland Flows loops. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_NOX_FLOWS_ASSET_BASE_URL =
  '/environment/ambience/nox-flows-ambience' as const;

/** Public URL prefix for Butterfly looped ambience beds. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BUTTERFLY_ASSET_BASE_URL =
  '/environment/ambience/butterfly-ambience' as const;

/** Asset folder for one ambience clip. */
export type DefiningWorldPlazaBiomeAmbienceClipAssetPack =
  | 'filmcow'
  | 'tommusic'
  | 'nox'
  | 'butterfly';

/** Stable ids for each bundled ambience loop. */
export type DefiningWorldPlazaBiomeAmbienceClipId =
  | 'air_conditioner'
  | 'beach'
  | 'car_sedan_idling'
  | 'dripping_water_1'
  | 'dripping_water_2'
  | 'motorcycle_speeding_off'
  | 'pool_and_pump'
  | 'river_moderate'
  | 'sea'
  | 'small_motor_water_1'
  | 'small_motor_water_2'
  | 'stream_light'
  | 'swamp'
  | 'winter_storm'
  | 'woods_near_suburbs';

/** One ambience loop entry. */
export type DefiningWorldPlazaBiomeAmbienceClipDefinition = {
  /** Stable clip id. */
  id: DefiningWorldPlazaBiomeAmbienceClipId;
  /** OGG filename on disk. */
  fileName: string;
  /** Asset folder; defaults to FilmCow when omitted. */
  assetPack?: DefiningWorldPlazaBiomeAmbienceClipAssetPack;
};

/** Every ambience loop shipped in the plaza public folder. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG: Record<
  DefiningWorldPlazaBiomeAmbienceClipId,
  DefiningWorldPlazaBiomeAmbienceClipDefinition
> = {
  air_conditioner: {
    id: 'air_conditioner',
    fileName: 'air-conditioner.ogg',
  },
  beach: {
    id: 'beach',
    fileName: 'beach.ogg',
    assetPack: 'tommusic',
  },
  car_sedan_idling: {
    id: 'car_sedan_idling',
    fileName: 'car-sedan-idling.ogg',
  },
  dripping_water_1: {
    id: 'dripping_water_1',
    fileName: 'dripping-water-1.ogg',
  },
  dripping_water_2: {
    id: 'dripping_water_2',
    fileName: 'dripping-water-2.ogg',
  },
  motorcycle_speeding_off: {
    id: 'motorcycle_speeding_off',
    fileName: 'motorcycle-speeding-off.ogg',
  },
  pool_and_pump: {
    id: 'pool_and_pump',
    fileName: 'pool-and-pump.ogg',
  },
  river_moderate: {
    id: 'river_moderate',
    fileName: 'river-moderate.ogg',
    assetPack: 'nox',
  },
  sea: {
    id: 'sea',
    fileName: 'sea.ogg',
    assetPack: 'tommusic',
  },
  small_motor_water_1: {
    id: 'small_motor_water_1',
    fileName: 'small-motor-water-1.ogg',
  },
  small_motor_water_2: {
    id: 'small_motor_water_2',
    fileName: 'small-motor-water-2.ogg',
  },
  stream_light: {
    id: 'stream_light',
    fileName: 'stream-light-01.ogg',
    assetPack: 'nox',
  },
  swamp: {
    id: 'swamp',
    fileName: 'swamp.ogg',
  },
  winter_storm: {
    id: 'winter_storm',
    fileName: 'winter-storm.ogg',
    assetPack: 'butterfly',
  },
  woods_near_suburbs: {
    id: 'woods_near_suburbs',
    fileName: 'woods-near-suburbs.ogg',
  },
};

/**
 * Primary ambience loop per biome, chosen by thematic fit.
 *
 * Biomes omitted here stay silent until more loops are added.
 * Procedural stream/river proximity can override these while nearby.
 */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_BY_KIND: Partial<
  Record<DefiningWorldPlazaBiomeKind, DefiningWorldPlazaBiomeAmbienceClipId>
> = {
  plains: 'woods_near_suburbs',
  forest: 'woods_near_suburbs',
  flower_forest: 'woods_near_suburbs',
  jungle: 'dripping_water_2',
  desert: 'air_conditioner',
  swamp: 'swamp',
  savanna: 'car_sedan_idling',
  badlands: 'motorcycle_speeding_off',
  beach: 'beach',
  ocean: 'sea',
  rocky: 'dripping_water_1',
  firelands: 'small_motor_water_1',
  snowy_plains: 'winter_storm',
  frostsink: 'winter_storm',
};

/** Tile scan radius when searching for nearby stream or river water. */
export const DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_SCAN_RADIUS_TILES = 10;

/** Grid distance where stream/river ambience is inaudible. */
export const DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_MAX_AUDIBLE_DISTANCE_GRID = 10;

/** Grid distance where stream/river ambience plays at full target volume. */
export const DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_FULL_VOLUME_DISTANCE_GRID = 1.5;

/** Target loop volume for flowing-water proximity beds before falloff. */
export const DEFINING_WORLD_PLAZA_FLOWING_WATER_AMBIENCE_TARGET_VOLUME = 0.32;

/** How often biome ambience checks the player's current biome (ms). */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_POLL_INTERVAL_MS = 750;

/** Target loop volume for biome beds once playback is unlocked. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME = 0.28;
