import type { DefiningWorldBuildingPlacedBlock } from "@/components/world/building/domains/definingWorldBuildingPlacedBlock";
import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import type { DrawingWorldBuildingPlacedBlockGroundShadowTile } from "@/components/world/building/domains/drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics";
import { drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics";
import { groupingWorldBuildingPlacedBlocksByTileColumn } from "@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn";
import { resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers } from "@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers";
import type { Graphics } from "pixi.js";

/**
 * Draws placed block ground shadows as a contact footprint plus blurred cast.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics
 */

/** Per-fill opacity when the layer applies its own group alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA = 1;

/** Input for shadow layer draw helpers. */
export interface DrawingWorldBuildingPlacedBlockGroundShadowLayerParams {
  /** Target graphics instance. */
  readonly graphics: Graphics;
  /** Blocks visible in the current scene window. */
  readonly placedBlocks: DefiningWorldBuildingPlacedBlock[];
}

/**
 * Lists tile columns that cast a ground shadow with their vertical span.
 *
 * @param placedBlocks - Blocks visible in the current scene window.
 */
function listingWorldBuildingPlacedBlockGroundShadowTiles(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
): DrawingWorldBuildingPlacedBlockGroundShadowTile[] {
  const shadowTiles: DrawingWorldBuildingPlacedBlockGroundShadowTile[] = [];
  const tileColumns = groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocks);

  for (const tileColumn of tileColumns) {
    const columnSpanLayers =
      resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers(tileColumn);

    if (columnSpanLayers === null) {
      continue;
    }

    shadowTiles.push({
      tileX: tileColumn.tileX,
      tileY: tileColumn.tileY,
      columnSpanLayers,
    });
  }

  return shadowTiles;
}

/**
 * Draws blurred cast tongues projected away from each block column.
 *
 * @param params - Target graphics and placed blocks.
 */
export function drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams,
): void {
  const shadowTiles = listingWorldBuildingPlacedBlockGroundShadowTiles(
    params.placedBlocks,
  );

  if (shadowTiles.length === 0) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  });
}

/**
 * Draws the soft footprint under each block column (no Gaussian blur).
 *
 * @param params - Target graphics and placed blocks.
 */
export function drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams,
): void {
  const shadowTiles = listingWorldBuildingPlacedBlockGroundShadowTiles(
    params.placedBlocks,
  );

  if (shadowTiles.length === 0) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
  });
}

/**
 * Draws both contact and cast sub-layers on one graphics instance (preview path).
 *
 * @param params - Target graphics and placed blocks.
 */
export function drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams,
): void {
  drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics(params);
  drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics(params);
}
