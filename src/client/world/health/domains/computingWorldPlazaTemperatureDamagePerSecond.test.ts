import { computingWorldPlazaTemperatureDamagePerSecond } from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { convertingWorldPlazaCelsiusToFahrenheit } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaTemperatureDamagePerSecond', () => {
  it('deals no damage inside the comfort band', () => {
    const sample = computingWorldPlazaTemperatureDamagePerSecond(20);

    expect(sample.exposureKind).toBeNull();
    expect(sample.damagePerSecond).toBe(0);
  });

  it('scales heat damage with hotter temperatures', () => {
    const warm = computingWorldPlazaTemperatureDamagePerSecond(
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + 10
    );
    const hotter = computingWorldPlazaTemperatureDamagePerSecond(
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + 30
    );

    expect(warm.exposureKind).toBe('heat');
    expect(hotter.exposureKind).toBe('heat');
    expect(hotter.damagePerSecond).toBeGreaterThan(warm.damagePerSecond);
  });

  it('scales cold damage with colder temperatures', () => {
    const chilly = computingWorldPlazaTemperatureDamagePerSecond(
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS - 8
    );
    const freezing = computingWorldPlazaTemperatureDamagePerSecond(
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS - 24
    );

    expect(chilly.exposureKind).toBe('cold');
    expect(freezing.exposureKind).toBe('cold');
    expect(freezing.damagePerSecond).toBeGreaterThan(chilly.damagePerSecond);
  });
});

describe('applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond', () => {
  it('reduces heat damage with resistance and blocks it with immunity', () => {
    const rawDamage = 10;
    const resisted =
      applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
        rawDamage,
        'heat',
        {
          heatResistance: 0.5,
          coldResistance: 0,
          isHeatImmune: false,
          isColdImmune: false,
        }
      );
    const immune =
      applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond(
        rawDamage,
        'heat',
        {
          heatResistance: 0,
          coldResistance: 0,
          isHeatImmune: true,
          isColdImmune: false,
        }
      );

    expect(resisted).toBe(5);
    expect(immune).toBe(0);
  });
});

describe('convertingWorldPlazaCelsiusToFahrenheit', () => {
  it('converts freezing and boiling reference points', () => {
    expect(convertingWorldPlazaCelsiusToFahrenheit(0)).toBeCloseTo(32, 5);
    expect(convertingWorldPlazaCelsiusToFahrenheit(100)).toBeCloseTo(212, 5);
  });
});
