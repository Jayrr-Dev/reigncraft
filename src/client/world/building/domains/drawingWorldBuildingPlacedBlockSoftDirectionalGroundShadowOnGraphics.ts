import { DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_VERTICAL_LIFT_PX } from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import type {
  DefiningWorldBuildingPlacedBlockGroundShadowCastSoftPass,
  DefiningWorldBuildingPlacedBlockGroundShadowContactSoftPass,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowSoftPassTypes";
import {
  drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics,
  type DrawingWorldBuildingPlacedBlockGroundShadowTile,
} from "@/components/world/building/domains/drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Draws a soft directional ground shadow from a list of offset passes.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics
 */

/** One soft shadow offset pass. */
export type DefiningWorldBuildingPlacedBlockGroundShadowSoftPass =
  | DefiningWorldBuildingPlacedBlockGroundShadowContactSoftPass
  | DefiningWorldBuildingPlacedBlockGroundShadowCastSoftPass;

/** Input for {@link drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics}. */
export interface DrawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowParams {
  /** Target graphics instance. */
  readonly graphics: Graphics;
  /** Tile columns that cast a ground shadow. */
  readonly shadowTiles: ReadonlyArray<DrawingWorldBuildingPlacedBlockGroundShadowTile>;
  /** Per-pass opacity multiplier before the layer group alpha is applied. */
  readonly fillAlpha: number;
  /** Offset passes to stack for this shadow sub-layer. */
  readonly softPasses: ReadonlyArray<DefiningWorldBuildingPlacedBlockGroundShadowSoftPass>;
}

/**
 * Draws the soft directional ground shadow for a set of shadow-casting columns.
 *
 * @param params - Target graphics, shadow tiles, fill alpha, and soft passes.
 */
export function drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics(
  params: DrawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowParams,
): void {
  for (const softPass of params.softPasses) {
    drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics({
      graphics: params.graphics,
      shadowTiles: params.shadowTiles,
      fillAlpha: params.fillAlpha * softPass.alphaScale,
      offsetXPx: softPass.offsetXPx,
      offsetYPx:
        softPass.offsetYPx +
        DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_VERTICAL_LIFT_PX,
      drawFootprint: softPass.drawFootprint,
      drawTongues: softPass.drawTongues ?? true,
    });
  }
}
