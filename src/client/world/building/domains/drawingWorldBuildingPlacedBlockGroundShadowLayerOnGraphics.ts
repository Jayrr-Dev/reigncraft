import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants';
import type { DrawingWorldBuildingPlacedBlockGroundShadowTile } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics';
import { drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics';
import type { GroupingWorldBuildingPlacedBlocksTileColumn } from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { groupingWorldBuildingPlacedBlocksByTileColumn } from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers';
import type { Graphics } from 'pixi.js';

/**
 * Draws placed block ground shadows as a contact footprint plus blurred cast.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics
 */

/** Per-fill opacity when the layer applies its own group alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA = 1;

/** Input for multi-block shadow layer draw helpers (preview / batch paths). */
export type DrawingWorldBuildingPlacedBlockGroundShadowLayerParams = {
  /** Target graphics instance. */
  readonly graphics: Graphics;
  /** Blocks visible in the current scene window. */
  readonly placedBlocks: readonly DefiningWorldBuildingPlacedBlock[];
};

/** Input for one already-grouped tile column (hot render path). */
export type DrawingWorldBuildingPlacedBlockGroundShadowTileColumnParams = {
  readonly graphics: Graphics;
  readonly tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn;
};

/**
 * Resolves shadow tile metadata for one column, or null when it casts no shadow.
 */
function resolvingWorldBuildingPlacedBlockGroundShadowTileForColumn(
  tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn
): DrawingWorldBuildingPlacedBlockGroundShadowTile | null {
  const columnSpanLayers =
    resolvingWorldBuildingPlacedBlockColumnGroundShadowSpanLayers(tileColumn);

  if (columnSpanLayers === null) {
    return null;
  }

  return {
    tileX: tileColumn.tileX,
    tileY: tileColumn.tileY,
    columnSpanLayers,
  };
}

/**
 * Lists tile columns that cast a ground shadow with their vertical span.
 */
function listingWorldBuildingPlacedBlockGroundShadowTiles(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): DrawingWorldBuildingPlacedBlockGroundShadowTile[] {
  const shadowTiles: DrawingWorldBuildingPlacedBlockGroundShadowTile[] = [];
  const tileColumns =
    groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocks);

  for (const tileColumn of tileColumns) {
    const shadowTile =
      resolvingWorldBuildingPlacedBlockGroundShadowTileForColumn(tileColumn);

    if (shadowTile) {
      shadowTiles.push(shadowTile);
    }
  }

  return shadowTiles;
}

/**
 * Draws blurred cast tongues for one tile column (no regroup).
 */
export function drawingWorldBuildingPlacedBlockGroundShadowCastLayerForTileColumnOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowTileColumnParams
): void {
  const shadowTile = resolvingWorldBuildingPlacedBlockGroundShadowTileForColumn(
    params.tileColumn
  );

  if (!shadowTile) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles: [shadowTile],
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  });
}

/**
 * Draws the soft footprint for one tile column (no regroup).
 */
export function drawingWorldBuildingPlacedBlockGroundShadowContactLayerForTileColumnOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowTileColumnParams
): void {
  const shadowTile = resolvingWorldBuildingPlacedBlockGroundShadowTileForColumn(
    params.tileColumn
  );

  if (!shadowTile) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles: [shadowTile],
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
  });
}

/**
 * Draws blurred cast tongues projected away from each block column.
 */
export function drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams
): void {
  const shadowTiles = listingWorldBuildingPlacedBlockGroundShadowTiles(
    params.placedBlocks
  );

  if (shadowTiles.length === 0) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CAST_SOFT_PASSES,
  });
}

/**
 * Draws the soft footprint under each block column (no Gaussian blur).
 */
export function drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams
): void {
  const shadowTiles = listingWorldBuildingPlacedBlockGroundShadowTiles(
    params.placedBlocks
  );

  if (shadowTiles.length === 0) {
    return;
  }

  drawingWorldBuildingPlacedBlockSoftDirectionalGroundShadowOnGraphics({
    graphics: params.graphics,
    shadowTiles,
    fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_LAYER_FILL_ALPHA,
    softPasses:
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_CONTACT_SOFT_PASSES,
  });
}

/**
 * Draws both contact and cast sub-layers on one graphics instance (preview path).
 */
export function drawingWorldBuildingPlacedBlockGroundShadowLayerOnGraphics(
  params: DrawingWorldBuildingPlacedBlockGroundShadowLayerParams
): void {
  drawingWorldBuildingPlacedBlockGroundShadowCastLayerOnGraphics(params);
  drawingWorldBuildingPlacedBlockGroundShadowContactLayerOnGraphics(params);
}
