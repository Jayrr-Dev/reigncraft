import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_DURATION_MS_PER_LAYER,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_DURATION_MS,
} from "@/components/world/domains/definingWorldPlazaGirlSampleFallConstants";

/**
 * Returns fall duration scaled by how many layers the player drops.
 *
 * @param layerDelta - Layers descended (start layer minus target layer).
 */
export function computingWorldPlazaGirlSampleFallDurationMs(
  layerDelta: number,
): number {
  return Math.max(
    DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_MIN_DURATION_MS,
    layerDelta * DEFINING_WORLD_PLAZA_GIRL_SAMPLE_FALL_DURATION_MS_PER_LAYER,
  );
}
