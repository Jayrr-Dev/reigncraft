import { formattingWorldPlazaTileIndexCacheKey } from "@/components/world/domains/formattingWorldPlazaTileIndexCacheKey";
import type { DefiningWorldPlazaTreeInstance } from "@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex";

/**
 * Cache keys for incremental tree trunk/canopy/shadow graphics sync.
 *
 * @module components/world/domains/formattingWorldPlazaTreeDrawCacheKey
 */

/**
 * Returns a stable cache key for one tree draw entry.
 *
 * Placed trees use their block id so replacing a procedural tree on the same
 * tile invalidates the old graphics without waiting for a bounds crossing.
 *
 * @param tree - Tree instance to cache.
 */
export function formattingWorldPlazaTreeDrawCacheKey(
  tree: DefiningWorldPlazaTreeInstance,
): string {
  if (tree.placedBlockId) {
    return `placed-tree:${tree.placedBlockId}`;
  }

  return formattingWorldPlazaTileIndexCacheKey(tree.tileX, tree.tileY);
}
