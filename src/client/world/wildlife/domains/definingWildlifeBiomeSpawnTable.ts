/**
 * Per-biome weighted wildlife spawn pools.
 *
 * @module components/world/wildlife/domains/definingWildlifeBiomeSpawnTable
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeBiomeSpawnEntry = {
  speciesId: DefiningWildlifeSpeciesId;
  weight: number;
  packSizeRange: readonly [number, number];
};

export type DefiningWildlifeBiomeSpawnConfig = {
  /** Noise threshold; higher = sparser wildlife. */
  densityThreshold: number;
  entries: readonly DefiningWildlifeBiomeSpawnEntry[];
};

export const DEFINING_WILDLIFE_BIOME_SPAWN_TABLE: Partial<
  Record<DefiningWorldPlazaBiomeKind, DefiningWildlifeBiomeSpawnConfig>
> = {
  plains: {
    densityThreshold: 0.58,
    entries: [
      { speciesId: 'cow', weight: 6, packSizeRange: [2, 4] },
      { speciesId: 'sheep', weight: 5, packSizeRange: [3, 6] },
      { speciesId: 'chicken', weight: 4, packSizeRange: [2, 5] },
      { speciesId: 'deer', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'boar', weight: 2, packSizeRange: [1, 2] },
    ],
  },
  forest: {
    densityThreshold: 0.54,
    entries: [
      { speciesId: 'deer', weight: 6, packSizeRange: [1, 4] },
      { speciesId: 'boar', weight: 5, packSizeRange: [1, 3] },
      { speciesId: 'grey-wolf', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'brown-bear', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  flower_forest: {
    densityThreshold: 0.56,
    entries: [
      { speciesId: 'deer', weight: 6, packSizeRange: [1, 3] },
      { speciesId: 'boar', weight: 3, packSizeRange: [1, 2] },
    ],
  },
  snowy_plains: {
    densityThreshold: 0.62,
    entries: [
      { speciesId: 'deer', weight: 4, packSizeRange: [1, 3] },
      { speciesId: 'grey-wolf', weight: 3, packSizeRange: [2, 5] },
      { speciesId: 'brown-bear', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  savanna: {
    densityThreshold: 0.52,
    entries: [
      { speciesId: 'zebra', weight: 6, packSizeRange: [3, 7] },
      { speciesId: 'lion', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'lioness', weight: 3, packSizeRange: [2, 4] },
      { speciesId: 'grey-wolf', weight: 1, packSizeRange: [2, 3] },
    ],
  },
  swamp: {
    densityThreshold: 0.55,
    entries: [
      { speciesId: 'crocodile', weight: 5, packSizeRange: [1, 2] },
      { speciesId: 'boar', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'deer', weight: 2, packSizeRange: [1, 2] },
    ],
  },
  beach: {
    densityThreshold: 0.68,
    entries: [{ speciesId: 'crocodile', weight: 1, packSizeRange: [1, 1] }],
  },
  rocky: {
    densityThreshold: 0.64,
    entries: [
      { speciesId: 'deer', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'grey-wolf', weight: 2, packSizeRange: [1, 3] },
    ],
  },
  desert: {
    densityThreshold: 0.66,
    entries: [{ speciesId: 'zebra', weight: 2, packSizeRange: [1, 3] }],
  },
  badlands: {
    densityThreshold: 0.67,
    entries: [
      { speciesId: 'boar', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'grey-wolf', weight: 1, packSizeRange: [1, 2] },
    ],
  },
  firelands: {
    densityThreshold: 0.78,
    entries: [{ speciesId: 'grey-wolf', weight: 1, packSizeRange: [1, 2] }],
  },
};

/** Spacing grid modulus for wildlife spawn anchors (tiles). */
export const DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS = 7;

/** Salt for wildlife species weighted pick. */
export const DEFINING_WILDLIFE_SPECIES_PICK_SALT = 41;

/** Salt for pack size roll. */
export const DEFINING_WILDLIFE_PACK_SIZE_SALT = 53;

/** Salt for wildlife patch noise. */
export const DEFINING_WILDLIFE_PATCH_NOISE_SALT = 67;

/** Salt for pack member offset. */
export const DEFINING_WILDLIFE_PACK_OFFSET_SALT = 79;

/** Radius around origin where wildlife does not spawn. */
export const DEFINING_WILDLIFE_SPAWN_CLEARING_RADIUS_SQUARED = 12 * 12;
