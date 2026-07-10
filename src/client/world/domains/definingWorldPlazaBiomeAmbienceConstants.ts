import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';

/**
 * FilmCow Recorded SFX biome ambience loops.
 *
 * Assets live under `public/sfx/filmcow-ambience/`.
 *
 * @module components/world/domains/definingWorldPlazaBiomeAmbienceConstants
 */

/** Public URL prefix for shipped FilmCow ambience loops. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_ASSET_BASE_URL =
  '/sfx/filmcow-ambience' as const;

/** Stable ids for each bundled FilmCow ambience loop. */
export type DefiningWorldPlazaBiomeAmbienceClipId =
  | 'air_conditioner'
  | 'car_sedan_idling'
  | 'dripping_water_1'
  | 'dripping_water_2'
  | 'motorcycle_speeding_off'
  | 'pool_and_pump'
  | 'small_motor_water_1'
  | 'small_motor_water_2'
  | 'swamp'
  | 'woods_near_suburbs';

/** One FilmCow ambience loop entry. */
export type DefiningWorldPlazaBiomeAmbienceClipDefinition = {
  /** Stable clip id. */
  id: DefiningWorldPlazaBiomeAmbienceClipId;
  /** WAV filename on disk. */
  fileName: string;
};

/** Every FilmCow ambience loop shipped in the plaza public folder. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_CLIP_CATALOG: Record<
  DefiningWorldPlazaBiomeAmbienceClipId,
  DefiningWorldPlazaBiomeAmbienceClipDefinition
> = {
  air_conditioner: {
    id: 'air_conditioner',
    fileName: 'air-conditioner.wav',
  },
  car_sedan_idling: {
    id: 'car_sedan_idling',
    fileName: 'car-sedan-idling.wav',
  },
  dripping_water_1: {
    id: 'dripping_water_1',
    fileName: 'dripping-water-1.wav',
  },
  dripping_water_2: {
    id: 'dripping_water_2',
    fileName: 'dripping-water-2.wav',
  },
  motorcycle_speeding_off: {
    id: 'motorcycle_speeding_off',
    fileName: 'motorcycle-speeding-off.wav',
  },
  pool_and_pump: {
    id: 'pool_and_pump',
    fileName: 'pool-and-pump.wav',
  },
  small_motor_water_1: {
    id: 'small_motor_water_1',
    fileName: 'small-motor-water-1.wav',
  },
  small_motor_water_2: {
    id: 'small_motor_water_2',
    fileName: 'small-motor-water-2.wav',
  },
  swamp: {
    id: 'swamp',
    fileName: 'swamp.wav',
  },
  woods_near_suburbs: {
    id: 'woods_near_suburbs',
    fileName: 'woods-near-suburbs.wav',
  },
};

/**
 * Primary ambience loop per biome, chosen by thematic fit.
 *
 * Biomes omitted here stay silent until more loops are added.
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
  beach: 'pool_and_pump',
  ocean: 'pool_and_pump',
  rocky: 'dripping_water_1',
  firelands: 'small_motor_water_1',
};

/** How often biome ambience checks the player's current biome (ms). */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_POLL_INTERVAL_MS = 750;

/** Target loop volume once playback is unlocked. */
export const DEFINING_WORLD_PLAZA_BIOME_AMBIENCE_TARGET_VOLUME = 0.28;
