import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { ConvertingWorldPlazaIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";

/** Iterations when undoing per-tile surface elevation during pointer projection. */
const CONVERTING_WORLD_PLAZA_ISOMETRIC_SCREEN_POINT_TO_GRID_POINT_SURFACE_ELEVATION_MAX_ITERATIONS = 6;

/**
 * Inverse of {@link convertingWorldPlazaGridPointToIsometricScreenPoint}.
 *
 * @param screenPoint - Pixi world coordinates (after camera offset).
 */
export function convertingWorldPlazaIsometricScreenPointToGridPoint(
  screenPoint: ConvertingWorldPlazaIsometricScreenPoint,
): DefiningWorldPlazaWorldPoint {
  const halfTileWidthPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfTileHeightPx = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return {
    x:
      (screenPoint.x / halfTileWidthPx + screenPoint.y / halfTileHeightPx) / 2,
    y:
      (screenPoint.y / halfTileHeightPx - screenPoint.x / halfTileWidthPx) / 2,
  };
}

/**
 * Inverse of grid-to-screen projection when tiles are drawn on raised surfaces.
 *
 * Terrain columns, rocks, and other elevated walk surfaces lift their screen Y
 * above the ground grid. Pointer hits must undo that lift per tile or clicks
 * land on the wrong diamond.
 *
 * @param screenPoint - Unscaled world-local coordinates from the camera rig.
 */
export function convertingWorldPlazaIsometricScreenPointToGridPointWithSurfaceElevation(
  screenPoint: ConvertingWorldPlazaIsometricScreenPoint,
): DefiningWorldPlazaWorldPoint {
  let gridPoint = convertingWorldPlazaIsometricScreenPointToGridPoint(screenPoint);
  let resolvedTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  for (
    let iteration = 0;
    iteration <
    CONVERTING_WORLD_PLAZA_ISOMETRIC_SCREEN_POINT_TO_GRID_POINT_SURFACE_ELEVATION_MAX_ITERATIONS;
    iteration += 1
  ) {
    const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
      resolvedTile.tileX,
      resolvedTile.tileY,
    );
    const surfaceOffsetPx =
      computingWorldBuildingWorldLayerScreenOffsetPx(surfaceLayer);
    const adjustedScreenPoint: ConvertingWorldPlazaIsometricScreenPoint = {
      x: screenPoint.x,
      y: screenPoint.y - surfaceOffsetPx,
    };
    const nextGridPoint =
      convertingWorldPlazaIsometricScreenPointToGridPoint(adjustedScreenPoint);
    const nextTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(nextGridPoint);

    if (
      nextTile.tileX === resolvedTile.tileX &&
      nextTile.tileY === resolvedTile.tileY
    ) {
      return nextGridPoint;
    }

    gridPoint = nextGridPoint;
    resolvedTile = nextTile;
  }

  return gridPoint;
}

/**
 * Projects a grid tile center to world-local screen space on its walk surface.
 *
 * Used to verify pointer round-trips in tests.
 */
export function convertingWorldPlazaGridPointToIsometricScreenPointOnSurface(
  gridPoint: DefiningWorldPlazaWorldPoint,
): ConvertingWorldPlazaIsometricScreenPoint {
  const tileIndex = resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileIndex.tileX,
    y: tileIndex.tileY,
  });
  const surfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
    tileIndex.tileX,
    tileIndex.tileY,
  );

  return {
    x: screenPoint.x,
    y:
      screenPoint.y +
      computingWorldBuildingWorldLayerScreenOffsetPx(surfaceLayer),
  };
}
