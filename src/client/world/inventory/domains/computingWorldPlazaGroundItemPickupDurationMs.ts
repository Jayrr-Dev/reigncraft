/**
 * Maps item weight onto the ground-pickup channel duration band.
 *
 * @module components/world/inventory/domains/computingWorldPlazaGroundItemPickupDurationMs
 */

import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MAX_MS,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemWeightConstants';

/**
 * Linear map from weight to pickup channel ms (0.5s lightest … 10s heaviest).
 */
export function computingWorldPlazaGroundItemPickupDurationMs(
  weight: number
): number {
  const clampedWeight = Math.min(
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX,
    Math.max(DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN, weight)
  );
  const weightSpan =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX -
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN;
  const t =
    (clampedWeight - DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN) /
    weightSpan;
  const durationSpan =
    DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MAX_MS -
    DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS;

  return Math.round(
    DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_DURATION_MIN_MS + t * durationSpan
  );
}
