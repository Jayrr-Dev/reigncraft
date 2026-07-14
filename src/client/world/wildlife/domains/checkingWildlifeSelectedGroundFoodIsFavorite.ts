/**
 * Whether the blackboard's selected forage target is a species favorite.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSelectedGroundFoodIsFavorite
 */

import { checkingWildlifeSpeciesFavoriteFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesFavoriteFood';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeGroundFoodItemTypeId } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodItemTypeId';

/** True when selected forage id matches the species favorite-food list. */
export function checkingWildlifeSelectedGroundFoodIsFavorite(
  species: DefiningWildlifeSpeciesDefinition,
  selectedGroundFoodItemId: string | null,
  nowMs: number
): boolean {
  if (!selectedGroundFoodItemId || !species.favoriteFoodItemTypeIds?.length) {
    return false;
  }

  const itemTypeId = resolvingWildlifeGroundFoodItemTypeId(
    selectedGroundFoodItemId,
    nowMs
  );

  if (!itemTypeId) {
    return false;
  }

  return checkingWildlifeSpeciesFavoriteFood(species, itemTypeId);
}
