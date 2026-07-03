import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Returns screen pixels above ground for one placement layer.
 *
 * @param worldLayer - One-based world layer index (L).
 */
export function computingWorldBuildingWorldLayerHeightPxAboveGround(
  worldLayer: number,
): number {
  const clampedLayer = clampingWorldBuildingWorldLayer(worldLayer);

  return (
    (clampedLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) *
    DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX
  );
}

/**
 * Formats build-mode placement layer (L) readout copy.
 *
 * @param worldLayer - One-based world layer index (L).
 */
export function formattingWorldBuildingWorldLayerSummary(
  worldLayer: number,
): string {
  const clampedLayer = clampingWorldBuildingWorldLayer(worldLayer);

  if (clampedLayer === DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return "Layer 1L · ground";
  }

  const heightPxAboveGround =
    computingWorldBuildingWorldLayerHeightPxAboveGround(clampedLayer);

  return `Layer ${clampedLayer}L · ${heightPxAboveGround}px up`;
}

/**
 * Returns the next lower placement layer, clamped to the supported range.
 *
 * @param worldLayer - Current one-based world layer index.
 */
export function decrementingWorldBuildingWorldLayer(
  worldLayer: number,
): number {
  return clampingWorldBuildingWorldLayer(worldLayer - 1);
}

/**
 * Returns the next higher placement layer, clamped to the supported range.
 *
 * @param worldLayer - Current one-based world layer index.
 */
export function incrementingWorldBuildingWorldLayer(
  worldLayer: number,
): number {
  return clampingWorldBuildingWorldLayer(worldLayer + 1);
}
