import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { resolvingWorldPlazaWaterAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex";

/**
 * Resolves the screen-space flow axis for a stream tile from its water neighbors.
 *
 * @module components/world/domains/resolvingWorldPlazaWaterFlowAxisAtTileIndex
 */

/** Normalized screen-space flow direction for a stream tile. */
export interface ResolvingWorldPlazaWaterFlowAxis {
  /** Unit screen X component pointing downstream. */
  readonly dirX: number;
  /** Unit screen Y component pointing downstream. */
  readonly dirY: number;
}

/** Screen vector for one grid step along +x (down-right on screen). */
const RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_X_SCREEN_VECTOR = {
  x: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  y: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
} as const;

/** Screen vector for one grid step along +y (down-left on screen). */
const RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_Y_SCREEN_VECTOR = {
  x: -DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  y: DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
} as const;

/** Normalizes a screen vector to unit length, defaulting to down-right. */
function normalizingWorldPlazaWaterFlowVector(
  x: number,
  y: number,
): ResolvingWorldPlazaWaterFlowAxis {
  const magnitude = Math.hypot(x, y);

  if (magnitude < 0.0001) {
    return { dirX: 0.7071, dirY: 0.7071 };
  }

  return { dirX: x / magnitude, dirY: y / magnitude };
}

/**
 * Returns the downstream screen-space unit vector for a stream tile.
 *
 * Flow runs along whichever grid axis connects two opposite water neighbors so
 * narrow channels animate along their length. Tiles without a clear channel
 * default to the down-right screen diagonal.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaWaterFlowAxisAtTileIndex(
  tileX: number,
  tileY: number,
): ResolvingWorldPlazaWaterFlowAxis {
  const hasNorth = Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX, tileY - 1));
  const hasSouth = Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX, tileY + 1));
  const hasEast = Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX + 1, tileY));
  const hasWest = Boolean(resolvingWorldPlazaWaterAtTileIndex(tileX - 1, tileY));
  const runsAlongGridY = hasNorth && hasSouth;
  const runsAlongGridX = hasEast && hasWest;

  if (runsAlongGridY && !runsAlongGridX) {
    return normalizingWorldPlazaWaterFlowVector(
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_Y_SCREEN_VECTOR.x,
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_Y_SCREEN_VECTOR.y,
    );
  }

  if (runsAlongGridX && !runsAlongGridY) {
    return normalizingWorldPlazaWaterFlowVector(
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_X_SCREEN_VECTOR.x,
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_X_SCREEN_VECTOR.y,
    );
  }

  return normalizingWorldPlazaWaterFlowVector(
    RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_X_SCREEN_VECTOR.x +
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_Y_SCREEN_VECTOR.x,
    RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_X_SCREEN_VECTOR.y +
      RESOLVING_WORLD_PLAZA_WATER_FLOW_GRID_Y_SCREEN_VECTOR.y,
  );
}
