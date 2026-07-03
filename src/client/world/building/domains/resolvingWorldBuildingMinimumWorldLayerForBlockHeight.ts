import {
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Resolves the default placement layer when a build-mode block preset is selected.
 *
 * Extruded blocks extend downward from the anchor layer (L). A height-H preset
 * defaults to L = H + 1 so the column sits one layer above ground (slab 2,
 * half 3, block 5). Passable tiles (0H) default to ground.
 *
 * @module components/world/building/domains/resolvingWorldBuildingMinimumWorldLayerForBlockHeight
 */

/**
 * Returns the default top anchor layer for the requested block height preset.
 *
 * @param blockHeight - Target extrusion height (H).
 */
export function resolvingWorldBuildingMinimumWorldLayerForBlockHeight(
  blockHeight: number,
): number {
  const clampedBlockHeight = clampingWorldBuildingBlockHeight(blockHeight);

  if (clampedBlockHeight === DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE) {
    return DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN;
  }

  return clampingWorldBuildingWorldLayer(clampedBlockHeight + 1);
}
