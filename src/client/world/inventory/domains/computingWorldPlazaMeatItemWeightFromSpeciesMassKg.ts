/**
 * Maps wildlife species mass onto meat item pickup weight.
 *
 * @module components/world/inventory/domains/computingWorldPlazaMeatItemWeightFromSpeciesMassKg
 */

import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN,
  DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MAX_KG,
  DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MIN_KG,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemWeightConstants';

/**
 * Linear map from species mass (kg) to meat carry weight.
 */
export function computingWorldPlazaMeatItemWeightFromSpeciesMassKg(
  massKg: number
): number {
  const clampedMass = Math.min(
    DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MAX_KG,
    Math.max(DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MIN_KG, massKg)
  );
  const massSpan =
    DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MAX_KG -
    DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MIN_KG;
  const t =
    (clampedMass - DEFINING_WORLD_PLAZA_MEAT_PICKUP_WEIGHT_MASS_MIN_KG) /
    massSpan;
  const weightSpan =
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MAX -
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN;

  return (
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_WEIGHT_MIN + t * weightSpan
  );
}
