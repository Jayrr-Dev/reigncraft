import { describe, expect, it } from 'vitest';

import { resolvingWildlifeSpeciesOnHitPlayerProcs } from '@/components/world/wildlife/domains/resolvingWildlifeSpeciesOnHitPlayerProcs';

describe('resolvingWildlifeSpeciesOnHitPlayerProcs', () => {
  it('returns no procs for prey species', () => {
    expect(
      resolvingWildlifeSpeciesOnHitPlayerProcs('deer', 100, () => 0)
    ).toEqual([]);
  });

  it('procs bleed and debuff for crocodile when rolls succeed', () => {
    let rollIndex = 0;
    const rolls = [0, 0, 0];

    const procs = resolvingWildlifeSpeciesOnHitPlayerProcs(
      'crocodile',
      280,
      () => rolls[rollIndex++] ?? 1
    );

    expect(procs).toEqual([
      {
        kind: 'bleed',
        severity: 'hemorrhaging',
        flatExpectedDamage: 112,
      },
      {
        kind: 'poison',
        potency: 'toxic',
        flatExpectedDamage: 56,
      },
      {
        kind: 'buff',
        buffId: 'heavy-legs-debuff',
      },
    ]);
  });

  it('skips effects when rolls fail', () => {
    expect(
      resolvingWildlifeSpeciesOnHitPlayerProcs('boar', 120, () => 0.99)
    ).toEqual([]);
  });
});
