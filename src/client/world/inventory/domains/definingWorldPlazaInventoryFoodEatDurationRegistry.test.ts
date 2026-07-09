import {
  DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES,
  DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_AGGRESSIVE_CHICKEN,
  DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_APPLE,
  DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BERRIES,
  resolvingWorldPlazaInventoryFoodEatDurationMs,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodEatDurationRegistry';
import {
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
  DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
} from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryFoodEatDurationMs', () => {
  it('uses forage durations for berries and apple', () => {
    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: 'world-plaza-berries',
      })
    ).toBe(DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_BERRIES);

    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: 'world-plaza-apple',
      })
    ).toBe(DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_APPLE);
  });

  it('uses species durations for wildlife meat', () => {
    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: 'world-plaza-raw-chicken-meat',
        wildlifeSpeciesId: 'chicken',
      })
    ).toBe(DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES.chicken);

    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: 'world-plaza-cooked-elephant-meat',
        wildlifeSpeciesId: 'elephant',
      })
    ).toBe(DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES.elephant);
  });

  it('keeps eat durations in the 1s–10s band', () => {
    for (const durationMs of Object.values(
      DEFINING_WILDLIFE_MEAT_EAT_DURATION_MS_BY_SPECIES
    )) {
      expect(durationMs).toBeGreaterThanOrEqual(1_000);
      expect(durationMs).toBeLessThanOrEqual(10_000);
    }
  });

  it('uses the aggressive chicken override', () => {
    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_RAW_MEAT_ITEM_TYPE_ID,
        wildlifeSpeciesId: 'chicken',
      })
    ).toBe(DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_AGGRESSIVE_CHICKEN);

    expect(
      resolvingWorldPlazaInventoryFoodEatDurationMs({
        itemTypeId:
          DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_COOKED_MEAT_ITEM_TYPE_ID,
        wildlifeSpeciesId: 'chicken',
      })
    ).toBe(DEFINING_WORLD_PLAZA_FOOD_EAT_DURATION_MS_AGGRESSIVE_CHICKEN);
  });
});
