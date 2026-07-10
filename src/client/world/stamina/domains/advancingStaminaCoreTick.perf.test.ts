import { advancingStaminaCoreTick } from '@/components/world/stamina/domains/advancingStaminaCoreTick';
import { expectingPerformanceWithinBudget } from '@/components/world/testing/domains/measuringPerformanceBudget';
import { describe, it } from 'vitest';

const DEFINING_STAMINA_CORE_PERF_CONFIG = {
  drainPerSecond: 0.22,
  regenPerSecond: 0.15,
  runLockedExitRatio: 0.35,
  maxStaminaRatio: 1,
} as const;

const DEFINING_STAMINA_CORE_PERF_TICKS_PER_SAMPLE = 10_000;

describe('advancingStaminaCoreTick performance', () => {
  it('advances 10k ticks within budget', () => {
    expectingPerformanceWithinBudget(
      {
        name: 'advancingStaminaCoreTick×10000',
        warmupIterations: 5,
        sampleIterations: 40,
        medianBudgetMs: 5,
        percentile95BudgetMs: 12,
      },
      () => {
        let state = { staminaRatio: 1, isRunLocked: false };

        for (
          let tick = 0;
          tick < DEFINING_STAMINA_CORE_PERF_TICKS_PER_SAMPLE;
          tick += 1
        ) {
          const result = advancingStaminaCoreTick({
            state,
            wantsToRun: tick % 3 !== 0,
            deltaSeconds: 1 / 60,
            config: DEFINING_STAMINA_CORE_PERF_CONFIG,
          });
          state = result.state;
        }
      }
    );
  });
});
