import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

/**
 * Computes chop swing duration from remaining tree layers and tool speed.
 *
 * Taller trees (more remaining layers) take longer per swing.
 */
export function computingWorldPlazaTreeChopDurationMs(
  remainingChoppableLayers: number,
  harvestSpeedMultiplier = 1
): number {
  const resolvedMultiplier = Math.max(0.25, harvestSpeedMultiplier);
  const scaledDuration =
    DEFINING_WORLD_PLAZA_TREE_CHOP_BASE_DURATION_MS +
    remainingChoppableLayers *
      DEFINING_WORLD_PLAZA_TREE_CHOP_DURATION_PER_REMAINING_LAYER_MS;

  return Math.round(scaledDuration / resolvedMultiplier);
}
