import {
  checkingWorldBuildingGridPointBlockedByPlacedBlocks,
  checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex,
  checkingWorldBuildingPlayerCircleOverlapsPlacedBlockColliders,
  listingWorldBuildingPlacedBlocksNearTileIndex,
  resolvingWorldBuildingPlacedBlockCollisionPushOut,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import { pushingWorldCollisionPointOutsideCircularCollider } from '@/components/world/collision/domains/computingWorldCollisionShapeGeometry';
import type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
import { checkingWorldPlazaNearbyColumnRockBaseDiamondBlocksPlayerAtGridPoint } from '@/components/world/domains/checkingWorldPlazaNearbyColumnRockBaseDiamondBlocksPlayerAtGridPoint';
import type { CheckingWorldPlazaTerrainElevationColumnCollisionContext } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import {
  checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex,
  checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer,
} from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { convertingWorldPlazaIsometricScreenPointToGridPoint } from '@/components/world/domains/convertingWorldPlazaIsometricScreenPointToGridPoint';
import { DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_SEARCH_MAX_RADIUS } from '@/components/world/domains/definingWorldPlazaPlayerBlockEjectConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS,
  DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_END_PROGRESS,
  DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_START_PROGRESS,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE,
  DEFINING_WORLD_PLAZA_TERRAIN_TILE_CLAMP_BINARY_SEARCH_STEPS,
  DEFINING_WORLD_PLAZA_TERRAIN_TILE_EDGE_EXIT_EPSILON,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import { recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced } from '@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced';
import {
  resolvingWorldPlazaColumnRockBaseDiamondFromMetadata,
  resolvingWorldPlazaPointPushedOutsideColumnRockBaseDiamond,
} from '@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata';
import type { DefiningWorldPlazaColumnRockMetadata } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaFirelandsBlockingPropAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import {
  checkingWorldPlazaPlayerCircleOverlapsTileSquare,
  pushingWorldPlazaPlayerCircleOutsideTileSquare,
} from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import {
  checkingWorldPlazaTerrainBlocksWalkingAtTileIndex,
  checkingWorldPlazaTerrainOccupiesWaterAtTileIndex,
  resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex,
  resolvingWorldPlazaTerrainObstacleKindAtTileIndex,
  resolvingWorldPlazaTerrainObstacleKindFromStoneSizeTierIndex,
  resolvingWorldPlazaTerrainObstacleKindFromWaterKind,
} from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/**
 * Unified plaza collision resolver: push-out, clamp, eject.
 *
 * @module components/world/collision/domains/resolvingWorldCollisionBlockedPoint
 */

/** Below this grid distance the push direction is treated as degenerate. */
const RESOLVING_WORLD_PLAZA_BLOCKED_WORLD_POINT_MIN_PUSH_DISTANCE = 1e-4;

/** Options for collision resolution. */
export type DefiningWorldCollisionOptions = DefiningWorldCollisionContext;

/** @deprecated Use {@link DefiningWorldCollisionOptions}. */
export type ResolvingWorldPlazaBlockedWorldPointOptions =
  DefiningWorldCollisionOptions;

function resolvingWorldCollisionBlockedWorldPointPlayerRadiusGrid(
  options: DefiningWorldCollisionOptions
): number {
  return (
    options.playerRadiusGrid ??
    DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
  );
}

/**
 * Returns true when full block collision should apply this frame.
 *
 * @param options - Jump state for the current frame.
 */
function checkingWorldCollisionBlockedPointShouldApplyBlockCollision(
  options: DefiningWorldCollisionOptions
): boolean {
  if (!options.isJumping) {
    return true;
  }

  const jumpProgress = options.jumpProgress ?? 0;

  return (
    jumpProgress <=
      DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_START_PROGRESS ||
    jumpProgress >=
      DEFINING_WORLD_PLAZA_TERRAIN_JUMP_BLOCK_COLLISION_END_PROGRESS
  );
}

/**
 * Pushes the player footprint outside a circular collider centered on a tile.
 *
 * The contact distance is the Minkowski sum of the obstacle radius and the
 * player footprint radius, so the avatar center stops one footprint short of
 * the obstacle edge instead of overlapping it.
 *
 * @param resolvedX - Current resolved X.
 * @param resolvedY - Current resolved Y.
 * @param centerX - Collider center X in grid space.
 * @param centerY - Collider center Y in grid space.
 * @param collisionRadiusGrid - Collider radius in grid tiles.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
function pushingWorldPlazaPointOutsideCircularCollider(
  resolvedX: number,
  resolvedY: number,
  centerX: number,
  centerY: number,
  collisionRadiusGrid: number,
  playerRadiusGrid: number = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
): DefiningWorldPlazaWorldPoint {
  return pushingWorldCollisionPointOutsideCircularCollider(
    resolvedX,
    resolvedY,
    centerX,
    centerY,
    collisionRadiusGrid,
    playerRadiusGrid
  );
}

/**
 * Pushes a point off a rock collider when the avatar overlaps its circle.
 *
 * @param resolved - Current resolved position.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerLayer - Current player standing layer.
 */
function pushingWorldPlazaPointOffRockCollider(
  resolved: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number
): DefiningWorldPlazaWorldPoint {
  const rockRadiusGrid = resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex(
    tileX,
    tileY
  );

  if (rockRadiusGrid === null) {
    return resolved;
  }

  // Standing on (or above) the boulder top: it supports the player like a placed
  // block, so the side collider releases and the player walks across the top.
  if (
    playerLayer >=
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(tileX, tileY)
  ) {
    return resolved;
  }

  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    tileX,
    tileY
  );

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    if (!applyBlockCollision) {
      return resolved;
    }
  } else if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
    isJumping
  ) {
    return resolved;
  } else if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE
  ) {
    return resolved;
  }

  return pushingWorldPlazaPointOutsideCircularCollider(
    resolved.x,
    resolved.y,
    tileX,
    tileY,
    rockRadiusGrid
  );
}

/**
 * Returns true when procedural or placed stream water occupies the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Player-placed blocks near the tile.
 */
function checkingWorldPlazaTileIndexOccupiesWalkingBlockedWaterAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  if (checkingWorldPlazaTerrainOccupiesWaterAtTileIndex(tileX, tileY)) {
    return true;
  }

  return checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
    tileX,
    tileY,
    placedBlocks
  );
}

/**
 * Pushes the player footprint circle off a water tile square.
 *
 * Jump landings snap to a point before water, but the avatar footprint can
 * still overlap the stream edge and block all walking until another jump.
 *
 * @param resolved - Current resolved position.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Player-placed blocks near the tile.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 */
function pushingWorldPlazaPointOffWaterTileCollider(
  resolved: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerRadiusGrid: number = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
): DefiningWorldPlazaWorldPoint {
  if (
    !checkingWorldPlazaTileIndexOccupiesWalkingBlockedWaterAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    )
  ) {
    return resolved;
  }

  const proceduralWater = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);
  const obstacleKind = proceduralWater
    ? resolvingWorldPlazaTerrainObstacleKindFromWaterKind(proceduralWater.kind)
    : DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER;

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    if (!applyBlockCollision) {
      return resolved;
    }
  } else if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
    isJumping
  ) {
    return resolved;
  }

  if (
    !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
      resolved,
      playerRadiusGrid,
      tileX,
      tileY
    )
  ) {
    return resolved;
  }

  return pushingWorldPlazaPlayerCircleOutsideTileSquare(
    resolved,
    playerRadiusGrid,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_TILE_EDGE_EXIT_EPSILON
  );
}

/**
 * Pushes a point off a column-rock base diamond when the avatar overlaps it.
 *
 * Footprint tiles outside the rock face stay walkable. The orange diamond
 * contact boundary still resolves movement below the boulder top.
 *
 * @param resolved - Current resolved position.
 * @param metadata - Anchor column-rock metadata.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerLayer - Current player standing layer.
 */
function pushingWorldPlazaPointOffColumnRockBaseDiamondCollider(
  resolved: DefiningWorldPlazaWorldPoint,
  metadata: DefiningWorldPlazaColumnRockMetadata,
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number
): DefiningWorldPlazaWorldPoint {
  const rockSurfaceLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
      metadata.anchorTileX,
      metadata.anchorTileY
    );

  if (playerLayer >= rockSurfaceLayer) {
    return resolved;
  }

  const obstacleKind =
    resolvingWorldPlazaTerrainObstacleKindFromStoneSizeTierIndex(
      metadata.sizeTierIndex
    );

  if (obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    if (!applyBlockCollision) {
      return resolved;
    }
  } else if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
    isJumping
  ) {
    return resolved;
  } else if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE
  ) {
    return resolved;
  }

  const baseDiamond =
    resolvingWorldPlazaColumnRockBaseDiamondFromMetadata(metadata);

  return resolvingWorldPlazaPointPushedOutsideColumnRockBaseDiamond(
    baseDiamond,
    resolved.x,
    resolved.y,
    DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID
  );
}

/**
 * Pushes a point off every nearby column-rock diamond that overlaps it.
 *
 * @param resolved - Current resolved position.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerLayer - Current player standing layer.
 */
function pushingWorldPlazaPointOffNearbyColumnRockBaseDiamondColliders(
  resolved: DefiningWorldPlazaWorldPoint,
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number
): DefiningWorldPlazaWorldPoint {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(resolved);
  const seenAnchorKeys = new Set<string>();
  let pushedPosition = resolved;

  for (
    let offsetTileY =
      -DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS;
    offsetTileY <=
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX =
        -DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS;
      offsetTileX <=
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_COLLISION_SEARCH_TILE_RADIUS;
      offsetTileX += 1
    ) {
      const tileX = standingTile.tileX + offsetTileX;
      const tileY = standingTile.tileY + offsetTileY;
      const columnRockMetadata =
        resolvingWorldPlazaColumnRockMetadataAtTileIndex(tileX, tileY);

      if (!columnRockMetadata) {
        continue;
      }

      const anchorKey = formattingWorldPlazaTileIndexCacheKey(
        columnRockMetadata.anchorTileX,
        columnRockMetadata.anchorTileY
      );

      if (seenAnchorKeys.has(anchorKey)) {
        continue;
      }

      seenAnchorKeys.add(anchorKey);
      pushedPosition = pushingWorldPlazaPointOffColumnRockBaseDiamondCollider(
        pushedPosition,
        columnRockMetadata,
        applyBlockCollision,
        isJumping,
        playerLayer
      );
    }
  }

  return pushedPosition;
}

/**
 * Builds terrain column collision context from blocked-world-point options.
 *
 * @param options - Collision options for the current frame.
 */
function resolvingWorldCollisionTerrainElevationColumnCollisionContextFromOptions(
  options: DefiningWorldCollisionOptions
): CheckingWorldPlazaTerrainElevationColumnCollisionContext | undefined {
  if (!options.playerCenter || !options.movementDelta) {
    return undefined;
  }

  return {
    playerCenterX: options.playerCenter.x,
    playerCenterY: options.playerCenter.y,
    movementDeltaX: options.movementDelta.x,
    movementDeltaY: options.movementDelta.y,
  };
}

/**
 * Returns true when the tile under a grid point blocks walking.
 *
 * Uses the single tile whose drawn diamond contains the point.
 *
 * @param gridPoint - Position in grid space.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param placedBlocks - Player-placed blocks near the avatar.
 * @param playerLayer - Current player standing layer.
 * @param terrainColumnCollisionContext - Ledge lip relief context.
 * @param includePlacedBlocks - When false, skips placed-block tile checks.
 */
function checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
  gridPoint: DefiningWorldPlazaWorldPoint,
  applyBlockCollision: boolean,
  isJumping: boolean,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(gridPoint),
  terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext,
  includePlacedBlocks = true
): boolean {
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  if (
    checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer(
      standingTile.tileX,
      standingTile.tileY,
      playerLayer
    )
  ) {
    return checkingWorldPlazaNearbyColumnRockBaseDiamondBlocksPlayerAtGridPoint(
      gridPoint,
      playerLayer,
      applyBlockCollision
    );
  }

  if (
    includePlacedBlocks &&
    checkingWorldBuildingGridPointBlockedByPlacedBlocks(
      gridPoint,
      placedBlocks,
      applyBlockCollision,
      isJumping,
      playerLayer
    )
  ) {
    return true;
  }

  if (
    checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
      standingTile.tileX,
      standingTile.tileY,
      playerLayer,
      applyBlockCollision,
      terrainColumnCollisionContext
    )
  ) {
    return true;
  }

  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    standingTile.tileX,
    standingTile.tileY
  );

  if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK &&
    applyBlockCollision
  ) {
    return true;
  }

  if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
    !isJumping
  ) {
    return true;
  }

  return false;
}

/** Tile rings to scan around the footprint center for circle overlap. */
const RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_OVERLAP_SCAN_RING = 1;

/**
 * Returns true when the player footprint circle overlaps any blocked tile.
 *
 * Extends {@link checkingWorldPlazaGridPointStandsOnWalkingBlockedTile} from a
 * point test to a footprint test so movement stops one radius before a wall.
 * Falls back to the point test when the footprint radius is zero.
 *
 * @param center - Player footprint center in grid space.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param placedBlocks - Player-placed blocks near the avatar.
 * @param playerLayer - Current player standing layer.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 * @param terrainColumnCollisionContext - Ledge lip relief context.
 */
function checkingWorldPlazaPlayerCircleOverlapsWalkingBlockedTile(
  center: DefiningWorldPlazaWorldPoint,
  applyBlockCollision: boolean,
  isJumping: boolean,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(center),
  playerRadiusGrid: number = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
  terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext
): boolean {
  if (playerRadiusGrid <= 0) {
    return checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
      center,
      applyBlockCollision,
      isJumping,
      placedBlocks,
      playerLayer,
      terrainColumnCollisionContext
    );
  }

  if (
    checkingWorldPlazaNearbyColumnRockBaseDiamondBlocksPlayerAtGridPoint(
      center,
      playerLayer,
      applyBlockCollision
    )
  ) {
    return true;
  }

  if (
    checkingWorldBuildingPlayerCircleOverlapsPlacedBlockColliders(
      center,
      placedBlocks,
      applyBlockCollision,
      isJumping,
      playerLayer,
      playerRadiusGrid
    )
  ) {
    return true;
  }

  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);

  for (
    let offsetTileY = -RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_OVERLAP_SCAN_RING;
    offsetTileY <= RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_OVERLAP_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX = -RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_OVERLAP_SCAN_RING;
      offsetTileX <= RESOLVING_WORLD_PLAZA_PLAYER_CIRCLE_OVERLAP_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
          center,
          playerRadiusGrid,
          tileX,
          tileY
        )
      ) {
        continue;
      }

      if (
        checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex(
          tileX,
          tileY
        )
      ) {
        continue;
      }

      if (
        checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
          { x: tileX, y: tileY, layer: playerLayer },
          applyBlockCollision,
          isJumping,
          placedBlocks,
          playerLayer,
          terrainColumnCollisionContext,
          false
        )
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Finds the nearest walkable tile center when a grid point remains blocked.
 *
 * @param blockedPosition - Position that still overlaps a collider.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param placedBlocks - Player-placed blocks near the avatar.
 * @param playerLayer - Current player standing layer.
 */
function resolvingWorldPlazaNearestWalkableGridPointAroundBlockedPosition(
  blockedPosition: DefiningWorldPlazaWorldPoint,
  applyBlockCollision: boolean,
  isJumping: boolean,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  playerLayer: number
): DefiningWorldPlazaWorldPoint | null {
  const originTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(blockedPosition);

  for (
    let searchTileRadius = 1;
    searchTileRadius <=
    DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_SEARCH_MAX_RADIUS;
    searchTileRadius += 1
  ) {
    let nearestWalkablePoint: DefiningWorldPlazaWorldPoint | null = null;
    let nearestDistanceSquared = Number.POSITIVE_INFINITY;

    for (
      let offsetTileY = -searchTileRadius;
      offsetTileY <= searchTileRadius;
      offsetTileY += 1
    ) {
      for (
        let offsetTileX = -searchTileRadius;
        offsetTileX <= searchTileRadius;
        offsetTileX += 1
      ) {
        const chebyshevDistance = Math.max(
          Math.abs(offsetTileX),
          Math.abs(offsetTileY)
        );

        if (chebyshevDistance !== searchTileRadius) {
          continue;
        }

        const candidatePoint: DefiningWorldPlazaWorldPoint = {
          x: originTile.tileX + offsetTileX,
          y: originTile.tileY + offsetTileY,
          layer: playerLayer,
        };

        if (
          checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
            candidatePoint,
            applyBlockCollision,
            isJumping,
            placedBlocks,
            playerLayer
          )
        ) {
          continue;
        }

        const deltaX = candidatePoint.x - blockedPosition.x;
        const deltaY = candidatePoint.y - blockedPosition.y;
        const distanceSquared = deltaX * deltaX + deltaY * deltaY;

        if (distanceSquared >= nearestDistanceSquared) {
          continue;
        }

        nearestDistanceSquared = distanceSquared;
        nearestWalkablePoint = candidatePoint;
      }
    }

    if (nearestWalkablePoint) {
      return nearestWalkablePoint;
    }
  }

  return null;
}

/**
 * Ejects an avatar from solid blocks when push-out alone leaves them overlapping.
 *
 * @param desired - Candidate avatar grid position.
 * @param options - Collision and ejection options.
 */
export function resolvingWorldCollisionEjectingPlayerFromBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  const movementFrom = options.fallbackPosition ?? desired;
  const resolvedPosition = resolvingWorldCollisionBlockedWorldPoint(
    desired,
    options
  );
  const applyBlockCollision =
    checkingWorldCollisionBlockedPointShouldApplyBlockCollision(options);
  const isJumping = options.isJumping ?? false;
  const placedBlocks = options.placedBlocks ?? [];
  const placedBlocksByTile = options.placedBlocksByTile;
  const playerLayer =
    options.playerLayer ??
    resolvingWorldPlazaPlayerWorldLayer(resolvedPosition);
  const terrainColumnCollisionContext =
    resolvingWorldCollisionTerrainElevationColumnCollisionContextFromOptions(
      options
    );
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(resolvedPosition);
  const nearbyPlacedBlocks = listingWorldBuildingPlacedBlocksNearTileIndex(
    placedBlocks,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS,
    placedBlocksByTile
  );
  let finalPosition = resolvedPosition;

  if (
    checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
      resolvedPosition,
      applyBlockCollision,
      isJumping,
      nearbyPlacedBlocks,
      playerLayer,
      terrainColumnCollisionContext
    )
  ) {
    const ejectedPosition =
      resolvingWorldPlazaNearestWalkableGridPointAroundBlockedPosition(
        resolvedPosition,
        applyBlockCollision,
        isJumping,
        nearbyPlacedBlocks,
        playerLayer
      );

    if (ejectedPosition) {
      finalPosition = resolvingWorldCollisionBlockedWorldPoint(
        ejectedPosition,
        {
          ...options,
          fallbackPosition: undefined,
        }
      );
    }
  }

  recordingWorldPlazaTerrainCollisionBlockerHitWhenMovementReduced(
    movementFrom,
    desired,
    finalPosition,
    {
      applyBlockCollision,
      isJumping,
      placedBlocks: nearbyPlacedBlocks,
      playerLayer,
      terrainColumnCollisionContext,
    }
  );

  return finalPosition;
}

/**
 * Stops a move at the visible edge of the first tile that matches a predicate.
 *
 * Binary search runs in screen space so the stop line matches click-walk
 * movement, which advances with uniform screen speed.
 *
 * @param from - Last known valid position (segment start).
 * @param to - Desired position (segment end).
 * @param checkingGridPointBlocked - Returns true when the point is blocked.
 */
export function clampingWorldCollisionPointBeforeGridPointPredicate(
  from: DefiningWorldPlazaWorldPoint,
  to: DefiningWorldPlazaWorldPoint,
  checkingGridPointBlocked: (gridPoint: DefiningWorldPlazaWorldPoint) => boolean
): DefiningWorldPlazaWorldPoint {
  if (!checkingGridPointBlocked(to)) {
    return to;
  }

  if (checkingGridPointBlocked(from)) {
    return from;
  }

  const fromScreen = convertingWorldPlazaGridPointToIsometricScreenPoint(from);
  const toScreen = convertingWorldPlazaGridPointToIsometricScreenPoint(to);
  const deltaScreenX = toScreen.x - fromScreen.x;
  const deltaScreenY = toScreen.y - fromScreen.y;
  let lastValidFraction = 0;
  let firstBlockedFraction = 1;

  for (
    let stepIndex = 0;
    stepIndex < DEFINING_WORLD_PLAZA_TERRAIN_TILE_CLAMP_BINARY_SEARCH_STEPS;
    stepIndex += 1
  ) {
    const midFraction = (lastValidFraction + firstBlockedFraction) / 2;
    const midpointGrid = convertingWorldPlazaIsometricScreenPointToGridPoint({
      x: fromScreen.x + deltaScreenX * midFraction,
      y: fromScreen.y + deltaScreenY * midFraction,
    });

    if (checkingGridPointBlocked(midpointGrid)) {
      firstBlockedFraction = midFraction;
    } else {
      lastValidFraction = midFraction;
    }
  }

  return convertingWorldPlazaIsometricScreenPointToGridPoint({
    x: fromScreen.x + deltaScreenX * lastValidFraction,
    y: fromScreen.y + deltaScreenY * lastValidFraction,
  });
}

/**
 * Stops a move at the visible edge of the first blocked tile it would enter.
 *
 * Binary search runs in screen space so the stop line matches click-walk
 * movement, which advances with uniform screen speed.
 *
 * @param from - Last known walkable position (segment start).
 * @param to - Desired position this frame (segment end).
 * @param applyBlockCollision - Whether full block collision is active.
 * @param placedBlocks - Player-placed blocks near the avatar.
 * @param playerLayer - Current player standing layer.
 * @param terrainColumnCollisionContext - Ledge lip relief context.
 */
function clampingWorldPlazaPointBeforeBlockedTile(
  from: DefiningWorldPlazaWorldPoint,
  to: DefiningWorldPlazaWorldPoint,
  applyBlockCollision: boolean,
  isJumping: boolean,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = [],
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(from),
  terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext
): DefiningWorldPlazaWorldPoint {
  return clampingWorldCollisionPointBeforeGridPointPredicate(
    from,
    to,
    (gridPoint) =>
      checkingWorldPlazaPlayerCircleOverlapsWalkingBlockedTile(
        gridPoint,
        applyBlockCollision,
        isJumping,
        placedBlocks,
        playerLayer,
        DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
        terrainColumnCollisionContext
      )
  );
}

/**
 * Clamps a click-walk target to the nearest walkable point along the path.
 *
 * When the pointer is over water, returns the bank edge instead of rejecting
 * the target so the avatar can walk all the way to the river.
 *
 * @param from - Current avatar position.
 * @param to - Raw click destination in grid space.
 * @param isJumping - True while a jump animation is active.
 * @param placedBlocks - Player-placed blocks considered before terrain.
 */
export function clampingWorldCollisionWalkTargetToWalkableGridPoint(
  from: DefiningWorldPlazaWorldPoint,
  to: DefiningWorldPlazaWorldPoint,
  isJumping = false,
  placedBlocks: DefiningWorldBuildingPlacedBlock[] = []
): DefiningWorldPlazaWorldPoint {
  return clampingWorldPlazaPointBeforeBlockedTile(
    from,
    to,
    true,
    isJumping,
    placedBlocks
  );
}

/**
 * Returns a position with tree, water, and rock overlap resolved.
 *
 * @param desired - Candidate avatar grid position for this frame.
 * @param options - Jump state for the current frame.
 */
export function resolvingWorldCollisionBlockedWorldPoint(
  desired: DefiningWorldPlazaWorldPoint,
  options: DefiningWorldCollisionOptions = {}
): DefiningWorldPlazaWorldPoint {
  let resolvedX = desired.x;
  let resolvedY = desired.y;
  const applyBlockCollision =
    checkingWorldCollisionBlockedPointShouldApplyBlockCollision(options);
  const isJumping = options.isJumping ?? false;
  const placedBlocks = options.placedBlocks ?? [];
  const placedBlocksByTile = options.placedBlocksByTile;
  const playerLayer =
    options.playerLayer ?? resolvingWorldPlazaPlayerWorldLayer(desired);
  const terrainColumnCollisionContext =
    resolvingWorldCollisionTerrainElevationColumnCollisionContextFromOptions(
      options
    );
  const playerRadiusGrid =
    resolvingWorldCollisionBlockedWorldPointPlayerRadiusGrid(options);

  const standingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint({
    x: resolvedX,
    y: resolvedY,
  });
  const baseTileX = standingTile.tileX;
  const baseTileY = standingTile.tileY;
  const nearbyPlacedBlocks = listingWorldBuildingPlacedBlocksNearTileIndex(
    placedBlocks,
    baseTileX,
    baseTileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS,
    placedBlocksByTile
  );

  const pushedPlacedBlockPosition =
    resolvingWorldBuildingPlacedBlockCollisionPushOut(
      { x: resolvedX, y: resolvedY },
      nearbyPlacedBlocks,
      applyBlockCollision,
      isJumping,
      playerLayer
    );
  resolvedX = pushedPlacedBlockPosition.x;
  resolvedY = pushedPlacedBlockPosition.y;

  const pushedColumnRockPosition =
    pushingWorldPlazaPointOffNearbyColumnRockBaseDiamondColliders(
      { x: resolvedX, y: resolvedY },
      applyBlockCollision,
      isJumping,
      playerLayer
    );
  resolvedX = pushedColumnRockPosition.x;
  resolvedY = pushedColumnRockPosition.y;

  for (
    let offsetTileY =
      -DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS;
    offsetTileY <= DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX =
        -DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS;
      offsetTileX <= DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS;
      offsetTileX += 1
    ) {
      const tileX = baseTileX + offsetTileX;
      const tileY = baseTileY + offsetTileY;

      const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
        tileX,
        tileY,
        nearbyPlacedBlocks
      );

      if (tree) {
        const pushedPosition = pushingWorldPlazaPointOutsideCircularCollider(
          resolvedX,
          resolvedY,
          tree.tileX,
          tree.tileY,
          resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(tree)
        );
        resolvedX = pushedPosition.x;
        resolvedY = pushedPosition.y;
      }

      const firelandsProp = resolvingWorldPlazaFirelandsBlockingPropAtTileIndex(
        tileX,
        tileY
      );

      if (firelandsProp) {
        const pushedPosition = pushingWorldPlazaPointOutsideCircularCollider(
          resolvedX,
          resolvedY,
          firelandsProp.anchorTileX,
          firelandsProp.anchorTileY,
          firelandsProp.collisionRadiusGrid
        );
        resolvedX = pushedPosition.x;
        resolvedY = pushedPosition.y;
      }

      if (!checkingWorldPlazaTerrainBlocksWalkingAtTileIndex(tileX, tileY)) {
        const pushedWaterPosition = pushingWorldPlazaPointOffWaterTileCollider(
          { x: resolvedX, y: resolvedY },
          tileX,
          tileY,
          nearbyPlacedBlocks,
          applyBlockCollision,
          isJumping,
          playerRadiusGrid
        );
        resolvedX = pushedWaterPosition.x;
        resolvedY = pushedWaterPosition.y;
        continue;
      }

      const pushedPosition = pushingWorldPlazaPointOffRockCollider(
        { x: resolvedX, y: resolvedY },
        tileX,
        tileY,
        applyBlockCollision,
        isJumping,
        playerLayer
      );
      resolvedX = pushedPosition.x;
      resolvedY = pushedPosition.y;

      const pushedWaterPosition = pushingWorldPlazaPointOffWaterTileCollider(
        { x: resolvedX, y: resolvedY },
        tileX,
        tileY,
        nearbyPlacedBlocks,
        applyBlockCollision,
        isJumping,
        playerRadiusGrid
      );
      resolvedX = pushedWaterPosition.x;
      resolvedY = pushedWaterPosition.y;
    }
  }

  const resolvedPosition = { x: resolvedX, y: resolvedY };

  if (options.fallbackPosition) {
    const clampedPosition = clampingWorldPlazaPointBeforeBlockedTile(
      options.fallbackPosition,
      resolvedPosition,
      applyBlockCollision,
      isJumping,
      nearbyPlacedBlocks,
      playerLayer,
      terrainColumnCollisionContext
    );

    if (
      checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
        clampedPosition,
        applyBlockCollision,
        isJumping,
        nearbyPlacedBlocks,
        playerLayer,
        terrainColumnCollisionContext
      ) &&
      !checkingWorldPlazaGridPointStandsOnWalkingBlockedTile(
        options.fallbackPosition,
        applyBlockCollision,
        isJumping,
        nearbyPlacedBlocks,
        playerLayer,
        terrainColumnCollisionContext
      )
    ) {
      return options.fallbackPosition;
    }

    return clampedPosition;
  }

  return resolvedPosition;
}
