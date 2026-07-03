import {
  clampingWorldBuildingBlockHeight,
  DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE,
} from "@/components/world/building/domains/definingWorldBuildingBlockHeightConstants";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Formats build-mode block height (H) readout copy.
 *
 * @param blockHeightLayers - Block extrusion height in layers.
 * @param topWorldLayer - Optional top anchor used to clamp display height.
 */
export function formattingWorldBuildingBlockHeightSummary(
  blockHeightLayers: number,
  topWorldLayer?: number,
): string {
  const clampedHeight = clampingWorldBuildingBlockHeight(
    blockHeightLayers,
    topWorldLayer,
  );

  if (clampedHeight === DEFINING_WORLD_BUILDING_BLOCK_HEIGHT_TILE) {
    return "Tile · passable";
  }

  const extrusionPx = clampedHeight * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX;

  return `${clampedHeight}H · ${extrusionPx}px down`;
}

/**
 * Returns the next lower block height, clamped to the supported range.
 *
 * @param blockHeightLayers - Current block height in layers.
 * @param topWorldLayer - Optional top anchor used to cap height above ground.
 */
export function decrementingWorldBuildingBlockHeight(
  blockHeightLayers: number,
  topWorldLayer?: number,
): number {
  return clampingWorldBuildingBlockHeight(
    blockHeightLayers - 1,
    topWorldLayer,
  );
}

/**
 * Returns the next higher block height, clamped to the supported range.
 *
 * @param blockHeightLayers - Current block height in layers.
 * @param topWorldLayer - Optional top anchor used to cap height above ground.
 */
export function incrementingWorldBuildingBlockHeight(
  blockHeightLayers: number,
  topWorldLayer?: number,
): number {
  return clampingWorldBuildingBlockHeight(
    blockHeightLayers + 1,
    topWorldLayer,
  );
}
