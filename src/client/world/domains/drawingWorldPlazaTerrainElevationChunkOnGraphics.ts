import {
  drawingWorldPlazaTerrainElevationColumnOnGraphics,
  type DrawingWorldPlazaTerrainElevationColumnDrawOptions,
} from "@/components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics";
import { checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex";
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Batches procedural elevation columns into one floor chunk graphics object.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainElevationChunkOnGraphics
 */

/** Input for {@link drawingWorldPlazaTerrainElevationChunkOnGraphics}. */
export interface DrawingWorldPlazaTerrainElevationChunkOnGraphicsInput {
  readonly graphics: Graphics;
  readonly chunkOriginTileX: number;
  readonly chunkOriginTileY: number;
  readonly chunkSizeTiles: number;
  readonly drawOptions?: DrawingWorldPlazaTerrainElevationColumnDrawOptions;
}

/**
 * Draws every raised tile in a fixed chunk region onto one Graphics instance.
 *
 * @param input - Chunk origin, size, and decoration toggles.
 * @returns Number of raised columns drawn (0 when the chunk is flat).
 */
export function drawingWorldPlazaTerrainElevationChunkOnGraphics(
  input: DrawingWorldPlazaTerrainElevationChunkOnGraphicsInput,
): number {
  const chunkSizeTiles = Math.max(1, Math.floor(input.chunkSizeTiles));
  let raisedColumnCount = 0;

  for (let tileOffsetY = 0; tileOffsetY < chunkSizeTiles; tileOffsetY += 1) {
    for (let tileOffsetX = 0; tileOffsetX < chunkSizeTiles; tileOffsetX += 1) {
      const tileX = input.chunkOriginTileX + tileOffsetX;
      const tileY = input.chunkOriginTileY + tileOffsetY;

      if (!checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY)) {
        continue;
      }

      if (checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex(tileX, tileY)) {
        continue;
      }

      drawingWorldPlazaTerrainElevationColumnOnGraphics(
        input.graphics,
        tileX,
        tileY,
        input.drawOptions,
      );
      raisedColumnCount += 1;
    }
  }

  return raisedColumnCount;
}
