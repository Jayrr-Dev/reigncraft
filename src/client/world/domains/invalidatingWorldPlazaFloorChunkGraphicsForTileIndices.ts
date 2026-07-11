import { formattingWorldPlazaTileChunkCacheKey } from '@/components/world/domains/formattingWorldPlazaTileChunkCacheKey';
import type { InvalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBoundsInput } from '@/components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBounds';
import type { SyncingWorldPlazaVisibleTileChunkPendingBuild } from '@/components/world/domains/syncingWorldPlazaVisibleTileChunkGraphicsLayer';

/**
 * Drops cached floor chunks that overlap explicit tile indices.
 *
 * @module components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForTileIndices
 */

/** One tile index in grid space. */
export interface InvalidatingWorldPlazaFloorChunkGraphicsTileIndex {
  readonly tileX: number;
  readonly tileY: number;
}

/** Input for {@link invalidatingWorldPlazaFloorChunkGraphicsForTileIndices}. */
export interface InvalidatingWorldPlazaFloorChunkGraphicsForTileIndicesInput extends InvalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBoundsInput {
  readonly tileIndices: readonly InvalidatingWorldPlazaFloorChunkGraphicsTileIndex[];
  /** Optional in-progress chunk bakes to drop alongside finished chunks. */
  readonly pendingChunkBuilds?: Map<
    string,
    SyncingWorldPlazaVisibleTileChunkPendingBuild
  >;
}

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
 * Removes floor chunk graphics overlapping the given tile indices.
 *
 * @param input - Floor layer, chunk size, cache, and tile indices to invalidate.
 * @returns Number of floor chunks removed.
 */
export function invalidatingWorldPlazaFloorChunkGraphicsForTileIndices(
  input: InvalidatingWorldPlazaFloorChunkGraphicsForTileIndicesInput
): number {
  const chunkKeysToDrop = new Set<string>();

  for (const tileIndex of input.tileIndices) {
    chunkKeysToDrop.add(
      formattingWorldPlazaTileChunkCacheKey(
        resolvingWorldPlazaFloorChunkOriginTileIndex(
          tileIndex.tileX,
          input.chunkSizeTiles
        ),
        resolvingWorldPlazaFloorChunkOriginTileIndex(
          tileIndex.tileY,
          input.chunkSizeTiles
        )
      )
    );
  }

  let droppedChunkCount = 0;

  for (const cacheKey of chunkKeysToDrop) {
    const chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

    if (chunkGraphics) {
      input.parentContainer.removeChild(chunkGraphics);
      chunkGraphics.destroy();
      input.chunkGraphicsByKey.delete(cacheKey);
      droppedChunkCount += 1;
    }

    const pendingBuild = input.pendingChunkBuilds?.get(cacheKey);

    if (pendingBuild) {
      input.parentContainer.removeChild(pendingBuild.graphics);
      pendingBuild.graphics.destroy();
      input.pendingChunkBuilds?.delete(cacheKey);
      droppedChunkCount += 1;
    }
  }

  return droppedChunkCount;
}
