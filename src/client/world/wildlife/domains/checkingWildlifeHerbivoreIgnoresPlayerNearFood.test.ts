import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { checkingWildlifeHerbivoreIgnoresPlayerNearFood } from '@/components/world/wildlife/domains/checkingWildlifeHerbivoreIgnoresPlayerNearFood';
import { checkingWildlifeSpeciesFavoriteFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesFavoriteFood';
import { DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID } from '@/components/world/wildlife/domains/definingWildlifeFavoriteFoodConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeSpeciesFavoriteFood', () => {
  it('marks berries as deer favorites', () => {
    expect(
      checkingWildlifeSpeciesFavoriteFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_BERRY_RED
      )
    ).toBe(true);
  });

  it('marks long grass as cow favorites', () => {
    expect(
      checkingWildlifeSpeciesFavoriteFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.cow,
        DEFINING_WILDLIFE_GROUND_GRASS_FOOD_ITEM_TYPE_ID
      )
    ).toBe(true);
  });
});

describe('checkingWildlifeHerbivoreIgnoresPlayerNearFood', () => {
  it('always ignores the player for favorite food', () => {
    expect(
      checkingWildlifeHerbivoreIgnoresPlayerNearFood({
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        instanceId: 'wildlife:1:1:0',
        selectedGroundFoodItemId: 'wildlife-shrub:1,1',
        isFavoriteFood: true,
        braveryRollUnit: 0.99,
      })
    ).toBe(true);
  });

  it('ignores the player half the time for non-favorite food', () => {
    expect(
      checkingWildlifeHerbivoreIgnoresPlayerNearFood({
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        instanceId: 'wildlife:1:1:0',
        selectedGroundFoodItemId: 'wildlife-grass:1,1',
        isFavoriteFood: false,
        braveryRollUnit: 0.49,
      })
    ).toBe(true);

    expect(
      checkingWildlifeHerbivoreIgnoresPlayerNearFood({
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        instanceId: 'wildlife:1:1:0',
        selectedGroundFoodItemId: 'wildlife-grass:1,1',
        isFavoriteFood: false,
        braveryRollUnit: 0.5,
      })
    ).toBe(false);
  });

  it('does not apply food bravery to carnivores', () => {
    expect(
      checkingWildlifeHerbivoreIgnoresPlayerNearFood({
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        instanceId: 'wildlife:1:1:0',
        selectedGroundFoodItemId: 'wildlife-shrub:1,1',
        isFavoriteFood: true,
      })
    ).toBe(false);
  });
});
