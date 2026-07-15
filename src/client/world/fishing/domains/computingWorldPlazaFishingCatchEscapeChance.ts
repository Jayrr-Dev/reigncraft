/**
 * Resolves creature catch escape chance from equipped rod tier and harvest speed.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingCatchEscapeChance
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import {
  DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_BY_TIER,
  DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MAX,
  DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MIN,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';

/**
 * Returns the probability `[0, 1]` that a hooked creature escapes at cast end.
 */
export function computingWorldPlazaFishingCatchEscapeChance(
  tier: DefiningWorldPlazaHeldItemTier,
  harvestSpeedMultiplier = 1,
  reelEscapeReduction = 0
): number {
  const baseChance =
    DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_BY_TIER[tier];
  const resolvedSpeed = Math.max(1, harvestSpeedMultiplier);
  const adjustedChance =
    baseChance / resolvedSpeed - Math.max(0, reelEscapeReduction);

  return Math.min(
    DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MAX,
    Math.max(
      DEFINING_WORLD_PLAZA_FISHING_CATCH_ESCAPE_CHANCE_MIN,
      adjustedChance
    )
  );
}

/**
 * Rolls whether a hooked creature escapes before landing.
 */
export function rollingWorldPlazaFishingCatchEscaped(
  escapeChance: number,
  randomUnit: number = Math.random()
): boolean {
  if (escapeChance <= 0) {
    return false;
  }

  if (escapeChance >= 1) {
    return true;
  }

  return randomUnit < escapeChance;
}
