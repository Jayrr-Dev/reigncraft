import {
  computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond,
  computingWorldPlazaTemperatureDamagePerSecond,
} from '@/components/world/health/domains/computingWorldPlazaTemperatureDamagePerSecond';
import { convertingWorldPlazaCelsiusToFahrenheit } from '@/components/world/health/domains/convertingWorldPlazaTemperatureUnits';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX } from '@/components/world/health/domains/definingWorldPlazaEntityHealthConstants';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { applyingWorldPlazaEntityTemperatureResistanceToDamagePerSecond } from '@/components/world/health/domains/resolvingWorldPlazaEntityTemperatureResistanceMultiplier';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaTemperatureDamagePerSecond', () => {
  it('deals no damage inside the comfort band', () => {
    const sample = computingWorldPlazaTemperatureDamagePerSecond(20);

    expect(sample.exposureKind).toBeNull();
    expect(sample.damagePerSecond).toBe(0);
    expect(sample.maxHealthPercentPerSecond).toBe(0);
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
    expect(hotter.maxHealthPercentPerSecond).toBeGreaterThan(
      warm.maxHealthPercentPerSecond
    );
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
    expect(freezing.maxHealthPercentPerSecond).toBeGreaterThan(
      chilly.maxHealthPercentPerSecond
    );
  });

  it('ramps max-health percent loss with lava temperature', () => {
    const lava = computingWorldPlazaTemperatureDamagePerSecond(
      DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
    );
    const heatExcess =
      DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS -
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS;

    expect(lava.exposureKind).toBe('heat');
    expect(lava.damagePerSecond).toBeCloseTo(heatExcess * 0.35, 5);
    expect(lava.maxHealthPercentPerSecond).toBeCloseTo(heatExcess * 0.00005, 8);

    const totalDamage =
      computingWorldPlazaEnvironmentalTemperatureTotalDamagePerSecond(
        lava.damagePerSecond,
        lava.maxHealthPercentPerSecond,
        DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BASE_MAX
      );

    expect(totalDamage).toBeGreaterThan(lava.damagePerSecond);
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
