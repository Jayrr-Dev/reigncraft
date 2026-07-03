import { DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX } from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Detects frozen surface water from per-tile climate temperature.
 *
 * @module components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex
 */

/**
 * Returns true when surface water on the tile is frozen solid.
 *
 * Frozen tiles stay visually wet but become walkable and skip flow animation.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaWaterIsFrozenAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  if (!resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);

  return (
    climate.temperature <=
    DEFINING_WORLD_PLAZA_WATER_FROZEN_CLIMATE_TEMPERATURE_MAX
  );
}
