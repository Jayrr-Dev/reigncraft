import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex,
  checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { clampingWorldCollisionPointBeforeGridPointPredicate } from '@/components/world/collision';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex } from '@/components/world/domains/resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaPlayerCircleOverlapsTileSquare } from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import { resolvingWorldPlazaSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import {
  checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex,
  checkingWorldPlazaTerrainOccupiesWaterAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';

/**
 * Resolves jump landings along a path, snapping to water banks when needed.
 *
 * @module components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath
 */

/** Samples taken along a jump path when searching for a far-bank landing. */
const RESOLVING_WORLD_PLAZA_JUMP_LANDING_PATH_SAMPLE_COUNT = 32;

/** Minimum forward distance required for a jump to start. */
const RESOLVING_WORLD_PLAZA_JUMP_LANDING_MIN_FORWARD_GRID_DISTANCE = 0.04;

/** Resolved jump landing along the takeoff-to-target path. */
export interface ResolvingWorldPlazaJumpLandingGridPointAlongPathResult {
  /** Final landing position in grid space. */
  landingGridPoint: DefiningWorldPlazaWorldPoint;
  /** Surface layer on the landing tile. */
  landingSurfaceLayer: number;
  /** Forward distance from takeoff to the landing point. */
  forwardGridDistance: number;
}

/** Candidate far-bank landing along a jump path. */
interface ResolvingWorldPlazaJumpLandingFarBankCandidate {
  forwardGridDistance: number;
  landingGridPoint: DefiningWorldPlazaWorldPoint;
  landingSurfaceLayer: number;
}

/**
 * Returns forward distance from takeoff to a landing point along a unit direction.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param landingGridPoint - Landing point in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 */
function computingWorldPlazaJumpForwardGridDistanceToLandingPoint(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  landingGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint
): number {
  return (
    (landingGridPoint.x - startGridPoint.x) * gridDirection.x +
    (landingGridPoint.y - startGridPoint.y) * gridDirection.y
  );
}

/** Tile rings scanned around a landing point for footprint overlap with water. */
const RESOLVING_WORLD_PLAZA_JUMP_LANDING_WATER_CIRCLE_OVERLAP_SCAN_RING = 1;

/**
 * Returns true when the player footprint circle overlaps water on any nearby tile.
 *
 * @param gridPoint - Candidate landing position in grid space.
 * @param placedBlocks - Player-placed blocks near the landing point.
 */
function checkingWorldPlazaGridPointPlayerCircleOverlapsJumpLandingWaterAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  const centerTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  for (
    let offsetTileY =
      -RESOLVING_WORLD_PLAZA_JUMP_LANDING_WATER_CIRCLE_OVERLAP_SCAN_RING;
    offsetTileY <=
    RESOLVING_WORLD_PLAZA_JUMP_LANDING_WATER_CIRCLE_OVERLAP_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX =
        -RESOLVING_WORLD_PLAZA_JUMP_LANDING_WATER_CIRCLE_OVERLAP_SCAN_RING;
      offsetTileX <=
      RESOLVING_WORLD_PLAZA_JUMP_LANDING_WATER_CIRCLE_OVERLAP_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
          gridPoint,
          DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
          tileX,
          tileY
        )
      ) {
        continue;
      }

      if (
        checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(tileX, tileY) ||
        checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
          tileX,
          tileY,
          placedBlocks
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Pulls a landing point back toward takeoff until the footprint clears water.
 *
 * @param landingGridPoint - Candidate landing position in grid space.
 * @param startGridPoint - Takeoff position in grid space.
 * @param placedBlocks - Blocks near the landing point.
 */
function nudgingWorldPlazaJumpLandingGridPointClearOfWaterCircleOverlap(
  landingGridPoint: DefiningWorldPlazaWorldPoint,
  startGridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): DefiningWorldPlazaWorldPoint {
  if (
    !checkingWorldPlazaGridPointPlayerCircleOverlapsJumpLandingWaterAtGridPoint(
      landingGridPoint,
      placedBlocks
    )
  ) {
    return landingGridPoint;
  }

  return clampingWorldCollisionPointBeforeGridPointPredicate(
    startGridPoint,
    landingGridPoint,
    (gridPoint) =>
      checkingWorldPlazaGridPointPlayerCircleOverlapsJumpLandingWaterAtGridPoint(
        gridPoint,
        placedBlocks
      )
  );
}

/**
 * Returns true when a grid point would land on procedural or placed water.
 *
 * @param gridPoint - Candidate landing position in grid space.
 * @param placedBlocks - Player-placed blocks near the landing point.
 */
function checkingWorldPlazaGridPointOccupiesJumpLandingWaterAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  if (
    checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    )
  ) {
    return true;
  }

  return checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedBlocks
  );
}

/**
 * Returns true when a grid point is blocked for jump landing.
 *
 * @param gridPoint - Candidate landing position in grid space.
 * @param placedBlocks - Player-placed blocks near the landing point.
 * @param fromLayer - Player layer at takeoff.
 */
function checkingWorldPlazaGridPointBlocksJumpLandingAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  jumpLayerReachMax?: number
): boolean {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  return (
    checkingWorldPlazaTerrainBlocksJumpLandingAtTileIndex(
      standingTile.tileX,
      standingTile.tileY
    ) ||
    checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
      standingTile.tileX,
      standingTile.tileY,
      placedBlocks,
      fromLayer,
      jumpLayerReachMax
    )
  );
}

/**
 * Returns true when a grid point is blocked for jump landing by non-water terrain.
 *
 * @param gridPoint - Candidate landing position in grid space.
 * @param placedBlocks - Player-placed blocks near the landing point.
 * @param fromLayer - Player layer at takeoff.
 */
function checkingWorldPlazaGridPointBlocksJumpLandingExceptWaterAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  jumpLayerReachMax?: number
): boolean {
  if (
    checkingWorldPlazaGridPointOccupiesJumpLandingWaterAtGridPoint(
      gridPoint,
      placedBlocks
    )
  ) {
    return false;
  }

  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  // Column rocks no longer block far-bank landings: their standable top is a
  // valid landing surface, and unreachable height is rejected by the placed
  // block surface-layer jump-reach check below.
  return checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
    standingTile.tileX,
    standingTile.tileY,
    placedBlocks,
    fromLayer,
    jumpLayerReachMax
  );
}

/**
 * Builds a resolved landing result from a grid point and takeoff direction.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param landingGridPoint - Landing position in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 * @param placedBlocks - Blocks near the landing point.
 */
function buildingWorldPlazaJumpLandingGridPointAlongPathResult(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  landingGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): ResolvingWorldPlazaJumpLandingGridPointAlongPathResult {
  const clearedLandingGridPoint =
    nudgingWorldPlazaJumpLandingGridPointClearOfWaterCircleOverlap(
      landingGridPoint,
      startGridPoint,
      placedBlocks
    );
  const landingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(
    clearedLandingGridPoint
  );

  return {
    landingGridPoint: clearedLandingGridPoint,
    landingSurfaceLayer: resolvingWorldPlazaSurfaceLayerAtTileIndex(
      landingTile.tileX,
      landingTile.tileY,
      placedBlocks
    ),
    forwardGridDistance:
      computingWorldPlazaJumpForwardGridDistanceToLandingPoint(
        startGridPoint,
        clearedLandingGridPoint,
        gridDirection
      ),
  };
}

/**
 * Finds the furthest dry landing after crossing water along the jump path.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 * @param maxForwardGridDistance - Maximum jump distance in grid units.
 * @param placedBlocks - Blocks near the jump path.
 * @param fromLayer - Player layer at takeoff.
 */
function findingWorldPlazaJumpLandingFarBankCandidateAlongPath(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
  maxForwardGridDistance: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  jumpLayerReachMax?: number
): ResolvingWorldPlazaJumpLandingFarBankCandidate | null {
  const startTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(startGridPoint);
  const visitedTileKeys = new Set<string>();
  let hasCrossedWater = false;
  let bestFarBankCandidate: ResolvingWorldPlazaJumpLandingFarBankCandidate | null =
    null;

  for (
    let sampleIndex = 1;
    sampleIndex <= RESOLVING_WORLD_PLAZA_JUMP_LANDING_PATH_SAMPLE_COUNT;
    sampleIndex += 1
  ) {
    const sampleDistance =
      (maxForwardGridDistance * sampleIndex) /
      RESOLVING_WORLD_PLAZA_JUMP_LANDING_PATH_SAMPLE_COUNT;
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

    if (
      checkingWorldPlazaGridPointOccupiesJumpLandingWaterAtGridPoint(
        sampleGridPoint,
        placedBlocks
      )
    ) {
      hasCrossedWater = true;
      continue;
    }

    if (
      checkingWorldPlazaGridPointBlocksJumpLandingExceptWaterAtGridPoint(
        sampleGridPoint,
        placedBlocks,
        fromLayer,
        jumpLayerReachMax
      )
    ) {
      continue;
    }

    if (!hasCrossedWater) {
      continue;
    }

    const landingGridPoint =
      resolvingWorldPlazaIsometricTileEntryEdgeGridPointAtIndex(
        sampleTile.tileX,
        sampleTile.tileY,
        startGridPoint
      );
    const forwardGridDistance =
      computingWorldPlazaJumpForwardGridDistanceToLandingPoint(
        startGridPoint,
        landingGridPoint,
        gridDirection
      );

    if (
      forwardGridDistance <=
        RESOLVING_WORLD_PLAZA_JUMP_LANDING_MIN_FORWARD_GRID_DISTANCE ||
      forwardGridDistance > maxForwardGridDistance
    ) {
      continue;
    }

    if (
      !bestFarBankCandidate ||
      forwardGridDistance >= bestFarBankCandidate.forwardGridDistance
    ) {
      bestFarBankCandidate = {
        forwardGridDistance,
        landingGridPoint,
        landingSurfaceLayer: resolvingWorldPlazaSurfaceLayerAtTileIndex(
          sampleTile.tileX,
          sampleTile.tileY,
          placedBlocks
        ),
      };
    }
  }

  return bestFarBankCandidate;
}

/**
 * Resolves a jump landing, snapping to the near or far water bank when needed.
 *
 * When the requested landing is over water, the jump still runs but the avatar
 * stops on the last dry tile edge along the path. When the path crosses water
 * and dry land exists within jump range on the far side, the landing snaps to
 * that bank instead.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 * @param maxForwardGridDistance - Maximum jump distance in grid units.
 * @param placedBlocks - Blocks near the jump path.
 * @param fromLayer - Player layer at takeoff.
 */
export function resolvingWorldPlazaJumpLandingGridPointAlongPath(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
  maxForwardGridDistance: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  jumpLayerReachMax?: number
): ResolvingWorldPlazaJumpLandingGridPointAlongPathResult | null {
  const intendedLandingGridPoint: DefiningWorldPlazaWorldPoint = {
    x: startGridPoint.x + gridDirection.x * maxForwardGridDistance,
    y: startGridPoint.y + gridDirection.y * maxForwardGridDistance,
  };

  if (
    !checkingWorldPlazaGridPointBlocksJumpLandingAtGridPoint(
      intendedLandingGridPoint,
      placedBlocks,
      fromLayer,
      jumpLayerReachMax
    )
  ) {
    return buildingWorldPlazaJumpLandingGridPointAlongPathResult(
      startGridPoint,
      intendedLandingGridPoint,
      gridDirection,
      placedBlocks
    );
  }

  if (
    !checkingWorldPlazaGridPointOccupiesJumpLandingWaterAtGridPoint(
      intendedLandingGridPoint,
      placedBlocks
    )
  ) {
    return null;
  }

  const farBankCandidate =
    findingWorldPlazaJumpLandingFarBankCandidateAlongPath(
      startGridPoint,
      gridDirection,
      maxForwardGridDistance,
      placedBlocks,
      fromLayer,
      jumpLayerReachMax
    );

  if (farBankCandidate) {
    return {
      landingGridPoint: farBankCandidate.landingGridPoint,
      landingSurfaceLayer: farBankCandidate.landingSurfaceLayer,
      forwardGridDistance: farBankCandidate.forwardGridDistance,
    };
  }

  const nearBankLandingGridPoint =
    clampingWorldCollisionPointBeforeGridPointPredicate(
      startGridPoint,
      intendedLandingGridPoint,
      (gridPoint) =>
        checkingWorldPlazaGridPointPlayerCircleOverlapsJumpLandingWaterAtGridPoint(
          gridPoint,
          placedBlocks
        )
    );
  const nearBankForwardGridDistance =
    computingWorldPlazaJumpForwardGridDistanceToLandingPoint(
      startGridPoint,
      nearBankLandingGridPoint,
      gridDirection
    );

  if (
    nearBankForwardGridDistance <=
    RESOLVING_WORLD_PLAZA_JUMP_LANDING_MIN_FORWARD_GRID_DISTANCE
  ) {
    return null;
  }

  return buildingWorldPlazaJumpLandingGridPointAlongPathResult(
    startGridPoint,
    nearBankLandingGridPoint,
    gridDirection,
    placedBlocks
  );
}
