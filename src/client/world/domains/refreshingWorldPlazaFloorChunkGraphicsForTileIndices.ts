import { drawingWorldPlazaGrassFloorChunkOnGraphics } from '@/components/world/domains/drawingWorldPlazaGrassFloorChunkOnGraphics';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import type { InvalidatingWorldPlazaFloorChunkGraphicsTileIndex } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices';
import type { SyncingWorldPlazaVisibleTileChunkPendingBuild } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';
import type { Container, Graphics } from 'pixi.js';

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
 * Clears and redraws existing floor chunks for the given tiles without hiding
 * them. Pending partial builds for those chunks are discarded first.
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
    const pendingBuild = input.pendingChunkBuilds?.get(cacheKey);

    if (pendingBuild) {
      input.parentContainer.removeChild(pendingBuild.graphics);
      pendingBuild.graphics.destroy();
      input.pendingChunkBuilds?.delete(cacheKey);
    }

    const chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

    if (!chunkGraphics) {
      continue;
    }

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
