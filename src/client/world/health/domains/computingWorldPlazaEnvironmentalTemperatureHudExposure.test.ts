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
    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      60,
      creatingWorldPlazaEntityHealthInitialState().temperatureResistance
    );

    expect(exposure?.damageKind).toBe('environmental_heat');
    expect(exposure?.damagePerSecond).toBeCloseTo(3.5, 5);
  });

  it('returns resisted cold damage per second below the cold threshold', () => {
    const exposure = computingWorldPlazaEnvironmentalTemperatureHudExposure(
      -30,
      creatingWorldPlazaEntityHealthInitialState().temperatureResistance
    );

    expect(exposure?.damageKind).toBe('environmental_cold');
    expect(exposure?.damagePerSecond).toBeCloseTo(6, 5);
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
