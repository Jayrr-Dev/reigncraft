import {
  computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier,
  resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity,
} from '@/components/world/health/domains/computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier';
import {
  DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
  DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier', () => {
  it('returns full speed above freezing', () => {
    expect(
      computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(12)
    ).toBe(1);
    expect(
      computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(
        DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS
      )
    ).toBe(1);
  });

  it('returns zero speed at absolute zero', () => {
    expect(
      computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(
        DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS
      )
    ).toBe(0);
  });

  it('scales linearly between freezing and absolute zero', () => {
    const midpointCelsius =
      (DEFINING_WORLD_PLAZA_TEMPERATURE_FROST_MOVEMENT_FULL_SPEED_CELSIUS +
        DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS) /
      2;

    expect(
      computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(
        midpointCelsius
      )
    ).toBeCloseTo(0.5, 5);
  });

  it('returns full speed when temperature is unknown', () => {
    expect(
      computingWorldPlazaEnvironmentalFrostMovementSpeedMultiplier(null)
    ).toBe(1);
  });
});

describe('resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity', () => {
  it('ignores frost slow when cold immune', () => {
    expect(
      resolvingWorldPlazaEnvironmentalFrostMovementSpeedMultiplierForEntity({
        localTemperatureCelsius:
          DEFINING_WORLD_PLAZA_TEMPERATURE_ABSOLUTE_ZERO_CELSIUS,
        temperatureResistance: {
          ...DEFINING_WORLD_PLAZA_ENTITY_TEMPERATURE_RESISTANCE_DEFAULT,
          isColdImmune: true,
        },
      })
    ).toBe(1);
  });
});
