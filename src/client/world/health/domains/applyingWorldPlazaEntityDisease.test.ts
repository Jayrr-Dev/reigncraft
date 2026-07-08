import {
  advancingWorldPlazaEntityHealthDiseaseTick,
  applyingWorldPlazaEntityDisease,
  checkingWorldPlazaEntityDiseaseIsIncubating,
  checkingWorldPlazaEntityDiseaseIsSymptomatic,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import {
  listingWorldPlazaEntityDiseaseDescriptors,
  resolvingWorldPlazaEntityDiseaseDescriptor,
} from '@/components/world/health/domains/definingWorldPlazaEntityDiseaseRegistry';
import { computingWorldPlazaInGameDaysToRealMs } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityDisease', () => {
  const nowMs = 1_000_000;
  const trichinellosis = resolvingWorldPlazaEntityDiseaseDescriptor(
    'trichinellosis'
  );

  it('queues all grants during incubation without applying symptoms', () => {
    const nextState = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs
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
      nowMs
    );

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      nowMs + trichinellosis.incubationMs
    );

    expect(state.movementModifiers.length).toBeGreaterThan(0);
    expect(state.diseaseEffects[0]?.pendingGrants).toHaveLength(1);
    expect(
      checkingWorldPlazaEntityDiseaseIsSymptomatic(
        state,
        nowMs + trichinellosis.incubationMs
      )
    ).toBe(true);
  });

  it('fires delayed grants on disease tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs
    );

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      nowMs +
        trichinellosis.incubationMs +
        trichinellosis.grants[1]!.delayMs
    );

    expect(state.poisonEffects.length).toBeGreaterThan(0);
    expect(state.diseaseEffects[0]?.pendingGrants).toHaveLength(0);
  });

  it('removes expired diseases on tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs
    );
    const salmonellosis =
      resolvingWorldPlazaEntityDiseaseDescriptor('salmonellosis');

    state = advancingWorldPlazaEntityHealthDiseaseTick(
      state,
      nowMs + salmonellosis.incubationMs + salmonellosis.durationMs + 1
    );

    expect(state.diseaseEffects).toHaveLength(0);
  });

  it('caps illness duration at one in-game week', () => {
    for (const descriptor of listingWorldPlazaEntityDiseaseDescriptors()) {
      expect(descriptor.durationMs).toBeLessThanOrEqual(
        computingWorldPlazaInGameDaysToRealMs(7)
      );
    }
  });
});
