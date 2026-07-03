import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import { drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Draws a soft ground shadow for one block placement preview column.
 *
 * @module components/world/building/domains/drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics
 */

/** Input for {@link drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics}. */
export interface DrawingWorldBuildingIsometricTileColumnGroundShadowParams {
  /** Target graphics instance. */
  readonly graphics: Graphics;
  /** Tile column index. */
  readonly tileX: number;
  /** Tile row index. */
  readonly tileY: number;
  /** Vertical span of the column in world layers, scaling the cast length. */
  readonly columnSpanLayers: number;
}

/**
 * Draws cast then contact soft passes for one preview column.
 *
 * @param params - Tile position and column span.
 */
export function drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics(
  params: DrawingWorldBuildingIsometricTileColumnGroundShadowParams,
): void {
  const shadowTiles = [
    {
      tileX: params.tileX,
      tileY: params.tileY,
      columnSpanLayers: params.columnSpanLayers,
    },
  ];

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA,
    softPasses: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  });
  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_ALPHA,
    softPasses: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
  });
}
