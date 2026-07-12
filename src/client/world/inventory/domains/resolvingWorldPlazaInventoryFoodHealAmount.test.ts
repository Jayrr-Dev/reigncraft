import {
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_BASE_FLAT,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX,
  DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryFoodHealConstants';
import { resolvingWorldPlazaInventoryFoodHealAmount } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealAmount';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import { DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY } from '@/components/world/wildlife/domains/definingWildlifeMeatSizeMetadataConstants';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryFoodHealAmount', () => {
  const effectiveMaxHealth = 1000;
  const midTierHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
    hungerRestoreRatio:
      DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
    meatKind: 'cooked',
  });
  const midTierBaseline = Math.round(
    midTierHeal.baseFlat + effectiveMaxHealth * midTierHeal.percentOfMax
  );

  it('uses stamped flat + percent for mid hunger cooked food at average size', () => {
    expect(midTierHeal.baseFlat).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_BASE_FLAT
    );
    expect(midTierHeal.percentOfMax).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_PERCENT_OF_MAX
    );

    const healAmount = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: midTierHeal,
      effectiveMaxHealth,
    });

    expect(healAmount).toBe(midTierBaseline);
  });

  it('halves stamped heal for raw meat declarations', () => {
    const cookedHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
      hungerRestoreRatio:
        DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
      meatKind: 'cooked',
    });
    const rawHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
      hungerRestoreRatio:
        DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
      meatKind: 'raw',
    });

    expect(rawHeal.baseFlat).toBeCloseTo(cookedHeal.baseFlat * 0.5);
    expect(rawHeal.percentOfMax).toBeCloseTo(cookedHeal.percentOfMax * 0.5);
  });

  it('heals more for rarer high-hunger cuts and bigger kills', () => {
    const chickenHeal = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
        hungerRestoreRatio: 0.3,
        meatKind: 'cooked',
      }),
      effectiveMaxHealth,
      foodItemMetadata: { [DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY]: -1 },
    });
    const mammothHeal = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
        hungerRestoreRatio: 0.74,
        meatKind: 'cooked',
      }),
      effectiveMaxHealth,
      foodItemMetadata: { [DEFINING_WILDLIFE_MEAT_SIZE_TIER_METADATA_KEY]: 3 },
    });

    expect(mammothHeal).toBeGreaterThan(chickenHeal);
    expect(mammothHeal).toBeGreaterThan(midTierBaseline);
  });

  it('scales percent heal with the eater effective max health', () => {
    const healthHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
      hungerRestoreRatio:
        DEFINING_WORLD_PLAZA_INVENTORY_FOOD_HEAL_REFERENCE_HUNGER_RATIO,
      meatKind: 'cooked',
    });
    const atOneThousand = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal,
      effectiveMaxHealth: 1000,
    });
    const atTwoThousand = resolvingWorldPlazaInventoryFoodHealAmount({
      healthHeal,
      effectiveMaxHealth: 2000,
    });

    expect(atTwoThousand).toBeGreaterThan(atOneThousand);
  });
});
