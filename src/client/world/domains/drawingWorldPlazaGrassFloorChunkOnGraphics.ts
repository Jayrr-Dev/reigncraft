import {
  drawingWorldPlazaGrassFloorTileOnGraphics,
  type DrawingWorldPlazaGrassFloorTileDrawOptions,
} from "@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Draws one batched floor chunk into a single graphics object.
 *
 * @module components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics
 */

/** Input for {@link drawingWorldPlazaGrassFloorChunkOnGraphics}. */
export interface DrawingWorldPlazaGrassFloorChunkOnGraphicsInput {
  readonly graphics: Graphics;
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
  readonly chunkSizeTiles: number;
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
}

/**
 * Draws every tile in a chunk's fixed region.
 *
 * A chunk covers a stable world region, so it always renders its full tile
 * grid. Clipping to a transient visible window would bake gaps into the cached
 * graphics and surface them as seams once the viewport shifts.
 *
 * @param input - Chunk origin, size, and decoration toggles.
 */
export function drawingWorldPlazaGrassFloorChunkOnGraphics(
  input: DrawingWorldPlazaGrassFloorChunkOnGraphicsInput,
): void {
  const chunkSizeTiles = Math.max(1, Math.floor(input.chunkSizeTiles));

  for (let tileOffsetY = 0; tileOffsetY < chunkSizeTiles; tileOffsetY += 1) {
    for (let tileOffsetX = 0; tileOffsetX < chunkSizeTiles; tileOffsetX += 1) {
      drawingWorldPlazaGrassFloorTileOnGraphics(
        input.graphics,
        input.chunkOriginTileX + tileOffsetX,
        input.chunkOriginTileY + tileOffsetY,
        input.drawOptions,
      );
    }
  }
}
