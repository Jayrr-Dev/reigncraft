import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws one filled isometric tile diamond at a grid coordinate.
 *
 * @param graphics - Pixi graphics instance (caller manages clear/fill batching).
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param fillColor - Diamond fill color.
 */
export function drawingWorldPlazaIsometricTileDiamondOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  fillColor: number,
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  graphics
    .poly([
      center.x,
      center.y - halfHeight,
      center.x + halfWidth,
      center.y,
      center.x,
      center.y + halfHeight,
      center.x - halfWidth,
      center.y,
    ])
    .fill({ color: fillColor });
}
