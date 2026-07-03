/**
 * Deterministic integer seed for per-tree procedural variation.
 *
 * Trees must look identical on every client and whenever they re-enter the
 * viewport, so all randomness flows from a stable hash of the tile coordinates
 * instead of {@link Math.random}.
 *
 * @module components/world/domains/computingWorldPlazaTreeSeedFromTileIndex
 */

/** Golden-ratio start constant for the multiplicative coordinate hash. */
const COMPUTING_WORLD_PLAZA_TREE_SEED_INITIAL = 0x9e3779b9;

/** Odd 32-bit mixing constant applied with the column index. */
const COMPUTING_WORLD_PLAZA_TREE_SEED_MIX_X = 0x85ebca6b;

/** Odd 32-bit mixing constant applied with the row index. */
const COMPUTING_WORLD_PLAZA_TREE_SEED_MIX_Y = 0xc2b2ae35;

/**
 * Salt mixed into a tree seed to derive an independent random stream.
 *
 * Keeping streams independent means changing the canopy lobe logic never shifts
 * the trunk color (and vice versa) for an existing tree.
 */
export const DEFINING_WORLD_PLAZA_TREE_SEED_TRUNK_SALT = 0x1f83d9ab;

/**
 * Hashes a tile coordinate into a stable signed 32-bit seed.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaTreeSeedFromTileIndex(
  tileX: number,
  tileY: number,
): number {
  let hash = COMPUTING_WORLD_PLAZA_TREE_SEED_INITIAL | 0;
  hash = Math.imul(hash ^ (tileX | 0), COMPUTING_WORLD_PLAZA_TREE_SEED_MIX_X);
  hash = Math.imul(hash ^ (tileY | 0), COMPUTING_WORLD_PLAZA_TREE_SEED_MIX_Y);
  hash ^= hash >>> 16;

  return hash | 0;
}
