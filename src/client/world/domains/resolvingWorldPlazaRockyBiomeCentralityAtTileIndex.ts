import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_CENTER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_HALF_RANGE,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_CENTER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_HALF_RANGE,
} from "@/components/world/domains/definingWorldPlazaBiomeRockyClimateConstants";
import { resolvingWorldPlazaClimateAtTile } from "@/components/world/domains/resolvingWorldPlazaClimateAtTileIndex";

/**
 * Rocky biome centrality from climate distance to the rocky band center.
 *
 * A tile sitting at the exact center of the rocky temperature/humidity band
 * returns 1; a tile at the band edge (about to flip to a neighbor biome)
 * returns 0. Boulder size, footprint, and height scale with this value so the
 * biggest rocks rise in the heart of each rocky patch and shrink toward its rim.
 *
 * @module components/world/domains/resolvingWorldPlazaRockyBiomeCentralityAtTileIndex
 */

/**
 * Returns a [0, 1] centrality for a tile within the rocky climate band.
 *
 * Returns 0 for tiles whose climate falls outside the rocky band so callers can
 * treat off-band tiles as the rim. Values rise smoothly toward 1 at the center.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaRockyBiomeCentralityAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  const climate = resolvingWorldPlazaClimateAtTile(tileX, tileY);
  const temperatureOffset =
    Math.abs(
      climate.temperature - DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_CENTER,
    ) / DEFINING_WORLD_PLAZA_ROCKY_BIOME_TEMPERATURE_HALF_RANGE;
  const humidityOffset =
    Math.abs(
      climate.humidity - DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_CENTER,
    ) / DEFINING_WORLD_PLAZA_ROCKY_BIOME_HUMIDITY_HALF_RANGE;
  const normalizedEdgeDistance = Math.max(temperatureOffset, humidityOffset);

  return Math.min(1, Math.max(0, 1 - normalizedEdgeDistance));
}
