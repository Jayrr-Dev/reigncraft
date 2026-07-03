import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import type { DefiningWorldBuildingPlotBounds } from "@/components/world/building/domains/definingWorldBuildingPlotBounds";
import { computingWorldBuildingTileChebyshevDistanceToPlotBounds } from "@/components/world/building/domains/computingWorldBuildingTileChebyshevDistanceToPlotBounds";
import { checkingWorldBuildingGridPointBlockedByPlacedBlocks } from "@/components/world/building/domains/resolvingWorldBuildingCollision";
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex";
import {
  DEFINING_WORLD_PLAZA_PLOT_TELEPORT_DEFAULT_LAYER,
  DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES,
  DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MIN_DISTANCE_FROM_BOUNDS_TILES,
} from "@/components/world/domains/definingWorldPlazaPlotTeleportConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaPlayerWorldLayer } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import { checkingWorldPlazaGridPointOccupiesWalkingBlockedTile } from "@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature";

/**
 * Resolves a walkable grid point near plot bounds for claim-mode teleport.
 *
 * @module components/world/domains/resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport
 */

/**
 * Returns true when an avatar can stand on a grid point for plot teleport.
 *
 * @param gridPoint - Candidate landing position.
 * @param placedBlocks - Player-placed blocks near the plot.
 */
function checkingWorldPlazaGridPointIsWalkableForPlotTeleport(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): boolean {
  const playerLayer = resolvingWorldPlazaPlayerWorldLayer(gridPoint);

  if (checkingWorldPlazaGridPointOccupiesWalkingBlockedTile(gridPoint, false)) {
    return false;
  }

  if (
    checkingWorldBuildingGridPointBlockedByPlacedBlocks(
      gridPoint,
      [...placedBlocks],
      true,
      false,
      playerLayer,
    )
  ) {
    return false;
  }

  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  return !checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    playerLayer,
    true,
  );
}

/**
 * Returns the plot bounds center used as a tie-breaker and fallback landing.
 *
 * @param bounds - Inclusive tile bounds for one plot region.
 */
function resolvingWorldPlazaWorldPointAtPlotBoundsCenter(
  bounds: DefiningWorldBuildingPlotBounds,
): DefiningWorldPlazaWorldPoint {
  const centerGridPoint: DefiningWorldPlazaWorldPoint = {
    x: Math.round((bounds.minTileX + bounds.maxTileX) / 2),
    y: Math.round((bounds.minTileY + bounds.maxTileY) / 2),
    layer: DEFINING_WORLD_PLAZA_PLOT_TELEPORT_DEFAULT_LAYER,
  };

  return {
    ...centerGridPoint,
    layer: resolvingWorldPlazaPlayerWorldLayer(centerGridPoint),
  };
}

/**
 * Returns the nearest walkable grid point within the configured plot teleport ring.
 *
 * Searches tiles 1 to 2 Chebyshev steps outside the plot bounds, preferring
 * closer rings and then the point nearest the plot center.
 *
 * @param bounds - Inclusive tile bounds for one plot region.
 * @param placedBlocks - Player-placed blocks considered for walkability.
 */
export function resolvingWorldPlazaWorldPointNearPlotBoundsForTeleport(
  bounds: DefiningWorldBuildingPlotBounds,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[] = [],
): DefiningWorldPlazaWorldPoint {
  const centerTileX = Math.round((bounds.minTileX + bounds.maxTileX) / 2);
  const centerTileY = Math.round((bounds.minTileY + bounds.maxTileY) / 2);
  const searchMinTileX =
    bounds.minTileX -
    DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES;
  const searchMaxTileX =
    bounds.maxTileX +
    DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES;
  const searchMinTileY =
    bounds.minTileY -
    DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES;
  const searchMaxTileY =
    bounds.maxTileY +
    DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES;

  for (
    let targetDistanceFromBounds =
      DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MIN_DISTANCE_FROM_BOUNDS_TILES;
    targetDistanceFromBounds <=
    DEFINING_WORLD_PLAZA_PLOT_TELEPORT_MAX_DISTANCE_FROM_BOUNDS_TILES;
    targetDistanceFromBounds += 1
  ) {
    let nearestWalkablePoint: DefiningWorldPlazaWorldPoint | null = null;
    let nearestDistanceToCenterSquared = Number.POSITIVE_INFINITY;

    for (let tileY = searchMinTileY; tileY <= searchMaxTileY; tileY += 1) {
      for (let tileX = searchMinTileX; tileX <= searchMaxTileX; tileX += 1) {
        const distanceToPlotBounds =
          computingWorldBuildingTileChebyshevDistanceToPlotBounds(
            { tileX, tileY },
            bounds,
          );

        if (distanceToPlotBounds !== targetDistanceFromBounds) {
          continue;
        }

        const candidatePoint: DefiningWorldPlazaWorldPoint = {
          x: tileX,
          y: tileY,
          layer: DEFINING_WORLD_PLAZA_PLOT_TELEPORT_DEFAULT_LAYER,
        };

        if (
          !checkingWorldPlazaGridPointIsWalkableForPlotTeleport(
            candidatePoint,
            placedBlocks,
          )
        ) {
          continue;
        }

        const deltaX = tileX - centerTileX;
        const deltaY = tileY - centerTileY;
        const distanceToCenterSquared = deltaX * deltaX + deltaY * deltaY;

        if (distanceToCenterSquared >= nearestDistanceToCenterSquared) {
          continue;
        }

        nearestDistanceToCenterSquared = distanceToCenterSquared;
        nearestWalkablePoint = {
          ...candidatePoint,
          layer: resolvingWorldPlazaPlayerWorldLayer(candidatePoint),
        };
      }
    }

    if (nearestWalkablePoint) {
      return nearestWalkablePoint;
    }
  }

  return resolvingWorldPlazaWorldPointAtPlotBoundsCenter(bounds);
}
