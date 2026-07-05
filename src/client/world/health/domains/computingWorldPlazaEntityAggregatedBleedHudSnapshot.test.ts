import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { computingWorldPlazaEntityAggregatedBleedHudSnapshot } from '@/components/world/health/domains/computingWorldPlazaEntityAggregatedBleedHudSnapshot';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityAggregatedBleedHudSnapshot', () => {
  it('sums remaining bleed damage across active tiers', () => {
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
      'hemorrhaging',
      40,
      nowMs + 1
    );

    const snapshot = computingWorldPlazaEntityAggregatedBleedHudSnapshot({
      state,
      nowMs: nowMs + 1,
    });

    expect(snapshot?.remainingBleedDamage).toBe(65);
    expect(snapshot?.icon).toBe('mdi:blood-bag');
    expect(snapshot?.summaryLabel).toContain('Bleeding x1');
    expect(snapshot?.summaryLabel).toContain('Hemorrhaging x1');
  });
});
