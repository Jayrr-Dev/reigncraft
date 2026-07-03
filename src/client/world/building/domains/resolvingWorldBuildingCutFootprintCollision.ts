import {
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
  type DefiningWorldBuildingCollisionShape,
} from "@/components/world/building/domains/definingWorldBuildingCollisionShape";
import { checkingWorldBuildingCutFootprintIsFull } from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  resolvingWorldBuildingPlacedBlockCutFootprintMask,
  resolvingWorldBuildingPlacedBlockCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { listingWorldBuildingCutFootprintColliderGridSquares } from "@/components/world/building/domains/resolvingWorldBuildingCutFootprintGridSquare";
import { DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID } from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";
import { resolvingWorldPlazaIsometricTileIndexAtGridPoint } from "@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint";
import {
  checkingWorldPlazaPlayerCircleOverlapsAxisAlignedGridSquare,
  pushingWorldPlazaPlayerCircleOutsideAxisAlignedGridSquare,
} from "@/components/world/domains/resolvingWorldPlazaPlayerCircleTileSquareCollision";

/**
 * Cut-footprint collision helpers for player-placed tile blocks.
 *
 * @module components/world/building/domains/resolvingWorldBuildingCutFootprintCollision
 */

/** One axis-aligned collider square used by cut footprint resolution. */
interface ResolvingWorldBuildingCutFootprintColliderGridSquare {
  readonly centerGridX: number;
  readonly centerGridY: number;
  readonly halfExtentGrid: number;
}

/**
 * Lists collider squares for one placed tile block.
 *
 * Full footprints collapse to one tile square for performance.
 *
 * @param block - Placed block entity.
 */
function listingWorldBuildingPlacedBlockTileColliderGridSquares(
  block: DefiningWorldBuildingPlacedBlock,
): ResolvingWorldBuildingCutFootprintColliderGridSquare[] {
  const { tileX, tileY } = block.tilePosition;
  const axisCellCount = resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
  const cutFootprintMask = resolvingWorldBuildingPlacedBlockCutFootprintMask(block);

  if (checkingWorldBuildingCutFootprintIsFull(cutFootprintMask, axisCellCount)) {
    return [
      {
        centerGridX: tileX,
        centerGridY: tileY,
        halfExtentGrid: DEFINING_WORLD_PLAZA_ISOMETRIC_TILE_HALF_EXTENT_GRID,
      },
    ];
  }

  return listingWorldBuildingCutFootprintColliderGridSquares(
    tileX,
    tileY,
    cutFootprintMask,
    axisCellCount,
  );
}

/**
 * Returns true when a footprint circle overlaps any cut collider square.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param block - Placed block entity.
 */
export function checkingWorldBuildingPlayerCircleOverlapsPlacedBlockCutColliders(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  block: DefiningWorldBuildingPlacedBlock,
): boolean {
  for (const colliderSquare of listingWorldBuildingPlacedBlockTileColliderGridSquares(
    block,
  )) {
    if (
      checkingWorldPlazaPlayerCircleOverlapsAxisAlignedGridSquare(
        center,
        radiusGrid,
        colliderSquare.centerGridX,
        colliderSquare.centerGridY,
        colliderSquare.halfExtentGrid,
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Pushes a footprint circle outside every overlapping cut collider square.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param block - Placed block entity.
 * @param edgeExitEpsilon - Extra gap kept past the contact distance.
 */
export function pushingWorldBuildingPlayerCircleOutsidePlacedBlockCutColliders(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  block: DefiningWorldBuildingPlacedBlock,
  edgeExitEpsilon: number,
): DefiningWorldPlazaWorldPoint {
  let resolvedX = center.x;
  let resolvedY = center.y;

  for (const colliderSquare of listingWorldBuildingPlacedBlockTileColliderGridSquares(
    block,
  )) {
    const pushedPosition = pushingWorldPlazaPlayerCircleOutsideAxisAlignedGridSquare(
      { x: resolvedX, y: resolvedY },
      radiusGrid,
      colliderSquare.centerGridX,
      colliderSquare.centerGridY,
      colliderSquare.halfExtentGrid,
      edgeExitEpsilon,
    );

    resolvedX = pushedPosition.x;
    resolvedY = pushedPosition.y;
  }

  return { x: resolvedX, y: resolvedY };
}

/**
 * Returns true when a footprint overlaps any blocking cut collider on a block.
 *
 * @param center - Player footprint center in grid space.
 * @param radiusGrid - Player footprint radius in grid tiles.
 * @param block - Placed block entity.
 * @param collisionShape - Block collider definition.
 * @param checkingColliderBlocksPlayer - Vertical/layer gate from collision resolver.
 */
export function checkingWorldBuildingPlacedBlockCutColliderBlocksPlayerCircle(
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number,
  block: DefiningWorldBuildingPlacedBlock,
  collisionShape: DefiningWorldBuildingCollisionShape,
  checkingColliderBlocksPlayer: (
    blockIsOnPlayerStandingTile: boolean,
  ) => boolean,
): boolean {
  if (collisionShape.kind !== DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE) {
    return false;
  }

  const standingTile = resolvingWorldPlazaIsometricTileIndexAtGridPoint(center);
  const blockIsOnPlayerStandingTile =
    block.tilePosition.tileX === standingTile.tileX &&
    block.tilePosition.tileY === standingTile.tileY;

  if (!checkingColliderBlocksPlayer(blockIsOnPlayerStandingTile)) {
    return false;
  }

  return checkingWorldBuildingPlayerCircleOverlapsPlacedBlockCutColliders(
    center,
    radiusGrid,
    block,
  );
}

/**
 * Returns true when a placed block uses per-sub-cell colliders.
 *
 * @param block - Placed block entity.
 */
export function checkingWorldBuildingPlacedBlockUsesCutFootprintColliders(
  block: DefiningWorldBuildingPlacedBlock,
): boolean {
  const axisCellCount = resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
  const cutFootprintMask = resolvingWorldBuildingPlacedBlockCutFootprintMask(block);

  return !checkingWorldBuildingCutFootprintIsFull(cutFootprintMask, axisCellCount);
}
