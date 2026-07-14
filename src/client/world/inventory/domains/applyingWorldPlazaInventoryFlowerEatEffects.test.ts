import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { computingWorldPlazaEntityHealthEffectiveMax } from '@/components/world/health/domains/computingWorldPlazaEntityHealthEffectiveMax';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';
import { applyingWorldPlazaInventoryFlowerEatEffects } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryFlowerEatEffects';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaInventoryFlowerEatEffects', () => {
  const nowMs = 1_000_000;

  it('downgrades yarrow bleed one tier', () => {
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'exsanguinating',
      40,
      nowMs
    );

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: state,
      nowMs,
    });

    expect(
      result.nextHealthState.bleedEffects.some(
        (effect) => effect.severity === 'exsanguinating'
      )
    ).toBe(false);
    expect(
      result.nextHealthState.bleedEffects.some(
        (effect) => effect.severity === 'hemorrhaging'
      )
    ).toBe(true);
  });

  it('heals yarrow when no bleed is active', () => {
    const damaged = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 400,
    };

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: damaged,
      nowMs,
    });

    expect(result.nextHealthState.currentHealth).toBeGreaterThan(
      damaged.currentHealth
    );
  });

  it('clears chamomile confusion when active', () => {
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityBuff(state, 'confusion-debuff', nowMs);

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'chamomile',
      healthState: state,
      nowMs,
    });

    expect(result.nextHealthState.confusionEffects).toHaveLength(0);
    expect(result.nextHealthState.sleepEffects).toHaveLength(0);
  });

  it('applies chamomile sleep when not confused', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'chamomile',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
    });

    expect(result.nextHealthState.sleepEffects).toHaveLength(1);
    expect(
      result.nextHealthState.sleepEffects[0]?.passiveHealPercentOfMaxTotal
    ).toBe(0.01);
  });

  it('shortens echinacea disease when diseased', () => {
    const worldEpochMs = nowMs;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityDisease(
      state,
      'salmonellosis',
      worldEpochMs,
      () => 0,
      { forceContract: true },
      nowMs
    );
    const beforeExpiry = state.diseaseEffects[0]?.expiresAtMs ?? 0;

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'echinacea',
      healthState: state,
      nowMs,
      worldEpochMs,
    });

    const afterExpiry =
      result.nextHealthState.diseaseEffects[0]?.expiresAtMs ?? 0;
    expect(afterExpiry).toBeLessThan(beforeExpiry);
    expect(afterExpiry).toBeCloseTo(
      beforeExpiry - (beforeExpiry - worldEpochMs) * 0.4,
      0
    );
  });

  it('applies echinacea infection resist when healthy', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'echinacea',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
    });

    expect(
      resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier(
        result.nextHealthState,
        nowMs + 1
      )
    ).toBe(0.5);
  });

  it('foxglove heals on a good roll', () => {
    const damaged = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 200,
    };

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'foxglove',
      healthState: damaged,
      nowMs,
      foxgloveRoll: 0.1,
    });

    expect(result.nextHealthState.currentHealth).toBeGreaterThan(
      damaged.currentHealth
    );
    expect(result.nextHealthState.poisonEffects).toHaveLength(0);
  });

  it('foxglove poisons on a bad roll', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'foxglove',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      foxgloveRoll: 0.9,
    });

    expect(result.nextHealthState.poisonEffects.length).toBeGreaterThan(0);
  });

  it('belladonna poison pool is about 30% max hp', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const effectiveMax = computingWorldPlazaEntityHealthEffectiveMax(
      state,
      nowMs
    );

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'belladonna',
      healthState: state,
      nowMs,
    });

    const poisonPool = result.nextHealthState.poisonEffects.reduce(
      (sum, effect) => sum + effect.remainingPoisonDamage,
      0
    );

    expect(poisonPool).toBeCloseTo(effectiveMax * 0.3, 0);
  });
});
