import {
  DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_HEIGHT_SCALE,
  DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_X_SCALE,
  DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_Y_SCALE,
  DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_WIDTH_SCALE,
  DEFINING_WORLD_PLAZA_STONE_SHADOW_ALPHA,
  DEFINING_WORLD_PLAZA_STONE_SHADOW_COLOR,
  DEFINING_WORLD_PLAZA_STONE_SHADOW_HEIGHT_SCALE,
  DEFINING_WORLD_PLAZA_STONE_SHADOW_OFFSET_Y_SCALE,
  DEFINING_WORLD_PLAZA_STONE_SHADOW_WIDTH_SCALE,
} from "@/components/world/domains/definingWorldPlazaStoneDecorationConstants";
import type { DefiningWorldPlazaStoneDecoration } from "@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Stone draw call positioned at a resolved tile-center screen point.
 *
 * @module components/world/domains/drawingWorldPlazaStoneDecorationsOnGraphics
 */
export interface DrawingWorldPlazaStoneInstance {
  /** Tile-center screen X in pixels. */
  centerX: number;
  /** Tile-center screen Y in pixels. */
  centerY: number;
  /** Resolved stone descriptor for this tile. */
  decoration: DefiningWorldPlazaStoneDecoration;
}

/**
 * Draws stones (ground shadow, body, top highlight) in array order.
 *
 * Stones must be supplied in painter order (back to front) so nearer rocks
 * overlap farther ones correctly. Each stone is three stacked ellipses.
 *
 * @param graphics - Pixi graphics instance (caller clears before calling).
 * @param stones - Stones to draw, already in back-to-front order.
 */
export function drawingWorldPlazaStoneDecorationsOnGraphics(
  graphics: Graphics,
  stones: readonly DrawingWorldPlazaStoneInstance[],
): void {
  for (const stone of stones) {
    const { centerX, centerY, decoration } = stone;
    const stoneX = centerX + decoration.offsetX;
    const stoneY = centerY + decoration.offsetY;

    graphics
      .ellipse(
        stoneX,
        stoneY +
          decoration.bodyHalfHeightPx *
            DEFINING_WORLD_PLAZA_STONE_SHADOW_OFFSET_Y_SCALE,
        decoration.bodyHalfWidthPx * DEFINING_WORLD_PLAZA_STONE_SHADOW_WIDTH_SCALE,
        decoration.bodyHalfHeightPx *
          DEFINING_WORLD_PLAZA_STONE_SHADOW_HEIGHT_SCALE,
      )
      .fill({
        color: DEFINING_WORLD_PLAZA_STONE_SHADOW_COLOR,
        alpha: DEFINING_WORLD_PLAZA_STONE_SHADOW_ALPHA,
      });

    graphics
      .ellipse(
        stoneX,
        stoneY,
        decoration.bodyHalfWidthPx,
        decoration.bodyHalfHeightPx,
      )
      .fill({ color: decoration.bodyColor });

    graphics
      .ellipse(
        stoneX +
          decoration.bodyHalfWidthPx *
            DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_X_SCALE,
        stoneY +
          decoration.bodyHalfHeightPx *
            DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_OFFSET_Y_SCALE,
        decoration.bodyHalfWidthPx *
          DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_WIDTH_SCALE,
        decoration.bodyHalfHeightPx *
          DEFINING_WORLD_PLAZA_STONE_HIGHLIGHT_HEIGHT_SCALE,
      )
      .fill({ color: decoration.highlightColor });
  }
}
