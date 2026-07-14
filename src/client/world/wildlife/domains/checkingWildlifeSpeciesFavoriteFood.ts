/**
 * Favorite-food membership for wildlife ground forage.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesFavoriteFood
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** True when this species drops other forage to rush this food item type. */
export function checkingWildlifeSpeciesFavoriteFood(
  species: DefiningWildlifeSpeciesDefinition,
  itemTypeId: string
): boolean {
  return species.favoriteFoodItemTypeIds?.includes(itemTypeId) ?? false;
}
