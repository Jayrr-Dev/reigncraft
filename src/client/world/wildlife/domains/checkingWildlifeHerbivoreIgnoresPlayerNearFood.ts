/**
 * Herbivore food bravery: skip proximity flee while edible food is in range.
 *
 * Favorites always hold. Other edibles only hold ~half the time, sticky per
 * animal + food id so the roll does not flicker every tick.
 *
 * @module components/world/wildlife/domains/checkingWildlifeHerbivoreIgnoresPlayerNearFood
 */

import { computingWildlifeInstanceSeedFraction } from '@/components/world/wildlife/domains/computingWildlifeInstanceSeedFraction';
import {
  DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_ENABLED,
  DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_SEED_SALT,
  DEFINING_WILDLIFE_HERBIVORE_NON_FAVORITE_FOOD_BRAVERY_CHANCE,
} from '@/components/world/wildlife/domains/definingWildlifeFavoriteFoodConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export type CheckingWildlifeHerbivoreIgnoresPlayerNearFoodParams = {
  species: DefiningWildlifeSpeciesDefinition;
  instanceId: string;
  selectedGroundFoodItemId: string | null;
  isFavoriteFood: boolean;
  /** Injectable `[0, 1)` roll for tests; defaults to instance+food seed. */
  braveryRollUnit?: number;
};

/**
 * True when a plant-eater should keep foraging instead of fleeing a sprinting
 * or jumping player (collision startle still flees).
 */
export function checkingWildlifeHerbivoreIgnoresPlayerNearFood({
  species,
  instanceId,
  selectedGroundFoodItemId,
  isFavoriteFood,
  braveryRollUnit,
}: CheckingWildlifeHerbivoreIgnoresPlayerNearFoodParams): boolean {
  if (!DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_ENABLED) {
    return false;
  }

  if (species.diet !== 'herbivore') {
    return false;
  }

  if (selectedGroundFoodItemId === null) {
    return false;
  }

  if (isFavoriteFood) {
    return true;
  }

  const roll =
    braveryRollUnit ??
    computingWildlifeInstanceSeedFraction(
      `${instanceId}:${selectedGroundFoodItemId}`,
      DEFINING_WILDLIFE_HERBIVORE_FOOD_BRAVERY_SEED_SALT
    );

  return roll < DEFINING_WILDLIFE_HERBIVORE_NON_FAVORITE_FOOD_BRAVERY_CHANCE;
}
