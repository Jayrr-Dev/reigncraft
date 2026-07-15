/**
 * Pure distance-danger band math from plaza origin.
 *
 * @module components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin
 */

import {
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_COMBAT_BONUS_PER_BAND,
} from '@/components/world/domains/definingWorldPlazaDistanceDangerConstants';

/**
 * Euclidean tile distance from world origin (spawn).
 *
 * @param tileX - Tile column (or world X when 1 unit = 1 tile).
 * @param tileY - Tile row (or world Y).
 */
export function computingWorldPlazaDistanceFromOriginTiles(
  tileX: number,
  tileY: number
): number {
  return Math.hypot(tileX, tileY);
}

/**
 * Danger band index: 0 near origin, +1 every
 * {@link DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES} tiles out.
 */
export function computingWorldPlazaDistanceDangerBandFromOrigin(
  tileX: number,
  tileY: number
): number {
  return Math.floor(
    computingWorldPlazaDistanceFromOriginTiles(tileX, tileY) /
      DEFINING_WORLD_PLAZA_DISTANCE_DANGER_BAND_TILES
  );
}

/**
 * Multiplier on wildlife HP and attack from distance band.
 * Band 0 → 1, band 1 → 1.05, band 2 → 1.10, …
 */
export function computingWorldPlazaDistanceDangerCombatScale(
  dangerBand: number
): number {
  if (dangerBand <= 0) {
    return 1;
  }

  return (
    1 + DEFINING_WORLD_PLAZA_DISTANCE_DANGER_COMBAT_BONUS_PER_BAND * dangerBand
  );
}
