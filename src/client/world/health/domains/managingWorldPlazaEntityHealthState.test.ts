import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import {
  creatingWorldPlazaEntityHealthInitialState,
  doublingWorldPlazaEntityHealthMax,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('doublingWorldPlazaEntityHealthMax', () => {
  it('scales current health proportionally when max health doubles', () => {
    const nowMs = 1_000;
    const state = {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX * 0.5,
    };

    const doubled = doublingWorldPlazaEntityHealthMax(state, nowMs);

    expect(doubled.maxHealthScale).toBe(2);
    expect(doubled.currentHealth).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
    );
  });
});
