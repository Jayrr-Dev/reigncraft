import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import type { DefiningWorldPlazaFallState } from "@/components/world/domains/definingWorldPlazaFallState";
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_LAYER_DELTA } from "@/components/world/domains/definingWorldPlazaGirlSampleFallConstants";
import type { DefiningWorldPlazaGirlSampleWalkDirection } from "@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants";

/**
 * Builds fall state when layer sync drops the player to a lower surface.
 *
 * @param layerBeforeSync - Standing layer before sync ran this frame.
 * @param layerAfterSync - Standing layer after sync applied the drop.
 * @param startedAtMs - Fall start timestamp from {@link performance.now}.
 * @param direction - Facing direction to reuse for the fall strip.
 */
export function attemptingWorldPlazaPlayerFallFromLayerDrop(
  layerBeforeSync: number,
  layerAfterSync: number,
  startedAtMs: number,
  direction: DefiningWorldPlazaGirlSampleWalkDirection,
): DefiningWorldPlazaFallState | null {
  if (layerAfterSync >= layerBeforeSync) {
    return null;
  }

  const layerDelta = layerBeforeSync - layerAfterSync;

  if (layerDelta < DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_LAYER_DELTA) {
    return null;
  }

  return {
    startLayer: layerBeforeSync,
    targetLayer: layerAfterSync,
    layerDelta,
    startedAtMs,
    direction,
    totalDropScreenPx: layerDelta * DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX,
  };
}
