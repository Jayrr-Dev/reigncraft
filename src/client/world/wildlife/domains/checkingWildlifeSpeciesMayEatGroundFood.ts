/**
 * Diet-based eligibility for wildlife ground-food foraging.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesMayEatGroundFood
 */

import { resolvingWorldPlazaInventoryFoodDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemFood';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** Returns true when the ground item type is a meat food (raw or cooked). */
export function checkingWildlifeGroundFoodItemTypeIsMeat(
  itemTypeId: string
): boolean {
  return (
    resolvingWorldPlazaInventoryFoodDefinition(itemTypeId)?.meatKind !==
    undefined
  );
}

/** Returns true when a species may eat one stack of the given ground food. */
export function checkingWildlifeSpeciesMayEatGroundFood(
  species: DefiningWildlifeSpeciesDefinition,
  itemTypeId: string
): boolean {
  const foodDefinition = resolvingWorldPlazaInventoryFoodDefinition(itemTypeId);

  if (!foodDefinition) {
    return false;
  }

  if (species.diet === 'herbivore') {
    return foodDefinition.meatKind === undefined;
  }

  if (species.diet === 'carnivore') {
    return foodDefinition.meatKind !== undefined;
  }

  return true;
}
