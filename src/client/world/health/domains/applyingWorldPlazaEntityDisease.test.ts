import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import {
  advancingWorldPlazaEntityHealthDiseaseTick,
  applyingWorldPlazaEntityDisease,
  checkingWorldPlazaEntityDiseaseIsIncubating,
  checkingWorldPlazaEntityDiseaseIsSymptomatic,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { rollingWorldPlazaEntityDiseaseBellCurveDurationMs } from '@/components/world/health/domains/computingWorldPlazaEntityDiseaseBellCurveDurationMs';
import { computingWorldPlazaEntityImmuneSystemDurationMultiplier } from '@/components/world/health/domains/computingWorldPlazaEntityImmuneSystemEffects';
import {
  listingWorldPlazaEntityDiseaseDescriptors,
  resolvingWorldPlazaEntityDiseaseDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityImmuneSystemConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

/** Box-Muller uniforms that sample z=0 for each bell-curve roll. */
function creatingWorldPlazaEntityDiseaseMeanBellCurveRandom(): () => number {
  const uniformValues = [Math.exp(-0.5), 0.25, Math.exp(-0.5), 0.25];
  let index = 0;

  return () => uniformValues[index++ % uniformValues.length]!;
}

describe('applyingWorldPlazaEntityDisease', () => {
  const nowMs = 1_000_000;
  const trichinellosis =
    resolvingWorldPlazaEntityDiseaseDescriptor('trichinellosis');
  const meanBellCurveRandom =
    creatingWorldPlazaEntityDiseaseMeanBellCurveRandom();

  it('queues all grants during incubation without applying symptoms', () => {
    const nextState = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );

    expect(nextState.diseaseEffects).toHaveLength(1);
    expect(nextState.diseaseEffects[0]?.pendingGrants).toHaveLength(2);
    expect(nextState.movementModifiers).toHaveLength(0);
    expect(nextState.poisonEffects).toHaveLength(0);
    expect(
      checkingWorldPlazaEntityDiseaseIsIncubating(
        nextState.diseaseEffects[0]!,
        nowMs
      )
    ).toBe(true);
    expect(checkingWorldPlazaEntityDiseaseIsSymptomatic(nextState, nowMs)).toBe(
      false
    );
  });

  it('fires staged grants after incubation ends', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );
    const rolledIncubationMs =
      state.diseaseEffects[0]!.symptomsStartAtMs - nowMs;

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      nowMs + rolledIncubationMs
    );

    expect(state.movementModifiers.length).toBeGreaterThan(0);
    expect(state.diseaseEffects[0]?.pendingGrants).toHaveLength(1);
    expect(
      checkingWorldPlazaEntityDiseaseIsSymptomatic(
        state,
        nowMs + rolledIncubationMs
      )
    ).toBe(true);
  });

  it('stamps fired grant effects on the simulation clock, not wall epoch', () => {
    const worldEpochMs = 1_700_000_000_000;
    const simulationNowMs = 12_345;
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      worldEpochMs,
      meanBellCurveRandom,
      {},
      simulationNowMs
    );
    const symptomsStartAtMs = state.diseaseEffects[0]!.symptomsStartAtMs;

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      symptomsStartAtMs,
      Math.random,
      simulationNowMs
    );

    expect(state.movementModifiers.length).toBeGreaterThan(0);
    for (const modifier of state.movementModifiers) {
      expect(modifier.expiresAtMs).toBeGreaterThan(simulationNowMs);
      expect(modifier.expiresAtMs).toBeLessThan(worldEpochMs);
    }
  });

  it('fires delayed grants on disease tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );
    const rolledIncubationMs =
      state.diseaseEffects[0]!.symptomsStartAtMs - nowMs;

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      nowMs + rolledIncubationMs + trichinellosis.grants[1]!.delayMs
    );

    expect(state.poisonEffects.length).toBeGreaterThan(0);
    expect(state.diseaseEffects[0]?.pendingGrants).toHaveLength(0);
  });

  it('removes expired diseases on tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs,
      meanBellCurveRandom
    );
    const diseaseEffect = state.diseaseEffects[0]!;

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      diseaseEffect.expiresAtMs + 1,
      () => 1
    );

    expect(state.diseaseEffects).toHaveLength(0);
    expect(state.immuneSystemFactor).toBeGreaterThan(0);
  });

  it('clears disease-scoped confusion when mad cow expires', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'mad-cow',
      nowMs,
      meanBellCurveRandom
    );
    const diseaseEffect = state.diseaseEffects[0]!;

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      diseaseEffect.symptomsStartAtMs,
      meanBellCurveRandom,
      diseaseEffect.symptomsStartAtMs
    );

    expect(state.confusionEffects.length).toBeGreaterThan(0);
    expect(
      state.confusionEffects.every((effect) =>
        effect.id.startsWith(`disease-grant:${diseaseEffect.id}:`)
      )
    ).toBe(true);

    // Shorten illness so grant timers would still be active after expiry.
    state = {
      ...state,
      diseaseEffects: [
        {
          ...diseaseEffect,
          expiresAtMs: diseaseEffect.symptomsStartAtMs + 1,
          pendingGrants: [],
        },
      ],
    };

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      diseaseEffect.symptomsStartAtMs + 2,
      () => 1,
      diseaseEffect.symptomsStartAtMs + 2
    );

    expect(state.diseaseEffects).toHaveLength(0);
    expect(state.confusionEffects).toHaveLength(0);
  });

  it('clears orphaned disease-scoped confusion left after disease already ended', () => {
    const orphanedState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      diseaseEffects: [],
      confusionEffects: [
        {
          id: 'disease-grant:disease-instance-stale:1:confusion',
          targetIntensity: 65,
          appliedAtMs: nowMs,
          expiresAtMs: nowMs + computingWorldPlazaInGameDaysToRealMs(4),
          phaseSeed: 1.7,
        },
      ],
    };

    const nextState = advancingWorldPlazaEntityHealthDiseaseTick(
      orphanedState,
      nowMs,
      () => 1
    );

    expect(nextState.confusionEffects).toHaveLength(0);
  });

  it('blocks contraction when the player already has per-disease immunity', () => {
    const immuneState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      diseaseImmunityIds: ['trichinellosis'] as const,
    };

    const nextState = applyingWorldPlazaEntityDisease(
      immuneState,
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );

    expect(nextState.diseaseEffects).toHaveLength(0);
  });

  it('force-contracts through immunity and compresses the full term by durationScale', () => {
    const immuneState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      diseaseImmunityIds: ['trichinellosis'] as const,
    };
    const baselineState = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );
    const previewState = applyingWorldPlazaEntityDisease(
      immuneState,
      'trichinellosis',
      nowMs,
      meanBellCurveRandom,
      {
        forceContract: true,
        durationScale: 1 / 5,
      }
    );
    const baselineDuration =
      baselineState.diseaseEffects[0]!.expiresAtMs -
      baselineState.diseaseEffects[0]!.contractedAtMs;
    const previewDuration =
      previewState.diseaseEffects[0]!.expiresAtMs -
      previewState.diseaseEffects[0]!.contractedAtMs;

    expect(previewState.diseaseEffects).toHaveLength(1);
    expect(previewState.diseaseImmunityIds).not.toContain('trichinellosis');
    expect(previewDuration).toBe(Math.round(baselineDuration / 5));
    expect(previewState.diseaseEffects[0]?.durationMultiplier).toBe(
      baselineState.diseaseEffects[0]!.durationMultiplier / 5
    );
  });

  it('shortens disease timelines when immune system factor is high', () => {
    const strongImmuneState = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      immuneSystemFactor: DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX,
    };
    const baselineState = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );
    const shortenedState = applyingWorldPlazaEntityDisease(
      strongImmuneState,
      'trichinellosis',
      nowMs,
      meanBellCurveRandom
    );
    const baselineDuration =
      baselineState.diseaseEffects[0]!.expiresAtMs -
      baselineState.diseaseEffects[0]!.contractedAtMs;
    const shortenedDuration =
      shortenedState.diseaseEffects[0]!.expiresAtMs -
      shortenedState.diseaseEffects[0]!.contractedAtMs;
    const expectedMultiplier =
      computingWorldPlazaEntityImmuneSystemDurationMultiplier(
        DEFINING_WORLD_PLAZA_ENTITY_IMMUNE_SYSTEM_FACTOR_MAX
      );

    expect(shortenedDuration).toBeLessThan(baselineDuration);
    expect(shortenedState.diseaseEffects[0]?.durationMultiplier).toBe(
      expectedMultiplier
    );
  });

  it('rolls incubation and illness duration from bell curves', () => {
    const shortIncubationMs = rollingWorldPlazaEntityDiseaseBellCurveDurationMs(
      {
        meanMs: trichinellosis.incubationMs,
        kind: 'incubation',
        standardNormalSample: -2,
      }
    );
    const longIncubationMs = rollingWorldPlazaEntityDiseaseBellCurveDurationMs({
      meanMs: trichinellosis.incubationMs,
      kind: 'incubation',
      standardNormalSample: 2,
    });

    expect(shortIncubationMs).toBeLessThan(trichinellosis.incubationMs);
    expect(longIncubationMs).toBeGreaterThan(trichinellosis.incubationMs);
  });

  it('caps illness duration at one in-game week', () => {
    for (const descriptor of listingWorldPlazaEntityDiseaseDescriptors()) {
      expect(descriptor.durationMs).toBeLessThanOrEqual(
        computingWorldPlazaInGameDaysToRealMs(7)
      );
    }
  });
});
