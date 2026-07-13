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
 * Extruded blocks extend downward from the anchor layer (L). Bottom is
 * `L - H + 1`, so a height-H preset defaults to `L = H` to rest flush on
 * ground (slab 1, half 2, full 4). Passable tiles (0H) default to ground.
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

  return clampingWorldBuildingWorldLayer(clampedBlockHeight);
}
