import type { DefiningWorldBuildingBlockDefinition } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import { checkingWorldBuildingPlacedBlockIsPassableTile } from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { resolvingWorldBuildingPlacedBlockExtrusionBottomLayer } from "@/components/world/building/domains/computingWorldBuildingPlacedBlockOccupiedLayerBand";
import { DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD } from "@/components/world/building/domains/definingWorldBuildingBlockRegistry";
import {
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE,
  DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE,
} from "@/components/world/building/domains/definingWorldBuildingCollisionShape";
import { computingWorldBuildingBlockSideFillColor } from "@/components/world/building/domains/computingWorldBuildingBlockSideFillColor";
import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import { computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor } from "@/components/world/domains/computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import { resolvingWorldPlazaInfiniteTileFillColor } from "@/components/world/domains/resolvingWorldPlazaInfiniteTileFillColor";
import type { Graphics } from "pixi.js";

/**
 * Draws extruded isometric tile columns for stacked build layers.
 *
 * @module components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics
 */

/** Side face fill alpha for placed blocks (fully opaque). */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_SIDE_FILL_ALPHA = 1;

/** Top face fill alpha for placed blocks (fully opaque). */
export const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_FILL_ALPHA = 1;

/** Top face stroke alpha for placed blocks (fully opaque). */
export const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA = 1;

/** Top face stroke width in pixels. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_WIDTH_PX = 1.25;

/**
 * Draws the back-facing diamond cap outline (west → north → east).
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param capCenterY - Cap center Y.
 * @param strokeColor - Edge outline color.
 * @param strokeAlpha - Edge outline opacity.
 */
function drawingWorldBuildingIsometricTileColumnBackCapStrokeOnGraphics(
  graphics: Graphics,
  centerX: number,
  capCenterY: number,
  strokeColor: number,
  strokeAlpha: number,
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  const westX = centerX - halfWidth;
  const eastX = centerX + halfWidth;
  const northY = capCenterY - halfHeight;

  graphics.moveTo(westX, capCenterY);
  graphics.lineTo(centerX, northY);
  graphics.lineTo(eastX, capCenterY);

  graphics.stroke({
    color: strokeColor,
    width: DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_WIDTH_PX,
    alpha: strokeAlpha,
  });
}

/**
 * Draws the front-facing diamond cap outline (west → south → east), omitting back edges.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param capCenterY - Cap center Y.
 * @param strokeColor - Edge outline color.
 * @param strokeAlpha - Edge outline opacity.
 */
function drawingWorldBuildingIsometricTileColumnFrontCapStrokeOnGraphics(
  graphics: Graphics,
  centerX: number,
  capCenterY: number,
  strokeColor: number,
  strokeAlpha: number,
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  const westX = centerX - halfWidth;
  const eastX = centerX + halfWidth;
  const southY = capCenterY + halfHeight;

  graphics.moveTo(westX, capCenterY);
  graphics.lineTo(centerX, southY);
  graphics.lineTo(eastX, capCenterY);

  graphics.stroke({
    color: strokeColor,
    width: DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_WIDTH_PX,
    alpha: strokeAlpha,
  });
}

/**
 * Draws vertical corner edges between the top and bottom diamond caps.
 *
 * Omits the north (back) edge so rear wireframe lines do not show through sides.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param topCenterY - Top face center Y.
 * @param bottomCenterY - Bottom face center Y.
 * @param strokeColor - Edge outline color (matches top face stroke).
 * @param strokeAlpha - Edge outline opacity.
 */
function drawingWorldBuildingIsometricTileColumnVerticalEdgesOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  bottomCenterY: number,
  strokeColor: number,
  strokeAlpha: number,
): void {
  if (topCenterY === bottomCenterY) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  const westX = centerX - halfWidth;
  const eastX = centerX + halfWidth;
  const southTopY = topCenterY + halfHeight;
  const southBottomY = bottomCenterY + halfHeight;

  graphics.moveTo(westX, topCenterY);
  graphics.lineTo(westX, bottomCenterY);
  graphics.moveTo(eastX, topCenterY);
  graphics.lineTo(eastX, bottomCenterY);
  graphics.moveTo(centerX, southTopY);
  graphics.lineTo(centerX, southBottomY);

  graphics.stroke({
    color: strokeColor,
    width: DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_WIDTH_PX,
    alpha: strokeAlpha,
  });
}

/**
 * Draws the bottom diamond cap front outline for an extruded column segment.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param bottomCenterY - Bottom face center Y.
 * @param strokeColor - Edge outline color (matches top face stroke).
 * @param strokeAlpha - Edge outline opacity.
 */
function drawingWorldBuildingIsometricTileColumnBottomFaceStrokeOnGraphics(
  graphics: Graphics,
  centerX: number,
  bottomCenterY: number,
  strokeColor: number,
  strokeAlpha: number,
): void {
  drawingWorldBuildingIsometricTileColumnFrontCapStrokeOnGraphics(
    graphics,
    centerX,
    bottomCenterY,
    strokeColor,
    strokeAlpha,
  );
}

/**
 * Returns true when a block should render as a stacked tile column.
 *
 * @param definition - Block type definition.
 */
export function checkingWorldBuildingBlockUsesTileColumnExtrusion(
  definition: DefiningWorldBuildingBlockDefinition,
): boolean {
  if (
    definition.collisionShape.kind ===
    DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_TILE
  ) {
    return true;
  }

  if (
    definition.collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE &&
    definition.id === DEFINING_WORLD_BUILDING_BLOCK_ID_BASIC_FLOOR_WOOD
  ) {
    return true;
  }

  return false;
}

/**
 * Returns true when a block keeps the legacy flat sprite draw path.
 *
 * @param definition - Block type definition.
 */
export function checkingWorldBuildingBlockUsesFlatPlacedBlockSprite(
  definition: DefiningWorldBuildingBlockDefinition,
): boolean {
  if (checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
    return false;
  }

  return (
    definition.collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_CIRCLE ||
    definition.collisionShape.kind ===
      DEFINING_WORLD_BUILDING_COLLISION_SHAPE_KIND_NONE
  );
}

/**
 * Returns true when a tile-column block should render as a flat passable tile.
 *
 * 0H placements are flat tiles at any layer. Ground 1H stays flush with terrain.
 *
 * @param definition - Block type definition.
 * @param worldLayer - One-based world layer for the placed block.
 * @param blockHeightLayers - Downward extrusion height (H).
 */
export function checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
  definition: DefiningWorldBuildingBlockDefinition,
  worldLayer: number,
  blockHeightLayers: number,
): boolean {
  if (!checkingWorldBuildingBlockUsesTileColumnExtrusion(definition)) {
    return false;
  }

  if (checkingWorldBuildingPlacedBlockIsPassableTile(blockHeightLayers)) {
    return true;
  }

  return (
    worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND &&
    blockHeightLayers <= 1
  );
}

/**
 * @deprecated Use {@link checkingWorldBuildingPlacedBlockUsesFlatTileRendering}.
 */
export function checkingWorldBuildingBlockUsesGroundFlatWorldLayerTile(
  definition: DefiningWorldBuildingBlockDefinition,
  worldLayer: number,
  blockHeightLayers = 1,
): boolean {
  return checkingWorldBuildingPlacedBlockUsesFlatTileRendering(
    definition,
    worldLayer,
    blockHeightLayers,
  );
}

/**
 * Resolves the screen Y center for one layer top face.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldBuildingTileColumnTopCenterY(
  groundCenterY: number,
  worldLayer: number,
): number {
  return (
    groundCenterY +
    computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer)
  );
}

/**
 * Resolves the screen Y center for the bottom of one layer column segment.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldBuildingTileColumnBottomCenterY(
  groundCenterY: number,
  worldLayer: number,
): number {
  if (worldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return groundCenterY;
  }

  return resolvingWorldBuildingTileColumnTopCenterY(
    groundCenterY,
    worldLayer - 1,
  );
}

/**
 * Draws the left and right vertical faces between two stacked diamond centers.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param topCenterY - Top face center Y.
 * @param bottomCenterY - Bottom face center Y.
 * @param sideFillColor - Side face fill color.
 */
function drawingWorldBuildingIsometricTileColumnSideFacesOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  bottomCenterY: number,
  sideFillColor: number,
  sideFillAlpha: number,
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const { leftSideFillColor, rightSideFillColor } =
    computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor(
      sideFillColor,
    );

  const westTopX = centerX - halfWidth;
  const westTopY = topCenterY;
  const southTopX = centerX;
  const southTopY = topCenterY + halfHeight;
  const eastTopX = centerX + halfWidth;
  const eastTopY = topCenterY;
  const westBottomX = centerX - halfWidth;
  const westBottomY = bottomCenterY;
  const southBottomX = centerX;
  const southBottomY = bottomCenterY + halfHeight;
  const eastBottomX = centerX + halfWidth;
  const eastBottomY = bottomCenterY;

  graphics
    .poly([
      westTopX,
      westTopY,
      southTopX,
      southTopY,
      southBottomX,
      southBottomY,
      westBottomX,
      westBottomY,
    ])
    .fill({
      color: leftSideFillColor,
      alpha: sideFillAlpha,
    });

  graphics
    .poly([
      southTopX,
      southTopY,
      eastTopX,
      eastTopY,
      eastBottomX,
      eastBottomY,
      southBottomX,
      southBottomY,
    ])
    .fill({
      color: rightSideFillColor,
      alpha: sideFillAlpha,
    });
}

/** Top cap outline mode for extruded columns. */
export type DrawingWorldBuildingIsometricTileColumnTopCapOutlineMode =
  | "fullDiamond"
  | "exposedTopEdgesOnly";

/**
 * Draws one isometric tile top cap.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param topCenterY - Top face center Y.
 * @param topFillColor - Top face fill color.
 * @param strokeColor - Top face outline color.
 * @param topFillAlpha - Top face fill opacity.
 * @param topStrokeAlpha - Top face stroke opacity.
 * @param topCapOutlineMode - Full diamond stroke or fill-only before exposed edges.
 */
function drawingWorldBuildingIsometricTileColumnTopFaceOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  topFillColor: number,
  strokeColor: number,
  topFillAlpha: number,
  topStrokeAlpha: number,
  topCapOutlineMode: DrawingWorldBuildingIsometricTileColumnTopCapOutlineMode = "fullDiamond",
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

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
    .fill({
      color: topFillColor,
      alpha: topFillAlpha,
    });

  if (topCapOutlineMode !== "fullDiamond") {
    return;
  }

  drawingWorldBuildingIsometricTileColumnFrontCapStrokeOnGraphics(
    graphics,
    centerX,
    topCenterY,
    strokeColor,
    topStrokeAlpha,
  );
  drawingWorldBuildingIsometricTileColumnBackCapStrokeOnGraphics(
    graphics,
    centerX,
    topCenterY,
    strokeColor,
    topStrokeAlpha,
  );
}

/**
 * Draws one extruded column spanning H layers downward from the top anchor layer.
 *
 * @param params - Tile indices, top layer, block height, and colors.
 */
export function drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics(
  params: DrawingWorldBuildingIsometricTileColumnLayerParams & {
    readonly blockHeightLayers: number;
    readonly drawsSideFaces?: boolean;
    readonly topCapOutlineMode?: DrawingWorldBuildingIsometricTileColumnTopCapOutlineMode;
  },
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: params.tileX,
    y: params.tileY,
  });
  const bottomLayer = resolvingWorldBuildingPlacedBlockExtrusionBottomLayer(
    params.worldLayer,
    params.blockHeightLayers,
  );
  const topCenterY = resolvingWorldBuildingTileColumnTopCenterY(
    center.y,
    params.worldLayer,
  );
  const bottomCenterY = resolvingWorldBuildingTileColumnBottomCenterY(
    center.y,
    bottomLayer,
  );
  const sideFillColor =
    params.sideFillColor ??
    (params.worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
      ? computingWorldBuildingBlockSideFillColor(
          resolvingWorldPlazaInfiniteTileFillColor(params.tileX, params.tileY),
        )
      : computingWorldBuildingBlockSideFillColor(params.topFillColor));

  if (params.drawsSideFaces !== false) {
    drawingWorldBuildingIsometricTileColumnSideFacesOnGraphics(
      params.graphics,
      center.x,
      topCenterY,
      bottomCenterY,
      sideFillColor,
      params.sideFillAlpha ??
        DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_SIDE_FILL_ALPHA,
    );
  }

  const topStrokeAlpha =
    params.topStrokeAlpha ??
    DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA;
  const topCapOutlineMode =
    params.topCapOutlineMode ?? "fullDiamond";
  const drawsColumnSideStrokes = topCapOutlineMode === "fullDiamond";

  if (drawsColumnSideStrokes) {
    drawingWorldBuildingIsometricTileColumnVerticalEdgesOnGraphics(
      params.graphics,
      center.x,
      topCenterY,
      bottomCenterY,
      params.strokeColor,
      topStrokeAlpha,
    );

    if (topCenterY !== bottomCenterY) {
      drawingWorldBuildingIsometricTileColumnBottomFaceStrokeOnGraphics(
        params.graphics,
        center.x,
        bottomCenterY,
        params.strokeColor,
        topStrokeAlpha,
      );
    }
  }

  drawingWorldBuildingIsometricTileColumnTopFaceOnGraphics(
    params.graphics,
    center.x,
    topCenterY,
    params.topFillColor,
    params.strokeColor,
    params.topFillAlpha ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_FILL_ALPHA,
    topStrokeAlpha,
    topCapOutlineMode,
  );
}

/** Params for {@link drawingWorldBuildingIsometricTileColumnLayerOnGraphics}. */
export interface DrawingWorldBuildingIsometricTileColumnLayerParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly topFillColor: number;
  readonly strokeColor: number;
  readonly sideFillColor?: number;
  readonly sideFillAlpha?: number;
  readonly topFillAlpha?: number;
  readonly topStrokeAlpha?: number;
}

/**
 * Draws one 8px tile column segment with side faces and a top cap.
 *
 * @param params - Tile indices, layer, and colors.
 */
export function drawingWorldBuildingIsometricTileColumnLayerOnGraphics(
  params: DrawingWorldBuildingIsometricTileColumnLayerParams,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: params.tileX,
    y: params.tileY,
  });
  const topCenterY = resolvingWorldBuildingTileColumnTopCenterY(
    center.y,
    params.worldLayer,
  );
  const bottomCenterY = resolvingWorldBuildingTileColumnBottomCenterY(
    center.y,
    params.worldLayer,
  );
  const sideFillColor =
    params.sideFillColor ??
    (params.worldLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
      ? computingWorldBuildingBlockSideFillColor(
          resolvingWorldPlazaInfiniteTileFillColor(params.tileX, params.tileY),
        )
      : computingWorldBuildingBlockSideFillColor(params.topFillColor));

  drawingWorldBuildingIsometricTileColumnSideFacesOnGraphics(
    params.graphics,
    center.x,
    topCenterY,
    bottomCenterY,
    sideFillColor,
    params.sideFillAlpha ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_SIDE_FILL_ALPHA,
  );

  const topStrokeAlpha =
    params.topStrokeAlpha ??
    DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA;

  drawingWorldBuildingIsometricTileColumnVerticalEdgesOnGraphics(
    params.graphics,
    center.x,
    topCenterY,
    bottomCenterY,
    params.strokeColor,
    topStrokeAlpha,
  );

  if (topCenterY !== bottomCenterY) {
    drawingWorldBuildingIsometricTileColumnBottomFaceStrokeOnGraphics(
      params.graphics,
      center.x,
      bottomCenterY,
      params.strokeColor,
      topStrokeAlpha,
    );
  }

  drawingWorldBuildingIsometricTileColumnTopFaceOnGraphics(
    params.graphics,
    center.x,
    topCenterY,
    params.topFillColor,
    params.strokeColor,
    params.topFillAlpha ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_FILL_ALPHA,
    params.topStrokeAlpha ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_TOP_STROKE_ALPHA,
  );
}

/** Params for {@link drawingWorldBuildingIsometricTileColumnPreviewOnGraphics}. */
export interface DrawingWorldBuildingIsometricTileColumnPreviewParams {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly isValid: boolean;
  readonly validFillColor?: number;
  readonly invalidFillColor?: number;
}

/** Preview side face alpha. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_SIDE_FILL_ALPHA = 0.35;

/** Preview top face alpha. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_TOP_FILL_ALPHA = 0.3;

/** Preview stroke alpha. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_TOP_STROKE_ALPHA = 0.85;

/** Preview valid fill color. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_VALID_FILL_COLOR =
  0x66ff66;

/** Preview invalid fill color. */
const DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_INVALID_FILL_COLOR =
  0xff3366;

/**
 * Draws a translucent preview column for build mode.
 *
 * @param params - Preview tile, layer, and validity flag.
 */
export function drawingWorldBuildingIsometricTileColumnPreviewOnGraphics(
  params: DrawingWorldBuildingIsometricTileColumnPreviewParams,
): void {
  const previewFillColor = params.isValid
    ? (params.validFillColor ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_VALID_FILL_COLOR)
    : (params.invalidFillColor ??
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_INVALID_FILL_COLOR);

  drawingWorldBuildingIsometricTileColumnLayerOnGraphics({
    graphics: params.graphics,
    tileX: params.tileX,
    tileY: params.tileY,
    worldLayer: params.worldLayer,
    topFillColor: previewFillColor,
    strokeColor: previewFillColor,
    sideFillColor: computingWorldBuildingBlockSideFillColor(previewFillColor),
    sideFillAlpha:
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_SIDE_FILL_ALPHA,
    topFillAlpha:
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_TOP_FILL_ALPHA,
    topStrokeAlpha:
      DRAWING_WORLD_BUILDING_ISOMETRIC_TILE_COLUMN_PREVIEW_TOP_STROKE_ALPHA,
  });
}
