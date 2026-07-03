import { resolvingWorldBuildingPlacedBlockTopWorldLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingPlacedBlockBlockHeight, resolvingWorldBuildingPlacedBlockWorldLayer } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE } from "@/components/world/building/domains/definingWorldBuildingCollisionShape";
import { resolvingWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import { checkingWorldBuildingBlockUsesTileColumnExtrusion } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA,
  checkingWorldBuildingWorldLayerActsAsWallForPlayer,
  checkingWorldBuildingWorldLayerIsOneWalkStepAbovePlayer,
  checkingWorldBuildingWorldLayerIsWithinJumpHeight,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Resolves surface height and layer movement rules for placed blocks.
 *
 * @module components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex
 */

/**
 * Returns the highest world layer with a placed block on a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Blocks near the tile.
 */
export function resolvingWorldBuildingSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): number {
  let surfaceLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;

  for (const block of placedBlocks) {
    if (
      block.tilePosition.tileX !== tileX ||
      block.tilePosition.tileY !== tileY
    ) {
      continue;
    }

    surfaceLayer = Math.max(
      surfaceLayer,
      resolvingWorldBuildingPlacedBlockTopWorldLayer(block),
    );
  }

  return surfaceLayer;
}

/**
 * Returns true when a tile has stacked column blocks on every layer up to the
 * surface, so the player can stand on the top cap.
 *
 * Any block that renders as a tile column (extruded floors, walls, jump tiles)
 * counts as a solid step, regardless of its horizontal collision rule.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param surfaceLayer - Highest block layer on the tile.
 * @param placedBlocks - Blocks near the tile.
 */
export function checkingWorldBuildingTileHasContinuousTileColumnStack(
  tileX: number,
  tileY: number,
  surfaceLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): boolean {
  if (surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return false;
  }

  for (
    let worldLayer = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND;
    worldLayer <= surfaceLayer;
    worldLayer += 1
  ) {
    const block = findingWorldBuildingPlacedBlockAtTileLayerIndex(
      tileX,
      tileY,
      worldLayer,
      placedBlocks,
    );

    if (!block) {
      return false;
    }

    const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

    if (
      !definition ||
      !checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)
    ) {
      return false;
    }

    if (checkingWorldBuildingPlacedBlockIsPassableTile(
      resolvingWorldBuildingPlacedBlockBlockHeight(block),
    )) {
      continue;
    }
  }

  return true;
}

/**
 * Lists placed blocks occupying a tile at any layer.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param placedBlocks - Blocks near the tile.
 */
export function listingWorldBuildingPlacedBlocksAtTileIndex(
  tileX: number,
  tileY: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): DefiningWorldBuildingPlacedBlock[] {
  return placedBlocks.filter(
    (block) =>
      block.tilePosition.tileX === tileX &&
      block.tilePosition.tileY === tileY,
  );
}

/**
 * Finds a placed block at a tile and layer, if present.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param worldLayer - Target layer.
 * @param placedBlocks - Blocks near the tile.
 */
export function findingWorldBuildingPlacedBlockAtTileLayerIndex(
  tileX: number,
  tileY: number,
  worldLayer: number,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): DefiningWorldBuildingPlacedBlock | null {
  return (
    placedBlocks.find(
      (block) =>
        block.tilePosition.tileX === tileX &&
        block.tilePosition.tileY === tileY &&
        resolvingWorldBuildingPlacedBlockWorldLayer(block) === worldLayer,
    ) ?? null
  );
}

/**
 * Returns true when walking from one surface layer to another is allowed.
 *
 * @param fromLayer - Current standing layer.
 * @param toSurfaceLayer - Surface layer on the destination tile.
 * @param isJumping - True while a jump animation is active.
 */
export function checkingWorldBuildingCanWalkBetweenSurfaceLayers(
  fromLayer: number,
  toSurfaceLayer: number,
  isJumping: boolean,
): boolean {
  if (toSurfaceLayer <= fromLayer) {
    return true;
  }

  if (
    checkingWorldBuildingWorldLayerIsOneWalkStepAbovePlayer(
      fromLayer,
      toSurfaceLayer,
    )
  ) {
    return true;
  }

  if (
    isJumping &&
    checkingWorldBuildingWorldLayerIsWithinJumpHeight(fromLayer, toSurfaceLayer)
  ) {
    return true;
  }

  return false;
}

/**
 * Returns true when a jump may land on the tile surface layer.
 *
 * @param fromLayer - Layer before the jump.
 * @param landingSurfaceLayer - Surface layer at the landing tile.
 */
export function checkingWorldBuildingCanJumpLandOnSurfaceLayer(
  fromLayer: number,
  landingSurfaceLayer: number,
): boolean {
  if (landingSurfaceLayer <= fromLayer) {
    return true;
  }

  return checkingWorldBuildingWorldLayerIsWithinJumpHeight(
    fromLayer,
    landingSurfaceLayer,
  );
}

/**
 * Returns true when a placed block should block the player horizontally using
 * wall-style collision at the player's current height.
 *
 * @param blockLayer - Block world layer.
 * @param playerLayer - Current player standing layer.
 */
export function checkingWorldBuildingPlacedBlockWorldLayerBlocksPlayer(
  blockLayer: number,
  playerLayer: number,
): boolean {
  return checkingWorldBuildingWorldLayerActsAsWallForPlayer(
    blockLayer,
    playerLayer,
  );
}

/**
 * Returns true when the player can walk straight up onto a placed block's top
 * surface (stair behavior). This is relative to the player's current layer: a
 * flat-topped passable floor counts as a stair when its top surface is at most
 * one layer above the player, regardless of how thick the column is. Surfaces
 * two or more layers above the player, walls, and jump-over blocks are not
 * walkable steps and require a jump to mount.
 *
 * @param block - Placed block entity.
 * @param playerLayer - Current player standing layer.
 */
export function checkingWorldBuildingPlacedBlockIsWalkableStep(
  block: DefiningWorldBuildingPlacedBlock,
  playerLayer: number,
): boolean {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  if (
    !definition ||
    !checkingWorldBuildingBlockUsesTileColumnExtrusion(definition) ||
    definition.collisionShape.kind !==
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE
  ) {
    return false;
  }

  const blockLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);

  return (
    blockLayer - playerLayer <=
    DEFINING_WORLD_BUILDING_WORLD_LAYER_WALK_STEP_LAYER_DELTA
  );
}
