import { DEFINING_WORLD_PLAZA_BIOME_CATALOG } from "@/components/world/domains/definingWorldPlazaBiomeConstants";
import {
  pickingWorldPlazaBiomeKindFromClimate,
} from "@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";

/**
 * Resolves the catalog temperature used for surface-water spawn rules.
 *
 * Uses climate-only biome selection so elevation-adjusted biomes do not create
 * import cycles with terrain height sampling.
 *
 * @module components/world/domains/resolvingWorldPlazaBiomeTemperatureAtTileIndex
 */

/**
 * Returns the representative biome temperature for one tile in [0, 1].
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaBiomeTemperatureAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const climateBiomeKind = pickingWorldPlazaBiomeKindFromClimate(
    climate.temperature,
    climate.humidity,
    tileX,
    tileY,
  );

  return DEFINING_WORLD_PLAZA_BIOME_CATALOG[climateBiomeKind].temperature;
}
