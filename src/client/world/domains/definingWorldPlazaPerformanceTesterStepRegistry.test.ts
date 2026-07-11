import { describe, expect, it } from 'vitest';

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY,
  checkingWorldPlazaPerformanceTesterStepIdIsKnown,
  gettingWorldPlazaPerformanceTesterStepById,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';

describe('definingWorldPlazaPerformanceTesterStepRegistry', () => {
  it('uses unique step ids', () => {
    const stepIds = DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.map(
      (step) => step.id
    );

    expect(new Set(stepIds).size).toBe(stepIds.length);
  });

  it('covers the planned suite ids in registry order', () => {
    expect(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.map(
        (step) => step.id
      )
    ).toEqual(Object.values(DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP));
  });

  it('recognizes known step ids', () => {
    expect(
      checkingWorldPlazaPerformanceTesterStepIdIsKnown('procedural-off')
    ).toBe(true);
    expect(checkingWorldPlazaPerformanceTesterStepIdIsKnown('nope')).toBe(
      false
    );
  });

  it('returns one step definition by id', () => {
    const step = gettingWorldPlazaPerformanceTesterStepById(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP.WALK_PROMPT
    );

    expect(step.promptWalk).toBe(true);
    expect(step.sampleMs).toBeGreaterThan(0);
  });
});
