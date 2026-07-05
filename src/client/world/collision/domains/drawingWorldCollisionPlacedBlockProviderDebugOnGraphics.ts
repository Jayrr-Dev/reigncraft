import {
  computingWorldBuildingPlacedBlockOccupiedLayerBand,
  resolvingWorldBuildingPlacedBlockExtrusionRenderParams,
} from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import {
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
  type DefiningWorldBuildingCollisionShape,
} from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingCutFootprintIsFull,
  resolvingWorldBuildingCutCellFraction,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockCollisionShape,
  resolvingWorldBuildingPlacedBlockCutFootprintMask,
  resolvingWorldBuildingPlacedBlockCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { listingWorldBuildingCutFootprintColliderGridSquares } from '@/components/world/building/domains/resolvingWorldBuildingCutFootprintGridSquare';
import { findingWorldCollisionProviderById } from '@/components/world/collision/domains/definingWorldCollisionProviderRegistry';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK,
  DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics';
import { drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics } from '@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics';
import type { Graphics } from 'pixi.js';

/**
 * Placed-block collision debug strokes from the placedBlockColumn provider.
 *
 * @module components/world/collision/domains/drawingWorldCollisionPlacedBlockProviderDebugOnGraphics
 */

function resolvingWorldCollisionPlacedBlockDebugStrokeColor(
  collisionShape: DefiningWorldBuildingCollisionShape
): number | null {
  const provider = findingWorldCollisionProviderById('placedBlockColumn');

  if (!provider) {
    return null;
  }

  if (
    collisionShape.kind === DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE
  ) {
    return null;
  }

  if (
    collisionShape.kind === DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
  ) {
    return provider.debugStroke.footprintStrokeColor ?? null;
  }

  if (
    collisionShape.obstacleKind ===
    DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_JUMP_OVER
  ) {
    return provider.debugStroke.secondaryStrokeColor ?? null;
  }

  if (
    collisionShape.obstacleKind ===
    DEFINING_WORLD_PLAZA_TERRAIN_OBSTACLE_KIND_BLOCK
  ) {
    return provider.debugStroke.strokeColor;
  }

  return null;
}

function checkingWorldCollisionPlacedBlockDebugIsWithinBounds(
  block: DefiningWorldBuildingPlacedBlock,
  bounds: DefiningWorldPlazaVisibleTileBounds
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
 */
export function drawingWorldCollisionPlacedBlockProviderDebugOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): void {
  for (const block of placedBlocks) {
    if (!checkingWorldCollisionPlacedBlockDebugIsWithinBounds(block, bounds)) {
      continue;
    }

    const collisionShape =
      resolvingWorldBuildingPlacedBlockCollisionShape(block);

    if (!collisionShape) {
      continue;
    }

    const strokeColor =
      resolvingWorldCollisionPlacedBlockDebugStrokeColor(collisionShape);

    if (strokeColor === null) {
      continue;
    }

    const { tileX, tileY } = block.tilePosition;

    if (
      collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
    ) {
      const radiusGrid = collisionShape.radiusGrid ?? 0;

      if (radiusGrid <= 0) {
        continue;
      }

      drawingWorldPlazaDashedGridCircleColliderStrokeOnGraphics(
        graphics,
        tileX,
        tileY,
        radiusGrid,
        strokeColor
      );
      continue;
    }

    if (
      collisionShape.kind !== DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE
    ) {
      continue;
    }

    const extrusionParams =
      resolvingWorldBuildingPlacedBlockExtrusionRenderParams(block);
    const occupiedBand = computingWorldBuildingPlacedBlockOccupiedLayerBand(
      extrusionParams.topWorldLayer,
      extrusionParams.blockHeightLayers
    );

    if (occupiedBand.bottomLayer > occupiedBand.topLayer) {
      continue;
    }

    const axisCellCount =
      resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
    const cutFootprintMask =
      resolvingWorldBuildingPlacedBlockCutFootprintMask(block);
    const isFullCutFootprint = checkingWorldBuildingCutFootprintIsFull(
      cutFootprintMask,
      axisCellCount
    );
    const subCellFootprintScale =
      resolvingWorldBuildingCutCellFraction(axisCellCount);

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
          worldLayer
        );
        continue;
      }

      for (const colliderSquare of listingWorldBuildingCutFootprintColliderGridSquares(
        tileX,
        tileY,
        cutFootprintMask,
        axisCellCount
      )) {
        drawingWorldPlazaDashedIsometricGridDiamondStrokeOnGraphics(
          graphics,
          colliderSquare.centerGridX,
          colliderSquare.centerGridY,
          subCellFootprintScale,
          strokeColor,
          worldLayer
        );
      }
    }
  }
}
