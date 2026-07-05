import { applyingWorldPlazaEntityHealthBleedStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthBleedStack';
import { applyingWorldPlazaEntityHealthPoisonStack } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPoisonStack';
import { applyingWorldPlazaEntityHealthPotentialDamage } from '@/components/world/health/domains/applyingWorldPlazaEntityHealthPotentialDamage';
import { listingWorldPlazaEntityStatusEffectHudRows } from '@/components/world/health/domains/listingWorldPlazaEntityStatusEffectHudRows';
import {
  addingWorldPlazaEntityHealthShield,
  addingWorldPlazaEntityHealthTemporaryMax,
  creatingWorldPlazaEntityHealthInitialState,
  settingWorldPlazaEntityHealthInvincible,
} from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('listingWorldPlazaEntityStatusEffectHudRows', () => {
  it('lists stacked debuff and buff rows with damage, amount, or time values', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();

    state = applyingWorldPlazaEntityHealthBleedStack(
      state,
      'bleeding',
      40,
      nowMs
    );
    state = applyingWorldPlazaEntityHealthPoisonStack(
      state,
      'toxic',
      50,
      nowMs
    );
    state = addingWorldPlazaEntityHealthShield(state, 25);
    state = settingWorldPlazaEntityHealthInvincible(state, 8_000, nowMs);
    state = addingWorldPlazaEntityHealthTemporaryMax(state, 100, 15_000, nowMs);

    const rows = listingWorldPlazaEntityStatusEffectHudRows({ state, nowMs });

    expect(rows.map((row) => row.id)).toEqual([
      'bleed',
      'poison',
      'shield',
      'invincibility',
      'temp-max-health',
    ]);
    expect(rows.find((row) => row.id === 'bleed')?.displayMode).toBe('damage');
    expect(rows.find((row) => row.id === 'poison')?.numericValue).toBe(50);
    expect(rows.find((row) => row.id === 'shield')?.numericValue).toBe(25);
    expect(rows.find((row) => row.id === 'invincibility')?.displayMode).toBe(
      'time'
    );
    expect(rows.find((row) => row.id === 'temp-max-health')?.numericValue).toBe(
      100
    );
  });

  it('lists potential damage rows with timed_damage display mode', () => {
    const nowMs = 1_000;
    const state = applyingWorldPlazaEntityHealthPotentialDamage({
      state: creatingWorldPlazaEntityHealthInitialState(),
      pendingExpectedDamage: 25,
      resolveDelayMs: 5_000,
      nowMs,
    });

    const rows = listingWorldPlazaEntityStatusEffectHudRows({ state, nowMs });
    const potentialRow = rows.find((row) => row.id.startsWith('potential-'));

    expect(potentialRow?.displayMode).toBe('timed_damage');
    expect(potentialRow?.numericValue).toBe(25);
    expect(potentialRow?.expiresAtMs).toBe(6_000);
    expect(potentialRow?.icon).toBe('mdi:flash');
  });
});
