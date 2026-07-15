import { DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_SQUARED } from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';

/**
 * Spawn clearing that keeps Frostsink discs away from the plaza origin.
 *
 * @module components/world/domains/checkingWorldPlazaFrostsinkSpawnClearingAtTileIndex
 */

/**
 * Returns true when the tile lies inside the Frostsink spawn clearing disc.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFrostsinkSpawnClearingAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_SQUARED
  );
}
