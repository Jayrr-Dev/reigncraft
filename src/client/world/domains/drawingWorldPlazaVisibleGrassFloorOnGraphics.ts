import {
  drawingWorldPlazaGrassFloorTileOnGraphics,
  resolvingWorldPlazaGrassFloorTileGraphicsZIndex,
} from "@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics";
import { listingWorldPlazaTileIndicesInBounds } from "@/components/world/domains/listingWorldPlazaTileIndicesInBounds";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import type { Graphics } from "pixi.js";

/**
 * Draws all visible biome tiles with batched fills and sparse decoration dots.
 *
 * @param graphics - Pixi graphics instance (caller clears before calling).
 * @param bounds - Visible tile index range.
 */
export function drawingWorldPlazaVisibleGrassFloorOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
): void {
  for (const { tileX, tileY } of listingWorldPlazaTileIndicesInBounds(bounds)) {
    drawingWorldPlazaGrassFloorTileOnGraphics(graphics, tileX, tileY);
  }
}

/** Re-export for callers that set per-tile z-index on cached layers. */
export { resolvingWorldPlazaGrassFloorTileGraphicsZIndex };
