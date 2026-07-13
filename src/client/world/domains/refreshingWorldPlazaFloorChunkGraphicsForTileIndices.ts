import { drawingWorldPlazaGrassFloorChunkOnGraphics } from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import { resolvingWorldPlazaGrassFloorChunkGraphicsZIndex } from '@/components/world/domains/listingWorldPlazaTileChunkOriginsInBounds';
import { markingWorldPlazaPixiDisplayObjectCullable } from '@/components/world/domains/markingWorldPlazaPixiDisplayObjectCullable';
import type { SyncingWorldPlazaVisibleTileChunkPendingBuild } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
import type { Container } from 'pixi.js';
import { Graphics } from 'pixi.js';

/**
 * In-place floor chunk refresh so pebble picks do not flash empty terrain.
 *
 * @module components/world/domains/refreshingWorldPlazaFloorChunkGraphicsForTileIndices
 */

/** Input for {@link refreshingWorldPlazaFloorChunkGraphicsForTileIndices}. */
export type RefreshingWorldPlazaFloorChunkGraphicsForTileIndicesInput = {
  readonly parentContainer: Container;
  readonly chunkSizeTiles: number;
  readonly chunkGraphicsByKey: Map<string, Graphics>;
  readonly pendingChunkBuilds?: Map<
    string,
    SyncingWorldPlazaVisibleTileChunkPendingBuild
  >;
  readonly tileIndices: readonly InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[];
  readonly drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions;
};

/**
 * Returns the chunk origin tile index aligned to the chunk grid.
 *
 * @param tileIndex - Tile column or row index.
 * @param chunkSizeTiles - Chunk width and height in tiles.
 */
function resolvingWorldPlazaFloorChunkOriginTileIndex(
  tileIndex: number,
  chunkSizeTiles: number
): number {
  const chunkSize = Math.max(1, Math.floor(chunkSizeTiles));

  return Math.floor(tileIndex / chunkSize) * chunkSize;
}

/**
 * Resolves a drawable floor chunk Graphics for refresh, promoting any pending
 * bake so pebble picks never leave a hole while the async sync rebuilds.
 *
 * @param input - Floor cache maps and parent container.
 * @param cacheKey - Chunk cache key.
 * @param chunkOriginTileX - Chunk origin column.
 * @param chunkOriginTileY - Chunk origin row.
 */
function resolvingWorldPlazaFloorChunkGraphicsForRefresh(
  input: RefreshingWorldPlazaFloorChunkGraphicsForTileIndicesInput,
  cacheKey: string,
  chunkOriginTileX: number,
  chunkOriginTileY: number
): Graphics {
  const pendingBuild = input.pendingChunkBuilds?.get(cacheKey);
  let chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

  if (pendingBuild) {
    if (!chunkGraphics) {
      // Promote the in-progress bake instead of destroying it. Destroy + skip
      // left empty chunks (and wiped procedural flowers) until sync rebuilt.
      chunkGraphics = pendingBuild.graphics;
      input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);
    } else {
      input.parentContainer.removeChild(pendingBuild.graphics);
      pendingBuild.graphics.destroy();
    }

    input.pendingChunkBuilds?.delete(cacheKey);
  }

  if (chunkGraphics) {
    return chunkGraphics;
  }

  chunkGraphics = new Graphics();
  chunkGraphics.eventMode = 'none';
  markingWorldPlazaPixiDisplayObjectCullable(chunkGraphics);
  chunkGraphics.zIndex = resolvingWorldPlazaGrassFloorChunkGraphicsZIndex(
    chunkOriginTileX,
    chunkOriginTileY
  );
  input.parentContainer.addChild(chunkGraphics);
  input.chunkGraphicsByKey.set(cacheKey, chunkGraphics);

  return chunkGraphics;
}

/**
 * Clears and redraws floor chunks for the given tiles without hiding them.
 * Pending partial builds are promoted into the finished cache and redrawn.
 *
 * @param input - Floor cache, tiles to refresh, and current draw options.
 * @returns Number of floor chunks redrawn in place.
 */
export function refreshingWorldPlazaFloorChunkGraphicsForTileIndices(
  input: RefreshingWorldPlazaFloorChunkGraphicsForTileIndicesInput
): number {
  const chunkOriginsByKey = new Map<
    string,
    { readonly chunkOriginTileX: number; readonly chunkOriginTileY: number }
  >();

  for (const tileIndex of input.tileIndices) {
    const chunkOriginTileX = resolvingWorldPlazaFloorChunkOriginTileIndex(
      tileIndex.tileX,
      input.chunkSizeTiles
    );
    const chunkOriginTileY = resolvingWorldPlazaFloorChunkOriginTileIndex(
      tileIndex.tileY,
      input.chunkSizeTiles
    );
    const cacheKey = formattingWorldPlazaTileChunkCacheKey(
      chunkOriginTileX,
      chunkOriginTileY
    );

    chunkOriginsByKey.set(cacheKey, { chunkOriginTileX, chunkOriginTileY });
  }

  let refreshedChunkCount = 0;

  for (const [cacheKey, chunkOrigin] of chunkOriginsByKey) {
    const chunkGraphics = resolvingWorldPlazaFloorChunkGraphicsForRefresh(
      input,
      cacheKey,
      chunkOrigin.chunkOriginTileX,
      chunkOrigin.chunkOriginTileY
    );

    chunkGraphics.clear();
    drawingWorldPlazaGrassFloorChunkOnGraphics({
      graphics: chunkGraphics,
      chunkOriginTileX: chunkOrigin.chunkOriginTileX,
      chunkOriginTileY: chunkOrigin.chunkOriginTileY,
      chunkSizeTiles: input.chunkSizeTiles,
      drawOptions: input.drawOptions,
    });
    chunkGraphics.visible = true;
    refreshedChunkCount += 1;
  }

  return refreshedChunkCount;
}
