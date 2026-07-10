import { definingWorldPlazaBiomeWorldNoiseFrequency } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';

/**
 * Coherent fractal-noise fields for vegetation placement (trees, stones).
 *
 * Low-frequency noise forms woodland patches; high-frequency noise picks sparse
 * props inside those patches so scatter looks natural instead of grid-like.
 *
 * @module components/world/domains/samplingWorldPlazaVegetationDensityAtTile
 */

/** Seed for the broad woodland / meadow patch field. */
export const DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_SEED = 4201;

/** Frequency for patch noise (smaller is broader biomes of trees). */
export const DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_FREQUENCY =
  definingWorldPlazaBiomeWorldNoiseFrequency(32);

/** Octaves for patch noise. */
export const DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_OCTAVES = 4;

/** Seed for the fine prop scatter field inside a patch. */
export const DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_SEED = 8803;

/** Frequency for detail noise (individual tree/stone candidates). */
export const DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_FREQUENCY = 1 / 11;

/** Octaves for detail noise. */
export const DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_OCTAVES = 2;

/** Seed for the stone scatter field (independent from trees). */
export const DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_SEED = 6101;

/** Frequency for stone scatter noise. */
export const DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_FREQUENCY = 1 / 18;

/** Octaves for stone scatter noise. */
export const DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_OCTAVES = 3;

/** Minimum detail noise for a tree candidate inside a woodland patch. */
export const DEFINING_WORLD_PLAZA_VEGETATION_TREE_DETAIL_NOISE_MIN = 0.62;

/** Minimum stone noise for a pebble/boulder to spawn. */
export const DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN = 0.84;

/** Spacing cell size in tiles (one candidate per cell). */
export const DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_CELL_TILES = 3;

/** Anchor column within each spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_ANCHOR_TILE_X = 1;

/** Anchor row within each spacing cell (0-based). */
export const DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_ANCHOR_TILE_Y = 1;

/**
 * Broad coherent patch value in [0, 1) for woodland vs open ground.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaVegetationPatchNoiseAtTile(
  tileX: number,
  tileY: number
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_VEGETATION_PATCH_NOISE_OCTAVES,
    }
  );
}

/**
 * Fine scatter value in [0, 1) for picking individual trees inside a patch.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaVegetationDetailNoiseAtTile(
  tileX: number,
  tileY: number
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_VEGETATION_DETAIL_NOISE_OCTAVES,
    }
  );
}

/**
 * Stone scatter value in [0, 1).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function samplingWorldPlazaVegetationStoneNoiseAtTile(
  tileX: number,
  tileY: number
): number {
  return samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_OCTAVES,
    }
  );
}

/**
 * True when the tile is the spacing anchor for its cell (prevents clumping).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaVegetationTreeSpacingAnchorAtTile(
  tileX: number,
  tileY: number
): boolean {
  const cell = DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_CELL_TILES;
  const modX = ((tileX % cell) + cell) % cell;
  const modY = ((tileY % cell) + cell) % cell;

  return (
    modX === DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_ANCHOR_TILE_X &&
    modY === DEFINING_WORLD_PLAZA_VEGETATION_TREE_SPACING_ANCHOR_TILE_Y
  );
}
