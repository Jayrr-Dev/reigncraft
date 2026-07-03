import { drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics } from "@/components/world/domains/drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics";
import { DEFINING_WORLD_PLAZA_INVENTORY_DROP_TILE_OUTLINE_STROKE_COLOR } from "@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws a dashed black diamond outline around the selected inventory drop tile.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Target tile column.
 * @param tileY - Target tile row.
 */
export function drawingWorldPlazaInventoryDropTileOutlineOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
): void {
  drawingWorldPlazaDashedIsometricTileDiamondStrokeOnGraphics(
    graphics,
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_INVENTORY_DROP_TILE_OUTLINE_STROKE_COLOR,
  );
}
