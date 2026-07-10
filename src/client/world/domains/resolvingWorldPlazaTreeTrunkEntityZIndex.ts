import {
  DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS,
} from '@/components/world/depth/domains/definingWorldDepthBiasLadder';
import { resolvingWorldPlazaTerrainElevationColumnEntityZIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationColumnEntityZIndex';

/**
 * Entity-layer z-index for a tree trunk so it occludes avatars to the north.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeTrunkEntityZIndex
 */

/**
 * Depth sort key for a trunk at its grid foot tile.
 *
 * Sorts relative to the tile's terrain column key so trunks stay above their
 * own column after height-scaled terrain bias, matching avatar body sorting.
 *
 * @param tileX - Tree tile column index.
 * @param tileY - Tree tile row index.
 */
export function resolvingWorldPlazaTreeTrunkEntityZIndex(
  tileX: number,
  tileY: number,
): number {
  return (
    resolvingWorldPlazaTerrainElevationColumnEntityZIndex(tileX, tileY) +
    DEFINING_WORLD_DEPTH_TREE_TRUNK_TERRAIN_COLUMN_DEPTH_BIAS
  );
}
