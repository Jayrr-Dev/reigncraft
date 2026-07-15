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

  it('procs temperature impulse for polar-bear when rolls succeed', () => {
    let rollIndex = 0;
    const rolls = [0, 0, 0];

    const procs = resolvingWildlifeSpeciesOnHitPlayerProcs(
      'polar-bear',
      200,
      () => rolls[rollIndex++] ?? 1
    );

    expect(procs).toContainEqual({
      kind: 'temperature',
      deltaCelsius: -18,
    });
  });

  it('procs temperature impulse for sunhead when rolls succeed', () => {
    let rollIndex = 0;
    const rolls = [0, 0, 0];

    const procs = resolvingWildlifeSpeciesOnHitPlayerProcs(
      'sunhead',
      200,
      () => rolls[rollIndex++] ?? 1
    );

    expect(procs).toContainEqual({
      kind: 'temperature',
      deltaCelsius: 300,
    });
  });
});
