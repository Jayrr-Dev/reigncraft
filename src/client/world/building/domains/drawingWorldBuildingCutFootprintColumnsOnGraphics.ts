import { computingWorldBuildingBlockSideFillColor } from "@/components/world/building/domains/computingWorldBuildingBlockSideFillColor";
import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { resolvingWorldBuildingPlacedBlockExtrusionBottomLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import {
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT,
  listingWorldBuildingCutFootprintSetCells,
  resolvingWorldBuildingCutCellFraction,
  type DefiningWorldBuildingCutGridAxisCellCount,
} from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_LEFT_FACE_SALT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_RIGHT_FACE_SALT,
} from "@/components/world/building/domains/definingWorldBuildingPineWoodTopFaceTextureConstants";
import {
  drawingWorldBuildingPineWoodPlankSideFaceOnGraphics,
  drawingWorldBuildingPineWoodPlankTopFaceOnGraphics,
} from "@/components/world/building/domains/drawingWorldBuildingPineWoodPlankTextureOnGraphics";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor } from "@/components/world/domains/computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws scaled isometric columns for cut footprint sub-cells within a tile.
 *
 * Each filled sub-cell renders as a scaled diamond column (or flat diamond),
 * positioned at the sub-cell center inside the tile.
 *
 * @module components/world/building/domains/drawingWorldBuildingCutFootprintColumnsOnGraphics
 */

/** Top face stroke width for cut sub-cells in pixels. */
const DRAWING_WORLD_BUILDING_CUT_CELL_TOP_STROKE_WIDTH_PX = 1;

/** Side face fill alpha for solid cut cells. */
const DRAWING_WORLD_BUILDING_CUT_CELL_SIDE_FILL_ALPHA = 1;

/** Top face fill alpha for solid cut cells. */
const DRAWING_WORLD_BUILDING_CUT_CELL_TOP_FILL_ALPHA = 1;

/** Top face stroke alpha for solid cut cells. */
const DRAWING_WORLD_BUILDING_CUT_CELL_TOP_STROKE_ALPHA = 1;

/**
 * Resolves scaled half tile width for one cut sub-cell.
 *
 * @param axisCellCount - Grid size along each tile axis.
 */
function resolvingWorldBuildingCutCellHalfWidthPx(
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): number {
  return (
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
    resolvingWorldBuildingCutCellFraction(axisCellCount)
  );
}

/**
 * Resolves scaled half tile height for one cut sub-cell.
 *
 * @param axisCellCount - Grid size along each tile axis.
 */
function resolvingWorldBuildingCutCellHalfHeightPx(
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): number {
  return (
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    resolvingWorldBuildingCutCellFraction(axisCellCount)
  );
}

/**
 * Resolves the grid-space center for one cut sub-cell within a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param col - Sub-cell column.
 * @param row - Sub-cell row.
 * @param axisCellCount - Grid size along each tile axis.
 */
function resolvingWorldBuildingCutCellGridCenter(
  tileX: number,
  tileY: number,
  col: number,
  row: number,
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): { readonly gridX: number; readonly gridY: number } {
  const cellFraction = resolvingWorldBuildingCutCellFraction(axisCellCount);

  return {
    gridX: tileX - 0.5 + (col + 0.5) * cellFraction,
    gridY: tileY - 0.5 + (row + 0.5) * cellFraction,
  };
}

/**
 * Draws the two visible vertical side faces of a scaled sub-cell column.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Sub-cell screen center X.
 * @param topCenterY - Top face center Y.
 * @param bottomCenterY - Bottom face center Y.
 * @param sideFillColor - Side face fill color.
 * @param sideFillAlpha - Side face fill opacity.
 * @param axisCellCount - Grid size along each tile axis.
 */
function drawingWorldBuildingCutCellSideFacesOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  bottomCenterY: number,
  sideFillColor: number,
  sideFillAlpha: number,
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): void {
  const halfWidth = resolvingWorldBuildingCutCellHalfWidthPx(axisCellCount);
  const halfHeight = resolvingWorldBuildingCutCellHalfHeightPx(axisCellCount);
  const { leftSideFillColor, rightSideFillColor } =
    computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor(
      sideFillColor,
    );

  graphics
    .poly([
      centerX - halfWidth,
      topCenterY,
      centerX,
      topCenterY + halfHeight,
      centerX,
      bottomCenterY + halfHeight,
      centerX - halfWidth,
      bottomCenterY,
    ])
    .fill({ color: leftSideFillColor, alpha: sideFillAlpha });

  graphics
    .poly([
      centerX,
      topCenterY + halfHeight,
      centerX + halfWidth,
      topCenterY,
      centerX + halfWidth,
      bottomCenterY,
      centerX,
      bottomCenterY + halfHeight,
    ])
    .fill({ color: rightSideFillColor, alpha: sideFillAlpha });
}

/**
 * Draws the top diamond cap of a scaled sub-cell column.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Sub-cell screen center X.
 * @param topCenterY - Top face center Y.
 * @param topFillColor - Top face fill color.
 * @param strokeColor - Top face outline color.
 * @param topFillAlpha - Top face fill opacity.
 * @param topStrokeAlpha - Top face outline opacity.
 * @param axisCellCount - Grid size along each tile axis.
 */
function drawingWorldBuildingCutCellTopFaceOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  topFillColor: number,
  strokeColor: number,
  topFillAlpha: number,
  topStrokeAlpha: number,
  axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
): void {
  const halfWidth = resolvingWorldBuildingCutCellHalfWidthPx(axisCellCount);
  const halfHeight = resolvingWorldBuildingCutCellHalfHeightPx(axisCellCount);

  graphics
    .poly([
      centerX,
      topCenterY - halfHeight,
      centerX + halfWidth,
      topCenterY,
      centerX,
      topCenterY + halfHeight,
      centerX - halfWidth,
      topCenterY,
    ])
    .fill({ color: topFillColor, alpha: topFillAlpha })
    .stroke({
      color: strokeColor,
      width: DRAWING_WORLD_BUILDING_CUT_CELL_TOP_STROKE_WIDTH_PX,
      alpha: topStrokeAlpha,
    });
}

/** Color and opacity inputs shared by cut cell draws. */
export interface DrawingWorldBuildingCutFootprintColorParams {
  readonly topFillColor: number;
  readonly strokeColor: number;
  readonly sideFillColor?: number;
  readonly sideFillAlpha?: number;
  readonly topFillAlpha?: number;
  readonly topStrokeAlpha?: number;
}

/** Params for {@link drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics}. */
export interface DrawingWorldBuildingCutFootprintExtrusionParams
  extends DrawingWorldBuildingCutFootprintColorParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly blockHeightLayers: number;
  readonly cutFootprintMask: number;
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
}

/**
 * Draws extruded scaled columns for each filled cut sub-cell.
 *
 * @param params - Tile, layer band, mask, and colors.
 */
export function drawingWorldBuildingCutFootprintExtrusionColumnsOnGraphics(
  params: DrawingWorldBuildingCutFootprintExtrusionParams,
): void {
  const cutGridAxisCellCount =
    params.cutGridAxisCellCount ??
    DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
  const bottomLayer = resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
    params.worldLayer,
    params.blockHeightLayers,
  );
  const topLayerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    params.worldLayer,
  );
  const bottomLayerOffsetPx =
    bottomLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
      ? 0
      : computingWorldBuildingWorldLayerScreenOffsetPx(bottomLayer - 1);
  const sideFillColor =
    params.sideFillColor ??
    computingWorldBuildingBlockSideFillColor(params.topFillColor);
  const sideFillAlpha =
    params.sideFillAlpha ?? DRAWING_WORLD_BUILDING_CUT_CELL_SIDE_FILL_ALPHA;
  const topFillAlpha =
    params.topFillAlpha ?? DRAWING_WORLD_BUILDING_CUT_CELL_TOP_FILL_ALPHA;
  const topStrokeAlpha =
    params.topStrokeAlpha ?? DRAWING_WORLD_BUILDING_CUT_CELL_TOP_STROKE_ALPHA;

  for (const cell of listingWorldBuildingCutFootprintSetCells(
    params.cutFootprintMask,
    cutGridAxisCellCount,
  )) {
    const gridCenter = resolvingWorldBuildingCutCellGridCenter(
      params.tileX,
      params.tileY,
      cell.col,
      cell.row,
      cutGridAxisCellCount,
    );
    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: gridCenter.gridX,
      y: gridCenter.gridY,
    });
    const topCenterY = center.y + topLayerOffsetPx;
    const bottomCenterY = center.y + bottomLayerOffsetPx;

    drawingWorldBuildingCutCellSideFacesOnGraphics(
      params.graphics,
      center.x,
      topCenterY,
      bottomCenterY,
      sideFillColor,
      sideFillAlpha,
      cutGridAxisCellCount,
    );
    drawingWorldBuildingCutCellTopFaceOnGraphics(
      params.graphics,
      center.x,
      topCenterY,
      params.topFillColor,
      params.strokeColor,
      topFillAlpha,
      topStrokeAlpha,
      cutGridAxisCellCount,
    );
  }
}

/** Params for {@link drawingWorldBuildingCutFootprintFlatTilesOnGraphics}. */
export interface DrawingWorldBuildingCutFootprintFlatParams
  extends DrawingWorldBuildingCutFootprintColorParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly cutFootprintMask: number;
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
}

/**
 * Draws flat scaled diamonds for each filled cut sub-cell.
 *
 * @param params - Tile, layer, mask, and colors.
 */
export function drawingWorldBuildingCutFootprintFlatTilesOnGraphics(
  params: DrawingWorldBuildingCutFootprintFlatParams,
): void {
  const cutGridAxisCellCount =
    params.cutGridAxisCellCount ??
    DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    params.worldLayer,
  );
  const topFillAlpha =
    params.topFillAlpha ?? DRAWING_WORLD_BUILDING_CUT_CELL_TOP_FILL_ALPHA;
  const topStrokeAlpha =
    params.topStrokeAlpha ?? DRAWING_WORLD_BUILDING_CUT_CELL_TOP_STROKE_ALPHA;

  for (const cell of listingWorldBuildingCutFootprintSetCells(
    params.cutFootprintMask,
    cutGridAxisCellCount,
  )) {
    const gridCenter = resolvingWorldBuildingCutCellGridCenter(
      params.tileX,
      params.tileY,
      cell.col,
      cell.row,
      cutGridAxisCellCount,
    );
    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: gridCenter.gridX,
      y: gridCenter.gridY,
    });

    drawingWorldBuildingCutCellTopFaceOnGraphics(
      params.graphics,
      center.x,
      center.y + layerOffsetPx,
      params.topFillColor,
      params.strokeColor,
      topFillAlpha,
      topStrokeAlpha,
      cutGridAxisCellCount,
    );
  }
}

/** Params for top-cut plank texture passes. */
export interface DrawingWorldBuildingCutFootprintTextureParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly cutFootprintMask: number;
  readonly cutGridAxisCellCount?: DefiningWorldBuildingCutGridAxisCellCount;
  readonly baseFillColor: number;
}

/** Params for extruded top-cut plank texture passes. */
export interface DrawingWorldBuildingCutFootprintExtrusionTextureParams
  extends DrawingWorldBuildingCutFootprintTextureParams {
  readonly blockHeightLayers: number;
}

/**
 * Draws plank top textures clipped to each filled cell of a flat top-cut tile.
 *
 * @param params - Tile, layer, top mask, and base color.
 */
export function drawingWorldBuildingCutFootprintFlatTileTexturesOnGraphics(
  params: DrawingWorldBuildingCutFootprintTextureParams,
): void {
  const cutGridAxisCellCount =
    params.cutGridAxisCellCount ??
    DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
  const layerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    params.worldLayer,
  );
  const halfWidth = resolvingWorldBuildingCutCellHalfWidthPx(cutGridAxisCellCount);
  const halfHeight = resolvingWorldBuildingCutCellHalfHeightPx(
    cutGridAxisCellCount,
  );

  for (const cell of listingWorldBuildingCutFootprintSetCells(
    params.cutFootprintMask,
    cutGridAxisCellCount,
  )) {
    const gridCenter = resolvingWorldBuildingCutCellGridCenter(
      params.tileX,
      params.tileY,
      cell.col,
      cell.row,
      cutGridAxisCellCount,
    );
    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: gridCenter.gridX,
      y: gridCenter.gridY,
    });

    drawingWorldBuildingPineWoodPlankTopFaceOnGraphics(
      params.graphics,
      params.tileX * cutGridAxisCellCount + cell.col,
      params.tileY * cutGridAxisCellCount + cell.row,
      center.x,
      center.y + layerOffsetPx,
      params.baseFillColor,
      halfWidth,
      halfHeight,
    );
  }
}

/**
 * Draws plank top and side textures for each filled cell of an extruded
 * top-cut column.
 *
 * @param params - Tile, layer band, top mask, and base color.
 */
export function drawingWorldBuildingCutFootprintExtrusionTexturesOnGraphics(
  params: DrawingWorldBuildingCutFootprintExtrusionTextureParams,
): void {
  const cutGridAxisCellCount =
    params.cutGridAxisCellCount ??
    DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
  const bottomLayer = resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
    params.worldLayer,
    params.blockHeightLayers,
  );
  const topLayerOffsetPx = computingWorldBuildingWorldLayerScreenOffsetPx(
    params.worldLayer,
  );
  const bottomLayerOffsetPx =
    bottomLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
      ? 0
      : computingWorldBuildingWorldLayerScreenOffsetPx(bottomLayer - 1);
  const halfWidth = resolvingWorldBuildingCutCellHalfWidthPx(cutGridAxisCellCount);
  const halfHeight = resolvingWorldBuildingCutCellHalfHeightPx(
    cutGridAxisCellCount,
  );

  for (const cell of listingWorldBuildingCutFootprintSetCells(
    params.cutFootprintMask,
    cutGridAxisCellCount,
  )) {
    const gridCenter = resolvingWorldBuildingCutCellGridCenter(
      params.tileX,
      params.tileY,
      cell.col,
      cell.row,
      cutGridAxisCellCount,
    );
    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: gridCenter.gridX,
      y: gridCenter.gridY,
    });
    const topCenterY = center.y + topLayerOffsetPx;
    const bottomCenterY = center.y + bottomLayerOffsetPx;
    const seedTileX = params.tileX * cutGridAxisCellCount + cell.col;
    const seedTileY = params.tileY * cutGridAxisCellCount + cell.row;

    drawingWorldBuildingPineWoodPlankSideFaceOnGraphics(
      params.graphics,
      seedTileX,
      seedTileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_LEFT_FACE_SALT,
      { x: center.x - halfWidth, y: topCenterY },
      { x: center.x, y: topCenterY + halfHeight },
      { x: center.x, y: bottomCenterY + halfHeight },
      { x: center.x - halfWidth, y: bottomCenterY },
      params.baseFillColor,
    );
    drawingWorldBuildingPineWoodPlankSideFaceOnGraphics(
      params.graphics,
      seedTileX,
      seedTileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_RIGHT_FACE_SALT,
      { x: center.x, y: topCenterY + halfHeight },
      { x: center.x + halfWidth, y: topCenterY },
      { x: center.x + halfWidth, y: bottomCenterY },
      { x: center.x, y: bottomCenterY + halfHeight },
      params.baseFillColor,
    );
    drawingWorldBuildingPineWoodPlankTopFaceOnGraphics(
      params.graphics,
      seedTileX,
      seedTileY,
      center.x,
      topCenterY,
      params.baseFillColor,
      halfWidth,
      halfHeight,
    );
  }
}

/** Re-export of default grid axis count for cut renderer consumers. */
export const DRAWING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT =
  DEFINING_WORLD_BUILDING_CUT_GRID_AXIS_CELL_COUNT_DEFAULT;
