import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import {
  DEFINING_WORLD_PLAZA_BESTIARY_BEAR_TRAP_RECIPE_REWARD_SIGHTED_TOTAL,
  DEFINING_WORLD_PLAZA_BESTIARY_CALTROPS_RECIPE_REWARD_SIGHTED_TOTAL,
} from '@/components/world/domains/definingWorldPlazaBestiarySightedRecipeRewardRegistry';
import { ensuringWorldPlazaInventoryBestiarySightedRecipeRewards } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryBestiarySightedRecipeRewards';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { describe, expect, it } from 'vitest';

function creatingEmptyInventoryState(): DefiningInventoryState {
  return {
    capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
    slots: Array.from(
      { length: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY },
      () => null
    ),
  };
}

describe('ensuringWorldPlazaInventoryBestiarySightedRecipeRewards', () => {
  const caltropsPageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS
  );
  const bearTrapPageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP
  );

  it('grants Caltrops at 16 sighted species', () => {
    const below = ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedSpeciesCount:
          DEFINING_WORLD_PLAZA_BESTIARY_CALTROPS_RECIPE_REWARD_SIGHTED_TOTAL - 1,
      }
    );
    expect(below.grantedRecipeIds).toEqual([]);

    const atThreshold = ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedSpeciesCount:
          DEFINING_WORLD_PLAZA_BESTIARY_CALTROPS_RECIPE_REWARD_SIGHTED_TOTAL,
      }
    );

    expect(atThreshold.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS,
    ]);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atThreshold.state,
        caltropsPageTypeId
      )
    ).toBe(1);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atThreshold.state,
        bearTrapPageTypeId
      )
    ).toBe(0);
  });

  it('grants Bear Trap at 48 sighted species', () => {
    const withCaltrops = ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedSpeciesCount:
          DEFINING_WORLD_PLAZA_BESTIARY_CALTROPS_RECIPE_REWARD_SIGHTED_TOTAL,
      }
    );
    const atBearTrap = ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
      withCaltrops.state,
      {
        sightedSpeciesCount:
          DEFINING_WORLD_PLAZA_BESTIARY_BEAR_TRAP_RECIPE_REWARD_SIGHTED_TOTAL,
      }
    );

    expect(atBearTrap.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP,
    ]);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atBearTrap.state,
        bearTrapPageTypeId
      )
    ).toBe(1);
  });

  it('grants both pages when sighted count already exceeds 48', () => {
    const result = ensuringWorldPlazaInventoryBestiarySightedRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedSpeciesCount:
          DEFINING_WORLD_PLAZA_BESTIARY_BEAR_TRAP_RECIPE_REWARD_SIGHTED_TOTAL,
      }
    );

    expect(result.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CALTROPS,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BEAR_TRAP,
    ]);
  });
});
