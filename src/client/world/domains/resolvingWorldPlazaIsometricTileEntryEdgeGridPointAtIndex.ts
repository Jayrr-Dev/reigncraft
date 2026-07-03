import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { convertingWorldPlazaIsometricScreenPointToGridPoint } from "@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Resolves the entry edge of an isometric tile diamond for jump landings.
 *
 * @module components/world/domains/resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex
 */

/** Below this screen distance the tile center is returned as a fallback. */
const RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_ENTRY_EDGE_MIN_APPROACH_DISTANCE_PX = 1e-4;

/** Nudges the landing slightly inward so the avatar stays inside the tile. */
const RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_ENTRY_EDGE_INSET_FRACTION = 0.08;

/**
 * Returns the grid point on a tile's entry edge facing the approach direction.
 *
 * Used for platform jump landings so the avatar stops on the near edge of the
 * slab instead of sliding to the tile center.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param approachFromGridPoint - Takeoff position in grid space.
 */
export function resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex(
  tileX: number,
  tileY: number,
  approachFromGridPoint: DefiningWorldPlazaWorldPoint,
): DefiningWorldPlazaWorldPoint {
  const tileCenterGridPoint: DefiningWorldPlazaWorldPoint = {
    x: tileX,
    y: tileY,
  };
  const tileCenterScreen = convertingWorldPlazaGridPointToIsometricScreenPoint(
    tileCenterGridPoint,
  );
  const approachScreen = convertingWorldPlazaGridPointToIsometricScreenPoint(
    approachFromGridPoint,
  );
  const deltaScreenX = approachScreen.x - tileCenterScreen.x;
  const deltaScreenY = approachScreen.y - tileCenterScreen.y;
  const approachDistancePx = Math.hypot(deltaScreenX, deltaScreenY);

  if (
    approachDistancePx <
    RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_ENTRY_EDGE_MIN_APPROACH_DISTANCE_PX
  ) {
    return tileCenterGridPoint;
  }

  const directionScreenX = deltaScreenX / approachDistancePx;
  const directionScreenY = deltaScreenY / approachDistancePx;
  const diamondNormalizedDistance =
    Math.abs(directionScreenX) /
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX +
    Math.abs(directionScreenY) /
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const edgeDistancePx = 1 / diamondNormalizedDistance;
  const insetEdgeDistancePx =
    edgeDistancePx *
    (1 - RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_ENTRY_EDGE_INSET_FRACTION);

  return convertingWorldPlazaIsometricScreenPointToGridPoint({
    x: tileCenterScreen.x + directionScreenX * insetEdgeDistancePx,
    y: tileCenterScreen.y + directionScreenY * insetEdgeDistancePx,
  });
}
