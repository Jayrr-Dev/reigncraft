import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import {
  DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID,
  resolvingWorldPlazaInventoryFoodEatEffects,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects';
import {
  DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS,
  DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV,
  DEFINING_WILDLIFE_RAW_MEAT_SICKNESS_CHANCE,
} from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { checkingWorldPlazaEntityMovementBuffIsActive } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryFoodEatEffects', () => {
  const nowMs = 1_000_000;

  it('applies poison DoT config for raw meat', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: 'world-plaza-raw-boar-meat',
        hungerRestoreRatio: 0.28,
        meatKind: 'raw',
        rawPoisonFlatEv: DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV,
        rawPoisonDurationMs: DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS,
        rawSicknessChance: 0,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
    });

    expect(result.nextHealthState.damageOverTimeEffects).toHaveLength(1);
    expect(result.nextHealthState.damageOverTimeEffects[0]?.kind).toBe(
      'poison'
    );
    expect(result.nextHealthState.damageOverTimeEffects[0]?.damagePerSecond).toBeCloseTo(
      DEFINING_WILDLIFE_RAW_MEAT_POISON_FLAT_EV /
        (DEFINING_WILDLIFE_RAW_MEAT_POISON_DURATION_MS / 1000)
    );
  });

  it('halves hunger restore while food sickness is active', () => {
    const sickResult = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: 'world-plaza-raw-boar-meat',
        hungerRestoreRatio: 0.28,
        meatKind: 'raw',
        rawPoisonFlatEv: 0,
        rawPoisonDurationMs: 0,
        rawSicknessChance: DEFINING_WILDLIFE_RAW_MEAT_SICKNESS_CHANCE,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 0,
    });

    expect(sickResult.effectiveHungerRestoreRatio).toBeCloseTo(0.14);
    expect(
      checkingWorldPlazaEntityMovementBuffIsActive(
        sickResult.nextHealthState,
        DEFINING_WORLD_PLAZA_FOOD_SICKNESS_DEBUFF_ID,
        nowMs
      )
    ).toBe(true);
  });

  it('leaves cooked meat hunger restore unchanged', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: 'world-plaza-cooked-boar-meat',
        hungerRestoreRatio: 0.55,
        meatKind: 'cooked',
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 0,
    });

    expect(result.effectiveHungerRestoreRatio).toBe(0.55);
    expect(result.nextHealthState.damageOverTimeEffects).toHaveLength(0);
  });
});
