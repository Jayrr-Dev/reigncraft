import { DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { checkingWorldPlazaHeldLuckyBuffIsActive } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';

/**
 * Multiplier for food buff proc chances while the lucky charm is held.
 */
export function resolvingWorldPlazaPlayerHeldLuckyFoodBuffChanceMultiplier(): number {
  if (!checkingWorldPlazaHeldLuckyBuffIsActive()) {
    return 1;
  }

  return DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER;
}
