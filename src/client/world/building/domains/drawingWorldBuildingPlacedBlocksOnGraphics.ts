import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay';
import { computingWorldBuildingBlockSideFillColor } from '@/components/world/building/domains/computingWorldBuildingBlockSideFillColor';
import { resolvingWorldBuildingPlacedBlockExtrusionRenderParams } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { clampingWorldBuildingBlockHeight } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingCutFootprintIsFull,
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  normalizingWorldBuildingCutFootprintMask,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockCutFootprintMask,
  resolvingWorldBuildingPlacedBlockCutGridAxisCellCount,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS } from '@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants';
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
} from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import {
  drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics,
  drawingWorldBuildingCutFootprintFlatTilesOnGraphics,
} from '@/components/world/building/domains/drawingWorldBuildingCutFootprintColumnsOnGraphics';
import { drawingWorldBuildingFlatWorldLayerTileOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingFlatWorldLayerTileOnGraphics';
import {
  checkingWorldBuildingBlockUsesFlatPlacedBlockSprite,
  checkingWorldBuildingBlockUsesTileColumnExtrusion,
  checkingWorldBuildingPlacedBlockUsesFlatTileRendering,
  DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_FILL_ALPHA,
  DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA,
  drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics,
} from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import { drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics';
import { drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics';
import { drawingWorldBuildingPlacementGuideToFloorOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingPlacementGuideOnGraphics';
import {
  groupingWorldBuildingPlacedBlocksByTileColumn,
  type GroupingWorldBuildingPlacedBlocksTileColumn,
} from '@/components/world/building/domains/groupingWorldBuildingPlacedBlocksByTileColumn';
import { resolvingWorldBuildingPlacedBlockVisualColors } from '@/components/world/building/domains/resolvingWorldBuildingPlacedBlockVisualColors';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { drawingWorldPlazaCampfirePlacedBlockOnGraphics } from '@/components/world/fire/domains/drawingWorldPlazaCampfireOnGraphics';
import type { Graphics } from 'pixi.js';

/**
 * Draws placed building blocks with stacked isometric column extrusion.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlocksOnGraphics
 */

/** Circle segment count for circular block colliders. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCKS_CIRCLE_SEGMENT_COUNT = 24;

/** Flat sprite fill alpha (fully opaque). */
const DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_FILL_ALPHA = 1;

/** Flat sprite stroke alpha (fully opaque). */
const DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_STROKE_ALPHA = 1;

/**
 * Depth sort key for flat placed block sprites.
 *
 * @param block - Placed block entity.
 */
function resolvingWorldBuildingPlacedBlockDepthSortKey(
  block: DefiningWorldBuildingPlacedBlock
): number {
  return (
    block.tilePosition.tileX +
    block.tilePosition.tileY +
    resolvingWorldBuildingPlacedBlockWorldLayer(block) * 0.01
  );
}

/**
 * Draws one flat circle or marker sprite for non-column blocks.
 *
 * @param graphics - Target graphics instance.
 * @param block - Placed block entity.
 */
function drawingWorldBuildingFlatPlacedBlockOnGraphics(
  graphics: Graphics,
  block: DefiningWorldBuildingPlacedBlock
): void {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  if (!definition) {
    return;
  }

  const visualColors = resolvingWorldBuildingPlacedBlockVisualColors(
    block,
    definition
  );

  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: block.tilePosition.tileX,
    y: block.tilePosition.tileY,
  });
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    resolvingWorldBuildingPlacedBlockWorldLayer(block)
  );
  const centerY = center.y + layerOffsetPx;

  if (
    definition.collisionShape.kind ===
    DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
  ) {
    const radiusGrid = definition.collisionShape.radiusGrid ?? 0.35;
    const radiusPx =
      radiusGrid * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

    graphics
      .circle(center.x, centerY, radiusPx)
      .fill({
        color: visualColors.fillColor,
        alpha: DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_FILL_ALPHA,
      })
      .stroke({
        color: visualColors.strokeColor,
        width: 1.5,
        alpha: DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_STROKE_ALPHA,
      });

    return;
  }

  graphics
    .circle(center.x, centerY, 6)
    .fill({
      color: visualColors.fillColor,
      alpha: DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_FILL_ALPHA,
    })
    .stroke({
      color: visualColors.strokeColor,
      width: 1,
      alpha: DRAWING_WORLD_BUILDING_PLACED_BLOCKS_FLAT_STROKE_ALPHA,
    });
}

/** Surface overlay tiles draw fully opaque so they cover the block top face. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_FILL_ALPHA = 1;

/** Surface overlay tile outline alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_STROKE_ALPHA = 1;

/** Top-cap outline mode for placed blocks (terrain-style exposed edges only). */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_TOP_CAP_OUTLINE_MODE =
  'exposedTopEdgesOnly' as const;

/**
 * Draws every block in one tile column, lowest layer first, then surface overlays.
 *
 * @param graphics - Target graphics instance for this column only.
 * @param tileColumn - Blocks grouped on a single tile, sorted low to high.
 */
export function drawingWorldBuildingPlacedBlockColumnOnGraphics(
  graphics: Graphics,
  tileColumn: GroupingWorldBuildingPlacedBlocksTileColumn
): void {
  const flatBlocks: DefiningWorldBuildingPlacedBlock[] = [];
  const surfaceOverlayFlatTiles: DefiningWorldBuildingPlacedBlock[] = [];

  for (const block of tileColumn.blocks) {
    const definition = resolvingWorldBuildingBlockDefinition(
      block.definitionId
    );

    if (!definition) {
      continue;
    }

    if (
      block.definitionId === DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
    ) {
      drawingWorldPlazaCampfirePlacedBlockOnGraphics(graphics, block);
      continue;
    }

    const visualColors = resolvingWorldBuildingPlacedBlockVisualColors(
      block,
      definition
    );

    const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
    const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
    const cutFootprintMask =
      resolvingWorldBuildingPlacedBlockCutFootprintMask(block);
    const cutGridAxisCellCount =
      resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
    const isCutFootprint = !checkingWorldBuildingCutFootprintIsFull(
      cutFootprintMask,
      cutGridAxisCellCount
    );

    if (
      checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
        definition,
        worldLayer,
        blockHeight
      )
    ) {
      if (checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay(block)) {
        surfaceOverlayFlatTiles.push(block);
        continue;
      }

      if (isCutFootprint) {
        drawingWorldBuildingCutFootprintFlatTilesOnGraphics({
          graphics,
          tileX: block.tilePosition.tileX,
          tileY: block.tilePosition.tileY,
          worldLayer,
          cutFootprintMask,
          cutGridAxisCellCount,
          topFillColor: visualColors.fillColor,
          strokeColor: visualColors.strokeColor,
        });
        drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
          graphics,
          block,
          definition,
          { cutFootprintMask, cutGridAxisCellCount }
        );
        continue;
      }

      drawingWorldBuildingFlatWorldLayerTileOnGraphics({
        graphics,
        tileX: block.tilePosition.tileX,
        tileY: block.tilePosition.tileY,
        worldLayer,
        fillColor: visualColors.fillColor,
        strokeColor: visualColors.strokeColor,
        fillAlpha: DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_FILL_ALPHA,
        strokeAlpha:
          DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA,
        topCapOutlineMode:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_TOP_CAP_OUTLINE_MODE,
      });
      drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
        graphics,
        block,
        definition
      );
      continue;
    }

    if (checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
      const extrusionRenderParams =
        resolvingWorldBuildingPlacedBlockExtrusionRenderParams(block);

      if (isCutFootprint) {
        drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics({
          graphics,
          tileX: block.tilePosition.tileX,
          tileY: block.tilePosition.tileY,
          worldLayer: extrusionRenderParams.topWorldLayer,
          blockHeightLayers: extrusionRenderParams.blockHeightLayers,
          cutFootprintMask,
          cutGridAxisCellCount,
          topFillColor: visualColors.fillColor,
          strokeColor: visualColors.strokeColor,
        });
        drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
          graphics,
          block,
          definition,
          { cutFootprintMask, cutGridAxisCellCount }
        );
        continue;
      }

      drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
        graphics,
        tileX: block.tilePosition.tileX,
        tileY: block.tilePosition.tileY,
        worldLayer: extrusionRenderParams.topWorldLayer,
        blockHeightLayers: extrusionRenderParams.blockHeightLayers,
        topFillColor: visualColors.fillColor,
        strokeColor: visualColors.strokeColor,
        topCapOutlineMode:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_TOP_CAP_OUTLINE_MODE,
      });
      drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
        graphics,
        block,
        definition
      );
      continue;
    }

    if (checkingWorldBuildingBlockUsesFlatPlacedBlockSprite(definition)) {
      flatBlocks.push(block);
    }
  }

  flatBlocks
    .sort(
      (leftBlock, rightBlock) =>
        resolvingWorldBuildingPlacedBlockDepthSortKey(leftBlock) -
        resolvingWorldBuildingPlacedBlockDepthSortKey(rightBlock)
    )
    .forEach((block) => {
      drawingWorldBuildingFlatPlacedBlockOnGraphics(graphics, block);
    });

  for (const block of surfaceOverlayFlatTiles) {
    const definition = resolvingWorldBuildingBlockDefinition(
      block.definitionId
    );

    if (!definition) {
      continue;
    }

    const overlayVisualColors = resolvingWorldBuildingPlacedBlockVisualColors(
      block,
      definition
    );

    const overlayWorldLayer =
      resolvingWorldBuildingPlacedBlockWorldLayer(block);
    const overlayCutFootprintMask =
      resolvingWorldBuildingPlacedBlockCutFootprintMask(block);
    const overlayCutGridAxisCellCount =
      resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);

    if (
      !checkingWorldBuildingCutFootprintIsFull(
        overlayCutFootprintMask,
        overlayCutGridAxisCellCount
      )
    ) {
      drawingWorldBuildingCutFootprintFlatTilesOnGraphics({
        graphics,
        tileX: block.tilePosition.tileX,
        tileY: block.tilePosition.tileY,
        worldLayer: overlayWorldLayer,
        cutFootprintMask: overlayCutFootprintMask,
        cutGridAxisCellCount: overlayCutGridAxisCellCount,
        topFillColor: overlayVisualColors.fillColor,
        strokeColor: overlayVisualColors.strokeColor,
        topFillAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_FILL_ALPHA,
        topStrokeAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_STROKE_ALPHA,
      });
      continue;
    }

    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics,
      tileX: block.tilePosition.tileX,
      tileY: block.tilePosition.tileY,
      worldLayer: overlayWorldLayer,
      fillColor: overlayVisualColors.fillColor,
      strokeColor: overlayVisualColors.strokeColor,
      fillAlpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_FILL_ALPHA,
      strokeAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_SURFACE_OVERLAY_STROKE_ALPHA,
    });
    drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
      graphics,
      block,
      definition
    );
  }
}

/**
 * Draws all placed blocks visible in the current query window into one graphics.
 *
 * @param graphics - Target graphics instance.
 * @param placedBlocks - Blocks to render.
 */
export function drawingWorldBuildingPlacedBlocksOnGraphics(
  graphics: Graphics,
  placedBlocks: DefiningWorldBuildingPlacedBlock[]
): void {
  const tileColumns =
    groupingWorldBuildingPlacedBlocksByTileColumn(placedBlocks);

  for (const tileColumn of tileColumns) {
    drawingWorldBuildingPlacedBlockColumnOnGraphics(graphics, tileColumn);
  }
}

/**
 * Draws a hover preview column for build mode placement.
 *
 * @param graphics - Target graphics instance.
 * @param tileX - Preview tile column.
 * @param tileY - Preview tile row.
 * @param isValid - Whether placement is allowed at the preview tile.
 * @param worldLayer - Target world layer (L).
 * @param blockHeightLayers - Downward extrusion height (H).
 */
/** Preview valid fill color for flat ground tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALID_FILL_COLOR = 0x66ff66;

/** Preview invalid fill color for flat ground tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_INVALID_FILL_COLOR = 0xff3366;

/** Preview fill alpha for flat ground tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_FILL_ALPHA = 0.3;

/** Preview stroke alpha for flat ground tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_STROKE_ALPHA = 0.85;

/** Preview stroke alpha for extruded block previews. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_STROKE_ALPHA = 0.85;

/** Preview side alpha for extruded block previews. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_SIDE_FILL_ALPHA = 0.85;

/** Preview top alpha for extruded block previews. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_FILL_ALPHA = 0.8;

export function drawingWorldBuildingPlacementPreviewOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  isValid: boolean,
  worldLayer: number = DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT,
  blockHeightLayers = 1,
  cutFootprintMask: number = DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  cutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT
): void {
  const previewFillColor = isValid
    ? DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALID_FILL_COLOR
    : DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_INVALID_FILL_COLOR;
  const clampedBlockHeightLayers = clampingWorldBuildingBlockHeight(
    blockHeightLayers,
    worldLayer
  );
  const normalizedCutFootprintMask = normalizingWorldBuildingCutFootprintMask(
    cutFootprintMask,
    cutGridAxisCellCount
  );
  const isCutFootprintPreview = !checkingWorldBuildingCutFootprintIsFull(
    normalizedCutFootprintMask,
    cutGridAxisCellCount
  );
  const usesFlatPreview =
    clampedBlockHeightLayers === 0 ||
    (worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
      clampedBlockHeightLayers <= 1);

  if (isCutFootprintPreview) {
    if (usesFlatPreview) {
      drawingWorldBuildingCutFootprintFlatTilesOnGraphics({
        graphics,
        tileX,
        tileY,
        worldLayer,
        cutFootprintMask: normalizedCutFootprintMask,
        cutGridAxisCellCount,
        topFillColor: previewFillColor,
        strokeColor: previewFillColor,
        topFillAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_FILL_ALPHA,
        topStrokeAlpha:
          DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_STROKE_ALPHA,
      });
    } else {
      drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics({
        graphics,
        tileX,
        tileY,
        worldLayer,
        blockHeightLayers: clampedBlockHeightLayers,
        cutFootprintMask: normalizedCutFootprintMask,
        cutGridAxisCellCount,
        topFillColor: previewFillColor,
        strokeColor: previewFillColor,
        sideFillColor:
          computingWorldBuildingBlockSideFillColor(previewFillColor),
        sideFillAlpha:
          DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_SIDE_FILL_ALPHA,
        topFillAlpha:
          DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_FILL_ALPHA,
        topStrokeAlpha:
          DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_STROKE_ALPHA,
      });
    }

    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  }

  if (clampedBlockHeightLayers === 0) {
    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      fillColor: previewFillColor,
      strokeColor: previewFillColor,
      fillAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_FILL_ALPHA,
      strokeAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_STROKE_ALPHA,
    });
    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  }

  if (
    worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
    clampedBlockHeightLayers <= 1
  ) {
    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      fillColor: previewFillColor,
      strokeColor: previewFillColor,
      fillAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_FILL_ALPHA,
      strokeAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_FLAT_STROKE_ALPHA,
    });
    return;
  }

  if (
    clampedBlockHeightLayers >=
    DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS
  ) {
    drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics({
      graphics,
      tileX,
      tileY,
      columnSpanLayers: clampedBlockHeightLayers,
    });
  }

  drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
    graphics,
    tileX,
    tileY,
    worldLayer,
    blockHeightLayers: clampedBlockHeightLayers,
    topFillColor: previewFillColor,
    strokeColor: previewFillColor,
    sideFillColor: computingWorldBuildingBlockSideFillColor(previewFillColor),
    sideFillAlpha:
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_SIDE_FILL_ALPHA,
    topFillAlpha:
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_FILL_ALPHA,
    topStrokeAlpha:
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_COLUMN_TOP_STROKE_ALPHA,
  });

  drawingWorldBuildingPlacementGuideToFloorOnGraphics({
    graphics,
    tileX,
    tileY,
    worldLayer,
  });
}

/** Hover highlight overlay color for a targeted placed block. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_COLOR = 0xfff1a8;

/** Hover highlight top face fill alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_TOP_FILL_ALPHA = 0.4;

/** Hover highlight side face fill alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_SIDE_FILL_ALPHA = 0.32;

/** Hover highlight outline alpha. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA = 1;

/** Hover highlight ring radius for flat sprite blocks in pixels. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_FLAT_SPRITE_RADIUS_PX = 9;

/** Hover highlight ring stroke width for flat sprite blocks in pixels. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_FLAT_SPRITE_STROKE_WIDTH_PX = 2;

/**
 * Draws a hover highlight overlay matching one placed block's footprint.
 *
 * Mirrors the block's own column or flat-tile geometry so the highlight aligns
 * with the rendered block, then tints it warm to signal a removal target.
 *
 * @param graphics - Target graphics instance.
 * @param block - Placed block under the build mode cursor.
 */
export function drawingWorldBuildingPlacedBlockHoverHighlightOnGraphics(
  graphics: Graphics,
  block: DefiningWorldBuildingPlacedBlock
): void {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  if (!definition) {
    return;
  }

  const tileX = block.tilePosition.tileX;
  const tileY = block.tilePosition.tileY;
  const worldLayer = resolvingWorldBuildingPlacedBlockWorldLayer(block);
  const blockHeight = resolvingWorldBuildingPlacedBlockBlockHeight(block);
  const cutFootprintMask =
    resolvingWorldBuildingPlacedBlockCutFootprintMask(block);
  const cutGridAxisCellCount =
    resolvingWorldBuildingPlacedBlockCutGridAxisCellCount(block);
  const isCutFootprint = !checkingWorldBuildingCutFootprintIsFull(
    cutFootprintMask,
    cutGridAxisCellCount
  );
  const highlightColor =
    DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_COLOR;

  if (
    checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
      definition,
      worldLayer,
      blockHeight
    )
  ) {
    if (isCutFootprint) {
      drawingWorldBuildingCutFootprintFlatTilesOnGraphics({
        graphics,
        tileX,
        tileY,
        worldLayer,
        cutFootprintMask,
        cutGridAxisCellCount,
        topFillColor: highlightColor,
        strokeColor: highlightColor,
        topFillAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_TOP_FILL_ALPHA,
        topStrokeAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA,
      });
      return;
    }

    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      fillColor: highlightColor,
      strokeColor: highlightColor,
      fillAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_TOP_FILL_ALPHA,
      strokeAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA,
    });
    return;
  }

  if (checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
    const extrusionRenderParams =
      resolvingWorldBuildingPlacedBlockExtrusionRenderParams(block);

    if (isCutFootprint) {
      drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics({
        graphics,
        tileX,
        tileY,
        worldLayer: extrusionRenderParams.topWorldLayer,
        blockHeightLayers: extrusionRenderParams.blockHeightLayers,
        cutFootprintMask,
        cutGridAxisCellCount,
        topFillColor: highlightColor,
        strokeColor: highlightColor,
        sideFillColor: computingWorldBuildingBlockSideFillColor(highlightColor),
        sideFillAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_SIDE_FILL_ALPHA,
        topFillAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_TOP_FILL_ALPHA,
        topStrokeAlpha:
          DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA,
      });
      return;
    }

    drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer: extrusionRenderParams.topWorldLayer,
      blockHeightLayers: extrusionRenderParams.blockHeightLayers,
      topFillColor: highlightColor,
      strokeColor: highlightColor,
      sideFillColor: computingWorldBuildingBlockSideFillColor(highlightColor),
      sideFillAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_SIDE_FILL_ALPHA,
      topFillAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_TOP_FILL_ALPHA,
      topStrokeAlpha:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA,
    });
    return;
  }

  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);

  graphics
    .circle(
      center.x,
      centerY,
      DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_FLAT_SPRITE_RADIUS_PX
    )
    .stroke({
      color: highlightColor,
      width:
        DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_FLAT_SPRITE_STROKE_WIDTH_PX,
      alpha: DRAWING_WORLD_BUILDING_PLACED_BLOCK_HOVER_HIGHLIGHT_STROKE_ALPHA,
    });
}

/** Re-export for circular drawing consistency in future block types. */
export const DRAWING_WORLD_BUILDING_PLACED_BLOCK_CIRCLE_SEGMENT_COUNT =
  DRAWING_WORLD_BUILDING_PLACED_BLOCKS_CIRCLE_SEGMENT_COUNT;
