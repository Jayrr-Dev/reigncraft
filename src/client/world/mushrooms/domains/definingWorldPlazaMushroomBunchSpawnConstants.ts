/**
 * Declarative close-proximity mushroom bunch layout (utility only; not wired).
 *
 * One-block bunches: every seat stays within Chebyshev distance 1 of the anchor
 * (the 3×3 footprint).
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomBunchSpawnConstants
 */

import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

/** Hard radius for close bunches (Chebyshev tiles from anchor). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_RADIUS_TILES = 1;

/**
 * Seat offsets inside the 1-block footprint, preferred fill order:
 * center → cardinals → diagonals.
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS = [
  { offsetX: 0, offsetY: 0 },
  { offsetX: 0, offsetY: -1 },
  { offsetX: 1, offsetY: 0 },
  { offsetX: 0, offsetY: 1 },
  { offsetX: -1, offsetY: 0 },
  { offsetX: 1, offsetY: -1 },
  { offsetX: 1, offsetY: 1 },
  { offsetX: -1, offsetY: 1 },
  { offsetX: -1, offsetY: -1 },
] as const;

/** Max seats when the anchor tile is included (full 3×3). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITH_CENTER =
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS.length;

/** Max seats when the anchor tile is skipped (8 neighbors). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_MAX_COUNT_WITHOUT_CENTER =
  DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_SEAT_OFFSETS.length - 1;

/** Default bunch size when caller omits count. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_DEFAULT_COUNT = 3;

/**
 * Species that commonly fruit in tight clusters (utility hint list).
 */
export const DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_IDS = [
  'false-lantern',
  'cluster-honey',
  'funeral-bell',
  'shelf-oyster',
  'cloud-puff',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

export type DefiningWorldPlazaMushroomBunchHabitatSpeciesId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_BUNCH_HABITAT_SPECIES_IDS)[number];
