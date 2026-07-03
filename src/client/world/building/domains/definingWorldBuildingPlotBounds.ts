import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";

/**
 * Rectangular plot bounds on the isometric tile grid.
 *
 * @module components/world/building/domains/definingWorldBuildingPlotBounds
 */

/** Inclusive tile bounds for an owned build plot. */
export interface DefiningWorldBuildingPlotBounds {
  readonly minTileX: number;
  readonly minTileY: number;
  readonly maxTileX: number;
  readonly maxTileY: number;
}

/**
 * Returns true when a tile position lies inside inclusive plot bounds.
 *
 * @param bounds - Plot rectangle.
 * @param position - Candidate tile position.
 */
export function checkingWorldBuildingTilePositionInsidePlotBounds(
  bounds: DefiningWorldBuildingPlotBounds,
  position: DefiningWorldBuildingTilePosition,
): boolean {
  return (
    position.tileX >= bounds.minTileX &&
    position.tileX <= bounds.maxTileX &&
    position.tileY >= bounds.minTileY &&
    position.tileY <= bounds.maxTileY
  );
}

/**
 * Returns true when two plot bounds rectangles overlap.
 *
 * @param left - First plot bounds.
 * @param right - Second plot bounds.
 */
export function checkingWorldBuildingPlotBoundsOverlap(
  left: DefiningWorldBuildingPlotBounds,
  right: DefiningWorldBuildingPlotBounds,
): boolean {
  return !(
    left.maxTileX < right.minTileX ||
    left.minTileX > right.maxTileX ||
    left.maxTileY < right.minTileY ||
    left.minTileY > right.maxTileY
  );
}
