import {
  advancingWorldPlazaEntityHealthDiseaseTick,
  applyingWorldPlazaEntityDisease,
} from '@/components/world/health/domains/applyingWorldPlazaEntityDisease';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityDisease', () => {
  const nowMs = 1_000_000;

  it('applies immediate grants and queues delayed grants', () => {
    const nextState = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs
    );

    expect(nextState.diseaseEffects).toHaveLength(1);
    expect(nextState.diseaseEffects[0]?.pendingGrants).toHaveLength(1);
    expect(nextState.movementModifiers.length).toBeGreaterThan(0);
    expect(nextState.poisonEffects).toHaveLength(0);
  });

  it('fires delayed grants on disease tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'trichinellosis',
      nowMs
    );

    state = advancingWorldPlazaEntityHealthDiseaseTick(state, nowMs + 45_000);

    expect(state.poisonEffects.length).toBeGreaterThan(0);
    expect(state.diseaseEffects[0]?.pendingGrants).toHaveLength(0);
  });

  it('removes expired diseases on tick', () => {
    let state = applyingWorldPlazaEntityDisease(
      creatingWorldPlazaEntityHealthInitialState(),
      'salmonellosis',
      nowMs
    );

    state = advancingWorldPlazaEntityHealthDiseaseTick(state, nowMs + 91_000);

    expect(state.diseaseEffects).toHaveLength(0);
  });
});
