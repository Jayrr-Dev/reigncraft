import {
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MIN,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';

/**
 * Rolls default durability lost for one successful tool use (inclusive min..max).
 */
export function computingWorldPlazaInventoryDurabilityWearPerUse(
  random: () => number = Math.random
): number {
  const min =
    DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MIN;
  const max =
    DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_DEFAULT_WEAR_PER_USE_MAX;
  const span = max - min + 1;
  const roll = Math.min(0.999999, Math.max(0, random()));

  return min + Math.floor(roll * span);
}
