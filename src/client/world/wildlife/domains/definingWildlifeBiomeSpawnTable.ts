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
    densityThreshold: 0.62,
    entries: [
      { speciesId: 'cow', weight: 6, packSizeRange: [2, 4] },
      { speciesId: 'sheep', weight: 5, packSizeRange: [3, 6] },
      { speciesId: 'chicken', weight: 4, packSizeRange: [2, 5] },
      { speciesId: 'pig', weight: 4, packSizeRange: [2, 4] },
      { speciesId: 'deer', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'bison', weight: 2, packSizeRange: [2, 5] },
      { speciesId: 'stag', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'boar', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'brown-horse', weight: 2, packSizeRange: [2, 5] },
      { speciesId: 'work-horse', weight: 1, packSizeRange: [1, 3] },
      { speciesId: 'arabian-horse', weight: 1, packSizeRange: [2, 4] },
      { speciesId: 'donkey', weight: 1, packSizeRange: [1, 2] },
      { speciesId: 'bull', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  forest: {
    densityThreshold: 0.6,
    entries: [
      { speciesId: 'deer', weight: 6, packSizeRange: [1, 4] },
      { speciesId: 'boar', weight: 5, packSizeRange: [1, 3] },
      { speciesId: 'stag', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'grey-wolf', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'brown-horse', weight: 1, packSizeRange: [1, 3] },
      { speciesId: 'brown-bear', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  flower_forest: {
    densityThreshold: 0.56,
    entries: [
      { speciesId: 'deer', weight: 6, packSizeRange: [1, 3] },
      { speciesId: 'boar', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'stag', weight: 2, packSizeRange: [1, 2] },
    ],
  },
  snowy_plains: {
    densityThreshold: 0.62,
    entries: [
      { speciesId: 'deer', weight: 4, packSizeRange: [1, 3] },
      { speciesId: 'grey-wolf', weight: 3, packSizeRange: [2, 5] },
      { speciesId: 'yak', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'polar-bear', weight: 1, packSizeRange: [1, 1] },
      { speciesId: 'mammoth', weight: 1, packSizeRange: [1, 2] },
      { speciesId: 'brown-bear', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  savanna: {
    densityThreshold: 0.58,
    entries: [
      { speciesId: 'zebra', weight: 6, packSizeRange: [3, 7] },
      { speciesId: 'antilope', weight: 6, packSizeRange: [3, 6] },
      { speciesId: 'oryx', weight: 3, packSizeRange: [2, 4] },
      { speciesId: 'ostrich', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'lioness', weight: 3, packSizeRange: [2, 4] },
      { speciesId: 'giraffe', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'hyena', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'lion', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'elephant-female', weight: 1, packSizeRange: [2, 3] },
      { speciesId: 'elephant', weight: 1, packSizeRange: [1, 1] },
      { speciesId: 'rhino-female', weight: 1, packSizeRange: [1, 2] },
      { speciesId: 'rhino', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  swamp: {
    densityThreshold: 0.55,
    entries: [
      { speciesId: 'crocodile', weight: 5, packSizeRange: [1, 2] },
      { speciesId: 'boar', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'water-buffalo', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'turtle', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'deer', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'hippo', weight: 1, packSizeRange: [1, 2] },
    ],
  },
  beach: {
    densityThreshold: 0.68,
    entries: [
      { speciesId: 'turtle', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'tortoise', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'crocodile', weight: 1, packSizeRange: [1, 1] },
    ],
  },
  rocky: {
    densityThreshold: 0.64,
    entries: [
      { speciesId: 'ram', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'deer', weight: 3, packSizeRange: [1, 2] },
      { speciesId: 'llama', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'alpaca', weight: 2, packSizeRange: [2, 4] },
      { speciesId: 'grey-wolf', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'yak', weight: 1, packSizeRange: [1, 2] },
    ],
  },
  desert: {
    densityThreshold: 0.66,
    entries: [
      { speciesId: 'camel', weight: 3, packSizeRange: [1, 3] },
      { speciesId: 'zebra', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'oryx', weight: 2, packSizeRange: [1, 3] },
      { speciesId: 'ostrich', weight: 1, packSizeRange: [1, 2] },
    ],
  },
  jungle: {
    densityThreshold: 0.56,
    entries: [
      { speciesId: 'monkey', weight: 6, packSizeRange: [3, 6] },
      { speciesId: 'boar', weight: 4, packSizeRange: [1, 3] },
      { speciesId: 'pig', weight: 3, packSizeRange: [2, 4] },
      { speciesId: 'chimp', weight: 3, packSizeRange: [2, 4] },
      { speciesId: 'deer', weight: 2, packSizeRange: [1, 2] },
      { speciesId: 'tiger', weight: 2, packSizeRange: [1, 1] },
      { speciesId: 'jaguar', weight: 1, packSizeRange: [1, 1] },
    ],
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
export const DEFINING_WILDLIFE_SPAWN_SPACING_MODULUS = 12;

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
