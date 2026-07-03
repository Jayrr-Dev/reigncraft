import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
  clampingWorldBuildingWorldLayer,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Converts world layers into screen-space vertical offsets.
 *
 * @module components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx
 */

/**
 * Returns the upward screen offset for a world layer above ground.
 *
 * @param worldLayer - One-based layer index.
 */
export function computingWorldBuildingWorldLayerScreenOffsetPx(
  worldLayer: number,
): number {
  const clampedLayer = clampingWorldBuildingWorldLayer(worldLayer);

  return (
    (clampedLayer - DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) *
    DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX *
    -1
  );
}
