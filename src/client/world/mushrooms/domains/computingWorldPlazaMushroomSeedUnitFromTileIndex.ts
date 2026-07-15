/**
 * Deterministic unit roll from tile coordinates and salt.
 * Integer hash (no Math.sin) for hot-path spawn gates.
 *
 * @module components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex
 */

/**
 * Returns a stable unit in [0, 1) from tile coords + salt.
 */
export function computingWorldPlazaMushroomSeedUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number
): number {
  let hash =
    (Math.imul(tileX | 0, 374761393) ^
      Math.imul(tileY | 0, 668265263) ^
      Math.imul(salt | 0, 1274126177)) >>>
    0;

  hash = Math.imul(hash ^ (hash >>> 16), 2246822519) >>> 0;
  hash = Math.imul(hash ^ (hash >>> 13), 3266489917) >>> 0;
  hash = (hash ^ (hash >>> 16)) >>> 0;

  return hash / 4294967296;
}
