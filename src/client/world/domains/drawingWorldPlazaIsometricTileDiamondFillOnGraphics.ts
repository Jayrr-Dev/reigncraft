import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { Graphics } from 'pixi.js';

/**
 * Filled isometric tile diamond for debug overlays.
 *
 * @module components/world/domains/drawingWorldPlazaIsometricTileDiamondFillOnGraphics
 */

/**
 * Draws one filled isometric tile diamond at a grid coordinate.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param fillColor - Diamond fill color.
 * @param fillAlpha - Diamond fill opacity.
 * @param worldLayer - One-based world layer for vertical alignment.
 */
export function drawingWorldPlazaIsometricTileDiamondFillOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  fillColor: number,
  fillAlpha: number,
  worldLayer: number = DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const centerY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer);
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  graphics
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
    .fill({ color: fillColor, alpha: fillAlpha });
}
