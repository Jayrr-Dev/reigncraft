import {
  checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock,
  computingWorldBuildingPlacedBlockOccupiedLayerBand,
} from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import {
  checkingWorldBuildingPlacedBlockIsPassableTile,
  DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS,
} from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import { DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE,
  type DefiningWorldBuildingCollisionShape,
} from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockCollisionShape,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  listingWorldBuildingPlacedBlocksNearTileFromIndex,
  type IndexingWorldBuildingPlacedBlocksByTile,
} from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import {
  checkingWorldBuildingPlacedBlockCutColliderBlocksPlayerCircle,
  checkingWorldBuildingPlayerCircleOverlapsPlacedBlockCutColliders,
  pushingWorldBuildingPlayerCircleOutsidePlacedBlockCutColliders,
} from '@/components/world/building/domains/resolvingWorldBuildingCutFootprintCollision';
import {
  checkingWorldBuildingCanJumpLandOnSurfaceLayer,
  checkingWorldBuildingPlacedBlockIsWalkableStep,
  resolvingWorldBuildingJumpLandableSurfaceLayerAtTileIndex,
} from '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex';
import { checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer } from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_EDGE_EXIT_EPSILON } from '@/components/world/domains/definingWorldPlazaPlayerBlockEjectConstants';
import { DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID } from '@/components/world/domains/definingWorldPlazaPlayerCollisionConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';

/**
 * Collision resolution for player-placed building blocks.
 *
 * @module components/world/building/domains/resolvingWorldBuildingCollision
 */

/** Below this grid distance the push direction is treated as degenerate. */
const RESOLVING_WORLD_BUILDING_COLLISION_MIN_PUSH_DISTANCE = 1e-4;

/**
 * Passable materials (Pine floors) still occupy volume when extruded.
 *
 * - Column through the standing layer → solid wall (no walk-through).
 * - Elevated slab / roof intersecting the body → ceiling block.
 * - +1 walkable floor step above the feet (thin elevated floor only) → allow.
 * - Flat 0H tiles → never block here.
 * - Standing on the column top (same tile, feet at/above L) → allow.
 */
function checkingWorldBuildingPassableBlockOverheadVolumeBlocksPlayer(
  block: DefiningWorldBuildingPlacedBlock,
  collisionShape: DefiningWorldBuildingCollisionShape,
  applyBlockCollision: boolean,
  playerLayer: number,
  playerHeightWorldLayers: number,
  blockIsOnPlayerStandingTile = false
): boolean {
  if (
    !applyBlockCollision ||
    collisionShape.kind !== DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE
  ) {
    return false;
  }

  const blockLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeight)) {
    return false;
  }

  // Support underfoot / standing on the platform top.
  if (blockIsOnPlayerStandingTile && blockLayer <= playerLayer) {
    return false;
  }

  if (
    !checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(
      playerLayer,
      blockLayer,
      blockHeight,
      playerHeightWorldLayers
    )
  ) {
    return false;
  }

  const occupiedBand = computingWorldBuildingPlacedBlockOccupiedLayerBand(
    blockLayer,
    blockHeight
  );

  // Extruded stack fills the standing layer — treat as a wall, even when the
  // top is only +1 (walkable-step height). That stops phasing through towers.
  if (
    occupiedBand.bottomLayer <= playerLayer &&
    occupiedBand.topLayer >= playerLayer
  ) {
    return true;
  }

  // Pure overhead / roof volume: still block headroom unless this is a thin
  // +1 floor the player is mounting as a step.
  if (checkingWorldBuildingPlacedBlockIsWalkableStep(block, playerLayer)) {
    return false;
  }

  return blockLayer > playerLayer;
}

/**
 * Returns placed blocks whose tile anchor lies within the search window.
 *
 * @param placedBlocks - Blocks loaded for the current viewport.
 * @param centerTileX - Avatar standing tile X.
 * @param centerTileY - Avatar standing tile Y.
 * @param searchTileRadius - Tile rings to inspect.
 */
export function listingWorldBuildingPlacedBlocksNearTileIndex(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  centerTileX: number,
  centerTileY: number,
  searchTileRadius: number,
  placedBlocksByTile?: IndexingWorldBuildingPlacedBlocksByTile
): DefiningWorldBuildingPlacedBlock[] {
  if (placedBlocksByTile) {
    return listingWorldBuildingPlacedBlocksNearTileFromIndex(
      placedBlocksByTile,
      centerTileX,
      centerTileY,
      searchTileRadius
    );
  }

  return placedBlocks.filter((block) => {
    const deltaTileX = Math.abs(block.tilePosition.tileX - centerTileX);
    const deltaTileY = Math.abs(block.tilePosition.tileY - centerTileY);

    return deltaTileX <= searchTileRadius && deltaTileY <= searchTileRadius;
  });
}

/**
 * Returns true when a placed block collider should affect the player.
 *
 * @param block - Placed block entity.
 * @param collisionShape - Block collider definition.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerLayer - Current player standing layer.
 * @param playerHeightWorldLayers - Vertical body height used for clearance.
 */
function checkingWorldBuildingPlacedBlockColliderBlocksPlayer(
  block: DefiningWorldBuildingPlacedBlock,
  collisionShape: DefiningWorldBuildingCollisionShape,
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number,
  playerHeightWorldLayers: number,
  blockIsOnPlayerStandingTile: boolean
): boolean {
  const blockLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);

  if (blockIsOnPlayerStandingTile && blockLayer <= playerLayer) {
    return false;
  }

  if (
    !checkingWorldBuildingPlayerVerticalBandOverlapsPlacedBlock(
      playerLayer,
      blockLayer,
      blockHeight,
      playerHeightWorldLayers
    )
  ) {
    return false;
  }

  // A single-layer floor is a stair the player walks up, never a wall.
  if (checkingWorldBuildingPlacedBlockIsWalkableStep(block, playerLayer)) {
    return false;
  }

  // Tall columns that still intersect the walk band stay solid for the whole
  // run/jump arc (unjumpable walls). Floating roofs with air under the feet
  // already returned false above via the vertical-band check.
  if (
    blockLayer - playerLayer >
    DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX
  ) {
    return true;
  }

  return checkingWorldBuildingCollisionShapeBlocksMovement(
    collisionShape,
    applyBlockCollision,
    isJumping
  );
}

/**
 * Returns true when a collider should block movement this frame.
 *
 * @param collisionShape - Block collider definition.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 */
function checkingWorldBuildingCollisionShapeBlocksMovement(
  collisionShape: DefiningWorldBuildingCollisionShape,
  applyBlockCollision: boolean,
  isJumping: boolean
): boolean {
  if (
    collisionShape.obstacleKind ===
    DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_PASSABLE
  ) {
    return false;
  }

  if (
    collisionShape.obstacleKind ===
    DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER
  ) {
    return !isJumping;
  }

  // Solid tile/circle colliders that vertically overlap the player (already
  // checked by the caller) block movement. Mount taller tops with a jump.
  return applyBlockCollision;
}

/**
 * Pushes a point outside a circular placed-block collider.
 *
 * @param resolved - Current resolved position.
 * @param block - Placed block entity.
 * @param collisionShape - Circular collider definition.
 */
function pushingWorldBuildingPointOutsidePlacedBlockCircle(
  resolved: DefiningWorldPlazaWorldPoint,
  block: DefiningWorldBuildingPlacedBlock,
  collisionShape: DefiningWorldBuildingCollisionShape
): DefiningWorldPlazaWorldPoint {
  const contactRadius =
    (collisionShape.radiusGrid ?? 0) +
    DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID;
  const centerX = block.tilePosition.tileX;
  const centerY = block.tilePosition.tileY;
  const deltaX = resolved.x - centerX;
  const deltaY = resolved.y - centerY;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance >= contactRadius) {
    return resolved;
  }

  if (distance < RESOLVING_WORLD_BUILDING_COLLISION_MIN_PUSH_DISTANCE) {
    return {
      x: centerX + contactRadius,
      y: centerY,
    };
  }

  const pushScale = contactRadius / distance;

  return {
    x: centerX + deltaX * pushScale,
    y: centerY + deltaY * pushScale,
  };
}

/**
 * Returns true when a footprint overlaps any nearby placed block tile collider.
 *
 * @param center - Player footprint center in grid space.
 * @param placedBlocks - Blocks near the avatar.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerLayer - Current player standing layer.
 * @param playerRadiusGrid - Player footprint radius in grid tiles.
 * @param playerHeightWorldLayers - Vertical body height used for clearance.
 */
export function checkingWorldBuildingPlayerCircleOverlapsPlacedBlockColliders(
  center: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(center),
  playerRadiusGrid: number = DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
): boolean {
  const centerTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  const nearbyBlocks = listingWorldBuildingPlacedBlocksNearTileIndex(
    placedBlocks,
    centerTile.tileX,
    centerTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS
  );

  for (const block of nearbyBlocks) {
    const collisionShape =
      resolvingWorldBuildingPlacedBlockCollisionShape(block);

    if (!collisionShape) {
      continue;
    }

    if (
      checkingWorldBuildingPassableBlockOverheadVolumeBlocksPlayer(
        block,
        collisionShape,
        applyBlockCollision,
        playerLayer,
        playerHeightWorldLayers,
        block.tilePosition.tileX === centerTile.tileX &&
          block.tilePosition.tileY === centerTile.tileY
      ) &&
      checkingWorldBuildingPlayerCircleOverlapsPlacedBlockCutColliders(
        center,
        playerRadiusGrid,
        block
      )
    ) {
      return true;
    }

    if (
      collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
    ) {
      continue;
    }

    if (
      checkingWorldBuildingPlacedBlockCutColliderBlocksPlayerCircle(
        center,
        playerRadiusGrid,
        block,
        collisionShape,
        (blockIsOnPlayerStandingTile) =>
          checkingWorldBuildingPlacedBlockColliderBlocksPlayer(
            block,
            collisionShape,
            applyBlockCollision,
            isJumping,
            playerLayer,
            playerHeightWorldLayers,
            blockIsOnPlayerStandingTile
          )
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when a grid point stands on a placed block tile collider.
 *
 * @param gridPoint - Candidate avatar position.
 * @param placedBlocks - Blocks near the avatar.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerHeightWorldLayers - Vertical body height used for clearance.
 */
export function checkingWorldBuildingGridPointBlockedByPlacedBlocks(
  gridPoint: DefiningWorldPlazaWorldPoint,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(gridPoint),
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
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
    return false;
  }

  const nearbyBlocks = listingWorldBuildingPlacedBlocksNearTileIndex(
    placedBlocks,
    standingTile.tileX,
    standingTile.tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_SEARCH_TILE_RADIUS
  );

  for (const block of nearbyBlocks) {
    const collisionShape =
      resolvingWorldBuildingPlacedBlockCollisionShape(block);

    if (!collisionShape) {
      continue;
    }

    const blockIsOnPlayerStandingTile =
      block.tilePosition.tileX === standingTile.tileX &&
      block.tilePosition.tileY === standingTile.tileY;

    if (
      checkingWorldBuildingPassableBlockOverheadVolumeBlocksPlayer(
        block,
        collisionShape,
        applyBlockCollision,
        playerLayer,
        playerHeightWorldLayers,
        blockIsOnPlayerStandingTile
      ) &&
      blockIsOnPlayerStandingTile
    ) {
      return true;
    }

    if (
      collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
    ) {
      continue;
    }

    if (
      checkingWorldBuildingPlacedBlockCutColliderBlocksPlayerCircle(
        gridPoint,
        0,
        block,
        collisionShape,
        (blockIsOnPlayerStandingTile) =>
          checkingWorldBuildingPlacedBlockColliderBlocksPlayer(
            block,
            collisionShape,
            applyBlockCollision,
            isJumping,
            playerLayer,
            playerHeightWorldLayers,
            blockIsOnPlayerStandingTile
          )
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Applies placed-block push-out before procedural terrain collision.
 *
 * @param desired - Candidate avatar grid position for this frame.
 * @param placedBlocks - Blocks near the avatar.
 * @param applyBlockCollision - Whether full block collision is active.
 * @param isJumping - True while a jump animation is active.
 * @param playerHeightWorldLayers - Vertical body height used for clearance.
 */
export function resolvingWorldBuildingPlacedBlockCollisionPushOut(
  desired: DefiningWorldPlazaWorldPoint,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  applyBlockCollision: boolean,
  isJumping: boolean,
  playerLayer: number = resolvingWorldPlazaPlayerWorldLayer(desired),
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
): DefiningWorldPlazaWorldPoint {
  let resolvedX = desired.x;
  let resolvedY = desired.y;
  const standingTile =
    resolvingWorldPlazaIsometricTileIndexAtGridPoint(desired);

  for (const block of placedBlocks) {
    const collisionShape =
      resolvingWorldBuildingPlacedBlockCollisionShape(block);

    if (!collisionShape) {
      continue;
    }

    const blockIsOnPlayerStandingTile =
      block.tilePosition.tileX === standingTile.tileX &&
      block.tilePosition.tileY === standingTile.tileY;

    if (
      checkingWorldBuildingPassableBlockOverheadVolumeBlocksPlayer(
        block,
        collisionShape,
        applyBlockCollision,
        playerLayer,
        playerHeightWorldLayers,
        blockIsOnPlayerStandingTile
      )
    ) {
      const pushedPosition =
        pushingWorldBuildingPlayerCircleOutsidePlacedBlockCutColliders(
          { x: resolvedX, y: resolvedY },
          DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
          block,
          DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_EDGE_EXIT_EPSILON
        );
      resolvedX = pushedPosition.x;
      resolvedY = pushedPosition.y;
      continue;
    }

    if (
      !checkingWorldBuildingPlacedBlockColliderBlocksPlayer(
        block,
        collisionShape,
        applyBlockCollision,
        isJumping,
        playerLayer,
        playerHeightWorldLayers,
        blockIsOnPlayerStandingTile
      )
    ) {
      continue;
    }

    if (
      collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
    ) {
      const pushedPosition = pushingWorldBuildingPointOutsidePlacedBlockCircle(
        { x: resolvedX, y: resolvedY },
        block,
        collisionShape
      );
      resolvedX = pushedPosition.x;
      resolvedY = pushedPosition.y;
      continue;
    }

    const pushedPosition =
      pushingWorldBuildingPlayerCircleOutsidePlacedBlockCutColliders(
        { x: resolvedX, y: resolvedY },
        DEFINING_WORLD_PLAZA_PLAYER_COLLISION_RADIUS_GRID,
        block,
        DEFINING_WORLD_PLAZA_PLAYER_BLOCK_EJECT_TILE_EDGE_EXIT_EPSILON
      );
    resolvedX = pushedPosition.x;
    resolvedY = pushedPosition.y;
  }

  return { x: resolvedX, y: resolvedY };
}

/**
 * Returns true when a placed stream-water block occupies the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Blocks near the tile.
 */
export function checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): boolean {
  const placedBlock = findingWorldBuildingPlacedBlockAtTileIndex(
    tileX,
    tileY,
    placedBlocks
  );

  return (
    placedBlock?.definitionId ===
    DEFINING_WORLD_BUILDING_BLOCK_ID_NATURAL_WATER_STREAM
  );
}

/**
 * Returns true when a placed block fully blocks jumping onto its tile.
 *
 * @param tileX - Landing tile column.
 * @param tileY - Landing tile row.
 * @param placedBlocks - Blocks near the landing tile.
 */
export function checkingWorldBuildingPlacedBlockBlocksJumpLandingAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  jumpLayerReachMax?: number,
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
): boolean {
  if (
    checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex(
      tileX,
      tileY,
      placedBlocks
    )
  ) {
    return true;
  }

  const landableSurfaceLayer =
    resolvingWorldBuildingJumpLandableSurfaceLayerAtTileIndex(
      tileX,
      tileY,
      placedBlocks,
      fromLayer,
      jumpLayerReachMax
    );

  if (
    !checkingWorldBuildingCanJumpLandOnSurfaceLayer(
      fromLayer,
      landableSurfaceLayer,
      jumpLayerReachMax
    )
  ) {
    return true;
  }

  // Reachable support still needs enough headroom for this character.
  return checkingWorldBuildingGridPointBlockedByPlacedBlocks(
    { x: tileX, y: tileY, layer: landableSurfaceLayer },
    placedBlocks,
    true,
    false,
    landableSurfaceLayer,
    playerHeightWorldLayers
  );
}

/** Samples taken along a jump path to scan for walls between the endpoints. */
const RESOLVING_WORLD_BUILDING_JUMP_PATH_SAMPLE_COUNT = 16;

/**
 * Clamps a jump's forward distance so the player lands just before a tall wall.
 *
 * The landing check alone is not enough: a jump can clear a wall and land on
 * open ground beyond it, so the wall sits in the middle of the arc with clear
 * tiles on both ends. The binary-search collision clamp only inspects the path
 * endpoints, so it never sees the wall and lets the player through. Instead of
 * rejecting the jump, this scans the path outward and shortens the distance to
 * the last clear sample before the first unjumpable wall, so the player lands
 * against the wall rather than clipping through it.
 *
 * Upward jumps to a reachable platform skip clamping so a long jump can arc
 * over tall columns between two elevated surfaces. Floating roofs do not clamp:
 * only solid columns that vertically overlap the walk band count as walls.
 *
 * @param startGridPoint - Takeoff position in grid space.
 * @param gridDirection - Unit grid direction of the jump.
 * @param forwardGridDistance - Requested jump distance in grid units.
 * @param placedBlocks - Blocks near the jump path.
 * @param fromLayer - Player layer at takeoff.
 * @param landingSurfaceLayer - Surface layer at the full-distance landing tile.
 */
export function resolvingWorldBuildingJumpForwardGridDistanceClampedToWall(
  startGridPoint: DefiningWorldPlazaWorldPoint,
  gridDirection: DefiningWorldPlazaWorldPoint,
  forwardGridDistance: number,
  placedBlocks: DefiningWorldBuildingPlacedBlock[],
  fromLayer: number,
  landingSurfaceLayer: number,
  jumpLayerReachMax?: number,
  playerHeightWorldLayers: number = DEFINING_WORLD_PLAZA_PLAYER_HEIGHT_WORLD_LAYERS
): number {
  if (
    landingSurfaceLayer > fromLayer &&
    checkingWorldBuildingCanJumpLandOnSurfaceLayer(
      fromLayer,
      landingSurfaceLayer,
      jumpLayerReachMax
    )
  ) {
    return forwardGridDistance;
  }

  let lastClearDistance = 0;

  for (
    let sampleIndex = 1;
    sampleIndex <= RESOLVING_WORLD_BUILDING_JUMP_PATH_SAMPLE_COUNT;
    sampleIndex += 1
  ) {
    const sampleDistance =
      (forwardGridDistance * sampleIndex) /
      RESOLVING_WORLD_BUILDING_JUMP_PATH_SAMPLE_COUNT;
    const sampleGridPoint: DefiningWorldPlazaWorldPoint = {
      x: startGridPoint.x + gridDirection.x * sampleDistance,
      y: startGridPoint.y + gridDirection.y * sampleDistance,
    };
    const sampleTile =
      resolvingWorldPlazaIsometricTileIndexAtGridPoint(sampleGridPoint);

    if (
      checkingWorldPlazaColumnRockFootprintTileIsWalkableGroundForPlayerLayer(
        sampleTile.tileX,
        sampleTile.tileY,
        fromLayer
      )
    ) {
      lastClearDistance = sampleDistance;
      continue;
    }

    const terrainSurfaceLayer =
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        sampleTile.tileX,
        sampleTile.tileY
      );

    if (
      terrainSurfaceLayer - fromLayer >
      (jumpLayerReachMax ?? DEFINING_WORLD_BUILDING_WORLD_LAYER_JUMP_HEIGHT_MAX)
    ) {
      return lastClearDistance;
    }

    if (
      checkingWorldBuildingGridPointBlockedByPlacedBlocks(
        sampleGridPoint,
        placedBlocks,
        true,
        false,
        fromLayer,
        playerHeightWorldLayers
      )
    ) {
      return lastClearDistance;
    }

    lastClearDistance = sampleDistance;
  }

  return forwardGridDistance;
}

/**
 * Finds a placed block occupying a tile, if any.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Blocks near the tile.
 */
export function findingWorldBuildingPlacedBlockAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): DefiningWorldBuildingPlacedBlock | null {
  return (
    placedBlocks.find(
      (block) =>
        block.tilePosition.tileX === tileX && block.tilePosition.tileY === tileY
    ) ?? null
  );
}
