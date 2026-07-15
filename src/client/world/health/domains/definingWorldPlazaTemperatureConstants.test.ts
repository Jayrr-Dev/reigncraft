import assert from 'node:assert/strict';
import { describe, it } from 'vitest';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  computingWorldPlazaCampfireAdjacentTemperatureCelsius,
  computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount,
} from './definingWorldPlazaTemperatureConstants';

describe('computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount', () => {
  it('keeps lit campfire heat at comfort high regardless of wood', () => {
    const zeroWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(0);
    const oneWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(1);
    const threeWood =
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(3);

    assert.equal(
      zeroWood,
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS
    );
    assert.equal(oneWood, DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS);
    assert.equal(threeWood, oneWood);
  });

  it('caps campfire heat at comfort high', () => {
    assert.equal(
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(99),
      DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS
    );
    assert.equal(
      DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_MAX_CELSIUS,
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS
    );
  });

  it('keeps the one-block ring at comfort high', () => {
    assert.equal(
      computingWorldPlazaCampfireAdjacentTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_CAMPFIRE_CELSIUS
      ),
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS
    );
  });
});
