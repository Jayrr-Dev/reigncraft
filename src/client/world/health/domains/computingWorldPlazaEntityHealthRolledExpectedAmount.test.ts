import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { computingWorldPlazaEntityHealthRolledExpectedAmount } from '@/components/world/health/domains/computingWorldPlazaEntityHealthRolledExpectedAmount';
import { describe, expect, it } from 'vitest';

function creatingSeededRandom(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index] ?? 0.5;
    index += 1;
    return value;
  };
}

describe('computingWorldPlazaEntityHealthRolledExpectedAmount', () => {
  it('rolls beneficial amounts around the expected value', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const nowMs = 0;

    const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
      state,
      baseExpectedAmount: 10,
      nowMs,
      random: creatingSeededRandom([0.01, 0.01]),
    });

    expect(rollResult.expectedDamage).toBe(10);
    expect(rollResult.rolledDamage).toBeGreaterThan(10);
    expect(['critical', 'lethal', 'fatal']).toContain(rollResult.tier);
  });

  it('honours lock-in attacker modifiers for exact beneficial amounts', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const nowMs = 0;

    const rollResult = computingWorldPlazaEntityHealthRolledExpectedAmount({
      state,
      baseExpectedAmount: 25,
      attackerModifiers: [
        {
          id: 'test-lock-in',
          kind: 'lock_in',
          value: 1,
          expiresAtMs: null,
        },
      ],
      nowMs,
    });

    expect(rollResult.rolledDamage).toBe(25);
    expect(rollResult.tier).toBe('true_strike');
  });
});
