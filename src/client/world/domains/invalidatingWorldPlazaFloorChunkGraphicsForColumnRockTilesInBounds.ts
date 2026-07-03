import { checkingWorldPlazaTileHasColumnRockAtTileIndex } from "@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex";
import { formattingWorldPlazaTileChunkCacheKey } from "@/components/world/domains/formattingWorldPlazaTileChunkCacheKey";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import type { Container, Graphics } from "pixi.js";

/**
 * Drops cached floor chunks overlapping mega-boulder footprints so they rebuild
 * with biome floor tiles under the rock.
 *
 * @module components/world/domains/invalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBounds
 */

/** Input for {@link invalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBounds}. */
export interface InvalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBoundsInput {
  readonly parentContainer: Container;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly chunkSizeTiles: number;
  readonly chunkGraphicsByKey: Map<string, Graphics>;
}

/**
 * Returns the chunk origin tile index aligned to the chunk grid.
 *
 * @param tileIndex - Tile column or row index.
 * @param chunkSizeTiles - Chunk width and height in tiles.
 */
function resolvingWorldPlazaFloorChunkOriginTileIndex(
  tileIndex: number,
  chunkSizeTiles: number,
): number {
  const chunkSize = Math.max(1, Math.floor(chunkSizeTiles));

  return Math.floor(tileIndex / chunkSize) * chunkSize;
}

/**
 * Removes floor chunk graphics that overlap a column-rock footprint so they
 * rebuild with the correct biome diamonds under the boulder.
 *
 * @param input - Floor layer, bounds, chunk size, and chunk cache.
 */
export function invalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBounds(
  input: InvalidatingWorldPlazaFloorChunkGraphicsForColumnRockTilesInBoundsInput,
): void {
  const chunkKeysToDrop = new Set<string>();

  for (let tileY = input.bounds.minTileY; tileY <= input.bounds.maxTileY; tileY += 1) {
    for (let tileX = input.bounds.minTileX; tileX <= input.bounds.maxTileX; tileX += 1) {
      if (!checkingWorldPlazaTileHasColumnRockAtTileIndex(tileX, tileY)) {
        continue;
      }

      chunkKeysToDrop.add(
        formattingWorldPlazaTileChunkCacheKey(
          resolvingWorldPlazaFloorChunkOriginTileIndex(
            tileX,
            input.chunkSizeTiles,
          ),
          resolvingWorldPlazaFloorChunkOriginTileIndex(
            tileY,
            input.chunkSizeTiles,
          ),
        ),
      );
    }
  }

  for (const cacheKey of chunkKeysToDrop) {
    const chunkGraphics = input.chunkGraphicsByKey.get(cacheKey);

    if (!chunkGraphics) {
      continue;
    }

    input.parentContainer.removeChild(chunkGraphics);
    chunkGraphics.destroy();
    input.chunkGraphicsByKey.delete(cacheKey);
  }
}
