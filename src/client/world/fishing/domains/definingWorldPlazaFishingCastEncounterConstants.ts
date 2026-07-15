/**
 * Declarative fishing cast wildlife encounter tuning.
 *
 * Each successful cast has a small chance to spawn a surprise: biome bear,
 * wolf, pinguin, or fairy.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCastEncounterConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Chance a cast rolls any wildlife encounter. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_CHANCE = 0.04;

/** Equal-weight encounter kinds when the cast hits. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_KINDS = [
  'bear',
  'wolf',
  'pinguin',
  'fairy',
] as const;

export type DefiningWorldPlazaFishingCastEncounterKind =
  (typeof DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_KINDS)[number];

/** Predator stalks / follows before it may attack (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_DURATION_MS =
  10_000;

/**
 * If the player gets this far from the predator during the stalk window, the
 * encounter cancels and the animal soft-despawns.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FLEE_DISTANCE_GRID = 26;

/**
 * Spawn ring: min grid distance from the player (off-screen on typical viewports).
 * Must stay under wildlife sim radius so the instance is not instantly culled.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MIN_DISTANCE_GRID =
  18;

/** Spawn ring max grid distance from the player. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_MAX_DISTANCE_GRID =
  24;

/**
 * Ideal shadow distance while the predator stalks before attacking (grid).
 * Larger than docile follow comfort so the animal does not glue to the player.
 */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_DISTANCE_GRID =
  10;

/** Back away when closer than this while fishing-cast stalking. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MIN_DISTANCE_GRID =
  8;

/** Catch up when farther than this while fishing-cast stalking. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_STALK_FOLLOW_MAX_DISTANCE_GRID =
  12;

/** Placement attempts for an off-screen encounter spawn. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_ATTEMPT_COUNT = 24;

/** Salt mixed into seeded encounter placement rolls. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_SPAWN_PLACEMENT_SALT =
  77_421;

/** How long a cast-spawned fairy trails before departing (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_FOLLOW_MS = 45_000;

/** How long a cast-spawned pinguin stays curious / followable (ms). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_FOLLOW_MS =
  90_000;

/** Toast when a predator begins stalking from off-screen. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PREDATOR_TOAST =
  'Something stalks you from beyond the water…' as const;

/** Toast when a pinguin waddles in from the cast. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_TOAST =
  'A pinguin notices your catch.' as const;

/** Toast when a fairy drifts in from the cast. */
export const LABELING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_TOAST =
  'A fairy drifts in to watch you fish.' as const;

/** Biome → bear species pool (biome-appropriate). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_BEARS_BY_BIOME: Partial<
  Record<DefiningWorldPlazaBiomeKind, readonly DefiningWildlifeSpeciesId[]>
> = {
  forest: ['brown-bear', 'grizzly'],
  snowy_plains: ['polar-bear', 'grizzly', 'brown-bear'],
  frostsink: ['polar-bear', 'grizzly', 'brown-bear'],
  rocky: ['grizzly'],
};

/** Fallback bear when the cast biome has no mapped pool. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_DEFAULT_BEAR_SPECIES_ID: DefiningWildlifeSpeciesId =
  'brown-bear';

/** Wolf species for fishing cast encounters. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_WOLF_SPECIES_ID: DefiningWildlifeSpeciesId =
  'grey-wolf';

/** Pinguin species id (catalog spelling). */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_PINGUIN_SPECIES_ID: DefiningWildlifeSpeciesId =
  'pinguin';

/** Fairy species id. */
export const DEFINING_WORLD_PLAZA_FISHING_CAST_ENCOUNTER_FAIRY_SPECIES_ID: DefiningWildlifeSpeciesId =
  'fairy';
