import { DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { checkingWorldPlazaHeldLuckyBuffIsActive } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';

/**
 * Disease contraction multiplier while the lucky charm is held.
 */
export function resolvingWorldPlazaPlayerHeldLuckyDiseaseMultiplier(): number {
  if (!checkingWorldPlazaHeldLuckyBuffIsActive()) {
    return 1;
  }

  return DEFINING_WORLD_PLAZA_LUCKY_DISEASE_CONTRACTION_MULTIPLIER;
}
