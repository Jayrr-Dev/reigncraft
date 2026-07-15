/**
 * Declarative habitat layout rules for wood and pasture mushroom clusters.
 *
 * @module components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatLayoutRegistry
 */

import {
  DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS,
  DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS,
} from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomHabitatSpawnConstants';
import { DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants';
import type { DefiningWorldPlazaMushroomSpeciesId } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomSpeciesIds';

export type DefiningWorldPlazaMushroomHabitatLayoutKind =
  | 'bunch'
  | 'ring'
  | 'nearTree';

/** Sparse placement keeps only these species (non-habitat). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_SPARSE_SPECIES_IDS = [
  'golden-chanter',
  'honeycomb-morel',
  'brain-cap',
  'king-bolete',
  'devils-bolete',
  'angel-button',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

export type DefiningWorldPlazaMushroomSparseSpeciesId =
  (typeof DEFINING_WORLD_PLAZA_MUSHROOM_SPARSE_SPECIES_IDS)[number];

export const DEFINING_WORLD_PLAZA_MUSHROOM_HABITAT_SPECIES_IDS = [
  ...DEFINING_WORLD_PLAZA_MUSHROOM_STUMP_HABITAT_SPECIES_IDS,
  ...DEFINING_WORLD_PLAZA_MUSHROOM_PASTURE_HABITAT_SPECIES_IDS,
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

/** Wood species that use 1-block bunches beside the trunk (never on trunk). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_SPECIES_IDS = [
  'false-lantern',
  'cluster-honey',
  'funeral-bell',
  'shelf-oyster',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

/** Wood species that use the near-trunk annulus. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_NEAR_TREE_SPECIES_IDS = [
  'ghost-wing',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

/** Wood species eligible for fairy-ring layout when honey ring mode wins. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_RING_SPECIES_IDS = [
  'cluster-honey',
] as const satisfies readonly DefiningWorldPlazaMushroomSpeciesId[];

/** Minimum wood bunch seat count (neighbors only). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_MIN_COUNT = 3;

/** Maximum wood bunch seat count (neighbors only). */
export const DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_MAX_COUNT = 5;

/** Minimum near-tree seat count. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_MIN_COUNT = 2;

/** Maximum near-tree seat count. */
export const DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_MAX_COUNT = 4;

export function resolvingWorldPlazaMushroomRingCountFromUnit(
  unitRoll: number
): (typeof DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS)[number] {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const index =
    Math.floor(clampedRoll * DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS.length) %
    DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS.length;

  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS[index] ??
    DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS[0]
  );
}

export function resolvingWorldPlazaMushroomWoodBunchCountFromUnit(
  unitRoll: number
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const span =
    DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_MAX_COUNT -
    DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_MIN_COUNT;

  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_WOOD_BUNCH_MIN_COUNT +
    Math.floor(clampedRoll * (span + 1))
  );
}

export function resolvingWorldPlazaMushroomNearTreeCountFromUnit(
  unitRoll: number
): number {
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const span =
    DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_MAX_COUNT -
    DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_MIN_COUNT;

  return (
    DEFINING_WORLD_PLAZA_MUSHROOM_NEAR_TREE_MIN_COUNT +
    Math.floor(clampedRoll * (span + 1))
  );
}
