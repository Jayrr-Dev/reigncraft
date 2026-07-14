import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER } from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { registeringWorldPlazaHeldLuckyBuffBridge } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';
import { resolvingWorldPlazaInventoryFoodEatEffects } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects';
import { resolvingWorldPlazaInventoryFoodHealDeclaration } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodHealDeclaration';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { afterEach, describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryFoodEatEffects', () => {
  const nowMs = 1_000_000;
  const boarEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
    (entry) => entry.speciesId === 'boar'
  );

  if (!boarEntry) {
    throw new Error('Expected boar meat catalog entry');
  }

  afterEach(() => {
    registeringWorldPlazaHeldLuckyBuffBridge(false);
  });

  const rawBoarHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
    hungerRestoreRatio: boarEntry.rawHungerRestoreRatio,
    meatKind: 'raw',
  });
  const cookedBoarHeal = resolvingWorldPlazaInventoryFoodHealDeclaration({
    hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
    meatKind: 'cooked',
  });

  it('rolls raw disease for wildlife meat', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.rawItemTypeId,
        hungerRestoreRatio: boarEntry.rawHungerRestoreRatio,
        healthHeal: rawBoarHeal,
        meatKind: 'raw',
        rawDiseaseId: boarEntry.rawDiseaseId,
        rawDiseaseChance: boarEntry.rawDiseaseChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 0,
    });

    expect(result.didRollDisease).toBe(true);
    expect(result.nextHealthState.diseaseEffects).toHaveLength(1);
    expect(result.effectiveHungerRestoreRatio).toBeLessThan(
      boarEntry.rawHungerRestoreRatio
    );
  });

  it('heals health from cooked meat and half as much from raw', () => {
    const damaged = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 400,
    };

    const cooked = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
        healthHeal: cookedBoarHeal,
        meatKind: 'cooked',
        cookedWellFedBuffId: boarEntry.cookedWellFedBuffId,
        cookedWellFedChance: boarEntry.cookedWellFedChance,
      },
      healthState: damaged,
      nowMs,
      sicknessRoll: 1,
      wellFedRoll: 1,
    });

    const raw = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.rawItemTypeId,
        hungerRestoreRatio: boarEntry.rawHungerRestoreRatio,
        healthHeal: rawBoarHeal,
        meatKind: 'raw',
        rawDiseaseId: boarEntry.rawDiseaseId,
        rawDiseaseChance: 0,
      },
      healthState: damaged,
      nowMs,
      sicknessRoll: 1,
    });

    expect(cooked.healthHealAmount).toBeGreaterThan(0);
    expect(cooked.nextHealthState.currentHealth).toBe(
      damaged.currentHealth + cooked.healthHealAmount
    );
    expect(raw.healthHealAmount).toBeGreaterThan(0);
    expect(raw.healthHealAmount).toBeLessThan(cooked.healthHealAmount);
  });

  it('rolls cooked well-fed buff without disease', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
        healthHeal: cookedBoarHeal,
        meatKind: 'cooked',
        cookedWellFedBuffId: boarEntry.cookedWellFedBuffId,
        cookedWellFedChance: boarEntry.cookedWellFedChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
      wellFedRoll: 0,
    });

    expect(result.didRollWellFedBuff).toBe(true);
    expect(result.didRollDisease).toBe(false);
    expect(
      checkingWorldPlazaEntityBuffIsActive({
        buffId: boarEntry.cookedWellFedBuffId,
        state: result.nextHealthState,
        nowMs,
        defenderModifierIds: [],
        attackerModifierIds: [],
      })
    ).toBe(true);
  });

  it('boosts cooked well-fed chance while lucky charm is held', () => {
    const baseChance = boarEntry.cookedWellFedChance;
    const borderlineRoll =
      (baseChance +
        Math.min(
          1,
          baseChance * DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER
        )) /
      2;

    expect(borderlineRoll).toBeGreaterThanOrEqual(baseChance);
    expect(borderlineRoll).toBeLessThan(
      Math.min(
        1,
        baseChance * DEFINING_WORLD_PLAZA_LUCKY_FOOD_BUFF_CHANCE_MULTIPLIER
      )
    );

    const withoutLucky = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
        healthHeal: cookedBoarHeal,
        meatKind: 'cooked',
        cookedWellFedBuffId: boarEntry.cookedWellFedBuffId,
        cookedWellFedChance: baseChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
      wellFedRoll: borderlineRoll,
    });

    registeringWorldPlazaHeldLuckyBuffBridge(true);

    const withLucky = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
        healthHeal: cookedBoarHeal,
        meatKind: 'cooked',
        cookedWellFedBuffId: boarEntry.cookedWellFedBuffId,
        cookedWellFedChance: baseChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
      wellFedRoll: borderlineRoll,
    });

    expect(withoutLucky.didRollWellFedBuff).toBe(false);
    expect(withLucky.didRollWellFedBuff).toBe(true);
  });

  it('leaves cooked meat hunger restore unchanged when healthy', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
        healthHeal: cookedBoarHeal,
        meatKind: 'cooked',
        cookedWellFedBuffId: boarEntry.cookedWellFedBuffId,
        cookedWellFedChance: boarEntry.cookedWellFedChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
      wellFedRoll: 1,
    });

    expect(result.effectiveHungerRestoreRatio).toBe(
      boarEntry.cookedHungerRestoreRatio
    );
    expect(result.nextHealthState.diseaseEffects).toHaveLength(0);
  });

  it('rolls higher cooked disease odds for aggro-deer meat metadata', () => {
    const deerEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
      (entry) => entry.speciesId === 'deer'
    );

    if (!deerEntry) {
      throw new Error('Expected deer meat catalog entry');
    }

    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: deerEntry.cookedItemTypeId,
        hungerRestoreRatio: deerEntry.cookedHungerRestoreRatio,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: deerEntry.cookedHungerRestoreRatio,
          meatKind: 'cooked',
        }),
        meatKind: 'cooked',
        cookedWellFedBuffId: deerEntry.cookedWellFedBuffId,
        cookedWellFedChance: deerEntry.cookedWellFedChance,
        cookedResidualDiseaseId: deerEntry.cookedResidualDiseaseId,
        cookedResidualDiseaseChance: deerEntry.cookedResidualDiseaseChance,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 0.1,
      wellFedRoll: 1,
      foodItemMetadata: { aggroDeerKill: true },
    });

    expect(result.didRollDisease).toBe(true);
    expect(result.nextHealthState.diseaseEffects).toHaveLength(1);
  });

  it('falls back to legacy poison for generic raw food without disease profile', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: 'generic-raw-meat',
        hungerRestoreRatio: 0.2,
        healthHeal: resolvingWorldPlazaInventoryFoodHealDeclaration({
          hungerRestoreRatio: 0.2,
          meatKind: 'raw',
        }),
        meatKind: 'raw',
        rawPoisonFlatEv: 10,
        rawPoisonDurationMs: 60_000,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 1,
    });

    expect(result.nextHealthState.damageOverTimeEffects).toHaveLength(1);
    expect(result.nextHealthState.damageOverTimeEffects[0]?.kind).toBe('toxic');
  });

  it('skips meat disease rolls for flower herbs', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: 'world-plaza-flower-yarrow',
        hungerRestoreRatio: 0,
        healthHeal: { baseFlat: 0, percentOfMax: 0 },
        meatKind: 'raw',
        rawDiseaseId: 'food-poisoning',
        rawDiseaseChance: 1,
      },
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      sicknessRoll: 0,
    });

    expect(result.didRollDisease).toBe(false);
    expect(result.nextHealthState.diseaseEffects).toHaveLength(0);
    expect(result.effectiveHungerRestoreRatio).toBe(0);
  });
});
