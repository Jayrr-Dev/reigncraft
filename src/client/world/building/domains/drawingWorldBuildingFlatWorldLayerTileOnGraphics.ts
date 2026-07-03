import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import type { DrawingWorldBuildingIsometricTileColumnTopCapOutlineMode } from "@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Flat isometric tile drawing for foundation layers without 3D extrusion.
 *
 * @module components/world/building/domains/drawingWorldBuildingFlatWorldLayerTileOnGraphics
 */

/** Default flat tile outline width in pixels. */
const DRAWING_WORLD_BUILDING_FLAT_WORLD_LAYER_TILE_STROKE_WIDTH_PX = 1.25;

/** Input for {@link drawingWorldBuildingFlatWorldLayerTileOnGraphics}. */
export interface DrawingWorldBuildingFlatWorldLayerTileOnGraphicsInput {
  readonly graphics: Graphics;
  readonly tileX: number;
  readonly tileY: number;
  readonly worldLayer: number;
  readonly fillColor: number;
  readonly strokeColor: number;
  readonly fillAlpha: number;
  readonly strokeAlpha: number;
  readonly strokeWidthPx?: number;
  readonly topCapOutlineMode?: DrawingWorldBuildingIsometricTileColumnTopCapOutlineMode;
}

/**
 * Draws one flat isometric tile diamond at a world layer without side extrusion.
 *
 * @param input - Tile indices, layer, and colors.
 */
export function drawingWorldBuildingFlatWorldLayerTileOnGraphics(
  input: DrawingWorldBuildingFlatWorldLayerTileOnGraphicsInput,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: input.tileX,
    y: input.tileY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(input.worldLayer);
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  input.graphics
    .poly([
      center.x,
      centerY - halfHeight,
      center.x + halfWidth,
      centerY,
      center.x,
      centerY + halfHeight,
      center.x - halfWidth,
      centerY,
    ])
    .fill({ color: input.fillColor, alpha: input.fillAlpha });

  if ((input.topCapOutlineMode ?? "fullDiamond") === "fullDiamond") {
    input.graphics.stroke({
      color: input.strokeColor,
      width:
        input.strokeWidthPx ??
        DRAWING_WORLD_BUILDING_FLAT_WORLD_LAYER_TILE_STROKE_WIDTH_PX,
      alpha: input.strokeAlpha,
    });
  }
}
