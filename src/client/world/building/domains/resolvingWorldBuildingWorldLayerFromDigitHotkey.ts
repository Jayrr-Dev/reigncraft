import {
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";

/**
 * Maps build mode digit hotkeys to world layers.
 *
 * @module components/world/building/domains/resolvingWorldBuildingWorldLayerFromDigitHotkey
 */

/**
 * Returns the world layer for a digit key press, if it is a supported build layer.
 *
 * @param key - Keyboard event key value.
 */
export function resolvingWorldBuildingWorldLayerFromDigitHotkey(
  key: string,
): number | null {
  if (!/^[1-9]$/.test(key)) {
    return null;
  }

  const worldLayer = Number.parseInt(key, 10);

  if (
    worldLayer < DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN ||
    worldLayer > DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX
  ) {
    return null;
  }

  return worldLayer;
}
