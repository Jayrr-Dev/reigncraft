import { applyingWorldPlazaEntityBuff } from '@/components/world/health/domains/applyingWorldPlazaEntityBuff';
import { applyingWorldPlazaEntityDisease } from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier } from '@/components/world/health/domains/resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance';
import { applyingWorldPlazaInventoryFlowerEatEffects } from '@/components/world/inventory/domains/applyingWorldPlazaInventoryFlowerEatEffects';
import { DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE } from '@/components/world/inventory/domains/definingWorldPlazaFlowerEatEffectTunables';
import { DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID } from '@/components/world/inventory/domains/definingWorldPlazaFlowerPetalSicknessConstants';
import { DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaFlowerRawDiseaseRegistry';
import {
  resettingWorldPlazaFlowerPetalConsumptionStoreForTests,
  seedingWorldPlazaFlowerPetalConsumptionForTests,
} from '@/components/world/inventory/domains/managingWorldPlazaFlowerPetalConsumptionStore';
import { beforeEach, describe, expect, it } from 'vitest';

/** Force the outer effect-proc gate open in unit tests. */
const FORCE_EFFECT_PROC_ROLL = 0;

/** Never proc Petal Sickness in species-effect tests. */
const NEVER_PETAL_SICKNESS_ROLL = 1;

/** Never proc flower diseases in species-effect tests. */
const NEVER_DISEASE_ROLLS = Object.fromEntries(
  DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY.map((entry) => [
    entry.diseaseId,
    1,
  ])
) as Record<
  (typeof DEFINING_WORLD_PLAZA_FLOWER_RAW_DISEASE_REGISTRY)[number]['diseaseId'],
  number
>;

describe('applyingWorldPlazaInventoryFlowerEatEffects', () => {
  const nowMs = 1_000_000;

  beforeEach(() => {
    resettingWorldPlazaFlowerPetalConsumptionStoreForTests();
  });

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
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.didProcEffect).toBe(true);
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
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
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
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.nextHealthState.confusionEffects).toHaveLength(0);
    expect(result.nextHealthState.sleepEffects).toHaveLength(0);
  });

  it('applies chamomile sleep when not confused', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'chamomile',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.nextHealthState.sleepEffects).toHaveLength(1);
    expect(
      result.nextHealthState.sleepEffects[0]?.passiveHealPercentOfMaxTotal
    ).toBe(0.01);
    expect(result.nextHealthState.sleepEffects[0]?.canWakeFromDamage).toBe(
      false
    );
    expect(result.nextHealthState.sleepEffects[0]?.expiresAtMs).toBe(
      nowMs + 10_000
    );
  });

  it('shortens echinacea disease when diseased', () => {
    const worldEpochMs = nowMs;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityDisease(
      state,
      'salmonellosis',
      worldEpochMs,
      () => 0.5,
      { forceContract: true },
      nowMs
    );

    const beforeExpires = state.diseaseEffects[0]?.expiresAtMs ?? 0;

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'echinacea',
      healthState: state,
      nowMs,
      worldEpochMs,
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.nextHealthState.diseaseEffects[0]?.expiresAtMs).toBeLessThan(
      beforeExpires
    );
  });

  it('applies echinacea infection resist when healthy', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'echinacea',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(
      resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier(
        result.nextHealthState,
        nowMs
      )
    ).toBeLessThan(1);
  });

  it('applies calendula heal and mending', () => {
    const damaged = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 400,
    };

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'calendula',
      healthState: damaged,
      nowMs,
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.nextHealthState.currentHealth).toBeGreaterThan(
      damaged.currentHealth
    );
    expect(
      result.nextHealthState.outgoingHealAmplifiers.some(
        (amplifier) => amplifier.id === 'mending-buff'
      )
    ).toBe(true);
  });

  it('applies peppermint cold tolerance', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'peppermint',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      effectProcRoll: FORCE_EFFECT_PROC_ROLL,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(
      result.nextHealthState.timedTemperatureModifiers.some((modifier) =>
        modifier.id.startsWith('flower-cold-tolerance:')
      )
    ).toBe(true);
  });

  it('skips species effect when proc roll misses', () => {
    const damaged = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 400,
    };

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: damaged,
      nowMs,
      effectProcRoll: DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.didProcEffect).toBe(false);
    expect(result.effectProcChance).toBe(
      DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE
    );
    expect(result.nextHealthState.currentHealth).toBe(damaged.currentHealth);
  });

  it('accepts brewed preparation for a higher proc chance', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      preparation: 'brewed',
      effectProcRoll: 0.5,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.didProcEffect).toBe(true);
    expect(result.effectProcChance).toBeGreaterThan(
      DEFINING_WORLD_PLAZA_FLOWER_RAW_EAT_EFFECT_PROC_CHANCE
    );
  });

  it('does not roll petal sickness before 10 petals eaten', () => {
    seedingWorldPlazaFlowerPetalConsumptionForTests(nowMs, 8);

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      worldEpochMs: nowMs,
      effectProcRoll: 1,
      petalSicknessRoll: 0,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.didApplyPetalSickness).toBe(false);
    expect(result.nextHealthState.confusionEffects).toHaveLength(0);
  });

  it('applies petal sickness with confusion, stamina drain, and poison', () => {
    seedingWorldPlazaFlowerPetalConsumptionForTests(nowMs, 9);

    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      worldEpochMs: nowMs,
      effectProcRoll: 1,
      petalSicknessRoll: 0,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    expect(result.didApplyPetalSickness).toBe(true);
    expect(
      result.nextHealthState.confusionEffects.some(
        (effect) =>
          effect.id === DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID
      )
    ).toBe(true);
    expect(
      result.nextHealthState.movementModifiers.some(
        (modifier) =>
          modifier.id === 'petal-sickness-stamina-debuff' &&
          modifier.kind === 'stamina_drain'
      )
    ).toBe(true);
    expect(result.nextHealthState.poisonEffects.length).toBeGreaterThan(0);
  });

  it('stacks petal sickness duration on repeat procs', () => {
    seedingWorldPlazaFlowerPetalConsumptionForTests(nowMs, 9);

    const first = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      worldEpochMs: nowMs,
      effectProcRoll: 1,
      petalSicknessRoll: 0,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    const firstExpires =
      first.nextHealthState.confusionEffects.find(
        (effect) =>
          effect.id === DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID
      )?.expiresAtMs ?? 0;

    const second = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: first.nextHealthState,
      nowMs: nowMs + 1_000,
      worldEpochMs: nowMs + 1_000,
      effectProcRoll: 1,
      petalSicknessRoll: 0,
      diseaseRollsById: NEVER_DISEASE_ROLLS,
    });

    const secondExpires =
      second.nextHealthState.confusionEffects.find(
        (effect) =>
          effect.id === DEFINING_WORLD_PLAZA_FLOWER_PETAL_SICKNESS_DEBUFF_ID
      )?.expiresAtMs ?? 0;

    expect(secondExpires).toBe(firstExpires + 60_000);
  });

  it('contracts pollen fever from a raw flower disease roll', () => {
    const result = applyingWorldPlazaInventoryFlowerEatEffects({
      speciesId: 'yarrow',
      healthState: creatingWorldPlazaEntityHealthInitialState(),
      nowMs,
      worldEpochMs: nowMs,
      effectProcRoll: 1,
      petalSicknessRoll: NEVER_PETAL_SICKNESS_ROLL,
      diseaseRollsById: {
        ...NEVER_DISEASE_ROLLS,
        'pollen-fever': 0,
      },
    });

    expect(result.didRollDisease).toBe(true);
    expect(
      result.nextHealthState.diseaseEffects.some(
        (effect) => effect.diseaseId === 'pollen-fever'
      )
    ).toBe(true);
  });
});
