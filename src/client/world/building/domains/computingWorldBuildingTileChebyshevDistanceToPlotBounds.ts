import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Computes Chebyshev distance from a tile to a plot bounds rectangle.
 *
 * @module components/world/building/domains/computingWorldBuildingTileChebyshevDistanceToPlotBounds
 */

/**
 * Returns the Chebyshev distance from a tile to the nearest tile in plot bounds.
 *
 * @param tilePosition - Candidate tile position.
 * @param bounds - Plot bounds rectangle.
 */
export function computingWorldBuildingTileChebyshevDistanceToPlotBounds(
  tilePosition: DefiningWorldBuildingTilePosition,
  bounds: DefiningWorldBuildingPlotBounds,
): number {
  const closestTileX = Math.min(
    Math.max(tilePosition.tileX, bounds.minTileX),
    bounds.maxTileX,
  );
  const closestTileY = Math.min(
    Math.max(tilePosition.tileY, bounds.minTileY),
    bounds.maxTileY,
  );

  return Math.max(
    Math.abs(tilePosition.tileX - closestTileX),
    Math.abs(tilePosition.tileY - closestTileY),
  );
}
