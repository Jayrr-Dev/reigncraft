import {
  DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS,
} from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { computingWorldDepthSortKey } from '@/components/world/depth/domains/computingWorldDepthSortKey';

/**
 * Entity-layer z-index for a tree trunk so it occludes avatars to the north.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex
 */

/**
 * Depth sort key for a trunk at its grid foot tile.
 *
 * Uses the ground grid projection (not the elevated paint Y) so trunks stay
 * above terrain columns on the same tile, matching avatar body sorting.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 */
export function resolvingWorldPlazaTreeTrunkEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  return (
    computingWorldDepthSortKey({
      x: tileX,
      y: tileY,
    }) + DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS
  );
}
