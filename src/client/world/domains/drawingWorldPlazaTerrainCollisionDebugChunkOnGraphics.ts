import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import { drawingWorldPlazaVisibleTerrainCollisionDebugStaticTileRowsOnGraphics } from '@/components/world/domains/drawingWorldPlazaVisibleTerrainCollisionDebugOnGraphics';
import type { Graphics } from 'pixi.js';

/**
 * Draws the static collision colliders for one cached debug chunk.
 *
 * A chunk owns an aligned `chunkSizeTiles` square of the world. Its geometry is
 * emitted once into a dedicated Graphics that the sync layer caches and marks
 * cullable, so scrolling reuses the chunk instead of redrawing the window.
 *
 * Column-rock circles are deduped per chunk; a boulder whose footprint spans a
 * chunk seam draws its full circle in each touched chunk, which overlaps
 * exactly and keeps the collider visible even when the anchor chunk is culled.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainCollisionDebugChunkOnGraphics
 */

/**
 * Emits collider outlines for every tile in the chunk square.
 *
 * @param graphics - Target Pixi Graphics instance for this chunk.
 * @param chunkOriginTileX - Chunk minimum tile column (grid aligned).
 * @param chunkOriginTileY - Chunk minimum tile row (grid aligned).
 * @param chunkSizeTiles - Width and height of the chunk in tiles.
 */
export function drawingWorldPlazaTerrainCollisionDebugChunkOnGraphics(
  graphics: Graphics,
  chunkOriginTileX: number,
  chunkOriginTileY: number,
  chunkSizeTiles: number
): void {
  const chunkSize = Math.max(1, Math.floor(chunkSizeTiles));
  const chunkBounds: DefiningWorldPlazaVisibleTileBounds = {
    minTileX: chunkOriginTileX,
    maxTileX: chunkOriginTileX + chunkSize - 1,
    minTileY: chunkOriginTileY,
    maxTileY: chunkOriginTileY + chunkSize - 1,
  };

  drawingWorldPlazaVisibleTerrainCollisionDebugStaticTileRowsOnGraphics(
    graphics,
    chunkBounds,
    chunkBounds.minTileY,
    chunkBounds.maxTileY,
    new Set<string>(),
    new Set<string>()
  );
}
