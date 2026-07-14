import { checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay } from '@/components/world/building/domains/checkingWorldBuildingPlacedBlockIsPassableTileSurfaceOverlay';
import { computingWorldBuildingBlockSideFillColor } from '@/components/world/building/domains/computingWorldBuildingBlockSideFillColor';
import { resolvingWorldBuildingPlacedBlockExtrusionRenderParams } from '@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand';
import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import type { DefiningWorldBuildingBlockDefinitionId } from '@/components/world/building/domains/definingWorldBuildingBlockDefinition';
import { clampingWorldBuildingBlockHeight } from '@/components/world/building/domains/definingWorldBuildingBlockHeightConstants';
import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  checkingWorldBuildingPlacedBlockIsFootprintSatellite,
  listingWorldBuildingPlacementFootprintTilePositions,
  resolvingWorldBuildingBlockPlacementFootprint,
} from '@/components/world/building/domains/definingWorldBuildingPlacementFootprint';
import { checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility } from '@/components/world/building/domains/syncingWorldPlazaVisibleBlacksmithUtilityLayer';
import { DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE } from '@/components/world/building/domains/definingWorldBuildingCollisionShape';
import {
  checkingWorldBuildingCutFootprintIsFull,
  DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  normalizingWorldBuildingCutFootprintMask,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from '@/components/world/building/domains/definingWorldBuildingCutFootprintConstants';
import {
  creatingWorldBuildingPlacedBlock,
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockCutFootprintMask,
  resolvingWorldBuildingPlacedBlockCutGridAxisCellCount,
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
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

    if (
      checkingWorldBuildingPlacedBlockIsFootprintSatellite(block) ||
      checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility(block.definitionId)
    ) {
      // Sprites drawn by RenderingWorldPlazaBlacksmithUtilityLayer.
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

/** Preview valid wash color (placement allowed). */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALID_FILL_COLOR = 0x66ff66;

/** Preview invalid wash color (placement blocked). */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_INVALID_FILL_COLOR = 0xff3366;

/** Material ghost fill alpha for flat tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_FILL_ALPHA = 0.72;

/** Material ghost stroke alpha for flat tiles. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_STROKE_ALPHA = 0.9;

/** Material ghost side alpha for extruded columns. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_SIDE_FILL_ALPHA = 0.7;

/** Material ghost top fill alpha for extruded columns. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_TOP_FILL_ALPHA = 0.78;

/** Material ghost top stroke alpha for extruded columns. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_TOP_STROKE_ALPHA = 0.9;

/** Validity wash alpha drawn over the material ghost. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA = 0.22;

/** Validity outline alpha drawn over the material ghost. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA = 0.95;

/** Synthetic ids for the ephemeral placement-preview block entity. */
const DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_SYNTHETIC_ID =
  'placement-preview' as const;

type DrawingWorldBuildingPlacementPreviewGeometryParams = {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly blockHeightLayers: number;
  readonly cutFootprintMask: number;
  readonly cutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  readonly topFillColor: number;
  readonly strokeColor: number;
  readonly sideFillColor: number;
  readonly topFillAlpha: number;
  readonly sideFillAlpha: number;
  readonly topStrokeAlpha: number;
  readonly drawGroundShadow: boolean;
};

/**
 * Draws placement preview geometry (flat tile, cut footprint, or extrusion).
 */
function drawingWorldBuildingPlacementPreviewGeometryOnGraphics(
  params: DrawingWorldBuildingPlacementPreviewGeometryParams
): void {
  const isCutFootprint = !checkingWorldBuildingCutFootprintIsFull(
    params.cutFootprintMask,
    params.cutGridAxisCellCount
  );
  const usesFlatTile =
    params.blockHeightLayers === 0 ||
    (params.worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
      params.blockHeightLayers <= 1);

  if (isCutFootprint) {
    if (usesFlatTile) {
      drawingWorldBuildingCutFootprintFlatTilesOnGraphics({
        graphics: params.graphics,
        tileX: params.tileX,
        tileY: params.tileY,
        worldLayer: params.worldLayer,
        cutFootprintMask: params.cutFootprintMask,
        cutGridAxisCellCount: params.cutGridAxisCellCount,
        topFillColor: params.topFillColor,
        strokeColor: params.strokeColor,
        topFillAlpha: params.topFillAlpha,
        topStrokeAlpha: params.topStrokeAlpha,
      });
      return;
    }

    drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics({
      graphics: params.graphics,
      tileX: params.tileX,
      tileY: params.tileY,
      worldLayer: params.worldLayer,
      blockHeightLayers: params.blockHeightLayers,
      cutFootprintMask: params.cutFootprintMask,
      cutGridAxisCellCount: params.cutGridAxisCellCount,
      topFillColor: params.topFillColor,
      strokeColor: params.strokeColor,
      sideFillColor: params.sideFillColor,
      sideFillAlpha: params.sideFillAlpha,
      topFillAlpha: params.topFillAlpha,
      topStrokeAlpha: params.topStrokeAlpha,
    });
    return;
  }

  if (usesFlatTile) {
    drawingWorldBuildingFlatWorldLayerTileOnGraphics({
      graphics: params.graphics,
      tileX: params.tileX,
      tileY: params.tileY,
      worldLayer: params.worldLayer,
      fillColor: params.topFillColor,
      strokeColor: params.strokeColor,
      fillAlpha: params.topFillAlpha,
      strokeAlpha: params.topStrokeAlpha,
    });
    return;
  }

  if (
    params.drawGroundShadow &&
    params.blockHeightLayers >=
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_MIN_COLUMN_SPAN_LAYERS
  ) {
    drawingWorldBuildingIsometricTileColumnGroundShadowOnGraphics({
      graphics: params.graphics,
      tileX: params.tileX,
      tileY: params.tileY,
      columnSpanLayers: params.blockHeightLayers,
    });
  }

  drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
    graphics: params.graphics,
    tileX: params.tileX,
    tileY: params.tileY,
    worldLayer: params.worldLayer,
    blockHeightLayers: params.blockHeightLayers,
    topFillColor: params.topFillColor,
    strokeColor: params.strokeColor,
    sideFillColor: params.sideFillColor,
    sideFillAlpha: params.sideFillAlpha,
    topFillAlpha: params.topFillAlpha,
    topStrokeAlpha: params.topStrokeAlpha,
  });
}

/**
 * Draws a flat circle / marker sprite ghost for non-column preview blocks.
 */
function drawingWorldBuildingPlacementPreviewFlatSpriteOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  worldLayer: number,
  fillColor: number,
  strokeColor: number,
  radiusPx: number,
  fillAlpha: number,
  strokeAlpha: number
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);

  graphics
    .circle(center.x, centerY, radiusPx)
    .fill({
      color: fillColor,
      alpha: fillAlpha,
    })
    .stroke({
      color: strokeColor,
      width: 1.5,
      alpha: strokeAlpha,
    });
}

/**
 * Draws a hover preview for build mode placement using the selected material.
 *
 * Renders a translucent ghost of the block (colors + procedural textures), then
 * a light green/red wash so valid vs blocked tiles stay obvious.
 *
 * @param graphics - Target graphics instance.
 * @param tileX - Preview tile column.
 * @param tileY - Preview tile row.
 * @param isValid - Whether placement is allowed at the preview tile.
 * @param worldLayer - Target world layer (L).
 * @param blockHeightLayers - Downward extrusion height (H).
 * @param cutFootprintMask - Optional top-cut footprint mask.
 * @param cutGridAxisCellCount - Cut grid axis size for the footprint mask.
 * @param definitionId - Selected palette block definition id.
 */
export function drawingWorldBuildingPlacementPreviewOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  isValid: boolean,
  worldLayer: number = DEFINING_WORLD_BUILDING_WORLD_LAYER_BUILD_DEFAULT,
  blockHeightLayers = 1,
  cutFootprintMask: number = DEFINING_WORLD_BUILDING_CUT_FOOTPRINT_FULL_MASK,
  cutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount = DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  definitionId: DefiningWorldBuildingBlockDefinitionId | null = null
): void {
  const validityTintColor = isValid
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
  const definition = definitionId
    ? resolvingWorldBuildingBlockDefinition(definitionId)
    : null;

  if (!definition) {
    drawingWorldBuildingPlacementPreviewGeometryOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      blockHeightLayers: clampedBlockHeightLayers,
      cutFootprintMask: normalizedCutFootprintMask,
      cutGridAxisCellCount,
      topFillColor: validityTintColor,
      strokeColor: validityTintColor,
      sideFillColor:
        computingWorldBuildingBlockSideFillColor(validityTintColor),
      topFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_FILL_ALPHA,
      sideFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_SIDE_FILL_ALPHA,
      topStrokeAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA,
      drawGroundShadow: true,
    });
    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  }

  const previewBlock = creatingWorldBuildingPlacedBlock({
    blockId: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_SYNTHETIC_ID,
    plotId: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_SYNTHETIC_ID,
    definitionId: definition.id,
    tilePosition: { tileX, tileY },
    worldLayer,
    blockHeight: clampedBlockHeightLayers,
    cutFootprintMask: normalizedCutFootprintMask,
    cutGridAxisCellCount,
    ownerId: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_SYNTHETIC_ID,
    placedAt: '1970-01-01T00:00:00.000Z',
  });

  // Campfire before flat-tile / extrusion paths so tile-height craft placement
  // shows the same stone ring + logs as the map, not a material wash only.
  if (definition.id === DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE) {
    const campfireWashRadiusPx =
      0.35 * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
    drawingWorldBuildingPlacementPreviewFlatSpriteOnGraphics(
      graphics,
      tileX,
      tileY,
      worldLayer,
      validityTintColor,
      validityTintColor,
      campfireWashRadiusPx,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA
    );
    drawingWorldPlazaCampfirePlacedBlockOnGraphics(graphics, previewBlock);
    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  }

  if (checkingWorldBuildingBlockDefinitionIdIsBlacksmithUtility(definition.id)) {
    const footprint = resolvingWorldBuildingBlockPlacementFootprint(definition);
    const footprintTiles = listingWorldBuildingPlacementFootprintTilePositions(
      { tileX, tileY },
      footprint
    );
    const utilityWashRadiusPx =
      0.42 * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

    for (const footprintTile of footprintTiles) {
      drawingWorldBuildingPlacementPreviewFlatSpriteOnGraphics(
        graphics,
        footprintTile.tileX,
        footprintTile.tileY,
        worldLayer,
        validityTintColor,
        validityTintColor,
        utilityWashRadiusPx,
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA,
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA
      );
    }

    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  }

  const visualColors = resolvingWorldBuildingPlacedBlockVisualColors(
    previewBlock,
    definition
  );
  const materialSideFillColor = computingWorldBuildingBlockSideFillColor(
    visualColors.fillColor
  );
  const isCutFootprint = !checkingWorldBuildingCutFootprintIsFull(
    normalizedCutFootprintMask,
    cutGridAxisCellCount
  );
  const usesFlatTileRendering =
    checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
      definition,
      worldLayer,
      clampedBlockHeightLayers
    );
  const usesTileColumnExtrusion =
    checkingWorldBuildingBlockUsesTileColumnExtrusion(definition);
  const extrusionRenderParams = usesTileColumnExtrusion
    ? resolvingWorldBuildingPlacedBlockExtrusionRenderParams(previewBlock)
    : null;

  if (usesFlatTileRendering) {
    drawingWorldBuildingPlacementPreviewGeometryOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      blockHeightLayers: clampedBlockHeightLayers,
      cutFootprintMask: normalizedCutFootprintMask,
      cutGridAxisCellCount,
      topFillColor: visualColors.fillColor,
      strokeColor: visualColors.strokeColor,
      sideFillColor: materialSideFillColor,
      topFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_FILL_ALPHA,
      sideFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_SIDE_FILL_ALPHA,
      topStrokeAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_STROKE_ALPHA,
      drawGroundShadow: false,
    });
    drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
      graphics,
      previewBlock,
      definition,
      isCutFootprint
        ? {
            cutFootprintMask: normalizedCutFootprintMask,
            cutGridAxisCellCount,
          }
        : undefined
    );
  } else if (usesTileColumnExtrusion && extrusionRenderParams) {
    drawingWorldBuildingPlacementPreviewGeometryOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer: extrusionRenderParams.topWorldLayer,
      blockHeightLayers: extrusionRenderParams.blockHeightLayers,
      cutFootprintMask: normalizedCutFootprintMask,
      cutGridAxisCellCount,
      topFillColor: visualColors.fillColor,
      strokeColor: visualColors.strokeColor,
      sideFillColor: materialSideFillColor,
      topFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_TOP_FILL_ALPHA,
      sideFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_SIDE_FILL_ALPHA,
      topStrokeAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_TOP_STROKE_ALPHA,
      drawGroundShadow: true,
    });
    drawingWorldBuildingPlacedBlockTopFaceTextureOnGraphics(
      graphics,
      previewBlock,
      definition,
      isCutFootprint
        ? {
            cutFootprintMask: normalizedCutFootprintMask,
            cutGridAxisCellCount,
          }
        : undefined
    );
  } else if (checkingWorldBuildingBlockUsesFlatPlacedBlockSprite(definition)) {
    const radiusGrid =
      definition.collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE
        ? (definition.collisionShape.radiusGrid ?? 0.35)
        : 0.2;
    const radiusPx =
      radiusGrid * DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;

    drawingWorldBuildingPlacementPreviewFlatSpriteOnGraphics(
      graphics,
      tileX,
      tileY,
      worldLayer,
      visualColors.fillColor,
      visualColors.strokeColor,
      radiusPx,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_FILL_ALPHA,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_STROKE_ALPHA
    );
    drawingWorldBuildingPlacementPreviewFlatSpriteOnGraphics(
      graphics,
      tileX,
      tileY,
      worldLayer,
      validityTintColor,
      validityTintColor,
      radiusPx,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA,
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA
    );
    drawingWorldBuildingPlacementGuideToFloorOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
    });
    return;
  } else {
    drawingWorldBuildingPlacementPreviewGeometryOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer,
      blockHeightLayers: clampedBlockHeightLayers,
      cutFootprintMask: normalizedCutFootprintMask,
      cutGridAxisCellCount,
      topFillColor: visualColors.fillColor,
      strokeColor: visualColors.strokeColor,
      sideFillColor: materialSideFillColor,
      topFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_FILL_ALPHA,
      sideFillAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_SIDE_FILL_ALPHA,
      topStrokeAlpha:
        DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_MATERIAL_FLAT_STROKE_ALPHA,
      drawGroundShadow: true,
    });
  }

  const washWorldLayer =
    !usesFlatTileRendering && extrusionRenderParams
      ? extrusionRenderParams.topWorldLayer
      : worldLayer;
  const washBlockHeight =
    !usesFlatTileRendering && extrusionRenderParams
      ? extrusionRenderParams.blockHeightLayers
      : clampedBlockHeightLayers;

  drawingWorldBuildingPlacementPreviewGeometryOnGraphics({
    graphics,
    tileX,
    tileY,
    worldLayer: washWorldLayer,
    blockHeightLayers: washBlockHeight,
    cutFootprintMask: normalizedCutFootprintMask,
    cutGridAxisCellCount,
    topFillColor: validityTintColor,
    strokeColor: validityTintColor,
    sideFillColor: computingWorldBuildingBlockSideFillColor(validityTintColor),
    topFillAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA,
    sideFillAlpha: DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_WASH_ALPHA,
    topStrokeAlpha:
      DRAWING_WORLD_BUILDING_PLACEMENT_PREVIEW_VALIDITY_STROKE_ALPHA,
    drawGroundShadow: false,
  });

  drawingWorldBuildingPlacementGuideToFloorOnGraphics({
    graphics,
    tileX,
    tileY,
    worldLayer: washWorldLayer,
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
