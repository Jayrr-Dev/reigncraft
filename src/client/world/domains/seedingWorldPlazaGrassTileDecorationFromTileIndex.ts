/**
 * Deterministic pseudo-random values for grass tile decorations.
 *
 * @module components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex
 */

import { gettingWorldGenerationSeed } from '../../../shared/worldGenerationSeed';

/** Mixes the session world seed into the grass decoration hash. */
const SEEDING_WORLD_PLAZA_GRASS_WORLD_SEED_MIX = 2246822519;

/**
 * Returns a stable unit float in [0, 1) from tile coordinates and a salt.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param salt - Discriminator so the same tile can yield multiple independent values.
 */
export function seedingWorldPlazaGrassTileDecorationFromTileIndex(
  tileX: number,
  tileY: number,
  salt: number,
): number {
  const seed =
    tileX * 374761393 +
    tileY * 668265263 +
    salt * 1274126177 +
    gettingWorldGenerationSeed() * SEEDING_WORLD_PLAZA_GRASS_WORLD_SEED_MIX;
  const normalized = Math.sin(seed) * 10000;

  return normalized - Math.floor(normalized);
}

/**
 * Maps a seeded unit float to an integer in [min, max] (inclusive).
 *
 * @param unitFloat - Value in [0, 1).
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 */
export function mappingWorldPlazaGrassSeededUnitToIntegerRange(
  unitFloat: number,
  min: number,
  max: number,
): number {
  return Math.floor(unitFloat * (max - min + 1)) + min;
}

/**
 * Maps a seeded unit float to a float in [min, max].
 *
 * @param unitFloat - Value in [0, 1).
 * @param min - Lower bound (inclusive).
 * @param max - Upper bound (inclusive).
 */
export function mappingWorldPlazaGrassSeededUnitToFloatRange(
  unitFloat: number,
  min: number,
  max: number,
): number {
  return unitFloat * (max - min) + min;
}
