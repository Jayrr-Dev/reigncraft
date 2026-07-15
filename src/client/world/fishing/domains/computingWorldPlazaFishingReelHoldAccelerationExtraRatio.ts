/**
 * Eased extra cast-speed ratio while holding reel (accelerate, then slow).
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingReelHoldAccelerationExtraRatio
 */

import { computingWorldPlazaEaseBumpProgress } from '@/components/world/domains/computingWorldPlazaEasing';
import {
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MAX,
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN,
  DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS,
} from '@/components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants';

/**
 * Returns extra elapsed-cast multiplier for this hold age.
 * Cycles: soft start → peak mid pull → soft finish, then repeats.
 */
export function computingWorldPlazaFishingReelHoldAccelerationExtraRatio(
  holdElapsedMs: number
): number {
  if (holdElapsedMs <= 0) {
    return DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN;
  }

  const cycleMs = DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_SPEED_CYCLE_MS;

  if (cycleMs <= 0) {
    return DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN;
  }

  const cycleProgress = (holdElapsedMs % cycleMs) / cycleMs;
  const bump = computingWorldPlazaEaseBumpProgress(cycleProgress);
  const span =
    DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MAX -
    DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN;

  return (
    DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO_MIN +
    span * bump
  );
}
