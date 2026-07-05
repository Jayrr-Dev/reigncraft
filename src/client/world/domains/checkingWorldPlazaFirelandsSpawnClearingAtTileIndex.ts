import { DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_SQUARED } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';

/**
 * Spawn clearing checks that keep Firelands away from the plaza origin.
 *
 * @module components/world/domains/checkingWorldPlazaFirelandsSpawnClearingAtTileIndex
 */

/**
 * Returns true when the tile lies inside the Firelands spawn clearing disc.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFirelandsSpawnClearingAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_FIRELANDS_SPAWN_CLEARING_RADIUS_SQUARED
  );
}
