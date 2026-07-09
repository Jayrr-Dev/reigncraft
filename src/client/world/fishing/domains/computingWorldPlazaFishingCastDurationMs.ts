/**
 * Computes fishing cast channel duration from equipped rod tier.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import {
  DEFINING_WORLD_PLAZA_FISHING_BASE_CAST_DURATION_MS,
  DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_MULTIPLIER_BY_TIER,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

/**
 * Returns cast channel duration in milliseconds for one rod tier.
 */
export function computingWorldPlazaFishingCastDurationMs(
  tier: DefiningWorldPlazaHeldItemTier,
  harvestSpeedMultiplier = 1
): number {
  const tierMultiplier =
    DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_MULTIPLIER_BY_TIER[tier];
  const resolvedSpeed = Math.max(0.25, harvestSpeedMultiplier);

  return Math.round(
    (DEFINING_WORLD_PLAZA_FISHING_BASE_CAST_DURATION_MS * tierMultiplier) /
      resolvedSpeed
  );
}
