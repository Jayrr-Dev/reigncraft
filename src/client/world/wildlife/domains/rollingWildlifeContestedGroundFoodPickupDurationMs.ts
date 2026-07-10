/**
 * Rolls contested ground-food pickup channel length (2–10s).
 *
 * @module components/world/wildlife/domains/rollingWildlifeContestedGroundFoodPickupDurationMs
 */

import {
  DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MAX_MS,
  DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS,
} from '@/components/world/wildlife/domains/definingWildlifeMealTheftConstants';

/** Uniform roll between contested pickup min and max (ms). */
export function rollingWildlifeContestedGroundFoodPickupDurationMs(): number {
  const span =
    DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MAX_MS -
    DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WILDLIFE_CONTESTED_GROUND_FOOD_PICKUP_DURATION_MIN_MS +
      Math.random() * span
  );
}
