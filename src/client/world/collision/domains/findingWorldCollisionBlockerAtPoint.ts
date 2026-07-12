import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  checkingWorldBuildingGridPointBlockedByPlacedBlocks,
  checkingWorldBuildingPlayerCircleOverlapsPlacedBlockColliders,
  listingWorldBuildingPlacedBlocksNearTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingCollision';
import type { CheckingWorldPlazaTerrainElevationColumnCollisionContext } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import { checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex';
import {
  checkingWorldPlazaColumnRockFootprintTileBypassesTileGridCollisionAtTileIndex,
  checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer,
} from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL,
} from '@/components/world/domains/definingWorldPlazaTerrainCollisionBlockerKind';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { findingWorldPlazaNearbyColumnRockBaseDiamondBlockerAtGridPoint } from '@/components/world/domains/findingWorldPlazaNearbyColumnRockBaseDiamondBlockerAtGridPoint';
import { resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks } from '@/components/world/domains/listingWorldPlazaPlacedTreeBlocksInTileBounds';
import type { RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput } from '@/components/world/domains/recordingWorldPlazaTerrainCollisionBlockerHitDebugState';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { checkingWorldPlazaPlayerCircleOverlapsTileSquare } from '@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision';
import {
  resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex,
  resolvingWorldPlazaTerrainObstacleKindAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaTerrainObstacleKindFromFeature';
import { resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';

/**
 * Diagnoses which collision provider would block a grid point.
 *
 * @module components/world/collision/domains/findingWorldCollisionBlockerAtPoint
 */

/** Tile rings scanned around the footprint center for circle overlap. */
const FINDING_WORLD_PLAZA_BLOCKED_WORLD_POINT_BLOCKER_TILE_SCAN_RING = 1;

/** Options for {@link findingWorldPlazaBlockedWorldPointBlockerAtGridPoint}. */
/** @deprecated Use {@link FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions}. */
export type FindingWorldCollisionBlockerAtPointOptions =
  FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions;

export interface FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions {
  /** Whether full block collision is active. */
  applyBlockCollision: boolean;
  /** True while a jump animation is active. */
  isJumping: boolean;
  /** Player-placed blocks near the avatar. */
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  /** Current player standing layer. */
  playerLayer?: number;
  /** Player footprint radius in grid tiles. */
  playerRadiusGrid?: number;
  /** Player vertical body height in world layers. */
  playerHeightWorldLayers?: number;
  /** Ledge lip relief context. */
  terrainColumnCollisionContext?: CheckingWorldPlazaTerrainElevationColumnCollisionContext;
}

/**
 * Returns true when a player footprint overlaps a circular collider.
 *
 * @param center - Player footprint center in grid space.
 * @param colliderCenterX - Obstacle center X in grid space.
 * @param colliderCenterY - Obstacle center Y in grid space.
 * @param colliderRadiusGrid - Obstacle radius in grid tiles.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 */
function checkingWorldPlazaPlayerFootprintOverlapsCircularColliderAtGridPoint(
  center: DefiningWorldPlazaWorldPoint,
  colliderCenterX: number,
  colliderCenterY: number,
  colliderRadiusGrid: number,
  playerRadiusGrid: number
): boolean {
  const contactRadius = colliderRadiusGrid + playerRadiusGrid;

  return (
    Math.hypot(center.x - colliderCenterX, center.y - colliderCenterY) <
    contactRadius
  );
}

/**
 * Returns the first tile-grid blocker under one grid point.
 *
 * @param gridPoint - Candidate avatar position in grid space.
 * @param options - Collision context for this frame.
 */
function findingWorldPlazaTileGridBlockerAtGridPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  options: FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions,
  includePlacedBlocks = true
): RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput | null {
  const playerLayer =
    options.playerLayer ?? resolvingWorldPlazaPlayerWorldLayer(gridPoint);
  const placedBlocks = options.placedBlocks ?? [];
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  if (
    checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer(
      standingTile.tileX,
      standingTile.tileY,
      playerLayer
    )
  ) {
    return null;
  }

  if (
    includePlacedBlocks &&
    checkingWorldBuildingGridPointBlockedByPlacedBlocks(
      gridPoint,
      placedBlocks,
      options.applyBlockCollision,
      options.isJumping,
      playerLayer,
      options.playerHeightWorldLayers ??
        DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
    )
  ) {
    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK
        ],
      detail: `tile (${standingTile.tileX}, ${standingTile.tileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: standingTile.tileX,
      tileY: standingTile.tileY,
    };
  }

  if (
    checkingWorldPlazaTerrainElevationColumnBlocksPlayerAtTileIndex(
      standingTile.tileX,
      standingTile.tileY,
      playerLayer,
      options.applyBlockCollision,
      options.terrainColumnCollisionContext,
      options.playerHeightWorldLayers ??
        DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
    )
  ) {
    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_ELEVATION,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_ELEVATION
        ],
      detail: `tile (${standingTile.tileX}, ${standingTile.tileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: standingTile.tileX,
      tileY: standingTile.tileY,
    };
  }

  const obstacleKind = resolvingWorldPlazaTerrainObstacleKindAtTileIndex(
    standingTile.tileX,
    standingTile.tileY
  );

  if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK &&
    options.applyBlockCollision
  ) {
    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_BLOCK,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_BLOCK
        ],
      detail: `tile (${standingTile.tileX}, ${standingTile.tileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: standingTile.tileX,
      tileY: standingTile.tileY,
    };
  }

  if (
    obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER &&
    !options.isJumping
  ) {
    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TERRAIN_TILE_JUMP_OVER,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND
            .TERRAIN_TILE_JUMP_OVER
        ],
      detail: `tile (${standingTile.tileX}, ${standingTile.tileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: standingTile.tileX,
      tileY: standingTile.tileY,
    };
  }

  return null;
}

/**
 * Returns the first circular collider blocker near a grid point.
 *
 * @param center - Player footprint center in grid space.
 * @param options - Collision context for this frame.
 */
function findingWorldPlazaNearbyCircularColliderBlockerAtGridPoint(
  center: DefiningWorldPlazaWorldPoint,
  options: FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions
): RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput | null {
  const playerLayer =
    options.playerLayer ?? resolvingWorldPlazaPlayerWorldLayer(center);
  const playerRadiusGrid =
    options.playerRadiusGrid ??
    DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID;
  const placedBlocks = options.placedBlocks ?? [];
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  const nearbyPlacedBlocks = listingWorldBuildingPlacedBlocksNearTileIndex(
    placedBlocks,
    centerTile.tileX,
    centerTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS
  );

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
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      const tree = resolvingWorldPlazaTreeAtTileIndexWithPlacedBlocks(
        tileX,
        tileY,
        nearbyPlacedBlocks
      );

      if (
        tree &&
        checkingWorldPlazaPlayerFootprintOverlapsCircularColliderAtGridPoint(
          center,
          tree.tileX,
          tree.tileY,
          resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(tree),
          playerRadiusGrid
        )
      ) {
        return {
          kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TREE_CIRCLE,
          label:
            DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
              DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.TREE_CIRCLE
            ],
          detail: `tree tile (${tree.tileX}, ${tree.tileY})`,
          gridX: center.x,
          gridY: center.y,
          tileX: tree.tileX,
          tileY: tree.tileY,
        };
      }

      const rockRadiusGrid =
        resolvingWorldPlazaRockCollisionRadiusGridAtTileIndex(tileX, tileY);

      if (
        rockRadiusGrid !== null &&
        playerLayer <
          resolvingWorldPlazaTerrainRockColumnSurfaceLayerAtTileIndex(
            tileX,
            tileY
          ) &&
        checkingWorldPlazaPlayerFootprintOverlapsCircularColliderAtGridPoint(
          center,
          tileX,
          tileY,
          rockRadiusGrid,
          playerRadiusGrid
        )
      ) {
        return {
          kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PEBBLE_ROCK_CIRCLE,
          label:
            DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
              DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND
                .PEBBLE_ROCK_CIRCLE
            ],
          detail: `tile (${tileX}, ${tileY})`,
          gridX: center.x,
          gridY: center.y,
          tileX,
          tileY,
        };
      }
    }
  }

  return null;
}

/**
 * Returns the first collision system that would block the given grid point.
 *
 * Mirrors the resolution order in {@link resolvingWorldPlazaBlockedWorldPoint}:
 * placed blocks, column-rock diamonds, circular tree/pebble colliders, then
 * tile-grid elevation and obstacle rules.
 *
 * @param gridPoint - Candidate avatar position in grid space.
 * @param options - Collision context for this frame.
 */
export function findingWorldCollisionBlockerAtPoint(
  gridPoint: DefiningWorldPlazaWorldPoint,
  options: FindingWorldPlazaBlockedWorldPointBlockerAtGridPointOptions
): RecordingWorldPlazaTerrainCollisionBlockerHitDebugStateInput | null {
  const playerLayer =
    options.playerLayer ?? resolvingWorldPlazaPlayerWorldLayer(gridPoint);
  const playerRadiusGrid =
    options.playerRadiusGrid ??
    DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID;
  const placedBlocks = options.placedBlocks ?? [];

  const tileGridBlocker = findingWorldPlazaTileGridBlockerAtGridPoint(
    gridPoint,
    {
      ...options,
      playerLayer,
      placedBlocks,
    }
  );

  if (
    tileGridBlocker?.kind ===
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK
  ) {
    return tileGridBlocker;
  }

  const columnRockMetadata =
    findingWorldPlazaNearbyColumnRockBaseDiamondBlockerAtGridPoint(
      gridPoint,
      playerLayer,
      options.applyBlockCollision
    );

  if (columnRockMetadata) {
    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.COLUMN_ROCK_DIAMOND,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND
            .COLUMN_ROCK_DIAMOND
        ],
      detail: `anchor (${columnRockMetadata.anchorTileX}, ${columnRockMetadata.anchorTileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: columnRockMetadata.anchorTileX,
      tileY: columnRockMetadata.anchorTileY,
    };
  }

  const circularBlocker =
    findingWorldPlazaNearbyCircularColliderBlockerAtGridPoint(gridPoint, {
      ...options,
      playerLayer,
      playerRadiusGrid,
      placedBlocks,
    });

  if (circularBlocker) {
    return circularBlocker;
  }

  if (
    checkingWorldBuildingPlayerCircleOverlapsPlacedBlockColliders(
      gridPoint,
      placedBlocks,
      options.applyBlockCollision,
      options.isJumping,
      playerLayer,
      playerRadiusGrid,
      options.playerHeightWorldLayers ??
        DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
    )
  ) {
    const standingTile =
      resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

    return {
      kind: DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK,
      label:
        DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND_LABEL[
          DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_BLOCKER_KIND.PLACED_BLOCK
        ],
      detail: `cut collider near (${standingTile.tileX}, ${standingTile.tileY})`,
      gridX: gridPoint.x,
      gridY: gridPoint.y,
      tileX: standingTile.tileX,
      tileY: standingTile.tileY,
    };
  }

  if (playerRadiusGrid <= 0) {
    return tileGridBlocker;
  }

  const centerTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(gridPoint);

  for (
    let offsetTileY =
      -FINDING_WORLD_PLAZA_BLOCKED_WORLD_POINT_BLOCKER_TILE_SCAN_RING;
    offsetTileY <=
    FINDING_WORLD_PLAZA_BLOCKED_WORLD_POINT_BLOCKER_TILE_SCAN_RING;
    offsetTileY += 1
  ) {
    for (
      let offsetTileX =
        -FINDING_WORLD_PLAZA_BLOCKED_WORLD_POINT_BLOCKER_TILE_SCAN_RING;
      offsetTileX <=
      FINDING_WORLD_PLAZA_BLOCKED_WORLD_POINT_BLOCKER_TILE_SCAN_RING;
      offsetTileX += 1
    ) {
      const tileX = centerTile.tileX + offsetTileX;
      const tileY = centerTile.tileY + offsetTileY;

      if (
        !checkingWorldPlazaPlayerCircleOverlapsTileSquare(
          gridPoint,
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

      const adjacentTileBlocker = findingWorldPlazaTileGridBlockerAtGridPoint(
        { x: tileX, y: tileY, layer: playerLayer },
        {
          ...options,
          playerLayer,
          placedBlocks,
        },
        false
      );

      if (adjacentTileBlocker) {
        return adjacentTileBlocker;
      }
    }
  }

  return tileGridBlocker;
}
