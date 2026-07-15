/**
 * Deterministic unit roll from tile coordinates and salt.
 *
 * @module components/world/mushrooms/domains/computingWorldPlazaMushroomSeedUnitFromTileIndex
 */

export function computingWorldPlazaMushroomSeedUnitFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number
): number {
  const seed = tileX * 374761393 + tileY * 668265263 + salt * 1274126177;
  const normalized = Math.sin(seed) * 10_000;
  return normalized - Math.floor(normalized);
}
