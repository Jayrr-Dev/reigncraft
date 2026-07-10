import {
  DEFINING_WORLD_PLAZA_ROCK_MINE_BASE_DURATION_MS,
  DEFINING_WORLD_PLAZA_ROCK_MINE_DURATION_PER_REMAINING_LAYER_MS,
} from '@/components/world/harvest/domains/definingWorldPlazaRockMineConstants';

/**
 * Computes mine swing duration from remaining rock layers and tool speed.
 *
 * Taller rocks (more remaining layers) take longer per swing.
 */
export function computingWorldPlazaRockMineDurationMs(
  remainingMineableLayers: number,
  harvestSpeedMultiplier = 1
): number {
  const resolvedMultiplier = Math.max(0.25, harvestSpeedMultiplier);
  const scaledDuration =
    DEFINING_WORLD_PLAZA_ROCK_MINE_BASE_DURATION_MS +
    remainingMineableLayers *
      DEFINING_WORLD_PLAZA_ROCK_MINE_DURATION_PER_REMAINING_LAYER_MS;

  return Math.round(scaledDuration / resolvedMultiplier);
}
