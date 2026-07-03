import {
  computingWorldBuildingPlacedBlockOccupiedLayerBand,
  resolvingWorldBuildingPlacedBlockExtrusionRenderParams,
} from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import {
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
  type DefiningWorldBuildingCollisionShape,
} from "@/components/world/building/domains/definingWorldBuildingCollisionShape";
import {
  checkingWorldBuildingCutFootprintIsFull,
  resolvingWorldBuildingCutCellFraction,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import {
  resolvingWorldBuildingPlacedBlockCutFootprintMask,
  resolvingWorldBuildingPlacedBlockCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { listingWorldBuildingCutFootprintColliderGridSquares } from "@/components/world/building/domains/resolvingWorldBuildingCutFootprintGridSquare";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_JUMP_TILE_STROKE_COLOR,
  DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_TILE_STROKE_COLOR,
} from "@/components/world/domains/definingWorldPlazaTerrainCollisionDebugConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
} from "@/components/world/domains/definingWorldPlazaTerrainObstacleConstants";
import { drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics";
import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { resolvingWorldBuildingPlacedBlockCollisionShape } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import { drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Collision debug outlines for player-placed building blocks.
 *
 * @module components/world/building/domains/drawingWorldPlazaVisiblePlacedBlockCollisionDebugOnGraphics
 */

/**
 * Returns the stroke color for one placed block collider.
 *
 * @param collisionShape - Block collider definition.
 */
function resolvingWorldPlazaPlacedBlockCollisionDebugStrokeColor(
  collisionShape: DefiningWorldBuildingCollisionShape,
): number | null {
  if (collisionShape.kind === DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE) {
    return null;
  }

  if (collisionShape.kind === DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE) {
    return DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_CIRCLE_STROKE_COLOR;
  }

  if (collisionShape.obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER) {
    return DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_JUMP_TILE_STROKE_COLOR;
  }

  if (collisionShape.obstacleKind === DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK) {
    return DEFINING_WORLD_PLAZA_TERRAIN_COLLISION_DEBUG_PLACED_BLOCK_TILE_STROKE_COLOR;
  }

  return null;
}

/**
 * Returns true when a placed block tile anchor lies inside visible bounds.
 *
 * @param block - Placed block entity.
 * @param bounds - Visible tile index bounds.
 */
function checkingWorldPlazaPlacedBlockCollisionDebugIsWithinBounds(
  block: DefiningWorldBuildingPlacedBlock,
  bounds: DefiningWorldPlazaVisibleTileBounds,
): boolean {
  const { tileX, tileY } = block.tilePosition;

  return (
    tileX >= bounds.minTileX &&
    tileX <= bounds.maxTileX &&
    tileY >= bounds.minTileY &&
    tileY <= bounds.maxTileY
  );
}

/**
 * Draws dashed collider outlines for visible player-placed blocks.
 *
 * @param graphics - Target Pixi Graphics instance (caller clears before calling).
 * @param bounds - Visible tile index bounds.
 * @param placedBlocks - Blocks loaded for the current scene.
 */
export function drawingWorldPlazaVisiblePlacedBlockCollisionDebugOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): void {
  for (const block of placedBlocks) {
    if (!checkingWorldPlazaPlacedBlockCollisionDebugIsWithinBounds(block, bounds)) {
      continue;
    }

    const collisionShape = resolvingWorldBuildingPlacedBlockCollisionShape(block);

    if (!collisionShape) {
      continue;
    }

    const strokeColor =
      resolvingWorldPlazaPlacedBlockCollisionDebugStrokeColor(collisionShape);

    if (strokeColor === null) {
      continue;
    }

    const { tileX, tileY } = block.tilePosition;

    if (collisionShape.kind === DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE) {
      const radiusGrid = collisionShape.radiusGrid ?? 0;

      if (radiusGrid <= 0) {
        continue;
      }

      drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
        graphics,
        tileX,
        tileY,
        radiusGrid,
        strokeColor,
      );
      continue;
    }

    if (collisionShape.kind !== DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE) {
      continue;
    }

    const extrusionParams = resolvingWorldBuildingPlacedBlockExtrusionRenderParams(block);
    const occupiedBand = computingWorldBuildingPlacedBlockOccupiedLayerBand(
      extrusionParams.topWorldLayer,
      extrusionParams.blockHeightLayers,
    );

    if (occupiedBand.bottomLayer > occupiedBand.topLayer) {
      continue;
    }

    const axisCellCount = resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
    const cutFootprintMask = resolvingWorldBuildingPlacedBlockCutFootprintMask(block);
    const isFullCutFootprint = checkingWorldBuildingCutFootprintIsFull(
      cutFootprintMask,
      axisCellCount,
    );
    const subCellFootprintScale = resolvingWorldBuildingCutCellFraction(axisCellCount);

    for (
      let worldLayer = occupiedBand.bottomLayer;
      worldLayer <= occupiedBand.topLayer;
      worldLayer += 1
    ) {
      if (isFullCutFootprint) {
        drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics(
          graphics,
          tileX,
          tileY,
          1,
          strokeColor,
          worldLayer,
        );
        continue;
      }

      for (const colliderSquare of listingWorldBuildingCutFootprintColliderGridSquares(
        tileX,
        tileY,
        cutFootprintMask,
        axisCellCount,
      )) {
        drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics(
          graphics,
          colliderSquare.centerGridX,
          colliderSquare.centerGridY,
          subCellFootprintScale,
          strokeColor,
          worldLayer,
        );
      }
    }
  }
}
