import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  checkingWorldBuildingCanJumpLandOnSurfaceLayer,
  listingWorldBuildingPlacedBlocksAtTileIndex,
} from "@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex";
import { checkingWorldPlazaTerrainElevationHasStandablePlatformAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex";
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex } from "@/components/world/domains/resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";

/**
 * Snaps jump landings onto the next reachable platform along the jump path.
 *
 * @module components/world/building/domains/resolvingWorldBuildingJumpLandingOnNextPlatformAlongPath
 */

/** Samples taken along a jump path when searching for a platform landing. */
const RESOLVING_WORLD_BUILDING_JUMP_LANDING_PLATFORM_PATH_SAMPLE_COUNT = 32;

/** Resolved jump landing snapped to a platform tile entry edge. */
export interface ResolvingWorldBuildingJumpLandingOnNextPlatformAlongPathResult {
  /** Grid position on the platform tile edge facing the jump. */
  landingGridPoint: DefiningWorldPlazaWorldPoint;
  /** Surface layer on the landing tile. */
  landingSurfaceLayer: number;
  /** Forward distance from takeoff to the landing edge point. */
  forwardGridDistance: number;
}

/** Candidate platform tile along a jump path. */
interface ResolvingWorldBuildingJumpLandingPlatformCandidate {
  forwardGridDistance: number;
  landingGridPoint: DefiningWorldPlazaWorldPoint;
  landingSurfaceLayer: number;
}

/**
 * Returns forward distance from takeoff to a landing point along a unit direction.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param landingGridPoint - Landing point on the platform tile.
 * @param gridDirection - Unit grid direction of the jump.
 */
function computingWorldBuildingJumpForwardGridDistanceToLandingPoint(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  landingGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
): number {
  return (
    (landingGridPoint.x - startGridPoint.x) * gridDirection.x +
    (landingGridPoint.y - startGridPoint.y) * gridDirection.y
  );
}

/**
 * Returns true when a tile has a raised surface the player can stand on.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Blocks near the tile.
 */
function checkingWorldBuildingTileHasStandablePlatformAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
): boolean {
  if (
    listingWorldBuildingPlacedBlocksAtTileIndex(tileX, tileY, placedBlocks)
      .length > 0
  ) {
    return true;
  }

  return checkingWorldPlazaTerrainElevationHasStandablePlatformAtTileIndex(
    tileX,
    tileY,
  );
}

/**
 * Finds the furthest reachable platform along a jump path and snaps landing to it.
 *
 * Elevated platforms (above takeoff layer) are preferred. When none exist, the
 * furthest same-level platform within jump reach is used so gap jumps still land
 * on the next slab instead of open ground past it.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 * @param maxForwardGridDistance - Maximum jump distance in grid units.
 * @param placedBlocks - Blocks near the jump path.
 * @param fromLayer - Player layer at takeoff.
 */
export function resolvingWorldBuildingJumpLandingOnNextPlatformAlongPath(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
  maxForwardGridDistance: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
): ResolvingWorldBuildingJumpLandingOnNextPlatformAlongPathResult | null {
  const startTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(startGridPoint);
  const visitedTileKeys = new Set<string>();
  let bestElevatedCandidate: ResolvingWorldBuildingJumpLandingPlatformCandidate | null =
    null;
  let bestSameLevelCandidate: ResolvingWorldBuildingJumpLandingPlatformCandidate | null =
    null;

  for (
    let sampleIndex = 1;
    sampleIndex <= RESOLVING_WORLD_BUILDING_JUMP_LANDING_PLATFORM_PATH_SAMPLE_COUNT;
    sampleIndex += 1
  ) {
    const sampleDistance =
      (maxForwardGridDistance * sampleIndex) /
      RESOLVING_WORLD_BUILDING_JUMP_LANDING_PLATFORM_PATH_SAMPLE_COUNT;
    const sampleGridPoint: DefiningWorldPlazaWorldPoint = {
      x: startGridPoint.x + gridDirection.x * sampleDistance,
      y: startGridPoint.y + gridDirection.y * sampleDistance,
    };
    const sampleTile =
      resolvingWorldPlazaIsometricTileIndexAtGridPoint(sampleGridPoint);
    const tileKey = `${sampleTile.tileX},${sampleTile.tileY}`;

    if (visitedTileKeys.has(tileKey)) {
      continue;
    }

    visitedTileKeys.add(tileKey);

    if (
      sampleTile.tileX === startTile.tileX &&
      sampleTile.tileY === startTile.tileY
    ) {
      continue;
    }

    const landingSurfaceLayer = resolvingWorldPlazaSurfaceLayerAtTileIndex(
      sampleTile.tileX,
      sampleTile.tileY,
      placedBlocks,
    );

    if (landingSurfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
      continue;
    }

    if (landingSurfaceLayer < fromLayer) {
      continue;
    }

    if (
      !checkingWorldBuildingCanJumpLandOnSurfaceLayer(
        fromLayer,
        landingSurfaceLayer,
      )
    ) {
      continue;
    }

    if (
      !checkingWorldBuildingTileHasStandablePlatformAtTileIndex(
        sampleTile.tileX,
        sampleTile.tileY,
        placedBlocks,
      )
    ) {
      continue;
    }

    const landingGridPoint =
      resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex(
        sampleTile.tileX,
        sampleTile.tileY,
        startGridPoint,
      );
    const forwardGridDistance =
      computingWorldBuildingJumpForwardGridDistanceToLandingPoint(
        startGridPoint,
        landingGridPoint,
        gridDirection,
      );

    if (
      forwardGridDistance <= 0 ||
      forwardGridDistance > maxForwardGridDistance
    ) {
      continue;
    }

    const candidate: ResolvingWorldBuildingJumpLandingPlatformCandidate = {
      forwardGridDistance,
      landingGridPoint,
      landingSurfaceLayer,
    };

    if (landingSurfaceLayer > fromLayer) {
      if (
        !bestElevatedCandidate ||
        forwardGridDistance >= bestElevatedCandidate.forwardGridDistance
      ) {
        bestElevatedCandidate = candidate;
      }

      continue;
    }

    if (
      !bestSameLevelCandidate ||
      forwardGridDistance >= bestSameLevelCandidate.forwardGridDistance
    ) {
      bestSameLevelCandidate = candidate;
    }
  }

  const bestCandidate = bestElevatedCandidate ?? bestSameLevelCandidate;

  if (!bestCandidate) {
    return null;
  }

  return {
    landingGridPoint: bestCandidate.landingGridPoint,
    landingSurfaceLayer: bestCandidate.landingSurfaceLayer,
    forwardGridDistance: bestCandidate.forwardGridDistance,
  };
}
