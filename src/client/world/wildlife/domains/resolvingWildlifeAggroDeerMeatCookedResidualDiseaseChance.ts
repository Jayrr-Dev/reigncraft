/**
 * Resolves cooked deer disease odds, including the hidden aggro-deer penalty.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance
 */

import { checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata } from '@/components/world/wildlife/domains/checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata';
import { DEFINING_WILDLIFE_AGGRO_DEER_MEAT_COOKED_DISEASE_CHANCE } from '@/components/world/wildlife/domains/definingWildlifeAggroDeerMeatConstants';

/** Applies the hidden cooked-disease boost when meat metadata is tagged. */
export function resolvingWildlifeAggroDeerMeatCookedResidualDiseaseChance(
  baseResidualChance: number,
  foodItemMetadata: Readonly<Record<string, unknown>> | undefined
): number {
  if (
    !checkingWorldPlazaInventoryItemHasAggroDeerMeatMetadata(foodItemMetadata)
  ) {
    return baseResidualChance;
  }

  return DEFINING_WILDLIFE_AGGRO_DEER_MEAT_COOKED_DISEASE_CHANCE;
}
