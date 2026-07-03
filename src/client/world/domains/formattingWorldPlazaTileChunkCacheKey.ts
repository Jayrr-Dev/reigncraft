/**
 * Stable cache keys for batched floor tile chunks.
 *
 * @module components/world/domains/formattingWorldPlazaTileChunkCacheKey
 */

/**
 * Builds a map key for one floor chunk origin.
 *
 * @param chunkOriginTileX - Chunk minimum tile column (aligned to chunk size).
 * @param chunkOriginTileY - Chunk minimum tile row (aligned to chunk size).
 */
export function formattingWorldPlazaTileChunkCacheKey(
  chunkOriginTileX: number,
  chunkOriginTileY: number,
): string {
  return `${chunkOriginTileX}:${chunkOriginTileY}`;
}
