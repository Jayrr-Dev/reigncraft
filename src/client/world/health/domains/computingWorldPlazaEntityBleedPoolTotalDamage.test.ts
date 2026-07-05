import { computingWorldPlazaEntityBleedPoolTotalDamage } from '@/components/world/health/domains/computingWorldPlazaEntityBleedPoolTotalDamage';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEntityBleedPoolTotalDamage', () => {
  it('sums rolled flat damage and rolled percent-of-max-health damage', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const nowMs = 0;

    const bleeding = computingWorldPlazaEntityBleedPoolTotalDamage({
      state,
      severity: 'bleeding',
      flatExpectedDamage: 10,
      nowMs,
      random: () => 0.5,
    });
    const hemorrhaging = computingWorldPlazaEntityBleedPoolTotalDamage({
      state,
      severity: 'hemorrhaging',
      flatExpectedDamage: 10,
      nowMs,
      random: () => 0.5,
    });
    const exsanguinating = computingWorldPlazaEntityBleedPoolTotalDamage({
      state,
      severity: 'exsanguinating',
      flatExpectedDamage: 10,
      nowMs,
      random: () => 0.5,
    });

    expect(bleeding.totalBleedDamage).toBe(
      bleeding.flatRolledDamage + bleeding.percentRolledDamage
    );
    expect(hemorrhaging.totalBleedDamage).toBe(
      hemorrhaging.flatRolledDamage + hemorrhaging.percentRolledDamage
    );
    expect(exsanguinating.totalBleedDamage).toBe(
      exsanguinating.flatRolledDamage + exsanguinating.percentRolledDamage
    );
    expect(bleeding.percentExpectedDamage).toBeCloseTo(100, 0);
    expect(hemorrhaging.percentExpectedDamage).toBeCloseTo(200, 0);
    expect(exsanguinating.percentExpectedDamage).toBeCloseTo(500, 0);
    expect(exsanguinating.totalBleedDamage).toBeGreaterThan(
      hemorrhaging.totalBleedDamage
    );
    expect(hemorrhaging.totalBleedDamage).toBeGreaterThan(
      bleeding.totalBleedDamage
    );
  });
});
