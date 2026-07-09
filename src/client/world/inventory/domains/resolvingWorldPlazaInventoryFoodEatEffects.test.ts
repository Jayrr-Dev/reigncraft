import { checkingWorldPlazaEntityBuffIsActive } from '@/components/world/health/domains/checkingWorldPlazaEntityBuffIsActive';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaInventoryFoodEatEffects } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryFoodEatEffects';
import { DEFINING_WILDLIFE_MEAT_CATALOG } from '@/components/world/wildlife/domains/definingWildlifeMeatRegistry';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaInventoryFoodEatEffects', () => {
  const nowMs = 1_000_000;
  const boarEntry = DEFINING_WILDLIFE_MEAT_CATALOG.find(
    (entry) => entry.speciesId === 'boar'
  );

  if (!boarEntry) {
    throw new Error('Expected boar meat catalog entry');
  }

  it('rolls raw disease for wildlife meat', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.rawItemTypeId,
        hungerRestoreRatio: boarEntry.rawHungerRestoreRatio,
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

  it('rolls cooked well-fed buff without disease', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
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

  it('leaves cooked meat hunger restore unchanged when healthy', () => {
    const result = resolvingWorldPlazaInventoryFoodEatEffects({
      foodDefinition: {
        itemTypeId: boarEntry.cookedItemTypeId,
        hungerRestoreRatio: boarEntry.cookedHungerRestoreRatio,
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
});
