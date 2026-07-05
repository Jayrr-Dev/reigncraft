import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import {
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT,
  DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT,
} from '@/components/world/health/domains/definingWorldPlazaEntityBleedStackConstants';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaEntityHealthBleedStack', () => {
  it('stacks bleed damage and increments stack count on the same severity', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'bleeding',
      25,
      nowMs
    );
    state = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'bleeding',
      15,
      nowMs + 1
    );

    expect(state.bleedEffects).toHaveLength(1);
    expect(state.bleedEffects[0]?.severity).toBe('bleeding');
    expect(state.bleedEffects[0]?.stackCount).toBe(2);
    expect(state.bleedEffects[0]?.remainingBleedDamage).toBe(40);
    expect(state.bleedEffects[0]?.totalBleedDamage).toBe(40);
  });

  it('escalates 10 bleeding stacks into hemorrhaging', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    for (let stackIndex = 0; stackIndex < 10; stackIndex += 1) {
      state = applyingWorldPlazaEntityHealthBleedStack(
        state,
        'bleeding',
        10,
        nowMs + stackIndex
      );
    }

    expect(state.bleedEffects.some((effect) => effect.severity === 'bleeding')).toBe(
      false
    );
    expect(state.bleedEffects).toHaveLength(1);
    expect(state.bleedEffects[0]?.severity).toBe('hemorrhaging');
    expect(state.bleedEffects[0]?.stackCount).toBe(1);
    expect(state.bleedEffects[0]?.remainingBleedDamage).toBe(100);
  });

  it('escalates 5 hemorrhaging stacks into exsanguinating', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    for (let stackIndex = 0; stackIndex < 5; stackIndex += 1) {
      state = applyingWorldPlazaEntityHealthBleedStack(
        state,
        'hemorrhaging',
        20,
        nowMs + stackIndex
      );
    }

    expect(
      state.bleedEffects.some((effect) => effect.severity === 'hemorrhaging')
    ).toBe(false);
    expect(state.bleedEffects).toHaveLength(1);
    expect(state.bleedEffects[0]?.severity).toBe('exsanguinating');
    expect(state.bleedEffects[0]?.stackCount).toBe(1);
    expect(state.bleedEffects[0]?.remainingBleedDamage).toBe(100);
  });

  it('uses the configured escalation thresholds', () => {
    expect(DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_BLEEDING_COUNT).toBe(
      10
    );
    expect(
      DEFINING_WORLD_PLAZA_ENTITY_BLEED_STACK_ESCALATION_HEMORRHAGING_COUNT
    ).toBe(5);
  });
});
