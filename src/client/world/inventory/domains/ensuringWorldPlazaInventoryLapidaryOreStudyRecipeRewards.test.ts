import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { countingWorldPlazaInventoryItemTypeQuantity } from '@/components/world/crafting/domains/countingWorldPlazaInventoryItemTypeQuantity';
import {
  DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID,
  resolvingWorldPlazaCraftRecipePageItemTypeId,
} from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { computingWorldPlazaLapidaryTotalOreStudyCount } from '@/components/world/domains/computingWorldPlazaLapidaryTotalOreStudyCount';
import {
  DEFINING_WORLD_PLAZA_LAPIDARY_ANVIL_RECIPE_REWARD_ORE_SIGHTED_TOTAL,
  DEFINING_WORLD_PLAZA_LAPIDARY_BESSEMER_FORGE_RECIPE_REWARD_ORE_STUDY_TOTAL,
  DEFINING_WORLD_PLAZA_LAPIDARY_BLOOMERY_RECIPE_REWARD_ORE_STUDY_TOTAL,
  DEFINING_WORLD_PLAZA_LAPIDARY_CLAY_KILN_RECIPE_REWARD_ORE_STUDY_TOTAL,
} from '@/components/world/domains/definingWorldPlazaLapidaryOreStudyRecipeRewardRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards } from '@/components/world/inventory/domains/ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards';
import { describe, expect, it } from 'vitest';
import type { WorldOreSpeciesId } from '../../../../shared/worldOreRarity';

function creatingEmptyInventoryState(): DefiningInventoryState {
  return {
    capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
    slots: Array.from(
      { length: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY },
      () => null
    ),
  };
}

const FIVE_SIGHTED_ORES = [
  'iron',
  'copper',
  'silver',
  'scarlet',
  'gold',
] as const satisfies readonly WorldOreSpeciesId[];

describe('computingWorldPlazaLapidaryTotalOreStudyCount', () => {
  it('sums finite study counts across species', () => {
    expect(
      computingWorldPlazaLapidaryTotalOreStudyCount({
        iron: 20,
        copper: 30,
      })
    ).toBe(50);
  });
});

describe('ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards', () => {
  const anvilPageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL
  );
  const bloomeryPageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY
  );
  const clayKilnPageTypeId = resolvingWorldPlazaCraftRecipePageItemTypeId(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN
  );

  it('grants Anvil after 5 distinct ore species are sighted', () => {
    const below = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedOreSpeciesIds: FIVE_SIGHTED_ORES.slice(
          0,
          DEFINING_WORLD_PLAZA_LAPIDARY_ANVIL_RECIPE_REWARD_ORE_SIGHTED_TOTAL -
            1
        ),
        oreStudyCountsBySpeciesId: {},
      }
    );
    expect(below.grantedRecipeIds).toEqual([]);

    const atThreshold =
      ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
        creatingEmptyInventoryState(),
        {
          sightedOreSpeciesIds: FIVE_SIGHTED_ORES,
          oreStudyCountsBySpeciesId: {},
        }
      );

    expect(atThreshold.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.ANVIL,
    ]);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atThreshold.state,
        anvilPageTypeId
      )
    ).toBe(1);
  });

  it('grants nothing for Study rewards below Bloomery threshold', () => {
    const result = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedOreSpeciesIds: [],
        oreStudyCountsBySpeciesId: {
          iron:
            DEFINING_WORLD_PLAZA_LAPIDARY_BLOOMERY_RECIPE_REWARD_ORE_STUDY_TOTAL -
            1,
        },
      }
    );

    expect(result.grantedRecipeIds).toEqual([]);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        result.state,
        bloomeryPageTypeId
      )
    ).toBe(0);
  });

  it('grants Bloomery at 50 and Clay Kiln at 200 Study', () => {
    const atBloomery = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedOreSpeciesIds: [],
        oreStudyCountsBySpeciesId: {
          iron: DEFINING_WORLD_PLAZA_LAPIDARY_BLOOMERY_RECIPE_REWARD_ORE_STUDY_TOTAL,
        },
      }
    );

    expect(atBloomery.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
    ]);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atBloomery.state,
        bloomeryPageTypeId
      )
    ).toBe(1);
    expect(
      countingWorldPlazaInventoryItemTypeQuantity(
        atBloomery.state,
        clayKilnPageTypeId
      )
    ).toBe(0);

    const atKiln = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      atBloomery.state,
      {
        sightedOreSpeciesIds: [],
        oreStudyCountsBySpeciesId: {
          iron: DEFINING_WORLD_PLAZA_LAPIDARY_CLAY_KILN_RECIPE_REWARD_ORE_STUDY_TOTAL,
        },
      }
    );

    expect(atKiln.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
    ]);
  });

  it('grants Study pages together when Study already exceeds 200', () => {
    const result = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedOreSpeciesIds: [],
        oreStudyCountsBySpeciesId: {
          iron: DEFINING_WORLD_PLAZA_LAPIDARY_CLAY_KILN_RECIPE_REWARD_ORE_STUDY_TOTAL,
        },
      }
    );

    expect(result.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
    ]);
  });

  it('grants Bessemer Forge at 500 Study', () => {
    const result = ensuringWorldPlazaInventoryLapidaryOreStudyRecipeRewards(
      creatingEmptyInventoryState(),
      {
        sightedOreSpeciesIds: [],
        oreStudyCountsBySpeciesId: {
          iron: DEFINING_WORLD_PLAZA_LAPIDARY_BESSEMER_FORGE_RECIPE_REWARD_ORE_STUDY_TOTAL,
        },
      }
    );

    expect(result.grantedRecipeIds).toEqual([
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BLOOMERY,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.CLAY_KILN,
      DEFINING_WORLD_PLAZA_CRAFT_MODE_RECIPE_ID.BESSEMER_FORGE,
    ]);
  });
});
