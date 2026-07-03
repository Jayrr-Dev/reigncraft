import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_FILL_COLOR,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE,
  resolvingWorldBuildingPlacedBlockGroundShadowProjectionOffset,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import {
  creatingWorldBuildingTilePosition,
  formattingWorldBuildingTilePositionKey,
} from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws directional, height-scaled ground shadows for placed block columns.
 *
 * The shadow is the merged tile footprint plus a projected tongue swept from the
 * trailing footprint edges (the sides facing away from the upper-left light)
 * toward the lower-right. Trailing edges by definition face open ground, so the
 * swept quads never overlap another shadow tile and tile edge to edge, which
 * keeps the translucent layer free of double-darkening.
 *
 * @module components/world/building/domains/drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics
 */

/** One tile column that casts a ground shadow. */
export interface DrawingWorldBuildingPlacedBlockGroundShadowTile {
  readonly tileX: number;
  readonly tileY: number;
  readonly columnSpanLayers: number;
}

/** Input for {@link drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics}. */
export interface DrawingWorldBuildingPlacedBlockDirectionalGroundShadowParams {
  /** Target graphics instance. */
  readonly graphics: Graphics;
  /** Tile columns that cast a ground shadow. */
  readonly shadowTiles: ReadonlyArray<DrawingWorldBuildingPlacedBlockGroundShadowTile>;
  /** Per-fill opacity (use 1 when a group alpha is applied to the layer). */
  readonly fillAlpha: number;
  /** Screen-space X offset applied to every shadow vertex for soft passes. */
  readonly offsetXPx?: number;
  /** Screen-space Y offset applied to every shadow vertex for soft passes. */
  readonly offsetYPx?: number;
  /** When false, skips the footprint diamond fill. */
  readonly drawFootprint?: boolean;
  /** When false, skips trailing cast tongues. */
  readonly drawTongues?: boolean;
}

/** Screen-space point. */
interface DrawingWorldBuildingPlacedBlockGroundShadowPoint {
  readonly x: number;
  readonly y: number;
}

/** Diamond corner names for one tile footprint. */
type DrawingWorldBuildingPlacedBlockGroundShadowCornerName =
  | "north"
  | "east"
  | "south"
  | "west";

/** Maps one grid neighbor direction to the shared diamond edge. */
const DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_NEIGHBOR_EDGE_BINDINGS = [
  {
    neighborTileXOffset: 1,
    neighborTileYOffset: 0,
    edgeStartCorner: "east",
    edgeEndCorner: "south",
  },
  {
    neighborTileXOffset: -1,
    neighborTileYOffset: 0,
    edgeStartCorner: "west",
    edgeEndCorner: "north",
  },
  {
    neighborTileXOffset: 0,
    neighborTileYOffset: 1,
    edgeStartCorner: "south",
    edgeEndCorner: "west",
  },
  {
    neighborTileXOffset: 0,
    neighborTileYOffset: -1,
    edgeStartCorner: "north",
    edgeEndCorner: "east",
  },
] as const satisfies ReadonlyArray<{
  readonly neighborTileXOffset: number;
  readonly neighborTileYOffset: number;
  readonly edgeStartCorner: DrawingWorldBuildingPlacedBlockGroundShadowCornerName;
  readonly edgeEndCorner: DrawingWorldBuildingPlacedBlockGroundShadowCornerName;
}>;

/**
 * Resolves the four screen-space corners of one tile footprint diamond.
 *
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 */
function resolvingWorldBuildingPlacedBlockGroundShadowDiamondCorners(
  centerX: number,
  centerY: number,
): Record<
  DrawingWorldBuildingPlacedBlockGroundShadowCornerName,
  DrawingWorldBuildingPlacedBlockGroundShadowPoint
> {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  return {
    north: { x: centerX, y: centerY - halfHeight },
    east: { x: centerX + halfWidth, y: centerY },
    south: { x: centerX, y: centerY + halfHeight },
    west: { x: centerX - halfWidth, y: centerY },
  };
}

/**
 * Resolves the outward normal for one diamond edge.
 *
 * @param start - Edge start corner.
 * @param end - Edge end corner.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 */
function resolvingWorldBuildingPlacedBlockGroundShadowEdgeOutwardNormal(
  start: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  end: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  centerX: number,
  centerY: number,
): DrawingWorldBuildingPlacedBlockGroundShadowPoint {
  const edgeDeltaX = end.x - start.x;
  const edgeDeltaY = end.y - start.y;
  const edgeMidpointX = (start.x + end.x) / 2;
  const edgeMidpointY = (start.y + end.y) / 2;
  const centerToEdgeMidpointX = edgeMidpointX - centerX;
  const centerToEdgeMidpointY = edgeMidpointY - centerY;

  const perpendicularCandidate = { x: -edgeDeltaY, y: edgeDeltaX };
  const pointsOutward =
    perpendicularCandidate.x * centerToEdgeMidpointX +
      perpendicularCandidate.y * centerToEdgeMidpointY >=
    0;
  const outward = pointsOutward
    ? perpendicularCandidate
    : { x: edgeDeltaY, y: -edgeDeltaX };
  const length = Math.hypot(outward.x, outward.y);

  if (length === 0) {
    return { x: 0, y: 0 };
  }

  return { x: outward.x / length, y: outward.y / length };
}

/**
 * Applies a screen-space offset to one point.
 *
 * @param point - Source point.
 * @param offsetXPx - Horizontal offset in pixels.
 * @param offsetYPx - Vertical offset in pixels.
 */
function offsettingWorldBuildingPlacedBlockGroundShadowPoint(
  point: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  offsetXPx: number,
  offsetYPx: number,
): DrawingWorldBuildingPlacedBlockGroundShadowPoint {
  return {
    x: point.x + offsetXPx,
    y: point.y + offsetYPx,
  };
}

/**
 * Scales one point around a tile center.
 *
 * @param point - Source point.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param scale - Scale factor from the tile center.
 */
function scalingWorldBuildingPlacedBlockGroundShadowPointFromCenter(
  point: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  centerX: number,
  centerY: number,
  scale: number,
): DrawingWorldBuildingPlacedBlockGroundShadowPoint {
  return {
    x: centerX + (point.x - centerX) * scale,
    y: centerY + (point.y - centerY) * scale,
  };
}

/**
 * Resolves scaled diamond corners for one tile footprint.
 *
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 */
function resolvingWorldBuildingPlacedBlockGroundShadowScaledDiamondCorners(
  centerX: number,
  centerY: number,
): Record<
  DrawingWorldBuildingPlacedBlockGroundShadowCornerName,
  DrawingWorldBuildingPlacedBlockGroundShadowPoint
> {
  const corners = resolvingWorldBuildingPlacedBlockGroundShadowDiamondCorners(
    centerX,
    centerY,
  );

  return {
    north: scalingWorldBuildingPlacedBlockGroundShadowPointFromCenter(
      corners.north,
      centerX,
      centerY,
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE,
    ),
    east: scalingWorldBuildingPlacedBlockGroundShadowPointFromCenter(
      corners.east,
      centerX,
      centerY,
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE,
    ),
    south: scalingWorldBuildingPlacedBlockGroundShadowPointFromCenter(
      corners.south,
      centerX,
      centerY,
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE,
    ),
    west: scalingWorldBuildingPlacedBlockGroundShadowPointFromCenter(
      corners.west,
      centerX,
      centerY,
      DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE,
    ),
  };
}

/**
 * Draws the exact footprint diamond fill for one tile.
 *
 * @param graphics - Target graphics instance.
 * @param corners - Tile diamond corners.
 * @param fillAlpha - Per-fill opacity.
 */
function drawingWorldBuildingPlacedBlockGroundShadowFootprintOnGraphics(
  graphics: Graphics,
  corners: Record<
    DrawingWorldBuildingPlacedBlockGroundShadowCornerName,
    DrawingWorldBuildingPlacedBlockGroundShadowPoint
  >,
  fillAlpha: number,
): void {
  graphics
    .poly([
      corners.north.x,
      corners.north.y,
      corners.east.x,
      corners.east.y,
      corners.south.x,
      corners.south.y,
      corners.west.x,
      corners.west.y,
    ])
    .fill({
      color: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_FILL_COLOR,
      alpha: fillAlpha,
    });
}

/**
 * Draws one swept tongue quad from a trailing footprint edge.
 *
 * @param graphics - Target graphics instance.
 * @param start - Edge start corner.
 * @param end - Edge end corner.
 * @param offsetX - Projection offset X.
 * @param offsetY - Projection offset Y.
 * @param fillAlpha - Per-fill opacity.
 */
function drawingWorldBuildingPlacedBlockGroundShadowTongueOnGraphics(
  graphics: Graphics,
  start: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  end: DrawingWorldBuildingPlacedBlockGroundShadowPoint,
  offsetX: number,
  offsetY: number,
  fillAlpha: number,
): void {
  graphics
    .poly([
      start.x,
      start.y,
      end.x,
      end.y,
      end.x + offsetX,
      end.y + offsetY,
      start.x + offsetX,
      start.y + offsetY,
    ])
    .fill({
      color: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_FILL_COLOR,
      alpha: fillAlpha,
    });
}

/**
 * Draws the directional ground shadow for a set of shadow-casting tile columns.
 *
 * @param params - Target graphics, shadow tiles, and per-fill opacity.
 */
export function drawingWorldBuildingPlacedBlockDirectionalGroundShadowOnGraphics(
  params: DrawingWorldBuildingPlacedBlockDirectionalGroundShadowParams,
): void {
  const offsetXPx = params.offsetXPx ?? 0;
  const offsetYPx = params.offsetYPx ?? 0;
  const drawFootprint = params.drawFootprint ?? true;
  const drawTongues = params.drawTongues ?? true;
  const shadowTileKeys = new Set<string>();

  for (const shadowTile of params.shadowTiles) {
    shadowTileKeys.add(
      formattingWorldBuildingTilePositionKey(
        creatingWorldBuildingTilePosition(shadowTile.tileX, shadowTile.tileY),
      ),
    );
  }

  for (const shadowTile of params.shadowTiles) {
    const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
      x: shadowTile.tileX,
      y: shadowTile.tileY,
    });
    const corners = resolvingWorldBuildingPlacedBlockGroundShadowScaledDiamondCorners(
      center.x,
      center.y,
    );
    const offset = resolvingWorldBuildingPlacedBlockGroundShadowProjectionOffset(
      shadowTile.columnSpanLayers,
    );
    const scaledProjectionOffsetX =
      offset.offsetX * DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE;
    const scaledProjectionOffsetY =
      offset.offsetY * DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_SCALE;

    if (drawTongues) {
      for (const binding of DRAWING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_NEIGHBOR_EDGE_BINDINGS) {
        const neighborKey = formattingWorldBuildingTilePositionKey(
          creatingWorldBuildingTilePosition(
            shadowTile.tileX + binding.neighborTileXOffset,
            shadowTile.tileY + binding.neighborTileYOffset,
          ),
        );

        if (shadowTileKeys.has(neighborKey)) {
          continue;
        }

        const start = offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners[binding.edgeStartCorner],
          offsetXPx,
          offsetYPx,
        );
        const end = offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners[binding.edgeEndCorner],
          offsetXPx,
          offsetYPx,
        );
        const outwardNormal = resolvingWorldBuildingPlacedBlockGroundShadowEdgeOutwardNormal(
          start,
          end,
          center.x,
          center.y,
        );
        const facesShadowDirection =
          outwardNormal.x * scaledProjectionOffsetX +
            outwardNormal.y * scaledProjectionOffsetY >
          0;

        if (!facesShadowDirection) {
          continue;
        }

        drawingWorldBuildingPlacedBlockGroundShadowTongueOnGraphics(
          params.graphics,
          start,
          end,
          scaledProjectionOffsetX,
          scaledProjectionOffsetY,
          params.fillAlpha,
        );
      }
    }
  }

  if (drawFootprint) {
    for (const shadowTile of params.shadowTiles) {
      const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
        x: shadowTile.tileX,
        y: shadowTile.tileY,
      });
      const corners = resolvingWorldBuildingPlacedBlockGroundShadowScaledDiamondCorners(
        center.x,
        center.y,
      );
      const offsetCorners = {
        north: offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners.north,
          offsetXPx,
          offsetYPx,
        ),
        east: offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners.east,
          offsetXPx,
          offsetYPx,
        ),
        south: offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners.south,
          offsetXPx,
          offsetYPx,
        ),
        west: offsettingWorldBuildingPlacedBlockGroundShadowPoint(
          corners.west,
          offsetXPx,
          offsetYPx,
        ),
      };

      drawingWorldBuildingPlacedBlockGroundShadowFootprintOnGraphics(
        params.graphics,
        offsetCorners,
        params.fillAlpha,
      );
    }
  }
}
