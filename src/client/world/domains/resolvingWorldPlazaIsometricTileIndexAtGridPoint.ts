import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Maps grid positions to isometric tile indices that match drawn diamond centers.
 *
 * @module components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint
 */

/** Tile column and row indices for one isometric diamond. */
export interface ResolvingWorldPlazaIsometricTileIndex {
  /** Tile column index. */
  tileX: number;
  /** Tile row index. */
  tileY: number;
}

/** Candidate tile match for one grid point. */
interface ResolvingWorldPlazaIsometricTileCandidate {
  /** Tile column index. */
  tileX: number;
  /** Tile row index. */
  tileY: number;
  /** Squared distance from the grid point to the tile anchor. */
  centerDistanceSquared: number;
}

/** Half-width of one isometric tile in grid units (center to east/west edge). */
const RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID = 0.5;

/**
 * Returns true when a grid point lies inside a tile diamond footprint.
 *
 * Uses the same screen-space diamond test as floor rendering:
 * |dx/halfWidth| + |dy/halfHeight| <= 1
 *
 * @param gridPoint - Position in grid space.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaGridPointInsideIsometricTileAtIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
): boolean {
  const tileCenterScreen = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const gridPointScreen =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const deltaScreenX = gridPointScreen.x - tileCenterScreen.x;
  const deltaScreenY = gridPointScreen.y - tileCenterScreen.y;

  return (
    Math.abs(deltaScreenX) / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX +
      Math.abs(deltaScreenY) / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX <=
    1
  );
}

/**
 * Lists isometric tiles whose drawn diamond contains a grid point, nearest first.
 *
 * @param gridPoint - Position in grid space.
 */
function listingWorldPlazaIsometricTileCandidatesAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): ResolvingWorldPlazaIsometricTileCandidate[] {
  const minTileX = Math.floor(
    gridPoint.x - RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
  const maxTileX = Math.ceil(
    gridPoint.x + RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
  const minTileY = Math.floor(
    gridPoint.y - RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
  const maxTileY = Math.ceil(
    gridPoint.y + RESOLVING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
  );
  const candidates: ResolvingWorldPlazaIsometricTileCandidate[] = [];

  for (let tileY = minTileY; tileY <= maxTileY; tileY += 1) {
    for (let tileX = minTileX; tileX <= maxTileX; tileX += 1) {
      if (
        !checkingWorldPlazaGridPointInsideIsometricTileAtIndex(
          gridPoint,
          tileX,
          tileY,
        )
      ) {
        continue;
      }

      const deltaX = gridPoint.x - tileX;
      const deltaY = gridPoint.y - tileY;

      candidates.push({
        tileX,
        tileY,
        centerDistanceSquared: deltaX * deltaX + deltaY * deltaY,
      });
    }
  }

  candidates.sort(
    (leftCandidate, rightCandidate) =>
      leftCandidate.centerDistanceSquared - rightCandidate.centerDistanceSquared,
  );

  return candidates;
}

/**
 * Resolves the tile index whose drawn diamond contains a grid point.
 *
 * When a corner is shared, the nearest tile anchor wins.
 *
 * @param gridPoint - Position in grid space.
 */
export function resolvingWorldPlazaIsometricTileIndexAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
): ResolvingWorldPlazaIsometricTileIndex {
  const candidates = listingWorldPlazaIsometricTileCandidatesAtGridPoint(gridPoint);

  if (candidates.length === 0) {
    return {
      tileX: Math.round(gridPoint.x),
      tileY: Math.round(gridPoint.y),
    };
  }

  return {
    tileX: candidates[0].tileX,
    tileY: candidates[0].tileY,
  };
}

/**
 * Pushes a grid point outside one isometric tile diamond in screen space.
 *
 * @param gridPoint - Position in grid space.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param edgeExitEpsilon - Distance past the diamond edge after ejection.
 */
export function pushingWorldPlazaGridPointOutsideIsometricTileAtIndex(
  gridPoint: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  edgeExitEpsilon: number,
): DefiningWorldPlazaWorldPoint {
  const tileCenterScreen = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const gridPointScreen =
    convertingWorldPlazaGridPointToIsometricScreenPoint(gridPoint);
  const deltaScreenX = gridPointScreen.x - tileCenterScreen.x;
  const deltaScreenY = gridPointScreen.y - tileCenterScreen.y;
  const normalizedDistance =
    Math.abs(deltaScreenX) / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX +
    Math.abs(deltaScreenY) / DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  if (normalizedDistance <= 0) {
    return {
      x: gridPoint.x + edgeExitEpsilon,
      y: gridPoint.y,
    };
  }

  // Already outside the tile diamond: leave the point unchanged. Without this,
  // nearby avatars get pulled onto the block edge every frame and stick there.
  if (normalizedDistance >= 1) {
    return gridPoint;
  }

  const targetNormalizedDistance = 1 + edgeExitEpsilon;
  const pushScale = targetNormalizedDistance / normalizedDistance;
  const pushedScreenX = tileCenterScreen.x + deltaScreenX * pushScale;
  const pushedScreenY = tileCenterScreen.y + deltaScreenY * pushScale;
  const halfTileWidthPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfTileHeightPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return {
    x:
      (pushedScreenX / halfTileWidthPx + pushedScreenY / halfTileHeightPx) / 2,
    y:
      (pushedScreenY / halfTileHeightPx - pushedScreenX / halfTileWidthPx) / 2,
  };
}
