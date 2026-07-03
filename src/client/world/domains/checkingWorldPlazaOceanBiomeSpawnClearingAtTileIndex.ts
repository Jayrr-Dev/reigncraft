import {
  DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_SQUARED,
} from "@/components/world/domains/definingWorldPlazaOceanBiomeConstants";

/**
 * Spawn clearing checks that keep open ocean away from the plaza origin.
 *
 * @module components/world/domains/checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex
 */

/**
 * Returns true when the tile lies inside the ocean spawn clearing disc.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_OCEAN_BIOME_SPAWN_CLEARING_RADIUS_SQUARED
  );
}
