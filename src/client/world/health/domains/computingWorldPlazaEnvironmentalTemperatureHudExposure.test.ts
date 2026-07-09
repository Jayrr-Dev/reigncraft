import { applyingWorldPlazaEntityFrostbiteStack } from '@/components/world/health/domains/applyingWorldPlazaEntityFrostbiteStack';
import { computingWorldPlazaEnvironmentalTemperatureHudExposure } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalTemperatureHudExposure';
import { formattingWorldPlazaEntityStatusEffectHudDisplayValue } from '@/components/world/health/domains/formattingWorldPlazaEntityStatusEffectHudDisplayValue';
import { listingWorldPlazaEntityStatusEffectHudRows } from '@/components/world/health/domains/listingWorldPlazaEntityStatusEffectHudRows';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEnvironmentalTemperatureHudExposure', () => {
  it('returns no exposure inside the comfort band', () => {
    expect(
      computingWorldPlazaEnvironmentalTemperatureHudExposure(
        20,
        creatingWorldPlazaEntityHealthInitialState().temperatureResistance
      )
    ).toBeNull();
  });

  it('returns resisted heat damage per second above the heat threshold', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      60,
      state.temperatureResistance,
      state
    );

    expect(exposure?.damageKind).toBe('environmental_heat');
    // 10°C excess → 3.5 flat + 0.05% max HP/s (0.5 on 1000 max)
    expect(exposure?.damagePerSecond).toBeCloseTo(4, 5);
  });

  it('returns resisted cold damage per second below the cold threshold', () => {
    const state = creatingWorldPlazaEntityHealthInitialState();
    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      -30,
      state.temperatureResistance,
      state
    );

    expect(exposure?.damageKind).toBe('environmental_cold');
    // 20°C deficit → 6 flat + 0.08% max HP/s (0.8 on 1000 max)
    expect(exposure?.damagePerSecond).toBeCloseTo(6.8, 5);
  });

  it('adds frostnip percent max HP to the cold damage per second badge', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityFrostbiteStack({
      state,
      stackCount: 200,
      nowMs,
    }).state;

    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      -30,
      state.temperatureResistance,
      state,
      nowMs
    );

    expect(exposure?.damageKind).toBe('environmental_cold');
    // 6.8 ambient + 20% max HP (200 stacks) on 1000 max = 26.8/s
    expect(exposure?.damagePerSecond).toBeCloseTo(26.8, 5);
  });

  it('triples cold badge dps at frostbite stage', () => {
    const nowMs = 0;
    let state = creatingWorldPlazaEntityHealthInitialState();
    state = applyingWorldPlazaEntityFrostbiteStack({
      state,
      stackCount: 750,
      nowMs,
    }).state;

    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      -30,
      state.temperatureResistance,
      state,
      nowMs
    );

    expect(exposure?.damageKind).toBe('environmental_cold');
    // (6.8 + 75% max HP) * 3 = 245.4/s
    expect(exposure?.damagePerSecond).toBeCloseTo(245.4, 5);
  });
});

describe('listingWorldPlazaEntityStatusEffectHudRows temperature exposure', () => {
  it('lists a per-second temperature row when exposure is active', () => {
    const rows = listingWorldPlazaEntityStatusEffectHudRows({
      state: creatingWorldPlazaEntityHealthInitialState(),
      nowMs: 0,
      environmentalTemperatureExposure: {
        damageKind: 'environmental_heat',
        damagePerSecond: 4.2,
      },
    });

    const temperatureRow = rows.find(
      (row) => row.id === 'temperature-environmental_heat'
    );

    expect(temperatureRow?.displayMode).toBe('damage_per_second');
    expect(temperatureRow?.numericValue).toBeCloseTo(4.2, 5);
    expect(
      formattingWorldPlazaEntityStatusEffectHudDisplayValue({
        displayMode: 'damage_per_second',
        numericValue: 4.2,
      })
    ).toBe('4.2/s');
  });
});
