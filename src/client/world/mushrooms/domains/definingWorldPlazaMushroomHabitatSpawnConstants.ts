/**
 * Declarative mushroom habitat spawn prefs and anchor tuning.
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatSpawnConstants
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

/**
 * Species that fruit on / beside dead wood (stumps, logs, buried roots).
 * Matches look-alike wood pairs + jack-o’-lantern analog.
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS = [
  'false-lantern',
  'cluster-honey',
  'funeral-bell',
  'shelf-oyster',
  'ghost-wing',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

export type DefiningWorldPlazaMushroomStumpHabitatSpeciesId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS)[number];

/**
 * Species that fruit in open grass / pasture (fairy-ring prone).
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS = [
  'cloud-puff',
  'white-parasol',
  'green-vomiter',
  'field-agaric',
  'yellow-stain',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

export type DefiningWorldPlazaMushroomPastureHabitatSpeciesId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS)[number];

/** Open grazing biomes treated as pasture for mushroom utility scans. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS = [
  'plains',
  'savanna',
] as const satisfies readonly DefiningWorldPlazaBiomeKind[];

export type DefiningWorldPlazaMushroomPastureBiomeKind =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_BIOME_KINDS)[number];

/** Closest Chebyshev ring around a stump (exclude stump tile). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MIN_RADIUS_TILES = 1;

/** Farthest Chebyshev ring around a stump for near-wood seats. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_NEAR_MAX_RADIUS_TILES = 2;

/** Default fairy-ring count when laying pasture rings (utility helper). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_DEFAULT_RING_COUNT = 7;
